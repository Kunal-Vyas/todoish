# Agents

Instructions and coding standards for AI agents contributing to the Todoish codebase. Follow these guidelines to produce clean, maintainable, and consistent code.

---

## General Principles

1. **Simplicity first.** Write the simplest code that solves the problem. Avoid premature abstraction and over-engineering.
2. **Readability over cleverness.** Code is read far more often than it is written. Prioritize clarity over brevity.
3. **Consistency within the codebase.** Match the existing style, patterns, and conventions. Do not introduce a new pattern without a documented reason.
4. **Zero warnings.** Code must compile/run with zero warnings and zero lint errors before being considered complete.
5. **Tests are not optional.** Every new code path must be covered by tests. Bug fixes must include a regression test.

---

## Specs-Driven Development

This is a **specs-first** project. Every feature, bug fix, and architectural change begins with a spec — never with code.

### The `.specs/` Directory

All specifications live under `.specs/` at the project root. This directory is the single source of truth for what the application should do and how it should behave.

```
.specs/
├── features/          # Feature specifications
│   ├── task-crud.spec.md
│   ├── subtasks.spec.md
│   ├── recurring-tasks.spec.md
│   ├── kanban-board.spec.md
│   └── ...
├── contracts/         # API contracts & data schemas
│   ├── task-api.contract.md
│   └── sync-protocol.contract.md
├── designs/           # UI/UX design specs
│   ├── list-view.design.md
│   └── theme.design.md
└── migrations/        # Data migration specs
    └── v1-to-v2.migration.md
```

### Spec-First Workflow

1. **Read the spec.** Before touching any code, locate and read the relevant spec under `.specs/`. If no spec exists, create one first.
2. **Clarify ambiguity.** If the spec is unclear, ask for clarification or update it. The spec changes before the code does.
3. **Implement to the spec.** Write code that satisfies the spec exactly — no more, no less. Gold-plating beyond the spec creates untested, undocumented behavior.
4. **Test against the spec.** Tests verify the behavior described in the spec. Every acceptance criterion in a feature spec maps to at least one test case.
5. **Update the spec.** If implementation reveals missing edge cases or necessary changes, update the spec first, then the code.

### Spec Naming & Format

- Feature specs use `.spec.md` extension and are named after the feature (`task-crud.spec.md`).
- API contracts use `.contract.md` and define request/response shapes, error codes, and validation rules.
- Design specs use `.design.md` and describe UI behavior, component states, and interaction patterns (not visual pixel layouts).
- Every spec includes an **Acceptance Criteria** section with a checklist of testable conditions.

### Living Documents

Specs are living documents. They evolve with the codebase. When a feature changes, the spec changes first. Stale specs are a bug — treat them with the same urgency as broken tests.

---

## Code Style

### Naming

- **Files:** lowercase with hyphens (`task-agent.ts`, `use-task-list.ts`). Test files use `.test.ts` suffix.
- **Variables & functions:** `camelCase`. Booleans should read as questions (`isLoading`, `hasError`, `canEdit`).
- **Types & interfaces:** `PascalCase`. Prefer `interface` over `type` unless you need unions or mapped types.
- **Constants:** `UPPER_SNAKE_CASE` for true constants (never reassigned, known at compile time). `camelCase` for module-scoped values that are set once but computed.
- **React components:** `PascalCase`, named identically to their file (`TaskList.tsx` exports `TaskList`).
- **Events & callbacks:** Prefix with `on` for props (`onSave`, `onClose`) and `handle` for implementations (`handleSave`, `handleClose`).

### Functions

- Keep functions small — aim for 20 lines or fewer. If a function exceeds 40 lines, split it.
- A function should do one thing and have a name that says exactly what it does.
- Use default parameters instead of mutating arguments.
- Avoid boolean flags that change behavior (`doThing(data, true)`). Split into separate functions or use an options object.
- Prefer early returns over deep nesting.
- Never use `any`. Use `unknown` and narrow the type with type guards.

### Types & Validation

- Validate all external inputs at the boundary (API responses, form inputs, URL parameters). Use Zod or Yup schemas.
- Exported functions must have explicit return types. Do not rely on inference for public contracts.
- Avoid type assertions (`as`) — use type guards and proper narrowing instead.
- Discriminated unions are preferred over optional fields for modeling state (`{ status: "idle" } | { status: "loading" } | { status: "error", error: Error }`).

---

## Project Structure

- One module per file. A module exports one primary concern.
- **Barrel files (`index.ts`)** should re-export only the public API of a directory. They must not contain implementation.
- Shared types live in a `types/` or `contracts/` directory, co-located with the code that owns them, not in a global `types.ts` file.
- Test files live next to the code they test, not in a separate `__tests__/` directory (unless the framework requires it).
- Configuration lives in dedicated config files at the appropriate level — environment variables, feature flags, and constants are never hardcoded in business logic.

### Directory Convention

```
src/
├── agents/            # Agent implementations (see DESIGN.md)
│   ├── task/
│   │   ├── index.ts
│   │   ├── task.agent.ts
│   │   ├── task.contracts.ts
│   │   ├── task.validation.ts
│   │   └── task.test.ts
│   └── ...
├── components/        # Shared UI components
│   └── task-row/
│       ├── index.ts
│       ├── task-row.tsx
│       ├── task-row.test.tsx
│       └── task-row.module.css
├── hooks/             # Shared React hooks
├── utils/             # Pure utility functions (no side effects)
└── pages/             # Route-level page components
```

---

## React & UI Guidelines

- **Server Components by default.** Use client components (`"use client"`) only when you need interactivity, state, or browser APIs.
- **Co-locate styles.** Use CSS Modules or a co-located CSS-in-JS approach. Avoid global stylesheets for component-level styling.
- **Data fetching in the parent.** Fetch data as high in the tree as practical and pass it down as props. Avoid cascading fetches.
- **Custom hooks** for reusable stateful logic. A hook name always starts with `use`.
- **Never mutate state directly.** Use setter functions or Immer for complex state updates.
- **Accessible by default.** Every interactive element must have a visible focus state, an accessible name (label/aria-label), and correct ARIA role. Run manual keyboard navigation tests.
- **Responsive first.** Build for mobile width first, then add breakpoints for larger screens. Use relative units (`rem`, `%`, `vw`) over fixed pixels.
- **Optimistic updates** are encouraged for mutations where the failure case is rare and recoverable. Always provide undo capability for destructive actions.

---

## Error Handling

- **Fail loudly in development.** Use assertions and explicit errors for unexpected states. Do not silently swallow exceptions.
- **Fail gracefully in production.** Catch errors at boundaries (API calls, event handlers, root component). Show a meaningful message to the user, log details for developers.
- **Typed errors.** Use discriminated union return types (`Result<T, E>`) for expected failure modes. Throw only for truly exceptional situations.
- **Error boundaries** must wrap every non-trivial React subtree.
- **Network errors** must include retry logic with exponential backoff for idempotent requests.

---

## Testing

- **Unit tests** for pure logic and utilities. Fast, no dependencies, no I/O.
- **Integration tests** for agent contracts and database interactions. Test the public API, not internal implementation.
- **Component tests** for UI behavior. Test what the user sees and does, not internal state. Use Testing Library.
- **E2E tests** for critical user flows only (sign-up, create task, complete task).
- **Test naming:** `it("should <expected behavior> when <condition>", ...)`
- **Follow AAA pattern:** Arrange → Act → Assert. Separate with blank lines.
- **Mock at the boundary.** Mock external dependencies (APIs, databases), not internal modules.
- **One assertion per test** when practical. Multiple assertions are acceptable when testing a single logical outcome.

---

## Git Practices

- **Commits are atomic.** One logical change per commit. It should pass tests and be independently revertible.
- **Branch naming:** `feature/short-description`, `fix/short-description`, `chore/short-description`.
- **Commit messages:** Use imperative mood ("Add task duplication" not "Added task duplication"). The first line is a summary (72 chars max). Leave a blank line before the body.
- **No commented-out code.** Delete it. It lives in version history if needed.
- **Keep PRs small.** A PR should contain one coherent change. If you're tempted to write "and" in the PR description, split it.

---

## Performance

- **Measure before optimizing.** Use profiling tools to identify bottlenecks. Do not guess.
- **Lazy load below the fold.** Code-split at route boundaries and use `React.lazy` for heavy components.
- **Memoize only when necessary.** `React.memo`, `useMemo`, and `useCallback` should be backed by a measurable performance improvement.
- **Avoid unnecessary re-renders.** Keep state as close to where it's used as possible. Lift state only when needed.
- **Bundle awareness.** Monitor bundle size. Avoid importing large libraries for a single function.

---

## Documentation

- **README in every package/agent directory** explaining what it does and how to use it.
- **JSDoc on public APIs.** Describe what a function does, its parameters, return value, and side effects. Omit JSDoc for trivial getters/setters or when the name fully describes the behavior.
- **Inline comments explain "why", not "what".** The code itself should be readable enough to explain what it does. Comments provide context — why a non-obvious approach was chosen, why a workaround exists.
- **No stale comments.** If you change code, update its comments. A wrong comment is worse than no comment.
- **Architecture decisions** go in `DESIGN.md` or dedicated ADRs (Architecture Decision Records) in a `docs/adr/` directory.

---

## Dependencies

- **Prefer platform APIs** over third-party libraries when the platform API is sufficient (e.g., `fetch` over Axios, `URLSearchParams` over `qs`).
- **Audit before adding.** Every new dependency must be actively maintained, have a permissive license, and provide significant value over writing it inline.
- **Pin exact versions** in production dependencies. Use ranges only for dev dependencies.
- **No unused dependencies.** If you remove the last usage of a package, remove the package.

---

## Before Submitting Code

Run through this checklist before marking work as complete:

- [ ] Code compiles with zero errors and zero warnings
- [ ] Linter passes (`npm run lint`)
- [ ] Formatter applied (`npm run format`)
- [ ] All existing tests pass (`npm test`)
- [ ] New tests written for the change
- [ ] Manual testing performed (keyboard navigation, screen reader, mobile viewport)
- [ ] No hardcoded secrets, URLs, or magic values
- [ ] No leftover debug logs, `console.log`, or commented-out code
- [ ] Documentation updated (README, JSDoc, DESIGN.md if architecture changed)
- [ ] PR description explains what changed and why
