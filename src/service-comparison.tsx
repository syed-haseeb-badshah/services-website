import {Link} from 'react-router-dom';
import {detailFor,type Service} from './service-detail-content';

export default function ServiceComparison({service}:{service:Service}){
 const detail=detailFor(service);
 const questions=detail.web?[
  ['A template or a tailored journey?','Check how the proposal addresses your content, customers, and enquiry or checkout flow.'],
  ['What happens on mobile?','Ask how navigation, forms, and page layouts will be checked across screen sizes.'],
  ['What is included before launch?','Clarify content, technical checks, integrations, and the work needed from your team.'],
  ['Who owns and manages the website?','Understand access, platform subscriptions, and the editing tools you will receive.'],
  ['What happens after handover?','Ask for a clear support scope, costs, and a process for future changes.'],
 ]:service.group==='Videography & Photography'?[
  ['Is there a clear creative brief?','Check the audience, message, shot list, and intended use before production.'],
  ['Which formats will you receive?','Agree the aspect ratios, resolution, and versions needed for each channel.'],
  ['How are reviews handled?','Clarify selection, edits, revision rounds, and approval responsibilities.'],
  ['Are usage details clear?','Discuss licensing, music, permissions, and the delivery of final assets.'],
  ['Can the work be developed later?','Ask how further shoots, edits, and archive access would be arranged.'],
 ]:service.group==='Brand & Content'?[
  ['Does the work start with your audience?','Check that positioning and customer needs inform the proposed direction.'],
  ['How will it stay consistent?','Ask about brand voice, visual standards, and their use across channels.'],
  ['What exactly will be delivered?','Agree the assets, copy, campaign outputs, and any third-party costs.'],
  ['How are decisions made?','Clarify who reviews the work and how feedback becomes the next version.'],
  ['What can your team use afterwards?','Check final formats, usage guidance, and ongoing support options.'],
 ]:[
  ['Does the solution fit the workflow?','Check that real users, tasks, and dependencies inform the proposed system.'],
  ['Are access and ownership clear?','Discuss permissions, accounts, data ownership, and third-party services.'],
  ['How will connections be tested?','Ask about representative scenarios, errors, and recovery expectations.'],
  ['Can your team manage it?','Clarify documentation, training, and day-to-day administration.'],
  ['What support is included?','Agree responsibilities, maintenance scope, and the cost of future changes.'],
 ];
 return <section className="wrap section detail-comparison" aria-labelledby="comparison-title">
  <header className="detail-section-heading"><p className="eyebrow">CHOOSING YOUR PARTNER</p><h2 id="comparison-title">A clearer way to compare.</h2><p>What other companies include varies. Here is what to ask—and how we approach {service.name.toLowerCase()}.</p></header>
  <div className="detail-compare-grid"><article className="detail-compare-card"><span className="detail-compare-label">OTHER PROVIDERS</span><h3>Questions worth asking</h3><ul>{questions.map(([title,copy])=><li key={title}><span className="detail-compare-mark" aria-hidden="true">?</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}</ul></article>
  <span className="detail-versus" aria-hidden="true">VS</span>
  <article className="detail-compare-card detail-compare-aster"><span className="detail-compare-label">WITH ASTER DIGITAL</span><h3>A considered approach</h3><ul>{detail.features.map(feature=><li key={feature.title}><span className="detail-compare-mark" aria-hidden="true">✓</span><div><strong>{feature.title}</strong><p>{feature.description}</p></div></li>)}</ul><Link className="detail-button" to={'/contact?service='+encodeURIComponent(service.name)}>Discuss your project <span aria-hidden="true">↗</span></Link></article></div>
 </section>;
}
