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

const SYSTEM_CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

const resolveChromeExecutable = () => {
  try {
    const bundled = puppeteer.executablePath();
    if (bundled && fs.existsSync(bundled)) return bundled;
  } catch (_) {
    // Puppeteer's downloaded Chrome is missing; try a system browser next.
  }

  const systemChrome = SYSTEM_CHROME_CANDIDATES.find((candidate) =>
    fs.existsSync(candidate)
  );
  if (systemChrome) return systemChrome;

  throw new Error(
    "Puppeteer could not find Chrome. Install Google Chrome, set PUPPETEER_EXECUTABLE_PATH, or run `npx puppeteer browsers install chrome`."
  );
};

const launchBrowser = () =>
  puppeteer.launch({
    headless: true,
    executablePath: resolveChromeExecutable(),
    args: ["--disable-dev-shm-usage"],
  });

const RENDER_CONCURRENCY = Math.max(
  1,
  Number.parseInt(process.env.PRERENDER_CONCURRENCY || "4", 10) || 4
);
const RENDER_RETRIES = Math.max(
  1,
  Number.parseInt(process.env.PRERENDER_RETRIES || "2", 10) || 2
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

const toIsoDate = (value) => {
  if (!value || typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
};

const maxIsoDate = (dates) =>
  dates.filter(Boolean).sort().at(-1) || null;

/** UTC calendar date of this prerender run (override with BUILD_DATE=YYYY-MM-DD). */
const buildIsoDate = () =>
  toIsoDate(process.env.BUILD_DATE) || new Date().toISOString().slice(0, 10);

const BUILD_DATE = buildIsoDate();

/**
 * Every prerendered URL is rewritten on deploy, so lastmod is at least the
 * build date. Content dates still win when they are newer.
 */
const lastmodOnRebuild = (contentDate, buildDate = BUILD_DATE) =>
  maxIsoDate([toIsoDate(contentDate) || contentDate, buildDate]);

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildRoutes = () => {
  const detailEntries = bookshelfData.map((item) => {
    if (!item.title?.trim()) throw new Error("A bookshelf item is missing a title.");
    const slug = titleToSlug(item.title);
    if (!slug) throw new Error(`Could not create a slug for "${item.title}".`);
    return {
      route: normalizeRoute(`/recent-reads/${slug}`),
      lastmod: lastmodOnRebuild(item.dateAdded),
      changefreq: "monthly",
      priority: "0.6",
    };
  });

  const recentReadsLastmod = maxIsoDate(detailEntries.map((entry) => entry.lastmod));
  const routes = [
    {
      route: "/",
      lastmod: lastmodOnRebuild(recentReadsLastmod),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      route: "/ramya/",
      lastmod: lastmodOnRebuild(null),
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      route: "/recent-reads/",
      lastmod: lastmodOnRebuild(recentReadsLastmod),
      changefreq: "weekly",
      priority: "0.9",
    },
    ...detailEntries,
  ];

  const duplicates = routes
    .map((entry) => entry.route)
    .filter((route, index, all) => all.indexOf(route) !== index);
  if (duplicates.length) {
    throw new Error(
      `Duplicate prerender routes: ${[...new Set(duplicates)].join(", ")}`
    );
  }
  return routes;
};

const startServer = (shellHtml) =>
  new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname
      );
      const requestedPath = path.resolve(BUILD_DIR, `.${pathname}`);
      const isSafe = requestedPath.startsWith(BUILD_DIR);
      const isAsset = path.extname(pathname);

      if (isSafe && isAsset && fs.existsSync(requestedPath)) {
        response.writeHead(200, {
          "Content-Type":
            MIME_TYPES[path.extname(requestedPath)] || "application/octet-stream",
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
    [
      !indexable || html.includes(`content="${expectedCanonical}"`),
      `og:url ${expectedCanonical}`,
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

const attachLocalOnlyNetworking = async (page, origin) => {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (
      url.startsWith(origin) ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    ) {
      request.continue();
      return;
    }
    // Keep prerender offline: no Google Fonts, CDNs, analytics, or other beacons.
    request.abort();
  });
};

const renderRouteOnce = async (
  browser,
  origin,
  route,
  { expectCanonical = true } = {}
) => {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await attachLocalOnlyNetworking(page, origin);
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
    return await page.content();
  } finally {
    await page.close();
  }
};

const renderRoute = async (browser, origin, route, options = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= RENDER_RETRIES; attempt += 1) {
    try {
      return await renderRouteOnce(browser, origin, route, options);
    } catch (error) {
      lastError = error;
      if (attempt < RENDER_RETRIES) {
        console.warn(
          `Retrying ${route} (${attempt}/${RENDER_RETRIES}): ${error.message}`
        );
      }
    }
  }
  throw lastError;
};

const writeSitemap = (entries) => {
  const urls = entries
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(`${SITE_URL}${entry.route}`)}</loc>`];
      if (entry.lastmod) {
        lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      }
      if (entry.changefreq) {
        lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
      }
      if (entry.priority) {
        lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
      }
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(BUILD_DIR, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
};

const renderRoutes = async (browser, origin, entries) => {
  let nextRouteIndex = 0;
  const workerCount = Math.min(RENDER_CONCURRENCY, entries.length);

  const worker = async () => {
    while (nextRouteIndex < entries.length) {
      const entry = entries[nextRouteIndex];
      nextRouteIndex += 1;
      try {
        const html = await renderRoute(browser, origin, entry.route);
        validateHtml(html, entry.route);
        const outputPath = outputPathForRoute(entry.route);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, html);
        console.log(`Prerendered ${entry.route}`);
      } catch (error) {
        throw new Error(`Failed to prerender ${entry.route}: ${error.message}`, {
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

  const entries = buildRoutes();
  const shellHtml = fs.readFileSync(shellPath, "utf8");
  const { server, origin } = await startServer(shellHtml);
  let browser;

  try {
    browser = await launchBrowser();
    await renderRoutes(browser, origin, entries);

    const notFoundHtml = await renderRoute(browser, origin, "/__not-found__/", {
      expectCanonical: false,
    });
    validateHtml(notFoundHtml, "/__not-found__/", { indexable: false });
    fs.writeFileSync(path.join(BUILD_DIR, "404.html"), notFoundHtml);
    writeSitemap(entries);
    console.log(`Prerendered ${entries.length} indexable routes and 404.html.`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
