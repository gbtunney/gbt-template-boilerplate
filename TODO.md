# gbt-template-boilerplate

Shared repository for commonly used files. Includes things like:

- workspace setup
- code boilerplate
- configuration files

Provides a single source of truth for default instructions, reusable prompts, shell completions, recommended
extensions, and automation checklists to standardize and accelerate new project onboarding.

Basically stuff i have a zillion copies of and constantly forget what i am doing :(

## TODO Checklist

- [ ] gitignore
- [ ] recommended extensions
- [ ] vscode
  - [ ] options
  - [ ] macros??
- [ ] changeset settings
- [ ] uninstall sh scripts etc
- [ ] .lintstagedrc.mts
- [ ] .nvmrc
- [ ] pnpm-workspace.yaml
- [ ] .husky prepush
  - [ ] enforce commit rules
  - [ ] disallow commits to main
- [ ] GitHub Rule set file
- [ ] .github folder
  - [ ] instructions
  - [ ] actions
  - [ ] prompts
    - [ ] package key order instructions for Copilot prompt
    - [ ] push/pull template file
    - [ ] completions
    - [ ] dependency audit?
  - [ ] ISSUES setup
  - [ ] other? idk?

### Repo Specific Boilerplate

#### Code Style

- [ ] .markdownlint-cli2.mts
- [ ] prettier.config.ts
- [ ] eslint config

#### Project Files

- [ ] TODO.md template
- [ ] commit lint config (mostly for cz to utilize scope list)
- [ ] README.md
  - [ ] separate header
- [ ] nx.json default

- [ ] Monorepo Root Boilerplate
  - [ ] package.json
  - [ ] tsconfig.json
  - [ ] tsconfig.root.json

- [ ] Example Package Boilerplate
  - [ ] ...

### Project Specific Template

- [ ] Generic reference docs for types, package anatomy, nx to package.json, other
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
