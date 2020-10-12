import { AppPage } from './app.po';
import { browser, by, element, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display 3 input elements', () => {
    page.navigateTo();
    expect(page.getInputElementsNumber().count()).toEqual(3);
  })

  it('should display 2 select elements', () => {
    page.navigateTo();
    expect(page.getSelectElementsNumber().count()).toEqual(2);
  })

  it('should check if the submit button exists', () => {
    page.navigateTo();
    expect(page.getButtonText()).toBeDefined();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
