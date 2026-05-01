(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.window = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var lib = require('../common/Lib');
var extend = require('extend');
var analyticsClient = require('../common/analytics/clientMixin');
var DeathQueue = require('./DeathQueue');
var ClientMessages = require('./ClientMessages');
var clientMessages = new ClientMessages();
var deathQueue = new DeathQueue();
var messageListeners = new Map();
analyticsClient(exports);
exports.getDisabledState = function (plugin, callback) {
  if (lib.isFunction(plugin)) {
    callback = plugin;
    plugin = 'core';
  } else {
    plugin = plugin || 'core';
  }
  exports.getConfigurationItem(plugin + '.disabled', false, callback);
};
exports.setDisabledState = function (plugin, value, callback) {
  if (lib.isFunction(value)) {
    callback = value;
    value = plugin;
    plugin = 'core';
  } else {
    plugin = plugin || 'core';
  }
  exports.setConfigurationItem(plugin + '.disabled', value, callback);
};
exports.toggleDisabledState = function (plugin, callback) {
  if (lib.isFunction(plugin)) {
    callback = plugin;
    plugin = 'core';
  } else {
    plugin = plugin || 'core';
  }
  exports.getDisabledState(plugin, function (value) {
    value = !value;
    exports.setDisabledState(plugin, value, callback);
  });
};
exports.getConfigurationItem = function (name, defaultValue, callback) {
  if (!name) {
    callback(defaultValue);
    return;
  }
  exports.sendMessage('sq.getConfigurationItem', name, callback);
};
exports.getConfiguration = function (callback) {
  exports.sendMessage('sq.getConfiguration', null, callback);
};
exports.getParameters = function (callback) {
  exports.sendMessage('sq.getParameters', null, callback);
};
exports.setParameters = function (data, callback) {
  exports.sendMessage('sq.setParameters', data, callback);
};
exports.setConfigurationItem = function (name, value, callback) {
  exports.sendMessage('sq.setConfigurationItem', {
    name: name,
    value: value
  }, callback);
};
exports.setConfiguration = function (data, callback) {
  exports.sendMessage('sq.setConfiguration', data, callback);
};
exports.hidePanel = function () {
  window.close();
};
exports.openTab = function (url, callback) {
  chrome.tabs.create({
    url: url
  }, callback);
};
exports.openConfigurationWindow = function (panel, callback) {
  if (lib.isString(panel)) {
    exports.sendMessage('sq.openConfigurationWindow', {
      panel: panel
    }, callback);
  } else {
    exports.sendMessage('sq.openConfigurationWindow', panel);
  }
};
exports.closeConfigurationWindow = function (callback) {
  exports.sendMessage('sq.closeConfigurationWindow', callback);
};
exports.sendMessage = function (action, data, callback) {
  clientMessages.sendMessage(action, data, callback);
};
exports.addMessageListener = function (action, callback) {
  if (action === 'detach') {
    deathQueue.add(callback);
    return;
  }
  if (callback === undefined) {
    callback = defaultCallback;
  }
  messageListeners.set(callback, function (data, sender, sendResponse) {
    if (sender.tab || !data.hasOwnProperty('action') || !('timestamp' in data) || data.action !== action) {
      return;
    }
    return callback(data.payload, sendResponse);
  });
  chrome.runtime.onMessage.addListener(messageListeners.get(callback));
};
exports.removeMessageListener = function (action, callback) {
  if (messageListeners.has(callback)) {
    try {
      chrome.runtime.onMessage.removeListener(messageListeners.get(callback));
    } catch (e) {}
    messageListeners["delete"](callback);
  }
};
exports.t = require('./clientTranslate');
exports.getAssetsUrl = function (callback) {
  callback(chrome.runtime.getURL(''));
};
exports.getCurrentWindowUrl = function (callback) {
  if (lib.isFunction(callback)) {
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function (tabs) {
      if (tabs.length > 0) {
        callback(tabs[0].url, tabs[0].status, tabs[0].id);
        return;
      }
      callback('');
    });
  } else {
    return new Promise(function (resolve, reject) {
      chrome.tabs.query({
        currentWindow: true,
        active: true
      }, function (tabs) {
        if (tabs.length > 0) {
          resolve({
            url: tabs[0].url,
            status: tabs[0].status,
            id: tabs[0].id
          });
          return;
        }
        reject('Not found');
      });
    });
  }
};
exports.decode = function (value) {
  return exports.entities.decode(value);
};
exports.entities = require('../common/utils/entities')();
deathQueue.setSendMessage(exports.sendMessage);
function defaultCallback(data, sendResponse) {
  return sendResponse(data);
}

},{"../common/Lib":7,"../common/analytics/clientMixin":8,"../common/utils/entities":147,"./ClientMessages":2,"./DeathQueue":3,"./clientTranslate":4,"extend":164}],2:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var isFunction = require('../common/lib/isFunction');
var ClientMessages = function () {
  function ClientMessages() {
    _classCallCheck(this, ClientMessages);
    this._port = chrome.runtime.connect();
    this._counter = 0;
    this._port.onMessage.addListener(this.onMessageListener.bind(this));
    this._innerListeners = new Map();
    this._listeners = new Map();
  }
  return _createClass(ClientMessages, [{
    key: "port",
    get: function get() {
      return this._port;
    }
  }, {
    key: "counter",
    get: function get() {
      this._counter++;
      if (this._counter > 2000000) {
        this._counter = 0;
      }
      return this._counter;
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(action, data, callback) {
      if (isFunction(data)) {
        callback = data;
        data = {};
      }
      var message = {
        payload: {
          action: action,
          data: data
        },
        timestamp: new Date().getTime() + '.' + this.counter
      };
      if (callback !== undefined) {
        this._innerListeners.set(message.timestamp, callback);
      }
      try {
        this.port.postMessage(message);
      } catch (ignore) {}
    }
  }, {
    key: "getResponseFunction",
    value: function getResponseFunction(message) {
      var _this = this;
      return function (response) {
        var answer = {
          timestamp: message.timestamp,
          payload: response
        };
        try {
          _this.port.postMessage(answer);
        } catch (ignore) {}
      };
    }
  }, {
    key: "onMessageListener",
    value: function onMessageListener(message) {
      var _this2 = this;
      if (!message || _typeof(message) !== 'object' || !'timestamp' in message) {
        return;
      }
      if ('action' in message) {
        if (this._listeners.has(message.action)) {
          this._listeners.get(message.action).forEach(function (process) {
            return process(message.payload, _this2.getResponseFunction(message));
          });
        }
        return;
      }
      if (!this._innerListeners.has(message.timestamp)) {
        return;
      }
      this._innerListeners.get(message.timestamp)(message.payload);
      this._innerListeners["delete"](message.timestamp);
    }
  }, {
    key: "addMessageListener",
    value: function addMessageListener(action, callback) {
      if (!this._listeners.has(action)) {
        this._listeners.set(action, []);
      }
      this._listeners.get(action).push(callback);
    }
  }, {
    key: "removeMessageListener",
    value: function removeMessageListener(action, callback) {
      if (!this._listeners.has(action)) {
        return;
      }
      var index = this._listeners.get(action).indexOf(callback);
      if (index !== -1) {
        this._listeners.get(action).splice(index, 1);
      }
    }
  }]);
}();
module.exports = ClientMessages;

},{"../common/lib/isFunction":67}],3:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var DeathQueue = function () {
  function DeathQueue() {
    _classCallCheck(this, DeathQueue);
    this._callbacks = new Set();
    this._running = false;
    this._sendMessage = function () {};
    this.processAlive = this._checkAlive.bind(this);
  }
  return _createClass(DeathQueue, [{
    key: "add",
    value: function add(callback) {
      if (!this._callbacks.has(callback)) {
        this._callbacks.add(callback);
      }
      if (!this._running) {
        this.run();
      }
    }
  }, {
    key: "run",
    value: function run() {
      this._running = true;
      this._checkAlive();
    }
  }, {
    key: "stop",
    value: function stop() {
      this._running = false;
    }
  }, {
    key: "setSendMessage",
    value: function setSendMessage(callback) {
      this._sendMessage = callback;
    }
  }, {
    key: "_isAlive",
    value: function _isAlive() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this._sendMessage('sq.alive', function () {
          if (arguments.length === 0 && chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: "_checkAlive",
    value: function _checkAlive() {
      var _this2 = this;
      if (this._running) {
        this._isAlive().then(function () {
          return setTimeout(_this2.processAlive, 1000);
        })["catch"](function () {
          return _this2._processCallbacks();
        });
      }
    }
  }, {
    key: "_processCallbacks",
    value: function _processCallbacks() {
      this._running = false;
      this._callbacks.forEach(function (callback) {
        return callback();
      });
      this._callbacks.clear();
    }
  }]);
}();
module.exports = DeathQueue;

},{}],4:[function(require,module,exports){
'use strict';

var entities = require('../common/utils/entities')();
module.exports = function (messageId, setCallback) {
  setCallback(entities.decode(chrome.i18n.getMessage(messageId)));
};

},{"../common/utils/entities":147}],5:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var ignore = require('./lib/ignore');
var lib = require('./Lib');
var dom = require('./dom/main');
var extend = require('extend');
var entities = new (require('html-entities').AllHtmlEntities)();
var ErrorDisable = require('./basePlugin/ErrorDisable');
var normalizeNumber = require('./utils/normalizeNumber');
var BasePlugin = function () {
  function BasePlugin() {
    _classCallCheck(this, BasePlugin);
    this.name = null;
    this.parameters = {};
    this.configuration = {};
    this.match = [];
    this.except = [];
    this.urls = {};
    this.requestUrls = {};
    this.googleHl = null;
    this.googleGl = null;
    this._assetsUrl = '';
    this._uuid = null;
    this._searchQuery = '';
    this._requestParamListener = null;
    this._requestParamsAllListener = null;
    this._requestParamsColListener = null;
    this._requestParamsRowListener = null;
    this._showParameterSourceListener = null;
    this._bodyReadyRepeats = 0;
    this._bodyReadyTimer = null;
    this._isBodyReady = null;
    this._elements = new Set();
    this.entities = entities;
    this.processUpdateConfiguration = this.handleUpdateConfiguration.bind(this);
    this.processDone = this.handleDone.bind(this);
    this.processError = this.handleError.bind(this);
    this.processRender = this.render.bind(this);
  }
  return _createClass(BasePlugin, [{
    key: "_processIsBodyReady",
    value: function _processIsBodyReady(resolve) {
      var _this = this;
      if (!document.body || document.body === null || document.body === undefined) {
        this._bodyReadyRepeats++;
        if (this._bodyReadyRepeats < this.MAX_BODY_WATING) {
          if (this._bodyReadyTimer !== null) {
            clearTimeout(this._bodyReadyTimer);
          }
          this._bodyReadyTimer = setTimeout(function () {
            return _this._processIsBodyReady(resolve);
          }, 100);
        } else {
          throw new Error('Body not ready in given time');
        }
      } else {
        resolve();
      }
    }
  }, {
    key: "isBodyReady",
    get: function get() {
      if (this._isBodyReady === null) {
        this._isBodyReady = new Promise(this._processIsBodyReady.bind(this));
      }
      return this._isBodyReady;
    }
  }, {
    key: "getAssetUrl",
    value: function getAssetUrl(url) {
      return this._assetsUrl + url;
    }
  }, {
    key: "getUUID",
    value: function getUUID() {
      if (this._uuid === null) {
        this._uuid = lib.getUUID();
      }
      return this._uuid;
    }
  }, {
    key: "UUID",
    get: function get() {
      return this.getUUID();
    }
  }, {
    key: "checkMatch",
    value: function checkMatch() {
      try {
        if (!document || !document.location || !document.location.href) {
          return false;
        }
      } catch (ignore) {
        return false;
      }
      var url = document.location.href;
      var cleanUrl = lib.clearUri(url);
      var match = function match(regexp) {
        return url.match(new RegExp(regexp, 'i')) || cleanUrl.match(new RegExp(regexp, 'i'));
      };
      if (this.match.length > 0 && !this.match.some(match)) {
        return false;
      }
      return !(this.except.length > 0 && this.except.some(match));
    }
  }, {
    key: "checkState",
    value: function checkState() {
      if (typeof this.configuration === 'undefined') {
        return false;
      }
      if ('disabled' in this.configuration && this.configuration.disabled === true) {
        return false;
      }
      return this.checkMatch();
    }
  }, {
    key: "searchQuery",
    get: function get() {
      return this._searchQuery;
    },
    set: function set(value) {
      this._searchQuery = value;
    }
  }, {
    key: "process",
    value: function process() {
      return true;
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      this.getAssetsUrl().then(function (url) {
        _this2._assetsUrl = url;
        return _this2.getCoreState();
      }).then(function (response) {
        if (!('disabled' in response) || !response.disabled) {
          return _this2.getConfigurationBrunch();
        } else {
          throw new ErrorDisable('Core disabled');
        }
      }).then(function (response) {
        _this2.configuration = response;
        if (_this2.checkState()) {
          return _this2.getPluginParameters();
        } else {
          throw new ErrorDisable('Plugin disabled or not for this URL');
        }
      }).then(function (response) {
        _this2.parameters = response;
        _this2.process();
      })["catch"](this.processError);
      this.addMessageListener('sq.updateConfiguration', this.processUpdateConfiguration);
      this.addMessageListener('detach', this.processDone);
    }
  }, {
    key: "parseRelAttr",
    value: function parseRelAttr(rel, skipInnerCheck) {
      if (!rel) {
        return null;
      }
      var parts = rel.split(' ');
      if (parts.length !== 2) {
        return null;
      }
      parts[1] = parts[1].split('_');
      var result = {
        urlHash: parts[0],
        requestUrlHash: parts[1][0],
        paramId: parts[1][1]
      };
      if (skipInnerCheck !== true && result.requestUrlHash !== 'x' && !this.requestUrls.hasOwnProperty(result.requestUrlHash)) {
        return null;
      }
      return result;
    }
  }, {
    key: "processRequestUrls",
    value: function processRequestUrls(requestUrls, forceRequest) {
      var _this3 = this;
      forceRequest = forceRequest || false;
      forceRequest = this.configuration.mode === lib.SEOQUAKE_MODE_BY_REQUEST && !forceRequest;
      var results = [];
      var _loop = function _loop() {
        if (!requestUrls.hasOwnProperty(requestUrlHash)) {
          return 1;
        }
        var renderParams = extend(true, {
          values: {},
          requestUrlHash: requestUrlHash
        }, requestUrls[requestUrlHash]);
        var request = {
          render: renderParams,
          onlyCache: forceRequest
        };
        var initialValue = forceRequest ? lib.SEOQUAKE_RESULT_QUESTION : lib.SEOQUAKE_RESULT_WAIT;
        renderParams.params.forEach(function (paramId) {
          return renderParams.values[paramId] = initialValue;
        });
        _this3.render(renderParams);
        results.push(_this3.sendMessage('sq.requestParameter', request).then(_this3.processRender));
      };
      for (var requestUrlHash in requestUrls) {
        if (_loop()) continue;
      }
      return Promise.all(results);
    }
  }, {
    key: "renderErrorValue",
    value: function renderErrorValue(button, href) {
      button.href = href;
      var result = false;
      var errorsCounter = dom.data(button, 'error-clicks');
      if (!errorsCounter) {
        errorsCounter = 1;
      }
      if (errorsCounter < 3) {
        button.addEventListener('click', this.requestParamListener, true);
        errorsCounter++;
      } else {
        button.addEventListener('click', this.showParameterSourceListener, true);
        result = true;
      }
      dom.data(button, 'error-clicks', errorsCounter);
      return result;
    }
  }, {
    key: "renderValue",
    value: function renderValue(button, text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
        dom.attr(button, 'title', display.value);
      }
      dom.text(button, text);
    }
  }, {
    key: "render",
    value: function render(renderParams) {
      var _this4 = this;
      if (renderParams === undefined || typeof renderParams.requestUrlHash === 'undefined' || !renderParams.requestUrlHash) {
        return false;
      }
      var hash = renderParams.requestUrlHash;
      renderParams.params.forEach(function (paramId) {
        if (!(paramId in renderParams.values)) {
          return;
        }
        var selector = 'a[rel~="' + hash + '_' + paramId + '"]';
        var href = 'url-s' in _this4.requestUrls[hash] && paramId in _this4.requestUrls[hash]['url-s'] ? _this4.requestUrls[hash]['url-s'][paramId] : _this4.requestUrls[hash]['url-r'];
        var na = 'url-na' in _this4.requestUrls[hash] && paramId in _this4.requestUrls[hash]['url-na'] ? _this4.requestUrls[hash]['url-na'][paramId] : undefined;
        var links = dom.findAll(selector);
        links.forEach(function (link) {
          var text = _this4.entities.decode(renderParams.values[paramId]);
          dom.attr(link, 'data-value', _this4.entities.decode(renderParams.values[paramId]));
          link.removeEventListener('click', _this4.requestParamListener, true);
          switch (renderParams.values[paramId]) {
            case lib.SEOQUAKE_RESULT_NODATA:
              dom.text(link, text);
              link.href = na || href;
              link.style.color = '#2b94e1';
              link.addEventListener('click', _this4.showParameterSourceListener, true);
              break;
            case lib.SEOQUAKE_RESULT_ERROR:
              dom.text(link, text);
              _this4.renderErrorValue(link, href);
              link.style.color = 'red';
              break;
            case lib.SEOQUAKE_RESULT_QUESTION:
              dom.text(link, text);
              link.href = '#';
              link.style.color = '#2b94e1';
              link.addEventListener('click', _this4.requestParamListener, true);
              break;
            case lib.SEOQUAKE_RESULT_WAIT:
              dom.text(link, text);
              link.href = '#';
              link.style.color = '#2b94e1';
              break;
            case lib.SEOQUAKE_RESULT_YES:
            default:
              _this4.renderValue(link, text);
              link.href = href;
              link.style.color = '#2b94e1';
              link.addEventListener('click', _this4.showParameterSourceListener, true);
              break;
          }
        });
      });
      this.dispatchEvent('render', renderParams);
      return true;
    }
  }, {
    key: "parseElement",
    value: function parseElement(element) {
      var textValue;
      if (dom.hasAttr(element, 'data-value')) {
        textValue = dom.attr(element, 'data-value');
      } else {
        textValue = dom.text(element);
      }
      if ([lib.SEOQUAKE_RESULT_WAIT, lib.SEOQUAKE_RESULT_QUESTION, lib.SEOQUAKE_RESULT_ERROR].indexOf(textValue) === -1) {
        return false;
      }
      if (!dom.hasAttr(element, 'rel')) {
        return false;
      }
      var rel = this.parseRelAttr(dom.attr(element, 'rel'));
      if (!rel) {
        return false;
      }
      return rel;
    }
  }, {
    key: "requestParameterHandler",
    value: function requestParameterHandler(link) {
      var _this5 = this;
      var rel = this.parseElement(link);
      if (!rel) {
        return Promise.reject('Link contains wrong data or not SEOquake link');
      }
      var requestUrls = {};
      requestUrls[rel.requestUrlHash] = extend(true, {}, this.requestUrls[rel.requestUrlHash]);
      requestUrls[rel.requestUrlHash].params = [rel.paramId];
      this.registerEvent(this.name, 'requestParameterHandler', rel.paramId);
      return this.processRequestUrls(requestUrls, true).then(function () {
        return _this5.dispatchEvent('parameterReady', rel);
      });
    }
  }, {
    key: "requestParamListener",
    get: function get() {
      var _this6 = this;
      if (this._requestParamListener === null) {
        this._requestParamListener = function (event) {
          event.preventDefault();
          event.stopPropagation();
          _this6.requestParameterHandler(event.currentTarget);
        };
      }
      return this._requestParamListener;
    }
  }, {
    key: "requestParameters",
    value: function requestParameters(paramsEls) {
      var requestUrls = {};
      for (var i = 0, l = paramsEls.length; i < l; i++) {
        var rel = this.parseElement(paramsEls[i]);
        if (!rel) {
          continue;
        }
        if (!(rel.requestUrlHash in requestUrls)) {
          requestUrls[rel.requestUrlHash] = extend(true, {}, this.requestUrls[rel.requestUrlHash]);
        }
      }
      return this.processRequestUrls(requestUrls, true);
    }
  }, {
    key: "requestParamsAllListener",
    get: function get() {
      var _this7 = this;
      if (this._requestParamsAllListener === null) {
        this._requestParamsAllListener = function (event) {
          event.preventDefault();
          event.stopPropagation();
          _this7.registerEvent(_this7.name, 'requestAllParameters');
          return _this7.requestParameters(document.querySelectorAll('.seoquake-params-link')).then(function () {
            return _this7.dispatchEvent('parametersAllReady');
          });
        };
      }
      return this._requestParamsAllListener;
    }
  }, {
    key: "requestParamsColListener",
    get: function get() {
      var _this8 = this;
      if (this._requestParamsColListener === null) {
        this._requestParamsColListener = function (event) {
          event.preventDefault();
          event.stopPropagation();
          var paramId = event.currentTarget.getAttribute('rel');
          var paramsEls = document.querySelectorAll('.seoquake-params-link[rel$="_' + paramId + '"]');
          _this8.registerEvent(_this8.name, 'requestColParameters', paramId);
          _this8.requestParameters(paramsEls).then(function () {
            return _this8.dispatchEvent('parametersColReady', paramId);
          });
        };
      }
      return this._requestParamsColListener;
    }
  }, {
    key: "requestParamsRowListener",
    get: function get() {
      var _this9 = this;
      if (this._requestParamsRowListener === null) {
        this._requestParamsRowListener = function (event) {
          event.preventDefault();
          event.stopPropagation();
          var target = event.currentTarget;
          var paramsTable = target.parentNode;
          var paramsEls = paramsTable.querySelectorAll('.seoquake-params-link');
          _this9.registerEvent(_this9.name, 'requestRowParameters');
          return _this9.requestParameters(paramsEls).then(function () {
            return _this9.dispatchEvent('parametersRowReady', target);
          });
        };
      }
      return this._requestParamsRowListener;
    }
  }, {
    key: "showParameterSourceListener",
    get: function get() {
      var _this10 = this;
      if (this._showParameterSourceListener === null) {
        this._showParameterSourceListener = function (event) {
          var parameterId = '';
          if (event.currentTarget.hasAttribute('rel')) {
            var rel = _this10.parseRelAttr(event.currentTarget.getAttribute('rel'), true);
            if (rel) {
              parameterId = rel.paramId;
            }
          }
          if (event.currentTarget.href.toString().match(/^view-source:/i) !== null) {
            event.preventDefault();
            event.stopPropagation();
            _this10._sendMessage('sq.openTab', event.currentTarget.href.toString())["catch"](ignore);
          }
          _this10.registerEvent(_this10.name, 'showParameterSource', parameterId);
        };
      }
      return this._showParameterSourceListener;
    }
  }, {
    key: "handleUpdateConfiguration",
    value: function handleUpdateConfiguration() {
      return false;
    }
  }, {
    key: "handleDone",
    value: function handleDone() {
      this._elements.forEach(function (element) {
        return dom.removeElement(element);
      });
      this._elements.clear();
      this.requestUrls = {};
      return true;
    }
  }, {
    key: "handleError",
    value: function handleError(reason) {
      if (typeof reason.name === 'undefined' || reason.name !== 'ErrorDisable') {
        ignore(reason);
      }
    }
  }]);
}();
BasePlugin.prototype.MAX_BODY_WATING = 100;
require('./basePlugin/uiMixin')(BasePlugin.prototype);
require('./utils/messengerModuleMixin')(BasePlugin.prototype);
require('./utils/eventsMixin')(BasePlugin.prototype);
module.exports = BasePlugin;

},{"./Lib":7,"./basePlugin/ErrorDisable":9,"./basePlugin/uiMixin":10,"./dom/main":33,"./lib/ignore":63,"./utils/eventsMixin":148,"./utils/messengerModuleMixin":151,"./utils/normalizeNumber":153,"extend":164,"html-entities":165}],6:[function(require,module,exports){
'use strict';

var isBodyReady = require('./dom/isBodyReady');
var ignore = require('./lib/ignore');
isBodyReady().then(function () {
  var client = require('browser/Client');
  var requestPageInfo = require('./page/PageInfo');
  var requestPageData = require('./page/PageData');
  var requestPageDiagnosis = require('./page/PageDiagnosis');
  var SeobarPlugin = require('./plugins/Seobar2Plugin');
  var NofollowPlugin = require('./plugins/NofollowPlugin');
  var GooglePlugin = require('./plugins/Google2Plugin');
  var SemrushPlugin = require('./plugins/Semrush2Plugin');
  var YahooPlugin = require('./plugins/Yahoo2Plugin');
  var YandexPlugin = require('./plugins/Yandex2Plugin');
  var BingPlugin = require('./plugins/Bing2Plugin');
  client.addMessageListener('sq.requestPageData', requestPageData);
  client.addMessageListener('sq.requestPageDiagnosis', requestPageDiagnosis);
  client.addMessageListener('sq.requestPageInfo', requestPageInfo);
  client.sendMessage('sq.documentReady');
  var seobar = new SeobarPlugin();
  seobar.setMessenger(client);
  seobar.init();
  var nofollow = new NofollowPlugin();
  nofollow.setMessenger(client);
  nofollow.init();
  var google = new GooglePlugin();
  google.setMessenger(client);
  google.init();
  var semrush = new SemrushPlugin();
  semrush.setMessenger(client);
  semrush.init();
  var yahoo = new YahooPlugin();
  yahoo.setMessenger(client);
  yahoo.init();
  var yandex = new YandexPlugin();
  yandex.setMessenger(client);
  yandex.init();
  var bing = new BingPlugin();
  bing.setMessenger(client);
  bing.init();
})["catch"](ignore);

},{"./dom/isBodyReady":31,"./lib/ignore":63,"./page/PageData":75,"./page/PageDiagnosis":76,"./page/PageInfo":77,"./plugins/Bing2Plugin":91,"./plugins/Google2Plugin":92,"./plugins/NofollowPlugin":93,"./plugins/Semrush2Plugin":94,"./plugins/Seobar2Plugin":95,"./plugins/Yahoo2Plugin":96,"./plugins/Yandex2Plugin":97,"browser/Client":1}],7:[function(require,module,exports){
'use strict';

var hexMd5 = require('./hex-md5');
var getGoogleChecksum = require('./googleChecksum');
var startsWith = require('./lib/startsWith.js');
var containsText = require('./lib/containsText.js');
var endsWith = require('./lib/endsWith.js');
exports.SEOQUAKE_MODE_ON_LOAD = 0;
exports.SEOQUAKE_MODE_BY_REQUEST = 1;
exports.SEOQUAKE_RESULT_ERROR = 'error';
exports.SEOQUAKE_RESULT_NO = 'no';
exports.SEOQUAKE_RESULT_NODATA = 'n/a';
exports.SEOQUAKE_RESULT_CAPTCHA = 'captcha';
exports.SEOQUAKE_RESULT_QUESTION = '?';
exports.SEOQUAKE_RESULT_WAIT = 'wait...';
exports.SEOQUAKE_RESULT_YES = 'yes';
exports.SEOQUAKE_SORT_ASC = 'asc';
exports.SEOQUAKE_SORT_DESC = 'desc';
exports.SEOQUAKE_TYPE_DATE = 1;
exports.SEOQUAKE_TYPE_INT = 2;
exports.SEOQUAKE_TYPE_STRING = 4;
exports.SEOQUAKE_TYPE_IP = 8;
exports.SEOQUAKE_ADBLOCK_URL = 'https://www.seoquake.com/seoadv.html?ver={seoquake_version}';
exports.SEOQUAKE_CSV_DELIMITER = ';';
exports.SEOQUAKE_MAX_HIGHLIGHT_SITES = 50;
exports.SEOQUAKE_PARAM_DELETE = 'deleted';
exports.SEOQUAKE_PARAM_FULLY_DELETE = 'fully_deleted';
exports.SEOQUAKE_PARAM_CUSTOM = 'custom';
exports.SEOQUAKE_PARAM_MODIFIED = 'modified';
exports.isEmpty = require('./lib/isEmpty');
exports.isFunction = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
exports.isArray = require('./lib/isArray');
exports.isObject = require('./lib/isObject');
exports.isString = require('./lib/isString');
exports.$A = require('./lib/arrayFrom').$A;
exports.startsWith = startsWith;
exports.containsText = containsText;
exports.endsWith = endsWith;
exports.trim = function (string) {
  string = string || '';
  return string.trim();
};
exports.trimHash = require('./lib/trimHash');
exports.cleanString = function (string) {
  string = string.replace(/([,;!\+=#@\^&~\$\/:\?\(\)\[\]\\"\*\|•·“”<>%\{\}])/ig, ' ');
  string = string.replace(/'+/g, '\'').replace(/(\s'|'(\s|$))/g, ' ');
  string = string.replace(/([\n\t\r]+)/g, ' ').replace(/([ \u00A0]{2,})/g, ' ');
  string = exports.trim(string.toLocaleLowerCase());
  return string;
};
exports.stripTags = function (string) {
  string = string.replace(/&[#0-9a-z]+;/ig, ' ');
  return string.replace(/<\/?[^>]+>/gi, ' ');
};
exports.normalizeString = function (string, bLeaveCase) {
  string = string.replace(/([\.;\+=#@\^&~\$\/:\?'\(\)\[\]\\"\*\|•·“”<>%\{\}])/ig, ' ').replace(/([\-]+)/ig, ' ');
  string = string.replace(/([\n\t\r]+)/g, ' ').replace(/([ ]{2,})/g, ' ');
  if (!bLeaveCase) {
    string = string.toLocaleLowerCase();
  }
  return string;
};
exports.sanitizeString = function (string, bLeaveCase) {
  return exports.normalizeString(exports.stripTags(string), bLeaveCase);
};
exports.stripScripts = function (string) {
  return string.replace(new RegExp('(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)', 'img'), '');
};
exports.truncate = function (string, length, replace) {
  length = length || 80;
  replace = replace || '...';
  var curLength = length - replace.length;
  if (string.length - replace.length > length) {
    string = string.substr(0, curLength) + replace;
  }
  return string;
};
exports.valuesCompare = function (a, b) {
  if (exports.isArray(a) && exports.isArray(b)) {
    return exports.arraysCompare(a, b);
  } else {
    return a == b;
  }
};
exports.arraysCompare = function (a, b) {
  var i;
  var l;
  if (a.length !== b.length) {
    return false;
  } else {
    for (i = 0, l = a.length; i < l; i++) {
      if (b.indexOf(a[i]) === -1) {
        return false;
      }
    }
  }
  return true;
};
exports.parseUri = require('./lib/parseUri').parseUri;
exports.clearUri = require('./lib/parseUri').clearUri;
exports.parseArgs = require('./lib/parseArgs').parseArgs;
exports.shortHash = require('./lib/shortHash');
exports.createRequestUrl = function (template, uri, searchQuery, uPos) {
  return template.replace(/{([^{}]+)}/ig, function (match, tag) {
    var i;
    var l;
    var value;
    var searchQueryTmp;
    tag = tag.split('|');
    tag[0] = exports.trim(tag[0]);
    if (tag[0] in uri) {
      value = uri[tag[0]];
      for (i = 1, l = tag.length; i < l; i++) {
        if (exports.trim(tag[i]) === 'encode') {
          value = value.replace(/\/\/(.+:.+@)/i, '//');
          value = encodeURIComponent(value);
        } else if (exports.trim(tag[i]) === 'trimrslash') {
          if (exports.endsWith(value, '/')) {
            value = value.substring(0, value.length - 1);
          }
        } else if (exports.trim(tag[i]) === 'md5') {
          value = hexMd5(value);
        }
      }
      return value;
    } else if (tag[0].match(/^\d+$/)) {
      return '';
    } else {
      switch (tag[0]) {
        case 'keyword':
          if (searchQuery) {
            searchQueryTmp = searchQuery;
            for (i = 1, l = tag.length; i < l; i++) {
              if (exports.trim(tag[i]) === 'encode') {
                searchQueryTmp = encodeURIComponent(searchQuery);
              }
            }
            return searchQueryTmp;
          } else {
            return '';
          }
        case 'pos':
          if (uPos && uPos !== null) {
            uri.u_pos = uPos;
            return uri.u_pos;
          } else {
            return '0';
          }
        case 'localip':
        case 'installdate':
          return '';
        case 'gchecksum':
          return getGoogleChecksum('info:' + uri.url);
        default:
          return match;
      }
    }
  });
};
exports.countFields = function (object) {
  var result = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      result++;
    }
  }
  return result;
};
exports.hex_md5 = hexMd5;
exports.getVarValueFromURL = function (url, varName) {
  return exports.parseArgs(url).get(varName);
};
exports.ip2long = require('./lib/ip2long');
exports.getUUID = require('./lib/getUUID');

},{"./googleChecksum":54,"./hex-md5":55,"./lib/arrayFrom":56,"./lib/containsText.js":58,"./lib/endsWith.js":61,"./lib/getUUID":62,"./lib/ip2long":64,"./lib/isArray":65,"./lib/isEmpty":66,"./lib/isObject":68,"./lib/isString":69,"./lib/parseArgs":70,"./lib/parseUri":71,"./lib/shortHash":72,"./lib/startsWith.js":73,"./lib/trimHash":74}],8:[function(require,module,exports){
'use strict';

var isEmpty = require('../lib/isEmpty');
module.exports = function analyticsClientMixin(client) {
  client.registerEvent = function (category, action, label) {
    if (isEmpty(category) || isEmpty(action)) {
      return;
    }
    var data = {
      category: category,
      action: action
    };
    if (label) {
      data.label = label;
    }
    this.sendMessage('sq.analyticsEvent', data);
  };
  client.registerPage = function (page) {
    if (isEmpty(page)) {
      return;
    }
    this.sendMessage('sq.analyticsPage', {
      page: page
    });
  };
};

},{"../lib/isEmpty":66}],9:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
var ErrorDisable = function (_Error) {
  function ErrorDisable(message, code) {
    var _this;
    _classCallCheck(this, ErrorDisable);
    _this = _callSuper(this, ErrorDisable, [message]);
    _this._code = code;
    _this.name = 'ErrorDisable';
    return _this;
  }
  _inherits(ErrorDisable, _Error);
  return _createClass(ErrorDisable);
}(_wrapNativeSuper(Error));
module.exports = ErrorDisable;

},{}],10:[function(require,module,exports){
'use strict';

var dom = require('../dom/main');
var lib = require('../Lib');
module.exports = function uiMixin(object) {
  object.createParameterCell = function (urlHash, param, serpItemPos) {
    serpItemPos = serpItemPos || null;
    var cell = dom('div');
    if ('icon' in param) {
      cell.appendChild(dom('IMG', {
        src: param.icon
      }));
    }
    if ('matches' in param) {
      cell.appendChild(document.createTextNode(param.title + ': '));
    }
    var link = dom('A', {
      className: 'seoquake-params-link',
      href: '',
      rel: '',
      target: '_blank'
    });
    if ('url-r' in param) {
      var requestUrl = lib.createRequestUrl(param['url-r'], this.urls[urlHash], this.searchQuery, serpItemPos);
      var requestUrlHash = lib.shortHash(requestUrl);
      if ('matches' in param) {
        if (!(requestUrlHash in this.requestUrls)) {
          this.requestUrls[requestUrlHash] = {
            params: [],
            'url-r': requestUrl
          };
        }
        if ('url-s' in param) {
          if (!('url-s' in this.requestUrls[requestUrlHash])) {
            this.requestUrls[requestUrlHash]['url-s'] = {};
          }
          if (serpItemPos) {
            this.requestUrls[requestUrlHash]['url-s'][param.id] = lib.createRequestUrl(param['url-s'], this.urls[urlHash], this.searchQuery, serpItemPos);
          } else {
            this.requestUrls[requestUrlHash]['url-s'][param.id] = lib.createRequestUrl(param['url-s'], this.urls[urlHash], this.searchQuery, null);
          }
        }
        if ('url-na' in param) {
          if (!('url-na' in this.requestUrls[requestUrlHash])) {
            this.requestUrls[requestUrlHash]['url-na'] = {};
          }
          this.requestUrls[requestUrlHash]['url-na'][param.id] = param['url-na'];
        }
        this.requestUrls[requestUrlHash].params.push(param.id);
        link.setAttribute('href', '#');
      } else {
        link.setAttribute('href', requestUrl);
        link.addEventListener('click', this.showParameterSourceListener, true);
      }
      link.setAttribute('rel', urlHash + ' ' + requestUrlHash + '_' + param.id);
    }
    if (!('matches' in param)) {
      link.appendChild(document.createTextNode(param.title));
    }
    cell.appendChild(link);
    return dom('TD', {
      className: 'seoquake-params-cell',
      title: param.name
    }, cell);
  };
  object._createParamsPanel = function (urlHash, rows, serped, nodeCounter, serpItemPos) {
    if ('rows' in this.configuration && this.configuration.rows > 0) {
      rows = this.configuration.rows;
    } else {
      rows = rows || 1;
    }
    var paramsTable = dom('TABLE');
    var paramsRow = dom('TR', {
      className: 'seoquake-params-row'
    });
    var paramsCount = lib.countFields(this.parameters);
    var paramsInRow = Math.ceil(paramsCount / rows);
    var counter = 0;
    for (var paramId in this.parameters) {
      if (!this.parameters.hasOwnProperty(paramId)) {
        continue;
      }
      if (serpItemPos) {
        paramsRow.appendChild(this.createParameterCell(urlHash, this.parameters[paramId], serpItemPos));
      } else {
        paramsRow.appendChild(this.createParameterCell(urlHash, this.parameters[paramId]));
      }
      counter++;
      if (counter % paramsInRow === 0 && counter !== paramsCount) {
        paramsTable.appendChild(paramsRow);
        paramsRow = dom('TR', {
          className: 'seoquake-params-row'
        });
        counter = 0;
      }
    }
    if (paramsRow.children.length > 0) {
      paramsTable.appendChild(paramsRow);
    }
    return dom('DIV', {
      className: 'seoquake-params-panel',
      style: 'overflow-x:auto!important;'
    }, paramsTable);
  };
  object.createParamsPanel = function (urlHash, rows, serped, nodeCounter, serpItemPos) {
    return this._createParamsPanel(urlHash, rows, serped, nodeCounter, serpItemPos);
  };
};

},{"../Lib":7,"../dom/main":33}],11:[function(require,module,exports){
'use strict';

module.exports = {
  core: {
    disabled: false,
    use_cache: true,
    request_delay: 500,
    disable_serps_pos_numbers: false,
    disable_highlight_sites: false,
    highlight_sites: 'example.com',
    highlight_sites_color: '#b6d7a8',
    export_template: 0,
    onboarding_semrush_panel: false
  },
  seobar: {
    disabled: false,
    mode: 0,
    style: 'horizontal-inpage',
    position: 'top',
    color: 'white',
    pinned: false,
    open_minimized: false,
    https: true,
    matches: '',
    excludes: '^http://localhost\n^http://127(\\.\\d){3}\n\\.(pdf|jpe?g|png|csv|docx?|txt|js|css|bmp|rtf|tiff|gif|mp3|ogg|mkv|avi|mp4|yaml|xml)(\\?.*)?$\n',
    robotsLink: false,
    sitemapLink: false,
    densityLink: true,
    linkinfoLink: true,
    diagnosisLink: true,
    pageinfoLink: true,
    siteauditLink: true
  },
  google: {
    disabled: false,
    mode: 0,
    show_hlgl: true,
    show_keyword_difficulty: true,
    onboarding_keyword_difficulty: true,
    google_hl: 'none',
    google_gl: 'none',
    show_semrush_panel: true
  },
  yahoo: {
    disabled: false,
    mode: 0,
    show_semrush_panel: true
  },
  bing: {
    disabled: false,
    mode: 0,
    show_semrush_panel: true
  },
  yandex: {
    disabled: false,
    mode: 0,
    show_semrush_panel: true
  },
  linkinfo: {
    mode: 1
  },
  internal: {
    mode: 1
  },
  external: {
    mode: 1
  },
  nofollow: {
    disabled: true
  },
  semrush: {
    disabled: false,
    limit: 20,
    mode: 0,
    show_semrush_panel: true
  },
  advanced: {
    disabled: true,
    disable_ga: false
  },
  panel: {
    mode: 0,
    last_tip: 0,
    quiz1: true,
    quiz2: false
  }
};

},{}],12:[function(require,module,exports){
'use strict';

exports.hl = {
  common: {
    'None': 'none',
    'English': 'en',
    'German': 'de',
    'French': 'fr',
    'Spanish': 'es',
    'Spanish (Latin American)': 'es-419',
    'Chinese (Simplified)': 'zh-CN',
    'Chinese (Traditional)': 'zh-TW',
    'Russian': 'ru',
    'Arabic': 'ar',
    'Portuguese (Brazil)': 'pt-BR',
    'Portuguese (Portugal)': 'pt-PT',
    'Swedish': 'sv',
    'Japanese': 'ja'
  },
  others: {
    'Luo': 'ach',
    'Afrikaans': 'af',
    'Akan': 'ak',
    'Amharic': 'am',
    'Azerbaijani': 'az',
    'Belarusian': 'be',
    'Bemba': 'bem',
    'Bulgarian': 'bg',
    'Bihari': 'bh',
    'Bengali': 'bn',
    'Breton': 'br',
    'Bosnian': 'bs',
    'Catalan': 'ca',
    'Cherokee': 'chr',
    'Kurdish (Sorani)': 'ckb',
    'Corsican': 'co',
    'Seychellois Creole': 'crs',
    'Czech': 'cs',
    'Welsh': 'cy',
    'Danish': 'da',
    'Ewe': 'ee',
    'Greek': 'el',
    'Esperanto': 'eo',
    'Estonian': 'et',
    'Basque': 'eu',
    'Persian': 'fa',
    'Faroese': 'fo',
    'Finnish': 'fi',
    'Filipino': 'tl',
    'Frisian': 'fy',
    'Irish': 'ga',
    'Ga': 'gaa',
    'Scots Gaelic': 'gd',
    'Galician': 'gl',
    'Guarani': 'gn',
    'Gujarati': 'gu',
    'Hausa': 'ha',
    'Hawaiian': 'haw',
    'Hindi': 'hi',
    'Croatian': 'hr',
    'Haitian Creole': 'ht',
    'Hungarian': 'hu',
    'Armenian': 'hy',
    'Interlingua': 'ia',
    'Indonesian': 'id',
    'Igbo': 'ig',
    'Icelandic': 'is',
    'Italian': 'it',
    'Hebrew': 'iw',
    'Javanese': 'jw',
    'Georgian': 'ka',
    'Kongo': 'kg',
    'Kazakh': 'kk',
    'Cambodian': 'km',
    'Kannada': 'kn',
    'Korean': 'ko',
    'Kurdish': 'ku',
    'Kyrgyz': 'ky',
    'Latin': 'la',
    'Luganda': 'lg',
    'Lingala': 'ln',
    'Laothian': 'lo',
    'Lithuanian': 'lt',
    'Tshiluba': 'lua',
    'Latvian': 'lv',
    'Mauritian Creole': 'mfe',
    'Malagasy': 'mg',
    'Maori': 'mi',
    'Macedonian': 'mk',
    'Malayalam': 'ml',
    'Mongolian': 'mn',
    'Moldavian': 'mo',
    'Marathi': 'mr',
    'Malay': 'ms',
    'Maltese': 'mt',
    'Nepali': 'ne',
    'Dutch': 'nl',
    'Norwegian (Nynorsk)': 'nn',
    'Norwegian': 'no',
    'Northern Sotho': 'nso',
    'Chichewa': 'ny',
    'Runyakitara': 'nyn',
    'Occitan': 'oc',
    'Oromo': 'om',
    'Oriya': 'or',
    'Punjabi': 'pa',
    'Polish': 'pl',
    'Pashto': 'ps',
    'Quechua': 'qu',
    'Romansh': 'rm',
    'Kirundi': 'rn',
    'Romanian': 'ro',
    'Kinyarwanda': 'rw',
    'Sindhi': 'sd',
    'Serbo-Croatian': 'sh',
    'Sinhalese': 'si',
    'Slovak': 'sk',
    'Slovenian': 'sl',
    'Shona': 'sn',
    'Somali': 'so',
    'Albanian': 'sq',
    'Serbian': 'sr',
    'Montenegrin': 'sr-ME',
    'Sesotho': 'st',
    'Sundanese': 'su',
    'Swahili': 'sw',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Tajik': 'tg',
    'Thai': 'th',
    'Tigrinya': 'ti',
    'Turkmen': 'tk',
    'Setswana': 'tn',
    'Tonga': 'to',
    'Turkish': 'tr',
    'Tatar': 'tt',
    'Tumbuka': 'tum',
    'Twi': 'tw',
    'Uighur': 'ug',
    'Ukrainian': 'uk',
    'Urdu': 'ur',
    'Uzbek': 'uz',
    'Vietnamese': 'vi',
    'Wolof': 'wo',
    'Yiddish': 'yi',
    'Yoruba': 'yo',
    'Xhosa': 'xh',
    'Bork, bork, bork!': 'xx-bork',
    'Elmer Fudd': 'xx-elmer',
    'Hacker': 'xx-hacker',
    'Klingon': 'xx-klingon',
    'Pirate': 'xx-pirate',
    'Zulu': 'zu'
  }
};
exports.gl = {
  common: {
    'None': 'none',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Germany': 'DE',
    'Brazil': 'BR',
    'France': 'FR',
    'Spain': 'ES',
    'China': 'CN',
    'Russian Federation': 'RU',
    'Japan': 'JP',
    'India': 'IN',
    'Sweden': 'SE'
  },
  others: {
    'Andorra': 'AD',
    'United Arab Emirates': 'AE',
    'Afghanistan': 'AF',
    'Antigua and Barbuda': 'AG',
    'Anguilla': 'AI',
    'Albania': 'AL',
    'Armenia': 'AM',
    'Netherlands Antilles': 'AN',
    'Angola': 'AO',
    'Antarctica': 'AQ',
    'Argentina': 'AR',
    'American Samoa': 'AS',
    'Austria': 'AT',
    'Australia': 'AU',
    'Aruba': 'AW',
    'Azerbaijan': 'AZ',
    'Bosnia and Herzegovina': 'BA',
    'Barbados': 'BB',
    'Bangladesh': 'BD',
    'Belgium': 'BE',
    'Burkina Faso': 'BF',
    'Bulgaria': 'BG',
    'Bahrain': 'BH',
    'Burundi': 'BI',
    'Benin': 'BJ',
    'Bermuda': 'BM',
    'Brunei Darussalam': 'BN',
    'Bolivia': 'BO',
    'Bahamas': 'BS',
    'Bhutan': 'BT',
    'Bouvet Island': 'BV',
    'Botswana': 'BW',
    'Belarus': 'BY',
    'Belize': 'BZ',
    'Canada': 'CA',
    'Cocos (Keeling) Islands': 'CC',
    'Congo, Democratic Republic': 'CD',
    'Central African Republic': 'CF',
    'Congo': 'CG',
    'Switzerland': 'CH',
    'Cote d\'Ivoire': 'CI',
    'Cook Islands': 'CK',
    'Chile': 'CL',
    'Cameroon': 'CM',
    'Colombia': 'CO',
    'Costa Rica': 'CR',
    'Serbia and Montenegro': 'CS',
    'Cape Verde': 'CV',
    'Christmas Island': 'CX',
    'Cyprus': 'CY',
    'Czech Republic': 'CZ',
    'Dominican Republic': 'DO',
    'Djibouti': 'DJ',
    'Denmark': 'DK',
    'Dominica': 'DM',
    'Algeria': 'DZ',
    'Ecuador': 'EC',
    'Estonia': 'EE',
    'Egypt': 'EG',
    'Western Sahara': 'EH',
    'Eritrea': 'ER',
    'Ethiopia': 'ET',
    'Finland': 'FI',
    'Fiji': 'FJ',
    'Falkland Islands (Malvinas)': 'FK',
    'Micronesia': 'FM',
    'Faroe Islands': 'FO',
    'France, Metropolitan': 'FX',
    'Gabon': 'GA',
    'Grenada': 'GD',
    'Georgia': 'GE',
    'French Guiana': 'GF',
    'Ghana': 'GH',
    'Gibraltar': 'GI',
    'Greenland': 'GL',
    'Gambia': 'GM',
    'Guinea': 'GN',
    'Guadeloupe': 'GP',
    'Equatorial Guinea': 'GQ',
    'Greece': 'GR',
    'South Georgia and The South Sandwich Islands': 'GS',
    'Guatemala': 'GT',
    'Guam': 'GU',
    'Guinea-Bissau': 'GW',
    'Guyana': 'GY',
    'Hong Kong': 'HK',
    'Heard and McDonald Islands': 'HM',
    'Honduras': 'HN',
    'Croatia': 'HR',
    'Haiti': 'HT',
    'Hungary': 'HU',
    'Indonesia': 'ID',
    'Ireland': 'IE',
    'Israel': 'IL',
    'British Indian Ocean Territory': 'IO',
    'Iraq': 'IQ',
    'Iceland': 'IS',
    'Italy': 'IT',
    'Jamaica': 'JM',
    'Jordan': 'JO',
    'Kenya': 'KE',
    'Kyrgyzstan': 'KG',
    'Cambodia': 'KH',
    'Kiribati': 'KI',
    'Comoros': 'KM',
    'Saint Kitts and Nevis': 'KN',
    'South Korea': 'KR',
    'Kuwait': 'KW',
    'Cayman Islands': 'KY',
    'Kazakhstan': 'KZ',
    'Lao People\'s Democratic Republic': 'LA',
    'Lebanon': 'LB',
    'Saint Lucia': 'LC',
    'Liechtenstein': 'LI',
    'Sri Lanka': 'LK',
    'Liberia': 'LR',
    'Lesotho': 'LS',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Latvia': 'LV',
    'Libya': 'LY',
    'Morocco': 'MA',
    'Monaco': 'MC',
    'Moldova': 'MD',
    'Madagascar': 'MG',
    'Marshall Islands': 'MH',
    'Macedonia': 'MK',
    'Mali': 'ML',
    'Mongolia': 'MN',
    'Macau': 'MO',
    'Northern Mariana Islands': 'MP',
    'Martinique': 'MQ',
    'Mauritania': 'MR',
    'Montserrat': 'MS',
    'Malta': 'MT',
    'Mauritius': 'MU',
    'Maldives': 'MV',
    'Malawi': 'MW',
    'Mexico': 'MX',
    'Malaysia': 'MY',
    'Mozambique': 'MZ',
    'Namibia': 'NA',
    'New Caledonia': 'NC',
    'Niger': 'NE',
    'Norfolk Island': 'NF',
    'Nigeria': 'NG',
    'Nicaragua': 'NI',
    'Netherlands': 'NL',
    'Norway': 'NO',
    'Nepal': 'NP',
    'Nauru': 'NR',
    'Niue': 'NU',
    'New Zealand': 'NZ',
    'Oman': 'OM',
    'Panama': 'PA',
    'Peru': 'PE',
    'French Polynesia': 'PF',
    'Papua New Guinea': 'PG',
    'Philippines': 'PH',
    'Pakistan': 'PK',
    'Poland': 'PL',
    'St. Pierre and Miquelon': 'PM',
    'Pitcairn': 'PN',
    'Portugal': 'PT',
    'Puerto Rico': 'PR',
    'Palestinian Territory': 'PS',
    'Palau': 'PW',
    'Paraguay': 'PY',
    'Qatar': 'QA',
    'Reunion': 'RE',
    'Romania': 'RO',
    'Rwanda': 'RW',
    'Saudi Arabia': 'SA',
    'Solomon Islands': 'SB',
    'Seychelles': 'SC',
    'Singapore': 'SG',
    'St. Helena': 'SH',
    'Slovenia': 'SI',
    'Svalbard and Jan Mayen Islands': 'SJ',
    'Slovakia': 'SK',
    'Sierra Leone': 'SL',
    'San Marino': 'SM',
    'Senegal': 'SN',
    'Somalia': 'SO',
    'Suriname': 'SR',
    'Sao Tome and Principe': 'ST',
    'El Salvador': 'SV',
    'Swaziland': 'SZ',
    'Turks and Caicos Islands': 'TC',
    'Chad': 'TD',
    'French Southern Territories': 'TF',
    'Togo': 'TG',
    'Thailand': 'TH',
    'Tajikistan': 'TJ',
    'Tokelau': 'TK',
    'East Timor': 'TL',
    'Turkmenistan': 'TM',
    'Tunisia': 'TN',
    'Tonga': 'TO',
    'Turkey': 'TR',
    'Trinidad and Tobago': 'TT',
    'Tuvalu': 'TV',
    'Taiwan': 'TW',
    'Tanzania': 'TZ',
    'Ukraine': 'UA',
    'Uganda': 'UG',
    'United States Minor Outlying Islands': 'UM',
    'Uruguay': 'UY',
    'Uzbekistan': 'UZ',
    'Vatican': 'VA',
    'Saint Vincent and the Grenadines': 'VC',
    'Venezuela': 'VE',
    'Virgin Islands (British)': 'VG',
    'Virgin Islands (U.S.)': 'VI',
    'Viet Nam': 'VN',
    'Vanuatu': 'VU',
    'Wallis and Futuna Islands': 'WF',
    'Samoa': 'WS',
    'Yemen': 'YE',
    'Mayotte': 'YT',
    'South Africa': 'ZA',
    'Zambia': 'ZM',
    'Zimbabwe': 'ZW'
  }
};

},{}],13:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var STATE = require('./DiagnosisStates');
var DiagnosisResult = require('./DiagnosisResult');
var DiagnosisGroup = require('./DiagnosisGroup');
var DiagnosisRuleSitemapXml = require('./rules/DiagnosisRuleSitemapXml');
var DiagnosisRuleCanonical = require('./rules/DiagnosisRuleCanonical');
var XHR = require('../utils/XHRProxyEx');
var messengerMixin = require('../utils/messengerMixin');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var Diagnosis = function () {
  function Diagnosis(page) {
    _classCallCheck(this, Diagnosis);
    this._data = page || null;
    this.parametersWaiting = 0;
    this.result = {
      page: new DiagnosisGroup(this, ['description', 'flash', 'frames', 'headings', 'images', 'keywords', 'textToHtmlRatio', 'title', 'url', 'microformats', 'schemaorg', 'opengraph', 'twittercard', 'canonical']),
      compliance: new DiagnosisGroup(this, ['doctype', 'encoding', 'favicon', 'googleAnalitycs', 'language', 'robotsTxt', 'xmlSitemaps']),
      mobile: new DiagnosisGroup(this, ['viewport'])
    };
    this._robotsTxtContent = '';
    this._sitemapXmlUrl = '';
    this._handlers = {};
    this._events = {};
    this.AJAX_TIMEOUT = 30000;
  }
  return _createClass(Diagnosis, [{
    key: "data",
    get: function get() {
      return this._data;
    }
  }, {
    key: "robotsTxtContent",
    get: function get() {
      return this._robotsTxtContent;
    }
  }, {
    key: "_newEventItem",
    value: function _newEventItem(name, callback, once) {
      once = once || false;
      return {
        name: name,
        callback: callback,
        once: once
      };
    }
  }, {
    key: "_addHandler",
    value: function _addHandler(event, callback, once) {
      this._handlers[event] = this._handlers[event] || [];
      this._handlers[event].push(this._newEventItem(event, callback, once));
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(event, callback, once) {
      var _this = this;
      once = once || false;
      if (event === 'ready' || event === 'parameterReady') {
        this._addHandler(event, callback, once);
        if (event in this._events) {
          this._events[event].forEach(function (data) {
            return _this._dispatchEvent(event, data);
          });
          delete this._events[event];
        }
      } else {
        var _event$split = event.split('.'),
          _event$split2 = _slicedToArray(_event$split, 2),
          group = _event$split2[0],
          rule = _event$split2[1];
        if (!(group in this.result) || !(rule in this.result[group])) {
          throw new Error('No such rule: ' + event);
        }
        this._addHandler(event, callback, once);
        if (this.result[group][rule].status !== STATE.STATE_PROCESSING) {
          callback(this.result[group][rule]);
        }
      }
    }
  }, {
    key: "_dispatchEvent",
    value: function _dispatchEvent(event, result) {
      if (event in this._handlers && this._handlers[event].length > 0) {
        this._handlers[event].forEach(function (handler) {
          return handler.callback(result);
        });
        this._handlers[event] = this._handlers[event].filter(function (item) {
          return !('once' in item && item.once);
        });
      } else {
        this._events[event] = this._events[event] || [];
        this._events[event].push({
          data: result
        });
      }
    }
  }, {
    key: "_parameterReady",
    value: function _parameterReady(group, parameter, result) {
      var eventName = group + '.' + parameter;
      this.result[group][parameter] = result;
      this._dispatchEvent(eventName, result);
      this.parametersWaiting--;
      this._dispatchEvent('parameterReady', {
        parameter: eventName,
        data: this.result
      });
      if (this.parametersWaiting <= 0) {
        this._dispatchEvent('ready', this.result);
      }
    }
  }, {
    key: "_sendRequest",
    value: function _sendRequest(url, callback, timeout, timeoutCallback, type) {
      type = type || 'get';
      var xhr = this.createXHR();
      xhr.setCallback(callback);
      if (timeout !== undefined) {
        xhr.setTimeoutCallback(timeoutCallback);
        xhr.setTimeout(timeout);
      }
      xhr.send(url, type);
    }
  }, {
    key: "_sendRequestEx",
    value: function _sendRequestEx(url, timeout, type) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2._sendRequest(url, resolve, timeout, reject, type);
      });
    }
  }, {
    key: "sendRequestEx",
    value: function sendRequestEx(url, timeout, type) {
      return this._sendRequestEx(url, timeout, type);
    }
  }, {
    key: "createXHR",
    value: function createXHR() {
      var xhr = new XHR();
      xhr.setMessenger(this.getMessenger());
      return xhr;
    }
  }, {
    key: "processData",
    value: function processData() {
      this.parametersWaiting = this.result.page.length + this.result.compliance.length;
      if (this._data === null) {
        this.result.page.setStatus(STATE.STATE_BAD, 'sqDiagnosis_data_unavailable');
        this.result.compliance.setStatus(STATE.STATE_BAD, 'sqDiagnosis_data_unavailable');
        this._dispatchEvent('ready', this.result);
        return;
      }
      this.processURL();
      this.processCanonical();
      this.processTitle();
      this.processMetaDescription();
      this.processMetaKeywords();
      this.processHeadings();
      this.processImages();
      this.processTextToHTMLRatio();
      this.processFrames();
      this.processFlash();
      this.processMicroformats();
      this.processSchemaorg();
      this.processOpengraph();
      this.processTwitterCard();
      this.processRobotsTxt();
      this.processXMLSitemaps();
      this.processMetaLanguageTag();
      this.processDocType();
      this.processEncoding();
      this.processGoogleAnalytics();
      this.processFavicon();
      this.processViewport();
    }
  }, {
    key: "_processDescription",
    value: function _processDescription(result) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        if (!(result instanceof DiagnosisResult)) {
          throw new Error('Argument should be DiagnosisResult instance');
        }
        _this3.t(result.description).then(function (message) {
          var regexp = new RegExp('{(' + Object.keys(result).join('|') + ')}', 'igm');
          result.description = message.replace(regexp, function (match, group1) {
            return result[group1];
          });
          resolve(result);
        })["catch"](reject);
      });
    }
  }, {
    key: "_pageParameterReady",
    value: function _pageParameterReady(parameter, result) {
      var _this4 = this;
      return this._processDescription(result).then(function (localized) {
        return _this4._parameterReady('page', parameter, localized);
      });
    }
  }, {
    key: "pageParameterReady",
    value: function pageParameterReady(parameter, result) {
      return this._pageParameterReady(parameter, result);
    }
  }, {
    key: "_complianceParameterReady",
    value: function _complianceParameterReady(parameter, result) {
      var _this5 = this;
      return this._processDescription(result).then(function (localized) {
        return _this5._parameterReady('compliance', parameter, localized);
      });
    }
  }, {
    key: "complianceParameterReady",
    value: function complianceParameterReady(parameter, result) {
      return this._complianceParameterReady(parameter, result);
    }
  }, {
    key: "_mobileParameterReady",
    value: function _mobileParameterReady(parameter, result) {
      var _this6 = this;
      return this._processDescription(result).then(function (localized) {
        return _this6._parameterReady('mobile', parameter, localized);
      });
    }
  }, {
    key: "mobileParameterReady",
    value: function mobileParameterReady(parameter, result) {
      return this._mobileParameterReady(parameter, result);
    }
  }, {
    key: "_aiParameterReady",
    value: function _aiParameterReady(parameter, result) {
      var _this7 = this;
      return this._processDescription(result).then(function (localized) {
        return _this7._parameterReady('ai', parameter, localized);
      });
    }
  }, {
    key: "aiParameterReady",
    value: function aiParameterReady(parameter, result) {
      return this._aiParameterReady(parameter, result);
    }
  }, {
    key: "processURL",
    value: function processURL() {
      var result = new DiagnosisResult({
        len: 0,
        url: '',
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('location' in this._data) {
        result.url = result.value = this._data.location.replace(/^(http(s)?:\/\/|file:\/\/\/)/gi, '');
        result.len = result.value.length;
        if (result.len > 200) {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_url_bad';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_url_good';
        }
      }
      this._pageParameterReady('url', result);
    }
  }, {
    key: "processCanonical",
    value: function processCanonical() {
      var processor = new DiagnosisRuleCanonical(this);
      processor.run();
    }
  }, {
    key: "processTitle",
    value: function processTitle() {
      var result = new DiagnosisResult({
        len: 0,
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('title' in this._data) {
        result.len = this._data.title.length;
        result.value = this._data.title;
        if (result.len < 10) {
          if (result.len < 5) {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_title_bad_not_long';
          } else {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_title_average';
          }
        } else if (result.len > 70) {
          if (result.len < 101) {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_title_average';
          } else {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_title_bad_not_short';
          }
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_title_good';
        }
      }
      this._pageParameterReady('title', result);
    }
  }, {
    key: "processMetaDescription",
    value: function processMetaDescription() {
      var result = new DiagnosisResult({
        len: 0,
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('description' in this._data) {
        result.len = this._data.description.length;
        result.value = this._data.description;
        if (result.len < 160) {
          if (result.len < 20) {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_meta_bad_not_long';
          } else {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_meta_average';
          }
        } else if (result.len > 300) {
          if (result.len < 320) {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_meta_average';
          } else {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_meta_bad_not_short';
          }
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_meta_good';
        }
      }
      this._pageParameterReady('description', result);
    }
  }, {
    key: "processMetaKeywords",
    value: function processMetaKeywords() {
      var result = new DiagnosisResult({
        len: 0,
        value: '',
        cLen: 0,
        disabled: true,
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('keywords' in this._data) {
        result.len = this._data.keywords.length;
        result.value = this._data.keywords;
        result.cLen = 0;
        if (!result.len) {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_kwds_bad';
        } else {
          var badLen = result.len < 50 || result.len > 150;
          result.cLen = this._data.keywords.split(',').length;
          if (result.cLen < 5) {
            if (result.cLen < 3) {
              if (badLen) {
                result.status = STATE.STATE_BAD;
                result.description = 'sqDiagnosis_kwds_bad_more';
              } else {
                result.status = STATE.STATE_AVERAGE;
                result.description = 'sqDiagnosis_kwds_average_not_enough';
              }
            } else {
              result.status = STATE.STATE_AVERAGE;
              result.description = 'sqDiagnosis_kwds_average_too_short';
            }
          } else if (result.cLen > 10) {
            if (result.cLen > 15) {
              if (badLen) {
                result.status = STATE.STATE_BAD;
                result.description = 'sqDiagnosis_kwds_bad_too_many';
              } else {
                result.status = STATE.STATE_AVERAGE;
                result.description = 'sqDiagnosis_kwds_average_too_many';
              }
            } else {
              result.status = STATE.STATE_AVERAGE;
              result.description = 'sqDiagnosis_kwds_average_too_many';
            }
          } else {
            if (badLen) {
              result.status = STATE.STATE_AVERAGE;
              result.description = 'sqDiagnosis_kwds_average_too_long';
            } else {
              result.status = STATE.STATE_GOOD;
              result.description = 'sqDiagnosis_kwds_good';
            }
          }
        }
      }
      this._pageParameterReady('keywords', result);
    }
  }, {
    key: "processHeadings",
    value: function processHeadings() {
      var result = new DiagnosisResult({
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('headings' in this._data) {
        result.value = this._data.headings;
        var h1s = this._data.headings.H1.count;
        var h2s = this._data.headings.H2.count;
        var h3s = this._data.headings.H3.count;
        var h4s = this._data.headings.H4.count;
        var h5s = this._data.headings.H5.count;
        var h6s = this._data.headings.H6.count;
        if (h1s && h2s && h3s) {
          if (h1s === 1) {
            result.status = STATE.STATE_GOOD;
            result.description = 'sqDiagnosis_headings_good';
          } else {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_headings_average';
          }
        } else if (h4s || h5s || h6s) {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_headings_average_one';
        } else {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_headings_bad';
        }
      }
      this._pageParameterReady('headings', result);
    }
  }, {
    key: "processImages",
    value: function processImages() {
      var result = new DiagnosisResult({
        len: 0,
        alt: 0,
        withoutAlt: 0,
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('images_count' in this._data && 'imgalts_count' in this._data) {
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_images_good';
        result.len = this._data.images_count;
        result.alt = this._data.imgalts_count;
        result.withoutAlt = this._data.images_count - this._data.imgalts_count;
        if (result.len) {
          var dd = Math.round(result.alt / result.len * 100);
          if (dd < 70) {
            if (dd > 39) {
              result.status = STATE.STATE_AVERAGE;
              result.description = 'sqDiagnosis_images_average';
            } else {
              result.status = STATE.STATE_BAD;
              result.description = 'sqDiagnosis_images_bad';
            }
          }
        }
      }
      this._pageParameterReady('images', result);
    }
  }, {
    key: "processTextToHTMLRatio",
    value: function processTextToHTMLRatio() {
      var result = new DiagnosisResult({
        ratio: 0,
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error',
        description2: ''
      });
      if ('text_length' in this._data && 'page_length' in this._data) {
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_ratio_good';
        result.ratio = Math.round(this._data.text_length / this._data.page_length * 100 * 100) / 100;
        if (result.ratio < 50) {
          if (result.ratio > 15) {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_ratio_average_one';
          } else {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_ratio_bad_one';
          }
        }
      }
      this._pageParameterReady('textToHtmlRatio', result);
    }
  }, {
    key: "processFrames",
    value: function processFrames() {
      var result = new DiagnosisResult({
        iframes: 0,
        frames: 0,
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('iframes_count' in this._data && 'frames_count' in this._data) {
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_frames_good';
        result.iframes = this._data.iframes_count;
        result.frames = this._data.frames_count;
        if (this._data.frames_count) {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_frames_average';
          if (this._data.frames_count > 1 || this._data.iframes_count > 1) {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_frames_bad';
          }
        } else {
          if (this._data.iframes_count > 0) {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_frames_exists';
          }
        }
      }
      this._pageParameterReady('frames', result);
    }
  }, {
    key: "processFlash",
    value: function processFlash() {
      var result = new DiagnosisResult({
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('flash' in this._data && 'text_length' in this._data) {
        if (this._data.flash) {
          if (this._data.text_length > 50) {
            result.status = STATE.STATE_AVERAGE;
            result.description = 'sqDiagnosis_flash_average';
          } else {
            result.status = STATE.STATE_BAD;
            result.description = 'sqDiagnosis_flash_bad';
          }
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_flash_good';
        }
      }
      this._pageParameterReady('flash', result);
    }
  }, {
    key: "processRobotsTxt",
    value: function processRobotsTxt() {
      var _this8 = this;
      var result = new DiagnosisResult({
        url: '',
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if (!('urlDetails' in this._data)) {
        this._complianceParameterReady('robotsTxt', result);
        return;
      }
      if (this._data.urlDetails.scheme === 'file') {
        result.status = STATE.STATE_AVERAGE;
        result.description = 'sqDiagnosis_unable2detect';
        this._complianceParameterReady('robotsTxt', result);
        return;
      }
      var robotsUrl = this._data.urlDetails.scheme + '://' + this._data.urlDetails.domain;
      if (this._data.urlDetails.port !== '') {
        robotsUrl += ':' + this._data.urlDetails.port;
      }
      robotsUrl += '/robots.txt';
      var answerCallback = function answerCallback(answer) {
        var result = new DiagnosisResult({
          status: STATE.STATE_BAD,
          description: 'sqDiagnosis_robots_bad'
        });
        result.url = result.value = robotsUrl;
        if (answer.status === 200 && answer.responseText.match(/Allow|Disallow|Sitemap|User-agent/i)) {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_robots_good';
          _this8._robotsTxtContent = answer.responseText;
        }
        _this8._complianceParameterReady('robotsTxt', result);
      };
      var timeoutCallback = function timeoutCallback() {
        var result = new DiagnosisResult({
          status: STATE.STATE_TIMEOUT,
          description: 'sqDiagnosis_unable2detect'
        });
        result.url = result.value = '';
        _this8._complianceParameterReady('robotsTxt', result);
      };
      this._sendRequest(robotsUrl, answerCallback, this.AJAX_TIMEOUT, timeoutCallback);
    }
  }, {
    key: "processXMLSitemaps",
    value: function processXMLSitemaps() {
      var processor = new DiagnosisRuleSitemapXml(this);
      processor.run();
    }
  }, {
    key: "processMetaLanguageTag",
    value: function processMetaLanguageTag() {
      var result = new DiagnosisResult({
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_lang_bad',
        langMess: ''
      });
      if (this._data.lang) {
        result.langMess = this._data.lang;
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_lang_good';
      }
      if (this._data.meta_language_tag) {
        if (!this._data.lang) {
          result.langMess = this._data.meta_language_tag;
        }
        result.status = STATE.STATE_AVERAGE;
        result.description = 'sqDiagnosis_lang_average';
      }
      result.value = result.langMess;
      return this._complianceParameterReady('language', result);
    }
  }, {
    key: "processDocType",
    value: function processDocType() {
      var result = new DiagnosisResult({
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('doctype' in this._data) {
        result.value = this._data.doctype;
        if (this._data.doctype === 'Undetected') {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_doctype_bad';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_doctype_good';
        }
      }
      return this._complianceParameterReady('doctype', result);
    }
  }, {
    key: "processEncoding",
    value: function processEncoding() {
      var result = new DiagnosisResult({
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('charset' in this._data) {
        result.value = this._data.charset;
        if (this._data.charset === 'Not specified') {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_charset_bad_one';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_charset_good_one';
        }
      }
      return this._complianceParameterReady('encoding', result);
    }
  }, {
    key: "processGoogleAnalytics",
    value: function processGoogleAnalytics() {
      var result = new DiagnosisResult({
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_ganal_bad_one'
      });
      if (this._data.ganalytics) {
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_ganal_good_one';
      }
      return this._complianceParameterReady('googleAnalitycs', result);
    }
  }, {
    key: "processMicroformats",
    value: function processMicroformats() {
      var result = new DiagnosisResult({
        status: STATE.STATE_AVERAGE,
        description: 'sqDiagnosis_microformats_average',
        codes: '',
        value: '',
        domain: encodeURIComponent(this._data.location)
      });
      if (this._data.microformats && this._data.microformats.length > 0) {
        var type = this._data.microformats.shift();
        if (type === 'microformatsWrong') {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_microformats_bad';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_microformats_good';
        }
        result.type = type;
        var value = new Map();
        this._data.microformats.forEach(function (code) {
          return value.has(code) ? value.set(code, value.get(code) + 1) : value.set(code, 1);
        });
        result.codes = [];
        value.forEach(function (count, code) {
          return result.codes.push(code + (count > 1 ? ' (' + count + ')' : ''));
        });
        result.value = result.codes.join(', ');
      }
      return this._pageParameterReady('microformats', result);
    }
  }, {
    key: "processSchemaorg",
    value: function processSchemaorg() {
      var result = new DiagnosisResult({
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_schemaorg_bad',
        types: '',
        domain: encodeURIComponent(this._data.location)
      });
      if (this._data.schemaorg && this._data.schemaorg.length > 0) {
        result.types = this._data.schemaorg.join(', ');
        if (this._data.schemaorg[0] === '') {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_schemaorg_average';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_schemaorg_good';
          result.value = result.types;
        }
      }
      return this._pageParameterReady('schemaorg', result);
    }
  }, {
    key: "processOpengraph",
    value: function processOpengraph() {
      var result = new DiagnosisResult({
        status: STATE.STATE_AVERAGE,
        description: 'sqDiagnosis_opengraph_no',
        types: '',
        domain: encodeURIComponent(this._data.location),
        location: encodeURIComponent(this._data.location)
      });
      if (this._data.opengraph && this._data.opengraph.length > 0) {
        result.types = this._data.opengraph.join(', ');
        if (this._data.opengraph[0] === '') {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_opengraph_average';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_opengraph_good';
          result.value = result.types;
        }
      }
      return this._pageParameterReady('opengraph', result);
    }
  }, {
    key: "processTwitterCard",
    value: function processTwitterCard() {
      var result = new DiagnosisResult({
        status: STATE.STATE_AVERAGE,
        description: 'sqDiagnosis_twittercard_no',
        types: '',
        location: encodeURIComponent(this._data.location)
      });
      if (this._data.twittercard && this._data.twittercard.length == 2) {
        result.type = this._data.twittercard[0];
        result.id = this._data.twittercard[1];
        if (result.type === '') {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_twittercard_bad';
        } else {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_twittercard_good';
          if (result.id === '') {
            result.value = result.type;
          } else {
            result.value = result.type + ' - ' + result.id;
          }
        }
      }
      return this._pageParameterReady('twittercard', result);
    }
  }, {
    key: "processFavicon",
    value: function processFavicon() {
      var _this9 = this;
      var result = new DiagnosisResult({
        url: '',
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if (!('urlDetails' in this._data)) {
        this._complianceParameterReady('favicon', result);
        return;
      }
      if (this._data.urlDetails.scheme === 'file') {
        result.status = STATE.STATE_AVERAGE;
        result.description = 'sqDiagnosis_unable2detect';
        this._complianceParameterReady('favicon', result);
        return;
      }
      var faviconUrl = '';
      if (this._data.faviconLink) {
        faviconUrl = this._data.faviconLink;
      } else {
        faviconUrl = this._data.urlDetails.scheme + '://' + this._data.urlDetails.domain;
        if (this._data.urlDetails.port !== '') {
          faviconUrl += ':' + this._data.urlDetails.port;
        }
        faviconUrl += '/favicon.ico';
      }
      if (faviconUrl.startsWith('data:')) {
        result.url = result.value = 'Inline image';
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_favicon_good';
        this._complianceParameterReady('favicon', result);
      } else {
        var answerCallback = function answerCallback(answer) {
          var result = new DiagnosisResult({
            status: STATE.STATE_BAD,
            description: 'sqDiagnosis_favicon_bad',
            url: '',
            value: ''
          });
          if (answer.status === 200) {
            result.status = STATE.STATE_GOOD;
            result.description = 'sqDiagnosis_favicon_good';
            result.url = result.value = faviconUrl;
          }
          return _this9._complianceParameterReady('favicon', result);
        };
        var timeoutCallback = function timeoutCallback() {
          var result = new DiagnosisResult({
            status: STATE.STATE_TIMEOUT,
            description: 'sqDiagnosis_timeoutreached'
          });
          result.url = result.value = '';
          return _this9._complianceParameterReady('favicon', result);
        };
        this._sendRequest(faviconUrl, answerCallback, this.AJAX_TIMEOUT, timeoutCallback);
      }
    }
  }, {
    key: "processViewport",
    value: function processViewport() {
      var result = new DiagnosisResult({
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if ('viewport' in this._data) {
        var defaultViewports = ['width=device-width, initial-scale=1', 'width=device-width, initial-scale=1.0'];
        result.value = this._data.viewport;
        if (this._data.viewport === '') {
          result.status = STATE.STATE_BAD;
          result.description = 'sqDiagnosis_viewport_no';
        } else if (defaultViewports.indexOf(this._data.viewport) !== false) {
          result.status = STATE.STATE_GOOD;
          result.description = 'sqDiagnosis_viewport_default';
        } else {
          result.status = STATE.STATE_AVERAGE;
          result.description = 'sqDiagnosis_viewport_some';
        }
      }
      return this._mobileParameterReady('viewport', result);
    }
  }]);
}();
messengerMixin(Diagnosis.prototype);
messengerTranslateMixin(Diagnosis.prototype);
module.exports = Diagnosis;

},{"../utils/XHRProxyEx":145,"../utils/messengerMixin":150,"../utils/messengerTranslateMixin":152,"./DiagnosisGroup":14,"./DiagnosisResult":15,"./DiagnosisStates":16,"./rules/DiagnosisRuleCanonical":18,"./rules/DiagnosisRuleSitemapXml":19}],14:[function(require,module,exports){
'use strict';

var STATE = require('./DiagnosisStates');
var DiagnosisResult = require('./DiagnosisResult');
module.exports = DiagnosisGroup;
function DiagnosisGroup(owner, rules) {
  this.owner = owner;
  this.rules = rules;
  this.length = 0;
  this.updateRules();
}
DiagnosisGroup.prototype.updateRules = function () {
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    if (key in this) {
      delete this[key];
    }
    this[key] = new DiagnosisResult();
    this.length++;
  }
};
DiagnosisGroup.prototype.get = function (key) {
  if (key in this && this[key] instanceof DiagnosisResult) {
    return this[key];
  }
  return undefined;
};
DiagnosisGroup.prototype.countReady = function () {
  var result = 0;
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    if (key in this && this[key] instanceof DiagnosisResult) {
      if (this[key].status !== STATE.STATE_PROCESSING) {
        result++;
      }
    }
  }
  return result;
};
DiagnosisGroup.prototype.countGood = function () {
  var result = 0;
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    if (key in this && this[key] instanceof DiagnosisResult) {
      if (this[key].status === STATE.STATE_GOOD) {
        result++;
      }
    }
  }
  return result;
};
DiagnosisGroup.prototype.countBad = function () {
  var result = 0;
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    if (key in this && this[key] instanceof DiagnosisResult) {
      if (this[key].status === STATE.STATE_BAD) {
        result++;
      }
    }
  }
  return result;
};
DiagnosisGroup.prototype.countAverage = function () {
  var result = 0;
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    if (key in this && this[key] instanceof DiagnosisResult) {
      if (this[key].status === STATE.STATE_AVERAGE) {
        result++;
      }
    }
  }
  return result;
};
DiagnosisGroup.prototype.setStatus = function (status, description) {
  for (var i = 0; i < this.rules.length; i++) {
    var key = this.rules[i];
    this[key].status = status;
    this[key].description = description;
  }
};

},{"./DiagnosisResult":15,"./DiagnosisStates":16}],15:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var STATE = require('./DiagnosisStates');
var DiagnosisResult = _createClass(function DiagnosisResult(options) {
  _classCallCheck(this, DiagnosisResult);
  this.status = STATE.STATE_PROCESSING;
  this.description = '';
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key];
    }
  }
});
module.exports = DiagnosisResult;

},{"./DiagnosisStates":16}],16:[function(require,module,exports){
'use strict';

module.exports = {
  STATE_GOOD: 'good',
  STATE_AVERAGE: 'average',
  STATE_BAD: 'bad',
  STATE_PROCESSING: 'processing',
  STATE_TIMEOUT: 'timeout'
};

},{}],17:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var DiagnosisRule = _createClass(function DiagnosisRule(diagnosis) {
  _classCallCheck(this, DiagnosisRule);
  this._diagnosis = diagnosis;
});
module.exports = DiagnosisRule;

},{}],18:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var STATE = require('../DiagnosisStates');
var DiagnosisResult = require('../DiagnosisResult');
var DiagnosisRule = require('./DiagnosisRule');
var DiagnosisRuleCanonical = function (_DiagnosisRule) {
  function DiagnosisRuleCanonical(diagnosis) {
    var _this;
    _classCallCheck(this, DiagnosisRuleCanonical);
    _this = _callSuper(this, DiagnosisRuleCanonical, [diagnosis]);
    _this._canonicalUrl = '';
    _this.processTimeout = _this.handleTimeout.bind(_this);
    _this.processCanonicalAnswer = _this.handleCanonicalAnswer.bind(_this);
    return _this;
  }
  _inherits(DiagnosisRuleCanonical, _DiagnosisRule);
  return _createClass(DiagnosisRuleCanonical, [{
    key: "diagnosis",
    get: function get() {
      return this._diagnosis;
    }
  }, {
    key: "run",
    value: function run() {
      var result = new DiagnosisResult({
        url: '',
        value: '',
        status: STATE.STATE_AVERAGE,
        description: 'sqDiagnosis_canonical_average'
      });
      if (!('canonicalLink' in this.diagnosis.data) || this.diagnosis.data.canonicalLink === '') {
        this.diagnosis.pageParameterReady('canonical', result);
        return;
      }
      this._canonicalUrl = this.diagnosis.data.canonicalLink;
      this._requestCanonicalURL();
    }
  }, {
    key: "_requestCanonicalURL",
    value: function _requestCanonicalURL() {
      this.diagnosis.sendRequestEx(this._canonicalUrl, DiagnosisRuleCanonical.AJAX_TIMEOUT, 'get').then(this.processCanonicalAnswer)["catch"](this.processTimeout);
    }
  }, {
    key: "handleTimeout",
    value: function handleTimeout() {
      var result = new DiagnosisResult({
        status: STATE.STATE_TIMEOUT,
        description: 'sqDiagnosis_unable2detect'
      });
      result.url = result.value = this._canonicalUrl;
      return this.diagnosis.pageParameterReady('canonical', result);
    }
  }, {
    key: "handleCanonicalAnswer",
    value: function handleCanonicalAnswer(answer) {
      if (answer.status === 200) {
        var result = new DiagnosisResult({
          status: STATE.STATE_GOOD,
          description: 'sqDiagnosis_canonical_good',
          url: this._canonicalUrl,
          value: this._canonicalUrl
        });
        this.diagnosis.pageParameterReady('canonical', result);
      } else {
        var _result = new DiagnosisResult({
          status: STATE.STATE_BAD,
          description: 'sqDiagnosis_canonical_bad',
          url: this._canonicalUrl,
          value: this._canonicalUrl
        });
        this.diagnosis.pageParameterReady('canonical', _result);
      }
    }
  }]);
}(DiagnosisRule);
DiagnosisRuleCanonical.AJAX_TIMEOUT = 30000;
module.exports = DiagnosisRuleCanonical;

},{"../DiagnosisResult":15,"../DiagnosisStates":16,"./DiagnosisRule":17}],19:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var STATE = require('../DiagnosisStates');
var DiagnosisResult = require('../DiagnosisResult');
var DiagnosisRule = require('./DiagnosisRule');
var DiagnosisRuleSitemapXml = function (_DiagnosisRule) {
  function DiagnosisRuleSitemapXml(diagnosis) {
    var _this;
    _classCallCheck(this, DiagnosisRuleSitemapXml);
    _this = _callSuper(this, DiagnosisRuleSitemapXml, [diagnosis]);
    _this._sitemapXmlUrl = '';
    _this._sitemapIndexXmlUrl = '';
    _this._dontAskRobots = false;
    _this._headOnly = false;
    _this.processRobotsTxtReady = _this.handleRobotsTxtReady.bind(_this);
    _this.processTimeout = _this.handleTimeout.bind(_this);
    _this.processSitemapXMLAnswer = _this.handleSitemapXMLAnswer.bind(_this);
    _this.processSitemapIndexXMLAnswer = _this.handleSitemapIndexXMLAnswer.bind(_this);
    return _this;
  }
  _inherits(DiagnosisRuleSitemapXml, _DiagnosisRule);
  return _createClass(DiagnosisRuleSitemapXml, [{
    key: "diagnosis",
    get: function get() {
      return this._diagnosis;
    }
  }, {
    key: "run",
    value: function run() {
      var result = new DiagnosisResult({
        url: '',
        value: '',
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_internal_error'
      });
      if (!('urlDetails' in this.diagnosis.data)) {
        this.diagnosis.complianceParameterReady('xmlSitemaps', result);
        return;
      }
      if (this.diagnosis.data.urlDetails.scheme === 'file') {
        result.status = STATE.STATE_AVERAGE;
        result.description = 'sqDiagnosis_unable2detect';
        this.diagnosis.complianceParameterReady('xmlSitemaps', result);
        return;
      }
      this._sitemapXmlUrl = this.diagnosis.data.urlDetails.scheme + '://' + this.diagnosis.data.urlDetails.domain;
      if (this.diagnosis.data.urlDetails.port !== '') {
        this._sitemapXmlUrl += ':' + this.diagnosis.data.urlDetails.port;
      }
      this._sitemapIndexXmlUrl = this._sitemapXmlUrl;
      this._sitemapXmlUrl += '/sitemap.xml';
      this._sitemapIndexXmlUrl += '/sitemap_index.xml';
      this._requestSitemapXML();
    }
  }, {
    key: "_requestSitemapXML",
    value: function _requestSitemapXML() {
      this.diagnosis.sendRequestEx(this._sitemapXmlUrl, DiagnosisRuleSitemapXml.AJAX_TIMEOUT, this._headOnly ? 'head' : 'get').then(this.processSitemapXMLAnswer)["catch"](this.processTimeout);
    }
  }, {
    key: "_requestSitemapIndexXML",
    value: function _requestSitemapIndexXML() {
      this.diagnosis.sendRequestEx(this._sitemapIndexXmlUrl, DiagnosisRuleSitemapXml.AJAX_TIMEOUT, this._headOnly ? 'head' : 'get').then(this.processSitemapIndexXMLAnswer)["catch"](this.processTimeout);
    }
  }, {
    key: "handleRobotsTxtReady",
    value: function handleRobotsTxtReady() {
      var urls = /^Sitemap: (.*)$/img.exec(this.diagnosis.robotsTxtContent);
      if (urls !== null && urls[1]) {
        this._sitemapXmlUrl = urls[1];
        this._dontAskRobots = true;
        this._headOnly = /\.gz$/i.test(urls[1]);
        this._requestSitemapXML();
      } else {
        this._requestSitemapIndexXML();
      }
    }
  }, {
    key: "handleTimeout",
    value: function handleTimeout() {
      var result = new DiagnosisResult({
        status: STATE.STATE_TIMEOUT,
        description: 'sqDiagnosis_unable2detect'
      });
      result.url = result.value = this._sitemapXmlUrl;
      return this.diagnosis.complianceParameterReady('xmlSitemaps', result);
    }
  }, {
    key: "handleSitemapXMLAnswer",
    value: function handleSitemapXMLAnswer(answer) {
      if (answer.status === 200 && (this._headOnly || DiagnosisRuleSitemapXml.validateSitemapXML(answer.responseText))) {
        var result = new DiagnosisResult({
          status: STATE.STATE_GOOD,
          description: 'sqDiagnosis_sitemaps_good',
          url: this._sitemapXmlUrl,
          value: this._sitemapXmlUrl
        });
        this.diagnosis.complianceParameterReady('xmlSitemaps', result);
      } else if (!this._dontAskRobots) {
        this.diagnosis.addEventListener('compliance.robotsTxt', this.processRobotsTxtReady, true);
      } else {
        this._requestSitemapIndexXML();
      }
    }
  }, {
    key: "handleSitemapIndexXMLAnswer",
    value: function handleSitemapIndexXMLAnswer(answer) {
      var result = new DiagnosisResult({
        status: STATE.STATE_BAD,
        description: 'sqDiagnosis_sitemaps_bad'
      });
      result.url = result.value = '';
      if (answer.status === 200 && (this._headOnly || DiagnosisRuleSitemapXml.validateSitemapXML(answer.responseText))) {
        result.status = STATE.STATE_GOOD;
        result.description = 'sqDiagnosis_sitemaps_good';
        result.url = result.value = this._sitemapIndexXmlUrl;
        this.diagnosis.complianceParameterReady('xmlSitemaps', result);
      } else {
        this.diagnosis.complianceParameterReady('xmlSitemaps', result);
      }
    }
  }], [{
    key: "validateSitemapXML",
    value: function validateSitemapXML(text) {
      return text.match(/<\?xml version="1.0".+?\?>/i) || text.match(/<\?xml version='1.0'.+?\?>/i);
    }
  }]);
}(DiagnosisRule);
DiagnosisRuleSitemapXml.AJAX_TIMEOUT = 30000;
module.exports = DiagnosisRuleSitemapXml;

},{"../DiagnosisResult":15,"../DiagnosisStates":16,"./DiagnosisRule":17}],20:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Chain = function () {
  function Chain(dom, element) {
    _classCallCheck(this, Chain);
    this._dom = dom;
    this._element = element;
  }
  return _createClass(Chain, [{
    key: "appendChild",
    value: function appendChild(child) {
      this._element.appendChild(child);
      return this;
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      this._element.removeChild(child);
      return this;
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }]);
}();
module.exports = Chain;

},{}],21:[function(require,module,exports){
'use strict';

function appendChild(parent, child) {
  if (child instanceof Array) {
    child.forEach(function (item) {
      return appendChild(parent, item);
    });
  } else if (child instanceof Node) {
    parent.appendChild(child);
  } else if (isFunction(child)) {
    appendChild(parent, child());
  } else if (child instanceof Promise) {
    var placeholder = document.createTextNode('');
    parent.appendChild(placeholder);
    child.then(function (msg) {
      return replaceChild(parent, placeholder, msg);
    });
  } else {
    parent.appendChild(document.createTextNode(child));
  }
}
function replaceChild(parent, what, child) {
  if (child instanceof Node) {
    parent.replaceChild(child, what);
  } else {
    var text = document.createTextNode(child);
    parent.replaceChild(text, what);
  }
}
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
module.exports = {
  appendChild: appendChild,
  replaceChild: replaceChild
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function appendText(element, text) {
  var newTextNode = document.createTextNode(text);
  element.appendChild(newTextNode);
};

},{}],23:[function(require,module,exports){
'use strict';

module.exports = function clearValue(element) {
  var form = document.createElement('form');
  var container = element.parentNode;
  container.replaceChild(form, element);
  form.appendChild(element);
  form.reset();
  container.replaceChild(element, form);
};

},{}],24:[function(require,module,exports){
'use strict';

var skipTags = ['script', 'meta', 'template'];
function correctZIndex(element, deep) {
  deep = deep || false;
  Array.from(element.children).forEach(function (child) {
    if (skipTags.indexOf(child.tagName) !== -1 || child.id === 'sqseobar2' || child.className.indexOf('sqmore-') !== -1 || child.className.indexOf('seoquake-') !== -1 || child.getAttribute('sq-z-fixed') === '1') {
      return;
    }
    var style = document.defaultView.getComputedStyle(child, null);
    if (style.zIndex !== 'auto') {
      try {
        var zIndex = parseInt(style.zIndex);
        if (zIndex - 100 > 0) {
          zIndex -= 100;
          child.style.zIndex = zIndex.toString();
          child.setAttribute('sq-z-fixed', '1');
        }
      } catch (ignore) {}
    }
    if (deep) {
      correctZIndex(child, deep);
    }
  });
}
module.exports = correctZIndex;

},{}],25:[function(require,module,exports){
'use strict';

var css = require('dom-element-css');
var _require = require('./_createElement'),
  appendChild = _require.appendChild,
  replaceChild = _require.replaceChild;
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
function createElement(tagName, attrs, content) {
  if (!tagName) {
    return null;
  }
  if (attrs === undefined) {
    attrs = {};
  }
  var element = document.createElement(tagName.toLowerCase());
  if (isString(attrs) || isFunction(attrs)) {
    content = attrs;
  } else {
    for (var attrName in attrs) {
      if (attrs.hasOwnProperty(attrName)) {
        if (attrName === 'className') {
          element.className = attrs[attrName];
        } else if (attrName === 'forId') {
          element.setAttribute('for', attrs[attrName]);
        } else if (attrName === 'style' && !isString(attrs[attrName])) {
          css(element, attrs[attrName]);
        } else {
          element.setAttribute(attrName, attrs[attrName]);
        }
      }
    }
  }
  if (content) {
    appendChild(element, content);
  }
  return element;
}
module.exports = createElement;

},{"./_createElement":21,"dom-element-css":155}],26:[function(require,module,exports){
'use strict';

module.exports = function emptyElement(anElem) {
  while (anElem.firstChild) {
    anElem.removeChild(anElem.firstChild);
  }
  return anElem;
};

},{}],27:[function(require,module,exports){
'use strict';

exports.parseTextNodes = function parseTextNodes(element) {
  var content = [];
  Array.from(element.childNodes).forEach(function (child) {
    var value = '';
    if (child.nodeType === Node.TEXT_NODE) {
      value = child.nodeValue.trim();
    } else if (child.hasChildNodes()) {
      value = parseTextNodes(child);
    }
    if (value !== '') {
      content.push(value);
    }
  });
  return content.join(' ');
};

},{}],28:[function(require,module,exports){
'use strict';

module.exports = function (elem, dontFixScroll) {
  if (!elem || !elem.ownerDocument) {
    return null;
  }
  dontFixScroll = dontFixScroll || false;
  var offsetParent = elem.offsetParent;
  var doc = elem.ownerDocument;
  var docElem = doc.documentElement;
  var body = doc.body;
  var defaultView = doc.defaultView;
  var prevComputedStyle = defaultView.getComputedStyle(elem, null);
  var top = elem.offsetTop;
  var left = elem.offsetLeft;
  while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
    if (prevComputedStyle.position === 'fixed') {
      break;
    }
    var computedStyle = defaultView.getComputedStyle(elem, null);
    top -= elem.scrollTop;
    left -= elem.scrollLeft;
    if (elem === offsetParent) {
      top += elem.offsetTop;
      left += elem.offsetLeft;
      top += parseFloat(computedStyle.borderTopWidth) || 0;
      left += parseFloat(computedStyle.borderLeftWidth) || 0;
      offsetParent = elem.offsetParent;
    }
    prevComputedStyle = computedStyle;
  }
  if (prevComputedStyle.position === 'relative' || prevComputedStyle.position === 'static') {
    top += body.offsetTop;
    left += body.offsetLeft;
  }
  if (prevComputedStyle.position === 'fixed' && !dontFixScroll) {
    top += Math.max(docElem.scrollTop, body.scrollTop);
    left += Math.max(docElem.scrollLeft, body.scrollLeft);
  }
  return {
    top: top,
    left: left
  };
};

},{}],29:[function(require,module,exports){
'use strict';

var toCamelCase = require('to-camel-case');
exports.hasAttribute = function hasAttribute(element, name) {
  name = toCamelCase(name === 'for' ? 'htmlFor' : name);
  return element.hasAttribute(name);
};

},{"to-camel-case":170}],30:[function(require,module,exports){
'use strict';

function hasClass(element, name) {
  return typeof element !== 'undefined' && typeof element.classList !== 'undefined' && element.classList.contains(name);
}
module.exports = hasClass;

},{}],31:[function(require,module,exports){
'use strict';

var bodyReadyPromise = null;
var bodyReadyRepeats = 0;
var MAX_BODY_WAITING = 10;
function processIsBodyReady(resolve, reject) {
  if (typeof document === 'undefined') {
    reject('NO_DOCUMENT');
    return;
  }
  if (window !== window.top) {
    reject('NOT_TOP');
    return;
  }
  if (!document.body || document.body === null || document.body === undefined) {
    bodyReadyRepeats++;
    if (bodyReadyRepeats < MAX_BODY_WAITING) {
      setTimeout(processIsBodyReady.bind(null, resolve, reject), 100);
    } else {
      reject('NO_BODY');
    }
  } else {
    resolve();
  }
}
function isBodyReady() {
  if (bodyReadyPromise === null) {
    bodyReadyPromise = new Promise(processIsBodyReady);
  }
  return bodyReadyPromise;
}
isBodyReady.reset = function () {
  bodyReadyPromise = null;
  bodyReadyRepeats = 0;
};
module.exports = isBodyReady;

},{}],32:[function(require,module,exports){
'use strict';

var isEmpty = require('../lib/isEmpty');
module.exports = function isChild(parent, child) {
  if (isEmpty(parent) || isEmpty(child)) {
    return false;
  }
  if (parent === child) {
    return true;
  }
  return Array.from(parent.childNodes).some(function (element) {
    return isChild(element, child);
  });
};

},{"../lib/isEmpty":66}],33:[function(require,module,exports){
'use strict';

var ignore = require('../lib/ignore');
var Chain = require('./Chain');
var domElement = require('dom-element');
var createElement = require('./createElement');
var parseMarkdown = require('./parseMarkdown');
createElement.attr = domElement.attr;
createElement.hasAttr = require('./hasAttribute').hasAttribute;
createElement.attrNS = domElement.attrNS;
createElement.prop = domElement.prop;
createElement.css = domElement.css;
createElement.type = domElement.type;
createElement.data = domElement.data;
createElement.value = domElement.value;
createElement.hasClass = require('./hasClass');
createElement.addClass = domElement.addClass;
createElement.removeClass = domElement.removeClass;
createElement.toggleClass = domElement.toggleClass;
createElement.createElement = createElement;
createElement.removeElement = require('./removeElement');
createElement.getOffset = require('./getOffset');
createElement.emptyElement = require('./emptyElement');
createElement.getText = require('./getElementText').parseTextNodes;
createElement.qualifyURL = require('./qualifyURL');
createElement.isChild = require('./isChild');
createElement.px = require('./pixelValue');
createElement.isBodyReady = require('./isBodyReady');
createElement.clearValue = require('./clearValue');
createElement.correctZIndex = require('./correctZIndex');
createElement.text = function (element, text) {
  if (arguments.length === 1) {
    return domElement.text(element);
  }
  if (Object.prototype.toString.call(text) === '[object Function]') {
    var result = text();
    if (result instanceof Promise) {
      text = result;
    } else {
      return domElement.text(element, result);
    }
  }
  if (text instanceof Promise) {
    text.then(function (msg) {
      return domElement.text(element, msg);
    })["catch"](ignore);
  } else {
    return domElement.text(element, text);
  }
};
createElement.setText = require('./setText');
createElement.appendText = require('./appendText');
createElement.setContent = require('./setContent');
createElement.insertAfter = function (element, after) {
  if (after.nextElementSibling) {
    after.parentNode.insertBefore(element, after.nextElementSibling);
  } else {
    after.parentNode.appendChild(element);
  }
};
createElement.insertFirst = function (element, container) {
  if (container.firstElementChild) {
    container.insertBefore(element, container.firstElementChild);
  } else {
    container.appendChild(element);
  }
};
createElement.chain = function (element) {
  return new Chain(createElement, element);
};
createElement.find = function (selector) {
  return document.querySelector(selector);
};
createElement.findAll = function (selector) {
  return Array.from(document.querySelectorAll(selector));
};
createElement.parse = function (text, userConfig) {
  return parseMarkdown(createElement, text, userConfig);
};
module.exports = createElement;

},{"../lib/ignore":63,"./Chain":20,"./appendText":22,"./clearValue":23,"./correctZIndex":24,"./createElement":25,"./emptyElement":26,"./getElementText":27,"./getOffset":28,"./hasAttribute":29,"./hasClass":30,"./isBodyReady":31,"./isChild":32,"./parseMarkdown":34,"./pixelValue":35,"./qualifyURL":36,"./removeElement":37,"./setContent":38,"./setText":39,"dom-element":160}],34:[function(require,module,exports){
'use strict';

var extend = require('extend');
function parseMarkdown(dom, text, userConfig) {
  var config = userConfig !== undefined ? extend(true, {}, parseMarkdown.DEFAULT_CONFIG, userConfig) : parseMarkdown.DEFAULT_CONFIG;
  var container = document.createDocumentFragment();
  function processLinks(element, text) {
    var re = /\[(.+?)\]\((.+?)\)/;
    var elements = text.split(re);
    if (elements.length === 1) {
      dom.appendText(element, text);
      return element;
    }
    var isNextLink = false;
    var i = 0;
    while (i < elements.length) {
      var block = elements[i];
      if (isNextLink) {
        i++;
        element.appendChild(dom('a', {
          href: block,
          target: '_blank'
        }, elements[i]));
        isNextLink = false;
      } else {
        if (block !== '') {
          dom.appendText(element, block);
        }
        isNextLink = true;
      }
      i++;
    }
    return element;
  }
  function processBold(element, text) {
    var elements = text.split('*');
    if (elements.length === 1) {
      processLinks(element, text);
      return element;
    }
    var isNextBold = false;
    for (var i = 0; i < elements.length; i++) {
      var block = elements[i];
      if (isNextBold) {
        element.appendChild(processLinks(dom('b'), block));
        isNextBold = false;
      } else {
        if (block !== '') {
          processLinks(element, block);
        }
        isNextBold = true;
      }
    }
    return element;
  }
  function processLinebreak(element, text) {
    var lines = text.split('\n');
    lines.forEach(function (line, index) {
      processBold(element, line);
      if (index + 1 < lines.length) {
        element.appendChild(dom('br'));
      }
    });
    return element;
  }
  function processParagraphs(element, text) {
    var paragraphs = text.split('\n\n');
    paragraphs.forEach(function (content) {
      var headers = content.split('===');
      if (headers.length > 1) {
        element.appendChild(dom('h2', {}, headers[0]));
        if (headers[1] !== '') {
          element.appendChild(processLinebreak(dom('p'), headers[1]));
        }
      } else {
        element.appendChild(processLinebreak(dom('p'), content));
      }
    });
    return element;
  }
  if (config.lineBreak === 'p') {
    return processParagraphs(container, text);
  } else if (config.lineBreak === 'br') {
    return processLinebreak(container, text);
  } else {
    container.appendChild(document.createTextNode(text));
    return container;
  }
}
parseMarkdown.DEFAULT_CONFIG = {
  lineBreak: 'p'
};
module.exports = parseMarkdown;

},{"extend":164}],35:[function(require,module,exports){
'use strict';

module.exports = function pixelValue(value) {
  var result = 0;
  try {
    result = parseInt(value);
    if (isNaN(result)) {
      result = 0;
    }
  } catch (ignore) {
    result = 0;
  }
  return result;
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = function qualifyURL(url, returnNode) {
  var a = document.createElement('a');
  a.href = url;
  if (returnNode === true) {
    return a.cloneNode(false);
  } else {
    return a.cloneNode(false).href;
  }
};

},{}],37:[function(require,module,exports){
'use strict';

var isEmpty = require('../lib/isEmpty');
module.exports = function removeElement(element) {
  if (!(element instanceof Node)) {
    return;
  }
  if (isEmpty(element.parentNode)) {
    return;
  }
  element.parentNode.removeChild(element);
};

},{"../lib/isEmpty":66}],38:[function(require,module,exports){
'use strict';

var emptyElement = require('./emptyElement');
var _require = require('./_createElement'),
  appendChild = _require.appendChild,
  replaceChild = _require.replaceChild;
function setContent(element, content) {
  emptyElement(element);
  appendChild(element, content);
}
module.exports = setContent;

},{"./_createElement":21,"./emptyElement":26}],39:[function(require,module,exports){
'use strict';

module.exports = function setText(element, text) {
  if (text instanceof Promise) {
    text.then(function (msg) {
      return setText(element, msg);
    })["catch"](function (reason) {
      return setText(element, reason);
    });
    return;
  }
  var textNode = null;
  var newTextNode = document.createTextNode(text);
  Array.from(element.childNodes).some(function (node) {
    return node.nodeType === Node.TEXT_NODE ? textNode = node : false;
  });
  if (textNode === null) {
    element.appendChild(newTextNode);
  } else {
    element.replaceChild(newTextNode, textNode);
  }
};

},{}],40:[function(require,module,exports){
'use strict';

var createElement = require('./createElement');
var entities = new (require('html-entities').AllHtmlEntities)();
function getTextSize(text, element) {
  if (!(element instanceof HTMLElement)) {
    element = document.body;
  }
  var style = window.getComputedStyle(element, null);
  var tmp = createElement('span', text);
  var len = style.length;
  for (var i = 0; i < len; i++) {
    var key = style[i];
    tmp.style.setProperty(key, style.getPropertyValue(key));
  }
  document.body.appendChild(tmp);
  tmp.style.setProperty('white-space', 'nowrap');
  tmp.style.setProperty('visibility', 'hidden');
  var result = tmp.offsetWidth;
  document.body.removeChild(tmp);
  return result;
}
function truncateToFit(str, width, ellipsis, element) {
  width = width || 100;
  ellipsis = ellipsis || '...';
  if (!(element instanceof HTMLElement)) {
    element = document.body;
  }
  var textNode = document.createTextNode(str);
  var tmp = createElement('span', {}, textNode);
  var style = window.getComputedStyle(element, null);
  var len = style.length;
  for (var i = 0; i < len; i++) {
    var key = style[i];
    tmp.style.setProperty(key, style.getPropertyValue(key));
  }
  tmp.style.setProperty('white-space', 'nowrap');
  tmp.style.setProperty('visibility', 'hidden');
  document.body.appendChild(tmp);
  function getTextSize(text) {
    tmp.removeChild(textNode);
    textNode = document.createTextNode(text);
    tmp.appendChild(textNode);
    return tmp.offsetWidth;
  }
  var strWidth = getTextSize(str);
  if (strWidth < width) {
    document.body.removeChild(tmp);
    return str;
  }
  var ellipsisWidth = getTextSize(ellipsis);
  var result = '';
  var counter = 0;
  while (counter < 1000) {
    str = str.substr(0, str.length - 2);
    strWidth = getTextSize(str);
    if (strWidth + ellipsisWidth < width) {
      result = str + ellipsis;
      break;
    }
    if (str.length < 1) {
      result = ellipsis;
      break;
    }
    counter++;
  }
  document.body.removeChild(tmp);
  return result;
}
function copyTextToClipboardFallback(text) {
  var container = document.createElement('div');
  container.style.opacity = '0';
  container.style.position = 'absolute';
  container.innerHTML = text;
  document.body.appendChild(container);
  var range = document.createRange();
  var selection = window.getSelection();
  range.selectNodeContents(container);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
  }
  document.body.removeChild(container);
}
;
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    copyTextToClipboardFallback(text);
    return true;
  }
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}
;
exports.getTextSize = getTextSize;
exports.truncateToFit = truncateToFit;
exports.copyTextToClipboard = copyTextToClipboard;
exports.decode = entities.decode;

},{"./createElement":25,"html-entities":165}],41:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var ColumnDisplay = function () {
  function ColumnDisplay(title, columns) {
    _classCallCheck(this, ColumnDisplay);
    this._title = title || '';
    this._columns = columns || 1;
    if (this._columns < 1) {
      throw new RangeError('Can not be less then 1 column');
    }
    this._element = null;
    this._header = null;
    this._table = null;
    this._items = [];
    this._ready = false;
    this.init();
  }
  return _createClass(ColumnDisplay, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "title",
    get: function get() {
      return this._title;
    },
    set: function set(value) {
      this._title = value;
      dom.text(this._header, this._title);
    }
  }, {
    key: "init",
    value: function init() {
      if (this._ready) {
        throw new Error('This is already processed');
      }
      this._element = dom('div');
      this._header = dom('h3', this._title);
      this._table = dom('table');
      this._element.appendChild(this._header);
      this._element.appendChild(this._table);
      this._ready = true;
    }
  }, {
    key: "sort",
    value: function sort(compareFunction) {
      this._items.sort(compareFunction);
      this.update();
    }
  }, {
    key: "addItem",
    value: function addItem(item) {
      if (item instanceof Node) {
        this._items.push(item);
        this.update();
      } else {
        throw new TypeError('Item should be Node');
      }
    }
  }, {
    key: "removeItem",
    value: function removeItem(item) {
      if (!(item instanceof Node)) {
        throw new TypeError('Item should be Node');
      }
      var index = this._items.indexOf(item);
      if (index !== -1) {
        this._items.splice(index, 1);
        this.update();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this._items = [];
      this.update();
    }
  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    },
    set: function set(value) {
      if (value < 1) {
        throw new Error('Can not be less then 1 column');
      }
      this._columns = value;
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      dom.emptyElement(this._table);
      if (this._items.length === 0) {
        return;
      }
      var row = this._table.insertRow(-1);
      var itemsInColumn = Math.ceil(this.length / this._columns);
      var column = row.insertCell(-1);
      var index = 0;
      this._items.forEach(function (item) {
        if (index >= itemsInColumn) {
          column = row.insertCell(-1);
          index = 0;
        }
        column.appendChild(item);
        index++;
      });
    }
  }, {
    key: "length",
    get: function get() {
      return this._items.length;
    }
  }, {
    key: "remove",
    value: function remove() {
      dom.removeElement(this._table);
      dom.removeElement(this._header);
      dom.removeElement(this._element);
      delete this._element;
      delete this._title;
      delete this._columns;
      delete this._table;
      delete this._header;
      delete this._items;
    }
  }]);
}();
module.exports = ColumnDisplay;

},{"../dom/main":33}],42:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var eventsMixin = require('../utils/eventsMixin');
var extend = require('extend');
var Draggable = function () {
  function Draggable(element, config) {
    _classCallCheck(this, Draggable);
    this._config = extend(true, {}, Draggable.DEFAULT_CONFIG, config);
    this._element = element;
    this._state = Draggable.STATE_NONE;
    this._lastCoord = {
      left: 0,
      top: 0
    };
    this._processMouseDown = this._handleMouseDown.bind(this);
    this._processMouseUp = this._handleMouseUp.bind(this);
    this._processMouseMove = this._handleMouseMove.bind(this);
    this._element.addEventListener('mousedown', this._processMouseDown);
    this._element.addEventListener('mouseup', this._processMouseUp);
  }
  return _createClass(Draggable, [{
    key: "_handleMouseDown",
    value: function _handleMouseDown(event) {
      if (this._state !== Draggable.STATE_NONE) {
        return;
      }
      this._state = Draggable.STATE_DOWN;
      var body = this._element.ownerDocument.body;
      body.addEventListener('mousemove', this._processMouseMove);
      body.addEventListener('mouseup', this._processMouseUp);
      this._lastCoord.left = event.screenX;
      this._lastCoord.top = event.screenY;
      this.dispatchEvent('down');
    }
  }, {
    key: "_handleMouseUp",
    value: function _handleMouseUp(event) {
      if (this._state === Draggable.STATE_NONE) {
        return;
      }
      this._state = Draggable.STATE_NONE;
      var body = this._element.ownerDocument.body;
      body.removeEventListener('mousemove', this._processMouseMove);
      body.removeEventListener('mouseup', this._processMouseUp);
      this._lastCoord.left = event.screenX;
      this._lastCoord.top = event.screenY;
      this.dispatchEvent('up');
    }
  }, {
    key: "_handleMouseMove",
    value: function _handleMouseMove(event) {
      if (this._state === Draggable.STATE_NONE) {
        return;
      }
      this._state = Draggable.STATE_MOVE;
      var delta = {
        left: this._lastCoord.left - event.screenX,
        top: this._lastCoord.top - event.screenY
      };
      this._lastCoord.left = event.screenX;
      this._lastCoord.top = event.screenY;
      this.dispatchEvent('move', delta);
    }
  }, {
    key: "remove",
    value: function remove() {
      this._element.removeEventListener('mousedown', this._processMouseDown);
      this._element.removeEventListener('mouseup', this._processMouseUp);
      if (this._state !== Draggable.STATE_NONE) {
        var body = this._element.ownerDocument.body;
        body.removeEventListener('mousemove', this._processMouseMove);
        body.removeEventListener('mouseup', this._processMouseUp);
      }
      this._state = Draggable.STATE_NONE;
      this.dispatchEvent('up');
    }
  }]);
}();
Draggable.DEFAULT_CONFIG = {
  button: 0,
  mouseUpBody: true
};
Draggable.STATE_NONE = 0;
Draggable.STATE_DOWN = 1;
Draggable.STATE_MOVE = 2;
eventsMixin(Draggable.prototype);
module.exports = Draggable;

},{"../utils/eventsMixin":148,"extend":164}],43:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var extend = require('extend');
var Dropdown = function () {
  function Dropdown(container, config) {
    _classCallCheck(this, Dropdown);
    this._config = extend(true, {}, Dropdown.DEFAULT_CONFIG, config);
    if (!container) {
      throw new Error('container should be DOM Element');
    }
    this._container = container;
    this._visible = false;
    this._appended = false;
    this._items = new Map();
    this._body = null;
    this._containerClickListener = this.clickHandler.bind(this);
    this._bodyClickListener = this.bodyClickHandler.bind(this);
  }
  return _createClass(Dropdown, [{
    key: "config",
    get: function get() {
      return this._config;
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }, {
    key: "body",
    get: function get() {
      return this._body;
    }
  }, {
    key: "init",
    value: function init() {
      this._container.addEventListener('click', this._containerClickListener);
      this._body = dom('div', {
        className: this.config.containerClass,
        style: 'display:none; position:absolute;'
      });
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      if (event.button === Dropdown.MOUSE_BUTTONS[this.config.button]) {
        this.config.preventDefault && event.preventDefault();
        this.config.stopPropagation && event.stopPropagation();
        if (this.config.toggle) {
          if (this._visible) {
            this.hide();
          } else {
            this.show();
          }
        } else {
          if (!this._visible) {
            this.show();
          }
        }
      }
    }
  }, {
    key: "bodyClickHandler",
    value: function bodyClickHandler(event) {
      if (!dom.isChild(this._container, event.target) && !dom.isChild(this._body, event.target)) {
        this.hide();
      }
    }
  }, {
    key: "show",
    value: function show() {
      if (this._visible) {
        return;
      }
      if (!this._appended) {
        document.body.appendChild(this._body);
        this._appended = true;
      }
      dom.css(this._body, 'display', 'block');
      this.position();
      if (this.config.bodyClickHide) {
        document.body.addEventListener('click', this._bodyClickListener);
      }
      this._visible = true;
      this.dispatchEvent('show');
    }
  }, {
    key: "position",
    value: function position() {
      var position = dom.getOffset(this._container, this.config.positionFixed);
      var width = this._body.offsetWidth;
      var maxWidth = document.body.clientWidth;
      var result = {
        left: 'auto',
        top: position.top + this._container.offsetHeight + this.config.positionCorrection.top + 'px'
      };
      if (position.left + width > maxWidth) {
        result.left = position.left + this.config.positionCorrection.left + this._container.offsetWidth - width + 'px';
      } else {
        result.left = position.left + this.config.positionCorrection.left + 'px';
      }
      if (dom.hasClass(this._body, 'seoquake-dropdown-container__up')) {
        result.top = position.top - this._body.offsetHeight - this.config.positionCorrection.top + 'px';
      }
      if (dom.hasClass(this._body, 'seoquake-dropdown-container__right')) {
        result.left = position.left - this._body.offsetWidth - this.config.positionCorrection.left + 'px';
      }
      dom.css(this._body, result);
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._visible) {
        return;
      }
      if (this.config.bodyClickHide) {
        document.body.removeEventListener('click', this._bodyClickListener);
      }
      dom.css(this._body, 'display', 'none');
      if (this._appended) {
        dom.removeElement(this._body);
        this._appended = false;
      }
      this._visible = false;
      this.dispatchEvent('hide');
    }
  }, {
    key: "remove",
    value: function remove() {
      this.clearEvents();
      this.hide();
      this._container.removeEventListener('click', this._containerClickListener);
      dom.removeElement(this._body);
    }
  }]);
}();
Dropdown.DEFAULT_CONFIG = {
  button: 'left',
  preventDefault: true,
  stopPropagation: false,
  autoHide: true,
  bodyClickHide: true,
  toggle: false,
  containerClass: 'seoquake-dropdown-container',
  positionFixed: false,
  positionCorrection: {
    left: 0,
    top: 0,
    right: null,
    bottom: null
  }
};
Dropdown.MOUSE_BUTTONS = {
  left: 0,
  right: 2,
  middle: 1
};
require('../utils/eventsMixin')(Dropdown.prototype);
module.exports = Dropdown;

},{"../dom/main":33,"../utils/eventsMixin":148,"extend":164}],44:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var extend = require('extend');
var getOffset = dom.getOffset;
var FloatPanel = function () {
  function FloatPanel(element, options) {
    _classCallCheck(this, FloatPanel);
    options = options || {};
    this.element = element;
    this.position = getOffset(element);
    this.size = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
    this.config = extend(true, {
      paddingTop: 10,
      stopOn: 0,
      fixOldPosition: true,
      zIndex: 100
    }, options);
    this.initialCSS = {
      position: dom.css(element, 'position'),
      width: dom.css(element, 'width'),
      height: dom.css(element, 'height'),
      top: dom.css(element, 'top'),
      'z-index': dom.css(element, 'z-index')
    };
    this.initialStyle = window.getComputedStyle(this.element);
    this.scrollEventListener = this.scrollEventHandler.bind(this);
    this.resizeEventListener = this.resizeEventHandler.bind(this);
    this.rootElement = element.ownerDocument;
    this.processResizeEvent = true;
    this.rootElement.addEventListener('scroll', this.scrollEventListener);
    window.addEventListener('resize', this.resizeEventListener);
    this.switchMediaToPrintListener = this.switchMediaToPrintHandler.bind(this);
    this.switchMediaToScreenListener = this.switchMediaToScreenHandler.bind(this);
    window.matchMedia('print').addListener(this.switchMediaToPrintListener);
    window.matchMedia('screen').addListener(this.switchMediaToScreenListener);
    this.state = FloatPanel.STATE_OVER;
    this.shadow = null;
  }
  return _createClass(FloatPanel, [{
    key: "paddingTop",
    get: function get() {
      return this.config.paddingTop;
    },
    set: function set(value) {
      this.config.paddingTop = value;
      this.scrollEventHandler();
    }
  }, {
    key: "_setElementWidth",
    value: function _setElementWidth(value) {
      if (value === 'auto') {
        dom.css(this.element, 'width', value);
      } else if (value === undefined || value === null || value === 0) {
        dom.css(this.element, 'width', null);
      } else {
        dom.css(this.element, 'width', value + 'px');
      }
    }
  }, {
    key: "switchMediaToPrintHandler",
    value: function switchMediaToPrintHandler(mql) {
      if (mql.matches) {
        this.processResizeEvent = false;
      }
    }
  }, {
    key: "switchMediaToScreenHandler",
    value: function switchMediaToScreenHandler(mql) {
      if (mql.matches) {
        this.processResizeEvent = true;
      }
    }
  }, {
    key: "resizeEventHandler",
    value: function resizeEventHandler(event) {
      if (!this.processResizeEvent) {
        return;
      }
      if (this.state !== FloatPanel.STATE_OVER) {
        if (this.config.fixOldPosition) {
          this.shadowUpdate();
        } else {
          this._setElementWidth('auto');
          this.size.width = this.element.offsetWidth;
          this._setElementWidth(this.size.width);
        }
      } else {
        this.size.width = this.element.offsetWidth;
      }
    }
  }, {
    key: "scrollEventHandler",
    value: function scrollEventHandler() {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop > this.position.top - this.config.paddingTop - parseInt(this.initialStyle.marginTop)) {
        this.stateInside();
      } else if (this.config.stopOn > 0 && scrollTop + window.innerHeight > this.config.stopOn + this.size.height) {
        this.stateBellow();
      } else {
        this.stateOver();
      }
    }
  }, {
    key: "shadowCreate",
    value: function shadowCreate() {
      if (this.shadow === null) {
        this.shadow = dom.createElement(this.element.nodeName, {
          className: 'float-element-shadow'
        });
        if (dom.css(this.element, 'display') === 'inline-block') {
          dom.css(this.shadow, 'display', 'inline-block');
        } else {
          dom.css(this.shadow, 'display', 'block');
        }
        this.element.parentElement.insertBefore(this.shadow, this.element);
        dom.css(this.shadow, 'width', this.size.width + 'px');
        dom.css(this.shadow, 'height', this.size.height + 'px');
        dom.css(this.shadow, 'margin-top', this.initialStyle.marginTop);
        dom.css(this.shadow, 'margin-right', this.initialStyle.marginRight);
        dom.css(this.shadow, 'margin-bottom', this.initialStyle.marginBottom);
        dom.css(this.shadow, 'margin-left', this.initialStyle.marginLeft);
      }
    }
  }, {
    key: "shadowRemove",
    value: function shadowRemove() {
      dom.removeElement(this.shadow);
      this.shadow = null;
    }
  }, {
    key: "shadowUpdate",
    value: function shadowUpdate() {
      dom.css(this.shadow, 'width', 'auto');
      this.size.width = this.shadow.offsetWidth;
      dom.css(this.shadow, 'width', this.size.width + 'px');
      this._setElementWidth(this.size.width);
    }
  }, {
    key: "stateOver",
    value: function stateOver() {
      if (this.state === FloatPanel.STATE_OVER) {
        return;
      }
      dom.css(this.element, this.initialCSS);
      dom.removeClass(this.element, 'float-element');
      if (this.config.fixOldPosition && this.shadow !== null) {
        this.shadowRemove();
      }
      if (this.state !== FloatPanel.STATE_OVER) {
        this.dispatchEvent('over');
      }
      this.state = FloatPanel.STATE_OVER;
    }
  }, {
    key: "stateInside",
    value: function stateInside() {
      if (this.state === FloatPanel.STATE_OVER) {
        if (this.config.fixOldPosition) {
          this.shadowCreate();
        }
        dom.addClass(this.element, 'float-element');
        dom.css(this.element, 'position', 'fixed');
        dom.css(this.element, 'top', this.config.paddingTop + 'px');
        this._setElementWidth(this.size.width);
        dom.css(this.element, 'z-index', this.config.zIndex);
        this.dispatchEvent('inside');
      }
      this.state = FloatPanel.STATE_INSIDE;
    }
  }, {
    key: "stateBellow",
    value: function stateBellow() {
      this.dispatchEvent('bellow');
    }
  }, {
    key: "remove",
    value: function remove() {
      this.rootElement.removeEventListener('scroll', this.scrollEventListener);
      window.removeEventListener('resize', this.resizeEventListener);
      window.matchMedia('print').removeListener(this.switchMediaToPrintListener);
      window.matchMedia('screen').removeListener(this.switchMediaToScreenListener);
      this.stateOver();
      this.element = null;
      this.rootElement = null;
      this.shadow = null;
      this.clearEvents();
      this.state = FloatPanel.STATE_DISABLED;
      this.size = null;
      this.position = null;
    }
  }]);
}();
require('../utils/eventsMixin')(FloatPanel.prototype);
FloatPanel.STATE_DISABLED = 0;
FloatPanel.STATE_OVER = 1;
FloatPanel.STATE_INSIDE = 2;
FloatPanel.STATE_BELLOW = 3;
module.exports = FloatPanel;

},{"../dom/main":33,"../utils/eventsMixin":148,"extend":164}],45:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var FxLeft = function () {
  function FxLeft(element, dx, time) {
    _classCallCheck(this, FxLeft);
    this._element = element;
    this._dx = dx || this._element.offsetWidth;
    this._time = time || 300;
    this._startTime = null;
    this._delay = 13;
    this._timer = null;
    this._resolve = null;
    this._processTimerTick = this._handleTimerTick.bind(this);
    this._processRun = this._handleRun.bind(this);
  }
  return _createClass(FxLeft, [{
    key: "_move",
    value: function _move(value) {
      dom.css(this._element, 'transform', 'translateX(' + value + 'px)');
    }
  }, {
    key: "move",
    value: function move(value) {
      this._move(value);
    }
  }, {
    key: "_handleTimerTick",
    value: function _handleTimerTick() {
      var now = new Date().getTime();
      if (this._startTime + this._time <= now) {
        this._move(this._dx);
        clearInterval(this._timer);
        this._timer = null;
        this._dx = 0;
        this._resolve();
      } else {
        var Tpos = (now - this._startTime) / this._time;
        this._move(Tpos * this._dx);
      }
    }
  }, {
    key: "_handleRun",
    value: function _handleRun(resolve) {
      if (this._time === 0) {
        this._move(this._dx);
        resolve();
      } else if (this._dx === 0) {
        resolve();
      } else {
        this._move(0);
        this._startTime = new Date().getTime();
        this._resolve = resolve;
        this._timer = setInterval(this._processTimerTick, this._delay);
      }
    }
  }, {
    key: "run",
    value: function run() {
      return new Promise(this._processRun);
    }
  }]);
}();
module.exports = FxLeft;

},{"../dom/main":33}],46:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var extend = require('extend');
var HintBox = function () {
  function HintBox(element, config) {
    _classCallCheck(this, HintBox);
    this._owner = element;
    this._message = '';
    this._config = extend(true, {}, HintBox.DEFAULT_CONFIG, config);
    if (dom.hasAttr(this._owner, 'data-message')) {
      this._message = dom.attr(this._owner, 'data-message');
    } else if (this.config.message !== '') {
      this._message = this.config.message;
    }
    this.eventShowListener = this.eventShowHandler.bind(this);
    this.eventHideListener = this.eventHideHandler.bind(this);
    this._visible = false;
    this._element = null;
    this.event = this.config.event;
    this.deleteTimer = null;
  }
  return _createClass(HintBox, [{
    key: "config",
    get: function get() {
      return extend(true, {}, this._config);
    },
    set: function set(value) {
      this._config = extend(true, {}, HintBox.DEFAULT_CONFIG, value);
      if (this._visible) {
        this.reposition();
      }
    }
  }, {
    key: "deleteTimer",
    get: function get() {
      return this._deleteTimer;
    },
    set: function set(value) {
      if (this._deleteTimer !== null) {
        clearTimeout(this._deleteTimer);
      }
      this._deleteTimer = value;
    }
  }, {
    key: "message",
    get: function get() {
      return this._message;
    },
    set: function set(value) {
      this._message = value;
      if (this._element !== null) {
        this._fillElementMessage();
      }
    }
  }, {
    key: "event",
    set: function set(value) {
      this._removeCurrentListeners();
      switch (value) {
        case 'click':
          this._owner.addEventListener('click', this.eventShowListener);
          break;
        case 'hover':
          this._owner.addEventListener('mouseenter', this.eventShowListener);
          this._owner.addEventListener('mouseleave', this.eventHideListener);
      }
      this.config.event = value;
    }
  }, {
    key: "element",
    get: function get() {
      this.deleteTimer = null;
      if (this._element === null) {
        this._element = dom('div', {
          className: this.config.className
        });
        this._messageContainer = dom('div', {
          className: this.config.innerClassName
        });
        this._element.appendChild(this._messageContainer);
        this._fillElementMessage();
        this._owner.ownerDocument.body.appendChild(this._element);
      }
      return this._element;
    }
  }, {
    key: "_removeCurrentListeners",
    value: function _removeCurrentListeners() {
      switch (this.config.event) {
        case 'click':
          this._owner.removeEventListener('click', this.eventShowListener);
          this._owner.removeEventListener('click', this.eventHideListener);
          break;
        case 'hover':
          this._owner.removeEventListener('mouseenter', this.eventShowListener);
          this._owner.removeEventListener('mouseleave', this.eventHideListener);
      }
    }
  }, {
    key: "_fillElementMessage",
    value: function _fillElementMessage() {
      if (this._message instanceof DocumentFragment) {
        var clone = this._message.cloneNode(true);
        dom.setContent(this._messageContainer, clone);
      } else {
        dom.setContent(this._messageContainer, this._message);
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      var _this = this;
      if (!this._visible || this._element === null || typeof this._element === 'undefined') {
        return;
      }
      dom.removeClass(this.element, 'seoquake-hintbox-visible');
      if (this.config.event === 'click') {
        this._owner.addEventListener('click', this.eventShowListener);
        this._owner.removeEventListener('click', this.eventHideListener);
        this._owner.ownerDocument.removeEventListener('click', this.eventHideListener);
      }
      this._visible = false;
      if (this.config.autoRemove) {
        this.deleteTimer = setTimeout(function () {
          return _this.removeHintElement();
        }, 100);
      }
    }
  }, {
    key: "show",
    value: function show() {
      if (this._visible) {
        return;
      }
      this.reposition();
      if (this.config.event === 'click') {
        this._owner.removeEventListener('click', this.eventShowListener);
        this._owner.addEventListener('click', this.eventHideListener);
      }
      dom.css(this.element, 'visibility', 'visible');
      dom.addClass(this.element, 'seoquake-hintbox-visible');
      this._visible = true;
    }
  }, {
    key: "reposition",
    value: function reposition() {
      var style = {
        position: 'absolute',
        visibility: 'hidden'
      };
      var _dom$getOffset = dom.getOffset(this._owner, this._config.positionFixed),
        top = _dom$getOffset.top,
        left = _dom$getOffset.left;
      var width = this._owner.offsetWidth;
      if (this._config.offset.left !== null) {
        left += this._config.offset.left;
      }
      if (this._config.offset.top !== null) {
        top += this._config.offset.top;
      }
      if (this.config.className.indexOf('seoquake-hintbox-bottom') !== -1) {
        top += this._owner.offsetHeight;
      }
      if (this.config.className.indexOf('seoquake-hintbox-side-') !== -1) {
        var leftSet = left;
        if (this.config.className.indexOf('seoquake-hintbox-side-right') !== -1) {
          leftSet += width + 5;
        }
        style.left = leftSet + 'px';
        style.top = top + 'px';
        dom.css(this.element, style);
        if (this.config.inline) {
          dom.css(this._messageContainer, {
            whiteSpace: 'nowrap',
            width: 'auto'
          });
        }
        if (this.config.className.indexOf('seoquake-hintbox-side-left') !== -1) {
          leftSet = left - this._messageContainer.offsetWidth;
          dom.css(this.element, 'left', leftSet + 'px');
        }
        if (leftSet + this._messageContainer.offsetWidth > document.body.clientWidth) {
          leftSet = left - this._messageContainer.offsetWidth;
          dom.css(this.element, 'left', leftSet + 'px');
          dom.addClass(this.element, 'seoquake-hintbox-side-left');
        }
      } else {
        var _leftSet = Math.min(left, left - (16 - width / 2));
        style.left = _leftSet + 'px';
        style.top = top + 'px';
        dom.css(this.element, style);
        if (this.config.inline) {
          dom.css(this._messageContainer, {
            whiteSpace: 'nowrap',
            width: 'auto'
          });
        }
        if (left + this._messageContainer.offsetWidth > document.body.clientWidth) {
          _leftSet = left - (this._messageContainer.offsetWidth - width) + 'px';
          dom.css(this.element, 'left', _leftSet);
          dom.addClass(this.element, 'seoquake-hintbox-right');
        }
      }
    }
  }, {
    key: "eventShowHandler",
    value: function eventShowHandler(event) {
      event.stopPropagation();
      event.preventDefault();
      this.show();
      if (this.config.event === 'click') {
        var eventClone = new event.constructor(event.type, event);
        this._owner.ownerDocument.dispatchEvent(eventClone);
        this._owner.ownerDocument.addEventListener('click', this.eventHideListener, true);
      }
    }
  }, {
    key: "eventHideHandler",
    value: function eventHideHandler(event) {
      event.stopPropagation();
      event.preventDefault();
      this.hide();
    }
  }, {
    key: "removeHintElement",
    value: function removeHintElement() {
      this.deleteTimer = null;
      if (this._element === null) {
        return;
      }
      dom.removeElement(this._element);
      this._element = null;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeHintElement();
      this._removeCurrentListeners();
      this._owner = null;
    }
  }]);
}();
HintBox.DEFAULT_CONFIG = {
  event: 'click',
  className: 'seoquake-hintbox',
  innerClassName: 'seoquake-hintbox-message',
  message: '',
  autoRemove: true,
  inline: false,
  positionFixed: false,
  offset: {
    left: null,
    top: null
  }
};
module.exports = HintBox;

},{"../dom/main":33,"extend":164}],47:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Dropdown = require('./Dropdown');
var dom = require('../dom/main');
var extend = require('extend');
var ignore = require('../lib/ignore');
var FxLeft = require('../effects/FxLeft');
var MoreDropdown = function () {
  function MoreDropdown(container, dropdownButton, config) {
    _classCallCheck(this, MoreDropdown);
    this._config = extend(true, {}, MoreDropdown.DEFAULT_CONFIGURATION, config);
    this._element = container;
    this._container = null;
    this._dropdownButton = dropdownButton;
    this._width = null;
    this._dropdown = new Dropdown(this._dropdownButton, this._config.dropdownConfig);
    this._observer = null;
    this._processElementChange = this._handleElementChange.bind(this);
    this._isInit = false;
  }
  return _createClass(MoreDropdown, [{
    key: "config",
    get: function get() {
      return this._config;
    }
  }, {
    key: "dropdownConfig",
    get: function get() {
      return this._dropdown.config;
    }
  }, {
    key: "dropdown",
    get: function get() {
      return this._dropdown;
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }, {
    key: "button",
    get: function get() {
      return this._dropdownButton;
    }
  }, {
    key: "width",
    get: function get() {
      return this._width;
    },
    set: function set(value) {
      this._width = value;
      if (this._isInit) {
        dom.css(this._container, 'width', this._width + 'px');
        this._processMovement();
      }
    }
  }, {
    key: "dropdownList",
    get: function get() {
      return this._dropdown.body;
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (this._isInit) {
        return;
      }
      this._container = dom('div', {
        className: this._config.containerClass
      });
      this._element.parentNode.replaceChild(this._container, this._element);
      this._container.appendChild(this._element);
      this._dropdown.init();
      this._dropdown.addEventListener('show', function () {
        return dom.addClass(_this._dropdownButton, 'sqseobar-button-more-down');
      });
      this._dropdown.addEventListener('hide', function () {
        return dom.removeClass(_this._dropdownButton, 'sqseobar-button-more-down');
      });
      this._observer = new MutationObserver(this._processElementChange);
      this._isInit = true;
    }
  }, {
    key: "_startObserver",
    value: function _startObserver() {
      this._observer.observe(this._container, {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "_stopObserver",
    value: function _stopObserver() {
      this._observer.disconnect();
    }
  }, {
    key: "_handleElementChange",
    value: function _handleElementChange(mutations) {
      this._processMovement();
    }
  }, {
    key: "_showMoreButton",
    value: function _showMoreButton() {
      dom.css(this._dropdownButton, 'visibility', 'visible');
    }
  }, {
    key: "_hideMoreButton",
    value: function _hideMoreButton() {
      dom.css(this._dropdownButton, 'visibility', 'hidden');
    }
  }, {
    key: "_popFromMenu",
    value: function _popFromMenu() {
      var itemsList = this.dropdownList;
      var limit = itemsList.children.length;
      var counter = 0;
      while (itemsList.children.length > 0 && this._element.offsetWidth < this._container.clientWidth && counter < limit) {
        var child = itemsList.firstChild;
        if (child) {
          dom.css(child, 'visibility', 'hidden');
          this._element.appendChild(child);
          if (this._element.offsetWidth > this._container.clientWidth) {
            if (itemsList.children.length === 0) {
              itemsList.appendChild(child);
            } else {
              itemsList.insertBefore(child, itemsList.firstChild);
            }
            dom.css(child, 'visibility', 'visible');
            break;
          } else {
            dom.css(child, 'visibility', 'visible');
          }
        }
        counter++;
      }
      if (itemsList.children.length === 0) {
        this._hideMoreButton();
        this._dropdown.hide();
      }
    }
  }, {
    key: "_pushToMenu",
    value: function _pushToMenu() {
      var _this2 = this;
      var itemsList = this.dropdownList;
      var limit = this._element.children.length;
      var counter = 0;
      var _loop = function _loop() {
          var child = _this2._element.querySelector('div:not(.sqignore):last-child');
          if (!child) {
            return {
              v: void 0
            };
          }
          if (_this2._element.offsetWidth - child.offsetWidth < _this2._container.clientWidth) {
            var clone = child.cloneNode(true);
            dom.addClass(clone, 'sqignore');
            _this2._element.replaceChild(clone, child);
            var effect = new FxLeft(clone);
            effect.run().then(function () {
              return _this2._element.removeChild(clone);
            })["catch"](ignore);
            prepend(itemsList, child);
            return 0;
          } else {
            prepend(itemsList, child);
          }
          counter++;
        },
        _ret;
      while (this._element.offsetWidth > this._container.clientWidth && counter < limit) {
        _ret = _loop();
        if (_ret === 0) break;
        if (_ret) return _ret.v;
      }
      if (itemsList.children.length > 0) {
        this._showMoreButton();
      }
    }
  }, {
    key: "_processMovement",
    value: function _processMovement() {
      this._stopObserver();
      if (this._element.offsetWidth < this._container.clientWidth) {
        this._popFromMenu();
      } else {
        this._pushToMenu();
      }
      this._dropdown.position();
      this._startObserver();
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this._observer.disconnect();
      this._dropdown.remove();
      this._dropdownButton = null;
      this._config = null;
      this._isInit = false;
      this._dropdown = null;
      this._container.parentNode.replaceChild(this._element, this._container);
      dom.removeElement(this._container);
      this._container = null;
    }
  }]);
}();
MoreDropdown.DEFAULT_CONFIGURATION = {
  containerClass: 'sqmore-container',
  dropdownConfig: {
    containerClass: 'sqmore-dropdown-container sqseobar2-more-dropdown',
    positionCorrection: {
      top: 11,
      left: -7
    }
  }
};
function prepend(where, what) {
  if (where.children.length === 0) {
    where.appendChild(what);
  } else {
    where.insertBefore(what, where.firstChild);
  }
}
require('../utils/eventsMixin')(MoreDropdown.prototype);
module.exports = MoreDropdown;

},{"../dom/main":33,"../effects/FxLeft":45,"../lib/ignore":63,"../utils/eventsMixin":148,"./Dropdown":43,"extend":164}],48:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var Dropdown = require('./Dropdown');
var translateMixin = require('../utils/translateMixin');
var dom = require('../dom/main');
var extend = require('extend');
var ignore = require('../lib/ignore');
var OnboardingDropdown = function (_Dropdown) {
  function OnboardingDropdown(container, config) {
    var _this;
    _classCallCheck(this, OnboardingDropdown);
    config = config ? extend(true, {}, OnboardingDropdown.DEFAULT_CONFIG, config) : OnboardingDropdown.DEFAULT_CONFIG;
    _this = _callSuper(this, OnboardingDropdown, [container, config]);
    _this._textBlock = null;
    _this._buttonOk = null;
    _this._buttonClose = null;
    _this._translateList = [];
    _this.processButtonOkClick = _this.handleButtonOkClick.bind(_this);
    _this.processButtonCancelClick = _this.handleButtonCancelClick.bind(_this);
    _this.processTranslate = _this.handleTranslate.bind(_this);
    return _this;
  }
  _inherits(OnboardingDropdown, _Dropdown);
  return _createClass(OnboardingDropdown, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(OnboardingDropdown.prototype), "init", this).call(this);
      this._textBlock = document.createTextNode('');
      this._buttonOk = dom('button', {
        className: 'seoquake-button seoquake-button-primary'
      });
      this._buttonClose = dom('button', {
        className: 'seoquake-button'
      });
      this.body.appendChild(this._textBlock);
      this.body.appendChild(dom('div', {
        className: 'seoquake-google-keyword-difficulty-buttons'
      }, [this._buttonOk, this._buttonClose]));
      this._buttonOk.addEventListener('click', this.processButtonOkClick, true);
      this._buttonClose.addEventListener('click', this.processButtonCancelClick, true);
      this.translate();
    }
  }, {
    key: "translate",
    value: function translate() {
      Promise.all(this._translateList).then(this.processTranslate)["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      this._buttonOk.removeEventListener('click', this.processButtonOkClick, true);
      this._buttonClose.removeEventListener('click', this.processButtonCancelClick, true);
      _get(_getPrototypeOf(OnboardingDropdown.prototype), "remove", this).call(this);
    }
  }, {
    key: "handleButtonOkClick",
    value: function handleButtonOkClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent('okClick');
    }
  }, {
    key: "handleButtonCancelClick",
    value: function handleButtonCancelClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent('closeClick');
    }
  }, {
    key: "handleTranslate",
    value: function handleTranslate(msgs) {
      if (msgs.length >= 3) {
        dom.css(this._body, {
          left: 0,
          visibility: 'hidden'
        });
        dom.text(this._buttonOk, msgs[0]);
        dom.text(this._buttonClose, msgs[1]);
        this.body.replaceChild(dom.parse(msgs[2], {
          lineBreak: 'br'
        }), this._textBlock);
        this.position();
        dom.css(this._body, {
          visibility: 'visible'
        });
      }
    }
  }]);
}(Dropdown);
OnboardingDropdown.DEFAULT_CONFIG = {
  containerClass: 'seoquake-dropdown-container seoquake-google-keyword-difficulty-onboarding seoquake-google-keyword-difficulty-onboarding_inverse',
  positionCorrection: {
    left: -16,
    top: 8
  },
  bodyClickHide: false
};
translateMixin(OnboardingDropdown.prototype);
module.exports = OnboardingDropdown;

},{"../dom/main":33,"../lib/ignore":63,"../utils/translateMixin":154,"./Dropdown":43,"extend":164}],49:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var extend = require('extend');
var PillsSwitch = function () {
  function PillsSwitch(config) {
    _classCallCheck(this, PillsSwitch);
    this._config = extend(true, {}, PillsSwitch.DEFAULT_CONFIG, config);
    this._items = new Map();
    this._currentItem = null;
    this._element = null;
    this._header = null;
    this._title = '';
    this._itemsContainer = null;
    this._disabled = false;
    this._processItemClick = this._handleItemClick.bind(this);
  }
  return _createClass(PillsSwitch, [{
    key: "config",
    get: function get() {
      return this._config;
    }
  }, {
    key: "currentItem",
    get: function get() {
      return this._currentItem;
    },
    set: function set(value) {
      if (this._items.has(value)) {
        this.switchTo(value);
      }
    }
  }, {
    key: "disabled",
    get: function get() {
      return this._disabled;
    },
    set: function set(value) {
      var _this = this;
      this._disabled = value;
      this._items.forEach(function (button) {
        return dom.attr(button, 'disabled', _this._disabled ? true : null);
      });
    }
  }, {
    key: "title",
    get: function get() {
      return this._title;
    },
    set: function set(value) {
      this._title = String(value);
      dom.text(this.header, this._title);
    }
  }, {
    key: "header",
    get: function get() {
      if (this._header === null) {
        this._header = dom('div', {
          className: this.config.headerClass
        }, this.title);
        var body = this.element;
        if (body.children.length === 0) {
          body.appendChild(this._header);
        } else {
          body.insertBefore(this._header, body.firstElementChild);
        }
      }
      return this._header;
    }
  }, {
    key: "element",
    get: function get() {
      if (this._element === null) {
        this._element = dom('div', {
          className: this.config.className
        });
      }
      return this._element;
    }
  }, {
    key: "itemsContainer",
    get: function get() {
      if (this._itemsContainer === null) {
        this._itemsContainer = dom('div', {
          className: this.config.itemsClass
        });
        this.element.appendChild(this._itemsContainer);
      }
      return this._itemsContainer;
    }
  }, {
    key: "setItem",
    value: function setItem(id, title) {
      if (this._items.has(id)) {
        dom.text(this._items.get(id), String(title));
        return;
      }
      var item = dom('button', {
        className: this.config.itemClass
      }, String(title));
      item.addEventListener('click', this._processItemClick);
      dom.data(item, 'sqpillid', id);
      this._items.set(id, item);
      this.itemsContainer.appendChild(item);
    }
  }, {
    key: "removeItem",
    value: function removeItem(id) {
      if (!this._items.has(id)) {
        return;
      }
      dom.removeElement(this._items.get(id));
      this._items["delete"](id);
    }
  }, {
    key: "switchTo",
    value: function switchTo(value) {
      var _this2 = this;
      this._items.forEach(function (item) {
        return dom.removeClass(item, _this2.config.itemActiveClass);
      });
      dom.addClass(this._items.get(value), this.config.itemActiveClass);
      this._currentItem = value;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._element !== null) {
        this._items.forEach(function (item) {
          return dom.removeElement(item);
        });
        this._items.clear();
        dom.removeElement(this._element);
      }
      this._currentItem = null;
      this._element = null;
      this._header = null;
      this._title = '';
      this._itemsContainer = null;
      this.clearEvents();
    }
  }, {
    key: "_handleItemClick",
    value: function _handleItemClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.currentItem = dom.data(e.target, 'sqpillid');
      this.dispatchEvent('switched', this.currentItem);
    }
  }]);
}();
PillsSwitch.DEFAULT_CONFIG = {
  className: 'seoquake-pills',
  headerClass: 'seoquake-pills-title',
  itemsClass: 'seoquake-pills-items',
  itemClass: 'seoquake-pill',
  itemActiveClass: 'seoquake-pill-active'
};
require('../utils/eventsMixin')(PillsSwitch.prototype);
module.exports = PillsSwitch;

},{"../dom/main":33,"../utils/eventsMixin":148,"extend":164}],50:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var isObject = require('../lib/isObject');
var extend = require('extend');
var ProgressBar = function () {
  function ProgressBar(current, limit, options) {
    _classCallCheck(this, ProgressBar);
    if (isObject(current)) {
      options = current;
      current = null;
    }
    options = extend(true, {}, ProgressBar.DEFAULT_CONFIG, options);
    current = current || null;
    limit = limit || null;
    this._element = dom('div', {
      className: 'sq-progress'
    });
    this._titleElement = null;
    this._percentElement = null;
    this._barElement = null;
    this._barValueElement = null;
    this._showPercent = options.showPercent;
    this._title = options.title;
    this._showBar = options.showBar;
    this.limit = limit || 100;
    this.current = current || 0;
  }
  return _createClass(ProgressBar, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "current",
    get: function get() {
      return this._current;
    },
    set: function set(value) {
      try {
        value = parseInt(value);
      } catch (ignore) {
        value = 0;
      }
      if (value > this._limit) {
        value = this._limit;
      }
      this._current = value;
      this.redraw();
    }
  }, {
    key: "limit",
    get: function get() {
      return this._limit > 0 ? this._limit : 1;
    },
    set: function set(value) {
      try {
        value = parseInt(value);
      } catch (ignore) {
        value = 0;
      }
      this._limit = value;
      if (this._current > this._limit) {
        this._current = this._limit;
      }
      this.redraw();
    }
  }, {
    key: "title",
    get: function get() {
      return this._title;
    },
    set: function set(value) {
      this._title = value;
      this.redraw();
    }
  }, {
    key: "showPercent",
    get: function get() {
      return this._showPercent;
    },
    set: function set(value) {
      this._showPercent = value;
      this.redraw();
    }
  }, {
    key: "showBar",
    get: function get() {
      return this._showBar;
    },
    set: function set(value) {
      this._showBar = value;
      this.redraw();
    }
  }, {
    key: "redraw",
    value: function redraw() {
      var percent = Math.round(this.current / this.limit * 100);
      if (this._title !== '') {
        if (this._titleElement === null) {
          this._titleElement = dom('div', {
            className: 'sq-progress_title'
          }, this._title);
          if (this._element.children.length === 0) {
            this._element.appendChild(this._titleElement);
          } else {
            dom.insertFirst(this._titleElement, this._element);
          }
        } else {
          dom.text(this._titleElement, this._title);
        }
      } else if (this._titleElement !== null) {
        dom.removeElement(this._titleElement);
        this._titleElement = null;
      }
      if (this._showPercent) {
        if (this._percentElement === null) {
          this._percentElement = dom('div', {
            className: 'sq-progress_value'
          }, this.current);
          if (this._titleElement !== null) {
            dom.insertAfter(this._percentElement, this._titleElement);
          } else {
            dom.insertFirst(this._percentElement, this._element);
          }
        } else {
          dom.text(this._percentElement, this.current);
        }
      } else if (this._percentElement !== null) {
        dom.removeElement(this._percentElement);
        this._percentElement = null;
      }
      if (this._showBar) {
        if (this._barElement === null) {
          this._barValueElement = dom('div', {
            className: 'sq-progress_bar-value'
          });
          this._barElement = dom('div', {
            className: 'sq-progress_bar'
          }, this._barValueElement);
          this._element.appendChild(this._barElement);
          dom.css(this._barValueElement, 'width', percent + '%');
        } else {
          dom.css(this._barValueElement, 'width', percent + '%');
        }
      } else if (this._barElement !== null) {
        dom.removeElement(this._barElement);
        this._barElement = null;
        this._barValueElement = null;
      }
    }
  }]);
}();
ProgressBar.DEFAULT_CONFIG = {
  title: '',
  showPercent: false,
  showBar: true
};
module.exports = ProgressBar;

},{"../dom/main":33,"../lib/isObject":68,"extend":164}],51:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var extend = require('extend');
var ignore = require('../lib/ignore');
var Draggable = require('./Draggable');
var ScrollBlock = function () {
  function ScrollBlock(element, config) {
    _classCallCheck(this, ScrollBlock);
    if (!(element instanceof HTMLElement)) {
      throw new DOMError('element should be HTMLElement');
    }
    this._config = extend(true, {}, ScrollBlock.DEFAULT_CONFIG, config);
    this._element = element;
    this._scroll = null;
    this._container = null;
    this._bar = null;
    this._fadeTop = null;
    this._fadeBottom = null;
    this._observer = null;
    this._initialHeight = null;
    this._showScroll = false;
    this._isInit = false;
    this._barDrag = null;
    this._processElementChange = this._handleElementChange.bind(this);
    this._processElementMouseEnter = this._handleElementMouseEnter.bind(this);
    this._processElementMouseLeave = this._handleElementMouseLeave.bind(this);
    this._processElementMouseScroll = this._handleElementMouseScroll.bind(this);
    this._processDragMove = this._handleDragMove.bind(this);
    if (this._config.autoInit) {
      this.init();
    }
  }
  return _createClass(ScrollBlock, [{
    key: "init",
    value: function init() {
      var _this = this;
      if (dom.hasClass(this._element, this._config.classPrefix + 'content')) {
        this._container = this._element.querySelector('.' + this._config.classPrefix + 'container');
        this._scroll = this._element.querySelector('.' + this._config.classPrefix + 'scroll');
        this._bar = this._element.querySelector('.' + this._config.classPrefix + 'scroll-bar');
        this._initialHeight = dom.data(this._element, 'sqscrollheight');
      } else {
        dom.addClass(this._element, this._config.classPrefix + 'content');
        this._container = dom('div', {
          className: this._config.classPrefix + 'container'
        });
        Array.from(this._element.children).forEach(function (el) {
          return _this._container.appendChild(el);
        });
        this._element.appendChild(this._container);
        this._bar = dom('div', {
          className: this._config.classPrefix + 'scroll-bar'
        });
        this._scroll = dom('div', {
          className: this._config.classPrefix + 'scroll'
        }, this._bar);
        this._element.appendChild(this._scroll);
        this._initialHeight = this._element.offsetHeight;
        dom.data(this._element, 'sqscrollheight', this._initialHeight);
      }
      this._barDrag = new Draggable(this._bar);
      this._barDrag.addEventListener('down', function () {
        return dom.addClass(_this._element, _this._config.classPrefix + 'unselectable');
      });
      this._barDrag.addEventListener('move', this._processDragMove);
      this._barDrag.addEventListener('up', function () {
        return dom.removeClass(_this._element, _this._config.classPrefix + 'unselectable');
      });
      dom.css(this._element, 'height', this._initialHeight + 'px');
      this._element.addEventListener('mouseenter', this._processElementMouseEnter);
      this._element.addEventListener('mouseleave', this._processElementMouseLeave);
      this._element.addEventListener('wheel', this._processElementMouseScroll);
      this._observer = new MutationObserver(this._processElementChange);
      this._observer.observe(this._container, {
        childList: true,
        subtree: true
      });
      this._isInit = true;
    }
  }, {
    key: "height",
    get: function get() {
      return parseInt(dom.css(this._element, 'height'));
    },
    set: function set(value) {
      dom.css(this._element, 'height', value + 'px');
      this.renderScrollBar();
    }
  }, {
    key: "contentHeight",
    get: function get() {
      return this._container.scrollHeight;
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }, {
    key: "scroll",
    value: function scroll(delta) {
      var currentScroll = this._container.scrollTop;
      currentScroll = Math.min(currentScroll + delta, this._container.scrollHeight);
      this._container.scrollTop = currentScroll;
      this.renderScrollBar();
    }
  }, {
    key: "scrollUp",
    value: function scrollUp() {
      this.scroll(-this._config.scrollStep);
    }
  }, {
    key: "scrollDown",
    value: function scrollDown() {
      this.scroll(this._config.scrollStep);
    }
  }, {
    key: "renderScrollBar",
    value: function renderScrollBar() {
      try {
        var contentHeight = this._container.scrollHeight;
        var containerHeight = this._container.clientHeight;
        if (contentHeight > containerHeight && containerHeight > 0 && contentHeight > 0) {
          this._showScroll = true;
          var style = window.getComputedStyle(this._bar);
          var barLength = containerHeight - dom.px(style.marginTop) - dom.px(style.marginBottom);
          var barHeight = Math.max(Math.round(containerHeight / contentHeight * barLength), dom.px(style.minHeight));
          var currentScroll = this._container.scrollTop;
          var barTop = Math.round(currentScroll / contentHeight * barLength);
          dom.css(this._bar, {
            height: barHeight + 'px',
            top: barTop + 'px'
          });
        } else {
          this._showScroll = false;
        }
      } catch (error) {
        ignore(error);
      }
    }
  }, {
    key: "_handleElementMouseEnter",
    value: function _handleElementMouseEnter(event) {
      if (!this._showScroll) {
        return;
      }
      dom.css(this._bar, 'visibility', 'visible');
    }
  }, {
    key: "_handleElementMouseLeave",
    value: function _handleElementMouseLeave(event) {
      dom.css(this._bar, 'visibility', 'hidden');
    }
  }, {
    key: "_handleElementChange",
    value: function _handleElementChange(mutations) {
      this.renderScrollBar();
    }
  }, {
    key: "_handleElementMouseScroll",
    value: function _handleElementMouseScroll(event) {
      if (!this._showScroll) {
        return;
      }
      if (event.deltaY > 0) {
        this.scrollDown();
      } else if (event.deltaY < 0) {
        this.scrollUp();
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "_handleDragMove",
    value: function _handleDragMove(delta) {
      try {
        var contentHeight = this._container.scrollHeight;
        var containerHeight = this._container.clientHeight;
        this.scroll(Math.round(-delta.top * contentHeight / containerHeight));
      } catch (error) {
        ignore(error);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;
      if (!this._isInit) {
        return;
      }
      this._observer.disconnect();
      Array.from(this._container.children).forEach(function (el) {
        return _this2._element.appendChild(el);
      });
      this._element.removeEventListener('mouseenter', this._processElementMouseEnter);
      this._element.removeEventListener('mouseleave', this._processElementMouseLeave);
      dom.removeElement(this._container);
      this._container = null;
      this._barDrag.remove();
      dom.removeElement(this._bar);
      this._bar = null;
      dom.removeElement(this._scroll);
      this._scroll = null;
      dom.css(this._element, 'height', this._initialHeight + 'px');
      this._initialHeight = null;
      this._isInit = false;
    }
  }]);
}();
ScrollBlock.DEFAULT_CONFIG = {
  classPrefix: 'sqsll-',
  show: 'hover',
  scrollStep: 20,
  autoInit: true
};
module.exports = ScrollBlock;

},{"../dom/main":33,"../lib/ignore":63,"./Draggable":42,"extend":164}],52:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var eventsMixin = require('../utils/eventsMixin');
var extend = require('extend');
var isString = require('../lib/isString');
var dom = require('../dom/main');
var ToggleButton = function () {
  function ToggleButton(selector, config) {
    _classCallCheck(this, ToggleButton);
    config = extend(true, {}, ToggleButton.DEFAULT_CONFIG, config);
    this._config = config;
    this._element = null;
    this._clickListener = null;
    this._status = ToggleButton.STATUS_UNKNOWN;
    if (isString(selector)) {
      this.element = document.querySelector(selector);
    } else {
      this.element = selector;
    }
    this.setStatus(this._config.initialStatus, true);
  }
  return _createClass(ToggleButton, [{
    key: "_clickHandler",
    value: function _clickHandler(event) {
      this.dispatchEvent('click');
      if (this._config.preventDefault) {
        event.preventDefault();
      }
      if (this._config.stopPropagation) {
        event.stopPropagation();
      }
      if (this.status === ToggleButton.STATUS_DOWN) {
        this.status = ToggleButton.STATUS_UP;
      } else {
        this.status = ToggleButton.STATUS_DOWN;
      }
    }
  }, {
    key: "clickListener",
    get: function get() {
      if (this._clickListener === null) {
        this._clickListener = this._clickHandler.bind(this);
      }
      return this._clickListener;
    }
  }, {
    key: "status",
    get: function get() {
      return this._status;
    },
    set: function set(value) {
      if (value === this._status) {
        return;
      }
      this._status = value;
      this._updateStatus();
    }
  }, {
    key: "setStatus",
    value: function setStatus(value, skipEvents) {
      if (value === this._status) {
        return;
      }
      this._status = value;
      this._updateStatus(skipEvents);
    }
  }, {
    key: "_addClass",
    value: function _addClass(cls) {
      if (isString(cls) && cls !== '') {
        dom.addClass(this._element, cls);
      }
    }
  }, {
    key: "_remClass",
    value: function _remClass(cls) {
      if (isString(cls) && cls !== '') {
        dom.removeClass(this._element, cls);
      }
    }
  }, {
    key: "_updateStatus",
    value: function _updateStatus(skipEvents) {
      switch (this._status) {
        case ToggleButton.STATUS_DOWN:
          this._addClass(this._config.classActive);
          this._remClass(this._config.classInactive);
          if (!skipEvents) {
            this.dispatchEvent('down', this);
          }
          break;
        case ToggleButton.STATUS_UP:
          this._remClass(this._config.classActive);
          this._addClass(this._config.classInactive);
          if (!skipEvents) {
            this.dispatchEvent('up', this);
          }
          break;
        default:
          this._remClass(this._config.classActive);
          this._remClass(this._config.classInactive);
          if (!skipEvents) {
            this.dispatchEvent('unknown', this);
          }
      }
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      if (this._element !== null) {
        this._element.removeEventListener('click', this.clickListener, true);
      }
      this._element = value;
      if (value !== null) {
        this._updateStatus();
        this._element.addEventListener('click', this.clickListener, true);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this.element = null;
      this.clearEvents();
    }
  }]);
}();
ToggleButton.STATUS_UNKNOWN = 0;
ToggleButton.STATUS_DOWN = 1;
ToggleButton.STATUS_UP = 2;
ToggleButton.DEFAULT_CONFIG = {
  classActive: 'active',
  classInactive: '',
  initialStatus: ToggleButton.STATUS_UP,
  preventDefault: true,
  stopPropagation: false
};
eventsMixin(ToggleButton.prototype);
module.exports = ToggleButton;

},{"../dom/main":33,"../lib/isString":69,"../utils/eventsMixin":148,"extend":164}],53:[function(require,module,exports){
'use strict';

var NormalizeColumnsMixin = {
  normalizeColumns: function normalizeColumns(columnsAvailable) {
    var columnsSorted = columnsAvailable.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    switch (columnsAvailable.length) {
      case 3:
        if (!(columnsSorted[0].length === columnsSorted[1].length && columnsSorted[1].length === columnsSorted[2].length)) {
          columnsSorted[0].columns = 2;
        }
        break;
      case 2:
        if (columnsSorted[0].length >= columnsSorted[1].length * 2) {
          columnsSorted[0].columns = 3;
          columnsSorted[1].columns = 1;
        } else {
          columnsSorted[0].columns = 2;
          columnsSorted[1].columns = 2;
        }
        break;
      case 1:
        columnsAvailable[0].columns = Math.min(4, columnsAvailable[0].length);
        break;
    }
    return columnsAvailable;
  }
};
module.exports = function noramlizeColumnsMixin(obj) {
  obj.normalizeColumns = NormalizeColumnsMixin.normalizeColumns;
};

},{}],54:[function(require,module,exports){
'use strict';

module.exports = function googleChecksum(url) {
  function c32to8bit(arr32) {
    var arr8 = [];
    var i;
    var bitOrder;
    for (i = 0; i < arr32.length; i++) {
      for (bitOrder = i * 4; bitOrder <= i * 4 + 3; bitOrder++) {
        arr8[bitOrder] = arr32[i] & 255;
        arr32[i] = zeroFill(arr32[i], 8);
      }
    }
    return arr8;
  }
  function strord(string) {
    var result = [];
    var i;
    for (i = 0; i < string.length; i++) {
      result[i] = string[i].charCodeAt(0);
    }
    return result;
  }
  function googleChecksum(url) {
    var init = 0xE6359A60;
    var length = url.length;
    var a = 0x9E3779B9;
    var b = 0x9E3779B9;
    var c = 0xE6359A60;
    var k = 0;
    var len = length;
    var mixo = [];
    function mix(a, b, c) {
      a -= b;
      a -= c;
      a ^= zeroFill(c, 13);
      b -= c;
      b -= a;
      b ^= a << 8;
      c -= a;
      c -= b;
      c ^= zeroFill(b, 13);
      a -= b;
      a -= c;
      a ^= zeroFill(c, 12);
      b -= c;
      b -= a;
      b ^= a << 16;
      c -= a;
      c -= b;
      c ^= zeroFill(b, 5);
      a -= b;
      a -= c;
      a ^= zeroFill(c, 3);
      b -= c;
      b -= a;
      b ^= a << 10;
      c -= a;
      c -= b;
      c ^= zeroFill(b, 15);
      return [a, b, c];
    }
    while (len >= 12) {
      a += url[k] + (url[k + 1] << 8) + (url[k + 2] << 16) + (url[k + 3] << 24);
      b += url[k + 4] + (url[k + 5] << 8) + (url[k + 6] << 16) + (url[k + 7] << 24);
      c += url[k + 8] + (url[k + 9] << 8) + (url[k + 10] << 16) + (url[k + 11] << 24);
      mixo = mix(a, b, c);
      a = mixo[0];
      b = mixo[1];
      c = mixo[2];
      k += 12;
      len -= 12;
    }
    c += length;
    switch (len) {
      case 11:
        c += url[k + 10] << 24;
      case 10:
        c += url[k + 9] << 16;
      case 9:
        c += url[k + 8] << 8;
      case 8:
        b += url[k + 7] << 24;
      case 7:
        b += url[k + 6] << 16;
      case 6:
        b += url[k + 5] << 8;
      case 5:
        b += url[k + 4];
      case 4:
        a += url[k + 3] << 24;
      case 3:
        a += url[k + 2] << 16;
      case 2:
        a += url[k + 1] << 8;
      case 1:
        a += url[k];
    }
    mixo = mix(a, b, c);
    return mixo[2] < 0 ? 0x100000000 + mixo[2] : mixo[2];
  }
  function myfmod(x, y) {
    var i = Math.floor(x / y);
    return x - i * y;
  }
  function zeroFill(a, b) {
    var z = hexdec(80000000);
    if (z & a) {
      a = a >> 1;
      a &= ~z;
      a |= 0x40000000;
      a = a >> b - 1;
    } else {
      a = a >> b;
    }
    return a;
  }
  function hexdec(str) {
    return parseInt(str, 16);
  }
  function newGoogleChecksum(checksum) {
    var prbuf = [];
    var i;
    checksum = checksum / 7 << 2 | myfmod(checksum, 13) & 7;
    prbuf[0] = checksum;
    for (i = 1; i < 20; i++) {
      prbuf[i] = prbuf[i - 1] - 9;
    }
    checksum = googleChecksum(c32to8bit(prbuf), 80);
    return checksum;
  }
  return '6' + newGoogleChecksum(googleChecksum(strord(url)));
};

},{}],55:[function(require,module,exports){
'use strict';

module.exports = function (string) {
  return hex_md5(string);
};
var hexcase = 0;
function hex_md5(a) {
  return rstr2hex(rstr_md5(str2rstr_utf8(a)));
}
function hex_hmac_md5(a, b) {
  return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)));
}
function md5_vm_test() {
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}
function rstr_md5(a) {
  return binl2rstr(binl_md5(rstr2binl(a), a.length * 8));
}
function rstr_hmac_md5(c, f) {
  var e = rstr2binl(c);
  if (e.length > 16) {
    e = binl_md5(e, c.length * 8);
  }
  var a = Array(16),
    d = Array(16);
  for (var b = 0; b < 16; b++) {
    a[b] = e[b] ^ 909522486;
    d[b] = e[b] ^ 1549556828;
  }
  var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
  return binl2rstr(binl_md5(d.concat(g), 512 + 128));
}
function rstr2hex(c) {
  try {
    hexcase;
  } catch (g) {
    hexcase = 0;
  }
  var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var b = "";
  var a;
  for (var d = 0; d < c.length; d++) {
    a = c.charCodeAt(d);
    b += f.charAt(a >>> 4 & 15) + f.charAt(a & 15);
  }
  return b;
}
function str2rstr_utf8(c) {
  var b = "";
  var d = -1;
  var a, e;
  while (++d < c.length) {
    a = c.charCodeAt(d);
    e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
    if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
      a = 65536 + ((a & 1023) << 10) + (e & 1023);
      d++;
    }
    if (a <= 127) {
      b += String.fromCharCode(a);
    } else {
      if (a <= 2047) {
        b += String.fromCharCode(192 | a >>> 6 & 31, 128 | a & 63);
      } else {
        if (a <= 65535) {
          b += String.fromCharCode(224 | a >>> 12 & 15, 128 | a >>> 6 & 63, 128 | a & 63);
        } else {
          if (a <= 2097151) {
            b += String.fromCharCode(240 | a >>> 18 & 7, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | a & 63);
          }
        }
      }
    }
  }
  return b;
}
function rstr2binl(b) {
  var a = Array(b.length >> 2);
  for (var c = 0; c < a.length; c++) {
    a[c] = 0;
  }
  for (var c = 0; c < b.length * 8; c += 8) {
    a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << c % 32;
  }
  return a;
}
function binl2rstr(b) {
  var a = "";
  for (var c = 0; c < b.length * 32; c += 8) {
    a += String.fromCharCode(b[c >> 5] >>> c % 32 & 255);
  }
  return a;
}
function binl_md5(p, k) {
  p[k >> 5] |= 128 << k % 32;
  p[(k + 64 >>> 9 << 4) + 14] = k;
  var o = 1732584193;
  var n = -271733879;
  var m = -1732584194;
  var l = 271733878;
  for (var g = 0; g < p.length; g += 16) {
    var j = o;
    var h = n;
    var f = m;
    var e = l;
    o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
    l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
    m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
    n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
    o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
    l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
    m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
    n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
    o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
    l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
    m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
    n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
    o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
    l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
    m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
    n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
    o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
    l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
    m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
    n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
    o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
    l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
    m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
    n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
    o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
    l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
    m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
    n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
    o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
    l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
    m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
    n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
    o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
    l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
    m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
    n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
    o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
    l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
    m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
    n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
    o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
    l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
    m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
    n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
    o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
    l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
    m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
    n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
    o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
    l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
    m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
    n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
    o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
    l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
    m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
    n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
    o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
    l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
    m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
    n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
    o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
    l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
    m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
    n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
    o = safe_add(o, j);
    n = safe_add(n, h);
    m = safe_add(m, f);
    l = safe_add(l, e);
  }
  return Array(o, n, m, l);
}
function md5_cmn(h, e, d, c, g, f) {
  return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d);
}
function md5_ff(g, f, k, j, e, i, h) {
  return md5_cmn(f & k | ~f & j, g, f, e, i, h);
}
function md5_gg(g, f, k, j, e, i, h) {
  return md5_cmn(f & j | k & ~j, g, f, e, i, h);
}
function md5_hh(g, f, k, j, e, i, h) {
  return md5_cmn(f ^ k ^ j, g, f, e, i, h);
}
function md5_ii(g, f, k, j, e, i, h) {
  return md5_cmn(k ^ (f | ~j), g, f, e, i, h);
}
function safe_add(a, d) {
  var c = (a & 65535) + (d & 65535);
  var b = (a >> 16) + (d >> 16) + (c >> 16);
  return b << 16 | c & 65535;
}
function bit_rol(a, b) {
  return a << b | a >>> 32 - b;
}
;

},{}],56:[function(require,module,exports){
'use strict';

exports.$A = function (iterable) {
  var results = [];
  if (!iterable) {
    return results;
  } else if (iterable.toArray) {
    return iterable.toArray();
  } else if (iterable.length) {
    for (var i = 0, l = iterable.length; i < l; i++) {
      results.push(iterable[i]);
    }
  } else {
    for (var key in iterable) {
      if (iterable.hasOwnProperty(key)) {
        results.push(iterable[key]);
      }
    }
  }
  return results;
};
if (!Array.from) {
  Array.from = exports.$A;
}

},{}],57:[function(require,module,exports){
'use strict';

var parseUri = require('./parseUri');
module.exports = function checkMatch(match, except) {
  if (typeof document === 'undefined' || !document.location || !document.location.href) {
    return false;
  }
  var url = document.location.href;
  var cleanUrl = parseUri.clearUri(url);
  function matcher(regexp) {
    return url.match(new RegExp(regexp, 'i')) || cleanUrl.match(new RegExp(regexp, 'i'));
  }
  if (match.length > 0 && !match.some(matcher)) {
    return false;
  }
  return !(except.length > 0 && except.some(matcher));
};

},{"./parseUri":71}],58:[function(require,module,exports){
'use strict';

var isArray = require('./isArray');
module.exports = function containsText(string, pattern) {
  if (string === undefined || string === null || !string.indexOf) {
    return false;
  }
  if (isArray(pattern)) {
    return pattern.some(function (pat) {
      return string.indexOf(pat) !== -1;
    });
  }
  return string.indexOf(pattern) !== -1;
};

},{"./isArray":65}],59:[function(require,module,exports){
'use strict';

function stringCompare(a, b) {
  return '' + a === '' + b;
}
function diffMaps(a, b, compareValues) {
  var diffs = [];
  if (a !== undefined && !(a instanceof Map)) {
    throw new TypeError('a should be Map or undefined');
  }
  if (b !== undefined && !(b instanceof Map)) {
    throw new TypeError('a should be Map or undefined');
  }
  compareValues = compareValues || stringCompare;
  if (a === undefined && b === undefined) {
    return diffs;
  } else if (a === undefined && b !== undefined) {
    b.forEach(function (value, key) {
      return diffs.push(key);
    });
  } else if (a !== undefined && b === undefined) {
    a.forEach(function (value, key) {
      return diffs.push(key);
    });
  } else {
    a.forEach(function (value, key) {
      if (!b.has(key) || !compareValues(value, b.get(key))) {
        diffs.push(key);
      }
    });
    b.forEach(function (value, key) {
      if (!a.has(key) || !compareValues(value, a.get(key))) {
        if (diffs.indexOf(key) === -1) {
          diffs.push(key);
        }
      }
    });
  }
  return diffs;
}
diffMaps.areMapsSame = function (a, b, compare) {
  return diffMaps(a, b, compare).length === 0;
};
module.exports = diffMaps;

},{}],60:[function(require,module,exports){
'use strict';

function stringCompare(a, b) {
  return '' + a === '' + b;
}
function diffObjects(a, b, compare) {
  var result = [];
  compare = compare || stringCompare;
  if (a === null) {
    throw new TypeError('a should be Object or undefined');
  }
  if (b === null) {
    throw new TypeError('a should be Object or undefined');
  }
  if (a === undefined && b === undefined) {
    return result;
  } else if (a === undefined && b !== undefined) {
    for (var ka in b) {
      if (b.hasOwnProperty(ka)) {
        result.push(ka);
      }
    }
  } else if (a !== undefined && b === undefined) {
    for (var _ka2 in a) {
      if (a.hasOwnProperty(_ka2)) {
        result.push(_ka2);
      }
    }
  } else {
    for (var _ka4 in a) {
      if (a.hasOwnProperty(_ka4)) {
        if (!b.hasOwnProperty(_ka4)) {
          result.push(_ka4);
        } else if (!compare(a[_ka4], b[_ka4])) {
          result.push(_ka4);
        }
      }
    }
    for (var kb in b) {
      if (b.hasOwnProperty(kb)) {
        if (!a.hasOwnProperty(kb)) {
          result.push(kb);
        } else if (result.indexOf(kb) === -1) {
          if (!compare(a[kb], b[kb])) {
            result.push(kb);
          }
        }
      }
    }
  }
  return result;
}
diffObjects.areObjectsSame = function (a, b, compare) {
  return diffObjects(a, b, compare).length === 0;
};
module.exports = diffObjects;

},{}],61:[function(require,module,exports){
'use strict';

module.exports = function endsWith(string, pattern) {
  if (string === undefined || string === null || !string.indexOf) {
    return false;
  }
  if (pattern === undefined || pattern === null || !pattern.indexOf) {
    return false;
  }
  var d = string.length - pattern.length;
  return d >= 0 && string.lastIndexOf(pattern) === d;
};

},{}],62:[function(require,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUUID() {
  var d = new Date().getTime();
  if (global.performance && typeof global.performance.now === 'function') {
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],63:[function(require,module,exports){
'use strict';

module.exports = function ignore(reason) {
  console.log(reason);
};

},{}],64:[function(require,module,exports){
'use strict';

module.exports = function ip2long(ip) {
  var ips = ip.split('.');
  var iplong;
  if (ips.length !== 4) {
    return null;
  }
  iplong = ips[0] * Math.pow(256, 3) + ips[1] * Math.pow(256, 2) + ips[2] * Math.pow(256, 1) + ips[3] * Math.pow(256, 0);
  return iplong;
};

},{}],65:[function(require,module,exports){
'use strict';

module.exports = function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

},{}],66:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
module.exports = function isEmpty(value, key) {
  if (key !== undefined && _typeof(value) === 'object') {
    if (isEmpty(value)) {
      return true;
    }
    if (!value.hasOwnProperty(key) && !(key in value)) {
      return true;
    }
    value = value[key];
  }
  if (value === null || value === undefined || value === '') {
    return true;
  }
  if (value.hasOwnProperty('length')) {
    return value.length === 0;
  }
  try {
    if (value instanceof Node) {
      return false;
    }
  } catch (e) {}
  if (_typeof(value) === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
};

},{}],67:[function(require,module,exports){
'use strict';

module.exports = function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

},{}],68:[function(require,module,exports){
'use strict';

module.exports = function isObject(obj) {
  var key;
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
    return false;
  }
  if (obj.constructor && !hasOwnProperty.call(obj, 'constructor') && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false;
  }
  for (key in obj) {}
  return key === undefined || hasOwnProperty.call(obj, key);
};

},{}],69:[function(require,module,exports){
'use strict';

module.exports = function isString(value) {
  return value instanceof String || typeof value === 'string';
};

},{}],70:[function(require,module,exports){
'use strict';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function parseArgs(str) {
  var result = new Map();
  if (str === '' || str === undefined || str === null) {
    return result;
  }
  str = str.replace(/^(\?|#)/, '');
  if (str === '') {
    return result;
  }
  var args = str.split('&');
  var _iterator = _createForOfIteratorHelper(args),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value;
      if (element.indexOf('=') !== -1) {
        var _element$split = element.split('='),
          _element$split2 = _slicedToArray(_element$split, 2),
          key = _element$split2[0],
          value = _element$split2[1];
        result.set(decodeURIComponent(key), decodeURIComponent(value));
      } else {
        result.set(element, null);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}
function createArgs(args) {
  if (!(args instanceof Map)) {
    throw new Error('args should be instance of Map');
  }
  var result = [];
  args.forEach(function (value, key) {
    return result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return result.join('&');
}
exports.parseArgs = parseArgs;
exports.createArgs = createArgs;

},{}],71:[function(require,module,exports){
'use strict';

var isEmpty = require('./isEmpty');
function parseUri(string) {
  var o;
  var m;
  var uri = {};
  var l;
  var i;
  var match;
  var p;
  if (string.indexOf('@') >= 0) {
    string = string.split('//');
    if (string[1].indexOf('/') > 0) {
      string[1] = string[1].substr(0, string[1].indexOf('/')) + string[1].substr(string[1].indexOf('/')).replace('@', '%40');
    }
    string = string[0] + '//' + string[1];
  }
  o = parseUri.options;
  m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(string);
  i = o.key.length;
  while (i--) {
    uri[o.key[i]] = m[i] || '';
  }
  uri.cache = 'https://webcache.googleusercontent.com/search?hl=en&ie=UTF-8&oe=UTF-8&q=cache:' + uri.url;
  uri.clean_domain = uri.domain.replace(/^www\./, '');
  uri.query = '?' + uri.query;
  match = uri.domain.match(/^.+\.{1}([a-z0-9\-]+\.{1}[a-z]+)$/i);
  uri.topdomain = match ? match[1] : uri.domain;
  uri.is_subdomain = uri.clean_domain !== uri.topdomain;
  p = uri.domain.split('.');
  p = p.reverse();
  for (i = 0, l = p.length; i < l; i++) {
    uri[(i + 1).toString()] = p[i];
  }
  if (isEmpty(uri, 'path')) {
    uri.path = '/';
  }
  return uri;
}
parseUri.options = {
  strictMode: false,
  key: ['url', 'scheme', 'authority', 'userInfo', 'user', 'password', 'domain', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
function createUri(uriObject) {
  var result = uriObject.scheme + '://';
  if (!isEmpty(uriObject, 'user') || !isEmpty(uriObject, 'password')) {
    if (!isEmpty(uriObject, 'user')) {
      result += uriObject.user;
    }
    if (!isEmpty(uriObject, 'password')) {
      result += ':' + uriObject.password;
    }
    result += '@';
  }
  result += uriObject.domain;
  if (!isEmpty(uriObject, 'port')) {
    result += ':' + uriObject.port;
  }
  result += uriObject.path;
  if (!isEmpty(uriObject, 'query')) {
    var queryText = uriObject.query.replace(/^\?/, '');
    if (!isEmpty(queryText)) {
      result += '?' + queryText;
    }
  }
  if (!isEmpty(uriObject, 'anchor')) {
    result += '#' + uriObject.anchor;
  }
  return result;
}
function clearUri(uriString) {
  var uriObject = parseUri(uriString);
  uriObject.path = decodeURIComponent(uriObject.path.replace('+', ' '));
  return createUri(uriObject);
}
exports.parseUri = parseUri;
exports.createUri = createUri;
exports.clearUri = clearUri;

},{"./isEmpty":66}],72:[function(require,module,exports){
'use strict';

var hexMd5 = require('../hex-md5');
module.exports = function shortHash(input) {
  return hexMd5(input).substr(0, 8);
};

},{"../hex-md5":55}],73:[function(require,module,exports){
'use strict';

module.exports = function startsWith(string, pattern) {
  if (string === undefined || string === null || !string.indexOf) {
    return false;
  }
  return string.indexOf(pattern) === 0;
};

},{}],74:[function(require,module,exports){
'use strict';

module.exports = function trimHash(url) {
  var result = url;
  var hashPosition = url.indexOf('#');
  if (hashPosition !== -1) {
    result = url.substring(0, hashPosition);
  }
  return result;
};

},{}],75:[function(require,module,exports){
'use strict';

var parseTextNodes = require('../dom/getElementText').parseTextNodes;
var getH1Title = require('./getH1Title').getH1Title;
var lib = require('../Lib');
function requestPageData(data, callback) {
  var page = {
    location: document.location.href,
    title: document.title,
    keywords: '',
    description: '',
    content: ''
  };
  if (!document.body || document.body === null || document.body === undefined) {
    callback(page);
    return;
  }
  Array.from(document.getElementsByTagName('meta')).forEach(function (item) {
    if (item.name.toLowerCase() === 'keywords') {
      page.keywords = lib.sanitizeString(item.content, true);
    } else if (item.name.toLowerCase() === 'description') {
      page.description = lib.sanitizeString(item.content, true);
    }
  });
  var body = document.body.cloneNode(true);
  var trash = body.querySelectorAll('#seoquake-seobar-panel, #sqseobar2, .seoquake-hintbox, .sqseobar2-configuration-dropdown, script, iframe, style, textarea, input, select');
  Array.from(trash).forEach(function (item) {
    return item.parentNode.removeChild(item);
  });
  page.content = lib.trim(document.title) + ' ' + parseTextNodes(body);
  page.h1title = getH1Title(body);
  callback(page);
}
module.exports = requestPageData;

},{"../Lib":7,"../dom/getElementText":27,"./getH1Title":83}],76:[function(require,module,exports){
'use strict';

var lib = require('../Lib');
var detectSchemaOrg = require('./diagnosis/detectSchemaOrg');
var detectOpengraph = require('./diagnosis/detectOpengraph');
var detectTwitterCard = require('./diagnosis/detectTwitterCard');
var detectGoogleAnalytics = require('./diagnosis/detectGoogleAnalytics');
var detectMicroformats = require('./diagnosis/detectMicroformats');
function requestPageDiagnosis(data, callback) {
  var page = {
    location: document.location.href,
    title: document.title,
    keywords: '',
    description: '',
    viewport: '',
    lang: '',
    microformats: [],
    schemaorg: [],
    opengraph: [],
    twittercard: [],
    ganalytics: '',
    dublincore: '',
    geometatags: '',
    doctype: '',
    charset: 'Not specified',
    meta_language_tag: false,
    frames_count: 0,
    iframes_count: 0,
    flash: false,
    images_count: 0,
    imgalts_count: 0,
    headings: {},
    text: '',
    page_length: 0,
    text_length: 0,
    urlDetails: lib.parseUri(document.location.href),
    canonicalLink: ''
  };
  if (!document.body || document.body === null || document.body === undefined) {
    callback(page);
    return;
  }
  var metas = Array.from(document.getElementsByTagName('meta'));
  function getLang(aDoc) {
    var docElem = aDoc.documentElement;
    if (!docElem) {
      return false;
    }
    return docElem.lang ? docElem.lang : false;
  }
  function detectFaviconLink(aDoc) {
    var link = aDoc.querySelector('head > link[rel~=icon]');
    return link ? link.href : null;
  }
  function getDocType(doctype) {
    if (doctype && doctype.name) {
      if (!doctype.publicId && !doctype.systemId) {
        return 'HTML5';
      }
      if (!lib.isEmpty(doctype, 'publicId')) {
        var clearedID = doctype.publicId.match(/DTD\s(.+)?\/\//i);
        if (clearedID !== null && !lib.isEmpty(clearedID, 'length') && clearedID.length > 0) {
          return clearedID[1];
        } else {
          return doctype.publicId;
        }
      } else if (!lib.isEmpty(doctype, 'systemId')) {
        if (doctype.systemId.indexOf('legacy-compat') !== -1) {
          return 'HTML5 legacy-compat';
        } else {
          return 'HTML5';
        }
      }
    }
    return 'Undetected';
  }
  metas.forEach(function (meta) {
    var value = meta.name.toLowerCase();
    switch (value) {
      case 'keywords':
        page.keywords = lib.stripTags(meta.content);
        break;
      case 'description':
        page.description = lib.stripTags(meta.content);
        break;
      case 'viewport':
        page.viewport = lib.stripTags(meta.content);
        break;
      case 'language':
        page.meta_language_tag = lib.stripTags(meta.content);
        break;
    }
  });
  page.lang = getLang(document);
  page.microformats = detectMicroformats(document);
  page.schemaorg = detectSchemaOrg(document);
  page.opengraph = detectOpengraph(document);
  page.twittercard = detectTwitterCard(document);
  page.ganalytics = detectGoogleAnalytics(document);
  page.faviconLink = detectFaviconLink(document);
  page.doctype = getDocType(document.doctype);
  var canonicalLink = document.querySelector('head > link[rel="canonical"]');
  if (canonicalLink) {
    page.canonicalLink = canonicalLink.getAttribute('href').toString();
  }
  var docClone = document.body.cloneNode(true);
  var trashSelector = '#seoquake-seobar-panel, script, iframe, style, textarea, input, select';
  var trash = Array.from(docClone.querySelectorAll(trashSelector));
  trash.forEach(function (element) {
    return element.parentNode.removeChild(element);
  });
  var textContent = lib.trim(docClone.textContent);
  page.text = textContent;
  page.page_length = docClone.innerHTML.length;
  page.text_length = textContent.length;
  for (var i = 1; i < 7; i++) {
    var header = 'H' + i.toString();
    var headObj = {
      name: header,
      count: 0,
      values: []
    };
    var haas = docClone.getElementsByTagName(header);
    var halen = haas.length || 0;
    if (halen) {
      headObj.count = halen;
      for (var x = 0; x < halen; x++) {
        headObj.values.push(lib.trim(lib.stripTags(haas.item(x).innerHTML)));
      }
    }
    page.headings[header] = headObj;
  }
  var images = docClone.getElementsByTagName('IMG');
  var iLen = images.length;
  if (iLen) {
    page.images_count = images.length;
    var altCnt = iLen;
    for (var _i2 = iLen; _i2-- > 0;) {
      var elm = images.item(_i2);
      var alt = elm.getAttribute('alt');
      if (!(alt && alt.length)) {
        --altCnt;
      }
    }
    page.imgalts_count = altCnt;
  }
  var frames = docClone.getElementsByTagName('FRAME');
  page.frames_count = frames.length;
  var iframes = docClone.getElementsByTagName('IFRAME');
  if (iframes.length === 0) {
    iframes = document.getElementsByTagName('IFRAME');
  }
  page.iframes_count = iframes.length;
  var objects = Array.from(docClone.getElementsByTagName('OBJECT'));
  page.flash = objects.some(function (item) {
    var objType = item.getAttribute('type');
    return objType && objType.toLowerCase() === 'application/x-shockwave-flash';
  });
  metas.forEach(function (meta) {
    if (meta.httpEquiv.toLowerCase() === 'content-type' && meta.content) {
      var charset = meta.content.match(/charset=([\-\s\/0-9a-z]*)/i);
      if (charset) {
        page.charset = charset[1];
        return;
      }
    } else if (meta.httpEquiv.toLowerCase() === 'content-language' && meta.content) {
      page.meta_language_tag = meta.content;
    }
    if (meta.getAttribute('charset')) {
      page.charset = meta.getAttribute('charset');
    }
  });
  callback(page);
}
module.exports = requestPageDiagnosis;

},{"../Lib":7,"./diagnosis/detectGoogleAnalytics":78,"./diagnosis/detectMicroformats":79,"./diagnosis/detectOpengraph":80,"./diagnosis/detectSchemaOrg":81,"./diagnosis/detectTwitterCard":82}],77:[function(require,module,exports){
'use strict';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var parseTextNodes = require('../dom/getElementText').parseTextNodes;
var getH1Title = require('./getH1Title').getH1Title;
var qualifyURL = require('../dom/qualifyURL');
var lib = require('../Lib.js');
function requestPageinfo(data, callback) {
  var page = {
    location: '',
    title: '',
    h1title: '',
    keywords: '',
    linkInfo: {
      internal: {
        type: 'internal',
        nofollow: 0,
        links: []
      },
      external: {
        type: 'external',
        nofollow: 0,
        links: []
      }
    },
    description: '',
    host: '',
    internal: 0,
    internal_nofollow: 0,
    external: 0,
    external_nofollow: 0,
    server: 'Unknown',
    content: ''
  };
  if (!document.body || document.body === null || document.body === undefined) {
    callback(page);
    return;
  }
  if (document.getElementById('errorPageContainer')) {
    callback(undefined);
    return;
  }
  page.location = document.location.href;
  page.title = document.title;
  var metas = Array.prototype.slice.call(document.getElementsByTagName('meta'));
  var _iterator = _createForOfIteratorHelper(metas),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var meta = _step.value;
      if (meta.name.toLowerCase() === 'keywords') {
        page.keywords = lib.sanitizeString(meta.content, true);
      }
      if (meta.name.toLowerCase() === 'description') {
        page.description = lib.sanitizeString(meta.content, true);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var bodyClone = document.body.cloneNode(true);
  var trashElementsList = bodyClone.querySelectorAll('#seoquake-seobar-panel, script, style, textarea, input, select');
  var _iterator2 = _createForOfIteratorHelper(Array.prototype.slice.call(trashElementsList)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var trash = _step2.value;
      trash.parentNode.removeChild(trash);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  page.content = lib.trim(page.title) + ' ' + parseTextNodes(bodyClone);
  var hostname = document.location.hostname.substr(0, 4) === 'www.' ? document.location.hostname.substr(4) : document.location.hostname;
  page.host = hostname;
  var links = Array.prototype.slice.call(bodyClone.querySelectorAll('a, iframe, form'));
  var linksMap = new Map();
  linksMap.fillElement = function (href, hostname, type, anchor, nofollow) {
    var element;
    if (!this.has(href)) {
      element = {
        count: 0,
        href: href,
        hostname: hostname,
        other: new Map()
      };
      this.set(href, element);
    } else {
      element = this.get(href);
    }
    element.count += 1;
    var code = type + '|' + anchor;
    if (!element.other.has(code)) {
      element.other.set(code, {
        count: 1,
        nofollow: nofollow,
        type: type,
        anchor: anchor
      });
    } else {
      var subLink = element.other.get(code);
      subLink.count += 1;
      if (!subLink.nofollow) {
        subLink.nofollow = nofollow;
      }
    }
  };
  var _iterator3 = _createForOfIteratorHelper(links),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var link = _step3.value;
      switch (link.tagName.toUpperCase()) {
        case 'A':
          if (!link.href) {
            continue;
          }
          var linkClass = link.getAttribute('class');
          if (linkClass !== null && linkClass !== undefined && (linkClass.indexOf('sqseobar2-link') !== -1 || linkClass.indexOf('seoquake-params-request') !== -1 || linkClass.indexOf('seoquake-ignore-link') !== -1)) {
            continue;
          }
          if (link.protocol !== 'http:' && link.protocol !== 'https:') {
            continue;
          }
          var href = link.href;
          href = href.replace(/#.*/, '');
          var type = 'text';
          var anchor = parseTextNodes(link);
          if (anchor === '') {
            var imageChild = link.querySelector('img');
            if (imageChild !== null) {
              type = 'image';
              anchor = imageChild.getAttribute('alt') || null;
            }
          }
          var nofollow = link.hasAttribute('rel') && link.getAttribute('rel').search(/nofollow/i) !== -1;
          linksMap.fillElement(href, link.hostname, type, anchor, nofollow);
          break;
        case 'IFRAME':
          if (link.hasAttribute('src') && link.getAttribute('src') !== '') {
            link = qualifyURL(link.getAttribute('src'), true);
            if (link.protocol !== 'http:' && link.protocol !== 'https:') {
              continue;
            }
            var _href = link.href;
            _href = _href.replace(/#.*/, '');
            linksMap.fillElement(_href, link.hostname, 'frame', null, false);
          }
          break;
        case 'FORM':
          if (link.hasAttribute('action') && link.getAttribute('action') !== '') {
            link = qualifyURL(link.getAttribute('action'), true);
            if (link.protocol !== 'http:' && link.protocol !== 'https:') {
              continue;
            }
            var _href2 = link.href;
            _href2 = _href2.replace(/#.*/, '');
            linksMap.fillElement(_href2, link.hostname, 'form', null, false);
          }
          break;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  function MapToArray(map) {
    var result = [];
    var _iterator4 = _createForOfIteratorHelper(map),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _slicedToArray(_step4.value, 2),
          key = _step4$value[0],
          value = _step4$value[1];
        result.push(value);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return result;
  }
  function noFollowUp(a, b) {
    if (a.nofollow && !b.nofollow) {
      return -1;
    } else if (!a.nofollow && b.nofollow) {
      return 1;
    }
    return 0;
  }
  var _iterator5 = _createForOfIteratorHelper(linksMap),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var _step5$value = _slicedToArray(_step5.value, 2),
        key = _step5$value[0],
        _link = _step5$value[1];
      _link.hostname = _link.hostname.replace(/^www\./, '').replace(/:\d+$/, '');
      _link.other = MapToArray(_link.other);
      _link.other.sort(noFollowUp);
      if (_link.hostname === hostname) {
        page.internal += _link.other.length;
        page.linkInfo.internal.links.push(_link);
        var _iterator6 = _createForOfIteratorHelper(_link.other),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var linkOther = _step6.value;
            if (linkOther.nofollow) {
              page.internal_nofollow++;
              page.linkInfo.internal.nofollow++;
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      } else {
        page.external += _link.other.length;
        page.linkInfo.external.links.push(_link);
        var _iterator7 = _createForOfIteratorHelper(_link.other),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _linkOther = _step7.value;
            if (_linkOther.nofollow) {
              page.external_nofollow++;
              page.linkInfo.external.nofollow++;
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  page.h1title = getH1Title(bodyClone);
  links = null;
  bodyClone = null;
  callback(page);
}
module.exports = requestPageinfo;

},{"../Lib.js":7,"../dom/getElementText":27,"../dom/qualifyURL":36,"./getH1Title":83}],78:[function(require,module,exports){
(function (global){(function (){
'use strict';

function detectGoogleAnalytics(aDoc) {
  var scriptElements = Array.from(aDoc.getElementsByTagName('SCRIPT'));
  var templates = ['\\.google-analytics\\.com\\/urchin\\.js', '\\.google-analytics\\.com\\/ga\\.js', '\\.google-analytics\\.com\\/analytics\\.js', '\\.google-analytics\\.com\\/analytics_debug\\.js', '\\.googletagmanager\\.com\\/gtag\\\/js', '\\.googletagmanager\\.com\\/gtm\\.js'];
  var regexp = new RegExp("(".concat(templates.join('|'), ")"), 'i');
  if (scriptElements.some(function (scriptElement) {
    return scriptElement.src && regexp.test(scriptElement.src);
  })) {
    return true;
  }
  if (scriptElements.some(function (scriptElement) {
    return scriptElement.textContent && regexp.test(scriptElement.textContent);
  })) {
    return true;
  }
  if (typeof global.ga === 'function') {
    return true;
  }
  if (typeof global.gtag === 'function') {
    return true;
  }
}
module.exports = detectGoogleAnalytics;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],79:[function(require,module,exports){
'use strict';

var microformats2 = [['h-adr', ['p-street-address', 'p-extended-address', 'p-post-office-box', 'p-locality', 'p-region', 'p-postal-code', 'p-country-name', 'p-label', 'p-geo', 'u-geo', 'p-latitude', 'p-longitude', 'p-altitude']], ['h-card', ['p-name', 'p-honorific-prefix', 'p-given-name', 'p-additional-name', 'p-family-name', 'p-sort-string', 'p-honorific-suffix', 'p-nickname', 'u-email', 'u-logo', 'u-photo', 'u-url', 'u-uid', 'p-category', 'p-adr', 'p-post-office-box', 'p-extended-address', 'p-street-address', 'p-locality', 'p-region', 'p-postal-code', 'p-country-name', 'p-label', 'p-geo', 'u-geo', 'p-latitude', 'p-longitude', 'p-altitude', 'p-tel', 'p-note', 'dt-bday', 'u-key', 'p-org', 'p-job-title', 'p-role', 'u-impp', 'p-sex', 'p-gender-identity', 'dt-anniversary']], ['h-entry', ['p-name', 'p-summary', 'e-content', 'dt-published', 'dt-updated', 'p-author', 'p-category', 'u-url', 'u-uid', 'p-location', 'u-syndication', 'u-in-reply-to', 'p-rsvp', 'h-event', 'p-name', 'p-summary', 'dt-start', 'dt-end', 'dt-duration', 'p-description', 'u-url', 'p-category', 'p-location', 'p-attendee']], ['h-feed', ['p-name', 'p-author', 'u-url', 'u-photo', 'h-geo', 'p-latitude', 'p-longitude', 'p-altitude']], ['h-item', ['p-name', 'u-url', 'u-photo']], ['h-listing', []], ['h-product', ['p-name', 'u-photo', 'p-brand', 'p-category', 'e-description', 'u-url', 'u-identifier', 'p-review', 'p-price']], ['h-recipe', ['p-name', 'p-ingredient', 'p-yield', 'e-instructions', 'dt-duration', 'u-photo', 'p-summary', 'p-author', 'dt-published', 'p-nutrition', 'p-category']], ['h-resume', ['p-name', 'p-summary', 'p-contact', 'p-education', 'p-experience', 'p-skill', 'p-affiliation']], ['h-review', ['p-name', 'p-item', 'p-author', 'dt-published', 'p-rating', 'p-best', 'p-worst', 'e-content', 'p-category', 'u-url']], ['h-review-aggregate', []]];
var microformats = ['hAtom', 'hCalendar', 'hCard', 'hListing', 'hMedia', 'hProduct', 'hRecipe', 'hResume', 'hReview', 'hReview-aggregate', 'adr', 'geo', 'vCard', 'vEvent'];
var microformatsWrong = [];
microformats.forEach(function (key) {
  return microformatsWrong.push(key.toLowerCase());
});
var microformats2Keys = [];
microformats2.forEach(function (item) {
  return microformats2Keys.push(item[0]);
});
var searchStrings = {
  microformats2: '.' + microformats2Keys.join(',.'),
  microformats: '.' + microformats.join(',.'),
  microformatsWrong: '.' + microformatsWrong.join(',.')
};
var searchLists = {
  microformats2: '.' + microformats2Keys,
  microformats: '.' + microformats,
  microformatsWrong: '.' + microformatsWrong
};
function getCurrentClass(element, keysList) {
  if (element && typeof element.classList !== 'undefined') {
    var classes = element.className.split(' ');
    var result = '';
    if (classes.some(function (cls) {
      return keysList.indexOf(cls.toString().trim()) !== -1 ? result = cls : result = null;
    })) {
      return result;
    }
  }
  return null;
}
function detectMicroformats(aDoc) {
  var result = [];
  var _loop = function _loop(key) {
    if (searchStrings.hasOwnProperty(key)) {
      var items = Array.from(aDoc.querySelectorAll(searchStrings[key]));
      if (items.length > 0) {
        result.push(key);
        items.forEach(function (element) {
          return result.push(getCurrentClass(element, searchLists[key]));
        });
        return 1;
      }
    }
  };
  for (var key in searchStrings) {
    if (_loop(key)) break;
  }
  return result;
}
module.exports = detectMicroformats;

},{}],80:[function(require,module,exports){
'use strict';

function detectOpengraph(aDoc) {
  var result = [];
  var ogTypes = Array.from(aDoc.head.querySelectorAll('meta[property="og:type"]'));
  var ogTags = Array.from(aDoc.head.querySelectorAll('meta[property^="og:"]'));
  ogTypes.forEach(function (tag) {
    return result.push(tag.getAttribute('content'));
  });
  if (ogTypes.length === 0 && ogTags.length > 0) {
    result.push('');
  }
  return result;
}
module.exports = detectOpengraph;

},{}],81:[function(require,module,exports){
'use strict';

var dom = require('../../dom/main');
function detectSchemaOrg(aDoc) {
  var hasMicroformats = false;
  var result = [];
  var microdataElements = Array.from(aDoc.querySelectorAll('[itemscope]'));
  microdataElements.forEach(function (element) {
    hasMicroformats = true;
    if (element.hasAttribute('itemtype')) {
      var type = element.getAttribute('itemtype');
      if (type.startsWith('http://schema.org/')) {
        type = type.replace('http://schema.org/', '');
        if (result.indexOf(type) === -1) {
          result.push(type);
        }
      }
    }
  });
  var rdfaElements = Array.from(aDoc.querySelectorAll('[vocab="http://schema.org/"]'));
  rdfaElements.forEach(function (element) {
    hasMicroformats = true;
    if (element.hasAttribute('typeof')) {
      var type = element.getAttribute('typeof');
      if (result.indexOf(type) === -1) {
        result.push(type);
      }
    }
  });
  var jsonldElements = Array.from(aDoc.querySelectorAll('script[type="application/ld+json"]'));
  jsonldElements.forEach(function (element) {
    hasMicroformats = true;
    var textData = dom.text(element);
    try {
      var jsonData = JSON.parse(textData);
      if (jsonData.hasOwnProperty('@context') && jsonData.hasOwnProperty('@type')) {
        var type = jsonData['@type'];
        if (result.indexOf(type) === -1) {
          result.push(type);
        }
      }
    } catch (ignore) {}
  });
  if (hasMicroformats && result.length === 0) {
    result.push('');
  }
  return result;
}
module.exports = detectSchemaOrg;

},{"../../dom/main":33}],82:[function(require,module,exports){
'use strict';

function detectTwitterCard(aDoc) {
  var result = [];
  var twitterTypes = Array.from(aDoc.head.querySelectorAll('meta[name^="twitter:"]'));
  var twitterCard = aDoc.head.querySelector('meta[name="twitter:card"]');
  var twitterSite = aDoc.head.querySelector('meta[name="twitter:site"]');
  var twitterSiteId = aDoc.head.querySelector('meta[name="twitter:site:id"]');
  if (twitterTypes.length > 0) {
    if (twitterCard) {
      result.push(twitterCard.getAttribute('content'));
    } else {
      result.push('');
    }
    if (twitterSite) {
      result.push(twitterSite.getAttribute('content'));
    } else if (twitterSiteId) {
      result.push(twitterSiteId.getAttribute('content'));
    } else {
      result.push('');
    }
  } else {
    var ogTitle = aDoc.head.querySelector('meta[property="og:title"]');
    var ogDescription = aDoc.head.querySelector('meta[property="og:description"]');
    var ogImage = aDoc.head.querySelector('meta[property="og:image"]');
    if (ogTitle || ogDescription || ogImage) {
      result.push('');
      result.push('');
    }
  }
  return result;
}
module.exports = detectTwitterCard;

},{}],83:[function(require,module,exports){
'use strict';

var parseTextNodes = require('../dom/getElementText.js').parseTextNodes;
exports.getH1Title = function getH1Title(container) {
  var element = container.querySelector('main, section, article, header');
  if (element) {
    var h1;
    if ((h1 = getH1Title(element)) !== '') {
      return h1;
    }
  }
  if (element = container.querySelector('h1')) {
    return parseTextNodes(element);
  }
  return '';
};

},{"../dom/getElementText.js":27}],84:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var eventsMixin = require('../utils/eventsMixin');
var ParameterItemCheckbox = function () {
  function ParameterItemCheckbox(parameter) {
    _classCallCheck(this, ParameterItemCheckbox);
    this._parameter = parameter;
    this._element = null;
    this._checkbox = null;
    this.init();
  }
  return _createClass(ParameterItemCheckbox, [{
    key: "init",
    value: function init() {
      var _this = this;
      var rand = Math.round(Math.random() * 1000) + 1000;
      var id = 'checkbox-' + rand + '-' + this._parameter.id;
      this._checkbox = dom('input', {
        type: 'checkbox',
        id: id
      });
      this._element = dom('div', {
        className: 'checkboxes'
      });
      this._element.appendChild(this._checkbox);
      this._element.appendChild(dom('label', {
        'for': id
      }, this._parameter.name));
      this._checkbox.addEventListener('click', function () {
        return _this.dispatchEvent('select', _this._checkbox.checked);
      }, true);
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "checked",
    get: function get() {
      return this._checkbox.checked;
    },
    set: function set(value) {
      this._checkbox.checked = value;
    }
  }, {
    key: "parameter",
    get: function get() {
      return this._parameter;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.clearEvents();
      dom.removeElement(this._checkbox);
      dom.removeElement(this._element);
      this._checkbox = null;
      this._element = null;
      this._parameter = null;
    }
  }]);
}();
eventsMixin(ParameterItemCheckbox.prototype);
module.exports = ParameterItemCheckbox;

},{"../dom/main":33,"../utils/eventsMixin":148}],85:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function set(target, property, value, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.set) {
    set = Reflect.set;
  } else {
    set = function set(target, property, value, receiver) {
      var base = _superPropBase(target, property);
      var desc;
      if (base) {
        desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.set) {
          desc.set.call(receiver, value);
          return true;
        } else if (!desc.writable) {
          return false;
        }
      }
      desc = Object.getOwnPropertyDescriptor(receiver, property);
      if (desc) {
        if (!desc.writable) {
          return false;
        }
        desc.value = value;
        Object.defineProperty(receiver, property, desc);
      } else {
        _defineProperty(receiver, property, value);
      }
      return true;
    };
  }
  return set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
  var s = set(target, property, value, receiver || target);
  if (!s && isStrict) {
    throw new TypeError('failed to set property');
  }
  return value;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var ParametersList = require('./ParametersList');
var ColumnDisplay = require('../effects/ColumnDisplay');
var ParameterItemCheckbox = require('./ParameterItemCheckbox');
var dom = require('../dom/main');
var normalizeColumnsMixin = require('../effects/noramlizeColumnsMixin');
var translateMixin = require('../utils/translateMixin');
var ignore = require('../lib/ignore');
var ParametersCheckboxes = function (_ParametersList) {
  function ParametersCheckboxes(module) {
    var _this;
    _classCallCheck(this, ParametersCheckboxes);
    _this = _callSuper(this, ParametersCheckboxes);
    _this.element = null;
    _this._module = module;
    _this._parametersElements = new Map([['page', new ColumnDisplay('Page', 1)], ['domain', new ColumnDisplay('Domain', 1)], ['backlinks', new ColumnDisplay('Backlinks', 1)], ['other', new ColumnDisplay('Other', 1)]]);
    _this._parametersItems = [];
    _this._changed = false;
    _this._isInit = false;
    return _this;
  }
  _inherits(ParametersCheckboxes, _ParametersList);
  return _createClass(ParametersCheckboxes, [{
    key: "element",
    get: function get() {
      if (this._element === null) {
        throw new Error('Top parameters container should be set or created before get');
      }
      return this._element;
    },
    set: function set(value) {
      if (value === null) {
        this._element = dom('table', {
          className: 'parametersListContainer'
        });
      } else if (!(value instanceof HTMLTableElement)) {
        throw new Error('Value should be instance of HTMLElement');
      } else {
        this._element = value;
      }
    }
  }, {
    key: "value",
    get: function get() {
      var _this2 = this;
      var result = {};
      this._parametersItems.forEach(function (item) {
        if (_this2._values.has(item.parameter.id)) {
          var parameter = _this2._values.get(item.parameter.id);
          var pos = parameter.disabled.indexOf(_this2._module);
          if (pos !== -1) {
            parameter.disabled.splice(pos, 1);
          }
          if (!item.checked) {
            parameter.disabled.push(_this2._module);
          }
        }
      });
      return _get(_getPrototypeOf(ParametersCheckboxes.prototype), "value", this);
    },
    set: function set(value) {
      _set(_getPrototypeOf(ParametersCheckboxes.prototype), "value", value, this, true);
    }
  }, {
    key: "changed",
    get: function get() {
      return this._changed;
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;
      if (this._isInit) {
        return;
      }
      this._parametersElements.forEach(function (column, key) {
        return _this3.t('sqSeobar2_parameters_group_' + key).then(function (text) {
          return column.title = text;
        })["catch"](ignore);
      });
      this._isInit = true;
    }
  }, {
    key: "clearParametersElements",
    value: function clearParametersElements() {
      this._parametersElements.forEach(function (column) {
        return column.clear();
      });
      this._parametersItems.forEach(function (item) {
        return item.remove();
      });
      this._parametersItems = [];
    }
  }, {
    key: "onChangeItem",
    value: function onChangeItem(checked) {
      this._changed = true;
      this.dispatchEvent('userUpdated');
    }
  }, {
    key: "onValuesSet",
    value: function onValuesSet() {
      var _this4 = this;
      _get(_getPrototypeOf(ParametersCheckboxes.prototype), "onValuesSet", this).call(this);
      this.clearParametersElements();
      this._values.forEach(function (parameter) {
        var item = new ParameterItemCheckbox(parameter);
        item.checked = parameter.disabled.indexOf(_this4._module) === -1;
        item.addEventListener('select', function (checked) {
          return _this4.onChangeItem(checked);
        });
        _this4._parametersItems.push(item);
        if (_this4._parametersElements.has(parameter.type)) {
          _this4._parametersElements.get(parameter.type).addItem(item.element);
        }
      });
      dom.emptyElement(this.element);
      var row = this.element.insertRow(-1);
      var columnsAvailable = [];
      this._parametersElements.forEach(function (column) {
        return column.length > 0 ? columnsAvailable.push(column) : 0;
      });
      this.normalizeColumns(columnsAvailable).forEach(function (column) {
        return row.insertCell(-1).appendChild(column.element);
      });
    }
  }]);
}(ParametersList);
normalizeColumnsMixin(ParametersCheckboxes.prototype);
translateMixin(ParametersCheckboxes.prototype);
module.exports = ParametersCheckboxes;

},{"../dom/main":33,"../effects/ColumnDisplay":41,"../effects/noramlizeColumnsMixin":53,"../lib/ignore":63,"../utils/translateMixin":154,"./ParameterItemCheckbox":84,"./ParametersList":86}],86:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var eventsMixin = require('../utils/eventsMixin');
var ParametersList = function () {
  function ParametersList() {
    _classCallCheck(this, ParametersList);
    this._values = new Map();
    this._element = null;
  }
  return _createClass(ParametersList, [{
    key: "onValuesSet",
    value: function onValuesSet() {
      this.dispatchEvent('setValues');
    }
  }, {
    key: "value",
    get: function get() {
      var result = {};
      this._values.forEach(function (value, key) {
        return result[key] = value;
      });
      return result;
    },
    set: function set(parameters) {
      this._values.clear();
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this._values.set(key, parameters[key]);
        }
      }
      this.onValuesSet();
    }
  }]);
}();
eventsMixin(ParametersList.prototype);
module.exports = ParametersList;

},{"../utils/eventsMixin":148}],87:[function(require,module,exports){
'use strict';

var dates = require('../utils/Date');
var lib = require('../Lib');
module.exports = function determineParamsType(params) {
  for (var i = 0, l = params.length; i < l; i++) {
    if (dates.parseDate(params[i].value)) {
      return lib.SEOQUAKE_TYPE_DATE;
    } else if (params[i].value.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/)) {
      return lib.SEOQUAKE_TYPE_IP;
    } else if (params[i].value.match(/^[0-9,\.\s]+$/)) {
      return lib.SEOQUAKE_TYPE_INT;
    }
  }
  return lib.SEOQUAKE_TYPE_STRING;
};

},{"../Lib":7,"../utils/Date":142}],88:[function(require,module,exports){
'use strict';

var dates = require('../utils/Date');
var ip2long = require('../lib/ip2long');
var lib = require('../Lib');
module.exports = function modifyParams(params, type) {
  params.forEach(function (param) {
    if (type === lib.SEOQUAKE_TYPE_DATE) {
      param.value = param.value === null ? 0 : dates.parseDate(param.value);
    } else if (type === lib.SEOQUAKE_TYPE_IP) {
      param.value = param.value === null ? 0 : ip2long(param.value);
    } else if (type === lib.SEOQUAKE_TYPE_INT) {
      param.value = param.value === null ? -1 : parseInt(param.value.replace(/,+/g, '').replace(/\.+/g, '').replace(/\s+/g, ''));
      if (isNaN(param.value)) {
        param.value = -1;
      }
    } else if (param.value === null) {
      param.value = '0';
    }
  });
  return params;
};

},{"../Lib":7,"../lib/ip2long":64,"../utils/Date":142}],89:[function(require,module,exports){
'use strict';

var lib = require('../Lib');
function compareAsc(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}
function compareDesc(a, b) {
  if (a.value < b.value) {
    return 1;
  }
  if (a.value > b.value) {
    return -1;
  }
  return 0;
}
module.exports = function sortParams(params, type) {
  if (type === lib.SEOQUAKE_SORT_ASC) {
    params.sort(compareAsc);
  } else {
    params.sort(compareDesc);
  }
  return params;
};

},{"../Lib":7}],90:[function(require,module,exports){
'use strict';

module.exports = function pluginHighlightMixin(plugin) {
  if (!(typeof plugin.doHighlightSites === 'function')) {
    plugin.doHighlightSites = function (strHighlightSites, strHighlightSitesColor) {
      var hs = strHighlightSites.split(/\n/i).filter(function (element) {
        return element.trim() !== '';
      });
      hs.forEach(function (element) {
        return element.replace(/\s|\t/g, '').replace(/\./g, '\\.').replace(/\*/g, '.*');
      });
      var result = false;
      if (hs.length > 0) {
        Array.from(document.querySelectorAll('a')).forEach(function (el) {
          var theHref = el.getAttribute('href');
          if (!theHref || theHref === '#') {
            return;
          }
          hs.forEach(function (domain) {
            try {
              if (theHref.match(new RegExp('^http(s)?:\/\/[^\/]*(\.)?' + domain + '.*$', 'i'))) {
                el.style.backgroundColor = strHighlightSitesColor;
                result = true;
              }
            } catch (ignore) {}
          });
        });
      }
      return result;
    };
  }
  if (!(typeof plugin.doUnhighlightSites === 'function')) {
    plugin.doUnhighlightSites = function (strHighlightSites) {
      return this.doHighlightSites(strHighlightSites, '');
    };
  }
};

},{}],91:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var BaseSERPPlugin = require('../serpPlugin/BaseSERPPlugin');
var dom = require('../dom/main');
var IndexItem = require('../serpPlugin/IndexItem');
var lib = require('../Lib');
var ignore = require('../lib/ignore');
var Bing2Plugin = function (_BaseSERPPlugin) {
  function Bing2Plugin() {
    var _this;
    _classCallCheck(this, Bing2Plugin);
    _this = _callSuper(this, Bing2Plugin);
    _this.name = 'bing';
    _this.match = ['^http(s)?:\/\/.*bing\\\.[a-z]{2,3}\/search.*q=.+'];
    _this._searchQuerySelector = 'input[name=q]';
    _this.observerDivMain = null;
    _this.observeDivMain = _this.handleObserveDivMain.bind(_this);
    _this.processSearchChange = _this.handleSearchChange.bind(_this);
    _this.processAfterConfigurationUpdated = _this.handleAfterConfigurationUpdated.bind(_this);
    return _this;
  }
  _inherits(Bing2Plugin, _BaseSERPPlugin);
  return _createClass(Bing2Plugin, [{
    key: "controlPanelTop",
    get: function get() {
      var element = document.querySelector('.b_header');
      if (!element) {
        return _get(_getPrototypeOf(Bing2Plugin.prototype), "getControlPanelTop", this);
      }
      var _dom$getOffset = dom.getOffset(element),
        top = _dom$getOffset.top;
      top += element.offsetHeight - 1;
      return top;
    }
  }, {
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.bing;
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;
      setTimeout(function () {
        _get(_getPrototypeOf(Bing2Plugin.prototype), "run", _this2).call(_this2);
        if (_this2._isRunning) {
          _this2.addEventListener('afterConfigurationUpdated', _this2.processAfterConfigurationUpdated);
          if (!_this2.configuration.core.disabled && !_this2.pluginConfiguration.disabled) {
            _this2.addDOMObservers();
          }
        }
      }, 500);
    }
  }, {
    key: "getStartPos",
    value: function getStartPos() {
      var startPos = lib.getVarValueFromURL(document.location.href, 'first') || 0;
      if (!startPos) {
        startPos = 0;
      }
      try {
        startPos = parseInt(startPos, 10);
      } catch (e) {
        startPos = 0;
      }
      if (startPos > 0) {
        startPos--;
      }
      return startPos;
    }
  }, {
    key: "addParametersPanels",
    value: function addParametersPanels() {
      var _this3 = this;
      var startPos = this.getStartPos();
      var selectors = 'ol#b_results li.b_algo,' + 'ol#b_results div.sb_add';
      var elements = Array.from(document.querySelectorAll(selectors));
      elements.forEach(function (element, index) {
        var title = element.querySelector('h2');
        var link = element.querySelector('h2 > a');
        if (!link) {
          return;
        }
        if (dom.hasClass(link, 'seoquake-params-link')) {
          return;
        }
        link.dispatchEvent(new MouseEvent('mouseenter', {
          bubbles: true
        }));
        var urlHash = lib.shortHash(link.href);
        _this3.urls.set(urlHash, lib.parseUri(link.href));
        element.setAttribute('rel', urlHash);
        link.setAttribute('rel', urlHash + ' x_url');
        dom.addClass(link, 'seoquake-params-link');
        var paramsPanel = _this3.createParamsPanel(urlHash, null, true, index, ++startPos);
        _this3._parametersPanels.add(paramsPanel);
        title.after(paramsPanel);
      });
      if (this._parametersPanels.size > 0) {
        this.processRequestUrls(this._requestUrls);
      }
      this.dispatchEvent('parametersPanelsReady');
    }
  }, {
    key: "addIndexes",
    value: function addIndexes() {
      var _this4 = this;
      if (this._resultIndexes.size > 0) {
        return;
      }
      var startPos = this.getStartPos();
      var selector = 'ol#b_results > li.b_algo h2 > a';
      var elements = Array.from(document.querySelectorAll(selector));
      elements.forEach(function (element, index) {
        var indexer = new IndexItem(index + startPos + 1);
        element.parentNode.insertBefore(indexer.element, element.parentNode.firstChild);
        _this4._resultIndexes.add(indexer);
      });
    }
  }, {
    key: "runSERPTool",
    value: function runSERPTool() {
      var data = {
        serp: this.name,
        query: this.searchQuery,
        links: []
      };
      var elements = Array.from(document.querySelectorAll('ol#b_results > li.b_algo'));
      elements.forEach(function (element) {
        var link = element.querySelector('h2 > a');
        if (!link) {
          return;
        }
        data.links.push([link.href, dom.text(link)]);
      });
      this._sendMessage('sq.moduleRun', {
        name: 'serptool',
        configuration: data
      });
    }
  }, {
    key: "getElements",
    value: function getElements(params) {
      var elements = {
        container: null,
        items: []
      };
      for (var i = 0; i < params.length; i++) {
        var row = document.querySelector('li[rel="' + params[i].urlHash + '"]');
        if (!row) {
          continue;
        }
        elements.items.push(row);
        if (row.nextElementSibling) {
          if (!dom.hasClass(row.nextElementSibling, 'b_pag') && !dom.hasClass(row.nextElementSibling, 'b_msg') && !dom.hasClass(row.nextElementSibling, 'b_ans')) {
            if (row.nextElementSibling.tagName !== 'LI' || !row.nextElementSibling.hasAttribute('rel')) {
              elements.items.push(row.nextSibling);
            }
          }
        }
        if (!elements.container) {
          elements.container = row.parentNode;
        }
      }
      return elements;
    }
  }, {
    key: "putElements",
    value: function putElements(elements) {
      var items = elements.container.querySelectorAll('li.b_algo');
      var lastItemElement = null;
      if (items && items.length > 0) {
        lastItemElement = items[items.length - 1];
      }
      var container = elements.container;
      for (var i = 0, l = elements.items.length; i < l; i++) {
        var element = elements.items[i];
        if (lastItemElement && lastItemElement.nextElementSibling) {
          container.insertBefore(element, lastItemElement.nextElementSibling);
        } else {
          if (container.firstChild) {
            container.insertBefore(element, container.firstChild);
          } else {
            container.appendChild(element);
          }
        }
        lastItemElement = element;
      }
    }
  }, {
    key: "addDOMObservers",
    value: function addDOMObservers() {
      this.observerDivMain = new MutationObserver(this.observeDivMain);
      this.observerDivMain.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "removeDOMObservers",
    value: function removeDOMObservers() {
      if (this.observerDivMain !== null) {
        this.observerDivMain.disconnect();
        this.observerDivMain = null;
      }
    }
  }, {
    key: "handleObserveDivMain",
    value: function handleObserveDivMain(mutations) {
      var doRedrawPanels = false;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.target.tagName === 'DIV' && mutation.target.id === 'b_content') {
          setTimeout(this.processSearchChange, 500);
          break;
        }
      }
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange() {
      if (!this._isRunning) {
        return;
      }
      this.removeControlPanel();
      this.removeParametersPanels();
      this.removeIndexes();
      this.doUnhighlightSites(this.configuration.core.highlight_sites);
      this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
      if (!this.configuration.core.disabled) {
        this.addControlPanel();
        if (!this.pluginConfiguration.disabled) {
          this.addParametersPanels();
          if (!this.configuration.core.disable_serps_pos_numbers) {
            this.addIndexes();
          }
          if (!this.configuration.core.disable_highlight_sites) {
            this.doHighlightSites(this.configuration.core.highlight_sites, this.configuration.core.highlight_sites_color);
          }
        }
      }
    }
  }, {
    key: "handleDetach",
    value: function handleDetach() {
      this.removeDOMObservers();
      _get(_getPrototypeOf(Bing2Plugin.prototype), "handleDetach", this).call(this);
    }
  }, {
    key: "handleAfterConfigurationUpdated",
    value: function handleAfterConfigurationUpdated(changes) {
      if (!this._isRunning) {
        return;
      }
      if (changes.length === 0) {
        return;
      }
      if (this.configuration.core.disabled) {
        this.removeDOMObservers();
      } else {
        if (!this.pluginConfiguration.disabled) {
          this.addDOMObservers();
        }
      }
    }
  }]);
}(BaseSERPPlugin);
module.exports = Bing2Plugin;

},{"../Lib":7,"../dom/main":33,"../lib/ignore":63,"../serpPlugin/BaseSERPPlugin":118,"../serpPlugin/IndexItem":121}],92:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var BaseSERPPlugin = require('../serpPlugin/BaseSERPPlugin');
var dom = require('../dom/main');
var IndexItem = require('../serpPlugin/IndexItem');
var lib = require('../Lib');
var HLGLSERPControlPanel = require('../serpPlugin/HLGLSERPControlPanel');
var SERPKeywordDifficulty = require('../serpPlugin/SERPKeywordDifficulty');
var ignore = require('../lib/ignore');
var ITEM_SELECTOR = '*.r a, *.rc a, *.yuRUbf a';
var Google2Plugin = function (_BaseSERPPlugin) {
  function Google2Plugin() {
    var _this;
    _classCallCheck(this, Google2Plugin);
    _this = _callSuper(this, Google2Plugin);
    _this.name = 'google';
    _this.match = ['^http(s)?:\/\/(www\.)?google\.[a-z]{2,3}(\.[a-z]{2,3})?\/'];
    _this.exclude = ['^https:\/\/www\.google\.com\/webmasters\/.*'];
    _this._searchQuerySelector = 'input[name=q]';
    _this._keywordDifficulty = null;
    _this.observerDivMain = null;
    _this.observerDivSearch = null;
    _this.observerSearchForm = null;
    _this.processAfterConfigurationUpdated = _this.handleAfterConfigurationUpdated.bind(_this);
    _this.processDivSearch = _this.handleDivSearch.bind(_this);
    _this.processDivMain = _this.handleDivMain.bind(_this);
    _this.processSearchChange = _this.handleSearchChange.bind(_this);
    _this.processSearchForm = _this.handleSearchForm.bind(_this);
    return _this;
  }
  _inherits(Google2Plugin, _BaseSERPPlugin);
  return _createClass(Google2Plugin, [{
    key: "adaptLayout",
    value: function adaptLayout() {
      var googlePanel = document.querySelector('#searchform > div.sfbg');
      if (googlePanel) {
        googlePanel.style.setProperty('min-height', '87px', 'important');
      }
    }
  }, {
    key: "controlPanelTop",
    get: function get() {
      var element = document.getElementById('hdtbSum');
      if (!element) {
        return _get(_getPrototypeOf(Google2Plugin.prototype), "controlPanelTop", this);
      }
      var _dom$getOffset = dom.getOffset(element),
        top = _dom$getOffset.top;
      top += element.offsetHeight + 1;
      return top;
    }
  }, {
    key: "controlPanelOffsetTop",
    get: function get() {
      var googlePanel = document.querySelector('#searchform > div.sfbg');
      if (googlePanel) {
        var boundingRect = googlePanel.getBoundingClientRect();
        return boundingRect.top + boundingRect.height;
      }
      return 0;
    }
  }, {
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.google;
    }
  }, {
    key: "run",
    value: function run() {
      _get(_getPrototypeOf(Google2Plugin.prototype), "run", this).call(this);
      this.adaptLayout();
      if (this._isRunning) {
        this.addEventListener('afterConfigurationUpdated', this.processAfterConfigurationUpdated);
        if (!this.configuration.core.disabled) {
          this.addDOMObservers();
          if (!this.pluginConfiguration.disabled) {
            if (this.configuration.google.show_keyword_difficulty) {
              this.addKeywordDifficultyPanel();
            }
          }
        }
      }
    }
  }, {
    key: "getStartPos",
    value: function getStartPos() {
      var startPos = lib.getVarValueFromURL(document.location.hash, 'start');
      if (!startPos) {
        startPos = lib.getVarValueFromURL(document.location.href, 'start');
        if (!startPos) {
          startPos = 0;
        }
      }
      try {
        startPos = parseInt(startPos);
      } catch (ignore) {
        startPos = 0;
      }
      return startPos;
    }
  }, {
    key: "getResultElements",
    value: function getResultElements() {
      var selector = '#res div.rc div.s,' + '#res li.g > div.rc div.s,' + '#res li.g > div.vsc div.s,' + '#res div.g div.yuRUbf,' + '#res #rso div.yuRUbf,' + '#botstuff div.g div.yuRUbf,' + '#botstuff #rso div.yuRUbf,' + '#ires div.g > div.rc div.s,' + '#ires div.g > div > div.rc div.s,' + '#ires div.g > div > div > div.rc div.s,' + '#ires li.g div.rc div.s,' + '#taw div.v5yQqb,' + '#search div.MjjYud div.yuRUbf';
      return Array.from(document.querySelectorAll(selector)).filter(function (element) {
        if (element.firstElementChild.tagName === 'TABLE' && element.firstElementChild.className === 'ts') {
          return false;
        }
        if (!element.textContent) {
          return false;
        }
        return element.parentNode.querySelector(ITEM_SELECTOR) !== null;
      });
    }
  }, {
    key: "addParametersPanels",
    value: function addParametersPanels() {
      var _this2 = this;
      var startPos = this.getStartPos();
      this.getResultElements().forEach(function (element, index) {
        element = element.parentNode;
        var link = element.querySelector(ITEM_SELECTOR);
        if (!link) {
          return;
        }
        if (dom.hasClass(link, 'seoquake-params-link')) {
          return;
        }
        var urlHash = lib.shortHash(link.href);
        _this2.urls.set(urlHash, lib.parseUri(link.href));
        dom.attr(element.parentNode, 'rel', urlHash);
        dom.attr(link, 'rel', urlHash + ' x_url');
        dom.addClass(link, 'seoquake-params-link');
        var paramsPanel = _this2.createParamsPanel(urlHash, null, true, index, ++startPos);
        _this2._parametersPanels.add(paramsPanel);
        element.appendChild(paramsPanel);
      });
      if (this._parametersPanels.size > 0) {
        this.processRequestUrls(this._requestUrls);
      }
      this.dispatchEvent('parametersPanelsReady');
    }
  }, {
    key: "addIndexes",
    value: function addIndexes() {
      var _this3 = this;
      if (this._resultIndexes.size > 0) {
        return;
      }
      var startPos = this.getStartPos();
      this.getResultElements().forEach(function (element, index) {
        var indexer = new IndexItem(index + startPos + 1);
        var placer = element.querySelector('h3 span, h3, .ellip') || element;
        placer = placer.nodeName === 'H3' ? placer : placer.parentNode;
        placer.insertBefore(indexer.element, placer.firstChild);
        _this3._resultIndexes.add(indexer);
      });
    }
  }, {
    key: "addControlPanel",
    value: function addControlPanel() {
      if (this._controlPanel !== null) {
        return;
      }
      if (!document.getElementById('search') && !document.getElementById('rso')) {
        return;
      }
      if (this.getResultElements().length === 0) {
        return;
      }
      this._controlPanel = new HLGLSERPControlPanel(this);
      this._controlPanel.setTranslateFunction(this.t.bind(this));
      document.body.appendChild(this._controlPanel.element);
      this._controlPanel["float"] = true;
      this._controlPanel.addEventListener('turnOff', this.processSwitchOff);
      this._controlPanel.addEventListener('turnOn', this.processSwitchOn);
      this._controlPanel.addEventListener('requestAll', this.processParametersRequestAll);
      this._controlPanel.addEventListener('openConfiguration', this.processOpenConfiguration);
      this._controlPanel.addEventListener('parametersUpdate', this.processParametersUpdate);
    }
  }, {
    key: "removeControlPanel",
    value: function removeControlPanel() {
      if (this._controlPanel !== null) {
        this._controlPanel.remove();
        this._controlPanel = null;
      }
    }
  }, {
    key: "addKeywordDifficultyPanel",
    value: function addKeywordDifficultyPanel() {
      if (this._keywordDifficulty !== null) {
        return;
      }
      this._keywordDifficulty = new SERPKeywordDifficulty(this);
      this._keywordDifficulty.setMessenger(this.getMessenger());
      this._keywordDifficulty.init();
    }
  }, {
    key: "removeKeywordDifficultyPanel",
    value: function removeKeywordDifficultyPanel() {
      if (this._keywordDifficulty !== null) {
        this._keywordDifficulty.remove();
        this._keywordDifficulty = null;
      }
    }
  }, {
    key: "removeDOMObservers",
    value: function removeDOMObservers() {
      if (this.observerDivMain !== null) {
        this.observerDivMain.disconnect();
        this.observerDivMain = null;
      }
      if (this.observerDivSearch !== null) {
        this.observerDivSearch.disconnect();
        this.observerDivSearch = null;
      }
      if (this.observerSearchForm !== null) {
        this.observerSearchForm.disconnect();
        this.observerSearchForm = null;
      }
    }
  }, {
    key: "addDOMObservers",
    value: function addDOMObservers() {
      if (this.observerDivSearch !== null || this.observerDivMain !== null || this.observerSearchForm !== null) {
        return;
      }
      var divMain = document.querySelector('div#main');
      if (divMain !== null) {
        this.observerDivSearch = new MutationObserver(this.processDivSearch);
        this.observerDivSearch.observe(divMain, {
          childList: true,
          subtree: true
        });
      } else {
        this.observerDivMain = new MutationObserver(this.processDivMain);
        this.observerDivMain.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      this.observerSearchForm = new MutationObserver(this.processSearchForm);
      this.observerSearchForm.observe(document.querySelector('#searchform'), {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "runSERPTool",
    value: function runSERPTool() {
      var data = {
        serp: this.name,
        query: this.searchQuery,
        links: []
      };
      this.getResultElements().forEach(function (element) {
        element = element.parentNode;
        var link = element.querySelector(ITEM_SELECTOR);
        if (!link) {
          return;
        }
        data.links.push([link.href, dom.text(link)]);
      });
      this._sendMessage('sq.moduleRun', {
        name: 'serptool',
        configuration: data
      });
    }
  }, {
    key: "getElements",
    value: function getElements(params) {
      var elements = {
        container: document.querySelector('#rso'),
        items: []
      };
      params.forEach(function (param) {
        var row = Array.from(document.querySelectorAll('div[rel="' + param.urlHash + '"]'));
        if (!row || row.length === 0) {
          return;
        }
        row.forEach(function (item) {
          return elements.items.push(item.parentNode.parentNode);
        });
      });
      return elements;
    }
  }, {
    key: "processHlGlParams",
    value: function processHlGlParams(data) {
      var sURL = document.location.href;
      var hl = data.language;
      var gl = data.country;
      var sharp = sURL.indexOf('#');
      var googlesearch = sURL.indexOf('/search?');
      this.setConfiguration({
        'google.google_hl': hl,
        'google.google_gl': gl
      });
      if (sharp > 0 && googlesearch > 0) {
        sURL = sURL.substring(0, sharp);
      }
      var currentHL = /hl=([^&]+)/gi.exec(sURL);
      if (currentHL !== null) {
        currentHL = currentHL[1];
      } else {
        currentHL = '';
      }
      var currentGL = /gl=([^&]+)/gi.exec(sURL);
      if (currentGL !== null) {
        currentGL = currentGL[1];
      } else {
        currentGL = '';
      }
      if (hl === 'none' && gl === 'none') {
        this.registerEvent(this.name, 'resetHLGL');
      } else {
        this.registerEvent(this.name, 'changeHLGL', 'HL:' + currentHL + '->' + hl + '|GL:' + currentGL + '->' + gl);
      }
      sURL = sURL.indexOf('hl=') > -1 ? sURL.replace(/hl=([^&]+)/gi, 'hl=' + hl) : sURL + '&hl=' + hl;
      sURL = sURL.indexOf('gl=') > -1 ? sURL.replace(/gl=([^&]+)/gi, 'gl=' + gl) : sURL + '&gl=' + gl;
      document.location.href = sURL;
      this.handleSetConfiguration();
    }
  }, {
    key: "handleDetach",
    value: function handleDetach() {
      this.removeEventListener('afterConfigurationUpdated', this.processAfterConfigurationUpdated);
      this.removeDOMObservers();
      this.removeKeywordDifficultyPanel();
      _get(_getPrototypeOf(Google2Plugin.prototype), "handleDetach", this).call(this);
    }
  }, {
    key: "handleAfterConfigurationUpdated",
    value: function handleAfterConfigurationUpdated(changes) {
      if (!this._isRunning) {
        return;
      }
      if (changes.length === 0) {
        return;
      }
      if (this.configuration.core.disabled) {
        this.removeDOMObservers();
        this.removeKeywordDifficultyPanel();
      } else {
        if (!this.configuration.google.disabled) {
          this.addDOMObservers();
          if (this.configuration.google.show_keyword_difficulty) {
            if (this._keywordDifficulty === null) {
              this.addKeywordDifficultyPanel();
            } else if (!this.configuration.google.onboarding_keyword_difficulty) {
              this._keywordDifficulty.hideOnboarding();
            }
          } else {
            this.removeKeywordDifficultyPanel();
          }
        } else {
          this.removeKeywordDifficultyPanel();
        }
        this._controlPanel.setConfiguration(this.configuration);
      }
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange() {
      if (!this._isRunning) {
        return;
      }
      this.removeControlPanel();
      this.removeParametersPanels();
      this.removeIndexes();
      this.removeKeywordDifficultyPanel();
      this.doUnhighlightSites(this.configuration.core.highlight_sites);
      this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
      if (!this.configuration.core.disabled) {
        this.addControlPanel();
        if (!this.configuration.google.disabled) {
          this.addParametersPanels();
          if (!this.configuration.core.disable_serps_pos_numbers) {
            this.addIndexes();
          }
          if (this.configuration.google.show_keyword_difficulty) {
            this.addKeywordDifficultyPanel();
          }
          if (!this.configuration.core.disable_highlight_sites) {
            this.doHighlightSites(this.configuration.core.highlight_sites, this.configuration.core.highlight_sites_color);
          }
        }
      }
    }
  }, {
    key: "handleSearchForm",
    value: function handleSearchForm(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.target.tagName === 'DIV' && mutation.target.id === 'xt-info') {
          if (this._keywordDifficulty !== null) {
            this._keywordDifficulty.compatibiltyMode();
          }
        }
      }
    }
  }, {
    key: "handleDivSearch",
    value: function handleDivSearch(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.target.tagName === 'DIV' && mutation.target.id && (mutation.target.id === 'search' || mutation.target.id.indexOf('arc-srp_') !== -1)) {
          setTimeout(this.processSearchChange, 500);
          break;
        }
      }
    }
  }, {
    key: "handleDivMain",
    value: function handleDivMain(mutations) {
      var kill = false;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.target.tagName === 'DIV' && mutation.target.id === 'main') {
          this.observerDivSearch = new MutationObserver(this.processDivSearch);
          this.observerDivSearch.observe(document.querySelector('div#main'), {
            childList: true,
            subtree: true
          });
          kill = true;
          break;
        }
      }
      if (kill) {
        this.observerDivMain.disconnect();
      }
    }
  }]);
}(BaseSERPPlugin);
module.exports = Google2Plugin;

},{"../Lib":7,"../dom/main":33,"../lib/ignore":63,"../serpPlugin/BaseSERPPlugin":118,"../serpPlugin/HLGLSERPControlPanel":120,"../serpPlugin/IndexItem":121,"../serpPlugin/SERPKeywordDifficulty":124}],93:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var lib = require('../Lib');
var dom = require('../dom/main');
var BasePlugin = require('../BasePlugin');
var NofollowPlugin = function (_BasePlugin) {
  function NofollowPlugin() {
    var _this;
    _classCallCheck(this, NofollowPlugin);
    _this = _callSuper(this, NofollowPlugin);
    _this.name = 'nofollow';
    _this.fixWYSIWYGObserverListener = _this.fixWYSIWYGObserver.bind(_this);
    _this.observer = null;
    return _this;
  }
  _inherits(NofollowPlugin, _BasePlugin);
  return _createClass(NofollowPlugin, [{
    key: "process",
    value: function process() {
      var _this2 = this;
      this.isBodyReady.then(function () {
        Array.from(dom.findAll('a[rel~=nofollow],noindex')).forEach(function (element) {
          return dom.addClass(element, 'seoquake-nofollow');
        });
        _this2.fixWYSIWYG();
      });
    }
  }, {
    key: "handleDone",
    value: function handleDone() {
      NofollowPlugin.removeHighlight(dom.findAll('.seoquake-nofollow'));
      if (this.observer !== null) {
        this.observer.disconnect();
        this.observer = null;
      }
      _get(_getPrototypeOf(NofollowPlugin.prototype), "handleDone", this).call(this);
      return true;
    }
  }, {
    key: "handleUpdateConfiguration",
    value: function handleUpdateConfiguration(configuration) {
      this.handleDone();
      this.configuration = configuration.nofollow;
      if (configuration.core.disabled === false && this.checkState()) {
        this.process();
      }
      return false;
    }
  }, {
    key: "fixWYSIWYG",
    value: function fixWYSIWYG() {
      var editors = ['tinymce', 'ckeditor', 'alloy'];
      dom.findAll('.cke_editable, .mce-content-body, .mce-tinymce').forEach(function (element) {
        return NofollowPlugin.removeHighlight(element.querySelectorAll('.seoquake-nofollow'));
      });
      if (dom.findAll('script').some(function (script) {
        return dom.hasAttr(script, 'src') && lib.containsText(dom.attr(script, 'src'), editors);
      })) {
        this.observer = new MutationObserver(this.fixWYSIWYGObserverListener);
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }
    }
  }, {
    key: "fixWYSIWYGObserver",
    value: function fixWYSIWYGObserver(mutations) {
      var removeObserver = false;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          if (dom.hasClass(mutation.addedNodes[j], 'cke_editable') || dom.hasClass(mutation.addedNodes[j], 'mce-content-body') || dom.hasClass(mutation.addedNodes[j], 'mce-tinymce')) {
            var nofollowElements = mutation.target.querySelectorAll('.seoquake-nofollow');
            NofollowPlugin.removeHighlight(nofollowElements);
            removeObserver = true;
          }
        }
        if (mutation.target) {
          if (dom.hasClass(mutation.target, 'cke_editable') || dom.hasClass(mutation.target, 'mce-content-body') || dom.hasClass(mutation.target, 'mce-tinymce')) {
            var _nofollowElements = mutation.target.querySelectorAll('.seoquake-nofollow');
            NofollowPlugin.removeHighlight(_nofollowElements);
            removeObserver = true;
          }
        }
      }
      if (removeObserver) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  }], [{
    key: "removeHighlight",
    value: function removeHighlight(elements) {
      Array.from(elements).forEach(function (element) {
        return dom.removeClass(element, 'seoquake-nofollow');
      });
    }
  }]);
}(BasePlugin);
module.exports = NofollowPlugin;

},{"../BasePlugin":5,"../Lib":7,"../dom/main":33}],94:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var Google2Plugin = require('./Google2Plugin');
var Semrush2Plugin = function (_Google2Plugin) {
  function Semrush2Plugin() {
    var _this;
    _classCallCheck(this, Semrush2Plugin);
    _this = _callSuper(this, Semrush2Plugin);
    _this.name = 'semrush';
    _this.match = ['^http(s)?:\/\/(\\w+)\\.semrush\\.com\/(\\w{2}\/)?info\/([a-z0-9 \.\-]+) \\(source\\)'];
    _this._searchQuerySelector = 'input[name=q]';
    return _this;
  }
  _inherits(Semrush2Plugin, _Google2Plugin);
  return _createClass(Semrush2Plugin, [{
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.semrush;
    }
  }, {
    key: "controlPanelOffsetTop",
    get: function get() {
      var result = 0;
      var topNav = document.getElementById('header');
      if (topNav) {
        result += topNav.offsetHeight;
      }
      return result;
    }
  }, {
    key: "handleDivMain",
    value: function handleDivMain(mutations) {
      if (mutations.some(function (m) {
        return m.target.tagName === 'DIV' && m.target.id === 'source';
      })) {
        if (this.observerDivMain !== null) {
          this.observerDivMain.disconnect();
          this.observerDivMain = null;
        }
        setTimeout(this.processSearchChange, 500);
      }
    }
  }]);
}(Google2Plugin);
module.exports = Semrush2Plugin;

},{"./Google2Plugin":92}],95:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var lib = require('../Lib');
var isObject = require('../lib/isObject');
var isEmpty = require('../lib/isEmpty');
var clearUri = require('../lib/parseUri').clearUri;
var extend = require('extend');
var ErrorDisable = require('../basePlugin/ErrorDisable');
var SeobarHorizontalTop = require('../seobar/SeobarHorizontalTop');
var SeobarVerticalLeft = require('../seobar/SeobarVerticalLeft');
var SeobarVerticalRight = require('../seobar/SeobarVerticalRight');
var SeobarHorizontalBottom = require('../seobar/SeobarHorizontalBottom');
var requestPageinfo = require('../page/PageInfo');
var requestPageDiagnosis = require('../page/PageDiagnosis');
var Diagnosis = require('../diagnosis/Diagnosis');
var diffObjects = require('../lib/diffObjects');
var ignore = require('../lib/ignore');
var XHRProxy = require('../utils/XHRProxy');
var defaultConfig = require('../defaults/configuration').seobar;
var Seobar2Plugin = function () {
  function Seobar2Plugin() {
    _classCallCheck(this, Seobar2Plugin);
    this._uuid = null;
    this._init = false;
    this._configuration = null;
    this._parameters = null;
    this._currentConfiguration = null;
    this._currentParameters = null;
    this._changesConfiguration = null;
    this._changesParameters = null;
    this._assetsUrl = null;
    this._panel = null;
    this._match = [];
    this._except = [];
    this._isBodyReady = null;
    this._isSemrush = null;
    this._isSemrushOAuth = null;
    this._processIsBodyReady = this._handleIsBodyReady.bind(this);
    this._processSetConfiguration = this._handleSetConfiguration.bind(this);
    this._processDetach = this._handleDetach.bind(this);
    this._processError = this._handleError.bind(this);
    this._processSetAssetsUrl = this._handleSetAssetsUrl.bind(this);
    this._processSetParameters = this._handleSetParameters.bind(this);
    this._processPageinfoClick = this._handlePageinfoClick.bind(this);
    this._processDiagnosisClick = this._handleDiagnosisClick.bind(this);
    this._processDensityClick = this._handleDensityClick.bind(this);
    this._processRobotsClick = this._handleRobotsClick.bind(this);
    this._processSitemapClick = this._handleSitemapClick.bind(this);
    this._processLinkInternalClick = this._handleLinkInternalClick.bind(this);
    this._processLinkExternalClick = this._handleLinkExternalClick.bind(this);
    this._processConfigurationClick = this._handleConfigurationClick.bind(this);
    this.processSendConfigurationUpdate = this._handleSendConfigurationUpdate.bind(this);
    this.processCloseClick = this.handleCloseClick.bind(this);
    this.processExcludeClick = this.handleExcludeClick.bind(this);
    this.processWhitelistLinkClick = this.handleWhitelistLinkClick.bind(this);
    this._pageinfoData = null;
    this._diagnosisData = null;
    this._robotsTxtData = null;
    this._sitemapXMLData = null;
  }
  return _createClass(Seobar2Plugin, [{
    key: "configuration",
    get: function get() {
      if (this._configuration === null) {
        this._resetConfiguration();
      }
      return this._configuration;
    },
    set: function set(values) {
      if (!isObject(values)) {
        return;
      }
      if (this._configuration === null) {
        this._resetConfiguration();
      }
      for (var key in this._configuration) {
        if (this._configuration.hasOwnProperty(key) && values.hasOwnProperty(key)) {
          this._configuration[key] = values[key];
        }
      }
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._parameters;
    },
    set: function set(parameters) {
      this._parameters = extend(true, {}, parameters);
    }
  }, {
    key: "name",
    get: function get() {
      return 'seobar';
    }
  }, {
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "assetsUrl",
    get: function get() {
      return this._assetsUrl;
    }
  }, {
    key: "parsedUri",
    get: function get() {
      return lib.parseUri(document.location.href);
    }
  }, {
    key: "isBodyReady",
    get: function get() {
      if (this._isBodyReady === null) {
        this._isBodyReady = new Promise(this._processIsBodyReady);
      }
      return this._isBodyReady;
    }
  }, {
    key: "UUID",
    get: function get() {
      return this.getUUID();
    }
  }, {
    key: "isSemrush",
    get: function get() {
      return this._isSemrush;
    }
  }, {
    key: "isSemrushOAuth",
    get: function get() {
      return this._isSemrushOAuth;
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      this.getAssetsUrl().then(this._processSetAssetsUrl).then(this._processSetConfiguration).then(function () {
        return _this._init = true;
      })["catch"](this._processError);
      this.addMessageListener('sq.updateConfiguration', this._processSetConfiguration);
      this.addMessageListener('detach', this._processDetach);
    }
  }, {
    key: "process",
    value: function process() {
      var _this2 = this;
      try {
        if (document.querySelectorAll('html>head').length === 0 && document.querySelectorAll('body>div.webkit-line-gutter-backdrop').length > 0) {
          return;
        }
        if (document.querySelectorAll('html>head').length === 0 && document.querySelectorAll('body>img[style="-webkit-user-select: none"]').length > 0) {
          return;
        }
        if (document.getElementById('errorPageContainer')) {
          return;
        }
        if (document.defaultView.parent.frames && document.defaultView.frames && document.defaultView.frames.length !== document.defaultView.parent.frames.length) {
          return;
        } else if (document.defaultView.parent.frames && document.defaultView.frames && document.defaultView.frames.length === document.defaultView.parent.frames.length && document.body && document.body.tagName === 'FRAMESET') {
          return;
        }
      } catch (e) {
        return false;
      }
      this.isBodyReady.then(function () {
        switch (_this2.configuration.position) {
          case 'top':
            _this2._panel = new SeobarHorizontalTop(_this2);
            break;
          case 'left':
            _this2._panel = new SeobarVerticalLeft(_this2);
            break;
          case 'right':
            _this2._panel = new SeobarVerticalRight(_this2);
            break;
          case 'bottom':
            _this2._panel = new SeobarHorizontalBottom(_this2);
            break;
          default:
            _this2._panel = new SeobarHorizontalTop(_this2);
            break;
        }
        _this2._panel.render();
      })["catch"](ignore);
    }
  }, {
    key: "checkState",
    value: function checkState() {
      var except = Seobar2Plugin.DEFAULT_EXCEPT.slice();
      var conf = this.configuration;
      if (conf.https === true) {
        var index = except.indexOf('^https://.*');
        if (index !== -1) {
          except.splice(index, 1);
        }
      } else {
        var _index = except.indexOf('^https://.*');
        if (_index === -1) {
          except.push('^https://.*');
        }
      }
      if (!isEmpty(conf.excludes)) {
        var excludes = conf.excludes.split(/\n/i).filter(function (item) {
          return item.toString().length > 0;
        });
        except = except.concat(excludes);
      }
      this._except = except;
      var match = [];
      if (!isEmpty(conf.matches)) {
        var matches = conf.matches.split(/\n/i).filter(function (item) {
          return item.toString().length > 0;
        });
        match = match.concat(matches);
      }
      this._match = match;
      return conf.disabled === false && this.checkMatch();
    }
  }, {
    key: "checkMatch",
    value: function checkMatch() {
      try {
        if (!document || !document.location || !document.location.href) {
          return false;
        }
        if (document.getElementById('webkit-xml-viewer-source-xml')) {
          return false;
        }
      } catch (ignore) {
        return false;
      }
      var url = document.location.href;
      var cleanUrl = clearUri(url);
      var match = function match(r) {
        return url.match(new RegExp(r, 'i')) || cleanUrl.match(new RegExp(r, 'i'));
      };
      if (this._match.length > 0 && !this._match.some(match)) {
        return false;
      }
      return !(this._except.length > 0 && this._except.some(match));
    }
  }, {
    key: "getUUID",
    value: function getUUID() {
      if (this._uuid === null) {
        this._uuid = lib.getUUID();
      }
      return this._uuid;
    }
  }, {
    key: "getDiagnosisData",
    value: function getDiagnosisData() {
      var _this3 = this;
      if (this._diagnosisData === null) {
        this._diagnosisData = new Promise(function (resolve) {
          return requestPageDiagnosis(null, function (page) {
            var diagnosis = new Diagnosis(page);
            diagnosis.setMessenger(_this3.getMessenger());
            diagnosis.processRobotsTxt();
            diagnosis.processXMLSitemaps();
            resolve(diagnosis);
          });
        });
      }
      return this._diagnosisData;
    }
  }, {
    key: "getRobotsTxtData",
    value: function getRobotsTxtData() {
      var _this4 = this;
      if (this._robotsTxtData === null) {
        this._robotsTxtData = new Promise(function (resolve) {
          _this4.getDiagnosisData().then(function (diagnosis) {
            diagnosis.addEventListener('compliance.robotsTxt', resolve);
          });
        });
      }
      return this._robotsTxtData;
    }
  }, {
    key: "getSitemapXMLData",
    value: function getSitemapXMLData() {
      var _this5 = this;
      if (this._sitemapXMLData === null) {
        this._sitemapXMLData = new Promise(function (resolve) {
          _this5.getDiagnosisData().then(function (diagnosis) {
            diagnosis.addEventListener('compliance.xmlSitemaps', resolve);
          });
        });
      }
      return this._sitemapXMLData;
    }
  }, {
    key: "getPageinfoData",
    value: function getPageinfoData() {
      if (this._pageinfoData === null) {
        this._pageinfoData = new Promise(function (resolve) {
          requestPageinfo(null, resolve);
        });
      }
      return this._pageinfoData;
    }
  }, {
    key: "openConfiguration",
    value: function openConfiguration() {
      this._sendMessage('sq.openConfigurationWindow', {
        panel: 'seobar'
      });
    }
  }, {
    key: "switchPosition",
    value: function switchPosition(position) {
      this.setConfigurationItem('seobar.position', position).then(this.processSendConfigurationUpdate)["catch"](ignore);
    }
  }, {
    key: "switchColor",
    value: function switchColor(color) {
      this.setConfigurationItem('seobar.color', color).then(this.processSendConfigurationUpdate)["catch"](ignore);
    }
  }, {
    key: "sendFeedback",
    value: function sendFeedback(data) {
      var request = new XHRProxy(this.getMessenger());
      var requestData = new Map();
      requestData.set('text', data.message);
      requestData.set('like', data.like);
      requestData.set('client', window.navigator.userAgent);
      requestData.set('version', '3.13.4');
      request.callback = ignore;
      request.timeoutCallback = ignore;
      request.send('https://www.seoquake.com/review/panel.php', 'post', requestData);
    }
  }, {
    key: "_openCommonModule",
    value: function _openCommonModule(e, which) {
      e.preventDefault();
      e.stopPropagation();
      var request = {
        name: 'common',
        configuration: {
          which: which
        }
      };
      if (e.shiftKey) {
        request.configuration.newWindow = true;
      }
      this._sendMessage('sq.moduleRun', request);
      this.registerEvent('seobar2', 'open-module-' + which);
    }
  }, {
    key: "_resetConfiguration",
    value: function _resetConfiguration() {
      this._configuration = extend(true, {}, Seobar2Plugin.DEFAULT_CONFIGURATION);
    }
  }, {
    key: "_handleSetAssetsUrl",
    value: function _handleSetAssetsUrl(url) {
      this._assetsUrl = url;
      return this.getConfiguration();
    }
  }, {
    key: "_handleSetParameters",
    value: function _handleSetParameters(parameters) {
      this._currentParameters = extend(true, {}, this.parameters);
      this._changesParameters = diffObjects(this._currentParameters, parameters);
      this.parameters = parameters;
      if (this._panel === null) {
        this.process();
      } else {
        this.dispatchEvent('configurationUpdate', [this._changesConfiguration, this._changesParameters]);
      }
    }
  }, {
    key: "_handleSetConfiguration",
    value: function _handleSetConfiguration(configuration) {
      this._currentConfiguration = extend(true, {}, this.configuration);
      this.configuration = configuration.seobar;
      this._changesConfiguration = diffObjects(this._currentConfiguration, this.configuration);
      if (configuration.core.disabled || !this.checkState()) {
        this._handleDone();
        return false;
      }
      var oldIsSemrushOAuth = this._isSemrushOAuth;
      this._isSemrushOAuth = configuration.hasOwnProperty('integration') && configuration.integration.hasOwnProperty('semrush_token') && configuration.integration.semrush_token !== '';
      if (oldIsSemrushOAuth !== null && oldIsSemrushOAuth !== this._isSemrushOAuth) {
        this.dispatchEvent('updateSemrush');
      }
      if (this._changesConfiguration.length > 0) {
        if (this._changesConfiguration.length === 1 && (this._changesConfiguration[0] === 'color' || this._changesConfiguration[0] === 'pinned')) {
          if (this._changesConfiguration[0] === 'color') {
            this.dispatchEvent('updateStyle', this.configuration.color);
          } else {
            this.dispatchEvent('updateMinimized', this.configuration.pinned);
          }
        } else {
          this._handleDone();
        }
      }
      this.getPluginParameters().then(this._processSetParameters)["catch"](ignore);
      return false;
    }
  }, {
    key: "_handleDetach",
    value: function _handleDetach() {
      this._handleDone();
      this._init = false;
    }
  }, {
    key: "_handleDone",
    value: function _handleDone() {
      if (!this._init) {
        return;
      }
      this._panel !== null && this.panel.remove();
      this._panel = null;
      this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
    }
  }, {
    key: "_handleError",
    value: function _handleError(reason) {
      console.log(reason);
    }
  }, {
    key: "_handleSendConfigurationUpdate",
    value: function _handleSendConfigurationUpdate() {
      this.sendMessage('sq.updateConfiguration')["catch"](ignore);
    }
  }, {
    key: "_handlePageinfoClick",
    value: function _handlePageinfoClick(e) {
      this._openCommonModule(e, 'pageinfo');
    }
  }, {
    key: "_handleDiagnosisClick",
    value: function _handleDiagnosisClick(e) {
      this._openCommonModule(e, 'diagnosis');
    }
  }, {
    key: "_handleDensityClick",
    value: function _handleDensityClick(e) {
      this._openCommonModule(e, 'density');
    }
  }, {
    key: "_handleRobotsClick",
    value: function _handleRobotsClick(e) {
      this.registerEvent('seobar2', 'robots');
    }
  }, {
    key: "_handleSitemapClick",
    value: function _handleSitemapClick(e) {
      this.registerEvent('seobar2', 'sitemap');
    }
  }, {
    key: "_handleLinkInternalClick",
    value: function _handleLinkInternalClick(e) {
      this._openCommonModule(e, 'internal');
    }
  }, {
    key: "_handleLinkExternalClick",
    value: function _handleLinkExternalClick(e) {
      this._openCommonModule(e, 'external');
    }
  }, {
    key: "_handleConfigurationClick",
    value: function _handleConfigurationClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.openConfiguration();
      this.registerEvent('seobar2', 'openConfigurationWindow');
    }
  }, {
    key: "handleCloseClick",
    value: function handleCloseClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.setDisabledState('seobar', true).then(this.processSendConfigurationUpdate)["catch"](ignore);
      this.registerEvent('seobar2', 'Close', 'Disable seobar');
    }
  }, {
    key: "handleExcludeClick",
    value: function handleExcludeClick(e) {
      var _this6 = this;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.registerEvent('seobar2', 'Close', 'Blacklist domain');
      if (document.location.host === '') {
        return;
      }
      var reg = '^http(s)?://' + document.location.host;
      this.getConfigurationItem('seobar.excludes').then(function (value) {
        var lines = value.split('\n');
        if (!lines.some(function (item) {
          return item === reg;
        })) {
          lines.push(reg);
          _this6.setConfigurationItem('seobar.excludes', lines.join('\n')).then(_this6.processSendConfigurationUpdate)["catch"](ignore);
        }
      })["catch"](ignore);
    }
  }, {
    key: "handleWhitelistLinkClick",
    value: function handleWhitelistLinkClick(e) {
      this.registerEvent('seobar2', 'Close', 'Configure whitelist');
      this.openConfiguration();
    }
  }, {
    key: "_handleIsBodyReady",
    value: function _handleIsBodyReady(resolve) {
      var _this7 = this;
      if (!document.body || document.body === null || document.body === undefined) {
        this._bodyReadyRepeats++;
        if (this._bodyReadyRepeats < this.MAX_BODY_WATING) {
          if (this._bodyReadyTimer !== null) {
            clearTimeout(this._bodyReadyTimer);
          }
          this._bodyReadyTimer = setTimeout(function () {
            return _this7._handleIsBodyReady(resolve);
          }, 100);
        } else {
          throw new Error('Body not ready in given time');
        }
      } else {
        resolve();
      }
    }
  }]);
}();
Seobar2Plugin.prototype.MAX_BODY_WATING = 100;
Seobar2Plugin.DEFAULT_CONFIGURATION = Object.assign({}, defaultConfig);
Seobar2Plugin.DEFAULT_EXCEPT = ['^http(s)?://google\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?/.*', '^http(s)?://.+?\\\.google\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?/.*', '^http(s)?://webcache\\\.googleusercontent\\\.com/.*', '^http(s)?://.+?\\\.yahoo\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?/.*', '^http(s)?://search\\\.yahoo\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?/search.*', '^http(s)?://.+?\\\.search\\\.yahoo\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?/search.*', '^http(s)?://.*?bing\\\.[a-z]{2,3}/search.*q=.+', '^http(s)?://.*?bing\\\.[a-z]{2,3}/', '^http(s)?://.*?baidu\\\.[a-z]{2,3}/s.*wd=.*', '^https://.*', '^http(s)?:\/\/(.*\\\.)?yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/.*', '^http(s)?:\/\/(.*\\\.)?ya\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/.*', '^http(s)?:\/\/blogs\.yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/search\\\.xml', '^http(s)?://.*?semrush\\\.[a-z]{2,3}/.*', '^http(s)?://.*?slack\\\.com/.*', '^http(s)?://.*?youtube\\\.com/.*'];
require('../utils/messengerModuleMixin')(Seobar2Plugin.prototype);
require('../utils/messengerTranslateMixin')(Seobar2Plugin.prototype);
require('../utils/eventsMixin')(Seobar2Plugin.prototype);
module.exports = Seobar2Plugin;

},{"../Lib":7,"../basePlugin/ErrorDisable":9,"../defaults/configuration":11,"../diagnosis/Diagnosis":13,"../lib/diffObjects":60,"../lib/ignore":63,"../lib/isEmpty":66,"../lib/isObject":68,"../lib/parseUri":71,"../page/PageDiagnosis":76,"../page/PageInfo":77,"../seobar/SeobarHorizontalBottom":102,"../seobar/SeobarHorizontalTop":104,"../seobar/SeobarVerticalLeft":106,"../seobar/SeobarVerticalRight":108,"../utils/XHRProxy":144,"../utils/eventsMixin":148,"../utils/messengerModuleMixin":151,"../utils/messengerTranslateMixin":152,"extend":164}],96:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var BaseSERPPlugin = require('../serpPlugin/BaseSERPPlugin');
var dom = require('../dom/main');
var IndexItem = require('../serpPlugin/IndexItem');
var lib = require('../Lib');
var Yahoo2Plugin = function (_BaseSERPPlugin) {
  function Yahoo2Plugin() {
    var _this;
    _classCallCheck(this, Yahoo2Plugin);
    _this = _callSuper(this, Yahoo2Plugin);
    _this.name = 'yahoo';
    _this.match = ['^http(s)?:\/\/search\.yahoo\.[a-z]{2,3}(\.[a-z]{2,3})?\/search.*$', '^http(s)?:\/\/.+\.search\.yahoo\.[a-z]{2,3}(\.[a-z]{2,3})?\/search.*$', '^https*:\/\/siteexplorer\.search\.yahoo\.com(\/[a-z]{0,2})?\/search.*$', '^https*:\/\/siteexplorer\.search\.yahoo\.com(\/[a-z]{0,2})?\/advsearch.*$'];
    _this._searchQuerySelector = 'input[name=p]';
    return _this;
  }
  _inherits(Yahoo2Plugin, _BaseSERPPlugin);
  return _createClass(Yahoo2Plugin, [{
    key: "controlPanelTop",
    get: function get() {
      var element = document.getElementById('ys');
      if (!element) {
        return _get(_getPrototypeOf(Yahoo2Plugin.prototype), "getControlPanelTop", this).call(this);
      }
      var _dom$getOffset = dom.getOffset(element),
        top = _dom$getOffset.top;
      top += element.offsetHeight;
      return top;
    }
  }, {
    key: "controlPanelOffsetTop",
    get: function get() {
      var result = 0;
      var topNav = document.getElementById('sticky-hd');
      if (topNav) {
        result += topNav.offsetHeight;
      }
      return result;
    }
  }, {
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.yahoo;
    }
  }, {
    key: "getStartPos",
    value: function getStartPos() {
      var startPos = lib.getVarValueFromURL(document.location.href, 'b');
      if (!startPos) {
        startPos = 0;
      }
      try {
        startPos = parseInt(startPos, 10);
      } catch (e) {
        startPos = 0;
      }
      if (startPos > 0) {
        startPos--;
      }
      return startPos;
    }
  }, {
    key: "addParametersPanels",
    value: function addParametersPanels() {
      var _this2 = this;
      var startPos = this.getStartPos();
      var selectors = 'div#main ol > li .compTitle.options-toggle';
      var elements = Array.from(document.querySelectorAll(selectors));
      elements.forEach(function (element, index) {
        var link = _this2._getLinkElement(element);
        if (!link) {
          return;
        }
        if (dom.hasClass(link, 'seoquake-params-link')) {
          return;
        }
        var url;
        if (dom.hasClass(link, 'ac-21th')) {
          url = Yahoo2Plugin.cleanUrl2(link.getAttribute('href'));
        } else {
          url = Yahoo2Plugin.cleanUrl(link.getAttribute('href'));
        }
        var urlHash = lib.shortHash(url);
        _this2.urls.set(urlHash, lib.parseUri(url));
        dom.attr(element, 'rel', urlHash);
        dom.attr(link, 'rel', urlHash + ' x_url');
        dom.addClass(link, 'seoquake-params-link');
        var paramsPanel = _this2.createParamsPanel(urlHash, null, true, index, ++startPos);
        if (element.tagName === 'TR') {
          var row = dom('tr', {
            className: element.className
          }, dom('td', {
            colspan: 100
          }, paramsPanel));
          _this2._parametersPanels.add(row);
          if (element.nextElementSibling) {
            element.parentNode.insertBefore(row, element.nextElementSibling);
          } else {
            element.parentNode.appendChild(row);
          }
          element.setAttribute('rel', urlHash);
        } else {
          _this2._parametersPanels.add(paramsPanel);
          element.appendChild(paramsPanel);
          if (element.tagName === 'LI') {
            element.setAttribute('rel', urlHash);
          } else {
            element.parentNode.setAttribute('rel', urlHash);
          }
        }
      });
      if (this._parametersPanels.size > 0) {
        this.processRequestUrls(this._requestUrls);
      }
      this.dispatchEvent('parametersPanelsReady');
    }
  }, {
    key: "addIndexes",
    value: function addIndexes() {
      var _this3 = this;
      if (this._resultIndexes.size > 0) {
        return;
      }
      var startPos = this.getStartPos();
      var selector = 'div#main ol > li';
      var elements = Array.from(document.querySelectorAll(selector));
      elements.forEach(function (element, index) {
        var link = _this3._getLinkElement(element);
        if (!link) {
          return;
        }
        var indexer = new IndexItem(index + startPos + 1);
        var placer = element.querySelector('h3 > a');
        if (placer) {
          placer.insertBefore(indexer.element, placer.firstChild);
          _this3._resultIndexes.add(indexer);
        }
      });
    }
  }, {
    key: "runSERPTool",
    value: function runSERPTool() {
      var _this4 = this;
      var data = {
        serp: this.name,
        query: this.searchQuery,
        links: []
      };
      var selector = 'div#main ol > li';
      var elements = Array.from(document.querySelectorAll(selector));
      elements.forEach(function (element) {
        var link = _this4._getLinkElement(element);
        if (!link) {
          return;
        }
        var url;
        if (dom.hasClass(link, 'ac-21th')) {
          url = Yahoo2Plugin.cleanUrl2(link.getAttribute('href'));
        } else {
          url = Yahoo2Plugin.cleanUrl(link.getAttribute('href'));
        }
        data.links.push([url, dom.text(link)]);
      });
      this._sendMessage('sq.moduleRun', {
        name: 'serptool',
        configuration: data
      });
    }
  }, {
    key: "getElements",
    value: function getElements(params) {
      var elements = {
        container: null,
        items: []
      };
      for (var i = 0, l = params.length; i < l; i++) {
        var row = document.querySelector('li[rel="' + params[i].urlHash + '"], tr[rel="' + params[i].urlHash + '"]');
        if (!row) {
          continue;
        }
        elements.items.push(row);
        if (row.nextElementSibling && (row.nextElementSibling.tagName !== 'LI' || !row.nextElementSibling.hasAttribute('rel'))) {
          elements.items.push(row.nextSibling);
        }
        if (!elements.container) {
          elements.container = row.parentNode;
        }
      }
      return elements;
    }
  }, {
    key: "putElements",
    value: function putElements(elements) {
      var counter = -1;
      elements.items.forEach(function (element) {
        elements.container.appendChild(element);
        if (element.tagName === 'TR') {
          if (element.hasAttribute('rel')) {
            counter++;
          }
          element.setAttribute('class', counter % 2 === 0 ? '' : 'alt');
        }
      });
    }
  }, {
    key: "_getLinkElement",
    value: function _getLinkElement(element) {
      if (element.getAttribute('data-bns')) {
        return null;
      }
      return element.querySelector('a.yschttl, div.hd a, span.result > a, a.ac-21th, .compTitle.options-toggle > a');
    }
  }, {
    key: "getDataLines",
    value: function getDataLines() {
      var _this5 = this;
      var paramsEls = Array.from(document.querySelectorAll('.seoquake-params-link'));
      var data = [];
      var index = 1;
      paramsEls.forEach(function (element) {
        var rel = _this5.parseRelAttr(element.getAttribute('rel'));
        if (!rel) {
          return;
        }
        var parameters = Array.from(document.querySelectorAll('[rel^="' + rel.urlHash + '"]'));
        var url;
        if (dom.hasClass(element, 'ac-21th') !== -1) {
          url = Yahoo2Plugin.cleanUrl2(element.getAttribute('href'));
        } else {
          url = Yahoo2Plugin.cleanUrl(element.getAttribute('href'));
        }
        var line = [BaseSERPPlugin.convertDataLine(index.toString()), BaseSERPPlugin.convertDataLine(url)];
        parameters.forEach(function (parameter) {
          var rel = _this5.parseRelAttr(parameter.getAttribute('rel'));
          if (!rel) {
            return;
          }
          var requestObject = _this5._requestUrls.get(rel.requestUrlHash);
          if (requestObject && requestObject.values.hasOwnProperty(rel.paramId)) {
            line.push(BaseSERPPlugin.convertDataLine(requestObject.values[rel.paramId]));
          }
        });
        if (line.length > 0) {
          data.push(line.join(';'));
          index++;
        }
      });
      return data;
    }
  }, {
    key: "doHighlightSites",
    value: function doHighlightSites(strHighlightSites, strHighlightSitesColor) {
      var hs = strHighlightSites.split(/\n/i);
      if (hs.length > 0) {
        var serpLinks = Array.from(document.querySelectorAll('a.yschttl, div.hd a, span.result > a, a.ac-21th'));
        serpLinks.forEach(function (el) {
          var theHref;
          if (dom.hasClass(el, 'seoquake-parameter-button')) {
            return false;
          }
          if (dom.hasClass(el, 'ac-21th') !== -1) {
            theHref = Yahoo2Plugin.cleanUrl2(el.getAttribute('href'));
          } else {
            theHref = Yahoo2Plugin.cleanUrl(el.getAttribute('href'));
          }
          return hs.every(function (item) {
            if (item === '') {
              return true;
            }
            try {
              var theHs = '^http(s)?:\/\/[^\/]*(\.)?' + item.replace(/\s|\t/g, '').replace(/\./g, '\\.').replace(/\*/g, '.*') + '.*$';
              var re = new RegExp(theHs, 'i');
              if (theHref.match(re)) {
                el.style.backgroundColor = strHighlightSitesColor;
              }
            } catch (e) {
              return false;
            }
            return true;
          });
        });
      }
    }
  }, {
    key: "doUnhighlightSites",
    value: function doUnhighlightSites(strHighlightSites) {
      this.doHighlightSites(strHighlightSites, '');
    }
  }], [{
    key: "cleanUrl",
    value: function cleanUrl(url) {
      var foo = url.match(/\*{2}(.*)/i);
      if (foo) {
        url = decodeURI(foo[1]);
      }
      return url;
    }
  }, {
    key: "cleanUrl2",
    value: function cleanUrl2(url) {
      var matches = url.match(/\/RU=([^\/]+)\//i);
      if (matches !== null && matches.length > 1) {
        return decodeURIComponent(matches[1]);
      }
      return url;
    }
  }]);
}(BaseSERPPlugin);
module.exports = Yahoo2Plugin;

},{"../Lib":7,"../dom/main":33,"../serpPlugin/BaseSERPPlugin":118,"../serpPlugin/IndexItem":121}],97:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var BaseSERPPlugin = require('../serpPlugin/BaseSERPPlugin');
var dom = require('../dom/main');
var IndexItem = require('../serpPlugin/IndexItem');
var lib = require('../Lib');
var ignore = require('../lib/ignore');
var Yandex2Plugin = function (_BaseSERPPlugin) {
  function Yandex2Plugin() {
    var _this;
    _classCallCheck(this, Yandex2Plugin);
    _this = _callSuper(this, Yandex2Plugin);
    _this.name = 'yandex';
    _this.match = ['http(s)?:\/\/.*yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/yandsearch.*', 'http(s)?:\/\/.*yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/yandpage.*', 'http(s)?:\/\/blogs\.yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/search\\\.xml', 'http(s)?:\/\/.*yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?\/search/.*'];
    _this.exclude = ['http(s)?:\/\/news\\\.yandex\\\.[a-z]{2,3}(\\\.[a-z]{2,3})?.*'];
    _this._searchQuerySelector = 'input[name=text]';
    _this.observerDivMain = null;
    _this.observeDivMain = _this.handleObserveDivMain.bind(_this);
    _this.processSearchChange = _this.handleSearchChange.bind(_this);
    _this.processAfterConfigurationUpdated = _this.handleAfterConfigurationUpdated.bind(_this);
    return _this;
  }
  _inherits(Yandex2Plugin, _BaseSERPPlugin);
  return _createClass(Yandex2Plugin, [{
    key: "controlPanelTop",
    get: function get() {
      var element = document.querySelector('body > .serp-header > .serp-header__wrapper');
      if (!element) {
        return _get(_getPrototypeOf(Yandex2Plugin.prototype), "getControlPanelTop", this).call(this);
      }
      var _dom$getOffset = dom.getOffset(element),
        top = _dom$getOffset.top;
      top += element.offsetHeight + 60;
      return top;
    }
  }, {
    key: "controlPanelOffsetTop",
    get: function get() {
      var result = 0;
      var topNav = document.querySelector('body > .serp-header > .serp-header__wrapper');
      if (topNav) {
        result += topNav.offsetHeight + 60;
      }
      return result;
    }
  }, {
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.yandex;
    }
  }, {
    key: "run",
    value: function run() {
      _get(_getPrototypeOf(Yandex2Plugin.prototype), "run", this).call(this);
      if (this._isRunning) {
        this.addEventListener('afterConfigurationUpdated', this.processAfterConfigurationUpdated);
        if (!this.configuration.core.disabled && !this.pluginConfiguration.disabled) {
          this.addDOMObservers();
        }
      }
    }
  }, {
    key: "getStartPos",
    value: function getStartPos(length) {
      var startPos = lib.getVarValueFromURL(document.location.href, 'p');
      if (!startPos) {
        startPos = 0;
      }
      try {
        startPos = parseInt(startPos, 10);
      } catch (e) {
        startPos = 0;
      }
      return startPos * length;
    }
  }, {
    key: "getSERPElements",
    value: function getSERPElements() {
      var selectors = 'div.serp-block div.serp-item_plain_yes,' + 'li.b-serp-item,' + 'div.SearchStatistics-item,' + 'div.serp-item,' + 'li.serp-item,' + 'div.serp-block div.organic';
      return Array.from(document.querySelectorAll(selectors)).filter(Yandex2Plugin.filterSERPElement);
    }
  }, {
    key: "getSERPElementLink",
    value: function getSERPElementLink(element, evenSeoquake) {
      evenSeoquake = evenSeoquake || false;
      if (dom.hasClass(element, 'serp-adv__item') || dom.hasClass(element, 'serp-adv-item') || dom.hasClass(element, 'z-market') || dom.hasClass(element, 'z-companies')) {
        return false;
      }
      var link = element.querySelector('a.serp-item__title-link, a.b-serp-item__title-link, a.SearchStatistics-link, a.organic__url');
      if (!link) {
        return false;
      }
      if (!evenSeoquake && dom.hasClass(link, 'seoquake-params-link')) {
        return false;
      }
      return link;
    }
  }, {
    key: "addParametersPanels",
    value: function addParametersPanels() {
      var _this2 = this;
      var elements = this.getSERPElements();
      var startPos = this.getStartPos(elements.length);
      elements.forEach(function (element, index) {
        var link = _this2.getSERPElementLink(element);
        if (!link) {
          return;
        }
        var urlHash = lib.shortHash(link.href);
        _this2.urls.set(urlHash, lib.parseUri(link.href));
        element.setAttribute('rel', urlHash);
        link.setAttribute('rel', urlHash + ' x_url');
        dom.addClass(link, 'seoquake-params-link');
        var paramsPanel = _this2.createParamsPanel(urlHash, null, true, index, ++startPos);
        _this2._parametersPanels.add(paramsPanel);
        element.appendChild(paramsPanel);
      });
      if (this._parametersPanels.size > 0) {
        this.processRequestUrls(this._requestUrls);
      }
      this.dispatchEvent('parametersPanelsReady');
    }
  }, {
    key: "addIndexes",
    value: function addIndexes() {
      var _this3 = this;
      if (this._resultIndexes.size > 0) {
        return;
      }
      var elements = this.getSERPElements();
      var startPos = this.getStartPos(elements.length);
      elements.forEach(function (element, index) {
        var indexer = new IndexItem(index + startPos + 1);
        var placer = element.querySelector('h2 a');
        placer.insertBefore(indexer.element, placer.lastChild);
        _this3._resultIndexes.add(indexer);
      });
    }
  }, {
    key: "runSERPTool",
    value: function runSERPTool() {
      var _this4 = this;
      var data = {
        serp: this.name,
        query: this.searchQuery,
        links: []
      };
      var elements = this.getSERPElements();
      elements.forEach(function (element) {
        var link = _this4.getSERPElementLink(element, true);
        if (!link) {
          return;
        }
        data.links.push([link.href, dom.text(link)]);
      });
      this._sendMessage('sq.moduleRun', {
        name: 'serptool',
        configuration: data
      });
    }
  }, {
    key: "getElements",
    value: function getElements(params) {
      var elements = {
        container: null,
        items: []
      };
      for (var i = 0; i < params.length; i++) {
        var row = document.querySelector('li[rel="' + params[i].urlHash + '"]');
        if (!row) {
          continue;
        }
        elements.items.push(row);
        if (row.nextElementSibling) {
          if (!dom.hasClass(row.nextElementSibling, 'b_pag') && !dom.hasClass(row.nextElementSibling, 'b_msg') && !dom.hasClass(row.nextElementSibling, 'b_ans')) {
            if (row.nextElementSibling.tagName !== 'LI' || !row.nextElementSibling.hasAttribute('rel')) {
              elements.items.push(row.nextSibling);
            }
          }
        }
        if (!elements.container) {
          elements.container = row.parentNode;
        }
      }
      return elements;
    }
  }, {
    key: "addDOMObservers",
    value: function addDOMObservers() {
      this.observerDivMain = new MutationObserver(this.observeDivMain);
      this.observerDivMain.observe(document.querySelector('div.main__content'), {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "removeDOMObservers",
    value: function removeDOMObservers() {
      if (this.observerDivMain !== null) {
        this.observerDivMain.disconnect();
        this.observerDivMain = null;
      }
    }
  }, {
    key: "addControlPanel",
    value: function addControlPanel() {
      _get(_getPrototypeOf(Yandex2Plugin.prototype), "addControlPanel", this).call(this);
      if (this._controlPanel !== null) {
        var leftMenu = document.querySelector('.main__left');
        if (leftMenu) {
          if (dom.hasClass(leftMenu, 'main__left_fixed_yes')) {
            dom.css(leftMenu, 'position', 'absolute');
          }
          var content = document.querySelector('.main__center');
          if (content) {
            dom.css(content, 'margin-left', '120px');
          }
        }
      }
    }
  }, {
    key: "removeControlPanel",
    value: function removeControlPanel() {
      _get(_getPrototypeOf(Yandex2Plugin.prototype), "removeControlPanel", this).call(this);
      if (this._controlPanel === null) {
        var leftMenu = document.querySelector('.main__left');
        if (leftMenu) {
          if (dom.hasClass(leftMenu, 'main__left_fixed_yes')) {
            dom.css(leftMenu, 'position', null);
          }
          var content = document.querySelector('.main__center');
          if (content) {
            dom.css(content, 'margin-left', null);
          }
        }
      }
    }
  }, {
    key: "handleObserveDivMain",
    value: function handleObserveDivMain(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.target.tagName === 'DIV' && mutation.target.className === 'main__content') {
          setTimeout(this.processSearchChange, 500);
          break;
        }
      }
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange() {
      if (!this._isRunning) {
        return;
      }
      this.removeControlPanel();
      this.removeParametersPanels();
      this.removeIndexes();
      this.doUnhighlightSites(this.configuration.core.highlight_sites);
      this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
      if (!this.configuration.core.disabled) {
        this.addControlPanel();
        if (!this.pluginConfiguration.disabled) {
          this.addParametersPanels();
          if (!this.configuration.core.disable_serps_pos_numbers) {
            this.addIndexes();
          }
          if (!this.configuration.core.disable_highlight_sites) {
            this.doHighlightSites(this.configuration.core.highlight_sites, this.configuration.core.highlight_sites_color);
          }
        }
      }
    }
  }, {
    key: "handleDetach",
    value: function handleDetach() {
      this.removeDOMObservers();
      _get(_getPrototypeOf(Yandex2Plugin.prototype), "handleDetach", this).call(this);
    }
  }, {
    key: "handleAfterConfigurationUpdated",
    value: function handleAfterConfigurationUpdated(changes) {
      if (!this._isRunning) {
        return;
      }
      if (changes.length === 0) {
        return;
      }
      if (this.configuration.core.disabled) {
        this.removeDOMObservers();
      } else {
        if (!this.pluginConfiguration.disabled) {
          this.addDOMObservers();
        }
      }
    }
  }], [{
    key: "filterSERPElement",
    value: function filterSERPElement(item) {
      if (item.tagName.toLowerCase() === 'li') {
        return !dom.hasClass(item, 'serp-adv-item') && !Yandex2Plugin.isAd(item) && item.querySelector('div.organic');
      } else {
        return false;
      }
    }
  }, {
    key: "isAd",
    value: function isAd(item) {
      return item.querySelector('.label.label_color_yellow') || Object.keys(item.dataset).length > 3;
    }
  }]);
}(BaseSERPPlugin);
module.exports = Yandex2Plugin;

},{"../Lib":7,"../dom/main":33,"../lib/ignore":63,"../serpPlugin/BaseSERPPlugin":118,"../serpPlugin/IndexItem":121}],98:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var isEmpty = require('../lib/isEmpty');
var SemrushApi = function () {
  function SemrushApi() {
    _classCallCheck(this, SemrushApi);
  }
  return _createClass(SemrushApi, [{
    key: "_simpleRequest",
    value: function _simpleRequest(data) {
      return this.sendMessage('sq.semrushRequest', data).then(function (result) {
        if (!isEmpty(result, 'error')) {
          throw new Error(result.error);
        }
        if (!isEmpty(result, 'data')) {
          return result.data;
        }
        return true;
      });
    }
  }, {
    key: "logout",
    value: function logout() {
      this.sendMessage('sq.semrushRequest', {
        action: 'logout'
      });
    }
  }, {
    key: "getAccountData",
    value: function getAccountData() {
      return this._simpleRequest({
        action: 'getUser'
      });
    }
  }, {
    key: "getIsConnected",
    value: function getIsConnected() {
      return this._simpleRequest({
        action: 'isConnected'
      });
    }
  }, {
    key: "getBillingData",
    value: function getBillingData() {
      return this._simpleRequest({
        action: 'getBillingData'
      });
    }
  }, {
    key: "getProjectsList",
    value: function getProjectsList(cached) {
      var action = cached === undefined ? 'getCachedProjectsList' : 'getProjectsList';
      return this._simpleRequest({
        action: action
      }).then(function (result) {
        if (!isEmpty(result, 'projects')) {
          return result.projects;
        } else {
          throw 'Wrong answer';
        }
      });
    }
  }, {
    key: "getPageAudit",
    value: function getPageAudit(project, page) {
      return this._simpleRequest({
        action: 'getPageAudit',
        project: project,
        page: page
      });
    }
  }, {
    key: "getBacklinks",
    value: function getBacklinks(type, target) {
      return this.sendMessage('sq.semrushRequest', {
        action: 'getBacklinks',
        type: type,
        target: target
      }).then(function (result) {
        if (!isEmpty(result, 'error')) {
          result.url = target;
          return result;
        }
        if (!isEmpty(result, 'data')) {
          var answer = result.data;
          answer.url = target;
          return answer;
        }
        return true;
      });
    }
  }, {
    key: "getTrafficAnalytics",
    value: function getTrafficAnalytics(target, isSubdomain) {
      if (target === '' || target === undefined) {
        return Promise.reject(new Error('No required parameter'));
      }
      return this._simpleRequest({
        action: 'getTrafficAnalytics',
        q: target,
        s: isSubdomain ? 'subdomain' : 'domain'
      });
    }
  }, {
    key: "getNotesList",
    value: function getNotesList(dateFrom, dateTo) {
      if (!(dateFrom instanceof Date) || !(dateTo instanceof Date)) {
        return Promise.reject(new Error('Date range should be Date'));
      }
      return this._simpleRequest({
        action: 'getNotesList',
        from: dateFrom.toISOString(),
        to: dateTo.toISOString()
      });
    }
  }]);
}();
require('../utils/messengerMixin')(SemrushApi.prototype);
module.exports = SemrushApi;

},{"../lib/isEmpty":66,"../utils/messengerMixin":150}],99:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var eventsMixin = require('../utils/eventsMixin');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var ignore = require('../lib/ignore');
var isEmpty = require('../lib/isEmpty');
var XHRProxyEx = require('../utils/XHRProxyEx');
var SemrushFeedback = function () {
  function SemrushFeedback() {
    _classCallCheck(this, SemrushFeedback);
    this._element = null;
    this._link = null;
    this._textarea = null;
    this._submit = null;
    this._message = null;
    this._isInit = false;
    this._isFormVisible = false;
    this._isSending = false;
    this.processLinkClick = this.handleLinkClick.bind(this);
    this.processSubmitClick = this.handleSubmitClick.bind(this);
    this.processRequestDone = this.handleRequestDone.bind(this);
    this.processRequestTimeout = this.handleRequestTimeout.bind(this);
    this.processTextChange = this.handleTextChange.bind(this);
  }
  return _createClass(SemrushFeedback, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (this._isInit) {
        return;
      }
      this._element = dom('div', {
        className: 'seoquake-semrush-feedback'
      });
      this._link = dom('a', {
        className: 'seoquake-semrush-feedback-link'
      }, this.t('sqSemrush_feedback_link'));
      this._textarea = dom('textarea', {
        className: 'seoquake-semrush-feedback-text'
      });
      this._submit = dom('button', {
        className: 'seoquake-semrush-feedback-submit'
      }, this.t('sqSemrush_feedback_submit'));
      this._message = dom('p', {
        className: 'seoquake-semrush-feedback-message'
      }, '');
      this._element.appendChild(this._link);
      this._element.appendChild(this._textarea);
      this._element.appendChild(this._submit);
      this._element.appendChild(this._message);
      this.t('sqSemrush_feedback_text_placeholder').then(function (text) {
        return dom.attr(_this._textarea, 'placeholder', text);
      })["catch"](ignore);
      this._link.addEventListener('click', this.processLinkClick, true);
      this._submit.addEventListener('click', this.processSubmitClick, true);
      this._textarea.addEventListener('keyup', this.processTextChange, true);
      this._textarea.addEventListener('change', this.processTextChange, true);
      this.hideMessage();
      this._isInit = true;
    }
  }, {
    key: "showForm",
    value: function showForm() {
      if (this._isFormVisible) {
        return;
      }
      this.hideMessage();
      dom.addClass(this._element, 'seoquake-semrush-feedback_formvisible');
      this.handleTextChange();
      this._isFormVisible = true;
      this.dispatchEvent('show');
    }
  }, {
    key: "hideForm",
    value: function hideForm() {
      if (!this._isFormVisible) {
        return;
      }
      dom.removeClass(this._element, 'seoquake-semrush-feedback_formvisible');
      this._isFormVisible = false;
      this.dispatchEvent('hide');
    }
  }, {
    key: "showMessage",
    value: function showMessage(message) {
      dom.text(this._message, message);
      dom.css(this._message, 'display', 'block');
      this.dispatchEvent('showMessage');
    }
  }, {
    key: "hideMessage",
    value: function hideMessage() {
      dom.css(this._message, 'display', 'none');
    }
  }, {
    key: "sendForm",
    value: function sendForm() {
      if (this._isSending) {
        return false;
      }
      var text = String(dom.value(this._textarea)).trim();
      if (isEmpty(text)) {
        return false;
      }
      var requestData = new Map();
      requestData.set('text', text);
      requestData.set('client', window.navigator.userAgent);
      requestData.set('version', '3.13.4');
      this._isSending = true;
      var request = new XHRProxyEx();
      request.setMessenger(this.getMessenger());
      request.callback = this.processRequestDone;
      request.timeoutCallback = this.processRequestTimeout;
      request.send(SemrushFeedback.FEEDBACK_URL, 'post', requestData);
      return true;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this.hideForm();
      this._link.removeEventListener('click', this.processLinkClick, true);
      this._textarea.removeEventListener('keyup', this.processTextChange, true);
      this._textarea.removeEventListener('change', this.processTextChange, true);
      dom.removeElement(this._submit);
      this._submit = null;
      dom.removeElement(this._link);
      this._link = null;
      dom.removeElement(this._textarea);
      this._textarea = null;
      dom.removeElement(this._element);
      this._element = null;
      this._isInit = false;
    }
  }, {
    key: "handleLinkClick",
    value: function handleLinkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this._isFormVisible) {
        this.hideForm();
      } else {
        this.showForm();
      }
    }
  }, {
    key: "handleSubmitClick",
    value: function handleSubmitClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!this._isSending && this.sendForm()) {
        dom.value(this._textarea, '');
        this.hideForm();
        this.dispatchEvent('send');
      }
    }
  }, {
    key: "handleRequestDone",
    value: function handleRequestDone() {
      var _this2 = this;
      this.t('sqSemrush_feedback_success').then(function (text) {
        return _this2.showMessage(text);
      })["catch"](ignore);
      this._isSending = false;
    }
  }, {
    key: "handleRequestTimeout",
    value: function handleRequestTimeout() {
      this._isSending = false;
    }
  }, {
    key: "handleTextChange",
    value: function handleTextChange() {
      var value = dom.value(this._textarea);
      if (isEmpty(value)) {
        dom.attr(this._submit, 'disabled', true);
      } else {
        dom.attr(this._submit, 'disabled', null);
      }
    }
  }]);
}();
SemrushFeedback.FEEDBACK_URL = 'https://www.seoquake.com/review/panel.php';
eventsMixin(SemrushFeedback.prototype);
messengerTranslateMixin(SemrushFeedback.prototype);
module.exports = SemrushFeedback;

},{"../dom/main":33,"../lib/ignore":63,"../lib/isEmpty":66,"../utils/XHRProxyEx":145,"../utils/eventsMixin":148,"../utils/messengerTranslateMixin":152}],100:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var ignore = require('../lib/ignore');
var SeobarBase = function () {
  function SeobarBase(plugin) {
    _classCallCheck(this, SeobarBase);
    this._plugin = plugin;
    this._changedElements = new Map();
    this._mozbarObserver = null;
    this._positionCorrected = false;
    this.processBodyChange = this.handleBodyChange.bind(this);
  }
  return _createClass(SeobarBase, [{
    key: "plugin",
    get: function get() {
      return this._plugin;
    }
  }, {
    key: "render",
    value: function render() {}
  }, {
    key: "initMozbarIntegration",
    value: function initMozbarIntegration() {
      if (document.body.className.indexOf('mozbar-margin-') !== -1) {
        this.integrateWithMozBar();
      }
      this._mozbarObserver = new MutationObserver(this.processBodyChange);
      this._mozbarObserver.observe(document.body, {
        childList: true,
        subtree: false,
        attributes: true
      });
    }
  }, {
    key: "_fixElements",
    value: function _fixElements() {
      var elements = Array.from(document.querySelectorAll('[' + SeobarBase.ATTRSTYLE + ']'));
      elements.forEach(function (element) {
        var changes = JSON.parse(dom.data(element, SeobarBase.ATTRSTYLE));
        if (changes.hasOwnProperty('css')) {
          dom.css(element, changes.css);
        }
        dom.data(element, SeobarBase.ATTRID, null);
        dom.data(element, SeobarBase.ATTRSTYLE, null);
      });
    }
  }, {
    key: "_storeElement",
    value: function _storeElement(element, changes) {
      try {
        if (dom.data(element, SeobarBase.ATTRID)) {
          changes = JSON.parse(dom.data(element, SeobarBase.ATTRSTYLE));
        } else {
          dom.data(element, SeobarBase.ATTRSTYLE, JSON.stringify(changes));
        }
      } catch (error) {
        ignore(error);
      }
      this._changedElements.set(element, {
        css: changes
      });
      dom.data(element, SeobarBase.ATTRID, this._plugin.UUID);
    }
  }, {
    key: "_restoreElement",
    value: function _restoreElement(element, changes) {
      if (dom.data(element, SeobarBase.ATTRID) !== this._plugin.UUID) {
        return;
      }
      if (changes.hasOwnProperty('css')) {
        dom.css(element, changes.css);
      }
      dom.data(element, SeobarBase.ATTRID, null);
      dom.data(element, SeobarBase.ATTRSTYLE, null);
    }
  }, {
    key: "_restoreElements",
    value: function _restoreElements() {
      var _this = this;
      this._changedElements.forEach(function (changes, element) {
        return _this._restoreElement(element, changes);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._mozbarObserver !== null) {
        this._mozbarObserver.disconnect();
        this._mozbarObserver = null;
      }
      this._restoreElements();
    }
  }, {
    key: "integrateWithMozBar",
    value: function integrateWithMozBar() {
      if (!this._positionCorrected) {
        this._positionCorrected = true;
      }
    }
  }, {
    key: "disintegrateWithMozBar",
    value: function disintegrateWithMozBar() {
      if (this._positionCorrected) {
        this._positionCorrected = false;
      }
    }
  }, {
    key: "handleBodyChange",
    value: function handleBodyChange(mutations) {
      if (document.body.className.indexOf('mozbar-margin-') !== -1) {
        this.integrateWithMozBar();
      } else {
        this.disintegrateWithMozBar();
      }
    }
  }]);
}();
SeobarBase.ATTRID = 'squuid';
SeobarBase.ATTRSTYLE = 'sqstyle';
module.exports = SeobarBase;

},{"../dom/main":33,"../lib/ignore":63}],101:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var Dropdown = require('../effects/Dropdown');
var extend = require('extend');
var dom = require('../dom/main');
var PillsSwitch = require('../effects/PillsSwitch');
var ParametersCheckboxes = require('../parameters/ParametersCheckboxes');
var ignore = require('../lib/ignore');
var isEmpty = require('../lib/isEmpty');
var SeobarConfigureMenu = function (_Dropdown) {
  function SeobarConfigureMenu(base, container, config) {
    var _this;
    _classCallCheck(this, SeobarConfigureMenu);
    config = extend(true, {}, SeobarConfigureMenu.DEFAULT_CONFIG, config);
    _this = _callSuper(this, SeobarConfigureMenu, [container, config]);
    _this._base = base;
    _this._colorThemePills = null;
    _this._positionPills = null;
    _this._parameters = null;
    _this._configurationLink = null;
    _this._processParametersUpdate = _this._handleParametersUpdate.bind(_this);
    _this._processPositionUpdate = _this._handlePositionUpdate.bind(_this);
    _this._processColorUpdate = _this._handleColorUpdate.bind(_this);
    _this._processConfigurationClick = _this._handleConfigurationClick.bind(_this);
    return _this;
  }
  _inherits(SeobarConfigureMenu, _Dropdown);
  return _createClass(SeobarConfigureMenu, [{
    key: "position",
    value: function position() {
      var result = {
        position: null
      };
      if (!isEmpty(this.config.positionCorrection, 'left')) {
        result.left = this.config.positionCorrection.left + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'right')) {
        result.right = this.config.positionCorrection.right + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'top')) {
        result.top = this.config.positionCorrection.top + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'bottom')) {
        result.bottom = this.config.positionCorrection.bottom + 'px';
      }
      dom.css(this._body, result);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(SeobarConfigureMenu.prototype), "init", this).call(this);
      this._colorThemePills = new PillsSwitch();
      this._colorThemePills.title = 'Color theme';
      this._colorThemePills.setItem('white', 'Light');
      this._colorThemePills.setItem('green', 'Dark');
      this._colorThemePills.addEventListener('switched', this._processColorUpdate);
      this.t('sqSeobar2_configuration_color').then(function (text) {
        return _this2._colorThemePills.title = text;
      });
      this.t('sqSeobar2_configuration_color_light').then(function (text) {
        return _this2._colorThemePills.setItem('white', text);
      });
      this.t('sqSeobar2_configuration_color_dark').then(function (text) {
        return _this2._colorThemePills.setItem('green', text);
      });
      this._positionPills = new PillsSwitch();
      this._positionPills.title = 'Position SEObar';
      this._positionPills.setItem('top', 'Top horizontal');
      this._positionPills.setItem('bottom', 'Bottom horizontal');
      this._positionPills.setItem('left', 'Left vertical');
      this._positionPills.setItem('right', 'Right vertical');
      this._positionPills.addEventListener('switched', this._processPositionUpdate);
      this.t('sqSeobar2_configuration_position').then(function (text) {
        return _this2._positionPills.title = text;
      });
      this.t('sqSeobar2_configuration_position_top').then(function (text) {
        return _this2._positionPills.setItem('top', text);
      });
      this.t('sqSeobar2_configuration_position_bottom').then(function (text) {
        return _this2._positionPills.setItem('bottom', text);
      });
      this.t('sqSeobar2_configuration_position_left').then(function (text) {
        return _this2._positionPills.setItem('left', text);
      });
      this.t('sqSeobar2_configuration_position_right').then(function (text) {
        return _this2._positionPills.setItem('right', text);
      });
      this.body.appendChild(dom('div', {
        className: 'sqseobar2-configuration-top'
      }, [this._colorThemePills.element, this._positionPills.element]));
      this._parameters = new ParametersCheckboxes('seobar');
      this._parameters.setTranslateFunction(this.getTranslateFunction());
      this._parameters.init();
      this._parameters.addEventListener('userUpdated', this._processParametersUpdate);
      this._parameters.element = null;
      var parametersTitle = dom('div', {
        className: 'sqseobar2-configuration-title'
      }, 'Parameters');
      this.t('sqSeobar2_configuration_parameters_title').then(function (text) {
        return dom.text(parametersTitle, text);
      });
      this.body.appendChild(parametersTitle);
      this.body.appendChild(this._parameters.element);
      this._configurationLink = dom('a', {
        className: 'sqseobar2-configuration-configuration-link'
      }, 'More settings');
      this.t('sqSeobar2_configuration_more_settings').then(function (text) {
        return dom.text(_this2._configurationLink, text);
      });
      this._configurationLink.addEventListener('click', this._processConfigurationClick);
      this.body.appendChild(this._configurationLink);
    }
  }, {
    key: "show",
    value: function show() {
      var _this3 = this;
      this._colorThemePills.currentItem = this._base.plugin.configuration.color;
      this._positionPills.currentItem = this._base.plugin.configuration.position;
      this._base.plugin.getParameters().then(function (p) {
        return _this3._parameters.value = p;
      })["catch"](ignore);
      _get(_getPrototypeOf(SeobarConfigureMenu.prototype), "show", this).call(this);
      dom.addClass(this.container, 'sqseobar2-button-down');
      dom.addClass(this._base.panel.element, 'sqseobar2-fixed');
    }
  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(SeobarConfigureMenu.prototype), "hide", this).call(this);
      dom.removeClass(this.container, 'sqseobar2-button-down');
      dom.removeClass(this._base.panel.element, 'sqseobar2-fixed');
    }
  }, {
    key: "remove",
    value: function remove() {
      this.hide();
      this._colorThemePills.remove();
      this._colorThemePills = null;
      this._positionPills.remove();
      this._positionPills = null;
      _get(_getPrototypeOf(SeobarConfigureMenu.prototype), "remove", this).call(this);
    }
  }, {
    key: "_handleParametersUpdate",
    value: function _handleParametersUpdate() {
      var _this4 = this;
      this._base.plugin.setParameters(this._parameters.value).then(function () {
        _this4._base.plugin.sendMessage('sq.updateConfiguration')["catch"](ignore);
      })["catch"](ignore);
    }
  }, {
    key: "_handlePositionUpdate",
    value: function _handlePositionUpdate() {
      var plugin = this._base.plugin;
      plugin.switchPosition(this._positionPills.currentItem);
      plugin.registerEvent('seobar2', 'configureSwitch-Position', this._positionPills.currentItem);
    }
  }, {
    key: "_handleColorUpdate",
    value: function _handleColorUpdate() {
      var plugin = this._base.plugin;
      plugin.switchColor(this._colorThemePills.currentItem);
      plugin.registerEvent('seobar2', 'configureSwitch-Color', this._colorThemePills.currentItem);
    }
  }, {
    key: "_handleConfigurationClick",
    value: function _handleConfigurationClick(event) {
      event.preventDefault();
      event.stopPropagation();
      var plugin = this._base.plugin;
      plugin.openConfiguration();
      plugin.registerEvent('seobar2', 'openConfigurationWindow', 'menu');
    }
  }]);
}(Dropdown);
require('../utils/translateMixin')(SeobarConfigureMenu.prototype);
SeobarConfigureMenu.DEFAULT_CONFIG = {
  containerClass: 'sqseobar2-configuration-dropdown',
  toggle: true
};
module.exports = SeobarConfigureMenu;

},{"../dom/main":33,"../effects/Dropdown":43,"../effects/PillsSwitch":49,"../lib/ignore":63,"../lib/isEmpty":66,"../parameters/ParametersCheckboxes":85,"../utils/translateMixin":154,"extend":164}],102:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarBase = require('./SeobarBase');
var dom = require('../dom/main');
var HintBox = require('../effects/HintBox');
var SeobarHorizontalPanel = require('./SeobarHorizontalPanel');
var ignore = require('../lib/ignore');
var SeobarHorizontalBottom = function (_SeobarBase) {
  function SeobarHorizontalBottom(plugin) {
    var _this;
    _classCallCheck(this, SeobarHorizontalBottom);
    _this = _callSuper(this, SeobarHorizontalBottom, [plugin]);
    _this._panel = null;
    _this._configurationMenuPosition = {
      left: null,
      bottom: 40,
      right: 40,
      top: null
    };
    _this._hideMenuPosition = {
      left: null,
      bottom: 40,
      right: 0,
      top: null
    };
    _this._scrollCorrectedElements = new Set();
    _this._processScrollEvent = _this._handleScrollEvent.bind(_this);
    _this._processResizeEvent = _this._handleResizeEvent.bind(_this);
    _this.processBodyChange = _this.handleBodyChange.bind(_this);
    return _this;
  }
  _inherits(SeobarHorizontalBottom, _SeobarBase);
  return _createClass(SeobarHorizontalBottom, [{
    key: "configurationMenuPosition",
    get: function get() {
      return this._configurationMenuPosition;
    }
  }, {
    key: "hideMenuPosition",
    get: function get() {
      return this._hideMenuPosition;
    }
  }, {
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "render",
    value: function render() {
      this._fixElements();
      this.fixTop();
      this._panel = new SeobarHorizontalPanel(this);
      this._panel.createHintBox = function createHintBox(element, message) {
        return new HintBox(element, {
          message: message,
          event: 'hover',
          inline: true,
          className: 'seoquake-hintbox seoquake-hintbox-seobar',
          positionFixed: true,
          offset: {
            top: -5
          }
        });
      };
      this._panel.init();
      dom.addClass(this._panel.element, 'sqseobar2-horizontal');
      dom.addClass(this._panel.element, 'sqseobar2-bottom');
      document.body.appendChild(this._panel.element);
      this._panel._updateParametersWidth();
      this._panel.loadData();
      this.initMozbarIntegration();
    }
  }, {
    key: "remove",
    value: function remove() {
      window.removeEventListener('scroll', this._processScrollEvent);
      window.removeEventListener('resize', this._processResizeEvent);
      this._scrollCorrectedElements.forEach(function (element) {
        return dom.data(element, 'sqtop', null);
      });
      this._scrollCorrectedElements.clear();
      this._panel.remove();
      _get(_getPrototypeOf(SeobarHorizontalBottom.prototype), "remove", this).call(this);
    }
  }, {
    key: "fixTop",
    value: function fixTop() {
      this._fixBodyTop();
      this._fixFixedElements();
      window.addEventListener('scroll', this._processScrollEvent);
      window.addEventListener('resize', this._processResizeEvent);
    }
  }, {
    key: "_fixBodyTop",
    value: function _fixBodyTop() {
      var body = document.body;
      var oldCss = {
        paddingBottom: body.style.paddingBottom || null
      };
      var style = window.getComputedStyle(body);
      this._storeElement(body, oldCss);
      dom.css(body, {
        paddingBottom: parseInt(style.paddingBottom) + SeobarHorizontalBottom.HEIGHT + 'px'
      });
    }
  }, {
    key: "_fixFixedElement",
    value: function _fixFixedElement(element, style) {
      if (style.visibility === 'hidden' || style.bottom === 'auto') {
        return;
      }
      if (element.className.indexOf('mozbar-') !== -1) {
        return;
      }
      var bottom = 0;
      try {
        bottom = parseInt(style.bottom);
        if (isNaN(bottom)) {
          return;
        }
      } catch (error) {
        ignore(error);
        bottom = 0;
      }
      var oldCss = {
        bottom: element.style.bottom || null
      };
      this._storeElement(element, oldCss);
      dom.css(element, {
        bottom: bottom + SeobarHorizontalBottom.HEIGHT + 'px'
      });
      if (style.position === 'fixed') {
        dom.data(element, 'sqbottom', bottom + SeobarHorizontalBottom.HEIGHT);
        this._scrollCorrectedElements.add(element);
      }
    }
  }, {
    key: "_searchDeep",
    value: function _searchDeep(children, depth) {
      var _this2 = this;
      depth--;
      Array.from(children).forEach(function (child) {
        var style = window.getComputedStyle(child);
        if (style.position === 'fixed') {
          _this2._fixFixedElement(child, style);
        } else if (depth > 0) {
          _this2._searchDeep(child.children, depth);
        }
      });
    }
  }, {
    key: "_fixFixedElements",
    value: function _fixFixedElements() {
      var _this3 = this;
      var body = document.body;
      Array.from(body.children).forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position === 'fixed' || style.position === 'absolute') {
          _this3._fixFixedElement(element, style);
        } else {
          _this3._searchDeep(element.children, 4);
        }
      });
    }
  }, {
    key: "_handleScrollEvent",
    value: function _handleScrollEvent() {
      var _this4 = this;
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      var dy = Math.min(scrollTop, SeobarHorizontalBottom.HEIGHT);
      this._scrollCorrectedElements.forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position !== 'fixed') {
          _this4._scrollCorrectedElements["delete"](element);
        }
      });
      this._scrollCorrectedElements.forEach(function (element) {
        var bottom = dom.data(element, 'sqbottom') || SeobarHorizontalBottom.HEIGHT;
        bottom -= dy;
        dom.css(element, 'bottom', bottom + 'px');
      });
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(event) {
      this._panel.processResizeEvent(event);
    }
  }, {
    key: "integrateWithMozBar",
    value: function integrateWithMozBar() {
      if (!this._positionCorrected) {
        dom.css(this._panel.element, 'bottom', '43px');
        this._configurationMenuPosition.bottom = 83;
        this._hideMenuPosition.bottom = 83;
        _get(_getPrototypeOf(SeobarHorizontalBottom.prototype), "integrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "disintegrateWithMozBar",
    value: function disintegrateWithMozBar() {
      if (this._positionCorrected) {
        dom.css(this._panel.element, 'bottom', '0px');
        this._configurationMenuPosition.bottom = 40;
        this._hideMenuPosition.bottom = 40;
        _get(_getPrototypeOf(SeobarHorizontalBottom.prototype), "disintegrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "initMozbarIntegration",
    value: function initMozbarIntegration() {
      var mozbar = document.body.querySelector('iframe[id^="mozbar-"]');
      if (mozbar && document.body.className.indexOf('mozbar-margin-') === -1) {
        this.integrateWithMozBar();
      }
      this._mozbarObserver = new MutationObserver(this.processBodyChange);
      this._mozbarObserver.observe(document.body, {
        childList: true,
        subtree: false,
        attributes: true
      });
      dom.correctZIndex(document.body);
    }
  }, {
    key: "handleBodyChange",
    value: function handleBodyChange(mutations) {
      var mozbar = document.body.querySelector('iframe[id^="mozbar-"]');
      if (mozbar && document.body.className.indexOf('mozbar-margin-') === -1) {
        this.integrateWithMozBar();
      } else {
        this.disintegrateWithMozBar();
      }
      dom.correctZIndex(document.body);
    }
  }]);
}(SeobarBase);
SeobarHorizontalBottom.HEIGHT = 40;
module.exports = SeobarHorizontalBottom;

},{"../dom/main":33,"../effects/HintBox":46,"../lib/ignore":63,"./SeobarBase":100,"./SeobarHorizontalPanel":103}],103:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../dom/main');
var extend = require('extend');
var SeobarParameterItemInline = require('./elements/SeobarParameterItemInline');
var HintBox = require('../effects/HintBox');
var SeobarMoreDropdown = require('./elements/SeobarMoreDropdown');
var SeobarConfigureMenu = require('./SeobarConfigureMenu');
var SeobarPanel = require('./SeobarPanel');
var ignore = require('../lib/ignore');
var SeobarHorizontalPanel = function (_SeobarPanel) {
  function SeobarHorizontalPanel(owner) {
    var _this;
    _classCallCheck(this, SeobarHorizontalPanel);
    _this = _callSuper(this, SeobarHorizontalPanel, [owner]);
    _this._base = owner;
    _this._element = null;
    _this._parametersItems = new Set();
    _this._menuMore = null;
    _this._autoLoad = false;
    _this._rightBlock = null;
    _this._buttonMore = null;
    _this._parametersBlock = null;
    _this._rightBlockObserver = null;
    _this._createHintBox = createHintBox;
    _this._hintBoxesCache = new Map();
    _this._processDiagnosisClick = _this._base.plugin._processDiagnosisClick;
    _this._processCloseClick = _this._base.plugin._processCloseClick;
    _this._processRightBlockChange = _this._handleRightBlockChange.bind(_this);
    _this._processSwitchToLeft = _this._handleSwitchToLeft.bind(_this);
    _this._processMoreDropdownShow = _this._handleMoreDropdownShow.bind(_this);
    _this.processReloadClick = _this._handleReloadClick.bind(_this);
    _this.processConfigurationUpdate = _this._handleConfigurationUpdate.bind(_this);
    _this.processResizeEvent = _this._handleResizeEvent.bind(_this);
    _this._isInit = false;
    return _this;
  }
  _inherits(SeobarHorizontalPanel, _SeobarPanel);
  return _createClass(SeobarHorizontalPanel, [{
    key: "t",
    value: function t(message) {
      return this._base.plugin.t(message);
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "reloadButtonElement",
    get: function get() {
      var element = _get(_getPrototypeOf(SeobarHorizontalPanel.prototype), "reloadButtonElement", this);
      dom.addClass(element, 'sqseobar2-reloadButton');
      return element;
    }
  }, {
    key: "createHintBox",
    get: function get() {
      return this._createHintBox;
    },
    set: function set(func) {
      this._createHintBox = func;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this._hintBoxesCache.forEach(function (hintbox) {
        return hintbox.remove();
      });
      this._parametersItems.forEach(function (item) {
        return item.remove();
      });
      this._parametersItems.clear();
      this._menuConfigure.remove();
      this._menuMore.remove();
      if (this._panelClose !== null) {
        this._panelClose.remove();
        this._panelClose = null;
      }
      if (this._rightBlockObserver !== null) {
        this._rightBlockObserver.disconnect();
        this._rightBlockObserver = null;
      }
      if (this._linkSiteaudit !== null) {
        this._linkSiteaudit.remove();
        this._linkSiteaudit = null;
      }
      dom.removeElement(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SeobarHorizontalPanel.prototype), "init", this).call(this);
      this._autoLoad = this._base.plugin.configuration.mode === 0;
      this._element = dom('div', {
        id: 'sqseobar2'
      });
      this._parametersBlock = this._createParametersList();
      var inner = dom('div', {
        className: 'sqseobar2-inner'
      });
      inner.appendChild(this._createLogo());
      inner.appendChild(this.reloadButtonElement);
      inner.appendChild(this._parametersBlock);
      inner.appendChild(this.rightBlock);
      this._element.appendChild(inner);
      this._base.plugin.addEventListener('configurationUpdate', this.processConfigurationUpdate);
      this._isInit = true;
      this.style = this._base.plugin.configuration.color;
    }
  }, {
    key: "loadData",
    value: function loadData() {
      this._parametersItems.forEach(function (item) {
        return item.loadData();
      });
    }
  }, {
    key: "_createParametersList",
    value: function _createParametersList() {
      var _this2 = this;
      var parametersBlock = dom('div', {
        className: 'sqseobar2-parameters'
      });
      var parametersListContainer = dom('div', {
        className: 'sqseobar2-parameters-container'
      });
      var parameters = this._base.plugin.parameters;
      var url = this._base.plugin.parsedUri;
      var autoLoad = this._autoLoad;
      var hasParameters = false;
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var parameter = new SeobarParameterItemInline(parameters[key], url, this._base.plugin.getUUID());
          parameter.createHintBox = this.createHintBox;
          parameter.setMessenger(this._base.plugin.getMessenger());
          parameter.autoLoad = autoLoad;
          parameter.init();
          this._parametersItems.add(parameter);
          hasParameters = true;
        }
      }
      if (this._parametersItems.size > 0 && !this._autoLoad) {
        dom.removeClass(this.reloadButtonElement, 'sqseobar2-item-hidden');
      } else {
        dom.addClass(this.reloadButtonElement, 'sqseobar2-item-hidden');
      }
      this._parametersItems.forEach(function (parameter) {
        return parametersListContainer.appendChild(parameter.container);
      });
      parametersBlock.appendChild(parametersListContainer);
      parametersBlock.appendChild(this.buttonMore);
      this._menuMore = new SeobarMoreDropdown(parametersListContainer, this.buttonMore);
      this._menuMore.setTranslateFunction(function (message) {
        return _this2._base.plugin.t(message);
      });
      this._menuMore.addEventListener('buttonClick', this._processSwitchToLeft);
      this._menuMore.addEventListener('dropdownShow', this._processMoreDropdownShow);
      this._menuMore.init();
      return parametersBlock;
    }
  }, {
    key: "buttonMore",
    get: function get() {
      var _this3 = this;
      if (this._buttonMore === null) {
        this._buttonMore = dom('button', {
          className: 'sqseobar2-button-more'
        }, 'More data');
        this.t('sqSeobar2_more').then(function (text) {
          return dom.text(_this3._buttonMore, text);
        })["catch"](ignore);
      }
      return this._buttonMore;
    }
  }, {
    key: "rightBlock",
    get: function get() {
      if (this._rightBlock === null) {
        var rightBlock = dom('div', {
          className: 'sqseobar2-right-container'
        });
        var buttonsBlock = dom('div', {
          className: 'sqseobar2-right-container-buttons'
        });
        var config = this._base.plugin.configuration;
        config.pageinfoLink && this._addMagicIcon(buttonsBlock, this.pageinfoLink);
        config.diagnosisLink && this._addMagicIcon(buttonsBlock, this.diagnosisLink);
        config.densityLink && this._addMagicIcon(buttonsBlock, this.densityLink);
        config.linkinfoLink && this._addMagicIcon(buttonsBlock, this.externalsLink);
        config.linkinfoLink && this._addMagicIcon(buttonsBlock, this.internalsLink);
        config.robotsLink && this._addMagicIcon(buttonsBlock, this.robotsLink);
        config.sitemapLink && this._addMagicIcon(buttonsBlock, this.sitemapLink);
        config.siteauditLink && this._addMagicIcon(buttonsBlock, this.siteauditLink, true);
        if (buttonsBlock.children.length > 0) {
          rightBlock.appendChild(buttonsBlock);
        }
        rightBlock.appendChild(this.closeButtonElement);
        rightBlock.appendChild(this.configureButtonElement);
        this._rightBlock = rightBlock;
        this._rightBlockObserver = new MutationObserver(this._processRightBlockChange);
        this._rightBlockObserver.observe(this._rightBlock, {
          childList: true,
          subtree: true
        });
      }
      return this._rightBlock;
    }
  }, {
    key: "_addMagicIcon",
    value: function _addMagicIcon(to, link, withoutHintbox) {
      var hintBox = null;
      if (!withoutHintbox) {
        if (this._hintBoxesCache.has(link)) {
          hintBox = this._hintBoxesCache.get(link);
        } else {
          hintBox = this.createHintBox(link.element, link.title);
          link.addEventListener('afterChangeTitle', function (title) {
            return hintBox.message = title;
          });
          this._hintBoxesCache.set(link, hintBox);
        }
      }
      to.appendChild(link.element);
    }
  }, {
    key: "_updateParametersWidth",
    value: function _updateParametersWidth() {
      if (this._menuMore !== null) {
        this._menuMore.width = this._element.clientWidth - 65 - this.reloadButtonElement.offsetWidth - this.rightBlock.offsetWidth - this.buttonMore.offsetWidth;
      }
    }
  }, {
    key: "_handleSwitchToLeft",
    value: function _handleSwitchToLeft() {
      var plugin = this._base.plugin;
      plugin.switchPosition('left');
      plugin.registerEvent('seobar2', 'switchToLeft');
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(e) {
      this._updateParametersWidth();
    }
  }, {
    key: "_handleRightBlockChange",
    value: function _handleRightBlockChange() {
      this._updateParametersWidth();
    }
  }, {
    key: "_handleReloadClick",
    value: function _handleReloadClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this._parametersItems.forEach(function (item) {
        return item.loadData(true);
      });
      this.reloadButton.disabled = true;
      this._base.plugin.registerEvent('seobar2', 'requestAllParameters');
    }
  }, {
    key: "_handleConfigurationUpdate",
    value: function _handleConfigurationUpdate(diff) {
      if (!this._isInit) {
        return;
      }
      var conf = diff[0];
      var param = diff[1];
      if (conf.length === 1 && conf[0] === 'color') {
        this._updateParametersWidth();
        return;
      }
      if (param.length > 0) {
        if (this._parametersBlock !== null) {
          var shadow = this._parametersBlock.cloneNode(true);
          this._parametersBlock.parentNode.replaceChild(shadow, this._parametersBlock);
          this._parametersBlock = shadow;
          this._parametersItems.forEach(function (item) {
            return item.remove();
          });
          this._parametersItems.clear();
          this._menuMore.remove();
        }
        this.reloadButton.disabled = false;
        var parameters = this._createParametersList();
        this._parametersItems.forEach(function (item) {
          return item.loadData();
        });
        this._parametersBlock.parentNode.replaceChild(parameters, this._parametersBlock);
        this._parametersBlock = parameters;
        this._updateParametersWidth();
      }
    }
  }, {
    key: "_handleMoreDropdownShow",
    value: function _handleMoreDropdownShow() {
      this._base.plugin.registerEvent('seobar2', 'showMoreDropdown');
    }
  }]);
}(SeobarPanel);
function createHintBox(element, message) {
  return new HintBox(element, {
    message: message,
    event: 'hover',
    inline: true,
    className: 'seoquake-hintbox seoquake-hintbox-bottom seoquake-hintbox-seobar',
    positionFixed: true
  });
}
module.exports = SeobarHorizontalPanel;

},{"../dom/main":33,"../effects/HintBox":46,"../lib/ignore":63,"./SeobarConfigureMenu":101,"./SeobarPanel":105,"./elements/SeobarMoreDropdown":114,"./elements/SeobarParameterItemInline":117,"extend":164}],104:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarBase = require('./SeobarBase');
var dom = require('../dom/main');
var SeobarHorizontalPanel = require('./SeobarHorizontalPanel');
var ignore = require('../lib/ignore');
var SeobarHorizontalTop = function (_SeobarBase) {
  function SeobarHorizontalTop(plugin) {
    var _this;
    _classCallCheck(this, SeobarHorizontalTop);
    _this = _callSuper(this, SeobarHorizontalTop, [plugin]);
    _this._configurationMenuPosition = {
      left: null,
      bottom: null,
      right: 40,
      top: 40
    };
    _this._hideMenuPosition = {
      left: null,
      bottom: null,
      right: 0,
      top: 40
    };
    _this._panel = null;
    _this._scrollCorrectedElements = new Set();
    _this._processResizeEvent = _this._handleResizeEvent.bind(_this);
    return _this;
  }
  _inherits(SeobarHorizontalTop, _SeobarBase);
  return _createClass(SeobarHorizontalTop, [{
    key: "configurationMenuPosition",
    get: function get() {
      return this._configurationMenuPosition;
    }
  }, {
    key: "hideMenuPosition",
    get: function get() {
      return this._hideMenuPosition;
    }
  }, {
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "render",
    value: function render() {
      this._fixElements();
      this.fixTop();
      this._panel = new SeobarHorizontalPanel(this);
      this._panel.init();
      dom.addClass(this._panel.element, 'sqseobar2-horizontal');
      document.body.appendChild(this._panel.element);
      this._panel._updateParametersWidth();
      this._panel.loadData();
      this.initMozbarIntegration();
    }
  }, {
    key: "remove",
    value: function remove() {
      window.removeEventListener('resize', this._processResizeEvent);
      this._scrollCorrectedElements.forEach(function (element) {
        return dom.data(element, 'sqtop', null);
      });
      this._scrollCorrectedElements.clear();
      this._panel.remove();
      _get(_getPrototypeOf(SeobarHorizontalTop.prototype), "remove", this).call(this);
    }
  }, {
    key: "fixTop",
    value: function fixTop() {
      this._fixBodyTop();
      this._fixFixedElements();
      window.addEventListener('resize', this._processResizeEvent);
    }
  }, {
    key: "_fixBodyTop",
    value: function _fixBodyTop() {
      var body = document.body;
      var oldCss = {
        top: body.style.top || 0,
        position: body.style.position || 'static'
      };
      var style = window.getComputedStyle(body);
      this._storeElement(body, oldCss);
      dom.css(body, {
        top: parseInt(style.paddingTop) + SeobarHorizontalTop.HEIGHT + 'px',
        position: 'relative'
      });
    }
  }, {
    key: "_fixFixedElement",
    value: function _fixFixedElement(element, style) {
      if (style.visibility === 'hidden' || style.top === 'auto') {
        return;
      }
      if (element.className.toString().indexOf('mozbar-') !== -1) {
        return;
      }
      var top = 0;
      try {
        top = parseInt(style.top);
        if (isNaN(top)) {
          return;
        }
      } catch (error) {
        ignore(error);
        top = 0;
      }
      var oldCss = {
        top: element.style.top || null
      };
      this._storeElement(element, oldCss);
      dom.css(element, {
        top: top + SeobarHorizontalTop.HEIGHT + 'px'
      });
      if (style.position === 'fixed') {
        dom.data(element, 'sqtop', top + SeobarHorizontalTop.HEIGHT);
        this._scrollCorrectedElements.add(element);
      }
    }
  }, {
    key: "_searchDeep",
    value: function _searchDeep(children, depth) {
      var _this2 = this;
      depth--;
      Array.from(children).forEach(function (child) {
        var style = window.getComputedStyle(child);
        if (style.position === 'fixed') {
          _this2._fixFixedElement(child, style);
        } else if (depth > 0) {
          _this2._searchDeep(child.children, depth);
        }
      });
    }
  }, {
    key: "_fixFixedElements",
    value: function _fixFixedElements() {
      var _this3 = this;
      var body = document.body;
      Array.from(body.children).forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position === 'fixed' || style.position === 'absolute') {
          _this3._fixFixedElement(element, style);
        } else {
          _this3._searchDeep(element.children, 4);
        }
      });
    }
  }, {
    key: "integrateWithMozBar",
    value: function integrateWithMozBar() {
      if (!this._positionCorrected) {
        dom.css(this._panel.element, 'top', '43px');
        this._configurationMenuPosition.top = 83;
        this._hideMenuPosition.top = 83;
        _get(_getPrototypeOf(SeobarHorizontalTop.prototype), "integrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "disintegrateWithMozBar",
    value: function disintegrateWithMozBar() {
      if (this._positionCorrected) {
        dom.css(this._panel.element, 'top', '0px');
        this._configurationMenuPosition.top = 40;
        this._hideMenuPosition.top = 40;
        _get(_getPrototypeOf(SeobarHorizontalTop.prototype), "disintegrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "_handleScrollEvent",
    value: function _handleScrollEvent(event) {
      var _this4 = this;
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      var dy = Math.min(scrollTop, SeobarHorizontalTop.HEIGHT);
      this._scrollCorrectedElements.forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position !== 'fixed') {
          _this4._scrollCorrectedElements["delete"](element);
        }
      });
      this._scrollCorrectedElements.forEach(function (element) {
        var top = dom.data(element, 'sqtop') || SeobarHorizontalTop.HEIGHT;
        top -= dy;
        dom.css(element, 'top', top + 'px');
      });
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(event) {
      this._panel.processResizeEvent(event);
    }
  }]);
}(SeobarBase);
SeobarHorizontalTop.HEIGHT = 40;
module.exports = SeobarHorizontalTop;

},{"../dom/main":33,"../lib/ignore":63,"./SeobarBase":100,"./SeobarHorizontalPanel":103}],105:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var SeobarConfigureMenu = require('./SeobarConfigureMenu');
var SeobarLink = require('./elements/SeobarLink');
var SeobarLinkDiagnosisResult = require('./elements/SeobarLinkDiagnosisResult');
var SeobarLinkWithValue = require('./elements/SeobarLinkWithValue');
var SeobarLinkSiteaudit = require('./elements/SeobarLinkSiteaudit');
var SeobarCloseDropdown = require('./elements/SeobarCloseDropdown');
var ignore = require('../lib/ignore');
var SeobarPanel = function () {
  function SeobarPanel(owner) {
    _classCallCheck(this, SeobarPanel);
    this._base = owner;
    this._element = null;
    this._buttonClose = null;
    this._panelClose = null;
    this._menuConfigure = null;
    this._buttonDropdown = null;
    this._buttonReload = null;
    this._linkDiagnosis = null;
    this._linkPageInfo = null;
    this._linkDensity = null;
    this._linkRobotsTxt = null;
    this._linkSitemapXml = null;
    this._linkLinkInternal = null;
    this._linkLinkExternal = null;
    this._linkSiteaudit = null;
    this._buttonConfigure = null;
    this._style = null;
    this.processDiagnosisClick = this._base.plugin._processDiagnosisClick;
    this.processPageinfoClick = this._base.plugin._processPageinfoClick;
    this.processDensityClick = this._base.plugin._processDensityClick;
    this.processRobotsClick = this._base.plugin._processRobotsClick;
    this.processSitemapClick = this._base.plugin._processSitemapClick;
    this.processLinkInternalClick = this._base.plugin._processLinkInternalClick;
    this.processLinkExternalClick = this._base.plugin._processLinkExternalClick;
    this.processConfigurationClick = this._base.plugin._processConfigurationClick;
    this.processCloseClick = this._base.plugin.processCloseClick;
    this.processHideClick = this._base.plugin.processExcludeClick;
    this.processWhitelistLinkClick = this._base.plugin.processWhitelistLinkClick;
    this.processStyleUpdate = this._handleStyleUpdate.bind(this);
    this.processConfigureShow = this._handleConfigureShow.bind(this);
    this._isInit = false;
  }
  return _createClass(SeobarPanel, [{
    key: "t",
    value: function t(message) {
      return this._base.plugin.t(message);
    }
  }, {
    key: "style",
    get: function get() {
      return this._style;
    },
    set: function set(value) {
      if (!this._isInit) {
        return;
      }
      if (this._style !== null && this._style !== '') {
        dom.removeClass(this._element, this._style);
      }
      if (SeobarPanel.STYLES.hasOwnProperty(value)) {
        this._style = SeobarPanel.STYLES[value];
        if (SeobarPanel.STYLES[value] !== '') {
          dom.addClass(this._element, SeobarPanel.STYLES[value]);
        }
      } else {
        this._style = null;
      }
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "clearHtml",
    value: function clearHtml() {
      var sqseobar2 = document.getElementById('sqseobar2');
      if (sqseobar2) {
        sqseobar2.parentNode.removeChild(sqseobar2);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      if (this._linkSiteaudit !== null) {
        this._linkSiteaudit.remove();
        this._linkSiteaudit = null;
      }
      if (this._panelClose !== null) {
        this._panelClose.remove();
        this._panelClose = null;
      }
      this._base.plugin.removeEventListener('updateStyle', this.processStyleUpdate);
      this._menuConfigure.remove();
      dom.removeElement(this._element);
    }
  }, {
    key: "init",
    value: function init() {
      this.clearHtml();
      this._base.plugin.addEventListener('updateStyle', this.processStyleUpdate);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._isInit) {
        throw new Error('Should be inited before render');
      }
    }
  }, {
    key: "_getSVGPath",
    value: function _getSVGPath(img) {
      return this._base.plugin.assetsUrl + 'static/svg/' + img;
    }
  }, {
    key: "_createLogo",
    value: function _createLogo() {
      return dom('img', {
        src: this._getSVGPath('seoquake-icon.svg'),
        className: 'sqseobar2-logo'
      });
    }
  }, {
    key: "configureButtonElement",
    get: function get() {
      var _this = this;
      if (this._buttonDropdown === null) {
        this._buttonDropdown = dom('button', {
          className: 'sqseobar2-button-configure',
          title: 'Configure'
        });
        this.t('sqSeobar2_configure').then(function (text) {
          return dom.attr(_this._buttonDropdown, 'title', text);
        })["catch"](ignore);
        this._menuConfigure = new SeobarConfigureMenu(this._base, this._buttonDropdown);
        this._menuConfigure.config.positionCorrection = this._base.configurationMenuPosition;
        this._menuConfigure.setTranslateFunction(function (message) {
          return _this._base.plugin.t(message);
        });
        this._menuConfigure.addEventListener('show', this.processConfigureShow);
        this._menuConfigure.init();
      }
      return this._buttonDropdown;
    }
  }, {
    key: "closeButtonElement",
    get: function get() {
      var _this2 = this;
      if (this._buttonClose === null) {
        this._buttonClose = dom('button', {
          className: 'sqseobar2-button-close',
          title: 'Close'
        });
        this.t('sqSeobar2_close').then(function (text) {
          return dom.attr(_this2._buttonClose, 'title', text);
        })["catch"](ignore);
        this._panelClose = new SeobarCloseDropdown(this._buttonClose);
        this._panelClose.config.positionCorrection = this._base.hideMenuPosition;
        this._panelClose.setTranslateFunction(this.t.bind(this));
        this._panelClose.init();
        this._panelClose.addEventListener('hideClick', this.processHideClick);
        this._panelClose.addEventListener('closeClick', this.processCloseClick);
        this._panelClose.addEventListener('linkClick', this.processWhitelistLinkClick);
      }
      return this._buttonClose;
    }
  }, {
    key: "reloadButton",
    get: function get() {
      var _this3 = this;
      if (this._buttonReload === null) {
        this._buttonReload = new SeobarLink('Load values', '');
        if (this.processReloadClick) {
          this._buttonReload.onClick = this.processReloadClick;
        }
        this.t('sqSeobar2_reload').then(function (text) {
          return _this3._buttonReload.title = text;
        })["catch"](ignore);
      }
      return this._buttonReload;
    }
  }, {
    key: "reloadButtonElement",
    get: function get() {
      return this.reloadButton.element;
    }
  }, {
    key: "diagnosisLink",
    get: function get() {
      var _this4 = this;
      if (this._linkDiagnosis === null) {
        this._linkDiagnosis = new SeobarLink('Diagnosis', 'sqseobar2-link sqseobar2-link-diagnosis');
        this._linkDiagnosis.onClick = this.processDiagnosisClick;
        this.t('sqSeobar2_diagnosis').then(function (text) {
          return _this4._linkDiagnosis.title = text;
        })["catch"](ignore);
      }
      return this._linkDiagnosis;
    }
  }, {
    key: "diagnosisLinkElement",
    get: function get() {
      return this.diagnosisLink.element;
    }
  }, {
    key: "densityLink",
    get: function get() {
      var _this5 = this;
      if (this._linkDensity === null) {
        this._linkDensity = new SeobarLink('Density', 'sqseobar2-link sqseobar2-link-density');
        this._linkDensity.onClick = this.processDensityClick;
        this.t('sqSeobar2_density').then(function (text) {
          return _this5._linkDensity.title = text;
        })["catch"](ignore);
      }
      return this._linkDensity;
    }
  }, {
    key: "densityLinkElement",
    get: function get() {
      return this.densityLink.element;
    }
  }, {
    key: "pageinfoLink",
    get: function get() {
      var _this6 = this;
      if (this._linkPageInfo === null) {
        this._linkPageInfo = new SeobarLink('Pageinfo', 'sqseobar2-link sqseobar2-link-pageinfo');
        this._linkPageInfo.onClick = this.processPageinfoClick;
        this.t('sqSeobar2_pageinfo').then(function (text) {
          return _this6._linkPageInfo.title = text;
        })["catch"](ignore);
      }
      return this._linkPageInfo;
    }
  }, {
    key: "pageinfoLinkElement",
    get: function get() {
      return this.pageinfoLink.element;
    }
  }, {
    key: "robotsLink",
    get: function get() {
      var _this7 = this;
      if (this._linkRobotsTxt === null) {
        this._linkRobotsTxt = new SeobarLinkDiagnosisResult('Robots.txt', 'sqseobar2-link sqseobar2-link-robots');
        this._linkRobotsTxt.onClick = this.processRobotsClick;
        this.t('sqSeobar2_robots').then(function (text) {
          return _this7._linkRobotsTxt.title = text;
        })["catch"](ignore);
        this._base.plugin.getRobotsTxtData().then(function (result) {
          return _this7._linkRobotsTxt.result = result;
        })["catch"](ignore);
      }
      return this._linkRobotsTxt;
    }
  }, {
    key: "robotsLinkElement",
    get: function get() {
      return this.robotsLink.element;
    }
  }, {
    key: "sitemapLink",
    get: function get() {
      var _this8 = this;
      if (this._linkSitemapXml === null) {
        this._linkSitemapXml = new SeobarLinkDiagnosisResult('Sitemap.xml', 'sqseobar2-link sqseobar2-link-sitemap');
        this._linkSitemapXml.onClick = this.processSitemapClick;
        this.t('sqSeobar2_sitemap').then(function (text) {
          return _this8._linkSitemapXml.title = text;
        })["catch"](ignore);
        this._base.plugin.getSitemapXMLData().then(function (result) {
          return _this8._linkSitemapXml.result = result;
        })["catch"](ignore);
      }
      return this._linkSitemapXml;
    }
  }, {
    key: "sitemapLinkElement",
    get: function get() {
      return this.sitemapLink.element;
    }
  }, {
    key: "internalsLink",
    get: function get() {
      var _this9 = this;
      if (this._linkLinkInternal === null) {
        this._linkLinkInternal = new SeobarLinkWithValue('Internal links', 'sqseobar2-link sqseobar2-link-internal', '0');
        this._linkLinkInternal.onClick = this.processLinkInternalClick;
        this.t('sqSeobar2_internal').then(function (text) {
          return _this9._linkLinkInternal.title = text;
        })["catch"](ignore);
        this._base.plugin.getPageinfoData().then(function (result) {
          return _this9._linkLinkInternal.value = result.internal;
        })["catch"](ignore);
      }
      return this._linkLinkInternal;
    }
  }, {
    key: "internalsLinkElement",
    get: function get() {
      return this.internalsLink.element;
    }
  }, {
    key: "externalsLink",
    get: function get() {
      var _this10 = this;
      if (this._linkLinkExternal === null) {
        this._linkLinkExternal = new SeobarLinkWithValue('External links', 'sqseobar2-link sqseobar2-link-external', '0');
        this._linkLinkExternal.onClick = this.processLinkExternalClick;
        this.t('sqSeobar2_external').then(function (text) {
          return _this10._linkLinkExternal.title = text;
        })["catch"](ignore);
        this._base.plugin.getPageinfoData().then(function (result) {
          return _this10._linkLinkExternal.value = result.external;
        })["catch"](ignore);
      }
      return this._linkLinkExternal;
    }
  }, {
    key: "externalsLinkElement",
    get: function get() {
      return this.externalsLink.element;
    }
  }, {
    key: "configureLink",
    get: function get() {
      var _this11 = this;
      if (this._buttonConfigure === null) {
        this._buttonConfigure = new SeobarLink('More settings', 'sqseobar2-link sqseobar2-link-settings');
        this._buttonConfigure.onClick = this.processConfigurationClick;
        this.t('sqSeobar2_configuration').then(function (text) {
          return _this11._buttonConfigure.title = text;
        })["catch"](ignore);
      }
      return this._buttonConfigure;
    }
  }, {
    key: "configureLinkElement",
    get: function get() {
      return this.configureLink.element;
    }
  }, {
    key: "siteauditLink",
    get: function get() {
      var _this12 = this;
      if (this._linkSiteaudit === null) {
        this._linkSiteaudit = new SeobarLinkSiteaudit('Site audit', 'sqseobar2-link sqseobar2-link-siteaudit', '');
        this._linkSiteaudit.setMessenger(this._base.plugin.getMessenger());
        this._linkSiteaudit.setTranslateFunction(this._base.plugin.t.bind(this._base.plugin));
        this.t('sqSeobar2_siteaudit').then(function (text) {
          return _this12._linkSiteaudit.title = text;
        })["catch"](ignore);
        this._linkSiteaudit.process();
      }
      return this._linkSiteaudit;
    }
  }, {
    key: "siteauditLinkElement",
    get: function get() {
      return this.siteauditLink.element;
    }
  }, {
    key: "_handleStyleUpdate",
    value: function _handleStyleUpdate(style) {
      this.style = style;
    }
  }, {
    key: "_handleConfigureShow",
    value: function _handleConfigureShow() {
      this._base.plugin.registerEvent('seobar2', 'configureShow');
    }
  }]);
}();
SeobarPanel.STYLES = {
  white: 'sqseobar2-white',
  green: ''
};
module.exports = SeobarPanel;

},{"../dom/main":33,"../lib/ignore":63,"./SeobarConfigureMenu":101,"./elements/SeobarCloseDropdown":109,"./elements/SeobarLink":110,"./elements/SeobarLinkDiagnosisResult":111,"./elements/SeobarLinkSiteaudit":112,"./elements/SeobarLinkWithValue":113}],106:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarBase = require('./SeobarBase');
var dom = require('../dom/main');
var SeobarVerticalPanel = require('./SeobarVerticalPanel');
var ignore = require('../lib/ignore');
var SeobarVerticalLeft = function (_SeobarBase) {
  function SeobarVerticalLeft(plugin) {
    var _this;
    _classCallCheck(this, SeobarVerticalLeft);
    _this = _callSuper(this, SeobarVerticalLeft, [plugin]);
    _this._panel = null;
    _this._currentWidth = SeobarVerticalLeft.WIDTH;
    _this._currentPositionCorrection = {
      left: _this._currentWidth,
      top: 0
    };
    _this._widthCorrectedElements = new Set();
    _this._processResizeEvent = _this._handleResizeEvent.bind(_this);
    _this._processUpdateMinimizedEvent = _this._handleUpdateMinimizedEvent.bind(_this);
    return _this;
  }
  _inherits(SeobarVerticalLeft, _SeobarBase);
  return _createClass(SeobarVerticalLeft, [{
    key: "configurationMenuPosition",
    get: function get() {
      return this._currentPositionCorrection;
    }
  }, {
    key: "hideMenuPosition",
    get: function get() {
      return this._currentPositionCorrection;
    }
  }, {
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "render",
    value: function render() {
      this._fixElements();
      this.fixLeft();
      this._panel = new SeobarVerticalPanel(this);
      this._panel.init();
      dom.addClass(this._panel.element, 'sqseobar2-vertical');
      document.body.appendChild(this._panel.element);
      this.plugin.addEventListener('updateMinimized', this._processUpdateMinimizedEvent);
      this._panel.render();
      this._panel.loadData();
      this.initMozbarIntegration();
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._mozbarObserver !== null) {
        this._mozbarObserver.disconnect();
        this._mozbarObserver = null;
      }
      this.plugin.removeEventListener('updateMinimized', this._processUpdateMinimizedEvent);
      window.removeEventListener('resize', this._processResizeEvent);
      this._fixElements();
      this._panel.remove();
      _get(_getPrototypeOf(SeobarVerticalLeft.prototype), "remove", this).call(this);
    }
  }, {
    key: "_fixElements",
    value: function _fixElements() {
      _get(_getPrototypeOf(SeobarVerticalLeft.prototype), "_fixElements", this).call(this);
      dom.data(document.body, 'sqleft', null);
      this._widthCorrectedElements.forEach(function (element) {
        return dom.data(element, 'sqleft', null);
      });
      this._widthCorrectedElements.clear();
    }
  }, {
    key: "fixLeft",
    value: function fixLeft() {
      if (this.plugin.configuration.pinned) {
        this.resizeToSmall();
      } else {
        this.resizeToBig();
      }
      window.addEventListener('resize', this._processResizeEvent);
    }
  }, {
    key: "resizeToSmall",
    value: function resizeToSmall() {
      this._restoreElements();
    }
  }, {
    key: "resizeToBig",
    value: function resizeToBig() {
      this._restoreElements();
      this._fixBodyLeft();
      this._fixFixedElements();
    }
  }, {
    key: "_handleUpdateMinimizedEvent",
    value: function _handleUpdateMinimizedEvent(minimized) {
      if (minimized) {
        this.resizeToSmall();
      } else {
        this.resizeToBig();
      }
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(event) {
      var _this2 = this;
      var width = window.innerWidth;
      this._widthCorrectedElements.forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position !== 'fixed' && style.position !== 'absolute') {
          _this2._widthCorrectedElements["delete"](element);
        } else {
          dom.css(element, {
            width: width - SeobarVerticalLeft.WIDTH + 'px'
          });
        }
      });
      this._panel.processResizeEvent(event);
    }
  }, {
    key: "_fixBodyLeft",
    value: function _fixBodyLeft() {
      var body = document.body;
      var bodyLeft = dom.data(body, 'sqleft');
      try {
        bodyLeft = parseInt(bodyLeft);
        if (isNaN(bodyLeft)) {
          bodyLeft = false;
        }
      } catch (error) {
        ignore(error);
        bodyLeft = false;
      }
      if (bodyLeft) {
        var margin = parseInt(bodyLeft) + parseInt(SeobarVerticalLeft.WIDTH);
        body.style.cssText += 'margin-left: ' + margin + 'px !important';
      } else {
        var oldCss = {
          marginLeft: body.style.marginLeft || null
        };
        var style = window.getComputedStyle(body);
        this._storeElement(body, oldCss);
        var _margin = parseInt(style.marginLeft) + parseInt(SeobarVerticalLeft.WIDTH);
        body.style.cssText += 'margin-left: ' + _margin + 'px !important';
      }
    }
  }, {
    key: "_fixFixedElement",
    value: function _fixFixedElement(element, style) {
      if (element.id === 'sqseobar2') {
        return;
      }
      if (style.visibility === 'hidden' || style.left === 'auto') {
        return;
      }
      if (element.className.indexOf('mozbar-') !== -1) {
        return;
      }
      var left = 0;
      var width = window.innerWidth;
      try {
        left = parseInt(style.left);
        width = parseInt(style.width);
        if (isNaN(left)) {
          return;
        }
        if (isNaN(width)) {
          return;
        }
      } catch (error) {
        ignore(error);
        left = 0;
        width = window.innerWidth;
      }
      var oldCss = {
        left: element.style.left || null,
        width: element.style.width || null
      };
      this._storeElement(element, oldCss);
      dom.css(element, {
        left: left + SeobarVerticalLeft.WIDTH + 'px',
        width: width - SeobarVerticalLeft.WIDTH + 'px'
      });
      if (style.position === 'fixed' || style.position === 'absolute') {
        dom.data(element, 'sqleft', left + SeobarVerticalLeft.WIDTH);
        this._widthCorrectedElements.add(element);
      }
    }
  }, {
    key: "_fixFixedElements",
    value: function _fixFixedElements() {
      var _this3 = this;
      var body = document.body;
      var containerStyle = window.getComputedStyle(body);
      var containerPosition = containerStyle.position;
      if (containerPosition !== 'static') {
        Array.from(body.children).forEach(function (element) {
          var parentStyle = window.getComputedStyle(element);
          if (parentStyle.position === 'fixed') {
            _this3._fixFixedElement(element, parentStyle);
          } else {
            Array.from(element.children).forEach(function (child) {
              var style = window.getComputedStyle(child);
              if (style.position === 'fixed') {
                _this3._fixFixedElement(child, style);
              }
            });
          }
        });
      } else {
        Array.from(body.children).forEach(function (element) {
          var parentStyle = window.getComputedStyle(element);
          if (parentStyle.position === 'fixed' || parentStyle.position === 'absolute') {
            _this3._fixFixedElement(element, parentStyle);
          } else {
            Array.from(element.children).forEach(function (child) {
              var style = window.getComputedStyle(child);
              if (style.position === 'fixed' || style.position === 'absolute' && parentStyle.position === 'static') {
                _this3._fixFixedElement(child, style);
              }
            });
          }
        });
      }
    }
  }, {
    key: "integrateWithMozBar",
    value: function integrateWithMozBar() {
      if (!this._positionCorrected) {
        dom.css(this._panel.element, 'top', '43px');
        this._currentPositionCorrection.top = 43;
        _get(_getPrototypeOf(SeobarVerticalLeft.prototype), "integrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "disintegrateWithMozBar",
    value: function disintegrateWithMozBar() {
      if (this._positionCorrected) {
        dom.css(this._panel.element, 'top', '0px');
        _get(_getPrototypeOf(SeobarVerticalLeft.prototype), "disintegrateWithMozBar", this).call(this);
      }
    }
  }]);
}(SeobarBase);
SeobarVerticalLeft.WIDTH = 200;
module.exports = SeobarVerticalLeft;

},{"../dom/main":33,"../lib/ignore":63,"./SeobarBase":100,"./SeobarVerticalPanel":107}],107:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarPanel = require('./SeobarPanel');
var dom = require('../dom/main');
var SeobarParameterItemFull = require('./elements/SeobarParameterItemFull');
var HintBox = require('../effects/HintBox');
var ScrollBlock = require('../effects/ScrollBlock');
var ToggleButton = require('../effects/ToggleButton');
var ignore = require('../lib/ignore');
var SeobarVerticalPanel = function (_SeobarPanel) {
  function SeobarVerticalPanel(owner) {
    var _this;
    _classCallCheck(this, SeobarVerticalPanel);
    _this = _callSuper(this, SeobarVerticalPanel, [owner]);
    _this._parametersGroups = new Map([['page', new Set()], ['domain', new Set()], ['backlinks', new Set()], ['other', new Set()]]);
    _this._blockTop = null;
    _this._buttonToggle = null;
    _this._scrollBlock = null;
    _this._parametersBlock = null;
    _this._minimized = null;
    _this._logo = null;
    _this._logoHintBox = null;
    _this._reloaded = false;
    _this.processReloadClick = _this._handleReloadClick.bind(_this);
    _this.processMakeSmall = _this.handleMakeSmall.bind(_this);
    _this.processMakeBig = _this.handleMakeBig.bind(_this);
    _this.processResizeEvent = _this._handleResizeEvent.bind(_this);
    _this.processConfigurationUpdate = _this._handleConfigurationUpdate.bind(_this);
    _this.processLogoClick = _this.handleLogoClick.bind(_this);
    _this.processToggleMinimized = _this.handleToggleMinimized.bind(_this);
    return _this;
  }
  _inherits(SeobarVerticalPanel, _SeobarPanel);
  return _createClass(SeobarVerticalPanel, [{
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      document.body.removeEventListener('keypress', this.processToggleMinimized, true);
      this._parametersGroups.forEach(function (group) {
        group.forEach(function (item) {
          return item.remove();
        });
        group.clear();
      });
      this._scrollBlock.remove();
      if (this._linkSiteaudit !== null) {
        this._linkSiteaudit.remove();
        this._linkSiteaudit = null;
      }
      if (this._panelClose !== null) {
        this._panelClose.remove();
        this._panelClose = null;
      }
      _get(_getPrototypeOf(SeobarVerticalPanel.prototype), "remove", this).call(this);
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SeobarVerticalPanel.prototype), "init", this).call(this);
      this._element = dom('div', {
        id: 'sqseobar2'
      });
      var inner = dom('div', {
        className: 'sqseobar2-inner'
      });
      this._blockTop = dom('div', {
        className: 'sqseobar2-vertical-top-block'
      });
      this._logo = this._createLogo();
      this._blockTop.appendChild(this._logo);
      this._blockTop.appendChild(this.closeButtonElement);
      this._blockTop.appendChild(this.configureButtonElement);
      this._blockTop.appendChild(this._createToggleButton());
      inner.appendChild(this._blockTop);
      var scrollBlock = dom('div', {
        className: 'sqseobar2-scroll-block'
      });
      scrollBlock.appendChild(this._createSpecialButtons());
      this._parametersBlock = this._createParametersList();
      scrollBlock.appendChild(this._parametersBlock);
      inner.appendChild(scrollBlock);
      this._scrollBlock = new ScrollBlock(scrollBlock);
      this._element.appendChild(inner);
      this._base.plugin.addEventListener('configurationUpdate', this.processConfigurationUpdate);
      this._isInit = true;
      this.style = this._base.plugin.configuration.color;
      this.minimized = this._base.plugin.configuration.pinned;
    }
  }, {
    key: "loadData",
    value: function loadData() {
      this._parametersGroups.forEach(function (group) {
        return group.forEach(function (item) {
          return item.loadData();
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(SeobarVerticalPanel.prototype), "render", this).call(this);
      this.processResizeEvent();
    }
  }, {
    key: "createHintBox",
    get: function get() {
      var createHintBox = createHintBoxRight;
      if (this._base.plugin.configuration.position === 'left') {
        createHintBox = createHintBoxLeft;
      }
      return createHintBox;
    }
  }, {
    key: "reloadButtonElement",
    get: function get() {
      var element = _get(_getPrototypeOf(SeobarVerticalPanel.prototype), "reloadButtonElement", this);
      dom.addClass(element, 'sqseobar2-reloadButton');
      return element;
    }
  }, {
    key: "minimized",
    get: function get() {
      return this._minimized;
    },
    set: function set(value) {
      var _this2 = this;
      if (!this._isInit) {
        return;
      }
      this._minimized = value;
      if (value) {
        dom.addClass(this._element, 'sqseobar2-vertical-small');
        this._logo.addEventListener('click', this.processLogoClick, true);
        document.body.addEventListener('keypress', this.processToggleMinimized, true);
        this._buttonToggle.setStatus(ToggleButton.STATUS_DOWN, true);
        this._scrollBlock.height = this._element.offsetHeight - this._blockTop.offsetHeight;
        if (this._logoHintBox === null) {
          var createHintBox = this.createHintBox;
          this._logoHintBox = createHintBox(this._logo, '');
          this.t('sqSeobar2_float_show_hint').then(function (msg) {
            return _this2._logoHintBox.message = msg;
          })["catch"](ignore);
        }
      } else {
        dom.removeClass(this._element, 'sqseobar2-vertical-small');
        dom.removeClass(this._element, 'sqseobar2-fixed');
        this._logo.removeEventListener('click', this.processLogoClick, true);
        document.body.removeEventListener('keypress', this.processToggleMinimized, true);
        this._buttonToggle.setStatus(ToggleButton.STATUS_UP, true);
        this._scrollBlock.height = this._element.offsetHeight - this._blockTop.offsetHeight;
        if (this._logoHintBox !== null) {
          this._logoHintBox.remove();
          this._logoHintBox = null;
        }
      }
    }
  }, {
    key: "_createToggleButton",
    value: function _createToggleButton() {
      var toggleButton = dom('button', {
        className: 'sqseobar2-button-toggle',
        title: 'Toggle panel'
      });
      this.t('sqSeobar2_toggle').then(function (text) {
        return dom.attr(toggleButton, 'title', text);
      })["catch"](ignore);
      var config = {
        initialStatus: this._base.plugin.configuration.pinned ? ToggleButton.STATUS_DOWN : ToggleButton.STATUS_UP,
        classActive: 'sqseobar2-button-down'
      };
      this._buttonToggle = new ToggleButton(toggleButton, config);
      this._buttonToggle.addEventListener('down', this.processMakeSmall);
      this._buttonToggle.addEventListener('up', this.processMakeBig);
      return toggleButton;
    }
  }, {
    key: "_createParametersList",
    value: function _createParametersList() {
      var _this3 = this;
      var parametersListContainer = dom('div', {
        className: 'sqseobar2-parameters-container'
      });
      var parameters = this._base.plugin.parameters;
      var url = this._base.plugin.parsedUri;
      var autoLoad = this._base.plugin.configuration.mode === 0 && !this._base.plugin.configuration.pinned;
      var createHintBox = this.createHintBox;
      var hasParameters = false;
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var parameter = new SeobarParameterItemFull(parameters[key], url, this._base.plugin.getUUID());
          if (this._parametersGroups.has(parameter.parameter.type)) {
            parameter.createHintBox = createHintBox;
            parameter.setMessenger(this._base.plugin.getMessenger());
            parameter.autoLoad = autoLoad;
            parameter.init();
            this._parametersGroups.get(parameter.parameter.type).add(parameter);
            hasParameters = true;
          }
        }
      }
      if (hasParameters && this._base.plugin.configuration.mode === 1) {
        parametersListContainer.appendChild(this.reloadButtonElement);
        dom.css(this.reloadButtonElement, 'display', null);
      }
      this._parametersGroups.forEach(function (values, type) {
        if (values.size > 0) {
          var title = dom('div', {
            className: 'sqseobar2-parameters-header'
          }, type);
          _this3.t('sqSeobar2_parameters_group_' + type).then(function (text) {
            return dom.text(title, text);
          })["catch"](ignore);
          parametersListContainer.appendChild(title);
          values.forEach(function (parameter) {
            return parametersListContainer.appendChild(parameter.container);
          });
        }
      });
      return parametersListContainer;
    }
  }, {
    key: "_createSpecialButtons",
    value: function _createSpecialButtons() {
      var rightBlock = dom('div', {
        className: 'sqseobar2-specials-container'
      });
      var config = this._base.plugin.configuration;
      config.pageinfoLink && rightBlock.appendChild(this.pageinfoLinkElement);
      config.diagnosisLink && rightBlock.appendChild(this.diagnosisLinkElement);
      config.densityLink && rightBlock.appendChild(this.densityLinkElement);
      config.linkinfoLink && rightBlock.appendChild(this.externalsLinkElement);
      config.linkinfoLink && rightBlock.appendChild(this.internalsLinkElement);
      config.robotsLink && rightBlock.appendChild(this.robotsLinkElement);
      config.sitemapLink && rightBlock.appendChild(this.sitemapLinkElement);
      config.siteauditLink && rightBlock.appendChild(this.siteauditLinkElement);
      return rightBlock;
    }
  }, {
    key: "updatePinned",
    value: function updatePinned(pinned) {
      var _this4 = this;
      this._buttonToggle.element.blur();
      this._base.plugin.setConfigurationItem('seobar.pinned', pinned).then(function () {
        _this4._base.plugin.sendMessage('sq.updateConfiguration')["catch"](ignore);
      })["catch"](ignore);
    }
  }, {
    key: "_handleReloadClick",
    value: function _handleReloadClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this._parametersGroups.forEach(function (group) {
        return group.forEach(function (item) {
          return item.loadData(true);
        });
      });
      dom.css(this.reloadButtonElement, 'display', 'none');
      this.reloadButton.onClick = null;
      this._base.plugin.registerEvent('seobar2', 'requestAllParameters');
    }
  }, {
    key: "handleMakeSmall",
    value: function handleMakeSmall() {
      var _this5 = this;
      this.updatePinned(true);
      this._base.plugin.registerEvent('seobar2', 'Click pin', 'Float mode');
      setTimeout(function () {
        _this5._logoHintBox.show();
        setTimeout(function () {
          return _this5._logoHintBox.hide();
        }, 2000);
      }, 500);
    }
  }, {
    key: "handleMakeBig",
    value: function handleMakeBig() {
      this.updatePinned(false);
      this._base.plugin.registerEvent('seobar2', 'Click pin', 'Fixed mode');
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(e) {
      var _this6 = this;
      setTimeout(function () {
        _this6._scrollBlock.height = _this6._element.offsetHeight - _this6._blockTop.offsetHeight;
      }, 400);
    }
  }, {
    key: "_handleConfigurationUpdate",
    value: function _handleConfigurationUpdate(diff) {
      if (!this._isInit) {
        return;
      }
      var conf = diff[0];
      var param = diff[1];
      if (conf.length > 0 && conf.indexOf('pinned') !== -1) {
        this.minimized = this._base.plugin.configuration.pinned;
      }
      if (conf.length === 1 && conf[0] === 'color') {
        this._updateParametersWidth();
        return;
      }
      if (param.length > 0) {
        if (this._parametersBlock !== null) {
          var shadow = this._parametersBlock.cloneNode(true);
          this._parametersBlock.parentNode.replaceChild(shadow, this._parametersBlock);
          this._parametersBlock = shadow;
          this._parametersGroups.forEach(function (group) {
            group.forEach(function (item) {
              return item.remove();
            });
            group.clear();
          });
        }
        var parameters = this._createParametersList();
        this._parametersGroups.forEach(function (group) {
          return group.forEach(function (item) {
            return item.loadData();
          });
        });
        this._parametersBlock.parentNode.replaceChild(parameters, this._parametersBlock);
        this._parametersBlock = parameters;
      }
    }
  }, {
    key: "handleLogoClick",
    value: function handleLogoClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.handleToggleMinimized(event);
    }
  }, {
    key: "handleToggleMinimized",
    value: function handleToggleMinimized(event) {
      var _this7 = this;
      if (event instanceof KeyboardEvent && event.type === 'keypress') {
        if (!(event.code === 'KeyS' || event.keyCode === 115 || event.keyCode === 83) || event.target !== document.body) {
          return;
        }
      }
      if (dom.hasClass(this._base.panel.element, 'sqseobar2-fixed')) {
        dom.removeClass(this._base.panel.element, 'sqseobar2-fixed');
        if (this._logoHintBox !== null) {
          this.t('sqSeobar2_float_show_hint').then(function (msg) {
            return _this7._logoHintBox.message = msg;
          })["catch"](ignore);
        }
      } else {
        dom.addClass(this._base.panel.element, 'sqseobar2-fixed');
        if (this._logoHintBox !== null) {
          this.t('sqSeobar2_float_hide_hint').then(function (msg) {
            return _this7._logoHintBox.message = msg;
          })["catch"](ignore);
        }
        if (!this._reloaded) {
          this._reloaded = true;
          this._handleReloadClick();
        }
      }
      setTimeout(function () {
        _this7._scrollBlock.height = _this7._element.offsetHeight - _this7._blockTop.offsetHeight;
      }, 400);
    }
  }]);
}(SeobarPanel);
function createHintBoxLeft(element, message) {
  return new HintBox(element, {
    message: message,
    event: 'hover',
    inline: true,
    className: 'seoquake-hintbox seoquake-hintbox-seobar seoquake-hintbox-side-right',
    positionFixed: true,
    offset: {
      left: 10,
      top: -1
    }
  });
}
function createHintBoxRight(element, message) {
  return new HintBox(element, {
    message: message,
    event: 'hover',
    inline: true,
    className: 'seoquake-hintbox seoquake-hintbox-seobar seoquake-hintbox-side-left',
    positionFixed: true,
    offset: {
      left: -10,
      top: -1
    }
  });
}
module.exports = SeobarVerticalPanel;

},{"../dom/main":33,"../effects/HintBox":46,"../effects/ScrollBlock":51,"../effects/ToggleButton":52,"../lib/ignore":63,"./SeobarPanel":105,"./elements/SeobarParameterItemFull":116}],108:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarBase = require('./SeobarBase');
var dom = require('../dom/main');
var SeobarVerticalPanel = require('./SeobarVerticalPanel');
var ignore = require('../lib/ignore');
var SeobarVerticalRight = function (_SeobarBase) {
  function SeobarVerticalRight(plugin) {
    var _this;
    _classCallCheck(this, SeobarVerticalRight);
    _this = _callSuper(this, SeobarVerticalRight, [plugin]);
    _this._panel = null;
    _this._currentWidth = SeobarVerticalRight.WIDTH;
    _this._currentPositionCorrection = {
      left: null,
      bottom: null,
      right: _this._currentWidth,
      top: 0
    };
    _this._widthCorrectedElements = new Set();
    _this._processResizeEvent = _this._handleResizeEvent.bind(_this);
    _this._processUpdateMinimizedEvent = _this._handleUpdateMinimizedEvent.bind(_this);
    return _this;
  }
  _inherits(SeobarVerticalRight, _SeobarBase);
  return _createClass(SeobarVerticalRight, [{
    key: "configurationMenuPosition",
    get: function get() {
      return this._currentPositionCorrection;
    }
  }, {
    key: "hideMenuPosition",
    get: function get() {
      return this._currentPositionCorrection;
    }
  }, {
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "render",
    value: function render() {
      this._fixElements();
      this.fixRight();
      this._panel = new SeobarVerticalPanel(this);
      this._panel.init();
      dom.addClass(this._panel.element, 'sqseobar2-vertical');
      dom.addClass(this._panel.element, 'sqseobar2-vertical-right');
      document.body.appendChild(this._panel.element);
      this.plugin.addEventListener('updateMinimized', this._processUpdateMinimizedEvent);
      this._panel.render();
      this._panel.loadData();
      this.initMozbarIntegration();
    }
  }, {
    key: "remove",
    value: function remove() {
      this.plugin.removeEventListener('updateMinimized', this._processUpdateMinimizedEvent);
      window.removeEventListener('resize', this._processResizeEvent);
      dom.data(document.body, 'sqright', null);
      this._widthCorrectedElements.forEach(function (element) {
        return dom.data(element, 'sqright', null);
      });
      this._widthCorrectedElements.clear();
      this._panel.remove();
      _get(_getPrototypeOf(SeobarVerticalRight.prototype), "remove", this).call(this);
    }
  }, {
    key: "fixRight",
    value: function fixRight() {
      if (this.plugin.configuration.pinned) {
        this.resizeToSmall();
      } else {
        this.resizeToBig();
      }
      window.addEventListener('resize', this._processResizeEvent);
    }
  }, {
    key: "resizeToSmall",
    value: function resizeToSmall() {
      this._restoreElements();
    }
  }, {
    key: "resizeToBig",
    value: function resizeToBig() {
      this._restoreElements();
      this._fixBodyRight();
    }
  }, {
    key: "_handleUpdateMinimizedEvent",
    value: function _handleUpdateMinimizedEvent(minimized) {
      if (minimized) {
        this.resizeToSmall();
      } else {
        this.resizeToBig();
      }
    }
  }, {
    key: "_handleResizeEvent",
    value: function _handleResizeEvent(event) {
      var _this2 = this;
      var width = window.innerWidth;
      this._widthCorrectedElements.forEach(function (element) {
        var style = window.getComputedStyle(element);
        if (style.position !== 'fixed' && style.position !== 'absolute') {
          _this2._widthCorrectedElements["delete"](element);
        } else {
          dom.css(element, {
            width: width - SeobarVerticalRight.WIDTH + 'px'
          });
        }
      });
      this._panel.processResizeEvent(event);
    }
  }, {
    key: "_fixBodyRight",
    value: function _fixBodyRight() {
      var body = document.body;
      var bodyRight = dom.data(body, 'sqright');
      try {
        bodyRight = parseInt(bodyRight);
        if (isNaN(bodyRight)) {
          bodyRight = false;
        }
      } catch (ignore) {
        bodyRight = false;
      }
      if (bodyRight) {
        var margin = parseInt(bodyRight) + parseInt(SeobarVerticalRight.WIDTH);
        body.style.cssText += 'margin-right: ' + margin + 'px !important';
      } else {
        var oldCss = {
          marginRight: body.style.marginRight || null
        };
        var style = window.getComputedStyle(body);
        this._storeElement(body, oldCss);
        var _margin = parseInt(style.marginRight) + parseInt(SeobarVerticalRight.WIDTH);
        body.style.cssText += 'margin-right: ' + _margin + 'px !important';
      }
    }
  }, {
    key: "_fixFixedElement",
    value: function _fixFixedElement(element, style) {
      if (style.visibility === 'hidden' || style.left === 'auto') {
        return;
      }
      if (element.className.indexOf('mozbar-') !== -1) {
        return;
      }
      var left = 0;
      var width = window.innerWidth;
      try {
        left = parseInt(style.left);
        width = parseInt(style.width);
        if (isNaN(left)) {
          return;
        }
        if (isNaN(width)) {
          return;
        }
      } catch (error) {
        ignore(error);
        left = 0;
        width = window.innerWidth;
      }
      var oldCss = {
        left: element.style.left || null,
        width: element.style.width || null
      };
      this._storeElement(element, oldCss);
      dom.css(element, {
        width: width - SeobarVerticalRight.WIDTH + 'px'
      });
    }
  }, {
    key: "_fixFixedElements",
    value: function _fixFixedElements() {
      var _this3 = this;
      var body = document.body;
      Array.from(body.children).forEach(function (element) {
        var parentStyle = window.getComputedStyle(element);
        if (parentStyle.position === 'fixed' || parentStyle.position === 'absolute') {
          _this3._fixFixedElement(element, parentStyle);
        } else {
          Array.from(element.children).forEach(function (child) {
            var style = window.getComputedStyle(child);
            if (style.position === 'fixed' || style.position === 'absolute' && parentStyle.position === 'static') {
              _this3._fixFixedElement(child, style);
            }
          });
        }
      });
    }
  }, {
    key: "integrateWithMozBar",
    value: function integrateWithMozBar() {
      if (!this._positionCorrected) {
        dom.css(this._panel.element, 'top', '43px');
        this._currentPositionCorrection.top = 43;
        _get(_getPrototypeOf(SeobarVerticalRight.prototype), "integrateWithMozBar", this).call(this);
      }
    }
  }, {
    key: "disintegrateWithMozBar",
    value: function disintegrateWithMozBar() {
      if (this._positionCorrected) {
        dom.css(this._panel.element, 'top', '0px');
        _get(_getPrototypeOf(SeobarVerticalRight.prototype), "disintegrateWithMozBar", this).call(this);
      }
    }
  }]);
}(SeobarBase);
SeobarVerticalRight.WIDTH = 200;
module.exports = SeobarVerticalRight;

},{"../dom/main":33,"../lib/ignore":63,"./SeobarBase":100,"./SeobarVerticalPanel":107}],109:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var extend = require('extend');
var dom = require('../../dom/main');
var Dropdown = require('../../effects/Dropdown');
var translateMixin = require('../../utils/translateMixin');
var isEmpty = require('../../lib/isEmpty');
var SeobarCloseDropdown = function (_Dropdown) {
  function SeobarCloseDropdown(container, config) {
    var _this;
    _classCallCheck(this, SeobarCloseDropdown);
    config = extend(true, {}, SeobarCloseDropdown.DEFAULT_CONFIG, config);
    _this = _callSuper(this, SeobarCloseDropdown, [container, config]);
    _this._buttonHide = null;
    _this._buttonClose = null;
    _this._linkConfigure = null;
    _this.processHideClick = _this.handleHideClick.bind(_this);
    _this.processCloseClick = _this.handleCloseClick.bind(_this);
    _this.processLinkClick = _this.handleLinkClick.bind(_this);
    return _this;
  }
  _inherits(SeobarCloseDropdown, _Dropdown);
  return _createClass(SeobarCloseDropdown, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SeobarCloseDropdown.prototype), "init", this).call(this);
      var container = this.body;
      dom.addClass(container, 'seoquake-seobar-close-panel');
      container.appendChild(dom('div', {
        className: 'seoquake-seobar-close-panel_header'
      }, this.t('sqSeobar2_close_header')));
      this._buttonHide = dom('button', {
        className: 'seoquake-seobar-close-panel_hide'
      }, this.t('sqSeobar2_close_button_hide'));
      this._buttonHide.addEventListener('click', this.processHideClick);
      container.appendChild(this._buttonHide);
      this._buttonClose = dom('button', {
        className: 'seoquake-seobar-close-panel_close'
      }, this.t('sqSeobar2_close_button_close'));
      this._buttonClose.addEventListener('click', this.processCloseClick);
      container.appendChild(this._buttonClose);
      this._linkConfigure = dom('a', {
        className: 'seoquake-seobar-close-panel_link'
      }, this.t('sqSeobar2_close_link_whitelist'));
      this._linkConfigure.addEventListener('click', this.processLinkClick);
      container.appendChild(this._linkConfigure);
    }
  }, {
    key: "position",
    value: function position() {
      var result = {
        position: null
      };
      if (!isEmpty(this.config.positionCorrection, 'left')) {
        result.left = this.config.positionCorrection.left + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'right')) {
        result.right = this.config.positionCorrection.right + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'top')) {
        result.top = this.config.positionCorrection.top + 'px';
      }
      if (!isEmpty(this.config.positionCorrection, 'bottom')) {
        result.bottom = this.config.positionCorrection.bottom + 'px';
      }
      dom.css(this._body, result);
    }
  }, {
    key: "handleHideClick",
    value: function handleHideClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('hideClick');
    }
  }, {
    key: "handleCloseClick",
    value: function handleCloseClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('closeClick');
    }
  }, {
    key: "handleLinkClick",
    value: function handleLinkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('linkClick');
    }
  }]);
}(Dropdown);
SeobarCloseDropdown.DEFAULT_CONFIG = {
  button: 'left',
  preventDefault: true,
  stopPropagation: false,
  autoHide: true,
  bodyClickHide: true,
  toggle: true,
  containerClass: 'seoquake-dropdown-container',
  positionFixed: true,
  positionCorrection: {
    left: null,
    top: 11,
    right: -5,
    bottom: null
  }
};
translateMixin(SeobarCloseDropdown.prototype);
module.exports = SeobarCloseDropdown;

},{"../../dom/main":33,"../../effects/Dropdown":43,"../../lib/isEmpty":66,"../../utils/translateMixin":154,"extend":164}],110:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../../dom/main');
var eventsMixin = require('../../utils/eventsMixin');
var SeobarLink = function () {
  function SeobarLink(title, className, disabledClassName) {
    _classCallCheck(this, SeobarLink);
    title = title || 'Link';
    className = className || 'sqseobar2-link';
    disabledClassName = disabledClassName || 'sqseobar2-link-disabled';
    this._titleText = title;
    this._title = dom('span', {}, this._titleText);
    this._link = dom('a', {
      className: className
    }, this._title);
    this._handler = null;
    this._disabled = false;
    this._disabledClass = disabledClassName;
  }
  return _createClass(SeobarLink, [{
    key: "element",
    get: function get() {
      return this._link;
    }
  }, {
    key: "onClick",
    get: function get() {
      return this._handler;
    },
    set: function set(handler) {
      handler = handler || null;
      if (this._disabled) {
        this._handler = handler;
      } else {
        if (this._handler !== null) {
          this._link.removeEventListener('click', this._handler);
          this._handler = null;
        }
        if (handler !== null) {
          this._handler = handler;
          this._link.addEventListener('click', this._handler);
        }
      }
    }
  }, {
    key: "disabled",
    get: function get() {
      return this._disabled;
    },
    set: function set(value) {
      if (value === this._disabled) {
        return;
      }
      this._disabled = value;
      if (value) {
        if (this._handler !== null) {
          this._link.removeEventListener('click', this._handler);
        }
        this._link.addEventListener('click', preventDefault);
        if (this._disabledClass !== '') {
          dom.addClass(this._link, this._disabledClass);
        }
      } else {
        this._link.removeEventListener('click', preventDefault);
        if (this._handler !== null) {
          this._link.addEventListener('click', this._handler);
        }
        if (this._disabledClass !== '') {
          dom.removeClass(this._link, this._disabledClass);
        }
      }
      this.dispatchEvent('afterChangeDisabled', value);
    }
  }, {
    key: "title",
    get: function get() {
      return this._titleText;
    },
    set: function set(value) {
      this._titleText = value;
      dom.text(this._title, value);
      this.dispatchEvent('afterChangeTitle', value, true);
    }
  }]);
}();
eventsMixin(SeobarLink.prototype);
function preventDefault(event) {
  event.stopPropagation();
  event.preventDefault();
}
module.exports = SeobarLink;

},{"../../dom/main":33,"../../utils/eventsMixin":148}],111:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarLinkWithValue = require('./SeobarLinkWithValue');
var dom = require('../../dom/main');
var STATE = require('../../diagnosis/DiagnosisStates');
var SeobarLinkDiagnosisResult = function (_SeobarLinkWithValue) {
  function SeobarLinkDiagnosisResult(title, className, value) {
    var _this;
    _classCallCheck(this, SeobarLinkDiagnosisResult);
    _this = _callSuper(this, SeobarLinkDiagnosisResult, [title, className, value]);
    dom.attr(_this._link, 'target', '_blank');
    return _this;
  }
  _inherits(SeobarLinkDiagnosisResult, _SeobarLinkWithValue);
  return _createClass(SeobarLinkDiagnosisResult, [{
    key: "result",
    set: function set(value) {
      dom.attr(this._link, 'href', value.url);
      switch (value.status) {
        case STATE.STATE_GOOD:
          this.value = 'ok';
          dom.addClass(this._link, 'sqseobar2-link-diagnosis-good');
          dom.attr(this._value, 'title', 'Detected and ok');
          break;
        case STATE.STATE_AVERAGE:
          this.value = 'can\'t detect';
          dom.addClass(this._link, 'sqseobar2-link-diagnosis-na');
          dom.attr(this._value, 'title', 'Some error on detection');
          break;
        default:
          this.value = 'bad';
          dom.addClass(this._link, 'sqseobar2-link-diagnosis-bad');
          dom.attr(this._value, 'title', 'Not detected or bad');
      }
    }
  }]);
}(SeobarLinkWithValue);
module.exports = SeobarLinkDiagnosisResult;

},{"../../diagnosis/DiagnosisStates":16,"../../dom/main":33,"./SeobarLinkWithValue":113}],112:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarLinkWithValue = require('./SeobarLinkWithValue');
var SemrushApi = require('../../semrush/SemrushApi');
var dom = require('../../dom/main');
var SiteauditDropdownDetails = require('../../siteaudit/SiteauditDropdownDetails');
var SiteauditDropdownCreate = require('../../siteaudit/SiteauditDropdownCreate');
var SiteauditDropdownConnect = require('../../siteaudit/SiteauditDropdownConnect');
var SiteauditDropdownNodata = require('../../siteaudit/SiteauditDropdownNodata');
var translateMixin = require('../../utils/translateMixin');
var SeobarLinkSiteaudit = function (_SeobarLinkWithValue) {
  function SeobarLinkSiteaudit(title, className, value) {
    var _this;
    _classCallCheck(this, SeobarLinkSiteaudit);
    _this = _callSuper(this, SeobarLinkSiteaudit, [title, className, value]);
    _this._currentProject = null;
    _this._details = null;
    _this._api = new SemrushApi();
    _this.processPageAuditResult = _this.handlePageAuditResults.bind(_this);
    _this.processPageAuditError = _this.handlePageAuditError.bind(_this);
    _this.processOnClick = _this.handleOnClick.bind(_this);
    return _this;
  }
  _inherits(SeobarLinkSiteaudit, _SeobarLinkWithValue);
  return _createClass(SeobarLinkSiteaudit, [{
    key: "setMessenger",
    value: function setMessenger(client) {
      this._api.setMessenger(client);
    }
  }, {
    key: "getMessenger",
    value: function getMessenger() {
      return this._api.getMessenger();
    }
  }, {
    key: "findCurrentProject",
    value: function findCurrentProject(projects) {
      var _this2 = this;
      var domain = document.location.host.toString();
      return projects.some(function (project) {
        if (domain.endsWith(project.root_domain) && project.tools.some(SeobarLinkSiteaudit.hasSiteaudit)) {
          _this2._currentProject = project;
          return true;
        }
        return false;
      });
    }
  }, {
    key: "createDropdown",
    value: function createDropdown(Which, arg) {
      var result = new Which(arg);
      result.setMessenger(this._api.getMessenger());
      result.setTranslateFunction(this.getTranslateFunction());
      result.init();
      return result;
    }
  }, {
    key: "_createDetailsPanel",
    value: function _createDetailsPanel(result) {
      dom.removeClass(this.element, 'loading');
      this._details = this.createDropdown(SiteauditDropdownDetails, result);
      this.element.href = SeobarLinkSiteaudit.RESULT_URL + this._currentProject.project_id + '/review/' + '?' + SeobarLinkSiteaudit.REFERENCE + '#pagereport/' + result.id + '/';
      if (result.errors + result.warnings > 0) {
        this.value = result.errors + result.warnings;
      } else {
        this.value = '0';
      }
      if (result.errors > 0) {
        dom.addClass(this.element, 'siteaudit-errors');
      } else if (result.warnings > 0) {
        dom.addClass(this.element, 'siteaudit-warnings');
      } else if (result.notices > 0) {
        dom.addClass(this.element, 'siteaudit-notices');
      } else {
        dom.addClass(this.element, 'siteaudit-ok');
      }
      this.onClick = this.processOnClick;
    }
  }, {
    key: "_switchLinkState",
    value: function _switchLinkState(text, link, panel) {
      dom.removeClass(this.element, 'loading');
      if (this._details !== null) {
        this._details.remove();
      }
      this._details = panel;
      this.value = text;
      this.element.href = link;
      this.onClick = this.processOnClick;
    }
  }, {
    key: "process",
    value: function process() {
      var _this3 = this;
      var url = document.location.toString();
      if (document.location.pathname.toString() === '/') {
        url = document.location.protocol + '//' + document.location.host.toString();
      }
      dom.addClass(this.element, 'loading');
      this.value = 'wait...';
      this._api.getProjectsList().then(function (projects) {
        if (_this3.findCurrentProject(projects)) {
          _this3._api.getPageAudit(_this3._currentProject.project_id, url).then(_this3.processPageAuditResult)["catch"](_this3.processPageAuditError);
        } else {
          var _url = SeobarLinkSiteaudit.PROJECTS_URL + '?' + SeobarLinkSiteaudit.REFERENCE + '#create';
          _this3._switchLinkState('n/a', _url, _this3.createDropdown(SiteauditDropdownCreate));
        }
      })["catch"](function (reason) {
        return _this3._switchLinkState('n/a', '#', _this3.createDropdown(SiteauditDropdownConnect));
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._details !== null) {
        this._details.remove();
      }
    }
  }, {
    key: "handlePageAuditResults",
    value: function handlePageAuditResults(result) {
      if (!('total' in result) || !('data' in result)) {
        return null;
      }
      if (result.total > 0 && result.data[0] !== null) {
        this._createDetailsPanel(result.data[0]);
      } else {
        this.handlePageAuditError();
      }
      return null;
    }
  }, {
    key: "handlePageAuditError",
    value: function handlePageAuditError() {
      this._switchLinkState('n/a', SeobarLinkSiteaudit.RESULT_URL + this._currentProject.project_id + '/review/' + '?' + SeobarLinkSiteaudit.REFERENCE + '#pagereport/', this.createDropdown(SiteauditDropdownNodata));
    }
  }, {
    key: "handleOnClick",
    value: function handleOnClick(event) {
      event.preventDefault();
      this._details.show(this.element);
      this._api.registerEvent('seobar2', 'SA Issues opened', this._details.eventLabel);
    }
  }], [{
    key: "hasSiteaudit",
    value: function hasSiteaudit(item) {
      return item.hasOwnProperty('tool') && item.tool === 'siteaudit';
    }
  }]);
}(SeobarLinkWithValue);
translateMixin(SeobarLinkSiteaudit.prototype);
SeobarLinkSiteaudit.PROJECTS_URL = 'https://www.semrush.com/projects/';
SeobarLinkSiteaudit.RESULT_URL = 'https://www.semrush.com/siteaudit/campaign/';
SeobarLinkSiteaudit.REFERENCE = 'utm_source=seoquake&utm_medium=toolbar&utm_campaign=oauth&ref=174537735';
module.exports = SeobarLinkSiteaudit;

},{"../../dom/main":33,"../../semrush/SemrushApi":98,"../../siteaudit/SiteauditDropdownConnect":136,"../../siteaudit/SiteauditDropdownCreate":137,"../../siteaudit/SiteauditDropdownDetails":138,"../../siteaudit/SiteauditDropdownNodata":139,"../../utils/translateMixin":154,"./SeobarLinkWithValue":113}],113:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarLink = require('./SeobarLink');
var dom = require('../../dom/main');
var SeobarLinkWithValue = function (_SeobarLink) {
  function SeobarLinkWithValue(title, className, value) {
    var _this;
    _classCallCheck(this, SeobarLinkWithValue);
    value = value || '';
    _this = _callSuper(this, SeobarLinkWithValue, [title, className]);
    _this._valueText = value;
    _this._value = dom('span', {
      className: 'sqseobar2-link-value'
    }, _this._valueText);
    _this._link.appendChild(_this._value);
    return _this;
  }
  _inherits(SeobarLinkWithValue, _SeobarLink);
  return _createClass(SeobarLinkWithValue, [{
    key: "value",
    get: function get() {
      return this._valueText;
    },
    set: function set(value) {
      this._valueText = String(value);
      dom.text(this._value, this._valueText);
    }
  }]);
}(SeobarLink);
module.exports = SeobarLinkWithValue;

},{"../../dom/main":33,"./SeobarLink":110}],114:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var MoreDropdown = require('../../effects/MoreDropdown');
var dom = require('../../dom/main');
var extend = require('extend');
var SeobarMoreDropdown = function (_MoreDropdown) {
  function SeobarMoreDropdown(container, dropdownButton, config) {
    var _this;
    _classCallCheck(this, SeobarMoreDropdown);
    config = extend(true, {}, SeobarMoreDropdown.DEFAULT_CONFIG, config);
    _this = _callSuper(this, SeobarMoreDropdown, [container, dropdownButton, config]);
    _this._dropdownList = null;
    _this._dropdownMessage = null;
    _this._dropdownButtonTry = null;
    _this._processButtonClick = _this._handleButtonClick.bind(_this);
    _this._processDropdownShow = _this._handleDropdownShow.bind(_this);
    return _this;
  }
  _inherits(SeobarMoreDropdown, _MoreDropdown);
  return _createClass(SeobarMoreDropdown, [{
    key: "dropdownList",
    get: function get() {
      return this._dropdownList;
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(SeobarMoreDropdown.prototype), "init", this).call(this);
      this.dropdown.addEventListener('show', this._processDropdownShow);
      this._dropdownList = dom('div');
      this._dropdownMessage = dom('div', {
        className: 'sqseobar2-more-dropdown-message'
      });
      this._dropdownButtonTry = dom('div', {
        className: 'sqseobar2-more-dropdown-button'
      });
      this._dropdownButtonTry.addEventListener('click', this._processButtonClick);
      this.t('sqSeobar2_switch_to_vertical').then(function (text) {
        return dom.text(_this2._dropdownMessage, text);
      });
      this.t('sqSeobar2_switch_to_vertical_button').then(function (text) {
        return dom.text(_this2._dropdownButtonTry, text);
      });
      this.dropdown.body.appendChild(this._dropdownList);
      this.dropdown.body.appendChild(this._dropdownMessage);
      this.dropdown.body.appendChild(this._dropdownButtonTry);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this.dropdown.removeEventListener('show', this._processDropdownShow);
      this._dropdownButtonTry.removeEventListener('click', this._processButtonClick);
      _get(_getPrototypeOf(SeobarMoreDropdown.prototype), "remove", this).call(this);
    }
  }, {
    key: "_handleButtonClick",
    value: function _handleButtonClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('buttonClick');
    }
  }, {
    key: "_handleDropdownShow",
    value: function _handleDropdownShow() {
      this.dispatchEvent('dropdownShow');
    }
  }]);
}(MoreDropdown);
SeobarMoreDropdown.DEFAULT_CONFIG = {
  dropdownConfig: {
    positionFixed: true,
    toggle: true
  }
};
require('../../utils/translateMixin')(SeobarMoreDropdown.prototype);
module.exports = SeobarMoreDropdown;

},{"../../dom/main":33,"../../effects/MoreDropdown":47,"../../utils/translateMixin":154,"extend":164}],115:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var RenderObject = require('../../utils/RenderObject').RenderObject;
var lib = require('../../Lib');
var dom = require('../../dom/main');
var textUtils = require('../../dom/textUtils');
var normalizeNumber = require('../../utils/normalizeNumber');
var HintBox = require('../../effects/HintBox');
var ignore = require('../../lib/ignore');
var SeobarParameterItem = function () {
  function SeobarParameterItem(parameter, url, sender) {
    _classCallCheck(this, SeobarParameterItem);
    this._parameter = parameter;
    this._url = url;
    this._value = null;
    this._element = null;
    this._visible = false;
    this._requestUrl = null;
    this._sourceUrl = null;
    this._naUrl = null;
    this._valueHintBox = null;
    this._errorCounter = 0;
    this._requestParameterListener = null;
    this._autoLoad = true;
    this._createHintBox = null;
    this._sender = sender;
    this._processShowSourceClick = this._handleShowSourceClick.bind(this);
  }
  return _createClass(SeobarParameterItem, [{
    key: "autoLoad",
    get: function get() {
      return this._autoLoad;
    },
    set: function set(value) {
      this._autoLoad = value;
    }
  }, {
    key: "parameter",
    get: function get() {
      return this._parameter;
    }
  }, {
    key: "createHintBox",
    get: function get() {
      if (this._createHintBox === null) {
        return function () {
          return null;
        };
      }
      return this._createHintBox;
    },
    set: function set(value) {
      this._createHintBox = value;
    }
  }, {
    key: "requestUrl",
    get: function get() {
      if (this._requestUrl === null) {
        if (this._parameter.hasOwnProperty('url-r')) {
          this._requestUrl = lib.createRequestUrl(this._parameter['url-r'], this._url);
        } else if (this._parameter.hasOwnProperty('url-s')) {
          this._requestUrl = lib.createRequestUrl(this._parameter['url-s'], this._url);
        } else {
          this._requestUrl = this._url;
        }
      }
      return this._requestUrl;
    }
  }, {
    key: "sourceUrl",
    get: function get() {
      if (this._sourceUrl === null) {
        if (this._parameter.hasOwnProperty('url-s')) {
          this._sourceUrl = lib.createRequestUrl(this._parameter['url-s'], this._url);
        } else if (this._parameter.hasOwnProperty('url-r')) {
          this._sourceUrl = lib.createRequestUrl(this._parameter['url-r'], this._url);
        } else {
          this._sourceUrl = this._url;
        }
      }
      return this._sourceUrl;
    }
  }, {
    key: "naUrl",
    get: function get() {
      if (this._naUrl === null) {
        if (this._parameter.hasOwnProperty('url-na')) {
          this._naUrl = this._parameter['url-na'];
        } else {
          this._naUrl = this.sourceUrl;
        }
      }
      return this._naUrl;
    }
  }, {
    key: "init",
    value: function init() {
      this._element = dom('a', {
        href: this.requestUrl,
        target: '_blank',
        className: 'seoquake-params-request'
      });
      if (!('matches' in this._parameter)) {
        dom.text(this._element, this._parameter.title);
        this._element.addEventListener('click', this._processShowSourceClick, true);
      }
      this._visible = true;
    }
  }, {
    key: "createIcon",
    value: function createIcon() {
      if (this.parameter.hasOwnProperty('icon')) {
        var icn = this.parameter.icon;
        var icon = null;
        if (icn.startsWith('//') || icn.startsWith('http://') || icn.startsWith('https://')) {
          icon = dom('img', {
            src: this.parameter.icon
          });
        } else {
          icon = dom('span', {
            className: 'sqicn sqicn-' + this.parameter.icon
          });
        }
        if (icon !== null) {
          this._container.appendChild(icon);
        }
      }
    }
  }, {
    key: "element",
    get: function get() {
      if (this._visible) {
        return this._element;
      }
      return null;
    }
  }, {
    key: "value",
    set: function set(value) {
      this._value = value;
      this.render();
    }
  }, {
    key: "loadData",
    value: function loadData(force) {
      var _this = this;
      if (!this._visible) {
        return;
      }
      if (!('matches' in this._parameter)) {
        return;
      }
      if (force) {
        this.autoLoad = true;
      }
      var requestUrl = lib.createRequestUrl(this._parameter['url-r'], this._url);
      var renderObject = new RenderObject(requestUrl);
      renderObject.addParam(this._parameter.id);
      var request = {
        payload: {
          render: renderObject,
          onlyCache: !this._autoLoad
        },
        plugin: 'seobar',
        sender: this._sender
      };
      if (this._autoLoad) {
        this.value = lib.SEOQUAKE_RESULT_WAIT;
      }
      if (this._value === null) {
        this.value = lib.SEOQUAKE_RESULT_QUESTION;
      }
      return this.sendMessage('sq.requestParameter', request).then(function (result) {
        return _this.value = result.values[_this._parameter.id] || lib.SEOQUAKE_RESULT_QUESTION;
      })["catch"](ignore);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._visible) {
        return;
      }
      dom.removeClass(this._element, SeobarParameterItem.ERROR_CLASS);
      dom.removeClass(this._element, SeobarParameterItem.ACTIVE_CLASS);
      this._element.removeEventListener('click', SeobarParameterItem.preventDefaultListener, true);
      this._element.removeEventListener('click', this.requestParameterListener, true);
      switch (this._value) {
        case lib.SEOQUAKE_RESULT_NODATA:
          this._element.href = this.naUrl;
          dom.text(this._element, 'n/a');
          break;
        case lib.SEOQUAKE_RESULT_ERROR:
          this._element.href = this.sourceUrl;
          this._errorCounter++;
          if (this._errorCounter < 2) {
            this._element.addEventListener('click', SeobarParameterItem.preventDefaultListener, true);
            this._element.addEventListener('click', this.requestParameterListener, true);
            this._value = lib.SEOQUAKE_RESULT_QUESTION;
          }
          dom.addClass(this._element, SeobarParameterItem.ERROR_CLASS);
          dom.text(this._element, '!');
          break;
        case lib.SEOQUAKE_RESULT_QUESTION:
          this._element.href = '#';
          this._element.addEventListener('click', SeobarParameterItem.preventDefaultListener, true);
          this._element.addEventListener('click', this.requestParameterListener, true);
          dom.setContent(this._element, dom('i', {
            className: 'sqseobar2-icon sqseobar2-load'
          }));
          break;
        case lib.SEOQUAKE_RESULT_WAIT:
          this._element.href = '#';
          this._element.addEventListener('click', SeobarParameterItem.preventDefaultListener, true);
          dom.setContent(this._element, dom('i', {
            className: 'sqseobar2-icon sqseobar2-load'
          }));
          dom.addClass(this._element, SeobarParameterItem.ACTIVE_CLASS);
          break;
        case lib.SEOQUAKE_RESULT_YES:
        default:
          this._element.href = this.sourceUrl;
          this._element.addEventListener('click', this._processShowSourceClick, true);
          this._renderValue(textUtils.decode(this._value));
      }
    }
  }, {
    key: "_renderValue",
    value: function _renderValue(text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
        this._valueHintBox = this.createHintBox(this._element, display.value);
      }
      dom.text(this._element, text);
    }
  }, {
    key: "requestParameterHandler",
    value: function requestParameterHandler(event) {
      event.preventDefault();
      event.stopPropagation();
      this.loadData(true);
      this.registerEvent('seobar2', 'loadParameterValue', this._parameter.id);
    }
  }, {
    key: "requestParameterListener",
    get: function get() {
      if (this._requestParameterListener === null) {
        this._requestParameterListener = this.requestParameterHandler.bind(this);
      }
      return this._requestParameterListener;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._valueHintBox !== null) {
        this._valueHintBox.remove();
        this._valueHintBox = null;
      }
      if (this._visible) {
        this._element.removeEventListener('click', SeobarParameterItem.preventDefaultListener, true);
        this._element.removeEventListener('click', this.requestParameterListener, true);
        this._element.removeEventListener('click', this._processShowSourceClick, true);
        dom.removeElement(this._element);
      }
      this._parameter = null;
      this._url = null;
      this._value = null;
      this._element = null;
      this._visible = false;
      this._requestUrl = null;
      this._sourceUrl = null;
      this._errorCounter = 0;
      this._requestParameterListener = null;
    }
  }, {
    key: "_handleShowSourceClick",
    value: function _handleShowSourceClick(event) {
      if (this.sourceUrl.match(/^view-source:/i) !== null) {
        event.preventDefault();
        event.stopPropagation();
        this.sendMessage('sq.openTab', this.sourceUrl)["catch"](ignore);
      }
      this.registerEvent('seobar2', 'showParameterSource', this._parameter.id);
    }
  }], [{
    key: "preventDefaultListener",
    value: function preventDefaultListener(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }]);
}();
SeobarParameterItem.ERROR_CLASS = 'sqseobar2-error';
SeobarParameterItem.ACTIVE_CLASS = 'sqseobar2-active';
require('../../utils/messengerMixin')(SeobarParameterItem.prototype);
module.exports = SeobarParameterItem;

},{"../../Lib":7,"../../dom/main":33,"../../dom/textUtils":40,"../../effects/HintBox":46,"../../lib/ignore":63,"../../utils/RenderObject":143,"../../utils/messengerMixin":150,"../../utils/normalizeNumber":153}],116:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarParameterItem = require('./SeobarParameterItem');
var dom = require('../../dom/main');
var normalizeNumber = require('../../utils/normalizeNumber');
var SeobarParameterItemFull = function (_SeobarParameterItem) {
  function SeobarParameterItemFull(parameter, url, sender) {
    var _this;
    _classCallCheck(this, SeobarParameterItemFull);
    _this = _callSuper(this, SeobarParameterItemFull, [parameter, url, sender]);
    _this._hintBox = null;
    return _this;
  }
  _inherits(SeobarParameterItemFull, _SeobarParameterItem);
  return _createClass(SeobarParameterItemFull, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SeobarParameterItemFull.prototype), "init", this).call(this);
      this._container = dom('div', {
        className: 'sqseobar2-parameterItemInline'
      });
      this.createIcon();
      if (this.parameter.hasOwnProperty('matches')) {
        var titleBox = dom('span', {
          className: 'sqseobar2-parameterItemInline-title'
        }, this.parameter.name);
        this._container.appendChild(titleBox);
        this._hintBox = this.createHintBox(this._container, this.parameter.name);
      }
      this._container.appendChild(this.element);
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._visible) {
        _get(_getPrototypeOf(SeobarParameterItemFull.prototype), "remove", this).call(this);
        dom.emptyElement(this._container);
        dom.removeElement(this._container);
      }
      delete this._container;
    }
  }, {
    key: "_renderValue",
    value: function _renderValue(text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
      }
      dom.text(this._element, text);
      if (this._hintBox) {
        this._hintBox.message = this.parameter.name + ': ' + text;
      }
    }
  }]);
}(SeobarParameterItem);
module.exports = SeobarParameterItemFull;

},{"../../dom/main":33,"../../utils/normalizeNumber":153,"./SeobarParameterItem":115}],117:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SeobarParameterItem = require('./SeobarParameterItem');
var dom = require('../../dom/main');
var normalizeNumber = require('../../utils/normalizeNumber');
var SeobarParameterItemInline = function (_SeobarParameterItem) {
  function SeobarParameterItemInline(parameter, url, sender) {
    var _this;
    _classCallCheck(this, SeobarParameterItemInline);
    _this = _callSuper(this, SeobarParameterItemInline, [parameter, url, sender]);
    _this._hintBox = null;
    return _this;
  }
  _inherits(SeobarParameterItemInline, _SeobarParameterItem);
  return _createClass(SeobarParameterItemInline, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SeobarParameterItemInline.prototype), "init", this).call(this);
      this._container = dom('div', {
        className: 'sqseobar2-parameterItemInline'
      });
      this.createIcon();
      if (this.parameter.hasOwnProperty('matches')) {
        var titleBox = dom('span', {
          className: 'sqseobar2-parameterItemInline-title sqseobar2-parameterItemInline-title-full'
        }, this.parameter.name);
        var shortTitleBox = dom('span', {
          className: 'sqseobar2-parameterItemInline-title'
        }, this.parameter.title);
        this._hintBox = this.createHintBox(this._container, this.parameter.name);
        var config = this._hintBox.config;
        config.offset.left = 5;
        if (config.offset.top === null) {
          config.offset.top = 5;
        }
        this._hintBox.config = config;
        this._container.appendChild(titleBox);
        this._container.appendChild(shortTitleBox);
      }
      this._container.appendChild(this.element);
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._visible) {
        _get(_getPrototypeOf(SeobarParameterItemInline.prototype), "remove", this).call(this);
        dom.emptyElement(this._container);
        dom.removeElement(this._container);
      }
      if (this._hintBox !== null) {
        this._hintBox.remove();
      }
      delete this._container;
      delete this._title;
    }
  }, {
    key: "_renderValue",
    value: function _renderValue(text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
      }
      dom.text(this._element, text);
      if (this._hintBox) {
        this._hintBox.message = this.parameter.name + ': ' + text;
      }
    }
  }]);
}(SeobarParameterItem);
module.exports = SeobarParameterItemInline;

},{"../../dom/main":33,"../../utils/normalizeNumber":153,"./SeobarParameterItem":115}],118:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var extend = require('extend');
var messengerModuleMixin = require('../utils/messengerModuleMixin');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var pluginHighlightMixin = require('../pluginHighlightMixin');
var eventsMixin = require('../utils/eventsMixin');
var ignore = require('../lib/ignore');
var checkMatch = require('../lib/checkMatch');
var diffMaps = require('../lib/diffMaps');
var diffObjects = require('../lib/diffObjects');
var ControlPanel = require('./SERPControlPanel');
var dom = require('../dom/main');
var determineParamsType = require('../parameters/determineParamsType');
var modifyParams = require('../parameters/modifyParams');
var sortParams = require('../parameters/sortParams');
var textUtils = require('../dom/textUtils');
var normalizeNumber = require('../utils/normalizeNumber');
var lib = require('../Lib');
var SERPRequestObject = require('./SERPRequestObject');
var CreateFileNameSync = require('../utils/CreateFilenameSync');
var ToggleButton = require('../effects/ToggleButton');
var SEMrushParametersPanels = require('./elements/SEMrushParametersPanels');
var BaseSERPPlugin = function () {
  function BaseSERPPlugin() {
    _classCallCheck(this, BaseSERPPlugin);
    this._name = '';
    this._match = [];
    this._exclude = [];
    this._configuration = {};
    this._parameters = new Map();
    this._isRunning = false;
    this._isInit = false;
    this._controlPanel = null;
    this._resultIndexes = new Set();
    this._parametersPanels = new Set();
    this._urls = new Map();
    this._requestUrls = new Map();
    this._searchQuery = '';
    this._searchQuerySelector = null;
    this._semrushPanels = null;
    this.processDetach = this.handleDetach.bind(this);
    this.processConfigurationUpdate = this.handleConfigurationUpdate.bind(this);
    this.processSetConfiguration = this.handleSetConfiguration.bind(this);
    this.processSwitchOff = this.handleSwitchOff.bind(this);
    this.processSwitchOn = this.handleSwitchOn.bind(this);
    this.processParameterRequestClick = this.handleParameterRequestClick.bind(this);
    this.processParametersLoadRowClick = this.handleParametersLoadRowClick.bind(this);
    this.processParametersRequestAll = this.handleParametersRequestAll.bind(this);
    this.processParameterShowSourceClick = this.handleParameterShowSourceClick.bind(this);
    this.processOpenConfiguration = this.handleOpenConfiguration.bind(this);
    this.processParametersUpdate = this.handleParametersUpdate.bind(this);
    this.processRequestDone = this.handleRequestDone.bind(this);
  }
  return _createClass(BaseSERPPlugin, [{
    key: "name",
    get: function get() {
      return this._name;
    },
    set: function set(value) {
      this._name = value;
    }
  }, {
    key: "match",
    get: function get() {
      return this._match;
    },
    set: function set(value) {
      this._match = value;
    }
  }, {
    key: "exclude",
    get: function get() {
      return this._exclude;
    },
    set: function set(value) {
      this._exclude = value;
    }
  }, {
    key: "configuration",
    get: function get() {
      return this._configuration;
    },
    set: function set(value) {
      var newConfiguration = extend(true, {}, value);
      var changes = diffObjects(this._configuration, newConfiguration, diffObjects.areObjectsSame);
      this._configuration = newConfiguration;
      this.afterConfigurationUpdate(changes);
    }
  }, {
    key: "pluginConfiguration",
    get: function get() {
      return this.configuration.core;
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._parameters;
    },
    set: function set(value) {
      var newParameters = new Map();
      if (value instanceof Map) {
        newParameters = value;
      } else {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            newParameters.set(key, value[key]);
          }
        }
      }
      var changed = diffMaps(this._parameters, newParameters, diffObjects.areObjectsSame);
      this._parameters = newParameters;
      this.afterParametersUpdate(changed);
    }
  }, {
    key: "controlPanel",
    get: function get() {
      return this._controlPanel;
    }
  }, {
    key: "controlPanelTop",
    get: function get() {
      return 150;
    }
  }, {
    key: "controlPanelOffsetTop",
    get: function get() {
      return 0;
    }
  }, {
    key: "urls",
    get: function get() {
      return this._urls;
    }
  }, {
    key: "searchQuery",
    get: function get() {
      if (true || this._searchQuery === '') {
        if (this._searchQuerySelector === null) {
          this._searchQuery = 'empty';
        } else {
          var searchQueryElement = document.querySelector(this._searchQuerySelector);
          if (!searchQueryElement) {
            this._searchQuery = 'empty';
          } else {
            this._searchQuery = dom.value(searchQueryElement) || 'empty';
          }
        }
      }
      return this._searchQuery;
    }
  }, {
    key: "semrushPanels",
    get: function get() {
      return this._semrushPanels;
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (!checkMatch(this.match, this.exclude)) {
        this._isInit = false;
        return;
      }
      this.getConfiguration().then(function (configuration) {
        _this.configuration = configuration;
        return _this.getPluginParameters();
      }).then(function (parameters) {
        _this.parameters = parameters;
        return _this.run();
      })["catch"](ignore);
      this.addMessageListener('sq.updateConfiguration', this.processConfigurationUpdate);
      this.addMessageListener('detach', this.processDetach);
      this._isInit = true;
    }
  }, {
    key: "initSEMrushParametersPanels",
    value: function initSEMrushParametersPanels() {
      this._semrushPanels = new SEMrushParametersPanels(this);
      this._semrushPanels.init();
    }
  }, {
    key: "run",
    value: function run() {
      if (!this._isInit) {
        return;
      }
      if (this._isRunning) {
        return;
      }
      this.initSEMrushParametersPanels();
      if (!this.configuration.core.disabled) {
        this.addControlPanel();
        if (!this.pluginConfiguration.disabled) {
          this.addParametersPanels();
          if (!this.configuration.core.disable_serps_pos_numbers) {
            this.addIndexes();
          }
          if (!this.configuration.core.disable_highlight_sites) {
            this.doHighlightSites(this.configuration.core.highlight_sites, this.configuration.core.highlight_sites_color);
          }
        }
      }
      this._isRunning = true;
    }
  }, {
    key: "removeIndexes",
    value: function removeIndexes() {
      this._resultIndexes.forEach(function (item) {
        return item.remove();
      });
      this._resultIndexes.clear();
    }
  }, {
    key: "removeParametersPanels",
    value: function removeParametersPanels() {
      Array.from(document.querySelectorAll('.seoquake-params-link')).forEach(function (link) {
        dom.attr(link, 'rel', null);
        dom.removeClass(link, 'seoquake-params-link');
      });
      this._parametersPanels.forEach(function (item) {
        return dom.removeElement(item);
      });
      this._parametersPanels.clear();
      this._urls.clear();
      this._semrushPanels.removePanels();
    }
  }, {
    key: "removeControlPanel",
    value: function removeControlPanel() {
      if (this._controlPanel !== null) {
        this._controlPanel.remove();
        this._controlPanel = null;
      }
    }
  }, {
    key: "addControlPanel",
    value: function addControlPanel() {
      if (this._controlPanel !== null) {
        return;
      }
      this._controlPanel = new ControlPanel(this);
      this._controlPanel.setTranslateFunction(this.t.bind(this));
      document.body.appendChild(this._controlPanel.element);
      this._controlPanel["float"] = true;
      this._controlPanel.addEventListener('turnOff', this.processSwitchOff);
      this._controlPanel.addEventListener('turnOn', this.processSwitchOn);
      this._controlPanel.addEventListener('requestAll', this.processParametersRequestAll);
      this._controlPanel.addEventListener('openConfiguration', this.processOpenConfiguration);
      this._controlPanel.addEventListener('parametersUpdate', this.processParametersUpdate);
    }
  }, {
    key: "addIndexes",
    value: function addIndexes() {}
  }, {
    key: "addParametersPanels",
    value: function addParametersPanels() {}
  }, {
    key: "parseRelAttr",
    value: function parseRelAttr(rel, skipInnerCheck) {
      if (!rel) {
        return null;
      }
      rel = rel.split(' ');
      if (rel.length !== 2) {
        return null;
      }
      rel[1] = rel[1].split('_');
      var result = {
        urlHash: rel[0],
        requestUrlHash: rel[1][0],
        paramId: rel[1][1]
      };
      if (skipInnerCheck !== true) {
        if (result.requestUrlHash !== 'x' && !this._requestUrls.has(result.requestUrlHash)) {
          return null;
        }
      }
      return result;
    }
  }, {
    key: "renderErrorValue",
    value: function renderErrorValue(button, href) {
      button.href = href;
      var errorsCounter = dom.data(button, 'error-clicks');
      if (!errorsCounter) {
        errorsCounter = 1;
      }
      if (errorsCounter < 3) {
        button.addEventListener('click', this.processParameterRequestClick, true);
        errorsCounter++;
      } else {
        button.addEventListener('click', this.processParameterShowSourceClick, true);
      }
      dom.data(button, 'error-clicks', errorsCounter);
    }
  }, {
    key: "requestParameters",
    value: function requestParameters(paramsEls) {
      var _this2 = this;
      var requestUrls = new Map();
      paramsEls.forEach(function (element) {
        var rel = _this2.parseElement(element);
        if (!rel) {
          return;
        }
        requestUrls.set(rel.requestUrlHash, _this2._requestUrls.get(rel.requestUrlHash));
      });
      return this.processRequestUrls(requestUrls, true);
    }
  }, {
    key: "parseElement",
    value: function parseElement(element) {
      var textValue = '';
      if (dom.hasAttr(element, 'data-value')) {
        textValue = dom.attr(element, 'data-value');
      } else {
        textValue = dom.text(element);
      }
      if ([lib.SEOQUAKE_RESULT_WAIT, lib.SEOQUAKE_RESULT_QUESTION, lib.SEOQUAKE_RESULT_ERROR].indexOf(textValue) === -1) {
        return false;
      }
      if (!dom.hasAttr(element, 'rel')) {
        return false;
      }
      var rel = this.parseRelAttr(dom.attr(element, 'rel'));
      if (!rel) {
        return false;
      }
      return rel;
    }
  }, {
    key: "renderParam",
    value: function renderParam(hash, paramId, value) {
      var _this3 = this;
      var textValue = textUtils.decode(value);
      var selector = 'a[rel~="' + hash + '_' + paramId + '"] > span:last-child';
      var requestObject = this._requestUrls.get(hash);
      var href = requestObject.getHref(paramId);
      var na = requestObject.getNaHref(paramId);
      Array.from(document.querySelectorAll(selector)).forEach(function (placeHolder) {
        var button = placeHolder.parentNode;
        var currentValue = dom.attr(button, 'data-value');
        if (BaseSERPPlugin.NOT_VALUES_LIST.indexOf(currentValue) === -1) {
          return;
        }
        dom.attr(button, 'data-value', textValue);
        button.removeEventListener('click', _this3.processParameterRequestClick, true);
        switch (value) {
          case lib.SEOQUAKE_RESULT_ERROR:
            dom.text(placeHolder, textValue);
            _this3.renderErrorValue(button, href);
            break;
          case lib.SEOQUAKE_RESULT_QUESTION:
            dom.text(placeHolder, textValue);
            button.href = '#';
            button.addEventListener('click', _this3.processParameterRequestClick, true);
            break;
          case lib.SEOQUAKE_RESULT_WAIT:
            dom.text(placeHolder, textValue);
            button.href = '#';
            break;
          case lib.SEOQUAKE_RESULT_NODATA:
            dom.text(placeHolder, textValue);
            button.href = na || href;
            button.addEventListener('click', _this3.processParameterShowSourceClick, true);
            break;
          case lib.SEOQUAKE_RESULT_YES:
          default:
            _this3.renderValue(placeHolder, textValue);
            button.href = href;
            button.addEventListener('click', _this3.processParameterShowSourceClick, true);
            break;
        }
      });
    }
  }, {
    key: "renderValue",
    value: function renderValue(button, text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
        dom.attr(button, 'title', display.value);
      }
      dom.text(button, text);
    }
  }, {
    key: "render",
    value: function render(renderObject) {
      var _this4 = this;
      if (!renderObject.requestUrlHash) {
        return false;
      }
      renderObject.params.forEach(function (paramId) {
        return paramId in renderObject.values && _this4.renderParam(renderObject.requestUrlHash, paramId, renderObject.values[paramId]);
      });
      this.dispatchEvent('render', renderObject);
      return true;
    }
  }, {
    key: "processRequestUrls",
    value: function processRequestUrls(requestUrls, forceRequest) {
      var _this5 = this;
      forceRequest = forceRequest || false;
      forceRequest = this.pluginConfiguration.mode === lib.SEOQUAKE_MODE_BY_REQUEST && !forceRequest;
      var results = [];
      requestUrls.forEach(function (requestObject) {
        requestObject.setValues(forceRequest ? lib.SEOQUAKE_RESULT_QUESTION : lib.SEOQUAKE_RESULT_WAIT);
        _this5.render(requestObject);
        results.push(_this5.sendMessage('sq.requestParameter', {
          render: requestObject.asPlainObject(),
          onlyCache: forceRequest
        }).then(_this5.processRequestDone)["catch"](ignore));
      });
      return Promise.all(results);
    }
  }, {
    key: "createParameterCell",
    value: function createParameterCell(urlHash, param, serpItemPos) {
      serpItemPos = serpItemPos || null;
      var cell = dom('a', {
        className: 'seoquake-parameter-button',
        href: '',
        rel: '',
        target: '_blank'
      });
      if ('icon' in param) {
        var icn = param.icon;
        var icon = null;
        if (icn.startsWith('//') || icn.startsWith('http://') || icn.startsWith('https://')) {
          icon = dom('img', {
            src: icn
          });
        } else {
          icon = dom('span', {
            className: 'sqicn sqicn-' + icn
          });
        }
        if (icon !== null) {
          cell.appendChild(icon);
        }
      }
      if ('matches' in param) {
        cell.appendChild(document.createTextNode(param.title + ': '));
      }
      var link = dom('span', {
        className: ''
      });
      if ('url-r' in param) {
        var requestUrl = lib.createRequestUrl(param['url-r'], this.urls.get(urlHash), this.searchQuery, serpItemPos);
        var requestUrlHash = lib.shortHash(requestUrl);
        if ('matches' in param) {
          var requestObject;
          if (!this._requestUrls.has(requestUrlHash)) {
            requestObject = new SERPRequestObject(requestUrl, requestUrlHash);
            this._requestUrls.set(requestUrlHash, requestObject);
          } else {
            requestObject = this._requestUrls.get(requestUrlHash);
          }
          if ('url-s' in param) {
            requestObject.getUrlS().set(param.id, lib.createRequestUrl(param['url-s'], this.urls.get(urlHash), this.searchQuery, serpItemPos));
          }
          if ('url-na' in param) {
            requestObject.getUrlNA().set(param.id, param['url-na']);
          }
          requestObject.params.add(param.id);
          dom.attr(cell, 'href', '#');
        } else {
          dom.attr(cell, 'href', requestUrl);
          cell.addEventListener('click', this.processParameterShowSourceClick, true);
        }
        dom.attr(cell, 'rel', urlHash + ' ' + requestUrlHash + '_' + param.id);
      }
      if (!('matches' in param)) {
        cell.appendChild(document.createTextNode(param.title));
        cell.addEventListener('click', this.processParameterShowSourceClick, true);
      }
      cell.appendChild(link);
      return cell;
    }
  }, {
    key: "createParamsPanel",
    value: function createParamsPanel(urlHash, rows, serped, nodeCounter, serpItemPos) {
      var _this6 = this;
      var row = dom('div', {
        className: 'seoquake-params-row'
      });
      var panel = dom('div', {
        className: 'bm_seoquake seoquake-params-panel seoquake-serp-parameters',
        style: 'overflow-x:auto!important;'
      }, row);
      if (this.pluginConfiguration.mode === lib.SEOQUAKE_MODE_BY_REQUEST) {
        var link = dom('button', {
          className: 'seoquake-button seoquake-button-reload seoquake-params-request'
        }, dom('i', {
          className: 'seoquake-button-icon'
        }));
        link.addEventListener('click', this.processParametersLoadRowClick, true);
        row.appendChild(link);
        dom.addClass(panel, 'seoquake-params-panel-mode-1');
      }
      this.parameters.forEach(function (parameter) {
        return row.appendChild(_this6.createParameterCell(urlHash, parameter, serpItemPos));
      });
      dom.attr(panel, 'data-url-hash', urlHash);
      this._semrushPanels.extendPanel(panel, this.urls.get(urlHash).url);
      return panel;
    }
  }, {
    key: "saveToFile",
    value: function saveToFile() {
      var load = new CreateFileNameSync(this.configuration.core.export_template, this.searchQuery);
      var filename = load.filename;
      var data = [this.getHeadersLine().join(';'), this.getDataLines().join('\n')].join('\n');
      var url = window.URL || window.webkitURL || window.mozURL || window.msURL;
      var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      var a = document.createElement('a');
      a.download = filename;
      if ('chrome' === 'safari') {
        a.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data);
      } else {
        a.href = url.createObjectURL(new Blob([data], {
          type: 'text/plain'
        }));
        a.dataset.downloadurl = ['csv', a.download, a.href].join(':');
      }
      a.dispatchEvent(clickEvent);
      this.registerEvent(this.name, 'saveResultToFile');
    }
  }, {
    key: "getDataLines",
    value: function getDataLines() {
      var _this7 = this;
      var paramsEls = Array.from(document.querySelectorAll('.seoquake-params-link'));
      var data = [];
      var index = 1;
      paramsEls.forEach(function (element) {
        var rel = _this7.parseRelAttr(element.getAttribute('rel'));
        if (!rel) {
          return;
        }
        var parameters = Array.from(document.querySelectorAll('[rel^="' + rel.urlHash + '"]'));
        var panel = document.querySelector('[dataurlhash="' + rel.urlHash + '"]');
        var line = [index.toString(), element.href];
        _this7._semrushPanels !== null && _this7._semrushPanels.enchanceDataLine(line, panel);
        parameters.forEach(function (parameter) {
          var rel = _this7.parseRelAttr(parameter.getAttribute('rel'));
          if (!rel) {
            return;
          }
          var requestObject = _this7._requestUrls.get(rel.requestUrlHash);
          if (requestObject && requestObject.values.hasOwnProperty(rel.paramId)) {
            line.push(requestObject.values[rel.paramId]);
          }
        });
        line.forEach(function (item, index) {
          return line[index] = BaseSERPPlugin.convertDataLine(item);
        });
        if (line.length > 0) {
          data.push(line.join(';'));
          index++;
        }
      });
      return data;
    }
  }, {
    key: "getHeadersLine",
    value: function getHeadersLine() {
      var line = ['#', 'Url'];
      this._semrushPanels !== null && this._semrushPanels.enchanceHeadersLine(line);
      this.parameters.forEach(function (p) {
        return p.hasOwnProperty('matches') && line.push(lib.isEmpty(p, 'name') ? '' : p.name);
      });
      line.forEach(function (item, index) {
        return line[index] = BaseSERPPlugin.convertDataLine(item);
      });
      return line;
    }
  }, {
    key: "getElements",
    value: function getElements(params) {
      return {
        container: null,
        items: []
      };
    }
  }, {
    key: "putElements",
    value: function putElements(elements) {
      elements.items.forEach(function (item) {
        return elements.container.appendChild(item);
      });
    }
  }, {
    key: "sort",
    value: function sort(paramId, sortType) {
      var _this8 = this;
      if (this._semrushPanels !== null && ['TS', 'DS', 'AS'].indexOf(paramId) !== -1) {
        var params = this._semrushPanels.getSortedItems(paramId);
        if (params) {
          params = sortParams(params, sortType);
          this.putElements(this.getElements(params));
        }
      } else {
        var _params = [];
        var paramEls = Array.from(document.querySelectorAll('.seoquake-parameter-button[rel$="_' + paramId + '"]'));
        paramEls.forEach(function (item) {
          var rel = _this8.parseRelAttr(item.getAttribute('rel'));
          if (rel === null) {
            return;
          }
          if (paramId === 'url') {
            rel.value = item.href.replace(/^https*:\/\//i, '');
          } else if (dom.hasAttr(item, 'data-value')) {
            rel.value = dom.attr(item, 'data-value').trim();
          } else {
            rel.value = dom.text(item).trim();
          }
          _params.push(rel);
        });
        var paramsType = determineParamsType(_params);
        _params = modifyParams(_params, paramsType);
        _params = sortParams(_params, sortType);
        this.putElements(this.getElements(_params));
      }
      this.registerEvent(this.name, 'resultRowsSort', paramId);
    }
  }, {
    key: "afterConfigurationUpdate",
    value: function afterConfigurationUpdate(changes) {
      if (changes.length === 0) {
        return;
      }
      if (this._isRunning) {
        if (this.configuration.core.disabled) {
          this.removeControlPanel();
          this.removeIndexes();
          this.doUnhighlightSites(this.configuration.core.highlight_sites);
          this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
        } else {
          this.addControlPanel();
          if (!this.pluginConfiguration.disabled) {
            this.controlPanel.switchButton.setStatus(ToggleButton.STATUS_DOWN, true);
            this.controlPanel.showContent();
            if (!this.configuration.core.disable_serps_pos_numbers) {
              this.addIndexes();
            } else {
              this.removeIndexes();
            }
            if (!this.configuration.core.disable_highlight_sites) {
              this.doHighlightSites(this.configuration.core.highlight_sites, this.configuration.core.highlight_sites_color);
            } else {
              this.doUnhighlightSites(this.configuration.core.highlight_sites);
            }
          } else {
            this.controlPanel.switchButton.setStatus(ToggleButton.STATUS_UP, true);
            this.controlPanel.hideContent();
            this.removeIndexes();
            this.doUnhighlightSites(this.configuration.core.highlight_sites);
            this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
          }
          if (this.pluginConfiguration.mode === lib.SEOQUAKE_MODE_BY_REQUEST) {
            this._controlPanel.showRequestAllButton();
          } else {
            this._controlPanel.hideRequestAllButton();
          }
        }
      }
      this.dispatchEvent('afterConfigurationUpdated', changes);
    }
  }, {
    key: "afterParametersUpdate",
    value: function afterParametersUpdate(changed) {
      if (this._isRunning) {
        if (this.configuration.core.disabled) {
          this.removeParametersPanels();
          return;
        }
        if (this.pluginConfiguration.disabled) {
          this.removeParametersPanels();
        }
        if (changed.length !== 0) {
          this.removeParametersPanels();
        }
        if (!this.pluginConfiguration.disabled) {
          this.addParametersPanels();
        }
      }
      this.dispatchEvent('afterParametersUpdated', changed);
    }
  }, {
    key: "handleDetach",
    value: function handleDetach() {
      if (!this._isRunning) {
        return;
      }
      this._isRunning = false;
      this.doUnhighlightSites(this.configuration.core.highlight_sites);
      this.removeIndexes();
      this.removeParametersPanels();
      this.removeControlPanel();
      this.sendMessage('sq.requestPluginCancel')["catch"](ignore);
    }
  }, {
    key: "handleConfigurationUpdate",
    value: function handleConfigurationUpdate(configuration) {
      var _this9 = this;
      this.configuration = configuration;
      this.getPluginParameters().then(function (parameters) {
        return _this9.parameters = parameters;
      })["catch"](ignore);
    }
  }, {
    key: "handleSwitchOff",
    value: function handleSwitchOff() {
      this.setConfigurationItem(this.name + '.disabled', true).then(this.processSetConfiguration)["catch"](ignore);
    }
  }, {
    key: "handleSwitchOn",
    value: function handleSwitchOn() {
      this.setConfigurationItem(this.name + '.disabled', false).then(this.processSetConfiguration)["catch"](ignore);
    }
  }, {
    key: "handleSetConfiguration",
    value: function handleSetConfiguration() {
      this.updateConfiguration()["catch"](ignore);
    }
  }, {
    key: "handleParametersLoadRowClick",
    value: function handleParametersLoadRowClick(event) {
      event.preventDefault();
      event.stopPropagation();
      var target = event.currentTarget;
      dom.addClass(target, 'seoquake-button-loading');
      var parametersContainer = target.parentNode;
      var paramsEls = Array.from(parametersContainer.querySelectorAll('.seoquake-parameter-button'));
      this._semrushPanels.loadPanelData(parametersContainer.parentNode);
      this.registerEvent(this.name, 'requestRowParameters');
      return this.requestParameters(paramsEls).then(function () {
        return dom.removeClass(target, 'seoquake-button-loading');
      })["catch"](ignore);
    }
  }, {
    key: "handleParameterRequestClick",
    value: function handleParameterRequestClick(event) {
      event.preventDefault();
      event.stopPropagation();
      var link = event.currentTarget;
      var rel = this.parseElement(link);
      if (!rel) {
        return Promise.reject('Link contains wrong data or not SEOquake link');
      }
      var requestObject = this._requestUrls.get(rel.requestUrlHash).clone();
      var requestUrls = new Map([[rel.requestUrlHash, requestObject]]);
      requestObject.params = new Set([rel.paramId]);
      this.registerEvent(this.name, 'requestParameterHandler', rel.paramId);
      return this.processRequestUrls(requestUrls, true)["catch"](ignore);
    }
  }, {
    key: "handleParametersRequestAll",
    value: function handleParametersRequestAll() {
      this._semrushPanels.loadAllPanelsData();
      return this.processRequestUrls(this._requestUrls, true);
    }
  }, {
    key: "handleParameterShowSourceClick",
    value: function handleParameterShowSourceClick(event) {
      var parameterId = '';
      if (event.currentTarget.hasAttribute('rel')) {
        var rel = this.parseRelAttr(event.currentTarget.getAttribute('rel'), true);
        if (rel) {
          parameterId = rel.paramId;
        }
      }
      var href = event.currentTarget.href.toString();
      if (href.match(/^view-source:/i) !== null) {
        event.preventDefault();
        event.stopPropagation();
        this._sendMessage('sq.openTab', href)["catch"](ignore);
      }
      this.registerEvent(this.name, 'showParameterSource', parameterId);
    }
  }, {
    key: "handleOpenConfiguration",
    value: function handleOpenConfiguration() {
      this._sendMessage('sq.openConfigurationWindow', {
        panel: 'serp'
      });
      this.registerEvent(this.name, 'openConfigurationWindow', 'menu');
    }
  }, {
    key: "handleParametersUpdate",
    value: function handleParametersUpdate(parameters) {
      this.setParameters(parameters).then(this.processSetConfiguration)["catch"](ignore);
    }
  }, {
    key: "handleRequestDone",
    value: function handleRequestDone(renderObject) {
      var object = this._requestUrls.get(renderObject.requestUrlHash);
      if (object) {
        object.fromPlainObject(renderObject);
        this.render(object);
      }
    }
  }], [{
    key: "convertDataLine",
    value: function convertDataLine(name) {
      return '"' + name.toString().replace(/"/g, '""') + '"';
    }
  }]);
}();
BaseSERPPlugin.NOT_VALUES_LIST = [null, lib.SEOQUAKE_RESULT_ERROR, lib.SEOQUAKE_RESULT_QUESTION, lib.SEOQUAKE_RESULT_WAIT, lib.SEOQUAKE_RESULT_NODATA, lib.SEOQUAKE_RESULT_YES];
messengerModuleMixin(BaseSERPPlugin.prototype);
messengerTranslateMixin(BaseSERPPlugin.prototype);
pluginHighlightMixin(BaseSERPPlugin.prototype);
eventsMixin(BaseSERPPlugin.prototype);
module.exports = BaseSERPPlugin;

},{"../Lib":7,"../dom/main":33,"../dom/textUtils":40,"../effects/ToggleButton":52,"../lib/checkMatch":57,"../lib/diffMaps":59,"../lib/diffObjects":60,"../lib/ignore":63,"../parameters/determineParamsType":87,"../parameters/modifyParams":88,"../parameters/sortParams":89,"../pluginHighlightMixin":90,"../utils/CreateFilenameSync":141,"../utils/eventsMixin":148,"../utils/messengerModuleMixin":151,"../utils/messengerTranslateMixin":152,"../utils/normalizeNumber":153,"./SERPControlPanel":123,"./SERPRequestObject":125,"./elements/SEMrushParametersPanels":134,"extend":164}],119:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var ToggleButton = require('../effects/ToggleButton');
var translateMixin = require('../utils/translateMixin');
var eventsMixin = require('../utils/eventsMixin');
var ignore = require('../lib/ignore');
var hlglSource = require('../defaults/hlgl');
var HLGLPanel = function () {
  function HLGLPanel() {
    _classCallCheck(this, HLGLPanel);
    this._element = null;
    this._buttonToggle = null;
    this._toggleElement = null;
    this._toggleContainer = null;
    this._selectCountryField = null;
    this._selectLanguageField = null;
    this._buttonSetLocale = null;
    this._buttonReset = null;
    this._configuration = null;
    this._isInit = false;
    this._textCountry = '';
    this._textLanguage = '';
    this._textGroups = {
      common: '',
      others: ''
    };
    this.processToggleUp = this.handleToggleUp.bind(this);
    this.processToggleDown = this.handleToggleDown.bind(this);
    this.processSetLocaleClick = this.handleSetLocaleClick.bind(this);
    this.processResetClick = this.handleResetClick.bind(this);
    this.processTranslationReady = this.handleTranslationReady.bind(this);
  }
  return _createClass(HLGLPanel, [{
    key: "element",
    get: function get() {
      if (!this._isInit) {
        return dom('span', 'Panel not inited');
      }
      return this._element;
    }
  }, {
    key: "configuration",
    set: function set(configuration) {
      if (!this._isInit) {
        return;
      }
      this._configuration = configuration;
      if (this._configuration.google.google_gl === 'none') {
        dom.value(this._selectCountryField, 'empty');
      } else {
        dom.value(this._selectCountryField, this._configuration.google.google_gl);
      }
      if (this._configuration.google.google_hl === 'none') {
        dom.value(this._selectLanguageField, 'empty');
      } else {
        dom.value(this._selectLanguageField, this._configuration.google.google_hl);
      }
      if (this._configuration.google.google_gl === 'none' && this._configuration.google.google_hl === 'none') {
        dom.css(this._buttonReset, 'display', 'none');
      } else {
        dom.css(this._buttonReset, 'display', 'block');
        this._toggleElement.status = ToggleButton.STATUS_DOWN;
      }
    }
  }, {
    key: "country",
    get: function get() {
      var result = this._selectCountryField.querySelector(':checked');
      if (result) {
        var value = dom.value(result);
        return value === 'empty' ? 'none' : value;
      }
      return 'none';
    }
  }, {
    key: "language",
    get: function get() {
      var result = this._selectLanguageField.querySelector(':checked');
      if (result) {
        var value = dom.value(result);
        return value === 'empty' ? 'none' : value;
      }
      return 'none';
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (this._isInit) {
        return;
      }
      this._element = dom('div', {
        className: 'seoquake-container seoquake-container-locale'
      });
      this._buttonToggle = dom('button', {
        className: 'seoquake-container-header'
      }, 'Locale');
      this._toggleContainer = dom('div');
      this._selectCountryField = dom('select');
      this._selectLanguageField = dom('select');
      this._buttonSetLocale = dom('button', {
        className: 'seoquake-button seoquake-button-primary'
      }, 'Set locale');
      this._buttonSetLocale.addEventListener('click', this.processSetLocaleClick);
      this._buttonReset = dom('button', {
        className: 'seoquake-button'
      }, 'Reset');
      this._buttonReset.addEventListener('click', this.processResetClick);
      this._toggleElement = new ToggleButton(this._buttonToggle);
      this._toggleElement.addEventListener('down', this.processToggleDown);
      this._toggleElement.addEventListener('up', this.processToggleUp);
      this.handleToggleUp();
      var wait = [this.t('sqSerpOverlay_hlgl_title').then(function (text) {
        return dom.text(_this._buttonToggle, text);
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_set').then(function (text) {
        return dom.text(_this._buttonSetLocale, text);
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_reset').then(function (text) {
        return dom.text(_this._buttonReset, text);
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_country').then(function (text) {
        return _this._textCountry = text;
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_language').then(function (text) {
        return _this._textLanguage = text;
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_group_common').then(function (text) {
        return _this._textGroups.common = text;
      })["catch"](ignore), this.t('sqSerpOverlay_hlgl_group_others').then(function (text) {
        return _this._textGroups.others = text;
      })["catch"](ignore)];
      this._toggleContainer.appendChild(this._selectCountryField);
      this._toggleContainer.appendChild(this._selectLanguageField);
      this._toggleContainer.appendChild(this._buttonSetLocale);
      this._toggleContainer.appendChild(this._buttonReset);
      this._element.appendChild(this._buttonToggle);
      this._element.appendChild(this._toggleContainer);
      return Promise.all(wait).then(this.processTranslationReady)["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this._toggleElement.remove();
      this._toggleElement = null;
      dom.removeElement(this._buttonToggle);
      this._buttonToggle = null;
      dom.removeElement(this._selectCountryField);
      this._selectCountryField = null;
      dom.removeElement(this._selectLanguageField);
      this._selectLanguageField = null;
      dom.removeElement(this._buttonSetLocale);
      this._buttonSetLocale = null;
      dom.removeElement(this._buttonReset);
      this._buttonReset = null;
      dom.removeElement(this._toggleContainer);
      this._toggleContainer = null;
      this.clearEvents();
    }
  }, {
    key: "handleTranslationReady",
    value: function handleTranslationReady() {
      this._isInit = true;
      this._selectCountryField.appendChild(dom('option', {
        value: 'empty',
        disabled: true
      }, this._textCountry));
      for (var group in hlglSource.gl) {
        if (hlglSource.gl.hasOwnProperty(group)) {
          var groupElement = dom('optgroup', {
            label: this._textGroups[group]
          });
          for (var title in hlglSource.gl[group]) {
            if (hlglSource.gl[group].hasOwnProperty(title)) {
              groupElement.appendChild(dom('option', {
                value: hlglSource.gl[group][title]
              }, title));
            }
          }
          this._selectCountryField.appendChild(groupElement);
        }
      }
      this._selectLanguageField.appendChild(dom('option', {
        value: 'empty',
        disabled: true
      }, this._textLanguage));
      for (var _group2 in hlglSource.hl) {
        if (hlglSource.hl.hasOwnProperty(_group2)) {
          var _groupElement = dom('optgroup', {
            label: this._textGroups[_group2]
          });
          for (var _title2 in hlglSource.hl[_group2]) {
            if (hlglSource.hl[_group2].hasOwnProperty(_title2)) {
              _groupElement.appendChild(dom('option', {
                value: hlglSource.hl[_group2][_title2]
              }, _title2));
            }
          }
          this._selectLanguageField.appendChild(_groupElement);
        }
      }
    }
  }, {
    key: "handleToggleUp",
    value: function handleToggleUp() {
      dom.addClass(this._toggleContainer, 'seoquake-container_hidden');
    }
  }, {
    key: "handleToggleDown",
    value: function handleToggleDown() {
      dom.removeClass(this._toggleContainer, 'seoquake-container_hidden');
    }
  }, {
    key: "handleSetLocaleClick",
    value: function handleSetLocaleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('setlocale', {
        country: this.country,
        language: this.language
      });
    }
  }, {
    key: "handleResetClick",
    value: function handleResetClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('setlocale', {
        country: 'none',
        language: 'none'
      });
    }
  }]);
}();
translateMixin(HLGLPanel.prototype);
eventsMixin(HLGLPanel.prototype);
module.exports = HLGLPanel;

},{"../defaults/hlgl":12,"../dom/main":33,"../effects/ToggleButton":52,"../lib/ignore":63,"../utils/eventsMixin":148,"../utils/translateMixin":154}],120:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SERPControlPanel = require('./SERPControlPanel');
var HLGLPanel = require('./HLGLPanel');
var ignore = require('../lib/ignore');
var HLGLSERPControlPanel = function (_SERPControlPanel) {
  function HLGLSERPControlPanel(plugin) {
    var _this;
    _classCallCheck(this, HLGLSERPControlPanel);
    _this = _callSuper(this, HLGLSERPControlPanel, [plugin]);
    _this._panelHLGL = null;
    _this.processHLGLset = _this.handleHLGLset.bind(_this);
    return _this;
  }
  _inherits(HLGLSERPControlPanel, _SERPControlPanel);
  return _createClass(HLGLSERPControlPanel, [{
    key: "createControlBlock",
    value: function createControlBlock() {
      var _this2 = this;
      var result = _get(_getPrototypeOf(HLGLSERPControlPanel.prototype), "createControlBlock", this).call(this);
      this._panelHLGL = new HLGLPanel();
      this._panelHLGL.setTranslateFunction(this.getTranslateFunction());
      this._panelHLGL.init().then(function () {
        _this2._panelHLGL.configuration = _this2._plugin.configuration;
        _this2._panelHLGL.addEventListener('setlocale', _this2.processHLGLset);
        _this2._panelContainer.appendChild(_this2._panelHLGL.element);
      })["catch"](ignore);
      return result;
    }
  }, {
    key: "setConfiguration",
    value: function setConfiguration(value) {
      try {
        if (this._panelHLGL !== null) {
          this._panelHLGL.configuration = value;
        }
      } catch (val) {
        ignore(val);
      }
    }
  }, {
    key: "handleHLGLset",
    value: function handleHLGLset(data) {
      this._plugin.processHlGlParams(data);
    }
  }]);
}(SERPControlPanel);
module.exports = HLGLSERPControlPanel;

},{"../lib/ignore":63,"./HLGLPanel":119,"./SERPControlPanel":123}],121:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var IndexItem = function () {
  function IndexItem(index) {
    _classCallCheck(this, IndexItem);
    this._element = null;
    this._index = index;
  }
  return _createClass(IndexItem, [{
    key: "index",
    get: function get() {
      return this._index;
    },
    set: function set(value) {
      this._index = value;
      if (this._element !== null) {
        dom.text(this._element, this._index);
      }
    }
  }, {
    key: "element",
    get: function get() {
      if (this._element === null) {
        this._element = dom.createElement('div', {
          className: 'seoquake-serp-index'
        }, this._index);
      }
      return this._element;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._element !== null) {
        dom.removeElement(this._element);
        this._element = null;
      }
    }
  }]);
}();
module.exports = IndexItem;

},{"../dom/main":33}],122:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var Dropdown = require('../effects/Dropdown');
var extend = require('extend');
var dom = require('../dom/main');
var PillsSwitch = require('../effects/PillsSwitch');
var ParametersCheckboxes = require('../parameters/ParametersCheckboxes');
var ignore = require('../lib/ignore');
var translateMixin = require('../utils/translateMixin');
var SERPConfigureMenu = function (_Dropdown) {
  function SERPConfigureMenu(plugin, container, config) {
    var _this;
    _classCallCheck(this, SERPConfigureMenu);
    config = extend(true, {}, SERPConfigureMenu.DEFAULT_CONFIG, config);
    _this = _callSuper(this, SERPConfigureMenu, [container, config]);
    _this._plugin = plugin;
    _this._parameters = null;
    _this._configurationLink = null;
    _this._processParametersUpdate = _this._handleParametersUpdate.bind(_this);
    _this._processConfigurationClick = _this._handleConfigurationClick.bind(_this);
    _this._processScroll = _this._handleScroll.bind(_this);
    return _this;
  }
  _inherits(SERPConfigureMenu, _Dropdown);
  return _createClass(SERPConfigureMenu, [{
    key: "position",
    value: function position() {
      var currentPosition = dom.getOffset(this.container);
      var result = {
        position: 'absolute',
        left: currentPosition.left + this.container.offsetWidth + 'px',
        top: currentPosition.top + 'px'
      };
      dom.css(this._body, result);
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SERPConfigureMenu.prototype), "init", this).call(this);
      this._parameters = new ParametersCheckboxes(this._plugin.name);
      this._parameters.addEventListener('userUpdated', this._processParametersUpdate);
      this._parameters.element = null;
      this.body.appendChild(dom('div', {
        className: 'sqseobar2-configuration-title'
      }, this.t('sqSeobar2_configuration_parameters_title')));
      this.body.appendChild(this._parameters.element);
      this._configurationLink = dom('a', {
        className: 'sqseobar2-configuration-configuration-link'
      }, this.t('sqSeobar2_configuration_more_settings'));
      this._configurationLink.addEventListener('click', this._processConfigurationClick);
      this.body.appendChild(this._configurationLink);
    }
  }, {
    key: "show",
    value: function show() {
      var _this2 = this;
      this._plugin.getParameters().then(function (p) {
        return _this2._parameters.value = p;
      })["catch"](ignore);
      _get(_getPrototypeOf(SERPConfigureMenu.prototype), "show", this).call(this);
      dom.addClass(this.container, 'sqseobar2-button-down');
      document.addEventListener('scroll', this._processScroll);
    }
  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(SERPConfigureMenu.prototype), "hide", this).call(this);
      dom.removeClass(this.container, 'sqseobar2-button-down');
      document.removeEventListener('scroll', this._processScroll);
    }
  }, {
    key: "remove",
    value: function remove() {
      this.hide();
      _get(_getPrototypeOf(SERPConfigureMenu.prototype), "remove", this).call(this);
    }
  }, {
    key: "_handleParametersUpdate",
    value: function _handleParametersUpdate() {
      this.dispatchEvent('parametersUpdate', this._parameters.value);
    }
  }, {
    key: "_handleConfigurationClick",
    value: function _handleConfigurationClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('configurationClick');
    }
  }, {
    key: "_handleScroll",
    value: function _handleScroll() {
      this.position();
    }
  }]);
}(Dropdown);
translateMixin(SERPConfigureMenu.prototype);
SERPConfigureMenu.DEFAULT_CONFIG = {
  containerClass: 'bm_seoquake sqseobar2-configuration-dropdown',
  toggle: true
};
module.exports = SERPConfigureMenu;

},{"../dom/main":33,"../effects/Dropdown":43,"../effects/PillsSwitch":49,"../lib/ignore":63,"../parameters/ParametersCheckboxes":85,"../utils/translateMixin":154,"extend":164}],123:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var FloatPanel = require('../effects/FloatPanel');
var ToggleButton = require('../effects/ToggleButton');
var eventsMixin = require('../utils/eventsMixin');
var translateMixin = require('../utils/translateMixin');
var ignore = require('../lib/ignore');
var lib = require('../Lib');
var SERPConfigureMenu = require('./SERPConfigureMenu');
var SortPanel = require('./SortPanel');
var SERPControlPanel = function () {
  function SERPControlPanel(plugin) {
    _classCallCheck(this, SERPControlPanel);
    this._plugin = plugin;
    this._float = null;
    this._buttonSwitch = null;
    this._buttonRequestAll = null;
    this._buttonConfigure = null;
    this._buttonSERPTool = null;
    this._buttonExport = null;
    this._configureMenu = null;
    this._panelButtons = null;
    this._panelContainer = null;
    this._panelSort = null;
    this._element = null;
    this.processSwitchUp = this.handleSwitchUp.bind(this);
    this.processSwitchDown = this.handleSwitchDown.bind(this);
    this.processRequestAllClick = this.handleRequestAllClick.bind(this);
    this.processOpenConfiguration = this.handleOpenConfiguration.bind(this);
    this.processParametersUpdate = this.handleParametersUpdate.bind(this);
    this.processSERPToolClick = this.handleSERPToolClick.bind(this);
    this.processSaveCSVClick = this.handleSaveCSVClick.bind(this);
    this.processAfterParametersUpdate = this.handleAfterParametersUpdate.bind(this);
    this.processSort = this.handleSort.bind(this);
  }
  return _createClass(SERPControlPanel, [{
    key: "element",
    get: function get() {
      if (this._element === null) {
        this._element = dom('div', {
          className: 'bm_seoquake seoquake-serp-control-panel'
        }, this.createControlBlock());
        this._plugin.addEventListener('afterParametersUpdated', this.processAfterParametersUpdate);
      }
      return this._element;
    }
  }, {
    key: "plugin",
    get: function get() {
      return this._plugin;
    }
  }, {
    key: "float",
    set: function set(value) {
      if (this._element === null) {
        return;
      }
      if (value) {
        if (this._element.parentNode !== null && this._float === null) {
          var topCorrection = 0;
          if (document.body.className.indexOf('mozbar-margin-') !== -1) {
            topCorrection = 43;
          }
          dom.css(this._element, 'top', this.plugin.controlPanelTop + 'px');
          this._float = new FloatPanel(this._element, {
            paddingTop: this.plugin.controlPanelOffsetTop + topCorrection,
            fixOldPosition: false,
            zIndex: 1000
          });
          this._float.scrollEventHandler();
        }
      } else {
        if (this._float !== null) {
          this._float.remove();
          this._float = null;
        }
      }
    }
  }, {
    key: "switchButton",
    get: function get() {
      if (this._buttonSwitch === null) {
        var button = dom('button', {
          className: 'seoquake-slider-button'
        }, 'Switch');
        this._buttonSwitch = new ToggleButton(button, {
          classActive: 'seoquake-slider-button-active'
        });
        this._buttonSwitch.addEventListener('up', this.processSwitchUp);
        this._buttonSwitch.addEventListener('down', this.processSwitchDown);
        if (this.plugin.pluginConfiguration.disabled) {
          this._buttonSwitch.setStatus(ToggleButton.STATUS_UP, true);
        } else {
          this._buttonSwitch.setStatus(ToggleButton.STATUS_DOWN, true);
        }
      }
      return this._buttonSwitch;
    }
  }, {
    key: "requestAllButton",
    get: function get() {
      var _this = this;
      if (this._buttonRequestAll === null) {
        this._buttonRequestAll = dom('button', {
          className: 'seoquake-button seoquake-button-request'
        }, 'Get metrics');
        this.t('sqSerpOverlay_get_metrics').then(function (text) {
          return dom.text(_this._buttonRequestAll, text);
        })["catch"](ignore);
        this._buttonRequestAll.addEventListener('click', this.processRequestAllClick);
      }
      return this._buttonRequestAll;
    }
  }, {
    key: "configureButton",
    get: function get() {
      var _this2 = this;
      if (this._buttonConfigure === null) {
        this._buttonConfigure = dom('button', {
          className: 'seoquake-button-link seoquake-button-configure'
        }, 'Parameters');
        this.t('sqSerpOverlay_parameters').then(function (text) {
          return dom.text(_this2._buttonConfigure, text);
        })["catch"](ignore);
        this._configureMenu = new SERPConfigureMenu(this._plugin, this._buttonConfigure);
        this._configureMenu.setTranslateFunction(this.getTranslateFunction());
        this._configureMenu.init();
        this._configureMenu.addEventListener('configurationClick', this.processOpenConfiguration);
        this._configureMenu.addEventListener('parametersUpdate', this.processParametersUpdate);
      }
      return this._buttonConfigure;
    }
  }, {
    key: "serpToolButton",
    get: function get() {
      var _this3 = this;
      if (this._buttonSERPTool === null) {
        this._buttonSERPTool = dom('button', {
          className: 'seoquake-button-link seoquake-button-report'
        }, 'SERP report');
        this.t('sqSerpOverlay_serptool').then(function (text) {
          return dom.text(_this3._buttonSERPTool, text);
        })["catch"](ignore);
        this._buttonSERPTool.addEventListener('click', this.processSERPToolClick, true);
      }
      return this._buttonSERPTool;
    }
  }, {
    key: "saveCSVButton",
    get: function get() {
      var _this4 = this;
      if (this._buttonExport === null) {
        this._buttonExport = dom('button', {
          className: 'seoquake-button-link seoquake-button-save'
        }, 'Export CSV');
        this.t('sqSerpOverlay_export').then(function (text) {
          return dom.text(_this4._buttonExport, text);
        })["catch"](ignore);
        this._buttonExport.addEventListener('click', this.processSaveCSVClick, true);
      }
      return this._buttonExport;
    }
  }, {
    key: "panelSort",
    get: function get() {
      return this._panelSort;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._buttonSwitch !== null) {
        this._buttonSwitch.remove();
        this._buttonSwitch = null;
      }
      if (this._buttonRequestAll !== null) {
        dom.removeElement(this._buttonRequestAll);
        this._buttonRequestAll = null;
      }
      if (this._buttonConfigure !== null) {
        this._configureMenu.remove();
        dom.removeElement(this._buttonConfigure);
        this._buttonConfigure = null;
        this._configureMenu = null;
      }
      if (this._element !== null) {
        if (this._float !== null) {
          this._float.remove();
          this._float = null;
        }
        dom.removeElement(this._element);
      }
      if (this._panelSort !== null) {
        this._panelSort.remove();
        this._panelSort = null;
      }
      this._plugin.removeEventListener('afterParametersUpdated', this.processAfterParametersUpdate);
      this.clearEvents();
    }
  }, {
    key: "createControlBlock",
    value: function createControlBlock() {
      var _this5 = this;
      var result = document.createDocumentFragment();
      this._panelContainer = dom('div', {
        className: 'seoquake-controlblock'
      });
      this._panelButtons = dom('div', {
        className: 'seoquake-container'
      });
      result.appendChild(dom('div', {
        className: 'seoquake-controlblock__logo'
      }, ['SEOquake', this.switchButton.element]));
      this._panelButtons.appendChild(this.requestAllButton);
      this._panelButtons.appendChild(this.configureButton);
      this._panelButtons.appendChild(this.serpToolButton);
      this._panelButtons.appendChild(this.saveCSVButton);
      this._panelSort = new SortPanel();
      this._panelSort.setTranslateFunction(this.getTranslateFunction());
      this._panelSort.init().then(function () {
        _this5._panelSort.parameters = _this5._plugin.parameters;
        _this5._panelSort.addEventListener('sort', _this5.processSort);
        _this5._panelSort.showAS = _this5._plugin.pluginConfiguration.show_semrush_panel;
        _this5._panelContainer.appendChild(_this5._panelSort.element);
      })["catch"](ignore);
      this._panelContainer.appendChild(this._panelButtons);
      if (this._plugin.pluginConfiguration.disabled) {
        dom.addClass(this._panelContainer, 'seoquake-controlblock__hidden');
      } else {
        dom.removeClass(this._panelContainer, 'seoquake-controlblock__hidden');
      }
      result.appendChild(this._panelContainer);
      if (this.plugin.pluginConfiguration.mode === lib.SEOQUAKE_MODE_BY_REQUEST) {
        this.showRequestAllButton();
      } else {
        this.hideRequestAllButton();
      }
      return result;
    }
  }, {
    key: "hideContent",
    value: function hideContent() {
      dom.addClass(this._panelContainer, 'seoquake-controlblock__hidden');
    }
  }, {
    key: "showContent",
    value: function showContent() {
      dom.removeClass(this._panelContainer, 'seoquake-controlblock__hidden');
    }
  }, {
    key: "hideRequestAllButton",
    value: function hideRequestAllButton() {
      dom.addClass(this.requestAllButton, 'seoquake-button-request-hidden');
    }
  }, {
    key: "showRequestAllButton",
    value: function showRequestAllButton() {
      dom.removeClass(this.requestAllButton, 'seoquake-button-request-hidden');
    }
  }, {
    key: "handleSwitchUp",
    value: function handleSwitchUp() {
      this.hideContent();
      this.dispatchEvent('turnOff');
    }
  }, {
    key: "handleSwitchDown",
    value: function handleSwitchDown() {
      this.showContent();
      this.dispatchEvent('turnOn');
    }
  }, {
    key: "handleSERPToolClick",
    value: function handleSERPToolClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this._plugin.runSERPTool();
    }
  }, {
    key: "handleRequestAllClick",
    value: function handleRequestAllClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('requestAll');
    }
  }, {
    key: "handleOpenConfiguration",
    value: function handleOpenConfiguration() {
      this.dispatchEvent('openConfiguration');
    }
  }, {
    key: "handleParametersUpdate",
    value: function handleParametersUpdate(parameters) {
      this.dispatchEvent('parametersUpdate', parameters);
    }
  }, {
    key: "handleSaveCSVClick",
    value: function handleSaveCSVClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this._plugin.saveToFile();
    }
  }, {
    key: "handleAfterParametersUpdate",
    value: function handleAfterParametersUpdate(changed) {
      this._panelSort.parameters = this._plugin.parameters;
      this._panelSort.showAS = this._plugin.pluginConfiguration.show_semrush_panel;
    }
  }, {
    key: "handleSort",
    value: function handleSort(sort) {
      this._plugin.sort(sort.field, sort.order);
    }
  }]);
}();
eventsMixin(SERPControlPanel.prototype);
translateMixin(SERPControlPanel.prototype);
module.exports = SERPControlPanel;

},{"../Lib":7,"../dom/main":33,"../effects/FloatPanel":44,"../effects/ToggleButton":52,"../lib/ignore":63,"../utils/eventsMixin":148,"../utils/translateMixin":154,"./SERPConfigureMenu":122,"./SortPanel":126}],124:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var lib = require('../Lib');
var ignore = require('../lib/ignore');
var dom = require('../dom/main');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var parseArgs = require('../lib/parseArgs');
var SERPRequestObject = require('./SERPRequestObject');
var OnboardingKeywordDifficulty = require('./elements/OnboardingKeywordDifficulty');
var SERPKeywordDifficulty = function () {
  function SERPKeywordDifficulty(plugin) {
    _classCallCheck(this, SERPKeywordDifficulty);
    this._plugin = plugin;
    this._element = null;
    this._value = null;
    this._baseName = null;
    this._detailsLink = null;
    this._requestUrls = new Map();
    this._onboarding = null;
    this._compatibilityMode = false;
    this.processLoadValueClick = this.handleLoadValueClick.bind(this);
    this.processShowOnboarding = this.handleShowOnboarding.bind(this);
    this.processOnboardingOkClick = this.handleOnboardingOkClick.bind(this);
    this.processOnboardingCloseClick = this.handleOnboardingCloseClick.bind(this);
    this.processRequestResults = this.handleRequestResults.bind(this);
    this.processCountKeywordDifficulty = this.countKeywordDifficulty.bind(this);
  }
  return _createClass(SERPKeywordDifficulty, [{
    key: "init",
    value: function init() {
      var _this = this;
      var keywordsEverywhere = document.body.querySelector('#xt-info');
      this._value = dom('span', {
        className: 'seoquake-google-keyword-difficulty-value'
      });
      this._baseName = dom('span', {
        className: 'seoquake-google-keyword-difficulty-db'
      });
      this._element = dom('div', {
        className: 'seoquake-google-keyword-difficulty'
      }, [keywordsEverywhere ? '' : this.t('sqSerpOverlay_keyword_difficulty'), this._value, this._baseName, function () {
        return _this.t('sqSerpOverlay_keyword_difficulty_full_report').then(function (text) {
          var result = dom.parse(text, {
            lineBreak: 'br'
          });
          _this._detailsLink = result.querySelector('a');
          dom.addClass(_this._detailsLink, 'seoquake-ignore-link');
          _this.updateDetailsLink();
          return result;
        });
      }]);
      if (keywordsEverywhere) {
        this.compatibiltyMode();
      }
      var container = document.body.querySelector('.logo').parentNode;
      if (container) {
        container.style.setProperty('white-space', 'nowrap', 'important');
        var keyword = this._plugin.searchQuery;
        if (keyword !== 'empty') {
          container.appendChild(this._element);
          dom.text(this._baseName, this.t('sqSerpOverlay_keyword_difficulty_db').then(function (msg) {
            return msg.replace('{db}', SERPKeywordDifficulty.getDBTitle());
          }));
          if (this._plugin.configuration.google.mode === lib.SEOQUAKE_MODE_ON_LOAD) {
            if (!this.countKeywordDifficulty()) {
              this._plugin.addEventListener('parametersPanelsReady', this.processCountKeywordDifficulty);
            }
          } else {
            this.initKeywordDifficultyClickListener();
          }
          if (this._plugin.configuration.google.onboarding_keyword_difficulty) {
            this.showOnboarding();
          }
        }
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this._plugin.removeEventListener('parametersPanelsReady', this.processCountKeywordDifficulty);
      dom.removeElement(this._element);
      this._element = null;
      this._value = null;
      this._baseName = null;
      this._detailsLink = null;
      this._requestUrls.clear();
      if (this._onboarding !== null) {
        this._onboarding.remove();
        this._onboarding = null;
      }
      SERPKeywordDifficulty.CURRENT_BASE = null;
    }
  }, {
    key: "compatibiltyMode",
    value: function compatibiltyMode() {
      var _this2 = this;
      if (this._compatibilityMode) {
        return;
      }
      dom.addClass(this._element, 'seoquake-google-keyword-difficulty__small');
      this.t('sqSerpOverlay_keyword_difficulty', function (msg) {
        return dom.attr(_this2._element, 'title', msg);
      });
      dom.setText(this._element, '');
      this._compatibiltyMode = true;
    }
  }, {
    key: "countKeywordDifficulty",
    value: function countKeywordDifficulty() {
      var _this3 = this;
      if (this._plugin.urls.size === 0) {
        return false;
      }
      dom.text(this._value, '.');
      dom.addClass(this._value, 'seoquake-google-keyword-difficulty-value_loading');
      var keyword = this._plugin.searchQuery;
      var urlR = SERPKeywordDifficulty.createResourceUrl();
      this._plugin.urls.forEach(function (urlData) {
        var requestUrl = lib.createRequestUrl(urlR, urlData, keyword, 0);
        var requestUrlHash = lib.shortHash(requestUrl);
        var requestObject;
        if (!_this3._requestUrls.has(requestUrlHash)) {
          requestObject = new SERPRequestObject(requestUrl, requestUrlHash);
          _this3._requestUrls.set(requestUrlHash, requestObject);
        } else {
          requestObject = _this3._requestUrls.get(requestUrlHash);
        }
        requestObject.params.add(SERPKeywordDifficulty.SEMRUSH_RANK_PARAMETER);
      });
      var results = [];
      this._requestUrls.forEach(function (requestObject) {
        return results.push(_this3.createRequest(requestObject));
      });
      Promise.all(results).then(this.processRequestResults);
      return true;
    }
  }, {
    key: "createRequest",
    value: function createRequest(requestObject) {
      var requestData = {
        payload: {
          render: requestObject.asPlainObject(),
          onlyCache: false
        },
        plugin: this._plugin.name,
        sender: this._plugin.getUUID()
      };
      return this.sendMessage('sq.requestParameter', requestData);
    }
  }, {
    key: "initKeywordDifficultyClickListener",
    value: function initKeywordDifficultyClickListener() {
      dom.text(this._value, '?');
      dom.addClass(this._value, 'seoquake-google-keyword-difficulty-value_click');
      this._value.addEventListener('click', this.processLoadValueClick, true);
    }
  }, {
    key: "updateDetailsLink",
    value: function updateDetailsLink() {
      if (this._detailsLink === null) {
        return;
      }
      this._detailsLink.href = SERPKeywordDifficulty.LINK_TEMPLATE.replace('{db}', SERPKeywordDifficulty.detectBase()).replace('{keyword}', this._plugin.searchQuery);
    }
  }, {
    key: "showOnboarding",
    value: function showOnboarding() {
      return;
    }
  }, {
    key: "hideOnboarding",
    value: function hideOnboarding() {
      if (this._onboarding) {
        this._onboarding.remove();
        this._onboarding = null;
      }
    }
  }, {
    key: "handleShowOnboarding",
    value: function handleShowOnboarding(event) {
      this._onboarding = new OnboardingKeywordDifficulty(this._value);
      this._onboarding.setTranslateFunction(this.t.bind(this));
      this._onboarding.addEventListener('okClick', this.processOnboardingOkClick);
      this._onboarding.addEventListener('closeClick', this.processOnboardingCloseClick);
      this._onboarding.init();
      this._onboarding.show();
    }
  }, {
    key: "handleLoadValueClick",
    value: function handleLoadValueClick(event) {
      event.preventDefault();
      event.stopPropagation();
      dom.removeClass(this._value, 'seoquake-google-keyword-difficulty-value_click');
      this._value.removeEventListener('click', this.processLoadValueClick, true);
      this.countKeywordDifficulty();
    }
  }, {
    key: "handleOnboardingOkClick",
    value: function handleOnboardingOkClick() {
      var _this4 = this;
      if (this._onboarding !== null) {
        var messages = [this.sendMessage('sq.setConfigurationItem', {
          name: 'google.onboarding_keyword_difficulty',
          value: false
        }), this.sendMessage('sq.analyticsEvent', {
          action: 'Keyword Difficulty',
          category: 'SERP Overlay',
          label: 'Like'
        })];
        Promise.all(messages).then(function (result) {
          _this4.sendMessage('sq.updateConfiguration');
        })["catch"](ignore);
        this._onboarding.remove();
        this._onboarding = null;
      }
    }
  }, {
    key: "handleOnboardingCloseClick",
    value: function handleOnboardingCloseClick() {
      var _this5 = this;
      if (this._onboarding !== null) {
        var messages = [this.sendMessage('sq.setConfigurationItem', {
          name: 'google.onboarding_keyword_difficulty',
          value: false
        }), this.sendMessage('sq.setConfigurationItem', {
          name: 'google.show_keyword_difficulty',
          value: false
        }), this.sendMessage('sq.analyticsEvent', {
          action: 'Keyword Difficulty',
          category: 'SERP Overlay',
          label: 'Hate'
        })];
        Promise.all(messages).then(function (result) {
          return _this5.sendMessage('sq.updateConfiguration');
        })["catch"](ignore);
        this.remove();
      }
    }
  }, {
    key: "handleRequestResults",
    value: function handleRequestResults(values) {
      var sum = 0;
      var count = 0;
      if (this._value === null) {
        return;
      }
      if (values.length === 0) {
        dom.text(this._value, 'n/a');
        return;
      }
      values.every(function (result) {
        if (result !== undefined && result.hasOwnProperty('values') && result.values.hasOwnProperty('41')) {
          var value = result.values['41'];
          try {
            var _int = parseInt(value, 10);
            if (_int.toString() === value) {
              sum += SERPKeywordDifficulty.countDomainStrength(_int);
              count++;
            } else {
              sum += SERPKeywordDifficulty.DEFAULT_STRENGTH;
              count++;
            }
          } catch (ignore) {}
        }
        return count < 20;
      });
      var result = sum / count;
      dom.text(this._value, result.toFixed(2) + '%');
      dom.removeClass(this._value, 'seoquake-google-keyword-difficulty-value_loading');
    }
  }], [{
    key: "createResourceUrl",
    value: function createResourceUrl() {
      return SERPKeywordDifficulty.LINK_SOURCE.replace('#db#', SERPKeywordDifficulty.detectBase());
    }
  }, {
    key: "detectBase",
    value: function detectBase() {
      if (typeof document === 'undefined' || document.location === 'undefined') {
        return 'us';
      }
      var args = parseArgs.parseArgs(document.location.search);
      var hash = parseArgs.parseArgs(document.location.hash);
      if (hash.has('gl')) {
        var gl = hash.get('gl');
        if (SERPKeywordDifficulty.GL_TO_DB.hasOwnProperty(gl)) {
          return SERPKeywordDifficulty.GL_TO_DB[gl];
        } else {
          gl = gl.toLowerCase();
          if (SERPKeywordDifficulty.DB_COEFF.hasOwnProperty(gl)) {
            return gl;
          }
        }
      }
      if (args.has('gl')) {
        var _gl = args.get('gl');
        if (SERPKeywordDifficulty.GL_TO_DB.hasOwnProperty(_gl)) {
          return SERPKeywordDifficulty.GL_TO_DB[_gl];
        } else {
          _gl = _gl.toLowerCase();
          if (SERPKeywordDifficulty.DB_COEFF.hasOwnProperty(_gl)) {
            return _gl;
          }
        }
      }
      var hostname = document.location.hostname;
      if (SERPKeywordDifficulty.DOMAIN_TO_DB.hasOwnProperty(hostname)) {
        return SERPKeywordDifficulty.DOMAIN_TO_DB[hostname];
      }
      return 'us';
    }
  }, {
    key: "getDBTitle",
    value: function getDBTitle() {
      var db = SERPKeywordDifficulty.detectBase();
      return SERPKeywordDifficulty.DB_TO_BASE[db];
    }
  }, {
    key: "countDomainStrength",
    value: function countDomainStrength(rank) {
      if (SERPKeywordDifficulty.CURRENT_BASE === null) {
        SERPKeywordDifficulty.CURRENT_BASE = SERPKeywordDifficulty.detectBase();
      }
      return 100 - Math.pow(Math.log10(rank), SERPKeywordDifficulty.DB_COEFF[SERPKeywordDifficulty.CURRENT_BASE]);
    }
  }]);
}();
SERPKeywordDifficulty.CURRENT_BASE = null;
SERPKeywordDifficulty.DOMAIN_TO_DB = {
  'www.google.com': 'us',
  'www.google.co.uk': 'uk',
  'www.google.ca': 'ca',
  'www.google.ru': 'ru',
  'www.google.de': 'de',
  'www.google.fr': 'fr',
  'www.google.es': 'es',
  'www.google.it': 'it',
  'www.google.com.br': 'br',
  'www.google.com.au': 'au',
  'www.google.com.ar': 'ar',
  'www.google.be': 'be',
  'www.google.dk': 'dk'
};
SERPKeywordDifficulty.DB_TO_BASE = {
  us: 'google.com',
  uk: 'google.co.uk',
  ca: 'google.ca',
  ru: 'google.ru',
  de: 'google.de',
  fr: 'google.fr',
  es: 'google.es',
  it: 'google.it',
  br: 'google.com.br',
  au: 'google.com.au',
  ar: 'google.com.ar',
  be: 'google.be',
  dk: 'google.dk'
};
SERPKeywordDifficulty.GL_TO_DB = {
  GB: 'uk'
};
SERPKeywordDifficulty.DB_COEFF = {
  us: 2.23,
  uk: 2.30,
  ca: 2.45,
  ru: 2.45,
  de: 2.45,
  fr: 2.45,
  es: 2.45,
  it: 2.30,
  br: 2.50,
  au: 2.30,
  ar: 2.65,
  be: 2.60,
  ch: 2.60,
  dk: 2.55,
  fi: 2.65,
  hk: 2.65,
  ie: 2.65,
  il: 2.65,
  mx: 2.65,
  nl: 2.45,
  no: 2.65,
  pl: 2.65,
  se: 2.65,
  sg: 2.65,
  tr: 2.65,
  jp: 2.50,
  "in": 2.45,
  hu: 2.65
};
SERPKeywordDifficulty.LINK_TEMPLATE = 'https://www.semrush.com/analytics/keywordoverview/?q={keyword}&db={db}&utm_source=seoquake&utm_medium=serpoverlay&utm_campaign=kd&ref=174537735';
SERPKeywordDifficulty.LINK_SOURCE = 'https://seoquake.publicapi.semrush.com/#db#/info.php?url={scheme}%3A%2F%2F{domain|encode}%2F';
SERPKeywordDifficulty.SEMRUSH_RANK_PARAMETER = '41';
SERPKeywordDifficulty.DEFAULT_STRENGTH = 15;
messengerTranslateMixin(SERPKeywordDifficulty.prototype);
module.exports = SERPKeywordDifficulty;

},{"../Lib":7,"../dom/main":33,"../lib/ignore":63,"../lib/parseArgs":70,"../utils/messengerTranslateMixin":152,"./SERPRequestObject":125,"./elements/OnboardingKeywordDifficulty":128}],125:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var SERPRequestObject = function () {
  function SERPRequestObject(requestUrl, requestUrlHash) {
    _classCallCheck(this, SERPRequestObject);
    this.params = new Set();
    this.values = {};
    this.requestUrlHash = requestUrlHash;
    this._urlR = requestUrl;
    this._urlS = null;
    this._urlNA = null;
  }
  return _createClass(SERPRequestObject, [{
    key: "getHref",
    value: function getHref(paramId) {
      if (this._urlS !== null && this._urlS.has(paramId)) {
        return this._urlS.get(paramId);
      }
      return this._urlR;
    }
  }, {
    key: "getNaHref",
    value: function getNaHref(paramId) {
      if (this._urlNA !== null && this._urlNA.has(paramId)) {
        return this._urlNA.get(paramId);
      }
      return undefined;
    }
  }, {
    key: "getUrlS",
    value: function getUrlS() {
      if (this._urlS === null) {
        this._urlS = new Map();
      }
      return this._urlS;
    }
  }, {
    key: "getUrlNA",
    value: function getUrlNA() {
      if (this._urlNA === null) {
        this._urlNA = new Map();
      }
      return this._urlNA;
    }
  }, {
    key: "setValues",
    value: function setValues(value) {
      var _this = this;
      this.params.forEach(function (paramId) {
        return _this.values[paramId] = value;
      });
    }
  }, {
    key: "asPlainObject",
    value: function asPlainObject() {
      var result = {
        params: [],
        'url-r': this._urlR,
        values: this.values,
        requestUrlHash: this.requestUrlHash
      };
      this.params.forEach(function (paramId) {
        return result.params.push(paramId);
      });
      if (this._urlS !== null) {
        result['url-s'] = {};
        this._urlS.forEach(function (value, key) {
          return result['url-s'][key] = value;
        });
      }
      if (this._urlNA !== null) {
        result['url-na'] = {};
        this._urlNA.forEach(function (value, key) {
          return result['url-s'][key] = value;
        });
      }
      return result;
    }
  }, {
    key: "fromPlainObject",
    value: function fromPlainObject(object) {
      if ('values' in object) {
        this.values = object.values;
      }
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      var result = new SERPRequestObject(this._urlR, this.requestUrlHash);
      if (this._urlS !== null) {
        var urls = result.getUrlS();
        this._urlS.forEach(function (value, key) {
          return urls.set(key, value);
        });
      }
      if (this._urlNA !== null) {
        var urlna = result.getUrlNA();
        this._urlNA.forEach(function (value, key) {
          return urlna.set(key, value);
        });
      }
      for (var key in this.values) {
        if (this.values.hasOwnProperty(key)) {
          result.values[key] = this.values[key];
        }
      }
      return result;
    }
  }]);
}();
SERPRequestObject.fromPlainObject = function (object) {
  var result = new SERPRequestObject(object['url-r'], object.requestUrlHash);
  if ('values' in object) {
    result.values = object.values;
  }
  if ('params' in object) {
    object.params.forEach(function (paramId) {
      return result.params.add(paramId);
    });
  }
  if ('url-s' in object) {
    for (var key in object['url-s']) {
      if (object['url-s'].hasOwnProperty(key)) {
        result.getUrlS().set(key, object['url-s'][key]);
      }
    }
  }
  if ('url-na' in object) {
    for (var _key2 in object['url-na']) {
      if (object['url-na'].hasOwnProperty(_key2)) {
        result.getUrlS().set(_key2, object['url-na'][_key2]);
      }
    }
  }
  return result;
};
module.exports = SERPRequestObject;

},{}],126:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var ToggleButton = require('../effects/ToggleButton');
var translateMixin = require('../utils/translateMixin');
var eventsMixin = require('../utils/eventsMixin');
var ignore = require('../lib/ignore');
var SortPanel = function () {
  function SortPanel() {
    _classCallCheck(this, SortPanel);
    this._element = null;
    this._buttonToggle = null;
    this._toggleElement = null;
    this._toggleContainer = null;
    this._selectField = null;
    this._radioAscending = null;
    this._radioDescending = null;
    this._parameters = null;
    this._isInit = false;
    this._order = null;
    this._textSortBy = '';
    this._textSortMessage = '';
    this._showAS = false;
    this.processToggleUp = this.handleToggleUp.bind(this);
    this.processToggleDown = this.handleToggleDown.bind(this);
    this.processAscendingClick = this.handleAscendingClick.bind(this);
    this.processDescendingClick = this.handleDescendingClick.bind(this);
    this.processSortChange = this.handleSortChange.bind(this);
    this.processItemCreate = this.handleItemCreate.bind(this);
  }
  return _createClass(SortPanel, [{
    key: "element",
    get: function get() {
      if (!this._isInit) {
        return dom('span', 'Panel not inited');
      }
      return this._element;
    }
  }, {
    key: "parameters",
    set: function set(parameters) {
      if (!this._isInit) {
        return;
      }
      this._parameters = parameters;
      this.recreateSortList();
    }
  }, {
    key: "showAS",
    set: function set(value) {
      this._showAS = value;
      this.recreateSortList();
    }
  }, {
    key: "field",
    get: function get() {
      var result = this._selectField.querySelector(':checked');
      if (result) {
        return dom.value(result);
      }
      return '';
    }
  }, {
    key: "order",
    get: function get() {
      return this._order;
    }
  }, {
    key: "recreateSortList",
    value: function recreateSortList() {
      Array.from(this._selectField.children).forEach(function (element) {
        return dom.removeElement(element);
      });
      this._selectField.appendChild(dom('option', {
        disabled: true,
        value: ''
      }, this._textSortMessage));
      if (this._showAS) {
        this._selectField.appendChild(dom('option', {
          value: 'AS'
        }, 'AS'));
      }
      this._parameters.forEach(this.processItemCreate);
      dom.value(this._selectField, '');
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (this._isInit) {
        return;
      }
      this._element = dom('div', {
        className: 'seoquake-container'
      });
      this._buttonToggle = dom('button', {
        className: 'seoquake-container-header'
      }, 'Sort this page');
      this._toggleContainer = dom('div');
      this._selectField = dom('select');
      this._selectField.addEventListener('change', this.processSortChange);
      this._radioAscending = dom('div', {
        className: 'seoquake-radio seoquake-radio_checked'
      }, 'ascending');
      this._radioAscending.addEventListener('click', this.processAscendingClick);
      this._order = 'asc';
      this._radioDescending = dom('div', {
        className: 'seoquake-radio'
      }, 'descending');
      this._radioDescending.addEventListener('click', this.processDescendingClick);
      this._toggleElement = new ToggleButton(this._buttonToggle);
      this._toggleElement.addEventListener('down', this.processToggleDown);
      this._toggleElement.addEventListener('up', this.processToggleUp);
      this.handleToggleUp();
      var wait = [this.t('sqSerpOverlay_sort_title').then(function (text) {
        return dom.setContent(_this._buttonToggle, dom.parse(text, {
          lineBreak: 'br'
        }));
      })["catch"](ignore), this.t('sqSerpOverlay_sort_ascending').then(function (text) {
        return dom.text(_this._radioAscending, text);
      })["catch"](ignore), this.t('sqSerpOverlay_sort_descending').then(function (text) {
        return dom.text(_this._radioDescending, text);
      })["catch"](ignore), this.t('sqSerpOverlay_sort_message').then(function (text) {
        return _this._textSortMessage = text;
      })["catch"](ignore), this.t('sqSerpOverlay_sort_by').then(function (text) {
        return _this._textSortBy = text;
      })["catch"](ignore)];
      this._toggleContainer.appendChild(this._selectField);
      this._toggleContainer.appendChild(this._radioAscending);
      this._toggleContainer.appendChild(this._radioDescending);
      this._element.appendChild(this._buttonToggle);
      this._element.appendChild(this._toggleContainer);
      return Promise.all(wait).then(function () {
        return _this._isInit = true;
      })["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      this.clearEvents();
    }
  }, {
    key: "handleToggleUp",
    value: function handleToggleUp() {
      dom.addClass(this._toggleContainer, 'seoquake-container_hidden');
    }
  }, {
    key: "handleToggleDown",
    value: function handleToggleDown() {
      dom.removeClass(this._toggleContainer, 'seoquake-container_hidden');
    }
  }, {
    key: "handleAscendingClick",
    value: function handleAscendingClick(event) {
      dom.addClass(this._radioAscending, 'seoquake-radio_checked');
      dom.removeClass(this._radioDescending, 'seoquake-radio_checked');
      this._order = 'asc';
      this.handleSortChange(event);
    }
  }, {
    key: "handleDescendingClick",
    value: function handleDescendingClick(event) {
      dom.removeClass(this._radioAscending, 'seoquake-radio_checked');
      dom.addClass(this._radioDescending, 'seoquake-radio_checked');
      this._order = 'desc';
      this.handleSortChange(event);
    }
  }, {
    key: "handleSortChange",
    value: function handleSortChange(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('sort', {
        order: this.order,
        field: this.field
      });
    }
  }, {
    key: "handleItemCreate",
    value: function handleItemCreate(parameter, value) {
      if ('matches' in parameter) {
        this._selectField.appendChild(dom('option', {
          value: value
        }, this._textSortBy + ' ' + parameter.name));
      }
    }
  }]);
}();
translateMixin(SortPanel.prototype);
eventsMixin(SortPanel.prototype);
module.exports = SortPanel;

},{"../dom/main":33,"../effects/ToggleButton":52,"../lib/ignore":63,"../utils/eventsMixin":148,"../utils/translateMixin":154}],127:[function(require,module,exports){
'use strict';

var lib = require('../Lib');
var ignore = require('../lib/ignore');
var dom = require('../dom/main');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var parseArgs = require('../lib/parseArgs');
var SERPRequestObject = require('./SERPRequestObject');
var OnboardingKeywordDifficulty = require('./elements/OnboardingKeywordDifficulty');
var CURRENT_BASE;
var DOMAIN_TO_DB = {
  'www.google.com': 'us',
  'www.google.co.uk': 'uk',
  'www.google.ca': 'ca',
  'www.google.ru': 'ru',
  'www.google.de': 'de',
  'www.google.fr': 'fr',
  'www.google.es': 'es',
  'www.google.it': 'it',
  'www.google.com.br': 'br',
  'www.google.com.au': 'au',
  'www.google.com.ar': 'ar',
  'www.google.be': 'be',
  'www.google.dk': 'dk'
};
var DB_TO_BASE = {
  us: 'google.com',
  uk: 'google.co.uk',
  ca: 'google.ca',
  ru: 'google.ru',
  de: 'google.de',
  fr: 'google.fr',
  es: 'google.es',
  it: 'google.it',
  br: 'google.com.br',
  au: 'google.com.au',
  ar: 'google.com.ar',
  be: 'google.be',
  dk: 'google.dk'
};
var GL_TO_DB = {
  GB: 'uk'
};
var DB_COEFF = {
  us: 2.23,
  uk: 2.30,
  ca: 2.45,
  ru: 2.45,
  de: 2.45,
  fr: 2.45,
  es: 2.45,
  it: 2.30,
  br: 2.50,
  au: 2.30,
  ar: 2.65,
  be: 2.60,
  ch: 2.60,
  dk: 2.55,
  fi: 2.65,
  hk: 2.65,
  ie: 2.65,
  il: 2.65,
  mx: 2.65,
  nl: 2.45,
  no: 2.65,
  pl: 2.65,
  se: 2.65,
  sg: 2.65,
  tr: 2.65,
  jp: 2.50,
  "in": 2.45,
  hu: 2.65
};
var LINK_TEMPLATE = 'https://www.semrush.com/analytics/keywordoverview/?q={keyword}&db={db}&utm_source=seoquake&utm_medium=serpoverlay&utm_campaign=kd&ref=174537735';
var LINK_SOURCE = 'https://seoquake.publicapi.semrush.com/#db#/info.php?url={scheme}%3A%2F%2F{domain|encode}%2F';
var LINK_TS_SOURCE = 'https://www.semrush.com/analytics/overview/?q={domain}&searchType=domain&utm_source=seoquake&utm_medium=serpoverlay&utm_campaign=trustmetrics&ref=174537735';
var LINK_TA_SOURCE = 'https://www.semrush.com/analytics/traffic/overview/?q={domain}&searchType=domain&utm_source=seoquake&utm_medium=serpoverlay&utm_campaign=TA_exp&ref=174537735';
function createResourceUrl() {
  return LINK_SOURCE.replace('#db#', detectBase());
}
function createDSTSLink(domain) {
  return LINK_TS_SOURCE.replace('{db}', detectBase()).replace('{domain}', encodeURIComponent(domain));
}
function createTALink(domain) {
  return LINK_TA_SOURCE.replace('{domain}', encodeURIComponent(domain));
}
function detectBase() {
  if (typeof document === 'undefined' || document.location === 'undefined') {
    return 'us';
  }
  var args = parseArgs.parseArgs(document.location.search);
  var hash = parseArgs.parseArgs(document.location.hash);
  if (hash.has('gl')) {
    var gl = hash.get('gl');
    if (GL_TO_DB.hasOwnProperty(gl)) {
      return GL_TO_DB[gl];
    } else {
      gl = gl.toLowerCase();
      if (DB_COEFF.hasOwnProperty(gl)) {
        return gl;
      }
    }
  }
  if (args.has('gl')) {
    var _gl = args.get('gl');
    if (GL_TO_DB.hasOwnProperty(_gl)) {
      return GL_TO_DB[_gl];
    } else {
      _gl = _gl.toLowerCase();
      if (DB_COEFF.hasOwnProperty(_gl)) {
        return _gl;
      }
    }
  }
  var hostname = document.location.hostname;
  if (DOMAIN_TO_DB.hasOwnProperty(hostname)) {
    return DOMAIN_TO_DB[hostname];
  }
  return 'us';
}
function getDBTitle() {
  return DB_TO_BASE[detectBase()];
}
function countDomainStrength(rank) {
  if (CURRENT_BASE === null) {
    CURRENT_BASE = detectBase();
  }
  return 100 - Math.pow(Math.log10(rank), DB_COEFF[CURRENT_BASE]);
}
module.exports = {
  createResourceUrl: createResourceUrl,
  detectBase: detectBase,
  getDBTitle: getDBTitle,
  countDomainStrength: countDomainStrength,
  createDSTSLink: createDSTSLink,
  DB_TO_BASE: DB_TO_BASE,
  GL_TO_DB: GL_TO_DB,
  DB_COEFF: DB_COEFF,
  LINK_TEMPLATE: LINK_TEMPLATE,
  LINK_SOURCE: LINK_SOURCE,
  createTALink: createTALink
};

},{"../Lib":7,"../dom/main":33,"../lib/ignore":63,"../lib/parseArgs":70,"../utils/messengerTranslateMixin":152,"./SERPRequestObject":125,"./elements/OnboardingKeywordDifficulty":128}],128:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../../dom/main');
var OnboardingDropdown = require('../../effects/OnboardingDropdown');
var OnboardingKeywordDifficulty = function (_OnboardingDropdown) {
  function OnboardingKeywordDifficulty() {
    _classCallCheck(this, OnboardingKeywordDifficulty);
    return _callSuper(this, OnboardingKeywordDifficulty, arguments);
  }
  _inherits(OnboardingKeywordDifficulty, _OnboardingDropdown);
  return _createClass(OnboardingKeywordDifficulty, [{
    key: "init",
    value: function init() {
      this._translateList = [this.t('sqSerpOverlay_keyword_difficulty_onboarding_ok'), this.t('sqSerpOverlay_keyword_difficulty_onboarding_close'), this.t('sqSerpOverlay_keyword_difficulty_onboarding_text')];
      _get(_getPrototypeOf(OnboardingKeywordDifficulty.prototype), "init", this).call(this);
      this.body.setAttribute('data-role', 'onboarding-keyword-difficulty');
    }
  }]);
}(OnboardingDropdown);
module.exports = OnboardingKeywordDifficulty;

},{"../../dom/main":33,"../../effects/OnboardingDropdown":48}],129:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../../dom/main');
var OnboardingDropdown = require('../../effects/OnboardingDropdown');
var OnboardingSERPTrustScore = function (_OnboardingDropdown) {
  function OnboardingSERPTrustScore() {
    _classCallCheck(this, OnboardingSERPTrustScore);
    return _callSuper(this, OnboardingSERPTrustScore, arguments);
  }
  _inherits(OnboardingSERPTrustScore, _OnboardingDropdown);
  return _createClass(OnboardingSERPTrustScore, [{
    key: "init",
    value: function init() {
      this._translateList = [this.t('sqSerpOverlay_keyword_difficulty_onboarding_ok'), this.t('sqSerpOverlay_keyword_difficulty_onboarding_close'), this.t('sqSERPSemRush_onboarding_text')];
      _get(_getPrototypeOf(OnboardingSERPTrustScore.prototype), "init", this).call(this);
      this.body.setAttribute('data-role', 'onboarding-serp-trust');
    }
  }]);
}(OnboardingDropdown);
module.exports = OnboardingSERPTrustScore;

},{"../../dom/main":33,"../../effects/OnboardingDropdown":48}],130:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SEMrushParametersPanel = require('./SEMrushParametersPanel');
var dom = require('../../dom/main');
var SEMrushParametersConnectPanel = function (_SEMrushParametersPan) {
  function SEMrushParametersConnectPanel(container, index, url) {
    var _this;
    _classCallCheck(this, SEMrushParametersConnectPanel);
    _this = _callSuper(this, SEMrushParametersConnectPanel, [container, index, url]);
    _this._connectElement = null;
    _this.processTranslateReady = _this.handleTranslateReady.bind(_this);
    _this.processConnectLinkClick = _this.handleConnectLinkClick.bind(_this);
    return _this;
  }
  _inherits(SEMrushParametersConnectPanel, _SEMrushParametersPan);
  return _createClass(SEMrushParametersConnectPanel, [{
    key: "init",
    value: function init() {
      if (this._index !== 0) {
        return;
      }
      this._translateList.push(this.t('sqSERPSemRush_connect_block'));
      this._connectElement = dom('div', {
        className: 'sqsrpp-connect',
        style: 'position: static; margin-left: 0; height: 16px; line-height: 9px;'
      });
      _get(_getPrototypeOf(SEMrushParametersConnectPanel.prototype), "init", this).call(this);
      this.ts = 0;
      this.ds = 0;
      this.as = 0;
      this._element.appendChild(this._connectElement);
      this._element.style = 'height: auto;';
      dom.addClass(this._element, 'sqsrpp-container__connect');
      dom.insertFirst(this._element, this._container);
    }
  }, {
    key: "handleTranslateReady",
    value: function handleTranslateReady(msgs) {
      dom.setContent(this._connectElement, dom.parse(msgs[0], {
        lineBreak: 'br'
      }));
      var connectLink = this._connectElement.querySelector('a');
      if (connectLink) {
        connectLink.addEventListener('click', this.processConnectLinkClick, true);
      }
      if (this._infoHintbox !== null) {
        this._infoHintbox.message = dom.parse(msgs[1]);
      }
    }
  }, {
    key: "handleConnectLinkClick",
    value: function handleConnectLinkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('connectClicked');
    }
  }]);
}(SEMrushParametersPanel);
module.exports = SEMrushParametersConnectPanel;

},{"../../dom/main":33,"./SEMrushParametersPanel":133}],131:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SEMrushParametersPanel = require('./SEMrushParametersPanel');
var dom = require('../../dom/main');
var detectGoogleBase = require('../detectGoogleBase');
var SEMrushParametersDataPanel = function (_SEMrushParametersPan) {
  function SEMrushParametersDataPanel(container, index, url, requested) {
    var _this;
    _classCallCheck(this, SEMrushParametersDataPanel);
    _this = _callSuper(this, SEMrushParametersDataPanel, [container, index, url]);
    _this._isRequestMode = requested;
    _this._reportLink = null;
    return _this;
  }
  _inherits(SEMrushParametersDataPanel, _SEMrushParametersPan);
  return _createClass(SEMrushParametersDataPanel, [{
    key: "loading",
    set: function set(value) {
      if (this._element === null) {
        return;
      }
      dom.removeClass(this._element, 'sqsrpp-container__no-data');
      if (value) {
        dom.addClass(this._element, 'sqsrpp-container_loading');
      } else {
        dom.removeClass(this._element, 'sqsrpp-container_loading');
      }
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(SEMrushParametersDataPanel.prototype), "init", this).call(this);
      this.ts = 0;
      this.ds = 0;
      this.as = 0;
      if (this._isRequestMode) {
        dom.addClass(this._element, 'sqsrpp-container__no-data');
      }
      dom.insertFirst(this._element, this._container);
    }
  }, {
    key: "remove",
    value: function remove() {
      _get(_getPrototypeOf(SEMrushParametersDataPanel.prototype), "remove", this).call(this);
      this._reportLink = null;
      this._isRequestMode = false;
    }
  }]);
}(SEMrushParametersPanel);
module.exports = SEMrushParametersDataPanel;

},{"../../dom/main":33,"../detectGoogleBase":127,"./SEMrushParametersPanel":133}],132:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var SEMrushParametersPanel = require('./SEMrushParametersPanel');
var SEMrushParametersDisabledPanel = function (_SEMrushParametersPan) {
  function SEMrushParametersDisabledPanel() {
    _classCallCheck(this, SEMrushParametersDisabledPanel);
    return _callSuper(this, SEMrushParametersDisabledPanel, arguments);
  }
  _inherits(SEMrushParametersDisabledPanel, _SEMrushParametersPan);
  return _createClass(SEMrushParametersDisabledPanel, [{
    key: "init",
    value: function init() {}
  }]);
}(SEMrushParametersPanel);
module.exports = SEMrushParametersDisabledPanel;

},{"./SEMrushParametersPanel":133}],133:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../../dom/main');
var ProgressBar = require('../../effects/ProgressBar');
var eventsMixin = require('../../utils/eventsMixin');
var translateMixin = require('../../utils/translateMixin');
var HintBox = require('../../effects/HintBox');
var ignore = require('../../lib/ignore');
var parseUri = require('../../lib/parseUri').parseUri;
var detectGoogleBase = require('../detectGoogleBase');
var SEMrushParametersPanel = function () {
  function SEMrushParametersPanel(container, index, url) {
    _classCallCheck(this, SEMrushParametersPanel);
    url = url || '';
    var uri = parseUri(url);
    this._container = container;
    this._index = index;
    this._url = uri.clean_domain;
    this._element = dom('div', {
      className: 'bm_seoquake sqsrpp-container'
    });
    this._metrics = [{
      name: 'Visits',
      defaultValue: 0,
      prop: 'visits'
    }, {
      name: 'Pages/Visit',
      defaultValue: 0,
      prop: 'pagesPerVisit'
    }, {
      name: 'Avg. Visit',
      defaultValue: 0,
      prop: 'averageVisit'
    }, {
      name: 'Bounce rate',
      defaultValue: 0,
      prop: 'bounceRate'
    }];
    this._dsBar = null;
    this._tsBar = null;
    this._asBar = null;
    this._info = null;
    this._infoHintbox = null;
    this._translateList = [];
    this.processTranslateReady = this.handleTranslateReady.bind(this);
  }
  return _createClass(SEMrushParametersPanel, [{
    key: "index",
    get: function get() {
      return this._index;
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "url",
    get: function get() {
      return this._url;
    }
  }, {
    key: "ts",
    get: function get() {
      return this._tsBar !== null ? this._tsBar.current : 0;
    },
    set: function set(value) {
      if (this._tsBar !== null) {
        this._tsBar.current = value;
      }
    }
  }, {
    key: "ds",
    get: function get() {
      return this._dsBar !== null ? this._dsBar.current : 0;
    },
    set: function set(value) {
      if (this._dsBar !== null) {
        this._dsBar.current = value;
      }
    }
  }, {
    key: "as",
    get: function get() {
      return this._asBar !== null ? this._asBar.current : 0;
    },
    set: function set(value) {
      if (this._asBar !== null) {
        this._asBar.current = value;
      }
    }
  }, {
    key: "loading",
    set: function set(value) {
      if (this._element === null) {
        return;
      }
      if (value) {
        dom.addClass(this._element, 'sqsrpp-container_loading');
      } else {
        dom.removeClass(this._element, 'sqsrpp-container_loading');
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      this._dsBar = new ProgressBar(50, 100, {
        title: 'DS:',
        showPercent: true
      });
      this._tsBar = new ProgressBar(50, 100, {
        title: 'TS:',
        showPercent: true
      });
      this._asBar = new ProgressBar(50, 100, {
        title: 'AS:',
        showPercent: true
      });
      var dsElement = dom.createElement('a', {
        className: 'seoquake-progress-bar-container',
        href: detectGoogleBase.createDSTSLink(this.url),
        rel: '',
        target: '_blank',
        style: 'vertical-align: baseline;'
      });
      var tsElement = dsElement.cloneNode(false);
      var asElement = dsElement.cloneNode(false);
      dsElement.appendChild(this._dsBar.element);
      tsElement.appendChild(this._tsBar.element);
      asElement.appendChild(this._asBar.element);
      this._element.appendChild(asElement);
      this._asBar.element.style.marginRight = '12px';
      this._metrics.forEach(function (_ref) {
        var name = _ref.name,
          prop = _ref.prop,
          defaultValue = _ref.defaultValue;
        var node = dom('a', {
          className: 'seoquake-parameter-button',
          href: detectGoogleBase.createTALink(parseUri(_this.url).domain),
          rel: '',
          target: '_blank',
          style: 'vertical-align: baseline;'
        });
        node.innerHTML = "".concat(name, ": <span>").concat(defaultValue, "</span>");
        _this._element.appendChild(node);
        Object.defineProperty(_this, prop, {
          set: function set(x) {
            node.querySelector('span').innerHTML = x;
          },
          get: function get() {
            return node.querySelector('span').textContent;
          }
        });
      });
      this._info = dom('div', {
        className: 'sqsrpp-info-icon'
      });
      this._infoHintbox = new HintBox(this._info, {
        event: 'hover',
        message: '',
        className: 'bm_seoquake seoquake-hintbox seoquake-hintbox-bottom'
      });
      this._translateList.push(this.t('sqSERPSemRush_hint'));
      this.translate();
    }
  }, {
    key: "translate",
    value: function translate() {
      Promise.all(this._translateList).then(this.processTranslateReady)["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;
      if (this._infoHintbox !== null) {
        this._infoHintbox.remove();
      }
      this._metrics.forEach(function (_ref2) {
        var prop = _ref2.prop;
        return Object.defineProperty(_this2, prop, {});
      });
      this._dsBar = null;
      this._tsBar = null;
      this._asBar = null;
      this._info = null;
      this._infoHintbox = null;
      dom.removeElement(this._element);
      this._element = null;
    }
  }, {
    key: "handleTranslateReady",
    value: function handleTranslateReady(msgs) {
      if (this._infoHintbox !== null) {
        this._infoHintbox.message = dom.parse(msgs[0]);
      }
    }
  }]);
}();
eventsMixin(SEMrushParametersPanel.prototype);
translateMixin(SEMrushParametersPanel.prototype);
module.exports = SEMrushParametersPanel;

},{"../../dom/main":33,"../../effects/HintBox":46,"../../effects/ProgressBar":50,"../../lib/ignore":63,"../../lib/parseUri":71,"../../utils/eventsMixin":148,"../../utils/translateMixin":154,"../detectGoogleBase":127}],134:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../../dom/main');
var messengerMixin = require('../../utils/messengerMixin');
var translateMixin = require('../../utils/translateMixin');
var SemrushApi = require('../../semrush/SemrushApi');
var isEmpty = require('../../lib/isEmpty');
var eventsMixin = require('../../utils/eventsMixin');
var SEMrushParametersConnectPanel = require('./SEMrushParametersConnectPanel');
var SEMrushParametersDisabledPanel = require('./SEMrushParametersDisabledPanel');
var SEMrushParametersDataPanel = require('./SEMrushParametersDataPanel');
var OnboardingSERPTrustScore = require('./OnboardingSERPTrustScore');
var ignore = require('../../lib/ignore');
var parseUri = require('../../lib/parseUri');
var normalizeNumber = require('../../utils/normalizeNumber');
var SEMrushParametersPanels = function () {
  function SEMrushParametersPanels(serpOverlay) {
    _classCallCheck(this, SEMrushParametersPanels);
    if (isEmpty(serpOverlay)) {
      throw new Error('No plugin provided');
    }
    this._plugin = serpOverlay;
    this._panels = new Map();
    this._loadingList = new Map();
    this._analyticsList = new Map();
    this._currentState = SEMrushParametersPanels.STATE_NONE;
    this._createPanelCallback = null;
    this._onboarding = null;
    this.processConfigurationUpdate = this.handleConfigurationUpdate.bind(this);
    this.processConnectClicked = this.handleConnectClicked.bind(this);
    this.processParametersPanelsReady = this.handleParametersPanelsReady.bind(this);
    this.processShowOnboarding = this.handleShowOnboarding.bind(this);
    this.processOnboardingOkClick = this.handleOnboardingOkClick.bind(this);
    this.processOnboardingCloseClick = this.handleOnboardingCloseClick.bind(this);
    this.processBacklinksReady = this.handleBacklinksReady.bind(this);
    this.processAnalyticsReady = this.handleAnalyticsReady.bind(this);
  }
  return _createClass(SEMrushParametersPanels, [{
    key: "firstPanel",
    get: function get() {
      var first = this._panels.values().next();
      if (!first.done && !(first.value instanceof Array)) {
        return first.value;
      }
      return null;
    }
  }, {
    key: "init",
    value: function init() {
      this.setMessenger(this._plugin.getMessenger());
      this.setTranslateFunction(this._plugin.t.bind(this));
      this._api = new SemrushApi();
      this._api.setMessenger(this.getMessenger());
      this.handleConfigurationUpdate();
      this._plugin.addEventListener('afterParametersUpdated', this.processConfigurationUpdate);
      this._plugin.addEventListener('parametersPanelsReady', this.processParametersPanelsReady);
    }
  }, {
    key: "createPanel",
    value: function createPanel(panel, index, url) {
      if (this._createPanelCallback === null || this._currentState === SEMrushParametersPanels.STATE_NONE) {
        return;
      }
      var newPanel = this._createPanelCallback(panel, index, url);
      newPanel.setTranslateFunction(this.getTranslateFunction());
      newPanel.init();
      newPanel.addEventListener('connectClicked', this.processConnectClicked);
      this._panels.set(panel, newPanel);
    }
  }, {
    key: "extendPanel",
    value: function extendPanel(panel, url) {
      var index = this._panels.size;
      if (this._panels.has(panel)) {
        var oldPanel = this._panels.get(panel);
        if (!(oldPanel instanceof Array)) {
          index = oldPanel.index;
          url = oldPanel.url;
          oldPanel.remove();
        } else {
          index = oldPanel[0];
          url = oldPanel[1];
        }
      }
      if (this._currentState === SEMrushParametersPanels.STATE_NONE) {
        this._panels.set(panel, [index, url]);
      } else {
        this.createPanel(panel, index, url);
      }
    }
  }, {
    key: "removePanels",
    value: function removePanels() {
      this._panels.forEach(function (panelObject) {
        return panelObject instanceof Array ? noop() : panelObject.remove();
      });
      this._panels.clear();
      this._currentState = SEMrushParametersPanels.STATE_NONE;
      this.hideOnboarding();
    }
  }, {
    key: "redrawPanel",
    value: function redrawPanel(panelObject, panel) {
      var index;
      var url;
      if (panelObject instanceof Array) {
        index = panelObject[0];
        url = panelObject[1];
      } else {
        index = panelObject.index;
        url = panelObject.url;
        panelObject.remove();
      }
      this.createPanel(panel, index, url);
    }
  }, {
    key: "redrawPanels",
    value: function redrawPanels() {
      this._panels.forEach(this.redrawPanel.bind(this));
      if (this._panels.size > 0 && this._currentState === SEMrushParametersPanels.STATE_MODE_AUTO) {
        this.loadAllPanelsData();
      }
    }
  }, {
    key: "loadPanelData",
    value: function loadPanelData(panel) {
      var panelObject = this._panels.get(panel);
      if (!panelObject || panelObject instanceof Array) {
        return;
      }
      var url = panelObject.url;
      if (!url) {
        return;
      }
      if (this._loadingList.has(url)) {
        this._loadingList.get(url).push(panelObject);
      } else {
        this._loadingList.set(url, [panelObject]);
      }
      var urlData = parseUri.parseUri(url);
      if (!this._analyticsList.has(urlData.domain)) {
        this._analyticsList.set(urlData.domain, []);
      }
      this._analyticsList.get(urlData.domain).push(panelObject);
      panelObject.loading = true;
      this._api.getTrafficAnalytics(urlData.clean_domain, urlData.is_subdomain).then(this.processAnalyticsReady)["catch"](ignore);
      return this._api.getBacklinks('root_domain', url).then(this.processBacklinksReady)["catch"](ignore);
    }
  }, {
    key: "loadAllPanelsData",
    value: function loadAllPanelsData() {
      var _this = this;
      var results = [];
      this._panels.forEach(function (panelObject, panel) {
        return results.push(_this.loadPanelData(panel));
      });
      return Promise.all(results);
    }
  }, {
    key: "showOnboarding",
    value: function showOnboarding() {
      if (!this._plugin.configuration.core.onboarding_semrush_panel) {
        return;
      }
      setTimeout(this.processShowOnboarding, 300);
    }
  }, {
    key: "hideOnboarding",
    value: function hideOnboarding() {
      if (this._onboarding) {
        this._onboarding.remove();
        this._onboarding = null;
      }
    }
  }, {
    key: "enchanceHeadersLine",
    value: function enchanceHeadersLine(line) {
      if (this._currentState === SEMrushParametersPanels.STATE_MODE_AUTO || this._currentState === SEMrushParametersPanels.STATE_MODE_REQUEST) {
        line.push('AS');
      }
    }
  }, {
    key: "enchanceDataLine",
    value: function enchanceDataLine(line, panel) {
      if (this._currentState === SEMrushParametersPanels.STATE_MODE_AUTO || this._currentState === SEMrushParametersPanels.STATE_MODE_REQUEST) {
        if (this._panels.has(panel)) {
          var panelObject = this._panels.get(panel);
          if (!(panelObject instanceof Array)) {
            line.push(panelObject.as);
          } else {
            line.push(0);
            line.push(0);
          }
        } else {
          line.push(0);
          line.push(0);
        }
      }
    }
  }, {
    key: "getSortedItems",
    value: function getSortedItems(paramId) {
      var params = [];
      if (['TS', 'DS', 'AS'].indexOf(paramId) === -1) {
        return params;
      }
      this._panels.forEach(function (panelObject, panel) {
        var value;
        if (paramId === 'DS') {
          value = panelObject.ds;
        } else if (paramId === 'TS') {
          value = panelObject.ts;
        } else {
          value = panelObject.as;
        }
        params.push({
          urlHash: panel.getAttribute('dataurlhash'),
          requestUrlHash: '',
          paramId: paramId,
          value: value
        });
      });
      return params;
    }
  }, {
    key: "stateConnect",
    value: function stateConnect() {
      if (this._currentState === SEMrushParametersPanels.STATE_CONNECT) {
        return;
      }
      this._createPanelCallback = SEMrushParametersPanels.createConnectPanel;
      this._currentState = SEMrushParametersPanels.STATE_CONNECT;
      this.redrawPanels();
      this.showOnboarding();
    }
  }, {
    key: "stateDisabled",
    value: function stateDisabled() {
      if (this._currentState === SEMrushParametersPanels.STATE_DISABLED) {
        return;
      }
      this._createPanelCallback = SEMrushParametersPanels.createDisabledPanel;
      this._currentState = SEMrushParametersPanels.STATE_DISABLED;
      this.redrawPanels();
      this.hideOnboarding();
    }
  }, {
    key: "stateModeAuto",
    value: function stateModeAuto() {
      if (this._currentState === SEMrushParametersPanels.STATE_MODE_AUTO) {
        return;
      }
      this._createPanelCallback = SEMrushParametersPanels.createAutoPanel;
      this._currentState = SEMrushParametersPanels.STATE_MODE_AUTO;
      this.redrawPanels();
      this.showOnboarding();
    }
  }, {
    key: "stateModeRequest",
    value: function stateModeRequest() {
      if (this._currentState === SEMrushParametersPanels.STATE_MODE_REQUEST) {
        return;
      }
      this._createPanelCallback = SEMrushParametersPanels.createRequestPanel;
      this._currentState = SEMrushParametersPanels.STATE_MODE_REQUEST;
      this.redrawPanels();
      this.showOnboarding();
    }
  }, {
    key: "handleConfigurationUpdate",
    value: function handleConfigurationUpdate() {
      if (!this._plugin.configuration.core.onboarding_semrush_panel) {
        this.hideOnboarding();
      }
      if (this._plugin.configuration.core.disabled || this._plugin.pluginConfiguration.disabled || !this._plugin.pluginConfiguration.show_semrush_panel) {
        this.stateDisabled();
        return;
      }
      this._api.getIsConnected().then(this.handleConnected.bind(this))["catch"](this.stateConnect.bind(this));
    }
  }, {
    key: "handleConnected",
    value: function handleConnected() {
      if (this._plugin.pluginConfiguration.mode === 1) {
        this.stateModeRequest();
      } else {
        this.stateModeAuto();
      }
    }
  }, {
    key: "handleConnectClicked",
    value: function handleConnectClicked() {
      this._plugin._sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      });
      this._plugin.registerEvent('SERP Overlay', 'DsTs', 'Connect');
    }
  }, {
    key: "handleParametersPanelsReady",
    value: function handleParametersPanelsReady() {
      if (this._currentState === SEMrushParametersPanels.STATE_NONE) {
        this.handleConfigurationUpdate();
      } else {
        this.redrawPanels();
      }
    }
  }, {
    key: "handleShowOnboarding",
    value: function handleShowOnboarding() {
      var first = this.firstPanel;
      if (first && first.element) {
        this._onboarding = new OnboardingSERPTrustScore(first.element, {
          positionCorrection: {
            left: -7
          }
        });
        this._onboarding.setTranslateFunction(this.getTranslateFunction());
        this._onboarding.addEventListener('okClick', this.processOnboardingOkClick);
        this._onboarding.addEventListener('closeClick', this.processOnboardingCloseClick);
        this._onboarding.init();
        this._onboarding.show();
      }
    }
  }, {
    key: "handleOnboardingOkClick",
    value: function handleOnboardingOkClick() {
      var _this2 = this;
      if (this._onboarding !== null) {
        var messages = [this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'core.onboarding_semrush_panel',
          value: false
        }), this._plugin.registerEvent('SERP Overlay', 'DsTs', 'Like')];
        Promise.all(messages).then(function (result) {
          return _this2._plugin.updateConfiguration();
        })["catch"](ignore);
        this.hideOnboarding();
      }
    }
  }, {
    key: "handleOnboardingCloseClick",
    value: function handleOnboardingCloseClick() {
      var _this3 = this;
      if (this._onboarding !== null) {
        var messages = [this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'core.onboarding_semrush_panel',
          value: false
        }), this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'google.show_semrush_panel',
          value: false
        }), this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'bing.show_semrush_panel',
          value: false
        }), this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'yahoo.show_semrush_panel',
          value: false
        }), this._plugin._sendMessage('sq.setConfigurationItem', {
          name: 'yandex.show_semrush_panel',
          value: false
        }), this._plugin.registerEvent('SERP Overlay', 'DsTs', 'Hate')];
        Promise.all(messages).then(function (result) {
          return _this3._plugin.updateConfiguration();
        })["catch"](ignore);
        this.hideOnboarding();
      }
    }
  }, {
    key: "handleAnalyticsReady",
    value: function handleAnalyticsReady(data) {
      if (!data || data.status !== 200) {
        return;
      }
      var _data$data = data.data,
        pages_per_visit = _data$data.pages_per_visit,
        bounce_rate = _data$data.bounce_rate,
        visits = _data$data.visits,
        time_on_site = _data$data.time_on_site,
        target = _data$data.target;
      this._analyticsList.get(target).forEach(function (panelObject) {
        if (panelObject.element !== null) {
          panelObject.pagesPerVisit = parseFloat(pages_per_visit).toFixed(2);
          panelObject.averageVisit = [parseInt(time_on_site / 60), time_on_site % 60].map(function (time) {
            return time.toString().padStart(2, '0');
          }).join(':');
          panelObject.bounceRate = (parseFloat(bounce_rate) * 100).toFixed(2) + '%';
          panelObject.visits = normalizeNumber(visits).shortValue;
        }
      });
      this._analyticsList["delete"](target);
    }
  }, {
    key: "handleBacklinksReady",
    value: function handleBacklinksReady(data) {
      if (typeof data.url === 'undefined') {
        return;
      }
      if (!this._loadingList.has(data.url)) {
        return;
      }
      var ts = 0;
      var ds = 0;
      var as = 0;
      if (!(typeof data.error !== 'undefined' || typeof data.data.ascore === 'undefined' || typeof data.data.total === 'undefined' || data.data.total === 0)) {
        as = data.data.ascore;
      }
      this._loadingList.get(data.url).forEach(function (panelObject) {
        if (panelObject.element !== null) {
          panelObject.ts = ts;
          panelObject.ds = ds;
          panelObject.as = as;
          panelObject.loading = false;
        }
      });
      this._loadingList["delete"](data.url);
    }
  }], [{
    key: "createConnectPanel",
    value: function createConnectPanel(panel, index, url) {
      return new SEMrushParametersConnectPanel(panel, index, url);
    }
  }, {
    key: "createDisabledPanel",
    value: function createDisabledPanel(panel, index, url) {
      return new SEMrushParametersDisabledPanel(panel, index, url);
    }
  }, {
    key: "createRequestPanel",
    value: function createRequestPanel(panel, index, url) {
      return new SEMrushParametersDataPanel(panel, index, url, true);
    }
  }, {
    key: "createAutoPanel",
    value: function createAutoPanel(panel, index, url) {
      return new SEMrushParametersDataPanel(panel, index, url, false);
    }
  }]);
}();
function noop() {}
SEMrushParametersPanels.STATE_NONE = 0;
SEMrushParametersPanels.STATE_CONNECT = 1;
SEMrushParametersPanels.STATE_DISABLED = 2;
SEMrushParametersPanels.STATE_MODE_AUTO = 3;
SEMrushParametersPanels.STATE_MODE_REQUEST = 4;
messengerMixin(SEMrushParametersPanels.prototype);
translateMixin(SEMrushParametersPanels.prototype);
eventsMixin(SEMrushParametersPanels.prototype);
module.exports = SEMrushParametersPanels;

},{"../../dom/main":33,"../../lib/ignore":63,"../../lib/isEmpty":66,"../../lib/parseUri":71,"../../semrush/SemrushApi":98,"../../utils/eventsMixin":148,"../../utils/messengerMixin":150,"../../utils/normalizeNumber":153,"../../utils/translateMixin":154,"./OnboardingSERPTrustScore":129,"./SEMrushParametersConnectPanel":130,"./SEMrushParametersDataPanel":131,"./SEMrushParametersDisabledPanel":132}],135:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var dom = require('../dom/main');
var translateMixin = require('../utils/translateMixin');
var messengerMixin = require('../utils/messengerMixin');
var SiteauditDropdown = function () {
  function SiteauditDropdown() {
    _classCallCheck(this, SiteauditDropdown);
    this._element = null;
    this._owner = null;
    this._visible = false;
    this._observer = null;
    this.processHide = this.handleHideClick.bind(this);
    this.processContentChange = this.handleContentChange.bind(this);
    this.processWindowResize = this.handleWindowResize.bind(this);
  }
  return _createClass(SiteauditDropdown, [{
    key: "eventLabel",
    get: function get() {
      return this._eventLabel;
    }
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "_positionElement",
    value: function _positionElement() {
      if (this._element === null || this._owner === null) {
        return;
      }
      var horizontalDetect = 40;
      var mozbar = document.body.querySelector('iframe[id^="mozbar-"]');
      var index = document.body.className.indexOf('mozbar-margin-');
      if (mozbar && index === -1 || index !== -1) {
        horizontalDetect = 83;
      }
      var horizontalPadding = 16;
      var verticalPadding = 10;
      var horizontalStep = 20;
      var verticalStep = 20;
      var _dom$getOffset = dom.getOffset(this._owner, true),
        linkTop = _dom$getOffset.top,
        linkLeft = _dom$getOffset.left;
      var linkWidth = this._owner.offsetWidth;
      var linkHeight = this._owner.offsetHeight;
      var bodyWidth = window.innerWidth;
      var bodyHeight = window.innerHeight;
      dom.css(this._element, 'visibility', 'hidden');
      var width = this._element.offsetWidth;
      var height = this._element.offsetHeight;
      var left = linkLeft;
      var top = linkTop;
      if (linkTop < horizontalDetect || linkTop > bodyHeight - horizontalDetect) {
        var right = bodyWidth - linkLeft - linkWidth - horizontalPadding;
        if (linkTop + linkHeight + verticalPadding + height > bodyHeight) {
          top = linkTop - height - verticalPadding;
        } else {
          top = linkTop + linkHeight + verticalPadding;
        }
        dom.css(this._element, {
          position: 'fixed',
          right: right + 'px',
          left: 'auto',
          top: top + 'px',
          visibility: 'visible'
        });
      } else {
        top = linkTop - verticalStep;
        if (top + height > bodyHeight) {
          top = bodyHeight - height - verticalPadding;
        }
        if (linkLeft + linkWidth + horizontalPadding + width > bodyWidth) {
          left = linkLeft - width - horizontalPadding;
        } else {
          left = linkLeft + linkWidth + horizontalPadding;
        }
        dom.css(this._element, {
          position: 'fixed',
          left: left + 'px',
          top: top + 'px',
          right: 'auto',
          visibility: 'visible'
        });
      }
    }
  }, {
    key: "_createElement",
    value: function _createElement() {
      this._element = dom('div', {
        className: 'seoquake-siteaudit-details',
        style: {
          visibility: 'hidden'
        }
      });
      this._owner.ownerDocument.body.appendChild(this._element);
    }
  }, {
    key: "show",
    value: function show(element) {
      if (this._visible) {
        this.hide();
      }
      this._owner = element;
      if (this._element === null) {
        this._createElement();
        this._observer = new MutationObserver(this.processContentChange);
      } else {
        dom.css(this._element, {
          visibility: 'hidden',
          display: 'block'
        });
      }
      this._positionElement();
      this._owner.ownerDocument.addEventListener('click', this.processHide, true);
      window.addEventListener('resize', this.processWindowResize, true);
      this._observer.observe(this._element, {
        childList: true,
        subtree: true
      });
      this._visible = true;
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._visible) {
        return;
      }
      if (this._element !== null) {
        dom.css(this._element, 'display', 'none');
      }
      if (this._observer !== null) {
        this._observer.disconnect();
      }
      this._owner.ownerDocument.removeEventListener('click', this.processHide, true);
      window.removeEventListener('resize', this.processWindowResize, true);
      this._visible = false;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.hide();
      if (this._element !== null) {
        dom.removeElement(this._element);
      }
      this._observer = null;
    }
  }, {
    key: "handleHideClick",
    value: function handleHideClick(e) {
      if (!this._visible) {
        return;
      }
      if (dom.isChild(this._element, e.target)) {
        return;
      }
      this.hide();
    }
  }, {
    key: "handleWindowResize",
    value: function handleWindowResize() {
      this._positionElement();
    }
  }, {
    key: "handleContentChange",
    value: function handleContentChange() {
      this._positionElement();
    }
  }]);
}();
SiteauditDropdown.prototype._eventLabel = '';
messengerMixin(SiteauditDropdown.prototype);
translateMixin(SiteauditDropdown.prototype);
module.exports = SiteauditDropdown;

},{"../dom/main":33,"../utils/messengerMixin":150,"../utils/translateMixin":154}],136:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../dom/main');
var SiteauditDropdown = require('./SiteauditDropdown');
var SiteauditDropdownConnect = function (_SiteauditDropdown) {
  function SiteauditDropdownConnect() {
    var _this;
    _classCallCheck(this, SiteauditDropdownConnect);
    _this = _callSuper(this, SiteauditDropdownConnect);
    _this.processConnectClick = _this.handleConnectClick.bind(_this);
    _this.processConfigureClick = _this.handleConfigureClick.bind(_this);
    return _this;
  }
  _inherits(SiteauditDropdownConnect, _SiteauditDropdown);
  return _createClass(SiteauditDropdownConnect, [{
    key: "_createElement",
    value: function _createElement() {
      this._element = dom('div', {
        className: 'seoquake-siteaudit-details'
      });
      dom.css(this._element, 'visibility', 'hidden');
      this._owner.ownerDocument.body.appendChild(this._element);
      var buttonConnect = dom('a', {
        className: 'seoquake-siteaudit-link',
        target: '_blank',
        href: '#'
      }, this.t('sqSemrush_siteaudit_connect_button'));
      buttonConnect.addEventListener('click', this.processConnectClick);
      this._element.appendChild(dom('div', {
        className: 'seoquake-siteaudit-container'
      }, [dom('p', {}, this.t('sqSemrush_siteaudit_connect_1')), dom('p', {}, this.t('sqSemrush_siteaudit_connect_2')), buttonConnect]));
      var optionsLink = dom('a', {
        href: '#'
      }, this.t('sqSemrush_siteaudit_connect_settings'));
      optionsLink.addEventListener('click', this.processConfigureClick);
      this._element.appendChild(dom('div', {
        className: 'seoquake-siteaudit-bottom seoquake-siteaudit-bottom-dashed'
      }, [dom('p', {}, this.t('sqSemrush_siteaudit_connect_dontwant')), optionsLink]));
    }
  }, {
    key: "handleConnectClick",
    value: function handleConnectClick(event) {
      event.preventDefault();
      this.sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      });
    }
  }, {
    key: "handleConfigureClick",
    value: function handleConfigureClick(event) {
      event.preventDefault();
      this.sendMessage('sq.openConfigurationWindow', {
        panel: 'seobar'
      });
    }
  }]);
}(SiteauditDropdown);
SiteauditDropdownConnect.prototype._eventLabel = 'no connect';
module.exports = SiteauditDropdownConnect;

},{"../dom/main":33,"./SiteauditDropdown":135}],137:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../dom/main');
var SiteauditDropdown = require('./SiteauditDropdown');
var SiteauditDropdownCreate = function (_SiteauditDropdown) {
  function SiteauditDropdownCreate() {
    _classCallCheck(this, SiteauditDropdownCreate);
    return _callSuper(this, SiteauditDropdownCreate, arguments);
  }
  _inherits(SiteauditDropdownCreate, _SiteauditDropdown);
  return _createClass(SiteauditDropdownCreate, [{
    key: "_createElement",
    value: function _createElement() {
      this._element = dom('div', {
        className: 'seoquake-siteaudit-details'
      });
      dom.css(this._element, 'visibility', 'hidden');
      this._owner.ownerDocument.body.appendChild(this._element);
      this._element.appendChild(dom('div', {
        className: 'seoquake-siteaudit-container'
      }, [dom('p', {}, this.t('sqSemrush_setup_siteaudit_message', {
        domain: document.location.host.toString()
      })), dom('a', {
        className: 'seoquake-siteaudit-link',
        target: '_blank',
        href: this._owner.href
      }, this.t('sqSemrush_setup_siteaudit_button'))]));
    }
  }]);
}(SiteauditDropdown);
SiteauditDropdownCreate.prototype._eventLabel = 'no project';
module.exports = SiteauditDropdownCreate;

},{"../dom/main":33,"./SiteauditDropdown":135}],138:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get.bind();
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    };
  }
  return _get.apply(this, arguments);
}
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../dom/main');
var SiteauditRules = require('./SiteauditRules');
var SiteauditDropdown = require('./SiteauditDropdown');
var SemrushFeedback = require('../semrush/SemrushFeedback');
var ScrollBlock = require('../effects/ScrollBlock');
var SiteauditDropdownDetails = function (_SiteauditDropdown) {
  function SiteauditDropdownDetails(result) {
    var _this;
    _classCallCheck(this, SiteauditDropdownDetails);
    _this = _callSuper(this, SiteauditDropdownDetails);
    _this._result = result;
    _this._scroll = null;
    _this._bottom = null;
    _this._maxHeight = 267;
    _this._detailsButton = null;
    _this.processFeedbackShow = _this.handleFeedbackShow.bind(_this);
    _this.processFeedbackHide = _this.handleFeedbackHide.bind(_this);
    _this.processFeedbackSend = _this.handleFeedbackSend.bind(_this);
    _this.processDetailsClick = _this.handleDetailsClick.bind(_this);
    return _this;
  }
  _inherits(SiteauditDropdownDetails, _SiteauditDropdown);
  return _createClass(SiteauditDropdownDetails, [{
    key: "statusHealthy",
    value: function statusHealthy() {
      dom.emptyElement(this._element);
      this._element.appendChild(dom('div', {
        className: 'seoquake-siteaudit-container'
      }, dom('p', {}, this.t('sqSemrush_siteaudit_details_noerrors'))));
    }
  }, {
    key: "statusIssuesList",
    value: function statusIssuesList() {
      dom.emptyElement(this._element);
      var list = dom('div', {
        className: 'seoquake-siteaudit-container'
      });
      var errors = [];
      errors.total = 0;
      var warnings = [];
      warnings.total = 0;
      for (var key in this._result.issues_sum) {
        if (this._result.issues_sum.hasOwnProperty(key)) {
          var text = SiteauditRules.getTitle(key);
          if (this._result.issues_sum[key] > 1) {
            text = SiteauditRules.getDescription(key, this._result.issues_sum[key]);
          }
          switch (SiteauditRules.getType(key)) {
            case SiteauditRules.ERROR:
              errors.push(text);
              errors.total += this._result.issues_sum[key];
              break;
            case SiteauditRules.WARNING:
              warnings.push(text);
              warnings.total += this._result.issues_sum[key];
              break;
          }
        }
      }
      if (errors.length > 0) {
        var block = dom('div', {
          className: 'seoquake-siteaudit-list seoquake-siteaudit-list-errors'
        });
        block.appendChild(dom('div', {
          className: 'seoquake-siteaudit-title'
        }, [dom('span', {}, this.t('sqSiteaudit_details_errors')), dom('span', {
          className: 'seoquake-siteaudit-badge'
        }, errors.total)]));
        errors.forEach(function (text) {
          return block.appendChild(dom('div', {
            className: 'seoquake-siteaudit-item'
          }, text));
        });
        list.appendChild(block);
      }
      if (warnings.length > 0) {
        var _block = dom('div', {
          className: 'seoquake-siteaudit-list seoquake-siteaudit-list-warnings'
        });
        _block.appendChild(dom('div', {
          className: 'seoquake-siteaudit-title'
        }, [dom('span', {}, this.t('sqSiteaudit_details_warnings')), dom('span', {
          className: 'seoquake-siteaudit-badge'
        }, warnings.total)]));
        warnings.forEach(function (text) {
          return _block.appendChild(dom('div', {
            className: 'seoquake-siteaudit-item'
          }, text));
        });
        list.appendChild(_block);
      }
      var feedback = new SemrushFeedback();
      feedback.setMessenger(this.getMessenger());
      feedback.init();
      feedback.addEventListener('show', this.processFeedbackShow);
      feedback.addEventListener('hide', this.processFeedbackHide);
      feedback.addEventListener('showMessage', this.processFeedbackHide);
      feedback.addEventListener('send', this.processFeedbackSend);
      this._element.appendChild(list);
      this._scroll = new ScrollBlock(list);
      this._detailsButton = dom('a', {
        className: 'seoquake-siteaudit-link',
        target: '_blank',
        href: this._owner.href
      }, this.t('sqSemrush_siteaudit_details_viewdetails'));
      this._detailsButton.addEventListener('click', this.processDetailsClick);
      this._bottom = dom('div', {
        className: 'seoquake-siteaudit-bottom seoquake-siteaudit-bottom-solid'
      }, [this._detailsButton, feedback.element]);
      this._element.appendChild(this._bottom);
      this._scroll.renderScrollBar();
      this._scroll.height = Math.min(this._maxHeight - this._bottom.offsetHeight, this._scroll.contentHeight);
    }
  }, {
    key: "_createElement",
    value: function _createElement() {
      this._element = dom('div', {
        className: 'seoquake-siteaudit-details'
      });
      dom.css(this._element, 'visibility', 'hidden');
      this._owner.ownerDocument.body.appendChild(this._element);
      var cssData = document.defaultView.getComputedStyle(this._element, null);
      this._maxHeight = parseInt(cssData.maxHeight, 10);
      if ('issues_sum' in this._result) {
        if (this._result.total === 0) {
          this.statusHealthy();
        } else {
          this.statusIssuesList();
        }
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._scroll !== null) {
        this._scroll.remove();
      }
      _get(_getPrototypeOf(SiteauditDropdownDetails.prototype), "remove", this).call(this);
    }
  }, {
    key: "handleFeedbackHide",
    value: function handleFeedbackHide() {
      if (this._scroll !== null) {
        this._scroll.height = Math.min(this._maxHeight - this._bottom.offsetHeight, this._scroll.contentHeight);
      }
    }
  }, {
    key: "handleFeedbackShow",
    value: function handleFeedbackShow() {
      if (this._scroll !== null) {
        this._scroll.height = Math.min(this._maxHeight - this._bottom.offsetHeight, this._scroll.contentHeight);
      }
      this.registerEvent('seobar2', 'SA Issues Feedback open');
    }
  }, {
    key: "handleDetailsClick",
    value: function handleDetailsClick() {
      this.registerEvent('seobar2', 'SA Issues Details click');
    }
  }, {
    key: "handleFeedbackSend",
    value: function handleFeedbackSend() {
      this.registerEvent('seobar2', 'SA Issues Feedback send');
    }
  }]);
}(SiteauditDropdown);
SiteauditDropdownDetails.prototype._eventLabel = 'issues shown';
module.exports = SiteauditDropdownDetails;

},{"../dom/main":33,"../effects/ScrollBlock":51,"../semrush/SemrushFeedback":99,"./SiteauditDropdown":135,"./SiteauditRules":140}],139:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var dom = require('../dom/main');
var SiteauditDropdown = require('./SiteauditDropdown');
var SiteauditDropdownNodata = function (_SiteauditDropdown) {
  function SiteauditDropdownNodata() {
    _classCallCheck(this, SiteauditDropdownNodata);
    return _callSuper(this, SiteauditDropdownNodata, arguments);
  }
  _inherits(SiteauditDropdownNodata, _SiteauditDropdown);
  return _createClass(SiteauditDropdownNodata, [{
    key: "_createElement",
    value: function _createElement() {
      this._element = dom('div', {
        className: 'seoquake-siteaudit-details'
      });
      dom.css(this._element, 'visibility', 'hidden');
      this._owner.ownerDocument.body.appendChild(this._element);
      this._element.appendChild(dom('div', {
        className: 'seoquake-siteaudit-container'
      }, [dom('p', {}, this.t('sqSemrush_siteaudit_details_notparsed_1')), dom('p', {}, this.t('sqSemrush_siteaudit_details_notparsed_2')), dom('a', {
        target: '_blank',
        href: this._owner.href
      }, this.t('sqSemrush_siteaudit_details_notparsed_link'))]));
    }
  }]);
}(SiteauditDropdown);
SiteauditDropdownNodata.prototype._eventLabel = 'no pageinfo';
module.exports = SiteauditDropdownNodata;

},{"../dom/main":33,"./SiteauditDropdown":135}],140:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var SiteauditRules = function () {
  function SiteauditRules() {
    _classCallCheck(this, SiteauditRules);
  }
  return _createClass(SiteauditRules, null, [{
    key: "getType",
    value: function getType(id) {
      if (SiteauditRules.RULES.hasOwnProperty(id)) {
        return SiteauditRules.RULES[id].type;
      }
      return SiteauditRules.NOTYPE;
    }
  }, {
    key: "getTitle",
    value: function getTitle(id) {
      if (SiteauditRules.RULES.hasOwnProperty(id)) {
        return SiteauditRules.RULES[id].title;
      }
      return '';
    }
  }, {
    key: "getDescription",
    value: function getDescription(id, value) {
      if (SiteauditRules.RULES.hasOwnProperty(id)) {
        return SiteauditRules.RULES[id].description.replace('##count##', value);
      }
      return '';
    }
  }]);
}();
SiteauditRules.NOTYPE = 0;
SiteauditRules.ERROR = 1;
SiteauditRules.WARNING = 2;
SiteauditRules.NOTICE = 3;
SiteauditRules.RULES = {
  1: {
    type: SiteauditRules.ERROR,
    title: 'HTTP 5XX server errors',
    description: '##count## pages returned 5XX status code upon request'
  },
  2: {
    type: SiteauditRules.ERROR,
    title: 'HTTP 4XX client errors',
    description: '##count## pages returned 4XX status code upon request'
  },
  3: {
    type: SiteauditRules.ERROR,
    title: 'Title tag is missing or empty',
    description: '##count## pages have no page title'
  },
  6: {
    type: SiteauditRules.ERROR,
    title: 'Duplicate title tag',
    description: '##count## pages don`t have a unique title'
  },
  7: {
    type: SiteauditRules.ERROR,
    title: 'Duplicate content',
    description: '##count## pages have duplicate content issues'
  },
  8: {
    type: SiteauditRules.ERROR,
    title: 'Internal broken links',
    description: '##count## internal links are broken'
  },
  9: {
    type: SiteauditRules.ERROR,
    title: 'We couldn`t crawl the page',
    description: '##count## page couldn`t be crawled'
  },
  10: {
    type: SiteauditRules.ERROR,
    title: 'We couldn`t resolve DNS to crawl your site',
    description: '##count## DNS couldn`t be resolved'
  },
  11: {
    type: SiteauditRules.ERROR,
    title: 'We couldn`t open the page`s URL ',
    description: 'We couldn`t open the page`s URL'
  },
  12: {
    type: SiteauditRules.ERROR,
    title: 'External broken links',
    description: '##count## external links are broken'
  },
  13: {
    type: SiteauditRules.ERROR,
    title: 'Internal images are broken',
    description: '##count## internal images are broken'
  },
  14: {
    type: SiteauditRules.ERROR,
    title: 'External images are broken',
    description: '##count## external images are broken'
  },
  15: {
    type: SiteauditRules.ERROR,
    title: 'Duplicate meta description',
    description: '##count## pages don`t have a unique meta description'
  },
  16: {
    type: SiteauditRules.ERROR,
    title: 'Malformed robots.txt',
    description: 'Malformed robots.txt'
  },
  17: {
    type: SiteauditRules.ERROR,
    title: 'Sitemap files have format errors',
    description: 'Sitemap files have format errors'
  },
  18: {
    type: SiteauditRules.ERROR,
    title: 'Wrong pages found in sitemap',
    description: 'Wrong pages found in sitemap'
  },
  19: {
    type: SiteauditRules.ERROR,
    title: 'WWW domain configured incorrectly',
    description: 'WWW domain configured incorrectly'
  },
  20: {
    type: SiteauditRules.ERROR,
    title: 'Pages have no viewport tag',
    description: 'Pages have no viewport tag'
  },
  21: {
    type: SiteauditRules.ERROR,
    title: 'Large HTML page size',
    description: '##count## pages have too large HTML size'
  },
  22: {
    type: SiteauditRules.ERROR,
    title: 'Missing canonical tags in AMP pages',
    description: '##count## pages have no canonical tags'
  },
  23: {
    type: SiteauditRules.ERROR,
    title: 'Hreflang implementation issue',
    description: '##count## hreflang implementation issues'
  },
  24: {
    type: SiteauditRules.ERROR,
    title: 'Hreflang conflicts on page',
    description: '##count## hreflang conflicts within page source code'
  },
  25: {
    type: SiteauditRules.ERROR,
    title: 'Bad hreflang link',
    description: '##count## bad hreflang links within page source code'
  },
  26: {
    type: SiteauditRules.ERROR,
    title: 'Non-secure pages',
    description: '##count## non-secure pages'
  },
  27: {
    type: SiteauditRules.ERROR,
    title: 'Expired certificate',
    description: 'Expired certificate'
  },
  28: {
    type: SiteauditRules.ERROR,
    title: 'Old security protocol version',
    description: 'Old security protocol version'
  },
  29: {
    type: SiteauditRules.ERROR,
    title: 'Certificate registered to incorrect name',
    description: 'Certificate registered to incorrect name'
  },
  30: {
    type: SiteauditRules.ERROR,
    title: 'Mixed content',
    description: '##count## pages contain links to HTTP pages'
  },
  31: {
    type: SiteauditRules.ERROR,
    title: 'Links to HTTP pages',
    description: '##count## links to HTTP pages'
  },
  32: {
    type: SiteauditRules.ERROR,
    title: 'Neither canonical URL nor 301 redirect from HTTP homepage to HTTPS version',
    description: 'Neither canonical URL nor 301 redirect from HTTP homepage to HTTPS version'
  },
  101: {
    type: SiteauditRules.WARNING,
    title: 'Title element is too short',
    description: '##count## pages have a too short title'
  },
  102: {
    type: SiteauditRules.WARNING,
    title: 'Title element is too long',
    description: '##count## pages have a too long title'
  },
  103: {
    type: SiteauditRules.WARNING,
    title: 'Missing h1 heading',
    description: '##count## pages have no H1 heading on them'
  },
  104: {
    type: SiteauditRules.WARNING,
    title: 'Multiple h1 tags',
    description: '##count## pages have more than one H1 heading'
  },
  105: {
    type: SiteauditRules.WARNING,
    title: 'H1 and title tags have duplicate content',
    description: '##count## pages have H1 content that duplicates page title content'
  },
  106: {
    type: SiteauditRules.WARNING,
    title: 'The meta description tag is missing',
    description: '##count## pages have no meta description tag'
  },
  108: {
    type: SiteauditRules.WARNING,
    title: 'Too many on-page links',
    description: '##count## pages have too many on-page links'
  },
  109: {
    type: SiteauditRules.WARNING,
    title: '302 redirect',
    description: '##count## pages redirect to another page with 302 status code (temporary redirect)'
  },
  110: {
    type: SiteauditRules.WARNING,
    title: 'Images without an ALT attribute',
    description: '##count## images have no ALT text'
  },
  111: {
    type: SiteauditRules.WARNING,
    title: 'Slow loading speed',
    description: '##count## pages are considered slow'
  },
  112: {
    type: SiteauditRules.WARNING,
    title: 'Text/HTML ratio',
    description: '##count## pages have a low text/HTML ratio'
  },
  113: {
    type: SiteauditRules.WARNING,
    title: 'Overly dynamic URLs',
    description: '##count## pages have an URL with more than two query parameters'
  },
  114: {
    type: SiteauditRules.WARNING,
    title: 'Language is not specified',
    description: '##count## pages are missing correct language declaration'
  },
  115: {
    type: SiteauditRules.WARNING,
    title: 'Encoding not declared',
    description: '##count## pages are missing character encoding declaration'
  },
  116: {
    type: SiteauditRules.WARNING,
    title: 'Doctype not declared',
    description: '##count## pages are missing correct doctype declaration'
  },
  117: {
    type: SiteauditRules.WARNING,
    title: 'Page has a low word count',
    description: '##count## pages have small amount of content (word count)'
  },
  120: {
    type: SiteauditRules.WARNING,
    title: 'Flash is used',
    description: '##count## pages have flash content'
  },
  121: {
    type: SiteauditRules.WARNING,
    title: 'Frame is detected',
    description: '##count## pages use frames'
  },
  122: {
    type: SiteauditRules.WARNING,
    title: 'Underscores in URLs',
    description: '##count## pages have underscore(s) in URL'
  },
  123: {
    type: SiteauditRules.WARNING,
    title: 'Internal links use a nofollow attribute',
    description: '##count## internal links have nofollow attribute'
  },
  124: {
    type: SiteauditRules.WARNING,
    title: 'Sitemap exist but not found in robots',
    description: 'Sitemap exist but not found in robots'
  },
  125: {
    type: SiteauditRules.WARNING,
    title: 'Sitemap file not found',
    description: 'Sitemap file not found'
  },
  126: {
    type: SiteauditRules.WARNING,
    title: 'Homepage does not use HTTPS encryption',
    description: 'Homepage does not use HTTPS encryption'
  },
  4: {
    type: SiteauditRules.NOTICE,
    title: 'SEMrush bot blocked',
    description: '##count## pages have been blocked from crawling'
  },
  201: {
    type: SiteauditRules.NOTICE,
    title: 'Long URL',
    description: '##count## pages have an URL too long'
  },
  202: {
    type: SiteauditRules.NOTICE,
    title: 'External links use a nofollow attribute',
    description: '##count## external links have nofollow attribute '
  },
  203: {
    type: SiteauditRules.NOTICE,
    title: 'No robots txt',
    description: 'No robots txt'
  },
  204: {
    type: SiteauditRules.NOTICE,
    title: 'Hreflang language mismatch issues',
    description: '##count## pages have hreflang language mismatch issues'
  },
  205: {
    type: SiteauditRules.NOTICE,
    title: 'No HSTS support',
    description: 'No HSTS support'
  }
};
module.exports = SiteauditRules;

},{}],141:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var sanitize = require('sanitize-filename');
var CreateFilenameSync = function () {
  function CreateFilenameSync(templateId, replace) {
    _classCallCheck(this, CreateFilenameSync);
    this._templateId = parseInt(templateId, 10);
    this._replace = replace || 'data';
  }
  return _createClass(CreateFilenameSync, [{
    key: "filenameTemplate",
    get: function get() {
      var result = '%REPLACE%.csv';
      switch (this._templateId) {
        case 1:
          result = '%REPLACE% - %DATE%.csv';
          break;
        case 2:
          result = '%REPLACE% - %DATE% - %TIME%.csv';
          break;
      }
      return result;
    }
  }, {
    key: "replace",
    get: function get() {
      return this._replace;
    },
    set: function set(value) {
      this._replace = value;
    }
  }, {
    key: "filename",
    get: function get() {
      var now = new Date();
      var replaces = {
        '%REPLACE%': sanitize(this._replace),
        '%DATE%': sanitize(now.toLocaleDateString(), {
          replacement: '_'
        }),
        '%TIME%': sanitize(now.toLocaleTimeString(), {
          replacement: '_'
        })
      };
      return this.filenameTemplate.replace(/(%REPLACE%|%DATE%|%TIME%)/g, function (match, p1) {
        return replaces[p1];
      });
    }
  }]);
}();
module.exports = CreateFilenameSync;

},{"sanitize-filename":169}],142:[function(require,module,exports){
'use strict';

exports.SEOQUAKE_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.SEOQUAKE_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
exports.isDate = function (value, format) {
  return exports.getDateFromFormat(value, format) !== 0;
};
exports.formatDate = function (date, format) {
  var day = addZero(date.getDate());
  var month = addZero(date.getMonth() + 1);
  var yearLong = addZero(date.getFullYear());
  var yearShort = addZero(date.getFullYear().toString().substring(3, 4));
  var year = format.indexOf("yyyy") > -1 ? yearLong : yearShort;
  var hour = addZero(date.getHours());
  var minute = addZero(date.getMinutes());
  var second = addZero(date.getSeconds());
  var dateString = format.replace(/dd/g, day).replace(/MM/g, month).replace(/y{1,4}/g, year);
  dateString = dateString.replace(/hh/g, hour).replace(/mm/g, minute).replace(/ss/g, second);
  return dateString;
};
function addZero(number) {
  return (number < 10 ? "0" : "") + number;
}
function isInteger(value) {
  return value.match(/^[\d]+$/);
}
function getInt(str, i, minlength, maxlength) {
  for (var x = maxlength; x >= minlength; x--) {
    var token = str.substring(i, i + x);
    if (token.length < minlength) {
      return null;
    }
    if (isInteger(token)) {
      return token;
    }
  }
  return null;
}
exports.getDateFromFormat = function (value, format) {
  var i_val = 0;
  var i_format = 0;
  var c = "";
  var token = "";
  var token2 = "";
  var x, y, i;
  var now = new Date();
  var year = now.getYear();
  var month = now.getMonth() + 1;
  var date = 1;
  var hh = now.getHours();
  var mm = now.getMinutes();
  var ss = now.getSeconds();
  var ampm = "";
  while (i_format < format.length) {
    c = format.charAt(i_format);
    token = "";
    while (format.charAt(i_format) === c && i_format < format.length) {
      token += format.charAt(i_format++);
    }
    if (token === "yyyy" || token === "yy" || token === "y") {
      if (token === "yyyy") {
        x = 4;
        y = 4;
      }
      if (token === "yy") {
        x = 2;
        y = 2;
      }
      if (token === "y") {
        x = 2;
        y = 4;
      }
      year = getInt(value, i_val, x, y);
      if (year === null) {
        return 0;
      }
      i_val += year.length;
      if (year.length === 2) {
        year = parseInt(year, 10) + (year > 70 ? 1900 : 2000);
      }
    } else if (token === "MMM" || token === "NNN") {
      month = 0;
      for (i = 0; i < exports.SEOQUAKE_MONTH_NAMES.length; i++) {
        var month_name = exports.SEOQUAKE_MONTH_NAMES[i];
        if (value.substring(i_val, i_val + month_name.length).toLowerCase() === month_name.toLowerCase()) {
          if (token === "MMM" || token === "NNN" && i > 11) {
            month = i + 1;
            if (month > 12) {
              month -= 12;
            }
            i_val += month_name.length;
            break;
          }
        }
      }
      if (month < 1 || month > 12) return 0;
    } else if (token === "EE" || token === "E") {
      for (i = 0; i < exports.SEOQUAKE_DAY_NAMES.length; i++) {
        var day_name = exports.SEOQUAKE_DAY_NAMES[i];
        if (value.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
          i_val += day_name.length;
          break;
        }
      }
    } else if (token === "MM" || token === "M") {
      month = getInt(value, i_val, token.length, 2);
      if (month === null || month < 1 || month > 12) {
        return 0;
      }
      i_val += month.length;
    } else if (token === "dd" || token === "d") {
      date = getInt(value, i_val, token.length, 2);
      if (date === null || date < 1 || date > 31) {
        return 0;
      }
      i_val += date.length;
    } else if (token === "hh" || token === "h") {
      hh = getInt(value, i_val, token.length, 2);
      if (hh === null || hh < 1 || hh > 12) {
        return 0;
      }
      i_val += hh.length;
    } else if (token === "HH" || token === "H") {
      hh = getInt(value, i_val, token.length, 2);
      if (hh === null || hh < 0 || hh > 23) {
        return 0;
      }
      i_val += hh.length;
    } else if (token === "KK" || token === "K") {
      hh = getInt(value, i_val, token.length, 2);
      if (hh === null || hh < 0 || hh > 11) {
        return 0;
      }
      i_val += hh.length;
    } else if (token === "kk" || token === "k") {
      hh = getInt(value, i_val, token.length, 2);
      if (hh === null || hh < 1 || hh > 24) {
        return 0;
      }
      i_val += hh.length;
      hh--;
    } else if (token === "mm" || token === "m") {
      mm = getInt(value, i_val, token.length, 2);
      if (mm === null || mm < 0 || mm > 59) {
        return 0;
      }
      i_val += mm.length;
    } else if (token === "ss" || token === "s") {
      ss = getInt(value, i_val, token.length, 2);
      if (ss === null || ss < 0 || ss > 59) {
        return 0;
      }
      i_val += ss.length;
    } else if (token === "a") {
      if (value.substring(i_val, i_val + 2).toLowerCase() === "am") {
        ampm = "AM";
      } else if (value.substring(i_val, i_val + 2).toLowerCase() === "pm") {
        ampm = "PM";
      } else {
        return 0;
      }
      i_val += 2;
    } else {
      if (value.substring(i_val, i_val + token.length) !== token) {
        return 0;
      } else {
        i_val += token.length;
      }
    }
  }
  if (i_val !== value.length) {
    return 0;
  }
  if (month === 2) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      if (date > 29) {
        return 0;
      }
    } else {
      if (date > 28) {
        return 0;
      }
    }
  }
  if ((month === 4 || month === 6 || month === 9 || month === 11) && date > 30) {
    return 0;
  }
  if (hh < 12 && ampm === "PM") {
    hh += 12;
  } else if (hh > 11 && ampm === "AM") {
    hh -= 12;
  }
  var newdate = new Date(year, month - 1, date, hh, mm, ss);
  return newdate.getTime();
};
exports.parseDate = function (value) {
  var preferEuro = arguments.length === 2 ? arguments[1] : false;
  var generalFormats = new Array("y-M-d", "MMM d, y", "MMM d,y", "y-MMM-d", "d-MMM-y", "MMM d", "d MMM y");
  var monthFirst = new Array("M/d/y", "M-d-y", "M.d.y", "MMM-d", "M/d", "M-d");
  var dateFirst = new Array("d/M/y", "d-M-y", "d.M.y", "d-MMM", "d/M", "d-M");
  var checkList = new Array(generalFormats, preferEuro ? dateFirst : monthFirst, preferEuro ? monthFirst : dateFirst);
  var d = null;
  for (var i = 0; i < checkList.length; i++) {
    var l = checkList[i];
    for (var j = 0; j < l.length; j++) {
      d = exports.getDateFromFormat(value, l[j]);
      if (d !== 0) {
        return d;
      }
    }
  }
  return null;
};

},{}],143:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var shortHash = require('../lib/shortHash');
var RenderObject = function () {
  function RenderObject(url) {
    _classCallCheck(this, RenderObject);
    this.values = {};
    this.requestUrlHash = '';
    this.params = [];
    this.urlRequest = url;
  }
  return _createClass(RenderObject, [{
    key: "urlRequest",
    get: function get() {
      return this['url-r'];
    },
    set: function set(value) {
      value = value || '';
      value = value.toString();
      this['url-r'] = value;
      this.requestUrlHash = shortHash(value);
    }
  }, {
    key: "addParam",
    value: function addParam(value) {
      value = value.toString();
      if (this.params.indexOf(value) === -1) {
        this.params.push(value);
      }
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      this.values[key] = value;
    }
  }]);
}();
exports.RenderObject = RenderObject;

},{"../lib/shortHash":72}],144:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var isEmpty = require('../lib/isEmpty');
var isString = require('../lib/isString');
var extend = require('extend');
var XHRProxyResult = require('./XHRProxyResult');
var isFunction = require('../lib/isFunction');
var uri = require('../lib/parseUri');
var args = require('../lib/parseArgs');
var XHRProxy = function () {
  function XHRProxy(client) {
    _classCallCheck(this, XHRProxy);
    if (client === undefined) {
      throw new Error('Client should be provided');
    }
    this._client = client;
    this._localTimeout = null;
    this._requestCanceled = null;
    this._callback = XHRProxy.nop;
    this._timeoutCallback = XHRProxy.nop;
    this._timeout = 30000;
    this._headers = [];
  }
  return _createClass(XHRProxy, [{
    key: "callback",
    get: function get() {
      return this._callback;
    },
    set: function set(value) {
      if (value === null) {
        this._callback = XHRProxy.nop;
      } else if (isFunction(value)) {
        this._callback = value;
      } else {
        throw new Error('Value should be null or function');
      }
    }
  }, {
    key: "timeoutCallback",
    get: function get() {
      return this._timeoutCallback;
    },
    set: function set(value) {
      if (value === null) {
        this._timeoutCallback = XHRProxy.nop;
      } else if (isFunction(value)) {
        this._timeoutCallback = value;
      } else {
        throw new Error('Value should be null or function');
      }
    }
  }, {
    key: "timeout",
    get: function get() {
      return this._timeout;
    },
    set: function set(value) {
      this._timeout = value;
    }
  }, {
    key: "localTimeout",
    get: function get() {
      return this._localTimeout;
    }
  }, {
    key: "requestCanceled",
    get: function get() {
      return this._requestCanceled;
    }
  }, {
    key: "setCallback",
    value: function setCallback(value) {
      this.callback = value;
      return this;
    }
  }, {
    key: "setTimeoutCallback",
    value: function setTimeoutCallback(value) {
      this.timeoutCallback = value;
      return this;
    }
  }, {
    key: "setTimeout",
    value: function setTimeout(value) {
      this.timeout = value;
      return this;
    }
  }, {
    key: "_processAnswer",
    value: function _processAnswer(result) {
      if (this._localTimeout !== null) {
        clearTimeout(this._localTimeout);
        this._localTimeout = null;
      }
      if (!this._requestCanceled) {
        result = new XHRProxyResult(result);
        this.callback(result);
      }
    }
  }, {
    key: "_processTimeout",
    value: function _processTimeout() {
      this._requestCanceled = true;
      this.timeoutCallback();
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._headers.push([header, value]);
    }
  }, {
    key: "setRequestHeader",
    value: function setRequestHeader(header, value) {
      this.setHeader(header, value);
    }
  }, {
    key: "send",
    value: function send(url, type, requestData) {
      var _this = this;
      type = type || 'get';
      requestData = requestData || null;
      if (requestData !== null && isString(requestData)) {
        requestData = args.parseArgs(requestData);
      }
      var urlObject = uri.parseUri(url);
      if (type === 'get' && requestData !== null) {
        var queryData = new Map();
        if (!isEmpty(urlObject, 'query')) {
          queryData = args.parseArgs(urlObject.query);
        }
        requestData.forEach(function (value, key) {
          return queryData.set(key, value);
        });
        urlObject.query = args.createArgs(queryData);
      }
      url = uri.createUri(urlObject);
      var data = {
        url: url,
        type: type
      };
      if (this._headers.length > 0) {
        data.headers = this._headers;
      }
      if (type === 'post' && requestData !== null) {
        data.data = args.createArgs(requestData);
      }
      this._client.sendMessage('sq.requestUrl', data, function (result) {
        return _this._processAnswer(result);
      });
      if (this._timeout !== null) {
        this._localTimeout = setTimeout(function () {
          return _this._processTimeout();
        }, this._timeout);
      }
    }
  }], [{
    key: "nop",
    value: function nop() {}
  }]);
}();
module.exports = XHRProxy;

},{"../lib/isEmpty":66,"../lib/isFunction":67,"../lib/isString":69,"../lib/parseArgs":70,"../lib/parseUri":71,"./XHRProxyResult":146,"extend":164}],145:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
var isEmpty = require('../lib/isEmpty');
var isString = require('../lib/isString');
var uri = require('../lib/parseUri');
var XHRProxy = require('./XHRProxy');
var messengerMixin = require('./messengerMixin');
var args = require('../lib/parseArgs');
var XHRProxyEx = function (_XHRProxy) {
  function XHRProxyEx() {
    _classCallCheck(this, XHRProxyEx);
    return _callSuper(this, XHRProxyEx, [null]);
  }
  _inherits(XHRProxyEx, _XHRProxy);
  return _createClass(XHRProxyEx, [{
    key: "send",
    value: function send(url, type, requestData) {
      var _this = this;
      type = type || 'get';
      requestData = requestData || null;
      if (requestData !== null && isString(requestData)) {
        requestData = args.parseArgs(requestData);
      }
      var urlObject = uri.parseUri(url);
      if (type === 'get' && requestData !== null) {
        var queryData = new Map();
        if (!isEmpty(urlObject, 'query')) {
          queryData = args.parseArgs(urlObject.query);
        }
        requestData.forEach(function (value, key) {
          return queryData.set(key, value);
        });
        urlObject.query = args.createArgs(queryData);
      }
      url = uri.createUri(urlObject);
      var data = {
        url: url,
        type: type
      };
      if (this._headers.length > 0) {
        data.headers = this._headers;
      }
      if (type === 'post' && requestData !== null) {
        data.data = args.createArgs(requestData);
      }
      this.sendMessage('sq.requestUrl', data).then(function (result) {
        return _this._processAnswer(result);
      });
      if (this._timeout !== null) {
        this._localTimeout = setTimeout(function () {
          return _this._processTimeout();
        }, this._timeout);
      }
    }
  }]);
}(XHRProxy);
messengerMixin(XHRProxyEx.prototype);
module.exports = XHRProxyEx;

},{"../lib/isEmpty":66,"../lib/isString":69,"../lib/parseArgs":70,"../lib/parseUri":71,"./XHRProxy":144,"./messengerMixin":150}],146:[function(require,module,exports){
'use strict';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var extend = require('extend');
var XHRProxyResult = function () {
  function XHRProxyResult(result) {
    _classCallCheck(this, XHRProxyResult);
    this.headers = '';
    extend(true, this, result);
  }
  return _createClass(XHRProxyResult, [{
    key: "getAllResponseHeaders",
    value: function getAllResponseHeaders() {
      return this.headers;
    }
  }, {
    key: "getResponseHeader",
    value: function getResponseHeader(header) {
      var list = this.headers.split('\n');
      header = header.toLowerCase();
      var _iterator = _createForOfIteratorHelper(list),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var line = _step.value;
          if (line.toLowerCase().startsWith(header)) {
            return line.substr(line.indexOf(':') + 2);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return undefined;
    }
  }]);
}();
module.exports = XHRProxyResult;

},{"extend":164}],147:[function(require,module,exports){
'use strict';

var Entities = require('html-entities').AllHtmlEntities;
var entities = null;
module.exports = function () {
  if (entities === null) {
    entities = new Entities();
  }
  return entities;
};

},{"html-entities":165}],148:[function(require,module,exports){
'use strict';

var isString = require('../lib/isString');
var isFunction = require('../lib/isFunction');
var EventsMixin = {
  _initHandlers: function _initHandlers() {
    if (!this.hasOwnProperty('_eventHandlers')) {
      this._eventHandlers = new Map();
    }
    if (!this.hasOwnProperty('_eventPromises')) {
      this._eventPromises = new Map();
    }
  },
  addEventListener: function addEventListener(event, callback, once) {
    if (!isString(event)) {
      throw new Error('Argument event should be string');
    }
    if (!isFunction(callback)) {
      throw new Error('Argument callback should be function');
    }
    this._initHandlers();
    if (!this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, []);
    }
    if (once) {
      callback._eventCalledOnce = true;
    }
    this._eventHandlers.get(event).push(callback);
    if (this._eventPromises.has(event)) {
      this._eventPromises.get(event).forEach(function (value) {
        return callback(value);
      });
      this._eventPromises["delete"](event);
    }
  },
  removeEventListener: function removeEventListener(event, callback) {
    if (!isString(event)) {
      throw new Error('Argument event should be string');
    }
    if (!isFunction(callback)) {
      throw new Error('Argument callback should be function');
    }
    this._initHandlers();
    if (!this._eventHandlers.has(event)) {
      return;
    }
    var i = this._eventHandlers.get(event).indexOf(callback);
    if (i === -1) {
      return;
    }
    this._eventHandlers.get(event).splice(i, 1);
  },
  hasEventListener: function hasEventListener(event) {
    if (!isString(event)) {
      throw new Error('Argument event should be string');
    }
    this._initHandlers();
    return this._eventHandlers.has(event) && this._eventHandlers.get(event).length > 0;
  },
  dispatchEvent: function dispatchEvent(event, data, promise) {
    if (!isString(event)) {
      throw new Error('Argument event should be string');
    }
    this._initHandlers();
    promise = promise || false;
    data = data === undefined ? null : data;
    if (!this._eventHandlers.has(event)) {
      if (promise) {
        if (!this._eventPromises.has(event)) {
          this._eventPromises.set(event, []);
        }
        this._eventPromises.get(event).push(data);
      }
      return;
    }
    this._eventHandlers.get(event).forEach(function (callback) {
      return callback(data);
    });
    if (this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, this._eventHandlers.get(event).filter(function (callback) {
        return !callback.hasOwnProperty('_eventCalledOnce');
      }));
    }
  },
  clearEvents: function clearEvents() {
    this._initHandlers();
    this._eventHandlers.clear();
    this._eventPromises.clear();
  }
};
module.exports = function eventsMixin(obj) {
  for (var method in EventsMixin) {
    if (EventsMixin.hasOwnProperty(method)) {
      obj[method] = EventsMixin[method];
    }
  }
};

},{"../lib/isFunction":67,"../lib/isString":69}],149:[function(require,module,exports){
'use strict';

var isEmpty = require('../lib/isEmpty');
module.exports = function messengerBaseMixin(object) {
  if (typeof object.sendMessage !== 'function') {
    object.sendMessage = function (message, data) {
      return this._sendMessage(message, data);
    };
  }
  if (typeof object._sendMessage !== 'function') {
    object._sendMessage = function (message, data) {
      var _this = this;
      if (!this._messenger) {
        return Promise.reject('No messenger provided');
      }
      return new Promise(function (resolve) {
        return _this._messenger.sendMessage(message, data, function (result) {
          return resolve(result);
        });
      });
    };
  }
  if (typeof object.setMessenger !== 'function') {
    object.setMessenger = function (messenger) {
      if (isEmpty(messenger)) {
        this._messenger = null;
        return;
      }
      this._messenger = messenger;
    };
  }
  if (typeof object.addMessageListener !== 'function') {
    object.addMessageListener = function (action, callback) {
      if (!this._messenger) {
        throw new Error('No messenger provided');
      }
      this._messenger.addMessageListener(action, callback);
    };
  }
  if (typeof object.removeMessageListener !== 'function') {
    object.removeMessageListener = function (action, callback) {
      if (!this._messenger) {
        throw new Error('No messenger provided');
      }
      this._messenger.removeMessageListener(action, callback);
    };
  }
  if (typeof object.getMessenger !== 'function') {
    object.getMessenger = function () {
      if (!this._messenger) {
        throw new Error('No messenger provided');
      }
      return this._messenger;
    };
  }
};

},{"../lib/isEmpty":66}],150:[function(require,module,exports){
'use strict';

var messengerBaseMixin = require('./messengerBaseMixin');
module.exports = function messengerMixin(object) {
  messengerBaseMixin(object);
  object.getConfiguration = function () {
    return this.sendMessage('sq.getConfiguration', null);
  };
  object.getAssetsUrl = function () {
    var _this = this;
    if (!this._messenger) {
      return Promise.reject('No messenger provided');
    }
    return new Promise(function (resolve) {
      return _this._messenger.getAssetsUrl(resolve);
    });
  };
  object.setConfiguration = function (configuration) {
    return this._sendMessage('sq.setConfiguration', configuration);
  };
  object.setConfigurationItem = function (name, value) {
    return this._sendMessage('sq.setConfigurationItem', {
      name: name,
      value: value
    });
  };
  object.getConfigurationItem = function (name) {
    return this._sendMessage('sq.getConfigurationItem', name);
  };
  object.updateConfiguration = function () {
    return this._sendMessage('sq.updateConfiguration');
  };
  object.getCoreState = function () {
    return this.sendMessage('sq.getCoreState', null);
  };
  object.getConfigurationBrunch = function () {
    return this.sendMessage('sq.getConfigurationBranch', null);
  };
  object.getPluginParameters = function () {
    return this.sendMessage('sq.getPluginParameters', null);
  };
  object.getParameters = function () {
    return this.sendMessage('sq.getParameters', null);
  };
  object.setParameters = function (value) {
    return this._sendMessage('sq.setParameters', value);
  };
  object.setDisabledState = function (plugin, value) {
    var _this2 = this;
    if (!this._messenger) {
      return Promise.reject('No messenger provided');
    }
    return new Promise(function (resolve) {
      return _this2._messenger.setDisabledState(plugin, value, resolve);
    });
  };
  object.registerEvent = function (category, action, label) {
    if (!this._messenger) {
      throw new Error('No messenger provided');
    }
    return this._messenger.registerEvent(category, action, label);
  };
  object.registerPage = function (page) {
    if (!this._messenger) {
      throw new Error('No messenger provided');
    }
    return this._messenger.registerPage(page);
  };
};

},{"./messengerBaseMixin":149}],151:[function(require,module,exports){
'use strict';

var messengerMixin = require('./messengerMixin');
var getUUID = require('../lib/getUUID');
module.exports = function messengerModuleMixin(object) {
  messengerMixin(object);
  object.sendMessage = function (message, data) {
    var _this = this;
    return new Promise(function (resolve) {
      if (!_this._messenger) {
        throw new Error('No messenger provided');
      }
      data = {
        payload: data,
        plugin: _this.name,
        sender: _this.getUUID()
      };
      _this._messenger.sendMessage(message, data, resolve);
    });
  };
  if (typeof object.getUUID !== 'function') {
    object.getUUID = function () {
      if (typeof this._uuid === 'undefined' || this._uuid === null) {
        this._uuid = getUUID();
      }
      return this._uuid;
    };
  }
};

},{"../lib/getUUID":62,"./messengerMixin":150}],152:[function(require,module,exports){
'use strict';

var messengerBaseMixin = require('./messengerBaseMixin');
module.exports = function messengerTranslateMixin(object) {
  messengerBaseMixin(object);
  if (typeof object.t !== 'function') {
    object.t = function (message) {
      var _this = this;
      if (!this._messenger) {
        throw new Error('No messenger provided');
      }
      if (!this._messenger.hasOwnProperty('t')) {
        throw new Error('Messenger without translate');
      }
      return new Promise(function (resolve, reject) {
        try {
          _this._messenger.t(message, resolve);
        } catch (reason) {
          reject(reason);
        }
      });
    };
  }
};

},{"./messengerBaseMixin":149}],153:[function(require,module,exports){
'use strict';

function normalizeNumber(value) {
  var input = String(value);
  var trimRegExp = new RegExp('^[' + normalizeNumber.SPACE_STRING + ']+|[' + normalizeNumber.SPACE_STRING + ']+$', 'ig');
  var normalized = input.replace(trimRegExp, '');
  var numberRegExp = new RegExp('[.,' + normalizeNumber.SPACE_STRING + ']', 'ig');
  var numberSource = normalized.replace(numberRegExp, '');
  var number = Number(numberSource);
  var shortValue = value;
  if (!isNaN(number) && String(number) === numberSource) {
    var num = number;
    shortValue = String(number);
    for (var i = normalizeNumber.NUMBER_SIZES.length - 1; i >= 0; i--) {
      var decimal = normalizeNumber.NUMBER_SIZES[i][1];
      var unit = normalizeNumber.NUMBER_SIZES[i][0];
      if (num <= -decimal || num >= decimal) {
        var digits = Math.max(0, normalizeNumber.DEFAULT_LENGTH - String(Math.round(num / decimal)).length);
        shortValue = Number(num / decimal).toLocaleString(undefined, {
          useGrouping: true,
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        }) + unit;
        break;
      }
    }
  } else {
    number = null;
  }
  return {
    value: normalized,
    number: number,
    shortValue: shortValue
  };
}
normalizeNumber.SPACE_STRING = " \xA0\u1680\u180E\u2000-\u200B\u202F\u205F\uFEFF";
normalizeNumber.DEFAULT_LENGTH = 3;
normalizeNumber.NUMBER_SIZES = [['K', 1000], ['M', 1000000], ['B', 1000000000], ['T', 1000000000000], ['P', 1000000000000000]];
module.exports = normalizeNumber;

},{}],154:[function(require,module,exports){
'use strict';

var ignore = require('../lib/ignore');
function replaceTextPlaceholders(text, data) {
  if (data === undefined) {
    return text;
  }
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var regexp = new RegExp('{' + key + '}', 'g');
      text = text.replace(regexp, data[key]);
    }
  }
  return text;
}
module.exports = function translateMixin(object) {
  object.t = function (message, data) {
    var _this = this;
    this.__tmInitTranslateCache();
    if (this.__tmTranslateCache.has(message)) {
      return Promise.resolve(replaceTextPlaceholders(this.__tmTranslateCache.get(message), data));
    }
    return this.getTranslateFunction()(message).then(function (text) {
      _this.__tmTranslateCache.set(message, text);
      return replaceTextPlaceholders(text, data);
    })["catch"](ignore);
  };
  object.setTranslateFunction = function (handler) {
    this.__tmTranslateFunction = handler;
  };
  object.getTranslateFunction = function () {
    if (!this.hasOwnProperty('__tmTranslateFunction')) {
      this.__tmTranslateFunction = defaultTranslation;
    }
    return this.__tmTranslateFunction;
  };
  object.__tmInitTranslateCache = function () {
    if (!this.hasOwnProperty('__tmTranslateCache')) {
      this.__tmTranslateCache = new Map();
    }
  };
};
function defaultTranslation(message) {
  return Promise.resolve(message);
}

},{"../lib/ignore":63}],155:[function(require,module,exports){
var toCamelCase = require('to-camel-case');

/**
 * Gets/Sets a DOM element property.
 *
 * @param  Object        element A DOM element.
 * @param  String|Object name    The name of a property or an object of values to set.
 * @param  String        value   The value of the property to set, or none to get the current
 *                               property value.
 * @return String                The current/new property value.
 */
function css(element, name, value) {
  if (typeof name === 'object') {
    var style = name;
    for (name in style) {
      css(element, name, style[name]);
    }
    return style;
  }
  var attribute = toCamelCase((name === 'float') ? 'cssFloat' : name);
  if (arguments.length === 3) {
    element.style[name] = value || "";
    return value;
  }
  return element.style[name];
}

module.exports = css;

},{"to-camel-case":156}],156:[function(require,module,exports){

var toSpace = require('to-space-case');


/**
 * Expose `toCamelCase`.
 */

module.exports = toCamelCase;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toCamelCase (string) {
  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase();
  });
}
},{"to-space-case":158}],157:[function(require,module,exports){

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
},{}],158:[function(require,module,exports){

var clean = require('to-no-case');


/**
 * Expose `toSpaceCase`.
 */

module.exports = toSpaceCase;


/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */


function toSpaceCase (string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : '';
  });
}
},{"to-no-case":157}],159:[function(require,module,exports){
/**
 * DOM element value Getter/Setter.
 */

/**
 * Gets/sets DOM element value.
 *
 * @param  Object element A DOM element
 * @param  Object val     The value to set or none to get the current value.
 * @return mixed          The new/current DOM element value.
 */
function value(element, val) {
  if (arguments.length === 1) {
    return get(element);
  }
  return set(element, val);
}

/**
 * Returns the type of a DOM element.
 *
 * @param  Object element A DOM element.
 * @return String         The DOM element type.
 */
value.type = function(element) {
  var name = element.nodeName.toLowerCase();
  if (name !== "input") {
    if (name === "select" && element.multiple) {
      return "select-multiple";
    }
    return name;
  }
  var type = element.getAttribute('type');
  if (!type) {
    return "text";
  }
  return type.toLowerCase();
}

/**
 * Gets DOM element value.
 *
 * @param  Object element A DOM element
 * @return mixed          The DOM element value
 */
function get(element) {
  var name = value.type(element);
  switch (name) {
    case "checkbox":
    case "radio":
      if (!element.checked) {
        return false;
      }
      var val = element.getAttribute('value');
      return val == null ? true : val;
    case "select":
    case "select-multiple":
      var options = element.options;
      var values = [];
      for (var i = 0, len = options.length; i < len; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      return name === "select-multiple" ? values : values[0];
    default:
      return element.value;
  }
}

/**
 * Sets a DOM element value.
 *
 * @param  Object element A DOM element
 * @param  Object val     The value to set.
 * @return mixed          The new DOM element value.
 */
function set(element, val) {
  var name = value.type(element);
  switch (name) {
    case "checkbox":
    case "radio":
      return element.checked = val ? true : false;
    case "select":
    case "select-multiple":
      var found;
      var options = element.options;
      var values = Array.isArray(val) ? val : [val];
      for (var i = 0, leni = options.length; i < leni; i++) {
        found = 0;
        for (var j = 0, lenj = values.length; j < lenj; j++) {
          found |= values[j] === options[i].value;
        }
        options[i].selected = (found === 1);
      }
      if (name === "select") {
        return val;
      }
      return Array.isArray(val) ? val: [val];
    default:
      return element.value = val;
  }
}

module.exports = value;

},{}],160:[function(require,module,exports){
var domElementValue = require('dom-element-value');
var domElementCss = require('dom-element-css');
var toCamelCase = require('to-camel-case');

/**
 * DOM element manipulation functions.
 */

/**
 * Gets/Sets a DOM element attribute (accept dashed attribute).
 *
 * @param  Object element A DOM element.
 * @param  String name    The name of an attribute.
 * @param  String value   The value of the attribute to set, `undefined` to remove it or none
 *                        to get the current attribute value.
 * @return String         The current/new attribute value or `undefined` when removed.
 */
function attr(element, name, value) {
  name = toCamelCase(name === 'for' ? 'htmlFor' : name);
  if (arguments.length === 2) {
    return element.getAttribute(name);
  }
  if (value == null) {
    return element.removeAttribute(name);
  }
  element.setAttribute(name, value);
  return value;
}

/**
 * Gets/Sets a DOM element attribute with a specified namespace (accept dashed attribute).
 *
 * @param  Object element A DOM element.
 * @param  String name    The name of an attribute.
 * @param  String value   The value of the attribute to set, `undefined` to remove it or none
 *                        to get the current attribute value.
 * @return String         The current/new attribute value or `undefined` when removed.
 */
function attrNS(element, ns, name, value) {
  name = toCamelCase(name);
  if (arguments.length === 3) {
    return element.getAttributeNS(ns, name);
  }
  if (value == null) {
    return element.removeAttributeNS(ns, name);
  }
  element.setAttributeNS(ns, name, value);
  return value;
}

/**
 * Gets/Sets a DOM element property.
 *
 * @param  Object element A DOM element.
 * @param  String name    The name of a property.
 * @param  String value   The value of the property to set, or none to get the current
 *                        property value.
 * @return String         The current/new property value.
 */
function prop(element, name, value){
  if (arguments.length === 2) {
    return element[name];
  }
  return element[name] = value;
}

/**
 * Gets/Sets a DOM element attribute.
 *
 * @param  Object element A DOM element.
 * @param  String name    The name of an attribute.
 * @param  String value   The value of the attribute to set, `null` to remove it or none
 *                        to get the current attribute value.
 * @return String         The current/new attribute value or `undefined` when removed.
 */
function data(element, name, value) {
  if (arguments.length === 3) {
    return attr(element, "data-" + name, value);
  }
  return attr(element, "data-" + name);
}

/**
 * Gets/Sets a DOM element text content.
 *
 * @param  Object element A DOM element.
 * @param  String value   The text value to set or none to get the current text content value.
 * @return String         The current/new text content.
 */
function text(element, value) {
  var text = (element.textContent !== undefined ? 'textContent' : 'innerText')

  if (arguments.length === 1) {
    return element[text];
  }
  return element[text] = value
}

/**
 * Checks if an element has a class.
 *
 * @param  Object  element A DOM element.
 * @param  String  name    A class name.
 * @return Boolean         Returns `true` if the element has the `name` class, `false` otherwise.
 */
function hasClass(element, name) {
  return element.classList.contains(name);
}

/**
 * Adds a class to an element.
 *
 * @param  Object  element A DOM element.
 * @param  String  name    The class to add.
 */
function addClass(element, name) {
  element.classList.add(name);
}

/**
 * Removes a class from an element.
 *
 * @param  Object  element A DOM element.
 * @param  String  name    The class to remove.
 */
function removeClass(element, name) {
  element.classList.remove(name);
}

/**
 * Toggles a class.
 *
 * @param  Object  element A DOM element.
 * @param  String  name    The class to toggle.
 */
function toggleClass(element, name) {
  var fn = hasClass(element, name) ? removeClass : addClass;
  fn(element, name);
}

module.exports = {
  attr: attr,
  attrNS: attrNS,
  prop: prop,
  css: domElementCss,
  type: domElementValue.type,
  data: data,
  text: text,
  value: domElementValue,
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass
};

},{"dom-element-css":155,"dom-element-value":159,"to-camel-case":161}],161:[function(require,module,exports){
arguments[4][156][0].apply(exports,arguments)
},{"dup":156,"to-space-case":163}],162:[function(require,module,exports){
arguments[4][157][0].apply(exports,arguments)
},{"dup":157}],163:[function(require,module,exports){
arguments[4][158][0].apply(exports,arguments)
},{"dup":158,"to-no-case":162}],164:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],165:[function(require,module,exports){
module.exports = {
  XmlEntities: require('./lib/xml-entities.js'),
  Html4Entities: require('./lib/html4-entities.js'),
  Html5Entities: require('./lib/html5-entities.js'),
  AllHtmlEntities: require('./lib/html5-entities.js')
};

},{"./lib/html4-entities.js":166,"./lib/html5-entities.js":167,"./lib/xml-entities.js":168}],166:[function(require,module,exports){
var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'Oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'oelig', 'oelig', 'scaron', 'scaron', 'yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;

},{}],167:[function(require,module,exports){
var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['CloseCurlyDoubleQuote', [8221]], ['CloseCurlyQuote', [8217]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;

},{}],168:[function(require,module,exports){
var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (str.length === 0) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    var strLength = str.length;
    if (strLength === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    var strLenght = str.length;
    if (strLenght === 0) {
        return '';
    }
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;

},{}],169:[function(require,module,exports){
/*jshint node:true*/
'use strict';

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 *
 * Illegal Characters on Various Operating Systems
 * / ? < > \ : * | "
 * https://kb.acronis.com/content/39790
 *
 * Unicode Control codes
 * C0 0x00-0x1f & C1 (0x80-0x9f)
 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 *
 * Reserved filenames on Unix-based systems (".", "..")
 * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
 * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
 * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
 * "LPT9") case-insesitively and with or without filename extensions.
 *
 * Capped at 255 characters in length.
 * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
 *
 * @param  {String} input   Original filename
 * @param  {Object} options {replacement: String}
 * @return {String}         Sanitized filename
 */

var truncate = require("truncate-utf8-bytes");

var illegalRe = /[\/\?<>\\:\*\|":]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;

function sanitize(input, replacement) {
  var sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return truncate(sanitized, 255);
}

module.exports = function (input, options) {
  var replacement = (options && options.replacement) || '';
  var output = sanitize(input, replacement);
  if (replacement === '') {
    return output;
  }
  return sanitize(output, '');
};

},{"truncate-utf8-bytes":173}],170:[function(require,module,exports){

var space = require('to-space-case')

/**
 * Export.
 */

module.exports = toCamelCase

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase(string) {
  return space(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase()
  })
}

},{"to-space-case":172}],171:[function(require,module,exports){

/**
 * Export.
 */

module.exports = toNoCase

/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/
var hasSeparator = /(_|-|\.|:)/
var hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase(string) {
  if (hasSpace.test(string)) return string.toLowerCase()
  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase()
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase()
  return string.toLowerCase()
}

/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate(string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : ''
  })
}

/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize(string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ')
  })
}

},{}],172:[function(require,module,exports){

var clean = require('to-no-case')

/**
 * Export.
 */

module.exports = toSpaceCase

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */

function toSpaceCase(string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : ''
  }).trim()
}

},{"to-no-case":171}],173:[function(require,module,exports){
'use strict';

var truncate = require("./lib/truncate");
var getLength = require("utf8-byte-length/browser");
module.exports = truncate.bind(null, getLength);

},{"./lib/truncate":174,"utf8-byte-length/browser":175}],174:[function(require,module,exports){
'use strict';

function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

// Truncate string by size in bytes
module.exports = function truncate(getLength, string, byteLength) {
  if (typeof string !== "string") {
    throw new Error("Input must be string");
  }

  var charLength = string.length;
  var curByteLength = 0;
  var codePoint;
  var segment;

  for (var i = 0; i < charLength; i += 1) {
    codePoint = string.charCodeAt(i);
    segment = string[i];

    if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
      i += 1;
      segment += string[i];
    }

    curByteLength += getLength(segment);

    if (curByteLength === byteLength) {
      return string.slice(0, i + 1);
    }
    else if (curByteLength > byteLength) {
      return string.slice(0, i - segment.length + 1);
    }
  }

  return string;
};


},{}],175:[function(require,module,exports){
'use strict';

function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

// Truncate string by size in bytes
module.exports = function getByteLength(string) {
  if (typeof string !== "string") {
    throw new Error("Input must be string");
  }

  var charLength = string.length;
  var byteLength = 0;
  var codePoint = null;
  var prevCodePoint = null;
  for (var i = 0; i < charLength; i++) {
    codePoint = string.charCodeAt(i);
    // handle 4-byte non-BMP chars
    // low surrogate
    if (isLowSurrogate(codePoint)) {
      // when parsing previous hi-surrogate, 3 is added to byteLength
      if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) {
        byteLength += 1;
      }
      else {
        byteLength += 3;
      }
    }
    else if (codePoint <= 0x7f ) {
      byteLength += 1;
    }
    else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
      byteLength += 2;
    }
    else if (codePoint >= 0x800 && codePoint <= 0xffff) {
      byteLength += 3;
    }
    prevCodePoint = codePoint;
  }

  return byteLength;
};

},{}]},{},[6])(6)
});
