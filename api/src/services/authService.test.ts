import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DomainError } from '../errors/DomainError.js'
import { authenticateUser } from './authService.js'

const userWithPasswordHash = {
  id: 'fake-uuid',
  name: 'Ana',
  email: 'ana@example.com',
  password: '$2b$10$fake-hash',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

test('login fails with 401 when the password is incorrect', async () => {
  await assert.rejects(
    () => authenticateUser(
      { email: 'ana@example.com', password: 'wrong-password' },
      {
        findUserForAuthentication: async () => userWithPasswordHash,
        comparePassword: async (plainTextPassword, passwordHash) => {
          assert.equal(plainTextPassword, 'wrong-password')
          assert.equal(passwordHash, '$2b$10$fake-hash')
          return false
        },
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof DomainError)
      assert.equal(error.status, 401)
      return true
    },
  )
})

test('successful login returns only public user data', async () => {
  const result = await authenticateUser(
    { email: ' ANA@EXAMPLE.COM ', password: 'password123' },
    {
      findUserForAuthentication: async (email) => {
        assert.equal(email, 'ana@example.com')
        return userWithPasswordHash
      },
      comparePassword: async (plainTextPassword, passwordHash) => {
        assert.equal(plainTextPassword, 'password123')
        assert.equal(passwordHash, '$2b$10$fake-hash')
        return true
      },
    },
  )

  assert.deepEqual(result, {
    id: 'fake-uuid',
    name: 'Ana',
    email: 'ana@example.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  })
  assert.ok(!('password' in result))
})

test('login fails with 401 when the email does not exist', async () => {
  await assert.rejects(
    () => authenticateUser(
      { email: 'user@example.com', password: 'password123' },
      {
        findUserForAuthentication: async () => null,
        comparePassword: async () => true,
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof DomainError)
      assert.equal(error.status, 401)
      return true
    },
  )
})
