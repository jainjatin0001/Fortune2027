import type { Metadata } from 'next';
import { Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with the Delta Tutors team. We're here to help students, parents, and educators.",
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info.deltatutors@gmail.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:info.deltatutors@gmail.com',
  },
  {
    icon: Phone,
    label: 'Call Us At',
    value: '+1 902 220 4218',
    sub: 'Mon–Fri 9am–6pm ET',
    href: 'tel:+19022204218',
  },
  {
    icon: MessageSquare,
    label: 'Live Chat',
    value: 'Available in-app',
    sub: 'Mon–Fri, 9am–6pm ET',
    href: null,
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: 'Mon–Fri 9am–8pm ET',
    sub: 'Sat 10am–4pm ET',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      <div className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <h1 className="text-heading-1 mb-3" style={{ color: 'var(--color-foreground)' }}>Contact Us</h1>
          <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
            Questions, feedback, or partnership inquiries — we'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container-app py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-heading-4 mb-6 font-bold" style={{ color: 'var(--color-foreground)' }}>
              Get in Touch
            </h2>
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, sub, href }) => (
                <div key={label} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                        {value}
                      </div>
                    )}
                    <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                      {sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
