#!/bin/bash

# Claude Desktop MCP Integration Helper
# Quick commands for MCP setup and testing

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_menu() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}      🚀 MCP Integration Helper${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "1️⃣  Verify MCP Configuration"
    echo "2️⃣  Show MCP Config Location for Your OS"
    echo "3️⃣  Validate JSON Config Files"
    echo "4️⃣  Run Tests"
    echo "5️⃣  Generate Test Data"
    echo "6️⃣  Generate AI Tests (requires ANTHROPIC_API_KEY)"
    echo "7️⃣  Show Available npm Scripts"
    echo "8️⃣  Open MCP Quick Start Guide"
    echo "9️⃣  Detect Operating System"
    echo ""
    echo "0️⃣  Exit"
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
}

verify_config() {
    echo ""
    echo -e "${BLUE}Running verification...${NC}"
    python3 scripts/verify-config.py
}

show_config_location() {
    echo ""
    echo -e "${BLUE}Claude Desktop Config Location${NC}"
    echo "==============================="
    echo ""
    
    OS_NAME=$(uname -s)
    
    case "$OS_NAME" in
        Darwin)
            echo -e "${GREEN}macOS:${NC}"
            echo "Location: ~/Library/Application Support/Claude/"
            echo ""
            echo "Copy command:"
            echo "  cp claude_desktop_config.json ~/Library/Application\\ Support/Claude/"
            echo ""
            ;;
        Linux)
            echo -e "${GREEN}Linux:${NC}"
            echo "Location: ~/.config/Claude/"
            echo ""
            echo "Copy command:"
            echo "  cp claude_desktop_config.json ~/.config/Claude/"
            echo ""
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo -e "${GREEN}Windows:${NC}"
            echo "Location: %APPDATA%\\Claude\\"
            echo ""
            echo "Copy command (PowerShell):"
            echo "  Copy-Item -Path \"claude_desktop_config.json\" -Destination \"\$env:APPDATA\\Claude\\\""
            echo ""
            ;;
        *)
            echo -e "${YELLOW}Unknown OS: $OS_NAME${NC}"
            ;;
    esac
}

validate_json() {
    echo ""
    echo -e "${BLUE}Validating JSON Configuration Files${NC}"
    echo "===================================="
    echo ""
    
    files=("claude_desktop_config.json" ".vscode/mcp.json")
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -n "Checking $file... "
            if python3 -m json.tool "$file" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Valid JSON${NC}"
            else
                echo -e "${RED}❌ Invalid JSON${NC}"
                python3 -m json.tool "$file" 2>&1 | head -5
            fi
        else
            echo -e "${YELLOW}⚠️  $file not found${NC}"
        fi
    done
    echo ""
}

run_tests() {
    echo ""
    echo -e "${BLUE}Running Playwright Tests${NC}"
    echo "========================="
    echo ""
    npm test
}

generate_data() {
    echo ""
    echo -e "${BLUE}Generating Test Data${NC}"
    echo "===================="
    echo ""
    echo "This will create Excel files in tests/data/:"
    echo "  - login_testcases.xlsx"
    echo "  - login_testdata.xlsx"
    echo "  - product_testdata.xlsx"
    echo ""
    npm run generate:data
    echo ""
    echo -e "${GREEN}✅ Test data generated successfully!${NC}"
}

generate_ai_tests() {
    echo ""
    echo -e "${BLUE}Generating Tests with AI${NC}"
    echo "======================="
    echo ""
    
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not set${NC}"
        echo ""
        echo "Set your API key first:"
        echo "  export ANTHROPIC_API_KEY='sk-ant-xxxxx'"
        echo ""
        echo "Or add to .env file:"
        echo "  ANTHROPIC_API_KEY=sk-ant-xxxxx"
        echo ""
        return
    fi
    
    echo -e "${GREEN}ANTHROPIC_API_KEY is set${NC}"
    echo ""
    npm run generate:framework
}

show_scripts() {
    echo ""
    echo -e "${BLUE}Available npm Scripts${NC}"
    echo "===================="
    echo ""
    npm run 2>&1 | grep "^\s*" | grep -v "^npm\|^Use\|^available\|^ERR" || true
    echo ""
}

show_guide() {
    echo ""
    echo -e "${BLUE}Opening MCP Quick Start Guide${NC}"
    echo "=============================="
    echo ""
    
    if [ -f "MCP_QUICK_START.md" ]; then
        if command -v less &> /dev/null; then
            less MCP_QUICK_START.md
        else
            cat MCP_QUICK_START.md | head -100
            echo ""
            echo "... (view full file with: cat MCP_QUICK_START.md)"
        fi
    else
        echo -e "${RED}MCP_QUICK_START.md not found${NC}"
    fi
}

detect_os() {
    echo ""
    echo -e "${BLUE}Operating System Detection${NC}"
    echo "=========================="
    echo ""
    
    OS_NAME=$(uname -s)
    OS_VERSION=$(uname -r)
    ARCH=$(uname -m)
    
    echo "System: $OS_NAME"
    echo "Version: $OS_VERSION"
    echo "Architecture: $ARCH"
    echo ""
    
    case "$OS_NAME" in
        Darwin)
            echo -e "${GREEN}✅ macOS detected${NC}"
            echo "Claude config: ~/Library/Application Support/Claude/"
            ;;
        Linux)
            echo -e "${GREEN}✅ Linux detected${NC}"
            echo "Claude config: ~/.config/Claude/"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo -e "${GREEN}✅ Windows detected${NC}"
            echo "Claude config: %APPDATA%\\Claude\\"
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown OS: $OS_NAME${NC}"
            ;;
    esac
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Select option (0-9): " choice
    
    case $choice in
        1)
            verify_config
            ;;
        2)
            show_config_location
            ;;
        3)
            validate_json
            ;;
        4)
            run_tests
            ;;
        5)
            generate_data
            ;;
        6)
            generate_ai_tests
            ;;
        7)
            show_scripts
            ;;
        8)
            show_guide
            ;;
        9)
            detect_os
            ;;
        0)
            echo ""
            echo -e "${GREEN}Goodbye! 👋${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
