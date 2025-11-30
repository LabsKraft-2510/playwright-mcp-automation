import { TestGeneratorAgent } from '../src/agents/TestGeneratorAgent';

/**
 * Script to generate test framework using AI Agent
 * Run with: ANTHROPIC_API_KEY=your_key npx ts-node scripts/generate-framework.ts
 */

async function generateFramework() {
  const agent = new TestGeneratorAgent(
    process.env.ANTHROPIC_API_KEY,
    './tests/data'
  );

  try {
    console.log('🚀 Starting AI-powered test framework generation...\n');

    // Example 1: Generate authentication test framework
    await agent.generateFrameworkFromFeature(
      'authentication',
      `
      Feature: User Authentication
      - User can login with email and password
      - User sees error for invalid credentials
      - User can reset forgotten password
      - User can logout
      - Login page has remember me functionality
      `
    );

    console.log('\n' + '='.repeat(60) + '\n');

    // Example 2: Generate dashboard test framework
    await agent.generateFrameworkFromFeature(
      'dashboard',
      `
      Feature: Dashboard Management
      - Dashboard displays user information
      - User can search for items
      - User can navigate through menu
      - User can view data table with pagination
      - User can export data
      - User can filter results
      `
    );

    console.log('\n' + '='.repeat(60));
    console.log('✨ Framework generation complete!');
    console.log('📁 Check tests/data/ directory for generated files');
  } catch (error) {
    console.error('❌ Error during framework generation:', error);
    process.exit(1);
  }
}

generateFramework();
