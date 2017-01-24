'use strict';
module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: [
		'react'
	],
	rules: {
		'react/jsx-boolean-value': 2,
		'react/jsx-closing-bracket-location': [2, 'props-aligned'],
		'react/jsx-curly-spacing': [2, 'never'],
		'react/jsx-equals-spacing': [2, 'never'],
		'react/jsx-first-prop-new-line': [2, 'multiline'],
		'react/jsx-handler-names': 2,
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-key': 2,
		'react/jsx-no-bind': 2,
		'react/jsx-no-duplicate-props': [2, {ignoreCase: true}],
		'react/jsx-no-undef': 2,
		'react/jsx-pascal-case': 2,
		'react/jsx-space-before-closing': [2, 'never'],
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react/no-danger': 2,
		'react/no-deprecated': 2,
		'react/no-did-update-set-state': 2,
		'react/no-direct-mutation-state': 2,
		'react/no-is-mounted': 2,
		'react/no-string-refs': 2,
		'react/no-unknown-property': 2,
		'react/prop-types': 2,
		'react/react-in-jsx-scope': 2,
		'react/require-extension': [1, {extensions: ['.js', '.jsx']}],
		'react/self-closing-comp': 2,
		'react/wrap-multilines': 2
	}
};
