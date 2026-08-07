const fs = require("fs");
const path = require("path");

require("@babel/register")({
  extensions: [".js"],
});

const dataDirectory = path.resolve(
  __dirname,
  "../src/pages/BookshelfPage/data",
);
const outputPath = path.resolve(__dirname, "bookshelf-analysis.html");
const dataFiles = fs
  .readdirSync(dataDirectory)
  .filter(
    (fileName) =>
      fileName.endsWith(".js") && fileName !== "bookshelfData.js",
  )
  .sort();
const bookshelfData = dataFiles.flatMap((fileName) => {
  const exportedData = require(path.join(dataDirectory, fileName)).default;
  if (!Array.isArray(exportedData)) {
    throw new TypeError(`${fileName} must export an array`);
  }
  return exportedData;
});

function frequencies(field, items = bookshelfData) {
  const counts = new Map();

  items.forEach((item) => {
    const values =
      field === "tags"
        ? Array.isArray(item.tags)
          ? item.tags
          : []
        : [item[field]];

    values.forEach((rawValue) => {
      if (rawValue == null || String(rawValue).trim() === "") return;
      const value = String(rawValue).trim();
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });

  return [...counts.entries()].sort(
    ([labelA, countA], [labelB, countB]) =>
      countB - countA || labelA.localeCompare(labelB),
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSection(title, field, rows, note) {
  const maxCount = Math.max(...rows.map(([, count]) => count));
  const archivedCounts = new Map(
    frequencies(
      field,
      bookshelfData.filter((item) => item.archives === true),
    ),
  );
  const bars = rows
    .map(
      ([label, count]) => {
        const archivedCount = archivedCounts.get(label) || 0;
        return `
        <button class="bar-row filter-trigger" type="button" data-field="${field}" data-value="${escapeHtml(label)}">
          <span class="bar-label">${escapeHtml(label)}</span>
          <div class="bar-group">
            <div class="bar-track" aria-label="${count} total entries">
              <div class="bar" style="width: ${(count / maxCount) * 100}%"></div>
            </div>
            <div class="bar-track archived-track" aria-label="${archivedCount} archived entries">
              <div class="bar archived-bar" style="width: ${(archivedCount / maxCount) * 100}%"></div>
            </div>
          </div>
          <span class="bar-values"><strong>${count}</strong><em>${archivedCount}</em></span>
        </button>`;
      },
    )
    .join("");

  const tableRows = rows
    .map(
      ([label, count], index) => {
        const archivedCount = archivedCounts.get(label) || 0;
        return `
        <tr class="filter-trigger" tabindex="0" role="button" data-field="${field}" data-value="${escapeHtml(label)}">
          <td>${index + 1}</td>
          <td>${escapeHtml(label)}</td>
          <td>${count}</td>
          <td>${archivedCount}</td>
          <td>${((count / bookshelfData.length) * 100).toFixed(1)}%</td>
        </tr>`;
      },
    )
    .join("");

  return `
    <section>
      <div class="section-heading">
        <div>
          <p class="eyebrow">${escapeHtml(note)}</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <span class="total">${rows.length} unique values</span>
      </div>

      <div class="panel">
        <h3>${escapeHtml(title)} plot</h3>
        <p class="axis-label">Frequency (number of bookshelf entries)</p>
        <div class="legend" aria-label="Plot legend">
          <span><i class="legend-all"></i>All entries</span>
          <span><i class="legend-archived"></i>Archived subset</span>
        </div>
        <div class="chart${title === "Tag frequency" ? " chart-all-tags" : ""}">${bars}</div>
        <p class="interaction-hint">Select any row to see its matching titles.</p>
        <p class="source">Source: all ${dataFiles.length} data arrays in <code>BookshelfPage/data</code> · ${bookshelfData.length} bookshelf entries</p>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>${escapeHtml(title.replace(" frequency", ""))}</th>
              <th>Count</th>
              <th>Archived</th>
              <th>Share of entries</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </section>`;
}

const tags = frequencies("tags");
const categories = frequencies("category");
const media = frequencies("medium");
const archivedEntries = bookshelfData
  .filter((item) => item.archives === true)
  .sort((itemA, itemB) => itemA.title.localeCompare(itemB.title));
const detailItemsJson = JSON.stringify(
  bookshelfData.map((item) => ({
    title: item.title,
    author: item.author || "Unknown author",
    url: item.url || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    category: item.category || "Uncategorized",
    medium: item.medium || "Unknown medium",
    archived: item.archives === true,
  })),
).replaceAll("<", "\\u003c");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bookshelf Data Analysis</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1e293b;
      --muted: #64748b;
      --line: #dbe4ee;
      --surface: #f8fafc;
      --accent: #3b6b59;
      --accent-soft: #dceae4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #fff;
      color: var(--ink);
      font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main { width: min(1100px, calc(100% - 40px)); margin: 0 auto; padding: 56px 0 80px; }
    header { border-bottom: 1px solid var(--line); padding-bottom: 28px; }
    h1 { margin: 0 0 8px; font-size: clamp(30px, 5vw, 48px); letter-spacing: -0.04em; }
    h2 { margin: 0; font-size: 28px; letter-spacing: -0.025em; }
    h3 { margin: 0 0 4px; font-size: 17px; }
    p { margin: 0; }
    .summary { color: var(--muted); max-width: 680px; }
    .stats { display: flex; gap: 28px; margin-top: 24px; flex-wrap: wrap; }
    .stat strong { display: block; font-size: 24px; color: var(--accent); }
    .stat span, .source, .axis-label, .eyebrow, .total { color: var(--muted); font-size: 13px; }
    section { padding-top: 56px; }
    .section-heading { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
    .eyebrow { margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
    .panel { padding: 22px; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; }
    .axis-label { margin-bottom: 10px; }
    .legend { display: flex; gap: 18px; margin-bottom: 18px; color: var(--muted); font-size: 12px; }
    .legend span { display: inline-flex; align-items: center; gap: 6px; }
    .legend i { display: inline-block; width: 22px; height: 9px; border-radius: 2px; }
    .legend-all { background: var(--accent); }
    .legend-archived { border: 1px dashed var(--accent); background: transparent; }
    .chart { display: grid; gap: 8px; max-height: 520px; overflow-y: auto; padding-right: 8px; }
    .chart-all-tags { max-height: none; overflow-y: visible; }
    .bar-row { width: 100%; display: grid; grid-template-columns: minmax(90px, 160px) 1fr 44px; gap: 12px; align-items: center; min-height: 34px; padding: 3px; border: 0; border-radius: 4px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
    .bar-row:hover, .bar-row:focus-visible, tbody .filter-trigger:hover, tbody .filter-trigger:focus-visible { background: var(--accent-soft); outline: none; }
    .bar-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; font-size: 13px; }
    .bar-group { display: grid; gap: 4px; }
    .bar-track { height: 14px; background: var(--accent-soft); border-radius: 3px; overflow: hidden; }
    .archived-track { height: 9px; border: 1px dashed var(--accent); background: transparent; }
    .bar { height: 100%; background: var(--accent); border-radius: 2px; }
    .archived-bar { background: var(--accent); opacity: 0.45; }
    .bar-values { display: grid; font-size: 12px; line-height: 1.1; text-align: right; }
    .bar-values em { color: var(--muted); font-style: normal; }
    .interaction-hint { margin-top: 14px; color: var(--accent); font-size: 12px; font-weight: 700; }
    .source { margin-top: 18px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .table-wrap { margin-top: 18px; max-height: 440px; overflow: auto; border: 1px solid var(--line); border-radius: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 14px; border-bottom: 1px solid var(--line); text-align: left; }
    th { position: sticky; top: 0; background: var(--surface); font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
    td:nth-child(1), td:nth-child(3), td:nth-child(4) { font-variant-numeric: tabular-nums; }
    tbody tr:last-child td { border-bottom: 0; }
    tbody .filter-trigger { cursor: pointer; }
    .detail-overlay { position: fixed; inset: 0; z-index: 10; background: rgb(15 23 42 / 28%); opacity: 0; pointer-events: none; transition: opacity 160ms ease; }
    .detail-panel { position: fixed; inset: 0 0 0 auto; z-index: 11; width: min(620px, 92vw); padding: 28px; overflow-y: auto; background: #fff; border-left: 1px solid var(--line); transform: translateX(100%); transition: transform 180ms ease; }
    .detail-overlay.is-open { opacity: 1; pointer-events: auto; }
    .detail-panel.is-open { transform: translateX(0); }
    .detail-header { display: flex; align-items: start; justify-content: space-between; gap: 20px; padding-bottom: 18px; }
    .detail-header h2 { color: var(--accent); }
    .detail-summary { color: var(--muted); margin-top: 4px; }
    .close-button { border: 1px solid var(--line); border-radius: 6px; padding: 7px 11px; background: transparent; color: var(--ink); cursor: pointer; }
    .detail-table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
    .detail-table a { color: var(--accent); font-weight: 700; text-decoration: none; }
    .detail-table a:hover { text-decoration: underline; }
    .archive-mark { color: var(--accent); font-weight: 700; }
    body.panel-open { overflow: hidden; }
    @media (max-width: 620px) {
      main { width: min(100% - 24px, 1100px); padding-top: 32px; }
      .bar-row { grid-template-columns: 100px 1fr 28px; gap: 8px; }
      .section-heading { align-items: start; flex-direction: column; }
      th, td { padding: 9px 10px; }
      .detail-panel { padding: 20px 14px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">Bookshelf data audit</p>
      <h1>What is on the bookshelf?</h1>
      <p class="summary">Frequency plots and count tables for every tag, category, and medium across all source arrays in the Bookshelf page data folder. The aggregate <code>bookshelfData.js</code> file is skipped to prevent counting the same entries twice.</p>
      <div class="stats">
        <div class="stat"><strong>${bookshelfData.length}</strong><span>entries</span></div>
        <div class="stat"><strong>${dataFiles.length}</strong><span>source files</span></div>
        <div class="stat"><strong>${tags.length}</strong><span>unique tags</span></div>
        <div class="stat"><strong>${categories.length}</strong><span>categories</span></div>
        <div class="stat"><strong>${media.length}</strong><span>media</span></div>
        <div class="stat"><strong>${archivedEntries.length}</strong><span>archived</span></div>
      </div>
    </header>
    ${renderSection("Tag frequency", "tags", tags, "Multi-value field")}
    ${renderSection("Category frequency", "category", categories, "One category per entry")}
    ${renderSection("Medium frequency", "medium", media, "One medium per entry")}
  </main>
  <div class="detail-overlay" id="detail-overlay"></div>
  <aside class="detail-panel" id="detail-panel" aria-hidden="true" aria-labelledby="detail-title">
    <div class="detail-header">
      <div>
        <p class="eyebrow" id="detail-field"></p>
        <h2 id="detail-title"></h2>
        <p class="detail-summary" id="detail-summary"></p>
      </div>
      <button class="close-button" id="close-panel" type="button">Close</button>
    </div>
    <div class="detail-table-wrap">
      <table class="detail-table">
        <thead><tr><th>Title</th><th>Author</th><th>Medium</th><th>Archived</th></tr></thead>
        <tbody id="detail-rows"></tbody>
      </table>
    </div>
  </aside>
  <script>
    const bookshelfItems = ${detailItemsJson};
    const panel = document.getElementById("detail-panel");
    const overlay = document.getElementById("detail-overlay");
    const closeButton = document.getElementById("close-panel");
    const detailField = document.getElementById("detail-field");
    const detailTitle = document.getElementById("detail-title");
    const detailSummary = document.getElementById("detail-summary");
    const detailRows = document.getElementById("detail-rows");

    function matchesFilter(item, field, value) {
      return field === "tags" ? item.tags.includes(value) : item[field] === value;
    }

    function appendCell(row, text, className) {
      const cell = document.createElement("td");
      cell.textContent = text;
      if (className) cell.className = className;
      row.appendChild(cell);
    }

    function openPanel(field, value) {
      const matches = bookshelfItems.filter((item) => matchesFilter(item, field, value));
      const archivedCount = matches.filter((item) => item.archived).length;
      const fieldLabel = field === "tags" ? "Tag" : field[0].toUpperCase() + field.slice(1);

      detailField.textContent = fieldLabel + " selection";
      detailTitle.textContent = value;
      detailSummary.textContent = matches.length + " matching " + (matches.length === 1 ? "title" : "titles") + " · " + archivedCount + " archived";
      detailRows.replaceChildren();

      matches
        .sort((itemA, itemB) => itemA.title.localeCompare(itemB.title))
        .forEach((item) => {
          const row = document.createElement("tr");
          const titleCell = document.createElement("td");
          if (item.url) {
            const link = document.createElement("a");
            link.href = item.url;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = item.title;
            titleCell.appendChild(link);
          } else {
            titleCell.textContent = item.title;
          }
          row.appendChild(titleCell);
          appendCell(row, item.author);
          appendCell(row, item.medium);
          appendCell(row, item.archived ? "Yes" : "No", item.archived ? "archive-mark" : "");
          detailRows.appendChild(row);
        });

      panel.classList.add("is-open");
      overlay.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("panel-open");
      closeButton.focus();
    }

    function closePanel() {
      panel.classList.remove("is-open");
      overlay.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("panel-open");
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".filter-trigger");
      if (trigger) openPanel(trigger.dataset.field, trigger.dataset.value);
    });
    document.addEventListener("keydown", (event) => {
      const trigger = event.target.closest(".filter-trigger");
      if (trigger && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openPanel(trigger.dataset.field, trigger.dataset.value);
      }
      if (event.key === "Escape") closePanel();
    });
    closeButton.addEventListener("click", closePanel);
    overlay.addEventListener("click", closePanel);
  </script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
