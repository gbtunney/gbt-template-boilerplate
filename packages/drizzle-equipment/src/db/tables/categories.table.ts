// src/db/tables/categories.table.ts
// Table definition for `categories`.
// Anchor table — no FK dependencies, so defined before equipment.
//
// Imports baseColumns from @gbt/drizzle-blueprint (schema helper, no db dependency).

import { baseColumns } from '@gbt/drizzle-blueprint'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
    ...baseColumns,

    // Unique at DB level — service uses findOneByStrict for name lookups.
    name: text('name').notNull().unique(),

    description: text('description'),
})

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
