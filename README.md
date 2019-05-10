# babel-plugin-replace-named-exports

Babel plugin to replace named exports with configurable values. This might be useful for feature flags and tree shacking.

I copied most of the code from [babel-plugin-debug-macros](https://github.com/ember-cli/babel-plugin-debug-macros). It didn't fit my needs for matching local modules and it allows only boolean for the exports. Probably you want to use that module if it fits your needs.

## Setup

The plugin can be configured to replace the exports for multiple files. To match the appropriate module you can use a string (for external modules) or a regex (for local modules).

```js
{
  plugins: [
    [
      'babel-plugin-replace-named-exports',
      {
        modules: [
          {
            match: 'debug',
            exports: { DEBUG: true },
          },
          {
            match: /\/my-local-config$/,
            exports: {
              FEATURE_A: true,
              FEATURE_B: false,
              VERSION: 1.2,
              getLanguage: 'en',
            },
          },
        ],
      },
    ],
  ];
}
```

## Examples

```javascript
import { DEBUG } from 'debug';
import { FEATURE_A, FEATURE_B, VERSION, getLanguage } from './my-local-config';

if (DEBUG) {
  console.log('debug');
}

if (FEATURE_A) {
  console.log('FEATURE_A');
} else if (FEATURE_B) {
  console.log('FEATURE_B');
}

if (getLanguage() === 'en') {
  console.log('Language is en');
}

console.log(VERSION);
```

Transforms to:

```javascript
if (true) {
  console.log('debug');
}

if (true) {
  console.log('FEATURE_A');
} else if (false) {
  console.log('FEATURE_B');
}

if (getLanguage() === 'en') {
  console.log('Language is en');
}

console.log(1.2);
```

If you set the export to `null` the export will not be removed.

```js
{
  plugins: [
    [
      'babel-plugin-replace-named-exports',
      {
        modules: [
          {
            match: /\/my-feature-flags$/,
            exports: { FEATURE_A: true, VERSION: null },
          },
        ],
      },
    ],
  ];
}
```

```javascript
import { FEATURE_A, VERSION } from './my-feature-flags';

if (FEATURE_A) {
  console.log('FEATURE_A');
}

console.log(VERSION);
```

Transforms to:

```javascript
import { VERSION } from './my-feature-flags';

if (true) {
  console.log('FEATURE_A');
}

console.log(VERSION);
```

If an export used in the code is not configured in the plugin options, the plugin will throw an error.
