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
    "mtime": "2023-12-30T12:11:00.585Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-12-30T12:11:00.503Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-12-30T12:11:00.502Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2023-12-30T12:11:00.501Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2023-12-30T12:11:00.653Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-LE+S+BwO6spfkzk2fxkvXiZn5T8\"",
    "mtime": "2023-12-30T12:11:00.623Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/BasketInfo.a8e9daeb.js": {
    "type": "application/javascript",
    "etag": "\"ae7-Uxp2BZ1itLoMsRvoRADLXwH+Hcg\"",
    "mtime": "2023-12-30T12:11:00.500Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.a8e9daeb.js"
  },
  "/_nuxt/BasketInfo.a8e9daeb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44c-ihm426x9gmXxkMjmIBc9aph+0RA\"",
    "mtime": "2023-12-30T12:11:00.658Z",
    "size": 1100,
    "path": "../public/_nuxt/BasketInfo.a8e9daeb.js.br"
  },
  "/_nuxt/BasketInfo.a8e9daeb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fe-rnRki9yUk+i7YXJ+lTPCJmpll7g\"",
    "mtime": "2023-12-30T12:11:00.654Z",
    "size": 1278,
    "path": "../public/_nuxt/BasketInfo.a8e9daeb.js.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-12-30T12:11:00.500Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-12-30T12:11:00.677Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-12-30T12:11:00.659Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.d6882a71.js": {
    "type": "application/javascript",
    "etag": "\"15bf-jNdn7bnusTF/mhiOFO52tjCs9gA\"",
    "mtime": "2023-12-30T12:11:00.499Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.d6882a71.js"
  },
  "/_nuxt/CatalogProduct.d6882a71.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"788-fvH/oHAedF6pTKEblz/d0Oj3maU\"",
    "mtime": "2023-12-30T12:11:00.684Z",
    "size": 1928,
    "path": "../public/_nuxt/CatalogProduct.d6882a71.js.br"
  },
  "/_nuxt/CatalogProduct.d6882a71.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88a-s3NfrPj2UkcoNmqqyrcCbeb55PE\"",
    "mtime": "2023-12-30T12:11:00.677Z",
    "size": 2186,
    "path": "../public/_nuxt/CatalogProduct.d6882a71.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-12-30T12:11:00.499Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-12-30T12:11:00.701Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-12-30T12:11:00.685Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-12-30T12:11:00.498Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-12-30T12:11:00.706Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-12-30T12:11:00.702Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.b4478ddc.js": {
    "type": "application/javascript",
    "etag": "\"783-b+z8KLzE+JjmFIZo2msbHhPb0eA\"",
    "mtime": "2023-12-30T12:11:00.498Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.b4478ddc.js"
  },
  "/_nuxt/FavoriteComp.b4478ddc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28d-RT10QBtO5/QBSPNJtvXd9kvH5UA\"",
    "mtime": "2023-12-30T12:11:00.711Z",
    "size": 653,
    "path": "../public/_nuxt/FavoriteComp.b4478ddc.js.br"
  },
  "/_nuxt/FavoriteComp.b4478ddc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-UHws6nQ/CGjXSxQHy8mz2+0gbk4\"",
    "mtime": "2023-12-30T12:11:00.707Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.b4478ddc.js.gz"
  },
  "/_nuxt/FavoriteComp.d735096f.js": {
    "type": "application/javascript",
    "etag": "\"e2e-9+76enHukMgqhlOwvu6TzJHlblE\"",
    "mtime": "2023-12-30T12:11:00.497Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.d735096f.js"
  },
  "/_nuxt/FavoriteComp.d735096f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"410-xMY4gsO2Xat794/kXm1XAKlswzM\"",
    "mtime": "2023-12-30T12:11:00.717Z",
    "size": 1040,
    "path": "../public/_nuxt/FavoriteComp.d735096f.js.br"
  },
  "/_nuxt/FavoriteComp.d735096f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-uQwzn/O8tHsO4Zk0sj46ags41WE\"",
    "mtime": "2023-12-30T12:11:00.711Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.d735096f.js.gz"
  },
  "/_nuxt/ImageForm.9dfbea0b.js": {
    "type": "application/javascript",
    "etag": "\"1ac-kcQaGMoWLKahPcGXIlr3iLHo6n4\"",
    "mtime": "2023-12-30T12:11:00.497Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.9dfbea0b.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-12-30T12:11:00.496Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.e1579fa0.js": {
    "type": "application/javascript",
    "etag": "\"1fe-cZFT5NEfwfK4arGDrVuLsQ7a0Ls\"",
    "mtime": "2023-12-30T12:11:00.492Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.e1579fa0.js"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-12-30T12:11:00.492Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-12-30T12:11:00.720Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-12-30T12:11:00.718Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.e1d610f6.js": {
    "type": "application/javascript",
    "etag": "\"431-7MA9CS7+iwHo/L7znTtiDzEJiSw\"",
    "mtime": "2023-12-30T12:11:00.491Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.e1d610f6.js"
  },
  "/_nuxt/OrderProductList.e1d610f6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20e-4lwzXxr0ts08DzEyVdxaAMvL070\"",
    "mtime": "2023-12-30T12:11:00.723Z",
    "size": 526,
    "path": "../public/_nuxt/OrderProductList.e1d610f6.js.br"
  },
  "/_nuxt/OrderProductList.e1d610f6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-m9b9T1jXnX90wSsM0UVPmQ7UPuk\"",
    "mtime": "2023-12-30T12:11:00.721Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.e1d610f6.js.gz"
  },
  "/_nuxt/UserBasket.0d650074.js": {
    "type": "application/javascript",
    "etag": "\"1897-ZHdKJf/f2WaWEEZb58RLbBXbPOI\"",
    "mtime": "2023-12-30T12:11:00.491Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.0d650074.js"
  },
  "/_nuxt/UserBasket.0d650074.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-nvvTyloUW9EgO6b0Rs7QZorQc1c\"",
    "mtime": "2023-12-30T12:11:00.731Z",
    "size": 2339,
    "path": "../public/_nuxt/UserBasket.0d650074.js.br"
  },
  "/_nuxt/UserBasket.0d650074.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a70-31JHBFMsuUdWbOqk3WDh0lZKqPg\"",
    "mtime": "2023-12-30T12:11:00.724Z",
    "size": 2672,
    "path": "../public/_nuxt/UserBasket.0d650074.js.gz"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2023-12-30T12:11:00.490Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2023-12-30T12:11:00.749Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-WJYELguUqmb4UcsCrbAABZoRm8s\"",
    "mtime": "2023-12-30T12:11:00.732Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-12-30T12:11:00.489Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-12-30T12:11:00.764Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-12-30T12:11:00.749Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.3535ef95.js": {
    "type": "application/javascript",
    "etag": "\"12e4-BkYGColiJoo7zzZNhQM7Zf/JgHk\"",
    "mtime": "2023-12-30T12:11:00.489Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.3535ef95.js"
  },
  "/_nuxt/_id_.3535ef95.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"761-oNBopkJdXFyAP631ZgcEJrar//k\"",
    "mtime": "2023-12-30T12:11:00.770Z",
    "size": 1889,
    "path": "../public/_nuxt/_id_.3535ef95.js.br"
  },
  "/_nuxt/_id_.3535ef95.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85f-ZRoQgfPGX+fpDUwfCvgY8U5Ub/Y\"",
    "mtime": "2023-12-30T12:11:00.765Z",
    "size": 2143,
    "path": "../public/_nuxt/_id_.3535ef95.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-12-30T12:11:00.488Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.c043ecdb.js": {
    "type": "application/javascript",
    "etag": "\"531-ShRpTAakOYHtwsS07qWPKuDktTI\"",
    "mtime": "2023-12-30T12:11:00.487Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.c043ecdb.js"
  },
  "/_nuxt/_id_.c043ecdb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a6-BRT9gwVGZ1SWlFaNZO4pHppNDj8\"",
    "mtime": "2023-12-30T12:11:00.774Z",
    "size": 678,
    "path": "../public/_nuxt/_id_.c043ecdb.js.br"
  },
  "/_nuxt/_id_.c043ecdb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-AHQ6EJOrebhn1XLSlE67cxxAaB4\"",
    "mtime": "2023-12-30T12:11:00.771Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.c043ecdb.js.gz"
  },
  "/_nuxt/about_us.23d8de7b.js": {
    "type": "application/javascript",
    "etag": "\"819-ytydyZh7XPfIP/UhXyhPiMxMgpg\"",
    "mtime": "2023-12-30T12:11:00.487Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.23d8de7b.js"
  },
  "/_nuxt/about_us.23d8de7b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3a6-iDTyUTxSSwbbi3sHvS97fOfJGYk\"",
    "mtime": "2023-12-30T12:11:00.778Z",
    "size": 934,
    "path": "../public/_nuxt/about_us.23d8de7b.js.br"
  },
  "/_nuxt/about_us.23d8de7b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"470-52Ckoo7S9FmsYzBw8tnJsiosDHY\"",
    "mtime": "2023-12-30T12:11:00.774Z",
    "size": 1136,
    "path": "../public/_nuxt/about_us.23d8de7b.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2023-12-30T12:11:00.486Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/basket.9e80904d.js": {
    "type": "application/javascript",
    "etag": "\"2b6-BslFqdoZIzeIbw4IvuhKDCxI3j8\"",
    "mtime": "2023-12-30T12:11:00.486Z",
    "size": 694,
    "path": "../public/_nuxt/basket.9e80904d.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-12-30T12:11:00.485Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-12-30T12:11:00.785Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-12-30T12:11:00.779Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.42a4ae7a.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-gBdy0PReEYj+LkzzsKR8ELsV1HA\"",
    "mtime": "2023-12-30T12:11:00.484Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.42a4ae7a.js"
  },
  "/_nuxt/catalog.42a4ae7a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"921-WMiP16flX5ttOP+aq4A/y46r06I\"",
    "mtime": "2023-12-30T12:11:00.796Z",
    "size": 2337,
    "path": "../public/_nuxt/catalog.42a4ae7a.js.br"
  },
  "/_nuxt/catalog.42a4ae7a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9b-g4ExuLf0GBB+1RhUI4i6wor6f1s\"",
    "mtime": "2023-12-30T12:11:00.786Z",
    "size": 2715,
    "path": "../public/_nuxt/catalog.42a4ae7a.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-12-30T12:11:00.484Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-12-30T12:11:00.806Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-12-30T12:11:00.797Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2023-12-30T12:11:00.483Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2023-12-30T12:11:00.919Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-1GLczaEuyyUl480772Fwwqm+GtA\"",
    "mtime": "2023-12-30T12:11:00.809Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.6fd3aab6.js": {
    "type": "application/javascript",
    "etag": "\"16616-Uk8Tnp/F6RbGd85i7H5l7YqhdHM\"",
    "mtime": "2023-12-30T12:11:00.479Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.6fd3aab6.js"
  },
  "/_nuxt/checkout.6fd3aab6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57bf-vsnJen2E+IKWjfJGqWZsbm7K5Os\"",
    "mtime": "2023-12-30T12:11:01.039Z",
    "size": 22463,
    "path": "../public/_nuxt/checkout.6fd3aab6.js.br"
  },
  "/_nuxt/checkout.6fd3aab6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6600-fiWNwQYf2qLvN319sg8g4e49TY0\"",
    "mtime": "2023-12-30T12:11:00.922Z",
    "size": 26112,
    "path": "../public/_nuxt/checkout.6fd3aab6.js.gz"
  },
  "/_nuxt/entry.1ad51745.js": {
    "type": "application/javascript",
    "etag": "\"374d2-bzOJWLoIJvGnVPEJclyjpA1gEgI\"",
    "mtime": "2023-12-30T12:11:00.477Z",
    "size": 226514,
    "path": "../public/_nuxt/entry.1ad51745.js"
  },
  "/_nuxt/entry.1ad51745.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"126c4-XdhQ9qTET4FxLZHEwhrqcfh8hwY\"",
    "mtime": "2023-12-30T12:11:01.432Z",
    "size": 75460,
    "path": "../public/_nuxt/entry.1ad51745.js.br"
  },
  "/_nuxt/entry.1ad51745.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14c39-zVVxKXIdlUS1hwDNpeOlGqISSfU\"",
    "mtime": "2023-12-30T12:11:01.051Z",
    "size": 85049,
    "path": "../public/_nuxt/entry.1ad51745.js.gz"
  },
  "/_nuxt/entry.caa016ae.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-DgjB906NiVYEP5fBnQ7kLLNVJ9I\"",
    "mtime": "2023-12-30T12:11:00.475Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.caa016ae.css"
  },
  "/_nuxt/entry.caa016ae.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a57-W7kU6+5AHkK+7GZTsblbjr388Mg\"",
    "mtime": "2023-12-30T12:11:01.444Z",
    "size": 2647,
    "path": "../public/_nuxt/entry.caa016ae.css.br"
  },
  "/_nuxt/entry.caa016ae.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bed-gC061S6jHFEsaAhzDDRS8MJ3Tmw\"",
    "mtime": "2023-12-30T12:11:01.433Z",
    "size": 3053,
    "path": "../public/_nuxt/entry.caa016ae.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-12-30T12:11:00.474Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-12-30T12:11:01.450Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-12-30T12:11:01.445Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.ed8b6366.js": {
    "type": "application/javascript",
    "etag": "\"8a8-iIg1McMaHAQb73JPLxXB3zDvLE0\"",
    "mtime": "2023-12-30T12:11:00.474Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.ed8b6366.js"
  },
  "/_nuxt/error-404.ed8b6366.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-7HJ8KAdty5PUR6PEAMW4HhmGU1s\"",
    "mtime": "2023-12-30T12:11:01.454Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.ed8b6366.js.br"
  },
  "/_nuxt/error-404.ed8b6366.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-wqQFXl0CyUGYsu3ElyqVT6G4t2c\"",
    "mtime": "2023-12-30T12:11:01.451Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.ed8b6366.js.gz"
  },
  "/_nuxt/error-500.4842ccf2.js": {
    "type": "application/javascript",
    "etag": "\"756-9iD78MslNQi1igWllAN96xKjXwU\"",
    "mtime": "2023-12-30T12:11:00.473Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.4842ccf2.js"
  },
  "/_nuxt/error-500.4842ccf2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-LfESmhcSxS5wrXxsHvUxBoLb3X0\"",
    "mtime": "2023-12-30T12:11:01.459Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.4842ccf2.js.br"
  },
  "/_nuxt/error-500.4842ccf2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-TQrh3oahAJG/SBgvE+g0H4DtYM8\"",
    "mtime": "2023-12-30T12:11:01.455Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.4842ccf2.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-12-30T12:11:00.472Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-12-30T12:11:01.464Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-12-30T12:11:01.460Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.ac010aed.js": {
    "type": "application/javascript",
    "etag": "\"45e-t0K626ptW2YbLT1tFKpPXCpuhSc\"",
    "mtime": "2023-12-30T12:11:00.472Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.ac010aed.js"
  },
  "/_nuxt/error-component.ac010aed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-pdT2q+zPCV7Ovlu7fTZoVg7eAAU\"",
    "mtime": "2023-12-30T12:11:01.467Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.ac010aed.js.br"
  },
  "/_nuxt/error-component.ac010aed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-t3g2BQDL9gVFu+ZvKzYXwKtg38w\"",
    "mtime": "2023-12-30T12:11:01.465Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.ac010aed.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2023-12-30T12:11:00.471Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2023-12-30T12:11:01.476Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-d6UjocNqp2VUIFEp0Ni0e30HvBg\"",
    "mtime": "2023-12-30T12:11:01.468Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/favorite.c1c0fccf.js": {
    "type": "application/javascript",
    "etag": "\"906-7m2sQVQOydQVZOnsy4N2Ap4WLfo\"",
    "mtime": "2023-12-30T12:11:00.471Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.c1c0fccf.js"
  },
  "/_nuxt/favorite.c1c0fccf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40c-vnk2k3y7qOhN/sx+/Ex3ysMOh/4\"",
    "mtime": "2023-12-30T12:11:01.481Z",
    "size": 1036,
    "path": "../public/_nuxt/favorite.c1c0fccf.js.br"
  },
  "/_nuxt/favorite.c1c0fccf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b4-p7t2wA/yKwtdaN8cqmNeNrkcY/k\"",
    "mtime": "2023-12-30T12:11:01.477Z",
    "size": 1204,
    "path": "../public/_nuxt/favorite.c1c0fccf.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-12-30T12:11:00.470Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-12-30T12:11:00.467Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.618bd4d0.js": {
    "type": "application/javascript",
    "etag": "\"e1-ex3Uz+XDbdrpEKbutJwYXcQ+gOw\"",
    "mtime": "2023-12-30T12:11:00.466Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.618bd4d0.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-12-30T12:11:00.466Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-12-30T12:11:01.486Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-12-30T12:11:01.483Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.15088dc3.js": {
    "type": "application/javascript",
    "etag": "\"17c16-hKO9ZUfNS75Qbdrl9ExfYR4Ieco\"",
    "mtime": "2023-12-30T12:11:00.465Z",
    "size": 97302,
    "path": "../public/_nuxt/index.15088dc3.js"
  },
  "/_nuxt/index.15088dc3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6752-yf50i/ugD/BQwqxMEDrylyEReaA\"",
    "mtime": "2023-12-30T12:11:01.607Z",
    "size": 26450,
    "path": "../public/_nuxt/index.15088dc3.js.br"
  },
  "/_nuxt/index.15088dc3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"759f-6u/9YZp3jrYUBaIW+TJ8d0859kA\"",
    "mtime": "2023-12-30T12:11:01.490Z",
    "size": 30111,
    "path": "../public/_nuxt/index.15088dc3.js.gz"
  },
  "/_nuxt/index.78e2b630.js": {
    "type": "application/javascript",
    "etag": "\"649-/1hr+Ew2eEUy3rPhYQIVrRNkB14\"",
    "mtime": "2023-12-30T12:11:00.464Z",
    "size": 1609,
    "path": "../public/_nuxt/index.78e2b630.js"
  },
  "/_nuxt/index.78e2b630.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"33a-VpC79oKn2cHuUHDkh8JEQp/6Ydk\"",
    "mtime": "2023-12-30T12:11:01.611Z",
    "size": 826,
    "path": "../public/_nuxt/index.78e2b630.js.br"
  },
  "/_nuxt/index.78e2b630.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-d+YeJDxVHZzzJGB6lW7YWNvMkY4\"",
    "mtime": "2023-12-30T12:11:01.608Z",
    "size": 955,
    "path": "../public/_nuxt/index.78e2b630.js.gz"
  },
  "/_nuxt/index.a3c00bc5.js": {
    "type": "application/javascript",
    "etag": "\"3abf-cAWgwyzKNLug6Vf0mMyqKN7B0Go\"",
    "mtime": "2023-12-30T12:11:00.464Z",
    "size": 15039,
    "path": "../public/_nuxt/index.a3c00bc5.js"
  },
  "/_nuxt/index.a3c00bc5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ec-Y9uYKvSw6vodBQKjOJKQRKzpyow\"",
    "mtime": "2023-12-30T12:11:01.631Z",
    "size": 4844,
    "path": "../public/_nuxt/index.a3c00bc5.js.br"
  },
  "/_nuxt/index.a3c00bc5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-GkKm5IUj0sqANRJqLc+kRV3AmgM\"",
    "mtime": "2023-12-30T12:11:01.613Z",
    "size": 5362,
    "path": "../public/_nuxt/index.a3c00bc5.js.gz"
  },
  "/_nuxt/index.c9efb979.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-lHcywwazMAZHYuN3fdm6leIPWkE\"",
    "mtime": "2023-12-30T12:11:00.463Z",
    "size": 22887,
    "path": "../public/_nuxt/index.c9efb979.css"
  },
  "/_nuxt/index.c9efb979.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12dc-aEHvGHUYJxXWaimA5DYiy2/DODo\"",
    "mtime": "2023-12-30T12:11:01.659Z",
    "size": 4828,
    "path": "../public/_nuxt/index.c9efb979.css.br"
  },
  "/_nuxt/index.c9efb979.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1652-v13yTzdpOVpDvboQ4lgNR9thFm0\"",
    "mtime": "2023-12-30T12:11:01.632Z",
    "size": 5714,
    "path": "../public/_nuxt/index.c9efb979.css.gz"
  },
  "/_nuxt/isAuth.c4a1f461.js": {
    "type": "application/javascript",
    "etag": "\"275-9I+vfHz0lxNTLHAfjUT0ZGdqyOU\"",
    "mtime": "2023-12-30T12:11:00.463Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.c4a1f461.js"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2023-12-30T12:11:00.462Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2023-12-30T12:11:01.664Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-BSIWOpRnxjt4LrLxZNusX10MQ/Q\"",
    "mtime": "2023-12-30T12:11:01.660Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.99bee4a5.js": {
    "type": "application/javascript",
    "etag": "\"b8e-U9m5RBBrUInfyKY3caXQEvgEnm8\"",
    "mtime": "2023-12-30T12:11:00.462Z",
    "size": 2958,
    "path": "../public/_nuxt/login.99bee4a5.js"
  },
  "/_nuxt/login.99bee4a5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4bf-+G5OT/yplcgNLN7XkAR3QUMQW4o\"",
    "mtime": "2023-12-30T12:11:01.669Z",
    "size": 1215,
    "path": "../public/_nuxt/login.99bee4a5.js.br"
  },
  "/_nuxt/login.99bee4a5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a7-R2pRgIMrZ00vlqYx7zH0drqmA4g\"",
    "mtime": "2023-12-30T12:11:01.664Z",
    "size": 1447,
    "path": "../public/_nuxt/login.99bee4a5.js.gz"
  },
  "/_nuxt/newsList.88260d51.js": {
    "type": "application/javascript",
    "etag": "\"e6-4hMAI2eYiAvw1xg5br14w7U5bwM\"",
    "mtime": "2023-12-30T12:11:00.461Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.88260d51.js"
  },
  "/_nuxt/orders.29672acf.js": {
    "type": "application/javascript",
    "etag": "\"2595-YfeXwtm+UMvWBP7X3uYXRI6x2sg\"",
    "mtime": "2023-12-30T12:11:00.461Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.29672acf.js"
  },
  "/_nuxt/orders.29672acf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b04-rJiVIadNpJZSE9OoAUgNfx9BlQE\"",
    "mtime": "2023-12-30T12:11:01.681Z",
    "size": 2820,
    "path": "../public/_nuxt/orders.29672acf.js.br"
  },
  "/_nuxt/orders.29672acf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfd-KaZAc7ly8VcIKJYx+kEnjXq5Nok\"",
    "mtime": "2023-12-30T12:11:01.670Z",
    "size": 3325,
    "path": "../public/_nuxt/orders.29672acf.js.gz"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2023-12-30T12:11:00.460Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2023-12-30T12:11:01.697Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-lKpfiM20kgjPtEexL8DqS5VOzRE\"",
    "mtime": "2023-12-30T12:11:01.682Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-12-30T12:11:00.459Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-12-30T12:11:01.733Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-12-30T12:11:01.698Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.74ae8419.js": {
    "type": "application/javascript",
    "etag": "\"169d-cwPzcgV01Ietq2xJnSfpl0GHNTo\"",
    "mtime": "2023-12-30T12:11:00.459Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.74ae8419.js"
  },
  "/_nuxt/profile.74ae8419.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"845-k4Qnte5l5HjH3RKRFxfK13bBzvg\"",
    "mtime": "2023-12-30T12:11:01.745Z",
    "size": 2117,
    "path": "../public/_nuxt/profile.74ae8419.js.br"
  },
  "/_nuxt/profile.74ae8419.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9aa-5nhImsfWbcFHBDJ/FM8CwZXXqlk\"",
    "mtime": "2023-12-30T12:11:01.734Z",
    "size": 2474,
    "path": "../public/_nuxt/profile.74ae8419.js.gz"
  },
  "/_nuxt/register.1f490c65.js": {
    "type": "application/javascript",
    "etag": "\"11bd-feaoFxR8Xm3SB+675E5ODlCwyRE\"",
    "mtime": "2023-12-30T12:11:00.458Z",
    "size": 4541,
    "path": "../public/_nuxt/register.1f490c65.js"
  },
  "/_nuxt/register.1f490c65.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5ba-oCSjOj7MGZeNcb5WYJ/8WHWZGmc\"",
    "mtime": "2023-12-30T12:11:01.752Z",
    "size": 1466,
    "path": "../public/_nuxt/register.1f490c65.js.br"
  },
  "/_nuxt/register.1f490c65.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fa-4tbVdkuf49UIeO9aTEvvnGVSg1o\"",
    "mtime": "2023-12-30T12:11:01.746Z",
    "size": 1786,
    "path": "../public/_nuxt/register.1f490c65.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-12-30T12:11:00.458Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-12-30T12:11:01.757Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-12-30T12:11:01.753Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-30T12:11:00.457Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-30T12:11:01.761Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-30T12:11:01.758Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-12-30T12:11:00.454Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-12-30T12:11:00.451Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-12-30T12:11:00.618Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-12-30T12:11:00.606Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-12-30T12:11:00.574Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-12-30T12:11:00.573Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3013e-iL+bzZJH1+Y2zXQuCZPjzQKlbMk\"",
    "mtime": "2023-12-30T12:11:00.554Z",
    "size": 196926,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-12-30T12:11:00.530Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-12-30T12:11:00.522Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-30T12:11:00.521Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-30T12:11:01.766Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-30T12:11:01.764Z",
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
