export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Unused variable and import standards',
            category: 'Stylistic Issues'
        },
        fixable: 'code',
        schema: []
    },
    create(context) {
        return {
            Program(node) {
                const code = context.sourceCode.getText();

                // Check 1b: Unused variables and imports (Astro files only)
                if (context.filename.endsWith('.astro')) {
                    if (context.sourceCode.scopeManager?.acquire?.(node)) {
                        context.sourceCode.scopeManager?.acquire?.(node).variables.forEach(variable => {
                            if (variable.defs.length > 0 && variable.references.length === 0 && !variable.name.startsWith('_')) {
                                const def = variable.defs[0];
                                context.report({
                                    loc: def.node.loc,
                                    message: `Variable '${variable.name}' is defined but never used. Prefix with '_' to ignore.`
                                });
                            }
                        });
                    }

                    // Check for unused type imports
                    let typeMatch;
                    while ((typeMatch = /import\s+type\s+\{([^}]+)\}\s+from/g.exec(code)) !== null) {
                        typeMatch[1].split(',').map(s => s.trim()).forEach(importName => {
                            if (importName.split(/\s+as\s+/)[0].trim().startsWith('_')) return;
                            if (!new RegExp(`\\b${importName.split(/\s+as\s+/)[0].trim()}\\b`).test(code.replace(/import\s+type\s+\{([^}]+)\}\s+from/g, ''))) {
                                context.report({
                                    loc: { line: code.substring(0, typeMatch.index).split('\n').length, column: 1 },
                                    message: `Type '${importName.split(/\s+as\s+/)[0].trim()}' is imported but never used. Prefix with '_' to ignore or remove the import.`
                                });
                            }
                        });
                    }
                }
            }
        };
    }
};
