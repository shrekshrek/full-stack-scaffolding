#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
# set -e # Commented out because background processes might exit in ways that trigger this

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRONTEND_PORT=3000
BACKEND_PORT=8000

# Function to check and kill process using a specific port
check_and_kill_process_on_port() {
  local port="$1"
  local service_name="$2"

  echo "Checking port ${port} for ${service_name}..."
  # Try to find PID using lsof. Suppress errors if no process is found.
  local existing_pid=$(lsof -t -i:"${port}" 2>/dev/null || true)

  if [ -n "${existing_pid}" ]; then
    echo "Process with PID ${existing_pid} is using port ${port} for ${service_name}. Attempting to stop it..."
    # Send SIGTERM first, then wait a bit
    kill "${existing_pid}" 2>/dev/null
    sleep 2 # Wait for the process to terminate gracefully

    # Check if the process is still alive
    if kill -0 "${existing_pid}" 2>/dev/null; then
      echo "Process ${existing_pid} did not terminate gracefully. Sending SIGKILL..."
      kill -9 "${existing_pid}" 2>/dev/null
      sleep 1 # Give it a moment after SIGKILL
    fi

    # Final check if the port is free
    if lsof -t -i:"${port}" 2>/dev/null; then
      echo "WARN: Failed to free port ${port} for ${service_name}. Manual intervention may be required." >&2
    else
      echo "Port ${port} for ${service_name} has been freed."
    fi
  else
    echo "Port ${port} for ${service_name} is free."
  fi
}

echo "Starting development servers..."

# --- Start Frontend Development Server ---
echo ""
check_and_kill_process_on_port "${FRONTEND_PORT}" "Frontend Service"

echo "Starting frontend development server (vite)..."
cd "${PROJECT_ROOT}/frontend"
if [ -f "package.json" ] && command -v pnpm &> /dev/null; then
  pnpm install # Ensure dependencies are installed
  (pnpm run dev &)
  echo "Frontend dev server started in the background. Target port: ${FRONTEND_PORT}."
else
  echo "Skipping frontend dev server start: package.json or pnpm not found in frontend directory." >&2
fi
cd "${PROJECT_ROOT}" # Return to project root

# --- Start Backend Development Server ---
echo ""
check_and_kill_process_on_port "${BACKEND_PORT}" "Backend Service"

echo "Starting backend development server (pdm)..."
cd "${PROJECT_ROOT}/backend"
if [ -f "pyproject.toml" ] && command -v pdm &> /dev/null; then
  pdm install # Ensure dependencies are installed
  # Replace 'pdm run dev' with your actual backend dev server start command if different
  # Ensure it uses the BACKEND_PORT if configurable, e.g., pdm run uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT} --reload
  (pdm run dev &) # Make sure this command respects BACKEND_PORT if not default
  echo "Backend dev server started in the background. Target port: ${BACKEND_PORT}."
else
  echo "Skipping backend dev server start: pyproject.toml or pdm not found in backend directory." >&2
fi
cd "${PROJECT_ROOT}" # Return to project root

echo ""
echo "All development servers have been launched in the background."
echo "To stop them, you'll need to find their Process IDs (PIDs) and use 'kill <PID>' or re-run this script to attempt auto-kill."
# Note: The PID sniffing below might not be perfectly reliable if multiple instances with similar names exist.
_frontend_raw_cmd="pnpm run dev"
_backend_raw_cmd="pdm run dev"

# Try to find PIDs more reliably, specific to the commands and working directories if possible
# This is a basic attempt; more robust PID finding might be needed for complex scenarios.
echo "Attempting to find PIDs (this might not be fully accurate):"
_frontend_pid=$(ps aux | grep "${_frontend_raw_cmd}" | grep "frontend" | grep -v grep | awk '{print $2}' | head -n 1)
_backend_pid=$(ps aux | grep "${_backend_raw_cmd}" | grep "backend" | grep -v grep | awk '{print $2}' | head -n 1)

if [ -n "$_frontend_pid" ]; then
    echo "Frontend (${_frontend_raw_cmd}) likely PID: $_frontend_pid on port ${FRONTEND_PORT}"
fi
if [ -n "$_backend_pid" ]; then
    echo "Backend (${_backend_raw_cmd}) likely PID: $_backend_pid on port ${BACKEND_PORT}"
fi

echo "Alternatively, if you started them via 'docker-compose up', use 'docker-compose down' in the project root." 