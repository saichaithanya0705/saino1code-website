import { CodeBlock } from "@/components/code-block"

const examples = {
  inlineCompletion: `{
  "saino1code.enableAutoCompletion": true,
  "saino1code.completionModel": "qwen/qwen-3-coder-480b-instruct",
  "saino1code.completionDelay": 300,
  "saino1code.inlineCompletionEnabled": true
}`,
  customModelApi: `{
  "sainocode.customProviders": [
    {
      "name": "MyOpenAI",
      "type": "openai",
      "apiKey": "sk-...",
      "baseUrl": "https://api.openai.com/v1",
      "models": ["gpt-4-turbo", "gpt-3.5-turbo"]
    },
    {
      "name": "LocalOllama",
      "type": "ollama",
      "baseUrl": "http://localhost:11434",
      "models": ["codellama:70b", "deepseek-coder:33b"]
    },
    {
      "name": "GroqFast",
      "type": "groq",
      "apiKey": "gsk_...",
      "models": ["llama3-70b-8192", "mixtral-8x7b-32768"]
    }
  ]
}`,
  collaborationApi: `// Start shared coding session
await sainocode.collaboration.startSession({
  teamId: "my-team",
  workspaceId: "project-alpha",
  permissions: ["read", "write", "execute"],
  inviteUsers: ["user@example.com"]
});

// Share context with team
await sainocode.context.shareWithTeam({
  contextId: "current-workspace",
  teamMembers: ["alice", "bob"],
  expiresIn: "24h"
});`,
  ragSystem: `// Query codebase with semantic search
const results = await sainocode.rag.search({
  query: "authentication middleware implementation",
  maxResults: 10,
  minSimilarity: 0.7,
  filters: {
    fileType: ["ts", "js"],
    excludePaths: ["node_modules", "dist"]
  }
});

// Index new documents
await sainocode.rag.indexFiles({
  paths: ["src/**/*.ts"],
  options: {
    chunkSize: 1000,
    chunkOverlap: 200,
    extractSymbols: true
  }
});`
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Integrations & API Examples</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          See how SaiNo1Code can be configured and programmatically controlled to fit your exact workflow.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-4">Cursor-Style Chat & Commands</h2>
          <p className="text-muted-foreground mb-6">
            Use our side panel chat for codebase-aware conversations and execute powerful commands like <code>/edit</code>, <code>/fix</code>, <code>/test</code>, and <code>/explain</code> to refactor, debug, and understand code inline.
          </p>
          <div className="rounded-lg border bg-card text-card-foreground p-8 text-center">
            [Visual of Side Panel Chat UI Placeholder]
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">GitHub Copilot-Style Inline Completion</h2>
          <p className="text-muted-foreground mb-6">
            Enable lightning-fast, multi-line code completions directly in your editor. Here’s a sample configuration from your VS Code <code>settings.json</code>:
          </p>
          <CodeBlock code={examples.inlineCompletion} language="json" />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Custom Model API Integration</h2>
          <p className="text-muted-foreground mb-6">
            Bring your own models from any provider. SaiNo1Code supports custom endpoints for OpenAI, Groq, Ollama, and any other service with a compatible API.
          </p>
          <CodeBlock code={examples.customModelApi} language="json" />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Collaboration API</h2>
          <p className="text-muted-foreground mb-6">
            Programmatically manage real-time collaborative sessions and share AI context across your team.
          </p>
          <CodeBlock code={examples.collaborationApi} language="typescript" />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">RAG System Integration</h2>
          <p className="text-muted-foreground mb-6">
            Tap into the power of our Retrieval-Augmented Generation engine to perform semantic searches and manage the indexed context of your codebase.
          </p>
          <CodeBlock code={examples.ragSystem} language="typescript" />
        </section>
      </div>
    </div>
  )
}