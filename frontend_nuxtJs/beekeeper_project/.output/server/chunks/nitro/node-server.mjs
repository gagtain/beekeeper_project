globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, lazyEventHandler, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent } from 'h3';
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
import { createIPX, createIPXMiddleware } from 'ipx';

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
  "public": {
    "device": {
      "enabled": true,
      "defaultUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36",
      "refreshOnResize": false
    }
  },
  "ipx": {
    "dir": "../public",
    "domains": [
      "owa.gagtain.ru"
    ],
    "sharp": {},
    "alias": {}
  }
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
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
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
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"4183e-Fbgm00tFDiXipsKAHOca8SQ/DYw\"",
    "mtime": "2023-08-16T17:44:17.897Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-16T17:44:17.890Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-16T17:44:17.888Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.2bcd9caf.js": {
    "type": "application/javascript",
    "etag": "\"9a7-iwZhwPIT8c6VpLZVH4xzONC7oKI\"",
    "mtime": "2023-08-16T17:44:17.887Z",
    "size": 2471,
    "path": "../public/_nuxt/BasketInfo.2bcd9caf.js"
  },
  "/_nuxt/BasketInfo.2bcd9caf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f4-O5UTgiqZLCfWbdmc1rUI6ej3cPM\"",
    "mtime": "2023-08-16T17:44:17.912Z",
    "size": 1012,
    "path": "../public/_nuxt/BasketInfo.2bcd9caf.js.br"
  },
  "/_nuxt/BasketInfo.2bcd9caf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bd-TMaIVS5RiRPN5O9wxXjdqmVNKgg\"",
    "mtime": "2023-08-16T17:44:17.901Z",
    "size": 1213,
    "path": "../public/_nuxt/BasketInfo.2bcd9caf.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-16T17:44:17.887Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-16T17:44:17.938Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-16T17:44:17.913Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.4be3ba51.js": {
    "type": "application/javascript",
    "etag": "\"124d-AJWiajiBLfWd2KnVgsyAG0CPVso\"",
    "mtime": "2023-08-16T17:44:17.886Z",
    "size": 4685,
    "path": "../public/_nuxt/CatalogProduct.4be3ba51.js"
  },
  "/_nuxt/CatalogProduct.4be3ba51.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"68f-ZhxZalWqC0vkmJxPGdP2SMOfj8w\"",
    "mtime": "2023-08-16T17:44:17.944Z",
    "size": 1679,
    "path": "../public/_nuxt/CatalogProduct.4be3ba51.js.br"
  },
  "/_nuxt/CatalogProduct.4be3ba51.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"782-6cW3SLKd5VkRpW3KdNiOhrLJPK0\"",
    "mtime": "2023-08-16T17:44:17.939Z",
    "size": 1922,
    "path": "../public/_nuxt/CatalogProduct.4be3ba51.js.gz"
  },
  "/_nuxt/CatalogProduct.c532a385.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2980-rZHKDaUA+5ckLoMVh6QhmSXTENo\"",
    "mtime": "2023-08-16T17:44:17.885Z",
    "size": 10624,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css"
  },
  "/_nuxt/CatalogProduct.c532a385.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"758-qJEKjC2MEsdoNOZX7yfuh8gKd10\"",
    "mtime": "2023-08-16T17:44:17.957Z",
    "size": 1880,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css.br"
  },
  "/_nuxt/CatalogProduct.c532a385.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89d-2rcErevMbVp4Vl/mFgNJ7OozHgs\"",
    "mtime": "2023-08-16T17:44:17.945Z",
    "size": 2205,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css.gz"
  },
  "/_nuxt/FavoriteComp.1c2d6fd9.js": {
    "type": "application/javascript",
    "etag": "\"783-Ea9yveJ/N9y4akJAGbwN+5elhCs\"",
    "mtime": "2023-08-16T17:44:17.885Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.1c2d6fd9.js"
  },
  "/_nuxt/FavoriteComp.1c2d6fd9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-bKwSi8nFtoFk9q9mgCJj3DhdRVY\"",
    "mtime": "2023-08-16T17:44:17.962Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.1c2d6fd9.js.br"
  },
  "/_nuxt/FavoriteComp.1c2d6fd9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f7-maTyNUiieJ9eOReUVCIFOkZi8lQ\"",
    "mtime": "2023-08-16T17:44:17.958Z",
    "size": 759,
    "path": "../public/_nuxt/FavoriteComp.1c2d6fd9.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-16T17:44:17.884Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-16T17:44:17.978Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-16T17:44:17.963Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-08-16T17:44:17.884Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-08-16T17:44:17.984Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-08-16T17:44:17.979Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.ecd6af8e.js": {
    "type": "application/javascript",
    "etag": "\"e2e-hJ96E6tu9rS0n0cDi7/mN0ErV8E\"",
    "mtime": "2023-08-16T17:44:17.883Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.ecd6af8e.js"
  },
  "/_nuxt/FavoriteComp.ecd6af8e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40f-B6b6YRspgbpev0jlHsaC8jys9hc\"",
    "mtime": "2023-08-16T17:44:17.991Z",
    "size": 1039,
    "path": "../public/_nuxt/FavoriteComp.ecd6af8e.js.br"
  },
  "/_nuxt/FavoriteComp.ecd6af8e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-pOu5P4Afo/pjgqLpwL6tpGmfSb0\"",
    "mtime": "2023-08-16T17:44:17.985Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.ecd6af8e.js.gz"
  },
  "/_nuxt/ImageForm.7f1f06cc.js": {
    "type": "application/javascript",
    "etag": "\"1ac-oAB7qfQrUO03D63oqYIxz7BJFlE\"",
    "mtime": "2023-08-16T17:44:17.883Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.7f1f06cc.js"
  },
  "/_nuxt/LoadingComp.2bf4da64.js": {
    "type": "application/javascript",
    "etag": "\"1fe-zFSkg5lIhVIMwycoi2dd9tPR2Wc\"",
    "mtime": "2023-08-16T17:44:17.882Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.2bf4da64.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-16T17:44:17.881Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-16T17:44:17.881Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-16T17:44:17.995Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-16T17:44:17.992Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.b42bf98b.js": {
    "type": "application/javascript",
    "etag": "\"461-4Z3ErvhtuZ6DylT+++sGWy++Szg\"",
    "mtime": "2023-08-16T17:44:17.880Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.b42bf98b.js"
  },
  "/_nuxt/OrderProductList.b42bf98b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"212-Z+jJOvMO/srJ/TBAK6fwybrF5n0\"",
    "mtime": "2023-08-16T17:44:17.998Z",
    "size": 530,
    "path": "../public/_nuxt/OrderProductList.b42bf98b.js.br"
  },
  "/_nuxt/OrderProductList.b42bf98b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-T3o61Rh24Y5j2UGK4TnvS3Go9v4\"",
    "mtime": "2023-08-16T17:44:17.996Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.b42bf98b.js.gz"
  },
  "/_nuxt/UserBasket.3ac54c98.js": {
    "type": "application/javascript",
    "etag": "\"1312-aEeFpKXhf+2WK90kUJoj1VikT50\"",
    "mtime": "2023-08-16T17:44:17.879Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.3ac54c98.js"
  },
  "/_nuxt/UserBasket.3ac54c98.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72b-a76DjM55+FPO8oREmDGzRpzem9U\"",
    "mtime": "2023-08-16T17:44:18.005Z",
    "size": 1835,
    "path": "../public/_nuxt/UserBasket.3ac54c98.js.br"
  },
  "/_nuxt/UserBasket.3ac54c98.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"840-cCMaKlz3syAJBj2HCoT/NUUKt6k\"",
    "mtime": "2023-08-16T17:44:17.999Z",
    "size": 2112,
    "path": "../public/_nuxt/UserBasket.3ac54c98.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-16T17:44:17.878Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-16T17:44:18.022Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-16T17:44:18.006Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-16T17:44:17.878Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-16T17:44:18.037Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-16T17:44:18.023Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-16T17:44:17.877Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.8c0a5efa.js": {
    "type": "application/javascript",
    "etag": "\"12da-wHrRaQej4G94ZZX4451A77gAUYg\"",
    "mtime": "2023-08-16T17:44:17.876Z",
    "size": 4826,
    "path": "../public/_nuxt/_id_.8c0a5efa.js"
  },
  "/_nuxt/_id_.8c0a5efa.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"762-WzEuH7m2nv8q9DKRifTEgW4QorE\"",
    "mtime": "2023-08-16T17:44:18.044Z",
    "size": 1890,
    "path": "../public/_nuxt/_id_.8c0a5efa.js.br"
  },
  "/_nuxt/_id_.8c0a5efa.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"858-UjYLVWxS5uHk1EkVboxILam5ItM\"",
    "mtime": "2023-08-16T17:44:18.039Z",
    "size": 2136,
    "path": "../public/_nuxt/_id_.8c0a5efa.js.gz"
  },
  "/_nuxt/_id_.aa5c3e86.js": {
    "type": "application/javascript",
    "etag": "\"531-sWZt8F4tIYHUJVI+sQJ9i+kv7Qo\"",
    "mtime": "2023-08-16T17:44:17.875Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.aa5c3e86.js"
  },
  "/_nuxt/_id_.aa5c3e86.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"29f-DlXOlDbCHYo8x9gAzp8Np0WzZ5A\"",
    "mtime": "2023-08-16T17:44:18.048Z",
    "size": 671,
    "path": "../public/_nuxt/_id_.aa5c3e86.js.br"
  },
  "/_nuxt/_id_.aa5c3e86.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32b-J23/Lr8VZUKLZ6MQd6j5kRfoJ1E\"",
    "mtime": "2023-08-16T17:44:18.045Z",
    "size": 811,
    "path": "../public/_nuxt/_id_.aa5c3e86.js.gz"
  },
  "/_nuxt/about_us.5b28b628.js": {
    "type": "application/javascript",
    "etag": "\"5c2-Qcsi6ovttRUSCbLR3BRnX45htSI\"",
    "mtime": "2023-08-16T17:44:17.872Z",
    "size": 1474,
    "path": "../public/_nuxt/about_us.5b28b628.js"
  },
  "/_nuxt/about_us.5b28b628.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"29a-AP0cnNKdniz/KTMlB3fXQazeOfs\"",
    "mtime": "2023-08-16T17:44:18.051Z",
    "size": 666,
    "path": "../public/_nuxt/about_us.5b28b628.js.br"
  },
  "/_nuxt/about_us.5b28b628.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32b-O3fx4JaOqR5kGAig5RS04I1m8sA\"",
    "mtime": "2023-08-16T17:44:18.048Z",
    "size": 811,
    "path": "../public/_nuxt/about_us.5b28b628.js.gz"
  },
  "/_nuxt/about_us.81db9552.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"189-kpF8gewa4K+yw6/IFnbVdPtwxtw\"",
    "mtime": "2023-08-16T17:44:17.871Z",
    "size": 393,
    "path": "../public/_nuxt/about_us.81db9552.css"
  },
  "/_nuxt/basket.2088c79e.js": {
    "type": "application/javascript",
    "etag": "\"294-p2cCn2lDyVxRaPiqXeSlaN4kfCw\"",
    "mtime": "2023-08-16T17:44:17.870Z",
    "size": 660,
    "path": "../public/_nuxt/basket.2088c79e.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-16T17:44:17.869Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-16T17:44:18.059Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-16T17:44:18.052Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.a8f16b0c.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-XOyp1oLrrHSvjuKy9A6lSUKnrlU\"",
    "mtime": "2023-08-16T17:44:17.868Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.a8f16b0c.js"
  },
  "/_nuxt/catalog.a8f16b0c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"920-Q3Fcfj7PUYU54sTx377U0G7y9z0\"",
    "mtime": "2023-08-16T17:44:18.068Z",
    "size": 2336,
    "path": "../public/_nuxt/catalog.a8f16b0c.js.br"
  },
  "/_nuxt/catalog.a8f16b0c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a97-cgRd2z8zng64QATHl5uQU9/ukV4\"",
    "mtime": "2023-08-16T17:44:18.060Z",
    "size": 2711,
    "path": "../public/_nuxt/catalog.a8f16b0c.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-08-16T17:44:17.868Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-08-16T17:44:18.077Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-08-16T17:44:18.069Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.095b8e47.js": {
    "type": "application/javascript",
    "etag": "\"14ef7-TM3v5Kv007RuxdRYqXy3ECLxQO4\"",
    "mtime": "2023-08-16T17:44:17.867Z",
    "size": 85751,
    "path": "../public/_nuxt/checkout.095b8e47.js"
  },
  "/_nuxt/checkout.095b8e47.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5282-Frb8UPcRUjAeOIg9g/MxIi5xizI\"",
    "mtime": "2023-08-16T17:44:18.176Z",
    "size": 21122,
    "path": "../public/_nuxt/checkout.095b8e47.js.br"
  },
  "/_nuxt/checkout.095b8e47.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fca-t4oAUeGdO+FM8H3iO6L52croWXM\"",
    "mtime": "2023-08-16T17:44:18.080Z",
    "size": 24522,
    "path": "../public/_nuxt/checkout.095b8e47.js.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-16T17:44:17.865Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-16T17:44:18.285Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-16T17:44:18.179Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/entry.2ec0d424.js": {
    "type": "application/javascript",
    "etag": "\"3650a-WNWFYxxisI/uvMwz4CB4Pp77Ebw\"",
    "mtime": "2023-08-16T17:44:17.863Z",
    "size": 222474,
    "path": "../public/_nuxt/entry.2ec0d424.js"
  },
  "/_nuxt/entry.2ec0d424.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"121d1-ZnJ3Xs/KkOwVT+h34tUnt2KVSIM\"",
    "mtime": "2023-08-16T17:44:18.624Z",
    "size": 74193,
    "path": "../public/_nuxt/entry.2ec0d424.js.br"
  },
  "/_nuxt/entry.2ec0d424.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14603-6sEoShRsqeQdgV67TYJ/KhaI49E\"",
    "mtime": "2023-08-16T17:44:18.294Z",
    "size": 83459,
    "path": "../public/_nuxt/entry.2ec0d424.js.gz"
  },
  "/_nuxt/entry.b7119aea.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"24fe-8aY6Op73jTLB3sUqjUpP5aD8kn4\"",
    "mtime": "2023-08-16T17:44:17.861Z",
    "size": 9470,
    "path": "../public/_nuxt/entry.b7119aea.css"
  },
  "/_nuxt/entry.b7119aea.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"927-vuL59wD3DaHVX7ohMp45HaUbzKo\"",
    "mtime": "2023-08-16T17:44:18.635Z",
    "size": 2343,
    "path": "../public/_nuxt/entry.b7119aea.css.br"
  },
  "/_nuxt/entry.b7119aea.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a95-8SmlsgvBmA+tJv1K6jKOrnCGIgc\"",
    "mtime": "2023-08-16T17:44:18.625Z",
    "size": 2709,
    "path": "../public/_nuxt/entry.b7119aea.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-16T17:44:17.860Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-16T17:44:18.640Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-16T17:44:18.636Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.c5a8f18f.js": {
    "type": "application/javascript",
    "etag": "\"89e-VdWHsRVTv+JUPDDPSMEHISlsZek\"",
    "mtime": "2023-08-16T17:44:17.859Z",
    "size": 2206,
    "path": "../public/_nuxt/error-404.c5a8f18f.js"
  },
  "/_nuxt/error-404.c5a8f18f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ca-B26W81TaaGbOXhII0xDihtIyock\"",
    "mtime": "2023-08-16T17:44:18.644Z",
    "size": 970,
    "path": "../public/_nuxt/error-404.c5a8f18f.js.br"
  },
  "/_nuxt/error-404.c5a8f18f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"472-CdpLMme2PTyoYjhI+1mdymltPkA\"",
    "mtime": "2023-08-16T17:44:18.641Z",
    "size": 1138,
    "path": "../public/_nuxt/error-404.c5a8f18f.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-16T17:44:17.858Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-16T17:44:18.648Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-16T17:44:18.645Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.db136ef5.js": {
    "type": "application/javascript",
    "etag": "\"756-+Gqj8xLJyBqt3ZrfVv88iOVRPKM\"",
    "mtime": "2023-08-16T17:44:17.858Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.db136ef5.js"
  },
  "/_nuxt/error-500.db136ef5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-DNZ9nFSyDg4D1Fc2KXdkFl77koU\"",
    "mtime": "2023-08-16T17:44:18.651Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.db136ef5.js.br"
  },
  "/_nuxt/error-500.db136ef5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-f8mzf3PGdfwhwdLWqzv9HLf/gns\"",
    "mtime": "2023-08-16T17:44:18.648Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.db136ef5.js.gz"
  },
  "/_nuxt/error-component.7aac611d.js": {
    "type": "application/javascript",
    "etag": "\"45e-S2DplhyM+FYY+sxb3DB9y252t6g\"",
    "mtime": "2023-08-16T17:44:17.857Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.7aac611d.js"
  },
  "/_nuxt/error-component.7aac611d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-ZK8EZviPjGqH5+wVJToSC9o672Y\"",
    "mtime": "2023-08-16T17:44:18.654Z",
    "size": 520,
    "path": "../public/_nuxt/error-component.7aac611d.js.br"
  },
  "/_nuxt/error-component.7aac611d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-OUwnwwh55TBGPb3kzDr/Ags2IPE\"",
    "mtime": "2023-08-16T17:44:18.652Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.7aac611d.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-16T17:44:17.856Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-16T17:44:18.661Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-16T17:44:18.654Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.8d043f85.js": {
    "type": "application/javascript",
    "etag": "\"a3f-2LRsTcqbsd1wK3gbh01N/78Ao8k\"",
    "mtime": "2023-08-16T17:44:17.855Z",
    "size": 2623,
    "path": "../public/_nuxt/favorite.8d043f85.js"
  },
  "/_nuxt/favorite.8d043f85.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"455-E+DiIT9gKkDrFsHjMed5KRYiRmA\"",
    "mtime": "2023-08-16T17:44:18.666Z",
    "size": 1109,
    "path": "../public/_nuxt/favorite.8d043f85.js.br"
  },
  "/_nuxt/favorite.8d043f85.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50d-qKtTEM9/zXY/yBOc6veosY5z+Fs\"",
    "mtime": "2023-08-16T17:44:18.662Z",
    "size": 1293,
    "path": "../public/_nuxt/favorite.8d043f85.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-16T17:44:17.854Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-16T17:44:17.853Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-16T17:44:17.853Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-16T17:44:18.670Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-16T17:44:18.667Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.4092d60b.js": {
    "type": "application/javascript",
    "etag": "\"181d5-25dKyOU8jMCjUJLd7ZgwOpnVGPs\"",
    "mtime": "2023-08-16T17:44:17.852Z",
    "size": 98773,
    "path": "../public/_nuxt/index.4092d60b.js"
  },
  "/_nuxt/index.4092d60b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6992-Efix0+P5t5VJeI6TYOqvJF+Ey/w\"",
    "mtime": "2023-08-16T17:44:18.786Z",
    "size": 27026,
    "path": "../public/_nuxt/index.4092d60b.js.br"
  },
  "/_nuxt/index.4092d60b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"77ed-njCdWwxlDfc4rxeTshfv7ppBDrg\"",
    "mtime": "2023-08-16T17:44:18.674Z",
    "size": 30701,
    "path": "../public/_nuxt/index.4092d60b.js.gz"
  },
  "/_nuxt/index.5500462e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-gvuTuxFQDa+04NcW0ywnYby5ZPA\"",
    "mtime": "2023-08-16T17:44:17.851Z",
    "size": 22887,
    "path": "../public/_nuxt/index.5500462e.css"
  },
  "/_nuxt/index.5500462e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12df-3+PLIXkWSNgcrbtlCQs22c0G6Us\"",
    "mtime": "2023-08-16T17:44:18.812Z",
    "size": 4831,
    "path": "../public/_nuxt/index.5500462e.css.br"
  },
  "/_nuxt/index.5500462e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-3CugGbSCtO+2w6bNWIvVP2clYNs\"",
    "mtime": "2023-08-16T17:44:18.787Z",
    "size": 5713,
    "path": "../public/_nuxt/index.5500462e.css.gz"
  },
  "/_nuxt/index.8ea9f51a.js": {
    "type": "application/javascript",
    "etag": "\"3abf-piOCUp/iy1VM0Q4q83VfaOxyUFA\"",
    "mtime": "2023-08-16T17:44:17.850Z",
    "size": 15039,
    "path": "../public/_nuxt/index.8ea9f51a.js"
  },
  "/_nuxt/index.8ea9f51a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f5-6K5vFVpFwVK6AG7paJ8xIEGptoM\"",
    "mtime": "2023-08-16T17:44:18.830Z",
    "size": 4853,
    "path": "../public/_nuxt/index.8ea9f51a.js.br"
  },
  "/_nuxt/index.8ea9f51a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-mtg9NYcZFonMs5ZGg/vKZ7sXSQg\"",
    "mtime": "2023-08-16T17:44:18.813Z",
    "size": 5362,
    "path": "../public/_nuxt/index.8ea9f51a.js.gz"
  },
  "/_nuxt/index.9dcf2b99.js": {
    "type": "application/javascript",
    "etag": "\"64e-v1AUL4CTjO1O2Wqvzydb0gfz+kY\"",
    "mtime": "2023-08-16T17:44:17.849Z",
    "size": 1614,
    "path": "../public/_nuxt/index.9dcf2b99.js"
  },
  "/_nuxt/index.9dcf2b99.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"327-MMIuwln53MW2t4Trdsu+08euNEs\"",
    "mtime": "2023-08-16T17:44:18.833Z",
    "size": 807,
    "path": "../public/_nuxt/index.9dcf2b99.js.br"
  },
  "/_nuxt/index.9dcf2b99.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3ba-DSnm8cXSlw+J1DP/b4BugeZvjjU\"",
    "mtime": "2023-08-16T17:44:18.830Z",
    "size": 954,
    "path": "../public/_nuxt/index.9dcf2b99.js.gz"
  },
  "/_nuxt/isAuth.79ec6f88.js": {
    "type": "application/javascript",
    "etag": "\"283-+I8huxCvtTMbDMcAejjurPaOp4w\"",
    "mtime": "2023-08-16T17:44:17.848Z",
    "size": 643,
    "path": "../public/_nuxt/isAuth.79ec6f88.js"
  },
  "/_nuxt/login.1af353fc.js": {
    "type": "application/javascript",
    "etag": "\"80f-ZeabZFXtOPQMAm9682wS4GroptI\"",
    "mtime": "2023-08-16T17:44:17.847Z",
    "size": 2063,
    "path": "../public/_nuxt/login.1af353fc.js"
  },
  "/_nuxt/login.1af353fc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e6-yoggFSo6zl0+ANJIvI9IkXCObbw\"",
    "mtime": "2023-08-16T17:44:18.837Z",
    "size": 998,
    "path": "../public/_nuxt/login.1af353fc.js.br"
  },
  "/_nuxt/login.1af353fc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ae-qxJVbxtYG0v1jmO1IqU46T9L8lg\"",
    "mtime": "2023-08-16T17:44:18.834Z",
    "size": 1198,
    "path": "../public/_nuxt/login.1af353fc.js.gz"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-16T17:44:17.847Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-16T17:44:18.841Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-16T17:44:18.838Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/newsList.02d30ff1.js": {
    "type": "application/javascript",
    "etag": "\"e6-Nh4Uj+d7viZtizwNg9WK3kNdHwQ\"",
    "mtime": "2023-08-16T17:44:17.846Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.02d30ff1.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-16T17:44:17.845Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-16T17:44:18.852Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-16T17:44:18.842Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.80a48e1d.js": {
    "type": "application/javascript",
    "etag": "\"26bb-HoNhU29jRADB9kOl3WcM59YUWbM\"",
    "mtime": "2023-08-16T17:44:17.844Z",
    "size": 9915,
    "path": "../public/_nuxt/orders.80a48e1d.js"
  },
  "/_nuxt/orders.80a48e1d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc1-7a4bcKYXUjUMSZhNt6l+czA19cI\"",
    "mtime": "2023-08-16T17:44:18.863Z",
    "size": 3009,
    "path": "../public/_nuxt/orders.80a48e1d.js.br"
  },
  "/_nuxt/orders.80a48e1d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-IpvVDWxNMiRkBi/iBOPOFmHMOyE\"",
    "mtime": "2023-08-16T17:44:18.853Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.80a48e1d.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-16T17:44:17.843Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-16T17:44:18.898Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-16T17:44:18.864Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.f20e6c6c.js": {
    "type": "application/javascript",
    "etag": "\"169d-Lv2D3zlc4xkifRiFPsLrDJzB8yY\"",
    "mtime": "2023-08-16T17:44:17.842Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.f20e6c6c.js"
  },
  "/_nuxt/profile.f20e6c6c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"841-v9XoaGpG6vp2sX6kAxx4yUlqLmg\"",
    "mtime": "2023-08-16T17:44:18.906Z",
    "size": 2113,
    "path": "../public/_nuxt/profile.f20e6c6c.js.br"
  },
  "/_nuxt/profile.f20e6c6c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a5-9FbogSREMxn7T4kY7m5Q5Z28G4Q\"",
    "mtime": "2023-08-16T17:44:18.900Z",
    "size": 2469,
    "path": "../public/_nuxt/profile.f20e6c6c.js.gz"
  },
  "/_nuxt/register.65323a54.js": {
    "type": "application/javascript",
    "etag": "\"11bd-yWNK4vjJHItef8n07BlvmluGyOY\"",
    "mtime": "2023-08-16T17:44:17.841Z",
    "size": 4541,
    "path": "../public/_nuxt/register.65323a54.js"
  },
  "/_nuxt/register.65323a54.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bd-nNY1BZuWGweV+NLlAO7Op+y4EGc\"",
    "mtime": "2023-08-16T17:44:18.913Z",
    "size": 1469,
    "path": "../public/_nuxt/register.65323a54.js.br"
  },
  "/_nuxt/register.65323a54.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fc-g/iWPSZpJ6XmHLDx+T3f0mo7oi0\"",
    "mtime": "2023-08-16T17:44:18.907Z",
    "size": 1788,
    "path": "../public/_nuxt/register.65323a54.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-16T17:44:17.841Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-16T17:44:18.917Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-16T17:44:18.914Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-16T17:44:17.840Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-16T17:44:18.920Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-16T17:44:18.917Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-16T17:44:17.839Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-16T17:44:17.836Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-16T17:44:17.895Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-16T17:44:17.895Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-08-16T17:44:17.894Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-16T17:44:17.893Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-16T17:44:17.892Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-16T17:44:17.892Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-16T17:44:18.925Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-16T17:44:18.922Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
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
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
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

const _l1C4Nl = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx;
  const ipxOptions = {
    ...opts || {},
    // TODO: Switch to storage API when ipx supports it
    dir: fileURLToPath(new URL(opts.dir, globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.node.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.node.req, event.node.res);
  });
});

const _lazy_KJmAMi = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_KJmAMi, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _l1C4Nl, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_KJmAMi, lazy: true, middleware: false, method: undefined }
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
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
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
  h3App.use(config.app.baseURL, router);
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

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
