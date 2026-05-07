<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import posthog from 'posthog-js';

	type Props = { open: boolean; pendingRedirect?: string | null };
	let { open = $bindable(false), pendingRedirect = null }: Props = $props();

	type Mode = 'signin' | 'signup';
	let mode = $state<Mode>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let submitting = $state(false);

	function reset() {
		mode = 'signin';
		email = '';
		password = '';
		name = '';
		submitting = false;
	}

	$effect(() => {
		if (!open) reset();
	});

	function getRedirectTo(): string {
		if (pendingRedirect && /^\/(?!\/)/.test(pendingRedirect)) return pendingRedirect;
		return page.url.pathname + page.url.search + page.url.hash;
	}

	type AuthError = { code?: string; message?: string; status?: number };

	function friendlySignInError(err: AuthError): string {
		switch (err.code) {
			case 'INVALID_EMAIL_OR_PASSWORD':
			case 'INVALID_CREDENTIALS':
			case 'USER_NOT_FOUND':
				return 'No account matches that email and password. Try again, or create an account.';
			case 'EMAIL_NOT_VERIFIED':
				return 'Please verify your email address before signing in.';
			case 'INVALID_EMAIL':
				return 'Please enter a valid email address.';
		}
		// Treat any other failure (including the upstream Better Auth bug that
		// surfaces "User not found" as a generic 500 / "Internal Error") as a
		// generic credentials mismatch. This avoids leaking user existence and
		// gives the user an actionable next step.
		return 'No account matches that email and password. Try again, or create an account.';
	}

	function friendlySignUpError(err: AuthError): string {
		switch (err.code) {
			case 'USER_ALREADY_EXISTS':
			case 'EMAIL_ALREADY_IN_USE':
				return 'An account with that email already exists. Try signing in instead.';
			case 'PASSWORD_TOO_SHORT':
				return 'Password must be at least 8 characters.';
			case 'INVALID_EMAIL':
				return 'Please enter a valid email address.';
			case 'WEAK_PASSWORD':
				return 'Please choose a stronger password.';
		}
		return err.message?.trim() || 'Could not create your account. Please try again.';
	}

	async function handleGoogle() {
		submitting = true;
		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: getRedirectTo()
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Could not start Google sign-in.');
			submitting = false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;

		try {
			if (mode === 'signin') {
				const { error: err } = await authClient.signIn.email({ email, password });
				if (err) {
					toast.error(friendlySignInError(err));
					return;
				}
				posthog.capture('sign_in', { method: 'email' });
				open = false;
				await invalidateAll();
				const target = getRedirectTo();
				if (target !== page.url.pathname) {
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					await goto(target, { invalidateAll: true });
				}
			} else {
				const { error: err } = await authClient.signUp.email({ email, password, name });
				if (err) {
					toast.error(friendlySignUpError(err));
					return;
				}
				posthog.capture('sign_up', { method: 'email' });
				open = false;
				await invalidateAll();
				await goto(resolve('/onboarding/handle'), { invalidateAll: true });
			}
		} catch (e) {
			// Better Auth sometimes throws on 500 instead of returning { error }.
			// Same friendly fallback as the in-band error path.
			if (mode === 'signin') {
				toast.error(friendlySignInError({ message: e instanceof Error ? e.message : undefined }));
			} else {
				toast.error(friendlySignUpError({ message: e instanceof Error ? e.message : undefined }));
			}
		} finally {
			submitting = false;
		}
	}

	function toggleMode() {
		mode = mode === 'signin' ? 'signup' : 'signin';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="!gap-0 !p-0 sm:max-w-md">
		<div class="flex flex-col gap-5 p-7">
			<Dialog.Header class="!gap-2 !text-left">
				<div class="eyebrow-sm">{mode === 'signin' ? 'Sign in' : 'Create an account'}</div>
				<Dialog.Title
					class="font-serif text-[28px] leading-[1.1] font-normal tracking-[-0.015em] text-ink"
				>
					{mode === 'signin' ? 'Welcome back' : 'Make a place for it'}
				</Dialog.Title>
				<Dialog.Description class="font-serif text-[16px] leading-[1.5] text-foreground/80 italic">
					{mode === 'signin'
						? 'Pick up where you left off.'
						: 'A small, quiet shelf for your writing.'}
				</Dialog.Description>
			</Dialog.Header>

			<Button
				variant="outline"
				type="button"
				class="w-full"
				onclick={handleGoogle}
				disabled={submitting}
			>
				Continue with Google
			</Button>

			<div class="relative flex items-center">
				<div class="flex-1 border-t border-border/60"></div>
				<span class="eyebrow-sm px-3">or</span>
				<div class="flex-1 border-t border-border/60"></div>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				{#if mode === 'signup'}
					<div class="flex flex-col gap-1.5">
						<Label for="name">Name</Label>
						<Input
							id="name"
							type="text"
							autocomplete="name"
							bind:value={name}
							required
							disabled={submitting}
						/>
					</div>
				{/if}

				<div class="flex flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						autocomplete="email"
						bind:value={email}
						required
						disabled={submitting}
					/>
				</div>

				<div class="flex flex-col gap-1.5">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
						bind:value={password}
						required
						minlength={8}
						disabled={submitting}
					/>
				</div>

				<Button type="submit" class="w-full" disabled={submitting}>
					{#if submitting}
						<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
						{mode === 'signin' ? 'Signing in…' : 'Creating account…'}
					{:else}
						{mode === 'signin' ? 'Sign in' : 'Create account'}
					{/if}
				</Button>
			</form>

			<p class="mt-1 text-center font-serif text-[15px] text-muted-foreground">
				{#if mode === 'signin'}
					New here?
					<button
						type="button"
						class="text-ink underline-offset-2 hover:underline"
						onclick={toggleMode}
						disabled={submitting}>Create an account</button
					>
				{:else}
					Already have an account?
					<button
						type="button"
						class="text-ink underline-offset-2 hover:underline"
						onclick={toggleMode}
						disabled={submitting}>Sign in</button
					>
				{/if}
			</p>
		</div>
	</Dialog.Content>
</Dialog.Root>
