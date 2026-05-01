(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.window = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../common/lib/isFunction":4}],2:[function(require,module,exports){
'use strict';

var ClientMessages = require('./ClientMessages');
var clientMessages = new ClientMessages();
module.exports = function sendMessage(action, data, callback) {
  clientMessages.sendMessage(action, data, callback);
};

},{"./ClientMessages":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./isEmpty":3}],7:[function(require,module,exports){
'use strict';

function run() {
  var urlMatch = /^http(s)?:\/\/(localhost:8000|auth\.rc\.semrush\.net|oauth\.semrush\.com)\/oauth2\/success/ig;
  if (window.top !== window || document === undefined || document.location === undefined || !urlMatch.test(document.location.toString())) {
    return;
  }
  var sendMessage = require('browser/clientSendMessage');
  var parseUri = require('../lib/parseUri');
  var parseArgs = require('../lib/parseArgs');
  var url = parseUri.parseUri(document.location.href);
  var args = parseArgs.parseArgs(url.query);
  if (args.has('code')) {
    var data = {
      code: args.get('code')
    };
    if (args.has('state')) {
      data.state = args.get('state');
    }
    sendMessage('sq.oauthCode', data, function () {
      sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      }, function () {
        sendMessage('sq.closeTab');
      });
    });
  } else if (args.has('error')) {
    var _data = {
      error: args.get('error')
    };
    if (args.has('state')) {
      _data.state = args.get('state');
    }
    if (args.has('error_description')) {
      _data.error_description = args.get('error_description');
    }
    sendMessage('sq.oauthError', _data, function () {
      sendMessage('sq.openConfigurationWindow', {
        panel: 'integration'
      }, function () {
        sendMessage('sq.closeTab');
      });
    });
  }
}
run();

},{"../lib/parseArgs":5,"../lib/parseUri":6,"browser/clientSendMessage":2}]},{},[7])(7)
});
