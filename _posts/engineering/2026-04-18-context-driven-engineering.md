---
layout: post
title: "Context-Driven Engineering: A Paradigm Shift for Teams Building with LLMs"
description: "What happens when you give a powerful code generator unbounded access to a codebase with no explicit context. And how to fix it."
category: engineering
image: "/assets/blogimg/cde-head.png"
---

![Context-Driven Engineering](/assets/blogimg/cde-head.png)

## The problem nobody is talking about

Your team adopted LLMs. Velocity went up. Then something else happened.

The system became harder to reason about. Changes started breaking things in unexpected places. The same input produced different outputs. Nobody could fully explain why the system behaved the way it did.

This is not a coincidence. This is what happens when you give a powerful code generator unbounded access to a codebase with no explicit context.

LLMs do not understand your system. They pattern-match against what they can see. And if what they can see is incomplete, implicit, or undocumented, they fill the gaps with plausible assumptions. Every single time.

## The unbounded LLM problem

Most teams using LLMs today are running them in one of two modes:

Mode 1: The LLM as a fast typist. You describe what you want, it writes the code, you review it. This works until the codebase gets complex enough that the LLM's assumptions start conflicting with your actual system contracts.

Mode 2: The LLM as an autonomous agent. You give it a task, it runs, it changes files, it makes decisions. This feels like magic until it isn't. The LLM has no idea what it should not touch. It has no understanding of your boundaries. It optimizes for completing the task, not for preserving your system's integrity.

Both modes share the same root problem: the LLM is operating without explicit context about the system it is modifying.

The result is what we call implicit architecture, behavior that emerges from assumptions instead of contracts. Rules that live in someone's head. Boundaries that are never stated but always violated.

Implicit architecture is the root cause of most production instability in LLM-assisted teams. Not the LLM itself. The absence of constraints around it.

## What the data shows

The data is now in. A February 2026 [ETH Zurich / LogicStar.ai study][r-eth-agents-md] evaluated AGENTS.md across 138 real-world GitHub tasks with four major coding agents: human-written context files improved task resolution rates by around 4%, while LLM-generated context files reduced performance by 3% and increased inference cost by more than 20%. Context matters, but only when humans write it.

The [Opsera AI Coding Impact Benchmark Report][r-opsera-2026] from February 2026, covering over 250,000 developers across 60-plus enterprise organizations, found that AI-generated pull requests wait 4.6 times longer in review without governance frameworks, and AI-generated code introduces 15 to 18% more security vulnerabilities as autonomy expands. [Faros AI research][r-faros-paradox] from July 2025 reported PR volume up 98% on high-adoption teams with review time up 91%. Teams write more code faster and spend significantly more time validating it. Stanford and SambaNova's October 2025 [Agentic Context Engineering paper][r-ace-paper] showed that structured incremental context updates reduce drift and latency by up to 86% compared to unmanaged approaches.

The industry now has numbers for what Context-Driven Engineering has been arguing. The unbounded LLM problem is not a hypothesis. It is measured.

## What LLMs actually amplify

Here is the insight that changes how you think about this:

> LLMs amplify whatever structure they find. They amplify good structure into good code. They amplify implicit or missing structure into chaos, faster than any human engineer could.

A senior engineer joining a codebase without context makes mistakes slowly. They ask questions. They read the code carefully. They hesitate before touching things they don't understand.

An LLM without context makes mistakes at generation speed. It does not hesitate. It does not ask. It produces confident, plausible, wrong code.

The problem scales with your codebase complexity and your LLM usage. The more you use LLMs, and the more complex your system, the more damage implicit architecture causes.

## Why this is not just "context engineering"

In 2025 the industry converged on a term. Andrej Karpathy framed it. Tobi Lütke echoed it. [Anthropic's September 2025 engineering post][r-anthropic-context] formalized it. [Thoughtworks' Technology Radar][r-thoughtworks-radar] declared 2025 the year of the shift. [MIT Technology Review][r-mit-tech-review] covered it in November. The term is "context engineering", and it is a real advance over the vibe coding that preceded it.

The open standard is already emerging. [AGENTS.md][r-agents-md] was donated to the Linux Foundation's Agentic AI Foundation in December 2025, with support from OpenAI, Anthropic, and Sourcegraph. A single rules file at the root of the repository. Configuration for the agent.

That is useful. It is also not the same thing.

> **Context Engineering** is about giving the AI better inputs, curated context files, RAG systems, prompt structuring, retrieval. The goal is AI output quality.
>
> **Context-Driven Engineering** is broader. It treats context as the organizing principle of the codebase itself, not as configuration for an agent. The AI is one consumer of the context. The humans on the team are the primary consumers. The discipline covers how work gets done, not just how prompts get constructed.

AGENTS.md is a configuration file. CDE is an engineering discipline. One tells the agent how to behave. The other defines how the team organizes its knowledge and how work flows through that knowledge.

CDE is a superset. Adopt it and you get everything context engineering promises, better inputs, cleaner retrieval, fewer hallucinated assumptions. You also get a shared mental model across the team, coordination that survives handoffs, and enforcement discipline that a root-level rules file cannot provide.

## Context-Driven Engineering

The solution is not to use LLMs less. The solution is to make your system's context explicit, and to put that context where both humans and LLMs can find it.

Context-Driven Engineering is built on one principle:

> Context lives next to the code. READMEs are part of the architecture. Humans and LLMs rely on them equally.

This means every meaningful component in your system has a README that answers:

- What does this component do
- What does it explicitly NOT do
- What are its contracts and boundaries
- What are its known failure modes
- What must never change without a spec update

This is not documentation. Documentation is optional. This is architecture. It is load-bearing.

## The delivery model

Context-Driven Engineering changes how work gets done. Every non-trivial change follows four stages, in order:

**Context.** Before anything else, read the relevant README. If it is missing or wrong, fix it first. Missing context is a blocker, not a prompt to guess.

**Spec.** Define what the system must do. This is the behavioral contract. It lives in version control. It is reviewed like code.

**Plan.** Write the implementation plan with the LLM, for the LLM. Target files. Target behavior. Out-of-bounds areas. Tests to write. This is the scope contract. The LLM operates inside it.

**Implementation.** Code is written against the plan. The LLM executes within defined boundaries. No stage is skipped.

Without a spec, behavior changes are invisible to everything downstream. Without a plan, the LLM drifts from intent. Without context, both the spec and the plan are built on assumptions.

## What changes in practice

![The constrained LLM operating inside explicit boundaries](/assets/blogimg/cde-Constrained-LLM.png)

The LLM is no longer autonomous. It operates inside the system you built, constrained by the context you wrote.

Before any prompt: what is the scope? What files are in bounds? What must not change? This is declared before generation starts, not discovered after the diff lands.

The README in a folder is the authoritative description of that folder. If the LLM's output contradicts the README, the LLM is wrong, not the README.

No non-trivial change lands without a human reviewer who read the context, understood the plan, and owns the outcome.

## Getting started

You do not need to rewrite everything. Start small:

1. Pick the most unstable or least understood component in your system
2. Write a README for it: what it does, what it does not, its contracts, its known failure modes
3. Before the next change to that component, read the README first
4. After the change, update the README if reality has shifted
5. If you are already using AGENTS.md or CLAUDE.md, keep it, CDE complements it. Treat those files as one artifact of the larger discipline, not as the endpoint.

Do this consistently. Expand outward. Within weeks you will have a codebase where the LLM's scope is always defined, its assumptions are always constrained, and its output is always reviewable against an explicit standard.

## Conclusion

The teams that will build reliable systems with LLMs are not the ones that use LLMs most aggressively. They are the ones that build the most explicit systems around them.

Context-Driven Engineering is not a framework. It is a discipline. The premise is simple: a system that cannot be explained cannot be maintained, and a system without explicit context will be degraded by every LLM that touches it.

The industry is converging on context engineering. That is good, it means the problem is finally being named. But naming the problem is not solving it. Adopting a rules file is not the same as building a discipline. The teams that will lead the next phase of AI-assisted development are the ones that make context the organizing principle of how they work, not a side-artifact for the agent to consume.

Write the context. Keep it next to the code. Treat it as architecture.

The LLM will do the rest, correctly this time.

[r-eth-agents-md]: https://arxiv.org/abs/2602.11988
[r-opsera-2026]: https://opsera.ai/resources/report/ai-coding-impact-2026-benchmark-report/
[r-faros-paradox]: https://www.faros.ai/blog/ai-software-engineering
[r-ace-paper]: https://arxiv.org/abs/2510.04618
[r-mit-tech-review]: https://www.technologyreview.com/2025/11/05/1127477/from-vibe-coding-to-context-engineering-2025-in-software-development/
[r-anthropic-context]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[r-thoughtworks-radar]: https://www.thoughtworks.com/radar
[r-agents-md]: https://agents.md/
