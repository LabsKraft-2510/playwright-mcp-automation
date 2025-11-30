/**
 * TestDataBuilder: Fluent API for building test data
 */
export class TestDataBuilder {
  private data: Record<string, any> = {};

  /**
   * Set a property
   */
  set(key: string, value: any): this {
    this.data[key] = value;
    return this;
  }

  /**
   * Set multiple properties
   */
  setMultiple(props: Record<string, any>): this {
    this.data = { ...this.data, ...props };
    return this;
  }

  /**
   * Build the test data object
   */
  build(): Record<string, any> {
    return { ...this.data };
  }

  /**
   * Clear all data
   */
  clear(): this {
    this.data = {};
    return this;
  }

  /**
   * Clone current builder
   */
  clone(): TestDataBuilder {
    const cloned = new TestDataBuilder();
    cloned.data = { ...this.data };
    return cloned;
  }
}

/**
 * Factory functions for common test data
 */
export class TestDataFactory {
  /**
   * Create user test data
   */
  static createUser(overrides?: Partial<any>): any {
    return new TestDataBuilder()
      .setMultiple({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test@1234',
        role: 'user',
        ...overrides,
      })
      .build();
  }

  /**
   * Create admin user test data
   */
  static createAdmin(overrides?: Partial<any>): any {
    return new TestDataBuilder()
      .setMultiple({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'Admin@1234',
        role: 'admin',
        ...overrides,
      })
      .build();
  }

  /**
   * Create product test data
   */
  static createProduct(overrides?: Partial<any>): any {
    return new TestDataBuilder()
      .setMultiple({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        quantity: 10,
        sku: 'TEST-SKU-001',
        ...overrides,
      })
      .build();
  }

  /**
   * Create order test data
   */
  static createOrder(overrides?: Partial<any>): any {
    return new TestDataBuilder()
      .setMultiple({
        orderId: `ORD-${Date.now()}`,
        customerId: 'CUST-001',
        items: [],
        totalAmount: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...overrides,
      })
      .build();
  }
}
