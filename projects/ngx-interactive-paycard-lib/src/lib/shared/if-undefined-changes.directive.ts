import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// Used by animations, see following issue for expanition:
// https://github.com/angular/angular/issues/29439
@Directive({
    selector: '[libIfUndefinedChanges]'
})
export class IfUndefinedChangesDirective {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly templateRef = inject(TemplateRef);
    private currentValue: unknown;
    private hasView = false;

    @Input() set libIfUndefinedChanges(val: unknown) {
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
