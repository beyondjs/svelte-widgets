import {WidgetClientController} from '@beyond-js/widgets/controller';
import {Wrapper} from "./wrapper";

export /*bundle*/
abstract class SvelteWidgetController extends WidgetClientController {
    #wrapper: Wrapper;

    mount(props?: Record<string, any>) {
        if (!this.Widget) {
            return {errors: [`Widget "${this.element}" does not export a Widget class`]};
        }

        props = Object.assign({
            widget: this.widget,
            attributes: this.attributes,
            store: this.store
        }, props ? props : {});

        const holder: HTMLSpanElement = (<any>this.widget).holder;
        const hydrate = !!holder.children.length;

        try {
            const wrapper = this.#wrapper = new Wrapper(this);
            const p = {wrapper, props, styles: this.styles, holder: (<any>this.widget).holder};
            const Widget = require('./widget.svelte').default;
            new Widget({target: holder, hydrate, props: p});
        } catch (exc) {
            console.log(`Error rendering widget "${this.widget.localName}":`);
            console.log(exc.stack);
        }
    }

    unmount() {
    }

    refresh() {
        this.#wrapper.changed();
    }
}
