export default function DocsIndexPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold">Introduction</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Welcome to the official documentation for SaiNo1Code.
      </p>
      <hr className="my-6" />
      <p>
        This documentation is your comprehensive guide to mastering SaiNo1Code, the enterprise-grade AI coding assistant for VS Code. Whether you're just getting started or you're an advanced user looking to leverage custom APIs and multi-agent systems, you'll find everything you need right here.
      </p>
      <h2 className="text-2xl font-semibold mt-8">What You'll Find Inside</h2>
      <ul>
        <li>
          <strong>Getting Started:</strong> A step-by-step guide to installing, configuring, and making your first AI-powered code generation.
        </li>
        <li>
          <strong>Core Concepts:</strong> Deep dives into the fundamental technologies that make SaiNo1Code so powerful, including our Multi-Model AI Brain and the RAG Context Engine.
        </li>
        <li>
          <strong>Feature Guides:</strong> Detailed walkthroughs of key features like collaborative coding, semantic search, and automated test generation.
        </li>
        <li>
          <strong>Custom API Integration:</strong> Instructions on how to connect your own models from providers like OpenAI, Groq, or a local Ollama instance.
        </li>
      </ul>
      <p>
        Use the sidebar navigation to explore the different sections. If you can't find what you're looking for, please visit our support center or join our community.
      </p>
    </div>
  )
}