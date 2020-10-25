import { IfUndefinedChangesDirective } from './if-undefined-changes.directive';

describe('IfUndefinedChangesDirective', () => {

    const viewContainerRefMock = { createEmbeddedView: () => { }, clear: () => { } };

    beforeEach(() => {
        spyOn(viewContainerRefMock, 'createEmbeddedView');
        spyOn(viewContainerRefMock, 'clear');
    });

    it('should create embedded view without clear if there is no previous value yet', () => {
        // Arrange
        const directive = new IfUndefinedChangesDirective(viewContainerRefMock as any, null);

        // Act
        directive.ifUndefinedChanges = 'test';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalled();
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and not update from the previous value if the previous value is not undefined', () => {
        // Arrange
        const directive = new IfUndefinedChangesDirective(viewContainerRefMock as any, null);

        // Act
        directive.ifUndefinedChanges = 'test';
        directive.ifUndefinedChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(1);
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and not update from the previous value if the previous value is was undefined', () => {
        // Arrange
        const directive = new IfUndefinedChangesDirective(viewContainerRefMock as any, null);

        // Act
        directive.ifUndefinedChanges = 'test';
        directive.ifUndefinedChanges = undefined;
        directive.ifUndefinedChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(3);
        expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(2);
    });
});
