import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - iTour',
  description: 'Privacy Policy for the iTour mobile application',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            &larr; Back to iTour
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last Updated: December 30, 2024</p>

          <div className="prose prose-gray max-w-none">
            <p>
              iTour LLC (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the iTour mobile application
              (the &ldquo;App&rdquo;). This Privacy Policy explains how we collect, use, and protect information
              when you use our App.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information Stored Locally on Your Device</h3>
            <p>The App stores the following data locally on your device to provide functionality:</p>
            <ul>
              <li><strong>Language Preferences</strong>: Your selected tour language</li>
              <li><strong>Downloaded Content</strong>: Tour information, stop descriptions, and images for offline access</li>
              <li><strong>Audio Cache</strong>: Text-to-speech audio files for performance optimization</li>
            </ul>
            <p>This data is stored only on your device and is not transmitted to our servers.</p>

            <h3>Information Processed by Third-Party Services</h3>
            <p>When you use certain features, data may be processed by third-party services:</p>
            <ul>
              <li>
                <strong>Google Cloud Translation API</strong>: When translating tour content, the text is sent
                to Google&apos;s servers for processing. See{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Google Cloud Text-to-Speech API</strong>: When generating audio narration, text content
                is sent to Google&apos;s servers. See{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Supabase</strong>: Tour content, stop information, and images are retrieved from our
                Supabase backend. No personal user data is collected or stored.
              </li>
            </ul>

            <h3>Information We Do NOT Collect</h3>
            <p>We do not collect:</p>
            <ul>
              <li>Personal identification information (name, email, phone number)</li>
              <li>Location data or GPS coordinates</li>
              <li>Device identifiers or advertising IDs</li>
              <li>Usage analytics or behavioral data</li>
              <li>Payment information (donations are processed entirely by Stripe)</li>
            </ul>

            <h2>Donations</h2>
            <p>
              If you choose to make a donation through the App, you will be redirected to Stripe&apos;s secure
              payment platform. We do not collect, process, or store any payment information. See{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                Stripe&apos;s Privacy Policy
              </a>.
            </p>

            <h2>Data Retention</h2>
            <ul>
              <li>
                <strong>Local Data</strong>: Data stored on your device remains until you clear the App&apos;s
                cache, delete downloaded content, or uninstall the App.
              </li>
              <li>
                <strong>Server Data</strong>: We do not store any personal user data on our servers.
              </li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              The App does not knowingly collect information from children under 13. The App is designed
              for general audiences visiting historic sites.
            </p>

            <h2>Your Rights</h2>
            <p>
              Since we do not collect personal data, there is no personal information to access, modify,
              or delete. You can clear locally stored data at any time through the App&apos;s settings or by
              uninstalling the App.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p>
              <strong>iTour LLC</strong><br />
              Email:{' '}
              <a href="mailto:support@itourapp.com">support@itourapp.com</a>
            </p>

            <h2>Third-Party Service Links</h2>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                  Stripe Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                  Supabase Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          {' '}&middot;{' '}
          <span>&copy; {new Date().getFullYear()} iTour LLC</span>
        </div>
      </div>
    </div>
  )
}
