// src/types/xss-clean.d.ts

declare module "xss-clean" {
  import { RequestHandler } from "express";

  /**
   * XSS Clean middleware for Express
   * Sanitizes user input coming from POST body, GET queries, and url params
   */
  function xssClean(): RequestHandler;

  export = xssClean;
}
