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
    "mtime": "2023-12-29T10:16:15.331Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-12-29T10:16:15.332Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-12-29T10:16:15.332Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-12-29T10:16:15.323Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-12-29T10:16:15.321Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2023-12-29T10:16:15.321Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2023-12-29T10:16:15.364Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-LE+S+BwO6spfkzk2fxkvXiZn5T8\"",
    "mtime": "2023-12-29T10:16:15.337Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/BasketInfo.c27a044f.js": {
    "type": "application/javascript",
    "etag": "\"ae7-H5AkXJFu4F8r6wm7O09STmJOqtw\"",
    "mtime": "2023-12-29T10:16:15.320Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.c27a044f.js"
  },
  "/_nuxt/BasketInfo.c27a044f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"441-fUhG65wmcZPtHFhkrEYrEaTuajQ\"",
    "mtime": "2023-12-29T10:16:15.369Z",
    "size": 1089,
    "path": "../public/_nuxt/BasketInfo.c27a044f.js.br"
  },
  "/_nuxt/BasketInfo.c27a044f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fd-8bnWYBNOwO416wzMH375h4WgiTY\"",
    "mtime": "2023-12-29T10:16:15.365Z",
    "size": 1277,
    "path": "../public/_nuxt/BasketInfo.c27a044f.js.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-12-29T10:16:15.320Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-12-29T10:16:15.389Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-12-29T10:16:15.370Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.3de2a786.js": {
    "type": "application/javascript",
    "etag": "\"15bf-fPpM73SV+x6oPqPrxy9djiWQWYc\"",
    "mtime": "2023-12-29T10:16:15.319Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.3de2a786.js"
  },
  "/_nuxt/CatalogProduct.3de2a786.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"787-Ynuhkpw4aAVuhhwR9AfXkHxSlGc\"",
    "mtime": "2023-12-29T10:16:15.397Z",
    "size": 1927,
    "path": "../public/_nuxt/CatalogProduct.3de2a786.js.br"
  },
  "/_nuxt/CatalogProduct.3de2a786.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-WkxHDyROkNG7ioP3t2LZ4mlmgWY\"",
    "mtime": "2023-12-29T10:16:15.390Z",
    "size": 2185,
    "path": "../public/_nuxt/CatalogProduct.3de2a786.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-12-29T10:16:15.303Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-12-29T10:16:15.415Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-12-29T10:16:15.398Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.887b64d0.js": {
    "type": "application/javascript",
    "etag": "\"e2e-pf55WtDEJ6b8mabtvTQm7DB0kvo\"",
    "mtime": "2023-12-29T10:16:15.303Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.887b64d0.js"
  },
  "/_nuxt/FavoriteComp.887b64d0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40e-eL6cMtsDJBU3UlskD+Agu35fPaI\"",
    "mtime": "2023-12-29T10:16:15.422Z",
    "size": 1038,
    "path": "../public/_nuxt/FavoriteComp.887b64d0.js.br"
  },
  "/_nuxt/FavoriteComp.887b64d0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d0-1wepfGiJT2CBVxMgW3n/Li06KOs\"",
    "mtime": "2023-12-29T10:16:15.416Z",
    "size": 1232,
    "path": "../public/_nuxt/FavoriteComp.887b64d0.js.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-12-29T10:16:15.302Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-12-29T10:16:15.428Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-12-29T10:16:15.423Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.c7b8c7b7.js": {
    "type": "application/javascript",
    "etag": "\"783-aeWcj4TNpAVzndW//07zj0dFpmw\"",
    "mtime": "2023-12-29T10:16:15.302Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.c7b8c7b7.js"
  },
  "/_nuxt/FavoriteComp.c7b8c7b7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28f-3Y09cRXChPN7wWlefAkT9h+1kTw\"",
    "mtime": "2023-12-29T10:16:15.434Z",
    "size": 655,
    "path": "../public/_nuxt/FavoriteComp.c7b8c7b7.js.br"
  },
  "/_nuxt/FavoriteComp.c7b8c7b7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-IexhMViqBvxUQueAz3DQ2ByYEGg\"",
    "mtime": "2023-12-29T10:16:15.429Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.c7b8c7b7.js.gz"
  },
  "/_nuxt/ImageForm.490d26ab.js": {
    "type": "application/javascript",
    "etag": "\"1ac-NvOBtUaXsDolZPTJGVBoXgrUUDs\"",
    "mtime": "2023-12-29T10:16:15.301Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.490d26ab.js"
  },
  "/_nuxt/LoadingComp.b898c078.js": {
    "type": "application/javascript",
    "etag": "\"1fe-YdwyI5x1a9o18C2cWSuXbHSWl/g\"",
    "mtime": "2023-12-29T10:16:15.301Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.b898c078.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-12-29T10:16:15.300Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-12-29T10:16:15.300Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-12-29T10:16:15.438Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-12-29T10:16:15.436Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.b85a001d.js": {
    "type": "application/javascript",
    "etag": "\"431-vzk0sl2Ev6HiQPZi/l+udhwxLr8\"",
    "mtime": "2023-12-29T10:16:15.299Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.b85a001d.js"
  },
  "/_nuxt/OrderProductList.b85a001d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20e-86hO3bej+KHKJero1NyhbaOSjzk\"",
    "mtime": "2023-12-29T10:16:15.442Z",
    "size": 526,
    "path": "../public/_nuxt/OrderProductList.b85a001d.js.br"
  },
  "/_nuxt/OrderProductList.b85a001d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-CAPqgKK4spSAMAAAk91N8Egm+sw\"",
    "mtime": "2023-12-29T10:16:15.439Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.b85a001d.js.gz"
  },
  "/_nuxt/UserBasket.260122c5.js": {
    "type": "application/javascript",
    "etag": "\"1897-qJ2SKCZvSbGPLYtSAx0SZ3zO1AE\"",
    "mtime": "2023-12-29T10:16:15.299Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.260122c5.js"
  },
  "/_nuxt/UserBasket.260122c5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"91c-U+lsA+PigYHtvJPMOZZuIy9VhVo\"",
    "mtime": "2023-12-29T10:16:15.451Z",
    "size": 2332,
    "path": "../public/_nuxt/UserBasket.260122c5.js.br"
  },
  "/_nuxt/UserBasket.260122c5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a71-qrF11/o5Yng9RIz0Gha3ka5ozlI\"",
    "mtime": "2023-12-29T10:16:15.443Z",
    "size": 2673,
    "path": "../public/_nuxt/UserBasket.260122c5.js.gz"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2023-12-29T10:16:15.298Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2023-12-29T10:16:15.478Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-WJYELguUqmb4UcsCrbAABZoRm8s\"",
    "mtime": "2023-12-29T10:16:15.452Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-12-29T10:16:15.298Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-12-29T10:16:15.494Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-12-29T10:16:15.479Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-12-29T10:16:15.297Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.ab4ff303.js": {
    "type": "application/javascript",
    "etag": "\"531-nUayoGV8Cn4qzwErJ2re5nfjFdk\"",
    "mtime": "2023-12-29T10:16:15.297Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.ab4ff303.js"
  },
  "/_nuxt/_id_.ab4ff303.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-u9rRAMsN4beNUrwXjqbJ9ClzCa4\"",
    "mtime": "2023-12-29T10:16:15.499Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.ab4ff303.js.br"
  },
  "/_nuxt/_id_.ab4ff303.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-PrDbCeFdS4E8XuHuQno63dQhuPo\"",
    "mtime": "2023-12-29T10:16:15.496Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.ab4ff303.js.gz"
  },
  "/_nuxt/_id_.e8fa82c2.js": {
    "type": "application/javascript",
    "etag": "\"12e4-8eCAYm195aHviRMio/cMvfV550o\"",
    "mtime": "2023-12-29T10:16:15.296Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.e8fa82c2.js"
  },
  "/_nuxt/_id_.e8fa82c2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75f-FroksUrMbUDpnPZ5SygtzExfo4s\"",
    "mtime": "2023-12-29T10:16:15.506Z",
    "size": 1887,
    "path": "../public/_nuxt/_id_.e8fa82c2.js.br"
  },
  "/_nuxt/_id_.e8fa82c2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85d-IjRlvk5Z2wBaBlnZVxr8Ne/mv34\"",
    "mtime": "2023-12-29T10:16:15.500Z",
    "size": 2141,
    "path": "../public/_nuxt/_id_.e8fa82c2.js.gz"
  },
  "/_nuxt/about_us.aee918ed.js": {
    "type": "application/javascript",
    "etag": "\"819-kC3mfugjjdCxUK49hGKWUM7ReSA\"",
    "mtime": "2023-12-29T10:16:15.296Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.aee918ed.js"
  },
  "/_nuxt/about_us.aee918ed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3b4-Gq1f118LqGx9AmLA0QLIBLyhvYY\"",
    "mtime": "2023-12-29T10:16:15.511Z",
    "size": 948,
    "path": "../public/_nuxt/about_us.aee918ed.js.br"
  },
  "/_nuxt/about_us.aee918ed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"46f-15l53+YdjR4Kc03bVBAaVWtSKdU\"",
    "mtime": "2023-12-29T10:16:15.507Z",
    "size": 1135,
    "path": "../public/_nuxt/about_us.aee918ed.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2023-12-29T10:16:15.295Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-12-29T10:16:15.295Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-12-29T10:16:15.519Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-12-29T10:16:15.512Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.fc9706c3.js": {
    "type": "application/javascript",
    "etag": "\"2b6-qu8GlPsKyqtmy+Q3EsqNje+yVuc\"",
    "mtime": "2023-12-29T10:16:15.294Z",
    "size": 694,
    "path": "../public/_nuxt/basket.fc9706c3.js"
  },
  "/_nuxt/catalog.0e402fe5.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-BPLxU2l2qWxhYjmMS5ZNTU7tUJk\"",
    "mtime": "2023-12-29T10:16:15.294Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.0e402fe5.js"
  },
  "/_nuxt/catalog.0e402fe5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"922-VFfIBfvhWnfN1Ys9O4BIMTjSuA8\"",
    "mtime": "2023-12-29T10:16:15.528Z",
    "size": 2338,
    "path": "../public/_nuxt/catalog.0e402fe5.js.br"
  },
  "/_nuxt/catalog.0e402fe5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9a-zFUDSgs6b9YtbdaFvlsdE7QBLA4\"",
    "mtime": "2023-12-29T10:16:15.520Z",
    "size": 2714,
    "path": "../public/_nuxt/catalog.0e402fe5.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-12-29T10:16:15.293Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-12-29T10:16:15.538Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-12-29T10:16:15.529Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2023-12-29T10:16:15.292Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2023-12-29T10:16:15.659Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-1GLczaEuyyUl480772Fwwqm+GtA\"",
    "mtime": "2023-12-29T10:16:15.542Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.54f269f6.js": {
    "type": "application/javascript",
    "etag": "\"16616-tV/emxmU4wmZj2VmiCuaJK3WlLo\"",
    "mtime": "2023-12-29T10:16:15.291Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.54f269f6.js"
  },
  "/_nuxt/checkout.54f269f6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57c1-l+UtJJtLkpnUli+T3KL9k6y8PUA\"",
    "mtime": "2023-12-29T10:16:15.766Z",
    "size": 22465,
    "path": "../public/_nuxt/checkout.54f269f6.js.br"
  },
  "/_nuxt/checkout.54f269f6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6600-Cp6zVK73B280IXrAp461hEKEqxE\"",
    "mtime": "2023-12-29T10:16:15.662Z",
    "size": 26112,
    "path": "../public/_nuxt/checkout.54f269f6.js.gz"
  },
  "/_nuxt/entry.0ea6b2bb.js": {
    "type": "application/javascript",
    "etag": "\"374d2-Td8WsEhlHfcS3fEEXu0VxnNNm4s\"",
    "mtime": "2023-12-29T10:16:15.290Z",
    "size": 226514,
    "path": "../public/_nuxt/entry.0ea6b2bb.js"
  },
  "/_nuxt/entry.0ea6b2bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12753-NafPWCDLukVyuhwSV/T/GWvtEWQ\"",
    "mtime": "2023-12-29T10:16:16.146Z",
    "size": 75603,
    "path": "../public/_nuxt/entry.0ea6b2bb.js.br"
  },
  "/_nuxt/entry.0ea6b2bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14c39-TR55THQ61a97g2FJxtt4a7rIH1Y\"",
    "mtime": "2023-12-29T10:16:15.777Z",
    "size": 85049,
    "path": "../public/_nuxt/entry.0ea6b2bb.js.gz"
  },
  "/_nuxt/entry.caa016ae.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-DgjB906NiVYEP5fBnQ7kLLNVJ9I\"",
    "mtime": "2023-12-29T10:16:15.287Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.caa016ae.css"
  },
  "/_nuxt/entry.caa016ae.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a57-W7kU6+5AHkK+7GZTsblbjr388Mg\"",
    "mtime": "2023-12-29T10:16:16.158Z",
    "size": 2647,
    "path": "../public/_nuxt/entry.caa016ae.css.br"
  },
  "/_nuxt/entry.caa016ae.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bed-gC061S6jHFEsaAhzDDRS8MJ3Tmw\"",
    "mtime": "2023-12-29T10:16:16.147Z",
    "size": 3053,
    "path": "../public/_nuxt/entry.caa016ae.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-12-29T10:16:15.286Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-12-29T10:16:16.164Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-12-29T10:16:16.159Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.7cb86133.js": {
    "type": "application/javascript",
    "etag": "\"8a8-B+pHgjv5UaB1B9+/beee120uVMo\"",
    "mtime": "2023-12-29T10:16:15.286Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.7cb86133.js"
  },
  "/_nuxt/error-404.7cb86133.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-PitMMe0bv7lM454uan59ZDQZnqQ\"",
    "mtime": "2023-12-29T10:16:16.168Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.7cb86133.js.br"
  },
  "/_nuxt/error-404.7cb86133.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-jWOhZEu3/i03DUJKd/mbS/JnDVU\"",
    "mtime": "2023-12-29T10:16:16.165Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.7cb86133.js.gz"
  },
  "/_nuxt/error-500.9a5145c8.js": {
    "type": "application/javascript",
    "etag": "\"756-d6SVATQWDLd1JIU1f97JumcSHI8\"",
    "mtime": "2023-12-29T10:16:15.285Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.9a5145c8.js"
  },
  "/_nuxt/error-500.9a5145c8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-vf/feM0S8OVVWgsjJZ7h2kM61bw\"",
    "mtime": "2023-12-29T10:16:16.172Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.9a5145c8.js.br"
  },
  "/_nuxt/error-500.9a5145c8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-blNyB/LadHBXPE3PE1eGQLkrN68\"",
    "mtime": "2023-12-29T10:16:16.169Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.9a5145c8.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-12-29T10:16:15.285Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-12-29T10:16:16.176Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-12-29T10:16:16.173Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.61e2dae9.js": {
    "type": "application/javascript",
    "etag": "\"45e-JiBfg4Syl3qlh6uQYF6wsdPkCfs\"",
    "mtime": "2023-12-29T10:16:15.284Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.61e2dae9.js"
  },
  "/_nuxt/error-component.61e2dae9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-qDi26YMdz0VtmL2JFGZredFUR88\"",
    "mtime": "2023-12-29T10:16:16.179Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.61e2dae9.js.br"
  },
  "/_nuxt/error-component.61e2dae9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-g6B0BmKypNN2D5uap6ukZvsmkfg\"",
    "mtime": "2023-12-29T10:16:16.177Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.61e2dae9.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2023-12-29T10:16:15.283Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2023-12-29T10:16:16.187Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-d6UjocNqp2VUIFEp0Ni0e30HvBg\"",
    "mtime": "2023-12-29T10:16:16.180Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/favorite.4b5d075e.js": {
    "type": "application/javascript",
    "etag": "\"906-YRL3dxqnHltSafiq0OjnHWfJ+Ps\"",
    "mtime": "2023-12-29T10:16:15.283Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.4b5d075e.js"
  },
  "/_nuxt/favorite.4b5d075e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"413-QoEJUPGlW0Dhb+SIv5fEB7+GUmo\"",
    "mtime": "2023-12-29T10:16:16.192Z",
    "size": 1043,
    "path": "../public/_nuxt/favorite.4b5d075e.js.br"
  },
  "/_nuxt/favorite.4b5d075e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b2-nwdChF+p9uvjmkVjTv4fnw93zZw\"",
    "mtime": "2023-12-29T10:16:16.188Z",
    "size": 1202,
    "path": "../public/_nuxt/favorite.4b5d075e.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-12-29T10:16:15.282Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-12-29T10:16:15.282Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.05af8825.js": {
    "type": "application/javascript",
    "etag": "\"e1-X8P9Ijnki4YZO88K4ljqQKrdgrk\"",
    "mtime": "2023-12-29T10:16:15.281Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.05af8825.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-12-29T10:16:15.281Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-12-29T10:16:16.198Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-12-29T10:16:16.194Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.838b2da7.js": {
    "type": "application/javascript",
    "etag": "\"17bfc-6z7Vhkgw252dltSLc847ghycylE\"",
    "mtime": "2023-12-29T10:16:15.280Z",
    "size": 97276,
    "path": "../public/_nuxt/index.838b2da7.js"
  },
  "/_nuxt/index.838b2da7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"672f-WCBN//0GZjvJx1NEno4SUSTtILE\"",
    "mtime": "2023-12-29T10:16:16.318Z",
    "size": 26415,
    "path": "../public/_nuxt/index.838b2da7.js.br"
  },
  "/_nuxt/index.838b2da7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758f-fe4KH87fYNGaiAyw5z1Kmb4gXJc\"",
    "mtime": "2023-12-29T10:16:16.202Z",
    "size": 30095,
    "path": "../public/_nuxt/index.838b2da7.js.gz"
  },
  "/_nuxt/index.8fec29f6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-9XuHJhiZfS5w17IO6i5YMxHvOt4\"",
    "mtime": "2023-12-29T10:16:15.279Z",
    "size": 22887,
    "path": "../public/_nuxt/index.8fec29f6.css"
  },
  "/_nuxt/index.8fec29f6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12db-4b0bfHKzyviSWMY4ORQ7ymz6Ccc\"",
    "mtime": "2023-12-29T10:16:16.346Z",
    "size": 4827,
    "path": "../public/_nuxt/index.8fec29f6.css.br"
  },
  "/_nuxt/index.8fec29f6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1652-RJwtHx+ANKKSjarSKQpE0MMBnvA\"",
    "mtime": "2023-12-29T10:16:16.320Z",
    "size": 5714,
    "path": "../public/_nuxt/index.8fec29f6.css.gz"
  },
  "/_nuxt/index.ac61ee8f.js": {
    "type": "application/javascript",
    "etag": "\"3abf-cdHpICE+aSIU++c7QBY1lj8XrlI\"",
    "mtime": "2023-12-29T10:16:15.279Z",
    "size": 15039,
    "path": "../public/_nuxt/index.ac61ee8f.js"
  },
  "/_nuxt/index.ac61ee8f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12e9-vM7ecFsq/J9aNolpltEvGwYXVTk\"",
    "mtime": "2023-12-29T10:16:16.364Z",
    "size": 4841,
    "path": "../public/_nuxt/index.ac61ee8f.js.br"
  },
  "/_nuxt/index.ac61ee8f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-bLnwryPhuInPFDZDjIMY8q4OFy8\"",
    "mtime": "2023-12-29T10:16:16.347Z",
    "size": 5362,
    "path": "../public/_nuxt/index.ac61ee8f.js.gz"
  },
  "/_nuxt/index.ad57d02b.js": {
    "type": "application/javascript",
    "etag": "\"649-PaZyOO+AV46Hh1SRzHzxjc4qYGE\"",
    "mtime": "2023-12-29T10:16:15.278Z",
    "size": 1609,
    "path": "../public/_nuxt/index.ad57d02b.js"
  },
  "/_nuxt/index.ad57d02b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"32a-IHrIP6x1obkn9CYoD5EsvXN8gF0\"",
    "mtime": "2023-12-29T10:16:16.368Z",
    "size": 810,
    "path": "../public/_nuxt/index.ad57d02b.js.br"
  },
  "/_nuxt/index.ad57d02b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-9BEmx2hW1DXM0RKIIcIJ30M09XM\"",
    "mtime": "2023-12-29T10:16:16.365Z",
    "size": 955,
    "path": "../public/_nuxt/index.ad57d02b.js.gz"
  },
  "/_nuxt/isAuth.4508a9d9.js": {
    "type": "application/javascript",
    "etag": "\"275-BIjHvwQSIhGUBkdQIAadNQ+Mt+Y\"",
    "mtime": "2023-12-29T10:16:15.278Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.4508a9d9.js"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2023-12-29T10:16:15.277Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2023-12-29T10:16:16.372Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-BSIWOpRnxjt4LrLxZNusX10MQ/Q\"",
    "mtime": "2023-12-29T10:16:16.369Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.f89f9b41.js": {
    "type": "application/javascript",
    "etag": "\"b8e-skrZdfIyFtHrDx0IFHROSAJfV38\"",
    "mtime": "2023-12-29T10:16:15.276Z",
    "size": 2958,
    "path": "../public/_nuxt/login.f89f9b41.js"
  },
  "/_nuxt/login.f89f9b41.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4c1-fD4DxwXMFE7EvMrNg/NJ5uWqf2s\"",
    "mtime": "2023-12-29T10:16:16.378Z",
    "size": 1217,
    "path": "../public/_nuxt/login.f89f9b41.js.br"
  },
  "/_nuxt/login.f89f9b41.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a6-LUtV1vX8Q00Ar7ZTp/EsSrnIhpA\"",
    "mtime": "2023-12-29T10:16:16.373Z",
    "size": 1446,
    "path": "../public/_nuxt/login.f89f9b41.js.gz"
  },
  "/_nuxt/newsList.629d4c79.js": {
    "type": "application/javascript",
    "etag": "\"e6-4Yi9BzOyX5+9NWCKIhCaNnfDJT0\"",
    "mtime": "2023-12-29T10:16:15.276Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.629d4c79.js"
  },
  "/_nuxt/orders.22912e12.js": {
    "type": "application/javascript",
    "etag": "\"2595-aVqSz8vi+ThvDq06xqK/Bo/mz8Y\"",
    "mtime": "2023-12-29T10:16:15.275Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.22912e12.js"
  },
  "/_nuxt/orders.22912e12.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b0b-VIbJXG7wDPSI71y/8Qd92KQLnJI\"",
    "mtime": "2023-12-29T10:16:16.390Z",
    "size": 2827,
    "path": "../public/_nuxt/orders.22912e12.js.br"
  },
  "/_nuxt/orders.22912e12.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfd-VHcoy98SLeCIqlwuIXJ8jnh0o0c\"",
    "mtime": "2023-12-29T10:16:16.379Z",
    "size": 3325,
    "path": "../public/_nuxt/orders.22912e12.js.gz"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2023-12-29T10:16:15.274Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2023-12-29T10:16:16.400Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-lKpfiM20kgjPtEexL8DqS5VOzRE\"",
    "mtime": "2023-12-29T10:16:16.391Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-12-29T10:16:15.274Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-12-29T10:16:16.439Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-12-29T10:16:16.401Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.78362606.js": {
    "type": "application/javascript",
    "etag": "\"169d-zjP4im5TjmewZUu/kpV5JHqxnzk\"",
    "mtime": "2023-12-29T10:16:15.273Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.78362606.js"
  },
  "/_nuxt/profile.78362606.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83a-ehbUBrBrjVuMoOCePHNUbU4xSI0\"",
    "mtime": "2023-12-29T10:16:16.448Z",
    "size": 2106,
    "path": "../public/_nuxt/profile.78362606.js.br"
  },
  "/_nuxt/profile.78362606.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a8-1s1ZrnfnV6DBim1CLj7cr3aKJ2E\"",
    "mtime": "2023-12-29T10:16:16.440Z",
    "size": 2472,
    "path": "../public/_nuxt/profile.78362606.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-12-29T10:16:15.272Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-12-29T10:16:16.454Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-12-29T10:16:16.449Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.e8232a9e.js": {
    "type": "application/javascript",
    "etag": "\"11bd-007mITsKPqjT6eMAPeUQ39/i2v4\"",
    "mtime": "2023-12-29T10:16:15.272Z",
    "size": 4541,
    "path": "../public/_nuxt/register.e8232a9e.js"
  },
  "/_nuxt/register.e8232a9e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bc-/5LEmTZk8qOFJOP61IEPBLFnq00\"",
    "mtime": "2023-12-29T10:16:16.461Z",
    "size": 1468,
    "path": "../public/_nuxt/register.e8232a9e.js.br"
  },
  "/_nuxt/register.e8232a9e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f4-BoAgppk4KjFYWYunRs0JsM/GgiE\"",
    "mtime": "2023-12-29T10:16:16.455Z",
    "size": 1780,
    "path": "../public/_nuxt/register.e8232a9e.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-29T10:16:15.271Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-29T10:16:16.466Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-29T10:16:16.462Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-12-29T10:16:15.270Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-12-29T10:16:15.268Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-12-29T10:16:15.329Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-12-29T10:16:15.328Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3013e-iL+bzZJH1+Y2zXQuCZPjzQKlbMk\"",
    "mtime": "2023-12-29T10:16:15.328Z",
    "size": 196926,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-12-29T10:16:15.326Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-12-29T10:16:15.326Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-29T10:16:15.325Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-29T10:16:16.471Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-29T10:16:16.469Z",
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
