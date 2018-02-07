import test from 'ava'
import path from 'path'
import async from 'async'
const _ = require('lodash')
const grpc = require('grpc')

const caller = require('../')
const PROTO_PATH = path.resolve(__dirname, './protos/helloworld.proto')

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
function getHost(port) {
    return '0.0.0.0:'.concat(port || getRandomInt(1000, 60000))
}

const messages = require('./static/helloworld_pb')
const services = require('./static/helloworld_grpc_pb')

test('handles UNAVAILABLE error when server is not up', async t => {
    const host = getHost()
  
    const client = caller(host, PROTO_PATH, 'Greeter')
    const request = new messages.HelloRequest()
    request.setName('Jane')
  
    const error = await t.throws(client.sayHello(request));

    t.is(error.endpoint, host);
    t.is(error.serviceName, 'Greeter');
    t.is(error.method, 'sayHello');
});

test('calls error handler, passing error object', async t => {
    const host = getHost()
    let errorFromHandler;
  
    const client = caller(host, PROTO_PATH, 'Greeter', (err) => errorFromHandler = err)
    const request = new messages.HelloRequest()
    request.setName('Jane')
  
    const error = await t.throws(client.sayHello(request));

    t.is(error, errorFromHandler);
});

