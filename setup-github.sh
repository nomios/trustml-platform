#!/bin/bash

# TrustML Platform GitHub Setup Script

echo "🚀 Setting up TrustML Platform on GitHub..."

# Check if repository name is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-github.sh <repository-name>"
    echo "Example: ./setup-github.sh trustml-platform"
    exit 1
fi

REPO_NAME=$1

echo "📝 Creating GitHub repository: $REPO_NAME"

# Create GitHub repository using GitHub CLI (if available)
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI to create repository..."
    gh repo create $REPO_NAME --public --description "AI-powered fraud detection and trust management platform" --source=. --remote=origin --push
else
    echo "GitHub CLI not found. Please create the repository manually:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: AI-powered fraud detection and trust management platform"
    echo "4. Make it public"
    echo "5. Don't initialize with README (we already have one)"
    echo ""
    echo "Then run these commands:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 Your TrustML Platform is ready!"
echo "📖 Check out the README.md for getting started instructions"
echo "🐳 Run 'docker-compose up -d' to start the platform"
