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

<div class="px-12 pb-24">
	<div class="grid grid-cols-[180px_1fr_auto] items-end gap-9 border-b border-border pt-14 pb-9">
		<Avatar name={INES_PROFILE.name} />

		<div>
			<div class="eyebrow">Writer · {INES_PROFILE.short}</div>
			<h1 class="font-serif text-[64px] leading-none font-normal tracking-[-0.025em]">
				{INES_PROFILE.name}
			</h1>
			<div class="mt-3 font-mono text-xs tracking-[0.1em] text-muted-foreground">
				{INES_PROFILE.handle} · {INES_PROFILE.joined}
			</div>
			<p class="mt-[18px] max-w-[56ch] font-serif text-lg leading-[1.55] text-foreground">
				{INES_PROFILE.bio}
			</p>
		</div>

		<div
			class="flex flex-col items-end gap-3.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase"
		>
			<div>
				<div class="text-right font-serif text-[28px] tracking-[-0.01em] text-ink">
					{myZines.length}
				</div>
				publications
			</div>
			<div>
				<div class="text-right font-serif text-[28px] tracking-[-0.01em] text-ink">56</div>
				pages this year
			</div>
			<div>
				<div class="text-right font-serif text-[28px] tracking-[-0.01em] text-ink">2024</div>
				since
			</div>
		</div>
	</div>

	<div class="mt-6 mb-9 flex gap-6 border-b border-border">
		<button class="profile-tab active" type="button">Publications</button>
		<button class="profile-tab" type="button">Reading shelf</button>
		<button class="profile-tab" type="button">About</button>
	</div>

	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-9 gap-y-14">
		{#each myZines as zine (zine.id)}
			<ZineCard {zine} mini href={pubHref(zine.id)} />
		{/each}

		<a href={CREATE} class="text-inherit no-underline">
			<div class="flex flex-col gap-3.5">
				<div class="relative">
					<div
						class="grid aspect-[3/4] w-full place-items-center rounded-[2px] border-[1.5px] border-dashed border-border"
					>
						<div class="text-center text-muted-foreground">
							<div class="font-serif text-4xl text-ink">＋</div>
							<div class="mt-1.5 font-mono text-[11px] tracking-[0.18em] uppercase">New zine</div>
						</div>
					</div>
				</div>
				<div
					class="flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
				>
					<span>Draft</span><span>—</span>
				</div>
				<h3 class="font-serif text-lg font-medium text-muted-foreground">
					Begin a new publication
				</h3>
			</div>
		</a>
	</div>

	<div class="divider-tape"></div>

	<div class="eyebrow mb-4">From the archive</div>

	<div class="flex flex-col border-t border-border">
		{#each archive as item, i (i)}
			<div class="grid grid-cols-[auto_1fr_auto] items-center gap-7 border-b border-border py-6">
				<div class="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
					{item.num}
				</div>
				<div>
					<h3 class="font-serif text-[22px] font-normal tracking-[-0.01em] text-ink">
						{item.title}
					</h3>
					<div class="mt-1 text-sm text-muted-foreground italic">archived · printed once</div>
				</div>
				<div class="text-right font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
					{item.pp} pp · {item.date}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
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
		cursor: pointer;
	}
	.profile-tab.active {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}
</style>
