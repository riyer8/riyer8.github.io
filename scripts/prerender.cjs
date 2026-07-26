/* eslint-disable no-console */
const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer");

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
require("@babel/register")({
  babelrc: false,
  configFile: false,
  extensions: [".js"],
  presets: [require.resolve("babel-preset-react-app")],
});

const ROOT = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "build");
const SITE_URL = "https://riyer8.github.io";
const RENDER_CONCURRENCY = Math.max(
  1,
  Number.parseInt(process.env.PRERENDER_CONCURRENCY || "4", 10) || 4
);
const bookshelfData =
  require("../src/pages/BookshelfPage/data/bookshelfData").default;
const {
  titleToSlug,
} = require("../src/pages/BookshelfPage/bookshelfUtils");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const normalizeRoute = (route) =>
  route === "/" ? "/" : `/${route.replace(/^\/+|\/+$/g, "")}/`;

const buildRoutes = () => {
  const detailRoutes = bookshelfData.map((item) => {
    if (!item.title?.trim()) throw new Error("A bookshelf item is missing a title.");
    const slug = titleToSlug(item.title);
    if (!slug) throw new Error(`Could not create a slug for "${item.title}".`);
    return normalizeRoute(`/recent-reads/${slug}`);
  });
  const routes = ["/", "/ramya/", "/recent-reads/", ...detailRoutes];
  const duplicates = routes.filter(
    (route, index) => routes.indexOf(route) !== index
  );
  if (duplicates.length) {
    throw new Error(`Duplicate prerender routes: ${[...new Set(duplicates)].join(", ")}`);
  }
  return routes;
};

const startServer = (shellHtml) =>
  new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const requestedPath = path.resolve(BUILD_DIR, `.${pathname}`);
      const isSafe = requestedPath.startsWith(BUILD_DIR);
      const isAsset = path.extname(pathname);

      if (isSafe && isAsset && fs.existsSync(requestedPath)) {
        response.writeHead(200, {
          "Content-Type": MIME_TYPES[path.extname(requestedPath)] || "application/octet-stream",
        });
        fs.createReadStream(requestedPath).pipe(response);
        return;
      }

      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(shellHtml);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        origin: `http://127.0.0.1:${address.port}`,
      });
    });
  });

const outputPathForRoute = (route) =>
  route === "/"
    ? path.join(BUILD_DIR, "index.html")
    : path.join(BUILD_DIR, route.replace(/^\/|\/$/g, ""), "index.html");

const countMatches = (html, pattern) => (html.match(pattern) || []).length;

const validateHtml = (html, route, { indexable = true } = {}) => {
  const expectedCanonical = `${SITE_URL}${route}`;
  const checks = [
    [countMatches(html, /<title>/g) === 1, "exactly one title"],
    [countMatches(html, /<meta name="description"/g) === 1, "exactly one description"],
    [
      indexable
        ? countMatches(html, /<link rel="canonical"/g) === 1
        : countMatches(html, /<link rel="canonical"/g) === 0,
      indexable ? "exactly one canonical" : "no canonical",
    ],
    [
      !indexable || html.includes(`href="${expectedCanonical}"`),
      `canonical ${expectedCanonical}`,
    ],
    [html.includes('id="page-structured-data"'), "structured data"],
    [/<div id="root">[\s\S]*\S[\s\S]*<\/div>/.test(html), "non-empty root content"],
    [
      indexable
        ? !html.includes('content="noindex')
        : html.includes('content="noindex, nofollow"'),
      indexable ? "indexable robots directive" : "noindex robots directive",
    ],
  ];
  const failures = checks.filter(([passes]) => !passes).map(([, label]) => label);
  if (failures.length) {
    throw new Error(`Invalid prerendered HTML for ${route}: ${failures.join(", ")}`);
  }
};

const renderRoute = async (
  browser,
  origin,
  route,
  { expectCanonical = true } = {}
) => {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
    { name: "prefers-color-scheme", value: "light" },
  ]);
  await page.evaluateOnNewDocument(() => {
    window.sessionStorage.setItem("homeIntroSeen", "true");
  });

  await page.goto(`${origin}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForFunction(
    (expectedPath, canonicalRequired) => {
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      return (
        document.documentElement.dataset.prerenderReady === "true" &&
        document.querySelector("#root")?.textContent.trim().length > 0 &&
        (canonicalRequired ? canonical?.endsWith(expectedPath) : !canonical)
      );
    },
    { timeout: 30000 },
    route,
    expectCanonical
  );
  await page.waitForFunction(
    () =>
      !document.querySelector(
        '[data-markdown-present="true"][data-markdown-ready="false"]'
      ),
    { timeout: 30000 }
  );
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
  });

  if (pageErrors.length) {
    throw new Error(`Browser errors on ${route}: ${pageErrors.join("; ")}`);
  }
  const html = await page.content();
  await page.close();
  return html;
};

const writeSitemap = (routes) => {
  const urls = routes
    .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
    .join("\n");
  fs.writeFileSync(
    path.join(BUILD_DIR, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
};

const renderRoutes = async (browser, origin, routes) => {
  let nextRouteIndex = 0;
  const workerCount = Math.min(RENDER_CONCURRENCY, routes.length);

  const worker = async () => {
    while (nextRouteIndex < routes.length) {
      const route = routes[nextRouteIndex];
      nextRouteIndex += 1;
      try {
        const html = await renderRoute(browser, origin, route);
        validateHtml(html, route);
        const outputPath = outputPathForRoute(route);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, html);
        console.log(`Prerendered ${route}`);
      } catch (error) {
        throw new Error(`Failed to prerender ${route}: ${error.message}`, {
          cause: error,
        });
      }
    }
  };

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
};

const main = async () => {
  const shellPath = path.join(BUILD_DIR, "index.html");
  if (!fs.existsSync(shellPath)) {
    throw new Error("build/index.html is missing. Run this after react-scripts build.");
  }

  const routes = buildRoutes();
  const shellHtml = fs.readFileSync(shellPath, "utf8");
  const { server, origin } = await startServer(shellHtml);
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    await renderRoutes(browser, origin, routes);

    const notFoundHtml = await renderRoute(browser, origin, "/__not-found__/", {
      expectCanonical: false,
    });
    validateHtml(notFoundHtml, "/__not-found__/", { indexable: false });
    fs.writeFileSync(path.join(BUILD_DIR, "404.html"), notFoundHtml);
    writeSitemap(routes);
    console.log(`Prerendered ${routes.length} indexable routes and 404.html.`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
