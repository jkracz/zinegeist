<script lang="ts">
	import { findCover } from '$lib/data/zines';

	type Props = {
		coverId: string;
		mini?: boolean;
		big?: boolean;
	};

	let { coverId, mini = false, big = false }: Props = $props();

	const cover = $derived(findCover(coverId));
	const align = $derived(cover.align ?? 'left');
	const titleSize = $derived(mini ? 16 : big ? 36 : 26);
	const textShadow = $derived(cover.fg === '#3a2418' ? 'none' : '0 1px 0 rgba(0,0,0,0.04)');
</script>

<div
	class="cover-inner"
	style:background={cover.bg}
	style:color={cover.fg}
	style:align-items={align === 'center' ? 'center' : 'stretch'}
>
	<div class="cover-issue">
		<span>{cover.issue}</span>
		<span style="opacity: 0.6;">ZG</span>
	</div>

	<div
		class="cover-title"
		style:font-size="{titleSize}px"
		style:text-align={align === 'center' ? 'center' : 'left'}
		style:text-shadow={textShadow}
	>
		{cover.title}
	</div>

	<div
		class="cover-tag"
		style:text-align={align === 'center' ? 'center' : 'left'}
		style:color={cover.accent}
	>
		{cover.tag}
	</div>

	<div class="rule" style:background={cover.fg}></div>

	<div class="marque" style:color={cover.fg}>
		<span>Zinegeist</span>
		<span>·</span>
		<span>{cover.id.toUpperCase()}</span>
	</div>
</div>

<style>
	.cover-inner {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		padding: 14px 12px;
	}
	.cover-issue {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.cover-title {
		font-family: var(--font-serif);
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: auto;
		line-height: 1.05;
		white-space: pre-line;
	}
	.cover-tag {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin-top: 8px;
		opacity: 0.8;
	}
	.rule {
		position: absolute;
		left: 14px;
		right: 14px;
		top: 30px;
		height: 1px;
		opacity: 0.18;
	}
	.marque {
		position: absolute;
		bottom: 10px;
		left: 12px;
		right: 12px;
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 8px;
		opacity: 0.55;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
</style>
