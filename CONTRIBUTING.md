# Contributing

Atomic's SDK team maintains this SDK and makes all changes to its code, so we don't accept pull requests for SDK changes. We still want to hear about anything that isn't working.

## Report a bug

1. Open a [GitHub issue](https://github.com/atomicfi/atomic-transact-capacitor/issues/new) on this repository.
2. Report it to your Atomic account manager as well.

Include:

- The SDK version, and the platform and OS version you saw it on
- What you did, what you expected, and what happened instead
- Whether it happens every time
- Logs, screenshots or a recording, with personal and account data removed

If it's a security problem, don't open a public issue. Report it to your Atomic account manager only.

## Ask a question or request a feature

Open a [GitHub issue](https://github.com/atomicfi/atomic-transact-capacitor/issues/new) and describe what you're trying to do.

## Documentation and examples

Fixes to the documentation and the example apps are welcome as pull requests. `AGENTS.md` lists which paths those are.

## Development (Atomic SDK team)

This section is for Atomic's SDK team.

### Developing

#### Local Setup

1. Clone the repo.
1. Install the dependencies.

    ```shell
    npm install
    ```

1. Install SwiftLint if you're on macOS.

    ```shell
    brew install swiftlint
    ```

#### Scripts

##### `npm run build`

Build the plugin web assets and generate plugin API documentation using [`@capacitor/docgen`](https://github.com/ionic-team/capacitor-docgen).

It will compile the TypeScript code from `src/` into ESM JavaScript in `dist/esm/`. These files are used in apps with bundlers when your plugin is imported.

Then, Rollup will bundle the code into a single file at `dist/plugin.js`. This file is used in apps without bundlers by including it as a script in `index.html`.

##### `npm run verify`

Build and validate the web and native projects.

This is useful to run in CI to verify that the plugin builds for all platforms.

##### `npm run lint` / `npm run fmt`

Check formatting and code quality, autoformat/autofix if possible.

This template is integrated with ESLint, Prettier, and SwiftLint. Using these tools is completely optional, but the [Capacitor Community](https://github.com/capacitor-community/) strives to have consistent code style and structure for easier cooperation.

### Publishing

There is a `prepublishOnly` hook in `package.json` which prepares the plugin before publishing, so all you need to do is run:

```shell
npm publish
```

> **Note**: The [`files`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) array in `package.json` specifies which files get published. If you rename files/directories or add files elsewhere, you may need to update it.
