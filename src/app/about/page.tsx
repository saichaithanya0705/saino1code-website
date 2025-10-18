import { Users, Target, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">About SaiNo1Code</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          We are on a mission to build the most powerful and intuitive AI coding assistant for professional developers and enterprise teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mt-2 text-muted-foreground">
            To accelerate the world's transition to AI-native software development by creating tools that are not just smart, but deeply understand the context of complex, production-grade codebases.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Code className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Our Philosophy</h2>
          <p className="mt-2 text-muted-foreground">
            We believe in the power of open-source models, the importance of enterprise-grade security, and the necessity of a developer-first user experience. Speed, accuracy, and control are at the core of everything we build.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Our Team</h2>
          <p className="mt-2 text-muted-foreground">
            We are a small, dedicated team of engineers, researchers, and designers passionate about the future of AI in software engineering. We've contributed to major open-source projects and have years of experience building scalable systems.
          </p>
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold">Join Us on Our Journey</h2>
        <p className="mt-4 text-muted-foreground">We're always looking for talented individuals to join our team.</p>
        <div className="mt-6">
            <a href="#" className="text-primary font-semibold hover:underline">
                View Open Positions &rarr;
            </a>
        </div>
      </div>
    </div>
  );
}