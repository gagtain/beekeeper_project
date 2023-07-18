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
    "mtime": "2023-07-16T16:01:52.344Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-16T16:01:52.342Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.1b2ec819.js": {
    "type": "application/javascript",
    "etag": "\"96e-cW9zW0Xs2a/9oyNOBYTxhE/R/dA\"",
    "mtime": "2023-07-16T16:01:52.341Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.1b2ec819.js"
  },
  "/_nuxt/BasketInfo.1b2ec819.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3df-DFQL+mmFMOTmxzv/D2z4pB/hm4A\"",
    "mtime": "2023-07-16T16:01:52.351Z",
    "size": 991,
    "path": "../public/_nuxt/BasketInfo.1b2ec819.js.br"
  },
  "/_nuxt/BasketInfo.1b2ec819.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49b-42iCx9vX9NgvN1rBqu5OfzU55I0\"",
    "mtime": "2023-07-16T16:01:52.347Z",
    "size": 1179,
    "path": "../public/_nuxt/BasketInfo.1b2ec819.js.gz"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-w6ZWAKEgVWOkc1fvPF8RCeGaC4Y\"",
    "mtime": "2023-07-16T16:01:52.340Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f5-n2VRrAMAtWDVYe3O6dSOW0xXYqw\"",
    "mtime": "2023-07-16T16:01:52.377Z",
    "size": 1781,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.br"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a8-N3A5Q2F+JopdZICKJCTPgwM2DvQ\"",
    "mtime": "2023-07-16T16:01:52.352Z",
    "size": 2472,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.gz"
  },
  "/_nuxt/CatalogProduct.0b00a033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d2d-YyLLHeeNvI6EIHgOydXtmb0Nmes\"",
    "mtime": "2023-07-16T16:01:52.340Z",
    "size": 7469,
    "path": "../public/_nuxt/CatalogProduct.0b00a033.css"
  },
  "/_nuxt/CatalogProduct.0b00a033.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"64c-ksqvG0LnVn4r6cJAMpBgGGKHdL4\"",
    "mtime": "2023-07-16T16:01:52.386Z",
    "size": 1612,
    "path": "../public/_nuxt/CatalogProduct.0b00a033.css.br"
  },
  "/_nuxt/CatalogProduct.0b00a033.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"752-Ei4AIzHn+JcJC5Lz4s71SujgyGA\"",
    "mtime": "2023-07-16T16:01:52.378Z",
    "size": 1874,
    "path": "../public/_nuxt/CatalogProduct.0b00a033.css.gz"
  },
  "/_nuxt/CatalogProduct.4df23c5a.js": {
    "type": "application/javascript",
    "etag": "\"bea-r73YTmeu2aKAteWZ2SjAfxYO/vc\"",
    "mtime": "2023-07-16T16:01:52.339Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.4df23c5a.js"
  },
  "/_nuxt/CatalogProduct.4df23c5a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b3-gcFQnYScOwamZ80ECa0hKmg6YbQ\"",
    "mtime": "2023-07-16T16:01:52.391Z",
    "size": 1203,
    "path": "../public/_nuxt/CatalogProduct.4df23c5a.js.br"
  },
  "/_nuxt/CatalogProduct.4df23c5a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"554-B5pJYw1bpR7eafnXpdiX90N2/wU\"",
    "mtime": "2023-07-16T16:01:52.387Z",
    "size": 1364,
    "path": "../public/_nuxt/CatalogProduct.4df23c5a.js.gz"
  },
  "/_nuxt/FavoriteComp.6fbacd8a.js": {
    "type": "application/javascript",
    "etag": "\"c46-CF5dPfFBJ+V18DlAmy4mzNZZKx8\"",
    "mtime": "2023-07-16T16:01:52.339Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.6fbacd8a.js"
  },
  "/_nuxt/FavoriteComp.6fbacd8a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3bc-JcHJGIa0/KdvhWLlNgoRJoi70VM\"",
    "mtime": "2023-07-16T16:01:52.397Z",
    "size": 956,
    "path": "../public/_nuxt/FavoriteComp.6fbacd8a.js.br"
  },
  "/_nuxt/FavoriteComp.6fbacd8a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"456-pNQycpnBNle+Tel0SFnG3Xd6q7s\"",
    "mtime": "2023-07-16T16:01:52.392Z",
    "size": 1110,
    "path": "../public/_nuxt/FavoriteComp.6fbacd8a.js.gz"
  },
  "/_nuxt/FavoriteComp.d10507f2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-c3cno65+JH2VQizEAUB4Imjik7w\"",
    "mtime": "2023-07-16T16:01:52.338Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fe-yHb/J0Uvuv63E/C42srrZLnk4Ow\"",
    "mtime": "2023-07-16T16:01:52.413Z",
    "size": 1534,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.br"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6Xkawk1MFTlzm7F+eEmnZa7mxag\"",
    "mtime": "2023-07-16T16:01:52.398Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.gz"
  },
  "/_nuxt/ImageForm.02940a4b.js": {
    "type": "application/javascript",
    "etag": "\"225-nRkJpqOSO4zDMy54j+XGTcTTSpM\"",
    "mtime": "2023-07-16T16:01:52.338Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.02940a4b.js"
  },
  "/_nuxt/LoadingComp.3d2f02ac.js": {
    "type": "application/javascript",
    "etag": "\"1fe-6nsq9BZhznn+UoIJMIhfxHHIyQU\"",
    "mtime": "2023-07-16T16:01:52.337Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.3d2f02ac.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-16T16:01:52.337Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.23b0660d.js": {
    "type": "application/javascript",
    "etag": "\"459-oJwt+iamYI6V1a6e4/PGouu5Qp0\"",
    "mtime": "2023-07-16T16:01:52.336Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.23b0660d.js"
  },
  "/_nuxt/OrderProductList.23b0660d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-ipNZLsQD/9XFQ8xlA76C45FFrqE\"",
    "mtime": "2023-07-16T16:01:52.417Z",
    "size": 516,
    "path": "../public/_nuxt/OrderProductList.23b0660d.js.br"
  },
  "/_nuxt/OrderProductList.23b0660d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23a-5P7hhR7jUrd66NI4IqE0LsYSXf0\"",
    "mtime": "2023-07-16T16:01:52.415Z",
    "size": 570,
    "path": "../public/_nuxt/OrderProductList.23b0660d.js.gz"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4bc-lMa/2oMDlBunyQ+EyKWL+HNL+GI\"",
    "mtime": "2023-07-16T16:01:52.336Z",
    "size": 1212,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1d1-1Fh5VsjQ53gow03V+1oVYan+2ns\"",
    "mtime": "2023-07-16T16:01:52.420Z",
    "size": 465,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.br"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"234-UBpy5IK2zcWy+lc9Mom7Ya606S4\"",
    "mtime": "2023-07-16T16:01:52.418Z",
    "size": 564,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.gz"
  },
  "/_nuxt/RatingComp.6ef7db93.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10a1-8Gfjt3dDrqWBoexscvy1WtgDnjY\"",
    "mtime": "2023-07-16T16:01:52.335Z",
    "size": 4257,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css"
  },
  "/_nuxt/RatingComp.6ef7db93.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3fc-4iJaxX8CPtl6qVS1TxMXC0P4wqQ\"",
    "mtime": "2023-07-16T16:01:52.425Z",
    "size": 1020,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.br"
  },
  "/_nuxt/RatingComp.6ef7db93.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4bb-StcXTlfNUGIOh2NgsdQDFVWeWLM\"",
    "mtime": "2023-07-16T16:01:52.421Z",
    "size": 1211,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.gz"
  },
  "/_nuxt/RatingComp.f8529aad.js": {
    "type": "application/javascript",
    "etag": "\"bac-fr7p0Zxx3aeWMmnRuxxWsUDLZbc\"",
    "mtime": "2023-07-16T16:01:52.335Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.f8529aad.js"
  },
  "/_nuxt/RatingComp.f8529aad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d5-JEQZQCOAialnllcmztoS+nqxjvE\"",
    "mtime": "2023-07-16T16:01:52.430Z",
    "size": 981,
    "path": "../public/_nuxt/RatingComp.f8529aad.js.br"
  },
  "/_nuxt/RatingComp.f8529aad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47a-rcT7mG/65QQE6C9mDCUDGDeoGD4\"",
    "mtime": "2023-07-16T16:01:52.426Z",
    "size": 1146,
    "path": "../public/_nuxt/RatingComp.f8529aad.js.gz"
  },
  "/_nuxt/UserBasket.71225762.js": {
    "type": "application/javascript",
    "etag": "\"1410-MCYMsj7EtQeucMcEYBrSk9wzQTY\"",
    "mtime": "2023-07-16T16:01:52.334Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.71225762.js"
  },
  "/_nuxt/UserBasket.71225762.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76e-mKA1i3Hh5Fpk4k2ZpNLdGu6MFnk\"",
    "mtime": "2023-07-16T16:01:52.437Z",
    "size": 1902,
    "path": "../public/_nuxt/UserBasket.71225762.js.br"
  },
  "/_nuxt/UserBasket.71225762.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88f-v4IxQ+s+udBP636LkjovlymQNW0\"",
    "mtime": "2023-07-16T16:01:52.431Z",
    "size": 2191,
    "path": "../public/_nuxt/UserBasket.71225762.js.gz"
  },
  "/_nuxt/UserBasket.d26a50dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-kKYV+/VsLmXlyPvX/GIybQhwJGg\"",
    "mtime": "2023-07-16T16:01:52.334Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css"
  },
  "/_nuxt/UserBasket.d26a50dd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-dTjOi3ZlK6jAGp2mSk2qPUjLTiU\"",
    "mtime": "2023-07-16T16:01:52.454Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.br"
  },
  "/_nuxt/UserBasket.d26a50dd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-vnsR1nObKszggTaMRtQnIDCJJiQ\"",
    "mtime": "2023-07-16T16:01:52.438Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.gz"
  },
  "/_nuxt/_id_.7139cb4a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-F44+0pp8VrY6ziulXTkaBVxYEcw\"",
    "mtime": "2023-07-16T16:01:52.333Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.7139cb4a.css"
  },
  "/_nuxt/_id_.7139cb4a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-0HRwrKJkWDu/BjUa/35VgYsvZd0\"",
    "mtime": "2023-07-16T16:01:52.463Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.7139cb4a.css.br"
  },
  "/_nuxt/_id_.7139cb4a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56a-2dwn0QSrDAz0m6RWDNq+4lQC5Po\"",
    "mtime": "2023-07-16T16:01:52.454Z",
    "size": 1386,
    "path": "../public/_nuxt/_id_.7139cb4a.css.gz"
  },
  "/_nuxt/_id_.7c8de0bb.js": {
    "type": "application/javascript",
    "etag": "\"4be-8cai4trc7YITtpGvnNPaHlQhJMw\"",
    "mtime": "2023-07-16T16:01:52.333Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.7c8de0bb.js"
  },
  "/_nuxt/_id_.7c8de0bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-WV2BSK/WlKIaEvwnpEo1wyW91nA\"",
    "mtime": "2023-07-16T16:01:52.466Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.7c8de0bb.js.br"
  },
  "/_nuxt/_id_.7c8de0bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dc-WXfR6L4oRkOubnHWaWJMSGX4CQM\"",
    "mtime": "2023-07-16T16:01:52.464Z",
    "size": 732,
    "path": "../public/_nuxt/_id_.7c8de0bb.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-16T16:01:52.332Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.b467672e.js": {
    "type": "application/javascript",
    "etag": "\"1556-AiiRIGt5TjsCCkGC9Qm8GeIYUeg\"",
    "mtime": "2023-07-16T16:01:52.332Z",
    "size": 5462,
    "path": "../public/_nuxt/_id_.b467672e.js"
  },
  "/_nuxt/_id_.b467672e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"7b2-g5hxGUWVUvCxI7MkMXsfUD/fvYg\"",
    "mtime": "2023-07-16T16:01:52.473Z",
    "size": 1970,
    "path": "../public/_nuxt/_id_.b467672e.js.br"
  },
  "/_nuxt/_id_.b467672e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"8b5-Yw6Gh2I2MH+ZvLJe00MDmaeWM9Q\"",
    "mtime": "2023-07-16T16:01:52.467Z",
    "size": 2229,
    "path": "../public/_nuxt/_id_.b467672e.js.gz"
  },
  "/_nuxt/basket.2b48523a.js": {
    "type": "application/javascript",
    "etag": "\"270-prfLGjzRc2J8xSSsQGz9heGOk2U\"",
    "mtime": "2023-07-16T16:01:52.331Z",
    "size": 624,
    "path": "../public/_nuxt/basket.2b48523a.js"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-16T16:01:52.331Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-16T16:01:52.481Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-16T16:01:52.474Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/catalog.1c9110c9.js": {
    "type": "application/javascript",
    "etag": "\"1c86-k2GAGOlXe4Nu6G1WLvLuy1Sw434\"",
    "mtime": "2023-07-16T16:01:52.330Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.1c9110c9.js"
  },
  "/_nuxt/catalog.1c9110c9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"986-MRy3Q98BMfBWVhnJnGTSsN688hg\"",
    "mtime": "2023-07-16T16:01:52.490Z",
    "size": 2438,
    "path": "../public/_nuxt/catalog.1c9110c9.js.br"
  },
  "/_nuxt/catalog.1c9110c9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af6-Oxkkwbtb9x6D8sL9wjUYuxb664I\"",
    "mtime": "2023-07-16T16:01:52.482Z",
    "size": 2806,
    "path": "../public/_nuxt/catalog.1c9110c9.js.gz"
  },
  "/_nuxt/catalog.6ad7ead1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1cfd-u6DaKAPGyaXM5aUragNRJl3W9II\"",
    "mtime": "2023-07-16T16:01:52.330Z",
    "size": 7421,
    "path": "../public/_nuxt/catalog.6ad7ead1.css"
  },
  "/_nuxt/catalog.6ad7ead1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"69c-y7osglZS3wgnMy0gLtDamB6gR3s\"",
    "mtime": "2023-07-16T16:01:52.498Z",
    "size": 1692,
    "path": "../public/_nuxt/catalog.6ad7ead1.css.br"
  },
  "/_nuxt/catalog.6ad7ead1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7ac-ojIMpmuHY4Yw9+LeUv4KK/OC2bw\"",
    "mtime": "2023-07-16T16:01:52.490Z",
    "size": 1964,
    "path": "../public/_nuxt/catalog.6ad7ead1.css.gz"
  },
  "/_nuxt/checkout.894e8d6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26163-uAtb1dM9pzqkyrh7gBWngFf9x60\"",
    "mtime": "2023-07-16T16:01:52.329Z",
    "size": 156003,
    "path": "../public/_nuxt/checkout.894e8d6d.css"
  },
  "/_nuxt/checkout.894e8d6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fcd-AuWyVqppgsap/ytghclU7NvjQJY\"",
    "mtime": "2023-07-16T16:01:52.608Z",
    "size": 20429,
    "path": "../public/_nuxt/checkout.894e8d6d.css.br"
  },
  "/_nuxt/checkout.894e8d6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"600b-rZW2Ysd9j3r4usu0pkWlBmbqz9Y\"",
    "mtime": "2023-07-16T16:01:52.501Z",
    "size": 24587,
    "path": "../public/_nuxt/checkout.894e8d6d.css.gz"
  },
  "/_nuxt/checkout.c6de5306.js": {
    "type": "application/javascript",
    "etag": "\"145f7-hDrojQ8QZCkqZmgb0mZBwRvg6Fs\"",
    "mtime": "2023-07-16T16:01:52.328Z",
    "size": 83447,
    "path": "../public/_nuxt/checkout.c6de5306.js"
  },
  "/_nuxt/checkout.c6de5306.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5058-vFs5ywIKZ8ReoN/yHga59O4Pngg\"",
    "mtime": "2023-07-16T16:01:52.699Z",
    "size": 20568,
    "path": "../public/_nuxt/checkout.c6de5306.js.br"
  },
  "/_nuxt/checkout.c6de5306.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5d88-3kPL3F56Ezuo6rpOsR/2qHsqERI\"",
    "mtime": "2023-07-16T16:01:52.611Z",
    "size": 23944,
    "path": "../public/_nuxt/checkout.c6de5306.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-16T16:01:52.327Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.de976631.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2268-LVQCL0+074ArPCk++AXXD+rKgg0\"",
    "mtime": "2023-07-16T16:01:52.326Z",
    "size": 8808,
    "path": "../public/_nuxt/entry.de976631.css"
  },
  "/_nuxt/entry.de976631.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"85b-ymK/5TnE5TLs5zJEEj+sJhSZfk0\"",
    "mtime": "2023-07-16T16:01:52.710Z",
    "size": 2139,
    "path": "../public/_nuxt/entry.de976631.css.br"
  },
  "/_nuxt/entry.de976631.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9b8-u7NEeI1qQyWB0WNc1zHb3oEA89o\"",
    "mtime": "2023-07-16T16:01:52.700Z",
    "size": 2488,
    "path": "../public/_nuxt/entry.de976631.css.gz"
  },
  "/_nuxt/entry.e3fdc429.js": {
    "type": "application/javascript",
    "etag": "\"30f85-zUbmkfx2YrizfKSVm9UrRwMYErk\"",
    "mtime": "2023-07-16T16:01:52.326Z",
    "size": 200581,
    "path": "../public/_nuxt/entry.e3fdc429.js"
  },
  "/_nuxt/entry.e3fdc429.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1068f-az906EYLSob4LZTFWaUxWp1zaLs\"",
    "mtime": "2023-07-16T16:01:53.028Z",
    "size": 67215,
    "path": "../public/_nuxt/entry.e3fdc429.js.br"
  },
  "/_nuxt/entry.e3fdc429.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"12676-yLrg15yd1Voi05lcA4q1whYQmjY\"",
    "mtime": "2023-07-16T16:01:52.719Z",
    "size": 75382,
    "path": "../public/_nuxt/entry.e3fdc429.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-16T16:01:52.324Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-16T16:01:53.034Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-16T16:01:53.029Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.bd869d2a.js": {
    "type": "application/javascript",
    "etag": "\"8a4-QP3tSqhC/JfrgOcSmCTCncliBtU\"",
    "mtime": "2023-07-16T16:01:52.324Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.bd869d2a.js"
  },
  "/_nuxt/error-404.bd869d2a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-54VNIZAdSPTEepTSD1QKtLTu+B0\"",
    "mtime": "2023-07-16T16:01:53.038Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.bd869d2a.js.br"
  },
  "/_nuxt/error-404.bd869d2a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-i8Ro1nWbRkXzcSZ8K2rq9qKzMMM\"",
    "mtime": "2023-07-16T16:01:53.035Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.bd869d2a.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-16T16:01:52.323Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-16T16:01:53.042Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-16T16:01:53.039Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.bcb2258d.js": {
    "type": "application/javascript",
    "etag": "\"757-x79R2jC2+JYf/L0Qp49gmW+x+WY\"",
    "mtime": "2023-07-16T16:01:52.323Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.bcb2258d.js"
  },
  "/_nuxt/error-500.bcb2258d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34d-zaT6SVRTgKDB9UD+IW9AGSMSxwk\"",
    "mtime": "2023-07-16T16:01:53.046Z",
    "size": 845,
    "path": "../public/_nuxt/error-500.bcb2258d.js.br"
  },
  "/_nuxt/error-500.bcb2258d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-U5cRouPAyr5P+bLUR+kjo3H0P5o\"",
    "mtime": "2023-07-16T16:01:53.043Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.bcb2258d.js.gz"
  },
  "/_nuxt/error-component.4ecb63d6.js": {
    "type": "application/javascript",
    "etag": "\"45e-a1pWvwdqTBwC6vNZAEHNgkDtaTg\"",
    "mtime": "2023-07-16T16:01:52.322Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.4ecb63d6.js"
  },
  "/_nuxt/error-component.4ecb63d6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-93h5qaC2oFCW+28jXSfV7192wsw\"",
    "mtime": "2023-07-16T16:01:53.049Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.4ecb63d6.js.br"
  },
  "/_nuxt/error-component.4ecb63d6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-BTapOn7FnewmazCS2TJ5zS0pgMA\"",
    "mtime": "2023-07-16T16:01:53.047Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.4ecb63d6.js.gz"
  },
  "/_nuxt/favorite.4552f287.js": {
    "type": "application/javascript",
    "etag": "\"a30-6ZUGIm+TaiZbWqG7iFUBYGIjckU\"",
    "mtime": "2023-07-16T16:01:52.322Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.4552f287.js"
  },
  "/_nuxt/favorite.4552f287.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43c-GhhZCfs+NbWg/vn005I8Jbg8PiM\"",
    "mtime": "2023-07-16T16:01:53.055Z",
    "size": 1084,
    "path": "../public/_nuxt/favorite.4552f287.js.br"
  },
  "/_nuxt/favorite.4552f287.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f1-YiLM+eZKD3MMOOhQfq4Fl5CR9qk\"",
    "mtime": "2023-07-16T16:01:53.050Z",
    "size": 1265,
    "path": "../public/_nuxt/favorite.4552f287.js.gz"
  },
  "/_nuxt/favorite.9698b33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-jhDWFpVpVzahIl7O9qpSFn1p+f4\"",
    "mtime": "2023-07-16T16:01:52.321Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.9698b33c.css"
  },
  "/_nuxt/favorite.9698b33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-+f85b17ph0gDk/2u4Tt397WrMHk\"",
    "mtime": "2023-07-16T16:01:53.064Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.9698b33c.css.br"
  },
  "/_nuxt/favorite.9698b33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"619-iFobUxJ0BHLodFh3SdPk8ubtENw\"",
    "mtime": "2023-07-16T16:01:53.056Z",
    "size": 1561,
    "path": "../public/_nuxt/favorite.9698b33c.css.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-16T16:01:52.321Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.3d55f057.js": {
    "type": "application/javascript",
    "etag": "\"16a6b-XugHUpzveMmogpRX1TXuxdBPTWc\"",
    "mtime": "2023-07-16T16:01:52.320Z",
    "size": 92779,
    "path": "../public/_nuxt/index.3d55f057.js"
  },
  "/_nuxt/index.3d55f057.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62d1-Z67gLaZV52G3sj2NBcdCmmHn9o8\"",
    "mtime": "2023-07-16T16:01:53.173Z",
    "size": 25297,
    "path": "../public/_nuxt/index.3d55f057.js.br"
  },
  "/_nuxt/index.3d55f057.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f6e-ZeENkWUyGjQ8+oQtkJgXwJTt+xQ\"",
    "mtime": "2023-07-16T16:01:53.068Z",
    "size": 28526,
    "path": "../public/_nuxt/index.3d55f057.js.gz"
  },
  "/_nuxt/index.4dbf1ac7.js": {
    "type": "application/javascript",
    "etag": "\"3abf-DsQ2JKwkw+BI0b7DqhyEp5YHGEE\"",
    "mtime": "2023-07-16T16:01:52.319Z",
    "size": 15039,
    "path": "../public/_nuxt/index.4dbf1ac7.js"
  },
  "/_nuxt/index.4dbf1ac7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12eb-mg83yiyuTdFaqm6p/pZC25CtWC8\"",
    "mtime": "2023-07-16T16:01:53.190Z",
    "size": 4843,
    "path": "../public/_nuxt/index.4dbf1ac7.js.br"
  },
  "/_nuxt/index.4dbf1ac7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-Sm2sL5lxOWPsRluSl+VO2phYZaY\"",
    "mtime": "2023-07-16T16:01:53.174Z",
    "size": 5361,
    "path": "../public/_nuxt/index.4dbf1ac7.js.gz"
  },
  "/_nuxt/index.97526187.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3e81-cufjXlm3J57SOALxCIqrzSrXnhs\"",
    "mtime": "2023-07-16T16:01:52.319Z",
    "size": 16001,
    "path": "../public/_nuxt/index.97526187.css"
  },
  "/_nuxt/index.97526187.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"94e-wGyIjmzDiX6bs5WfZj46Y0mWBRU\"",
    "mtime": "2023-07-16T16:01:53.209Z",
    "size": 2382,
    "path": "../public/_nuxt/index.97526187.css.br"
  },
  "/_nuxt/index.97526187.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-WOF5G8AY6DABRjOcE6kEr1K+NAQ\"",
    "mtime": "2023-07-16T16:01:53.190Z",
    "size": 2884,
    "path": "../public/_nuxt/index.97526187.css.gz"
  },
  "/_nuxt/index.c9c83f7f.js": {
    "type": "application/javascript",
    "etag": "\"5a0-1WGgXgoakceDzK2cM/120qWyuMc\"",
    "mtime": "2023-07-16T16:01:52.318Z",
    "size": 1440,
    "path": "../public/_nuxt/index.c9c83f7f.js"
  },
  "/_nuxt/index.c9c83f7f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2d7-qDrTaEBfq/ykUIil61bMwtRvfVQ\"",
    "mtime": "2023-07-16T16:01:53.212Z",
    "size": 727,
    "path": "../public/_nuxt/index.c9c83f7f.js.br"
  },
  "/_nuxt/index.c9c83f7f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"348-UZa+uwjD2/5J5jIOy+9PGSTLBYI\"",
    "mtime": "2023-07-16T16:01:53.209Z",
    "size": 840,
    "path": "../public/_nuxt/index.c9c83f7f.js.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-16T16:01:52.318Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-16T16:01:53.216Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-16T16:01:53.213Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/isAuth.e5200380.js": {
    "type": "application/javascript",
    "etag": "\"213-ECBt+VcHYPtJg7nuBJq3YUhUgaQ\"",
    "mtime": "2023-07-16T16:01:52.317Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.e5200380.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-16T16:01:52.317Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-16T16:01:53.220Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-16T16:01:53.217Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.aeab7dc1.js": {
    "type": "application/javascript",
    "etag": "\"830-vtGmGiznP2zWpsA2lorrLTWMDfo\"",
    "mtime": "2023-07-16T16:01:52.317Z",
    "size": 2096,
    "path": "../public/_nuxt/login.aeab7dc1.js"
  },
  "/_nuxt/login.aeab7dc1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3dc-EJAOxzvQb9VYASWt8eHbN6zarPQ\"",
    "mtime": "2023-07-16T16:01:53.223Z",
    "size": 988,
    "path": "../public/_nuxt/login.aeab7dc1.js.br"
  },
  "/_nuxt/login.aeab7dc1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a8-jmxDf+64PietrfLpUc/6RO7nomQ\"",
    "mtime": "2023-07-16T16:01:53.220Z",
    "size": 1192,
    "path": "../public/_nuxt/login.aeab7dc1.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-16T16:01:52.316Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.30cdfd2f.js": {
    "type": "application/javascript",
    "etag": "\"4af-hrN5JoqfgVvKu40ULrnseaDmP/I\"",
    "mtime": "2023-07-16T16:01:52.314Z",
    "size": 1199,
    "path": "../public/_nuxt/news.30cdfd2f.js"
  },
  "/_nuxt/news.30cdfd2f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a7-EdBXRCndq/lWyfJsv8JjqNayvwM\"",
    "mtime": "2023-07-16T16:01:53.227Z",
    "size": 423,
    "path": "../public/_nuxt/news.30cdfd2f.js.br"
  },
  "/_nuxt/news.30cdfd2f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-tOMBcUptTByZlCoS1n80obdqcEw\"",
    "mtime": "2023-07-16T16:01:53.224Z",
    "size": 535,
    "path": "../public/_nuxt/news.30cdfd2f.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-16T16:01:52.314Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.9c281e4a.js": {
    "type": "application/javascript",
    "etag": "\"10a-sIcZ+8TNiBHUk1qYSSP3lnej9N0\"",
    "mtime": "2023-07-16T16:01:52.314Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.9c281e4a.js"
  },
  "/_nuxt/orders.4b994556.js": {
    "type": "application/javascript",
    "etag": "\"18c4-ZD7iUIn4/9rfCxArTt6F4Xk4LkI\"",
    "mtime": "2023-07-16T16:01:52.313Z",
    "size": 6340,
    "path": "../public/_nuxt/orders.4b994556.js"
  },
  "/_nuxt/orders.4b994556.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"874-a4Igh8BuujmEivzsqF+RvQ41/7s\"",
    "mtime": "2023-07-16T16:01:53.235Z",
    "size": 2164,
    "path": "../public/_nuxt/orders.4b994556.js.br"
  },
  "/_nuxt/orders.4b994556.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9f4-FtNFQ7kw0FYCDqWaD/zWGXMqeB8\"",
    "mtime": "2023-07-16T16:01:53.228Z",
    "size": 2548,
    "path": "../public/_nuxt/orders.4b994556.js.gz"
  },
  "/_nuxt/orders.bd070d4e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2347-aaPnCf4WLYH/l2xVQRF+ITGbxCo\"",
    "mtime": "2023-07-16T16:01:52.313Z",
    "size": 9031,
    "path": "../public/_nuxt/orders.bd070d4e.css"
  },
  "/_nuxt/orders.bd070d4e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"749-IPa1tXe+Cd1N97J0cggnoHiR95k\"",
    "mtime": "2023-07-16T16:01:53.248Z",
    "size": 1865,
    "path": "../public/_nuxt/orders.bd070d4e.css.br"
  },
  "/_nuxt/orders.bd070d4e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"87e-HE9qV2iwqyzm+ZHNQCXrKfNrg1o\"",
    "mtime": "2023-07-16T16:01:53.236Z",
    "size": 2174,
    "path": "../public/_nuxt/orders.bd070d4e.css.gz"
  },
  "/_nuxt/profile.5d2eb33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4ab0-8BeAMFdT90Jn71GUmLhhlEMrcj4\"",
    "mtime": "2023-07-16T16:01:52.312Z",
    "size": 19120,
    "path": "../public/_nuxt/profile.5d2eb33c.css"
  },
  "/_nuxt/profile.5d2eb33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6d2-0w1RZhTf3NIDDgOm8ZiGKU7eZmY\"",
    "mtime": "2023-07-16T16:01:53.274Z",
    "size": 1746,
    "path": "../public/_nuxt/profile.5d2eb33c.css.br"
  },
  "/_nuxt/profile.5d2eb33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"96d-Yvb/ix3eeUvneNdeKEitET6ccPg\"",
    "mtime": "2023-07-16T16:01:53.249Z",
    "size": 2413,
    "path": "../public/_nuxt/profile.5d2eb33c.css.gz"
  },
  "/_nuxt/profile.cbb9e6fe.js": {
    "type": "application/javascript",
    "etag": "\"1241-lbf+TIDHZ5dDwQtfi5Sjm8KuUAc\"",
    "mtime": "2023-07-16T16:01:52.312Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.cbb9e6fe.js"
  },
  "/_nuxt/profile.cbb9e6fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"709-D0JmF39rzqF+Woub7+hxqgMVHk4\"",
    "mtime": "2023-07-16T16:01:53.280Z",
    "size": 1801,
    "path": "../public/_nuxt/profile.cbb9e6fe.js.br"
  },
  "/_nuxt/profile.cbb9e6fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83c-Cqcp7BCLx9xBb+IiW0VmEzP0s08\"",
    "mtime": "2023-07-16T16:01:53.275Z",
    "size": 2108,
    "path": "../public/_nuxt/profile.cbb9e6fe.js.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-16T16:01:52.311Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-16T16:01:53.284Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-16T16:01:53.281Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.9b05b611.js": {
    "type": "application/javascript",
    "etag": "\"1128-QX21ot7AgbPZZHRnkZT9McTyp8U\"",
    "mtime": "2023-07-16T16:01:52.311Z",
    "size": 4392,
    "path": "../public/_nuxt/register.9b05b611.js"
  },
  "/_nuxt/register.9b05b611.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"575-pnuH6IvoVWGP8AEAup5jSeyMl5Q\"",
    "mtime": "2023-07-16T16:01:53.291Z",
    "size": 1397,
    "path": "../public/_nuxt/register.9b05b611.js.br"
  },
  "/_nuxt/register.9b05b611.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"695-thYElT9biXXPsWUiBCwqZlFZm7U\"",
    "mtime": "2023-07-16T16:01:53.285Z",
    "size": 1685,
    "path": "../public/_nuxt/register.9b05b611.js.gz"
  },
  "/_nuxt/removeFavorite.5cbe3ed2.js": {
    "type": "application/javascript",
    "etag": "\"3d2-Lk9RJsQZdGmmsq0EESaOCiys2ME\"",
    "mtime": "2023-07-16T16:01:52.310Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.5cbe3ed2.js"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-16T16:01:52.310Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-16T16:01:52.308Z",
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
