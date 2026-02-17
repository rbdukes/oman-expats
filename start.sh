#!/bin/sh
set -e

echo "Starting Oman Expat..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Push database schema
echo "Initializing database schema..."
npx prisma db push --skip-generate

# Call init endpoint to seed data (runs in background and waits for server)
echo "Starting server..."
node server.js &

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

# Initialize database data
echo "Initializing database data..."
wget -q -O - http://localhost:3000/api/init || echo "Init completed or already initialized"

# Wait for the server process
wait
