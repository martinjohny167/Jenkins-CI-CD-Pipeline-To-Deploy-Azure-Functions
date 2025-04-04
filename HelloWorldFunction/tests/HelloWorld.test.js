const { mock } = require('jest-mock');

// Mock the Azure Functions context and request
const createMockContext = () => {
  return {
    log: jest.fn(),
    res: {}
  };
};

// Mock the request object
const createMockRequest = (url = 'http://example.com/api/HelloWorld') => {
  return {
    url: url,
    query: new Map(),
    text: jest.fn().mockResolvedValue('')
  };
};

// Import the function module to test
const functionModule = require('../../../HelloWorldFunction/src/functions/HelloWorld');

// Extract the handler function for testing
const { app } = require('@azure/functions');
const handler = app.http.mock.calls[0][1].handler;

describe('HelloWorld HTTP function', () => {
  test('Returns status code 200 response', async () => {
    // Arrange
    const context = createMockContext();
    const request = createMockRequest();
    
    // Act
    const result = await handler(request, context);
    
    // Assert
    expect(result.status).toBe(200);
  });

  test('Returns "Hello, World!" message in response body', async () => {
    // Arrange
    const context = createMockContext();
    const request = createMockRequest();
    
    // Act
    const result = await handler(request, context);
    
    // Assert
    expect(result.body).toBe('Hello, World!');
  });

  test('Logs the request URL', async () => {
    // Arrange
    const context = createMockContext();
    const request = createMockRequest('http://test-url.com/api/HelloWorld');
    
    // Act
    await handler(request, context);
    
    // Assert
    expect(context.log).toHaveBeenCalledWith(
      expect.stringContaining('http://test-url.com/api/HelloWorld')
    );
  });
}); 