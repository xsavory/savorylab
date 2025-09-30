// @ts-nocheck
// eslint-disable-next-line
export { handleRequest as default } from "https://deno.land/x/turbofan/mod.ts";

export const config = {
  method: ["GET", "PUT"],
  path: "/v8/artifacts/:hash",
  cache: "manual",
};