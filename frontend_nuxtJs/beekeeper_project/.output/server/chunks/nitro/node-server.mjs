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
    "mtime": "2023-08-12T15:03:41.323Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-12T15:03:41.258Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-12T15:03:41.254Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.5f3f694f.js": {
    "type": "application/javascript",
    "etag": "\"9a2-JyZQ4Fvc2yiFbIntFyzWL0xqBH0\"",
    "mtime": "2023-08-12T15:03:41.253Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.5f3f694f.js"
  },
  "/_nuxt/BasketInfo.5f3f694f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ec-BwoZ1dMGj/0Wwo3rgwhUSamFkXA\"",
    "mtime": "2023-08-12T15:03:41.338Z",
    "size": 1004,
    "path": "../public/_nuxt/BasketInfo.5f3f694f.js.br"
  },
  "/_nuxt/BasketInfo.5f3f694f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ba-SfiXOkdYMUKdTm2uvECxAfLEQ1I\"",
    "mtime": "2023-08-12T15:03:41.328Z",
    "size": 1210,
    "path": "../public/_nuxt/BasketInfo.5f3f694f.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-12T15:03:41.252Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-12T15:03:41.368Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-12T15:03:41.340Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.0020b9aa.js": {
    "type": "application/javascript",
    "etag": "\"2da4-iiMbM2yVRnowrJMAm0IlPA3VOlQ\"",
    "mtime": "2023-08-12T15:03:41.251Z",
    "size": 11684,
    "path": "../public/_nuxt/CatalogProduct.0020b9aa.js"
  },
  "/_nuxt/CatalogProduct.0020b9aa.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"10a5-//7rDuzHy5BK64ticySgqDKnFk0\"",
    "mtime": "2023-08-12T15:03:41.383Z",
    "size": 4261,
    "path": "../public/_nuxt/CatalogProduct.0020b9aa.js.br"
  },
  "/_nuxt/CatalogProduct.0020b9aa.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1295-vQKOyyaNcUkrhcMVd2GaxdUQYj8\"",
    "mtime": "2023-08-12T15:03:41.370Z",
    "size": 4757,
    "path": "../public/_nuxt/CatalogProduct.0020b9aa.js.gz"
  },
  "/_nuxt/CatalogProduct.23c601cf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-q79VCkdAmO5ogpoeVhF4OKs7Cwc\"",
    "mtime": "2023-08-12T15:03:41.250Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.23c601cf.css"
  },
  "/_nuxt/CatalogProduct.23c601cf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75c-QoJcGz7vTWao/CzLZ4uND2Xzqlw\"",
    "mtime": "2023-08-12T15:03:41.396Z",
    "size": 1884,
    "path": "../public/_nuxt/CatalogProduct.23c601cf.css.br"
  },
  "/_nuxt/CatalogProduct.23c601cf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89c-odSwCu9W3ScqxrjBk6ceF57NrUc\"",
    "mtime": "2023-08-12T15:03:41.384Z",
    "size": 2204,
    "path": "../public/_nuxt/CatalogProduct.23c601cf.css.gz"
  },
  "/_nuxt/FavoriteComp.1232956e.js": {
    "type": "application/javascript",
    "etag": "\"e2f-QtEe8EpZprEjx3DwOfgODxvMPAY\"",
    "mtime": "2023-08-12T15:03:41.249Z",
    "size": 3631,
    "path": "../public/_nuxt/FavoriteComp.1232956e.js"
  },
  "/_nuxt/FavoriteComp.1232956e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"410-102oP6yx+w5Mu5849M09aFwU5RQ\"",
    "mtime": "2023-08-12T15:03:41.403Z",
    "size": 1040,
    "path": "../public/_nuxt/FavoriteComp.1232956e.js.br"
  },
  "/_nuxt/FavoriteComp.1232956e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d0-LXCI3vbgyYeY+oR4m+H1K84fHq8\"",
    "mtime": "2023-08-12T15:03:41.397Z",
    "size": 1232,
    "path": "../public/_nuxt/FavoriteComp.1232956e.js.gz"
  },
  "/_nuxt/FavoriteComp.66b44e6e.js": {
    "type": "application/javascript",
    "etag": "\"783-DmovKwGQE5vSv05tXZ8r/ichZ18\"",
    "mtime": "2023-08-12T15:03:41.248Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.66b44e6e.js"
  },
  "/_nuxt/FavoriteComp.66b44e6e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28d-PUvbt3fPpOlTFDDNt5/jimOB2gg\"",
    "mtime": "2023-08-12T15:03:41.408Z",
    "size": 653,
    "path": "../public/_nuxt/FavoriteComp.66b44e6e.js.br"
  },
  "/_nuxt/FavoriteComp.66b44e6e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-LPt7zAwPeXCEf2KJcOUmMgVucw4\"",
    "mtime": "2023-08-12T15:03:41.404Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.66b44e6e.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-12T15:03:41.246Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-12T15:03:41.429Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-12T15:03:41.409Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-12T15:03:41.245Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-12T15:03:41.435Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-12T15:03:41.430Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/ImageForm.81ba8c89.js": {
    "type": "application/javascript",
    "etag": "\"1ac-eLMuHOCT8mdQrDGCVqMTwBOAJ8M\"",
    "mtime": "2023-08-12T15:03:41.244Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.81ba8c89.js"
  },
  "/_nuxt/LoadingComp.c3ad9807.js": {
    "type": "application/javascript",
    "etag": "\"1fe-34mFkmf9A7lV+yjzBbO0Q5bHqxQ\"",
    "mtime": "2023-08-12T15:03:41.243Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.c3ad9807.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-12T15:03:41.242Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-12T15:03:41.241Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-12T15:03:41.439Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-12T15:03:41.437Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.cefc1f9f.js": {
    "type": "application/javascript",
    "etag": "\"453-7wDbneNqeVtcf2kJOSt/Z5S2/3s\"",
    "mtime": "2023-08-12T15:03:41.240Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.cefc1f9f.js"
  },
  "/_nuxt/OrderProductList.cefc1f9f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-imgDpti0gXRriveKkaXM4sFASmI\"",
    "mtime": "2023-08-12T15:03:41.442Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.cefc1f9f.js.br"
  },
  "/_nuxt/OrderProductList.cefc1f9f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"241-OCTbR2zwk3nQxoi37HojQJ3IVqs\"",
    "mtime": "2023-08-12T15:03:41.440Z",
    "size": 577,
    "path": "../public/_nuxt/OrderProductList.cefc1f9f.js.gz"
  },
  "/_nuxt/UserBasket.7d344c48.js": {
    "type": "application/javascript",
    "etag": "\"1309-2cz5Jr4Of98sb+XnPL29kzAAN9k\"",
    "mtime": "2023-08-12T15:03:41.239Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.7d344c48.js"
  },
  "/_nuxt/UserBasket.7d344c48.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"727-vjulWq29IbQ92tucL6GQDcYp8CM\"",
    "mtime": "2023-08-12T15:03:41.450Z",
    "size": 1831,
    "path": "../public/_nuxt/UserBasket.7d344c48.js.br"
  },
  "/_nuxt/UserBasket.7d344c48.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83a-Vd4QBch6LoiSR4doFZlV8vyHBFw\"",
    "mtime": "2023-08-12T15:03:41.443Z",
    "size": 2106,
    "path": "../public/_nuxt/UserBasket.7d344c48.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-12T15:03:41.238Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-12T15:03:41.467Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-12T15:03:41.450Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.42c815e2.js": {
    "type": "application/javascript",
    "etag": "\"531-jg6A76Csoa9RO0pXhm5C0Wk67g8\"",
    "mtime": "2023-08-12T15:03:41.236Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.42c815e2.js"
  },
  "/_nuxt/_id_.42c815e2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"29f-Ef8BaqluqiNPGgDYwM01KAel18o\"",
    "mtime": "2023-08-12T15:03:41.470Z",
    "size": 671,
    "path": "../public/_nuxt/_id_.42c815e2.js.br"
  },
  "/_nuxt/_id_.42c815e2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32c-blt1LL5JFlsXtq/gsEnUlY2/MHs\"",
    "mtime": "2023-08-12T15:03:41.467Z",
    "size": 812,
    "path": "../public/_nuxt/_id_.42c815e2.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-12T15:03:41.235Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-12T15:03:41.234Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-12T15:03:41.486Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-12T15:03:41.471Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.5c5d4bac.js": {
    "type": "application/javascript",
    "etag": "\"12c9-jJofhSF2O589CPM41KRvdoZkvNo\"",
    "mtime": "2023-08-12T15:03:41.232Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.5c5d4bac.js"
  },
  "/_nuxt/_id_.5c5d4bac.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75e-Jw2f6vjUAubzDB9NwFONh2lNuaQ\"",
    "mtime": "2023-08-12T15:03:41.493Z",
    "size": 1886,
    "path": "../public/_nuxt/_id_.5c5d4bac.js.br"
  },
  "/_nuxt/_id_.5c5d4bac.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"857-1ClIdz1pcmE/uZIzJSrBLBTCVoY\"",
    "mtime": "2023-08-12T15:03:41.487Z",
    "size": 2135,
    "path": "../public/_nuxt/_id_.5c5d4bac.js.gz"
  },
  "/_nuxt/basket.79359b3b.js": {
    "type": "application/javascript",
    "etag": "\"294-U9e7dNKdfJaDdupeeUXDCzgQ43w\"",
    "mtime": "2023-08-12T15:03:41.231Z",
    "size": 660,
    "path": "../public/_nuxt/basket.79359b3b.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-12T15:03:41.230Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-12T15:03:41.501Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-12T15:03:41.494Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-12T15:03:41.228Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-12T15:03:41.509Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-12T15:03:41.501Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/catalog.669e15f7.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-cqsgEeLWTKhM0dESZMwUHmoApVU\"",
    "mtime": "2023-08-12T15:03:41.227Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.669e15f7.js"
  },
  "/_nuxt/catalog.669e15f7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-QKFlG26oa/5tyMwvwd15SRcN4+U\"",
    "mtime": "2023-08-12T15:03:41.520Z",
    "size": 2339,
    "path": "../public/_nuxt/catalog.669e15f7.js.br"
  },
  "/_nuxt/catalog.669e15f7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a98-lPb8Nwl4IK16/1jqF52Xjb3ami4\"",
    "mtime": "2023-08-12T15:03:41.510Z",
    "size": 2712,
    "path": "../public/_nuxt/catalog.669e15f7.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-12T15:03:41.226Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.c22ad577.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-ilePiOEzPcAGRKaOKrPrGls2SBo\"",
    "mtime": "2023-08-12T15:03:41.225Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.c22ad577.js"
  },
  "/_nuxt/checkout.c22ad577.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5275-zwskqEo3palS+nmhN1cohh/4bdk\"",
    "mtime": "2023-08-12T15:03:41.623Z",
    "size": 21109,
    "path": "../public/_nuxt/checkout.c22ad577.js.br"
  },
  "/_nuxt/checkout.c22ad577.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fd0-Lhx9hGCE3BtvPapYq7h6LkMTLvk\"",
    "mtime": "2023-08-12T15:03:41.524Z",
    "size": 24528,
    "path": "../public/_nuxt/checkout.c22ad577.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-12T15:03:41.222Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-12T15:03:41.746Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-12T15:03:41.627Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-12T15:03:41.219Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.ac96172a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-SOY02H06gHnU32lZZj5J3R9hR2s\"",
    "mtime": "2023-08-12T15:03:41.217Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.ac96172a.css"
  },
  "/_nuxt/entry.ac96172a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"943-Wte/q5nXp/ZpqQx6eEKOn5JOA84\"",
    "mtime": "2023-08-12T15:03:41.758Z",
    "size": 2371,
    "path": "../public/_nuxt/entry.ac96172a.css.br"
  },
  "/_nuxt/entry.ac96172a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-rtr0qnbfj2KDIxcgmohRfkqZDIU\"",
    "mtime": "2023-08-12T15:03:41.748Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.ac96172a.css.gz"
  },
  "/_nuxt/entry.b0b14fea.js": {
    "type": "application/javascript",
    "etag": "\"34763-fBw9IOCF34bmzTaQcdBJqDQnhlQ\"",
    "mtime": "2023-08-12T15:03:41.216Z",
    "size": 214883,
    "path": "../public/_nuxt/entry.b0b14fea.js"
  },
  "/_nuxt/entry.b0b14fea.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11888-86jWQxEiv/rn2jP3xkb7O/GxdBc\"",
    "mtime": "2023-08-12T15:03:42.105Z",
    "size": 71816,
    "path": "../public/_nuxt/entry.b0b14fea.js.br"
  },
  "/_nuxt/entry.b0b14fea.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13ae5-9Ho8c/Fau1IeviVvs0CUjLI9l54\"",
    "mtime": "2023-08-12T15:03:41.767Z",
    "size": 80613,
    "path": "../public/_nuxt/entry.b0b14fea.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-12T15:03:41.213Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-12T15:03:42.111Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-12T15:03:42.106Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.7260e1d9.js": {
    "type": "application/javascript",
    "etag": "\"8a8-J6MSRcn1IoVvHgj0iScB9mRzX/M\"",
    "mtime": "2023-08-12T15:03:41.212Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.7260e1d9.js"
  },
  "/_nuxt/error-404.7260e1d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ca-t7/H/9FnDSJ+Cph5OOK6Y0L98IE\"",
    "mtime": "2023-08-12T15:03:42.116Z",
    "size": 970,
    "path": "../public/_nuxt/error-404.7260e1d9.js.br"
  },
  "/_nuxt/error-404.7260e1d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-UPzWsGkXdb8cOo1afevw5poSPYs\"",
    "mtime": "2023-08-12T15:03:42.112Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.7260e1d9.js.gz"
  },
  "/_nuxt/error-500.17e656fa.js": {
    "type": "application/javascript",
    "etag": "\"756-7eKybyZyA+KV8VIfLk1i60cpGv8\"",
    "mtime": "2023-08-12T15:03:41.210Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.17e656fa.js"
  },
  "/_nuxt/error-500.17e656fa.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-C6huUUEUIn0j72l2wKAs4mSNyeI\"",
    "mtime": "2023-08-12T15:03:42.120Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.17e656fa.js.br"
  },
  "/_nuxt/error-500.17e656fa.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-9vvlvv+qkgxDZNni3FQWu/SL2/c\"",
    "mtime": "2023-08-12T15:03:42.117Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.17e656fa.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-12T15:03:41.209Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-12T15:03:42.123Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-12T15:03:42.120Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.7b3356c8.js": {
    "type": "application/javascript",
    "etag": "\"45e-WO1XyS1QVR8ezEjsxVbL+vw1Uxk\"",
    "mtime": "2023-08-12T15:03:41.208Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.7b3356c8.js"
  },
  "/_nuxt/error-component.7b3356c8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-ixGUlMiGTFSydK/+gHoOlXa4ucQ\"",
    "mtime": "2023-08-12T15:03:42.126Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.7b3356c8.js.br"
  },
  "/_nuxt/error-component.7b3356c8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-By+zxQXIYlrBhywE81HEQOT0uXg\"",
    "mtime": "2023-08-12T15:03:42.124Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.7b3356c8.js.gz"
  },
  "/_nuxt/favorite.37b2c5b1.js": {
    "type": "application/javascript",
    "etag": "\"a31-dZ4UafVQX2QGIn+E7Cazn11/p38\"",
    "mtime": "2023-08-12T15:03:41.207Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.37b2c5b1.js"
  },
  "/_nuxt/favorite.37b2c5b1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44c-aIx1jLZ+NR6GcCpFiLwEcg69CQI\"",
    "mtime": "2023-08-12T15:03:42.131Z",
    "size": 1100,
    "path": "../public/_nuxt/favorite.37b2c5b1.js.br"
  },
  "/_nuxt/favorite.37b2c5b1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"504-NX5YfJndz8YukP3+lzUkcgqTEMw\"",
    "mtime": "2023-08-12T15:03:42.127Z",
    "size": 1284,
    "path": "../public/_nuxt/favorite.37b2c5b1.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-12T15:03:41.206Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-12T15:03:42.141Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-12T15:03:42.132Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-12T15:03:41.205Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-12T15:03:41.204Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-12T15:03:41.203Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-12T15:03:42.147Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-12T15:03:42.143Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.5717d183.js": {
    "type": "application/javascript",
    "etag": "\"1701b-FXQ6fJ7HAfMq11Q5xJrHHXfo/ko\"",
    "mtime": "2023-08-12T15:03:41.202Z",
    "size": 94235,
    "path": "../public/_nuxt/index.5717d183.js"
  },
  "/_nuxt/index.5717d183.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"656f-o9+0il/iR4ejiicjQRMwr8Ev3F4\"",
    "mtime": "2023-08-12T15:03:42.278Z",
    "size": 25967,
    "path": "../public/_nuxt/index.5717d183.js.br"
  },
  "/_nuxt/index.5717d183.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7327-IrOjTiebqQr4+DTwzHEdiIy32+g\"",
    "mtime": "2023-08-12T15:03:42.151Z",
    "size": 29479,
    "path": "../public/_nuxt/index.5717d183.js.gz"
  },
  "/_nuxt/index.7c33731b.js": {
    "type": "application/javascript",
    "etag": "\"3abf-QWVyed+w73BO9zkdJJSbFqdtI88\"",
    "mtime": "2023-08-12T15:03:41.201Z",
    "size": 15039,
    "path": "../public/_nuxt/index.7c33731b.js"
  },
  "/_nuxt/index.7c33731b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f3-dAOe4v1eI2F9PMm7dKL5mr3Smko\"",
    "mtime": "2023-08-12T15:03:42.300Z",
    "size": 4851,
    "path": "../public/_nuxt/index.7c33731b.js.br"
  },
  "/_nuxt/index.7c33731b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-ibjp1sJCOGZa/Sa17RIm5Sb8F40\"",
    "mtime": "2023-08-12T15:03:42.279Z",
    "size": 5362,
    "path": "../public/_nuxt/index.7c33731b.js.gz"
  },
  "/_nuxt/index.8fb50de2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5190-/LqbGNfGY5gVMPpOaKc8bXda1F4\"",
    "mtime": "2023-08-12T15:03:41.200Z",
    "size": 20880,
    "path": "../public/_nuxt/index.8fb50de2.css"
  },
  "/_nuxt/index.8fb50de2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12d1-kWkSTWTZRz1jKc9IFhrUkkvi5g8\"",
    "mtime": "2023-08-12T15:03:42.323Z",
    "size": 4817,
    "path": "../public/_nuxt/index.8fb50de2.css.br"
  },
  "/_nuxt/index.8fb50de2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"156a-IH0bHQFG0UvKP/C3wM/Bg2+DlY0\"",
    "mtime": "2023-08-12T15:03:42.301Z",
    "size": 5482,
    "path": "../public/_nuxt/index.8fb50de2.css.gz"
  },
  "/_nuxt/index.db5f3e42.js": {
    "type": "application/javascript",
    "etag": "\"645-iil2O6lTWbfdvjhbEqC3+G5J0f4\"",
    "mtime": "2023-08-12T15:03:41.199Z",
    "size": 1605,
    "path": "../public/_nuxt/index.db5f3e42.js"
  },
  "/_nuxt/index.db5f3e42.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"326-ENZR0VjfJ5scEDRbwxvxCR+o+rg\"",
    "mtime": "2023-08-12T15:03:42.328Z",
    "size": 806,
    "path": "../public/_nuxt/index.db5f3e42.js.br"
  },
  "/_nuxt/index.db5f3e42.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b7-9MjExIVDwC8ZfVZ6Wi4UwcgqdW4\"",
    "mtime": "2023-08-12T15:03:42.324Z",
    "size": 951,
    "path": "../public/_nuxt/index.db5f3e42.js.gz"
  },
  "/_nuxt/isAuth.db35c96d.js": {
    "type": "application/javascript",
    "etag": "\"211-JXSglWkapZFzvZMwJVBmSWCbGK8\"",
    "mtime": "2023-08-12T15:03:41.199Z",
    "size": 529,
    "path": "../public/_nuxt/isAuth.db35c96d.js"
  },
  "/_nuxt/login.a5ffe113.js": {
    "type": "application/javascript",
    "etag": "\"809-71KychGX30bHgTFNUeOu7DsnAB4\"",
    "mtime": "2023-08-12T15:03:41.198Z",
    "size": 2057,
    "path": "../public/_nuxt/login.a5ffe113.js"
  },
  "/_nuxt/login.a5ffe113.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ea-AWKu8SftRn8wz4s3Az0Jz1yN3BQ\"",
    "mtime": "2023-08-12T15:03:42.333Z",
    "size": 1002,
    "path": "../public/_nuxt/login.a5ffe113.js.br"
  },
  "/_nuxt/login.a5ffe113.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ac-rTVGp5v786EIlVmTR3aI5D9PYhc\"",
    "mtime": "2023-08-12T15:03:42.329Z",
    "size": 1196,
    "path": "../public/_nuxt/login.a5ffe113.js.gz"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-12T15:03:41.197Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-12T15:03:42.338Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-12T15:03:42.334Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/newsList.ace20523.js": {
    "type": "application/javascript",
    "etag": "\"e6-Q8iYQU1dI3SMurBlF/2m1u5bC04\"",
    "mtime": "2023-08-12T15:03:41.195Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.ace20523.js"
  },
  "/_nuxt/orders.0c11c0a1.js": {
    "type": "application/javascript",
    "etag": "\"26b6-ESTdzNwifB7uq/EMgzWnh51rxO0\"",
    "mtime": "2023-08-12T15:03:41.194Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.0c11c0a1.js"
  },
  "/_nuxt/orders.0c11c0a1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc6-BLUu8wA8SYu0iV9Ufbne5jRZ9hA\"",
    "mtime": "2023-08-12T15:03:42.353Z",
    "size": 3014,
    "path": "../public/_nuxt/orders.0c11c0a1.js.br"
  },
  "/_nuxt/orders.0c11c0a1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd5-tyX6QbOQNjQQQ9UKsWnNxBhzQk4\"",
    "mtime": "2023-08-12T15:03:42.340Z",
    "size": 3541,
    "path": "../public/_nuxt/orders.0c11c0a1.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-12T15:03:41.192Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-12T15:03:42.365Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-12T15:03:42.354Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-12T15:03:41.190Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-12T15:03:41.188Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-12T15:03:42.404Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-12T15:03:42.366Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.9e09842a.js": {
    "type": "application/javascript",
    "etag": "\"168b-7eOoEff1uRz234QjZkozhj98F5o\"",
    "mtime": "2023-08-12T15:03:41.186Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.9e09842a.js"
  },
  "/_nuxt/profile.9e09842a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83c-a8QKWChPIRHihTSRozNvI6/LY8E\"",
    "mtime": "2023-08-12T15:03:42.413Z",
    "size": 2108,
    "path": "../public/_nuxt/profile.9e09842a.js.br"
  },
  "/_nuxt/profile.9e09842a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99f-0vK04k6C9wGh/cKqnHrbWcOG58I\"",
    "mtime": "2023-08-12T15:03:42.405Z",
    "size": 2463,
    "path": "../public/_nuxt/profile.9e09842a.js.gz"
  },
  "/_nuxt/register.793b8a22.js": {
    "type": "application/javascript",
    "etag": "\"11b8-qz5X6c0EDREi92u5bQCF4pBiFy8\"",
    "mtime": "2023-08-12T15:03:41.185Z",
    "size": 4536,
    "path": "../public/_nuxt/register.793b8a22.js"
  },
  "/_nuxt/register.793b8a22.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bf-A6zhd2A9k3dzLvempsU46blAYps\"",
    "mtime": "2023-08-12T15:03:42.420Z",
    "size": 1471,
    "path": "../public/_nuxt/register.793b8a22.js.br"
  },
  "/_nuxt/register.793b8a22.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f9-zX8hevYT8ukR6ATg71/HE1FZKKE\"",
    "mtime": "2023-08-12T15:03:42.414Z",
    "size": 1785,
    "path": "../public/_nuxt/register.793b8a22.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-12T15:03:41.184Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-12T15:03:42.425Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-12T15:03:42.421Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-12T15:03:41.182Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-12T15:03:41.180Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-12T15:03:42.428Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-12T15:03:42.426Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-12T15:03:41.179Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-12T15:03:41.175Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-12T15:03:41.299Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-12T15:03:41.278Z",
    "size": 244510,
    "path": "../public/images/main.webp"
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
