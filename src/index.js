const isRelevantModule = (match, importPath) => {
  if (typeof match === 'string' && match !== importPath) {
    return false;
  }
  if (match.test && !match.test(importPath)) {
    return false;
  }
  return true;
};

const getExportsToReplace = (options, importPath) => {
  const { modules } = options;
  const flagsToReplace = modules.reduce((memo, module) => {
    const { match, exports } = module;
    if (isRelevantModule(match, importPath)) {
      return {
        ...memo,
        ...exports,
      };
    }
    return memo;
  }, {});

  if (Object.keys(flagsToReplace).length === 0) {
    return undefined;
  }
  return flagsToReplace;
};

const getReplacement = (t, value) => {
  let replacement;
  if (typeof value === 'boolean') {
    replacement = t.booleanLiteral(value);
  }
  if (typeof value === 'string') {
    replacement = t.stringLiteral(value);
  }

  return replacement;
};

module.exports = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ImportSpecifier(path, state) {
        const importPath = path.parent.source.value;
        const exportsToReplace = getExportsToReplace(state.opts, importPath);

        if (exportsToReplace) {
          const exportName = path.node.imported.name;
          const localExportName = path.node.local.name;
          const exportValue = exportsToReplace[exportName];

          if (!(exportName in exportsToReplace)) {
            throw new Error(
              `${exportName} not supported for module ${importPath}`,
            );
          }

          if (exportValue === null) {
            return;
          }

          const binding = path.scope.getBinding(localExportName);
          binding.referencePaths.forEach((p) => {
            p.replaceWith(getReplacement(t, exportValue, exportName));
          });

          path.remove();
          path.scope.removeOwnBinding(localExportName);
        }
      },

      ImportDeclaration: {
        exit(path, state) {
          const importPath = path.node.source.value;
          const exportsToReplace = getExportsToReplace(state.opts, importPath);
          // remove module import when no specifiers are left
          if (exportsToReplace && path.get('specifiers').length === 0) {
            path.remove();
          }
        },
      },
    },
  };
};
