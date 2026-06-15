#!/bin/bash

echo ">>> Running Backend..."

if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

export $(grep -v '^#' .env | xargs)
export SPRING_PROFILES_ACTIVE=local
export DB_URL=jdbc:postgresql://localhost:5432/passplz

cd backend
echo ">>> Ensure database is running"

mvn spring-boot:run -DskipTests
