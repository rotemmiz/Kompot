
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../App').App;

component.kompotInjector({
  MOCK_CLASS_PROP: () => {
    class Joke {
      getJoke(){
        return 'a foo walks into a bar';
      }
    }
    global.componentProps.jokeClass = new Joke();
  }
});

describe('App', () => {
  it('Using global mocks file to mock a component across app (--load option) ', async () => {
    await device.reloadReactNative(); //todo: try to remove this line
    await component.mount();
    await expect(element(by.id('mockedHeader'))).toBeVisible();
    await expect(element(by.text('Mocked Header with prop: Nir'))).toBeVisible();
  });

  it('mocking a prop that is a class', async () => {
    await component.withMocks(['MOCK_CLASS_PROP']).mount();
    await expect(element(by.id('jokeClass'))).toBeVisible();
    await expect(element(by.text('a foo walks into a bar'))).toBeVisible();
  });
});