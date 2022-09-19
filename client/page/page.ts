import {SvelteWidgetController} from '@beyond-js/svelte-widgets/base';
import {PageURI} from '@beyond-js/widgets/routing';

export /*bundle*/
abstract class PageSvelteWidgetController extends SvelteWidgetController {
    #uri: PageURI;
    get uri() {
        return this.#uri;
    }

    mount() {
        return super.mount({uri: this.#uri});
    }

    async initialise() {
        this.#uri = new PageURI({widget: <any>this.widget});
        await super.initialise();
    }
}
