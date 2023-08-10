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
    "etag": "\"4183e-Fbgm00tFDiXipsKAHOca8SQ/DYw\"",
    "mtime": "2023-08-10T15:50:42.006Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-08-10T15:50:42.004Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-08-10T15:50:42.003Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.b01fc042.js": {
    "type": "application/javascript",
    "etag": "\"9a2-By4z4nzrwmL/K6ddrNACsQkjRJ8\"",
    "mtime": "2023-08-10T15:50:42.002Z",
    "size": 2466,
    "path": "../public/_nuxt/BasketInfo.b01fc042.js"
  },
  "/_nuxt/BasketInfo.b01fc042.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ee-/yD+sMiLMiqY0+bjCSVnpurmUW8\"",
    "mtime": "2023-08-10T15:50:42.014Z",
    "size": 1006,
    "path": "../public/_nuxt/BasketInfo.b01fc042.js.br"
  },
  "/_nuxt/BasketInfo.b01fc042.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4bb-6Q5ZCrrZL0OizOuGMW/TZarpPJ4\"",
    "mtime": "2023-08-10T15:50:42.010Z",
    "size": 1211,
    "path": "../public/_nuxt/BasketInfo.b01fc042.js.gz"
  },
  "/_nuxt/BasketInfo.e95b7f46.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-jfBfBQ2u5ce0xsn/oGNRjL6tluc\"",
    "mtime": "2023-08-10T15:50:42.002Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f3-wAG53DNQiyBoZR3015TL3Uw1bDs\"",
    "mtime": "2023-08-10T15:50:42.046Z",
    "size": 1779,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.br"
  },
  "/_nuxt/BasketInfo.e95b7f46.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a9-B8WUZa556tcF/GlkmjLcENTIw+g\"",
    "mtime": "2023-08-10T15:50:42.015Z",
    "size": 2473,
    "path": "../public/_nuxt/BasketInfo.e95b7f46.css.gz"
  },
  "/_nuxt/CatalogProduct.56d78c92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29be-tJyARoayFZP92u4mdmhVu3/0r5w\"",
    "mtime": "2023-08-10T15:50:42.001Z",
    "size": 10686,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css"
  },
  "/_nuxt/CatalogProduct.56d78c92.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"75d-4luw27pYrIVri/qlxGJsq2VcxFU\"",
    "mtime": "2023-08-10T15:50:42.059Z",
    "size": 1885,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css.br"
  },
  "/_nuxt/CatalogProduct.56d78c92.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8a2-u21lnmRWwSyQBi5GcMwU0BS3pHc\"",
    "mtime": "2023-08-10T15:50:42.047Z",
    "size": 2210,
    "path": "../public/_nuxt/CatalogProduct.56d78c92.css.gz"
  },
  "/_nuxt/CatalogProduct.8a84ffd6.js": {
    "type": "application/javascript",
    "etag": "\"10b0-Y6+lqUV4GkQ8J3LggMhiS5PnZck\"",
    "mtime": "2023-08-10T15:50:42.000Z",
    "size": 4272,
    "path": "../public/_nuxt/CatalogProduct.8a84ffd6.js"
  },
  "/_nuxt/CatalogProduct.8a84ffd6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"628-qk37pU4QffbicbOJu2NudO9QVg0\"",
    "mtime": "2023-08-10T15:50:42.067Z",
    "size": 1576,
    "path": "../public/_nuxt/CatalogProduct.8a84ffd6.js.br"
  },
  "/_nuxt/CatalogProduct.8a84ffd6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"706-Xvkq4rBuZmELZqexNOC/3NhZVKE\"",
    "mtime": "2023-08-10T15:50:42.060Z",
    "size": 1798,
    "path": "../public/_nuxt/CatalogProduct.8a84ffd6.js.gz"
  },
  "/_nuxt/FavoriteComp.47b551e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b6-dY2JGwtMmifjiaay8WqeQt8Kfzo\"",
    "mtime": "2023-08-10T15:50:42.000Z",
    "size": 4278,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css"
  },
  "/_nuxt/FavoriteComp.47b551e6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c6-SBvzG9Axbj/LRMYSI/ra11+o0fI\"",
    "mtime": "2023-08-10T15:50:42.073Z",
    "size": 966,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css.br"
  },
  "/_nuxt/FavoriteComp.47b551e6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"490-kMa+3Kk3hjSDO6HYIagg8va7kRQ\"",
    "mtime": "2023-08-10T15:50:42.068Z",
    "size": 1168,
    "path": "../public/_nuxt/FavoriteComp.47b551e6.css.gz"
  },
  "/_nuxt/FavoriteComp.629b43e9.js": {
    "type": "application/javascript",
    "etag": "\"b70-g4JTjmtTmvngnov8zzQA/yILDbQ\"",
    "mtime": "2023-08-10T15:50:41.999Z",
    "size": 2928,
    "path": "../public/_nuxt/FavoriteComp.629b43e9.js"
  },
  "/_nuxt/FavoriteComp.629b43e9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"380-l+GHirAa28OkqS1s/gE2s2Mh+Ug\"",
    "mtime": "2023-08-10T15:50:42.080Z",
    "size": 896,
    "path": "../public/_nuxt/FavoriteComp.629b43e9.js.br"
  },
  "/_nuxt/FavoriteComp.629b43e9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"40c-2w8lUGYd065yHvqMYpl4CiuMHFM\"",
    "mtime": "2023-08-10T15:50:42.074Z",
    "size": 1036,
    "path": "../public/_nuxt/FavoriteComp.629b43e9.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2023-08-10T15:50:41.999Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2023-08-10T15:50:42.097Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-Bxn0kHbG9mSKZf8kANPJH+YyyHM\"",
    "mtime": "2023-08-10T15:50:42.081Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.77e1a6df.js": {
    "type": "application/javascript",
    "etag": "\"783-PSwUNHKSrE2nkkHHfX+rYUo1LV4\"",
    "mtime": "2023-08-10T15:50:41.998Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.77e1a6df.js"
  },
  "/_nuxt/FavoriteComp.77e1a6df.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28f-RlnnaICet0NZtCP62QXJS/LS/ss\"",
    "mtime": "2023-08-10T15:50:42.101Z",
    "size": 655,
    "path": "../public/_nuxt/FavoriteComp.77e1a6df.js.br"
  },
  "/_nuxt/FavoriteComp.77e1a6df.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2f9-uCx5cCl75DpLlN5J4Ehx0XaDSrs\"",
    "mtime": "2023-08-10T15:50:42.098Z",
    "size": 761,
    "path": "../public/_nuxt/FavoriteComp.77e1a6df.js.gz"
  },
  "/_nuxt/ImageForm.462f03e6.js": {
    "type": "application/javascript",
    "etag": "\"1ac-TDPtD2L7T7svjLRWlT67V0eYEog\"",
    "mtime": "2023-08-10T15:50:41.998Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.462f03e6.js"
  },
  "/_nuxt/LoadingComp.b89ac362.js": {
    "type": "application/javascript",
    "etag": "\"1fe-riqXwXyuAm2C/pXvYPST8nTXNPo\"",
    "mtime": "2023-08-10T15:50:41.997Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.b89ac362.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-08-10T15:50:41.997Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-ODcVL6+bNuVq/U+8HtKLG7h3GqE\"",
    "mtime": "2023-08-10T15:50:41.996Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1c1-qu2qOd86RVqQFRLOdM1gE0BoP5A\"",
    "mtime": "2023-08-10T15:50:42.106Z",
    "size": 449,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.br"
  },
  "/_nuxt/OrderProductList.3f4db4df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-8j6SeuDTaWQbISImz1a9XNz2D+4\"",
    "mtime": "2023-08-10T15:50:42.103Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.3f4db4df.css.gz"
  },
  "/_nuxt/OrderProductList.4c08e675.js": {
    "type": "application/javascript",
    "etag": "\"453-VSuBry3xuRHXTKhTZbAjE9uRLSc\"",
    "mtime": "2023-08-10T15:50:41.995Z",
    "size": 1107,
    "path": "../public/_nuxt/OrderProductList.4c08e675.js"
  },
  "/_nuxt/OrderProductList.4c08e675.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20a-k89RXzMeR1QYFM0fMcOJgWL1ZaE\"",
    "mtime": "2023-08-10T15:50:42.109Z",
    "size": 522,
    "path": "../public/_nuxt/OrderProductList.4c08e675.js.br"
  },
  "/_nuxt/OrderProductList.4c08e675.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"242-VfucXogN/R1UzLkTto9z77SunL8\"",
    "mtime": "2023-08-10T15:50:42.106Z",
    "size": 578,
    "path": "../public/_nuxt/OrderProductList.4c08e675.js.gz"
  },
  "/_nuxt/UserBasket.854b7ba8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-tEGTqCvuYl5h8GqKoTkDj6M8JnU\"",
    "mtime": "2023-08-10T15:50:41.995Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css"
  },
  "/_nuxt/UserBasket.854b7ba8.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-MTrYg4/3qluzuw+ah0PkyMz7w0E\"",
    "mtime": "2023-08-10T15:50:42.126Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.br"
  },
  "/_nuxt/UserBasket.854b7ba8.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"866-oXWbMLEVAB4i7cCM2LCBX6EaYzs\"",
    "mtime": "2023-08-10T15:50:42.109Z",
    "size": 2150,
    "path": "../public/_nuxt/UserBasket.854b7ba8.css.gz"
  },
  "/_nuxt/UserBasket.bf67220a.js": {
    "type": "application/javascript",
    "etag": "\"13fc-g5bgoq7G0l+29JEj2Y6FX7AgEog\"",
    "mtime": "2023-08-10T15:50:41.994Z",
    "size": 5116,
    "path": "../public/_nuxt/UserBasket.bf67220a.js"
  },
  "/_nuxt/UserBasket.bf67220a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"780-MAlbTjTrGvf5O+OnoXjKDDBbk78\"",
    "mtime": "2023-08-10T15:50:42.135Z",
    "size": 1920,
    "path": "../public/_nuxt/UserBasket.bf67220a.js.br"
  },
  "/_nuxt/UserBasket.bf67220a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"894-QmXiGx7R9Jh5Xnjovzo4cNySFRM\"",
    "mtime": "2023-08-10T15:50:42.127Z",
    "size": 2196,
    "path": "../public/_nuxt/UserBasket.bf67220a.js.gz"
  },
  "/_nuxt/_id_.14bf7aee.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-3EY9uDdeNVRGJz1pOfnX6k2FhEU\"",
    "mtime": "2023-08-10T15:50:41.994Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.14bf7aee.css"
  },
  "/_nuxt/_id_.14bf7aee.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-hHGiuDAaMFwEDzPucnRwBg/pSr8\"",
    "mtime": "2023-08-10T15:50:42.151Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.14bf7aee.css.br"
  },
  "/_nuxt/_id_.14bf7aee.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-2UFxED7H1NlKRUbIiMLI19mo4gQ\"",
    "mtime": "2023-08-10T15:50:42.136Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.14bf7aee.css.gz"
  },
  "/_nuxt/_id_.54613cd8.js": {
    "type": "application/javascript",
    "etag": "\"4be-vU981Y/bPKz4hhc6ExxAe28nzKQ\"",
    "mtime": "2023-08-10T15:50:41.993Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.54613cd8.js"
  },
  "/_nuxt/_id_.54613cd8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-3F5oecWWui3cRTEdpG5UMkMFsAU\"",
    "mtime": "2023-08-10T15:50:42.155Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.54613cd8.js.br"
  },
  "/_nuxt/_id_.54613cd8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2dd-p8VWe00R+pWgEUp4rFH490XceBA\"",
    "mtime": "2023-08-10T15:50:42.152Z",
    "size": 733,
    "path": "../public/_nuxt/_id_.54613cd8.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-08-10T15:50:41.993Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.f118dce1.js": {
    "type": "application/javascript",
    "etag": "\"1266-qfWiX3zHahNMCUS5t9j29Xp2eOc\"",
    "mtime": "2023-08-10T15:50:41.992Z",
    "size": 4710,
    "path": "../public/_nuxt/_id_.f118dce1.js"
  },
  "/_nuxt/_id_.f118dce1.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"72f-QvBf6eMKXYS0Z22vZ9e4+BU4qhY\"",
    "mtime": "2023-08-10T15:50:42.177Z",
    "size": 1839,
    "path": "../public/_nuxt/_id_.f118dce1.js.br"
  },
  "/_nuxt/_id_.f118dce1.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"817-bPSXxnxKVBtwjeyOeeVGDzah78c\"",
    "mtime": "2023-08-10T15:50:42.170Z",
    "size": 2071,
    "path": "../public/_nuxt/_id_.f118dce1.js.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-08-10T15:50:41.992Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-08-10T15:50:42.184Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-08-10T15:50:42.177Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.7452b74d.js": {
    "type": "application/javascript",
    "etag": "\"26e-ZI21UBL0GbTzPzEau+CkT8Jz0sQ\"",
    "mtime": "2023-08-10T15:50:41.991Z",
    "size": 622,
    "path": "../public/_nuxt/basket.7452b74d.js"
  },
  "/_nuxt/catalog.989a718a.js": {
    "type": "application/javascript",
    "etag": "\"1b35-0M+7HkfsDAXgXl9e2QaBddkfeCI\"",
    "mtime": "2023-08-10T15:50:41.991Z",
    "size": 6965,
    "path": "../public/_nuxt/catalog.989a718a.js"
  },
  "/_nuxt/catalog.989a718a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"909-tebNrMt1PigT/uzFvqUu0h1TuJg\"",
    "mtime": "2023-08-10T15:50:42.194Z",
    "size": 2313,
    "path": "../public/_nuxt/catalog.989a718a.js.br"
  },
  "/_nuxt/catalog.989a718a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a69-lE3h5GNcmp3IZ2xn+A+YFuFOVOg\"",
    "mtime": "2023-08-10T15:50:42.186Z",
    "size": 2665,
    "path": "../public/_nuxt/catalog.989a718a.js.gz"
  },
  "/_nuxt/catalog.a7b3c0cd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1df0-uEWw5XqtLjXrTztVE1l1k/Nb9Mg\"",
    "mtime": "2023-08-10T15:50:41.990Z",
    "size": 7664,
    "path": "../public/_nuxt/catalog.a7b3c0cd.css"
  },
  "/_nuxt/catalog.a7b3c0cd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c7-1lFU8NEmdgSXD9Yv0l0JiPW8jLM\"",
    "mtime": "2023-08-10T15:50:42.205Z",
    "size": 1735,
    "path": "../public/_nuxt/catalog.a7b3c0cd.css.br"
  },
  "/_nuxt/catalog.a7b3c0cd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7da-P9NFfc6zm2YqhBDeeYoPCCURwgM\"",
    "mtime": "2023-08-10T15:50:42.195Z",
    "size": 2010,
    "path": "../public/_nuxt/catalog.a7b3c0cd.css.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-10T15:50:41.989Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.9d37444d.js": {
    "type": "application/javascript",
    "etag": "\"14f00-6mIrYsNA7Y9eURz5xTzItRpIFWE\"",
    "mtime": "2023-08-10T15:50:41.989Z",
    "size": 85760,
    "path": "../public/_nuxt/checkout.9d37444d.js"
  },
  "/_nuxt/checkout.9d37444d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5267-UTFzoWAqtAS6nSNYGFqSUvIr7gw\"",
    "mtime": "2023-08-10T15:50:42.299Z",
    "size": 21095,
    "path": "../public/_nuxt/checkout.9d37444d.js.br"
  },
  "/_nuxt/checkout.9d37444d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5fb2-7MPvtcpoBAKAwDfIdvXxHzJiPmw\"",
    "mtime": "2023-08-10T15:50:42.208Z",
    "size": 24498,
    "path": "../public/_nuxt/checkout.9d37444d.js.gz"
  },
  "/_nuxt/checkout.f591dc97.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-mQKRVEyNg8H+hhHRlfm3oRvavsY\"",
    "mtime": "2023-08-10T15:50:41.988Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.f591dc97.css"
  },
  "/_nuxt/checkout.f591dc97.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fad-ikaSXO8Qabm0fX5INKtLK4/hH8M\"",
    "mtime": "2023-08-10T15:50:42.408Z",
    "size": 20397,
    "path": "../public/_nuxt/checkout.f591dc97.css.br"
  },
  "/_nuxt/checkout.f591dc97.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6018-KNCcEFQmgCq7Q3bqQ5YCUEt7a74\"",
    "mtime": "2023-08-10T15:50:42.302Z",
    "size": 24600,
    "path": "../public/_nuxt/checkout.f591dc97.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-10T15:50:41.987Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.118cb178.js": {
    "type": "application/javascript",
    "etag": "\"345d3-cV11wMTr9/aTlfQr283xEcV4FxA\"",
    "mtime": "2023-08-10T15:50:41.986Z",
    "size": 214483,
    "path": "../public/_nuxt/entry.118cb178.js"
  },
  "/_nuxt/entry.118cb178.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"117f5-PmfOjdDiJJop3ls1po2BKwKyKHo\"",
    "mtime": "2023-08-10T15:50:42.752Z",
    "size": 71669,
    "path": "../public/_nuxt/entry.118cb178.js.br"
  },
  "/_nuxt/entry.118cb178.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"13a63-m36sK+s41wkMkk04PHSPk0bHlWo\"",
    "mtime": "2023-08-10T15:50:42.417Z",
    "size": 80483,
    "path": "../public/_nuxt/entry.118cb178.js.gz"
  },
  "/_nuxt/entry.70fc591f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"253c-Om+NVeudnoT2INCYQoLONzXk7hs\"",
    "mtime": "2023-08-10T15:50:41.984Z",
    "size": 9532,
    "path": "../public/_nuxt/entry.70fc591f.css"
  },
  "/_nuxt/entry.70fc591f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"931-Frn2LFdRvngr6ou3M83Yuca4k+Q\"",
    "mtime": "2023-08-10T15:50:42.763Z",
    "size": 2353,
    "path": "../public/_nuxt/entry.70fc591f.css.br"
  },
  "/_nuxt/entry.70fc591f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a9f-4bwMvNCk5VFomFRinZwwPaFF/vM\"",
    "mtime": "2023-08-10T15:50:42.753Z",
    "size": 2719,
    "path": "../public/_nuxt/entry.70fc591f.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-08-10T15:50:41.984Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-08-10T15:50:42.768Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-08-10T15:50:42.764Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.45f7ac35.js": {
    "type": "application/javascript",
    "etag": "\"8a4-QbHmG1GEcjF10Vc8aDGhfiDVQnw\"",
    "mtime": "2023-08-10T15:50:41.983Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.45f7ac35.js"
  },
  "/_nuxt/error-404.45f7ac35.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ce-Onv334Hn9UUHR9qmajBDe2m0dPE\"",
    "mtime": "2023-08-10T15:50:42.772Z",
    "size": 974,
    "path": "../public/_nuxt/error-404.45f7ac35.js.br"
  },
  "/_nuxt/error-404.45f7ac35.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-W8RqHMiTeOcNPj3vvsVImonxcvY\"",
    "mtime": "2023-08-10T15:50:42.769Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.45f7ac35.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-08-10T15:50:41.983Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-08-10T15:50:42.775Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-08-10T15:50:42.772Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.d46dc0c0.js": {
    "type": "application/javascript",
    "etag": "\"757-ptp8YtnLzyYgOlWBcoXRqgm9CT4\"",
    "mtime": "2023-08-10T15:50:41.982Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.d46dc0c0.js"
  },
  "/_nuxt/error-500.d46dc0c0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-4SjTQoq/kkrR7oRnfVguQSYIXA0\"",
    "mtime": "2023-08-10T15:50:42.778Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.d46dc0c0.js.br"
  },
  "/_nuxt/error-500.d46dc0c0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-mF3+LhrabMpPcWkX/G0I9dc1M7E\"",
    "mtime": "2023-08-10T15:50:42.776Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.d46dc0c0.js.gz"
  },
  "/_nuxt/error-component.8663cdfd.js": {
    "type": "application/javascript",
    "etag": "\"45e-dTgYGge8bLm1gjQxlXOzbS7jChU\"",
    "mtime": "2023-08-10T15:50:41.981Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.8663cdfd.js"
  },
  "/_nuxt/error-component.8663cdfd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"207-cWMASKbzdmZf6OLY/6cX4MWaqfQ\"",
    "mtime": "2023-08-10T15:50:42.781Z",
    "size": 519,
    "path": "../public/_nuxt/error-component.8663cdfd.js.br"
  },
  "/_nuxt/error-component.8663cdfd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-k6oiFJt9VPywbLTmPNcNn+mxSFE\"",
    "mtime": "2023-08-10T15:50:42.779Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.8663cdfd.js.gz"
  },
  "/_nuxt/favorite.2c5373bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-VXoLjaBuljdcCdAHSzzREVahc/o\"",
    "mtime": "2023-08-10T15:50:41.980Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2c5373bb.css"
  },
  "/_nuxt/favorite.2c5373bb.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"528-DXTvVqfYoh3NZ5B57zEH8/xXhi0\"",
    "mtime": "2023-08-10T15:50:42.788Z",
    "size": 1320,
    "path": "../public/_nuxt/favorite.2c5373bb.css.br"
  },
  "/_nuxt/favorite.2c5373bb.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-ePdIAR2clkhwocTMOW3sWozzXHI\"",
    "mtime": "2023-08-10T15:50:42.782Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2c5373bb.css.gz"
  },
  "/_nuxt/favorite.658460fe.js": {
    "type": "application/javascript",
    "etag": "\"a10-DZSmtl7m+WAqbTCzJAYm5abM84s\"",
    "mtime": "2023-08-10T15:50:41.979Z",
    "size": 2576,
    "path": "../public/_nuxt/favorite.658460fe.js"
  },
  "/_nuxt/favorite.658460fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"438-CPg7xD/9n/ig+2MFZfa3U833mZc\"",
    "mtime": "2023-08-10T15:50:42.793Z",
    "size": 1080,
    "path": "../public/_nuxt/favorite.658460fe.js.br"
  },
  "/_nuxt/favorite.658460fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4ec-y/bzzzZ1r81oSOCIx5Wboc27+iw\"",
    "mtime": "2023-08-10T15:50:42.789Z",
    "size": 1260,
    "path": "../public/_nuxt/favorite.658460fe.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2023-08-10T15:50:41.977Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-08-10T15:50:41.976Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.8888ee34.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a5c-VrNak6RRLQz9DwAvYlSvJTfb+Ms\"",
    "mtime": "2023-08-10T15:50:41.974Z",
    "size": 23132,
    "path": "../public/_nuxt/index.8888ee34.css"
  },
  "/_nuxt/index.8888ee34.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12d8-dA0v4NNegr/NNkIB/nuBpdFz88I\"",
    "mtime": "2023-08-10T15:50:42.821Z",
    "size": 4824,
    "path": "../public/_nuxt/index.8888ee34.css.br"
  },
  "/_nuxt/index.8888ee34.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"166d-jgOuYTOX2Tq1pfZ3FGujbZWx5Wo\"",
    "mtime": "2023-08-10T15:50:42.795Z",
    "size": 5741,
    "path": "../public/_nuxt/index.8888ee34.css.gz"
  },
  "/_nuxt/index.944dea5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-0leULH9JlQGa8t8p+6vUCjcWQZQ\"",
    "mtime": "2023-08-10T15:50:41.972Z",
    "size": 2616,
    "path": "../public/_nuxt/index.944dea5d.css"
  },
  "/_nuxt/index.944dea5d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cd-JgHqNHc92ftc0fn8g5iBImLILC0\"",
    "mtime": "2023-08-10T15:50:42.825Z",
    "size": 717,
    "path": "../public/_nuxt/index.944dea5d.css.br"
  },
  "/_nuxt/index.944dea5d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"378-ZNbh8AAG7e5ALRAoFv4nLBUXz+0\"",
    "mtime": "2023-08-10T15:50:42.822Z",
    "size": 888,
    "path": "../public/_nuxt/index.944dea5d.css.gz"
  },
  "/_nuxt/index.9b2dbd6b.js": {
    "type": "application/javascript",
    "etag": "\"16f31-7nKRknKHDV4vgPHjFId4QZiUaeg\"",
    "mtime": "2023-08-10T15:50:41.970Z",
    "size": 94001,
    "path": "../public/_nuxt/index.9b2dbd6b.js"
  },
  "/_nuxt/index.9b2dbd6b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6485-hWhGqD2u3bD0hw1RwO5u/bQteDw\"",
    "mtime": "2023-08-10T15:50:42.934Z",
    "size": 25733,
    "path": "../public/_nuxt/index.9b2dbd6b.js.br"
  },
  "/_nuxt/index.9b2dbd6b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"7227-vWfsITTF8jVMXfmmQaIeENqTpHc\"",
    "mtime": "2023-08-10T15:50:42.828Z",
    "size": 29223,
    "path": "../public/_nuxt/index.9b2dbd6b.js.gz"
  },
  "/_nuxt/index.cd971b2e.js": {
    "type": "application/javascript",
    "etag": "\"605-YtkAKZg+k/Ll34rLiA1znuPOZ0w\"",
    "mtime": "2023-08-10T15:50:41.968Z",
    "size": 1541,
    "path": "../public/_nuxt/index.cd971b2e.js"
  },
  "/_nuxt/index.cd971b2e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"303-fVP0jhsTCxw3Ooewj0+ZBR/u2DI\"",
    "mtime": "2023-08-10T15:50:42.938Z",
    "size": 771,
    "path": "../public/_nuxt/index.cd971b2e.js.br"
  },
  "/_nuxt/index.cd971b2e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"38b-l3Cg5nXAhTy86ifE9w7hwtztFp8\"",
    "mtime": "2023-08-10T15:50:42.935Z",
    "size": 907,
    "path": "../public/_nuxt/index.cd971b2e.js.gz"
  },
  "/_nuxt/index.f8993118.js": {
    "type": "application/javascript",
    "etag": "\"3aba-OSrPvLH+3r7NyUIKFjBQpl6NpmQ\"",
    "mtime": "2023-08-10T15:50:41.966Z",
    "size": 15034,
    "path": "../public/_nuxt/index.f8993118.js"
  },
  "/_nuxt/index.f8993118.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12fb-dUfB7iyQIgcZFryGuimvRAkiT/s\"",
    "mtime": "2023-08-10T15:50:42.955Z",
    "size": 4859,
    "path": "../public/_nuxt/index.f8993118.js.br"
  },
  "/_nuxt/index.f8993118.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f0-O3/dZFdgZsT+aAjaDNzDZmwyaUg\"",
    "mtime": "2023-08-10T15:50:42.939Z",
    "size": 5360,
    "path": "../public/_nuxt/index.f8993118.js.gz"
  },
  "/_nuxt/isAuth.d789b309.js": {
    "type": "application/javascript",
    "etag": "\"213-ZYeEWdlfgIoYZQSd5dtyiWQQr58\"",
    "mtime": "2023-08-10T15:50:41.964Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.d789b309.js"
  },
  "/_nuxt/login.0d049f76.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-vn9UsLd5KCcV3FowN4qQgGIAwqQ\"",
    "mtime": "2023-08-10T15:50:41.962Z",
    "size": 2199,
    "path": "../public/_nuxt/login.0d049f76.css"
  },
  "/_nuxt/login.0d049f76.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-ut8sm9cyn44VF7m9c8qzRat/1es\"",
    "mtime": "2023-08-10T15:50:42.959Z",
    "size": 605,
    "path": "../public/_nuxt/login.0d049f76.css.br"
  },
  "/_nuxt/login.0d049f76.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-qc43LhPcxVOq6vlXurbjHKiyQ4M\"",
    "mtime": "2023-08-10T15:50:42.956Z",
    "size": 776,
    "path": "../public/_nuxt/login.0d049f76.css.gz"
  },
  "/_nuxt/login.e9a0cba0.js": {
    "type": "application/javascript",
    "etag": "\"82d-Y8QbZDxLL48RiqzrYsrt7cipq3M\"",
    "mtime": "2023-08-10T15:50:41.961Z",
    "size": 2093,
    "path": "../public/_nuxt/login.e9a0cba0.js"
  },
  "/_nuxt/login.e9a0cba0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-NgDD49IflQ6gbf8de+aTcSadWe0\"",
    "mtime": "2023-08-10T15:50:42.962Z",
    "size": 985,
    "path": "../public/_nuxt/login.e9a0cba0.js.br"
  },
  "/_nuxt/login.e9a0cba0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a8-t5BnTFGFJL+Z1lA8Bkoh7cPwYb4\"",
    "mtime": "2023-08-10T15:50:42.959Z",
    "size": 1192,
    "path": "../public/_nuxt/login.e9a0cba0.js.gz"
  },
  "/_nuxt/main.f52baff7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b8f5-jyPrmqbHvD3IVYuVRj+eF6gZFnc\"",
    "mtime": "2023-08-10T15:50:41.958Z",
    "size": 178421,
    "path": "../public/_nuxt/main.f52baff7.jpg"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-08-10T15:50:41.954Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/news.fd06deb0.js": {
    "type": "application/javascript",
    "etag": "\"4af-LXo+T5OE4duR1Kf2EyKX/FibC5k\"",
    "mtime": "2023-08-10T15:50:41.952Z",
    "size": 1199,
    "path": "../public/_nuxt/news.fd06deb0.js"
  },
  "/_nuxt/news.fd06deb0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a9-f6Z8wpXFuHxs/rh0iUtSCfwAOQw\"",
    "mtime": "2023-08-10T15:50:42.966Z",
    "size": 425,
    "path": "../public/_nuxt/news.fd06deb0.js.br"
  },
  "/_nuxt/news.fd06deb0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-zsSAAB+rYLLjPHzsITSuqGG7cug\"",
    "mtime": "2023-08-10T15:50:42.964Z",
    "size": 535,
    "path": "../public/_nuxt/news.fd06deb0.js.gz"
  },
  "/_nuxt/newsList.20355078.js": {
    "type": "application/javascript",
    "etag": "\"10a-nQX9VB8x9uNkk5uZOptqo8FgPiw\"",
    "mtime": "2023-08-10T15:50:41.949Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.20355078.js"
  },
  "/_nuxt/orders.c8354c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-6J6JWly/gONDBW5irerM5+0E3fk\"",
    "mtime": "2023-08-10T15:50:41.945Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.c8354c1f.css"
  },
  "/_nuxt/orders.c8354c1f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"792-i5UCzMLLoq4AyioSV34PfXP1V1s\"",
    "mtime": "2023-08-10T15:50:42.977Z",
    "size": 1938,
    "path": "../public/_nuxt/orders.c8354c1f.css.br"
  },
  "/_nuxt/orders.c8354c1f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d3-Qclw1nptR2FladYo3Lzj/ch8Dvw\"",
    "mtime": "2023-08-10T15:50:42.967Z",
    "size": 2259,
    "path": "../public/_nuxt/orders.c8354c1f.css.gz"
  },
  "/_nuxt/orders.de74ed25.js": {
    "type": "application/javascript",
    "etag": "\"2671-eDVzr18pYL95rAoFN0hObpFueZ8\"",
    "mtime": "2023-08-10T15:50:41.942Z",
    "size": 9841,
    "path": "../public/_nuxt/orders.de74ed25.js"
  },
  "/_nuxt/orders.de74ed25.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"bab-44EOa3Sb7Jy8yq8CVE5AA7qip9U\"",
    "mtime": "2023-08-10T15:50:42.988Z",
    "size": 2987,
    "path": "../public/_nuxt/orders.de74ed25.js.br"
  },
  "/_nuxt/orders.de74ed25.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"daa-dN1X/7G1z9kTDDsTsD9w6sdMWvQ\"",
    "mtime": "2023-08-10T15:50:42.978Z",
    "size": 3498,
    "path": "../public/_nuxt/orders.de74ed25.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-10T15:50:41.938Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.77281df8.js": {
    "type": "application/javascript",
    "etag": "\"1688-hNla5boY3cIKRMuN6zyd4tPIAmk\"",
    "mtime": "2023-08-10T15:50:41.934Z",
    "size": 5768,
    "path": "../public/_nuxt/profile.77281df8.js"
  },
  "/_nuxt/profile.77281df8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"837-chENs+jeKa7AMRQSqnfeORAqGKg\"",
    "mtime": "2023-08-10T15:50:42.996Z",
    "size": 2103,
    "path": "../public/_nuxt/profile.77281df8.js.br"
  },
  "/_nuxt/profile.77281df8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"99f-VHkfQ7XQDVhlMErxOOz6To+Iui4\"",
    "mtime": "2023-08-10T15:50:42.989Z",
    "size": 2463,
    "path": "../public/_nuxt/profile.77281df8.js.gz"
  },
  "/_nuxt/profile.e6f5fb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-SsUPfxovRsTMuFYpqmbTijoZgdk\"",
    "mtime": "2023-08-10T15:50:41.931Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.e6f5fb40.css"
  },
  "/_nuxt/profile.e6f5fb40.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c1-3EZF3tPrCgtRgjg8s+xoHx2NOvU\"",
    "mtime": "2023-08-10T15:50:43.033Z",
    "size": 1985,
    "path": "../public/_nuxt/profile.e6f5fb40.css.br"
  },
  "/_nuxt/profile.e6f5fb40.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b43-IzZPe9cyMGSeFxTPSyMO+u5c9nw\"",
    "mtime": "2023-08-10T15:50:42.999Z",
    "size": 2883,
    "path": "../public/_nuxt/profile.e6f5fb40.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-08-10T15:50:41.927Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-08-10T15:50:43.036Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-08-10T15:50:43.034Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.d7e93ec5.js": {
    "type": "application/javascript",
    "etag": "\"111b-TDmiNTM66LXW+YlieYfHwttU4b8\"",
    "mtime": "2023-08-10T15:50:41.924Z",
    "size": 4379,
    "path": "../public/_nuxt/register.d7e93ec5.js"
  },
  "/_nuxt/register.d7e93ec5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"576-v4PG+5pDWIK1EOMXfnATGkST5RU\"",
    "mtime": "2023-08-10T15:50:43.043Z",
    "size": 1398,
    "path": "../public/_nuxt/register.d7e93ec5.js.br"
  },
  "/_nuxt/register.d7e93ec5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"68f-Z8h8eRBcCyAQR3q0N+O78LmQxTk\"",
    "mtime": "2023-08-10T15:50:43.037Z",
    "size": 1679,
    "path": "../public/_nuxt/register.d7e93ec5.js.gz"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-10T15:50:41.920Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-10T15:50:41.916Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-08-10T15:50:43.047Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-08-10T15:50:43.044Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-08-10T15:50:41.911Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-08-10T15:50:41.898Z",
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
