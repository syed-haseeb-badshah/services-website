export const categoryThemeMap: Record<
  string,
  { color: string; label: string }
> = {
  "Web Design & Development": { color: "#3B82F6", label: "Electric Blue" },
  "Videography & Photography": { color: "#A855F7", label: "Violet / Purple" },
  "Brand & Content": { color: "#F97316", label: "Coral / Orange" },
  Technology: { color: "#06B6D4", label: "Cyan / Teal" },
};

export function ServiceLogo({ slug }: { slug: string }) {
  switch (slug) {
    // -------------------------------------------------------------
    // Web Design & Development (Explore button: Electric Blue #3B82F6)
    // -------------------------------------------------------------
    case "web-design-and-development":
      // React official cyan logo (#61DAFB)
      return (
        <svg
          viewBox="0 0 115 102"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="React logo"
        >
          <circle cx="57.5" cy="51" r="10.5" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="4.2" fill="none">
            <ellipse rx="52" ry="20" cx="57.5" cy="51" />
            <ellipse
              rx="52"
              ry="20"
              cx="57.5"
              cy="51"
              transform="rotate(60 57.5 51)"
            />
            <ellipse
              rx="52"
              ry="20"
              cx="57.5"
              cy="51"
              transform="rotate(120 57.5 51)"
            />
          </g>
        </svg>
      );

    case "ecommerce":
      // WooCommerce official purple logo (#96588A)
      return (
        <svg
          viewBox="0 0 100 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="WooCommerce logo"
        >
          <path
            d="M78 0C65.85 0 62 10.5 62 10.5S58.15 0 46 0C32.19 0 21 11.19 21 25C21 40 40 54 46 59C47.5 60.2 49 61 50 61C51 61 52.5 60.2 54 59C60 54 79 40 79 25C79 11.19 67.81 0 78 0Z"
            fill="#96588A"
            opacity="0.08"
          />
          <rect width="100" height="60" rx="14" fill="#96588A" />
          <path
            d="M22 21C22 21 24 35 28 39C32 43 37 36 37 36C37 36 39 42 43 40C47 38 49 28 49 21"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M54 21C54 21 56 35 60 39C64 43 69 36 69 36C69 36 71 42 75 40C79 38 81 28 81 21"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "wordpress":
      // WordPress official blue logo (#21759B)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="WordPress logo"
        >
          <circle cx="50" cy="50" r="48" fill="#21759B" />
          <path
            d="M9.4 50C9.4 67.7 20.7 82.7 36.8 88.2L16.2 31.9C11.8 37.2 9.4 43.3 9.4 50ZM77.8 47.7C77.8 41.7 75.6 37.6 73.8 34.3C71.3 30.1 68.8 26.6 68.8 22.1C68.8 17 72.7 12.5 80.7 12.5C81.1 12.5 81.5 12.5 81.9 12.6C73.1 5.9 62 2 50 2C35 2 21.6 8.1 12.4 17.9L49.1 88.5L62.2 52.8L54.7 31.9H66.8L77.8 47.7ZM63.2 88.2C79.3 82.7 90.6 67.7 90.6 50C90.6 44.2 88.7 38.8 85.3 34.2L63.2 88.2ZM50 98C46.8 98 43.7 97.6 40.7 96.9L24.8 50.8H34.4L44.8 81.2L52.8 57.6L46.8 41.5H58.4L50 67.1L57.5 88.9C55 97.4 52.5 98 50 98Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "shopify":
      // Shopify official shopping bag (#95BF47 and #5E8E3E)
      return (
        <svg
          viewBox="0 0 100 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Shopify logo"
        >
          <path
            d="M83.4 22.6C83.1 21.9 82.4 21.6 81.7 21.8L73.9 24.2C69.4 10.9 60.5 2 48.7 2C47.2 2 45.7 2.2 44.3 2.6C40.6 3.7 38.3 6 36.9 7.7C33.1 12.4 31.8 19.3 32.7 28.1L12.4 34.4C11.3 34.7 10.6 35.7 10.6 36.9C10.6 37.2 13 86.8 16.4 105.7C16.8 108.3 18.9 110.2 21.5 110.2H78.8C81.4 110.2 83.5 108.3 83.9 105.7L90.4 40.1L83.4 22.6ZM50.8 15.3C54.8 15.3 59.8 19.3 62.4 27.7L40.6 34.4C40.3 23.3 43.8 15.3 50.8 15.3Z"
            fill="#95BF47"
          />
          <path
            d="M73.9 24.2L81.7 21.8C82.4 21.6 83.1 21.9 83.4 22.6L90.4 40.1L78.8 110.2H66.2L73.9 24.2Z"
            fill="#5E8E3E"
            opacity="0.35"
          />
          <path
            d="M53.6 52.8C46.8 52.8 43.1 56.6 43.1 61.4C43.1 71.3 60.7 69.2 60.7 80.2C60.7 84.7 57.1 87.8 51.5 87.8C44.7 87.8 41.5 83.1 41.5 83.1L38.4 90.9C38.4 90.9 43.1 95.8 51.7 95.8C62.4 95.8 69.8 89.6 69.8 80.2C69.8 69 52.2 67.8 52.2 59.2C52.2 55.7 54.9 53.6 58.7 53.6C62.9 53.6 65.8 55.7 65.8 55.7L68.5 48.2C68.5 48.2 63.6 44.8 55.7 44.8C54.9 44.8 54.2 44.9 53.6 52.8Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "platform-development":
      // Webflow official blue stylized W logo (#146EF5)
      return (
        <svg
          viewBox="0 0 100 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Webflow logo"
        >
          <path
            d="M99.9 0L68.8 64H41.5L52.5 41.4H51.8C42.4 54.2 30.6 63.9 14.5 64C2.3 64.1 0 54.3 0 46.1C0 32.9 12.1 21.7 26.6 21.7C35.7 21.7 41.8 26.2 45.4 31.8H46.1L49.3 21.7H66.8L56.9 41.9H57.6L67.8 21.7H83.8L74 41.9H74.7L84.8 21.7H100L99.9 0ZM27.1 33.4C20.6 33.4 15.6 38.3 15.6 44.9C15.6 49.3 18.2 52.4 22.7 52.4C30.2 52.4 36.5 44.3 39.8 33.4C36 33.4 30.7 33.4 27.1 33.4Z"
            fill="#146EF5"
          />
        </svg>
      );

    case "laravel-custom-website-development":
      // Laravel official red isometric logo (#FF2D20)
      return (
        <svg
          viewBox="0 0 100 105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Laravel logo"
        >
          <path
            d="M42.2 0.8L97.3 32.6C98.9 33.5 100 35.3 100 37.2V73.4C100 75.3 98.9 77.1 97.3 78L71.4 93C69.8 93.9 67.8 93.9 66.2 93L53.7 85.8L38.4 94.6C36.8 95.5 34.8 95.5 33.2 94.6L2.7 77C1 76 -0.1 74.2 0 72.3L1.5 35.9C1.6 34.1 2.6 32.3 4.2 31.4L42.2 0.8Z"
            fill="#FF2D20"
            opacity="0.12"
          />
          <path
            d="M42.2 0.8L97.3 32.6C98.9 33.5 100 35.3 100 37.2V73.4C100 75.3 98.9 77.1 97.3 78L71.4 93C69.8 93.9 67.8 93.9 66.2 93L53.7 85.8V64.6L66.2 71.8L88 59.2V41.7L42.2 15.2L12 32.6L34.5 45.6L46.9 38.4V59.6L34.5 66.8L12 53.8V71.2L33.2 83.4L45.7 76.2L45.7 97.4L33.2 104.6C31.6 105.5 29.6 105.5 28 104.6L2.7 90C1 89.1 0 87.3 0 85.4V49.2C0 47.3 1 45.5 2.7 44.6L42.2 0.8Z"
            fill="#FF2D20"
          />
        </svg>
      );

    case "website-redesign-and-development":
      // Figma official 5-color logo (#F24E1E, #FF7262, #A259FF, #1ABCFE, #0ACF83)
      return (
        <svg
          viewBox="0 0 64 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Figma logo"
        >
          <path
            d="M32 32H16C7.16 32 0 24.84 0 16C0 7.16 7.16 0 16 0H32V32Z"
            fill="#F24E1E"
          />
          <path
            d="M32 0H48C56.84 0 64 7.16 64 16C64 24.84 56.84 32 48 32H32V0Z"
            fill="#FF7262"
          />
          <path
            d="M32 32H16C7.16 32 0 39.16 0 48C0 56.84 7.16 64 16 64H32V32Z"
            fill="#A259FF"
          />
          <circle cx="48" cy="48" r="16" fill="#1ABCFE" />
          <path
            d="M0 80C0 71.16 7.16 64 16 64H32V80C32 88.84 24.84 96 16 96C7.16 96 0 88.84 0 80Z"
            fill="#0ACF83"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // Videography & Photography (Explore button: Violet / Purple #A855F7)
    // -------------------------------------------------------------
    case "photography-and-video":
      // Sony Alpha official camera / cine icon in Sony Alpha Orange (#FF6600)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Sony Alpha photography & video"
        >
          <circle cx="50" cy="50" r="46" stroke="#FF6600" strokeWidth="6" />
          <path
            d="M50 20L72 76H58L53.5 63H41.5L44.8 54H50.5L50 40L35 76H22L44 20H50Z"
            fill="#FF6600"
          />
        </svg>
      );

    case "virtual-tours":
      // Matterport official 3D spatial capture logo (#FF3366)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Matterport 3D Virtual Tours logo"
        >
          <rect width="100" height="100" rx="20" fill="#FF3366" opacity="0.1" />
          <path
            d="M50 14L82 32V68L50 86L18 68V32L50 14Z"
            stroke="#FF3366"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M50 14V86M18 32L82 68M82 32L18 68"
            stroke="#FF3366"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="50" r="10" fill="#FF3366" />
        </svg>
      );

    case "photography":
      // Adobe Lightroom official logo (#31A8FF)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Adobe Lightroom logo"
        >
          <rect width="100" height="100" rx="22" fill="#001E36" />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="19"
            stroke="#31A8FF"
            strokeWidth="5"
          />
          <path d="M26 28V72H46V65H34V28H26Z" fill="#31A8FF" />
          <path
            d="M53 43V72H61V54.5C61 50 63.5 48 67 48C68.5 48 70 48.5 71 49.2V41.8C69.8 41.3 68.2 41 66.5 41C63.2 41 61.5 42.8 60.5 46.2H60.2V43H53Z"
            fill="#31A8FF"
          />
        </svg>
      );

    case "videography":
      // DaVinci Resolve official 4-color petals (#EE3124, #00A651, #0054A6, #FFF200)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="DaVinci Resolve Videography logo"
        >
          <circle cx="50" cy="50" r="48" fill="#14171E" />
          {/* Top Petal - Red */}
          <path
            d="M50 12C57 26 57 38 50 48C43 38 43 26 50 12Z"
            fill="#EE3124"
          />
          {/* Right Petal - Green */}
          <path
            d="M88 50C74 57 62 57 52 50C62 43 74 43 88 50Z"
            fill="#00A651"
          />
          {/* Bottom Petal - Blue */}
          <path
            d="M50 88C43 74 43 62 50 52C57 62 57 74 50 88Z"
            fill="#0054A6"
          />
          {/* Left Petal - Yellow */}
          <path
            d="M12 50C26 43 38 43 48 50C38 57 26 57 12 50Z"
            fill="#FFF200"
          />
          <circle cx="50" cy="50" r="6" fill="#FFFFFF" />
        </svg>
      );

    case "video-editing":
      // Adobe Premiere Pro official logo (#9999FF)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Adobe Premiere Pro logo"
        >
          <rect width="100" height="100" rx="22" fill="#00005B" />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="19"
            stroke="#9999FF"
            strokeWidth="5"
          />
          <path
            d="M26 28V72H34V55H43C50.5 55 55 50.5 55 41.5C55 32.5 50.5 28 43 28H26ZM34 35H42C46 35 48 37.5 48 41.5C48 45.5 46 48 42 48H34V35Z"
            fill="#9999FF"
          />
          <path
            d="M60 43V72H68V54.5C68 50 70.5 48 74 48C75.5 48 77 48.5 78 49.2V41.8C76.8 41.3 75.2 41 73.5 41C70.2 41 68.5 42.8 67.5 46.2H67.2V43H60Z"
            fill="#9999FF"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // Brand & Content (Explore button: Coral / Orange #F97316)
    // -------------------------------------------------------------
    case "seo-and-search-visibility":
      // Google official 4-color Search G logo (#4285F4, #34A853, #FBBC05, #EA4335)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Google SEO logo"
        >
          <path
            d="M96 51C96 47.5 95.7 44.2 95.1 41H50V59.5H76.2C75 65.5 71.4 70.6 66 74.1V86H81.8C91.1 77.4 96 65.2 96 51Z"
            fill="#4285F4"
          />
          <path
            d="M50 98C63 98 73.9 93.7 81.8 86L66 74.1C61.6 77 56.2 78.8 50 78.8C37.5 78.8 26.9 70.3 23.1 59H6.8V71.6C14.7 87.2 31.1 98 50 98Z"
            fill="#34A853"
          />
          <path
            d="M23.1 59C22.1 56 21.6 52.8 21.6 49.5C21.6 46.2 22.1 43 23.1 40V27.4H6.8C3.5 34 1.6 41.5 1.6 49.5C1.6 57.5 3.5 65 6.8 71.6L23.1 59Z"
            fill="#FBBC05"
          />
          <path
            d="M50 20.2C57.1 20.2 63.5 22.6 68.5 27.4L82.2 13.7C73.8 5.9 62.9 1 50 1C31.1 1 14.7 11.8 6.8 27.4L23.1 40C26.9 28.7 37.5 20.2 50 20.2Z"
            fill="#EA4335"
          />
        </svg>
      );

    case "paid-advertising":
      // Google Ads official polygon logo (#4285F4, #FBBC04, #34A853)
      return (
        <svg
          viewBox="0 0 100 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Google Ads logo"
        >
          <path
            d="M19.5 72.8C28.6 88.6 48.7 94 64.5 84.9C80.3 75.8 85.7 55.7 76.6 39.9L49.1 0L19.5 72.8Z"
            fill="#FBBC04"
          />
          <path
            d="M80.5 72.8C71.4 88.6 51.3 94 35.5 84.9C19.7 75.8 14.3 55.7 23.4 39.9L50.9 0L80.5 72.8Z"
            fill="#4285F4"
          />
          <circle cx="21" cy="71" r="14" fill="#34A853" />
        </svg>
      );

    case "social-media":
      // Instagram official gradient camera logo (#833AB4 -> #FD1D1D -> #FCB045)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Instagram Social Media logo"
        >
          <defs>
            <radialGradient id="insta-radial" cx="30%" cy="105%" r="105%">
              <stop offset="0%" stopColor="#FCB045" />
              <stop offset="25%" stopColor="#FD1D1D" />
              <stop offset="60%" stopColor="#833AB4" />
              <stop offset="100%" stopColor="#405DE6" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" rx="26" fill="url(#insta-radial)" />
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="16"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="14"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            fill="none"
          />
          <circle cx="67" cy="33" r="4.2" fill="#FFFFFF" />
        </svg>
      );

    case "branding-and-graphic-design":
      // Adobe Illustrator official logo (#FF9A00)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Adobe Illustrator logo"
        >
          <rect width="100" height="100" rx="22" fill="#330000" />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="19"
            stroke="#FF9A00"
            strokeWidth="5"
          />
          <path
            d="M37 28L23 72H31.5L34.5 62H47.5L50.5 72H59L45 28H37ZM36.8 54L41 38.5L45.2 54H36.8Z"
            fill="#FF9A00"
          />
          <circle cx="68" cy="32" r="5" fill="#FF9A00" />
          <path d="M64 42H72V72H64V42Z" fill="#FF9A00" />
        </svg>
      );

    case "content-writing":
      // Grammarly official green logo (#15C39A)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Grammarly content writing logo"
        >
          <circle cx="50" cy="50" r="48" fill="#15C39A" />
          <path
            d="M72 49C71.5 37 61.5 28 50 28C37.8 28 28 37.8 28 50C28 62.2 37.8 72 50 72C61.5 72 70.8 63.6 71.8 52.5H62.5C61.5 58.5 56.2 63.2 50 63.2C42.7 63.2 36.8 57.3 36.8 50C36.8 42.7 42.7 36.8 50 36.8C56.2 36.8 61.3 41.2 62.3 47H52V55H75C75 52.8 74.5 50.8 72 49Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "digital-growth-partnership":
      // HubSpot official coral sprocket logo (#FF7A59)
      return (
        <svg
          viewBox="0 0 100 102"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="HubSpot Digital Growth logo"
        >
          <path
            d="M74.5 34.5V23.2C78.4 21.7 81.1 17.9 81.1 13.5C81.1 7.7 76.4 3 70.6 3C64.8 3 60.1 7.7 60.1 13.5C60.1 17.9 62.8 21.7 66.7 23.2V34.5C61.4 36.6 57.4 41.2 55.7 46.9L31.8 33.1C32 31.9 32.1 30.7 32.1 29.5C32.1 20.4 24.7 13 15.6 13C6.5 13 -0.9 20.4 -0.9 29.5C-0.9 38.6 6.5 46 15.6 46C18.8 46 21.8 45 24.2 43.4L48.1 57.2C47.4 60 47.4 63 48.1 65.8L24.2 79.6C21.8 78 18.8 77 15.6 77C6.5 77 -0.9 84.4 -0.9 93.5C-0.9 102.6 6.5 110 15.6 110C24.7 110 32.1 102.6 32.1 93.5C32.1 92.3 32 91.1 31.8 89.9L55.7 76.1C57.4 81.8 61.4 86.4 66.7 88.5V99.8C62.8 101.3 60.1 105.1 60.1 109.5C60.1 115.3 64.8 120 70.6 120C76.4 120 81.1 115.3 81.1 109.5C81.1 105.1 78.4 101.3 74.5 99.8V88.5C85.5 84.2 93.3 73.6 93.3 61C93.3 48.4 85.5 37.8 74.5 34.5ZM70.6 74C63.4 74 57.6 68.2 57.6 61C57.6 53.8 63.4 48 70.6 48C77.8 48 83.6 53.8 83.6 61C83.6 68.2 77.8 74 70.6 74Z"
            fill="#FF7A59"
            transform="scale(0.8) translate(10, 0)"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // Technology (Explore button: Cyan / Teal #06B6D4)
    // -------------------------------------------------------------
    case "custom-applications":
      // TypeScript official blue logo (#3178C6)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="TypeScript Custom Applications logo"
        >
          <rect width="100" height="100" rx="16" fill="#3178C6" />
          <path d="M23 37H47V45H39V75H29V45H23V37Z" fill="#FFFFFF" />
          <path
            d="M52 64C52 69 56 75.5 64 75.5C72 75.5 76 71 76 66C76 59 70 56 64 54C58 52 53.5 50.5 53.5 44C53.5 38.5 58 35.5 64.5 35.5C70.5 35.5 75 38.5 75.5 43.5H67C66.5 41.5 65 40.5 63.5 40.5C61.5 40.5 60 41.5 60 43.5C60 46 62.5 47 67.5 49C73.5 51.5 82.5 54 82.5 65C82.5 73.5 75.5 80 64.5 80C53 80 46 73 45.5 64H52Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "hosting-and-domains":
      // Cloudflare official vibrant orange double cloud (#F38020)
      return (
        <svg
          viewBox="0 0 100 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Cloudflare hosting logo"
        >
          <path
            d="M78.6 25.1C76.9 10.9 64.8 0 50.2 0C37.8 0 27.2 8 23.4 19.4C21.7 18.6 19.8 18.1 17.8 18.1C8 18.1 0 26.1 0 35.9C0 45.7 8 53.7 17.8 53.7H78.6C89.3 53.7 98 45 98 34.3C98 24.3 90.4 16.1 80.7 15.2C80.2 18.8 79.5 22 78.6 25.1Z"
            fill="#F38020"
            opacity="0.25"
          />
          <path
            d="M69.6 23.8C68.1 11.2 57.4 1.5 44.5 1.5C33.5 1.5 24.1 8.6 20.7 18.7C19.2 18 17.5 17.6 15.8 17.6C7.1 17.6 0 24.7 0 33.4C0 42.1 7.1 49.2 15.8 49.2H69.6C79.1 49.2 86.8 41.5 86.8 32C86.8 23.1 80 15.8 71.4 15C71 18.2 70.4 21 69.6 23.8Z"
            fill="#F38020"
          />
          <path
            d="M76 34.5L88 23C85 20 81 18.5 77 18.5L72.5 34.5H76Z"
            fill="#FAAE40"
          />
        </svg>
      );

    case "maintenance-and-support":
      // Docker official blue container whale (#2496ED)
      return (
        <svg
          viewBox="0 0 100 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Docker maintenance & support logo"
        >
          <g fill="#2496ED">
            <rect x="23" y="27" width="9" height="9" rx="1" />
            <rect x="34" y="27" width="9" height="9" rx="1" />
            <rect x="45" y="27" width="9" height="9" rx="1" />
            <rect x="12" y="38" width="9" height="9" rx="1" />
            <rect x="23" y="38" width="9" height="9" rx="1" />
            <rect x="34" y="38" width="9" height="9" rx="1" />
            <rect x="45" y="38" width="9" height="9" rx="1" />
            <rect x="56" y="38" width="9" height="9" rx="1" />
            <rect x="34" y="16" width="9" height="9" rx="1" />
            <path d="M98.6 44.8C95.5 42.9 88.6 42.5 84 45.4C82.5 41.1 78.5 38.3 75.2 39.5C73.8 40 73.1 41.4 72.5 43C69.5 48.5 61.2 50.5 53 50.5H5C2.2 50.5 0 52.7 0 55.5C0 71.5 13 84 42.5 84C69 84 91.5 66 98.8 47.5C99.2 46.5 99.1 45.1 98.6 44.8Z" />
          </g>
        </svg>
      );

    case "telecom-and-voip":
      // Twilio official red circular 4-dot logo (#F22F46)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Twilio telecom & VOIP logo"
        >
          <circle cx="50" cy="50" r="48" stroke="#F22F46" strokeWidth="8" />
          <circle cx="37" cy="37" r="9" fill="#F22F46" />
          <circle cx="63" cy="37" r="9" fill="#F22F46" />
          <circle cx="37" cy="63" r="9" fill="#F22F46" />
          <circle cx="63" cy="63" r="9" fill="#F22F46" />
        </svg>
      );

    case "infrastructure-support":
      // Kubernetes official blue 7-spoke helm wheel (#326CE5)
      return (
        <svg
          viewBox="0 0 100 98"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Kubernetes infrastructure support logo"
        >
          <path
            d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z"
            fill="#326CE5"
            opacity="0.12"
          />
          <path
            d="M50 12L85 32V72L50 92L15 72V32L50 12Z"
            stroke="#326CE5"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Helm wheel center & 7 spokes */}
          <circle cx="50" cy="52" r="14" fill="#326CE5" />
          <circle cx="50" cy="52" r="6" fill="#FFFFFF" />
          <path
            d="M50 20V38M50 66V84M22 36L38 45M62 59L78 68M22 68L38 59M62 45L78 36"
            stroke="#326CE5"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "business-systems":
      // Salesforce official blue cloud logo (#00A1E0)
      return (
        <svg
          viewBox="0 0 100 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Salesforce business systems logo"
        >
          <path
            d="M41 11C47.2 4.2 56.4 0 66.5 0C80.2 0 91.8 8.8 95.8 21.2C98.4 23.4 100 26.6 100 30.2C100 36.8 94.6 42.2 88 42.2C87.2 42.2 86.4 42.1 85.6 41.9C83.2 52.8 73.5 61 62 61C57.8 61 54 59.9 50.6 57.9C47.4 65.1 40.2 70 32 70C20.4 70 11 60.6 11 49C11 47.9 11.1 46.9 11.3 45.9C4.8 44.5 0 38.8 0 32C0 24.3 6.3 18 14 18C15.2 18 16.4 18.2 17.5 18.5C21.8 13.9 28 11 34.8 11C37 11 39.1 11.4 41 11Z"
            fill="#00A1E0"
          />
          <path
            d="M38.5 28.5C40 25.5 43.5 23.5 47.5 23.5C52.5 23.5 56.5 26.5 58 31"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "extensions-and-integrations":
      // Zapier official vibrant orange asterisk logo (#FF4F00)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Zapier integrations logo"
        >
          <circle cx="50" cy="50" r="48" fill="#FF4F00" opacity="0.1" />
          <path
            d="M50 6V94M6 50H94M18.9 18.9L81.1 81.1M18.9 81.1L81.1 18.9"
            stroke="#FF4F00"
            strokeWidth="15"
            strokeLinecap="round"
          />
        </svg>
      );

    case "ai-assisted-experiences":
      // OpenAI official teal/green rosette logo (#10A37F)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="OpenAI AI-assisted experiences logo"
        >
          <path
            d="M88.5 41.5C87.4 34.5 83 28.5 76.5 25.1C75.2 18.6 71.3 12.8 65.5 9.1C59.7 5.4 52.4 4.2 45.6 5.8C42.2 1.9 37.1 -0.2 31.9 0C25.5 0.3 19.6 4 16.2 9.7C9.9 12.6 5.4 18.3 4 25.1C-0.3 30.5 -1.2 37.8 1.4 44.1C0.3 51.1 2.7 58.2 7.7 63.2C6.4 69.7 8.3 76.5 12.9 81.4C17.5 86.3 24.3 88.8 31 88.2C34.4 92.1 39.5 94.2 44.7 94C51.1 93.7 57 90 60.4 84.3C66.7 81.4 71.2 75.7 72.6 68.9C76.9 63.5 77.8 56.2 75.2 49.9C76.3 42.9 73.9 35.8 88.5 41.5Z"
            fill="#10A37F"
            opacity="0.08"
          />
          <g
            stroke="#10A37F"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M49 29.5V47.5L64.5 56.5M64.5 56.5L49 65.5L33.5 56.5V38.5L49 29.5Z" />
            <path d="M49 12V29.5M81.5 30.8L66 39.8M81.5 69.2L66 60.2M49 88V70.5M16.5 69.2L32 60.2M16.5 30.8L32 39.8" />
          </g>
        </svg>
      );

    default:
      // High-quality fallback icon
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m10 15 5-3-5-3v6Z" />
        </svg>
      );
  }
}
