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
    "mtime": "2023-08-05T14:26:40.892Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-05T14:26:40.890Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-05T14:26:40.888Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.70463914.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-zPv+yNQRgSiyRq30xV+2TpZ28YA\"",
    "mtime": "2023-08-05T14:26:40.888Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.70463914.css"
  },
  "/_nuxt/BasketInfo.70463914.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-n8Pf6m13vKTG2FGvHcJqAyS/wG8\"",
    "mtime": "2023-08-05T14:26:40.928Z",
    "size": 1771,
    "path": "../public/_nuxt/BasketInfo.70463914.css.br"
  },
  "/_nuxt/BasketInfo.70463914.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-h3heeYHzj3jVC5Sp12i+VO9vLMk\"",
    "mtime": "2023-08-05T14:26:40.896Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.70463914.css.gz"
  },
  "/_nuxt/BasketInfo.a951091d.js": {
    "type": "application/javascript",
    "etag": "\"95e-PzKSjJnjoHvhEjqoqSu8W1lT+ZM\"",
    "mtime": "2023-08-05T14:26:40.887Z",
    "size": 2398,
    "path": "../public/_nuxt/BasketInfo.a951091d.js"
  },
  "/_nuxt/BasketInfo.a951091d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-Ijw9+FCg6LGcdBzO9d62AttWFGA\"",
    "mtime": "2023-08-05T14:26:40.932Z",
    "size": 985,
    "path": "../public/_nuxt/BasketInfo.a951091d.js.br"
  },
  "/_nuxt/BasketInfo.a951091d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"499-h5YJ9ymsW/djU/0xClilr9v8mFM\"",
    "mtime": "2023-08-05T14:26:40.929Z",
    "size": 1177,
    "path": "../public/_nuxt/BasketInfo.a951091d.js.gz"
  },
  "/_nuxt/CatalogProduct.283b1d3e.js": {
    "type": "application/javascript",
    "etag": "\"e3e-417P/n0LegjtG8SQnLiRnIbyIuM\"",
    "mtime": "2023-08-05T14:26:40.887Z",
    "size": 3646,
    "path": "../public/_nuxt/CatalogProduct.283b1d3e.js"
  },
  "/_nuxt/CatalogProduct.283b1d3e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"570-00WUd+cdsuJODg1xf1HUtNsxSIE\"",
    "mtime": "2023-08-05T14:26:40.938Z",
    "size": 1392,
    "path": "../public/_nuxt/CatalogProduct.283b1d3e.js.br"
  },
  "/_nuxt/CatalogProduct.283b1d3e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"631-WtQJFDyI9TBHWRbRWKPNXONOX1Y\"",
    "mtime": "2023-08-05T14:26:40.933Z",
    "size": 1585,
    "path": "../public/_nuxt/CatalogProduct.283b1d3e.js.gz"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e93-G3xI4VCnp/o1PJ6X8jCePAboJ84\"",
    "mtime": "2023-08-05T14:26:40.886Z",
    "size": 7827,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b8-fo8PX5NfK5pkMKGxQThnf58E9Jk\"",
    "mtime": "2023-08-05T14:26:40.947Z",
    "size": 1720,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.br"
  },
  "/_nuxt/CatalogProduct.a9212c9a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ce-exicXpkBf+OSryzPSXTK9KyUmWY\"",
    "mtime": "2023-08-05T14:26:40.939Z",
    "size": 1998,
    "path": "../public/_nuxt/CatalogProduct.a9212c9a.css.gz"
  },
  "/_nuxt/FavoriteComp.28e7473f.js": {
    "type": "application/javascript",
    "etag": "\"b70-8ZZelGl0O6zL1OETcB3VDcPCIMw\"",
    "mtime": "2023-08-05T14:26:40.886Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.28e7473f.js"
  },
  "/_nuxt/FavoriteComp.28e7473f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"380-8aBYpEb2SASsXfmy0rG3ygqS3CQ\"",
    "mtime": "2023-08-05T14:26:40.953Z",
    "size": 896,
    "path": "../public/_nuxt/FavoriteComp.28e7473f.js.br"
  },
  "/_nuxt/FavoriteComp.28e7473f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40b-1fCaHU68MG0ApMozhQDTdnbhsI4\"",
    "mtime": "2023-08-05T14:26:40.948Z",
    "size": 1035,
    "path": "../public/_nuxt/FavoriteComp.28e7473f.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-05T14:26:40.885Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-05T14:26:40.970Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-05T14:26:40.954Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.f237c323.js": {
    "type": "application/javascript",
    "etag": "\"783-gpiBetKFo/9pg4ECRlZlijDo52E\"",
    "mtime": "2023-08-05T14:26:40.885Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.f237c323.js"
  },
  "/_nuxt/FavoriteComp.f237c323.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28e-q/Ft4Im0OBdaU5ALKzVDLRFb+cs\"",
    "mtime": "2023-08-05T14:26:40.974Z",
    "size": 654,
    "path": "../public/_nuxt/FavoriteComp.f237c323.js.br"
  },
  "/_nuxt/FavoriteComp.f237c323.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-0hlGJRCKBUH9AI7zbF87RRMPYA0\"",
    "mtime": "2023-08-05T14:26:40.971Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.f237c323.js.gz"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1075-+RyDT2IQ2kPAAeedkmauBBTojb4\"",
    "mtime": "2023-08-05T14:26:40.884Z",
    "size": 4213,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bf-JW4WSiPepHevCg4JEO5/wP+oJBc\"",
    "mtime": "2023-08-05T14:26:40.979Z",
    "size": 959,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.br"
  },
  "/_nuxt/FavoriteComp.f8b4b8ec.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"489-HKAlc4bFKl4JU8yY+X+vzpaRT78\"",
    "mtime": "2023-08-05T14:26:40.975Z",
    "size": 1161,
    "path": "../public/_nuxt/FavoriteComp.f8b4b8ec.css.gz"
  },
  "/_nuxt/ImageForm.a29c2ed9.js": {
    "type": "application/javascript",
    "etag": "\"1ac-vp5mSIhshpBYIih0+4IZJh0Flqs\"",
    "mtime": "2023-08-05T14:26:40.884Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.a29c2ed9.js"
  },
  "/_nuxt/LoadingComp.4fca17fe.js": {
    "type": "application/javascript",
    "etag": "\"1fe-W4qBKmnoJr4ymX5k/xZiKQI5pWM\"",
    "mtime": "2023-08-05T14:26:40.883Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.4fca17fe.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-05T14:26:40.882Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.6e291755.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-kGe7K192U1JYkwgh+N3+8GkaUOw\"",
    "mtime": "2023-08-05T14:26:40.882Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.6e291755.css"
  },
  "/_nuxt/OrderProductList.6e291755.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-tvuxaPNE1HA4DzysCe2QnLSdC1E\"",
    "mtime": "2023-08-05T14:26:40.983Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.br"
  },
  "/_nuxt/OrderProductList.6e291755.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-LbyXo24uolM39yqPdCpOhJF08BU\"",
    "mtime": "2023-08-05T14:26:40.981Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.6e291755.css.gz"
  },
  "/_nuxt/OrderProductList.a6609744.js": {
    "type": "application/javascript",
    "etag": "\"43e-c2ktMgMedotTMbTh9aPLJ6L5W0w\"",
    "mtime": "2023-08-05T14:26:40.881Z",
    "size": 1086,
    "path": "../public/_nuxt/OrderProductList.a6609744.js"
  },
  "/_nuxt/OrderProductList.a6609744.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-OChkWFDO5B7bkjP7prNqw/dfVb8\"",
    "mtime": "2023-08-05T14:26:40.986Z",
    "size": 520,
    "path": "../public/_nuxt/OrderProductList.a6609744.js.br"
  },
  "/_nuxt/OrderProductList.a6609744.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"240-2GzetVBZhxSlj54EfjcqN7lA4kA\"",
    "mtime": "2023-08-05T14:26:40.983Z",
    "size": 576,
    "path": "../public/_nuxt/OrderProductList.a6609744.js.gz"
  },
  "/_nuxt/UserBasket.5870079c.js": {
    "type": "application/javascript",
    "etag": "\"13e2-mkzoZIqc42Z91C8iU+UUSDMo6UU\"",
    "mtime": "2023-08-05T14:26:40.881Z",
    "size": 5090,
    "path": "../public/_nuxt/UserBasket.5870079c.js"
  },
  "/_nuxt/UserBasket.5870079c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"77e-sF8RUL7vC8m/KMw4hjfUA6QE82s\"",
    "mtime": "2023-08-05T14:26:40.993Z",
    "size": 1918,
    "path": "../public/_nuxt/UserBasket.5870079c.js.br"
  },
  "/_nuxt/UserBasket.5870079c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88c-WaPp+o33q514/n0YmyA88uajOqg\"",
    "mtime": "2023-08-05T14:26:40.986Z",
    "size": 2188,
    "path": "../public/_nuxt/UserBasket.5870079c.js.gz"
  },
  "/_nuxt/UserBasket.74525ff3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-GktDk3Ud/dCJKFz3gOEcHMboClE\"",
    "mtime": "2023-08-05T14:26:40.880Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.74525ff3.css"
  },
  "/_nuxt/UserBasket.74525ff3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a2-vEscIRE7Ii74jC5guhiaXQXYCSg\"",
    "mtime": "2023-08-05T14:26:41.010Z",
    "size": 1698,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.br"
  },
  "/_nuxt/UserBasket.74525ff3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-coTaaCik2Gh4ZeF6NzmWRzcvtgc\"",
    "mtime": "2023-08-05T14:26:40.994Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.74525ff3.css.gz"
  },
  "/_nuxt/_id_.3862f79f.js": {
    "type": "application/javascript",
    "etag": "\"4be-zHABx5ltXsnOWQ3ph5aOmGEXxWw\"",
    "mtime": "2023-08-05T14:26:40.879Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.3862f79f.js"
  },
  "/_nuxt/_id_.3862f79f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-s3G6dwzo2Kn7oyxsTvoeLO/cQuM\"",
    "mtime": "2023-08-05T14:26:41.013Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.3862f79f.js.br"
  },
  "/_nuxt/_id_.3862f79f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dd-NpZD5iVgBcXfcDOXWquZwFjafdo\"",
    "mtime": "2023-08-05T14:26:41.011Z",
    "size": 733,
    "path": "../public/_nuxt/_id_.3862f79f.js.gz"
  },
  "/_nuxt/_id_.78962d12.js": {
    "type": "application/javascript",
    "etag": "\"135b-6qkovcmnl0wyIaIct21FaVCiEi8\"",
    "mtime": "2023-08-05T14:26:40.879Z",
    "size": 4955,
    "path": "../public/_nuxt/_id_.78962d12.js"
  },
  "/_nuxt/_id_.78962d12.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"79e-nVNZLmFP6Pile72aBgm6pijsXWQ\"",
    "mtime": "2023-08-05T14:26:41.019Z",
    "size": 1950,
    "path": "../public/_nuxt/_id_.78962d12.js.br"
  },
  "/_nuxt/_id_.78962d12.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88a-183vrbxeutfCQgZdQWhzCl94nNU\"",
    "mtime": "2023-08-05T14:26:41.014Z",
    "size": 2186,
    "path": "../public/_nuxt/_id_.78962d12.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-08-05T14:26:40.878Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.979e8500.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-ZSQymBUeZM4aYKucSaWpk67lzTg\"",
    "mtime": "2023-08-05T14:26:40.878Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.979e8500.css"
  },
  "/_nuxt/_id_.979e8500.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8KZGT0unAXpGxmvwnDrhxlGxhGQ\"",
    "mtime": "2023-08-05T14:26:41.035Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.979e8500.css.br"
  },
  "/_nuxt/_id_.979e8500.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"685-wxGzSLQku1+oQBLsK97I+i/DFUE\"",
    "mtime": "2023-08-05T14:26:41.020Z",
    "size": 1669,
    "path": "../public/_nuxt/_id_.979e8500.css.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-08-05T14:26:40.877Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-08-05T14:26:41.043Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-08-05T14:26:41.036Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.465f86e0.js": {
    "type": "application/javascript",
    "etag": "\"26e-G0nAPA7knGYGH87560HiusCTQ/0\"",
    "mtime": "2023-08-05T14:26:40.877Z",
    "size": 622,
    "path": "../public/_nuxt/basket.465f86e0.js"
  },
  "/_nuxt/catalog.a863ac69.js": {
    "type": "application/javascript",
    "etag": "\"1afb-PxN38qk6eOFaIvL3TyZKZJ4pll0\"",
    "mtime": "2023-08-05T14:26:40.876Z",
    "size": 6907,
    "path": "../public/_nuxt/catalog.a863ac69.js"
  },
  "/_nuxt/catalog.a863ac69.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"918-3qVzm29YBPGWeSr0VWSKwDIEU8U\"",
    "mtime": "2023-08-05T14:26:41.052Z",
    "size": 2328,
    "path": "../public/_nuxt/catalog.a863ac69.js.br"
  },
  "/_nuxt/catalog.a863ac69.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a76-fOXyTfnPr+75uI8yeHLH2On7igM\"",
    "mtime": "2023-08-05T14:26:41.044Z",
    "size": 2678,
    "path": "../public/_nuxt/catalog.a863ac69.js.gz"
  },
  "/_nuxt/catalog.c2e7c6d6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1da3-aCCxn+Zkv4BFljQHLLsTm04msLk\"",
    "mtime": "2023-08-05T14:26:40.876Z",
    "size": 7587,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css"
  },
  "/_nuxt/catalog.c2e7c6d6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c7-hrhJnFWPDdCo/GhFXaSRfJQYMSY\"",
    "mtime": "2023-08-05T14:26:41.061Z",
    "size": 1735,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css.br"
  },
  "/_nuxt/catalog.c2e7c6d6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7da-eR4r47V1m7xcnLakAWR1Sw/hGac\"",
    "mtime": "2023-08-05T14:26:41.053Z",
    "size": 2010,
    "path": "../public/_nuxt/catalog.c2e7c6d6.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-05T14:26:40.875Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.17cb7803.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-seC/x+j70WFJ5vaqn7kskkqvt2g\"",
    "mtime": "2023-08-05T14:26:40.875Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.17cb7803.css"
  },
  "/_nuxt/checkout.17cb7803.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fdc-/3nDOo514/3WQZxELo/UpKFgTW0\"",
    "mtime": "2023-08-05T14:26:41.172Z",
    "size": 20444,
    "path": "../public/_nuxt/checkout.17cb7803.css.br"
  },
  "/_nuxt/checkout.17cb7803.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-laGipaJGR9bzL61kvl5diSNdlaI\"",
    "mtime": "2023-08-05T14:26:41.064Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.17cb7803.css.gz"
  },
  "/_nuxt/checkout.29394608.js": {
    "type": "application/javascript",
    "etag": "\"14856-neDpKSRUbzMJgAJL9+Xwg0MzbOE\"",
    "mtime": "2023-08-05T14:26:40.873Z",
    "size": 84054,
    "path": "../public/_nuxt/checkout.29394608.js"
  },
  "/_nuxt/checkout.29394608.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5121-GMnfIxXo9uaRfHzE2JF+qbc6ty4\"",
    "mtime": "2023-08-05T14:26:41.269Z",
    "size": 20769,
    "path": "../public/_nuxt/checkout.29394608.js.br"
  },
  "/_nuxt/checkout.29394608.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e0a-DdppYwa7PkyvQ7gtXicO+yEXfU4\"",
    "mtime": "2023-08-05T14:26:41.175Z",
    "size": 24074,
    "path": "../public/_nuxt/checkout.29394608.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-05T14:26:40.872Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.84d871ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"253c-eJRPCfaLP6KP3M+AWvQFZNVb8vE\"",
    "mtime": "2023-08-05T14:26:40.871Z",
    "size": 9532,
    "path": "../public/_nuxt/entry.84d871ce.css"
  },
  "/_nuxt/entry.84d871ce.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"932-6XmAbb/W7Ojs+6y/r7ygDTLmqyc\"",
    "mtime": "2023-08-05T14:26:41.280Z",
    "size": 2354,
    "path": "../public/_nuxt/entry.84d871ce.css.br"
  },
  "/_nuxt/entry.84d871ce.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a9f-g0Tfr27lSqoyXQ1LJWc/iX1ypH8\"",
    "mtime": "2023-08-05T14:26:41.270Z",
    "size": 2719,
    "path": "../public/_nuxt/entry.84d871ce.css.gz"
  },
  "/_nuxt/entry.a2d6f503.js": {
    "type": "application/javascript",
    "etag": "\"345bd-h+klkGBOIalreH1GX92UCst1kyM\"",
    "mtime": "2023-08-05T14:26:40.871Z",
    "size": 214461,
    "path": "../public/_nuxt/entry.a2d6f503.js"
  },
  "/_nuxt/entry.a2d6f503.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"117ba-RIL+Cen4L27d/0vSVuKYokIvPQk\"",
    "mtime": "2023-08-05T14:26:41.664Z",
    "size": 71610,
    "path": "../public/_nuxt/entry.a2d6f503.js.br"
  },
  "/_nuxt/entry.a2d6f503.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13a5e-McVRYsIGtp70K4ckHpHSoPQA4Es\"",
    "mtime": "2023-08-05T14:26:41.291Z",
    "size": 80478,
    "path": "../public/_nuxt/entry.a2d6f503.js.gz"
  },
  "/_nuxt/error-404.091eabae.js": {
    "type": "application/javascript",
    "etag": "\"8a4-ZZW3MLj5YpHjbLnkh3K4DyyCAG8\"",
    "mtime": "2023-08-05T14:26:40.867Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.091eabae.js"
  },
  "/_nuxt/error-404.091eabae.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-hLjzE3AxXxo9YRMugEPbFJI3H4s\"",
    "mtime": "2023-08-05T14:26:41.669Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.091eabae.js.br"
  },
  "/_nuxt/error-404.091eabae.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-oKxQCtpHDvQyPMjsw5MPX1ctEXU\"",
    "mtime": "2023-08-05T14:26:41.665Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.091eabae.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-05T14:26:40.866Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-05T14:26:41.674Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-05T14:26:41.669Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-500.07c78ca8.js": {
    "type": "application/javascript",
    "etag": "\"757-c9L2j74azlYfDbTBuLtzu0xdrog\"",
    "mtime": "2023-08-05T14:26:40.866Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.07c78ca8.js"
  },
  "/_nuxt/error-500.07c78ca8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-bC+AslIV6vptX9AHDe1CQ2qwoIQ\"",
    "mtime": "2023-08-05T14:26:41.677Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.07c78ca8.js.br"
  },
  "/_nuxt/error-500.07c78ca8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-Bk+0UWm1EPD3VBJTxorgazSeYfU\"",
    "mtime": "2023-08-05T14:26:41.674Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.07c78ca8.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-05T14:26:40.865Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-05T14:26:41.681Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-05T14:26:41.678Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.9c6a2709.js": {
    "type": "application/javascript",
    "etag": "\"45e-9+XQQd+9TAYT7ZLco3vPL0j9QPA\"",
    "mtime": "2023-08-05T14:26:40.865Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.9c6a2709.js"
  },
  "/_nuxt/error-component.9c6a2709.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-WZQvUamOCmhD7Mx+UA2GmZ8r9J8\"",
    "mtime": "2023-08-05T14:26:41.683Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.9c6a2709.js.br"
  },
  "/_nuxt/error-component.9c6a2709.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-3NW2OwFhhCdFL/JKgbrV8FQz7F4\"",
    "mtime": "2023-08-05T14:26:41.681Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.9c6a2709.js.gz"
  },
  "/_nuxt/favorite.35b03e02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-TdwA+Lp1YcFEqpovyPoJuLI5Xto\"",
    "mtime": "2023-08-05T14:26:40.864Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.35b03e02.css"
  },
  "/_nuxt/favorite.35b03e02.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-PyzoVM3jh9aCuAWa5MNu0d3bKFA\"",
    "mtime": "2023-08-05T14:26:41.691Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.35b03e02.css.br"
  },
  "/_nuxt/favorite.35b03e02.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-DgD1qExPmPpf7Y+V1nzmNqM97pk\"",
    "mtime": "2023-08-05T14:26:41.684Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.35b03e02.css.gz"
  },
  "/_nuxt/favorite.55e783e0.js": {
    "type": "application/javascript",
    "etag": "\"9f6-+zi7X83KfdZ6MAFCxHwasA7lnUs\"",
    "mtime": "2023-08-05T14:26:40.863Z",
    "size": 2550,
    "path": "../public/_nuxt/favorite.55e783e0.js"
  },
  "/_nuxt/favorite.55e783e0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"432-zyCEnoTS2QfvBldaFlNo9YVLtGs\"",
    "mtime": "2023-08-05T14:26:41.696Z",
    "size": 1074,
    "path": "../public/_nuxt/favorite.55e783e0.js.br"
  },
  "/_nuxt/favorite.55e783e0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4e4-QaMJHd9r5OxwZfQpc5a63RwdD6Q\"",
    "mtime": "2023-08-05T14:26:41.692Z",
    "size": 1252,
    "path": "../public/_nuxt/favorite.55e783e0.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-05T14:26:40.862Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-05T14:26:40.862Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0520153b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"59a7-1O5qlG9CDp/HKUj9yxuNuCjTQw0\"",
    "mtime": "2023-08-05T14:26:40.861Z",
    "size": 22951,
    "path": "../public/_nuxt/index.0520153b.css"
  },
  "/_nuxt/index.0520153b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12c3-SQp3TNKo0T1guN8L0rMo5oxTcyc\"",
    "mtime": "2023-08-05T14:26:41.723Z",
    "size": 4803,
    "path": "../public/_nuxt/index.0520153b.css.br"
  },
  "/_nuxt/index.0520153b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1645-vAzNsLftKG1m8qPqHtQvxbic2qs\"",
    "mtime": "2023-08-05T14:26:41.697Z",
    "size": 5701,
    "path": "../public/_nuxt/index.0520153b.css.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-08-05T14:26:40.860Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-08-05T14:26:41.727Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-08-05T14:26:41.724Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.adfb40af.js": {
    "type": "application/javascript",
    "etag": "\"16fbf-5rc8O+xwZOUpAtd9k6nVDUDCfsg\"",
    "mtime": "2023-08-05T14:26:40.859Z",
    "size": 94143,
    "path": "../public/_nuxt/index.adfb40af.js"
  },
  "/_nuxt/index.adfb40af.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"64f8-weVb0PIpXm/ubYErlBuS1t1w+hM\"",
    "mtime": "2023-08-05T14:26:41.841Z",
    "size": 25848,
    "path": "../public/_nuxt/index.adfb40af.js.br"
  },
  "/_nuxt/index.adfb40af.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"727c-66YmZLjFSRkdispATL0VJ2JMqQk\"",
    "mtime": "2023-08-05T14:26:41.731Z",
    "size": 29308,
    "path": "../public/_nuxt/index.adfb40af.js.gz"
  },
  "/_nuxt/index.e38c94dc.js": {
    "type": "application/javascript",
    "etag": "\"3abf-cNKooxQDFsXHzZE7fyIO+8SzJwA\"",
    "mtime": "2023-08-05T14:26:40.858Z",
    "size": 15039,
    "path": "../public/_nuxt/index.e38c94dc.js"
  },
  "/_nuxt/index.e38c94dc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f4-Z1irnkETn9F0Tjm2vH3yb6fFdEk\"",
    "mtime": "2023-08-05T14:26:41.858Z",
    "size": 4852,
    "path": "../public/_nuxt/index.e38c94dc.js.br"
  },
  "/_nuxt/index.e38c94dc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-IuVB4paxYp4LKPa8xt3mLIPVEmk\"",
    "mtime": "2023-08-05T14:26:41.842Z",
    "size": 5361,
    "path": "../public/_nuxt/index.e38c94dc.js.gz"
  },
  "/_nuxt/index.f4f931e4.js": {
    "type": "application/javascript",
    "etag": "\"605-dBCAa1QJlTz5Aq7ECHOCapJUUFk\"",
    "mtime": "2023-08-05T14:26:40.857Z",
    "size": 1541,
    "path": "../public/_nuxt/index.f4f931e4.js"
  },
  "/_nuxt/index.f4f931e4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"306-HKi6BhJ1fYu8V2HkxqDyfeAdAnY\"",
    "mtime": "2023-08-05T14:26:41.862Z",
    "size": 774,
    "path": "../public/_nuxt/index.f4f931e4.js.br"
  },
  "/_nuxt/index.f4f931e4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38b-dAgu1PRFLcWNSV1hEDla9p8Ij2Y\"",
    "mtime": "2023-08-05T14:26:41.859Z",
    "size": 907,
    "path": "../public/_nuxt/index.f4f931e4.js.gz"
  },
  "/_nuxt/isAuth.a2f75606.js": {
    "type": "application/javascript",
    "etag": "\"213-4bwP3zFh/6orJ+6/TmhJcPkyDog\"",
    "mtime": "2023-08-05T14:26:40.856Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.a2f75606.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-08-05T14:26:40.856Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-08-05T14:26:41.866Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-08-05T14:26:41.863Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.b60bfef0.js": {
    "type": "application/javascript",
    "etag": "\"830-mvJAwuaUfCqhhlWDKvxS1xW0s+8\"",
    "mtime": "2023-08-05T14:26:40.855Z",
    "size": 2096,
    "path": "../public/_nuxt/login.b60bfef0.js"
  },
  "/_nuxt/login.b60bfef0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3de-t7yGWDjZq1NYldBb8dNk8SCVXSs\"",
    "mtime": "2023-08-05T14:26:41.870Z",
    "size": 990,
    "path": "../public/_nuxt/login.b60bfef0.js.br"
  },
  "/_nuxt/login.b60bfef0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a8-N0PFHG8kPqZHUHdFqJfuD7HJH6A\"",
    "mtime": "2023-08-05T14:26:41.866Z",
    "size": 1192,
    "path": "../public/_nuxt/login.b60bfef0.js.gz"
  },
  "/_nuxt/main.f52baff7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b8f5-jyPrmqbHvD3IVYuVRj+eF6gZFnc\"",
    "mtime": "2023-08-05T14:26:40.854Z",
    "size": 178421,
    "path": "../public/_nuxt/main.f52baff7.jpg"
  },
  "/_nuxt/news.b2dadf24.js": {
    "type": "application/javascript",
    "etag": "\"4af-Kaj2qU7fv6V1jVB/IjM6VXPqYHg\"",
    "mtime": "2023-08-05T14:26:40.852Z",
    "size": 1199,
    "path": "../public/_nuxt/news.b2dadf24.js"
  },
  "/_nuxt/news.b2dadf24.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a4-3pAjb0ZzLwkY2W0eSHKJ2thj630\"",
    "mtime": "2023-08-05T14:26:41.873Z",
    "size": 420,
    "path": "../public/_nuxt/news.b2dadf24.js.br"
  },
  "/_nuxt/news.b2dadf24.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-2RWGLbJwqCVdCDJDE1U1TsQ2qw4\"",
    "mtime": "2023-08-05T14:26:41.871Z",
    "size": 535,
    "path": "../public/_nuxt/news.b2dadf24.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-08-05T14:26:40.851Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.afc379c8.js": {
    "type": "application/javascript",
    "etag": "\"10a-3K0vjpXcP0vaw0JyTtKt2aerXnw\"",
    "mtime": "2023-08-05T14:26:40.850Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.afc379c8.js"
  },
  "/_nuxt/orders.c3dc3393.js": {
    "type": "application/javascript",
    "etag": "\"2671-bDmQ7zXC7d0pKj8Og4i4XlnSiWc\"",
    "mtime": "2023-08-05T14:26:40.849Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.c3dc3393.js"
  },
  "/_nuxt/orders.c3dc3393.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"ba7-VwUSzuuRzFtoKZQjv3wD9aCqv5A\"",
    "mtime": "2023-08-05T14:26:41.885Z",
    "size": 2983,
    "path": "../public/_nuxt/orders.c3dc3393.js.br"
  },
  "/_nuxt/orders.c3dc3393.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"da9-m532K+G6yRbFdGX94yejxvaGZhM\"",
    "mtime": "2023-08-05T14:26:41.874Z",
    "size": 3497,
    "path": "../public/_nuxt/orders.c3dc3393.js.gz"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-08-05T14:26:40.849Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-08-05T14:26:41.898Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-08-05T14:26:41.888Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-05T14:26:40.848Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.267cd3cf.js": {
    "type": "application/javascript",
    "etag": "\"1688-w7dn7ijkU/+2hyWQLPSmNzsmRJY\"",
    "mtime": "2023-08-05T14:26:40.843Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.267cd3cf.js"
  },
  "/_nuxt/profile.267cd3cf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"836-CwmjkXY1/oYV/dGdDn3Wxb16kto\"",
    "mtime": "2023-08-05T14:26:41.906Z",
    "size": 2102,
    "path": "../public/_nuxt/profile.267cd3cf.js.br"
  },
  "/_nuxt/profile.267cd3cf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a0-x5e/epxwsUw0V2N0BaQu0zdKzXw\"",
    "mtime": "2023-08-05T14:26:41.899Z",
    "size": 2464,
    "path": "../public/_nuxt/profile.267cd3cf.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-08-05T14:26:40.840Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-08-05T14:26:41.942Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-08-05T14:26:41.907Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-08-05T14:26:40.839Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-08-05T14:26:41.946Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-08-05T14:26:41.943Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.4bc8119b.js": {
    "type": "application/javascript",
    "etag": "\"111b-d9X0QFx0AZ5JZfvyfu/672+xJO8\"",
    "mtime": "2023-08-05T14:26:40.837Z",
    "size": 4379,
    "path": "../public/_nuxt/register.4bc8119b.js"
  },
  "/_nuxt/register.4bc8119b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"565-5jZYMXaI8D8ETHek2usgBnY2vBE\"",
    "mtime": "2023-08-05T14:26:41.952Z",
    "size": 1381,
    "path": "../public/_nuxt/register.4bc8119b.js.br"
  },
  "/_nuxt/register.4bc8119b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68a-WcOPRErnOO33bK5o50+tJjeATM8\"",
    "mtime": "2023-08-05T14:26:41.946Z",
    "size": 1674,
    "path": "../public/_nuxt/register.4bc8119b.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-05T14:26:40.836Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-05T14:26:40.836Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-05T14:26:41.956Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-05T14:26:41.953Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-05T14:26:40.834Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-05T14:26:40.831Z",
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
