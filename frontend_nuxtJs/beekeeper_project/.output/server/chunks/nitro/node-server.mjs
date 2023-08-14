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
    "mtime": "2023-08-14T14:20:22.339Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-14T14:20:22.337Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-14T14:20:22.337Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-08-14T14:20:22.336Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-14T14:20:22.335Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-14T14:20:22.335Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T14:20:22.334Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T14:20:23.435Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T14:20:23.432Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-14T14:20:22.332Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-14T14:20:22.331Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.8c21a0ab.js": {
    "type": "application/javascript",
    "etag": "\"9a2-6QRV8FQFsznSwmpAzEGw+3tmyKE\"",
    "mtime": "2023-08-14T14:20:22.330Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.8c21a0ab.js"
  },
  "/_nuxt/BasketInfo.8c21a0ab.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f1-wjKRlfIM8dcvoQFeX35nfd2Iocs\"",
    "mtime": "2023-08-14T14:20:22.350Z",
    "size": 1009,
    "path": "../public/_nuxt/BasketInfo.8c21a0ab.js.br"
  },
  "/_nuxt/BasketInfo.8c21a0ab.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bc-xAtJVfbtexkGfSO+AH3Yt1WxFow\"",
    "mtime": "2023-08-14T14:20:22.343Z",
    "size": 1212,
    "path": "../public/_nuxt/BasketInfo.8c21a0ab.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-14T14:20:22.330Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-14T14:20:22.376Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-14T14:20:22.351Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298c-5HyqgsFvXql/I+ZV2NiXHtXNQoI\"",
    "mtime": "2023-08-14T14:20:22.329Z",
    "size": 10636,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"756-G6kVT5X+5sFBHk7jmahU1WvKbis\"",
    "mtime": "2023-08-14T14:20:22.389Z",
    "size": 1878,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.br"
  },
  "/_nuxt/CatalogProduct.61fecfb0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89c-b1CPUu+Xjc5NIuwbNcKb0vdnU5w\"",
    "mtime": "2023-08-14T14:20:22.376Z",
    "size": 2204,
    "path": "../public/_nuxt/CatalogProduct.61fecfb0.css.gz"
  },
  "/_nuxt/CatalogProduct.f011f388.js": {
    "type": "application/javascript",
    "etag": "\"1252-O4j7sIvjoqMErORZSgl4Mc6LXi4\"",
    "mtime": "2023-08-14T14:20:22.329Z",
    "size": 4690,
    "path": "../public/_nuxt/CatalogProduct.f011f388.js"
  },
  "/_nuxt/CatalogProduct.f011f388.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"692-wBeFqSPRowR99aRLg/jh3ouA+HU\"",
    "mtime": "2023-08-14T14:20:22.395Z",
    "size": 1682,
    "path": "../public/_nuxt/CatalogProduct.f011f388.js.br"
  },
  "/_nuxt/CatalogProduct.f011f388.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"786-rGEVTbxAg1keTvkCCRBD4h4Jg28\"",
    "mtime": "2023-08-14T14:20:22.389Z",
    "size": 1926,
    "path": "../public/_nuxt/CatalogProduct.f011f388.js.gz"
  },
  "/_nuxt/FavoriteComp.559630c8.js": {
    "type": "application/javascript",
    "etag": "\"783-3PT9+Dl+OfAzKfUR73bHXHrreW4\"",
    "mtime": "2023-08-14T14:20:22.328Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.559630c8.js"
  },
  "/_nuxt/FavoriteComp.559630c8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"290-deZ6xU+tepcoTiQtth8TnF8gN1c\"",
    "mtime": "2023-08-14T14:20:22.399Z",
    "size": 656,
    "path": "../public/_nuxt/FavoriteComp.559630c8.js.br"
  },
  "/_nuxt/FavoriteComp.559630c8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fb-q/FSFk284wlafylqj8oZmB4g3+Q\"",
    "mtime": "2023-08-14T14:20:22.396Z",
    "size": 763,
    "path": "../public/_nuxt/FavoriteComp.559630c8.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-14T14:20:22.328Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-14T14:20:22.416Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-14T14:20:22.400Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8f62df88.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10c0-MDJ3HS2LkzQvHzVCcRgKb020Emg\"",
    "mtime": "2023-08-14T14:20:22.327Z",
    "size": 4288,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c9-DRpGLBglkIRc21jsLtBqAT2A1L4\"",
    "mtime": "2023-08-14T14:20:22.422Z",
    "size": 969,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.br"
  },
  "/_nuxt/FavoriteComp.8f62df88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-1AcREk79gvPNKIKJOymEXyV9YgA\"",
    "mtime": "2023-08-14T14:20:22.417Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8f62df88.css.gz"
  },
  "/_nuxt/FavoriteComp.a368d696.js": {
    "type": "application/javascript",
    "etag": "\"e2e-l7u9YskiyVCRdYfMxemnIg/SOaI\"",
    "mtime": "2023-08-14T14:20:22.326Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.a368d696.js"
  },
  "/_nuxt/FavoriteComp.a368d696.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"413-HJRYHpOUDGg+jcSAajgWuJmFo4g\"",
    "mtime": "2023-08-14T14:20:22.429Z",
    "size": 1043,
    "path": "../public/_nuxt/FavoriteComp.a368d696.js.br"
  },
  "/_nuxt/FavoriteComp.a368d696.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-/Z+RhRf4yGdYLdjaktVy8szRr/s\"",
    "mtime": "2023-08-14T14:20:22.423Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.a368d696.js.gz"
  },
  "/_nuxt/ImageForm.d8dd134c.js": {
    "type": "application/javascript",
    "etag": "\"1ac-u/ZAVg5DQ/J5079nMdC86xID2aY\"",
    "mtime": "2023-08-14T14:20:22.326Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.d8dd134c.js"
  },
  "/_nuxt/LoadingComp.198e19c8.js": {
    "type": "application/javascript",
    "etag": "\"1fe-4laAHWPGbT+OZVYEa+QPBL3tVnM\"",
    "mtime": "2023-08-14T14:20:22.325Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.198e19c8.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-14T14:20:22.325Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-14T14:20:22.324Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-14T14:20:22.432Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-14T14:20:22.430Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.1beebcc6.js": {
    "type": "application/javascript",
    "etag": "\"461-/MRp5nsMmWtTI8KFI3rinyL9/CA\"",
    "mtime": "2023-08-14T14:20:22.324Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.1beebcc6.js"
  },
  "/_nuxt/OrderProductList.1beebcc6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"214-zVNUIPMQYzwP1EjcGtLnxIaCOKg\"",
    "mtime": "2023-08-14T14:20:22.436Z",
    "size": 532,
    "path": "../public/_nuxt/OrderProductList.1beebcc6.js.br"
  },
  "/_nuxt/OrderProductList.1beebcc6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24d-ol/sAkNJCmhbYctAmQP14NaNV4I\"",
    "mtime": "2023-08-14T14:20:22.433Z",
    "size": 589,
    "path": "../public/_nuxt/OrderProductList.1beebcc6.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-14T14:20:22.323Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-14T14:20:22.453Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-14T14:20:22.437Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/UserBasket.d70526f7.js": {
    "type": "application/javascript",
    "etag": "\"1312-8HkAbbro1J1BiOttHUxBthBWNP0\"",
    "mtime": "2023-08-14T14:20:22.323Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.d70526f7.js"
  },
  "/_nuxt/UserBasket.d70526f7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"737-a84IEtg+1jJGua2wAy2XIOgKN3I\"",
    "mtime": "2023-08-14T14:20:22.461Z",
    "size": 1847,
    "path": "../public/_nuxt/UserBasket.d70526f7.js.br"
  },
  "/_nuxt/UserBasket.d70526f7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"841-W5m1S/Lq1oB9dAL+nND8KNk/xuA\"",
    "mtime": "2023-08-14T14:20:22.454Z",
    "size": 2113,
    "path": "../public/_nuxt/UserBasket.d70526f7.js.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-14T14:20:22.322Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-14T14:20:22.476Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-14T14:20:22.462Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.341d719b.js": {
    "type": "application/javascript",
    "etag": "\"12e4-ZHKMZbwVKFH2hEc6wMPqC2N7MVE\"",
    "mtime": "2023-08-14T14:20:22.322Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.341d719b.js"
  },
  "/_nuxt/_id_.341d719b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"75f-Nl+F1HsWb3pY2nr5qWZD/YK3aRY\"",
    "mtime": "2023-08-14T14:20:22.483Z",
    "size": 1887,
    "path": "../public/_nuxt/_id_.341d719b.js.br"
  },
  "/_nuxt/_id_.341d719b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"860-VUd7Avt+xATKfq2sb9Q7u9UPuYI\"",
    "mtime": "2023-08-14T14:20:22.477Z",
    "size": 2144,
    "path": "../public/_nuxt/_id_.341d719b.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-14T14:20:22.321Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.ed318014.js": {
    "type": "application/javascript",
    "etag": "\"531-VfObV6nZh+Tgev3vcTKhAQ+seWQ\"",
    "mtime": "2023-08-14T14:20:22.321Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.ed318014.js"
  },
  "/_nuxt/_id_.ed318014.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a1-aKQbOCfNYe7SUSZrM7OGQf08PBU\"",
    "mtime": "2023-08-14T14:20:22.488Z",
    "size": 673,
    "path": "../public/_nuxt/_id_.ed318014.js.br"
  },
  "/_nuxt/_id_.ed318014.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-w+jakCFfcT6jK2bhWKa84m7UoCQ\"",
    "mtime": "2023-08-14T14:20:22.484Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.ed318014.js.gz"
  },
  "/_nuxt/basket.169ad7da.js": {
    "type": "application/javascript",
    "etag": "\"294-a8MQo0LcBUPa+jc+ihr/SkktsCI\"",
    "mtime": "2023-08-14T14:20:22.320Z",
    "size": 660,
    "path": "../public/_nuxt/basket.169ad7da.js"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-14T14:20:22.320Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-14T14:20:22.495Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-14T14:20:22.489Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/catalog.5717877c.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-tl56CgG1ne90DQvSz/4vQ2pABtM\"",
    "mtime": "2023-08-14T14:20:22.319Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.5717877c.js"
  },
  "/_nuxt/catalog.5717877c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"920-9cw4720Qokm/6KW8yC/t5REVgrQ\"",
    "mtime": "2023-08-14T14:20:22.505Z",
    "size": 2336,
    "path": "../public/_nuxt/catalog.5717877c.js.br"
  },
  "/_nuxt/catalog.5717877c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a99-gxLQQ7wLxpXy9+xiCXox/HC0cb8\"",
    "mtime": "2023-08-14T14:20:22.496Z",
    "size": 2713,
    "path": "../public/_nuxt/catalog.5717877c.js.gz"
  },
  "/_nuxt/catalog.5814a029.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e95-74lH3iPE/Oo1w6YuFBpNVcFDuPI\"",
    "mtime": "2023-08-14T14:20:22.319Z",
    "size": 7829,
    "path": "../public/_nuxt/catalog.5814a029.css"
  },
  "/_nuxt/catalog.5814a029.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ec-/wwDEHTlh1xukkC/pvnVOiy1hZM\"",
    "mtime": "2023-08-14T14:20:22.515Z",
    "size": 1772,
    "path": "../public/_nuxt/catalog.5814a029.css.br"
  },
  "/_nuxt/catalog.5814a029.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"807-TvgIztvxsSwWAViZmHQyMl+VTBc\"",
    "mtime": "2023-08-14T14:20:22.506Z",
    "size": 2055,
    "path": "../public/_nuxt/catalog.5814a029.css.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-14T14:20:22.318Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-14T14:20:22.626Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-14T14:20:22.518Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/checkout.c24eeb2c.js": {
    "type": "application/javascript",
    "etag": "\"14efc-7blwpV/0YowBoSxQkmlU3MU1yJA\"",
    "mtime": "2023-08-14T14:20:22.316Z",
    "size": 85756,
    "path": "../public/_nuxt/checkout.c24eeb2c.js"
  },
  "/_nuxt/checkout.c24eeb2c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"52bd-6e+tovCtAjwQrLnpgbhNFpbUDz0\"",
    "mtime": "2023-08-14T14:20:22.723Z",
    "size": 21181,
    "path": "../public/_nuxt/checkout.c24eeb2c.js.br"
  },
  "/_nuxt/checkout.c24eeb2c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fcc-dEZl+BRqb2K81CjIU9BWqteIPkA\"",
    "mtime": "2023-08-14T14:20:22.629Z",
    "size": 24524,
    "path": "../public/_nuxt/checkout.c24eeb2c.js.gz"
  },
  "/_nuxt/entry.316324b7.js": {
    "type": "application/javascript",
    "etag": "\"3627d-2kPOF5HNLL16hzZdQtHolSQVZmo\"",
    "mtime": "2023-08-14T14:20:22.315Z",
    "size": 221821,
    "path": "../public/_nuxt/entry.316324b7.js"
  },
  "/_nuxt/entry.316324b7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"120ac-b8RkzNE2mcdAZ9VmUl6YQTubJCQ\"",
    "mtime": "2023-08-14T14:20:23.109Z",
    "size": 73900,
    "path": "../public/_nuxt/entry.316324b7.js.br"
  },
  "/_nuxt/entry.316324b7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1452d-U8K0iSKO+Fa65dF4A9IWDOXleic\"",
    "mtime": "2023-08-14T14:20:22.732Z",
    "size": 83245,
    "path": "../public/_nuxt/entry.316324b7.js.gz"
  },
  "/_nuxt/entry.6b1d7b25.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"257d-/4A9x43bx7s7S9yxMVss+zvQIl4\"",
    "mtime": "2023-08-14T14:20:22.314Z",
    "size": 9597,
    "path": "../public/_nuxt/entry.6b1d7b25.css"
  },
  "/_nuxt/entry.6b1d7b25.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"956-gikpyDHl5zMq4SiuSpu1pImngM4\"",
    "mtime": "2023-08-14T14:20:23.120Z",
    "size": 2390,
    "path": "../public/_nuxt/entry.6b1d7b25.css.br"
  },
  "/_nuxt/entry.6b1d7b25.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac8-rCkm2ulgUX3rars7w9/t745D1rA\"",
    "mtime": "2023-08-14T14:20:23.109Z",
    "size": 2760,
    "path": "../public/_nuxt/entry.6b1d7b25.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-14T14:20:22.313Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-14T14:20:23.125Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-14T14:20:23.120Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.d268967b.js": {
    "type": "application/javascript",
    "etag": "\"8a8-7jePM1l7RnULeEJPipyx71NwnTg\"",
    "mtime": "2023-08-14T14:20:22.313Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.d268967b.js"
  },
  "/_nuxt/error-404.d268967b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cb-Any1wtqfq5XFMbNeUEsYUo1RGow\"",
    "mtime": "2023-08-14T14:20:23.129Z",
    "size": 971,
    "path": "../public/_nuxt/error-404.d268967b.js.br"
  },
  "/_nuxt/error-404.d268967b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-LeHM9E69IUgXiDrYm2PAYJlOJIo\"",
    "mtime": "2023-08-14T14:20:23.126Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.d268967b.js.gz"
  },
  "/_nuxt/error-500.45ed03f2.js": {
    "type": "application/javascript",
    "etag": "\"756-4y9xKVUi1cDWIagPFgA9lMSC6us\"",
    "mtime": "2023-08-14T14:20:22.312Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.45ed03f2.js"
  },
  "/_nuxt/error-500.45ed03f2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-1G79lcT/Xswb9DqD2Z6aOqTQAKM\"",
    "mtime": "2023-08-14T14:20:23.133Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.45ed03f2.js.br"
  },
  "/_nuxt/error-500.45ed03f2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-+trPPLV2hECM6ujhuc6O2kIuEw0\"",
    "mtime": "2023-08-14T14:20:23.130Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.45ed03f2.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-14T14:20:22.312Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-14T14:20:23.136Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-14T14:20:23.133Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.ad5856db.js": {
    "type": "application/javascript",
    "etag": "\"45e-/Z/NYQxRV0JNCJD6hQO0hWVZFRI\"",
    "mtime": "2023-08-14T14:20:22.311Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.ad5856db.js"
  },
  "/_nuxt/error-component.ad5856db.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-hisvl7l6x3wUIATl+IAFVH8m3zA\"",
    "mtime": "2023-08-14T14:20:23.140Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.ad5856db.js.br"
  },
  "/_nuxt/error-component.ad5856db.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-HFBLx+RJn4CTjYcACkEXRp7YwzA\"",
    "mtime": "2023-08-14T14:20:23.137Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.ad5856db.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-14T14:20:22.311Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-14T14:20:23.147Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-14T14:20:23.141Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.fea9024d.js": {
    "type": "application/javascript",
    "etag": "\"a3a-cnabP43IaEARaWEmoxt+m3nr84Y\"",
    "mtime": "2023-08-14T14:20:22.310Z",
    "size": 2618,
    "path": "../public/_nuxt/favorite.fea9024d.js"
  },
  "/_nuxt/favorite.fea9024d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"453-Znq8msJPQJfctHIFJzWE1TyYfM8\"",
    "mtime": "2023-08-14T14:20:23.153Z",
    "size": 1107,
    "path": "../public/_nuxt/favorite.fea9024d.js.br"
  },
  "/_nuxt/favorite.fea9024d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50d-rdCk0JWfq76F4FaMYE37VqLHVJE\"",
    "mtime": "2023-08-14T14:20:23.148Z",
    "size": 1293,
    "path": "../public/_nuxt/favorite.fea9024d.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-14T14:20:22.310Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-14T14:20:22.309Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-14T14:20:22.309Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-14T14:20:23.158Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-14T14:20:23.154Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.84ea6aeb.js": {
    "type": "application/javascript",
    "etag": "\"17f2c-UfSQs/0Wo1JefncMDn6bRYnJg3E\"",
    "mtime": "2023-08-14T14:20:22.308Z",
    "size": 98092,
    "path": "../public/_nuxt/index.84ea6aeb.js"
  },
  "/_nuxt/index.84ea6aeb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"68b2-oNWm/X//iYsZn85WtAVH1QfKbbI\"",
    "mtime": "2023-08-14T14:20:23.283Z",
    "size": 26802,
    "path": "../public/_nuxt/index.84ea6aeb.js.br"
  },
  "/_nuxt/index.84ea6aeb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7702-51UPOPjAGwIuuVpu1T9sGHcs+iU\"",
    "mtime": "2023-08-14T14:20:23.161Z",
    "size": 30466,
    "path": "../public/_nuxt/index.84ea6aeb.js.gz"
  },
  "/_nuxt/index.8735758c.js": {
    "type": "application/javascript",
    "etag": "\"3aba-M66agKBZ+0XKgTOW2lmQTsBxq0o\"",
    "mtime": "2023-08-14T14:20:22.307Z",
    "size": 15034,
    "path": "../public/_nuxt/index.8735758c.js"
  },
  "/_nuxt/index.8735758c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12fc-NTzJgTaOkof9BajXrQeko1ZGHw4\"",
    "mtime": "2023-08-14T14:20:23.302Z",
    "size": 4860,
    "path": "../public/_nuxt/index.8735758c.js.br"
  },
  "/_nuxt/index.8735758c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-gUMVyhjLfCaU8ExE9vjcA2nCPMA\"",
    "mtime": "2023-08-14T14:20:23.284Z",
    "size": 5361,
    "path": "../public/_nuxt/index.8735758c.js.gz"
  },
  "/_nuxt/index.f334d20d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-5r+wmU66YIGf3fU/ee2CBtRLWUY\"",
    "mtime": "2023-08-14T14:20:22.307Z",
    "size": 22887,
    "path": "../public/_nuxt/index.f334d20d.css"
  },
  "/_nuxt/index.f334d20d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12df-DMFZGF7afAHIQbOfcl52uy1/IBA\"",
    "mtime": "2023-08-14T14:20:23.332Z",
    "size": 4831,
    "path": "../public/_nuxt/index.f334d20d.css.br"
  },
  "/_nuxt/index.f334d20d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-vmxBJiT9Xl1QZaV6diDAn4Nhf7s\"",
    "mtime": "2023-08-14T14:20:23.303Z",
    "size": 5713,
    "path": "../public/_nuxt/index.f334d20d.css.gz"
  },
  "/_nuxt/index.fbed1bcc.js": {
    "type": "application/javascript",
    "etag": "\"64e-4vmskcUM07xeMfEcFeQRmGc7qgk\"",
    "mtime": "2023-08-14T14:20:22.306Z",
    "size": 1614,
    "path": "../public/_nuxt/index.fbed1bcc.js"
  },
  "/_nuxt/index.fbed1bcc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"335-rHbGVL2a2Z5gBcvdhOr508gVb5g\"",
    "mtime": "2023-08-14T14:20:23.336Z",
    "size": 821,
    "path": "../public/_nuxt/index.fbed1bcc.js.br"
  },
  "/_nuxt/index.fbed1bcc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bc-ay1vudbX3BBk7JJna/f+g0a8p1w\"",
    "mtime": "2023-08-14T14:20:23.333Z",
    "size": 956,
    "path": "../public/_nuxt/index.fbed1bcc.js.gz"
  },
  "/_nuxt/isAuth.6e07cc93.js": {
    "type": "application/javascript",
    "etag": "\"282-zjoNGV33J630GFqE4vzsW88h7+E\"",
    "mtime": "2023-08-14T14:20:22.306Z",
    "size": 642,
    "path": "../public/_nuxt/isAuth.6e07cc93.js"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-14T14:20:22.305Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-14T14:20:23.340Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-14T14:20:23.337Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/login.a942bb6d.js": {
    "type": "application/javascript",
    "etag": "\"80a-/OOttukLCH/X4LxikSXEKVkLSjk\"",
    "mtime": "2023-08-14T14:20:22.305Z",
    "size": 2058,
    "path": "../public/_nuxt/login.a942bb6d.js"
  },
  "/_nuxt/login.a942bb6d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e8-6XluwFk5LFMze/YY28ZgMYNkfPo\"",
    "mtime": "2023-08-14T14:20:23.344Z",
    "size": 1000,
    "path": "../public/_nuxt/login.a942bb6d.js.br"
  },
  "/_nuxt/login.a942bb6d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ad-Spg2HNRNNJf7xcnQ+f3cTbHXy9M\"",
    "mtime": "2023-08-14T14:20:23.341Z",
    "size": 1197,
    "path": "../public/_nuxt/login.a942bb6d.js.gz"
  },
  "/_nuxt/newsList.9fa1f73f.js": {
    "type": "application/javascript",
    "etag": "\"e6-e/LwXk+zfO5KYUuOc8itLwvEiIg\"",
    "mtime": "2023-08-14T14:20:22.304Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.9fa1f73f.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-14T14:20:22.304Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-14T14:20:23.357Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-14T14:20:23.345Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.8eb06536.js": {
    "type": "application/javascript",
    "etag": "\"26b6-bUjS/0uw89+gf/2/09geR/GFnjI\"",
    "mtime": "2023-08-14T14:20:22.303Z",
    "size": 9910,
    "path": "../public/_nuxt/orders.8eb06536.js"
  },
  "/_nuxt/orders.8eb06536.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bcc-uA4OFVgq5u5xqXBdlDcuw+RrfMM\"",
    "mtime": "2023-08-14T14:20:23.370Z",
    "size": 3020,
    "path": "../public/_nuxt/orders.8eb06536.js.br"
  },
  "/_nuxt/orders.8eb06536.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd6-Vzni1li5tlt4uP3pz+o2wM5/2ss\"",
    "mtime": "2023-08-14T14:20:23.358Z",
    "size": 3542,
    "path": "../public/_nuxt/orders.8eb06536.js.gz"
  },
  "/_nuxt/profile.4761fb94.js": {
    "type": "application/javascript",
    "etag": "\"169d-RZhCd0o/ZCG3kqdxiBXuMmtcmFs\"",
    "mtime": "2023-08-14T14:20:22.302Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.4761fb94.js"
  },
  "/_nuxt/profile.4761fb94.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83f-IiF4vGOZQJF8SxLKw5WkoE9lwoQ\"",
    "mtime": "2023-08-14T14:20:23.378Z",
    "size": 2111,
    "path": "../public/_nuxt/profile.4761fb94.js.br"
  },
  "/_nuxt/profile.4761fb94.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9ab-mpfQVkY5SeYEGlVbwFxm8JoMw9c\"",
    "mtime": "2023-08-14T14:20:23.371Z",
    "size": 2475,
    "path": "../public/_nuxt/profile.4761fb94.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-14T14:20:22.302Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-14T14:20:23.415Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-14T14:20:23.379Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/register.1bb736bc.js": {
    "type": "application/javascript",
    "etag": "\"11b8-8Q0INMsd7MrH6LGerfHY8BaYN9Y\"",
    "mtime": "2023-08-14T14:20:22.301Z",
    "size": 4536,
    "path": "../public/_nuxt/register.1bb736bc.js"
  },
  "/_nuxt/register.1bb736bc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5be-Hw6dLQAwCRbmjO5tw28RTFq4HDQ\"",
    "mtime": "2023-08-14T14:20:23.422Z",
    "size": 1470,
    "path": "../public/_nuxt/register.1bb736bc.js.br"
  },
  "/_nuxt/register.1bb736bc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fa-vkJDpzmYEIopRMTt8WiXzq8g3r4\"",
    "mtime": "2023-08-14T14:20:23.416Z",
    "size": 1786,
    "path": "../public/_nuxt/register.1bb736bc.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-14T14:20:22.300Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-14T14:20:23.427Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-14T14:20:23.423Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-14T14:20:22.300Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-14T14:20:23.430Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-14T14:20:23.427Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-14T14:20:22.299Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-14T14:20:22.297Z",
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
