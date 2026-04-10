# gbt-template-boilerplate

Shared repository for commonly used files.
Includes things like:
- workspace setup
- code boilerplate
- configuration files


Provides a single source of truth for default instructions, reusable prompts, shell completions, recommended extensions, and automation checklists to standardize and accelerate new project onboarding.

Basically stuff i have a zillion copies of and constantly forget what i am doing :(

TODO:

[ ] gitignore
[ ] recommended extensions
[ ] vscode
  [ ] options 
  [ ] macros??
[ ] changeset settings
[ ] uninstall sh scripts etc
[ ] .lintstagedrc.mts
[ ] .nvmrc
[ ] pnpm-workspace.yaml
[ ] .husky prepush - enfore commit rules - husky disallow commits to main
[ ] .github folder
  [ ] instructions
  [ ] actions
  [ ] prompts 
    [ ] package key order instructions for copilot prompt ?? misc: 
    [ ] push/pull template file
    [ ] completions
    [ ] dependancy audit?
    
  [ ] ISSUES setup
  [ ] other? idk?

## Repo specific boilerplate

### CODE STYLE
[ ] .markdownlint-cli2.mts
[ ] prettier.config.ts
[ ] eslint config

### Project files
[ ] TODO.md template
[ ] commit lint config (mostly for cz to utilize scope list)
[ ] README.md
  [ ] seperate header
[ ] nx.json default

[ ] monorepo root boilerplate
  [ ] package.json
  [ ] tsconfig.json
  [ ] tsconfig.root.json

[ ] Example package boilerplate
  [ ] ...

### Project specific template


[ ] Generic reference docs for types, pkg anatomy, nx to package.json, other
[ ] common cli cmds constantly forgot like
  [ ] adding ssh to agent
  [ ] copy file contents to clipboard
  [ ] ... im sure there are many lol
  
### Future
[ ] list of repositorys for reference
[ ] way of using something as generic formatter (via actions?)
  - upload file w/out commiting ideally
  - runs standard fixer (prettier, eslint, markdownlint)
  - lists non blocking lint errors
  - dumps the file somewhere to be ? cut/pasted ? make artifact?
