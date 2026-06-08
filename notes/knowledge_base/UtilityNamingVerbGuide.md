# Utility Naming Verb Guide

_A reference for picking the right prefix when naming utility functions._

> Names should describe **caller intent**, not implementation.
>
> `removeWhitespace(value)` is better than `replaceWhitespaceWithEmptyString(value)`, even if the
> implementation uses `.replace(/\s+/g, ‘’)`.
>
> **Scope note.** This guide covers _action_ utility functions — the kind that live in a `utils`
> package. Separate naming conventions apply to constructors (PascalCase nouns: `URL`, `Date`),
> components (PascalCase nouns: `Button`), event handlers (`on` + noun: `onClick`), and functional
> combinators (often noun-named for their result: `identity`, `pipe`, `path`).

—

## Contents

- [Verb Categories](#verb-categories)
- [Verb Semantics](#verb-semantics)
- [Pipeline Layers](#pipeline-layers)
- [Discriminators](#discriminators)
- [Core Rules](#core-rules)
  - [Names should describe caller intent](#names-should-describe-caller-intent)
  - [Use verbs consistently](#use-verbs-consistently)
  - [Validation naming rule](#validation-naming-rule)
  - [Schema naming rule](#schema-naming-rule)
  - [`use` rule](#use-rule)
- [Avoid Vague Names](#avoid-vague-names)

—

## Verb Categories

Verbs cluster into semantic groups. The full table below lists each verb individually, but the
category is what I scan first when I’m trying to remember _what’s the verb for the thing I’m doing?_

- **Predicate** — _boolean checks of identity, capability, or containment._ `is`, `has`, `can`
- **Assertion** — _throw or report on a condition._ `assert`, `validate`
- **Accessor** — _retrieve or change parts of a value._ `get`, `set`, `pick`, `omit`
- **Collection** — _operate on lists, sets, or maps as a whole._ `find`, `filter`, `map`, `reduce`,
  `sort`, `group`, `partition`, `count`, `dedupe`, `clear`
- **Conversion (intake)** — _take loose input and produce a structured value._ `parse`, `tryParse`,
  `coerce`, `normalize`, `sanitize`, `decode`, `deserialize`, `from`, `resolve`, `unescape`,
  `unwrap`
- **Conversion (emit)** — _take a structured value and produce an external representation._
  `format`, `stringify`, `serialize`, `encode`, `escape`, `to`
- **Edit** — _modify a value within the same domain._ `replace`, `remove`, `strip`, `trim`,
  `transform`, `toggle`
- **Composition** — _combine or decompose values of similar shape._ `merge`, `combine`, `flatten`,
  `expand`, `split`, `join`, `compose`, `wrap`
- **Construction** — _build new objects, schemas, or resources._ `create`, `define`, `build`, `make`
- **Binding & Effect** — _attach or run external behavior._ `use`, `apply`, `run`, `tap`
- **I/O & State** — _read, write, or manage external resources and lifecycle._ `load`, `save`,
  `read`, `write`, `watch`, `open`, `close`, `init`, `reset`, `delete`
- **Subscription** — _register and tear down listeners._ `subscribe`, `unsubscribe`, `register`,
  `deregister`
- **Function modifier** — _wrap an existing function with new behavior._ `debounce`, `throttle`,
  `memoize`
- **Value op** — _operate on any value regardless of domain._ `clone`, `freeze`, `ensure`

—

## Verb Semantics

| Verb          | Meaning                                                                 | Return shape                       | Example                           | Category            |
| ------------- | ----------------------------------------------------------------------- | ---------------------------------- | --------------------------------- | ------------------- |
| `is`          | Boolean identity/type/validity check                                    | `boolean` / type predicate         | `isValidUrl(value)`               | Predicate           |
| `has`         | Boolean containment/capability check                                    | `boolean`                          | `hasWhitespace(value)`            | Predicate           |
| `can`         | Boolean permission/capability check before action                       | `boolean`                          | `canParseJson(value)`             | Predicate           |
| `assert`      | Throw if condition is false; narrows type                               | `asserts` / throws                 | `assertIsString(value)`           | Assertion           |
| `validate`    | Check and return validation details/errors                              | result / errors                    | `validateConfig(value)`           | Assertion           |
| `get`         | Retrieve existing value; no parsing/coercion magic                      | value / `undefined`                | `getObjectEntries(value)`         | Accessor            |
| `set`         | Return or apply value with a specific property changed                  | value / mutation                   | `setProperty(object, key, value)` | Accessor            |
| `pick`        | Select a subset by keys/rules                                           | subset                             | `pickKeys(object, keys)`          | Accessor            |
| `omit`        | Return value without selected keys/items                                | subset                             | `omitKeys(object, keys)`          | Accessor            |
| `find`        | Search and return first matching item                                   | item / `undefined`                 | `findByName(items, name)`         | Collection          |
| `filter`      | Return all matching items                                               | array                              | `filterDefined(values)`           | Collection          |
| `map`         | Transform every item in a collection                                    | array / object                     | `mapValues(object, fn)`           | Collection          |
| `reduce`      | Fold many values into one result                                        | accumulated value                  | `reduceEntries(entries, fn)`      | Collection          |
| `sort`        | Return ordered collection                                               | array                              | `sortByName(items)`               | Collection          |
| `group`       | Partition collection by key/category                                    | record / map                       | `groupByType(items)`              | Collection          |
| `partition`   | Split collection in two by predicate                                    | tuple of two arrays                | `partitionByValid(items, fn)`     | Collection          |
| `count`       | Count matching/total items                                              | `number`                           | `countMatches(values, fn)`        | Collection          |
| `dedupe`      | Remove duplicate items                                                  | array                              | `dedupeBy(items, key)`            | Collection          |
| `clear`       | Empty a collection or state                                             | empty value / mutation             | `clearCache()`                    | Collection          |
| `parse`       | Interpret input; may fail                                               | parsed value / error / `undefined` | `parseJson(value)`                | Conversion (intake) |
| `tryParse`    | Parse without throwing                                                  | result object / `undefined`        | `tryParseJson(value)`             | Conversion (intake) |
| `coerce`      | Accept loose input and normalize to target type                         | target type                        | `coerceArray(value)`              | Conversion (intake) |
| `normalize`   | Canonicalize while preserving concept                                   | same domain                        | `normalizeLineEndings(value)`     | Conversion (intake) |
| `sanitize`    | Remove or neutralize unsafe/invalid content                             | same domain                        | `sanitizeFilename(value)`         | Conversion (intake) |
| `decode`      | Convert from encoded representation                                     | value                              | `decodeBase64(value)`             | Conversion (intake) |
| `deserialize` | Convert transport/storage representation back to value                  | value                              | `deserializeConfig(raw)`          | Conversion (intake) |
| `from`        | Build value from a specific representation                              | target value                       | `fromJsonString(value)`           | Conversion (intake) |
| `resolve`     | Turn reference/config/input into final concrete value                   | resolved value                     | `resolvePath(input)`              | Conversion (intake) |
| `unescape`    | Reverse escaping from another syntax/context                            | string                             | `unescapeHtml(value)`             | Conversion (intake) |
| `unwrap`      | Extract inner value from wrapper/result                                 | inner value                        | `unwrapResult(result)`            | Conversion (intake) |
| `format`      | Convert value to human/display string                                   | `string`                           | `formatDate(value)`               | Conversion (emit)   |
| `stringify`   | Convert structured value to string                                      | `string`                           | `stringifyJson(value)`            | Conversion (emit)   |
| `serialize`   | Convert value to transport/storage representation                       | string / buffer / object           | `serializeConfig(config)`         | Conversion (emit)   |
| `encode`      | Convert to encoded representation                                       | string / bytes                     | `encodeBase64(value)`             | Conversion (emit)   |
| `escape`      | Make safe for another syntax/context                                    | string                             | `escapeRegExp(value)`             | Conversion (emit)   |
| `to`          | Convert to another representation/type                                  | target representation              | `toKebabCase(value)`              | Conversion (emit)   |
| `replace`     | Substitute matched thing with another thing                             | same type                          | `replaceAccents(value)`           | Edit                |
| `remove`      | Delete matched content/items from within a value                        | same type                          | `removeWhitespace(value)`         | Edit                |
| `strip`       | Remove wrappers, markup, syntax, metadata, or control chars             | same type                          | `stripHtmlTags(value)`            | Edit                |
| `trim`        | Remove edge content only                                                | same type                          | `trimWhitespace(value)`           | Edit                |
| `transform`   | Apply a caller-provided transformation to a single value                | transformed value                  | `transformString(value, fn)`      | Edit                |
| `toggle`      | Flip a boolean or two-state value                                       | same type                          | `toggleFlag(state, key)`          | Edit                |
| `merge`       | Combine values with override semantics (later wins)                     | combined value                     | `mergeConfig(base, override)`     | Composition         |
| `combine`     | Join multiple same-kind values without override semantics               | combined value                     | `combinePaths(parts)`             | Composition         |
| `flatten`     | Remove nesting                                                          | flat value                         | `flattenArray(values)`            | Composition         |
| `expand`      | Add structure/detail from compact input                                 | expanded value                     | `expandGlobPatterns(patterns)`    | Composition         |
| `split`       | Break one value into parts                                              | array / tuple                      | `splitLines(value)`               | Composition         |
| `join`        | Combine parts into one value                                            | string / array / etc.              | `joinPaths(parts)`                | Composition         |
| `compose`     | Combine functions into one                                              | function                           | `composeMappers(fns)`             | Composition         |
| `wrap`        | Put a value inside a wrapper type                                       | wrapper                            | `wrapAsResult(value)`             | Composition         |
| `create`      | Construct a new object/function/resource                                | new value                          | `createTypedRegExp(pattern)`      | Construction        |
| `define`      | Identity helper that preserves config/schema typing                     | same value                         | `defineSchema(schema)`            | Construction        |
| `build`       | Construct a complex output from options/parts                           | built value                        | `buildPackageExports(config)`     | Construction        |
| `make`        | Lightweight factory; closure-captured config                            | new value                          | `makeLogger(options)`             | Construction        |
| `use`         | Bind external resource, adapter, plugin, context, or runtime dependency | configured value / side effect     | `useLogger(adapter)`              | Binding & Effect    |
| `apply`       | Apply operation/patch/config to a target                                | changed target / result            | `applyPatch(document, patch)`     | Binding & Effect    |
| `run`         | Execute process/task/workflow                                           | result / side effect               | `runCommand(command)`             | Binding & Effect    |
| `tap`         | Run a side effect on a value, return value unchanged                    | same value                         | `tapLog(value)`                   | Binding & Effect    |
| `load`        | Read from filesystem/network/environment                                | loaded value                       | `loadConfig(path)`                | I/O & State         |
| `save`        | Write to filesystem/storage                                             | result / side effect               | `saveConfig(path, config)`        | I/O & State         |
| `read`        | Read raw data from source                                               | raw value                          | `readJsonFile(path)`              | I/O & State         |
| `write`       | Write raw data to destination                                           | result / side effect               | `writeJsonFile(path, value)`      | I/O & State         |
| `watch`       | Observe changes over time                                               | cleanup / subscription             | `watchFiles(patterns)`            | I/O & State         |
| `open`        | Acquire a resource handle                                               | resource                           | `openConnection(config)`          | I/O & State         |
| `close`       | Release a resource handle                                               | result / side effect               | `closeConnection(conn)`           | I/O & State         |
| `init`        | One-time setup of a system or module                                    | instance / result                  | `initLogger(config)`              | I/O & State         |
| `reset`       | Return state to initial                                                 | state / side effect                | `resetForm(form)`                 | I/O & State         |
| `delete`      | Permanently remove from storage                                         | result / side effect               | `deleteRecord(id)`                | I/O & State         |
| `subscribe`   | Register listener for events/changes                                    | unsubscribe fn                     | `subscribeToStore(fn)`            | Subscription        |
| `unsubscribe` | Remove listener/subscription                                            | void                               | `unsubscribeFromStore(id)`        | Subscription        |
| `register`    | Add to a registry (plugin/handler/route)                                | deregister fn                      | `registerPlugin(plugin)`          | Subscription        |
| `deregister`  | Remove from a registry                                                  | void                               | `deregisterPlugin(id)`            | Subscription        |
| `debounce`    | Delay repeated calls until quiet period                                 | wrapped function                   | `debounceFunction(fn)`            | Function modifier   |
| `throttle`    | Limit call frequency                                                    | wrapped function                   | `throttleFunction(fn)`            | Function modifier   |
| `memoize`     | Cache function results                                                  | wrapped function                   | `memoizeFunction(fn)`             | Function modifier   |
| `clone`       | Copy value                                                              | copied value                       | `cloneObject(value)`              | Value op            |
| `freeze`      | Make immutable                                                          | readonly value                     | `freezeObject(value)`             | Value op            |
| `ensure`      | Idempotent precondition; if true do nothing, else make true             | same domain / side effect          | `ensureDirectoryExists(path)`     | Value op            |

—

## Pipeline Layers

Each verb has a typical _position_ in a data pipeline. This is a tendency, not a strict rule — some
verbs span layers — but it’s a useful filter when correlating verbs to a three-layer type system
(input → runtime → output).

- **Input** — _taking external or raw data and producing a structured value._ `parse`, `tryParse`,
  `coerce`, `normalize`, `sanitize`, `validate`, `decode`, `deserialize`, `from`, `resolve`, `load`,
  `read`, `init`, `unescape`
- **Runtime** — _operating on values you already have in memory._ `is`, `has`, `can`, `assert`,
  `get`, `set`, `pick`, `omit`, `find`, `filter`, `map`, `reduce`, `sort`, `group`, `partition`,
  `count`, `dedupe`, `clear`, `transform`, `replace`, `remove`, `strip`, `trim`, `merge`, `combine`,
  `flatten`, `expand`, `split`, `join`, `compose`, `wrap`, `unwrap`, `toggle`, `clone`, `freeze`,
  `ensure`, `tap`
- **Output** — _going to display, transport, or storage._ `format`, `stringify`, `serialize`,
  `encode`, `escape`, `to`, `save`, `write`
- **Cross-cutting** — _lifecycle, factories, effects; appears anywhere._ `create`, `define`,
  `build`, `make`, `use`, `apply`, `run`, `watch`, `open`, `close`, `reset`, `delete`, `subscribe`,
  `unsubscribe`, `register`, `deregister`, `debounce`, `throttle`, `memoize`

The verbs that _bridge_ layers (`parse`, `validate`, `coerce`) are doing the real type-system work —
they take “the outside world” and produce something the rest of the system can rely on.

—

## Discriminators

The hard-edge cases. Neighboring verbs that get confused most often.

### `remove` vs `strip` vs `trim` vs `sanitize`

- `trim` — _edges only._ `trimWhitespace` removes leading/trailing whitespace.
- `strip` — _structural noise or wrappers._ `stripHtmlTags`, `stripBom`, `stripAnsi`. The thing
  being stripped is recognizable as syntax or metadata, not data.
- `remove` — _matched content anywhere in the value._ `removeWhitespace` removes every whitespace
  character. The match can be anywhere.
- `sanitize` — _unsafe or invalid content._ `sanitizeFilename`, `sanitizeHtml`. The motivation is
  safety or validity, not aesthetics.

### `merge` vs `combine` vs `compose`

- `merge` — _override semantics._ Later values win on key conflicts. Configs, partial updates, deep
  merges.
- `combine` — _same-kind concatenation._ No override. `combinePaths([‘a’, ‘b’])` → `’a/b’`.
  `combineArrays`, `combineSchemas`.
- `compose` — _function composition specifically._ `compose(f, g)(x)` = `f(g(x))`.

### `create` vs `build` vs `make` vs `define`

- `create` — _generic constructor._ Default choice when nothing more specific applies.
- `build` — _complex assembly from parts or options._ `buildPackageExports(config)`. Implies
  multiple inputs combined into a structured output.
- `make` — _lightweight factory, often closure-captured config._ `makeLogger({ level })` returns a
  configured logger.
- `define` — _identity helper for type preservation._ `defineConfig`, `defineSchema`. Returns its
  argument unchanged at runtime; exists for inference.

### `parse` vs `tryParse` vs `coerce`

- `parse` — _interpret structured input; may throw or return error._ Input is expected to be in a
  specific shape (JSON, semver, ISO date).
- `tryParse` — _parse without throwing._ Returns a result object or `undefined`. Use when failure is
  expected and ergonomic null-handling matters.
- `coerce` — _accept anything reasonable, convert to target._ Best-effort. `coerceArray(value)`
  wraps non-arrays in `[value]`.

### `format` vs `stringify` vs `serialize`

- `format` — _human-readable display string._ `formatDate(d, ‘long’)` → `’May 9, 2026’`.
  Localization-aware.
- `stringify` — _structured-to-string for data interchange._ `stringifyJson(obj)` → JSON.
  Round-trippable with `parse`.
- `serialize` — _transport or storage representation._ Broader than just string; can be bytes,
  Buffer, or a structured wire format.

### `map` vs `transform`

- `map` — _applies a function to every item in a collection._
- `transform` — _applies a function to a single value._

### `remove` vs `delete`

- `remove` — _take out of a collection or data structure._ In-memory, reversible, the value still
  exists somewhere.
- `delete` — _destructive and permanent._ Files, database records, accounts. Use when “undo” is not
  on the table.

### `subscribe` vs `register` vs `watch`

- `subscribe` — _listen to events from an emitter or store._ Returns an unsubscribe function.
- `register` — _add to a registry._ Plugins, routes, handlers, middleware. The thing being
  registered is structural, not eventful.
- `watch` — _observe ongoing changes to a resource._ Files, paths, glob patterns, state values.

### `is` vs `has` vs `can`

- `is` — _identity or type check._ `isString`, `isValidUrl`. “Is this an X?”
- `has` — _containment or property check._ `hasWhitespace`, `hasOwnProperty`. “Does this contain or
  possess X?”
- `can` — _capability or permission check._ `canParseJson`, `canWriteFile`. “Is it possible to do X
  with this?”

### `use` vs `apply`

- `use` — _bind or integrate a resource, adapter, plugin, or context._ The resource is a dependency.
- `apply` — _apply an operation, patch, or config to a target._ The operation is the input, the
  target is what gets changed.

—

## Core Rules

### Names should describe caller intent

Prefer:

```ts
removeWhitespace(value)
```

Over:

```ts
replaceWhitespaceWithEmptyString(value)
```

Even if the implementation uses `.replace(...)` internally.

—

### Use verbs consistently

Examples:

```ts
isValidUrl(value)
hasWhitespace(value)
parseJson(value)
coerceArray(value)
normalizeLineEndings(value)
removeWhitespace(value)
stripHtmlTags(value)
escapeRegExp(value)
toKebabCase(value)
createTypedRegExp(...)
defineSchema(schema)
```

—

### Validation naming rule

Use these distinctly:

```txt
isValidX      -> boolean
validateX     -> validation details/errors
parseValidX   -> parsed/branded value or undefined
assertValidX  -> throws if invalid
```

Example:

```ts
isValidUrl(value): boolean
validateUrl(value): ValidationResult
parseValidUrl(value): Url | undefined
assertValidUrl(value): asserts value is UrlInput
```

—

### Schema naming rule

If a function returns a Zod schema, suffix it with `Schema`.

```ts
coerceArraySchema(schema)
coerceRegExpSchema()
coerceNumericSchema()
enumSchema(values)
```

Don’t name schema helpers like plain runtime helpers:

```ts
coerceArray(value) // runtime value helper
coerceArraySchema(schema) // Zod schema helper
```

—

### `use` rule

Use `use` only when the function is about binding or applying an external resource, adapter, plugin,
context, or runtime dependency.

Good:

```ts
useLogger(logger)
useAdapter(adapter)
usePlugin(plugin)
useRuntime(runtime)
```

Avoid:

```ts
useString(value)
useArray(value)
useDate(value)
```

Those should usually be:

```ts
coerceString(value)
coerceArray(value)
parseDate(value)
formatDate(value)
```

—

## Avoid Vague Names

Avoid vague public API names like:

```txt
utils
helpers
misc
common
shared
master
data
thing
handle
process
doStuff
formatStr
numeric
validators
stringUtils
```

These are acceptable as temporary internal folders, but they make public APIs hard to remember.
