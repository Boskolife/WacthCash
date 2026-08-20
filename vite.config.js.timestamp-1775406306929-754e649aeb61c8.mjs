var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// scripts/convertToWebp.js
var convertToWebp_exports = {};
__export(convertToWebp_exports, {
  convertFile: () => convertFile,
  run: () => run,
  startWatch: () => startWatch
});
import fs2 from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "file:///D:/Repositories/WacthCash/node_modules/sharp/lib/index.js";
function walkDir(dir, fileList = []) {
  if (!fs2.existsSync(dir))
    return fileList;
  const entries = fs2.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (extensions.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}
async function convertFile(inputPath) {
  const parsed = path.parse(inputPath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
  await sharp(inputPath).webp({ quality: 85 }).toFile(webpPath);
  console.log(`[convertToWebp] ${path.relative(publicDir, inputPath)} -> ${path.relative(publicDir, webpPath)}`);
}
async function run() {
  const files = walkDir(publicDir);
  if (files.length === 0) {
    console.log("[convertToWebp] No PNG/JPEG files found in public/");
    return;
  }
  for (const file of files) {
    try {
      await convertFile(file);
    } catch (err) {
      console.error(`[convertToWebp] Error converting ${file}:`, err.message);
    }
  }
}
function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}
function startWatch() {
  if (!fs2.existsSync(publicDir)) {
    console.log("[convertToWebp] public/ not found, skipping watch");
    return;
  }
  const convertDebounced = debounce(async (fullPath) => {
    if (!extensions.test(fullPath))
      return;
    try {
      await convertFile(fullPath);
    } catch (err) {
      console.error(`[convertToWebp] Error converting ${fullPath}:`, err.message);
    }
  }, 300);
  fs2.watch(publicDir, { recursive: true }, (event, filename) => {
    if (!filename)
      return;
    const fullPath = path.join(publicDir, filename);
    if (!extensions.test(filename))
      return;
    convertDebounced(fullPath);
  });
  console.log("[convertToWebp] Watching public/ for new or changed images...");
}
function isMainModule() {
  try {
    const scriptPath = fileURLToPath(__vite_injected_original_import_meta_url);
    return process.argv[1] && path.resolve(process.argv[1]) === path.resolve(scriptPath);
  } catch {
    return false;
  }
}
var __vite_injected_original_import_meta_url, __dirname2, publicDir, extensions;
var init_convertToWebp = __esm({
  "scripts/convertToWebp.js"() {
    "use strict";
    __vite_injected_original_import_meta_url = "file:///D:/Repositories/WacthCash/scripts/convertToWebp.js";
    __dirname2 = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
    publicDir = path.resolve(__dirname2, "..", "public");
    extensions = /\.(png|jpe?g)$/i;
    if (isMainModule()) {
      if (process.argv.includes("--watch")) {
        run().then(startWatch);
      } else {
        run();
      }
    }
  }
});

// vite.config.js
import { resolve as resolve2 } from "path";
import { defineConfig } from "file:///D:/Repositories/WacthCash/node_modules/vite/dist/node/index.js";
import handlebars from "file:///D:/Repositories/WacthCash/node_modules/vite-plugin-handlebars/dist/index.js";

// getHTMLFileNames.js
import fs from "fs";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\Repositories\\WacthCash";
var srcDir = resolve(__vite_injected_original_dirname, "src");
var htmlFiles = fs.readdirSync(srcDir).filter((file) => file.endsWith(".html") && file !== "index.html");

// vite.config.js
var __vite_injected_original_dirname2 = "D:\\Repositories\\WacthCash";
var base = "/WatchCash/";
function pictureHelper(pathOrSrc, options = {}) {
  const src = typeof pathOrSrc === "string" ? pathOrSrc : "";
  const hash = options.hash || {};
  const alt = hash.alt != null ? String(hash.alt) : "";
  const className = hash.class != null ? ` class="${String(hash.class)}"` : "";
  const loading = hash.loading != null ? String(hash.loading) : "lazy";
  const width = hash.width != null ? ` width="${Number(hash.width)}"` : "";
  const height = hash.height != null ? ` height="${Number(hash.height)}"` : "";
  const sources = hash.sources || [];
  const normalized = src.replace(/^\//, "");
  const imgPath = normalized;
  const webpPath = normalized.replace(/\.(png|jpe?g)$/i, ".webp");
  let sourcesHtml = "";
  if (Array.isArray(sources) && sources.length > 0) {
    sources.forEach((source) => {
      if (source && typeof source === "object") {
        const media = source.media ? ` media="${String(source.media).replace(/"/g, "&quot;")}"` : "";
        const srcset = source.srcset || source.src || "";
        const type = source.type ? ` type="${String(source.type).replace(/"/g, "&quot;")}"` : "";
        if (srcset) {
          const normalizedSrcset = srcset.replace(/^\//, "");
          sourcesHtml += `<source${media} srcset="${normalizedSrcset}"${type}>`;
        }
      }
    });
  }
  return `<picture${className}>` + sourcesHtml + `<source srcset="${webpPath}" type="image/webp"><img src="${imgPath}" alt="${alt.replace(
    /"/g,
    "&quot;"
  )}" loading="${loading}"${width}${height}></picture>`;
}
var input = { main: resolve2(__vite_injected_original_dirname2, "src/index.html") };
htmlFiles.forEach((file) => {
  input[file.replace(".html", "")] = resolve2(__vite_injected_original_dirname2, "src", file);
});
var webpConvertPlugin = () => ({
  name: "webp-convert",
  buildStart: async () => {
    const { run: run2 } = await Promise.resolve().then(() => (init_convertToWebp(), convertToWebp_exports));
    await run2();
  },
  configureServer: () => {
    Promise.resolve().then(() => (init_convertToWebp(), convertToWebp_exports)).then(({ startWatch: startWatch2 }) => startWatch2());
  }
});
var handlebarsReloadPlugin = () => {
  return {
    name: "handlebars-reload",
    handleHotUpdate({ file, server }) {
      const normalizedPath = file.replace(/\\/g, "/");
      if (normalizedPath.includes("/templates/") || normalizedPath.includes("/sections/") || normalizedPath.includes("/profile/")) {
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
        return [];
      }
    },
    configureServer(server) {
      const templatesDir = resolve2(__vite_injected_original_dirname2, "src/templates");
      const sectionsDir = resolve2(__vite_injected_original_dirname2, "src/sections");
      const profilePanelsDir = resolve2(__vite_injected_original_dirname2, "src/profile/panels");
      server.watcher.add([templatesDir, sectionsDir, profilePanelsDir]);
    }
  };
};
var vite_config_default = defineConfig({
  base: "/WatchCash",
  root: "src",
  publicDir: "../public",
  plugins: [
    webpConvertPlugin(),
    handlebars({
      partialDirectory: [
        resolve2(__vite_injected_original_dirname2, "src/templates"),
        resolve2(__vite_injected_original_dirname2, "src/sections"),
        resolve2(__vite_injected_original_dirname2, "src/profile/panels")
      ],
      reloadOnPartialChange: true,
      context: { base },
      helpers: {
        picture: pictureHelper,
        array: function(...args) {
          const items = args.slice(0, -1);
          return items;
        },
        object: function(...args) {
          const options = args[args.length - 1];
          return options.hash || {};
        }
      }
    }),
    handlebarsReloadPlugin()
  ],
  server: {
    port: 3e3,
    host: true,
    open: true
  },
  build: {
    rollupOptions: {
      input
    },
    outDir: "../dist/",
    emptyOutDir: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyaXB0cy9jb252ZXJ0VG9XZWJwLmpzIiwgInZpdGUuY29uZmlnLmpzIiwgImdldEhUTUxGaWxlTmFtZXMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSZXBvc2l0b3JpZXNcXFxcV2FjdGhDYXNoXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFJlcG9zaXRvcmllc1xcXFxXYWN0aENhc2hcXFxcc2NyaXB0c1xcXFxjb252ZXJ0VG9XZWJwLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9SZXBvc2l0b3JpZXMvV2FjdGhDYXNoL3NjcmlwdHMvY29udmVydFRvV2VicC5qc1wiOy8qKlxuICogQ29udmVydHMgUE5HIGFuZCBKUEVHIGltYWdlcyBpbiB0aGUgcHVibGljIGRpcmVjdG9yeSB0byBXZWJQIGZvcm1hdC5cbiAqIFdlYlAgZmlsZXMgYXJlIHBsYWNlZCBuZXh0IHRvIG9yaWdpbmFscyAoZS5nLiBpbWFnZS5wbmcgLT4gaW1hZ2Uud2VicCkuXG4gKiBSdW4gYmVmb3JlIGJ1aWxkIHNvIHt7cGljdHVyZX19IGhlbHBlciBjYW4gcmVmZXJlbmNlIGJvdGggZm9ybWF0cy5cbiAqIFVzYWdlOiBub2RlIHNjcmlwdHMvY29udmVydFRvV2VicC5qcyBbLS13YXRjaF1cbiAqL1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgc2hhcnAgZnJvbSAnc2hhcnAnO1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcbmNvbnN0IHB1YmxpY0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdwdWJsaWMnKTtcbmNvbnN0IGV4dGVuc2lvbnMgPSAvXFwuKHBuZ3xqcGU/ZykkL2k7XG5cbmZ1bmN0aW9uIHdhbGtEaXIoZGlyLCBmaWxlTGlzdCA9IFtdKSB7XG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSByZXR1cm4gZmlsZUxpc3Q7XG4gIGNvbnN0IGVudHJpZXMgPSBmcy5yZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyLCBlbnRyeS5uYW1lKTtcbiAgICBpZiAoZW50cnkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgd2Fsa0RpcihmdWxsUGF0aCwgZmlsZUxpc3QpO1xuICAgIH0gZWxzZSBpZiAoZXh0ZW5zaW9ucy50ZXN0KGVudHJ5Lm5hbWUpKSB7XG4gICAgICBmaWxlTGlzdC5wdXNoKGZ1bGxQYXRoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpbGVMaXN0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29udmVydEZpbGUoaW5wdXRQYXRoKSB7XG4gIGNvbnN0IHBhcnNlZCA9IHBhdGgucGFyc2UoaW5wdXRQYXRoKTtcbiAgY29uc3Qgd2VicFBhdGggPSBwYXRoLmpvaW4ocGFyc2VkLmRpciwgYCR7cGFyc2VkLm5hbWV9LndlYnBgKTtcbiAgYXdhaXQgc2hhcnAoaW5wdXRQYXRoKVxuICAgIC53ZWJwKHsgcXVhbGl0eTogODUgfSlcbiAgICAudG9GaWxlKHdlYnBQYXRoKTtcbiAgY29uc29sZS5sb2coYFtjb252ZXJ0VG9XZWJwXSAke3BhdGgucmVsYXRpdmUocHVibGljRGlyLCBpbnB1dFBhdGgpfSAtPiAke3BhdGgucmVsYXRpdmUocHVibGljRGlyLCB3ZWJwUGF0aCl9YCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gIGNvbnN0IGZpbGVzID0gd2Fsa0RpcihwdWJsaWNEaXIpO1xuICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5sb2coJ1tjb252ZXJ0VG9XZWJwXSBObyBQTkcvSlBFRyBmaWxlcyBmb3VuZCBpbiBwdWJsaWMvJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjb252ZXJ0RmlsZShmaWxlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjb252ZXJ0VG9XZWJwXSBFcnJvciBjb252ZXJ0aW5nICR7ZmlsZX06YCwgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgbXMpIHtcbiAgbGV0IHRpbWVvdXQ7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiBmbiguLi5hcmdzKSwgbXMpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHB1YmxpY0RpcikpIHtcbiAgICBjb25zb2xlLmxvZygnW2NvbnZlcnRUb1dlYnBdIHB1YmxpYy8gbm90IGZvdW5kLCBza2lwcGluZyB3YXRjaCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBjb252ZXJ0RGVib3VuY2VkID0gZGVib3VuY2UoYXN5bmMgKGZ1bGxQYXRoKSA9PiB7XG4gICAgaWYgKCFleHRlbnNpb25zLnRlc3QoZnVsbFBhdGgpKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNvbnZlcnRGaWxlKGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjb252ZXJ0VG9XZWJwXSBFcnJvciBjb252ZXJ0aW5nICR7ZnVsbFBhdGh9OmAsIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH0sIDMwMCk7XG5cbiAgZnMud2F0Y2gocHVibGljRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LCAoZXZlbnQsIGZpbGVuYW1lKSA9PiB7XG4gICAgaWYgKCFmaWxlbmFtZSkgcmV0dXJuO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKHB1YmxpY0RpciwgZmlsZW5hbWUpO1xuICAgIGlmICghZXh0ZW5zaW9ucy50ZXN0KGZpbGVuYW1lKSkgcmV0dXJuO1xuICAgIGNvbnZlcnREZWJvdW5jZWQoZnVsbFBhdGgpO1xuICB9KTtcblxuICBjb25zb2xlLmxvZygnW2NvbnZlcnRUb1dlYnBdIFdhdGNoaW5nIHB1YmxpYy8gZm9yIG5ldyBvciBjaGFuZ2VkIGltYWdlcy4uLicpO1xufVxuXG5mdW5jdGlvbiBpc01haW5Nb2R1bGUoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2NyaXB0UGF0aCA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbiAgICByZXR1cm4gcHJvY2Vzcy5hcmd2WzFdICYmIHBhdGgucmVzb2x2ZShwcm9jZXNzLmFyZ3ZbMV0pID09PSBwYXRoLnJlc29sdmUoc2NyaXB0UGF0aCk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5pZiAoaXNNYWluTW9kdWxlKCkpIHtcbiAgaWYgKHByb2Nlc3MuYXJndi5pbmNsdWRlcygnLS13YXRjaCcpKSB7XG4gICAgcnVuKCkudGhlbihzdGFydFdhdGNoKTtcbiAgfSBlbHNlIHtcbiAgICBydW4oKTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSZXBvc2l0b3JpZXNcXFxcV2FjdGhDYXNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxSZXBvc2l0b3JpZXNcXFxcV2FjdGhDYXNoXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9SZXBvc2l0b3JpZXMvV2FjdGhDYXNoL3ZpdGUuY29uZmlnLmpzXCI7LyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGhhbmRsZWJhcnMgZnJvbSAndml0ZS1wbHVnaW4taGFuZGxlYmFycyc7XG5pbXBvcnQgeyBodG1sRmlsZXMgfSBmcm9tICcuL2dldEhUTUxGaWxlTmFtZXMnO1xuXG5jb25zdCBiYXNlID0gJy9XYXRjaENhc2gvJztcblxuLyoqXG4gKiBSZW5kZXJzIDxwaWN0dXJlPiB3aXRoIFdlYlAgc291cmNlIGFuZCBQTkcvSlBFRyBmYWxsYmFjay5cbiAqIFVzYWdlOiB7e3twaWN0dXJlIFwiL2ltYWdlcy9waG90by5wbmdcIiBhbHQ9XCJEZXNjcmlwdGlvblwifX19ICh0cmlwbGUgYnJhY2VzIGZvciByYXcgSFRNTClcbiAqIE9wdGlvbmFsIGhhc2g6IGFsdCwgY2xhc3MsIGxvYWRpbmcgKGRlZmF1bHQgXCJsYXp5XCIpLCB3aWR0aCwgaGVpZ2h0LCBzb3VyY2VzIChhcnJheSBvZiBvYmplY3RzIHdpdGggbWVkaWEgYW5kIHNyY3NldClcbiAqIFxuICogRXhhbXBsZSB3aXRoIG1lZGlhIHF1ZXJpZXM6XG4gKiB7e3twaWN0dXJlIFwiL2ltYWdlcy9oZXJvLnBuZ1wiIGFsdD1cIkhlcm9cIiBzb3VyY2VzPShhcnJheSAob2JqZWN0IG1lZGlhPVwiKG1heC13aWR0aDogNzY4cHgpXCIgc3Jjc2V0PVwiL2ltYWdlcy9oZXJvLW1vYmlsZS5wbmdcIikgKG9iamVjdCBtZWRpYT1cIihtaW4td2lkdGg6IDc2OXB4KVwiIHNyY3NldD1cIi9pbWFnZXMvaGVyby1kZXNrdG9wLnBuZ1wiKSl9fX1cbiAqL1xuZnVuY3Rpb24gcGljdHVyZUhlbHBlcihwYXRoT3JTcmMsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBzcmMgPSB0eXBlb2YgcGF0aE9yU3JjID09PSAnc3RyaW5nJyA/IHBhdGhPclNyYyA6ICcnO1xuICBjb25zdCBoYXNoID0gb3B0aW9ucy5oYXNoIHx8IHt9O1xuICBjb25zdCBhbHQgPSBoYXNoLmFsdCAhPSBudWxsID8gU3RyaW5nKGhhc2guYWx0KSA6ICcnO1xuICBjb25zdCBjbGFzc05hbWUgPSBoYXNoLmNsYXNzICE9IG51bGwgPyBgIGNsYXNzPVwiJHtTdHJpbmcoaGFzaC5jbGFzcyl9XCJgIDogJyc7XG4gIGNvbnN0IGxvYWRpbmcgPSBoYXNoLmxvYWRpbmcgIT0gbnVsbCA/IFN0cmluZyhoYXNoLmxvYWRpbmcpIDogJ2xhenknO1xuICBjb25zdCB3aWR0aCA9IGhhc2gud2lkdGggIT0gbnVsbCA/IGAgd2lkdGg9XCIke051bWJlcihoYXNoLndpZHRoKX1cImAgOiAnJztcbiAgY29uc3QgaGVpZ2h0ID0gaGFzaC5oZWlnaHQgIT0gbnVsbCA/IGAgaGVpZ2h0PVwiJHtOdW1iZXIoaGFzaC5oZWlnaHQpfVwiYCA6ICcnO1xuICBjb25zdCBzb3VyY2VzID0gaGFzaC5zb3VyY2VzIHx8IFtdO1xuXG4gIC8vIFVzZSByZWxhdGl2ZSBwYXRoIHNvIGJyb3dzZXIgcmVzb2x2ZXMgb25jZSB3aXRoIGRvY3VtZW50IDxiYXNlIGhyZWY9XCIvV2FjdGhDYXNoL1wiPiAoYXZvaWRzIC9XYWN0aENhc2gvV2FjdGhDYXNoLy4uLilcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHNyYy5yZXBsYWNlKC9eXFwvLywgJycpO1xuICBjb25zdCBpbWdQYXRoID0gbm9ybWFsaXplZDtcbiAgY29uc3Qgd2VicFBhdGggPSBub3JtYWxpemVkLnJlcGxhY2UoL1xcLihwbmd8anBlP2cpJC9pLCAnLndlYnAnKTtcblxuICBsZXQgc291cmNlc0h0bWwgPSAnJztcbiAgXG4gIC8vIEFkZCBjdXN0b20gc291cmNlcyB3aXRoIG1lZGlhIHF1ZXJpZXNcbiAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlcykgJiYgc291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgc291cmNlcy5mb3JFYWNoKChzb3VyY2UpID0+IHtcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgbWVkaWEgPSBzb3VyY2UubWVkaWEgPyBgIG1lZGlhPVwiJHtTdHJpbmcoc291cmNlLm1lZGlhKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyl9XCJgIDogJyc7XG4gICAgICAgIGNvbnN0IHNyY3NldCA9IHNvdXJjZS5zcmNzZXQgfHwgc291cmNlLnNyYyB8fCAnJztcbiAgICAgICAgY29uc3QgdHlwZSA9IHNvdXJjZS50eXBlID8gYCB0eXBlPVwiJHtTdHJpbmcoc291cmNlLnR5cGUpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKX1cImAgOiAnJztcbiAgICAgICAgXG4gICAgICAgIGlmIChzcmNzZXQpIHtcbiAgICAgICAgICBjb25zdCBub3JtYWxpemVkU3Jjc2V0ID0gc3Jjc2V0LnJlcGxhY2UoL15cXC8vLCAnJyk7XG4gICAgICAgICAgc291cmNlc0h0bWwgKz0gYDxzb3VyY2Uke21lZGlhfSBzcmNzZXQ9XCIke25vcm1hbGl6ZWRTcmNzZXR9XCIke3R5cGV9PmA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgYDxwaWN0dXJlJHtjbGFzc05hbWV9PmAgK1xuICAgIHNvdXJjZXNIdG1sICtcbiAgICBgPHNvdXJjZSBzcmNzZXQ9XCIke3dlYnBQYXRofVwiIHR5cGU9XCJpbWFnZS93ZWJwXCI+YCArXG4gICAgYDxpbWcgc3JjPVwiJHtpbWdQYXRofVwiIGFsdD1cIiR7YWx0LnJlcGxhY2UoXG4gICAgICAvXCIvZyxcbiAgICAgICcmcXVvdDsnLFxuICAgICl9XCIgbG9hZGluZz1cIiR7bG9hZGluZ31cIiR7d2lkdGh9JHtoZWlnaHR9PmAgK1xuICAgIGA8L3BpY3R1cmU+YFxuICApO1xufVxuXG5jb25zdCBpbnB1dCA9IHsgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXguaHRtbCcpIH07XG5odG1sRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICBpbnB1dFtmaWxlLnJlcGxhY2UoJy5odG1sJywgJycpXSA9IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgZmlsZSk7XG59KTtcblxuY29uc3Qgd2VicENvbnZlcnRQbHVnaW4gPSAoKSA9PiAoe1xuICBuYW1lOiAnd2VicC1jb252ZXJ0JyxcbiAgYnVpbGRTdGFydDogYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcnVuIH0gPSBhd2FpdCBpbXBvcnQoJy4vc2NyaXB0cy9jb252ZXJ0VG9XZWJwLmpzJyk7XG4gICAgYXdhaXQgcnVuKCk7XG4gIH0sXG4gIGNvbmZpZ3VyZVNlcnZlcjogKCkgPT4ge1xuICAgIGltcG9ydCgnLi9zY3JpcHRzL2NvbnZlcnRUb1dlYnAuanMnKS50aGVuKCh7IHN0YXJ0V2F0Y2ggfSkgPT4gc3RhcnRXYXRjaCgpKTtcbiAgfSxcbn0pO1xuXG5jb25zdCBoYW5kbGViYXJzUmVsb2FkUGx1Z2luID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdoYW5kbGViYXJzLXJlbG9hZCcsXG4gICAgaGFuZGxlSG90VXBkYXRlKHsgZmlsZSwgc2VydmVyIH0pIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gZmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICAgIC8vIENoZWNrIGlmIGNoYW5nZWQgZmlsZSBpcyBhIHBhcnRpYWwgKHRlbXBsYXRlIG9yIHNlY3Rpb24pXG4gICAgICBpZiAoXG4gICAgICAgIG5vcm1hbGl6ZWRQYXRoLmluY2x1ZGVzKCcvdGVtcGxhdGVzLycpIHx8XG4gICAgICAgIG5vcm1hbGl6ZWRQYXRoLmluY2x1ZGVzKCcvc2VjdGlvbnMvJykgfHxcbiAgICAgICAgbm9ybWFsaXplZFBhdGguaW5jbHVkZXMoJy9wcm9maWxlLycpXG4gICAgICApIHtcbiAgICAgICAgLy8gRm9yY2UgZnVsbCBwYWdlIHJlbG9hZCB3aGVuIHBhcnRpYWxzIGNoYW5nZVxuICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Z1bGwtcmVsb2FkJyxcbiAgICAgICAgICBwYXRoOiAnKicsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZXNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy90ZW1wbGF0ZXMnKTtcbiAgICAgIGNvbnN0IHNlY3Rpb25zRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc2VjdGlvbnMnKTtcbiAgICAgIGNvbnN0IHByb2ZpbGVQYW5lbHNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wcm9maWxlL3BhbmVscycpO1xuXG4gICAgICAvLyBFeHBsaWNpdGx5IHdhdGNoIHRlbXBsYXRlcywgc2VjdGlvbnMsIGFuZCBwcm9maWxlIHBhbmVsIHBhcnRpYWxzXG4gICAgICBzZXJ2ZXIud2F0Y2hlci5hZGQoW3RlbXBsYXRlc0Rpciwgc2VjdGlvbnNEaXIsIHByb2ZpbGVQYW5lbHNEaXJdKTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy9XYXRjaENhc2gnLFxuICByb290OiAnc3JjJyxcbiAgcHVibGljRGlyOiAnLi4vcHVibGljJyxcbiAgcGx1Z2luczogW1xuICAgIHdlYnBDb252ZXJ0UGx1Z2luKCksXG4gICAgaGFuZGxlYmFycyh7XG4gICAgICBwYXJ0aWFsRGlyZWN0b3J5OiBbXG4gICAgICAgIHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3RlbXBsYXRlcycpLFxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zZWN0aW9ucycpLFxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wcm9maWxlL3BhbmVscycpLFxuICAgICAgXSxcbiAgICAgIHJlbG9hZE9uUGFydGlhbENoYW5nZTogdHJ1ZSxcbiAgICAgIGNvbnRleHQ6IHsgYmFzZSB9LFxuICAgICAgaGVscGVyczoge1xuICAgICAgICBwaWN0dXJlOiBwaWN0dXJlSGVscGVyLFxuICAgICAgICBhcnJheTogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgYXJndW1lbnQgd2hpY2ggaXMgSGFuZGxlYmFycyBvcHRpb25zIG9iamVjdFxuICAgICAgICAgIGNvbnN0IGl0ZW1zID0gYXJncy5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICB9LFxuICAgICAgICBvYmplY3Q6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYXN0IGFyZ3VtZW50IHdoaWNoIGlzIEhhbmRsZWJhcnMgb3B0aW9ucyBvYmplY3RcbiAgICAgICAgICBjb25zdCBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmhhc2ggfHwge307XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGhhbmRsZWJhcnNSZWxvYWRQbHVnaW4oKSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBob3N0OiB0cnVlLFxuICAgIG9wZW46IHRydWUsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQsXG4gICAgfSxcbiAgICBvdXREaXI6ICcuLi9kaXN0LycsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcUmVwb3NpdG9yaWVzXFxcXFdhY3RoQ2FzaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUmVwb3NpdG9yaWVzXFxcXFdhY3RoQ2FzaFxcXFxnZXRIVE1MRmlsZU5hbWVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9SZXBvc2l0b3JpZXMvV2FjdGhDYXNoL2dldEhUTUxGaWxlTmFtZXMuanNcIjsvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuY29uc3Qgc3JjRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKTtcblxuY29uc3QgaHRtbEZpbGVzID0gZnNcbiAgLnJlYWRkaXJTeW5jKHNyY0RpcilcbiAgLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5lbmRzV2l0aCgnLmh0bWwnKSAmJiBmaWxlICE9PSAnaW5kZXguaHRtbCcpO1xuXG5leHBvcnQgeyBodG1sRmlsZXMgfTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUEsT0FBT0EsU0FBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFdBQVc7QUFNbEIsU0FBUyxRQUFRLEtBQUssV0FBVyxDQUFDLEdBQUc7QUFDbkMsTUFBSSxDQUFDQSxJQUFHLFdBQVcsR0FBRztBQUFHLFdBQU87QUFDaEMsUUFBTSxVQUFVQSxJQUFHLFlBQVksS0FBSyxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBQzNELGFBQVcsU0FBUyxTQUFTO0FBQzNCLFVBQU0sV0FBVyxLQUFLLEtBQUssS0FBSyxNQUFNLElBQUk7QUFDMUMsUUFBSSxNQUFNLFlBQVksR0FBRztBQUN2QixjQUFRLFVBQVUsUUFBUTtBQUFBLElBQzVCLFdBQVcsV0FBVyxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3RDLGVBQVMsS0FBSyxRQUFRO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNU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LFFBQ1IsQ0FBQztBQUNELGVBQU8sQ0FBQztBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxnQkFBZ0IsUUFBUTtBQUN0QixZQUFNLGVBQWVILFNBQVFDLG1DQUFXLGVBQWU7QUFDdkQsWUFBTSxjQUFjRCxTQUFRQyxtQ0FBVyxjQUFjO0FBQ3JELFlBQU0sbUJBQW1CRCxTQUFRQyxtQ0FBVyxvQkFBb0I7QUFHaEUsYUFBTyxRQUFRLElBQUksQ0FBQyxjQUFjLGFBQWEsZ0JBQWdCLENBQUM7QUFBQSxJQUNsRTtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLFNBQVM7QUFBQSxJQUNQLGtCQUFrQjtBQUFBLElBQ2xCLFdBQVc7QUFBQSxNQUNULGtCQUFrQjtBQUFBLFFBQ2hCRCxTQUFRQyxtQ0FBVyxlQUFlO0FBQUEsUUFDbENELFNBQVFDLG1DQUFXLGNBQWM7QUFBQSxRQUNqQ0QsU0FBUUMsbUNBQVcsb0JBQW9CO0FBQUEsTUFDekM7QUFBQSxNQUNBLHVCQUF1QjtBQUFBLE1BQ3ZCLFNBQVMsRUFBRSxLQUFLO0FBQUEsTUFDaEIsU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsT0FBTyxZQUFhLE1BQU07QUFFeEIsZ0JBQU0sUUFBUSxLQUFLLE1BQU0sR0FBRyxFQUFFO0FBQzlCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsUUFBUSxZQUFhLE1BQU07QUFFekIsZ0JBQU0sVUFBVSxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQ3BDLGlCQUFPLFFBQVEsUUFBUSxDQUFDO0FBQUEsUUFDMUI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCx1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJmcyIsICJfX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJ1biIsICJzdGFydFdhdGNoIl0KfQo=
