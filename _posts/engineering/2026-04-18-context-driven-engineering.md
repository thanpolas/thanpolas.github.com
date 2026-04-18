---
layout: post
title: "Context-Driven Engineering: A Paradigm Shift for Teams Building with LLMs"
description: "What happens when you give a powerful code generator unbounded access to a codebase with no explicit context. And how to fix it."
category: engineering
---

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

## What LLMs actually amplify

Here is the insight that changes how you think about this:

> LLMs amplify whatever structure they find. They amplify good structure into good code. They amplify implicit or missing structure into chaos, faster than any human engineer could.

A senior engineer joining a codebase without context makes mistakes slowly. They ask questions. They read the code carefully. They hesitate before touching things they don't understand.

An LLM without context makes mistakes at generation speed. It does not hesitate. It does not ask. It produces confident, plausible, wrong code.

The problem scales with your codebase complexity and your LLM usage. The more you use LLMs, and the more complex your system, the more damage implicit architecture causes.

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

Do this consistently. Expand outward. Within weeks you will have a codebase where the LLM's scope is always defined, its assumptions are always constrained, and its output is always reviewable against an explicit standard.

## Conclusion

The teams that will build reliable systems with LLMs are not the ones that use LLMs most aggressively. They are the ones that build the most explicit systems around them.

Context-Driven Engineering is not a framework. It is a discipline. The premise is simple: a system that cannot be explained cannot be maintained, and a system without explicit context will be degraded by every LLM that touches it.

Write the context. Keep it next to the code. Treat it as architecture.

The LLM will do the rest, correctly this time.
