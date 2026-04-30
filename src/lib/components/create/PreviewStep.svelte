<script lang="ts">
	import { resolve } from '$app/paths';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import TagInput from './TagInput.svelte';

	const TERMS_HREF = resolve('/terms');

	type Props = {
		coverPreviewUrl: string | null;
		title: string;
		description: string;
		tags: string[];
		rightsAccepted: boolean;
		onSubmit: () => void;
	};

	let {
		coverPreviewUrl,
		title = $bindable(''),
		description = $bindable(''),
		tags = $bindable([]),
		rightsAccepted = $bindable(false),
		onSubmit
	}: Props = $props();

	let tagInput = $state<TagInput | null>(null);

	export function flushTags(): void {
		tagInput?.flush();
	}
</script>

<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
	Polish the <em class="text-primary italic">details</em>.
</h1>
<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
	Confirm the cover and add the metadata that will accompany the publication.
</p>

<div class="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(220px,340px)_1fr]">
	<div
		class="relative aspect-[0.72] overflow-hidden rounded-lg border border-border bg-paper-warm-1 shadow-page max-md:max-w-[320px]"
	>
		{#if coverPreviewUrl}
			<img
				class="block h-full w-full object-cover"
				src={coverPreviewUrl}
				alt="Generated publication cover preview"
			/>
		{/if}
	</div>

	<form
		class="flex flex-col gap-6"
		onsubmit={(event) => {
			event.preventDefault();
			onSubmit();
		}}
	>
		<div class="flex flex-col gap-2">
			<Label for="title">Title</Label>
			<Input
				id="title"
				bind:value={title}
				maxlength={200}
				placeholder="What do we call your masterpiece?"
				required
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label for="description">Description</Label>
			<Textarea
				id="description"
				bind:value={description}
				maxlength={1200}
				rows={7}
				placeholder="A short note for readers."
				required
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label for="tags">Tags</Label>
			<TagInput bind:this={tagInput} bind:tags id="tags" />
		</div>
		<label class="mt-2 flex items-start gap-3 text-sm leading-6">
			<Checkbox bind:checked={rightsAccepted} class="mt-[5px]" />
			<span>
				I own or have permission to publish this content on Zinegeist, and I agree to the
				<a
					href={TERMS_HREF}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline-offset-2 hover:underline focus-visible:underline"
				>
					Terms of Service
				</a>.
			</span>
		</label>
	</form>
</div>
