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
    "mtime": "2023-08-13T16:53:47.453Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-13T16:53:47.430Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-13T16:53:47.429Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-13T16:53:47.428Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-13T16:53:47.410Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-13T16:53:47.409Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-13T16:53:47.408Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T16:53:47.408Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T16:53:48.616Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T16:53:48.613Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-13T16:53:47.406Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-13T16:53:47.405Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.cbb8fd6a.js": {
    "type": "application/javascript",
    "etag": "\"9a2-9jDAWVlYIJK1rRsTbgBLyDKklE8\"",
    "mtime": "2023-08-13T16:53:47.404Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.cbb8fd6a.js"
  },
  "/_nuxt/BasketInfo.cbb8fd6a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ee-zsp29XcDfVzatuy1Z/8ZZ8LvYq8\"",
    "mtime": "2023-08-13T16:53:47.468Z",
    "size": 1006,
    "path": "../public/_nuxt/BasketInfo.cbb8fd6a.js.br"
  },
  "/_nuxt/BasketInfo.cbb8fd6a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-JLuNw2uqCT1plGT7hJ2M5cZQEg8\"",
    "mtime": "2023-08-13T16:53:47.457Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.cbb8fd6a.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-13T16:53:47.404Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-13T16:53:47.494Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-13T16:53:47.469Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.354d4ed1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-30neIH37iQNJwXztFvCmbpQh5Ck\"",
    "mtime": "2023-08-13T16:53:47.403Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.354d4ed1.css"
  },
  "/_nuxt/CatalogProduct.354d4ed1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75b-InywLXXh6cjRurMHKLa8YdLK9GE\"",
    "mtime": "2023-08-13T16:53:47.507Z",
    "size": 1883,
    "path": "../public/_nuxt/CatalogProduct.354d4ed1.css.br"
  },
  "/_nuxt/CatalogProduct.354d4ed1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89b-DzsmUe35r1qxqhNujCp7LfIuVbA\"",
    "mtime": "2023-08-13T16:53:47.495Z",
    "size": 2203,
    "path": "../public/_nuxt/CatalogProduct.354d4ed1.css.gz"
  },
  "/_nuxt/CatalogProduct.90baaf95.js": {
    "type": "application/javascript",
    "etag": "\"1240-S2F9Lznn3mMY+oFUGN8uJg/8368\"",
    "mtime": "2023-08-13T16:53:47.403Z",
    "size": 4672,
    "path": "../public/_nuxt/CatalogProduct.90baaf95.js"
  },
  "/_nuxt/CatalogProduct.90baaf95.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"692-sEvhHbgmWaIFmbbK0AcX/1j6400\"",
    "mtime": "2023-08-13T16:53:47.514Z",
    "size": 1682,
    "path": "../public/_nuxt/CatalogProduct.90baaf95.js.br"
  },
  "/_nuxt/CatalogProduct.90baaf95.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"784-8+6GsNmj3caWDVVomJVfePCTV6U\"",
    "mtime": "2023-08-13T16:53:47.508Z",
    "size": 1924,
    "path": "../public/_nuxt/CatalogProduct.90baaf95.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-13T16:53:47.402Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-13T16:53:47.532Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-13T16:53:47.515Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-13T16:53:47.402Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-13T16:53:47.538Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-13T16:53:47.533Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.b0db9533.js": {
    "type": "application/javascript",
    "etag": "\"783-udxdvpZNoNB5okWSlwarYPjl9uU\"",
    "mtime": "2023-08-13T16:53:47.401Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.b0db9533.js"
  },
  "/_nuxt/FavoriteComp.b0db9533.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28e-zcngM7Pr1qUm1Dyk4uiBgoOoJu4\"",
    "mtime": "2023-08-13T16:53:47.542Z",
    "size": 654,
    "path": "../public/_nuxt/FavoriteComp.b0db9533.js.br"
  },
  "/_nuxt/FavoriteComp.b0db9533.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-A5cPtwlHusV5cEO+yQS10pxJkm8\"",
    "mtime": "2023-08-13T16:53:47.539Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.b0db9533.js.gz"
  },
  "/_nuxt/FavoriteComp.f770f573.js": {
    "type": "application/javascript",
    "etag": "\"e2e-I0ZF2mhGF1MRqo37avJURcn6+Ns\"",
    "mtime": "2023-08-13T16:53:47.400Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.f770f573.js"
  },
  "/_nuxt/FavoriteComp.f770f573.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-Q2husm83pybQMIdKmsMXcmNHzwg\"",
    "mtime": "2023-08-13T16:53:47.548Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.f770f573.js.br"
  },
  "/_nuxt/FavoriteComp.f770f573.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-N2bc4quD6LovnNXHfLL8GLK6XH0\"",
    "mtime": "2023-08-13T16:53:47.543Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.f770f573.js.gz"
  },
  "/_nuxt/ImageForm.6c42ee30.js": {
    "type": "application/javascript",
    "etag": "\"1ac-kNIRFciOOZd8sHaFb6l/k6ExPKo\"",
    "mtime": "2023-08-13T16:53:47.399Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.6c42ee30.js"
  },
  "/_nuxt/LoadingComp.02f5b8e0.js": {
    "type": "application/javascript",
    "etag": "\"1fe-08Y19E8MkrakCt1g7+lonWoa5z4\"",
    "mtime": "2023-08-13T16:53:47.399Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.02f5b8e0.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-13T16:53:47.398Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-13T16:53:47.398Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-13T16:53:47.552Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-13T16:53:47.550Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.cb26129a.js": {
    "type": "application/javascript",
    "etag": "\"461-eH6BAI9oICLkXSFPeLIO3BI1PvY\"",
    "mtime": "2023-08-13T16:53:47.397Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.cb26129a.js"
  },
  "/_nuxt/OrderProductList.cb26129a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"214-Lzm/XieHBVMgXqhBSfc+ZjYCUDs\"",
    "mtime": "2023-08-13T16:53:47.555Z",
    "size": 532,
    "path": "../public/_nuxt/OrderProductList.cb26129a.js.br"
  },
  "/_nuxt/OrderProductList.cb26129a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-AiTVqKw0LXkd6G3j1Ig+byBRL7M\"",
    "mtime": "2023-08-13T16:53:47.553Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.cb26129a.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-13T16:53:47.397Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-13T16:53:47.574Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-13T16:53:47.556Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/UserBasket.9f712e8b.js": {
    "type": "application/javascript",
    "etag": "\"1312-s8hZtWTr7HuPgLUC2dLBUPEDJ1c\"",
    "mtime": "2023-08-13T16:53:47.396Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.9f712e8b.js"
  },
  "/_nuxt/UserBasket.9f712e8b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"73a-66fVoT3ScdBNHi0PnAdNjeazcuQ\"",
    "mtime": "2023-08-13T16:53:47.583Z",
    "size": 1850,
    "path": "../public/_nuxt/UserBasket.9f712e8b.js.br"
  },
  "/_nuxt/UserBasket.9f712e8b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"840-Hctwl+tpAn/A60cmZTI0wDdJ3YY\"",
    "mtime": "2023-08-13T16:53:47.576Z",
    "size": 2112,
    "path": "../public/_nuxt/UserBasket.9f712e8b.js.gz"
  },
  "/_nuxt/_id_.0468b3ef.js": {
    "type": "application/javascript",
    "etag": "\"12e4-dX4WxDvQ1wyUDHiQkPajvC+4jXw\"",
    "mtime": "2023-08-13T16:53:47.395Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.0468b3ef.js"
  },
  "/_nuxt/_id_.0468b3ef.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"762-VoFfAMhQbhIV+xisRjxZPDfyzvI\"",
    "mtime": "2023-08-13T16:53:47.591Z",
    "size": 1890,
    "path": "../public/_nuxt/_id_.0468b3ef.js.br"
  },
  "/_nuxt/_id_.0468b3ef.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85e-QuFMpLjf3iukQS/s/+oKH0j7buc\"",
    "mtime": "2023-08-13T16:53:47.584Z",
    "size": 2142,
    "path": "../public/_nuxt/_id_.0468b3ef.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-13T16:53:47.395Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-13T16:53:47.606Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-13T16:53:47.592Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-13T16:53:47.394Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.dea542ad.js": {
    "type": "application/javascript",
    "etag": "\"531-Pas0cU0FhTh4CMthBJtnTdSLjVE\"",
    "mtime": "2023-08-13T16:53:47.394Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.dea542ad.js"
  },
  "/_nuxt/_id_.dea542ad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a1-EhCNb4qO0AhREtv9gIL5ovg0byg\"",
    "mtime": "2023-08-13T16:53:47.611Z",
    "size": 673,
    "path": "../public/_nuxt/_id_.dea542ad.js.br"
  },
  "/_nuxt/_id_.dea542ad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32c-8cZKcdZVbLUy9S5WOzIV0cgyLwg\"",
    "mtime": "2023-08-13T16:53:47.608Z",
    "size": 812,
    "path": "../public/_nuxt/_id_.dea542ad.js.gz"
  },
  "/_nuxt/basket.02739802.js": {
    "type": "application/javascript",
    "etag": "\"294-35kUJIrIlnkxpqXsXxTXJUkyMGM\"",
    "mtime": "2023-08-13T16:53:47.393Z",
    "size": 660,
    "path": "../public/_nuxt/basket.02739802.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-13T16:53:47.392Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-13T16:53:47.618Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-13T16:53:47.612Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.43b3d568.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-XfFGO5r997p3ti1/F1xHll1fOu8\"",
    "mtime": "2023-08-13T16:53:47.391Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.43b3d568.js"
  },
  "/_nuxt/catalog.43b3d568.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-/S/pgPINzvw/3MSw7lsKuxgsFxE\"",
    "mtime": "2023-08-13T16:53:47.628Z",
    "size": 2339,
    "path": "../public/_nuxt/catalog.43b3d568.js.br"
  },
  "/_nuxt/catalog.43b3d568.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-PxA2YJAex+32qReR+itO9Achb3U\"",
    "mtime": "2023-08-13T16:53:47.619Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.43b3d568.js.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-13T16:53:47.391Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-13T16:53:47.637Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-13T16:53:47.629Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/checkout.4ed3fc46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-GOWuDZae6dOEV28Lx9OlVBEEnMw\"",
    "mtime": "2023-08-13T16:53:47.390Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.4ed3fc46.css"
  },
  "/_nuxt/checkout.4ed3fc46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f9b-rCT9jJSWl2hck0Y9Mht0IY9WEe8\"",
    "mtime": "2023-08-13T16:53:47.768Z",
    "size": 20379,
    "path": "../public/_nuxt/checkout.4ed3fc46.css.br"
  },
  "/_nuxt/checkout.4ed3fc46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-X0I+QwoFjCJA3NtM/RxlrQOda0c\"",
    "mtime": "2023-08-13T16:53:47.640Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.4ed3fc46.css.gz"
  },
  "/_nuxt/checkout.74ea562d.js": {
    "type": "application/javascript",
    "etag": "\"14f0a-opw8UsYoJif7Jmt/nhEt90NaBZ4\"",
    "mtime": "2023-08-13T16:53:47.389Z",
    "size": 85770,
    "path": "../public/_nuxt/checkout.74ea562d.js"
  },
  "/_nuxt/checkout.74ea562d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"52aa-fRxaeX6pOtlXKTWIjp+3TS/UNG4\"",
    "mtime": "2023-08-13T16:53:47.873Z",
    "size": 21162,
    "path": "../public/_nuxt/checkout.74ea562d.js.br"
  },
  "/_nuxt/checkout.74ea562d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fd5-oxvmFIbQXEulLoq49SlHgr8eY7U\"",
    "mtime": "2023-08-13T16:53:47.771Z",
    "size": 24533,
    "path": "../public/_nuxt/checkout.74ea562d.js.gz"
  },
  "/_nuxt/entry.01da06b1.js": {
    "type": "application/javascript",
    "etag": "\"36253-O9lz0pjONU4/SGfiFzhQcgSoyy8\"",
    "mtime": "2023-08-13T16:53:47.388Z",
    "size": 221779,
    "path": "../public/_nuxt/entry.01da06b1.js"
  },
  "/_nuxt/entry.01da06b1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120fb-DpIUvQQpKo4nk6H7o4C+DWieCsc\"",
    "mtime": "2023-08-13T16:53:48.265Z",
    "size": 73979,
    "path": "../public/_nuxt/entry.01da06b1.js.br"
  },
  "/_nuxt/entry.01da06b1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14524-rrN7m2xi1d2nsbEffGBFPBdrAEs\"",
    "mtime": "2023-08-13T16:53:47.883Z",
    "size": 83236,
    "path": "../public/_nuxt/entry.01da06b1.js.gz"
  },
  "/_nuxt/entry.840a2dc3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-Pdiufxn2HqA2ConoJMZOdqvXEWk\"",
    "mtime": "2023-08-13T16:53:47.386Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.840a2dc3.css"
  },
  "/_nuxt/entry.840a2dc3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"945-EFFnPjjx2ofrhwfH0lEq8l53LS4\"",
    "mtime": "2023-08-13T16:53:48.276Z",
    "size": 2373,
    "path": "../public/_nuxt/entry.840a2dc3.css.br"
  },
  "/_nuxt/entry.840a2dc3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-p10GXhVZcs31XafoKUo7BHUQKB4\"",
    "mtime": "2023-08-13T16:53:48.266Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.840a2dc3.css.gz"
  },
  "/_nuxt/error-404.0739b6a7.js": {
    "type": "application/javascript",
    "etag": "\"8a8-cvYLtjE0+lJrmr1OfJTF9PU2vf0\"",
    "mtime": "2023-08-13T16:53:47.385Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.0739b6a7.js"
  },
  "/_nuxt/error-404.0739b6a7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-NMB6whwHrdOoAKRPsPsPY1pvdDg\"",
    "mtime": "2023-08-13T16:53:48.282Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.0739b6a7.js.br"
  },
  "/_nuxt/error-404.0739b6a7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-KpvC2H83kU0YEEqGuGeUXGqTNrI\"",
    "mtime": "2023-08-13T16:53:48.277Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.0739b6a7.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-13T16:53:47.384Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-13T16:53:48.289Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-13T16:53:48.284Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-13T16:53:47.384Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-13T16:53:48.293Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-13T16:53:48.290Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.b163ccf8.js": {
    "type": "application/javascript",
    "etag": "\"756-1EiDmyITjzZnBpTcLhJE3t53JvA\"",
    "mtime": "2023-08-13T16:53:47.383Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.b163ccf8.js"
  },
  "/_nuxt/error-500.b163ccf8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-YweOfj4tkW1fB9bQA3RpwoFMYJI\"",
    "mtime": "2023-08-13T16:53:48.297Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.b163ccf8.js.br"
  },
  "/_nuxt/error-500.b163ccf8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-A8rgN1rfGbZO5stncPm+f0w5hJM\"",
    "mtime": "2023-08-13T16:53:48.294Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.b163ccf8.js.gz"
  },
  "/_nuxt/error-component.719d82f8.js": {
    "type": "application/javascript",
    "etag": "\"45e-Eg5AU+0nEte/B+HcwRvIWmqK0Mw\"",
    "mtime": "2023-08-13T16:53:47.383Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.719d82f8.js"
  },
  "/_nuxt/error-component.719d82f8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-fc22PkevNsiG3WR70M+OZycJ9Tk\"",
    "mtime": "2023-08-13T16:53:48.300Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.719d82f8.js.br"
  },
  "/_nuxt/error-component.719d82f8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-MIV6vDTYlqhRvboyyefJGHXGUFI\"",
    "mtime": "2023-08-13T16:53:48.298Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.719d82f8.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-13T16:53:47.382Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-13T16:53:48.308Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-13T16:53:48.301Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.d55af51c.js": {
    "type": "application/javascript",
    "etag": "\"a3a-HOAKhuA9HpMswRHPUK8vWFD2Gto\"",
    "mtime": "2023-08-13T16:53:47.381Z",
    "size": 2618,
    "path": "../public/_nuxt/favorite.d55af51c.js"
  },
  "/_nuxt/favorite.d55af51c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"454-0UyDKKSwFxib+Lr9hwh1hK0iN94\"",
    "mtime": "2023-08-13T16:53:48.313Z",
    "size": 1108,
    "path": "../public/_nuxt/favorite.d55af51c.js.br"
  },
  "/_nuxt/favorite.d55af51c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50d-ibuEsfeX9+3eTJlbJY6cmJU9yc4\"",
    "mtime": "2023-08-13T16:53:48.309Z",
    "size": 1293,
    "path": "../public/_nuxt/favorite.d55af51c.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-13T16:53:47.381Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-13T16:53:47.380Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-13T16:53:47.379Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-13T16:53:48.318Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-13T16:53:48.314Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.1b41d821.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5190-8+NpnPa0WfeNSXP/9Ry7/YVlEmc\"",
    "mtime": "2023-08-13T16:53:47.378Z",
    "size": 20880,
    "path": "../public/_nuxt/index.1b41d821.css"
  },
  "/_nuxt/index.1b41d821.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12bd-uCtI52sl26DLUo1LjI03RW6NSI8\"",
    "mtime": "2023-08-13T16:53:48.340Z",
    "size": 4797,
    "path": "../public/_nuxt/index.1b41d821.css.br"
  },
  "/_nuxt/index.1b41d821.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"156a-chRSk+s6mWC2+P/o8gKGV+JDIKg\"",
    "mtime": "2023-08-13T16:53:48.319Z",
    "size": 5482,
    "path": "../public/_nuxt/index.1b41d821.css.gz"
  },
  "/_nuxt/index.3c021797.js": {
    "type": "application/javascript",
    "etag": "\"3aba-aq7pMWhjrREOBlK5LEdZWjtAYhs\"",
    "mtime": "2023-08-13T16:53:47.378Z",
    "size": 15034,
    "path": "../public/_nuxt/index.3c021797.js"
  },
  "/_nuxt/index.3c021797.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f7-V57S9Ei3X780IX3dSYoMDLU8CXc\"",
    "mtime": "2023-08-13T16:53:48.367Z",
    "size": 4855,
    "path": "../public/_nuxt/index.3c021797.js.br"
  },
  "/_nuxt/index.3c021797.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14ef-Def6vS53GTxkxm//e/eK/7Ldzzs\"",
    "mtime": "2023-08-13T16:53:48.342Z",
    "size": 5359,
    "path": "../public/_nuxt/index.3c021797.js.gz"
  },
  "/_nuxt/index.9e918fc4.js": {
    "type": "application/javascript",
    "etag": "\"1705d-gVqhIdyiWP6hWs7bW/rgb/oweHw\"",
    "mtime": "2023-08-13T16:53:47.377Z",
    "size": 94301,
    "path": "../public/_nuxt/index.9e918fc4.js"
  },
  "/_nuxt/index.9e918fc4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6562-xIEqOdrCGWO28Q8tVIamzan1oKY\"",
    "mtime": "2023-08-13T16:53:48.510Z",
    "size": 25954,
    "path": "../public/_nuxt/index.9e918fc4.js.br"
  },
  "/_nuxt/index.9e918fc4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"730b-iC5RVqMLJTjF1x2WE0Jkx9ohC3Y\"",
    "mtime": "2023-08-13T16:53:48.370Z",
    "size": 29451,
    "path": "../public/_nuxt/index.9e918fc4.js.gz"
  },
  "/_nuxt/index.fa83e564.js": {
    "type": "application/javascript",
    "etag": "\"64e-dbEosjx/DY8vYsN9IsWDI5oAUyI\"",
    "mtime": "2023-08-13T16:53:47.376Z",
    "size": 1614,
    "path": "../public/_nuxt/index.fa83e564.js"
  },
  "/_nuxt/index.fa83e564.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"326-QCTNyZeTx5BS+pHuB43VkecWVEQ\"",
    "mtime": "2023-08-13T16:53:48.514Z",
    "size": 806,
    "path": "../public/_nuxt/index.fa83e564.js.br"
  },
  "/_nuxt/index.fa83e564.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-TCyerSLXJKSCYXXGqfKU94oz0Tk\"",
    "mtime": "2023-08-13T16:53:48.511Z",
    "size": 955,
    "path": "../public/_nuxt/index.fa83e564.js.gz"
  },
  "/_nuxt/isAuth.6cec6ecc.js": {
    "type": "application/javascript",
    "etag": "\"23f-1lmg9PGDL3iPvcEFxDn1fHUodx4\"",
    "mtime": "2023-08-13T16:53:47.375Z",
    "size": 575,
    "path": "../public/_nuxt/isAuth.6cec6ecc.js"
  },
  "/_nuxt/login.4dc79b2f.js": {
    "type": "application/javascript",
    "etag": "\"80a-rXYwqBg2WHd2AV9KLbreIIwvGgQ\"",
    "mtime": "2023-08-13T16:53:47.373Z",
    "size": 2058,
    "path": "../public/_nuxt/login.4dc79b2f.js"
  },
  "/_nuxt/login.4dc79b2f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ea-fzPjgT0/CALu4dkDRQQIXDGavD4\"",
    "mtime": "2023-08-13T16:53:48.519Z",
    "size": 1002,
    "path": "../public/_nuxt/login.4dc79b2f.js.br"
  },
  "/_nuxt/login.4dc79b2f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ab-hOiY8OwZ4aSOvXAvvYVstgDmaQw\"",
    "mtime": "2023-08-13T16:53:48.515Z",
    "size": 1195,
    "path": "../public/_nuxt/login.4dc79b2f.js.gz"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-13T16:53:47.372Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-13T16:53:48.524Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-13T16:53:48.520Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/newsList.dd012348.js": {
    "type": "application/javascript",
    "etag": "\"e6-H9ZVSjRYWo4XOO8aBW00bt3507U\"",
    "mtime": "2023-08-13T16:53:47.372Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.dd012348.js"
  },
  "/_nuxt/orders.217a9d78.js": {
    "type": "application/javascript",
    "etag": "\"26b6-Tm0uWtGFWmno0u0nrsIjxb/wZH0\"",
    "mtime": "2023-08-13T16:53:47.371Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.217a9d78.js"
  },
  "/_nuxt/orders.217a9d78.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc7-D7OKVdbptJoaCDLRf8lkbCb5BcA\"",
    "mtime": "2023-08-13T16:53:48.537Z",
    "size": 3015,
    "path": "../public/_nuxt/orders.217a9d78.js.br"
  },
  "/_nuxt/orders.217a9d78.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-Tm7xDkhki4h1mPdfZXcqQu4xD40\"",
    "mtime": "2023-08-13T16:53:48.525Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.217a9d78.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-13T16:53:47.370Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-13T16:53:48.549Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-13T16:53:48.538Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-13T16:53:47.369Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-13T16:53:48.587Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-13T16:53:48.550Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.95fee269.js": {
    "type": "application/javascript",
    "etag": "\"169d-AGpv89Jussxrj8kj+QPOU2iJ/Wo\"",
    "mtime": "2023-08-13T16:53:47.368Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.95fee269.js"
  },
  "/_nuxt/profile.95fee269.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"846-87IV+vuRe16ziJ7TEZL7V5a4Uqo\"",
    "mtime": "2023-08-13T16:53:48.595Z",
    "size": 2118,
    "path": "../public/_nuxt/profile.95fee269.js.br"
  },
  "/_nuxt/profile.95fee269.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-D5QGPDosI8LWOd8ezUEM944A650\"",
    "mtime": "2023-08-13T16:53:48.588Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.95fee269.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-13T16:53:47.367Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-13T16:53:48.599Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-13T16:53:48.596Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.dbc64bdf.js": {
    "type": "application/javascript",
    "etag": "\"11b8-0t7fmkD5qEqceKhupRldZTJIR+E\"",
    "mtime": "2023-08-13T16:53:47.366Z",
    "size": 4536,
    "path": "../public/_nuxt/register.dbc64bdf.js"
  },
  "/_nuxt/register.dbc64bdf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bd-Cg/wQzdhoJItOOdHsIfaw59tB04\"",
    "mtime": "2023-08-13T16:53:48.606Z",
    "size": 1469,
    "path": "../public/_nuxt/register.dbc64bdf.js.br"
  },
  "/_nuxt/register.dbc64bdf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fa-AkxDY+734un1TTk2lxxC/HZmI3A\"",
    "mtime": "2023-08-13T16:53:48.600Z",
    "size": 1786,
    "path": "../public/_nuxt/register.dbc64bdf.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T16:53:47.365Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T16:53:48.610Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T16:53:48.607Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-13T16:53:47.364Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-13T16:53:47.360Z",
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
