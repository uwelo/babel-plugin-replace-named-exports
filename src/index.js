const isRelevantModule = (source, importPath) => {
  if (typeof source === 'string' && source !== importPath) {
    return false;
  }
  if (source.test && !source.test(importPath)) {
    return false;
  }
  return true;
};

const macros = (babel) => {
  const t = babel.types;

  const buildIdentifier = (value) => {
    let replacement;
    if (typeof value === 'boolean') {
      replacement = t.booleanLiteral(value);
    }
    if (typeof value === 'string') {
      replacement = t.stringLiteral(value);
    }
    return replacement;
  };

  return {
    visitor: {
      ImportSpecifier(path, state) {
        const importPath = path.parent.source.value;
        const { source, flags } = state.opts;

        if (!isRelevantModule(source, importPath)) {
          return;
        }

        if (flags) {
          const flagName = path.node.imported.name;
          const localBindingName = path.node.local.name;
          const flagValue = flags[flagName];

          if (!(flagName in flags)) {
            throw new Error(
              `${flagName} not supported for module ${importPath}`,
            );
          }

          if (flagValue === null) {
            return;
          }

          const binding = path.scope.getBinding(localBindingName);
          binding.referencePaths.forEach((p) => {
            p.replaceWith(buildIdentifier(flagValue, flagName));
          });

          path.remove();
          path.scope.removeOwnBinding(localBindingName);
        }
      },

      ImportDeclaration: {
        exit(path, state) {
          const importPath = path.node.source.value;
          const { source, flags } = state.opts;

          if (!isRelevantModule(source, importPath)) {
            return;
          }

          // remove flag source imports when no specifiers are left
          if (flags && path.get('specifiers').length === 0) {
            path.remove();
          }
        },
      },
    },
  };
};

module.exports = macros;
