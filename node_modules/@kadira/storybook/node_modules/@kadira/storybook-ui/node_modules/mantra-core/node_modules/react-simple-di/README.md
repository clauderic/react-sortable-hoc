# react-simple-di

Simple dependancy injection solution for React.

### Installation

```
npm i react-simple-di
```

### Intro

In `react-simple-di`, we've two types of dependencies, they are:

1. context - These are usually, configurations, models and client for different remote data solutions.
2. actions - Actions are simple functions which used to perform business logic with the help of the above context.

> Every action will receive the `context` as it's first argument.

### Injecting Dependancies

First, we need to inject dependencies to a root level React component. Mostly, this will be the main layout component of our app.

Here are our dependencies:
```js
const context = {
    DB,
    Router,
    appName: 'My Blog'
};

const actions = {
    posts: {
        create({DB, Router}, title, content) {
            const id = String(Math.random());
            DB.createPost(id, title, content);
            Router.go(`/post/${id}`);
        }
    }
};
```

First we've defined our context. Then, we have our actions. Here actions must follow a structure like mentioned above.

Let's inject our dependencies:

```js
import {injectDeps} from 'react-simple-di';
import Layout from './layout.jsx';

// Above mentioned actions and context are defined here.

const LayoutWithDeps = injectDeps(context, actions)(Layout);
```

Now you can use `LayoutWithDeps` anywhere in your app.

## Using Depedencies

Any component rendered inside `LayoutWithDeps` can access both context and actions. 

When using dependecies it will compose a new React component and pass dependencies via props to the original component.

First let's create our UI component. Here it will expect dependecies to come via props `appName` and `createPost`.

```js
class CreatePost extends React.Component {
    render() {
        const {appName} = this.props;
        return (
            <div>
                Create a blog post on app: ${appName}. <br/>
                <button onClick={this.create.bind(this)}>Create Now</button>
            </div>
        );
    }

    create() {
        const {createPost} = this.props;
        createPost('My Blog Title', 'Some Content');
    }
}
```

So, let's use dependencies:

```js
const {useDeps} from 'react-simple-di';

// Assume above mentioned CreatePost react component is
// defined here.

const depsToPropsMapper = (context, actions) => ({
    appName: context.appName,
    createPost: actions.posts.create
});

const CreatePostWithDeps = useDeps(depsToPropsMapper)(CreatePost);
```

That's it. 

> Note: Here when calling the `actions.posts.create` action, you don't need to provide the context as the first argument. It'll handle by `react-simple-di`.

**Default Mapper**

If you didn't provide a mapper function, useDeps will use a default mapper function will allows you to get context and props directy. Here's that default mapper:

```js
const mapper = (context, actions) => ({
    context: () => context,
    actions: () => actions
});
```
