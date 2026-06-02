import { afterEach, describe, expect, it } from "vitest";

import {
  AUTH_SESSION_COOKIE,
  hasValidSessionCookie,
  parseSessionCookie,
  readSessionCookie,
  serializeSession,
  setSessionCookie,
} from "./auth-session";

function setDocumentCookie(value: string): void {
  Object.defineProperty(document, "cookie", {
    configurable: true,
    writable: true,
    value,
  });
}

describe("auth-session", () => {
  afterEach(() => {
    setDocumentCookie("");
  });

  it("serializes and parses session payload", () => {
    const payload = serializeSession("demo.user");

    expect(parseSessionCookie(payload)).toEqual({ username: "demo.user" });
    expect(hasValidSessionCookie(payload)).toBe(true);
  });

  it("returns null for invalid cookie payload", () => {
    expect(parseSessionCookie("not-json")).toBeNull();
    expect(hasValidSessionCookie(undefined)).toBe(false);
  });

  it("writes and reads session cookie in the browser", () => {
    setSessionCookie("demo.user");

    expect(readSessionCookie()).toEqual({ username: "demo.user" });
    expect(document.cookie).toContain(AUTH_SESSION_COOKIE);
  });

  it("returns null for empty username in parsed payload", () => {
    expect(parseSessionCookie(JSON.stringify({ username: "" }))).toBeNull();
  });

  it("returns null when document is unavailable", () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error simulate server runtime
    delete globalThis.document;

    expect(readSessionCookie()).toBeNull();

    globalThis.document = originalDocument;
  });
});
