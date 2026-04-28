<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	type Props = { open: boolean };
	let { open = $bindable(false) }: Props = $props();

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
		const param = page.url.searchParams.get('redirectTo');
		if (param && param.startsWith('/')) return param;
		return '/';
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
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-2xl tracking-tight text-ink">
				{mode === 'signin' ? 'Sign in to Zinegeist' : 'Create an account'}
			</Dialog.Title>
			<Dialog.Description>
				{mode === 'signin' ? 'Welcome back.' : 'Stories worth keeping.'}
			</Dialog.Description>
		</Dialog.Header>

		<button
			type="button"
			class="zg-btn zg-btn-outline w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
			onclick={handleGoogle}
			disabled={submitting}
		>
			Continue with Google
		</button>

		<div class="relative my-2 flex items-center">
			<div class="flex-1 border-t border-border/60"></div>
			<span class="px-3 text-xs text-muted-foreground">or</span>
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

			<button
				type="submit"
				class="zg-btn zg-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
				disabled={submitting}
			>
				{#if submitting}
					<span class="flex items-center gap-2">
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
						></span>
						{mode === 'signin' ? 'Signing in…' : 'Creating account…'}
					</span>
				{:else}
					{mode === 'signin' ? 'Sign in' : 'Create account'}
				{/if}
			</button>
		</form>

		<p class="mt-2 text-center text-sm text-muted-foreground">
			{#if mode === 'signin'}
				Don't have an account?
				<button
					type="button"
					class="text-ink underline-offset-2 hover:underline"
					onclick={toggleMode}
					disabled={submitting}>Create one</button
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
	</Dialog.Content>
</Dialog.Root>
