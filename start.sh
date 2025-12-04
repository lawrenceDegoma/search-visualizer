#!/bin/bash

# Search Result Visualizer - Development Server Starter
# This script starts both the backend API server and frontend development server

echo "Starting Search Result Visualizer..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Cleanup complete"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend server
echo "Starting backend server on http://localhost:3001..."
cd server
node index.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend development server
echo "Starting frontend development server on http://localhost:5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are running!"
echo "   • Backend API: http://localhost:3001"
echo "   • Frontend App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
