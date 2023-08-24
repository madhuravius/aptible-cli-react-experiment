import dev from "./envs/dev.json" assert { type: "json" };
import prod from "./envs/prod.json" assert { type: "json" };
import * as esbuild from "esbuild";

// npx esbuild src/cli.tsx --bundle --outdir=dist --tsconfig=tsconfig.json --platform=node --format=esm --alias:@app=node_modules/app-ui/src

// const metaEnv = process.env.NODE_ENV === "production" ? prod : dev;
const metaEnv = prod

await esbuild.build({
  entryPoints: ["src/cli.tsx"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  define: {
    global: "window",
  },
  target: "esnext",
  platform: "node",
  logLevel: "info",
  minify: false, // true
  alias: { "@app": "node_modules/app-ui/src" },
  tsconfig: "tsconfig.json",
  banner: {
    js: `
          import { Request, Response, fetch } from "@remix-run/web-fetch";
	  import { JSDOM } from 'jsdom';
	  import { LocalStorage } from 'node-localstorage';
      	  import { createRequire as _createRequire } from 'node:module';
	  import.meta.env = ${JSON.stringify(metaEnv)};
          const require = _createRequire(import.meta.url);
	  global.localStorage = new LocalStorage('./dist/localstorage');
          global.sessionStorage = global.localStorage;
	  global.window = new JSDOM('<html></html').window;
	  Object.defineProperty(global.window, 'localStorage', { value: global.localStorage });
	  Object.defineProperty(global.window, 'sessionStorage', { value: global.sessionStorage});
	  global.document = global.window.document;
   	  global.navigator = {
	    userAgent: 'node.js'
	  };
          if (!globalThis.fetch) {
            global.fetch = fetch;
            global.Request = Request;
            global.Response = Response;
          }
        `,
  },
  external: ["yoga-wasm-web"],
});
