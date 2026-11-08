---
name: security-baseline-for-ai-code
description: Pre-merge security check for AI-written code. Use when reviewing, verifying, or delivering agent-authored features - catches the vulnerability patterns AI introduces most - missing auth or row-level access control on new endpoints, XSS in rendered output, hardcoded credentials, unsafe deserialization - and turns each finding into a recorded proof or a recorded refusal.
version: 1.0.0
---

# security-baseline-for-ai-code

AI-authored code carries measurably more security debt than human-authored
code: Veracode found ~45% of AI-generated development tasks introduce
security vulnerabilities, and CodeRabbit (Dec 2025) found AI-authored PRs
carry 2.74x more issues, XSS-specific above all. The Lovable CVE-2025-48757
failure mode is the shape to expect: feature-complete-looking work whose
new surface simply never checked who was asking.

## The four checks

Run all four against the unit's diff. Each ends in evidence: a probe, a
test, or a recorded refusal - never a prose claim.

1. **Every new endpoint or data path answers "who is allowed?"** Find each
   new route, handler, or query the unit added. For each: where is the
   auth check, and does it enforce per-user scope (row-level access), or
   only "logged in"? A query that returns another tenant's rows is the
   finding. Evidence: the probe that gets refused, or the fix.
2. **Rendered output is escaped where it is rendered.** Trace every new
   field that reaches HTML, markdown, or a template. Evidence: the escaped
   render or the sanitizer call, cited by path.
3. **No credentials in the diff.** Search the unit's files for keys,
   tokens, connection strings, and .env additions. Evidence: the grep
   output (clean), or the secret moved to configuration.
4. **Deserialization and eval stay out.** New JSON.parse of external
   input, dynamic eval, or child_process with interpolated strings is a
   finding by itself. Evidence: the code path that refuses, or the rewrite.

## The record tie-in

The proofs.md entry names what ran: the probe, its target, its result.
"Reviewed for security" is not evidence. A finding honestly recorded as
open beats a claim that it was checked - the record's honesty law applies
here with full force.
