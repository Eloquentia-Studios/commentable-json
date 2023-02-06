# commentable-json

## Quick Start

### Installation
```bash
# Using npm
$ npm install @eloquentiastudios/commentable-json

# Using yarn
$ yarn add @eloquentiastudios/commentable-json

# Using pnpm
$ pnpm i @eloquentiastudios/commentable-json
```

### Example Usage
```ts
import { parseJsonWithComments, stringifyJsonWithComments } from '@eloquentiastudios/commentable-json';

const objectToBeCommented = {
  foo: 'bar',
  baz: 'qux',
};

const commentsForObject = {
  _: 'This is a comment for the entire object',
  foo: 'This is a comment for the foo property',
  baz: 'This is a comment for the baz property',
}

const jsonWithComments = stringifyJsonWithComments(objectToBeCommented, commentsForObject);

// Parse the JSON with comments to get the original object
const parsedObject: typeof objectToBeCommented = parseJsonWithComments(jsonWithComments);
```

## Supported Node.js Versions
Should work on any Node.js version that supports ESM modules (i.e. `type="module"` in `package.json`).

## License
Uses the MIT license. 

See [LICENSE](https://github.com/Eloquentia-Studios/commentable-json/blob/main/LICENSE) for more information.
