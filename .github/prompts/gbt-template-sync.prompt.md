---
title: gbt-template-sync
category: template-management
summary: |
  Provides a quick action menu and workflow for auditing and syncing files between your current repository and a template repository. Includes options to compare file statuses, pull one-off replacements, sync all files, add the template remote, and show status label definitions.
description: |
  This prompt offers a guided menu and step-by-step instructions for syncing and auditing files between your repository and a template repository, making it easy to keep your project up-to-date or customized as needed.
---

# Template Sync

This skill provides a reusable workflow for auditing and syncing files between your current repository and a
template repository.

---

## Quick Action Menu

**What template sync action do you want to perform?**

- Compare file statuses — Check which files are up-to-date, need updates, are customized, or have diverged
  from the template.
- Pull one-off file replacement — Replace a specific file in your repo with the version from the template.
- Sync all files — Overwrite all files in your repo with the template's versions.
- Add template remote — Add the template repository as a remote to your local git config.
- Show status label definitions — Display the meaning of each status label used in the comparison.

---

## Description

Use this skill to:

- Compare the status of files between your repository and a template repository.
- Identify files that are up-to-date, outdated, customized, or diverged.
- Pull one-off file replacements from the template.
- Automate the process of syncing files with the template.

## Workflow

### 1. Compare File Status

Run the following commands to compare the status of files:

```sh
git fetch template
base=$(git merge-base HEAD template/main)

# Compare file statuses
comm -12 <(git ls-files | sort) <(git ls-tree -r --name-only template/main | sort) \
  | while IFS= read -r file; do
    local_blob=$(git rev-parse "HEAD:$file" 2> /dev/null)
    template_blob=$(git rev-parse "template/main:$file" 2> /dev/null)
    base_blob=$(git rev-parse "$base:$file" 2> /dev/null)

    if [ "$local_blob" = "$template_blob" ]; then
      echo "UP TO DATE: $file"
    elif [ "$local_blob" = "$base_blob" ] && [ "$template_blob" != "$base_blob" ]; then
      echo "UPDATE AVAILABLE: $file"
    elif [ "$template_blob" = "$base_blob" ] && [ "$local_blob" != "$base_blob" ]; then
      echo "LOCAL CUSTOMIZED: $file"
    else
      echo "DIVERGED: $file"
    fi
  done
```

### 2. Pull One-Off File Replacement

To replace a specific file with the version from the template:

```sh
git fetch template
git checkout template/main -- path/to/file
```

### 3. Sync All Files

To sync all files from the template:

```sh
git fetch template
git checkout template/main -- .
```

## Status Labels

- **UP TO DATE**: File is identical in both repositories.
- **UPDATE AVAILABLE**: Template has a newer version.
- **LOCAL CUSTOMIZED**: File has been changed locally but not in the template.
- **DIVERGED**: Both local and template versions have changed.

## Notes

- Ensure you have added the template repository as a remote:

  ```sh
  git remote add template <template-repo-url>
  ```

- Replace `<template-repo-url>` with the actual URL of the template repository.

## Use Cases

- Keeping your repository aligned with a shared template.
- Pulling updates from a template without overwriting local customizations.
- Auditing file differences between repositories.

## Commands

- Compare file statuses: See **Compare File Status** above.
- Pull one-off file replacement: See **Pull One-Off File Replacement** above.
- Sync all files: See **Sync All Files** above.
