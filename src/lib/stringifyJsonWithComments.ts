const stringifyJsonWithComments = (json: any, comments: any) => {
  const jsonStr = JSON.stringify(json, null, 2)
  const input = jsonStr.split('\n')
  commentObj(input, comments, 0)
  return input.join('\n').trim()
}

const commentObj = (input: string[], comments: any, lineNumber: number): number => {
  lineNumber = commentRoot(input, comments, lineNumber)

  while (lineNumber < input.length) {
    console.log(lineNumber, input[lineNumber])
    const line = input[lineNumber].trim()
    if (line.startsWith('}')) break

    const key = getLineKey(line)
    const comment = getComment(comments, key)
    if (key && line.endsWith('{')) lineNumber = commentObj(input, comment, lineNumber)
    else if (key && line.endsWith('[')) lineNumber = commentArray(input, comment, lineNumber)
    else if (key) lineNumber = commentValue(input, comment, lineNumber)
  }

  return lineNumber + 1
}

const commentArray = (input: string[], comments: any, lineNumber: number): number => {
  lineNumber = commentRoot(input, comments, lineNumber)

  let arrayIndex = 0
  while (lineNumber < input.length) {
    const line = input[lineNumber].trim()
    if (line.startsWith(']')) break

    if (line.endsWith('{')) {
      lineNumber = commentObj(input, comments[arrayIndex], lineNumber)
      arrayIndex++
    } else if (line.endsWith('[')) {
      lineNumber = commentArray(input, comments[arrayIndex], lineNumber)
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

const getComment = (obj: any, key: string | undefined): string | undefined => {
  if (!key) return undefined
  if (obj && obj[key]) return obj[key]
  return undefined
}

export default stringifyJsonWithComments
