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
    "mtime": "2023-08-12T15:21:29.268Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-12T15:21:29.266Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-12T15:21:29.265Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-12T15:21:29.261Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-12T15:21:29.259Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.79ddf31f.js": {
    "type": "application/javascript",
    "etag": "\"9a2-4cQaHu3gEwwAhkWsNmvT02Eynsg\"",
    "mtime": "2023-08-12T15:21:29.258Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.79ddf31f.js"
  },
  "/_nuxt/BasketInfo.79ddf31f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ed-AeMsc8D6o2uE33l9/OW+C0H+cPI\"",
    "mtime": "2023-08-12T15:21:29.277Z",
    "size": 1005,
    "path": "../public/_nuxt/BasketInfo.79ddf31f.js.br"
  },
  "/_nuxt/BasketInfo.79ddf31f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-vm5tLbgmRNZ0oIhKsVkp60ofoVg\"",
    "mtime": "2023-08-12T15:21:29.273Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.79ddf31f.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-12T15:21:29.258Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-12T15:21:29.302Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-12T15:21:29.278Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.0b692491.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-tT8xvDEhVVhcntwCpdSzkMzQ8m8\"",
    "mtime": "2023-08-12T15:21:29.257Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css"
  },
  "/_nuxt/CatalogProduct.0b692491.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75b-v9nfct6hHYABDkJ6hCYAeKb9WVs\"",
    "mtime": "2023-08-12T15:21:29.315Z",
    "size": 1883,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.br"
  },
  "/_nuxt/CatalogProduct.0b692491.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8a0-RpksUBryp4HqHj7qs4rGN3HCBAw\"",
    "mtime": "2023-08-12T15:21:29.303Z",
    "size": 2208,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.gz"
  },
  "/_nuxt/CatalogProduct.de5c7e19.js": {
    "type": "application/javascript",
    "etag": "\"1237-WgwPVtuPVV3irTpkXVll2nSUt7A\"",
    "mtime": "2023-08-12T15:21:29.256Z",
    "size": 4663,
    "path": "../public/_nuxt/CatalogProduct.de5c7e19.js"
  },
  "/_nuxt/CatalogProduct.de5c7e19.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"68a-zJinFRk3F0SYfLkXtQZf0ied2c0\"",
    "mtime": "2023-08-12T15:21:29.321Z",
    "size": 1674,
    "path": "../public/_nuxt/CatalogProduct.de5c7e19.js.br"
  },
  "/_nuxt/CatalogProduct.de5c7e19.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"77e-lHdbP/sKtFMNmtiRcDaoZjl+GPg\"",
    "mtime": "2023-08-12T15:21:29.316Z",
    "size": 1918,
    "path": "../public/_nuxt/CatalogProduct.de5c7e19.js.gz"
  },
  "/_nuxt/FavoriteComp.1647dc34.js": {
    "type": "application/javascript",
    "etag": "\"783-prH3hrN3ixDLRa2HjuXzIYczeI0\"",
    "mtime": "2023-08-12T15:21:29.255Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.1647dc34.js"
  },
  "/_nuxt/FavoriteComp.1647dc34.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"290-UGwCNReg2SUvrFtDnRiRFrMoq1U\"",
    "mtime": "2023-08-12T15:21:29.325Z",
    "size": 656,
    "path": "../public/_nuxt/FavoriteComp.1647dc34.js.br"
  },
  "/_nuxt/FavoriteComp.1647dc34.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-Ftmmu7FW8qnzZqsmBfE2X8NWD/c\"",
    "mtime": "2023-08-12T15:21:29.322Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.1647dc34.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-12T15:21:29.254Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-12T15:21:29.342Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-12T15:21:29.326Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-12T15:21:29.253Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-12T15:21:29.348Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-12T15:21:29.343Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.ec3163c1.js": {
    "type": "application/javascript",
    "etag": "\"e2e-zYTfVTNjnfS+RYzrGEcDxGHrCoQ\"",
    "mtime": "2023-08-12T15:21:29.253Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.ec3163c1.js"
  },
  "/_nuxt/FavoriteComp.ec3163c1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"412-LNQu5YryyDBf0m6WCnMY+Ej2Iyk\"",
    "mtime": "2023-08-12T15:21:29.354Z",
    "size": 1042,
    "path": "../public/_nuxt/FavoriteComp.ec3163c1.js.br"
  },
  "/_nuxt/FavoriteComp.ec3163c1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-HLUpi6DvT+P3hIC52ZnfBnXKJBw\"",
    "mtime": "2023-08-12T15:21:29.349Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.ec3163c1.js.gz"
  },
  "/_nuxt/ImageForm.b7ae6833.js": {
    "type": "application/javascript",
    "etag": "\"1ac-c7FaDmlt8uxQTtNWOKSbbYrECOo\"",
    "mtime": "2023-08-12T15:21:29.252Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.b7ae6833.js"
  },
  "/_nuxt/LoadingComp.7b31d636.js": {
    "type": "application/javascript",
    "etag": "\"1fe-GRysRMaYu919g8d3PSaZlw/eR7g\"",
    "mtime": "2023-08-12T15:21:29.251Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.7b31d636.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-12T15:21:29.250Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-12T15:21:29.250Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-12T15:21:29.358Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-12T15:21:29.356Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.ced268ee.js": {
    "type": "application/javascript",
    "etag": "\"453-AqbI+xpoXgCUenqDb8IonRWCkdI\"",
    "mtime": "2023-08-12T15:21:29.249Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.ced268ee.js"
  },
  "/_nuxt/OrderProductList.ced268ee.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-BhHtwBtT9a87GIrwf1Y5IjWuRd0\"",
    "mtime": "2023-08-12T15:21:29.361Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.ced268ee.js.br"
  },
  "/_nuxt/OrderProductList.ced268ee.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"242-lZgP3gDdkz3Hw9Qi3Q/h8S7QlSI\"",
    "mtime": "2023-08-12T15:21:29.359Z",
    "size": 578,
    "path": "../public/_nuxt/OrderProductList.ced268ee.js.gz"
  },
  "/_nuxt/UserBasket.b096dac3.js": {
    "type": "application/javascript",
    "etag": "\"1309-CHuA3zREnzXA+Z/xKrUFL6WlTxk\"",
    "mtime": "2023-08-12T15:21:29.248Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.b096dac3.js"
  },
  "/_nuxt/UserBasket.b096dac3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72d-TOMdaGKUtRrX3hwz9TMg0jSwoj0\"",
    "mtime": "2023-08-12T15:21:29.368Z",
    "size": 1837,
    "path": "../public/_nuxt/UserBasket.b096dac3.js.br"
  },
  "/_nuxt/UserBasket.b096dac3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"839-GSmL4m9cNayN+oAYXMHkL57ZrgE\"",
    "mtime": "2023-08-12T15:21:29.362Z",
    "size": 2105,
    "path": "../public/_nuxt/UserBasket.b096dac3.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-12T15:21:29.247Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-12T15:21:29.387Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-12T15:21:29.370Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.3d367390.js": {
    "type": "application/javascript",
    "etag": "\"531-G4EkOlqL+2NBsebpbCgHvfTMn4o\"",
    "mtime": "2023-08-12T15:21:29.246Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.3d367390.js"
  },
  "/_nuxt/_id_.3d367390.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-ipTOYl/HtaAIYdy4ntzR5DaQraA\"",
    "mtime": "2023-08-12T15:21:29.390Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.3d367390.js.br"
  },
  "/_nuxt/_id_.3d367390.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-JBIW0iSEVmQAgZr5NKbm76IrJog\"",
    "mtime": "2023-08-12T15:21:29.388Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.3d367390.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-12T15:21:29.245Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-12T15:21:29.245Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-12T15:21:29.405Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-12T15:21:29.391Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.d8909c69.js": {
    "type": "application/javascript",
    "etag": "\"12c9-5aBSARxg1YE2NYPS6KVZ+EBzOgY\"",
    "mtime": "2023-08-12T15:21:29.244Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.d8909c69.js"
  },
  "/_nuxt/_id_.d8909c69.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"763-pE4lZ+Fm60x4v48ycY+qeswpGa0\"",
    "mtime": "2023-08-12T15:21:29.412Z",
    "size": 1891,
    "path": "../public/_nuxt/_id_.d8909c69.js.br"
  },
  "/_nuxt/_id_.d8909c69.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"857-gMPa8DVk3hrvxRZOD/cfjIS/0Bw\"",
    "mtime": "2023-08-12T15:21:29.406Z",
    "size": 2135,
    "path": "../public/_nuxt/_id_.d8909c69.js.gz"
  },
  "/_nuxt/basket.1718992f.js": {
    "type": "application/javascript",
    "etag": "\"294-HlsqH2DRLT1pJ4OjUTo2CwnWEw4\"",
    "mtime": "2023-08-12T15:21:29.243Z",
    "size": 660,
    "path": "../public/_nuxt/basket.1718992f.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-12T15:21:29.242Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-12T15:21:29.419Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-12T15:21:29.413Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.2e40bba2.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-vb5LdMA0UpPq/RlbQHQ5hoTlmjg\"",
    "mtime": "2023-08-12T15:21:29.241Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.2e40bba2.js"
  },
  "/_nuxt/catalog.2e40bba2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"924-v6eOlHe5VaN9BSYsjr4OT2r1Qeo\"",
    "mtime": "2023-08-12T15:21:29.428Z",
    "size": 2340,
    "path": "../public/_nuxt/catalog.2e40bba2.js.br"
  },
  "/_nuxt/catalog.2e40bba2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a97-9/wBvlSUKXAlxeMTA1KmVceh8Tc\"",
    "mtime": "2023-08-12T15:21:29.420Z",
    "size": 2711,
    "path": "../public/_nuxt/catalog.2e40bba2.js.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-12T15:21:29.240Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-12T15:21:29.437Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-12T15:21:29.429Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/checkout.c401351e.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-xrFwLVfbgp5rfQ+ZlbxHrz5zYrw\"",
    "mtime": "2023-08-12T15:21:29.239Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.c401351e.js"
  },
  "/_nuxt/checkout.c401351e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5277-9FK0KP76dbuqKXIYzKkrrKy5jQQ\"",
    "mtime": "2023-08-12T15:21:29.531Z",
    "size": 21111,
    "path": "../public/_nuxt/checkout.c401351e.js.br"
  },
  "/_nuxt/checkout.c401351e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fd0-tfMWtbKICfY48VDJtefWfpaQjGQ\"",
    "mtime": "2023-08-12T15:21:29.439Z",
    "size": 24528,
    "path": "../public/_nuxt/checkout.c401351e.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-12T15:21:29.238Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-12T15:21:29.657Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-12T15:21:29.534Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/entry.272e06cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-eN42h3tjGA7e3Q9pNkJqyBk/Y34\"",
    "mtime": "2023-08-12T15:21:29.236Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.272e06cb.css"
  },
  "/_nuxt/entry.272e06cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"949-4kq5TgrgIGq5pEFftgFn0fVOTA0\"",
    "mtime": "2023-08-12T15:21:29.668Z",
    "size": 2377,
    "path": "../public/_nuxt/entry.272e06cb.css.br"
  },
  "/_nuxt/entry.272e06cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab4-0c4iM8gSpya0NQ6SIJ49nqsMmzU\"",
    "mtime": "2023-08-12T15:21:29.657Z",
    "size": 2740,
    "path": "../public/_nuxt/entry.272e06cb.css.gz"
  },
  "/_nuxt/entry.5c7fb126.js": {
    "type": "application/javascript",
    "etag": "\"36240-Op324gSemWurk/o/yQ9Vo56uM9g\"",
    "mtime": "2023-08-12T15:21:29.236Z",
    "size": 221760,
    "path": "../public/_nuxt/entry.5c7fb126.js"
  },
  "/_nuxt/entry.5c7fb126.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120b5-6fzCJzdlUKEHFPI1nsRm6auvBd8\"",
    "mtime": "2023-08-12T15:21:30.019Z",
    "size": 73909,
    "path": "../public/_nuxt/entry.5c7fb126.js.br"
  },
  "/_nuxt/entry.5c7fb126.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1450e-snujTqlVD7f+KtKWpb+wKMF7U2s\"",
    "mtime": "2023-08-12T15:21:29.677Z",
    "size": 83214,
    "path": "../public/_nuxt/entry.5c7fb126.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-12T15:21:29.234Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-12T15:21:30.025Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-12T15:21:30.020Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.5e3cd9d0.js": {
    "type": "application/javascript",
    "etag": "\"8a8-2sHZnNTVhHcD21WVIuC0Ro91FCQ\"",
    "mtime": "2023-08-12T15:21:29.233Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.5e3cd9d0.js"
  },
  "/_nuxt/error-404.5e3cd9d0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-hSZoGS7302z4aThSxRWBJwP7K4o\"",
    "mtime": "2023-08-12T15:21:30.029Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.5e3cd9d0.js.br"
  },
  "/_nuxt/error-404.5e3cd9d0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-5fAdHdkiU53lezf1Ca17qiTDySI\"",
    "mtime": "2023-08-12T15:21:30.025Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.5e3cd9d0.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-12T15:21:29.232Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-12T15:21:30.032Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-12T15:21:30.029Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.cb826d4f.js": {
    "type": "application/javascript",
    "etag": "\"756-BPU+jgJX06Kb9mpy1w6nlmSEmn0\"",
    "mtime": "2023-08-12T15:21:29.231Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.cb826d4f.js"
  },
  "/_nuxt/error-500.cb826d4f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"349-AMzoZ3PuwmRsQFUaYjWgJIznoUk\"",
    "mtime": "2023-08-12T15:21:30.036Z",
    "size": 841,
    "path": "../public/_nuxt/error-500.cb826d4f.js.br"
  },
  "/_nuxt/error-500.cb826d4f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-WvCH7xUQZ4xDopfe+7ORjofyhzc\"",
    "mtime": "2023-08-12T15:21:30.033Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.cb826d4f.js.gz"
  },
  "/_nuxt/error-component.c805e41a.js": {
    "type": "application/javascript",
    "etag": "\"45e-DcrcJGjwbdiOSZNh7CFUA3ed+Ug\"",
    "mtime": "2023-08-12T15:21:29.231Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.c805e41a.js"
  },
  "/_nuxt/error-component.c805e41a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"209-abcnVodMUqXJRO7wgTrKWejsYTg\"",
    "mtime": "2023-08-12T15:21:30.038Z",
    "size": 521,
    "path": "../public/_nuxt/error-component.c805e41a.js.br"
  },
  "/_nuxt/error-component.c805e41a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-GPsarx55wSrtGHC97uN5I3F6C8c\"",
    "mtime": "2023-08-12T15:21:30.036Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.c805e41a.js.gz"
  },
  "/_nuxt/favorite.0b1e8e4d.js": {
    "type": "application/javascript",
    "etag": "\"a31-3mxRd47zu64jHDhd/WMOP1I6G9I\"",
    "mtime": "2023-08-12T15:21:29.230Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.0b1e8e4d.js"
  },
  "/_nuxt/favorite.0b1e8e4d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44f-UMId36N3qFJfSniXKznN8swHFM4\"",
    "mtime": "2023-08-12T15:21:30.043Z",
    "size": 1103,
    "path": "../public/_nuxt/favorite.0b1e8e4d.js.br"
  },
  "/_nuxt/favorite.0b1e8e4d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"505-ijPdB270jwdj3/nd+olhzKRaZsY\"",
    "mtime": "2023-08-12T15:21:30.039Z",
    "size": 1285,
    "path": "../public/_nuxt/favorite.0b1e8e4d.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-12T15:21:29.229Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-12T15:21:30.050Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-12T15:21:30.043Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-12T15:21:29.229Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-12T15:21:29.228Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-12T15:21:29.227Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-12T15:21:30.055Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-12T15:21:30.051Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.78f3c85e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5190-eKtxMciUgFVu76bdiGdIP7QhIE4\"",
    "mtime": "2023-08-12T15:21:29.226Z",
    "size": 20880,
    "path": "../public/_nuxt/index.78f3c85e.css"
  },
  "/_nuxt/index.78f3c85e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12c1-2UJ2PrXNFEs830RhJHtrlicOAzs\"",
    "mtime": "2023-08-12T15:21:30.077Z",
    "size": 4801,
    "path": "../public/_nuxt/index.78f3c85e.css.br"
  },
  "/_nuxt/index.78f3c85e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"156a-BewQYcrA1pWOmWZL09bObv8O1q0\"",
    "mtime": "2023-08-12T15:21:30.056Z",
    "size": 5482,
    "path": "../public/_nuxt/index.78f3c85e.css.gz"
  },
  "/_nuxt/index.81d285e9.js": {
    "type": "application/javascript",
    "etag": "\"17043-L+oQPlJH+WDoDtjC7fpudOoAuSM\"",
    "mtime": "2023-08-12T15:21:29.225Z",
    "size": 94275,
    "path": "../public/_nuxt/index.81d285e9.js"
  },
  "/_nuxt/index.81d285e9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"654b-vVP0TJJ3yBruuDKhOaK4ABfMtj4\"",
    "mtime": "2023-08-12T15:21:30.191Z",
    "size": 25931,
    "path": "../public/_nuxt/index.81d285e9.js.br"
  },
  "/_nuxt/index.81d285e9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7301-1V/s495Xx5JJT0V3kv3bn0zRXQQ\"",
    "mtime": "2023-08-12T15:21:30.081Z",
    "size": 29441,
    "path": "../public/_nuxt/index.81d285e9.js.gz"
  },
  "/_nuxt/index.bfc3d640.js": {
    "type": "application/javascript",
    "etag": "\"3aba-v5xBDHgAVuuRcFoqMD041tO7Sw0\"",
    "mtime": "2023-08-12T15:21:29.224Z",
    "size": 15034,
    "path": "../public/_nuxt/index.bfc3d640.js"
  },
  "/_nuxt/index.bfc3d640.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f9-OEYJo1Gm3OPfroAlpaVN+6KKcr4\"",
    "mtime": "2023-08-12T15:21:30.209Z",
    "size": 4857,
    "path": "../public/_nuxt/index.bfc3d640.js.br"
  },
  "/_nuxt/index.bfc3d640.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-zMnRmoZIpTMuVFSNv0YO5qlxEjU\"",
    "mtime": "2023-08-12T15:21:30.192Z",
    "size": 5360,
    "path": "../public/_nuxt/index.bfc3d640.js.gz"
  },
  "/_nuxt/index.f7cd038a.js": {
    "type": "application/javascript",
    "etag": "\"645-9WRklE7ym8c19hSOJPHnBaiN+Ds\"",
    "mtime": "2023-08-12T15:21:29.223Z",
    "size": 1605,
    "path": "../public/_nuxt/index.f7cd038a.js"
  },
  "/_nuxt/index.f7cd038a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"339-uYEEMH3KdYfjEppvJCtXokSXI2A\"",
    "mtime": "2023-08-12T15:21:30.214Z",
    "size": 825,
    "path": "../public/_nuxt/index.f7cd038a.js.br"
  },
  "/_nuxt/index.f7cd038a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b9-23mwagLUVOvITa4CZvN95vZmX7o\"",
    "mtime": "2023-08-12T15:21:30.210Z",
    "size": 953,
    "path": "../public/_nuxt/index.f7cd038a.js.gz"
  },
  "/_nuxt/isAuth.b7dbb9e7.js": {
    "type": "application/javascript",
    "etag": "\"20f-r/Iumcshtnq71TcrW6f0fv0atgE\"",
    "mtime": "2023-08-12T15:21:29.223Z",
    "size": 527,
    "path": "../public/_nuxt/isAuth.b7dbb9e7.js"
  },
  "/_nuxt/login.5e529290.js": {
    "type": "application/javascript",
    "etag": "\"809-2Z/99O+BByuzR0wnf6SxOEcvZ58\"",
    "mtime": "2023-08-12T15:21:29.222Z",
    "size": 2057,
    "path": "../public/_nuxt/login.5e529290.js"
  },
  "/_nuxt/login.5e529290.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3eb-faVwn8WYc8bPB0+9WpNXg9h5DhE\"",
    "mtime": "2023-08-12T15:21:30.219Z",
    "size": 1003,
    "path": "../public/_nuxt/login.5e529290.js.br"
  },
  "/_nuxt/login.5e529290.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ad-siKat5a/MLzCzCA0qFQsJBYan9U\"",
    "mtime": "2023-08-12T15:21:30.215Z",
    "size": 1197,
    "path": "../public/_nuxt/login.5e529290.js.gz"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-12T15:21:29.221Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-12T15:21:30.224Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-12T15:21:30.220Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/newsList.c931be35.js": {
    "type": "application/javascript",
    "etag": "\"e6-vUTJPQ1ENIZF0F7e3b7Pc0TxVqg\"",
    "mtime": "2023-08-12T15:21:29.220Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.c931be35.js"
  },
  "/_nuxt/orders.3c359cab.js": {
    "type": "application/javascript",
    "etag": "\"26b6-tMH+NYKjHuhEPwLRgzlSCnIq904\"",
    "mtime": "2023-08-12T15:21:29.219Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.3c359cab.js"
  },
  "/_nuxt/orders.3c359cab.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bd2-/uvvZHxZMti+CRaypALP2b0JaUg\"",
    "mtime": "2023-08-12T15:21:30.236Z",
    "size": 3026,
    "path": "../public/_nuxt/orders.3c359cab.js.br"
  },
  "/_nuxt/orders.3c359cab.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd5-wkyk5ezE15hj4qejIIpscTRzvjI\"",
    "mtime": "2023-08-12T15:21:30.225Z",
    "size": 3541,
    "path": "../public/_nuxt/orders.3c359cab.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-12T15:21:29.218Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-12T15:21:30.252Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-12T15:21:30.237Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-12T15:21:29.217Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-12T15:21:30.288Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-12T15:21:30.253Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.7221e0c1.js": {
    "type": "application/javascript",
    "etag": "\"168b-82uvbMy1QspsH3TsozIv0Y3O93s\"",
    "mtime": "2023-08-12T15:21:29.216Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.7221e0c1.js"
  },
  "/_nuxt/profile.7221e0c1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83d-3qKUwaMH8hSqwM7P5G1Z3c6cGd4\"",
    "mtime": "2023-08-12T15:21:30.296Z",
    "size": 2109,
    "path": "../public/_nuxt/profile.7221e0c1.js.br"
  },
  "/_nuxt/profile.7221e0c1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a0-A6gG3ZMsuW8lqN0RjAQFSwxQJuQ\"",
    "mtime": "2023-08-12T15:21:30.289Z",
    "size": 2464,
    "path": "../public/_nuxt/profile.7221e0c1.js.gz"
  },
  "/_nuxt/register.157dbff5.js": {
    "type": "application/javascript",
    "etag": "\"11b8-4TDoK/l29whacFSJZel4SqAL7s0\"",
    "mtime": "2023-08-12T15:21:29.215Z",
    "size": 4536,
    "path": "../public/_nuxt/register.157dbff5.js"
  },
  "/_nuxt/register.157dbff5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5c0-1KBBvOYo/7BAuwu20Djld/trQmc\"",
    "mtime": "2023-08-12T15:21:30.303Z",
    "size": 1472,
    "path": "../public/_nuxt/register.157dbff5.js.br"
  },
  "/_nuxt/register.157dbff5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fb-13FWM4J5M9fqXpWM5v9pchkyQWo\"",
    "mtime": "2023-08-12T15:21:30.297Z",
    "size": 1787,
    "path": "../public/_nuxt/register.157dbff5.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-12T15:21:29.214Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-12T15:21:30.308Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-12T15:21:30.303Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-12T15:21:29.214Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-12T15:21:30.311Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-12T15:21:30.308Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-12T15:21:29.213Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-12T15:21:29.209Z",
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
