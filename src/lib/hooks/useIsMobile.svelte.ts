import { browser } from '$app/environment';

const MOBILE_QUERY = '(max-width: 767px)';

export function useIsMobile() {
	let isMobile = $state(false);

	$effect(() => {
		if (!browser) return;
		const mq = window.matchMedia(MOBILE_QUERY);
		isMobile = mq.matches;
		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	return {
		get current() {
			return isMobile;
		}
	};
}
