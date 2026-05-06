<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { count = 6 }: { count?: number } = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] items-start gap-x-8 gap-y-14">
	{#each Array.from({ length: count }), i (i)}
		<div class="flex min-w-0 flex-col gap-3.5">
			<Skeleton class="aspect-[3/4] w-full rounded-[2px]" />
			<div class="flex flex-col gap-2">
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-3 w-1/2" />
			</div>
		</div>
	{/each}
</div>
