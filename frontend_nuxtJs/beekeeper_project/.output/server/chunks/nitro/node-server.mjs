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
    "mtime": "2023-07-21T13:43:48.635Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-21T13:43:48.626Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.5502be58.js": {
    "type": "application/javascript",
    "etag": "\"96e-vfPbPOc4xQ+DbLfvxv2PEZIjKjg\"",
    "mtime": "2023-07-21T13:43:48.624Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.5502be58.js"
  },
  "/_nuxt/BasketInfo.5502be58.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3df-sMJ4E8IMeLxyPia6JFLuVahr+TA\"",
    "mtime": "2023-07-21T13:43:48.647Z",
    "size": 991,
    "path": "../public/_nuxt/BasketInfo.5502be58.js.br"
  },
  "/_nuxt/BasketInfo.5502be58.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49d-rxisUQYf8CjZGLrfbK7oxj+e/Mk\"",
    "mtime": "2023-07-21T13:43:48.638Z",
    "size": 1181,
    "path": "../public/_nuxt/BasketInfo.5502be58.js.gz"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-w6ZWAKEgVWOkc1fvPF8RCeGaC4Y\"",
    "mtime": "2023-07-21T13:43:48.624Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f5-n2VRrAMAtWDVYe3O6dSOW0xXYqw\"",
    "mtime": "2023-07-21T13:43:48.674Z",
    "size": 1781,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.br"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a8-N3A5Q2F+JopdZICKJCTPgwM2DvQ\"",
    "mtime": "2023-07-21T13:43:48.648Z",
    "size": 2472,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.gz"
  },
  "/_nuxt/CatalogProduct.02171d22.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d6a-zfnX3h2lBUJx+LVy1uqT8eJomwI\"",
    "mtime": "2023-07-21T13:43:48.623Z",
    "size": 7530,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css"
  },
  "/_nuxt/CatalogProduct.02171d22.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"654-qpdftA878CZH5Z5BbhpUZms4hRc\"",
    "mtime": "2023-07-21T13:43:48.682Z",
    "size": 1620,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.br"
  },
  "/_nuxt/CatalogProduct.02171d22.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"75d-k0BZggsPMxTlBNehk0MeZC2XVgk\"",
    "mtime": "2023-07-21T13:43:48.674Z",
    "size": 1885,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.gz"
  },
  "/_nuxt/CatalogProduct.8ad67b40.js": {
    "type": "application/javascript",
    "etag": "\"bea-zcJKFo+w2SP3Q90tVQGGkHfkW0o\"",
    "mtime": "2023-07-21T13:43:48.623Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.8ad67b40.js"
  },
  "/_nuxt/CatalogProduct.8ad67b40.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b5-x8bLcIarsST+Kuw1lks2Pa3HJd4\"",
    "mtime": "2023-07-21T13:43:48.687Z",
    "size": 1205,
    "path": "../public/_nuxt/CatalogProduct.8ad67b40.js.br"
  },
  "/_nuxt/CatalogProduct.8ad67b40.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"555-Zr7uUdOv4XZF6jPfcx/zioWH20g\"",
    "mtime": "2023-07-21T13:43:48.683Z",
    "size": 1365,
    "path": "../public/_nuxt/CatalogProduct.8ad67b40.js.gz"
  },
  "/_nuxt/FavoriteComp.d10507f2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-c3cno65+JH2VQizEAUB4Imjik7w\"",
    "mtime": "2023-07-21T13:43:48.622Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fe-yHb/J0Uvuv63E/C42srrZLnk4Ow\"",
    "mtime": "2023-07-21T13:43:48.704Z",
    "size": 1534,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.br"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6Xkawk1MFTlzm7F+eEmnZa7mxag\"",
    "mtime": "2023-07-21T13:43:48.688Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.gz"
  },
  "/_nuxt/FavoriteComp.f82f8511.js": {
    "type": "application/javascript",
    "etag": "\"c46-FyZWmPl0uSp0nWJJcPdmuNGObSc\"",
    "mtime": "2023-07-21T13:43:48.622Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.f82f8511.js"
  },
  "/_nuxt/FavoriteComp.f82f8511.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3b9-sxlYoRTpIAXmERt1RhKYtadWQYw\"",
    "mtime": "2023-07-21T13:43:48.709Z",
    "size": 953,
    "path": "../public/_nuxt/FavoriteComp.f82f8511.js.br"
  },
  "/_nuxt/FavoriteComp.f82f8511.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"457-ms9VU8k2HvKGcEATK32flsIxaqE\"",
    "mtime": "2023-07-21T13:43:48.704Z",
    "size": 1111,
    "path": "../public/_nuxt/FavoriteComp.f82f8511.js.gz"
  },
  "/_nuxt/ImageForm.83607c06.js": {
    "type": "application/javascript",
    "etag": "\"225-W+Dfbk8uyvgsXx/ulEpGWfgTklM\"",
    "mtime": "2023-07-21T13:43:48.621Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.83607c06.js"
  },
  "/_nuxt/LoadingComp.935b1842.js": {
    "type": "application/javascript",
    "etag": "\"1fe-rk08aeqDgnn4UNMlzRJV5tv4rvo\"",
    "mtime": "2023-07-21T13:43:48.621Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.935b1842.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-21T13:43:48.620Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.1b79e089.js": {
    "type": "application/javascript",
    "etag": "\"459-U/FkzUCfhNriKfsBdUdfZpSA86E\"",
    "mtime": "2023-07-21T13:43:48.620Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.1b79e089.js"
  },
  "/_nuxt/OrderProductList.1b79e089.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-kE2Jr4VCx++aYe1bFVrtr8yUMGY\"",
    "mtime": "2023-07-21T13:43:48.712Z",
    "size": 520,
    "path": "../public/_nuxt/OrderProductList.1b79e089.js.br"
  },
  "/_nuxt/OrderProductList.1b79e089.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23b-SYtuJcZjniPRXzjm0xYXAKhHgpQ\"",
    "mtime": "2023-07-21T13:43:48.710Z",
    "size": 571,
    "path": "../public/_nuxt/OrderProductList.1b79e089.js.gz"
  },
  "/_nuxt/OrderProductList.3630c1d5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-YWr80UDyXOSYzU+Ijx8lm2W1K2c\"",
    "mtime": "2023-07-21T13:43:48.620Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1be-GHaQKDEThlXoglW1KGjvOJZOxKU\"",
    "mtime": "2023-07-21T13:43:48.715Z",
    "size": 446,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.br"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-dnvTg2fki6UxU5oYPO/E/HQ9apE\"",
    "mtime": "2023-07-21T13:43:48.713Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.gz"
  },
  "/_nuxt/RatingComp.6ef7db93.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10a1-8Gfjt3dDrqWBoexscvy1WtgDnjY\"",
    "mtime": "2023-07-21T13:43:48.619Z",
    "size": 4257,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css"
  },
  "/_nuxt/RatingComp.6ef7db93.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3fc-4iJaxX8CPtl6qVS1TxMXC0P4wqQ\"",
    "mtime": "2023-07-21T13:43:48.720Z",
    "size": 1020,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.br"
  },
  "/_nuxt/RatingComp.6ef7db93.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4bb-StcXTlfNUGIOh2NgsdQDFVWeWLM\"",
    "mtime": "2023-07-21T13:43:48.716Z",
    "size": 1211,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.gz"
  },
  "/_nuxt/RatingComp.9e02a798.js": {
    "type": "application/javascript",
    "etag": "\"bac-7KzSxHpWQyt8fU9ULs1660qHZVg\"",
    "mtime": "2023-07-21T13:43:48.619Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.9e02a798.js"
  },
  "/_nuxt/RatingComp.9e02a798.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d6-gA5t21lO6QyQu1R8ujIejk7hKGI\"",
    "mtime": "2023-07-21T13:43:48.725Z",
    "size": 982,
    "path": "../public/_nuxt/RatingComp.9e02a798.js.br"
  },
  "/_nuxt/RatingComp.9e02a798.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47b-0r+IzyPA9d14UUZs295FacXK1DY\"",
    "mtime": "2023-07-21T13:43:48.721Z",
    "size": 1147,
    "path": "../public/_nuxt/RatingComp.9e02a798.js.gz"
  },
  "/_nuxt/UserBasket.c6efed41.js": {
    "type": "application/javascript",
    "etag": "\"1410-3yR0qPLhN9mtHhJw2eKmwsR4dMA\"",
    "mtime": "2023-07-21T13:43:48.618Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.c6efed41.js"
  },
  "/_nuxt/UserBasket.c6efed41.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76d-9GuRYVK54mlxe3gaVoqSbfwMYck\"",
    "mtime": "2023-07-21T13:43:48.732Z",
    "size": 1901,
    "path": "../public/_nuxt/UserBasket.c6efed41.js.br"
  },
  "/_nuxt/UserBasket.c6efed41.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"891-2EsiMTdBBA321Cg7JI6MgeXWPOE\"",
    "mtime": "2023-07-21T13:43:48.726Z",
    "size": 2193,
    "path": "../public/_nuxt/UserBasket.c6efed41.js.gz"
  },
  "/_nuxt/UserBasket.d26a50dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-kKYV+/VsLmXlyPvX/GIybQhwJGg\"",
    "mtime": "2023-07-21T13:43:48.618Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css"
  },
  "/_nuxt/UserBasket.d26a50dd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-dTjOi3ZlK6jAGp2mSk2qPUjLTiU\"",
    "mtime": "2023-07-21T13:43:48.748Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.br"
  },
  "/_nuxt/UserBasket.d26a50dd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-vnsR1nObKszggTaMRtQnIDCJJiQ\"",
    "mtime": "2023-07-21T13:43:48.733Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.gz"
  },
  "/_nuxt/_id_.451efae7.js": {
    "type": "application/javascript",
    "etag": "\"1337-MhKetDRyfvO7QI+D1C7dbhdhQEM\"",
    "mtime": "2023-07-21T13:43:48.617Z",
    "size": 4919,
    "path": "../public/_nuxt/_id_.451efae7.js"
  },
  "/_nuxt/_id_.451efae7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"756-pnZXkFu5Iyqc6gQB/0dJ5yu9pLo\"",
    "mtime": "2023-07-21T13:43:48.755Z",
    "size": 1878,
    "path": "../public/_nuxt/_id_.451efae7.js.br"
  },
  "/_nuxt/_id_.451efae7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"846-ctEgYCph6QVQdcKooxYxzz4pIRk\"",
    "mtime": "2023-07-21T13:43:48.749Z",
    "size": 2118,
    "path": "../public/_nuxt/_id_.451efae7.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-21T13:43:48.617Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.ae30bf2c.js": {
    "type": "application/javascript",
    "etag": "\"4be-hg1ftDBrnfIUus0uom01Lxn/2bw\"",
    "mtime": "2023-07-21T13:43:48.616Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.ae30bf2c.js"
  },
  "/_nuxt/_id_.ae30bf2c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-24ENoLq8bEq6m+DBkVnqa3dzCyk\"",
    "mtime": "2023-07-21T13:43:48.758Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.ae30bf2c.js.br"
  },
  "/_nuxt/_id_.ae30bf2c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2df-qAdU3T8iGWL1UhS+b5qBs5zioRk\"",
    "mtime": "2023-07-21T13:43:48.756Z",
    "size": 735,
    "path": "../public/_nuxt/_id_.ae30bf2c.js.gz"
  },
  "/_nuxt/_id_.fcdf749d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-2EqCKqciSSwI2lRHEUMUCe7OJzE\"",
    "mtime": "2023-07-21T13:43:48.616Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.fcdf749d.css"
  },
  "/_nuxt/_id_.fcdf749d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-GUNstigloq87EJw9AtLlpGxijWs\"",
    "mtime": "2023-07-21T13:43:48.768Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.fcdf749d.css.br"
  },
  "/_nuxt/_id_.fcdf749d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56b-TChFx/M0UO8zV7biLqt+aZr60a4\"",
    "mtime": "2023-07-21T13:43:48.759Z",
    "size": 1387,
    "path": "../public/_nuxt/_id_.fcdf749d.css.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-21T13:43:48.615Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-21T13:43:48.775Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-21T13:43:48.768Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.79e15faa.js": {
    "type": "application/javascript",
    "etag": "\"270-HAgPy6hdOf86rIDmKXT7dWMK+UM\"",
    "mtime": "2023-07-21T13:43:48.615Z",
    "size": 624,
    "path": "../public/_nuxt/basket.79e15faa.js"
  },
  "/_nuxt/catalog.3d2ca8ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d3a-A3wj4wMi7Z2L4xkRT6vNwTYC7dk\"",
    "mtime": "2023-07-21T13:43:48.614Z",
    "size": 7482,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css"
  },
  "/_nuxt/catalog.3d2ca8ce.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a4-7yS8Mc3F3PqwU7Q9362NIX67es8\"",
    "mtime": "2023-07-21T13:43:48.784Z",
    "size": 1700,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.br"
  },
  "/_nuxt/catalog.3d2ca8ce.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b6-tA8LIgQFvv2jHunrlK5ztx/dbRQ\"",
    "mtime": "2023-07-21T13:43:48.776Z",
    "size": 1974,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.gz"
  },
  "/_nuxt/catalog.c3fa6f00.js": {
    "type": "application/javascript",
    "etag": "\"1c86-34VUFhvbcOXOTGIUNtzluXO4c58\"",
    "mtime": "2023-07-21T13:43:48.614Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.c3fa6f00.js"
  },
  "/_nuxt/catalog.c3fa6f00.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"990-GghM+91Axh+34jqtTOBE0sG9dQ8\"",
    "mtime": "2023-07-21T13:43:48.793Z",
    "size": 2448,
    "path": "../public/_nuxt/catalog.c3fa6f00.js.br"
  },
  "/_nuxt/catalog.c3fa6f00.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af8-RfD/spXROB+2VMdeMQA2sQ1AotI\"",
    "mtime": "2023-07-21T13:43:48.784Z",
    "size": 2808,
    "path": "../public/_nuxt/catalog.c3fa6f00.js.gz"
  },
  "/_nuxt/checkout.c96c16a1.js": {
    "type": "application/javascript",
    "etag": "\"147c2-86k5Rq8LPtjLOG2iM05CqwYVmgc\"",
    "mtime": "2023-07-21T13:43:48.613Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.c96c16a1.js"
  },
  "/_nuxt/checkout.c96c16a1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50ac-nyrqNb1YpiDmSze5bqLTJmedWzg\"",
    "mtime": "2023-07-21T13:43:48.887Z",
    "size": 20652,
    "path": "../public/_nuxt/checkout.c96c16a1.js.br"
  },
  "/_nuxt/checkout.c96c16a1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e01-ZNaOrUFyLGcil3/QvytfJzppilU\"",
    "mtime": "2023-07-21T13:43:48.795Z",
    "size": 24065,
    "path": "../public/_nuxt/checkout.c96c16a1.js.gz"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-21T13:43:48.612Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-21T13:43:48.999Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-21T13:43:48.891Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-21T13:43:48.611Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.74a3789e.js": {
    "type": "application/javascript",
    "etag": "\"33883-DPSPo90jBnZ0/ifV10zRkYq9GpA\"",
    "mtime": "2023-07-21T13:43:48.610Z",
    "size": 211075,
    "path": "../public/_nuxt/entry.74a3789e.js"
  },
  "/_nuxt/entry.74a3789e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1148a-oBrgY5jFLeSqOtVc3XMHgt70ios\"",
    "mtime": "2023-07-21T13:43:49.325Z",
    "size": 70794,
    "path": "../public/_nuxt/entry.74a3789e.js.br"
  },
  "/_nuxt/entry.74a3789e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1365c-/2JjsijYlQTv+Fy/xS77ZM4MHtw\"",
    "mtime": "2023-07-21T13:43:49.008Z",
    "size": 79452,
    "path": "../public/_nuxt/entry.74a3789e.js.gz"
  },
  "/_nuxt/entry.7d9c73f7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2298-zMc+p3VrEbyfWSv0BroqDyxDqlk\"",
    "mtime": "2023-07-21T13:43:48.609Z",
    "size": 8856,
    "path": "../public/_nuxt/entry.7d9c73f7.css"
  },
  "/_nuxt/entry.7d9c73f7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"865-wTu9zR7m/zv7MGE5C7wUtVqDK+I\"",
    "mtime": "2023-07-21T13:43:49.336Z",
    "size": 2149,
    "path": "../public/_nuxt/entry.7d9c73f7.css.br"
  },
  "/_nuxt/entry.7d9c73f7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9cc-RIjoCh1zSqSRXgQplCG576c6ClU\"",
    "mtime": "2023-07-21T13:43:49.326Z",
    "size": 2508,
    "path": "../public/_nuxt/entry.7d9c73f7.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-21T13:43:48.608Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-21T13:43:49.341Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-21T13:43:49.337Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.81d2367f.js": {
    "type": "application/javascript",
    "etag": "\"8a4-OFjeFKu2s12FO6/HvRzG0ZvjeGQ\"",
    "mtime": "2023-07-21T13:43:48.608Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.81d2367f.js"
  },
  "/_nuxt/error-404.81d2367f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ce-DMvF+67x2LCOMrtoW/e2j9YM6HA\"",
    "mtime": "2023-07-21T13:43:49.345Z",
    "size": 974,
    "path": "../public/_nuxt/error-404.81d2367f.js.br"
  },
  "/_nuxt/error-404.81d2367f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"477-Id4rHMEVo6rFyVSKZrD0C8QRCDE\"",
    "mtime": "2023-07-21T13:43:49.342Z",
    "size": 1143,
    "path": "../public/_nuxt/error-404.81d2367f.js.gz"
  },
  "/_nuxt/error-500.5c4da4bb.js": {
    "type": "application/javascript",
    "etag": "\"757-BWr9c4d7OySILdsyD0efQt2NpfY\"",
    "mtime": "2023-07-21T13:43:48.607Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.5c4da4bb.js"
  },
  "/_nuxt/error-500.5c4da4bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34e-OqLRda9JerssvoE0prPuxL0Q35c\"",
    "mtime": "2023-07-21T13:43:49.349Z",
    "size": 846,
    "path": "../public/_nuxt/error-500.5c4da4bb.js.br"
  },
  "/_nuxt/error-500.5c4da4bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-3K9WmKO6dBiumwor/lPkG0HNFfo\"",
    "mtime": "2023-07-21T13:43:49.346Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.5c4da4bb.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-21T13:43:48.607Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-21T13:43:49.352Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-21T13:43:49.349Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.671c049f.js": {
    "type": "application/javascript",
    "etag": "\"45e-UNBEkLCc2Sp9/7+EzO0agpawcFE\"",
    "mtime": "2023-07-21T13:43:48.606Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.671c049f.js"
  },
  "/_nuxt/error-component.671c049f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-aot7b6mYSZG4HCskNuAbN5ISlwA\"",
    "mtime": "2023-07-21T13:43:49.355Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.671c049f.js.br"
  },
  "/_nuxt/error-component.671c049f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-CTuP/c2OJjt87UyJ5RAgt0YmMAw\"",
    "mtime": "2023-07-21T13:43:49.353Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.671c049f.js.gz"
  },
  "/_nuxt/favorite.9698b33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-jhDWFpVpVzahIl7O9qpSFn1p+f4\"",
    "mtime": "2023-07-21T13:43:48.605Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.9698b33c.css"
  },
  "/_nuxt/favorite.9698b33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-+f85b17ph0gDk/2u4Tt397WrMHk\"",
    "mtime": "2023-07-21T13:43:49.363Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.9698b33c.css.br"
  },
  "/_nuxt/favorite.9698b33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"619-iFobUxJ0BHLodFh3SdPk8ubtENw\"",
    "mtime": "2023-07-21T13:43:49.356Z",
    "size": 1561,
    "path": "../public/_nuxt/favorite.9698b33c.css.gz"
  },
  "/_nuxt/favorite.dfccb3d5.js": {
    "type": "application/javascript",
    "etag": "\"a30-1ciiN23s+v5LXgHwEU5oL42u4UU\"",
    "mtime": "2023-07-21T13:43:48.605Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.dfccb3d5.js"
  },
  "/_nuxt/favorite.dfccb3d5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43d-wR31A6NFb8u/ixYLFmaD7LOpZSc\"",
    "mtime": "2023-07-21T13:43:49.368Z",
    "size": 1085,
    "path": "../public/_nuxt/favorite.dfccb3d5.js.br"
  },
  "/_nuxt/favorite.dfccb3d5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f4-cBKhiBesXefLDtv6gJkyjP+oSgY\"",
    "mtime": "2023-07-21T13:43:49.363Z",
    "size": 1268,
    "path": "../public/_nuxt/favorite.dfccb3d5.js.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-21T13:43:48.604Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.3dc0b593.js": {
    "type": "application/javascript",
    "etag": "\"5a0-gQwC6VxZyKp/VqG4I87nTLCntx8\"",
    "mtime": "2023-07-21T13:43:48.604Z",
    "size": 1440,
    "path": "../public/_nuxt/index.3dc0b593.js"
  },
  "/_nuxt/index.3dc0b593.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2d3-H2yZvF/Vvtm0hV+YUo41aMp5Gvs\"",
    "mtime": "2023-07-21T13:43:49.371Z",
    "size": 723,
    "path": "../public/_nuxt/index.3dc0b593.js.br"
  },
  "/_nuxt/index.3dc0b593.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"34a-rDhngh+6rykBZoTMW/pltAt0AO8\"",
    "mtime": "2023-07-21T13:43:49.368Z",
    "size": 842,
    "path": "../public/_nuxt/index.3dc0b593.js.gz"
  },
  "/_nuxt/index.58afffcb.js": {
    "type": "application/javascript",
    "etag": "\"16a71-XH9PYgMChG5NhXRtuesqzwSmNM0\"",
    "mtime": "2023-07-21T13:43:48.603Z",
    "size": 92785,
    "path": "../public/_nuxt/index.58afffcb.js"
  },
  "/_nuxt/index.58afffcb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62df-cKRMJxBP799QuNNvdM5vr4Wea08\"",
    "mtime": "2023-07-21T13:43:49.477Z",
    "size": 25311,
    "path": "../public/_nuxt/index.58afffcb.js.br"
  },
  "/_nuxt/index.58afffcb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f73-Z7e6PMGXq+EGmGAnam6L6eya4F4\"",
    "mtime": "2023-07-21T13:43:49.374Z",
    "size": 28531,
    "path": "../public/_nuxt/index.58afffcb.js.gz"
  },
  "/_nuxt/index.61072529.js": {
    "type": "application/javascript",
    "etag": "\"3abf-mW+mPxo3s4W661bDBuImT2Mr0cw\"",
    "mtime": "2023-07-21T13:43:48.602Z",
    "size": 15039,
    "path": "../public/_nuxt/index.61072529.js"
  },
  "/_nuxt/index.61072529.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ef-j1v+yx3AokfdL8m3dGIc1s7LXmU\"",
    "mtime": "2023-07-21T13:43:49.495Z",
    "size": 4847,
    "path": "../public/_nuxt/index.61072529.js.br"
  },
  "/_nuxt/index.61072529.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-Q6yLeRFMrxwozoo4Q9JmMaD7dQM\"",
    "mtime": "2023-07-21T13:43:49.478Z",
    "size": 5362,
    "path": "../public/_nuxt/index.61072529.js.gz"
  },
  "/_nuxt/index.70b1375b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-dg6IRU/Tv7b3jG2VRspHvhJags0\"",
    "mtime": "2023-07-21T13:43:48.602Z",
    "size": 22587,
    "path": "../public/_nuxt/index.70b1375b.css"
  },
  "/_nuxt/index.70b1375b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127c-7V7vXMm6KXvg6egfRE0UIaqsLxw\"",
    "mtime": "2023-07-21T13:43:49.521Z",
    "size": 4732,
    "path": "../public/_nuxt/index.70b1375b.css.br"
  },
  "/_nuxt/index.70b1375b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-zBMSMZ0U2xdit9OXRdi1Z33YwX8\"",
    "mtime": "2023-07-21T13:43:49.496Z",
    "size": 5602,
    "path": "../public/_nuxt/index.70b1375b.css.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-21T13:43:48.601Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-21T13:43:49.526Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-21T13:43:49.522Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/isAuth.5f1ca318.js": {
    "type": "application/javascript",
    "etag": "\"213-AMF3Gl+vbGE2oUz5bh6X/2ZOMuI\"",
    "mtime": "2023-07-21T13:43:48.601Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.5f1ca318.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-21T13:43:48.600Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-21T13:43:49.530Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-21T13:43:49.527Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.bcf3335d.js": {
    "type": "application/javascript",
    "etag": "\"830-HZMlfsLeDnb34sXDkymMB9BldD4\"",
    "mtime": "2023-07-21T13:43:48.600Z",
    "size": 2096,
    "path": "../public/_nuxt/login.bcf3335d.js"
  },
  "/_nuxt/login.bcf3335d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3db-0Mdfw0G/tFEU3eVKQWBHI0Vk4uc\"",
    "mtime": "2023-07-21T13:43:49.534Z",
    "size": 987,
    "path": "../public/_nuxt/login.bcf3335d.js.br"
  },
  "/_nuxt/login.bcf3335d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a9-i7sKysOMaKnSNnWpts6tQckGBLg\"",
    "mtime": "2023-07-21T13:43:49.530Z",
    "size": 1193,
    "path": "../public/_nuxt/login.bcf3335d.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-21T13:43:48.599Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.98dc9184.js": {
    "type": "application/javascript",
    "etag": "\"4af-lhyDNk8DfEsyektck0OkVBIpNEw\"",
    "mtime": "2023-07-21T13:43:48.597Z",
    "size": 1199,
    "path": "../public/_nuxt/news.98dc9184.js"
  },
  "/_nuxt/news.98dc9184.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a8-WJVoycIPbT2HYMC3YafJth0ipuI\"",
    "mtime": "2023-07-21T13:43:49.537Z",
    "size": 424,
    "path": "../public/_nuxt/news.98dc9184.js.br"
  },
  "/_nuxt/news.98dc9184.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"218-Ow9LXCj+yOiM+jTWuCKuYFhvQPM\"",
    "mtime": "2023-07-21T13:43:49.535Z",
    "size": 536,
    "path": "../public/_nuxt/news.98dc9184.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-21T13:43:48.597Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.f0ac57fb.js": {
    "type": "application/javascript",
    "etag": "\"10a-SAB+FPv23t8OoxMGNtYwa2x28EY\"",
    "mtime": "2023-07-21T13:43:48.596Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.f0ac57fb.js"
  },
  "/_nuxt/orders.36a9406a.js": {
    "type": "application/javascript",
    "etag": "\"1cb0-iAcRyzb1uhVRG4YPdIrm/TfzaT0\"",
    "mtime": "2023-07-21T13:43:48.596Z",
    "size": 7344,
    "path": "../public/_nuxt/orders.36a9406a.js"
  },
  "/_nuxt/orders.36a9406a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"921-aoQxbWOWz/1VHyNqikFgYRy1J7g\"",
    "mtime": "2023-07-21T13:43:49.547Z",
    "size": 2337,
    "path": "../public/_nuxt/orders.36a9406a.js.br"
  },
  "/_nuxt/orders.36a9406a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"abc-BrD44PFip8oLBarL5ANWTsHIg4c\"",
    "mtime": "2023-07-21T13:43:49.539Z",
    "size": 2748,
    "path": "../public/_nuxt/orders.36a9406a.js.gz"
  },
  "/_nuxt/orders.b23111a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2599-3WO4r9iDaz0GXEG6YHpRx+dA5zg\"",
    "mtime": "2023-07-21T13:43:48.595Z",
    "size": 9625,
    "path": "../public/_nuxt/orders.b23111a3.css"
  },
  "/_nuxt/orders.b23111a3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"78b-DvXmO3aKW5YSeIFUTc75WGb8Q2k\"",
    "mtime": "2023-07-21T13:43:49.557Z",
    "size": 1931,
    "path": "../public/_nuxt/orders.b23111a3.css.br"
  },
  "/_nuxt/orders.b23111a3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8bf-9klhVOpoA3J18/wsrz2KrFn18Sw\"",
    "mtime": "2023-07-21T13:43:49.547Z",
    "size": 2239,
    "path": "../public/_nuxt/orders.b23111a3.css.gz"
  },
  "/_nuxt/profile.1ff94ae5.js": {
    "type": "application/javascript",
    "etag": "\"1241-koXnD9+i7N+g69qgddAGt59tMSk\"",
    "mtime": "2023-07-21T13:43:48.594Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.1ff94ae5.js"
  },
  "/_nuxt/profile.1ff94ae5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"70d-OpLJ7NXcW84F5Jr5NLy3MP+7a+8\"",
    "mtime": "2023-07-21T13:43:49.563Z",
    "size": 1805,
    "path": "../public/_nuxt/profile.1ff94ae5.js.br"
  },
  "/_nuxt/profile.1ff94ae5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83e-00etJm6OtPJFQFeZTFlN//KpYCg\"",
    "mtime": "2023-07-21T13:43:49.558Z",
    "size": 2110,
    "path": "../public/_nuxt/profile.1ff94ae5.js.gz"
  },
  "/_nuxt/profile.5d2eb33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4ab0-8BeAMFdT90Jn71GUmLhhlEMrcj4\"",
    "mtime": "2023-07-21T13:43:48.593Z",
    "size": 19120,
    "path": "../public/_nuxt/profile.5d2eb33c.css"
  },
  "/_nuxt/profile.5d2eb33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6d2-0w1RZhTf3NIDDgOm8ZiGKU7eZmY\"",
    "mtime": "2023-07-21T13:43:49.588Z",
    "size": 1746,
    "path": "../public/_nuxt/profile.5d2eb33c.css.br"
  },
  "/_nuxt/profile.5d2eb33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"96d-Yvb/ix3eeUvneNdeKEitET6ccPg\"",
    "mtime": "2023-07-21T13:43:49.564Z",
    "size": 2413,
    "path": "../public/_nuxt/profile.5d2eb33c.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-21T13:43:48.593Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-21T13:43:49.592Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-21T13:43:49.589Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.33c73aae.js": {
    "type": "application/javascript",
    "etag": "\"1128-l67UuN0aLc/zw084jT310V7SyZs\"",
    "mtime": "2023-07-21T13:43:48.592Z",
    "size": 4392,
    "path": "../public/_nuxt/register.33c73aae.js"
  },
  "/_nuxt/register.33c73aae.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56c-IwpiMM+1yWoDesCUyXhV2fCa4eQ\"",
    "mtime": "2023-07-21T13:43:49.598Z",
    "size": 1388,
    "path": "../public/_nuxt/register.33c73aae.js.br"
  },
  "/_nuxt/register.33c73aae.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"699-9lsedAbK2eQiVfJ0eKzvQDmi0Rk\"",
    "mtime": "2023-07-21T13:43:49.592Z",
    "size": 1689,
    "path": "../public/_nuxt/register.33c73aae.js.gz"
  },
  "/_nuxt/removeFavorite.f3af2060.js": {
    "type": "application/javascript",
    "etag": "\"3d2-0fFwhyUYgDX9SzCrAuV7DnMvp+s\"",
    "mtime": "2023-07-21T13:43:48.592Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.f3af2060.js"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-21T13:43:48.591Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-21T13:43:48.589Z",
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
