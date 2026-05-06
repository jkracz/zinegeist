import { Polar } from '@convex-dev/polar';
import { makeFunctionReference, type FunctionReference } from 'convex/server';
import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';

type CurrentUser = { _id: string; email?: string | null } | null;

const getCurrentUser = makeFunctionReference<'query', Record<string, never>, CurrentUser>(
	'auth:getCurrentUser'
) as FunctionReference<'query', 'public', Record<string, never>, CurrentUser>;

export const polar: Polar<DataModel> = new Polar<DataModel>(components.polar, {
	getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
		const user = await ctx.runQuery(getCurrentUser, {});
		if (!user) throw new Error('Not authenticated.');
		if (!user.email) throw new Error('Authenticated user is missing an email address.');

		return {
			userId: user._id,
			email: user.email
		};
	},
	products: {
		plusMonthly: process.env.POLAR_PLUS_MONTHLY_PRODUCT_ID!,
		plusYearly: process.env.POLAR_PLUS_YEARLY_PRODUCT_ID!
	}
});

export const {
	changeCurrentSubscription,
	cancelCurrentSubscription,
	getConfiguredProducts,
	listAllProducts,
	listAllSubscriptions,
	generateCheckoutLink,
	generateCustomerPortalUrl
} = polar.api();
