# Delta Tutors — End-to-End Review, Competitive Position & Growth Plan

**Date:** 2026-11-18 · **Site:** https://www.deltatutors.us · **Builds on:** [`DELTA_TUTORS_PRE_LAUNCH_AUDIT.md`](./DELTA_TUTORS_PRE_LAUNCH_AUDIT.md) (2026-11-15)

> **How this was done.**
> - **Code:** read in this repo and checked against the 15 Nov audit. Type check and lint were run, plus `npm audit`. No code was changed and the database was not touched.
> - **Live site:** fetched directly with curl.
> - **Search visibility:** checked with a US web-search index. That index is *not* Google, so the findings are a strong signal rather than proof. Google Search Console is the source of truth.
> - **Competitor prices:** mostly from third-party review sites, which often disagree. Items marked **[U]** are unverified. Re-check any number before quoting it publicly.

---

## 1. Verdict in one page

| Question | Answer |
|---|---|
| Is the product good? | **The core exam experience is genuinely strong.** It is close to the official Bluebook app: Desmos calculator, mark-for-review, answer eliminator, reference sheet, breaks, score reports. The progress dashboard (streaks, heatmap, strengths, trends) is better than most paid competitors. |
| Is it ready to market? | **No.** One legal issue (§2) and about 10 launch blockers (§4) must be fixed first. **None of the 11 blockers from the 15 Nov audit has been fully fixed yet.** |
| Are we visible in US/Canada search? | **Effectively no.** No deltatutors.us page appeared for any query, not even `site:deltatutors.us` or the exact brand name "Delta Tutors". Other businesses own the name (a UK tutor, "Tutor Doctor Delta" in British Columbia, Delta College). |
| Where can we win? | **The affordable hybrid: platform plus a live human tutor**, priced between free/self-paced apps ($0–400/yr) and US tutoring ($70–230/hr). India-based tutors give us a cost advantage no US competitor has. |
| What should we do first? | 1. Replace the College Board content. 2. Fix the launch blockers. 3. Get indexed. 4. Launch a **free diagnostic SAT with a free tutor review** as the funnel for paid tutoring, timed to the **March 6, 2027 SAT** (students buy in Jan–Feb). |

---

## 2. ⚠️ Showstopper: the question bank is College Board content

The whole question bank came from **College Board SAT Suite Question Bank PDF exports**. That covers roughly 3,650 questions across English, Algebra and Advanced Math. The **20 mock tests** sold in courses and the **113 quizzes** are all built from them.

- **What College Board says:** SAT test materials are *not available for commercial license*. Reproducing official SAT materials "is not allowed in test prep and other commercial settings". Commercial use explicitly includes test prep. Its educator terms also prohibit commercial use. ([College Board permissions guidance](https://privacy.collegeboard.org/educator-legal-terms), [Question Bank](https://satsuite.collegeboard.org/k12-educators/tools-resources/question-bank))
- **Risks:**
  - Takedown notices or legal action.
  - Stripe, Google Ads and Meta may reject or suspend accounts over IP complaints.
  - Reddit and TikTok users recognise Question Bank items instantly. "They're selling the free College Board questions" is the kind of post that kills a test-prep brand.
- **Product problem as well:** the same questions are free on College Board's site, and Khan/Bluebook are free too. Students get nothing from us they can't get for free.

**Recommendation (get legal confirmation):**
1. Do **not** sell or advertise anything built on these questions. Keep the mock tests and quizzes unpublished (they are drafts today).
2. Build an **original question bank**. Our tutors write questions in the same blueprint (domain, skill, difficulty). AI can draft, but every item gets human review. The existing tagging, import tooling and mock-test builder can all be reused.
   - **Target for launch:** 3 original full-length tests plus about 600 practice questions.
   - **Target in 6 months:** 10 tests plus about 2,000 questions.
3. Point students to College Board's free resources with a link. That builds trust and is allowed.
4. Add a trademark notice in the footer: *"SAT® is a registered trademark of College Board, which is not affiliated with and does not endorse Delta Tutors."* The same applies to ACT® and AP®.
5. Any wording that implies official questions (e.g. "official question bank") must go.

---

## 3. Competitive position

### 3.1 Competitor landscape (digital SAT)

| Player | Price | Model | Strength | Weakness vs. us |
|---|---|---|---|---|
| College Board Bluebook | Free | Official app, about 8 adaptive full-length tests | Real interface and scoring | Students run out of tests; no teaching or coaching |
| Khan Academy | Free | Self-paced skill practice (full tests moved to Bluebook) | Official partner, free | No mocks, no accountability, no human |
| UWorld SAT | about $99–399 [U] | Question bank plus about 10 tests | Excellent explanations | Little teaching; short access windows |
| PrepScholar | $397/yr; live classes from $895 | Self-paced adaptive course | Adaptive plan, score guarantee | Expensive for self-paced; dated interface [U] |
| Princeton Review | $299 self-paced → $2,199 for the 1400+ course | Self-paced, live classes, tutoring | Brand, guarantee | Very expensive |
| Kaplan | $49/mo → about $799 live; tutoring about $149–229/hr | Self-paced, live classes, tutoring | Brand, live classes | Generic, expensive tutoring |
| Acely (AI) | $49–149/mo | AI tutor plus Bluebook-style tests | Modern product, many tests [U] | No humans; pricey month to month |
| OnePrep, Linus, Test Innovators | Free → about $144/6 mo [U] | Freemium question bank and mocks | Free tiers, strong on Reddit | Commoditised; no humans |
| 1600.io / Erica Meltzer | about $99/yr [U] / about $30 books | Videos / books | Expert depth (Desmos tricks, Reading & Writing) | Not a full platform |
| Varsity Tutors / Wyzant | about $70–100/hr [U] / $40–150/hr | Tutoring marketplaces | Scale, choice of tutor | No integrated practice platform; quality varies |
| **Delta Tutors (today)** | Tutoring $54–62/hr (4/8/12 hrs/mo) | Platform plus 1:1 tutoring | Real exam interface, progress analytics, human tutors at India cost | See §3.3 |

**Teen coding tutoring:** iD Tech charges $64–79/hr, Create & Learn about $60/hr for 1:1, CodeWizardsHQ $399–799 per course [U], Codecademy $12–20/mo (no human). **A 1:1 Python tutor at $30–40/hr would undercut the market by about 50%.**

### 3.2 Where we excel

1. **Exam realism.** Bluebook-grade tools, server-side grading, safe submit with retry, scores labelled as estimates.
2. **Progress and motivation layer.** Streaks, a time-zone-correct heatmap, daily goals, daily question, subject strengths, mock-test trends. Most competitors under $400 don't have this.
3. **Human tutors at a structural cost advantage.** We can price live 1:1 tutoring at half US rates and still keep good margins.
4. **Time-zone fit for the fastest-growing SAT markets.** International SAT takers grew about 13.5% this year, led by India, the UAE, Korea and Asia, all of which overlap with our working hours. US evenings correspond to Indian mornings, which also works.
5. **Breadth of the tutoring offer.** We can sell SAT, Python and AP/high-school tutoring to the same family, which competitors focused only on test prep can't.
6. **Admin and content tooling.** Bulk import, mock-test builder, daily-question calendar and blog CMS mean original content can be produced quickly once it is written.

### 3.3 Where we lag

| Gap | Competitors who do it | Impact |
|---|---|---|
| **No original content** (see §2) | Everyone paid | Legal risk; no reason to pay |
| **Tests are not adaptive.** Module 2 is a fixed list and scoring is a straight proportion, yet the website says "adaptive" | Bluebook, Acely, Test Innovators | Misleading claim; score estimates can be off |
| **Only SAT content.** ACT, AP and coding pages promise practice that doesn't exist. PYQs is a paid item that shows "Coming Soon" | — | Broken promises, wasted traffic |
| **Explanations.** Text only; no video, no AI "why is this wrong" | UWorld, 1600.io, Acely | Weaker learning value |
| **No parent experience.** No parent account or weekly report email; the app sends no emails at all | PrepScholar, tutoring firms | Parents are the buyers |
| **No booking or scheduling for tutoring.** Sales go through a contact form | Varsity Tutors, Wyzant, iD Tech | High friction; leads lost |
| **Unusable on phones.** No dashboard navigation on phone or tablet | Everyone | Most teens browse on phones |
| **Zero social proof.** No real reviews; the current numbers are invented | Everyone | Ads and parents won't trust us |
| **Zero search and social presence** (§6) | Everyone | No organic acquisition |
| **No AI tutor or study plan** | Acely, PrepScholar ($495 tier), OnePrep | Expected in 2026 |

---

## 4. Bugs — current status (code as of commit `2c9e0fe`)

### 4.1 The 15 Nov audit's launch blockers: rechecked today

| # | Issue | Status | Where |
|---|---|---|---|
| 1 | Monthly subscriptions charge but grant no access; refunds and disputes don't revoke access | **Still present** | `src/app/api/webhooks/stripe/route.ts:107-164` |
| 2 | `npm run build` runs `prisma migrate deploy` against the live DB | **Still present** | `package.json:7` |
| 3 | Internal sales notes on the public pricing page; invented stats ("250K+", "4.9/5 from 18,000+ reviews", "98% pass rate", "#1 platform") | **Still present** | `src/app/(main)/pricing/PricingSection.tsx:275-288`, `StatsSection.tsx`, `TrustSection.tsx`, `HeroSection.tsx:41`, `sat-prep`, `act-prep`, `ap-prep`, `about`, `courses` |
| 4 | No Privacy, Terms, Refund or Cookie pages; footer links to non-existent pages; Twitter/YouTube links are `#`; Google Analytics and Clarity load without consent | **Still present** | `src/components/.../Footer.tsx:15-16,164-166`, `src/app/layout.tsx:57-58` |
| 5 | Answer leaks / score inflation | **Partly fixed.** Mock-test start no longer sends answers. Quizzes still send correct answer and explanation to the browser. `/api/questions` returns the whole bank with answers to any enrolled user. Mock-test score can exceed 100% by repeating a question ID | `quizzes/[quizId]/page.tsx:39,66-70`, `api/questions/route.ts:41-45`, `api/mock-test/[attemptId]/complete/route.ts:89-125` |
| 6 | Any admin can make themselves super-admin; deactivated users aren't blocked | **Still present** | `api/admin/users/route.ts:61-74`, `src/lib/auth.ts:6-43` |
| 7 | No dashboard navigation on mobile; Profile/Settings links 404; a refresh during a mock test loses all answers | **Still present** | `DashboardSidebar.tsx:41-42,149`, `DashboardHeader.tsx:26`, `api/mock-test/start/route.ts:84-88` |
| 8 | Mobile "Enroll Now" does nothing; cancelled checkout → 404 | **Partly fixed.** `/payment/cancel` now exists for plans, but course checkout still cancels to `/courses/<id>` while that page looks courses up by slug, so it returns 404. Mobile button still has no `onClick` | `courses/[slug]/page.tsx:850-855`, `api/checkout/session/route.ts:59` |
| 9 | Known-vulnerable Next.js 16.2.9 and DOMPurify | **Still present.** `npm audit` reports 59 vulnerabilities, 2 critical and 12 high | — |
| 10 | No error monitoring, tests or CI | **Still present** | — |
| 11 | Sitemap lists the missing `/subjects` page and omits courses and blog posts; OG image missing; no canonical tags or structured data | **Still present** (confirmed on the live site) | `src/app/sitemap.ts` |

### 4.2 New findings (not in the 15 Nov audit)

| Severity | Finding | What a student sees |
|---|---|---|
| **High** | Enrolling in **any free course** creates an ACTIVE enrollment, and every paid gate only checks "has any active enrollment" (`api/enrollment/route.ts:56`) | Detailed reports, PYQs and the full answer-key bank become free; there's no reason to pay |
| **High** | Courses with no modules show a **made-up curriculum** ("Module 1: Foundations", videos, PDFs) (`courses/[slug]/page.tsx:231-332`) | A student can buy content that doesn't exist; refund and chargeback risk |
| **High** | The course page always shows "Enroll" even to enrolled students; checkout returns 409 and the button silently does nothing (`EnrollButton.tsx:31-37`) | A paying student thinks the site is broken |
| **High** | Checkout errors are swallowed on pricing and course pages (`PricingSection.tsx:314-316`) | Payment start fails silently |
| **Medium** | Mock-test timer is a chained 1-second `setTimeout`, not a wall-clock deadline, and the server doesn't enforce time (`ExamInterface.tsx:255-264`) | Switching tabs or locking the phone pauses the clock; times aren't real |
| **Medium** | The "adaptive" claim is false: fixed Module 2, proportional scaling (`presets.ts`, `scoring.ts:56-58`) | Misleading; score estimates are less accurate |
| **Medium** | "Practice: adaptive questions across your subjects" actually serves random demo questions (`dashboard/practice/page.tsx:8,17`); the footer "Practice Tests" link points to `/practice` and returns 404 | Feels fake |
| **Medium** | PYQs is a paid nav item that leads to "Coming Soon" | A paying student unlocks nothing |
| **Medium** | "Try Free Practice" buttons on the AP and Coding pages drop students on the generic dashboard; the ACT CTA can land on SAT tests or "No mock tests yet" | Promise broken at first click |
| **Medium** | No `not-found.tsx`, `error.tsx` or `global-error.tsx` anywhere | Every broken link shows a bare default error page |
| **Medium** | Pricing contradicts itself: the FAQ says "Plus and Pro plans from $19.99/month", the pricing page sells tutoring plans at $248/$448/$648 per month, and the Foundation plan says "mock tests not included" although every signed-in student gets free mocks | Confusing; erodes trust |
| **Low** | No warning before leaving during a mock test (no `beforeunload` handler) | A back-swipe loses a 2-hour test |
| **Low** | The exam-date countdown can never appear, because the only place to set an exam date is the non-existent Settings page | Dead feature |
| **Low** | Lint reports 40 errors; `src/middleware.ts` should be renamed `proxy.ts` per the Next 16 upgrade guide | Maintenance |

---

## 5. Technical limitations (architecture level)

1. **One database for development, preview builds and production.** Every build migrates the live DB, so one bad command can lose production data. *This is the single biggest technical risk.*
2. **No entitlement model.** Access = "has any active enrollment". Subscriptions, plan tiers, refunds, expiry and per-product access can't be expressed. This blocks any pricing experiments.
3. **Exam state lives only in the browser.** There's no autosave and no server-side timer, so exams can't be resumed, can't be proctored and their timing can't be trusted.
4. **No adaptive engine.** There is no item difficulty calibration (IRT) and no Module 2 routing. Scoring is a proportional estimate.
5. **No messaging layer.** The Resend key exists but the app sends no email: no welcome, no weekly report, no reminders, no abandoned checkout follow-up. There's also no WhatsApp or SMS integration.
6. **No tutoring operations.** No booking, tutor calendars, session records or parent notes. Tutoring is the main revenue line, and it runs on a contact form.
7. **Not ready for other countries.** USD only, no hreflang, no localized pages (Canada, UK/EU, Australia, Middle East, India), no regional pricing.
8. **Weak mobile and performance.** The dashboard can't be navigated on mobile, about 730 KB of admin editor code ships to student exam pages, and fonts block rendering. PageSpeed hasn't been measured; the API quota was exhausted, so run it manually at pagespeed.web.dev.
9. **No safety net.** No tests, no CI, no Sentry, no tested backups, 2 critical dependency vulnerabilities.
10. **Analytics not wired for marketing.** GA and Clarity collect pageviews only: no sign-up, lead, checkout or purchase events, no UTM attribution, no consent mode.

---

## 6. SEO & search presence — where we stand in the US & Canada

### 6.1 Visibility today

- **Brand searches** ("Delta Tutors", "deltatutors", `site:deltatutors.us`): **0 results from our site.** Other businesses rank instead:
  - deltatutoring.co.uk, a UK tutor rated 2.2★ on Trustpilot
  - **Tutor Doctor Delta** in Delta, British Columbia, which directly confuses Canadian searchers
  - Delta College tutoring centers
  - a marketplace page literally titled "SAT preparation - Delta Tutors"
- **Target keywords:** we don't appear for any of these. The top results are PrepScholar, Magoosh, Kaplan, UWorld, Manhattan Review, Varsity Tutors, TutorChase, UPchieve and others.

| Keyword | Who ranks |
|---|---|
| digital SAT practice test | PrepScholar, Magoosh, Kaplan |
| free SAT practice test | PrepScholar, Magoosh, Kaplan |
| SAT prep online | PrepScholar, UWorld, Manhattan Review |
| SAT tutor online | UPchieve, UWorld, TeachMe2 |
| SAT prep Canada | Manhattan Review, BrightChamps |
| SAT tutor Toronto | Manhattan Review, Varsity Tutors, TutorChase |
| online python tutor for teens | TeachMe2, Wiingy, Outschool |

- **Backlinks and mentions:** none found. There's no Google Business Profile, no YouTube or TikTok, and the Instagram and LinkedIn links carry leftover tracking parameters.

**Conclusion:** we are not present in the US or Canadian market in search today.

### 6.2 What is fine

- Pages are rendered on the server.
- HTTPS works and the bare domain and `http` both redirect to `www`.
- robots.txt is correct.
- Unknown pages correctly return 404.
- The site is served from Vercel's cache.

### 6.3 What is broken

1. The sitemap has 11 URLs. `/subjects` returns 404, and the 5 blog posts and 6 course pages are missing.
2. No canonical tags, no hreflang, no JSON-LD.
3. `og:image` (`/images/og-default.jpg`) returns 404, so every shared link has no preview image.
4. Every page reuses the homepage's og:title, og:description and og:url.
5. The brand appears twice in titles ("… | Delta Tutors | Delta Tutors").
6. The blog post meta description is raw HTML (`<p><strong>…`).
7. `/pricing` has no H1.
8. Course slugs include a typo (`delta-sat-ecxellence`) and uppercase (`AP-Calculus-AB-2026`).
9. Only 5 blog posts exist, and 3 have titles that give no hint of their topic ("The Ultimate Cat and Mouse Game").

### 6.4 SEO plan (in order)

1. **This week:**
   - Verify the domain in Google Search Console and Bing Webmaster Tools, then submit the sitemap.
   - Create a Google Business Profile as a service-area business.
2. **Technical fixes (about 2–3 developer-days):**
   - Generate the sitemap from the DB (courses and posts) and remove `/subjects`.
   - Add canonical tags, per-page Open Graph tags and a generated OG image.
   - Add JSON-LD: `Organization` with `sameAs` links to our socials, `Course`, `Article` and `FAQPage`.
   - Fix titles, slugs (with 301 redirects), the pricing H1 and the blog descriptions.
3. **Content hubs** (original, ≥1,000 words each, one per week):
   - **Free digital SAT diagnostic test.** The main landing page; see §8.
   - **Tools:** SAT score calculator, superscore calculator, "what SAT score do I need for [college]".
   - **Timely news:** *"Which colleges require the SAT again in 2027"*. All 8 Ivies, MIT, Stanford, UT Austin, Florida and Georgia public universities have reinstated testing, and parents are actively searching for this.
   - **Skill guides** by question type (Desmos tricks, transitions, boundaries, linear functions …), each with original practice questions.
   - **Calendar pages:** SAT test dates 2026–27 and study plans for each date.
   - **Country pages:** *SAT for Canadian students applying to US colleges*, *SAT in the UAE/India/UK/Australia*, using `hreflang` once localized.
   - **Coding pages:** *Python for teens*, *AP Computer Science A tutoring*.
4. **Authority:**
   - Get listed in tutoring and teen-program directories (e.g. TeenLife).
   - Partner with international schools and independent college counselors.
   - Contribute guest posts and answers on Quora and Reddit, genuinely and never by astroturfing.
5. **Brand disambiguation:** use "Delta Tutors" consistently, add `Organization` structured data, and keep social profiles consistent. Consider registering `deltatutors.ca`, `.co.uk` and `.com.au` and redirecting them to the main site.

---

## 7. The student's and the parent's view

**First visit as a student:**
- The home page looks premium, but on a phone the dashboard can't be navigated.
- "Try free practice" on the ACT, AP and Coding pages leads to SAT or empty pages.
- The numbers ("250K students", "#1 platform") feel fake to anyone who checks Reddit.

**Taking a mock test:**
- This is the best part of the product and feels like Bluebook.
- But a refresh, a back-swipe or a phone lock loses or distorts the test, and nothing warns the student.
- After the test there's a good score report, but explanations are text only, and there's no "what to study next" plan.

**Wanting to buy:**
- The pricing page mixes a $19.99 subscription (from the FAQ) with tutoring plans of $248–648/mo.
- The score guarantee has no terms.
- On a phone, "Enroll" does nothing.
- Tutoring sales go through a contact form, with no way to book a free consultation or trial session.

**The parent (the buyer):**
- Needs proof (real results, tutor bios, policies) and visibility (weekly progress).
- We have none of these today, and no Privacy or Terms pages, which parents of minors look for.

---

## 8. Strategy: how we win students

### 8.1 Positioning

> **"Bluebook-style practice + your own expert tutor, at half the price of US tutoring."**

- **Who we target, in priority order:**
  1. US juniors aiming for 1300+ who need selective-college scores, now that testing is required again.
  2. International students applying to US colleges: India, the Middle East, Asia, plus Canada, the UK, Europe and Australia.
  3. Families who also want Python or AP tutoring for the same child.
- **How we're different:**
  - Human tutor + platform + parent reports, which AI apps don't offer.
  - Price: 1:1 tutoring at $35–45/hr versus Kaplan/Varsity's $70–230/hr.
  - Time-zone coverage for international students.
- **What we don't do:** compete with free apps on "more practice questions". Free official tools win there.

### 8.2 Offer ladder

| Stage | Offer | Price | Purpose |
|---|---|---|---|
| Free | Diagnostic full-length SAT (original questions) + score report + **free 20-min tutor review call** | $0 | Lead capture and the main conversion step |
| Free | Daily question, streaks, limited practice | $0 | Retention, word of mouth |
| Entry | Self-paced platform: all original mocks and practice, study plan | $15–25/mo or about $99/semester | Monetises students who don't want tutoring; anchors the price |
| Core | **Hybrid plan: platform + 4 × 1:1 sessions/mo + weekly parent report** | about $199–249/mo | Main revenue; the gap in the market |
| Intensive | 8–12 sessions/mo + 2 mocks/mo + priority WhatsApp | about $349–449/mo | Students with a test 6–8 weeks away |
| Cross-sell | Python / AP CS / high-school math tutoring | $30–40/hr | Sibling and same-family sales |

**Pricing notes:**
- Current rates of $54–62/hr give up our cost advantage; they are only slightly below Varsity Tutors. Test a lower price.
- Drop the score guarantee until we have terms and results data to back it.
- Consider regional pricing for India, the UAE and Southeast Asia.

### 8.3 Acquisition channels (ranked by cost-effectiveness for us)

1. **Free diagnostic + tutor review call.** Every channel below points here. The tutor review call converts far better than a cold pricing page, because parents meet a real person.
2. **Short-form video** (TikTok, YouTube Shorts, Instagram Reels): 4–5 posts a week by tutors solving hard Module 2 questions, Desmos tricks, and "1 grammar rule in 30 s". The teen finds us and the parent pays. That's how the cheapest competitors grow.
3. **SEO content and free tools** (§6.4). Slow (3–6 months) but compounding, and the cheapest leads long-term.
4. **Reddit r/SAT and Discord:** tutors answer questions genuinely under their own names, plus a free Delta study Discord before each test date. **Never astroturf.** That subreddit punishes it and the backlash is public.
5. **Partnerships:**
   - International schools and their counselors, especially in the Gulf, India and Southeast Asia, where our time zones fit.
   - Independent college counselors in the US and Canada, with a referral fee.
   - Canadian private schools whose students apply to US colleges.
6. **Referrals:** one free session for both families when a referred student buys.
7. **Parent webinars** before each test season, e.g. *"Testing is back at Ivies & MIT — what it means for your child"*. Collect emails and offer the diagnostic.
8. **Paid ads**, only after conversion tracking and consent are live.
   - Start Google Search on high-intent terms ("online SAT tutor", "SAT tutor [city]") and Meta ads to parents, at about $1–2k/month as a test.
   - Industry benchmarks put test-prep acquisition cost at about **$360 organic / $560 paid per customer** [U]. That is affordable for a $199–449/mo tutoring plan with 3+ months of retention, but **never** for a $20 self-paced plan. Paid ads should sell tutoring only.
9. **Reviews:** after the first cohort, ask every satisfied family for a Google or Trustpilot review and a written testimonial with their permission. Replace all invented numbers with real ones as they come in.

### 8.4 Seasonality: when to push

There are 8 test dates a year, the same worldwide. Students buy about 6–10 weeks before a test.

| Test date | Main buying window | Campaign |
|---|---|---|
| Mar 6, 2027 | **Jan 5 – Feb 20** | First real launch campaign ("Spring SAT") |
| May 1 / Jun 5, 2027 | Mar – Apr | Juniors' main window |
| Aug 22 / Sep 12 / Oct 3, 2027 | **Jun – Jul (summer intensive)** | The biggest window of the year: summer bootcamp |
| Nov 7 / Dec 5, 2027 | Sep – Oct | Seniors' last attempts |

Dec 5, 2026 is too close to target.

---

## 9. 90-day action plan (from today, Nov 18 2026)

### Phase 1: Make it safe and honest (Nov 18 – Dec 12, about 3.5 weeks)

**Engineering (2 developers):**
1. Separate the dev and prod databases and move `migrate deploy` out of `build`; test a backup restore.
2. Add an entitlement model: grant access by product or plan, handle refunds and subscription expiry, and stop free courses from unlocking paid features.
3. Fix the answer leaks (quiz page, `/api/questions`) and score inflation; block admin self-promotion and enforce deactivation.
4. Add mobile dashboard navigation, create Profile and Settings pages, and fix mobile Enroll, the checkout cancel URL, silent checkout errors and the enrolled state.
5. Add mock-test autosave and resume, a wall-clock deadline, and a leave-page warning.
6. Upgrade Next.js and DOMPurify; add Sentry and a minimal CI (type check, lint, build).
7. Add `not-found`, `error` and `global-error` pages; fix or hide every dead link (PYQs, `/practice`, ACT/AP/coding CTAs).

**Content and legal (in parallel):**
1. Remove invented stats, sales notes, the fake fallback curriculum and the "adaptive" claims. Unify the pricing story.
2. Draft Privacy, Terms, Refund and Cookie policies, add a consent banner, and add the trademark disclaimer. Have counsel review, including COPPA for under-13s, GDPR and PIPEDA.
3. **Start writing the original question bank** (tutors, with optional AI drafting and human review). Goal: 3 full tests by mid-January.

### Phase 2: Soft launch and foundations (Dec 12 – Jan 10)

1. **Search:** Search Console, Bing Webmaster Tools, Google Business Profile, plus the SEO technical fixes (§6.4 step 2).
2. **Tracking:** GA4 events for sign-up, diagnostic start and finish, consult booked, checkout and purchase; UTM capture; consent mode.
3. **Booking:** add a scheduler (Cal.com or Calendly embed) for the free tutor review call and paid sessions.
4. **Email** via Resend (already configured):
   - welcome
   - diagnostic results
   - abandoned checkout
   - weekly progress email to the student and an optional parent email
5. **Social:** launch TikTok, YouTube and Instagram (with clean links); post 4–5 times a week.
6. **Soft launch** the free diagnostic to a small group (existing contacts, 1–2 partner schools). Collect feedback and the first testimonials.

### Phase 3: Spring SAT campaign (Jan 10 – Feb 28)

1. Publish the landing pages: free diagnostic, the reinstated-testing list, SAT dates 2026–27, the score calculator, *SAT for Canadian students*, *Python for teens*.
2. Run 2 parent webinars, Reddit/Discord study sessions, and outreach to 20 international schools and counselors.
3. Start paid search and Meta ads at about $1–2k/month, for tutoring offers only, once tracking is verified.
4. Run the referral program.
5. **Start on product depth:**
   - weak-topic practice built from report data
   - parent dashboard
   - Module 2 routing based on Module 1 performance (true adaptivity)

### Targets for the end of February (realistic for a cold start)

| Metric | Target |
|---|---|
| Domain indexed; brand query ranks #1 | ✔ |
| Free sign-ups | 500–1,000 |
| Diagnostic completions | 250–400 |
| Free tutor review calls | 60–100 |
| Paying tutoring families | 15–30 |
| Real reviews collected | ≥10 |
| Paid ads cost per acquisition | Measured, below 3 months of plan revenue |

### After 90 days

- Summer bootcamp (Jun–Jul).
- ACT content, once SAT runs smoothly.
- AP Calc and AP CS tutoring pages.
- An AI explanation assistant that sits on top of human tutors.
- Regional landing pages and pricing (UAE, India, UK, Australia).

---

## 10. Decisions needed from the founders

1. **Content:** do you agree to unpublish and stop selling anything built on College Board questions, and to fund an original question bank? *(Recommended: yes, before any marketing.)*
2. **Business model focus:** is tutoring + platform the main product (recommended), or is self-paced the main product? This decides pricing, ad spend and which features come first.
3. **Price points:** lower the hourly rate to about $35–45/hr in a hybrid bundle, or keep $54–62/hr?
4. **First international market** after US/Canada: Gulf/India (time zone and growth) or UK/Europe (as stated)? The data points to the Gulf/India first.
5. **Budget:** about $1–2k/month for paid tests from January, plus a part-time content/social person.

---

*Sources:*
- *Competitors:* [Bluebook test count](https://thetestadvantage.com/blog/how-many-practice-tests-does-bluebook-have), [Khan Academy](https://support.khanacademy.org/hc/en-us/articles/23298985511821), [PrepScholar FAQ](https://www.prepscholar.com:443/sat-test-prep/sat-faq), [Kaplan](https://www.kaptest.com/sat/best-sat-prep-courses), [Princeton Review review](https://katalystprep.com/sat/reviews/princeton-review/), [Acely pricing](https://help.acely.com/en/articles/12997293-how-much-does-acely-cost), [iD Tech](https://idtech.com/courses/tutoring-general-computer-science), [Wyzant](https://www.wyzant.com/SAT_tutors.aspx).
- *Market:* [SAT class of 2026](https://k12dive.com/news/sat-scores-are-up-across-the-board-for-class-of-2026/831670), [International growth](https://www.acceptancerate.com/?p=486369), [Test requirements returning](https://www.academicapproach.com/round-up-which-universities-are-requiring-act-sat-scores/), [Columbia](https://www.highereddive.com/news/columbia-reinstates-sat-act-requirements-for-2027-28/822957/), [Test dates](https://satsuite.collegeboard.org/sat/dates-deadlines).
- *Acquisition and legal:* [CAC benchmark](https://focus-digital.co/average-customer-acquisition-cost-for-online-education/), [College Board educator terms](https://privacy.collegeboard.org/educator-legal-terms).
