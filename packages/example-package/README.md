# @gbt/template-example-package 🐌

> _Workspace package — example template for new monorepo packages_

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

### Repository

- **Github:**
  [`@gbt/template-example-package`](https://github.com/gbtunney/snailicid3-consumer-monorepo/tree/main/packages/example-package)
  • [`snailicid3-consumer-monorepo`](https://github.com/gbtunney/snailicid3-consumer-monorepo)

### Author

👤 **Gillian Tunney**

- [github](https://github.com/gbtunney)
- [email](mailto:gbtunney@mac.com)

## @gbt/template-example-package 🐌

---

This is a private example package showing the canonical structure for a new package in a Snailicid3
consumer repository. It demonstrates the standard tsdown build plan, TypeScript project references,
package.json layout, and Vitest setup.

### Structure

```sh
packages/example-package/
├── src/
│ ├── index.ts          # Public exports
│ └── index.test.ts     # Vitest tests
├── tsdown.config.ts    # Build plan via @snailicid3/build-config
├── tsconfig.json       # TypeScript config
├── tsconfig.build.json # Build-only project references
└── package.json        # Package manifest
```

## Usage

Copy this package as a starting point for a new one:

```sh
cp -r packages/example-package packages/my-new-package
```

Then update `name`, `description`, `repository.directory`, and dependencies in its `package.json`.
Run the build from the repository root:

```sh
pnpm --filter=@gbt/template-example-package build:nx
```
