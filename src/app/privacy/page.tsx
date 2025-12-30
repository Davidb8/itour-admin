import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - iTour',
  description: 'Privacy Policy for the iTour mobile application',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">iTour</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white text-sm font-medium">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">Last Updated: December 30, 2024</p>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 text-lg leading-relaxed">
              iTour LLC (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the iTour mobile application
              (the &ldquo;App&rdquo;). This Privacy Policy explains how we collect, use, and protect information
              when you use our App.
            </p>

            <Section title="Information We Collect">
              <Subsection title="Information Stored Locally on Your Device">
                <p>The App stores the following data locally on your device to provide functionality:</p>
                <ul>
                  <li><strong>Language Preferences</strong> &mdash; Your selected tour language</li>
                  <li><strong>Downloaded Content</strong> &mdash; Tour information, stop descriptions, and images for offline access</li>
                  <li><strong>Audio Cache</strong> &mdash; Text-to-speech audio files for performance optimization</li>
                </ul>
                <p>This data is stored only on your device and is not transmitted to our servers.</p>
              </Subsection>

              <Subsection title="Information Processed by Third-Party Services">
                <p>When you use certain features, data may be processed by third-party services:</p>
                <ul>
                  <li>
                    <strong>Google Cloud Translation API</strong> &mdash; When translating tour content, the text is sent
                    to Google&apos;s servers for processing.{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                      View Google&apos;s Privacy Policy &rarr;
                    </a>
                  </li>
                  <li>
                    <strong>Google Cloud Text-to-Speech API</strong> &mdash; When generating audio narration, text content
                    is sent to Google&apos;s servers.{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                      View Google&apos;s Privacy Policy &rarr;
                    </a>
                  </li>
                  <li>
                    <strong>Supabase</strong> &mdash; Tour content, stop information, and images are retrieved from our
                    backend. No personal user data is collected or stored.
                  </li>
                </ul>
              </Subsection>

              <Subsection title="Information We Do NOT Collect">
                <p>We do not collect:</p>
                <ul>
                  <li>Personal identification information (name, email, phone number)</li>
                  <li>Location data or GPS coordinates</li>
                  <li>Device identifiers or advertising IDs</li>
                  <li>Usage analytics or behavioral data</li>
                  <li>Payment information (donations are processed entirely by Stripe)</li>
                </ul>
              </Subsection>
            </Section>

            <Section title="Donations">
              <p>
                If you choose to make a donation through the App, you will be redirected to Stripe&apos;s secure
                payment platform. We do not collect, process, or store any payment information.{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                  View Stripe&apos;s Privacy Policy &rarr;
                </a>
              </p>
            </Section>

            <Section title="Data Retention">
              <ul>
                <li>
                  <strong>Local Data</strong> &mdash; Data stored on your device remains until you clear the App&apos;s
                  cache, delete downloaded content, or uninstall the App.
                </li>
                <li>
                  <strong>Server Data</strong> &mdash; We do not store any personal user data on our servers.
                </li>
              </ul>
            </Section>

            <Section title="Children's Privacy">
              <p>
                The App does not knowingly collect information from children under 13. The App is designed
                for general audiences visiting historic sites.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>
                Since we do not collect personal data, there is no personal information to access, modify,
                or delete. You can clear locally stored data at any time through the App&apos;s settings or by
                uninstalling the App.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 mt-4">
                <p className="text-white font-semibold mb-1">iTour LLC</p>
                <a href="mailto:support@itourapp.com" className="text-blue-400 hover:text-blue-300">
                  support@itourapp.com
                </a>
              </div>
            </Section>

            <Section title="Third-Party Services">
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block no-underline"
                >
                  <p className="text-white font-medium mb-1">Google</p>
                  <p className="text-slate-400 text-sm">Privacy Policy</p>
                </a>
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block no-underline"
                >
                  <p className="text-white font-medium mb-1">Stripe</p>
                  <p className="text-slate-400 text-sm">Privacy Policy</p>
                </a>
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block no-underline"
                >
                  <p className="text-white font-medium mb-1">Supabase</p>
                  <p className="text-slate-400 text-sm">Privacy Policy</p>
                </a>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} iTour LLC</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white text-sm font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:support@itourapp.com" className="text-slate-400 hover:text-white text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-700/50">{title}</h2>
      <div className="text-slate-300 space-y-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:transition-colors">
        {children}
      </div>
    </div>
  )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-lg font-medium text-slate-200 mb-3">{title}</h3>
      <div className="text-slate-300 space-y-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:transition-colors">
        {children}
      </div>
    </div>
  )
}
