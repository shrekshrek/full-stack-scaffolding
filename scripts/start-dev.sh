#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRONTEND_PORT=3000
BACKEND_PORT=8000

# Function to check and kill process using a specific port
check_and_kill_process_on_port() {
  local port="$1"
  local service_name="$2"
  local pids_to_kill

  echo "Checking port ${port} for ${service_name}..."
  pids_to_kill=$(lsof -t -i:"${port}" 2>/dev/null || true)

  if [ -n "${pids_to_kill}" ]; then
    echo "Process(es) with PID(s) ${pids_to_kill} using port ${port} for ${service_name}. Attempting to stop them..."
    for pid in ${pids_to_kill}; do
      echo "Stopping PID ${pid}..."
      kill "${pid}" 2>/dev/null || true # Continue if kill fails for one PID but others exist
    done
    sleep 2 # Wait for graceful termination

    pids_still_running=$(lsof -t -i:"${port}" 2>/dev/null || true)
    if [ -n "${pids_still_running}" ]; then
      echo "Process(es) ${pids_still_running} did not terminate gracefully. Sending SIGKILL..."
      for pid in ${pids_still_running}; do
        echo "Force killing PID ${pid}..."
        kill -9 "${pid}" 2>/dev/null || true
      done
      sleep 1
    fi

    if lsof -t -i:"${port}" 2>/dev/null; then
      echo "WARN: Failed to free port ${port} for ${service_name}. Manual intervention may be required." >&2
    else
      echo "Port ${port} for ${service_name} has been freed."
    fi
  else
    echo "Port ${port} for ${service_name} is free."
  fi
}

echo "Starting development environment..."
echo "Project Root: ${PROJECT_ROOT}"

# --- 1. Clean up Backend Port ---
echo ""
echo "Preparing backend port..."
check_and_kill_process_on_port "${BACKEND_PORT}" "Backend Service"

# --- 2. Clean up Frontend Port ---
echo ""
echo "Preparing frontend port..."
check_and_kill_process_on_port "${FRONTEND_PORT}" "Frontend Service"

# --- 3. Start Backend Development Server ---
echo ""
echo "Starting backend development server..."
cd "${PROJECT_ROOT}/backend"
if [ -f "pyproject.toml" ] && command -v pdm &> /dev/null; then
  echo "Ensuring backend dependencies (pdm install)..."
  pdm install --no-editable
  echo "Starting backend service in background on http://localhost:${BACKEND_PORT}"
  pdm run dev &
else
  echo "ERROR: Cannot start backend. pyproject.toml or pdm not found in ${PROJECT_ROOT}/backend." >&2
  exit 1
fi
cd "${PROJECT_ROOT}" # Return to project root for consistency

# --- 4. Start Frontend Development Server ---
echo ""
echo "Starting frontend development server..."
cd "${PROJECT_ROOT}/frontend"
if [ -f "package.json" ] && command -v pnpm &> /dev/null; then
  echo "Ensuring frontend dependencies (pnpm install)..."
  pnpm install
  echo "Starting frontend service in foreground on http://localhost:${FRONTEND_PORT}"
  echo "Press CTRL+C to stop frontend (this will also stop this script)."
  echo "The background backend service may need to be stopped manually if it doesn't terminate with the script."
  pnpm run dev
else
  echo "ERROR: Cannot start frontend. package.json or pnpm not found in ${PROJECT_ROOT}/frontend." >&2
  # The background backend is likely still running. User needs to manage it.
  exit 1
fi

echo "Frontend service stopped. Script finished." 