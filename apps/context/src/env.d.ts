/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: import('@cloudflare/workers-types').D1Database;
    PRIVATE_DB: import('@cloudflare/workers-types').D1Database;
    ASSETS: import('@cloudflare/workers-types').Fetcher;
  }
}

declare namespace App {
  interface Locals {
    cfContext: import('@cloudflare/workers-types').ExecutionContext;
  }
}
