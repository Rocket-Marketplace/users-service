#!/bin/bash

# Users Service - Deploy Script
echo "🚀 Deploying Users Service..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start
echo "🔨 Building and starting Users Service..."
docker-compose up --build -d

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 15

# Check service health
echo "🏥 Checking service health..."
curl -s http://localhost:3000/health | jq -r '.status' 2>/dev/null || echo 'unhealthy'

echo "✅ Users Service deployed!"
echo "📚 API Documentation: http://localhost:3000/api"
