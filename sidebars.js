/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in the sidebar
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'installation',
        'quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Documentation',
      items: [
        'commands',
        'configuration',
        'version-ranges',
      ],
    },
    {
      type: 'category',
      label: 'Creating Skills',
      items: [
        'skill-format',
      ],
    },
  ],
};

module.exports = sidebars;
