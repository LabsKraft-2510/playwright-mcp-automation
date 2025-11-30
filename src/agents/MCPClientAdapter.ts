import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * MCPClientAdapter: Integrates Claude's MCP capabilities for test generation
 */
export class MCPClientAdapter {
  private client: AxiosInstance;
  private modelEndpoint: string = 'https://api.anthropic.com/v1/messages';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.client = axios.create({
      baseURL: this.modelEndpoint,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
    });
  }

  /**
   * Generate test cases using Claude
   */
  async generateTestCases(
    featureDescription: string,
    testFramework: string = 'playwright',
    count: number = 5
  ): Promise<string> {
    const prompt = `
You are an expert QA automation engineer. Generate ${count} comprehensive test cases for the following feature:

Feature: ${featureDescription}

Requirements:
1. Each test case should be clear and testable
2. Include preconditions, test steps, and expected results
3. Cover positive, negative, and edge cases
4. Format as JSON array with the following structure:
{
  "id": "TC_001",
  "title": "Test title",
  "description": "Test description",
  "preconditions": ["condition1", "condition2"],
  "steps": ["step1", "step2"],
  "expectedResults": ["result1", "result2"],
  "testType": "functional|negative|edge",
  "priority": "high|medium|low",
  "tags": ["tag1", "tag2"]
}

Framework: ${testFramework}
`;

    try {
      const response = await this.client.post('', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.data.content[0].text;
      return content;
    } catch (error) {
      console.error('Error generating test cases:', error);
      throw error;
    }
  }

  /**
   * Generate POM page class code
   */
  async generatePageObject(
    pageDescription: string,
    elements: Record<string, string>
  ): Promise<string> {
    const elementsJson = JSON.stringify(elements, null, 2);

    const prompt = `
You are an expert TypeScript developer. Generate a Page Object Model (POM) class for the following page:

Page: ${pageDescription}

Elements to interact with:
${elementsJson}

Requirements:
1. Extend from BasePage class
2. Use Playwright locators
3. Create methods for each element interaction
4. Include proper TypeScript types
5. Add JSDoc comments
6. Follow POM best practices

Return only the TypeScript code.
`;

    try {
      const response = await this.client.post('', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.data.content[0].text;
      return content;
    } catch (error) {
      console.error('Error generating page object:', error);
      throw error;
    }
  }

  /**
   * Generate test implementation code
   */
  async generateTestImplementation(
    testCase: string,
    pageObjects: string[]
  ): Promise<string> {
    const prompt = `
You are an expert Playwright test automation engineer. Generate a test implementation for:

Test Case: ${testCase}

Available Page Objects: ${pageObjects.join(', ')}

Requirements:
1. Use Playwright test syntax
2. Import and use the provided page objects
3. Use data-driven approach with TestDataFactory
4. Include proper assertions
5. Add error handling
6. Include JSDoc comments
7. Use async/await properly

Return only the TypeScript test code.
`;

    try {
      const response = await this.client.post('', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.data.content[0].text;
      return content;
    } catch (error) {
      console.error('Error generating test implementation:', error);
      throw error;
    }
  }

  /**
   * Analyze web content for test automation
   */
  async analyzeWebContent(
    htmlContent: string,
    analysisType: 'elements' | 'flows' | 'testscenarios' = 'elements'
  ): Promise<string> {
    const analysisPrompts: Record<string, string> = {
      elements: `Analyze the following HTML and extract all interactive elements with their selectors and types. Return as JSON.`,
      flows: `Analyze the following HTML and identify user interaction flows. Return as JSON with flow steps.`,
      testscenarios: `Analyze the following HTML and suggest comprehensive test scenarios. Return as JSON array.`,
    };

    const prompt = `
${analysisPrompts[analysisType]}

HTML Content:
\`\`\`html
${htmlContent.substring(0, 5000)}
\`\`\`

Return ONLY valid JSON with no additional text.
`;

    try {
      const response = await this.client.post('', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.data.content[0].text;
      return content;
    } catch (error) {
      console.error('Error analyzing web content:', error);
      throw error;
    }
  }
}

export default MCPClientAdapter;
