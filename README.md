# Excelsior

> Your formula notebook.

[Excelsior](https://gabrielmip.github.io/excelsior/) is meant to be an improvement on the experience we have on spreadsheets when working on non-tabular data. Defining formulas with cell coordinates is wearing and prone to errors. The visual feedback we get when using a cell in a formula helps but is far from how we actually reason about the formulas we are defining.

Another big goal with Excelsior is to empower users which want to perform math-driven decisions but:

1. are not skilled in applications commonly used to experiment with their hypothesis or
2. considered the apparent learning curve for those applications and are not willing to invest time into them.

## Current status

This is on alpha but one can play with it, although the current user experience has plenty of room for improvements.

## Feature ideas

- [x] Basic charts
- [ ] Excel export
- [ ] Change history with undo and redo
- [ ] Autocomplete in formulas. While typing a formula, a dropdown would appear below the careat exhibiting known literals matching what has been typed with fuzzy search and what not.
- [ ] Highlight the literals everywhere on mouse hover or cursor hover
- [ ] Renaming literals
- [ ] Internationalization and localization
- [ ] Restriction definition. For instance, define that my monthly expenses must be smaller than 90% of my salary. This can serve as validation or guides to maximize/minimize variables (linear programming).
- [ ] Literals which vary over time. This feature is useful for, for example, visualizing compound interests.

## Development

Install application and development dependencies.

```bash
yarn install
```

Start the server:

```bash
yarn dev
```

Navigate to http://localhost:8080. You should see the app running.

## Build

```bash
yarn build
```

The compiled files will be created at the `build/dist` folder.
