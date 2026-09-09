# @gbt/template-example-react 🐌

> _Workspace package — example React + Vite template with Storybook_

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)

### Repository

- **Github:**
  [`@gbt/template-example-react`](https://github.com/gbtunney/snailicid3-consumer-monorepo/tree/main/packages/example-react)
  • [`snailicid3-consumer-monorepo`](https://github.com/gbtunney/snailicid3-consumer-monorepo)

### Author

👤 **Gillian Tunney**

- [github](https://github.com/gbtunney)
- [email](mailto:gbtunney@mac.com)

## @gbt/template-example-react 🐌

---

A private example package showing a React component library in a Snailicid3 consumer repository:
tsdown build with CSS output, Storybook 10 on `@storybook/react-vite`, accessibility checks, and
Storybook-driven Vitest browser tests.

### Structure

```sh
packages/example-react/
├── .storybook/
│ ├── main.ts         # Shared config via @snailicid3/storybook-config
│ ├── preview.ts      # Preview parameters
│ └── vitest.setup.ts # Portable-stories annotations for Vitest
├── src/              # Components, stories, and tests
├── tsdown.config.ts  # Build plan via @snailicid3/build-config
└── package.json
```

## Usage

Run from the repository root:

```sh
pnpm --filter=@gbt/template-example-react build:nx           # build the library
pnpm --filter=@gbt/template-example-react dev:storybook      # Storybook dev server
pnpm --filter=@gbt/template-example-react build:storybook:nx # static Storybook
pnpm --filter=@gbt/template-example-react test:nx            # Vitest
```

Chromatic runs through its own Nx target and needs `CHROMATIC_PROJECT_TOKEN_EXAMPLE_REACT` in `.env`
at the repository root — see `.env.example`:

```sh
pnpm --filter=@gbt/template-example-react test:chromatic
```
