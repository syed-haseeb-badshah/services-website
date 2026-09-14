import fs from "node:fs";
import dotenv from "dotenv";
import {
  brand,
  projects,
  industries,
  articles,
  slugify,
} from "../src/content.js";
dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: "apps/api/.env", quiet: true });
const origin = new URL(
  process.env.SITE_URL || process.env.APP_URL || "http://localhost:5173",
).origin;
const response = await fetch(
  (process.env.API_URL || "http://localhost:4000") + "/api/services?limit=100",
);
if (!response.ok)
  throw new Error("Cannot generate sitemap without current published services");
const first = (await response.json()) as {
  items: { slug: string }[];
  total: number;
};
const services = first.items;
for (let page = 2; services.length < first.total; page++) {
  const response = await fetch(
    `${process.env.API_URL || "http://localhost:4000"}/api/services?limit=100&page=${page}`,
  );
  if (!response.ok) throw new Error("Service pagination failed");
  const next = (await response.json()) as typeof first;
  if (!next.items.length) break;
  services.push(...next.items);
}
const paths = [
  "",
  "about",
  "services",
  "work",
  "pricing",
  "industries",
  "resources",
  "contact",
  "audit",
  "faq",
  "process",
  "privacy",
  "terms",
  "careers",
  "client-preview",
  "sitemap",
  ...services.map((s) => "services/" + s.slug),
  ...projects.map((p) => "work/" + p.slug),
  ...industries.map((i) => "industries/" + slugify(i)),
  ...articles.map((a) => "resources/" + a.slug),
];
fs.writeFileSync(
  "public/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((path) => `<url><loc>${origin}/${path}</loc></url>`).join("\n") +
    "\n</urlset>\n",
);
fs.writeFileSync(
  "public/robots.txt",
  `User-agent: *\nDisallow: /admin\nDisallow: /newsletter/\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
let html = fs
  .readFileSync("index.html", "utf8")
  .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, "");
html = html.replace(
  "</head>",
  `<!-- seo:start -->\n<meta property="og:type" content="website"/><meta property="og:title" content="Aster Digital"/><meta property="og:description" content="${brand.description}"/><meta property="og:url" content="${origin}"/><meta property="og:image" content="${origin}/assets/interior.jpg"/><meta name="twitter:card" content="summary_large_image"/>\n<!-- seo:end -->\n</head>`,
);
fs.writeFileSync("index.html", html);
console.log(`Generated sitemap with ${paths.length} URLs for ${origin}.`);
