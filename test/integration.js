'use strict';

var assert = require('assert');

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver');

var makeSelector = webdriver.By.css;
var keys = webdriver.Key;
var port = process.env.NODE_TEST_PORT || 8002;

before(function(done) {
  require('./server')(__dirname + '/..', port, done);
  chrome.setDefaultService(
    new chrome.ServiceBuilder(chromeDriver.path).build()
  );
});

beforeEach(function() {
  this.driver = new webdriver.Builder().
     withCapabilities(webdriver.Capabilities.chrome()).
     build();

  this.timeout(0);

  return this.driver.get('http://localhost:' + port);
});

afterEach(function() {
  return this.driver.quit();
});

it('includes the application name in the page title', function() {
  this.timeout(6000);

  return this.driver.getTitle().then(function(titleText) {
    assert(/TodoMVC/.test(titleText));
  });
});

it('adds new items to the list', function() {
  var driver = this.driver;
  return driver.findElement(makeSelector('#new-todo'))
    .then(function(textInput) {
      return textInput.sendKeys('clean Batmobile', keys.ENTER);
    }).then(function() {
      return driver.findElements(makeSelector('#todo-list li'));
    }).then(function(items) {
      assert.equal(items.length, 1);

      return items[0].getText();
    }).then(function(text) {
      assert.equal(text, 'clean Batmobile');
    });
});
