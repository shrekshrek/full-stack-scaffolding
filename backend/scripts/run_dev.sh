#!/usr/bin/env bash
set -e

# This script is intended to be run via `pdm run run_dev`
# It uses the command defined in pyproject.toml under [project.scripts]

echo "Starting development server..."
# The actual command `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` 
# will be executed by PDM based on pyproject.toml configuration.
# This script mainly serves as a conventional entry point if needed for more complex startup logic in the future.

# For now, this script doesn't need to do much more than echo, 
# as PDM handles the uvicorn execution directly from pyproject.toml.
# If you had pre-startup steps, they could go here.

# To run: pdm run start_dev (or pdm run run_dev if script name in pyproject.toml is run_dev)
# Check your pyproject.toml for the exact script name, e.g., [project.scripts].start_dev

# The pyproject.toml has: 
# start_dev = "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# So `pdm run start_dev` will execute the uvicorn command directly.
# If you want this shell script to explicitly call uvicorn, you can do:
# exec pdm run uvicorn app.main:app --reload --host ${HOST:-0.0.0.0} --port ${PORT:-8000}
# But it's cleaner to let PDM manage it via pyproject.toml 