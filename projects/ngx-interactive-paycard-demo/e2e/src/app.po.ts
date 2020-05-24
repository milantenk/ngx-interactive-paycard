import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getButtonText() {
    return element(by.buttonText('Submit')).getText() as Promise<string>;
  }
}
