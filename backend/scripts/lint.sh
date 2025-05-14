#!/usr/bin/env bash
set -e

echo "Running linters and formatters..."
# This script uses the commands defined in pyproject.toml under [project.scripts].run_lint and apply_lint
# It's a good practice to have a single script that can be called by CI or pre-commit hooks.

# Check mode (no changes made)
# pdm run ruff check .
# pdm run black --check .
# pdm run mypy .

# Apply fixes
# pdm run ruff check . --fix
# pdm run black .

# The pyproject.toml defines:
# run_lint = "ruff check . && black --check . && mypy ."
# apply_lint = "ruff check . --fix && black ."

echo "Running checks (ruff, black --check, mypy)..."
if ! pdm run run_lint; then
    echo "Linting checks failed. Please fix the issues above." 
    # Optionally, try to apply fixes if in a local environment or specific CI step
    # echo "Attempting to apply fixes..."
    # if pdm run apply_lint; then
    #    echo "Fixes applied. Please review and commit the changes."
    #    exit 1 # Still exit with error to indicate changes were made / manual review needed
    # else
    #    echo "Failed to apply fixes automatically."
    # fi
    exit 1
fi

echo "Linting and type checks passed." 