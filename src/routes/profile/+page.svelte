<script lang="ts">
	import { resolve } from '$app/paths';
	import { INES_PROFILE, ZINES } from '$lib/data/zines';
	import { Avatar, SectionBar, ZineCard } from '$lib/components/zinegeist';

	const CREATE = resolve('/create');
	const pubHref = (id: string) => resolve('/publication/[id]', { id });

	const myZines = INES_PROFILE.zines
		.map((id) => ZINES.find((z) => z.id === id))
		.filter((z): z is (typeof ZINES)[number] => Boolean(z));

	const archive = [
		{ num: '№ 03', title: 'A Letter to the Spring', date: 'Apr 2025', pp: 16 },
		{ num: '№ 02', title: 'Three Aprils', date: 'Mar 2025', pp: 24 },
		{ num: '№ 01', title: 'Notebook, Cream', date: 'Aug 2024', pp: 12 }
	];
</script>

<SectionBar crumbs={['My shelf', 'Inés Caro']}>
	{#snippet right()}
		<button class="zg-btn zg-btn-ghost" type="button">Share profile</button>
		<button class="zg-btn zg-btn-outline" type="button">Edit profile</button>
	{/snippet}
</SectionBar>

<div class="page">
	<div class="profile-header">
		<Avatar name={INES_PROFILE.name} />

		<div>
			<div class="eyebrow">Writer · {INES_PROFILE.short}</div>
			<h1 class="profile-name">{INES_PROFILE.name}</h1>
			<div class="profile-handle">{INES_PROFILE.handle} · {INES_PROFILE.joined}</div>
			<p class="profile-bio">{INES_PROFILE.bio}</p>
		</div>

		<div class="profile-stats">
			<div>
				<div class="num serif">{myZines.length}</div>
				publications
			</div>
			<div>
				<div class="num serif">56</div>
				pages this year
			</div>
			<div>
				<div class="num serif">2024</div>
				since
			</div>
		</div>
	</div>

	<div class="profile-tabs">
		<button class="profile-tab active" type="button">Publications</button>
		<button class="profile-tab" type="button">Reading shelf</button>
		<button class="profile-tab" type="button">About</button>
	</div>

	<div class="grid-shelf">
		{#each myZines as zine (zine.id)}
			<ZineCard {zine} mini href={pubHref(zine.id)} />
		{/each}

		<a href={CREATE} class="new-tile">
			<div class="zcard">
				<div class="cover-wrap">
					<div class="cover empty">
						<div class="empty-inner">
							<div class="plus">＋</div>
							<div class="mono label">New zine</div>
						</div>
					</div>
				</div>
				<div class="meta-row"><span>Draft</span><span>—</span></div>
				<h3>Begin a new publication</h3>
			</div>
		</a>
	</div>

	<div class="divider-tape"></div>

	<div class="eyebrow" style="margin-bottom: 16px;">From the archive</div>

	<div class="list-reading">
		{#each archive as item, i (i)}
			<div class="row archive-row">
				<div class="num">{item.num}</div>
				<div>
					<h3>{item.title}</h3>
					<div class="by">archived · printed once</div>
				</div>
				<div class="right">{item.pp} pp · {item.date}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.page {
		padding: 0 48px 96px;
	}

	.profile-header {
		padding: 56px 0 36px;
		display: grid;
		grid-template-columns: 180px 1fr auto;
		gap: 36px;
		align-items: end;
		border-bottom: 1px solid var(--border);
	}
	.profile-name {
		font-family: var(--font-serif);
		font-size: 64px;
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1;
	}
	.profile-handle {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--muted-foreground);
		letter-spacing: 0.1em;
		margin-top: 12px;
	}
	.profile-bio {
		font-family: var(--font-serif);
		font-size: 18px;
		line-height: 1.55;
		max-width: 56ch;
		margin-top: 18px;
		color: var(--foreground);
	}
	.profile-stats {
		display: flex;
		flex-direction: column;
		gap: 14px;
		align-items: end;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}
	.profile-stats .num {
		font-family: var(--font-serif);
		font-size: 28px;
		color: var(--ink);
		letter-spacing: -0.01em;
		text-align: right;
	}

	.profile-tabs {
		display: flex;
		gap: 24px;
		margin: 24px 0 36px;
		border-bottom: 1px solid var(--border);
	}
	.profile-tab {
		padding: 14px 0;
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		border-bottom: 1.5px solid transparent;
		margin-bottom: -1px;
		background: transparent;
		border-top: 0;
		border-left: 0;
		border-right: 0;
		cursor: pointer;
	}
	.profile-tab.active {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}

	.grid-shelf {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 56px 36px;
	}

	.new-tile {
		text-decoration: none;
		color: inherit;
	}
	.zcard {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.cover-wrap {
		position: relative;
	}
	.cover.empty {
		width: 100%;
		aspect-ratio: 3 / 4;
		background: transparent;
		border: 1.5px dashed var(--border);
		display: grid;
		place-items: center;
		box-shadow: none;
	}
	.empty-inner {
		text-align: center;
		color: var(--muted-foreground);
	}
	.plus {
		font-size: 36px;
		font-family: var(--font-serif);
		color: var(--ink);
	}
	.label {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin-top: 6px;
	}
	.meta-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
		letter-spacing: 0.06em;
	}
	.zcard h3 {
		font-family: var(--font-serif);
		font-size: 18px;
		font-weight: 500;
		color: var(--muted-foreground);
	}

	.list-reading {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--border);
	}
	.archive-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 28px;
		padding: 24px 0;
		border-bottom: 1px solid var(--border);
		align-items: center;
	}
	.num {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
		letter-spacing: 0.08em;
	}
	.archive-row h3 {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 400;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.by {
		font-style: italic;
		color: var(--muted-foreground);
		margin-top: 4px;
		font-size: 14px;
	}
	.right {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
		text-align: right;
		letter-spacing: 0.08em;
	}
</style>
