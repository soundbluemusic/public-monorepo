/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

interface CloudflareEnv {
  DB: import('@cloudflare/workers-types').D1Database;
  PRIVATE_DB: import('@cloudflare/workers-types').D1Database;
  ASSETS: import('@cloudflare/workers-types').Fetcher;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
    };
  }
}
