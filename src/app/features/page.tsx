import { Bot, BrainCircuit, Code, Users, Shield, Zap, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "Multi-Model AI Brain",
    description: "Intelligently route tasks to the best model for the job, from GLM-4.5 for planning to Qwen3-Coder for advanced code generation. Supports custom APIs from OpenAI, Groq, and more.",
    link: "/docs/core-concepts/multi-model-brain"
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: "Production Context Engine",
    description: "Achieve deep codebase understanding with HNSW vector search, real-time file monitoring, and 1M+ token context windows. Powered by a Turso + Qdrant architecture for sub-200ms retrieval.",
    link: "/docs/core-concepts/context-engine"
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "MAGNETO Multi-Agent Orchestration",
    description: "Deploy a team of 6 specialized AI agents to autonomously plan, execute, test, debug, and document code, all with human-in-the-loop oversight for complete control.",
    link: "/docs/core-concepts/magneto-orchestration"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Real-Time Collaboration",
    description: "Share workspaces and AI context with your team in real-time. Features presence awareness, cursor tracking, and Operational Transform for conflict-free collaborative coding.",
    link: "/docs/features/collaboration"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Universal Tool Registry",
    description: "Access over 60 integrated tools for development, web access, documentation, and analysis. Our system features dynamic tool routing, load balancing, and runtime discovery.",
    link: "/docs/features/tool-registry"
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Enterprise-Grade Security",
    description: "Operate with confidence in a sandboxed execution environment with RBAC, OWASP Top 10 LLM compliance, audit logging, and data encryption at rest and in transit. SOC 2 available.",
    link: "/docs/security"
  }
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">A Revolutionary Way to Code</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          SaiNo1Code isn't just an autocompletion tool. It's a comprehensive, enterprise-ready AI platform designed to handle the entire development lifecycle.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="p-8 border rounded-xl bg-card text-card-foreground flex flex-col items-start hover:shadow-lg transition-shadow">
            <div className="mb-4">
              {feature.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
            <p className="text-muted-foreground flex-grow mb-4">{feature.description}</p>
            <a href={feature.link} className="text-sm font-semibold text-primary hover:underline">
              Learn more &rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Visual Diagram Placeholder */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold">Visualizing the Power</h2>
        <p className="mt-4 text-muted-foreground">This diagram shows how our components work in concert.</p>
        <div className="mt-8 w-full h-96 bg-slate-100 dark:bg-slate-800 border-2 border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">[Visual Diagram of AI Brain & Agent System Placeholder]</p>
        </div>
      </div>
    </div>
  );
}