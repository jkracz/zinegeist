import { Polar } from '@convex-dev/polar';
import { PolarCore } from '@polar-sh/sdk/core.js';
import { HTTPClient } from '@polar-sh/sdk/lib/http.js';
import { makeFunctionReference, type FunctionReference } from 'convex/server';
import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';

type CurrentUser = { _id: string; email?: string | null } | null;

const getCurrentUser = makeFunctionReference<'query', Record<string, never>, CurrentUser>(
	'auth:getCurrentUser'
) as FunctionReference<'query', 'public', Record<string, never>, CurrentUser>;

function requireProductId(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(
			`Missing required environment variable ${name}. Set it in your Convex deployment to enable Polar billing.`
		);
	}
	return value;
}

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
		plusMonthly: requireProductId('POLAR_PLUS_MONTHLY_PRODUCT_ID'),
		plusYearly: requireProductId('POLAR_PLUS_YEARLY_PRODUCT_ID')
	}
});

// Pin the client used by checkout, customer portal, and subscription actions.
// Keep this version aligned with the webhook endpoint in the Polar dashboard.
const httpClient = new HTTPClient();
httpClient.addHook('beforeRequest', (request) => {
	request.headers.set('Polar-Version', '2026-10');
});
polar.polar = new PolarCore({
	accessToken: process.env.POLAR_ORGANIZATION_TOKEN ?? '',
	server: (process.env.POLAR_SERVER as 'sandbox' | 'production') ?? 'sandbox',
	httpClient
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
