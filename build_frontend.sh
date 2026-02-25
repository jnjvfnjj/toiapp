#!/bin/bash
echo "Building React frontend..."
cd templates
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Building application..."
npm run build
echo "Build complete!"
cd ..
