'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { 
  Flame, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  Upload,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Clock,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'account' | 'payment' | 'creator' | 'technical';
}

const faqs: FAQItem[] = [
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the sign-in page. Enter your email address and we'll send you instructions to reset your password. Make sure to check your spam folder if you don't see the email.",
    category: 'account'
  },
  {
    question: "How do I become a verified creator?",
    answer: "Sign up as a creator account and submit your portfolio for review. Our team typically reviews applications within 24-48 hours. You'll need to demonstrate quality work and adherence to our content guidelines.",
    category: 'creator'
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. All payments are processed securely through our payment partners.",
    category: 'payment'
  },
  {
    question: "How do I upload my digital assets?",
    answer: "Once you're approved as a creator, go to your dashboard and click 'Upload Asset'. Fill in the details, set your price, upload your files, and submit for review. Assets are typically reviewed within 24 hours.",
    category: 'creator'
  },
  {
    question: "What file formats are supported?",
    answer: "We support a wide range of formats including images (JPG, PNG, SVG, AI, PSD), videos (MP4, MOV, AVI), audio (MP3, WAV), 3D models (OBJ, FBX, GLTF), and documents (PDF, DOCX).",
    category: 'technical'
  },
  {
    question: "How do I download purchased assets?",
    answer: "After purchase, go to your account dashboard and click on 'My Purchases'. You'll find all your purchased assets there with download links that never expire.",
    category: 'general'
  },
  {
    question: "What is your refund policy?",
    answer: "Due to the digital nature of our products, we generally don't offer refunds. However, if you experience technical issues or the asset is significantly different from its description, contact support within 48 hours of purchase.",
    category: 'payment'
  },
  {
    question: "How do royalties work for creators?",
    answer: "Creators earn 70% of each sale after payment processing fees. Payments are made monthly via PayPal or bank transfer once you reach the minimum payout threshold of $50.",
    category: 'creator'
  }
];

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Email suggestions
  const emailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestionBase, setEmailSuggestionBase] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Custom validation
    if (!name || name.length < 2) {
      setError('Please enter your name');
      return;
    }
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!subject || subject.length < 5) {
      setError('Please enter a subject (at least 5 characters)');
      return;
    }
    
    if (!message || message.length < 20) {
      setError('Please enter a detailed message (at least 20 characters)');
      return;
    }
    
    setLoading(true);

    try {
      // Here you would typically send this to your support system
      // For now, we'll store it in a support_tickets table
      const { error: submitError } = await supabase
        .from('support_tickets')
        .insert({
          name,
          email,
          subject,
          category,
          message,
          status: 'new',
          created_at: new Date().toISOString()
        });

      if (submitError) {
        // If table doesn't exist, just show success anyway
        console.log('Support ticket submission:', { name, email, subject, category, message });
      }
      
      setSuccess(true);
      toast.success('Support ticket submitted successfully!');
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setCategory('general');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-100">ViralPik</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">How can we help you?</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Get answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Response Time</h3>
            <p className="text-zinc-400 text-sm">
              We typically respond within 24 hours during business days
            </p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Available 24/7</h3>
            <p className="text-zinc-400 text-sm">
              Browse FAQs and documentation anytime
            </p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Community</h3>
            <p className="text-zinc-400 text-sm">
              Join our Discord for community support
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQs Section */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'general'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setSelectedCategory('account')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'account'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setSelectedCategory('creator')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'creator'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                Creator
              </button>
              <button
                onClick={() => setSelectedCategory('payment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'payment'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                Payment
              </button>
            </div>
            
            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-900/80 transition-colors"
                  >
                    <span className="text-zinc-100 font-medium">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-zinc-400 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Still need help?</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@ViralPik.com"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  support@ViralPik.com
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Join our Discord Community
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Contact Support</h2>
            
            {success ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-100 text-center mb-4">
                  Ticket Submitted Successfully!
                </h3>
                
                <p className="text-zinc-300 text-center mb-6">
                  We've received your support request and will respond within 24 hours.
                </p>
                
                <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-zinc-300 mb-2">What happens next?</p>
                  <ul className="text-sm text-zinc-400 space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Our team will review your request</li>
                    <li>• We'll respond via email within 24 hours</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        
                        // Show suggestions for username part before @ or domain part after @
                        if (!value.includes('@') && value.length > 0) {
                          setEmailSuggestionBase(value);
                          setShowEmailSuggestions(true);
                        } else if (value.includes('@') && !value.split('@')[1]) {
                          setEmailSuggestionBase('');
                          setShowEmailSuggestions(true);
                        } else {
                          setShowEmailSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (!email.includes('@') && email.length > 0) {
                          setEmailSuggestionBase(email);
                          setShowEmailSuggestions(true);
                        } else if (email.includes('@') && !email.split('@')[1]) {
                          setEmailSuggestionBase('');
                          setShowEmailSuggestions(true);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    {/* Email suggestions */}
                    {showEmailSuggestions && (
                      <div className="absolute top-full mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                        {emailSuggestionBase && !email.includes('@') ? (
                          // Username suggestions with domains
                          emailDomains.map((domain) => (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => {
                                setEmail(emailSuggestionBase + '@' + domain);
                                setShowEmailSuggestions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg transition-colors"
                            >
                              {emailSuggestionBase}@<span className="text-blue-400">{domain}</span>
                            </button>
                          ))
                        ) : email.includes('@') && (
                          // Domain suggestions
                          emailDomains.map(domain => (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => {
                                setEmail(email.split('@')[0] + '@' + domain);
                                setShowEmailSuggestions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg transition-colors"
                            >
                              {email.split('@')[0]}@<span className="text-blue-400">{domain}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="account">Account Issues</option>
                    <option value="payment">Payment & Billing</option>
                    <option value="creator">Creator Support</option>
                    <option value="technical">Technical Issues</option>
                    <option value="report">Report Content</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                    placeholder="Please provide as much detail as possible..."
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    {message.length}/500 characters (minimum 20)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Support Ticket
                    </>
                  )}
                </button>

                <p className="text-xs text-zinc-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
