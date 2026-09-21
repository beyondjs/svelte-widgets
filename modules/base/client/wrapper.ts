import type { SvelteWidgetController } from './controller';

/**
 * What the root component reads of its controller: the current view component, and a version that the
 * controller advances when the module of the widget is updated, which the component reacts to
 */
export class Wrapper {
	#Widget: SvelteWidgetController;
	get Widget(): any {
		return this.#Widget.Widget;
	}

	// Property changed is overwritten by the root component to get notified about updates
	changed = (): void => void 0;

	#version = 0;
	get version() {
		return this.#version;
	}

	change() {
		this.#version++;
		this.changed();
	}

	constructor(Widget: SvelteWidgetController) {
		this.#Widget = Widget;
	}
}
