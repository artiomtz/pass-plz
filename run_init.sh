#!/bin/bash

check_exists() {
    local cmd=$1
    local name=$2
    
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: $name is not installed or not on PATH"
        exit 1
    fi
}

echo ">>> Initializing Pass Plz..."
echo ">>> Checking system dependencies..."

check_exists java "Java (JDK)"
check_exists mvn "Maven"
check_exists node "Node.js"
check_exists npm "npm"

echo ">>> All required commands are available"
echo ">>> Loading environment variables..."

if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

export $(grep -v '^#' .env | xargs)
REQUIRED_VARS=("DB_USERNAME" "DB_PASSWORD" "DB_URL")

for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "Error: Required environment variable '$VAR' is not set"
        exit 1
    fi
done

echo ">>> Environment variables validated"
echo ">>> Initializing backend..."

cd backend
echo ">>> Cleaning and packaging backend..."

mvn clean package -DskipTests=true
if [ $? -ne 0 ]; then
    echo "Error: Backend Maven build failed"
    exit 1
fi

echo ">>> Backend initialized successfully"

cd ..
echo ">>> Initializing frontend..."

cd frontend
echo ">>> Installing frontend dependencies..."

npm install
if [ $? -ne 0 ]; then
    echo "Error: npm install failed"
    exit 1
fi

echo ">>> Frontend initialized successfully"
cd ..

echo ">>> Initialization complete"
