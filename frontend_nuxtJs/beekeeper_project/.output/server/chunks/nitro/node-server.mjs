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
    "mtime": "2023-12-29T09:16:12.575Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-12-29T09:16:12.609Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-12-29T09:16:12.596Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-12-29T09:16:12.547Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-12-29T09:16:12.545Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.29997836.js": {
    "type": "application/javascript",
    "etag": "\"ae7-sx8KKwdXUfYehgo0LMwnqIZ15sI\"",
    "mtime": "2023-12-29T09:16:12.544Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.29997836.js"
  },
  "/_nuxt/BasketInfo.29997836.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"447-kiRQ2ocsoKZfjtqWdk6eFLE3gLo\"",
    "mtime": "2023-12-29T09:16:12.621Z",
    "size": 1095,
    "path": "../public/_nuxt/BasketInfo.29997836.js.br"
  },
  "/_nuxt/BasketInfo.29997836.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fd-5MdRxSHvy99ESXQvyYBmBzZLIqI\"",
    "mtime": "2023-12-29T09:16:12.613Z",
    "size": 1277,
    "path": "../public/_nuxt/BasketInfo.29997836.js.gz"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2023-12-29T09:16:12.544Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2023-12-29T09:16:12.650Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-LE+S+BwO6spfkzk2fxkvXiZn5T8\"",
    "mtime": "2023-12-29T09:16:12.622Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-12-29T09:16:12.543Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-12-29T09:16:12.672Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-12-29T09:16:12.651Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.d914d657.js": {
    "type": "application/javascript",
    "etag": "\"15bf-SP3aATsDaKWtA7dwaSzm/CMCqgY\"",
    "mtime": "2023-12-29T09:16:12.540Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.d914d657.js"
  },
  "/_nuxt/CatalogProduct.d914d657.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"791-jTGh9eoDPp6VE4skSb5mYZxU1Eo\"",
    "mtime": "2023-12-29T09:16:12.680Z",
    "size": 1937,
    "path": "../public/_nuxt/CatalogProduct.d914d657.js.br"
  },
  "/_nuxt/CatalogProduct.d914d657.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-Y/JsBD99PekHzDwgLrN5HDtWjT0\"",
    "mtime": "2023-12-29T09:16:12.673Z",
    "size": 2185,
    "path": "../public/_nuxt/CatalogProduct.d914d657.js.gz"
  },
  "/_nuxt/FavoriteComp.48e05763.js": {
    "type": "application/javascript",
    "etag": "\"783-xHd2nFTvgkkuehYsnS+wpazAqN8\"",
    "mtime": "2023-12-29T09:16:12.539Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.48e05763.js"
  },
  "/_nuxt/FavoriteComp.48e05763.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"292-tKBH3ACAXbWehrI8RCgrHjjk5VI\"",
    "mtime": "2023-12-29T09:16:12.684Z",
    "size": 658,
    "path": "../public/_nuxt/FavoriteComp.48e05763.js.br"
  },
  "/_nuxt/FavoriteComp.48e05763.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-/mJ3se6hj6vO9vj2qcz4UrCOy/s\"",
    "mtime": "2023-12-29T09:16:12.680Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.48e05763.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-12-29T09:16:12.539Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-12-29T09:16:12.701Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-12-29T09:16:12.685Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-12-29T09:16:12.538Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-12-29T09:16:12.707Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-12-29T09:16:12.702Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.a51be47b.js": {
    "type": "application/javascript",
    "etag": "\"e2e-N/H6W1gqY0cgoMPu9DSUXti/bOE\"",
    "mtime": "2023-12-29T09:16:12.537Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.a51be47b.js"
  },
  "/_nuxt/FavoriteComp.a51be47b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-7757mA9uUgcZLhkG3G/foxoW3EM\"",
    "mtime": "2023-12-29T09:16:12.713Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.a51be47b.js.br"
  },
  "/_nuxt/FavoriteComp.a51be47b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d0-qFpD1wsIbYvmgrFq+bV3gekO5wQ\"",
    "mtime": "2023-12-29T09:16:12.708Z",
    "size": 1232,
    "path": "../public/_nuxt/FavoriteComp.a51be47b.js.gz"
  },
  "/_nuxt/ImageForm.614a6c28.js": {
    "type": "application/javascript",
    "etag": "\"1ac-GMKaUicLzaTnWz6xcXGHG/IkCEM\"",
    "mtime": "2023-12-29T09:16:12.536Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.614a6c28.js"
  },
  "/_nuxt/LoadingComp.82faaaf7.js": {
    "type": "application/javascript",
    "etag": "\"1fe-iZWmdZ6ODGqIgF1rB9a7YaKpiNs\"",
    "mtime": "2023-12-29T09:16:12.536Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.82faaaf7.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-12-29T09:16:12.535Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-12-29T09:16:12.525Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-12-29T09:16:12.717Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-12-29T09:16:12.715Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.340af9df.js": {
    "type": "application/javascript",
    "etag": "\"431-7wFmjZ2qerMl3yYv+NF2pZgr8f8\"",
    "mtime": "2023-12-29T09:16:12.524Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.340af9df.js"
  },
  "/_nuxt/OrderProductList.340af9df.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20d-Mku+pWDVWqPcE6EZOjIs8qahVEE\"",
    "mtime": "2023-12-29T09:16:12.720Z",
    "size": 525,
    "path": "../public/_nuxt/OrderProductList.340af9df.js.br"
  },
  "/_nuxt/OrderProductList.340af9df.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-FRROYTBz/kt8OI+gMm2rkw6Wx/M\"",
    "mtime": "2023-12-29T09:16:12.718Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.340af9df.js.gz"
  },
  "/_nuxt/UserBasket.2c1d39e7.js": {
    "type": "application/javascript",
    "etag": "\"1897-ffr8r0N5FGOMt+v2rwFVRl9BPUk\"",
    "mtime": "2023-12-29T09:16:12.523Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.2c1d39e7.js"
  },
  "/_nuxt/UserBasket.2c1d39e7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"91d-T7u4QpdTzRJQV67nf5SjQSEDnYg\"",
    "mtime": "2023-12-29T09:16:12.729Z",
    "size": 2333,
    "path": "../public/_nuxt/UserBasket.2c1d39e7.js.br"
  },
  "/_nuxt/UserBasket.2c1d39e7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a72-0YSG1KgVXjNH9arNBFOYtoXx7UI\"",
    "mtime": "2023-12-29T09:16:12.721Z",
    "size": 2674,
    "path": "../public/_nuxt/UserBasket.2c1d39e7.js.gz"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2023-12-29T09:16:12.522Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2023-12-29T09:16:12.747Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-WJYELguUqmb4UcsCrbAABZoRm8s\"",
    "mtime": "2023-12-29T09:16:12.730Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-12-29T09:16:12.522Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-12-29T09:16:12.764Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-12-29T09:16:12.748Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-12-29T09:16:12.521Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.d02b238b.js": {
    "type": "application/javascript",
    "etag": "\"531-TafdEvETqRCdJIOQcO1tx0HAK5k\"",
    "mtime": "2023-12-29T09:16:12.520Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.d02b238b.js"
  },
  "/_nuxt/_id_.d02b238b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-WzZgvAUuvKCirOFKlON8z/Rsqpo\"",
    "mtime": "2023-12-29T09:16:12.768Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.d02b238b.js.br"
  },
  "/_nuxt/_id_.d02b238b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-DDwmLTEd85Pl9awcXmLrTyZXP/c\"",
    "mtime": "2023-12-29T09:16:12.765Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.d02b238b.js.gz"
  },
  "/_nuxt/_id_.f3d1cd09.js": {
    "type": "application/javascript",
    "etag": "\"12e4-GZi2fUwOEfqnBX3VdeNQu2gnoc0\"",
    "mtime": "2023-12-29T09:16:12.520Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.f3d1cd09.js"
  },
  "/_nuxt/_id_.f3d1cd09.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75f-sbHQbF5+hPp+7AlhFMPm2hg8+KY\"",
    "mtime": "2023-12-29T09:16:12.775Z",
    "size": 1887,
    "path": "../public/_nuxt/_id_.f3d1cd09.js.br"
  },
  "/_nuxt/_id_.f3d1cd09.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85e-jnjvSlkSdmz4MHkJXiuQq7NWta4\"",
    "mtime": "2023-12-29T09:16:12.768Z",
    "size": 2142,
    "path": "../public/_nuxt/_id_.f3d1cd09.js.gz"
  },
  "/_nuxt/about_us.0e3fecdf.js": {
    "type": "application/javascript",
    "etag": "\"819-88GPp2pDs1oxFpSRBPSMcrSUqPo\"",
    "mtime": "2023-12-29T09:16:12.519Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.0e3fecdf.js"
  },
  "/_nuxt/about_us.0e3fecdf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"39f-7/Gf+dBH9CKJLXfeEhEt4R6OeO4\"",
    "mtime": "2023-12-29T09:16:12.779Z",
    "size": 927,
    "path": "../public/_nuxt/about_us.0e3fecdf.js.br"
  },
  "/_nuxt/about_us.0e3fecdf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"470-U/XTdrZzTRvdwmCJHJXIgy1tEEs\"",
    "mtime": "2023-12-29T09:16:12.775Z",
    "size": 1136,
    "path": "../public/_nuxt/about_us.0e3fecdf.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2023-12-29T09:16:12.519Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/basket.4fdb97b6.js": {
    "type": "application/javascript",
    "etag": "\"2b6-h9PEnRr+x5/TveFueBeeGmDBdLE\"",
    "mtime": "2023-12-29T09:16:12.518Z",
    "size": 694,
    "path": "../public/_nuxt/basket.4fdb97b6.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-12-29T09:16:12.518Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-12-29T09:16:12.788Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-12-29T09:16:12.780Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.ae5390da.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-cMrdfivGCLBEnexjAT76uZWxnHg\"",
    "mtime": "2023-12-29T09:16:12.517Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.ae5390da.js"
  },
  "/_nuxt/catalog.ae5390da.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"920-ek5eKL3l3aOyw+sNFRqOQGnrYis\"",
    "mtime": "2023-12-29T09:16:12.797Z",
    "size": 2336,
    "path": "../public/_nuxt/catalog.ae5390da.js.br"
  },
  "/_nuxt/catalog.ae5390da.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a97-8p3hG0WJYdSRVDAAcgEkCXT9oiM\"",
    "mtime": "2023-12-29T09:16:12.789Z",
    "size": 2711,
    "path": "../public/_nuxt/catalog.ae5390da.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-12-29T09:16:12.516Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-12-29T09:16:12.806Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-12-29T09:16:12.798Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2023-12-29T09:16:12.516Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2023-12-29T09:16:12.945Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-1GLczaEuyyUl480772Fwwqm+GtA\"",
    "mtime": "2023-12-29T09:16:12.809Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.a294fb43.js": {
    "type": "application/javascript",
    "etag": "\"16616-jg9Gn0dAOauSJQz+UZliwpDRCYU\"",
    "mtime": "2023-12-29T09:16:12.514Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.a294fb43.js"
  },
  "/_nuxt/checkout.a294fb43.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57c0-idQJk/Afv5tnc2Po63WBNwdWHMs\"",
    "mtime": "2023-12-29T09:16:13.064Z",
    "size": 22464,
    "path": "../public/_nuxt/checkout.a294fb43.js.br"
  },
  "/_nuxt/checkout.a294fb43.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6601-sgIYk/5UzgnYj7NsOG++hk3JDEQ\"",
    "mtime": "2023-12-29T09:16:12.948Z",
    "size": 26113,
    "path": "../public/_nuxt/checkout.a294fb43.js.gz"
  },
  "/_nuxt/entry.6e545c23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-dhTZ8viLs+5dZ70tHzTW7opSkWM\"",
    "mtime": "2023-12-29T09:16:12.513Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.6e545c23.css"
  },
  "/_nuxt/entry.6e545c23.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a58-F6bKnX0vmsUwt+igMxXatpt1Rro\"",
    "mtime": "2023-12-29T09:16:13.077Z",
    "size": 2648,
    "path": "../public/_nuxt/entry.6e545c23.css.br"
  },
  "/_nuxt/entry.6e545c23.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bee-o1bKiFpS4jczL4inuXJgHkfYEF0\"",
    "mtime": "2023-12-29T09:16:13.064Z",
    "size": 3054,
    "path": "../public/_nuxt/entry.6e545c23.css.gz"
  },
  "/_nuxt/entry.b4d38e3d.js": {
    "type": "application/javascript",
    "etag": "\"374d2-2eYi4lKS/gT8p8HVhOEKANy+Ebs\"",
    "mtime": "2023-12-29T09:16:12.513Z",
    "size": 226514,
    "path": "../public/_nuxt/entry.b4d38e3d.js"
  },
  "/_nuxt/entry.b4d38e3d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12701-DJucjOScOZcmOcJUIknt4mSAU/8\"",
    "mtime": "2023-12-29T09:16:13.459Z",
    "size": 75521,
    "path": "../public/_nuxt/entry.b4d38e3d.js.br"
  },
  "/_nuxt/entry.b4d38e3d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14c3f-7tZN2KiDncZs1zncCp7NZ7qv1jM\"",
    "mtime": "2023-12-29T09:16:13.086Z",
    "size": 85055,
    "path": "../public/_nuxt/entry.b4d38e3d.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-12-29T09:16:12.511Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-12-29T09:16:13.465Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-12-29T09:16:13.460Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.2f887697.js": {
    "type": "application/javascript",
    "etag": "\"8a8-spnNJ4CMcQu43Q1P18s4grjcY24\"",
    "mtime": "2023-12-29T09:16:12.511Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.2f887697.js"
  },
  "/_nuxt/error-404.2f887697.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-upovIC9OCucc/iXVqfA8UnBz69Q\"",
    "mtime": "2023-12-29T09:16:13.469Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.2f887697.js.br"
  },
  "/_nuxt/error-404.2f887697.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-Mfgy8q+R8MtUkGU25ZEyQgFmdoM\"",
    "mtime": "2023-12-29T09:16:13.466Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.2f887697.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-12-29T09:16:12.510Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-12-29T09:16:13.473Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-12-29T09:16:13.470Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.b25d6719.js": {
    "type": "application/javascript",
    "etag": "\"756-J2aF8QQP9gEXcjDwOd1IWqx8o4E\"",
    "mtime": "2023-12-29T09:16:12.509Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.b25d6719.js"
  },
  "/_nuxt/error-500.b25d6719.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-Dk20nMZ0z8beKyeIndfNwtmP0s0\"",
    "mtime": "2023-12-29T09:16:13.477Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.b25d6719.js.br"
  },
  "/_nuxt/error-500.b25d6719.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-zv4UCMbiTBxj9psM2w3Vq4i4tnE\"",
    "mtime": "2023-12-29T09:16:13.474Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.b25d6719.js.gz"
  },
  "/_nuxt/error-component.50476ede.js": {
    "type": "application/javascript",
    "etag": "\"45e-ePNFQUsITB4pp02+y1qdE0m5Tho\"",
    "mtime": "2023-12-29T09:16:12.509Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.50476ede.js"
  },
  "/_nuxt/error-component.50476ede.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"209-CFUyL9IjWruKUVvfH5W37lbJ7dA\"",
    "mtime": "2023-12-29T09:16:13.480Z",
    "size": 521,
    "path": "../public/_nuxt/error-component.50476ede.js.br"
  },
  "/_nuxt/error-component.50476ede.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-HRa9vfWzY1d3T6ypu2T/L7BM1zU\"",
    "mtime": "2023-12-29T09:16:13.478Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.50476ede.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2023-12-29T09:16:12.508Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2023-12-29T09:16:13.490Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-d6UjocNqp2VUIFEp0Ni0e30HvBg\"",
    "mtime": "2023-12-29T09:16:13.481Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/favorite.546bba24.js": {
    "type": "application/javascript",
    "etag": "\"906-lvSRuju3bYyXEHK0B6n+MOrvzK4\"",
    "mtime": "2023-12-29T09:16:12.508Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.546bba24.js"
  },
  "/_nuxt/favorite.546bba24.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40b-Vc4Gt0IcHmKYN3veXXL9uunO498\"",
    "mtime": "2023-12-29T09:16:13.494Z",
    "size": 1035,
    "path": "../public/_nuxt/favorite.546bba24.js.br"
  },
  "/_nuxt/favorite.546bba24.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b4-LKaXNdkR6YDn8xwGk6Q7RelSkio\"",
    "mtime": "2023-12-29T09:16:13.490Z",
    "size": 1204,
    "path": "../public/_nuxt/favorite.546bba24.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-12-29T09:16:12.507Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-12-29T09:16:12.507Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.f4e9abc2.js": {
    "type": "application/javascript",
    "etag": "\"e1-bX/xbrepPZQ/Wpki5iDOHiRaTbc\"",
    "mtime": "2023-12-29T09:16:12.506Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.f4e9abc2.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-12-29T09:16:12.505Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-12-29T09:16:13.499Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-12-29T09:16:13.496Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.3cac2be5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-kYQjRSZK2Bkw4KYhjzt+8CUnOOU\"",
    "mtime": "2023-12-29T09:16:12.505Z",
    "size": 22887,
    "path": "../public/_nuxt/index.3cac2be5.css"
  },
  "/_nuxt/index.3cac2be5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12db-arABDJvRAHj4ueLfygPTmKHJYwg\"",
    "mtime": "2023-12-29T09:16:13.526Z",
    "size": 4827,
    "path": "../public/_nuxt/index.3cac2be5.css.br"
  },
  "/_nuxt/index.3cac2be5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-7bfb3gbGe0ovllAwE4Pm80HYlDk\"",
    "mtime": "2023-12-29T09:16:13.500Z",
    "size": 5713,
    "path": "../public/_nuxt/index.3cac2be5.css.gz"
  },
  "/_nuxt/index.4c9cc3f5.js": {
    "type": "application/javascript",
    "etag": "\"17bfc-3D+wMR85hlZtncjtwqCUL4hMc2I\"",
    "mtime": "2023-12-29T09:16:12.504Z",
    "size": 97276,
    "path": "../public/_nuxt/index.4c9cc3f5.js"
  },
  "/_nuxt/index.4c9cc3f5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6788-Jv5OAFbTWtbYFpXj5fdpeQ0A+JM\"",
    "mtime": "2023-12-29T09:16:13.648Z",
    "size": 26504,
    "path": "../public/_nuxt/index.4c9cc3f5.js.br"
  },
  "/_nuxt/index.4c9cc3f5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758c-M56Si1rv/h3QNjuAogTZUxLlJdw\"",
    "mtime": "2023-12-29T09:16:13.530Z",
    "size": 30092,
    "path": "../public/_nuxt/index.4c9cc3f5.js.gz"
  },
  "/_nuxt/index.6955e972.js": {
    "type": "application/javascript",
    "etag": "\"649-BdrK+lf6Lzuu/yXBb4BePx3T+/k\"",
    "mtime": "2023-12-29T09:16:12.503Z",
    "size": 1609,
    "path": "../public/_nuxt/index.6955e972.js"
  },
  "/_nuxt/index.6955e972.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"32a-w1D4lIJl+RCp5wqWB902doJcDog\"",
    "mtime": "2023-12-29T09:16:13.652Z",
    "size": 810,
    "path": "../public/_nuxt/index.6955e972.js.br"
  },
  "/_nuxt/index.6955e972.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3ba-Uqdt0CQ87Xes8xg/iHpdZhdO2HU\"",
    "mtime": "2023-12-29T09:16:13.649Z",
    "size": 954,
    "path": "../public/_nuxt/index.6955e972.js.gz"
  },
  "/_nuxt/index.d8194d2b.js": {
    "type": "application/javascript",
    "etag": "\"3abf-Qn92F1BckeCFKg9GE0W9RzeKIF8\"",
    "mtime": "2023-12-29T09:16:12.503Z",
    "size": 15039,
    "path": "../public/_nuxt/index.d8194d2b.js"
  },
  "/_nuxt/index.d8194d2b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f8-SfYlXgzadmlCQhOLO1AuXBkZm/4\"",
    "mtime": "2023-12-29T09:16:13.670Z",
    "size": 4856,
    "path": "../public/_nuxt/index.d8194d2b.js.br"
  },
  "/_nuxt/index.d8194d2b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-ZkVS7cpTx9yIjNQM8i405jZOtxc\"",
    "mtime": "2023-12-29T09:16:13.653Z",
    "size": 5362,
    "path": "../public/_nuxt/index.d8194d2b.js.gz"
  },
  "/_nuxt/isAuth.dc053811.js": {
    "type": "application/javascript",
    "etag": "\"275-w0IjVFHnb8U9XK8T73f7dbXRNAk\"",
    "mtime": "2023-12-29T09:16:12.502Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.dc053811.js"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2023-12-29T09:16:12.502Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2023-12-29T09:16:13.674Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-BSIWOpRnxjt4LrLxZNusX10MQ/Q\"",
    "mtime": "2023-12-29T09:16:13.671Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.d4e1c8dc.js": {
    "type": "application/javascript",
    "etag": "\"b8e-/Glgr8mVr8jUu3KGddG7QV7HHQE\"",
    "mtime": "2023-12-29T09:16:12.501Z",
    "size": 2958,
    "path": "../public/_nuxt/login.d4e1c8dc.js"
  },
  "/_nuxt/login.d4e1c8dc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4c3-s2PQ89or6GSPVgFrv3CQgkKsUPI\"",
    "mtime": "2023-12-29T09:16:13.679Z",
    "size": 1219,
    "path": "../public/_nuxt/login.d4e1c8dc.js.br"
  },
  "/_nuxt/login.d4e1c8dc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a7-nALwWbJuyBfKiDBdsgh4V5Q/30k\"",
    "mtime": "2023-12-29T09:16:13.675Z",
    "size": 1447,
    "path": "../public/_nuxt/login.d4e1c8dc.js.gz"
  },
  "/_nuxt/newsList.b2ae8428.js": {
    "type": "application/javascript",
    "etag": "\"e6-FsiSuWrkXLj/PfLRz0uAW9dgiB4\"",
    "mtime": "2023-12-29T09:16:12.500Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.b2ae8428.js"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2023-12-29T09:16:12.500Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2023-12-29T09:16:13.690Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-lKpfiM20kgjPtEexL8DqS5VOzRE\"",
    "mtime": "2023-12-29T09:16:13.680Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/orders.fba61624.js": {
    "type": "application/javascript",
    "etag": "\"2595-AtjqKWbeJazukzaCryHgbNP2dK4\"",
    "mtime": "2023-12-29T09:16:12.499Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.fba61624.js"
  },
  "/_nuxt/orders.fba61624.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b04-sN4yiXycg8NvlRjpSASWNPZXYyI\"",
    "mtime": "2023-12-29T09:16:13.702Z",
    "size": 2820,
    "path": "../public/_nuxt/orders.fba61624.js.br"
  },
  "/_nuxt/orders.fba61624.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfd-4TTI9wjp6pn4HicuZlwUTFr/IBE\"",
    "mtime": "2023-12-29T09:16:13.691Z",
    "size": 3325,
    "path": "../public/_nuxt/orders.fba61624.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-12-29T09:16:12.499Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-12-29T09:16:13.745Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-12-29T09:16:13.703Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.701fd66b.js": {
    "type": "application/javascript",
    "etag": "\"169d-dn4iwFNfM+VDM+8xWX+BBSM33ec\"",
    "mtime": "2023-12-29T09:16:12.498Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.701fd66b.js"
  },
  "/_nuxt/profile.701fd66b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83a-NtN/Ymklt+RSEBKpje7pmpi61eA\"",
    "mtime": "2023-12-29T09:16:13.753Z",
    "size": 2106,
    "path": "../public/_nuxt/profile.701fd66b.js.br"
  },
  "/_nuxt/profile.701fd66b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-XnAarExPbMbSIL3vLUw1jN3VGbg\"",
    "mtime": "2023-12-29T09:16:13.746Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.701fd66b.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-12-29T09:16:12.497Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-12-29T09:16:13.758Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-12-29T09:16:13.754Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.c7ebd678.js": {
    "type": "application/javascript",
    "etag": "\"11bd-PnaBeLD2Oy0/0+U3FEGPfOEyat0\"",
    "mtime": "2023-12-29T09:16:12.489Z",
    "size": 4541,
    "path": "../public/_nuxt/register.c7ebd678.js"
  },
  "/_nuxt/register.c7ebd678.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bc-pUKJTgo37og3O12IDTnG84UwRik\"",
    "mtime": "2023-12-29T09:16:13.766Z",
    "size": 1468,
    "path": "../public/_nuxt/register.c7ebd678.js.br"
  },
  "/_nuxt/register.c7ebd678.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fc-CNoST9kgmK7n09EHB2c1kMMF37k\"",
    "mtime": "2023-12-29T09:16:13.759Z",
    "size": 1788,
    "path": "../public/_nuxt/register.c7ebd678.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-29T09:16:12.467Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-29T09:16:13.771Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-29T09:16:13.767Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-12-29T09:16:12.466Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-12-29T09:16:12.465Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-12-29T09:16:12.553Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-12-29T09:16:12.552Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3013e-iL+bzZJH1+Y2zXQuCZPjzQKlbMk\"",
    "mtime": "2023-12-29T09:16:12.551Z",
    "size": 196926,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-12-29T09:16:12.549Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-12-29T09:16:12.549Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-29T09:16:12.548Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-29T09:16:13.777Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-29T09:16:13.774Z",
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
