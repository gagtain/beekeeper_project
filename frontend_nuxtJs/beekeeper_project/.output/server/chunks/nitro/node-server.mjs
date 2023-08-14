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
    "mtime": "2023-08-14T13:37:12.916Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-14T13:37:12.914Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-14T13:37:12.913Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-14T13:37:12.912Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-14T13:37:12.884Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-14T13:37:12.883Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-14T13:37:12.882Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T13:37:12.882Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T13:37:14.024Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T13:37:14.021Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-14T13:37:12.880Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-14T13:37:12.878Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.a24c77e1.js": {
    "type": "application/javascript",
    "etag": "\"9a2-qYs/Bhtgo+rERaocgarR1BACKo8\"",
    "mtime": "2023-08-14T13:37:12.878Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.a24c77e1.js"
  },
  "/_nuxt/BasketInfo.a24c77e1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f0-Z8YlEtBpyhuE4qXQWjXen/VD2lg\"",
    "mtime": "2023-08-14T13:37:12.931Z",
    "size": 1008,
    "path": "../public/_nuxt/BasketInfo.a24c77e1.js.br"
  },
  "/_nuxt/BasketInfo.a24c77e1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-v1r0RYZf6y1zwezGAaY+3mbnuMk\"",
    "mtime": "2023-08-14T13:37:12.920Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.a24c77e1.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-14T13:37:12.877Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-14T13:37:12.958Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-14T13:37:12.932Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-5HyqgsFvXql/I+ZV2NiXHtXNQoI\"",
    "mtime": "2023-08-14T13:37:12.877Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"756-G6kVT5X+5sFBHk7jmahU1WvKbis\"",
    "mtime": "2023-08-14T13:37:12.977Z",
    "size": 1878,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.br"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89c-b1CPUu+Xjc5NIuwbNcKb0vdnU5w\"",
    "mtime": "2023-08-14T13:37:12.959Z",
    "size": 2204,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.gz"
  },
  "/_nuxt/CatalogProduct.74aef240.js": {
    "type": "application/javascript",
    "etag": "\"1252-OTr/2c/9j9w07EhoXSn8SCHBczk\"",
    "mtime": "2023-08-14T13:37:12.876Z",
    "size": 4690,
    "path": "../public/_nuxt/CatalogProduct.74aef240.js"
  },
  "/_nuxt/CatalogProduct.74aef240.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"692-E40LAMxIhfX4sm1Kh30Mkjdpfyk\"",
    "mtime": "2023-08-14T13:37:12.984Z",
    "size": 1682,
    "path": "../public/_nuxt/CatalogProduct.74aef240.js.br"
  },
  "/_nuxt/CatalogProduct.74aef240.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"783-EiWx8qBuX0tWfO12eoUkzkJUCAw\"",
    "mtime": "2023-08-14T13:37:12.978Z",
    "size": 1923,
    "path": "../public/_nuxt/CatalogProduct.74aef240.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-14T13:37:12.876Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-14T13:37:13.005Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-14T13:37:12.988Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-14T13:37:12.875Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-14T13:37:13.011Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-14T13:37:13.006Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.984bcd17.js": {
    "type": "application/javascript",
    "etag": "\"783-EBlxC/oA2DiI4xhzKt4kXpTP2VE\"",
    "mtime": "2023-08-14T13:37:12.875Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.984bcd17.js"
  },
  "/_nuxt/FavoriteComp.984bcd17.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-2MKD8q6l0vN3mSxwi8MPo58B8p4\"",
    "mtime": "2023-08-14T13:37:13.016Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.984bcd17.js.br"
  },
  "/_nuxt/FavoriteComp.984bcd17.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-y+qhqdexfI9yS2Q3ZFxp1WnDun0\"",
    "mtime": "2023-08-14T13:37:13.012Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.984bcd17.js.gz"
  },
  "/_nuxt/FavoriteComp.9df29fda.js": {
    "type": "application/javascript",
    "etag": "\"e2e-Hm2IpD66lFQPIyg2T6oJmCZBEoU\"",
    "mtime": "2023-08-14T13:37:12.874Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.9df29fda.js"
  },
  "/_nuxt/FavoriteComp.9df29fda.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"413-KK8IPyTBmuxtPUS5HauG9TKaTnE\"",
    "mtime": "2023-08-14T13:37:13.023Z",
    "size": 1043,
    "path": "../public/_nuxt/FavoriteComp.9df29fda.js.br"
  },
  "/_nuxt/FavoriteComp.9df29fda.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-00s1fbZHBlgVo+lvTR4k0szt8MQ\"",
    "mtime": "2023-08-14T13:37:13.017Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.9df29fda.js.gz"
  },
  "/_nuxt/ImageForm.ca183a00.js": {
    "type": "application/javascript",
    "etag": "\"1ac-CY9VH6JH+9vkS9dCPlp8pGA7W1g\"",
    "mtime": "2023-08-14T13:37:12.874Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.ca183a00.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-14T13:37:12.873Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.d68bf55d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-/zxgk/y20sh9WtaRq8KRd1bi/lI\"",
    "mtime": "2023-08-14T13:37:12.873Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.d68bf55d.js"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-14T13:37:12.872Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-14T13:37:13.027Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-14T13:37:13.025Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.43634880.js": {
    "type": "application/javascript",
    "etag": "\"461-Kc75ODVWHzSM+DD2Vxl18S0PAvs\"",
    "mtime": "2023-08-14T13:37:12.872Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.43634880.js"
  },
  "/_nuxt/OrderProductList.43634880.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"213-3W07I14rHWo5x6vNujnM15xswFo\"",
    "mtime": "2023-08-14T13:37:13.030Z",
    "size": 531,
    "path": "../public/_nuxt/OrderProductList.43634880.js.br"
  },
  "/_nuxt/OrderProductList.43634880.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-pUg7bF+j8j0PYqkURoS0n50W4Dk\"",
    "mtime": "2023-08-14T13:37:13.028Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.43634880.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-14T13:37:12.871Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-14T13:37:13.048Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-14T13:37:13.031Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/UserBasket.fa239fc5.js": {
    "type": "application/javascript",
    "etag": "\"1312-rOunuTqVr18cUuTY6wmnQ3c3+LM\"",
    "mtime": "2023-08-14T13:37:12.870Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.fa239fc5.js"
  },
  "/_nuxt/UserBasket.fa239fc5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"73e-PwLy0qyD+o/gxnIPvOqdXn7PbQE\"",
    "mtime": "2023-08-14T13:37:13.055Z",
    "size": 1854,
    "path": "../public/_nuxt/UserBasket.fa239fc5.js.br"
  },
  "/_nuxt/UserBasket.fa239fc5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"840-KI6ihiPMWGU4wsGPWgQUrBoYn8E\"",
    "mtime": "2023-08-14T13:37:13.049Z",
    "size": 2112,
    "path": "../public/_nuxt/UserBasket.fa239fc5.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-14T13:37:12.870Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-14T13:37:13.071Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-14T13:37:13.056Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.39d14b81.js": {
    "type": "application/javascript",
    "etag": "\"12e4-ifHsynpRsCFW7o8gpEVKPpJ8ZFM\"",
    "mtime": "2023-08-14T13:37:12.869Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.39d14b81.js"
  },
  "/_nuxt/_id_.39d14b81.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"763-NKmgmzPwbYmUR9BqaMn2cb6Jaj8\"",
    "mtime": "2023-08-14T13:37:13.077Z",
    "size": 1891,
    "path": "../public/_nuxt/_id_.39d14b81.js.br"
  },
  "/_nuxt/_id_.39d14b81.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85e-+fcPJu3g+sJq7y89h8OngoKkffM\"",
    "mtime": "2023-08-14T13:37:13.071Z",
    "size": 2142,
    "path": "../public/_nuxt/_id_.39d14b81.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-14T13:37:12.869Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.82bbdbb8.js": {
    "type": "application/javascript",
    "etag": "\"531-905TpzqgK0sPE13hYczz9+fLTyI\"",
    "mtime": "2023-08-14T13:37:12.868Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.82bbdbb8.js"
  },
  "/_nuxt/_id_.82bbdbb8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a1-WQGGaT1q1cJhdqrl6GGL+BcAhEU\"",
    "mtime": "2023-08-14T13:37:13.081Z",
    "size": 673,
    "path": "../public/_nuxt/_id_.82bbdbb8.js.br"
  },
  "/_nuxt/_id_.82bbdbb8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-e/BEc9ESYehvgIeHLYnXr0fMvjQ\"",
    "mtime": "2023-08-14T13:37:13.078Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.82bbdbb8.js.gz"
  },
  "/_nuxt/basket.32332e36.js": {
    "type": "application/javascript",
    "etag": "\"294-Ib2DFI1vZAIQ8JVka5BjkiOH9no\"",
    "mtime": "2023-08-14T13:37:12.868Z",
    "size": 660,
    "path": "../public/_nuxt/basket.32332e36.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-14T13:37:12.867Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-14T13:37:13.089Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-14T13:37:13.082Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.042abe49.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-vmzXHIfoyJU+e6fs8K5CfZK/4uQ\"",
    "mtime": "2023-08-14T13:37:12.866Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.042abe49.js"
  },
  "/_nuxt/catalog.042abe49.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"920-3ofDkvPbY6/NL9DoedVyQfJjBL0\"",
    "mtime": "2023-08-14T13:37:13.098Z",
    "size": 2336,
    "path": "../public/_nuxt/catalog.042abe49.js.br"
  },
  "/_nuxt/catalog.042abe49.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-xjGyJVDdJKkvLJr6J2ib7fDKakM\"",
    "mtime": "2023-08-14T13:37:13.090Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.042abe49.js.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-14T13:37:12.866Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-14T13:37:13.109Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-14T13:37:13.099Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-14T13:37:12.865Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-14T13:37:13.225Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-14T13:37:13.113Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/checkout.7345d3e1.js": {
    "type": "application/javascript",
    "etag": "\"14efc-qKIl8L97fh+PvYzU/qjE2PnWops\"",
    "mtime": "2023-08-14T13:37:12.864Z",
    "size": 85756,
    "path": "../public/_nuxt/checkout.7345d3e1.js"
  },
  "/_nuxt/checkout.7345d3e1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5276-Ylf+YAGMLw8E4iAJSeZ/DbS815I\"",
    "mtime": "2023-08-14T13:37:13.332Z",
    "size": 21110,
    "path": "../public/_nuxt/checkout.7345d3e1.js.br"
  },
  "/_nuxt/checkout.7345d3e1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcb-4xc7hUtnABJVZcIiGcFuLdCZF1A\"",
    "mtime": "2023-08-14T13:37:13.228Z",
    "size": 24523,
    "path": "../public/_nuxt/checkout.7345d3e1.js.gz"
  },
  "/_nuxt/entry.65932d1a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"257d-IlmwIqPU6KkCJ/IW2MBAYXwW9lY\"",
    "mtime": "2023-08-14T13:37:12.864Z",
    "size": 9597,
    "path": "../public/_nuxt/entry.65932d1a.css"
  },
  "/_nuxt/entry.65932d1a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"954-h0HEnKzxnJwXURdcJ+puerv8cKI\"",
    "mtime": "2023-08-14T13:37:13.343Z",
    "size": 2388,
    "path": "../public/_nuxt/entry.65932d1a.css.br"
  },
  "/_nuxt/entry.65932d1a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac8-+XmwmkCTZb7IFYGEkCNvCgEuQJo\"",
    "mtime": "2023-08-14T13:37:13.333Z",
    "size": 2760,
    "path": "../public/_nuxt/entry.65932d1a.css.gz"
  },
  "/_nuxt/entry.d9d4c989.js": {
    "type": "application/javascript",
    "etag": "\"36254-tqcKmtOmRealHGOdvW9qg7V0Rfk\"",
    "mtime": "2023-08-14T13:37:12.863Z",
    "size": 221780,
    "path": "../public/_nuxt/entry.d9d4c989.js"
  },
  "/_nuxt/entry.d9d4c989.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12100-pruIdNgUcrwYKZLRslSQUU7nSFg\"",
    "mtime": "2023-08-14T13:37:13.727Z",
    "size": 73984,
    "path": "../public/_nuxt/entry.d9d4c989.js.br"
  },
  "/_nuxt/entry.d9d4c989.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14527-/XXU8FFcinqCxbEXoiBssKnSrrA\"",
    "mtime": "2023-08-14T13:37:13.353Z",
    "size": 83239,
    "path": "../public/_nuxt/entry.d9d4c989.js.gz"
  },
  "/_nuxt/error-404.0dd24870.js": {
    "type": "application/javascript",
    "etag": "\"8a8-ZWzXeKEbaePw5/C29uKWReK869k\"",
    "mtime": "2023-08-14T13:37:12.862Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.0dd24870.js"
  },
  "/_nuxt/error-404.0dd24870.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-X2UlgUXRRBIN5syXa5lAPBdjaC0\"",
    "mtime": "2023-08-14T13:37:13.731Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.0dd24870.js.br"
  },
  "/_nuxt/error-404.0dd24870.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-KQpOhu90ET31p6wLTDDVX4OuRgM\"",
    "mtime": "2023-08-14T13:37:13.727Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.0dd24870.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-14T13:37:12.861Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-14T13:37:13.736Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-14T13:37:13.731Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-14T13:37:12.860Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-14T13:37:13.740Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-14T13:37:13.737Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.c4f4faf4.js": {
    "type": "application/javascript",
    "etag": "\"756-+vRSrJE5+5yeSX/jPMr9nU3Vzaw\"",
    "mtime": "2023-08-14T13:37:12.860Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.c4f4faf4.js"
  },
  "/_nuxt/error-500.c4f4faf4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-BARkKZi9dUyXE0lqRFjeivQenhk\"",
    "mtime": "2023-08-14T13:37:13.743Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.c4f4faf4.js.br"
  },
  "/_nuxt/error-500.c4f4faf4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-ShNlBe7QX2Pp+W+aZU6QzryvSFc\"",
    "mtime": "2023-08-14T13:37:13.740Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.c4f4faf4.js.gz"
  },
  "/_nuxt/error-component.36c90108.js": {
    "type": "application/javascript",
    "etag": "\"45e-1scyEoGRgnYm8OvFKblr4GrFXaY\"",
    "mtime": "2023-08-14T13:37:12.859Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.36c90108.js"
  },
  "/_nuxt/error-component.36c90108.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-fAsDQfCp+GkJq8jdMBzuH/Isq+M\"",
    "mtime": "2023-08-14T13:37:13.746Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.36c90108.js.br"
  },
  "/_nuxt/error-component.36c90108.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-5pAVJBSiq6Jg+lxVJsKXn2OVusY\"",
    "mtime": "2023-08-14T13:37:13.744Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.36c90108.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-14T13:37:12.859Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-14T13:37:13.754Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-14T13:37:13.747Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.ba5af64c.js": {
    "type": "application/javascript",
    "etag": "\"a3a-OEZRhd4yniBqU4h0SeJFqI0RUbU\"",
    "mtime": "2023-08-14T13:37:12.858Z",
    "size": 2618,
    "path": "../public/_nuxt/favorite.ba5af64c.js"
  },
  "/_nuxt/favorite.ba5af64c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"453-ZrgmsRVFbHJ8ie0aSZ0ST6ig7vs\"",
    "mtime": "2023-08-14T13:37:13.758Z",
    "size": 1107,
    "path": "../public/_nuxt/favorite.ba5af64c.js.br"
  },
  "/_nuxt/favorite.ba5af64c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50b-nRsJtOn4MHJQ5ubp0gBKXJTKNzQ\"",
    "mtime": "2023-08-14T13:37:13.755Z",
    "size": 1291,
    "path": "../public/_nuxt/favorite.ba5af64c.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-14T13:37:12.858Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-14T13:37:12.857Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-14T13:37:12.857Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-14T13:37:13.763Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-14T13:37:13.759Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.7316b839.js": {
    "type": "application/javascript",
    "etag": "\"3aba-pRDPPbe9p1RLV8OcccISrjLCBQg\"",
    "mtime": "2023-08-14T13:37:12.856Z",
    "size": 15034,
    "path": "../public/_nuxt/index.7316b839.js"
  },
  "/_nuxt/index.7316b839.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f1-tFMBuGg/a58wCerGRkT8W7cDEmM\"",
    "mtime": "2023-08-14T13:37:13.780Z",
    "size": 4849,
    "path": "../public/_nuxt/index.7316b839.js.br"
  },
  "/_nuxt/index.7316b839.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-5oMKpoO5cD4N3xg/+8mGDHh8zhU\"",
    "mtime": "2023-08-14T13:37:13.764Z",
    "size": 5360,
    "path": "../public/_nuxt/index.7316b839.js.gz"
  },
  "/_nuxt/index.8837668a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-6sRBwRCL57uvVA/2+sOzFfBlZNc\"",
    "mtime": "2023-08-14T13:37:12.855Z",
    "size": 22887,
    "path": "../public/_nuxt/index.8837668a.css"
  },
  "/_nuxt/index.8837668a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12df-7+8qp0qca1IEPBBAWAZeI+mgXM8\"",
    "mtime": "2023-08-14T13:37:13.807Z",
    "size": 4831,
    "path": "../public/_nuxt/index.8837668a.css.br"
  },
  "/_nuxt/index.8837668a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-7W5TIS7QrE4aXfE9C92w2grZbTQ\"",
    "mtime": "2023-08-14T13:37:13.781Z",
    "size": 5713,
    "path": "../public/_nuxt/index.8837668a.css.gz"
  },
  "/_nuxt/index.9e76c501.js": {
    "type": "application/javascript",
    "etag": "\"64e-ig/zfGM+yHAuTGtqq1oli6MH6X0\"",
    "mtime": "2023-08-14T13:37:12.854Z",
    "size": 1614,
    "path": "../public/_nuxt/index.9e76c501.js"
  },
  "/_nuxt/index.9e76c501.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"327-5rV2EDueZwTlzVZC2mq7QaOQ6iU\"",
    "mtime": "2023-08-14T13:37:13.810Z",
    "size": 807,
    "path": "../public/_nuxt/index.9e76c501.js.br"
  },
  "/_nuxt/index.9e76c501.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bd-YcIVnhTIXhY7CllkX2FZcH47ex0\"",
    "mtime": "2023-08-14T13:37:13.808Z",
    "size": 957,
    "path": "../public/_nuxt/index.9e76c501.js.gz"
  },
  "/_nuxt/index.e9245a91.js": {
    "type": "application/javascript",
    "etag": "\"17f2d-5GaLBIbS/8zE8fVEbB1/vtjP9wQ\"",
    "mtime": "2023-08-14T13:37:12.854Z",
    "size": 98093,
    "path": "../public/_nuxt/index.e9245a91.js"
  },
  "/_nuxt/index.e9245a91.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6905-XJ6vx16okuj35eDSyZtIf/SlAOw\"",
    "mtime": "2023-08-14T13:37:13.929Z",
    "size": 26885,
    "path": "../public/_nuxt/index.e9245a91.js.br"
  },
  "/_nuxt/index.e9245a91.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7705-YQc0iikzevRwwvoTv5nZU/IRNNw\"",
    "mtime": "2023-08-14T13:37:13.814Z",
    "size": 30469,
    "path": "../public/_nuxt/index.e9245a91.js.gz"
  },
  "/_nuxt/isAuth.97b7a054.js": {
    "type": "application/javascript",
    "etag": "\"282-Hc+jEwNyORuXBoxRsnCoxPWVEuM\"",
    "mtime": "2023-08-14T13:37:12.853Z",
    "size": 642,
    "path": "../public/_nuxt/isAuth.97b7a054.js"
  },
  "/_nuxt/login.51b34b9b.js": {
    "type": "application/javascript",
    "etag": "\"80a-Xv22bpCZh8Zv04c0XetV7zTi0Ms\"",
    "mtime": "2023-08-14T13:37:12.852Z",
    "size": 2058,
    "path": "../public/_nuxt/login.51b34b9b.js"
  },
  "/_nuxt/login.51b34b9b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e9-rqKCYa4McGrblY3Nivx4lX6Je3w\"",
    "mtime": "2023-08-14T13:37:13.933Z",
    "size": 1001,
    "path": "../public/_nuxt/login.51b34b9b.js.br"
  },
  "/_nuxt/login.51b34b9b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ac-n28dZQdgflNjh5PCe16qGb/j93s\"",
    "mtime": "2023-08-14T13:37:13.930Z",
    "size": 1196,
    "path": "../public/_nuxt/login.51b34b9b.js.gz"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-14T13:37:12.851Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-14T13:37:13.937Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-14T13:37:13.934Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/newsList.3454dbaa.js": {
    "type": "application/javascript",
    "etag": "\"e6-HYUuR+sLIb8x4BHJ5kfQT0Gm8qU\"",
    "mtime": "2023-08-14T13:37:12.851Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.3454dbaa.js"
  },
  "/_nuxt/orders.27bf03ec.js": {
    "type": "application/javascript",
    "etag": "\"26b6-1Z4uM67NzEjIF1cREz7Ji2AoNQs\"",
    "mtime": "2023-08-14T13:37:12.850Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.27bf03ec.js"
  },
  "/_nuxt/orders.27bf03ec.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bcb-JdJIDvFAG5XWVBYGmST4+BAOSxA\"",
    "mtime": "2023-08-14T13:37:13.949Z",
    "size": 3019,
    "path": "../public/_nuxt/orders.27bf03ec.js.br"
  },
  "/_nuxt/orders.27bf03ec.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd7-x1ErWMYehIFfmHn+Wufic2MCUJY\"",
    "mtime": "2023-08-14T13:37:13.938Z",
    "size": 3543,
    "path": "../public/_nuxt/orders.27bf03ec.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-14T13:37:12.849Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-14T13:37:13.960Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-14T13:37:13.950Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/profile.1c377883.js": {
    "type": "application/javascript",
    "etag": "\"169d-LBoD1HO1Jq2GlUHxTYwKlcG5EfI\"",
    "mtime": "2023-08-14T13:37:12.849Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.1c377883.js"
  },
  "/_nuxt/profile.1c377883.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83c-ykB4qDsdYF0/gRQiqc8y+NUc2ts\"",
    "mtime": "2023-08-14T13:37:13.968Z",
    "size": 2108,
    "path": "../public/_nuxt/profile.1c377883.js.br"
  },
  "/_nuxt/profile.1c377883.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9aa-4zAEtMVIBUe8Tj3OqZ1RSBixKA4\"",
    "mtime": "2023-08-14T13:37:13.961Z",
    "size": 2474,
    "path": "../public/_nuxt/profile.1c377883.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-14T13:37:12.848Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-14T13:37:14.004Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-14T13:37:13.969Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-14T13:37:12.847Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-14T13:37:14.008Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-14T13:37:14.004Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.fcafdf71.js": {
    "type": "application/javascript",
    "etag": "\"11b8-FSp9hgY7WlU9Pgzsq49vCbeIHhE\"",
    "mtime": "2023-08-14T13:37:12.847Z",
    "size": 4536,
    "path": "../public/_nuxt/register.fcafdf71.js"
  },
  "/_nuxt/register.fcafdf71.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bf-doPl50V4erJlEMtsc21JQU02ZRc\"",
    "mtime": "2023-08-14T13:37:14.015Z",
    "size": 1471,
    "path": "../public/_nuxt/register.fcafdf71.js.br"
  },
  "/_nuxt/register.fcafdf71.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fb-OQlSRdq6ViTcfEV3KJ8jijBCztI\"",
    "mtime": "2023-08-14T13:37:14.009Z",
    "size": 1787,
    "path": "../public/_nuxt/register.fcafdf71.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T13:37:12.846Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T13:37:14.018Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T13:37:14.016Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-14T13:37:12.846Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-14T13:37:12.844Z",
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
