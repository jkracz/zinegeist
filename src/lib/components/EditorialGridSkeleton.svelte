<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { tail = 4 }: { tail?: number } = $props();
</script>

<div class="grid grid-cols-12 gap-x-6 gap-y-8">
	<div class="col-span-7 max-lg:col-span-12">
		<Skeleton class="aspect-[5/3] w-full rounded-[2px]" />
	</div>
	<div class="col-span-5 grid grid-cols-2 content-start gap-x-6 gap-y-8 max-lg:col-span-12">
		{#each Array.from({ length: 2 }), i (i)}
			<div class="flex min-w-0 flex-col gap-3.5">
				<Skeleton class="aspect-[3/4] w-full rounded-[2px]" />
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-3 w-1/2" />
			</div>
		{/each}
	</div>
</div>

<div class="mt-16 border-t border-border pt-12">
	<div class="eyebrow mb-9">More on the shelf</div>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-start gap-x-8 gap-y-14">
		{#each Array.from({ length: tail }), i (i)}
			<div class="flex min-w-0 flex-col gap-3.5">
				<Skeleton class="aspect-[3/4] w-full rounded-[2px]" />
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-3 w-1/2" />
			</div>
		{/each}
	</div>
</div>
