import type {CSSProperties} from 'react';
import {useSearchParams} from 'react-router-dom';
import {serviceCategories,services} from './content';
import {categoryThemeMap} from './service-logos';
import HomeServices from './home-services';
import './services-page.css';

export default function ServicesPage(){
 const [params,setParams]=useSearchParams();const selected=serviceCategories.find(category=>category.slug===params.get('category'));
 const options=[{slug:'',title:'All Services'},...serviceCategories];
 return <div className="services-page"><header className="wrap services-banner"><p className="eyebrow">OUR SERVICES</p><h1>A considered approach<br/>to your digital world.</h1><p>Start with what your business needs. We’ll help connect the right pieces.</p></header><div className="services-white-surface">
 <div className="wrap services-filter-start"><div className="services-category-filters" role="group" aria-label="Filter services by category">{options.map(option=><button key={option.slug} type="button" style={{'--filter-color':categoryThemeMap[option.title]?.color||'#20222c'} as CSSProperties} aria-pressed={(selected?.slug||'')===option.slug} aria-controls="service-results" onClick={()=>setParams(option.slug?{category:option.slug}:{},{preventScrollReset:true})}>{option.title}</button>)}</div><p className="services-result-count" role="status">{selected?selected.services.length:services.length} services · {selected?.title||'All categories'}</p></div>
 <div id="service-results"><HomeServices categorySlug={selected?.slug} directory/></div>
 </div></div>
}
