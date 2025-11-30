import { DataProvider } from '../src/data/DataProvider';

/**
 * Script to generate sample test data in Excel format
 * Run with: npx ts-node scripts/generate-test-data.ts
 */

async function generateSampleTestData() {
  const dataProvider = new DataProvider('./tests/data');

  // Sample login test cases
  const loginTestCases = [
    {
      id: 'TC_001',
      title: 'Successful login with valid credentials',
      description: 'User should be able to login with correct email and password',
      preconditions: 'User account exists, Browser on login page',
      steps: '1. Enter valid email\n2. Enter valid password\n3. Click login button',
      expectedResults: 'User redirected to dashboard, Welcome message displayed',
      testType: 'Functional',
      priority: 'High',
      tags: 'Login,Authentication,Positive',
      status: 'Pending',
      executionDate: '',
    },
    {
      id: 'TC_002',
      title: 'Login fails with invalid credentials',
      description: 'User should see error message with incorrect password',
      preconditions: 'User account exists, Browser on login page',
      steps: '1. Enter valid email\n2. Enter incorrect password\n3. Click login button',
      expectedResults: 'Error message displayed, User stays on login page',
      testType: 'Negative',
      priority: 'High',
      tags: 'Login,Authentication,Negative',
      status: 'Pending',
      executionDate: '',
    },
    {
      id: 'TC_003',
      title: 'Login fails with empty username',
      description: 'User should see validation error for empty username',
      preconditions: 'Browser on login page',
      steps: '1. Leave username empty\n2. Enter password\n3. Click login button',
      expectedResults: 'Validation error shown below username field',
      testType: 'Negative',
      priority: 'High',
      tags: 'Login,Validation,Edge Case',
      status: 'Pending',
      executionDate: '',
    },
    {
      id: 'TC_004',
      title: 'Login fails with empty password',
      description: 'User should see validation error for empty password',
      preconditions: 'Browser on login page',
      steps: '1. Enter email\n2. Leave password empty\n3. Click login button',
      expectedResults: 'Validation error shown below password field',
      testType: 'Negative',
      priority: 'High',
      tags: 'Login,Validation,Edge Case',
      status: 'Pending',
      executionDate: '',
    },
    {
      id: 'TC_005',
      title: 'Remember me functionality',
      description: 'Remember me checkbox should persist login state',
      preconditions: 'User account exists, Browser on login page',
      steps: '1. Check remember me checkbox\n2. Enter valid credentials\n3. Click login\n4. Close and reopen browser',
      expectedResults: 'User automatically logged in without credentials',
      testType: 'Functional',
      priority: 'Medium',
      tags: 'Login,Persistence,Feature',
      status: 'Pending',
      executionDate: '',
    },
  ];

  // Sample user test data
  const userTestData = [
    {
      testCaseId: 'TC_001',
      username: 'john.doe@example.com',
      password: 'ValidPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'User',
      status: 'Active',
      expectedResult: 'Login successful, Dashboard displayed',
    },
    {
      testCaseId: 'TC_002',
      username: 'john.doe@example.com',
      password: 'WrongPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'User',
      status: 'Active',
      expectedResult: 'Error message: Invalid credentials',
    },
    {
      testCaseId: 'TC_003',
      username: '',
      password: 'SomePassword123!',
      firstName: '',
      lastName: '',
      role: 'User',
      status: 'Inactive',
      expectedResult: 'Validation error: Username required',
    },
    {
      testCaseId: 'TC_004',
      username: 'jane.smith@example.com',
      password: '',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Admin',
      status: 'Active',
      expectedResult: 'Validation error: Password required',
    },
    {
      testCaseId: 'TC_005',
      username: 'admin@example.com',
      password: 'AdminPassword123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      status: 'Active',
      expectedResult: 'Login successful, Admin dashboard displayed',
    },
  ];

  // Sample product test data
  const productTestData = [
    {
      productId: 'PROD_001',
      productName: 'Laptop',
      description: 'High performance laptop',
      price: 999.99,
      quantity: 50,
      category: 'Electronics',
      sku: 'LAPTOP-001',
      status: 'Available',
    },
    {
      productId: 'PROD_002',
      productName: 'Mouse',
      description: 'Wireless mouse',
      price: 29.99,
      quantity: 200,
      category: 'Accessories',
      sku: 'MOUSE-001',
      status: 'Available',
    },
    {
      productId: 'PROD_003',
      productName: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 129.99,
      quantity: 100,
      category: 'Accessories',
      sku: 'KEYBOARD-001',
      status: 'Available',
    },
  ];

  try {
    console.log('📝 Generating sample test data files...\n');

    // Write test cases
    await dataProvider.writeExcel('login_testcases.xlsx', loginTestCases, 'TestCases');
    console.log('✅ Created: tests/data/login_testcases.xlsx');

    // Write user test data
    await dataProvider.writeExcel(
      'login_testdata.xlsx',
      userTestData,
      'UserData'
    );
    console.log('✅ Created: tests/data/login_testdata.xlsx');

    // Write product test data
    await dataProvider.writeExcel(
      'product_testdata.xlsx',
      productTestData,
      'Products'
    );
    console.log('✅ Created: tests/data/product_testdata.xlsx');

    console.log('\n✨ Sample test data generation complete!');
    console.log(
      '\n📊 Files created in tests/data/ directory:'
    );
    console.log('   - login_testcases.xlsx');
    console.log('   - login_testdata.xlsx');
    console.log('   - product_testdata.xlsx');
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  }
}

// Run the script
generateSampleTestData();
