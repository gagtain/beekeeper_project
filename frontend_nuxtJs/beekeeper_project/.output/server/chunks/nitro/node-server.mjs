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
    "mtime": "2023-10-11T07:48:07.975Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-10-11T07:48:08.009Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-10-11T07:48:07.996Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-10-11T07:48:07.930Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-10-11T07:48:07.928Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.5e4c3203.js": {
    "type": "application/javascript",
    "etag": "\"ae1-aenodpk5Yvf3QWKUEm1WFhStuVA\"",
    "mtime": "2023-10-11T07:48:07.927Z",
    "size": 2785,
    "path": "../public/_nuxt/BasketInfo.5e4c3203.js"
  },
  "/_nuxt/BasketInfo.5e4c3203.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43c-0bu/4t3j80GtFlMc7bfZgm1zu4E\"",
    "mtime": "2023-10-11T07:48:08.025Z",
    "size": 1084,
    "path": "../public/_nuxt/BasketInfo.5e4c3203.js.br"
  },
  "/_nuxt/BasketInfo.5e4c3203.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f8-7Xm3nUZrn3xP0XDTwf9d91cWVfA\"",
    "mtime": "2023-10-11T07:48:08.013Z",
    "size": 1272,
    "path": "../public/_nuxt/BasketInfo.5e4c3203.js.gz"
  },
  "/_nuxt/BasketInfo.92fc7163.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-xcGl1UY1o4tG6/AGuuATcPnB2K0\"",
    "mtime": "2023-10-11T07:48:07.927Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css"
  },
  "/_nuxt/BasketInfo.92fc7163.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f1-eRlFh8sgvA807OlTvBhBFm4yQxY\"",
    "mtime": "2023-10-11T07:48:08.068Z",
    "size": 1777,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css.br"
  },
  "/_nuxt/BasketInfo.92fc7163.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-4g+WXtKYKWTHrtegeAHa2sGv8qc\"",
    "mtime": "2023-10-11T07:48:08.026Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-10-11T07:48:07.926Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-10-11T07:48:08.094Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-10-11T07:48:08.069Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.6ef7ac72.js": {
    "type": "application/javascript",
    "etag": "\"15bf-dF67ERC66Mm1jlvU/btV5xoycnE\"",
    "mtime": "2023-10-11T07:48:07.926Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.6ef7ac72.js"
  },
  "/_nuxt/CatalogProduct.6ef7ac72.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"78c-pH9IjH6zkZpHq6PxQ0H3q2DctEQ\"",
    "mtime": "2023-10-11T07:48:08.105Z",
    "size": 1932,
    "path": "../public/_nuxt/CatalogProduct.6ef7ac72.js.br"
  },
  "/_nuxt/CatalogProduct.6ef7ac72.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88a-PnK1SCihNcDpNGj787EJjSWEne0\"",
    "mtime": "2023-10-11T07:48:08.095Z",
    "size": 2186,
    "path": "../public/_nuxt/CatalogProduct.6ef7ac72.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-10-11T07:48:07.925Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-10-11T07:48:08.122Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-10-11T07:48:08.106Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-10-11T07:48:07.924Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-10-11T07:48:08.130Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-10-11T07:48:08.123Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.b33af3c0.js": {
    "type": "application/javascript",
    "etag": "\"783-sqXahVAY4ORJVSWNRN4pZc5JiOU\"",
    "mtime": "2023-10-11T07:48:07.924Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.b33af3c0.js"
  },
  "/_nuxt/FavoriteComp.b33af3c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28e-9DXHyBB+Birnovf7ygzVmXbwKoQ\"",
    "mtime": "2023-10-11T07:48:08.135Z",
    "size": 654,
    "path": "../public/_nuxt/FavoriteComp.b33af3c0.js.br"
  },
  "/_nuxt/FavoriteComp.b33af3c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f8-nfaoLXMYrVjy/XyjiDLw5LNIM98\"",
    "mtime": "2023-10-11T07:48:08.131Z",
    "size": 760,
    "path": "../public/_nuxt/FavoriteComp.b33af3c0.js.gz"
  },
  "/_nuxt/FavoriteComp.b7b2b7d5.js": {
    "type": "application/javascript",
    "etag": "\"e2e-NBiwWSSt9JOm8F2Y4R5fN4j4cmU\"",
    "mtime": "2023-10-11T07:48:07.923Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.b7b2b7d5.js"
  },
  "/_nuxt/FavoriteComp.b7b2b7d5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40f-J1IqB8eBKwaBII6Tw+T6TXLTIrE\"",
    "mtime": "2023-10-11T07:48:08.141Z",
    "size": 1039,
    "path": "../public/_nuxt/FavoriteComp.b7b2b7d5.js.br"
  },
  "/_nuxt/FavoriteComp.b7b2b7d5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-FQBDxjtdmep3ZCulrPWYXV+Q5e4\"",
    "mtime": "2023-10-11T07:48:08.135Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.b7b2b7d5.js.gz"
  },
  "/_nuxt/ImageForm.5529e16c.js": {
    "type": "application/javascript",
    "etag": "\"1ac-Q2pY5WeHC+cjJ/nGefG86vrPAFA\"",
    "mtime": "2023-10-11T07:48:07.923Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.5529e16c.js"
  },
  "/_nuxt/LoadingComp.49fbad95.js": {
    "type": "application/javascript",
    "etag": "\"1fe-YGJi9tlZ5R0JeZcdTbTirpqXCNg\"",
    "mtime": "2023-10-11T07:48:07.922Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.49fbad95.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-10-11T07:48:07.922Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-10-11T07:48:07.921Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-10-11T07:48:08.144Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-10-11T07:48:08.142Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.54cce0bf.js": {
    "type": "application/javascript",
    "etag": "\"431-FCjWzghgHyFvVJ2ORic7MvhlD+M\"",
    "mtime": "2023-10-11T07:48:07.921Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.54cce0bf.js"
  },
  "/_nuxt/OrderProductList.54cce0bf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20e-o65JohwqQMTS7v/sOVd5qtIyxO8\"",
    "mtime": "2023-10-11T07:48:08.147Z",
    "size": 526,
    "path": "../public/_nuxt/OrderProductList.54cce0bf.js.br"
  },
  "/_nuxt/OrderProductList.54cce0bf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-u1yzraU+Xyrljyff3slzP1rPtNs\"",
    "mtime": "2023-10-11T07:48:08.145Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.54cce0bf.js.gz"
  },
  "/_nuxt/UserBasket.67a3a6aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-Q8GJf0KQTKh54MKSM+v2CiInheg\"",
    "mtime": "2023-10-11T07:48:07.920Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css"
  },
  "/_nuxt/UserBasket.67a3a6aa.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c2-zvge28Xb6bbVCi3tE/M9Ab2HozE\"",
    "mtime": "2023-10-11T07:48:08.164Z",
    "size": 1730,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css.br"
  },
  "/_nuxt/UserBasket.67a3a6aa.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-XIijkWBmHba/rqrswkxzR0W0+TI\"",
    "mtime": "2023-10-11T07:48:08.148Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css.gz"
  },
  "/_nuxt/UserBasket.794d4207.js": {
    "type": "application/javascript",
    "etag": "\"188f-eEBx8khuVltEYfeasR40X+7WDdk\"",
    "mtime": "2023-10-11T07:48:07.919Z",
    "size": 6287,
    "path": "../public/_nuxt/UserBasket.794d4207.js"
  },
  "/_nuxt/UserBasket.794d4207.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"914-Vki4J7954nqDN34mrfcBTakqzP4\"",
    "mtime": "2023-10-11T07:48:08.172Z",
    "size": 2324,
    "path": "../public/_nuxt/UserBasket.794d4207.js.br"
  },
  "/_nuxt/UserBasket.794d4207.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a6c-lWJsMKs79lgdX5QiD5w2am37DrE\"",
    "mtime": "2023-10-11T07:48:08.165Z",
    "size": 2668,
    "path": "../public/_nuxt/UserBasket.794d4207.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-10-11T07:48:07.918Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-10-11T07:48:08.190Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-10-11T07:48:08.173Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-10-11T07:48:07.918Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.66083480.js": {
    "type": "application/javascript",
    "etag": "\"531-4/32d9ZYMuD/G9lqs5361MQGI6Y\"",
    "mtime": "2023-10-11T07:48:07.917Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.66083480.js"
  },
  "/_nuxt/_id_.66083480.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a2-PDR7CQwtQzonxdWisbnHZUWGd00\"",
    "mtime": "2023-10-11T07:48:08.193Z",
    "size": 674,
    "path": "../public/_nuxt/_id_.66083480.js.br"
  },
  "/_nuxt/_id_.66083480.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-O3QeYCXCoLkB5g6koYIgqcFxHrM\"",
    "mtime": "2023-10-11T07:48:08.191Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.66083480.js.gz"
  },
  "/_nuxt/_id_.a1a7fa47.js": {
    "type": "application/javascript",
    "etag": "\"12e4-SwDf7MS/7G+8r90R/QrA2s7BWBQ\"",
    "mtime": "2023-10-11T07:48:07.916Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.a1a7fa47.js"
  },
  "/_nuxt/_id_.a1a7fa47.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"761-C7wK3azr4yDZ9LrRoXpek/1EwbI\"",
    "mtime": "2023-10-11T07:48:08.200Z",
    "size": 1889,
    "path": "../public/_nuxt/_id_.a1a7fa47.js.br"
  },
  "/_nuxt/_id_.a1a7fa47.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85f-snOWkyH9PBSvQzROmn7sDgtA2Xw\"",
    "mtime": "2023-10-11T07:48:08.194Z",
    "size": 2143,
    "path": "../public/_nuxt/_id_.a1a7fa47.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2023-10-11T07:48:07.915Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/about_us.d40a9ede.js": {
    "type": "application/javascript",
    "etag": "\"687-DDVwxKboIKKJZq2IxbWXz22ra+U\"",
    "mtime": "2023-10-11T07:48:07.915Z",
    "size": 1671,
    "path": "../public/_nuxt/about_us.d40a9ede.js"
  },
  "/_nuxt/about_us.d40a9ede.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2dd-F1A5bEbqL5QGEqlqzc4tbqW/FwM\"",
    "mtime": "2023-10-11T07:48:08.204Z",
    "size": 733,
    "path": "../public/_nuxt/about_us.d40a9ede.js.br"
  },
  "/_nuxt/about_us.d40a9ede.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"39c-TTkqxIZ609IQdXEbDI81NjjvOhg\"",
    "mtime": "2023-10-11T07:48:08.201Z",
    "size": 924,
    "path": "../public/_nuxt/about_us.d40a9ede.js.gz"
  },
  "/_nuxt/basket.01438ea7.js": {
    "type": "application/javascript",
    "etag": "\"2b6-bVvjksg9STFv2b4j3dEEBUbkWIM\"",
    "mtime": "2023-10-11T07:48:07.914Z",
    "size": 694,
    "path": "../public/_nuxt/basket.01438ea7.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-10-11T07:48:07.914Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-10-11T07:48:08.214Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-10-11T07:48:08.207Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-10-11T07:48:07.913Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-10-11T07:48:08.222Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-10-11T07:48:08.214Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/catalog.fcb02468.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-pmUloRBKIq/EBGbI1GKZGW2tUt0\"",
    "mtime": "2023-10-11T07:48:07.913Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.fcb02468.js"
  },
  "/_nuxt/catalog.fcb02468.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"926-cRXOqAYZepccdENeN5KdERXQJNk\"",
    "mtime": "2023-10-11T07:48:08.231Z",
    "size": 2342,
    "path": "../public/_nuxt/catalog.fcb02468.js.br"
  },
  "/_nuxt/catalog.fcb02468.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-xJTDtdF1jI7EnilOD5z9Hr+9k80\"",
    "mtime": "2023-10-11T07:48:08.223Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.fcb02468.js.gz"
  },
  "/_nuxt/checkout.abef9568.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-jD7DwMMpkbLMnPDb15KllcwGkK8\"",
    "mtime": "2023-10-11T07:48:07.912Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.abef9568.css"
  },
  "/_nuxt/checkout.abef9568.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-iRFE1uESF1sNdOr4P+9A/KYGps8\"",
    "mtime": "2023-10-11T07:48:08.344Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.abef9568.css.br"
  },
  "/_nuxt/checkout.abef9568.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-PmGtKH2/fDx+yO3Q0CQN3guFDj0\"",
    "mtime": "2023-10-11T07:48:08.234Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.abef9568.css.gz"
  },
  "/_nuxt/checkout.e8136ff3.js": {
    "type": "application/javascript",
    "etag": "\"14fc9-HHCPco01IFcwLSklivzDuk/BbTw\"",
    "mtime": "2023-10-11T07:48:07.911Z",
    "size": 85961,
    "path": "../public/_nuxt/checkout.e8136ff3.js"
  },
  "/_nuxt/checkout.e8136ff3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"524a-xWmCsHqPNkGS8tLSoufR1gAbV1U\"",
    "mtime": "2023-10-11T07:48:08.449Z",
    "size": 21066,
    "path": "../public/_nuxt/checkout.e8136ff3.js.br"
  },
  "/_nuxt/checkout.e8136ff3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5f86-iVk6TpVaM5ujUr/ekmOv2UwLYjw\"",
    "mtime": "2023-10-11T07:48:08.347Z",
    "size": 24454,
    "path": "../public/_nuxt/checkout.e8136ff3.js.gz"
  },
  "/_nuxt/entry.99a7ebbe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2919-FYdQtEpaZFYcmpV78RQT1+vpzN4\"",
    "mtime": "2023-10-11T07:48:07.910Z",
    "size": 10521,
    "path": "../public/_nuxt/entry.99a7ebbe.css"
  },
  "/_nuxt/entry.99a7ebbe.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a3b-IeF51+7GaOdDfsTAv2knhKLX140\"",
    "mtime": "2023-10-11T07:48:08.461Z",
    "size": 2619,
    "path": "../public/_nuxt/entry.99a7ebbe.css.br"
  },
  "/_nuxt/entry.99a7ebbe.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bd1-HyagXYmgsJPE+8cLtfyQHB5YYxE\"",
    "mtime": "2023-10-11T07:48:08.450Z",
    "size": 3025,
    "path": "../public/_nuxt/entry.99a7ebbe.css.gz"
  },
  "/_nuxt/entry.d6031038.js": {
    "type": "application/javascript",
    "etag": "\"372cc-knYdj1N4EU1JfUGjYZ2vE23wEq0\"",
    "mtime": "2023-10-11T07:48:07.909Z",
    "size": 225996,
    "path": "../public/_nuxt/entry.d6031038.js"
  },
  "/_nuxt/entry.d6031038.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"125fd-0z2JWtYo0+0UACLIYTL/c11mifA\"",
    "mtime": "2023-10-11T07:48:08.824Z",
    "size": 75261,
    "path": "../public/_nuxt/entry.d6031038.js.br"
  },
  "/_nuxt/entry.d6031038.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14b10-QdvO+FH/xhANVytRmGbx2FLG4p0\"",
    "mtime": "2023-10-11T07:48:08.470Z",
    "size": 84752,
    "path": "../public/_nuxt/entry.d6031038.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-10-11T07:48:07.908Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-10-11T07:48:08.830Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-10-11T07:48:08.825Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.ac464438.js": {
    "type": "application/javascript",
    "etag": "\"8a8-Z4pZgq6DHxywOCvcW0cajgWgV8Q\"",
    "mtime": "2023-10-11T07:48:07.907Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.ac464438.js"
  },
  "/_nuxt/error-404.ac464438.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-rrVMoAA1e9QeZXzlGKS1HUdlipo\"",
    "mtime": "2023-10-11T07:48:08.834Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.ac464438.js.br"
  },
  "/_nuxt/error-404.ac464438.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-k1mSc+UmxPySMF/eciQ91yO0Bk8\"",
    "mtime": "2023-10-11T07:48:08.831Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.ac464438.js.gz"
  },
  "/_nuxt/error-500.6413b23a.js": {
    "type": "application/javascript",
    "etag": "\"756-unq8isHe6u104EwURrvyx0h9kC8\"",
    "mtime": "2023-10-11T07:48:07.907Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.6413b23a.js"
  },
  "/_nuxt/error-500.6413b23a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"349-IspS/6HKpifbiMHRiLLQ12vYibU\"",
    "mtime": "2023-10-11T07:48:08.838Z",
    "size": 841,
    "path": "../public/_nuxt/error-500.6413b23a.js.br"
  },
  "/_nuxt/error-500.6413b23a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-XfxQRKH+hDsALu7nHKHNg1rNwq8\"",
    "mtime": "2023-10-11T07:48:08.835Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.6413b23a.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-10-11T07:48:07.906Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-10-11T07:48:08.842Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-10-11T07:48:08.839Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.435d0fe3.js": {
    "type": "application/javascript",
    "etag": "\"45e-nCqSJAJgZx67VULxRaIcc4GRxCs\"",
    "mtime": "2023-10-11T07:48:07.906Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.435d0fe3.js"
  },
  "/_nuxt/error-component.435d0fe3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-zPaFTop2ZQdVwmRwkV4O/4izJ9A\"",
    "mtime": "2023-10-11T07:48:08.845Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.435d0fe3.js.br"
  },
  "/_nuxt/error-component.435d0fe3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-yEqMZUwSYgdpkVbAEoLHV7IFYLg\"",
    "mtime": "2023-10-11T07:48:08.843Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.435d0fe3.js.gz"
  },
  "/_nuxt/favorite.726c582f.js": {
    "type": "application/javascript",
    "etag": "\"a3f-wZ+w3rRWIZPVDg77BvYvPGsNfeU\"",
    "mtime": "2023-10-11T07:48:07.905Z",
    "size": 2623,
    "path": "../public/_nuxt/favorite.726c582f.js"
  },
  "/_nuxt/favorite.726c582f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"452-kQTC3396ZIU08EF0Asp7HUQnfvI\"",
    "mtime": "2023-10-11T07:48:08.850Z",
    "size": 1106,
    "path": "../public/_nuxt/favorite.726c582f.js.br"
  },
  "/_nuxt/favorite.726c582f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50e-GuutPtcaBDGZ18YBTOroEEbbleQ\"",
    "mtime": "2023-10-11T07:48:08.846Z",
    "size": 1294,
    "path": "../public/_nuxt/favorite.726c582f.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-10-11T07:48:07.905Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-10-11T07:48:08.858Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-10-11T07:48:08.851Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-10-11T07:48:07.904Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-10-11T07:48:07.904Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-10-11T07:48:07.903Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-10-11T07:48:08.863Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-10-11T07:48:08.860Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.2313a567.js": {
    "type": "application/javascript",
    "etag": "\"3abf-fH48ogClg9jSSHkZBaCJ91X8yfA\"",
    "mtime": "2023-10-11T07:48:07.903Z",
    "size": 15039,
    "path": "../public/_nuxt/index.2313a567.js"
  },
  "/_nuxt/index.2313a567.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f6-a/vocHRxHCdWvr0dXw/MuP91cIc\"",
    "mtime": "2023-10-11T07:48:08.881Z",
    "size": 4854,
    "path": "../public/_nuxt/index.2313a567.js.br"
  },
  "/_nuxt/index.2313a567.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f3-rWowuRAmjyOtmTrK5v7fxbkHNb4\"",
    "mtime": "2023-10-11T07:48:08.864Z",
    "size": 5363,
    "path": "../public/_nuxt/index.2313a567.js.gz"
  },
  "/_nuxt/index.31ab4b91.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-my0CGA+TjoethwNs6+vhSpv8Fro\"",
    "mtime": "2023-10-11T07:48:07.902Z",
    "size": 22887,
    "path": "../public/_nuxt/index.31ab4b91.css"
  },
  "/_nuxt/index.31ab4b91.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12db-nuyQFXbpqS4ngZj/rvKUKFfhJJw\"",
    "mtime": "2023-10-11T07:48:08.910Z",
    "size": 4827,
    "path": "../public/_nuxt/index.31ab4b91.css.br"
  },
  "/_nuxt/index.31ab4b91.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-c1a2Msngi4JBeyLvnGG9fG9PCI0\"",
    "mtime": "2023-10-11T07:48:08.882Z",
    "size": 5713,
    "path": "../public/_nuxt/index.31ab4b91.css.gz"
  },
  "/_nuxt/index.991629d9.js": {
    "type": "application/javascript",
    "etag": "\"18343-14a2TagcNV3+me0lHg7dWO+qAXg\"",
    "mtime": "2023-10-11T07:48:07.901Z",
    "size": 99139,
    "path": "../public/_nuxt/index.991629d9.js"
  },
  "/_nuxt/index.991629d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"69ee-mBm26zLxFgMrXE8ezoukt7nez3w\"",
    "mtime": "2023-10-11T07:48:09.034Z",
    "size": 27118,
    "path": "../public/_nuxt/index.991629d9.js.br"
  },
  "/_nuxt/index.991629d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"784b-m3qE4qLs/qTPfgfOlu+Wca8vjPo\"",
    "mtime": "2023-10-11T07:48:08.914Z",
    "size": 30795,
    "path": "../public/_nuxt/index.991629d9.js.gz"
  },
  "/_nuxt/index.f0ce2e5c.js": {
    "type": "application/javascript",
    "etag": "\"649-ooGdhfWyjBN2mHCwJxNnBCw+CZk\"",
    "mtime": "2023-10-11T07:48:07.900Z",
    "size": 1609,
    "path": "../public/_nuxt/index.f0ce2e5c.js"
  },
  "/_nuxt/index.f0ce2e5c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"32a-RtSNBjALKfXLhwmZWcruxX/QsCg\"",
    "mtime": "2023-10-11T07:48:09.037Z",
    "size": 810,
    "path": "../public/_nuxt/index.f0ce2e5c.js.br"
  },
  "/_nuxt/index.f0ce2e5c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bc-oZ57Hdnui6+NF1vKgT6I9v8GWLA\"",
    "mtime": "2023-10-11T07:48:09.034Z",
    "size": 956,
    "path": "../public/_nuxt/index.f0ce2e5c.js.gz"
  },
  "/_nuxt/isAuth.079260d2.js": {
    "type": "application/javascript",
    "etag": "\"284-bai/xF/Zqm1R/bFYUa2xzi41FLQ\"",
    "mtime": "2023-10-11T07:48:07.900Z",
    "size": 644,
    "path": "../public/_nuxt/isAuth.079260d2.js"
  },
  "/_nuxt/login.dda924a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-PIdGNqCOm8Vy4mm+sHLwzCi1Iik\"",
    "mtime": "2023-10-11T07:48:07.899Z",
    "size": 2199,
    "path": "../public/_nuxt/login.dda924a3.css"
  },
  "/_nuxt/login.dda924a3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-6KSjVFHzXn+qpDenYh7oZimtlro\"",
    "mtime": "2023-10-11T07:48:09.041Z",
    "size": 606,
    "path": "../public/_nuxt/login.dda924a3.css.br"
  },
  "/_nuxt/login.dda924a3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-8+aTl5XDF+PNNJt7J7CbQIdjAms\"",
    "mtime": "2023-10-11T07:48:09.038Z",
    "size": 776,
    "path": "../public/_nuxt/login.dda924a3.css.gz"
  },
  "/_nuxt/login.faf3ab32.js": {
    "type": "application/javascript",
    "etag": "\"b86-L8ZRTf4cJoRkwVCbMQUnEJ9DsXo\"",
    "mtime": "2023-10-11T07:48:07.899Z",
    "size": 2950,
    "path": "../public/_nuxt/login.faf3ab32.js"
  },
  "/_nuxt/login.faf3ab32.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b8-PDciM3VInGrNA74Vr63kl6lyMRc\"",
    "mtime": "2023-10-11T07:48:09.046Z",
    "size": 1208,
    "path": "../public/_nuxt/login.faf3ab32.js.br"
  },
  "/_nuxt/login.faf3ab32.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a4-QKEaXVNYbq7W8lFE+nhQPjDH8qI\"",
    "mtime": "2023-10-11T07:48:09.042Z",
    "size": 1444,
    "path": "../public/_nuxt/login.faf3ab32.js.gz"
  },
  "/_nuxt/newsList.df7dd486.js": {
    "type": "application/javascript",
    "etag": "\"e6-RooQ6rCrPBBXaONKFWZlUO1wVwU\"",
    "mtime": "2023-10-11T07:48:07.898Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.df7dd486.js"
  },
  "/_nuxt/orders.0962262e.js": {
    "type": "application/javascript",
    "etag": "\"2638-spFXh1Rj8TAgTcJd+DGNlA2oePw\"",
    "mtime": "2023-10-11T07:48:07.898Z",
    "size": 9784,
    "path": "../public/_nuxt/orders.0962262e.js"
  },
  "/_nuxt/orders.0962262e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b4b-iYc1omGrYhyLDvaUBbG6YwddrOQ\"",
    "mtime": "2023-10-11T07:48:09.058Z",
    "size": 2891,
    "path": "../public/_nuxt/orders.0962262e.js.br"
  },
  "/_nuxt/orders.0962262e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"d36-tFaB/fIvNfwaw9krUZLheseXehg\"",
    "mtime": "2023-10-11T07:48:09.047Z",
    "size": 3382,
    "path": "../public/_nuxt/orders.0962262e.js.gz"
  },
  "/_nuxt/orders.9cbe35dc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-6DreBuV5/xZeuRuSoc5sSwjlLrs\"",
    "mtime": "2023-10-11T07:48:07.897Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.9cbe35dc.css"
  },
  "/_nuxt/orders.9cbe35dc.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"680-XWs6UcjSmh9jA80UUCB9awEOhAM\"",
    "mtime": "2023-10-11T07:48:09.068Z",
    "size": 1664,
    "path": "../public/_nuxt/orders.9cbe35dc.css.br"
  },
  "/_nuxt/orders.9cbe35dc.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-sWSxLDkPw5UytfpJim1aiekqam0\"",
    "mtime": "2023-10-11T07:48:09.059Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.9cbe35dc.css.gz"
  },
  "/_nuxt/profile.430af219.js": {
    "type": "application/javascript",
    "etag": "\"169d-NnQobR8wAIUPfvt+PNuHAFiz/A4\"",
    "mtime": "2023-10-11T07:48:07.897Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.430af219.js"
  },
  "/_nuxt/profile.430af219.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83d-/2KVPeK+IeVKX2irmkUnONcd3Mg\"",
    "mtime": "2023-10-11T07:48:09.076Z",
    "size": 2109,
    "path": "../public/_nuxt/profile.430af219.js.br"
  },
  "/_nuxt/profile.430af219.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a8-4yHDhezwiiDwsYvvG6pAAPX4hSM\"",
    "mtime": "2023-10-11T07:48:09.069Z",
    "size": 2472,
    "path": "../public/_nuxt/profile.430af219.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-10-11T07:48:07.896Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-10-11T07:48:09.111Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-10-11T07:48:09.077Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/register.57116f57.js": {
    "type": "application/javascript",
    "etag": "\"11bd-OBxpi48xpgqDgiolBDOKHuVdK8I\"",
    "mtime": "2023-10-11T07:48:07.895Z",
    "size": 4541,
    "path": "../public/_nuxt/register.57116f57.js"
  },
  "/_nuxt/register.57116f57.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bb-aC52312E0N2zPvOPSIL7+vyC5p8\"",
    "mtime": "2023-10-11T07:48:09.118Z",
    "size": 1467,
    "path": "../public/_nuxt/register.57116f57.js.br"
  },
  "/_nuxt/register.57116f57.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fe-mqVYer27gBgLsXfpNV9whlRGOSY\"",
    "mtime": "2023-10-11T07:48:09.112Z",
    "size": 1790,
    "path": "../public/_nuxt/register.57116f57.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-10-11T07:48:07.895Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-10-11T07:48:09.122Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-10-11T07:48:09.119Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-10-11T07:48:07.894Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-10-11T07:48:09.125Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-10-11T07:48:09.122Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-10-11T07:48:07.894Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-10-11T07:48:07.892Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-10-11T07:48:07.974Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-10-11T07:48:07.973Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-10-11T07:48:07.972Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-10-11T07:48:07.971Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-10-11T07:48:07.961Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-10-11T07:48:07.960Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-10-11T07:48:09.131Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-10-11T07:48:09.128Z",
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
