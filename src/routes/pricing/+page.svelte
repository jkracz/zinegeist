<script lang="ts">
	import { resolve } from '$app/paths';
	import PlusCheckoutButton from '$lib/components/billing/PlusCheckoutButton.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
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

	const signInHref = `${resolve('/pricing')}?signin=1`;

	const TONES = [
		'oklch(0.6083 0.0623 44.3588)',
		'oklch(0.4063 0.0255 40.3627)',
		'oklch(0.7473 0.0387 80.5476)',
		'oklch(0.7272 0.0539 52.332)'
	];

	const freeSpines = [22, 16, 28, 14, 24];
	const plusSpines = [
		20, 14, 26, 18, 12, 28, 16, 22, 14, 24, 18, 12, 26, 16, 20, 14, 22, 18, 28, 14, 24, 16, 20, 12,
		26, 18, 22, 14, 28, 16, 20, 24, 14, 18, 22, 12, 26, 16, 20
	];
</script>

<Seo
	title="Pricing"
	description="Simple Zinegeist pricing for independent writers. Start with a free shelf, then upgrade to Plus for more room to publish serials, archives, and back catalogs."
/>

<section class="px-6 pt-20 pb-32 md:px-12 md:pt-28">
	<div class="mx-auto max-w-[1200px]">
		<div
			class="grid gap-x-16 gap-y-20 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-start"
		>
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

				<div class="mt-16 space-y-10">
					<div>
						<div class="eyebrow mb-4 flex items-baseline justify-between">
							<span>Free shelf</span>
							<span class="text-foreground/70">5 publications</span>
						</div>
						<div class="relative overflow-hidden">
							<div class="flex h-[88px] items-end gap-[3px] pl-[2px]">
								{#each freeSpines as w, i (i)}
									<span
										class="block h-[84px] flex-none rounded-t-[1px] border border-b-0 border-ink/15 shadow-[inset_1px_0_0_var(--background)]/60"
										style="width: {w}px; background: {TONES[i % 4]};"
									></span>
								{/each}
							</div>
							<div class="h-[6px] rounded-[1px] bg-ink/85 shadow-[0_2px_0_0_var(--ink)]/15"></div>
						</div>
					</div>

					<div>
						<div class="eyebrow mb-4 flex items-baseline justify-between">
							<span>Plus shelf</span>
							<span class="text-foreground/70">Up to 1,000</span>
						</div>
						<div class="relative overflow-hidden">
							<div class="flex h-[88px] items-end gap-[3px] overflow-hidden pl-[2px]">
								{#each plusSpines as w, i (i)}
									<span
										class="block h-[84px] flex-none rounded-t-[1px] border border-b-0 border-ink/15 shadow-[inset_1px_0_0_var(--background)]/60"
										style="width: {w}px; background: {TONES[i % 4]};"
									></span>
								{/each}
							</div>
							<div class="h-[6px] rounded-[1px] bg-ink/85 shadow-[0_2px_0_0_var(--ink)]/15"></div>
							<div
								class="pointer-events-none absolute top-0 right-0 bottom-[6px] w-16 bg-gradient-to-r from-transparent to-background md:w-24"
								aria-hidden="true"
							></div>
						</div>
					</div>
				</div>
			</div>

			<aside class="lg:sticky lg:top-24">
				<div class="rounded-[6px] border border-border bg-card px-7 py-7 shadow md:px-9 md:py-9">
					{#if availableIntervals.length > 1}
						<ToggleGroup.Root
							type="single"
							value={interval}
							onValueChange={(v) => {
								if (v) interval = v as Interval;
							}}
							aria-label="Billing interval"
						>
							{#each availableIntervals as opt (opt)}
								<ToggleGroup.Item value={opt}>
									{opt === 'monthly' ? 'Monthly' : 'Yearly'}
									{#if opt === 'yearly' && savingsPercent > 0}
										<span
											class="font-mono text-[9px] tracking-[0.18em] italic {interval === opt
												? 'text-paper-warm-1/80'
												: 'text-primary'}"
										>
											save {savingsPercent}%
										</span>
									{/if}
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					{/if}

					<div class="eyebrow mt-7">Zinegeist Plus</div>

					{#if selected}
						<div class="mt-3 flex items-baseline gap-2.5">
							<span
								class="font-serif text-[64px] leading-none font-normal tracking-[-0.02em] text-ink"
							>
								{perMonthDisplay}
							</span>
							<span class="eyebrow text-foreground/70">/ month</span>
						</div>
						<div class="eyebrow mt-2 text-foreground/70">
							{billingNote}
						</div>
					{:else}
						<div class="mt-4 font-serif text-[20px] text-foreground">Pricing coming soon.</div>
					{/if}

					<div class="mt-7">
						{#if !selected}
							<Button class="w-full" disabled>Unavailable</Button>
						{:else if data.isAuthenticated}
							<PlusCheckoutButton
								productIds={[selected.id]}
								label="Upgrade to Plus"
								size="lg"
								class="w-full"
								metadata={{ source: 'pricing', interval }}
							/>
						{:else}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<Button size="lg" class="w-full" href={signInHref}>Sign in to upgrade</Button>
						{/if}
					</div>

					<div class="mt-8 border-t border-border pt-6">
						<ul class="space-y-3 font-serif text-[16px] leading-[1.45] text-ink">
							<li class="flex items-baseline gap-3">
								<span class="eyebrow-sm text-foreground/60">01</span>
								<span><em class="text-primary not-italic">1,000</em> publications, up from 5.</span>
							</li>
							<li class="flex items-baseline gap-3">
								<span class="eyebrow-sm text-foreground/60">02</span>
								<span>Room for serials, archives, and long-running work.</span>
							</li>
							<li class="flex items-baseline gap-3">
								<span class="eyebrow-sm text-foreground/60">03</span>
								<span>Cancel or change plans whenever. Your shelf stays.</span>
							</li>
						</ul>
					</div>
				</div>
			</aside>
		</div>
	</div>
</section>
