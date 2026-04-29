<script lang="ts">
	type Props = {
		coverPreviewUrl: string | null;
		file: File | null;
	};

	let { coverPreviewUrl, file }: Props = $props();
</script>

<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
	Cover pulled from page <em class="text-primary italic">one</em>.
</h1>
<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
	This image will represent the publication in future shelves and reading views.
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
	<div class="pt-2.5">
		<p class="eyebrow">Source PDF</p>
		<h2 class="mt-2 font-serif text-3xl font-medium">{file?.name}</h2>
		<p class="mt-3 text-sm text-muted-foreground">
			{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ''}
		</p>
	</div>
</div>
