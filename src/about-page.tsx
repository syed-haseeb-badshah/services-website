import {Link} from 'react-router-dom';
import {serviceCategories} from './content';

export default function AboutPage(){
 return <div className="about-refresh">
  <header className="wrap page-title"><p className="eyebrow">MEET ASTER DIGITAL</p><h1>A shared direction.<br/>A better digital presence.</h1><p className="lede">We bring websites, visual storytelling, branding, and technology into one conversation—helping UK businesses make their next move with clarity.</p><Link className="button" to="/contact">Let’s talk about your business <span aria-hidden="true">↗</span></Link></header>
  <div className="wrap"><div className="about-image"><img src="/assets/studio.jpg" alt="A sunlit creative space with artwork and natural details"/><p>Thoughtful ideas.<br/><em>Practical outcomes.</em></p></div>
  <section className="section split about-introduction"><div><p className="eyebrow">ONE CONNECTED STUDIO</p><h2>Your business deserves<br/>to be understood.</h2></div><div><p>Every business has its own priorities. We start by understanding your customers, the way you work, and what a better digital presence needs to achieve.</p><p>From the first website visit to the tools behind the scenes, we connect design and technology with a clear purpose. You get an agreed scope, useful review points, and a considered handover.</p><p>For UK clients, that means clear proposals in GBP and collaboration planned around UK working hours.</p><Link className="text-link" to="/services">Find the right service <span aria-hidden="true">↗</span></Link></div></section>
  <section className="about-values" aria-labelledby="about-values-title"><div className="section-head"><div><p className="eyebrow">HOW WE APPROACH THE WORK</p><h2 id="about-values-title">Clear thinking.<br/>Care in the details.</h2></div></div><div className="process-grid">{[
   ['Start by listening','We ask about your audience, goals, and everyday challenges before proposing a direction.'],
   ['Keep the work clear','A shared brief and realistic scope make decisions easier for everyone involved.'],
   ['Create together','Planned reviews give your team space to shape the work as it develops.'],
   ['Think beyond handover','Practical guidance and an agreed support plan help the work stay useful.'],
  ].map(([title,copy],index)=><article key={title}><span className="step">0{index+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="section" aria-labelledby="about-disciplines-title"><div className="section-head"><div><p className="eyebrow">OUR FOUR DISCIPLINES</p><h2 id="about-disciplines-title">Different skills.<br/>One joined-up approach.</h2></div><Link className="text-link" to="/work">Explore our work <span aria-hidden="true">↗</span></Link></div><div className="about-disciplines">{serviceCategories.map((category,index)=><Link key={category.slug} to={'/services?category='+category.slug} className={'about-discipline discipline-'+index}><span className="about-discipline-number">0{index+1}</span><h3>{category.title}</h3><p>{category.description}</p><span className="about-discipline-link">Explore services <span aria-hidden="true">↗</span></span></Link>)}</div></section>
  <section className="about-conversation"><div><p className="eyebrow">LET’S FIND YOUR NEXT STEP</p><h2>Something in mind?<br/>We’re ready to listen.</h2><p>Tell us what you are building, improving, or exploring. We’ll help shape a useful starting point.</p></div><Link className="button" to="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></section>
  </div>
 </div>;
}
