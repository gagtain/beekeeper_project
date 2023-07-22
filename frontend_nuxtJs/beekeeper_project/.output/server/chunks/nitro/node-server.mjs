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
    "mtime": "2023-07-22T18:53:55.564Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-22T18:53:55.562Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.0540661e.js": {
    "type": "application/javascript",
    "etag": "\"96e-m4KkQUdkgu/QGRKxk9SS/kWU3aY\"",
    "mtime": "2023-07-22T18:53:55.560Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.0540661e.js"
  },
  "/_nuxt/BasketInfo.0540661e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e0-XvMGTi5DMYvoxF/DO0cesdJH13Q\"",
    "mtime": "2023-07-22T18:53:55.579Z",
    "size": 992,
    "path": "../public/_nuxt/BasketInfo.0540661e.js.br"
  },
  "/_nuxt/BasketInfo.0540661e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49b-tUvSoyhfgljgBA79zremABtOTc8\"",
    "mtime": "2023-07-22T18:53:55.567Z",
    "size": 1179,
    "path": "../public/_nuxt/BasketInfo.0540661e.js.gz"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-w6ZWAKEgVWOkc1fvPF8RCeGaC4Y\"",
    "mtime": "2023-07-22T18:53:55.560Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f5-n2VRrAMAtWDVYe3O6dSOW0xXYqw\"",
    "mtime": "2023-07-22T18:53:55.605Z",
    "size": 1781,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.br"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a8-N3A5Q2F+JopdZICKJCTPgwM2DvQ\"",
    "mtime": "2023-07-22T18:53:55.580Z",
    "size": 2472,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.gz"
  },
  "/_nuxt/CatalogProduct.02171d22.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d6a-zfnX3h2lBUJx+LVy1uqT8eJomwI\"",
    "mtime": "2023-07-22T18:53:55.559Z",
    "size": 7530,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css"
  },
  "/_nuxt/CatalogProduct.02171d22.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"654-qpdftA878CZH5Z5BbhpUZms4hRc\"",
    "mtime": "2023-07-22T18:53:55.615Z",
    "size": 1620,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.br"
  },
  "/_nuxt/CatalogProduct.02171d22.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"75d-k0BZggsPMxTlBNehk0MeZC2XVgk\"",
    "mtime": "2023-07-22T18:53:55.606Z",
    "size": 1885,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.gz"
  },
  "/_nuxt/CatalogProduct.454db378.js": {
    "type": "application/javascript",
    "etag": "\"bea-U/SQK4kn1mr9uBkp4jl7MF42UxI\"",
    "mtime": "2023-07-22T18:53:55.559Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.454db378.js"
  },
  "/_nuxt/CatalogProduct.454db378.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b5-vXsWXWwqE4aDVD8Z1SsmnTvZVoM\"",
    "mtime": "2023-07-22T18:53:55.619Z",
    "size": 1205,
    "path": "../public/_nuxt/CatalogProduct.454db378.js.br"
  },
  "/_nuxt/CatalogProduct.454db378.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"555-2tlSlL9mxyDzvrL6G1mfeQgsMyY\"",
    "mtime": "2023-07-22T18:53:55.615Z",
    "size": 1365,
    "path": "../public/_nuxt/CatalogProduct.454db378.js.gz"
  },
  "/_nuxt/FavoriteComp.bd778101.js": {
    "type": "application/javascript",
    "etag": "\"c46-joC+CASuA8Aml/TzWQ2myMhAx84\"",
    "mtime": "2023-07-22T18:53:55.558Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.bd778101.js"
  },
  "/_nuxt/FavoriteComp.bd778101.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3bb-dyZtLx4nT63GbfKXI+xrbMNCnlQ\"",
    "mtime": "2023-07-22T18:53:55.625Z",
    "size": 955,
    "path": "../public/_nuxt/FavoriteComp.bd778101.js.br"
  },
  "/_nuxt/FavoriteComp.bd778101.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"457-j5mgBP90Pd3G2DWOOoJm4MmoAbE\"",
    "mtime": "2023-07-22T18:53:55.620Z",
    "size": 1111,
    "path": "../public/_nuxt/FavoriteComp.bd778101.js.gz"
  },
  "/_nuxt/FavoriteComp.d10507f2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-c3cno65+JH2VQizEAUB4Imjik7w\"",
    "mtime": "2023-07-22T18:53:55.557Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fe-yHb/J0Uvuv63E/C42srrZLnk4Ow\"",
    "mtime": "2023-07-22T18:53:55.641Z",
    "size": 1534,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.br"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6Xkawk1MFTlzm7F+eEmnZa7mxag\"",
    "mtime": "2023-07-22T18:53:55.626Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.gz"
  },
  "/_nuxt/ImageForm.fc3f576a.js": {
    "type": "application/javascript",
    "etag": "\"225-6pq+jWBqfQPATNEVO9sMCtkA48E\"",
    "mtime": "2023-07-22T18:53:55.557Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.fc3f576a.js"
  },
  "/_nuxt/LoadingComp.bb35d702.js": {
    "type": "application/javascript",
    "etag": "\"1fe-R49/+m9wOCOE/eWk+oI9Ddg7WPc\"",
    "mtime": "2023-07-22T18:53:55.556Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.bb35d702.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-22T18:53:55.556Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-YWr80UDyXOSYzU+Ijx8lm2W1K2c\"",
    "mtime": "2023-07-22T18:53:55.555Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1be-GHaQKDEThlXoglW1KGjvOJZOxKU\"",
    "mtime": "2023-07-22T18:53:55.645Z",
    "size": 446,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.br"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-dnvTg2fki6UxU5oYPO/E/HQ9apE\"",
    "mtime": "2023-07-22T18:53:55.643Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.gz"
  },
  "/_nuxt/OrderProductList.f22f8b22.js": {
    "type": "application/javascript",
    "etag": "\"459-aAbMULLDNv4ht7zk7OpaW/IP5/w\"",
    "mtime": "2023-07-22T18:53:55.554Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.f22f8b22.js"
  },
  "/_nuxt/OrderProductList.f22f8b22.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-f43Wrl8vYwviMzR0RxztKBuoEe4\"",
    "mtime": "2023-07-22T18:53:55.648Z",
    "size": 517,
    "path": "../public/_nuxt/OrderProductList.f22f8b22.js.br"
  },
  "/_nuxt/OrderProductList.f22f8b22.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23b-sNb+JJ3n4JFCQ4RE1qV5iObrQo8\"",
    "mtime": "2023-07-22T18:53:55.646Z",
    "size": 571,
    "path": "../public/_nuxt/OrderProductList.f22f8b22.js.gz"
  },
  "/_nuxt/RatingComp.3d7e2c14.js": {
    "type": "application/javascript",
    "etag": "\"bac-GBkDHOwYlSqgbyNFFSMY/LOA6y4\"",
    "mtime": "2023-07-22T18:53:55.554Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.3d7e2c14.js"
  },
  "/_nuxt/RatingComp.3d7e2c14.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d5-HRvPDNuT42fx1wE65R+/3iE6CjQ\"",
    "mtime": "2023-07-22T18:53:55.653Z",
    "size": 981,
    "path": "../public/_nuxt/RatingComp.3d7e2c14.js.br"
  },
  "/_nuxt/RatingComp.3d7e2c14.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47b-RSacIWK5vgwlhjsVp2qPYaHQu8o\"",
    "mtime": "2023-07-22T18:53:55.649Z",
    "size": 1147,
    "path": "../public/_nuxt/RatingComp.3d7e2c14.js.gz"
  },
  "/_nuxt/RatingComp.6ef7db93.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10a1-8Gfjt3dDrqWBoexscvy1WtgDnjY\"",
    "mtime": "2023-07-22T18:53:55.553Z",
    "size": 4257,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css"
  },
  "/_nuxt/RatingComp.6ef7db93.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3fc-4iJaxX8CPtl6qVS1TxMXC0P4wqQ\"",
    "mtime": "2023-07-22T18:53:55.659Z",
    "size": 1020,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.br"
  },
  "/_nuxt/RatingComp.6ef7db93.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4bb-StcXTlfNUGIOh2NgsdQDFVWeWLM\"",
    "mtime": "2023-07-22T18:53:55.654Z",
    "size": 1211,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.gz"
  },
  "/_nuxt/UserBasket.cba2cf0e.js": {
    "type": "application/javascript",
    "etag": "\"1410-j9ipFTx/7QhGPI/c/b6PhG1CV0U\"",
    "mtime": "2023-07-22T18:53:55.553Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.cba2cf0e.js"
  },
  "/_nuxt/UserBasket.cba2cf0e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76f-aKkqT/Pfrju/3uriDoXnfKi5bpc\"",
    "mtime": "2023-07-22T18:53:55.666Z",
    "size": 1903,
    "path": "../public/_nuxt/UserBasket.cba2cf0e.js.br"
  },
  "/_nuxt/UserBasket.cba2cf0e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"891-euMUGghg2h25YfPLzuDKqASWoPo\"",
    "mtime": "2023-07-22T18:53:55.660Z",
    "size": 2193,
    "path": "../public/_nuxt/UserBasket.cba2cf0e.js.gz"
  },
  "/_nuxt/UserBasket.d26a50dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-kKYV+/VsLmXlyPvX/GIybQhwJGg\"",
    "mtime": "2023-07-22T18:53:55.552Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css"
  },
  "/_nuxt/UserBasket.d26a50dd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-dTjOi3ZlK6jAGp2mSk2qPUjLTiU\"",
    "mtime": "2023-07-22T18:53:55.683Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.br"
  },
  "/_nuxt/UserBasket.d26a50dd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-vnsR1nObKszggTaMRtQnIDCJJiQ\"",
    "mtime": "2023-07-22T18:53:55.666Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.gz"
  },
  "/_nuxt/_id_.88e30196.js": {
    "type": "application/javascript",
    "etag": "\"1337-JBkLLExaqAlX/GSCieag6kf7tDM\"",
    "mtime": "2023-07-22T18:53:55.552Z",
    "size": 4919,
    "path": "../public/_nuxt/_id_.88e30196.js"
  },
  "/_nuxt/_id_.88e30196.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"752-f55U2HZq7EoYyev5GA0YMWSfaZA\"",
    "mtime": "2023-07-22T18:53:55.690Z",
    "size": 1874,
    "path": "../public/_nuxt/_id_.88e30196.js.br"
  },
  "/_nuxt/_id_.88e30196.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"845-Qqb0PLJCcAUq/UwKv4aSk1jExaM\"",
    "mtime": "2023-07-22T18:53:55.684Z",
    "size": 2117,
    "path": "../public/_nuxt/_id_.88e30196.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-22T18:53:55.551Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.dea86431.js": {
    "type": "application/javascript",
    "etag": "\"4be-XRppLtDAN4xD3zml/Bb9tAG1WtQ\"",
    "mtime": "2023-07-22T18:53:55.550Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.dea86431.js"
  },
  "/_nuxt/_id_.dea86431.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-LxsWPuogCrTL+QVNKAyeGgGUMhA\"",
    "mtime": "2023-07-22T18:53:55.693Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.dea86431.js.br"
  },
  "/_nuxt/_id_.dea86431.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2de-ohOTtSslwzEKtlUzWr14FcRz3c4\"",
    "mtime": "2023-07-22T18:53:55.691Z",
    "size": 734,
    "path": "../public/_nuxt/_id_.dea86431.js.gz"
  },
  "/_nuxt/_id_.fcdf749d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-2EqCKqciSSwI2lRHEUMUCe7OJzE\"",
    "mtime": "2023-07-22T18:53:55.550Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.fcdf749d.css"
  },
  "/_nuxt/_id_.fcdf749d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-GUNstigloq87EJw9AtLlpGxijWs\"",
    "mtime": "2023-07-22T18:53:55.703Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.fcdf749d.css.br"
  },
  "/_nuxt/_id_.fcdf749d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56b-TChFx/M0UO8zV7biLqt+aZr60a4\"",
    "mtime": "2023-07-22T18:53:55.694Z",
    "size": 1387,
    "path": "../public/_nuxt/_id_.fcdf749d.css.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-22T18:53:55.549Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-22T18:53:55.711Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-22T18:53:55.704Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.3d5e0437.js": {
    "type": "application/javascript",
    "etag": "\"270-7b6vOyPdJ4E5AM4aJY+LHB4MlBc\"",
    "mtime": "2023-07-22T18:53:55.549Z",
    "size": 624,
    "path": "../public/_nuxt/basket.3d5e0437.js"
  },
  "/_nuxt/catalog.3d2ca8ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d3a-A3wj4wMi7Z2L4xkRT6vNwTYC7dk\"",
    "mtime": "2023-07-22T18:53:55.548Z",
    "size": 7482,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css"
  },
  "/_nuxt/catalog.3d2ca8ce.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a4-7yS8Mc3F3PqwU7Q9362NIX67es8\"",
    "mtime": "2023-07-22T18:53:55.720Z",
    "size": 1700,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.br"
  },
  "/_nuxt/catalog.3d2ca8ce.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b6-tA8LIgQFvv2jHunrlK5ztx/dbRQ\"",
    "mtime": "2023-07-22T18:53:55.712Z",
    "size": 1974,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.gz"
  },
  "/_nuxt/catalog.eab0e83e.js": {
    "type": "application/javascript",
    "etag": "\"1c86-vJMN289mJrloYks8bOOUdrMlvxk\"",
    "mtime": "2023-07-22T18:53:55.548Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.eab0e83e.js"
  },
  "/_nuxt/catalog.eab0e83e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"98f-v3VK64k1rVOyKvMWfa9aYNklIYM\"",
    "mtime": "2023-07-22T18:53:55.729Z",
    "size": 2447,
    "path": "../public/_nuxt/catalog.eab0e83e.js.br"
  },
  "/_nuxt/catalog.eab0e83e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"afa-WE2atm13Dwti5mqSXi1D2pBbfBg\"",
    "mtime": "2023-07-22T18:53:55.721Z",
    "size": 2810,
    "path": "../public/_nuxt/catalog.eab0e83e.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-22T18:53:55.547Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-22T18:53:55.547Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-22T18:53:55.842Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-22T18:53:55.732Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/checkout.fe7b2fb2.js": {
    "type": "application/javascript",
    "etag": "\"147c2-djwmsXAOCGVUWWp20/a8PbGVYns\"",
    "mtime": "2023-07-22T18:53:55.545Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.fe7b2fb2.js"
  },
  "/_nuxt/checkout.fe7b2fb2.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50c0-6U1eqHg0HYBdupoijjMNv3EtY4o\"",
    "mtime": "2023-07-22T18:53:55.937Z",
    "size": 20672,
    "path": "../public/_nuxt/checkout.fe7b2fb2.js.br"
  },
  "/_nuxt/checkout.fe7b2fb2.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e02-bZ00a924RtmthPNDCS3eZ6quzJo\"",
    "mtime": "2023-07-22T18:53:55.845Z",
    "size": 24066,
    "path": "../public/_nuxt/checkout.fe7b2fb2.js.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-22T18:53:55.545Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.26b6f8a2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"23e7-myExv8fF6uyVJOhrvB/927UTJFM\"",
    "mtime": "2023-07-22T18:53:55.544Z",
    "size": 9191,
    "path": "../public/_nuxt/entry.26b6f8a2.css"
  },
  "/_nuxt/entry.26b6f8a2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8c1-FGppXjQD20qfZFcfDfEEbFjNflQ\"",
    "mtime": "2023-07-22T18:53:55.949Z",
    "size": 2241,
    "path": "../public/_nuxt/entry.26b6f8a2.css.br"
  },
  "/_nuxt/entry.26b6f8a2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a16-ezpGWy9XflJUSKeVO4KsxQZCF+c\"",
    "mtime": "2023-07-22T18:53:55.938Z",
    "size": 2582,
    "path": "../public/_nuxt/entry.26b6f8a2.css.gz"
  },
  "/_nuxt/entry.92b418b5.js": {
    "type": "application/javascript",
    "etag": "\"33ca0-bW0KSRU/vrQ1Vu3dujhUXlrECX8\"",
    "mtime": "2023-07-22T18:53:55.543Z",
    "size": 212128,
    "path": "../public/_nuxt/entry.92b418b5.js"
  },
  "/_nuxt/entry.92b418b5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11585-L6ASUtd7Us/A47QEwJz3yIURX3A\"",
    "mtime": "2023-07-22T18:53:56.322Z",
    "size": 71045,
    "path": "../public/_nuxt/entry.92b418b5.js.br"
  },
  "/_nuxt/entry.92b418b5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1376e-3kUlTjHZgax8ON1Hwk/9B39//lg\"",
    "mtime": "2023-07-22T18:53:55.958Z",
    "size": 79726,
    "path": "../public/_nuxt/entry.92b418b5.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-22T18:53:55.542Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-22T18:53:56.328Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-22T18:53:56.324Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.e083e9b6.js": {
    "type": "application/javascript",
    "etag": "\"8a4-ITh+rFTYw+vD9C9Am1lVyL8YQEk\"",
    "mtime": "2023-07-22T18:53:55.541Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.e083e9b6.js"
  },
  "/_nuxt/error-404.e083e9b6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-MOpCVWqrNmVNl7Obh/vfoXUhmhg\"",
    "mtime": "2023-07-22T18:53:56.332Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.e083e9b6.js.br"
  },
  "/_nuxt/error-404.e083e9b6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-edfWTH9QuS5+YvLtG4uK3LsEJW8\"",
    "mtime": "2023-07-22T18:53:56.329Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.e083e9b6.js.gz"
  },
  "/_nuxt/error-500.8e722515.js": {
    "type": "application/javascript",
    "etag": "\"757-IE4QIAEzxMwDaXMJ/E/IpS+RUkY\"",
    "mtime": "2023-07-22T18:53:55.541Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.8e722515.js"
  },
  "/_nuxt/error-500.8e722515.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34c-qro9BMdhhDp5fH24WLDZhpWe3hc\"",
    "mtime": "2023-07-22T18:53:56.336Z",
    "size": 844,
    "path": "../public/_nuxt/error-500.8e722515.js.br"
  },
  "/_nuxt/error-500.8e722515.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3dc-5WPO2L4a4uFxItuQmyhrxMEay2Y\"",
    "mtime": "2023-07-22T18:53:56.333Z",
    "size": 988,
    "path": "../public/_nuxt/error-500.8e722515.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-22T18:53:55.540Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-22T18:53:56.340Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-22T18:53:56.337Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.7395de25.js": {
    "type": "application/javascript",
    "etag": "\"45e-hAUDnjKfIyHguS0NqIpZrovzNqA\"",
    "mtime": "2023-07-22T18:53:55.540Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.7395de25.js"
  },
  "/_nuxt/error-component.7395de25.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-5gUQ9WoAqeXn53GLo5kq9AMmhWg\"",
    "mtime": "2023-07-22T18:53:56.343Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.7395de25.js.br"
  },
  "/_nuxt/error-component.7395de25.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"261-ZUj/qGdxEt1rpZdUXneDKcDZSJQ\"",
    "mtime": "2023-07-22T18:53:56.341Z",
    "size": 609,
    "path": "../public/_nuxt/error-component.7395de25.js.gz"
  },
  "/_nuxt/favorite.9698b33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-jhDWFpVpVzahIl7O9qpSFn1p+f4\"",
    "mtime": "2023-07-22T18:53:55.539Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.9698b33c.css"
  },
  "/_nuxt/favorite.9698b33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-+f85b17ph0gDk/2u4Tt397WrMHk\"",
    "mtime": "2023-07-22T18:53:56.351Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.9698b33c.css.br"
  },
  "/_nuxt/favorite.9698b33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"619-iFobUxJ0BHLodFh3SdPk8ubtENw\"",
    "mtime": "2023-07-22T18:53:56.343Z",
    "size": 1561,
    "path": "../public/_nuxt/favorite.9698b33c.css.gz"
  },
  "/_nuxt/favorite.c842f531.js": {
    "type": "application/javascript",
    "etag": "\"a30-NP7mWd+HWCy4Cj8wQhC9Rnca+TM\"",
    "mtime": "2023-07-22T18:53:55.539Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.c842f531.js"
  },
  "/_nuxt/favorite.c842f531.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43b-woevtiDh6FTmcgicQ5IMsSa4Os0\"",
    "mtime": "2023-07-22T18:53:56.356Z",
    "size": 1083,
    "path": "../public/_nuxt/favorite.c842f531.js.br"
  },
  "/_nuxt/favorite.c842f531.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f3-vSbxHE7wRkNyKkecLHXatuV3y24\"",
    "mtime": "2023-07-22T18:53:56.352Z",
    "size": 1267,
    "path": "../public/_nuxt/favorite.c842f531.js.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-22T18:53:55.538Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.26b8983a.js": {
    "type": "application/javascript",
    "etag": "\"5a0-z38aH9yn9zpCcYV6wsrP97SKSy0\"",
    "mtime": "2023-07-22T18:53:55.538Z",
    "size": 1440,
    "path": "../public/_nuxt/index.26b8983a.js"
  },
  "/_nuxt/index.26b8983a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2c6-YZRUYmdS7R3AJKF6OW+JJKBgA9E\"",
    "mtime": "2023-07-22T18:53:56.360Z",
    "size": 710,
    "path": "../public/_nuxt/index.26b8983a.js.br"
  },
  "/_nuxt/index.26b8983a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"349-/ArYwYSlI3lxWakIlN24FFG0jog\"",
    "mtime": "2023-07-22T18:53:56.357Z",
    "size": 841,
    "path": "../public/_nuxt/index.26b8983a.js.gz"
  },
  "/_nuxt/index.70b1375b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-dg6IRU/Tv7b3jG2VRspHvhJags0\"",
    "mtime": "2023-07-22T18:53:55.537Z",
    "size": 22587,
    "path": "../public/_nuxt/index.70b1375b.css"
  },
  "/_nuxt/index.70b1375b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127c-7V7vXMm6KXvg6egfRE0UIaqsLxw\"",
    "mtime": "2023-07-22T18:53:56.387Z",
    "size": 4732,
    "path": "../public/_nuxt/index.70b1375b.css.br"
  },
  "/_nuxt/index.70b1375b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-zBMSMZ0U2xdit9OXRdi1Z33YwX8\"",
    "mtime": "2023-07-22T18:53:56.361Z",
    "size": 5602,
    "path": "../public/_nuxt/index.70b1375b.css.gz"
  },
  "/_nuxt/index.8b915a18.js": {
    "type": "application/javascript",
    "etag": "\"3abf-65Uryr2/Zf60qWdJ2KRQX2Ijnkg\"",
    "mtime": "2023-07-22T18:53:55.536Z",
    "size": 15039,
    "path": "../public/_nuxt/index.8b915a18.js"
  },
  "/_nuxt/index.8b915a18.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f6-7w5A3AaexxyQkYcfHvhjDdameQs\"",
    "mtime": "2023-07-22T18:53:56.405Z",
    "size": 4854,
    "path": "../public/_nuxt/index.8b915a18.js.br"
  },
  "/_nuxt/index.8b915a18.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-YL6qRtvZHG4E94fWDiV2EnxqTOs\"",
    "mtime": "2023-07-22T18:53:56.388Z",
    "size": 5362,
    "path": "../public/_nuxt/index.8b915a18.js.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-22T18:53:55.536Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-22T18:53:56.409Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-22T18:53:56.406Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/index.f34b1d7f.js": {
    "type": "application/javascript",
    "etag": "\"16a71-KqbBZ9auFOGyB4fJSwEjy+F4q+k\"",
    "mtime": "2023-07-22T18:53:55.534Z",
    "size": 92785,
    "path": "../public/_nuxt/index.f34b1d7f.js"
  },
  "/_nuxt/index.f34b1d7f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"630d-qPCuUBPEVWezomJZAtUI3f9bId0\"",
    "mtime": "2023-07-22T18:53:56.520Z",
    "size": 25357,
    "path": "../public/_nuxt/index.f34b1d7f.js.br"
  },
  "/_nuxt/index.f34b1d7f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f76-tTqc3i95U6a0Yl4WXPD0HpXt8Zs\"",
    "mtime": "2023-07-22T18:53:56.412Z",
    "size": 28534,
    "path": "../public/_nuxt/index.f34b1d7f.js.gz"
  },
  "/_nuxt/isAuth.79f84e33.js": {
    "type": "application/javascript",
    "etag": "\"213-LydUa5t4HIGRZfk5Myyd0bv/y10\"",
    "mtime": "2023-07-22T18:53:55.533Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.79f84e33.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-22T18:53:55.532Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-22T18:53:56.524Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-22T18:53:56.521Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.71b73e56.js": {
    "type": "application/javascript",
    "etag": "\"830-GapRSZAlMs7YiON6YGCy6sXDGaI\"",
    "mtime": "2023-07-22T18:53:55.532Z",
    "size": 2096,
    "path": "../public/_nuxt/login.71b73e56.js"
  },
  "/_nuxt/login.71b73e56.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3da-w7dgk1fS6YLLOf4rrvA+TMNcYDI\"",
    "mtime": "2023-07-22T18:53:56.529Z",
    "size": 986,
    "path": "../public/_nuxt/login.71b73e56.js.br"
  },
  "/_nuxt/login.71b73e56.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4aa-FCYaOGS3BjH3E0r/MH1YCH9Yy9E\"",
    "mtime": "2023-07-22T18:53:56.525Z",
    "size": 1194,
    "path": "../public/_nuxt/login.71b73e56.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-22T18:53:55.531Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.0b4aaf4a.js": {
    "type": "application/javascript",
    "etag": "\"4af-QpwAYLGD5j7QjFgW5f9AZXwX4Vg\"",
    "mtime": "2023-07-22T18:53:55.529Z",
    "size": 1199,
    "path": "../public/_nuxt/news.0b4aaf4a.js"
  },
  "/_nuxt/news.0b4aaf4a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a6-AaLB5f3Bsy02xy27P/RQ7Vaj/pg\"",
    "mtime": "2023-07-22T18:53:56.532Z",
    "size": 422,
    "path": "../public/_nuxt/news.0b4aaf4a.js.br"
  },
  "/_nuxt/news.0b4aaf4a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-PsoN4hXglHlmvYh8MA540NzieVk\"",
    "mtime": "2023-07-22T18:53:56.530Z",
    "size": 535,
    "path": "../public/_nuxt/news.0b4aaf4a.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-22T18:53:55.528Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.80d094fa.js": {
    "type": "application/javascript",
    "etag": "\"10a-8hyT+zrryAnz21yOkihoZbNkVho\"",
    "mtime": "2023-07-22T18:53:55.528Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.80d094fa.js"
  },
  "/_nuxt/orders.b23111a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2599-3WO4r9iDaz0GXEG6YHpRx+dA5zg\"",
    "mtime": "2023-07-22T18:53:55.526Z",
    "size": 9625,
    "path": "../public/_nuxt/orders.b23111a3.css"
  },
  "/_nuxt/orders.b23111a3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"78b-DvXmO3aKW5YSeIFUTc75WGb8Q2k\"",
    "mtime": "2023-07-22T18:53:56.544Z",
    "size": 1931,
    "path": "../public/_nuxt/orders.b23111a3.css.br"
  },
  "/_nuxt/orders.b23111a3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8bf-9klhVOpoA3J18/wsrz2KrFn18Sw\"",
    "mtime": "2023-07-22T18:53:56.533Z",
    "size": 2239,
    "path": "../public/_nuxt/orders.b23111a3.css.gz"
  },
  "/_nuxt/orders.f8310a04.js": {
    "type": "application/javascript",
    "etag": "\"1cb0-dkVJd/4Zcw0kCFABSYmeCCs3ag0\"",
    "mtime": "2023-07-22T18:53:55.526Z",
    "size": 7344,
    "path": "../public/_nuxt/orders.f8310a04.js"
  },
  "/_nuxt/orders.f8310a04.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"921-9v6ZXNBoAwqIHBfpk4dH+1o/cSQ\"",
    "mtime": "2023-07-22T18:53:56.553Z",
    "size": 2337,
    "path": "../public/_nuxt/orders.f8310a04.js.br"
  },
  "/_nuxt/orders.f8310a04.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"aba-TzztChUlnL6YLEYv+xdwVj7hGPU\"",
    "mtime": "2023-07-22T18:53:56.545Z",
    "size": 2746,
    "path": "../public/_nuxt/orders.f8310a04.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-22T18:53:55.525Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.5d2eb33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4ab0-8BeAMFdT90Jn71GUmLhhlEMrcj4\"",
    "mtime": "2023-07-22T18:53:55.524Z",
    "size": 19120,
    "path": "../public/_nuxt/profile.5d2eb33c.css"
  },
  "/_nuxt/profile.5d2eb33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6d2-0w1RZhTf3NIDDgOm8ZiGKU7eZmY\"",
    "mtime": "2023-07-22T18:53:56.580Z",
    "size": 1746,
    "path": "../public/_nuxt/profile.5d2eb33c.css.br"
  },
  "/_nuxt/profile.5d2eb33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"96d-Yvb/ix3eeUvneNdeKEitET6ccPg\"",
    "mtime": "2023-07-22T18:53:56.554Z",
    "size": 2413,
    "path": "../public/_nuxt/profile.5d2eb33c.css.gz"
  },
  "/_nuxt/profile.64fe8502.js": {
    "type": "application/javascript",
    "etag": "\"1241-hajLloQj0WkLsU9IjSyTcag+q4Q\"",
    "mtime": "2023-07-22T18:53:55.523Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.64fe8502.js"
  },
  "/_nuxt/profile.64fe8502.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"70c-0lmoSmc3R16EtZdUeUxPnwAPzPw\"",
    "mtime": "2023-07-22T18:53:56.587Z",
    "size": 1804,
    "path": "../public/_nuxt/profile.64fe8502.js.br"
  },
  "/_nuxt/profile.64fe8502.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83b-pHdi2XkEPYjCHo3NmBwgCGBX6dk\"",
    "mtime": "2023-07-22T18:53:56.581Z",
    "size": 2107,
    "path": "../public/_nuxt/profile.64fe8502.js.gz"
  },
  "/_nuxt/register.1876fe80.js": {
    "type": "application/javascript",
    "etag": "\"1128-bahZxsl84yXMnlB+wvLNyzmEfns\"",
    "mtime": "2023-07-22T18:53:55.521Z",
    "size": 4392,
    "path": "../public/_nuxt/register.1876fe80.js"
  },
  "/_nuxt/register.1876fe80.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"56e-nVrG0MgHMwEW4DsrUWmOPloaaeQ\"",
    "mtime": "2023-07-22T18:53:56.594Z",
    "size": 1390,
    "path": "../public/_nuxt/register.1876fe80.js.br"
  },
  "/_nuxt/register.1876fe80.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"697-wfsK3CxVr94QoD2niou8m4CsGps\"",
    "mtime": "2023-07-22T18:53:56.588Z",
    "size": 1687,
    "path": "../public/_nuxt/register.1876fe80.js.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-22T18:53:55.520Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-22T18:53:56.598Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-22T18:53:56.595Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/removeFavorite.c389ce31.js": {
    "type": "application/javascript",
    "etag": "\"3d2-2rXeShJRiK++JFeOfMpbMRX7mHU\"",
    "mtime": "2023-07-22T18:53:55.520Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.c389ce31.js"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-22T18:53:55.519Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-22T18:53:55.517Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-22T18:53:56.603Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-22T18:53:56.600Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-22T18:53:55.516Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-22T18:53:55.513Z",
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
