# Storybook Deployer

This is a simple tool allows you to deploy your Storybook into a static hosting service.
(Currently, GitHub Pages only.)

## Getting Started

Install Storybook Deployer with:

```
npm i --save @kadira/storybook-deployer
```
Then add a NPM script like this:

```js
{
  "scripts": {
    ...
    "deploy-storybook": "storybook-to-ghpages",
    ...
  }
}
```

Then you can run `npm run deploy-storybook` to deploy the Storybook to GitHub Pages.

### Custom Build Configuration

If you customize the build configuration with some additional params (like static file directory), then you need to expose another NPM script like this:

```js
{
  "scripts": {
    ...
    "build-storybook": "build-storybook -s public -o .out",
    ...
  }
}
```

> Make sure to set the output directory as **`.out`**.
