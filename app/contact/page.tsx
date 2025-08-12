'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@ViralPik.com',
      subtext: 'We\'ll respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: 'San Francisco, CA',
      subtext: 'Remote-first company'
    },
    {
      icon: Clock,
      title: 'Business hours',
      details: '9 AM - 6 PM PST',
      subtext: 'Monday to Friday'
    }
  ];

  const departments = [
    {
      name: 'Sales',
      email: 'sales@ViralPik.com',
      description: 'Enterprise plans and partnerships'
    },
    {
      name: 'Support',
      email: 'support@ViralPik.com',
      description: 'Technical issues and account help'
    },
    {
      name: 'Press',
      email: 'press@ViralPik.com',
      description: 'Media inquiries and press kits'
    },
    {
      name: 'Legal',
      email: 'legal@ViralPik.com',
      description: 'Terms, privacy, and compliance'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-bold text-white">
            ViralPik
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-24 px-4 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-zinc-400">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-zinc-300">{info.details}</p>
                  <p className="text-sm text-zinc-500 mt-1">{info.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-400 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white focus:border-white focus:outline-none"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General inquiry</option>
                    <option value="support">Technical support</option>
                    <option value="sales">Sales & pricing</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="feedback">Product feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none resize-none"
                    placeholder="Tell us more about how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
                >
                  Send message
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Department Contacts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Department contacts</h2>
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-2">{dept.name}</h3>
                    <p className="text-zinc-400 mb-3">{dept.description}</p>
                    <a 
                      href={`mailto:${dept.email}`} 
                      className="text-white hover:text-zinc-300 transition-colors"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">Looking for answers?</h3>
                <p className="text-zinc-400 mb-4">
                  Check out our FAQ section for quick answers to common questions.
                </p>
                <Link href="/faq" className="text-white font-medium hover:text-zinc-300 transition-colors">
                  Visit FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Notice */}
      <section className="py-16 px-4 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-3">We typically respond within 24 hours</h3>
          <p className="text-zinc-400">
            Our support team works Monday through Friday, 9 AM - 6 PM PST. 
            For urgent matters, please email support@ViralPik.com directly.
          </p>
        </div>
      </section>
    </div>
  );
}
