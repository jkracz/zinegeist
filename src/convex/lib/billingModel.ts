export const FREE_PUBLICATION_LIMIT = 5;
export const PLUS_PUBLICATION_LIMIT = 1000;

export type PlusProductKey = 'plusMonthly' | 'plusYearly';
export type Plan = 'free' | 'plus';

export type BillingPlan = {
	plan: Plan;
	publicationLimit: number;
	isPlus: boolean;
	subscriptionStatus: string | null;
	productKey: PlusProductKey | null;
};
