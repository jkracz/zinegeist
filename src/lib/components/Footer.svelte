<script lang="ts">
	import { resolve } from '$app/paths';

	type FooterData = {
		authState?: { isAuthenticated: boolean };
		profile?: { handle: string } | null;
	};

	let { data }: { data?: FooterData } = $props();

	const HOME = resolve('/');
	const CREATE = resolve('/create');
	const ABOUT = resolve('/about');
	const TERMS = resolve('/terms');
	const CONTACT = 'support@zinegeist.club';

	const isAuthenticated = $derived(data?.authState?.isAuthenticated ?? false);
	const profileHref = $derived(
		data?.profile?.handle
			? resolve('/profile/[handle]', { handle: data.profile.handle })
			: resolve('/onboarding/handle')
	);

	const currentYear = new Date().getFullYear();
</script>

<footer class="zg-footer px-12 pt-16 pb-10 max-[900px]:px-6">
	<div class="divider-tape !my-0 !mb-14"></div>

	<div
		class="grid grid-cols-[1.6fr_1fr_1fr] gap-x-12 gap-y-12 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"
	>
		<div class="max-w-[40ch] max-[900px]:col-span-2 max-[600px]:col-span-1">
			<a
				href={HOME}
				class="mb-5 inline-flex items-center gap-2.5 text-inherit no-underline"
				aria-label="Zinegeist home"
			>
				<img
					src="/zinegeistLogo.png"
					alt=""
					class="block size-7 shrink-0 object-contain"
					width="28"
					height="28"
				/>
				<span class="font-serif text-[22px] font-medium tracking-[-0.01em] text-ink">Zinegeist</span
				>
			</a>
			<p class="font-serif text-[17px] leading-[1.55] text-foreground">
				A small press on the open web, a publishing home for
				<em class="text-primary italic">independent</em> writers.
			</p>
		</div>

		<nav aria-label="Footer navigation">
			<div class="eyebrow mb-5">Navigate</div>
			<ul class="footer-links flex flex-col gap-3">
				<li><a href={HOME}>Discover</a></li>
				<li><a href={CREATE}>Start a zine</a></li>
				<li><a href={ABOUT}>About</a></li>
				{#if isAuthenticated}
					<li><a href={profileHref}>My shelf</a></li>
				{/if}
			</ul>
		</nav>

		<div>
			<div class="eyebrow mb-5">Legal</div>
			<ul class="footer-links flex flex-col gap-3">
				<li><a href={TERMS}>Terms of Service</a></li>
			</ul>
			<div class="mt-6">
				<div class="eyebrow mb-2">Contact</div>
				<span class="font-mono text-[13px] text-foreground select-all">{CONTACT}</span>
			</div>
		</div>
	</div>

	<div
		class="mt-16 flex items-center justify-between gap-6 border-t border-border pt-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3"
	>
		<p class="eyebrow">&copy; {currentYear} Zinegeist</p>
		<p class="eyebrow !text-muted-foreground/70">Made for writers, on the open web.</p>
	</div>
</footer>

<style>
	.zg-footer {
		background: var(--background);
	}
	.footer-links a {
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--muted-foreground);
		text-decoration: none;
		transition: color 0.15s;
	}
	.footer-links a:hover,
	.footer-links a:focus-visible {
		color: var(--ink);
	}
	.footer-links a:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 3px;
		border-radius: 2px;
	}
</style>
