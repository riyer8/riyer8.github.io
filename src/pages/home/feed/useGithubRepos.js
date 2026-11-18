import { SELECTED_BUILDS } from "./homeFeedData";

// The builds rail is hardcoded from SELECTED_BUILDS in homeFeedData.js —
// no GitHub fetch, so all six cards render complete together on first
// paint with nothing swapping in behind them. Edit a field there and it
// shows on the card. The language and "updated" date are the last-known
// values in the file; update them there when you push to a repo.
// Computed once at module level so the array reference is stable across
// renders (BuildsRail's fade effect depends on it).
const BUILDS = SELECTED_BUILDS.map((build) => ({
  name: build.name,
  description: build.description || "",
  language: build.language || "",
  updatedLabel: build.updatedLabel || "",
  url: build.href,
  topics: [],
  why: build.why || "",
}));

const useGithubRepos = () => BUILDS;

export default useGithubRepos;
