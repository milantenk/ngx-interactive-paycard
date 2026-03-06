import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// Used by animations, see following issue for expanition:
// https://github.com/angular/angular/issues/29439
@Directive({
    selector: '[ifEveryChanges]'
})
export class IfEveryChangesDirective {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);
    private currentValue: any;
    private hasView = false;

    @Input() set ifEveryChanges(val: any) {
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
            this.currentValue = val;
        } else if (val !== this.currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
        }
    }
}
