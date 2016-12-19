# grpc-caller

An improved [gRPC](http://www.grpc.io) client.

[![npm version](https://img.shields.io/npm/v/grpc-caller.svg?style=flat-square)](https://www.npmjs.com/package/grpc-caller)
[![build status](https://img.shields.io/travis/bojand/grpc-caller/master.svg?style=flat-square)](https://travis-ci.org/bojand/grpc-caller)

#### Features

* Promisifies request / response calls if no callback is supplied
* Automatically converts plain javascript object to metadata in calls.

## Installation


```
$ npm install grpc-caller
```


## Overview

#### Improved request / response calls

Works as standard gRPC client:


```js
const caller = require('grpc-caller')
const PROTO_PATH = path.resolve(__dirname, './protos/helloworld.proto')
const client = caller('0.0.0.0:50051', PROTO_PATH, 'Greeter')
client.sayHello({ name: 'Bob' }, (err, res) => {
  console.log(res)
})
```


For request / response calls, also promisified if callback is not provided:


```js
client.sayHello({ name: 'Bob' })
  .then(res => console.log(res))
```


Which means means you can use is with `async / await`


```js
const res = await client.sayHello({ name: 'Bob' })
console.log(res)
```


#### Automatic `Metadata` creation

All standard gRPC client calls accept [`Metadata`](http://www.grpc.io/grpc/node/module-src_metadata-Metadata.html)
as first or second parameter (depending on the call type). However one has to
manually createthe Metadata object. This module uses
[grpc-create-metadata](https://www.github.com/bojand/grpc-create-metadata)
to automatically create Metadata if plain Javascript object is passed in.


```js
// the 2nd parameter will automatically be converted to gRPC Metadata and
// included in the request
const res = await client.sayHello({ name: 'Bob' }, { requestid: 'my-request-id-123' })
console.log(res)
```


We can still pass an actual `Metadata` object and it will be used as is:


```js
const meta = new grpc.Metadata()
meta.add('requestid', 'my-request-id-123')
const res = await client.sayHello({ name: 'Bob' }, meta)
console.log(res)
```


## API Reference

<a name="caller"></a>

### caller(host, proto, name, options) ⇒ <code>Object</code>
Create client isntance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>String</code> | The host to connect to |
| proto | <code>String</code> &#124; <code>Object</code> | Path to the protocol buffer definition file or                              the static client constructor object itself |
| name | <code>String</code> | In case of proto path the name of the service as defined in the proto definition. |
| options | <code>Object</code> | Options to be passed to the gRPC client constructor |

**Example** *(Create client dynamically)*  

```js
const PROTO_PATH = path.resolve(__dirname, './protos/helloworld.proto')
const client = caller('localhost:50051', PROTO_PATH, 'Greeter')
```

**Example** *(Create a static client)*  

```js
const services = require('./static/helloworld_grpc_pb')
const client = caller('localhost:50051', services.GreeterClient)
```

<a name="caller.metadata"></a>

#### caller.metadata
Utility helper function to create <code>Metadata</code> object from plain Javascript object.
See <code>grpc-create-metadata</code> module.

**Kind**: static property of <code>[caller](#caller)</code>  
## License

  Apache-2.0
