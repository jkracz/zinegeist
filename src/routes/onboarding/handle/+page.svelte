<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '$convex/_generated/api';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function slugify(input: string): string {
		return input
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 30);
	}

	// svelte-ignore state_referenced_locally
	const initialHandle = slugify(
		data.currentUser.name ?? data.currentUser.email?.split('@')[0] ?? ''
	);

	let handle = $state(initialHandle);
	let availability = $state<
		| { status: 'idle' }
		| { status: 'checking' }
		| { status: 'available' }
		| { status: 'taken' }
		| { status: 'invalid'; reason: string }
	>({ status: 'idle' });
	let submitting = $state(false);
	let error = $state<string | null>(null);

	const HANDLE_RE = /^[a-z0-9-]{3,30}$/;
	const client = useConvexClient();

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		const value = handle;
		if (debounceTimer) clearTimeout(debounceTimer);

		if (!value) {
			availability = { status: 'idle' };
			return;
		}

		if (!HANDLE_RE.test(value)) {
			availability = {
				status: 'invalid',
				reason: '3–30 characters, lowercase letters, numbers, or hyphens.'
			};
			return;
		}

		availability = { status: 'checking' };
		debounceTimer = setTimeout(async () => {
			try {
				const result = await client.query(api.profiles.isHandleAvailable, { handle: value });
				if (handle !== value) return;
				if (result.ok) {
					availability = { status: 'available' };
				} else if (result.reason === 'taken') {
					availability = { status: 'taken' };
				} else {
					availability = {
						status: 'invalid',
						reason: '3–30 characters, lowercase letters, numbers, or hyphens.'
					};
				}
			} catch {
				/* keep state as-is on transient errors */
			}
		}, 250);
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		error = null;

		try {
			const result = await client.mutation(api.profiles.createProfile, { handle });
			await invalidateAll();
			await goto(resolve('/profile/[handle]', { handle: result.handle }), { invalidateAll: true });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not create your profile.';
			submitting = false;
		}
	}

	const submitDisabled = $derived(
		submitting || availability.status !== 'available' || handle.length === 0
	);
</script>

<div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-16">
	<div class="eyebrow mb-2">Welcome, {data.currentUser.name ?? 'writer'}</div>
	<h1 class="font-serif text-4xl font-medium tracking-tight text-ink">Pick your handle</h1>
	<p class="mt-2 text-sm text-muted-foreground">
		This is how readers will find you on Zinegeist. You can change it later.
	</p>

	<form onsubmit={handleSubmit} class="mt-8 flex flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<Label for="handle">Handle</Label>
			<div class="flex items-center gap-1.5">
				<span class="font-mono text-sm text-muted-foreground">zinegeist.com/profile/</span>
				<Input
					id="handle"
					type="text"
					bind:value={handle}
					autocomplete="off"
					autocapitalize="none"
					spellcheck="false"
					required
					minlength={3}
					maxlength={30}
					disabled={submitting}
					class="flex-1"
				/>
			</div>
			<p class="min-h-5 text-xs">
				{#if availability.status === 'checking'}
					<span class="text-muted-foreground">Checking…</span>
				{:else if availability.status === 'available'}
					<span class="text-primary">Available.</span>
				{:else if availability.status === 'taken'}
					<span class="text-destructive">That handle is taken.</span>
				{:else if availability.status === 'invalid'}
					<span class="text-destructive">{availability.reason}</span>
				{/if}
			</p>
		</div>

		{#if error}
			<p class="text-sm text-destructive" role="alert">{error}</p>
		{/if}

		<button
			type="submit"
			class="zg-btn zg-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
			disabled={submitDisabled}
		>
			{submitting ? 'Creating…' : 'Continue'}
		</button>
	</form>
</div>
