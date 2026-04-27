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
<a class="zcard" {href}>
	<div class="cover-wrap">
		<div class="cover">
			<ZineCover coverId={zine.coverId} {mini} />
			<div class="cover-edge"></div>
		</div>
	</div>
	<div class="meta-row">
		<span>{zine.issue}</span>
		<span>{zine.pages} pp</span>
	</div>
	<h3>{zine.title}</h3>
	<div class="by">by {writer.name}</div>
	{#if !mini}
		<p class="desc">{zine.desc}</p>
	{/if}
</a>

<style>
	.zcard {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: 0;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
	}
	.cover-wrap {
		position: relative;
	}
	.cover {
		width: 100%;
		aspect-ratio: 3 / 4;
		background: var(--muted);
		border-radius: 2px;
		box-shadow: var(--shadow-page);
		overflow: hidden;
		position: relative;
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.zcard:hover .cover {
		transform: translateY(-4px) rotate(-0.6deg);
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
	h3 {
		font-family: var(--font-serif);
		font-size: 22px;
		line-height: 1.15;
		letter-spacing: -0.01em;
		font-weight: 500;
	}
	.by {
		font-size: 13px;
		color: var(--muted-foreground);
		font-style: italic;
	}
	.desc {
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.5;
		color: var(--foreground);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
