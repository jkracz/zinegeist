<script lang="ts">
	import { resolve } from '$app/paths';
	import PlusCheckoutButton from '$lib/components/billing/PlusCheckoutButton.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Interval = 'monthly' | 'yearly';

	const monthly = $derived(data.products.plusMonthly);
	const yearly = $derived(data.products.plusYearly);

	const availableIntervals = $derived.by<Interval[]>(() => {
		const list: Interval[] = [];
		if (monthly) list.push('monthly');
		if (yearly) list.push('yearly');
		return list;
	});

	let interval = $state<Interval>('yearly');

	$effect(() => {
		if (!availableIntervals.includes(interval) && availableIntervals[0]) {
			interval = availableIntervals[0];
		}
	});

	const selected = $derived(interval === 'yearly' ? yearly : monthly);

	const monthlyAmount = $derived(monthly?.prices[0]?.priceAmount ?? 0);
	const yearlyAmount = $derived(yearly?.prices[0]?.priceAmount ?? 0);
	const currency = $derived(
		selected?.prices[0]?.priceCurrency ?? monthly?.prices[0]?.priceCurrency ?? 'usd'
	);

	const savingsPercent = $derived.by(() => {
		if (!monthlyAmount || !yearlyAmount) return 0;
		const annualAtMonthly = monthlyAmount * 12;
		const pct = ((annualAtMonthly - yearlyAmount) / annualAtMonthly) * 100;
		return Math.max(0, Math.round(pct));
	});

	function formatCents(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: amount % 100 === 0 ? 0 : 2
		}).format(amount / 100);
	}

	const perMonthDisplay = $derived.by(() => {
		if (interval === 'yearly') return yearlyAmount ? formatCents(yearlyAmount / 12) : '';
		return monthlyAmount ? formatCents(monthlyAmount) : '';
	});

	const billingNote = $derived.by(() => {
		if (interval === 'yearly' && yearlyAmount) {
			return `${formatCents(yearlyAmount)} billed yearly`;
		}
		if (interval === 'monthly' && monthlyAmount) {
			return 'Billed monthly';
		}
		return '';
	});

	const signInHref = resolve('/') + '?signin=1&redirectTo=%2Fpricing';

	// Decorative book-spine widths for the shelf comparison. Stable, hand-set.
	const freeSpines = [22, 16, 28, 14, 24];
	const plusSpines = [
		20, 14, 26, 18, 12, 28, 16, 22, 14, 24, 18, 12, 26, 16, 20, 14, 22, 18, 28, 14, 24, 16, 20, 12,
		26, 18, 22, 14, 28, 16, 20, 24, 14, 18, 22, 12, 26, 16, 20
	];
</script>

<section class="px-6 pt-20 pb-32 md:px-12 md:pt-28">
	<div class="mx-auto max-w-[1200px]">
		<div
			class="grid gap-x-16 gap-y-20 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-start"
		>
			<!-- LEFT: editorial copy + shelf visual -->
			<div>
				<div class="eyebrow mb-8">Pricing · Zinegeist Plus</div>
				<h1
					class="font-serif text-[clamp(56px,7.4vw,112px)] leading-[0.96] font-normal tracking-[-0.03em] text-ink"
				>
					Room for an
					<span class="text-primary italic">epic</span>.
				</h1>
				<p class="mt-9 max-w-[42ch] font-serif text-[22px] leading-[1.5] text-foreground">
					Five publications is enough to start. Plus is for the writers who don't stop, with room
					for serials, archives, and the back catalog you keep meaning to put up.
				</p>

				<!-- Shelf comparison -->
				<div class="mt-16 space-y-10">
					<div>
						<div class="eyebrow mb-4 flex items-baseline justify-between">
							<span>Free shelf</span>
							<span class="text-foreground/70">5 publications</span>
						</div>
						<div class="shelf">
							<div class="shelf-spines">
								{#each freeSpines as w, i (i)}
									<span class="spine" style="width: {w}px;" data-tone={i % 4}></span>
								{/each}
							</div>
							<div class="shelf-board"></div>
						</div>
					</div>

					<div>
						<div class="eyebrow mb-4 flex items-baseline justify-between">
							<span>Plus shelf</span>
							<span class="text-foreground/70">Up to 1,000</span>
						</div>
						<div class="shelf shelf-plus">
							<div class="shelf-spines">
								{#each plusSpines as w, i (i)}
									<span class="spine" style="width: {w}px;" data-tone={i % 4}></span>
								{/each}
							</div>
							<div class="shelf-board"></div>
							<div class="shelf-fade" aria-hidden="true"></div>
						</div>
					</div>
				</div>

			</div>

			<!-- RIGHT: pricing card -->
			<aside class="lg:sticky lg:top-24">
				<div class="rounded-[6px] border border-border bg-card px-7 py-7 shadow md:px-9 md:py-9">
					<!-- Toggle -->
					{#if availableIntervals.length > 1}
						<div
							class="inline-flex items-center gap-px rounded-full border border-border bg-muted p-[3px]"
							role="tablist"
							aria-label="Billing interval"
						>
							{#each availableIntervals as opt (opt)}
								<button
									type="button"
									role="tab"
									aria-selected={interval === opt}
									class="toggle-pill"
									class:is-active={interval === opt}
									onclick={() => (interval = opt)}
								>
									{opt === 'monthly' ? 'Monthly' : 'Yearly'}
									{#if opt === 'yearly' && savingsPercent > 0}
										<span class="toggle-savings">save {savingsPercent}%</span>
									{/if}
								</button>
							{/each}
						</div>
					{/if}

					<div class="eyebrow mt-7">Zinegeist Plus</div>

					{#if selected}
						<div class="mt-3 flex items-baseline gap-2.5">
							<span
								class="font-serif text-[64px] leading-none font-normal tracking-[-0.02em] text-ink"
							>
								{perMonthDisplay}
							</span>
							<span class="font-mono text-[11px] tracking-[0.18em] text-foreground/70 uppercase">
								/ month
							</span>
						</div>
						<div class="mt-2 font-mono text-[11px] tracking-[0.18em] text-foreground/70 uppercase">
							{billingNote}
						</div>
					{:else}
						<div class="mt-4 font-serif text-[20px] text-foreground">Pricing coming soon.</div>
					{/if}

					<div class="mt-7">
						{#if !selected}
							<button class="zg-btn zg-btn-primary w-full" disabled>Unavailable</button>
						{:else if data.isAuthenticated}
							<PlusCheckoutButton
								productIds={[selected.id]}
								label="Upgrade to Plus"
								class="zg-btn zg-btn-primary w-full !py-3"
								metadata={{ source: 'pricing', interval }}
							/>
						{:else}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a class="zg-btn zg-btn-primary block w-full !py-3 text-center" href={signInHref}>
								Sign in to upgrade
							</a>
						{/if}
					</div>

					<div class="mt-8 border-t border-border pt-6">
						<ul class="space-y-3 font-serif text-[16px] leading-[1.45] text-ink">
							<li class="flex items-baseline gap-3">
								<span class="font-mono text-[10px] tracking-[0.18em] text-foreground/60 uppercase"
									>01</span
								>
								<span><em class="text-primary not-italic">1,000</em> publications, up from 5.</span>
							</li>
							<li class="flex items-baseline gap-3">
								<span class="font-mono text-[10px] tracking-[0.18em] text-foreground/60 uppercase"
									>02</span
								>
								<span>Room for serials, archives, and long-running work.</span>
							</li>
							<li class="flex items-baseline gap-3">
								<span class="font-mono text-[10px] tracking-[0.18em] text-foreground/60 uppercase"
									>03</span
								>
								<span>Cancel or change plans whenever. Your shelf stays.</span>
							</li>
						</ul>
					</div>
				</div>
			</aside>
		</div>
	</div>
</section>

<style>
	/* Shelf visual: paper spines lined up on a board */
	.shelf {
		position: relative;
		overflow: hidden;
	}

	.shelf-spines {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 88px;
		padding-left: 2px;
	}

	.spine {
		display: block;
		height: 84px;
		border-radius: 1px 1px 0 0;
		border: 1px solid color-mix(in oklch, var(--ink) 14%, transparent);
		border-bottom: none;
		box-shadow: inset 1px 0 0 color-mix(in oklch, var(--background) 60%, transparent);
		flex: 0 0 auto;
	}

	.spine[data-tone='0'] {
		background: oklch(0.6083 0.0623 44.3588); /* Mocha Stamp */
	}
	.spine[data-tone='1'] {
		background: oklch(0.4063 0.0255 40.3627); /* Faded Ink */
	}
	.spine[data-tone='2'] {
		background: oklch(0.7473 0.0387 80.5476); /* Linen Sand */
	}
	.spine[data-tone='3'] {
		background: oklch(0.7272 0.0539 52.332); /* Weathered Clay */
	}

	.shelf-board {
		height: 6px;
		background: var(--ink);
		opacity: 0.82;
		box-shadow: 0 2px 0 0 color-mix(in oklch, var(--ink) 18%, transparent);
		border-radius: 1px;
	}

	.shelf-plus .shelf-spines {
		flex-wrap: nowrap;
		overflow: hidden;
	}

	.shelf-fade {
		pointer-events: none;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 6px;
		width: 96px;
		background: linear-gradient(
			to right,
			color-mix(in oklch, var(--background) 0%, transparent),
			var(--background)
		);
	}

	/* Segmented toggle */
	.toggle-pill {
		appearance: none;
		background: transparent;
		border: none;
		font-family: 'JetBrains Mono', Menlo, monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--foreground);
		padding: 7px 14px;
		border-radius: 999px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}

	.toggle-pill:hover {
		color: var(--ink);
	}

	.toggle-pill.is-active {
		background: var(--ink);
		color: var(--background);
	}

	.toggle-savings {
		font-size: 9px;
		letter-spacing: 0.2em;
		padding: 2px 6px;
		border-radius: 999px;
		background: color-mix(in oklch, var(--primary) 22%, transparent);
		color: var(--primary);
	}

	.toggle-pill.is-active .toggle-savings {
		background: color-mix(in oklch, var(--background) 22%, transparent);
		color: var(--background);
	}

	@media (max-width: 900px) {
		.shelf-fade {
			width: 64px;
		}
	}
</style>
