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
    "mtime": "2023-08-13T17:40:18.325Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-13T17:40:18.323Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-13T17:40:18.323Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e8fc-+LMmQN3wolel9QrfUYYFFY4+5Mg\"",
    "mtime": "2023-08-13T17:40:18.322Z",
    "size": 256252,
    "path": "../public/images/main.jpg"
  },
  "/images/main.webp": {
    "type": "image/webp",
    "etag": "\"3bb1e-ZOqP3USD6o9sYUTLjcIw93+MLlM\"",
    "mtime": "2023-08-13T17:40:18.320Z",
    "size": 244510,
    "path": "../public/images/main.webp"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-13T17:40:18.319Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-13T17:40:18.318Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T17:40:18.318Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T17:40:19.416Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T17:40:19.413Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-13T17:40:18.316Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-13T17:40:18.314Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.922953ed.js": {
    "type": "application/javascript",
    "etag": "\"9a2-mM44iszHOABaKcT91AGjrQXK130\"",
    "mtime": "2023-08-13T17:40:18.313Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.922953ed.js"
  },
  "/_nuxt/BasketInfo.922953ed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ee-d/jHVXdhjmQrKXfeo7TXAiNdADQ\"",
    "mtime": "2023-08-13T17:40:18.333Z",
    "size": 1006,
    "path": "../public/_nuxt/BasketInfo.922953ed.js.br"
  },
  "/_nuxt/BasketInfo.922953ed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-KfAtm69TyXrtfzuNdtB8x+ZwbDY\"",
    "mtime": "2023-08-13T17:40:18.328Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.922953ed.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-13T17:40:18.313Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-13T17:40:18.359Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-13T17:40:18.334Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.1a78757c.js": {
    "type": "application/javascript",
    "etag": "\"1252-yIkZu438GrEiyGFxv2M7XsBDeu4\"",
    "mtime": "2023-08-13T17:40:18.312Z",
    "size": 4690,
    "path": "../public/_nuxt/CatalogProduct.1a78757c.js"
  },
  "/_nuxt/CatalogProduct.1a78757c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"694-GwU6CHruRyalhUd6RXLkdZM/Png\"",
    "mtime": "2023-08-13T17:40:18.366Z",
    "size": 1684,
    "path": "../public/_nuxt/CatalogProduct.1a78757c.js.br"
  },
  "/_nuxt/CatalogProduct.1a78757c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"784-mIf/FkL5co9aqnIPkjiYG1aU9Zk\"",
    "mtime": "2023-08-13T17:40:18.360Z",
    "size": 1924,
    "path": "../public/_nuxt/CatalogProduct.1a78757c.js.gz"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-5HyqgsFvXql/I+ZV2NiXHtXNQoI\"",
    "mtime": "2023-08-13T17:40:18.311Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"756-G6kVT5X+5sFBHk7jmahU1WvKbis\"",
    "mtime": "2023-08-13T17:40:18.379Z",
    "size": 1878,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.br"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89c-b1CPUu+Xjc5NIuwbNcKb0vdnU5w\"",
    "mtime": "2023-08-13T17:40:18.367Z",
    "size": 2204,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.gz"
  },
  "/_nuxt/FavoriteComp.273a2a99.js": {
    "type": "application/javascript",
    "etag": "\"e2e-fQx4bkArc7jzhuaXrdyF7BAPRIM\"",
    "mtime": "2023-08-13T17:40:18.311Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.273a2a99.js"
  },
  "/_nuxt/FavoriteComp.273a2a99.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40f-UMVEnyq5rLpb+w4Cpexhlzn1wY8\"",
    "mtime": "2023-08-13T17:40:18.385Z",
    "size": 1039,
    "path": "../public/_nuxt/FavoriteComp.273a2a99.js.br"
  },
  "/_nuxt/FavoriteComp.273a2a99.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-fGZshDbgqgLwETOjEZblN4YPp4o\"",
    "mtime": "2023-08-13T17:40:18.380Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.273a2a99.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-13T17:40:18.310Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-13T17:40:18.403Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-13T17:40:18.386Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-13T17:40:18.310Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-13T17:40:18.412Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-13T17:40:18.404Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.ab3b4a98.js": {
    "type": "application/javascript",
    "etag": "\"783-taSF6ZhTincyMc20EwCCM+xN3Qg\"",
    "mtime": "2023-08-13T17:40:18.309Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.ab3b4a98.js"
  },
  "/_nuxt/FavoriteComp.ab3b4a98.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28f-jQntgzCMQgPMXziILUp40JmJRes\"",
    "mtime": "2023-08-13T17:40:18.417Z",
    "size": 655,
    "path": "../public/_nuxt/FavoriteComp.ab3b4a98.js.br"
  },
  "/_nuxt/FavoriteComp.ab3b4a98.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-wM6AUJiqjHr7eveLnIaxmB89GWA\"",
    "mtime": "2023-08-13T17:40:18.413Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.ab3b4a98.js.gz"
  },
  "/_nuxt/ImageForm.7d56f345.js": {
    "type": "application/javascript",
    "etag": "\"1ac-9Zl1bdSkh4zf4HFZ5uWKtyqpawo\"",
    "mtime": "2023-08-13T17:40:18.309Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.7d56f345.js"
  },
  "/_nuxt/LoadingComp.34333de8.js": {
    "type": "application/javascript",
    "etag": "\"1fe-VKGGJrMgUdZnlf/008zAbMvwMLM\"",
    "mtime": "2023-08-13T17:40:18.308Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.34333de8.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-13T17:40:18.308Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-13T17:40:18.307Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-13T17:40:18.422Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-13T17:40:18.418Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.127034be.js": {
    "type": "application/javascript",
    "etag": "\"461-CABlgTkp6yh4VvdFZnwKdf7RIe4\"",
    "mtime": "2023-08-13T17:40:18.306Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.127034be.js"
  },
  "/_nuxt/OrderProductList.127034be.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"214-PRASE9IynEO5dDMLB0DnETDPERk\"",
    "mtime": "2023-08-13T17:40:18.425Z",
    "size": 532,
    "path": "../public/_nuxt/OrderProductList.127034be.js.br"
  },
  "/_nuxt/OrderProductList.127034be.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-N7ukHLQD6Rl7FbStG4HnVGWnlGY\"",
    "mtime": "2023-08-13T17:40:18.423Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.127034be.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-13T17:40:18.306Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-13T17:40:18.449Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-13T17:40:18.426Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/UserBasket.a4b93368.js": {
    "type": "application/javascript",
    "etag": "\"1312-MkmT3scfpgXHyEyoEIJo5hMPriY\"",
    "mtime": "2023-08-13T17:40:18.305Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.a4b93368.js"
  },
  "/_nuxt/UserBasket.a4b93368.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"730-Pijfwa4djwT2rmrPinPdFKgImaI\"",
    "mtime": "2023-08-13T17:40:18.457Z",
    "size": 1840,
    "path": "../public/_nuxt/UserBasket.a4b93368.js.br"
  },
  "/_nuxt/UserBasket.a4b93368.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"841-59dzSEcu29e00X4/kkI9xo80o4M\"",
    "mtime": "2023-08-13T17:40:18.450Z",
    "size": 2113,
    "path": "../public/_nuxt/UserBasket.a4b93368.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-13T17:40:18.305Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-13T17:40:18.472Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-13T17:40:18.458Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-13T17:40:18.304Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.b545d230.js": {
    "type": "application/javascript",
    "etag": "\"531-CfoIYoeMYF3Fjee3L84QeCJUkTE\"",
    "mtime": "2023-08-13T17:40:18.304Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.b545d230.js"
  },
  "/_nuxt/_id_.b545d230.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2aa-ro4ibQox2qLQn/0kNDbpSAhCcms\"",
    "mtime": "2023-08-13T17:40:18.477Z",
    "size": 682,
    "path": "../public/_nuxt/_id_.b545d230.js.br"
  },
  "/_nuxt/_id_.b545d230.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-07ZR48AXBWonZPH7lGh7iU+8i00\"",
    "mtime": "2023-08-13T17:40:18.474Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.b545d230.js.gz"
  },
  "/_nuxt/_id_.cc32bdac.js": {
    "type": "application/javascript",
    "etag": "\"12e4-lb6Cj+FoCm4c2YTWXVElqtEf1VA\"",
    "mtime": "2023-08-13T17:40:18.303Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.cc32bdac.js"
  },
  "/_nuxt/_id_.cc32bdac.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"765-1iyueF9i1K+RYZCMIXjKjvyK8hk\"",
    "mtime": "2023-08-13T17:40:18.484Z",
    "size": 1893,
    "path": "../public/_nuxt/_id_.cc32bdac.js.br"
  },
  "/_nuxt/_id_.cc32bdac.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85f-PZCp86PkpX3CwAa0aHUFauWguas\"",
    "mtime": "2023-08-13T17:40:18.478Z",
    "size": 2143,
    "path": "../public/_nuxt/_id_.cc32bdac.js.gz"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-13T17:40:18.303Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-13T17:40:18.491Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-13T17:40:18.485Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.f5649228.js": {
    "type": "application/javascript",
    "etag": "\"294-YmuOSBBmPkTDA1dLt2lPN6Ax6iA\"",
    "mtime": "2023-08-13T17:40:18.301Z",
    "size": 660,
    "path": "../public/_nuxt/basket.f5649228.js"
  },
  "/_nuxt/catalog.49b664fc.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-EpDo7BnGpSCXViDcQ/RRz16x26k\"",
    "mtime": "2023-08-13T17:40:18.300Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.49b664fc.js"
  },
  "/_nuxt/catalog.49b664fc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"91e-awHIUkSKG6W53igW17wzDgdap30\"",
    "mtime": "2023-08-13T17:40:18.501Z",
    "size": 2334,
    "path": "../public/_nuxt/catalog.49b664fc.js.br"
  },
  "/_nuxt/catalog.49b664fc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9a-9V8qiJoZ2Bl7Ch6YoEmUcwvi7sw\"",
    "mtime": "2023-08-13T17:40:18.493Z",
    "size": 2714,
    "path": "../public/_nuxt/catalog.49b664fc.js.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-13T17:40:18.300Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-13T17:40:18.510Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-13T17:40:18.502Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-13T17:40:18.299Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-13T17:40:18.620Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-13T17:40:18.513Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/checkout.a243613b.js": {
    "type": "application/javascript",
    "etag": "\"14efc-IViRk+ShXfEHAn1cdz+kr/ipBBM\"",
    "mtime": "2023-08-13T17:40:18.297Z",
    "size": 85756,
    "path": "../public/_nuxt/checkout.a243613b.js"
  },
  "/_nuxt/checkout.a243613b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"527c-boqCjcCYSmzJUkAMm8ha/Hin6A0\"",
    "mtime": "2023-08-13T17:40:18.720Z",
    "size": 21116,
    "path": "../public/_nuxt/checkout.a243613b.js.br"
  },
  "/_nuxt/checkout.a243613b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fca-YwYd/AkVQUuTkq9KVyAgAZdCEVs\"",
    "mtime": "2023-08-13T17:40:18.623Z",
    "size": 24522,
    "path": "../public/_nuxt/checkout.a243613b.js.gz"
  },
  "/_nuxt/entry.840a2dc3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2561-Pdiufxn2HqA2ConoJMZOdqvXEWk\"",
    "mtime": "2023-08-13T17:40:18.296Z",
    "size": 9569,
    "path": "../public/_nuxt/entry.840a2dc3.css"
  },
  "/_nuxt/entry.840a2dc3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"945-EFFnPjjx2ofrhwfH0lEq8l53LS4\"",
    "mtime": "2023-08-13T17:40:18.731Z",
    "size": 2373,
    "path": "../public/_nuxt/entry.840a2dc3.css.br"
  },
  "/_nuxt/entry.840a2dc3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ab3-p10GXhVZcs31XafoKUo7BHUQKB4\"",
    "mtime": "2023-08-13T17:40:18.721Z",
    "size": 2739,
    "path": "../public/_nuxt/entry.840a2dc3.css.gz"
  },
  "/_nuxt/entry.e264d53d.js": {
    "type": "application/javascript",
    "etag": "\"36254-5A9cekKAl/7QiWQZJh96BPv6Sgo\"",
    "mtime": "2023-08-13T17:40:18.295Z",
    "size": 221780,
    "path": "../public/_nuxt/entry.e264d53d.js"
  },
  "/_nuxt/entry.e264d53d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120e9-q4GITfaaSo10pM8RWV0MvtDe7O8\"",
    "mtime": "2023-08-13T17:40:19.094Z",
    "size": 73961,
    "path": "../public/_nuxt/entry.e264d53d.js.br"
  },
  "/_nuxt/entry.e264d53d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1452b-37VNmErSuiY28NPEBbEsKYttMgs\"",
    "mtime": "2023-08-13T17:40:18.740Z",
    "size": 83243,
    "path": "../public/_nuxt/entry.e264d53d.js.gz"
  },
  "/_nuxt/error-404.1ae9370d.js": {
    "type": "application/javascript",
    "etag": "\"8a8-PL8hUpc0bzjw5eYgSgJQAzhU854\"",
    "mtime": "2023-08-13T17:40:18.293Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.1ae9370d.js"
  },
  "/_nuxt/error-404.1ae9370d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-xW+rCr7iv+tuKsKDaZsCFCh0LvU\"",
    "mtime": "2023-08-13T17:40:19.098Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.1ae9370d.js.br"
  },
  "/_nuxt/error-404.1ae9370d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-6kc7zQcajbY0nx/e1hP284Qf9LE\"",
    "mtime": "2023-08-13T17:40:19.095Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.1ae9370d.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-13T17:40:18.293Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-13T17:40:19.104Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-13T17:40:19.099Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-500.8231f79d.js": {
    "type": "application/javascript",
    "etag": "\"756-8neUkuvh+7X8Rt34MqyXo457O/w\"",
    "mtime": "2023-08-13T17:40:18.292Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.8231f79d.js"
  },
  "/_nuxt/error-500.8231f79d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-Dl65XGnphWzjiakhLvsR5OZrpDk\"",
    "mtime": "2023-08-13T17:40:19.108Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.8231f79d.js.br"
  },
  "/_nuxt/error-500.8231f79d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-/Eu+6XnYyH1BHOMSk2cDD5Ayb5A\"",
    "mtime": "2023-08-13T17:40:19.105Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.8231f79d.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-13T17:40:18.291Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-13T17:40:19.112Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-13T17:40:19.109Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.236a39f4.js": {
    "type": "application/javascript",
    "etag": "\"45e-3wpGa4SdpVlVE333Uf2zw/84sGM\"",
    "mtime": "2023-08-13T17:40:18.290Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.236a39f4.js"
  },
  "/_nuxt/error-component.236a39f4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-G5Zs8dqdC31Qgfjb9aDvGlo5Xfc\"",
    "mtime": "2023-08-13T17:40:19.115Z",
    "size": 517,
    "path": "../public/_nuxt/error-component.236a39f4.js.br"
  },
  "/_nuxt/error-component.236a39f4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-d8unjn2LXqdjzMxP1/IMEH83o2c\"",
    "mtime": "2023-08-13T17:40:19.113Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.236a39f4.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-13T17:40:18.289Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-13T17:40:19.124Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-13T17:40:19.116Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.aa90f53a.js": {
    "type": "application/javascript",
    "etag": "\"a3a-Ul34fspr+vrpPtsI1mKoY6jsjOk\"",
    "mtime": "2023-08-13T17:40:18.289Z",
    "size": 2618,
    "path": "../public/_nuxt/favorite.aa90f53a.js"
  },
  "/_nuxt/favorite.aa90f53a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"455-hzb9uOqSAXaJZRwN22kG6zYT9ls\"",
    "mtime": "2023-08-13T17:40:19.129Z",
    "size": 1109,
    "path": "../public/_nuxt/favorite.aa90f53a.js.br"
  },
  "/_nuxt/favorite.aa90f53a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50c-hV50GL4lQHxCQ6sRJj56TuZELl0\"",
    "mtime": "2023-08-13T17:40:19.125Z",
    "size": 1292,
    "path": "../public/_nuxt/favorite.aa90f53a.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-13T17:40:18.288Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-13T17:40:18.287Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-13T17:40:18.286Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-13T17:40:19.134Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-13T17:40:19.130Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.38c24ec7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-gycqTF6kOf0D/oH0/MSgExObwbg\"",
    "mtime": "2023-08-13T17:40:18.285Z",
    "size": 22887,
    "path": "../public/_nuxt/index.38c24ec7.css"
  },
  "/_nuxt/index.38c24ec7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12e2-J4Ms1faDlkoGnUqv7XxASrPa5cA\"",
    "mtime": "2023-08-13T17:40:19.161Z",
    "size": 4834,
    "path": "../public/_nuxt/index.38c24ec7.css.br"
  },
  "/_nuxt/index.38c24ec7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-ctFPmebAvOBe7PzVpI6YCYtGPdY\"",
    "mtime": "2023-08-13T17:40:19.135Z",
    "size": 5713,
    "path": "../public/_nuxt/index.38c24ec7.css.gz"
  },
  "/_nuxt/index.606c3a92.js": {
    "type": "application/javascript",
    "etag": "\"17101-vky/ryFNKBnIs8Wl2MsavCuOJOo\"",
    "mtime": "2023-08-13T17:40:18.284Z",
    "size": 94465,
    "path": "../public/_nuxt/index.606c3a92.js"
  },
  "/_nuxt/index.606c3a92.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"655c-eCpXROcWyFI2oToHYjWOEVgS0Y4\"",
    "mtime": "2023-08-13T17:40:19.288Z",
    "size": 25948,
    "path": "../public/_nuxt/index.606c3a92.js.br"
  },
  "/_nuxt/index.606c3a92.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7342-KSXd8dY6CqH8L/6qCVu2qrB3nfs\"",
    "mtime": "2023-08-13T17:40:19.165Z",
    "size": 29506,
    "path": "../public/_nuxt/index.606c3a92.js.gz"
  },
  "/_nuxt/index.82852d69.js": {
    "type": "application/javascript",
    "etag": "\"3aba-cpqUltOCzKvcc3ze2zQiil/q/ss\"",
    "mtime": "2023-08-13T17:40:18.283Z",
    "size": 15034,
    "path": "../public/_nuxt/index.82852d69.js"
  },
  "/_nuxt/index.82852d69.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12eb-7fBFT1WZ12pyLqIf3/ROXBk0JM8\"",
    "mtime": "2023-08-13T17:40:19.305Z",
    "size": 4843,
    "path": "../public/_nuxt/index.82852d69.js.br"
  },
  "/_nuxt/index.82852d69.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-Ne+SQFVDUw8wA1bCykNFWe5PcOE\"",
    "mtime": "2023-08-13T17:40:19.289Z",
    "size": 5360,
    "path": "../public/_nuxt/index.82852d69.js.gz"
  },
  "/_nuxt/index.a588a795.js": {
    "type": "application/javascript",
    "etag": "\"64e-5bUUh6cn7tVXvsGaIGDfdXnLxYA\"",
    "mtime": "2023-08-13T17:40:18.282Z",
    "size": 1614,
    "path": "../public/_nuxt/index.a588a795.js"
  },
  "/_nuxt/index.a588a795.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"336-T0o+VG3c6fRCazzM8BGPToJKZcM\"",
    "mtime": "2023-08-13T17:40:19.310Z",
    "size": 822,
    "path": "../public/_nuxt/index.a588a795.js.br"
  },
  "/_nuxt/index.a588a795.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bc-BwXDenT+7UNwlCiv11zZvuIr08Y\"",
    "mtime": "2023-08-13T17:40:19.306Z",
    "size": 956,
    "path": "../public/_nuxt/index.a588a795.js.gz"
  },
  "/_nuxt/isAuth.decab7d1.js": {
    "type": "application/javascript",
    "etag": "\"282-iDzzfQNls1J/62+3K3V7xX2LqDo\"",
    "mtime": "2023-08-13T17:40:18.281Z",
    "size": 642,
    "path": "../public/_nuxt/isAuth.decab7d1.js"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-13T17:40:18.279Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-13T17:40:19.314Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-13T17:40:19.311Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/login.cc816eaf.js": {
    "type": "application/javascript",
    "etag": "\"80a-HI9sFgXWy2tXgadzR4I7VgzDV/E\"",
    "mtime": "2023-08-13T17:40:18.278Z",
    "size": 2058,
    "path": "../public/_nuxt/login.cc816eaf.js"
  },
  "/_nuxt/login.cc816eaf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e7-joNLoNu7FefLNH6kbO5Yd0jPXNk\"",
    "mtime": "2023-08-13T17:40:19.320Z",
    "size": 999,
    "path": "../public/_nuxt/login.cc816eaf.js.br"
  },
  "/_nuxt/login.cc816eaf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ad-lcY333MQWIdfaAH42ML2m0pB6bs\"",
    "mtime": "2023-08-13T17:40:19.315Z",
    "size": 1197,
    "path": "../public/_nuxt/login.cc816eaf.js.gz"
  },
  "/_nuxt/newsList.fe9a6869.js": {
    "type": "application/javascript",
    "etag": "\"e6-z14yPxGWtoTX5K/7Vs4aSThjoGg\"",
    "mtime": "2023-08-13T17:40:18.277Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.fe9a6869.js"
  },
  "/_nuxt/orders.4bbe2d7f.js": {
    "type": "application/javascript",
    "etag": "\"26b6-p9YWuMSNb/uLBxJJuSrK1nv3vDA\"",
    "mtime": "2023-08-13T17:40:18.276Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.4bbe2d7f.js"
  },
  "/_nuxt/orders.4bbe2d7f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bc7-JHyZ3mktQpU+z1g+RhpQFYrzlH8\"",
    "mtime": "2023-08-13T17:40:19.332Z",
    "size": 3015,
    "path": "../public/_nuxt/orders.4bbe2d7f.js.br"
  },
  "/_nuxt/orders.4bbe2d7f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-yLzmjdQsgL0+3K3IyCpMnPs7up8\"",
    "mtime": "2023-08-13T17:40:19.321Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.4bbe2d7f.js.gz"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-13T17:40:18.275Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-13T17:40:19.345Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-13T17:40:19.333Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-13T17:40:18.274Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-13T17:40:19.382Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-13T17:40:19.347Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.d6cf88c0.js": {
    "type": "application/javascript",
    "etag": "\"169d-wm1DhAQmklXxyaZtiEBqAA75wVg\"",
    "mtime": "2023-08-13T17:40:18.272Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.d6cf88c0.js"
  },
  "/_nuxt/profile.d6cf88c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83a-afHUt//ipLFuebwk/kXZMbBKG7E\"",
    "mtime": "2023-08-13T17:40:19.393Z",
    "size": 2106,
    "path": "../public/_nuxt/profile.d6cf88c0.js.br"
  },
  "/_nuxt/profile.d6cf88c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-7BXZpA5vVWLD/fDkGCwRW/rAUy4\"",
    "mtime": "2023-08-13T17:40:19.384Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.d6cf88c0.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-13T17:40:18.271Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-13T17:40:19.397Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-13T17:40:19.394Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.a870e5b4.js": {
    "type": "application/javascript",
    "etag": "\"11b8-b07uAaaTO5HNbk5ex/+Yl6C6690\"",
    "mtime": "2023-08-13T17:40:18.270Z",
    "size": 4536,
    "path": "../public/_nuxt/register.a870e5b4.js"
  },
  "/_nuxt/register.a870e5b4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bf-t33iod5o6bxzapqUSEe1+T9/MCw\"",
    "mtime": "2023-08-13T17:40:19.406Z",
    "size": 1471,
    "path": "../public/_nuxt/register.a870e5b4.js.br"
  },
  "/_nuxt/register.a870e5b4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fb-G8WJG59FoBUpX5DKkBSTw60FHrc\"",
    "mtime": "2023-08-13T17:40:19.398Z",
    "size": 1787,
    "path": "../public/_nuxt/register.a870e5b4.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-13T17:40:18.269Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-13T17:40:19.410Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-13T17:40:19.407Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-13T17:40:18.267Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-13T17:40:18.264Z",
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
