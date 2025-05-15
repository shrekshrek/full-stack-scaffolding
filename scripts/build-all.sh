#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "Starting full project build..."

# --- Build Frontend ---
echo ""
echo "Building frontend application..."
cd "${PROJECT_ROOT}/frontend"
if [ -f "package.json" ] && command -v pnpm &> /dev/null; then
  pnpm install # Ensure dependencies are installed
  pnpm run build
  echo "Frontend build completed."
else
  echo "Skipping frontend build: package.json or pnpm not found in frontend directory."
fi
cd "${PROJECT_ROOT}" # Return to project root

# --- Build Backend ---
echo ""
echo "Building backend application..."
cd "${PROJECT_ROOT}/backend"
if [ -f "pyproject.toml" ] && command -v pdm &> /dev/null; then
  pnpm install # Ensure dependencies are installed
  pdm build # Or any other backend build command
  echo "Backend build completed."
else
  echo "Skipping backend build: pyproject.toml or pdm not found in backend directory."
fi
cd "${PROJECT_ROOT}" # Return to project root

echo ""
echo "Full project build process finished successfully." 