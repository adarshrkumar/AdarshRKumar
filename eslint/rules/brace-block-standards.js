function checkSingleDeclarationBlock(node, blockNode, context) {
    if (!blockNode || blockNode.type !== 'BlockStatement' || blockNode.body.length !== 1) {
        return;
    }

    if (!blockNode.body[0].loc?.start?.line || !blockNode.body[0].loc?.end?.line || blockNode.body[0].loc?.start?.line !== blockNode.body[0].loc?.end?.line) {
        return;
    }

    const parentStartLine = node.loc?.start?.line;
    const parentEndLine = blockNode.loc?.start?.line;
    if (!parentStartLine || !parentEndLine || parentStartLine !== parentEndLine) {
        return;
    }

    const parentCode = context.sourceCode.getText(node).trim();
    const statementCode = context.sourceCode.getText(blockNode.body[0]).trim();
    const condensedLine = `${parentCode} ${statementCode}`;
    if (condensedLine.length >= 100) return;

    const reportObj = {
        node,
        message: 'Single statement in block should be on one line'
    };

    if (!context.filename.endsWith('.astro')) {
        reportObj.fix = function(fixer) {
            const openBraceToken = context.sourceCode.getFirstToken(blockNode);
            const closeBraceToken = context.sourceCode.getLastToken(blockNode);
            const beforeBrace = context.sourceCode.text[openBraceToken.range[0] - 1];
            const needsSpace = beforeBrace !== ' ' && beforeBrace !== '\t' && beforeBrace !== '\n';
            const spacing = needsSpace ? ' ' : '';
            return fixer.replaceTextRange(
                [openBraceToken.range[0], closeBraceToken.range[1]],
                `${spacing}${statementCode}`
            );
        };
    }

    context.report(reportObj);
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Brace placement and block statement standards',
            category: 'Stylistic Issues'
        },
        fixable: 'code',
        schema: []
    },
    create(context) {
        return {
            IfStatement(node) {
                // Check 3: If/else brace placement
                if (node.alternate) {
                    const consequentClosingBrace = context.sourceCode.getLastToken(node.consequent);
                    const elseToken = context.sourceCode.getTokenAfter(consequentClosingBrace);

                    if (elseToken && elseToken.value === 'else' && consequentClosingBrace.loc.end.line === elseToken.loc.start.line) {
                        context.report({
                            node: elseToken,
                            message: 'Closing curly brace appears on the same line as the subsequent if else block',
                            fix(fixer) {
                                return fixer.replaceTextRange(
                                    [consequentClosingBrace.range[1], elseToken.range[0]],
                                    '\n'
                                );
                            }
                        });
                    }
                }

                // Check 5: Single statement in if/else should be on one line
                checkSingleDeclarationBlock(node, node.consequent, context);
                if (node.alternate && node.alternate.type !== 'IfStatement') {
                    checkSingleDeclarationBlock(node.alternate, node.alternate, context);
                }
            },
            TryStatement(node) {
                // Check 4: Try/catch/finally must stay on same line
                const tryBlockClosingBrace = context.sourceCode.getLastToken(node.block);

                if (node.handler) {
                    const catchToken = context.sourceCode.getTokenAfter(tryBlockClosingBrace);

                    if (catchToken && catchToken.value === 'catch' && tryBlockClosingBrace.loc.end.line !== catchToken.loc.start.line) {
                        context.report({
                            node: catchToken,
                            message: 'catch block must be on the same line as closing brace: } catch',
                            fix(fixer) {
                                return fixer.replaceTextRange(
                                    [tryBlockClosingBrace.range[1], catchToken.range[0]],
                                    ' '
                                );
                            }
                        });
                    }

                    if (node.finalizer) {
                        const catchBlockClosingBrace = context.sourceCode.getLastToken(node.handler.body);
                        const finallyToken = context.sourceCode.getTokenAfter(catchBlockClosingBrace);

                        if (finallyToken && finallyToken.value === 'finally' && catchBlockClosingBrace.loc.end.line !== finallyToken.loc.start.line) {
                            context.report({
                                node: finallyToken,
                                message: 'finally block must be on the same line as closing brace: } finally',
                                fix(fixer) {
                                    return fixer.replaceTextRange(
                                        [catchBlockClosingBrace.range[1], finallyToken.range[0]],
                                        ' '
                                    );
                                }
                            });
                        }
                    }
                }
                else if (node.finalizer) {
                    const finallyToken = context.sourceCode.getTokenAfter(tryBlockClosingBrace);

                    if (finallyToken && finallyToken.value === 'finally' && tryBlockClosingBrace.loc.end.line !== finallyToken.loc.start.line) {
                        context.report({
                            node: finallyToken,
                            message: 'finally block must be on the same line as closing brace: } finally',
                            fix(fixer) {
                                return fixer.replaceTextRange(
                                    [tryBlockClosingBrace.range[1], finallyToken.range[0]],
                                    ' '
                                );
                            }
                        });
                    }
                }
            },
            ForStatement(node) {
                checkSingleDeclarationBlock(node, node.body, context);
            },
            WhileStatement(node) {
                checkSingleDeclarationBlock(node, node.body, context);
            }
        };
    }
};
