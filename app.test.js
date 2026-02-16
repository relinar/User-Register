const createApp = require('./app')
const request = require('supertest')

// Import the real validation functions
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

// Create a wrapper app using the real validators
const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users - valid inputs', () => {
  // Mock the validators to always return true for "valid inputs"
  const mockValidateUsername = jest.fn(() => true)
  const mockValidatePassword = jest.fn(() => true)
  const mockValidateEmail = jest.fn(() => true)

  const validApp = createApp(mockValidateUsername, mockValidatePassword, mockValidateEmail)

  const validUser = {
    username: 'ValidUser',
    password: 'StrongPass123!',
    email: 'student@example.com'
  }

  test('should return status 200', async () => {
    const response = await request(validApp).post('/users').send(validUser)
    expect(response.statusCode).toBe(200)
  })

  test('should return JSON content type', async () => {
    const response = await request(validApp).post('/users').send(validUser)
    expect(response.headers['content-type']).toMatch(/json/)
  })

  test('should return a userId', async () => {
    const response = await request(validApp).post('/users').send(validUser)
    expect(response.body.userId).toBeDefined()
  })

  test('should return success message', async () => {
    const response = await request(validApp).post('/users').send(validUser)
    expect(response.body.message).toBe('Valid User')
  })
})

describe('POST /users - invalid inputs', () => {
  test('should return status 400', async () => {
    const response = await request(app).post('/users').send({
      username: 'usr',          // too short
      password: '123',          // too weak
      email: 'not-an-email'     // invalid
    })
    expect(response.statusCode).toBe(400)
  })

  test('should return JSON content type', async () => {
    const response = await request(app).post('/users').send({
      username: 'usr',
      password: '123',
      email: 'not-an-email'
    })
    expect(response.headers['content-type']).toMatch(/json/)
  })

  test('should return error message', async () => {
    const response = await request(app).post('/users').send({
      username: 'usr',
      password: '123',
      email: 'not-an-email'
    })
    expect(response.body.error).toBe('Invalid User')
  })

  test('should NOT return userId', async () => {
    const response = await request(app).post('/users').send({
      username: 'usr',
      password: '123',
      email: 'not-an-email'
    })
    expect(response.body.userId).toBeUndefined()
  })

  test('should fail when username or password is missing', async () => {
    const response = await request(app).post('/users').send({
      username: '',
      password: '',
      email: 'test@example.com'
    })
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Invalid User')
  })
})
