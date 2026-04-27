<script lang="ts">
	type Props = { name: string };
	let { name }: Props = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
	);
</script>

<div class="relative size-40 overflow-hidden rounded-full border border-border bg-muted shadow-md">
	<svg class="block h-full w-full" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid slice">
		<defs>
			<linearGradient id="avg" x1="0" x2="1" y1="0" y2="1">
				<stop offset="0%" stop-color="#e8d4b3" />
				<stop offset="100%" stop-color="#9b7a5e" />
			</linearGradient>
		</defs>
		<rect width="160" height="160" fill="url(#avg)" />
		<text
			x="80"
			y="98"
			text-anchor="middle"
			font-family="Fraunces, Georgia, serif"
			font-style="italic"
			font-size="64"
			fill="#3a2418"
			opacity="0.78"
		>
			{initials}
		</text>
	</svg>
</div>
