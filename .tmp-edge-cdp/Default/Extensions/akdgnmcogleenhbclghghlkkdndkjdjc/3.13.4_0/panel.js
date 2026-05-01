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

},{"../common/Lib":6,"../common/analytics/clientMixin":7,"../common/utils/entities":64,"./ClientMessages":2,"./DeathQueue":3,"./clientTranslate":5,"extend":109}],2:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../common/lib/isFunction":51}],3:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

module.exports = require('./Client');

},{"./Client":1}],5:[function(require,module,exports){
'use strict';

var entities = require('../common/utils/entities')();
module.exports = function (messageId, setCallback) {
  setCallback(entities.decode(chrome.i18n.getMessage(messageId)));
};

},{"../common/utils/entities":64}],6:[function(require,module,exports){
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

},{"./googleChecksum":41,"./hex-md5":42,"./lib/arrayFrom":43,"./lib/containsText.js":44,"./lib/endsWith.js":45,"./lib/getUUID":46,"./lib/ip2long":48,"./lib/isArray":49,"./lib/isEmpty":50,"./lib/isObject":52,"./lib/isString":53,"./lib/parseArgs":54,"./lib/parseUri":55,"./lib/shortHash":56,"./lib/startsWith.js":57,"./lib/trimHash":58}],7:[function(require,module,exports){
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

},{"../lib/isEmpty":50}],8:[function(require,module,exports){
'use strict';
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{}],9:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('./main');
var eventsMixin = require('../utils/eventsMixin');
var messengerTranslateMixin = require('../utils/messengerTranslateMixin');
var Container = function () {
  function Container() {
    _classCallCheck(this, Container);
    this._element = null;
    this._elements = new Map();
  }
  return _createClass(Container, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "els",
    get: function get() {
      return this._elements;
    }
  }, {
    key: "setElsText",
    value: function setElsText(code, text) {
      if (this.els.has(code)) {
        dom.setText(this.els.get(code), text);
      }
    }
  }, {
    key: "removeElements",
    value: function removeElements() {
      this._elements.forEach(function (element) {
        return dom.removeElement(element);
      });
      this._elements.clear();
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeElements();
      dom.removeElement(this._element);
      this._element = null;
    }
  }]);
}();
eventsMixin(Container.prototype);
messengerTranslateMixin(Container.prototype);
module.exports = Container;

},{"../utils/eventsMixin":65,"../utils/messengerTranslateMixin":68,"./main":23}],10:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('./main.js');
var isEmpty = require('../lib/isEmpty');
var CounterElement = function () {
  function CounterElement(selector, context) {
    _classCallCheck(this, CounterElement);
    if (isEmpty(selector)) {
      throw new Error('Argument selector could not be empty');
    }
    context = context || document;
    this._element = null;
    if (selector instanceof HTMLElement) {
      this._element = selector;
    } else {
      this._element = context.querySelector(selector);
    }
    this._counter = 0;
  }
  return _createClass(CounterElement, [{
    key: "counter",
    get: function get() {
      return this._counter;
    },
    set: function set(value) {
      this._counter = value;
      this.show();
    }
  }, {
    key: "inc",
    value: function inc(step) {
      step = step || 1;
      this._counter += step;
      this.show();
    }
  }, {
    key: "show",
    value: function show() {
      if (this._element !== null) {
        dom.text(this._element, this._counter);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._element !== null) {
        this._element.parentNode.removeChild(this._element);
        this._element = null;
        this._counter = 0;
      }
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }]);
}();
module.exports = CounterElement;

},{"../lib/isEmpty":50,"./main.js":23}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';
module.exports = function appendText(element, text) {
  var newTextNode = document.createTextNode(text);
  element.appendChild(newTextNode);
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function clearValue(element) {
  var form = document.createElement('form');
  var container = element.parentNode;
  container.replaceChild(form, element);
  form.appendChild(element);
  form.reset();
  container.replaceChild(element, form);
};

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./_createElement":11,"dom-element-css":100}],16:[function(require,module,exports){
'use strict';
module.exports = function emptyElement(anElem) {
  while (anElem.firstChild) {
    anElem.removeChild(anElem.firstChild);
  }
  return anElem;
};

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

var toCamelCase = require('to-camel-case');
exports.hasAttribute = function hasAttribute(element, name) {
  name = toCamelCase(name === 'for' ? 'htmlFor' : name);
  return element.hasAttribute(name);
};

},{"to-camel-case":114}],20:[function(require,module,exports){
'use strict';
function hasClass(element, name) {
  return typeof element !== 'undefined' && typeof element.classList !== 'undefined' && element.classList.contains(name);
}
module.exports = hasClass;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../lib/isEmpty":50}],23:[function(require,module,exports){
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

},{"../lib/ignore":47,"./Chain":8,"./appendText":12,"./clearValue":13,"./correctZIndex":14,"./createElement":15,"./emptyElement":16,"./getElementText":17,"./getOffset":18,"./hasAttribute":19,"./hasClass":20,"./isBodyReady":21,"./isChild":22,"./parseMarkdown":24,"./pixelValue":25,"./qualifyURL":26,"./removeElement":27,"./setContent":28,"./setText":29,"dom-element":105}],24:[function(require,module,exports){
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

},{"extend":109}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"../lib/isEmpty":50}],28:[function(require,module,exports){
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

},{"./_createElement":11,"./emptyElement":16}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"./createElement":15,"html-entities":110}],31:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23}],32:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../utils/eventsMixin":65,"extend":109}],33:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23}],34:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"extend":109}],35:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../dom/main');
var eventsMixin = require('../utils/eventsMixin');
var InlineMenu = function () {
  function InlineMenu(element) {
    _classCallCheck(this, InlineMenu);
    this._element = element;
    this._sourceItems = null;
    this._lastSourceItem = null;
    this._scaleableItems = null;
    this._lastItem = null;
    this._observer = null;
    this.processContentUpdate = this.handleContentUpdate.bind(this);
  }
  return _createClass(InlineMenu, [{
    key: "init",
    value: function init() {
      var _this = this;
      this._sourceItems = [];
      Array.from(this._element.children).forEach(function (item) {
        return _this._sourceItems.push(item);
      });
      this._lastSourceItem = this._sourceItems.pop();
      this._scaleableItems = [];
      this._sourceItems.forEach(function (item) {
        var child = dom('div', {
          className: 'seoquake-inline-menu-container-item'
        }, item);
        _this._scaleableItems.push(child);
        _this._element.appendChild(child);
      });
      this._lastItem = dom('div', {
        className: 'seoquake-inline-menu-container-last-item'
      }, this._lastSourceItem);
      this._element.appendChild(this._lastItem);
      dom.addClass(this._element, 'seoquake-inline-menu-container');
      this.render();
      this._observer = new MutationObserver(this.processContentUpdate);
      this._observer.observe(this._element, {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;
      if (this._observer !== null) {
        this._observer.disconnect();
        this._observer = null;
      }
      if (this._sourceItems !== null) {
        this._sourceItems.forEach(function (item) {
          return _this2._element.appendChild(item);
        });
        this._sourceItems = null;
      }
      if (this._scaleableItems !== null) {
        this._scaleableItems.forEach(function (item) {
          return _this2._element.removeChild(item);
        });
        this._scaleableItems = null;
      }
      if (this._lastSourceItem !== null) {
        this._element.appendChild(this._lastSourceItem);
        this._lastSourceItem = null;
      }
      if (this._lastItem !== null) {
        this._element.removeChild(this._lastItem);
        this._lastItem = null;
      }
      dom.removeClass(this._element, 'seoquake-inline-menu-container');
    }
  }, {
    key: "render",
    value: function render() {
      var lastIndex = this._sourceItems.length;
      var lastItemWidth = this._lastSourceItem.offsetWidth;
      var menuWidth = this._element.offsetWidth;
      var menuItem = Math.floor((menuWidth - lastItemWidth) / lastIndex);
      dom.css(this._lastItem, 'width', lastItemWidth + 'px');
      for (var i = 0; i < lastIndex; i++) {
        dom.css(this._scaleableItems[i], 'max-width', menuItem + 'px');
      }
    }
  }, {
    key: "handleContentUpdate",
    value: function handleContentUpdate() {
      this.render();
    }
  }]);
}();
eventsMixin(InlineMenu.prototype);
module.exports = InlineMenu;

},{"../dom/main":23,"../utils/eventsMixin":65}],36:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var dom = require('../dom/main.js');
var extend = require('extend');
var Dropdown = require('./Dropdown');
var MenuDropdown = function (_Dropdown) {
  function MenuDropdown(container, config) {
    var _this;
    _classCallCheck(this, MenuDropdown);
    config = extend(true, {}, MenuDropdown.DEFAULT_CONFIG, config);
    _this = _callSuper(this, MenuDropdown, [container, config]);
    _this._itemClickListener = _this.itemClickHandler.bind(_this);
    _this._visible = false;
    _this._items = new Map();
    return _this;
  }
  _inherits(MenuDropdown, _Dropdown);
  return _createClass(MenuDropdown, [{
    key: "itemClickHandler",
    value: function itemClickHandler(event) {
      if (this.config.autoHide) {
        this.hide();
      }
    }
  }, {
    key: "addItem",
    value: function addItem(id, title) {
      if (this._items.has(id)) {
        return this._items.get(id);
      }
      var item = dom('div', {
        className: 'seoquake-menuitem',
        'data-id': id
      }, title);
      item.addEventListener('click', this._itemClickListener);
      this._body.appendChild(item);
      this._items.set(id, item);
      return item;
    }
  }, {
    key: "removeItem",
    value: function removeItem(id) {
      var item = this.getItem(id);
      item.removeEventListener('click', this._itemClickListener);
      dom.removeElement(item);
    }
  }, {
    key: "getItem",
    value: function getItem(id) {
      if (!this._items.has(id)) {
        throw new Error('Item with such id not found');
      }
      return this._items.get(id);
    }
  }, {
    key: "addSeparator",
    value: function addSeparator() {
      this._items.set('separator-' + this._items.size, this._body.appendChild(dom('div', {
        className: 'seoquake-menuseparator'
      })));
    }
  }, {
    key: "addText",
    value: function addText(message) {
      var text = dom('div', {
        className: 'seoquake-text'
      }, message);
      this._body.appendChild(text);
      this._items.set('text-' + this._items.size, text);
      return text;
    }
  }, {
    key: "positionMenu",
    value: function positionMenu() {
      this.position();
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;
      this.hide();
      this._items.forEach(function (item, id) {
        return _this2.removeItem(id);
      });
      this._items.clear();
      _get(_getPrototypeOf(MenuDropdown.prototype), "remove", this).call(this);
    }
  }]);
}(Dropdown);
MenuDropdown.DEFAULT_CONFIG = {
  button: 'left',
  preventDefault: true,
  stopPropagation: false,
  containerClass: 'seoquake-menu-container',
  autoHide: true,
  bodyClickHide: true,
  toggle: false,
  positionFixed: false,
  positionCorrection: {
    left: 0,
    top: 0,
    bottom: null,
    right: null
  }
};
MenuDropdown.MOUSE_BUTTONS = {
  left: 0,
  right: 2,
  middle: 1
};
module.exports = MenuDropdown;

},{"../dom/main.js":23,"./Dropdown":32,"extend":109}],37:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../utils/eventsMixin":65,"extend":109}],38:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var dom = require('../dom/main');
var eventsMixin = require('../utils/eventsMixin');
var TabsSwitch = function () {
  function TabsSwitch(config) {
    _classCallCheck(this, TabsSwitch);
    this._config = extend(true, {}, TabsSwitch.DEFAULT_CONFIG, config);
    this._element = null;
    this._tabs = new Map();
    this._panels = null;
    this._headers = null;
    this._title = null;
    this._current = null;
    this._isInit = false;
    this.processTabClick = this.handleTabClick.bind(this);
  }
  return _createClass(TabsSwitch, [{
    key: "init",
    value: function init() {
      if (this._isInit) {
        return;
      }
      this._createElement();
      this._isInit = true;
    }
  }, {
    key: "addTab",
    value: function addTab(id, title, content) {
      if (!this._isInit) {
        this.init();
      }
      var tab = {
        content: dom('div', {
          className: 'tabContent'
        }, content),
        tab: dom('div', {
          className: 's-tab__el',
          'data-id': id
        }, title)
      };
      this._headers.appendChild(tab.tab);
      this._panels.appendChild(tab.content);
      this._tabs.set(id, tab);
      if (this._current === null) {
        this.current = id;
      }
      tab.tab.addEventListener('click', this.processTabClick);
      this.updateState();
      return tab;
    }
  }, {
    key: "getTab",
    value: function getTab(id) {
      if (!this._isInit) {
        this.init();
      }
      if (!this._tabs.has(id)) {
        throw Error('No such tab');
      }
      return this._tabs.get(id);
    }
  }, {
    key: "_createElement",
    value: function _createElement() {
      if (this._element !== null) {
        throw new Error('Element already created');
      }
      this._element = dom('div', {
        className: 'tabContainer'
      });
      this._headers = dom('div', {
        className: 's-tab'
      });
      if (this._config.headerClass !== '') {
        dom.addClass(this._headers, this._config.headerClass);
      }
      this._title = dom('div', {
        className: 's-tab__head ' + this._config.titleClass
      }, this._config.title);
      this._headers.appendChild(this._title);
      this._panels = dom('div', {
        className: 'tabPanels'
      });
      if (this._config.panelsClass !== '') {
        dom.addClass(this._panels, this._config.panelsClass);
      }
      this._element.appendChild(this._headers);
      this._element.appendChild(this._panels);
      this._tabs.clear();
    }
  }, {
    key: "updateState",
    value: function updateState() {
      var _this = this;
      this._tabs.forEach(function (tab, key) {
        if (_this._current === key) {
          dom.removeClass(tab.content, 'hidden');
          dom.addClass(tab.tab, '-chosen');
        } else {
          dom.removeClass(tab.tab, '-chosen');
          dom.addClass(tab.content, 'hidden');
        }
      });
    }
  }, {
    key: "current",
    get: function get() {
      return this._current;
    },
    set: function set(id) {
      if (this._current == id) {
        return;
      }
      if (!this._tabs.has(id)) {
        return;
      }
      this._current = id;
      this.updateState();
      this.dispatchEvent('tabSwitched', this._current);
    }
  }, {
    key: "element",
    get: function get() {
      if (this._element === null) {
        this._createElement();
      }
      return this._element;
    }
  }, {
    key: "title",
    get: function get() {
      return this._config.title;
    },
    set: function set(value) {
      this._config.title = value;
      if (this._isInit) {
        dom.text(this._title, this._config.title);
      }
    }
  }, {
    key: "handleTabClick",
    value: function handleTabClick(event) {
      event.preventDefault();
      this.current = event.currentTarget.getAttribute('data-id');
    }
  }]);
}();
TabsSwitch.DEFAULT_CONFIG = {
  headerClass: '',
  title: '',
  titleClass: '',
  panelsClass: ''
};
eventsMixin(TabsSwitch.prototype);
module.exports = TabsSwitch;

},{"../dom/main":23,"../utils/eventsMixin":65,"extend":109}],39:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../lib/isString":53,"../utils/eventsMixin":65,"extend":109}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"./isArray":49}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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
},{}],47:[function(require,module,exports){
'use strict';

module.exports = function ignore(reason) {
  console.log(reason);
};

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
'use strict';
module.exports = function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

},{}],50:[function(require,module,exports){
'use strict';
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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

},{}],51:[function(require,module,exports){
'use strict';
module.exports = function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
'use strict';
module.exports = function isString(value) {
  return value instanceof String || typeof value === 'string';
};

},{}],54:[function(require,module,exports){
'use strict';
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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

},{}],55:[function(require,module,exports){
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

},{"./isEmpty":50}],56:[function(require,module,exports){
'use strict';

var hexMd5 = require('../hex-md5');
module.exports = function shortHash(input) {
  return hexMd5(input).substr(0, 8);
};

},{"../hex-md5":42}],57:[function(require,module,exports){
'use strict';

module.exports = function startsWith(string, pattern) {
  if (string === undefined || string === null || !string.indexOf) {
    return false;
  }
  return string.indexOf(pattern) === 0;
};

},{}],58:[function(require,module,exports){
'use strict';
module.exports = function trimHash(url) {
  var result = url;
  var hashPosition = url.indexOf('#');
  if (hashPosition !== -1) {
    result = url.substring(0, hashPosition);
  }
  return result;
};

},{}],59:[function(require,module,exports){
'use strict';

var isEmpty = require('./isEmpty');
module.exports = function versionCompare(oldVersion, newVersion) {
  if (oldVersion === newVersion) {
    return 0;
  }
  if (isEmpty(oldVersion) && !isEmpty(newVersion)) {
    return 1;
  }
  oldVersion = oldVersion.split('.');
  newVersion = newVersion.split('.');
  while (newVersion.length < oldVersion.length) {
    newVersion.push('0');
  }
  for (var i = 0; i < newVersion.length; i++) {
    if (oldVersion.length <= i) {
      return 1;
    }
    if (parseInt(newVersion[i]) > parseInt(oldVersion[i])) {
      return 1;
    }
  }
  return -1;
};

},{"./isEmpty":50}],60:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../lib/isEmpty":50,"../utils/messengerMixin":67}],61:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../lib/shortHash":56}],62:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../lib/isEmpty":50,"../lib/isFunction":51,"../lib/isString":53,"../lib/parseArgs":54,"../lib/parseUri":55,"./XHRProxyResult":63,"extend":109}],63:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"extend":109}],64:[function(require,module,exports){
'use strict';

var Entities = require('html-entities').AllHtmlEntities;
var entities = null;
module.exports = function () {
  if (entities === null) {
    entities = new Entities();
  }
  return entities;
};

},{"html-entities":110}],65:[function(require,module,exports){
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

},{"../lib/isFunction":51,"../lib/isString":53}],66:[function(require,module,exports){
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

},{"../lib/isEmpty":50}],67:[function(require,module,exports){
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

},{"./messengerBaseMixin":66}],68:[function(require,module,exports){
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

},{"./messengerBaseMixin":66}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
'use strict';
function padLeft(number, length, placeholder) {
  length = length || 2;
  placeholder = placeholder || '0';
  var result = number.toString(10);
  if (result.length < length) {
    result = placeholder.repeat(length - result.length) + result;
  }
  return result;
}
module.exports = padLeft;

},{}],71:[function(require,module,exports){
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

},{"../lib/ignore":47}],72:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var ModuleLink = require('./ModuleLink');
var ignore = require('../../../common/lib/ignore');
var LinkInfoLink = function (_ModuleLink) {
  function LinkInfoLink(client, element) {
    _classCallCheck(this, LinkInfoLink);
    return _callSuper(this, LinkInfoLink, [client, element]);
  }
  _inherits(LinkInfoLink, _ModuleLink);
  return _createClass(LinkInfoLink, [{
    key: "element",
    set: function set(value) {
      _set(_getPrototypeOf(LinkInfoLink.prototype), "element", value, this, true);
      this._element.addEventListener('click', this._clickCallbackListener, true);
    }
  }, {
    key: "clickCallback",
    value: function clickCallback(event) {
      var _this = this;
      event.preventDefault();
      event.stopPropagation();
      this._client.getCurrentWindowUrl().then(function (url) {
        _this._client.sendMessage('sq.moduleRun', {
          name: 'linkinfo',
          configuration: {
            url: url.url
          }
        }, function () {
          return _this._client.hidePanel();
        });
        _this._client.registerEvent('panel', 'clickModuleLink', 'linkinfo');
      })["catch"](function (reason) {
        _this._client.sendMessage('sq.moduleRun', {
          name: 'linkinfo'
        }, function () {
          return _this._client.hidePanel();
        });
        _this._client.registerEvent('panel', 'clickModuleLink', 'linkinfo');
      });
    }
  }, {
    key: "stateDisabled",
    value: function stateDisabled() {}
  }, {
    key: "stateAvailable",
    value: function stateAvailable() {}
  }, {
    key: "stateLoading",
    value: function stateLoading() {}
  }, {
    key: "stateTimeout",
    value: function stateTimeout() {}
  }]);
}(ModuleLink);
module.exports = LinkInfoLink;

},{"../../../common/lib/ignore":47,"./ModuleLink":73}],73:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../common/dom/main');
var CounterElement = require('../../../common/dom/CounterElement');
var ignore = require('../../../common/lib/ignore');
var ModuleLink = function () {
  function ModuleLink(client, element) {
    _classCallCheck(this, ModuleLink);
    if (!(element instanceof HTMLElement)) {
      throw new Error('Argument should be HTMLElement');
    }
    this._element = null;
    this._badge = null;
    this._title = '';
    this._titleNode = null;
    this._client = client;
    this._clickCallbackListener = this.clickCallback.bind(this);
    this.element = element;
  }
  return _createClass(ModuleLink, [{
    key: "t",
    value: function t(message) {
      var _this = this;
      return new Promise(function (resolve) {
        return _this._client.t(message, resolve);
      });
    }
  }, {
    key: "clickCallback",
    value: function clickCallback(event) {
      var _this2 = this;
      event.preventDefault();
      event.stopPropagation();
      this._client.sendMessage('sq.moduleRun', {
        name: 'common',
        configuration: {
          which: this.id
        }
      }, function () {
        _this2._client.registerEvent('panel', 'clickModuleLink', _this2.id);
        _this2._client.hidePanel();
      });
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      var _this3 = this;
      if (!(value instanceof HTMLElement)) {
        throw new Error('Argument should be HTMLElement');
      }
      if (this._element !== null) {
        this._element.removeEventListener('click', this._clickCallbackListener);
      }
      this._element = value;
      this._id = value.getAttribute('rel');
      this._titleNode = null;
      Array.from(this._element.childNodes).some(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          _this3._titleNode = node;
          return true;
        }
        return false;
      });
      this.t('sqPanel_module_title_' + this._id).then(function (text) {
        return _this3.title = text;
      })["catch"](ignore);
    }
  }, {
    key: "badge",
    get: function get() {
      return this._badge;
    },
    set: function set(value) {
      if (this._badge !== null) {
        this._badge.remove();
      }
      if (!(value instanceof CounterElement) && value !== null) {
        throw new Error('Argument should be CounterElement or null');
      }
      this._badge = value;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "title",
    get: function get() {
      return this._title;
    },
    set: function set(text) {
      this._title = text;
      if (this._titleNode !== null) {
        this._element.replaceChild(document.createTextNode(text), this._titleNode);
      }
    }
  }, {
    key: "stateDisabled",
    value: function stateDisabled() {
      this.element.removeEventListener('click', this._clickCallbackListener);
      dom.removeClass(this._element.parentNode, 'loading');
      dom.removeClass(this._element.parentNode, 'timeout');
      dom.addClass(this._element.parentNode, 'hidden');
    }
  }, {
    key: "stateAvailable",
    value: function stateAvailable() {
      this._element.addEventListener('click', this._clickCallbackListener, true);
      dom.removeClass(this._element.parentNode, 'hidden');
      dom.removeClass(this._element.parentNode, 'loading');
      dom.removeClass(this._element.parentNode, 'timeout');
    }
  }, {
    key: "stateLoading",
    value: function stateLoading() {
      this.element.removeEventListener('click', this._clickCallbackListener);
      dom.removeClass(this._element.parentNode, 'hidden');
      dom.removeClass(this._element.parentNode, 'timeout');
      dom.addClass(this._element.parentNode, 'loading');
    }
  }, {
    key: "stateTimeout",
    value: function stateTimeout() {
      this.element.removeEventListener('click', this._clickCallbackListener);
      dom.removeClass(this._element.parentNode, 'hidden');
      dom.removeClass(this._element.parentNode, 'loading');
      dom.addClass(this._element.parentNode, 'timeout');
    }
  }]);
}();
module.exports = ModuleLink;

},{"../../../common/dom/CounterElement":10,"../../../common/dom/main":23,"../../../common/lib/ignore":47}],74:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CounterElement = require('../../../common/dom/CounterElement');
var dom = require('../../../common/dom/main');
var isEmpty = require('../../../common/lib/isEmpty');
var ModuleLink = require('./ModuleLink');
var LinkInfoLink = require('./LinkInfoLink');
var ModuleLinks = function () {
  function ModuleLinks(client, selector, container) {
    var _this = this;
    _classCallCheck(this, ModuleLinks);
    this._client = client;
    this._container = container || document.body;
    this._selector = selector || '[data-role="moduleLink"]';
    this._data = new Map();
    this._shadow = null;
    Array.from(this._container.querySelectorAll(this._selector)).forEach(function (element) {
      return _this.createLink(element);
    });
  }
  return _createClass(ModuleLinks, [{
    key: "t",
    value: function t(code) {
      var _this2 = this;
      return new Promise(function (resolve) {
        return _this2._client.t(code, resolve);
      });
    }
  }, {
    key: "createLink",
    value: function createLink(element) {
      if (element.tagName.toLowerCase() !== 'a') {
        throw new Error('Element should be link');
      }
      if (isEmpty(element.getAttribute('rel'))) {
        throw new Error('Link should have rel attribute');
      }
      var elementObject;
      if (element.getAttribute('rel') === 'linkinfo') {
        elementObject = new LinkInfoLink(this._client, element);
      } else {
        elementObject = new ModuleLink(this._client, element);
      }
      this._data.set(elementObject.id, elementObject);
    }
  }, {
    key: "_showShadow",
    value: function _showShadow(message) {
      message = message || this.t('sqPanel_waiting');
      if (this._shadow === null) {
        this._shadow = dom.createElement('div', {
          className: 'shadow'
        }, message);
      } else {
        dom.text(this._shadow, message);
      }
      var width = 0;
      this._data.forEach(function (element) {
        return width += element instanceof LinkInfoLink ? 0 : element.element.parentNode.offsetWidth;
      });
      dom.css(this._shadow, {
        width: width + 'px'
      });
      this._container.appendChild(this._shadow);
    }
  }, {
    key: "_hideShadow",
    value: function _hideShadow() {
      if (this._shadow === null) {
        return;
      }
      dom.removeElement(this._shadow);
      this._shadow = null;
    }
  }, {
    key: "stateDisableAll",
    value: function stateDisableAll() {
      this._hideShadow();
      this._data.forEach(function (item) {
        return item.stateDisabled();
      });
    }
  }, {
    key: "stateDocumentLoading",
    value: function stateDocumentLoading() {
      this._showShadow();
      this._data.forEach(function (item) {
        return item.stateLoading();
      });
    }
  }, {
    key: "stateAllAvailable",
    value: function stateAllAvailable() {
      this._hideShadow();
      this._data.forEach(function (item) {
        return item.stateAvailable();
      });
    }
  }, {
    key: "stateDocumentTimeout",
    value: function stateDocumentTimeout(message) {
      message = message || 'Data is not available in 30 seconds';
      this._showShadow(message);
      this._data.forEach(function (item) {
        return item.stateTimeout();
      });
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      if (!this._data.has(key)) {
        throw new Error('No such module link');
      }
      return this._data.get(key);
    }
  }, {
    key: "setBadge",
    value: function setBadge(key, value) {
      var item = this.getItem(key);
      if (item.badge === null) {
        var badge = dom('span', {
          className: 'badge'
        }, '0');
        item.element.appendChild(badge);
        item.badge = new CounterElement(badge);
      }
      item.badge.counter = value;
    }
  }, {
    key: "removeBadge",
    value: function removeBadge(key) {
      this.getItem(key).badge = null;
    }
  }, {
    key: "incBadge",
    value: function incBadge(key, step) {
      step = step || 1;
      var item = this.getItem(key);
      if (item.badge !== null) {
        item.badge.inc(step);
      }
    }
  }]);
}();
module.exports = ModuleLinks;

},{"../../../common/dom/CounterElement":10,"../../../common/dom/main":23,"../../../common/lib/isEmpty":50,"./LinkInfoLink":72,"./ModuleLink":73}],75:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var ModuleLinks = require('./ModuleLinks');
var isEmpty = require('../../../common/lib/isEmpty');
var PanelMessage = require('./PanelMessage');
var ParametersPanel = require('./ParametersPanel');
var PanelMenu = require('./PanelMenu');
var PanelFeedback = require('./feedback/Panel');
var ChangeLogPanel = require('./changelog/Panel');
var ToggleButton = require('../../../common/effects/ToggleButton');
var dom = require('../../../common/dom/main');
var ignore = require('../../../common/lib/ignore');
var HintBox = require('../../../common/effects/HintBox');
var InlineMenu = require('../../../common/effects/InlineMenu');
var TabsSwitch = require('../../../common/effects/TabsSwitch');
var BacklinksReport = require('./backlinks/BacklinksReport');
var TrafficAnalyticsReport = require('./ta/TrafficAnalyticsReport');
var PanelLog = require('./ui/PanelLog');
var TipsPanel = require('./tips/TipsPanel');
var NoticePanel = require('./tips/NoticePanel');
var SurveyPanel = require('./feedback/SurveyPanel');
var MilestoneSurveyPanel = require('./feedback/MilestoneSurveyPanel');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var PanelMain = function () {
  function PanelMain() {
    _classCallCheck(this, PanelMain);
    this._moduleLinks = null;
    this._panelModule = null;
    this._panelMessage = null;
    this._parametersPanel = null;
    this._waitingTimers = new Map();
    this._mainMenu = null;
    this._panelFeedback = null;
    this._changelog = null;
    this._buttonGlobalSwitch = null;
    this._coreDisabled = null;
    this._panelMode = null;
    this._tabs = null;
    this._dataContainer = null;
    this._bodyMonitor = null;
    this._oldBodyHeight = 0;
    this._backlinksReport = null;
    this._trafficAnalyticsReport = null;
    this._log = new PanelLog();
    this._tipsPanel = null;
    this._noticePanel = null;
    this._surveyPanel = null;
    this._milestoneSurveyPanel = null;
    this.processModuleRun = this.handleModuleRun.bind(this);
    this.processPageData = this.handlePageData.bind(this);
    this.processNoPageInfo = this.handleNoPageInfo.bind(this);
    this.processChangelogAvaiable = this.handleChangelogAvailable.bind(this);
    this.processChangelogClose = this.handleChangelogClose.bind(this);
    this.processSemrushClick = this.handleSemrushClick.bind(this);
    this.processGlobalSwitchClick = this.handleGlobalSwitchClick.bind(this);
    this.processDisabledState = this.handleDisabledState.bind(this);
    this.processFeedbackLinkClick = this.handleFeedbackLinkClick.bind(this);
    this.processTabAndConfiguration = this.handleTabAndConfiguration.bind(this);
    this.processTabSwitch = this.handleTabSwitch.bind(this);
    this.processBodyContentChange = this.handleBodyContentChange.bind(this);
    this.processPanelHide = this.handlePanelHide.bind(this);
  }
  return _createClass(PanelMain, [{
    key: "surveyPanel",
    get: function get() {
      return this._surveyPanel;
    }
  }, {
    key: "milestoneSurveyPanel",
    get: function get() {
      return this._milestoneSurveyPanel;
    }
  }, {
    key: "init",
    value: function init() {
      var client = this.getMessenger();
      this._moduleLinks = new ModuleLinks(client);
      this._panelMessage = new PanelMessage(client);
      this._panelFeedback = new PanelFeedback(client);
      var feedbackLink = document.querySelector('.feedbackHint > a');
      if (feedbackLink) {
        feedbackLink.addEventListener('click', this.processFeedbackLinkClick, true);
      }
      this._createMenu();
      this._dataContainer = document.getElementById('dataPanel');
      this._tabs = new TabsSwitch();
      this._tabs.addTab('parameters', this.t('sqPanel_tabs_parameters'), '');
      var backlinks = this._tabs.addTab('backlinks', this.t('sqPanel_tabs_backlinks'), '');
      var trafficAnalytics = this._tabs.addTab('traffic', this.t('sqPanel_tabs_traffic'), '');
      dom.addClass(trafficAnalytics.tab, '-new');
      this._dataContainer.appendChild(this._tabs.element);
      this.initSurveyPanel();
      this.initMilestoneSurveyPanel();
    }
  }, {
    key: "_createMenu",
    value: function _createMenu() {
      var client = this.getMessenger();
      this._mainMenu = new PanelMenu(document.querySelector('[data-role=options]'), false, client);
      this._mainMenu.init();
      this._mainMenu.createDefaultStructure();
      this._changelog = new ChangeLogPanel();
      this._changelog.setMessenger(client);
      this._changelog.isAvailable.then(this.processChangelogAvaiable)["catch"](ignore);
      return this._mainMenu;
    }
  }, {
    key: "stateMessage",
    value: function stateMessage(message) {
      var _this = this;
      if (message instanceof Promise) {
        message.then(function (text) {
          return _this._stateMessage(text);
        })["catch"](ignore);
      } else {
        this._stateMessage(message);
      }
    }
  }, {
    key: "_stateMessage",
    value: function _stateMessage(message) {
      this._moduleLinks.stateDisableAll();
      dom.addClass(this._tabs.element, 'hidden');
      this._panelMessage.show(message);
      this.handleBodyContentChange();
    }
  }, {
    key: "stateDocumentTimeout",
    value: function stateDocumentTimeout(message) {
      this._moduleLinks.stateDocumentTimeout(message);
      this.handleBodyContentChange();
    }
  }, {
    key: "stateCoreDisabled",
    value: function stateCoreDisabled() {
      if (this._parametersPanel !== null) {
        this._parametersPanel.autoLoad = false;
      }
      this._mainMenu.switchToMiniState();
      dom.addClass(document.body, 'small');
      this._tipsPanel.hide();
      this._noticePanel.hide();
      this._surveyPanel.hide();
      this._milestoneSurveyPanel.hide();
    }
  }, {
    key: "stateCoreEnabled",
    value: function stateCoreEnabled() {
      if (this._tabs.current === 'parameters' && this._panelMode === 0) {
        if (this._parametersPanel !== null) {
          this.loadParameters();
        }
      }
      if (this._tabs.current === 'backlinks') {
        if (this._backlinksReport !== null) {
          this._backlinksReport.process();
        }
      } else if (this._tabs.current === 'traffic') {
        if (this._trafficAnalyticsReport !== null) {
          this._trafficAnalyticsReport.process();
        }
      }
      this._mainMenu.switchToBigState();
      dom.removeClass(document.body, 'small');
      this._tipsPanel.show();
      this._noticePanel.show();
      this._surveyPanel.show();
      this._milestoneSurveyPanel.show();
    }
  }, {
    key: "stateDocumentReady",
    value: function stateDocumentReady() {
      this._moduleLinks.stateAllAvailable();
      this.sendMessage('sq.moduleRun', {
        name: 'panel'
      }).then(this.processModuleRun)["catch"](ignore);
    }
  }, {
    key: "stateWaitForDocumentReady",
    value: function stateWaitForDocumentReady(tabId, attempts) {
      var _this2 = this;
      attempts = attempts || 1;
      this._moduleLinks.stateDocumentLoading(attempts);
      if (attempts < this.MAX_ATTEMPTS) {
        this.sendMessage('sq.isDocumentReady', {
          id: tabId
        }).then(function (answer) {
          if (answer === 'YES') {
            _this2.stateDocumentReady();
          } else {
            if (_this2._waitingTimers.has(tabId)) {
              clearTimeout(_this2._waitingTimers.get(tabId));
            }
            _this2._waitingTimers.set(tabId, setTimeout(function () {
              return _this2.stateWaitForDocumentReady(tabId, attempts + 1);
            }, 100));
          }
        });
      } else {
        this.stateDocumentTimeout();
      }
    }
  }, {
    key: "loadPageInfo",
    value: function loadPageInfo() {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        var request = {
          name: 'panel',
          id: _this3._panelModule.id,
          arguments: {
            command: 'sq.requestPageInfo'
          }
        };
        setTimeout(reject, 10000);
        _this3.sendMessage('sq.moduleGetDataEx', request).then(resolve)["catch"](ignore);
      });
    }
  }, {
    key: "getCurrentTab",
    value: function getCurrentTab() {
      return this.getMessenger().getCurrentWindowUrl();
    }
  }, {
    key: "show",
    value: function show() {
      this._bodyMonitor = new MutationObserver(this.processBodyContentChange);
      this._bodyMonitor.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
      });
      var requests = [this.getCurrentTab(), this.getConfiguration()];
      Promise.all(requests).then(this.processTabAndConfiguration)["catch"](ignore);
      var menu = new InlineMenu(document.querySelector('.main-menu > nav'));
      menu.init();
      this.registerEvent('panel', 'show');
    }
  }, {
    key: "hide",
    value: function hide() {
      this._waitingTimers.forEach(function (timer) {
        return clearTimeout(timer);
      });
      this._waitingTimers.clear();
      if (this._parametersPanel !== null) {
        this._parametersPanel.remove();
      }
      if (this._panelModule !== null) {
        this.sendMessage('sq.moduleClose', this._panelModule);
      }
      this._panelModule = null;
      this._panelFeedback.remove();
      this._panelFeedback = null;
    }
  }, {
    key: "showGlobalSwitchMessage",
    value: function showGlobalSwitchMessage(message) {
      var _this4 = this;
      if (message instanceof Promise) {
        message.then(function (text) {
          return _this4._showGlobalSwitchMessage(text);
        })["catch"](ignore);
      } else {
        this._showGlobalSwitchMessage(message);
      }
    }
  }, {
    key: "_showGlobalSwitchMessage",
    value: function _showGlobalSwitchMessage(message) {
      var hint = new HintBox(this._buttonGlobalSwitch.element, {
        className: 'seoquake-hintbox seoquake-hintbox-side-left',
        event: '',
        offset: {
          top: -5,
          left: -10
        }
      });
      hint.message = message;
      hint.show();
      setTimeout(function () {
        hint.hide();
      }, 1000);
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      this.sendMessage('sqff.resize', {
        width: width,
        height: height
      });
    }
  }, {
    key: "initToggleButton",
    value: function initToggleButton(coreDisabled) {
      var _this5 = this;
      var button = document.querySelector('[data-role="switch"] > button');
      this._buttonGlobalSwitch = new ToggleButton(button, {
        classActive: 'seoquake-slider-button-active',
        initialStatus: coreDisabled ? ToggleButton.STATUS_UP : ToggleButton.STATUS_DOWN
      });
      this._buttonGlobalSwitch.addEventListener('up', this.processGlobalSwitchClick);
      this._buttonGlobalSwitch.addEventListener('down', this.processGlobalSwitchClick);
      this._mainMenu.addEventListener('coreDisabled', function () {
        _this5._buttonGlobalSwitch.setStatus(ToggleButton.STATUS_UP, true);
        _this5.stateCoreDisabled();
      });
      this._mainMenu.addEventListener('coreEnabled', function () {
        _this5._buttonGlobalSwitch.setStatus(ToggleButton.STATUS_DOWN, true);
        _this5.stateCoreEnabled();
      });
    }
  }, {
    key: "initSurveyPanel",
    value: function initSurveyPanel() {
      if (this._surveyPanel !== null) {
        return;
      }
      this._surveyPanel = new SurveyPanel();
      this._surveyPanel.setMessenger(this.getMessenger());
      this._surveyPanel.init();
    }
  }, {
    key: "initMilestoneSurveyPanel",
    value: function initMilestoneSurveyPanel() {
      if (this._milestoneSurveyPanel !== null) {
        return;
      }
      this._milestoneSurveyPanel = new MilestoneSurveyPanel();
      this._milestoneSurveyPanel.setMessenger(this.getMessenger());
      this._milestoneSurveyPanel.init();
    }
  }, {
    key: "loadParameters",
    value: function loadParameters() {
      this._parametersPanel.topParameters.loadData();
      this._parametersPanel.listParameters.loadData();
      this._parametersPanel.autoLoad = true;
    }
  }, {
    key: "handleTabAndConfiguration",
    value: function handleTabAndConfiguration(values) {
      var _this6 = this;
      var tab = values[0];
      var configuration = values[1];
      this._coreDisabled = configuration.core.disabled;
      this.initToggleButton(configuration.core.disabled);
      this._mainMenu.updateState(configuration);
      if (configuration.hasOwnProperty('panel') && configuration.panel.hasOwnProperty('last_tab')) {
        this._tabs.current = configuration.panel.last_tab;
      } else {
        this._tabs.current = 'parameters';
      }
      this._tipsPanel = new TipsPanel(configuration.panel.last_tip);
      this._tipsPanel.setTranslateFunction(this.t.bind(this));
      this._tipsPanel.init();
      this._tipsPanel.addEventListener('closePanel', function (lastTip) {
        _this6.setConfigurationItem('panel.last_tip', lastTip).then(function () {
          return _this6.sendMessage('sq.updateConfiguration');
        })["catch"](ignore);
        _this6.registerEvent('panel', 'Close tips');
      });
      this._tipsPanel.addEventListener('openOptions', function (panel) {
        _this6.sendMessage('sq.openConfigurationWindow', {
          panel: panel
        }).then(_this6.processPanelHide)["catch"](ignore);
        _this6.registerEvent('panel', 'Tips configuration open', panel);
      });
      this._tipsPanel.addEventListener('openLink', function (url) {
        _this6.sendMessage('sq.openTab', url).then(_this6.processPanelHide)["catch"](ignore);
        _this6.registerEvent('panel', 'Tips open link', url);
      });
      this._noticePanel = new NoticePanel(configuration.panel.last_notice);
      this._noticePanel.setTranslateFunction(this.t.bind(this));
      this._noticePanel.init();
      this._noticePanel.addEventListener('closePanel', function (lastNotice) {
        _this6.setConfigurationItem('panel.last_notice', lastNotice).then(function () {
          return _this6.sendMessage('sq.updateConfiguration');
        })["catch"](ignore);
        _this6.registerEvent('panel', 'Close policy notice');
      });
      this._noticePanel.addEventListener('openOptions', function (panel) {
        _this6.sendMessage('sq.openConfigurationWindow', {
          panel: panel
        }).then(_this6.processPanelHide)["catch"](ignore);
        _this6.registerEvent('panel', 'Policy notice configuration open', panel);
      });
      this._noticePanel.addEventListener('openLink', function (url) {
        _this6.sendMessage('sq.openTab', url).then(_this6.processPanelHide)["catch"](ignore);
        _this6.registerEvent('panel', 'Policy notice open link', url);
      });
      this._tabs.addEventListener('tabSwitched', this.processTabSwitch);
      this._waitingTimers.forEach(function (timer) {
        return clearTimeout(timer);
      });
      this._waitingTimers.clear();
      if (this._coreDisabled) {
        this.stateCoreDisabled();
      } else {
        this.stateCoreEnabled();
      }
      if (typeof tab.url === 'undefined' || !tab.url.startsWith('http')) {
        this.stateMessage(this.t('sqPanel_nothing_to_analyze'));
        return;
      }
      var backlinksTab = 'root_domain';
      if (configuration.hasOwnProperty('panel') && configuration.panel.hasOwnProperty('backlinks_tab')) {
        backlinksTab = configuration.panel.backlinks_tab;
      }
      this._backlinksReport = new BacklinksReport(tab.url, backlinksTab);
      this._backlinksReport.setMessenger(this.getMessenger());
      this._backlinksReport.init();
      this._tabs.getTab('backlinks').content.appendChild(this._backlinksReport.panel);
      this._trafficAnalyticsReport = new TrafficAnalyticsReport(tab.url);
      this._trafficAnalyticsReport.setMessenger(this.getMessenger());
      this._trafficAnalyticsReport.init();
      this._tabs.getTab('traffic').content.appendChild(this._trafficAnalyticsReport.panel);
      this._panelMessage.hide();
      this._parametersPanel = new ParametersPanel(this._tabs.getTab('parameters').content, tab.url);
      this._parametersPanel.setMessenger(this.getMessenger());
      var panelConfiguration = extend(true, {}, configuration.panel, {
        mode: 1
      });
      this._parametersPanel.init(panelConfiguration);
      this._panelMode = configuration.panel.mode;
      if (configuration.core.disabled === false) {
        if (this._tabs.current === 'parameters' && configuration.panel.mode === 0) {
          this.loadParameters();
        }
        if (this._tabs.current === 'backlinks') {
          this._backlinksReport.process();
        } else if (this._tabs.current === 'traffic') {
          this._trafficAnalyticsReport.process();
        }
      }
      if (tab.status === 'complete') {
        this.stateDocumentReady();
      } else {
        this.stateWaitForDocumentReady(tab.id);
      }
      this.handleBodyContentChange();
    }
  }, {
    key: "handleTabSwitch",
    value: function handleTabSwitch(tabId) {
      var eventName = tabId;
      this.setConfigurationItem('panel.last_tab', tabId);
      if (this._coreDisabled === false) {
        if (tabId === 'parameters' && !this._parametersPanel.autoLoad) {
          this.loadParameters();
        }
        if (tabId === 'backlinks') {
          this._backlinksReport.process();
        } else if (tabId === 'traffic') {
          this._trafficAnalyticsReport.process();
          eventName = 'Traffic analytics';
        }
      }
      this.registerEvent('panel', 'Switch tab', eventName);
    }
  }, {
    key: "handleSemrushClick",
    value: function handleSemrushClick() {
      this.sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      }).then(this.processPanelHide)["catch"](ignore);
      this.registerEvent('panel', 'OAuth connect');
    }
  }, {
    key: "handlePanelHide",
    value: function handlePanelHide() {
      this.getMessenger().hidePanel();
    }
  }, {
    key: "handleBodyContentChange",
    value: function handleBodyContentChange() {
      if (document.body.offsetHeight !== this._oldBodyHeight) {
        this._oldBodyHeight = document.body.offsetHeight;
        this.resize(0, document.body.offsetHeight);
      }
    }
  }, {
    key: "handleChangelogClose",
    value: function handleChangelogClose() {
      dom.removeClass(this._mainMenu.container, 'new');
      dom.removeClass(this._mainMenu.body, 'with-changelog');
      this._changelog.remove();
      this._mainMenu.positionMenu();
    }
  }, {
    key: "handleModuleRun",
    value: function handleModuleRun(data) {
      this._panelModule = data;
      this.loadPageInfo().then(this.processPageData)["catch"](this.processNoPageInfo);
    }
  }, {
    key: "handlePageData",
    value: function handlePageData(pageData) {
      if (!isEmpty(pageData)) {
        this._moduleLinks.setBadge('internal', pageData.internal);
        this._moduleLinks.setBadge('external', pageData.external);
      } else {
        this.handleNoPageInfo();
      }
    }
  }, {
    key: "handleNoPageInfo",
    value: function handleNoPageInfo() {
      var _this7 = this;
      this.t('sqPanel_content_analysis_unavailable_message').then(function (text) {
        return _this7.stateDocumentTimeout(text);
      })["catch"](ignore);
    }
  }, {
    key: "handleChangelogAvailable",
    value: function handleChangelogAvailable() {
      dom.addClass(this._mainMenu.container, 'new');
      this._changelog.show();
      this._mainMenu.body.appendChild(this._changelog.element);
      dom.addClass(this._mainMenu.body, 'with-changelog');
      this._mainMenu.positionMenu();
      this._changelog.addEventListener('close', this.processChangelogClose);
    }
  }, {
    key: "handleGlobalSwitchClick",
    value: function handleGlobalSwitchClick() {
      this.getMessenger().toggleDisabledState('core', this.processDisabledState);
    }
  }, {
    key: "handleDisabledState",
    value: function handleDisabledState(disabled) {
      this._coreDisabled = disabled;
      this._mainMenu._setPluginMenuState('core', disabled);
      this._mainMenu._disablePluginItems(!disabled);
      this.showGlobalSwitchMessage(this.t('sqPanel_global_' + (disabled ? 'disabled' : 'enabled')));
      if (disabled) {
        this.stateCoreDisabled();
      } else {
        this.stateCoreEnabled();
      }
      this.registerEvent('panel', 'Toggle SEOquake', disabled ? 'off' : 'on');
      this.sendMessage('sq.updateConfiguration');
    }
  }, {
    key: "handleFeedbackLinkClick",
    value: function handleFeedbackLinkClick(event) {
      var _this8 = this;
      event.preventDefault();
      event.stopPropagation();
      this.getMessenger().openTab(event.target.href, function () {
        _this8.getMessenger().hidePanel();
      });
    }
  }]);
}();
PanelMain.prototype.MAX_ATTEMPTS = 3000;
messengerMixin(PanelMain.prototype);
messengerTranslateMixin(PanelMain.prototype);
module.exports = PanelMain;

},{"../../../common/dom/main":23,"../../../common/effects/HintBox":34,"../../../common/effects/InlineMenu":35,"../../../common/effects/TabsSwitch":38,"../../../common/effects/ToggleButton":39,"../../../common/lib/ignore":47,"../../../common/lib/isEmpty":50,"../../../common/utils/messengerMixin":67,"../../../common/utils/messengerTranslateMixin":68,"./ModuleLinks":74,"./PanelMenu":76,"./PanelMessage":77,"./ParametersPanel":80,"./backlinks/BacklinksReport":82,"./changelog/Panel":83,"./feedback/MilestoneSurveyPanel":86,"./feedback/Panel":87,"./feedback/SurveyPanel":90,"./ta/TrafficAnalyticsReport":91,"./tips/NoticePanel":92,"./tips/TipsPanel":93,"./ui/PanelLog":94,"extend":109}],76:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var MenuDropdown = require('../../../common/effects/MenuDropdown');
var dom = require('../../../common/dom/main');
var ignore = require('../../../common/lib/ignore');
var eventsMixin = require('../../../common/utils/eventsMixin');
var PanelMenu = function (_MenuDropdown) {
  function PanelMenu(container, config, client) {
    var _this;
    _classCallCheck(this, PanelMenu);
    config = config || {
      toggle: true,
      autoHide: false,
      positionCorrection: {
        left: -5,
        top: -3
      }
    };
    _this = _callSuper(this, PanelMenu, [container, config]);
    _this._client = client;
    _this._serpTitleElement = null;
    _this._pluginItems = [];
    return _this;
  }
  _inherits(PanelMenu, _MenuDropdown);
  return _createClass(PanelMenu, [{
    key: "t",
    value: function t(message) {
      var _this2 = this;
      return new Promise(function (resolve) {
        return _this2._client.t(message, resolve);
      });
    }
  }, {
    key: "createDefaultStructure",
    value: function createDefaultStructure() {
      var _this3 = this;
      this.addCheckableItem('core', 'Enable SEOquake').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'core');
        _this3._client.toggleDisabledState('core', function (disabled) {
          _this3._setPluginMenuState('core', disabled);
          _this3._client.sendMessage('sq.updateConfiguration');
          _this3._disablePluginItems(!disabled);
          if (disabled) {
            _this3.dispatchEvent('coreDisabled');
          } else {
            _this3.dispatchEvent('coreEnabled');
          }
        });
      });
      this.t('sqPanel_menu_enable').then(function (text) {
        return dom.text(_this3.getItem('core'), text);
      })["catch"](ignore);
      this.addSeparator();
      this.addCheckableItem('seobar', 'Show seobar').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'seobar');
        _this3._pluginToggleState('seobar');
      });
      this.t('sqPanel_menu_seobar').then(function (text) {
        return dom.text(_this3.getItem('seobar'), text);
      })["catch"](ignore);
      this.addCheckableItem('nofollow', 'Highlight no-follow').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'nofollow');
        _this3._pluginToggleState('nofollow');
      });
      this.t('sqPanel_menu_nofollow').then(function (text) {
        return dom.text(_this3.getItem('nofollow'), text);
      })["catch"](ignore);
      this.addSeparator();
      this._serpTitleElement = this.addText('Show SERP overlay:');
      this.t('sqPanel_menu_serpTitle').then(function (text) {
        return dom.text(_this3._serpTitleElement, text);
      })["catch"](ignore);
      this.addCheckableItem('google', 'Google').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'google');
        _this3._pluginToggleState('google');
      });
      this.addCheckableItem('yahoo', 'Yahoo').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'yahoo');
        _this3._pluginToggleState('yahoo');
      });
      this.addCheckableItem('bing', 'Bing').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'bing');
        _this3._pluginToggleState('bing');
      });
      this.addCheckableItem('yandex', 'Yandex').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'yandex');
        _this3._pluginToggleState('yandex');
      });
      this.addCheckableItem('semrush', 'SEMrush').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'pluginState', 'semrush');
        _this3._pluginToggleState('semrush');
      });
      this.addSeparator();
      this.addItem('options', 'Preferences...').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'options');
        _this3._client.openConfigurationWindow(_this3._client.hidePanel);
      });
      this.t('sqPanel_menu_preferences').then(function (text) {
        return dom.text(_this3.getItem('options'), text);
      })["catch"](ignore);
      this.addItem('about', 'About SEOquake').addEventListener('click', function () {
        _this3._client.registerEvent('panel', 'about');
        _this3._client.openTab('https://www.seoquake.com/', _this3._client.hidePanel);
      });
      this.t('sqPanel_menu_about').then(function (text) {
        return dom.text(_this3.getItem('about'), text);
      })["catch"](ignore);
      this._pluginItems = ['seobar', 'nofollow', 'google', 'yandex', 'yahoo', 'bing', 'semrush'];
    }
  }, {
    key: "addCheckableItem",
    value: function addCheckableItem(id, title) {
      var result = this.addItem(id, title);
      dom.addClass(result, 'checkable');
      return result;
    }
  }, {
    key: "_setPluginMenuState",
    value: function _setPluginMenuState(key, state, classValue) {
      classValue = classValue || 'checked';
      var item = this.getItem(key);
      if (state) {
        dom.removeClass(item, classValue);
      } else {
        dom.addClass(item, classValue);
      }
    }
  }, {
    key: "_pluginToggleState",
    value: function _pluginToggleState(key) {
      var _this4 = this;
      var item = this.getItem(key);
      if (dom.hasClass(item, 'disabled')) {
        return;
      }
      this._client.toggleDisabledState(key, function (disabled) {
        _this4._setPluginMenuState(key, disabled);
        _this4._client.sendMessage('sq.updateConfiguration');
      });
    }
  }, {
    key: "_disablePluginItems",
    value: function _disablePluginItems(state) {
      var _this5 = this;
      this._pluginItems.forEach(function (key) {
        return _this5._setPluginMenuState(key, state, 'disabled');
      });
    }
  }, {
    key: "updateState",
    value: function updateState(config) {
      var _this6 = this;
      this._setPluginMenuState('core', config.core.disabled);
      this._pluginItems.forEach(function (key) {
        return _this6._setPluginMenuState(key, config[key].disabled);
      });
      this._disablePluginItems(!config.core.disabled);
    }
  }, {
    key: "switchToMiniState",
    value: function switchToMiniState() {
      this._items.forEach(function (value, key) {
        if (['core', 'options'].indexOf(key) === -1) {
          dom.addClass(value, 'hidden');
        }
      });
      var changelog = this._body.querySelector('.changelog');
      if (changelog) {
        dom.addClass(changelog, 'hidden');
        dom.removeClass(this._body, 'with-changelog');
      }
      this.config.positionCorrection.top = -40;
      this.config.positionCorrection.left = -40;
      this.positionMenu();
    }
  }, {
    key: "switchToBigState",
    value: function switchToBigState() {
      this._items.forEach(function (item) {
        return dom.removeClass(item, 'hidden');
      });
      var changelog = this._body.querySelector('.changelog');
      if (changelog) {
        dom.removeClass(changelog, 'hidden');
        dom.addClass(this._body, 'with-changelog');
      }
      this.config.positionCorrection.top = 0;
      this.config.positionCorrection.left = 0;
      this.positionMenu();
    }
  }, {
    key: "show",
    value: function show() {
      _get(_getPrototypeOf(PanelMenu.prototype), "show", this).call(this);
      dom.addClass(this.container, 'active');
      this._client.registerEvent('panel', 'showMainMenu');
    }
  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(PanelMenu.prototype), "hide", this).call(this);
      dom.removeClass(this.container, 'active');
      this._client.registerEvent('panel', 'hideMainMenu');
    }
  }]);
}(MenuDropdown);
eventsMixin(PanelMenu.prototype);
module.exports = PanelMenu;

},{"../../../common/dom/main":23,"../../../common/effects/MenuDropdown":36,"../../../common/lib/ignore":47,"../../../common/utils/eventsMixin":65}],77:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../common/dom/main');
var eventsMixin = require('../../../common/utils/eventsMixin');
var ignore = require('../../../common/lib/ignore');
var PanelMessage = function () {
  function PanelMessage(client, selector, container) {
    _classCallCheck(this, PanelMessage);
    selector = selector || '#messagePanel';
    container = container || document.body;
    this._client = client;
    this._element = null;
    this._content = null;
    this._linkContainer = null;
    this._message = '';
    this._visible = false;
    this.element = container.querySelector(selector);
  }
  return _createClass(PanelMessage, [{
    key: "t",
    value: function t(message) {
      var _this = this;
      return new Promise(function (resolve) {
        return _this._client.t(message, resolve);
      });
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      var _this2 = this;
      if (!(value instanceof HTMLElement)) {
        throw new Error('Argument should be HTMLElement');
      }
      this._element = value;
      var contentElement = this._element.querySelector('.content');
      if (contentElement === null) {
        contentElement = dom('div', {
          className: 'content'
        });
        this._element.appendChild(contentElement);
      }
      this._content = contentElement;
      var linkElement = this._element.querySelector('.random-link');
      if (linkElement === null) {
        linkElement = dom('div', {
          className: 'random-link'
        }, 'Try this: ');
        this._element.appendChild(linkElement);
      }
      this._linkContainer = linkElement;
      this.t('sqPanel_try_this_link').then(function (text) {
        return dom.setText(_this2._linkContainer, text);
      })["catch"](ignore);
      if (!this._visible) {
        dom.addClass(this._element, 'hidden');
      }
    }
  }, {
    key: "message",
    get: function get() {
      return this._message;
    },
    set: function set(value) {
      this._message = value;
      this.update();
    }
  }, {
    key: "show",
    value: function show(message) {
      message = message || '';
      this._visible = true;
      if (message !== '') {
        this.message = message;
      } else {
        this.update();
      }
      dom.removeClass(this._element, 'hidden');
      dom.addClass(this._element, 'panel-visible');
      this.dispatchEvent('show');
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._visible) {
        return;
      }
      this._visible = false;
      dom.addClass(this._element, 'hidden');
      dom.removeClass(this._element, 'panel-visible');
      this.dispatchEvent('hide');
    }
  }, {
    key: "update",
    value: function update() {
      if (!this._visible) {
        return;
      }
      dom.text(this._content, this._message);
      this.fillRandomLink();
    }
  }, {
    key: "fillRandomLink",
    value: function fillRandomLink() {
      var _this3 = this;
      var url = PanelMessage.RANDOM_LINKS[Math.round(Math.random() * (PanelMessage.RANDOM_LINKS.length - 1))];
      var link = dom('a', {
        href: url[1]
      }, url[0]);
      link.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var link = event.currentTarget.getAttribute('href');
        _this3._client.registerEvent('randomLink', 'panel', link);
        _this3._client.openTab(link, _this3._client.hidePanel);
      });
      this._linkContainer.appendChild(link);
    }
  }]);
}();
eventsMixin(PanelMessage.prototype);
PanelMessage.RANDOM_LINKS = [['https://www.seoquake.com/', 'https://www.seoquake.com/'], ['https://www.semrush.com/', 'https://www.semrush.com/?utm_source=seoquake&utm_medium=toolbar&utm_campaign=regular&ref=174537735']];
module.exports = PanelMessage;

},{"../../../common/dom/main":23,"../../../common/lib/ignore":47,"../../../common/utils/eventsMixin":65}],78:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RenderObject = require('../../../common/utils/RenderObject').RenderObject;
var lib = require('../../../common/Lib');
var dom = require('../../../common/dom/main');
var textUtils = require('../../../common/dom/textUtils');
var normalizeNumber = require('../../../common/utils/normalizeNumber');
var HintBox = require('../../../common/effects/HintBox');
var messengerMixin = require('../../../common/utils/messengerMixin');
var ignore = require('../../../common/lib/ignore');
var ParameterItem = function () {
  function ParameterItem(parameter, url) {
    _classCallCheck(this, ParameterItem);
    this._parameter = parameter;
    this._url = url;
    this._value = null;
    this._element = null;
    this._visible = false;
    this._requestUrl = null;
    this._sourceUrl = null;
    this._naUrl = null;
    this._hintBox = null;
    this._errorCounter = 0;
    this._requestParameterListener = null;
    this._autoLoad = true;
    this._fitValue = false;
    this.processResultClick = this.handleResultClick.bind(this);
    this.init();
  }
  return _createClass(ParameterItem, [{
    key: "fitValue",
    get: function get() {
      return this._fitValue;
    },
    set: function set(value) {
      this._fitValue = value;
    }
  }, {
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
        target: '_blank'
      });
      if (!('matches' in this._parameter)) {
        dom.text(this._element, this._parameter.title);
      }
      this._visible = true;
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
      this.sendMessage('sq.requestParameter', {
        payload: {
          render: renderObject,
          onlyCache: !this._autoLoad
        }
      }).then(function (result) {
        _this.value = result.values[_this._parameter.id] || lib.SEOQUAKE_RESULT_QUESTION;
      })["catch"](ignore);
      if (this._autoLoad) {
        this.value = lib.SEOQUAKE_RESULT_WAIT;
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._visible) {
        return;
      }
      dom.removeClass(this._element, 'error');
      dom.removeClass(this._element, 'active');
      this._element.removeEventListener('click', ParameterItem.preventDefaultListener, true);
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
            this._element.addEventListener('click', ParameterItem.preventDefaultListener, true);
            this._element.addEventListener('click', this.requestParameterListener, true);
            this._value = lib.SEOQUAKE_RESULT_QUESTION;
          }
          dom.addClass(this._element, 'error');
          dom.text(this._element, 'error');
          break;
        case lib.SEOQUAKE_RESULT_QUESTION:
          this._element.href = '#';
          this._element.addEventListener('click', ParameterItem.preventDefaultListener, true);
          this._element.addEventListener('click', this.requestParameterListener, true);
          dom.setContent(this._element, dom('i', {
            className: 'icon load'
          }));
          break;
        case lib.SEOQUAKE_RESULT_WAIT:
          this._element.href = '#';
          this._element.addEventListener('click', ParameterItem.preventDefaultListener, true);
          dom.setContent(this._element, dom('i', {
            className: 'icon load'
          }));
          dom.addClass(this._element, 'active');
          break;
        case lib.SEOQUAKE_RESULT_YES:
        default:
          this._element.href = this.sourceUrl;
          this._element.addEventListener('click', this.processResultClick, true);
          this._renderValue(textUtils.decode(this._value));
      }
    }
  }, {
    key: "_renderValue",
    value: function _renderValue(text) {
      var display = normalizeNumber(text);
      if (display.number !== null && display.shortValue !== text) {
        text = display.shortValue;
        this._hintBox = new HintBox(this._element, {
          message: display.value,
          event: 'hover',
          inline: true
        });
      }
      if (this._fitValue) {
        dom.css(this._element, 'font-size', null);
        var resultWidth = textUtils.getTextSize(text, this._element);
        if (resultWidth > this._element.parentNode.clientWidth) {
          dom.css(this._element, 'font-size', '90%');
        }
      }
      dom.text(this._element, text);
    }
  }, {
    key: "requestParameterHandler",
    value: function requestParameterHandler(event) {
      event.preventDefault();
      this.loadData(true);
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
      if (this._hintBox !== null) {
        this._hintBox.remove();
        this._hintBox = null;
      }
      if (this._visible) {
        this._element.removeEventListener('click', ParameterItem.preventDefaultListener, true);
        this._element.removeEventListener('click', this.requestParameterListener, true);
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
    key: "handleResultClick",
    value: function handleResultClick(event) {
      var _this2 = this;
      event.preventDefault();
      event.stopPropagation();
      this.registerEvent('panel', 'showParameterSource', this._parameter.id);
      this.sendMessage('sq.openTab', this._element.href).then(function () {
        return _this2.sendMessage('sq.hidePanel');
      })["catch"](ignore);
    }
  }], [{
    key: "preventDefaultListener",
    value: function preventDefaultListener(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }]);
}();
messengerMixin(ParameterItem.prototype);
module.exports = ParameterItem;

},{"../../../common/Lib":6,"../../../common/dom/main":23,"../../../common/dom/textUtils":30,"../../../common/effects/HintBox":34,"../../../common/lib/ignore":47,"../../../common/utils/RenderObject":61,"../../../common/utils/messengerMixin":67,"../../../common/utils/normalizeNumber":69}],79:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../common/dom/main');
var isEmpty = require('../../../common/lib/isEmpty');
var lib = require('../../../common/Lib');
var ParameterItem = require('./ParameterItem');
var ColumnDisplay = require('../../../common/effects/ColumnDisplay');
var ParameterItemInline = require('./ui/ParameterItemInline');
var eventsMixin = require('../../../common/utils/eventsMixin');
var normalizeColumnsMixin = require('../../../common/effects/noramlizeColumnsMixin');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var ignore = require('../../../common/lib/ignore');
var ParametersList = function () {
  function ParametersList(parent) {
    _classCallCheck(this, ParametersList);
    this._owner = parent;
    this._element = null;
    this._parameters = [];
    this._parametersElements = new Map([['page', new ColumnDisplay('Page', 1)], ['domain', new ColumnDisplay('Domain', 1)], ['backlinks', new ColumnDisplay('Backlinks', 1)], ['other', new ColumnDisplay('Other', 1)]]);
    this._parametersItems = [];
    this._visible = false;
    this._autoLoad = true;
  }
  return _createClass(ParametersList, [{
    key: "autoLoad",
    get: function get() {
      return this._autoLoad;
    },
    set: function set(value) {
      this._autoLoad = value;
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      this._parametersItems.forEach(function (item) {
        return item.remove();
      });
      this._parametersItems = [];
      this._parameters.forEach(function (parameter) {
        var item = new ParameterItemInline(parameter, _this._owner.url);
        item.setMessenger(_this.getMessenger());
        item.autoLoad = _this.autoLoad;
        _this._parametersItems.push(item);
        if (_this._parametersElements.has(parameter.type)) {
          _this._parametersElements.get(parameter.type).addItem(item.container);
        }
      });
      var row = this.element.insertRow(-1);
      var columnsAvailable = [];
      this._parametersElements.forEach(function (column) {
        return column.sort(function (a, b) {
          return a.firstChild.tagName === 'A' ? 1 : 0;
        });
      });
      this._parametersElements.forEach(function (column) {
        return column.length > 0 ? columnsAvailable.push(column) : 0;
      });
      this._parametersElements.forEach(function (column, key) {
        return _this.t('sqSeobar2_parameters_group_' + key).then(function (text) {
          return column.title = text;
        })["catch"](ignore);
      });
      this.normalizeColumns(columnsAvailable).forEach(function (column) {
        return row.insertCell(-1).appendChild(column.element);
      });
      this.loadData(false);
      this._visible = true;
      this.dispatchEvent('render');
    }
  }, {
    key: "loadData",
    value: function loadData(force) {
      force = force !== false;
      this._parametersItems.forEach(function (item) {
        return item.loadData(force);
      });
    }
  }, {
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
        this._owner.element.appendChild(this._element);
      } else if (!(value instanceof HTMLTableElement)) {
        throw new Error('Value should be instance of HTMLElement');
      } else {
        this._element = value;
      }
    }
  }, {
    key: "visible",
    get: function get() {
      return this._visible;
    }
  }, {
    key: "hide",
    value: function hide() {
      dom.addClass(this.element, 'hidden');
    }
  }, {
    key: "show",
    value: function show() {
      dom.removeClass(this.element, 'hidden');
    }
  }, {
    key: "empty",
    value: function empty() {
      this._parameters = [];
    }
  }, {
    key: "addParameter",
    value: function addParameter(parameter) {
      this._parameters.push(parameter);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._visible) {
        this._parametersElements.forEach(function (column) {
          return column.remove();
        });
        delete this._parametersElements;
        dom.removeElement(this._element);
      }
      delete this._element;
      delete this._parameters;
      delete this._owner;
      delete this._client;
    }
  }]);
}();
normalizeColumnsMixin(ParametersList.prototype);
messengerMixin(ParametersList.prototype);
messengerTranslateMixin(ParametersList.prototype);
eventsMixin(ParametersList.prototype);
module.exports = ParametersList;

},{"../../../common/Lib":6,"../../../common/dom/main":23,"../../../common/effects/ColumnDisplay":31,"../../../common/effects/noramlizeColumnsMixin":40,"../../../common/lib/ignore":47,"../../../common/lib/isEmpty":50,"../../../common/utils/eventsMixin":65,"../../../common/utils/messengerMixin":67,"../../../common/utils/messengerTranslateMixin":68,"./ParameterItem":78,"./ui/ParameterItemInline":96}],80:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var lib = require('../../../common/Lib');
var dom = require('../../../common/dom/main');
var ParametersTop = require('./ParametersTop');
var ParametersList = require('./ParametersList');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var eventsMixin = require('../../../common/utils/eventsMixin');
var ignore = require('../../../common/lib/ignore');
var ParametersPanel = function () {
  function ParametersPanel(container, url, config) {
    _classCallCheck(this, ParametersPanel);
    this._config = extend(true, {}, ParametersPanel.DEFAULT_CONIG, config);
    this._url = null;
    this._configurationName = 'panel';
    this._configuration = {};
    this._parameters = {};
    this._element = container;
    this._topParameters = null;
    this._listParameters = null;
    this._autoLoad = true;
    this._autoLoadButton = null;
    this.url = url;
    this._processAutoLoadClick = this._handlerAutoLoadClick.bind(this);
  }
  return _createClass(ParametersPanel, [{
    key: "url",
    get: function get() {
      return this._url;
    },
    set: function set(value) {
      this._url = lib.parseUri(value);
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      this._element = value;
    }
  }, {
    key: "_updateTopParameters",
    value: function _updateTopParameters() {
      var _this = this;
      this._configuration.TOP_PARAMETERS.forEach(function (parameterId, index) {
        if (_this._parameters.hasOwnProperty(parameterId)) {
          _this.topParameters.setParameter(index, _this._parameters[parameterId]);
        }
      });
      this.topParameters.availableParameters = this.parameters.filter(function (parameter) {
        return !lib.isEmpty(parameter, 'matches');
      });
    }
  }, {
    key: "_updateListParameters",
    value: function _updateListParameters() {
      var _this2 = this;
      this._listParameters.empty();
      this.parameters.forEach(function (parameter) {
        return _this2._listParameters.addParameter(parameter);
      });
    }
  }, {
    key: "autoLoad",
    get: function get() {
      return this._autoLoad;
    },
    set: function set(value) {
      this._autoLoad = value;
      if (!this._autoLoad) {
        dom.removeClass(this._autoLoadButton, 'hidden');
      } else {
        dom.addClass(this._autoLoadButton, 'hidden');
      }
      this.topParameters.autoLoad = this._autoLoad;
      this.listParameters.autoLoad = this._autoLoad;
    }
  }, {
    key: "configuration",
    get: function get() {
      return this._configuration;
    },
    set: function set(value) {
      this._configuration = extend(true, {}, ParametersPanel.DEFAULT_CONFIGURATION, value);
      this._updateTopParameters();
      this.autoLoad = this._configuration.mode === lib.SEOQUAKE_MODE_ON_LOAD;
    }
  }, {
    key: "parameters",
    get: function get() {
      return lib.$A(this._parameters);
    },
    set: function set(value) {
      this._parameters = value;
      this._updateTopParameters();
      this._updateListParameters();
    }
  }, {
    key: "topParameters",
    get: function get() {
      return this._topParameters;
    }
  }, {
    key: "listParameters",
    get: function get() {
      return this._listParameters;
    }
  }, {
    key: "createTopParameters",
    value: function createTopParameters() {
      var top = new ParametersTop(this);
      top.setMessenger(this.getMessenger());
      return top;
    }
  }, {
    key: "createListParameters",
    value: function createListParameters() {
      var _this3 = this;
      var list = new ParametersList(this);
      list.setMessenger(this.getMessenger());
      list.addEventListener('render', function () {
        return _this3.dispatchEvent('render.parametersList');
      });
      return list;
    }
  }, {
    key: "createAutoLoadButton",
    value: function createAutoLoadButton() {
      var autoLoadButton = dom('button', {
        className: 'sqbtn sqbtn-small sqbtn-gray hidden'
      }, 'Load all parameters');
      autoLoadButton.addEventListener('click', this._processAutoLoadClick);
      return autoLoadButton;
    }
  }, {
    key: "init",
    value: function init(configuration) {
      var _this4 = this;
      this._topParameters = this.createTopParameters();
      this._listParameters = this.createListParameters();
      this._autoLoadButton = this.createAutoLoadButton();
      this._autoLoad = true;
      this.topParameters.element = this.element.querySelector(this._config.topParametersContainerSelector);
      this.listParameters.element = this.element.querySelector(this._config.parametersContainerSelector);
      this.element.appendChild(this._autoLoadButton);
      this.configuration = configuration;
      this.sendMessage('sq.getPluginParameters', {
        plugin: this._configurationName
      }).then(function (parameters) {
        _this4.parameters = parameters;
        _this4.topParameters.init();
        _this4.listParameters.init();
      })["catch"](ignore);
    }
  }, {
    key: "show",
    value: function show() {
      this.topParameters.show();
      this.listParameters.show();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.topParameters.hide();
      this.listParameters.hide();
    }
  }, {
    key: "remove",
    value: function remove() {
      this.topParameters.remove();
      this.listParameters.remove();
    }
  }, {
    key: "_handlerAutoLoadClick",
    value: function _handlerAutoLoadClick(event) {
      event.preventDefault();
      if (!this._autoLoad) {
        this.topParameters.loadData();
        this.listParameters.loadData();
        this.autoLoad = true;
      }
    }
  }]);
}();
messengerMixin(ParametersPanel.prototype);
messengerTranslateMixin(ParametersPanel.prototype);
eventsMixin(ParametersPanel.prototype);
ParametersPanel.DEFAULT_CONIG = {
  topParametersContainerSelector: '#parametersTableContainer',
  parametersContainerSelector: '#paramsPanel'
};
ParametersPanel.DEFAULT_CONFIGURATION = {
  TOP_PARAMETERS: ['31', '1', '20', '41', '32', '16'],
  mode: 0
};
module.exports = ParametersPanel;

},{"../../../common/Lib":6,"../../../common/dom/main":23,"../../../common/lib/ignore":47,"../../../common/utils/eventsMixin":65,"../../../common/utils/messengerMixin":67,"../../../common/utils/messengerTranslateMixin":68,"./ParametersList":79,"./ParametersTop":81,"extend":109}],81:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../common/dom/main');
var isEmpty = require('../../../common/lib/isEmpty');
var lib = require('../../../common/Lib');
var truncateToFit = require('../../../common/dom/textUtils').truncateToFit;
var ParameterItem = require('./ParameterItem');
var ParameterSelectMenu = require('./ui/ParameterSelectMenu');
var HintBox = require('../../../common/effects/HintBox');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var ignore = require('../../../common/lib/ignore');
var ParametersTop = function () {
  function ParametersTop(parent) {
    _classCallCheck(this, ParametersTop);
    this._owner = parent;
    this._element = null;
    this._availableParameters = null;
    this._parameters = [null, null, null, null, null, null];
    this._parametersItems = [null, null, null, null, null, null];
    this._menus = [null, null, null, null, null, null];
    this._hintBoxes = [];
    this._visible = false;
    this._autoLoad = true;
  }
  return _createClass(ParametersTop, [{
    key: "init",
    value: function init() {
      var _this = this;
      dom.emptyElement(this.element);
      var headersRow = this.element.insertRow(-1);
      var valuesRow = this.element.insertRow(-1);
      this._parameters.forEach(function (parameter, index) {
        headersRow.insertCell(-1);
        valuesRow.insertCell(-1);
        _this.updateCell(index);
      });
      this._visible = true;
    }
  }, {
    key: "loadData",
    value: function loadData() {
      this._parametersItems.forEach(function (item) {
        return item !== null ? item.loadData(true) : false;
      });
    }
  }, {
    key: "hideAllOpenMenus",
    value: function hideAllOpenMenus() {
      this._menus.forEach(function (menu) {
        return menu.hide();
      });
    }
  }, {
    key: "_createMenuItem",
    value: function _createMenuItem(container, index) {
      var _this2 = this;
      var parameter = this.getParameter(index);
      if (this._menus[index] !== null) {
        this._menus[index].remove();
      }
      var menuItem = new ParameterSelectMenu(container, this._availableParameters, parameter);
      menuItem.setMessenger(this.getMessenger());
      menuItem.addEventListener('beforeShow', function () {
        return _this2.hideAllOpenMenus();
      });
      menuItem.addEventListener('show', function () {
        return _this2.registerEvent('panel', 'showTopParameterSelect', index);
      });
      menuItem.addEventListener('itemSelected', function (parameter) {
        menuItem.hide();
        _this2.registerEvent('panel', 'selectTopParameter' + index, parameter.name);
        _this2.setParameter(index, parameter);
        _this2.saveParameters();
      });
      this._menus[index] = menuItem;
    }
  }, {
    key: "autoLoad",
    get: function get() {
      return this._autoLoad;
    },
    set: function set(value) {
      this._autoLoad = value;
      if (this._autoLoad) {
        this.loadData();
      }
    }
  }, {
    key: "availableParameters",
    get: function get() {
      return this._availableParameters;
    },
    set: function set(value) {
      this._availableParameters = value;
    }
  }, {
    key: "getParameter",
    value: function getParameter(index) {
      if (index < 0 || index > 5) {
        throw new Error('Position should be between 0 and 5');
      }
      return this._parameters[index];
    }
  }, {
    key: "createHeader",
    value: function createHeader(position) {
      var parameter = this.getParameter(position);
      var result = dom('div', {
        className: 'parameterTitleCell'
      });
      var text = 'no_title';
      if (parameter === null) {
        text = 'select';
      }
      if (!isEmpty(parameter, 'icon')) {
        var src = parameter.icon;
        var icon = null;
        if (src.startsWith('//') || src.startsWith('http://') || src.startsWith('https://')) {
          if (src.startsWith('//')) {
            src = 'http:' + src;
          }
          icon = dom('img', {
            src: src,
            className: 'parameterTitleIcon'
          });
        } else {
          icon = dom('span', {
            className: 'parameterTitleIcon sqicn sqicn-' + src
          });
        }
        if (icon !== null) {
          result.appendChild(icon);
        }
      }
      if (!isEmpty(parameter, 'panel-title')) {
        text = parameter['panel-title'];
      } else if (!isEmpty(parameter, 'name')) {
        text = parameter.name;
      }
      var textElement = dom('span', {
        className: 'parameterTitleText'
      });
      result.appendChild(textElement);
      if (text === 'select' || text === 'no_title') {
        this.t('sqPanel_top_' + text).then(function (msg) {
          return dom.text(textElement, msg);
        })["catch"](ignore);
      } else {
        var displayText = truncateToFit(text, 82, '...', textElement);
        if (displayText.length !== text.length) {
          this._hintBoxes.push(new HintBox(textElement, {
            message: text,
            event: 'hover',
            inline: true
          }));
        }
        dom.text(textElement, displayText);
      }
      this._createMenuItem(result, position);
      return result;
    }
  }, {
    key: "createData",
    value: function createData(position) {
      var result = dom('div', {
        className: 'parameterDataCell'
      });
      var parameter = this.getParameter(position);
      if (parameter !== null) {
        if (this._parametersItems[position] !== null) {
          this._parametersItems[position].remove();
        }
        this._parametersItems[position] = new ParameterItem(parameter, this._owner.url);
        this._parametersItems[position].setMessenger(this.getMessenger());
        this._parametersItems[position].fitValue = true;
        this._parametersItems[position].autoLoad = this.autoLoad;
        result.appendChild(this._parametersItems[position].element);
        this._parametersItems[position].loadData();
      }
      return result;
    }
  }, {
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
          className: 'topParametersTable'
        });
        var ownerElement = this._owner.element;
        if (ownerElement.children.length === 0) {
          ownerElement.appendChild(this._element);
        } else {
          ownerElement.insertBefore(this._element, ownerElement.firstChild);
        }
      } else if (!(value instanceof HTMLTableElement)) {
        throw new Error('Value should be instance of HTMLElement');
      } else {
        this._element = value;
      }
    }
  }, {
    key: "visible",
    get: function get() {
      return this._visible;
    }
  }, {
    key: "setParameter",
    value: function setParameter(position, parameter) {
      if (position < 0 || position > 5) {
        throw new Error('Position should be between 0 and 5');
      }
      if (isEmpty(parameter, 'matches') || isEmpty(parameter, 'url-r')) {
        throw new Error('Parameter should be processable');
      }
      this._parameters[position] = parameter;
      if (this.visible) {
        this.updateCell(position);
      }
    }
  }, {
    key: "updateCell",
    value: function updateCell(position) {
      if (position < 0 || position > 5) {
        throw new Error('Position should be between 0 and 5');
      }
      var cell = this.element.rows[0].cells[position];
      dom.setContent(cell, this.createHeader(position));
      cell = this.element.rows[1].cells[position];
      dom.setContent(cell, this.createData(position));
    }
  }, {
    key: "saveParameters",
    value: function saveParameters() {
      this.sendMessage('sq.setConfigurationItem', {
        name: 'panel.TOP_PARAMETERS',
        value: this._parameters.reduce(function (result, parameter) {
          return parameter !== null ? result.concat([parameter.id]) : result;
        }, [])
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      dom.addClass(this.element, 'hidden');
    }
  }, {
    key: "show",
    value: function show() {
      dom.removeClass(this.element, 'hidden');
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._visible) {
        this._hintBoxes.forEach(function (hintbox) {
          return hintbox.remove();
        });
        this._menus.forEach(function (menu) {
          return menu.remove();
        });
        this._parametersItems.forEach(function (parameter) {
          return parameter.remove();
        });
        delete this._menus;
        dom.removeElement(this._element);
      }
      delete this._element;
      delete this._owner;
      delete this._availableParameters;
    }
  }]);
}();
messengerMixin(ParametersTop.prototype);
messengerTranslateMixin(ParametersTop.prototype);
module.exports = ParametersTop;

},{"../../../common/Lib":6,"../../../common/dom/main":23,"../../../common/dom/textUtils":30,"../../../common/effects/HintBox":34,"../../../common/lib/ignore":47,"../../../common/lib/isEmpty":50,"../../../common/utils/messengerMixin":67,"../../../common/utils/messengerTranslateMixin":68,"./ParameterItem":78,"./ui/ParameterSelectMenu":98}],82:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var PanelReport = require('../ui/PanelReport');
var dom = require('../../../../common/dom/main');
var PillsSwitch = require('../../../../common/effects/PillsSwitch');
var ignore = require('../../../../common/lib/ignore');
var normalizeNumber = require('../../../../common/utils/normalizeNumber');
var BacklinksReport = function (_PanelReport) {
  function BacklinksReport(url, initialTab) {
    var _this;
    _classCallCheck(this, BacklinksReport);
    _this = _callSuper(this, BacklinksReport, [url]);
    _this._initialTab = initialTab || 'root_domain';
    _this._currentType = null;
    _this._currentTarget = null;
    _this._modeSwitch = null;
    _this._total = null;
    _this._totalMessage = null;
    _this._domains = null;
    _this._domainsMessage = null;
    _this._ips = null;
    _this._ipsMessage = null;
    _this._tldTitle = null;
    _this._tldDomains = null;
    _this._tldTable = null;
    _this._fullReportButton = null;
    _this._geoTitle = null;
    _this._geoDomains = null;
    _this._geoTable = null;
    _this.processTypeSwitch = _this.handleTypeSwitch.bind(_this);
    _this.processFullReportClick = _this.handleFullReportClick.bind(_this);
    return _this;
  }
  _inherits(BacklinksReport, _PanelReport);
  return _createClass(BacklinksReport, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(BacklinksReport.prototype), "init", this).call(this);
      this.initModeSwitch();
      this._panel.appendChild(this._modeSwitch.element);
      this.initTotalText();
      this.initDomainsText();
      this.initIPsText();
      var columns = dom('div', {
        className: 'b-c'
      });
      var left = dom('div', {
        className: 'b-cl'
      });
      left.appendChild(this._total);
      left.appendChild(this._totalMessage);
      left.appendChild(this._domains);
      left.appendChild(this._domainsMessage);
      left.appendChild(this._ips);
      left.appendChild(this._ipsMessage);
      columns.appendChild(left);
      var tldRows = [];
      for (var i = 0; i < 5; i++) {
        var link = dom('a', {}, '...');
        link.addEventListener('click', this.processLinkClick);
        tldRows.push(dom('tr', {}, [dom('td'), dom('td'), dom('td', {}, link)]));
      }
      var middle = dom('div', {
        className: 'b-cm'
      });
      this._tldTitle = dom('th', {
        className: 'b-t_h',
        colspan: 2
      }, 'TLD Distribution');
      this._tldDomains = dom('th', {
        className: 'b-t_h'
      }, 'Domains');
      this._tldTable = dom('table', {
        className: 'b-t'
      }, [dom('thead', {}, dom('tr', {}, [this._tldTitle, this._tldDomains])), dom('tbody', {}, tldRows)]);
      this._fullReportButton = dom('button', {
        className: 'sqseobar2-button'
      }, 'View full report');
      this._fullReportButton.addEventListener('click', this.processFullReportClick, true);
      middle.appendChild(this._tldTable);
      middle.appendChild(this._fullReportButton);
      columns.appendChild(middle);
      this.initGeoTable();
      columns.appendChild(dom('div', {
        className: 'b-cr'
      }, this._geoTable));
      this._panel.appendChild(columns);
      dom.removeElement(this._messageEmpty);
      this._messageEmpty = dom('div', {
        className: 'b-m_e hidden'
      }, [dom('h3'), dom('p'), dom('ol', {}, [dom('li'), dom('li'), dom('li')])]);
      this._panel.appendChild(this._messageEmpty);
      this.translate();
    }
  }, {
    key: "initModeSwitch",
    value: function initModeSwitch() {
      this._modeSwitch = new PillsSwitch();
      this._modeSwitch.title = 'Report scope: ';
      this._modeSwitch.setItem('url', 'URL');
      this._modeSwitch.setItem('domain', 'Domain');
      this._modeSwitch.setItem('root_domain', 'Root domain');
      this._modeSwitch.currentItem = this._initialTab;
      this._modeSwitch.addEventListener('switched', this.processTypeSwitch);
    }
  }, {
    key: "initTotalText",
    value: function initTotalText() {
      this._total = dom('a', {
        className: 'b-cl_v'
      }, '0');
      this._total.addEventListener('click', this.processLinkClick);
      this._totalMessage = dom('div', {
        className: 'b-cl_m'
      }, 'Total backlinks');
    }
  }, {
    key: "initDomainsText",
    value: function initDomainsText() {
      this._domains = dom('a', {
        className: 'b-cl_v'
      }, '0');
      this._domains.addEventListener('click', this.processLinkClick);
      this._domainsMessage = dom('div', {
        className: 'b-cl_m'
      }, 'Referring domains');
    }
  }, {
    key: "initIPsText",
    value: function initIPsText() {
      this._ips = dom('a', {
        className: 'b-cl_v'
      }, '0');
      this._ips.addEventListener('click', this.processLinkClick);
      this._ipsMessage = dom('div', {
        className: 'b-cl_m'
      }, 'Referring IPs');
    }
  }, {
    key: "initGeoTable",
    value: function initGeoTable() {
      var geoRows = [];
      for (var i = 0; i < 5; i++) {
        var link = dom('a', {}, '...');
        link.addEventListener('click', this.processLinkClick);
        geoRows.push(dom('tr', {}, [dom('td'), dom('td'), dom('td', {}, link)]));
      }
      this._geoTitle = dom('th', {
        className: 'b-t_h'
      }, 'Country');
      this._geoDomains = dom('th', {
        className: 'b-t_h',
        colSpan: 2
      }, 'Domains');
      this._geoTable = dom('table', {
        className: 'b-t'
      }, [dom('thead', {}, dom('tr', {}, [this._geoTitle, this._geoDomains])), dom('tbody', {}, geoRows)]);
    }
  }, {
    key: "translate",
    value: function translate() {
      var _this2 = this;
      Promise.all([this.t('sqPanel_backlinks_scope'), this.t('sqPanel_backlinks_url'), this.t('sqPanel_backlinks_domain'), this.t('sqPanel_backlinks_root_domain'), this.t('sqPanel_backlinks_referring_total'), this.t('sqPanel_backlinks_referring_domains'), this.t('sqPanel_backlinks_referring_ips'), this.t('sqPanel_backlinks_tld_title'), this.t('sqPanel_backlinks_tld_domains'), this.t('sqPanel_backlinks_geo_title'), this.t('sqPanel_backlinks_geo_domains'), this.t('sqPanel_backlinks_full_report')]).then(function (msgs) {
        _this2._modeSwitch.title = msgs[0];
        _this2._modeSwitch.setItem('url', msgs[1]);
        _this2._modeSwitch.setItem('domain', msgs[2]);
        _this2._modeSwitch.setItem('root_domain', msgs[3]);
        dom.text(_this2._totalMessage, msgs[4]);
        dom.text(_this2._domainsMessage, msgs[5]);
        dom.text(_this2._ipsMessage, msgs[6]);
        dom.text(_this2._tldTitle, msgs[7]);
        dom.text(_this2._tldDomains, msgs[8]);
        dom.text(_this2._geoTitle, msgs[9]);
        dom.text(_this2._geoDomains, msgs[10]);
        dom.text(_this2._fullReportButton, msgs[11]);
      })["catch"](ignore);
      Promise.all([this.t('sqPanel_backlinks_empty_header'), this.t('sqPanel_backlinks_empty_message'), this.t('sqPanel_backlinks_empty_reason1'), this.t('sqPanel_backlinks_empty_reason2'), this.t('sqPanel_backlinks_empty_reason3')]).then(function (msgs) {
        dom.text(_this2._messageEmpty.querySelector('h3'), msgs[0]);
        dom.text(_this2._messageEmpty.querySelector('p'), msgs[1]);
        dom.text(_this2._messageEmpty.querySelector('li:nth-child(1)'), msgs[2]);
        dom.text(_this2._messageEmpty.querySelector('li:nth-child(2)'), msgs[3]);
        dom.text(_this2._messageEmpty.querySelector('li:nth-child(3)'), msgs[4]);
      })["catch"](ignore);
      Promise.all([this.t('sqPanel_backlinks_semrush_link'), this.t('sqPanel_backlinks_semrush_text')]).then(function (msgs) {
        dom.text(_this2._connectLink, msgs[0]);
        dom.setText(_this2._messagePanel.lastChild, msgs[1]);
      })["catch"](ignore);
    }
  }, {
    key: "fillTldTable",
    value: function fillTldTable(data) {
      var tbody = this._tldTable.querySelector('tbody');
      var linkTemplate = this.getTLDHref();
      if (!data.hasOwnProperty('zones') || data.zones === null) {
        for (var i = 0; i < 5; i++) {
          var row = tbody.rows[i];
          dom.text(row.cells[0], '...');
          dom.setContent(row.cells[1], BacklinksReport.percentBar(0));
          dom.text(row.cells[2].firstChild, '...');
          dom.attr(row.cells[2].firstChild, 'href', null);
        }
        return;
      }
      var zones = [];
      for (var key in data.zones) {
        if (data.zones.hasOwnProperty(key)) {
          zones.push([key, data.zones[key]]);
        }
      }
      zones.sort(function (a, b) {
        if (a[0] === 'edu' || b[0] === 'edu' || a[0] === 'gov' || b[0] === 'gov') {
          if (b[0] === 'edu' && a[0] === 'gov') {
            return -1;
          } else {
            return 1;
          }
        } else {
          if (a[1] > b[1]) {
            return -1;
          } else if (a[1] < b[1]) {
            return 1;
          }
        }
        return 0;
      });
      zones.forEach(function (value, index) {
        var row = tbody.rows[index];
        dom.text(row.cells[0], '.' + value[0]);
        dom.text(row.cells[2].firstChild, Number(value[1]).toLocaleString(undefined, {
          useGrouping: true
        }));
        dom.attr(row.cells[2].firstChild, 'href', linkTemplate.replace('{tld}', encodeURIComponent(value[0])));
        var percent;
        if (data.domains) {
          percent = (value[1] / data.domains * 100).toFixed(0);
        } else {
          percent = '0';
        }
        dom.setContent(row.cells[1], BacklinksReport.percentBar(percent));
      });
      if (zones.length < 5) {
        for (var _i2 = zones.length; _i2 < 5; _i2++) {
          var _row = tbody.rows[_i2];
          dom.text(_row.cells[0], '...');
          dom.setContent(_row.cells[1], BacklinksReport.percentBar(0));
          dom.text(_row.cells[2].firstChild, '...');
          dom.attr(_row.cells[2].firstChild, 'href', null);
        }
      }
    }
  }, {
    key: "fillGeoDomainsTable",
    value: function fillGeoDomainsTable(data) {
      var _this3 = this;
      var tbody = this._geoTable.querySelector('tbody');
      var linkTemplate = this.getCountryHref();
      if (!data.hasOwnProperty('geodomains') || data.geodomains === null) {
        for (var i = 0; i < 5; i++) {
          var row = tbody.rows[i];
          dom.text(row.cells[0], '...');
          dom.text(row.cells[1].firstChild, '...');
          dom.text(row.cells[2].firstChild, '...');
          dom.attr(row.cells[2].firstChild, 'href', null);
        }
        return;
      }
      var zones = [];
      for (var key in data.geodomains) {
        if (data.geodomains.hasOwnProperty(key)) {
          zones.push([key, data.geodomains[key]]);
        }
      }
      zones.sort(function (a, b) {
        if (a[1] > b[1]) {
          return -1;
        } else if (a[1] < b[1]) {
          return 1;
        }
        return 0;
      });
      var translates = [];
      zones.forEach(function (item) {
        return translates.push(_this3.t('sqCountry_' + item[0]));
      });
      Promise.all(translates).then(function (titles) {
        zones.forEach(function (value, index) {
          var row = tbody.rows[index];
          dom.text(row.cells[0], titles[index]);
          dom.text(row.cells[1], Math.round(Number(value[1]) / data.domains * 100) + '%');
          dom.text(row.cells[2].firstChild, Number(value[1]).toLocaleString(undefined, {
            useGrouping: true
          }));
          dom.attr(row.cells[2].firstChild, 'href', linkTemplate.replace('{countrycode}', encodeURIComponent(value[0])));
        });
        BacklinksReport.fillEnd(tbody, zones);
      })["catch"](function () {
        zones.forEach(function (value, index) {
          var row = tbody.rows[index];
          dom.text(row.cells[0], value[0]);
          dom.text(row.cells[1], Math.round(Number(value[1]) / data.domains * 100) + '%');
          dom.text(row.cells[2].firstChild, Number(value[1]).toLocaleString(undefined, {
            useGrouping: true
          }));
          dom.attr(row.cells[2].firstChild, 'href', linkTemplate.replace('{countrycode}', encodeURIComponent(value[0])));
        });
        BacklinksReport.fillEnd(tbody, zones);
      });
    }
  }, {
    key: "replaceURLPlaceholders",
    value: function replaceURLPlaceholders(line) {
      var _this4 = this;
      return line.replace(/{(\w+)}/g, function (i, code) {
        switch (code) {
          case 'domain':
            return encodeURIComponent(_this4._currentTarget);
          case 'type':
            return encodeURIComponent(_this4._currentType);
          case 'tld':
            return '{tld}';
          case 'countrycode':
            return '{countrycode}';
          default:
            return '';
        }
      });
    }
  }, {
    key: "getTotalHref",
    value: function getTotalHref() {
      return this.replaceURLPlaceholders(BacklinksReport.TOTAL_BACKLINKS_URL);
    }
  }, {
    key: "getDomainsHref",
    value: function getDomainsHref() {
      return this.replaceURLPlaceholders(BacklinksReport.REFERRING_DOMAINS_URL);
    }
  }, {
    key: "getIPsHref",
    value: function getIPsHref() {
      return this.replaceURLPlaceholders(BacklinksReport.REFERRING_IPS_URL);
    }
  }, {
    key: "getTLDHref",
    value: function getTLDHref() {
      return this.replaceURLPlaceholders(BacklinksReport.TLD_DISTRIBUTION_URL);
    }
  }, {
    key: "getCountryHref",
    value: function getCountryHref() {
      return this.replaceURLPlaceholders(BacklinksReport.COUNTRY_DISTRIBUTION_URL);
    }
  }, {
    key: "process",
    value: function process() {
      if (this._currentType === null) {
        this.handleTypeSwitch(this._modeSwitch.currentItem);
      }
    }
  }, {
    key: "loadUrlBacklinks",
    value: function loadUrlBacklinks() {
      this._currentType = 'url';
      this._currentTarget = this._url;
      this.stateLoading();
      this._api.getBacklinks('url', this._url).then(this.processDataReady)["catch"](this.processRequestError);
      this.registerEvent('panel', 'Backlink tab', 'Switch to Url');
    }
  }, {
    key: "loadSubdomainBacklinks",
    value: function loadSubdomainBacklinks() {
      this._currentType = 'domain';
      this._currentTarget = this._urlData.domain;
      this.stateLoading();
      this._api.getBacklinks('domain', this._urlData.domain).then(this.processDataReady)["catch"](this.processRequestError);
      this.registerEvent('panel', 'Backlink tab', 'Switch to Domain');
    }
  }, {
    key: "loadRootdomainBacklinks",
    value: function loadRootdomainBacklinks() {
      this._currentType = 'root_domain';
      this._currentTarget = this._urlData.domain;
      this.stateLoading();
      this._api.getBacklinks('root_domain', this._urlData.domain).then(this.processDataReady)["catch"](this.processRequestError);
      this.registerEvent('panel', 'Backlink tab', 'Switch to Root domain');
    }
  }, {
    key: "stateEmpty",
    value: function stateEmpty() {
      _get(_getPrototypeOf(BacklinksReport.prototype), "stateEmpty", this).call(this);
      this._modeSwitch.disabled = false;
    }
  }, {
    key: "stateLoading",
    value: function stateLoading() {
      _get(_getPrototypeOf(BacklinksReport.prototype), "stateLoading", this).call(this);
      this._modeSwitch.disabled = true;
    }
  }, {
    key: "stateConnect",
    value: function stateConnect() {
      var _this5 = this;
      _get(_getPrototypeOf(BacklinksReport.prototype), "stateConnect", this).call(this);
      this._modeSwitch.disabled = true;
      this.t('sqPanel_backlinks_connect_message').then(function (msg) {
        return dom.setContent(_this5._messageBox, dom.parse(msg));
      })["catch"](ignore);
    }
  }, {
    key: "stateError",
    value: function stateError(message) {
      _get(_getPrototypeOf(BacklinksReport.prototype), "stateError", this).call(this, message);
      this._modeSwitch.disabled = true;
    }
  }, {
    key: "stateData",
    value: function stateData(data) {
      _get(_getPrototypeOf(BacklinksReport.prototype), "stateData", this).call(this, data);
      this._modeSwitch.disabled = false;
      dom.text(this._total, normalizeNumber(data.total).shortValue);
      dom.attr(this._total, 'href', this.getTotalHref());
      dom.text(this._domains, normalizeNumber(data.domains).shortValue);
      dom.attr(this._domains, 'href', this.getDomainsHref());
      dom.text(this._ips, normalizeNumber(data.ip).shortValue);
      dom.attr(this._ips, 'href', this.getIPsHref());
      if (data.total === '0' || data.total === 0) {
        this.stateEmpty();
      } else {
        this.fillTldTable(data);
        this.fillGeoDomainsTable(data);
      }
    }
  }, {
    key: "handleConnectClick",
    value: function handleConnectClick(event) {
      this.registerEvent('panel', 'Backlinks connect SEMrush');
      _get(_getPrototypeOf(BacklinksReport.prototype), "handleConnectClick", this).call(this, event);
    }
  }, {
    key: "handleTypeSwitch",
    value: function handleTypeSwitch(newId) {
      switch (newId) {
        case 'url':
          this.loadUrlBacklinks();
          break;
        case 'domain':
          this.loadSubdomainBacklinks();
          break;
        case 'root_domain':
          this.loadRootdomainBacklinks();
          break;
        default:
          return;
      }
      this.setConfigurationItem('panel.backlinks_tab', newId)["catch"](ignore);
    }
  }, {
    key: "handleFullReportClick",
    value: function handleFullReportClick(event) {
      event.preventDefault();
      event.stopPropagation();
      var url = BacklinksReport.REPORT_URL.replace('{type}', this._currentType).replace('{target}', encodeURIComponent(this._currentTarget));
      this.sendMessage('sq.openTab', url).then(this.processHidePanel)["catch"](ignore);
    }
  }], [{
    key: "percentBar",
    value: function percentBar(progress) {
      return dom('div', {
        className: 'b-t_p'
      }, dom('div', {
        className: 'b-t_pv',
        style: 'width:' + progress + '%'
      }));
    }
  }, {
    key: "fillEnd",
    value: function fillEnd(tbody, zones) {
      if (zones.length < 5) {
        for (var i = zones.length; i < 5; i++) {
          var row = tbody.rows[i];
          dom.text(row.cells[0], '...');
          dom.text(row.cells[1].firstChild, '');
          dom.text(row.cells[2].firstChild, '...');
          dom.attr(row.cells[2].firstChild, 'href', null);
        }
      }
    }
  }]);
}(PanelReport);
BacklinksReport.REPORT_URL = 'https://www.semrush.com/analytics/backlinks/overview/?q={target}&searchType={type}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.TOTAL_BACKLINKS_URL = 'https://www.semrush.com/analytics/backlinks/backlinks/?q={domain}&searchType={type}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.REFERRING_DOMAINS_URL = 'https://www.semrush.com/analytics/backlinks/refdomains/?q={domain}&searchType={type}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.REFERRING_IPS_URL = 'https://www.semrush.com/analytics/backlinks/refips/?q={domain}&searchType={type}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.TLD_DISTRIBUTION_URL = 'https://www.semrush.com/analytics/backlinks/refdomains/?q={domain}&searchType={type}&filter=%2B%7Czone%7C%7C{tld}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.COUNTRY_DISTRIBUTION_URL = 'https://www.semrush.com/analytics/backlinks/refdomains/?q={domain}&searchType={type}&filter=%2B%7Ccountry%7C%7C{countrycode}&utm_source=seoquake&utm_medium=dashboard&utm_campaign=backlinks&ref=174537735';
BacklinksReport.prototype.PANEL_CLASS = 'backlinks';
BacklinksReport.prototype.LANDING_URL = 'https://www.semrush.com/lp/sem/en/?utm_source=seoquake&utm_medium=dashboard&utm_campaign=connect_semrush&ref=174537735';
module.exports = BacklinksReport;

},{"../../../../common/dom/main":23,"../../../../common/effects/PillsSwitch":37,"../../../../common/lib/ignore":47,"../../../../common/utils/normalizeNumber":69,"../ui/PanelReport":95}],83:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var Container = require('../../../../common/dom/Container');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var versionCompare = require('../../../../common/lib/versionCompare');
var dom = require('../../../../common/dom/main');
var ignore = require('../../../../common/lib/ignore');
var Panel = function (_Container) {
  function Panel() {
    var _this;
    _classCallCheck(this, Panel);
    _this = _callSuper(this, Panel);
    _this._element = dom('div', {
      className: 'changelog'
    });
    return _this;
  }
  _inherits(Panel, _Container);
  return _createClass(Panel, [{
    key: "isAvailable",
    get: function get() {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2.sendMessage('sq.getConfigurationItem', 'core.changelog_shown').then(function (result) {
          if (versionCompare(result, '3.13.4') !== 1) {
            throw new Error('Already shown');
          }
          resolve(true);
        })["catch"](function (reason) {
          return reject(reason);
        });
      });
    }
  }, {
    key: "closeHandler",
    value: function closeHandler() {
      var _this3 = this;
      this.registerEvent('panel', 'changelogClosed');
      this.sendMessage('sq.setConfigurationItem', {
        name: 'core.changelog_shown',
        value: '3.13.4'
      }).then(function () {
        _this3.hide();
        _this3.dispatchEvent('close');
      })["catch"](ignore);
    }
  }, {
    key: "addChangeHeader",
    value: function addChangeHeader(text) {
      this._elements.get('list').appendChild(dom('h3', text));
    }
  }, {
    key: "addChangeLine",
    value: function addChangeLine(text) {
      this._elements.get('list').appendChild(dom('p', {
        className: 'line'
      }, text));
    }
  }, {
    key: "addChangeNew",
    value: function addChangeNew(text) {
      this._elements.get('list').appendChild(dom('p', {
        className: 'new'
      }, text));
    }
  }, {
    key: "addChangeFix",
    value: function addChangeFix(text) {
      this._elements.get('list').appendChild(dom('p', {
        className: 'fix'
      }, text));
    }
  }, {
    key: "addChangelog",
    value: function addChangelog() {
      var _this4 = this;
      var texts = [];
      texts.push(this.t('sqChangelog_title'));
      Promise.all(texts).then(function (lines) {
        lines[0] = lines[0].replace('{version}', '3.13.4').replace('{date}', '1/26/2026');
        _this4.addChangeHeader(lines[0]);
        _this4.addChangeNew('Some internal updates');
        _this4.element.appendChild(_this4._elements.get('list'));
        _this4.element.appendChild(_this4._elements.get('buttonPanel'));
        _this4._elements.get('buttonPanel').appendChild(_this4._elements.get('close'));
      })["catch"](ignore);
    }
  }, {
    key: "show",
    value: function show() {
      var _this5 = this;
      this._elements.set('list', dom('div', {
        className: 'changelog-list'
      }));
      this._elements.set('buttonPanel', dom('div', {
        className: 'buttons'
      }));
      this._elements.set('close', dom('button', {
        className: 'sqbtn sqbtn-small sqbtn-gray'
      }, 'Ok, I got it'));
      this._elements.get('close').addEventListener('click', this.closeHandler.bind(this));
      this.t('sqChangelog_close').then(function (msg) {
        return dom.text(_this5._elements.get('close'), msg);
      })["catch"](ignore);
      this.addChangelog();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.removeElements();
    }
  }]);
}(Container);
messengerMixin(Panel.prototype);
messengerTranslateMixin(Panel.prototype);
module.exports = Panel;

},{"../../../../common/dom/Container":9,"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/lib/versionCompare":59,"../../../../common/utils/messengerMixin":67,"../../../../common/utils/messengerTranslateMixin":68}],84:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var dom = require('../../../../common/dom/main');
var Container = require('../../../../common/dom/Container');
var ignore = require('../../../../common/lib/ignore');
var extend = require('extend');
var ErrorPanel = function (_Container) {
  function ErrorPanel() {
    var _this;
    _classCallCheck(this, ErrorPanel);
    _this = _callSuper(this, ErrorPanel);
    _this._config = extend(true, ErrorPanel.DEFAULT_CONFIG, {});
    _this._element = dom('div', {
      className: 'error box'
    });
    return _this;
  }
  _inherits(ErrorPanel, _Container);
  return _createClass(ErrorPanel, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.els.set('header', dom('h2', 'Oops! Something happened'));
      this.t('sqPanel_feedback_error_title').then(function (text) {
        return _this2.setElsText('header', text);
      })["catch"](ignore);
      this.els.set('text', dom('div', {
        className: 'text'
      }, ' '));
      this.t('sqPanel_feedback_error_message').then(function (text) {
        return _this2.setElsText('text', text);
      })["catch"](ignore);
      this.els.set('image', dom('div', {
        className: 'image'
      }));
      this.els.set('buttonPanel', dom.createElement('div', {
        className: 'button-panel'
      }));
      this.els.set('back', dom('button', {
        className: 'sqbtn sqbtn-small sqbtn-green'
      }, 'Try again'));
      this.t('sqPanel_feedback_error_tryagain').then(function (text) {
        return _this2.setElsText('back', text);
      })["catch"](ignore);
      this.els.set('close', dom('button', {
        className: 'sqbtn sqbtn-small sqbtn-gray sqbtn-transparent'
      }, 'Close'));
      this.t('sqPanel_feedback_error_close').then(function (text) {
        return _this2.setElsText('close', text);
      })["catch"](ignore);
      this.els.set('link', dom('a', {
        href: '#',
        className: this._config.storeIcon
      }, this._config.storeLink));
      this.els.get('text').appendChild(this.els.get('link'));
      dom.chain(this._element).appendChild(this.els.get('header')).appendChild(this.els.get('image')).appendChild(this.els.get('text')).appendChild(dom.chain(this.els.get('buttonPanel')).appendChild(this.els.get('back')).appendChild(this.els.get('close')).element);
      this.els.get('close').addEventListener('click', function () {
        return _this2.dispatchEvent('close');
      });
      this.els.get('back').addEventListener('click', function () {
        return _this2.dispatchEvent('back');
      });
      this.els.get('link').addEventListener('click', function () {
        return _this2.dispatchEvent('link');
      });
    }
  }]);
}(Container);
ErrorPanel.DEFAULT_CONFIG = {
  storeIcon: 'chrome-icon',
  storeLink: 'Chrome Store'
};
module.exports = ErrorPanel;

},{"../../../../common/dom/Container":9,"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"extend":109}],85:[function(require,module,exports){
'use strict';
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var dom = require('../../../../common/dom/main');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var extend = require('extend');
var Container = require('../../../../common/dom/Container');
var Sending = require('./Sending');
var Success = require('./Success');
var ErrorPanel = require('./Error');
var ignore = require('../../../../common/lib/ignore');
var Form = function (_Container) {
  function Form(config) {
    var _this;
    _classCallCheck(this, Form);
    _this = _callSuper(this, Form);
    _this._config = extend(true, {}, Form.DEFAULT_CONFIG, config);
    _this._panels = new Map();
    _this._email = '';
    _this._text = '';
    return _this;
  }
  _inherits(Form, _Container);
  return _createClass(Form, [{
    key: "submitDisabled",
    get: function get() {
      return this._elements.get('submit').getAttribute('disabled') === 'true';
    },
    set: function set(value) {
      if (value === true) {
        this._elements.get('submit').setAttribute('disabled', true);
      } else {
        this._elements.get('submit').removeAttribute('disabled');
      }
    }
  }, {
    key: "textDisabled",
    get: function get() {
      return this._elements.get('text').getAttribute('disabled') === 'true';
    },
    set: function set(value) {
      if (value === true) {
        this._elements.get('text').setAttribute('disabled', true);
      } else {
        this._elements.get('text').removeAttribute('disabled');
      }
    }
  }, {
    key: "emailDisabled",
    get: function get() {
      return this._elements.get('email').getAttribute('disabled') === 'true';
    },
    set: function set(value) {
      if (value === true) {
        this._elements.get('email').setAttribute('disabled', true);
      } else {
        this._elements.get('email').removeAttribute('disabled');
      }
    }
  }, {
    key: "disabled",
    get: function get() {
      return this.submitDisabled && this.emailDisabled && this.textDisabled;
    },
    set: function set(value) {
      this.textDisabled = value;
      this.emailDisabled = value;
      if (value) {
        this.submitDisabled = true;
      } else {
        this.updateHandler();
      }
    }
  }, {
    key: "email",
    get: function get() {
      this._email = dom.value(this._elements.get('email')) || '';
      return this._email;
    },
    set: function set(value) {
      if (value === undefined) {
        value = '';
      }
      this._email = value;
      dom.value(this._elements.get('email'), this._email);
      this.updateHandler();
    }
  }, {
    key: "text",
    get: function get() {
      this._text = dom.value(this._elements.get('text')) || '';
      return this._text;
    },
    set: function set(value) {
      if (value === undefined) {
        value = '';
      }
      this._text = value;
      dom.value(this._elements.get('text'), this._text);
      this.updateHandler();
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      this._element = dom('div', {
        className: this._config.panelClass
      });
      this.els.set('container', dom('div', {
        className: 'box'
      }));
      this.els.set('header', dom('h2', 'Tell us about SEOquake'));
      this.t('sqPanel_feedback_form_title').then(function (text) {
        return dom.text(_this2.els.get('header'), text);
      })["catch"](ignore);
      this.els.set('email', dom('input', {
        type: 'text',
        placeholder: 'Email'
      }));
      this.t('sqPanel_feedback_form_email_placeholder').then(function (text) {
        return dom.attr(_this2.els.get('email'), 'placeholder', text);
      })["catch"](ignore);
      this.els.set('text', dom('textarea', {
        placeholder: 'I just want to say...'
      }));
      this.t('sqPanel_feedback_form_text_placeholder').then(function (text) {
        return dom.attr(_this2.els.get('text'), 'placeholder', text);
      })["catch"](ignore);
      this.els.set('close', dom('button', {
        className: 'close-button'
      }));
      this.els.set('buttonPanel', dom('div', {
        className: 'button-panel'
      }));
      this.els.set('cancel', dom('button', {
        className: this._config.buttonsPrefix
      }, 'Close'));
      this.t('sqPanel_feedback_form_cancel_title').then(function (text) {
        return dom.text(_this2.els.get('cancel'), text);
      })["catch"](ignore);
      this.els.set('submit', dom('button', {
        className: this._config.buttonsPrefix
      }, 'Suggest!'));
      this.t('sqPanel_feedback_form_submit_title').then(function (text) {
        return dom.text(_this2.els.get('submit'), text);
      })["catch"](ignore);
      this.els.set('hint', dom('div', {
        className: this._config.hintClass + ' ' + this._config.storeIcon
      }));
      this.els.set('hintText', dom('span', 'or write feedback on'));
      this.t('sqPanel_feedback_form_link_prefix').then(function (text) {
        return dom.text(_this2.els.get('hintText'), text);
      })["catch"](ignore);
      this.els.set('hintLink', dom('a', {
        href: this._config.storeUrl
      }, this._config.storeLink));
      dom.addClass(this.els.get('submit'), this._config.submitClass);
      dom.addClass(this.els.get('cancel'), this._config.cancelClass);
      dom.chain(this.els.get('hint')).appendChild(this.els.get('hintText')).appendChild(this.els.get('hintLink'));
      dom.chain(this._element).appendChild(dom.chain(this.els.get('container')).appendChild(this.els.get('header')).appendChild(this.els.get('text')).appendChild(this.els.get('email')).appendChild(dom.chain(this.els.get('buttonPanel')).appendChild(this.els.get('submit')).appendChild(this.els.get('cancel')).appendChild(this.els.get('hint')).element).element).appendChild(this.els.get('close'));
      this.els.get('cancel').addEventListener('click', function (event) {
        return _this2.closeHandler(event);
      });
      this.els.get('close').addEventListener('click', function (event) {
        return _this2.closeHandler(event);
      });
      this.els.get('submit').addEventListener('click', function (event) {
        return _this2.submitHandler(event);
      });
      this.els.get('hintLink').addEventListener('click', function (event) {
        return _this2.linkHandler(event);
      });
      this.els.get('text').addEventListener('keyup', function () {
        return _this2.updateHandler();
      });
      this.els.get('email').addEventListener('keyup', function () {
        return _this2.updateHandler();
      });
    }
  }, {
    key: "_removePanels",
    value: function _removePanels() {
      this._panels.forEach(function (panel) {
        return panel.remove();
      });
      this._panels.clear();
    }
  }, {
    key: "stateComplete",
    value: function stateComplete() {
      var _this3 = this;
      this.disabled = false;
      this._removePanels();
      var panel = new Success();
      panel.setMessenger(this.getMessenger());
      panel.init();
      this._panels.set('success', panel);
      this._element.appendChild(panel.element);
      panel.addEventListener('close', function () {
        return _this3.closeHandler();
      });
      dom.addClass(this.els.get('container'), 'hidden');
    }
  }, {
    key: "stateSending",
    value: function stateSending() {
      this.disabled = true;
      this._removePanels();
      var panel = new Sending();
      panel.setMessenger(this.getMessenger());
      panel.init();
      this._panels.set('sending', panel);
      this._element.appendChild(panel.element);
      dom.addClass(this.els.get('container'), 'hidden');
    }
  }, {
    key: "stateForm",
    value: function stateForm() {
      this.disabled = false;
      this._removePanels();
      dom.removeClass(this.els.get('container'), 'hidden');
    }
  }, {
    key: "stateError",
    value: function stateError() {
      var _this4 = this;
      this.disabled = false;
      this._removePanels();
      var panel = new ErrorPanel();
      panel.setMessenger(this.getMessenger());
      this._panels.set('error', panel);
      this._element.appendChild(panel.element);
      panel.addEventListener('close', function () {
        return _this4.closeHandler();
      });
      panel.addEventListener('back', function () {
        return _this4.stateForm();
      });
      panel.addEventListener('link', function () {
        return _this4.linkHandler();
      });
      panel.init();
      dom.addClass(this.els.get('container'), 'hidden');
    }
  }, {
    key: "updateHandler",
    value: function updateHandler() {
      if (this.text === '' || this.email === '') {
        this.submitDisabled = true;
        return;
      }
      if (!this.email.match(/^.*@[^@]+\.\w{2,}$/i)) {
        this.submitDisabled = true;
        return;
      }
      this.submitDisabled = false;
    }
  }, {
    key: "linkHandler",
    value: function linkHandler(event) {
      event && event.preventDefault();
      this.dispatchEvent('link', this._config.storeUrl);
    }
  }, {
    key: "closeHandler",
    value: function closeHandler(event) {
      event && event.preventDefault();
      this.text = '';
      this.email = '';
      this.dispatchEvent('cancel');
    }
  }, {
    key: "submitHandler",
    value: function submitHandler(event) {
      event && event.preventDefault();
      var data = {
        text: this.text,
        email: this.email
      };
      this.dispatchEvent('submit', data);
    }
  }]);
}(Container);
Form.DEFAULT_CONFIG = {
  panelClass: 'feedbackPanel',
  hintClass: 'feedbackHint',
  buttonsPrefix: 'sqbtn sqbtn-small',
  submitClass: 'sqbtn-green',
  cancelClass: 'sqbtn-transparent',
  storeLink: 'Chrome Store',
  storeUrl: 'https://chrome.google.com/webstore/detail/seoquake/akdgnmcogleenhbclghghlkkdndkjdjc/reviews',
  storeIcon: 'chrome-icon'
};
module.exports = Form;

},{"../../../../common/dom/Container":9,"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/utils/eventsMixin":65,"./Error":84,"./Sending":88,"./Success":89,"extend":109}],86:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var ignore = require('../../../../common/lib/ignore');
var MilestoneSurveyPanel = function () {
  function MilestoneSurveyPanel() {
    _classCallCheck(this, MilestoneSurveyPanel);
    this._isInit = false;
    this._isDisabled = false;
    this._isVisible = false;
    this._element = null;
    this._textBlock = null;
    this._buttonOk = null;
    this._buttonCancel = null;
    this.processConfigurationReady = this.handleConfigurationReady.bind(this);
    this.processOkClick = this.handleOkClick.bind(this);
    this.processCancelClick = this.handleCancelClick.bind(this);
    this.processHide = this.hide.bind(this);
    this.processHidePanel = this.hidePanel.bind(this);
    this.processOpenQuiz = this.openQuiz.bind(this);
  }
  return _createClass(MilestoneSurveyPanel, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "visible",
    get: function get() {
      return this._isVisible;
    }
  }, {
    key: "init",
    value: function init() {
      if (this._isInit) {
        return;
      }
      this._element = dom('div', {
        className: 'survey-panel milestone'
      });
      this._buttonOk = dom('button', {
        className: 'sqseobar2-button sqseobar2-button__green'
      }, 'Help Us Improve');
      this._buttonOk.addEventListener('click', this.processOkClick, true);
      this._buttonCancel = dom('button', {
        className: 'sqseobar2-button sqseobar2-button-close'
      });
      this._buttonCancel.addEventListener('click', this.processCancelClick, true);
      this._textBlock = dom('div', {
        className: 'survey-panel__text'
      }, [dom('h2', 'Big news!'), dom('p', {}, [dom('span', 'SEOquake has reached an incredible milestone of '), dom('b', '1,000,000'), dom('span', ' users!')]), dom('p', 'We\'re beyond grateful for your recognition and support. Help us shape the future of SEOquake by taking our survey. Join us on this exciting journey!')]);
      this._element.appendChild(this._textBlock);
      this._element.appendChild(this._buttonOk);
      this._element.appendChild(this._buttonCancel);
      this.loadConfiguration();
    }
  }, {
    key: "loadConfiguration",
    value: function loadConfiguration() {
      Promise.all([this.sendMessage('sq.getConfigurationItem', 'panel.quiz2'), this.t('magic_showPanelQuiz2')]).then(this.processConfigurationReady)["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      if (this._isVisible) {
        dom.removeElement(this._element);
      }
      this._buttonOk.removeEventListener('click', this.processOkClick, true);
      this._buttonCancel.removeEventListener('click', this.processCancelClick, true);
      this._element = null;
      this._buttonOk = null;
      this._buttonCancel = null;
      this._textBlock = null;
      this._isInit = false;
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._isVisible || !this._isInit || this._isDisabled) {
        return;
      }
      dom.addClass(this.element, 'survey-panel_hidden');
      this._isVisible = false;
    }
  }, {
    key: "show",
    value: function show() {
      if (this._isDisabled || this._isVisible || !this._isInit) {
        return;
      }
      this._isVisible = true;
      dom.removeClass(this.element, 'survey-panel_hidden');
      document.body.appendChild(this.element);
    }
  }, {
    key: "markDone",
    value: function markDone() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.setConfigurationItem', {
        name: 'panel.quiz2',
        value: false
      });
    }
  }, {
    key: "hidePanel",
    value: function hidePanel() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.hidePanel');
    }
  }, {
    key: "openQuiz",
    value: function openQuiz() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.openTab', MilestoneSurveyPanel.URL_QUIZ);
    }
  }, {
    key: "handleConfigurationReady",
    value: function handleConfigurationReady(results) {
      this._isDisabled = !results[0] || results[1] !== '1';
      this._isInit = true;
    }
  }, {
    key: "handleOkClick",
    value: function handleOkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.getMessenger().registerEvent('panel', 'MilestoneSurvey', 'Yes');
      this.markDone().then(this.processHide).then(this.processOpenQuiz).then(this.processHidePanel)["catch"](ignore);
    }
  }, {
    key: "handleCancelClick",
    value: function handleCancelClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.getMessenger().registerEvent('panel', 'MilestoneSurvey', 'No');
      this.markDone().then(this.processHide)["catch"](ignore);
    }
  }]);
}();
MilestoneSurveyPanel.URL_QUIZ = 'https://forms.gle/Qf3CJVbPc4zJq8yy9';
messengerTranslateMixin(MilestoneSurveyPanel.prototype);
module.exports = MilestoneSurveyPanel;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/utils/messengerTranslateMixin":68}],87:[function(require,module,exports){
'use strict';
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ToggleButton = require('../../../../common/effects/ToggleButton');
var FeedbackForm = require('./Form');
var dom = require('../../../../common/dom/main');
var XHRProxy = require('../../../../common/utils/XHRProxy');
var extend = require('extend');
var isEmpty = require('../../../../common/lib/isEmpty');
var ignore = require('../../../../common/lib/ignore');
var Panel = function () {
  function Panel(client, config) {
    _classCallCheck(this, Panel);
    this._config = extend(true, {}, Panel.DEFAULT_CONFIG, config);
    this._client = client;
    this._button = null;
    this._form = null;
    this._formVisible = false;
    this.button = document.querySelector('[data-role=feedback]');
  }
  return _createClass(Panel, [{
    key: "t",
    value: function t(message) {
      var _this = this;
      return new Promise(function (resolve) {
        return _this._client.t(message, resolve);
      });
    }
  }, {
    key: "button",
    get: function get() {
      return this._button;
    },
    set: function set(element) {
      var _this2 = this;
      if (element !== null && !(element instanceof HTMLElement)) {
        throw new Error('Button can be null or HTMLElement only');
      }
      if (this._button !== null) {
        this._button.remove();
      }
      this._button = new ToggleButton(element, {
        preventDefault: false,
        stopPropagation: false
      });
      this.t('sqPanel_feedback_button_title').then(function (text) {
        return dom.setText(_this2._button.element.firstChild, text);
      })["catch"](ignore);
    }
  }, {
    key: "form",
    get: function get() {
      var _this3 = this;
      if (this._form === null) {
        this._form = new FeedbackForm();
        this._form.setMessenger(this._client);
        this._form.init();
        this._form.stateForm();
        this._client.getConfigurationItem('feedback.lastEmail', '', function (email) {
          return _this3._form.email = email;
        });
        this._client.getConfigurationItem('feedback.lastText', '', function (text) {
          return _this3._form.text = text;
        });
        this._form.addEventListener('cancel', function () {
          return _this3.button.status = ToggleButton.STATUS_UP;
        });
        this._form.addEventListener('submit', function (data) {
          return _this3.sendData(data);
        });
        this._form.addEventListener('link', function (url) {
          return _this3.openUrl(url);
        });
      }
      return this._form;
    }
  }, {
    key: "openUrl",
    value: function openUrl(url) {
      var _this4 = this;
      this._client.openTab(url, function () {
        _this4._client.hidePanel();
      });
    }
  }, {
    key: "sendData",
    value: function sendData(data) {
      var _this5 = this;
      this._form.disabled = true;
      if (isEmpty(data, 'email') || isEmpty(data, 'text')) {
        this._form.disabled = false;
        return;
      }
      var request = new XHRProxy(this._client);
      var requestData = new Map();
      requestData.set('email', data.email);
      requestData.set('text', data.text);
      requestData.set('client', window.navigator.userAgent);
      requestData.set('version', '3.13.4');
      request.callback = function (result) {
        if (result.status === 200 && result.responseText === '1') {
          _this5._form.stateComplete();
          _this5._form.email = '';
          _this5._form.text = '';
        } else {
          _this5._form.stateError('Not 200');
        }
      };
      request.timeoutCallback = function () {
        _this5._form.stateError('Error');
      };
      this._form.stateSending();
      request.send(this._config.feedbackUrl, 'post', requestData);
      this._client.registerEvent('panel', 'sendFeedbackForm');
    }
  }, {
    key: "showForm",
    value: function showForm() {
      if (this._formVisible) {
        return;
      }
      this.form.stateForm();
      document.body.appendChild(this.form.element);
      dom.addClass(document.body, 'feedback');
      this._formVisible = true;
      this._client.registerEvent('panel', 'showFeedbackForm');
    }
  }, {
    key: "hideForm",
    value: function hideForm() {
      if (!this._formVisible) {
        return;
      }
      dom.removeElement(this.form.element);
      dom.removeClass(document.body, 'feedback');
      this._formVisible = false;
      this._client.registerEvent('panel', 'hideFeedbackForm');
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._form !== null) {
        this._client.setConfigurationItem('feedback.lastEmail', this._form.email);
        this._client.setConfigurationItem('feedback.lastText', this._form.text);
        this._form.remove();
      }
    }
  }]);
}();
Panel.DEFAULT_CONFIG = {
  feedbackUrl: 'https://www.seoquake.com/review/panel.php'
};
module.exports = Panel;

},{"../../../../common/dom/main":23,"../../../../common/effects/ToggleButton":39,"../../../../common/lib/ignore":47,"../../../../common/lib/isEmpty":50,"../../../../common/utils/XHRProxy":62,"./Form":85,"extend":109}],88:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var dom = require('../../../../common/dom/main');
var Container = require('../../../../common/dom/Container');
var ignore = require('../../../../common/lib/ignore');
var Sending = function (_Container) {
  function Sending() {
    var _this;
    _classCallCheck(this, Sending);
    _this = _callSuper(this, Sending);
    _this._element = dom('div', {
      className: 'sending box'
    });
    return _this;
  }
  _inherits(Sending, _Container);
  return _createClass(Sending, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this._elements.set('header', dom('h2', 'Telling us about SEOquake...'));
      this.t('sqPanel_feedback_sending_title').then(function (text) {
        return _this2.setElsText('header', text);
      })["catch"](ignore);
      this._elements.set('text', dom('div', {
        className: 'text'
      }, 'Sending your feedback to SEOquake team.'));
      this.t('sqPanel_feedback_sending_message').then(function (text) {
        return _this2.setElsText('text', text);
      })["catch"](ignore);
      this._elements.set('loader', dom('div', {
        className: 'loader'
      }));
      dom.chain(this._element).appendChild(this._elements.get('header')).appendChild(this._elements.get('loader')).appendChild(this._elements.get('text'));
    }
  }]);
}(Container);
module.exports = Sending;

},{"../../../../common/dom/Container":9,"../../../../common/dom/main":23,"../../../../common/lib/ignore":47}],89:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var dom = require('../../../../common/dom/main');
var Container = require('../../../../common/dom/Container');
var ignore = require('../../../../common/lib/ignore');
var Success = function (_Container) {
  function Success() {
    var _this;
    _classCallCheck(this, Success);
    _this = _callSuper(this, Success);
    _this._element = dom('div', {
      className: 'success box'
    });
    return _this;
  }
  _inherits(Success, _Container);
  return _createClass(Success, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this._elements.set('header', dom('h2', 'You told us about SEOquake'));
      this.t('sqPanel_feedback_success_title').then(function (text) {
        return _this2.setElsText('header', text);
      })["catch"](ignore);
      this._elements.set('text', dom('div', {
        className: 'text'
      }, ' '));
      this.t('sqPanel_feedback_success_message').then(function (text) {
        return _this2.setElsText('text', text);
      })["catch"](ignore);
      this._elements.set('success', dom('div', {
        className: 'image'
      }));
      this._elements.set('close', dom('button', {
        className: 'sqbtn sqbtn-small sqbtn-green'
      }, 'Continue'));
      this.t('sqPanel_feedback_success_continue').then(function (text) {
        return _this2.setElsText('close', text);
      })["catch"](ignore);
      dom.chain(this._element).appendChild(this._elements.get('header')).appendChild(this._elements.get('success')).appendChild(this._elements.get('text')).appendChild(this._elements.get('close'));
      this._elements.get('close').addEventListener('click', function () {
        return _this2.dispatchEvent('close');
      });
    }
  }]);
}(Container);
module.exports = Success;

},{"../../../../common/dom/Container":9,"../../../../common/dom/main":23,"../../../../common/lib/ignore":47}],90:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var ignore = require('../../../../common/lib/ignore');
var SurveyPanel = function () {
  function SurveyPanel() {
    _classCallCheck(this, SurveyPanel);
    this._isInit = false;
    this._isDisabled = false;
    this._isVisible = false;
    this._element = null;
    this._textBlock = null;
    this._buttonOk = null;
    this._buttonCancel = null;
    this.processConfigurationReady = this.handleConfigurationReady.bind(this);
    this.processOkClick = this.handleOkClick.bind(this);
    this.processCancelClick = this.handleCancelClick.bind(this);
    this.processHide = this.hide.bind(this);
    this.processHidePanel = this.hidePanel.bind(this);
    this.processOpenQuiz = this.openQuiz.bind(this);
  }
  return _createClass(SurveyPanel, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "visible",
    get: function get() {
      return this._isVisible;
    }
  }, {
    key: "init",
    value: function init() {
      if (this._isInit) {
        return;
      }
      this._element = dom('div', {
        className: 'survey-panel'
      });
      this._buttonOk = dom('button', {
        className: 'sqseobar2-button sqseobar2-button__green'
      }, 'Take survey');
      this._buttonOk.addEventListener('click', this.processOkClick, true);
      this._buttonCancel = dom('button', {
        className: 'sqseobar2-button sqseobar2-button__transparent'
      }, 'No, thanks');
      this._buttonCancel.addEventListener('click', this.processCancelClick, true);
      this._textBlock = dom('div', {
        className: 'survey-panel__text'
      }, [dom('h2', 'Help us improve SEOquake!'), dom('p', 'Take our quick survey to tell us about your experience with SEOquake.')]);
      this._element.appendChild(this._textBlock);
      this._element.appendChild(this._buttonOk);
      this._element.appendChild(this._buttonCancel);
      this.loadConfiguration();
    }
  }, {
    key: "loadConfiguration",
    value: function loadConfiguration() {
      Promise.all([this.sendMessage('sq.getConfigurationItem', 'panel.quiz1'), this.t('magic_showPanelQuiz1')]).then(this.processConfigurationReady)["catch"](ignore);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._isInit) {
        return;
      }
      if (this._isVisible) {
        dom.removeElement(this._element);
      }
      this._buttonOk.removeEventListener('click', this.processOkClick, true);
      this._buttonCancel.removeEventListener('click', this.processCancelClick, true);
      this._element = null;
      this._buttonOk = null;
      this._buttonCancel = null;
      this._textBlock = null;
      this._isInit = false;
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._isVisible || !this._isInit || this._isDisabled) {
        return;
      }
      dom.addClass(this.element, 'survey-panel_hidden');
      this._isVisible = false;
    }
  }, {
    key: "show",
    value: function show() {
      if (this._isDisabled || this._isVisible || !this._isInit) {
        return;
      }
      this._isVisible = true;
      dom.removeClass(this.element, 'survey-panel_hidden');
      document.body.appendChild(this.element);
    }
  }, {
    key: "markDone",
    value: function markDone() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.setConfigurationItem', {
        name: 'panel.quiz1',
        value: false
      });
    }
  }, {
    key: "hidePanel",
    value: function hidePanel() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.hidePanel');
    }
  }, {
    key: "openQuiz",
    value: function openQuiz() {
      if (!this._isInit) {
        return Promise.reject('Survey panel not initilized');
      }
      return this.sendMessage('sq.openTab', SurveyPanel.URL_QUIZ);
    }
  }, {
    key: "handleConfigurationReady",
    value: function handleConfigurationReady(results) {
      this._isDisabled = !results[0] || results[1] !== '1';
      this._isInit = true;
    }
  }, {
    key: "handleOkClick",
    value: function handleOkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.getMessenger().registerEvent('panel', 'Survey', 'Yes');
      this.markDone().then(this.processHide).then(this.processOpenQuiz).then(this.processHidePanel)["catch"](ignore);
    }
  }, {
    key: "handleCancelClick",
    value: function handleCancelClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.getMessenger().registerEvent('panel', 'Survey', 'No');
      this.markDone().then(this.processHide)["catch"](ignore);
    }
  }]);
}();
SurveyPanel.URL_QUIZ = 'https://goo.gl/forms/rNx3pDZSisqK6mXw2';
messengerTranslateMixin(SurveyPanel.prototype);
module.exports = SurveyPanel;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/utils/messengerTranslateMixin":68}],91:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var PanelReport = require('../ui/PanelReport');
var dom = require('../../../../common/dom/main');
var normalizeNumber = require('../../../../common/utils/normalizeNumber');
var padLeft = require('../../../../common/utils/padLeft');
var isEmpty = require('../../../../common/lib/isEmpty');
var ignore = require('../../../../common/lib/ignore');
var TrafficAnalyticsReport = function (_PanelReport) {
  function TrafficAnalyticsReport(url) {
    var _this;
    _classCallCheck(this, TrafficAnalyticsReport);
    _this = _callSuper(this, TrafficAnalyticsReport, [url]);
    _this._total = null;
    _this._totalMessage = null;
    _this._rank = null;
    _this._rankMessage = null;
    _this._visits = null;
    _this._visitsMessage = null;
    _this._pagesVisitsRate = null;
    _this._pagesVisitsRateMessage = null;
    _this._visitDuration = null;
    _this._visitDurationMessage = null;
    _this._bounceRate = null;
    _this._bounceRateMessage = null;
    _this._fullReportButton = null;
    _this._trafficSourceTitle = null;
    _this._trafficSourceValue = null;
    _this._trafficSourceTable = null;
    _this.processFullReportClick = _this.handleFullReportClick.bind(_this);
    return _this;
  }
  _inherits(TrafficAnalyticsReport, _PanelReport);
  return _createClass(TrafficAnalyticsReport, [{
    key: "reportHref",
    get: function get() {
      return this.replaceURLPlaceholders(TrafficAnalyticsReport.REPORT_URL);
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(TrafficAnalyticsReport.prototype), "init", this).call(this);
      this.initTotalText();
      this.initSourcesTable();
      this._fullReportButton = dom('button', {
        className: 'sqseobar2-button'
      }, 'View full report');
      this._fullReportButton.addEventListener('click', this.processFullReportClick, true);
      var columns = dom('div', {
        className: 'b-c'
      });
      var left = dom('div', {
        className: 'b-cl'
      });
      left.appendChild(dom('div', {
        className: 'b-row b-row_big'
      }, [this._total, this._totalMessage]));
      left.appendChild(dom('div', {
        className: 'b-row'
      }, [this._rankMessage, this._rank]));
      left.appendChild(dom('div', {
        className: 'b-row'
      }, [this._visitsMessage, this._visits]));
      left.appendChild(dom('div', {
        className: 'b-row'
      }, [this._pagesVisitsRateMessage, this._pagesVisitsRate]));
      left.appendChild(dom('div', {
        className: 'b-row'
      }, [this._visitDurationMessage, this._visitDuration]));
      left.appendChild(dom('div', {
        className: 'b-row'
      }, [this._bounceRateMessage, this._bounceRate]));
      left.appendChild(this._fullReportButton);
      columns.appendChild(left);
      var right = dom('div', {
        className: 'b-cr'
      });
      right.appendChild(this._trafficSourceTable);
      columns.appendChild(right);
      this._panel.appendChild(columns);
      dom.removeElement(this._messageEmpty);
      this._messageEmpty = dom('div', {
        className: 'b-m_e hidden'
      }, [dom('h3'), dom('p'), dom('ol', {}, [dom('li'), dom('li')])]);
      this._panel.appendChild(this._messageEmpty);
      this.translate();
    }
  }, {
    key: "initTotalText",
    value: function initTotalText() {
      this._total = dom('a', {
        href: this.reportHref
      }, '0');
      this._total.addEventListener('click', this.processLinkClick);
      this._totalMessage = dom('span', {}, 'visits');
      this._rank = dom('span', {
        className: 'ta-value'
      }, '0');
      this._rankMessage = dom('span', {
        className: 'ta-value-title'
      }, 'Traffic Rank');
      this._visits = dom('span', {
        className: 'ta-value'
      }, '0');
      this._visitsMessage = dom('span', {
        className: 'ta-value-title'
      }, 'Unique Visitors');
      this._pagesVisitsRate = dom('span', {
        className: 'ta-value'
      }, '0');
      this._pagesVisitsRateMessage = dom('span', {
        className: 'ta-value-title'
      }, 'Pages / Visit');
      this._visitDuration = dom('span', {
        className: 'ta-value'
      }, '00:00');
      this._visitDurationMessage = dom('span', {
        className: 'ta-value-title'
      }, 'Avg. visit duration');
      this._bounceRate = dom('span', {
        className: 'ta-value'
      }, '0%');
      this._bounceRateMessage = dom('span', {
        className: 'ta-value-title'
      }, 'Bounce rate');
    }
  }, {
    key: "initSourcesTable",
    value: function initSourcesTable() {
      var rows = [];
      for (var i = 0; i < 5; i++) {
        rows.push(dom('tr', {}, [dom('td'), dom('td'), dom('td')]));
      }
      this._trafficSourceTitle = dom('th', {
        className: 'b-t_h',
        colspan: 2
      }, 'Traffic sources');
      this._trafficSourceValue = dom('th', {
        className: 'b-t_h'
      }, '');
      this._trafficSourceTable = dom('table', {
        className: 'b-t'
      }, [dom('thead', {}, dom('tr', {}, [this._trafficSourceTitle, this._trafficSourceValue])), dom('tbody', {}, rows)]);
    }
  }, {
    key: "translate",
    value: function translate() {
      var _this2 = this;
      Promise.all([this.t('sqPanel_traffic_analytics_empty_header'), this.t('sqPanel_traffic_analytics_empty_message'), this.t('sqPanel_traffic_analytics_empty_reason1'), this.t('sqPanel_traffic_analytics_empty_reason2')]).then(function (msgs) {
        dom.text(_this2._messageEmpty.querySelector('h3'), msgs[0]);
        dom.text(_this2._messageEmpty.querySelector('p'), msgs[1]);
        dom.text(_this2._messageEmpty.querySelector('li:nth-child(1)'), msgs[2]);
        dom.text(_this2._messageEmpty.querySelector('li:nth-child(2)'), msgs[3]);
      })["catch"](ignore);
      Promise.all([this.t('sqPanel_backlinks_semrush_link'), this.t('sqPanel_backlinks_semrush_text')]).then(function (msgs) {
        dom.text(_this2._connectLink, msgs[0]);
        dom.setText(_this2._messagePanel.lastChild, msgs[1]);
      })["catch"](ignore);
    }
  }, {
    key: "process",
    value: function process() {
      if (this._processed) {
        return;
      }
      this.stateLoading();
      this._api.getTrafficAnalytics(this._urlData.clean_domain, this._urlData.is_subdomain).then(this.processDataReady)["catch"](this.processRequestError);
    }
  }, {
    key: "replaceURLPlaceholders",
    value: function replaceURLPlaceholders(line) {
      var _this3 = this;
      return line.replace(/{(\w+)}/g, function (i, code) {
        switch (code) {
          case 'domain':
            return encodeURIComponent(_this3._urlData.clean_domain);
          default:
            return '';
        }
      });
    }
  }, {
    key: "fillTotalData",
    value: function fillTotalData(data) {
      if (typeof data.visits !== 'undefined') {
        dom.text(this._total, normalizeNumber(data.visits).shortValue);
      }
      if (typeof data.rank !== 'undefined') {
        dom.text(this._rank, data.rank);
      }
      if (typeof data.users !== 'undefined') {
        dom.text(this._visits, normalizeNumber(data.users).shortValue);
      }
      if (typeof data.pages_per_visit !== 'undefined') {
        dom.text(this._pagesVisitsRate, data.pages_per_visit.toLocaleString([], {
          maximumFractionDigits: 2
        }));
      }
      if (typeof data.time_on_site !== 'undefined') {
        dom.text(this._visitDuration, TrafficAnalyticsReport.secondsToMinutes(data.time_on_site));
      }
      if (typeof data.bounce_rate !== 'undefined') {
        dom.text(this._bounceRate, (data.bounce_rate * 100).toLocaleString([], {
          maximumFractionDigits: 2
        }) + '%');
      }
    }
  }, {
    key: "fillSourceData",
    value: function fillSourceData(data) {
      var _this4 = this;
      var visits = data.visits;
      var tbody = this._trafficSourceTable.querySelector('tbody');
      ['direct', 'referral', 'search', 'social', 'paid'].forEach(function (key, index) {
        var item = data[key];
        var percent = item / visits * 100 || 0;
        var row = tbody.rows[index];
        dom.text(row.cells[0], _this4.t('sqPanel_traffic_analytics_source_' + key));
        dom.setContent(row.cells[1], TrafficAnalyticsReport.percentBar(Math.round(percent)));
        dom.text(row.cells[2], percent.toLocaleString([], {
          maximumFractionDigits: 2
        }) + '%');
      });
    }
  }, {
    key: "stateConnect",
    value: function stateConnect() {
      var _this5 = this;
      _get(_getPrototypeOf(TrafficAnalyticsReport.prototype), "stateConnect", this).call(this);
      this.t('sqPanel_traffic_analytics_connect_message').then(function (msg) {
        return dom.setContent(_this5._messageBox, dom.parse(msg));
      })["catch"](ignore);
    }
  }, {
    key: "stateData",
    value: function stateData(data) {
      _get(_getPrototypeOf(TrafficAnalyticsReport.prototype), "stateData", this).call(this, data);
      if (isEmpty(data)) {
        this.stateError(this.t('sqPanel_traffic_analytics_data_empty'));
      } else if (data.total === 0) {
        this.stateEmpty();
      } else {
        this.fillTotalData(data);
        this.fillSourceData(data);
      }
    }
  }, {
    key: "handleFullReportClick",
    value: function handleFullReportClick(event) {
      event.preventDefault();
      event.stopPropagation();
      var url = this.replaceURLPlaceholders(TrafficAnalyticsReport.REPORT_URL);
      this.sendMessage('sq.openTab', url).then(this.processHidePanel)["catch"](ignore);
    }
  }], [{
    key: "secondsToMinutes",
    value: function secondsToMinutes(seconds) {
      var m = Math.floor(seconds / 60);
      var s = seconds - m * 60;
      var result = [padLeft(m), padLeft(s)];
      return result.join(':');
    }
  }, {
    key: "percentBar",
    value: function percentBar(progress) {
      return dom('div', {
        className: 'b-t_p'
      }, dom('div', {
        className: 'b-t_pv',
        style: 'width:' + progress + '%'
      }));
    }
  }]);
}(PanelReport);
TrafficAnalyticsReport.REPORT_URL = 'https://www.semrush.com/analytics/traffic/overview/?q={domain}&utm_source=seoquake&utm_medium=panel&utm_campaign=traffic_analytics&ref=174537735';
TrafficAnalyticsReport.prototype.PANEL_CLASS = 'ta';
TrafficAnalyticsReport.prototype.LANDING_URL = 'https://www.semrush.com/lp/sem/en/?utm_source=seoquake&utm_medium=dashboard&utm_campaign=connect_semrush&ref=174537735';
module.exports = TrafficAnalyticsReport;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/lib/isEmpty":50,"../../../../common/utils/normalizeNumber":69,"../../../../common/utils/padLeft":70,"../ui/PanelReport":95}],92:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var translateMixin = require('../../../../common/utils/translateMixin');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var TipsPanel = require('./TipsPanel');
var NoticePanel = function (_TipsPanel) {
  function NoticePanel(lastItem) {
    var _this;
    _classCallCheck(this, NoticePanel);
    _this = _callSuper(this, NoticePanel, [lastItem]);
    _this._lastItem = parseInt(lastItem || 0, 10);
    _this._items = Array.from(NoticePanel.ITEMS_LIST);
    return _this;
  }
  _inherits(NoticePanel, _TipsPanel);
  return _createClass(NoticePanel);
}(TipsPanel);
NoticePanel.ITEMS_LIST = ['sqPanel_notice_1'];
translateMixin(NoticePanel.prototype);
eventsMixin(NoticePanel.prototype);
module.exports = NoticePanel;

},{"../../../../common/utils/eventsMixin":65,"../../../../common/utils/translateMixin":71,"./TipsPanel":93}],93:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var translateMixin = require('../../../../common/utils/translateMixin');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var FxLeft = require('../../../../common/effects/FxLeft');
var ignore = require('../../../../common/lib/ignore');
var TipsPanel = function () {
  function TipsPanel(lastItem) {
    _classCallCheck(this, TipsPanel);
    this._lastItem = parseInt(lastItem || 0, 10);
    this._items = Array.from(TipsPanel.ITEMS_LIST);
    this._textNext = '';
    this._element = null;
    this._content = null;
    this._contentRow = null;
    this._close = null;
    this._currentItem = null;
    this.processUITranslated = this.handleUITranslated.bind(this);
    this.processCloseClick = this.handleCloseClick.bind(this);
    this.processLinkClick = this.handleLinkClick.bind(this);
    this.processNextClick = this.handleNextClick.bind(this);
  }
  return _createClass(TipsPanel, [{
    key: "init",
    value: function init() {
      if (this._lastItem === this._items.length) {
        return;
      }
      this._element = dom('div', {
        className: 'tips'
      });
      this._contentRow = dom('div', {
        className: 'tips-content_row'
      });
      this._content = dom('div', {
        className: 'tips-content'
      }, this._contentRow);
      this._close = dom('button', {
        className: 'tips-close'
      }, 'Close');
      this._close.addEventListener('click', this.processCloseClick, true);
      this._element.appendChild(this._content);
      this._element.appendChild(this._close);
      document.body.appendChild(this._element);
      this.translateUI().then(this.processUITranslated)["catch"](ignore);
    }
  }, {
    key: "hide",
    value: function hide() {
      if (this._element === null) {
        return;
      }
      dom.addClass(this._element, 'hidden');
    }
  }, {
    key: "show",
    value: function show() {
      if (this._element === null) {
        return;
      }
      dom.removeClass(this._element, 'hidden');
    }
  }, {
    key: "translateUI",
    value: function translateUI() {
      var _this = this;
      var actions = [];
      this._items.forEach(function (tip) {
        return actions.push(_this.t(tip));
      });
      actions.push(this.t('sqPanel_tips_next'));
      return Promise.all(actions).then(function (msgs) {
        _this._textNext = msgs.pop();
        _this._items = msgs;
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      this._close.removeEventListener('click', this.processCloseClick, true);
      dom.removeElement(this._element);
      this._content = null;
      this._close = null;
      this._element = null;
    }
  }, {
    key: "renderNextItem",
    value: function renderNextItem() {
      var _this2 = this;
      var width = this._element.offsetWidth;
      if (width === 0) {
        width = 765;
      }
      var currentItem = this._lastItem + Math.round(Math.random() * (this._items.length - this._lastItem - 1));
      var limit = 0;
      while (currentItem === this._currentItem && limit < 100) {
        currentItem = this._lastItem + Math.round(Math.random() * (this._items.length - this._lastItem - 1));
        limit++;
      }
      this._currentItem = currentItem;
      var itemText = dom.parse(this._items[currentItem], {
        lineBreak: 'br'
      });
      Array.from(itemText.querySelectorAll('a')).forEach(function (a) {
        return a.addEventListener('click', _this2.processLinkClick, true);
      });
      if (this._items.length > 1) {
        var linkNext = dom('a', {
          className: 'tips-content_next',
          href: '#'
        }, this._textNext);
        linkNext.addEventListener('click', this.processNextClick, true);
        itemText.appendChild(linkNext);
      }
      var itemBlock = dom('div', {
        className: 'tips-content_item',
        style: 'width:' + width + 'px'
      }, itemText);
      this._contentRow.appendChild(itemBlock);
      dom.css(this._contentRow, 'width', width * this._contentRow.children.length + 'px');
      if (this._contentRow.children.length > 1) {
        var effect = new FxLeft(this._contentRow, -Math.round(width));
        effect.run().then(function () {
          effect.move(0);
          Array.from(_this2._contentRow.firstChild.querySelectorAll('a')).forEach(function (a) {
            return a.removeEventListener('click', _this2.processLinkClick, true);
          });
          dom.removeElement(_this2._contentRow.firstChild);
        });
      }
    }
  }, {
    key: "handleUITranslated",
    value: function handleUITranslated() {
      this.renderNextItem();
    }
  }, {
    key: "handleCloseClick",
    value: function handleCloseClick(event) {
      var _this3 = this;
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('closePanel', this._items.length);
      dom.addClass(this._element, 'hidden-bellow');
      setTimeout(function () {
        return _this3.remove();
      }, 1000);
    }
  }, {
    key: "handleLinkClick",
    value: function handleLinkClick(event) {
      event.preventDefault();
      var href = event.currentTarget.getAttribute('href');
      switch (href) {
        case 'general':
        case 'serp':
        case 'seobar':
        case 'parameters':
        case 'export':
        case 'integration':
          this.dispatchEvent('openOptions', href);
          break;
        default:
          this.dispatchEvent('openLink', href);
          break;
      }
    }
  }, {
    key: "handleNextClick",
    value: function handleNextClick(event) {
      event.preventDefault();
      this.renderNextItem();
    }
  }]);
}();
TipsPanel.ITEMS_LIST = ['sqPanel_tips_1', 'sqPanel_tips_2', 'sqPanel_tips_3', 'sqPanel_tips_4', 'sqPanel_tips_5'];
translateMixin(TipsPanel.prototype);
eventsMixin(TipsPanel.prototype);
module.exports = TipsPanel;

},{"../../../../common/dom/main":23,"../../../../common/effects/FxLeft":33,"../../../../common/lib/ignore":47,"../../../../common/utils/eventsMixin":65,"../../../../common/utils/translateMixin":71}],94:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var PanelLog = function () {
  function PanelLog() {
    _classCallCheck(this, PanelLog);
    this._list = null;
    this._isInit = false;
  }
  return _createClass(PanelLog, [{
    key: "init",
    value: function init() {
      if (this._isInit) {
        return;
      }
      this._list = dom('div', {
        style: 'z-index:10000;font-size: 10px;position:fixed; left:0; top:0; bottom:0;width:100px;overflow:scroll;background:black;color:white;'
      });
      document.body.appendChild(this._list);
      this._isInit = true;
    }
  }, {
    key: "log",
    value: function log(string) {
      this.init();
      this._list.appendChild(dom('div', {}, string));
    }
  }]);
}();
module.exports = PanelLog;

},{"../../../../common/dom/main":23}],95:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SemrushApi = require('../../../../common/semrush/SemrushApi');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var dom = require('../../../../common/dom/main');
var parseUri = require('../../../../common/lib/parseUri').parseUri;
var ignore = require('../../../../common/lib/ignore');
var isEmpty = require('../../../../common/lib/isEmpty');
var PanelReport = function () {
  function PanelReport(url) {
    _classCallCheck(this, PanelReport);
    this._url = url;
    this._urlData = parseUri(this._url);
    this._api = null;
    this._panel = null;
    this._processed = false;
    this._loadingTimer = null;
    this._loader = null;
    this._messageEmpty = null;
    this._connectButton = null;
    this._connectLink = null;
    this._messageBox = null;
    this._messagePanel = null;
    this._panel = null;
    this.processDataReady = this.handleDataReady.bind(this);
    this.processRequestError = this.handleRequestError.bind(this);
    this.processConnectClick = this.handleConnectClick.bind(this);
    this.processLinkClick = this.handleLinkClick.bind(this);
    this.processHidePanel = this.handlePanelHide.bind(this);
  }
  return _createClass(PanelReport, [{
    key: "panel",
    get: function get() {
      return this._panel;
    }
  }, {
    key: "init",
    value: function init() {
      this._api = new SemrushApi();
      this._api.setMessenger(this.getMessenger());
      this._panel = dom('div', {
        className: this.PANEL_CLASS
      });
      this.initMessagePanel();
    }
  }, {
    key: "initMessagePanel",
    value: function initMessagePanel() {
      this._connectButton = dom('button', {
        className: 'sqseobar2-button sqseobar2-button-semrush hidden'
      }, this.t('sqPanel_backlinks_connect'));
      this._connectButton.addEventListener('click', this.processConnectClick, true);
      this._connectLink = dom('a', {
        href: this.LANDING_URL
      }, 'Learn more about SEMrush');
      this._connectLink.addEventListener('click', this.processLinkClick, true);
      this._messageBox = dom('div', {
        className: 'b-m_t'
      }, '');
      this._messagePanel = dom('div', {
        className: 'b-m hidden'
      }, [this._messageBox, this._connectButton, dom('p', {}, ['or', this._connectLink])]);
      this._panel.appendChild(this._messagePanel);
      this._messageEmpty = dom('div', {
        className: 'b-m_e hidden'
      });
      this._panel.appendChild(this._messageEmpty);
      this._loader = dom('div', {
        className: 'b-l'
      }, [dom('div', {
        className: 'loader'
      })]);
      this._panel.appendChild(this._loader);
    }
  }, {
    key: "process",
    value: function process() {}
  }, {
    key: "stateLoading",
    value: function stateLoading() {
      var _this = this;
      if (this._loadingTimer === null) {
        this._loadingTimer = setTimeout(function () {
          dom.removeClass(_this._loader, 'hidden');
          dom.addClass(_this._loader, 'sending');
          dom.addClass(_this._messageEmpty, 'hidden');
        }, 150);
      }
    }
  }, {
    key: "stateConnect",
    value: function stateConnect() {
      if (this._loadingTimer !== null) {
        clearTimeout(this._loadingTimer);
        this._loadingTimer = null;
      }
      dom.removeClass(this._connectButton, 'hidden');
      dom.removeClass(this._messagePanel, 'hidden');
      dom.removeClass(this._messagePanel.lastChild, 'hidden');
      dom.addClass(this._messageEmpty, 'hidden');
      dom.addClass(this._loader, 'hidden');
      dom.removeClass(this._loader, 'sending');
    }
  }, {
    key: "stateError",
    value: function stateError(message) {
      var _this2 = this;
      if (this._loadingTimer !== null) {
        clearTimeout(this._loadingTimer);
        this._loadingTimer = null;
      }
      dom.addClass(this._connectButton, 'hidden');
      dom.addClass(this._messageEmpty, 'hidden');
      dom.removeClass(this._messagePanel, 'hidden');
      dom.addClass(this._messagePanel.lastChild, 'hidden');
      dom.addClass(this._loader, 'hidden');
      dom.removeClass(this._loader, 'sending');
      if (message instanceof Promise) {
        message.then(function (msg) {
          return dom.setContent(_this2._messageBox, dom.parse(msg));
        });
      } else {
        dom.setContent(this._messageBox, dom.parse(message));
      }
    }
  }, {
    key: "stateEmpty",
    value: function stateEmpty() {
      if (this._loadingTimer !== null) {
        clearTimeout(this._loadingTimer);
        this._loadingTimer = null;
      }
      dom.addClass(this._connectButton, 'hidden');
      dom.addClass(this._messagePanel, 'hidden');
      dom.addClass(this._loader, 'hidden');
      dom.removeClass(this._loader, 'sending');
      dom.removeClass(this._messageEmpty, 'hidden');
    }
  }, {
    key: "stateData",
    value: function stateData(data) {
      if (this._loadingTimer !== null) {
        clearTimeout(this._loadingTimer);
        this._loadingTimer = null;
      }
      dom.addClass(this._connectButton, 'hidden');
      dom.addClass(this._messagePanel, 'hidden');
      dom.addClass(this._loader, 'hidden');
      dom.addClass(this._messageEmpty, 'hidden');
      dom.removeClass(this._loader, 'sending');
    }
  }, {
    key: "handleDataReady",
    value: function handleDataReady(data) {
      if (!data) {
        this.stateEmpty();
        return;
      }
      if (typeof data.error !== 'undefined') {
        if (data.error === 'No token provided') {
          this.stateConnect();
          return;
        } else {
          this.handleRequestError(data.error);
          return;
        }
      }
      if (!data.hasOwnProperty('status')) {
        this.handleRequestError('Wrong answer');
        return;
      }
      if (!data.hasOwnProperty('data')) {
        this.stateEmpty();
        return;
      }
      this.stateData(data.data);
    }
  }, {
    key: "handleRequestError",
    value: function handleRequestError(error) {
      if (error instanceof Error) {
        if (error.message === 'No token provided') {
          this.stateConnect();
        } else if (error.message === 'Wrong answer from server') {
          this.stateError(this.t('sqPanel_semrush_unreachable'));
        } else {
          this.stateError(error.message);
        }
      } else {
        this.stateError(this.t('sqPanel_semrush_unreachable'));
      }
    }
  }, {
    key: "handleConnectClick",
    value: function handleConnectClick(event) {
      event.preventDefault();
      this.sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      }).then(this.processHidePanel)["catch"](ignore);
    }
  }, {
    key: "handleLinkClick",
    value: function handleLinkClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!isEmpty(event.currentTarget.href)) {
        this.sendMessage('sq.openTab', event.currentTarget.href).then(this.processHidePanel)["catch"](ignore);
      }
    }
  }, {
    key: "handlePanelHide",
    value: function handlePanelHide() {
      this.sendMessage('sq.hidePanel')["catch"](ignore);
    }
  }]);
}();
messengerMixin(PanelReport.prototype);
messengerTranslateMixin(PanelReport.prototype);
module.exports = PanelReport;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":47,"../../../../common/lib/isEmpty":50,"../../../../common/lib/parseUri":55,"../../../../common/semrush/SemrushApi":60,"../../../../common/utils/messengerMixin":67,"../../../../common/utils/messengerTranslateMixin":68}],96:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var ParameterItem = require('../ParameterItem');
var dom = require('../../../../common/dom/main');
var truncateToFit = require('../../../../common/dom/textUtils').truncateToFit;
var HintBox = require('../../../../common/effects/HintBox');
var ParameterItemInline = function (_ParameterItem) {
  function ParameterItemInline(parameter, url) {
    var _this;
    _classCallCheck(this, ParameterItemInline);
    _this = _callSuper(this, ParameterItemInline, [parameter, url]);
    _this._hintBox = null;
    return _this;
  }
  _inherits(ParameterItemInline, _ParameterItem);
  return _createClass(ParameterItemInline, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(ParameterItemInline.prototype), "init", this).call(this);
      this._container = dom('div', {
        className: 'parameterItemInline'
      });
      if (this.parameter.hasOwnProperty('matches')) {
        var titleBox = dom('span', {
          className: 'parameterItemInline-title'
        });
        this._container.appendChild(titleBox);
        var text = this.parameter.name;
        var displayText = truncateToFit(text, 120, '...', titleBox);
        if (displayText.length !== text.length) {
          this._hintBox = new HintBox(titleBox, {
            message: text,
            event: 'hover',
            inline: true
          });
        }
        dom.text(titleBox, displayText);
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
        _get(_getPrototypeOf(ParameterItemInline.prototype), "remove", this).call(this);
        dom.emptyElement(this._container);
        dom.removeElement(this._container);
      }
      if (this._hintBox !== null) {
        this._hintBox.remove();
      }
      delete this._container;
      delete this._title;
    }
  }]);
}(ParameterItem);
module.exports = ParameterItemInline;

},{"../../../../common/dom/main":23,"../../../../common/dom/textUtils":30,"../../../../common/effects/HintBox":34,"../ParameterItem":78}],97:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var ParameterSelectItem = function () {
  function ParameterSelectItem(parameter) {
    _classCallCheck(this, ParameterSelectItem);
    this._parameter = parameter;
    this._element = null;
    this._current = false;
    eventsMixin(this);
    this.init();
  }
  return _createClass(ParameterSelectItem, [{
    key: "init",
    value: function init() {
      var _this = this;
      this._element = dom('a', {
        className: 'menuParameterItem',
        href: '#'
      }, this._parameter.name);
      this._element.addEventListener('click', function (event) {
        event.preventDefault();
        _this.dispatchEvent('select', _this._parameter);
      });
    }
  }, {
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
      this._current = value;
      if (this._current) {
        dom.addClass(this._element, 'current');
      } else {
        dom.removeClass(this._element, 'current');
      }
    }
  }]);
}();
module.exports = ParameterSelectItem;

},{"../../../../common/dom/main":23,"../../../../common/utils/eventsMixin":65}],98:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var ColumnDisplay = require('../../../../common/effects/ColumnDisplay');
var ParameterSelectItem = require('./ParameterSelectItem');
var normalizeColumnsMixin = require('../../../../common/effects/noramlizeColumnsMixin');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var ignore = require('../../../../common/lib/ignore');
var ParameterSelectMenu = function () {
  function ParameterSelectMenu(owner, parameters, currentParameter) {
    var _this = this;
    _classCallCheck(this, ParameterSelectMenu);
    this._owner = owner;
    this._currentParameter = currentParameter;
    this._element = null;
    this._parameters = parameters;
    this._ownerClickListener = function (event) {
      event.preventDefault();
      if (_this.visible) {
        _this.hide();
      } else {
        _this.show();
      }
    };
    this._globalHideEventListener = this.globalHideEventHandler.bind(this);
    this._removeEventListeners();
    this._owner.addEventListener('click', this._ownerClickListener, true);
    document.body.addEventListener('click', this._globalHideEventListener);
    this._visible = false;
  }
  return _createClass(ParameterSelectMenu, [{
    key: "visible",
    get: function get() {
      return this._visible;
    }
  }, {
    key: "_removeEventListeners",
    value: function _removeEventListeners() {
      this._owner.addEventListener('click', this._ownerClickListener, true);
      document.body.removeEventListener('click', this._globalHideEventListener);
    }
  }, {
    key: "itemSelected",
    value: function itemSelected(parameter) {
      this.dispatchEvent('itemSelected', parameter);
    }
  }, {
    key: "createParameterItem",
    value: function createParameterItem(parameter) {
      var _this2 = this;
      var item = new ParameterSelectItem(parameter);
      item.current = this._currentParameter !== null && parameter.id === this._currentParameter.id;
      item.addEventListener('select', function (parameter) {
        return _this2.itemSelected(parameter);
      });
      return item.element;
    }
  }, {
    key: "show",
    value: function show() {
      var _this3 = this;
      if (this._visible) {
        return;
      }
      this.dispatchEvent('beforeShow');
      this._element = dom('div', {
        className: 'menuPanel'
      });
      var parameterTypes = new Map([['page', new ColumnDisplay('Page', 1)], ['domain', new ColumnDisplay('Domain', 1)], ['backlinks', new ColumnDisplay('Backlinks', 1)], ['other', new ColumnDisplay('Other', 1)]]);
      this._parameters.filter(function (parameter) {
        return parameterTypes.has(parameter.type);
      }).forEach(function (parameter) {
        return parameterTypes.get(parameter.type).addItem(_this3.createParameterItem(parameter));
      });
      var table = dom('table');
      var row = table.insertRow(-1);
      var columnsAvailable = [];
      parameterTypes.forEach(function (column) {
        return column.length > 0 ? columnsAvailable.push(column) : 0;
      });
      parameterTypes.forEach(function (column, key) {
        return _this3.t('sqSeobar2_parameters_group_' + key).then(function (text) {
          return column.title = text;
        })["catch"](ignore);
      });
      this.normalizeColumns(columnsAvailable).forEach(function (column) {
        return row.insertCell(-1).appendChild(column.element);
      });
      this._element.appendChild(table);
      document.body.appendChild(this._element);
      this._positionElement();
      dom.addClass(this._owner, 'active');
      this.dispatchEvent('show');
      this._visible = true;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.dispatchEvent('beforeHide');
      if (!this._visible) {
        return;
      }
      dom.removeElement(this._element);
      dom.removeClass(this._owner, 'active');
      this.dispatchEvent('hide');
      this._visible = false;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.hide();
      this._removeEventListeners();
    }
  }, {
    key: "globalHideEventHandler",
    value: function globalHideEventHandler(event) {
      if (dom.isChild(this._element, event.target) || dom.isChild(this._owner, event.target)) {
        return;
      }
      this.hide();
    }
  }, {
    key: "_positionElement",
    value: function _positionElement() {
      var position = dom.getOffset(this._owner);
      var top = position.top + this._owner.offsetHeight;
      var left = position.left;
      var right = document.body.clientWidth - (position.left + this._owner.offsetWidth);
      var padding = 18;
      var result = {
        top: top + 'px',
        left: 'auto',
        right: 'auto'
      };
      left = left - 18 - left / 6;
      right = right - 18 - right / 6;
      if (left < padding) {
        left = padding;
      }
      if (right < padding) {
        right = padding;
      }
      if (left < right) {
        result.left = left + 'px';
      } else {
        result.right = right + 'px';
      }
      dom.css(this._element, result);
    }
  }]);
}();
normalizeColumnsMixin(ParameterSelectMenu.prototype);
messengerMixin(ParameterSelectMenu.prototype);
messengerTranslateMixin(ParameterSelectMenu.prototype);
eventsMixin(ParameterSelectMenu.prototype);
module.exports = ParameterSelectMenu;

},{"../../../../common/dom/main":23,"../../../../common/effects/ColumnDisplay":31,"../../../../common/effects/noramlizeColumnsMixin":40,"../../../../common/lib/ignore":47,"../../../../common/utils/eventsMixin":65,"../../../../common/utils/messengerMixin":67,"../../../../common/utils/messengerTranslateMixin":68,"./ParameterSelectItem":97}],99:[function(require,module,exports){
'use strict';

var PanelMain = require('modules/panel/src/PanelMain');
var client = require('browser/PanelClient');
var panelRuned = false;
function runPanel() {
  if (panelRuned) {
    return;
  }
  panelRuned = true;
  var panel = new PanelMain();
  panel.setMessenger(client);
  panel.init();
  panel.show();
  window.addEventListener('unload', function (event) {
    return panel.hide();
  }, true);
}
function init() {
  setTimeout(runPanel, 100);
}
if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, true);
}

},{"browser/PanelClient":4,"modules/panel/src/PanelMain":75}],100:[function(require,module,exports){
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

},{"to-camel-case":101}],101:[function(require,module,exports){

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
},{"to-space-case":103}],102:[function(require,module,exports){

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
},{}],103:[function(require,module,exports){

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
},{"to-no-case":102}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
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

},{"dom-element-css":100,"dom-element-value":104,"to-camel-case":106}],106:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101,"to-space-case":108}],107:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"dup":102}],108:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"dup":103,"to-no-case":107}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
module.exports = {
  XmlEntities: require('./lib/xml-entities.js'),
  Html4Entities: require('./lib/html4-entities.js'),
  Html5Entities: require('./lib/html5-entities.js'),
  AllHtmlEntities: require('./lib/html5-entities.js')
};

},{"./lib/html4-entities.js":111,"./lib/html5-entities.js":112,"./lib/xml-entities.js":113}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){

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

},{"to-space-case":116}],115:[function(require,module,exports){

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

},{}],116:[function(require,module,exports){

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

},{"to-no-case":115}]},{},[99])(99)
});
