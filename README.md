# FlexDB

FlexDB is a flexible, free-to-use database service that allows for instant and seamless integration through its REST API. This library, `flexdb`, provides an easy-to-use wrapper around the [FlexDB](https://flexdb.co) REST API.

[![github stars](https://img.shields.io/github/stars/flexdb/node-flexdb)](https://github.com/flexdb/node-flexdb) [![npm version](https://img.shields.io/npm/v/flexdb)](https://www.npmjs.com/package/flexdb) [![npm downloads](https://img.shields.io/npm/dt/flexdb)](https://www.npmjs.com/package/flexdb) [![license](https://img.shields.io/npm/l/flexdb)](LICENSE.md)


## Installation

To start using FlexDB in your project, simply run the following command:

```bash
npm install flexdb
```

## Usage

### Importing the library

First, let's import the `FlexDB` class from the `flexdb` package:

```javascript
import { FlexDB } from 'flexdb'
```

### Initialize FlexDB

Now, create a new instance of the `FlexDB` class.

```javascript
const flexdb = new FlexDB()
```

You can pass an optional configuration object containing your API key and the API endpoint:

```javascript
const flexdb = new FlexDB({ apiKey: 'your_api_key' })
```

### Create a store

A store is like a container for your data. To create a new store, call the `createStore` method with a unique name:

```javascript
const store = await flexdb.createStore('my-store')
```

### Get a store

To fetch an existing store by its name (when using an API key), use the `getStore` method:

```javascript
const store = await flexdb.getStore('my-store')
```

### Ensure a store exists

If you want to make sure a store exists before performing any operations, use the `ensureStoreExists` method. It will return the existing store or create a new one if it doesn't exist:

```javascript
const store = await flexdb.ensureStoreExists('my-store')
```

### Create a collection

A collection is a group of related documents within a store. To create a new collection, call the `collection` method on a store instance:

```javascript
const collection = store.collection('my-collection')
```

### Create a document

To add a new document to a collection, use the `create` method and pass an object containing the data you want to store:

```javascript
const document = await collection.create({ key: 'value' })
```

### Get a document

To fetch a document by its ID, use the `get` method:

```javascript
const document = await collection.get('document_id')
```

### Update a document

To update an existing document, call the `update` method with the document ID and an object containing the updated data:

```javascript
const updatedDocument = await collection.update('document_id', { key: 'new_value' })
```

### Delete a document

To remove a document from a collection, use the `delete` method and pass the document ID:

```javascript
await collection.delete('document_id')
```

### Get many documents

To fetch multiple documents from a collection, use the `getMany` method. You can pass an options object to control pagination and the number of documents to fetch:

```javascript
const documents = await collection.getMany({ page: 1, limit: 10 })
```

### Delete a collection

To remove an entire collection and all its documents, call the `deleteCollection` method:

```javascript
await collection.deleteCollection()
```

### Delete a store

To delete a store and all its collections, use the `delete` method on a store instance:

```javascript
await store.delete()
```

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.
