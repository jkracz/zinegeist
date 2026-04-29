<script lang="ts">
	type Props = {
		busy: boolean;
		statusLabel: string | null;
		fileName: string | null;
		onFile: (file: File) => void;
	};

	let { busy, statusLabel, fileName, onFile }: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let dragActive = $state(false);

	function onInputChange(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) onFile(file);
		input.value = '';
	}

	function onDrop(event: DragEvent): void {
		event.preventDefault();
		dragActive = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) onFile(file);
	}
</script>

<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
	Bring us your <em class="text-primary italic">zine</em>.
</h1>
<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
	Upload a PDF, and Zinegeist will pull the first page as the cover for this publication.
</p>

<input
	bind:this={fileInput}
	class="sr-only"
	type="file"
	accept="application/pdf,.pdf"
	onchange={onInputChange}
/>

<div
	class="flex flex-col items-center gap-3.5 rounded-xl border-[1.5px] border-dashed px-6 py-16 text-center transition-colors duration-200 {dragActive
		? 'border-ink bg-[color-mix(in_oklch,var(--accent)_45%,transparent)]'
		: 'border-border bg-[color-mix(in_oklch,var(--card)_60%,transparent)]'}"
	role="group"
	aria-busy={busy}
	ondragenter={(event) => {
		event.preventDefault();
		dragActive = true;
	}}
	ondragover={(event) => event.preventDefault()}
	ondragleave={() => (dragActive = false)}
	ondrop={onDrop}
>
	<div class="icon-pdf"></div>
	<h3 class="font-serif text-2xl font-medium">
		{fileName ?? 'Drag a PDF here'}
	</h3>
	<p class="m-0 text-sm text-muted-foreground">{statusLabel ?? 'or'}</p>
	<button
		class="zg-btn zg-btn-outline disabled:cursor-not-allowed disabled:opacity-50"
		type="button"
		disabled={busy}
		onclick={() => fileInput?.click()}
	>
		Choose a file
	</button>
	<p class="m-0 mt-3.5 text-xs text-muted-foreground">Up to 100 MB · single file · PDF only</p>
</div>

<style>
	/* Decorative PDF icon — composed from the box plus ::before (folded corner) and ::after (PDF label). */
	.icon-pdf {
		width: 64px;
		height: 80px;
		border: 1.5px solid var(--ink);
		border-radius: 4px;
		position: relative;
		background: var(--paper-warm-1);
	}
	.icon-pdf::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 18px;
		height: 18px;
		background: var(--background);
		border-left: 1.5px solid var(--ink);
		border-bottom: 1.5px solid var(--ink);
	}
	.icon-pdf::after {
		content: 'PDF';
		position: absolute;
		bottom: 14px;
		left: 0;
		right: 0;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--ink);
	}
</style>
