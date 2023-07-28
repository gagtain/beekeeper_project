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
    "mtime": "2023-07-27T16:42:30.519Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-27T16:42:30.510Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-07-27T16:42:30.508Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.70463914.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-zPv+yNQRgSiyRq30xV+2TpZ28YA\"",
    "mtime": "2023-07-27T16:42:30.507Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.70463914.css"
  },
  "/_nuxt/BasketInfo.70463914.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-n8Pf6m13vKTG2FGvHcJqAyS/wG8\"",
    "mtime": "2023-07-27T16:42:30.567Z",
    "size": 1771,
    "path": "../public/_nuxt/BasketInfo.70463914.css.br"
  },
  "/_nuxt/BasketInfo.70463914.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-h3heeYHzj3jVC5Sp12i+VO9vLMk\"",
    "mtime": "2023-07-27T16:42:30.524Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.70463914.css.gz"
  },
  "/_nuxt/BasketInfo.d3df094b.js": {
    "type": "application/javascript",
    "etag": "\"95e-zlKmlr06Z1xsVp5WQDJWmNZammA\"",
    "mtime": "2023-07-27T16:42:30.506Z",
    "size": 2398,
    "path": "../public/_nuxt/BasketInfo.d3df094b.js"
  },
  "/_nuxt/BasketInfo.d3df094b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d8-cyivpMlXqSv3r2+qc9dDRE3LxSI\"",
    "mtime": "2023-07-27T16:42:30.575Z",
    "size": 984,
    "path": "../public/_nuxt/BasketInfo.d3df094b.js.br"
  },
  "/_nuxt/BasketInfo.d3df094b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49a-z99wGGFSCZ3OL2Lipoe4toEZwz0\"",
    "mtime": "2023-07-27T16:42:30.570Z",
    "size": 1178,
    "path": "../public/_nuxt/BasketInfo.d3df094b.js.gz"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e93-G3xI4VCnp/o1PJ6X8jCePAboJ84\"",
    "mtime": "2023-07-27T16:42:30.505Z",
    "size": 7827,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b8-fo8PX5NfK5pkMKGxQThnf58E9Jk\"",
    "mtime": "2023-07-27T16:42:30.589Z",
    "size": 1720,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.br"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ce-exicXpkBf+OSryzPSXTK9KyUmWY\"",
    "mtime": "2023-07-27T16:42:30.577Z",
    "size": 1998,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.gz"
  },
  "/_nuxt/CatalogProduct.d67e9bfe.js": {
    "type": "application/javascript",
    "etag": "\"e3e-v0bzOtOe/ToN5H06FQGOWieZgMU\"",
    "mtime": "2023-07-27T16:42:30.505Z",
    "size": 3646,
    "path": "../public/_nuxt/CatalogProduct.d67e9bfe.js"
  },
  "/_nuxt/CatalogProduct.d67e9bfe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"570-dZF+DQ9IvcKYWypYL6Q2blWEJ8s\"",
    "mtime": "2023-07-27T16:42:30.597Z",
    "size": 1392,
    "path": "../public/_nuxt/CatalogProduct.d67e9bfe.js.br"
  },
  "/_nuxt/CatalogProduct.d67e9bfe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"630-RwQFTpAPmJdM+F4FeE9ezbN1+tE\"",
    "mtime": "2023-07-27T16:42:30.590Z",
    "size": 1584,
    "path": "../public/_nuxt/CatalogProduct.d67e9bfe.js.gz"
  },
  "/_nuxt/FavoriteComp.0ddecba1.js": {
    "type": "application/javascript",
    "etag": "\"783-1Z1c8tyXxlkyvcCkbYuCHwa/eRE\"",
    "mtime": "2023-07-27T16:42:30.504Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.0ddecba1.js"
  },
  "/_nuxt/FavoriteComp.0ddecba1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28e-hlegVYhis5jqlvUofK0+wZQjWMw\"",
    "mtime": "2023-07-27T16:42:30.603Z",
    "size": 654,
    "path": "../public/_nuxt/FavoriteComp.0ddecba1.js.br"
  },
  "/_nuxt/FavoriteComp.0ddecba1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f9-Q/+m7nIu7rpRUWSuMe6ZLhDgQW4\"",
    "mtime": "2023-07-27T16:42:30.599Z",
    "size": 761,
    "path": "../public/_nuxt/FavoriteComp.0ddecba1.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-07-27T16:42:30.503Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-07-27T16:42:30.622Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-07-27T16:42:30.605Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.f2e31087.js": {
    "type": "application/javascript",
    "etag": "\"b70-sxQiXHcCDd0X/qjEqQqZcoGoFcc\"",
    "mtime": "2023-07-27T16:42:30.502Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.f2e31087.js"
  },
  "/_nuxt/FavoriteComp.f2e31087.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"381-SjAA3Dn+dSJE0u2rwxjH6s5DORE\"",
    "mtime": "2023-07-27T16:42:30.628Z",
    "size": 897,
    "path": "../public/_nuxt/FavoriteComp.f2e31087.js.br"
  },
  "/_nuxt/FavoriteComp.f2e31087.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40b-XZvj82GM2AEpEtzgmSA4pIGPNtM\"",
    "mtime": "2023-07-27T16:42:30.623Z",
    "size": 1035,
    "path": "../public/_nuxt/FavoriteComp.f2e31087.js.gz"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1075-+RyDT2IQ2kPAAeedkmauBBTojb4\"",
    "mtime": "2023-07-27T16:42:30.502Z",
    "size": 4213,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bf-JW4WSiPepHevCg4JEO5/wP+oJBc\"",
    "mtime": "2023-07-27T16:42:30.633Z",
    "size": 959,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.br"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"489-HKAlc4bFKl4JU8yY+X+vzpaRT78\"",
    "mtime": "2023-07-27T16:42:30.628Z",
    "size": 1161,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.gz"
  },
  "/_nuxt/ImageForm.b652a9ef.js": {
    "type": "application/javascript",
    "etag": "\"225-PgNV0ENlJJ7rOtzoUGxFCUBgGkM\"",
    "mtime": "2023-07-27T16:42:30.500Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.b652a9ef.js"
  },
  "/_nuxt/LoadingComp.3e0fcc6d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-YDcpQ6Lf1nOyueDLwNiRZr5gN+w\"",
    "mtime": "2023-07-27T16:42:30.499Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.3e0fcc6d.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-27T16:42:30.499Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.49c5d9e2.js": {
    "type": "application/javascript",
    "etag": "\"43e-ACEswfHEma/S9E1kaGBDSKUgaws\"",
    "mtime": "2023-07-27T16:42:30.498Z",
    "size": 1086,
    "path": "../public/_nuxt/OrderProductList.49c5d9e2.js"
  },
  "/_nuxt/OrderProductList.49c5d9e2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-PUA6xCUD7WZypNZ8OTJIJ67eTlg\"",
    "mtime": "2023-07-27T16:42:30.636Z",
    "size": 520,
    "path": "../public/_nuxt/OrderProductList.49c5d9e2.js.br"
  },
  "/_nuxt/OrderProductList.49c5d9e2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"240-LJiTnAMY/ixBw7pN7NiGwleX2/0\"",
    "mtime": "2023-07-27T16:42:30.634Z",
    "size": 576,
    "path": "../public/_nuxt/OrderProductList.49c5d9e2.js.gz"
  },
  "/_nuxt/OrderProductList.6e291755.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-kGe7K192U1JYkwgh+N3+8GkaUOw\"",
    "mtime": "2023-07-27T16:42:30.497Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.6e291755.css"
  },
  "/_nuxt/OrderProductList.6e291755.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-tvuxaPNE1HA4DzysCe2QnLSdC1E\"",
    "mtime": "2023-07-27T16:42:30.639Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.br"
  },
  "/_nuxt/OrderProductList.6e291755.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-LbyXo24uolM39yqPdCpOhJF08BU\"",
    "mtime": "2023-07-27T16:42:30.637Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.gz"
  },
  "/_nuxt/UserBasket.71156e9e.js": {
    "type": "application/javascript",
    "etag": "\"13e2-er1sHlrxi0499TkVzGOkT51Saik\"",
    "mtime": "2023-07-27T16:42:30.496Z",
    "size": 5090,
    "path": "../public/_nuxt/UserBasket.71156e9e.js"
  },
  "/_nuxt/UserBasket.71156e9e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"778-RxZjlEFw/6BMIgfFOKg4Pnzanjs\"",
    "mtime": "2023-07-27T16:42:30.646Z",
    "size": 1912,
    "path": "../public/_nuxt/UserBasket.71156e9e.js.br"
  },
  "/_nuxt/UserBasket.71156e9e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88c-Ne9PC3NGX1YIQYtl7LpCydTxIlE\"",
    "mtime": "2023-07-27T16:42:30.639Z",
    "size": 2188,
    "path": "../public/_nuxt/UserBasket.71156e9e.js.gz"
  },
  "/_nuxt/UserBasket.74525ff3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-GktDk3Ud/dCJKFz3gOEcHMboClE\"",
    "mtime": "2023-07-27T16:42:30.495Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.74525ff3.css"
  },
  "/_nuxt/UserBasket.74525ff3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a2-vEscIRE7Ii74jC5guhiaXQXYCSg\"",
    "mtime": "2023-07-27T16:42:30.663Z",
    "size": 1698,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.br"
  },
  "/_nuxt/UserBasket.74525ff3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-coTaaCik2Gh4ZeF6NzmWRzcvtgc\"",
    "mtime": "2023-07-27T16:42:30.647Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.gz"
  },
  "/_nuxt/_id_.6c97fab4.js": {
    "type": "application/javascript",
    "etag": "\"135b-Q6pDSBnHwsz2e8kSRJtao5N9Eqs\"",
    "mtime": "2023-07-27T16:42:30.494Z",
    "size": 4955,
    "path": "../public/_nuxt/_id_.6c97fab4.js"
  },
  "/_nuxt/_id_.6c97fab4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"7a2-tV/B1tLYPMj/6SBju1Wxy/+ensw\"",
    "mtime": "2023-07-27T16:42:30.670Z",
    "size": 1954,
    "path": "../public/_nuxt/_id_.6c97fab4.js.br"
  },
  "/_nuxt/_id_.6c97fab4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88c-kqPwvQ2PZXx+LDzsYMB9Q0D+ZP0\"",
    "mtime": "2023-07-27T16:42:30.664Z",
    "size": 2188,
    "path": "../public/_nuxt/_id_.6c97fab4.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-27T16:42:30.493Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.979e8500.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-ZSQymBUeZM4aYKucSaWpk67lzTg\"",
    "mtime": "2023-07-27T16:42:30.493Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.979e8500.css"
  },
  "/_nuxt/_id_.979e8500.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8KZGT0unAXpGxmvwnDrhxlGxhGQ\"",
    "mtime": "2023-07-27T16:42:30.684Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.979e8500.css.br"
  },
  "/_nuxt/_id_.979e8500.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"685-wxGzSLQku1+oQBLsK97I+i/DFUE\"",
    "mtime": "2023-07-27T16:42:30.670Z",
    "size": 1669,
    "path": "../public/_nuxt/_id_.979e8500.css.gz"
  },
  "/_nuxt/_id_.a36d5605.js": {
    "type": "application/javascript",
    "etag": "\"4be-eLVG4m0VYR3YD00wjd3OCTLb/Sg\"",
    "mtime": "2023-07-27T16:42:30.492Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.a36d5605.js"
  },
  "/_nuxt/_id_.a36d5605.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-BApaLRBMj7+lZdTUtpxNi3CcfK8\"",
    "mtime": "2023-07-27T16:42:30.687Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.a36d5605.js.br"
  },
  "/_nuxt/_id_.a36d5605.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dc-K4SV3u+jrBZB0D0waPdcZMySvp0\"",
    "mtime": "2023-07-27T16:42:30.685Z",
    "size": 732,
    "path": "../public/_nuxt/_id_.a36d5605.js.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-27T16:42:30.492Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-27T16:42:30.695Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-27T16:42:30.688Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.96dbe36e.js": {
    "type": "application/javascript",
    "etag": "\"26e-J37fO4H67g40U5Cf+2VzzvfoLxM\"",
    "mtime": "2023-07-27T16:42:30.491Z",
    "size": 622,
    "path": "../public/_nuxt/basket.96dbe36e.js"
  },
  "/_nuxt/catalog.c31eb1d9.js": {
    "type": "application/javascript",
    "etag": "\"1c63-JccPW94NpC8dg2vARjWuY2A8FKY\"",
    "mtime": "2023-07-27T16:42:30.490Z",
    "size": 7267,
    "path": "../public/_nuxt/catalog.c31eb1d9.js"
  },
  "/_nuxt/catalog.c31eb1d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"97b-/eSr00xJoNWfi0sbVV/WbREbNHs\"",
    "mtime": "2023-07-27T16:42:30.704Z",
    "size": 2427,
    "path": "../public/_nuxt/catalog.c31eb1d9.js.br"
  },
  "/_nuxt/catalog.c31eb1d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"ae8-ZAN1gFN+sW0idG7HYWDofM0WhpY\"",
    "mtime": "2023-07-27T16:42:30.696Z",
    "size": 2792,
    "path": "../public/_nuxt/catalog.c31eb1d9.js.gz"
  },
  "/_nuxt/catalog.d04bdf4f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1da3-/kOuZGqzTo7qp9TwfRfzspuWXFA\"",
    "mtime": "2023-07-27T16:42:30.490Z",
    "size": 7587,
    "path": "../public/_nuxt/catalog.d04bdf4f.css"
  },
  "/_nuxt/catalog.d04bdf4f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c5-KSqut9Z0GijBQiu4QeFopzSmexg\"",
    "mtime": "2023-07-27T16:42:30.712Z",
    "size": 1733,
    "path": "../public/_nuxt/catalog.d04bdf4f.css.br"
  },
  "/_nuxt/catalog.d04bdf4f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7dd-iddv4g1iTSDrfbjvcw4Yc73QmtY\"",
    "mtime": "2023-07-27T16:42:30.704Z",
    "size": 2013,
    "path": "../public/_nuxt/catalog.d04bdf4f.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-27T16:42:30.489Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.df0e97ce.js": {
    "type": "application/javascript",
    "etag": "\"147c2-7rIFlLb4oTPMDRLfhZg/otPzVo8\"",
    "mtime": "2023-07-27T16:42:30.488Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.df0e97ce.js"
  },
  "/_nuxt/checkout.df0e97ce.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50b7-PoJ+FzkhD+mrYbWBcjj3giV+Y2Q\"",
    "mtime": "2023-07-27T16:42:30.804Z",
    "size": 20663,
    "path": "../public/_nuxt/checkout.df0e97ce.js.br"
  },
  "/_nuxt/checkout.df0e97ce.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e02-jSP16UX1Sm0en7yiAVy29Mx3AdY\"",
    "mtime": "2023-07-27T16:42:30.715Z",
    "size": 24066,
    "path": "../public/_nuxt/checkout.df0e97ce.js.gz"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-27T16:42:30.487Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-27T16:42:30.916Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-27T16:42:30.807Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-27T16:42:30.486Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.4e9bea75.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"249e-7iHU3PloHkXzOHB1XpweEcPyWgA\"",
    "mtime": "2023-07-27T16:42:30.485Z",
    "size": 9374,
    "path": "../public/_nuxt/entry.4e9bea75.css"
  },
  "/_nuxt/entry.4e9bea75.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"909-SMV70JX5U2cW0mB14iqbNkXxN7Y\"",
    "mtime": "2023-07-27T16:42:30.927Z",
    "size": 2313,
    "path": "../public/_nuxt/entry.4e9bea75.css.br"
  },
  "/_nuxt/entry.4e9bea75.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a6a-0RP553Yy08Qm9hZd8iT/BxQKJ9o\"",
    "mtime": "2023-07-27T16:42:30.917Z",
    "size": 2666,
    "path": "../public/_nuxt/entry.4e9bea75.css.gz"
  },
  "/_nuxt/entry.5fdd7a92.js": {
    "type": "application/javascript",
    "etag": "\"341c5-QZtzmL6Nv0jcODFdU4kC/xfRvm4\"",
    "mtime": "2023-07-27T16:42:30.484Z",
    "size": 213445,
    "path": "../public/_nuxt/entry.5fdd7a92.js"
  },
  "/_nuxt/entry.5fdd7a92.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1171e-xBnXIk2oQGP9tdTbZgm6AIu67Pg\"",
    "mtime": "2023-07-27T16:42:31.257Z",
    "size": 71454,
    "path": "../public/_nuxt/entry.5fdd7a92.js.br"
  },
  "/_nuxt/entry.5fdd7a92.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13902-aVzSJBsA7I53cQG8Myodk4Y55mM\"",
    "mtime": "2023-07-27T16:42:30.935Z",
    "size": 80130,
    "path": "../public/_nuxt/entry.5fdd7a92.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-27T16:42:30.483Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-27T16:42:31.262Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-27T16:42:31.257Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.85471462.js": {
    "type": "application/javascript",
    "etag": "\"8a4-f2Dn8UteKwiZYqlNAK20jLFlICg\"",
    "mtime": "2023-07-27T16:42:30.482Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.85471462.js"
  },
  "/_nuxt/error-404.85471462.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-f03maGHqNpsIoA8bRdpDtPrpvuA\"",
    "mtime": "2023-07-27T16:42:31.265Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.85471462.js.br"
  },
  "/_nuxt/error-404.85471462.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-03ONOhKgcyprAApLUWymzo9oM/4\"",
    "mtime": "2023-07-27T16:42:31.262Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.85471462.js.gz"
  },
  "/_nuxt/error-500.3f429a61.js": {
    "type": "application/javascript",
    "etag": "\"757-Hp5uDr2vTSPv1q+R6NG0F7kHPoE\"",
    "mtime": "2023-07-27T16:42:30.482Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.3f429a61.js"
  },
  "/_nuxt/error-500.3f429a61.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34e-4KtDZAzivv/z2hkvx5SqHhmOsyI\"",
    "mtime": "2023-07-27T16:42:31.269Z",
    "size": 846,
    "path": "../public/_nuxt/error-500.3f429a61.js.br"
  },
  "/_nuxt/error-500.3f429a61.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-hKJri21tS8HtLFrABCoAomrNKWA\"",
    "mtime": "2023-07-27T16:42:31.266Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.3f429a61.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-27T16:42:30.481Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-27T16:42:31.272Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-27T16:42:31.270Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.8c2f6b58.js": {
    "type": "application/javascript",
    "etag": "\"45e-1PE8rFj8L9UYXpLd1DlyBEipDsg\"",
    "mtime": "2023-07-27T16:42:30.480Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.8c2f6b58.js"
  },
  "/_nuxt/error-component.8c2f6b58.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-kLvmgWJmXlyh+t8OaLcIgPTOkgk\"",
    "mtime": "2023-07-27T16:42:31.275Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.8c2f6b58.js.br"
  },
  "/_nuxt/error-component.8c2f6b58.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-L1cYEQ0+TPSDDJGKORpfOVIcBFI\"",
    "mtime": "2023-07-27T16:42:31.273Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.8c2f6b58.js.gz"
  },
  "/_nuxt/favorite.35b03e02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-TdwA+Lp1YcFEqpovyPoJuLI5Xto\"",
    "mtime": "2023-07-27T16:42:30.480Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.35b03e02.css"
  },
  "/_nuxt/favorite.35b03e02.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-PyzoVM3jh9aCuAWa5MNu0d3bKFA\"",
    "mtime": "2023-07-27T16:42:31.282Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.35b03e02.css.br"
  },
  "/_nuxt/favorite.35b03e02.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-DgD1qExPmPpf7Y+V1nzmNqM97pk\"",
    "mtime": "2023-07-27T16:42:31.275Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.35b03e02.css.gz"
  },
  "/_nuxt/favorite.3bed68ce.js": {
    "type": "application/javascript",
    "etag": "\"9f6-1SQvgxPiMS6S664FbKThLaeaIq8\"",
    "mtime": "2023-07-27T16:42:30.479Z",
    "size": 2550,
    "path": "../public/_nuxt/favorite.3bed68ce.js"
  },
  "/_nuxt/favorite.3bed68ce.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"442-pvm6wIAez4I1FIIeQe67RTFjhqU\"",
    "mtime": "2023-07-27T16:42:31.286Z",
    "size": 1090,
    "path": "../public/_nuxt/favorite.3bed68ce.js.br"
  },
  "/_nuxt/favorite.3bed68ce.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4e3-G5k+z0bnqJVE8XmopqAu15QLkvA\"",
    "mtime": "2023-07-27T16:42:31.283Z",
    "size": 1251,
    "path": "../public/_nuxt/favorite.3bed68ce.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-07-27T16:42:30.478Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-27T16:42:30.477Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.1cea7ca5.js": {
    "type": "application/javascript",
    "etag": "\"3abf-HyhzK10p7TceqHOZ4mGTMgkge0w\"",
    "mtime": "2023-07-27T16:42:30.476Z",
    "size": 15039,
    "path": "../public/_nuxt/index.1cea7ca5.js"
  },
  "/_nuxt/index.1cea7ca5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f3-eCR5MmKGZZB9twbSBOzCYEsxBNo\"",
    "mtime": "2023-07-27T16:42:31.303Z",
    "size": 4851,
    "path": "../public/_nuxt/index.1cea7ca5.js.br"
  },
  "/_nuxt/index.1cea7ca5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-ERLpPXzQpNpbW+7YaxPg6wP0i/U\"",
    "mtime": "2023-07-27T16:42:31.288Z",
    "size": 5361,
    "path": "../public/_nuxt/index.1cea7ca5.js.gz"
  },
  "/_nuxt/index.63c5e18e.js": {
    "type": "application/javascript",
    "etag": "\"5a0-o/2ECZ8hWDQdcHT6afPTxmcdEdc\"",
    "mtime": "2023-07-27T16:42:30.475Z",
    "size": 1440,
    "path": "../public/_nuxt/index.63c5e18e.js"
  },
  "/_nuxt/index.63c5e18e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2da-NIfrJCvUOTL8t4on3cjcy9DZA9A\"",
    "mtime": "2023-07-27T16:42:31.306Z",
    "size": 730,
    "path": "../public/_nuxt/index.63c5e18e.js.br"
  },
  "/_nuxt/index.63c5e18e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"348-L/Ras+SmGl9D4D91Sc44MBYnxtA\"",
    "mtime": "2023-07-27T16:42:31.304Z",
    "size": 840,
    "path": "../public/_nuxt/index.63c5e18e.js.gz"
  },
  "/_nuxt/index.79147c6a.js": {
    "type": "application/javascript",
    "etag": "\"16a34-REGWU6X1otE9nQUMTWDbYCnoPmQ\"",
    "mtime": "2023-07-27T16:42:30.475Z",
    "size": 92724,
    "path": "../public/_nuxt/index.79147c6a.js"
  },
  "/_nuxt/index.79147c6a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62e1-DkYhQBIMLP6fHQkl2rQCTocroig\"",
    "mtime": "2023-07-27T16:42:31.414Z",
    "size": 25313,
    "path": "../public/_nuxt/index.79147c6a.js.br"
  },
  "/_nuxt/index.79147c6a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f74-+z5pCjiZDoPt6TycRqsC0APv8ts\"",
    "mtime": "2023-07-27T16:42:31.310Z",
    "size": 28532,
    "path": "../public/_nuxt/index.79147c6a.js.gz"
  },
  "/_nuxt/index.cbdafc32.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-Oie/RaCJVCWMrr1e8vvhLcrY4Bk\"",
    "mtime": "2023-07-27T16:42:30.473Z",
    "size": 22587,
    "path": "../public/_nuxt/index.cbdafc32.css"
  },
  "/_nuxt/index.cbdafc32.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127b-YZmZg4aOPR0XJ/C5KRuDlZ5nYg8\"",
    "mtime": "2023-07-27T16:42:31.440Z",
    "size": 4731,
    "path": "../public/_nuxt/index.cbdafc32.css.br"
  },
  "/_nuxt/index.cbdafc32.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-IQikMBDJcQDMumEslo1kpG8ZKxM\"",
    "mtime": "2023-07-27T16:42:31.415Z",
    "size": 5602,
    "path": "../public/_nuxt/index.cbdafc32.css.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-27T16:42:30.473Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-27T16:42:31.444Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-27T16:42:31.441Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/isAuth.d094a161.js": {
    "type": "application/javascript",
    "etag": "\"213-UaDX18nZLOskpAA7GxB3EpZX0lU\"",
    "mtime": "2023-07-27T16:42:30.472Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.d094a161.js"
  },
  "/_nuxt/login.09bf73b3.js": {
    "type": "application/javascript",
    "etag": "\"830-cOd69bXKblmAv2cSJGywyovTL+8\"",
    "mtime": "2023-07-27T16:42:30.471Z",
    "size": 2096,
    "path": "../public/_nuxt/login.09bf73b3.js"
  },
  "/_nuxt/login.09bf73b3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e7-Q2RsGgkkyirhAIWrrnNZy353ZPM\"",
    "mtime": "2023-07-27T16:42:31.448Z",
    "size": 999,
    "path": "../public/_nuxt/login.09bf73b3.js.br"
  },
  "/_nuxt/login.09bf73b3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a9-AcY9elGh5AJFx/tMK1aVkz3Y94w\"",
    "mtime": "2023-07-27T16:42:31.445Z",
    "size": 1193,
    "path": "../public/_nuxt/login.09bf73b3.js.gz"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-27T16:42:30.470Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-27T16:42:31.452Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-27T16:42:31.449Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-27T16:42:30.469Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.5d72d238.js": {
    "type": "application/javascript",
    "etag": "\"4af-3z8Kibpz0JSZYm8B1E475GkmwaM\"",
    "mtime": "2023-07-27T16:42:30.467Z",
    "size": 1199,
    "path": "../public/_nuxt/news.5d72d238.js"
  },
  "/_nuxt/news.5d72d238.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a9-SX31L9qwuLgQ/1kDk6Lg0HbXmKM\"",
    "mtime": "2023-07-27T16:42:31.455Z",
    "size": 425,
    "path": "../public/_nuxt/news.5d72d238.js.br"
  },
  "/_nuxt/news.5d72d238.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-sOh+fFzGs6C4vQB5NHcGvju2v1E\"",
    "mtime": "2023-07-27T16:42:31.453Z",
    "size": 535,
    "path": "../public/_nuxt/news.5d72d238.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-27T16:42:30.466Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.9cc2ecbb.js": {
    "type": "application/javascript",
    "etag": "\"10a-IEYoCo2OyoxYDMuD1UnrX0+Bvj0\"",
    "mtime": "2023-07-27T16:42:30.465Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.9cc2ecbb.js"
  },
  "/_nuxt/orders.061707a1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-qg2Y/h9LQDmDGQWSdZClaK2gceU\"",
    "mtime": "2023-07-27T16:42:30.463Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.061707a1.css"
  },
  "/_nuxt/orders.061707a1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"794-++iYqZVj4v+fHjRfHLUbFLz6cw8\"",
    "mtime": "2023-07-27T16:42:31.466Z",
    "size": 1940,
    "path": "../public/_nuxt/orders.061707a1.css.br"
  },
  "/_nuxt/orders.061707a1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-hemarn6s8stwoQlt2FUB2n8JRGI\"",
    "mtime": "2023-07-27T16:42:31.456Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.061707a1.css.gz"
  },
  "/_nuxt/orders.38789eee.js": {
    "type": "application/javascript",
    "etag": "\"2653-o8eDApyan2SaPOwaUR36SEnoCGE\"",
    "mtime": "2023-07-27T16:42:30.462Z",
    "size": 9811,
    "path": "../public/_nuxt/orders.38789eee.js"
  },
  "/_nuxt/orders.38789eee.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b9b-Z/gnb9kUge3ye8axVLc8G1pDefw\"",
    "mtime": "2023-07-27T16:42:31.477Z",
    "size": 2971,
    "path": "../public/_nuxt/orders.38789eee.js.br"
  },
  "/_nuxt/orders.38789eee.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"d9f-KPsy5bMZohYvrKIn1KsYDRFUu5w\"",
    "mtime": "2023-07-27T16:42:31.467Z",
    "size": 3487,
    "path": "../public/_nuxt/orders.38789eee.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-27T16:42:30.460Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.299eefd1.js": {
    "type": "application/javascript",
    "etag": "\"1688-91QqZ/w/+TXzFRX/fbe+3RG7LO4\"",
    "mtime": "2023-07-27T16:42:30.459Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.299eefd1.js"
  },
  "/_nuxt/profile.299eefd1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83b-ACEeLB9KjrgZPr0Xwkcjjc42Tsc\"",
    "mtime": "2023-07-27T16:42:31.485Z",
    "size": 2107,
    "path": "../public/_nuxt/profile.299eefd1.js.br"
  },
  "/_nuxt/profile.299eefd1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99d-XxtLju6UHZHF5kCiSJv80+b9hys\"",
    "mtime": "2023-07-27T16:42:31.478Z",
    "size": 2461,
    "path": "../public/_nuxt/profile.299eefd1.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-07-27T16:42:30.458Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-07-27T16:42:31.519Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-07-27T16:42:31.486Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-27T16:42:30.458Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-27T16:42:31.523Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-27T16:42:31.520Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.f3d583f7.js": {
    "type": "application/javascript",
    "etag": "\"111b-IKySHHA4hHqWsB2U8bqdmzaaXDQ\"",
    "mtime": "2023-07-27T16:42:30.457Z",
    "size": 4379,
    "path": "../public/_nuxt/register.f3d583f7.js"
  },
  "/_nuxt/register.f3d583f7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56d-XmzyB34i1e+qQX6lp3Xb2kgfkYA\"",
    "mtime": "2023-07-27T16:42:31.529Z",
    "size": 1389,
    "path": "../public/_nuxt/register.f3d583f7.js.br"
  },
  "/_nuxt/register.f3d583f7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68c-rMvtQxf7lXHVWiVFM+6xizoINWE\"",
    "mtime": "2023-07-27T16:42:31.524Z",
    "size": 1676,
    "path": "../public/_nuxt/register.f3d583f7.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-27T16:42:30.457Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-27T16:42:30.456Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-27T16:42:31.533Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-27T16:42:31.530Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-27T16:42:30.456Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-27T16:42:30.454Z",
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
