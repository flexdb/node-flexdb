// Copyright (C) 2023 FlexDB <team@flexdb.co>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import axios from 'axios'

export class FlexDB {
  constructor(config = {}) {
    this.apiKey = config.apiKey || ''
    this.baseUrl = config.endpoint || 'https://flexdb.co/api/v1'

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl
    })
  }

  headers(context) {
    let headers = { 'Authorization': '' }

    // If it's an account-level request AND an API key is set, use the API key
    // otherwise if the context is set, it must be a store-level request
    if (context === 'account') {
      if (this.apiKey && this.apiKey.length > 0) headers.Authorization = `Account ${this.apiKey}`
    } else {
      headers.Authorization = `Store ${context}`
    }

    if (headers.Authorization.length > 0) return { headers }
  }

  async axiosCall(method, url, data = null, headersContext = null) {
    try {
      const response = method === 'post' || method === 'put'
        ? await this.axiosInstance[method](url, data, this.headers(headersContext))
        : await this.axiosInstance[method](url, this.headers(headersContext))
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null
      }
      throw error
    }
  }

  async createStore(data = {}) {
    const responseData = await this.axiosCall('post', '/stores', data, 'account');
    return new Store(this, responseData);
  }

  async getStore(name) {
    const responseData = await this.axiosCall('get', `/stores/${name}`, null, 'account');
    return new Store(this, responseData);
  }
}

export class Store {
  constructor(flexdb, data) {
    this.data = data
    this.id = data.id
    this.flexdb = flexdb
  }

  collection(name) {
    return new Collection(this, name)
  }

  async delete() {
    return await this.flexdb.axiosCall('delete', `/stores/${this.data.id}`, null, this.data.id);
  }
}

export class Collection {
  constructor(store, name) {
    this.name = name
    this.store = store
  }

  async deleteCollection() {
    return await this.store.flexdb.axiosCall('delete', `/collections/${this.name}`, null, this.store.id)
  }

  async create(data) {
    return await this.store.flexdb.axiosCall('post', `/collections/${this.name}`, data, this.store.id)
  }

  async getAll() {
    return await this.store.flexdb.axiosCall('get', `/collections/${this.name}`, null, this.store.id)
  }

  async get(id) {
    return await this.store.flexdb.axiosCall('get', `/collections/${this.name}/${id}`, null, this.store.id)
  }

  async update(id, data) {
    return await this.store.flexdb.axiosCall('put', `/collections/${this.name}/${id}`, data, this.store.id)
  }

  async delete(id) {
    return await this.store.flexdb.axiosCall('delete', `/collections/${this.name}/${id}`, null, this.store.id)
  }
}
