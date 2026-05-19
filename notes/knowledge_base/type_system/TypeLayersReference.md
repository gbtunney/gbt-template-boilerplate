# Type Layers Reference

_Mapping data across meaning, structure, and interface._

> This document was written with AI assistance. The ideas, use cases, and organizational structure
> are mine; the AI helped me find the words.

---

## Why this exists

When I’m deciding how to store a phone number, what TypeScript type to assign it, and what form
element to render — those are actually three separate questions. For a long time I kept conflating
them and couldn’t figure out why my data models felt messy or why picking a form widget felt harder
than it should.

The answer is that there are three distinct layers, and each one has its own vocabulary. Once I
named them separately, a lot of things stopped being confusing.

This isn’t a TypeScript-specific idea. The same layers show up in Python, JSON Schema, Home
Assistant YAML — anywhere you’re modeling data. The original problem that forced me to write this
down was mapping CLI prompt fields (Inquirer/Yargs) to Zod schema types, and from there to form
elements. The three-layer framing is what made that mapping tractable.

---

## Table of Contents

- [The Three Layers](#the-three-layers)
  - [Conceptual Type (Meaning)](#conceptual-type-meaning)
  - [Technical Type (Structure)](#technical-type-structure)
  - [User Interface Type (Interactive)](#user-interface-type-interactive)
- [How they connect: a worked example](#how-they-connect-a-worked-example)
  - [Zod: where the layers intersect](#zod-where-the-layers-intersect)
  - [CLI → Zod → UI: the mapping pipeline](#cli--zod--ui-the-mapping-pipeline)
  - [Zod → UI reverse lookup](#zod--ui-reverse-lookup)
- [Quick Reference Table](#quick-reference-table)
- [Technical Type Vocabulary](#technical-type-vocabulary)
  - [Scalar](#scalar-one-value-no-structure)
  - [Enum](#enum-scalar-with-a-fixed-allowed-set)
  - [Object](#object-fixed-structure-known-fields)
  - [List](#list-ordered-collection-of-items)
  - [Map / Dictionary](#map--dictionary-key--value-lookup-variable-keys)
  - [Object vs Map: Rule of Thumb](#object-vs-map-rule-of-thumb)
- [Conceptual Types Deep Dive](#conceptual-types-deep-dive)
  - [Status vs Mode vs Flag](#status-vs-mode-vs-flag)
  - [Time-Related](#time-related)
- [Bridging Conceptual and Technical: Branded Types](#bridging-conceptual-and-technical-branded-types)
- [Appendix](#appendix)
  - [Presence, Optionality, and Nullability](#presence-optionality-and-nullability)
  - [Type Constraints Reference](#type-constraints-reference)
- [A Note on Portability](#a-note-on-portability)

---

## The Three Layers

Three questions. Each one is independent of the others.

| Layer          | Question                                 |
| -------------- | ---------------------------------------- |
| **Conceptual** | _What kind of thing is this?_            |
| **Technical**  | _What shape is this data?_               |
| **UI**         | _How should someone input or read this?_ |

The same conceptual type can have multiple valid technical representations. The same technical type
can map to multiple UI widgets. They don’t have a fixed 1:1:1 relationship. Keeping them separate is
what makes schemas flexible and refactorable.

---

### Conceptual Type (Meaning)

> **_“What kind of thing is this?”_**

The conceptual layer describes **what a value means in the real world**, independent of how it’s
stored or displayed. These types are stable across systems — a phone number is a phone number
whether you’re storing it in Postgres, validating it with Zod, or rendering it in a React form.

**Examples:**

- **Date** — a calendar day
- **DateTime** — a specific point in time
- **Duration** — a length of time
- **Identifier** — a stable ID for a thing
- **Flag** — a true/false indicator
- **Reference** — points to another entity
- **Measurement** — a value with a unit
- **Money** — an amount with a currency
- **File** — a file object or reference
- **Enum** — a closed set of predefined values

---

### Technical Type (Structure)

> **_“What shape is this data?”_**

The technical layer describes the structural form used to store or transmit a value. This is where
TypeScript types, Zod schemas, and JSON Schema definitions live. It cares about shape and format,
not meaning.

**Primitive families:**

- **Text** — a string of characters
- **Number** — integer or float
- **Boolean** — true/false
- **Binary** — bytes or blobs
- **Null** — an absence marker, usually paired with another type (`T | null`)

**Structural containers:**

- **Scalar** — a single value (`string`, `number`, `boolean`)
- **Enum** — a scalar constrained to a fixed set of values (`'a' | 'b' | 'c'`)
- **Object / Record** — a fixed structure with named fields (`{ id: string, name: string }`)
- **List / Sequence** — an ordered collection (`T[]`)
- **Tuple** — fixed-length, typed by position (`[string, number]`)
- **Map / Dictionary** — variable keys, uniform value type (`Record<string, T>`)

**TypeScript quick reference:**

- `boolean` — true/false
- `{ field: T }` — object with named fields
- `T[]` / `Array<T>` — ordered list
- `Record<string, T>` — map (keys are data, not schema)
- `[T1, T2]` — tuple, fixed length

---

### User Interface Type (Interactive)

> **_“How should someone input or read this?”_**

The UI layer describes how a value is **presented to a human** — what interaction it affords. A
slider implies a range. A toggle implies binary. A combobox implies search + selection.

**Examples by category:**

- **Text** — text input (single-line), textarea (multi-line), richtext, code editor
- **Choice** — select, multi-select, radio-group, checkbox-group, combobox
- **Boolean** — switch, checkbox
- **Number** — number-input, stepper, slider
- **Time** — date-picker, time-picker, datetime-picker, duration-input
- **Files** — file-upload, image-upload
- **Collections** — repeater, table-editor, key-value-editor
- **Display only** — read-only text, badge, json-viewer

---

## How they connect: a worked example

### Example: a phone number field

| Layer      | Value                     |
| ---------- | ------------------------- |
| Conceptual | `Phone` — a phone number  |
| Technical  | `string` — stored as text |
| UI         | text input (`type="tel"`) |

Changing the UI from a plain input to a masked input doesn’t change the technical or conceptual
type. Changing the storage from a plain string to a validated/normalized string doesn’t change what
it _means_ or how it’s rendered. The layers are independent — that’s the point.

---

### Zod: where the layers intersect

Zod is a useful example because it deliberately spans multiple layers.

```ts
import { z } from 'zod'

const PhoneSchema = z
  .string()
  .min(7)
  .max(15)
  .regex(/^\+?[\d\s\-()]+$/)

type Phone = z.infer<typeof PhoneSchema>
//   ^ string — this is the Technical type
```

| Zod feature                   | Layer                                                               |
| ----------------------------- | ------------------------------------------------------------------- |
| `z.string()`                  | Technical — declares the structural shape                           |
| `.min(7).max(15).regex(...)`  | Conceptual — encodes domain rules about what a phone number _means_ |
| `z.infer<typeof PhoneSchema>` | Technical — extracts the TypeScript type                            |
| `PhoneSchema.parse(input)`    | The Technical type realized at runtime                              |

`z.infer<>` collapses the conceptual → technical mapping into a single declaration. The schema _is_
the type. This is why Zod schemas can serve as a source of truth that spans both layers — which is
most of why Zod feels cleaner than writing types and validators separately.

---

### CLI → Zod → UI: the mapping pipeline

Given a CLI prompt field (Inquirer/Yargs), a Zod schema, and a UI form — the three-layer model gives
a decision procedure:

1. **Identify the conceptual type** — what does this field actually mean? (Is it a Status? A Date? A
   Reference?)
2. **Check the technical type** — what Zod type is it? (`z.string()`, `z.enum()`, `z.number()`)
3. **Select the UI widget** — given the conceptual + technical combination, what widget is
   appropriate?

The [Quick Reference Table](#quick-reference-table) encodes this mapping for common cases. The
reverse lookup below approaches it from the Zod side.

---

### Zod → UI reverse lookup

Starting from a Zod type and working toward a widget.

| Zod Type                           | Likely Conceptual Type                     | Suggested UI Widget                    |
| ---------------------------------- | ------------------------------------------ | -------------------------------------- |
| `z.string()`                       | Name, Description, Code, URL, Email, Phone | text, textarea, code                   |
| `z.string().email()`               | Email                                      | text (`type="email"`)                  |
| `z.string().url()`                 | URL                                        | text (`type="url"`)                    |
| `z.string().date()`                | Date                                       | date-picker                            |
| `z.string().datetime()`            | DateTime                                   | datetime-picker                        |
| `z.string().regex(...)`            | Phone, Code/Slug                           | text                                   |
| `z.number()`                       | Count, Percentage, Rating                  | number-input, slider, stepper          |
| `z.boolean()`                      | Flag                                       | switch, checkbox                       |
| `z.enum([...])`                    | Status, Mode, Enum                         | select, radio-group, segmented-control |
| `z.array(z.enum([...]))`           | Multi-Select Enum, Tag                     | multi-select, checkbox-group           |
| `z.array(z.string())`              | Tags                                       | tag-input                              |
| `z.object({ id, label })`          | Reference                                  | combobox, entity-picker                |
| `z.object({ amount, currency })`   | Money                                      | number-input + currency select         |
| `z.object({ value, unit })`        | Measurement, Duration                      | number-input + unit select             |
| `z.record(z.string(), z.string())` | Labels / Metadata                          | key-value-editor                       |
| `z.array(z.object(...))`           | Collection / Event log                     | repeater, table-editor                 |
| `z.discriminatedUnion(...)`        | Mode-based variant                         | segmented-control + conditional fields |

> These are starting points. A `z.string()` might be a `textarea` if the field is long-form, or a
> `code` editor if it’s structured. Context matters.

---

## Quick Reference Table

> _Not exhaustive. Implementations vary by platform, framework, and requirements._

| Conceptual Type     | Meaning                               | Common Raw Types                                 | Typical UI Widget            | Multi-Value? |
| ------------------- | ------------------------------------- | ------------------------------------------------ | ---------------------------- | ------------ |
| Identifier          | Stable ID for a thing                 | `string`, `number`                               | text, read-only-text         | Single       |
| Reference           | Points to another entity              | `string`, `{ id: string, label: string }`        | entity-picker, combobox      | Single       |
| Name                | Human-facing title                    | `string`                                         | text                         | Single       |
| Description / Notes | Longer free text                      | `string`                                         | textarea, richtext           | Single       |
| Code / Slug         | Constrained token                     | `string`                                         | text, code                   | Single       |
| URL                 | Web/resource locator                  | `string`                                         | text                         | Single       |
| Email               | Email address                         | `string`                                         | text                         | Single       |
| Phone               | Phone number                          | `string`                                         | text (`type="tel"`)          | Single       |
| Flag                | Binary on/off                         | `boolean`                                        | switch, checkbox             | Single       |
| Status              | Current state from a fixed set        | `Enum<string>`                                   | select, radio-group          | Single       |
| Mode                | Behavior selector                     | `Enum<string>`                                   | segmented-control, select    | Single       |
| Count               | Discrete quantity                     | `number`                                         | number-input, stepper        | Single       |
| Percentage          | Ratio value                           | `number`                                         | number-input, slider         | Single       |
| Rating              | Bounded score                         | `number`, `Enum<number>`                         | slider, select               | Single       |
| Money               | Amount + currency                     | `{ amount: number, currency: string }`           | number-input + select        | Single       |
| Measurement         | Value + unit                          | `{ value: number, unit: string }`                | number-input + select        | Single       |
| Date                | Calendar date                         | `string` (ISO 8601)                              | date-picker                  | Single       |
| Time                | Time of day                           | `string`                                         | time-picker                  | Single       |
| DateTime            | Timestamp                             | `string`, `number`                               | datetime-picker              | Single       |
| Duration            | Length of time                        | `number`, `string`, `{ value, unit }`            | duration-input               | Single       |
| Interval            | Start/end span                        | `{ start: string\|number, end: string\|number }` | datetime-picker (×2)         | Single       |
| Tag                 | Label for grouping                    | `string`, `string[]`                             | tag-input, multi-select      | List         |
| Labels / Metadata   | Arbitrary key-value props             | `Record<string, string>`                         | key-value-editor             | Map          |
| Event               | Record of something that happened     | `{ [key: string]: any }`                         | table-editor, repeater       | List         |
| File                | File object/ref                       | `Binary`, `{ id: string, name: string }`         | file-upload                  | Single       |
| Image               | Image file                            | same as File                                     | image-upload                 | Single       |
| Enum                | Closed set of predefined values       | `Enum<string>`, `Enum<number>`                   | select, radio-group          | Single       |
| Multi-Select Enum   | Multiple values from a predefined set | `Array<Enum<string>>`                            | multi-select, checkbox-group | List         |

---

## Technical Type Vocabulary

The structural building blocks used in the Technical layer. These terms appear across TypeScript,
JSON Schema, Zod, Python type hints, and most other typed systems.

---

### Scalar _(One Value, No Structure)_

A scalar is a single value — not nested, not iterable, not a container.

**Examples:** `string`, `number`, `boolean`, `'draft' | 'published'`, `'2023-10-01'`

> **Non-examples:** objects, lists, maps — anything with internal structure.

---

### Enum _(Scalar with a Fixed Allowed Set)_

An enum is a scalar constrained to a specific set of values.

**Examples:**

- `'draft' | 'published' | 'archived'`
- `1 | 2 | 3`
- Zod: `z.enum(['draft', 'published', 'archived'])`

---

### Object _(Fixed Structure, Known Fields)_

An object has a fixed structure with known, named fields. Each field has its own meaning.

**Examples:**

- `{ id: string; name: string }`
- Zod: `z.object({ id: z.string(), name: z.string() })`

---

### List _(Ordered Collection of Items)_

A list is an ordered collection of items of the same type.

**Examples:**

- `string[]`, `Array<string>`
- `readonly string[]`
- Tuple (fixed length): `[string, number]`
- Zod: `z.array(z.string())`

---

### Map / Dictionary _(Key → Value Lookup, Variable Keys)_

A map has variable keys that are part of the data, not the schema. All values share one type.

**Examples:**

- `Record<string, string>`
- `Record<'k1' | 'k2', number>` — constrained key set, still map-shaped
- Zod: `z.record(z.string(), z.number())`

---

### Object vs Map: Rule of Thumb

Commonly confused because both use `{}` in TypeScript.

|              | Object                            | Map                              |
| ------------ | --------------------------------- | -------------------------------- |
| Keys         | Fixed, named, part of the schema  | Variable, part of the data       |
| Values       | Each field has its own type       | All values share one type        |
| Rename a key | Changes the meaning of the schema | Doesn’t change the schema at all |

> **Rule:** If you could swap out a key name without changing what your schema _means_, it’s a Map.
> If the key name _is_ the meaning, it’s an Object.

---

## Conceptual Types Deep Dive

Some conceptual types deserve a longer treatment because they’re routinely confused with each other,
or because they have multiple valid technical representations with real tradeoffs.

---

### Status vs Mode vs Flag

These three are technically almost identical — all enums or booleans — but they mean different
things and lead to different UI choices if you get the distinction right.

|                        | Flag                      | Status                                           | Mode                                            |
| ---------------------- | ------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| **What it represents** | A binary on/off state     | The current state of something, from a fixed set | A setting that changes behavior                 |
| **Changes when**       | A condition is true/false | The thing moves through its lifecycle            | Someone explicitly chooses how it should behave |
| **Technical type**     | `boolean`                 | `Enum<string>`                                   | `Enum<string>`                                  |
| **UI widget**          | switch, checkbox          | select, radio-group, status badge                | segmented-control, select                       |

**Examples:**

- `is_active: boolean` — a **Flag**. On or off. No inherent lifecycle.
- `status: 'draft' | 'review' | 'published' | 'archived'` — a **Status**. Has a lifecycle. Things
  move through it in a direction.
- `mode: 'manual' | 'mirror' | 'invert'` — a **Mode**. Controls behavior. No lifecycle — you just
  pick one.

The Status/Mode distinction matters in UI: statuses often want a progress indicator or timeline,
while modes want a segmented control or toggle group. They also differ in validation — a Status
might have rules about valid transitions (can't go from `archived` back to `draft`), while a Mode is
usually freely changeable.

---

### Time-Related

Time concepts are siblings — none is a subtype of another. This one trips me up constantly.

```text
Time-related
├─ Date       — a calendar day
├─ DateTime   — a specific moment
├─ Duration   — a length of time
└─ Interval   — a span between two moments
```

---

#### Date

**What it represents:** A calendar day — no time component, no timezone.

**Question it answers:** _“On what day?”_

**Technical representations:**

- ISO 8601 date string: `'2026-01-10'` — almost always the right choice
- Zod: `z.string().date()`

**Pick this when** you care about the day, not the time. Birthdays, due dates, publication dates.

**Typical UI:** date-picker

---

#### DateTime

**What it represents:** A precise moment in time.

**Question it answers:** _“At what exact moment?”_

**Technical representations:**

- ISO 8601 datetime string: `'2026-01-10T14:32:05Z'` — portable, human-readable, good default
- Epoch milliseconds (`number`) — convenient for math and comparisons, harder to read
- Zod: `z.string().datetime()`

**ISO string vs epoch:** ISO strings are better for storage, display, and interoperability. Epoch
milliseconds are convenient when you're doing a lot of arithmetic and don't want to parse
constantly. Pick one and stay consistent within a project.

**Typical UI:** datetime-picker

---

#### Duration

**What it represents:** A length of time — not anchored to any point.

**Question it answers:** _“How long?”_

**Technical representations:**

- **Number (milliseconds or seconds)** — most common, easy to compare and add. `3600000` = 1 hour.
  Best when doing math.
- **ISO 8601 duration string** — `'PT30M'`, `'P7D'`. Portable, somewhat human-readable. Best for
  storage and interop.
- **Structured object** — `{ value: 5, unit: 'minutes' }`. Best when the unit matters for display or
  the value is user-entered.

**Typical UI:** duration-input, number + unit selector

---

#### Interval

**What it represents:** A span defined by two endpoints.

**Question it answers:** _“From when to when?”_

**Technical representation:**

```ts
{ start: string | number, end: string | number }
// where start and end are DateTimes
```

**Typical UI:** two datetime-pickers (start + end)

---

#### Summary

| Concept  | Answers              | Example               |
| -------- | -------------------- | --------------------- |
| Date     | _What day?_          | `'2026-01-10'`        |
| DateTime | _What moment?_       | `'2026-01-10T14:32Z'` |
| Duration | _How long?_          | `30 minutes`          |
| Interval | _From when to when?_ | `{ start, end }`      |

---

## Bridging Conceptual and Technical: Branded Types

There’s a gap the three-layer model exposes but doesn’t automatically close: a `Phone` and an
`Email` are both `string` at the Technical layer, which means TypeScript will happily let you pass
one where the other is expected.

Branded types (also called opaque types) fix this by making the Conceptual type visible to the
compiler without changing the runtime value.

```ts
type Brand<T, B> = T & { readonly __brand: B }

type Phone = Brand<string, "Phone">
type Email = Brand<string, "Email">
type UserId = Brand<string, "UserId">

function sendEmail(address: Email) { ... }

const phone = "+1-555-0100" as Phone
sendEmail(phone) // TS error — Phone is not assignable to Email
```

The `__brand` property doesn’t exist at runtime. It’s a compile-time label that forces you to be
explicit about which conceptual type you have.

**When it’s worth it:**

- IDs that look the same but aren’t interchangeable (`UserId` vs `PostId` vs `SessionId`)
- Validated strings that carry a domain guarantee (`Email`, `Phone`, `Slug`)
- Numeric values with different units that shouldn’t mix (`Meters`, `Seconds`, `Percentage`)

**With Zod:**

```ts
const EmailSchema = z.string().email().brand<'Email'>()
type Email = z.infer<typeof EmailSchema>
// Email is now string & { readonly [z.BRAND]: { Email: Email } }
```

Zod’s `.brand()` does this automatically. Once a value has passed validation, the TypeScript type
carries proof that it’s a valid `Email` — not just a raw string.

---

## Appendix

### Presence, Optionality, and Nullability

These are orthogonal to the type — they describe whether a field must _exist_, not what it
_contains_. Worth keeping separate because TypeScript treats `undefined` and `null` differently and
so does Zod.

| Term                | Meaning                            | TypeScript                                            | ----- |
| ------------------- | ---------------------------------- | ----------------------------------------------------- | ----- |
| Required            | Field must be present              | `field: T`                                            | ----- |
| Optional            | Field may be absent entirely       | `field?: T`                                           | ----- |
| Nullable            | Field exists but value may be null | `field: T                                             | null` |
| Optional + Nullable | May be absent or null              | `field?: T                                            | null` |
| Default             | Value assumed if missing           | Doesn’t imply required or optional — separate concern | ----  |

**`undefined` vs `null`:**

- `undefined` — property was never set / doesn’t exist
- `null` — property exists and was explicitly set to nothing

In practice: a field that was never filled in is `undefined`. A field a user deliberately cleared is
`null`. They’re semantically different. In Zod: `z.optional()` wraps with `| undefined`,
`z.nullable()` wraps with `| null`, `z.nullish()` does both.

```ts
type Example = {
  required: string // must exist, must be a string
  optional?: string // may not exist at all
  nullable: string | null // exists, but can be null
  either?: string | null // may not exist; if it does, can be null
}
```

---

### Type Constraints Reference

> _Not exhaustive._

**Text (`string`):**

- `minLength` / `maxLength` — length bounds
- `pattern` — regex the string must match
- `trim` — strip leading/trailing whitespace
- `lowercase` / `uppercase` — enforce case
- `oneOf` — allowed values (enum-style)
- `nonEmpty` — disallow empty string
- `unique` — uniqueness across a collection

**Number:**

- `min` / `max` — inclusive bounds
- `exclusiveMin` / `exclusiveMax` — strict bounds
- `integerOnly` — whole numbers only
- `multipleOf` — must be a multiple of N

**Date/Time (`string`):**

- `minDate` / `maxDate` — earliest/latest allowed
- `notInFuture` — must not be in the future
- `notInPast` — must not be in the past

**List (`T[]`):**

- `minItems` / `maxItems` — length bounds
- `uniqueItems` — no duplicate values
- `itemConstraints` — constraints applied per item

**Object (`{ ... }`):**

- `requiredKeys` — keys that must be present
- `noExtraKeys` — disallow keys outside the schema (strict mode)

**Map (`Record<string, T>`):**

- `keyPattern` — regex that keys must match
- `maxKeys` — maximum number of keys

**Cross-field** _(usually lives in validation logic, not the type itself)_:

- `requiredIf` — required when another field has a specific value
- `dependsOn` — value depends on another field
- `mutuallyExclusiveWith` — two fields can’t both be present
- `computedFrom` — value is derived from other fields

---

## A Note on Portability

The three layers describe a universal problem, not a TypeScript feature.

**Python**

- Conceptual → domain model / class names
- Technical → type hints (`str`, `int`, `list[str]`), Pydantic models (Pydantic is basically Zod for
  Python — the schema definition spans Conceptual + Technical the same way)
- UI → form widgets, CLI prompts (Click/Typer), API response shapes

**JSON Schema**

- A JSON Schema definition is a Technical layer description — shape and constraints, not meaning.
  The `"title"` and `"description"` fields gesture toward the Conceptual layer but don’t fully
  encode it.

**Home Assistant (YAML)**

- Entity attributes have conceptual types (`temperature` is a Measurement, `mode` is an Enum,
  `is_on` is a Flag)
- The stored values are technical types (usually `string` or `number`)
- The Lovelace card configuration is the UI layer

**Validation libraries generally**

- Zod, Valibot, Yup, Pydantic, Joi all sit between Conceptual and Technical
- Schema definition encodes both shape (Technical) and domain rules (Conceptual)
- The inferred/derived type is purely Technical
- The parser output is the Technical type realized at runtime
