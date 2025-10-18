export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          [Placeholder content for the Contact Us page.]
        </p>
         <p className="mt-4">
          For sales inquiries, please email <a href="mailto:sales@sainocode.com" className="text-primary underline">sales@sainocode.com</a>.
        </p>
         <p className="mt-2">
          For support questions, please visit our <a href="/support" className="text-primary underline">Support Center</a> or email <a href="mailto:support@sainocode.com" className="text-primary underline">support@sainocode.com</a>.
        </p>
      </div>
    </div>
  )
}