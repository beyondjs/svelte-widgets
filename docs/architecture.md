# Svelte 3 Widgets architecture

This adapter connects Svelte 3 components to Beyond custom-element widgets. Core Widgets owns registration, controller construction, holder/shadow-root creation, attributes, stores, routing and style-resource state. This package owns framework mounting, refresh and rendering wrappers. It does not provide a compiler, development server, HMR transport or a full-document SSR service.

## Public modules and dependencies

[package.json](../package.json) declares `@beyond-js/svelte-widgets` version 1.1.0, with Widgets ~1.1.0 and Kernel ~0.1.8. Svelte is ^3.55.0; this is the Svelte 3 component-constructor/server-render API, not a Svelte 5 migration. Web/SSR distribution ports are 9116/9117.

`@beyond-js/svelte-widgets/base` exports SvelteWidgetController; `/page` exports PageSvelteWidgetController. Client and server directories define the same public names selected by platform: web/android/ios versus ssr. Wrapper and compiled .svelte files are internal sources, not additional public imports. Manifest versions are not evidence of published artifacts or tested framework compatibility.

## Authoring and core contract

```ts
import { PageSvelteWidgetController } from '@beyond-js/svelte-widgets/page';
import PageView from './view.svelte';

export /*bundle*/ class Controller extends PageSvelteWidgetController {
    get Widget() { return PageView; }
}
```

The view is application-owned. Widget metadata, registration exports and the component's compiled output must follow the consuming Beyond compiler's contract. Client base inherits WidgetClientController and expects core to supply widget.holder, attributes, store, styles and initialisation. mount(props?) defaults to widget/attributes/store, then allows caller overrides. These are model references, not serialized server state or automatic framework reactivity.

Page initialise obtains a URI from `manager.pages.obtain({widget})`, subscribes a bound onQueryStringChange callback to change, assigns uri, then awaits base initialise. Page mount passes uri to base mount. The overridable query-string callback is empty by default. The bound listener is not retained or removed; repeated initialization/disposal must address subscription ownership. Server page adds no behavior or automatic request URI; the server orchestrator supplies context explicitly.

## Client execution, styles and refresh

SvelteWidgetController constructs the compiled wrapper with `new Widget({target: holder, hydrate, props})`, where hydrate is true when the holder has element children. It does not retain the resulting component instance, has no mount guard and leaves unmount empty. Framework teardown and repeated-mount ownership are therefore unfinished.

The wrapper snapshots `wrapper.Widget`, renders its Styles component, and includes the framework component only when styles are ready. It clears holder display in the pending-style completion callback; already-loaded styles do not take that callback. Unlike React, hydration does not bypass the readiness gate.

`refresh()` calls wrapper.changed, but widget.svelte never replaces that default no-op or dynamically rereads Widget. The source therefore does not implement component replacement through this refresh path. Styles renders the resource list without subscribing to StylesManager change; new HMR stylesheet URLs are not reactively propagated by this wrapper.

The stylesheet load callback names its Event argument `url` and passes that Event to onloaded. Current core StylesManager accepts Event or string, so the name alone is not a type/protocol failure. No error handler settles failed stylesheet loads, which can leave the initial component gated indefinitely. Preserve this distinction when repairing lifecycle and CSS updates.

## Server rendering and hydration

The server controller synchronously calls the compiled internal widget.svelte default export `.render({Widget, styles, props})` and returns only html. Any returned css/head are discarded; compiler/orchestrator asset collection must account for them. Missing Widget returns an errors array; caught rendering failures return their message. Server wrappers emit link elements from a styles URL array and the framework component. The client instead consumes a StylesManager with resources, loaded/ready, onloaded and change events.

This is per-widget rendering only: there is no streaming/document assembler, dependency loader, store serializer, recursive custom-element renderer or request isolation. The orchestrator must resolve ssr modules, initialize the controller and styles, provide props and assemble the document. The holder-children heuristic merely chooses hydration; matching markup, component identity, framework versions and initial data remain required. Client stylesheet gating differs from unconditional server component output and requires delayed/error-CSS hydration checks.

Current core StylesManager accepts a string URL or an Event whose currentTarget is a link and reads its href attribute. The wrapper's Event callback is therefore compatible with that contract; it is not inherently a string-versus-event bug. Dependency versions must still be checked against the actual installed core implementation.

## Compilation and setup

Every base/page manifest uses a code bundle with `ts.files: "*"` and `svelte.files: "*"`. This is a processor-composition contract, not a JavaScript filename glob for Node. The internal controller requires compiled .svelte wrappers. TypeScript-only output cannot replace the framework processor, and Packages must integrate that processor before this adapter can be a target acceptance case.

TypeScript configuration targets ES2017/ES2020 modules with Node resolution and preserveValueImports. The devcontainer uses Node 18/Beyond 1.2.0 and scaffolding, forwards no ports and defines no install/start lifecycle. No npm scripts, executable test suite or publishing workflow are supplied. [beyond.json](../beyond.json) selects the local package.

Use the source through a configured Beyond compiler/workspace or a verified built distribution. Resolve the declared core/framework dependencies and target platform in the consuming application. This guide does not assume a sibling checkout or prescribe an unsupported standalone npm start/build command. Historical README examples mixing React/Vue paths with this adapter were not a valid setup contract.

## Verification and extension

Verify mount and missing-component errors, style success/failure, script and CSS refresh, query-string events, duplicate mount, detach/reconnect and framework/subscription teardown. Test SSR output followed by hydration with matching component/store data and slow/erroring CSS. Distinguish framework compilation from browser behavior and a refresh callback from state preservation. Keep Controller → Wrapper → Widget/Styles semantics while implementing missing ownership/cleanup and readiness paths.

## Source references

- [Client controller](../modules/client/base/controller.ts), [wrapper](../modules/client/base/wrapper.ts), [widget](../modules/client/base/widget.svelte), [styles](../modules/client/base/styles.svelte) and [page](../modules/client/page/page.ts).
- [Server controller](../modules/ssr/base/controller.ts), [widget](../modules/ssr/base/widget.svelte), [styles](../modules/ssr/base/styles.svelte) and [page](../modules/ssr/page/page.ts).
- [Client manifest](../modules/client/base/module.json), [server manifest](../modules/ssr/base/module.json) and [package manifest](../package.json).
