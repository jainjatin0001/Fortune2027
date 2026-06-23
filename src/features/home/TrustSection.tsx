const exams = ['SAT®', 'ACT®', 'AP®', 'IB', 'PSAT', 'CLEP'];

const stats = [
  { value: '250,000+', label: 'Students Enrolled' },
  { value: '98%', label: 'Score Improvement' },
  { value: '1,400+', label: 'Practice Questions' },
  { value: '500+', label: 'Practice Tests' },
  { value: '4.9/5', label: 'Average Rating' },
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
