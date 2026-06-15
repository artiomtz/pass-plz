#!/bin/bash

echo ">>> Running Backend Tests..."

if [ ! -f "../.env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

echo ">>> Loading environment variables..."
export $(grep -v '^#' ../.env | xargs)
export SPRING_PROFILES_ACTIVE=test

echo ">>> Running Maven tests..."
mvn clean test

if [ $? -eq 0 ]; then
    echo ">>> All backend tests passed successfully"
else
    echo "Error: Some backend tests failed"
    exit 1
fi
