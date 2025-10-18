import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const featuredPost = {
  slug: "deep-dive-into-magneto",
  title: "A Deep Dive into the MAGNETO Multi-Agent System",
  description: "Explore the architecture and design decisions behind our groundbreaking multi-agent orchestration system that's changing how developers write, test, and deploy code.",
  author: "Lead Engineer",
  date: "October 05, 2025",
};

const blogPosts = [
  {
    slug: "optimizing-context-retrieval",
    title: "Optimizing Context Retrieval with HNSW Vector Search",
    description: "Learn how we achieve sub-200ms retrieval times on codebases with millions of tokens.",
    author: "AI Researcher",
    date: "September 28, 2025",
  },
  {
    slug: "multi-model-brain-internals",
    title: "The Internals of our Multi-Model AI Brain",
    description: "A look at how we use a Mixture of Experts (MoE) to route tasks to the most effective and efficient AI model.",
    author: "Founding Engineer",
    date: "September 15, 2025",
  },
  {
    slug: "securing-enterprise-ai",
    title: "Best Practices for Securing Enterprise-Grade AI Assistants",
    description: "Security is not an afterthought. Here's how we approach it, from sandboxed execution to SOC 2 compliance.",
    author: "Security Lead",
    date: "September 01, 2025",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">The SaiNo1Code Blog</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Engineering insights, product updates, and the future of AI in software development.
        </p>
      </div>

      {/* Featured Post */}
      <Card className="mb-16 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="p-8 flex flex-col justify-center">
          <CardHeader className="p-0">
            <CardDescription>Featured Post</CardDescription>
            <CardTitle className="text-3xl font-bold mt-2">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                {featuredPost.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground">{featuredPost.description}</p>
          </CardContent>
          <CardFooter className="p-0 mt-4">
            <p className="text-sm text-muted-foreground">{featuredPost.author} &bull; {featuredPost.date}</p>
          </CardFooter>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 min-h-[200px] md:min-h-full">
          {/* Placeholder for an image */}
        </div>
      </Card>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.description}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">{post.author} &bull; {post.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}