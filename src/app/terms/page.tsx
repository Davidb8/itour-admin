import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - iTour',
  description: 'Terms of Service for the iTour mobile application',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            &larr; Back to iTour
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last Updated: December 30, 2024</p>

          <div className="prose prose-gray max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By downloading or using the iTour mobile application (&ldquo;App&rdquo;), you agree to be bound
              by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not
              use the App.
            </p>

            <h2>Description of Service</h2>
            <p>
              iTour provides self-guided audio tours of historic sites. The App includes text descriptions,
              images, and audio narration of tour stops. The App is provided by iTour LLC.
            </p>

            <h2>Use of the App</h2>
            <p>You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Copy, modify, distribute, or create derivative works based on the App&apos;s content without permission</li>
              <li>Attempt to reverse engineer, decompile, or extract source code from the App</li>
              <li>Use the App in any way that could damage, disable, or impair the service</li>
              <li>Use any automated system to access the App in a manner that sends more requests than a human could reasonably produce</li>
              <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content in the App, including but not limited to text, images, audio, graphics, logos,
              and software, is owned by iTour LLC or our content licensors and is protected by copyright,
              trademark, and other intellectual property laws.
            </p>
            <p>
              Historical information and photographs may be used with permission from historic site
              operators and archives. All rights reserved.
            </p>

            <h2>Offline Content</h2>
            <p>
              The App allows you to download tour content for offline use. Downloaded content is for
              personal, non-commercial use only and remains subject to these Terms.
            </p>

            <h2>Donations</h2>
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

            <h2>Disclaimer of Warranties</h2>
            <p>
              THE APP IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the App will be uninterrupted, error-free, or free of viruses or
              other harmful components. We do not guarantee the accuracy, completeness, or usefulness
              of any historical information provided in the App.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, ITOUR LLC SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
              WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul>
              <li>Your use or inability to use the App</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any errors or omissions in the App&apos;s content</li>
              <li>Any third-party content or conduct</li>
            </ul>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless iTour LLC and its officers, directors, employees,
              and agents from any claims, damages, losses, or expenses arising from your use of the App
              or violation of these Terms.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material
              changes by updating the &ldquo;Last Updated&rdquo; date. Your continued use of the App after
              changes constitutes acceptance of the new Terms.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to the App at any time, without prior notice,
              for conduct that we believe violates these Terms or is harmful to other users, us, or
              third parties.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State
              of Alabama, United States, without regard to its conflict of law provisions.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions
              will continue in full force and effect.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about these Terms, please contact us at:</p>
            <p>
              <strong>iTour LLC</strong><br />
              Email:{' '}
              <a href="mailto:support@itourapp.com">support@itourapp.com</a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          {' '}&middot;{' '}
          <span>&copy; {new Date().getFullYear()} iTour LLC</span>
        </div>
      </div>
    </div>
  )
}
