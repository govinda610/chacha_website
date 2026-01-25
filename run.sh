#!/bin/bash

# DentSupply Development Runner
# Starts both Backend and Frontend

# 1. Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "uvicorn" || true
pkill -f "next" || true

# 2. Extract root path
ROOT_DIR=$(pwd)

# 3. Start Backend
echo "🚀 Starting Backend (FastAPI)..."
export PYTHONPATH=$ROOT_DIR/backend
$ROOT_DIR/venv/bin/uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend
echo "🚀 Starting Frontend (Next.js)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "✨ Services started!"
echo "🔗 Backend: http://localhost:8000"
echo "🔗 Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all services."

# Wait for both
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
