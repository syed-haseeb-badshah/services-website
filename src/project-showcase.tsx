import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {serviceCategories} from './content';
import './project-showcase.css';

// Add each service's approved video URL here; its poster remains visible until hover.
export const showcaseMedia: {title:string;poster:string;alt:string;video?:string}[] = [
 {title:'Websites with a clear direction',poster:'/assets/interior.jpg',alt:'Architectural interior used for the Forma Studio website concept'},
 {title:'Stories through a different lens',poster:'/assets/studio.jpg',alt:'Sunlit creative space with artwork and natural details'},
 {title:'An identity with its own character',poster:'/assets/ceramics.jpg',alt:'Ceramic objects illustrating a considered brand direction'},
 {title:'Connected experiences, made simple',poster:'/assets/studio.jpg',alt:'Creative workspace illustrating the context for digital tools'},
];

function ServiceCard({index,duplicate=false}:{index:number;duplicate?:boolean}){
 const category=serviceCategories[index];
 const media=showcaseMedia[index];
 const card=useRef<HTMLElement>(null);
 const video=useRef<HTMLVideoElement>(null);
 const hovered=useRef(false);
 const [failed,setFailed]=useState(false);
 const [playing,setPlaying]=useState(false);
 const stop=()=>{hovered.current=false;const element=video.current;if(element){element.pause();if(element.readyState>0)element.currentTime=0}setPlaying(false)};
 const start=()=>{if(!media.video||failed||document.hidden)return;hovered.current=true;const element=video.current;if(!element)return;void element.play().then(()=>{if(!hovered.current||document.hidden){element.pause();if(element.readyState>0)element.currentTime=0;return}setPlaying(true)}).catch(()=>{setPlaying(false)})};
 useEffect(()=>{
  const visibility=()=>{if(document.hidden)stop()};
  const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop()});
  if(card.current)observer.observe(card.current);
  document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',stop);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',stop);hovered.current=false;video.current?.pause()};
 },[]);
 return <article ref={card} className="proud-card" aria-hidden={duplicate||undefined} onPointerEnter={event=>{if(event.pointerType==='mouse')start()}} onPointerLeave={stop} onPointerCancel={stop}>
  <div className="browser-frame" aria-hidden="true"><span/><span/><span/><i/></div>
  <div className={'proud-media proud-media-'+index}>
   <img src={media.poster} alt={media.alt} loading="lazy"/>
   {media.video&&!failed&&<video ref={video} src={media.video} poster={media.poster} muted loop playsInline preload="none" className={playing?'is-playing':''} aria-hidden="true" onError={()=>{stop();setFailed(true)}}/>}
  </div>
  <div className="proud-card-copy"><p className="proud-category">{category.title}</p><h3>{media.title}</h3><p className="proud-description">{category.description}</p><Link tabIndex={duplicate?-1:undefined} to={'/services?category='+category.slug}>Explore {index===0?'websites':index===1?'photo & video':index===2?'brand & content':'technology'} <span aria-hidden="true">↗</span></Link></div>
 </article>
}

export default function ProjectShowcase(){
 const track=useRef<HTMLDivElement>(null);
 const [hovering,setHovering]=useState(false);
 const [focused,setFocused]=useState(false);
 const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const stepSize=()=>{const el=track.current;const first=el?.firstElementChild as HTMLElement|null;return first?first.getBoundingClientRect().width+24:0};
 // The second copy follows the fourth card. Rebase only when both views are identical.
 const normalizeLoop=()=>{const el=track.current;const cycle=stepSize()*serviceCategories.length;if(el&&cycle&&el.scrollLeft>=cycle-.5)el.scrollTo({left:Math.max(0,el.scrollLeft-cycle),behavior:'instant'})};
 const move=(direction:number)=>{
  const el=track.current;const distance=stepSize();if(!el||!distance)return;
  const cycle=distance*serviceCategories.length;
  let position=el.scrollLeft;
  if(direction<0&&position<.5){position=cycle;el.scrollTo({left:position,behavior:'instant'})}
  el.scrollTo({left:position+direction*distance,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 useEffect(()=>{
  if(paused||hovering||focused)return;
  const timer=window.setInterval(()=>{const el=track.current;if(!el||document.hidden)return;const bounds=el.getBoundingClientRect();if(bounds.bottom<=0||bounds.top>=window.innerHeight)return;move(1)},10000);
  return()=>window.clearInterval(timer);
 },[paused,hovering,focused]);
 return <section className="proud-section section" aria-labelledby="proud-title"><div className="wrap">
  <header className="proud-heading"><h2 id="proud-title">Projects we’re proud of</h2><p>Four connected disciplines. Explore our creative direction across websites, visual storytelling, branding, and technology.</p></header>
  <div className="proud-carousel" onPointerEnter={()=>setHovering(true)} onPointerLeave={()=>setHovering(false)} onPointerCancel={()=>setHovering(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)}}><button className="proud-arrow proud-prev" type="button" aria-label="Previous service card" aria-controls="proud-track" onClick={()=>move(-1)}>‹</button><div ref={track} id="proud-track" className="proud-track" onScroll={normalizeLoop} tabIndex={0} role="region" aria-label="Service project previews">{[0,1].flatMap(copy=>serviceCategories.map((c,i)=><ServiceCard key={copy+c.slug} index={i} duplicate={copy===1}/>))}</div><button className="proud-arrow proud-next" type="button" aria-label="Next service card" aria-controls="proud-track" onClick={()=>move(1)}>›</button></div>
  <p className="proud-note">Illustrative concept previews across our four main services.</p><div className="proud-playback"><button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused} aria-controls="proud-track">{paused?'Resume slideshow':'Pause slideshow'}</button></div>
 </div></section>
}

