import { createPagesFunctionHandler } from '@react-router/cloudflare';

// @ts-expect-error - virtual module from build
import * as serverBuild from '../build/server';

export const onRequest = createPagesFunctionHandler({
  build: serverBuild,
  getLoadContext: (ctx) => {
    // ctx.context.cloudflare에 D1 바인딩이 포함됨
    // React Router loader가 기대하는 형태: context.cloudflare.env.DB
    return ctx.context;
  },
});
