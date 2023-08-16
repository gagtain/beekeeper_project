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
    "mtime": "2023-08-16T17:47:09.276Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-16T17:47:09.274Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-16T17:47:09.274Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"1313f-7O1nTofMiXjI0GBmOs+sMnhrK8s\"",
    "mtime": "2023-08-16T17:47:09.273Z",
    "size": 78143,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-16T17:47:09.272Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-16T17:47:09.271Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-16T17:47:09.271Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-16T17:47:10.304Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-16T17:47:10.301Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-16T17:47:09.270Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-16T17:47:09.268Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.b135fd14.js": {
    "type": "application/javascript",
    "etag": "\"9a7-jqZ2f2EMV2baL5pPY/9NFgyesm8\"",
    "mtime": "2023-08-16T17:47:09.267Z",
    "size": 2471,
    "path": "../public/_nuxt/BasketInfo.b135fd14.js"
  },
  "/_nuxt/BasketInfo.b135fd14.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3f4-IBWt4nFgDg5QhxfeI6NbSC7AfVI\"",
    "mtime": "2023-08-16T17:47:09.283Z",
    "size": 1012,
    "path": "../public/_nuxt/BasketInfo.b135fd14.js.br"
  },
  "/_nuxt/BasketInfo.b135fd14.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bd-lW5oaJCt6uutL6HGC3mRuVu9kO4\"",
    "mtime": "2023-08-16T17:47:09.279Z",
    "size": 1213,
    "path": "../public/_nuxt/BasketInfo.b135fd14.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-16T17:47:09.267Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-16T17:47:09.309Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-16T17:47:09.284Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.2eaf16ed.js": {
    "type": "application/javascript",
    "etag": "\"124d-21ZqI2Eg7BgIG4+EPBvqUXxsaNw\"",
    "mtime": "2023-08-16T17:47:09.266Z",
    "size": 4685,
    "path": "../public/_nuxt/CatalogProduct.2eaf16ed.js"
  },
  "/_nuxt/CatalogProduct.2eaf16ed.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"697-5vnp53+m2HH1dgeKMsJ6Y1uVIpU\"",
    "mtime": "2023-08-16T17:47:09.316Z",
    "size": 1687,
    "path": "../public/_nuxt/CatalogProduct.2eaf16ed.js.br"
  },
  "/_nuxt/CatalogProduct.2eaf16ed.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"781-BJLoWJ9YNvBNHVk1K2Gi549TfGU\"",
    "mtime": "2023-08-16T17:47:09.310Z",
    "size": 1921,
    "path": "../public/_nuxt/CatalogProduct.2eaf16ed.js.gz"
  },
  "/_nuxt/CatalogProduct.c532a385.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2980-rZHKDaUA+5ckLoMVh6QhmSXTENo\"",
    "mtime": "2023-08-16T17:47:09.266Z",
    "size": 10624,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css"
  },
  "/_nuxt/CatalogProduct.c532a385.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"758-qJEKjC2MEsdoNOZX7yfuh8gKd10\"",
    "mtime": "2023-08-16T17:47:09.328Z",
    "size": 1880,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css.br"
  },
  "/_nuxt/CatalogProduct.c532a385.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"89d-2rcErevMbVp4Vl/mFgNJ7OozHgs\"",
    "mtime": "2023-08-16T17:47:09.316Z",
    "size": 2205,
    "path": "../public/_nuxt/CatalogProduct.c532a385.css.gz"
  },
  "/_nuxt/FavoriteComp.2b6997b0.js": {
    "type": "application/javascript",
    "etag": "\"783-8Y1wNeoP4VhlTogHfHRRJe/BjA0\"",
    "mtime": "2023-08-16T17:47:09.266Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.2b6997b0.js"
  },
  "/_nuxt/FavoriteComp.2b6997b0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28f-+iuhOUru7FbK7vNjjnLQ7Ht6sdc\"",
    "mtime": "2023-08-16T17:47:09.332Z",
    "size": 655,
    "path": "../public/_nuxt/FavoriteComp.2b6997b0.js.br"
  },
  "/_nuxt/FavoriteComp.2b6997b0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f8-SQc/Z+ZAe/OLlW967ylH+ldhcLA\"",
    "mtime": "2023-08-16T17:47:09.329Z",
    "size": 760,
    "path": "../public/_nuxt/FavoriteComp.2b6997b0.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-16T17:47:09.265Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-16T17:47:09.349Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-16T17:47:09.333Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2023-08-16T17:47:09.265Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2023-08-16T17:47:09.354Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-Rejs3on+yOc2NeUdVAnPYNj8mRQ\"",
    "mtime": "2023-08-16T17:47:09.350Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.d5cd1b89.js": {
    "type": "application/javascript",
    "etag": "\"e2e-XNM2uvZq8UwZsrIC5btKWLN+Ayg\"",
    "mtime": "2023-08-16T17:47:09.264Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.d5cd1b89.js"
  },
  "/_nuxt/FavoriteComp.d5cd1b89.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"410-6EoalHUfdUfA1D+rG0PuFqtzcCM\"",
    "mtime": "2023-08-16T17:47:09.360Z",
    "size": 1040,
    "path": "../public/_nuxt/FavoriteComp.d5cd1b89.js.br"
  },
  "/_nuxt/FavoriteComp.d5cd1b89.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d2-9dM3N9896/Hx0rs6eHNAu588Qcw\"",
    "mtime": "2023-08-16T17:47:09.355Z",
    "size": 1234,
    "path": "../public/_nuxt/FavoriteComp.d5cd1b89.js.gz"
  },
  "/_nuxt/ImageForm.ef7f2807.js": {
    "type": "application/javascript",
    "etag": "\"1ac-ZgkemD0Y+dVDUiVLfHvcTVcg650\"",
    "mtime": "2023-08-16T17:47:09.263Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.ef7f2807.js"
  },
  "/_nuxt/LoadingComp.64bfe11d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-I/htmvuihC9mC/QNf4EtBvN2MuM\"",
    "mtime": "2023-08-16T17:47:09.262Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.64bfe11d.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-16T17:47:09.262Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-sZfN3CdliGGsNJczzrf7o7jjmGY\"",
    "mtime": "2023-08-16T17:47:09.261Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css"
  },
  "/_nuxt/OrderProductList.02ded14f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-2/fRGZwV9kJGSx7WwMJ0IFQebCU\"",
    "mtime": "2023-08-16T17:47:09.364Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.br"
  },
  "/_nuxt/OrderProductList.02ded14f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-qKQ8xo4Q122XD3egYPBJiCeha/I\"",
    "mtime": "2023-08-16T17:47:09.362Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.02ded14f.css.gz"
  },
  "/_nuxt/OrderProductList.19e1a80b.js": {
    "type": "application/javascript",
    "etag": "\"461-d5p3cAlXZmNtBiUP/EJ/iNvAs4M\"",
    "mtime": "2023-08-16T17:47:09.261Z",
    "size": 1121,
    "path": "../public/_nuxt/OrderProductList.19e1a80b.js"
  },
  "/_nuxt/OrderProductList.19e1a80b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"210-PjLCjN0A3czjZkkvY/pH2V3v5xE\"",
    "mtime": "2023-08-16T17:47:09.367Z",
    "size": 528,
    "path": "../public/_nuxt/OrderProductList.19e1a80b.js.br"
  },
  "/_nuxt/OrderProductList.19e1a80b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24b-SygNddvsGKQYc56ByT+WCBIDWeQ\"",
    "mtime": "2023-08-16T17:47:09.365Z",
    "size": 587,
    "path": "../public/_nuxt/OrderProductList.19e1a80b.js.gz"
  },
  "/_nuxt/UserBasket.62f29146.js": {
    "type": "application/javascript",
    "etag": "\"1312-2FMnDXTFJcUMiU/h9hWvm0SSL1M\"",
    "mtime": "2023-08-16T17:47:09.260Z",
    "size": 4882,
    "path": "../public/_nuxt/UserBasket.62f29146.js"
  },
  "/_nuxt/UserBasket.62f29146.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72c-isM4jD0zTToAqZ52Px/8Mw2Anx0\"",
    "mtime": "2023-08-16T17:47:09.373Z",
    "size": 1836,
    "path": "../public/_nuxt/UserBasket.62f29146.js.br"
  },
  "/_nuxt/UserBasket.62f29146.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"840-oyPgKOP/T02xtuuU4efcKlP+PnM\"",
    "mtime": "2023-08-16T17:47:09.367Z",
    "size": 2112,
    "path": "../public/_nuxt/UserBasket.62f29146.js.gz"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-FHmTiZ+aIM0hI7XK31c9MEsvUnU\"",
    "mtime": "2023-08-16T17:47:09.259Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"685-7rKrXUG/TfUuPWY02GY+rokiK9Q\"",
    "mtime": "2023-08-16T17:47:09.390Z",
    "size": 1669,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.br"
  },
  "/_nuxt/UserBasket.8d3e7fd8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-2LmVhNLk1G+CbDseHCNpDQ8HF2E\"",
    "mtime": "2023-08-16T17:47:09.374Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.8d3e7fd8.css.gz"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2023-08-16T17:47:09.258Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2023-08-16T17:47:09.405Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-XZLmWPGswiaftF1yw2qYf41Cuto\"",
    "mtime": "2023-08-16T17:47:09.391Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.33a05398.js": {
    "type": "application/javascript",
    "etag": "\"12da-CepAUAl2Ycj6rXwNoQjChD9lO1o\"",
    "mtime": "2023-08-16T17:47:09.257Z",
    "size": 4826,
    "path": "../public/_nuxt/_id_.33a05398.js"
  },
  "/_nuxt/_id_.33a05398.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"764-64uCn1O9LMDfMqihAkRGK58sL20\"",
    "mtime": "2023-08-16T17:47:09.411Z",
    "size": 1892,
    "path": "../public/_nuxt/_id_.33a05398.js.br"
  },
  "/_nuxt/_id_.33a05398.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"858-zghuxgbGZq/KcQym9JyxZOVNAdM\"",
    "mtime": "2023-08-16T17:47:09.406Z",
    "size": 2136,
    "path": "../public/_nuxt/_id_.33a05398.js.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2023-08-16T17:47:09.257Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.dfebb5c5.js": {
    "type": "application/javascript",
    "etag": "\"531-KNQxN65ec/CdrH/qYuXD2H60Kb0\"",
    "mtime": "2023-08-16T17:47:09.256Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.dfebb5c5.js"
  },
  "/_nuxt/_id_.dfebb5c5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a3-GrBoVbM2T4+sE1q8jPFwxnkNRUk\"",
    "mtime": "2023-08-16T17:47:09.415Z",
    "size": 675,
    "path": "../public/_nuxt/_id_.dfebb5c5.js.br"
  },
  "/_nuxt/_id_.dfebb5c5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-i6TzRcriJIR7mWS1hUQFHNK/buQ\"",
    "mtime": "2023-08-16T17:47:09.412Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.dfebb5c5.js.gz"
  },
  "/_nuxt/about_us.4f68afbf.js": {
    "type": "application/javascript",
    "etag": "\"5c2-amIyjGSO1QOeiZBALENDsUosevY\"",
    "mtime": "2023-08-16T17:47:09.256Z",
    "size": 1474,
    "path": "../public/_nuxt/about_us.4f68afbf.js"
  },
  "/_nuxt/about_us.4f68afbf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"299-+cPeEyD4GVGMsO8dzNjyoAht+Ho\"",
    "mtime": "2023-08-16T17:47:09.418Z",
    "size": 665,
    "path": "../public/_nuxt/about_us.4f68afbf.js.br"
  },
  "/_nuxt/about_us.4f68afbf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32b-ffbkxRxvUID51J3TpD2odLGW4cc\"",
    "mtime": "2023-08-16T17:47:09.416Z",
    "size": 811,
    "path": "../public/_nuxt/about_us.4f68afbf.js.gz"
  },
  "/_nuxt/about_us.81db9552.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"189-kpF8gewa4K+yw6/IFnbVdPtwxtw\"",
    "mtime": "2023-08-16T17:47:09.255Z",
    "size": 393,
    "path": "../public/_nuxt/about_us.81db9552.css"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2023-08-16T17:47:09.254Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2023-08-16T17:47:09.426Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-SSIYnAvp26EdRJ5cSGltPdmNGf8\"",
    "mtime": "2023-08-16T17:47:09.419Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.e8eafa23.js": {
    "type": "application/javascript",
    "etag": "\"294-eIFcl/mrdKXJFTrTI4e2IHOVWsY\"",
    "mtime": "2023-08-16T17:47:09.254Z",
    "size": 660,
    "path": "../public/_nuxt/basket.e8eafa23.js"
  },
  "/_nuxt/catalog.7abcb85a.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-sFvwU50X9/F5esLacIJ83SIJOfQ\"",
    "mtime": "2023-08-16T17:47:09.253Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.7abcb85a.js"
  },
  "/_nuxt/catalog.7abcb85a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"924-oeF8zh13gOdA+6mygnlLRG9nCkw\"",
    "mtime": "2023-08-16T17:47:09.435Z",
    "size": 2340,
    "path": "../public/_nuxt/catalog.7abcb85a.js.br"
  },
  "/_nuxt/catalog.7abcb85a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a97-LWORWUWYQaVQbLeAMEfDEX3u1QE\"",
    "mtime": "2023-08-16T17:47:09.427Z",
    "size": 2711,
    "path": "../public/_nuxt/catalog.7abcb85a.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2023-08-16T17:47:09.252Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2023-08-16T17:47:09.444Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-gNOQ1AJWhClSXNSbSB224XSjHy8\"",
    "mtime": "2023-08-16T17:47:09.436Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/checkout.28629f11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-6i3GthB3f4eFCJesitf/hop2eUE\"",
    "mtime": "2023-08-16T17:47:09.251Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.28629f11.css"
  },
  "/_nuxt/checkout.28629f11.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fab-Z5WgG5hAsL7CfO8o/zzCYW9TMJA\"",
    "mtime": "2023-08-16T17:47:09.565Z",
    "size": 20395,
    "path": "../public/_nuxt/checkout.28629f11.css.br"
  },
  "/_nuxt/checkout.28629f11.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6019-vpg5saCbgprcd2RvxkLyS86C/sg\"",
    "mtime": "2023-08-16T17:47:09.447Z",
    "size": 24601,
    "path": "../public/_nuxt/checkout.28629f11.css.gz"
  },
  "/_nuxt/checkout.86286fc8.js": {
    "type": "application/javascript",
    "etag": "\"14ef7-SDplq/LngL1QEPsmBFQuN9qK2rg\"",
    "mtime": "2023-08-16T17:47:09.249Z",
    "size": 85751,
    "path": "../public/_nuxt/checkout.86286fc8.js"
  },
  "/_nuxt/checkout.86286fc8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"52aa-FYwyLJuS8pmvkAVuXYIopmbiF5g\"",
    "mtime": "2023-08-16T17:47:09.662Z",
    "size": 21162,
    "path": "../public/_nuxt/checkout.86286fc8.js.br"
  },
  "/_nuxt/checkout.86286fc8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fc9-wtO5Uw2rF0C59uM2C96WUbNrtL8\"",
    "mtime": "2023-08-16T17:47:09.568Z",
    "size": 24521,
    "path": "../public/_nuxt/checkout.86286fc8.js.gz"
  },
  "/_nuxt/entry.b7119aea.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"24fe-8aY6Op73jTLB3sUqjUpP5aD8kn4\"",
    "mtime": "2023-08-16T17:47:09.248Z",
    "size": 9470,
    "path": "../public/_nuxt/entry.b7119aea.css"
  },
  "/_nuxt/entry.b7119aea.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"927-vuL59wD3DaHVX7ohMp45HaUbzKo\"",
    "mtime": "2023-08-16T17:47:09.673Z",
    "size": 2343,
    "path": "../public/_nuxt/entry.b7119aea.css.br"
  },
  "/_nuxt/entry.b7119aea.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a95-8SmlsgvBmA+tJv1K6jKOrnCGIgc\"",
    "mtime": "2023-08-16T17:47:09.663Z",
    "size": 2709,
    "path": "../public/_nuxt/entry.b7119aea.css.gz"
  },
  "/_nuxt/entry.f99cad71.js": {
    "type": "application/javascript",
    "etag": "\"36512-9WgzXCJLtdBQbUAMCISppNDByrs\"",
    "mtime": "2023-08-16T17:47:09.247Z",
    "size": 222482,
    "path": "../public/_nuxt/entry.f99cad71.js"
  },
  "/_nuxt/entry.f99cad71.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"121e2-Ew6EoQAmRmkwl+8723CDHU7KZns\"",
    "mtime": "2023-08-16T17:47:10.014Z",
    "size": 74210,
    "path": "../public/_nuxt/entry.f99cad71.js.br"
  },
  "/_nuxt/entry.f99cad71.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1460e-UFRv0Fc5emnMmVRjrx/myk00n7o\"",
    "mtime": "2023-08-16T17:47:09.682Z",
    "size": 83470,
    "path": "../public/_nuxt/entry.f99cad71.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-16T17:47:09.245Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-16T17:47:10.020Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-16T17:47:10.015Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.c1da8bb8.js": {
    "type": "application/javascript",
    "etag": "\"89e-cO/KNFzNaCSX+S0iw65OWhAtd0c\"",
    "mtime": "2023-08-16T17:47:09.244Z",
    "size": 2206,
    "path": "../public/_nuxt/error-404.c1da8bb8.js"
  },
  "/_nuxt/error-404.c1da8bb8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ca-6IdynsgTBNlOYMiLn7ubZieCGZc\"",
    "mtime": "2023-08-16T17:47:10.024Z",
    "size": 970,
    "path": "../public/_nuxt/error-404.c1da8bb8.js.br"
  },
  "/_nuxt/error-404.c1da8bb8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"473-E4qgEtPo7IVMxjh/RaUnFbcSbqY\"",
    "mtime": "2023-08-16T17:47:10.021Z",
    "size": 1139,
    "path": "../public/_nuxt/error-404.c1da8bb8.js.gz"
  },
  "/_nuxt/error-500.43a99cfc.js": {
    "type": "application/javascript",
    "etag": "\"756-Yda4APFIyW4b4fD4KaBfKyjXrJA\"",
    "mtime": "2023-08-16T17:47:09.241Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.43a99cfc.js"
  },
  "/_nuxt/error-500.43a99cfc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"347-ThQ2GENe8zWu5H2bUKDxLRYmEJk\"",
    "mtime": "2023-08-16T17:47:10.028Z",
    "size": 839,
    "path": "../public/_nuxt/error-500.43a99cfc.js.br"
  },
  "/_nuxt/error-500.43a99cfc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-VBvmnsewotYOthogpu/Mn/SbsKo\"",
    "mtime": "2023-08-16T17:47:10.025Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.43a99cfc.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-16T17:47:09.240Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-16T17:47:10.031Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-16T17:47:10.028Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.d751b67f.js": {
    "type": "application/javascript",
    "etag": "\"45e-Y/z1Rv/EWy3JyT6+5BfrSrTqbmI\"",
    "mtime": "2023-08-16T17:47:09.239Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.d751b67f.js"
  },
  "/_nuxt/error-component.d751b67f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-8omZhGMVrDETOrmq7x6O6tm9Mn8\"",
    "mtime": "2023-08-16T17:47:10.034Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.d751b67f.js.br"
  },
  "/_nuxt/error-component.d751b67f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-+FNYpLuXnlvDuWdrn41PyOjtIoE\"",
    "mtime": "2023-08-16T17:47:10.032Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.d751b67f.js.gz"
  },
  "/_nuxt/favorite.795f381c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-xTqs8hudlzo3ktWHrhjKGpZYm98\"",
    "mtime": "2023-08-16T17:47:09.238Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.795f381c.css"
  },
  "/_nuxt/favorite.795f381c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-PaqP5A3+mqxIc1Li07D5PD1UsRE\"",
    "mtime": "2023-08-16T17:47:10.042Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.795f381c.css.br"
  },
  "/_nuxt/favorite.795f381c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-lWsDHWNwGC7xLNBiz7VRdnw0pfQ\"",
    "mtime": "2023-08-16T17:47:10.035Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.795f381c.css.gz"
  },
  "/_nuxt/favorite.a9d119da.js": {
    "type": "application/javascript",
    "etag": "\"a3f-kxBm9nzUgSuGrWJTWxymtVFjMls\"",
    "mtime": "2023-08-16T17:47:09.237Z",
    "size": 2623,
    "path": "../public/_nuxt/favorite.a9d119da.js"
  },
  "/_nuxt/favorite.a9d119da.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"454-AXa+hDAMQRMId8pmRKFPs0VlQD4\"",
    "mtime": "2023-08-16T17:47:10.046Z",
    "size": 1108,
    "path": "../public/_nuxt/favorite.a9d119da.js.br"
  },
  "/_nuxt/favorite.a9d119da.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"50f-RTpywD9o4H58aAiyiYVH6tSgouo\"",
    "mtime": "2023-08-16T17:47:10.042Z",
    "size": 1295,
    "path": "../public/_nuxt/favorite.a9d119da.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-16T17:47:09.236Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-16T17:47:09.235Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2023-08-16T17:47:09.234Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2023-08-16T17:47:10.051Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-hEc4jN1eCO7up6LJtXK6bvauajQ\"",
    "mtime": "2023-08-16T17:47:10.048Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.42bf3a00.js": {
    "type": "application/javascript",
    "etag": "\"64e-7OFPYLUsAbKxjxxVmrDPl+/hllY\"",
    "mtime": "2023-08-16T17:47:09.231Z",
    "size": 1614,
    "path": "../public/_nuxt/index.42bf3a00.js"
  },
  "/_nuxt/index.42bf3a00.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"325-rn2MWG2N4Cw44XM1h/soetZDzjQ\"",
    "mtime": "2023-08-16T17:47:10.054Z",
    "size": 805,
    "path": "../public/_nuxt/index.42bf3a00.js.br"
  },
  "/_nuxt/index.42bf3a00.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bc-TIFWu/RdAVx8F/IjUWk0A4g5H58\"",
    "mtime": "2023-08-16T17:47:10.052Z",
    "size": 956,
    "path": "../public/_nuxt/index.42bf3a00.js.gz"
  },
  "/_nuxt/index.5500462e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-gvuTuxFQDa+04NcW0ywnYby5ZPA\"",
    "mtime": "2023-08-16T17:47:09.228Z",
    "size": 22887,
    "path": "../public/_nuxt/index.5500462e.css"
  },
  "/_nuxt/index.5500462e.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12df-3+PLIXkWSNgcrbtlCQs22c0G6Us\"",
    "mtime": "2023-08-16T17:47:10.080Z",
    "size": 4831,
    "path": "../public/_nuxt/index.5500462e.css.br"
  },
  "/_nuxt/index.5500462e.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-3CugGbSCtO+2w6bNWIvVP2clYNs\"",
    "mtime": "2023-08-16T17:47:10.055Z",
    "size": 5713,
    "path": "../public/_nuxt/index.5500462e.css.gz"
  },
  "/_nuxt/index.61989f0e.js": {
    "type": "application/javascript",
    "etag": "\"181d5-INzTzW1boT3ro9ur/GFqOzCg0TY\"",
    "mtime": "2023-08-16T17:47:09.227Z",
    "size": 98773,
    "path": "../public/_nuxt/index.61989f0e.js"
  },
  "/_nuxt/index.61989f0e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"694f-Db/fKRH8wwm6hMQJb67P7pkhmuU\"",
    "mtime": "2023-08-16T17:47:10.195Z",
    "size": 26959,
    "path": "../public/_nuxt/index.61989f0e.js.br"
  },
  "/_nuxt/index.61989f0e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"77f1-6l54iBQvaWFDF3xAiZYWRdexCWg\"",
    "mtime": "2023-08-16T17:47:10.084Z",
    "size": 30705,
    "path": "../public/_nuxt/index.61989f0e.js.gz"
  },
  "/_nuxt/index.b1cfa5ee.js": {
    "type": "application/javascript",
    "etag": "\"3abf-L78mynUF7Fv/89R3BV8OPAHvEKU\"",
    "mtime": "2023-08-16T17:47:09.226Z",
    "size": 15039,
    "path": "../public/_nuxt/index.b1cfa5ee.js"
  },
  "/_nuxt/index.b1cfa5ee.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f6-XYzFg9oV6SH8ujpG5uYyIYFH2QM\"",
    "mtime": "2023-08-16T17:47:10.212Z",
    "size": 4854,
    "path": "../public/_nuxt/index.b1cfa5ee.js.br"
  },
  "/_nuxt/index.b1cfa5ee.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-FR/1Y6mjL1/jr9371W6VE4dr75k\"",
    "mtime": "2023-08-16T17:47:10.196Z",
    "size": 5362,
    "path": "../public/_nuxt/index.b1cfa5ee.js.gz"
  },
  "/_nuxt/isAuth.5d04f754.js": {
    "type": "application/javascript",
    "etag": "\"283-OpnA2NsbFGSQZ8EAx1dkcR5qcjE\"",
    "mtime": "2023-08-16T17:47:09.225Z",
    "size": 643,
    "path": "../public/_nuxt/isAuth.5d04f754.js"
  },
  "/_nuxt/login.40568000.js": {
    "type": "application/javascript",
    "etag": "\"80f-ZV2n8mPgzhvPwkdezRGcs/aPNHs\"",
    "mtime": "2023-08-16T17:47:09.224Z",
    "size": 2063,
    "path": "../public/_nuxt/login.40568000.js"
  },
  "/_nuxt/login.40568000.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e8-yCmmK7wfIgMn4ZUshYY22mHIy90\"",
    "mtime": "2023-08-16T17:47:10.217Z",
    "size": 1000,
    "path": "../public/_nuxt/login.40568000.js.br"
  },
  "/_nuxt/login.40568000.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4af-Z4H2TOrOifcB+xZax0/OA9oYkCg\"",
    "mtime": "2023-08-16T17:47:10.213Z",
    "size": 1199,
    "path": "../public/_nuxt/login.40568000.js.gz"
  },
  "/_nuxt/login.7de4998d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-rVIB8KHUxggQMGr4raf9Sm4cUug\"",
    "mtime": "2023-08-16T17:47:09.224Z",
    "size": 2199,
    "path": "../public/_nuxt/login.7de4998d.css"
  },
  "/_nuxt/login.7de4998d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25b-CL4OzBZ2ZgM4UPbaos/p1kQkxEk\"",
    "mtime": "2023-08-16T17:47:10.220Z",
    "size": 603,
    "path": "../public/_nuxt/login.7de4998d.css.br"
  },
  "/_nuxt/login.7de4998d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-nUQlqI+i6EChwY1FThqr4BgUzKs\"",
    "mtime": "2023-08-16T17:47:10.217Z",
    "size": 775,
    "path": "../public/_nuxt/login.7de4998d.css.gz"
  },
  "/_nuxt/newsList.11c4f954.js": {
    "type": "application/javascript",
    "etag": "\"e6-uIijs2p8b0mLGGNdJ0ooCTgUA04\"",
    "mtime": "2023-08-16T17:47:09.223Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.11c4f954.js"
  },
  "/_nuxt/orders.5700aff5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-tymgGKGvKWNQRH7kVkHO6j9uiWA\"",
    "mtime": "2023-08-16T17:47:09.222Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.5700aff5.css"
  },
  "/_nuxt/orders.5700aff5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"791-N4vGTQWeQ8Ltk70zCg/2DRDFNoU\"",
    "mtime": "2023-08-16T17:47:10.231Z",
    "size": 1937,
    "path": "../public/_nuxt/orders.5700aff5.css.br"
  },
  "/_nuxt/orders.5700aff5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-5EPNPcSyI9dVZW6rSVnz4g/pIV8\"",
    "mtime": "2023-08-16T17:47:10.221Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.5700aff5.css.gz"
  },
  "/_nuxt/orders.fa248dad.js": {
    "type": "application/javascript",
    "etag": "\"26bb-I57WWPXf9GpnDhdUQ8WdR+IlfPM\"",
    "mtime": "2023-08-16T17:47:09.221Z",
    "size": 9915,
    "path": "../public/_nuxt/orders.fa248dad.js"
  },
  "/_nuxt/orders.fa248dad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bcc-f+Ke3NqiWd/P0Iw00JAXy6C/hXo\"",
    "mtime": "2023-08-16T17:47:10.243Z",
    "size": 3020,
    "path": "../public/_nuxt/orders.fa248dad.js.br"
  },
  "/_nuxt/orders.fa248dad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"dd7-tH2B/Afe2xoaOodr0PyXcLebu0o\"",
    "mtime": "2023-08-16T17:47:10.232Z",
    "size": 3543,
    "path": "../public/_nuxt/orders.fa248dad.js.gz"
  },
  "/_nuxt/profile.5a24e22b.js": {
    "type": "application/javascript",
    "etag": "\"169d-yItIrjhfgvc4r/44Ehmt2hU7JGY\"",
    "mtime": "2023-08-16T17:47:09.220Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.5a24e22b.js"
  },
  "/_nuxt/profile.5a24e22b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"83d-FTqUlt0dijZN5Z5UgfeBOmcQYHY\"",
    "mtime": "2023-08-16T17:47:10.251Z",
    "size": 2109,
    "path": "../public/_nuxt/profile.5a24e22b.js.br"
  },
  "/_nuxt/profile.5a24e22b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9aa-cNE60L+rQUjqowAP8OsjDU2xy2U\"",
    "mtime": "2023-08-16T17:47:10.244Z",
    "size": 2474,
    "path": "../public/_nuxt/profile.5a24e22b.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2023-08-16T17:47:09.219Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2023-08-16T17:47:10.286Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-taflDNXSPvupTazwRjV7d5/cdF4\"",
    "mtime": "2023-08-16T17:47:10.252Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/register.070b0479.js": {
    "type": "application/javascript",
    "etag": "\"11bd-gP6i0SEeQ552StB77qZpUF5j0jc\"",
    "mtime": "2023-08-16T17:47:09.218Z",
    "size": 4541,
    "path": "../public/_nuxt/register.070b0479.js"
  },
  "/_nuxt/register.070b0479.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bd-z8ZiuLNmR0v65iWYon/xdqoClpM\"",
    "mtime": "2023-08-16T17:47:10.292Z",
    "size": 1469,
    "path": "../public/_nuxt/register.070b0479.js.br"
  },
  "/_nuxt/register.070b0479.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6fc-c7P5VVeaoEFCQqvXmIjIbPOQEtE\"",
    "mtime": "2023-08-16T17:47:10.287Z",
    "size": 1788,
    "path": "../public/_nuxt/register.070b0479.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2023-08-16T17:47:09.217Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2023-08-16T17:47:10.296Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-1QN+GlI7SAvz5vnfgEllSlo5y4U\"",
    "mtime": "2023-08-16T17:47:10.293Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-16T17:47:09.217Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-16T17:47:10.299Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-16T17:47:10.297Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-16T17:47:09.216Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-16T17:47:09.213Z",
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
