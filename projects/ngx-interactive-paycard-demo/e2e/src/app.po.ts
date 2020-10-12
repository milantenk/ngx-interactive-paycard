import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getInputElementsNumber() {
    return element.all(by.css('input'));
  }

  getSelectElementsNumber() {
    return element.all(by.css('select'));
  }

  getButtonText() {
    return element(by.buttonText('Submit')).getText() as Promise<string>;
  }

  getElementById(id: string) {
    return element(by.id(id));
  }
}


