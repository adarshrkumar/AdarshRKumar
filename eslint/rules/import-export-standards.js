import path from 'path';
import fs from 'fs-extra';

function getImportGroup(source) {
    const extension = path.extname(source.toLowerCase()).slice(1);

    if (
        source === 'drizzle-orm'
        || source.startsWith('drizzle-orm/')
        || (source.startsWith('.') && /(^|\/)db(\/|$)/.test(source.replaceAll('\\', '/')))
    ) {
        return 2;
    }

    if (!source.startsWith('.') && (source.toLowerCase().endsWith('.astro') || source.toLowerCase().endsWith('.scss'))) {
        return 7;
    }

    if (
        !source.startsWith('.')
        && extension.length > 0
        && !['js', 'ts'].some(prefix => extension.startsWith(prefix) || extension.endsWith(prefix))
    ) {
        return 6;
    }

    if (
        !source.startsWith('.')
        && extension.length > 0
        && ['js', 'ts'].some(prefix => extension.startsWith(prefix) || extension.endsWith(prefix))
    ) {
        return 5;
    }

    if (!source.startsWith('.')) return 1;
    if (source.startsWith('../')) return 3;
    if (source.startsWith('./')) return 4;
    return 4;
}

function getImportModulePath(source, currentDir) {
    if (!source.startsWith('.')) return null;

    const parts = source.split('/');

    // Resolve to absolute canonical path (directory)

    // If only one part, it's the full lib path (e.g., ./config, ../modules)
    if (parts.length === 1) {
        let targetPath = path.resolve(currentDir, source);
        // Check if it's a file (has extension)
        try {
            const stat = fs.statSync(targetPath, { throwIfNoEntry: false });
            if (stat && stat.isFile()) {
                // It's a file, return its directory
                return path.dirname(targetPath);
            }
        } catch {
            // Ignore errors
        }
        return targetPath;
    }

    // Get the directory and filename
    const parentDir = parts.slice(0, -1).join('/');
    const filename = parts[parts.length - 1];

    // Resolve the parent directory path
    const resolvedParentDir = path.resolve(currentDir, parentDir);

    // Check if the parent directory exists
    try {
        const dirStat = fs.statSync(resolvedParentDir, { throwIfNoEntry: false });
        if (dirStat && dirStat.isDirectory()) {
            // Parent directory exists, list all files (not directories)
            const entries = fs.readdirSync(resolvedParentDir);

            // Check if any file matches the desired filename (ignoring extension)
            for (const entry of entries) {
                const filePath = path.join(resolvedParentDir, entry);
                const stat = fs.statSync(filePath, { throwIfNoEntry: false });

                // Only check files, not directories
                if (stat && stat.isFile()) {
                    const fileNameWithoutExt = path.parse(entry).name;
                    if (fileNameWithoutExt === filename) {
                        // File exists, return the parent directory as the canonical path
                        return resolvedParentDir;
                    }
                }
            }
        }
    } catch {
        // Ignore errors
    }

    // Directory doesn't exist or file doesn't exist in it, return the full path resolved to absolute (it's a directory import)
    return path.resolve(currentDir, source);
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Import/export standards: format, order, path restrictions, and export boundaries',
            category: 'Best Practices'
        },
        fixable: 'code',
        schema: [{
            type: 'object',
            properties: {
                lineLength: {
                    type: 'number',
                    default: 100
                }
            }
        }]
    },
    create(context) {
        const options = context.options[0] || {};
        const lineLength = options.lineLength || 100;
        const currentDir = path.dirname(context.filename);

        if (context.filename.endsWith('.mjs')) return {};

        return {
            Program(node) {
                if (!node.body) return;

                const importNodes = (node.body || []).filter(statement => statement && statement.type === 'ImportDeclaration');

                if (importNodes.length === 0) return;

                // Check 1: Separate mixed type and value imports when line is too long
                for (const importNode of importNodes) {
                    const fullLine = context.sourceCode.getLines()[importNode.loc.start.line - 1];

                    if (!fullLine) continue;

                    const hasMixedImports =
                        importNode.specifiers.some(spec => spec.importKind === 'type') &&
                        importNode.specifiers.some(spec => spec.importKind !== 'type');

                    if (hasMixedImports && fullLine.length > lineLength) {
                        context.report({
                            node: importNode,
                            message: `Long import line (${fullLine.length} chars) with mixed type and value imports. Separate them into two statements: \`import type { ... } from "..."\` and \`import { ... } from "..."\`.`
                        });
                    }
                }

                // Check 2: Import group spacing (applies to all files with imports)
                let maxSeenGroup = 0;
                let previousNode = null;
                let previousGroup = null;

                for (const importNode of importNodes) {
                    if (typeof importNode.source.value !== 'string') continue;

                    const group = getImportGroup(importNode.source.value);

                    if ((group === 4 ? 3 : group) < maxSeenGroup) {
                        context.report({
                            node: importNode,
                            message: 'Import order must be: external non-drizzle, then drizzle/db, then lib imports, then remaining ts/tsx/cjs/mjs imports, then remaining non-(ts/js*/astro/scss) files, then astro/scss files.',
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

                // Check 3: Within the same import group, imports from the same lib must be grouped together
                let currentGroupImports = [];
                let currentGroupNumber = null;

                for (const importNode of importNodes) {
                    if (typeof importNode.source.value !== 'string') continue;

                    const group = getImportGroup(importNode.source.value);

                    if (group === 4 ? 3 : group !== currentGroupNumber) {
                        // New import group, reset tracking
                        currentGroupImports = [];
                        currentGroupNumber = group === 4 ? 3 : group;
                    }

                    currentGroupImports.push(importNode);

                    // Check within the current group: imports from the same lib must be together
                    if (currentGroupImports.length > 1) {
                        const modules = new Map();
                        for (const imp of currentGroupImports) {
                            const libPath = getImportModulePath(imp.source.value, currentDir);
                            if (libPath) {
                                if (!modules.has(libPath)) modules.set(libPath, []);
                                modules.get(libPath).push(imp);
                            }
                        }

                        // Check if imports from the same lib are consecutive
                        for (const [libPath, libImports] of modules.entries()) {
                            if (libImports.length <= 1) continue;

                            for (let i = 1; i < libImports.length; i++) {
                                const prevImport = libImports[i - 1];
                                const currImport = libImports[i];

                                // Find if there are any imports from OTHER modules between these two
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
            },
            ImportDeclaration(node) {
                if (typeof node.source.value !== 'string') return;

                // Check 4: No bare "." or ".." imports
                if (/(^|\/)\.\.?$/.test(node.source.value)) {
                    context.report({
                        node,
                        message: 'Importing from paths ending in "." or ".." is not allowed. Import from a concrete lib path instead.',
                    });
                }

                // // Check 5: No index file imports (only in subdirectories)
                // if (pathParts.length > 1) {
                //     const indexSuffixPattern = /\/index(?:\.ts)?$/;
                //     const exactIndexPattern = /^\.\/index(?:\.ts)?$/;

                //     if (!indexSuffixPattern.test(node.source.value) && !exactIndexPattern.test(node.source.value)) return;

                //     let suggestedPath = node.source.value.replace(indexSuffixPattern, '');
                //     if (exactIndexPattern.test(node.source.value)) {
                //         const fileDir = context.filename.substring(0, context.filename.lastIndexOf('/'));
                //         const folderName = fileDir.substring(fileDir.lastIndexOf('/') + 1);
                //         suggestedPath = `../${folderName}`;
                //     }

                //     context.report({
                //         node,
                //         message: `Import from index file path is not allowed. Use "${suggestedPath}" instead.`,
                //         fix(fixer) {
                //             return fixer.replaceText(node.source, `"${suggestedPath}"`);
                //         }
                //     });
                // }
            },
            ExportNamedDeclaration(node) {
                // Check 6: No direct re-exports
                if (node.source) {
                    context.report({
                        node,
                        message: `Direct re-export not allowed. Import from "${node.source.value}" directly in files that need it, don't re-export.`
                    });
                }
            },
            ExportAllDeclaration(node) {
                // Check 7: No wildcard re-exports
                context.report({
                    node,
                    message: `Direct re-export with \`export *\` not allowed. Import from "${node.source.value}" directly in files that need it.`
                });
            }
        };
    }
};
