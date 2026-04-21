# Activation Lab

Find friction worth fixing. Describe any onboarding flow and get ranked A/B test hypotheses grounded in real activation frameworks.

**🔗 Live:** https://activation-lab-lime.vercel.app/

---

## Why I built this

PM reasoning is the bottleneck in experimentation. Identifying friction is easy. Knowing which test to run first, why, and what the risk is — that is the actual job.

I wanted a tool that could think through the tradeoffs with me instead of just listing problems. Most AI tools that analyze product flows list what's wrong. They don't tell you what to do first.

## What it does

You describe any onboarding or activation flow in plain English, optionally tell the tool what activation means for your product, and get back:

- **3 to 5 ranked friction points** with severity, confidence, and effort scoring
- **A test hypothesis for each**, grounded in activation frameworks: Time to Value, Funnel Drop-off, Aha Moment, Cognitive Load, or Skippable vs Required steps
- **Run order sequencing** with rationale for why one test should go before another
- **A "watch out for" risk line** per test — the second-order consequence you need to think about before running it
- **Expected lift range** benchmarked against comparable experiments
- **Progressive disclosure UI** — collapsed cards for scanning, expand any card for the full experiment spec
- **Follow-up chat** — ask questions about the analysis with the full context preserved
- **Export options** — one-page PDF brief for async sharing, or copy as markdown
- **Input scope validation** — soft warning when the input doesn't look like a product onboarding flow

## The insight that shaped the design

When you rank friction by fixability instead of by impact, you optimize for the wrong test.

The tool ranks by commitment barrier and expected lift, not by how easy a fix would be to ship. That's the whole design philosophy. A recent run on a fintech KYC flow made the point concrete: the tool recommended exposing a demo dashboard before KYC (40% expected lift) over reducing document form fields (25% expected lift), because the real barrier was commitment, not cognitive load.

The fastest test to run is rarely the one that moves the metric most.

## Product decisions I made during the build

These are the calls I made as the PM on this, and why:

- **Why 3 to 5 friction points, not 10.** More than 5 dilutes focus and trains PMs to treat every flaw as equal. The whole point of the tool is prioritization, not completeness.

- **Why "Run first / second / third" instead of a priority score.** A numeric score invites debate. A run order forces commitment.

- **Why every card shows a "watch out for" line.** PMs stop reading when a tool only tells them what to do. Showing what could go wrong signals the tool has done the second-order thinking for them. It reads as a thinking partner instead of a generator.

- **Why progressive disclosure on the cards.** A PM shouldn't have to read five full specs to decide which friction point to focus on. The collapsed view shows rank, framework, and a one-line summary. Expand only the ones worth the deeper read.

- **Why follow-up chat with the full analysis in context.** The analysis is the start of a conversation, not the end of one. PMs need to pressure-test the reasoning — "why this order?" "what tool should I use?" — without losing the original frame.

- **Why no user accounts or saved history.** Scope discipline. Activation Lab is a thinking partner for a single session, not a CRM. Saved history is a different product.

- **Why these five frameworks and no more.** Time to Value, Funnel Drop-off, Aha Moment, Cognitive Load, and Skippable vs Required steps cover the failure modes that account for most activation friction I've seen in the wild. Adding more would sound comprehensive but dilute the output.

- **Why input validation is a soft warning, not a hard block.** A B2B sales process isn't the target use case, but I'm not the arbiter of what a user wants to analyze. The tool warns and lets them proceed.

- **Why pre-compute the built-in sample analyses instead of letting them hit the API like any other flow.** If a recruiter clicks a sample, that is the demo moment. A 25-second wait is the wrong first impression for a tool whose pitch is clear thinking. Pre-computing turns the highest-traffic path from "acceptable" into "instant" for 30 minutes of work. The trade — a saved analysis that doesn't respond to custom activation-metric input — is made explicit with a small "Sample" pill and one line of disclosure.

- **Why stream the live API instead of just optimizing the wait.** A 25-second wait is not really a 25-second wait if useful output appears in three seconds. Streaming trades "all at once, slow" for "progressively, start reading immediately." PMs scan anyway — card-by-card arrival matches how the output is actually read, not a wall of JSON landing as a block.

## What v2 addressed

I ran the tool past five AI models before launch. They all approved. Then someone outside product management tried it, and within five minutes I had a different list. None of the AI reviewers had flagged any of it.

AI reviews logic. First-time users review their experience. Those are two different audits — v2 is the one I'd skipped.

Shipped in v2:

- **Accessibility pass** — screen-reader-friendly labels on every form control, live regions on inline warnings, proper label-input associations
- **Plain-English copy** — the activation question was rephrased from "What does activation mean for your product?" to "When do users feel they've actually started using your product?" and PM jargon was softened throughout
- **Clearer example buttons** — heading changed from "New here? Try an example:" to "Click a sample to fill in the box below:" so users know what happens when they click
- **Softer character-threshold warning** — invitational instead of prescriptive: "A bit more detail will sharpen the analysis — 2 or 3 steps usually does it."
- **Privacy disclosure** — one line of microcopy under the input: *Your input is sent to Anthropic's Claude API for analysis and isn't stored by Activation Lab.*

## What v3 addressed

Two users, two different complaints, same root cause:

> *"I clicked the sample and waited 25 seconds. I thought it was broken."*
>
> *"The spinner on my own flow felt endless. I almost closed the tab."*

Both were pointing at the same thing — time to first useful output was too long. A tool whose pitch is clear thinking loses most of its audience before they see it work if it makes them stare at a spinner first. v3 was the speed pass.

Shipped in v3:

- **Instant sample analyses** — the three built-in samples (SaaS signup, Mobile app, Marketplace) now render in ~600 ms instead of 20–25 s. Real API responses were generated once, saved as static JSON, and shipped with the bundle. A small "Sample" pill with one line of microcopy keeps it honest: edit the text or paste your own flow and you are back on the live API. Regenerate the saved responses anytime with `node scripts/generate-samples.mjs`.

- **Streaming live analyses** — typed or edited flows now stream friction points one at a time instead of returning as a single 25-second blob. First card lands in ~2–4 s. The user can start reading and arguing with card #1 while cards #2–5 are still being generated. A pulsing "N ready so far" indicator sits below the last card until the stream completes and the summary block lands at the end. Built on Anthropic's SSE API plus `partial-json` for tolerant mid-stream parsing.

- **Lighthouse to 100 on everything that is not live-API-bound** — accessibility 100 (aria labels, live regions, proper `<main>` landmark, WCAG AA contrast on every color pair), best practices 100, SEO 100 (meta description). Mobile Performance jumped from 89 to 95+ by lazy-loading the PDF export pipeline (jsPDF + html2canvas, ~394 KB chunk) only when a user actually clicks Export. Main bundle dropped from 621 KB to 244 KB.

## Built with

- **Anthropic Claude Sonnet 4** as the reasoning engine, accessed via the Claude API with server-sent-event streaming
- **Claude Code** as the development environment
- **React + TypeScript + Vite** for the frontend
- **partial-json** for tolerant parsing of in-flight streamed JSON so cards can render as each one finishes
- **jsPDF + html2canvas** for client-side PDF export, lazy-loaded on the first Export click
- **Vercel** for hosting

## About

Built by Somesh Sharma, Senior Product Manager.

- Portfolio: [someshsharmapm.com](https://someshsharmapm.com)
- LinkedIn: [linkedin.com/in/someshsharma1410](https://www.linkedin.com/in/someshsharma1410/)

This is a portfolio piece, not a product. I don't sell access, collect emails, or offer paid features. If you find it useful for thinking through an activation problem, that's the point.
