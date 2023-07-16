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
    "mtime": "2023-07-16T05:15:18.962Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-16T05:15:18.960Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.45f7082c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b6d-VvrrFRsXbDJ9M/h80auLEntP6aE\"",
    "mtime": "2023-07-16T05:15:18.958Z",
    "size": 19309,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css"
  },
  "/_nuxt/BasketInfo.45f7082c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"72a-KqDoyXblYQJ65j2nly9ogCljD/w\"",
    "mtime": "2023-07-16T05:15:18.994Z",
    "size": 1834,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css.br"
  },
  "/_nuxt/BasketInfo.45f7082c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9da-o1rTuBRbNvmUhnOBP8/kTXHz2Fk\"",
    "mtime": "2023-07-16T05:15:18.966Z",
    "size": 2522,
    "path": "../public/_nuxt/BasketInfo.45f7082c.css.gz"
  },
  "/_nuxt/BasketInfo.6bb66a39.js": {
    "type": "application/javascript",
    "etag": "\"96e-2PnylOiOelZ1xtHvLbCVnODHBc8\"",
    "mtime": "2023-07-16T05:15:18.957Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.6bb66a39.js"
  },
  "/_nuxt/BasketInfo.6bb66a39.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3df-7kixIcPiSClncqraU0b9iOWsOFQ\"",
    "mtime": "2023-07-16T05:15:18.999Z",
    "size": 991,
    "path": "../public/_nuxt/BasketInfo.6bb66a39.js.br"
  },
  "/_nuxt/BasketInfo.6bb66a39.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49b-guH1Ur9RfOqjUqESRzg1qIjTXMQ\"",
    "mtime": "2023-07-16T05:15:18.995Z",
    "size": 1179,
    "path": "../public/_nuxt/BasketInfo.6bb66a39.js.gz"
  },
  "/_nuxt/CatalogProduct.4d181af1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1eb9-Gpymc9qNz5CtUu33gLaLolXVusk\"",
    "mtime": "2023-07-16T05:15:18.957Z",
    "size": 7865,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css"
  },
  "/_nuxt/CatalogProduct.4d181af1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b6-5TL3vGX4IJ+gtLAattuiw2ShZEY\"",
    "mtime": "2023-07-16T05:15:19.008Z",
    "size": 1718,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css.br"
  },
  "/_nuxt/CatalogProduct.4d181af1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7c0-GI7/2nWisfA2RmEJ3QZdbRxnpiE\"",
    "mtime": "2023-07-16T05:15:19.000Z",
    "size": 1984,
    "path": "../public/_nuxt/CatalogProduct.4d181af1.css.gz"
  },
  "/_nuxt/CatalogProduct.7bd81776.js": {
    "type": "application/javascript",
    "etag": "\"bea-SS9vRl+f+bgMMThdFQvtSrT5biM\"",
    "mtime": "2023-07-16T05:15:18.956Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.7bd81776.js"
  },
  "/_nuxt/CatalogProduct.7bd81776.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b6-BgOs589pd7G9QU1i1/xaNXBEa+g\"",
    "mtime": "2023-07-16T05:15:19.013Z",
    "size": 1206,
    "path": "../public/_nuxt/CatalogProduct.7bd81776.js.br"
  },
  "/_nuxt/CatalogProduct.7bd81776.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"555-bhDciUZuRbNNT3BMhUeAr65c3O0\"",
    "mtime": "2023-07-16T05:15:19.009Z",
    "size": 1365,
    "path": "../public/_nuxt/CatalogProduct.7bd81776.js.gz"
  },
  "/_nuxt/FavoriteComp.895c04de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31f3-R8PA2Y5pi/4D3/9hFYxTm4Akr9s\"",
    "mtime": "2023-07-16T05:15:18.956Z",
    "size": 12787,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css"
  },
  "/_nuxt/FavoriteComp.895c04de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"63a-bQcmKhHJ23bIKne1/kVyNiYeF/c\"",
    "mtime": "2023-07-16T05:15:19.030Z",
    "size": 1594,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css.br"
  },
  "/_nuxt/FavoriteComp.895c04de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7e3-6H5cx/4lesO60SuelmCY8XpI3PY\"",
    "mtime": "2023-07-16T05:15:19.014Z",
    "size": 2019,
    "path": "../public/_nuxt/FavoriteComp.895c04de.css.gz"
  },
  "/_nuxt/FavoriteComp.a59e3298.js": {
    "type": "application/javascript",
    "etag": "\"c46-psVBBOV5K1dCWDUZp697aH88+b8\"",
    "mtime": "2023-07-16T05:15:18.955Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.a59e3298.js"
  },
  "/_nuxt/FavoriteComp.a59e3298.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3bc-yvUrXpaMrzBCc8U9DDYsplK2FYw\"",
    "mtime": "2023-07-16T05:15:19.035Z",
    "size": 956,
    "path": "../public/_nuxt/FavoriteComp.a59e3298.js.br"
  },
  "/_nuxt/FavoriteComp.a59e3298.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"457-fJ096jU2a5HJ+ipxxllszhSx+Zg\"",
    "mtime": "2023-07-16T05:15:19.030Z",
    "size": 1111,
    "path": "../public/_nuxt/FavoriteComp.a59e3298.js.gz"
  },
  "/_nuxt/ImageForm.822e0f52.js": {
    "type": "application/javascript",
    "etag": "\"225-Rx8VqYgAsHx307oBeZwsxLiqH1g\"",
    "mtime": "2023-07-16T05:15:18.954Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.822e0f52.js"
  },
  "/_nuxt/LoadingComp.18bbea0d.js": {
    "type": "application/javascript",
    "etag": "\"1fe-dJgrdxVIB52TOPL6tFL6exYFC80\"",
    "mtime": "2023-07-16T05:15:18.953Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.18bbea0d.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-16T05:15:18.953Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.5a467be7.js": {
    "type": "application/javascript",
    "etag": "\"459-XjkubnxJ6Zw7bKv0I6J8e9trd1c\"",
    "mtime": "2023-07-16T05:15:18.952Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.5a467be7.js"
  },
  "/_nuxt/OrderProductList.5a467be7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-n2seZRniIJpHQTZquvCypuKAuCs\"",
    "mtime": "2023-07-16T05:15:19.039Z",
    "size": 517,
    "path": "../public/_nuxt/OrderProductList.5a467be7.js.br"
  },
  "/_nuxt/OrderProductList.5a467be7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23a-QOGEq1m06mPL6Euquu7asUpEy5Q\"",
    "mtime": "2023-07-16T05:15:19.036Z",
    "size": 570,
    "path": "../public/_nuxt/OrderProductList.5a467be7.js.gz"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4bc-lMa/2oMDlBunyQ+EyKWL+HNL+GI\"",
    "mtime": "2023-07-16T05:15:18.951Z",
    "size": 1212,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1d1-1Fh5VsjQ53gow03V+1oVYan+2ns\"",
    "mtime": "2023-07-16T05:15:19.041Z",
    "size": 465,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.br"
  },
  "/_nuxt/OrderProductList.ae8b4ebe.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"234-UBpy5IK2zcWy+lc9Mom7Ya606S4\"",
    "mtime": "2023-07-16T05:15:19.039Z",
    "size": 564,
    "path": "../public/_nuxt/OrderProductList.ae8b4ebe.css.gz"
  },
  "/_nuxt/RatingComp.719a0398.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"122d-XZWY7f4ocOep0TA7es2vKAk1Zls\"",
    "mtime": "2023-07-16T05:15:18.951Z",
    "size": 4653,
    "path": "../public/_nuxt/RatingComp.719a0398.css"
  },
  "/_nuxt/RatingComp.719a0398.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"460-mMvFzEBlGeka4WXe9/EJ6rgc2Vo\"",
    "mtime": "2023-07-16T05:15:19.047Z",
    "size": 1120,
    "path": "../public/_nuxt/RatingComp.719a0398.css.br"
  },
  "/_nuxt/RatingComp.719a0398.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"52a-i3c/9A78phj7ls0zjCfyGmFuMGU\"",
    "mtime": "2023-07-16T05:15:19.042Z",
    "size": 1322,
    "path": "../public/_nuxt/RatingComp.719a0398.css.gz"
  },
  "/_nuxt/RatingComp.db3dedf5.js": {
    "type": "application/javascript",
    "etag": "\"bac-XAv37y8xYMxaOInPH9pgYq3aq9I\"",
    "mtime": "2023-07-16T05:15:18.950Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.db3dedf5.js"
  },
  "/_nuxt/RatingComp.db3dedf5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d5-/cI5xFNjKiOfIsSnG32E39CP3ZI\"",
    "mtime": "2023-07-16T05:15:19.052Z",
    "size": 981,
    "path": "../public/_nuxt/RatingComp.db3dedf5.js.br"
  },
  "/_nuxt/RatingComp.db3dedf5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47c-LJCQ6s0spEH3TSpSRSu8p4tpwNs\"",
    "mtime": "2023-07-16T05:15:19.048Z",
    "size": 1148,
    "path": "../public/_nuxt/RatingComp.db3dedf5.js.gz"
  },
  "/_nuxt/UserBasket.1a567712.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34b4-+BtrmeAbDvUU/cGbegzwRkQAHv4\"",
    "mtime": "2023-07-16T05:15:18.949Z",
    "size": 13492,
    "path": "../public/_nuxt/UserBasket.1a567712.css"
  },
  "/_nuxt/UserBasket.1a567712.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ef-J6dAPNPYNnAlLRuSkm/Man0A03g\"",
    "mtime": "2023-07-16T05:15:19.068Z",
    "size": 1775,
    "path": "../public/_nuxt/UserBasket.1a567712.css.br"
  },
  "/_nuxt/UserBasket.1a567712.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"895-QUtgvkiz6NhBRAwBE1rzc6nK/so\"",
    "mtime": "2023-07-16T05:15:19.053Z",
    "size": 2197,
    "path": "../public/_nuxt/UserBasket.1a567712.css.gz"
  },
  "/_nuxt/UserBasket.fb11584d.js": {
    "type": "application/javascript",
    "etag": "\"1410-7YNYb9gxhBey2efKKWxrtzisuPY\"",
    "mtime": "2023-07-16T05:15:18.949Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.fb11584d.js"
  },
  "/_nuxt/UserBasket.fb11584d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76a-czkvYHol17Rsqaa/zBgZ3u6R2p8\"",
    "mtime": "2023-07-16T05:15:19.075Z",
    "size": 1898,
    "path": "../public/_nuxt/UserBasket.fb11584d.js.br"
  },
  "/_nuxt/UserBasket.fb11584d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"892-qX6ku7PjjoSffc1EuLn10J9h9Dg\"",
    "mtime": "2023-07-16T05:15:19.069Z",
    "size": 2194,
    "path": "../public/_nuxt/UserBasket.fb11584d.js.gz"
  },
  "/_nuxt/_id_.7139cb4a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-F44+0pp8VrY6ziulXTkaBVxYEcw\"",
    "mtime": "2023-07-16T05:15:18.948Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.7139cb4a.css"
  },
  "/_nuxt/_id_.7139cb4a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-0HRwrKJkWDu/BjUa/35VgYsvZd0\"",
    "mtime": "2023-07-16T05:15:19.085Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.7139cb4a.css.br"
  },
  "/_nuxt/_id_.7139cb4a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56a-2dwn0QSrDAz0m6RWDNq+4lQC5Po\"",
    "mtime": "2023-07-16T05:15:19.076Z",
    "size": 1386,
    "path": "../public/_nuxt/_id_.7139cb4a.css.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-16T05:15:18.947Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.d9eefc0a.js": {
    "type": "application/javascript",
    "etag": "\"4be-uiEWlnpiheT26x09yFR4KNUDqHA\"",
    "mtime": "2023-07-16T05:15:18.947Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.d9eefc0a.js"
  },
  "/_nuxt/_id_.d9eefc0a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-1ruKKUuFJImA/lEsgBq3pIl1XWE\"",
    "mtime": "2023-07-16T05:15:19.088Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.d9eefc0a.js.br"
  },
  "/_nuxt/_id_.d9eefc0a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dd-WV5n25N4phHHPxAd+27TGzM93v4\"",
    "mtime": "2023-07-16T05:15:19.086Z",
    "size": 733,
    "path": "../public/_nuxt/_id_.d9eefc0a.js.gz"
  },
  "/_nuxt/_id_.fa22a4ba.js": {
    "type": "application/javascript",
    "etag": "\"1556-I7AEi4VHI1leDeHeXiQVAODa9ZA\"",
    "mtime": "2023-07-16T05:15:18.946Z",
    "size": 5462,
    "path": "../public/_nuxt/_id_.fa22a4ba.js"
  },
  "/_nuxt/_id_.fa22a4ba.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"7b6-lB3qiKh1IlmyQFi50mMGW0RGH+U\"",
    "mtime": "2023-07-16T05:15:19.095Z",
    "size": 1974,
    "path": "../public/_nuxt/_id_.fa22a4ba.js.br"
  },
  "/_nuxt/_id_.fa22a4ba.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"8b7-wP1WbfnYduNDDQOPepF+fKO26d0\"",
    "mtime": "2023-07-16T05:15:19.089Z",
    "size": 2231,
    "path": "../public/_nuxt/_id_.fa22a4ba.js.gz"
  },
  "/_nuxt/basket.6d3e52a5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"191d-UZlRXaFh4rIanpmM5XmLrATG7yI\"",
    "mtime": "2023-07-16T05:15:18.945Z",
    "size": 6429,
    "path": "../public/_nuxt/basket.6d3e52a5.css"
  },
  "/_nuxt/basket.6d3e52a5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"532-bouBRodaAoVjbeMimrzSDKKekpQ\"",
    "mtime": "2023-07-16T05:15:19.102Z",
    "size": 1330,
    "path": "../public/_nuxt/basket.6d3e52a5.css.br"
  },
  "/_nuxt/basket.6d3e52a5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"60f-puuRZkIFSveeqwacxnK4KJ2y/3I\"",
    "mtime": "2023-07-16T05:15:19.095Z",
    "size": 1551,
    "path": "../public/_nuxt/basket.6d3e52a5.css.gz"
  },
  "/_nuxt/basket.9972d5a1.js": {
    "type": "application/javascript",
    "etag": "\"270-59Tae6HHZQqsj/jAbtlbv/OwKSU\"",
    "mtime": "2023-07-16T05:15:18.944Z",
    "size": 624,
    "path": "../public/_nuxt/basket.9972d5a1.js"
  },
  "/_nuxt/catalog.90c0d839.js": {
    "type": "application/javascript",
    "etag": "\"1c86-34eNWn+0LYGXgLAi6Q0XkFG6KHY\"",
    "mtime": "2023-07-16T05:15:18.944Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.90c0d839.js"
  },
  "/_nuxt/catalog.90c0d839.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"98b-fbDhY8DiPOhaYgZzEa8btEDcNa8\"",
    "mtime": "2023-07-16T05:15:19.111Z",
    "size": 2443,
    "path": "../public/_nuxt/catalog.90c0d839.js.br"
  },
  "/_nuxt/catalog.90c0d839.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af5-1+2048sRrqcBJt8Kir07Ess4IXY\"",
    "mtime": "2023-07-16T05:15:19.103Z",
    "size": 2805,
    "path": "../public/_nuxt/catalog.90c0d839.js.gz"
  },
  "/_nuxt/catalog.b5faef7f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-Gh7Z2rVztkFI2Kec26bvfvmvuPM\"",
    "mtime": "2023-07-16T05:15:18.943Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.b5faef7f.css"
  },
  "/_nuxt/catalog.b5faef7f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"705-eLjozyB+8i9JBpHVYfSd6cqOTnc\"",
    "mtime": "2023-07-16T05:15:19.120Z",
    "size": 1797,
    "path": "../public/_nuxt/catalog.b5faef7f.css.br"
  },
  "/_nuxt/catalog.b5faef7f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"817-Yoob6OEQZgrCx/0ma3YhW1B5hwI\"",
    "mtime": "2023-07-16T05:15:19.112Z",
    "size": 2071,
    "path": "../public/_nuxt/catalog.b5faef7f.css.gz"
  },
  "/_nuxt/checkout.915ecf08.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a9-xI0B532hZ6lK39OQQnlZ5d0RhQA\"",
    "mtime": "2023-07-16T05:15:18.942Z",
    "size": 156073,
    "path": "../public/_nuxt/checkout.915ecf08.css"
  },
  "/_nuxt/checkout.915ecf08.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fd6-DOXpu12OaugbhX75kWXLPHfHMxY\"",
    "mtime": "2023-07-16T05:15:19.229Z",
    "size": 20438,
    "path": "../public/_nuxt/checkout.915ecf08.css.br"
  },
  "/_nuxt/checkout.915ecf08.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6040-tgz22lOWGjGCjGuvy+ZiDtv31i0\"",
    "mtime": "2023-07-16T05:15:19.123Z",
    "size": 24640,
    "path": "../public/_nuxt/checkout.915ecf08.css.gz"
  },
  "/_nuxt/checkout.962483ad.js": {
    "type": "application/javascript",
    "etag": "\"145f7-y+XQWU7SLYEFmP+8OUG8EgQn1Ok\"",
    "mtime": "2023-07-16T05:15:18.940Z",
    "size": 83447,
    "path": "../public/_nuxt/checkout.962483ad.js"
  },
  "/_nuxt/checkout.962483ad.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5047-aZlQol4dpbwf3be1ie+tYLNkpgw\"",
    "mtime": "2023-07-16T05:15:19.321Z",
    "size": 20551,
    "path": "../public/_nuxt/checkout.962483ad.js.br"
  },
  "/_nuxt/checkout.962483ad.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5d87-LSZ5c2+j16J8B/4nTvpg/HWA5dU\"",
    "mtime": "2023-07-16T05:15:19.232Z",
    "size": 23943,
    "path": "../public/_nuxt/checkout.962483ad.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-16T05:15:18.939Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.0e91259a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2242-e9msM+lcXfQPbsZU91xyMD91Exo\"",
    "mtime": "2023-07-16T05:15:18.938Z",
    "size": 8770,
    "path": "../public/_nuxt/entry.0e91259a.css"
  },
  "/_nuxt/entry.0e91259a.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"870-0WXX5XRCgVIh2rByNNsVUNg8JiE\"",
    "mtime": "2023-07-16T05:15:19.332Z",
    "size": 2160,
    "path": "../public/_nuxt/entry.0e91259a.css.br"
  },
  "/_nuxt/entry.0e91259a.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9d8-MZiNwZpZLNvuhY1gIGq6f9hVPAo\"",
    "mtime": "2023-07-16T05:15:19.323Z",
    "size": 2520,
    "path": "../public/_nuxt/entry.0e91259a.css.gz"
  },
  "/_nuxt/entry.89490881.js": {
    "type": "application/javascript",
    "etag": "\"33839-0esV+z5ZLEw1LbbZSSFE9mNFnho\"",
    "mtime": "2023-07-16T05:15:18.937Z",
    "size": 211001,
    "path": "../public/_nuxt/entry.89490881.js"
  },
  "/_nuxt/entry.89490881.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1149e-IEcgk+nItmC295dYjsB0+AJNiWw\"",
    "mtime": "2023-07-16T05:15:19.646Z",
    "size": 70814,
    "path": "../public/_nuxt/entry.89490881.js.br"
  },
  "/_nuxt/entry.89490881.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1365a-1BbggiRdaq13iN75jInYxvEFCDU\"",
    "mtime": "2023-07-16T05:15:19.340Z",
    "size": 79450,
    "path": "../public/_nuxt/entry.89490881.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-16T05:15:18.935Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-16T05:15:19.651Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-16T05:15:19.647Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.d8d7c4f4.js": {
    "type": "application/javascript",
    "etag": "\"8a4-1CMWKXSsRR/5N02amC4EtetnvSk\"",
    "mtime": "2023-07-16T05:15:18.934Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.d8d7c4f4.js"
  },
  "/_nuxt/error-404.d8d7c4f4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-CfiY6sMrItDrBVRtFZ6I4zBk1AU\"",
    "mtime": "2023-07-16T05:15:19.655Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.d8d7c4f4.js.br"
  },
  "/_nuxt/error-404.d8d7c4f4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-zaAdY/koXn8Ck+ljc+G7NLEaaEk\"",
    "mtime": "2023-07-16T05:15:19.652Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.d8d7c4f4.js.gz"
  },
  "/_nuxt/error-500.62ab9ddc.js": {
    "type": "application/javascript",
    "etag": "\"757-sg/uDMpFDrpz8Sm1f46q/cuG3cE\"",
    "mtime": "2023-07-16T05:15:18.933Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.62ab9ddc.js"
  },
  "/_nuxt/error-500.62ab9ddc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-FevPoH1migKkSNoIXpxXHlWoZEw\"",
    "mtime": "2023-07-16T05:15:19.659Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.62ab9ddc.js.br"
  },
  "/_nuxt/error-500.62ab9ddc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-DWMA7QcVR/QsCYCRlR8WezajwPY\"",
    "mtime": "2023-07-16T05:15:19.656Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.62ab9ddc.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-16T05:15:18.933Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-16T05:15:19.662Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-16T05:15:19.659Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.ee0644d9.js": {
    "type": "application/javascript",
    "etag": "\"45e-vKW7t3F+lZh46mXL2GFBJEzDfaU\"",
    "mtime": "2023-07-16T05:15:18.932Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.ee0644d9.js"
  },
  "/_nuxt/error-component.ee0644d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-2IXg8+RvJKVsK/b4mEbvzhYRZL8\"",
    "mtime": "2023-07-16T05:15:19.665Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.ee0644d9.js.br"
  },
  "/_nuxt/error-component.ee0644d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-rJfXkl9l/d2AdiKQmE7OSbp0Diw\"",
    "mtime": "2023-07-16T05:15:19.663Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.ee0644d9.js.gz"
  },
  "/_nuxt/favorite.60dfa300.js": {
    "type": "application/javascript",
    "etag": "\"a30-QiuVoLCGkZl8yQNoKfXGtzs91aQ\"",
    "mtime": "2023-07-16T05:15:18.931Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.60dfa300.js"
  },
  "/_nuxt/favorite.60dfa300.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43b-2auZb3LHZI1GzScJVMYK6ozL+fA\"",
    "mtime": "2023-07-16T05:15:19.669Z",
    "size": 1083,
    "path": "../public/_nuxt/favorite.60dfa300.js.br"
  },
  "/_nuxt/favorite.60dfa300.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f5-14a++ObBFhiQiMtZaSHw6/93kps\"",
    "mtime": "2023-07-16T05:15:19.665Z",
    "size": 1269,
    "path": "../public/_nuxt/favorite.60dfa300.js.gz"
  },
  "/_nuxt/favorite.9e539a5c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19e1-O90FmTqmPbxCLOheAYmy8O7xamQ\"",
    "mtime": "2023-07-16T05:15:18.930Z",
    "size": 6625,
    "path": "../public/_nuxt/favorite.9e539a5c.css"
  },
  "/_nuxt/favorite.9e539a5c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"559-zHm1EAOwy7qnVkYv1p/5lpnBGDI\"",
    "mtime": "2023-07-16T05:15:19.677Z",
    "size": 1369,
    "path": "../public/_nuxt/favorite.9e539a5c.css.br"
  },
  "/_nuxt/favorite.9e539a5c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"649-ZNhQwCrjnSovED5kD/DAyVFbK1w\"",
    "mtime": "2023-07-16T05:15:19.670Z",
    "size": 1609,
    "path": "../public/_nuxt/favorite.9e539a5c.css.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-16T05:15:18.929Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.2cdb1eb0.js": {
    "type": "application/javascript",
    "etag": "\"5a0-ZcTkVv1M/gPKhJdeNd1zPTbMz70\"",
    "mtime": "2023-07-16T05:15:18.929Z",
    "size": 1440,
    "path": "../public/_nuxt/index.2cdb1eb0.js"
  },
  "/_nuxt/index.2cdb1eb0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2cb-rKbZmNbwRatsFCN9jGAP/fOADWQ\"",
    "mtime": "2023-07-16T05:15:19.680Z",
    "size": 715,
    "path": "../public/_nuxt/index.2cdb1eb0.js.br"
  },
  "/_nuxt/index.2cdb1eb0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"349-wQRFrlcQiVu2kSifUwbFR1IYJ7g\"",
    "mtime": "2023-07-16T05:15:19.678Z",
    "size": 841,
    "path": "../public/_nuxt/index.2cdb1eb0.js.gz"
  },
  "/_nuxt/index.a2cc8f8e.js": {
    "type": "application/javascript",
    "etag": "\"16a3e-dpDxgMwmCK2okXnWHrRU+culJac\"",
    "mtime": "2023-07-16T05:15:18.928Z",
    "size": 92734,
    "path": "../public/_nuxt/index.a2cc8f8e.js"
  },
  "/_nuxt/index.a2cc8f8e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62d3-mz5FNusGQgn9MWdTg4YrwVWz1rQ\"",
    "mtime": "2023-07-16T05:15:19.785Z",
    "size": 25299,
    "path": "../public/_nuxt/index.a2cc8f8e.js.br"
  },
  "/_nuxt/index.a2cc8f8e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f65-TgvgXdBYt0ZMV5w7e3RP4/dntnI\"",
    "mtime": "2023-07-16T05:15:19.683Z",
    "size": 28517,
    "path": "../public/_nuxt/index.a2cc8f8e.js.gz"
  },
  "/_nuxt/index.a5700383.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"58de-mWR+4qX5m3YRzr3r8SAg1RouNUU\"",
    "mtime": "2023-07-16T05:15:18.927Z",
    "size": 22750,
    "path": "../public/_nuxt/index.a5700383.css"
  },
  "/_nuxt/index.a5700383.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12aa-1G9TesnP2eoKbnljOvMstL1gU54\"",
    "mtime": "2023-07-16T05:15:19.812Z",
    "size": 4778,
    "path": "../public/_nuxt/index.a5700383.css.br"
  },
  "/_nuxt/index.a5700383.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1618-ZJd7Ff6hYtMq3DVkxD7RjdngMFs\"",
    "mtime": "2023-07-16T05:15:19.786Z",
    "size": 5656,
    "path": "../public/_nuxt/index.a5700383.css.gz"
  },
  "/_nuxt/index.d203a147.js": {
    "type": "application/javascript",
    "etag": "\"3abf-gv1yW4mXKbR4FEsmCXRTk+6Pffw\"",
    "mtime": "2023-07-16T05:15:18.926Z",
    "size": 15039,
    "path": "../public/_nuxt/index.d203a147.js"
  },
  "/_nuxt/index.d203a147.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f3-kq5VaCx/ZetwbOcLpzbY4QaUEC4\"",
    "mtime": "2023-07-16T05:15:19.829Z",
    "size": 4851,
    "path": "../public/_nuxt/index.d203a147.js.br"
  },
  "/_nuxt/index.d203a147.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f3-/TUuzpkbvekJ/BexGE4FXGR/C+0\"",
    "mtime": "2023-07-16T05:15:19.813Z",
    "size": 5363,
    "path": "../public/_nuxt/index.d203a147.js.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-16T05:15:18.925Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-16T05:15:19.833Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-16T05:15:19.830Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/isAuth.b229cbcf.js": {
    "type": "application/javascript",
    "etag": "\"213-lSfqehAFrqZif/67mF/3iN9ikxs\"",
    "mtime": "2023-07-16T05:15:18.924Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.b229cbcf.js"
  },
  "/_nuxt/login.043c5a90.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-ziowIh47Uh+H019MZZt0w/Aakvw\"",
    "mtime": "2023-07-16T05:15:18.923Z",
    "size": 2274,
    "path": "../public/_nuxt/login.043c5a90.css"
  },
  "/_nuxt/login.043c5a90.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"26b-zKujsAA+jC/TTajynLgx6VSqJCQ\"",
    "mtime": "2023-07-16T05:15:19.837Z",
    "size": 619,
    "path": "../public/_nuxt/login.043c5a90.css.br"
  },
  "/_nuxt/login.043c5a90.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"324-75U5MluqaBw60iQDLH7ROQjElZI\"",
    "mtime": "2023-07-16T05:15:19.834Z",
    "size": 804,
    "path": "../public/_nuxt/login.043c5a90.css.gz"
  },
  "/_nuxt/login.8a715436.js": {
    "type": "application/javascript",
    "etag": "\"830-3sHUL5Di5NePllDwglSZKLCIZX8\"",
    "mtime": "2023-07-16T05:15:18.922Z",
    "size": 2096,
    "path": "../public/_nuxt/login.8a715436.js"
  },
  "/_nuxt/login.8a715436.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ed-JqgNqdu6pot/vZiJ3s8DNUANEG4\"",
    "mtime": "2023-07-16T05:15:19.841Z",
    "size": 1005,
    "path": "../public/_nuxt/login.8a715436.js.br"
  },
  "/_nuxt/login.8a715436.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4aa-8973g9/FbzWOa+/t38NhRiQ8MfI\"",
    "mtime": "2023-07-16T05:15:19.838Z",
    "size": 1194,
    "path": "../public/_nuxt/login.8a715436.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-16T05:15:18.918Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.b3fca952.js": {
    "type": "application/javascript",
    "etag": "\"4af-HnVUgBMhv2p74yiPZLB/+hh5I/Q\"",
    "mtime": "2023-07-16T05:15:18.916Z",
    "size": 1199,
    "path": "../public/_nuxt/news.b3fca952.js"
  },
  "/_nuxt/news.b3fca952.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a7-RvuykWUTwlzaor7fogj+zFBor3s\"",
    "mtime": "2023-07-16T05:15:19.844Z",
    "size": 423,
    "path": "../public/_nuxt/news.b3fca952.js.br"
  },
  "/_nuxt/news.b3fca952.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"218-UsxrVunr7ZhlnjGDlB9dlUQXMs0\"",
    "mtime": "2023-07-16T05:15:19.842Z",
    "size": 536,
    "path": "../public/_nuxt/news.b3fca952.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-16T05:15:18.915Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.459a7bde.js": {
    "type": "application/javascript",
    "etag": "\"10a-EfewYDHst9EbFNPZkVXYiYJ/poU\"",
    "mtime": "2023-07-16T05:15:18.914Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.459a7bde.js"
  },
  "/_nuxt/orders.4dfbb4f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"238d-q9C4bvHzAl2Jll4gIdwYd3IW7d8\"",
    "mtime": "2023-07-16T05:15:18.913Z",
    "size": 9101,
    "path": "../public/_nuxt/orders.4dfbb4f8.css"
  },
  "/_nuxt/orders.4dfbb4f8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"775-bjviy8gaFzbRHTe10jcrMzp7k20\"",
    "mtime": "2023-07-16T05:15:19.854Z",
    "size": 1909,
    "path": "../public/_nuxt/orders.4dfbb4f8.css.br"
  },
  "/_nuxt/orders.4dfbb4f8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ab-eyXRk3zEg1vAjK5Q7FDHsjhtjZM\"",
    "mtime": "2023-07-16T05:15:19.845Z",
    "size": 2219,
    "path": "../public/_nuxt/orders.4dfbb4f8.css.gz"
  },
  "/_nuxt/orders.54de3d30.js": {
    "type": "application/javascript",
    "etag": "\"18c4-S3MpnzSeZoznl5ZN56wZmxcT394\"",
    "mtime": "2023-07-16T05:15:18.912Z",
    "size": 6340,
    "path": "../public/_nuxt/orders.54de3d30.js"
  },
  "/_nuxt/orders.54de3d30.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"875-/LiragdtPIwqwHERu5jLD6+yPs8\"",
    "mtime": "2023-07-16T05:15:19.862Z",
    "size": 2165,
    "path": "../public/_nuxt/orders.54de3d30.js.br"
  },
  "/_nuxt/orders.54de3d30.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9f4-doOApCdziGLSgZN9vxF0mHFi0Pg\"",
    "mtime": "2023-07-16T05:15:19.855Z",
    "size": 2548,
    "path": "../public/_nuxt/orders.54de3d30.js.gz"
  },
  "/_nuxt/profile.0a1820da.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4af6-hJMjZKA7iMF6oSDjoa/MdZOXh8k\"",
    "mtime": "2023-07-16T05:15:18.911Z",
    "size": 19190,
    "path": "../public/_nuxt/profile.0a1820da.css"
  },
  "/_nuxt/profile.0a1820da.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6fd-L4zliQy+yH0ZI9ylhL7ohv73jOo\"",
    "mtime": "2023-07-16T05:15:19.888Z",
    "size": 1789,
    "path": "../public/_nuxt/profile.0a1820da.css.br"
  },
  "/_nuxt/profile.0a1820da.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"99e-PnaID5U2StM7y2B/ZOy9fskSacY\"",
    "mtime": "2023-07-16T05:15:19.863Z",
    "size": 2462,
    "path": "../public/_nuxt/profile.0a1820da.css.gz"
  },
  "/_nuxt/profile.13339b23.js": {
    "type": "application/javascript",
    "etag": "\"1241-1lZyy6Y20/BZSDGYllaB65s+jHY\"",
    "mtime": "2023-07-16T05:15:18.910Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.13339b23.js"
  },
  "/_nuxt/profile.13339b23.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"706-tTTJ9VHzEyAOFC1x8/oA2sk+ztQ\"",
    "mtime": "2023-07-16T05:15:19.894Z",
    "size": 1798,
    "path": "../public/_nuxt/profile.13339b23.js.br"
  },
  "/_nuxt/profile.13339b23.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83f-duxh3BPyK8qewQDnfR8N6tWIw4c\"",
    "mtime": "2023-07-16T05:15:19.888Z",
    "size": 2111,
    "path": "../public/_nuxt/profile.13339b23.js.gz"
  },
  "/_nuxt/register.58ccf552.js": {
    "type": "application/javascript",
    "etag": "\"1128-d1okwXPp6KhcUWxESjMBUk4ri6s\"",
    "mtime": "2023-07-16T05:15:18.909Z",
    "size": 4392,
    "path": "../public/_nuxt/register.58ccf552.js"
  },
  "/_nuxt/register.58ccf552.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56c-EBrCeGC22wA0kRhpicGAahsPmng\"",
    "mtime": "2023-07-16T05:15:19.900Z",
    "size": 1388,
    "path": "../public/_nuxt/register.58ccf552.js.br"
  },
  "/_nuxt/register.58ccf552.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"69c-ECVRF8QsFIS+9R8ypCvKN+7VhoM\"",
    "mtime": "2023-07-16T05:15:19.895Z",
    "size": 1692,
    "path": "../public/_nuxt/register.58ccf552.js.gz"
  },
  "/_nuxt/register.710c22d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e2-/sFUU1VmP/10yIbpC6UvJC/YT2w\"",
    "mtime": "2023-07-16T05:15:18.908Z",
    "size": 2274,
    "path": "../public/_nuxt/register.710c22d3.css"
  },
  "/_nuxt/register.710c22d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"26d-Mxlg7W8Ys3mUJYREvT7vHX5nulg\"",
    "mtime": "2023-07-16T05:15:19.904Z",
    "size": 621,
    "path": "../public/_nuxt/register.710c22d3.css.br"
  },
  "/_nuxt/register.710c22d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"325-RiZXFZcV5KRM6mrNeWsp5y2Ol7U\"",
    "mtime": "2023-07-16T05:15:19.901Z",
    "size": 805,
    "path": "../public/_nuxt/register.710c22d3.css.gz"
  },
  "/_nuxt/removeFavorite.75177b76.js": {
    "type": "application/javascript",
    "etag": "\"3d2-KdUUdhJTlOdW1TYscGpaZ8wVGJw\"",
    "mtime": "2023-07-16T05:15:18.907Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.75177b76.js"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-16T05:15:18.903Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-16T05:15:18.896Z",
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
