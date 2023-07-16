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
    "mtime": "2023-07-16T05:00:55.738Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-16T05:00:55.722Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.45f7082c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b6d-VvrrFRsXbDJ9M/h80auLEntP6aE\"",
    "mtime": "2023-07-16T05:00:55.719Z",
    "size": 19309,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css"
  },
  "/_nuxt/BasketInfo.45f7082c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"72a-KqDoyXblYQJ65j2nly9ogCljD/w\"",
    "mtime": "2023-07-16T05:00:55.792Z",
    "size": 1834,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css.br"
  },
  "/_nuxt/BasketInfo.45f7082c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9da-o1rTuBRbNvmUhnOBP8/kTXHz2Fk\"",
    "mtime": "2023-07-16T05:00:55.744Z",
    "size": 2522,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css.gz"
  },
  "/_nuxt/BasketInfo.5d3b744b.js": {
    "type": "application/javascript",
    "etag": "\"96e-DNVBAK89W3AKipihffh0kssCTHk\"",
    "mtime": "2023-07-16T05:00:55.718Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.5d3b744b.js"
  },
  "/_nuxt/BasketInfo.5d3b744b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3dd-wACadMzEF1+1EUOjKI84xPMl1uk\"",
    "mtime": "2023-07-16T05:00:55.798Z",
    "size": 989,
    "path": "../public/_nuxt/BasketInfo.5d3b744b.js.br"
  },
  "/_nuxt/BasketInfo.5d3b744b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49a-a7ll4jbm2ZZvoDnsgl5M4l4DHwc\"",
    "mtime": "2023-07-16T05:00:55.794Z",
    "size": 1178,
    "path": "../public/_nuxt/BasketInfo.5d3b744b.js.gz"
  },
  "/_nuxt/CatalogProduct.4d181af1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1eb9-Gpymc9qNz5CtUu33gLaLolXVusk\"",
    "mtime": "2023-07-16T05:00:55.718Z",
    "size": 7865,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css"
  },
  "/_nuxt/CatalogProduct.4d181af1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b6-5TL3vGX4IJ+gtLAattuiw2ShZEY\"",
    "mtime": "2023-07-16T05:00:55.812Z",
    "size": 1718,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css.br"
  },
  "/_nuxt/CatalogProduct.4d181af1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7c0-GI7/2nWisfA2RmEJ3QZdbRxnpiE\"",
    "mtime": "2023-07-16T05:00:55.799Z",
    "size": 1984,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css.gz"
  },
  "/_nuxt/CatalogProduct.79178a57.js": {
    "type": "application/javascript",
    "etag": "\"bea-xk+60DAzbA6fm7QVJuKrbyCx1Qk\"",
    "mtime": "2023-07-16T05:00:55.717Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.79178a57.js"
  },
  "/_nuxt/CatalogProduct.79178a57.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b3-4DnhhVQy1SgCHUDM6uk6Gvyq/W4\"",
    "mtime": "2023-07-16T05:00:55.818Z",
    "size": 1203,
    "path": "../public/_nuxt/CatalogProduct.79178a57.js.br"
  },
  "/_nuxt/CatalogProduct.79178a57.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"555-jQeVlDL10pyYU8AQaKBEV1XSccg\"",
    "mtime": "2023-07-16T05:00:55.813Z",
    "size": 1365,
    "path": "../public/_nuxt/CatalogProduct.79178a57.js.gz"
  },
  "/_nuxt/FavoriteComp.895c04de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31f3-R8PA2Y5pi/4D3/9hFYxTm4Akr9s\"",
    "mtime": "2023-07-16T05:00:55.716Z",
    "size": 12787,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css"
  },
  "/_nuxt/FavoriteComp.895c04de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"63a-bQcmKhHJ23bIKne1/kVyNiYeF/c\"",
    "mtime": "2023-07-16T05:00:55.835Z",
    "size": 1594,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css.br"
  },
  "/_nuxt/FavoriteComp.895c04de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7e3-6H5cx/4lesO60SuelmCY8XpI3PY\"",
    "mtime": "2023-07-16T05:00:55.819Z",
    "size": 2019,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css.gz"
  },
  "/_nuxt/FavoriteComp.c0bd540d.js": {
    "type": "application/javascript",
    "etag": "\"c46-tYaADKIYzDBfl+xEO/6LQv0C3FM\"",
    "mtime": "2023-07-16T05:00:55.716Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.c0bd540d.js"
  },
  "/_nuxt/FavoriteComp.c0bd540d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3bc-jWdhcs8JPadcH0f8OosvTpl1Y6g\"",
    "mtime": "2023-07-16T05:00:55.841Z",
    "size": 956,
    "path": "../public/_nuxt/FavoriteComp.c0bd540d.js.br"
  },
  "/_nuxt/FavoriteComp.c0bd540d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"456-/6jDZfWnmSUDAw4g9YtMkEX7eKQ\"",
    "mtime": "2023-07-16T05:00:55.836Z",
    "size": 1110,
    "path": "../public/_nuxt/FavoriteComp.c0bd540d.js.gz"
  },
  "/_nuxt/ImageForm.e116c01a.js": {
    "type": "application/javascript",
    "etag": "\"225-39wrek/KnZ9yfIgIiAsWmYdwigI\"",
    "mtime": "2023-07-16T05:00:55.715Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.e116c01a.js"
  },
  "/_nuxt/LoadingComp.ba52ec1d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-Lt0O9MZyoBqLZhCvzpGQcmGfztU\"",
    "mtime": "2023-07-16T05:00:55.714Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.ba52ec1d.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-16T05:00:55.714Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4bc-lMa/2oMDlBunyQ+EyKWL+HNL+GI\"",
    "mtime": "2023-07-16T05:00:55.713Z",
    "size": 1212,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1d1-1Fh5VsjQ53gow03V+1oVYan+2ns\"",
    "mtime": "2023-07-16T05:00:55.845Z",
    "size": 465,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.br"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"234-UBpy5IK2zcWy+lc9Mom7Ya606S4\"",
    "mtime": "2023-07-16T05:00:55.842Z",
    "size": 564,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.gz"
  },
  "/_nuxt/OrderProductList.b5b5ce6b.js": {
    "type": "application/javascript",
    "etag": "\"459-2apWjTaeiYIkzSPhmTqyMavcxrs\"",
    "mtime": "2023-07-16T05:00:55.712Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.b5b5ce6b.js"
  },
  "/_nuxt/OrderProductList.b5b5ce6b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-HobUEDsPkwsfr9/yV3F/6dgpAEc\"",
    "mtime": "2023-07-16T05:00:55.848Z",
    "size": 516,
    "path": "../public/_nuxt/OrderProductList.b5b5ce6b.js.br"
  },
  "/_nuxt/OrderProductList.b5b5ce6b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"238-SUxuS8tzI1kpdaoc1UwxSrFSyKs\"",
    "mtime": "2023-07-16T05:00:55.845Z",
    "size": 568,
    "path": "../public/_nuxt/OrderProductList.b5b5ce6b.js.gz"
  },
  "/_nuxt/RatingComp.719a0398.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"122d-XZWY7f4ocOep0TA7es2vKAk1Zls\"",
    "mtime": "2023-07-16T05:00:55.711Z",
    "size": 4653,
    "path": "../public/_nuxt/RatingComp.719a0398.css"
  },
  "/_nuxt/RatingComp.719a0398.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"460-mMvFzEBlGeka4WXe9/EJ6rgc2Vo\"",
    "mtime": "2023-07-16T05:00:55.856Z",
    "size": 1120,
    "path": "../public/_nuxt/RatingComp.719a0398.css.br"
  },
  "/_nuxt/RatingComp.719a0398.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"52a-i3c/9A78phj7ls0zjCfyGmFuMGU\"",
    "mtime": "2023-07-16T05:00:55.849Z",
    "size": 1322,
    "path": "../public/_nuxt/RatingComp.719a0398.css.gz"
  },
  "/_nuxt/RatingComp.b247a986.js": {
    "type": "application/javascript",
    "etag": "\"bac-rOWOoU0COUZyaHtpiYNP7Swawfw\"",
    "mtime": "2023-07-16T05:00:55.711Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.b247a986.js"
  },
  "/_nuxt/RatingComp.b247a986.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d3-zLIp9VNN4/v0psVeXAZhnAdt65k\"",
    "mtime": "2023-07-16T05:00:55.863Z",
    "size": 979,
    "path": "../public/_nuxt/RatingComp.b247a986.js.br"
  },
  "/_nuxt/RatingComp.b247a986.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47a-kMUzMdEVSKLizcoF7AroQkOmHVg\"",
    "mtime": "2023-07-16T05:00:55.857Z",
    "size": 1146,
    "path": "../public/_nuxt/RatingComp.b247a986.js.gz"
  },
  "/_nuxt/UserBasket.1a567712.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34b4-+BtrmeAbDvUU/cGbegzwRkQAHv4\"",
    "mtime": "2023-07-16T05:00:55.710Z",
    "size": 13492,
    "path": "../public/_nuxt/UserBasket.1a567712.css"
  },
  "/_nuxt/UserBasket.1a567712.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ef-J6dAPNPYNnAlLRuSkm/Man0A03g\"",
    "mtime": "2023-07-16T05:00:55.885Z",
    "size": 1775,
    "path": "../public/_nuxt/UserBasket.1a567712.css.br"
  },
  "/_nuxt/UserBasket.1a567712.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"895-QUtgvkiz6NhBRAwBE1rzc6nK/so\"",
    "mtime": "2023-07-16T05:00:55.864Z",
    "size": 2197,
    "path": "../public/_nuxt/UserBasket.1a567712.css.gz"
  },
  "/_nuxt/UserBasket.9742fac8.js": {
    "type": "application/javascript",
    "etag": "\"1410-OBSFLUHPE+jpHKJpEMC2s/YikVM\"",
    "mtime": "2023-07-16T05:00:55.710Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.9742fac8.js"
  },
  "/_nuxt/UserBasket.9742fac8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76e-KPuLKwCzdjzbx27DlE/G1g8rg84\"",
    "mtime": "2023-07-16T05:00:55.893Z",
    "size": 1902,
    "path": "../public/_nuxt/UserBasket.9742fac8.js.br"
  },
  "/_nuxt/UserBasket.9742fac8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"891-4JUtY/Hqtx73zlP7k4O4sdpKAZQ\"",
    "mtime": "2023-07-16T05:00:55.886Z",
    "size": 2193,
    "path": "../public/_nuxt/UserBasket.9742fac8.js.gz"
  },
  "/_nuxt/_id_.2f813946.js": {
    "type": "application/javascript",
    "etag": "\"4be-3uWFEXpwoLzbNidAfjuOMh/vqDo\"",
    "mtime": "2023-07-16T05:00:55.709Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.2f813946.js"
  },
  "/_nuxt/_id_.2f813946.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"269-x73vCGOoheCT8FqfYVO2bkHXbpM\"",
    "mtime": "2023-07-16T05:00:55.897Z",
    "size": 617,
    "path": "../public/_nuxt/_id_.2f813946.js.br"
  },
  "/_nuxt/_id_.2f813946.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dc-wLF0k9zC+OtyED8vKS8SiBi1kUw\"",
    "mtime": "2023-07-16T05:00:55.894Z",
    "size": 732,
    "path": "../public/_nuxt/_id_.2f813946.js.gz"
  },
  "/_nuxt/_id_.7139cb4a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-F44+0pp8VrY6ziulXTkaBVxYEcw\"",
    "mtime": "2023-07-16T05:00:55.709Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.7139cb4a.css"
  },
  "/_nuxt/_id_.7139cb4a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-0HRwrKJkWDu/BjUa/35VgYsvZd0\"",
    "mtime": "2023-07-16T05:00:55.907Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.7139cb4a.css.br"
  },
  "/_nuxt/_id_.7139cb4a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56a-2dwn0QSrDAz0m6RWDNq+4lQC5Po\"",
    "mtime": "2023-07-16T05:00:55.897Z",
    "size": 1386,
    "path": "../public/_nuxt/_id_.7139cb4a.css.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-16T05:00:55.708Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.df4f8f39.js": {
    "type": "application/javascript",
    "etag": "\"1556-yn6F68AGmJsjRRz68MHxzx271dA\"",
    "mtime": "2023-07-16T05:00:55.705Z",
    "size": 5462,
    "path": "../public/_nuxt/_id_.df4f8f39.js"
  },
  "/_nuxt/_id_.df4f8f39.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"7b6-Nh64T3kSKU7F7UPEeKBFATFl6SU\"",
    "mtime": "2023-07-16T05:00:55.917Z",
    "size": 1974,
    "path": "../public/_nuxt/_id_.df4f8f39.js.br"
  },
  "/_nuxt/_id_.df4f8f39.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"8b6-/9ad8rk0C1PIwwQ0KB37wNHfcj8\"",
    "mtime": "2023-07-16T05:00:55.909Z",
    "size": 2230,
    "path": "../public/_nuxt/_id_.df4f8f39.js.gz"
  },
  "/_nuxt/basket.6d3e52a5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"191d-UZlRXaFh4rIanpmM5XmLrATG7yI\"",
    "mtime": "2023-07-16T05:00:55.704Z",
    "size": 6429,
    "path": "../public/_nuxt/basket.6d3e52a5.css"
  },
  "/_nuxt/basket.6d3e52a5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"532-bouBRodaAoVjbeMimrzSDKKekpQ\"",
    "mtime": "2023-07-16T05:00:55.926Z",
    "size": 1330,
    "path": "../public/_nuxt/basket.6d3e52a5.css.br"
  },
  "/_nuxt/basket.6d3e52a5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"60f-puuRZkIFSveeqwacxnK4KJ2y/3I\"",
    "mtime": "2023-07-16T05:00:55.918Z",
    "size": 1551,
    "path": "../public/_nuxt/basket.6d3e52a5.css.gz"
  },
  "/_nuxt/basket.dc4d70a2.js": {
    "type": "application/javascript",
    "etag": "\"270-K/eers24LhmLCGm6a+M8R09c4r4\"",
    "mtime": "2023-07-16T05:00:55.703Z",
    "size": 624,
    "path": "../public/_nuxt/basket.dc4d70a2.js"
  },
  "/_nuxt/catalog.2947ef48.js": {
    "type": "application/javascript",
    "etag": "\"1c86-Wydc6DsJdM2NN4agMUrb6A/ZT3s\"",
    "mtime": "2023-07-16T05:00:55.703Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.2947ef48.js"
  },
  "/_nuxt/catalog.2947ef48.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"98d-WCh8+w8OCc5Ik9w+BLsY0EawfZ8\"",
    "mtime": "2023-07-16T05:00:55.964Z",
    "size": 2445,
    "path": "../public/_nuxt/catalog.2947ef48.js.br"
  },
  "/_nuxt/catalog.2947ef48.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af7-ZxYBhuYm2IuY5G1aXxfDn7ZTG5Y\"",
    "mtime": "2023-07-16T05:00:55.954Z",
    "size": 2807,
    "path": "../public/_nuxt/catalog.2947ef48.js.gz"
  },
  "/_nuxt/catalog.b5faef7f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-Gh7Z2rVztkFI2Kec26bvfvmvuPM\"",
    "mtime": "2023-07-16T05:00:55.702Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.b5faef7f.css"
  },
  "/_nuxt/catalog.b5faef7f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"705-eLjozyB+8i9JBpHVYfSd6cqOTnc\"",
    "mtime": "2023-07-16T05:00:55.974Z",
    "size": 1797,
    "path": "../public/_nuxt/catalog.b5faef7f.css.br"
  },
  "/_nuxt/catalog.b5faef7f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"817-Yoob6OEQZgrCx/0ma3YhW1B5hwI\"",
    "mtime": "2023-07-16T05:00:55.965Z",
    "size": 2071,
    "path": "../public/_nuxt/catalog.b5faef7f.css.gz"
  },
  "/_nuxt/checkout.915ecf08.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a9-xI0B532hZ6lK39OQQnlZ5d0RhQA\"",
    "mtime": "2023-07-16T05:00:55.702Z",
    "size": 156073,
    "path": "../public/_nuxt/checkout.915ecf08.css"
  },
  "/_nuxt/checkout.915ecf08.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fd6-DOXpu12OaugbhX75kWXLPHfHMxY\"",
    "mtime": "2023-07-16T05:00:56.105Z",
    "size": 20438,
    "path": "../public/_nuxt/checkout.915ecf08.css.br"
  },
  "/_nuxt/checkout.915ecf08.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6040-tgz22lOWGjGCjGuvy+ZiDtv31i0\"",
    "mtime": "2023-07-16T05:00:55.978Z",
    "size": 24640,
    "path": "../public/_nuxt/checkout.915ecf08.css.gz"
  },
  "/_nuxt/checkout.91c540fd.js": {
    "type": "application/javascript",
    "etag": "\"145f7-HlvV5u2oxi7R7w6FvLU0bRnqO3Y\"",
    "mtime": "2023-07-16T05:00:55.700Z",
    "size": 83447,
    "path": "../public/_nuxt/checkout.91c540fd.js"
  },
  "/_nuxt/checkout.91c540fd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"505d-Mc0dfGerQANpJjVSUKFnUilmXvI\"",
    "mtime": "2023-07-16T05:00:56.204Z",
    "size": 20573,
    "path": "../public/_nuxt/checkout.91c540fd.js.br"
  },
  "/_nuxt/checkout.91c540fd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5d88-xfs3EjKh08uWRrT+Py67RBSKEO8\"",
    "mtime": "2023-07-16T05:00:56.109Z",
    "size": 23944,
    "path": "../public/_nuxt/checkout.91c540fd.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-16T05:00:55.699Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.0e91259a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2242-e9msM+lcXfQPbsZU91xyMD91Exo\"",
    "mtime": "2023-07-16T05:00:55.698Z",
    "size": 8770,
    "path": "../public/_nuxt/entry.0e91259a.css"
  },
  "/_nuxt/entry.0e91259a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"870-0WXX5XRCgVIh2rByNNsVUNg8JiE\"",
    "mtime": "2023-07-16T05:00:56.217Z",
    "size": 2160,
    "path": "../public/_nuxt/entry.0e91259a.css.br"
  },
  "/_nuxt/entry.0e91259a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9d8-MZiNwZpZLNvuhY1gIGq6f9hVPAo\"",
    "mtime": "2023-07-16T05:00:56.205Z",
    "size": 2520,
    "path": "../public/_nuxt/entry.0e91259a.css.gz"
  },
  "/_nuxt/entry.cb1d22c2.js": {
    "type": "application/javascript",
    "etag": "\"33837-o9FiG9GEAceuK4OoiAgMqtpLO90\"",
    "mtime": "2023-07-16T05:00:55.697Z",
    "size": 210999,
    "path": "../public/_nuxt/entry.cb1d22c2.js"
  },
  "/_nuxt/entry.cb1d22c2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"114dd-8IzACTB7bLMGVpl9RPGP1+bIA4M\"",
    "mtime": "2023-07-16T05:00:56.553Z",
    "size": 70877,
    "path": "../public/_nuxt/entry.cb1d22c2.js.br"
  },
  "/_nuxt/entry.cb1d22c2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13652-4xtyTxxGazlwu29UHaal4iA58ck\"",
    "mtime": "2023-07-16T05:00:56.225Z",
    "size": 79442,
    "path": "../public/_nuxt/entry.cb1d22c2.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-16T05:00:55.695Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-16T05:00:56.559Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-16T05:00:56.554Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.88bd965c.js": {
    "type": "application/javascript",
    "etag": "\"8a4-T2LDCkWqk4GPKdM5bWcy94sN8p4\"",
    "mtime": "2023-07-16T05:00:55.694Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.88bd965c.js"
  },
  "/_nuxt/error-404.88bd965c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-i/4xUOhVrF0O0/ioovRwDvTQgvE\"",
    "mtime": "2023-07-16T05:00:56.566Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.88bd965c.js.br"
  },
  "/_nuxt/error-404.88bd965c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-v/+c6tkGBSAnAZwsaajOEvb8yLw\"",
    "mtime": "2023-07-16T05:00:56.562Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.88bd965c.js.gz"
  },
  "/_nuxt/error-500.95ee3e5e.js": {
    "type": "application/javascript",
    "etag": "\"757-GvV9iqDMOzk920PgcIqq7vhXdz8\"",
    "mtime": "2023-07-16T05:00:55.693Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.95ee3e5e.js"
  },
  "/_nuxt/error-500.95ee3e5e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-EUlWNwbpNGRv6XgH6UE50V2saic\"",
    "mtime": "2023-07-16T05:00:56.570Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.95ee3e5e.js.br"
  },
  "/_nuxt/error-500.95ee3e5e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-9+u5728j2dfiBKxQDgpmhUa+hA8\"",
    "mtime": "2023-07-16T05:00:56.567Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.95ee3e5e.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-16T05:00:55.693Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-16T05:00:56.575Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-16T05:00:56.571Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.6cadde0b.js": {
    "type": "application/javascript",
    "etag": "\"45e-jqr6sLyl+gN53DZ260jCcOOHOXk\"",
    "mtime": "2023-07-16T05:00:55.692Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.6cadde0b.js"
  },
  "/_nuxt/error-component.6cadde0b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-Cemq7ETnGcdUSA3o1tQemC4fYlo\"",
    "mtime": "2023-07-16T05:00:56.578Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.6cadde0b.js.br"
  },
  "/_nuxt/error-component.6cadde0b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-RsWjfilsxU02wrucczvpq1ktaKY\"",
    "mtime": "2023-07-16T05:00:56.576Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.6cadde0b.js.gz"
  },
  "/_nuxt/favorite.9e539a5c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19e1-O90FmTqmPbxCLOheAYmy8O7xamQ\"",
    "mtime": "2023-07-16T05:00:55.691Z",
    "size": 6625,
    "path": "../public/_nuxt/favorite.9e539a5c.css"
  },
  "/_nuxt/favorite.9e539a5c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"559-zHm1EAOwy7qnVkYv1p/5lpnBGDI\"",
    "mtime": "2023-07-16T05:00:56.587Z",
    "size": 1369,
    "path": "../public/_nuxt/favorite.9e539a5c.css.br"
  },
  "/_nuxt/favorite.9e539a5c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"649-ZNhQwCrjnSovED5kD/DAyVFbK1w\"",
    "mtime": "2023-07-16T05:00:56.579Z",
    "size": 1609,
    "path": "../public/_nuxt/favorite.9e539a5c.css.gz"
  },
  "/_nuxt/favorite.fbd83206.js": {
    "type": "application/javascript",
    "etag": "\"a30-HRkE9bFpmxlLSUZsXRH+msfvp5o\"",
    "mtime": "2023-07-16T05:00:55.690Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.fbd83206.js"
  },
  "/_nuxt/favorite.fbd83206.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"443-VW29J3SwicZDjNXoMOcpNKtsSZg\"",
    "mtime": "2023-07-16T05:00:56.592Z",
    "size": 1091,
    "path": "../public/_nuxt/favorite.fbd83206.js.br"
  },
  "/_nuxt/favorite.fbd83206.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f3-EMsmxGgYpDOKYUKv/SlIN1mj25Q\"",
    "mtime": "2023-07-16T05:00:56.588Z",
    "size": 1267,
    "path": "../public/_nuxt/favorite.fbd83206.js.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-16T05:00:55.689Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.a5700383.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"58de-mWR+4qX5m3YRzr3r8SAg1RouNUU\"",
    "mtime": "2023-07-16T05:00:55.688Z",
    "size": 22750,
    "path": "../public/_nuxt/index.a5700383.css"
  },
  "/_nuxt/index.a5700383.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12aa-1G9TesnP2eoKbnljOvMstL1gU54\"",
    "mtime": "2023-07-16T05:00:56.621Z",
    "size": 4778,
    "path": "../public/_nuxt/index.a5700383.css.br"
  },
  "/_nuxt/index.a5700383.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1618-ZJd7Ff6hYtMq3DVkxD7RjdngMFs\"",
    "mtime": "2023-07-16T05:00:56.594Z",
    "size": 5656,
    "path": "../public/_nuxt/index.a5700383.css.gz"
  },
  "/_nuxt/index.a8b1ca84.js": {
    "type": "application/javascript",
    "etag": "\"16a3e-dl80iOhmH5TK2A6HK8ANjC9I6lw\"",
    "mtime": "2023-07-16T05:00:55.687Z",
    "size": 92734,
    "path": "../public/_nuxt/index.a8b1ca84.js"
  },
  "/_nuxt/index.a8b1ca84.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62ff-b3gpRPtND1FdbyU1rAiLC6o4BlA\"",
    "mtime": "2023-07-16T05:00:56.736Z",
    "size": 25343,
    "path": "../public/_nuxt/index.a8b1ca84.js.br"
  },
  "/_nuxt/index.a8b1ca84.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f69-EQKDO2QhGSx2LoKa+Z8Z+W80OHk\"",
    "mtime": "2023-07-16T05:00:56.624Z",
    "size": 28521,
    "path": "../public/_nuxt/index.a8b1ca84.js.gz"
  },
  "/_nuxt/index.c0a5ffda.js": {
    "type": "application/javascript",
    "etag": "\"5a0-Sy5g/EfcT22WlRh8yhJVFl6UCLE\"",
    "mtime": "2023-07-16T05:00:55.685Z",
    "size": 1440,
    "path": "../public/_nuxt/index.c0a5ffda.js"
  },
  "/_nuxt/index.c0a5ffda.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2c8-j1UeYz5xEGa2KPo5u6DxKuaL9pc\"",
    "mtime": "2023-07-16T05:00:56.740Z",
    "size": 712,
    "path": "../public/_nuxt/index.c0a5ffda.js.br"
  },
  "/_nuxt/index.c0a5ffda.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"347-+uPsgrkyRVb3uVRnxyxa+AHiB7Q\"",
    "mtime": "2023-07-16T05:00:56.737Z",
    "size": 839,
    "path": "../public/_nuxt/index.c0a5ffda.js.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-16T05:00:55.684Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-16T05:00:56.745Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-16T05:00:56.741Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/index.e845b7bb.js": {
    "type": "application/javascript",
    "etag": "\"3abf-7PWR7ZS9GPPmat+tGjrOKDWp0DY\"",
    "mtime": "2023-07-16T05:00:55.683Z",
    "size": 15039,
    "path": "../public/_nuxt/index.e845b7bb.js"
  },
  "/_nuxt/index.e845b7bb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f6-odr/MnOpXdLZSnGQ0yDOJ/FWbIc\"",
    "mtime": "2023-07-16T05:00:56.762Z",
    "size": 4854,
    "path": "../public/_nuxt/index.e845b7bb.js.br"
  },
  "/_nuxt/index.e845b7bb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-N4rwc/0rYBr9TKRkHMPkVB8Ufac\"",
    "mtime": "2023-07-16T05:00:56.746Z",
    "size": 5360,
    "path": "../public/_nuxt/index.e845b7bb.js.gz"
  },
  "/_nuxt/isAuth.c326f1b3.js": {
    "type": "application/javascript",
    "etag": "\"213-PtZdiCl578WJ3jjanUsnKc0Kdoo\"",
    "mtime": "2023-07-16T05:00:55.682Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.c326f1b3.js"
  },
  "/_nuxt/login.043c5a90.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-ziowIh47Uh+H019MZZt0w/Aakvw\"",
    "mtime": "2023-07-16T05:00:55.681Z",
    "size": 2274,
    "path": "../public/_nuxt/login.043c5a90.css"
  },
  "/_nuxt/login.043c5a90.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"26b-zKujsAA+jC/TTajynLgx6VSqJCQ\"",
    "mtime": "2023-07-16T05:00:56.767Z",
    "size": 619,
    "path": "../public/_nuxt/login.043c5a90.css.br"
  },
  "/_nuxt/login.043c5a90.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"324-75U5MluqaBw60iQDLH7ROQjElZI\"",
    "mtime": "2023-07-16T05:00:56.763Z",
    "size": 804,
    "path": "../public/_nuxt/login.043c5a90.css.gz"
  },
  "/_nuxt/login.d02826ab.js": {
    "type": "application/javascript",
    "etag": "\"830-FjW57LmU+/NnDz/294mA1mNtc4I\"",
    "mtime": "2023-07-16T05:00:55.679Z",
    "size": 2096,
    "path": "../public/_nuxt/login.d02826ab.js"
  },
  "/_nuxt/login.d02826ab.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3da-ee3xb45Meb40mcgde7dfbeKvs2Y\"",
    "mtime": "2023-07-16T05:00:56.771Z",
    "size": 986,
    "path": "../public/_nuxt/login.d02826ab.js.br"
  },
  "/_nuxt/login.d02826ab.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a7-c4ZFFYxCbygNT6sCAEyWGJCGGSU\"",
    "mtime": "2023-07-16T05:00:56.768Z",
    "size": 1191,
    "path": "../public/_nuxt/login.d02826ab.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-16T05:00:55.677Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.c5648d98.js": {
    "type": "application/javascript",
    "etag": "\"4af-4tZZ3zJWNaSw87gLmLpk/Moc8co\"",
    "mtime": "2023-07-16T05:00:55.673Z",
    "size": 1199,
    "path": "../public/_nuxt/news.c5648d98.js"
  },
  "/_nuxt/news.c5648d98.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a4-xbUVh7GKVT9bWuTBCNvgnn72FcE\"",
    "mtime": "2023-07-16T05:00:56.774Z",
    "size": 420,
    "path": "../public/_nuxt/news.c5648d98.js.br"
  },
  "/_nuxt/news.c5648d98.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"216-Clv8pq5LCkxXz+9nQlgsf/iQQLM\"",
    "mtime": "2023-07-16T05:00:56.772Z",
    "size": 534,
    "path": "../public/_nuxt/news.c5648d98.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-16T05:00:55.672Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.0338cf72.js": {
    "type": "application/javascript",
    "etag": "\"10a-Tr4/n3HFobzVHmo3ZT9igmKYi9U\"",
    "mtime": "2023-07-16T05:00:55.672Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.0338cf72.js"
  },
  "/_nuxt/orders.08b7443b.js": {
    "type": "application/javascript",
    "etag": "\"18c4-gkwotlwJ0i8ep/rANb38aXe9Ujg\"",
    "mtime": "2023-07-16T05:00:55.671Z",
    "size": 6340,
    "path": "../public/_nuxt/orders.08b7443b.js"
  },
  "/_nuxt/orders.08b7443b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"875-pnELiZbFCq/acQqUnag7wbBBNl8\"",
    "mtime": "2023-07-16T05:00:56.784Z",
    "size": 2165,
    "path": "../public/_nuxt/orders.08b7443b.js.br"
  },
  "/_nuxt/orders.08b7443b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9f2-MGU0jWMWPKAAk26we1XqbfvcrzI\"",
    "mtime": "2023-07-16T05:00:56.776Z",
    "size": 2546,
    "path": "../public/_nuxt/orders.08b7443b.js.gz"
  },
  "/_nuxt/orders.4dfbb4f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"238d-q9C4bvHzAl2Jll4gIdwYd3IW7d8\"",
    "mtime": "2023-07-16T05:00:55.671Z",
    "size": 9101,
    "path": "../public/_nuxt/orders.4dfbb4f8.css"
  },
  "/_nuxt/orders.4dfbb4f8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"775-bjviy8gaFzbRHTe10jcrMzp7k20\"",
    "mtime": "2023-07-16T05:00:56.794Z",
    "size": 1909,
    "path": "../public/_nuxt/orders.4dfbb4f8.css.br"
  },
  "/_nuxt/orders.4dfbb4f8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ab-eyXRk3zEg1vAjK5Q7FDHsjhtjZM\"",
    "mtime": "2023-07-16T05:00:56.784Z",
    "size": 2219,
    "path": "../public/_nuxt/orders.4dfbb4f8.css.gz"
  },
  "/_nuxt/profile.0a1820da.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4af6-hJMjZKA7iMF6oSDjoa/MdZOXh8k\"",
    "mtime": "2023-07-16T05:00:55.670Z",
    "size": 19190,
    "path": "../public/_nuxt/profile.0a1820da.css"
  },
  "/_nuxt/profile.0a1820da.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6fd-L4zliQy+yH0ZI9ylhL7ohv73jOo\"",
    "mtime": "2023-07-16T05:00:56.821Z",
    "size": 1789,
    "path": "../public/_nuxt/profile.0a1820da.css.br"
  },
  "/_nuxt/profile.0a1820da.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"99e-PnaID5U2StM7y2B/ZOy9fskSacY\"",
    "mtime": "2023-07-16T05:00:56.795Z",
    "size": 2462,
    "path": "../public/_nuxt/profile.0a1820da.css.gz"
  },
  "/_nuxt/profile.1cf07b20.js": {
    "type": "application/javascript",
    "etag": "\"1241-S8SDesivyFXxQg1kSHZn2ImoGdI\"",
    "mtime": "2023-07-16T05:00:55.669Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.1cf07b20.js"
  },
  "/_nuxt/profile.1cf07b20.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"705-CFpyYoBQWabGqOBn+kaKti925u0\"",
    "mtime": "2023-07-16T05:00:56.828Z",
    "size": 1797,
    "path": "../public/_nuxt/profile.1cf07b20.js.br"
  },
  "/_nuxt/profile.1cf07b20.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83d-9e+7OYukyhs6ydYRgfNULqLNHpE\"",
    "mtime": "2023-07-16T05:00:56.822Z",
    "size": 2109,
    "path": "../public/_nuxt/profile.1cf07b20.js.gz"
  },
  "/_nuxt/register.4ef19161.js": {
    "type": "application/javascript",
    "etag": "\"1128-NeNuTCsF+i4HovuQZjqf4HDbwgQ\"",
    "mtime": "2023-07-16T05:00:55.669Z",
    "size": 4392,
    "path": "../public/_nuxt/register.4ef19161.js"
  },
  "/_nuxt/register.4ef19161.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"567-ogEPmeRDeWRf9LB86oVYYMZlu94\"",
    "mtime": "2023-07-16T05:00:56.834Z",
    "size": 1383,
    "path": "../public/_nuxt/register.4ef19161.js.br"
  },
  "/_nuxt/register.4ef19161.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"695-L9liL/d1oDLl6dZzak6S5wiPZvo\"",
    "mtime": "2023-07-16T05:00:56.828Z",
    "size": 1685,
    "path": "../public/_nuxt/register.4ef19161.js.gz"
  },
  "/_nuxt/register.710c22d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-/sFUU1VmP/10yIbpC6UvJC/YT2w\"",
    "mtime": "2023-07-16T05:00:55.668Z",
    "size": 2274,
    "path": "../public/_nuxt/register.710c22d3.css"
  },
  "/_nuxt/register.710c22d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"26d-Mxlg7W8Ys3mUJYREvT7vHX5nulg\"",
    "mtime": "2023-07-16T05:00:56.839Z",
    "size": 621,
    "path": "../public/_nuxt/register.710c22d3.css.br"
  },
  "/_nuxt/register.710c22d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"325-RiZXFZcV5KRM6mrNeWsp5y2Ol7U\"",
    "mtime": "2023-07-16T05:00:56.835Z",
    "size": 805,
    "path": "../public/_nuxt/register.710c22d3.css.gz"
  },
  "/_nuxt/removeFavorite.33e80b7c.js": {
    "type": "application/javascript",
    "etag": "\"3d2-02He4uTJdx/nMiiIEQWUMkzQFI0\"",
    "mtime": "2023-07-16T05:00:55.668Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.33e80b7c.js"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-16T05:00:55.667Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-16T05:00:55.665Z",
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
