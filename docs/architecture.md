# Svelte 3 Widgets architecture

This adapter connects Svelte 3 components to Beyond custom-element widgets. Core Widgets owns registration, controller construction, holder/shadow-root creation, attributes, stores, routing and style-resource state. This package owns framework mounting, refresh and rendering wrappers. It does not provide a compiler, development server, HMR transport or a full-document SSR service.

## Public modules and dependencies

[package.json](../package.json) declares `@beyond-js/svelte-widgets` version 1.1.0, with Widgets ~1.1.0 and Kernel ~0.1.8. Svelte is ^5.0.0: the components are written with runes and mounted with the Svelte 5 `mount`, `hydrate` and `unmount` functions, and the server renders with `render` from `svelte/server`. Since 2026-09-21 the package is authored for Packages: `beyond.modules` names `modules`, the `ts` bundler runs on the development runtime with its `svelte` processor, and the Engine distributions (9116/9117) are no longer declared.

`@beyond-js/svelte-widgets/base` exports SvelteWidgetController; `/page` exports PageSvelteWidgetController. Each is one directory with one manifest whose `conditionals` name a client entry for `web` and a server entry for `node`, each excluding the other directory. Wrapper and compiled .svelte files are internal sources, not additional public imports. The Packages development service supplies the package to every workspace from the Beyond toolchain, with Svelte resolved once from the installation. Manifest versions are not evidence of published artifacts.

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

SvelteWidgetController mounts the compiled root component with `hydrate(Widget, {target, props})` when the holder has element children and `mount` otherwise, and retains the instance. A second mount is ignored while mounted; `unmount()` releases the instance with the Svelte 5 `unmount`, which is what the element calls on disconnection.

The root component reads its props with `$props()`, renders its Styles component, and includes the view once styles are ready (`$state` set from `styles.ready`); it clears the holder display when the sheets are loaded. When the controller hydrates server markup it passes `hydrating`, and the view is included at once: the markup is already there, and including it only once the sheets loaded would replace the nodes the server wrote.

`refresh()` advances the version of the wrapper, and the root component renders the view inside `{#key version}` with the current `wrapper.Widget`, so a code update creates the view again: its `$state` starts over while the store and the attributes of the controller survive. The command line's web acceptance mounts a Svelte widget beside a React and a Vue one, adopts its own stylesheet in its root and updates its code through its original import.

The stylesheet component reports link load and error events to the manager, which keeps the last loaded version of a resource that fails; the resource list is rendered from the manager, without subscribing to its change event, so a replacement stylesheet reaches a Svelte root through the runtime's adopted sheets and not through a new link.

## Server rendering and hydration

The server controller calls `render(Widget, {props: {Widget, styles, props}})` from `svelte/server` on the compiled root component and returns its `body` as html. The returned `head` is discarded; the component CSS is external, emitted by the compiler into the stylesheet of the module. Missing Widget returns an errors array; caught rendering failures return their message. Server wrappers emit link elements from a styles URL array and the framework component. The client instead consumes a StylesManager with resources, loaded/ready, onloaded and change events.

This is per-widget rendering only: there is no streaming/document assembler, dependency loader, store serializer, recursive custom-element renderer or request isolation. The orchestrator must resolve ssr modules, initialize the controller and styles, provide props and assemble the document. The holder-children heuristic merely chooses hydration; matching markup, component identity, framework versions and initial data remain required. Client stylesheet gating differs from unconditional server component output and requires delayed/error-CSS hydration checks.

Current core StylesManager accepts a string URL or an Event whose currentTarget is a link and reads its href attribute. The wrapper's Event callback is therefore compatible with that contract; it is not inherently a string-versus-event bug. Dependency versions must still be checked against the actual installed core implementation.

## Compilation and setup

The manifests of `base` and `page` declare no processor: the `ts` bundler of Packages compiles `.ts` sources with its `ts` processor and `.svelte` components with its `svelte` processor, which compiles each component with the Svelte 5 compiler (client output for `web`, server output for `node`, external CSS collected into the stylesheet of the module). The internal controller imports the root component as `./widget.svelte`.

TypeScript configuration targets ES2017/ES2020 modules with Node resolution and preserveValueImports. The devcontainer uses Node 18/Beyond 1.2.0 and scaffolding, forwards no ports and defines no install/start lifecycle. No npm scripts or publishing workflow are supplied. [beyond.json](../beyond.json) selects the local package.

Use the source through a configured Beyond compiler/workspace or a verified built distribution. Resolve the declared core/framework dependencies and target platform in the consuming application. This guide does not assume a sibling checkout or prescribe an unsupported standalone npm start/build command. Historical README examples mixing React/Vue paths with this adapter were not a valid setup contract.

## Verification and extension

The command line's web acceptance verifies mount, stylesheet adoption in the root, a script refresh through the original import and teardown of the instance. Still to verify: missing-component errors, style failure, CSS refresh of a Svelte widget, query-string events, detach/reconnect and SSR output followed by hydration with matching component/store data and slow/erroring CSS. Distinguish framework compilation from browser behavior and a refresh callback from state preservation. Keep Controller → Wrapper → Widget/Styles semantics while implementing the missing paths.

## Source references

- [Client controller](../modules/base/client/controller.ts), [wrapper](../modules/base/client/wrapper.ts), [widget](../modules/base/client/widget.svelte), [styles](../modules/base/client/styles.svelte) and [page](../modules/page/client/page.ts).
- [Server controller](../modules/base/server/controller.ts), [widget](../modules/base/server/widget.svelte), [styles](../modules/base/server/styles.svelte) and [page](../modules/page/server/page.ts).
- [Base manifest](../modules/base/module.json), [page manifest](../modules/page/module.json) and [package manifest](../package.json).
