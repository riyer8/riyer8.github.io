# Bookshelf analysis

Open `bookshelf-analysis.html` in a browser to view frequency plots and count
tables for tags, categories, and media across every source array in
`src/pages/BookshelfPage/data`.

Select any plot bar or frequency-table row to open a side panel containing the
matching titles. Each plot compares all entries with the archived subset.

`bookshelfData.js` is the aggregate of the other data files, so the generator
skips it to avoid counting every entry twice.

Regenerate the report after editing the Bookshelf data:

```sh
node testing/generate-bookshelf-analysis.cjs
```
