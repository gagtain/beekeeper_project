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
    "mtime": "2023-12-19T07:19:07.047Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-12-19T07:19:07.048Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-12-19T07:19:07.048Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-12-19T07:19:07.041Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-12-19T07:19:07.040Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2023-12-19T07:19:07.039Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2023-12-19T07:19:07.079Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-LE+S+BwO6spfkzk2fxkvXiZn5T8\"",
    "mtime": "2023-12-19T07:19:07.053Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/BasketInfo.9bd88820.js": {
    "type": "application/javascript",
    "etag": "\"ae7-FIzS8/hPubK5zJ2a/nyuE97bSog\"",
    "mtime": "2023-12-19T07:19:07.039Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.9bd88820.js"
  },
  "/_nuxt/BasketInfo.9bd88820.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"445-tDXT1DS4ENuFErmqMBqg74A2dJs\"",
    "mtime": "2023-12-19T07:19:07.084Z",
    "size": 1093,
    "path": "../public/_nuxt/BasketInfo.9bd88820.js.br"
  },
  "/_nuxt/BasketInfo.9bd88820.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fd-T9/5NauLdye6NvTMqWcoQEAa5q8\"",
    "mtime": "2023-12-19T07:19:07.080Z",
    "size": 1277,
    "path": "../public/_nuxt/BasketInfo.9bd88820.js.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-12-19T07:19:07.038Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-12-19T07:19:07.104Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-12-19T07:19:07.085Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.75b84399.js": {
    "type": "application/javascript",
    "etag": "\"15bf-ghLf+U5US8gW3q6RrN6s3nQ/04M\"",
    "mtime": "2023-12-19T07:19:07.038Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.75b84399.js"
  },
  "/_nuxt/CatalogProduct.75b84399.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"787-EELdL64UWndpyuyhR8VAmocjM04\"",
    "mtime": "2023-12-19T07:19:07.111Z",
    "size": 1927,
    "path": "../public/_nuxt/CatalogProduct.75b84399.js.br"
  },
  "/_nuxt/CatalogProduct.75b84399.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-o8F4fk73+XGa/7k8iaUp26SrhGo\"",
    "mtime": "2023-12-19T07:19:07.105Z",
    "size": 2185,
    "path": "../public/_nuxt/CatalogProduct.75b84399.js.gz"
  },
  "/_nuxt/FavoriteComp.05962195.js": {
    "type": "application/javascript",
    "etag": "\"783-6iOV676hSTy8HWdfXEGWHegxuaA\"",
    "mtime": "2023-12-19T07:19:07.037Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.05962195.js"
  },
  "/_nuxt/FavoriteComp.05962195.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28b-QJSGQINqgia4RXYKHBYIK5cu2C0\"",
    "mtime": "2023-12-19T07:19:07.116Z",
    "size": 651,
    "path": "../public/_nuxt/FavoriteComp.05962195.js.br"
  },
  "/_nuxt/FavoriteComp.05962195.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-Bap+OkgFc+xZ0XDF3OLoLqwxaVQ\"",
    "mtime": "2023-12-19T07:19:07.112Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.05962195.js.gz"
  },
  "/_nuxt/FavoriteComp.35d900e8.js": {
    "type": "application/javascript",
    "etag": "\"e2e-Jw1V+w/obb68vq3zExcHNtV48S8\"",
    "mtime": "2023-12-19T07:19:07.037Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.35d900e8.js"
  },
  "/_nuxt/FavoriteComp.35d900e8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"414-cI5b1eVWLUOf9Xk2TCSGjDpQqF0\"",
    "mtime": "2023-12-19T07:19:07.122Z",
    "size": 1044,
    "path": "../public/_nuxt/FavoriteComp.35d900e8.js.br"
  },
  "/_nuxt/FavoriteComp.35d900e8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d0-Q0qKyFCdgCRoD7jLP9rzsJaDrZ8\"",
    "mtime": "2023-12-19T07:19:07.116Z",
    "size": 1232,
    "path": "../public/_nuxt/FavoriteComp.35d900e8.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-12-19T07:19:07.037Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-12-19T07:19:07.139Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-12-19T07:19:07.123Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-12-19T07:19:07.036Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-12-19T07:19:07.145Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-12-19T07:19:07.140Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/ImageForm.41f5ab5b.js": {
    "type": "application/javascript",
    "etag": "\"1ac-Nc0HZf1nmnS572Ua7FBQNcwnD3w\"",
    "mtime": "2023-12-19T07:19:07.036Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.41f5ab5b.js"
  },
  "/_nuxt/LoadingComp.7f0092b8.js": {
    "type": "application/javascript",
    "etag": "\"1fe-gyUeEwTN0WaK7PpUR+T4nOr7N9A\"",
    "mtime": "2023-12-19T07:19:07.035Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.7f0092b8.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-12-19T07:19:07.035Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-12-19T07:19:07.034Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-12-19T07:19:07.148Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-12-19T07:19:07.146Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.7716ac26.js": {
    "type": "application/javascript",
    "etag": "\"431-VuF6XHJLgVkLtFA85cBInF0YGrM\"",
    "mtime": "2023-12-19T07:19:07.034Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.7716ac26.js"
  },
  "/_nuxt/OrderProductList.7716ac26.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20d-eO+KT9BJ06sI33BL9i29gjwyumg\"",
    "mtime": "2023-12-19T07:19:07.151Z",
    "size": 525,
    "path": "../public/_nuxt/OrderProductList.7716ac26.js.br"
  },
  "/_nuxt/OrderProductList.7716ac26.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-uSmid2NYkIipd2EpnPUSRFZvK2U\"",
    "mtime": "2023-12-19T07:19:07.149Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.7716ac26.js.gz"
  },
  "/_nuxt/UserBasket.5adb7874.js": {
    "type": "application/javascript",
    "etag": "\"1897-tdf1f9bPNkSuVCT2dyL277rAJZA\"",
    "mtime": "2023-12-19T07:19:07.033Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.5adb7874.js"
  },
  "/_nuxt/UserBasket.5adb7874.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"91d-tPCJn9huQhhLWnvDY03oBmo+TaM\"",
    "mtime": "2023-12-19T07:19:07.159Z",
    "size": 2333,
    "path": "../public/_nuxt/UserBasket.5adb7874.js.br"
  },
  "/_nuxt/UserBasket.5adb7874.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a73-CkOg8vwwq9KOubTlJBBnTgKZT+0\"",
    "mtime": "2023-12-19T07:19:07.152Z",
    "size": 2675,
    "path": "../public/_nuxt/UserBasket.5adb7874.js.gz"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2023-12-19T07:19:07.033Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2023-12-19T07:19:07.178Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-WJYELguUqmb4UcsCrbAABZoRm8s\"",
    "mtime": "2023-12-19T07:19:07.160Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-12-19T07:19:07.032Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-12-19T07:19:07.194Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-12-19T07:19:07.179Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-12-19T07:19:07.032Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.af89e7e8.js": {
    "type": "application/javascript",
    "etag": "\"531-mrYhQcM9kJemHvR9RGw4+js8Nuw\"",
    "mtime": "2023-12-19T07:19:07.031Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.af89e7e8.js"
  },
  "/_nuxt/_id_.af89e7e8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-6zn7roWfrLWVoNojuPU/sSSvbEI\"",
    "mtime": "2023-12-19T07:19:07.198Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.af89e7e8.js.br"
  },
  "/_nuxt/_id_.af89e7e8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-7DQKwxf/0lfW9LFoU6yFA8H/WsE\"",
    "mtime": "2023-12-19T07:19:07.195Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.af89e7e8.js.gz"
  },
  "/_nuxt/_id_.e97df62e.js": {
    "type": "application/javascript",
    "etag": "\"12e4-2XRMC9TBgQ/5mgAxPp6giIKMefA\"",
    "mtime": "2023-12-19T07:19:07.031Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.e97df62e.js"
  },
  "/_nuxt/_id_.e97df62e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76b-t7SdLK08R+TZHLPHeyrgTQMkBp0\"",
    "mtime": "2023-12-19T07:19:07.205Z",
    "size": 1899,
    "path": "../public/_nuxt/_id_.e97df62e.js.br"
  },
  "/_nuxt/_id_.e97df62e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"860-uAN53x2nw2VdxgEK0SY5XCi2VG0\"",
    "mtime": "2023-12-19T07:19:07.199Z",
    "size": 2144,
    "path": "../public/_nuxt/_id_.e97df62e.js.gz"
  },
  "/_nuxt/about_us.b0e0938e.js": {
    "type": "application/javascript",
    "etag": "\"819-QYPqVISMf+RuGKce++YNR3uZM7s\"",
    "mtime": "2023-12-19T07:19:07.030Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.b0e0938e.js"
  },
  "/_nuxt/about_us.b0e0938e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3b3-hVXpkCwLeEgL8Se6xgIaT2+WKq8\"",
    "mtime": "2023-12-19T07:19:07.209Z",
    "size": 947,
    "path": "../public/_nuxt/about_us.b0e0938e.js.br"
  },
  "/_nuxt/about_us.b0e0938e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"46f-XCnkRWF391LKNMcqibTpT3mpgeM\"",
    "mtime": "2023-12-19T07:19:07.205Z",
    "size": 1135,
    "path": "../public/_nuxt/about_us.b0e0938e.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2023-12-19T07:19:07.030Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-12-19T07:19:07.030Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-12-19T07:19:07.216Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-12-19T07:19:07.210Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.c5a050c1.js": {
    "type": "application/javascript",
    "etag": "\"2b6-q1TZc2TQU7SZ1isz+bi5bZO4cRU\"",
    "mtime": "2023-12-19T07:19:07.029Z",
    "size": 694,
    "path": "../public/_nuxt/basket.c5a050c1.js"
  },
  "/_nuxt/catalog.e13d9f55.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-mdmDf3nmA2mGylHTJxK6w/CZY24\"",
    "mtime": "2023-12-19T07:19:07.029Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.e13d9f55.js"
  },
  "/_nuxt/catalog.e13d9f55.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"926-emr1Jv+te/qivBNp3KQQmp1PRuk\"",
    "mtime": "2023-12-19T07:19:07.225Z",
    "size": 2342,
    "path": "../public/_nuxt/catalog.e13d9f55.js.br"
  },
  "/_nuxt/catalog.e13d9f55.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9a-yHvlr16TFIgelXMLZb08T5DXKLE\"",
    "mtime": "2023-12-19T07:19:07.217Z",
    "size": 2714,
    "path": "../public/_nuxt/catalog.e13d9f55.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-12-19T07:19:07.028Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-12-19T07:19:07.234Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-12-19T07:19:07.226Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2023-12-19T07:19:07.028Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2023-12-19T07:19:07.352Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-1GLczaEuyyUl480772Fwwqm+GtA\"",
    "mtime": "2023-12-19T07:19:07.237Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.796b640b.js": {
    "type": "application/javascript",
    "etag": "\"16616-WR76kk35RsdXlcvt6TI/xY6LFVQ\"",
    "mtime": "2023-12-19T07:19:07.027Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.796b640b.js"
  },
  "/_nuxt/checkout.796b640b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57d2-069VBRXb0NKpZrwqWG2E+8Kn/64\"",
    "mtime": "2023-12-19T07:19:07.462Z",
    "size": 22482,
    "path": "../public/_nuxt/checkout.796b640b.js.br"
  },
  "/_nuxt/checkout.796b640b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"65ff-boz6DEEnsuXVJa9+ZZwWt0RtwH0\"",
    "mtime": "2023-12-19T07:19:07.355Z",
    "size": 26111,
    "path": "../public/_nuxt/checkout.796b640b.js.gz"
  },
  "/_nuxt/entry.6e545c23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-dhTZ8viLs+5dZ70tHzTW7opSkWM\"",
    "mtime": "2023-12-19T07:19:07.026Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.6e545c23.css"
  },
  "/_nuxt/entry.6e545c23.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a58-F6bKnX0vmsUwt+igMxXatpt1Rro\"",
    "mtime": "2023-12-19T07:19:07.473Z",
    "size": 2648,
    "path": "../public/_nuxt/entry.6e545c23.css.br"
  },
  "/_nuxt/entry.6e545c23.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bee-o1bKiFpS4jczL4inuXJgHkfYEF0\"",
    "mtime": "2023-12-19T07:19:07.463Z",
    "size": 3054,
    "path": "../public/_nuxt/entry.6e545c23.css.gz"
  },
  "/_nuxt/entry.c4e6406c.js": {
    "type": "application/javascript",
    "etag": "\"372e6-EcrHaYWMmsJT3M1ANTf6/zI3lsE\"",
    "mtime": "2023-12-19T07:19:07.025Z",
    "size": 226022,
    "path": "../public/_nuxt/entry.c4e6406c.js"
  },
  "/_nuxt/entry.c4e6406c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12642-DFMG8ddDFLXwGSN2zrX4muMFGAY\"",
    "mtime": "2023-12-19T07:19:07.822Z",
    "size": 75330,
    "path": "../public/_nuxt/entry.c4e6406c.js.br"
  },
  "/_nuxt/entry.c4e6406c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14b2a-O6crvXxsctS82MxxBlAo6+0htAw\"",
    "mtime": "2023-12-19T07:19:07.482Z",
    "size": 84778,
    "path": "../public/_nuxt/entry.c4e6406c.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-12-19T07:19:07.024Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-12-19T07:19:07.828Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-12-19T07:19:07.823Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.5fbd0036.js": {
    "type": "application/javascript",
    "etag": "\"8a8-//J4OWUBRxtJr2J+f0Ms38aJWsQ\"",
    "mtime": "2023-12-19T07:19:07.023Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.5fbd0036.js"
  },
  "/_nuxt/error-404.5fbd0036.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-JgRHY8pgW6SRM5yqWtTYudxOBR0\"",
    "mtime": "2023-12-19T07:19:07.831Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.5fbd0036.js.br"
  },
  "/_nuxt/error-404.5fbd0036.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-Xh7eyn8VwF2+fTQQtCvGiluMkbo\"",
    "mtime": "2023-12-19T07:19:07.828Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.5fbd0036.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-12-19T07:19:07.023Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-12-19T07:19:07.835Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-12-19T07:19:07.832Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.f335248c.js": {
    "type": "application/javascript",
    "etag": "\"756-QrtoWaoIkNE5GfrHzrk1+Tv+37c\"",
    "mtime": "2023-12-19T07:19:07.022Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.f335248c.js"
  },
  "/_nuxt/error-500.f335248c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-RmMVz9q2e9W16LauFiAabFLvAQ0\"",
    "mtime": "2023-12-19T07:19:07.838Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.f335248c.js.br"
  },
  "/_nuxt/error-500.f335248c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-NFF1CPW+pJKk/Qf++2QVP9IHYTE\"",
    "mtime": "2023-12-19T07:19:07.836Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.f335248c.js.gz"
  },
  "/_nuxt/error-component.0c7e6eeb.js": {
    "type": "application/javascript",
    "etag": "\"45e-pkV3tkyWxQKvAh94aGLCHvi4A3U\"",
    "mtime": "2023-12-19T07:19:07.022Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.0c7e6eeb.js"
  },
  "/_nuxt/error-component.0c7e6eeb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-PTOLvYocfFm28ZTazMsivepuEUQ\"",
    "mtime": "2023-12-19T07:19:07.841Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.0c7e6eeb.js.br"
  },
  "/_nuxt/error-component.0c7e6eeb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-SnmKzmsfvCopIneUxEhkb7oxK38\"",
    "mtime": "2023-12-19T07:19:07.839Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.0c7e6eeb.js.gz"
  },
  "/_nuxt/favorite.15921f2e.js": {
    "type": "application/javascript",
    "etag": "\"906-rSlAd9YU3V/R8kAyGqj90wES/qA\"",
    "mtime": "2023-12-19T07:19:07.021Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.15921f2e.js"
  },
  "/_nuxt/favorite.15921f2e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40f-5R8KDH4xZUDPLQhfJLNKmfp23AQ\"",
    "mtime": "2023-12-19T07:19:07.845Z",
    "size": 1039,
    "path": "../public/_nuxt/favorite.15921f2e.js.br"
  },
  "/_nuxt/favorite.15921f2e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b5-uWkXLk3Fxllb89ag7m6wNcBuaKw\"",
    "mtime": "2023-12-19T07:19:07.842Z",
    "size": 1205,
    "path": "../public/_nuxt/favorite.15921f2e.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2023-12-19T07:19:07.020Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2023-12-19T07:19:07.853Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-d6UjocNqp2VUIFEp0Ni0e30HvBg\"",
    "mtime": "2023-12-19T07:19:07.846Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-12-19T07:19:07.020Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-12-19T07:19:07.019Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.9dde6b3c.js": {
    "type": "application/javascript",
    "etag": "\"e1-NRTgtZvqAPN3hFqE8VTNlYzZQ3w\"",
    "mtime": "2023-12-19T07:19:07.019Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.9dde6b3c.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-12-19T07:19:07.018Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-12-19T07:19:07.858Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-12-19T07:19:07.854Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.2170d994.js": {
    "type": "application/javascript",
    "etag": "\"17bfc-sSZ3ZUpRj5a6OEToO+6a8+fwhKY\"",
    "mtime": "2023-12-19T07:19:07.018Z",
    "size": 97276,
    "path": "../public/_nuxt/index.2170d994.js"
  },
  "/_nuxt/index.2170d994.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"674f-wiSWS55IO/Ab1+cjo3V3h9AqjTM\"",
    "mtime": "2023-12-19T07:19:07.968Z",
    "size": 26447,
    "path": "../public/_nuxt/index.2170d994.js.br"
  },
  "/_nuxt/index.2170d994.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758d-SeaBNxYDLMA2tM4gmW+7EzF0vbM\"",
    "mtime": "2023-12-19T07:19:07.861Z",
    "size": 30093,
    "path": "../public/_nuxt/index.2170d994.js.gz"
  },
  "/_nuxt/index.3891d81d.js": {
    "type": "application/javascript",
    "etag": "\"649-5ldWKSQcGjnIbs1KVhmSy6n0CnY\"",
    "mtime": "2023-12-19T07:19:07.017Z",
    "size": 1609,
    "path": "../public/_nuxt/index.3891d81d.js"
  },
  "/_nuxt/index.3891d81d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"33d-wx4PZs3WG5ids82zJtbcCMo9STM\"",
    "mtime": "2023-12-19T07:19:07.972Z",
    "size": 829,
    "path": "../public/_nuxt/index.3891d81d.js.br"
  },
  "/_nuxt/index.3891d81d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-sTNpAgBnGb0Noym4LXeWD7mtqBA\"",
    "mtime": "2023-12-19T07:19:07.969Z",
    "size": 955,
    "path": "../public/_nuxt/index.3891d81d.js.gz"
  },
  "/_nuxt/index.3cac2be5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-kYQjRSZK2Bkw4KYhjzt+8CUnOOU\"",
    "mtime": "2023-12-19T07:19:07.016Z",
    "size": 22887,
    "path": "../public/_nuxt/index.3cac2be5.css"
  },
  "/_nuxt/index.3cac2be5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12db-arABDJvRAHj4ueLfygPTmKHJYwg\"",
    "mtime": "2023-12-19T07:19:07.999Z",
    "size": 4827,
    "path": "../public/_nuxt/index.3cac2be5.css.br"
  },
  "/_nuxt/index.3cac2be5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-7bfb3gbGe0ovllAwE4Pm80HYlDk\"",
    "mtime": "2023-12-19T07:19:07.973Z",
    "size": 5713,
    "path": "../public/_nuxt/index.3cac2be5.css.gz"
  },
  "/_nuxt/index.707651a0.js": {
    "type": "application/javascript",
    "etag": "\"3abf-Vm4eIycZz4G5hMCSsEx5PuwP0MA\"",
    "mtime": "2023-12-19T07:19:07.016Z",
    "size": 15039,
    "path": "../public/_nuxt/index.707651a0.js"
  },
  "/_nuxt/index.707651a0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12e5-MSpaG+NSYm1CwC/QsOFu0lqA5As\"",
    "mtime": "2023-12-19T07:19:08.017Z",
    "size": 4837,
    "path": "../public/_nuxt/index.707651a0.js.br"
  },
  "/_nuxt/index.707651a0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-n5Puc7elHVK2hX5xkkmcEav7xvs\"",
    "mtime": "2023-12-19T07:19:08.000Z",
    "size": 5362,
    "path": "../public/_nuxt/index.707651a0.js.gz"
  },
  "/_nuxt/isAuth.0cd0b7c8.js": {
    "type": "application/javascript",
    "etag": "\"275-u8ubAwBFbPorfUx+vO/n/5L4aeU\"",
    "mtime": "2023-12-19T07:19:07.015Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.0cd0b7c8.js"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2023-12-19T07:19:07.015Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2023-12-19T07:19:08.021Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-BSIWOpRnxjt4LrLxZNusX10MQ/Q\"",
    "mtime": "2023-12-19T07:19:08.018Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.cb6987fc.js": {
    "type": "application/javascript",
    "etag": "\"b8e-OcS8MYzjKEBlOWj2fRcYu2ZbJUU\"",
    "mtime": "2023-12-19T07:19:07.014Z",
    "size": 2958,
    "path": "../public/_nuxt/login.cb6987fc.js"
  },
  "/_nuxt/login.cb6987fc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4c4-NW7aQUMWghOfvrTxggrP+1ejV6o\"",
    "mtime": "2023-12-19T07:19:08.026Z",
    "size": 1220,
    "path": "../public/_nuxt/login.cb6987fc.js.br"
  },
  "/_nuxt/login.cb6987fc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a7-PxTSJ15pVGvGIOxzO4Yd2n++A3g\"",
    "mtime": "2023-12-19T07:19:08.022Z",
    "size": 1447,
    "path": "../public/_nuxt/login.cb6987fc.js.gz"
  },
  "/_nuxt/newsList.be95b59c.js": {
    "type": "application/javascript",
    "etag": "\"e6-ma+DdJEU29UcrtzLfZOYwUTlg2E\"",
    "mtime": "2023-12-19T07:19:07.014Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.be95b59c.js"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2023-12-19T07:19:07.013Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2023-12-19T07:19:08.036Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-lKpfiM20kgjPtEexL8DqS5VOzRE\"",
    "mtime": "2023-12-19T07:19:08.027Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/orders.92769648.js": {
    "type": "application/javascript",
    "etag": "\"2595-K8FdQBXFECR4swQp/4LqLaeJVFk\"",
    "mtime": "2023-12-19T07:19:07.012Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.92769648.js"
  },
  "/_nuxt/orders.92769648.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b0b-KLVaUW8vUHQoQELpMVbse/Oy8WY\"",
    "mtime": "2023-12-19T07:19:08.047Z",
    "size": 2827,
    "path": "../public/_nuxt/orders.92769648.js.br"
  },
  "/_nuxt/orders.92769648.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfe-YCNHo+nH9+2G5MfoieDON9Bp8aY\"",
    "mtime": "2023-12-19T07:19:08.036Z",
    "size": 3326,
    "path": "../public/_nuxt/orders.92769648.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-12-19T07:19:07.012Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-12-19T07:19:08.083Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-12-19T07:19:08.048Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.f1a46f9e.js": {
    "type": "application/javascript",
    "etag": "\"169d-LUy0cFL3L3tXsaP7+z6G4rS9cz4\"",
    "mtime": "2023-12-19T07:19:07.011Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.f1a46f9e.js"
  },
  "/_nuxt/profile.f1a46f9e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83e-1qsg/bk8QAYH30tSEc32SPh9N20\"",
    "mtime": "2023-12-19T07:19:08.091Z",
    "size": 2110,
    "path": "../public/_nuxt/profile.f1a46f9e.js.br"
  },
  "/_nuxt/profile.f1a46f9e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9aa-Q7NZHgfp/4654baZ49962Ye3f6s\"",
    "mtime": "2023-12-19T07:19:08.084Z",
    "size": 2474,
    "path": "../public/_nuxt/profile.f1a46f9e.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-12-19T07:19:07.011Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-12-19T07:19:08.095Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-12-19T07:19:08.092Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.e565b841.js": {
    "type": "application/javascript",
    "etag": "\"11bd-ojY1sbzojUfhTHHNQK7H7HClKDc\"",
    "mtime": "2023-12-19T07:19:07.010Z",
    "size": 4541,
    "path": "../public/_nuxt/register.e565b841.js"
  },
  "/_nuxt/register.e565b841.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bd-DM+T6eCSMcGoL4lTqqjMF42kWgI\"",
    "mtime": "2023-12-19T07:19:08.102Z",
    "size": 1469,
    "path": "../public/_nuxt/register.e565b841.js.br"
  },
  "/_nuxt/register.e565b841.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fd-71Eor6e7f1Xy2V9SmCbkprsc6ow\"",
    "mtime": "2023-12-19T07:19:08.096Z",
    "size": 1789,
    "path": "../public/_nuxt/register.e565b841.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-19T07:19:07.010Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-19T07:19:08.105Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-19T07:19:08.103Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-12-19T07:19:07.009Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-12-19T07:19:07.007Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-12-19T07:19:07.046Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-12-19T07:19:07.045Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-12-19T07:19:07.045Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-12-19T07:19:07.044Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-12-19T07:19:07.043Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-12-19T07:19:07.043Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-12-19T07:19:08.111Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-12-19T07:19:08.108Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
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
