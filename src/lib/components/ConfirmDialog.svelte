<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
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
	<Dialog.Content class="max-w-[420px] !p-0" showCloseButton={false}>
		<div class="flex flex-col gap-5 p-6">
			<div class="flex flex-col gap-3">
				<div class="eyebrow-sm">Confirm</div>
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
				<Button
					variant="ghost"
					type="button"
					disabled={busy}
					onclick={() => {
						open = false;
						onCancel?.();
					}}
				>
					{cancelLabel}
				</Button>
				<Button
					variant={destructive ? 'destructive' : 'default'}
					type="button"
					disabled={busy}
					onclick={() => {
						void onConfirm();
					}}
				>
					{#if busy}
						<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
					{/if}
					<span>{confirmLabel}</span>
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
