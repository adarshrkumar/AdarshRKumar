// All checks have been split into separate rule files:
// - comment-standards.js (checks 0a, 0c)
// - whitespace-standards.js (checks 0b, 1, 2)
// - unused-standards.js (check 1b)
// - brace-block-standards.js (checks 3, 4, 5)
// - arrow-expression-standards.js (checks 7, 8, 9)

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Code style standards (see separate rule files)',
            category: 'Stylistic Issues'
        },
        schema: []
    },
    create() {
        return {};
    }
};
