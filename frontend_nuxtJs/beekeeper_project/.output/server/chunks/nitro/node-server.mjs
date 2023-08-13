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
    "mtime": "2023-08-13T14:55:47.079Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-13T14:55:47.077Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-13T14:55:47.076Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-13T14:55:47.076Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-13T14:55:47.074Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-13T14:55:47.073Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-13T14:55:47.072Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T14:55:47.071Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T14:55:48.130Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T14:55:48.128Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-13T14:55:47.069Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-13T14:55:47.067Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.cc9b10ef.js": {
    "type": "application/javascript",
    "etag": "\"9a2-2/Uo1joMxqCs/00KA22z2FQBdBo\"",
    "mtime": "2023-08-13T14:55:47.067Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.cc9b10ef.js"
  },
  "/_nuxt/BasketInfo.cc9b10ef.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f9-1OnJNKnD1prz2yXON4ZSKVH4qb8\"",
    "mtime": "2023-08-13T14:55:47.087Z",
    "size": 1017,
    "path": "../public/_nuxt/BasketInfo.cc9b10ef.js.br"
  },
  "/_nuxt/BasketInfo.cc9b10ef.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ba-fTFUvDW4FMbt7fytiNivGH8tDu0\"",
    "mtime": "2023-08-13T14:55:47.082Z",
    "size": 1210,
    "path": "../public/_nuxt/BasketInfo.cc9b10ef.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-13T14:55:47.066Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-13T14:55:47.128Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-13T14:55:47.088Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.0b692491.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-tT8xvDEhVVhcntwCpdSzkMzQ8m8\"",
    "mtime": "2023-08-13T14:55:47.065Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css"
  },
  "/_nuxt/CatalogProduct.0b692491.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75b-v9nfct6hHYABDkJ6hCYAeKb9WVs\"",
    "mtime": "2023-08-13T14:55:47.141Z",
    "size": 1883,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.br"
  },
  "/_nuxt/CatalogProduct.0b692491.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8a0-RpksUBryp4HqHj7qs4rGN3HCBAw\"",
    "mtime": "2023-08-13T14:55:47.129Z",
    "size": 2208,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.gz"
  },
  "/_nuxt/CatalogProduct.41675772.js": {
    "type": "application/javascript",
    "etag": "\"1237-Dcb++1PLertfLlVsv3tyKNwB6zg\"",
    "mtime": "2023-08-13T14:55:47.064Z",
    "size": 4663,
    "path": "../public/_nuxt/CatalogProduct.41675772.js"
  },
  "/_nuxt/CatalogProduct.41675772.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"69a-nzsFB7HshktFi6ZLJGyNiVDzeP0\"",
    "mtime": "2023-08-13T14:55:47.151Z",
    "size": 1690,
    "path": "../public/_nuxt/CatalogProduct.41675772.js.br"
  },
  "/_nuxt/CatalogProduct.41675772.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"77e-/ZfxArcqeVXMk0QxVbhcHDhkR2s\"",
    "mtime": "2023-08-13T14:55:47.142Z",
    "size": 1918,
    "path": "../public/_nuxt/CatalogProduct.41675772.js.gz"
  },
  "/_nuxt/FavoriteComp.549bfa26.js": {
    "type": "application/javascript",
    "etag": "\"783-Sp1ZMvdQsGkAnHcQkKZ8x+WrZj8\"",
    "mtime": "2023-08-13T14:55:47.064Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.549bfa26.js"
  },
  "/_nuxt/FavoriteComp.549bfa26.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-5IOQMB0JB4ygBX7brHm9/XYOZQY\"",
    "mtime": "2023-08-13T14:55:47.155Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.549bfa26.js.br"
  },
  "/_nuxt/FavoriteComp.549bfa26.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-JxHFYm9mbekQw0EJgiG8vpJPstA\"",
    "mtime": "2023-08-13T14:55:47.152Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.549bfa26.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-13T14:55:47.063Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-13T14:55:47.181Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-13T14:55:47.156Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-13T14:55:47.063Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-13T14:55:47.187Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-13T14:55:47.182Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.cb99b604.js": {
    "type": "application/javascript",
    "etag": "\"e2e-HGfvCvhcadyhZZA0gSKDqAy4jIQ\"",
    "mtime": "2023-08-13T14:55:47.062Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.cb99b604.js"
  },
  "/_nuxt/FavoriteComp.cb99b604.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-qYCmBmJ5r4U5g7N5QrR5LIZLo84\"",
    "mtime": "2023-08-13T14:55:47.193Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.cb99b604.js.br"
  },
  "/_nuxt/FavoriteComp.cb99b604.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-Qoy9litSbWEy9GiMMSrRUBY2IOI\"",
    "mtime": "2023-08-13T14:55:47.188Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.cb99b604.js.gz"
  },
  "/_nuxt/ImageForm.1e1c797f.js": {
    "type": "application/javascript",
    "etag": "\"1ac-hdYXGNQsYRXEWNBwAAWgGH/GBko\"",
    "mtime": "2023-08-13T14:55:47.062Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.1e1c797f.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-13T14:55:47.061Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.ddd51125.js": {
    "type": "application/javascript",
    "etag": "\"1fe-3OSXMKCt8PcipZVi7HYh8uObas0\"",
    "mtime": "2023-08-13T14:55:47.061Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.ddd51125.js"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-13T14:55:47.060Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-13T14:55:47.197Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-13T14:55:47.195Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.93092ada.js": {
    "type": "application/javascript",
    "etag": "\"453-xB6bNjYrVSTovmEE+tylYRHvLN4\"",
    "mtime": "2023-08-13T14:55:47.060Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.93092ada.js"
  },
  "/_nuxt/OrderProductList.93092ada.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-+NN+V4+z68MjsXa4WIYA+QwD8aE\"",
    "mtime": "2023-08-13T14:55:47.200Z",
    "size": 520,
    "path": "../public/_nuxt/OrderProductList.93092ada.js.br"
  },
  "/_nuxt/OrderProductList.93092ada.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"241-cErpj9Xb3M8llCnv/jQECjO4Yaw\"",
    "mtime": "2023-08-13T14:55:47.198Z",
    "size": 577,
    "path": "../public/_nuxt/OrderProductList.93092ada.js.gz"
  },
  "/_nuxt/UserBasket.32af2d5a.js": {
    "type": "application/javascript",
    "etag": "\"1309-XImtax4dHGoQJIob9oYjbV1wClI\"",
    "mtime": "2023-08-13T14:55:47.060Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.32af2d5a.js"
  },
  "/_nuxt/UserBasket.32af2d5a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72f-c0nww/HNPiBPvxp/WGT/7Q0fvSI\"",
    "mtime": "2023-08-13T14:55:47.206Z",
    "size": 1839,
    "path": "../public/_nuxt/UserBasket.32af2d5a.js.br"
  },
  "/_nuxt/UserBasket.32af2d5a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"838-WeXsSk2U0nhT5qDAgRkZqEXEu6k\"",
    "mtime": "2023-08-13T14:55:47.201Z",
    "size": 2104,
    "path": "../public/_nuxt/UserBasket.32af2d5a.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-13T14:55:47.059Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-13T14:55:47.223Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-13T14:55:47.207Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.30396992.js": {
    "type": "application/javascript",
    "etag": "\"12c9-dIh3KAhFNTvMoVFWHnYeOLe68pQ\"",
    "mtime": "2023-08-13T14:55:47.059Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.30396992.js"
  },
  "/_nuxt/_id_.30396992.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"760-PJym+hf2alXAInO9qZWrOHympEA\"",
    "mtime": "2023-08-13T14:55:47.230Z",
    "size": 1888,
    "path": "../public/_nuxt/_id_.30396992.js.br"
  },
  "/_nuxt/_id_.30396992.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85a-ZpmA3JkNp702u1BOp50Xlntw7so\"",
    "mtime": "2023-08-13T14:55:47.224Z",
    "size": 2138,
    "path": "../public/_nuxt/_id_.30396992.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-13T14:55:47.058Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-13T14:55:47.058Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-13T14:55:47.245Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-13T14:55:47.231Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.f3d87a8b.js": {
    "type": "application/javascript",
    "etag": "\"531-V7b45fgUI1wAag3uwZ704PkqEBs\"",
    "mtime": "2023-08-13T14:55:47.057Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.f3d87a8b.js"
  },
  "/_nuxt/_id_.f3d87a8b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"29e-TU7FL+qn8o1IkGGRtBj/WppPsPY\"",
    "mtime": "2023-08-13T14:55:47.248Z",
    "size": 670,
    "path": "../public/_nuxt/_id_.f3d87a8b.js.br"
  },
  "/_nuxt/_id_.f3d87a8b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-16P9A5FRfHdLwerICpzcY3TOOTE\"",
    "mtime": "2023-08-13T14:55:47.246Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.f3d87a8b.js.gz"
  },
  "/_nuxt/basket.8beb8b5c.js": {
    "type": "application/javascript",
    "etag": "\"294-LWiNW6Q4Hjbx/Ao6UKRiR3+TSK8\"",
    "mtime": "2023-08-13T14:55:47.057Z",
    "size": 660,
    "path": "../public/_nuxt/basket.8beb8b5c.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-13T14:55:47.056Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-13T14:55:47.256Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-13T14:55:47.249Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-13T14:55:47.056Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-13T14:55:47.264Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-13T14:55:47.256Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/catalog.750050c0.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-DNB9+rpjIwfbMdRiSnMXThbFUQY\"",
    "mtime": "2023-08-13T14:55:47.055Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.750050c0.js"
  },
  "/_nuxt/catalog.750050c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-eJJx215mW0MNhI2pr9YnEROH3Kw\"",
    "mtime": "2023-08-13T14:55:47.273Z",
    "size": 2339,
    "path": "../public/_nuxt/catalog.750050c0.js.br"
  },
  "/_nuxt/catalog.750050c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-uF2ZdDf1BXWSCCzxM9cYs4TeyHA\"",
    "mtime": "2023-08-13T14:55:47.265Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.750050c0.js.gz"
  },
  "/_nuxt/checkout.2082d15d.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-+sW6wy+n+N7Zn1Y5SykRSI8g/yg\"",
    "mtime": "2023-08-13T14:55:47.055Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.2082d15d.js"
  },
  "/_nuxt/checkout.2082d15d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"527e-/5xljhNbzR5PUztZ05MGzqL17nA\"",
    "mtime": "2023-08-13T14:55:47.368Z",
    "size": 21118,
    "path": "../public/_nuxt/checkout.2082d15d.js.br"
  },
  "/_nuxt/checkout.2082d15d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcf-Y0LLGJbdBW+67GCfyP40omkswW0\"",
    "mtime": "2023-08-13T14:55:47.276Z",
    "size": 24527,
    "path": "../public/_nuxt/checkout.2082d15d.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-13T14:55:47.054Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-13T14:55:47.480Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-13T14:55:47.372Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/entry.272e06cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-eN42h3tjGA7e3Q9pNkJqyBk/Y34\"",
    "mtime": "2023-08-13T14:55:47.052Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.272e06cb.css"
  },
  "/_nuxt/entry.272e06cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"949-4kq5TgrgIGq5pEFftgFn0fVOTA0\"",
    "mtime": "2023-08-13T14:55:47.492Z",
    "size": 2377,
    "path": "../public/_nuxt/entry.272e06cb.css.br"
  },
  "/_nuxt/entry.272e06cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab4-0c4iM8gSpya0NQ6SIJ49nqsMmzU\"",
    "mtime": "2023-08-13T14:55:47.481Z",
    "size": 2740,
    "path": "../public/_nuxt/entry.272e06cb.css.gz"
  },
  "/_nuxt/entry.ca6cf1a7.js": {
    "type": "application/javascript",
    "etag": "\"36267-FQHiHEvEXPHgvhj/1Ij2pbGNwZ8\"",
    "mtime": "2023-08-13T14:55:47.052Z",
    "size": 221799,
    "path": "../public/_nuxt/entry.ca6cf1a7.js"
  },
  "/_nuxt/entry.ca6cf1a7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120d5-a0fzIEnE50lkBjU/yA1ZtvcG+Bg\"",
    "mtime": "2023-08-13T14:55:47.849Z",
    "size": 73941,
    "path": "../public/_nuxt/entry.ca6cf1a7.js.br"
  },
  "/_nuxt/entry.ca6cf1a7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1452b-0dIImwFmZGKP3cVn2OU2rMYpN7A\"",
    "mtime": "2023-08-13T14:55:47.502Z",
    "size": 83243,
    "path": "../public/_nuxt/entry.ca6cf1a7.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-13T14:55:47.050Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-13T14:55:47.855Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-13T14:55:47.850Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.ab74f1c2.js": {
    "type": "application/javascript",
    "etag": "\"8a8-PM1mYbjOKjheZtk/dd7lV4t+0C8\"",
    "mtime": "2023-08-13T14:55:47.050Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.ab74f1c2.js"
  },
  "/_nuxt/error-404.ab74f1c2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-3rIv1W8XuwLYems7ChzUOnCG40U\"",
    "mtime": "2023-08-13T14:55:47.859Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.ab74f1c2.js.br"
  },
  "/_nuxt/error-404.ab74f1c2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-v2JtiSRR/ZSpE5I8HwrcoXSjG0k\"",
    "mtime": "2023-08-13T14:55:47.855Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.ab74f1c2.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-13T14:55:47.049Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-13T14:55:47.862Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-13T14:55:47.859Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.fefaf5a3.js": {
    "type": "application/javascript",
    "etag": "\"756-YpjUzsiphQBIYKcq8U098NOpR7M\"",
    "mtime": "2023-08-13T14:55:47.048Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.fefaf5a3.js"
  },
  "/_nuxt/error-500.fefaf5a3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-Ag2rrmUoglUjcruRAE6dJdm/c/k\"",
    "mtime": "2023-08-13T14:55:47.865Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.fefaf5a3.js.br"
  },
  "/_nuxt/error-500.fefaf5a3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-WSNvwMwwssN1nAUR0qrKE1XypEU\"",
    "mtime": "2023-08-13T14:55:47.863Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.fefaf5a3.js.gz"
  },
  "/_nuxt/error-component.7b082a50.js": {
    "type": "application/javascript",
    "etag": "\"45e-D9LByaHxHsO6OVgqvYUQ9LW4Y1s\"",
    "mtime": "2023-08-13T14:55:47.048Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.7b082a50.js"
  },
  "/_nuxt/error-component.7b082a50.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-hOsuaNarBof4j4adZ8lQ9B0IOjE\"",
    "mtime": "2023-08-13T14:55:47.868Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.7b082a50.js.br"
  },
  "/_nuxt/error-component.7b082a50.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-KE/O4qIcXmQ/5dmrd//g8ZRHQgM\"",
    "mtime": "2023-08-13T14:55:47.866Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.7b082a50.js.gz"
  },
  "/_nuxt/favorite.24598cf2.js": {
    "type": "application/javascript",
    "etag": "\"a31-fOTGzE2PGN/loJeiw3io1wg+oeA\"",
    "mtime": "2023-08-13T14:55:47.047Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.24598cf2.js"
  },
  "/_nuxt/favorite.24598cf2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44e-kx2Bn/lDhyOOiiyzTvcYwcYMJps\"",
    "mtime": "2023-08-13T14:55:47.872Z",
    "size": 1102,
    "path": "../public/_nuxt/favorite.24598cf2.js.br"
  },
  "/_nuxt/favorite.24598cf2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"506-dtDQiLejGWBFhC+v+OXtqGduRww\"",
    "mtime": "2023-08-13T14:55:47.869Z",
    "size": 1286,
    "path": "../public/_nuxt/favorite.24598cf2.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-13T14:55:47.047Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-13T14:55:47.880Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-13T14:55:47.873Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-13T14:55:47.046Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-13T14:55:47.045Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0ccfdc87.js": {
    "type": "application/javascript",
    "etag": "\"3aba-yrn3FzXo5OxdS8NPH36E56UBSpw\"",
    "mtime": "2023-08-13T14:55:47.045Z",
    "size": 15034,
    "path": "../public/_nuxt/index.0ccfdc87.js"
  },
  "/_nuxt/index.0ccfdc87.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ef-uhtPWCQ+Fm2kaLkbL6w1rT/M5rw\"",
    "mtime": "2023-08-13T14:55:47.897Z",
    "size": 4847,
    "path": "../public/_nuxt/index.0ccfdc87.js.br"
  },
  "/_nuxt/index.0ccfdc87.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14ef-XjUccki4bVaNm5ur4Ar6CvHRhSY\"",
    "mtime": "2023-08-13T14:55:47.881Z",
    "size": 5359,
    "path": "../public/_nuxt/index.0ccfdc87.js.gz"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-13T14:55:47.044Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-13T14:55:47.901Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-13T14:55:47.897Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.4b8327b4.js": {
    "type": "application/javascript",
    "etag": "\"1704b-lBanmvkYX+zMHzTplNbiSDldwtY\"",
    "mtime": "2023-08-13T14:55:47.043Z",
    "size": 94283,
    "path": "../public/_nuxt/index.4b8327b4.js"
  },
  "/_nuxt/index.4b8327b4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6525-zTqXI0IW2FZ+aBHb+vJy+Q/JU8w\"",
    "mtime": "2023-08-13T14:55:48.010Z",
    "size": 25893,
    "path": "../public/_nuxt/index.4b8327b4.js.br"
  },
  "/_nuxt/index.4b8327b4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7305-4XYM7UpkdbbEcNEm9r3xpHdTf+8\"",
    "mtime": "2023-08-13T14:55:47.904Z",
    "size": 29445,
    "path": "../public/_nuxt/index.4b8327b4.js.gz"
  },
  "/_nuxt/index.78f3c85e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5190-eKtxMciUgFVu76bdiGdIP7QhIE4\"",
    "mtime": "2023-08-13T14:55:47.043Z",
    "size": 20880,
    "path": "../public/_nuxt/index.78f3c85e.css"
  },
  "/_nuxt/index.78f3c85e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12c1-2UJ2PrXNFEs830RhJHtrlicOAzs\"",
    "mtime": "2023-08-13T14:55:48.033Z",
    "size": 4801,
    "path": "../public/_nuxt/index.78f3c85e.css.br"
  },
  "/_nuxt/index.78f3c85e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"156a-BewQYcrA1pWOmWZL09bObv8O1q0\"",
    "mtime": "2023-08-13T14:55:48.011Z",
    "size": 5482,
    "path": "../public/_nuxt/index.78f3c85e.css.gz"
  },
  "/_nuxt/index.acfcb06d.js": {
    "type": "application/javascript",
    "etag": "\"645-e2o7OUDHAQt4cJuUIlnFZuZqPLU\"",
    "mtime": "2023-08-13T14:55:47.042Z",
    "size": 1605,
    "path": "../public/_nuxt/index.acfcb06d.js"
  },
  "/_nuxt/index.acfcb06d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"32b-HP+ps6bFH+MSFwKkxVjycRIgVlQ\"",
    "mtime": "2023-08-13T14:55:48.036Z",
    "size": 811,
    "path": "../public/_nuxt/index.acfcb06d.js.br"
  },
  "/_nuxt/index.acfcb06d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b8-o1eqHkRSCoiPB2bEfetYGtWUqCI\"",
    "mtime": "2023-08-13T14:55:48.033Z",
    "size": 952,
    "path": "../public/_nuxt/index.acfcb06d.js.gz"
  },
  "/_nuxt/isAuth.daed4e76.js": {
    "type": "application/javascript",
    "etag": "\"225-w9Z2SzxdFJQ+UVs6Tm6bt5GCG08\"",
    "mtime": "2023-08-13T14:55:47.041Z",
    "size": 549,
    "path": "../public/_nuxt/isAuth.daed4e76.js"
  },
  "/_nuxt/login.00992226.js": {
    "type": "application/javascript",
    "etag": "\"809-gIX9r+o4vV5Jph82TexxZ8HyyJA\"",
    "mtime": "2023-08-13T14:55:47.041Z",
    "size": 2057,
    "path": "../public/_nuxt/login.00992226.js"
  },
  "/_nuxt/login.00992226.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e7-gjWARdhCU3WI33dDmcNw+cbSBVc\"",
    "mtime": "2023-08-13T14:55:48.041Z",
    "size": 999,
    "path": "../public/_nuxt/login.00992226.js.br"
  },
  "/_nuxt/login.00992226.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ac-cHmDIRPk3+Kqn2+zJd5387xBw28\"",
    "mtime": "2023-08-13T14:55:48.037Z",
    "size": 1196,
    "path": "../public/_nuxt/login.00992226.js.gz"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-13T14:55:47.040Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-13T14:55:48.044Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-13T14:55:48.041Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/newsList.205e69c8.js": {
    "type": "application/javascript",
    "etag": "\"e6-j/r/+ffK3LjJUsEut/6JEnUKfzI\"",
    "mtime": "2023-08-13T14:55:47.040Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.205e69c8.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-13T14:55:47.039Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-13T14:55:48.056Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-13T14:55:48.045Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.91122849.js": {
    "type": "application/javascript",
    "etag": "\"26b6-EJg08gr9VZUkV/hdIzVjJNhuhHY\"",
    "mtime": "2023-08-13T14:55:47.039Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.91122849.js"
  },
  "/_nuxt/orders.91122849.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bd1-RigvGfxCee1bP6qIsbCZ6aaoZO8\"",
    "mtime": "2023-08-13T14:55:48.067Z",
    "size": 3025,
    "path": "../public/_nuxt/orders.91122849.js.br"
  },
  "/_nuxt/orders.91122849.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-I8pP0wqvspvM4cJ14ds1Z6bZtcw\"",
    "mtime": "2023-08-13T14:55:48.056Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.91122849.js.gz"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-13T14:55:47.038Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-13T14:55:48.103Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-13T14:55:48.068Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.8a9851e8.js": {
    "type": "application/javascript",
    "etag": "\"168b-RZWVJiCfqgWRUKWfHjyO3bw9g8g\"",
    "mtime": "2023-08-13T14:55:47.038Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.8a9851e8.js"
  },
  "/_nuxt/profile.8a9851e8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83e-osEntp5qvWeOwqYK0jN0ki46wuU\"",
    "mtime": "2023-08-13T14:55:48.111Z",
    "size": 2110,
    "path": "../public/_nuxt/profile.8a9851e8.js.br"
  },
  "/_nuxt/profile.8a9851e8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a0-+AmS9ZfRgiCYNR2KliwHWSUtAD8\"",
    "mtime": "2023-08-13T14:55:48.104Z",
    "size": 2464,
    "path": "../public/_nuxt/profile.8a9851e8.js.gz"
  },
  "/_nuxt/register.6cf64d69.js": {
    "type": "application/javascript",
    "etag": "\"11b8-Lx56UXE5a/Mi6r3/4c895SwkwfU\"",
    "mtime": "2023-08-13T14:55:47.037Z",
    "size": 4536,
    "path": "../public/_nuxt/register.6cf64d69.js"
  },
  "/_nuxt/register.6cf64d69.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bf-QxOxVWrbywk62I6gzwJcKYt3WpY\"",
    "mtime": "2023-08-13T14:55:48.118Z",
    "size": 1471,
    "path": "../public/_nuxt/register.6cf64d69.js.br"
  },
  "/_nuxt/register.6cf64d69.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f8-NrnQtFKniy9sVtohxJO3x9i+Sac\"",
    "mtime": "2023-08-13T14:55:48.112Z",
    "size": 1784,
    "path": "../public/_nuxt/register.6cf64d69.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-13T14:55:47.036Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-13T14:55:48.122Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-13T14:55:48.119Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T14:55:47.036Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T14:55:48.125Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T14:55:48.122Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-13T14:55:47.035Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-13T14:55:47.033Z",
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
