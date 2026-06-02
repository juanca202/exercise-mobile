import type { LoginCredentials } from "../lib/types";

export const DEMO_USERNAME = "demo.user";
export const DEMO_PASSWORD = "demo1234";

export function validDemoCredentials(): LoginCredentials {
  return {
    username: DEMO_USERNAME,
    password: DEMO_PASSWORD,
  };
}

export function invalidCredentials(): LoginCredentials {
  return {
    username: "wrong.user",
    password: "wrongpass",
  };
}

export function emptyCredentials(): LoginCredentials {
  return {
    username: "",
    password: "",
  };
}
