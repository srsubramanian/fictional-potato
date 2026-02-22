# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentFlow Docs — an API reference documentation site for a React + FastAPI agentic workflow builder. Built from scratch using Next.js, TypeScript, Tailwind CSS, and MDX.

## Tech Stack

- **Next.js 16** with App Router and MDX page extensions
- **React 19**, **TypeScript 5**
- **Tailwind CSS 4** (v4 syntax with `@tailwindcss/postcss`)
- **MDX 3** via `@next/mdx` for content pages

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint (next lint)
```

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout
    globals.css      # Tailwind CSS entry point
    page.mdx         # Homepage (MDX)
mdx-components.tsx   # MDX component overrides (required by Next.js)
next.config.mjs      # Next.js + MDX config
postcss.config.mjs   # PostCSS with Tailwind
tsconfig.json        # TypeScript config
```

## Key Patterns

- **MDX content pages** live under `src/app/` as App Router routes
- **`mdx-components.tsx`** at the project root registers custom MDX components
- **`@/*` path alias** maps to `src/*`
- **Tailwind CSS** imported via `@import 'tailwindcss'` in `globals.css`

## Reference Template (`tmp/protocol-ts/`)

The `tmp/` directory contains a reference template (not part of the project). It demonstrates advanced patterns: FlexSearch, Shiki highlighting, Zustand, Headless UI, Framer Motion, custom remark/rehype plugins.
