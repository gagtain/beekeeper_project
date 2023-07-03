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
    "mtime": "2023-07-03T14:44:30.415Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-03T14:44:30.398Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/CatalogProduct.10dddb46.js": {
    "type": "application/javascript",
    "etag": "\"f13-GuLjJCsuXwzmv9ht9EdXyrIgID8\"",
    "mtime": "2023-07-03T14:44:30.396Z",
    "size": 3859,
    "path": "../public/_nuxt/CatalogProduct.10dddb46.js"
  },
  "/_nuxt/CatalogProduct.5d04eec8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"22b3-yAmobHA9O+Q2QH65bWaiSKniGxo\"",
    "mtime": "2023-07-03T14:44:30.396Z",
    "size": 8883,
    "path": "../public/_nuxt/CatalogProduct.5d04eec8.css"
  },
  "/_nuxt/FavoriteComp.3bbf8502.js": {
    "type": "application/javascript",
    "etag": "\"a87-e0VL3B5uhXyxJwv+dwYtVce//I0\"",
    "mtime": "2023-07-03T14:44:30.395Z",
    "size": 2695,
    "path": "../public/_nuxt/FavoriteComp.3bbf8502.js"
  },
  "/_nuxt/FavoriteComp.5fafa66e.js": {
    "type": "application/javascript",
    "etag": "\"cb6-LO5VRe0u2/ttWRPap2agvMNNKU4\"",
    "mtime": "2023-07-03T14:44:30.395Z",
    "size": 3254,
    "path": "../public/_nuxt/FavoriteComp.5fafa66e.js"
  },
  "/_nuxt/FavoriteComp.666d0aec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1151-AMV2tAzH0srxRXG64/KtXaTFpGM\"",
    "mtime": "2023-07-03T14:44:30.394Z",
    "size": 4433,
    "path": "../public/_nuxt/FavoriteComp.666d0aec.css"
  },
  "/_nuxt/FavoriteComp.a1c56cb0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ef-05I9k0i4tNMeaOJPB6V/jZhXK6Y\"",
    "mtime": "2023-07-03T14:44:30.394Z",
    "size": 12783,
    "path": "../public/_nuxt/FavoriteComp.a1c56cb0.css"
  },
  "/_nuxt/ImageForm.c9cbe024.js": {
    "type": "application/javascript",
    "etag": "\"225-pOasdm15yjuNirs7YerzuonboTQ\"",
    "mtime": "2023-07-03T14:44:30.393Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.c9cbe024.js"
  },
  "/_nuxt/LoadingComp.6e0c1bf7.js": {
    "type": "application/javascript",
    "etag": "\"1f9-fz9PN64HiYJnQQdiUPvH3hrRhpk\"",
    "mtime": "2023-07-03T14:44:30.393Z",
    "size": 505,
    "path": "../public/_nuxt/LoadingComp.6e0c1bf7.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-03T14:44:30.392Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/UserBasket.a3cd2009.js": {
    "type": "application/javascript",
    "etag": "\"1bd2-W87QSgtCKtZWgn8xOY+00zVc/Ss\"",
    "mtime": "2023-07-03T14:44:30.392Z",
    "size": 7122,
    "path": "../public/_nuxt/UserBasket.a3cd2009.js"
  },
  "/_nuxt/UserBasket.f42e43fd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4db4-sOD/06MnZFBtlNExCeDuVyYn2Qk\"",
    "mtime": "2023-07-03T14:44:30.391Z",
    "size": 19892,
    "path": "../public/_nuxt/UserBasket.f42e43fd.css"
  },
  "/_nuxt/_id_.2bc8848e.js": {
    "type": "application/javascript",
    "etag": "\"14f4-l5a/EdTStLOThKldAo3IVVgrFA8\"",
    "mtime": "2023-07-03T14:44:30.391Z",
    "size": 5364,
    "path": "../public/_nuxt/_id_.2bc8848e.js"
  },
  "/_nuxt/_id_.5db288e8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-S1VT1w9C+Whcle8iicDzi0mEWXM\"",
    "mtime": "2023-07-03T14:44:30.390Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.5db288e8.css"
  },
  "/_nuxt/basket.330144bc.js": {
    "type": "application/javascript",
    "etag": "\"24a-qt1pEqegSUSictQVwvoPzpltEks\"",
    "mtime": "2023-07-03T14:44:30.390Z",
    "size": 586,
    "path": "../public/_nuxt/basket.330144bc.js"
  },
  "/_nuxt/basket.d1e2c5b5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"191b-ZkGbAEmUCQKws7tSpcCGP4PAo3A\"",
    "mtime": "2023-07-03T14:44:30.389Z",
    "size": 6427,
    "path": "../public/_nuxt/basket.d1e2c5b5.css"
  },
  "/_nuxt/catalog.595da5b9.js": {
    "type": "application/javascript",
    "etag": "\"2025-L+A0SR1uyd083mgqYigKJErpaeM\"",
    "mtime": "2023-07-03T14:44:30.389Z",
    "size": 8229,
    "path": "../public/_nuxt/catalog.595da5b9.js"
  },
  "/_nuxt/catalog.e56fc4db.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"218f-YRrZ2LpUKiItwVhGVcPhUiFhqNw\"",
    "mtime": "2023-07-03T14:44:30.388Z",
    "size": 8591,
    "path": "../public/_nuxt/catalog.e56fc4db.css"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-03T14:44:30.388Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.05a7b6cd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2242-NxZ2uuhgan+7bBFkCoxPaL57y2E\"",
    "mtime": "2023-07-03T14:44:30.387Z",
    "size": 8770,
    "path": "../public/_nuxt/entry.05a7b6cd.css"
  },
  "/_nuxt/entry.5741de8d.js": {
    "type": "application/javascript",
    "etag": "\"33188-FBHDnch+xw8PzdoxLGm8tdfPf3A\"",
    "mtime": "2023-07-03T14:44:30.386Z",
    "size": 209288,
    "path": "../public/_nuxt/entry.5741de8d.js"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-03T14:44:30.385Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.e59b0ccf.js": {
    "type": "application/javascript",
    "etag": "\"89e-8pR4RHogRZ4DlXl2qKBJHQ34tEY\"",
    "mtime": "2023-07-03T14:44:30.385Z",
    "size": 2206,
    "path": "../public/_nuxt/error-404.e59b0ccf.js"
  },
  "/_nuxt/error-500.a4371246.js": {
    "type": "application/javascript",
    "etag": "\"751-I7w3ri1VmLEqfdE0GmWl5IhFNxw\"",
    "mtime": "2023-07-03T14:44:30.384Z",
    "size": 1873,
    "path": "../public/_nuxt/error-500.a4371246.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-03T14:44:30.383Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-component.395e1afa.js": {
    "type": "application/javascript",
    "etag": "\"45e-EVQEZIvG8yXZ0AAji1DENBXS/98\"",
    "mtime": "2023-07-03T14:44:30.383Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.395e1afa.js"
  },
  "/_nuxt/favorite.06fab98e.js": {
    "type": "application/javascript",
    "etag": "\"a5a-OjQDsxdfCbQ+s08AOV8L7wE2JAM\"",
    "mtime": "2023-07-03T14:44:30.383Z",
    "size": 2650,
    "path": "../public/_nuxt/favorite.06fab98e.js"
  },
  "/_nuxt/favorite.24a19fcc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19df-IWyyVngCQ2qaHzNnSNgpPYyQo8k\"",
    "mtime": "2023-07-03T14:44:30.382Z",
    "size": 6623,
    "path": "../public/_nuxt/favorite.24a19fcc.css"
  },
  "/_nuxt/index.85a5443e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5032-RCVq9kcx34IWYBom5eSurFbLq8Q\"",
    "mtime": "2023-07-03T14:44:30.381Z",
    "size": 20530,
    "path": "../public/_nuxt/index.85a5443e.css"
  },
  "/_nuxt/index.dfbdf950.js": {
    "type": "application/javascript",
    "etag": "\"16700-+hdY3O37GeSQBrIanKut6cpRPts\"",
    "mtime": "2023-07-03T14:44:30.381Z",
    "size": 91904,
    "path": "../public/_nuxt/index.dfbdf950.js"
  },
  "/_nuxt/isAuth.7f9e7957.js": {
    "type": "application/javascript",
    "etag": "\"213-qBrrO5GyfymRugAVLMhkvFCrlYM\"",
    "mtime": "2023-07-03T14:44:30.380Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.7f9e7957.js"
  },
  "/_nuxt/login.1f0094d1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-Mu4AlcUqSU2Np+JH/jFo9S/Ud6g\"",
    "mtime": "2023-07-03T14:44:30.379Z",
    "size": 2274,
    "path": "../public/_nuxt/login.1f0094d1.css"
  },
  "/_nuxt/login.4873e5d0.js": {
    "type": "application/javascript",
    "etag": "\"848-H2PcLJfl2nvM2iq5Nc19Wp3obdU\"",
    "mtime": "2023-07-03T14:44:30.379Z",
    "size": 2120,
    "path": "../public/_nuxt/login.4873e5d0.js"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-03T14:44:30.378Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/orders.c0b883df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c73-0liXeldRZ4GRI1Jb2QV98YzNYQA\"",
    "mtime": "2023-07-03T14:44:30.377Z",
    "size": 7283,
    "path": "../public/_nuxt/orders.c0b883df.css"
  },
  "/_nuxt/orders.e485b5ce.js": {
    "type": "application/javascript",
    "etag": "\"f00-EsyNeRz1xWdKPJTu88Tl+x3hrL4\"",
    "mtime": "2023-07-03T14:44:30.376Z",
    "size": 3840,
    "path": "../public/_nuxt/orders.e485b5ce.js"
  },
  "/_nuxt/profile.6fbd0e49.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4af0-Z32KI+ndzeotYI317UBZli3ENTw\"",
    "mtime": "2023-07-03T14:44:30.375Z",
    "size": 19184,
    "path": "../public/_nuxt/profile.6fbd0e49.css"
  },
  "/_nuxt/profile.78abaae3.js": {
    "type": "application/javascript",
    "etag": "\"1220-QEUVN/BhtY3Oyr8Jg7i91Ts0yQc\"",
    "mtime": "2023-07-03T14:44:30.375Z",
    "size": 4640,
    "path": "../public/_nuxt/profile.78abaae3.js"
  },
  "/_nuxt/register.1b4429b6.js": {
    "type": "application/javascript",
    "etag": "\"4b96-i8gEXIoKpF4TTMCTv2UiL2oEYfU\"",
    "mtime": "2023-07-03T14:44:30.374Z",
    "size": 19350,
    "path": "../public/_nuxt/register.1b4429b6.js"
  },
  "/_nuxt/register.710c22d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-/sFUU1VmP/10yIbpC6UvJC/YT2w\"",
    "mtime": "2023-07-03T14:44:30.374Z",
    "size": 2274,
    "path": "../public/_nuxt/register.710c22d3.css"
  },
  "/_nuxt/removeFavorite.1525e222.js": {
    "type": "application/javascript",
    "etag": "\"414-NeqIphfzq1J4jA8vsHs9EReK7+4\"",
    "mtime": "2023-07-03T14:44:30.373Z",
    "size": 1044,
    "path": "../public/_nuxt/removeFavorite.1525e222.js"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-03T14:44:30.373Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-03T14:44:30.371Z",
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
