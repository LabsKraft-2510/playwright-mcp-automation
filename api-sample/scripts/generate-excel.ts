import { ApiDataProvider } from '../src/ApiDataProvider';

// Sample API test cases for https://jsonplaceholder.typicode.com/ (public test API)
const testCases = [
  {
    id: 'TC_API_001',
    method: 'GET',
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    expectedStatus: 200,
    description: 'List posts'
  },
  {
    id: 'TC_API_002',
    method: 'GET',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    expectedStatus: 200,
    description: 'Get single post'
  },
  {
    id: 'TC_API_003',
    method: 'POST',
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }),
    expectedStatus: 201,
    description: 'Create post'
  }
];

ApiDataProvider.writeExcel('tests/data/api_testcases.xlsx', testCases, 'Sheet1');
console.log('✅ Created tests/data/api_testcases.xlsx for jsonplaceholder');
