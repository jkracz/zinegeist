import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { Polar } from '@polar-sh/sdk';
import { HTTPClient } from '@polar-sh/sdk/lib/http.js';

const require = createRequire(import.meta.url);
const id = '00000000-0000-4000-8000-000000000001';

// Exercise the installed SDK, so a missing Bun patch or a dependency upgrade
// cannot silently return billing traffic to Polar's moving default version.
for (const [moduleFormat, Client] of [
	['ESM', Polar],
	['CommonJS', require('@polar-sh/sdk').Polar]
]) {
	for (const server of ['production', 'sandbox']) {
		test(`${moduleFormat}: all billing requests pin the API version in ${server}`, async () => {
			const requests = [];
			const client = new Client({
				server,
				accessToken: 'test-token',
				httpClient: new HTTPClient({
					fetcher: async (request) => {
						requests.push(request);
						// Fail without retrying; this test must never contact Polar.
						return new Response('{"detail":"Unauthorized"}', {
							status: 401,
							headers: { 'Content-Type': 'application/json' }
						});
					}
				})
			});
			const operations = [
				() => client.products.list({}),
				() => client.customers.list({ email: 'test@example.com', limit: 1 }),
				() => client.customers.create({ email: 'test@example.com' }),
				() =>
					client.checkouts.create({
						products: [id],
						customerId: id,
						embedOrigin: 'https://www.zinegeist.club',
						successUrl: 'https://www.zinegeist.club/pricing'
					}),
				() => client.customerSessions.create({ customerId: id }),
				() => client.subscriptions.update({ id, subscriptionUpdate: { productId: id } }),
				() => client.subscriptions.update({ id, subscriptionUpdate: { cancelAtPeriodEnd: true } }),
				() => client.subscriptions.update({ id, subscriptionUpdate: { revoke: true } })
			];
			for (const operation of operations) {
				await assert.rejects(operation);
			}
			assert.equal(requests.length, operations.length);
			for (const request of requests) {
				assert.equal(request.headers.get('Polar-Version'), '2026-10');
				assert.equal(request.headers.get('Authorization'), 'Bearer test-token');
				assert.equal(
					new URL(request.url).host,
					server === 'production' ? 'api.polar.sh' : 'sandbox-api.polar.sh'
				);
			}
			assert.deepEqual(await requests[3].json(), {
				allow_discount_codes: true,
				allow_trial: true,
				require_billing_address: false,
				is_business_customer: false,
				products: [id],
				customer_id: id,
				embed_origin: 'https://www.zinegeist.club',
				success_url: 'https://www.zinegeist.club/pricing'
			});
		});
	}
}
