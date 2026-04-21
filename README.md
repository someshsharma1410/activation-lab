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

## What v2 addressed

I ran the tool past five AI models before launch. They all approved. Then someone outside product management tried it, and within five minutes I had a different list. None of the AI reviewers had flagged any of it.

AI reviews logic. First-time users review their experience. Those are two different audits — v2 is the one I'd skipped.

Shipped in v2:

- **Accessibility pass** — screen-reader-friendly labels on every form control, live regions on inline warnings, proper label-input associations
- **Plain-English copy** — the activation question was rephrased from "What does activation mean for your product?" to "When do users feel they've actually started using your product?" and PM jargon was softened throughout
- **Clearer example buttons** — heading changed from "New here? Try an example:" to "Click a sample to fill in the box below:" so users know what happens when they click
- **Softer character-threshold warning** — invitational instead of prescriptive: "A bit more detail will sharpen the analysis — 2 or 3 steps usually does it."
- **Privacy disclosure** — one line of microcopy under the input: *Your input is sent to Anthropic's Claude API for analysis and isn't stored by Activation Lab.*

## Built with

- **Anthropic Claude Sonnet 4** as the reasoning engine, accessed via the Claude API
- **Claude Code** as the development environment
- **React + TypeScript + Vite** for the frontend
- **jsPDF** for client-side PDF export
- **Vercel** for hosting

## About

Built by Somesh Sharma, Senior Product Manager.

- Portfolio: [someshsharmapm.com](https://someshsharmapm.com)
- LinkedIn: [linkedin.com/in/someshsharma1410](https://www.linkedin.com/in/someshsharma1410/)

This is a portfolio piece, not a product. I don't sell access, collect emails, or offer paid features. If you find it useful for thinking through an activation problem, that's the point.
