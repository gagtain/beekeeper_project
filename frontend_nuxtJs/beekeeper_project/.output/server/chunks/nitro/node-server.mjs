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
    "mtime": "2023-08-14T14:08:00.250Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-14T14:08:00.247Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-14T14:08:00.246Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-08-14T14:08:00.244Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-14T14:08:00.243Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-14T14:08:00.243Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T14:08:00.242Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T14:08:01.315Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T14:08:01.313Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-14T14:08:00.240Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-14T14:08:00.238Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.69d1ed96.js": {
    "type": "application/javascript",
    "etag": "\"9a2-7bflmaGcjDq1bLT+04eyjKzJrB8\"",
    "mtime": "2023-08-14T14:08:00.238Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.69d1ed96.js"
  },
  "/_nuxt/BasketInfo.69d1ed96.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ec-JDfMm9Z5qVpwSwBUywtr1kuMIXo\"",
    "mtime": "2023-08-14T14:08:00.265Z",
    "size": 1004,
    "path": "../public/_nuxt/BasketInfo.69d1ed96.js.br"
  },
  "/_nuxt/BasketInfo.69d1ed96.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-+jMebOqtCaAYUi5+8YFKmcI4TyA\"",
    "mtime": "2023-08-14T14:08:00.259Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.69d1ed96.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-14T14:08:00.237Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-14T14:08:00.301Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-14T14:08:00.266Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.17dc765b.js": {
    "type": "application/javascript",
    "etag": "\"1252-3F6H7uu7i6/T/LjVH2iO/W9nrsg\"",
    "mtime": "2023-08-14T14:08:00.236Z",
    "size": 4690,
    "path": "../public/_nuxt/CatalogProduct.17dc765b.js"
  },
  "/_nuxt/CatalogProduct.17dc765b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"692-AbA/zeHHx69JU0uDMgOAVXrGO7Q\"",
    "mtime": "2023-08-14T14:08:00.308Z",
    "size": 1682,
    "path": "../public/_nuxt/CatalogProduct.17dc765b.js.br"
  },
  "/_nuxt/CatalogProduct.17dc765b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"784-CnVfDdGbYIezJ7QeLJe5cojGR+Q\"",
    "mtime": "2023-08-14T14:08:00.302Z",
    "size": 1924,
    "path": "../public/_nuxt/CatalogProduct.17dc765b.js.gz"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-5HyqgsFvXql/I+ZV2NiXHtXNQoI\"",
    "mtime": "2023-08-14T14:08:00.235Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"756-G6kVT5X+5sFBHk7jmahU1WvKbis\"",
    "mtime": "2023-08-14T14:08:00.321Z",
    "size": 1878,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.br"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89c-b1CPUu+Xjc5NIuwbNcKb0vdnU5w\"",
    "mtime": "2023-08-14T14:08:00.309Z",
    "size": 2204,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.gz"
  },
  "/_nuxt/FavoriteComp.18571f22.js": {
    "type": "application/javascript",
    "etag": "\"e2e-RX1+uXKg5+VrEgvyQsj4wI+L/20\"",
    "mtime": "2023-08-14T14:08:00.234Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.18571f22.js"
  },
  "/_nuxt/FavoriteComp.18571f22.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-ncRsMm2qTx6HIFMgdPFVGqfGzB0\"",
    "mtime": "2023-08-14T14:08:00.326Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.18571f22.js.br"
  },
  "/_nuxt/FavoriteComp.18571f22.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-Z2tZKuUVQr54pOeuuejKT9kxSus\"",
    "mtime": "2023-08-14T14:08:00.321Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.18571f22.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-14T14:08:00.233Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-14T14:08:00.343Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-14T14:08:00.327Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8643983d.js": {
    "type": "application/javascript",
    "etag": "\"783-cgfpsIOdjPh5JQVN5E/UvfRPhQw\"",
    "mtime": "2023-08-14T14:08:00.232Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.8643983d.js"
  },
  "/_nuxt/FavoriteComp.8643983d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28d-3eGgJeSphc2/3QlBQdeDIwBwoco\"",
    "mtime": "2023-08-14T14:08:00.347Z",
    "size": 653,
    "path": "../public/_nuxt/FavoriteComp.8643983d.js.br"
  },
  "/_nuxt/FavoriteComp.8643983d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-664nDdJao/84MFeSGKkNpTIpmC0\"",
    "mtime": "2023-08-14T14:08:00.344Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.8643983d.js.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-14T14:08:00.232Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-14T14:08:00.352Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-14T14:08:00.347Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/ImageForm.7305f379.js": {
    "type": "application/javascript",
    "etag": "\"1ac-cv+mgrTMR+MyXpuI9L60zluFsX4\"",
    "mtime": "2023-08-14T14:08:00.231Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.7305f379.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-14T14:08:00.230Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.cfe80c35.js": {
    "type": "application/javascript",
    "etag": "\"1fe-9JdpYvXusmiIeNlgBDyVGq8ZDqw\"",
    "mtime": "2023-08-14T14:08:00.230Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.cfe80c35.js"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-14T14:08:00.228Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-14T14:08:00.355Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-14T14:08:00.353Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.b21fbc4e.js": {
    "type": "application/javascript",
    "etag": "\"461-c9ed47UyyRbmjDDPH/bKF2SmewE\"",
    "mtime": "2023-08-14T14:08:00.227Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.b21fbc4e.js"
  },
  "/_nuxt/OrderProductList.b21fbc4e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"213-m5vUVjF55gs67HV5Qj1XRKl6SRg\"",
    "mtime": "2023-08-14T14:08:00.358Z",
    "size": 531,
    "path": "../public/_nuxt/OrderProductList.b21fbc4e.js.br"
  },
  "/_nuxt/OrderProductList.b21fbc4e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-5daxdbqE5FBG6giX5xhlZhmNB5I\"",
    "mtime": "2023-08-14T14:08:00.356Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.b21fbc4e.js.gz"
  },
  "/_nuxt/UserBasket.35f10eb8.js": {
    "type": "application/javascript",
    "etag": "\"1312-uMZ02Rh5hD5lyvZQpXvciQyN1s0\"",
    "mtime": "2023-08-14T14:08:00.227Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.35f10eb8.js"
  },
  "/_nuxt/UserBasket.35f10eb8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"731-drcL+vQV8eVZYH8liH5SJGt6cdo\"",
    "mtime": "2023-08-14T14:08:00.365Z",
    "size": 1841,
    "path": "../public/_nuxt/UserBasket.35f10eb8.js.br"
  },
  "/_nuxt/UserBasket.35f10eb8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"841-KGQrmwtsJW6dOk4OkZwDDV3i3HI\"",
    "mtime": "2023-08-14T14:08:00.359Z",
    "size": 2113,
    "path": "../public/_nuxt/UserBasket.35f10eb8.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-14T14:08:00.226Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-14T14:08:00.382Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-14T14:08:00.366Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/_id_.152f3f1e.js": {
    "type": "application/javascript",
    "etag": "\"531-awA+xGIliyrotDioVsuTORwosU8\"",
    "mtime": "2023-08-14T14:08:00.225Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.152f3f1e.js"
  },
  "/_nuxt/_id_.152f3f1e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a2-G2JhrbdgWQWGo6vnzD2MoTjuUiA\"",
    "mtime": "2023-08-14T14:08:00.386Z",
    "size": 674,
    "path": "../public/_nuxt/_id_.152f3f1e.js.br"
  },
  "/_nuxt/_id_.152f3f1e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32c-/dwg0BSVKSw+dGfaOyGSBWsrITM\"",
    "mtime": "2023-08-14T14:08:00.383Z",
    "size": 812,
    "path": "../public/_nuxt/_id_.152f3f1e.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-14T14:08:00.224Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-14T14:08:00.401Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-14T14:08:00.386Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-14T14:08:00.223Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.cc078cbc.js": {
    "type": "application/javascript",
    "etag": "\"12e4-p3XdEWbmSJkCBV0KSbvVrwPLJi0\"",
    "mtime": "2023-08-14T14:08:00.222Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.cc078cbc.js"
  },
  "/_nuxt/_id_.cc078cbc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75d-zwtyrKGyjyjUA/jDIV1z5Bccupo\"",
    "mtime": "2023-08-14T14:08:00.407Z",
    "size": 1885,
    "path": "../public/_nuxt/_id_.cc078cbc.js.br"
  },
  "/_nuxt/_id_.cc078cbc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85e-IC4KDXzd8COqy3VDh5Z/PmFZj1I\"",
    "mtime": "2023-08-14T14:08:00.402Z",
    "size": 2142,
    "path": "../public/_nuxt/_id_.cc078cbc.js.gz"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-14T14:08:00.221Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-14T14:08:00.415Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-14T14:08:00.408Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.a50b4429.js": {
    "type": "application/javascript",
    "etag": "\"294-yKJvhZllKVenDOkkuNUmSSgf+zo\"",
    "mtime": "2023-08-14T14:08:00.219Z",
    "size": 660,
    "path": "../public/_nuxt/basket.a50b4429.js"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-14T14:08:00.218Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-14T14:08:00.424Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-14T14:08:00.416Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/catalog.a0c33484.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-75vj5zzcMMfRiJpoZ5R85YO101Q\"",
    "mtime": "2023-08-14T14:08:00.218Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.a0c33484.js"
  },
  "/_nuxt/catalog.a0c33484.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-q2ZX7Rea0AVwIDz3YEgrAjExXnI\"",
    "mtime": "2023-08-14T14:08:00.432Z",
    "size": 2339,
    "path": "../public/_nuxt/catalog.a0c33484.js.br"
  },
  "/_nuxt/catalog.a0c33484.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a98-b/vSILc+ljYfgOx6+mfb1h2RXRo\"",
    "mtime": "2023-08-14T14:08:00.425Z",
    "size": 2712,
    "path": "../public/_nuxt/catalog.a0c33484.js.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-14T14:08:00.217Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-14T14:08:00.542Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-14T14:08:00.435Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/checkout.ff472db1.js": {
    "type": "application/javascript",
    "etag": "\"14efc-XE3UjhWErhu7HNschlF83RZic5M\"",
    "mtime": "2023-08-14T14:08:00.214Z",
    "size": 85756,
    "path": "../public/_nuxt/checkout.ff472db1.js"
  },
  "/_nuxt/checkout.ff472db1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5285-EiSucbjnOHsPkXlA9KbVzPhehQk\"",
    "mtime": "2023-08-14T14:08:00.642Z",
    "size": 21125,
    "path": "../public/_nuxt/checkout.ff472db1.js.br"
  },
  "/_nuxt/checkout.ff472db1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcd-N31Lrwng6XTfSlLNfRFi2DxDhbI\"",
    "mtime": "2023-08-14T14:08:00.545Z",
    "size": 24525,
    "path": "../public/_nuxt/checkout.ff472db1.js.gz"
  },
  "/_nuxt/entry.65932d1a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"257d-IlmwIqPU6KkCJ/IW2MBAYXwW9lY\"",
    "mtime": "2023-08-14T14:08:00.213Z",
    "size": 9597,
    "path": "../public/_nuxt/entry.65932d1a.css"
  },
  "/_nuxt/entry.65932d1a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"954-h0HEnKzxnJwXURdcJ+puerv8cKI\"",
    "mtime": "2023-08-14T14:08:00.654Z",
    "size": 2388,
    "path": "../public/_nuxt/entry.65932d1a.css.br"
  },
  "/_nuxt/entry.65932d1a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac8-+XmwmkCTZb7IFYGEkCNvCgEuQJo\"",
    "mtime": "2023-08-14T14:08:00.643Z",
    "size": 2760,
    "path": "../public/_nuxt/entry.65932d1a.css.gz"
  },
  "/_nuxt/entry.d2d388c2.js": {
    "type": "application/javascript",
    "etag": "\"36254-K9txcDHkS3MVU1KsR4Egiu9S+pM\"",
    "mtime": "2023-08-14T14:08:00.212Z",
    "size": 221780,
    "path": "../public/_nuxt/entry.d2d388c2.js"
  },
  "/_nuxt/entry.d2d388c2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120f1-rji9xnCBPyqHnvDbTAz8rP7pYLc\"",
    "mtime": "2023-08-14T14:08:01.020Z",
    "size": 73969,
    "path": "../public/_nuxt/entry.d2d388c2.js.br"
  },
  "/_nuxt/entry.d2d388c2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1452b-2R16a3H3+70s8PH3dPaEHjs9AGk\"",
    "mtime": "2023-08-14T14:08:00.663Z",
    "size": 83243,
    "path": "../public/_nuxt/entry.d2d388c2.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-14T14:08:00.211Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-14T14:08:01.026Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-14T14:08:01.021Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.73ab526c.js": {
    "type": "application/javascript",
    "etag": "\"8a8-xN8sRwWz5K+jaK0uNgL8y7V5lHo\"",
    "mtime": "2023-08-14T14:08:00.211Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.73ab526c.js"
  },
  "/_nuxt/error-404.73ab526c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ca-Nju2/TcE79/dZyWKZFS4DwasgNE\"",
    "mtime": "2023-08-14T14:08:01.030Z",
    "size": 970,
    "path": "../public/_nuxt/error-404.73ab526c.js.br"
  },
  "/_nuxt/error-404.73ab526c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-5Q+D8rDDaYG69Tef8WvYdpiUz/k\"",
    "mtime": "2023-08-14T14:08:01.026Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.73ab526c.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-14T14:08:00.210Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-14T14:08:01.033Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-14T14:08:01.030Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.f36fc8ec.js": {
    "type": "application/javascript",
    "etag": "\"756-+nmoQGdlxUge1QS5axjXG5MQ0r4\"",
    "mtime": "2023-08-14T14:08:00.210Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.f36fc8ec.js"
  },
  "/_nuxt/error-500.f36fc8ec.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-q9bYh+5ievIWNs+VIfPLGWSXK7c\"",
    "mtime": "2023-08-14T14:08:01.037Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.f36fc8ec.js.br"
  },
  "/_nuxt/error-500.f36fc8ec.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-lU0fqJYP2PXzfCXeqRUJ49P+Eow\"",
    "mtime": "2023-08-14T14:08:01.034Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.f36fc8ec.js.gz"
  },
  "/_nuxt/error-component.2a480183.js": {
    "type": "application/javascript",
    "etag": "\"45e-u0ysD1Y5aPOpwJaq9BdEYEzxFUA\"",
    "mtime": "2023-08-14T14:08:00.209Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.2a480183.js"
  },
  "/_nuxt/error-component.2a480183.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-DMcXS8cDkzFDXVo5upST9rWnVXQ\"",
    "mtime": "2023-08-14T14:08:01.039Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.2a480183.js.br"
  },
  "/_nuxt/error-component.2a480183.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-Bj6S3PFbXEFuzG4uu3d6zfzerx0\"",
    "mtime": "2023-08-14T14:08:01.037Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.2a480183.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-14T14:08:00.209Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-14T14:08:01.047Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-14T14:08:01.040Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.c8ebbb98.js": {
    "type": "application/javascript",
    "etag": "\"a3a-vLfpnDLK7M5VT29l4BHmKxURoDk\"",
    "mtime": "2023-08-14T14:08:00.208Z",
    "size": 2618,
    "path": "../public/_nuxt/favorite.c8ebbb98.js"
  },
  "/_nuxt/favorite.c8ebbb98.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"456-v1gOeywRgbRQF46MauDR6lTS4+w\"",
    "mtime": "2023-08-14T14:08:01.051Z",
    "size": 1110,
    "path": "../public/_nuxt/favorite.c8ebbb98.js.br"
  },
  "/_nuxt/favorite.c8ebbb98.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50c-JjfUDJQ43HIUibgZFAM6WFFsw5w\"",
    "mtime": "2023-08-14T14:08:01.048Z",
    "size": 1292,
    "path": "../public/_nuxt/favorite.c8ebbb98.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-14T14:08:00.208Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-14T14:08:00.207Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-14T14:08:00.206Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-14T14:08:01.056Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-14T14:08:01.053Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.161b536f.js": {
    "type": "application/javascript",
    "etag": "\"17f2c-u1k7hAv/dwGD4w0VWV98aFzfRSQ\"",
    "mtime": "2023-08-14T14:08:00.206Z",
    "size": 98092,
    "path": "../public/_nuxt/index.161b536f.js"
  },
  "/_nuxt/index.161b536f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"68bb-tYJEwxuZFeuBg62MEmlOqQcQqos\"",
    "mtime": "2023-08-14T14:08:01.172Z",
    "size": 26811,
    "path": "../public/_nuxt/index.161b536f.js.br"
  },
  "/_nuxt/index.161b536f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7700-D2Wsv99v9JRnvadoaQATUBWVUsY\"",
    "mtime": "2023-08-14T14:08:01.059Z",
    "size": 30464,
    "path": "../public/_nuxt/index.161b536f.js.gz"
  },
  "/_nuxt/index.23e54b1c.js": {
    "type": "application/javascript",
    "etag": "\"64e-NfyAk/V9wCHu+a1oYvUE/9hvxV0\"",
    "mtime": "2023-08-14T14:08:00.205Z",
    "size": 1614,
    "path": "../public/_nuxt/index.23e54b1c.js"
  },
  "/_nuxt/index.23e54b1c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"326-4HQNoNLaFoTz/zxElyGxzciiw6g\"",
    "mtime": "2023-08-14T14:08:01.176Z",
    "size": 806,
    "path": "../public/_nuxt/index.23e54b1c.js.br"
  },
  "/_nuxt/index.23e54b1c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-EsN0t02/awP7KGpG+Cbnuxsf8nQ\"",
    "mtime": "2023-08-14T14:08:01.173Z",
    "size": 955,
    "path": "../public/_nuxt/index.23e54b1c.js.gz"
  },
  "/_nuxt/index.eafb3230.js": {
    "type": "application/javascript",
    "etag": "\"3aba-/h/CF8ZhV0XTP0SAkdUOhEyR208\"",
    "mtime": "2023-08-14T14:08:00.204Z",
    "size": 15034,
    "path": "../public/_nuxt/index.eafb3230.js"
  },
  "/_nuxt/index.eafb3230.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ea-BNf+9R74MIWouUdT1lRkFlawkUI\"",
    "mtime": "2023-08-14T14:08:01.193Z",
    "size": 4842,
    "path": "../public/_nuxt/index.eafb3230.js.br"
  },
  "/_nuxt/index.eafb3230.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14ef-291ZHjYswpvIXRgbNrHEr78zY6Q\"",
    "mtime": "2023-08-14T14:08:01.178Z",
    "size": 5359,
    "path": "../public/_nuxt/index.eafb3230.js.gz"
  },
  "/_nuxt/index.f334d20d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-5r+wmU66YIGf3fU/ee2CBtRLWUY\"",
    "mtime": "2023-08-14T14:08:00.203Z",
    "size": 22887,
    "path": "../public/_nuxt/index.f334d20d.css"
  },
  "/_nuxt/index.f334d20d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12df-DMFZGF7afAHIQbOfcl52uy1/IBA\"",
    "mtime": "2023-08-14T14:08:01.220Z",
    "size": 4831,
    "path": "../public/_nuxt/index.f334d20d.css.br"
  },
  "/_nuxt/index.f334d20d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-vmxBJiT9Xl1QZaV6diDAn4Nhf7s\"",
    "mtime": "2023-08-14T14:08:01.195Z",
    "size": 5713,
    "path": "../public/_nuxt/index.f334d20d.css.gz"
  },
  "/_nuxt/isAuth.6d559769.js": {
    "type": "application/javascript",
    "etag": "\"282-WI1XlJPexoTginJnXUykUOKKVAk\"",
    "mtime": "2023-08-14T14:08:00.202Z",
    "size": 642,
    "path": "../public/_nuxt/isAuth.6d559769.js"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-14T14:08:00.201Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-14T14:08:01.225Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-14T14:08:01.222Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/login.f13f6efb.js": {
    "type": "application/javascript",
    "etag": "\"80a-kSukg8cVQH0OenOOYGjiZzLbJ1Y\"",
    "mtime": "2023-08-14T14:08:00.200Z",
    "size": 2058,
    "path": "../public/_nuxt/login.f13f6efb.js"
  },
  "/_nuxt/login.f13f6efb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ec-6JjR/qibjxuKi9Riqe/6tEmgCnY\"",
    "mtime": "2023-08-14T14:08:01.229Z",
    "size": 1004,
    "path": "../public/_nuxt/login.f13f6efb.js.br"
  },
  "/_nuxt/login.f13f6efb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ae-i7Dz1dBvECj5k3Ni+RWQU/5ySGw\"",
    "mtime": "2023-08-14T14:08:01.226Z",
    "size": 1198,
    "path": "../public/_nuxt/login.f13f6efb.js.gz"
  },
  "/_nuxt/newsList.63eeb4b1.js": {
    "type": "application/javascript",
    "etag": "\"e6-g/qZhLq1rIETi1/EEgfgovo95gg\"",
    "mtime": "2023-08-14T14:08:00.199Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.63eeb4b1.js"
  },
  "/_nuxt/orders.33009621.js": {
    "type": "application/javascript",
    "etag": "\"26b6-vHZi5C0V27x13VweE44km80qmGQ\"",
    "mtime": "2023-08-14T14:08:00.198Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.33009621.js"
  },
  "/_nuxt/orders.33009621.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bca-FudMAuJbhOTmRX1JbfpG9LdAGM4\"",
    "mtime": "2023-08-14T14:08:01.242Z",
    "size": 3018,
    "path": "../public/_nuxt/orders.33009621.js.br"
  },
  "/_nuxt/orders.33009621.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd5-rp7cCkEu3zWDo9N8SP2nRf/cyyI\"",
    "mtime": "2023-08-14T14:08:01.230Z",
    "size": 3541,
    "path": "../public/_nuxt/orders.33009621.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-14T14:08:00.197Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-14T14:08:01.253Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-14T14:08:01.242Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-14T14:08:00.196Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-14T14:08:01.288Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-14T14:08:01.254Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.ecd08d2a.js": {
    "type": "application/javascript",
    "etag": "\"169d-MgXQd3jz/R3vghqe3vKxuLaMhFc\"",
    "mtime": "2023-08-14T14:08:00.195Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.ecd08d2a.js"
  },
  "/_nuxt/profile.ecd08d2a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83e-I0kEeCAm0o6O5BwCD3QNcGtH5qM\"",
    "mtime": "2023-08-14T14:08:01.296Z",
    "size": 2110,
    "path": "../public/_nuxt/profile.ecd08d2a.js.br"
  },
  "/_nuxt/profile.ecd08d2a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9aa-gSitNVErKno/s1XPQKrSbKdAYSA\"",
    "mtime": "2023-08-14T14:08:01.289Z",
    "size": 2474,
    "path": "../public/_nuxt/profile.ecd08d2a.js.gz"
  },
  "/_nuxt/register.6e5e948f.js": {
    "type": "application/javascript",
    "etag": "\"11b8-mhowP+cHl++HN+NbN6wYn8S2LYk\"",
    "mtime": "2023-08-14T14:08:00.194Z",
    "size": 4536,
    "path": "../public/_nuxt/register.6e5e948f.js"
  },
  "/_nuxt/register.6e5e948f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5be-cw/NumosDg2Ii9yXg0S9oeXbK5M\"",
    "mtime": "2023-08-14T14:08:01.303Z",
    "size": 1470,
    "path": "../public/_nuxt/register.6e5e948f.js.br"
  },
  "/_nuxt/register.6e5e948f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fa-LBAXZsiX44rUgNgv8ifi37Y+eQI\"",
    "mtime": "2023-08-14T14:08:01.297Z",
    "size": 1786,
    "path": "../public/_nuxt/register.6e5e948f.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-14T14:08:00.193Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-14T14:08:01.307Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-14T14:08:01.304Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T14:08:00.192Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T14:08:01.310Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T14:08:01.307Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-14T14:08:00.191Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-14T14:08:00.189Z",
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
