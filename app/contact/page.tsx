"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful form submit
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto font-medium">
          Have questions about bulk corporate orders, customization details, or shipping? Drop us a message, and our team will get right back to you.
        </p>
      </section>

      {/* Grid: Form and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Contact Information */}
        <section className="space-y-8 bg-stone-50 dark:bg-[#1C1C1E]/20 border border-stone-200 dark:border-stone-800 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-stone-900">Contact Details</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#FF5733]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 mb-1">WhatsApp & Call Support</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">+91 98765 43210</p>
                <p className="text-[10px] text-stone-400">Available Mon-Sat: 10:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#FF5733]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 mb-1">Email Support</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">hello@distributehappiness.com</p>
                <p className="text-[10px] text-stone-400">We usually reply within 12-24 hours</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#FF5733]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 mb-1">Our Workshop</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Happiness Workshop, Industrial Estate Block B,<br />
                  New Delhi, Delhi - 110020
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Message Form */}
        <section className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 p-8 rounded-3xl shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Message Sent!</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Thank you for reaching out. A representative from Distribute Happiness will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-orange-600 hover:underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Send a Message</h2>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-white/60 focus:outline-none focus:border-[#FF5733] text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@domain.com"
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-white/60 focus:outline-none focus:border-[#FF5733] text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry..."
                  className="w-full p-4 rounded-xl border border-stone-200 bg-white/60 focus:outline-none focus:border-[#FF5733] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </section>

      </div>

    </main>
  );
}
