<script lang="ts">
	import { resolve } from '$app/paths';
	import HeartIcon from '@lucide/svelte/icons/heart';

	type FooterData = {
		authState?: { isAuthenticated: boolean };
		profile?: { handle: string } | null;
	};

	let { data }: { data?: FooterData } = $props();

	const HOME = resolve('/');
	const CREATE = resolve('/create');
	const ABOUT = resolve('/about');
	const PRICING = resolve('/pricing');
	const TERMS = resolve('/terms');
	const PRIVACY = resolve('/privacy');
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
					src="/zinegeistLogo.webp"
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
				<li><a href={CREATE}>Publish</a></li>
				<li><a href={ABOUT}>About</a></li>
				<li><a href={PRICING}>Plus</a></li>
				{#if isAuthenticated}
					<li><a href={profileHref}>My shelf</a></li>
				{/if}
			</ul>
		</nav>

		<div>
			<div class="eyebrow mb-5">Legal</div>
			<ul class="footer-links flex flex-col gap-3">
				<li><a href={TERMS}>Terms of Service</a></li>
				<li><a href={PRIVACY}>Privacy Policy</a></li>
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
		<div class="flex items-center gap-5 max-[600px]:flex-wrap">
			<a
				href="https://github.com/jkracz/zinegeist"
				target="_blank"
				rel="noopener noreferrer"
				class="eyebrow inline-flex items-center gap-1.5 !text-muted-foreground/70 transition-colors hover:!text-ink"
			>
				<svg
					class="size-3.5"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					focusable="false"
				>
					<path
						d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"
					/>
				</svg>
				Open source
			</a>
			<p class="eyebrow !text-muted-foreground/70 inline-flex items-center gap-1.5">
				Made with <HeartIcon class="size-3.5 fill-primary text-primary" aria-hidden="true" /> by
				<a
					href="https://joekracz.com"
					target="_blank"
					rel="noopener noreferrer"
					class="underline-offset-2 transition-colors hover:!text-ink hover:underline"
				>
					JK Labs
				</a>
			</p>
		</div>
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
