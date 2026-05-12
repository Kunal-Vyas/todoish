# Scaffolding Design

Project initialization, tooling configuration, and directory structure for the Todoish MVP. Every decision here becomes a convention the entire codebase inherits.

---

## Technology Choices

| Concern             | Choice                                     | Why                                                                                                      |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Framework**       | React 18                                   | Specs and AGENTS.md assume React patterns (hooks, components, JSX).                                      |
| **Build Tool**      | Vite 5                                     | Fastest dev server and HMR for React SPAs. Zero-config CSS Modules.                                      |
| **Language**        | TypeScript 5 (strict)                      | Non-negotiable per AGENTS.md. `strict: true` + `noUncheckedIndexedAccess`.                               |
| **CSS**             | CSS Modules                                | Co-located with components. Scoped by default. Per AGENTS.md conventions.                                |
| **Testing**         | Vitest + React Testing Library             | Vitest is Vite-native (same config, same transforms). RTL enforces testing behavior over implementation. |
| **Linting**         | ESLint 9 (flat config) + typescript-eslint | Catch errors and enforce rules before code review.                                                       |
| **Formatting**      | Prettier 3                                 | Single source of truth. No formatting debates.                                                           |
| **Package Manager** | npm                                        | README uses `npm`. No reason to add pnpm/yarn complexity at MVP.                                         |
| **Routing**         | None                                       | MVP is a single view (sidebar + main content). No URL routing needed. React Router added in Stage 2.     |
| **State Mgmt**      | React Context + useReducer                 | MVP state is simple enough. No external library needed.                                                  |
| **Validation**      | Zod 3                                      | Runtime validation of inputs. Referenced in AGENTS.md.                                                   |
| **UUID**            | `crypto.randomUUID()`                      | Platform API. Zero dependencies.                                                                         |

### What's NOT Included

- **No Next.js** — MVP has no server, no SSR, no API routes. Adds complexity with zero benefit until Stage 3.
- **No CSS framework** (Tailwind, etc.) — Design tokens from `theme.design.md` are the styling foundation.
- **No state library** (Redux, Zustand) — Context + useReducer is sufficient for single-user local state.
- **No router** — One page. Routing arrives in Stage 2 with Kanban and Calendar views.
- **No icon library** — Use inline SVGs for the ~8 icons needed.

---

## Directory Structure (after scaffolding)

```
todoish/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── .specs/                    # Specifications (already exists)
├── public/
│   └── favicon.svg
├── src/
│   ├── contracts/             # TypeScript types + Zod schemas
│   │   ├── index.ts
│   │   ├── task.ts
│   │   └── project.ts
│   ├── agents/                # Agent implementations (per DESIGN.md)
│   │   └── task/
│   │       ├── index.ts
│   │       ├── task.agent.ts
│   │       ├── task.contracts.ts
│   │       ├── task.validation.ts
│   │       └── task.test.ts
│   ├── components/            # Shared UI components
│   ├── hooks/                 # Shared React hooks
│   ├── utils/                 # Pure utility functions
│   ├── App.tsx
│   ├── App.module.css
│   ├── main.tsx
│   ├── test-setup.ts
│   └── vite-env.d.ts
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Tasks

### Task 0.1 — Initialize the Vite project

```bash
npm create vite@latest todoish -- --template react-ts
cd todoish
npm install
```

- [ ] `npm run dev` starts on `localhost:5173`. Vite + React welcome page visible.
- [ ] Delete boilerplate: remove `src/App.css`, clear `src/index.css`, remove `src/assets/`.
- [ ] Reset `src/App.tsx` to a single `<div>Todoish</div>`.
- [ ] Commit: `chore: scaffold vite + react-ts project`.

---

### Task 0.2 — TypeScript strict mode

Edit `tsconfig.json`. These flags go inside `compilerOptions`:

```json
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
"forceConsistentCasingInFileNames": true
```

Add to `package.json` scripts:

```json
"typecheck": "tsc --noEmit"
```

- [ ] `npm run typecheck` passes with zero errors.
- [ ] Commit: `chore: enable typescript strict mode`.

---

### Task 0.3 — ESLint flat config

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);
```

Add to `package.json` scripts:

```json
"lint": "eslint ."
```

- [ ] `npm run lint` passes with zero errors and zero warnings.
- [ ] Commit: `chore: add eslint flat config`.

---

### Task 0.4 — Prettier

```bash
npm install -D prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

Create `.prettierignore`:

```
dist
node_modules
package-lock.json
```

Add to `package.json` scripts:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] `npm run format` runs without errors.
- [ ] `npm run format:check` passes.
- [ ] Commit: `chore: add prettier`.

---

### Task 0.5 — Pre-commit hooks

```bash
npm install -D lint-staged husky
npx husky init
```

Edit `.husky/pre-commit`:

```sh
npx lint-staged
```

Add to `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

- [ ] Stage a `.ts` file with a lint error. Attempt to commit. Commit is blocked.
- [ ] Fix the error. Commit succeeds.
- [ ] Commit: `chore: add pre-commit hooks`.

---

### Task 0.6 — Vitest + React Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Edit `vite.config.ts` — add the test configuration and the `/// <reference>` line:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
```

Create `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create a smoke test `src/App.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText("Todoish")).toBeInTheDocument();
  });
});
```

- [ ] `npm test` passes (1 test).
- [ ] Commit: `chore: add vitest and react testing library`.

---

### Task 0.7 — Create directory structure

Create empty source tree:

```
src/
├── contracts/
│   └── index.ts         (empty barrel)
├── agents/
│   └── task/
│       ├── index.ts
│       ├── task.agent.ts
│       ├── task.contracts.ts
│       ├── task.validation.ts
│       └── task.test.ts
├── components/
├── hooks/
├── utils/
├── App.tsx              (already exists, says "Todoish")
├── App.module.css       (empty)
├── main.tsx             (already exists)
├── test-setup.ts        (already exists)
└── vite-env.d.ts        (already exists)
```

- [ ] Every directory and file listed above exists.
- [ ] Agent scaffold files are empty (ready to populate in Step 3).
- [ ] `npm run typecheck` still passes.
- [ ] Commit: `chore: create directory structure`.

---

### Task 0.8 — Install Zod

```bash
npm install zod
```

- [ ] `import { z } from "zod"` works in a `.ts` file. (No-op commit; Zod is used starting in Step 2.)

---

### Task 0.9 — CI pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check
      - run: npm test
```

- [ ] Push to `main`. CI workflow runs and all jobs pass green.
- [ ] Commit: `chore: add ci pipeline`.

---

### Task 0.10 — Final verification

Run every command. All must exit zero:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run dev
```

- [ ] All five commands pass.
- [ ] `npm run dev` renders "Todoish" in the browser.
- [ ] Commit any remaining changes. Push. CI is green.

---

## Acceptance Criteria (for the Scaffolding step)

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors, zero warnings
- [ ] `npm run format:check` — all files formatted
- [ ] `npm test` — 1 passing smoke test
- [ ] `npm run dev` — app starts and renders in browser
- [ ] Pre-commit hook blocks commits with lint errors
- [ ] CI pipeline is green on `main`
- [ ] Directory structure matches the spec above
- [ ] Agent scaffold files exist (empty, ready to populate)
- [ ] Zod is installed and importable
