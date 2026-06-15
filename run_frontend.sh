#!/bin/bash

echo ">>> Running Frontend..."

if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

export $(grep -v '^#' .env | xargs)
export VITE_ENV=local

cd frontend

npm run dev
