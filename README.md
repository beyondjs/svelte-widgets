# Welcome to `@beyond-js/svelte-widgets`

`@beyond-js/svelte-widgets` is a package for [BeyondJS](https://beyondjs.com), a platform for creating web projects as independent microfrontends. This package, built on `@beyond-js/widgets`, allows developers to use the Svelte framework in BeyondJS projects with ease.

## Features

-   Simple integration of Svelte in BeyondJS projects
-   Built on the flexible `@beyond-js/widgets` package

## Getting Started

1. Install the `@beyond-js/svelte-widgets` package in your BeyondJS project:

```
npm install @beyond-js/svelte-widgets
```

2. Add the `svelte` processor to the `bundle` configuration in the `module.json` file:

```json
{
    "bundleName": {
        "svelte": {
            "ts": {
                "path": "vue", // Folder where you can store your React components as single-file components.
                "files": "*"
            }
        }
    }
}
```

> Note: In this configuration, "bundleName" should be replaced with the actual name of your bundle.

## Contributing

We welcome contributions to `@beyond-js/svelte-widgets`. If you'd like to contribute, please read the [Contribution Guidelines](https://beyondjs.com/docs/contributing).

## License

`@beyond-js/svelte-widgets` is [MIT licensed](LICENSE).
