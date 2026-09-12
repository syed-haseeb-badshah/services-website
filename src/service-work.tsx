import ProjectShowcase,{type ShowcaseItem} from './project-showcase';
import {detailFor,type Service} from './service-detail-content';

// These are illustrative directions, not claims of completed client projects.
// Add approved service-specific video URLs alongside the poster when available.
const posters=['/assets/interior.jpg','/assets/ceramics.jpg','/assets/studio.jpg','/assets/interior.jpg'];
const contexts=['An architecture studio','An independent product brand','A creative workspace','A professional services business'];
const titles:Record<string,string[]>={
 'web-design-and-development':['Architecture studio website','Independent retail website','Creative workspace website','Professional services website'],
 ecommerce:['A considered product catalogue','A clear collection journey','A simpler checkout flow','A store your team can manage'],
 wordpress:['An editorial studio website','A product-led WordPress site','A flexible membership website','A clear content migration'],
 shopify:['A distinctive Shopify storefront','Collections made to explore','A considered checkout setup','A manageable retail workflow'],
 'laravel-custom-website-development':['A project enquiry portal','A product operations platform','A workspace booking system','A connected business dashboard'],
 'website-redesign-and-development':['An architecture site, reimagined','A clearer retail experience','A better membership journey','A refreshed professional website'],
 photography:['Spaces in natural light','Product details, in focus','The people behind the work','A consistent brand image library'],
 videography:['A studio brand film','A product campaign film','A short-form workspace story','An event highlight film'],
 'video-editing':['A clearer narrative cut','A consistent colour treatment','A considered sound mix','A captioned social edit'],
};
export default function ServiceWork({service}:{service:Service}){
 const detail=detailFor(service);
 const items:ShowcaseItem[]=service.items.map((item,index)=>({
  title:titles[service.slug]?.[index]??item,
  poster:posters[index],alt:contexts[index]+' — illustrative '+service.name.toLowerCase()+' concept',
  category:service.name+' · Concept',description:detail.details[index],
  href:'/contact?service='+encodeURIComponent(service.name),linkLabel:'Discuss this direction',
 }));
 return <ProjectShowcase key={service.slug} items={items} title="Our work" description={'Explore four concept directions for '+service.name.toLowerCase()+', shaped around different business needs.'} note="Illustrative concepts using reference imagery. Completed project media will be added here."/>;
}
