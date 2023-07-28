globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import gracefulShutdown from 'http-graceful-shutdown';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection] " + err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro]  [uncaughtException] " + err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-07-28T13:28:20.712Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/DeliveryInfo.084b508d.js": {
    "type": "application/javascript",
    "etag": "\"23b-J+L6OqERH7JkWZzM2SLsah7ZAVA\"",
    "mtime": "2023-07-28T13:28:20.702Z",
    "size": 571,
    "path": "../public/_nuxt/DeliveryInfo.084b508d.js"
  },
  "/_nuxt/DeliveryInfo.a1ec8cdc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26f6-g0jZn/agY3iv4pdkv79R5X/atzE\"",
    "mtime": "2023-07-28T13:28:20.701Z",
    "size": 9974,
    "path": "../public/_nuxt/DeliveryInfo.a1ec8cdc.css"
  },
  "/_nuxt/OrderInfo.170aa18c.js": {
    "type": "application/javascript",
    "etag": "\"1ca-+yH9eJnHv08TpmhDBdZVal5Gkzc\"",
    "mtime": "2023-07-28T13:28:20.700Z",
    "size": 458,
    "path": "../public/_nuxt/OrderInfo.170aa18c.js"
  },
  "/_nuxt/OrderInfo.eaac9f2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26f6-9lfcTw8VUkzJyL/9RpYG6L01KXo\"",
    "mtime": "2023-07-28T13:28:20.699Z",
    "size": 9974,
    "path": "../public/_nuxt/OrderInfo.eaac9f2a.css"
  },
  "/_nuxt/PaymentInfo.b15fbb1d.js": {
    "type": "application/javascript",
    "etag": "\"12e2-BHpnLLsSIs8qxqlkPW4PEYAu2nc\"",
    "mtime": "2023-07-28T13:28:20.699Z",
    "size": 4834,
    "path": "../public/_nuxt/PaymentInfo.b15fbb1d.js"
  },
  "/_nuxt/PaymentInfo.e706bd39.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c6ca-I2wEkjm7AWe2RF0eE1TcF10Z1c0\"",
    "mtime": "2023-07-28T13:28:20.698Z",
    "size": 50890,
    "path": "../public/_nuxt/PaymentInfo.e706bd39.css"
  },
  "/_nuxt/SearchDelivery.2277167b.js": {
    "type": "application/javascript",
    "etag": "\"cc-L/LLfAy+t+rfTrTiVh/XaYY8E8k\"",
    "mtime": "2023-07-28T13:28:20.697Z",
    "size": 204,
    "path": "../public/_nuxt/SearchDelivery.2277167b.js"
  },
  "/_nuxt/_id_.217527aa.js": {
    "type": "application/javascript",
    "etag": "\"866-Cs+gsVacQAGBNmSp23S5W/9PLBA\"",
    "mtime": "2023-07-28T13:28:20.696Z",
    "size": 2150,
    "path": "../public/_nuxt/_id_.217527aa.js"
  },
  "/_nuxt/_id_.7d264aec.js": {
    "type": "application/javascript",
    "etag": "\"937-vfmK9MNsjvn9LssQ3DNrz/+lWgM\"",
    "mtime": "2023-07-28T13:28:20.695Z",
    "size": 2359,
    "path": "../public/_nuxt/_id_.7d264aec.js"
  },
  "/_nuxt/_id_.a6ab3a53.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2799-mQ0BZCHk3GwVWVf3iXCOYzJ5FNo\"",
    "mtime": "2023-07-28T13:28:20.694Z",
    "size": 10137,
    "path": "../public/_nuxt/_id_.a6ab3a53.css"
  },
  "/_nuxt/_id_.c3e89d20.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2799-8Ar4ufOq8cuadxKloBbOFsKMa4w\"",
    "mtime": "2023-07-28T13:28:20.693Z",
    "size": 10137,
    "path": "../public/_nuxt/_id_.c3e89d20.css"
  },
  "/_nuxt/_id_.dd0e5f1e.js": {
    "type": "application/javascript",
    "etag": "\"3da-xdDxlEByTRj9pAoBwnLU2DqHs+4\"",
    "mtime": "2023-07-28T13:28:20.693Z",
    "size": 986,
    "path": "../public/_nuxt/_id_.dd0e5f1e.js"
  },
  "/_nuxt/_id_.eec45277.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2961-HB2Yq2oJtry5oZxDnFcfbKFbLN8\"",
    "mtime": "2023-07-28T13:28:20.692Z",
    "size": 10593,
    "path": "../public/_nuxt/_id_.eec45277.css"
  },
  "/_nuxt/entry.1da352be.js": {
    "type": "application/javascript",
    "etag": "\"3a703-bhH/jVVCG+duCpjqMm2gRmuj31M\"",
    "mtime": "2023-07-28T13:28:20.691Z",
    "size": 239363,
    "path": "../public/_nuxt/entry.1da352be.js"
  },
  "/_nuxt/entry.eb67e9b4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4da0-02XSJpFSI4RWQJJqb7p4949j8GU\"",
    "mtime": "2023-07-28T13:28:20.689Z",
    "size": 19872,
    "path": "../public/_nuxt/entry.eb67e9b4.css"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-28T13:28:20.688Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.a639ae7d.js": {
    "type": "application/javascript",
    "etag": "\"8ad-9faR9W1fShyH6iM4ScjM1b9Od4M\"",
    "mtime": "2023-07-28T13:28:20.687Z",
    "size": 2221,
    "path": "../public/_nuxt/error-404.a639ae7d.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-28T13:28:20.686Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.fc312c47.js": {
    "type": "application/javascript",
    "etag": "\"756-xVGS7jeJO7h4GpUyu4xktirRjVA\"",
    "mtime": "2023-07-28T13:28:20.686Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.fc312c47.js"
  },
  "/_nuxt/index.19944438.js": {
    "type": "application/javascript",
    "etag": "\"d5f-YFgPWR+imfJFK+KUflOLM4cXn5Q\"",
    "mtime": "2023-07-28T13:28:20.685Z",
    "size": 3423,
    "path": "../public/_nuxt/index.19944438.js"
  },
  "/_nuxt/index.3fae00f5.js": {
    "type": "application/javascript",
    "etag": "\"d0-1VMc3g/dZaTD6CRpTb/uCXMehfM\"",
    "mtime": "2023-07-28T13:28:20.684Z",
    "size": 208,
    "path": "../public/_nuxt/index.3fae00f5.js"
  },
  "/_nuxt/index.42c339f4.js": {
    "type": "application/javascript",
    "etag": "\"36f9-19Gqc5C9xYsA5XpFDSZsk/BqMZ4\"",
    "mtime": "2023-07-28T13:28:20.682Z",
    "size": 14073,
    "path": "../public/_nuxt/index.42c339f4.js"
  },
  "/_nuxt/index.4901e34a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e44-tvpZQOJblJcuZUli0SzGUit8yvU\"",
    "mtime": "2023-07-28T13:28:20.681Z",
    "size": 40516,
    "path": "../public/_nuxt/index.4901e34a.css"
  },
  "/_nuxt/index.4da34adf.js": {
    "type": "application/javascript",
    "etag": "\"640-Vnc2u8rq3I+4J30k83BNviw0buU\"",
    "mtime": "2023-07-28T13:28:20.680Z",
    "size": 1600,
    "path": "../public/_nuxt/index.4da34adf.js"
  },
  "/_nuxt/index.71acae15.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3752d-qwfvm/AZ1aqaxg1zJe7cWn6Idc0\"",
    "mtime": "2023-07-28T13:28:20.678Z",
    "size": 226605,
    "path": "../public/_nuxt/index.71acae15.css"
  },
  "/_nuxt/index.7817c419.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2861-G4u4rt0MSkGaZ5zjKPShs0QbZi0\"",
    "mtime": "2023-07-28T13:28:20.676Z",
    "size": 10337,
    "path": "../public/_nuxt/index.7817c419.css"
  },
  "/_nuxt/index.97750a9b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2861-Bgcit4wCau6Twyh3S4OLEmhiPdI\"",
    "mtime": "2023-07-28T13:28:20.675Z",
    "size": 10337,
    "path": "../public/_nuxt/index.97750a9b.css"
  },
  "/_nuxt/index.a045b8de.js": {
    "type": "application/javascript",
    "etag": "\"6bf-XSpEeRo9IQmTScsIomb2m9QpX5g\"",
    "mtime": "2023-07-28T13:28:20.674Z",
    "size": 1727,
    "path": "../public/_nuxt/index.a045b8de.js"
  },
  "/_nuxt/index.b9f2f6a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2865-k2N3I34nAQvoM5BmHVUCQqAEdj8\"",
    "mtime": "2023-07-28T13:28:20.673Z",
    "size": 10341,
    "path": "../public/_nuxt/index.b9f2f6a3.css"
  },
  "/_nuxt/index.f1ffe763.js": {
    "type": "application/javascript",
    "etag": "\"7a8-CBSRTlqSB6vTAf4jFW7D9bdH72I\"",
    "mtime": "2023-07-28T13:28:20.673Z",
    "size": 1960,
    "path": "../public/_nuxt/index.f1ffe763.js"
  },
  "/_nuxt/index.fcd4ea80.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26f6-pNV1kVIZlkHXSiYuUOQvYdcjqiI\"",
    "mtime": "2023-07-28T13:28:20.672Z",
    "size": 9974,
    "path": "../public/_nuxt/index.fcd4ea80.css"
  },
  "/_nuxt/main.5a8b17f1.js": {
    "type": "application/javascript",
    "etag": "\"4bbf-++HQsy0pSJPxGDbferp8KPxTLOg\"",
    "mtime": "2023-07-28T13:28:20.672Z",
    "size": 19391,
    "path": "../public/_nuxt/main.5a8b17f1.js"
  },
  "/_nuxt/not-active.4dd2581d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2799-IonXmqkqEvInBg1qe81DJHkbNcA\"",
    "mtime": "2023-07-28T13:28:20.671Z",
    "size": 10137,
    "path": "../public/_nuxt/not-active.4dd2581d.css"
  },
  "/_nuxt/not-active.698d24ff.js": {
    "type": "application/javascript",
    "etag": "\"491-+ebJ5/B3rjq7deMzvX5c+k5X0ek\"",
    "mtime": "2023-07-28T13:28:20.671Z",
    "size": 1169,
    "path": "../public/_nuxt/not-active.698d24ff.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_FOv4yZ = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_FOv4yZ, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_FOv4yZ, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
