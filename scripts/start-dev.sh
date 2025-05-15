#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRONTEND_PORT=3000 # As defined in vite.config.ts
BACKEND_PORT=8000  # As defined in pdm run dev script

# Variable to store Backend PID
BACKEND_PID=""

# Function to clean up background processes on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    if [ -n "${BACKEND_PID}" ]; then
        echo "Stopping backend service (PID: ${BACKEND_PID})..."
        # Send SIGTERM to the process group of BACKEND_PID to kill Uvicorn and its reloader
        kill -TERM -- "-${BACKEND_PID}" 2>/dev/null || kill -TERM "${BACKEND_PID}" 2>/dev/null
        # Wait a bit for graceful shutdown
        sleep 2
        if kill -0 "${BACKEND_PID}" 2>/dev/null; then
            echo "Backend service (PID: ${BACKEND_PID}) did not stop gracefully. Sending SIGKILL..."
            kill -KILL -- "-${BACKEND_PID}" 2>/dev/null || kill -KILL "${BACKEND_PID}" 2>/dev/null
        fi
        echo "Backend service stopped."
    else
        echo "No backend PID recorded to stop."
    fi
    # Remove trap to avoid recursive calls if cleanup itself errors
    trap - EXIT
    echo "Cleanup complete."
}

# Trap EXIT, SIGINT, SIGTERM signals to run cleanup function
trap cleanup EXIT SIGINT SIGTERM

# Function to check and kill process using a specific port
check_and_kill_process_on_port() {
  local port="$1"
  local service_name="$2"

  echo "Checking port ${port} for ${service_name}..."
  local existing_pid=$(lsof -t -i:"${port}" 2>/dev/null || true)

  if [ -n "${existing_pid}" ]; then
    echo "Process with PID ${existing_pid} is using port ${port} for ${service_name}. Attempting to stop it..."
    kill "${existing_pid}" 2>/dev/null
    sleep 2 # Wait

    if kill -0 "${existing_pid}" 2>/dev/null; then
      echo "Process ${existing_pid} did not terminate gracefully. Sending SIGKILL..."
      kill -9 "${existing_pid}" 2>/dev/null
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

# --- Clean up ports before starting ---
echo ""
check_and_kill_process_on_port "${BACKEND_PORT}" "Backend Service"
check_and_kill_process_on_port "${FRONTEND_PORT}" "Frontend Service"

# --- Start Backend Development Server ---
echo ""
echo "Starting backend development server (FastAPI/Uvicorn via PDM)..."
cd "${PROJECT_ROOT}/backend"
if [ -f "pyproject.toml" ] && command -v pdm &> /dev/null; then
  echo "Ensuring backend dependencies are installed..."
  pdm install --no-editable # Using --no-editable for faster startup if full install isn't changing often
  echo "Starting backend service in the background..."
  # Start `pdm run dev` in a new process group so we can kill the whole group
  (set -m; pdm run dev &)
  BACKEND_PID=$! # Get PID of the backgrounded command itself (the subshell or pdm)
  # Note: Uvicorn with --reload starts a supervisor and then worker(s).
  # The $! might be the supervisor. Killing the process group is more reliable.
  echo "Backend service initiated with PID ${BACKEND_PID}. Will run on http://localhost:${BACKEND_PORT}"
else
  echo "ERROR: Cannot start backend. pyproject.toml or pdm not found in ${PROJECT_ROOT}/backend." >&2
  exit 1
fi
cd "${PROJECT_ROOT}"

# --- Wait for Backend to be ready ---
echo ""
echo "Waiting for backend to be ready (approx. 5-10 seconds)..."
# Simple sleep for now. A more robust check would be to curl a health endpoint.
# For example:
# until curl -s -f -o /dev/null "http://localhost:${BACKEND_PORT}/api/health"; do
#   echo "Backend not ready yet, retrying in 2s..."
#   sleep 2
# done
# echo "Backend is ready!"
sleep 3 # Changed from 8 to 3

# --- Start Frontend Development Server ---
echo ""
echo "Starting frontend development server (Vite)..."
cd "${PROJECT_ROOT}/frontend"
if [ -f "package.json" ] && command -v pnpm &> /dev/null; then
  echo "Ensuring frontend dependencies are installed..."
  pnpm install
  echo "Starting frontend service in the foreground..."
  echo "Frontend will be available at http://localhost:${FRONTEND_PORT}"
  echo "Press CTRL+C to stop all services."
  # Run frontend in the foreground. When this exits (e.g., Ctrl+C), the script's EXIT trap will run.
  pnpm run dev
else
  echo "ERROR: Cannot start frontend. package.json or pnpm not found in ${PROJECT_ROOT}/frontend." >&2
  # If frontend fails to start, we should also stop the backend
  # The trap will handle this when the script exits due to 'set -e'
  exit 1
fi

# The script will wait here until `pnpm run dev` is terminated.
# The 'trap cleanup EXIT SIGINT SIGTERM' will then handle shutting down the backend.
echo "Frontend service stopped. Script will now exit and trigger cleanup." 