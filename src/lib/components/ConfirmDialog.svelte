<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	type Props = {
		open: boolean;
		title: string;
		body: string;
		confirmLabel: string;
		cancelLabel?: string;
		destructive?: boolean;
		busy?: boolean;
		onConfirm: () => void | Promise<void>;
		onCancel?: () => void;
	};

	let {
		open = $bindable(false),
		title,
		body,
		confirmLabel,
		cancelLabel = 'Cancel',
		destructive = false,
		busy = false,
		onConfirm,
		onCancel
	}: Props = $props();

	function handleOpenChange(next: boolean) {
		if (!next && !busy) {
			open = false;
			onCancel?.();
		}
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content
		class="!max-w-[420px] !rounded-[2px] !border !border-border !bg-paper-warm-1 !p-0 !ring-0"
		showCloseButton={false}
	>
		<div class="flex flex-col gap-5 p-6">
			<div class="flex flex-col gap-3">
				<div class="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
					Confirm
				</div>
				<Dialog.Title
					class="font-serif text-[26px] leading-[1.1] font-normal tracking-[-0.01em] text-ink"
				>
					{title}
				</Dialog.Title>
				<Dialog.Description class="font-serif text-[15px] leading-[1.55] text-foreground">
					{body}
				</Dialog.Description>
			</div>
			<div class="flex items-center justify-end gap-2 pt-1">
				<button
					type="button"
					class="zg-btn zg-btn-ghost"
					disabled={busy}
					onclick={() => {
						open = false;
						onCancel?.();
					}}
				>
					{cancelLabel}
				</button>
				<button
					type="button"
					class="zg-btn"
					class:zg-btn-primary={!destructive}
					class:destructive
					disabled={busy}
					onclick={() => {
						void onConfirm();
					}}
				>
					{#if busy}
						<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
					{/if}
					<span>{confirmLabel}</span>
				</button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.destructive {
		background: oklch(0.42 0.13 30);
		color: var(--paper-warm-1);
		border: 1px solid oklch(0.42 0.13 30);
	}
	.destructive:hover:not(:disabled) {
		background: oklch(0.36 0.14 30);
		border-color: oklch(0.36 0.14 30);
	}
	.destructive:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.zg-btn :global(svg) {
		margin-right: 6px;
	}
</style>
