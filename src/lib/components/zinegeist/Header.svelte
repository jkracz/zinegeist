<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const HOME = resolve('/');
	const PROFILE = resolve('/profile');
	const CREATE = resolve('/create');
	const READING_ROOM = resolve('/publication/[id]', { id: 'z1' });

	const isActive = (href: string) => {
		if (href === HOME) return page.url.pathname === HOME;
		return page.url.pathname.startsWith(href);
	};
</script>

<header
	class="header sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-border px-12 py-4 max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-6"
>
	<div class="flex items-center gap-7">
		<a
			class="flex cursor-pointer items-center gap-2.5 text-inherit no-underline"
			href={HOME}
			aria-label="Zinegeist home"
		>
			<img
				src="/zinegeistLogo.png"
				alt="Zinegeist logo"
				class="block size-7 shrink-0 object-contain"
				width="28"
				height="28"
			/>
			<div class="font-serif text-[22px] font-medium tracking-[-0.01em] text-ink">Zinegeist</div>
		</a>
	</div>

	<nav
		class="header-nav flex items-center gap-1 justify-self-center max-[900px]:hidden"
		aria-label="Primary"
	>
		<a class:active={isActive(HOME)} href={HOME}>Discover</a>
		<a class:active={page.url.pathname.startsWith('/publication')} href={READING_ROOM}>
			Reading room
		</a>
		<a class:active={isActive(PROFILE)} href={PROFILE}>My shelf</a>
	</nav>

	<div class="flex items-center gap-2.5 justify-self-end">
		<div
			class="header-search inline-flex min-w-[200px] cursor-text items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 font-mono text-xs tracking-[0.04em] text-muted-foreground max-[900px]:hidden"
			role="button"
			tabindex="0"
		>
			<span class="text-[13px]" aria-hidden="true">⌕</span>
			<span>Search zines &amp; writers</span>
			<span class="kbd ml-auto">⌘K</span>
		</div>
		<a class="zg-btn zg-btn-primary !px-4 !py-2 !text-[13px]" href={CREATE}> ＋ Publish </a>
		<button
			class="user-chip inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1"
			type="button"
			aria-label="User menu"
		>
			<div
				class="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#e8d4b3] to-[#9b7a5e] font-serif text-sm text-[#3a2418] italic"
			>
				IC
			</div>
			<div class="text-[13px] text-ink">Inés</div>
			<div class="ml-0.5 text-[9px] opacity-50" aria-hidden="true">▾</div>
		</button>
	</div>
</header>

<style>
	.header {
		background: color-mix(in oklch, var(--background) 86%, transparent);
		backdrop-filter: blur(12px) saturate(140%);
	}
	.header-nav a {
		padding: 8px 14px;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--foreground);
		transition:
			background 0.15s,
			color 0.15s;
		cursor: pointer;
		text-decoration: none;
	}
	.header-nav a:hover {
		background: color-mix(in oklch, var(--accent) 50%, transparent);
		color: var(--ink);
	}
	.header-nav a.active {
		background: var(--ink);
		color: var(--paper-warm-1);
	}
	.header-search,
	.user-chip {
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.header-search:hover,
	.user-chip:hover {
		border-color: var(--ink);
	}
</style>
