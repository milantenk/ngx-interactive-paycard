import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

// Used by animations, see following issue for expanition:
// https://github.com/angular/angular/issues/29439
@Directive({
    selector: '[ifChanges]'
})
export class IfChangesDirective {
    private currentValue: any;
    private hasView = false;

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>
    ) { }

    @Input() set ifChanges(val: any) {
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (val !== this.currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
        }
    }
}