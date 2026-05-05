import { v } from 'convex/values';
import { authComponent } from './auth';
import { polar } from './polar';
import { internalQuery, query } from './_generated/server';

export const FREE_PUBLICATION_LIMIT = 5;
export const PLUS_PUBLICATION_LIMIT = 1000;

type PlusProductKey = 'plusMonthly' | 'plusYearly';
type Plan = 'free' | 'plus';
type BillingPlan = {
	plan: Plan;
	publicationLimit: number;
	isPlus: boolean;
	subscriptionStatus: string | null;
	productKey: PlusProductKey | null;
};

const planValidator = v.object({
	plan: v.union(v.literal('free'), v.literal('plus')),
	publicationLimit: v.number(),
	isPlus: v.boolean(),
	subscriptionStatus: v.union(v.string(), v.null()),
	productKey: v.union(v.literal('plusMonthly'), v.literal('plusYearly'), v.null())
});

function getPlanFromSubscription(
	subscription: Awaited<ReturnType<typeof polar.getCurrentSubscription>>
): BillingPlan {
	const productKey =
		subscription?.productKey === 'plusMonthly' || subscription?.productKey === 'plusYearly'
			? subscription.productKey
			: null;
	const hasActivePlus =
		subscription !== null &&
		productKey !== null &&
		(subscription.status === 'active' || subscription.status === 'trialing');
	const plan: Plan = hasActivePlus ? 'plus' : 'free';

	return {
		plan,
		publicationLimit: hasActivePlus ? PLUS_PUBLICATION_LIMIT : FREE_PUBLICATION_LIMIT,
		isPlus: hasActivePlus,
		subscriptionStatus: subscription?.status ?? null,
		productKey: hasActivePlus ? productKey : null
	};
}

export const getPlanForUser = internalQuery({
	args: { userId: v.string() },
	returns: planValidator,
	handler: async (ctx, { userId }) => {
		const subscription = await polar.getCurrentSubscription(ctx, { userId });
		return getPlanFromSubscription(subscription);
	}
});

export const getMyPlan = query({
	args: {},
	returns: v.union(planValidator, v.null()),
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) return null;

		const subscription = await polar.getCurrentSubscription(ctx, { userId: authUser._id });
		return getPlanFromSubscription(subscription);
	}
});
