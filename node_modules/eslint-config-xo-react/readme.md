# eslint-config-xo-react [![Build Status](https://travis-ci.org/sindresorhus/eslint-config-xo-react.svg?branch=master)](https://travis-ci.org/sindresorhus/eslint-config-xo-react)

> ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for React to be used with [eslint-config-xo](https://github.com/sindresorhus/eslint-config-xo)


## Install

```
$ npm install --save-dev eslint-config-xo eslint-config-xo-react eslint-plugin-react
```


## Usage

Add some ESLint config to your package.json:

```json
{
	"name": "my-awesome-project",
	"eslintConfig": {
		"extends": ["xo", "xo-react"]
	}
}
```

Or to .eslintrc:

```json
{
	"extends": ["xo", "xo-react"]
}
```

Use the `space` sub-config if you want 2 space indentation instead of tabs:

```json
{
	"extends": ["xo", "xo-react/space"]
}
```

You can also mix it with a [XO](https://github.com/sindresorhus/xo) sub-config:

```json
{
	"extends": ["xo/esnext", "xo-react"]
}
```


## Tip

### Use with XO

```
$ npm install --save-dev eslint-config-xo-react eslint-plugin-react
```

```json
{
	"name": "my-awesome-project",
	"xo": {
		"extends": "xo-react"
	}
}
```


## Related

- [eslint-config-xo](https://github.com/sindresorhus/eslint-config-xo) - ESLint shareable config for XO
- [XO](https://github.com/sindresorhus/xo)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
