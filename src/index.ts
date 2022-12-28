import stringifyJsonWithComments from './lib/stringifyJsonWithComments.js'

const testDataEdgeCase = [1, 2, 3]
const testDataEdgeCaseComments = {
  _: 'This is the root comment',
  0: 'This is a comment',
  1: 'This is another comment',
  2: 'This is the last comment'
}

// This is the root comment
const testData = {
  name: 'John //Doe', // This is a comment
  age: 43, // This is another comment
  // Servers owned by John
  servers: [
    {
      name: /* IDK */ 'dev-web', // This is a comment
      ip: '10.0.1.1' // This is another comment
    },
    {
      noName: 54,
      noIp: null
    }
  ],
  // Just some stuff
  stuffInGarage: {
    car: 'Audi', // Man, you're rich
    bike: 'Electric' // Shit, you got no condition?
  }
}

const testDataComments = {
  _: 'This is the root comment',
  name: 'This is a comment',
  age: 'This is another comment',
  servers: {
    _: 'Servers owned by John',
    0: {
      name: 'This is a comment',
      ip: 'This is another comment'
    },
    1: {
      noName: 'IDK'
    }
  },
  stuffInGarage: {
    _: 'Just some stuff',
    car: "Man, you're rich",
    bike: 'Shit, you got no condition?'
  }
}

console.log(stringifyJsonWithComments(testDataEdgeCase, testDataEdgeCaseComments))
