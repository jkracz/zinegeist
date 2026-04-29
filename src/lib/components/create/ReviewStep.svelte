<script lang="ts">
	import { resolve } from '$app/paths';

	type Props = {
		coverPreviewUrl: string | null;
		title: string;
		description: string;
		tags: string[];
		rightsAccepted: boolean;
		publishedSlug: string | null;
	};

	let {
		coverPreviewUrl,
		title,
		description,
		tags,
		rightsAccepted = $bindable(false),
		publishedSlug
	}: Props = $props();
</script>

<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
	Review and <em class="text-primary italic">publish</em>.
</h1>
<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
	Confirm the publication details before making this route public.
</p>

<div class="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(220px,340px)_1fr]">
	<div
		class="relative aspect-[0.72] max-w-[260px] overflow-hidden rounded-lg border border-border bg-paper-warm-1 shadow-page max-md:max-w-[320px]"
	>
		{#if coverPreviewUrl}
			<img
				class="block h-full w-full object-cover"
				src={coverPreviewUrl}
				alt="Generated publication cover preview"
			/>
		{/if}
	</div>
	<div class="pt-2.5">
		<p class="eyebrow">Publication</p>
		<h2 class="mt-2 font-serif text-4xl font-medium">{title}</h2>
		<p class="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
		{#if tags.length}
			<div class="mt-5 flex flex-wrap gap-2">
				{#each tags as tag (tag)}
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-border bg-[color-mix(in_oklch,var(--accent)_45%,transparent)] px-2.5 py-[5px] font-mono text-[11px] leading-none text-ink"
						>{tag}</span
					>
				{/each}
			</div>
		{/if}
		<label class="mt-7 flex items-start gap-3 text-sm leading-6">
			<input
				class="mt-[5px]"
				type="checkbox"
				bind:checked={rightsAccepted}
				disabled={Boolean(publishedSlug)}
			/>
			<span>I own or have permission to publish this PDF on Zinegeist.</span>
		</label>
		{#if publishedSlug}
			<div class="mt-7 border-t border-border pt-[18px]">
				<p class="eyebrow">Public route</p>
				<a
					class="mt-2 inline-block font-mono text-[13px] text-ink underline underline-offset-4"
					href={resolve('/publication/[id]', { id: publishedSlug })}
				>
					{resolve('/publication/[id]', { id: publishedSlug })}
				</a>
			</div>
		{/if}
	</div>
</div>
