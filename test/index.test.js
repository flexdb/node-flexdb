// Copyright (C) 2023 FlexDB <team@flexdb.co>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { expect } from 'chai'
import { FlexDB } from '../lib/index.js'

describe('FlexDB', function() {
  this.timeout(10000)
  let flexdb, store, users
  // const config = { endpoint: 'https://dev.flexdb.co/api/v1' } // { apiKey: '...' }
  const config = { endpoint: 'http://localhost:8000/' }

  before(async function() {
    flexdb = new FlexDB(config)
    store = await flexdb.createStore({ name: 'test-store' })
    users = store.collection('users')
  })

  it('should create a new store and return its id and name', async function() {
    expect(store.data).to.have.property('id')
    expect(store.data).to.have.property('name')
    expect(store.data.name).to.equal('test-store')
  })

  it('should create a new document in the specified collection', async function() {
    const user = await users.create({ name: 'Alice' })
    expect(user).to.have.property('id')
  })

  it('should create a second document in the same collection', async function() {
    const user = await users.create({ name: 'Dave' })
    expect(user).to.have.property('id')
  })

  it('should get all documents in the specified collection', async function() {
    const allUsers = await users.getAll()
    expect(allUsers).to.be.an('array')
    expect(allUsers.length).to.be.gte(2)
  })

  it('should get a document by id in the specified collection', async function() {
    const user = await users.create({ name: 'Bob' })
    const bob = await users.get(user.id)
    expect(bob).to.have.property('id')
    expect(bob).to.have.property('name')
    expect(bob.name).to.equal('Bob')
  })

  it('should update a document by id in the specified collection', async function() {
    const user = await users.create({ name: 'Charlie' })
    const charles = await users.update(user.id, { name: 'Charles' })
    expect(charles).to.have.property('id')
    expect(charles).to.have.property('name')
    expect(charles.name).to.equal('Charles')
  })

  it('should delete a document by id in the specified collection', async function() {
    const user = await users.create({ name: 'Diana' })
    await users.delete(user.id)
    const diana = await users.get(user.id)
    expect(diana).to.be.null
  })

  it('should return null when trying to get a non-existent document', async function() {
    const nonExistentUser = await users.get('non-existent-id')
    expect(nonExistentUser).to.be.null
  })

  it('should delete a store and verify it no longer exists', async function() {
    await store.delete()
    try {
      await users.create({ name: 'Alice' })
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.response.status).to.equal(401)
    }
  })

  it('should throw an error when the server is not reachable', async function() {
    try {
      const unreachableFlexDB = new FlexDB({ endpoint: 'http://localhost:9999/' })
      await unreachableFlexDB.createStore({ name: 'test-store' })
      throw new Error('Expected an error but did not get one')
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
    }
  })
})
