import { TemplateRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { IfUndefinedChangesDirective } from './if-undefined-changes.directive';

describe('IfUndefinedChangesDirective', () => {

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
        const directive = TestBed.runInInjectionContext(() => new IfUndefinedChangesDirective());

        // Act
        directive.libIfUndefinedChanges = 'test';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalled();
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and not update from the previous value if the previous value is not undefined', () => {
        // Arrange
        const directive = TestBed.runInInjectionContext(() => new IfUndefinedChangesDirective());

        // Act
        directive.libIfUndefinedChanges = 'test';
        directive.libIfUndefinedChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(1);
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and not update from the previous value if the previous value is was undefined', () => {
        // Arrange
        const directive = TestBed.runInInjectionContext(() => new IfUndefinedChangesDirective());

        // Act
        directive.libIfUndefinedChanges = 'test';
        directive.libIfUndefinedChanges = undefined;
        directive.libIfUndefinedChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(3);
        expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(2);
    });
});
