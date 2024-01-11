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
    "mtime": "2023-08-23T18:23:34.836Z",
    "size": 268350,
    "path": "../public/favicon.ico"
  },
  "/docs/delivery.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"22cb-9tl0vYHxXU1fT3CQ59cnBFle3Ho\"",
    "mtime": "2023-10-10T17:53:41.702Z",
    "size": 8907,
    "path": "../public/docs/delivery.docx"
  },
  "/docs/polzovsogl.docx": {
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "etag": "\"4dc8-t7fTNJMNreopDfvdVKAoeCjc3H8\"",
    "mtime": "2023-10-10T17:36:57.794Z",
    "size": 19912,
    "path": "../public/docs/polzovsogl.docx"
  },
  "/images/catalog_icon_215654.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-fIAsPTOn7672lpKO3GV5HewXfV0\"",
    "mtime": "2023-08-23T18:23:34.837Z",
    "size": 569,
    "path": "../public/images/catalog_icon_215654.svg"
  },
  "/images/eco-friend.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf96-dirl6DnCoIeydh3TWJOSilexgS4\"",
    "mtime": "2023-08-23T18:23:34.839Z",
    "size": 118678,
    "path": "../public/images/eco-friend.jpg"
  },
  "/images/main.jpg": {
    "type": "image/jpeg",
    "etag": "\"3013e-iL+bzZJH1+Y2zXQuCZPjzQKlbMk\"",
    "mtime": "2023-12-29T09:11:51.984Z",
    "size": 196926,
    "path": "../public/images/main.jpg"
  },
  "/images/pngwing.com.png": {
    "type": "image/png",
    "etag": "\"cdee-I+pLVilAAlyg5WTx/L3lnL/eh1g\"",
    "mtime": "2023-08-23T18:23:34.840Z",
    "size": 52718,
    "path": "../public/images/pngwing.com.png"
  },
  "/images/roof_house_home_opening_icon-icons.com_75451.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b3-YB9vHYgWGCFUECkqIoz+aT1VGqQ\"",
    "mtime": "2023-08-23T18:23:34.840Z",
    "size": 435,
    "path": "../public/images/roof_house_home_opening_icon-icons.com_75451.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2023-08-23T18:23:34.841Z",
    "size": 1514,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2024-01-11T11:54:52.165Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-b/XntxU0PdSAFxKkGEWY93iuRiQ\"",
    "mtime": "2024-01-11T11:54:52.151Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/about_us.b4c07eda.js": {
    "type": "application/javascript",
    "etag": "\"819-DariR8fp1SRnxY6qtPo3OyryRfg\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.b4c07eda.js"
  },
  "/_nuxt/about_us.b4c07eda.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3aa-N5GUfz3KqiS+qoGz5ONFT7AjEFg\"",
    "mtime": "2024-01-11T11:54:52.170Z",
    "size": 938,
    "path": "../public/_nuxt/about_us.b4c07eda.js.br"
  },
  "/_nuxt/about_us.b4c07eda.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"470-tKgufaOB0Rj19qA657BMad0AdJ8\"",
    "mtime": "2024-01-11T11:54:52.166Z",
    "size": 1136,
    "path": "../public/_nuxt/about_us.b4c07eda.js.gz"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2024-01-11T11:54:52.180Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-OzOhucSd/rw4fh2MqcZ9R3Hm4y8\"",
    "mtime": "2024-01-11T11:54:52.172Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.cc83633b.js": {
    "type": "application/javascript",
    "etag": "\"2b6-/mLuWlSYbFm5DQbjXP59dI9Z9Bo\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 694,
    "path": "../public/_nuxt/basket.cc83633b.js"
  },
  "/_nuxt/BasketInfo.3bb00265.js": {
    "type": "application/javascript",
    "etag": "\"ae7-d2CdoVB5Y6+l/lYCrEdZ77PE7Dg\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.3bb00265.js"
  },
  "/_nuxt/BasketInfo.3bb00265.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"44a-T/X8JsdQqFrZORUOYLYwniidQTQ\"",
    "mtime": "2024-01-11T11:54:52.186Z",
    "size": 1098,
    "path": "../public/_nuxt/BasketInfo.3bb00265.js.br"
  },
  "/_nuxt/BasketInfo.3bb00265.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fd-lmyvqhUR6D/fXae2tVuHw6IDxz4\"",
    "mtime": "2024-01-11T11:54:52.181Z",
    "size": 1277,
    "path": "../public/_nuxt/BasketInfo.3bb00265.js.gz"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2024-01-11T11:54:45.916Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2024-01-11T11:54:52.217Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-QbGwBWZ1aJcV6aI9uQorjEIQYIQ\"",
    "mtime": "2024-01-11T11:54:52.188Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/catalog.9181c163.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-th6ifqwcEuQKLdV4/rHPN3plkww\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.9181c163.js"
  },
  "/_nuxt/catalog.9181c163.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"921-eV7OFfW1GO7AJvhyO0atMBFpU2E\"",
    "mtime": "2024-01-11T11:54:52.228Z",
    "size": 2337,
    "path": "../public/_nuxt/catalog.9181c163.js.br"
  },
  "/_nuxt/catalog.9181c163.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9b-W/tmGkdWDm5oh49OMFiPXF70lLg\"",
    "mtime": "2024-01-11T11:54:52.218Z",
    "size": 2715,
    "path": "../public/_nuxt/catalog.9181c163.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2024-01-11T11:54:52.239Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-cLp//XiWYNBSu7B2tGyxb05XygE\"",
    "mtime": "2024-01-11T11:54:52.229Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2024-01-11T11:54:52.260Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-Y04BJFf6xSQqIV2RgfYJXN5+gMU\"",
    "mtime": "2024-01-11T11:54:52.240Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.dc373c89.js": {
    "type": "application/javascript",
    "etag": "\"15bf-Bimim9MJGGirOo2kXX7mXJ43N+c\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.dc373c89.js"
  },
  "/_nuxt/CatalogProduct.dc373c89.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"787-q2fqh423jE3OjAspqZUx+4zQhWI\"",
    "mtime": "2024-01-11T11:54:52.269Z",
    "size": 1927,
    "path": "../public/_nuxt/CatalogProduct.dc373c89.js.br"
  },
  "/_nuxt/CatalogProduct.dc373c89.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-lkSV+vlLnXCA54xzoWMGo80TR9g\"",
    "mtime": "2024-01-11T11:54:52.262Z",
    "size": 2185,
    "path": "../public/_nuxt/CatalogProduct.dc373c89.js.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2024-01-11T11:54:52.393Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-WnJKX7h1+08dMuesfNA4AfELzhc\"",
    "mtime": "2024-01-11T11:54:52.273Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.5ede9f05.js": {
    "type": "application/javascript",
    "etag": "\"16616-t2CVBvRnIAmhV3VyEA0HpT+p1aA\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.5ede9f05.js"
  },
  "/_nuxt/checkout.5ede9f05.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57c5-DRFa/e5jLyFWsB76E5HaAYw+18U\"",
    "mtime": "2024-01-11T11:54:52.507Z",
    "size": 22469,
    "path": "../public/_nuxt/checkout.5ede9f05.js.br"
  },
  "/_nuxt/checkout.5ede9f05.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6601-nlbKUOx5LmIcTPwRM/Zpp/nbZRo\"",
    "mtime": "2024-01-11T11:54:52.397Z",
    "size": 26113,
    "path": "../public/_nuxt/checkout.5ede9f05.js.gz"
  },
  "/_nuxt/entry.3d94c14a.js": {
    "type": "application/javascript",
    "etag": "\"374cd-ryVdLOtktzZXGl0muc44pKXTWD4\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 226509,
    "path": "../public/_nuxt/entry.3d94c14a.js"
  },
  "/_nuxt/entry.3d94c14a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"127ae-pQahhAUNoW+aCwGDB07ivQ66R38\"",
    "mtime": "2024-01-11T11:54:52.902Z",
    "size": 75694,
    "path": "../public/_nuxt/entry.3d94c14a.js.br"
  },
  "/_nuxt/entry.3d94c14a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14c48-3aMf1BP3Demzx1Dyb83R0OVT85M\"",
    "mtime": "2024-01-11T11:54:52.517Z",
    "size": 85064,
    "path": "../public/_nuxt/entry.3d94c14a.js.gz"
  },
  "/_nuxt/entry.caa016ae.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-DgjB906NiVYEP5fBnQ7kLLNVJ9I\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.caa016ae.css"
  },
  "/_nuxt/entry.caa016ae.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a57-W7kU6+5AHkK+7GZTsblbjr388Mg\"",
    "mtime": "2024-01-11T11:54:52.917Z",
    "size": 2647,
    "path": "../public/_nuxt/entry.caa016ae.css.br"
  },
  "/_nuxt/entry.caa016ae.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bed-0eVld3EDK9NmgydP2wV81lkZK+A\"",
    "mtime": "2024-01-11T11:54:52.904Z",
    "size": 3053,
    "path": "../public/_nuxt/entry.caa016ae.css.gz"
  },
  "/_nuxt/error-404.1f384121.js": {
    "type": "application/javascript",
    "etag": "\"8a8-lzUqaMwF+Chmb7Lz4jqOKrHewck\"",
    "mtime": "2024-01-11T11:54:45.919Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.1f384121.js"
  },
  "/_nuxt/error-404.1f384121.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-Fsmh9MpIA/5JAaQ7R1m223RxSsA\"",
    "mtime": "2024-01-11T11:54:52.923Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.1f384121.js.br"
  },
  "/_nuxt/error-404.1f384121.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"476-dHAe+7hWqnWihGvQ06oVSX2pLKA\"",
    "mtime": "2024-01-11T11:54:52.919Z",
    "size": 1142,
    "path": "../public/_nuxt/error-404.1f384121.js.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2024-01-11T11:54:52.929Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-2c/oojFgmMD5mLZNeQtK5aJXXfc\"",
    "mtime": "2024-01-11T11:54:52.924Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2024-01-11T11:54:52.935Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-1g7CAl0G7RZF74B7FhcEMrRa/hU\"",
    "mtime": "2024-01-11T11:54:52.931Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.e28b3a42.js": {
    "type": "application/javascript",
    "etag": "\"756-md9tyONrHIw/71GIjK14my2c0Vk\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.e28b3a42.js"
  },
  "/_nuxt/error-500.e28b3a42.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"348-vMJ+pPyoy0Uhg779yHKnlNnM99E\"",
    "mtime": "2024-01-11T11:54:52.940Z",
    "size": 840,
    "path": "../public/_nuxt/error-500.e28b3a42.js.br"
  },
  "/_nuxt/error-500.e28b3a42.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-RxUQ3Ad/e49ZGiE2kFOyc+JJM9k\"",
    "mtime": "2024-01-11T11:54:52.936Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.e28b3a42.js.gz"
  },
  "/_nuxt/error-component.9acde622.js": {
    "type": "application/javascript",
    "etag": "\"45e-Hn65+CHYxaQsUv2k9eicapJ1fxY\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.9acde622.js"
  },
  "/_nuxt/error-component.9acde622.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-iOF6F+iw5yP3uaRU361FKXF7R8I\"",
    "mtime": "2024-01-11T11:54:52.944Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.9acde622.js.br"
  },
  "/_nuxt/error-component.9acde622.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25e-MI04mZUt374hhApDJMGFAXkERqg\"",
    "mtime": "2024-01-11T11:54:52.941Z",
    "size": 606,
    "path": "../public/_nuxt/error-component.9acde622.js.gz"
  },
  "/_nuxt/favorite.0153ba21.js": {
    "type": "application/javascript",
    "etag": "\"906-GS3pPnGMNUVWSyp6P3og1rlNS1M\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.0153ba21.js"
  },
  "/_nuxt/favorite.0153ba21.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40c-iXBZDK7rzdwjt497J3lAFQGBZU0\"",
    "mtime": "2024-01-11T11:54:52.950Z",
    "size": 1036,
    "path": "../public/_nuxt/favorite.0153ba21.js.br"
  },
  "/_nuxt/favorite.0153ba21.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b3-BE74Ef22NOTN5X/NjQpuDDH/+3U\"",
    "mtime": "2024-01-11T11:54:52.945Z",
    "size": 1203,
    "path": "../public/_nuxt/favorite.0153ba21.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2024-01-11T11:54:52.968Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-Ets85u69mgiMsKxLCc9qNHP2yrI\"",
    "mtime": "2024-01-11T11:54:52.955Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/FavoriteComp.187fdd8f.js": {
    "type": "application/javascript",
    "etag": "\"e2e-0p+mNWZjh1lyRZQYVJCZZkZu+O0\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.187fdd8f.js"
  },
  "/_nuxt/FavoriteComp.187fdd8f.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40c-/wCrqi/m1Q8Jrn0lHd07E7HySWE\"",
    "mtime": "2024-01-11T11:54:52.976Z",
    "size": 1036,
    "path": "../public/_nuxt/FavoriteComp.187fdd8f.js.br"
  },
  "/_nuxt/FavoriteComp.187fdd8f.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d0-P6DMfTygXqOUWlJXceJ/K2lOI1o\"",
    "mtime": "2024-01-11T11:54:52.969Z",
    "size": 1232,
    "path": "../public/_nuxt/FavoriteComp.187fdd8f.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2024-01-11T11:54:53.002Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6+IsBsYu6A8cVnFw1spMxvBvlLc\"",
    "mtime": "2024-01-11T11:54:52.977Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2024-01-11T11:54:53.008Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-HUXQ1pH3vpUJuR0j6cDw+ub1sbU\"",
    "mtime": "2024-01-11T11:54:53.003Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/FavoriteComp.8fea81db.js": {
    "type": "application/javascript",
    "etag": "\"783-MhpYkF71HcDYE036yoLlhqWjGo4\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.8fea81db.js"
  },
  "/_nuxt/FavoriteComp.8fea81db.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-QGgM/q8qR/jDRis0ua2HWwRBPlg\"",
    "mtime": "2024-01-11T11:54:53.014Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.8fea81db.js.br"
  },
  "/_nuxt/FavoriteComp.8fea81db.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-eGZLIZ8zLP3m9MrUIIYCThpge3o\"",
    "mtime": "2024-01-11T11:54:53.009Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.8fea81db.js.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2024-01-11T11:54:45.911Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.ebb360fb.js": {
    "type": "application/javascript",
    "etag": "\"e1-TEuZ0q33jOkdQT9fU1QhS+QTp4Q\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.ebb360fb.js"
  },
  "/_nuxt/ImageForm.cb66694a.js": {
    "type": "application/javascript",
    "etag": "\"1ac-xxLAnS5ae5bGS6zrLZWHRD4EX6g\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.cb66694a.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2024-01-11T11:54:53.021Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-diQkntOg9WdF+NDZl5IE6JBcp78\"",
    "mtime": "2024-01-11T11:54:53.017Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.28193b28.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-M+PKq8iC00iZOu+aZzZt8TzZ6+k\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 22887,
    "path": "../public/_nuxt/index.28193b28.css"
  },
  "/_nuxt/index.28193b28.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12dc-amORM3zDNOPTvvryaylM0uPwJf0\"",
    "mtime": "2024-01-11T11:54:53.052Z",
    "size": 4828,
    "path": "../public/_nuxt/index.28193b28.css.br"
  },
  "/_nuxt/index.28193b28.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-Wk0uiZES4zQTFbZ0ZTVmJ0xg7tM\"",
    "mtime": "2024-01-11T11:54:53.022Z",
    "size": 5713,
    "path": "../public/_nuxt/index.28193b28.css.gz"
  },
  "/_nuxt/index.36c002e3.js": {
    "type": "application/javascript",
    "etag": "\"17af0-avBdJ7+u/1Eq1cOXzCZR5BbA5o8\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 97008,
    "path": "../public/_nuxt/index.36c002e3.js"
  },
  "/_nuxt/index.36c002e3.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"674a-eRA6R03+Zgiwz0Q42QEv5asPYGE\"",
    "mtime": "2024-01-11T11:54:53.180Z",
    "size": 26442,
    "path": "../public/_nuxt/index.36c002e3.js.br"
  },
  "/_nuxt/index.36c002e3.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758c-rpEux6RiKCqxy1OkaV92WEi0haE\"",
    "mtime": "2024-01-11T11:54:53.056Z",
    "size": 30092,
    "path": "../public/_nuxt/index.36c002e3.js.gz"
  },
  "/_nuxt/index.3991a8bc.js": {
    "type": "application/javascript",
    "etag": "\"3abf-ffwxIMQBP7Wd70mxLqysBey50m4\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 15039,
    "path": "../public/_nuxt/index.3991a8bc.js"
  },
  "/_nuxt/index.3991a8bc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ec-tZLdmtYCrVKqkXusNbfQtceqxSc\"",
    "mtime": "2024-01-11T11:54:53.198Z",
    "size": 4844,
    "path": "../public/_nuxt/index.3991a8bc.js.br"
  },
  "/_nuxt/index.3991a8bc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-0yK5w54XMqgJqdw6Qo0nPCSNIeg\"",
    "mtime": "2024-01-11T11:54:53.181Z",
    "size": 5362,
    "path": "../public/_nuxt/index.3991a8bc.js.gz"
  },
  "/_nuxt/index.b7d8e0bd.js": {
    "type": "application/javascript",
    "etag": "\"649-24xGPDqV54KlYk9Q2tDq0fR8Urs\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 1609,
    "path": "../public/_nuxt/index.b7d8e0bd.js"
  },
  "/_nuxt/index.b7d8e0bd.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"338-E3ZD7YzC7dz0aQSjHngzqan8QBE\"",
    "mtime": "2024-01-11T11:54:53.203Z",
    "size": 824,
    "path": "../public/_nuxt/index.b7d8e0bd.js.br"
  },
  "/_nuxt/index.b7d8e0bd.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bc-qQohZqffeu9FKmLV7EV5IruoK2s\"",
    "mtime": "2024-01-11T11:54:53.200Z",
    "size": 956,
    "path": "../public/_nuxt/index.b7d8e0bd.js.gz"
  },
  "/_nuxt/isAuth.81e6e259.js": {
    "type": "application/javascript",
    "etag": "\"275-7mEv0ua5ISB7Elo+JCJLJdQWbFU\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.81e6e259.js"
  },
  "/_nuxt/LoadingComp.826b55a4.js": {
    "type": "application/javascript",
    "etag": "\"1fe-u3DObHjuECMDzGytARlnIAnQJE4\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.826b55a4.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2024-01-11T11:54:53.209Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-C5J0Fhk5h547zivSt7NSdPDymn8\"",
    "mtime": "2024-01-11T11:54:53.205Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.997679d0.js": {
    "type": "application/javascript",
    "etag": "\"b8e-Xc5SoiB5znfgkkgbIobkFf7p14k\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 2958,
    "path": "../public/_nuxt/login.997679d0.js"
  },
  "/_nuxt/login.997679d0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4bc-V/llK4oA3e4AH1aHrXERAZJGeMI\"",
    "mtime": "2024-01-11T11:54:53.216Z",
    "size": 1212,
    "path": "../public/_nuxt/login.997679d0.js.br"
  },
  "/_nuxt/login.997679d0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a6-zWILRR51shuIi0KVLY5NP8OBW9U\"",
    "mtime": "2024-01-11T11:54:53.210Z",
    "size": 1446,
    "path": "../public/_nuxt/login.997679d0.js.gz"
  },
  "/_nuxt/newsList.c8075b0c.js": {
    "type": "application/javascript",
    "etag": "\"e6-yI1tfMk74wPv7o+xaRX3UIhLHJ0\"",
    "mtime": "2024-01-11T11:54:45.919Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.c8075b0c.js"
  },
  "/_nuxt/OrderProductList.12b9fb64.js": {
    "type": "application/javascript",
    "etag": "\"431-fvSscXTP9o4+fWjZe1czpjYKeK0\"",
    "mtime": "2024-01-11T11:54:45.920Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.12b9fb64.js"
  },
  "/_nuxt/OrderProductList.12b9fb64.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20e-lXVBRxBcZThpLTn86RbVUbH8nqM\"",
    "mtime": "2024-01-11T11:54:53.219Z",
    "size": 526,
    "path": "../public/_nuxt/OrderProductList.12b9fb64.js.br"
  },
  "/_nuxt/OrderProductList.12b9fb64.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-Qz6/hs+DfAel16lcRyXerH5K0k8\"",
    "mtime": "2024-01-11T11:54:53.217Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.12b9fb64.js.gz"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2024-01-11T11:54:53.223Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-jLdWFReqPrMmGExwjtkEVV3aRXg\"",
    "mtime": "2024-01-11T11:54:53.220Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2024-01-11T11:54:53.235Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-In/G2gYWU30UNlLnqffLUtaFlG0\"",
    "mtime": "2024-01-11T11:54:53.224Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/orders.8fb351eb.js": {
    "type": "application/javascript",
    "etag": "\"2595-XAroKvZR4xqnj4ynnYksSvmQlq4\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.8fb351eb.js"
  },
  "/_nuxt/orders.8fb351eb.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b06-thBgjHNjtUkHgb1rg8Gm24u//o8\"",
    "mtime": "2024-01-11T11:54:53.249Z",
    "size": 2822,
    "path": "../public/_nuxt/orders.8fb351eb.js.br"
  },
  "/_nuxt/orders.8fb351eb.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfd-Bbx6rHYBTF+GqeSOC8Bu9yCeFbI\"",
    "mtime": "2024-01-11T11:54:53.236Z",
    "size": 3325,
    "path": "../public/_nuxt/orders.8fb351eb.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2024-01-11T11:54:45.910Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2024-01-11T11:54:53.289Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-Y8LG6RvZhJNxvI2iI6vIke89cSc\"",
    "mtime": "2024-01-11T11:54:53.251Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.fe9e167e.js": {
    "type": "application/javascript",
    "etag": "\"169d-j7gYb9ongZaS+QlZHCdLWAJgrXs\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.fe9e167e.js"
  },
  "/_nuxt/profile.fe9e167e.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"845-14xUh4JSr8XvY9SquEy3tMfgo6k\"",
    "mtime": "2024-01-11T11:54:53.299Z",
    "size": 2117,
    "path": "../public/_nuxt/profile.fe9e167e.js.br"
  },
  "/_nuxt/profile.fe9e167e.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-28p+wFGKlu3gLpGLZoGGpjsNjSU\"",
    "mtime": "2024-01-11T11:54:53.291Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.fe9e167e.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2024-01-11T11:54:53.304Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-te8CNQHCPeO3j8NYkUTMR0kRJAU\"",
    "mtime": "2024-01-11T11:54:53.300Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.dcbf67bc.js": {
    "type": "application/javascript",
    "etag": "\"11bd-jIWkGw2hPH7YiE/kpRKSwIQexA0\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 4541,
    "path": "../public/_nuxt/register.dcbf67bc.js"
  },
  "/_nuxt/register.dcbf67bc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5be-cdVXLiNAuCxrPrbhM6aKovhnNxQ\"",
    "mtime": "2024-01-11T11:54:53.313Z",
    "size": 1470,
    "path": "../public/_nuxt/register.dcbf67bc.js.br"
  },
  "/_nuxt/register.dcbf67bc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f9-rIa7afjpdAV3rk/yaAz/qUeYX3s\"",
    "mtime": "2024-01-11T11:54:53.306Z",
    "size": 1785,
    "path": "../public/_nuxt/register.dcbf67bc.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2024-01-11T11:54:53.318Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-b/XntxU0PdSAFxKkGEWY93iuRiQ\"",
    "mtime": "2024-01-11T11:54:53.314Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2024-01-11T11:54:53.337Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-HE/GDPuDK1wnFzc+YSJe+pLykm8\"",
    "mtime": "2024-01-11T11:54:53.320Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/UserBasket.e38c92e0.js": {
    "type": "application/javascript",
    "etag": "\"1897-8R0d/F9QxemmoqWmOzRazElZfuc\"",
    "mtime": "2024-01-11T11:54:45.921Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.e38c92e0.js"
  },
  "/_nuxt/UserBasket.e38c92e0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"91e-Nd3JYQs3JTB3EgafBHAnv9XTIDc\"",
    "mtime": "2024-01-11T11:54:53.347Z",
    "size": 2334,
    "path": "../public/_nuxt/UserBasket.e38c92e0.js.br"
  },
  "/_nuxt/UserBasket.e38c92e0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a70-aPsKVnc+fR/Xs97B0TfsQ17ewXE\"",
    "mtime": "2024-01-11T11:54:53.339Z",
    "size": 2672,
    "path": "../public/_nuxt/UserBasket.e38c92e0.js.gz"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2024-01-11T11:54:53.365Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-8iGGZ/vmF+VKpGZv0E61Soj0UNU\"",
    "mtime": "2024-01-11T11:54:53.349Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2024-01-11T11:54:45.913Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.5fc9e602.js": {
    "type": "application/javascript",
    "etag": "\"12e4-1DfBp/3h37r9u2DImWw1dWCVtfk\"",
    "mtime": "2024-01-11T11:54:45.922Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.5fc9e602.js"
  },
  "/_nuxt/_id_.5fc9e602.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"761-lBmve9fW8xX05laWF3XXAdJDEzw\"",
    "mtime": "2024-01-11T11:54:53.374Z",
    "size": 1889,
    "path": "../public/_nuxt/_id_.5fc9e602.js.br"
  },
  "/_nuxt/_id_.5fc9e602.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85f-QmjjbST2YC2HlX71heBpea1lolc\"",
    "mtime": "2024-01-11T11:54:53.367Z",
    "size": 2143,
    "path": "../public/_nuxt/_id_.5fc9e602.js.gz"
  },
  "/_nuxt/_id_.c99b5e33.js": {
    "type": "application/javascript",
    "etag": "\"531-jzXRSdnL7z1+Dp/QNOcB8BKB3mg\"",
    "mtime": "2024-01-11T11:54:45.918Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.c99b5e33.js"
  },
  "/_nuxt/_id_.c99b5e33.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a0-naHB3kzS4XzOB0RRmmhx2E8+sbk\"",
    "mtime": "2024-01-11T11:54:53.378Z",
    "size": 672,
    "path": "../public/_nuxt/_id_.c99b5e33.js.br"
  },
  "/_nuxt/_id_.c99b5e33.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32e-3O60XBZJ4Nh6hvILkw5nLJtSzGk\"",
    "mtime": "2024-01-11T11:54:53.375Z",
    "size": 814,
    "path": "../public/_nuxt/_id_.c99b5e33.js.gz"
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

const _WHPxUQ = lazyEventHandler(() => {
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

const _lazy_swTm40 = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_swTm40, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _WHPxUQ, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_swTm40, lazy: true, middleware: false, method: undefined }
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
