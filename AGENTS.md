# AGENTS.md

## Project Overview

Personal portfolio and blog for Saketh Thota (skth.dev). Built with Astro 5 (SSR),
React 18 (island components), Tailwind CSS 3, and shadcn/ui. Deployed on Vercel.

## Build / Dev / Test Commands

```bash
npm run dev        # Start dev server (--host, accessible on LAN)
npm run start      # Start dev server (localhost only)
npm run build      # Type-check (astro check) then production build
npm run preview    # Preview production build locally
```

**Type checking** is done via `astro check` (included in the build script). There is
no separate `tsc` command configured.

**No test framework is configured.** There are no test files, test scripts, or test
runner dependencies. There is no single-test command.

**No linter or formatter is configured.** No ESLint, Prettier, or EditorConfig files
exist. Code style is enforced by convention only.

## Architecture

- **Rendering**: Hybrid SSR. Most pages use `export const prerender = true` for static
  generation (blog, projects, resume). Homepage, tutoring, and API routes are
  server-rendered.
- **Adapter**: `@astrojs/vercel` with web analytics enabled.
- **React islands**: Interactive components use `client:load` hydration directive.
- **Content collections**: Astro Content Collections v5 with 4 collections defined in
  `src/content.config.ts`:
  - `blog` -- MDX files with glob loader
  - `projects` -- YAML files with glob loader
  - `testimonials` -- YAML files with glob loader
  - `services` -- Notion API loader (notion-astro-loader)
- **API routes**: `src/pages/api/` contains server endpoints (Spotify now-playing,
  contact form via Resend).
- **UI components**: shadcn/ui primitives in `src/components/ui/`, app-level components
  in `src/components/`.
- **Styling**: Tailwind CSS with shadcn/ui CSS variable theme system. Dark mode via
  `class` strategy on `<html>`. Theme colors defined in `src/styles/globals.css`.
- **Path alias**: `@/*` maps to `./src/*` (configured in `tsconfig.json`).
- **Markdown**: remark-math + rehype-katex for LaTeX, astro-expressive-code for syntax
  highlighting (rose-pine-moon theme).

## Environment Variables

Required secrets (defined in `.env`, never committed):

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_PRIVATE_KEY`,
  `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_AUTH_URI`,
  `FIREBASE_TOKEN_URI`, `FIREBASE_AUTH_CERT_URL`, `FIREBASE_CLIENT_CERT_URL`,
  `FIREBASE_DATABASE_URL`
- `NOTION_INTEGRATION_SECRET`, `NOTION_DATABASE_ID`
- `RESEND_API_KEY`

Type declarations for env vars are in `src/env.d.ts`.

## Code Style Guidelines

### Imports

- Use **named imports**; default imports only when the module API requires it.
- Use the `@/*` path alias for all internal imports (maps to `./src/*`).
- Use `import type` for type-only imports: `import type { APIRoute } from 'astro'`.
- Use `import * as React from "react"` (namespace import, not default import).
- Hooks are called as `React.useState`, `React.useEffect`, etc. -- never destructured.
- **Ordering**: third-party/framework imports first, then `@/` internal imports, with a
  blank line between groups.

### Naming Conventions

| Element              | Convention         | Examples                                      |
|----------------------|--------------------|-----------------------------------------------|
| Component files      | PascalCase `.tsx`  | `ContactForm.tsx`, `MobileNav.tsx`            |
| UI primitive files   | lowercase `.tsx`   | `button.tsx`, `form.tsx` (shadcn convention)  |
| Lib/utility files    | lowercase `.ts`    | `utils.ts`, `spotify.ts`                      |
| API route files      | kebab-case `.ts`   | `now-playing.ts`, `contact.ts`                |
| Astro pages          | lowercase `.astro` | `blog.astro`, `resume.astro`                  |
| Component names      | PascalCase         | `ContactForm`, `DesktopNav`                   |
| Variables/functions  | camelCase          | `formSchema`, `getActiveIndex`                |
| Constants (URLs)     | UPPER_SNAKE_CASE   | `NOW_PLAYING_ENDPOINT`, `TOKEN_ENDPOINT`      |
| Interfaces           | PascalCase         | `NavItem`, `NowPlayingProps`                  |
| Props types          | `<Component>Props` | `DesktopNavProps`, `ServiceCarouselProps`      |

### TypeScript

- **Strict mode** is enabled (extends `astro/tsconfigs/strict`).
- Prefer `interface` for object shapes and component props.
- Use `type` for aliases, unions, and derived types.
- Avoid `any` -- use proper types or `unknown` when the shape is uncertain.
- Use Zod schemas for runtime validation (`z.object`, `z.string`, etc.) with
  `z.infer<typeof schema>` to derive TypeScript types.

### Components

- **App-level components**: Use `export function ComponentName() {}` (named function
  declaration, not arrow function assigned to const).
- **shadcn/ui components**: Use `React.forwardRef` pattern with `displayName` and
  barrel exports at the bottom of the file.
- **Astro components**: Standard `.astro` single-file format with frontmatter.
- One exception: API route handlers use `export const GET/POST: APIRoute = async () => {}`.

### Error Handling

- Use `try/catch` with `console.error` for both client and server errors.
- Use Zod `safeParse` for API input validation, returning structured error responses
  with appropriate HTTP status codes (400 for validation, 500 for server errors).
- Use `throw new Error()` for invariant violations in hooks/contexts.

### Strings and Formatting

- **Double quotes** are the dominant style for strings and JSX attributes.
- **Semicolons** are used in author-written code (shadcn/ui generated code omits them).
- **Template literals** for string interpolation.
- No enforced formatter -- maintain consistency with surrounding code.

### Comments

- Keep comments **sparse and utilitarian**. No JSDoc blocks.
- Use `{/* ... */}` section markers in JSX to label distinct UI regions.
- Use `//` for brief inline intent clarifications.
- No `TODO`, `FIXME`, or `@param`/`@returns` annotations in the codebase.

### File Organization

- `src/components/` -- flat directory for app components, `ui/` subdirectory for
  shadcn/ui primitives.
- `src/pages/` -- Astro file-based routing, `api/` subdirectory for server endpoints.
- `src/layouts/` -- Astro layout templates (`BaseLayout`, `MarkdownLayout`).
- `src/lib/` -- Utility modules and service clients.
- `src/content/` -- Content collection data files (MDX, YAML).
- `src/styles/` -- Global CSS.
- **No barrel `index.ts` files.** Import each module directly by path.

## Package Manager

Use **npm** (not yarn or pnpm). Node.js >= 24.0.0 is required.
