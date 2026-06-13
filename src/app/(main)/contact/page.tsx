import type { Metadata } from 'next';
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the EduReach team. We\'re here to help students, parents, and educators.',
};

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@edureach.com', sub: 'We reply within 24 hours' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available in-app', sub: 'Mon–Fri, 9am–6pm ET' },
  { icon: Clock, label: 'Support Hours', value: 'Mon–Fri 9am–8pm ET', sub: 'Sat 10am–4pm ET' },
  { icon: MapPin, label: 'Headquarters', value: 'New York, NY', sub: 'Serving US & Canada' },
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
            <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Get in Touch</h2>
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{label}</div>
                    <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)', opacity: 0.7 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-base p-8">
              <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Send a Message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} />
                </div>
                <Button className="w-full text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
