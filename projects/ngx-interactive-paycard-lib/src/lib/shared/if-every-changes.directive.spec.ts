import { TemplateRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { IfEveryChangesDirective } from './if-every-changes.directive';

describe('IfEveryChangesDirective', () => {

    const viewContainerRefMock = { createEmbeddedView: () => { }, clear: () => { } };

    beforeEach(async () => {
        viewContainerRefMock.createEmbeddedView = vi.fn();
        viewContainerRefMock.clear = vi.fn();
        await TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                { provide: ViewContainerRef, useValue: viewContainerRefMock },
                { provide: TemplateRef, useValue: null }
            ]
        }).compileComponents();
    });

    it('should create embedded view without clear if there is no previous value yet', () => {
        // Arrange
        const directive = TestBed.runInInjectionContext(() => new IfEveryChangesDirective());

        // Act
        directive.ifEveryChanges = 'test';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalled();
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and update from the previous value if the value changed', () => {
        // Arrange
        const directive = TestBed.runInInjectionContext(() => new IfEveryChangesDirective());

        // Act
        directive.ifEveryChanges = 'test';
        directive.ifEveryChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(2);
        expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(1);
    });

    it('should create embedded view and not update if the value does not change', () => {
        // Arrange
        const directive = TestBed.runInInjectionContext(() => new IfEveryChangesDirective());

        // Act
        directive.ifEveryChanges = 'test';
        directive.ifEveryChanges = 'test2';
        directive.ifEveryChanges = 'test2';
        directive.ifEveryChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(2);
        expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(1);
    });
});
