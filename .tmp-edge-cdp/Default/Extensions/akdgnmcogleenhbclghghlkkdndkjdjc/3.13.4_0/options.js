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

},{"../common/Lib":5,"../common/analytics/clientMixin":7,"../common/utils/entities":75,"./ClientMessages":2,"./DeathQueue":3,"./clientTranslate":4,"extend":107}],2:[function(require,module,exports){
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

},{"../common/lib/isFunction":56}],3:[function(require,module,exports){
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

var entities = require('../common/utils/entities')();
module.exports = function (messageId, setCallback) {
  setCallback(entities.decode(chrome.i18n.getMessage(messageId)));
};

},{"../common/utils/entities":75}],5:[function(require,module,exports){
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

},{"./googleChecksum":45,"./hex-md5":46,"./lib/arrayFrom":47,"./lib/containsText.js":48,"./lib/endsWith.js":50,"./lib/getUUID":51,"./lib/ip2long":53,"./lib/isArray":54,"./lib/isEmpty":55,"./lib/isObject":57,"./lib/isString":59,"./lib/parseArgs":60,"./lib/parseUri":61,"./lib/shortHash":62,"./lib/startsWith.js":63,"./lib/trimHash":64}],6:[function(require,module,exports){
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
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var SQError = function (_Error) {
  function SQError(message, id) {
    var _this;
    _classCallCheck(this, SQError);
    _this = _callSuper(this, SQError, [arguments]);
    _this._id = id;
    return _this;
  }
  _inherits(SQError, _Error);
  return _createClass(SQError, [{
    key: "id",
    get: function get() {
      return this._id;
    }
  }]);
}(_wrapNativeSuper(Error));
module.exports = SQError;

},{}],7:[function(require,module,exports){
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

},{"../lib/isEmpty":55}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

module.exports = {
  1: {
    name: 'Google index',
    title: 'I',
    icon: 'google',
    'url-r': 'https://www.google.com/search?hl=en&safe=off&q=site%3A{domain|encode}&btnG=Search&gws_rd=cr',
    matches: ['<div id="extabar">.*?About ([0-9,]+) results<nobr>', '<div id="extabar">.*?([0-9,]+) results<nobr>', '<div id="extabar">.*?About ([0-9,]+) result<nobr>', '<div id="extabar">.*?([0-9,]+) result<nobr>', '<div id="resultStats">About ([0-9,]+) results<nobr>', '<div id="resultStats">([0-9,]+) results<nobr>', '<div id="resultStats">About ([0-9,]+) result<nobr>', '<div id="resultStats">([0-9,]+) result<nobr>', '<div id="result-stats">About ([0-9,]+) results<nobr>', '<div id="result-stats">([0-9,]+) results<nobr>', '<div id="result-stats">About ([0-9,]+) result<nobr>', '<div id="result-stats">([0-9,]+) result<nobr>'],
    disabled: ['internal', 'google', 'yahoo', 'bing', 'yandex', 'semrush'],
    type: 'domain'
  },
  3: {
    name: 'Google cachedate',
    title: 'Cached',
    icon: 'google',
    'url-r': 'https://webcache.googleusercontent.com/search?hl=en&gl=en&ie=UTF-8&oe=UTF-8&q=cache:{url|encode}',
    matches: ['as it appeared on ([0-9]{1,2} [a-z]{3} [0-9]{4}) [0-9]{2}:[0-9]{2}:[0-9]{2} GMT\\.', 'Your search - <b>[^<]+</b> - did (not match) any documents.'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'external'],
    type: 'page'
  },
  10: {
    name: 'Yahoo index',
    title: 'I',
    icon: 'yahoo',
    'url-r': 'https://search.yahoo.com/search?p=.&vs={clean_domain|encode}',
    matches: ['<span id=\"resultCount\">([^<]+)<\/span>', '<span[^<]*>([\\d,]+) result(s)?<\/span>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  },
  15: {
    name: 'SEMrush backlinks',
    title: 'L',
    icon: 'semrush',
    'url-r': 'https://bl.publicapi.semrush.com/?url={url|encode}&ref=sq',
    'url-s': 'https://www.semrush.com/analytics/backlinks/backlinks/?q={url|encode}&searchType=url&utm_source=seoquake&utm_medium=toolbar&utm_campaign=params&ref=174537735',
    matches: ['<links>(\\d+)<\/links>'],
    disabled: [],
    type: 'backlinks'
  },
  16: {
    name: 'SEMrush subdomain backlinks',
    title: 'LD',
    icon: 'semrush',
    'url-r': 'https://bl.publicapi.semrush.com/?url={scheme}%3A%2F%2F{domain|encode}%2F&ref=sq',
    'url-s': 'https://www.semrush.com/analytics/backlinks/backlinks/{domain|encode}:domain?utm_source=seoquake&utm_medium=toolbar&utm_campaign=params&ref=174537735',
    matches: ['<links_hostname>(\\d+)<\/links_hostname>'],
    disabled: ['internal'],
    type: 'backlinks'
  },
  17: {
    name: 'SEMrush root domain backlinks',
    title: 'LRD',
    icon: 'semrush',
    'url-r': 'https://bl.publicapi.semrush.com/?url={scheme}%3A%2F%2F{domain|encode}%2F&ref=sq',
    'url-s': 'https://www.semrush.com/analytics/backlinks/backlinks/{domain|encode}:root_domain?utm_source=seoquake&utm_medium=toolbar&utm_campaign=params&ref=174537735',
    matches: ['<links_domain>(\\d+)<\/links_domain>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'backlinks'
  },
  20: {
    name: 'Bing index',
    title: 'I',
    icon: 'bing',
    'url-r': 'https://www.bing.com/search?q=site%3A{domain|encode}&FORM=QBRE',
    matches: ['\"sb_count\">[^0-9<]*([0-9,\\. &#;]+)[^<]*<\/span>'],
    disabled: ['internal'],
    type: 'domain'
  },
  37: {
    name: 'Whois',
    title: 'whois',
    icon: 'user',
    'url-r': 'https://whois.domaintools.com/{domain}?utm_source=seoquake&utm_medium=seoquake&utm_campaign=seoquake&ref=174537735',
    disabled: ['internal'],
    type: 'domain'
  },
  38: {
    name: 'Page source',
    title: 'source',
    icon: 'source',
    'url-r': 'view-source:{url}',
    disabled: ['linkinfo', 'internal', 'external'],
    type: 'page'
  },
  41: {
    name: 'SEMrush Rank',
    title: 'Rank',
    icon: 'semrush',
    'url-r': 'https://seoquake.publicapi.semrush.com/info.php?url={scheme}%3A%2F%2F{domain|encode}%2F',
    'url-s': 'https://www.semrush.com/analytics/overview/?q={domain|encode}&searchType=domain&ref=174537735&utm_source=seoquake&utm_medium=toolbar&utm_campaign=params',
    matches: ['<rank>(\\d+)<\/rank>'],
    disabled: ['internal'],
    type: 'domain'
  },
  42: {
    name: 'SEMrush SE Traffic',
    title: 'Traffic',
    icon: 'semrush',
    'url-r': 'https://seoquake.publicapi.semrush.com/info.php?url={scheme}%3A%2F%2F{domain|encode}%2F',
    'url-s': 'https://www.semrush.com/analytics/overview/?q={domain|encode}&searchType=domain&ref=174537735&utm_source=seoquake&utm_medium=toolbar&utm_campaign=params',
    matches: ['<traffic>(\\d+)<\/traffic>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  },
  43: {
    name: 'SEMrush SE Traffic price',
    title: 'Costs',
    icon: 'semrush',
    'url-r': 'https://seoquake.publicapi.semrush.com/info.php?url={scheme}%3A%2F%2F{domain|encode}%2F',
    'url-s': 'https://www.semrush.com/analytics/overview/?q={domain|encode}&searchType=domain&ref=174537735&utm_source=seoquake&utm_medium=toolbar&utm_campaign=params',
    matches: ['<costs>(\\d+)<\/costs>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  },
  50: {
    name: 'Yandex IKS',
    title: 'IKS',
    icon: 'yandex',
    'url-r': 'https://webmaster.yandex.ru/sqi/?host={domain|encode}',
    matches: ['ИКС: ([\\W\\d]*)\\<\\/div>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  },
  51: {
    name: 'Yandex index',
    title: 'I',
    icon: 'yandex',
    'url-r': 'https://www.yandex.ru/search/?text=host%3A{domain|encode}',
    matches: ['<strong class="b-head-logo__text">[^<]+<br\/*>(\\d+)([^<]+)<\/strong>', '"found":"\\&mdash;\\&nbsp;(\\d+)(.тыс\\.|млн)?.ответ', '"found":"—\\\\n(\\d+)(.тыс\\.|.млн)?.ответ', '<div class="serp-adv__found">[^<]+ (\\d+)(.тыс\\.|.млн)?.результ', '<div class=serp-adv__found>[^<]+ (\\d+)(.тыс\\.|.млн)?.результ'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  },
  60: {
    name: 'Pinterest Pin count',
    title: 'PIN',
    icon: 'pinterest',
    'url-r': 'https://api.pinterest.com/v1/urls/count.json?callback=r&url={url|encode}',
    matches: ['"count":\\s*(\\d+)'],
    disabled: ['google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'page'
  },
  70: {
    name: 'Baidu index',
    title: 'I',
    icon: 'baidu',
    'url-r': 'https://www.baidu.com/s?wd=site%3A{domain|encode}&cl=3',
    matches: ['<span class="nums"[^>]*>.+?([0-9,]+).+?<\/span>', '<div class=".*site_tip_icon".*?<b>.+?(\\d+).+?</b>', '<p class=".*?op_site_box_title.*?".*?<span>.*?<b[^>]+>([\\d,]+)</b>', '<b style="color:#333">([\\d,]+)</b>', '<div class="c-span21 c-span-last"><p><b>.+?([0-9,]+).+?</b></p>'],
    disabled: ['seobar', 'google', 'yahoo', 'bing', 'yandex', 'linkinfo', 'semrush', 'internal', 'external'],
    type: 'domain'
  }
};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./_createElement":11,"dom-element-css":98}],16:[function(require,module,exports){
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

},{"to-camel-case":113}],20:[function(require,module,exports){
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

},{"../lib/isEmpty":55}],23:[function(require,module,exports){
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

},{"../lib/ignore":52,"./Chain":10,"./appendText":12,"./clearValue":13,"./correctZIndex":14,"./createElement":15,"./emptyElement":16,"./getElementText":17,"./getOffset":18,"./hasAttribute":19,"./hasClass":20,"./isBodyReady":21,"./isChild":22,"./parseMarkdown":24,"./pixelValue":25,"./qualifyURL":26,"./removeElement":27,"./setContent":28,"./setText":29,"dom-element":103}],24:[function(require,module,exports){
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

},{"extend":107}],25:[function(require,module,exports){
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

},{"../lib/isEmpty":55}],28:[function(require,module,exports){
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

},{"../dom/main":23}],31:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../utils/eventsMixin":76,"extend":107}],32:[function(require,module,exports){
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

},{"../dom/main":23,"../utils/eventsMixin":76,"extend":107}],33:[function(require,module,exports){
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
var FloatPanel = require('./FloatPanel');
var dom = require('../dom/main');
var FloatHead = function (_FloatPanel) {
  function FloatHead() {
    _classCallCheck(this, FloatHead);
    return _callSuper(this, FloatHead, arguments);
  }
  _inherits(FloatHead, _FloatPanel);
  return _createClass(FloatHead, [{
    key: "shadowCreate",
    value: function shadowCreate() {
      var _this = this;
      if (this.element.rows.length === 0) {
        return;
      }
      if (this.shadow !== null) {
        this.shadowUpdate();
        return;
      }
      this.shadow = dom(this.element.nodeName, {
        className: 'float-element-shadow'
      });
      var rows = Array.from(this.element.rows);
      rows.forEach(function (elementRow) {
        var row = _this.shadow.insertRow();
        var columnWidths = [];
        var columns = Array.from(elementRow.cells);
        columns.forEach(function (td) {
          return columnWidths.push(parseInt(td.offsetWidth) - 1);
        });
        columns.forEach(function (td, index) {
          var width = columnWidths[index] + 'px';
          var newTd = dom(td.nodeName);
          newTd.rowSpan = td.rowSpan;
          newTd.colSpan = td.colSpan;
          dom.css(newTd, {
            width: width,
            height: td.offsetHeight + 'px'
          });
          row.appendChild(newTd);
          dom.css(td, 'width', width);
        });
      });
      this.element.parentElement.insertBefore(this.shadow, this.element);
    }
  }, {
    key: "shadowRemove",
    value: function shadowRemove() {
      if (this.shadow !== null) {
        dom.removeElement(this.shadow);
        Array.from(this.element.rows).forEach(function (row) {
          Array.from(row.cells).forEach(function (td) {
            return dom.css(td, {
              width: null,
              height: null
            });
          });
        });
        this.shadow = null;
      }
    }
  }, {
    key: "shadowUpdate",
    value: function shadowUpdate() {}
  }]);
}(FloatPanel);
module.exports = FloatHead;

},{"../dom/main":23,"./FloatPanel":34}],34:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../utils/eventsMixin":76,"extend":107}],35:[function(require,module,exports){
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

},{"../dom/main":23}],36:[function(require,module,exports){
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

},{"../dom/main.js":23,"./Dropdown":32,"extend":107}],37:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var eventsMixin = require('../utils/eventsMixin');
var MenuHighlighter = function () {
  function MenuHighlighter(element) {
    var _this = this;
    _classCallCheck(this, MenuHighlighter);
    this.element = element;
    this.activeElement = document.createElement('div');
    this.activeElement.setAttribute('class', 'menu-highlight');
    this.element.appendChild(this.activeElement);
    this._clickListener = this.clickHandler.bind(this);
    this.element.addEventListener('click', this._clickListener);
    this._isReady = false;
    this._readyResolve = null;
    this._ready = new Promise(function (resolve) {
      _this._readyResolve = resolve;
    });
    this.highlight();
    this.processWindowResize = this.handleWindowResize.bind(this);
    window.addEventListener('resize', this.processWindowResize);
  }
  return _createClass(MenuHighlighter, [{
    key: "ready",
    get: function get() {
      return this._ready;
    }
  }, {
    key: "highlight",
    value: function highlight() {
      var activeItem = this.element.querySelector('a.active');
      var position = activeItem.offsetLeft;
      var width = activeItem.offsetWidth;
      this.activeElement.style.left = position + 'px';
      this.activeElement.style.width = width + 'px';
      this.dispatchEvent('switch', activeItem, true);
      if (!this._isReady) {
        this._isReady = true;
        this._readyResolve();
      }
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(e) {
      if (e.target.nodeName === 'A') {
        var rel = e.target.getAttribute('rel');
        if (rel !== '' && rel !== 'undefined' && rel !== null) {
          this.element.querySelector('a.active').setAttribute('class', '');
          e.target.setAttribute('class', 'active');
          this.highlight();
          this.dispatchEvent('click', e);
        }
      }
    }
  }, {
    key: "clickElement",
    value: function clickElement(href) {
      var link = this.element.querySelector('a[href="' + href + '"]');
      if (link) {
        var clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(clickEvent);
      }
      return link;
    }
  }, {
    key: "handleWindowResize",
    value: function handleWindowResize() {
      this.highlight();
    }
  }]);
}();
eventsMixin(MenuHighlighter.prototype);
module.exports = MenuHighlighter;

},{"../utils/eventsMixin":76}],38:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../dom/main');
var extend = require('extend');
var overlayLib = require('./Overlay.js');
var ScrollBlock = require('./ScrollBlock');
var MessageWindow = function () {
  function MessageWindow(container, config) {
    _classCallCheck(this, MessageWindow);
    this._config = extend(true, {}, MessageWindow.DEFAULT_CONFIG, config);
    this._container = null;
    this._buttons = new Map();
    this._element = null;
    this._header = null;
    this._body = null;
    this._buttonsContainer = null;
    this.defaultWidth = this.config.width;
    this.defaultHeight = this.config.height;
    this.overlay = null;
    this._visible = false;
    this._scroll = null;
    if (container !== undefined) {
      this.container = container;
    } else {
      this.container = document.body;
    }
    if (!dom.hasClass(this.container, 'message-container')) {
      dom.addClass(this.container, 'message-container');
    }
    this._init = false;
    this.processWindowResize = this.handleWindowResize.bind(this);
    if (this.config.autoInit) {
      this.init();
    }
  }
  return _createClass(MessageWindow, [{
    key: "init",
    value: function init() {
      this._element = dom('div', {
        className: 'message message-super hidden'
      });
      this._header = dom('div', {
        className: 'message-header'
      }, '');
      this._element.appendChild(this._header);
      this._body = dom('div', {
        className: 'message-body'
      });
      this._element.appendChild(this._body);
      this._scroll = new ScrollBlock(this._body);
      this._body = this._scroll.container;
      this._buttonsContainer = dom('div', {
        className: 'message-buttons'
      });
      this._buttons.clear();
      this.element.appendChild(this.buttonsContainer);
      this.container.appendChild(this.element);
      window.addEventListener('resize', this.processWindowResize);
      this._init = true;
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "header",
    get: function get() {
      return this._header;
    }
  }, {
    key: "body",
    get: function get() {
      return this._body;
    }
  }, {
    key: "buttonsContainer",
    get: function get() {
      return this._buttonsContainer;
    }
  }, {
    key: "config",
    get: function get() {
      return this._config;
    }
  }, {
    key: "container",
    get: function get() {
      return this._container;
    },
    set: function set(element) {
      if (!(element instanceof Node)) {
        throw new TypeError('element should be DOM Node');
      }
      if (this._container !== null) {
        dom.removeClass(this._container, this._config.containerClassName);
      }
      this._container = element;
      if (!dom.hasClass(this._container, this._config.containerClassName)) {
        dom.addClass(this._container, this._config.containerClassName);
      }
      if (this._element !== null) {
        this._container.appendChild(this._element);
      }
    }
  }, {
    key: "height",
    get: function get() {
      return this.defaultHeight;
    },
    set: function set(value) {
      this.defaultHeight = value;
      this.resize();
    }
  }, {
    key: "addButton",
    value: function addButton(id, title, className) {
      className = className || 'sqbtn';
      if (this._buttons.has(id)) {
        return this._buttons.get(id);
      }
      var button = dom('button', {
        className: className
      }, title);
      this._buttons.set(id, button);
      this.buttonsContainer.appendChild(button);
      this.resize();
      return button;
    }
  }, {
    key: "getButton",
    value: function getButton(id) {
      if (this._buttons.has(id)) {
        return this._buttons.get(id);
      }
      return null;
    }
  }, {
    key: "resize",
    value: function resize() {
      if (!this._visible) {
        return;
      }
      var height = 500;
      var headerHeight = this.header.offsetHeight;
      var buttonsHeight = this.buttonsContainer.offsetHeight;
      var bodyHeight = Math.max(height - (headerHeight + buttonsHeight), 100);
      height = bodyHeight + headerHeight + buttonsHeight;
      if (height + this.element.offsetTop > window.innerHeight) {
        height = window.innerHeight;
        bodyHeight = Math.max(height - (headerHeight + buttonsHeight), 100);
        dom.css(this.element, 'top', 0 + 'px');
      } else {
        if (window.innerHeight > 500) {
          dom.css(this.element, 'top', (window.innerHeight - height) / 2 + 'px');
        } else {
          height = window.innerHeight;
          bodyHeight = Math.max(height - (headerHeight + buttonsHeight), 100);
          dom.css(this.element, 'top', 0 + 'px');
        }
      }
      if (this.element.offsetWidth > window.innerWidth) {
        dom.css(this.element, 'width', window.innerWidth + 'px');
        dom.css(this.element, 'left', 0 + 'px');
      } else {
        if (window.innerWidth > this.defaultWidth) {
          dom.css(this.element, 'width', this.defaultWidth + 'px');
          dom.css(this.element, 'left', (window.innerWidth - this.element.offsetWidth) / 2 + 'px');
        } else {
          dom.css(this.element, 'width', window.innerWidth + 'px');
          dom.css(this.element, 'left', 0 + 'px');
        }
      }
      dom.css(this.element, 'height', height + 'px');
      this._scroll.height = bodyHeight;
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
      dom.setContent(this.body, content);
      if (content instanceof Node) {
        if (content.offsetWidth > this.body.offsetWidth) {
          this.defaultWidth = content.offsetWidth + 20;
          this.resize();
        }
      }
    }
  }, {
    key: "setTitle",
    value: function setTitle(title) {
      dom.text(this.header, title);
    }
  }, {
    key: "show",
    value: function show() {
      var _this = this;
      if (this._visible) {
        return;
      }
      if (this._config.withOverlay) {
        overlayLib.showLoading(this.container, true);
      }
      dom.removeClass(this.element, 'hidden');
      this._visible = true;
      dom.css(this.element, 'opacity', '0');
      dom.css(this.element, 'top', '0px');
      dom.css(this.element, 'left', '0px');
      Array.from(this.body.children).forEach(function (item) {
        if (item instanceof Node && item.offsetWidth + 20 > _this.defaultWidth) {
          _this.defaultWidth = item.offsetWidth + 20;
        }
      });
      this.resize();
      dom.css(this.element, 'opacity', '1');
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._visible) {
        return;
      }
      if (this._config.withOverlay) {
        overlayLib.hideLoading(this.container);
      }
      dom.addClass(this.element, 'hidden');
      this._visible = false;
    }
  }, {
    key: "removeButtons",
    value: function removeButtons() {
      this._buttons.forEach(function (button) {
        return dom.removeElement(button);
      });
      this._buttons.clear();
    }
  }, {
    key: "close",
    value: function close() {
      window.removeEventListener('resize', this._resizeListener);
      this._visible = true;
      this.hide();
      this._buttons.forEach(function (button) {
        return dom.removeElement(button);
      });
      this._buttons.clear();
      dom.removeElement(this.element);
      dom.removeClass(this.container, 'message-container');
      this._element = null;
      this._body = null;
      this._header = null;
      this._buttonsContainer = null;
    }
  }, {
    key: "handleWindowResize",
    value: function handleWindowResize(event) {
      this.resize();
    }
  }]);
}();
MessageWindow.DEFAULT_CONFIG = {
  width: 600,
  height: 'auto',
  withOverlay: true,
  autoInit: true,
  containerClassName: 'message-container'
};
module.exports = MessageWindow;

},{"../dom/main":23,"./Overlay.js":39,"./ScrollBlock":40,"extend":107}],39:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../dom/main');
var FloatPanel = require('./FloatPanel');
var Overlay = function () {
  function Overlay(element, config) {
    _classCallCheck(this, Overlay);
    config = require('extend')(true, {
      progress: 0,
      className: 'overlay',
      containerClassName: 'overlay-container',
      progressClassName: 'overlay-progress',
      floatTop: false,
      floatPadding: 0
    }, config);
    this._config = config;
    if (element !== undefined) {
      this.container = element;
    } else {
      this.container = document.querySelector('body');
    }
    if (!dom.hasClass(this.container, this._config.containerClassName)) {
      dom.addClass(this.container, this._config.containerClassName);
      this._element = null;
    } else {
      this._element = this.container.querySelector(this.classSelector);
      this._progressElement = this.container.querySelector(this.classSelector + ' > ' + this.progressClassSelector);
    }
    this._progress = 0;
    this._visible = false;
    this._float = null;
    this.init();
    this.progress = this._config.progress;
  }
  return _createClass(Overlay, [{
    key: "classSelector",
    get: function get() {
      return '.' + this._config.className.replace(' ', '.');
    }
  }, {
    key: "progressClassSelector",
    get: function get() {
      return '.' + this._config.progressClassName.replace(' ', '.');
    }
  }, {
    key: "init",
    value: function init() {
      if (this._element !== null) {
        this._visible = !dom.hasClass(this._element, 'hidden');
        return;
      }
      this._element = dom('div', {
        className: this._config.className
      });
      dom.addClass(this._element, 'hidden');
      this.container.appendChild(this._element);
      this._progressElement = dom('div', {
        className: this._config.progressClassName
      });
      this._element.appendChild(this._progressElement);
    }
  }, {
    key: "progress",
    get: function get() {
      return this._progress;
    },
    set: function set(value) {
      if (value <= 100 && value >= 0) {
        this._progress = value;
      }
      if (this.visible) {
        dom.css(this._progressElement, 'width', this._progress.toFixed(2) + '%');
      }
    }
  }, {
    key: "floatTop",
    get: function get() {
      return this._float !== null;
    },
    set: function set(value) {
      if (this._element === null) {
        return;
      }
      if (value === true) {
        if (this._float === null) {
          this._float = new FloatPanel(this._progressElement);
        }
      } else {
        if (this._float !== null) {
          this._float.remove();
          this._float = null;
        }
      }
    }
  }, {
    key: "floatPadding",
    get: function get() {
      if (this.floatTop) {
        return this._float.paddingTop;
      }
      return 0;
    },
    set: function set(value) {
      if (this.floatTop) {
        this._float.paddingTop = value;
      }
    }
  }, {
    key: "show",
    value: function show() {
      if (!this._visible) {
        dom.removeClass(this._element, 'hidden');
        this._visible = true;
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      if (this._visible) {
        dom.addClass(this._element, 'hidden');
        this._visible = false;
      }
    }
  }, {
    key: "visible",
    get: function get() {
      return this._visible;
    },
    set: function set(value) {
      if (value === true) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this._element !== null && this._element.parentNode) {
        dom.removeElement(this._element);
        dom.removeClass(this.container, this._config.containerClassName);
        this._element = null;
        this._progressElement = null;
        this._visible = false;
      }
    }
  }]);
}();
exports.Overlay = Overlay;
exports.showLoading = function (container, isSuper) {
  var config = isSuper ? {
    className: 'overlay overlay-super'
  } : {};
  var overlay = new Overlay(container, config);
  overlay.show();
};
exports.hideLoading = function (container) {
  var overlay = new Overlay(container);
  overlay.remove();
};
exports.progress = function (container, value) {
  var overlay = new Overlay(container);
  overlay.progress = value;
};

},{"../dom/main":23,"./FloatPanel":34,"extend":107}],40:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../lib/ignore":52,"./Draggable":31,"extend":107}],41:[function(require,module,exports){
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

},{"../dom/main":23,"../utils/eventsMixin":76,"extend":107}],42:[function(require,module,exports){
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

},{"../dom/main":23,"../lib/isString":59,"../utils/eventsMixin":76,"extend":107}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
'use strict';

var dom = require('../dom/main');
module.exports = function updateContainerHeight() {
  var header = document.querySelector('body > header');
  var main = document.querySelector('body > main');
  var footer = document.querySelector('body > footer');
  var headerFooterHeight = header.offsetHeight + footer.offsetHeight;
  dom.css(main, 'min-height', window.innerHeight - headerFooterHeight + 'px');
  var panel = document.querySelector('.panel-visible');
  if (panel && panel.offsetHeight < main.offsetHeight) {
    dom.css(panel, 'min-height', main.offsetHeight + 'px');
  }
};

},{"../dom/main":23}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"./isArray":54}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
'use strict';

module.exports = function ignore(reason) {
  console.log(reason);
};

},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
'use strict';
module.exports = function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
'use strict';
module.exports = function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

},{}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
'use strict';
module.exports = function isParameterDeleted(parameter, checkFully) {
  if (parameter === undefined || parameter === null) {
    return true;
  }
  if (!parameter.hasOwnProperty('state')) {
    return false;
  }
  if (checkFully === true) {
    return parameter.state === 'fully_deleted';
  } else if (checkFully === false) {
    return parameter.state === 'deleted';
  }
  return parameter.state === 'deleted' || parameter.state === 'fully_deleted';
};

},{}],59:[function(require,module,exports){
'use strict';
module.exports = function isString(value) {
  return value instanceof String || typeof value === 'string';
};

},{}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{"./isEmpty":55}],62:[function(require,module,exports){
'use strict';

var hexMd5 = require('../hex-md5');
module.exports = function shortHash(input) {
  return hexMd5(input).substr(0, 8);
};

},{"../hex-md5":46}],63:[function(require,module,exports){
'use strict';

module.exports = function startsWith(string, pattern) {
  if (string === undefined || string === null || !string.indexOf) {
    return false;
  }
  return string.indexOf(pattern) === 0;
};

},{}],64:[function(require,module,exports){
'use strict';
module.exports = function trimHash(url) {
  var result = url;
  var hashPosition = url.indexOf('#');
  if (hashPosition !== -1) {
    result = url.substring(0, hashPosition);
  }
  return result;
};

},{}],65:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../dom/main":23,"../utils/eventsMixin":76}],66:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../dom/main');
var eventsMixin = require('../utils/eventsMixin');
var translateMixin = require('../utils/translateMixin');
var ignore = require('../lib/ignore');
var ParameterItemLine = function () {
  function ParameterItemLine(parameter, serps) {
    _classCallCheck(this, ParameterItemLine);
    this._parameter = parameter;
    this._serps = serps;
    this._link = null;
    this._element = null;
    this._parameterForm = null;
  }
  return _createClass(ParameterItemLine, [{
    key: "parameterForm",
    get: function get() {
      if (this._parameterForm !== null) {
        return this._parameterForm;
      }
      throw new Error('Parameter form should be set');
    },
    set: function set(value) {
      this._parameterForm = value;
    }
  }, {
    key: "checkboxes",
    get: function get() {
      return Array.from(this._element.querySelectorAll('input[type=checkbox]'));
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "parameter",
    get: function get() {
      return this._parameter;
    }
  }, {
    key: "updateDisabled",
    value: function updateDisabled() {
      var _this = this;
      this._parameter.disabled = [];
      this.checkboxes.forEach(function (checkbox) {
        if (checkbox.getAttribute('id').startsWith('all-')) {
          return;
        }
        if (!checkbox.checked) {
          _this._parameter.disabled.push(checkbox.getAttribute('value'));
        }
      });
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var id = event.currentTarget.getAttribute('id');
      if (id.startsWith('all-')) {
        this.allClickHandler(event);
      }
      this.updateDisabled();
      this.dispatchEvent('changeDisabled');
    }
  }, {
    key: "openParameterForm",
    value: function openParameterForm(event) {
      var _this2 = this;
      if (event) {
        event.preventDefault();
      }
      var form = this.parameterForm(this._parameter);
      form.addEventListener('cancelClick', function () {
        return form.close();
      });
      form.addEventListener('okClick', function (data) {
        if (!('name' in data) || !('title' in data)) {
          _this2.t('new_parameter_error').then(function (msg) {
            return alert(msg);
          })["catch"](ignore);
          return false;
        }
        _this2._parameter = data;
        _this2.updateDisabled();
        _this2.dispatchEvent('change', _this2._parameter);
        form.close();
      });
      form.addEventListener('deleteClick', function () {
        _this2.t('delete_confirm').then(function (msg) {
          if (confirm(msg)) {
            _this2.dispatchEvent('delete', _this2._parameter.id);
            form.close();
          }
        })["catch"](ignore);
      });
      form.show();
    }
  }, {
    key: "allClickHandler",
    value: function allClickHandler() {
      var items = this.checkboxes;
      var first = items.shift();
      items.forEach(function (checkbox) {
        return checkbox.checked = first.checked;
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;
      this._element = dom('tr');
      this._link = dom('a', {
        href: '#'
      }, this._parameter.name);
      this._link.addEventListener('click', function (event) {
        return _this3.openParameterForm(event);
      });
      this._element.appendChild(dom('td', {}, this._link));
      this._serps.forEach(function (serp) {
        var id = serp + '-' + _this3._parameter.id;
        var td = dom('td', {
          className: 'checkboxes'
        });
        var checkbox = dom('input', {
          type: 'checkbox',
          id: id,
          value: serp
        });
        if (serp === 'all') {
          if (_this3._parameter.disabled.length === 0) {
            checkbox.checked = true;
          }
        } else if (_this3._parameter.disabled.indexOf(serp) === -1) {
          checkbox.checked = true;
        }
        checkbox.addEventListener('click', function (event) {
          return _this3.clickHandler(event);
        });
        td.appendChild(checkbox);
        td.appendChild(dom('label', {
          'for': id
        }));
        _this3._element.appendChild(td);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      this.clearEvents();
      dom.removeElement(this._element);
      this._element = null;
      this._parameter = null;
    }
  }]);
}();
eventsMixin(ParameterItemLine.prototype);
translateMixin(ParameterItemLine.prototype);
module.exports = ParameterItemLine;

},{"../dom/main":23,"../lib/ignore":52,"../utils/eventsMixin":76,"../utils/translateMixin":80}],67:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
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

},{"../dom/main":23,"../effects/ColumnDisplay":30,"../effects/noramlizeColumnsMixin":43,"../lib/ignore":52,"../utils/translateMixin":80,"./ParameterItemCheckbox":65,"./ParametersList":68}],68:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

},{"../utils/eventsMixin":76}],69:[function(require,module,exports){
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
var ParametersList = require('./ParametersList');
var ColumnDisplay = require('../effects/ColumnDisplay');
var ParameterItemLine = require('./ParameterItemLine');
var FloatHead = require('../effects/FloatHead');
var dom = require('../dom/main');
var translateMixin = require('../utils/translateMixin');
var ignore = require('../lib/ignore');
var ParametersTable = function (_ParametersList) {
  function ParametersTable(module, parameterFormConstructor) {
    var _this;
    _classCallCheck(this, ParametersTable);
    _this = _callSuper(this, ParametersTable);
    _this._serps = ['all', 'seobar', 'google', 'yahoo', 'bing', 'yandex', 'semrush', 'linkinfo', 'internal', 'external'];
    _this._header = null;
    _this._headerCheckboxes = new Map();
    _this._body = null;
    _this._module = module;
    _this._parametersItems = [];
    _this._floatHeader = null;
    _this._parameterFormConstructor = parameterFormConstructor;
    return _this;
  }
  _inherits(ParametersTable, _ParametersList);
  return _createClass(ParametersTable, [{
    key: "_changeHandler",
    value: function _changeHandler() {
      this.dispatchEvent('userUpdated');
    }
  }, {
    key: "clearParametersElements",
    value: function clearParametersElements() {
      this._parametersItems.forEach(function (item) {
        return item.remove();
      });
      this._parametersItems = [];
    }
  }, {
    key: "_createCell",
    value: function _createCell(title, rowSpan) {
      var _this2 = this;
      rowSpan = rowSpan | 1;
      var id = 'all-items-' + title;
      var checkbox = dom('input', {
        type: 'checkbox',
        id: id
      });
      checkbox.addEventListener('click', function (event) {
        return _this2._selectColumn(event);
      });
      this._headerCheckboxes.set(title, checkbox);
      var label = dom('label', {
        forId: id
      }, title);
      this.t('table_' + title).then(function (text) {
        return dom.text(label, text);
      })["catch"](ignore);
      return dom('th', {
        className: 'checkboxes',
        rowSpan: rowSpan
      }, [checkbox, label]);
    }
  }, {
    key: "createHeader",
    value: function createHeader() {
      var _this3 = this;
      var row = this._header.insertRow();
      row.appendChild(dom('th', {
        rowSpan: 2
      }));
      row.appendChild(this._createCell('all', 2));
      row.appendChild(this._createCell('seobar', 2));
      var serpOverlaysTh = dom('th', {
        colSpan: 5
      }, 'SERP Overlays');
      row.appendChild(serpOverlaysTh);
      this.t('table_serp').then(function (text) {
        return dom.text(serpOverlaysTh, text);
      })["catch"](ignore);
      var reportsTh = dom('th', {
        colSpan: 3
      }, 'Reports');
      row.appendChild(reportsTh);
      this.t('table_reports').then(function (text) {
        return dom.text(reportsTh, text);
      })["catch"](ignore);
      row = this._header.insertRow();
      this._serps.slice(2).forEach(function (title) {
        var id = 'all-items-' + title;
        var checkbox = dom('input', {
          type: 'checkbox',
          id: id
        });
        checkbox.addEventListener('click', function (event) {
          return _this3._selectColumn(event);
        });
        var label = dom('label', {
          forId: id
        }, title);
        _this3.t('table_' + title).then(function (text) {
          return dom.text(label, text);
        })["catch"](ignore);
        row.appendChild(dom('th', {
          className: 'checkboxes'
        }, [checkbox, label]));
        _this3._headerCheckboxes.set(title, checkbox);
      });
    }
  }, {
    key: "onHide",
    value: function onHide() {
      if (this._floatHeader !== null) {
        this._floatHeader.remove();
        this._floatHeader = null;
      }
    }
  }, {
    key: "onShow",
    value: function onShow() {
      this._floatHeader = new FloatHead(this._header, {
        paddingTop: 50
      });
      this._floatHeader.stateOver();
      this._floatHeader.scrollEventHandler();
    }
  }, {
    key: "_selectColumn",
    value: function _selectColumn(event) {
      var checkbox = event.currentTarget;
      var serp = checkbox.getAttribute('id').replace('all-items-', '');
      if (this._serps.indexOf(serp) === -1) {
        return;
      }
      var checkboxes;
      if (serp === 'all') {
        checkboxes = Array.from(this.element.querySelectorAll('input[type=checkbox]'));
      } else {
        checkboxes = Array.from(this._body.querySelectorAll('input[id^=' + serp + ']'));
      }
      checkboxes.forEach(function (item) {
        return item.checked = checkbox.checked;
      });
      this._parametersItems.forEach(function (item) {
        return item.updateDisabled();
      });
      this._changeHandler();
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
          className: 'parametersTable'
        });
        this._header = dom('thead');
        this._body = dom('tbody');
        this.createHeader();
        this._element.appendChild(this._header);
        this._element.appendChild(this._body);
      } else if (!(value instanceof HTMLTableElement)) {
        throw new Error('Value should be instance of HTMLElement');
      } else {
        this._element = value;
      }
    }
  }, {
    key: "deleteParameter",
    value: function deleteParameter(id) {
      if (!this._values.has(id)) {
        return;
      }
      this._values["delete"](id);
      this.dispatchEvent('deleteParameter', id);
    }
  }, {
    key: "onValuesSet",
    value: function onValuesSet() {
      var _this4 = this;
      _get(_getPrototypeOf(ParametersTable.prototype), "onValuesSet", this).call(this);
      this.clearParametersElements();
      this._values.forEach(function (parameter, key) {
        var item = new ParameterItemLine(parameter, _this4._serps);
        item.setTranslateFunction(_this4.getTranslateFunction());
        item.init();
        item.parameterForm = _this4._parameterFormConstructor;
        item.addEventListener('changeDisabled', function (data) {
          return _this4._changeHandler();
        });
        item.addEventListener('change', function (data) {
          _this4._values.set(key, data);
          _this4._changeHandler();
        });
        item.addEventListener('delete', function (id) {
          return _this4.deleteParameter(id);
        });
        _this4._parametersItems.push(item);
        _this4._body.appendChild(item.element);
      });
      this._serps.forEach(function (serp) {
        var items = _this4._body.querySelectorAll('input[id^=' + serp + '-]:checked');
        _this4._headerCheckboxes.get(serp).checked = items.length === _this4._parametersItems.length;
      });
    }
  }]);
}(ParametersList);
translateMixin(ParametersTable.prototype);
module.exports = ParametersTable;

},{"../dom/main":23,"../effects/ColumnDisplay":30,"../effects/FloatHead":33,"../lib/ignore":52,"../utils/translateMixin":80,"./ParameterItemLine":66,"./ParametersList":68}],70:[function(require,module,exports){
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
var SQError = require('../SQError');
var ApiError = function (_SQError) {
  function ApiError() {
    _classCallCheck(this, ApiError);
    return _callSuper(this, ApiError, arguments);
  }
  _inherits(ApiError, _SQError);
  return _createClass(ApiError);
}(SQError);
module.exports = ApiError;

},{"../SQError":6}],71:[function(require,module,exports){
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
var ApiError = require('./ApiError');
var ApiErrorTimeout = function (_ApiError) {
  function ApiErrorTimeout() {
    _classCallCheck(this, ApiErrorTimeout);
    return _callSuper(this, ApiErrorTimeout, arguments);
  }
  _inherits(ApiErrorTimeout, _ApiError);
  return _createClass(ApiErrorTimeout);
}(ApiError);
module.exports = ApiErrorTimeout;

},{"./ApiError":70}],72:[function(require,module,exports){
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

},{"../lib/isEmpty":55,"../utils/messengerMixin":78}],73:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var messengerMixin = require('../utils/messengerMixin');
var SemrushOAuthClient = function () {
  function SemrushOAuthClient() {
    _classCallCheck(this, SemrushOAuthClient);
  }
  return _createClass(SemrushOAuthClient, [{
    key: "_startOAuth",
    value: function _startOAuth(requestId, resolve, reject) {
      var _this = this;
      var oauthReadBinded = function oauthReadBinded(result, callback) {
        _this.removeMessageListener('sq.oauthReady', oauthReadBinded);
        if (result.id === requestId) {
          if ('error' in result) {
            reject(result.error);
            callback(true);
          } else {
            _this.sendMessage('sq.semrushRequest', {
              action: 'getToken',
              code: result.code
            }).then(function (tokenData) {
              return resolve(tokenData);
            })["catch"](function (reason) {
              return reject(reason);
            });
            callback(true);
          }
        } else {
          callback(false);
        }
      };
      this.addMessageListener('sq.oauthReady', oauthReadBinded);
    }
  }, {
    key: "getToken",
    value: function getToken() {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2.sendMessage('sq.oauthStart', SemrushOAuthClient.AUTH_URL).then(function (requestId) {
          return _this2._startOAuth(requestId, resolve, reject);
        })["catch"](function (reason) {
          return reject(reason);
        });
      });
    }
  }]);
}();
SemrushOAuthClient.SERVER_URL = 'https://oauth.semrush.com';
SemrushOAuthClient.CLIENT_ID = 'seoquake';
SemrushOAuthClient.REDIRECT_URL = 'https://oauth.semrush.com/oauth2/success';
SemrushOAuthClient.AUTH_URL = SemrushOAuthClient.SERVER_URL + '/oauth2/authorize?response_type=code' + '&scope=user.info,projects.info,siteaudit.info' + '&client_id=' + SemrushOAuthClient.CLIENT_ID + '&redirect_uri=' + encodeURIComponent(SemrushOAuthClient.REDIRECT_URL);
messengerMixin(SemrushOAuthClient.prototype);
module.exports = SemrushOAuthClient;

},{"../utils/messengerMixin":78}],74:[function(require,module,exports){
'use strict';

module.exports = function delay(time, startTime) {
  return new Promise(function (resolve) {
    setTimeout(resolve, Math.max(0, time - (new Date().getTime() - startTime)));
  });
};

},{}],75:[function(require,module,exports){
'use strict';

var Entities = require('html-entities').AllHtmlEntities;
var entities = null;
module.exports = function () {
  if (entities === null) {
    entities = new Entities();
  }
  return entities;
};

},{"html-entities":108}],76:[function(require,module,exports){
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

},{"../lib/isFunction":56,"../lib/isString":59}],77:[function(require,module,exports){
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

},{"../lib/isEmpty":55}],78:[function(require,module,exports){
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

},{"./messengerBaseMixin":77}],79:[function(require,module,exports){
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

},{"./messengerBaseMixin":77}],80:[function(require,module,exports){
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

},{"../lib/ignore":52}],81:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var MenuHighlight = require('../../../common/effects/MenuHighlight');
var overlayLib = require('../../../common/effects/Overlay');
var FloatPanel = require('../../../common/effects/FloatPanel');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var dom = require('../../../common/dom/main');
var updateContainerHeight = require('../../../common/effects/updateContainerHeight');
var OptionsPanels = require('./OptionsPanels');
var extend = require('extend');
var ignore = require('../../../common/lib/ignore');
var OptionsBase = function () {
  function OptionsBase() {
    _classCallCheck(this, OptionsBase);
    this._menuRoot = document.querySelector('header .main-menu nav');
    this._menu = null;
    this._panels = null;
    this._restoreDefaultButton = null;
    this._processCheckDefaultConfiguration = this._handleCheckDefaultConfiguration.bind(this);
    this._processRestoreDefaultClick = this._handleRestoreDefaultClick.bind(this);
    this.processHashChange = this.handleHashChange.bind(this);
  }
  return _createClass(OptionsBase, [{
    key: "isDocumentReady",
    get: function get() {
      return new Promise(function (resolve) {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, true);
        }
      });
    }
  }, {
    key: "_getIsDefaultConfiguration",
    value: function _getIsDefaultConfiguration() {
      return this.sendMessage('sq.isDefaultConfiguration');
    }
  }, {
    key: "switchPanel",
    value: function switchPanel(id) {
      this._panels.switchTo(id);
    }
  }, {
    key: "sendConfigurationToStorage",
    value: function sendConfigurationToStorage() {
      var _this = this;
      var newConfiguration = this._panels.configuration;
      return this.setConfiguration(newConfiguration).then(function (resultConfiguration) {
        _this._panels.configuration = resultConfiguration;
        _this.sendMessage('sq.updateConfiguration');
      });
    }
  }, {
    key: "sendParametersToStorage",
    value: function sendParametersToStorage() {
      var _this2 = this;
      var newParameters = this._panels.parameters;
      return this.setParameters(newParameters).then(function (resultParameters) {
        _this2._panels.parameters = resultParameters;
      });
    }
  }, {
    key: "_handleCheckDefaultConfiguration",
    value: function _handleCheckDefaultConfiguration() {
      this.sendMessage('sq.isDefaultConfiguration').then(function (isDefault) {
        return OptionsBase.setDefaultIconState(isDefault);
      })["catch"](ignore);
    }
  }, {
    key: "_handleRestoreDefaultClick",
    value: function _handleRestoreDefaultClick(event) {
      var _this3 = this;
      event.preventDefault();
      this.t('sqOptions_restore_default_message').then(function (msg) {
        if (confirm(msg)) {
          _this3.registerEvent('options', 'resetConfiguration');
          _this3.sendMessage('sq.resetConfiguration').then(function () {
            return _this3.reloadConfiguration();
          });
        }
      })["catch"](ignore);
    }
  }, {
    key: "saveConfiguration",
    value: function saveConfiguration() {
      var wait = [];
      wait.push(this.sendConfigurationToStorage());
      wait.push(this.sendParametersToStorage());
      Promise.all(wait).then(this._processCheckDefaultConfiguration);
    }
  }, {
    key: "reloadConfiguration",
    value: function reloadConfiguration() {
      var _this4 = this;
      var wait = [];
      wait.push(this.getConfiguration().then(function (c) {
        return _this4._panels.configuration = c;
      }));
      wait.push(this.getParameters().then(function (p) {
        return _this4._panels.parameters = p;
      }));
      return Promise.all(wait).then(this._processCheckDefaultConfiguration);
    }
  }, {
    key: "init",
    value: function init() {
      var _this5 = this;
      overlayLib.showLoading();
      this.t('sqOptions_title').then(function (text) {
        return document.title = text;
      })["catch"](ignore);
      this._panels = new OptionsPanels();
      this._panels.setMessenger(this.getMessenger());
      this._panels.init();
      this._restoreDefaultButton = document.getElementById('restore_defaults');
      this.t('sqOptions_restore_default_title').then(function (text) {
        return dom.text(_this5._restoreDefaultButton, text);
      })["catch"](ignore);
      this.addMessageListener('sq.updateConfiguration', function (configuration) {
        _this5._panels.configuration = configuration;
        return false;
      });
      this.reloadConfiguration().then(function () {
        return _this5.isDocumentReady;
      }).then(function () {
        return _this5.afterDocumentReady();
      })["catch"](ignore);
      window.addEventListener('hashchange', this.processHashChange);
    }
  }, {
    key: "initMenu",
    value: function initMenu() {
      var _this6 = this;
      this._menu = new MenuHighlight(this._menuRoot);
      this._menu.ready.then(function () {
        setTimeout(function () {
          return dom.addClass(_this6._menu.activeElement, 'animate');
        }, 10);
      })["catch"](ignore);
    }
  }, {
    key: "translateMenu",
    value: function translateMenu() {
      var _this7 = this;
      var wait = [];
      var _loop = function _loop() {
        var key = _arr[_i];
        wait.push(_this7.t('sqOptions_menu_' + key).then(function (text) {
          return dom.text(_this7._menuRoot.querySelector('[rel="' + key + '"]'), text);
        })["catch"](ignore));
      };
      for (var _i = 0, _arr = ['general', 'serp', 'seobar', 'parameters', 'integration']; _i < _arr.length; _i++) {
        _loop();
      }
      var guideLink = this._menuRoot.querySelector('a.guide-link');
      wait.push(this.t('sqOptions_menu_guide').then(function (text) {
        return dom.text(guideLink, text);
      })["catch"](ignore));
      guideLink.addEventListener('click', function (event) {
        return _this7.registerEvent('options', 'Guide link');
      }, true);
      return Promise.all(wait);
    }
  }, {
    key: "afterDocumentReady",
    value: function afterDocumentReady() {
      var _this8 = this;
      this.translateMenu().then(function () {
        _this8.initMenu();
        _this8.handleHashChange();
      })["catch"](ignore);
      new FloatPanel(this._menuRoot.parentNode, {
        paddingTop: 0
      });
      window.addEventListener('resize', updateContainerHeight);
      updateContainerHeight();
      this._panels.addEventListener('change', function (event) {
        return _this8.saveConfiguration();
      });
      this._panels.addEventListener('reload', function (event) {
        return _this8.reloadConfiguration();
      });
      this._restoreDefaultButton.addEventListener('click', this._processRestoreDefaultClick, true);
      overlayLib.hideLoading();
    }
  }, {
    key: "handleHashChange",
    value: function handleHashChange(event) {
      var link;
      if (document.location.hash !== '') {
        link = this._menu.clickElement(document.location.hash);
      } else {
        link = this._menu.clickElement('#general');
      }
      if (link) {
        this.switchPanel(link.getAttribute('rel'));
        this.registerEvent('options', 'switchModule', link.getAttribute('rel'));
      }
    }
  }], [{
    key: "setDefaultIconState",
    value: function setDefaultIconState(isDefault) {
      dom.attr(document.getElementById('restore_defaults'), 'disabled', isDefault ? true : null);
    }
  }]);
}();
messengerMixin(OptionsBase.prototype);
messengerTranslateMixin(OptionsBase.prototype);
module.exports = OptionsBase;

},{"../../../common/dom/main":23,"../../../common/effects/FloatPanel":34,"../../../common/effects/MenuHighlight":37,"../../../common/effects/Overlay":39,"../../../common/effects/updateContainerHeight":44,"../../../common/lib/ignore":52,"../../../common/utils/messengerMixin":78,"../../../common/utils/messengerTranslateMixin":79,"./OptionsPanels":82,"extend":107}],82:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var General = require('./panels/General');
var Serp = require('./panels/Serp');
var Seobar = require('./panels/Seobar');
var Parameters = require('./panels/Parameters');
var Integration = require('./panels/Integration');
var eventsMixin = require('../../../common/utils/eventsMixin');
var messengerMixin = require('../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../common/utils/messengerTranslateMixin');
var OptionsPanels = function () {
  function OptionsPanels() {
    _classCallCheck(this, OptionsPanels);
    this._isInit = false;
    this._panels = new Map();
    this._parameters = {};
  }
  return _createClass(OptionsPanels, [{
    key: "switchTo",
    value: function switchTo(id) {
      this._panels.forEach(function (panel, key) {
        return key === id ? panel.show() : panel.hide();
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      if (this._isInit) {
        return;
      }
      this._panels.set('serp', this.createSerpPanel());
      this._panels.set('seobar', this.createSeobarPanel());
      this._panels.set('parameters', this.createParametersPanel());
      this._panels.set('integration', this.createIntegrationPanel());
      this._panels.set('general', this.createGeneralPanel());
      this._panels.forEach(function (panel) {
        return panel.addEventListener('change', function (event) {
          return _this.dispatchEvent('change');
        });
      });
      this._panels.forEach(function (panel) {
        return panel.addEventListener('reload', function (event) {
          return _this.dispatchEvent('reload');
        });
      });
      this._isInit = true;
    }
  }, {
    key: "createGeneralPanel",
    value: function createGeneralPanel() {
      var panel = new General(document.getElementById('general_block'));
      panel.setMessenger(this.getMessenger());
      panel.init();
      return panel;
    }
  }, {
    key: "createSerpPanel",
    value: function createSerpPanel() {
      var panel = new Serp(document.getElementById('serp_block'));
      panel.setMessenger(this.getMessenger());
      panel.init();
      return panel;
    }
  }, {
    key: "createSeobarPanel",
    value: function createSeobarPanel() {
      var panel = new Seobar(document.getElementById('seobar_block'));
      panel.setMessenger(this.getMessenger());
      panel.init();
      return panel;
    }
  }, {
    key: "createParametersPanel",
    value: function createParametersPanel() {
      var panel = new Parameters(document.getElementById('parameters_block'));
      panel.setMessenger(this.getMessenger());
      panel.init();
      return panel;
    }
  }, {
    key: "createIntegrationPanel",
    value: function createIntegrationPanel() {
      var panel = new Integration(document.getElementById('integration_block'));
      panel.setMessenger(this.getMessenger());
      panel.init();
      return panel;
    }
  }, {
    key: "configuration",
    get: function get() {
      var configuration = {};
      this._panels.forEach(function (panel) {
        return configuration = extend(true, configuration, panel.configuration);
      });
      return configuration;
    },
    set: function set(value) {
      this._panels.forEach(function (panel) {
        return panel.configuration = value;
      });
    }
  }, {
    key: "parameters",
    get: function get() {
      var parameters = {};
      this._panels.forEach(function (panel) {
        if (panel.changed) {
          parameters = extend(true, parameters, panel.parameters);
        }
      });
      return parameters;
    },
    set: function set(value) {
      this._parameters = value;
      this._panels.forEach(function (panel) {
        return panel.parameters = value;
      });
    }
  }]);
}();
eventsMixin(OptionsPanels.prototype);
messengerMixin(OptionsPanels.prototype);
messengerTranslateMixin(OptionsPanels.prototype);
module.exports = OptionsPanels;

},{"../../../common/utils/eventsMixin":76,"../../../common/utils/messengerMixin":78,"../../../common/utils/messengerTranslateMixin":79,"./panels/General":91,"./panels/Integration":92,"./panels/Parameters":93,"./panels/Seobar":94,"./panels/Serp":95,"extend":107}],83:[function(require,module,exports){
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
var MessageWindow = require('../../../common/effects/MessageWindow');
var dom = require('../../../common/dom/main');
var extend = require('extend');
var lib = require('../../../common/Lib');
var eventsMixin = require('../../../common/utils/eventsMixin');
var translateMixin = require('../../../common/utils/translateMixin');
var ignore = require('../../../common/lib/ignore');
var ParameterForm = function (_MessageWindow) {
  function ParameterForm(parameter, container, config) {
    var _this;
    _classCallCheck(this, ParameterForm);
    parameter = parameter || null;
    _this = _callSuper(this, ParameterForm, [container, config]);
    _this._parameter = parameter;
    return _this;
  }
  _inherits(ParameterForm, _MessageWindow);
  return _createClass(ParameterForm, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(ParameterForm.prototype), "init", this).call(this);
      this._formInit();
      if (this._parameter) {
        this.t('parameter_window_edit_title').then(function (text) {
          return dom.text(_this2.header, text);
        })["catch"](ignore);
        dom.value(this.inputElement, ParameterForm.paramToString(this._parameter));
      } else {
        this.t('parameter_window_create_title').then(function (text) {
          return dom.text(_this2.header, text);
        })["catch"](ignore);
        dom.value(this.inputElement, '');
      }
    }
  }, {
    key: "parameterId",
    get: function get() {
      if (this._parameter != null) {
        return this._parameter.id;
      } else {
        return false;
      }
    }
  }, {
    key: "getParameter",
    value: function getParameter() {
      var currentValue = ParameterForm.stringToParam(dom.value(this.inputElement));
      if (currentValue) {
        this._parameter = currentValue;
      }
      return this._parameter;
    }
  }, {
    key: "_formInit",
    value: function _formInit() {
      var _this3 = this;
      this.element.setAttribute('id', 'parameter-form');
      var result = dom('div', {
        className: 'parameter-form-container'
      });
      this.inputElement = dom('textarea', {
        value: '',
        className: 'parameter-edit-input',
        id: 'parameter-form-data'
      });
      result.appendChild(this.inputElement);
      var items = [dom('dt', '{1}, {2}, {3}...'), dom('dd', 'names of domains levels'), dom('dt', '{url}'), dom('dd', 'url'), dom('dt', '{domain}'), dom('dd', 'domain'), dom('dt', '{clean_domain}'), dom('dd', 'domain without www'), dom('dt', '{topdomain}'), dom('dd', '2nd level domain'), dom('dt', '{scheme}'), dom('dd', 'url scheme'), dom('dt', '{path}'), dom('dd', 'url path'), dom('dt', '{query}'), dom('dd', 'url query'), dom('dt', '{keyword}'), dom('dd', 'search keyword'), dom('dt', '{gchecksum}'), dom('dd', 'Google PR checksum'), dom('dt', '{pos}'), dom('dd', 'position in SERP')];
      items.filter(function (nope, index) {
        return index % 2 === 1;
      }).forEach(function (element, index) {
        return _this3.t('parameter_window_' + index).then(function (text) {
          return dom.text(element, text);
        })["catch"](ignore);
      });
      var list = dom('dl');
      items.forEach(function (element) {
        return list.appendChild(element);
      });
      result.appendChild(list);
      this.body.appendChild(result);
      var okButton = this.addButton('ok', 'Save', 'sqbtn sqbtn-small sqbtn-green');
      okButton.setAttribute('id', 'button-parameter-form-ok');
      okButton.addEventListener('click', function (event) {
        return _this3.dispatchEvent('okClick', _this3.getParameter());
      }, true);
      this.t('parameter_window_ok').then(function (text) {
        return dom.text(_this3.getButton('ok'), text);
      })["catch"](ignore);
      var cancelButton = this.addButton('cancel', 'Cancel', 'sqbtn sqbtn-small sqbtn-transparent sqbtn-gray');
      cancelButton.setAttribute('id', 'button-parameter-form-cancel');
      cancelButton.addEventListener('click', function (event) {
        return _this3.dispatchEvent('cancelClick');
      });
      this.t('parameter_window_cancel').then(function (text) {
        return dom.text(_this3.getButton('cancel'), text);
      })["catch"](ignore);
      if (this._parameter !== null) {
        var deleteButton = this.addButton('delete', 'Delete', 'sqbtn sqbtn-small sqbtn-red side-button');
        deleteButton.addEventListener('click', function (event) {
          return _this3.dispatchEvent('deleteClick');
        });
        this.t('parameter_window_delete').then(function (text) {
          return dom.text(_this3.getButton('delete'), text);
        })["catch"](ignore);
      }
    }
  }], [{
    key: "paramToString",
    value: function paramToString(param) {
      var string = [];
      if (param.name) {
        string.push('[NAME]=' + param.name);
      }
      if (param.title) {
        string.push('[TITLE]=' + param.title);
      }
      if (param.icon) {
        string.push('[FAVICON]=' + param.icon);
      }
      if (param['url-r']) {
        string.push('[URL_R]=' + param['url-r']);
      }
      if (param['url-s']) {
        string.push('[URL_S]=' + param['url-s']);
      }
      if (param['url-na']) {
        string.push('[URL_NA]=' + param['url-na']);
      }
      if (param.matches) {
        string.push('[REGEXP]=' + param.matches.join('\n[REGEXP]='));
      }
      if (param.type) {
        string.push('[TYPE]=' + param.type);
      }
      return string.join('\n');
    }
  }, {
    key: "stringToParam",
    value: function stringToParam(string) {
      var param = {};
      string = string.split('\n');
      string.forEach(function (item) {
        var foo = item.match(/\[([^\]]+)\]=(.*)/);
        if (!foo) {
          return;
        }
        var tmptxt;
        switch (foo[1]) {
          case 'ID':
            if (lib.trim(foo[2])) {
              param.id = lib.hex_md5(lib.trim(foo[2])).substr(0, 6);
            }
            break;
          case 'NAME':
            tmptxt = lib.trim(foo[2]) ? lib.trim(foo[2]) : 'Unnamed';
            param.name = tmptxt.substring(0, 24);
            break;
          case 'TITLE':
            tmptxt = lib.trim(foo[2]) ? lib.trim(foo[2]) : 'Untitled';
            param.title = tmptxt.substring(0, 9);
            break;
          case 'FAVICON':
            param.icon = lib.trim(foo[2]);
            break;
          case 'URL_R':
            param['url-r'] = lib.trim(foo[2]);
            break;
          case 'URL_S':
            param['url-s'] = lib.trim(foo[2]);
            break;
          case 'URL_NA':
            param['url-na'] = lib.trim(foo[2]);
            break;
          case 'TYPE':
            tmptxt = lib.trim(foo[2]);
            if (['domain', 'page', 'other', 'backlinks'].indexOf(tmptxt) !== -1) {
              param.type = tmptxt;
            }
            break;
          case 'REGEXP':
          case 'ALTREGEXP':
            if (!('matches' in param)) {
              param.matches = [];
            }
            param.matches.push(lib.trim(foo[2]));
            break;
          default:
            break;
        }
      });
      if (!param.hasOwnProperty('type') || ['domain', 'page', 'other', 'backlinks'].indexOf(param.type) === -1) {
        if (param.hasOwnProperty('url-r')) {
          if (param['url-r'].match(/\{domain|\{clean_domain|\{topdomain/i)) {
            param.type = 'domain';
          } else if (param['url-r'].match(/\{url|\{path/i)) {
            param.type = 'page';
          } else {
            param.type = 'other';
          }
        } else if (param.hasOwnProperty('url-s')) {
          if (param['url-s'].match(/domain\}/i)) {
            param.type = 'domain';
          } else if (param['url-s'].match(/\{url\}|\{path\}/i)) {
            param.type = 'page';
          } else {
            param.type = 'other';
          }
        } else {
          param.type = 'other';
        }
      }
      return param;
    }
  }]);
}(MessageWindow);
eventsMixin(ParameterForm.prototype);
translateMixin(ParameterForm.prototype);
module.exports = ParameterForm;

},{"../../../common/Lib":5,"../../../common/dom/main":23,"../../../common/effects/MessageWindow":38,"../../../common/lib/ignore":52,"../../../common/utils/eventsMixin":76,"../../../common/utils/translateMixin":80,"extend":107}],84:[function(require,module,exports){
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
var messengerMixin = require('../../../common/utils/messengerMixin');
var translateMixin = require('../../../common/utils/translateMixin');
var ignore = require('../../../common/lib/ignore');
var ParametersRestoreMenu = function (_MenuDropdown) {
  function ParametersRestoreMenu(container, config) {
    var _this;
    _classCallCheck(this, ParametersRestoreMenu);
    config = config || {
      toggle: true,
      autoHide: true
    };
    _this = _callSuper(this, ParametersRestoreMenu, [container, config]);
    _this._processDeleteCustom = _this._handleDeleteClick.bind(_this);
    return _this;
  }
  _inherits(ParametersRestoreMenu, _MenuDropdown);
  return _createClass(ParametersRestoreMenu, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(ParametersRestoreMenu.prototype), "init", this).call(this);
      this.addItem('modified-and-deleted', 'Modified and deleted').addEventListener('click', function (event) {
        return _this2.modifiedAndDeleted();
      });
      this.addItem('modified', 'Only modified').addEventListener('click', function (event) {
        return _this2.modified();
      });
      this.addItem('deleted', 'Only deleted').addEventListener('click', function (event) {
        return _this2.deleted();
      });
      this.addSeparator();
      this.addItem('delete-custom', 'Delete custom parameters').addEventListener('click', this._processDeleteCustom);
      this.t('restore_menu_modified_and_deleted').then(function (text) {
        return dom.text(_this2.getItem('modified-and-deleted'), text);
      })["catch"](ignore);
      this.t('restore_menu_modified').then(function (text) {
        return dom.text(_this2.getItem('modified'), text);
      })["catch"](ignore);
      this.t('restore_menu_deleted').then(function (text) {
        return dom.text(_this2.getItem('deleted'), text);
      })["catch"](ignore);
      this.t('restore_menu_delete').then(function (text) {
        return dom.text(_this2.getItem('delete-custom'), text);
      })["catch"](ignore);
    }
  }, {
    key: "modifiedAndDeleted",
    value: function modifiedAndDeleted() {
      var _this3 = this;
      this.t('modified_and_deleted_message').then(function (text) {
        if (confirm(text)) {
          _this3.registerEvent('options', 'restoreModifiedAndDeletedParameters');
          _this3.sendMessage('sq.restoreModifiedParameters').then(function () {
            return _this3.sendMessage('sq.restoreDeletedParameters');
          }).then(function () {
            _this3.sendMessage('sq.updateConfiguration');
            _this3.dispatchEvent('done');
          })["catch"](ignore);
        }
      })["catch"](ignore);
    }
  }, {
    key: "modified",
    value: function modified() {
      var _this4 = this;
      this.t('modified_message').then(function (text) {
        if (confirm(text)) {
          _this4.registerEvent('options', 'restoreModifiedParameters');
          _this4.sendMessage('sq.restoreModifiedParameters').then(function () {
            _this4.sendMessage('sq.updateConfiguration');
            _this4.dispatchEvent('done');
          })["catch"](ignore);
        }
      })["catch"](ignore);
    }
  }, {
    key: "deleted",
    value: function deleted() {
      var _this5 = this;
      this.t('deleted_message').then(function (text) {
        if (confirm(text)) {
          _this5.registerEvent('options', 'restoreDeletedParameters');
          _this5.sendMessage('sq.restoreDeletedParameters').then(function () {
            _this5.sendMessage('sq.updateConfiguration');
            _this5.dispatchEvent('done');
          })["catch"](function (reason) {
            return console.log(reason);
          });
        }
      })["catch"](ignore);
    }
  }, {
    key: "_handleDeleteClick",
    value: function _handleDeleteClick(event) {
      event.preventDefault();
      this.deleteCustom();
    }
  }, {
    key: "deleteCustom",
    value: function deleteCustom() {
      var _this6 = this;
      this.t('delete_custom_message').then(function (text) {
        if (confirm(text)) {
          _this6.registerEvent('options', 'deleteCustomParameters');
          _this6.sendMessage('sq.deleteCustomParameters').then(function () {
            _this6.sendMessage('sq.updateConfiguration');
            _this6.dispatchEvent('done');
          })["catch"](ignore);
        }
      })["catch"](ignore);
    }
  }, {
    key: "show",
    value: function show() {
      _get(_getPrototypeOf(ParametersRestoreMenu.prototype), "show", this).call(this);
      dom.addClass(this.container, 'sqbtn-pressed');
      this.registerEvent('options', 'showRestoreMenu');
    }
  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(ParametersRestoreMenu.prototype), "hide", this).call(this);
      dom.removeClass(this.container, 'sqbtn-pressed');
    }
  }]);
}(MenuDropdown);
messengerMixin(ParametersRestoreMenu.prototype);
translateMixin(ParametersRestoreMenu.prototype);
module.exports = ParametersRestoreMenu;

},{"../../../common/dom/main":23,"../../../common/effects/MenuDropdown":36,"../../../common/lib/ignore":52,"../../../common/utils/messengerMixin":78,"../../../common/utils/translateMixin":80}],85:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var defaultConfiguration = require('../../../../common/defaults/configuration');
var defaultParameters = require('../../../../common/defaults/parameters');
var ConfigurationMergeResult = function () {
  function ConfigurationMergeResult(newConfiguration, newParameters, baseConfiguration, baseParameters) {
    _classCallCheck(this, ConfigurationMergeResult);
    this._newConfiguration = newConfiguration;
    this._newParameters = newParameters;
    if (baseConfiguration !== undefined) {
      this._baseConfiguration = baseConfiguration;
    } else {
      this._baseConfiguration = extend(true, {}, defaultConfiguration);
    }
    if (baseParameters !== undefined) {
      this._baseParameters = baseParameters;
    } else {
      this._baseParameters = extend(true, {}, defaultParameters);
    }
  }
  return _createClass(ConfigurationMergeResult, [{
    key: "mergeConfiguration",
    value: function mergeConfiguration() {
      var result = extend(true, {}, this._baseConfiguration);
      if (this._newConfiguration === undefined || this._newConfiguration === null) {
        return result;
      }
      for (var category in this._newConfiguration) {
        if (category === 'sq_experiment' || category === 'integration') {
          continue;
        }
        if (this._newConfiguration.hasOwnProperty(category)) {
          var group = this._newConfiguration[category];
          for (var key in group) {
            if (category === 'core' && key === 'changelog_shown') {
              continue;
            }
            if (group.hasOwnProperty(key)) {
              if (!result.hasOwnProperty(category)) {
                result[category] = {};
              }
              result[category][key] = group[key];
            }
          }
        }
      }
      return result;
    }
  }, {
    key: "mergeParameters",
    value: function mergeParameters() {
      var result = extend(true, {}, this._baseParameters);
      if (this._newParameters === undefined || this._newParameters === null) {
        return result;
      }
      for (var paramId in this._newParameters) {
        if (this._newParameters.hasOwnProperty(paramId)) {
          var parameter = this._newParameters[paramId];
          for (var field in parameter) {
            if (parameter.hasOwnProperty(field)) {
              if (!result.hasOwnProperty(paramId)) {
                result[paramId] = {};
              }
              result[paramId][field] = parameter[field];
            }
          }
        }
      }
      for (var _paramId2 in result) {
        if (result.hasOwnProperty(_paramId2)) {
          if (!this._newParameters.hasOwnProperty(_paramId2)) {
            result[_paramId2].state = 'deleted';
          }
        }
      }
      return result;
    }
  }]);
}();
module.exports = ConfigurationMergeResult;

},{"../../../../common/defaults/configuration":8,"../../../../common/defaults/parameters":9,"extend":107}],86:[function(require,module,exports){
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
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var extend = require('extend');
var diffObjects = require('../../../../common/lib/diffObjects');
var dom = require('../../../../common/dom/main');
var MessageWindow = require('../../../../common/effects/MessageWindow');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var translateMixin = require('../../../../common/utils/translateMixin');
var isParameterDeleted = require('../../../../common/lib/isParameterDeleted');
var ConfigurationMergeWindow = function (_MessageWindow) {
  function ConfigurationMergeWindow(container, config, configurationMerger, currentConfiguration, currentParameters) {
    var _this;
    _classCallCheck(this, ConfigurationMergeWindow);
    config = extend(true, {}, ConfigurationMergeWindow.DEFAULT_CONFIG, config || {});
    _this = _callSuper(this, ConfigurationMergeWindow, [container, config]);
    _this._merger = configurationMerger;
    _this._configuration = currentConfiguration;
    _this._parameters = currentParameters;
    _this._resultElement = null;
    _this.processImportClick = _this.handleImportClick.bind(_this);
    _this.processCancelClick = _this.handleCancelClick.bind(_this);
    _this.processWindowResize = _this.handleWindowResize.bind(_this);
    return _this;
  }
  _inherits(ConfigurationMergeWindow, _MessageWindow);
  return _createClass(ConfigurationMergeWindow, [{
    key: "resultElement",
    get: function get() {
      if (this._resultElement === null) {
        this._resultElement = dom('div', {
          className: 'import-compare'
        });
      }
      return this._resultElement;
    }
  }, {
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(ConfigurationMergeWindow.prototype), "init", this).call(this);
      dom.text(this.header, this.t('sqOptions_import_confirm_header'));
      var result = this.showConfigurationDifference();
      result = this.showParametersDifference() || result;
      if (result) {
        if (this._resultElement !== null) {
          this.body.appendChild(this._resultElement);
        }
        this.addButton('import', this.t('sqOptions_import_confirm_submit'), 'sqbtn sqbtn-small').addEventListener('click', this.processImportClick);
        this.addButton('cancel', this.t('sqOptions_import_confirm_cancel'), 'sqbtn sqbtn-small sqbtn-transparent').addEventListener('click', this.processCancelClick);
      } else {
        dom.text(this.body, this.t('sqOptions_import_nothing'));
        this.addButton('close', this.t('sqOptions_import_confirm_close'), 'sqbtn sqbtn-small').addEventListener('click', this.processCancelClick);
      }
      this.resize();
    }
  }, {
    key: "showConfigurationDifference",
    value: function showConfigurationDifference() {
      var headerAdded = false;
      var newConfiguration = this._merger.mergeConfiguration();
      var diffModules = diffObjects(this._configuration, newConfiguration, diffObjects.areObjectsSame);
      if (diffModules.length === 0) {
        return;
      }
      var _iterator = _createForOfIteratorHelper(diffModules),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var category = _step.value;
          var categoryHeader = false;
          if (!ConfigurationMergeWindow.CATEGORIES_TITLES.hasOwnProperty(category)) {
            continue;
          }
          if (!this._configuration.hasOwnProperty(category)) {
            continue;
          }
          if (!newConfiguration.hasOwnProperty(category)) {
            continue;
          }
          var diffFields = diffObjects(this._configuration[category], newConfiguration[category]);
          var _iterator2 = _createForOfIteratorHelper(diffFields),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var field = _step2.value;
              if (!ConfigurationMergeWindow.CATEGORIES_TITLES[category].hasOwnProperty(field)) {
                continue;
              }
              if (!headerAdded) {
                this.resultElement.appendChild(dom('div', {
                  className: 'import-compare-header'
                }, this.t('sqOptions_import_confirm_configuration_title')));
                headerAdded = true;
              }
              if (!categoryHeader) {
                var _row = dom('div', {
                  className: 'import-compare-row import-compare-row-block'
                });
                _row.appendChild(dom('div', {
                  className: 'import-compare-category'
                }, this.t(ConfigurationMergeWindow.CATEGORIES_TITLES[category][0])));
                _row.appendChild(dom('div', {
                  className: 'import-compare-row-header'
                }, this.t('sqOptions_import_confirm_current')));
                _row.appendChild(dom('div', {
                  className: 'import-compare-row-header'
                }, this.t('sqOptions_import_confirm_new')));
                this.resultElement.appendChild(_row);
                categoryHeader = true;
              }
              var row = dom('div', {
                className: 'import-compare-row'
              });
              row.appendChild(dom('div', {
                className: 'import-compare-title'
              }, this.t(ConfigurationMergeWindow.CATEGORIES_TITLES[category][field])));
              row.appendChild(dom('div', {
                className: 'import-compare-value'
              }, this._configuration[category][field]));
              row.appendChild(dom('div', {
                className: 'import-compare-value'
              }, newConfiguration[category][field]));
              this.resultElement.appendChild(row);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return headerAdded;
    }
  }, {
    key: "showParametersDifference",
    value: function showParametersDifference() {
      var headerAdded = false;
      var newParameters = this._merger.mergeParameters();
      var diffParameters = diffObjects(this._parameters, newParameters, diffObjects.areObjectsSame);
      if (diffParameters.length === 0) {
        return;
      }
      var _iterator3 = _createForOfIteratorHelper(diffParameters),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var paramId = _step3.value;
          if (!headerAdded) {
            this.resultElement.appendChild(dom('div', {
              className: 'import-compare-header'
            }, this.t('sqOptions_import_confirm_parameters_title')));
            var row = dom('div', {
              className: 'import-compare-row import-compare-row-block'
            });
            row.appendChild(dom('div', {
              className: 'import-compare-category'
            }, this.t('sqOptions_import_confirm_parameters')));
            row.appendChild(dom('div', {
              className: 'import-compare-row-header'
            }, this.t('sqOptions_import_confirm_changes')));
            this.resultElement.appendChild(row);
            headerAdded = true;
          }
          if (this._parameters.hasOwnProperty(paramId) && newParameters.hasOwnProperty(paramId)) {
            var _row2 = dom('div', {
              className: 'import-compare-row'
            });
            _row2.appendChild(dom('div', {
              className: 'import-compare-title'
            }, this._parameters[paramId].name));
            _row2.appendChild(dom('div', {
              className: 'import-compare-value'
            }, this.t('sqOptions_import_confirm_parameters_differs')));
            this.resultElement.appendChild(_row2);
          } else if (!this._parameters.hasOwnProperty(paramId) && newParameters[paramId] && !isParameterDeleted(newParameters[paramId])) {
            var _row3 = dom('div', {
              className: 'import-compare-row'
            });
            _row3.appendChild(dom('div', {
              className: 'import-compare-title'
            }, newParameters[paramId].name));
            _row3.appendChild(dom('div', {
              className: 'import-compare-value'
            }, this.t('sqOptions_import_confirm_parameters_new')));
            this.resultElement.appendChild(_row3);
          } else if (!newParameters.hasOwnProperty(paramId)) {
            var _row4 = dom('div', {
              className: 'import-compare-row'
            });
            _row4.appendChild(dom('div', {
              className: 'import-compare-title'
            }, this._parameters[paramId].name));
            _row4.appendChild(dom('div', {
              className: 'import-compare-value'
            }, this.t('sqOptions_import_confirm_parameters_delete')));
            this.resultElement.appendChild(_row4);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return headerAdded;
    }
  }, {
    key: "handleImportClick",
    value: function handleImportClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent('import', this._merger);
    }
  }, {
    key: "handleCancelClick",
    value: function handleCancelClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }]);
}(MessageWindow);
ConfigurationMergeWindow.DEFAULT_CONFIG = extend(true, {}, MessageWindow.DEFAULT_CONFIG, {
  autoInit: false
});
ConfigurationMergeWindow.CATEGORIES_TITLES = {
  core: {
    0: 'sqOptions_import_category_core',
    disabled: 'sqOptions_import_core_disabled',
    use_cache: 'sqOptions_import_core_use_cache',
    request_delay: 'sqOptions_import_core_request_delay',
    disable_serps_pos_numbers: 'sqOptions_import_core_disable_serps_pos_numbers',
    disable_highlight_sites: 'sqOptions_import_core_disable_highlight_sites',
    highlight_sites: 'sqOptions_import_core_highlight_sites',
    highlight_sites_color: 'sqOptions_import_core_highlight_sites_color',
    export_template: 'sqOptions_import_core_export_template'
  },
  seobar: {
    0: 'sqOptions_import_category_seobar',
    disabled: 'sqOptions_import_seobar_disabled',
    mode: 'sqOptions_import_seobar_mode',
    position: 'sqOptions_import_seobar_position',
    color: 'sqOptions_import_seobar_color',
    open_minimized: 'sqOptions_import_seobar_open_minimized',
    https: 'sqOptions_import_seobar_https',
    excludes: 'sqOptions_import_seobar_excludes',
    robotsLink: 'sqOptions_import_seobar_robotsLink',
    sitemapLink: 'sqOptions_import_seobar_sitemapLink',
    densityLink: 'sqOptions_import_seobar_densityLink',
    linkinfoLink: 'sqOptions_import_seobar_linkinfoLink',
    diagnosisLink: 'sqOptions_import_seobar_diagnosisLink',
    pageinfoLink: 'sqOptions_import_seobar_pageinfoLink',
    pinned: 'sqOptions_import_seobar_pinned'
  },
  google: {
    0: 'sqOptions_import_category_google',
    disabled: 'sqOptions_import_google_disabled',
    mode: 'sqOptions_import_google_mode',
    show_hlgl: 'sqOptions_import_google_show_hlgl',
    show_keyword_difficulty: 'sqOptions_import_google_show_keyword_difficulty',
    onboarding_keyword_difficulty: 'sqOptions_import_google_onboarding_keyword_difficulty',
    google_hl: 'sqOptions_import_google_hl',
    google_gl: 'sqOptions_import_google_gl'
  },
  yahoo: {
    0: 'sqOptions_import_category_yahoo',
    disabled: 'sqOptions_import_yahoo_disabled',
    mode: 'sqOptions_import_yahoo_mode'
  },
  bing: {
    0: 'sqOptions_import_category_bing',
    disabled: 'sqOptions_import_bing_disabled',
    mode: 'sqOptions_import_bing_mode'
  },
  yandex: {
    0: 'sqOptions_import_category_yandex',
    disabled: 'sqOptions_import_yandex_disabled',
    mode: 'sqOptions_import_yandex_mode'
  },
  nofollow: {
    0: 'sqOptions_import_category_nofollow',
    disabled: 'sqOptions_import_nofollow_disabled'
  },
  semrush: {
    0: 'sqOptions_import_category_semrush',
    disabled: 'sqOptions_import_semrush_disabled',
    mode: 'sqOptions_import_semrush_mode'
  },
  advanced: {
    0: 'sqOptions_import_category_advanced',
    disabled: 'sqOptions_import_advanced_disabled',
    disable_ga: 'sqOptions_import_advanced_disabled_ga'
  },
  panel: {
    0: 'sqOptions_import_category_panel',
    mode: 'sqOptions_import_panel_mode'
  }
};
eventsMixin(ConfigurationMergeWindow.prototype);
translateMixin(ConfigurationMergeWindow.prototype);
module.exports = ConfigurationMergeWindow;

},{"../../../../common/dom/main":23,"../../../../common/effects/MessageWindow":38,"../../../../common/lib/diffObjects":49,"../../../../common/lib/isParameterDeleted":58,"../../../../common/utils/eventsMixin":76,"../../../../common/utils/translateMixin":80,"extend":107}],87:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var eventsMixin = require('../../../../common/utils/eventsMixin');
var HighlightList = function () {
  function HighlightList(button, input) {
    _classCallCheck(this, HighlightList);
    this._button = button;
    this._input = input;
  }
  return _createClass(HighlightList, [{
    key: "autoInit",
    value: function autoInit() {
      var _this = this;
      this._button.addEventListener('click', function (event) {
        return _this.startSelect(event);
      });
      this._input.addEventListener('change', function () {
        return _this.endSelect();
      });
    }
  }, {
    key: "processResult",
    value: function processResult(result) {
      this.dispatchEvent('data', result);
    }
  }, {
    key: "startSelect",
    value: function startSelect(event) {
      this._input.click(event);
    }
  }, {
    key: "endSelect",
    value: function endSelect() {
      var _this2 = this;
      var files = this._input.files;
      if (files.length > 0) {
        var file = files[0];
        if (file.size < 1048576) {
          if (file.type === 'text/plain') {
            var reader = new FileReader();
            reader.addEventListener('load', function () {
              return _this2.processResult(reader.result);
            });
            reader.readAsText(file);
          } else {
            this.dispatchEvent('event', new Error('File is not text file'));
          }
        } else {
          this.dispatchEvent('event', new Error('File is too big to process'));
        }
      } else {
        this.dispatchEvent('event', new Error('Please select just one file'));
      }
    }
  }]);
}();
eventsMixin(HighlightList.prototype);
module.exports = HighlightList;

},{"../../../../common/utils/eventsMixin":76}],88:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var ToggleButton = require('../../../../common/effects/ToggleButton');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var SemrushProjectsList = require('./SemrushProjectsList');
var SemrushOAuth = require('../../../../common/semrush/SemrushOAuthClient');
var SemrushApi = require('../../../../common/semrush/SemrushApi');
var SemrushIntegration = function () {
  function SemrushIntegration(container) {
    _classCallCheck(this, SemrushIntegration);
    this._container = container;
    this._locks = new Map();
    this._semrushApi = null;
    this._semrushProjectsList = null;
    this._account = null;
    this._buttonCancelIntegration = null;
    this._buttonDoIntegration = null;
    this._buttonDoIntegrationBottom = null;
    this._linkDoIntegration = null;
    this._buttonProjects = null;
    this._blockDetails = null;
    this._blockActions = null;
    this._blockBottom = null;
    this._fieldAccount = null;
  }
  return _createClass(SemrushIntegration, [{
    key: "account",
    get: function get() {
      return this._account;
    },
    set: function set(value) {
      this._account = value;
      dom.text(this._fieldAccount, this._account);
      if (this._account !== '') {
        dom.css(this._blockDetails, 'display', 'inline-block');
        dom.css(this._buttonCancelIntegration, 'display', 'block');
        this.doIntegrationVisible = false;
      }
    }
  }, {
    key: "doIntegrationVisible",
    set: function set(value) {
      if (value) {
        dom.css(this._buttonDoIntegration, 'display', null);
        dom.css(this._linkDoIntegration, 'display', null);
        dom.css(this._blockBottom, 'display', null);
      } else {
        dom.css(this._buttonDoIntegration, 'display', 'none');
        dom.css(this._linkDoIntegration, 'display', 'none');
        dom.css(this._blockBottom, 'display', 'none');
      }
    }
  }, {
    key: "semrushApi",
    get: function get() {
      if (this._semrushApi === null) {
        this._semrushApi = new SemrushApi();
        this._semrushApi.setMessenger(this._messenger);
      }
      return this._semrushApi;
    }
  }, {
    key: "semrushProjectsList",
    get: function get() {
      var _this = this;
      if (this._semrushProjectsList === null) {
        this._semrushProjectsList = new SemrushProjectsList();
        this._semrushProjectsList.setMessenger(this._messenger);
        this._semrushProjectsList.addEventListener('hide', function () {
          return _this._buttonProjects.status = ToggleButton.STATUS_UP;
        });
      }
      return this._semrushProjectsList;
    }
  }, {
    key: "init",
    value: function init() {
      this._initUIItems();
      this._initCancelIntegration();
      this._initDoIntegration();
    }
  }, {
    key: "_initUIItems",
    value: function _initUIItems() {
      var _this2 = this;
      this._blockDetails = this._container.querySelector('#semrush_details');
      dom.css(this._blockDetails, 'display', 'none');
      this._fieldAccount = this._container.querySelector('#semrush_account');
      this._buttonProjects = new ToggleButton(this._container.querySelector('#semrush_projects'), {
        stopPropagation: true
      });
      this._buttonProjects.addEventListener('down', function () {
        _this2.semrushProjectsList.show(_this2._buttonProjects.element);
        _this2.registerEvent('options', 'OAuth list projects');
      });
      this._buttonProjects.addEventListener('up', function () {
        return _this2.semrushProjectsList.hide(_this2._buttonProjects.element);
      });
      this._blockActions = this._container.querySelector('#semrush_actions');
      this._blockBottom = this._container.querySelector('#semrush_bottom_actions');
    }
  }, {
    key: "_initDoIntegration",
    value: function _initDoIntegration() {
      var _this3 = this;
      this._buttonDoIntegration = this._container.querySelector('#semrush_oauth');
      this._buttonDoIntegration.addEventListener('click', function (event) {
        return _this3.doIntegration(event);
      });
      this._buttonDoIntegrationBottom = this._container.querySelector('#semrush_bottom_oauth');
      this._buttonDoIntegrationBottom.addEventListener('click', function (event) {
        return _this3.doIntegration(event);
      });
      this._linkDoIntegration = this._container.querySelector('#semrush_oauth_message');
      this.doIntegrationVisible = false;
    }
  }, {
    key: "_initCancelIntegration",
    value: function _initCancelIntegration() {
      var _this4 = this;
      this._buttonCancelIntegration = this._container.querySelector('#semrush_cancelintegration');
      this._buttonCancelIntegration.addEventListener('click', function (event) {
        return _this4.cancelIntegration(event);
      });
      dom.css(this._buttonCancelIntegration, 'display', 'none');
    }
  }, {
    key: "stateConnect",
    value: function stateConnect() {
      this.account = '';
      dom.css(this._buttonCancelIntegration, 'display', 'none');
      this.doIntegrationVisible = true;
    }
  }, {
    key: "doIntegration",
    value: function doIntegration(event) {
      var _this5 = this;
      event.preventDefault();
      var oauth = new SemrushOAuth();
      oauth.setMessenger(this.getMessenger());
      oauth.getToken().then(function (tokenData) {
        dom.addClass(_this5._blockActions, 'loading');
        _this5.semrushApi.getAccountData().then(function (data) {
          _this5.account = data.email;
          dom.removeClass(_this5._blockActions, 'loading');
          _this5.dispatchEvent('hasAccount');
        });
        _this5.dispatchEvent('hasToken');
        _this5.reload();
      })["catch"](function (reason) {
        _this5.stateConnect();
        alert(reason);
      });
      this.registerEvent('options', 'OAuth request access');
    }
  }, {
    key: "cancelIntegration",
    value: function cancelIntegration(event) {
      event.preventDefault();
      dom.css(this._blockDetails, 'display', 'none');
      this.doIntegrationVisible = true;
      dom.css(this._buttonCancelIntegration, 'display', 'none');
      this.semrushApi.logout();
      this.dispatchEvent('clearedAccount');
      this.registerEvent('options', 'OAuth reject connection');
    }
  }, {
    key: "reloadSemrushProjects",
    value: function reloadSemrushProjects() {
      var _this6 = this;
      if (this._locks.has('projects')) {
        return;
      }
      this._locks.set('projects', 1);
      this.semrushProjectsList.reset();
      this.semrushProjectsList.statusLoading();
      this.semrushApi.getProjectsList().then(function (data) {
        _this6.semrushProjectsList.statusReady();
        _this6.semrushProjectsList.projects = data;
        _this6._locks["delete"]('projects');
      })["catch"](function (reason) {
        _this6.semrushProjectsList.statusReady();
        _this6._locks["delete"]('projects');
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      this.reloadSemrushProjects();
    }
  }]);
}();
eventsMixin(SemrushIntegration.prototype);
messengerMixin(SemrushIntegration.prototype);
module.exports = SemrushIntegration;

},{"../../../../common/dom/main":23,"../../../../common/effects/ToggleButton":42,"../../../../common/semrush/SemrushApi":72,"../../../../common/semrush/SemrushOAuthClient":73,"../../../../common/utils/eventsMixin":76,"../../../../common/utils/messengerMixin":78,"./SemrushProjectsList":89}],89:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dom = require('../../../../common/dom/main');
var extend = require('extend');
var SemrushProjectsList = function () {
  function SemrushProjectsList(config) {
    _classCallCheck(this, SemrushProjectsList);
    this._config = extend(true, {}, SemrushProjectsList.DEFAULT_CONFIG, config || {});
    this._container = document.body;
    this._projects = new Map();
    this._items = new Map();
    this._nextTo = null;
    this._element = null;
    this._visible = false;
    this._topArrow = null;
    this._projectsFilter = null;
    this._projectsList = null;
    this._resizeWindowHandler = this._reposition.bind(this);
    this._bodyClickHandler = this._bodyClickListener.bind(this);
  }
  return _createClass(SemrushProjectsList, [{
    key: "projects",
    get: function get() {
      return this._projects;
    },
    set: function set(values) {
      var _this = this;
      this.reset();
      values.forEach(function (project) {
        return _this._createProjectElement(project);
      });
      if (values.length < 50) {
        dom.addClass(this._projectsFilter, 'hidden');
      }
    }
  }, {
    key: "element",
    get: function get() {
      if (this._element === null) {
        var item = dom.find('#semrush_projects_list').content;
        var clone = document.importNode(item, true);
        this._container.appendChild(clone);
        this._element = this._container.lastElementChild;
        this._projectsFilter = this._element.querySelector('.projects-filter');
        this._topArrow = this._element.querySelector('.top-arrow');
        this._visible = true;
        this.hide();
      }
      return this._element;
    }
  }, {
    key: "projectsList",
    get: function get() {
      if (this._projectsList === null) {
        this._projectsList = this.element.querySelector('.projects');
      }
      return this._projectsList;
    }
  }, {
    key: "_bodyClickListener",
    value: function _bodyClickListener(e) {
      if (dom.isChild(this.element, e.target)) {
        return;
      }
      this.hide();
    }
  }, {
    key: "_clickProjectTitleHandler",
    value: function _clickProjectTitleHandler(e) {
      e.preventDefault();
      this.sendMessage('sq.openTab', e.currentTarget.href);
    }
  }, {
    key: "_createProjectElement",
    value: function _createProjectElement(project) {
      var _this2 = this;
      this._projects.set(project.project_id, project);
      var item = dom.find('#semrush_project_item').content;
      var clone = document.importNode(item, true);
      dom.data(clone.querySelector('.project-list-item'), 'project-id', project.project_id);
      var projectLink = clone.querySelector('.project-link');
      projectLink.href = SemrushProjectsList.PROJECT_LINK + '#' + project.project_id;
      dom.text(projectLink, project.project_name);
      projectLink.addEventListener('click', function (e) {
        return _this2._clickProjectTitleHandler(e);
      });
      var siteLink = clone.querySelector('.site-link');
      siteLink.href = 'https://' + project.url;
      try {
        if ('tools' in project) {
          project.tools.forEach(function (tool) {
            var flag = clone.querySelector('.flag-' + tool.tool);
            if (flag) {
              dom.removeClass(flag, 'hidden');
            }
          });
        }
      } catch (ignore) {}
      this._items.set(project, clone);
      this.projectsList.appendChild(clone);
    }
  }, {
    key: "statusLoading",
    value: function statusLoading() {}
  }, {
    key: "statusReady",
    value: function statusReady() {}
  }, {
    key: "_temporaryDisplay",
    value: function _temporaryDisplay(callback) {
      var currentVisibility = dom.css(this.element, 'visibility');
      var currentDisplay = dom.css(this.element, 'display');
      var currentPosition = dom.css(this.element, 'position');
      dom.css(this.element, 'visibility', 'hidden');
      dom.css(this.element, 'display', 'block');
      dom.css(this.element, 'position', 'absolute');
      callback();
      dom.css(this.element, 'position', currentPosition);
      dom.css(this.element, 'display', currentDisplay);
      dom.css(this.element, 'visibility', currentVisibility);
    }
  }, {
    key: "_reposition",
    value: function _reposition() {
      var _this3 = this;
      if (!this._nextTo) {
        return;
      }
      var position = dom.getOffset(this._nextTo);
      var left = position.left;
      var rightPadding = 20;
      var width = this.element.offsetWidth;
      if (!this._visible) {
        this._temporaryDisplay(function () {
          return width = _this3.element.offsetWidth;
        });
      }
      if (left + width + rightPadding > window.innerWidth) {
        left = window.innerWidth - width - rightPadding;
      }
      if (left + width < position.left + this._nextTo.offsetWidth) {
        left = position.left + this._nextTo.offsetWidth - width;
      }
      dom.css(this.element, 'position', 'absolute');
      dom.css(this.element, 'left', left + 'px');
      dom.css(this.element, 'top', position.top + this._nextTo.offsetHeight + 'px');
      dom.css(this._topArrow, 'left', position.left - left + rightPadding + 'px');
    }
  }, {
    key: "reset",
    value: function reset() {
      this._projects.clear();
      dom.emptyElement(this.projectsList);
      this._items.forEach(function (item) {
        return dom.removeElement(item);
      });
      this._items.clear();
    }
  }, {
    key: "show",
    value: function show(nextTo) {
      if (nextTo) {
        this._nextTo = nextTo;
        this._reposition();
      }
      if (this._visible) {
        return;
      }
      this._visible = true;
      dom.css(this.element, 'display', 'block');
      window.addEventListener('resize', this._resizeWindowHandler, true);
      document.body.addEventListener('click', this._bodyClickHandler);
      this.dispatchEvent('show');
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this._visible) {
        return;
      }
      this._visible = false;
      dom.css(this.element, 'display', 'none');
      window.removeEventListener('resize', this._resizeWindowHandler, true);
      document.body.removeEventListener('click', this._bodyClickHandler);
      this.dispatchEvent('hide');
    }
  }]);
}();
SemrushProjectsList.PROJECT_LINK = 'https://www.semrush.com/projects/';
require('../../../../common/utils/eventsMixin')(SemrushProjectsList.prototype);
require('../../../../common/utils/messengerMixin')(SemrushProjectsList.prototype);
module.exports = SemrushProjectsList;

},{"../../../../common/dom/main":23,"../../../../common/utils/eventsMixin":76,"../../../../common/utils/messengerMixin":78,"extend":107}],90:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extend = require('extend');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var messengerTranslateMixin = require('../../../../common/utils/messengerTranslateMixin');
var eventsMixin = require('../../../../common/utils/eventsMixin');
var dom = require('../../../../common/dom/main');
var BasePanel = function () {
  function BasePanel(container) {
    _classCallCheck(this, BasePanel);
    this._element = container;
    this._elements = new Map();
    this._changeListener = null;
    this._changed = false;
    this._parameters = null;
  }
  return _createClass(BasePanel, [{
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      this._element = value;
    }
  }, {
    key: "els",
    get: function get() {
      return this._elements;
    }
  }, {
    key: "configuration",
    get: function get() {
      return {};
    },
    set: function set(value) {
      this._changed = false;
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._parameters;
    },
    set: function set(value) {
      this._parameters = value;
      this._changed = false;
    }
  }, {
    key: "changed",
    get: function get() {
      return this._changed;
    }
  }, {
    key: "_changeHandler",
    value: function _changeHandler(event) {
      this._changed = true;
      this.dispatchEvent('change');
    }
  }, {
    key: "changeHandler",
    get: function get() {
      if (this._changeListener === null) {
        this._changeListener = this._changeHandler.bind(this);
      }
      return this._changeListener;
    }
  }, {
    key: "addElementHandlers",
    value: function addElementHandlers(element) {
      var _this = this;
      if (element instanceof Array) {
        element.forEach(function (item) {
          return _this.addElementHandlers(item);
        });
        return;
      }
      switch (element.tagName.toLowerCase()) {
        case 'input':
          switch (element.type) {
            case 'checkbox':
            case 'radio':
              element.addEventListener('click', this.changeHandler);
              break;
            case 'text':
              element.addEventListener('blur', this.changeHandler);
              break;
          }
          break;
        case 'textarea':
          element.addEventListener('change', this.changeHandler);
          break;
        case 'select':
          element.addEventListener('change', this.changeHandler);
          break;
        default:
          break;
      }
    }
  }, {
    key: "removeElementHandlers",
    value: function removeElementHandlers(element) {
      switch (element.tagName) {
        case 'input':
          switch (element.type) {
            case 'checkbox':
              element.removeEventListener('click', this.changeHandler);
              break;
            case 'text':
              element.addEventListener('blur', this.changeHandler);
              break;
          }
          break;
        case 'textarea':
          element.removeEventListener('change', this.changeHandler);
          break;
        case 'select':
          element.removeEventListener('change', this.changeHandler);
          break;
        default:
          break;
      }
    }
  }, {
    key: "findChildById",
    value: function findChildById(id) {
      var element = this.element.querySelector('#' + id);
      if (!element) {
        throw new Error('Element not found');
      }
      return element;
    }
  }, {
    key: "findChildrenByName",
    value: function findChildrenByName(name) {
      var elements = this.element.querySelectorAll('[name="' + name + '"]');
      if (elements.length === 0) {
        throw new Error('Elements not found');
      }
      return Array.from(elements);
    }
  }, {
    key: "findChildByRole",
    value: function findChildByRole(role) {
      var element = this.element.querySelector('[data-role="' + role + '"]');
      if (!element) {
        throw new Error('Element not found');
      }
      return element;
    }
  }, {
    key: "init",
    value: function init() {}
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
    key: "getRadiosValue",
    value: function getRadiosValue(elements, def) {
      var result = def;
      elements.some(function (element) {
        return element.checked ? result = dom.attr(element, 'value') : false;
      });
      return result;
    }
  }, {
    key: "setRadiosValue",
    value: function setRadiosValue(elements, value) {
      value = String(value);
      elements.forEach(function (element) {
        return dom.attr(element, 'value') === value ? dom.attr(element, 'checked', true) : dom.attr(element, 'checked', null);
      });
    }
  }]);
}();
messengerMixin(BasePanel.prototype);
messengerTranslateMixin(BasePanel.prototype);
eventsMixin(BasePanel.prototype);
module.exports = BasePanel;

},{"../../../../common/dom/main":23,"../../../../common/utils/eventsMixin":76,"../../../../common/utils/messengerMixin":78,"../../../../common/utils/messengerTranslateMixin":79,"extend":107}],91:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var sanitize = require('sanitize-filename');
var BasePanel = require('./BasePanel');
var dom = require('../../../../common/dom/main');
var delay = require('../../../../common/utils/delay');
var ignore = require('../../../../common/lib/ignore');
var TipsPanel = require('../../../panel/src/tips/TipsPanel');
var ConfigurationMergeResult = require('../import/ConfigurationMergeResult');
var ConfigurationMergeWindow = require('../import/ConfigurationMergeWindow');
var General = function (_BasePanel) {
  function General(container) {
    var _this;
    _classCallCheck(this, General);
    _this = _callSuper(this, General, [container]);
    _this._configuration = {};
    _this._isImport = false;
    _this._clearCacheClearingText = 'Clearing...';
    _this.processClearCacheClick = _this.handleClearCacheClick.bind(_this);
    _this.processExportClick = _this.handleExportClick.bind(_this);
    _this.processImportChange = _this.handleImportChange.bind(_this);
    _this.processEmailClick = _this.handleEmailClick.bind(_this);
    _this.processSendClick = _this.handleSendClick.bind(_this);
    return _this;
  }
  _inherits(General, _BasePanel);
  return _createClass(General, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.element = this._element;
      this.t('sqOptions_general_clear_cache_clearing').then(function (text) {
        return _this2._clearCacheClearingText = text;
      })["catch"](ignore);
      this.t('sqOptions_general_title').then(function (text) {
        return dom.text(_this2.findChildByRole('title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_core_disabled_field').then(function (text) {
        return dom.text(_this2.findChildByRole('core-disabled-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_core_disabled_label').then(function (text) {
        return dom.text(_this2.findChildByRole('core-disabled-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_use_cache_field').then(function (text) {
        return dom.text(_this2.findChildByRole('use-cache-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_use_cache_label').then(function (text) {
        return dom.text(_this2.findChildByRole('use-cache-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_request_delay_field').then(function (text) {
        return dom.text(_this2.findChildByRole('request-delay-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_filename_field').then(function (text) {
        return dom.text(_this2.findChildByRole('filename-template-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_filename_0').then(function (text) {
        return dom.text(_this2.findChildByRole('filename-template-0'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_filename_1').then(function (text) {
        return dom.text(_this2.findChildByRole('filename-template-1'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_filename_2').then(function (text) {
        return dom.text(_this2.findChildByRole('filename-template-2'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_nofollow_field').then(function (text) {
        return dom.text(_this2.findChildByRole('nofollow-disabled-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_nofollow_label').then(function (text) {
        return dom.text(_this2.findChildByRole('nofollow-disabled-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_experimental_label').then(function (text) {
        return dom.text(_this2.findChildByRole('experiments-switch-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_noanalytics_title').then(function (text) {
        return dom.text(_this2.findChildByRole('noanalytics-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_noanalytics_label').then(function (text) {
        return dom.setText(_this2.findChildByRole('noanalytics-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_noanalytics_link').then(function (text) {
        return dom.text(_this2.findChildByRole('noanalytics-link'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_dropdown_panel_title').then(function (text) {
        return dom.text(_this2.findChildByRole('dropdown-panel-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_panel_mode_title').then(function (text) {
        return dom.text(_this2.findChildByRole('panel-mode-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_panel_mode_0').then(function (text) {
        return dom.text(_this2.findChildByRole('panel-mode-0'), text);
      })["catch"](ignore);
      this.t('sqOptions_general_panel_mode_1').then(function (text) {
        return dom.text(_this2.findChildByRole('panel-mode-1'), text);
      })["catch"](ignore);
      dom.text(this.findChildByRole('panel-tips-title'), this.t('sqOptions_general_panel_tips_title'));
      dom.text(this.findChildByRole('panel-tips-label'), this.t('sqOptions_general_panel_tips_label'));
      dom.text(this.els.get('clear'), this.t('sqOptions_general_clear_cache'));
      dom.text(this.findChildByRole('export-panel-title'), this.t('sqOptions_general_panel_export_title'));
      dom.text(this.findChildByRole('export-save-title'), this.t('sqOptions_general_export_save_label'));
      dom.text(this.findChildById('export-download'), this.t('sqOptions_general_export_download'));
      dom.text(this.findChildByRole('export-load-title'), this.t('sqOptions_general_export_load_label'));
      dom.setText(this.findChildByRole('export-load-file-title'), this.t('sqOptions_general_export_load_title'));
    }
  }, {
    key: "setElements",
    value: function setElements() {
      var _this3 = this;
      this.els.clear();
      this.els.set('core.disabled', this.findChildById('core-disabled'));
      this.els.set('core.use_cache', this.findChildById('use-cache'));
      this.els.set('core.request_delay', this.findChildById('request-delay'));
      this.els.set('core.export_template', this.findChildById('filename-template'));
      this.els.set('nofollow.disabled', this.findChildById('nofollow-disabled'));
      this.els.set('advanced.disabled', this.findChildById('experiments_switch'));
      this.els.set('advanced.disable_ga', this.findChildById('ga_switch'));
      this.els.set('advanced', this.findChildById('experiments'));
      this.els.set('clear', this.findChildById('button-clear-cache'));
      this.els.set('panel.mode', this.findChildrenByName('panel-mode'));
      this.els.set('panel.tips', this.findChildById('panel-tips'));
      this.els.set('export.email', this.findChildById('export-email'));
      this.els.set('export.send', this.findChildById('export-send'));
      this.els.set('export.download', this.findChildById('export-download'));
      this.els.set('export.upload', this.findChildById('export-upload'));
      this.els.forEach(function (element) {
        return _this3.addElementHandlers(element);
      });
      this.els.get('export.download').addEventListener('click', this.processExportClick);
      this.els.get('export.upload').addEventListener('change', this.processImportChange);
      this.els.get('export.email').addEventListener('click', this.processEmailClick);
      this.els.get('export.send').addEventListener('click', this.processSendClick);
      this.els.get('clear').addEventListener('click', this.processClearCacheClick);
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      var _this4 = this;
      var startTime = new Date().getTime();
      var button = this.els.get('clear');
      dom.text(button, this._clearCacheClearingText);
      dom.attr(button, 'disabled', true);
      this.registerEvent('options', 'clearCache');
      this.sendMessage('sq.clearCache').then(function () {
        return delay(500, startTime);
      }).then(function () {
        dom.text(button, _this4.t('sqOptions_general_clear_cache'));
        dom.text(button, 'Clear cache');
        dom.attr(button, 'disabled', null);
      })["catch"](function (reason) {
        ignore(reason);
        dom.text(button, 'Error');
        dom.attr(button, 'disabled', true);
      });
    }
  }, {
    key: "exportToFile",
    value: function exportToFile() {
      var now = new Date();
      var filename = 'seoquake-settings-' + sanitize(now.toLocaleDateString(), {
        replacement: '_'
      }) + '.json';
      var data = [this._configuration, this._parameters];
      var url = window.webkitURL || window.URL || window.mozURL || window.msURL;
      var a = document.createElement('a');
      a.download = filename;
      if ('chrome' === 'safari') {
        a.href = 'data:attachment/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
      } else {
        a.href = url.createObjectURL(new Blob([JSON.stringify(data)], {
          type: 'application/json'
        }));
        a.dataset.downloadurl = ['json', a.download, a.href].join(':');
      }
      var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      a.dispatchEvent(clickEvent);
    }
  }, {
    key: "importFromFile",
    value: function importFromFile(file) {
      var _this5 = this;
      var r = new FileReader();
      r.onload = function (e) {
        var jsonString = e.target.result;
        try {
          var data = JSON.parse(jsonString);
          if (data.length === 2) {
            var configuration = data[0];
            var parameters = data[1];
            var merger = new ConfigurationMergeResult(configuration, parameters);
            var checker = new ConfigurationMergeWindow(undefined, {}, merger, _this5._configuration, _this5._parameters);
            checker.setTranslateFunction(_this5.t.bind(_this5));
            checker.init();
            checker.addEventListener('import', function (merger) {
              _this5._configuration = merger.mergeConfiguration();
              _this5._parameters = merger.mergeParameters();
              _this5._isImport = true;
              _this5._changeHandler();
              checker.close();
            });
            checker.show();
          } else {
            alert('Looks like not SEOquake configuration file.');
          }
        } catch (e) {
          ignore(e);
        }
      };
      r.readAsText(file);
    }
  }, {
    key: "element",
    get: function get() {
      return _get(_getPrototypeOf(General.prototype), "element", this);
    },
    set: function set(value) {
      var _this6 = this;
      _set(_getPrototypeOf(General.prototype), "element", value, this, true);
      this.els.forEach(function (element) {
        return _this6.removeElementHandlers(element);
      });
      this.setElements();
    }
  }, {
    key: "configuration",
    get: function get() {
      if (this._isImport) {
        this._isImport = false;
        return this._configuration;
      }
      var result = {};
      result.core = {
        disabled: !this.els.get('core.disabled').checked,
        use_cache: this.els.get('core.use_cache').checked,
        request_delay: parseInt(dom.value(this.els.get('core.request_delay'))),
        export_template: parseInt(dom.value(this.els.get('core.export_template')))
      };
      result.nofollow = {
        disabled: !this.els.get('nofollow.disabled').checked
      };
      result.advanced = {
        disabled: !this.els.get('advanced.disabled').checked
      };
      result.panel = {
        mode: parseInt(this.getRadiosValue(this.els.get('panel.mode'), '0'))
      };
      if (this.els.get('panel.tips').checked) {
        result.panel.last_tip = 0;
      } else {
        result.panel.last_tip = TipsPanel.ITEMS_LIST.length;
      }
      if (!result.advanced.disabled) {
        result.advanced.disable_ga = this.els.get('advanced.disable_ga').checked;
      } else {
        result.advanced.disable_ga = false;
      }
      return result;
    },
    set: function set(value) {
      this._changed = false;
      this._configuration = value;
      this.els.get('core.disabled').checked = value.core.disabled === false;
      this.els.get('core.use_cache').checked = value.core.use_cache === true;
      dom.value(this.els.get('core.request_delay'), (value.core.request_delay || 500).toString());
      dom.value(this.els.get('core.export_template'), (value.core.export_template || 0).toString());
      this.els.get('nofollow.disabled').checked = value.nofollow.disabled === false;
      this.els.get('advanced.disabled').checked = value.advanced.disabled === false;
      if (!value.advanced.disabled) {
        dom.removeClass(this.els.get('advanced'), 'hidden');
      } else {
        dom.addClass(this.els.get('advanced'), 'hidden');
      }
      this.els.get('advanced.disable_ga').checked = value.advanced.disable_ga === true;
      this.setRadiosValue(this.els.get('panel.mode'), value.panel.mode);
      this.els.get('panel.tips').checked = value.panel.last_tip === 0;
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._parameters;
    },
    set: function set(value) {
      this._parameters = value;
      this._changed = false;
    }
  }, {
    key: "handleClearCacheClick",
    value: function handleClearCacheClick(event) {
      event.preventDefault();
      this.clearCache();
    }
  }, {
    key: "handleExportClick",
    value: function handleExportClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.exportToFile();
      this.registerEvent('options', 'exportToJson');
    }
  }, {
    key: "handleImportChange",
    value: function handleImportChange(event) {
      this.registerEvent('options', 'importFromJsonClick');
      try {
        var f = event.target.files[0];
        if (f) {
          if (f.size < 500000) {
            this.importFromFile(f);
            this.registerEvent('options', 'importFromJson');
          }
        }
      } catch (e) {
        ignore(e);
      }
      dom.clearValue(event.target);
    }
  }, {
    key: "handleEmailClick",
    value: function handleEmailClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.registerEvent('options', 'exportEmailClick');
    }
  }, {
    key: "handleSendClick",
    value: function handleSendClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.registerEvent('options', 'exportSendClick');
    }
  }]);
}(BasePanel);
module.exports = General;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":52,"../../../../common/utils/delay":74,"../../../panel/src/tips/TipsPanel":96,"../import/ConfigurationMergeResult":85,"../import/ConfigurationMergeWindow":86,"./BasePanel":90,"sanitize-filename":112}],92:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BasePanel = require('./BasePanel');
var dom = require('../../../../common/dom/main');
var messengerMixin = require('../../../../common/utils/messengerMixin');
var isEmpty = require('../../../../common/lib/isEmpty');
var ApiError = require('../../../../common/semrush/ApiError');
var ApiErrorTimeout = require('../../../../common/semrush/ApiErrorTimeout');
var MessageWindow = require('../../../../common/effects/MessageWindow');
var SemrushIntegration = require('../integration/SemrushIntegration');
var Integration = function (_BasePanel) {
  function Integration(container) {
    var _this;
    _classCallCheck(this, Integration);
    _this = _callSuper(this, Integration, [container]);
    _this._semrush = null;
    return _this;
  }
  _inherits(Integration, _BasePanel);
  return _createClass(Integration, [{
    key: "setElements",
    value: function setElements() {
      var _this2 = this;
      this._elements.clear();
      this._elements.forEach(function (element) {
        return _this2.addElementHandlers(element);
      });
    }
  }, {
    key: "init",
    value: function init() {
      this.element = this._element;
      this._semrush = new SemrushIntegration(this.element);
      this._semrush.setMessenger(this.getMessenger());
      this._semrush.init();
      this._semrush.addEventListener('hasAccount', this.changeHandler);
      this._semrush.addEventListener('clearedAccount', this.changeHandler);
    }
  }, {
    key: "element",
    get: function get() {
      return _get(_getPrototypeOf(Integration.prototype), "element", this);
    },
    set: function set(value) {
      var _this3 = this;
      _set(_getPrototypeOf(Integration.prototype), "element", value, this, true);
      this._elements.forEach(function (element) {
        return _this3.removeElementHandlers(element);
      });
      this.setElements();
    }
  }, {
    key: "configuration",
    get: function get() {
      var result = {};
      result.integration = {
        semrush_account: this._semrush.account
      };
      return result;
    },
    set: function set(value) {
      this._changed = false;
      if ('integration' in value) {
        if (!isEmpty(value.integration, 'semrush_account') && !isEmpty(value.integration, 'semrush_token')) {
          this._semrush.account = value.integration.semrush_account;
          this._semrush.token = value.integration.semrush_token;
          this._semrush.reload();
        } else {
          this._semrush.stateConnect();
        }
      } else {
        this._semrush.stateConnect();
      }
    }
  }]);
}(BasePanel);
messengerMixin(Integration.prototype);
module.exports = Integration;

},{"../../../../common/dom/main":23,"../../../../common/effects/MessageWindow":38,"../../../../common/lib/isEmpty":55,"../../../../common/semrush/ApiError":70,"../../../../common/semrush/ApiErrorTimeout":71,"../../../../common/utils/messengerMixin":78,"../integration/SemrushIntegration":88,"./BasePanel":90}],93:[function(require,module,exports){
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
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BasePanel = require('./BasePanel');
var dom = require('../../../../common/dom/main');
var ParametersTable = require('../../../../common/parameters/ParametersTable');
var ParameterForm = require('../ParameterForm');
var shortHash = require('../../../../common/lib/shortHash');
var ParametersRestoreMenu = require('../ParametersRestoreMenu');
var ignore = require('../../../../common/lib/ignore');
var Parameters = function (_BasePanel) {
  function Parameters(container) {
    var _this;
    _classCallCheck(this, Parameters);
    _this = _callSuper(this, Parameters, [container]);
    _this._restoreMenu = null;
    _this._table = null;
    return _this;
  }
  _inherits(Parameters, _BasePanel);
  return _createClass(Parameters, [{
    key: "T",
    value: function T(message) {
      return this.t('sqOptions_parameters_' + message);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(Parameters.prototype), "init", this).call(this);
      this._table = new ParametersTable('', function (data) {
        return _this2._createParameterForm(data);
      });
      this._table.setTranslateFunction(this.T.bind(this));
      this._table.addEventListener('userUpdated', this.changeHandler);
      this._table.addEventListener('deleteParameter', function (id) {
        return _this2.deleteParameter(id);
      });
      this._table.element = null;
      this.element = this._element;
      dom.text(this.findChildByRole('title'), this.T('title'));
      dom.text(this.findChildById('button-create-parameter'), this.T('new_parameter'));
      dom.text(this.findChildById('button-restore-parameters'), this.T('reset'));
    }
  }, {
    key: "_createParameterForm",
    value: function _createParameterForm(data) {
      var result = new ParameterForm(data, undefined, {
        autoInit: false
      });
      result.setTranslateFunction(this.T.bind(this));
      result.init();
      return result;
    }
  }, {
    key: "deleteParameter",
    value: function deleteParameter(id) {
      this._sendMessage('sq.deleteParameter', {
        id: id
      }).then(this.changeHandler)["catch"](ignore);
    }
  }, {
    key: "openCreateParameterWindow",
    value: function openCreateParameterWindow() {
      var _this3 = this;
      var parameterWindow = this._createParameterForm();
      parameterWindow.addEventListener('okClick', function (newParameter) {
        var paramId = shortHash(new Date().getTime().toString());
        while (_this3._parameters.hasOwnProperty(paramId)) {
          paramId = shortHash(new Date().getTime().toString());
        }
        if (!('name' in newParameter) || !('title' in newParameter)) {
          _this3.t('sqOptions_parameters_new_parameter_error').then(function (msg) {
            return alert(msg);
          })["catch"](ignore);
          return false;
        }
        newParameter.id = paramId;
        newParameter.disabled = [];
        newParameter.state = 'custom';
        _this3._parameters[paramId] = newParameter;
        _this3._table.value = _this3._parameters;
        _this3.changeHandler();
        _this3.registerEvent('options', 'saveCustomParameter', paramId);
        parameterWindow.close();
      });
      parameterWindow.addEventListener('cancelClick', function () {
        return parameterWindow.close();
      });
      parameterWindow.show();
    }
  }, {
    key: "element",
    get: function get() {
      return _get(_getPrototypeOf(Parameters.prototype), "element", this);
    },
    set: function set(value) {
      var _this4 = this;
      _set(_getPrototypeOf(Parameters.prototype), "element", value, this, true);
      this.findChildById('parameters-table-container').appendChild(this._table.element);
      this.findChildById('button-create-parameter').addEventListener('click', function (event) {
        return _this4.openCreateParameterWindow();
      });
      this._restoreMenu = new ParametersRestoreMenu(this.findChildById('button-restore-parameters'));
      this._restoreMenu.setMessenger(this.getMessenger());
      this._restoreMenu.setTranslateFunction(this.T.bind(this));
      this._restoreMenu.addEventListener('done', function () {
        return _this4.dispatchEvent('reload');
      });
      this._restoreMenu.init();
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._table.value;
    },
    set: function set(value) {
      this._changed = false;
      _set(_getPrototypeOf(Parameters.prototype), "parameters", value, this, true);
      this._table.value = value;
    }
  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(Parameters.prototype), "hide", this).call(this);
      this._table.onHide();
    }
  }, {
    key: "show",
    value: function show() {
      _get(_getPrototypeOf(Parameters.prototype), "show", this).call(this);
      this._table.onShow();
    }
  }]);
}(BasePanel);
module.exports = Parameters;

},{"../../../../common/dom/main":23,"../../../../common/lib/ignore":52,"../../../../common/lib/shortHash":62,"../../../../common/parameters/ParametersTable":69,"../ParameterForm":83,"../ParametersRestoreMenu":84,"./BasePanel":90}],94:[function(require,module,exports){
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
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BasePanel = require('./BasePanel');
var dom = require('../../../../common/dom/main');
var ParametersCheckboxes = require('../../../../common/parameters/ParametersCheckboxes');
var lib = require('../../../../common/Lib');
var ignore = require('../../../../common/lib/ignore');
var Seobar = function (_BasePanel) {
  function Seobar(container) {
    var _this;
    _classCallCheck(this, Seobar);
    _this = _callSuper(this, Seobar, [container]);
    _this._checkboxes = null;
    _this.processExcludeBlur = _this.handleExcludeBlur.bind(_this);
    _this.processMatchesBlur = _this.handleMatchesBlur.bind(_this);
    return _this;
  }
  _inherits(Seobar, _BasePanel);
  return _createClass(Seobar, [{
    key: "T",
    value: function T(message) {
      return this.t('sqOptions_seobar_' + message);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(Seobar.prototype), "init", this).call(this);
      this._checkboxes = new ParametersCheckboxes('seobar');
      this._checkboxes.setTranslateFunction(this.t.bind(this));
      this._checkboxes.addEventListener('userUpdated', this.changeHandler);
      this._checkboxes.init();
      this.element = this._element;
      this.T('title').then(function (text) {
        return dom.text(_this2.findChildByRole('title'), text);
      })["catch"](ignore);
      this.T('loading_title').then(function (text) {
        return dom.text(_this2.findChildByRole('loading-title'), text);
      })["catch"](ignore);
      this.T('disabled_title').then(function (text) {
        return dom.text(_this2.findChildByRole('disabled-title'), text);
      })["catch"](ignore);
      this.T('disabled_label').then(function (text) {
        return dom.text(_this2.findChildByRole('disabled-label'), text);
      })["catch"](ignore);
      this.T('https_title').then(function (text) {
        return dom.text(_this2.findChildByRole('https-title'), text);
      })["catch"](ignore);
      this.T('https_label').then(function (text) {
        return dom.text(_this2.findChildByRole('https-label'), text);
      })["catch"](ignore);
      this.T('load_title').then(function (text) {
        return dom.text(_this2.findChildByRole('load-title'), text);
      })["catch"](ignore);
      this.T('load_mode_0').then(function (text) {
        return dom.text(_this2.findChildByRole('load-mode-0'), text);
      })["catch"](ignore);
      this.T('load_mode_1').then(function (text) {
        return dom.text(_this2.findChildByRole('load-mode-1'), text);
      })["catch"](ignore);
      this.T('position_title').then(function (text) {
        return dom.text(_this2.findChildByRole('position-title'), text);
      })["catch"](ignore);
      this.T('position_horizontal').then(function (text) {
        return dom.text(_this2.findChildByRole('position-horizontal'), text);
      })["catch"](ignore);
      this.T('position_horizontal_bottom').then(function (text) {
        return dom.text(_this2.findChildByRole('position-horizontal-bottom'), text);
      })["catch"](ignore);
      this.T('position_vertical_left').then(function (text) {
        return dom.text(_this2.findChildByRole('position-vertical-left'), text);
      })["catch"](ignore);
      this.T('position_vertical_right').then(function (text) {
        return dom.text(_this2.findChildByRole('position-vertical-right'), text);
      })["catch"](ignore);
      this.T('color_title').then(function (text) {
        return dom.text(_this2.findChildByRole('color-title'), text);
      })["catch"](ignore);
      this.T('color_light').then(function (text) {
        return dom.text(_this2.findChildByRole('color-light'), text);
      })["catch"](ignore);
      this.T('color_dark').then(function (text) {
        return dom.text(_this2.findChildByRole('color-dark'), text);
      })["catch"](ignore);
      this.T('parameters_title').then(function (text) {
        return dom.text(_this2.findChildByRole('parameters-title'), text);
      })["catch"](ignore);
      this.T('special_parameters_title').then(function (text) {
        return dom.text(_this2.findChildByRole('special-parameters-title'), text);
      })["catch"](ignore);
      this.T('pageinfo_title').then(function (text) {
        return dom.text(_this2.findChildByRole('pageinfo-title'), text);
      })["catch"](ignore);
      this.T('pageinfo_label').then(function (text) {
        return dom.text(_this2.findChildByRole('pageinfo-label'), text);
      })["catch"](ignore);
      this.T('density_title').then(function (text) {
        return dom.text(_this2.findChildByRole('density-title'), text);
      })["catch"](ignore);
      this.T('density_label').then(function (text) {
        return dom.text(_this2.findChildByRole('density-label'), text);
      })["catch"](ignore);
      this.T('diagnosis_title').then(function (text) {
        return dom.text(_this2.findChildByRole('diagnosis-title'), text);
      })["catch"](ignore);
      this.T('diagnosis_label').then(function (text) {
        return dom.text(_this2.findChildByRole('diagnosis-label'), text);
      })["catch"](ignore);
      this.T('robots_title').then(function (text) {
        return dom.text(_this2.findChildByRole('robots-title'), text);
      })["catch"](ignore);
      this.T('robots_label').then(function (text) {
        return dom.text(_this2.findChildByRole('robots-label'), text);
      })["catch"](ignore);
      this.T('sitemap_title').then(function (text) {
        return dom.text(_this2.findChildByRole('sitemap-title'), text);
      })["catch"](ignore);
      this.T('sitemap_label').then(function (text) {
        return dom.text(_this2.findChildByRole('sitemap-label'), text);
      })["catch"](ignore);
      this.T('linkinfo_title').then(function (text) {
        return dom.text(_this2.findChildByRole('linkinfo-title'), text);
      })["catch"](ignore);
      this.T('linkinfo_label').then(function (text) {
        return dom.text(_this2.findChildByRole('linkinfo-label'), text);
      })["catch"](ignore);
      this.T('filters_title').then(function (text) {
        return dom.text(_this2.findChildByRole('filters-title'), text);
      })["catch"](ignore);
      this.T('exclude_title').then(function (text) {
        return dom.text(_this2.findChildByRole('exclude-title'), text);
      })["catch"](ignore);
      this.T('exclude_message').then(function (text) {
        return dom.text(_this2.findChildByRole('exclude-message'), text);
      })["catch"](ignore);
      this.T('exclude_list').then(function (text) {
        return dom.attr(_this2.findChildById('seobar-exclude'), 'placeholder', text);
      })["catch"](ignore);
      dom.text(this.findChildByRole('match-title'), this.T('match_title'));
      dom.text(this.findChildByRole('match-message'), this.T('match_message'));
      this.T('match_list').then(function (text) {
        return dom.attr(_this2.findChildById('seobar-match'), 'placeholder', text);
      })["catch"](ignore);
      dom.text(this.findChildByRole('siteaudit-title'), this.T('siteaudit_title'));
      dom.text(this.findChildByRole('siteaudit-label'), this.T('siteaudit_label'));
      dom.text(this.findChildByRole('pinned-title'), this.T('pinned_title'));
      dom.text(this.findChildByRole('pinned-label'), this.T('pinned_label'));
    }
  }, {
    key: "setElements",
    value: function setElements() {
      var _this3 = this;
      this.els.clear();
      this.els.set('seobar.disabled', this.findChildById('seobar-disabled'));
      this.els.set('seobar.https', this.findChildById('seobar-https'));
      this.els.set('seobar.position', this.findChildrenByName('seobar-position'));
      this.els.set('seobar.color', this.findChildrenByName('seobar-color'));
      this.els.set('seobar.mode', this.findChildrenByName('seobar-mode'));
      this.els.set('seobar.style', this.findChildrenByName('seobar-style'));
      this.els.set('seobar.open_minimized', this.findChildById('seobar-open-minimized'));
      this.els.set('seobar.excludes', this.findChildById('seobar-exclude'));
      this.els.set('seobar.matches', this.findChildById('seobar-match'));
      this.els.set('seobar.robotsLink', this.findChildById('seobar-robotsLink'));
      this.els.set('seobar.sitemapLink', this.findChildById('seobar-sitemapLink'));
      this.els.set('seobar.densityLink', this.findChildById('seobar-densityLink'));
      this.els.set('seobar.linkinfoLink', this.findChildById('seobar-linkinfoLink'));
      this.els.set('seobar.diagnosisLink', this.findChildById('seobar-diagnosisLink'));
      this.els.set('seobar.pageinfoLink', this.findChildById('seobar-pageinfoLink'));
      this.els.set('seobar.siteauditLink', this.findChildById('seobar-siteaditLink'));
      this.els.set('seobar.pinned', this.findChildById('seobar-pinned'));
      this.els.forEach(function (element) {
        if (element instanceof Array) {
          element.forEach(function (item) {
            return _this3.addElementHandlers(item);
          });
        } else {
          _this3.addElementHandlers(element);
        }
      });
      this.els.get('seobar.excludes').addEventListener('blur', this.processExcludeBlur);
      this.els.get('seobar.matches').addEventListener('blur', this.processMatchesBlur);
    }
  }, {
    key: "element",
    get: function get() {
      return _get(_getPrototypeOf(Seobar.prototype), "element", this);
    },
    set: function set(value) {
      var _this4 = this;
      _set(_getPrototypeOf(Seobar.prototype), "element", value, this, true);
      this.els.forEach(function (element) {
        return _this4.removeElementHandlers(element);
      });
      this.setElements();
      this.findChildById('seobar-parameters-container').appendChild(this._checkboxes.element);
    }
  }, {
    key: "configuration",
    get: function get() {
      var result = {};
      result.seobar = {
        disabled: !this.els.get('seobar.disabled').checked,
        https: this.els.get('seobar.https').checked,
        mode: parseInt(this.getRadiosValue(this.els.get('seobar.mode'), '0')),
        position: this.getRadiosValue(this.els.get('seobar.position'), 'top'),
        color: this.getRadiosValue(this.els.get('seobar.color'), 'green'),
        style: this.getRadiosValue(this.els.get('seobar.style'), 'horizontal-inpage'),
        open_minimized: this.els.get('seobar.open_minimized').checked,
        excludes: this.processExcludeList(dom.value(this.els.get('seobar.excludes'))),
        matches: this.processExcludeList(dom.value(this.els.get('seobar.matches'))),
        robotsLink: this.els.get('seobar.robotsLink').checked,
        sitemapLink: this.els.get('seobar.sitemapLink').checked,
        densityLink: this.els.get('seobar.densityLink').checked,
        linkinfoLink: this.els.get('seobar.linkinfoLink').checked,
        diagnosisLink: this.els.get('seobar.diagnosisLink').checked,
        pageinfoLink: this.els.get('seobar.pageinfoLink').checked,
        siteauditLink: this.els.get('seobar.siteauditLink').checked,
        pinned: this.els.get('seobar.pinned').checked
      };
      return result;
    },
    set: function set(value) {
      this._changed = false;
      this.els.get('seobar.disabled').checked = value.seobar.disabled === false;
      this.els.get('seobar.https').checked = value.seobar.https === true;
      this.setRadiosValue(this.els.get('seobar.mode'), value.seobar.mode);
      this.setRadiosValue(this.els.get('seobar.style'), value.seobar.style);
      this.setRadiosValue(this.els.get('seobar.position'), value.seobar.position);
      this.setRadiosValue(this.els.get('seobar.color'), value.seobar.color);
      this.els.get('seobar.open_minimized').checked = value.seobar.open_minimized === true;
      dom.value(this.els.get('seobar.excludes'), value.seobar.excludes.toString());
      dom.value(this.els.get('seobar.matches'), value.seobar.matches.toString());
      this.els.get('seobar.robotsLink').checked = value.seobar.robotsLink === true;
      this.els.get('seobar.sitemapLink').checked = value.seobar.sitemapLink === true;
      this.els.get('seobar.densityLink').checked = value.seobar.densityLink === true;
      this.els.get('seobar.linkinfoLink').checked = value.seobar.linkinfoLink === true;
      this.els.get('seobar.diagnosisLink').checked = value.seobar.diagnosisLink === true;
      this.els.get('seobar.pageinfoLink').checked = value.seobar.pageinfoLink === true;
      this.els.get('seobar.siteauditLink').checked = value.seobar.siteauditLink === true;
      if (['left', 'right'].indexOf(value.seobar.position) !== -1) {
        dom.attr(this.els.get('seobar.pinned'), 'disabled', null);
        this.els.get('seobar.pinned').checked = value.seobar.pinned === true;
      } else {
        dom.attr(this.els.get('seobar.pinned'), 'disabled', true);
        this.els.get('seobar.pinned').checked = false;
      }
    }
  }, {
    key: "parameters",
    get: function get() {
      return this._checkboxes.value;
    },
    set: function set(value) {
      this._changed = false;
      _set(_getPrototypeOf(Seobar.prototype), "parameters", value, this, true);
      this._checkboxes.value = value;
    }
  }, {
    key: "processExcludeList",
    value: function processExcludeList(input) {
      var nettoval = lib.trim(lib.stripTags(input));
      var prearr = nettoval.split(/[\n]/, lib.SEOQUAKE_MAX_HIGHLIGHT_SITES);
      prearr.forEach(function (item, index, array) {
        return array[index] = lib.trim(item);
      });
      prearr = prearr.filter(function (item) {
        return item.length > 0;
      });
      return prearr.join('\n');
    }
  }, {
    key: "countItemsInList",
    value: function countItemsInList(input) {
      var nettoval = lib.trim(lib.stripTags(input));
      var prearr = nettoval.split(/[\n]/, lib.SEOQUAKE_MAX_HIGHLIGHT_SITES);
      prearr.forEach(function (item, index, array) {
        return array[index] = lib.trim(item);
      });
      prearr = prearr.filter(function (item) {
        return item.length > 0;
      });
      return prearr.length;
    }
  }, {
    key: "handleExcludeBlur",
    value: function handleExcludeBlur(event) {
      this.registerEvent('options', 'SEObar set blacklist', this.countItemsInList(dom.value(event.currentTarget)));
    }
  }, {
    key: "handleMatchesBlur",
    value: function handleMatchesBlur(event) {
      this.registerEvent('options', 'SEObar set whitelist', this.countItemsInList(dom.value(event.currentTarget)));
    }
  }]);
}(BasePanel);
module.exports = Seobar;

},{"../../../../common/Lib":5,"../../../../common/dom/main":23,"../../../../common/lib/ignore":52,"../../../../common/parameters/ParametersCheckboxes":67,"./BasePanel":90}],95:[function(require,module,exports){
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
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BasePanel = require('./BasePanel');
var dom = require('../../../../common/dom/main');
var ParametersCheckboxes = require('../../../../common/parameters/ParametersCheckboxes');
var TabsSwitch = require('../../../../common/effects/TabsSwitch');
var extend = require('extend');
var lib = require('../../../../common/Lib');
var HighlightList = require('../import/HighlightList');
var ignore = require('../../../../common/lib/ignore');
var Serp = function (_BasePanel) {
  function Serp(container) {
    var _this;
    _classCallCheck(this, Serp);
    _this = _callSuper(this, Serp, [container]);
    _this._serps = ['google', 'yahoo', 'bing', 'yandex', 'semrush'];
    _this._checkboxes = new Map();
    _this._highlightList = null;
    return _this;
  }
  _inherits(Serp, _BasePanel);
  return _createClass(Serp, [{
    key: "T",
    value: function T(message) {
      return this.t('sqOptions_serp_' + message);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      _get(_getPrototypeOf(Serp.prototype), "init", this).call(this);
      this._serps.forEach(function (serp) {
        var checkboxes = new ParametersCheckboxes(serp);
        checkboxes.setTranslateFunction(_this2.t.bind(_this2));
        checkboxes.init();
        checkboxes.addEventListener('userUpdated', _this2.changeHandler);
        _this2._checkboxes.set(serp, checkboxes);
      });
      this._tabs = new TabsSwitch({
        title: 'Active parameters in SERP overlay',
        headerClass: 'block-header',
        panelsClass: 'block-body'
      });
      this.element = this._element;
      this.t('sqOptions_serp_title').then(function (text) {
        return dom.text(_this2.findChildByRole('title'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_tabs_title').then(function (text) {
        return _this2._tabs.title = text;
      })["catch"](ignore);
      this.t('sqOptions_serp_general_title').then(function (text) {
        return dom.text(_this2.findChildByRole('general-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_numbers').then(function (text) {
        return dom.text(_this2.findChildByRole('numbers'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_numbers_label').then(function (text) {
        return dom.text(_this2.findChildByRole('numbers-label'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show').then(function (text) {
        return dom.text(_this2.findChildByRole('show'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show_google').then(function (text) {
        return dom.text(_this2.findChildByRole('show-google'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show_yahoo').then(function (text) {
        return dom.text(_this2.findChildByRole('show-yahoo'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show_bing').then(function (text) {
        return dom.text(_this2.findChildByRole('show-bing'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show_yandex').then(function (text) {
        return dom.text(_this2.findChildByRole('show-yandex'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_show_semrush').then(function (text) {
        return dom.text(_this2.findChildByRole('show-semrush'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_parameters_title').then(function (text) {
        return dom.text(_this2.findChildByRole('parameters-title'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_parameters_load').then(function (text) {
        return dom.text(_this2.findChildByRole('parameters-load'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_load_mode_0').then(function (text) {
        return dom.text(_this2.findChildByRole('load-mode-0'), text);
      })["catch"](ignore);
      this.t('sqOptions_serp_load_mode_1').then(function (text) {
        return dom.text(_this2.findChildByRole('load-mode-1'), text);
      })["catch"](ignore);
      dom.text(this.findChildByRole('keyword-difficulty'), this.T('keyword_difficulty'));
      dom.text(this.findChildByRole('keyword-difficulty-label'), this.T('keyword_difficulty_label'));
      dom.text(this.findChildByRole('trust-score'), this.T('trust_score'));
      dom.text(this.findChildByRole('trust-score-label'), this.T('trust_score_label'));
      this.T('highlight_title').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-title'), text);
      })["catch"](ignore);
      this.T('highlight_field').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-field'), text);
      })["catch"](ignore);
      this.T('highlight_label').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-label'), text);
      })["catch"](ignore);
      this.T('highlight_list').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-list'), text);
      })["catch"](ignore);
      this.T('highlight_import_message').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-import-message'), text);
      })["catch"](ignore);
      this.T('highlight_import_button').then(function (text) {
        return dom.text(_this2.findChildById('import_highlight_button'), text);
      })["catch"](ignore);
      this.T('highlight_color').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-color'), text);
      })["catch"](ignore);
      this.T('highlight_red').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-red'), text);
      })["catch"](ignore);
      this.T('highlight_orange').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-orange'), text);
      })["catch"](ignore);
      this.T('highlight_yellow').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-yellow'), text);
      })["catch"](ignore);
      this.T('highlight_green').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-green'), text);
      })["catch"](ignore);
      this.T('highlight_turquoise').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-turquoise'), text);
      })["catch"](ignore);
      this.T('highlight_blue').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-blue'), text);
      })["catch"](ignore);
      this.T('highlight_purple').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-purple'), text);
      })["catch"](ignore);
      this.T('highlight_pink').then(function (text) {
        return dom.text(_this2.findChildByRole('highlight-pink'), text);
      })["catch"](ignore);
    }
  }, {
    key: "setElements",
    value: function setElements() {
      var _this3 = this;
      this.els.clear();
      this.els.set('core.disable_serps_pos_numbers', this.findChildById('disable_serps_pos_numbers'));
      this.els.set('google.show_keyword_difficulty', this.findChildById('show_keyword_difficulty'));
      this.els.set('searchbar.mode', this.findChildrenByName('serps-all-mode'));
      this.els.set('searchbar.show_semrush_panel', this.findChildById('show_semrush_panel'));
      this._serps.forEach(function (serp) {
        return _this3.els.set(serp + '.disabled', _this3.findChildById(serp + '-disabled'));
      });
      this.els.set('core.disable_highlight_sites', this.findChildById('disable-highlight-sites'));
      this.els.set('core.highlight_sites_color', this.findChildById('highlight-sites-color'));
      this.els.set('core.highlight_sites', this.findChildById('highlight-sites'));
      this.els.set('import_highlight', this.findChildById('import_highlight'));
      this.els.set('import_button', this.findChildById('import_highlight_button'));
      this.els.set('import_file', this.findChildById('import_file_name'));
      this.els.forEach(function (element) {
        if (element instanceof Array) {
          element.forEach(function (item) {
            return _this3.addElementHandlers(item);
          });
        } else {
          _this3.addElementHandlers(element);
        }
      });
    }
  }, {
    key: "processHightlightList",
    value: function processHightlightList(input) {
      var nettoval = lib.trim(lib.stripTags(input));
      var prearr = nettoval.split(/[\n,; ]/, lib.SEOQUAKE_MAX_HIGHLIGHT_SITES);
      prearr.forEach(function (item, index, array) {
        return array[index] = lib.trim(item);
      });
      prearr = prearr.filter(function (item) {
        return item.length > 0;
      });
      return prearr.join('\n');
    }
  }, {
    key: "element",
    get: function get() {
      return _get(_getPrototypeOf(Serp.prototype), "element", this);
    },
    set: function set(value) {
      var _this4 = this;
      _set(_getPrototypeOf(Serp.prototype), "element", value, this, true);
      this.els.forEach(function (element) {
        return _this4.removeElementHandlers(element);
      });
      this.setElements();
      this._checkboxes.forEach(function (panel, key) {
        return _this4._tabs.addTab(key, key, panel.element);
      });
      this.findChildById('searchbar-parameters-container').appendChild(this._tabs.element);
      this._highlightList = new HighlightList(this.els.get('import_button'), this.els.get('import_file'));
      this._highlightList.autoInit();
      this._highlightList.addEventListener('data', function (result) {
        dom.value(_this4.els.get('core.highlight_sites'), result);
        _this4.changeHandler();
      });
    }
  }, {
    key: "configuration",
    get: function get() {
      var _this5 = this;
      var result = {};
      result.core = {
        disable_serps_pos_numbers: !this.els.get('core.disable_serps_pos_numbers').checked,
        disable_highlight_sites: !this.els.get('core.disable_highlight_sites').checked,
        highlight_sites_color: dom.value(this.els.get('core.highlight_sites_color')),
        highlight_sites: this.processHightlightList(dom.value(this.els.get('core.highlight_sites')))
      };
      var mode = parseInt(this.getRadiosValue(this.els.get('searchbar.mode'), '0'));
      var showSemrushPanel = this.els.get('searchbar.show_semrush_panel').checked;
      this._serps.forEach(function (serp) {
        result[serp] = {
          disabled: !_this5.els.get(serp + '.disabled').checked,
          mode: mode,
          show_semrush_panel: showSemrushPanel
        };
      });
      result.google.show_keyword_difficulty = this.els.get('google.show_keyword_difficulty').checked;
      return result;
    },
    set: function set(value) {
      var _this6 = this;
      this._changed = false;
      this.els.get('core.disable_serps_pos_numbers').checked = value.core.disable_serps_pos_numbers === false;
      this.els.get('google.show_keyword_difficulty').checked = value.google.show_keyword_difficulty === true;
      var mode = this._serps.reduce(function (previous, serp) {
        return Math.max(previous, value[serp].mode);
      }, 0);
      this.setRadiosValue(this.els.get('searchbar.mode'), mode);
      this.els.get('searchbar.show_semrush_panel').checked = this._serps.reduce(function (previous, serp) {
        return previous && value[serp].show_semrush_panel;
      });
      this._serps.forEach(function (serp) {
        return _this6.els.get(serp + '.disabled').checked = value[serp].disabled === false;
      });
      this.els.get('core.disable_highlight_sites').checked = value.core.disable_highlight_sites === false;
      dom.value(this.els.get('core.highlight_sites_color'), (value.core.highlight_sites_color || '').toString());
      dom.value(this.els.get('core.highlight_sites'), value.core.highlight_sites.toString());
      if (!value.advanced.disabled) {
        dom.removeClass(this.els.get('import_highlight'), 'hidden');
      } else {
        dom.addClass(this.els.get('import_highlight'), 'hidden');
      }
    }
  }, {
    key: "parameters",
    get: function get() {
      var parameters = _get(_getPrototypeOf(Serp.prototype), "parameters", this);
      this._checkboxes.forEach(function (checkbox) {
        if (checkbox.changed) {
          parameters = extend(false, parameters, checkbox.value);
        }
      });
      return parameters;
    },
    set: function set(value) {
      this._changed = false;
      _set(_getPrototypeOf(Serp.prototype), "parameters", value, this, true);
      this._checkboxes.forEach(function (checkbox) {
        return checkbox.value = value;
      });
    }
  }]);
}(BasePanel);
module.exports = Serp;

},{"../../../../common/Lib":5,"../../../../common/dom/main":23,"../../../../common/effects/TabsSwitch":41,"../../../../common/lib/ignore":52,"../../../../common/parameters/ParametersCheckboxes":67,"../import/HighlightList":87,"./BasePanel":90,"extend":107}],96:[function(require,module,exports){
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

},{"../../../../common/dom/main":23,"../../../../common/effects/FxLeft":35,"../../../../common/lib/ignore":52,"../../../../common/utils/eventsMixin":76,"../../../../common/utils/translateMixin":80}],97:[function(require,module,exports){
'use strict';

var OptionsBase = require('modules/options/src/OptionsBase');
var client = require('browser/Client');
function init() {
  var options = new OptionsBase();
  options.setMessenger(client);
  options.init();
}
if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, true);
}

},{"browser/Client":1,"modules/options/src/OptionsBase":81}],98:[function(require,module,exports){
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

},{"to-camel-case":99}],99:[function(require,module,exports){

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
},{"to-space-case":101}],100:[function(require,module,exports){

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
},{}],101:[function(require,module,exports){

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
},{"to-no-case":100}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
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

},{"dom-element-css":98,"dom-element-value":102,"to-camel-case":104}],104:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"dup":99,"to-space-case":106}],105:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"dup":100}],106:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101,"to-no-case":105}],107:[function(require,module,exports){
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

},{}],108:[function(require,module,exports){
module.exports = {
  XmlEntities: require('./lib/xml-entities.js'),
  Html4Entities: require('./lib/html4-entities.js'),
  Html5Entities: require('./lib/html5-entities.js'),
  AllHtmlEntities: require('./lib/html5-entities.js')
};

},{"./lib/html4-entities.js":109,"./lib/html5-entities.js":110,"./lib/xml-entities.js":111}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
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

},{}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
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

},{"truncate-utf8-bytes":116}],113:[function(require,module,exports){

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

},{"to-space-case":115}],114:[function(require,module,exports){

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

},{}],115:[function(require,module,exports){

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

},{"to-no-case":114}],116:[function(require,module,exports){
'use strict';

var truncate = require("./lib/truncate");
var getLength = require("utf8-byte-length/browser");
module.exports = truncate.bind(null, getLength);

},{"./lib/truncate":117,"utf8-byte-length/browser":118}],117:[function(require,module,exports){
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


},{}],118:[function(require,module,exports){
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

},{}]},{},[97])(97)
});
