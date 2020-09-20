# Excelsior

## Ideias

- Restrictions. This can be useful for cases such as my monthly expenses must be smaller than 90% of my salary. This can serve as validation or guides to maximize/minimize variables.
- Sharing workspaces
- Autocomplete in formulas
- Undo
- Draw formulas instead of rendering them as text allowing interactions such as hovering in a literal and highlighting it everywhere in the workspace.
- Export to Excel
- Registering Interests
- Literals which vary over time
- Charts

## Quick reference

- [MathJS' expression trees](https://mathjs.org/docs/expressions/expression_trees.html)

## Contributing

```bash
yarn install
```

Run the build script a first time, in order to avoid 404 errors about missing `bundle.css` in the browser:

```bash
yarn build
```

Start the server:

```bash
yarn dev
```

Navigate to http://localhost:8080. You should see the app running.

## About the template used

This is a copy of official [Svelte template for Webpack](https://github.com/sveltejs/template-webpack) with added HMR support.

This template aims to remain as close to the official template as possible. Please refer to official docs for general usage. For HMR specific stuff, see bellow!

This HMR implementation relies on Svelte's private & non documented API. This means that it can stop working with any new version of Svelte.

Progress of Svelte HMR support can be tracked in [this issue](https://github.com/sveltejs/svelte/issues/3632).

**NOTE** The template pins the major version of Svelte, using the [tilde comparator](https://docs.npmjs.com/misc/semver#tilde-ranges-123-12-1) because, in practice, HMR breakages tend to only happen with new major versions of Svelte. In your app, you can change this to your liking -- because you might be more interested in last version of Svelte than working HMR, or be wise and pin the exact versions of all you dependencies.
