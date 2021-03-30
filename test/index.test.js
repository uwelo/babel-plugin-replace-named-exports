/* eslint-disable implicit-arrow-linebreak */
const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const plugin = require('../src');

const transform = (input, options) =>
  transformSync(input, {
    plugins: [[plugin, options]],
  });

const loadInput = (fixture) =>
  fs
    .readFileSync(path.join(__dirname, 'fixtures', fixture, 'input.js'))
    .toString()
    .trim();

const loadOutput = (fixture) =>
  fs
    .readFileSync(path.join(__dirname, 'fixtures', fixture, 'output.js'))
    .toString()
    .trim();

describe('babel-plugin-replace-named-exports', () => {
  it('should replace exports and remove import', () => {
    const input = loadInput('replace-and-remove');
    const expected = loadOutput('replace-and-remove');
    const { code } = transform(input, {
      modules: [
        {
          match: 'module',
          exports: {
            EXPORT_A: true,
            EXPORT_B: 'b',
            EXPORT_C: true,
            getLanguage: 'en',
          },
        },
      ],
    });
    expect(code).toEqual(expected);
  });

  it('should work when using a regular expression for the source', () => {
    const input = loadInput('replace-and-remove-regexp');
    const expected = loadOutput('replace-and-remove-regexp');
    const { code } = transform(input, {
      modules: [
        {
          match: /\/module$/,
          exports: {
            EXPORT_A: true,
            EXPORT_B: 'b',
          },
        },
      ],
    });
    expect(code).toEqual(expected);
  });

  it('should keep export when set to null', () => {
    const input = loadInput('keep-export-when-set-to-null');
    const expected = loadOutput('keep-export-when-set-to-null');
    const { code } = transform(input, {
      modules: [
        {
          match: 'module',
          exports: {
            EXPORT_A: true,
            EXPORT_B: null,
          },
        },
      ],
    });
    expect(code).toEqual(expected);
  });

  it('should throw for undefined export', () => {
    const input = loadInput('throw-for-undefined-export');

    expect(() => {
      transform(input, {
        modules: [
          {
            match: /\/module$/,
            exports: {
              EXPORT_A: true,
              EXPORT_B: 'b',
            },
          },
        ],
      });
    }).toThrowError(/EXPORT_X not supported for module .\/module/);
  });

  it('should ignore other modules', () => {
    const input = loadInput('ignore-not-matching-modules');
    const expected = loadOutput('ignore-not-matching-modules');

    const { code } = transform(input, {
      modules: [
        {
          match: /\/module$/,
          exports: {
            EXPORT_A: true,
            EXPORT_B: 'b',
          },
        },
      ],
    });
    expect(code).toEqual(expected);
  });

  it('should work with multiple modules', () => {
    const input = loadInput('multiple-modules');
    const expected = loadOutput('multiple-modules');

    const { code } = transform(input, {
      modules: [
        {
          match: 'module',
          exports: {
            EXPORT_A: true,
            EXPORT_B: 'b',
          },
        },
        {
          match: 'second-module',
          exports: {
            EXPORT: 'de',
          },
        },
      ],
    });
    expect(code).toEqual(expected);
  });
});
