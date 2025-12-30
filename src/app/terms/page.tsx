import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - iTour',
  description: 'Terms of Service for the iTour mobile application',
}

export default function TermsPage() {
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
              <Link href="/privacy" className="text-slate-300 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-white text-sm font-medium">
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400 mb-8">Last Updated: December 30, 2024</p>

          <div className="prose prose-invert prose-slate max-w-none">
            <Section title="Acceptance of Terms">
              <p>
                By downloading or using the iTour mobile application (&ldquo;App&rdquo;), you agree to be bound
                by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not
                use the App.
              </p>
            </Section>

            <Section title="Description of Service">
              <p>
                iTour provides self-guided audio tours of historic sites. The App includes text descriptions,
                images, and audio narration of tour stops. The App is provided by iTour LLC.
              </p>
            </Section>

            <Section title="Use of the App">
              <p>You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul>
                <li>Copy, modify, distribute, or create derivative works based on the App&apos;s content without permission</li>
                <li>Attempt to reverse engineer, decompile, or extract source code from the App</li>
                <li>Use the App in any way that could damage, disable, or impair the service</li>
                <li>Use any automated system to access the App in a manner that sends more requests than a human could reasonably produce</li>
                <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices</li>
              </ul>
            </Section>

            <Section title="Intellectual Property">
              <p>
                All content in the App, including but not limited to text, images, audio, graphics, logos,
                and software, is owned by iTour LLC or our content licensors and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p>
                Historical information and photographs may be used with permission from historic site
                operators and archives. All rights reserved.
              </p>
            </Section>

            <Section title="Offline Content">
              <p>
                The App allows you to download tour content for offline use. Downloaded content is for
                personal, non-commercial use only and remains subject to these Terms.
              </p>
            </Section>

            <Section title="Donations">
              <p>
                Donations made through the App are voluntary contributions to support historic preservation.
                Donations are processed by Stripe and are subject to{' '}
                <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">
                  Stripe&apos;s Terms of Service
                </a>.
              </p>
              <p>
                Donations are generally non-refundable. If you believe a donation was made in error,
                please contact us at{' '}
                <a href="mailto:support@itourapp.com">support@itourapp.com</a>.
              </p>
            </Section>

            <Section title="Disclaimer of Warranties">
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6">
                <p className="text-slate-300 text-sm uppercase tracking-wide mb-2 font-medium">Legal Notice</p>
                <p>
                  THE APP IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
              <p className="mt-4">
                We do not warrant that the App will be uninterrupted, error-free, or free of viruses or
                other harmful components. We do not guarantee the accuracy, completeness, or usefulness
                of any historical information provided in the App.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, iTour LLC shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                whether incurred directly or indirectly, resulting from:
              </p>
              <ul>
                <li>Your use or inability to use the App</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any errors or omissions in the App&apos;s content</li>
                <li>Any third-party content or conduct</li>
              </ul>
            </Section>

            <Section title="Indemnification">
              <p>
                You agree to indemnify and hold harmless iTour LLC and its officers, directors, employees,
                and agents from any claims, damages, losses, or expenses arising from your use of the App
                or violation of these Terms.
              </p>
            </Section>

            <Section title="Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material
                changes by updating the &ldquo;Last Updated&rdquo; date. Your continued use of the App after
                changes constitutes acceptance of the new Terms.
              </p>
            </Section>

            <Section title="Termination">
              <p>
                We may terminate or suspend your access to the App at any time, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or
                third parties.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State
                of Alabama, United States, without regard to its conflict of law provisions.
              </p>
            </Section>

            <Section title="Severability">
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions
                will continue in full force and effect.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>If you have questions about these Terms, please contact us:</p>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 mt-4">
                <p className="text-white font-semibold mb-1">iTour LLC</p>
                <a href="mailto:support@itourapp.com" className="text-blue-400 hover:text-blue-300">
                  support@itourapp.com
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
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white text-sm font-medium">
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
