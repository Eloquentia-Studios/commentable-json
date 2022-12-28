const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm

/**
 * Parse JSON with comments.
 *
 * @param json JSON string with comments
 * @returns JSON object
 */
const parseJsonWithComments = (json: string) => {
  const jsonWithComments = json.replace(commentRegex, '$1')
  return JSON.parse(jsonWithComments)
}

export default parseJsonWithComments
