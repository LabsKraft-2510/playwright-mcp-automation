#!/usr/bin/env python3

"""
MCP Server Configuration Checker
Validates that all MCP servers are properly configured for Claude Desktop integration
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

class MCPVerifier:
    def __init__(self):
        self.project_root = Path.cwd()
        self.errors = []
        self.warnings = []
        self.success = []
    
    def check_claude_desktop_config(self) -> bool:
        """Check if Claude Desktop config file exists and is valid"""
        config_path = self.project_root / "claude_desktop_config.json"
        
        if not config_path.exists():
            self.warnings.append(f"Claude Desktop config not found at {config_path}")
            self.warnings.append("  → Copy this file to your Claude Desktop config directory")
            self.warnings.append("  → See CLAUDE_DESKTOP_SETUP.md for location on your OS")
            return False
        
        try:
            with open(config_path) as f:
                config = json.load(f)
            
            self.success.append(f"✓ Claude Desktop config found and valid JSON")
            
            # Check for MCP servers
            if 'mcpServers' not in config:
                self.errors.append("  ✗ No 'mcpServers' key in claude_desktop_config.json")
                return False
            
            servers = config['mcpServers']
            required_servers = ['playwright', 'excel', 'rest-api', 'filesystem']
            found_servers = list(servers.keys())
            
            for server in required_servers:
                if server in servers:
                    self.success.append(f"  ✓ MCP Server configured: {server}")
                else:
                    self.errors.append(f"  ✗ Missing MCP server: {server}")
            
            return len(self.errors) == 0
        
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in claude_desktop_config.json: {e}")
            return False
        except Exception as e:
            self.errors.append(f"Error reading claude_desktop_config.json: {e}")
            return False
    
    def check_vscode_config(self) -> bool:
        """Check if VS Code MCP config exists and is valid"""
        config_path = self.project_root / ".vscode" / "mcp.json"
        
        if not config_path.exists():
            self.warnings.append(f"VS Code MCP config not found at {config_path}")
            return False
        
        try:
            with open(config_path) as f:
                config = json.load(f)
            
            self.success.append(f"✓ VS Code MCP config found and valid JSON")
            return True
        except Exception as e:
            self.errors.append(f"Error reading .vscode/mcp.json: {e}")
            return False
    
    def check_playwright_config(self) -> bool:
        """Check if playwright.config.ts exists"""
        config_path = self.project_root / "playwright.config.ts"
        
        if config_path.exists():
            self.success.append("✓ playwright.config.ts found")
            
            # Check for BASE_URL support
            with open(config_path) as f:
                content = f.read()
                if 'process.env.BASE_URL' in content or 'BASE_URL' in content:
                    self.success.append("  ✓ BASE_URL environment variable support enabled")
                else:
                    self.warnings.append("  ⚠ BASE_URL environment variable not found in config")
            
            return True
        else:
            self.errors.append("playwright.config.ts not found")
            return False
    
    def check_project_structure(self) -> bool:
        """Check if all required directories exist"""
        required_dirs = [
            'src/core',
            'src/pages',
            'src/data',
            'src/agents',
            'tests',
            'tests/data',
            'scripts'
        ]
        
        all_exist = True
        for dir_path in required_dirs:
            full_path = self.project_root / dir_path
            if full_path.exists():
                self.success.append(f"✓ Directory exists: {dir_path}/")
            else:
                self.errors.append(f"Missing directory: {dir_path}/")
                all_exist = False
        
        return all_exist
    
    def check_package_json(self) -> bool:
        """Check if package.json has required scripts"""
        pkg_path = self.project_root / "package.json"
        
        if not pkg_path.exists():
            self.errors.append("package.json not found")
            return False
        
        try:
            with open(pkg_path) as f:
                pkg = json.load(f)
            
            self.success.append("✓ package.json found")
            
            required_scripts = [
                'test',
                'generate:data',
                'generate:framework'
            ]
            
            scripts = pkg.get('scripts', {})
            for script in required_scripts:
                if script in scripts:
                    self.success.append(f"  ✓ npm script '{script}' defined")
                else:
                    self.warnings.append(f"  ⚠ npm script '{script}' not found")
            
            return True
        except Exception as e:
            self.errors.append(f"Error reading package.json: {e}")
            return False
    
    def check_environment(self) -> bool:
        """Check for required environment variables"""
        env_file = self.project_root / ".env"
        env_example = self.project_root / ".env.example"
        
        if env_file.exists():
            self.success.append("✓ .env file exists")
            
            with open(env_file) as f:
                content = f.read()
                if 'ANTHROPIC_API_KEY' in content:
                    if 'ANTHROPIC_API_KEY=' in content and not content.split('ANTHROPIC_API_KEY=')[1].split('\n')[0].strip().startswith('sk-'):
                        self.warnings.append("  ⚠ ANTHROPIC_API_KEY not set (required for AI test generation)")
                    else:
                        self.success.append("  ✓ ANTHROPIC_API_KEY configured")
            
            return True
        elif env_example.exists():
            self.warnings.append("⚠ .env file not found, but .env.example exists")
            self.warnings.append("  → Copy .env.example to .env and add your credentials")
            return True
        else:
            self.warnings.append("⚠ No .env or .env.example file found")
            return False
    
    def run_checks(self):
        """Run all verification checks"""
        print("\n" + "="*70)
        print("  🔍 MCP SERVER CONFIGURATION VERIFICATION")
        print("="*70 + "\n")
        
        print("Checking configuration files...")
        self.check_claude_desktop_config()
        self.check_vscode_config()
        self.check_playwright_config()
        print()
        
        print("Checking project structure...")
        self.check_project_structure()
        print()
        
        print("Checking build and runtime configuration...")
        self.check_package_json()
        self.check_environment()
        print()
        
        # Print results
        print("="*70)
        print("  RESULTS")
        print("="*70 + "\n")
        
        if self.success:
            print("✅ SUCCESSFUL CHECKS:")
            for msg in self.success:
                print(f"   {msg}")
            print()
        
        if self.warnings:
            print("⚠️  WARNINGS:")
            for msg in self.warnings:
                print(f"   {msg}")
            print()
        
        if self.errors:
            print("❌ ERRORS:")
            for msg in self.errors:
                print(f"   {msg}")
            print()
        
        # Summary
        print("="*70)
        if not self.errors:
            print("✅ ALL CHECKS PASSED - Ready for MCP integration!")
            print("\n📖 Next Steps:")
            print("   1. Read CLAUDE_DESKTOP_SETUP.md for Claude Desktop integration")
            print("   2. Copy claude_desktop_config.json to Claude's config directory")
            print("   3. Restart Claude Desktop")
            print("   4. Start using MCP servers with @playwright, @excel, etc.")
            print("\n📝 Available npm scripts:")
            print("   • npm test                  - Run tests")
            print("   • npm run generate:data     - Generate test data Excel files")
            print("   • npm run generate:framework - Generate tests from AI")
        else:
            print(f"❌ {len(self.errors)} ERRORS FOUND - Please fix before proceeding")
            sys.exit(1)
        
        print("="*70 + "\n")


if __name__ == "__main__":
    verifier = MCPVerifier()
    verifier.run_checks()
