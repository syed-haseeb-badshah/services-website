export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const brand = {
  name: "Aster Digital",
  logo: "/logo.svg",
  wordmark: "/wordmark.svg",
  tagline: "Good things grow with intention.",
  region: "United Kingdom & beyond",
  email: "",
  phone: "",
  whatsapp: "",
  booking: "",
  socials: [] as { name: string; url: string }[],
  colors: {
    ivory: "#f8f5ef",
    ink: "#252922",
    green: "#203c30",
    accent: "#af563b",
  },
  description:
    "Thoughtful websites, distinctive brands, and purposeful digital marketing for businesses ready for their next chapter.",
};
export const groups = [
  "All Services",
  "Web Design & Development",
  "Videography & Photography",
  "Brand & Content",
  "Technology",
];
export type PublicService = {
  id?: string;
  name: string;
  slug: string;
  group: string;
  description: string;
  items: string[];
};
export const services: PublicService[] = [];
export const projects = [
  {
    slug: "forma-studio",
    name: "Forma Studio",
    category: "Web design",
    industry: "Architecture",
    image: "/assets/interior.jpg",
    line: "Spaces with a point of view.",
    brief:
      "An independent architecture studio needs an online portfolio that helps visitors understand its approach and begin a conversation.",
    approach:
      "An editorial project index balances large photographs with concise information about the space, materials, and design decisions.",
    deliverables: [
      "Art direction",
      "Responsive website concept",
      "Project storytelling",
    ],
    color: "#deded2",
  },
  {
    slug: "earth-and-form",
    name: "Earth & Form",
    category: "Ecommerce",
    industry: "Lifestyle & retail",
    image: "/assets/ceramics.jpg",
    line: "Objects for everyday rituals.",
    brief:
      "A small ceramics label needs a considered shopping experience that reflects the care in its objects.",
    approach:
      "A quiet catalogue places material, dimensions, and care information alongside every object. Clear collections simplify discovery.",
    deliverables: [
      "Storefront concept",
      "Product page design",
      "Brand application",
    ],
    color: "#e9dfd4",
  },
  {
    slug: "the-good-space",
    name: "The Good Space",
    category: "Branding",
    industry: "Creative businesses",
    image: "/assets/studio.jpg",
    line: "A little room to create.",
    brief:
      "A neighbourhood creative workspace needs a welcoming identity and an easy way to introduce its spaces.",
    approach:
      "Warm art direction and straightforward copy connect membership information, space details, and a simple enquiry path.",
    deliverables: [
      "Identity concept",
      "Content direction",
      "Landing page concept",
    ],
    color: "#e6dfcc",
  },
];
export const faqs = [
  [
    "Where do you work?",
    "We work with UK businesses and can discuss international projects. Working hours, time zones, and any location-specific production requirements are agreed with the scope.",
  ],
  [
    "How much does a project cost?",
    "The fee depends on the scope, content, integrations, and support you need. Package outlines help frame the conversation; a tailored proposal sets out the price in GBP and any third-party costs.",
  ],
  [
    "Can you improve an existing website?",
    "Yes. We can review an existing site for redesign, content improvements, platform migration, or maintenance. The starting point is understanding what works and what needs to change.",
  ],
  [
    "What do you need from me to start?",
    "A short description of your business, audience, goals, and practical constraints is enough to begin planning. Existing brand assets, content, and example projects are useful when available.",
  ],
  [
    "How long will it take?",
    "A realistic schedule is agreed once the scope, content, integrations, and review responsibilities are understood. Milestones make it clear what happens next and what we need from you.",
  ],
  [
    "Does this form send an enquiry?",
    "Not yet. This frontend preview validates your details and shows a review summary. Nothing is transmitted, emailed, saved, or booked.",
  ],
  [
    "Do you provide maintenance and post-launch support?",
    "Yes. Website care, updates, training, and ongoing support can be scoped around your platform and team. We agree responsibilities and costs before the support period begins.",
  ],
  [
    "Can you integrate APIs and existing systems?",
    "We can scope connections between websites, applications, and business tools. We first review API access, data requirements, permissions, and any third-party limitations.",
  ],
  [
    "What happens after I contact you?",
    "The planned next step is to review your goals, clarify the brief, and discuss an appropriate scope before proposing the work. In this local preview, the form only lets you review your request; no message is sent.",
  ],
  [
    "Can you work with an international team?",
    "We can discuss remote collaboration and agree communication, time zones, and delivery requirements. Photography or production involving travel needs a separate location and logistics plan.",
  ],
];
export const articles = [
  {
    slug: "before-your-website-redesign",
    title: "Before you redesign, ask better questions.",
    category: "Web design",
    read: "4 min read",
    intro: "A new look can help. A clearer purpose helps more.",
    sections: [
      [
        "Start with one useful outcome",
        "Decide what the next version of your website should help someone do. Book an introduction, find the right product, or understand a complex service. Write that action down before you start collecting visual references.",
      ],
      [
        "Find the friction",
        "Walk through your current site on a phone. Note where information is missing, buttons are unclear, or a form asks too much. Talk to the people who answer customer questions: they already know what visitors struggle to find.",
      ],
      [
        "Make a content inventory",
        "List the pages you need to keep, rewrite, combine, or remove. Confirm who owns the copy and photography. Content decisions made early make the design process more focused.",
      ],
      [
        "Create a useful brief",
        "Include your audience, primary action, essential features, content owners, and practical constraints. Choose a small set of priorities you can review together. A good brief is a working agreement, not a collection of adjectives.",
      ],
    ],
  },
  {
    slug: "choosing-your-store-platform",
    title: "A store platform should fit the way you work.",
    category: "Ecommerce",
    read: "3 min read",
    intro: "Start with your catalogue and operations, then compare the tools.",
    sections: [
      [
        "Map your everyday work",
        "Document how you add products, track stock, handle enquiries, and fulfil orders. Include the people who do these tasks. Your platform choice should make their work easier.",
      ],
      [
        "Check the whole buying journey",
        "Review the payment providers, shipping methods, currencies, and languages your customers need. Confirm current provider availability before committing to an implementation.",
      ],
      [
        "Plan for ownership",
        "Consider subscriptions, extension costs, maintenance, and training alongside the initial build. Ask for a handover plan and make sure the relevant accounts belong to the business.",
      ],
      [
        "Test a representative product",
        "A product with variants, delivery restrictions, or custom options is a better test than your simplest item. Prototype its full journey before scaling the catalogue.",
      ],
    ],
  },
  {
    slug: "a-useful-content-plan",
    title: "Less noise. A more useful content plan.",
    category: "Marketing",
    read: "3 min read",
    intro: "Build your next month of content around real customer questions.",
    sections: [
      [
        "Listen before you schedule",
        "Collect the questions people ask before buying. Group them by topic: choosing, using, caring for, and comparing. Each group can support useful articles, emails, and social posts.",
      ],
      [
        "Give every piece a job",
        "Decide whether a piece should explain, demonstrate, or invite a next step. Avoid asking every post to sell. Useful information earns attention without forcing a pitch into every paragraph.",
      ],
      [
        "Work from one source",
        "Write one substantial answer, then adapt it to different channels. Keep the facts consistent and change the format for the context in which people will read it.",
      ],
      [
        "Review and improve",
        "Choose measures that relate to your purpose, such as relevant enquiries or visits to a helpful service page. Review patterns over time and document what you would change next month.",
      ],
    ],
  },
];
export const industries = [
  "Architecture & construction",
  "Retail & ecommerce",
  "Healthcare",
  "Education",
  "Food & hospitality",
  "Real estate",
  "Professional services",
  "Startups & technology",
  "Fashion & textiles",
  "Beauty & cosmetics",
  "Travel & tourism",
  "Automotive",
  "Logistics & BPO",
  "Nonprofits",
  "Home services",
  "Women-led businesses",
];
export const packages: string[] = [];

export const processSteps = [
  {
    title: "Tell us your idea",
    description:
      "Share your goals, audience, and the problem you want to solve. We review what you already have and where you need support.",
  },
  {
    title: "Plan the solution",
    description:
      "Agree the scope, responsibilities, budget, and review points before the work begins.",
  },
  {
    title: "Build & develop",
    description:
      "Design, development, content, or production takes shape through agreed milestones and your feedback.",
  },
  {
    title: "Launch & support",
    description:
      "Check the deliverables, prepare the handover, and agree any training, maintenance, or follow-up support.",
  },
];
export const audiences = [
  {
    title: "Startups",
    description:
      "Shape a clear first offer and a digital presence that gives your idea room to develop.",
  },
  {
    title: "Small businesses",
    description:
      "Make your services easier to understand and give customers a straightforward way to enquire.",
  },
  {
    title: "Growing companies",
    description:
      "Connect your website, content, and systems as your team and customer needs evolve.",
  },
  {
    title: "Complex organisations",
    description:
      "Plan workflows, integrations, and ownership around the people who will use and maintain them.",
  },
];
export const projectContext: Record<
  string,
  { outcome: string; technology: string; service: string }
> = {
  "forma-studio": {
    outcome:
      "A portfolio direction designed to help visitors understand the studio’s specialism, explore relevant spaces, and begin a project conversation.",
    technology:
      "Design concept; the CMS, frontend and hosting would be agreed for a commissioned build.",
    service: "Customized Website Development",
  },
  "earth-and-form": {
    outcome:
      "A storefront direction that makes products easier to compare through useful material, size, and care information, with a clearer route towards purchase.",
    technology:
      "Storefront concept; the commerce platform, payments and fulfilment integrations are not yet selected.",
    service: "eCommerce Store Development",
  },
  "the-good-space": {
    outcome:
      "A coherent identity and landing-page direction that helps potential members understand the spaces, atmosphere, and enquiry process.",
    technology:
      "Identity and landing-page concept; publishing tools and booking integrations would be scoped separately.",
    service: "Branding & graphic design",
  },
};

export const serviceCategories = groups.slice(1).map((title, index) => ({
  title,
  slug: slugify(title),
  description: [
    "Distinctive websites and thoughtful shopping experiences, built around the people who use them.",
    "Still images and moving stories that reveal the character of your brand.",
    "A recognisable identity, a clear voice, and content with something to say.",
    "Connected systems and considered support for the way your business works.",
  ][index],
  services: services.filter((s) => s.group === title),
}));
export type ShowcaseProject = {
  id: string;
  title: string;
  description: string;
  label: string;
  mediaType: "image" | "video";
  media: string;
  alt: string;
  poster?: string;
  link?: string;
};
// Replace concept media/copy here. Optional per-service overrides use the same three-slot structure.
export const serviceProjectOverrides: Record<string, ShowcaseProject[]> = {};
export function projectsForService(
  service: (typeof services)[number],
): ShowcaseProject[] {
  return (
    serviceProjectOverrides[service.slug] ??
    projects.map((p, i) => ({
      id: p.slug,
      title: p.name,
      label: "Concept direction",
      mediaType: "image",
      media: p.image,
      alt: p.name + " illustrative art direction",
      link: "/work/" + p.slug,
      description: [
        service.group === "Videography & Photography"
          ? "A visual study of spaces, texture, and natural light."
          : p.approach,
        service.group === "Videography & Photography"
          ? "Product storytelling through material, form, and everyday rituals."
          : p.brief,
        service.group === "Videography & Photography"
          ? "A warm creative direction for people and shared spaces."
          : p.approach,
      ][i],
    }))
  );
}

export function hydrateContent(
  rows: PublicService[],
  settings: Record<string, unknown>,
) {
  services.splice(0, services.length, ...rows);
  for (const category of serviceCategories)
    category.services = services.filter((s) => s.group === category.title);
  brand.email = String(settings["contact.email"] || "");
  brand.phone = String(settings["contact.phone"] || "");
  brand.whatsapp = String(settings["contact.whatsapp"] || "");
}
