#!/bin/bash

# Claude Desktop MCP Configuration Setup Script
# Automatically copies MCP config and restarts Claude

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Claude Desktop MCP Configuration Setup${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Detect OS
OS_TYPE=$(uname -s)

echo "Detected OS: $OS_TYPE"
echo ""

# Set config directory based on OS
case "$OS_TYPE" in
    Darwin)
        CONFIG_DIR="$HOME/Library/Application Support/Claude"
        OS_NAME="macOS"
        ;;
    Linux)
        CONFIG_DIR="$HOME/.config/Claude"
        OS_NAME="Linux"
        ;;
    MINGW*|MSYS*|CYGWIN*)
        CONFIG_DIR="$APPDATA/Claude"
        OS_NAME="Windows"
        ;;
    *)
        echo -e "${RED}❌ Unsupported OS: $OS_TYPE${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}Configuration Details:${NC}"
echo "  OS: $OS_NAME"
echo "  Config Directory: $CONFIG_DIR"
echo ""

# Check if Claude Desktop config directory exists
if [ ! -d "$CONFIG_DIR" ]; then
    echo -e "${YELLOW}⚠️  Claude Desktop config directory not found${NC}"
    echo ""
    echo "Please first:"
    echo "  1. Install Claude Desktop from https://claude.ai/"
    echo "  2. Launch Claude Desktop at least once"
    echo "  3. Close Claude Desktop"
    echo "  4. Run this script again"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Claude Desktop config directory found${NC}"
echo ""

# Check if source config file exists
SOURCE_CONFIG="claude_desktop_config.json"
if [ ! -f "$SOURCE_CONFIG" ]; then
    echo -e "${RED}❌ Error: $SOURCE_CONFIG not found in current directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✓ Source config file found: $SOURCE_CONFIG${NC}"
echo ""

# Backup existing config if it exists
DEST_CONFIG="$CONFIG_DIR/claude_desktop_config.json"
if [ -f "$DEST_CONFIG" ]; then
    BACKUP_FILE="$CONFIG_DIR/claude_desktop_config.json.backup.$(date +%s)"
    echo "Backing up existing config to: $BACKUP_FILE"
    cp "$DEST_CONFIG" "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup created${NC}"
    echo ""
fi

# Copy config file
echo "Copying configuration file..."
cp "$SOURCE_CONFIG" "$DEST_CONFIG"

# Verify copy
if [ -f "$DEST_CONFIG" ]; then
    echo -e "${GREEN}✓ Configuration file copied successfully${NC}"
    echo "  From: $SOURCE_CONFIG"
    echo "  To: $DEST_CONFIG"
else
    echo -e "${RED}❌ Failed to copy configuration file${NC}"
    exit 1
fi

echo ""

# Validate JSON
echo "Validating JSON configuration..."
if python3 -m json.tool "$DEST_CONFIG" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Configuration file is valid JSON${NC}"
else
    echo -e "${RED}❌ Configuration file has invalid JSON${NC}"
    echo "Restoring backup..."
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" "$DEST_CONFIG"
    fi
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ CONFIGURATION COMPLETE!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Next steps:"
echo ""
echo "1. 🔄 RESTART CLAUDE DESKTOP"
echo ""
echo "   macOS/Windows: Close Claude and reopen it"
echo "   Linux: Open https://claude.ai in your browser"
echo ""
echo "2. ✅ VERIFY MCP SERVERS"
echo ""
echo "   In Claude, ask:"
echo "   '@playwright what is playwright?'"
echo ""
echo "3. 🧪 TEST MCP FUNCTIONALITY"
echo ""
echo "   Try these prompts:"
echo "   - '@filesystem List the tests directory'"
echo "   - '@excel Create a test data file'"
echo "   - '@rest-api Test a GET request'"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Offer to show config content
read -p "Would you like to verify the config file content? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Configuration Content:${NC}"
    echo "──────────────────────────────────────────────────────────────"
    python3 -m json.tool "$DEST_CONFIG"
    echo "──────────────────────────────────────────────────────────────"
    echo ""
fi

echo -e "${GREEN}Setup complete! ✨${NC}"
echo ""
