export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="prose dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: October 05, 2025</p>

        <p className="text-destructive font-bold">
          [This is a template. You must replace this content with your own privacy policy and have it reviewed by a legal professional.]
        </p>

        <p>
          Welcome to SaiNo1Code ("us", "we", or "our"). We operate the https://sainocode.com website (the "Service").
          This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <h2>1. Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>
        <h3>Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Cookies and Usage Data</li>
          <li>Code snippets and context data required for the extension to function</li>
        </ul>
        <h4>Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
        </p>

        <h2>2. Use of Data</h2>
        <p>
          SaiNo1Code uses the collected data for various purposes:
        </p>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our Service</li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. All code processed by our AI models is handled in ephemeral, sandboxed environments and is not stored long-term.
        </p>

        <h2>4. Service Providers</h2>
        <p>
          We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
        </p>
        <ul>
            <li><strong>Supabase:</strong> For authentication and database management.</li>
            <li><strong>Stripe:</strong> For payment and subscription processing.</li>
        </ul>

        <h2>5. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul>
          <li>By email: support@sainocode.com</li>
        </ul>
      </div>
    </div>
  );
}