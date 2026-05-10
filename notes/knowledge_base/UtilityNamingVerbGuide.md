# Utility Naming Verb Guide v1

Names should describe **caller intent**, not implementation.

For example, `removeWhitespace(value)` is better than `replaceWhitespaceWithEmptyString(value)`, even if the implementation uses `.replace(/\s+/g, '')`.

## Verb Semantics

| Prefix | Meaning | Return shape | Example |
|---|---|---:|---|
| `is` | Boolean identity/type/validity check | `boolean` / type predicate | `isValidUrl(value)` |
| `has` | Boolean containment/capability check | `boolean` | `hasWhitespace(value)` |
| `can` | Boolean permission/capability check before action | `boolean` | `canParseJson(value)` |
| `assert` | Throw if condition is false; narrows type | `asserts` / throws | `assertIsString(value)` |
| `get` | Retrieve existing value; no parsing/coercion magic | value / `undefined` | `getObjectEntries(value)` |
| `set` | Return or apply value with a specific property changed | value / mutation | `setProperty(object, key, value)` |
| `pick` | Select a subset by keys/rules | subset | `pickKeys(object, keys)` |
| `omit` | Return value without selected keys/items | subset | `omitKeys(object, keys)` |
| `find` | Search and return first matching item | item / `undefined` | `findByName(items, name)` |
| `filter` | Return all matching items | array | `filterDefined(values)` |
| `map` | Transform every item in a collection | array/object | `mapValues(object, fn)` |
| `reduce` | Fold many values into one result | accumulated value | `reduceEntries(entries, fn)` |
| `sort` | Return ordered collection | array | `sortByName(items)` |
| `group` | Partition collection by key/category | record/map | `groupByType(items)` |
| `count` | Count matching/total items | `number` | `countMatches(values, fn)` |
| `parse` | Interpret input; may fail | parsed value / error / `undefined` | `parseJson(value)` |
| `tryParse` | Parse without throwing | result object / `undefined` | `tryParseJson(value)` |
| `stringify` | Convert structured value to string | `string` | `stringifyJson(value)` |
| `serialize` | Convert value to transport/storage representation | string/buffer/object | `serializeConfig(config)` |
| `deserialize` | Convert transport/storage representation back to value | value | `deserializeConfig(raw)` |
| `encode` | Convert to encoded representation | string/bytes | `encodeBase64(value)` |
| `decode` | Convert from encoded representation | value | `decodeBase64(value)` |
| `coerce` | Accept loose input and normalize to target type | target type | `coerceArray(value)` |
| `normalize` | Canonicalize while preserving concept | same domain | `normalizeLineEndings(value)` |
| `format` | Convert value to human/display string | `string` | `formatDate(value)` |
| `to` | Convert to another representation/type | target representation | `toKebabCase(value)` |
| `from` | Build value from a specific representation | target value | `fromJsonString(value)` |
| `transform` | Apply a caller-provided transformation | transformed value | `transformString(value, fn)` |
| `replace` | Substitute matched thing with another thing | same type | `replaceAccents(value)` |
| `remove` | Delete matched content/items | same type | `removeWhitespace(value)` |
| `strip` | Remove wrappers, markup, syntax, metadata, or control chars | same type | `stripHtmlTags(value)` |
| `trim` | Remove edge content only | same type | `trimWhitespace(value)` |
| `escape` | Make safe for another syntax/context | string | `escapeRegExp(value)` |
| `unescape` | Reverse escaping from another syntax/context | string | `unescapeHtml(value)` |
| `sanitize` | Remove or neutralize unsafe/invalid content | same domain | `sanitizeFilename(value)` |
| `validate` | Check and return validation details/errors | result/errors | `validateConfig(value)` |
| `resolve` | Turn reference/config/input into final concrete value | resolved value | `resolvePath(input)` |
| `merge` | Combine values, usually objects/configs | combined value | `mergeConfig(base, override)` |
| `combine` | Join multiple same-kind values without override semantics | combined value | `combinePaths(parts)` |
| `flatten` | Remove nesting | flat value | `flattenArray(values)` |
| `expand` | Add structure/detail from compact input | expanded value | `expandGlobPatterns(patterns)` |
| `split` | Break one value into parts | array/tuple | `splitLines(value)` |
| `join` | Combine parts into one value | string/array/etc. | `joinPaths(parts)` |
| `create` | Construct a new object/function/resource | new value | `createTypedRegExp(pattern)` |
| `define` | Identity helper that preserves config/schema typing | same value | `defineSchema(schema)` |
| `build` | Construct a complex output from options/parts | built value | `buildPackageExports(config)` |
| `make` | Lightweight factory; less formal than `create` | new value | `makeLogger(options)` |
| `use` | Bind/apply external resource, adapter, plugin, context, or runtime dependency | configured value / side effect | `useLogger(adapter)` |
| `apply` | Apply operation/patch/config to a target | changed target/result | `applyPatch(document, patch)` |
| `run` | Execute process/task/workflow | result / side effect | `runCommand(command)` |
| `load` | Read from filesystem/network/environment | loaded value | `loadConfig(path)` |
| `save` | Write to filesystem/storage | result / side effect | `saveConfig(path, config)` |
| `read` | Read raw data from source | raw value | `readJsonFile(path)` |
| `write` | Write raw data to destination | result / side effect | `writeJsonFile(path, value)` |
| `watch` | Observe changes over time | cleanup/subscription | `watchFiles(patterns)` |
| `subscribe` | Register listener for events/changes | unsubscribe fn | `subscribeToStore(fn)` |
| `unsubscribe` | Remove listener/subscription | void | `unsubscribeFromStore(id)` |
| `debounce` | Delay repeated calls until quiet period | wrapped function | `debounceFunction(fn)` |
| `throttle` | Limit call frequency | wrapped function | `throttleFunction(fn)` |
| `memoize` | Cache function results | wrapped function | `memoizeFunction(fn)` |
| `clone` | Copy value | copied value | `cloneObject(value)` |
| `freeze` | Make immutable | readonly value | `freezeObject(value)` |
| `unwrap` | Extract inner value from wrapper/result | inner value | `unwrapResult(result)` |

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

---

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

---

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

---

### Schema naming rule

If a function returns a Zod schema, suffix it with `Schema`.

```ts
coerceArraySchema(schema)
coerceRegExpSchema()
coerceNumericSchema()
enumSchema(values)
```

Do not name schema helpers like plain runtime helpers:

```ts
coerceArray(value)        // runtime value helper
coerceArraySchema(schema) // Zod schema helper
```

---

### `use` rule

Use `use` only when the function is about binding or applying an external resource, adapter, plugin, context, or runtime dependency.

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

---

## Avoid vague names

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

