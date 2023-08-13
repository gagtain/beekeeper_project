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
    "mtime": "2023-08-13T13:52:21.017Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-13T13:52:21.015Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-13T13:52:21.014Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-13T13:52:21.013Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-13T13:52:21.011Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-13T13:52:21.009Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-13T13:52:21.008Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T13:52:21.008Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T13:52:22.185Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T13:52:22.181Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-13T13:52:21.006Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-13T13:52:21.002Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-13T13:52:21.000Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-13T13:52:21.055Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-13T13:52:21.023Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/BasketInfo.eab95c1b.js": {
    "type": "application/javascript",
    "etag": "\"9a2-daoOImvGaj/uLr+Q77x5huEOnPA\"",
    "mtime": "2023-08-13T13:52:20.999Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.eab95c1b.js"
  },
  "/_nuxt/BasketInfo.eab95c1b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f4-hXwj39v70RkAHVjEOeKrvkbIOX4\"",
    "mtime": "2023-08-13T13:52:21.062Z",
    "size": 1012,
    "path": "../public/_nuxt/BasketInfo.eab95c1b.js.br"
  },
  "/_nuxt/BasketInfo.eab95c1b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ba-o0dxAeKE6ffIqPFzoNoFL594xPc\"",
    "mtime": "2023-08-13T13:52:21.057Z",
    "size": 1210,
    "path": "../public/_nuxt/BasketInfo.eab95c1b.js.gz"
  },
  "/_nuxt/CatalogProduct.0b692491.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-tT8xvDEhVVhcntwCpdSzkMzQ8m8\"",
    "mtime": "2023-08-13T13:52:20.999Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css"
  },
  "/_nuxt/CatalogProduct.0b692491.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75b-v9nfct6hHYABDkJ6hCYAeKb9WVs\"",
    "mtime": "2023-08-13T13:52:21.082Z",
    "size": 1883,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.br"
  },
  "/_nuxt/CatalogProduct.0b692491.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8a0-RpksUBryp4HqHj7qs4rGN3HCBAw\"",
    "mtime": "2023-08-13T13:52:21.064Z",
    "size": 2208,
    "path": "../public/_nuxt/CatalogProduct.0b692491.css.gz"
  },
  "/_nuxt/CatalogProduct.56364aeb.js": {
    "type": "application/javascript",
    "etag": "\"1237-16DIQ3NzxtGGotC6Bdd17O/qOWY\"",
    "mtime": "2023-08-13T13:52:20.998Z",
    "size": 4663,
    "path": "../public/_nuxt/CatalogProduct.56364aeb.js"
  },
  "/_nuxt/CatalogProduct.56364aeb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"68a-3xCTUOWfOwzsrCYcFLKm7O6jb2I\"",
    "mtime": "2023-08-13T13:52:21.093Z",
    "size": 1674,
    "path": "../public/_nuxt/CatalogProduct.56364aeb.js.br"
  },
  "/_nuxt/CatalogProduct.56364aeb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"77e-hV8926UTedJcMAIoopXT7jPcOgg\"",
    "mtime": "2023-08-13T13:52:21.086Z",
    "size": 1918,
    "path": "../public/_nuxt/CatalogProduct.56364aeb.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-13T13:52:20.997Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-13T13:52:21.114Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-13T13:52:21.094Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.73fd45c7.js": {
    "type": "application/javascript",
    "etag": "\"e2e-pRQpMIt+jdYThESBl+Ox7qCxRto\"",
    "mtime": "2023-08-13T13:52:20.997Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.73fd45c7.js"
  },
  "/_nuxt/FavoriteComp.73fd45c7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"411-jpr7eaRxkj9s4tdgoTKrgAGBUvI\"",
    "mtime": "2023-08-13T13:52:21.122Z",
    "size": 1041,
    "path": "../public/_nuxt/FavoriteComp.73fd45c7.js.br"
  },
  "/_nuxt/FavoriteComp.73fd45c7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-nCAyTHBIDHqV2qzUFC+Zf7uJLZM\"",
    "mtime": "2023-08-13T13:52:21.115Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.73fd45c7.js.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-13T13:52:20.996Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-13T13:52:21.133Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-13T13:52:21.125Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.ef7e59ae.js": {
    "type": "application/javascript",
    "etag": "\"783-01MegJygoBfb89Ir4gLQlFLOIlA\"",
    "mtime": "2023-08-13T13:52:20.995Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.ef7e59ae.js"
  },
  "/_nuxt/FavoriteComp.ef7e59ae.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"291-IvINwNYoPUA6SpqCHz7/N18Ap1E\"",
    "mtime": "2023-08-13T13:52:21.138Z",
    "size": 657,
    "path": "../public/_nuxt/FavoriteComp.ef7e59ae.js.br"
  },
  "/_nuxt/FavoriteComp.ef7e59ae.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-ofUnYT8iIISkoapIPBKkT7IK6ac\"",
    "mtime": "2023-08-13T13:52:21.134Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.ef7e59ae.js.gz"
  },
  "/_nuxt/ImageForm.0de271fe.js": {
    "type": "application/javascript",
    "etag": "\"1ac-5OoBaJbI2rvkFVcqRWaOuY7s2ok\"",
    "mtime": "2023-08-13T13:52:20.995Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.0de271fe.js"
  },
  "/_nuxt/LoadingComp.ae9446dd.js": {
    "type": "application/javascript",
    "etag": "\"1fe-jOOzbhK/zO/ffv20GEXPRjR63Sw\"",
    "mtime": "2023-08-13T13:52:20.994Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.ae9446dd.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-13T13:52:20.993Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-13T13:52:20.993Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-13T13:52:21.143Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-13T13:52:21.140Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.c63d4bd1.js": {
    "type": "application/javascript",
    "etag": "\"453-fRspImthePzeTBmCa75wm8Nfkx8\"",
    "mtime": "2023-08-13T13:52:20.991Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.c63d4bd1.js"
  },
  "/_nuxt/OrderProductList.c63d4bd1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20b-7uOfBx5eQouM4KD7Lr5LKZOHCe8\"",
    "mtime": "2023-08-13T13:52:21.147Z",
    "size": 523,
    "path": "../public/_nuxt/OrderProductList.c63d4bd1.js.br"
  },
  "/_nuxt/OrderProductList.c63d4bd1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"241-MbDODgQlu9FL8w3+yfhVUWfJYsQ\"",
    "mtime": "2023-08-13T13:52:21.144Z",
    "size": 577,
    "path": "../public/_nuxt/OrderProductList.c63d4bd1.js.gz"
  },
  "/_nuxt/UserBasket.32302da8.js": {
    "type": "application/javascript",
    "etag": "\"1309-kt4SQI4uqTFLLdqtbZDE29biZ1c\"",
    "mtime": "2023-08-13T13:52:20.991Z",
    "size": 4873,
    "path": "../public/_nuxt/UserBasket.32302da8.js"
  },
  "/_nuxt/UserBasket.32302da8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72f-E4/W3ufL0yqCxyaxEHoA1JgLX/0\"",
    "mtime": "2023-08-13T13:52:21.158Z",
    "size": 1839,
    "path": "../public/_nuxt/UserBasket.32302da8.js.br"
  },
  "/_nuxt/UserBasket.32302da8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"839-EFvLQPwWm8lueAGn2ydevOdXVLU\"",
    "mtime": "2023-08-13T13:52:21.151Z",
    "size": 2105,
    "path": "../public/_nuxt/UserBasket.32302da8.js.gz"
  },
  "/_nuxt/UserBasket.bb90dbb3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-fBdRazfE2q4t3845KUcF1He+InI\"",
    "mtime": "2023-08-13T13:52:20.990Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a7-WlppEt4cHO23SwLn2zwv2e2Xy+g\"",
    "mtime": "2023-08-13T13:52:21.178Z",
    "size": 1703,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.br"
  },
  "/_nuxt/UserBasket.bb90dbb3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-cTAO2T+zTjT3BZGNlBqBvS0sO2s\"",
    "mtime": "2023-08-13T13:52:21.159Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.bb90dbb3.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-13T13:52:20.989Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.53edf9e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-WR3rEF9pNeqZbmKwrT1doc9YnCU\"",
    "mtime": "2023-08-13T13:52:20.988Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.53edf9e6.css"
  },
  "/_nuxt/_id_.53edf9e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-1y6VR268vzJNtAwpcuyr4eWymoc\"",
    "mtime": "2023-08-13T13:52:21.195Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.53edf9e6.css.br"
  },
  "/_nuxt/_id_.53edf9e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-xNBnDJ8X1pe4UaH3MXRfUxRGscM\"",
    "mtime": "2023-08-13T13:52:21.179Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.53edf9e6.css.gz"
  },
  "/_nuxt/_id_.7c4144fd.js": {
    "type": "application/javascript",
    "etag": "\"12c9-00ACt9vYA8lHxprj0nIaWF24P6k\"",
    "mtime": "2023-08-13T13:52:20.987Z",
    "size": 4809,
    "path": "../public/_nuxt/_id_.7c4144fd.js"
  },
  "/_nuxt/_id_.7c4144fd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"763-oRznAuY9KPIo6nRHm/TFiuZ1W0c\"",
    "mtime": "2023-08-13T13:52:21.203Z",
    "size": 1891,
    "path": "../public/_nuxt/_id_.7c4144fd.js.br"
  },
  "/_nuxt/_id_.7c4144fd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"859-6mgkdwltnQEeQxO9UvMHscRJmXU\"",
    "mtime": "2023-08-13T13:52:21.196Z",
    "size": 2137,
    "path": "../public/_nuxt/_id_.7c4144fd.js.gz"
  },
  "/_nuxt/_id_.8ef23433.js": {
    "type": "application/javascript",
    "etag": "\"531-p08RUyDnCxlsTWm2sBZIpIEf3ww\"",
    "mtime": "2023-08-13T13:52:20.986Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.8ef23433.js"
  },
  "/_nuxt/_id_.8ef23433.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-sf7zfhbr2Lu2Y25KM2HbDF1j2ss\"",
    "mtime": "2023-08-13T13:52:21.207Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.8ef23433.js.br"
  },
  "/_nuxt/_id_.8ef23433.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32c-dYMo37h/lyHv0qiIwXNTrD/VLWE\"",
    "mtime": "2023-08-13T13:52:21.204Z",
    "size": 812,
    "path": "../public/_nuxt/_id_.8ef23433.js.gz"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-13T13:52:20.985Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-13T13:52:21.216Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-13T13:52:21.209Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.a9099887.js": {
    "type": "application/javascript",
    "etag": "\"294-9F34glSBDhaMUDrwdXOAevGtfuQ\"",
    "mtime": "2023-08-13T13:52:20.984Z",
    "size": 660,
    "path": "../public/_nuxt/basket.a9099887.js"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-13T13:52:20.983Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-13T13:52:21.228Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-13T13:52:21.217Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/catalog.e78224dd.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-hS6HBgLz7jbbq+EAvbgfMEovNww\"",
    "mtime": "2023-08-13T13:52:20.982Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.e78224dd.js"
  },
  "/_nuxt/catalog.e78224dd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"922-t1K7a79XFz2JaaOlJDY22jzJvxo\"",
    "mtime": "2023-08-13T13:52:21.238Z",
    "size": 2338,
    "path": "../public/_nuxt/catalog.e78224dd.js.br"
  },
  "/_nuxt/catalog.e78224dd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-2IsbiVVLP2sL3cJ7iNXfXU9stoc\"",
    "mtime": "2023-08-13T13:52:21.229Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.e78224dd.js.gz"
  },
  "/_nuxt/checkout.c10a7bf6.js": {
    "type": "application/javascript",
    "etag": "\"14eb2-BWc+ULmKoKypRAa3+9Gdlx7Be0c\"",
    "mtime": "2023-08-13T13:52:20.981Z",
    "size": 85682,
    "path": "../public/_nuxt/checkout.c10a7bf6.js"
  },
  "/_nuxt/checkout.c10a7bf6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"528d-0K5tB94ZQB8djP9zRSu0FqUBxSk\"",
    "mtime": "2023-08-13T13:52:21.354Z",
    "size": 21133,
    "path": "../public/_nuxt/checkout.c10a7bf6.js.br"
  },
  "/_nuxt/checkout.c10a7bf6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fd0-C/d2e4oUApcqS3wWBqe47+Fy0TY\"",
    "mtime": "2023-08-13T13:52:21.242Z",
    "size": 24528,
    "path": "../public/_nuxt/checkout.c10a7bf6.js.gz"
  },
  "/_nuxt/checkout.f502de6d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-/RFuwRAPgMOaNDJdSwpkEx0vzdQ\"",
    "mtime": "2023-08-13T13:52:20.980Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f502de6d.css"
  },
  "/_nuxt/checkout.f502de6d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fa9-RM6WfNRGhGC2Nl4i91fMAfA1IKo\"",
    "mtime": "2023-08-13T13:52:21.479Z",
    "size": 20393,
    "path": "../public/_nuxt/checkout.f502de6d.css.br"
  },
  "/_nuxt/checkout.f502de6d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-izcHY73BlxhugCH/i4EwC83c2PY\"",
    "mtime": "2023-08-13T13:52:21.358Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f502de6d.css.gz"
  },
  "/_nuxt/entry.272e06cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-eN42h3tjGA7e3Q9pNkJqyBk/Y34\"",
    "mtime": "2023-08-13T13:52:20.977Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.272e06cb.css"
  },
  "/_nuxt/entry.272e06cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"949-4kq5TgrgIGq5pEFftgFn0fVOTA0\"",
    "mtime": "2023-08-13T13:52:21.494Z",
    "size": 2377,
    "path": "../public/_nuxt/entry.272e06cb.css.br"
  },
  "/_nuxt/entry.272e06cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab4-0c4iM8gSpya0NQ6SIJ49nqsMmzU\"",
    "mtime": "2023-08-13T13:52:21.481Z",
    "size": 2740,
    "path": "../public/_nuxt/entry.272e06cb.css.gz"
  },
  "/_nuxt/entry.c5ed1a50.js": {
    "type": "application/javascript",
    "etag": "\"36267-ZG8xbRNtVOnDWYKwnTKlRnZG8J8\"",
    "mtime": "2023-08-13T13:52:20.976Z",
    "size": 221799,
    "path": "../public/_nuxt/entry.c5ed1a50.js"
  },
  "/_nuxt/entry.c5ed1a50.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1209e-FQkCXvkyDBA9pLkfnHmnJR1rFTM\"",
    "mtime": "2023-08-13T13:52:21.878Z",
    "size": 73886,
    "path": "../public/_nuxt/entry.c5ed1a50.js.br"
  },
  "/_nuxt/entry.c5ed1a50.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14525-OQkxEejOdlTBNV0hOz+t/ZhH1T4\"",
    "mtime": "2023-08-13T13:52:21.504Z",
    "size": 83237,
    "path": "../public/_nuxt/entry.c5ed1a50.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-13T13:52:20.974Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-13T13:52:21.884Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-13T13:52:21.879Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.fffd4506.js": {
    "type": "application/javascript",
    "etag": "\"8a8-pfU9f0xD/VH2JsZChAqmW4EWSQw\"",
    "mtime": "2023-08-13T13:52:20.973Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.fffd4506.js"
  },
  "/_nuxt/error-404.fffd4506.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-+BE8tf3gs7WYhp/AR0vPIfjdzsc\"",
    "mtime": "2023-08-13T13:52:21.888Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.fffd4506.js.br"
  },
  "/_nuxt/error-404.fffd4506.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-MaJ9m8TdBweCCTvJ4kSAAPGhUL0\"",
    "mtime": "2023-08-13T13:52:21.885Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.fffd4506.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-13T13:52:20.971Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-13T13:52:21.892Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-13T13:52:21.889Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.bd61faa7.js": {
    "type": "application/javascript",
    "etag": "\"756-io3qAHYxhWt9PFYUNmyGwnmENX0\"",
    "mtime": "2023-08-13T13:52:20.969Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.bd61faa7.js"
  },
  "/_nuxt/error-500.bd61faa7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-cYpU4hl9INJavOh5BlEKF91KcWk\"",
    "mtime": "2023-08-13T13:52:21.896Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.bd61faa7.js.br"
  },
  "/_nuxt/error-500.bd61faa7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3d9-wP592CJ1/ufSvYFUYIJNhLfWyc8\"",
    "mtime": "2023-08-13T13:52:21.893Z",
    "size": 985,
    "path": "../public/_nuxt/error-500.bd61faa7.js.gz"
  },
  "/_nuxt/error-component.267e1762.js": {
    "type": "application/javascript",
    "etag": "\"45e-PTu4UBhYumy91udvIhVIbfRuwV4\"",
    "mtime": "2023-08-13T13:52:20.964Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.267e1762.js"
  },
  "/_nuxt/error-component.267e1762.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-kUwn9RMVGvOjO6GA4rtqnDQGjxs\"",
    "mtime": "2023-08-13T13:52:21.899Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.267e1762.js.br"
  },
  "/_nuxt/error-component.267e1762.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-UCGYQ9HmcX24uql1j4s5ALHcE0U\"",
    "mtime": "2023-08-13T13:52:21.897Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.267e1762.js.gz"
  },
  "/_nuxt/favorite.8944bc68.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-vu1xmUwGH5o+PHNFUWezOtDCUgA\"",
    "mtime": "2023-08-13T13:52:20.963Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.8944bc68.css"
  },
  "/_nuxt/favorite.8944bc68.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52a-8+c9hh7wP4xrrPCNatrSEEXOMBQ\"",
    "mtime": "2023-08-13T13:52:21.907Z",
    "size": 1322,
    "path": "../public/_nuxt/favorite.8944bc68.css.br"
  },
  "/_nuxt/favorite.8944bc68.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-bzaBoYz3m4CIU4lLKFwyw/PHRHU\"",
    "mtime": "2023-08-13T13:52:21.900Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.8944bc68.css.gz"
  },
  "/_nuxt/favorite.d62a7a03.js": {
    "type": "application/javascript",
    "etag": "\"a31-YCSYEMG+jAoKQSz22ebt/bFC7CI\"",
    "mtime": "2023-08-13T13:52:20.962Z",
    "size": 2609,
    "path": "../public/_nuxt/favorite.d62a7a03.js"
  },
  "/_nuxt/favorite.d62a7a03.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"459-uKwWLtuupj0zXLIIhGOa1IQOOsQ\"",
    "mtime": "2023-08-13T13:52:21.912Z",
    "size": 1113,
    "path": "../public/_nuxt/favorite.d62a7a03.js.br"
  },
  "/_nuxt/favorite.d62a7a03.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"505-238mreedO89fZKH5+t8wyjHT+Kw\"",
    "mtime": "2023-08-13T13:52:21.908Z",
    "size": 1285,
    "path": "../public/_nuxt/favorite.d62a7a03.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-13T13:52:20.961Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-13T13:52:20.959Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.220525cb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-XiwMH4hJyS7jwdFTWBAP5c6kWjk\"",
    "mtime": "2023-08-13T13:52:20.959Z",
    "size": 2616,
    "path": "../public/_nuxt/index.220525cb.css"
  },
  "/_nuxt/index.220525cb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cf-QNZQWoUBHEgboN0b3DnjneuW72U\"",
    "mtime": "2023-08-13T13:52:21.917Z",
    "size": 719,
    "path": "../public/_nuxt/index.220525cb.css.br"
  },
  "/_nuxt/index.220525cb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"37a-TqGxYx7lQX4W9CpyARnqql86yTI\"",
    "mtime": "2023-08-13T13:52:21.913Z",
    "size": 890,
    "path": "../public/_nuxt/index.220525cb.css.gz"
  },
  "/_nuxt/index.477ee700.js": {
    "type": "application/javascript",
    "etag": "\"1704b-S4GSLHDtfVQpHAIwemFNZv0iTHk\"",
    "mtime": "2023-08-13T13:52:20.958Z",
    "size": 94283,
    "path": "../public/_nuxt/index.477ee700.js"
  },
  "/_nuxt/index.477ee700.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6572-ejzzkwiujqJiViADZS3quUL4UZ0\"",
    "mtime": "2023-08-13T13:52:22.038Z",
    "size": 25970,
    "path": "../public/_nuxt/index.477ee700.js.br"
  },
  "/_nuxt/index.477ee700.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7304-dnZkyQac2GHnR59S5mSwdpOGeg8\"",
    "mtime": "2023-08-13T13:52:21.920Z",
    "size": 29444,
    "path": "../public/_nuxt/index.477ee700.js.gz"
  },
  "/_nuxt/index.6b00a47f.js": {
    "type": "application/javascript",
    "etag": "\"3aba-ZeoaSMXUhp98llOpk4MZG/eAZ40\"",
    "mtime": "2023-08-13T13:52:20.957Z",
    "size": 15034,
    "path": "../public/_nuxt/index.6b00a47f.js"
  },
  "/_nuxt/index.6b00a47f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ee-45ZvlQhDEXmM38eJ+lW8HEblNjs\"",
    "mtime": "2023-08-13T13:52:22.056Z",
    "size": 4846,
    "path": "../public/_nuxt/index.6b00a47f.js.br"
  },
  "/_nuxt/index.6b00a47f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14ef-tWpmwbnxRryaDw/jciTby0K2DeA\"",
    "mtime": "2023-08-13T13:52:22.040Z",
    "size": 5359,
    "path": "../public/_nuxt/index.6b00a47f.js.gz"
  },
  "/_nuxt/index.78f3c85e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5190-eKtxMciUgFVu76bdiGdIP7QhIE4\"",
    "mtime": "2023-08-13T13:52:20.956Z",
    "size": 20880,
    "path": "../public/_nuxt/index.78f3c85e.css"
  },
  "/_nuxt/index.78f3c85e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12c1-2UJ2PrXNFEs830RhJHtrlicOAzs\"",
    "mtime": "2023-08-13T13:52:22.080Z",
    "size": 4801,
    "path": "../public/_nuxt/index.78f3c85e.css.br"
  },
  "/_nuxt/index.78f3c85e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"156a-BewQYcrA1pWOmWZL09bObv8O1q0\"",
    "mtime": "2023-08-13T13:52:22.057Z",
    "size": 5482,
    "path": "../public/_nuxt/index.78f3c85e.css.gz"
  },
  "/_nuxt/index.92b56440.js": {
    "type": "application/javascript",
    "etag": "\"645-0lXZNYVoOuIdg2chdyNvV2wztrw\"",
    "mtime": "2023-08-13T13:52:20.955Z",
    "size": 1605,
    "path": "../public/_nuxt/index.92b56440.js"
  },
  "/_nuxt/index.92b56440.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"33c-wMD5kNFPT5AaHXcysiquZToj0Hg\"",
    "mtime": "2023-08-13T13:52:22.083Z",
    "size": 828,
    "path": "../public/_nuxt/index.92b56440.js.br"
  },
  "/_nuxt/index.92b56440.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3b9-hiwNFsk4L9LjZpolzDihSy1sId4\"",
    "mtime": "2023-08-13T13:52:22.081Z",
    "size": 953,
    "path": "../public/_nuxt/index.92b56440.js.gz"
  },
  "/_nuxt/isAuth.84524bbf.js": {
    "type": "application/javascript",
    "etag": "\"20f-MgprzZJvZaEkRYjGNvWZ8qDuI5A\"",
    "mtime": "2023-08-13T13:52:20.954Z",
    "size": 527,
    "path": "../public/_nuxt/isAuth.84524bbf.js"
  },
  "/_nuxt/login.b9417cf0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-sPgnIxw74CyCRjshPnBtVlhB5k0\"",
    "mtime": "2023-08-13T13:52:20.953Z",
    "size": 2199,
    "path": "../public/_nuxt/login.b9417cf0.css"
  },
  "/_nuxt/login.b9417cf0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-uPiNAfYl+INj3tJT2sSE1Gdht/s\"",
    "mtime": "2023-08-13T13:52:22.087Z",
    "size": 605,
    "path": "../public/_nuxt/login.b9417cf0.css.br"
  },
  "/_nuxt/login.b9417cf0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-ebsk76X9SBj0m+ZGjUJFg+IwDz8\"",
    "mtime": "2023-08-13T13:52:22.084Z",
    "size": 776,
    "path": "../public/_nuxt/login.b9417cf0.css.gz"
  },
  "/_nuxt/login.e47bc9c5.js": {
    "type": "application/javascript",
    "etag": "\"809-mzbIudpKUjGx/27C6dhXKNZpAAM\"",
    "mtime": "2023-08-13T13:52:20.953Z",
    "size": 2057,
    "path": "../public/_nuxt/login.e47bc9c5.js"
  },
  "/_nuxt/login.e47bc9c5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e6-+WwYCOdsgFXMKRFppNcY48oH8LA\"",
    "mtime": "2023-08-13T13:52:22.092Z",
    "size": 998,
    "path": "../public/_nuxt/login.e47bc9c5.js.br"
  },
  "/_nuxt/login.e47bc9c5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ab-HHOyRgDavSXE+Y7YQqoL2wBTTgY\"",
    "mtime": "2023-08-13T13:52:22.088Z",
    "size": 1195,
    "path": "../public/_nuxt/login.e47bc9c5.js.gz"
  },
  "/_nuxt/newsList.203a9624.js": {
    "type": "application/javascript",
    "etag": "\"e6-wl+qc9RKwwMBOCu4ddLCfDJscUs\"",
    "mtime": "2023-08-13T13:52:20.952Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.203a9624.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-13T13:52:20.951Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-13T13:52:22.104Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-13T13:52:22.093Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.d0a051da.js": {
    "type": "application/javascript",
    "etag": "\"26b6-szc/W20eSJcYskofaH0Ykd6AfUE\"",
    "mtime": "2023-08-13T13:52:20.950Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.d0a051da.js"
  },
  "/_nuxt/orders.d0a051da.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc9-Z65DBjP7yfa4ilzDqI+6PxG0A0s\"",
    "mtime": "2023-08-13T13:52:22.117Z",
    "size": 3017,
    "path": "../public/_nuxt/orders.d0a051da.js.br"
  },
  "/_nuxt/orders.d0a051da.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd5-ZiA1BkvE0MhiyoSquKqF9BuIYNk\"",
    "mtime": "2023-08-13T13:52:22.105Z",
    "size": 3541,
    "path": "../public/_nuxt/orders.d0a051da.js.gz"
  },
  "/_nuxt/profile.239a92a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-qP8zBI3XVVTlpyKQ0GEo2oMsS0Y\"",
    "mtime": "2023-08-13T13:52:20.949Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.239a92a7.css"
  },
  "/_nuxt/profile.239a92a7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-OlWmHLnirIQjD5jzcPIt4HBudkc\"",
    "mtime": "2023-08-13T13:52:22.154Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.239a92a7.css.br"
  },
  "/_nuxt/profile.239a92a7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-WR1uLD5WF3DiRUCqI4em2brVzJE\"",
    "mtime": "2023-08-13T13:52:22.118Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.239a92a7.css.gz"
  },
  "/_nuxt/profile.d33ae033.js": {
    "type": "application/javascript",
    "etag": "\"168b-Ryif2Z2q0V5/iikBvS89QRr9Gfc\"",
    "mtime": "2023-08-13T13:52:20.947Z",
    "size": 5771,
    "path": "../public/_nuxt/profile.d33ae033.js"
  },
  "/_nuxt/profile.d33ae033.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"836-cK8dV8bdChOwDtlErZ2d/Q5oiTU\"",
    "mtime": "2023-08-13T13:52:22.163Z",
    "size": 2102,
    "path": "../public/_nuxt/profile.d33ae033.js.br"
  },
  "/_nuxt/profile.d33ae033.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99f-Zfm8hMsaTnddGadbTh+dlHormok\"",
    "mtime": "2023-08-13T13:52:22.155Z",
    "size": 2463,
    "path": "../public/_nuxt/profile.d33ae033.js.gz"
  },
  "/_nuxt/register.57a86f96.js": {
    "type": "application/javascript",
    "etag": "\"11b8-JUyF1evShBSdQe/qnQEwsMyhtDs\"",
    "mtime": "2023-08-13T13:52:20.946Z",
    "size": 4536,
    "path": "../public/_nuxt/register.57a86f96.js"
  },
  "/_nuxt/register.57a86f96.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bd-0uN8BKOsun0ongeSQgTOdJn6+Lw\"",
    "mtime": "2023-08-13T13:52:22.170Z",
    "size": 1469,
    "path": "../public/_nuxt/register.57a86f96.js.br"
  },
  "/_nuxt/register.57a86f96.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f8-PAwv+maJoYyTdNezfzYVJPqn9sI\"",
    "mtime": "2023-08-13T13:52:22.164Z",
    "size": 1784,
    "path": "../public/_nuxt/register.57a86f96.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-13T13:52:20.945Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-13T13:52:22.174Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-13T13:52:22.171Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T13:52:20.945Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T13:52:22.177Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T13:52:22.175Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-13T13:52:20.944Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-13T13:52:20.941Z",
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
