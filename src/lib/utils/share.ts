import { toast } from 'svelte-sonner';

export interface ShareData {
	title: string;
	url: string;
}

async function copyToClipboard(text: string) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	try {
		document.execCommand('copy');
	} finally {
		document.body.removeChild(textarea);
	}
}

export async function sharePublication(data: ShareData) {
	if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
		try {
			await navigator.share({ title: data.title, url: data.url });
			return;
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return;
		}
	}
	try {
		await copyToClipboard(data.url);
		toast.success('Link copied to clipboard');
	} catch {
		toast.error('Couldn’t copy link');
	}
}
