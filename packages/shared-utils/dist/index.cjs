"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  cn: () => cn,
  formatCompact: () => formatCompact,
  formatCurrency: () => formatCurrency,
  formatDate: () => formatDate,
  formatRelativeTime: () => formatRelativeTime,
  isNonEmpty: () => isNonEmpty,
  isPositiveNumber: () => isPositiveNumber,
  isValidEmail: () => isValidEmail,
  isValidUrl: () => isValidUrl
});
module.exports = __toCommonJS(index_exports);

// src/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/formatters.ts
function formatCurrency(amount, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
}
function formatCompact(value, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short"
  }).format(value);
}
function formatDate(date, locale = "en-US", options) {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, __spreadValues({
    year: "numeric",
    month: "short",
    day: "numeric"
  }, options)).format(d);
}
function formatRelativeTime(date, locale = "en-US") {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1e3);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (diffDays > 0) return rtf.format(-diffDays, "day");
  if (diffHours > 0) return rtf.format(-diffHours, "hour");
  if (diffMinutes > 0) return rtf.format(-diffMinutes, "minute");
  return rtf.format(-diffSeconds, "second");
}

// src/validators.ts
function isNonEmpty(value) {
  return value != null && value.trim().length > 0;
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
}
function isPositiveNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cn,
  formatCompact,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  isNonEmpty,
  isPositiveNumber,
  isValidEmail,
  isValidUrl
});
//# sourceMappingURL=index.cjs.map