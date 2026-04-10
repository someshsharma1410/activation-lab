# Activation Lab — Release Notes

**Project:** Activation Lab
**Owner:** Somesh Sharma
**Live URL:** https://activation-lab-lime.vercel.app
**GitHub:** https://github.com/someshsharma1410/activation-lab

---

## v2.0 — April 2026

### What changed and why

v2 is not a rebuild. It is a targeted iteration on v1 based on real user feedback from Justin (non-PM background) and an internal review of the output quality. The strategic shift: v1 was built for PMs who already speak the language. v2 expands the audience to founders, growth marketers, designers, and anyone thinking about activation without a product background.

---

### Feedback sources

| Source | Type | What they flagged |
|---|---|---|
| Justin | External user, non-PM background | First real user outside the PM world. Tested v1 cold and reported back across 9 themes. Primary feedback source for v2. |
| Internal review (Claude Code session) | Build-time review | Output density, ranking logic inconsistency, example quality, TypeScript types |
| Grok review | External AI review | Friction point count felt templated and artificial at exactly 4 every time |

---

### Changes by theme

#### First impression and onboarding

**Source: Justin**

- Hero subtitle rewritten. "Get ranked A/B test hypotheses grounded in real PM frameworks" replaced with "Paste an onboarding flow. Get experiment ideas backed by proven product frameworks." Removed "A/B test hypotheses" and "PM frameworks" — both flagged as insider language that intimidated non-PM users on first load.
- Example buttons redesigned. Added a "New here? Try an example:" label above the chip row. Each chip now has a small "eg" badge. The chip section has its own background block visually separated from the input area. Justin noted the examples visually blended with the input and were not clearly labeled as examples.

#### Example quality

**Source: Internal review (Claude Code session)**

- All three example flows replaced with neutral descriptions. The v1 examples named the friction explicitly inside the description (e.g. "no indication of where they are in the process"). This handed the answer to the tool rather than letting it do the identifying. v2 examples describe what happens step by step without characterizing any step as friction.
- New examples cover the same three archetypes: SaaS signup, mobile app, marketplace. Labels shortened to match.

#### Input friction

**Source: Justin**

- Hard 100-character minimum removed. Justin noted it created friction for quick testing and felt like a barrier before a user had even understood what to type.
- Soft warning introduced at 50 characters: "Add more detail for a more complete analysis. At least 2 to 3 steps works best." Warning is amber, non-blocking. Submission is allowed at any length above zero.
- Textarea now auto-expands from 4 rows to 8 rows on focus, making it feel less like a tweet box and more like a canvas.
- Input border highlights blue on focus. Small detail, signals the field is active.
- Placeholder text updated to a step-by-step example format: "E.g. User lands on homepage, sees value prop, clicks sign up..."

#### Prioritization logic

**Source: Justin, Internal review**

Justin flagged that "Run first / Run second" did not always match higher estimated lift and that the scoring logic was a black box. A 25 percent lift suggestion appearing below an 18 percent one with no explanation broke trust in the output.

- Effort field added as a discrete score on each friction point (low / medium / high). This is the missing variable that explains ranking inversions — a lower-lift item can rank above a higher-lift one if it is significantly lower effort.
- Ranking model formalized and made visible: Impact x Confidence as primary sort, Effort as tiebreaker (lower effort wins). This replaced the previous opaque formula that combined sequence_rationale and risk-based ordering.
- sequence_rationale field retired entirely. Clean break. Keeping both the old and new logic would have defeated Justin's core point about transparency.
- Three visible score chips added to each card: Impact (high / medium / low), Effort (low / medium / high), Confidence (high / medium / low). Each chip is color-coded — green means favorable, red means unfavorable, reversed for effort since low effort is desirable.
- Ranking logic explainer added above the card list: "Ranked by Impact x Confidence, then Effort. High impact, high confidence, low effort goes first."
- TypeScript types updated: Effort type added, sequence_rationale removed from AnalysisSummary.

#### Friction point count

**Source: Grok**

- System prompt updated to give the model explicit permission to use judgment. Previous instruction read like a hard quota ("3 to 5 friction points"). New instruction: "Return between 3 and 5 friction points using your own judgment. If the flow has only 3 meaningful friction points do not invent a fourth. If it has 5 distinct high-value ones include all 5. Quality over completeness."

#### System prompt quality

**Source: Internal review (Claude Code session)**

- Plain language requirement added. Model now instructed to write for a smart user who is not a product manager. If it uses a term like "funnel drop off" or "time to value" it must immediately follow with a plain explanation.
- Reference grounding added. Model now instructed to anchor recommendations in real published examples where confident: Duolingo, Notion cited as anchors. Explicitly told not to invent examples.
- Consistent ranking rule added to the prompt. Ranking inversions must be explained in the card description if they occur.
- Compliance carveout preserved from v1: training and mandatory compliance steps in gig economy or regulated industry flows must never be recommended as optional. Compress, modularize, or make just-in-time instead.

#### Export

**Source: Internal review (Claude Code session)**

- Markdown export updated to reflect new schema. Now outputs Impact, Effort, Confidence, Framework instead of the old Severity line.

---

### What was explicitly not built in v2

Per the v2 spec scope discipline:

- No user accounts or login
- No saved analyses or session history
- No hover definitions for PM terms (deferred to Phase 4)
- No "How are these estimated?" modal (deferred to Phase 4)
- No privacy modal (deferred to Phase 4)
- No progressive disclosure / collapse-expand cards (deferred, to be done as a separate pass after Phase 1 feedback lands)
- No integrations, no mobile app, no multi-language support

---

## v1.0 — April 2026

### What was built

First working version. Built in a single Claude Code session from scratch. Shipped and sent to real users within the same week.

**Stack:** React 19, TypeScript, Vite, Anthropic Claude API (claude-sonnet-4-20250514), deployed on Vercel.

**Core feature:** Describe any onboarding flow in plain text. Receive a ranked list of friction points with hypotheses, recommended A/B tests, expected lift ranges, and a sequence order for which to run first.

---

### Features shipped in v1

#### Analysis engine
- Single API call to Claude via a Vite dev proxy (adds anthropic-version header automatically)
- System prompt grounded in five PM frameworks: Time to Value, Activation Funnel drop-off, Aha Moments, Cognitive Load, Skippable vs Required steps
- JSON response with strict schema: friction_points array plus summary object
- Markdown code block stripping on the response to handle model formatting variance
- anthropic-dangerous-direct-browser-access header added for direct browser API calls in production

#### Output schema (v1)
Each friction point included: id, title, description, hypothesis (if/then/because), recommended_test (Variant A vs B), expected_lift (low/mid/high integers), lift_context (benchmark phrase), confidence, severity, framework, risk, sequence_order, sequence_rationale.

Summary included: total_friction_points, top_recommendation, average_expected_lift, sequence_rationale.

#### UI
- Design system: background #f5f4f1, card white, card surface #eeecea, accent blue #1a6ff0, accent purple #6c47d4, text #1a1a2e, muted #5a5a7a
- Typography: DM Sans (300 / 400 / 500 / 600) for body, DM Serif Display for the h1
- Three example chips that pre-filled the textarea on click
- Textarea with 100-character hard minimum before Analyze button enabled
- Character counter showing remaining or current count
- Severity-tinted friction cards: red tint for high, orange for medium, green for low
- 3px colored top border per card matching severity
- Hypothesis in purple-tinted inset box
- Recommended test in blue-tinted inset box
- Risk in red-tinted inset box labeled "Watch out for"
- Expected lift range with mid estimate and benchmark context phrase
- Sequence badges: Run first / Run second / Run third / Run fourth
- Summary bar: top recommendation, total friction points count, average expected lift percentage, sequence_rationale in italic
- Spinner with "Analyzing your flow..." during API call
- Error display for API failures
- Copy as markdown export button

#### Infrastructure
- Vite proxy: /api/analyze forwards to https://api.anthropic.com/v1/messages
- API key stored in .env.local, excluded from git via .gitignore
- Deployed to Vercel at activation-lab-lime.vercel.app
- GitHub repo: https://github.com/someshsharma1410/activation-lab
- .gitignore covers: .env, .env.local, .env.*.local, node_modules, dist, build, .DS_Store, .vercel, .claude

#### System prompt (v1 final state)
- Frameworks: TTV, Funnel, Aha, CogLoad, Skippable
- JSON-only output with no preamble, markdown, or backticks
- lift_context as a separate field from the low/mid/high integers
- sequence_order ranked by impact x confidence divided by risk (later retired in v2)
- 3 to 5 friction points, ordered by severity then expected lift
- Compliance carveout: never recommend making regulated training optional

---

### Known issues at v1 launch (addressed in v2)

Documented from Justin's feedback after first real-world use:

1. Technical language on first load intimidated non-PM users
2. Example chips not clearly labeled as examples, blended visually with the input
3. Examples revealed the friction inside their own descriptions, defeating the tool's purpose
4. 100-character hard minimum created unnecessary friction before users understood what to type
5. Average lift number had no explanation of what it meant or where it came from
6. Prioritization logic ("Run first / Run second") did not always match lift estimates with no visible explanation
7. PM jargon (Time to Value, Activation Funnel) unexplained for non-PM users
8. No visible indication of what data is submitted or stored
9. Output felt dense and hard to scan at a glance

---

*Maintained by Somesh Sharma. Last updated April 2026.*
