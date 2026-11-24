// CLEP removed: we don't offer prep for it.
const exams = ['SAT®', 'ACT®', 'AP®', 'IB', 'PSAT'];

// Removed unverified metrics: '98% Score Improvement', '500+ Practice Tests',
// '4.9/5 Average Rating', '20+ Students with 5 AP Scores'.
const stats = [
  { value: '1:1', label: 'Live Tutoring' },
  { value: '4,000+', label: 'Practice Questions' },
  { value: '20+', label: 'Mock Tests' },
  { value: '120+', label: 'Interactive Quizzes' },
  { value: '24/7', label: 'Doubt Solving' },
];

export function TrustSection() {
  return (
    <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        {/* Exam logos strip */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            Trusted by Students Preparing For
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {exams.map((exam) => (
              <span
                key={exam}
                className="text-lg font-black tracking-wider"
                style={{ color: 'var(--color-foreground)', opacity: 0.55 }}
              >
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-8"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-black mb-0.5"
                style={{ color: 'var(--color-foreground)' }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
