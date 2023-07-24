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
    "mtime": "2023-07-24T18:18:56.265Z",
    "size": 111708,
    "path": "../public/favicon.ico"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2023-07-24T18:18:56.256Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2023-07-24T18:18:56.254Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/BasketInfo.dcae0b9a.js": {
    "type": "application/javascript",
    "etag": "\"96e-9kqT1tAktBVFFnSMCiBawxD8VXQ\"",
    "mtime": "2023-07-24T18:18:56.254Z",
    "size": 2414,
    "path": "../public/_nuxt/BasketInfo.dcae0b9a.js"
  },
  "/_nuxt/BasketInfo.dcae0b9a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3e0-pywB6BHPHB+yAtvfXTPaaMejNEU\"",
    "mtime": "2023-07-24T18:18:56.278Z",
    "size": 992,
    "path": "../public/_nuxt/BasketInfo.dcae0b9a.js.br"
  },
  "/_nuxt/BasketInfo.dcae0b9a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"49c-RDbHuMyOJfmW8S3XV2P39KRnerY\"",
    "mtime": "2023-07-24T18:18:56.268Z",
    "size": 1180,
    "path": "../public/_nuxt/BasketInfo.dcae0b9a.js.gz"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-w6ZWAKEgVWOkc1fvPF8RCeGaC4Y\"",
    "mtime": "2023-07-24T18:18:56.253Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f5-n2VRrAMAtWDVYe3O6dSOW0xXYqw\"",
    "mtime": "2023-07-24T18:18:56.303Z",
    "size": 1781,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.br"
  },
  "/_nuxt/BasketInfo.e3d42eb7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9a8-N3A5Q2F+JopdZICKJCTPgwM2DvQ\"",
    "mtime": "2023-07-24T18:18:56.279Z",
    "size": 2472,
    "path": "../public/_nuxt/BasketInfo.e3d42eb7.css.gz"
  },
  "/_nuxt/CatalogProduct.82aeb3a4.js": {
    "type": "application/javascript",
    "etag": "\"bc6-/8uvxEmHafmhSZexNrl2q+DGvbo\"",
    "mtime": "2023-07-24T18:18:56.253Z",
    "size": 3014,
    "path": "../public/_nuxt/CatalogProduct.82aeb3a4.js"
  },
  "/_nuxt/CatalogProduct.82aeb3a4.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4af-opYNnfNnGJKFKxVw9jBx23XB98I\"",
    "mtime": "2023-07-24T18:18:56.308Z",
    "size": 1199,
    "path": "../public/_nuxt/CatalogProduct.82aeb3a4.js.br"
  },
  "/_nuxt/CatalogProduct.82aeb3a4.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"54d-v9HYPfmc943TePR/P+eQLC/AQmY\"",
    "mtime": "2023-07-24T18:18:56.304Z",
    "size": 1357,
    "path": "../public/_nuxt/CatalogProduct.82aeb3a4.js.gz"
  },
  "/_nuxt/CatalogProduct.c534e819.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1de4-BfxsaS9hQKfbyNQPjY58GVmhZ1I\"",
    "mtime": "2023-07-24T18:18:56.252Z",
    "size": 7652,
    "path": "../public/_nuxt/CatalogProduct.c534e819.css"
  },
  "/_nuxt/CatalogProduct.c534e819.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"672-31eNv3u7Lonhv+DGEsq/YdYeMrc\"",
    "mtime": "2023-07-24T18:18:56.317Z",
    "size": 1650,
    "path": "../public/_nuxt/CatalogProduct.c534e819.css.br"
  },
  "/_nuxt/CatalogProduct.c534e819.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"774-hbaRNTuIxW7FKvt5PZWmE2sDIKE\"",
    "mtime": "2023-07-24T18:18:56.309Z",
    "size": 1908,
    "path": "../public/_nuxt/CatalogProduct.c534e819.css.gz"
  },
  "/_nuxt/FavoriteComp.3202e4b6.js": {
    "type": "application/javascript",
    "etag": "\"c46-t1nf55mGbVz1RKCBHQhOQfzOsAM\"",
    "mtime": "2023-07-24T18:18:56.252Z",
    "size": 3142,
    "path": "../public/_nuxt/FavoriteComp.3202e4b6.js"
  },
  "/_nuxt/FavoriteComp.3202e4b6.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3b9-FYCrNCRDR/JPKNBxmUnkPGmTTOM\"",
    "mtime": "2023-07-24T18:18:56.322Z",
    "size": 953,
    "path": "../public/_nuxt/FavoriteComp.3202e4b6.js.br"
  },
  "/_nuxt/FavoriteComp.3202e4b6.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"457-UKgeRSPubC/xHKuI9WGk7wGT4KU\"",
    "mtime": "2023-07-24T18:18:56.318Z",
    "size": 1111,
    "path": "../public/_nuxt/FavoriteComp.3202e4b6.js.gz"
  },
  "/_nuxt/FavoriteComp.d10507f2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-c3cno65+JH2VQizEAUB4Imjik7w\"",
    "mtime": "2023-07-24T18:18:56.251Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fe-yHb/J0Uvuv63E/C42srrZLnk4Ow\"",
    "mtime": "2023-07-24T18:18:56.338Z",
    "size": 1534,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.br"
  },
  "/_nuxt/FavoriteComp.d10507f2.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6Xkawk1MFTlzm7F+eEmnZa7mxag\"",
    "mtime": "2023-07-24T18:18:56.323Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.d10507f2.css.gz"
  },
  "/_nuxt/ImageForm.a6e18b99.js": {
    "type": "application/javascript",
    "etag": "\"225-mFy+SnHYHaW964U4HkTt2ip9WkQ\"",
    "mtime": "2023-07-24T18:18:56.251Z",
    "size": 549,
    "path": "../public/_nuxt/ImageForm.a6e18b99.js"
  },
  "/_nuxt/LoadingComp.c4ab8a44.js": {
    "type": "application/javascript",
    "etag": "\"1fe-AUt6m4AWGf7Lzt5cmF0tS9y1aZ4\"",
    "mtime": "2023-07-24T18:18:56.250Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.c4ab8a44.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2023-07-24T18:18:56.250Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-YWr80UDyXOSYzU+Ijx8lm2W1K2c\"",
    "mtime": "2023-07-24T18:18:56.249Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1be-GHaQKDEThlXoglW1KGjvOJZOxKU\"",
    "mtime": "2023-07-24T18:18:56.342Z",
    "size": 446,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.br"
  },
  "/_nuxt/OrderProductList.3630c1d5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23c-dnvTg2fki6UxU5oYPO/E/HQ9apE\"",
    "mtime": "2023-07-24T18:18:56.340Z",
    "size": 572,
    "path": "../public/_nuxt/OrderProductList.3630c1d5.css.gz"
  },
  "/_nuxt/OrderProductList.40248f14.js": {
    "type": "application/javascript",
    "etag": "\"459-y8VIxSzZaDAc0QeHnGe3oCm6zzw\"",
    "mtime": "2023-07-24T18:18:56.249Z",
    "size": 1113,
    "path": "../public/_nuxt/OrderProductList.40248f14.js"
  },
  "/_nuxt/OrderProductList.40248f14.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"205-Vl74Zv7YZbzad0kjVkljKv8Z8X0\"",
    "mtime": "2023-07-24T18:18:56.345Z",
    "size": 517,
    "path": "../public/_nuxt/OrderProductList.40248f14.js.br"
  },
  "/_nuxt/OrderProductList.40248f14.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"23a-4U9nimYidAG/qgQXLKaElc7AUjQ\"",
    "mtime": "2023-07-24T18:18:56.343Z",
    "size": 570,
    "path": "../public/_nuxt/OrderProductList.40248f14.js.gz"
  },
  "/_nuxt/RatingComp.3e0d76e4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1146-EWyB4l4MSTKrG0HL4XpWMJOcjPU\"",
    "mtime": "2023-07-24T18:18:56.248Z",
    "size": 4422,
    "path": "../public/_nuxt/RatingComp.3e0d76e4.css"
  },
  "/_nuxt/RatingComp.3e0d76e4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"41e-dt2FoswbFSqfcQTVChKgPRACMfE\"",
    "mtime": "2023-07-24T18:18:56.351Z",
    "size": 1054,
    "path": "../public/_nuxt/RatingComp.3e0d76e4.css.br"
  },
  "/_nuxt/RatingComp.3e0d76e4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4e3-QARpITDH40ypMcWMBZ1PNjcttYA\"",
    "mtime": "2023-07-24T18:18:56.346Z",
    "size": 1251,
    "path": "../public/_nuxt/RatingComp.3e0d76e4.css.gz"
  },
  "/_nuxt/RatingComp.e44732f8.js": {
    "type": "application/javascript",
    "etag": "\"b90-9hG//GStdrjNAy4v/UTGIMuoEhY\"",
    "mtime": "2023-07-24T18:18:56.248Z",
    "size": 2960,
    "path": "../public/_nuxt/RatingComp.e44732f8.js"
  },
  "/_nuxt/RatingComp.e44732f8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3ce-v46NcBrqojVqqZ0TG6uyncweUBk\"",
    "mtime": "2023-07-24T18:18:56.356Z",
    "size": 974,
    "path": "../public/_nuxt/RatingComp.e44732f8.js.br"
  },
  "/_nuxt/RatingComp.e44732f8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"45f-EeW3YKmQDJ6scdS00deenjfGY9M\"",
    "mtime": "2023-07-24T18:18:56.351Z",
    "size": 1119,
    "path": "../public/_nuxt/RatingComp.e44732f8.js.gz"
  },
  "/_nuxt/UserBasket.a7b5d374.js": {
    "type": "application/javascript",
    "etag": "\"1410-1odgqH9kj5u1cSJt7AVBZFtbJlM\"",
    "mtime": "2023-07-24T18:18:56.247Z",
    "size": 5136,
    "path": "../public/_nuxt/UserBasket.a7b5d374.js"
  },
  "/_nuxt/UserBasket.a7b5d374.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"76f-TkB5jGngIgVFUsHcgMXK4dyaVCo\"",
    "mtime": "2023-07-24T18:18:56.362Z",
    "size": 1903,
    "path": "../public/_nuxt/UserBasket.a7b5d374.js.br"
  },
  "/_nuxt/UserBasket.a7b5d374.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"891-KwlfhkjAA7grJG/R7eoWp5p3Ho4\"",
    "mtime": "2023-07-24T18:18:56.356Z",
    "size": 2193,
    "path": "../public/_nuxt/UserBasket.a7b5d374.js.gz"
  },
  "/_nuxt/UserBasket.d26a50dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"346e-kKYV+/VsLmXlyPvX/GIybQhwJGg\"",
    "mtime": "2023-07-24T18:18:56.247Z",
    "size": 13422,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css"
  },
  "/_nuxt/UserBasket.d26a50dd.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"688-dTjOi3ZlK6jAGp2mSk2qPUjLTiU\"",
    "mtime": "2023-07-24T18:18:56.379Z",
    "size": 1672,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.br"
  },
  "/_nuxt/UserBasket.d26a50dd.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"865-vnsR1nObKszggTaMRtQnIDCJJiQ\"",
    "mtime": "2023-07-24T18:18:56.363Z",
    "size": 2149,
    "path": "../public/_nuxt/UserBasket.d26a50dd.css.gz"
  },
  "/_nuxt/_id_.4b035cb9.js": {
    "type": "application/javascript",
    "etag": "\"4be-kLBB5CfRbWmaiZt1o3IOA9lDupA\"",
    "mtime": "2023-07-24T18:18:56.246Z",
    "size": 1214,
    "path": "../public/_nuxt/_id_.4b035cb9.js"
  },
  "/_nuxt/_id_.4b035cb9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"26b-MowNXulgVq/DNwsuUOwIetie2Eo\"",
    "mtime": "2023-07-24T18:18:56.382Z",
    "size": 619,
    "path": "../public/_nuxt/_id_.4b035cb9.js.br"
  },
  "/_nuxt/_id_.4b035cb9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2de-ei0OeesA7saLUzr+QQs1v1aTJUk\"",
    "mtime": "2023-07-24T18:18:56.380Z",
    "size": 734,
    "path": "../public/_nuxt/_id_.4b035cb9.js.gz"
  },
  "/_nuxt/_id_.912eb908.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-oQGki+2rmcvZFKINzt18uEm0zWg\"",
    "mtime": "2023-07-24T18:18:56.246Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.912eb908.css"
  },
  "/_nuxt/_id_.deee9292.js": {
    "type": "application/javascript",
    "etag": "\"1337-1Q8Qi6TQeFv29YuMch8uaiefpWs\"",
    "mtime": "2023-07-24T18:18:56.245Z",
    "size": 4919,
    "path": "../public/_nuxt/_id_.deee9292.js"
  },
  "/_nuxt/_id_.deee9292.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"758-EAWdhwKxy8lL7TpUiL6VmOw2Lqg\"",
    "mtime": "2023-07-24T18:18:56.389Z",
    "size": 1880,
    "path": "../public/_nuxt/_id_.deee9292.js.br"
  },
  "/_nuxt/_id_.deee9292.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"845-8rY1cM4lkps7jF/tg2dtklcI8Q8\"",
    "mtime": "2023-07-24T18:18:56.383Z",
    "size": 2117,
    "path": "../public/_nuxt/_id_.deee9292.js.gz"
  },
  "/_nuxt/_id_.fcdf749d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c8d-2EqCKqciSSwI2lRHEUMUCe7OJzE\"",
    "mtime": "2023-07-24T18:18:56.244Z",
    "size": 7309,
    "path": "../public/_nuxt/_id_.fcdf749d.css"
  },
  "/_nuxt/_id_.fcdf749d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"461-GUNstigloq87EJw9AtLlpGxijWs\"",
    "mtime": "2023-07-24T18:18:56.399Z",
    "size": 1121,
    "path": "../public/_nuxt/_id_.fcdf749d.css.br"
  },
  "/_nuxt/_id_.fcdf749d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"56b-TChFx/M0UO8zV7biLqt+aZr60a4\"",
    "mtime": "2023-07-24T18:18:56.390Z",
    "size": 1387,
    "path": "../public/_nuxt/_id_.fcdf749d.css.gz"
  },
  "/_nuxt/basket.3ccf7da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-RTSwmvWZWTQGP6TItC07mSSTODA\"",
    "mtime": "2023-07-24T18:18:56.244Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.3ccf7da5.css"
  },
  "/_nuxt/basket.3ccf7da5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-OVBTYPqGae0hwkm4RONAUtAtfLw\"",
    "mtime": "2023-07-24T18:18:56.406Z",
    "size": 1280,
    "path": "../public/_nuxt/basket.3ccf7da5.css.br"
  },
  "/_nuxt/basket.3ccf7da5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e0-I5yATiIwPWoViiPhMOrXkG9ao5I\"",
    "mtime": "2023-07-24T18:18:56.400Z",
    "size": 1504,
    "path": "../public/_nuxt/basket.3ccf7da5.css.gz"
  },
  "/_nuxt/basket.5c339c86.js": {
    "type": "application/javascript",
    "etag": "\"270-vVTQDXIC+nf22laAS1W1+MW72wY\"",
    "mtime": "2023-07-24T18:18:56.243Z",
    "size": 624,
    "path": "../public/_nuxt/basket.5c339c86.js"
  },
  "/_nuxt/catalog.43f252d0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1db4-XSXz58wEw/AQZpnigaR/BfxXtvU\"",
    "mtime": "2023-07-24T18:18:56.243Z",
    "size": 7604,
    "path": "../public/_nuxt/catalog.43f252d0.css"
  },
  "/_nuxt/catalog.43f252d0.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6c0-+az4Md4D5gcndYSilZ0SEUaCJiE\"",
    "mtime": "2023-07-24T18:18:56.415Z",
    "size": 1728,
    "path": "../public/_nuxt/catalog.43f252d0.css.br"
  },
  "/_nuxt/catalog.43f252d0.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7cd-GB7GZjUT2D/iQKbqzJfm0/laXoU\"",
    "mtime": "2023-07-24T18:18:56.407Z",
    "size": 1997,
    "path": "../public/_nuxt/catalog.43f252d0.css.gz"
  },
  "/_nuxt/catalog.94e4bd41.js": {
    "type": "application/javascript",
    "etag": "\"1c86-WEBh8dVCNn9TzwQqmwR6kNGaW9w\"",
    "mtime": "2023-07-24T18:18:56.242Z",
    "size": 7302,
    "path": "../public/_nuxt/catalog.94e4bd41.js"
  },
  "/_nuxt/catalog.94e4bd41.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"98c-3ucNb0NcT5oG8Jz1tVVWrDwQpdc\"",
    "mtime": "2023-07-24T18:18:56.424Z",
    "size": 2444,
    "path": "../public/_nuxt/catalog.94e4bd41.js.br"
  },
  "/_nuxt/catalog.94e4bd41.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"af7-o8rGut5Oofg5OmNtmeZXILE2fKw\"",
    "mtime": "2023-07-24T18:18:56.415Z",
    "size": 2807,
    "path": "../public/_nuxt/catalog.94e4bd41.js.gz"
  },
  "/_nuxt/catalog_icon_215654.7a90f4ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-07-24T18:18:56.242Z",
    "size": 569,
    "path": "../public/_nuxt/catalog_icon_215654.7a90f4ca.svg"
  },
  "/_nuxt/checkout.5b1b9564.js": {
    "type": "application/javascript",
    "etag": "\"147c2-TvE1B8a9d/1lxjBDSEq8TViScFA\"",
    "mtime": "2023-07-24T18:18:56.241Z",
    "size": 83906,
    "path": "../public/_nuxt/checkout.5b1b9564.js"
  },
  "/_nuxt/checkout.5b1b9564.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"50b5-mwHZxUMqJjYPfAgd8FB+rVtV4sA\"",
    "mtime": "2023-07-24T18:18:56.520Z",
    "size": 20661,
    "path": "../public/_nuxt/checkout.5b1b9564.js.br"
  },
  "/_nuxt/checkout.5b1b9564.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5e02-zzMs5IYl2a3MbHkHb3YIb+LRUvQ\"",
    "mtime": "2023-07-24T18:18:56.427Z",
    "size": 24066,
    "path": "../public/_nuxt/checkout.5b1b9564.js.gz"
  },
  "/_nuxt/checkout.ea1e30bf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"261a0-+JLitkZ3rUpOxdWkqHNs4MdBFwQ\"",
    "mtime": "2023-07-24T18:18:56.241Z",
    "size": 156064,
    "path": "../public/_nuxt/checkout.ea1e30bf.css"
  },
  "/_nuxt/checkout.ea1e30bf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4f99-4Cyy+9eAFJ0EsU3MVH5IfjZMxjo\"",
    "mtime": "2023-07-24T18:18:56.633Z",
    "size": 20377,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.br"
  },
  "/_nuxt/checkout.ea1e30bf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6017-MOErXxhFO5jsIco6sWZ9BJNd5z4\"",
    "mtime": "2023-07-24T18:18:56.523Z",
    "size": 24599,
    "path": "../public/_nuxt/checkout.ea1e30bf.css.gz"
  },
  "/_nuxt/eco-friend.3cab6412.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-07-24T18:18:56.240Z",
    "size": 118678,
    "path": "../public/_nuxt/eco-friend.3cab6412.jpg"
  },
  "/_nuxt/entry.233c9803.js": {
    "type": "application/javascript",
    "etag": "\"33e91-o8CziDu7JoO+IWaUbXHNNTjvLgo\"",
    "mtime": "2023-07-24T18:18:56.238Z",
    "size": 212625,
    "path": "../public/_nuxt/entry.233c9803.js"
  },
  "/_nuxt/entry.233c9803.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"11652-u37qGDXmSD6on9nkk/bxgz+KGvs\"",
    "mtime": "2023-07-24T18:18:56.967Z",
    "size": 71250,
    "path": "../public/_nuxt/entry.233c9803.js.br"
  },
  "/_nuxt/entry.233c9803.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"1386d-eaLQbmOhwyDBhq6DoIxd3IpN6UQ\"",
    "mtime": "2023-07-24T18:18:56.642Z",
    "size": 79981,
    "path": "../public/_nuxt/entry.233c9803.js.gz"
  },
  "/_nuxt/entry.519a73b3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"23d6-VJbFLkWsLlhgPNCdqU4ixqMnqNI\"",
    "mtime": "2023-07-24T18:18:56.236Z",
    "size": 9174,
    "path": "../public/_nuxt/entry.519a73b3.css"
  },
  "/_nuxt/entry.519a73b3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8cc-KT8DsdtOHAAJXGxAg/cOez0qbTU\"",
    "mtime": "2023-07-24T18:18:56.977Z",
    "size": 2252,
    "path": "../public/_nuxt/entry.519a73b3.css.br"
  },
  "/_nuxt/entry.519a73b3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a29-IVS+qBmyC0LhVGEysb+KdEW+4bs\"",
    "mtime": "2023-07-24T18:18:56.968Z",
    "size": 2601,
    "path": "../public/_nuxt/entry.519a73b3.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-24T18:18:56.235Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2023-07-24T18:18:56.983Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-z5oOZ+Gi6a2WxNDAE518vWyYoK8\"",
    "mtime": "2023-07-24T18:18:56.978Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.a886ae41.js": {
    "type": "application/javascript",
    "etag": "\"8a4-f0SwQ0eOFezzxx6+S0jJzyuNyMw\"",
    "mtime": "2023-07-24T18:18:56.234Z",
    "size": 2212,
    "path": "../public/_nuxt/error-404.a886ae41.js"
  },
  "/_nuxt/error-404.a886ae41.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cf-8ZiBPWWHZaIcId6ifegXEJcuDRM\"",
    "mtime": "2023-07-24T18:18:56.986Z",
    "size": 975,
    "path": "../public/_nuxt/error-404.a886ae41.js.br"
  },
  "/_nuxt/error-404.a886ae41.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"475-lQR0sInlEmg/J4FAQGuVBrPzOVo\"",
    "mtime": "2023-07-24T18:18:56.983Z",
    "size": 1141,
    "path": "../public/_nuxt/error-404.a886ae41.js.gz"
  },
  "/_nuxt/error-500.2fcb9484.js": {
    "type": "application/javascript",
    "etag": "\"757-p3RNZM7ICAuCn1EcxSDS2uv7n94\"",
    "mtime": "2023-07-24T18:18:56.233Z",
    "size": 1879,
    "path": "../public/_nuxt/error-500.2fcb9484.js"
  },
  "/_nuxt/error-500.2fcb9484.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"34d-cwC5arXJ6UmjQIla7NB2n+y5Hxw\"",
    "mtime": "2023-07-24T18:18:56.990Z",
    "size": 845,
    "path": "../public/_nuxt/error-500.2fcb9484.js.br"
  },
  "/_nuxt/error-500.2fcb9484.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-YEhXFbpgCfi/bthFOBYSoZfvi+s\"",
    "mtime": "2023-07-24T18:18:56.987Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.2fcb9484.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-24T18:18:56.233Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2023-07-24T18:18:56.993Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-eP+O3+itG2vSGIOvYf5NHQYP4H0\"",
    "mtime": "2023-07-24T18:18:56.991Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-component.c8568ab5.js": {
    "type": "application/javascript",
    "etag": "\"45e-u71BdTfuzTenzrD00SAGKE3lP2o\"",
    "mtime": "2023-07-24T18:18:56.232Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.c8568ab5.js"
  },
  "/_nuxt/error-component.c8568ab5.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"208-SJg3afPbvuohUjIz+xLAE01ANqk\"",
    "mtime": "2023-07-24T18:18:56.996Z",
    "size": 520,
    "path": "../public/_nuxt/error-component.c8568ab5.js.br"
  },
  "/_nuxt/error-component.c8568ab5.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"260-G4OFj5iyfo86L9exHyYcS6bHqJg\"",
    "mtime": "2023-07-24T18:18:56.994Z",
    "size": 608,
    "path": "../public/_nuxt/error-component.c8568ab5.js.gz"
  },
  "/_nuxt/favorite.5f67cd4e.js": {
    "type": "application/javascript",
    "etag": "\"a30-AF93BR9yqPH3piwBOQYcRCm9X7o\"",
    "mtime": "2023-07-24T18:18:56.231Z",
    "size": 2608,
    "path": "../public/_nuxt/favorite.5f67cd4e.js"
  },
  "/_nuxt/favorite.5f67cd4e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"43b-3DH6I1g+AShPMxz3uC8CzF+0eKs\"",
    "mtime": "2023-07-24T18:18:57.000Z",
    "size": 1083,
    "path": "../public/_nuxt/favorite.5f67cd4e.js.br"
  },
  "/_nuxt/favorite.5f67cd4e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4f4-C5ouJcXTYbOE0hPgYO4q1ri2YIA\"",
    "mtime": "2023-07-24T18:18:56.997Z",
    "size": 1268,
    "path": "../public/_nuxt/favorite.5f67cd4e.js.gz"
  },
  "/_nuxt/favorite.9698b33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-jhDWFpVpVzahIl7O9qpSFn1p+f4\"",
    "mtime": "2023-07-24T18:18:56.230Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.9698b33c.css"
  },
  "/_nuxt/favorite.9698b33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"529-+f85b17ph0gDk/2u4Tt397WrMHk\"",
    "mtime": "2023-07-24T18:18:57.008Z",
    "size": 1321,
    "path": "../public/_nuxt/favorite.9698b33c.css.br"
  },
  "/_nuxt/favorite.9698b33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"619-iFobUxJ0BHLodFh3SdPk8ubtENw\"",
    "mtime": "2023-07-24T18:18:57.001Z",
    "size": 1561,
    "path": "../public/_nuxt/favorite.9698b33c.css.gz"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2023-07-24T18:18:56.230Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/index.1dd0d23e.js": {
    "type": "application/javascript",
    "etag": "\"3abf-PS9TXoCm1LeMDT9MXkbcqPWjZjU\"",
    "mtime": "2023-07-24T18:18:56.228Z",
    "size": 15039,
    "path": "../public/_nuxt/index.1dd0d23e.js"
  },
  "/_nuxt/index.1dd0d23e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12f2-w8ECnBXJY5dilA25iHY+pgvXRfQ\"",
    "mtime": "2023-07-24T18:18:57.025Z",
    "size": 4850,
    "path": "../public/_nuxt/index.1dd0d23e.js.br"
  },
  "/_nuxt/index.1dd0d23e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-Di+z2INnib6Ha8mB6pCFnX8o2/U\"",
    "mtime": "2023-07-24T18:18:57.009Z",
    "size": 5362,
    "path": "../public/_nuxt/index.1dd0d23e.js.gz"
  },
  "/_nuxt/index.47086160.js": {
    "type": "application/javascript",
    "etag": "\"16a71-te8W2NbF/MR20MTXyUCCW0i9tmw\"",
    "mtime": "2023-07-24T18:18:56.227Z",
    "size": 92785,
    "path": "../public/_nuxt/index.47086160.js"
  },
  "/_nuxt/index.47086160.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6300-8ASlMVcuPqYNGtg3niRGlhdcBqs\"",
    "mtime": "2023-07-24T18:18:57.127Z",
    "size": 25344,
    "path": "../public/_nuxt/index.47086160.js.br"
  },
  "/_nuxt/index.47086160.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f75-yXpZA9qCWgRGiNSHwn6zL0XRCgs\"",
    "mtime": "2023-07-24T18:18:57.028Z",
    "size": 28533,
    "path": "../public/_nuxt/index.47086160.js.gz"
  },
  "/_nuxt/index.70b1375b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"583b-dg6IRU/Tv7b3jG2VRspHvhJags0\"",
    "mtime": "2023-07-24T18:18:56.226Z",
    "size": 22587,
    "path": "../public/_nuxt/index.70b1375b.css"
  },
  "/_nuxt/index.70b1375b.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"127c-7V7vXMm6KXvg6egfRE0UIaqsLxw\"",
    "mtime": "2023-07-24T18:18:57.153Z",
    "size": 4732,
    "path": "../public/_nuxt/index.70b1375b.css.br"
  },
  "/_nuxt/index.70b1375b.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"15e2-zBMSMZ0U2xdit9OXRdi1Z33YwX8\"",
    "mtime": "2023-07-24T18:18:57.128Z",
    "size": 5602,
    "path": "../public/_nuxt/index.70b1375b.css.gz"
  },
  "/_nuxt/index.d81457e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-FI3dOe2xg0myrjl7B2j/FBLprFQ\"",
    "mtime": "2023-07-24T18:18:56.225Z",
    "size": 2616,
    "path": "../public/_nuxt/index.d81457e9.css"
  },
  "/_nuxt/index.d81457e9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d1-W0Cc88NK//DiR01v3qWyg6eZCIA\"",
    "mtime": "2023-07-24T18:18:57.157Z",
    "size": 721,
    "path": "../public/_nuxt/index.d81457e9.css.br"
  },
  "/_nuxt/index.d81457e9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-VU7SnjMECFeDNzfFjKY7JuFverI\"",
    "mtime": "2023-07-24T18:18:57.154Z",
    "size": 889,
    "path": "../public/_nuxt/index.d81457e9.css.gz"
  },
  "/_nuxt/index.f06a1eb8.js": {
    "type": "application/javascript",
    "etag": "\"5a0-uz6dtSW/kKAcjluTB6kscZ9D0oU\"",
    "mtime": "2023-07-24T18:18:56.224Z",
    "size": 1440,
    "path": "../public/_nuxt/index.f06a1eb8.js"
  },
  "/_nuxt/index.f06a1eb8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2c8-oBXVjP8rDOcUtxmdXSzaFxwmPH4\"",
    "mtime": "2023-07-24T18:18:57.161Z",
    "size": 712,
    "path": "../public/_nuxt/index.f06a1eb8.js.br"
  },
  "/_nuxt/index.f06a1eb8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"34a-AwwtqZ3aJM0/nVv8i0QyHQovp8Y\"",
    "mtime": "2023-07-24T18:18:57.158Z",
    "size": 842,
    "path": "../public/_nuxt/index.f06a1eb8.js.gz"
  },
  "/_nuxt/isAuth.ff974f7d.js": {
    "type": "application/javascript",
    "etag": "\"213-nm5eLNuqmkqI6Jd8nsyBlrw1BfA\"",
    "mtime": "2023-07-24T18:18:56.223Z",
    "size": 531,
    "path": "../public/_nuxt/isAuth.ff974f7d.js"
  },
  "/_nuxt/login.50dc864a.js": {
    "type": "application/javascript",
    "etag": "\"830-Zh5uOw7YJfZ6uRxchdExR9Jmr9Q\"",
    "mtime": "2023-07-24T18:18:56.222Z",
    "size": 2096,
    "path": "../public/_nuxt/login.50dc864a.js"
  },
  "/_nuxt/login.50dc864a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3da-lOdh1A5COg1bSl/mnMkEsfZmtic\"",
    "mtime": "2023-07-24T18:18:57.165Z",
    "size": 986,
    "path": "../public/_nuxt/login.50dc864a.js.br"
  },
  "/_nuxt/login.50dc864a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4aa-OJJ8Kfxco7MWmf6JnhFX3NZCzv4\"",
    "mtime": "2023-07-24T18:18:57.161Z",
    "size": 1194,
    "path": "../public/_nuxt/login.50dc864a.js.gz"
  },
  "/_nuxt/login.6d5b206c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-xbTn2KBzpYkCbXGUQUmKOGJmlXg\"",
    "mtime": "2023-07-24T18:18:56.221Z",
    "size": 2199,
    "path": "../public/_nuxt/login.6d5b206c.css"
  },
  "/_nuxt/login.6d5b206c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25a-5BnNkv4F0u2A620UgueX057SU5U\"",
    "mtime": "2023-07-24T18:18:57.168Z",
    "size": 602,
    "path": "../public/_nuxt/login.6d5b206c.css.br"
  },
  "/_nuxt/login.6d5b206c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"307-W7WzCBpY0eRnes9BSk4ni26TMrc\"",
    "mtime": "2023-07-24T18:18:57.165Z",
    "size": 775,
    "path": "../public/_nuxt/login.6d5b206c.css.gz"
  },
  "/_nuxt/main.d41752ea.jpeg": {
    "type": "image/jpeg",
    "etag": "\"506a3-cBs/Hm+TmMDNtpZJZ2a4OIPKw1U\"",
    "mtime": "2023-07-24T18:18:56.220Z",
    "size": 329379,
    "path": "../public/_nuxt/main.d41752ea.jpeg"
  },
  "/_nuxt/news.1897696c.js": {
    "type": "application/javascript",
    "etag": "\"4af-zR7NdKKgJEIIfk8XtOjosM2s0P4\"",
    "mtime": "2023-07-24T18:18:56.217Z",
    "size": 1199,
    "path": "../public/_nuxt/news.1897696c.js"
  },
  "/_nuxt/news.1897696c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1a9-xnXbTkiJKBzn+QJkDlLfadz/mtY\"",
    "mtime": "2023-07-24T18:18:57.171Z",
    "size": 425,
    "path": "../public/_nuxt/news.1897696c.js.br"
  },
  "/_nuxt/news.1897696c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"217-Kzxp2yk3arN5c9tBWW82cSr0ThM\"",
    "mtime": "2023-07-24T18:18:57.169Z",
    "size": 535,
    "path": "../public/_nuxt/news.1897696c.js.gz"
  },
  "/_nuxt/news.f27aa736.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"195-TBMTIpL5BJ6e+6R7I3LSIFQ6Ybs\"",
    "mtime": "2023-07-24T18:18:56.217Z",
    "size": 405,
    "path": "../public/_nuxt/news.f27aa736.css"
  },
  "/_nuxt/newsList.296478ee.js": {
    "type": "application/javascript",
    "etag": "\"10a-aUjHsMfxpNd7VkZeTm6r3YyR+hc\"",
    "mtime": "2023-07-24T18:18:56.216Z",
    "size": 266,
    "path": "../public/_nuxt/newsList.296478ee.js"
  },
  "/_nuxt/orders.061707a1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d5-qg2Y/h9LQDmDGQWSdZClaK2gceU\"",
    "mtime": "2023-07-24T18:18:56.215Z",
    "size": 9685,
    "path": "../public/_nuxt/orders.061707a1.css"
  },
  "/_nuxt/orders.061707a1.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"794-++iYqZVj4v+fHjRfHLUbFLz6cw8\"",
    "mtime": "2023-07-24T18:18:57.182Z",
    "size": 1940,
    "path": "../public/_nuxt/orders.061707a1.css.br"
  },
  "/_nuxt/orders.061707a1.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8d4-hemarn6s8stwoQlt2FUB2n8JRGI\"",
    "mtime": "2023-07-24T18:18:57.172Z",
    "size": 2260,
    "path": "../public/_nuxt/orders.061707a1.css.gz"
  },
  "/_nuxt/orders.1e3a9838.js": {
    "type": "application/javascript",
    "etag": "\"2653-HKYKBVBoPjGaRm9FdFYzR6dgmmU\"",
    "mtime": "2023-07-24T18:18:56.214Z",
    "size": 9811,
    "path": "../public/_nuxt/orders.1e3a9838.js"
  },
  "/_nuxt/orders.1e3a9838.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"ba1-D6Yy3wqbTI+jIEyD6ANfcwqsVZE\"",
    "mtime": "2023-07-24T18:18:57.194Z",
    "size": 2977,
    "path": "../public/_nuxt/orders.1e3a9838.js.br"
  },
  "/_nuxt/orders.1e3a9838.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"d9f-02P7WBuCc2llcIqcaSOZSZeltWk\"",
    "mtime": "2023-07-24T18:18:57.183Z",
    "size": 3487,
    "path": "../public/_nuxt/orders.1e3a9838.js.gz"
  },
  "/_nuxt/pngwing.com.4e9aa2ec.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-07-24T18:18:56.213Z",
    "size": 52718,
    "path": "../public/_nuxt/pngwing.com.4e9aa2ec.png"
  },
  "/_nuxt/profile.5d2eb33c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4ab0-8BeAMFdT90Jn71GUmLhhlEMrcj4\"",
    "mtime": "2023-07-24T18:18:56.211Z",
    "size": 19120,
    "path": "../public/_nuxt/profile.5d2eb33c.css"
  },
  "/_nuxt/profile.5d2eb33c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6d2-0w1RZhTf3NIDDgOm8ZiGKU7eZmY\"",
    "mtime": "2023-07-24T18:18:57.219Z",
    "size": 1746,
    "path": "../public/_nuxt/profile.5d2eb33c.css.br"
  },
  "/_nuxt/profile.5d2eb33c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"96d-Yvb/ix3eeUvneNdeKEitET6ccPg\"",
    "mtime": "2023-07-24T18:18:57.195Z",
    "size": 2413,
    "path": "../public/_nuxt/profile.5d2eb33c.css.gz"
  },
  "/_nuxt/profile.93d28c46.js": {
    "type": "application/javascript",
    "etag": "\"1241-RCIf6sWNV7L1w9K7Y+NAMTC5ld0\"",
    "mtime": "2023-07-24T18:18:56.210Z",
    "size": 4673,
    "path": "../public/_nuxt/profile.93d28c46.js"
  },
  "/_nuxt/profile.93d28c46.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"707-3+vGEHqI6XJplF/L4JuNhWjoESk\"",
    "mtime": "2023-07-24T18:18:57.225Z",
    "size": 1799,
    "path": "../public/_nuxt/profile.93d28c46.js.br"
  },
  "/_nuxt/profile.93d28c46.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"83c-Q4Cnzcbt34XZqtJ7hMmfpGTallU\"",
    "mtime": "2023-07-24T18:18:57.220Z",
    "size": 2108,
    "path": "../public/_nuxt/profile.93d28c46.js.gz"
  },
  "/_nuxt/register.208e890c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-clriYClBTi8HbNlWT64WeXheUC4\"",
    "mtime": "2023-07-24T18:18:56.209Z",
    "size": 2199,
    "path": "../public/_nuxt/register.208e890c.css"
  },
  "/_nuxt/register.208e890c.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25c-LLgXF25+bKRKa9XshFE0wV2ECjc\"",
    "mtime": "2023-07-24T18:18:57.229Z",
    "size": 604,
    "path": "../public/_nuxt/register.208e890c.css.br"
  },
  "/_nuxt/register.208e890c.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-Qk1CiqVDsy3TDMTEB39cH4GvTkw\"",
    "mtime": "2023-07-24T18:18:57.226Z",
    "size": 776,
    "path": "../public/_nuxt/register.208e890c.css.gz"
  },
  "/_nuxt/register.a4c0ed48.js": {
    "type": "application/javascript",
    "etag": "\"1128-IugyoPsQCogLvR51KY+hg/+GhIQ\"",
    "mtime": "2023-07-24T18:18:56.208Z",
    "size": 4392,
    "path": "../public/_nuxt/register.a4c0ed48.js"
  },
  "/_nuxt/register.a4c0ed48.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"570-9mMsUogxMirvJh8Mfck3N7Isays\"",
    "mtime": "2023-07-24T18:18:57.235Z",
    "size": 1392,
    "path": "../public/_nuxt/register.a4c0ed48.js.br"
  },
  "/_nuxt/register.a4c0ed48.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"696-Coj/F5TkXWPlIgyILSgbj3KclMg\"",
    "mtime": "2023-07-24T18:18:57.229Z",
    "size": 1686,
    "path": "../public/_nuxt/register.a4c0ed48.js.gz"
  },
  "/_nuxt/removeFavorite.58f3a01a.js": {
    "type": "application/javascript",
    "etag": "\"3d2-dsCXm7f6VJarXMTcrTzfxmLcYCo\"",
    "mtime": "2023-07-24T18:18:56.207Z",
    "size": 978,
    "path": "../public/_nuxt/removeFavorite.58f3a01a.js"
  },
  "/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-07-24T18:18:56.206Z",
    "size": 435,
    "path": "../public/_nuxt/roof_house_home_opening_icon-icons.com_75451.5a6c3c3f.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-07-24T18:18:56.206Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2023-07-24T18:18:57.239Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-8TZkUIDaPdIDgigucT61Gl1xLdA\"",
    "mtime": "2023-07-24T18:18:57.237Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2023-07-24T18:18:56.205Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2023-07-24T18:18:56.200Z",
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
