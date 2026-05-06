# Contributing

Thanks for your interest in Zinegeist.

## Setup

See [README.md](./README.md) for environment setup. Use [Bun](https://bun.sh/) — not npm/pnpm/yarn.

## Workflow

1. Create a branch off `main` (fork the repo first if you don't have push access).
2. Make your changes.
3. Run checks before pushing:
   ```sh
   bun run lint
   bun run typecheck
   bun run typecheck:convex
   ```
4. Open a PR against `main`. CI runs lint and typecheck on every PR.

## Conventions

- **UI**: prefer [shadcn-svelte](https://www.shadcn-svelte.com/docs/components) components before writing custom ones. Prefer Tailwind utilities over custom CSS.
- **Design**: follow the tokens and rules in [DESIGN.md](./DESIGN.md). Product principles live in [PRODUCT.md](./PRODUCT.md).
- **Convex**: read `src/convex/_generated/ai/guidelines.md` before writing backend code. Convex APIs and patterns there override common assumptions.
- **Accessibility**: target WCAG 2.1 AA (see PRODUCT.md).
- **Commits**: short, present-tense subject. Conventional-commit prefixes (`feat:`, `fix:`, `chore:`) are used in history but not strictly required.

## Reporting issues

Open a GitHub issue with steps to reproduce, expected vs. actual behavior, and environment details.

## License

By contributing, you agree your contributions are licensed under [Apache 2.0](./LICENSE).
