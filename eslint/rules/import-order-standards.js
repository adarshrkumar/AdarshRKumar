import path from 'path';
import { getImportGroup, getImportModulePath } from '../import-export-helpers.js';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Import order standards: group spacing and lib grouping',
            category: 'Best Practices'
        },
        fixable: 'code',
        schema: []
    },
    create(context) {
        const currentDir = path.dirname(context.filename);

        return {
            Program(node) {
                if (!node.body) return;

                const importNodes = (node.body || []).filter(statement => statement && statement.type === 'ImportDeclaration');
                if (importNodes.length === 0) return;

                let maxSeenGroup = 0;
                let previousNode = null;
                let previousGroup = null;

                for (const importNode of importNodes) {
                    if (typeof importNode.source.value !== 'string') continue;

                    const group = getImportGroup(importNode.source.value);

                    if ((group === 4 ? 3 : group) < maxSeenGroup) {
                        context.report({
                            node: importNode,
                            message: 'Import order must be: external non-astro/drizzle, then drizzle/db, then astro, then lib imports, then remaining ts/tsx/cjs/mjs imports, then remaining non-(ts/js*/astro/scss) files, then astro/scss files.',
                        });
                    }

                    if ((group === 4 ? 3 : group) > maxSeenGroup) {
                        maxSeenGroup = group === 4 ? 3 : group;
                    }

                    if (previousNode && previousGroup !== null && ((previousGroup !== (group === 4 ? 3 : group) && (importNode.loc.start.line || 0) - (previousNode.loc.end.line || 0) < 2) || (previousGroup === (group === 4 ? 3 : group) && (importNode.loc.start.line || 0) - (previousNode.loc.end.line || 0) >= 2))) {
                        context.report({
                            node: importNode,
                            message: previousGroup !== (group === 4 ? 3 : group) ? `Add a blank line between import groups. Previous: "${previousNode.source.value}" (group ${previousGroup}), Current: "${importNode.source.value}" (group ${group === 4 ? 3 : group})` : `Remove blank line between same import group.`,
                        });
                    }

                    previousNode = importNode;
                    previousGroup = group === 4 ? 3 : group;
                }

                let currentGroupImports = [];
                let currentGroupNumber = null;

                for (const importNode of importNodes) {
                    if (typeof importNode.source.value !== 'string') continue;

                    const group = getImportGroup(importNode.source.value);

                    if (group === 4 ? 3 : group !== currentGroupNumber) {
                        currentGroupImports = [];
                        currentGroupNumber = group === 4 ? 3 : group;
                    }

                    currentGroupImports.push(importNode);

                    if (currentGroupImports.length > 1) {
                        const modules = new Map();
                        for (const imp of currentGroupImports) {
                            const libPath = getImportModulePath(imp.source.value, currentDir);
                            if (libPath) {
                                if (!modules.has(libPath)) modules.set(libPath, []);
                                modules.get(libPath).push(imp);
                            }
                        }

                        for (const [libPath, libImports] of modules.entries()) {
                            if (libImports.length <= 1) continue;

                            for (let i = 1; i < libImports.length; i++) {
                                const prevImport = libImports[i - 1];
                                const currImport = libImports[i];

                                const prevIndex = currentGroupImports.indexOf(prevImport);
                                const currIndex = currentGroupImports.indexOf(currImport);

                                let hasOtherImportsBetween = false;
                                for (let j = prevIndex + 1; j < currIndex; j++) {
                                    const betweenModulePath = getImportModulePath(currentGroupImports[j].source.value, currentDir);
                                    if (betweenModulePath !== libPath) {
                                        hasOtherImportsBetween = true;
                                        break;
                                    }
                                }

                                if (hasOtherImportsBetween) {
                                    context.report({
                                        node: currImport,
                                        message: `Imports from lib "${libPath}" must be grouped together. Group all "${libPath}" imports consecutively.`,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        };
    }
};
