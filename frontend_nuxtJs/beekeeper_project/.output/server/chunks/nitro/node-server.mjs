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
    "mtime": "2023-08-07T13:15:29.235Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-07T13:15:29.222Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-07T13:15:29.220Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-07T13:15:29.219Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-07T13:15:29.280Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-07T13:15:29.243Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/BasketInfo.ecaf9166.js": {
    "type": "application/javascript",
    "etag": "\"9a2-y8NlbDFxg9pXqOabWbMvgw579Ak\"",
    "mtime": "2023-08-07T13:15:29.219Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.ecaf9166.js"
  },
  "/_nuxt/BasketInfo.ecaf9166.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f3-LqFjviLxAtYCdD1YGK81Ax4wj+I\"",
    "mtime": "2023-08-07T13:15:29.285Z",
    "size": 1011,
    "path": "../public/_nuxt/BasketInfo.ecaf9166.js.br"
  },
  "/_nuxt/BasketInfo.ecaf9166.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-4A2fvumWwCjI/BXEkojYkMVro6c\"",
    "mtime": "2023-08-07T13:15:29.281Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.ecaf9166.js.gz"
  },
  "/_nuxt/CatalogProduct.82e42504.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e94-nNGj5+xS0PhHD4Jwyi2BnEh3HRM\"",
    "mtime": "2023-08-07T13:15:29.218Z",
    "size": 7828,
    "path": "../public/_nuxt/CatalogProduct.82e42504.css"
  },
  "/_nuxt/CatalogProduct.82e42504.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b0-GYm4ujOLSwDQHef/9ODay+wo+L0\"",
    "mtime": "2023-08-07T13:15:29.296Z",
    "size": 1712,
    "path": "../public/_nuxt/CatalogProduct.82e42504.css.br"
  },
  "/_nuxt/CatalogProduct.82e42504.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ce-QbzlsIWPyl6KXLoy4RPWWkiiQpo\"",
    "mtime": "2023-08-07T13:15:29.286Z",
    "size": 1998,
    "path": "../public/_nuxt/CatalogProduct.82e42504.css.gz"
  },
  "/_nuxt/CatalogProduct.853d593f.js": {
    "type": "application/javascript",
    "etag": "\"1059-C8wi3DplM9L0NoZkB4N9zRlmCko\"",
    "mtime": "2023-08-07T13:15:29.217Z",
    "size": 4185,
    "path": "../public/_nuxt/CatalogProduct.853d593f.js"
  },
  "/_nuxt/CatalogProduct.853d593f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"601-bnJzmmswGQgGTajkxViRXtbhSRg\"",
    "mtime": "2023-08-07T13:15:29.305Z",
    "size": 1537,
    "path": "../public/_nuxt/CatalogProduct.853d593f.js.br"
  },
  "/_nuxt/CatalogProduct.853d593f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6eb-7DYPDapkaVbYeLJJrkXcSm/MRCQ\"",
    "mtime": "2023-08-07T13:15:29.297Z",
    "size": 1771,
    "path": "../public/_nuxt/CatalogProduct.853d593f.js.gz"
  },
  "/_nuxt/FavoriteComp.26575ec5.js": {
    "type": "application/javascript",
    "etag": "\"783-Bm7TlEhhNUt3Lwf9ALr8ANsFBfU\"",
    "mtime": "2023-08-07T13:15:29.217Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.26575ec5.js"
  },
  "/_nuxt/FavoriteComp.26575ec5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-4OgG45crDXKgX/orwKwYax4CHmw\"",
    "mtime": "2023-08-07T13:15:29.310Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.26575ec5.js.br"
  },
  "/_nuxt/FavoriteComp.26575ec5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f8-xAsYF3aJoSDfk5LS0ee25PKkyq8\"",
    "mtime": "2023-08-07T13:15:29.306Z",
    "size": 760,
    "path": "../public/_nuxt/FavoriteComp.26575ec5.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-07T13:15:29.216Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-07T13:15:29.330Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-07T13:15:29.311Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.f829acc2.js": {
    "type": "application/javascript",
    "etag": "\"b70-fEnIr4sCX8jqlt1MlSrxQxHX4AI\"",
    "mtime": "2023-08-07T13:15:29.215Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.f829acc2.js"
  },
  "/_nuxt/FavoriteComp.f829acc2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"392-MBxdh3mIBngSo5xYnY7DnhNZGeg\"",
    "mtime": "2023-08-07T13:15:29.337Z",
    "size": 914,
    "path": "../public/_nuxt/FavoriteComp.f829acc2.js.br"
  },
  "/_nuxt/FavoriteComp.f829acc2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40b-yxUxPmAq5mBRpBoVnhGGSs0rNDM\"",
    "mtime": "2023-08-07T13:15:29.332Z",
    "size": 1035,
    "path": "../public/_nuxt/FavoriteComp.f829acc2.js.gz"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1075-+RyDT2IQ2kPAAeedkmauBBTojb4\"",
    "mtime": "2023-08-07T13:15:29.215Z",
    "size": 4213,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bf-JW4WSiPepHevCg4JEO5/wP+oJBc\"",
    "mtime": "2023-08-07T13:15:29.345Z",
    "size": 959,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.br"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"489-HKAlc4bFKl4JU8yY+X+vzpaRT78\"",
    "mtime": "2023-08-07T13:15:29.338Z",
    "size": 1161,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.gz"
  },
  "/_nuxt/ImageForm.4cfb4415.js": {
    "type": "application/javascript",
    "etag": "\"1ac-bT66o93rTdW9hlNpJKqdbusKYFw\"",
    "mtime": "2023-08-07T13:15:29.214Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.4cfb4415.js"
  },
  "/_nuxt/LoadingComp.56ccc856.js": {
    "type": "application/javascript",
    "etag": "\"1fe-kznS1rvLyLLyJx0C3dCp74uy+iA\"",
    "mtime": "2023-08-07T13:15:29.213Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.56ccc856.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-07T13:15:29.212Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-07T13:15:29.209Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-07T13:15:29.349Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-07T13:15:29.347Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.972f03fa.js": {
    "type": "application/javascript",
    "etag": "\"453-KtpU85lYalnLxbvAo+66qkcRi3k\"",
    "mtime": "2023-08-07T13:15:29.208Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.972f03fa.js"
  },
  "/_nuxt/OrderProductList.972f03fa.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-4APGK1Y2ZiYPGKRnBnRdZrKZm+E\"",
    "mtime": "2023-08-07T13:15:29.355Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.972f03fa.js.br"
  },
  "/_nuxt/OrderProductList.972f03fa.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"243-eQljsV9ME2TY0NvxQxUNQvOJ06c\"",
    "mtime": "2023-08-07T13:15:29.350Z",
    "size": 579,
    "path": "../public/_nuxt/OrderProductList.972f03fa.js.gz"
  },
  "/_nuxt/UserBasket.854b7ba8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-tEGTqCvuYl5h8GqKoTkDj6M8JnU\"",
    "mtime": "2023-08-07T13:15:29.207Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css"
  },
  "/_nuxt/UserBasket.854b7ba8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-MTrYg4/3qluzuw+ah0PkyMz7w0E\"",
    "mtime": "2023-08-07T13:15:29.374Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.br"
  },
  "/_nuxt/UserBasket.854b7ba8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"866-oXWbMLEVAB4i7cCM2LCBX6EaYzs\"",
    "mtime": "2023-08-07T13:15:29.356Z",
    "size": 2150,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.gz"
  },
  "/_nuxt/UserBasket.d1521e49.js": {
    "type": "application/javascript",
    "etag": "\"13fc-MmhHr0++i2XsbF3Buo2gs36lLm0\"",
    "mtime": "2023-08-07T13:15:29.207Z",
    "size": 5116,
    "path": "../public/_nuxt/UserBasket.d1521e49.js"
  },
  "/_nuxt/UserBasket.d1521e49.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"780-GookQ5wvm51ERNEI9O4l9iIrd9o\"",
    "mtime": "2023-08-07T13:15:29.382Z",
    "size": 1920,
    "path": "../public/_nuxt/UserBasket.d1521e49.js.br"
  },
  "/_nuxt/UserBasket.d1521e49.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"894-jbYzXNcl6ffFJpq8qK8SDk3Ula4\"",
    "mtime": "2023-08-07T13:15:29.375Z",
    "size": 2196,
    "path": "../public/_nuxt/UserBasket.d1521e49.js.gz"
  },
  "/_nuxt/_id_.14bf7aee.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-3EY9uDdeNVRGJz1pOfnX6k2FhEU\"",
    "mtime": "2023-08-07T13:15:29.206Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.14bf7aee.css"
  },
  "/_nuxt/_id_.14bf7aee.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-hHGiuDAaMFwEDzPucnRwBg/pSr8\"",
    "mtime": "2023-08-07T13:15:29.400Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.14bf7aee.css.br"
  },
  "/_nuxt/_id_.14bf7aee.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-2UFxED7H1NlKRUbIiMLI19mo4gQ\"",
    "mtime": "2023-08-07T13:15:29.383Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.14bf7aee.css.gz"
  },
  "/_nuxt/_id_.3f1e501b.js": {
    "type": "application/javascript",
    "etag": "\"1266-ClcfRnJNB8UNz0eP2pJXIVMCY6U\"",
    "mtime": "2023-08-07T13:15:29.205Z",
    "size": 4710,
    "path": "../public/_nuxt/_id_.3f1e501b.js"
  },
  "/_nuxt/_id_.3f1e501b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"73d-HUHvdWz/1WnLohxb+cNr5XpXBH4\"",
    "mtime": "2023-08-07T13:15:29.408Z",
    "size": 1853,
    "path": "../public/_nuxt/_id_.3f1e501b.js.br"
  },
  "/_nuxt/_id_.3f1e501b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"817-QlBgQsemoaS0dXDRYq+JKKoxe+A\"",
    "mtime": "2023-08-07T13:15:29.401Z",
    "size": 2071,
    "path": "../public/_nuxt/_id_.3f1e501b.js.gz"
  },
  "/_nuxt/_id_.753c5f40.js": {
    "type": "application/javascript",
    "etag": "\"4be-yRnnDNKevKbE05yEmxQmwQd0auU\"",
    "mtime": "2023-08-07T13:15:29.205Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.753c5f40.js"
  },
  "/_nuxt/_id_.753c5f40.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-/oAz4kuTVUZs9ATkwaMOEnAhIyM\"",
    "mtime": "2023-08-07T13:15:29.412Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.753c5f40.js.br"
  },
  "/_nuxt/_id_.753c5f40.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dd-aaEcoRF78D3Bve6WWVDGR6HhIhs\"",
    "mtime": "2023-08-07T13:15:29.409Z",
    "size": 733,
    "path": "../public/_nuxt/_id_.753c5f40.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-08-07T13:15:29.204Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-08-07T13:15:29.203Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-08-07T13:15:29.421Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-08-07T13:15:29.413Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.aa31d77a.js": {
    "type": "application/javascript",
    "etag": "\"26e-+EtqLJ+/8D7xwoaERQah8LpG188\"",
    "mtime": "2023-08-07T13:15:29.202Z",
    "size": 622,
    "path": "../public/_nuxt/basket.aa31d77a.js"
  },
  "/_nuxt/catalog.6dd781f4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1da4-MDzff2lmKYXOca5FpLDwIjEobk8\"",
    "mtime": "2023-08-07T13:15:29.202Z",
    "size": 7588,
    "path": "../public/_nuxt/catalog.6dd781f4.css"
  },
  "/_nuxt/catalog.6dd781f4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6cb-Uytr4VRjPUiunFG6HZdjUvGhrKE\"",
    "mtime": "2023-08-07T13:15:29.432Z",
    "size": 1739,
    "path": "../public/_nuxt/catalog.6dd781f4.css.br"
  },
  "/_nuxt/catalog.6dd781f4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7dc-9G1RoXix/hyiVG58GAUzrG6jKy4\"",
    "mtime": "2023-08-07T13:15:29.422Z",
    "size": 2012,
    "path": "../public/_nuxt/catalog.6dd781f4.css.gz"
  },
  "/_nuxt/catalog.dbffdf6b.js": {
    "type": "application/javascript",
    "etag": "\"1afb-Lzmqze5qG1qby2NiNfs0m+UlZAw\"",
    "mtime": "2023-08-07T13:15:29.201Z",
    "size": 6907,
    "path": "../public/_nuxt/catalog.dbffdf6b.js"
  },
  "/_nuxt/catalog.dbffdf6b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"914-aWgFpIWl8440rXOCttbjM9PkvII\"",
    "mtime": "2023-08-07T13:15:29.441Z",
    "size": 2324,
    "path": "../public/_nuxt/catalog.dbffdf6b.js.br"
  },
  "/_nuxt/catalog.dbffdf6b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a76-7pRBMU8qN3L13oeLr0k595Skmdw\"",
    "mtime": "2023-08-07T13:15:29.433Z",
    "size": 2678,
    "path": "../public/_nuxt/catalog.dbffdf6b.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-07T13:15:29.200Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.ddfc6183.js": {
    "type": "application/javascript",
    "etag": "\"148a2-6HObSMGMNYu0hM1b2nC2qnkUUy0\"",
    "mtime": "2023-08-07T13:15:29.199Z",
    "size": 84130,
    "path": "../public/_nuxt/checkout.ddfc6183.js"
  },
  "/_nuxt/checkout.ddfc6183.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5107-vK8n2xlv6xxuR76HTBlSAip7aEc\"",
    "mtime": "2023-08-07T13:15:29.540Z",
    "size": 20743,
    "path": "../public/_nuxt/checkout.ddfc6183.js.br"
  },
  "/_nuxt/checkout.ddfc6183.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e2e-5GZDwmQ6ZO4xP8acX71H1ftoNkc\"",
    "mtime": "2023-08-07T13:15:29.445Z",
    "size": 24110,
    "path": "../public/_nuxt/checkout.ddfc6183.js.gz"
  },
  "/_nuxt/checkout.e8fc6527.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-u+O1F156bLEUYIboFgqyQn0+Yjw\"",
    "mtime": "2023-08-07T13:15:29.195Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.e8fc6527.css"
  },
  "/_nuxt/checkout.e8fc6527.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fbc-W6gT3OgVjU6iIYmR9OSDkXjCVhQ\"",
    "mtime": "2023-08-07T13:15:29.671Z",
    "size": 20412,
    "path": "../public/_nuxt/checkout.e8fc6527.css.br"
  },
  "/_nuxt/checkout.e8fc6527.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-g3iar6Xw6iWpil0O6Q1gO3bWh3w\"",
    "mtime": "2023-08-07T13:15:29.544Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.e8fc6527.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-07T13:15:29.194Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.689a6fea.js": {
    "type": "application/javascript",
    "etag": "\"345bd-sm7+/1eb8FNNqjmaVgak4lBzGUw\"",
    "mtime": "2023-08-07T13:15:29.192Z",
    "size": 214461,
    "path": "../public/_nuxt/entry.689a6fea.js"
  },
  "/_nuxt/entry.689a6fea.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11823-U2OHj7C6r0TB/iCM1s81x/Z1xO0\"",
    "mtime": "2023-08-07T13:15:30.059Z",
    "size": 71715,
    "path": "../public/_nuxt/entry.689a6fea.js.br"
  },
  "/_nuxt/entry.689a6fea.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13a53-NQeay14jcmGyGFH5lHYQlH0wb2o\"",
    "mtime": "2023-08-07T13:15:29.681Z",
    "size": 80467,
    "path": "../public/_nuxt/entry.689a6fea.js.gz"
  },
  "/_nuxt/entry.84d871ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"253c-eJRPCfaLP6KP3M+AWvQFZNVb8vE\"",
    "mtime": "2023-08-07T13:15:29.190Z",
    "size": 9532,
    "path": "../public/_nuxt/entry.84d871ce.css"
  },
  "/_nuxt/entry.84d871ce.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"932-6XmAbb/W7Ojs+6y/r7ygDTLmqyc\"",
    "mtime": "2023-08-07T13:15:30.072Z",
    "size": 2354,
    "path": "../public/_nuxt/entry.84d871ce.css.br"
  },
  "/_nuxt/entry.84d871ce.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a9f-g0Tfr27lSqoyXQ1LJWc/iX1ypH8\"",
    "mtime": "2023-08-07T13:15:30.061Z",
    "size": 2719,
    "path": "../public/_nuxt/entry.84d871ce.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-07T13:15:29.189Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-07T13:15:30.079Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-07T13:15:30.073Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.e937b6ac.js": {
    "type": "application/javascript",
    "etag": "\"8a4-r3XwczbWxbAvp19C25aHRZcb5D0\"",
    "mtime": "2023-08-07T13:15:29.189Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.e937b6ac.js"
  },
  "/_nuxt/error-404.e937b6ac.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cd-uL30FileDEaECT7j7/8cSPM4slE\"",
    "mtime": "2023-08-07T13:15:30.089Z",
    "size": 973,
    "path": "../public/_nuxt/error-404.e937b6ac.js.br"
  },
  "/_nuxt/error-404.e937b6ac.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-3xYEqThs/TCqTuLJk2fgghkW/1k\"",
    "mtime": "2023-08-07T13:15:30.083Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.e937b6ac.js.gz"
  },
  "/_nuxt/error-500.67d36ae9.js": {
    "type": "application/javascript",
    "etag": "\"757-XwBaUGOQSpUur1QT/Qsnm2mQMGg\"",
    "mtime": "2023-08-07T13:15:29.188Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.67d36ae9.js"
  },
  "/_nuxt/error-500.67d36ae9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34d-WP/3LscJIXIiqR7Vp+okr+FoRJ8\"",
    "mtime": "2023-08-07T13:15:30.096Z",
    "size": 845,
    "path": "../public/_nuxt/error-500.67d36ae9.js.br"
  },
  "/_nuxt/error-500.67d36ae9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-o5lBMXcIGzIr7RbrmEtWWf42pUc\"",
    "mtime": "2023-08-07T13:15:30.090Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.67d36ae9.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-07T13:15:29.187Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-07T13:15:30.101Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-07T13:15:30.097Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.3c24761b.js": {
    "type": "application/javascript",
    "etag": "\"45e-FDRqsjWPMiH7HLhZtvogowi0aPw\"",
    "mtime": "2023-08-07T13:15:29.184Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.3c24761b.js"
  },
  "/_nuxt/error-component.3c24761b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-DBK++BVxsgaGlaTzkp5T653VwWA\"",
    "mtime": "2023-08-07T13:15:30.105Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.3c24761b.js.br"
  },
  "/_nuxt/error-component.3c24761b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-Q2Ul+hplE6EZiaCpO5UB1GJpd8I\"",
    "mtime": "2023-08-07T13:15:30.102Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.3c24761b.js.gz"
  },
  "/_nuxt/favorite.2c5373bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-VXoLjaBuljdcCdAHSzzREVahc/o\"",
    "mtime": "2023-08-07T13:15:29.183Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2c5373bb.css"
  },
  "/_nuxt/favorite.2c5373bb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-DXTvVqfYoh3NZ5B57zEH8/xXhi0\"",
    "mtime": "2023-08-07T13:15:30.117Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.2c5373bb.css.br"
  },
  "/_nuxt/favorite.2c5373bb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-ePdIAR2clkhwocTMOW3sWozzXHI\"",
    "mtime": "2023-08-07T13:15:30.108Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2c5373bb.css.gz"
  },
  "/_nuxt/favorite.883ad68d.js": {
    "type": "application/javascript",
    "etag": "\"a10-rKgiVRmKw6O6QS4V8CRPtmUCkg8\"",
    "mtime": "2023-08-07T13:15:29.182Z",
    "size": 2576,
    "path": "../public/_nuxt/favorite.883ad68d.js"
  },
  "/_nuxt/favorite.883ad68d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43d-4T7DDhfLIC0cUvG9LurtFidPeV4\"",
    "mtime": "2023-08-07T13:15:30.124Z",
    "size": 1085,
    "path": "../public/_nuxt/favorite.883ad68d.js.br"
  },
  "/_nuxt/favorite.883ad68d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4eb-CPB+Lmdj8KA1Fd6AslUjnudtC4U\"",
    "mtime": "2023-08-07T13:15:30.118Z",
    "size": 1259,
    "path": "../public/_nuxt/favorite.883ad68d.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-07T13:15:29.182Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-07T13:15:29.181Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.51e9cd0e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"59a9-rctR2Bb0iJzGiZsux/bY+sgWUko\"",
    "mtime": "2023-08-07T13:15:29.180Z",
    "size": 22953,
    "path": "../public/_nuxt/index.51e9cd0e.css"
  },
  "/_nuxt/index.51e9cd0e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12cb-anvOnkStnT46Gl/mteOeK1vC1ZA\"",
    "mtime": "2023-08-07T13:15:30.155Z",
    "size": 4811,
    "path": "../public/_nuxt/index.51e9cd0e.css.br"
  },
  "/_nuxt/index.51e9cd0e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1648-+OppwKpbwNBlrlHn6vIp9Gzz3ZA\"",
    "mtime": "2023-08-07T13:15:30.126Z",
    "size": 5704,
    "path": "../public/_nuxt/index.51e9cd0e.css.gz"
  },
  "/_nuxt/index.559a108c.js": {
    "type": "application/javascript",
    "etag": "\"16f31-5oKQuxWnG3PxhUT8dkgtgb0HLoQ\"",
    "mtime": "2023-08-07T13:15:29.179Z",
    "size": 94001,
    "path": "../public/_nuxt/index.559a108c.js"
  },
  "/_nuxt/index.559a108c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"64bb-ZOlXe9nXD44SlBUQqFGy9t0e9OU\"",
    "mtime": "2023-08-07T13:15:30.284Z",
    "size": 25787,
    "path": "../public/_nuxt/index.559a108c.js.br"
  },
  "/_nuxt/index.559a108c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7227-u08aVWikAbSxrtELK163CEUV/uA\"",
    "mtime": "2023-08-07T13:15:30.161Z",
    "size": 29223,
    "path": "../public/_nuxt/index.559a108c.js.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-08-07T13:15:29.178Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-08-07T13:15:30.290Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-08-07T13:15:30.285Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.e917b501.js": {
    "type": "application/javascript",
    "etag": "\"605-NQXnmdBRgIFuTiDIbxD27pVrYo4\"",
    "mtime": "2023-08-07T13:15:29.177Z",
    "size": 1541,
    "path": "../public/_nuxt/index.e917b501.js"
  },
  "/_nuxt/index.e917b501.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2f8-waKaabT/XZLaSIFr47c4p/3iHwo\"",
    "mtime": "2023-08-07T13:15:30.294Z",
    "size": 760,
    "path": "../public/_nuxt/index.e917b501.js.br"
  },
  "/_nuxt/index.e917b501.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38c-n6Xa3zrZoSJek1YGz3aktAn+Mls\"",
    "mtime": "2023-08-07T13:15:30.291Z",
    "size": 908,
    "path": "../public/_nuxt/index.e917b501.js.gz"
  },
  "/_nuxt/index.ee7e9784.js": {
    "type": "application/javascript",
    "etag": "\"3aba-WVPD6s7vB84mh3+6uditbrxE5AI\"",
    "mtime": "2023-08-07T13:15:29.177Z",
    "size": 15034,
    "path": "../public/_nuxt/index.ee7e9784.js"
  },
  "/_nuxt/index.ee7e9784.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1301-XmgUz8EwQuPWQER1MnAG2FlGIfc\"",
    "mtime": "2023-08-07T13:15:30.313Z",
    "size": 4865,
    "path": "../public/_nuxt/index.ee7e9784.js.br"
  },
  "/_nuxt/index.ee7e9784.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-jDa3b9prHheHv8BUMsBAzRzi44o\"",
    "mtime": "2023-08-07T13:15:30.295Z",
    "size": 5360,
    "path": "../public/_nuxt/index.ee7e9784.js.gz"
  },
  "/_nuxt/isAuth.517bcfd3.js": {
    "type": "application/javascript",
    "etag": "\"213-MDufiJHeCgseZpv1/+LYI5Tfpb0\"",
    "mtime": "2023-08-07T13:15:29.176Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.517bcfd3.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-08-07T13:15:29.175Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-08-07T13:15:30.320Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-08-07T13:15:30.316Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.8c550120.js": {
    "type": "application/javascript",
    "etag": "\"830-9J4j5nJ1qsoc5wf7cNVuRuxmIBs\"",
    "mtime": "2023-08-07T13:15:29.170Z",
    "size": 2096,
    "path": "../public/_nuxt/login.8c550120.js"
  },
  "/_nuxt/login.8c550120.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ec-U14mY5CG6FDLzJ6RQ+mW/pO8LmM\"",
    "mtime": "2023-08-07T13:15:30.324Z",
    "size": 1004,
    "path": "../public/_nuxt/login.8c550120.js.br"
  },
  "/_nuxt/login.8c550120.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a9-7BQP6Vi+xwqcFc0BGykqtuecJK0\"",
    "mtime": "2023-08-07T13:15:30.321Z",
    "size": 1193,
    "path": "../public/_nuxt/login.8c550120.js.gz"
  },
  "/_nuxt/main.f52baff7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b8f5-jyPrmqbHvD3IVYuVRj+eF6gZFnc\"",
    "mtime": "2023-08-07T13:15:29.170Z",
    "size": 178421,
    "path": "../public/_nuxt/main.f52baff7.jpg"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-08-07T13:15:29.168Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/news.f49abdb8.js": {
    "type": "application/javascript",
    "etag": "\"4af-BrPV4R7ZZFUslyGnuOFjlvXxarc\"",
    "mtime": "2023-08-07T13:15:29.168Z",
    "size": 1199,
    "path": "../public/_nuxt/news.f49abdb8.js"
  },
  "/_nuxt/news.f49abdb8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a8-7EUzmyqpXy3FdPJUC8IKWEMQATI\"",
    "mtime": "2023-08-07T13:15:30.329Z",
    "size": 424,
    "path": "../public/_nuxt/news.f49abdb8.js.br"
  },
  "/_nuxt/news.f49abdb8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-KwOzdOAtZo8EIFJKvy1DUaDSghc\"",
    "mtime": "2023-08-07T13:15:30.325Z",
    "size": 535,
    "path": "../public/_nuxt/news.f49abdb8.js.gz"
  },
  "/_nuxt/newsList.e97cfdc3.js": {
    "type": "application/javascript",
    "etag": "\"10a-WkWq+J2J1onsZ+c0sd2EUChuxv0\"",
    "mtime": "2023-08-07T13:15:29.167Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.e97cfdc3.js"
  },
  "/_nuxt/orders.a3852bd2.js": {
    "type": "application/javascript",
    "etag": "\"2671-E+WO569jS82cOUaJJ4W1yGTbEQk\"",
    "mtime": "2023-08-07T13:15:29.166Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.a3852bd2.js"
  },
  "/_nuxt/orders.a3852bd2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bae-T3WO4hJtQZoqr/M6lUuTiRHmC+s\"",
    "mtime": "2023-08-07T13:15:30.343Z",
    "size": 2990,
    "path": "../public/_nuxt/orders.a3852bd2.js.br"
  },
  "/_nuxt/orders.a3852bd2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"da9-YsYszrHrDrNtnbsgPGkvhNpr054\"",
    "mtime": "2023-08-07T13:15:30.330Z",
    "size": 3497,
    "path": "../public/_nuxt/orders.a3852bd2.js.gz"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-08-07T13:15:29.165Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-08-07T13:15:30.357Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-08-07T13:15:30.344Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-07T13:15:29.164Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-08-07T13:15:29.163Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-08-07T13:15:30.395Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-08-07T13:15:30.358Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/profile.fe1a5715.js": {
    "type": "application/javascript",
    "etag": "\"1688-R8rrc5A79Mff0l3dkD4xumnNgYY\"",
    "mtime": "2023-08-07T13:15:29.162Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.fe1a5715.js"
  },
  "/_nuxt/profile.fe1a5715.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83a-XcyR4+jTC6FZ283LW+NtmP+VVZI\"",
    "mtime": "2023-08-07T13:15:30.403Z",
    "size": 2106,
    "path": "../public/_nuxt/profile.fe1a5715.js.br"
  },
  "/_nuxt/profile.fe1a5715.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99e-NxOpRTNJjjJVYuQIPnpGJ+7D1bI\"",
    "mtime": "2023-08-07T13:15:30.396Z",
    "size": 2462,
    "path": "../public/_nuxt/profile.fe1a5715.js.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-08-07T13:15:29.161Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-08-07T13:15:30.406Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-08-07T13:15:30.403Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.bde311cb.js": {
    "type": "application/javascript",
    "etag": "\"111b-Z9NoBb1ET/jFioI0adxdcPX6JsA\"",
    "mtime": "2023-08-07T13:15:29.157Z",
    "size": 4379,
    "path": "../public/_nuxt/register.bde311cb.js"
  },
  "/_nuxt/register.bde311cb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56c-x7nOSMbQdF4nICpTkFj9U/FQJuA\"",
    "mtime": "2023-08-07T13:15:30.415Z",
    "size": 1388,
    "path": "../public/_nuxt/register.bde311cb.js.br"
  },
  "/_nuxt/register.bde311cb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68e-gR5iI5QOgL+XfYR3iL2txiJ5wP8\"",
    "mtime": "2023-08-07T13:15:30.407Z",
    "size": 1678,
    "path": "../public/_nuxt/register.bde311cb.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-07T13:15:29.156Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-07T13:15:29.155Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-07T13:15:30.422Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-07T13:15:30.418Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-07T13:15:29.154Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-07T13:15:29.151Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
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

const _lazy_KJmAMi = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_KJmAMi, lazy: true, middleware: false, method: undefined },
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
