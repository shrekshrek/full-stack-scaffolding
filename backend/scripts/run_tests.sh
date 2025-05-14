#!/usr/bin/env bash
set -e

echo "Running tests..."
# This script uses the command defined in pyproject.toml under [project.scripts].run_tests
# which is typically `pdm run pytest` or just `pytest` if pdm is configured to find it.
# `pdm run pytest` is preferred to ensure it uses the project's environment and pytest version.

# To run: pdm run run_tests

# The pyproject.toml has:
# run_tests = "pytest"

# So `pdm run run_tests` will execute pytest. 