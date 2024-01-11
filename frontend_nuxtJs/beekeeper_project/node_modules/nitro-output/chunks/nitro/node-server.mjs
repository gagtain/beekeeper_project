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
    "mtime": "2024-01-11T12:27:01.033Z",
    "size": 645,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.br"
  },
  "/images/shopping-cart_icon-icons.com_69303.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-b/XntxU0PdSAFxKkGEWY93iuRiQ\"",
    "mtime": "2024-01-11T12:27:01.029Z",
    "size": 718,
    "path": "../public/images/shopping-cart_icon-icons.com_69303.svg.gz"
  },
  "/_nuxt/3.de54ba29.jpg": {
    "type": "image/jpeg",
    "etag": "\"43a26-yip4r0X9H0j2i5O8xKE5gr0BDsc\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 277030,
    "path": "../public/_nuxt/3.de54ba29.jpg"
  },
  "/_nuxt/892498.d01e5868.png": {
    "type": "image/png",
    "etag": "\"1492-+RLl/DoKnhoVlDY19QHtQv/Pd5E\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 5266,
    "path": "../public/_nuxt/892498.d01e5868.png"
  },
  "/_nuxt/about_us.c3277afb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f2-vsFBIrkv2wIXlscsHiXSr5XHg18\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 498,
    "path": "../public/_nuxt/about_us.c3277afb.css"
  },
  "/_nuxt/about_us.fbd0f0ca.js": {
    "type": "application/javascript",
    "etag": "\"819-bZuUTLhoAI8Ad7J/mkxJ2Mno8Vs\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 2073,
    "path": "../public/_nuxt/about_us.fbd0f0ca.js"
  },
  "/_nuxt/about_us.fbd0f0ca.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3a7-n5uKgppfK426F+JfCruNW6D7SOE\"",
    "mtime": "2024-01-11T12:27:01.041Z",
    "size": 935,
    "path": "../public/_nuxt/about_us.fbd0f0ca.js.br"
  },
  "/_nuxt/about_us.fbd0f0ca.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"470-kqd5fA6CJp5XZs2QMr+AlH1VyKw\"",
    "mtime": "2024-01-11T12:27:01.037Z",
    "size": 1136,
    "path": "../public/_nuxt/about_us.fbd0f0ca.js.gz"
  },
  "/_nuxt/basket.a16488e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18d7-VHkiHJu5hvJYxZQld3nC+a65B5Y\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 6359,
    "path": "../public/_nuxt/basket.a16488e7.css"
  },
  "/_nuxt/basket.a16488e7.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"4fe-dViv/GUoyPEWkRWMb6HRoSKFYRs\"",
    "mtime": "2024-01-11T12:27:01.051Z",
    "size": 1278,
    "path": "../public/_nuxt/basket.a16488e7.css.br"
  },
  "/_nuxt/basket.a16488e7.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5e1-OzOhucSd/rw4fh2MqcZ9R3Hm4y8\"",
    "mtime": "2024-01-11T12:27:01.042Z",
    "size": 1505,
    "path": "../public/_nuxt/basket.a16488e7.css.gz"
  },
  "/_nuxt/basket.f180e249.js": {
    "type": "application/javascript",
    "etag": "\"2b6-4gdTwAfIpH3GKTs/emHPdx3pj8U\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 694,
    "path": "../public/_nuxt/basket.f180e249.js"
  },
  "/_nuxt/BasketInfo.414657d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b27-qsZU0WsjT/2uPheR+gJgerx0zyM\"",
    "mtime": "2024-01-11T12:26:55.158Z",
    "size": 19239,
    "path": "../public/_nuxt/BasketInfo.414657d3.css"
  },
  "/_nuxt/BasketInfo.414657d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6f0-a1l4Q8IdGJ4nqUjgWy5YtLV07rQ\"",
    "mtime": "2024-01-11T12:27:01.081Z",
    "size": 1776,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.br"
  },
  "/_nuxt/BasketInfo.414657d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9aa-QbGwBWZ1aJcV6aI9uQorjEIQYIQ\"",
    "mtime": "2024-01-11T12:27:01.053Z",
    "size": 2474,
    "path": "../public/_nuxt/BasketInfo.414657d3.css.gz"
  },
  "/_nuxt/BasketInfo.82e86137.js": {
    "type": "application/javascript",
    "etag": "\"ae7-o4HJzdbD29oXAFikaSee9sH0D3M\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 2791,
    "path": "../public/_nuxt/BasketInfo.82e86137.js"
  },
  "/_nuxt/BasketInfo.82e86137.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"444-Ku8zU5Ah8C9AxdoRuY9U2vkL/2c\"",
    "mtime": "2024-01-11T12:27:01.087Z",
    "size": 1092,
    "path": "../public/_nuxt/BasketInfo.82e86137.js.br"
  },
  "/_nuxt/BasketInfo.82e86137.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4fe-S0Tvic4t9CuMCPtGt1N7V88vdSg\"",
    "mtime": "2024-01-11T12:27:01.082Z",
    "size": 1278,
    "path": "../public/_nuxt/BasketInfo.82e86137.js.gz"
  },
  "/_nuxt/catalog.9cc915d9.js": {
    "type": "application/javascript",
    "etag": "\"1b6d-MMcUZaLMtuVQGtsnkL3mncLaG0o\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 7021,
    "path": "../public/_nuxt/catalog.9cc915d9.js"
  },
  "/_nuxt/catalog.9cc915d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"920-WtSGB2njFsfw8HlAFD+qTnX+8GA\"",
    "mtime": "2024-01-11T12:27:01.098Z",
    "size": 2336,
    "path": "../public/_nuxt/catalog.9cc915d9.js.br"
  },
  "/_nuxt/catalog.9cc915d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a9a-oxFBIsvmxR4mcGzOsufKQrL+SK0\"",
    "mtime": "2024-01-11T12:27:01.088Z",
    "size": 2714,
    "path": "../public/_nuxt/catalog.9cc915d9.js.gz"
  },
  "/_nuxt/catalog.f4349541.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e89-qaYQbTKiZQrxNpkEYsib73A7zPg\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 7817,
    "path": "../public/_nuxt/catalog.f4349541.css"
  },
  "/_nuxt/catalog.f4349541.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"6eb-Sh6sP6DGPL2N8WtNpl5/dKzDnPQ\"",
    "mtime": "2024-01-11T12:27:01.109Z",
    "size": 1771,
    "path": "../public/_nuxt/catalog.f4349541.css.br"
  },
  "/_nuxt/catalog.f4349541.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"808-cLp//XiWYNBSu7B2tGyxb05XygE\"",
    "mtime": "2024-01-11T12:27:01.099Z",
    "size": 2056,
    "path": "../public/_nuxt/catalog.f4349541.css.gz"
  },
  "/_nuxt/CatalogProduct.138659c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c86-icIf+N+bhM7Q7B4XOJi/c9q6SYA\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 15494,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css"
  },
  "/_nuxt/CatalogProduct.138659c4.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"8fa-uWvuvQx8AmKxb6z+TRDzP5Z5TK0\"",
    "mtime": "2024-01-11T12:27:01.132Z",
    "size": 2298,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.br"
  },
  "/_nuxt/CatalogProduct.138659c4.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"ac0-Y04BJFf6xSQqIV2RgfYJXN5+gMU\"",
    "mtime": "2024-01-11T12:27:01.111Z",
    "size": 2752,
    "path": "../public/_nuxt/CatalogProduct.138659c4.css.gz"
  },
  "/_nuxt/CatalogProduct.2014c990.js": {
    "type": "application/javascript",
    "etag": "\"15bf-p8xW6angeIiQBBlh4j8ZXduZKRQ\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 5567,
    "path": "../public/_nuxt/CatalogProduct.2014c990.js"
  },
  "/_nuxt/CatalogProduct.2014c990.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"78c-oxuMoY4SwulDvBtSeWyPHMjcRjQ\"",
    "mtime": "2024-01-11T12:27:01.143Z",
    "size": 1932,
    "path": "../public/_nuxt/CatalogProduct.2014c990.js.br"
  },
  "/_nuxt/CatalogProduct.2014c990.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"889-2CtblBohgcbNAiGmhSEH4uyz9SA\"",
    "mtime": "2024-01-11T12:27:01.135Z",
    "size": 2185,
    "path": "../public/_nuxt/CatalogProduct.2014c990.js.gz"
  },
  "/_nuxt/checkout.2aa56076.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"269bf-GfSrDDdxR5qelpl1TvbXAT9cCK8\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 158143,
    "path": "../public/_nuxt/checkout.2aa56076.css"
  },
  "/_nuxt/checkout.2aa56076.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5039-7zfO+J1X8y6jy6oZSq1v0MTBaII\"",
    "mtime": "2024-01-11T12:27:01.272Z",
    "size": 20537,
    "path": "../public/_nuxt/checkout.2aa56076.css.br"
  },
  "/_nuxt/checkout.2aa56076.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6091-WnJKX7h1+08dMuesfNA4AfELzhc\"",
    "mtime": "2024-01-11T12:27:01.148Z",
    "size": 24721,
    "path": "../public/_nuxt/checkout.2aa56076.css.gz"
  },
  "/_nuxt/checkout.ece717dc.js": {
    "type": "application/javascript",
    "etag": "\"16616-n1MbM3p4Dh8+CT8vYWJiBVv102g\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 91670,
    "path": "../public/_nuxt/checkout.ece717dc.js"
  },
  "/_nuxt/checkout.ece717dc.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"57dd-0jNQD9DXom6ywH2ajinPJlzf9kY\"",
    "mtime": "2024-01-11T12:27:01.389Z",
    "size": 22493,
    "path": "../public/_nuxt/checkout.ece717dc.js.br"
  },
  "/_nuxt/checkout.ece717dc.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"65ff-JeaHkDZMCxI8MHTUUXk+jLen2xs\"",
    "mtime": "2024-01-11T12:27:01.276Z",
    "size": 26111,
    "path": "../public/_nuxt/checkout.ece717dc.js.gz"
  },
  "/_nuxt/entry.3c7fa92a.js": {
    "type": "application/javascript",
    "etag": "\"374d2-RLii3h4JZtMYR6Y8i5h3+2Buyt8\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 226514,
    "path": "../public/_nuxt/entry.3c7fa92a.js"
  },
  "/_nuxt/entry.3c7fa92a.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"1272e-LGhfC9I2qebHOLT9VLH59+LKQvs\"",
    "mtime": "2024-01-11T12:27:01.787Z",
    "size": 75566,
    "path": "../public/_nuxt/entry.3c7fa92a.js.br"
  },
  "/_nuxt/entry.3c7fa92a.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14c3e-+oXl8y4YDx3ivE3DevSS0ga9MZo\"",
    "mtime": "2024-01-11T12:27:01.400Z",
    "size": 85054,
    "path": "../public/_nuxt/entry.3c7fa92a.js.gz"
  },
  "/_nuxt/entry.caa016ae.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"298b-DgjB906NiVYEP5fBnQ7kLLNVJ9I\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 10635,
    "path": "../public/_nuxt/entry.caa016ae.css"
  },
  "/_nuxt/entry.caa016ae.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a57-W7kU6+5AHkK+7GZTsblbjr388Mg\"",
    "mtime": "2024-01-11T12:27:01.801Z",
    "size": 2647,
    "path": "../public/_nuxt/entry.caa016ae.css.br"
  },
  "/_nuxt/entry.caa016ae.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bed-0eVld3EDK9NmgydP2wV81lkZK+A\"",
    "mtime": "2024-01-11T12:27:01.788Z",
    "size": 3053,
    "path": "../public/_nuxt/entry.caa016ae.css.gz"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.23f2309d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bc-+PtU7kusFUbB35un94ic6DnOJmo\"",
    "mtime": "2024-01-11T12:27:01.807Z",
    "size": 956,
    "path": "../public/_nuxt/error-404.23f2309d.css.br"
  },
  "/_nuxt/error-404.23f2309d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"45c-2c/oojFgmMD5mLZNeQtK5aJXXfc\"",
    "mtime": "2024-01-11T12:27:01.802Z",
    "size": 1116,
    "path": "../public/_nuxt/error-404.23f2309d.css.gz"
  },
  "/_nuxt/error-404.2d2ed8db.js": {
    "type": "application/javascript",
    "etag": "\"8a8-Wuo4F55TmvmnHxsA2gmNOsZdDvs\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.2d2ed8db.js"
  },
  "/_nuxt/error-404.2d2ed8db.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"3cc-98LMviOdIloOnNC+zy/2a4m+/QM\"",
    "mtime": "2024-01-11T12:27:01.813Z",
    "size": 972,
    "path": "../public/_nuxt/error-404.2d2ed8db.js.br"
  },
  "/_nuxt/error-404.2d2ed8db.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"477-srSfJKiyVkZ8mnP8mUJbzHQtQEg\"",
    "mtime": "2024-01-11T12:27:01.808Z",
    "size": 1143,
    "path": "../public/_nuxt/error-404.2d2ed8db.js.gz"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.aa16ed4d.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"274-yZsjQ6WX4i4AD/3U8BrVJdDowoE\"",
    "mtime": "2024-01-11T12:27:01.818Z",
    "size": 628,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.br"
  },
  "/_nuxt/error-500.aa16ed4d.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2df-1g7CAl0G7RZF74B7FhcEMrRa/hU\"",
    "mtime": "2024-01-11T12:27:01.814Z",
    "size": 735,
    "path": "../public/_nuxt/error-500.aa16ed4d.css.gz"
  },
  "/_nuxt/error-500.e5d94302.js": {
    "type": "application/javascript",
    "etag": "\"756-5+HkrsJbnb4FH94n+vofmwtCs7I\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.e5d94302.js"
  },
  "/_nuxt/error-500.e5d94302.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"349-032s2URyES6WS2uaMcw3eHQQL9A\"",
    "mtime": "2024-01-11T12:27:01.823Z",
    "size": 841,
    "path": "../public/_nuxt/error-500.e5d94302.js.br"
  },
  "/_nuxt/error-500.e5d94302.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3db-lLcpjtSgjfaEbSRiMnGqHyIS9xI\"",
    "mtime": "2024-01-11T12:27:01.819Z",
    "size": 987,
    "path": "../public/_nuxt/error-500.e5d94302.js.gz"
  },
  "/_nuxt/error-component.290a64e0.js": {
    "type": "application/javascript",
    "etag": "\"45e-JfLKMSwBZ3Sx6gHG0MfIBecC46E\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 1118,
    "path": "../public/_nuxt/error-component.290a64e0.js"
  },
  "/_nuxt/error-component.290a64e0.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"204-rljRwHkPp8/ndLXNVcYW8dkILUA\"",
    "mtime": "2024-01-11T12:27:01.827Z",
    "size": 516,
    "path": "../public/_nuxt/error-component.290a64e0.js.br"
  },
  "/_nuxt/error-component.290a64e0.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"25d-Gdhpx/ocKuKt5WDib56JGBrN59Y\"",
    "mtime": "2024-01-11T12:27:01.824Z",
    "size": 605,
    "path": "../public/_nuxt/error-component.290a64e0.js.gz"
  },
  "/_nuxt/favorite.2de203d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"199b-Ekzcy8xSLi3avlnYpHAHHVKMYzo\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 6555,
    "path": "../public/_nuxt/favorite.2de203d3.css"
  },
  "/_nuxt/favorite.2de203d3.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"52e-ooeUZLTMhVIpTlbSFpQOCQBaYcs\"",
    "mtime": "2024-01-11T12:27:01.836Z",
    "size": 1326,
    "path": "../public/_nuxt/favorite.2de203d3.css.br"
  },
  "/_nuxt/favorite.2de203d3.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"618-Ets85u69mgiMsKxLCc9qNHP2yrI\"",
    "mtime": "2024-01-11T12:27:01.828Z",
    "size": 1560,
    "path": "../public/_nuxt/favorite.2de203d3.css.gz"
  },
  "/_nuxt/favorite.e6d69eff.js": {
    "type": "application/javascript",
    "etag": "\"906-W0hBBHwbZHPC+XKj0BODIU7wAGE\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 2310,
    "path": "../public/_nuxt/favorite.e6d69eff.js"
  },
  "/_nuxt/favorite.e6d69eff.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40b-PGk1TPWHe215UCxtA8AaHGzccek\"",
    "mtime": "2024-01-11T12:27:01.842Z",
    "size": 1035,
    "path": "../public/_nuxt/favorite.e6d69eff.js.br"
  },
  "/_nuxt/favorite.e6d69eff.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4b3-sESi0vupx65723v83Znxg0hridg\"",
    "mtime": "2024-01-11T12:27:01.837Z",
    "size": 1203,
    "path": "../public/_nuxt/favorite.e6d69eff.js.gz"
  },
  "/_nuxt/FavoriteComp.15cf2801.js": {
    "type": "application/javascript",
    "etag": "\"e2e-JE213SidZN5K1xPDhRsZwwaS/uk\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 3630,
    "path": "../public/_nuxt/FavoriteComp.15cf2801.js"
  },
  "/_nuxt/FavoriteComp.15cf2801.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"40c-yQqm+3VGwzzyLbYYNKrNapkWiO4\"",
    "mtime": "2024-01-11T12:27:01.850Z",
    "size": 1036,
    "path": "../public/_nuxt/FavoriteComp.15cf2801.js.br"
  },
  "/_nuxt/FavoriteComp.15cf2801.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"4d1-tpefDKludqHuiC0XczllqztH5f0\"",
    "mtime": "2024-01-11T12:27:01.843Z",
    "size": 1233,
    "path": "../public/_nuxt/FavoriteComp.15cf2801.js.gz"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31ad-xLdiBnXsUWeEXaB5yrLaCmeq2Y8\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 12717,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5fa-XhGbDD6aFW4OHD9kBWKJNyJ7VgA\"",
    "mtime": "2024-01-11T12:27:01.911Z",
    "size": 1530,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.br"
  },
  "/_nuxt/FavoriteComp.6d5f3a81.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b2-6+IsBsYu6A8cVnFw1spMxvBvlLc\"",
    "mtime": "2024-01-11T12:27:01.851Z",
    "size": 1970,
    "path": "../public/_nuxt/FavoriteComp.6d5f3a81.css.gz"
  },
  "/_nuxt/FavoriteComp.80bfa1cf.js": {
    "type": "application/javascript",
    "etag": "\"783-VHgXRrUqds+LKBTCMe37Cup9zVc\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 1923,
    "path": "../public/_nuxt/FavoriteComp.80bfa1cf.js"
  },
  "/_nuxt/FavoriteComp.80bfa1cf.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"28c-Fz/sD+oNA6oB3mfiU6LkdWztrsQ\"",
    "mtime": "2024-01-11T12:27:01.916Z",
    "size": 652,
    "path": "../public/_nuxt/FavoriteComp.80bfa1cf.js.br"
  },
  "/_nuxt/FavoriteComp.80bfa1cf.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"2fa-dNfiqVY7xZJY7enEMwx2rAKItNI\"",
    "mtime": "2024-01-11T12:27:01.912Z",
    "size": 762,
    "path": "../public/_nuxt/FavoriteComp.80bfa1cf.js.gz"
  },
  "/_nuxt/FavoriteComp.8e81f523.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b4-lsGgP5jRHSThKFOcRGIvyVCEaoY\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 4276,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c3-6Hr8F9t2RehGJAgnA7zPjv9oRyU\"",
    "mtime": "2024-01-11T12:27:01.923Z",
    "size": 963,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.br"
  },
  "/_nuxt/FavoriteComp.8e81f523.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"499-HUXQ1pH3vpUJuR0j6cDw+ub1sbU\"",
    "mtime": "2024-01-11T12:27:01.918Z",
    "size": 1177,
    "path": "../public/_nuxt/FavoriteComp.8e81f523.css.gz"
  },
  "/_nuxt/favorite_add.076c9a6b.png": {
    "type": "image/png",
    "etag": "\"7a8a-rSJrFtsGqQY50iGlnk5APPV0FOE\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 31370,
    "path": "../public/_nuxt/favorite_add.076c9a6b.png"
  },
  "/_nuxt/filter.b252e476.png": {
    "type": "image/png",
    "etag": "\"1878-UUlOzaSyX5v5WsCaxow+wEhtWmU\"",
    "mtime": "2024-01-11T12:26:55.155Z",
    "size": 6264,
    "path": "../public/_nuxt/filter.b252e476.png"
  },
  "/_nuxt/getTexts.b157011e.js": {
    "type": "application/javascript",
    "etag": "\"e1-AKBtcQQP93L7XO9Fh+4vFv0wZLU\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 225,
    "path": "../public/_nuxt/getTexts.b157011e.js"
  },
  "/_nuxt/ImageForm.983f17c2.js": {
    "type": "application/javascript",
    "etag": "\"1ac-FO4xaVNE+tCRkQaPrkD6LqkYC3U\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 428,
    "path": "../public/_nuxt/ImageForm.983f17c2.js"
  },
  "/_nuxt/index.0844d279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a38-EgX3cSSFif9b2P1Y05ptBHIRs94\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 2616,
    "path": "../public/_nuxt/index.0844d279.css"
  },
  "/_nuxt/index.0844d279.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"2d0-JBLRUd0IabAD06i3yJV2Cggtlrg\"",
    "mtime": "2024-01-11T12:27:01.931Z",
    "size": 720,
    "path": "../public/_nuxt/index.0844d279.css.br"
  },
  "/_nuxt/index.0844d279.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"379-diQkntOg9WdF+NDZl5IE6JBcp78\"",
    "mtime": "2024-01-11T12:27:01.926Z",
    "size": 889,
    "path": "../public/_nuxt/index.0844d279.css.gz"
  },
  "/_nuxt/index.25f5e90c.js": {
    "type": "application/javascript",
    "etag": "\"649-HABh+gf6FIzl4pIb7qfANxim9gY\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 1609,
    "path": "../public/_nuxt/index.25f5e90c.js"
  },
  "/_nuxt/index.25f5e90c.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"330-AsluD1EAlLrEAiLSWU+/0s3qf+I\"",
    "mtime": "2024-01-11T12:27:01.936Z",
    "size": 816,
    "path": "../public/_nuxt/index.25f5e90c.js.br"
  },
  "/_nuxt/index.25f5e90c.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"3bb-fGkiGqoVtyYV3/kyYwAgN1Gtpys\"",
    "mtime": "2024-01-11T12:27:01.932Z",
    "size": 955,
    "path": "../public/_nuxt/index.25f5e90c.js.gz"
  },
  "/_nuxt/index.28193b28.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5967-M+PKq8iC00iZOu+aZzZt8TzZ6+k\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 22887,
    "path": "../public/_nuxt/index.28193b28.css"
  },
  "/_nuxt/index.28193b28.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"12dc-amORM3zDNOPTvvryaylM0uPwJf0\"",
    "mtime": "2024-01-11T12:27:01.966Z",
    "size": 4828,
    "path": "../public/_nuxt/index.28193b28.css.br"
  },
  "/_nuxt/index.28193b28.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1651-Wk0uiZES4zQTFbZ0ZTVmJ0xg7tM\"",
    "mtime": "2024-01-11T12:27:01.937Z",
    "size": 5713,
    "path": "../public/_nuxt/index.28193b28.css.gz"
  },
  "/_nuxt/index.b7ed0eec.js": {
    "type": "application/javascript",
    "etag": "\"17af0-VguifvhTHwPSH1AyJ9SvgCT96ww\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 97008,
    "path": "../public/_nuxt/index.b7ed0eec.js"
  },
  "/_nuxt/index.b7ed0eec.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"6743-N8Rfb97fQVVEK/kIciRJfSNXUaY\"",
    "mtime": "2024-01-11T12:27:02.095Z",
    "size": 26435,
    "path": "../public/_nuxt/index.b7ed0eec.js.br"
  },
  "/_nuxt/index.b7ed0eec.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"758a-9qvdD2KQGua/5BNFQVBIAlmlktY\"",
    "mtime": "2024-01-11T12:27:01.970Z",
    "size": 30090,
    "path": "../public/_nuxt/index.b7ed0eec.js.gz"
  },
  "/_nuxt/index.d5a4eac8.js": {
    "type": "application/javascript",
    "etag": "\"3abf-6kOtP6eQ07vK2bd+XRjTYp5UHo4\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 15039,
    "path": "../public/_nuxt/index.d5a4eac8.js"
  },
  "/_nuxt/index.d5a4eac8.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"12ee-ahfCi7pwx1hNgjOW6eRdpBQQbEk\"",
    "mtime": "2024-01-11T12:27:02.114Z",
    "size": 4846,
    "path": "../public/_nuxt/index.d5a4eac8.js.br"
  },
  "/_nuxt/index.d5a4eac8.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"14f2-+hZ4VjjD46UXdhvvePSEA+scfVc\"",
    "mtime": "2024-01-11T12:27:02.097Z",
    "size": 5362,
    "path": "../public/_nuxt/index.d5a4eac8.js.gz"
  },
  "/_nuxt/isAuth.1ff5aa55.js": {
    "type": "application/javascript",
    "etag": "\"275-TgPH96/0Dm0XsQRALpZ9mRC4S+A\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 629,
    "path": "../public/_nuxt/isAuth.1ff5aa55.js"
  },
  "/_nuxt/LoadingComp.47badcbb.js": {
    "type": "application/javascript",
    "etag": "\"1fe-L0zlPRtDAYi1ezWxs2RhrRrlM34\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 510,
    "path": "../public/_nuxt/LoadingComp.47badcbb.js"
  },
  "/_nuxt/LoadingComp.c9d2ab2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fb-4zUkSJTRVq/qIIdi3nJC1fYnZ7I\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 1019,
    "path": "../public/_nuxt/LoadingComp.c9d2ab2a.css"
  },
  "/_nuxt/login.95dc446f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-6hrPQsHSc47u/Km0Bo/NzgZY9xM\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 2199,
    "path": "../public/_nuxt/login.95dc446f.css"
  },
  "/_nuxt/login.95dc446f.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25d-9SB4DVknKHJl0ODH31ETQfhNE1E\"",
    "mtime": "2024-01-11T12:27:02.126Z",
    "size": 605,
    "path": "../public/_nuxt/login.95dc446f.css.br"
  },
  "/_nuxt/login.95dc446f.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"309-C5J0Fhk5h547zivSt7NSdPDymn8\"",
    "mtime": "2024-01-11T12:27:02.122Z",
    "size": 777,
    "path": "../public/_nuxt/login.95dc446f.css.gz"
  },
  "/_nuxt/login.a7568176.js": {
    "type": "application/javascript",
    "etag": "\"b8e-IT5t2AVJRdBAS2xIQjCY6pztnL0\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 2958,
    "path": "../public/_nuxt/login.a7568176.js"
  },
  "/_nuxt/login.a7568176.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"4be-iCTdRPNOF/ASM4/Aecd7Nks3X0E\"",
    "mtime": "2024-01-11T12:27:02.132Z",
    "size": 1214,
    "path": "../public/_nuxt/login.a7568176.js.br"
  },
  "/_nuxt/login.a7568176.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"5a7-ux0mOgPYAuv32XlJfF1ZygW2iZI\"",
    "mtime": "2024-01-11T12:27:02.127Z",
    "size": 1447,
    "path": "../public/_nuxt/login.a7568176.js.gz"
  },
  "/_nuxt/newsList.3534fd2b.js": {
    "type": "application/javascript",
    "etag": "\"e6-eQqR1YkCVQeeAcgNE7VUoWVSzp8\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 230,
    "path": "../public/_nuxt/newsList.3534fd2b.js"
  },
  "/_nuxt/OrderProductList.32225cd6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f9-VnJFLUGUHgDXWTrq39o29kL+w7k\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 1273,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css"
  },
  "/_nuxt/OrderProductList.32225cd6.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1bd-d2lsR0HMu0b3SjZPqys7K2Mijis\"",
    "mtime": "2024-01-11T12:27:02.136Z",
    "size": 445,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.br"
  },
  "/_nuxt/OrderProductList.32225cd6.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"23d-jLdWFReqPrMmGExwjtkEVV3aRXg\"",
    "mtime": "2024-01-11T12:27:02.133Z",
    "size": 573,
    "path": "../public/_nuxt/OrderProductList.32225cd6.css.gz"
  },
  "/_nuxt/OrderProductList.a4a26136.js": {
    "type": "application/javascript",
    "etag": "\"431-l9aYiJG79MTxXmxStFC+FqlcalE\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 1073,
    "path": "../public/_nuxt/OrderProductList.a4a26136.js"
  },
  "/_nuxt/OrderProductList.a4a26136.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"20d-K1pENxeNh4rDMToWqXyuq3yUNmc\"",
    "mtime": "2024-01-11T12:27:02.140Z",
    "size": 525,
    "path": "../public/_nuxt/OrderProductList.a4a26136.js.br"
  },
  "/_nuxt/OrderProductList.a4a26136.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"24a-rX89saqNKp02kD0sVVSZlZl+B8s\"",
    "mtime": "2024-01-11T12:27:02.137Z",
    "size": 586,
    "path": "../public/_nuxt/OrderProductList.a4a26136.js.gz"
  },
  "/_nuxt/orders.3cf48804.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"222f-QrHG9Ltmpzerm1WOogwc6QNngfw\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 8751,
    "path": "../public/_nuxt/orders.3cf48804.css"
  },
  "/_nuxt/orders.3cf48804.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"683-Jv9kGzzsnTCUgzs9TDUY3GM6sL0\"",
    "mtime": "2024-01-11T12:27:02.152Z",
    "size": 1667,
    "path": "../public/_nuxt/orders.3cf48804.css.br"
  },
  "/_nuxt/orders.3cf48804.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7a2-In/G2gYWU30UNlLnqffLUtaFlG0\"",
    "mtime": "2024-01-11T12:27:02.141Z",
    "size": 1954,
    "path": "../public/_nuxt/orders.3cf48804.css.gz"
  },
  "/_nuxt/orders.b95a9335.js": {
    "type": "application/javascript",
    "etag": "\"2595-MxDjmeaQEUXjzqHsBCyMMEiQC9o\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 9621,
    "path": "../public/_nuxt/orders.b95a9335.js"
  },
  "/_nuxt/orders.b95a9335.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"b0c-8mW+1tEee9hKuNN3t4SblC3+0Ao\"",
    "mtime": "2024-01-11T12:27:02.165Z",
    "size": 2828,
    "path": "../public/_nuxt/orders.b95a9335.js.br"
  },
  "/_nuxt/orders.b95a9335.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"cfd-eDnAKOORbZOnsMycDfu9HIMlVjs\"",
    "mtime": "2024-01-11T12:27:02.153Z",
    "size": 3325,
    "path": "../public/_nuxt/orders.b95a9335.js.gz"
  },
  "/_nuxt/profile.634699de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645e-jBNSzeYlWOe9GOWLJ8A1QU1AwVQ\"",
    "mtime": "2024-01-11T12:26:55.153Z",
    "size": 25694,
    "path": "../public/_nuxt/profile.634699de.css"
  },
  "/_nuxt/profile.634699de.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"7c0-LMEBdbQb3Hx46LUI/rFc+2Y615Y\"",
    "mtime": "2024-01-11T12:27:02.207Z",
    "size": 1984,
    "path": "../public/_nuxt/profile.634699de.css.br"
  },
  "/_nuxt/profile.634699de.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"b44-Y8LG6RvZhJNxvI2iI6vIke89cSc\"",
    "mtime": "2024-01-11T12:27:02.167Z",
    "size": 2884,
    "path": "../public/_nuxt/profile.634699de.css.gz"
  },
  "/_nuxt/profile.6888ea12.js": {
    "type": "application/javascript",
    "etag": "\"169d-r9ScBtYOso1d/qYeY1DmXJ59zEk\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 5789,
    "path": "../public/_nuxt/profile.6888ea12.js"
  },
  "/_nuxt/profile.6888ea12.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"843-zcMG//fugu9RMWEgRJj9JmbbWwU\"",
    "mtime": "2024-01-11T12:27:02.216Z",
    "size": 2115,
    "path": "../public/_nuxt/profile.6888ea12.js.br"
  },
  "/_nuxt/profile.6888ea12.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"9a9-VdjjRl+WvJ5hlK+Pjf47PmjpOeI\"",
    "mtime": "2024-01-11T12:27:02.208Z",
    "size": 2473,
    "path": "../public/_nuxt/profile.6888ea12.js.gz"
  },
  "/_nuxt/register.7b4065df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"897-QcZfhvmrDkA34FyeEwyZ0IkkzUU\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 2199,
    "path": "../public/_nuxt/register.7b4065df.css"
  },
  "/_nuxt/register.7b4065df.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"25e-AfBvNQB5cmrTBc6k5HWo6hkbsaY\"",
    "mtime": "2024-01-11T12:27:02.222Z",
    "size": 606,
    "path": "../public/_nuxt/register.7b4065df.css.br"
  },
  "/_nuxt/register.7b4065df.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"308-te8CNQHCPeO3j8NYkUTMR0kRJAU\"",
    "mtime": "2024-01-11T12:27:02.218Z",
    "size": 776,
    "path": "../public/_nuxt/register.7b4065df.css.gz"
  },
  "/_nuxt/register.f1416318.js": {
    "type": "application/javascript",
    "etag": "\"11bd-Fz8rlWuu9Q2+pN5XpHdXr+hvLb4\"",
    "mtime": "2024-01-11T12:26:55.162Z",
    "size": 4541,
    "path": "../public/_nuxt/register.f1416318.js"
  },
  "/_nuxt/register.f1416318.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"5bb-BF2Uujif4fuTKAklYubKPqZUix4\"",
    "mtime": "2024-01-11T12:27:02.231Z",
    "size": 1467,
    "path": "../public/_nuxt/register.f1416318.js.br"
  },
  "/_nuxt/register.f1416318.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"6f6-9gkUEu1ynXwEKvkX5U0GpmNy0LY\"",
    "mtime": "2024-01-11T12:27:02.223Z",
    "size": 1782,
    "path": "../public/_nuxt/register.f1416318.js.gz"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-2yaaYycA0m8qtzjgv20acUfyqrc\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 1514,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"285-UlRV60ChvqAvqfMM2s3XKThtwLs\"",
    "mtime": "2024-01-11T12:27:02.236Z",
    "size": 645,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.br"
  },
  "/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2ce-b/XntxU0PdSAFxKkGEWY93iuRiQ\"",
    "mtime": "2024-01-11T12:27:02.232Z",
    "size": 718,
    "path": "../public/_nuxt/shopping-cart_icon-icons.com_69303.65d78e34.svg.gz"
  },
  "/_nuxt/sot.416737b6.png": {
    "type": "image/png",
    "etag": "\"49361-sRnQl4stPY8gusZTfKuvfEpSMtc\"",
    "mtime": "2024-01-11T12:26:55.156Z",
    "size": 299873,
    "path": "../public/_nuxt/sot.416737b6.png"
  },
  "/_nuxt/UserBasket.5cb362d9.js": {
    "type": "application/javascript",
    "etag": "\"1897-qZY4xNkyqEZDaf32E1qoksq8pNc\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 6295,
    "path": "../public/_nuxt/UserBasket.5cb362d9.js"
  },
  "/_nuxt/UserBasket.5cb362d9.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"922-Ebfksk+Sk5jcPxw07jSJQqH+La4\"",
    "mtime": "2024-01-11T12:27:02.247Z",
    "size": 2338,
    "path": "../public/_nuxt/UserBasket.5cb362d9.js.br"
  },
  "/_nuxt/UserBasket.5cb362d9.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"a70-No0v5AZsuzlw9ZDHZQKk8afDqb4\"",
    "mtime": "2024-01-11T12:27:02.238Z",
    "size": 2672,
    "path": "../public/_nuxt/UserBasket.5cb362d9.js.gz"
  },
  "/_nuxt/UserBasket.672bdfaf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3477-n+B+g7A8GCCCcS51ql0duulST+8\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 13431,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css"
  },
  "/_nuxt/UserBasket.672bdfaf.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"68a-7D1DHQPRGKzO78LM+fseVrNUCoI\"",
    "mtime": "2024-01-11T12:27:02.267Z",
    "size": 1674,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.br"
  },
  "/_nuxt/UserBasket.672bdfaf.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"868-HE/GDPuDK1wnFzc+YSJe+pLykm8\"",
    "mtime": "2024-01-11T12:27:02.248Z",
    "size": 2152,
    "path": "../public/_nuxt/UserBasket.672bdfaf.css.gz"
  },
  "/_nuxt/vag_world_bold.a8b3128a.woff": {
    "type": "font/woff",
    "etag": "\"19e18-tVLjJXgwBajjaaN+nIhf7RYY1B0\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 106008,
    "path": "../public/_nuxt/vag_world_bold.a8b3128a.woff"
  },
  "/_nuxt/_id_.2f3b9864.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2af3-Q35Ee/vUBkY94yBSXCYE97l7r1s\"",
    "mtime": "2024-01-11T12:26:55.160Z",
    "size": 10995,
    "path": "../public/_nuxt/_id_.2f3b9864.css"
  },
  "/_nuxt/_id_.2f3b9864.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"500-8VuSf8wCzy8UmonH7iCgZCarHW8\"",
    "mtime": "2024-01-11T12:27:02.284Z",
    "size": 1280,
    "path": "../public/_nuxt/_id_.2f3b9864.css.br"
  },
  "/_nuxt/_id_.2f3b9864.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"686-8iGGZ/vmF+VKpGZv0E61Soj0UNU\"",
    "mtime": "2024-01-11T12:27:02.268Z",
    "size": 1670,
    "path": "../public/_nuxt/_id_.2f3b9864.css.gz"
  },
  "/_nuxt/_id_.52a74c7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a2-0h5kGk5dzSRzXsqR5mxapYE0lKw\"",
    "mtime": "2024-01-11T12:26:55.157Z",
    "size": 930,
    "path": "../public/_nuxt/_id_.52a74c7d.css"
  },
  "/_nuxt/_id_.9bf10017.js": {
    "type": "application/javascript",
    "etag": "\"531-EZE6F3HVKoOwHJWmaC1CRaNoBWI\"",
    "mtime": "2024-01-11T12:26:55.161Z",
    "size": 1329,
    "path": "../public/_nuxt/_id_.9bf10017.js"
  },
  "/_nuxt/_id_.9bf10017.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"2a1-7gSwLnPgmTK2XVXolaJp1RekpC8\"",
    "mtime": "2024-01-11T12:27:02.289Z",
    "size": 673,
    "path": "../public/_nuxt/_id_.9bf10017.js.br"
  },
  "/_nuxt/_id_.9bf10017.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"32d-+BQ19Tf+7WnDkk4Sgv5X5C8ySLY\"",
    "mtime": "2024-01-11T12:27:02.286Z",
    "size": 813,
    "path": "../public/_nuxt/_id_.9bf10017.js.gz"
  },
  "/_nuxt/_id_.bef370f7.js": {
    "type": "application/javascript",
    "etag": "\"12e4-gL36SD17Dp2QDgybE3Pl8R8H4Yw\"",
    "mtime": "2024-01-11T12:26:55.163Z",
    "size": 4836,
    "path": "../public/_nuxt/_id_.bef370f7.js"
  },
  "/_nuxt/_id_.bef370f7.js.br": {
    "type": "application/javascript",
    "encoding": "br",
    "etag": "\"765-7E84tPF4PZFB6F2oqxR6JzJUb4s\"",
    "mtime": "2024-01-11T12:27:02.297Z",
    "size": 1893,
    "path": "../public/_nuxt/_id_.bef370f7.js.br"
  },
  "/_nuxt/_id_.bef370f7.js.gz": {
    "type": "application/javascript",
    "encoding": "gzip",
    "etag": "\"85d-MJqWLsUcO+roaC+GCuX5NtzeI9k\"",
    "mtime": "2024-01-11T12:27:02.291Z",
    "size": 2141,
    "path": "../public/_nuxt/_id_.bef370f7.js.gz"
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
