import type { URI } from '@beyond-js/kernel/routing';
import type { PageURI } from '@beyond-js/widgets/routing';
import type { BeyondWidget } from '@beyond-js/widgets/render';
import type { IPageWidgetController } from '@beyond-js/widgets/controller';
import { SvelteWidgetController } from '@beyond-js/svelte-widgets/base';
import { manager } from '@beyond-js/widgets/routing';

export /*bundle*/
abstract class PageSvelteWidgetController extends SvelteWidgetController implements IPageWidgetController {
	#uri: PageURI;
	get uri() {
		return this.#uri;
	}

	mount() {
		return super.mount({ uri: this.#uri });
	}

	onQueryStringChange({ qs }: { qs: URI['qs'] }) {
		void qs;
	}

	async initialise() {
		const { widget } = this;
		const { uri } = manager.pages.obtain({ widget: <BeyondWidget>widget });
		uri.on('change', this.onQueryStringChange.bind(this));
		this.#uri = uri;

		await super.initialise();
	}
}
