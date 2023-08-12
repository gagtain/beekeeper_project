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
    "mtime": "2023-08-12T11:56:17.660Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-12T11:56:17.658Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-12T11:56:17.656Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-12T11:56:17.654Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-12T11:56:17.652Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.57dbb577.js": {
    "type": "application/javascript",
    "etag": "\"9a2-HB7M/VU319aJLvY+oGLyCjuEXGY\"",
    "mtime": "2023-08-12T11:56:17.651Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.57dbb577.js"
  },
  "/_nuxt/BasketInfo.57dbb577.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ed-wdMwiyRYmLbh2RX/Q7QkItYMgsc\"",
    "mtime": "2023-08-12T11:56:17.673Z",
    "size": 1005,
    "path": "../public/_nuxt/BasketInfo.57dbb577.js.br"
  },
  "/_nuxt/BasketInfo.57dbb577.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-knqYFuN7X++giDMcHeZJG/DLSRE\"",
    "mtime": "2023-08-12T11:56:17.663Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.57dbb577.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-12T11:56:17.651Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-12T11:56:17.701Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-12T11:56:17.674Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.3bee93d3.js": {
    "type": "application/javascript",
    "etag": "\"11f0-zJkTeV82KaN5h6px7bXsGMKtQoU\"",
    "mtime": "2023-08-12T11:56:17.650Z",
    "size": 4592,
    "path": "../public/_nuxt/CatalogProduct.3bee93d3.js"
  },
  "/_nuxt/CatalogProduct.3bee93d3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"679-a1hPGLYwGOBYJIvPhJnOtlhNI4c\"",
    "mtime": "2023-08-12T11:56:17.708Z",
    "size": 1657,
    "path": "../public/_nuxt/CatalogProduct.3bee93d3.js.br"
  },
  "/_nuxt/CatalogProduct.3bee93d3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758-aXSHHlIMivBxxY1z13qMHPcSmCg\"",
    "mtime": "2023-08-12T11:56:17.702Z",
    "size": 1880,
    "path": "../public/_nuxt/CatalogProduct.3bee93d3.js.gz"
  },
  "/_nuxt/CatalogProduct.562eff11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29e2-WyJ5WPB3Lz8xP9JSpzmR7rstn1I\"",
    "mtime": "2023-08-12T11:56:17.650Z",
    "size": 10722,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css"
  },
  "/_nuxt/CatalogProduct.562eff11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"761-hm4JMW59nR5en2g5nBQFLBAaU10\"",
    "mtime": "2023-08-12T11:56:17.722Z",
    "size": 1889,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.br"
  },
  "/_nuxt/CatalogProduct.562eff11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ab-nlDPx/yXCFaUfL2VJz/nc0tH/IY\"",
    "mtime": "2023-08-12T11:56:17.709Z",
    "size": 2219,
    "path": "../public/_nuxt/CatalogProduct.562eff11.css.gz"
  },
  "/_nuxt/FavoriteComp.273bcbc6.js": {
    "type": "application/javascript",
    "etag": "\"e2f-Q7/xP9gZURRA878NceJFpHdNbtU\"",
    "mtime": "2023-08-12T11:56:17.649Z",
    "size": 3631,
    "path": "../public/_nuxt/FavoriteComp.273bcbc6.js"
  },
  "/_nuxt/FavoriteComp.273bcbc6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"413-/Q7M3WW7ro+KpT7qnxWDTeKR0Yw\"",
    "mtime": "2023-08-12T11:56:17.729Z",
    "size": 1043,
    "path": "../public/_nuxt/FavoriteComp.273bcbc6.js.br"
  },
  "/_nuxt/FavoriteComp.273bcbc6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-p2rXl5Q+zD7jen3a4naMHuS24bo\"",
    "mtime": "2023-08-12T11:56:17.723Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.273bcbc6.js.gz"
  },
  "/_nuxt/FavoriteComp.3f5337d0.js": {
    "type": "application/javascript",
    "etag": "\"783-9Vqr/fAhCUhtsLFOzyiUwDUD9QI\"",
    "mtime": "2023-08-12T11:56:17.649Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.3f5337d0.js"
  },
  "/_nuxt/FavoriteComp.3f5337d0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-H38VjxZj/FDkc06ZEy7lecQl14M\"",
    "mtime": "2023-08-12T11:56:17.733Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.3f5337d0.js.br"
  },
  "/_nuxt/FavoriteComp.3f5337d0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-qKX9yZE72Uu/71TAdj69SdGDClI\"",
    "mtime": "2023-08-12T11:56:17.729Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.3f5337d0.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-12T11:56:17.648Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-12T11:56:17.749Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-12T11:56:17.733Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-12T11:56:17.647Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-12T11:56:17.755Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-12T11:56:17.750Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/ImageForm.5ce69984.js": {
    "type": "application/javascript",
    "etag": "\"1ac-82UtnO7zlCxCYvRZgA2Cq/Ynhok\"",
    "mtime": "2023-08-12T11:56:17.647Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.5ce69984.js"
  },
  "/_nuxt/LoadingComp.a80eed48.js": {
    "type": "application/javascript",
    "etag": "\"1fe-H19CpZQx+k59y7O/6PXmTkU+fEw\"",
    "mtime": "2023-08-12T11:56:17.646Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.a80eed48.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-12T11:56:17.646Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.2b651a72.js": {
    "type": "application/javascript",
    "etag": "\"453-BQddUVOtdVbuMWExBA6eDaJidCA\"",
    "mtime": "2023-08-12T11:56:17.645Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.2b651a72.js"
  },
  "/_nuxt/OrderProductList.2b651a72.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20b-QyBJBjXpch3zFlVKsL1EIO5PIac\"",
    "mtime": "2023-08-12T11:56:17.759Z",
    "size": 523,
    "path": "../public/_nuxt/OrderProductList.2b651a72.js.br"
  },
  "/_nuxt/OrderProductList.2b651a72.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"243-Dkk7FS85H9TOI1NdNS2pAABSMS4\"",
    "mtime": "2023-08-12T11:56:17.757Z",
    "size": 579,
    "path": "../public/_nuxt/OrderProductList.2b651a72.js.gz"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-12T11:56:17.644Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-12T11:56:17.763Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-12T11:56:17.760Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-12T11:56:17.644Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-12T11:56:17.780Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-12T11:56:17.764Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/UserBasket.d3050e84.js": {
    "type": "application/javascript",
    "etag": "\"1309-QCSQJrIYGO6K8LBRcI2+k42mGfA\"",
    "mtime": "2023-08-12T11:56:17.643Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.d3050e84.js"
  },
  "/_nuxt/UserBasket.d3050e84.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"736-yedBHSX2rwj6OJvKwLpzXRsL7ZA\"",
    "mtime": "2023-08-12T11:56:17.787Z",
    "size": 1846,
    "path": "../public/_nuxt/UserBasket.d3050e84.js.br"
  },
  "/_nuxt/UserBasket.d3050e84.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83a-84ZDfC1ha2RdhLtN69kexzvqoqA\"",
    "mtime": "2023-08-12T11:56:17.781Z",
    "size": 2106,
    "path": "../public/_nuxt/UserBasket.d3050e84.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-12T11:56:17.642Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-12T11:56:17.642Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-12T11:56:17.803Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-12T11:56:17.788Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.c8e00758.js": {
    "type": "application/javascript",
    "etag": "\"531-v21JA+jMuvypy0QRcjI38EsvKxw\"",
    "mtime": "2023-08-12T11:56:17.641Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.c8e00758.js"
  },
  "/_nuxt/_id_.c8e00758.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"29f-qGdcY7UwygnnAgVb+F+jRC5TV6A\"",
    "mtime": "2023-08-12T11:56:17.807Z",
    "size": 671,
    "path": "../public/_nuxt/_id_.c8e00758.js.br"
  },
  "/_nuxt/_id_.c8e00758.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-2MHGzaJEu7lwna5VmESX8U7yQtA\"",
    "mtime": "2023-08-12T11:56:17.804Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.c8e00758.js.gz"
  },
  "/_nuxt/_id_.ee92af0d.js": {
    "type": "application/javascript",
    "etag": "\"12c9-TsZ47v+mxh8j2saDALOT3j2w/tg\"",
    "mtime": "2023-08-12T11:56:17.641Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.ee92af0d.js"
  },
  "/_nuxt/_id_.ee92af0d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"760-rR/xCgo+a31nvF6n3wFN59HfKC4\"",
    "mtime": "2023-08-12T11:56:17.813Z",
    "size": 1888,
    "path": "../public/_nuxt/_id_.ee92af0d.js.br"
  },
  "/_nuxt/_id_.ee92af0d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"859-9FOTm076M8ok+Z+LX+Ayj7bS+xg\"",
    "mtime": "2023-08-12T11:56:17.807Z",
    "size": 2137,
    "path": "../public/_nuxt/_id_.ee92af0d.js.gz"
  },
  "/_nuxt/basket.9e637fc7.js": {
    "type": "application/javascript",
    "etag": "\"294-Yh3eb7HGyxcKj2yrDsjKJJ+h2Gk\"",
    "mtime": "2023-08-12T11:56:17.640Z",
    "size": 660,
    "path": "../public/_nuxt/basket.9e637fc7.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-12T11:56:17.640Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-12T11:56:17.822Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-12T11:56:17.814Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.208f51a2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1eaf-zKYdMAraEOxheGscOzazZywvsAs\"",
    "mtime": "2023-08-12T11:56:17.639Z",
    "size": 7855,
    "path": "../public/_nuxt/catalog.208f51a2.css"
  },
  "/_nuxt/catalog.208f51a2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ed-nWTRx9NDx7cffUBbWS1RVvoG3vI\"",
    "mtime": "2023-08-12T11:56:17.832Z",
    "size": 1773,
    "path": "../public/_nuxt/catalog.208f51a2.css.br"
  },
  "/_nuxt/catalog.208f51a2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"809-QHu0Ey2aXngmMJnhSSs7lGdRFJ8\"",
    "mtime": "2023-08-12T11:56:17.822Z",
    "size": 2057,
    "path": "../public/_nuxt/catalog.208f51a2.css.gz"
  },
  "/_nuxt/catalog.36999d7c.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-Kr5gmnyZ4WjtBD7tr5eIXSCsLb8\"",
    "mtime": "2023-08-12T11:56:17.638Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.36999d7c.js"
  },
  "/_nuxt/catalog.36999d7c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"922-egJwqECPMSDXLT4KFVWuBwMCwvs\"",
    "mtime": "2023-08-12T11:56:17.841Z",
    "size": 2338,
    "path": "../public/_nuxt/catalog.36999d7c.js.br"
  },
  "/_nuxt/catalog.36999d7c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a98-7oyYaRYudylPCezRVYXarWbGDdc\"",
    "mtime": "2023-08-12T11:56:17.832Z",
    "size": 2712,
    "path": "../public/_nuxt/catalog.36999d7c.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-12T11:56:17.638Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.b5221ee8.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-lAtfX3Nr2LogMZOunad4juzAuVI\"",
    "mtime": "2023-08-12T11:56:17.637Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.b5221ee8.js"
  },
  "/_nuxt/checkout.b5221ee8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"52a2-lKhH6AD0IpXIGLGXNMxlTr1F4e8\"",
    "mtime": "2023-08-12T11:56:17.942Z",
    "size": 21154,
    "path": "../public/_nuxt/checkout.b5221ee8.js.br"
  },
  "/_nuxt/checkout.b5221ee8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fce-m8EbCyGVtHHz0h8l0xmFUub2Qc0\"",
    "mtime": "2023-08-12T11:56:17.844Z",
    "size": 24526,
    "path": "../public/_nuxt/checkout.b5221ee8.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-12T11:56:17.636Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-12T11:56:18.078Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-12T11:56:17.946Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-12T11:56:17.634Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.2f8588e7.js": {
    "type": "application/javascript",
    "etag": "\"34763-VlpikiMbJweJACxt6XWzKRa7snc\"",
    "mtime": "2023-08-12T11:56:17.633Z",
    "size": 214883,
    "path": "../public/_nuxt/entry.2f8588e7.js"
  },
  "/_nuxt/entry.2f8588e7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11884-NQSlhmdRBpyY3YWs5wvZhHxw+8I\"",
    "mtime": "2023-08-12T11:56:18.442Z",
    "size": 71812,
    "path": "../public/_nuxt/entry.2f8588e7.js.br"
  },
  "/_nuxt/entry.2f8588e7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13aeb-Oc8LsVHZnYF0Qw2m229V8lMnqbE\"",
    "mtime": "2023-08-12T11:56:18.088Z",
    "size": 80619,
    "path": "../public/_nuxt/entry.2f8588e7.js.gz"
  },
  "/_nuxt/entry.ac96172a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-SOY02H06gHnU32lZZj5J3R9hR2s\"",
    "mtime": "2023-08-12T11:56:17.631Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.ac96172a.css"
  },
  "/_nuxt/entry.ac96172a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"943-Wte/q5nXp/ZpqQx6eEKOn5JOA84\"",
    "mtime": "2023-08-12T11:56:18.453Z",
    "size": 2371,
    "path": "../public/_nuxt/entry.ac96172a.css.br"
  },
  "/_nuxt/entry.ac96172a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-rtr0qnbfj2KDIxcgmohRfkqZDIU\"",
    "mtime": "2023-08-12T11:56:18.443Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.ac96172a.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-12T11:56:17.630Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-12T11:56:18.458Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-12T11:56:18.454Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.cf522a14.js": {
    "type": "application/javascript",
    "etag": "\"8a8-ZCu2Z+zvPeRcZ9q7yP4RvoqtrnU\"",
    "mtime": "2023-08-12T11:56:17.629Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.cf522a14.js"
  },
  "/_nuxt/error-404.cf522a14.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-4YW4S/9CV/RBf9lh5fWefmNO0T0\"",
    "mtime": "2023-08-12T11:56:18.462Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.cf522a14.js.br"
  },
  "/_nuxt/error-404.cf522a14.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-NpzCWMYMZO2TZgLR82IRmjJgHR8\"",
    "mtime": "2023-08-12T11:56:18.459Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.cf522a14.js.gz"
  },
  "/_nuxt/error-500.35a6f320.js": {
    "type": "application/javascript",
    "etag": "\"756-ebgpW+p7Lk7452wJ5ZWb2RHDE6M\"",
    "mtime": "2023-08-12T11:56:17.629Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.35a6f320.js"
  },
  "/_nuxt/error-500.35a6f320.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-4V1IIFFLYoreIEaPmNmW5zTixoE\"",
    "mtime": "2023-08-12T11:56:18.466Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.35a6f320.js.br"
  },
  "/_nuxt/error-500.35a6f320.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-BsiaQxpCAvW/rMtTtday71cesiI\"",
    "mtime": "2023-08-12T11:56:18.463Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.35a6f320.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-12T11:56:17.628Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-12T11:56:18.470Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-12T11:56:18.467Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.738ba94d.js": {
    "type": "application/javascript",
    "etag": "\"45e-0nb+eA6+kW1DWvmQcu4rBWwmB8I\"",
    "mtime": "2023-08-12T11:56:17.627Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.738ba94d.js"
  },
  "/_nuxt/error-component.738ba94d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-bQdhLhuKDMaFROiVZ7AMPoin7dw\"",
    "mtime": "2023-08-12T11:56:18.473Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.738ba94d.js.br"
  },
  "/_nuxt/error-component.738ba94d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-AifoCl6SwocWLucEYauyYK5b4tI\"",
    "mtime": "2023-08-12T11:56:18.471Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.738ba94d.js.gz"
  },
  "/_nuxt/favorite.53307e50.js": {
    "type": "application/javascript",
    "etag": "\"a31-ltYPinby9R+jJJHlyEFsIy9CNwU\"",
    "mtime": "2023-08-12T11:56:17.627Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.53307e50.js"
  },
  "/_nuxt/favorite.53307e50.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"450-teyD/LqFgMJPqomFj1Miam26Aic\"",
    "mtime": "2023-08-12T11:56:18.478Z",
    "size": 1104,
    "path": "../public/_nuxt/favorite.53307e50.js.br"
  },
  "/_nuxt/favorite.53307e50.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"506-Qv16N8vPOVMXLq/au0XGSMy1fWI\"",
    "mtime": "2023-08-12T11:56:18.474Z",
    "size": 1286,
    "path": "../public/_nuxt/favorite.53307e50.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-12T11:56:17.626Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-12T11:56:18.486Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-12T11:56:18.479Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-12T11:56:17.625Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-12T11:56:17.624Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-12T11:56:17.623Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-12T11:56:18.490Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-12T11:56:18.487Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.3f61a3d0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a12-vU6mRIuPM7fyHPrO+/f2lOoyopo\"",
    "mtime": "2023-08-12T11:56:17.623Z",
    "size": 23058,
    "path": "../public/_nuxt/index.3f61a3d0.css"
  },
  "/_nuxt/index.3f61a3d0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12da-C0cvbMOskbbKTYukiWhFlu+V1U0\"",
    "mtime": "2023-08-12T11:56:18.518Z",
    "size": 4826,
    "path": "../public/_nuxt/index.3f61a3d0.css.br"
  },
  "/_nuxt/index.3f61a3d0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"165e-38drc9Kk6KB/otcG4dvs6dAFjEA\"",
    "mtime": "2023-08-12T11:56:18.491Z",
    "size": 5726,
    "path": "../public/_nuxt/index.3f61a3d0.css.gz"
  },
  "/_nuxt/index.3fe95575.js": {
    "type": "application/javascript",
    "etag": "\"645-BiHuCj6jnmxkXzm/YrbR8YVVtJk\"",
    "mtime": "2023-08-12T11:56:17.622Z",
    "size": 1605,
    "path": "../public/_nuxt/index.3fe95575.js"
  },
  "/_nuxt/index.3fe95575.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"328-yrpxaU8DiYkaY6bBtQmf3llqkiA\"",
    "mtime": "2023-08-12T11:56:18.522Z",
    "size": 808,
    "path": "../public/_nuxt/index.3fe95575.js.br"
  },
  "/_nuxt/index.3fe95575.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b8-9TvAhi0bJeIAUx32N0mrrofR1zQ\"",
    "mtime": "2023-08-12T11:56:18.519Z",
    "size": 952,
    "path": "../public/_nuxt/index.3fe95575.js.gz"
  },
  "/_nuxt/index.5195bf3e.js": {
    "type": "application/javascript",
    "etag": "\"18c53-sGWI+yn/W8gFCrbt9pXvvO5/cYs\"",
    "mtime": "2023-08-12T11:56:17.621Z",
    "size": 101459,
    "path": "../public/_nuxt/index.5195bf3e.js"
  },
  "/_nuxt/index.5195bf3e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6eb0-dKfO0md3zEId1P9qIUbat9X+EHk\"",
    "mtime": "2023-08-12T11:56:18.655Z",
    "size": 28336,
    "path": "../public/_nuxt/index.5195bf3e.js.br"
  },
  "/_nuxt/index.5195bf3e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7da7-R7ehQR7wqddhLdeUpjZIOoQDaH8\"",
    "mtime": "2023-08-12T11:56:18.526Z",
    "size": 32167,
    "path": "../public/_nuxt/index.5195bf3e.js.gz"
  },
  "/_nuxt/index.ce8d2d24.js": {
    "type": "application/javascript",
    "etag": "\"3ac4-Gc61o5feE/usgNCQor/dsaGGoPs\"",
    "mtime": "2023-08-12T11:56:17.619Z",
    "size": 15044,
    "path": "../public/_nuxt/index.ce8d2d24.js"
  },
  "/_nuxt/index.ce8d2d24.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f6-f4pSubw/DNjXqMnYCLTdp6qu7E0\"",
    "mtime": "2023-08-12T11:56:18.673Z",
    "size": 4854,
    "path": "../public/_nuxt/index.ce8d2d24.js.br"
  },
  "/_nuxt/index.ce8d2d24.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f4-zY7geLAVV75eQNCX//VmeBMZuBg\"",
    "mtime": "2023-08-12T11:56:18.656Z",
    "size": 5364,
    "path": "../public/_nuxt/index.ce8d2d24.js.gz"
  },
  "/_nuxt/isAuth.815a9365.js": {
    "type": "application/javascript",
    "etag": "\"211-BoCbxKxI8nWerjV8j+9i9NEcONU\"",
    "mtime": "2023-08-12T11:56:17.618Z",
    "size": 529,
    "path": "../public/_nuxt/isAuth.815a9365.js"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-12T11:56:17.617Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-12T11:56:18.677Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-12T11:56:18.674Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/login.d5c3268c.js": {
    "type": "application/javascript",
    "etag": "\"809-Gsb0M6K7goqg0jeOwaTt21RWo+o\"",
    "mtime": "2023-08-12T11:56:17.616Z",
    "size": 2057,
    "path": "../public/_nuxt/login.d5c3268c.js"
  },
  "/_nuxt/login.d5c3268c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e9-j8GdalUdSeCuoGL+2zKOg4R35Os\"",
    "mtime": "2023-08-12T11:56:18.682Z",
    "size": 1001,
    "path": "../public/_nuxt/login.d5c3268c.js.br"
  },
  "/_nuxt/login.d5c3268c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ae-8XXYJ7K125TJzGVqASoQ4qw+bJo\"",
    "mtime": "2023-08-12T11:56:18.678Z",
    "size": 1198,
    "path": "../public/_nuxt/login.d5c3268c.js.gz"
  },
  "/_nuxt/newsList.19c91e60.js": {
    "type": "application/javascript",
    "etag": "\"e6-AVttkcplyGp1Xw2KM31/l8s9ABw\"",
    "mtime": "2023-08-12T11:56:17.615Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.19c91e60.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-12T11:56:17.614Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-12T11:56:18.693Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-12T11:56:18.683Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.f84a9be8.js": {
    "type": "application/javascript",
    "etag": "\"26b6-1RSCAt7rj56Px50og4+EWfaRhNE\"",
    "mtime": "2023-08-12T11:56:17.613Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.f84a9be8.js"
  },
  "/_nuxt/orders.f84a9be8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bca-pEuG/bgg0E8FIfds+ZBvakWzRuo\"",
    "mtime": "2023-08-12T11:56:18.705Z",
    "size": 3018,
    "path": "../public/_nuxt/orders.f84a9be8.js.br"
  },
  "/_nuxt/orders.f84a9be8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-Eaf69yWoKCY3yiejfe0b/hB3CCw\"",
    "mtime": "2023-08-12T11:56:18.694Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.f84a9be8.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-12T11:56:17.613Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-12T11:56:17.611Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-12T11:56:18.741Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-12T11:56:18.707Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.b009ba2e.js": {
    "type": "application/javascript",
    "etag": "\"168b-xaiWudXxBSEvZOcqi16+makEcL0\"",
    "mtime": "2023-08-12T11:56:17.610Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.b009ba2e.js"
  },
  "/_nuxt/profile.b009ba2e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83f-fdDv8/lKRr9ppydhk48k58OmjG8\"",
    "mtime": "2023-08-12T11:56:18.749Z",
    "size": 2111,
    "path": "../public/_nuxt/profile.b009ba2e.js.br"
  },
  "/_nuxt/profile.b009ba2e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a0-CjVMNWVAmEThLUSedbew9jHx2xQ\"",
    "mtime": "2023-08-12T11:56:18.742Z",
    "size": 2464,
    "path": "../public/_nuxt/profile.b009ba2e.js.gz"
  },
  "/_nuxt/register.012ce541.js": {
    "type": "application/javascript",
    "etag": "\"11b8-6QyFAmFFRO5NwXelsVqy0mByhDM\"",
    "mtime": "2023-08-12T11:56:17.609Z",
    "size": 4536,
    "path": "../public/_nuxt/register.012ce541.js"
  },
  "/_nuxt/register.012ce541.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5c0-+UIk8PvpXdxWyPsN6EdwNrH0VOA\"",
    "mtime": "2023-08-12T11:56:18.756Z",
    "size": 1472,
    "path": "../public/_nuxt/register.012ce541.js.br"
  },
  "/_nuxt/register.012ce541.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f9-SadcVuyeMK195fJ6SLltUdsMH9Q\"",
    "mtime": "2023-08-12T11:56:18.750Z",
    "size": 1785,
    "path": "../public/_nuxt/register.012ce541.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-12T11:56:17.608Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-12T11:56:18.759Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-12T11:56:18.756Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-12T11:56:17.606Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-12T11:56:17.605Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-12T11:56:18.763Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-12T11:56:18.760Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-12T11:56:17.604Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-12T11:56:17.601Z",
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
