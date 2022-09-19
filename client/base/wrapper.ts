import type {SvelteWidgetController} from "./controller";

export class Wrapper {
    #Widget: SvelteWidgetController;
    get Widget(): any {
        return this.#Widget.Widget;
    }

    // Property changed should be overwritten to get notified about HMR changes
    changed = (): void => void 0;

    constructor(Widget: SvelteWidgetController) {
        this.#Widget = Widget;
    }
}
