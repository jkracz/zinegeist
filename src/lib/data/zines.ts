// Mock data for the Zinegeist prototype.
// Covers are rendered procedurally to mimic auto-extracted JPEGs from PDF first pages.

export type Cover = {
	id: string;
	bg: string;
	fg: string;
	accent: string;
	issue: string;
	title: string;
	tag: string;
	align?: 'left' | 'center';
	big?: boolean;
};

export type Writer = {
	id: string;
	name: string;
	handle: string;
	short: string;
};

export type Zine = {
	id: string;
	coverId: string;
	title: string;
	writer: string;
	issue: string;
	date: string;
	pages: number;
	desc: string;
	tags: string[];
	feature?: boolean;
};

export const COVERS: Cover[] = [
	{
		id: 'c1',
		bg: 'linear-gradient(160deg, #e8d4b3 0%, #c89870 55%, #8a5a3c 100%)',
		fg: '#3a2418',
		accent: '#fff5e2',
		issue: 'Issue 04',
		title: 'On Slowness',
		tag: 'Essays · Spring'
	},
	{
		id: 'c2',
		bg: 'linear-gradient(180deg, #2b2018 0%, #4a3625 100%)',
		fg: '#f0e4cf',
		accent: '#d4a878',
		issue: 'Vol. II',
		title: 'Letters from the\nKitchen Window',
		tag: 'Memoir',
		align: 'center'
	},
	{
		id: 'c3',
		bg: 'radial-gradient(ellipse at 30% 20%, #e8c98a 0%, #c08658 60%, #6a3d24 100%)',
		fg: '#26170d',
		accent: '#1a0e07',
		issue: 'No. 12',
		title: 'Tideline',
		tag: 'Field notes'
	},
	{
		id: 'c4',
		bg: 'linear-gradient(135deg, #f5ead4 0%, #e8d4b3 100%)',
		fg: '#3a2418',
		accent: '#9b5a3c',
		issue: 'Quarterly',
		title: 'Rooms\nwithout\nWindows',
		tag: 'Fiction · Folio',
		big: true
	},
	{
		id: 'c5',
		bg: 'linear-gradient(180deg, #c2845a 0%, #7a4a30 100%)',
		fg: '#f5e8d2',
		accent: '#26170d',
		issue: 'Field 03',
		title: 'A Year of Walking',
		tag: 'Diary'
	},
	{
		id: 'c6',
		bg: 'linear-gradient(170deg, #f0dcb4 0%, #b88858 50%, #5e3a26 100%)',
		fg: '#2a1a10',
		accent: '#fff',
		issue: 'Issue 09',
		title: 'The Quiet\nCorrespondents',
		tag: 'Anthology'
	},
	{
		id: 'c7',
		bg: 'linear-gradient(180deg, #efe4cf 0%, #c8a97c 100%)',
		fg: '#3a2418',
		accent: '#9b5a3c',
		issue: 'One-shot',
		title: 'Soft\nWeather',
		tag: 'Poems',
		big: true
	},
	{
		id: 'c8',
		bg: 'linear-gradient(135deg, #3a2a1d 0%, #6b4a30 60%, #c08658 100%)',
		fg: '#f0e4cf',
		accent: '#e8c98a',
		issue: 'Pamphlet',
		title: 'Notes on\nMargin & Air',
		tag: 'Craft'
	}
];

export const WRITERS: Record<string, Writer> = {
	ines: { id: 'ines', name: 'Inés Caro', handle: '@inescaro', short: 'Buenos Aires · Lisbon' },
	jonah: { id: 'jonah', name: 'Jonah Welk', handle: '@jonahwelk', short: 'Walks at dusk' },
	mae: { id: 'mae', name: 'Mae Tashiro', handle: '@maetashiro', short: 'Kitchen-table essays' },
	rivers: { id: 'rivers', name: 'Rivers Adeyemi', handle: '@rivers', short: 'Letters and lists' },
	pol: { id: 'pol', name: 'Pol Halvorsen', handle: '@polh', short: 'Cartographer of small rooms' },
	sena: { id: 'sena', name: 'Sena Park', handle: '@senapark', short: 'Translates & tides' }
};

export const ZINES: Zine[] = [
	{
		id: 'z1',
		coverId: 'c1',
		title: 'On Slowness',
		writer: 'ines',
		issue: 'Issue 04',
		date: 'Apr 2026',
		pages: 36,
		desc: "An afternoon's worth of small refusals — to hurry, to perform, to flatten the hours into a single useful shape. Six essays for the slow reader.",
		tags: ['essay', 'spring', 'quiet'],
		feature: true
	},
	{
		id: 'z2',
		coverId: 'c2',
		title: 'Letters from the Kitchen Window',
		writer: 'mae',
		issue: 'Vol. II',
		date: 'Apr 2026',
		pages: 48,
		desc: "Mae's correspondence with weather, recipes, and the neighbors she has never met but greets through the glass each morning.",
		tags: ['memoir', 'letters']
	},
	{
		id: 'z3',
		coverId: 'c3',
		title: 'Tideline',
		writer: 'sena',
		issue: 'No. 12',
		date: 'Mar 2026',
		pages: 24,
		desc: 'Field notes from a season of walking the same coast at sunrise. Tides logged, gulls counted, small mercies underlined.',
		tags: ['field notes', 'translation']
	},
	{
		id: 'z4',
		coverId: 'c4',
		title: 'Rooms without Windows',
		writer: 'pol',
		issue: 'Quarterly',
		date: 'Mar 2026',
		pages: 64,
		desc: "Three short stories about interiors. A linen closet that hums. A pantry that keeps a name. A garage with a door that won't quite close.",
		tags: ['fiction', 'folio']
	},
	{
		id: 'z5',
		coverId: 'c5',
		title: 'A Year of Walking',
		writer: 'jonah',
		issue: 'Field 03',
		date: 'Feb 2026',
		pages: 88,
		desc: 'Twelve months on foot, mostly in the borough Jonah grew up in. Maps drawn in pencil, doors counted, dogs befriended.',
		tags: ['diary', 'place']
	},
	{
		id: 'z6',
		coverId: 'c6',
		title: 'The Quiet Correspondents',
		writer: 'rivers',
		issue: 'Issue 09',
		date: 'Feb 2026',
		pages: 52,
		desc: 'Fifteen writers were asked to send a single letter to a person who would never read it. This is what arrived.',
		tags: ['anthology', 'letters']
	},
	{
		id: 'z7',
		coverId: 'c7',
		title: 'Soft Weather',
		writer: 'ines',
		issue: 'One-shot',
		date: 'Jan 2026',
		pages: 20,
		desc: 'Twelve poems about the kind of light that asks nothing of you, and the rooms that hold it without comment.',
		tags: ['poetry']
	},
	{
		id: 'z8',
		coverId: 'c8',
		title: 'Notes on Margin & Air',
		writer: 'pol',
		issue: 'Pamphlet',
		date: 'Jan 2026',
		pages: 28,
		desc: 'A short, opinionated pamphlet on the white space around a paragraph and the breath it asks the reader to take.',
		tags: ['craft', 'design']
	}
];

export const INES_PROFILE = {
	...WRITERS.ines,
	bio: 'Writes essays from a kitchen table that has known three apartments and four cities. Believes a paragraph should be willing to wait for you.',
	joined: 'Reading and writing here since Aug 2024',
	links: ['inescaro.notes', 'Instagram /inesletters'],
	zines: ['z1', 'z7']
};

export const findCover = (id: string): Cover => COVERS.find((c) => c.id === id) ?? COVERS[0];
