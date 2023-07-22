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
    "mtime": "2023-07-22T19:32:06.665Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-22T19:32:06.655Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/BasketInfo.bc4090fe.js": {
    "type": "application/javascript",
    "etag": "\"96e-S/YuvKzmamxSOEb3fNlOMeZVCog\"",
    "mtime": "2023-07-22T19:32:06.653Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.bc4090fe.js"
  },
  "/_nuxt/BasketInfo.bc4090fe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e5-fuNPbtEBNT4vdcPDP3nEZbHMtyI\"",
    "mtime": "2023-07-22T19:32:06.680Z",
    "size": 997,
    "path": "../public/_nuxt/BasketInfo.bc4090fe.js.br"
  },
  "/_nuxt/BasketInfo.bc4090fe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49b-ryUaG6/S+bCQr7E3Z1VwcD9L/9k\"",
    "mtime": "2023-07-22T19:32:06.668Z",
    "size": 1179,
    "path": "../public/_nuxt/BasketInfo.bc4090fe.js.gz"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-w6ZWAKEgVWOkc1fvPF8RCeGaC4Y\"",
    "mtime": "2023-07-22T19:32:06.653Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f5-n2VRrAMAtWDVYe3O6dSOW0xXYqw\"",
    "mtime": "2023-07-22T19:32:06.708Z",
    "size": 1781,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.br"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a8-N3A5Q2F+JopdZICKJCTPgwM2DvQ\"",
    "mtime": "2023-07-22T19:32:06.681Z",
    "size": 2472,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.gz"
  },
  "/_nuxt/CatalogProduct.02171d22.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d6a-zfnX3h2lBUJx+LVy1uqT8eJomwI\"",
    "mtime": "2023-07-22T19:32:06.652Z",
    "size": 7530,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css"
  },
  "/_nuxt/CatalogProduct.02171d22.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"654-qpdftA878CZH5Z5BbhpUZms4hRc\"",
    "mtime": "2023-07-22T19:32:06.717Z",
    "size": 1620,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.br"
  },
  "/_nuxt/CatalogProduct.02171d22.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"75d-k0BZggsPMxTlBNehk0MeZC2XVgk\"",
    "mtime": "2023-07-22T19:32:06.709Z",
    "size": 1885,
    "path": "../public/_nuxt/CatalogProduct.02171d22.css.gz"
  },
  "/_nuxt/CatalogProduct.657aa954.js": {
    "type": "application/javascript",
    "etag": "\"bea-WHJCcI+CGvinsLiJWY+yF5YGdR4\"",
    "mtime": "2023-07-22T19:32:06.652Z",
    "size": 3050,
    "path": "../public/_nuxt/CatalogProduct.657aa954.js"
  },
  "/_nuxt/CatalogProduct.657aa954.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4b5-J3E/91aRFHpzFGNkAFM+4zLSRJU\"",
    "mtime": "2023-07-22T19:32:06.722Z",
    "size": 1205,
    "path": "../public/_nuxt/CatalogProduct.657aa954.js.br"
  },
  "/_nuxt/CatalogProduct.657aa954.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"552-CiSYWDVBV6RO/DIgXeeMnc8OBMs\"",
    "mtime": "2023-07-22T19:32:06.718Z",
    "size": 1362,
    "path": "../public/_nuxt/CatalogProduct.657aa954.js.gz"
  },
  "/_nuxt/FavoriteComp.7a7ef01b.js": {
    "type": "application/javascript",
    "etag": "\"c46-p3CiOLXMFfljanNg4pfCGnPw3T0\"",
    "mtime": "2023-07-22T19:32:06.651Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.7a7ef01b.js"
  },
  "/_nuxt/FavoriteComp.7a7ef01b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3b8-ePGHce6jzNvCN9yeRUHisCbxlio\"",
    "mtime": "2023-07-22T19:32:06.727Z",
    "size": 952,
    "path": "../public/_nuxt/FavoriteComp.7a7ef01b.js.br"
  },
  "/_nuxt/FavoriteComp.7a7ef01b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"456-Sck0siV/ttpL2jABKKPRkZZ0T6w\"",
    "mtime": "2023-07-22T19:32:06.723Z",
    "size": 1110,
    "path": "../public/_nuxt/FavoriteComp.7a7ef01b.js.gz"
  },
  "/_nuxt/FavoriteComp.d10507f2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-c3cno65+JH2VQizEAUB4Imjik7w\"",
    "mtime": "2023-07-22T19:32:06.651Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fe-yHb/J0Uvuv63E/C42srrZLnk4Ow\"",
    "mtime": "2023-07-22T19:32:06.744Z",
    "size": 1534,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.br"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6Xkawk1MFTlzm7F+eEmnZa7mxag\"",
    "mtime": "2023-07-22T19:32:06.728Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.gz"
  },
  "/_nuxt/ImageForm.11221c0c.js": {
    "type": "application/javascript",
    "etag": "\"225-a7fRgerFAzk/cjWAwhLXMM4hcsk\"",
    "mtime": "2023-07-22T19:32:06.650Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.11221c0c.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-22T19:32:06.650Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/LoadingComp.f154d28f.js": {
    "type": "application/javascript",
    "etag": "\"1fe-zGbFSFarchp3NNn7MSg91kYrfjM\"",
    "mtime": "2023-07-22T19:32:06.649Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.f154d28f.js"
  },
  "/_nuxt/OrderProductList.3630c1d5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-YWr80UDyXOSYzU+Ijx8lm2W1K2c\"",
    "mtime": "2023-07-22T19:32:06.648Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1be-GHaQKDEThlXoglW1KGjvOJZOxKU\"",
    "mtime": "2023-07-22T19:32:06.748Z",
    "size": 446,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.br"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-dnvTg2fki6UxU5oYPO/E/HQ9apE\"",
    "mtime": "2023-07-22T19:32:06.746Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.gz"
  },
  "/_nuxt/OrderProductList.d4259252.js": {
    "type": "application/javascript",
    "etag": "\"459-vVGmLCtLl2jCjXiQmoe4QqurTBI\"",
    "mtime": "2023-07-22T19:32:06.648Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.d4259252.js"
  },
  "/_nuxt/OrderProductList.d4259252.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-/5kl9i+qHxy5KjLDrAMGLNY9qqM\"",
    "mtime": "2023-07-22T19:32:06.751Z",
    "size": 516,
    "path": "../public/_nuxt/OrderProductList.d4259252.js.br"
  },
  "/_nuxt/OrderProductList.d4259252.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23a-49SoBUltngoBPNVP16OdVTfrJAw\"",
    "mtime": "2023-07-22T19:32:06.748Z",
    "size": 570,
    "path": "../public/_nuxt/OrderProductList.d4259252.js.gz"
  },
  "/_nuxt/RatingComp.6ef7db93.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10a1-8Gfjt3dDrqWBoexscvy1WtgDnjY\"",
    "mtime": "2023-07-22T19:32:06.647Z",
    "size": 4257,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css"
  },
  "/_nuxt/RatingComp.6ef7db93.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3fc-4iJaxX8CPtl6qVS1TxMXC0P4wqQ\"",
    "mtime": "2023-07-22T19:32:06.756Z",
    "size": 1020,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.br"
  },
  "/_nuxt/RatingComp.6ef7db93.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4bb-StcXTlfNUGIOh2NgsdQDFVWeWLM\"",
    "mtime": "2023-07-22T19:32:06.751Z",
    "size": 1211,
    "path": "../public/_nuxt/RatingComp.6ef7db93.css.gz"
  },
  "/_nuxt/RatingComp.d7a0abbe.js": {
    "type": "application/javascript",
    "etag": "\"bac-Vr8/HxMUD8x1vUWeU1hukWA0Dxk\"",
    "mtime": "2023-07-22T19:32:06.647Z",
    "size": 2988,
    "path": "../public/_nuxt/RatingComp.d7a0abbe.js"
  },
  "/_nuxt/RatingComp.d7a0abbe.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d5-+8wWdX+JT2d2CRO715svfCfO/h0\"",
    "mtime": "2023-07-22T19:32:06.761Z",
    "size": 981,
    "path": "../public/_nuxt/RatingComp.d7a0abbe.js.br"
  },
  "/_nuxt/RatingComp.d7a0abbe.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"47a-ZgoWbxCtNqYLNexxUJLgXk7HG+0\"",
    "mtime": "2023-07-22T19:32:06.757Z",
    "size": 1146,
    "path": "../public/_nuxt/RatingComp.d7a0abbe.js.gz"
  },
  "/_nuxt/UserBasket.23f43b75.js": {
    "type": "application/javascript",
    "etag": "\"1410-HXfJZbNkuUC5A3QqvX+DGQDtaUM\"",
    "mtime": "2023-07-22T19:32:06.646Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.23f43b75.js"
  },
  "/_nuxt/UserBasket.23f43b75.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76f-CGlUV9ZKx9u0odBPx3QezhiPzfQ\"",
    "mtime": "2023-07-22T19:32:06.768Z",
    "size": 1903,
    "path": "../public/_nuxt/UserBasket.23f43b75.js.br"
  },
  "/_nuxt/UserBasket.23f43b75.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"890-Z6+3NQAC+u42JBLLK55SP08YVx0\"",
    "mtime": "2023-07-22T19:32:06.762Z",
    "size": 2192,
    "path": "../public/_nuxt/UserBasket.23f43b75.js.gz"
  },
  "/_nuxt/UserBasket.d26a50dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-kKYV+/VsLmXlyPvX/GIybQhwJGg\"",
    "mtime": "2023-07-22T19:32:06.646Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css"
  },
  "/_nuxt/UserBasket.d26a50dd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-dTjOi3ZlK6jAGp2mSk2qPUjLTiU\"",
    "mtime": "2023-07-22T19:32:06.785Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.br"
  },
  "/_nuxt/UserBasket.d26a50dd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-vnsR1nObKszggTaMRtQnIDCJJiQ\"",
    "mtime": "2023-07-22T19:32:06.769Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.gz"
  },
  "/_nuxt/_id_.5d9dcca9.js": {
    "type": "application/javascript",
    "etag": "\"1337-wf8kijFP1DZTnQcg1oyQo86jC5U\"",
    "mtime": "2023-07-22T19:32:06.645Z",
    "size": 4919,
    "path": "../public/_nuxt/_id_.5d9dcca9.js"
  },
  "/_nuxt/_id_.5d9dcca9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"757-sdfR+sRSP3LoGbJCarHCqpdpyNw\"",
    "mtime": "2023-07-22T19:32:06.791Z",
    "size": 1879,
    "path": "../public/_nuxt/_id_.5d9dcca9.js.br"
  },
  "/_nuxt/_id_.5d9dcca9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"843-8Ioy6/AxkejGihZE1ibvzdJMo5M\"",
    "mtime": "2023-07-22T19:32:06.786Z",
    "size": 2115,
    "path": "../public/_nuxt/_id_.5d9dcca9.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-22T19:32:06.645Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.c5e967dc.js": {
    "type": "application/javascript",
    "etag": "\"4be-ljv9u1PlCOfv/bhSEtFZMOhPopM\"",
    "mtime": "2023-07-22T19:32:06.644Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.c5e967dc.js"
  },
  "/_nuxt/_id_.c5e967dc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26a-R/ZEXOgzVCON4zsrcYHv2SevVHw\"",
    "mtime": "2023-07-22T19:32:06.795Z",
    "size": 618,
    "path": "../public/_nuxt/_id_.c5e967dc.js.br"
  },
  "/_nuxt/_id_.c5e967dc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2de-S595nk5+T6O/i4j3aZ4fPHkj1j8\"",
    "mtime": "2023-07-22T19:32:06.792Z",
    "size": 734,
    "path": "../public/_nuxt/_id_.c5e967dc.js.gz"
  },
  "/_nuxt/_id_.fcdf749d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-2EqCKqciSSwI2lRHEUMUCe7OJzE\"",
    "mtime": "2023-07-22T19:32:06.644Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.fcdf749d.css"
  },
  "/_nuxt/_id_.fcdf749d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-GUNstigloq87EJw9AtLlpGxijWs\"",
    "mtime": "2023-07-22T19:32:06.805Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.fcdf749d.css.br"
  },
  "/_nuxt/_id_.fcdf749d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56b-TChFx/M0UO8zV7biLqt+aZr60a4\"",
    "mtime": "2023-07-22T19:32:06.795Z",
    "size": 1387,
    "path": "../public/_nuxt/_id_.fcdf749d.css.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-22T19:32:06.643Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-22T19:32:06.812Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-22T19:32:06.805Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.e52d4afb.js": {
    "type": "application/javascript",
    "etag": "\"270-J1S1/dwzCUxXu/tAt2kDf7dk2Pg\"",
    "mtime": "2023-07-22T19:32:06.643Z",
    "size": 624,
    "path": "../public/_nuxt/basket.e52d4afb.js"
  },
  "/_nuxt/catalog.3d2ca8ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d3a-A3wj4wMi7Z2L4xkRT6vNwTYC7dk\"",
    "mtime": "2023-07-22T19:32:06.642Z",
    "size": 7482,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css"
  },
  "/_nuxt/catalog.3d2ca8ce.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a4-7yS8Mc3F3PqwU7Q9362NIX67es8\"",
    "mtime": "2023-07-22T19:32:06.821Z",
    "size": 1700,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.br"
  },
  "/_nuxt/catalog.3d2ca8ce.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b6-tA8LIgQFvv2jHunrlK5ztx/dbRQ\"",
    "mtime": "2023-07-22T19:32:06.813Z",
    "size": 1974,
    "path": "../public/_nuxt/catalog.3d2ca8ce.css.gz"
  },
  "/_nuxt/catalog.f329afa8.js": {
    "type": "application/javascript",
    "etag": "\"1c86-pLYrR+4x39vTsP0csKZTVbeWk0w\"",
    "mtime": "2023-07-22T19:32:06.642Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.f329afa8.js"
  },
  "/_nuxt/catalog.f329afa8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"987-uk58k7G+cb900p3OB9Eqo80xqnY\"",
    "mtime": "2023-07-22T19:32:06.833Z",
    "size": 2439,
    "path": "../public/_nuxt/catalog.f329afa8.js.br"
  },
  "/_nuxt/catalog.f329afa8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af7-RR1/FyuuUUsUAdZy5tc1+/feLac\"",
    "mtime": "2023-07-22T19:32:06.822Z",
    "size": 2807,
    "path": "../public/_nuxt/catalog.f329afa8.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-22T19:32:06.641Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.8e43b72a.js": {
    "type": "application/javascript",
    "etag": "\"147c2-hL2eFmVcdlV7t9WaMd0aMYljrkM\"",
    "mtime": "2023-07-22T19:32:06.641Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.8e43b72a.js"
  },
  "/_nuxt/checkout.8e43b72a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50d7-xHhagBz/2fNT1FHiYRhutnuVcdU\"",
    "mtime": "2023-07-22T19:32:06.934Z",
    "size": 20695,
    "path": "../public/_nuxt/checkout.8e43b72a.js.br"
  },
  "/_nuxt/checkout.8e43b72a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e01-rrVGYYAElW4KM9VqQ0163EHycq8\"",
    "mtime": "2023-07-22T19:32:06.837Z",
    "size": 24065,
    "path": "../public/_nuxt/checkout.8e43b72a.js.gz"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-22T19:32:06.640Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-22T19:32:07.050Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-22T19:32:06.937Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-22T19:32:06.639Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.26b6f8a2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"23e7-myExv8fF6uyVJOhrvB/927UTJFM\"",
    "mtime": "2023-07-22T19:32:06.638Z",
    "size": 9191,
    "path": "../public/_nuxt/entry.26b6f8a2.css"
  },
  "/_nuxt/entry.26b6f8a2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8c1-FGppXjQD20qfZFcfDfEEbFjNflQ\"",
    "mtime": "2023-07-22T19:32:07.061Z",
    "size": 2241,
    "path": "../public/_nuxt/entry.26b6f8a2.css.br"
  },
  "/_nuxt/entry.26b6f8a2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a16-ezpGWy9XflJUSKeVO4KsxQZCF+c\"",
    "mtime": "2023-07-22T19:32:07.051Z",
    "size": 2582,
    "path": "../public/_nuxt/entry.26b6f8a2.css.gz"
  },
  "/_nuxt/entry.8cb045ae.js": {
    "type": "application/javascript",
    "etag": "\"33ca2-8w+v6vK9PDigSPugPW0SQuPmZYs\"",
    "mtime": "2023-07-22T19:32:06.638Z",
    "size": 212130,
    "path": "../public/_nuxt/entry.8cb045ae.js"
  },
  "/_nuxt/entry.8cb045ae.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"115a1-JlyTnq07w3iyrQUQZ0SywnDu1A8\"",
    "mtime": "2023-07-22T19:32:07.399Z",
    "size": 71073,
    "path": "../public/_nuxt/entry.8cb045ae.js.br"
  },
  "/_nuxt/entry.8cb045ae.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1376c-aypZp4yHccxsEV/ZesvWsfmkRjk\"",
    "mtime": "2023-07-22T19:32:07.070Z",
    "size": 79724,
    "path": "../public/_nuxt/entry.8cb045ae.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-22T19:32:06.636Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-22T19:32:07.404Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-22T19:32:07.400Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.eb493831.js": {
    "type": "application/javascript",
    "etag": "\"8a4-eXLx8cV6n+OUYrUclAqU2Ig+H6g\"",
    "mtime": "2023-07-22T19:32:06.636Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.eb493831.js"
  },
  "/_nuxt/error-404.eb493831.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cd-QCEVLW3aUdBM0/ga91EgKOLnxzw\"",
    "mtime": "2023-07-22T19:32:07.408Z",
    "size": 973,
    "path": "../public/_nuxt/error-404.eb493831.js.br"
  },
  "/_nuxt/error-404.eb493831.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-f/HexinE62R0lN0hbSq//pLTHeg\"",
    "mtime": "2023-07-22T19:32:07.405Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.eb493831.js.gz"
  },
  "/_nuxt/error-500.38844dcd.js": {
    "type": "application/javascript",
    "etag": "\"757-c4SyAobOgBQjfAh5vnl1ab0Jg7A\"",
    "mtime": "2023-07-22T19:32:06.635Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.38844dcd.js"
  },
  "/_nuxt/error-500.38844dcd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34b-EZY0ctur5IgD7cX4kFJO/Tj35d4\"",
    "mtime": "2023-07-22T19:32:07.412Z",
    "size": 843,
    "path": "../public/_nuxt/error-500.38844dcd.js.br"
  },
  "/_nuxt/error-500.38844dcd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3da-E3qDZzHZduiiEfSMECjq6cbKTp0\"",
    "mtime": "2023-07-22T19:32:07.409Z",
    "size": 986,
    "path": "../public/_nuxt/error-500.38844dcd.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-22T19:32:06.635Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-22T19:32:07.415Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-22T19:32:07.412Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.1ce38d2e.js": {
    "type": "application/javascript",
    "etag": "\"45e-H4gPe8K1PjEeYOz+FtI9CP3HTZA\"",
    "mtime": "2023-07-22T19:32:06.635Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.1ce38d2e.js"
  },
  "/_nuxt/error-component.1ce38d2e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"206-KjhVlblmxwkQ65sMz1uugHF/TVw\"",
    "mtime": "2023-07-22T19:32:07.418Z",
    "size": 518,
    "path": "../public/_nuxt/error-component.1ce38d2e.js.br"
  },
  "/_nuxt/error-component.1ce38d2e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25f-Vx5wN7FfE5wSZZow+bAitk6u5LQ\"",
    "mtime": "2023-07-22T19:32:07.416Z",
    "size": 607,
    "path": "../public/_nuxt/error-component.1ce38d2e.js.gz"
  },
  "/_nuxt/favorite.48d634b8.js": {
    "type": "application/javascript",
    "etag": "\"a30-q5epxljHM1W9+1OOm8jwIwohQ6U\"",
    "mtime": "2023-07-22T19:32:06.634Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.48d634b8.js"
  },
  "/_nuxt/favorite.48d634b8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43a-FKDOeu63GeLV7JuMYpWvcEJBkzE\"",
    "mtime": "2023-07-22T19:32:07.422Z",
    "size": 1082,
    "path": "../public/_nuxt/favorite.48d634b8.js.br"
  },
  "/_nuxt/favorite.48d634b8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f3-H32ZJRfgApCOo4sTfUFe6bf55vM\"",
    "mtime": "2023-07-22T19:32:07.418Z",
    "size": 1267,
    "path": "../public/_nuxt/favorite.48d634b8.js.gz"
  },
  "/_nuxt/favorite.9698b33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-jhDWFpVpVzahIl7O9qpSFn1p+f4\"",
    "mtime": "2023-07-22T19:32:06.633Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.9698b33c.css"
  },
  "/_nuxt/favorite.9698b33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-+f85b17ph0gDk/2u4Tt397WrMHk\"",
    "mtime": "2023-07-22T19:32:07.430Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.9698b33c.css.br"
  },
  "/_nuxt/favorite.9698b33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"619-iFobUxJ0BHLodFh3SdPk8ubtENw\"",
    "mtime": "2023-07-22T19:32:07.423Z",
    "size": 1561,
    "path": "../public/_nuxt/favorite.9698b33c.css.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-22T19:32:06.633Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.127dd50b.js": {
    "type": "application/javascript",
    "etag": "\"5a0-pT9r2Pyy83TY5laK6K1eRwnLm+o\"",
    "mtime": "2023-07-22T19:32:06.632Z",
    "size": 1440,
    "path": "../public/_nuxt/index.127dd50b.js"
  },
  "/_nuxt/index.127dd50b.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2c6-Zoe3wH8u3ne3KyCN1SohBs7rhCE\"",
    "mtime": "2023-07-22T19:32:07.433Z",
    "size": 710,
    "path": "../public/_nuxt/index.127dd50b.js.br"
  },
  "/_nuxt/index.127dd50b.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"349-4rwqfrXdjPG5ji0z8R840iKcymI\"",
    "mtime": "2023-07-22T19:32:07.431Z",
    "size": 841,
    "path": "../public/_nuxt/index.127dd50b.js.gz"
  },
  "/_nuxt/index.16ce396e.js": {
    "type": "application/javascript",
    "etag": "\"3abf-czPWrM1GUjIPou+USMSJqFjspmg\"",
    "mtime": "2023-07-22T19:32:06.632Z",
    "size": 15039,
    "path": "../public/_nuxt/index.16ce396e.js"
  },
  "/_nuxt/index.16ce396e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f9-6X65blimepHDCU4F9fpJ8DEuC5E\"",
    "mtime": "2023-07-22T19:32:07.451Z",
    "size": 4857,
    "path": "../public/_nuxt/index.16ce396e.js.br"
  },
  "/_nuxt/index.16ce396e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f1-xvMZDzegVqU2kOMK9ZmRqSPm1BA\"",
    "mtime": "2023-07-22T19:32:07.434Z",
    "size": 5361,
    "path": "../public/_nuxt/index.16ce396e.js.gz"
  },
  "/_nuxt/index.70b1375b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-dg6IRU/Tv7b3jG2VRspHvhJags0\"",
    "mtime": "2023-07-22T19:32:06.631Z",
    "size": 22587,
    "path": "../public/_nuxt/index.70b1375b.css"
  },
  "/_nuxt/index.70b1375b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127c-7V7vXMm6KXvg6egfRE0UIaqsLxw\"",
    "mtime": "2023-07-22T19:32:07.479Z",
    "size": 4732,
    "path": "../public/_nuxt/index.70b1375b.css.br"
  },
  "/_nuxt/index.70b1375b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-zBMSMZ0U2xdit9OXRdi1Z33YwX8\"",
    "mtime": "2023-07-22T19:32:07.452Z",
    "size": 5602,
    "path": "../public/_nuxt/index.70b1375b.css.gz"
  },
  "/_nuxt/index.d0f9e747.js": {
    "type": "application/javascript",
    "etag": "\"16a71-BXxphDA9actZuJanuLYfbyxbaV0\"",
    "mtime": "2023-07-22T19:32:06.631Z",
    "size": 92785,
    "path": "../public/_nuxt/index.d0f9e747.js"
  },
  "/_nuxt/index.d0f9e747.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"62ea-Lr6Mwyvf2myMZfkYnb5+5+7JV6A\"",
    "mtime": "2023-07-22T19:32:07.591Z",
    "size": 25322,
    "path": "../public/_nuxt/index.d0f9e747.js.br"
  },
  "/_nuxt/index.d0f9e747.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f73-pD3OBvlObL07h25lZt3ewbDjQf8\"",
    "mtime": "2023-07-22T19:32:07.483Z",
    "size": 28531,
    "path": "../public/_nuxt/index.d0f9e747.js.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-22T19:32:06.630Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-22T19:32:07.596Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-22T19:32:07.592Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/isAuth.4f2ddd3a.js": {
    "type": "application/javascript",
    "etag": "\"213-YWCLYlXwBtnZcH8y6Q+iGbZCMZE\"",
    "mtime": "2023-07-22T19:32:06.629Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.4f2ddd3a.js"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-22T19:32:06.628Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-22T19:32:07.600Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-22T19:32:07.597Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/login.ba31a842.js": {
    "type": "application/javascript",
    "etag": "\"830-gsqZUEg6a8MTN/6zH5wvvZYUtc4\"",
    "mtime": "2023-07-22T19:32:06.628Z",
    "size": 2096,
    "path": "../public/_nuxt/login.ba31a842.js"
  },
  "/_nuxt/login.ba31a842.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3d9-12h2LxTnBFi00WsNORGBi2J4DYs\"",
    "mtime": "2023-07-22T19:32:07.604Z",
    "size": 985,
    "path": "../public/_nuxt/login.ba31a842.js.br"
  },
  "/_nuxt/login.ba31a842.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4a7-tNVLQaccktL7ONo3Q+JLJi/cHIo\"",
    "mtime": "2023-07-22T19:32:07.600Z",
    "size": 1191,
    "path": "../public/_nuxt/login.ba31a842.js.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-22T19:32:06.627Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.7ebbb5df.js": {
    "type": "application/javascript",
    "etag": "\"4af-1PrGEkwBYbAuG1WCySNUoirbjJs\"",
    "mtime": "2023-07-22T19:32:06.626Z",
    "size": 1199,
    "path": "../public/_nuxt/news.7ebbb5df.js"
  },
  "/_nuxt/news.7ebbb5df.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a7-8IE2eXr/2u8w5Py3ngDqM4nx6nE\"",
    "mtime": "2023-07-22T19:32:07.607Z",
    "size": 423,
    "path": "../public/_nuxt/news.7ebbb5df.js.br"
  },
  "/_nuxt/news.7ebbb5df.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-thXRvh8j7Lp2uKFWbrz+OgqEnSo\"",
    "mtime": "2023-07-22T19:32:07.605Z",
    "size": 535,
    "path": "../public/_nuxt/news.7ebbb5df.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-22T19:32:06.625Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.2f690e96.js": {
    "type": "application/javascript",
    "etag": "\"10a-wqjXbhNzP4kcG5TvUVuvYJTk9j8\"",
    "mtime": "2023-07-22T19:32:06.624Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.2f690e96.js"
  },
  "/_nuxt/orders.b23111a3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2599-3WO4r9iDaz0GXEG6YHpRx+dA5zg\"",
    "mtime": "2023-07-22T19:32:06.624Z",
    "size": 9625,
    "path": "../public/_nuxt/orders.b23111a3.css"
  },
  "/_nuxt/orders.b23111a3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"78b-DvXmO3aKW5YSeIFUTc75WGb8Q2k\"",
    "mtime": "2023-07-22T19:32:07.619Z",
    "size": 1931,
    "path": "../public/_nuxt/orders.b23111a3.css.br"
  },
  "/_nuxt/orders.b23111a3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8bf-9klhVOpoA3J18/wsrz2KrFn18Sw\"",
    "mtime": "2023-07-22T19:32:07.608Z",
    "size": 2239,
    "path": "../public/_nuxt/orders.b23111a3.css.gz"
  },
  "/_nuxt/orders.cfb0274d.js": {
    "type": "application/javascript",
    "etag": "\"1cb0-3XG63xC/7LQR6JtQ/UXIAXN8rIs\"",
    "mtime": "2023-07-22T19:32:06.623Z",
    "size": 7344,
    "path": "../public/_nuxt/orders.cfb0274d.js"
  },
  "/_nuxt/orders.cfb0274d.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"923-AF99cGj296/9HCNfmbPBxaJnMMM\"",
    "mtime": "2023-07-22T19:32:07.628Z",
    "size": 2339,
    "path": "../public/_nuxt/orders.cfb0274d.js.br"
  },
  "/_nuxt/orders.cfb0274d.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"aba-R691ub2Qq5Hveuz8rbBmR0FweCs\"",
    "mtime": "2023-07-22T19:32:07.620Z",
    "size": 2746,
    "path": "../public/_nuxt/orders.cfb0274d.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-22T19:32:06.604Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.26bef682.js": {
    "type": "application/javascript",
    "etag": "\"1241-xtbztu1u5FSCZsI3oYU9iqXIW1I\"",
    "mtime": "2023-07-22T19:32:06.603Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.26bef682.js"
  },
  "/_nuxt/profile.26bef682.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"70b-OxG9gtgVpl264Or7FOdIE16MCJw\"",
    "mtime": "2023-07-22T19:32:07.636Z",
    "size": 1803,
    "path": "../public/_nuxt/profile.26bef682.js.br"
  },
  "/_nuxt/profile.26bef682.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83f-+VZjQe+yOgOVHmZE3G2ElLf5QDo\"",
    "mtime": "2023-07-22T19:32:07.630Z",
    "size": 2111,
    "path": "../public/_nuxt/profile.26bef682.js.gz"
  },
  "/_nuxt/profile.5d2eb33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4ab0-8BeAMFdT90Jn71GUmLhhlEMrcj4\"",
    "mtime": "2023-07-22T19:32:06.603Z",
    "size": 19120,
    "path": "../public/_nuxt/profile.5d2eb33c.css"
  },
  "/_nuxt/profile.5d2eb33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6d2-0w1RZhTf3NIDDgOm8ZiGKU7eZmY\"",
    "mtime": "2023-07-22T19:32:07.662Z",
    "size": 1746,
    "path": "../public/_nuxt/profile.5d2eb33c.css.br"
  },
  "/_nuxt/profile.5d2eb33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"96d-Yvb/ix3eeUvneNdeKEitET6ccPg\"",
    "mtime": "2023-07-22T19:32:07.637Z",
    "size": 2413,
    "path": "../public/_nuxt/profile.5d2eb33c.css.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-22T19:32:06.602Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-22T19:32:07.666Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-22T19:32:07.663Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.390d3f34.js": {
    "type": "application/javascript",
    "etag": "\"1128-v3hQgdV/gPiAI1nThax6tYAu8BE\"",
    "mtime": "2023-07-22T19:32:06.602Z",
    "size": 4392,
    "path": "../public/_nuxt/register.390d3f34.js"
  },
  "/_nuxt/register.390d3f34.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"571-Q0HpZ60nxCfBELk3PErF+5mlVdM\"",
    "mtime": "2023-07-22T19:32:07.673Z",
    "size": 1393,
    "path": "../public/_nuxt/register.390d3f34.js.br"
  },
  "/_nuxt/register.390d3f34.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"695-wv/PD2rOcMhkAD2iG4dXNjOY8TI\"",
    "mtime": "2023-07-22T19:32:07.667Z",
    "size": 1685,
    "path": "../public/_nuxt/register.390d3f34.js.gz"
  },
  "/_nuxt/removeFavorite.3df10547.js": {
    "type": "application/javascript",
    "etag": "\"3d2-Sf8nrW28I8Gb4i30fwpFvDa0aCI\"",
    "mtime": "2023-07-22T19:32:06.601Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.3df10547.js"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-22T19:32:06.600Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-22T19:32:06.600Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-22T19:32:07.677Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-22T19:32:07.674Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-22T19:32:06.599Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-22T19:32:06.597Z",
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
