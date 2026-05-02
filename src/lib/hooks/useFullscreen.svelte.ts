import { browser } from '$app/environment';

export function useFullscreen(getElement: () => HTMLElement | null) {
	let isFullscreen = $state(false);

	$effect(() => {
		if (!browser) return;
		const handler = () => {
			isFullscreen = document.fullscreenElement === getElement();
		};
		document.addEventListener('fullscreenchange', handler);
		return () => {
			document.removeEventListener('fullscreenchange', handler);
			if (document.fullscreenElement === getElement()) {
				document.exitFullscreen().catch(() => {});
			}
		};
	});

	function toggle() {
		const el = getElement();
		if (!el) return;
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			el.requestFullscreen();
		}
	}

	return {
		get current() {
			return isFullscreen;
		},
		toggle
	};
}
