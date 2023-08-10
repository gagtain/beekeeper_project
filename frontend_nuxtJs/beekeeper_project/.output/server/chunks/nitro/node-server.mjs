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
    "mtime": "2023-08-10T17:12:33.665Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-10T17:12:33.663Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-10T17:12:33.661Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.92393258.js": {
    "type": "application/javascript",
    "etag": "\"9a2-K+hPQD665MkLYMtZnrcffzT4ys8\"",
    "mtime": "2023-08-10T17:12:33.661Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.92393258.js"
  },
  "/_nuxt/BasketInfo.92393258.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f1-hQ5Fa0fzaM9yBpRHgtlFVDtR1qE\"",
    "mtime": "2023-08-10T17:12:33.672Z",
    "size": 1009,
    "path": "../public/_nuxt/BasketInfo.92393258.js.br"
  },
  "/_nuxt/BasketInfo.92393258.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ba-xWaSBWLTV2LUIHHAl7H83ctli1M\"",
    "mtime": "2023-08-10T17:12:33.668Z",
    "size": 1210,
    "path": "../public/_nuxt/BasketInfo.92393258.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-10T17:12:33.660Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-10T17:12:33.698Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-10T17:12:33.673Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.418d0c48.js": {
    "type": "application/javascript",
    "etag": "\"10b0-LmGvX2DRLoOjnqU4u9pKEk1bn2I\"",
    "mtime": "2023-08-10T17:12:33.660Z",
    "size": 4272,
    "path": "../public/_nuxt/CatalogProduct.418d0c48.js"
  },
  "/_nuxt/CatalogProduct.418d0c48.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"61d-nspktDDGxgad0yXbxGzu0MdL+xY\"",
    "mtime": "2023-08-10T17:12:33.704Z",
    "size": 1565,
    "path": "../public/_nuxt/CatalogProduct.418d0c48.js.br"
  },
  "/_nuxt/CatalogProduct.418d0c48.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"704-Sh3LzhG1DlZXrSWgKP5vYoPbefo\"",
    "mtime": "2023-08-10T17:12:33.698Z",
    "size": 1796,
    "path": "../public/_nuxt/CatalogProduct.418d0c48.js.gz"
  },
  "/_nuxt/CatalogProduct.56d78c92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29be-tJyARoayFZP92u4mdmhVu3/0r5w\"",
    "mtime": "2023-08-10T17:12:33.659Z",
    "size": 10686,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css"
  },
  "/_nuxt/CatalogProduct.56d78c92.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75d-4luw27pYrIVri/qlxGJsq2VcxFU\"",
    "mtime": "2023-08-10T17:12:33.716Z",
    "size": 1885,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css.br"
  },
  "/_nuxt/CatalogProduct.56d78c92.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8a2-u21lnmRWwSyQBi5GcMwU0BS3pHc\"",
    "mtime": "2023-08-10T17:12:33.705Z",
    "size": 2210,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css.gz"
  },
  "/_nuxt/FavoriteComp.47b551e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b6-dY2JGwtMmifjiaay8WqeQt8Kfzo\"",
    "mtime": "2023-08-10T17:12:33.659Z",
    "size": 4278,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css"
  },
  "/_nuxt/FavoriteComp.47b551e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c6-SBvzG9Axbj/LRMYSI/ra11+o0fI\"",
    "mtime": "2023-08-10T17:12:33.722Z",
    "size": 966,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css.br"
  },
  "/_nuxt/FavoriteComp.47b551e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"490-kMa+3Kk3hjSDO6HYIagg8va7kRQ\"",
    "mtime": "2023-08-10T17:12:33.717Z",
    "size": 1168,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-10T17:12:33.658Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-10T17:12:33.739Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-10T17:12:33.723Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.e7442833.js": {
    "type": "application/javascript",
    "etag": "\"b70-H9xrVqSU08CtbBG2C83v1YKwYHM\"",
    "mtime": "2023-08-10T17:12:33.658Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.e7442833.js"
  },
  "/_nuxt/FavoriteComp.e7442833.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"380-/jHw2Nke62bd27yOmucR43bprrs\"",
    "mtime": "2023-08-10T17:12:33.745Z",
    "size": 896,
    "path": "../public/_nuxt/FavoriteComp.e7442833.js.br"
  },
  "/_nuxt/FavoriteComp.e7442833.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40b-6cAJtIlC04zbVCbEadN2n9tvEAs\"",
    "mtime": "2023-08-10T17:12:33.740Z",
    "size": 1035,
    "path": "../public/_nuxt/FavoriteComp.e7442833.js.gz"
  },
  "/_nuxt/FavoriteComp.eb42f434.js": {
    "type": "application/javascript",
    "etag": "\"783-W0HCLblCUMhCqIiHbMKn5C0KWt8\"",
    "mtime": "2023-08-10T17:12:33.657Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.eb42f434.js"
  },
  "/_nuxt/FavoriteComp.eb42f434.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28d-m1CRuZ8s/jRgz9oJwrxGxG8Yho4\"",
    "mtime": "2023-08-10T17:12:33.749Z",
    "size": 653,
    "path": "../public/_nuxt/FavoriteComp.eb42f434.js.br"
  },
  "/_nuxt/FavoriteComp.eb42f434.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f9-ZCC0nsgWyw9CJOY19n7nZz9/RcQ\"",
    "mtime": "2023-08-10T17:12:33.746Z",
    "size": 761,
    "path": "../public/_nuxt/FavoriteComp.eb42f434.js.gz"
  },
  "/_nuxt/ImageForm.7e29b84b.js": {
    "type": "application/javascript",
    "etag": "\"1ac-So2vR7rcqd1tFDNZjIpgsDyTiYU\"",
    "mtime": "2023-08-10T17:12:33.657Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.7e29b84b.js"
  },
  "/_nuxt/LoadingComp.5f1bdc6d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-YvjC7SUWV0rzk18hWG8CWb+ezmg\"",
    "mtime": "2023-08-10T17:12:33.656Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.5f1bdc6d.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-10T17:12:33.656Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-10T17:12:33.655Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-10T17:12:33.752Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-10T17:12:33.750Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.abda256f.js": {
    "type": "application/javascript",
    "etag": "\"453-dKaff6Nw6rqp4wHkDy7uH8FHce0\"",
    "mtime": "2023-08-10T17:12:33.655Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.abda256f.js"
  },
  "/_nuxt/OrderProductList.abda256f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-u14U1LuAQXqKY3s33sJs9cGhRjc\"",
    "mtime": "2023-08-10T17:12:33.755Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.abda256f.js.br"
  },
  "/_nuxt/OrderProductList.abda256f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"242-lvLrJ+bPtu3LS7lJUkeRvlEoxl8\"",
    "mtime": "2023-08-10T17:12:33.753Z",
    "size": 578,
    "path": "../public/_nuxt/OrderProductList.abda256f.js.gz"
  },
  "/_nuxt/UserBasket.08fff195.js": {
    "type": "application/javascript",
    "etag": "\"13fc-2MlTHeXnZGp62vXWhzTm/7HY384\"",
    "mtime": "2023-08-10T17:12:33.654Z",
    "size": 5116,
    "path": "../public/_nuxt/UserBasket.08fff195.js"
  },
  "/_nuxt/UserBasket.08fff195.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"784-9tPltpeppTv91ch1A+0AeWOFw1g\"",
    "mtime": "2023-08-10T17:12:33.762Z",
    "size": 1924,
    "path": "../public/_nuxt/UserBasket.08fff195.js.br"
  },
  "/_nuxt/UserBasket.08fff195.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"895-aZWeeB7VnwWv4wACUJLBa1P140o\"",
    "mtime": "2023-08-10T17:12:33.756Z",
    "size": 2197,
    "path": "../public/_nuxt/UserBasket.08fff195.js.gz"
  },
  "/_nuxt/UserBasket.854b7ba8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-tEGTqCvuYl5h8GqKoTkDj6M8JnU\"",
    "mtime": "2023-08-10T17:12:33.654Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css"
  },
  "/_nuxt/UserBasket.854b7ba8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-MTrYg4/3qluzuw+ah0PkyMz7w0E\"",
    "mtime": "2023-08-10T17:12:33.779Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.br"
  },
  "/_nuxt/UserBasket.854b7ba8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"866-oXWbMLEVAB4i7cCM2LCBX6EaYzs\"",
    "mtime": "2023-08-10T17:12:33.763Z",
    "size": 2150,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.gz"
  },
  "/_nuxt/_id_.14bf7aee.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-3EY9uDdeNVRGJz1pOfnX6k2FhEU\"",
    "mtime": "2023-08-10T17:12:33.653Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.14bf7aee.css"
  },
  "/_nuxt/_id_.14bf7aee.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-hHGiuDAaMFwEDzPucnRwBg/pSr8\"",
    "mtime": "2023-08-10T17:12:33.794Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.14bf7aee.css.br"
  },
  "/_nuxt/_id_.14bf7aee.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-2UFxED7H1NlKRUbIiMLI19mo4gQ\"",
    "mtime": "2023-08-10T17:12:33.780Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.14bf7aee.css.gz"
  },
  "/_nuxt/_id_.79afad15.js": {
    "type": "application/javascript",
    "etag": "\"1266-zGUwJYLN6e4e2S0kP2Khb1ga04M\"",
    "mtime": "2023-08-10T17:12:33.653Z",
    "size": 4710,
    "path": "../public/_nuxt/_id_.79afad15.js"
  },
  "/_nuxt/_id_.79afad15.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72b-QXy9O49grHWW8fLApHtHOx1cVWw\"",
    "mtime": "2023-08-10T17:12:33.801Z",
    "size": 1835,
    "path": "../public/_nuxt/_id_.79afad15.js.br"
  },
  "/_nuxt/_id_.79afad15.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"817-pOdIa1hG0hhculgkILbdCSvJLmM\"",
    "mtime": "2023-08-10T17:12:33.795Z",
    "size": 2071,
    "path": "../public/_nuxt/_id_.79afad15.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-08-10T17:12:33.652Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.94d2d6c0.js": {
    "type": "application/javascript",
    "etag": "\"4be-1jAX5BatOIe8HZgRrs3ZGMwWXPs\"",
    "mtime": "2023-08-10T17:12:33.652Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.94d2d6c0.js"
  },
  "/_nuxt/_id_.94d2d6c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26b-fNsDMi6d/VSVxPJPbVenJ9urKOE\"",
    "mtime": "2023-08-10T17:12:33.804Z",
    "size": 619,
    "path": "../public/_nuxt/_id_.94d2d6c0.js.br"
  },
  "/_nuxt/_id_.94d2d6c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dc-cLrJ1dbiTInSiWI/u97I8fBalTs\"",
    "mtime": "2023-08-10T17:12:33.802Z",
    "size": 732,
    "path": "../public/_nuxt/_id_.94d2d6c0.js.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-08-10T17:12:33.651Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-08-10T17:12:33.812Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-08-10T17:12:33.805Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.b34ee5bf.js": {
    "type": "application/javascript",
    "etag": "\"26e-kRjFPPTeMXRCnkQtnRfwWUxJi34\"",
    "mtime": "2023-08-10T17:12:33.650Z",
    "size": 622,
    "path": "../public/_nuxt/basket.b34ee5bf.js"
  },
  "/_nuxt/catalog.9328b3a6.js": {
    "type": "application/javascript",
    "etag": "\"1bc9-YoMRPxFFROUFtkVvF19IJflSmQo\"",
    "mtime": "2023-08-10T17:12:33.650Z",
    "size": 7113,
    "path": "../public/_nuxt/catalog.9328b3a6.js"
  },
  "/_nuxt/catalog.9328b3a6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"916-ZlaYnknVFJJiJ1T7Sefa/LSKsjk\"",
    "mtime": "2023-08-10T17:12:33.821Z",
    "size": 2326,
    "path": "../public/_nuxt/catalog.9328b3a6.js.br"
  },
  "/_nuxt/catalog.9328b3a6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a78-PzsfekFsskxSATX4vc0CWUxie0k\"",
    "mtime": "2023-08-10T17:12:33.813Z",
    "size": 2680,
    "path": "../public/_nuxt/catalog.9328b3a6.js.gz"
  },
  "/_nuxt/catalog.dfc20c1e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1df0-8d3XN/hY3mLEQuz3HDbzc8wkIdE\"",
    "mtime": "2023-08-10T17:12:33.649Z",
    "size": 7664,
    "path": "../public/_nuxt/catalog.dfc20c1e.css"
  },
  "/_nuxt/catalog.dfc20c1e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c4-MDPgiRbTVshXMc4krT1RZopBNYo\"",
    "mtime": "2023-08-10T17:12:33.829Z",
    "size": 1732,
    "path": "../public/_nuxt/catalog.dfc20c1e.css.br"
  },
  "/_nuxt/catalog.dfc20c1e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7d7-UDYDnWJuxGC6H/D02jU/5IGeXYA\"",
    "mtime": "2023-08-10T17:12:33.821Z",
    "size": 2007,
    "path": "../public/_nuxt/catalog.dfc20c1e.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-10T17:12:33.649Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.d70f111c.js": {
    "type": "application/javascript",
    "etag": "\"14f00-N4euwWxRVhiIUvHEKYNSzRraHlw\"",
    "mtime": "2023-08-10T17:12:33.648Z",
    "size": 85760,
    "path": "../public/_nuxt/checkout.d70f111c.js"
  },
  "/_nuxt/checkout.d70f111c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"525e-QTQEtx/a+fqhlygLrTdvW7piTvU\"",
    "mtime": "2023-08-10T17:12:33.927Z",
    "size": 21086,
    "path": "../public/_nuxt/checkout.d70f111c.js.br"
  },
  "/_nuxt/checkout.d70f111c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fb3-/FGTj/BviFd/rI9BZHGtfVINVds\"",
    "mtime": "2023-08-10T17:12:33.832Z",
    "size": 24499,
    "path": "../public/_nuxt/checkout.d70f111c.js.gz"
  },
  "/_nuxt/checkout.f591dc97.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-mQKRVEyNg8H+hhHRlfm3oRvavsY\"",
    "mtime": "2023-08-10T17:12:33.647Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f591dc97.css"
  },
  "/_nuxt/checkout.f591dc97.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fad-ikaSXO8Qabm0fX5INKtLK4/hH8M\"",
    "mtime": "2023-08-10T17:12:34.039Z",
    "size": 20397,
    "path": "../public/_nuxt/checkout.f591dc97.css.br"
  },
  "/_nuxt/checkout.f591dc97.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-KNCcEFQmgCq7Q3bqQ5YCUEt7a74\"",
    "mtime": "2023-08-10T17:12:33.930Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f591dc97.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-10T17:12:33.646Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.70fc591f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"253c-Om+NVeudnoT2INCYQoLONzXk7hs\"",
    "mtime": "2023-08-10T17:12:33.645Z",
    "size": 9532,
    "path": "../public/_nuxt/entry.70fc591f.css"
  },
  "/_nuxt/entry.70fc591f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"931-Frn2LFdRvngr6ou3M83Yuca4k+Q\"",
    "mtime": "2023-08-10T17:12:34.055Z",
    "size": 2353,
    "path": "../public/_nuxt/entry.70fc591f.css.br"
  },
  "/_nuxt/entry.70fc591f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a9f-4bwMvNCk5VFomFRinZwwPaFF/vM\"",
    "mtime": "2023-08-10T17:12:34.040Z",
    "size": 2719,
    "path": "../public/_nuxt/entry.70fc591f.css.gz"
  },
  "/_nuxt/entry.f80f1ae4.js": {
    "type": "application/javascript",
    "etag": "\"34602-3ezzG6VDWQ8DomBEYk4CM+Tswz4\"",
    "mtime": "2023-08-10T17:12:33.645Z",
    "size": 214530,
    "path": "../public/_nuxt/entry.f80f1ae4.js"
  },
  "/_nuxt/entry.f80f1ae4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11814-u58FLEIgSkxq8CpUe3L0ge4c8Qg\"",
    "mtime": "2023-08-10T17:12:34.426Z",
    "size": 71700,
    "path": "../public/_nuxt/entry.f80f1ae4.js.br"
  },
  "/_nuxt/entry.f80f1ae4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13a73-2oXXl6NwUQdHkA7Ai3X+oem9hIc\"",
    "mtime": "2023-08-10T17:12:34.065Z",
    "size": 80499,
    "path": "../public/_nuxt/entry.f80f1ae4.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-10T17:12:33.643Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-10T17:12:34.431Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-10T17:12:34.427Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.f1edb367.js": {
    "type": "application/javascript",
    "etag": "\"8a4-X6gmafs6SwR2GSl63M4ynU5nhNY\"",
    "mtime": "2023-08-10T17:12:33.643Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.f1edb367.js"
  },
  "/_nuxt/error-404.f1edb367.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cd-VkkxXzoop8aNoXPwaOII34zrw/0\"",
    "mtime": "2023-08-10T17:12:34.435Z",
    "size": 973,
    "path": "../public/_nuxt/error-404.f1edb367.js.br"
  },
  "/_nuxt/error-404.f1edb367.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"474-3l/bMKf2EUomM26WRtXySIB4vX4\"",
    "mtime": "2023-08-10T17:12:34.432Z",
    "size": 1140,
    "path": "../public/_nuxt/error-404.f1edb367.js.gz"
  },
  "/_nuxt/error-500.2c0532d1.js": {
    "type": "application/javascript",
    "etag": "\"757-9U18I6S0i1P1G+auPD+cT8xTOZI\"",
    "mtime": "2023-08-10T17:12:33.642Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.2c0532d1.js"
  },
  "/_nuxt/error-500.2c0532d1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-9BnHy99swXVUVsAiUXYKQBHfsMQ\"",
    "mtime": "2023-08-10T17:12:34.439Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.2c0532d1.js.br"
  },
  "/_nuxt/error-500.2c0532d1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-E3XEqmQqlEPFi7F4Z5iAwZjyWOo\"",
    "mtime": "2023-08-10T17:12:34.436Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.2c0532d1.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-10T17:12:33.642Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-10T17:12:34.442Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-10T17:12:34.440Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.ba9a8e5c.js": {
    "type": "application/javascript",
    "etag": "\"45e-MkWh/bBM4lHLxTouwthKBO9pBgI\"",
    "mtime": "2023-08-10T17:12:33.641Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.ba9a8e5c.js"
  },
  "/_nuxt/error-component.ba9a8e5c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-wkrJXvyR797lCR8kJtgO9TpZLyQ\"",
    "mtime": "2023-08-10T17:12:34.445Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.ba9a8e5c.js.br"
  },
  "/_nuxt/error-component.ba9a8e5c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-//crt816jj0GJ5UGxAlks3NbbaQ\"",
    "mtime": "2023-08-10T17:12:34.443Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.ba9a8e5c.js.gz"
  },
  "/_nuxt/favorite.2c5373bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-VXoLjaBuljdcCdAHSzzREVahc/o\"",
    "mtime": "2023-08-10T17:12:33.641Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2c5373bb.css"
  },
  "/_nuxt/favorite.2c5373bb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-DXTvVqfYoh3NZ5B57zEH8/xXhi0\"",
    "mtime": "2023-08-10T17:12:34.453Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.2c5373bb.css.br"
  },
  "/_nuxt/favorite.2c5373bb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-ePdIAR2clkhwocTMOW3sWozzXHI\"",
    "mtime": "2023-08-10T17:12:34.446Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2c5373bb.css.gz"
  },
  "/_nuxt/favorite.c4b8ca89.js": {
    "type": "application/javascript",
    "etag": "\"a10-8mFgc73iA1rkgVIRw3C4o/au5rk\"",
    "mtime": "2023-08-10T17:12:33.640Z",
    "size": 2576,
    "path": "../public/_nuxt/favorite.c4b8ca89.js"
  },
  "/_nuxt/favorite.c4b8ca89.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"436-pbSVIVU0CT5COWLXoIXRoQnLSM4\"",
    "mtime": "2023-08-10T17:12:34.458Z",
    "size": 1078,
    "path": "../public/_nuxt/favorite.c4b8ca89.js.br"
  },
  "/_nuxt/favorite.c4b8ca89.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4eb-0RejPTSCgZGUk+B5tFfmY+twiXc\"",
    "mtime": "2023-08-10T17:12:34.454Z",
    "size": 1259,
    "path": "../public/_nuxt/favorite.c4b8ca89.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-10T17:12:33.640Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-10T17:12:33.639Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.3cca0e38.js": {
    "type": "application/javascript",
    "etag": "\"605-2UCbK8jhgyg9NR18N8sI3OzJcbI\"",
    "mtime": "2023-08-10T17:12:33.639Z",
    "size": 1541,
    "path": "../public/_nuxt/index.3cca0e38.js"
  },
  "/_nuxt/index.3cca0e38.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2f7-R1yFUbu4S5+mpnxHnH51rsmHtuM\"",
    "mtime": "2023-08-10T17:12:34.461Z",
    "size": 759,
    "path": "../public/_nuxt/index.3cca0e38.js.br"
  },
  "/_nuxt/index.3cca0e38.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38b-1TxBE3+bGzr3eoSQTs+Tr9MulJ0\"",
    "mtime": "2023-08-10T17:12:34.459Z",
    "size": 907,
    "path": "../public/_nuxt/index.3cca0e38.js.gz"
  },
  "/_nuxt/index.8888ee34.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a5c-VrNak6RRLQz9DwAvYlSvJTfb+Ms\"",
    "mtime": "2023-08-10T17:12:33.638Z",
    "size": 23132,
    "path": "../public/_nuxt/index.8888ee34.css"
  },
  "/_nuxt/index.8888ee34.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12d8-dA0v4NNegr/NNkIB/nuBpdFz88I\"",
    "mtime": "2023-08-10T17:12:34.489Z",
    "size": 4824,
    "path": "../public/_nuxt/index.8888ee34.css.br"
  },
  "/_nuxt/index.8888ee34.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"166d-jgOuYTOX2Tq1pfZ3FGujbZWx5Wo\"",
    "mtime": "2023-08-10T17:12:34.462Z",
    "size": 5741,
    "path": "../public/_nuxt/index.8888ee34.css.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-08-10T17:12:33.638Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-08-10T17:12:34.493Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-08-10T17:12:34.489Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.c06b719d.js": {
    "type": "application/javascript",
    "etag": "\"3aba-ud/AYMY9HMZ3pwIMVvpqO56hv2w\"",
    "mtime": "2023-08-10T17:12:33.637Z",
    "size": 15034,
    "path": "../public/_nuxt/index.c06b719d.js"
  },
  "/_nuxt/index.c06b719d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1300-VVdAORGiS0bh3LZRsCdpT6Scc8c\"",
    "mtime": "2023-08-10T17:12:34.510Z",
    "size": 4864,
    "path": "../public/_nuxt/index.c06b719d.js.br"
  },
  "/_nuxt/index.c06b719d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14ef-OnElOWnLYwcqdymyu541mgJ0buk\"",
    "mtime": "2023-08-10T17:12:34.494Z",
    "size": 5359,
    "path": "../public/_nuxt/index.c06b719d.js.gz"
  },
  "/_nuxt/index.f446ba9e.js": {
    "type": "application/javascript",
    "etag": "\"16f31-2bz2whV3kwTqY1mY82H6kdG5V7A\"",
    "mtime": "2023-08-10T17:12:33.636Z",
    "size": 94001,
    "path": "../public/_nuxt/index.f446ba9e.js"
  },
  "/_nuxt/index.f446ba9e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6479-zSDVTn9o09WHrh/E7zw5D4DwHdg\"",
    "mtime": "2023-08-10T17:12:34.620Z",
    "size": 25721,
    "path": "../public/_nuxt/index.f446ba9e.js.br"
  },
  "/_nuxt/index.f446ba9e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7226-Thn57lt3ZCo7rvNamO+WCA6IAWs\"",
    "mtime": "2023-08-10T17:12:34.514Z",
    "size": 29222,
    "path": "../public/_nuxt/index.f446ba9e.js.gz"
  },
  "/_nuxt/isAuth.150c4285.js": {
    "type": "application/javascript",
    "etag": "\"213-jOrEWl+kkjk1cMKZwKLm+NJ5rT0\"",
    "mtime": "2023-08-10T17:12:33.636Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.150c4285.js"
  },
  "/_nuxt/login.0d049f76.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-vn9UsLd5KCcV3FowN4qQgGIAwqQ\"",
    "mtime": "2023-08-10T17:12:33.635Z",
    "size": 2199,
    "path": "../public/_nuxt/login.0d049f76.css"
  },
  "/_nuxt/login.0d049f76.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-ut8sm9cyn44VF7m9c8qzRat/1es\"",
    "mtime": "2023-08-10T17:12:34.624Z",
    "size": 605,
    "path": "../public/_nuxt/login.0d049f76.css.br"
  },
  "/_nuxt/login.0d049f76.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-qc43LhPcxVOq6vlXurbjHKiyQ4M\"",
    "mtime": "2023-08-10T17:12:34.621Z",
    "size": 776,
    "path": "../public/_nuxt/login.0d049f76.css.gz"
  },
  "/_nuxt/login.f8645279.js": {
    "type": "application/javascript",
    "etag": "\"82d-h7SGWeXOb1qNGa0dS1oSwR9G3HI\"",
    "mtime": "2023-08-10T17:12:33.634Z",
    "size": 2093,
    "path": "../public/_nuxt/login.f8645279.js"
  },
  "/_nuxt/login.f8645279.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-vN3Qd3MmxbAjhZE+xZ28P+zQP6A\"",
    "mtime": "2023-08-10T17:12:34.628Z",
    "size": 985,
    "path": "../public/_nuxt/login.f8645279.js.br"
  },
  "/_nuxt/login.f8645279.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a8-rrTAripBKr8OXZCqAOvN44cZ7cE\"",
    "mtime": "2023-08-10T17:12:34.624Z",
    "size": 1192,
    "path": "../public/_nuxt/login.f8645279.js.gz"
  },
  "/_nuxt/main.f52baff7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b8f5-jyPrmqbHvD3IVYuVRj+eF6gZFnc\"",
    "mtime": "2023-08-10T17:12:33.634Z",
    "size": 178421,
    "path": "../public/_nuxt/main.f52baff7.jpg"
  },
  "/_nuxt/news.9af01c1a.js": {
    "type": "application/javascript",
    "etag": "\"4af-MgjzI6DYNdB2U1loBYJ8YrXdGUA\"",
    "mtime": "2023-08-10T17:12:33.632Z",
    "size": 1199,
    "path": "../public/_nuxt/news.9af01c1a.js"
  },
  "/_nuxt/news.9af01c1a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a8-tn6ZDuU6fvb3ZkjszODwFhR70s8\"",
    "mtime": "2023-08-10T17:12:34.631Z",
    "size": 424,
    "path": "../public/_nuxt/news.9af01c1a.js.br"
  },
  "/_nuxt/news.9af01c1a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-LbSiG1mTlmwfATub0wv4v6fCKH8\"",
    "mtime": "2023-08-10T17:12:34.629Z",
    "size": 535,
    "path": "../public/_nuxt/news.9af01c1a.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-08-10T17:12:33.632Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.3b3c8d18.js": {
    "type": "application/javascript",
    "etag": "\"10a-bWVMCfKwqyKUx9BuLGyn+P3rtkg\"",
    "mtime": "2023-08-10T17:12:33.631Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.3b3c8d18.js"
  },
  "/_nuxt/orders.aa7368ea.js": {
    "type": "application/javascript",
    "etag": "\"2671-rQZf1D3gWWIGM0Oj5CHrj/fiYMo\"",
    "mtime": "2023-08-10T17:12:33.628Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.aa7368ea.js"
  },
  "/_nuxt/orders.aa7368ea.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"ba7-14iokWPzxmZZDjWzYlacZxka8e0\"",
    "mtime": "2023-08-10T17:12:34.644Z",
    "size": 2983,
    "path": "../public/_nuxt/orders.aa7368ea.js.br"
  },
  "/_nuxt/orders.aa7368ea.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"da8-eQT7vvaxAVl7Otvalg43czdasLI\"",
    "mtime": "2023-08-10T17:12:34.632Z",
    "size": 3496,
    "path": "../public/_nuxt/orders.aa7368ea.js.gz"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-08-10T17:12:33.627Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-08-10T17:12:34.655Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-08-10T17:12:34.645Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-10T17:12:33.627Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.0e575773.js": {
    "type": "application/javascript",
    "etag": "\"1688-0Ir7mo579oD25xtsTdIn6SosPeU\"",
    "mtime": "2023-08-10T17:12:33.626Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.0e575773.js"
  },
  "/_nuxt/profile.0e575773.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"838-1C7sahWYWBfDHYkJZTfW1UmG9yw\"",
    "mtime": "2023-08-10T17:12:34.664Z",
    "size": 2104,
    "path": "../public/_nuxt/profile.0e575773.js.br"
  },
  "/_nuxt/profile.0e575773.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99f-KDJ3CDIMIvNbKEwbTh80zhQe6yI\"",
    "mtime": "2023-08-10T17:12:34.657Z",
    "size": 2463,
    "path": "../public/_nuxt/profile.0e575773.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-08-10T17:12:33.626Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-08-10T17:12:34.700Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-08-10T17:12:34.665Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-08-10T17:12:33.625Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-08-10T17:12:34.704Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-08-10T17:12:34.701Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.a2cacdb1.js": {
    "type": "application/javascript",
    "etag": "\"111b-DHRwArPTMPRdzmQRSGbwWgumW90\"",
    "mtime": "2023-08-10T17:12:33.624Z",
    "size": 4379,
    "path": "../public/_nuxt/register.a2cacdb1.js"
  },
  "/_nuxt/register.a2cacdb1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"567-yuhA0wazRaolF/5L6UKsjT53jxo\"",
    "mtime": "2023-08-10T17:12:34.712Z",
    "size": 1383,
    "path": "../public/_nuxt/register.a2cacdb1.js.br"
  },
  "/_nuxt/register.a2cacdb1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68d-azVdb98rzLrqrB+jZkkthv64W1I\"",
    "mtime": "2023-08-10T17:12:34.705Z",
    "size": 1677,
    "path": "../public/_nuxt/register.a2cacdb1.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-10T17:12:33.624Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-10T17:12:33.623Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-10T17:12:34.717Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-10T17:12:34.713Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-10T17:12:33.623Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-10T17:12:33.621Z",
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
