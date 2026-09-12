import {useEffect,useRef,useState} from 'react';

export type Statistic = readonly [number|string,string];

export default function AnimatedStats({items}:{items:Statistic[]}){
 const strip=useRef<HTMLDListElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;let started=false;let finished=false;
  const finish=()=>{finished=true;cancelAnimationFrame(frame);setProgress(1)};
  const observer=new IntersectionObserver(entries=>{
   if(started||!entries.some(entry=>entry.isIntersecting))return;
   started=true;observer.disconnect();
   if(preference.matches){finish();return}
   const start=performance.now();
   const animate=(now:number)=>{if(finished)return;const elapsed=Math.min((now-start)/1600,1);setProgress(1-Math.pow(1-elapsed,3));if(elapsed<1)frame=requestAnimationFrame(animate);else finished=true};
   frame=requestAnimationFrame(animate);
  },{threshold:0.2});
  const onPreference=()=>{if(preference.matches)finish()};
  if(preference.matches)finish();else if(strip.current)observer.observe(strip.current);
  preference.addEventListener('change',onPreference);
  return()=>{finished=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',onPreference)};
 },[]);
 return <dl ref={strip} className="stats-strip animated-stats">{items.map(([value,label])=>{
  const numeric=parseFloat(String(value).replace(/,/g,''));
  const suffix=String(value).replace(/^[\d,.]+/,'');
  return <div className="stat-item" key={label}><dt>{label}</dt><dd><span className="stat-value-for-readers">{value}</span><span aria-hidden="true">{Math.floor(numeric*progress).toLocaleString('en-GB')}{suffix}</span></dd></div>;
 })}</dl>;
}
