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
    "mtime": "2023-09-22T19:05:17.676Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-09-22T19:05:17.664Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-09-22T19:05:17.663Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-09-22T19:05:17.649Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-09-22T19:05:17.639Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-09-22T19:05:17.628Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-09-22T19:05:17.628Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-09-22T19:05:18.765Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-09-22T19:05:18.763Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-09-22T19:05:17.607Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-09-22T19:05:17.605Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.7902a951.js": {
    "type": "application/javascript",
    "etag": "\"ae1-gJB8VbmfYKY+tIQ0auqac9LYCYw\"",
    "mtime": "2023-09-22T19:05:17.604Z",
    "size": 2785,
    "path": "../public/_nuxt/BasketInfo.7902a951.js"
  },
  "/_nuxt/BasketInfo.7902a951.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"438-jl1LgUlloxb0cyLrgJo055Ad3vs\"",
    "mtime": "2023-09-22T19:05:17.691Z",
    "size": 1080,
    "path": "../public/_nuxt/BasketInfo.7902a951.js.br"
  },
  "/_nuxt/BasketInfo.7902a951.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f9-ckJQfz+QQCxNPpGRuWkrwbzTzsI\"",
    "mtime": "2023-09-22T19:05:17.680Z",
    "size": 1273,
    "path": "../public/_nuxt/BasketInfo.7902a951.js.gz"
  },
  "/_nuxt/BasketInfo.92fc7163.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-xcGl1UY1o4tG6/AGuuATcPnB2K0\"",
    "mtime": "2023-09-22T19:05:17.604Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css"
  },
  "/_nuxt/BasketInfo.92fc7163.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f1-eRlFh8sgvA807OlTvBhBFm4yQxY\"",
    "mtime": "2023-09-22T19:05:17.719Z",
    "size": 1777,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css.br"
  },
  "/_nuxt/BasketInfo.92fc7163.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-4g+WXtKYKWTHrtegeAHa2sGv8qc\"",
    "mtime": "2023-09-22T19:05:17.692Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.92fc7163.css.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2023-09-22T19:05:17.603Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2023-09-22T19:05:17.739Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-fDfg0YqJdhUdj2bW+CSIESHKn9A\"",
    "mtime": "2023-09-22T19:05:17.720Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.2bd4d430.js": {
    "type": "application/javascript",
    "etag": "\"15bf-qFo2lArFzS+2BHVMrRQqw3GIkyY\"",
    "mtime": "2023-09-22T19:05:17.603Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.2bd4d430.js"
  },
  "/_nuxt/CatalogProduct.2bd4d430.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"790-TUx7Sg2mW4W6EntDdH6nRYnU2fg\"",
    "mtime": "2023-09-22T19:05:17.746Z",
    "size": 1936,
    "path": "../public/_nuxt/CatalogProduct.2bd4d430.js.br"
  },
  "/_nuxt/CatalogProduct.2bd4d430.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"88a-JwYT0IxYKGOkMG4cR73qzdxj9iM\"",
    "mtime": "2023-09-22T19:05:17.740Z",
    "size": 2186,
    "path": "../public/_nuxt/CatalogProduct.2bd4d430.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-09-22T19:05:17.602Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-09-22T19:05:17.763Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-09-22T19:05:17.748Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-09-22T19:05:17.601Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-09-22T19:05:17.769Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-09-22T19:05:17.764Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.9a5bee19.js": {
    "type": "application/javascript",
    "etag": "\"783-misY+njvG9tMdJ2CxF2r41ccE30\"",
    "mtime": "2023-09-22T19:05:17.601Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.9a5bee19.js"
  },
  "/_nuxt/FavoriteComp.9a5bee19.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28e-eaMdWCXTGWgcI6FjYyHNoXNR/CY\"",
    "mtime": "2023-09-22T19:05:17.773Z",
    "size": 654,
    "path": "../public/_nuxt/FavoriteComp.9a5bee19.js.br"
  },
  "/_nuxt/FavoriteComp.9a5bee19.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-8Ec74bR0IC8xFKfaF6kjddfTddU\"",
    "mtime": "2023-09-22T19:05:17.770Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.9a5bee19.js.gz"
  },
  "/_nuxt/FavoriteComp.9c6c0243.js": {
    "type": "application/javascript",
    "etag": "\"e2e-FZS9kxqjHDQTaQ86AJ8hY8mke78\"",
    "mtime": "2023-09-22T19:05:17.600Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.9c6c0243.js"
  },
  "/_nuxt/FavoriteComp.9c6c0243.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40d-9xgrkraYWYBVTGXrcjIi0TwHyTk\"",
    "mtime": "2023-09-22T19:05:17.779Z",
    "size": 1037,
    "path": "../public/_nuxt/FavoriteComp.9c6c0243.js.br"
  },
  "/_nuxt/FavoriteComp.9c6c0243.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-FyLspLTAMogyh2AwgR404aWmcGI\"",
    "mtime": "2023-09-22T19:05:17.773Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.9c6c0243.js.gz"
  },
  "/_nuxt/ImageForm.0d002937.js": {
    "type": "application/javascript",
    "etag": "\"1ac-QxJ1aLbKqh3B9Rz6iobIplW7hQo\"",
    "mtime": "2023-09-22T19:05:17.600Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.0d002937.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-09-22T19:05:17.599Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.f345c4e0.js": {
    "type": "application/javascript",
    "etag": "\"1fe-euNycQGIzdcEqvuQPJ+/LFQekII\"",
    "mtime": "2023-09-22T19:05:17.599Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.f345c4e0.js"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2023-09-22T19:05:17.598Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2023-09-22T19:05:17.782Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-WOaPNl2FrMc79ksmoZcITIiKmKk\"",
    "mtime": "2023-09-22T19:05:17.780Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.5f4679cb.js": {
    "type": "application/javascript",
    "etag": "\"431-ue6T5xC7pvc2s76Qp5wDZotIFMU\"",
    "mtime": "2023-09-22T19:05:17.598Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.5f4679cb.js"
  },
  "/_nuxt/OrderProductList.5f4679cb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20c-OylBhoaPYioU2oC2wB90g7hYeT8\"",
    "mtime": "2023-09-22T19:05:17.785Z",
    "size": 524,
    "path": "../public/_nuxt/OrderProductList.5f4679cb.js.br"
  },
  "/_nuxt/OrderProductList.5f4679cb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-BE2fJtP8lyNS7/xuz0DX+bjnojo\"",
    "mtime": "2023-09-22T19:05:17.783Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.5f4679cb.js.gz"
  },
  "/_nuxt/UserBasket.67a3a6aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-Q8GJf0KQTKh54MKSM+v2CiInheg\"",
    "mtime": "2023-09-22T19:05:17.597Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css"
  },
  "/_nuxt/UserBasket.67a3a6aa.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c2-zvge28Xb6bbVCi3tE/M9Ab2HozE\"",
    "mtime": "2023-09-22T19:05:17.802Z",
    "size": 1730,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css.br"
  },
  "/_nuxt/UserBasket.67a3a6aa.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-XIijkWBmHba/rqrswkxzR0W0+TI\"",
    "mtime": "2023-09-22T19:05:17.786Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.67a3a6aa.css.gz"
  },
  "/_nuxt/UserBasket.c8900cdc.js": {
    "type": "application/javascript",
    "etag": "\"188f-gChKdcjY1J0K7866FaQ9E2ofocU\"",
    "mtime": "2023-09-22T19:05:17.596Z",
    "size": 6287,
    "path": "../public/_nuxt/UserBasket.c8900cdc.js"
  },
  "/_nuxt/UserBasket.c8900cdc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"918-y7cdd/e/Fff/HrtqOgl8Uqbq0eY\"",
    "mtime": "2023-09-22T19:05:17.810Z",
    "size": 2328,
    "path": "../public/_nuxt/UserBasket.c8900cdc.js.br"
  },
  "/_nuxt/UserBasket.c8900cdc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a6b-D5Jxhr3LUm4tiu0GwHDIwORvp2c\"",
    "mtime": "2023-09-22T19:05:17.803Z",
    "size": 2667,
    "path": "../public/_nuxt/UserBasket.c8900cdc.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-09-22T19:05:17.596Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-09-22T19:05:17.825Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-09-22T19:05:17.811Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.3f815fad.js": {
    "type": "application/javascript",
    "etag": "\"531-ZCJ3D78CDGSAJ8+VfnX6ICI8g+0\"",
    "mtime": "2023-09-22T19:05:17.595Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.3f815fad.js"
  },
  "/_nuxt/_id_.3f815fad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a5-IZ1lr1GY+rCyik8V0y9wYHyodd8\"",
    "mtime": "2023-09-22T19:05:17.829Z",
    "size": 677,
    "path": "../public/_nuxt/_id_.3f815fad.js.br"
  },
  "/_nuxt/_id_.3f815fad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-qH3KRzhYAxNWltWeWdn6YcJyQ+E\"",
    "mtime": "2023-09-22T19:05:17.826Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.3f815fad.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-09-22T19:05:17.595Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.f50309aa.js": {
    "type": "application/javascript",
    "etag": "\"12da-FSQYoTpBeAJZ25o1joqLI1roIhA\"",
    "mtime": "2023-09-22T19:05:17.594Z",
    "size": 4826,
    "path": "../public/_nuxt/_id_.f50309aa.js"
  },
  "/_nuxt/_id_.f50309aa.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75f-bR+JeCaF0ectvCDOS5GG54+Srwg\"",
    "mtime": "2023-09-22T19:05:17.836Z",
    "size": 1887,
    "path": "../public/_nuxt/_id_.f50309aa.js.br"
  },
  "/_nuxt/_id_.f50309aa.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85a-esh5fygxNsdp7fuOSUAr+kMStPA\"",
    "mtime": "2023-09-22T19:05:17.830Z",
    "size": 2138,
    "path": "../public/_nuxt/_id_.f50309aa.js.gz"
  },
  "/_nuxt/about_us.81db9552.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"189-kpF8gewa4K+yw6/IFnbVdPtwxtw\"",
    "mtime": "2023-09-22T19:05:17.593Z",
    "size": 393,
    "path": "../public/_nuxt/about_us.81db9552.css"
  },
  "/_nuxt/about_us.91950863.js": {
    "type": "application/javascript",
    "etag": "\"5c2-67SxXSMCWQYe5GzLDnE+4toz1OM\"",
    "mtime": "2023-09-22T19:05:17.593Z",
    "size": 1474,
    "path": "../public/_nuxt/about_us.91950863.js"
  },
  "/_nuxt/about_us.91950863.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"298-3He/M4UlDHi4b9s4Kv/nHjUsw0I\"",
    "mtime": "2023-09-22T19:05:17.839Z",
    "size": 664,
    "path": "../public/_nuxt/about_us.91950863.js.br"
  },
  "/_nuxt/about_us.91950863.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"329-RKxOG+Kt8emFB7NHJ4YHKZtWr5w\"",
    "mtime": "2023-09-22T19:05:17.837Z",
    "size": 809,
    "path": "../public/_nuxt/about_us.91950863.js.gz"
  },
  "/_nuxt/basket.3002aca6.js": {
    "type": "application/javascript",
    "etag": "\"2b6-un9+s+ZXMc5uAup4drp2WkW6qmk\"",
    "mtime": "2023-09-22T19:05:17.592Z",
    "size": 694,
    "path": "../public/_nuxt/basket.3002aca6.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-09-22T19:05:17.592Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-09-22T19:05:17.847Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-09-22T19:05:17.840Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.5a95afef.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-JPiMaseKbfFGvzhIvYzp7Z/s6sM\"",
    "mtime": "2023-09-22T19:05:17.591Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.5a95afef.js"
  },
  "/_nuxt/catalog.5a95afef.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"924-NsC/3i52zLGWI2J7d98qLRhNuio\"",
    "mtime": "2023-09-22T19:05:17.857Z",
    "size": 2340,
    "path": "../public/_nuxt/catalog.5a95afef.js.br"
  },
  "/_nuxt/catalog.5a95afef.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-FYdZFC5vMBrZGPG6QmV+3VTIjqU\"",
    "mtime": "2023-09-22T19:05:17.848Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.5a95afef.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-09-22T19:05:17.591Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-09-22T19:05:17.866Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-09-22T19:05:17.858Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.0bce229c.js": {
    "type": "application/javascript",
    "etag": "\"14fbf-ffhxy6DQ3wvayBOfvoLuv7L06Yc\"",
    "mtime": "2023-09-22T19:05:17.590Z",
    "size": 85951,
    "path": "../public/_nuxt/checkout.0bce229c.js"
  },
  "/_nuxt/checkout.0bce229c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"527c-lalMYOdOUh8osVRoSA4RUT7fiHw\"",
    "mtime": "2023-09-22T19:05:17.966Z",
    "size": 21116,
    "path": "../public/_nuxt/checkout.0bce229c.js.br"
  },
  "/_nuxt/checkout.0bce229c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5f84-pJfAK0nG64aKpV7sVxCfXa3rLwk\"",
    "mtime": "2023-09-22T19:05:17.869Z",
    "size": 24452,
    "path": "../public/_nuxt/checkout.0bce229c.js.gz"
  },
  "/_nuxt/checkout.abef9568.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-jD7DwMMpkbLMnPDb15KllcwGkK8\"",
    "mtime": "2023-09-22T19:05:17.590Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.abef9568.css"
  },
  "/_nuxt/checkout.abef9568.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-iRFE1uESF1sNdOr4P+9A/KYGps8\"",
    "mtime": "2023-09-22T19:05:18.085Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.abef9568.css.br"
  },
  "/_nuxt/checkout.abef9568.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-PmGtKH2/fDx+yO3Q0CQN3guFDj0\"",
    "mtime": "2023-09-22T19:05:17.969Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.abef9568.css.gz"
  },
  "/_nuxt/entry.34f87b4f.js": {
    "type": "application/javascript",
    "etag": "\"3756c-LHgdZBKWbtxQ81qZiuas2GCQIeo\"",
    "mtime": "2023-09-22T19:05:17.588Z",
    "size": 226668,
    "path": "../public/_nuxt/entry.34f87b4f.js"
  },
  "/_nuxt/entry.34f87b4f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"126c7-886WR1Cl4/jeA87TH335BGnyx8o\"",
    "mtime": "2023-09-22T19:05:18.458Z",
    "size": 75463,
    "path": "../public/_nuxt/entry.34f87b4f.js.br"
  },
  "/_nuxt/entry.34f87b4f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14b94-TgjnL8S8tblyW9mS/QrSyZastLM\"",
    "mtime": "2023-09-22T19:05:18.093Z",
    "size": 84884,
    "path": "../public/_nuxt/entry.34f87b4f.js.gz"
  },
  "/_nuxt/entry.850cd753.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2919-DDD2+Uy1hdtjYpsxzSYO8vprpL0\"",
    "mtime": "2023-09-22T19:05:17.587Z",
    "size": 10521,
    "path": "../public/_nuxt/entry.850cd753.css"
  },
  "/_nuxt/entry.850cd753.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a3c-GZLS2C4o4ls9KQjXtPjorZ+Dhfc\"",
    "mtime": "2023-09-22T19:05:18.470Z",
    "size": 2620,
    "path": "../public/_nuxt/entry.850cd753.css.br"
  },
  "/_nuxt/entry.850cd753.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bd2-p/tOSB6bQOmVaJA3py/mDE2fItk\"",
    "mtime": "2023-09-22T19:05:18.459Z",
    "size": 3026,
    "path": "../public/_nuxt/entry.850cd753.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-09-22T19:05:17.587Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-09-22T19:05:18.476Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-09-22T19:05:18.471Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.dda62cf7.js": {
    "type": "application/javascript",
    "etag": "\"89e-e5iaTLXvG8zWdHcqUn17EINNkvw\"",
    "mtime": "2023-09-22T19:05:17.586Z",
    "size": 2206,
    "path": "../public/_nuxt/error-404.dda62cf7.js"
  },
  "/_nuxt/error-404.dda62cf7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-kM8iITReCsalFdgNdrHvFJewH3s\"",
    "mtime": "2023-09-22T19:05:18.479Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.dda62cf7.js.br"
  },
  "/_nuxt/error-404.dda62cf7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"473-4OyZWifuXmuoS+sbWFHAoEkwxYs\"",
    "mtime": "2023-09-22T19:05:18.476Z",
    "size": 1139,
    "path": "../public/_nuxt/error-404.dda62cf7.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-09-22T19:05:17.586Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-09-22T19:05:18.483Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-09-22T19:05:18.480Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.ebe9ad0d.js": {
    "type": "application/javascript",
    "etag": "\"756-DinDEVm0UKgYGRqe2MUBud4t91I\"",
    "mtime": "2023-09-22T19:05:17.585Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.ebe9ad0d.js"
  },
  "/_nuxt/error-500.ebe9ad0d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-FJ3EYcnGkIYgErugGh/3QqcjRcs\"",
    "mtime": "2023-09-22T19:05:18.486Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.ebe9ad0d.js.br"
  },
  "/_nuxt/error-500.ebe9ad0d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-+ED6NHfle6Hhnlj/R/D/krNVd58\"",
    "mtime": "2023-09-22T19:05:18.483Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.ebe9ad0d.js.gz"
  },
  "/_nuxt/error-component.4db2bbe3.js": {
    "type": "application/javascript",
    "etag": "\"45e-97F26LinsU1+XFFeOE2N28qGcUY\"",
    "mtime": "2023-09-22T19:05:17.585Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.4db2bbe3.js"
  },
  "/_nuxt/error-component.4db2bbe3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-YI0CijWhHyUewgTsZ0jiRxo3bpw\"",
    "mtime": "2023-09-22T19:05:18.489Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.4db2bbe3.js.br"
  },
  "/_nuxt/error-component.4db2bbe3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-/MUV28qn9qEWtCAYLWdPkvP+WkY\"",
    "mtime": "2023-09-22T19:05:18.487Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.4db2bbe3.js.gz"
  },
  "/_nuxt/favorite.65acf7f8.js": {
    "type": "application/javascript",
    "etag": "\"a3f-S1b/LtCetTvqad/p979zIX+Wdbw\"",
    "mtime": "2023-09-22T19:05:17.584Z",
    "size": 2623,
    "path": "../public/_nuxt/favorite.65acf7f8.js"
  },
  "/_nuxt/favorite.65acf7f8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"450-8M9+3AKo+hneyOZC4Jy2vSmIFu0\"",
    "mtime": "2023-09-22T19:05:18.493Z",
    "size": 1104,
    "path": "../public/_nuxt/favorite.65acf7f8.js.br"
  },
  "/_nuxt/favorite.65acf7f8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50d-Q6YoIJApJ/tEkSlbnOKww9a3nLw\"",
    "mtime": "2023-09-22T19:05:18.489Z",
    "size": 1293,
    "path": "../public/_nuxt/favorite.65acf7f8.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-09-22T19:05:17.584Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-09-22T19:05:18.501Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-09-22T19:05:18.494Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-09-22T19:05:17.583Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-09-22T19:05:17.583Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-09-22T19:05:17.582Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-09-22T19:05:18.506Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-09-22T19:05:18.502Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.31ab4b91.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-my0CGA+TjoethwNs6+vhSpv8Fro\"",
    "mtime": "2023-09-22T19:05:17.582Z",
    "size": 22887,
    "path": "../public/_nuxt/index.31ab4b91.css"
  },
  "/_nuxt/index.31ab4b91.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12db-nuyQFXbpqS4ngZj/rvKUKFfhJJw\"",
    "mtime": "2023-09-22T19:05:18.532Z",
    "size": 4827,
    "path": "../public/_nuxt/index.31ab4b91.css.br"
  },
  "/_nuxt/index.31ab4b91.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-c1a2Msngi4JBeyLvnGG9fG9PCI0\"",
    "mtime": "2023-09-22T19:05:18.507Z",
    "size": 5713,
    "path": "../public/_nuxt/index.31ab4b91.css.gz"
  },
  "/_nuxt/index.33bbd2a0.js": {
    "type": "application/javascript",
    "etag": "\"1833e-GpGiwlMShjPeaxjP2NJ37kd+dFc\"",
    "mtime": "2023-09-22T19:05:17.581Z",
    "size": 99134,
    "path": "../public/_nuxt/index.33bbd2a0.js"
  },
  "/_nuxt/index.33bbd2a0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"69d5-mk5smTf+58Pd8j2bvKaeXfDpGGc\"",
    "mtime": "2023-09-22T19:05:18.652Z",
    "size": 27093,
    "path": "../public/_nuxt/index.33bbd2a0.js.br"
  },
  "/_nuxt/index.33bbd2a0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7849-uC5Ct5lDou0Zhhy63K9XjU2nMM0\"",
    "mtime": "2023-09-22T19:05:18.536Z",
    "size": 30793,
    "path": "../public/_nuxt/index.33bbd2a0.js.gz"
  },
  "/_nuxt/index.7c0ff699.js": {
    "type": "application/javascript",
    "etag": "\"3abf-AG+j9TMdZDCopqdg9xHI9nbZFjY\"",
    "mtime": "2023-09-22T19:05:17.580Z",
    "size": 15039,
    "path": "../public/_nuxt/index.7c0ff699.js"
  },
  "/_nuxt/index.7c0ff699.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f8-U3AkETDZkIyIS4XQy4naoaMlThg\"",
    "mtime": "2023-09-22T19:05:18.669Z",
    "size": 4856,
    "path": "../public/_nuxt/index.7c0ff699.js.br"
  },
  "/_nuxt/index.7c0ff699.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f4-UYqeILHxQ3yc3m0L/3LgQRzF19c\"",
    "mtime": "2023-09-22T19:05:18.653Z",
    "size": 5364,
    "path": "../public/_nuxt/index.7c0ff699.js.gz"
  },
  "/_nuxt/index.a1a24950.js": {
    "type": "application/javascript",
    "etag": "\"64e-XDBuGZZvEUGewqtF8P3dE7fWN1A\"",
    "mtime": "2023-09-22T19:05:17.580Z",
    "size": 1614,
    "path": "../public/_nuxt/index.a1a24950.js"
  },
  "/_nuxt/index.a1a24950.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"326-HHuLZzxc1IwKu2m4U0oQTaY92Pc\"",
    "mtime": "2023-09-22T19:05:18.672Z",
    "size": 806,
    "path": "../public/_nuxt/index.a1a24950.js.br"
  },
  "/_nuxt/index.a1a24950.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-9fXP5rRKpEUdHUQHdIw36e3z7pc\"",
    "mtime": "2023-09-22T19:05:18.670Z",
    "size": 955,
    "path": "../public/_nuxt/index.a1a24950.js.gz"
  },
  "/_nuxt/isAuth.d5f69cd6.js": {
    "type": "application/javascript",
    "etag": "\"284-kRU6aBgtr+x0vRvE/m7yzClfXQ4\"",
    "mtime": "2023-09-22T19:05:17.579Z",
    "size": 644,
    "path": "../public/_nuxt/isAuth.d5f69cd6.js"
  },
  "/_nuxt/login.953551c7.js": {
    "type": "application/javascript",
    "etag": "\"b86-jIC9QMjU/64dDNK5k81J0RCJFwk\"",
    "mtime": "2023-09-22T19:05:17.579Z",
    "size": 2950,
    "path": "../public/_nuxt/login.953551c7.js"
  },
  "/_nuxt/login.953551c7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4bc-ffsW+tT6gcPGxfq8xvQA8cZ7bj0\"",
    "mtime": "2023-09-22T19:05:18.678Z",
    "size": 1212,
    "path": "../public/_nuxt/login.953551c7.js.br"
  },
  "/_nuxt/login.953551c7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a5-+tbEKU80UaH/xbscEYINk1A0DMM\"",
    "mtime": "2023-09-22T19:05:18.674Z",
    "size": 1445,
    "path": "../public/_nuxt/login.953551c7.js.gz"
  },
  "/_nuxt/login.dda924a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-PIdGNqCOm8Vy4mm+sHLwzCi1Iik\"",
    "mtime": "2023-09-22T19:05:17.578Z",
    "size": 2199,
    "path": "../public/_nuxt/login.dda924a3.css"
  },
  "/_nuxt/login.dda924a3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-6KSjVFHzXn+qpDenYh7oZimtlro\"",
    "mtime": "2023-09-22T19:05:18.681Z",
    "size": 606,
    "path": "../public/_nuxt/login.dda924a3.css.br"
  },
  "/_nuxt/login.dda924a3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-8+aTl5XDF+PNNJt7J7CbQIdjAms\"",
    "mtime": "2023-09-22T19:05:18.678Z",
    "size": 776,
    "path": "../public/_nuxt/login.dda924a3.css.gz"
  },
  "/_nuxt/newsList.80f2a4a2.js": {
    "type": "application/javascript",
    "etag": "\"e6-ivtBTo6Kt7PegSCLBMGrMhqergA\"",
    "mtime": "2023-09-22T19:05:17.578Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.80f2a4a2.js"
  },
  "/_nuxt/orders.7ffd1d1d.js": {
    "type": "application/javascript",
    "etag": "\"2638-LtPdBYa+m1XrFnSzFGMD/LCAz5U\"",
    "mtime": "2023-09-22T19:05:17.577Z",
    "size": 9784,
    "path": "../public/_nuxt/orders.7ffd1d1d.js"
  },
  "/_nuxt/orders.7ffd1d1d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b3f-bbeyjqA31tHYT7wpf6Nm15xz7hU\"",
    "mtime": "2023-09-22T19:05:18.693Z",
    "size": 2879,
    "path": "../public/_nuxt/orders.7ffd1d1d.js.br"
  },
  "/_nuxt/orders.7ffd1d1d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"d37-3KP/K5FOri73FmOm1gOi7jAj8Gk\"",
    "mtime": "2023-09-22T19:05:18.682Z",
    "size": 3383,
    "path": "../public/_nuxt/orders.7ffd1d1d.js.gz"
  },
  "/_nuxt/orders.9cbe35dc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-6DreBuV5/xZeuRuSoc5sSwjlLrs\"",
    "mtime": "2023-09-22T19:05:17.577Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.9cbe35dc.css"
  },
  "/_nuxt/orders.9cbe35dc.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"680-XWs6UcjSmh9jA80UUCB9awEOhAM\"",
    "mtime": "2023-09-22T19:05:18.703Z",
    "size": 1664,
    "path": "../public/_nuxt/orders.9cbe35dc.css.br"
  },
  "/_nuxt/orders.9cbe35dc.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-sWSxLDkPw5UytfpJim1aiekqam0\"",
    "mtime": "2023-09-22T19:05:18.694Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.9cbe35dc.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-09-22T19:05:17.576Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-09-22T19:05:18.738Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-09-22T19:05:18.704Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.6b3c5aed.js": {
    "type": "application/javascript",
    "etag": "\"169d-yxrfBUXZIoacbC9qqy+bQU883gE\"",
    "mtime": "2023-09-22T19:05:17.576Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.6b3c5aed.js"
  },
  "/_nuxt/profile.6b3c5aed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83a-88+j6iOai8Jvzghe1/EOxjdLvXc\"",
    "mtime": "2023-09-22T19:05:18.746Z",
    "size": 2106,
    "path": "../public/_nuxt/profile.6b3c5aed.js.br"
  },
  "/_nuxt/profile.6b3c5aed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-QzVIay13nsnnhiVAEIS29Yxb9bc\"",
    "mtime": "2023-09-22T19:05:18.739Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.6b3c5aed.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-09-22T19:05:17.575Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-09-22T19:05:18.750Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-09-22T19:05:18.747Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.e4a3bd43.js": {
    "type": "application/javascript",
    "etag": "\"11bd-bbJNDujNXqYPU/rKn8J77KlriWQ\"",
    "mtime": "2023-09-22T19:05:17.575Z",
    "size": 4541,
    "path": "../public/_nuxt/register.e4a3bd43.js"
  },
  "/_nuxt/register.e4a3bd43.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5ca-lWWVcZhepBTitsFnB/azGNQQ3AI\"",
    "mtime": "2023-09-22T19:05:18.757Z",
    "size": 1482,
    "path": "../public/_nuxt/register.e4a3bd43.js.br"
  },
  "/_nuxt/register.e4a3bd43.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fe-7/Lv8v81PSUhRiZ3VHiJKR5Qk/4\"",
    "mtime": "2023-09-22T19:05:18.750Z",
    "size": 1790,
    "path": "../public/_nuxt/register.e4a3bd43.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-09-22T19:05:17.574Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-09-22T19:05:18.760Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-09-22T19:05:18.758Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-09-22T19:05:17.574Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-09-22T19:05:17.571Z",
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
