import { WidgetServerController, IWidgetRendered } from '@beyond-js/widgets/controller';
import { render } from 'svelte/server';
import Widget from './widget.svelte';

/**
 * The server controller of a widget whose view is a Svelte 5 component: renders the view and its
 * stylesheet links to a string with the Svelte 5 server renderer, which the client hydrates
 */
export /*bundle*/
abstract class SvelteWidgetController extends WidgetServerController {
	render(props: Record<string, any>): IWidgetRendered {
		if (!this.Widget) {
			return { errors: [`Widget "${this.element}" does not export a Widget class`] };
		}

		// Render the widget
		try {
			const p = { Widget: this.Widget, styles: this.styles, props };
			const { body } = render(Widget, { props: p });
			return { html: body };
		} catch (exc) {
			return { errors: [exc.message] };
		}
	}
}
