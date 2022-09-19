import {WidgetServerController, IWidgetRendered} from "@beyond-js/widgets/controller";

export /*bundle*/
abstract class SvelteWidgetController extends WidgetServerController {
    render(props: Record<string, any>): IWidgetRendered {
        if (!this.Widget) {
            return {errors: [`Widget "${this.element}" does not export a Widget class`]};
        }

        // Render the widget
        try {
            const Widget = require('./widget.svelte').default;
            const p = {Widget: this.Widget, styles: this.styles, props};
            const {html} = Widget.render(p);
            return {html};
        } catch (exc) {
            return {errors: [exc.message]};
        }
    }
}
