<script lang="ts">
	import type { Zine } from '$lib/data/zines';
	import { WRITERS } from '$lib/data/zines';
	import ZineCover from './ZineCover.svelte';

	type Props = {
		zine: Zine;
		mini?: boolean;
		href: string;
	};

	let { zine, mini = false, href }: Props = $props();
	const writer = $derived(WRITERS[zine.writer]);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="zcard flex min-w-0 cursor-pointer flex-col gap-3.5 text-inherit no-underline" {href}>
	<div class="relative">
		<div
			class="cover relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-muted shadow-page"
		>
			<ZineCover coverId={zine.coverId} {mini} />
			<div class="cover-edge"></div>
		</div>
	</div>
	<div
		class="flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
	>
		<span>{zine.issue}</span>
		<span>{zine.pages} pp</span>
	</div>
	<h3 class="font-serif text-[22px] leading-[1.15] font-medium tracking-[-0.01em]">
		{zine.title}
	</h3>
	<div class="text-[13px] text-muted-foreground italic">by {writer.name}</div>
	{#if !mini}
		<p class="desc m-0 overflow-hidden font-serif text-sm leading-[1.5] text-foreground">
			{zine.desc}
		</p>
	{/if}
</a>

<style>
	.cover {
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.zcard:hover .cover {
		transform: translateY(-4px) rotate(-0.6deg);
	}
	.desc {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
