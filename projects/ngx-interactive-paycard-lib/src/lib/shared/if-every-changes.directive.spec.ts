import { IfEveryChangesDirective } from './if-every-changes.directive';

describe('IfEveryChangesDirective', () => {

    const viewContainerRefMock = { createEmbeddedView: () => { }, clear: () => { } };

    beforeEach(() => {
        spyOn(viewContainerRefMock, 'createEmbeddedView');
        spyOn(viewContainerRefMock, 'clear');
    });

    it('should create embedded view without clear if there is no previous value yet', () => {
        // Arrange
        const directive = new IfEveryChangesDirective(viewContainerRefMock as any, null);

        // Act
        directive.ifEveryChanges = 'test';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalled();
        expect(viewContainerRefMock.clear).not.toHaveBeenCalled();
    });

    it('should create embedded view and update from the previous value if the value changed', () => {
        // Arrange
        const directive = new IfEveryChangesDirective(viewContainerRefMock as any, null);

        // Act
        directive.ifEveryChanges = 'test';
        directive.ifEveryChanges = 'test2';

        // Assert
        expect(viewContainerRefMock.createEmbeddedView).toHaveBeenCalledTimes(2);
        expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(1);
    });

    it('should create embedded view and not update if the value does not change', () => {
        // Arrange
        const directive = new IfEveryChangesDirective(viewContainerRefMock as any, null);

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
