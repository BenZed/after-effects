import tseslint from 'typescript-eslint'

export default tseslint.config(

    ...tseslint.configs.recommended,

    {
        rules: {
            'quotes': ['error', 'single', { avoidEscape: true }],
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always', { null: 'ignore' }],

            // the api intentionally deals in loosely-typed script payloads
            '@typescript-eslint/no-explicit-any': 'off',

            // intentionally unused args document call signatures
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
        }
    },

    {
        ignores: ['lib/', 'node_modules/', 'cmd-res-test/']
    }

)
