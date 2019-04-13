const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const plugin = require('../babel-plugin-replace-flags');

const transform = (input, options) => transformSync(input, {
  plugins: [[plugin, options]],
});

const loadInput = fixture => fs
  .readFileSync(path.join(__dirname, 'fixtures', fixture, 'input.js'))
  .toString()
  .trim();

const loadOutput = fixture => fs
  .readFileSync(path.join(__dirname, 'fixtures', fixture, 'output.js'))
  .toString()
  .trim();

describe('babel-plugin-replace-flags', () => {
  it('should replace flags and remove import', () => {
    const input = loadInput('replace-and-remove');
    const expected = loadOutput('replace-and-remove');
    const { code } = transform(input, {
      source: 'featureFlags',
      flags: {
        FEATURE_A: true,
        FEATURE_B: 'b',
      },
    });
    expect(code).toEqual(expected);
  });
  it.only('should replace when using a regular expression for the source', () => {
    const input = loadInput('replace-and-remove');
    const expected = loadOutput('replace-and-remove');
    const { code } = transform(input, {
      source: /\/featureFlags$/,
      flags: {
        FEATURE_A: true,
        FEATURE_B: 'b',
      },
    });
    expect(code).toEqual(expected);
  });
});
