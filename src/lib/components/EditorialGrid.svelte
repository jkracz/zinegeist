<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Zine } from '$lib/data/zines';
	import { WRITERS } from '$lib/data/zines';
	import ZineCard from './ZineCard.svelte';

	type Props = { zines: Zine[] };
	let { zines }: Props = $props();

	const featured = $derived(zines[0]);
	const featuredWriter = $derived(WRITERS[featured.writer]);
	const featuredHref = $derived(resolve('/publication/[id]', { id: featured.id }));
	const sideStack = $derived(zines.slice(1, 3));
	const tail = $derived(zines.slice(3));

	// Editorial pattern of column-spans for the tail row.
	const SPANS = [6, 3, 3, 4, 4, 4];

	const pubHref = (id: string) => resolve('/publication/[id]', { id });
</script>

<div class="grid auto-rows-[minmax(140px,auto)] grid-cols-12 gap-x-6 gap-y-8">
	<!-- Featured wide hero card -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class="col-span-7 block text-inherit no-underline" href={featuredHref}>
		<div class="relative aspect-[5/3] overflow-hidden rounded-[2px] shadow-page">
			<div
				class="absolute inset-0 grid grid-cols-[1fr_1.1fr] bg-[linear-gradient(110deg,#e8d4b3_0%,#c89870_55%,#8a5a3c_100%)]"
			>
				<div class="flex flex-col justify-between px-9 py-10 text-[#3a2418]">
					<div class="eyebrow !text-[#3a2418] !opacity-70">
						Featured · {featured.issue}
					</div>
					<div>
						<div class="mb-1.5 font-serif text-[20px] text-[#5a3a24] italic">
							by {featuredWriter.name}
						</div>
						<div class="font-serif text-[64px] leading-[0.95] tracking-[-0.025em] text-[#26170d]">
							On<br /><em class="italic">Slowness</em>.
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-between border-l border-[rgba(60,40,25,0.2)] px-9 py-10">
					<p class="m-0 font-serif text-[17px] leading-[1.6] text-[#3a2418]">
						“There is a particular hour in early spring when the light slows down. It does not
						soften, exactly, nor warm — it simply takes longer to cross the kitchen floor.”
					</p>
					<div class="flex items-end justify-between text-[#3a2418]">
						<span class="font-mono text-[11px] tracking-[0.12em] uppercase opacity-70">
							{featured.pages} pp · {featured.date}
						</span>
						<span class="zg-btn zg-btn-outline !border-[#3a2418] !text-[#3a2418]"> Read → </span>
					</div>
				</div>
			</div>
			<div class="cover-edge"></div>
		</div>
	</a>

	<!-- Side stack of 2 cards -->
	<div class="col-span-5 grid grid-cols-2 content-start gap-x-6 gap-y-8">
		{#each sideStack as zine (zine.id)}
			<ZineCard {zine} mini href={pubHref(zine.id)} />
		{/each}
	</div>

	<!-- Section break -->
	<div class="col-span-12 flex items-center gap-[18px] py-3">
		<div class="h-px flex-1 bg-border"></div>
		<span class="eyebrow">More from this season</span>
		<div class="h-px flex-1 bg-border"></div>
	</div>

	{#each tail as zine, i (zine.id)}
		<div class="min-w-0" style:grid-column="span {SPANS[i] ?? 4}">
			<ZineCard {zine} mini={(SPANS[i] ?? 4) < 5} href={pubHref(zine.id)} />
		</div>
	{/each}
</div>
