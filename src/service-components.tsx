import {useEffect,useRef,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {brand,serviceCategories,services,projectsForService} from './content';

export function SiteNavigation(){
 const [mobile,setMobile]=useState(false);
 const [expanded,setExpanded]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const toggle=useRef<HTMLButtonElement>(null);
 const menuToggle=useRef<HTMLButtonElement>(null);
 const location=useLocation();
 const cancel=()=>clearTimeout(timer.current);
 const close=()=>{cancel();setExpanded(false)};
 useEffect(()=>{setMobile(false);setExpanded(false);return ()=>clearTimeout(timer.current)},[location]);
 return <header className="site-header centered-header" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();if(expanded){close();toggle.current?.focus()}else{setMobile(false);menuToggle.current?.focus()}}}}>
  <Link className="logo" to="/" aria-label={`${brand.name} home`}><img className="wordmark" src={brand.wordmark} alt={brand.name}/></Link>
  <button ref={menuToggle} className="menu-toggle" aria-expanded={mobile} aria-controls="navigation" onClick={()=>{setMobile(!mobile);close()}}>{mobile?'Close ✕':'Menu ☰'}</button>
  <nav id="navigation" className={mobile?'open':''} aria-label="Main navigation">
   <NavLink to="/" end>Home</NavLink>
   <div className="services-nav" onPointerEnter={e=>{if(e.pointerType==='mouse'&&window.matchMedia('(min-width: 901px)').matches){cancel();setExpanded(true)}}} onPointerLeave={e=>{if(e.pointerType==='mouse'&&!e.currentTarget.contains(document.activeElement)){cancel();timer.current=setTimeout(()=>setExpanded(false),180)}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))close()}}>
    <div className="services-nav-label">
     <NavLink to="/services" className={({isActive})=>isActive||location.pathname.startsWith('/services')?'active':''} onClick={()=>{close();setMobile(false);}}>Services</NavLink>
     <button ref={toggle} className="services-toggle-arrow" aria-label="Toggle services menu" aria-expanded={expanded} aria-controls="services-mega" onClick={(e)=>{e.preventDefault();e.stopPropagation();setExpanded(!expanded);}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setExpanded(true);requestAnimationFrame(()=>document.querySelector<HTMLAnchorElement>('#services-mega a')?.focus())}}}>
      <span aria-hidden="true" style={{display:'inline-block',transition:'transform 0.2s ease',transform:expanded?'rotate(180deg)':'none'}}>⌵</span>
     </button>
    </div>
    {expanded&&<div id="services-mega" className="services-mega"><div className="mega-columns">{serviceCategories.map(c=><section key={c.slug}><Link className="mega-heading" to={'/services?category='+c.slug} onClick={close}>{c.title}<span aria-hidden="true">↗</span></Link><p>{c.description}</p><ul>{c.services.map(s=><li key={s.slug}><Link to={'/services/'+s.slug} onClick={close}>{s.name}</Link></li>)}</ul></section>)}</div><div className="mega-footer"><span>Good things grow with the right expertise.</span><Link to="/services" onClick={close}>Explore all services ↗</Link></div></div>}
   </div>
   <NavLink to="/about">About</NavLink><NavLink to="/work">Work / Projects</NavLink><NavLink to="/contact">Contact</NavLink>
   <Link className="mobile-cta" to="/contact">Enquiry form ↗</Link>
  </nav>
  <Link className="nav-cta desktop-cta" to="/contact">Enquiry form <span aria-hidden="true">↗</span></Link>
 </header>
}

export function ServiceShowcase({service}:{service:typeof services[number]}){
 const items=projectsForService(service);
 return <section className="section service-showcase"><div className="section-head"><div><p className="eyebrow">A sense of what’s possible</p><h2>Projects we're proud of</h2></div><p className="note">Three illustrative concepts.<br/>Client projects and media to follow.</p></div><div className="project-grid">{items.map(p=><article className="showcase-card" key={p.id}><div className="showcase-media">{p.mediaType==='video'?<video src={p.media} poster={p.poster} controls muted playsInline preload="none" aria-label={p.alt}/>:<img src={p.media} alt={p.alt} loading="lazy" decoding="async"/>}</div><p className="eyebrow">{p.label}</p><h3>{p.link?<Link to={p.link}>{p.title} <span aria-hidden="true">↗</span></Link>:p.title}</h3><p>{p.description}</p></article>)}</div></section>
}

