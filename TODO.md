# gbt-template-boilerplate

Shared repository for commonly used files. Includes things like:

- workspace setup
- code boilerplate
- configuration files

Provides a single source of truth for default instructions, reusable prompts, shell completions,
recommended extensions, and automation checklists to standardize and accelerate new project
onboarding.

Basically stuff i have a zillion copies of and constantly forget what i am doing :(

## Copy Manifest

Core files/folders to copy into other repos when applying this template:

### Workspace / Nx

- `nx.json`
- `project.json`
- `pnpm-workspace.yaml`

### TypeScript

- `tsconfig.json`

### Root Lint / Format / Commit Config

- `commitlint.config.ts`
- `eslint.config.ts`
- `prettier.config.ts`
- `.markdownlint-cli2.mts`
- `.lintstagedrc.mts`

### Tooling Folders

- `.changeset/`
- `.husky/`

### GitHub Folder

- `.github/`

## TODO Checklist

- [x] gitignore
- [x] recommended extensions
- [x] vscode
  - [x] options
  - [x] macros?? (`.vscode/shellscript.code-snippets`)
- [x] changeset settings
- [ ] uninstall sh scripts etc
- [x] .lintstagedrc.mts
- [ ] .nvmrc
- [x] pnpm-workspace.yaml
- [x] .husky prepush
  - [x] enforce commit rules (`.husky/commit-msg`)
  - [x] disallow commits to main
- [ ] GitHub Rule set file
- [x] .github folder
  - [x] instructions
  - [x] actions
  - [x] prompts
    - [ ] package key order instructions for Copilot prompt
    - [x] push/pull template file
    - [x] completions
    - [x] dependency audit?
  - [x] ISSUES setup
  - [x] other? idk? (`label-schema`, scripts, skill)

### Repo Specific Boilerplate

#### Code Style

- [x] .markdownlint-cli2.mts
- [x] prettier.config.ts
- [x] eslint config

#### Project Files

- [x] TODO.md template
- [x] commit lint config (mostly for cz to utilize scope list)
- [x] README.md
  - [x] separate header
- [x] nx.json default

- [x] Monorepo Root Boilerplate
  - [x] package.json
  - [x] tsconfig.json
  - [ ] tsconfig.root.json

- [x] Example Package Boilerplate
  - [x] ...

### Project Specific Template

- [x] Generic reference docs for types, package anatomy, nx to package.json, other
- [ ] Common CLI commands constantly forgotten like:
  - [ ] adding SSH to agent
  - [ ] copy file contents to clipboard
  - [ ] ... I'm sure there are many lol

### Future

- [ ] List of repositories for reference
- [ ] Way of using something as a generic formatter (via actions?)
  - [ ] Upload file without committing ideally
  - [ ] Runs standard fixer (prettier, eslint, markdownlint)
  - [ ] Lists non-blocking lint errors
  - [ ] Dumps the file somewhere to be cut/pasted or make artifact

### TODO Fix missing packages from other repo - list here

- [x] [error] TODO Cannot find package 'typescript-eslint', remember to remove

- [x] config/dist/.markdownlint.json That file isn’t “pretty JSON” right now — it’s aJSON string
      that contains JSON (everything is wrapped in quotes and escaped). Toread it, you need to
      decode the string, then pretty-print.

- [ ] Fix `scope-commit`/`scope-affected` in `@snailicid3/config` to strip any package namespace
      prefix, not just `@snailicid3/`. Example: `@gbt/drizzle-blueprint` should emit
      `drizzle-blueprint`.
