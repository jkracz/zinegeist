<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionBar from '$lib/components/SectionBar.svelte';

	const CREATE = resolve('/create');
	const CONTACT = 'support@zinegeist.club';
</script>

<svelte:head>
	<title>About · Zinegeist</title>
	<meta
		name="description"
		content="Zinegeist is a home for independent publications. A small, calm place where finished work can live, be read, and be appreciated on its own terms."
	/>
</svelte:head>

<SectionBar crumbs={['About']} />

<div class="px-6 pb-24 md:px-12">
	<div class="mx-auto max-w-[640px] pt-14 md:pt-20">
		<p class="eyebrow mb-6">About Zinegeist</p>

		<h1
			class="mb-10 font-serif font-normal text-ink"
			style="font-size: clamp(44px, 6vw, 84px); line-height: 0.98; letter-spacing: -0.025em;"
		>
			A home for <em class="text-primary italic">independent</em> publications.
		</h1>

		<p
			class="mb-12 max-w-[44ch] font-serif text-[22px] leading-[1.45] font-normal text-foreground md:text-[24px]"
		>
			It's for anyone who has something they want to put out into the world without needing a
			platform, a following, or a bigger plan behind it.
		</p>

		<div class="divider-tape !my-12"></div>

		<div class="font-serif text-[19px] leading-[1.6] text-foreground">
			<p class="mb-7">
				Most publishing tools today are built around growth. They assume you are building a brand,
				an audience, or a content engine. But not everything needs to scale. Some things just need a
				place to live.
			</p>

			<div class="my-10 flex flex-col gap-3 italic">
				<p>That thing you wrote in college and never shared.</p>
				<p>A collection of essays, photos, or ideas you have been sitting on.</p>
				<p>Something small, finished, and meaningful to you.</p>
			</div>

			<p class="mb-7 text-ink">Zinegeist is for that.</p>

			<p class="mb-7">
				You upload your work, publish it, and share it if you want. It is presented in a calm,
				book-like experience that feels closer to reading than scrolling. The focus stays on the
				work itself.
			</p>

			<p class="mb-7">
				It is still early and intentionally simple. The goal is not to do everything. It is to
				create a space where creative work can exist, be read, and be appreciated on its own terms.
			</p>

			<p>
				If you run into a bug or have an idea for where this should go, reach out at
				<a
					href="mailto:{CONTACT}"
					class="font-mono text-[15px] text-ink underline decoration-border underline-offset-4 transition-colors select-all hover:decoration-ink"
					>{CONTACT}</a
				>.
			</p>
		</div>

		<div class="mt-16">
			<a class="zg-btn zg-btn-outline !px-4 !py-2 !text-[13px]" href={CREATE}>Start a zine</a>
		</div>
	</div>
</div>
