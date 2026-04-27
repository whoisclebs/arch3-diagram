const sidebars = {
  mainSidebar: [
    "intro",
    {
      type: "category",
      label: "Methodology",
      items: ["methodology/arch3", "methodology/layers"],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/official-notation",
        "reference/canonical-model",
        "reference/diagram-as-code",
        "reference/fixtures-catalog",
        "reference/test-and-acceptance",
        "reference/visual-contract",
        "reference/plantuml-renderer",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: ["guides/first-diagram", "guides/ai-first-workflow"],
    },
  ],
};

export default sidebars;
