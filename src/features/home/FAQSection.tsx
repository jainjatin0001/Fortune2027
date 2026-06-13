import { SectionHeader } from '@/components/shared/SectionHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Is EduReach free to use?',
    a: 'We offer a free plan that includes 3 practice tests per month and access to selected free courses. Our Plus and Pro plans unlock unlimited tests, all courses, and premium features starting at $19.99/month.',
  },
  {
    q: 'How much can I realistically improve my SAT score?',
    a: 'Our students improve by an average of 220 points on the SAT over 12 weeks. Results vary based on starting score and study hours, but our adaptive system targets your weak areas to maximize improvement.',
  },
  {
    q: 'Do you cover all AP subjects?',
    a: 'We currently offer comprehensive prep for 20+ AP subjects including Calculus AB/BC, US History, Biology, Chemistry, Physics, English, Psychology, Computer Science, and more.',
  },
  {
    q: 'Can parents track their child\'s progress?',
    a: "Yes! Parent accounts have a dedicated dashboard that shows course progress, quiz scores, study time, and improvement trends. You can even set learning goals for your child.",
  },
  {
    q: 'How do the coding courses work?',
    a: 'Coding courses include video lessons, interactive coding exercises, real projects, and automated code feedback. You can run code directly in the browser — no software installation needed.',
  },
  {
    q: 'Are EduReach courses aligned with College Board and ACT standards?',
    a: 'All SAT and AP content is developed based on College Board\'s official curriculum and question formats. ACT content mirrors the official ACT test specifications. We update content every semester.',
  },
  {
    q: 'Can I access EduReach on my phone or tablet?',
    a: 'Yes. EduReach is fully responsive and works on all devices. Our mobile experience is optimized for on-the-go studying, including offline access on Pro plans.',
  },
];

export function FAQSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-narrow">
        <SectionHeader
          eyebrow="FAQ"
          title="Common Questions"
          subtitle="Everything you need to know about EduReach."
        />

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="card-base px-6 border-0"
              style={{ borderRadius: 'var(--radius-xl)' }}
            >
              <AccordionTrigger className="text-sm font-semibold py-4 text-left hover:no-underline" style={{ color: 'var(--color-foreground)' }}>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm pb-4 leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
