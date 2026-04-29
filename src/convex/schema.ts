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
		.index('by_handle', ['handle']),
	files: defineTable({
		uploaderId: v.string(),
		storageId: v.id('_storage'),
		name: v.string(),
		mimeType: v.string(),
		sha256: v.string(),
		size: v.number(),
		kind: v.union(v.literal('publication_pdf'), v.literal('publication_cover')),
		refCount: v.number()
	})
		.index('by_sha256', ['sha256'])
		.index('by_storageId', ['storageId'])
		.index('by_uploaderId', ['uploaderId']),
	publications: defineTable({
		authorId: v.string(),
		updatedAt: v.number(),
		pdfFileId: v.id('files'),
		coverFileId: v.id('files'),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		slug: v.optional(v.string()),
		status: v.union(v.literal('draft'), v.literal('published'), v.literal('unpublished')),
		publishedAt: v.optional(v.number()),
		rightsConfirmedAt: v.optional(v.number())
	})
		.index('by_authorId_and_status', ['authorId', 'status'])
		.index('by_slug', ['slug'])
});
