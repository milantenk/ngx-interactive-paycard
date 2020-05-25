import { Directive, ViewContainerRef, TemplateRef, Input, HostListener, HostBinding } from '@angular/core';

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
        console.log("IfChangesDirective -> @Input -> this.currentValue", this.currentValue)
    console.log("IfChangesDirective -> @Input -> val", val)
        
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
            this.currentValue = val;
        } else if (val !== this.currentValue && (!this.currentValue || !val)) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
        }
    }
}