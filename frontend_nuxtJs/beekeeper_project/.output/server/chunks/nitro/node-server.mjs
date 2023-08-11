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
    "domains": [],
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
    "mtime": "2023-08-11T19:43:16.703Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-11T19:43:16.699Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-11T19:43:16.697Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.2be10dc8.js": {
    "type": "application/javascript",
    "etag": "\"9a2-4UrVj6qvTWo7rhV0jnyu31H2NFU\"",
    "mtime": "2023-08-11T19:43:16.697Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.2be10dc8.js"
  },
  "/_nuxt/BasketInfo.2be10dc8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ef-KfxZ34Ia97LqUO22N6HGTmbB08w\"",
    "mtime": "2023-08-11T19:43:16.720Z",
    "size": 1007,
    "path": "../public/_nuxt/BasketInfo.2be10dc8.js.br"
  },
  "/_nuxt/BasketInfo.2be10dc8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-KHlIdZVLjACU+fJduDa4Mj+6pnI\"",
    "mtime": "2023-08-11T19:43:16.707Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.2be10dc8.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-11T19:43:16.696Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-11T19:43:16.749Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-11T19:43:16.721Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.562eff11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29e2-WyJ5WPB3Lz8xP9JSpzmR7rstn1I\"",
    "mtime": "2023-08-11T19:43:16.696Z",
    "size": 10722,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css"
  },
  "/_nuxt/CatalogProduct.562eff11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"761-hm4JMW59nR5en2g5nBQFLBAaU10\"",
    "mtime": "2023-08-11T19:43:16.762Z",
    "size": 1889,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.br"
  },
  "/_nuxt/CatalogProduct.562eff11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ab-nlDPx/yXCFaUfL2VJz/nc0tH/IY\"",
    "mtime": "2023-08-11T19:43:16.750Z",
    "size": 2219,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.gz"
  },
  "/_nuxt/CatalogProduct.cf5765ec.js": {
    "type": "application/javascript",
    "etag": "\"11f0-FFc6teeCMJByTgrx0kkHeaF7jp4\"",
    "mtime": "2023-08-11T19:43:16.695Z",
    "size": 4592,
    "path": "../public/_nuxt/CatalogProduct.cf5765ec.js"
  },
  "/_nuxt/CatalogProduct.cf5765ec.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"673-GgTs4rpGe2+2xGtPxU6PXjVww/E\"",
    "mtime": "2023-08-11T19:43:16.769Z",
    "size": 1651,
    "path": "../public/_nuxt/CatalogProduct.cf5765ec.js.br"
  },
  "/_nuxt/CatalogProduct.cf5765ec.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"754-bMuL0mvnuuyLwJ0ybNkUxHrvx+g\"",
    "mtime": "2023-08-11T19:43:16.763Z",
    "size": 1876,
    "path": "../public/_nuxt/CatalogProduct.cf5765ec.js.gz"
  },
  "/_nuxt/FavoriteComp.1f39928c.js": {
    "type": "application/javascript",
    "etag": "\"e2f-O7zE0FCQ5TZCeBC/hK/PGBnDxxw\"",
    "mtime": "2023-08-11T19:43:16.694Z",
    "size": 3631,
    "path": "../public/_nuxt/FavoriteComp.1f39928c.js"
  },
  "/_nuxt/FavoriteComp.1f39928c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40e-hUy4WiCaCyS9hBlmjEQESAXVfGw\"",
    "mtime": "2023-08-11T19:43:16.778Z",
    "size": 1038,
    "path": "../public/_nuxt/FavoriteComp.1f39928c.js.br"
  },
  "/_nuxt/FavoriteComp.1f39928c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-waqYB6FA2yZy8p4xDrwWrMQnlpA\"",
    "mtime": "2023-08-11T19:43:16.770Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.1f39928c.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-11T19:43:16.694Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-11T19:43:16.803Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-11T19:43:16.779Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-11T19:43:16.693Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-11T19:43:16.810Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-11T19:43:16.804Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.a341453b.js": {
    "type": "application/javascript",
    "etag": "\"783-frCTZeHksFTcDcnNLUMjXRv6GUE\"",
    "mtime": "2023-08-11T19:43:16.693Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.a341453b.js"
  },
  "/_nuxt/FavoriteComp.a341453b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-AhdzZoYqZRaAEEd1auDZcdLeigc\"",
    "mtime": "2023-08-11T19:43:16.814Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.a341453b.js.br"
  },
  "/_nuxt/FavoriteComp.a341453b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f9-aFZV7jn5qSuzAoaqf/PugXFYrrQ\"",
    "mtime": "2023-08-11T19:43:16.811Z",
    "size": 761,
    "path": "../public/_nuxt/FavoriteComp.a341453b.js.gz"
  },
  "/_nuxt/ImageForm.c7118004.js": {
    "type": "application/javascript",
    "etag": "\"1ac-ILcEfVm1lSH6ANANMJ2CeWGUvMA\"",
    "mtime": "2023-08-11T19:43:16.692Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.c7118004.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-11T19:43:16.692Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.f90798fb.js": {
    "type": "application/javascript",
    "etag": "\"1fe-UiaqJzSAV7YDIjkwAlwNvfA/wfo\"",
    "mtime": "2023-08-11T19:43:16.691Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.f90798fb.js"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-11T19:43:16.690Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-11T19:43:16.817Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-11T19:43:16.815Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.99751f89.js": {
    "type": "application/javascript",
    "etag": "\"453-7+qJGG7Sqi3AXe82cfrz22ApEKI\"",
    "mtime": "2023-08-11T19:43:16.690Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.99751f89.js"
  },
  "/_nuxt/OrderProductList.99751f89.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-YbjvAXR2mT+EO59niNKhyKvjhYE\"",
    "mtime": "2023-08-11T19:43:16.820Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.99751f89.js.br"
  },
  "/_nuxt/OrderProductList.99751f89.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"242-jPXYQ5/LU7lDc5jaogCQK9YwAPU\"",
    "mtime": "2023-08-11T19:43:16.818Z",
    "size": 578,
    "path": "../public/_nuxt/OrderProductList.99751f89.js.gz"
  },
  "/_nuxt/UserBasket.89a0af4e.js": {
    "type": "application/javascript",
    "etag": "\"1309-rOXNHuKvFD95yHDlHytfNcpUN6U\"",
    "mtime": "2023-08-11T19:43:16.689Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.89a0af4e.js"
  },
  "/_nuxt/UserBasket.89a0af4e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"736-rxrIWLQdkHXGG3Lva3mPP7GLIQU\"",
    "mtime": "2023-08-11T19:43:16.827Z",
    "size": 1846,
    "path": "../public/_nuxt/UserBasket.89a0af4e.js.br"
  },
  "/_nuxt/UserBasket.89a0af4e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"839-1xzofCpi1yG+o78xXtLFXdAJsgU\"",
    "mtime": "2023-08-11T19:43:16.821Z",
    "size": 2105,
    "path": "../public/_nuxt/UserBasket.89a0af4e.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-11T19:43:16.688Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-11T19:43:16.844Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-11T19:43:16.828Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.14fca06d.js": {
    "type": "application/javascript",
    "etag": "\"531-Xa5Gh6/udEgBqRbs1/kP1yNbFXA\"",
    "mtime": "2023-08-11T19:43:16.688Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.14fca06d.js"
  },
  "/_nuxt/_id_.14fca06d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a1-NLDu4Sgj3nYzIF4Ay4khBWY9fPo\"",
    "mtime": "2023-08-11T19:43:16.848Z",
    "size": 673,
    "path": "../public/_nuxt/_id_.14fca06d.js.br"
  },
  "/_nuxt/_id_.14fca06d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32c-TX9X8fSIxDv3kL6OVIxK+TndBMM\"",
    "mtime": "2023-08-11T19:43:16.845Z",
    "size": 812,
    "path": "../public/_nuxt/_id_.14fca06d.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-11T19:43:16.687Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-11T19:43:16.686Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-11T19:43:16.863Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-11T19:43:16.849Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.ea4256c1.js": {
    "type": "application/javascript",
    "etag": "\"12c9-42eNW0ID3FyjI3OBc39ntxp81Qw\"",
    "mtime": "2023-08-11T19:43:16.686Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.ea4256c1.js"
  },
  "/_nuxt/_id_.ea4256c1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75c-QRZ2QWsLT7+cK+WUHVWD8zJbIEs\"",
    "mtime": "2023-08-11T19:43:16.870Z",
    "size": 1884,
    "path": "../public/_nuxt/_id_.ea4256c1.js.br"
  },
  "/_nuxt/_id_.ea4256c1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"859-3OHLR4kp1twHv/PEl696RUhgiEc\"",
    "mtime": "2023-08-11T19:43:16.864Z",
    "size": 2137,
    "path": "../public/_nuxt/_id_.ea4256c1.js.gz"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-11T19:43:16.685Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-11T19:43:16.877Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-11T19:43:16.871Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.d8517201.js": {
    "type": "application/javascript",
    "etag": "\"294-kM5cgFaI5g4Ag+DsTKYIhvMGQK4\"",
    "mtime": "2023-08-11T19:43:16.684Z",
    "size": 660,
    "path": "../public/_nuxt/basket.d8517201.js"
  },
  "/_nuxt/catalog.208f51a2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1eaf-zKYdMAraEOxheGscOzazZywvsAs\"",
    "mtime": "2023-08-11T19:43:16.684Z",
    "size": 7855,
    "path": "../public/_nuxt/catalog.208f51a2.css"
  },
  "/_nuxt/catalog.208f51a2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ed-nWTRx9NDx7cffUBbWS1RVvoG3vI\"",
    "mtime": "2023-08-11T19:43:16.887Z",
    "size": 1773,
    "path": "../public/_nuxt/catalog.208f51a2.css.br"
  },
  "/_nuxt/catalog.208f51a2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"809-QHu0Ey2aXngmMJnhSSs7lGdRFJ8\"",
    "mtime": "2023-08-11T19:43:16.878Z",
    "size": 2057,
    "path": "../public/_nuxt/catalog.208f51a2.css.gz"
  },
  "/_nuxt/catalog.f1af3283.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-8sxYW9y4SihZY9FkPmwBCJ+2Vjo\"",
    "mtime": "2023-08-11T19:43:16.683Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.f1af3283.js"
  },
  "/_nuxt/catalog.f1af3283.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-UoNZ6aYUeNqTURw8GTaVuavHFJE\"",
    "mtime": "2023-08-11T19:43:16.895Z",
    "size": 2339,
    "path": "../public/_nuxt/catalog.f1af3283.js.br"
  },
  "/_nuxt/catalog.f1af3283.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-kkAksLDN4/RambjdAcR9lCzV1bs\"",
    "mtime": "2023-08-11T19:43:16.887Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.f1af3283.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-11T19:43:16.682Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.f29ff623.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-EVtuo1jz7FGjdE15pxxiriAdtFM\"",
    "mtime": "2023-08-11T19:43:16.682Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.f29ff623.js"
  },
  "/_nuxt/checkout.f29ff623.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5296-DRbPNBopNmBRbMdl5xu1xoIEk5w\"",
    "mtime": "2023-08-11T19:43:16.995Z",
    "size": 21142,
    "path": "../public/_nuxt/checkout.f29ff623.js.br"
  },
  "/_nuxt/checkout.f29ff623.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcf-MqDtsKq/PbofaFJ6ehAY0J8s+4Q\"",
    "mtime": "2023-08-11T19:43:16.898Z",
    "size": 24527,
    "path": "../public/_nuxt/checkout.f29ff623.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-11T19:43:16.681Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-11T19:43:17.115Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-11T19:43:16.999Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-11T19:43:16.680Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.a9ded731.js": {
    "type": "application/javascript",
    "etag": "\"34763-FsSzPDKu66pqUOMuy6RqZwtGdfc\"",
    "mtime": "2023-08-11T19:43:16.679Z",
    "size": 214883,
    "path": "../public/_nuxt/entry.a9ded731.js"
  },
  "/_nuxt/entry.a9ded731.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11861-T2Lqqc+Qom5e3t9jz77CJZ0SILk\"",
    "mtime": "2023-08-11T19:43:17.483Z",
    "size": 71777,
    "path": "../public/_nuxt/entry.a9ded731.js.br"
  },
  "/_nuxt/entry.a9ded731.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13aea-rMVMu6e/Dlcret33ZEH1vFvkhPg\"",
    "mtime": "2023-08-11T19:43:17.125Z",
    "size": 80618,
    "path": "../public/_nuxt/entry.a9ded731.js.gz"
  },
  "/_nuxt/entry.ac96172a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-SOY02H06gHnU32lZZj5J3R9hR2s\"",
    "mtime": "2023-08-11T19:43:16.678Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.ac96172a.css"
  },
  "/_nuxt/entry.ac96172a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"943-Wte/q5nXp/ZpqQx6eEKOn5JOA84\"",
    "mtime": "2023-08-11T19:43:17.497Z",
    "size": 2371,
    "path": "../public/_nuxt/entry.ac96172a.css.br"
  },
  "/_nuxt/entry.ac96172a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-rtr0qnbfj2KDIxcgmohRfkqZDIU\"",
    "mtime": "2023-08-11T19:43:17.484Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.ac96172a.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-11T19:43:16.677Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-11T19:43:17.504Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-11T19:43:17.497Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.91c82c7d.js": {
    "type": "application/javascript",
    "etag": "\"8a8-JUOZ0F61jVBXVM18xYV0bFw/d+g\"",
    "mtime": "2023-08-11T19:43:16.677Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.91c82c7d.js"
  },
  "/_nuxt/error-404.91c82c7d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-yzA6JmFu2k1hpvgdHGaskXkj2jo\"",
    "mtime": "2023-08-11T19:43:17.509Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.91c82c7d.js.br"
  },
  "/_nuxt/error-404.91c82c7d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-PP3/4HC8O64Q1ZwvIwi51/6ePsg\"",
    "mtime": "2023-08-11T19:43:17.505Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.91c82c7d.js.gz"
  },
  "/_nuxt/error-500.910e66a1.js": {
    "type": "application/javascript",
    "etag": "\"756-wDpyVyD9qhwEB6DMqYc21QR6scA\"",
    "mtime": "2023-08-11T19:43:16.676Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.910e66a1.js"
  },
  "/_nuxt/error-500.910e66a1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"349-zbJMl1XjzmxMflfXw0KxeARxiCs\"",
    "mtime": "2023-08-11T19:43:17.513Z",
    "size": 841,
    "path": "../public/_nuxt/error-500.910e66a1.js.br"
  },
  "/_nuxt/error-500.910e66a1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-g+r+KqE1Nzom5dii9ZgJi/r2csQ\"",
    "mtime": "2023-08-11T19:43:17.510Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.910e66a1.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-11T19:43:16.676Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-11T19:43:17.518Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-11T19:43:17.514Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.cb6e5d01.js": {
    "type": "application/javascript",
    "etag": "\"45e-QiKr6tS4KT9Zw4k8M7yDcZqqi+8\"",
    "mtime": "2023-08-11T19:43:16.675Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.cb6e5d01.js"
  },
  "/_nuxt/error-component.cb6e5d01.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-ULGY7aAFgsU0eS8QAWt2apPdeEg\"",
    "mtime": "2023-08-11T19:43:17.521Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.cb6e5d01.js.br"
  },
  "/_nuxt/error-component.cb6e5d01.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25d-Vf30YoTX/1LTEnIkjaUlyNzVuWg\"",
    "mtime": "2023-08-11T19:43:17.519Z",
    "size": 605,
    "path": "../public/_nuxt/error-component.cb6e5d01.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-11T19:43:16.675Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-11T19:43:17.532Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-11T19:43:17.522Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite.fcb5ee86.js": {
    "type": "application/javascript",
    "etag": "\"a31-xHzQ+EZkqTROWA7/r1Njoz4qXJE\"",
    "mtime": "2023-08-11T19:43:16.674Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.fcb5ee86.js"
  },
  "/_nuxt/favorite.fcb5ee86.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"450-nR+iFnQasQsOwYe7imatmlBi/1g\"",
    "mtime": "2023-08-11T19:43:17.538Z",
    "size": 1104,
    "path": "../public/_nuxt/favorite.fcb5ee86.js.br"
  },
  "/_nuxt/favorite.fcb5ee86.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"506-iSxHCQF/QAI6m9yaG3nVo69RlYo\"",
    "mtime": "2023-08-11T19:43:17.533Z",
    "size": 1286,
    "path": "../public/_nuxt/favorite.fcb5ee86.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-11T19:43:16.674Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-11T19:43:16.673Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-11T19:43:16.673Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-11T19:43:17.546Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-11T19:43:17.540Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.2a5ef382.js": {
    "type": "application/javascript",
    "etag": "\"645-TbIhdjJABX5p4kgT8ADA3S4o1FA\"",
    "mtime": "2023-08-11T19:43:16.672Z",
    "size": 1605,
    "path": "../public/_nuxt/index.2a5ef382.js"
  },
  "/_nuxt/index.2a5ef382.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"329-O56N71YADuUsj95LpWh3VugLUsU\"",
    "mtime": "2023-08-11T19:43:17.550Z",
    "size": 809,
    "path": "../public/_nuxt/index.2a5ef382.js.br"
  },
  "/_nuxt/index.2a5ef382.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b9-PIsPlD4EinvGO7AES+9wTvFbDr0\"",
    "mtime": "2023-08-11T19:43:17.547Z",
    "size": 953,
    "path": "../public/_nuxt/index.2a5ef382.js.gz"
  },
  "/_nuxt/index.5e9132e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a12-DUCfstHVqS/vwvOfpFp6HzKUlgI\"",
    "mtime": "2023-08-11T19:43:16.672Z",
    "size": 23058,
    "path": "../public/_nuxt/index.5e9132e6.css"
  },
  "/_nuxt/index.5e9132e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12ec-DTkWw4Okr6qrJHn8mb+ib0asr48\"",
    "mtime": "2023-08-11T19:43:17.584Z",
    "size": 4844,
    "path": "../public/_nuxt/index.5e9132e6.css.br"
  },
  "/_nuxt/index.5e9132e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"165e-mDM6ePRHL/bUouZPq6q0pRTqmcI\"",
    "mtime": "2023-08-11T19:43:17.551Z",
    "size": 5726,
    "path": "../public/_nuxt/index.5e9132e6.css.gz"
  },
  "/_nuxt/index.8fbbdf20.js": {
    "type": "application/javascript",
    "etag": "\"18c44-/2MPy0hgOWW7Hk4v6stl0BsLjGQ\"",
    "mtime": "2023-08-11T19:43:16.671Z",
    "size": 101444,
    "path": "../public/_nuxt/index.8fbbdf20.js"
  },
  "/_nuxt/index.8fbbdf20.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6ebc-RASW9R9HDdY+MpoDj+RAntOlJrI\"",
    "mtime": "2023-08-11T19:43:17.709Z",
    "size": 28348,
    "path": "../public/_nuxt/index.8fbbdf20.js.br"
  },
  "/_nuxt/index.8fbbdf20.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7d9a-FTiOU0P3YBgCtZsjSgK+KJQhK+k\"",
    "mtime": "2023-08-11T19:43:17.587Z",
    "size": 32154,
    "path": "../public/_nuxt/index.8fbbdf20.js.gz"
  },
  "/_nuxt/index.beb049c7.js": {
    "type": "application/javascript",
    "etag": "\"3ac4-bGh8OapUTPBnZJG7MzuOsyXxPps\"",
    "mtime": "2023-08-11T19:43:16.670Z",
    "size": 15044,
    "path": "../public/_nuxt/index.beb049c7.js"
  },
  "/_nuxt/index.beb049c7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f5-br1j7aWntHx7XpdGcUevkLH5IZs\"",
    "mtime": "2023-08-11T19:43:17.727Z",
    "size": 4853,
    "path": "../public/_nuxt/index.beb049c7.js.br"
  },
  "/_nuxt/index.beb049c7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f5-+L1Qa2WnxqigHYke2p4vUCcXYco\"",
    "mtime": "2023-08-11T19:43:17.710Z",
    "size": 5365,
    "path": "../public/_nuxt/index.beb049c7.js.gz"
  },
  "/_nuxt/isAuth.7b1fab45.js": {
    "type": "application/javascript",
    "etag": "\"211-caYwt8c0v4uyuRkdDlPdeJqntvg\"",
    "mtime": "2023-08-11T19:43:16.670Z",
    "size": 529,
    "path": "../public/_nuxt/isAuth.7b1fab45.js"
  },
  "/_nuxt/login.89db6484.js": {
    "type": "application/javascript",
    "etag": "\"809-sDDm5OT0Uh5qPPYxy89Gv2KtdX0\"",
    "mtime": "2023-08-11T19:43:16.669Z",
    "size": 2057,
    "path": "../public/_nuxt/login.89db6484.js"
  },
  "/_nuxt/login.89db6484.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ec-vNmq6xzRLuienw0HFREMwO5pBls\"",
    "mtime": "2023-08-11T19:43:17.732Z",
    "size": 1004,
    "path": "../public/_nuxt/login.89db6484.js.br"
  },
  "/_nuxt/login.89db6484.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ad-s+YQ69kEMLTRt/2Xe7w8TvvthiQ\"",
    "mtime": "2023-08-11T19:43:17.728Z",
    "size": 1197,
    "path": "../public/_nuxt/login.89db6484.js.gz"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-11T19:43:16.668Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-11T19:43:17.735Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-11T19:43:17.732Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/newsList.e526ed15.js": {
    "type": "application/javascript",
    "etag": "\"e6-z7IzDOjlKOWreyQckL/rqIZSEvc\"",
    "mtime": "2023-08-11T19:43:16.668Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.e526ed15.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-11T19:43:16.667Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-11T19:43:17.747Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-11T19:43:17.737Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.ff4dc3d0.js": {
    "type": "application/javascript",
    "etag": "\"26b6-+gIeR4mPYHvxSuAhDZm8SydXSMM\"",
    "mtime": "2023-08-11T19:43:16.667Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.ff4dc3d0.js"
  },
  "/_nuxt/orders.ff4dc3d0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bcb-nWwp1Z0GGyadUU2G6QBgL7Le5xE\"",
    "mtime": "2023-08-11T19:43:17.759Z",
    "size": 3019,
    "path": "../public/_nuxt/orders.ff4dc3d0.js.br"
  },
  "/_nuxt/orders.ff4dc3d0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd7-n9Q7M4645bHokUa3amA0JW1gnfE\"",
    "mtime": "2023-08-11T19:43:17.748Z",
    "size": 3543,
    "path": "../public/_nuxt/orders.ff4dc3d0.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-11T19:43:16.666Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-11T19:43:16.665Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-11T19:43:17.798Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-11T19:43:17.761Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.5eb9dd42.js": {
    "type": "application/javascript",
    "etag": "\"168b-NCxTYkaaMm8zQJALaeJRHZKBsW8\"",
    "mtime": "2023-08-11T19:43:16.664Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.5eb9dd42.js"
  },
  "/_nuxt/profile.5eb9dd42.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83f-1epEvIgC+GeC/SxD2OgEI6CkwoA\"",
    "mtime": "2023-08-11T19:43:17.806Z",
    "size": 2111,
    "path": "../public/_nuxt/profile.5eb9dd42.js.br"
  },
  "/_nuxt/profile.5eb9dd42.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a0-3JC9XP93Xpx9oWhHCV9m0Qsa3gk\"",
    "mtime": "2023-08-11T19:43:17.799Z",
    "size": 2464,
    "path": "../public/_nuxt/profile.5eb9dd42.js.gz"
  },
  "/_nuxt/register.3810de76.js": {
    "type": "application/javascript",
    "etag": "\"11b8-rG2vj/T2xuXhOKhzTgOsxJxAy00\"",
    "mtime": "2023-08-11T19:43:16.664Z",
    "size": 4536,
    "path": "../public/_nuxt/register.3810de76.js"
  },
  "/_nuxt/register.3810de76.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bf-Mu2dRt+/0sEVI/nSkiEukH80AMA\"",
    "mtime": "2023-08-11T19:43:17.812Z",
    "size": 1471,
    "path": "../public/_nuxt/register.3810de76.js.br"
  },
  "/_nuxt/register.3810de76.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fa-9jKuIxUECJGsvHyBFNlVHID6DQU\"",
    "mtime": "2023-08-11T19:43:17.806Z",
    "size": 1786,
    "path": "../public/_nuxt/register.3810de76.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-11T19:43:16.663Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-11T19:43:17.816Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-11T19:43:17.813Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-11T19:43:16.663Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-11T19:43:16.662Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-11T19:43:17.819Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-11T19:43:17.817Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-11T19:43:16.661Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-11T19:43:16.659Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-11T19:43:16.702Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
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
