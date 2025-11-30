import { Page } from '@playwright/test';
import MCPClientAdapter from './MCPClientAdapter';
import { DataProvider } from '../data/DataProvider';
import fs from 'fs';
import path from 'path';

/**
 * TestGeneratorAgent: AI-powered test case and framework generation
 */
export class TestGeneratorAgent {
  private mcpAdapter: MCPClientAdapter;
  private dataProvider: DataProvider;
  private outputDir: string = './src/pages';

  constructor(apiKey?: string, dataOutputDir?: string) {
    this.mcpAdapter = new MCPClientAdapter(apiKey);
    this.dataProvider = new DataProvider(dataOutputDir);
  }

  /**
   * Generate complete test framework from feature description
   */
  async generateFrameworkFromFeature(
    featureName: string,
    featureDescription: string
  ): Promise<void> {
    console.log(`\n📝 Generating test framework for: ${featureName}`);

    // Step 1: Generate test cases
    console.log('1️⃣ Generating test cases...');
    const testCasesJson = await this.mcpAdapter.generateTestCases(
      featureDescription,
      'playwright',
      5
    );

    const testCases = JSON.parse(this.extractJson(testCasesJson));
    console.log(`✅ Generated ${testCases.length} test cases`);

    // Step 2: Save test cases to Excel
    console.log('2️⃣ Saving test cases to Excel...');
    await this.dataProvider.writeExcel(
      `${featureName}_testcases.xlsx`,
      testCases,
      'TestCases'
    );
    console.log(`✅ Test cases saved to tests/data/${featureName}_testcases.xlsx`);

    // Step 3: Generate test data template
    console.log('3️⃣ Creating test data template...');
    const testDataColumns = [
      'testCaseId',
      'testData',
      'expectedResult',
      'status',
      'executionDate',
    ];
    await this.dataProvider.createTestDataTemplate(
      `${featureName}_testdata.xlsx`,
      testDataColumns,
      'TestData'
    );
    console.log(`✅ Test data template created`);

    console.log(`\n✨ Framework generation complete!`);
    console.log(`Generated files:`);
    console.log(`  - tests/data/${featureName}_testcases.xlsx`);
    console.log(`  - tests/data/${featureName}_testdata.xlsx`);
  }

  /**
   * Generate Page Object from web content
   */
  async generatePageObjectFromWeb(
    pageName: string,
    htmlContent: string
  ): Promise<void> {
    console.log(`\n📄 Generating Page Object for: ${pageName}`);

    // Step 1: Analyze web content
    console.log('1️⃣ Analyzing web elements...');
    const elementsJson = await this.mcpAdapter.analyzeWebContent(
      htmlContent,
      'elements'
    );
    const elements = JSON.parse(this.extractJson(elementsJson));
    console.log(`✅ Found ${Object.keys(elements).length} elements`);

    // Step 2: Generate POM class
    console.log('2️⃣ Generating Page Object code...');
    const pomCode = await this.mcpAdapter.generatePageObject(pageName, elements);

    // Step 3: Save POM class
    const fileName = `${pageName}.ts`;
    const filePath = path.join(this.outputDir, fileName);
    fs.writeFileSync(filePath, pomCode);
    console.log(`✅ Page Object saved to src/pages/${fileName}`);

    console.log(`\n✨ Page Object generation complete!`);
  }

  /**
   * Generate test implementation from test case
   */
  async generateTestFromCase(
    testCaseDescription: string,
    availablePageObjects: string[]
  ): Promise<string> {
    console.log(`\n🧪 Generating test implementation...`);

    const testCode = await this.mcpAdapter.generateTestImplementation(
      testCaseDescription,
      availablePageObjects
    );

    return testCode;
  }

  /**
   * Generate complete test suite from web page
   */
  async generateCompleteTestSuite(
    featureName: string,
    pageUrl: string,
    page?: Page
  ): Promise<void> {
    console.log(`\n🚀 Generating complete test suite for: ${featureName}`);

    // If page provided, get actual HTML
    let htmlContent = '';
    if (page) {
      htmlContent = await page.content();
    }

    // Step 1: Analyze page and generate test scenarios
    console.log('1️⃣ Analyzing page content...');
    const scenariosJson = await this.mcpAdapter.analyzeWebContent(
      htmlContent,
      'testscenarios'
    );
    const scenarios = JSON.parse(this.extractJson(scenariosJson));
    console.log(`✅ Identified ${scenarios.length} test scenarios`);

    // Step 2: Generate comprehensive test cases
    console.log('2️⃣ Generating test cases...');
    const testCasesJson = await this.mcpAdapter.generateTestCases(
      scenarios.join(', '),
      'playwright',
      scenarios.length * 2
    );
    const testCases = JSON.parse(this.extractJson(testCasesJson));

    // Step 3: Save to Excel
    console.log('3️⃣ Saving to Excel...');
    await this.dataProvider.writeExcel(
      `${featureName}_complete_testcases.xlsx`,
      testCases,
      'TestCases'
    );

    // Step 4: Generate Page Object
    if (htmlContent) {
      console.log('4️⃣ Generating Page Object...');
      await this.generatePageObjectFromWeb(`${featureName}Page`, htmlContent);
    }

    console.log(`\n✨ Complete test suite generation finished!`);
  }

  /**
   * Extract JSON from markdown-formatted response
   */
  private extractJson(text: string): string {
    // Try to find JSON in code blocks
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      return jsonMatch[1];
    }

    // Try to find JSON array or object
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }

    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0];
    }

    return text;
  }
}

export default TestGeneratorAgent;
