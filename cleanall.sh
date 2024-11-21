#!/bin/bash

# Docker konteynerlerini durdur ve sil
echo "Stopping and removing all Docker containers..."
docker-compose down --volumes --remove-orphans

# Kullanılmayan ağları sil
echo "Removing unused Docker networks..."
docker network prune -f

# Kullanılmayan veri hacimlerini sil
echo "Removing unused Docker volumes..."
docker volume prune -f

# Tüm kullanılmayan Docker görüntülerini sil
echo "Removing unused Docker images..."
docker image prune -a -f


