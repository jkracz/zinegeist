import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	profiles: defineTable({
		userId: v.string(),
		handle: v.string(),
		bio: v.optional(v.string()),
		location: v.optional(v.string()),
		links: v.optional(v.array(v.object({ label: v.string(), url: v.string() })))
	})
		.index('by_userId', ['userId'])
		.index('by_handle', ['handle'])
});
