<script lang="ts">
	type Props = {
		tags: string[];
		id?: string;
		max?: number;
	};

	let { tags = $bindable([]), id = 'tags', max = 12 }: Props = $props();

	let entry = $state('');

	function commit(): void {
		const value = entry.trim().replace(/\s+/g, ' ');
		entry = '';
		if (!value) return;
		if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) return;
		tags = [...tags, value].slice(0, max);
	}

	function remove(target: string): void {
		tags = tags.filter((tag) => tag !== target);
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			commit();
		}
	}

	export function flush(): void {
		commit();
	}
</script>

<div
	class="flex min-h-[46px] flex-wrap items-center gap-2 rounded-lg border border-input bg-transparent px-[9px] py-[7px] focus-within:border-ring focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_25%,transparent)]"
>
	{#each tags as tag (tag)}
		<button
			class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-[color-mix(in_oklch,var(--accent)_45%,transparent)] px-2.5 py-[5px] font-mono text-[11px] leading-none text-ink"
			type="button"
			onclick={() => remove(tag)}
		>
			{tag}<span aria-hidden="true">×</span>
		</button>
	{/each}
	<input
		{id}
		class="min-w-[160px] flex-1 border-0 bg-transparent px-0.5 py-1 text-sm outline-0"
		bind:value={entry}
		type="text"
		maxlength={32}
		placeholder={tags.length ? '' : 'essay, art, poetry'}
		onblur={commit}
		onkeydown={onKeydown}
	/>
</div>
