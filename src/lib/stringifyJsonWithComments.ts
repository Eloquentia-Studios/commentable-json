const stringifyJsonWithComments = (json: any, comments: any) => {
  const jsonStr = JSON.stringify(json, null, 2)
  const input = jsonStr.split('\n')
  commentLine(input, comments, 0, true)
  return input.join('\n').trim()
}

const commentLine = (input: string[], comments: any, lineNumber: number, root = false): number => {
  console.log('commentLine', lineNumber, input[lineNumber], comments)
  const line = input[lineNumber].trim()
  const key = getLineKey(line)
  const comment = root ? comments : getComment(comments, key)
  if (line.endsWith('{')) lineNumber = commentObj(input, comment, lineNumber)
  else if (line.endsWith('[')) lineNumber = commentArray(input, comment, lineNumber)
  else if (root) lineNumber = commentObj(input, comment, lineNumber)
  else lineNumber = commentValue(input, comment, lineNumber)
  return lineNumber
}

const commentObj = (input: string[], comments: any, lineNumber: number, inArray = false): number => {
  console.log('commentObj', lineNumber, input[lineNumber], comments)
  lineNumber = commentRoot(input, comments, lineNumber)

  while (lineNumber < input.length) {
    console.log(lineNumber, input[lineNumber])
    const line = input[lineNumber].trim()
    if (line.startsWith('}')) break

    lineNumber = commentLine(input, comments, lineNumber)
  }

  // Add a newline after the last line of an object in an array
  if (inArray) input[lineNumber] += '\n'

  return lineNumber + 1
}

const commentArray = (input: string[], comments: any, lineNumber: number): number => {
  console.log('commentArray', lineNumber, input[lineNumber], comments)
  lineNumber = commentRoot(input, comments, lineNumber)

  let arrayIndex = 0
  while (lineNumber < input.length) {
    const line = input[lineNumber].trim()
    if (line.startsWith(']')) break

    const comment = getComment(comments, arrayIndex)
    if (line.endsWith('{')) {
      lineNumber = commentObj(input, comment, lineNumber, true)
      arrayIndex++
    } else if (line.endsWith('[')) {
      lineNumber = commentArray(input, comment, lineNumber)
      arrayIndex++
    } else {
      lineNumber = commentValue(input, comment, lineNumber)
      arrayIndex++
    }
  }

  return lineNumber + 1
}

const commentValue = (input: string[], comment: string | undefined, lineNumber: number): number => {
  if (comment) input[lineNumber] = `${input[lineNumber]} // ${comment}`
  return lineNumber + 1
}

const commentRoot = (input: string[], comments: any, lineNumber: number): number => {
  if (comments && comments['_']) {
    input[lineNumber] = `\n${getLineIndent(input[lineNumber])}// ${comments['_']}\n${input[lineNumber]}`
  }
  return lineNumber + 1
}

const getLineKey = (line: string): string | undefined => {
  return /"*.*":/gi.exec(line)?.[0].replace(/"/g, '').replace(':', '')
}

const countIndent = (line: string): number => line.match(/^ */)?.[0].length || 0

const getLineIndent = (line: string): string => ' '.repeat(countIndent(line))

const getComment = (obj: any, key: any): any => {
  if (key === undefined) return undefined
  if (obj && obj[key]) return obj[key]
  return undefined
}

export default stringifyJsonWithComments
