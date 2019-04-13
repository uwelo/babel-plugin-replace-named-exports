const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const plugin = require('../src');

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

  it('should work when using a regular expression for the source', () => {
    const input = loadInput('replace-and-remove-regexp');
    const expected = loadOutput('replace-and-remove-regexp');
    const { code } = transform(input, {
      source: /\/featureFlags$/,
      flags: {
        FEATURE_A: true,
        FEATURE_B: 'b',
      },
    });
    expect(code).toEqual(expected);
  });

  it('should throw for undefined flag', () => {
    const input = loadInput('throw-for-undefined-flag');

    expect(() => {
      transform(input, {
        source: /\/featureFlags$/,
        flags: {
          FEATURE_A: true,
          FEATURE_B: 'b',
        },
      });
    }).toThrowError(
      /FEATURE_X not supported for module .\/config\/featureFlags/,
    );
  });

  it('should ignore other modules', () => {
    const input = loadInput('ignore-not-matching-modules');
    const expected = loadOutput('ignore-not-matching-modules');

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
