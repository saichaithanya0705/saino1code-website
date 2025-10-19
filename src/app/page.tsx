import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Code, Zap } from "lucide-react";
import Link from "next/link";
import { StartTrialButton } from "@/components/start-trial-button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Enterprise AI Coding with Sub-40ms Response Times
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
            SaiNo1Code is an enterprise-grade AI coding assistant that supercharges your development workflow with its multi-model brain, massive context windows, and real-time collaboration.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <StartTrialButton />
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
                <Link href="#">Install Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trusted by developers at</p>
            <div className="mt-6 flex justify-center items-center gap-x-8 md:gap-x-12 lg:gap-x-16 opacity-75">
                {/* Placeholder logos */}
                <span className="font-bold text-2xl">Company A</span>
                <span className="font-bold text-2xl">Startup B</span>
                <span className="font-bold text-2xl">Enterprise C</span>
                <span className="font-bold text-2xl">Scaleup D</span>
                <span className="font-bold text-2xl">Team E</span>
            </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Why SaiNo1Code is Different</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We've built a production-ready context engine and multi-agent system from the ground up.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-card text-card-foreground">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Multi-Model AI Brain</h3>
              <p className="mt-2 text-muted-foreground">
                Leverage the best models like GLM-4.5, Qwen3-Coder, and DeepSeek-V3, plus bring your own custom APIs.
              </p>
            </div>
            <div className="p-6 border rounded-lg bg-card text-card-foreground">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">1M+ Token Context Windows</h3>
              <p className="mt-2 text-muted-foreground">
                Our production context engine with HNSW vector search gives the AI a deep understanding of your entire codebase.
              </p>
            </div>
            <div className="p-6 border rounded-lg bg-card text-card-foreground">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">MAGNETO Orchestration</h3>
              <p className="mt-2 text-muted-foreground">
                An autonomous multi-agent system that can plan, execute, test, and debug code with human-in-the-loop oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Engineering Teams</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Don't just take our word for it. Here's what developers are saying about SaiNo1Code.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <p className="text-muted-foreground">"The context engine is a game-changer. It understands our monorepo better than some of our junior devs. Productivity is up 30%."</p>
                <div className="mt-4 font-semibold">- Lead Engineer, Enterprise C</div>
            </div>
             <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <p className="text-muted-foreground">"I've tried every AI assistant out there. SaiNo1Code's speed and multi-model approach make it the clear winner for serious development."</p>
                <div className="mt-4 font-semibold">- Staff Engineer, Scaleup D</div>
            </div>
             <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <p className="text-muted-foreground">"The ability to bring our own fine-tuned models via a custom API endpoint is exactly the enterprise feature we needed."</p>
                <div className="mt-4 font-semibold">- CTO, Startup B</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}