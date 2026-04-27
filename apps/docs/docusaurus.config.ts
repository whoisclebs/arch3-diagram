import type { Config } from "@docusaurus/types";

const config: Config = {
  title: "arch3-diagram",
  tagline: "AI-first architecture diagramming in three layers",
  url: "https://whoisclebs.github.io",
  baseUrl: "/arch3-diagram/",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  organizationName: "whoisclebs",
  projectName: "arch3-diagram",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "pt-BR"],
    localeConfigs: {
      en: {
        label: "English",
        htmlLang: "en-US",
      },
      es: {
        label: "Español",
        htmlLang: "es-ES",
      },
      "pt-BR": {
        label: "Português (Brasil)",
        htmlLang: "pt-BR",
      },
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: "arch3-diagram",
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/whoisclebs/arch3-diagram",
          label: "GitHub",
          position: "right",
        },
      ],
    },
  },
};

export default config;
