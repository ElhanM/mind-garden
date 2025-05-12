#!/bin/bash

# Build new images
docker build -t mind-garden-backend:latest ./backend -f ./backend/Dockerfile
docker build -t mind-garden-frontend:latest ./frontend -f ./frontend/Dockerfile

# Tag images for Docker Hub
docker tag mind-garden-backend:latest elhanm/mind-garden-backend:latest
docker tag mind-garden-frontend:latest elhanm/mind-garden-frontend:latest

# Push images to Docker Hub
docker push elhanm/mind-garden-backend:latest
docker push elhanm/mind-garden-frontend:latest

echo "Images built and pushed successfully!"