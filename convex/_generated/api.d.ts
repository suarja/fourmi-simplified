/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as domain_facts from "../domain/facts.js";
import type * as domain_transactions from "../domain/transactions.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as lib_extraction from "../lib/extraction.js";
import type * as lib_financial from "../lib/financial.js";
import type * as lib_validation from "../lib/validation.js";
import type * as profiles from "../profiles.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  conversations: typeof conversations;
  "domain/facts": typeof domain_facts;
  "domain/transactions": typeof domain_transactions;
  files: typeof files;
  http: typeof http;
  "lib/extraction": typeof lib_extraction;
  "lib/financial": typeof lib_financial;
  "lib/validation": typeof lib_validation;
  profiles: typeof profiles;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
