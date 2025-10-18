export default function StatusPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">System Status</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          [Placeholder content for the Status page.]
        </p>
        <div className="mt-8 p-6 border rounded-lg bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
          <p className="font-bold text-lg">All Systems Operational</p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          This page will be replaced by a dedicated status monitoring service like Better Uptime or StatusPage.io.
        </p>
      </div>
    </div>
  )
}