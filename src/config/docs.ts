export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
};

export type DocsConfig = {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/getting-started/installation",
        },
        {
          title: "Configuration",
          href: "/docs/getting-started/configuration",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Multi-Model AI Brain",
          href: "/docs/core-concepts/multi-model-brain",
        },
        {
          title: "RAG Context Engine",
          href: "/docs/core-concepts/context-engine",
        },
        {
          title: "Agent Orchestration",
          href: "/docs/core-concepts/agent-orchestration",
        },
      ],
    },
    {
        title: "Feature Guides",
        items: [
            {
                title: "Code Generation",
                href: "/docs/features/code-generation",
            },
            {
                title: "Semantic Search",
                href: "/docs/features/semantic-search",
            },
            {
                title: "Collaborative Coding",
                href: "/docs/features/collaboration",
            }
        ]
    },
    {
      title: "Custom API Integration",
      items: [
        {
          title: "OpenAI",
          href: "/docs/custom-api/openai",
        },
        {
          title: "Groq",
          href: "/docs/custom-api/groq",
        },
        {
          title: "Ollama (Local)",
          href: "/docs/custom-api/ollama",
        },
      ],
    },
  ],
};