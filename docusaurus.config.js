// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AgentKit',
  tagline: 'A CLI package manager for Claude AI agent skills',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://fagom.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/agentkit/',

  // GitHub pages deployment config.
  organizationName: 'fagom',
  projectName: 'agentkit',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/fagom/agentkit/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/agentkit-social-card.jpg',
      navbar: {
        title: 'AgentKit',
        logo: {
          alt: 'AgentKit Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/fagom/agentkit',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.npmjs.com/package/@fagom174/agentkit',
            label: 'npm',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Commands',
                to: '/docs/commands',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/fagom/agentkit/issues',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/fagom/agentkit/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'npm Package',
                href: 'https://www.npmjs.com/package/@fagom174/agentkit',
              },
              {
                label: 'GitHub Repository',
                href: 'https://github.com/fagom/agentkit',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AgentKit. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
