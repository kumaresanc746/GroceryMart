#!/bin/bash

# Auto-deployment script for EC2 instance startup
# This script runs automatically when EC2 instance starts

set -e

echo "=========================================="
echo "GroceryMart Auto-Deployment Script"
echo "Started at: $(date)"
echo "=========================================="

# Change to application directory
cd /opt/grocery-mart || exit 1

# Pull latest code from repository
echo "Pulling latest code..."
git pull origin main || git pull origin master || echo "Git pull failed, continuing with existing code"

# Login to Docker Hub (if credentials are set)
if [ -n "$DOCKER_HUB_USERNAME" ] && [ -n "$DOCKER_HUB_PASSWORD" ]; then
    echo "Logging into Docker Hub..."
    echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin || echo "Docker Hub login failed"
fi

# Pull latest Docker images
echo "Pulling latest Docker images..."
docker-compose pull || echo "Docker pull failed, using existing images"

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down || echo "No containers to stop"

# Start services
echo "Starting services..."
docker-compose up -d --force-recreate

# Wait for services to be healthy
echo "Waiting for services to be ready..."
sleep 10

# Seed database if needed
cd backend || exit 1
if [ ! -f .seeded ]; then
    echo "Seeding database..."
    if [ -f package.json ]; then
        npm install --silent
        npm run seed || echo "Database seeding failed"
        touch .seeded
    fi
fi

# Health check
echo "Performing health check..."
sleep 5
curl -f http://localhost:3000/health > /dev/null 2>&1 && echo "Backend is healthy" || echo "Backend health check failed"
curl -f http://localhost/ > /dev/null 2>&1 && echo "Frontend is healthy" || echo "Frontend health check failed"

echo "=========================================="
echo "Auto-deployment completed at: $(date)"
echo "=========================================="

# Log deployment
echo "$(date): Auto-deployment completed" >> /var/log/grocery-mart-deploy.log

