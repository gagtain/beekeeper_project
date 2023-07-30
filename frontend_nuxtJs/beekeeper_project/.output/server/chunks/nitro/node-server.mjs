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
    "etag": "\"1b45c-8suD/bQhjV4ojgFi8eBYZ7Einyo\"",
    "mtime": "2023-07-30T05:10:39.902Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-30T05:10:39.892Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-07-30T05:10:39.889Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.70463914.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-zPv+yNQRgSiyRq30xV+2TpZ28YA\"",
    "mtime": "2023-07-30T05:10:39.889Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.70463914.css"
  },
  "/_nuxt/BasketInfo.70463914.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-n8Pf6m13vKTG2FGvHcJqAyS/wG8\"",
    "mtime": "2023-07-30T05:10:39.943Z",
    "size": 1771,
    "path": "../public/_nuxt/BasketInfo.70463914.css.br"
  },
  "/_nuxt/BasketInfo.70463914.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-h3heeYHzj3jVC5Sp12i+VO9vLMk\"",
    "mtime": "2023-07-30T05:10:39.908Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.70463914.css.gz"
  },
  "/_nuxt/BasketInfo.77346fb1.js": {
    "type": "application/javascript",
    "etag": "\"95e-UbUgcSpJDwmFqqe3S4IYFd4vhP4\"",
    "mtime": "2023-07-30T05:10:39.888Z",
    "size": 2398,
    "path": "../public/_nuxt/BasketInfo.77346fb1.js"
  },
  "/_nuxt/BasketInfo.77346fb1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d7-giHMoNN0d/j9KroBoCn363qLHrM\"",
    "mtime": "2023-07-30T05:10:39.948Z",
    "size": 983,
    "path": "../public/_nuxt/BasketInfo.77346fb1.js.br"
  },
  "/_nuxt/BasketInfo.77346fb1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"498-2ZlBjW19s+LaW6BEgycKf0u5p30\"",
    "mtime": "2023-07-30T05:10:39.944Z",
    "size": 1176,
    "path": "../public/_nuxt/BasketInfo.77346fb1.js.gz"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e93-G3xI4VCnp/o1PJ6X8jCePAboJ84\"",
    "mtime": "2023-07-30T05:10:39.887Z",
    "size": 7827,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b8-fo8PX5NfK5pkMKGxQThnf58E9Jk\"",
    "mtime": "2023-07-30T05:10:39.957Z",
    "size": 1720,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.br"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ce-exicXpkBf+OSryzPSXTK9KyUmWY\"",
    "mtime": "2023-07-30T05:10:39.949Z",
    "size": 1998,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.gz"
  },
  "/_nuxt/CatalogProduct.b64d35d1.js": {
    "type": "application/javascript",
    "etag": "\"e3e-PnML24obRpYJjZlEhqpDs05YEsY\"",
    "mtime": "2023-07-30T05:10:39.886Z",
    "size": 3646,
    "path": "../public/_nuxt/CatalogProduct.b64d35d1.js"
  },
  "/_nuxt/CatalogProduct.b64d35d1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"570-0650I0RAIYDXBosmwRXDzZgGn2E\"",
    "mtime": "2023-07-30T05:10:39.963Z",
    "size": 1392,
    "path": "../public/_nuxt/CatalogProduct.b64d35d1.js.br"
  },
  "/_nuxt/CatalogProduct.b64d35d1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"62f-57KwKfSbBEXFAEzGXuKqrHYGJfU\"",
    "mtime": "2023-07-30T05:10:39.958Z",
    "size": 1583,
    "path": "../public/_nuxt/CatalogProduct.b64d35d1.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-07-30T05:10:39.885Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-07-30T05:10:39.980Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-07-30T05:10:39.964Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.c8108d24.js": {
    "type": "application/javascript",
    "etag": "\"b70-oxubJTn0wtbKhoRK2BskkpFrESE\"",
    "mtime": "2023-07-30T05:10:39.884Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.c8108d24.js"
  },
  "/_nuxt/FavoriteComp.c8108d24.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"382-ikxDQ5xwiaDnaIiHoU8zTUqy+Gg\"",
    "mtime": "2023-07-30T05:10:39.986Z",
    "size": 898,
    "path": "../public/_nuxt/FavoriteComp.c8108d24.js.br"
  },
  "/_nuxt/FavoriteComp.c8108d24.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40a-bPNVTv8pY/y27G1oSrpt6vx9tis\"",
    "mtime": "2023-07-30T05:10:39.981Z",
    "size": 1034,
    "path": "../public/_nuxt/FavoriteComp.c8108d24.js.gz"
  },
  "/_nuxt/FavoriteComp.dcfbc193.js": {
    "type": "application/javascript",
    "etag": "\"783-bdxbRBJoD18Iak3eFZ3HRkG6jzw\"",
    "mtime": "2023-07-30T05:10:39.883Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.dcfbc193.js"
  },
  "/_nuxt/FavoriteComp.dcfbc193.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-/Ugv5MqHObXbLwuEoGp9LvK6CF8\"",
    "mtime": "2023-07-30T05:10:39.990Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.dcfbc193.js.br"
  },
  "/_nuxt/FavoriteComp.dcfbc193.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f8-nvCA7VBS3TyQH48z8kx65CU+fvM\"",
    "mtime": "2023-07-30T05:10:39.986Z",
    "size": 760,
    "path": "../public/_nuxt/FavoriteComp.dcfbc193.js.gz"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1075-+RyDT2IQ2kPAAeedkmauBBTojb4\"",
    "mtime": "2023-07-30T05:10:39.883Z",
    "size": 4213,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bf-JW4WSiPepHevCg4JEO5/wP+oJBc\"",
    "mtime": "2023-07-30T05:10:39.995Z",
    "size": 959,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.br"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"489-HKAlc4bFKl4JU8yY+X+vzpaRT78\"",
    "mtime": "2023-07-30T05:10:39.990Z",
    "size": 1161,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.gz"
  },
  "/_nuxt/ImageForm.db606c43.js": {
    "type": "application/javascript",
    "etag": "\"225-1odZuOKtVyOh9yysdl3rypcqv2E\"",
    "mtime": "2023-07-30T05:10:39.882Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.db606c43.js"
  },
  "/_nuxt/LoadingComp.a65792c9.js": {
    "type": "application/javascript",
    "etag": "\"1fe-HUx49qDEUPag1m2ALe7XThr09wU\"",
    "mtime": "2023-07-30T05:10:39.881Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.a65792c9.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-30T05:10:39.880Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.4911ba29.js": {
    "type": "application/javascript",
    "etag": "\"43e-TBOAMhYM1UiFjnIoS4Oh2pP7xVo\"",
    "mtime": "2023-07-30T05:10:39.879Z",
    "size": 1086,
    "path": "../public/_nuxt/OrderProductList.4911ba29.js"
  },
  "/_nuxt/OrderProductList.4911ba29.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"202-c9KX8atjTYk8zxjbJA/AaoQpyxM\"",
    "mtime": "2023-07-30T05:10:39.999Z",
    "size": 514,
    "path": "../public/_nuxt/OrderProductList.4911ba29.js.br"
  },
  "/_nuxt/OrderProductList.4911ba29.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23f-thfX+VIneIU6ey8SxL3QGgy9RzM\"",
    "mtime": "2023-07-30T05:10:39.997Z",
    "size": 575,
    "path": "../public/_nuxt/OrderProductList.4911ba29.js.gz"
  },
  "/_nuxt/OrderProductList.6e291755.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-kGe7K192U1JYkwgh+N3+8GkaUOw\"",
    "mtime": "2023-07-30T05:10:39.879Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.6e291755.css"
  },
  "/_nuxt/OrderProductList.6e291755.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-tvuxaPNE1HA4DzysCe2QnLSdC1E\"",
    "mtime": "2023-07-30T05:10:40.002Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.br"
  },
  "/_nuxt/OrderProductList.6e291755.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-LbyXo24uolM39yqPdCpOhJF08BU\"",
    "mtime": "2023-07-30T05:10:40.000Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.gz"
  },
  "/_nuxt/UserBasket.74525ff3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-GktDk3Ud/dCJKFz3gOEcHMboClE\"",
    "mtime": "2023-07-30T05:10:39.878Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.74525ff3.css"
  },
  "/_nuxt/UserBasket.74525ff3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a2-vEscIRE7Ii74jC5guhiaXQXYCSg\"",
    "mtime": "2023-07-30T05:10:40.019Z",
    "size": 1698,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.br"
  },
  "/_nuxt/UserBasket.74525ff3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-coTaaCik2Gh4ZeF6NzmWRzcvtgc\"",
    "mtime": "2023-07-30T05:10:40.002Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.gz"
  },
  "/_nuxt/UserBasket.952d63fe.js": {
    "type": "application/javascript",
    "etag": "\"13e2-P3hs0CONWyo2HiuBOS58zQYifwE\"",
    "mtime": "2023-07-30T05:10:39.877Z",
    "size": 5090,
    "path": "../public/_nuxt/UserBasket.952d63fe.js"
  },
  "/_nuxt/UserBasket.952d63fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"77b-E7v3dr82cVlD/nq5VPWOZMCVs5c\"",
    "mtime": "2023-07-30T05:10:40.026Z",
    "size": 1915,
    "path": "../public/_nuxt/UserBasket.952d63fe.js.br"
  },
  "/_nuxt/UserBasket.952d63fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88b-qOSQsAHKYg57Zyy+fZOkyEwKgqc\"",
    "mtime": "2023-07-30T05:10:40.020Z",
    "size": 2187,
    "path": "../public/_nuxt/UserBasket.952d63fe.js.gz"
  },
  "/_nuxt/_id_.733a034c.js": {
    "type": "application/javascript",
    "etag": "\"4be-dsFbmoz2GvMweSiMyAHL8MDUVM4\"",
    "mtime": "2023-07-30T05:10:39.876Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.733a034c.js"
  },
  "/_nuxt/_id_.733a034c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"269-hrZzHRyMsLsAwpHn870AlkrlGJQ\"",
    "mtime": "2023-07-30T05:10:40.029Z",
    "size": 617,
    "path": "../public/_nuxt/_id_.733a034c.js.br"
  },
  "/_nuxt/_id_.733a034c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dc-Gu+60g04ea7/C5ypbzhqiQCw36A\"",
    "mtime": "2023-07-30T05:10:40.027Z",
    "size": 732,
    "path": "../public/_nuxt/_id_.733a034c.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-30T05:10:39.875Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.979e8500.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-ZSQymBUeZM4aYKucSaWpk67lzTg\"",
    "mtime": "2023-07-30T05:10:39.874Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.979e8500.css"
  },
  "/_nuxt/_id_.979e8500.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8KZGT0unAXpGxmvwnDrhxlGxhGQ\"",
    "mtime": "2023-07-30T05:10:40.045Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.979e8500.css.br"
  },
  "/_nuxt/_id_.979e8500.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"685-wxGzSLQku1+oQBLsK97I+i/DFUE\"",
    "mtime": "2023-07-30T05:10:40.030Z",
    "size": 1669,
    "path": "../public/_nuxt/_id_.979e8500.css.gz"
  },
  "/_nuxt/_id_.9ce7e80b.js": {
    "type": "application/javascript",
    "etag": "\"135b-ymWNDM941bF0MpKoZR5bFDlp4pU\"",
    "mtime": "2023-07-30T05:10:39.873Z",
    "size": 4955,
    "path": "../public/_nuxt/_id_.9ce7e80b.js"
  },
  "/_nuxt/_id_.9ce7e80b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"79d-eHjptuPXD9y59CVLnM8vrSU/4ks\"",
    "mtime": "2023-07-30T05:10:40.051Z",
    "size": 1949,
    "path": "../public/_nuxt/_id_.9ce7e80b.js.br"
  },
  "/_nuxt/_id_.9ce7e80b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88a-sEUa2SzCKq+CLNzol+CyymxYQDI\"",
    "mtime": "2023-07-30T05:10:40.045Z",
    "size": 2186,
    "path": "../public/_nuxt/_id_.9ce7e80b.js.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-30T05:10:39.872Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-30T05:10:40.059Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-30T05:10:40.052Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.cd11d160.js": {
    "type": "application/javascript",
    "etag": "\"26e-aY5Yq9qT8cGdyLcEB7LU/JyaWws\"",
    "mtime": "2023-07-30T05:10:39.872Z",
    "size": 622,
    "path": "../public/_nuxt/basket.cd11d160.js"
  },
  "/_nuxt/catalog.9fa13ab0.js": {
    "type": "application/javascript",
    "etag": "\"1afb-3IoLDMjd9wwLAH7b+mbqf6xE/Jk\"",
    "mtime": "2023-07-30T05:10:39.871Z",
    "size": 6907,
    "path": "../public/_nuxt/catalog.9fa13ab0.js"
  },
  "/_nuxt/catalog.9fa13ab0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"914-FnRM8Tuazbmpsk3ubZMEqaCv3M8\"",
    "mtime": "2023-07-30T05:10:40.068Z",
    "size": 2324,
    "path": "../public/_nuxt/catalog.9fa13ab0.js.br"
  },
  "/_nuxt/catalog.9fa13ab0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a75-kxdHn2uswAxmNa9j1VSxy4aL1J8\"",
    "mtime": "2023-07-30T05:10:40.060Z",
    "size": 2677,
    "path": "../public/_nuxt/catalog.9fa13ab0.js.gz"
  },
  "/_nuxt/catalog.c2e7c6d6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1da3-aCCxn+Zkv4BFljQHLLsTm04msLk\"",
    "mtime": "2023-07-30T05:10:39.870Z",
    "size": 7587,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css"
  },
  "/_nuxt/catalog.c2e7c6d6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c7-hrhJnFWPDdCo/GhFXaSRfJQYMSY\"",
    "mtime": "2023-07-30T05:10:40.077Z",
    "size": 1735,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css.br"
  },
  "/_nuxt/catalog.c2e7c6d6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7da-eR4r47V1m7xcnLakAWR1Sw/hGac\"",
    "mtime": "2023-07-30T05:10:40.069Z",
    "size": 2010,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-30T05:10:39.869Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.17cb7803.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-seC/x+j70WFJ5vaqn7kskkqvt2g\"",
    "mtime": "2023-07-30T05:10:39.868Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.17cb7803.css"
  },
  "/_nuxt/checkout.17cb7803.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fdc-/3nDOo514/3WQZxELo/UpKFgTW0\"",
    "mtime": "2023-07-30T05:10:40.187Z",
    "size": 20444,
    "path": "../public/_nuxt/checkout.17cb7803.css.br"
  },
  "/_nuxt/checkout.17cb7803.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-laGipaJGR9bzL61kvl5diSNdlaI\"",
    "mtime": "2023-07-30T05:10:40.080Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.17cb7803.css.gz"
  },
  "/_nuxt/checkout.7e87f9b5.js": {
    "type": "application/javascript",
    "etag": "\"148fa-N4Sh8rl4tYqRoNxQp49140s4b0I\"",
    "mtime": "2023-07-30T05:10:39.866Z",
    "size": 84218,
    "path": "../public/_nuxt/checkout.7e87f9b5.js"
  },
  "/_nuxt/checkout.7e87f9b5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"512a-JYnQWgwbYwbgbpyRLTcOFm96rYY\"",
    "mtime": "2023-07-30T05:10:40.285Z",
    "size": 20778,
    "path": "../public/_nuxt/checkout.7e87f9b5.js.br"
  },
  "/_nuxt/checkout.7e87f9b5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e4a-gwfq6UfPcM2a8WWcBRZJUkd2VrU\"",
    "mtime": "2023-07-30T05:10:40.190Z",
    "size": 24138,
    "path": "../public/_nuxt/checkout.7e87f9b5.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-30T05:10:39.865Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.4e9bea75.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"249e-7iHU3PloHkXzOHB1XpweEcPyWgA\"",
    "mtime": "2023-07-30T05:10:39.864Z",
    "size": 9374,
    "path": "../public/_nuxt/entry.4e9bea75.css"
  },
  "/_nuxt/entry.4e9bea75.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"909-SMV70JX5U2cW0mB14iqbNkXxN7Y\"",
    "mtime": "2023-07-30T05:10:40.296Z",
    "size": 2313,
    "path": "../public/_nuxt/entry.4e9bea75.css.br"
  },
  "/_nuxt/entry.4e9bea75.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a6a-0RP553Yy08Qm9hZd8iT/BxQKJ9o\"",
    "mtime": "2023-07-30T05:10:40.286Z",
    "size": 2666,
    "path": "../public/_nuxt/entry.4e9bea75.css.gz"
  },
  "/_nuxt/entry.ebeb19e1.js": {
    "type": "application/javascript",
    "etag": "\"3434a-t4y5PNhwt1f/Du07WMHnZhSnl+w\"",
    "mtime": "2023-07-30T05:10:39.863Z",
    "size": 213834,
    "path": "../public/_nuxt/entry.ebeb19e1.js"
  },
  "/_nuxt/entry.ebeb19e1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11718-4InuPNbMP3ruS5ldylDSsw5jkFU\"",
    "mtime": "2023-07-30T05:10:40.629Z",
    "size": 71448,
    "path": "../public/_nuxt/entry.ebeb19e1.js.br"
  },
  "/_nuxt/entry.ebeb19e1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13999-OEp0cU1lKobAMj6pcckAoHwUPds\"",
    "mtime": "2023-07-30T05:10:40.304Z",
    "size": 80281,
    "path": "../public/_nuxt/entry.ebeb19e1.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-30T05:10:39.862Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-30T05:10:40.634Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-30T05:10:40.629Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.5b0cd14a.js": {
    "type": "application/javascript",
    "etag": "\"8a4-hF9F7YphMP/rWsPhDv5dEAsLqQU\"",
    "mtime": "2023-07-30T05:10:39.861Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.5b0cd14a.js"
  },
  "/_nuxt/error-404.5b0cd14a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cd-5QeE1+cyJq2ymD12B6MwRahyEsA\"",
    "mtime": "2023-07-30T05:10:40.638Z",
    "size": 973,
    "path": "../public/_nuxt/error-404.5b0cd14a.js.br"
  },
  "/_nuxt/error-404.5b0cd14a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-RYEacs7YPab7cfEpxTDvn/sKjOg\"",
    "mtime": "2023-07-30T05:10:40.634Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.5b0cd14a.js.gz"
  },
  "/_nuxt/error-500.06ddfeab.js": {
    "type": "application/javascript",
    "etag": "\"757-ZTODvfU0kFovdprxfsCIFiGjGNY\"",
    "mtime": "2023-07-30T05:10:39.860Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.06ddfeab.js"
  },
  "/_nuxt/error-500.06ddfeab.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34b-wAieuVcAULND4Dpmj7v2d7jcFA0\"",
    "mtime": "2023-07-30T05:10:40.641Z",
    "size": 843,
    "path": "../public/_nuxt/error-500.06ddfeab.js.br"
  },
  "/_nuxt/error-500.06ddfeab.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-MTmPZxTSjIqGXneVbEWoIEim2dk\"",
    "mtime": "2023-07-30T05:10:40.638Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.06ddfeab.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-30T05:10:39.860Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-30T05:10:40.644Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-30T05:10:40.642Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.5b6439ad.js": {
    "type": "application/javascript",
    "etag": "\"45e-aJfLw4Jlj325BUYHTos0kHknsis\"",
    "mtime": "2023-07-30T05:10:39.859Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.5b6439ad.js"
  },
  "/_nuxt/error-component.5b6439ad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-R+2d/Wg7CCfMNB04mGbDqK5qwt0\"",
    "mtime": "2023-07-30T05:10:40.647Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.5b6439ad.js.br"
  },
  "/_nuxt/error-component.5b6439ad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25d-/605KXfwqA6AIDSEhMI4oLUWjdg\"",
    "mtime": "2023-07-30T05:10:40.645Z",
    "size": 605,
    "path": "../public/_nuxt/error-component.5b6439ad.js.gz"
  },
  "/_nuxt/favorite.35b03e02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-TdwA+Lp1YcFEqpovyPoJuLI5Xto\"",
    "mtime": "2023-07-30T05:10:39.858Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.35b03e02.css"
  },
  "/_nuxt/favorite.35b03e02.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-PyzoVM3jh9aCuAWa5MNu0d3bKFA\"",
    "mtime": "2023-07-30T05:10:40.655Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.35b03e02.css.br"
  },
  "/_nuxt/favorite.35b03e02.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-DgD1qExPmPpf7Y+V1nzmNqM97pk\"",
    "mtime": "2023-07-30T05:10:40.648Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.35b03e02.css.gz"
  },
  "/_nuxt/favorite.67444b32.js": {
    "type": "application/javascript",
    "etag": "\"9f6-/i3NBNhi+TdvKS1HDyOJ/pYDxnw\"",
    "mtime": "2023-07-30T05:10:39.857Z",
    "size": 2550,
    "path": "../public/_nuxt/favorite.67444b32.js"
  },
  "/_nuxt/favorite.67444b32.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"437-Eu/lToO9M+loo5/vj1dGmgLg8po\"",
    "mtime": "2023-07-30T05:10:40.660Z",
    "size": 1079,
    "path": "../public/_nuxt/favorite.67444b32.js.br"
  },
  "/_nuxt/favorite.67444b32.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4e3-UV7uQO0h97eLqoqSbrz3O6Bm3UQ\"",
    "mtime": "2023-07-30T05:10:40.656Z",
    "size": 1251,
    "path": "../public/_nuxt/favorite.67444b32.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-07-30T05:10:39.856Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-30T05:10:39.854Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.27f33d8c.js": {
    "type": "application/javascript",
    "etag": "\"3abf-5i8tZIqiKXdMMWq4z8eQqH7gTXA\"",
    "mtime": "2023-07-30T05:10:39.852Z",
    "size": 15039,
    "path": "../public/_nuxt/index.27f33d8c.js"
  },
  "/_nuxt/index.27f33d8c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f7-HaK7NBNOT0hdqLXIp69ECBiJiS8\"",
    "mtime": "2023-07-30T05:10:40.679Z",
    "size": 4855,
    "path": "../public/_nuxt/index.27f33d8c.js.br"
  },
  "/_nuxt/index.27f33d8c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-pSByduoRyUFOvOjZjjpHkP3fXwQ\"",
    "mtime": "2023-07-30T05:10:40.662Z",
    "size": 5360,
    "path": "../public/_nuxt/index.27f33d8c.js.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-07-30T05:10:39.851Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-07-30T05:10:40.683Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-07-30T05:10:40.680Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.af18d356.js": {
    "type": "application/javascript",
    "etag": "\"605-vXfAmp8FHkh9fgw30CT4qqxOVoQ\"",
    "mtime": "2023-07-30T05:10:39.850Z",
    "size": 1541,
    "path": "../public/_nuxt/index.af18d356.js"
  },
  "/_nuxt/index.af18d356.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2f7-aFM9tx3xqOAiuVnegLQeA1Si6Tg\"",
    "mtime": "2023-07-30T05:10:40.686Z",
    "size": 759,
    "path": "../public/_nuxt/index.af18d356.js.br"
  },
  "/_nuxt/index.af18d356.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38c-cypPEqF3kVv+tRTI4nLq2ams1Tc\"",
    "mtime": "2023-07-30T05:10:40.684Z",
    "size": 908,
    "path": "../public/_nuxt/index.af18d356.js.gz"
  },
  "/_nuxt/index.bd9c2d5d.js": {
    "type": "application/javascript",
    "etag": "\"16a34-O1tbkNXdOAY4o+13vJJrI9LgpgM\"",
    "mtime": "2023-07-30T05:10:39.849Z",
    "size": 92724,
    "path": "../public/_nuxt/index.bd9c2d5d.js"
  },
  "/_nuxt/index.bd9c2d5d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"631b-gdP2JJcHFwC2R5ab4/a0Oh2++kg\"",
    "mtime": "2023-07-30T05:10:40.798Z",
    "size": 25371,
    "path": "../public/_nuxt/index.bd9c2d5d.js.br"
  },
  "/_nuxt/index.bd9c2d5d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f74-KvNwxGsBwp+vq91rCxx5mKxUCMo\"",
    "mtime": "2023-07-30T05:10:40.690Z",
    "size": 28532,
    "path": "../public/_nuxt/index.bd9c2d5d.js.gz"
  },
  "/_nuxt/index.cbdafc32.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-Oie/RaCJVCWMrr1e8vvhLcrY4Bk\"",
    "mtime": "2023-07-30T05:10:39.848Z",
    "size": 22587,
    "path": "../public/_nuxt/index.cbdafc32.css"
  },
  "/_nuxt/index.cbdafc32.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127b-YZmZg4aOPR0XJ/C5KRuDlZ5nYg8\"",
    "mtime": "2023-07-30T05:10:40.826Z",
    "size": 4731,
    "path": "../public/_nuxt/index.cbdafc32.css.br"
  },
  "/_nuxt/index.cbdafc32.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-IQikMBDJcQDMumEslo1kpG8ZKxM\"",
    "mtime": "2023-07-30T05:10:40.800Z",
    "size": 5602,
    "path": "../public/_nuxt/index.cbdafc32.css.gz"
  },
  "/_nuxt/isAuth.7e167860.js": {
    "type": "application/javascript",
    "etag": "\"213-UlVT3v1m23BplAsGyihjS+DpugQ\"",
    "mtime": "2023-07-30T05:10:39.847Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.7e167860.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-30T05:10:39.846Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-30T05:10:40.831Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-30T05:10:40.828Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.965d3399.js": {
    "type": "application/javascript",
    "etag": "\"830-NmVRq2yu+mhwmlzvK4AHbOxEy2Q\"",
    "mtime": "2023-07-30T05:10:39.845Z",
    "size": 2096,
    "path": "../public/_nuxt/login.965d3399.js"
  },
  "/_nuxt/login.965d3399.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-tuHkC6dBk9yUwZKhB8V6wNEoEKQ\"",
    "mtime": "2023-07-30T05:10:40.837Z",
    "size": 985,
    "path": "../public/_nuxt/login.965d3399.js.br"
  },
  "/_nuxt/login.965d3399.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a8-wksVooG0xRfJ2yHQertf8cFvdqk\"",
    "mtime": "2023-07-30T05:10:40.832Z",
    "size": 1192,
    "path": "../public/_nuxt/login.965d3399.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-30T05:10:39.845Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.6a4bda07.js": {
    "type": "application/javascript",
    "etag": "\"4af-42RTkAsAGESBfwcu3exAqr3DEOc\"",
    "mtime": "2023-07-30T05:10:39.842Z",
    "size": 1199,
    "path": "../public/_nuxt/news.6a4bda07.js"
  },
  "/_nuxt/news.6a4bda07.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a6-DAPGpH+aIKqDKtSC9V42WqfdYvo\"",
    "mtime": "2023-07-30T05:10:40.841Z",
    "size": 422,
    "path": "../public/_nuxt/news.6a4bda07.js.br"
  },
  "/_nuxt/news.6a4bda07.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"216-MB3Rme2wsODmSUSsbye0RbLBsqY\"",
    "mtime": "2023-07-30T05:10:40.838Z",
    "size": 534,
    "path": "../public/_nuxt/news.6a4bda07.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-30T05:10:39.840Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.1803831f.js": {
    "type": "application/javascript",
    "etag": "\"10a-CwZODFzuoxdAZFwbFZqxT0HR9lo\"",
    "mtime": "2023-07-30T05:10:39.839Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.1803831f.js"
  },
  "/_nuxt/orders.c2bbb9ea.js": {
    "type": "application/javascript",
    "etag": "\"2671-rb1DlAT1pCC6/L3Sqg4F8TEyTFs\"",
    "mtime": "2023-07-30T05:10:39.839Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.c2bbb9ea.js"
  },
  "/_nuxt/orders.c2bbb9ea.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"ba8-DGOFdcS//wEE0B8hxV8DKdIcFWM\"",
    "mtime": "2023-07-30T05:10:40.855Z",
    "size": 2984,
    "path": "../public/_nuxt/orders.c2bbb9ea.js.br"
  },
  "/_nuxt/orders.c2bbb9ea.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"da8-Y1wVo0hWIbQVKlU7kZ7+Kgb92B8\"",
    "mtime": "2023-07-30T05:10:40.842Z",
    "size": 3496,
    "path": "../public/_nuxt/orders.c2bbb9ea.js.gz"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-07-30T05:10:39.838Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-07-30T05:10:40.867Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-07-30T05:10:40.856Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-30T05:10:39.837Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.0c07f47b.js": {
    "type": "application/javascript",
    "etag": "\"1688-fZlHJsocDWqAW6UQL3d6gm+tgQM\"",
    "mtime": "2023-07-30T05:10:39.835Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.0c07f47b.js"
  },
  "/_nuxt/profile.0c07f47b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"833-2kilSj8HLuthJqfvpCC37IRfTG4\"",
    "mtime": "2023-07-30T05:10:40.875Z",
    "size": 2099,
    "path": "../public/_nuxt/profile.0c07f47b.js.br"
  },
  "/_nuxt/profile.0c07f47b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99e-eggBzw85G0oSXhmdeDjqpDbuqjU\"",
    "mtime": "2023-07-30T05:10:40.868Z",
    "size": 2462,
    "path": "../public/_nuxt/profile.0c07f47b.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-07-30T05:10:39.834Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-07-30T05:10:40.913Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-07-30T05:10:40.876Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-30T05:10:39.833Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-30T05:10:40.916Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-30T05:10:40.913Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.38c9ae02.js": {
    "type": "application/javascript",
    "etag": "\"111b-n9ylWvjwmMXKYAtobPJahYj2eG8\"",
    "mtime": "2023-07-30T05:10:39.833Z",
    "size": 4379,
    "path": "../public/_nuxt/register.38c9ae02.js"
  },
  "/_nuxt/register.38c9ae02.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"567-5NLVZBCrShUsCwkB0RUIAFxktHA\"",
    "mtime": "2023-07-30T05:10:40.923Z",
    "size": 1383,
    "path": "../public/_nuxt/register.38c9ae02.js.br"
  },
  "/_nuxt/register.38c9ae02.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68d-VM5TCaJI3b5aKJo4jswBLg2Jza4\"",
    "mtime": "2023-07-30T05:10:40.917Z",
    "size": 1677,
    "path": "../public/_nuxt/register.38c9ae02.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-30T05:10:39.832Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-30T05:10:39.831Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-30T05:10:40.926Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-30T05:10:40.924Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-30T05:10:39.830Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-30T05:10:39.827Z",
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
