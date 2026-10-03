// Explicitly opened development harness; never loaded by the storefront.
const frame = document.getElementById('preview');
const report = document.getElementById('report');
let observers = [];
let latestLcp = null;
let shifts = [];
function capture() {
  const win = frame.contentWindow, doc = frame.contentDocument;
  if (!doc?.querySelector('main')) return;
  const nav = win.performance.getEntriesByType('navigation')[0];
  const visible = el => el.getClientRects().length && win.getComputedStyle(el).visibility !== 'hidden';
  const name = el => el.getAttribute('aria-label') || el.getAttribute('title') || [...(el.labels || [])].map(label=>label.textContent).join(' ') || el.textContent.trim() || (el.tagName === 'INPUT' && ['submit','button'].includes(el.type) ? el.value : '');
  let sessionStart = 0, previous = 0, sum = 0, cls = 0;
  for (const shift of shifts) {
    if (shift.hadRecentInput) continue;
    if (shift.startTime - previous > 1000 || shift.startTime - sessionStart > 5000) { sessionStart = shift.startTime; sum = 0; }
    sum += shift.value; previous = shift.startTime; cls = Math.max(cls, sum);
  }
  const resources = win.performance.getEntriesByType('resource');
  report.textContent = JSON.stringify({
    capturedAt: new Date().toISOString(),
    viewport: {width:win.innerWidth,height:win.innerHeight},
    route: win.location.hash || '#home',
    navigationMs: nav ? {domContentLoaded:Math.round(nav.domContentLoadedEventEnd),load:Math.round(nav.loadEventEnd)} : null,
    paints: win.performance.getEntriesByType('paint').map(entry=>({name:entry.name,ms:Math.round(entry.startTime)})),
    observedLcpMs: latestLcp === null ? null : Math.round(latestLcp),
    observedCls: win.PerformanceObserver?.supportedEntryTypes.includes('layout-shift') ? Number(cls.toFixed(4)) : null,
    note: 'Embedded-frame LCP/CLS observations are partial and affected by frame visibility; INP and field data are not measured. Cross-origin resource sizes may be unavailable.',
    resources: {count:resources.length,reportedTransferBytes:resources.reduce((total,entry)=>total+entry.transferSize,0)},
    checks: {
      horizontalOverflow: doc.documentElement.scrollWidth > win.innerWidth,
      unnamedVisibleControls: [...doc.querySelectorAll('button,input:not([type=hidden]),select,textarea')].filter(visible).filter(el=>!name(el)).map(el=>({tag:el.tagName,id:el.id})),
      visibleImagesWithoutAlt: [...doc.images].filter(visible).filter(el=>!el.hasAttribute('alt')).map(el=>el.src),
      visibleBrokenImages: [...doc.images].filter(visible).filter(el=>el.complete&&!el.naturalWidth).map(el=>el.src)
    }
  }, null, 2);
}
frame.addEventListener('load',()=>{
  observers.forEach(observer=>observer.disconnect()); observers=[]; latestLcp=null; shifts=[];
  const win=frame.contentWindow;
  for (const type of ['largest-contentful-paint','layout-shift']) {
    if (!win.PerformanceObserver?.supportedEntryTypes.includes(type)) continue;
    const observer=new win.PerformanceObserver(list=>{
      for (const entry of list.getEntries()) {
        if(type==='largest-contentful-paint') latestLcp=entry.startTime;
        else shifts.push({startTime:entry.startTime,value:entry.value,hadRecentInput:entry.hadRecentInput});
      }
      capture();
    });
    observer.observe({type,buffered:true}); observers.push(observer);
  }
  capture();
});
document.getElementById('load').addEventListener('click',()=>{
  frame.width=document.getElementById('width').value;
  frame.src='../index.html?diagnosticRun='+Date.now()+'#home';
});
document.getElementById('capture').addEventListener('click',capture);
if (['127.0.0.1','localhost','[::1]'].includes(location.hostname)) document.getElementById('load').click();
else {
  document.getElementById('load').disabled=true;
  document.getElementById('capture').disabled=true;
  report.textContent='Run this diagnostics page on localhost.';
}
