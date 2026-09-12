import AnimatedStats from './animated-stats';
import ProjectShowcase from './project-showcase';
import HomeServices from './home-services';

import {Link} from 'react-router-dom';
import {projects,faqs,services,serviceCategories,packages} from './content';

export default function Home(){return <div className="studio-home">
 <section className="new-hero wrap">
  <div className="new-hero-copy"><p className="eyebrow">INDEPENDENT DIGITAL & CREATIVE STUDIO</p><h1>A better presence.<br/><em>A bigger possibility.</em></h1><p className="hero-description">Websites, brands, and content that make your business easier to discover. And harder to forget.</p><div className="actions"><Link className="button" to="/contact">Let’s build your next chapter <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/work">Explore our work <span aria-hidden="true">↗</span></Link></div><div className="hero-assurance"><span>Clear scope</span><span>Collaborative process</span><span>Thoughtful handover</span></div></div>
 </section>
 <div className="home-light">
 <section className="studio-stats" aria-label="Our offering at a glance"><div className="wrap"><AnimatedStats items={[[400,'Total clients'],[services.length,'Services offered'],[serviceCategories.length,'Core disciplines'],[projects.length,'Concept projects'],[packages.length,'Package options'],[4,'Process stages']]}/></div></section>
 <ProjectShowcase/>
 <HomeServices/>
 <section className="section wrap"><div className="section-head"><div><p className="eyebrow">02 / HOW WE WORK</p><h2>Good work starts<br/>with a clear plan.</h2></div><Link className="text-link" to="/process">Meet the process <span aria-hidden="true">↗</span></Link></div><div className="new-process">{[['Understand','We listen to your goals, your audience, and what needs to change.'],['Define','Together, we agree on the scope, direction, and milestones.'],['Create','Design and development take shape with your feedback along the way.'],['Launch & support','We prepare a clear handover and agree on what comes next.']].map(([t,d],i)=><article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
 <section className="partner-section wrap"><div><p className="eyebrow">SMALL STUDIO. SHARED AMBITION.</p><h2>Your business deserves<br/><em>to be understood.</em></h2></div><div><p>We bring strategy, design, and development into the same conversation. That means a shared direction, practical decisions, and a digital presence that feels like you.</p><Link className="text-link" to="/about">Get to know Aster <span aria-hidden="true">↗</span></Link></div></section>
 <section className="section wrap faq-layout"><div><p className="eyebrow">BEFORE WE BEGIN</p><h2>Good questions.<br/>Clear answers.</h2><Link className="text-link" to="/faq">More questions answered ↗</Link></div><div className="faq">{faqs.slice(1,5).map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
 </div></div>}





