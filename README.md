# Activation Lab

Find friction worth fixing. Describe any onboarding flow and get ranked A/B test hypotheses grounded in real activation frameworks.

**🔗 Live:** https://activation-lab-lime.vercel.app/

---

## Why I built this

PM reasoning is the bottleneck in experimentation. Identifying friction is easy. Knowing which test to run first, why, and what the risk is — that is the actual job.

I wanted a tool that could think through the tradeoffs with me instead of just listing problems. Most AI tools that analyze product flows list what's wrong. They don't tell you what to do first.

## What it does

You describe any onboarding or activation flow in plain English. The tool returns:

- **3 to 5 ranked friction points** with severity scoring
- **A test hypothesis for each**, grounded in activation frameworks (Time to Value, Funnel Drop-off, Cognitive Load, Aha Moment)
- **Run order sequencing** with rationale for why one test should go before another
- **A "watch out for" risk line** per test — the second-order consequence you need to think about before running it
- **Expected lift range** benchmarked against comparable experiments

## The insight that shaped the design

When you rank friction by fixability instead of by impact, you optimize for the wrong test.

The tool ranks by commitment barrier and expected lift, not by how easy a fix would be to ship. That's the whole design philosophy. A recent run on a fintech KYC flow made the point concrete: the tool recommended exposing a demo dashboard before KYC (40% expected lift) over reducing document form fields (25% expected lift), because the real barrier was commitment, not cognitive load.

The fastest test to run is rarely the one that moves the metric most.

## Product decisions I made during the build

These are the calls I made as the PM on this, and why:

- **Why 3 to 5 friction points, not 10.** More than 5 dilutes focus and trains PMs to treat every flaw as equal. The whole point of the tool is prioritization, not completeness.

- **Why "Run first / second / third" instead of a priority score.** A numeric score invites debate. A run order forces commitment.

- **Why every card shows a "watch out for" line.** PMs stop reading when a tool only tells them what to do. Showing what could go wrong signals that the tool has done the second-order thinking for them. It reads as a thinking partner instead of a generator.

- **Why no user accounts or saved history.** Scope discipline. Activation Lab is a thinking partner for a single session, not a CRM. Saved history is a different product.

- **Why Time to Value, Funnel Drop-off, Cognitive Load, and Aha Moment as the core frameworks.** They cover the four failure modes that account for most activation friction I've seen in the wild. Adding more frameworks would sound comprehensive but dilute the output.

## Built with

- **Claude Code + Anthropic API** for the reasoning engine
- **Lovable** for the initial UI scaffolding
- **React + TypeScript + Vite** for the frontend
- **Vercel** for hosting

## About

Built by Somesh Sharma, Senior Product Manager.

- Portfolio: [someshsharmapm.com](https://someshsharmapm.com)
- LinkedIn: [linkedin.com/in/someshsharma1410](https://www.linkedin.com/in/someshsharma1410/)

This is a portfolio piece, not a product. I don't sell access, collect emails, or offer paid features. If you find it useful for thinking through an activation problem, that's the point.
