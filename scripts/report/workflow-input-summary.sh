

//CAN THIS JUST DUMP VARIABLE SOMEHOW  ? INPUTS ?? and use KV pair? 
  - name: 🌸 Input Summary
              shell: bash
              run: |
                  echo "mode=${{ inputs.mode }}"
                  echo "check_mode=${{ inputs.check_mode }}"
                  echo "run_install=${{ inputs.run_install }}"
                  echo "require_lockfile=${{ inputs.require_lockfile }}"
                  echo "require_clean_repo=${{ inputs.require_clean_repo }}"
                  echo "run_build=${{ inputs.run_build }}"
                  echo "run_test=${{ inputs.run_test }}"
                  echo "run_docs_build=${{ inputs.run_docs_build }}"
                  echo "nx_cache_reset=${{ inputs.nx_cache_reset }}"
                  echo "pnpm_store_reset=${{ inputs.pnpm_store_reset }}"