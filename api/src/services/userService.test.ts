import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DomainError } from '../errors/DomainError.js'
import { registerUser } from './userService.js'

const publicUser = {
  id: 'fake-uuid',
  name: 'Ana',
  email: 'ana@example.com',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

test('registration rejects an email address that is already registered', async () => {
  await assert.rejects(
    () => registerUser(
      { name: 'Another User', email: 'ana@example.com', password: '123456' },
      {
        findUserByEmail: async () => publicUser,
        createUserWithCart: async () => { throw new Error('User must not be created') },
        hashPassword: async () => 'unused-hash',
      },
    ),
    (error: unknown) => {
      assert.ok(error instanceof DomainError)
      assert.equal(error.status, 409)
      assert.match(error.message, /email/i)
      return true
    },
  )
})

test('registration hashes the password and does not expose it in the response', async () => {
  let hashWasCalled = false
  const result = await registerUser(
    { name: ' Ana ', email: ' NEW@EXAMPLE.COM ', password: '123456' },
    {
      findUserByEmail: async () => null,
      hashPassword: async (password) => {
        hashWasCalled = true
        assert.equal(password, '123456')
        return '$2b$10$fake-hash'
      },
      createUserWithCart: async (data) => {
        assert.equal(data.email, 'new@example.com')
        assert.equal(data.name, 'Ana')
        assert.equal(data.passwordHash, '$2b$10$fake-hash')
        return publicUser
      },
    },
  )

  assert.equal(hashWasCalled, true)
  assert.deepEqual(result, publicUser)
  assert.ok(!('password' in result))
})
