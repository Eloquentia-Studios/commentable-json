import parseJsonWithComments from './lib/parseJsonWithComments.js'

const testData = `
{
  "name": "John \\/\\/Doe", // This is a comment
  "age": 43, // This is another comment
  // Servers owned by John
  "servers": [
    {
      "name": /* IDK */ "dev-web", // This is a comment
      "ip": "10.0.1.1" // This is another comment
    }
  ]
}
`

console.log(parseJsonWithComments(testData))
