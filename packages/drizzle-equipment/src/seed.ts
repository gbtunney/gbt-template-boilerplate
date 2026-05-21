// src/seed.ts
// Seed script — populates dev.db with sample categories and equipment.
// Run from the package root:
//   pnpm exec tsx src/seed.ts
//
// The script is idempotent: it wipes existing rows first so you can
// run it multiple times to reset to a known state.
//
// After seeding, browse the data with:
//   pnpm exec drizzle-kit studio

import { db } from './db/db.js'
import { categories } from './db/tables/categories.table.js'
import { equipment } from './db/tables/equipment.table.js'

// ── Wipe existing data (FK-ordered: equipment first, then categories) ─────────
await db.delete(equipment)
await db.delete(categories)

// ── Seed categories ───────────────────────────────────────────────────────────
const [powerTools, handTools, safety, measurement, electrical] = await db
    .insert(categories)
    .values([
        {
            name: 'Power Tools',
            description:
                'Electric and battery-powered tools for cutting, drilling, and fastening.',
        },
        {
            name: 'Hand Tools',
            description:
                'Non-powered tools operated manually, including hammers, wrenches, and screwdrivers.',
        },
        {
            name: 'Safety Equipment',
            description:
                'Personal protective equipment and safety devices required on-site.',
        },
        {
            name: 'Measurement & Layout',
            description:
                'Instruments for measuring dimensions, levels, and marking layouts.',
        },
        {
            name: 'Electrical',
            description:
                'Electrical testing equipment, cable tools, and related accessories.',
        },
    ])
    .returning()

console.log(
    `✓ Inserted ${[powerTools, handTools, safety, measurement, electrical].length} categories`,
)

// Null-safe IDs (they are always present after INSERT … RETURNING)
const powerToolsId = powerTools!.id
const handToolsId = handTools!.id
const safetyId = safety!.id
const measurementId = measurement!.id
const electricalId = electrical!.id

// ── Seed equipment ────────────────────────────────────────────────────────────
const items = await db
    .insert(equipment)
    .values([
        // Power Tools
        {
            name: 'DeWalt 20V Cordless Drill',
            description: '1/2 in. drill/driver with 2-speed transmission.',
            categoryId: powerToolsId,
            serialNumber: 'DW-001',
            status: 'available',
            location: 'Tool Crib A',
        },
        {
            name: 'Makita Circular Saw',
            description: '7-1/4 in. circular saw, 15A motor.',
            categoryId: powerToolsId,
            serialNumber: 'MK-002',
            status: 'in_use',
            location: 'Site B - Floor 2',
        },
        {
            name: 'Bosch Reciprocating Saw',
            description: '11A corded reciprocating saw with vibration control.',
            categoryId: powerToolsId,
            serialNumber: 'BS-003',
            status: 'maintenance',
            location: 'Workshop',
        },
        {
            name: 'Milwaukee Impact Driver',
            description: '18V brushless, 1/4 in. hex chuck.',
            categoryId: powerToolsId,
            serialNumber: 'MW-004',
            status: 'available',
            location: 'Tool Crib A',
        },

        // Hand Tools
        {
            name: 'Estwing 22oz Framing Hammer',
            description: 'Forged steel hammer with leather grip.',
            categoryId: handToolsId,
            serialNumber: 'ES-010',
            status: 'available',
            location: 'Tool Crib B',
        },
        {
            name: 'Stanley 15-Piece Screwdriver Set',
            description: 'Mixed flat-head and Phillips drivers, cushion-grip.',
            categoryId: handToolsId,
            serialNumber: 'ST-011',
            status: 'in_use',
            location: 'Site A - Unit 3',
        },
        {
            name: 'Channellock Plier Set (5-piece)',
            description:
                'Includes slip-joint, needle-nose, lineman, and diagonal pliers.',
            categoryId: handToolsId,
            serialNumber: 'CL-012',
            status: 'available',
            location: 'Tool Crib B',
        },

        // Safety Equipment
        {
            name: 'MSA Safety Harness - Full Body',
            description:
                'ANSI/ASSE Z359-compliant fall protection harness, size L.',
            categoryId: safetyId,
            serialNumber: 'MSA-020',
            status: 'available',
            location: 'Safety Cage',
        },
        {
            name: 'Honeywell Hard Hat (Type II)',
            description: 'Vented hard hat, ANSI Z89.1, yellow.',
            categoryId: safetyId,
            serialNumber: 'HW-021',
            status: 'in_use',
            location: 'Site C',
        },
        {
            name: '3M Respirator Half-Face',
            description:
                'P100 particulate respirator, medium, with replaceable cartridges.',
            categoryId: safetyId,
            serialNumber: '3M-022',
            status: 'available',
            location: 'Safety Cage',
        },

        // Measurement
        {
            name: 'Leica DISTO Laser Distance Meter',
            description:
                '330 ft range, bluetooth, ±1/16 in. accuracy. Handle with care.',
            categoryId: measurementId,
            serialNumber: 'LD-030',
            status: 'available',
            location: 'Tool Crib A',
        },
        {
            name: 'Stabila Level Set (24in + 48in)',
            description: 'Aluminium box-section levels, 0.5mm/m accuracy.',
            categoryId: measurementId,
            serialNumber: 'SB-031',
            status: 'in_use',
            location: 'Site B - Floor 1',
        },

        // Electrical
        {
            name: 'Fluke 117 Multimeter',
            description:
                'True-RMS, auto-ranging, non-contact voltage detection.',
            categoryId: electricalId,
            serialNumber: 'FL-040',
            status: 'available',
            location: 'Electrical Room',
        },
        {
            name: 'Klein Cable Tracer & Toner',
            description: 'Tone generator + probe for tracing wire runs.',
            categoryId: electricalId,
            serialNumber: 'KL-041',
            status: 'maintenance',
            location: 'Electrical Room',
        },
    ])
    .returning()

console.log(`✓ Inserted ${items.length} equipment items`)

// ── Summary ───────────────────────────────────────────────────────────────────
const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    const s = item.status ?? 'unknown'
    acc[s] = (acc[s] ?? 0) + 1
    return acc
}, {})

console.log('\nStatus breakdown:')
for (const [status, count] of Object.entries(statusCounts)) {
    const emoji =
        status === 'available'
            ? '🟢'
            : status === 'in_use'
              ? '🟡'
              : status === 'maintenance'
                ? '🔴'
                : '⚪'
    console.log(`  ${emoji}  ${status}: ${count}`)
}

console.log(
    '\nDone! Run `pnpm exec drizzle-kit studio` to browse the data in your browser.',
)
