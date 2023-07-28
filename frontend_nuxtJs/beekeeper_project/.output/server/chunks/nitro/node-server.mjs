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
    "mtime": "2023-07-28T13:25:26.568Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-28T13:25:26.567Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-07-28T13:25:26.565Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.4379b072.js": {
    "type": "application/javascript",
    "etag": "\"95e-BMiGwQNN9+H3ifM9F11owLohj1g\"",
    "mtime": "2023-07-28T13:25:26.565Z",
    "size": 2398,
    "path": "../public/_nuxt/BasketInfo.4379b072.js"
  },
  "/_nuxt/BasketInfo.4379b072.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3dc-C5SfV8C/6zUcmKbRuAoZcMJaj34\"",
    "mtime": "2023-07-28T13:25:26.576Z",
    "size": 988,
    "path": "../public/_nuxt/BasketInfo.4379b072.js.br"
  },
  "/_nuxt/BasketInfo.4379b072.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"499-QsAHV5S8n992U0SKbLi+pG7+NLg\"",
    "mtime": "2023-07-28T13:25:26.572Z",
    "size": 1177,
    "path": "../public/_nuxt/BasketInfo.4379b072.js.gz"
  },
  "/_nuxt/BasketInfo.70463914.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-zPv+yNQRgSiyRq30xV+2TpZ28YA\"",
    "mtime": "2023-07-28T13:25:26.564Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.70463914.css"
  },
  "/_nuxt/BasketInfo.70463914.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-n8Pf6m13vKTG2FGvHcJqAyS/wG8\"",
    "mtime": "2023-07-28T13:25:26.602Z",
    "size": 1771,
    "path": "../public/_nuxt/BasketInfo.70463914.css.br"
  },
  "/_nuxt/BasketInfo.70463914.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-h3heeYHzj3jVC5Sp12i+VO9vLMk\"",
    "mtime": "2023-07-28T13:25:26.577Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.70463914.css.gz"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e93-G3xI4VCnp/o1PJ6X8jCePAboJ84\"",
    "mtime": "2023-07-28T13:25:26.564Z",
    "size": 7827,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b8-fo8PX5NfK5pkMKGxQThnf58E9Jk\"",
    "mtime": "2023-07-28T13:25:26.612Z",
    "size": 1720,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.br"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ce-exicXpkBf+OSryzPSXTK9KyUmWY\"",
    "mtime": "2023-07-28T13:25:26.603Z",
    "size": 1998,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.gz"
  },
  "/_nuxt/CatalogProduct.b66caa50.js": {
    "type": "application/javascript",
    "etag": "\"e3e-jS1J0WB8VVIKM6aPYgKOHsFa+y0\"",
    "mtime": "2023-07-28T13:25:26.563Z",
    "size": 3646,
    "path": "../public/_nuxt/CatalogProduct.b66caa50.js"
  },
  "/_nuxt/CatalogProduct.b66caa50.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56f-clbQKim6m5fqHP56hC2pOZZWcMg\"",
    "mtime": "2023-07-28T13:25:26.618Z",
    "size": 1391,
    "path": "../public/_nuxt/CatalogProduct.b66caa50.js.br"
  },
  "/_nuxt/CatalogProduct.b66caa50.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"62e-yQfSLNwUUMYs2W0592AVAcNdj4A\"",
    "mtime": "2023-07-28T13:25:26.613Z",
    "size": 1582,
    "path": "../public/_nuxt/CatalogProduct.b66caa50.js.gz"
  },
  "/_nuxt/FavoriteComp.1c692043.js": {
    "type": "application/javascript",
    "etag": "\"783-rtCZeazrCNPT8Bi1T0jTL3UQqvQ\"",
    "mtime": "2023-07-28T13:25:26.563Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.1c692043.js"
  },
  "/_nuxt/FavoriteComp.1c692043.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-dylIaqdZ3/pxlty0fBS6i+J14A0\"",
    "mtime": "2023-07-28T13:25:26.622Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.1c692043.js.br"
  },
  "/_nuxt/FavoriteComp.1c692043.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f7-XGVkt7vOzUzS48lbPf17ooJOxwI\"",
    "mtime": "2023-07-28T13:25:26.618Z",
    "size": 759,
    "path": "../public/_nuxt/FavoriteComp.1c692043.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-07-28T13:25:26.562Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-07-28T13:25:26.638Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-07-28T13:25:26.622Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.be194ce4.js": {
    "type": "application/javascript",
    "etag": "\"b70-aE34XRqeltTNhtTw2O+a4CzKfA4\"",
    "mtime": "2023-07-28T13:25:26.562Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.be194ce4.js"
  },
  "/_nuxt/FavoriteComp.be194ce4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"382-XeTihludmHpP1uwS+L2rVbQvS0o\"",
    "mtime": "2023-07-28T13:25:26.643Z",
    "size": 898,
    "path": "../public/_nuxt/FavoriteComp.be194ce4.js.br"
  },
  "/_nuxt/FavoriteComp.be194ce4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40b-8sJUs2Ypq6r5b1Xsm5ZftCB0AhY\"",
    "mtime": "2023-07-28T13:25:26.639Z",
    "size": 1035,
    "path": "../public/_nuxt/FavoriteComp.be194ce4.js.gz"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1075-+RyDT2IQ2kPAAeedkmauBBTojb4\"",
    "mtime": "2023-07-28T13:25:26.562Z",
    "size": 4213,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bf-JW4WSiPepHevCg4JEO5/wP+oJBc\"",
    "mtime": "2023-07-28T13:25:26.649Z",
    "size": 959,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.br"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"489-HKAlc4bFKl4JU8yY+X+vzpaRT78\"",
    "mtime": "2023-07-28T13:25:26.644Z",
    "size": 1161,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.gz"
  },
  "/_nuxt/ImageForm.23f48138.js": {
    "type": "application/javascript",
    "etag": "\"225-uMFu6eDKKaNywi15IZQVWHc3gi8\"",
    "mtime": "2023-07-28T13:25:26.561Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.23f48138.js"
  },
  "/_nuxt/LoadingComp.46f175b5.js": {
    "type": "application/javascript",
    "etag": "\"1fe-nSEMn0pX9wEKyxRN47jTXKQZ86I\"",
    "mtime": "2023-07-28T13:25:26.561Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.46f175b5.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-28T13:25:26.560Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.6e291755.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-kGe7K192U1JYkwgh+N3+8GkaUOw\"",
    "mtime": "2023-07-28T13:25:26.560Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.6e291755.css"
  },
  "/_nuxt/OrderProductList.6e291755.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-tvuxaPNE1HA4DzysCe2QnLSdC1E\"",
    "mtime": "2023-07-28T13:25:26.652Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.br"
  },
  "/_nuxt/OrderProductList.6e291755.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-LbyXo24uolM39yqPdCpOhJF08BU\"",
    "mtime": "2023-07-28T13:25:26.650Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.gz"
  },
  "/_nuxt/OrderProductList.728893ed.js": {
    "type": "application/javascript",
    "etag": "\"43e-NRt+13+n0ZDKZJnv9yhjPPg4QjI\"",
    "mtime": "2023-07-28T13:25:26.559Z",
    "size": 1086,
    "path": "../public/_nuxt/OrderProductList.728893ed.js"
  },
  "/_nuxt/OrderProductList.728893ed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-mb/wP5PuY9jtdU791Hn8q+evsFw\"",
    "mtime": "2023-07-28T13:25:26.655Z",
    "size": 518,
    "path": "../public/_nuxt/OrderProductList.728893ed.js.br"
  },
  "/_nuxt/OrderProductList.728893ed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"240-9PDSt628xaxEaXcsLk0E3G2dMiA\"",
    "mtime": "2023-07-28T13:25:26.653Z",
    "size": 576,
    "path": "../public/_nuxt/OrderProductList.728893ed.js.gz"
  },
  "/_nuxt/UserBasket.74525ff3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-GktDk3Ud/dCJKFz3gOEcHMboClE\"",
    "mtime": "2023-07-28T13:25:26.559Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.74525ff3.css"
  },
  "/_nuxt/UserBasket.74525ff3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a2-vEscIRE7Ii74jC5guhiaXQXYCSg\"",
    "mtime": "2023-07-28T13:25:26.671Z",
    "size": 1698,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.br"
  },
  "/_nuxt/UserBasket.74525ff3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-coTaaCik2Gh4ZeF6NzmWRzcvtgc\"",
    "mtime": "2023-07-28T13:25:26.655Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.gz"
  },
  "/_nuxt/UserBasket.88e0a635.js": {
    "type": "application/javascript",
    "etag": "\"13e2-hngrF69nxVZekh/3F4YwYGsnlJI\"",
    "mtime": "2023-07-28T13:25:26.558Z",
    "size": 5090,
    "path": "../public/_nuxt/UserBasket.88e0a635.js"
  },
  "/_nuxt/UserBasket.88e0a635.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"77e-k2qV9J+D7C440pbTVmPrfptxiok\"",
    "mtime": "2023-07-28T13:25:26.678Z",
    "size": 1918,
    "path": "../public/_nuxt/UserBasket.88e0a635.js.br"
  },
  "/_nuxt/UserBasket.88e0a635.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88d-/CNmr/hXdyurJF+WxrCOypshZjg\"",
    "mtime": "2023-07-28T13:25:26.672Z",
    "size": 2189,
    "path": "../public/_nuxt/UserBasket.88e0a635.js.gz"
  },
  "/_nuxt/_id_.4180f373.js": {
    "type": "application/javascript",
    "etag": "\"135b-fYbPWLmFv0H7A5Sjfgz723fEgA0\"",
    "mtime": "2023-07-28T13:25:26.558Z",
    "size": 4955,
    "path": "../public/_nuxt/_id_.4180f373.js"
  },
  "/_nuxt/_id_.4180f373.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"79e-ijafiumYASufCQ0WOZ1EMV0do8M\"",
    "mtime": "2023-07-28T13:25:26.685Z",
    "size": 1950,
    "path": "../public/_nuxt/_id_.4180f373.js.br"
  },
  "/_nuxt/_id_.4180f373.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-9u8o4FxS8AbN0MOuPAH5eS3aexI\"",
    "mtime": "2023-07-28T13:25:26.679Z",
    "size": 2185,
    "path": "../public/_nuxt/_id_.4180f373.js.gz"
  },
  "/_nuxt/_id_.5da13773.js": {
    "type": "application/javascript",
    "etag": "\"4be-66lgX4lB40HQNWbVvukTiXiBZ+E\"",
    "mtime": "2023-07-28T13:25:26.557Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.5da13773.js"
  },
  "/_nuxt/_id_.5da13773.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-Guq7bRxmMxmG9fiLtK457URe9Dw\"",
    "mtime": "2023-07-28T13:25:26.687Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.5da13773.js.br"
  },
  "/_nuxt/_id_.5da13773.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2de-9RnpZnjkUcwnhT080MQe087Xll4\"",
    "mtime": "2023-07-28T13:25:26.685Z",
    "size": 734,
    "path": "../public/_nuxt/_id_.5da13773.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-28T13:25:26.557Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.979e8500.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-ZSQymBUeZM4aYKucSaWpk67lzTg\"",
    "mtime": "2023-07-28T13:25:26.556Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.979e8500.css"
  },
  "/_nuxt/_id_.979e8500.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8KZGT0unAXpGxmvwnDrhxlGxhGQ\"",
    "mtime": "2023-07-28T13:25:26.703Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.979e8500.css.br"
  },
  "/_nuxt/_id_.979e8500.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"685-wxGzSLQku1+oQBLsK97I+i/DFUE\"",
    "mtime": "2023-07-28T13:25:26.688Z",
    "size": 1669,
    "path": "../public/_nuxt/_id_.979e8500.css.gz"
  },
  "/_nuxt/basket.126e7dda.js": {
    "type": "application/javascript",
    "etag": "\"26e-oIupt7sFSc7WlJjEgR+ygeRfJ/M\"",
    "mtime": "2023-07-28T13:25:26.556Z",
    "size": 622,
    "path": "../public/_nuxt/basket.126e7dda.js"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-28T13:25:26.555Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-28T13:25:26.710Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-28T13:25:26.704Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/catalog.9aebceb1.js": {
    "type": "application/javascript",
    "etag": "\"1c63-s7uu2Y/na7hHLZ6jSsviLwGe58A\"",
    "mtime": "2023-07-28T13:25:26.555Z",
    "size": 7267,
    "path": "../public/_nuxt/catalog.9aebceb1.js"
  },
  "/_nuxt/catalog.9aebceb1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"980-KIDz6IRf1hf0WmnvLwpYZv01ye4\"",
    "mtime": "2023-07-28T13:25:26.719Z",
    "size": 2432,
    "path": "../public/_nuxt/catalog.9aebceb1.js.br"
  },
  "/_nuxt/catalog.9aebceb1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"ae8-MoY0MqP2KV1KkrJlnlhbNx8W+dM\"",
    "mtime": "2023-07-28T13:25:26.711Z",
    "size": 2792,
    "path": "../public/_nuxt/catalog.9aebceb1.js.gz"
  },
  "/_nuxt/catalog.d04bdf4f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1da3-/kOuZGqzTo7qp9TwfRfzspuWXFA\"",
    "mtime": "2023-07-28T13:25:26.554Z",
    "size": 7587,
    "path": "../public/_nuxt/catalog.d04bdf4f.css"
  },
  "/_nuxt/catalog.d04bdf4f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c5-KSqut9Z0GijBQiu4QeFopzSmexg\"",
    "mtime": "2023-07-28T13:25:26.728Z",
    "size": 1733,
    "path": "../public/_nuxt/catalog.d04bdf4f.css.br"
  },
  "/_nuxt/catalog.d04bdf4f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7dd-iddv4g1iTSDrfbjvcw4Yc73QmtY\"",
    "mtime": "2023-07-28T13:25:26.720Z",
    "size": 2013,
    "path": "../public/_nuxt/catalog.d04bdf4f.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-28T13:25:26.554Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.2d143100.js": {
    "type": "application/javascript",
    "etag": "\"147c2-QnHzKxLZn2vSGBn9bJ4c3wCW+Zc\"",
    "mtime": "2023-07-28T13:25:26.553Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.2d143100.js"
  },
  "/_nuxt/checkout.2d143100.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50c4-FeaBT7/2o522RggBkiX2QhCiZHI\"",
    "mtime": "2023-07-28T13:25:26.830Z",
    "size": 20676,
    "path": "../public/_nuxt/checkout.2d143100.js.br"
  },
  "/_nuxt/checkout.2d143100.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e01-1nqz8J9LSZqFxzQToCcq6zc4lvE\"",
    "mtime": "2023-07-28T13:25:26.731Z",
    "size": 24065,
    "path": "../public/_nuxt/checkout.2d143100.js.gz"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-28T13:25:26.552Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-28T13:25:26.954Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-28T13:25:26.834Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-28T13:25:26.551Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.4e9bea75.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"249e-7iHU3PloHkXzOHB1XpweEcPyWgA\"",
    "mtime": "2023-07-28T13:25:26.550Z",
    "size": 9374,
    "path": "../public/_nuxt/entry.4e9bea75.css"
  },
  "/_nuxt/entry.4e9bea75.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"909-SMV70JX5U2cW0mB14iqbNkXxN7Y\"",
    "mtime": "2023-07-28T13:25:26.965Z",
    "size": 2313,
    "path": "../public/_nuxt/entry.4e9bea75.css.br"
  },
  "/_nuxt/entry.4e9bea75.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a6a-0RP553Yy08Qm9hZd8iT/BxQKJ9o\"",
    "mtime": "2023-07-28T13:25:26.955Z",
    "size": 2666,
    "path": "../public/_nuxt/entry.4e9bea75.css.gz"
  },
  "/_nuxt/entry.bef30b64.js": {
    "type": "application/javascript",
    "etag": "\"341b5-5fk2aJR8znUp55TgnhWh27YhYb4\"",
    "mtime": "2023-07-28T13:25:26.549Z",
    "size": 213429,
    "path": "../public/_nuxt/entry.bef30b64.js"
  },
  "/_nuxt/entry.bef30b64.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"116ca-cjEhwPdA5E6+xQE6br/o9SLGmnw\"",
    "mtime": "2023-07-28T13:25:27.299Z",
    "size": 71370,
    "path": "../public/_nuxt/entry.bef30b64.js.br"
  },
  "/_nuxt/entry.bef30b64.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"138fe-ox0ob9i2vrlr53tVbZaGCUHvKeQ\"",
    "mtime": "2023-07-28T13:25:26.974Z",
    "size": 80126,
    "path": "../public/_nuxt/entry.bef30b64.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-28T13:25:26.547Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-28T13:25:27.305Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-28T13:25:27.300Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.77d989d4.js": {
    "type": "application/javascript",
    "etag": "\"8a4-f9cjwVjlrWQP+/Gmyuyz+aJ02sM\"",
    "mtime": "2023-07-28T13:25:26.547Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.77d989d4.js"
  },
  "/_nuxt/error-404.77d989d4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cd-/0U7WdpsSvPtF71nuTMHVc22XPA\"",
    "mtime": "2023-07-28T13:25:27.309Z",
    "size": 973,
    "path": "../public/_nuxt/error-404.77d989d4.js.br"
  },
  "/_nuxt/error-404.77d989d4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-bUly3nQnjIYi09vXyBdoMtZV5JY\"",
    "mtime": "2023-07-28T13:25:27.306Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.77d989d4.js.gz"
  },
  "/_nuxt/error-500.76f6b762.js": {
    "type": "application/javascript",
    "etag": "\"757-cvGeRH7nqou2leT0f5qU03cA1pA\"",
    "mtime": "2023-07-28T13:25:26.546Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.76f6b762.js"
  },
  "/_nuxt/error-500.76f6b762.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-CvTftWyfkMRqyzzbJOUGX7hNTkE\"",
    "mtime": "2023-07-28T13:25:27.312Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.76f6b762.js.br"
  },
  "/_nuxt/error-500.76f6b762.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-ih1qZpgsHFhn0lheI5aoFzQgFB0\"",
    "mtime": "2023-07-28T13:25:27.309Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.76f6b762.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-28T13:25:26.546Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-28T13:25:27.316Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-28T13:25:27.313Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.d494290b.js": {
    "type": "application/javascript",
    "etag": "\"45e-wR3K/w0176iSLnzbd5RXgg/33jo\"",
    "mtime": "2023-07-28T13:25:26.545Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.d494290b.js"
  },
  "/_nuxt/error-component.d494290b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-XiXSMKFGga6aJKzZ3T9IDAUgY3g\"",
    "mtime": "2023-07-28T13:25:27.319Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.d494290b.js.br"
  },
  "/_nuxt/error-component.d494290b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-jCr1wUJEw7wUjK159YbbLL49dfI\"",
    "mtime": "2023-07-28T13:25:27.317Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.d494290b.js.gz"
  },
  "/_nuxt/favorite.35b03e02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-TdwA+Lp1YcFEqpovyPoJuLI5Xto\"",
    "mtime": "2023-07-28T13:25:26.544Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.35b03e02.css"
  },
  "/_nuxt/favorite.35b03e02.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-PyzoVM3jh9aCuAWa5MNu0d3bKFA\"",
    "mtime": "2023-07-28T13:25:27.327Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.35b03e02.css.br"
  },
  "/_nuxt/favorite.35b03e02.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-DgD1qExPmPpf7Y+V1nzmNqM97pk\"",
    "mtime": "2023-07-28T13:25:27.320Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.35b03e02.css.gz"
  },
  "/_nuxt/favorite.e20060bb.js": {
    "type": "application/javascript",
    "etag": "\"9f6-9XKtI1e9NIvLGsxSSkS+P9O+8p8\"",
    "mtime": "2023-07-28T13:25:26.543Z",
    "size": 2550,
    "path": "../public/_nuxt/favorite.e20060bb.js"
  },
  "/_nuxt/favorite.e20060bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"436-y6Wwzw9vBtk9Jl1486QmuhwKyD8\"",
    "mtime": "2023-07-28T13:25:27.332Z",
    "size": 1078,
    "path": "../public/_nuxt/favorite.e20060bb.js.br"
  },
  "/_nuxt/favorite.e20060bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4e3-89sv88AMxu08kYae+AMv8Mzin7k\"",
    "mtime": "2023-07-28T13:25:27.328Z",
    "size": 1251,
    "path": "../public/_nuxt/favorite.e20060bb.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-07-28T13:25:26.543Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-28T13:25:26.542Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.6dbff311.js": {
    "type": "application/javascript",
    "etag": "\"16a34-km6zt4twnTLVBeougmFIn9fFH5A\"",
    "mtime": "2023-07-28T13:25:26.541Z",
    "size": 92724,
    "path": "../public/_nuxt/index.6dbff311.js"
  },
  "/_nuxt/index.6dbff311.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62eb-3HCXRjzkxV7h5ZNrd1Prnyr3HrQ\"",
    "mtime": "2023-07-28T13:25:27.439Z",
    "size": 25323,
    "path": "../public/_nuxt/index.6dbff311.js.br"
  },
  "/_nuxt/index.6dbff311.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f74-YKRrx1kReEsXzZ2OASBT7E4Ykas\"",
    "mtime": "2023-07-28T13:25:27.336Z",
    "size": 28532,
    "path": "../public/_nuxt/index.6dbff311.js.gz"
  },
  "/_nuxt/index.7ce8a1c0.js": {
    "type": "application/javascript",
    "etag": "\"605-BrH2yIipCokq/Gj8Brb5WuB76yc\"",
    "mtime": "2023-07-28T13:25:26.539Z",
    "size": 1541,
    "path": "../public/_nuxt/index.7ce8a1c0.js"
  },
  "/_nuxt/index.7ce8a1c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2f7-XQIY9/qGBB7d30wguL8ZjzsN5XA\"",
    "mtime": "2023-07-28T13:25:27.442Z",
    "size": 759,
    "path": "../public/_nuxt/index.7ce8a1c0.js.br"
  },
  "/_nuxt/index.7ce8a1c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38d-uZ09xRzaIDYVEqlkrfpILvRgIHw\"",
    "mtime": "2023-07-28T13:25:27.440Z",
    "size": 909,
    "path": "../public/_nuxt/index.7ce8a1c0.js.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-07-28T13:25:26.539Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-07-28T13:25:27.449Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-07-28T13:25:27.443Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.a9d3a912.js": {
    "type": "application/javascript",
    "etag": "\"3abf-F6o9zAlI1mli0DaLQCLHLNY3o8c\"",
    "mtime": "2023-07-28T13:25:26.538Z",
    "size": 15039,
    "path": "../public/_nuxt/index.a9d3a912.js"
  },
  "/_nuxt/index.a9d3a912.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f7-FFJvd8ivrRxUqxcSKGBfLsQ08kY\"",
    "mtime": "2023-07-28T13:25:27.466Z",
    "size": 4855,
    "path": "../public/_nuxt/index.a9d3a912.js.br"
  },
  "/_nuxt/index.a9d3a912.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-JHlQM1RYikJDHNIZI4lpZP0DMdU\"",
    "mtime": "2023-07-28T13:25:27.450Z",
    "size": 5361,
    "path": "../public/_nuxt/index.a9d3a912.js.gz"
  },
  "/_nuxt/index.cbdafc32.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-Oie/RaCJVCWMrr1e8vvhLcrY4Bk\"",
    "mtime": "2023-07-28T13:25:26.537Z",
    "size": 22587,
    "path": "../public/_nuxt/index.cbdafc32.css"
  },
  "/_nuxt/index.cbdafc32.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127b-YZmZg4aOPR0XJ/C5KRuDlZ5nYg8\"",
    "mtime": "2023-07-28T13:25:27.492Z",
    "size": 4731,
    "path": "../public/_nuxt/index.cbdafc32.css.br"
  },
  "/_nuxt/index.cbdafc32.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-IQikMBDJcQDMumEslo1kpG8ZKxM\"",
    "mtime": "2023-07-28T13:25:27.467Z",
    "size": 5602,
    "path": "../public/_nuxt/index.cbdafc32.css.gz"
  },
  "/_nuxt/isAuth.04c8e962.js": {
    "type": "application/javascript",
    "etag": "\"213-ByNNstZIgJH91RkFSXjqg1F5QR8\"",
    "mtime": "2023-07-28T13:25:26.536Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.04c8e962.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-28T13:25:26.535Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-28T13:25:27.496Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-28T13:25:27.494Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.fed60ccf.js": {
    "type": "application/javascript",
    "etag": "\"830-KACyYf755HKB0Hqfj/20zHPyNzo\"",
    "mtime": "2023-07-28T13:25:26.535Z",
    "size": 2096,
    "path": "../public/_nuxt/login.fed60ccf.js"
  },
  "/_nuxt/login.fed60ccf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-GAmNsl4FHP5z58/dSriZ7DYipSw\"",
    "mtime": "2023-07-28T13:25:27.500Z",
    "size": 985,
    "path": "../public/_nuxt/login.fed60ccf.js.br"
  },
  "/_nuxt/login.fed60ccf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4aa-glIGnI69nmuKeIczclWN3Xcj1Ic\"",
    "mtime": "2023-07-28T13:25:27.497Z",
    "size": 1194,
    "path": "../public/_nuxt/login.fed60ccf.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-28T13:25:26.534Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.553c49bb.js": {
    "type": "application/javascript",
    "etag": "\"4af-rJH21uRmg2SEHPvu7t/yjI0cUNI\"",
    "mtime": "2023-07-28T13:25:26.531Z",
    "size": 1199,
    "path": "../public/_nuxt/news.553c49bb.js"
  },
  "/_nuxt/news.553c49bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a4-0Ye7Ov6gwqMHkw1sDM/CBGX6LHo\"",
    "mtime": "2023-07-28T13:25:27.503Z",
    "size": 420,
    "path": "../public/_nuxt/news.553c49bb.js.br"
  },
  "/_nuxt/news.553c49bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-H7YmfhZowzdGJQTRcJwn2G4Gosc\"",
    "mtime": "2023-07-28T13:25:27.501Z",
    "size": 535,
    "path": "../public/_nuxt/news.553c49bb.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-28T13:25:26.530Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.536a3399.js": {
    "type": "application/javascript",
    "etag": "\"10a-bKEPEZ0Ej5KD0MATdkkL+zlObnc\"",
    "mtime": "2023-07-28T13:25:26.529Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.536a3399.js"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-07-28T13:25:26.529Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-07-28T13:25:27.515Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-07-28T13:25:27.505Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/orders.cf6a455c.js": {
    "type": "application/javascript",
    "etag": "\"2671-yEyW7KZXbquRJPElIRV8BHHfvis\"",
    "mtime": "2023-07-28T13:25:26.528Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.cf6a455c.js"
  },
  "/_nuxt/orders.cf6a455c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"ba9-l98iCbZweb2PNGMp3CSl20fcKdI\"",
    "mtime": "2023-07-28T13:25:27.526Z",
    "size": 2985,
    "path": "../public/_nuxt/orders.cf6a455c.js.br"
  },
  "/_nuxt/orders.cf6a455c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dab-g86Zb2VUOBB8oj4YZfcgbM2v+CY\"",
    "mtime": "2023-07-28T13:25:27.515Z",
    "size": 3499,
    "path": "../public/_nuxt/orders.cf6a455c.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-28T13:25:26.527Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.6e79beb0.js": {
    "type": "application/javascript",
    "etag": "\"1688-TYLdNQ12Gf4WjA22f4QyheueZtk\"",
    "mtime": "2023-07-28T13:25:26.525Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.6e79beb0.js"
  },
  "/_nuxt/profile.6e79beb0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"837-jgJUi8KSH6COwpzmRNmusynuS4M\"",
    "mtime": "2023-07-28T13:25:27.534Z",
    "size": 2103,
    "path": "../public/_nuxt/profile.6e79beb0.js.br"
  },
  "/_nuxt/profile.6e79beb0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99d-fv2lxDC1eoxgsXVzYRPcn+Z1aL0\"",
    "mtime": "2023-07-28T13:25:27.527Z",
    "size": 2461,
    "path": "../public/_nuxt/profile.6e79beb0.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-07-28T13:25:26.525Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-07-28T13:25:27.569Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-07-28T13:25:27.535Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-28T13:25:26.523Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-28T13:25:27.573Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-28T13:25:27.570Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.fc2968fe.js": {
    "type": "application/javascript",
    "etag": "\"111b-Vg9oWXY2u+CGk0/kMMtg68grOG8\"",
    "mtime": "2023-07-28T13:25:26.522Z",
    "size": 4379,
    "path": "../public/_nuxt/register.fc2968fe.js"
  },
  "/_nuxt/register.fc2968fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56c-NItYebJq+9tD7zAWt1k60oWPvSk\"",
    "mtime": "2023-07-28T13:25:27.579Z",
    "size": 1388,
    "path": "../public/_nuxt/register.fc2968fe.js.br"
  },
  "/_nuxt/register.fc2968fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68d-5FJqCydTDOvWd2iwbNEBI4//73A\"",
    "mtime": "2023-07-28T13:25:27.574Z",
    "size": 1677,
    "path": "../public/_nuxt/register.fc2968fe.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-28T13:25:26.521Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-28T13:25:26.521Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-28T13:25:27.583Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-28T13:25:27.580Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-28T13:25:26.520Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-28T13:25:26.516Z",
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
