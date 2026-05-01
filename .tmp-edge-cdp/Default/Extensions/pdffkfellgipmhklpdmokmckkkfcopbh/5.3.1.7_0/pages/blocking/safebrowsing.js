(self["webpackChunkbrowser_extension"] = self["webpackChunkbrowser_extension"] || []).push([["353"], {
28467(module, __unused_webpack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (true) {
    factory(module);
  } else { var mod }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});


},
27283(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Fo: () => (addGoBackButtonListener),
  V_: () => (updateTheme),
  Vo: () => (updatePlaceholder),
  h0: () => (getElementById),
  tI: () => (getParams)
});
/* import */ var core_js_modules_web_url_search_params_delete_js__rspack_import_0 = __webpack_require__(70279);
/* import */ var core_js_modules_web_url_search_params_delete_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_delete_js__rspack_import_0);
/* import */ var core_js_modules_web_url_search_params_has_js__rspack_import_1 = __webpack_require__(16786);
/* import */ var core_js_modules_web_url_search_params_has_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_has_js__rspack_import_1);
/* import */ var core_js_modules_web_url_search_params_size_js__rspack_import_2 = __webpack_require__(77269);
/* import */ var core_js_modules_web_url_search_params_size_js__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_size_js__rspack_import_2);
/* import */ var core_js_modules_es_error_cause_js__rspack_import_3 = __webpack_require__(38796);
/* import */ var core_js_modules_es_error_cause_js__rspack_import_3_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__rspack_import_3);
/* import */ var _src_common_constants__rspack_import_4 = __webpack_require__(88819);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 




/**
 * Minimal value of `window.history.length` for a blocked page in MV3 —
 * when a new tab is opened (+1) and the blocked page is shown after redirection (+1).
 * That's why it is not usual `1` but `2`.
 */ const MIN_BLOCKED_PAGE_HISTORY_LENGTH_MV3 = 2;
/**
 * Map of AppearanceTheme to BlockingPagesSupportedTheme.
 */ const themeMap = new Map([
    [
        _src_common_constants__rspack_import_4/* .AppearanceTheme.System */.i0.System,
        "auto"
    ],
    [
        _src_common_constants__rspack_import_4/* .AppearanceTheme.Light */.i0.Light,
        "light"
    ],
    [
        _src_common_constants__rspack_import_4/* .AppearanceTheme.Dark */.i0.Dark,
        "dark"
    ]
]);
/**
 * Updates the theme on the blocking page.
 *
 * @param theme Extension theme.
 */ const updateTheme = (theme)=>{
    var _themeMap_get;
    const blockingPageTheme = (_themeMap_get = themeMap.get(theme)) !== null && _themeMap_get !== void 0 ? _themeMap_get : "auto";
    window.themeManager.switchTheme(blockingPageTheme);
};
/**
 * Parses 'window.location.search' value passed as `locationSearch`.
 *
 * @param locationSearch Value of `window.location.search` to parse.
 *
 * @returns Object with parsed search parameters.
 */ const getParams = (locationSearch)=>{
    const urlSearchParams = new URLSearchParams(locationSearch);
    return Object.fromEntries(urlSearchParams.entries());
};
/**
 * Finds element by id on the page.
 *
 * @param elementId Id of the element to find.
 *
 * @returns Found element.
 *
 * @throws Error if element with id `elementId` is not found.
 */ const getElementById = (elementId)=>{
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }
    return element;
};
/**
 * Updates the text content of an element with the given ID.
 *
 * @param elementId The ID of the element to update.
 * @param text The text to set in the element.
 */ const updatePlaceholder = (elementId, text)=>{
    const element = getElementById(elementId);
    element.textContent = text;
};
/**
 * Goes back for MV2.
 */ const goBackMv2 = ()=>{
    window.history.back();
};
/**
 * Goes back for MV3.
 */ const goBackMv3 = ()=>{
    if (window.history.length > MIN_BLOCKED_PAGE_HISTORY_LENGTH_MV3) {
        try {
            window.history.go(-MIN_BLOCKED_PAGE_HISTORY_LENGTH_MV3);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.debug(`Error while going back: ${e instanceof Error ? e.message : e}`);
        }
    } else {
        window.close();
    }
};
/**
 * Adds listener to handle "Go back" button click.
 *
 * @param id The ID of the "Go back" button.
 */ const addGoBackButtonListener = (id)=>{
    const backBtn = getElementById(id);
    if (false) {} else {
        backBtn.addEventListener('click', goBackMv2);
    }
};


},
67283(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {
"use strict";

// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(45403);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(75126);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(38796);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(70279);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(16786);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(77269);
// EXTERNAL MODULE: ./node_modules/.pnpm/core-js@3.40.0/node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__(80852);
;// CONCATENATED MODULE: ./Extension/pages/blocking/safebrowsing/imported-script.js







(function polyfill() {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')){
        processPreload(link);
    }
    new MutationObserver((mutations)=>{
        for (const mutation of mutations){
            if (mutation.type !== "childList") {
                continue;
            }
            for (const node of mutation.addedNodes){
                if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
            }
        }
    }).observe(document, {
        childList: true,
        subtree: true
    });
    function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity) fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
        else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
        else fetchOpts.credentials = "same-origin";
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep) return;
        link.ep = true;
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
})();
window.APP_NAME = "browser_extension";
window.PAGE_TYPE = "safebrowsing";
class ThemeManager {
    _isThemeSupported(theme) {
        return Object.values(this._THEMES).includes(theme);
    }
    _storeTheme(theme) {
        if (this._isThemeSupported(theme)) {
            try {
                localStorage.setItem(this._STORAGE_KEY, theme);
            } catch  {}
        }
    }
    _setPageTheme(theme) {
        const changed = this._theme !== theme;
        if (theme === this._THEMES.dark || theme === this._THEMES.light) {
            document.documentElement.dataset.theme = theme;
            this._theme = theme;
            if (changed) {
                this._changeCallbacks.forEach((cb)=>cb(theme));
            }
        }
    }
    _detectSystemTheme() {
        const isSystemDarkMode = this._matchMedia.matches;
        const storedTheme = this.getStoredTheme();
        const isStoredDarkTheme = storedTheme === this._THEMES.dark;
        const isAutoTheme = storedTheme === this._THEMES.auto;
        if (isStoredDarkTheme || isAutoTheme && isSystemDarkMode) {
            this._setPageTheme(this._THEMES.dark);
        } else {
            this._setPageTheme(this._THEMES.light);
        }
    }
    getThemes() {
        return this._THEMES;
    }
    listenForDarkMode(event) {
        if (this.getStoredTheme() === this._THEMES.auto) {
            this._setPageTheme(event.matches ? this._THEMES.dark : this._THEMES.light);
        }
    }
    onThemeChange(cb) {
        this._changeCallbacks.push(cb);
    }
    // return the theme from storage. possible values for theme are: 'dark', 'light', and 'auto'.
    getStoredTheme() {
        try {
            const theme = localStorage.getItem(this._STORAGE_KEY);
            return this._isThemeSupported(theme) ? theme : this._THEMES.auto;
        } catch  {
            return this._THEMES.auto;
        }
    }
    // the switchTheme method switches the current theme to the given one. possible `theme` values are: 'dark', 'light' and 'auto'.
    switchTheme(theme) {
        if (this._isThemeSupported(theme)) {
            this._storeTheme(theme);
            if (theme === this._THEMES.auto) {
                this._detectSystemTheme(theme);
            } else {
                this._setPageTheme(theme);
            }
        }
    }
    // returns only dark/light - the current body color, not the selected preset
    getCurrentTheme() {
        if (typeof this._theme === "undefined") {
            throw new Error("call the init method first");
        }
        return this._theme;
    }
    // the init method adds the dark modifier to <html /> if required.
    init() {
        this._detectSystemTheme();
    }
    constructor(){
        this._matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        this._matchMedia.addEventListener("change", this.listenForDarkMode.bind(this));
        this._STORAGE_KEY = "theme-name";
        this._THEMES = Object.freeze({
            auto: "auto",
            light: "light",
            dark: "dark"
        });
        this._changeCallbacks = [];
        this._theme = void 0;
    }
}
window.themeManager = new ThemeManager();
window.themeManager.init();
window.locales = {
    "ar": {
        "adgSafebrowsingTitle": "هذا الموقع خطير!",
        "extSafebrowsingDesc": "حظر AdGuard الوصول إلى <strong id='adgSafebrowsingHost'></strong> لأنه موجود في قاعدة بياناتنا الخاصة بمجالات التصيد الاحتيالي والبرامج الضارة",
        "proceedAnyway": "المتابعة على أية حال",
        "backBtn": "الرجوع للخلف",
        "adgSafebrowsingFaqTitle1": "لماذا لا يمكنني الوصول إلى هذا الموقع؟",
        "extSafebrowsingReport": "يتحقق AdGuard من أمان جميع الصفحات المطلوبة. تم وضع علامة على هذا الموقع <a id='adgSafebrowsingUnsafeLink'>على أنه غير آمن</a> — ولهذا السبب يقوم AdGuard بحظر الوصول إليه",
        "adgSafebrowsingFaqDesc1_2": "إذا كنت تعتقد أن هذا الموقع قد تم حظره عن طريق الخطأ، فيرجى <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>إخبارنا</a>"
    },
    "cs": {
        "adgSafebrowsingTitle": "Tato webová stránka je nebezpečná!",
        "extSafebrowsingDesc": "AdGuard zablokoval přístup na <strong id='adgSafebrowsingHost'></strong>, protože je v naší databázi podvodných a škodlivých domén",
        "proceedAnyway": "Přesto pokračovat",
        "backBtn": "Zpět",
        "adgSafebrowsingFaqTitle1": "Proč nemám přístup na tuto webovou stránku?",
        "extSafebrowsingReport": "AdGuard kontroluje zabezpečení všech požadovaných stránek. Tato webová stránka je <a id='adgSafebrowsingUnsafeLink'>označena jako nebezpečná</a> — proto k ní AdGuard blokuje přístup",
        "adgSafebrowsingFaqDesc1_2": "Pokud se domníváte, že tato webová stránka byla zablokována omylem, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>dejte nám prosím vědět</a>"
    },
    "da": {
        "adgSafebrowsingTitle": "Dette websted er farligt!",
        "extSafebrowsingDesc": "AdGuard blokerede adgang til <strong id='adgSafebrowsingHost'></strong>, da det findes i vores database over phishing og skadelige domæner",
        "proceedAnyway": "Fortsæt alligevel",
        "backBtn": "Gå tilbage",
        "adgSafebrowsingFaqTitle1": "Hvorfor kan man ikke tilgå dette websted?",
        "extSafebrowsingReport": "AdGuard tjekker sikkerheden på alle forespurgte sider. Dette websted er <a id='adgSafebrowsingUnsafeLink'>markeret som usikkert</a>, hvorfor AdGuard blokerer adgangen hertil",
        "adgSafebrowsingFaqDesc1_2": "Anses blokeringen af dette websted for en fejl, så <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>underret os gerne om det</a>"
    },
    "de": {
        "adgSafebrowsingTitle": "Diese Website ist gefährlich!",
        "extSafebrowsingDesc": "AdGuard hat den Zugriff auf <strong id='adgSafebrowsingHost'></strong> blockiert, da diese Website als betrügerisch oder bösartig in unserer Datenbank eingestuft ist",
        "proceedAnyway": "Trotzdem fortfahren",
        "backBtn": "Zurück",
        "adgSafebrowsingFaqTitle1": "Warum kann ich nicht auf diese Website zugreifen?",
        "extSafebrowsingReport": "AdGuard prüft die Sicherheit aller angeforderten Seiten. Diese Website ist <a id='adgSafebrowsingUnsafeLink'>als unsicher gekennzeichnet</a> — daher blockiert AdGuard den Zugriff darauf",
        "adgSafebrowsingFaqDesc1_2": "Wenn Sie glauben, dass diese Website irrtümlich gesperrt wurde, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>teilen Sie uns dies bitte mit</a>"
    },
    "en": {
        "adgSafebrowsingTitle": "This website is dangerous!",
        "extSafebrowsingDesc": "AdGuard blocked access to <strong id='adgSafebrowsingHost'></strong> because it's in our database of phishing and malicious domains",
        "proceedAnyway": "Proceed anyway",
        "backBtn": "Go back",
        "adgSafebrowsingFaqTitle1": "Why can't I access this website?",
        "extSafebrowsingReport": "AdGuard checks the security of all requested pages. This website is <a id='adgSafebrowsingUnsafeLink'>marked as unsafe</a> — that's why AdGuard blocks access to it",
        "adgSafebrowsingFaqDesc1_2": "If you believe this website has been blocked in error, please <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>let us know</a>"
    },
    "es": {
        "adgSafebrowsingTitle": "¡Este sitio web es peligroso!",
        "extSafebrowsingDesc": "AdGuard bloqueó el acceso a <strong id='adgSafebrowsingHost'></strong> porque está en nuestra base de datos de dominios maliciosos y de phishing",
        "proceedAnyway": "Continuar así mismo",
        "backBtn": "Volver",
        "adgSafebrowsingFaqTitle1": "¿Por qué no puedo acceder a este sitio web?",
        "extSafebrowsingReport": "AdGuard verifica la seguridad de todas las páginas solicitadas. Este sitio web está <a id='adgSafebrowsingUnsafeLink'>marcado como inseguro</a>, por eso AdGuard bloquea el acceso a él",
        "adgSafebrowsingFaqDesc1_2": "Si crees que este sitio web ha sido bloqueado por error, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>comunícanoslo</a>"
    },
    "fa": {
        "adgSafebrowsingTitle": "این تارنما خطرناک است!",
        "extSafebrowsingDesc": "AdGuard DNS دسترسی به <strong id='adgSafebrowsingHost'></strong> را مسدود کرد زیرا در پایگاه داده طعمه‌گذاری و دامنه‌های مخرب ما قرار دارد",
        "proceedAnyway": "در هر صورت ادامه یابد",
        "backBtn": "برگرد",
        "adgSafebrowsingFaqTitle1": "چرا نمی‌توانم به این تارنما دسترسی پیدا کنم؟",
        "extSafebrowsingReport": "AdGuard امنیت تمام صفحات درخواست شده را بررسی می کند. این تارنما <a id='adgSafebrowsingUnsafeLink'>مشخص شده به عنوان نا امن</a> — به همین دلیل AdGuard دسترسی به آن را مسدود می کند",
        "adgSafebrowsingFaqDesc1_2": "اگر باور دارید این تارنما به اشتباه مسدود شده است، لطفا <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>به ما اطلاع دهید</a>"
    },
    "fi": {
        "adgSafebrowsingTitle": "Tämä sivusto on vaarallinen!",
        "extSafebrowsingDesc": "AdGuard esti pääsyn <strong id='adgSafebrowsingHost'></strong> verkkotunnukselle, koska se on tietojenkalasteluun ja haitallisiin verkkotunnuksiin liittyvässä tietokannassamme",
        "proceedAnyway": "Jatka silti",
        "backBtn": "Palaa takaisin",
        "adgSafebrowsingFaqTitle1": "Miksi en pääse tälle verkkosivustolle?",
        "extSafebrowsingReport": "AdGuard tarkistaa kaikkien pyydettyjen sivujen turvallisuuden. Tämä verkkosivusto on <a id='adgSafebrowsingUnsafeLink'>merkitty epäluotettavaksi</a> — siksi AdGuard estää pääsyn sille",
        "adgSafebrowsingFaqDesc1_2": "Jos uskot, että tämä verkkosivusto on estetty virheellisesti, ole hyvä ja <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>kerro meille</a>"
    },
    "fr": {
        "adgSafebrowsingTitle": "Ce site web est dangereux !",
        "extSafebrowsingDesc": "AdGuard a bloqué l'accès à <strong id='adgSafebrowsingHost'></strong>, car il se trouve dans notre base de données de domaines malveillants et hameçonneurs",
        "proceedAnyway": "Procéder malgré tout",
        "backBtn": "Retour",
        "adgSafebrowsingFaqTitle1": "Pourquoi ne puis-je pas accéder à ce site web ?",
        "extSafebrowsingReport": "AdGuard vérifie la sécurité de toutes les pages demandées. Ce site web est <a id='adgSafebrowsingUnsafeLink'>marqué comme dangereux</a> — c'est pourquoi AdGuard y a bloqué l'accès",
        "adgSafebrowsingFaqDesc1_2": "Si vous pensez que ce site web a été bloqué par erreur, veuillez <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>nous en informer</a>"
    },
    "id": {
        "adgSafebrowsingTitle": "Situs ini mungkin berbahaya!",
        "extSafebrowsingDesc": "AdGuard diblokir akses ke <strong id='adgSafebrowsingHost'></strong> karena ada di basis data phishing dan domain berbahaya kami",
        "proceedAnyway": "Bagaimana pun juga lanjutkan",
        "backBtn": "Kembali",
        "adgSafebrowsingFaqTitle1": "Mengapa saya tidak dapat mengakses situs ini?",
        "extSafebrowsingReport": "AdGuard memeriksa keamanan semua halaman yang diminta. Situs web ini <a id='adgSafebrowsingUnsafeLink'>ditandai sebagai tidak aman</a> — itulah sebabnya AdGuard diblokir akses ke situs web tersebut",
        "adgSafebrowsingFaqDesc1_2": "Jika Anda yakin situs web ini diblokir karena kesalahan, mohon <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>kabarkan kami</a>"
    },
    "it": {
        "adgSafebrowsingTitle": "Questo sito web è pericoloso!",
        "extSafebrowsingDesc": "AdGuard ha bloccato l'accesso a <strong id='adgSafebrowsingHost'></strong> perché è nel nostro database di domini di phishing e malevoli",
        "proceedAnyway": "Procedi comunque",
        "backBtn": "Torna indietro",
        "adgSafebrowsingFaqTitle1": "Perché non riesco ad accedere a questo sito web?",
        "extSafebrowsingReport": "AdGuard controlla la sicurezza di tutte le pagine richieste. Questo sito web è <a id='adgSafebrowsingUnsafeLink'>contrassegnato come non sicuro</a> — ecco perché AdGuard blocca l'accesso ad esso",
        "adgSafebrowsingFaqDesc1_2": "Se pensi che questo sito web sia stato bloccato per errore, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>facci sapere</a>"
    },
    "ja": {
        "adgSafebrowsingTitle": "このウェブサイトは危険です！",
        "extSafebrowsingDesc": "<strong id='adgSafebrowsingHost'></strong> はフィッシングドメイン・悪意のあるドメインのAdGuardデータベースに登録されているため、AdGuard がアクセスをブロックしました。",
        "proceedAnyway": "そのままリンクを開く",
        "backBtn": "戻る",
        "adgSafebrowsingFaqTitle1": "なぜこのウェブサイトにアクセスできないのですか？",
        "extSafebrowsingReport": "AdGuard は、リクエストされたページの全てのセキュリティチェックを行います。このウェブサイトは、<a id='adgSafebrowsingUnsafeLink'>安全でない</a>としてマークされています。そのため、AdGuard はこのドメインへのアクセスをブロックしています。",
        "adgSafebrowsingFaqDesc1_2": "このウェブサイトが誤ってブロックされていると思われる場合は、<a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>こちらから</a>お知らせください。"
    },
    "ko": {
        "adgSafebrowsingTitle": "이 웹사이트는 위험합니다!",
        "extSafebrowsingDesc": "피싱 및 악성 도메인 데이터베이스에 포함되어 있기 때문에 AdGuard가 <strong id='adgSafebrowsingHost'></strong>에 대한 액세스를 차단했습니다.",
        "proceedAnyway": "그래도 계속 진행",
        "backBtn": "뒤로 가기",
        "adgSafebrowsingFaqTitle1": "왜 이 웹사이트에 접속할 수 없나요?",
        "extSafebrowsingReport": "AdGuard는 요청된 모든 페이지의 보안을 확인합니다. 이 웹사이트는 <a id='adgSafebrowsingUnsafeLink'>안전하지 않은 것으로 표시되어</a> AdGuard가 해당 웹사이트에 대한 액세스를 차단합니다.",
        "adgSafebrowsingFaqDesc1_2": "이 웹사이트가 오류로 차단되었다고 생각되면 <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>알려주세요</a>."
    },
    "lt": {
        "adgSafebrowsingTitle": "Ši svetainė yra pavojinga!",
        "extSafebrowsingDesc": "AdGuard užblokavo prieigą prie <strong id='adgSafebrowsingHost'></strong>, nes tai yra mūsų sukčiavimo ir kenkėjiškų domenų duomenų bazėje",
        "proceedAnyway": "Tęsti vis tiek",
        "backBtn": "Grįžti atgal",
        "adgSafebrowsingFaqTitle1": "Kodėl negaliu pasiekti šios svetainės?",
        "extSafebrowsingReport": "AdGuard tikrina visų prašomų puslapių saugumą. Ši svetainė <a id='adgSafebrowsingUnsafeLink'>pažymėta kaip nesaugus</a> – štai kodėl AdGuard blokuoja prieigą prie jos",
        "adgSafebrowsingFaqDesc1_2": "Jei manote, kad ši svetainė buvo užblokuota per klaidą, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>praneškite mums</a>"
    },
    "pl": {
        "adgSafebrowsingTitle": "Ta strona jest niebezpieczna!",
        "extSafebrowsingDesc": "AdGuard zablokował dostęp do <strong id='adgSafebrowsingHost'></strong>, ponieważ znajduje się ona w naszej bazie phishingowych i złośliwych domen",
        "proceedAnyway": "Mimo wszystko kontynuuj",
        "backBtn": "Wróć",
        "adgSafebrowsingFaqTitle1": "Dlaczego nie mogę uzyskać dostępu do tej witryny?",
        "extSafebrowsingReport": "AdGuard sprawdza bezpieczeństwo wszystkich żądanych stron. Ta strona internetowa jest <a id='adgSafebrowsingUnsafeLink'>oznaczona jako niebezpieczna</a> — dlatego AdGuard zablokował do niej dostęp",
        "adgSafebrowsingFaqDesc1_2": "Jeśli uważasz, że ta strona internetowa została zablokowana przez pomyłkę, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>daj nam znać</a>"
    },
    "pt-BR": {
        "adgSafebrowsingTitle": "Este site é perigoso!",
        "extSafebrowsingDesc": "O AdGuard bloqueou o acesso a <strong id='adgSafebrowsingHost'></strong> porque está em nossa base de dados de phishing e domínios maliciosos",
        "proceedAnyway": "Continuar mesmo assim",
        "backBtn": "Voltar",
        "adgSafebrowsingFaqTitle1": "Por que não consigo acessar este site?",
        "extSafebrowsingReport": "O AdGuard verifica a segurança de todas as páginas solicitadas. Este site está <a id='adgSafebrowsingUnsafeLink'>marcado como inseguro</a> e, por isso, o AdGuard bloqueia o acesso a ele",
        "adgSafebrowsingFaqDesc1_2": "Se você acredita que este site foi bloqueado por engano, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>nos informe</a>"
    },
    "pt-PT": {
        "adgSafebrowsingTitle": "Este sítio Web é perigoso!",
        "extSafebrowsingDesc": "O AdGuard bloqueou o acesso a <strong id='adgSafebrowsingHost'></strong> porque está na nossa base de dados de phishing e domínios maliciosos",
        "proceedAnyway": "Continuar mesmo assim",
        "backBtn": "Voltar",
        "adgSafebrowsingFaqTitle1": "Por que não consigo acessar este sítio?",
        "extSafebrowsingReport": "O AdGuard verifica a segurança de todas as páginas solicitadas. Este sítio está <a id='adgSafebrowsingUnsafeLink'>marcado como não seguro</a>, por isso o AdGuard bloqueia o acesso ao mesmo",
        "adgSafebrowsingFaqDesc1_2": "Se considera que este sítio Web foi bloqueado por engano, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>informe-nos</a>"
    },
    "ru": {
        "adgSafebrowsingTitle": "Осторожно, опасный сайт!",
        "extSafebrowsingDesc": "AdGuard заблокировал доступ к <strong id='adgSafebrowsingHost'></strong>: этот сайт находится в нашей базе фишинговых и вредоносных доменов",
        "proceedAnyway": "Всё равно перейти",
        "backBtn": "Назад",
        "adgSafebrowsingFaqTitle1": "Почему сайт заблокирован?",
        "extSafebrowsingReport": "AdGuard проверяет безопасность всех страниц, на которые вы переходите. Этот сайт <a id='adgSafebrowsingUnsafeLink'>помечен как небезопасный</a> — поэтому AdGuard блокирует доступ к нему",
        "adgSafebrowsingFaqDesc1_2": "Если вы считаете, что сайт заблокирован по ошибке, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>сообщите нам об этом</a>"
    },
    "sk": {
        "adgSafebrowsingTitle": "Táto webová stránka je nebezpečná!",
        "extSafebrowsingDesc": "AdGuard zablokoval prístup k <strong id='adgSafebrowsingHost'></strong>, pretože je v našej databáze phishingových a nebezpečných domén",
        "proceedAnyway": "Aj tak pokračovať",
        "backBtn": "Naspäť",
        "adgSafebrowsingFaqTitle1": "Prečo sa nemôžem dostať na túto webovú stránku?",
        "extSafebrowsingReport": "AdGuard kontroluje bezpečnosť všetkých požadovaných stránok. Táto webová stránka je <a id='adgSafebrowsingUnsafeLink'>označená ako nebezpečná</a> – preto k nej AdGuard blokuje prístup",
        "adgSafebrowsingFaqDesc1_2": "Ak si myslíte, že táto webová stránka bola zablokovaná omylom, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>dajte nám vedieť</a>"
    },
    "sl": {
        "adgSafebrowsingTitle": "Ta spletna stran je nevarna!",
        "extSafebrowsingDesc": "AdGuard je onemogočil dostop do <strong id='adgSafebrowsingHost'></strong>, ker je v naši zbirki podatkov lažnega predstavljanja in zlonamernih domen",
        "proceedAnyway": "Vseeno nadaljuj",
        "backBtn": "Pojdi nazaj",
        "adgSafebrowsingFaqTitle1": "Zakaj ne morem dostopati do te spletne strani?",
        "extSafebrowsingReport": "AdGuard preveri varnost vseh zahtevanih strani. To spletno mesto je <a id='adgSafebrowsingUnsafeLink'>označeno kot nevarno</a> — zato AdGuard blokira dostop do njega",
        "adgSafebrowsingFaqDesc1_2": "Če menite, da je bila ta spletna stran pomotoma onemogočena, nam <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>sporočite</a>"
    },
    "sv": {
        "adgSafebrowsingTitle": "Den här webbplatsen är farlig!",
        "extSafebrowsingDesc": "AdGuard blockerade åtkomsten till <strong id='adgSafebrowsingHost'></strong> eftersom den finns i vår databas över nätfiske och skadliga domäner",
        "proceedAnyway": "Fortsätt ändå",
        "backBtn": "Gå tillbaka",
        "adgSafebrowsingFaqTitle1": "Varför kan jag inte komma åt den här webbplatsen?",
        "extSafebrowsingReport": "AdGuard kontrollerar säkerheten för alla begärda sidor. Den här webbplatsen är <a id='adgSafebrowsingUnsafeLink'>markerad som osäker</a> — det är därför AdGuard blockerar åtkomst till den",
        "adgSafebrowsingFaqDesc1_2": "Om du tror att denna webbplats har blockerats av misstag, vänligen <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>meddela oss</a>"
    },
    "tr": {
        "adgSafebrowsingTitle": "Bu site tehlikeli!",
        "extSafebrowsingDesc": "AdGuard, kimlik avı ve kötü amaçlı alan adları veri tabanımızda yer aldığından <strong id='adgSafebrowsingHost'></strong> erişimini engelledi",
        "proceedAnyway": "Yine de devam et",
        "backBtn": "Geri dön",
        "adgSafebrowsingFaqTitle1": "Bu siteye neden erişemiyorum?",
        "extSafebrowsingReport": "AdGuard, istenen tüm sayfaların güvenliğini kontrol eder. Bu site <a id='adgSafebrowsingUnsafeLink'>güvenli değil olarak işaretlendi</a> — bu yüzden AdGuard onu engelliyor",
        "adgSafebrowsingFaqDesc1_2": "Bu sitenin yanlışlıkla engellendiğini düşünüyorsanız, lütfen <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>bize bildirin</a>"
    },
    "uk": {
        "adgSafebrowsingTitle": "Цей сайт небезпечний!",
        "extSafebrowsingDesc": "AdGuard заблокував доступ до <strong id='adgSafebrowsingHost'></strong> тому, що цей сайт міститься в нашій базі даних фішингових і зловмисних доменів",
        "proceedAnyway": "Все одно продовжити",
        "backBtn": "Назад",
        "adgSafebrowsingFaqTitle1": "Чому сайт заблоковано?",
        "extSafebrowsingReport": "AdGuard перевіряє безпеку всіх запитуваних сторінок. Цей сайт <a id='adgSafebrowsingUnsafeLink'>позначений як небезпечний</a> — тому AdGuard блокує доступ до нього",
        "adgSafebrowsingFaqDesc1_2": "Якщо ви вважаєте, що цей сайт було заблоковано помилково, будь ласка, <a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>повідомте нас</a>"
    },
    "zh-CN": {
        "adgSafebrowsingTitle": "此网站危险！",
        "extSafebrowsingDesc": "AdGuard 禁止访问 <strong id='adgSafebrowsingHost'></strong>，因为该网站在我们的网络钓鱼和恶意域数据库中。",
        "proceedAnyway": "继续访问",
        "backBtn": "返回",
        "adgSafebrowsingFaqTitle1": "为什么我无法访问此网站？",
        "extSafebrowsingReport": "AdGuard 检查所有请求网页的安全性。该网站被<a id='adgSafebrowsingUnsafeLink'>标记为不安全</a>的网站，因此 AdGuard 禁止访问它。",
        "adgSafebrowsingFaqDesc1_2": "如果您认为此网站被错误地拦截，请<a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>告诉我们</a>"
    },
    "zh-TW": {
        "adgSafebrowsingTitle": "此網站是危險的！",
        "extSafebrowsingDesc": "AdGuard 禁止存取 <strong id='adgSafebrowsingHost'></strong>，因為該網站在我們的網路釣魚和惡意域數據庫中。",
        "proceedAnyway": "仍要繼續",
        "backBtn": "返回",
        "adgSafebrowsingFaqTitle1": "為什麼我無法訪問此網站？",
        "extSafebrowsingReport": "AdGuard 檢查所有請求網頁的安全性。該網站被<a id='adgSafebrowsingUnsafeLink'>標記為不安全</a>的網站，因此 AdGuard 禁止存取它。",
        "adgSafebrowsingFaqDesc1_2": "如果您認為此網站被錯誤地封鎖，請<a id='adgSafebrowsingBlockedInErrorLink' href='%common_reports_new_issue_url%'>告訴我們</a>"
    }
};
let config = null;
const getConfig = ()=>{
    if (config) {
        return config;
    }
    config = {
        appName: window.APP_NAME,
        pageType: window.PAGE_TYPE,
        host: window.location.host
    };
    return config;
};
const getLocale = ()=>{
    const debugQueryParams = new URLSearchParams(window.location.search);
    const debugQueryLocale = debugQueryParams.get("_locale");
    if (debugQueryLocale) {
        return debugQueryLocale;
    }
    return navigator.language;
};
const resolveDictionary = ()=>{
    if (!window.locales || typeof window.locales !== "object") {
        console.error("Localization dictionaries not found in window.locales");
        return {};
    }
    const locale = getLocale();
    if (window.locales[locale]) {
        return window.locales[locale];
    }
    const lang = locale.split("-")[0];
    if (window.locales[lang]) {
        return window.locales[lang];
    }
    return window.locales["en"];
};
let dictionary = null;
const getDictionary = ()=>{
    if (dictionary) {
        return dictionary;
    }
    dictionary = resolveDictionary();
    return dictionary;
};
let placeholders = null;
const getPlaceholders = ()=>{
    if (placeholders) {
        return placeholders;
    }
    const config2 = getConfig();
    placeholders = {
        host: config2.host,
        reports_url: `https://link.adtidy.org/forward.html?action=site_report_page&domain=${config2.host}&from=${config2.pageType}&app=${config2.appName}`,
        dns_reports_new_issue_url: `https://link.adtidy.org/forward.html?action=report_issue&from=${config2.pageType}&app=${config2.appName}`,
        common_reports_new_issue_url: `https://link.adtidy.org/forward.html?action=report&from=${config2.pageType}&app=${config2.appName}`,
        adg_website_url: `https://link.adtidy.org/forward.html?action=adguard_site&from=${config2.pageType}&app=${config2.appName}`,
        vpn_website_url: `https://link.adtidy.org/forward.html?action=vpn_site&from=${config2.pageType}&app=${config2.appName}`,
        dns_website_url: `https://link.adtidy.org/forward.html?action=dns_site&from=${config2.pageType}&app=${config2.appName}`,
        dns_domain: "adguard-dns.io",
        user_rules_url: `https://link.adtidy.org/forward.html?action=dns_site_user_rules&from=${config2.pageType}&app=${config2.appName}`,
        locations_count: 65,
        users_count: "100",
        vpn_product_name: "AdGuard VPN"
    };
    return placeholders;
};
const translate = (id)=>{
    const dict = getDictionary();
    var _dict_id;
    return (_dict_id = dict[id]) !== null && _dict_id !== void 0 ? _dict_id : id;
};
const replacePlaceholders = (text)=>{
    if (!text) {
        return "";
    }
    const placeholders2 = getPlaceholders();
    return Object.entries(placeholders2).reduce((acc, [key, value])=>{
        return acc.replace(new RegExp(`%${key}%`, "g"), value);
    }, text);
};
const translateNode = (node)=>{
    if (!node || !node.dataset) {
        return;
    }
    const id = node.dataset.id;
    if (!id) {
        return;
    }
    const translated = replacePlaceholders(translate(id));
    if (node.tagName === "INPUT") {
        node.placeholder = translated;
    } else {
        node.innerHTML = translated;
    }
};
const initTranslations = ()=>{
    document.querySelectorAll("[data-id]").forEach(translateNode);
};
initTranslations();

// EXTERNAL MODULE: ./Extension/src/common/forward.ts
var forward = __webpack_require__(59387);
// EXTERNAL MODULE: ./Extension/src/common/logger.ts
var logger = __webpack_require__(42228);
// EXTERNAL MODULE: ./Extension/src/pages/services/messenger/index.ts
var messenger = __webpack_require__(32706);
// EXTERNAL MODULE: ./Extension/pages/blocking/helpers.ts
var helpers = __webpack_require__(27283);
;// CONCATENATED MODULE: ./Extension/pages/blocking/safebrowsing/page-handler.ts
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 






/**
 * Id of the current host placeholder.
 */ const PLACEHOLDER_HOST_ID = 'adgSafebrowsingHost';
/**
 * Id of the "Proceed Anyway" button.
 */ const SAFEBROWSING_PROCEED_BTN_ID = 'adblockerSafebrowsingProceed';
/**
 * Id of the "marked as unsafe" link.
 */ const SAFEBROWSING_UNSAFE_LINK_ID = 'adgSafebrowsingUnsafeLink';
/**
 * Id of the "Go Back" button.
 */ const SAFEBROWSING_GO_BACK_BTN_ID = 'safebrowsingPageBackBtn';
/**
 * Adds listener to handle "Proceed Anyway" button click.
 */ const addProceedAnywayListener = (url)=>{
    const proceedAnywayBtn = (0,helpers/* .getElementById */.h0)(SAFEBROWSING_PROCEED_BTN_ID);
    proceedAnywayBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        messenger/* .messenger.openSafebrowsingTrusted */.ee.openSafebrowsingTrusted(url);
    });
};
/**
 * Adds listener to handle "marked as unsafe" link click.
 *
 * @param url URL to check.
 *
 * @throws Error if element with id {@link SAFEBROWSING_UNSAFE_LINK_ID} is not found.
 */ const addCheckWebsiteSecurityListener = (url)=>{
    const checkReportElement = (0,helpers/* .getElementById */.h0)(SAFEBROWSING_UNSAFE_LINK_ID);
    checkReportElement.addEventListener('click', async (e)=>{
        e.preventDefault();
        messenger/* .messenger.checkSiteSecurity */.ee.checkSiteSecurity(url, forward/* .ForwardFrom.Safebrowsing */.S9.Safebrowsing);
    });
};
// TODO: improve "let us know" link handling — extension settings can be added as query params
// so most of the fields in so-called 'report web app' can be pre-filled for users
/**
 * Runs the initialization of the safebrowsing page handler:
 * - updates theme on the page;
 * - updates placeholder with the host;
 * - adds listener to handle "Proceed Anyway" button click;
 * - adds listener to handle "marked as unsafe" link click;
 * - adds listener to handle "Go Back" button click (if needed).
 *
 * @param data Data to run the initialization.
 * @param data.response Data to initialize the page.
 * @param data.url URL of blocked page.
 */ const runInit = ({ response, url })=>{
    const { theme } = response;
    (0,helpers/* .updateTheme */.V_)(theme);
    (0,helpers/* .updatePlaceholder */.Vo)(PLACEHOLDER_HOST_ID, new URL(url).host);
    addProceedAnywayListener(url);
    addCheckWebsiteSecurityListener(url);
    (0,helpers/* .addGoBackButtonListener */.Fo)(SAFEBROWSING_GO_BACK_BTN_ID);
};
/**
 * Initializes the safebrowsing page handler.
 */ const initSafebrowsingPageHandler = async ()=>{
    const { url } = (0,helpers/* .getParams */.tI)(window.location.search);
    if (!url) {
        logger/* .logger.error */.v.error(`[ext.page-handler]: cannot parse "url" param in page url: ${window.location.href}`);
        return;
    }
    const response = await messenger/* .messenger.initializeBlockingPageScript */.ee.initializeBlockingPageScript();
    if (document.readyState === 'loading') {
        const listener = ()=>{
            runInit({
                response,
                url
            });
            document.removeEventListener('DOMContentLoaded', listener);
        };
        document.addEventListener('DOMContentLoaded', listener);
    } else {
        runInit({
            response,
            url
        });
    }
};

;// CONCATENATED MODULE: ./Extension/pages/blocking/safebrowsing/index.ts
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 

initSafebrowsingPageHandler();


},
93926(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  s: () => (BrowserStorage)
});
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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
/**
 * Wrapper for StorageArea with dev-friendly interface.
 *
 * @template Data The type of the value stored in the storage.
 */ class BrowserStorage {
    /**
     * Sets data to storage.
     *
     * @param key Storage key.
     * @param value Storage value.
     */ async set(key, value) {
        await this.storage.set({
            [key]: value
        });
    }
    /**
     * Returns data from storage.
     *
     * @param key Storage key.
     *
     * @returns Storage value.
     */ async get(key) {
        return this.storage.get(key).then((data)=>data[key]);
    }
    /**
     * Removes data from storage.
     *
     * @param key Storage key.
     */ async remove(key) {
        await this.storage.remove(key);
    }
    /**
     * Sets multiple key-value pairs in the storage.
     *
     * @param data The key-value pairs to set.
     *
     * @returns True if all operations were successful, false otherwise.
     *
     * @example
     * ```ts
     * const storage = new Storage();
     * await storage.setMultiple({
     *    key1: 'value1',
     *    key2: 'value2',
     * });
     * ```
     */ // TODO: Implement some kind of transaction to ensure atomicity, if possible
    // Note: We only use this method for Firefox if "Never Remember History" is enabled
    async setMultiple(data) {
        try {
            await this.storage.set(data);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Removes multiple key-value pairs from the storage.
     *
     * @param keys The keys to remove.
     *
     * @returns True if all operations were successful, false otherwise.
     */ async removeMultiple(keys) {
        await this.storage.remove(keys);
        return true;
    }
    /**
     * Get the entire contents of the storage.
     *
     * @returns Promise that resolves with the entire contents of the storage.
     */ async entries() {
        return this.storage.get(null);
    }
    /**
     * Get all keys from the storage.
     *
     * @returns Promise that resolves with all keys from the storage.
     */ async keys() {
        return Object.keys(await this.entries());
    }
    /**
     * Checks if the storage has a key.
     *
     * @param key The key to check.
     *
     * @returns True if the key exists, false otherwise.
     */ async has(key) {
        return this.storage.get(key).then((data)=>key in data);
    }
    /**
     * Clears the storage.
     */ async clear() {
        await this.storage.clear();
    }
    /**
     * Constructs an instance of the BrowserStorage class.
     *
     * @param storage The storage area to use.
     */ constructor(storage){
        _define_property(this, "storage", void 0);
        this.storage = storage;
    }
}


},
36570(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  w: () => (HybridStorage)
});
/* import */ var core_js_modules_es_array_reduce_js__rspack_import_0 = __webpack_require__(80852);
/* import */ var core_js_modules_es_array_reduce_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce_js__rspack_import_0);
/* import */ var nanoid__rspack_import_5 = __webpack_require__(6500);
/* import */ var superjson__rspack_import_1 = __webpack_require__(49812);
/* import */ var idb__rspack_import_2 = __webpack_require__(93051);
/* import */ var _browser_storage__rspack_import_4 = __webpack_require__(93926);
/* import */ var _idb_storage__rspack_import_3 = __webpack_require__(58863);
/* eslint-disable @typescript-eslint/no-explicit-any */ /**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ /**
 * This file implements a hybrid storage solution that abstracts over different storage mechanisms,
 * providing a unified API for storage operations. It automatically chooses between IndexedDB storage and
 * a fallback storage mechanism based on the environment's capabilities.
 */ function _define_property(obj, key, value) {
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






/**
 * Implements a hybrid storage mechanism that can switch between IndexedDB and a fallback storage
 * based on browser capabilities and environment constraints. This class adheres to the StorageInterface,
 * allowing for asynchronous get and set operations.
 *
 * @template Data The type of the value stored in the storage.
 */ class HybridStorage {
    /**
     * Checks if the given storage is an instance of IDBStorage.
     *
     * @param storage The storage instance to check.
     *
     * @returns True if the storage is an instance of IDBStorage, false otherwise.
     */ static isIdbStorage(storage) {
        return storage instanceof _idb_storage__rspack_import_3/* .IDBStorage */.l;
    }
    /**
     * Determines the appropriate storage mechanism to use. If IndexedDB is supported, it uses IDBStorage;
     * otherwise, it falls back to a generic Storage mechanism. This selection is made once and cached
     * for subsequent operations.
     *
     * @returns The storage instance to be used for data operations.
     */ async getStorage() {
        if (this.storage) {
            return this.storage;
        }
        if (await HybridStorage.isIDBSupported()) {
            this.storage = new _idb_storage__rspack_import_3/* .IDBStorage */.l();
        } else {
            this.storage = new _browser_storage__rspack_import_4/* .BrowserStorage */.s(this.fallbackStorage);
        }
        return this.storage;
    }
    /**
     * Checks if the given value is a SuperJSONResult.
     *
     * @param value The value to check.
     *
     * @returns True if the value is a SuperJSONResult, false otherwise.
     */ static isSuperJSONResult(value) {
        return typeof value === 'object' && value !== null && HybridStorage.SUPERJSON_META_KEY in value;
    }
    /**
     * Checks if IndexedDB is supported in the current environment.
     * This is determined by trying to open a test database; if successful, IndexedDB is supported.
     * The result of this check is cached to prevent multiple checks.
     *
     * @returns True if IndexedDB is supported, false otherwise.
     */ static async isIDBSupported() {
        if (HybridStorage.isIDBCapabilityChecked) {
            return HybridStorage.idbSupported;
        }
        if (HybridStorage.idbCapabilityCheckerPromise) {
            return HybridStorage.idbCapabilityCheckerPromise;
        }
        HybridStorage.idbCapabilityCheckerPromise = (async ()=>{
            try {
                const testDbName = `${HybridStorage.TEST_IDB_NAME_PREFIX}${(0,nanoid__rspack_import_5/* .nanoid */.Ak)()}`;
                const testDb = await (0,idb__rspack_import_2/* .openDB */.P2)(testDbName, HybridStorage.TEST_IDB_VERSION);
                testDb.close();
                await (0,idb__rspack_import_2/* .deleteDB */.MR)(testDbName);
                HybridStorage.idbSupported = true;
            } catch (e) {
                HybridStorage.idbSupported = false;
            }
            HybridStorage.isIDBCapabilityChecked = true;
            return HybridStorage.idbSupported;
        })();
        return HybridStorage.idbCapabilityCheckerPromise;
    }
    /**
     * Asynchronously sets a value for a given key in the selected storage mechanism.
     *
     * @param key The key under which the value is stored.
     * @param value The value to be stored.
     *
     * @returns A promise that resolves when the operation is complete.
     */ async set(key, value) {
        const storage = await this.getStorage();
        // If the selected storage mechanism is IndexedDB, we store the value as is,
        // as IndexedDB can store complex objects.
        if (HybridStorage.isIdbStorage(storage)) {
            return storage.set(key, value);
        }
        const serialized = HybridStorage.serialize(value);
        // If the serialized value contains a meta key, it means that the value provided
        // contains special data that are not JSON-serializable and require SuperJSON serialization,
        // like typed arrays, dates, and other complex objects.
        // In this case, we store the SuperJSON-serialized value.
        if (HybridStorage.SUPERJSON_META_KEY in serialized) {
            return storage.set(key, serialized);
        }
        // If the serialized value does not contain a meta key, it means that the value
        // provided was a primitive value or a plain object that is JSON-serializable,
        // and it does not contain any special data that requires SuperJSON serialization.
        // In this case, we store the value as is.
        return storage.set(key, value);
    }
    /**
     * Asynchronously retrieves the value for a given key from the selected storage mechanism.
     *
     * @param key The key whose value is to be retrieved.
     *
     * @returns A promise that resolves with the retrieved value, or undefined if the key does not exist.
     */ async get(key) {
        const storage = await this.getStorage();
        // If the selected storage mechanism is IndexedDB, we return the value as is,
        // as IndexedDB can store complex objects.
        if (HybridStorage.isIdbStorage(storage)) {
            return storage.get(key);
        }
        const value = await storage.get(key);
        // Do not attempt to deserialize undefined values.
        if (value === undefined) {
            return undefined;
        }
        // If the value is a SuperJSON-serialized object, we need to deserialize it.
        if (HybridStorage.isSuperJSONResult(value)) {
            return HybridStorage.deserialize(value);
        }
        // Otherwise, we return the value as is.
        return value;
    }
    /**
     * Asynchronously removes the value for a given key from the selected storage mechanism.
     *
     * @param key The key whose value is to be removed.
     */ async remove(key) {
        const storage = await this.getStorage();
        await storage.remove(key);
    }
    /**
     * Atomic set operation for multiple key-value pairs.
     * This method are using transaction to ensure atomicity, if any of the operations fail,
     * the entire operation is rolled back. This helps to prevent data corruption / inconsistency.
     *
     * @param data The key-value pairs to set.
     *
     * @returns True if all operations were successful, false otherwise.
     *
     * @example
     * ```ts
     * const storage = new HybridStorage();
     * await storage.setMultiple({
     *    key1: 'value1',
     *    key2: 'value2',
     * });
     * ```
     */ async setMultiple(data) {
        const storage = await this.getStorage();
        if (HybridStorage.isIdbStorage(storage)) {
            var _ref;
            return (_ref = await storage.setMultiple(data)) !== null && _ref !== void 0 ? _ref : false;
        }
        const cloneData = Object.entries(data).reduce((acc, [key, value])=>{
            const serialized = superjson__rspack_import_1/* .SuperJSON.serialize */.mb.serialize(value);
            // If the serialized value contains a meta key, it means that the value provided
            // contains special data that are not JSON-serializable and require SuperJSON serialization,
            // like typed arrays, dates, and other complex objects.
            // In this case, we store the SuperJSON-serialized value.
            if (HybridStorage.SUPERJSON_META_KEY in serialized) {
                acc[key] = serialized;
                return acc;
            }
            // If the serialized value does not contain a meta key, it means that the value
            // provided was a primitive value or a plain object that is JSON-serializable,
            // and it does not contain any special data that requires SuperJSON serialization.
            // In this case, we store the value as is.
            acc[key] = value;
            return acc;
        }, {});
        var _ref1;
        return (_ref1 = await storage.setMultiple(cloneData)) !== null && _ref1 !== void 0 ? _ref1 : false;
    }
    /**
     * Removes multiple key-value pairs from the storage.
     *
     * @param keys The keys to remove.
     *
     * @returns True if all operations were successful, false otherwise.
     */ async removeMultiple(keys) {
        const storage = await this.getStorage();
        var _ref;
        return (_ref = await storage.removeMultiple(keys)) !== null && _ref !== void 0 ? _ref : false;
    }
    /**
     * Get the entire contents of the storage.
     *
     * @returns Promise that resolves with the entire contents of the storage.
     */ async entries() {
        const storage = await this.getStorage();
        if (HybridStorage.isIdbStorage(storage)) {
            return storage.entries();
        }
        const entries = await storage.entries();
        return Object.entries(entries).reduce((acc, [key, value])=>{
            acc[key] = HybridStorage.isSuperJSONResult(value) ? HybridStorage.deserialize(value) : value;
            return acc;
        }, {});
    }
    /**
     * Get all keys from the storage.
     *
     * @returns Promise that resolves with all keys from the storage.
     */ async keys() {
        const storage = await this.getStorage();
        return storage.keys();
    }
    /**
     * Check if a key exists in the storage.
     *
     * @param key The key to check.
     *
     * @returns True if the key exists, false otherwise.
     */ async has(key) {
        const storage = await this.getStorage();
        return storage.has(key);
    }
    /**
     * Clears the storage.
     */ async clear() {
        const storage = await this.getStorage();
        await storage.clear();
    }
    /**
     * Constructs an instance of the HybridStorage class.
     *
     * @param fallbackStorage The storage area to use when IndexedDB is not supported.
     */ constructor(fallbackStorage){
        /**
     * Holds the instance of the selected storage mechanism.
     *
     * @note We use SuperJSON to serialize and deserialize the data when using the fallback storage mechanism,
     * because it only supports storing JSON-serializable data.
     */ _define_property(this, "storage", null);
        /**
     * The storage area to use when IndexedDB is not supported.
     */ _define_property(this, "fallbackStorage", void 0);
        this.fallbackStorage = fallbackStorage;
    }
}
/**
     * A flag indicating whether IndexedDB support has already been checked.
     */ _define_property(HybridStorage, "isIDBCapabilityChecked", false);
/**
     * A promise that resolves to whether IndexedDB is supported in the environment.
     * This promise is used to cache the result of the support check to prevent multiple checks.
     */ _define_property(HybridStorage, "idbCapabilityCheckerPromise", null);
/**
     * A flag that stores the result of the IndexedDB support check.
     * If true, IndexedDB is supported in the environment.
     */ _define_property(HybridStorage, "idbSupported", false);
/**
     * Prefix for the test IndexedDB database name.
     * This test database is used to check if IndexedDB is supported in the current environment.
     */ _define_property(HybridStorage, "TEST_IDB_NAME_PREFIX", 'test_');
/**
     * Version number for the test IndexedDB database.
     */ _define_property(HybridStorage, "TEST_IDB_VERSION", 1);
/**
     * The key used to store metadata in SuperJSON-serialized data.
     */ _define_property(HybridStorage, "SUPERJSON_META_KEY", 'meta');
/**
     * Serializes the given data using SuperJSON.
     *
     * @param data The data to serialize.
     *
     * @returns The serialized data.
     */ _define_property(HybridStorage, "serialize", (data)=>superjson__rspack_import_1/* .SuperJSON.serialize */.mb.serialize(data));
/**
     * Deserializes the given data using SuperJSON.
     *
     * @param data The data to deserialize.
     *
     * @returns The deserialized data.
     */ _define_property(HybridStorage, "deserialize", (data)=>superjson__rspack_import_1/* .SuperJSON.deserialize */.mb.deserialize(data));


},
58863(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  l: () => (IDBStorage)
});
/* import */ var idb__rspack_import_0 = __webpack_require__(93051);
/* import */ var _common_logger__rspack_import_1 = __webpack_require__(42228);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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


/**
 * Provides a storage mechanism using IndexedDB. This class implements the
 * StorageInterface with asynchronous methods to interact with the database.
 *
 * @template Data The type of the value stored in the storage.
 */ class IDBStorage {
    /**
     * Ensures the database is opened before any operations. If the database
     * is not already opened, it opens the database.
     *
     * @returns The opened database instance.
     */ async getOpenedDb() {
        if (this.db) {
            return this.db;
        }
        if (this.dbGetterPromise) {
            return this.dbGetterPromise;
        }
        this.dbGetterPromise = (async ()=>{
            this.db = await (0,idb__rspack_import_0/* .openDB */.P2)(this.name, this.version, {
                upgrade: (db)=>{
                    // Make sure the store exists
                    if (!db.objectStoreNames.contains(this.store)) {
                        db.createObjectStore(this.store);
                    }
                }
            });
            this.dbGetterPromise = null;
            return this.db;
        })();
        return this.dbGetterPromise;
    }
    /**
     * Retrieves a value by key from the store.
     *
     * @param key The key of the value to retrieve.
     *
     * @returns The value associated with the key.
     */ async get(key) {
        const db = await this.getOpenedDb();
        return db.get(this.store, key);
    }
    /**
     * Sets a value in the store with the specified key.
     *
     * @param key The key under which to store the value.
     * @param value The value to store.
     */ async set(key, value) {
        const db = await this.getOpenedDb();
        await db.put(this.store, value, key);
    }
    /**
     * Removes a value from the store by key.
     *
     * @param key The key of the value to remove.
     */ async remove(key) {
        const db = await this.getOpenedDb();
        await db.delete(this.store, key);
    }
    /**
     * Atomic set operation for multiple key-value pairs.
     * This method is using transaction to ensure atomicity, if any of the operations fail,
     * the entire operation is rolled back. This helps to prevent data corruption / inconsistency.
     *
     * @param data The key-value pairs to set.
     *
     * @returns True if all operations were successful, false otherwise.
     *
     * @example
     * ```ts
     * const storage = new IDBStorage();
     * await storage.setMultiple({
     *    key1: 'value1',
     *    key2: 'value2',
     * });
     * ```
     */ async setMultiple(data) {
        const db = await this.getOpenedDb();
        const tx = db.transaction(this.store, 'readwrite');
        try {
            await Promise.all(Object.entries(data).map(([key, value])=>tx.store.put(value, key)));
            await tx.done;
        } catch (e) {
            _common_logger__rspack_import_1/* .logger.error */.v.error('[ext.IDBStorage.setMultiple]: error while setting multiple keys in the storage:', e);
            tx.abort();
            return false;
        }
        return true;
    }
    /**
     * Removes multiple key-value pairs from the storage.
     *
     * @param keys The keys to remove.
     *
     * @returns True if all operations were successful, false otherwise.
     */ async removeMultiple(keys) {
        const db = await this.getOpenedDb();
        const tx = db.transaction(this.store, 'readwrite');
        try {
            await Promise.all(keys.map((key)=>tx.store.delete(key)));
            await tx.done;
        } catch (e) {
            _common_logger__rspack_import_1/* .logger.error */.v.error('[ext.IDBStorage.removeMultiple]: error while removing multiple keys from the storage:', e);
            tx.abort();
            return false;
        }
        return true;
    }
    /**
     * Get the entire contents of the storage.
     *
     * @returns Promise that resolves with the entire contents of the storage.
     */ async entries() {
        const db = await this.getOpenedDb();
        const entries = {};
        const tx = db.transaction(this.store, 'readonly');
        // eslint-disable-next-line no-restricted-syntax
        for await (const cursor of tx.store){
            const key = String(cursor.key);
            entries[key] = cursor.value;
        }
        return entries;
    }
    /**
     * Get all keys in the storage.
     *
     * @returns Promise that resolves with all keys in the storage.
     */ async keys() {
        const db = await this.getOpenedDb();
        const idbKeys = await db.getAllKeys(this.store);
        return idbKeys.map((key)=>key.toString());
    }
    /**
     * Check if a key exists in the storage.
     *
     * @param key The key to check.
     *
     * @returns True if the key exists, false otherwise.
     */ async has(key) {
        const db = await this.getOpenedDb();
        const idbKey = await db.getKey(this.store, key);
        return idbKey !== undefined;
    }
    /**
     * Clears the storage.
     */ async clear() {
        const db = await this.getOpenedDb();
        await db.clear(this.store);
    }
    /**
     * Constructs an instance of the IDBStorage class.
     *
     * @param [name=IDBStorage.DEFAULT_IDB_NAME] The name of the database.
     * @param [version=1] The version of the database.
     * @param [store=IDBStorage.DEFAULT_STORE_NAME] The name of the store within the database.
     */ constructor(name = IDBStorage.DEFAULT_IDB_NAME, version = IDBStorage.DEFAULT_IDB_VERSION, store = IDBStorage.DEFAULT_STORE_NAME){
        /**
     * Holds the instance of the IndexedDB database.
     */ _define_property(this, "db", null);
        /**
     * Promise to get IndexedDB database.
     */ _define_property(this, "dbGetterPromise", null);
        /**
     * The name of the database.
     */ _define_property(this, "name", void 0);
        /**
     * The version of the database. Used for upgrades.
     */ _define_property(this, "version", void 0);
        /**
     * The name of the store within the database.
     */ _define_property(this, "store", void 0);
        this.name = name;
        this.version = version;
        this.store = store;
    }
}
/**
     * The default name of the store within the database.
     */ _define_property(IDBStorage, "DEFAULT_STORE_NAME", 'defaultStore');
/**
     * The default version of the database.
     */ _define_property(IDBStorage, "DEFAULT_IDB_VERSION", 1);
/**
     * The default name of the database.
     */ _define_property(IDBStorage, "DEFAULT_IDB_NAME", 'adguardIDB');


},
81764(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  W: () => (hybridStorage),
  g: () => (browserStorage)
});
/* import */ var core_js_modules_web_self_js__rspack_import_0 = __webpack_require__(73175);
/* import */ var core_js_modules_web_self_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_self_js__rspack_import_0);
/* import */ var webextension_polyfill__rspack_import_1 = __webpack_require__(28467);
/* import */ var webextension_polyfill__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__rspack_import_1);
/* import */ var _browser_storage__rspack_import_4 = __webpack_require__(93926);
/* import */ var _hybrid_storage__rspack_import_2 = __webpack_require__(36570);
/* import */ var _idb_storage__rspack_import_3 = __webpack_require__(58863);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 




/**
 * Storage instance for accessing `browser.storage.local`.
 */ const browserStorage = new _browser_storage__rspack_import_4/* .BrowserStorage */.s((webextension_polyfill__rspack_import_1_default().storage.local));
/**
 * Storage instance for accessing `IndexedDB` with fallback to `browser.storage.local`.
 */ const hybridStorage = new _hybrid_storage__rspack_import_2/* .HybridStorage */.w((webextension_polyfill__rspack_import_1_default().storage.local));
// Expose storage instances to the global scope for debugging purposes,
// because it's hard to access them from the console in the background
// page or impossible from Application tab -> IndexedDB (showing empty page).
if (false) {}


},
88819(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $1: () => (NavigationTag),
  $2: () => (FILTERING_LOG_WINDOW_STATE),
  $F: () => (SCHEMA_VERSION_KEY),
  Cb: () => (MIN_UPDATE_DISPLAY_DURATION_MS),
  DY: () => (NotifierType),
  Eg: () => (TOTAL_BLOCKED_STATS_GROUP_ID),
  FF: () => (BACKGROUND_TAB_ID),
  Fr: () => (HIT_STATISTIC_KEY),
  Fx: () => (TRUSTED_TAG_KEYWORD),
  GE: () => (FiltersUpdateTime),
  He: () => (SB_SUSPENDED_CACHE_KEY),
  JP: () => (NEWLINE_CHAR_UNIX),
  Ke: () => (TRUSTED_DOCUMENTS_CACHE_KEY),
  LT: () => (CONTENT_SCRIPT_INJECTION_FLAG),
  Lf: () => (APP_SCHEMA_VERSION),
  N3: () => (LAST_NOTIFICATION_TIME_KEY),
  Nq: () => (RECOMMENDED_TAG_ID),
  SG: () => (CHROME_EXTENSIONS_SETTINGS_URL),
  TR: () => (OPTIONS_PAGE),
  Tx: () => (CUSTOM_FILTERS_GROUP_DISPLAY_NUMBER),
  UA: () => (NOTIFICATION_TTL_MS),
  Vx: () => (PAGE_STATISTIC_KEY),
  WC: () => (NEWLINE_CHAR_REGEX),
  WT: () => (CLIENT_ID_KEY),
  Xu: () => (CUSTOM_FILTERS_START_ID),
  Xy: () => (SEPARATE_ANNOYANCE_FILTER_IDS),
  Zm: () => (ANNOYANCES_CONSENT_KEY),
  a2: () => (TELEMETRY_SYNTHETIC_ID_KEY),
  aX: () => (FILTER_LIST_EXTENSION),
  gU: () => (SCROLLBAR_WIDTH),
  ge: () => (AntibannerGroupsId),
  hd: () => (APP_VERSION_KEY),
  i0: () => (AppearanceTheme),
  iR: () => (WASTE_CHARACTERS),
  j8: () => (AntiBannerFiltersId),
  j9: () => (RULES_LIMITS_KEY),
  oW: () => (KEEP_ALIVE_PORT_NAME),
  qj: () => (VIEWED_NOTIFICATIONS_KEY),
  rv: () => (USER_SCRIPTS_API_MIN_CHROME_VERSION_REQUIRED),
  tj: () => (ADGUARD_SETTINGS_KEY),
  vs: () => (SB_LRU_CACHE_KEY),
  xG: () => (TRUSTED_TAG_ID)
});
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ /**
 * Current version of app storage data schema.
 *
 * Schema version is used on extension version update.
 *
 * Note: Do not to be confused with the protocol version of the imported config.
 */ const APP_SCHEMA_VERSION = 14;
const CLIENT_ID_KEY = 'client-id';
const APP_VERSION_KEY = 'app-version';
const SCHEMA_VERSION_KEY = 'schema-version';
const ADGUARD_SETTINGS_KEY = 'adguard-settings';
const PAGE_STATISTIC_KEY = 'page-statistic';
const TRUSTED_DOCUMENTS_CACHE_KEY = 'trusted-documents';
const SB_LRU_CACHE_KEY = 'sb-lru-cache';
const SB_SUSPENDED_CACHE_KEY = 'safebrowsing-suspended-from';
const VIEWED_NOTIFICATIONS_KEY = 'viewed-notifications';
const LAST_NOTIFICATION_TIME_KEY = 'viewed-notification-time';
const FILTERING_LOG_WINDOW_STATE = 'filtering-log-window-state';
const HIT_STATISTIC_KEY = 'filters-hit-count';
const ANNOYANCES_CONSENT_KEY = 'annoyances-consent';
const RULES_LIMITS_KEY = 'rules-limits';
const MANUAL_EXTENSION_UPDATE_KEY = 'manual-extension-update';
/**
 * Storage key to prevent double injection of content scripts after extension update.
 * Set before extension reload, checked and cleared after reload.
 */ const CONTENT_SCRIPT_INJECTION_FLAG = 'content-script-injection-flag';
/**
 * Storage key for auto-update state data, used only in MV3.
 */ const AUTO_UPDATE_STATE_KEY_MV3 = 'auto-update-state-mv3';
/**
 * Storage key for auto-update configuration override, used only in MV3 for testing.
 */ const AUTO_UPDATE_CONFIG_KEY_MV3 = 'auto-update-config-mv3';
/**
 * Storage key for telemetry synthetic ID.
 */ const TELEMETRY_SYNTHETIC_ID_KEY = 'telemetry-synthetic-id';
/**
 * Filter ids used in the code on the background page and filtering log page.
 */ var AntiBannerFiltersId = /*#__PURE__*/ function(AntiBannerFiltersId) {
    AntiBannerFiltersId[AntiBannerFiltersId["StealthModeFilterId"] = -1] = "StealthModeFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["UserFilterId"] = 0] = "UserFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["EnglishFilterId"] = 2] = "EnglishFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["TrackingFilterId"] = 3] = "TrackingFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["SocialFilterId"] = 4] = "SocialFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["SearchAndSelfPromoFilterId"] = 10] = "SearchAndSelfPromoFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesCombinedFilterId"] = 14] = "AnnoyancesCombinedFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["DnsFilterId"] = 15] = "DnsFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["UrlTrackingFilterId"] = 17] = "UrlTrackingFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesCookieNoticesFilterId"] = 18] = "AnnoyancesCookieNoticesFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesPopupsFilterId"] = 19] = "AnnoyancesPopupsFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesMobileAppBannersFilterId"] = 20] = "AnnoyancesMobileAppBannersFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesOtherAnnoyancesFilterId"] = 21] = "AnnoyancesOtherAnnoyancesFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AnnoyancesWidgetsFilterId"] = 22] = "AnnoyancesWidgetsFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["AllowlistFilterId"] = 100] = "AllowlistFilterId";
    AntiBannerFiltersId[AntiBannerFiltersId["MobileAdsFilterId"] = 11] = "MobileAdsFilterId";
    /**
     * @deprecated
     */ AntiBannerFiltersId[AntiBannerFiltersId["QuickFixesFilterId"] = 24] = "QuickFixesFilterId";
    return AntiBannerFiltersId;
}({});
/**
 * AdGuard Annoyances filter has been splitted into 5 other filters:
 * Cookie Notices, Popups, Mobile App Banners, Other Annoyances
 * and Widgets - which we should enabled instead of the Annoyances filter.
 */ const SEPARATE_ANNOYANCE_FILTER_IDS = [
    18,
    19,
    20,
    21,
    22
];
/**
 * Group ids used in the code on the multiple entry points.
 */ var AntibannerGroupsId = /*#__PURE__*/ function(AntibannerGroupsId) {
    /**
     * Custom filters group identifier.
     */ AntibannerGroupsId[AntibannerGroupsId["CustomFiltersGroupId"] = 0] = "CustomFiltersGroupId";
    AntibannerGroupsId[AntibannerGroupsId["AdBlockingFiltersGroupId"] = 1] = "AdBlockingFiltersGroupId";
    AntibannerGroupsId[AntibannerGroupsId["PrivacyFiltersGroupId"] = 2] = "PrivacyFiltersGroupId";
    AntibannerGroupsId[AntibannerGroupsId["SocialFiltersGroupId"] = 3] = "SocialFiltersGroupId";
    AntibannerGroupsId[AntibannerGroupsId["AnnoyancesFiltersGroupId"] = 4] = "AnnoyancesFiltersGroupId";
    AntibannerGroupsId[AntibannerGroupsId["SecurityFiltersGroupId"] = 5] = "SecurityFiltersGroupId";
    /**
     * Other filters group identifier.
     */ AntibannerGroupsId[AntibannerGroupsId["OtherFiltersGroupId"] = 6] = "OtherFiltersGroupId";
    /**
     * Language-specific group identifier.
     */ AntibannerGroupsId[AntibannerGroupsId["LanguageFiltersGroupId"] = 7] = "LanguageFiltersGroupId";
    return AntibannerGroupsId;
}({});
/**
 * Recommended filters tag ID.
 *
 * @see https://github.com/AdguardTeam/FiltersRegistry/blob/4528f7ae6b38aec90111a27efb0a7e0958d0cf37/tags/metadata.json#L40
 */ const RECOMMENDED_TAG_ID = 10;
/**
 * Enum with the list of the messages which are sent from the background
 * to notify UI about some events, e.g. some field in settings was updated.
 */ var NotifierType = /*#__PURE__*/ function(NotifierType) {
    NotifierType["RequestFilterUpdated"] = "event.request.filter.updated";
    NotifierType["UserFilterUpdated"] = "event.user.filter.updated";
    NotifierType["CustomFilterAdded"] = "event.custom.filter.added";
    NotifierType["UpdateAllowlistFilterRules"] = "event.update.allowlist.filter.rules";
    NotifierType["SettingUpdated"] = "event.update.setting.value";
    NotifierType["FiltersUpdateCheckReady"] = "event.update.filters.check";
    NotifierType["ExtensionUpdateStateChange"] = "event.update.extension.state.change";
    // Filtering log events.
    NotifierType["TabAdded"] = "log.tab.added";
    NotifierType["TabClose"] = "log.tab.close";
    NotifierType["TabUpdate"] = "log.tab.update";
    NotifierType["TabReset"] = "log.tab.reset";
    // Fullscreen user rules events
    NotifierType["FullscreenUserRulesEditorUpdated"] = "event.user.rules.editor.updated";
    return NotifierType;
}({});
const KEEP_ALIVE_PORT_NAME = 'keep-alive';
var NavigationTag = /*#__PURE__*/ function(NavigationTag) {
    NavigationTag["Regular"] = "regular";
    NavigationTag["Party"] = "party";
    return NavigationTag;
}({});
/**
 * Trusted tag for custom filters
 */ const TRUSTED_TAG_KEYWORD = 'trusted';
/**
 * Trusted tag id for custom filters.
 */ const TRUSTED_TAG_ID = 999;
/**
 * Custom filters group display number
 */ const CUSTOM_FILTERS_GROUP_DISPLAY_NUMBER = 99;
/**
 * Custom filters identifiers starts from this number
 */ const CUSTOM_FILTERS_START_ID = 1000;
// Unnecessary characters that will be replaced
const WASTE_CHARACTERS = /[.*+?^${}()|[\]\\]/g;
// Custom scrollbar width
const SCROLLBAR_WIDTH = 12;
const BACKGROUND_TAB_ID = -1;
const TOTAL_BLOCKED_STATS_GROUP_ID = 'total';
/**
 *  Time interval between filter updates.
 */ var FiltersUpdateTime = /*#__PURE__*/ function(FiltersUpdateTime) {
    FiltersUpdateTime[FiltersUpdateTime["Disabled"] = 0] = "Disabled";
    FiltersUpdateTime[FiltersUpdateTime["OneHour"] = 3600000] = "OneHour";
    FiltersUpdateTime[FiltersUpdateTime["SixHours"] = 21600000] = "SixHours";
    FiltersUpdateTime[FiltersUpdateTime["TwelveHours"] = 43200000] = "TwelveHours";
    FiltersUpdateTime[FiltersUpdateTime["TwentyFourHours"] = 86400000] = "TwentyFourHours";
    FiltersUpdateTime[FiltersUpdateTime["FortyEightHours"] = 172800000] = "FortyEightHours";
    FiltersUpdateTime[FiltersUpdateTime["Default"] = -1] = "Default";
    return FiltersUpdateTime;
}({});
const NEWLINE_CHAR_UNIX = '\n';
const NEWLINE_CHAR_REGEX = /\r?\n/;
const OPTIONS_PAGE = 'pages/options.html';
const FILTER_LIST_EXTENSION = '.txt';
/**
 * Special event name for extension initialization, needed for run automatic
 * integration tests.
 */ const EXTENSION_INITIALIZED_EVENT = 'initialized';
/**
 * Chrome's extensions settings page url.
 */ const CHROME_EXTENSIONS_SETTINGS_URL = 'chrome://extensions';
/**
 * Time-to-live for notifications in milliseconds.
 */ const NOTIFICATION_TTL_MS = 4000;
/**
 * Minimum Chrome versions required for different toggles which enables usage of User Scripts API.
 *
 * User scripts API with needed 'execute' method is supported from Chrome 135 and higher.
 * But prior to 138 it can be enabled only via Developer mode toggle.
 * And for 138 and higher it can be enabled via User Scripts API toggle in the extensions details.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/api/userScripts
 */ const USER_SCRIPTS_API_MIN_CHROME_VERSION_REQUIRED = {
    /**
     * Minimum Chrome version where Developer mode should be enabled.
     *
     * @see https://developer.chrome.com/docs/extensions/reference/api/userScripts#chrome_versions_prior_to_138_developer_mode_toggle
     */ DEV_MODE_TOGGLE: 135,
    /**
     * Minimum Chrome version where User Scripts API toggle should be enabled.
     *
     * @see https://developer.chrome.com/docs/extensions/reference/api/userScripts#chrome_versions_138_and_newer_allow_user_scripts_toggle
     */ ALLOW_USER_SCRIPTS_TOGGLE: 138
};
/**
 * Delay in milliseconds before rechecking the state of the User Scripts API permission.
 *
 * Needed to update the state of the warning when the user grants or revokes the permission.
 */ const USER_SCRIPTS_API_WARNING_RECHECK_DELAY_MS = 2000;
/**
 * States for the extension update finite state machine (FSM).
 */ var ExtensionUpdateFSMState = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(ExtensionUpdateFSMState) {
    /**
     * Idle state.
     */ ExtensionUpdateFSMState["Idle"] = "Idle";
    /**
     * Checking for updates state.
     */ ExtensionUpdateFSMState["Checking"] = "Checking";
    /**
     * Available updates state.
     */ ExtensionUpdateFSMState["Available"] = "Available";
    /**
     * Updating state.
     */ ExtensionUpdateFSMState["Updating"] = "Updating";
    /**
     * Not available updates state.
     *
     * It means that the extension is already up-to-date.
     */ ExtensionUpdateFSMState["NotAvailable"] = "NotAvailable";
    /**
     * Update failed state.
     */ ExtensionUpdateFSMState["Failed"] = "Failed";
    /**
     * Update success state.
     */ ExtensionUpdateFSMState["Success"] = "Success";
    return ExtensionUpdateFSMState;
}({})));
/**
 * Events for the extension update finite state machine (FSM).
 *
 * Note: there is no event for successful update, because it is not needed —
 * the extension is reloaded automatically after the update
 * and needed notification is shown based on the storage value (set before the update).
 * For more details, see `ExtensionUpdateService.handleExtensionReloadOnUpdate()`.
 */ var ExtensionUpdateFSMEvent = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(ExtensionUpdateFSMEvent) {
    /**
     * Event to initialize the state machine.
     */ ExtensionUpdateFSMEvent["Init"] = "Init";
    /**
     * Event to check for updates.
     */ ExtensionUpdateFSMEvent["Check"] = "Check";
    /**
     * Event for no available updates after the check.
     */ ExtensionUpdateFSMEvent["NoUpdateAvailable"] = "NoUpdateAvailable";
    /**
     * Event for available updates after the check.
     */ ExtensionUpdateFSMEvent["UpdateAvailable"] = "UpdateAvailable";
    /**
     * Event to start the update.
     */ ExtensionUpdateFSMEvent["Update"] = "Update";
    /**
     * Event for failed update.
     */ ExtensionUpdateFSMEvent["UpdateFailed"] = "UpdateFailed";
    return ExtensionUpdateFSMEvent;
}({})));
/**
 * Time duration for showing update state change. Needed for smoother user experience.
 */ const MIN_UPDATE_DISPLAY_DURATION_MS = 2 * 1000;
/**
 * Available appearance themes for the extension UI.
 */ var AppearanceTheme = /*#__PURE__*/ function(AppearanceTheme) {
    AppearanceTheme["System"] = "system";
    AppearanceTheme["Dark"] = "dark";
    AppearanceTheme["Light"] = "light";
    return AppearanceTheme;
}({});


},
59387(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  S9: () => (ForwardFrom),
  u2: () => (ForwardAction),
  w8: () => (Forward)
});
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ /**
 * IMPORTANT: do not change the values as tds is already configured for that specific strings.
 */ function _define_property(obj, key, value) {
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
var ForwardAction = /*#__PURE__*/ function(ForwardAction) {
    ForwardAction["UninstallExtension"] = "adguard_uninstal_ext";
    // used for thank you page
    ForwardAction["ThankYou"] = "thank_you_page";
    // used for thank you page for MV3
    ForwardAction["ThankYouMv3"] = "thank_you_page_mv3";
    // used for "More information" on the page blocked by Safebrowsing
    ForwardAction["SiteReport"] = "site_report_page";
    // used for "Report an issue" in popup or context menu on the page
    ForwardAction["IssueReport"] = "report";
    // used for "Report a bug" on options page in General section
    ForwardAction["BugReport"] = "bug_report";
    ForwardAction["BugReportMv3"] = "bug_report_mv3";
    ForwardAction["Privacy"] = "privacy";
    ForwardAction["Acknowledgments"] = "acknowledgments";
    ForwardAction["Github"] = "github_options";
    ForwardAction["Website"] = "adguard_site";
    ForwardAction["Discuss"] = "discuss";
    ForwardAction["Compare"] = "compare";
    ForwardAction["Changelog"] = "github_version_popup";
    ForwardAction["GlobalPrivacyControl"] = "global_privacy_control";
    ForwardAction["DoNotTrack"] = "do_not_track";
    ForwardAction["HowToCreateRules"] = "userfilter_description";
    ForwardAction["FilterPolicy"] = "filter_policy";
    ForwardAction["AdguardSite"] = "adguard_site";
    ForwardAction["SelfPromotion"] = "self_promotion";
    ForwardAction["ProtectionWorks"] = "protection_works";
    ForwardAction["CollectHitsLearnMore"] = "filter_rules";
    ForwardAction["OperaStore"] = "opera_store";
    ForwardAction["FirefoxStore"] = "firefox_store";
    /**
     * Main supported release version — "AdGuard AdBlocker".
     */ ForwardAction["ChromeStore"] = "chrome_store";
    // TODO: can be removed in few months after v5.0 MV3 release
    // since it will no longer be used
    /**
     * Supported MV3 beta version.
     *
     * Previously known as "AdGuard AdBlocker MV3 Experimental",
     * currently — "AdGuard AdBlocker (MV3 Beta)".
     */ ForwardAction["ChromeMv3Store"] = "chrome_mv3_store";
    /**
     * Supported MV2 release version.
     *
     * Previously known as "AdGuard AdBlocker (Beta)".
     */ ForwardAction["ChromeMv2Store"] = "chrome_mv2_store";
    ForwardAction["EdgeStore"] = "edge_store";
    ForwardAction["IOS"] = "ios_about";
    ForwardAction["Android"] = "android_about";
    ForwardAction["GetTheApp"] = "get_the_app";
    ForwardAction["GithubVersion"] = "github_version_popup";
    ForwardAction["GithubVersionBeta"] = "github_version_popup_beta";
    ForwardAction["LearnAboutAdGuard"] = "learn_about_adguard";
    ForwardAction["FilteringLogAssumedRule"] = "filtering_log_assumed_rule";
    ForwardAction["NewYear25"] = "new_year_25";
    // TODO: Delete from here and TDS after release v5.2.
    ForwardAction["CustomFiltersMv3Disabled"] = "custom_mv3_disabled";
    // IMPORTANT: do not change the value as tds is already configured for that specific string.
    ForwardAction["UserScriptsApiRequired"] = "developer_mode_required";
    return ForwardAction;
}({});
/**
 * All pages from which a user can be forwarded.
 */ var ForwardFrom = /*#__PURE__*/ function(ForwardFrom) {
    ForwardFrom["Background"] = "background";
    ForwardFrom["Options"] = "options_screen";
    ForwardFrom["OptionsFooter"] = "options_screen_footer";
    ForwardFrom["ContextMenu"] = "context_menu";
    ForwardFrom["Popup"] = "popup";
    ForwardFrom["Safebrowsing"] = "safebrowsing";
    ForwardFrom["Adblocker"] = "adblocked";
    ForwardFrom["VersionPopup"] = "version_popup";
    ForwardFrom["FilteringLog"] = "filtering_log";
    return ForwardFrom;
}({});
var ForwardApp = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(ForwardApp) {
    ForwardApp["BrowserExtension"] = "browser_extension";
    return ForwardApp;
}({})));
/**
 * Class for creating forward links
 */ class Forward {
    static get(params) {
        const queryString = Object.entries({
            ...Forward.defaultParams,
            ...params
        }).map(([key, value])=>`${key}=${value}`).join('&');
        return `${Forward.url}?${queryString}`;
    }
}
_define_property(Forward, "url", 'https://link.adtidy.org/forward.html');
_define_property(Forward, "defaultParams", {
    app: "browser_extension"
});


},
42228(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  v: () => (logger)
});
/* import */ var core_js_modules_es_array_includes_js__rspack_import_0 = __webpack_require__(45403);
/* import */ var core_js_modules_es_array_includes_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__rspack_import_0);
/* import */ var core_js_modules_web_self_js__rspack_import_1 = __webpack_require__(73175);
/* import */ var core_js_modules_web_self_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_self_js__rspack_import_1);
/* import */ var _adguard_logger__rspack_import_2 = __webpack_require__(44469);
/* import */ var _background_storages_shared_instances__rspack_import_3 = __webpack_require__(81764);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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




/**
 * Extended logger with persistent log level setting.
 * Extends the base Logger class with browser storage integration
 * for saving and retrieving log level preferences.
 */ class ExtendedLogger extends _adguard_logger__rspack_import_2/* .Logger */.Vy {
    /**
     * Checks if the current log level is verbose (Debug or Verbose).
     *
     * This method is useful for determining if detailed logging should
     * be enabled across the application in different modules. Some kind of
     * "single point of truth".
     *
     * @returns True if current log level is Debug or Verbose, false otherwise.
     */ isVerbose() {
        return this.currentLevel === _adguard_logger__rspack_import_2/* .LogLevel.Debug */.$b.Debug || this.currentLevel === _adguard_logger__rspack_import_2/* .LogLevel.Verbose */.$b.Verbose;
    }
    /**
     * Sets log with persistent value, which will be saved, if
     * browser.storage.local is available.
     *
     * @param level Log level to set.
     */ setLogLevel(level) {
        this.currentLevel = level;
        _background_storages_shared_instances__rspack_import_3/* .browserStorage.set */.g.set(ExtendedLogger.LOG_LEVEL_LOCAL_STORAGE_KEY, level).catch((error)=>{
            // eslint-disable-next-line max-len
            this.error('[ext.ExtendedLogger.setLogLevel]: failed to save log level in browser.storage.local: ', error);
        });
    }
    /**
     * Validates if the provided value is a valid LogLevel.
     *
     * @param value Value to validate.
     *
     * @returns {boolean} True if the value is a valid LogLevel, false otherwise.
     */ static isValidLogLevel(value) {
        return typeof value === 'string' && Object.values(_adguard_logger__rspack_import_2/* .LogLevel */.$b).includes(value);
    }
    /**
     * Initializes the logger by loading the saved log level from browser storage.
     * Falls back to the default log level if retrieval fails or the stored level is invalid.
     *
     * @returns Promise that resolves when initialization is complete.
     */ async init() {
        try {
            const logLevel = await _background_storages_shared_instances__rspack_import_3/* .browserStorage.get */.g.get(ExtendedLogger.LOG_LEVEL_LOCAL_STORAGE_KEY);
            if (!ExtendedLogger.isValidLogLevel(logLevel)) {
                // Print a warning only if the log level is valuable.
                if (logLevel !== null && logLevel !== undefined) {
                    // eslint-disable-next-line max-len
                    this.warn('[ext.ExtendedLogger.init]: log level from browser.storage.local is not valid. Value: ', logLevel);
                }
                return;
            }
            try {
                this.setLogLevel(logLevel);
            } catch (e) {
                // eslint-disable-next-line max-len
                this.warn('[ext.ExtendedLogger.init]: failed to set log level from browser.storage.local, will set to default level. Error: ', e);
                this.setLogLevel(ExtendedLogger.DEFAULT_LOG_LEVEL);
            }
        } catch (error) {
            // eslint-disable-next-line max-len
            this.warn('[ext.ExtendedLogger.init]: failed to get log level from browser.storage.local: ', error);
        }
    }
    /**
     * Creates a new instance of ExtendedLogger.
     * Initializes the logger with the default log level based on build configuration.
     */ constructor(){
        super();
        this.currentLevel = ExtendedLogger.DEFAULT_LOG_LEVEL;
    }
}
/**
     * Key for storing the current log level in browser storage.
     */ _define_property(ExtendedLogger, "LOG_LEVEL_LOCAL_STORAGE_KEY", 'log-level');
/**
     * Default log level based on the build configuration.
     */ _define_property(ExtendedLogger, "DEFAULT_LOG_LEVEL",  true ? _adguard_logger__rspack_import_2/* .LogLevel.Info */.$b.Info : 0);
const logger = new ExtendedLogger();
// Expose logger to the window object,
// to have possibility to switch log level from the console.
// Example: adguard.logger.setCurrentLevel('trace');
// eslint-disable-next-line no-restricted-globals
Object.assign(self, {
    adguard: {
        ...self.adguard,
        logger
    }
});



},
29086(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  G: () => (MessageType),
  z: () => (APP_MESSAGE_HANDLER_NAME)
});
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ /**
 * Important: do not use z.inferOf, because it brings a lot of side effects with
 * many dependencies to the bundle.
 *
 * Also please try, if possible, to not import here external modules
 * other that types.
 */ const APP_MESSAGE_HANDLER_NAME = 'app';
/**
 * Message types used for message passing between extension contexts
 * (popup, filtering log, content scripts, background)
 */ var MessageType = /*#__PURE__*/ function(MessageType) {
    MessageType["CreateEventListener"] = "createEventListener";
    MessageType["RemoveListener"] = "removeListener";
    MessageType["OpenExtensionStore"] = "openExtensionStore";
    MessageType["AddAndEnableFilter"] = "addAndEnableFilter";
    MessageType["ApplySettingsJson"] = "applySettingsJson";
    MessageType["OpenFilteringLog"] = "openFilteringLog";
    MessageType["OpenFullscreenUserRules"] = "openFullscreenUserRules";
    MessageType["UpdateFullscreenUserRulesTheme"] = "updateFullscreenUserRulesTheme";
    MessageType["ResetBlockedAdsCount"] = "resetBlockedAdsCount";
    MessageType["ResetSettings"] = "resetSettings";
    MessageType["GetUserRules"] = "getUserRules";
    MessageType["SaveUserRules"] = "saveUserRules";
    MessageType["GetAllowlistDomains"] = "getAllowlistDomains";
    MessageType["SaveAllowlistDomains"] = "saveAllowlistDomains";
    MessageType["CheckFiltersUpdate"] = "checkFiltersUpdate";
    MessageType["CheckExtensionUpdateMv3"] = "checkExtensionUpdateMv3";
    MessageType["UpdateExtensionMv3"] = "updateExtensionMv3";
    MessageType["DisableFiltersGroup"] = "disableFiltersGroup";
    MessageType["DisableFilter"] = "disableFilter";
    MessageType["LoadCustomFilterInfo"] = "loadCustomFilterInfo";
    MessageType["SubscribeToCustomFilter"] = "subscribeToCustomFilter";
    MessageType["RemoveAntiBannerFilter"] = "removeAntiBannerFilter";
    MessageType["GetIsAppInitialized"] = "getIsAppInitialized";
    MessageType["GetTabInfoForPopup"] = "getTabInfoForPopup";
    MessageType["ChangeApplicationFilteringPaused"] = "changeApplicationFilteringPaused";
    MessageType["OpenRulesLimitsTab"] = "openRulesLimitsTab";
    MessageType["OpenSettingsTab"] = "openSettingsTab";
    MessageType["OpenAssistant"] = "openAssistant";
    MessageType["OpenAbuseTab"] = "openAbuseTab";
    MessageType["OpenSiteReportTab"] = "openSiteReportTab";
    MessageType["OpenComparePage"] = "openComparePage";
    MessageType["OpenChromeExtensionsSettingsPage"] = "openChromeExtensionsSettingsPage";
    MessageType["OpenExtensionDetailsPage"] = "openExtensionDetailsPage";
    MessageType["ResetUserRulesForPage"] = "resetUserRulesForPage";
    MessageType["RemoveAllowlistDomain"] = "removeAllowlistDomain";
    MessageType["AddAllowlistDomainForTabId"] = "addAllowlistDomainForTabId";
    MessageType["AddAllowlistDomainForUrl"] = "addAllowlistDomainForUrl";
    MessageType["OnOpenFilteringLogPage"] = "onOpenFilteringLogPage";
    MessageType["GetFilteringLogData"] = "getFilteringLogData";
    MessageType["InitializeFrameScript"] = "initializeFrameScript";
    MessageType["InitializeBlockingPageScript"] = "initializeBlockingPageScript";
    MessageType["OnCloseFilteringLogPage"] = "onCloseFilteringLogPage";
    MessageType["GetFilteringInfoByTabId"] = "getFilteringInfoByTabId";
    MessageType["SynchronizeOpenTabs"] = "synchronizeOpenTabs";
    MessageType["ClearEventsByTabId"] = "clearEventsByTabId";
    MessageType["RefreshPage"] = "refreshPage";
    MessageType["AddUserRule"] = "addUserRule";
    MessageType["RemoveUserRule"] = "removeUserRule";
    MessageType["EnableFiltersGroup"] = "enableFiltersGroup";
    MessageType["NotifyListeners"] = "notifyListeners";
    MessageType["AddLongLivedConnection"] = "addLongLivedConnection";
    MessageType["GetOptionsData"] = "getOptionsData";
    MessageType["ChangeUserSettings"] = "changeUserSetting";
    MessageType["CheckRequestFilterReady"] = "checkRequestFilterReady";
    MessageType["OpenThankYouPage"] = "openThankYouPage";
    MessageType["OpenSafebrowsingTrusted"] = "openSafebrowsingTrusted";
    MessageType["GetSelectorsAndScripts"] = "getSelectorsAndScripts";
    MessageType["CheckPageScriptWrapperRequest"] = "checkPageScriptWrapperRequest";
    MessageType["ProcessShouldCollapse"] = "processShouldCollapse";
    MessageType["ProcessShouldCollapseMany"] = "processShouldCollapseMany";
    MessageType["AddFilteringSubscription"] = "addFilterSubscription";
    MessageType["SetNotificationViewed"] = "setNotificationViewed";
    MessageType["SaveCssHitsStats"] = "saveCssHitStats";
    MessageType["GetCookieRules"] = "getCookieRules";
    MessageType["SaveCookieLogEvent"] = "saveCookieRuleEvent";
    MessageType["LoadSettingsJson"] = "loadSettingsJson";
    MessageType["AddUrlToTrusted"] = "addUrlToTrusted";
    MessageType["SetPreserveLogState"] = "setPreserveLogState";
    MessageType["GetUserRulesEditorData"] = "getUserRulesEditorData";
    MessageType["GetEditorStorageContent"] = "getEditorStorageContent";
    MessageType["SetEditorStorageContent"] = "setEditorStorageContent";
    MessageType["SetFilteringLogWindowState"] = "setFilteringLogWindowState";
    MessageType["AppInitialized"] = "appInitialized";
    MessageType["UpdateTotalBlocked"] = "updateTotalBlocked";
    MessageType["ScriptletCloseWindow"] = "scriptletCloseWindow";
    MessageType["ShowRuleLimitsAlert"] = "showRuleLimitsAlert";
    MessageType["ShowAlertPopup"] = "showAlertPopup";
    MessageType["ShowVersionUpdatedPopup"] = "showVersionUpdatedPopup";
    MessageType["UpdateListeners"] = "updateListeners";
    MessageType["SetConsentedFilters"] = "setConsentedFilters";
    MessageType["GetIsConsentedFilter"] = "getIsConsentedFilter";
    MessageType["SendTelemetryCustomEvent"] = "sendTelemetryCustomEvent";
    MessageType["SendTelemetryPageViewEvent"] = "sendTelemetryPageViewEvent";
    MessageType["AddTelemetryOpenedPage"] = "addTelemetryOpenedPage";
    MessageType["RemoveTelemetryOpenedPage"] = "removeTelemetryOpenedPage";
    MessageType["GetRulesLimitsCountersMv3"] = "getRulesLimitsCountersMv3";
    MessageType["CanEnableStaticFilterMv3"] = "canEnableStaticFilterMv3";
    MessageType["CanEnableStaticGroupMv3"] = "canEnableStaticGroupMv3";
    MessageType["ClearRulesLimitsWarningMv3"] = "clearRulesLimitsWarningMv3";
    MessageType["RestoreFiltersMv3"] = "restoreFiltersMv3";
    MessageType["CurrentLimitsMv3"] = "currentLimitsMv3";
    MessageType["GetExtensionStatusForPopupMV3"] = "getExtensionStatusForPopupMV3";
    return MessageType;
}({});


},
8115(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Et: () => (/* reexport safe */ _message_handler__rspack_import_2.Et),
  Go: () => (/* reexport safe */ _constants__rspack_import_0.G),
  _z: () => (/* reexport safe */ _send_message__rspack_import_1._),
  aC: () => (/* reexport safe */ _message_handler__rspack_import_2.aC),
  hC: () => (/* reexport safe */ _send_message__rspack_import_1.h),
  oL: () => (/* reexport safe */ _message_handler__rspack_import_2.oL),
  zk: () => (/* reexport safe */ _constants__rspack_import_0.z)
});
/* import */ var _constants__rspack_import_0 = __webpack_require__(29086);
/* import */ var _send_message__rspack_import_1 = __webpack_require__(36083);
/* import */ var _message_handler__rspack_import_2 = __webpack_require__(81125);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ // Since exports from './constants' are: the MessageType enum and a lot of types,
// and imports there are types only, so it should not affect bundle size
// eslint-disable-next-line no-restricted-syntax





},
81125(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Et: () => (messageHasTypeField),
  aC: () => (MessageHandler),
  oL: () => (messageHasTypeAndDataFields)
});
/* import */ var core_js_modules_es_error_cause_js__rspack_import_0 = __webpack_require__(38796);
/* import */ var core_js_modules_es_error_cause_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__rspack_import_0);
/* import */ var webextension_polyfill__rspack_import_1 = __webpack_require__(28467);
/* import */ var webextension_polyfill__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__rspack_import_1);
/* import */ var _constants__rspack_import_2 = __webpack_require__(29086);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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



/**
 * Type guard for messages that have a 'type' field with possible {@link MessageType}.
 *
 * @note Added to no bring here huge zod library.
 *
 * @param message Unknown message.
 *
 * @returns True if message has 'type' field with possible {@link MessageType}.
 */ const messageHasTypeField = (message)=>{
    return typeof message === 'object' && message !== null && 'type' in message;
};
/**
 * Type guard for messages that have a 'type' field and 'data' field and looks like {@link Message}.
 *
 * @note Added to no bring here huge zod library.
 *
 * @param message Unknown message.
 *
 * @returns True if message has 'type' and 'data' fields and looks like {@link Message}.
 */ const messageHasTypeAndDataFields = (message)=>{
    return messageHasTypeField(message) && 'data' in message;
};
/**
 * API for handling Messages via {@link browser.runtime.onMessage}
 */ class MessageHandler {
    init() {
        webextension_polyfill__rspack_import_1_default().runtime.onMessage.addListener(this.handleMessage);
    }
    /**
     * Add message listener.
     * Listeners limited to 1 per message type to prevent race
     * condition while response processing.
     *
     * TODO: implement listeners priority execution strategy
     *
     * @param type - {@link ValidMessageTypes}
     * @param listener - {@link MessageListener}
     *
     * @throws error, if message listener already added
     */ addListener(type, listener) {
        if (this.listeners.has(type)) {
            throw new Error(`Message handler: ${type} listener has already been registered`);
        }
        // Cast through unknown to help TS understand that the listener is of
        // the correct type. It will check types at compile time.
        this.listeners.set(type, listener);
    }
    /**
     * Removes message listener.
     *
     * @param type - {@link ValidMessageTypes}
     */ removeListener(type) {
        this.listeners.delete(type);
    }
    /**
     * Removes all listeners
     */ removeListeners() {
        this.listeners.clear();
    }
    /**
     * Check if the message is of type {@link Message}.
     *
     * @param message Message of basic type {@link Message} or {@link EngineMessage}.
     *
     * @returns True if the message is of type {@link Message}.
     */ static isValidMessageType(message) {
        return message.handlerName === _constants__rspack_import_2/* .APP_MESSAGE_HANDLER_NAME */.z && 'type' in message;
    }
    constructor(){
        _define_property(this, "listeners", new Map());
        this.handleMessage = this.handleMessage.bind(this);
    }
}


},
36083(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  _: () => (sendMessage),
  h: () => (sendTabMessage)
});
/* import */ var webextension_polyfill__rspack_import_0 = __webpack_require__(28467);
/* import */ var webextension_polyfill__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__rspack_import_0);
/* import */ var _constants__rspack_import_1 = __webpack_require__(29086);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 

/**
 * TODO: Consider moving this file to the background folder, because all messages
 * from the UI should be send via methods of Messenger class instead of using
 * directly sendMessage to proper types checking.
 *
 * {@link sendMessage} sends app message via {@link browser.runtime.sendMessage} and
 * gets response from another extension page message handler
 *
 * @param message - partial {@link Message} record without {@link Message.handlerName} field
 *
 * @returns message handler response
 */ async function sendMessage(message) {
    try {
        return await webextension_polyfill__rspack_import_0_default().runtime.sendMessage({
            handlerName: _constants__rspack_import_1/* .APP_MESSAGE_HANDLER_NAME */.z,
            ...message
        });
    } catch (e) {
    // do nothing
    }
}
/**
 * {@link sendTabMessage} sends message to specified tab via {@link browser.tabs.sendMessage} and
 * gets response from it
 *
 * @param tabId - tab id
 * @param message - partial {@link Message} record without {@link Message.handlerName} field
 *
 * @returns tab message handler response
 */ async function sendTabMessage(tabId, message) {
    return webextension_polyfill__rspack_import_0_default().tabs.sendMessage(tabId, {
        handlerName: _constants__rspack_import_1/* .APP_MESSAGE_HANDLER_NAME */.z,
        ...message
    });
}


},
32706(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  YW: () => (/* reexport safe */ _messenger_common__rspack_import_1.Y),
  e0: () => (/* reexport safe */ _messenger_common__rspack_import_1.H),
  ee: () => (/* reexport safe */ messenger__rspack_import_0.N)
});
/* import */ var messenger__rspack_import_0 = __webpack_require__(70579);
/* import */ var _messenger_common__rspack_import_1 = __webpack_require__(28339);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ 



},
28339(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  H: () => (MessengerCommon),
  Y: () => (Page)
});
/* import */ var core_js_modules_es_array_includes_js__rspack_import_0 = __webpack_require__(45403);
/* import */ var core_js_modules_es_array_includes_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__rspack_import_0);
/* import */ var webextension_polyfill__rspack_import_1 = __webpack_require__(28467);
/* import */ var webextension_polyfill__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__rspack_import_1);
/* import */ var nanoid__rspack_import_4 = __webpack_require__(6500);
/* import */ var _common_logger__rspack_import_2 = __webpack_require__(42228);
/* import */ var _common_messages__rspack_import_3 = __webpack_require__(8115);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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





var Page = /*#__PURE__*/ function(Page) {
    Page["FullscreenUserRules"] = "fullscreen-user-rules";
    Page["FilteringLog"] = "filtering-log";
    Page["Popup"] = "popup";
    return Page;
}({});
/**
 * MessengerCommon class, used to communicate with the background page from the UI.
 * Actually, it's a wrapper around the browser.runtime.sendMessage method.
 */ class MessengerCommon {
    /**
     * Sends a message to the background page.
     *
     * All messages described in the {@link MessageType} enum.
     * All answers described in the {@link MessageMap} type.
     *
     * @param type Message type.
     * @param data Message data. Optional because not all messages have data.
     *
     * @returns Promise that resolves with the response from the background page.
     * Type of the response depends on the message type. Go to {@link MessageMap}
     * to see all possible message types and their responses.
     */ // eslint-disable-next-line class-methods-use-this
    async sendMessage(type, data) {
        const response = await webextension_polyfill__rspack_import_1_default().runtime.sendMessage({
            handlerName: _common_messages__rspack_import_3/* .APP_MESSAGE_HANDLER_NAME */.zk,
            type,
            data
        });
        return response;
    }
    constructor(){
        _define_property(this, "onMessage", (webextension_polyfill__rspack_import_1_default().runtime.onMessage));
        /**
     * Method subscribes to notifier module events.
     *
     * @param events List of events to which subscribe.
     * @param callback Callback called when event fires.
     * @param onUnloadCallback Callback used to remove listener on unload.
     *
     * @returns Function to remove listener on unload.
     */ _define_property(this, "createEventListener", async (events, callback, onUnloadCallback)=>{
            let listenerId;
            const response = await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CreateEventListener */.Go.CreateEventListener, {
                events
            });
            listenerId = response.listenerId;
            const onUpdateListeners = async ()=>{
                const updatedResponse = await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CreateEventListener */.Go.CreateEventListener, {
                    events
                });
                listenerId = updatedResponse.listenerId;
            };
            const messageHandler = (message)=>{
                if (!(0,_common_messages__rspack_import_3/* .messageHasTypeField */.Et)(message)) {
                    _common_logger__rspack_import_2/* .logger.error */.v.error('[ext.MessengerCommon]: received message in MessengerCommon.createEventListener has no type field:', message);
                    return undefined;
                }
                if (message.type === _common_messages__rspack_import_3/* .MessageType.NotifyListeners */.Go.NotifyListeners) {
                    if (!(0,_common_messages__rspack_import_3/* .messageHasTypeAndDataFields */.oL)(message)) {
                        _common_logger__rspack_import_2/* .logger.error */.v.error('[ext.MessengerCommon]: received message with type MessageType.NotifyListeners has no data:', message);
                        return undefined;
                    }
                    const castedMessage = message;
                    const [type, ...data] = castedMessage.data;
                    if (events.includes(type)) {
                        callback({
                            type,
                            data
                        });
                    }
                }
                if (message.type === _common_messages__rspack_import_3/* .MessageType.UpdateListeners */.Go.UpdateListeners) {
                    onUpdateListeners();
                }
            };
            const onUnload = ()=>{
                if (!listenerId) {
                    return;
                }
                webextension_polyfill__rspack_import_1_default().runtime.onMessage.removeListener(messageHandler);
                window.removeEventListener('beforeunload', onUnload);
                window.removeEventListener('unload', onUnload);
                this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RemoveListener */.Go.RemoveListener, {
                    listenerId
                });
                listenerId = null;
                if (typeof onUnloadCallback === 'function') {
                    onUnloadCallback();
                }
            };
            webextension_polyfill__rspack_import_1_default().runtime.onMessage.addListener(messageHandler);
            window.addEventListener('beforeunload', onUnload);
            window.addEventListener('unload', onUnload);
            return onUnload;
        });
        /**
     * Sends a message from background page to update listeners on the UI.
     *
     * @returns Promise that resolves when the message is sent.
     */ _define_property(this, "updateListeners", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.UpdateListeners */.Go.UpdateListeners);
        });
        /**
     * Sends a message to the background page to get the settings data for
     * the options page with some additional info.
     *
     * @returns Promise that resolves with the settings data for
     * the options page with some additional info.
     */ _define_property(this, "getOptionsData", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetOptionsData */.Go.GetOptionsData);
        });
        /**
     * Sends a message to the background page to change the user setting.
     *
     * @param settingId Setting identifier.
     * @param value Setting value.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "changeUserSetting", async (settingId, value)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ChangeUserSettings */.Go.ChangeUserSettings, {
                key: settingId,
                value
            });
        });
        /**
     * Sends a message to the background page to open the extension store.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openExtensionStore", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenExtensionStore */.Go.OpenExtensionStore);
        });
        /**
     * Sends a message to the background page to open the compare page.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openComparePage", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenComparePage */.Go.OpenComparePage);
        });
        /**
     * Sends a message to the background page to open the Chrome extensions settings page.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openChromeExtensionsPage", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenChromeExtensionsSettingsPage */.Go.OpenChromeExtensionsSettingsPage);
        });
        /**
     * Sends a message to the background page to open the extension details page.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openExtensionDetailsPage", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenExtensionDetailsPage */.Go.OpenExtensionDetailsPage);
        });
        /**
     * Sends a message to the background page to enable a filter by filter id.
     *
     * @param filterId Filter identifier.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "enableFilter", async (filterId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddAndEnableFilter */.Go.AddAndEnableFilter, {
                filterId
            });
        });
        /**
     * Sends a message to the background page to disable a filter by filter id.
     *
     * @param filterId Filter identifier.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "disableFilter", async (filterId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.DisableFilter */.Go.DisableFilter, {
                filterId
            });
        });
        /**
     * Sends a message to the background page to apply settings from a JSON object.
     *
     * @param json JSON object representing the settings to apply.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "applySettingsJson", async (json)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ApplySettingsJson */.Go.ApplySettingsJson, {
                json
            });
        });
        /**
     * Sends a message to the background page to open the filtering log.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openFilteringLog", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenFilteringLog */.Go.OpenFilteringLog);
        });
        /**
     * Sends a message to the background page to reset the blocked ads statistics.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "resetStatistics", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ResetBlockedAdsCount */.Go.ResetBlockedAdsCount);
        });
        /**
     * Sends a message to the background page to set the filtering log window state.
     *
     * @param windowState State of the filtering log window.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "setFilteringLogWindowState", async (windowState)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SetFilteringLogWindowState */.Go.SetFilteringLogWindowState, {
                windowState
            });
        });
        /**
     * Sends a message to the background page to reset the settings.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "resetSettings", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ResetSettings */.Go.ResetSettings);
        });
        /**
     * Sends a message to the background page to get the user rules.
     *
     * @returns Promise that resolves with the user rules.
     */ _define_property(this, "getUserRules", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetUserRules */.Go.GetUserRules);
        });
        /**
     * Sends a message to the background page to save user rules.
     *
     * @param value User rules value to save.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "saveUserRules", async (value)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SaveUserRules */.Go.SaveUserRules, {
                value
            });
        });
        /**
     * Sends a message to the background page to open user rules editor in fullscreen.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openFullscreenUserRules", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenFullscreenUserRules */.Go.OpenFullscreenUserRules);
        });
        /**
     * Sends a message to the background page to get the allowlist domains.
     *
     * @returns Promise that resolves with the list of allowlist domains.
     */ _define_property(this, "getAllowlist", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetAllowlistDomains */.Go.GetAllowlistDomains);
        });
        /**
     * Sends a message to the background page to save the allowlist domains.
     *
     * @param value Allowlist domains value to save.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "saveAllowlist", async (value)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SaveAllowlistDomains */.Go.SaveAllowlistDomains, {
                value
            });
        });
        /**
     * Sends a message to the background page to mark a notification as viewed.
     *
     * @param withDelay Whether the notification should be marked as viewed after a delay.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "setNotificationViewed", async (withDelay)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SetNotificationViewed */.Go.SetNotificationViewed, {
                withDelay
            });
        });
        /**
     * Sends a message to the background page to update the status of a filter group.
     *
     * @param groupId Group identifier.
     * @param enabled Whether the group should be enabled or disabled.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "updateGroupStatus", async (groupId, enabled)=>{
            const type = enabled ? _common_messages__rspack_import_3/* .MessageType.EnableFiltersGroup */.Go.EnableFiltersGroup : _common_messages__rspack_import_3/* .MessageType.DisableFiltersGroup */.Go.DisableFiltersGroup;
            return this.sendMessage(type, {
                groupId
            });
        });
        /**
     * Sends a message to the background page to set consented filters.
     *
     * @param filterIds List of filter identifiers.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "setConsentedFilters", async (filterIds)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SetConsentedFilters */.Go.SetConsentedFilters, {
                filterIds
            });
        });
        /**
     * Sends a message to the background page to check if a filter is consented.
     *
     * @param filterId Filter identifier.
     *
     * @returns Promise that resolves with the result of the check.
     */ _define_property(this, "getIsConsentedFilter", async (filterId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetIsConsentedFilter */.Go.GetIsConsentedFilter, {
                filterId
            });
        });
        /**
     * Sends a message to the background page to check a custom filter URL.
     *
     * @param url Custom filter URL.
     *
     * @returns Promise that resolves with the result of the check.
     */ _define_property(this, "checkCustomUrl", async (url)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.LoadCustomFilterInfo */.Go.LoadCustomFilterInfo, {
                url
            });
        });
        /**
     * Sends a message to the background page to add a custom filter.
     *
     * @param {CustomFilterSubscriptionData} filter Custom filter data.
     *
     * @returns {Promise<CustomFilterMetadata>} Custom filter metadata.
     */ _define_property(this, "addCustomFilter", async (filter)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SubscribeToCustomFilter */.Go.SubscribeToCustomFilter, {
                filter
            });
        });
        /**
     * Sends a message to the background page to remove a custom filter.
     *
     * @param filterId Custom filter ID.
     *
     * @returns Promise that resolves after the filter is removed.
     */ _define_property(this, "removeCustomFilter", async (filterId)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RemoveAntiBannerFilter */.Go.RemoveAntiBannerFilter, {
                filterId
            });
        });
        /**
     * Sends a message to the background page to check if the application is initialized.
     *
     * @returns Promise that resolves to a boolean value:
     * true if the application is initialized, false otherwise.
     */ _define_property(this, "getIsAppInitialized", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetIsAppInitialized */.Go.GetIsAppInitialized);
        });
        /**
     * Sends a message to the background to get the tab info for the popup.
     *
     * @param tabId Tab ID.
     *
     * @returns Promise that resolves with the tab info or undefined.
     */ _define_property(this, "getTabInfoForPopup", async (tabId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetTabInfoForPopup */.Go.GetTabInfoForPopup, {
                tabId
            });
        });
        /**
     * Sends a message to the background page to change application filtering state.
     *
     * @param state Application filtering state.
     *
     * @returns Promise that resolves after the state is changed.
     */ _define_property(this, "changeApplicationFilteringPaused", async (state)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ChangeApplicationFilteringPaused */.Go.ChangeApplicationFilteringPaused, {
                state
            });
        });
        /**
     * Sends a message to the background page to update the theme of the fullscreen user rules.
     *
     * @param theme Theme to set.
     *
     * @returns Promise that resolves after the theme is updated.
     */ _define_property(this, "updateFullscreenUserRulesTheme", async (theme)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.UpdateFullscreenUserRulesTheme */.Go.UpdateFullscreenUserRulesTheme, {
                theme
            });
        });
        /**
     * Sends a message to the background page to open the rules limits tab.
     *
     * @returns Promise that resolves after the tab is opened.
     */ _define_property(this, "openRulesLimitsTab", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenRulesLimitsTab */.Go.OpenRulesLimitsTab);
        });
        /**
     * Sends a message to the background page to open the settings tab.
     *
     * @returns Promise that resolves after the tab is opened.
     */ _define_property(this, "openSettingsTab", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenSettingsTab */.Go.OpenSettingsTab);
        });
        /**
     * Sends a message to the background page to open the assistant.
     *
     * @returns Promise that resolves after the assistant is opened.
     */ _define_property(this, "openAssistant", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenAssistant */.Go.OpenAssistant);
        });
        /**
     * Sends a message to the background page to open the abuse reporting tab for a site.
     *
     * @param url The URL of the site to report abuse for.
     * @param from The source of the request.
     *
     * @returns Promise that resolves after the tab is opened.
     */ _define_property(this, "openAbuseSite", async (url, from)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenAbuseTab */.Go.OpenAbuseTab, {
                url,
                from
            });
        });
        /**
     * Sends a message to the background page to check site security.
     *
     * @param url The URL of the site to check.
     * @param from The source of the request.
     *
     * @returns Promise that resolves with the site security info.
     */ _define_property(this, "checkSiteSecurity", async (url, from)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenSiteReportTab */.Go.OpenSiteReportTab, {
                url,
                from
            });
        });
        /**
     * Sends a message to the background page to reset user rules for a specific page.
     *
     * @param url The URL of the page.
     *
     * @returns Promise that resolves after the user rules are reset.
     */ _define_property(this, "resetUserRulesForPage", async (url)=>{
            const [currentTab] = await webextension_polyfill__rspack_import_1_default().tabs.query({
                active: true,
                currentWindow: true
            });
            if (!(currentTab === null || currentTab === void 0 ? void 0 : currentTab.id)) {
                _common_logger__rspack_import_2/* .logger.warn */.v.warn('[ext.MessengerCommon]: cannot get current tab id');
                return;
            }
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ResetUserRulesForPage */.Go.ResetUserRulesForPage, {
                url,
                tabId: currentTab === null || currentTab === void 0 ? void 0 : currentTab.id
            });
        });
        /**
     * Sends a message to the background page to remove an allowlist domain.
     *
     * @param tabId The ID of the tab.
     * @param tabRefresh Whether the tab should be refreshed.
     *
     * @returns Promise that resolves after the domain is removed.
     */ _define_property(this, "removeAllowlistDomain", async (tabId, tabRefresh)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RemoveAllowlistDomain */.Go.RemoveAllowlistDomain, {
                tabId,
                tabRefresh
            });
        });
        /**
     * Sends a message to the background page to add an allowlist domain for a specific tab.
     *
     * @param tabId The ID of the tab.
     *
     * @returns Promise that resolves after the domain is added.
     */ _define_property(this, "addAllowlistDomainForTabId", async (tabId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddAllowlistDomainForTabId */.Go.AddAllowlistDomainForTabId, {
                tabId
            });
        });
        /**
     * Sends a message to the background page to add an allowlist domain for a specific URL.
     *
     * Please note that after adding an allowlist domain, the tab will not be reloaded,
     * it should be done separately later if needed.
     *
     * @param url The URL of the page.
     *
     * @returns Promise that resolves after the domain is added.
     */ _define_property(this, "addAllowlistDomainForUrl", async (url)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddAllowlistDomainForUrl */.Go.AddAllowlistDomainForUrl, {
                url
            });
        });
        /**
     * Works only in MV2, since MV3 doesn't support filtering log yet.
     *
     * @returns Promise that resolves after the filtering log page is opened.
     */ _define_property(this, "onOpenFilteringLogPage", async ()=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OnOpenFilteringLogPage */.Go.OnOpenFilteringLogPage);
        });
        /**
     * Sends a message to the background page to get filtering log data.
     *
     * @returns Promise that resolves with filtering log data.
     */ _define_property(this, "getFilteringLogData", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetFilteringLogData */.Go.GetFilteringLogData);
        });
        /**
     * Sends a message to the background page to close the filtering log page.
     *
     * @returns Promise that resolves after the page is closed.
     */ _define_property(this, "onCloseFilteringLogPage", async ()=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OnCloseFilteringLogPage */.Go.OnCloseFilteringLogPage);
        });
        /**
     * Sends a message to the background page to get filtering info by tab ID.
     *
     * @param tabId The ID of the tab.
     *
     * @returns Promise that resolves with filtering info about the tab.
     */ _define_property(this, "getFilteringInfoByTabId", async (tabId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetFilteringInfoByTabId */.Go.GetFilteringInfoByTabId, {
                tabId
            });
        });
        /**
     * Sends a message to the background page to synchronize the list of open tabs.
     *
     * @returns Promise that resolves with an array of filtering info about open tabs.
     */ _define_property(this, "synchronizeOpenTabs", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SynchronizeOpenTabs */.Go.SynchronizeOpenTabs);
        });
        /**
     * Sends a message to the background page to clear events by tab ID.
     *
     * @param tabId The ID of the tab.
     * @param ignorePreserveLog Optional flag to ignore the preserve log state.
     *
     * @returns Promise that resolves after the events are cleared.
     */ _define_property(this, "clearEventsByTabId", async (tabId, ignorePreserveLog)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ClearEventsByTabId */.Go.ClearEventsByTabId, {
                tabId,
                ignorePreserveLog
            });
        });
        /**
     * Sends a message to the background page to refresh the current page by tab ID.
     *
     * @param tabId The ID of the tab.
     *
     * @returns Promise that resolves after the page is refreshed.
     */ _define_property(this, "refreshPage", async (tabId)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RefreshPage */.Go.RefreshPage, {
                tabId
            });
        });
        /**
     * Sends a message to the background page to add a user rule.
     *
     * @param ruleText User rule text to be added.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "addUserRule", async (ruleText)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddUserRule */.Go.AddUserRule, {
                ruleText
            });
        });
        /**
     * Sends a message to the background page to remove a user rule.
     *
     * @param ruleText User rule text to be removed.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "removeUserRule", async (ruleText)=>{
            await this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RemoveUserRule */.Go.RemoveUserRule, {
                ruleText
            });
        });
        /**
     * Sends a message to the background page to set the preserve log state.
     *
     * @param state State indicating whether to preserve the log.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "setPreserveLogState", async (state)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SetPreserveLogState */.Go.SetPreserveLogState, {
                state
            });
        });
        /**
     * Sends a message to the background page to get the editor storage content.
     *
     * @returns Promise that resolves with the editor storage content.
     */ _define_property(this, "getEditorStorageContent", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetEditorStorageContent */.Go.GetEditorStorageContent);
        });
        /**
     * Sends a message to the background page to set the editor storage content.
     *
     * @param content Content to be stored in the editor.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "setEditorStorageContent", async (content)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SetEditorStorageContent */.Go.SetEditorStorageContent, {
                content
            });
        });
        /**
     * Sends a message to the background page to get the rules limits counters for MV3.
     *
     * @returns Promise that resolves with the rules limits counters for MV3.
     */ _define_property(this, "getRulesLimitsCounters", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetRulesLimitsCountersMv3 */.Go.GetRulesLimitsCountersMv3);
        });
        /**
     * Sends a message to the background page to check if it is possible to enable a static filter.
     *
     * @param filterId Filter ID to check.
     *
     * @returns Promise that resolves with the result of the static filter check.
     *
     * @throws Error If the filter is not static.
     */ _define_property(this, "canEnableStaticFilter", async (filterId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CanEnableStaticFilterMv3 */.Go.CanEnableStaticFilterMv3, {
                filterId
            });
        });
        /**
     * Sends a message to the background page to check if all dynamic rules for a user rules' group can be enabled.
     *
     * @param groupId Group identifier to check.
     *
     * @returns Promise that resolves with the result of the static group check.
     */ _define_property(this, "canEnableStaticGroup", async (groupId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CanEnableStaticGroupMv3 */.Go.CanEnableStaticGroupMv3, {
                groupId
            });
        });
        /**
     * Sends a message to the background page to get the current static filters limits.
     *
     * @returns Promise that resolves with the current static filters limits.
     */ _define_property(this, "getCurrentLimits", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CurrentLimitsMv3 */.Go.CurrentLimitsMv3);
        });
        /**
     * Sends a message to the background page to check if the request filter is ready.
     *
     * @returns Promise that resolves to a boolean indicating if the request filter is ready.
     */ _define_property(this, "checkRequestFilterReady", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.CheckRequestFilterReady */.Go.CheckRequestFilterReady);
        });
        /**
     * Sends a message to the background page to add a URL to the trusted list.
     *
     * @param url URL to be added to the trusted list.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "addUrlToTrusted", async (url)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddUrlToTrusted */.Go.AddUrlToTrusted, {
                url
            });
        });
        /**
     * Sends a message to the background page to get user rules editor data.
     *
     * @returns Promise that resolves with the user rules editor data.
     */ _define_property(this, "getUserRulesEditorData", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetUserRulesEditorData */.Go.GetUserRulesEditorData);
        });
        /**
     * Sends a message to the background page to restore filters in MV3.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "restoreFiltersMv3", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RestoreFiltersMv3 */.Go.RestoreFiltersMv3);
        });
        /**
     * Sends a message to the background page to clear the rules limits warning in MV3.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "clearRulesLimitsWarningMv3", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.ClearRulesLimitsWarningMv3 */.Go.ClearRulesLimitsWarningMv3);
        });
        /**
     * Sends a message to the background page to get the allowlist domains.
     *
     * @returns Promise that resolves with the allowlist domains.
     */ _define_property(this, "getAllowlistDomains", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.GetAllowlistDomains */.Go.GetAllowlistDomains);
        });
        /**
     * Sends a message to the background page to load the settings JSON.
     *
     * @returns Promise that resolves with the loaded settings JSON.
     */ _define_property(this, "loadSettingsJson", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.LoadSettingsJson */.Go.LoadSettingsJson);
        });
        /**
     * Sends a message to the background page to open the thank you page.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "openThankYouPage", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenThankYouPage */.Go.OpenThankYouPage);
        });
        /**
     * Sends a message to the background page to initialize the frame script.
     *
     * @returns Promise that resolves with the initialization data for the frame script.
     */ _define_property(this, "initializeFrameScript", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.InitializeFrameScript */.Go.InitializeFrameScript);
        });
        /**
     * Sends a message to the background page to initialize the blocking page script.
     *
     * @returns Promise that resolves with the initialization data for the blocking page script.
     */ _define_property(this, "initializeBlockingPageScript", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.InitializeBlockingPageScript */.Go.InitializeBlockingPageScript);
        });
        /**
     * Sends a message to the background page to mark url as trusted and ignore
     * safebrowsing checks for it.
     *
     * @returns Promise that resolves with the initialization data for the frame script.
     */ _define_property(this, "openSafebrowsingTrusted", async (url)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.OpenSafebrowsingTrusted */.Go.OpenSafebrowsingTrusted, {
                url
            });
        });
        /**
     * Sends a message to the background page to send a telemetry page view event.
     *
     * @param screenName Screen name of the page.
     * @param pageId Page ID of the page.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "sendTelemetryPageViewEvent", async (screenName, pageId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SendTelemetryPageViewEvent */.Go.SendTelemetryPageViewEvent, {
                screenName,
                pageId
            });
        });
        /**
     * Sends a message to the background page to send a telemetry custom event.
     *
     * @param screenName Screen name of the page.
     * @param eventName Name of the event.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "sendTelemetryCustomEvent", async (screenName, eventName)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.SendTelemetryCustomEvent */.Go.SendTelemetryCustomEvent, {
                screenName,
                eventName
            });
        });
        /**
     * Adds opened page to telemetry tracking.
     *
     * @returns Promise that resolves with the page ID.
     */ _define_property(this, "addTelemetryOpenedPage", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.AddTelemetryOpenedPage */.Go.AddTelemetryOpenedPage);
        });
        /**
     * Removes opened page from telemetry tracking.
     *
     * @param pageId Page ID to remove.
     *
     * @returns Promise that resolves after the message is sent.
     */ _define_property(this, "removeTelemetryOpenedPage", async (pageId)=>{
            return this.sendMessage(_common_messages__rspack_import_3/* .MessageType.RemoveTelemetryOpenedPage */.Go.RemoveTelemetryOpenedPage, {
                pageId
            });
        });
    }
}
/**
     * Creates long-lived connections between an extension page and the background page.
     *
     * @param page Page name.
     * @param events List of events to which subscribe.
     * @param callback Callback called when event fires.
     *
     * @returns Object with onUnload callback and portId.
     */ _define_property(MessengerCommon, "createLongLivedConnection", (page, events, callback)=>{
    let port;
    let forceDisconnected = false;
    const portId = `${page}_${(0,nanoid__rspack_import_4/* .nanoid */.Ak)()}`;
    const connect = ()=>{
        port = webextension_polyfill__rspack_import_1_default().runtime.connect({
            name: portId
        });
        port.postMessage({
            type: _common_messages__rspack_import_3/* .MessageType.AddLongLivedConnection */.Go.AddLongLivedConnection,
            data: {
                events
            }
        });
        port.onMessage.addListener((message)=>{
            if (!(0,_common_messages__rspack_import_3/* .messageHasTypeField */.Et)(message)) {
                _common_logger__rspack_import_2/* .logger.error */.v.error('[ext.MessengerCommon]: received message in MessengerCommon.createLongLivedConnection has no type field:', message);
                return;
            }
            if (message.type === _common_messages__rspack_import_3/* .MessageType.NotifyListeners */.Go.NotifyListeners) {
                if (!(0,_common_messages__rspack_import_3/* .messageHasTypeAndDataFields */.oL)(message)) {
                    _common_logger__rspack_import_2/* .logger.error */.v.error('[ext.MessengerCommon]: received message with type MessageType.NotifyListeners has no data:', message);
                    return;
                }
                const castedMessage = message;
                const [type, ...data] = castedMessage.data;
                callback({
                    type,
                    data
                });
            }
        });
        port.onDisconnect.addListener(()=>{
            if ((webextension_polyfill__rspack_import_1_default().runtime.lastError)) {
                _common_logger__rspack_import_2/* .logger.error */.v.error('[ext.MessengerCommon]: received error on disconnect:', (webextension_polyfill__rspack_import_1_default().runtime.lastError.message));
            }
            // we try to connect again if the background page was terminated
            if (!forceDisconnected) {
                connect();
            }
        });
    };
    connect();
    const onUnload = ()=>{
        if (port) {
            forceDisconnected = true;
            port.disconnect();
        }
    };
    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('unload', onUnload);
    return {
        onUnload,
        portId
    };
});


},
70579(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  N: () => (messenger)
});
/* import */ var _common_messages__rspack_import_0 = __webpack_require__(8115);
/* import */ var _messenger_common__rspack_import_1 = __webpack_require__(28339);
/**
 * Copyright (c) 2015-2025 Adguard Software Ltd.
 *
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */ function _define_property(obj, key, value) {
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


class Messenger extends _messenger_common__rspack_import_1/* .MessengerCommon */.H {
    constructor(...args){
        super(...args), /**
     * Sends a message to the background page to update filters.
     *
     * @returns Promise that resolves with the list of filters.
     */ _define_property(this, "updateFilters", async ()=>{
            return this.sendMessage(_common_messages__rspack_import_0/* .MessageType.CheckFiltersUpdate */.Go.CheckFiltersUpdate);
        });
    }
}
const messenger = new Messenger();


},
1110(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isCallable = __webpack_require__(83513);
var tryToString = __webpack_require__(38691);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


},
96790(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isPossiblePrototype = __webpack_require__(6545);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


},
35681(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var wellKnownSymbol = __webpack_require__(21735);
var create = __webpack_require__(88156);
var defineProperty = (__webpack_require__(3597)/* .f */.f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


},
55339(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isObject = __webpack_require__(38014);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


},
17909(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toIndexedObject = __webpack_require__(94993);
var toAbsoluteIndex = __webpack_require__(29670);
var lengthOfArrayLike = __webpack_require__(69290);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


},
37402(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var fails = __webpack_require__(63195);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


},
19450(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var aCallable = __webpack_require__(1110);
var toObject = __webpack_require__(76945);
var IndexedObject = __webpack_require__(74187);
var lengthOfArrayLike = __webpack_require__(69290);

var $TypeError = TypeError;

var REDUCE_EMPTY = 'Reduce of empty array with no initial value';

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    aCallable(callbackfn);
    if (length === 0 && argumentsLength < 2) throw new $TypeError(REDUCE_EMPTY);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw new $TypeError(REDUCE_EMPTY);
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


},
84811(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var isArray = __webpack_require__(51076);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


},
70788(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


},
76975(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(59328);
var isCallable = __webpack_require__(83513);
var classofRaw = __webpack_require__(70788);
var wellKnownSymbol = __webpack_require__(21735);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


},
4768(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var hasOwn = __webpack_require__(63477);
var ownKeys = __webpack_require__(99379);
var getOwnPropertyDescriptorModule = __webpack_require__(61959);
var definePropertyModule = __webpack_require__(3597);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


},
88663(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var definePropertyModule = __webpack_require__(3597);
var createPropertyDescriptor = __webpack_require__(34184);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


},
34184(module) {
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


},
55390(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var makeBuiltIn = __webpack_require__(58391);
var defineProperty = __webpack_require__(3597);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


},
59356(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isCallable = __webpack_require__(83513);
var definePropertyModule = __webpack_require__(3597);
var makeBuiltIn = __webpack_require__(58391);
var defineGlobalProperty = __webpack_require__(24157);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


},
24157(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


},
15144(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var fails = __webpack_require__(63195);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


},
14475(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var isObject = __webpack_require__(38014);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


},
68785(module) {
"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


},
28939(module) {
"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


},
41573(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var ENVIRONMENT = __webpack_require__(35803);

module.exports = ENVIRONMENT === 'NODE';


},
57427(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


},
55011(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var userAgent = __webpack_require__(57427);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


},
35803(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* global Bun, Deno -- detection */
var globalThis = __webpack_require__(95516);
var userAgent = __webpack_require__(57427);
var classof = __webpack_require__(70788);

var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};

module.exports = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
})();


},
25109(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


},
46847(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var createNonEnumerableProperty = __webpack_require__(88663);
var clearErrorStack = __webpack_require__(25109);
var ERROR_STACK_INSTALLABLE = __webpack_require__(94279);

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


},
94279(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var fails = __webpack_require__(63195);
var createPropertyDescriptor = __webpack_require__(34184);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


},
3234(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var getOwnPropertyDescriptor = (__webpack_require__(61959)/* .f */.f);
var createNonEnumerableProperty = __webpack_require__(88663);
var defineBuiltIn = __webpack_require__(59356);
var defineGlobalProperty = __webpack_require__(24157);
var copyConstructorProperties = __webpack_require__(4768);
var isForced = __webpack_require__(71072);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


},
63195(module) {
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


},
86237(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var NATIVE_BIND = __webpack_require__(40076);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


},
40076(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var fails = __webpack_require__(63195);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


},
26673(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var NATIVE_BIND = __webpack_require__(40076);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


},
58634(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var hasOwn = __webpack_require__(63477);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


},
65726(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var aCallable = __webpack_require__(1110);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


},
89852(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var NATIVE_BIND = __webpack_require__(40076);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


},
56771(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var isCallable = __webpack_require__(83513);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


},
9386(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var aCallable = __webpack_require__(1110);
var isNullOrUndefined = __webpack_require__(98489);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


},
95516(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


},
63477(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var toObject = __webpack_require__(76945);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


},
10257(module) {
"use strict";

module.exports = {};


},
78473(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var getBuiltIn = __webpack_require__(56771);

module.exports = getBuiltIn('document', 'documentElement');


},
32089(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var fails = __webpack_require__(63195);
var createElement = __webpack_require__(14475);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


},
74187(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var fails = __webpack_require__(63195);
var classof = __webpack_require__(70788);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


},
41627(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isCallable = __webpack_require__(83513);
var isObject = __webpack_require__(38014);
var setPrototypeOf = __webpack_require__(89883);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


},
1974(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var isCallable = __webpack_require__(83513);
var store = __webpack_require__(353);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


},
94716(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isObject = __webpack_require__(38014);
var createNonEnumerableProperty = __webpack_require__(88663);

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


},
11449(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(63546);
var globalThis = __webpack_require__(95516);
var isObject = __webpack_require__(38014);
var createNonEnumerableProperty = __webpack_require__(88663);
var hasOwn = __webpack_require__(63477);
var shared = __webpack_require__(353);
var sharedKey = __webpack_require__(1291);
var hiddenKeys = __webpack_require__(10257);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


},
51076(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var classof = __webpack_require__(70788);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


},
83513(module) {
"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


},
71072(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var fails = __webpack_require__(63195);
var isCallable = __webpack_require__(83513);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


},
98489(module) {
"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


},
38014(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isCallable = __webpack_require__(83513);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


},
6545(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isObject = __webpack_require__(38014);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


},
35919(module) {
"use strict";

module.exports = false;


},
97153(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var getBuiltIn = __webpack_require__(56771);
var isCallable = __webpack_require__(83513);
var isPrototypeOf = __webpack_require__(8229);
var USE_SYMBOL_AS_UID = __webpack_require__(56636);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


},
69290(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toLength = __webpack_require__(76538);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


},
58391(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var fails = __webpack_require__(63195);
var isCallable = __webpack_require__(83513);
var hasOwn = __webpack_require__(63477);
var DESCRIPTORS = __webpack_require__(15144);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(58634)/* .CONFIGURABLE */.CONFIGURABLE);
var inspectSource = __webpack_require__(1974);
var InternalStateModule = __webpack_require__(11449);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


},
85705(module) {
"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


},
57943(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toString = __webpack_require__(19419);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


},
88156(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(55339);
var definePropertiesModule = __webpack_require__(77557);
var enumBugKeys = __webpack_require__(28939);
var hiddenKeys = __webpack_require__(10257);
var html = __webpack_require__(78473);
var documentCreateElement = __webpack_require__(14475);
var sharedKey = __webpack_require__(1291);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


},
77557(__unused_webpack_module, exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(64746);
var definePropertyModule = __webpack_require__(3597);
var anObject = __webpack_require__(55339);
var toIndexedObject = __webpack_require__(94993);
var objectKeys = __webpack_require__(22740);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


},
3597(__unused_webpack_module, exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var IE8_DOM_DEFINE = __webpack_require__(32089);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(64746);
var anObject = __webpack_require__(55339);
var toPropertyKey = __webpack_require__(90869);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


},
61959(__unused_webpack_module, exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var call = __webpack_require__(26673);
var propertyIsEnumerableModule = __webpack_require__(24049);
var createPropertyDescriptor = __webpack_require__(34184);
var toIndexedObject = __webpack_require__(94993);
var toPropertyKey = __webpack_require__(90869);
var hasOwn = __webpack_require__(63477);
var IE8_DOM_DEFINE = __webpack_require__(32089);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


},
32516(__unused_webpack_module, exports, __webpack_require__) {
"use strict";

var internalObjectKeys = __webpack_require__(64048);
var enumBugKeys = __webpack_require__(28939);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


},
33593(__unused_webpack_module, exports) {
"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


},
8229(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);

module.exports = uncurryThis({}.isPrototypeOf);


},
64048(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);
var hasOwn = __webpack_require__(63477);
var toIndexedObject = __webpack_require__(94993);
var indexOf = (__webpack_require__(17909)/* .indexOf */.indexOf);
var hiddenKeys = __webpack_require__(10257);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


},
22740(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var internalObjectKeys = __webpack_require__(64048);
var enumBugKeys = __webpack_require__(28939);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


},
24049(__unused_webpack_module, exports) {
"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


},
89883(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(65726);
var isObject = __webpack_require__(38014);
var requireObjectCoercible = __webpack_require__(47930);
var aPossiblePrototype = __webpack_require__(96790);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


},
45570(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var call = __webpack_require__(26673);
var isCallable = __webpack_require__(83513);
var isObject = __webpack_require__(38014);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


},
99379(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var getBuiltIn = __webpack_require__(56771);
var uncurryThis = __webpack_require__(89852);
var getOwnPropertyNamesModule = __webpack_require__(32516);
var getOwnPropertySymbolsModule = __webpack_require__(33593);
var anObject = __webpack_require__(55339);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


},
29268(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var defineProperty = (__webpack_require__(3597)/* .f */.f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


},
47930(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var isNullOrUndefined = __webpack_require__(98489);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


},
1291(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var shared = __webpack_require__(39877);
var uid = __webpack_require__(92172);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


},
353(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var IS_PURE = __webpack_require__(35919);
var globalThis = __webpack_require__(95516);
var defineGlobalProperty = __webpack_require__(24157);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.40.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


},
39877(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var store = __webpack_require__(353);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


},
28515(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(55011);
var fails = __webpack_require__(63195);
var globalThis = __webpack_require__(95516);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


},
29670(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toIntegerOrInfinity = __webpack_require__(59047);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


},
94993(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(74187);
var requireObjectCoercible = __webpack_require__(47930);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


},
59047(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var trunc = __webpack_require__(85705);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


},
76538(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toIntegerOrInfinity = __webpack_require__(59047);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


},
76945(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var requireObjectCoercible = __webpack_require__(47930);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


},
16037(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var call = __webpack_require__(26673);
var isObject = __webpack_require__(38014);
var isSymbol = __webpack_require__(97153);
var getMethod = __webpack_require__(9386);
var ordinaryToPrimitive = __webpack_require__(45570);
var wellKnownSymbol = __webpack_require__(21735);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


},
90869(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var toPrimitive = __webpack_require__(16037);
var isSymbol = __webpack_require__(97153);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


},
59328(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var wellKnownSymbol = __webpack_require__(21735);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


},
19419(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var classof = __webpack_require__(76975);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


},
38691(module) {
"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


},
92172(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var uncurryThis = __webpack_require__(89852);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


},
56636(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(28515);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


},
64746(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var fails = __webpack_require__(63195);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


},
8888(module) {
"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


},
63546(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var isCallable = __webpack_require__(83513);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


},
21735(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var globalThis = __webpack_require__(95516);
var shared = __webpack_require__(39877);
var hasOwn = __webpack_require__(63477);
var uid = __webpack_require__(92172);
var NATIVE_SYMBOL = __webpack_require__(28515);
var USE_SYMBOL_AS_UID = __webpack_require__(56636);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


},
58733(module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var getBuiltIn = __webpack_require__(56771);
var hasOwn = __webpack_require__(63477);
var createNonEnumerableProperty = __webpack_require__(88663);
var isPrototypeOf = __webpack_require__(8229);
var setPrototypeOf = __webpack_require__(89883);
var copyConstructorProperties = __webpack_require__(4768);
var proxyAccessor = __webpack_require__(29268);
var inheritIfRequired = __webpack_require__(41627);
var normalizeStringArgument = __webpack_require__(57943);
var installErrorCause = __webpack_require__(94716);
var installErrorStack = __webpack_require__(46847);
var DESCRIPTORS = __webpack_require__(15144);
var IS_PURE = __webpack_require__(35919);

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    installErrorStack(result, WrappedError, result.stack, 2);
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


},
45403(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var $ = __webpack_require__(3234);
var $includes = (__webpack_require__(17909)/* .includes */.includes);
var fails = __webpack_require__(63195);
var addToUnscopables = __webpack_require__(35681);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


},
75126(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var $ = __webpack_require__(3234);
var toObject = __webpack_require__(76945);
var lengthOfArrayLike = __webpack_require__(69290);
var setArrayLength = __webpack_require__(84811);
var doesNotExceedSafeInteger = __webpack_require__(68785);
var fails = __webpack_require__(63195);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


},
80852(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var $ = __webpack_require__(3234);
var $reduce = (__webpack_require__(19450)/* .left */.left);
var arrayMethodIsStrict = __webpack_require__(37402);
var CHROME_VERSION = __webpack_require__(55011);
var IS_NODE = __webpack_require__(41573);

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: FORCED }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


},
38796(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(3234);
var globalThis = __webpack_require__(95516);
var apply = __webpack_require__(86237);
var wrapErrorConstructorWithCause = __webpack_require__(58733);

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = globalThis[WEB_ASSEMBLY];

// eslint-disable-next-line es/no-error-cause -- feature detection
var FORCED = new Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://tc39.es/ecma262/#sec-nativeerror
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


},
73175(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var $ = __webpack_require__(3234);
var globalThis = __webpack_require__(95516);
var defineBuiltInAccessor = __webpack_require__(55390);
var DESCRIPTORS = __webpack_require__(15144);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var INCORRECT_VALUE = globalThis.self !== globalThis;

// `self` getter
// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
try {
  if (DESCRIPTORS) {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var descriptor = Object.getOwnPropertyDescriptor(globalThis, 'self');
    // some engines have `self`, but with incorrect descriptor
    // https://github.com/denoland/deno/issues/15765
    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
      defineBuiltInAccessor(globalThis, 'self', {
        get: function self() {
          return globalThis;
        },
        set: function self(value) {
          if (this !== globalThis) throw new $TypeError('Illegal invocation');
          defineProperty(globalThis, 'self', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
          });
        },
        configurable: true,
        enumerable: true
      });
    }
  } else $({ global: true, simple: true, forced: INCORRECT_VALUE }, {
    self: globalThis
  });
} catch (error) { /* empty */ }


},
70279(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var defineBuiltIn = __webpack_require__(59356);
var uncurryThis = __webpack_require__(89852);
var toString = __webpack_require__(19419);
var validateArgumentsLength = __webpack_require__(8888);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var append = uncurryThis(URLSearchParamsPrototype.append);
var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
var push = uncurryThis([].push);
var params = new $URLSearchParams('a=1&a=2&b=3');

params['delete']('a', 1);
// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
params['delete']('b', undefined);

if (params + '' !== 'a=2') {
  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $delete(this, name);
    var entries = [];
    forEach(this, function (v, k) { // also validates `this`
      push(entries, { key: k, value: v });
    });
    validateArgumentsLength(length, 1);
    var key = toString(name);
    var value = toString($value);
    var index = 0;
    var dindex = 0;
    var found = false;
    var entriesLength = entries.length;
    var entry;
    while (index < entriesLength) {
      entry = entries[index++];
      if (found || entry.key === key) {
        found = true;
        $delete(this, entry.key);
      } else dindex++;
    }
    while (dindex < entriesLength) {
      entry = entries[dindex++];
      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
    }
  }, { enumerable: true, unsafe: true });
}


},
16786(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var defineBuiltIn = __webpack_require__(59356);
var uncurryThis = __webpack_require__(89852);
var toString = __webpack_require__(19419);
var validateArgumentsLength = __webpack_require__(8888);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
var $has = uncurryThis(URLSearchParamsPrototype.has);
var params = new $URLSearchParams('a=1');

// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
if (params.has('a', 2) || !params.has('a', undefined)) {
  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $has(this, name);
    var values = getAll(this, name); // also validates `this`
    validateArgumentsLength(length, 1);
    var value = toString($value);
    var index = 0;
    while (index < values.length) {
      if (values[index++] === value) return true;
    } return false;
  }, { enumerable: true, unsafe: true });
}


},
77269(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
"use strict";

var DESCRIPTORS = __webpack_require__(15144);
var uncurryThis = __webpack_require__(89852);
var defineBuiltInAccessor = __webpack_require__(55390);

var URLSearchParamsPrototype = URLSearchParams.prototype;
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
    get: function size() {
      var count = 0;
      forEach(this, function () { count++; });
      return count;
    },
    configurable: true,
    enumerable: true
  });
}


},
44469(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $b: () => (LogLevel),
  Vy: () => (Logger),
  u1: () => (getErrorMessage)
});
/**
 * Checks if error has message.
 *
 * @param error Error object.
 *
 * @returns True if error has message.
 */
function isErrorWithMessage(error) {
    return (typeof error === 'object'
        && error !== null
        && 'message' in error
        && typeof error.message === 'string');
}
/**
 * Converts error to the error with a message.
 *
 * @param maybeError Possible error.
 *
 * @returns Error with a message.
 */
function toErrorWithMessage(maybeError) {
    if (isErrorWithMessage(maybeError)) {
        return maybeError;
    }
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references, for example.
        return new Error(String(maybeError));
    }
}
/**
 * Converts an error object to an error with a message. This method might be helpful to handle thrown errors.
 *
 * @param error Error object.
 *
 * @returns Message of the error.
 */
function getErrorMessage(error) {
    return toErrorWithMessage(error).message;
}

/**
 * Pads a number with leading zeros.
 *
 * @param num The number to pad.
 * @param size The number of digits to pad to.
 *
 * @returns The padded number.
 */
const pad = (num, size = 2) => {
    return num.toString().padStart(size, '0');
};
/**
 * Formats a date into an ISO 8601-like string with milliseconds.
 *
 * @param {Date|number} date The date object or timestamp to format.
 *
 * @returns {string} The formatted date string.
 */
const formatTime = (date) => {
    const d = (date instanceof Date) ? date : new Date(date);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1); // Months are 0-based
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    const second = pad(d.getSeconds());
    const millisecond = pad(d.getMilliseconds(), 3); // Milliseconds are 3 digits
    return `${year}-${month}-${day}T${hour}:${minute}:${second}:${millisecond}`;
};

/**
 * String presentation of log levels, for convenient users usage.
 * Ordered in the same way as LogLevelNumeric.
 *
 * First three levels will be shown to users, and the last two are for developers.
 */
var LogLevel;
(function (LogLevel) {
    /**
     * For errors.
     */
    LogLevel["Error"] = "error";
    /**
     * For not critical errors.
     */
    LogLevel["Warn"] = "warn";
    /**
     * For important information.
     * Use for general operational messages.
     */
    LogLevel["Info"] = "info";
    /**
     * For debugging purposes, e.g. Inside conditions, loops or some edge cases.
     */
    LogLevel["Debug"] = "debug";
    /**
     * For ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     */
    LogLevel["Verbose"] = "verbose";
})(LogLevel || (LogLevel = {}));
/**
 * Log levels map, which maps number level to string level.
 * Ordered in the same way as LogLevelNumeric.
 */
const levelMapNumToString = {
    [1 /* LogLevelNumeric.Error */]: LogLevel.Error,
    [2 /* LogLevelNumeric.Warn */]: LogLevel.Warn,
    [3 /* LogLevelNumeric.Info */]: LogLevel.Info,
    [4 /* LogLevelNumeric.Debug */]: LogLevel.Debug,
    [5 /* LogLevelNumeric.Verbose */]: LogLevel.Verbose,
};
/**
 * Log levels map, which maps string level to number level.
 */
const levelMapStringToNum = Object.entries(levelMapNumToString)
    .reduce((acc, [key, value]) => {
    // Here, key is originally a string since Object.entries() returns [string, string][].
    // We need to cast the key to LogLevelNumeric correctly without causing type mismatches.
    const numericKey = Number(key);
    if (!Number.isNaN(numericKey)) {
        acc[value] = numericKey;
    }
    return acc;
}, {});
/**
 * Methods supported by console. Used to manage levels.
 * Ordered in the same way as LogLevelNumeric.
 */
var LogMethod;
(function (LogMethod) {
    LogMethod["Error"] = "error";
    LogMethod["Warn"] = "warn";
    LogMethod["Info"] = "info";
    LogMethod["Debug"] = "debug";
    LogMethod["Trace"] = "trace";
})(LogMethod || (LogMethod = {}));
/**
 * Simple logger with log levels.
 */
class Logger {
    currentLevelValue = 3 /* LogLevelNumeric.Info */;
    writer;
    /**
     * Constructor.
     *
     * @param writer Writer object.
     */
    constructor(writer = console) {
        this.writer = writer;
        // bind the logging methods to avoid losing context
        this.error = this.error.bind(this);
        this.warn = this.warn.bind(this);
        this.info = this.info.bind(this);
        this.debug = this.debug.bind(this);
        this.trace = this.trace.bind(this);
    }
    /**
     * Print error messages.
     * Use when something went wrong.
     *
     * @param args Printed arguments.
     */
    error(...args) {
        this.print(1 /* LogLevelNumeric.Error */, LogMethod.Error, args);
    }
    /**
     * Print warn messages.
     * Use when Something might go wrong.
     *
     * @param args Printed arguments.
     */
    warn(...args) {
        this.print(2 /* LogLevelNumeric.Warn */, LogMethod.Warn, args);
    }
    /**
     * Print messages you want to disclose to users.
     * Use for general operational messages.
     *
     * @param args Printed arguments.
     */
    info(...args) {
        this.print(3 /* LogLevelNumeric.Info */, LogMethod.Info, args);
    }
    /**
     * Print debug messages. Usually used for technical information.
     *
     * @param args Printed arguments.
     */
    debug(...args) {
        this.print(4 /* LogLevelNumeric.Debug */, LogMethod.Debug, args);
    }
    /**
     * Print trace messages.
     * Ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     *
     * @param args Printed arguments.
     */
    trace(...args) {
        this.print(5 /* LogLevelNumeric.Verbose */, LogMethod.Trace, args);
    }
    /**
     * Getter for log level.
     *
     * @returns Logger level.
     */
    get currentLevel() {
        return levelMapNumToString[this.currentLevelValue];
    }
    /**
     * Setter for log level. With this method log level can be updated dynamically.
     *
     * @param logLevel Logger level.
     *
     * @throws Error if log level is not supported.
     */
    set currentLevel(logLevel) {
        const level = levelMapStringToNum[logLevel];
        if (level === undefined) {
            throw new Error(`Logger supports only the following levels: ${[Object.values(LogLevel).join(', ')]}`);
        }
        this.currentLevelValue = level;
    }
    /**
     * Converts error to string, and adds stack trace.
     *
     * @param error Error to print.
     *
     * @returns Error message.
     */
    static errorToString(error) {
        const message = getErrorMessage(error);
        return `${message}\nStack trace:\n${error.stack}`;
    }
    /**
     * Prints error message with stack trace.
     * It prints the message with the stack trace in a collapsed group.
     * This is useful for debugging purposes, as it allows to see the stack trace
     * without cluttering the console with too many messages.
     *
     * @param formattedTime Formatted time.
     * @param formattedArgs Formatted arguments.
     */
    printWithStackTrace(formattedTime, formattedArgs) {
        // If grouping is not supported, print just expanded trace, but this
        // leads to a lot of dirty logs in the console, since the stack trace
        // will be printed for every message.
        if (!this.writer.groupCollapsed || !this.writer.groupEnd) {
            // Print expanded trace
            this.writer.trace(formattedTime, ...formattedArgs);
            return;
        }
        // Print collapsed trace to make logs more readable and access to stack
        // trace by clicking on the group.
        this.writer.groupCollapsed(formattedTime, ...formattedArgs);
        this.writer.trace();
        this.writer.groupEnd();
    }
    /**
     * Wrapper over log methods.
     *
     * @param level Logger level.
     * @param method Logger method.
     * @param args Printed arguments.
     */
    print(level, method, args) {
        // Skip writing if the basic conditions are not met.
        if (this.currentLevelValue < level) {
            return;
        }
        // Do not print if no arguments are passed.
        if (!args || args.length === 0 || !args[0]) {
            return;
        }
        const formattedArgs = args.map((value) => {
            if (value instanceof Error) {
                return Logger.errorToString(value);
            }
            if (value && typeof value.message === 'string') {
                return value.message;
            }
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            }
            return String(value);
        });
        const formattedTime = `${formatTime(new Date())}:`;
        /**
         * If current log level is Debug or Verbose, print all channels with stack
         * trace via using writer.trace method to help identify the location of the
         * log.
         *
         * Exception is Error method, because it is already contains build-in
         * stack trace.
         */
        if (this.currentLevelValue >= levelMapStringToNum[LogLevel.Debug]
            && method !== LogMethod.Error) {
            this.printWithStackTrace(formattedTime, formattedArgs);
            return;
        }
        // Otherwise just print with requested method of writer.
        this.writer[method](formattedTime, ...formattedArgs);
    }
}




},
46663(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  C: () => (copy)
});
/* import */ var is_what__rspack_import_0 = __webpack_require__(83919);


function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if ((0,is_what__rspack_import_0/* .isArray */.cy)(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!(0,is_what__rspack_import_0/* .isPlainObject */.Qd)(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if ((0,is_what__rspack_import_0/* .isArray */.cy)(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}




},
93051(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  MR: () => (deleteDB),
  P2: () => (openDB)
});
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const transactionDoneMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    // This mapping exists in reverseTransformCache but doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(this.request);
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return wrap(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get(target, prop) {
        if (!advanceMethodProps.includes(prop))
            return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function (...args) {
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    },
};
async function* iterate(...args) {
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
        return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return ((prop === Symbol.asyncIterator &&
        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
        if (isIteratorProp(target, prop))
            return iterate;
        return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
        return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    },
}));




},
83919(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Qd: () => (isPlainObject),
  cy: () => (isArray)
});
function getType(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}

function isAnyObject(payload) {
  return getType(payload) === "Object";
}

function isArray(payload) {
  return getType(payload) === "Array";
}

function isBlob(payload) {
  return getType(payload) === "Blob";
}

function isBoolean(payload) {
  return getType(payload) === "Boolean";
}

function isDate(payload) {
  return getType(payload) === "Date" && !isNaN(payload);
}

function isEmptyArray(payload) {
  return isArray(payload) && payload.length === 0;
}

function isPlainObject(payload) {
  if (getType(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}

function isEmptyObject(payload) {
  return isPlainObject(payload) && Object.keys(payload).length === 0;
}

function isEmptyString(payload) {
  return payload === "";
}

function isError(payload) {
  return getType(payload) === "Error" || payload instanceof Error;
}

function isFile(payload) {
  return getType(payload) === "File";
}

function isFullArray(payload) {
  return isArray(payload) && payload.length > 0;
}

function isFullObject(payload) {
  return isPlainObject(payload) && Object.keys(payload).length > 0;
}

function isString(payload) {
  return getType(payload) === "String";
}

function isFullString(payload) {
  return isString(payload) && payload !== "";
}

function isFunction(payload) {
  return typeof payload === "function";
}

function isType(payload, type) {
  if (!(type instanceof Function)) {
    throw new TypeError("Type must be a function");
  }
  if (!Object.prototype.hasOwnProperty.call(type, "prototype")) {
    throw new TypeError("Type is not a class");
  }
  const name = type.name;
  return getType(payload) === name || Boolean(payload && payload.constructor === type);
}

function isInstanceOf(value, classOrClassName) {
  if (typeof classOrClassName === "function") {
    for (let p = value; p; p = Object.getPrototypeOf(p)) {
      if (isType(p, classOrClassName)) {
        return true;
      }
    }
    return false;
  } else {
    for (let p = value; p; p = Object.getPrototypeOf(p)) {
      if (getType(p) === classOrClassName) {
        return true;
      }
    }
    return false;
  }
}

function isMap(payload) {
  return getType(payload) === "Map";
}

function isNaNValue(payload) {
  return getType(payload) === "Number" && isNaN(payload);
}

function isNumber(payload) {
  return getType(payload) === "Number" && !isNaN(payload);
}

function isNegativeNumber(payload) {
  return isNumber(payload) && payload < 0;
}

function isNull(payload) {
  return getType(payload) === "Null";
}

function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}

function isUndefined(payload) {
  return getType(payload) === "Undefined";
}

const isNullOrUndefined = isOneOf(isNull, isUndefined);

function isObject(payload) {
  return isPlainObject(payload);
}

function isObjectLike(payload) {
  return isAnyObject(payload);
}

function isPositiveNumber(payload) {
  return isNumber(payload) && payload > 0;
}

function isSymbol(payload) {
  return getType(payload) === "Symbol";
}

function isPrimitive(payload) {
  return isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
}

function isPromise(payload) {
  return getType(payload) === "Promise";
}

function isRegExp(payload) {
  return getType(payload) === "RegExp";
}

function isSet(payload) {
  return getType(payload) === "Set";
}

function isWeakMap(payload) {
  return getType(payload) === "WeakMap";
}

function isWeakSet(payload) {
  return getType(payload) === "WeakSet";
}




},
6500(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Ak: () => (nanoid),
  d_: () => (customAlphabet)
});

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')



},
33978(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  b: () => (getDeep),
  v: () => (setDeep)
});
/* import */ var _is_js__rspack_import_1 = __webpack_require__(23962);
/* import */ var _util_js__rspack_import_0 = __webpack_require__(73430);


const getNthKey = (value, n) => {
    const keys = value.keys();
    while (n > 0) {
        keys.next();
        n--;
    }
    return keys.next().value;
};
function validatePath(path) {
    if ((0,_util_js__rspack_import_0/* .includes */.mK)(path, '__proto__')) {
        throw new Error('__proto__ is not allowed as a property');
    }
    if ((0,_util_js__rspack_import_0/* .includes */.mK)(path, 'prototype')) {
        throw new Error('prototype is not allowed as a property');
    }
    if ((0,_util_js__rspack_import_0/* .includes */.mK)(path, 'constructor')) {
        throw new Error('constructor is not allowed as a property');
    }
}
const getDeep = (object, path) => {
    validatePath(path);
    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if ((0,_is_js__rspack_import_1/* .isSet */.vM)(object)) {
            object = getNthKey(object, +key);
        }
        else if ((0,_is_js__rspack_import_1/* .isMap */.jh)(object)) {
            const row = +key;
            const type = +path[++i] === 0 ? 'key' : 'value';
            const keyOfRow = getNthKey(object, row);
            switch (type) {
                case 'key':
                    object = keyOfRow;
                    break;
                case 'value':
                    object = object.get(keyOfRow);
                    break;
            }
        }
        else {
            object = object[key];
        }
    }
    return object;
};
const setDeep = (object, path, mapper) => {
    validatePath(path);
    if (path.length === 0) {
        return mapper(object);
    }
    let parent = object;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if ((0,_is_js__rspack_import_1/* .isArray */.cy)(parent)) {
            const index = +key;
            parent = parent[index];
        }
        else if ((0,_is_js__rspack_import_1/* .isPlainObject */.Qd)(parent)) {
            parent = parent[key];
        }
        else if ((0,_is_js__rspack_import_1/* .isSet */.vM)(parent)) {
            const row = +key;
            parent = getNthKey(parent, row);
        }
        else if ((0,_is_js__rspack_import_1/* .isMap */.jh)(parent)) {
            const isEnd = i === path.length - 2;
            if (isEnd) {
                break;
            }
            const row = +key;
            const type = +path[++i] === 0 ? 'key' : 'value';
            const keyOfRow = getNthKey(parent, row);
            switch (type) {
                case 'key':
                    parent = keyOfRow;
                    break;
                case 'value':
                    parent = parent.get(keyOfRow);
                    break;
            }
        }
    }
    const lastKey = path[path.length - 1];
    if ((0,_is_js__rspack_import_1/* .isArray */.cy)(parent)) {
        parent[+lastKey] = mapper(parent[+lastKey]);
    }
    else if ((0,_is_js__rspack_import_1/* .isPlainObject */.Qd)(parent)) {
        parent[lastKey] = mapper(parent[lastKey]);
    }
    if ((0,_is_js__rspack_import_1/* .isSet */.vM)(parent)) {
        const oldValue = getNthKey(parent, +lastKey);
        const newValue = mapper(oldValue);
        if (oldValue !== newValue) {
            parent.delete(oldValue);
            parent.add(newValue);
        }
    }
    if ((0,_is_js__rspack_import_1/* .isMap */.jh)(parent)) {
        const row = +path[path.length - 2];
        const keyToRow = getNthKey(parent, row);
        const type = +lastKey === 0 ? 'key' : 'value';
        switch (type) {
            case 'key': {
                const newKey = mapper(keyToRow);
                parent.set(newKey, parent.get(keyToRow));
                if (newKey !== keyToRow) {
                    parent.delete(keyToRow);
                }
                break;
            }
            case 'value': {
                parent.set(keyToRow, mapper(parent.get(keyToRow)));
                break;
            }
        }
    }
    return object;
};


},
43402(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  _: () => (ClassRegistry)
});
/* import */ var _registry_js__rspack_import_0 = __webpack_require__(62477);

class ClassRegistry extends _registry_js__rspack_import_0/* .Registry */.O {
    constructor() {
        super(c => c.name);
        this.classToAllowedProps = new Map();
    }
    register(value, options) {
        if (typeof options === 'object') {
            if (options.allowProps) {
                this.classToAllowedProps.set(value, options.allowProps);
            }
            super.register(value, options.identifier);
        }
        else {
            super.register(value, options);
        }
    }
    getAllowedProps(value) {
        return this.classToAllowedProps.get(value);
    }
}


},
97847(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  u: () => (CustomTransformerRegistry)
});
/* import */ var _util_js__rspack_import_0 = __webpack_require__(73430);

class CustomTransformerRegistry {
    constructor() {
        this.transfomers = {};
    }
    register(transformer) {
        this.transfomers[transformer.name] = transformer;
    }
    findApplicable(v) {
        return (0,_util_js__rspack_import_0/* .find */.I6)(this.transfomers, transformer => transformer.isApplicable(v));
    }
    findByName(name) {
        return this.transfomers[name];
    }
}


},
75041(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Q: () => (DoubleIndexedKV)
});
class DoubleIndexedKV {
    constructor() {
        this.keyToValue = new Map();
        this.valueToKey = new Map();
    }
    set(key, value) {
        this.keyToValue.set(key, value);
        this.valueToKey.set(value, key);
    }
    getByKey(key) {
        return this.keyToValue.get(key);
    }
    getByValue(value) {
        return this.valueToKey.get(value);
    }
    clear() {
        this.keyToValue.clear();
        this.valueToKey.clear();
    }
}


},
49812(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  mb: () => (SuperJSON)
});
/* import */ var _class_registry_js__rspack_import_0 = __webpack_require__(43402);
/* import */ var _registry_js__rspack_import_2 = __webpack_require__(62477);
/* import */ var _custom_transformer_registry_js__rspack_import_3 = __webpack_require__(97847);
/* import */ var _plainer_js__rspack_import_1 = __webpack_require__(13911);
/* import */ var copy_anything__rspack_import_4 = __webpack_require__(46663);





class SuperJSON {
    /**
     * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
     */
    constructor({ dedupe = false, } = {}) {
        this.classRegistry = new _class_registry_js__rspack_import_0/* .ClassRegistry */._();
        this.symbolRegistry = new _registry_js__rspack_import_2/* .Registry */.O(s => s.description ?? '');
        this.customTransformerRegistry = new _custom_transformer_registry_js__rspack_import_3/* .CustomTransformerRegistry */.u();
        this.allowedErrorProps = [];
        this.dedupe = dedupe;
    }
    serialize(object) {
        const identities = new Map();
        const output = (0,_plainer_js__rspack_import_1/* .walker */.jc)(object, identities, this, this.dedupe);
        const res = {
            json: output.transformedValue,
        };
        if (output.annotations) {
            res.meta = {
                ...res.meta,
                values: output.annotations,
            };
        }
        const equalityAnnotations = (0,_plainer_js__rspack_import_1/* .generateReferentialEqualityAnnotations */.b$)(identities, this.dedupe);
        if (equalityAnnotations) {
            res.meta = {
                ...res.meta,
                referentialEqualities: equalityAnnotations,
            };
        }
        return res;
    }
    deserialize(payload) {
        const { json, meta } = payload;
        let result = (0,copy_anything__rspack_import_4/* .copy */.C)(json);
        if (meta?.values) {
            result = (0,_plainer_js__rspack_import_1/* .applyValueAnnotations */.m7)(result, meta.values, this);
        }
        if (meta?.referentialEqualities) {
            result = (0,_plainer_js__rspack_import_1/* .applyReferentialEqualityAnnotations */.Kc)(result, meta.referentialEqualities);
        }
        return result;
    }
    stringify(object) {
        return JSON.stringify(this.serialize(object));
    }
    parse(string) {
        return this.deserialize(JSON.parse(string));
    }
    registerClass(v, options) {
        this.classRegistry.register(v, options);
    }
    registerSymbol(v, identifier) {
        this.symbolRegistry.register(v, identifier);
    }
    registerCustom(transformer, name) {
        this.customTransformerRegistry.register({
            name,
            ...transformer,
        });
    }
    allowErrorProps(...props) {
        this.allowedErrorProps.push(...props);
    }
}
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);

const serialize = SuperJSON.serialize;
const deserialize = SuperJSON.deserialize;
const stringify = SuperJSON.stringify;
const parse = SuperJSON.parse;
const registerClass = SuperJSON.registerClass;
const registerCustom = SuperJSON.registerCustom;
const registerSymbol = SuperJSON.registerSymbol;
const allowErrorProps = SuperJSON.allowErrorProps;


},
23962(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  $P: () => (isDate),
  Bm: () => (isSymbol),
  Dh: () => (isInfinite),
  OH: () => (isBigint),
  Qd: () => (isPlainObject),
  RI: () => (isEmptyObject),
  XS: () => (isNaNValue),
  b0: () => (isUndefined),
  bJ: () => (isError),
  cy: () => (isArray),
  gd: () => (isRegExp),
  iu: () => (isTypedArray),
  jh: () => (isMap),
  mv: () => (isURL),
  sO: () => (isPrimitive),
  vM: () => (isSet)
});
const getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
const isUndefined = (payload) => typeof payload === 'undefined';
const isNull = (payload) => payload === null;
const isPlainObject = (payload) => {
    if (typeof payload !== 'object' || payload === null)
        return false;
    if (payload === Object.prototype)
        return false;
    if (Object.getPrototypeOf(payload) === null)
        return true;
    return Object.getPrototypeOf(payload) === Object.prototype;
};
const isEmptyObject = (payload) => isPlainObject(payload) && Object.keys(payload).length === 0;
const isArray = (payload) => Array.isArray(payload);
const isString = (payload) => typeof payload === 'string';
const isNumber = (payload) => typeof payload === 'number' && !isNaN(payload);
const isBoolean = (payload) => typeof payload === 'boolean';
const isRegExp = (payload) => payload instanceof RegExp;
const isMap = (payload) => payload instanceof Map;
const isSet = (payload) => payload instanceof Set;
const isSymbol = (payload) => getType(payload) === 'Symbol';
const isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
const isError = (payload) => payload instanceof Error;
const isNaNValue = (payload) => typeof payload === 'number' && isNaN(payload);
const isPrimitive = (payload) => isBoolean(payload) ||
    isNull(payload) ||
    isUndefined(payload) ||
    isNumber(payload) ||
    isString(payload) ||
    isSymbol(payload);
const isBigint = (payload) => typeof payload === 'bigint';
const isInfinite = (payload) => payload === Infinity || payload === -Infinity;
const isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
const isURL = (payload) => payload instanceof URL;


},
81223(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  FU: () => (stringifyPath),
  Rr: () => (parsePath),
  jv: () => (escapeKey)
});
const escapeKey = (key) => key.replace(/\./g, '\\.');
const stringifyPath = (path) => path
    .map(String)
    .map(escapeKey)
    .join('.');
const parsePath = (string) => {
    const result = [];
    let segment = '';
    for (let i = 0; i < string.length; i++) {
        let char = string.charAt(i);
        const isEscapedDot = char === '\\' && string.charAt(i + 1) === '.';
        if (isEscapedDot) {
            segment += '.';
            i++;
            continue;
        }
        const isEndOfSegment = char === '.';
        if (isEndOfSegment) {
            result.push(segment);
            segment = '';
            continue;
        }
        segment += char;
    }
    const lastSegment = segment;
    result.push(lastSegment);
    return result;
};


},
13911(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Kc: () => (applyReferentialEqualityAnnotations),
  b$: () => (generateReferentialEqualityAnnotations),
  jc: () => (walker),
  m7: () => (applyValueAnnotations)
});
/* import */ var _is_js__rspack_import_1 = __webpack_require__(23962);
/* import */ var _pathstringifier_js__rspack_import_3 = __webpack_require__(81223);
/* import */ var _transformer_js__rspack_import_0 = __webpack_require__(94363);
/* import */ var _util_js__rspack_import_2 = __webpack_require__(73430);
/* import */ var _accessDeep_js__rspack_import_4 = __webpack_require__(33978);






function traverse(tree, walker, origin = []) {
    if (!tree) {
        return;
    }
    if (!(0,_is_js__rspack_import_1/* .isArray */.cy)(tree)) {
        (0,_util_js__rspack_import_2/* .forEach */.jJ)(tree, (subtree, key) => traverse(subtree, walker, [...origin, ...(0,_pathstringifier_js__rspack_import_3/* .parsePath */.Rr)(key)]));
        return;
    }
    const [nodeValue, children] = tree;
    if (children) {
        (0,_util_js__rspack_import_2/* .forEach */.jJ)(children, (child, key) => {
            traverse(child, walker, [...origin, ...(0,_pathstringifier_js__rspack_import_3/* .parsePath */.Rr)(key)]);
        });
    }
    walker(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
    traverse(annotations, (type, path) => {
        plain = (0,_accessDeep_js__rspack_import_4/* .setDeep */.v)(plain, path, v => (0,_transformer_js__rspack_import_0/* .untransformValue */.xp)(v, type, superJson));
    });
    return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
    function apply(identicalPaths, path) {
        const object = (0,_accessDeep_js__rspack_import_4/* .getDeep */.b)(plain, (0,_pathstringifier_js__rspack_import_3/* .parsePath */.Rr)(path));
        identicalPaths.map(_pathstringifier_js__rspack_import_3/* .parsePath */.Rr).forEach(identicalObjectPath => {
            plain = (0,_accessDeep_js__rspack_import_4/* .setDeep */.v)(plain, identicalObjectPath, () => object);
        });
    }
    if ((0,_is_js__rspack_import_1/* .isArray */.cy)(annotations)) {
        const [root, other] = annotations;
        root.forEach(identicalPath => {
            plain = (0,_accessDeep_js__rspack_import_4/* .setDeep */.v)(plain, (0,_pathstringifier_js__rspack_import_3/* .parsePath */.Rr)(identicalPath), () => plain);
        });
        if (other) {
            (0,_util_js__rspack_import_2/* .forEach */.jJ)(other, apply);
        }
    }
    else {
        (0,_util_js__rspack_import_2/* .forEach */.jJ)(annotations, apply);
    }
    return plain;
}
const isDeep = (object, superJson) => (0,_is_js__rspack_import_1/* .isPlainObject */.Qd)(object) ||
    (0,_is_js__rspack_import_1/* .isArray */.cy)(object) ||
    (0,_is_js__rspack_import_1/* .isMap */.jh)(object) ||
    (0,_is_js__rspack_import_1/* .isSet */.vM)(object) ||
    (0,_transformer_js__rspack_import_0/* .isInstanceOfRegisteredClass */.TT)(object, superJson);
function addIdentity(object, path, identities) {
    const existingSet = identities.get(object);
    if (existingSet) {
        existingSet.push(path);
    }
    else {
        identities.set(object, [path]);
    }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
    const result = {};
    let rootEqualityPaths = undefined;
    identitites.forEach(paths => {
        if (paths.length <= 1) {
            return;
        }
        // if we're not deduping, all of these objects continue existing.
        // putting the shortest path first makes it easier to parse for humans
        // if we're deduping though, only the first entry will still exist, so we can't do this optimisation.
        if (!dedupe) {
            paths = paths
                .map(path => path.map(String))
                .sort((a, b) => a.length - b.length);
        }
        const [representativePath, ...identicalPaths] = paths;
        if (representativePath.length === 0) {
            rootEqualityPaths = identicalPaths.map(_pathstringifier_js__rspack_import_3/* .stringifyPath */.FU);
        }
        else {
            result[(0,_pathstringifier_js__rspack_import_3/* .stringifyPath */.FU)(representativePath)] = identicalPaths.map(_pathstringifier_js__rspack_import_3/* .stringifyPath */.FU);
        }
    });
    if (rootEqualityPaths) {
        if ((0,_is_js__rspack_import_1/* .isEmptyObject */.RI)(result)) {
            return [rootEqualityPaths];
        }
        else {
            return [rootEqualityPaths, result];
        }
    }
    else {
        return (0,_is_js__rspack_import_1/* .isEmptyObject */.RI)(result) ? undefined : result;
    }
}
const walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = new Map()) => {
    const primitive = (0,_is_js__rspack_import_1/* .isPrimitive */.sO)(object);
    if (!primitive) {
        addIdentity(object, path, identities);
        const seen = seenObjects.get(object);
        if (seen) {
            // short-circuit result if we've seen this object before
            return dedupe
                ? {
                    transformedValue: null,
                }
                : seen;
        }
    }
    if (!isDeep(object, superJson)) {
        const transformed = (0,_transformer_js__rspack_import_0/* .transformValue */.oV)(object, superJson);
        const result = transformed
            ? {
                transformedValue: transformed.value,
                annotations: [transformed.type],
            }
            : {
                transformedValue: object,
            };
        if (!primitive) {
            seenObjects.set(object, result);
        }
        return result;
    }
    if ((0,_util_js__rspack_import_2/* .includes */.mK)(objectsInThisPath, object)) {
        // prevent circular references
        return {
            transformedValue: null,
        };
    }
    const transformationResult = (0,_transformer_js__rspack_import_0/* .transformValue */.oV)(object, superJson);
    const transformed = transformationResult?.value ?? object;
    const transformedValue = (0,_is_js__rspack_import_1/* .isArray */.cy)(transformed) ? [] : {};
    const innerAnnotations = {};
    (0,_util_js__rspack_import_2/* .forEach */.jJ)(transformed, (value, index) => {
        if (index === '__proto__' ||
            index === 'constructor' ||
            index === 'prototype') {
            throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
        }
        const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
        transformedValue[index] = recursiveResult.transformedValue;
        if ((0,_is_js__rspack_import_1/* .isArray */.cy)(recursiveResult.annotations)) {
            innerAnnotations[index] = recursiveResult.annotations;
        }
        else if ((0,_is_js__rspack_import_1/* .isPlainObject */.Qd)(recursiveResult.annotations)) {
            (0,_util_js__rspack_import_2/* .forEach */.jJ)(recursiveResult.annotations, (tree, key) => {
                innerAnnotations[(0,_pathstringifier_js__rspack_import_3/* .escapeKey */.jv)(index) + '.' + key] = tree;
            });
        }
    });
    const result = (0,_is_js__rspack_import_1/* .isEmptyObject */.RI)(innerAnnotations)
        ? {
            transformedValue,
            annotations: !!transformationResult
                ? [transformationResult.type]
                : undefined,
        }
        : {
            transformedValue,
            annotations: !!transformationResult
                ? [transformationResult.type, innerAnnotations]
                : innerAnnotations,
        };
    if (!primitive) {
        seenObjects.set(object, result);
    }
    return result;
};


},
62477(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  O: () => (Registry)
});
/* import */ var _double_indexed_kv_js__rspack_import_0 = __webpack_require__(75041);

class Registry {
    constructor(generateIdentifier) {
        this.generateIdentifier = generateIdentifier;
        this.kv = new _double_indexed_kv_js__rspack_import_0/* .DoubleIndexedKV */.Q();
    }
    register(value, identifier) {
        if (this.kv.getByValue(value)) {
            return;
        }
        if (!identifier) {
            identifier = this.generateIdentifier(value);
        }
        this.kv.set(identifier, value);
    }
    clear() {
        this.kv.clear();
    }
    getIdentifier(value) {
        return this.kv.getByValue(value);
    }
    getValue(identifier) {
        return this.kv.getByKey(identifier);
    }
}


},
94363(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  TT: () => (isInstanceOfRegisteredClass),
  oV: () => (transformValue),
  xp: () => (untransformValue)
});
/* import */ var _is_js__rspack_import_0 = __webpack_require__(23962);
/* import */ var _util_js__rspack_import_1 = __webpack_require__(73430);


function simpleTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable,
        annotation,
        transform,
        untransform,
    };
}
const simpleRules = [
    simpleTransformation(_is_js__rspack_import_0/* .isUndefined */.b0, 'undefined', () => null, () => undefined),
    simpleTransformation(_is_js__rspack_import_0/* .isBigint */.OH, 'bigint', v => v.toString(), v => {
        if (typeof BigInt !== 'undefined') {
            return BigInt(v);
        }
        console.error('Please add a BigInt polyfill.');
        return v;
    }),
    simpleTransformation(_is_js__rspack_import_0/* .isDate */.$P, 'Date', v => v.toISOString(), v => new Date(v)),
    simpleTransformation(_is_js__rspack_import_0/* .isError */.bJ, 'Error', (v, superJson) => {
        const baseError = {
            name: v.name,
            message: v.message,
        };
        superJson.allowedErrorProps.forEach(prop => {
            baseError[prop] = v[prop];
        });
        return baseError;
    }, (v, superJson) => {
        const e = new Error(v.message);
        e.name = v.name;
        e.stack = v.stack;
        superJson.allowedErrorProps.forEach(prop => {
            e[prop] = v[prop];
        });
        return e;
    }),
    simpleTransformation(_is_js__rspack_import_0/* .isRegExp */.gd, 'regexp', v => '' + v, regex => {
        const body = regex.slice(1, regex.lastIndexOf('/'));
        const flags = regex.slice(regex.lastIndexOf('/') + 1);
        return new RegExp(body, flags);
    }),
    simpleTransformation(_is_js__rspack_import_0/* .isSet */.vM, 'set', 
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    v => [...v.values()], v => new Set(v)),
    simpleTransformation(_is_js__rspack_import_0/* .isMap */.jh, 'map', v => [...v.entries()], v => new Map(v)),
    simpleTransformation((v) => (0,_is_js__rspack_import_0/* .isNaNValue */.XS)(v) || (0,_is_js__rspack_import_0/* .isInfinite */.Dh)(v), 'number', v => {
        if ((0,_is_js__rspack_import_0/* .isNaNValue */.XS)(v)) {
            return 'NaN';
        }
        if (v > 0) {
            return 'Infinity';
        }
        else {
            return '-Infinity';
        }
    }, Number),
    simpleTransformation((v) => v === 0 && 1 / v === -Infinity, 'number', () => {
        return '-0';
    }, Number),
    simpleTransformation(_is_js__rspack_import_0/* .isURL */.mv, 'URL', v => v.toString(), v => new URL(v)),
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable,
        annotation,
        transform,
        untransform,
    };
}
const symbolRule = compositeTransformation((s, superJson) => {
    if ((0,_is_js__rspack_import_0/* .isSymbol */.Bm)(s)) {
        const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
        return isRegistered;
    }
    return false;
}, (s, superJson) => {
    const identifier = superJson.symbolRegistry.getIdentifier(s);
    return ['symbol', identifier];
}, v => v.description, (_, a, superJson) => {
    const value = superJson.symbolRegistry.getValue(a[1]);
    if (!value) {
        throw new Error('Trying to deserialize unknown symbol');
    }
    return value;
});
const constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray,
].reduce((obj, ctor) => {
    obj[ctor.name] = ctor;
    return obj;
}, {});
const typedArrayRule = compositeTransformation(_is_js__rspack_import_0/* .isTypedArray */.iu, v => ['typed-array', v.constructor.name], v => [...v], (v, a) => {
    const ctor = constructorToName[a[1]];
    if (!ctor) {
        throw new Error('Trying to deserialize unknown typed array');
    }
    return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
    if (potentialClass?.constructor) {
        const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
        return isRegistered;
    }
    return false;
}
const classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
    const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
    return ['class', identifier];
}, (clazz, superJson) => {
    const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
        return { ...clazz };
    }
    const result = {};
    allowedProps.forEach(prop => {
        result[prop] = clazz[prop];
    });
    return result;
}, (v, a, superJson) => {
    const clazz = superJson.classRegistry.getValue(a[1]);
    if (!clazz) {
        throw new Error('Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564');
    }
    return Object.assign(Object.create(clazz.prototype), v);
});
const customRule = compositeTransformation((value, superJson) => {
    return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return ['custom', transformer.name];
}, (value, superJson) => {
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
}, (v, a, superJson) => {
    const transformer = superJson.customTransformerRegistry.findByName(a[1]);
    if (!transformer) {
        throw new Error('Trying to deserialize unknown custom value');
    }
    return transformer.deserialize(v);
});
const compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
const transformValue = (value, superJson) => {
    const applicableCompositeRule = (0,_util_js__rspack_import_1/* .findArr */.Zy)(compositeRules, rule => rule.isApplicable(value, superJson));
    if (applicableCompositeRule) {
        return {
            value: applicableCompositeRule.transform(value, superJson),
            type: applicableCompositeRule.annotation(value, superJson),
        };
    }
    const applicableSimpleRule = (0,_util_js__rspack_import_1/* .findArr */.Zy)(simpleRules, rule => rule.isApplicable(value, superJson));
    if (applicableSimpleRule) {
        return {
            value: applicableSimpleRule.transform(value, superJson),
            type: applicableSimpleRule.annotation,
        };
    }
    return undefined;
};
const simpleRulesByAnnotation = {};
simpleRules.forEach(rule => {
    simpleRulesByAnnotation[rule.annotation] = rule;
});
const untransformValue = (json, type, superJson) => {
    if ((0,_is_js__rspack_import_0/* .isArray */.cy)(type)) {
        switch (type[0]) {
            case 'symbol':
                return symbolRule.untransform(json, type, superJson);
            case 'class':
                return classRule.untransform(json, type, superJson);
            case 'custom':
                return customRule.untransform(json, type, superJson);
            case 'typed-array':
                return typedArrayRule.untransform(json, type, superJson);
            default:
                throw new Error('Unknown transformation: ' + type);
        }
    }
    else {
        const transformation = simpleRulesByAnnotation[type];
        if (!transformation) {
            throw new Error('Unknown transformation: ' + type);
        }
        return transformation.untransform(json, superJson);
    }
};


},
73430(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  I6: () => (find),
  Zy: () => (findArr),
  jJ: () => (forEach),
  mK: () => (includes)
});
function valuesOfObj(record) {
    if ('values' in Object) {
        // eslint-disable-next-line es5/no-es6-methods
        return Object.values(record);
    }
    const values = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key in record) {
        if (record.hasOwnProperty(key)) {
            values.push(record[key]);
        }
    }
    return values;
}
function find(record, predicate) {
    const values = valuesOfObj(record);
    if ('find' in values) {
        // eslint-disable-next-line es5/no-es6-methods
        return values.find(predicate);
    }
    const valuesNotNever = values;
    for (let i = 0; i < valuesNotNever.length; i++) {
        const value = valuesNotNever[i];
        if (predicate(value)) {
            return value;
        }
    }
    return undefined;
}
function forEach(record, run) {
    Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
    return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
    for (let i = 0; i < record.length; i++) {
        const value = record[i];
        if (predicate(value)) {
            return value;
        }
    }
    return undefined;
}


},

},function(__webpack_require__) {
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId) }
var __webpack_exports__ = (__webpack_exec__(67283));

}
]);