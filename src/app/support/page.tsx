import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowLeft, Mail, MessageCircle, Smartphone, HelpCircle, Download, Volume2, Globe, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support - iTour',
  description: 'Get help with the iTour mobile application',
}

export default function SupportPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Support</h1>
          <p className="text-slate-400 mb-8">Get help with the iTour app</p>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Contact Us</h2>
                <p className="text-slate-300 mb-3">
                  Have a question or need assistance? We&apos;re here to help.
                </p>
                <a
                  href="mailto:support@itourapp.com"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@itourapp.com
                </a>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white pb-2 border-b border-slate-700/50">
              Frequently Asked Questions
            </h2>

            <FaqItem
              icon={<Download className="w-5 h-5" />}
              question="How do I download tours for offline use?"
              answer="Open the app, select your tour and language, then tap the download icon in the top right corner of the home screen. The app will download all tour content including images and audio for offline access."
            />

            <FaqItem
              icon={<Volume2 className="w-5 h-5" />}
              question="How do I use the audio narration?"
              answer="Each stop has a play button that will read the content aloud using text-to-speech. For the best experience, we recommend using headphones. The audio will play in your selected language."
            />

            <FaqItem
              icon={<Globe className="w-5 h-5" />}
              question="What languages are available?"
              answer="iTour supports multiple languages including English, Spanish, French, German, and Chinese. Select your preferred language when you first open the app. You can change it anytime in Settings."
            />

            <FaqItem
              icon={<Smartphone className="w-5 h-5" />}
              question="Does the app work without internet?"
              answer="Yes! Once you download a tour, all content is available offline. This is perfect for historic sites with limited cell coverage. Just download before you arrive."
            />

            <FaqItem
              icon={<CreditCard className="w-5 h-5" />}
              question="How do donations work?"
              answer="When you tap 'Contribute' in the app, you'll be taken to a secure Stripe payment page. Your donation supports the preservation of historic sites. We never see or store your payment information."
            />

            <FaqItem
              icon={<HelpCircle className="w-5 h-5" />}
              question="The app isn't working correctly. What should I do?"
              answer="Try these steps: 1) Close and reopen the app, 2) Check for app updates in the App Store or Google Play, 3) Clear the app cache in Settings, 4) If issues persist, email us at support@itourapp.com with details about the problem."
            />
          </div>

          {/* App Info */}
          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">App Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Current Version</p>
                <p className="text-white font-medium">2.4.0</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Platforms</p>
                <p className="text-white font-medium">iOS & Android</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Requirements</p>
                <p className="text-white font-medium">iOS 13+ / Android 5.0+</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Developer</p>
                <p className="text-white font-medium">iTour LLC</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/privacy"
                className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block"
              >
                <p className="text-white font-medium mb-1">Privacy Policy</p>
                <p className="text-slate-400 text-sm">How we handle your data</p>
              </Link>
              <Link
                href="/terms"
                className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block"
              >
                <p className="text-white font-medium mb-1">Terms of Service</p>
                <p className="text-slate-400 text-sm">Usage guidelines</p>
              </Link>
              <a
                href="mailto:support@itourapp.com"
                className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors block"
              >
                <p className="text-white font-medium mb-1">Email Support</p>
                <p className="text-slate-400 text-sm">support@itourapp.com</p>
              </a>
            </div>
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
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-white text-sm font-medium">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FaqItem({
  icon,
  question,
  answer,
}: {
  icon: React.ReactNode
  question: string
  answer: string
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-2">{question}</h3>
        <p className="text-slate-300">{answer}</p>
      </div>
    </div>
  )
}
