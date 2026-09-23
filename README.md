# @beyond-js/svelte-widgets

Svelte 5 rendering controllers for Beyond Widgets. Read [architecture, public APIs and lifecycle](docs/architecture.md) for setup, mounting, styles/HMR, routing, server rendering and known gaps.

Public imports are `@beyond-js/svelte-widgets/base` and `/page`; each module manifest names a client entry for the browser and a server entry for Node. Source files are authored as Beyond modules for Packages, whose `ts` bundler compiles the TypeScript and the `.svelte` components with the Svelte 5 compiler. The [manifest](package.json) declares Svelte 5, the core dependency, the module directory and the bundler; the Beyond toolchain supplies the package to every workspace.

Mount, unmount and refresh are implemented with the Svelte 5 `mount`, `hydrate` and `unmount` functions, and a Svelte widget is exercised in a real browser by the command line's web acceptance. Per-widget server render methods do not constitute a full SSR service; the Svelte hydration path is not yet verified. Use the local guide's verification cases before promising the remaining lifecycle behavior.

[Testing](docs/testing.md) says where the controllers are validated; this repository has no tests.
