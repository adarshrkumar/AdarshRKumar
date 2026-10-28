import propertyOrder from './src/styles/property-order.json' with { type: 'json' };

/** @type {import('stylelint').Config} */
export default {
    extends: "stylelint-config-standard-scss",
    plugins: ['stylelint-order'],
    rules: {
        "declaration-block-no-redundant-longhand-properties": [true, {
            "ignoreShorthands": ["flex-flow"]
        }],
        "scss/operator-no-unspaced": null,
        'property-no-vendor-prefix': [true, {
            ignoreProperties: ['-webkit-backdrop-filter']
        }],
        'font-family-name-quotes': null,
        'declaration-property-value-disallowed-list': {
            flex: ['row', 'column', 'row-reverse', 'column-reverse'],
        },
        'order/properties-order': Object.values(propertyOrder).flat().filter(p => !p.startsWith('//')),
    },
    overrides: [
        {
            files: ['mcp/public/**/*.css'],
            extends: ['stylelint-config-standard'],
        },
    ],
};
