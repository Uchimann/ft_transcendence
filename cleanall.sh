#!/bin/bash


echo "Stopping and removing all Docker containers..."
docker-compose down --volumes --remove-orphans

echo "Removing unused Docker networks..."
docker network prune -f

echo "Removing unused Docker volumes..."
docker volume prune -f

echo "Removing unused Docker images..."
docker image prune -a -f


