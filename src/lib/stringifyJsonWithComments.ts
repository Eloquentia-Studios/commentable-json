/**
 * Stringify JSON with comments.
 *
 * @param json JSON object to stringify.
 * @param comments Comment object.
 * @returns Stringified JSON with comments.
 */
const stringifyJsonWithComments = (json: any, comments: any) => {
  const jsonStr = JSON.stringify(json, null, 2)
  const input = jsonStr.split('\n')
  commentLine(input, comments, 0, true)
  return input.join('\n').trim()
}

/**
 * Comment a line.
 *
 * @param input Lines of the JSON file.
 * @param comments Comment object.
 * @param lineNumber Line number to comment.
 * @param root Whether the line is the root.
 * @returns Line number after comment.
 */
const commentLine = (input: string[], comments: any, lineNumber: number, root = false): number => {
  const line = input[lineNumber].trim()
  const key = getLineKey(line)
  const comment = root ? comments : getComment(comments, key)

  if (line.endsWith('{')) lineNumber = commentObj(input, comment, lineNumber)
  else if (line.endsWith('[')) lineNumber = commentArray(input, comment, lineNumber)
  else if (root) lineNumber = commentObj(input, comment, lineNumber)
  else lineNumber = commentValue(input, comment, lineNumber)
  return lineNumber
}

/**
 * Comment an object.
 *
 * @param input Lines of the JSON file.
 * @param comments Comment object.
 * @param lineNumber Line number where the object starts.
 * @param inArray Whether the object is in an array.
 * @returns Line number after object.
 */
const commentObj = (input: string[], comments: any, lineNumber: number, inArray = false): number => {
  lineNumber = commentRoot(input, comments, lineNumber)

  while (lineNumber < input.length) {
    const line = input[lineNumber].trim()
    if (line.startsWith('}')) break

    lineNumber = commentLine(input, comments, lineNumber)
  }

  // Add a newline after the last line of an object in an array
  if (inArray) input[lineNumber] += '\n'

  return lineNumber + 1
}

/**
 * Comment an array.
 *
 * @param input Lines of the JSON file.
 * @param comments Comment object.
 * @param lineNumber Line number where the array starts.
 * @returns Line number after array.
 */
const commentArray = (input: string[], comments: any, lineNumber: number): number => {
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

/**
 * Add a comment to a value.
 *
 * @param input Lines of the JSON file.
 * @param comment Comment to add.
 * @param lineNumber Line number to add comment to.
 * @returns Line number after comment.
 */
const commentValue = (input: string[], comment: string | undefined, lineNumber: number): number => {
  if (comment) input[lineNumber] = `${input[lineNumber]} // ${comment}`
  return lineNumber + 1
}

/**
 * Add a comment to the root of an object.
 *
 * @param input Lines of the JSON file.
 * @param comments Comment object.
 * @param lineNumber Line number to add comment to.
 * @returns Line number after comment.
 */
const commentRoot = (input: string[], comments: any, lineNumber: number): number => {
  if (comments && comments['_']) {
    input[lineNumber] = `\n${getLineIndent(input[lineNumber])}// ${comments['_']}\n${input[lineNumber]}`
  }
  return lineNumber + 1
}

/**
 * Get value key from a line.
 *
 * @param line Line to get key from.
 * @returns Key or undefined.
 */
const getLineKey = (line: string): string | undefined => {
  return /"*.*":/gi.exec(line)?.[0].replace(/"/g, '').replace(':', '')
}

/**
 * Count the indent of a line.
 *
 * @param line Line to count indent for.
 * @returns Indent length.
 */
const countIndent = (line: string): number => line.match(/^ */)?.[0].length || 0

/**
 * Get the indent of a line.
 *
 * @param line Line to get indent for.
 * @returns Indent.
 */
const getLineIndent = (line: string): string => ' '.repeat(countIndent(line))

/**
 * Get a comment from an object by key. If anything is undefined, return undefined.
 *
 * @param obj Comment object.
 * @param key Key to get comment for.
 * @returns Comment or undefined.
 */
const getComment = (obj: any, key: any): any => {
  if (key === undefined) return undefined
  if (obj && obj[key]) return obj[key]
  return undefined
}

export default stringifyJsonWithComments
