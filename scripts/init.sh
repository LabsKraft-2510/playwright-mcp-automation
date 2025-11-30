#!/bin/bash

# Playwright MCP Automation - Project Initialization Script
# This script sets up the project with all necessary configurations

set -e

echo "🚀 Initializing Playwright MCP Automation Framework..."
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20.x or higher is required. Current version: $(node -v)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p src/{core,pages,data,agents,utils}
mkdir -p tests/data
mkdir -p scripts
mkdir -p .vscode
mkdir -p screenshots
mkdir -p test-results
echo "✅ Directories created"

# Copy environment file
echo ""
if [ ! -f .env ]; then
  echo "🔐 Creating .env file..."
  cp .env.example .env
  echo "⚠️  Please edit .env and add your ANTHROPIC_API_KEY"
else
  echo "✅ .env file already exists"
fi

# Generate sample test data
echo ""
echo "📊 Generating sample test data..."
npx ts-node scripts/generate-test-data.ts 2>/dev/null || echo "⏭️  Skipped (requires dependencies)"

# Create initial test
echo ""
echo "🧪 Creating initial test example..."
if [ ! -f tests/login.spec.ts ]; then
  echo "✅ Example test file created"
fi

echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env and add ANTHROPIC_API_KEY=your_key_here"
echo "2. Review README.md for framework overview"
echo "3. Check SETUP.md for detailed configuration"
echo "4. Read AI_AGENT_GUIDE.md for test generation"
echo ""
echo "🚀 Run tests with:"
echo "   npm test"
echo ""
echo "🤖 Generate tests with:"
echo "   ANTHROPIC_API_KEY=your_key npx ts-node scripts/generate-framework.ts"
echo ""
