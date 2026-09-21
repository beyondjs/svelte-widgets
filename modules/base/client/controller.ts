import { WidgetClientController } from '@beyond-js/widgets/controller';
import { mount, hydrate, unmount } from 'svelte';
import { Wrapper } from './wrapper';
import Widget from './widget.svelte';

/**
 * The client controller of a widget whose view is a Svelte 5 component.
 *
 * The root component is mounted in the holder of the element with the Svelte 5 `mount` and `hydrate`
 * functions, and released with `unmount`. An update of the module refreshes the view through the wrapper,
 * whose version the root component keys the view by.
 */
export /*bundle*/
abstract class SvelteWidgetController extends WidgetClientController {
	#wrapper: Wrapper;
	#instance: Record<string, any>;

	#mounted = false;
	get mounted() {
		return this.#mounted;
	}

	mount(props?: Record<string, any>) {
		if (this.#mounted) return;
		if (!this.Widget) {
			console.error(`Widget "${this.element}" does not export a Widget class`);
			return;
		}
		this.#mounted = true;

		props = Object.assign({ widget: this.widget, attributes: this.attributes, store: this.store }, props ? props : {});

		const holder: HTMLSpanElement = (<any>this.widget).holder;
		const hydrating = !!holder.children.length;

		try {
			const wrapper = (this.#wrapper = new Wrapper(this));
			const p = { wrapper, props, styles: this.styles, holder, hydrating };
			this.#instance = hydrating ? hydrate(Widget, { target: holder, props: p }) : mount(Widget, { target: holder, props: p });
		} catch (exc) {
			this.#mounted = false;
			console.log(`Error rendering widget "${this.widget.localName}":`);
			console.log(exc.stack);
		}
	}

	unmount() {
		if (!this.#mounted) return;
		this.#mounted = false;

		const instance = this.#instance;
		this.#instance = void 0;
		this.#wrapper = void 0;
		instance && unmount(instance);
	}

	refresh() {
		this.#wrapper ? this.#wrapper.change() : this.render();
	}
}
