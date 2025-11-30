import { test, expect } from '@playwright/test';
import { ApiDataProvider } from '../src/ApiDataProvider';

// This test suite exercises public API at https://reqres.in/
// Data-driven from tests/data/api_testcases.xlsx

const testCases = ApiDataProvider.readExcel('tests/data/api_testcases.xlsx', 'Sheet1');

for (const tc of testCases) {
  test(`${tc.id} - ${tc.description}`, async ({ request }) => {
    const method = (tc.method || 'GET').toUpperCase();
    const endpoint = tc.endpoint;
    let response;

    if (method === 'GET') {
      response = await request.get(endpoint);
    } else if (method === 'POST') {
      response = await request.post(endpoint, { data: tc.body ? JSON.parse(tc.body) : {} });
    } else if (method === 'PUT') {
      response = await request.put(endpoint, { data: tc.body ? JSON.parse(tc.body) : {} });
    } else if (method === 'DELETE') {
      response = await request.delete(endpoint);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    expect(response.status()).toBe(Number(tc.expectedStatus));
  });
}

test.describe('API - misc checks', () => {
  test('Health check: jsonplaceholder posts', async ({ request }) => {
    // Health check for jsonplaceholder
    const r = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(r.status()).toBe(200);
  });
});
