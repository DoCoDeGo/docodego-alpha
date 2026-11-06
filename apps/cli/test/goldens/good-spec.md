---
name: good-spec
type: unit
epic: parser-hardening
status: draft
---

# good-spec

## intent

The record parser must survive any input: every problem becomes a positioned
diagnostic and the parse continues, so passes always have an AST to walk.

## scope

In: the markdown parser and its span arithmetic.
Out: the passes that consume the AST.

## acceptance

- a truncated file yields a diagnostic, not a crash
- every diagnostic cites a 1-based line and column, checkable against the file

## threats

- truncated multibyte characters break span arithmetic -> slice on code units and test with emoji

| pass | max | scored |
|---|---|---|
| span sanity | 10 | 10 |

```ts
const span: number = 1;
```
