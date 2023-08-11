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
    "mtime": "2023-08-11T18:33:51.974Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-11T18:33:51.957Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-11T18:33:51.956Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.902a8ccb.js": {
    "type": "application/javascript",
    "etag": "\"9a2-FDjqKj8TO2dyJVBcPvpM7dTMb04\"",
    "mtime": "2023-08-11T18:33:51.955Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.902a8ccb.js"
  },
  "/_nuxt/BasketInfo.902a8ccb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"404-dIpaolHynXEU/MamjjZQP6t7nJ0\"",
    "mtime": "2023-08-11T18:33:51.990Z",
    "size": 1028,
    "path": "../public/_nuxt/BasketInfo.902a8ccb.js.br"
  },
  "/_nuxt/BasketInfo.902a8ccb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-mym0B03L2yvzt3C5CzIUoVgA0Ps\"",
    "mtime": "2023-08-11T18:33:51.977Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.902a8ccb.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-11T18:33:51.955Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-11T18:33:52.015Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-11T18:33:51.991Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.562eff11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29e2-WyJ5WPB3Lz8xP9JSpzmR7rstn1I\"",
    "mtime": "2023-08-11T18:33:51.954Z",
    "size": 10722,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css"
  },
  "/_nuxt/CatalogProduct.562eff11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"761-hm4JMW59nR5en2g5nBQFLBAaU10\"",
    "mtime": "2023-08-11T18:33:52.029Z",
    "size": 1889,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.br"
  },
  "/_nuxt/CatalogProduct.562eff11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ab-nlDPx/yXCFaUfL2VJz/nc0tH/IY\"",
    "mtime": "2023-08-11T18:33:52.016Z",
    "size": 2219,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.gz"
  },
  "/_nuxt/CatalogProduct.8acf6ade.js": {
    "type": "application/javascript",
    "etag": "\"11f5-4x/Zeo0rS0xYrsX7i1OSxL8tEyo\"",
    "mtime": "2023-08-11T18:33:51.953Z",
    "size": 4597,
    "path": "../public/_nuxt/CatalogProduct.8acf6ade.js"
  },
  "/_nuxt/CatalogProduct.8acf6ade.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"66d-lLaPXrBwXUH1FLBf/hgRHiMTqV4\"",
    "mtime": "2023-08-11T18:33:52.035Z",
    "size": 1645,
    "path": "../public/_nuxt/CatalogProduct.8acf6ade.js.br"
  },
  "/_nuxt/CatalogProduct.8acf6ade.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"75a-j9owQqgE92/qog8xmldNV23PrSU\"",
    "mtime": "2023-08-11T18:33:52.029Z",
    "size": 1882,
    "path": "../public/_nuxt/CatalogProduct.8acf6ade.js.gz"
  },
  "/_nuxt/FavoriteComp.0772dccb.js": {
    "type": "application/javascript",
    "etag": "\"783-v4nDJrijUFctSNACMeNS+7bGoCg\"",
    "mtime": "2023-08-11T18:33:51.953Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.0772dccb.js"
  },
  "/_nuxt/FavoriteComp.0772dccb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-hF0QQwYrGyJr2BAVOObyq7uNuNI\"",
    "mtime": "2023-08-11T18:33:52.039Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.0772dccb.js.br"
  },
  "/_nuxt/FavoriteComp.0772dccb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f8-vGCtZ/4NKymqd+DJLSa4tc5DR9Q\"",
    "mtime": "2023-08-11T18:33:52.036Z",
    "size": 760,
    "path": "../public/_nuxt/FavoriteComp.0772dccb.js.gz"
  },
  "/_nuxt/FavoriteComp.0bad9949.js": {
    "type": "application/javascript",
    "etag": "\"e2e-1nZnQC8EErxSg5cWnj34+iLYSSI\"",
    "mtime": "2023-08-11T18:33:51.952Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.0bad9949.js"
  },
  "/_nuxt/FavoriteComp.0bad9949.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-0OEV7GADrR5xXoK3ds5mB164onk\"",
    "mtime": "2023-08-11T18:33:52.048Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.0bad9949.js.br"
  },
  "/_nuxt/FavoriteComp.0bad9949.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-hWxVqRg/qvoSZwsoHkUBZxywio8\"",
    "mtime": "2023-08-11T18:33:52.040Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.0bad9949.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-11T18:33:51.952Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-11T18:33:52.066Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-11T18:33:52.049Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-11T18:33:51.951Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-11T18:33:52.074Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-11T18:33:52.067Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/ImageForm.73fa6ef5.js": {
    "type": "application/javascript",
    "etag": "\"1ac-6eYKEEEOcVH6ww48ZGRezYUBpPc\"",
    "mtime": "2023-08-11T18:33:51.951Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.73fa6ef5.js"
  },
  "/_nuxt/LoadingComp.37102fe2.js": {
    "type": "application/javascript",
    "etag": "\"1fe-1LwMlj87HfQi/VYWpkWADT4tRIs\"",
    "mtime": "2023-08-11T18:33:51.950Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.37102fe2.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-11T18:33:51.950Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-11T18:33:51.949Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-11T18:33:52.077Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-11T18:33:52.075Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.a1f202dc.js": {
    "type": "application/javascript",
    "etag": "\"458-gwB9rJwDxTtAHSbuFS9kmnrTtLY\"",
    "mtime": "2023-08-11T18:33:51.948Z",
    "size": 1112,
    "path": "../public/_nuxt/OrderProductList.a1f202dc.js"
  },
  "/_nuxt/OrderProductList.a1f202dc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20e-R2afJ8z+3qZCrL6rOPxyu5U58T8\"",
    "mtime": "2023-08-11T18:33:52.081Z",
    "size": 526,
    "path": "../public/_nuxt/OrderProductList.a1f202dc.js.br"
  },
  "/_nuxt/OrderProductList.a1f202dc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"246-9agjWK8kuutLzrgku/t+lgQu7Rk\"",
    "mtime": "2023-08-11T18:33:52.078Z",
    "size": 582,
    "path": "../public/_nuxt/OrderProductList.a1f202dc.js.gz"
  },
  "/_nuxt/UserBasket.18d9983c.js": {
    "type": "application/javascript",
    "etag": "\"1309-rzaJ7ElHy4K4UYgg5X4glkW1J34\"",
    "mtime": "2023-08-11T18:33:51.948Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.18d9983c.js"
  },
  "/_nuxt/UserBasket.18d9983c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"73f-6XfY9I+5rVXQ19sV8C1M3K9kHtg\"",
    "mtime": "2023-08-11T18:33:52.088Z",
    "size": 1855,
    "path": "../public/_nuxt/UserBasket.18d9983c.js.br"
  },
  "/_nuxt/UserBasket.18d9983c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"837-yTg0flVTWQogEH8WJza/i4YsM9I\"",
    "mtime": "2023-08-11T18:33:52.082Z",
    "size": 2103,
    "path": "../public/_nuxt/UserBasket.18d9983c.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-11T18:33:51.947Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-11T18:33:52.112Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-11T18:33:52.089Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.0a5b4120.js": {
    "type": "application/javascript",
    "etag": "\"531-pb7/N/y3YI9waF1KE98MIZFEdnk\"",
    "mtime": "2023-08-11T18:33:51.947Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.0a5b4120.js"
  },
  "/_nuxt/_id_.0a5b4120.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-nHiH519Y7xlKe7y0DwmaHsKvzSQ\"",
    "mtime": "2023-08-11T18:33:52.115Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.0a5b4120.js.br"
  },
  "/_nuxt/_id_.0a5b4120.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-Td8GtydIU8cDt6OcKnhZHund66Q\"",
    "mtime": "2023-08-11T18:33:52.113Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.0a5b4120.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-11T18:33:51.946Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-11T18:33:51.946Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-11T18:33:52.131Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-11T18:33:52.116Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.a2719dbf.js": {
    "type": "application/javascript",
    "etag": "\"12c4-aRuWUAIqofi+C6HBWTHjrAj2z8w\"",
    "mtime": "2023-08-11T18:33:51.945Z",
    "size": 4804,
    "path": "../public/_nuxt/_id_.a2719dbf.js"
  },
  "/_nuxt/_id_.a2719dbf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"757-tDTTBzrl0prvW/4p3vgRDijRwRM\"",
    "mtime": "2023-08-11T18:33:52.137Z",
    "size": 1879,
    "path": "../public/_nuxt/_id_.a2719dbf.js.br"
  },
  "/_nuxt/_id_.a2719dbf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"853-R2jiDqijg9rfbtKtEZ7Z830zDwg\"",
    "mtime": "2023-08-11T18:33:52.131Z",
    "size": 2131,
    "path": "../public/_nuxt/_id_.a2719dbf.js.gz"
  },
  "/_nuxt/basket.1e3bb61e.js": {
    "type": "application/javascript",
    "etag": "\"294-ut15dspF6XeIAjQfGjjj64k/QVc\"",
    "mtime": "2023-08-11T18:33:51.944Z",
    "size": 660,
    "path": "../public/_nuxt/basket.1e3bb61e.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-11T18:33:51.944Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-11T18:33:52.144Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-11T18:33:52.138Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.208f51a2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1eaf-zKYdMAraEOxheGscOzazZywvsAs\"",
    "mtime": "2023-08-11T18:33:51.943Z",
    "size": 7855,
    "path": "../public/_nuxt/catalog.208f51a2.css"
  },
  "/_nuxt/catalog.208f51a2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ed-nWTRx9NDx7cffUBbWS1RVvoG3vI\"",
    "mtime": "2023-08-11T18:33:52.153Z",
    "size": 1773,
    "path": "../public/_nuxt/catalog.208f51a2.css.br"
  },
  "/_nuxt/catalog.208f51a2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"809-QHu0Ey2aXngmMJnhSSs7lGdRFJ8\"",
    "mtime": "2023-08-11T18:33:52.145Z",
    "size": 2057,
    "path": "../public/_nuxt/catalog.208f51a2.css.gz"
  },
  "/_nuxt/catalog.bb483455.js": {
    "type": "application/javascript",
    "etag": "\"1bad-R1qwDZ/yHPEVf4NKRXvR9ETC5mE\"",
    "mtime": "2023-08-11T18:33:51.943Z",
    "size": 7085,
    "path": "../public/_nuxt/catalog.bb483455.js"
  },
  "/_nuxt/catalog.bb483455.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"945-qgpF42Gt37I1gXIPDE38hDBVaCE\"",
    "mtime": "2023-08-11T18:33:52.161Z",
    "size": 2373,
    "path": "../public/_nuxt/catalog.bb483455.js.br"
  },
  "/_nuxt/catalog.bb483455.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"aca-XwzQhZTuF0sivLDVPFpDSA2k8ug\"",
    "mtime": "2023-08-11T18:33:52.154Z",
    "size": 2762,
    "path": "../public/_nuxt/catalog.bb483455.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-11T18:33:51.942Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.0f2afd5b.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-UWtZXhXCIaZp9cSn8Oygudk2t8A\"",
    "mtime": "2023-08-11T18:33:51.942Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.0f2afd5b.js"
  },
  "/_nuxt/checkout.0f2afd5b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"52a7-9uph59Gow1DXVeCCzh1oEFHnRV8\"",
    "mtime": "2023-08-11T18:33:52.255Z",
    "size": 21159,
    "path": "../public/_nuxt/checkout.0f2afd5b.js.br"
  },
  "/_nuxt/checkout.0f2afd5b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcf-qeQDYmkD4fxd1NX1+sN4v0BCPGU\"",
    "mtime": "2023-08-11T18:33:52.165Z",
    "size": 24527,
    "path": "../public/_nuxt/checkout.0f2afd5b.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-11T18:33:51.941Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-11T18:33:52.368Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-11T18:33:52.259Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-11T18:33:51.939Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.ac96172a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-SOY02H06gHnU32lZZj5J3R9hR2s\"",
    "mtime": "2023-08-11T18:33:51.938Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.ac96172a.css"
  },
  "/_nuxt/entry.ac96172a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"943-Wte/q5nXp/ZpqQx6eEKOn5JOA84\"",
    "mtime": "2023-08-11T18:33:52.380Z",
    "size": 2371,
    "path": "../public/_nuxt/entry.ac96172a.css.br"
  },
  "/_nuxt/entry.ac96172a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-rtr0qnbfj2KDIxcgmohRfkqZDIU\"",
    "mtime": "2023-08-11T18:33:52.369Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.ac96172a.css.gz"
  },
  "/_nuxt/entry.ca48256d.js": {
    "type": "application/javascript",
    "etag": "\"34628-ZdCrBi5cqXicHSf1WMIlpBZ+VtA\"",
    "mtime": "2023-08-11T18:33:51.938Z",
    "size": 214568,
    "path": "../public/_nuxt/entry.ca48256d.js"
  },
  "/_nuxt/entry.ca48256d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11808-JLlGYnBXSIO+rithWsMGXH0BbE4\"",
    "mtime": "2023-08-11T18:33:52.732Z",
    "size": 71688,
    "path": "../public/_nuxt/entry.ca48256d.js.br"
  },
  "/_nuxt/entry.ca48256d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13a65-71oyKLDO5tCZI4cdD7/WGwwq5PQ\"",
    "mtime": "2023-08-11T18:33:52.389Z",
    "size": 80485,
    "path": "../public/_nuxt/entry.ca48256d.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-11T18:33:51.936Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-11T18:33:52.738Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-11T18:33:52.733Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.93b794d5.js": {
    "type": "application/javascript",
    "etag": "\"8a8-xSRbNEm7Q38PCIDQ3dgSqNaVR0Q\"",
    "mtime": "2023-08-11T18:33:51.935Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.93b794d5.js"
  },
  "/_nuxt/error-404.93b794d5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ca-TcoVdTXa7zObNtP5TfZkA8qAXSw\"",
    "mtime": "2023-08-11T18:33:52.742Z",
    "size": 970,
    "path": "../public/_nuxt/error-404.93b794d5.js.br"
  },
  "/_nuxt/error-404.93b794d5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-LJPzplD/IiK/+vE6D0Z0wfUCY+Y\"",
    "mtime": "2023-08-11T18:33:52.738Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.93b794d5.js.gz"
  },
  "/_nuxt/error-500.64f81380.js": {
    "type": "application/javascript",
    "etag": "\"756-A8p0YJ18DWByRgjfL3w+B41mHpc\"",
    "mtime": "2023-08-11T18:33:51.935Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.64f81380.js"
  },
  "/_nuxt/error-500.64f81380.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-w/oMnmAgl8HE1dCAQz4mheIDzPs\"",
    "mtime": "2023-08-11T18:33:52.745Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.64f81380.js.br"
  },
  "/_nuxt/error-500.64f81380.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-PePwXft6rU/hPulhFkNxGn+jW+I\"",
    "mtime": "2023-08-11T18:33:52.742Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.64f81380.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-11T18:33:51.934Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-11T18:33:52.749Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-11T18:33:52.746Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.0e874170.js": {
    "type": "application/javascript",
    "etag": "\"45e-QayjMr4/XbVLir4SIsS3z4q9ZzI\"",
    "mtime": "2023-08-11T18:33:51.934Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.0e874170.js"
  },
  "/_nuxt/error-component.0e874170.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20b-bnYbeYX1DPfzcP24js/p6DG+TxI\"",
    "mtime": "2023-08-11T18:33:52.752Z",
    "size": 523,
    "path": "../public/_nuxt/error-component.0e874170.js.br"
  },
  "/_nuxt/error-component.0e874170.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-Q3gp6HUBC1ZUVOpQ/YOYOZPwaiQ\"",
    "mtime": "2023-08-11T18:33:52.750Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.0e874170.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-11T18:33:51.933Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-11T18:33:52.759Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-11T18:33:52.752Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite.ed00ac3a.js": {
    "type": "application/javascript",
    "etag": "\"a31-gGQeq3g7ofVl86h5w36WuFi8bHA\"",
    "mtime": "2023-08-11T18:33:51.933Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.ed00ac3a.js"
  },
  "/_nuxt/favorite.ed00ac3a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44f-yziXsppo/r0TEKRTifZGvWrRjIs\"",
    "mtime": "2023-08-11T18:33:52.764Z",
    "size": 1103,
    "path": "../public/_nuxt/favorite.ed00ac3a.js.br"
  },
  "/_nuxt/favorite.ed00ac3a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"505-5mMBIZfNMNgTPEApw9v6kWMqsyI\"",
    "mtime": "2023-08-11T18:33:52.760Z",
    "size": 1285,
    "path": "../public/_nuxt/favorite.ed00ac3a.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-11T18:33:51.932Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-11T18:33:51.931Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.13401152.js": {
    "type": "application/javascript",
    "etag": "\"645-bcPL1/Dfgmo5h4QYGbiMkhkdrro\"",
    "mtime": "2023-08-11T18:33:51.931Z",
    "size": 1605,
    "path": "../public/_nuxt/index.13401152.js"
  },
  "/_nuxt/index.13401152.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"327-wG4ToAmSReZbe+VIX4Yi513Sw1M\"",
    "mtime": "2023-08-11T18:33:52.768Z",
    "size": 807,
    "path": "../public/_nuxt/index.13401152.js.br"
  },
  "/_nuxt/index.13401152.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b7-EZFzr6Fnv1iKZ996O8s2kJrtqKQ\"",
    "mtime": "2023-08-11T18:33:52.766Z",
    "size": 951,
    "path": "../public/_nuxt/index.13401152.js.gz"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-11T18:33:51.930Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-11T18:33:52.773Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-11T18:33:52.769Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.af81635b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a76-/Ry4qPuXH4mnLsBcuLk90isVvZc\"",
    "mtime": "2023-08-11T18:33:51.930Z",
    "size": 23158,
    "path": "../public/_nuxt/index.af81635b.css"
  },
  "/_nuxt/index.af81635b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12f4-+0iDSKVaknzC/mcLdrPKo4SHDEc\"",
    "mtime": "2023-08-11T18:33:52.800Z",
    "size": 4852,
    "path": "../public/_nuxt/index.af81635b.css.br"
  },
  "/_nuxt/index.af81635b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"166d-6My5EJN+/Rp0j+vxgPc9VQsxfjE\"",
    "mtime": "2023-08-11T18:33:52.774Z",
    "size": 5741,
    "path": "../public/_nuxt/index.af81635b.css.gz"
  },
  "/_nuxt/index.b7bc1c78.js": {
    "type": "application/javascript",
    "etag": "\"3aba-1gJATBOYZ7n5yrbJARAK92vWHvE\"",
    "mtime": "2023-08-11T18:33:51.929Z",
    "size": 15034,
    "path": "../public/_nuxt/index.b7bc1c78.js"
  },
  "/_nuxt/index.b7bc1c78.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ea-3ul1GWNH7CknE8jMZ/9yZ5kX0/0\"",
    "mtime": "2023-08-11T18:33:52.817Z",
    "size": 4842,
    "path": "../public/_nuxt/index.b7bc1c78.js.br"
  },
  "/_nuxt/index.b7bc1c78.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-EyWS2nUsMULJ+oF9OAMuJKHcQ5M\"",
    "mtime": "2023-08-11T18:33:52.801Z",
    "size": 5360,
    "path": "../public/_nuxt/index.b7bc1c78.js.gz"
  },
  "/_nuxt/index.d495fee3.js": {
    "type": "application/javascript",
    "etag": "\"17093-U9h0MBTd0FilXOBA2oBbDuF6C7U\"",
    "mtime": "2023-08-11T18:33:51.928Z",
    "size": 94355,
    "path": "../public/_nuxt/index.d495fee3.js"
  },
  "/_nuxt/index.d495fee3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"651a-qT1bd9I0LTxp8XxgJ42aJNppAgk\"",
    "mtime": "2023-08-11T18:33:52.930Z",
    "size": 25882,
    "path": "../public/_nuxt/index.d495fee3.js.br"
  },
  "/_nuxt/index.d495fee3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"730d-ZrXZBQnY5VxCQ/B10L8RIW88P3E\"",
    "mtime": "2023-08-11T18:33:52.821Z",
    "size": 29453,
    "path": "../public/_nuxt/index.d495fee3.js.gz"
  },
  "/_nuxt/isAuth.5ea6ec45.js": {
    "type": "application/javascript",
    "etag": "\"20e-vuYRwnFVnVvFuizCvCieehLrbec\"",
    "mtime": "2023-08-11T18:33:51.927Z",
    "size": 526,
    "path": "../public/_nuxt/isAuth.5ea6ec45.js"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-11T18:33:51.927Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-11T18:33:52.934Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-11T18:33:52.931Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/login.fd4d9ab8.js": {
    "type": "application/javascript",
    "etag": "\"80e-V1xg5J4k+pyQ5OiBg81CuMBLnHM\"",
    "mtime": "2023-08-11T18:33:51.926Z",
    "size": 2062,
    "path": "../public/_nuxt/login.fd4d9ab8.js"
  },
  "/_nuxt/login.fd4d9ab8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e6-SyPR8YtN+TvMEmHjpcRSjYVnrXQ\"",
    "mtime": "2023-08-11T18:33:52.938Z",
    "size": 998,
    "path": "../public/_nuxt/login.fd4d9ab8.js.br"
  },
  "/_nuxt/login.fd4d9ab8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4af-fwjF5lFe7S9+pHOIyeu4v3adCvE\"",
    "mtime": "2023-08-11T18:33:52.935Z",
    "size": 1199,
    "path": "../public/_nuxt/login.fd4d9ab8.js.gz"
  },
  "/_nuxt/main.b554092e.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-11T18:33:51.925Z",
    "size": 256252,
    "path": "../public/_nuxt/main.b554092e.jpg"
  },
  "/_nuxt/newsList.0c205caf.js": {
    "type": "application/javascript",
    "etag": "\"e6-qzqbNl1J4fbUMgDz44n2osdPVgY\"",
    "mtime": "2023-08-11T18:33:51.923Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.0c205caf.js"
  },
  "/_nuxt/orders.45e92768.js": {
    "type": "application/javascript",
    "etag": "\"26b6-JVJYmeSr59C2ub+D3oH2B099r1A\"",
    "mtime": "2023-08-11T18:33:51.923Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.45e92768.js"
  },
  "/_nuxt/orders.45e92768.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc4-F8Yh6+aMnTOfGOgslvw24oLF0eg\"",
    "mtime": "2023-08-11T18:33:52.951Z",
    "size": 3012,
    "path": "../public/_nuxt/orders.45e92768.js.br"
  },
  "/_nuxt/orders.45e92768.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd5-e8SaCQa5iVTxCDEKF+bjwut2g1Q\"",
    "mtime": "2023-08-11T18:33:52.940Z",
    "size": 3541,
    "path": "../public/_nuxt/orders.45e92768.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-11T18:33:51.922Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-11T18:33:52.962Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-11T18:33:52.952Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-11T18:33:51.921Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-11T18:33:51.920Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-11T18:33:52.998Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-11T18:33:52.963Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.7e57331c.js": {
    "type": "application/javascript",
    "etag": "\"168b-tTdNkg0y62d/3AT7NmD3gbps/Yo\"",
    "mtime": "2023-08-11T18:33:51.919Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.7e57331c.js"
  },
  "/_nuxt/profile.7e57331c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"835-Unjqt0cJ+bYbCkBRSaSSAcy1rSE\"",
    "mtime": "2023-08-11T18:33:53.005Z",
    "size": 2101,
    "path": "../public/_nuxt/profile.7e57331c.js.br"
  },
  "/_nuxt/profile.7e57331c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99b-nZksjXLnJV+ZL7d5njSiOGT4Z54\"",
    "mtime": "2023-08-11T18:33:52.998Z",
    "size": 2459,
    "path": "../public/_nuxt/profile.7e57331c.js.gz"
  },
  "/_nuxt/register.707214fe.js": {
    "type": "application/javascript",
    "etag": "\"11b8-D79TxH75MaTp21fYGH8f+X60/2M\"",
    "mtime": "2023-08-11T18:33:51.919Z",
    "size": 4536,
    "path": "../public/_nuxt/register.707214fe.js"
  },
  "/_nuxt/register.707214fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5c0-xyHuhva6GJyvenMUc/qxH1TTi+Q\"",
    "mtime": "2023-08-11T18:33:53.012Z",
    "size": 1472,
    "path": "../public/_nuxt/register.707214fe.js.br"
  },
  "/_nuxt/register.707214fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f9-3F2cN/xf2RydNfearSLEZc10QqI\"",
    "mtime": "2023-08-11T18:33:53.006Z",
    "size": 1785,
    "path": "../public/_nuxt/register.707214fe.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-11T18:33:51.918Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-11T18:33:53.015Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-11T18:33:53.012Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-11T18:33:51.917Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-11T18:33:51.917Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-11T18:33:53.019Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-11T18:33:53.016Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-11T18:33:51.916Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-11T18:33:51.914Z",
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
