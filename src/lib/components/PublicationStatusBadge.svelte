<script lang="ts">
	type Status = 'draft' | 'published' | 'unpublished';

	type Props = {
		status: Status;
	};

	let { status }: Props = $props();

	const LABELS: Record<Status, string> = {
		draft: 'Draft',
		published: 'Published',
		unpublished: 'Unpublished'
	};
</script>

<div class="status-pill" data-status={status} aria-label="Publication status: {LABELS[status]}">
	<span class="dot" aria-hidden="true">
		<span class="dot-core"></span>
	</span>
	<span class="prefix">Status</span>
	<span class="sep" aria-hidden="true">·</span>
	<span class="label">{LABELS[status]}</span>
</div>

<style>
	.status-pill {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 5px 12px 5px 10px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--card);
		font-family: var(--font-mono);
		font-size: 10.5px;
		line-height: 1;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		box-shadow: 2px 2px 0 0 hsl(20 18% 51% / 0.12);
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.prefix {
		color: var(--muted-foreground);
		font-weight: 500;
	}

	.sep {
		color: color-mix(in oklch, var(--muted-foreground) 60%, transparent);
		margin: 0 -1px;
	}

	.label {
		color: var(--label-color, var(--ink));
		font-weight: 600;
		letter-spacing: 0.16em;
	}

	.dot {
		position: relative;
		width: 8px;
		height: 8px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.dot-core {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--dot-color, currentColor);
		position: relative;
		z-index: 1;
	}

	/* ---------- DRAFT — warm amber, in-progress ---------- */
	.status-pill[data-status='draft'] {
		--dot-color: oklch(0.66 0.13 70);
		--label-color: oklch(0.5 0.08 60);
		background: oklch(0.945 0.022 88);
		border-color: oklch(0.78 0.05 75 / 0.7);
	}

	/* ---------- PUBLISHED — leafy editorial green ---------- */
	.status-pill[data-status='published'] {
		--dot-color: oklch(0.55 0.13 145);
		--label-color: oklch(0.4 0.09 145);
		background: oklch(0.94 0.038 140);
		border-color: oklch(0.6 0.1 145 / 0.5);
	}
	.status-pill[data-status='published'] .dot-core {
		box-shadow:
			0 0 0 2px oklch(0.55 0.13 145 / 0.18),
			0 0 6px oklch(0.55 0.13 145 / 0.45);
	}

	/* ---------- UNPUBLISHED — retracted, faded ---------- */
	.status-pill[data-status='unpublished'] {
		--dot-color: oklch(0.55 0.02 50);
		--label-color: oklch(0.45 0.02 50);
		background: oklch(0.91 0.006 80);
		border-color: var(--border);
	}
</style>
