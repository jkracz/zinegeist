<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import TagInput from './TagInput.svelte';

	type Props = {
		title: string;
		description: string;
		tags: string[];
		onSubmit: () => void;
	};

	let {
		title = $bindable(''),
		description = $bindable(''),
		tags = $bindable([]),
		onSubmit
	}: Props = $props();

	let tagInput = $state<TagInput | null>(null);

	export function flushTags(): void {
		tagInput?.flush();
	}
</script>

<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
	Give the issue a <em class="text-primary italic">name</em>.
</h1>
<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
	These details become the metadata attached to the published route.
</p>

<form
	class="flex flex-col gap-6"
	onsubmit={(event) => {
		event.preventDefault();
		onSubmit();
	}}
>
	<div class="flex flex-col gap-2">
		<Label for="title">Title</Label>
		<Input id="title" bind:value={title} maxlength={140} placeholder="On Slowness" required />
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
</form>
