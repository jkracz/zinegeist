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

<header class="header">
	<div class="header-left">
		<a class="brand" href={HOME} aria-label="Zinegeist home">
			<div class="brand-mark" aria-hidden="true"></div>
			<div class="brand-name">Zinegeist</div>
		</a>
	</div>

	<nav class="header-nav" aria-label="Primary">
		<a class:active={isActive(HOME)} href={HOME}>Discover</a>
		<a class:active={page.url.pathname.startsWith('/publication')} href={READING_ROOM}>
			Reading room
		</a>
		<a class:active={isActive(PROFILE)} href={PROFILE}>My shelf</a>
	</nav>

	<div class="header-right">
		<div class="header-search" role="button" tabindex="0">
			<span class="icon" aria-hidden="true">⌕</span>
			<span>Search zines &amp; writers</span>
			<span class="kbd">⌘K</span>
		</div>
		<a class="zg-btn zg-btn-primary" href={CREATE} style="padding: 8px 16px; font-size: 13px;">
			＋ Publish
		</a>
		<button class="user-chip" type="button" aria-label="User menu">
			<div class="av">IC</div>
			<div class="uname">Inés</div>
			<div class="caret" aria-hidden="true">▾</div>
		</button>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 16px 48px;
		border-bottom: 1px solid var(--border);
		background: color-mix(in oklch, var(--background) 86%, transparent);
		backdrop-filter: blur(12px) saturate(140%);
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.brand {
		display: flex;
		align-items: baseline;
		gap: 10px;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
	}
	.brand-name {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.header-nav {
		display: flex;
		align-items: center;
		gap: 4px;
		justify-self: center;
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
	.header-right {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-self: end;
	}
	.header-search {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		border: 1px solid var(--border);
		background: var(--card);
		border-radius: 999px;
		color: var(--muted-foreground);
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.04em;
		cursor: text;
		transition: border-color 0.15s;
		min-width: 200px;
	}
	.header-search:hover {
		border-color: var(--ink);
	}
	.header-search .icon {
		font-size: 13px;
	}
	.header-search .kbd {
		margin-left: auto;
	}
	.user-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 4px 12px 4px 4px;
		border: 1px solid var(--border);
		background: var(--card);
		border-radius: 999px;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.user-chip:hover {
		border-color: var(--ink);
	}
	.user-chip .av {
		width: 28px;
		height: 28px;
		border-radius: 999px;
		background: linear-gradient(135deg, #e8d4b3, #9b7a5e);
		display: grid;
		place-items: center;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 14px;
		color: #3a2418;
	}
	.user-chip .uname {
		font-size: 13px;
		color: var(--ink);
	}
	.user-chip .caret {
		font-size: 9px;
		opacity: 0.5;
		margin-left: 2px;
	}

	@media (max-width: 900px) {
		.header {
			padding: 14px 24px;
			grid-template-columns: 1fr auto;
		}
		.header-nav {
			display: none;
		}
		.header-search {
			display: none;
		}
	}
</style>
