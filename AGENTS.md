<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `src/convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

Always run lint and typecheck after making code changes, and make sure they pass.

Always use bun as the package manager.

When building UI:

- See if any on [Shadcn Svelte](https://www.shadcn-svelte.com/docs/components) fit our needs before writing your own.
- prefer tailwind over custom css classes unless there is a strong benefit to using custom css.

## Source Code Reference

Source code for dependencies is cached at `~/.opensrc/`.

Use `opensrc path` inside other commands to read source:

\`\`\`bash
rg "pattern" $(opensrc path <package>)
cat $(opensrc path <package>)/path/to/file
\`\`\`
