"use strict";

const $ = (id) => document.getElementById(id);
const state = {catalog: null, data: null, time: 0, mode: "follow", pages: {reference: 0, prediction: 0},
  viewBucket: null, objectURL: null, request: 0, ordered: {}};
const names = {speech: "Speech", music: "Music", sound_event: "Sound"};

function node(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}
function text(value) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}
function clock(seconds, decimals = false) {
  if (!Number.isFinite(seconds)) return "—";
  const sign = seconds < 0 ? "−" : "";
  const absolute = Math.abs(seconds);
  const h = Math.floor(absolute / 3600), m = Math.floor(absolute % 3600 / 60);
  const s = decimals ? (absolute % 60).toFixed(2).padStart(5, "0") : String(Math.floor(absolute % 60)).padStart(2, "0");
  return sign + (h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`);
}
function parseTime(raw) {
  const parts = raw.trim().split(":");
  if (parts.length > 3 || parts.some(p => !/^\d+(\.\d+)?$/.test(p))) return NaN;
  return parts.reduce((total, value) => total * 60 + Number(value), 0);
}
function safeLocal(path) {
  const url = new URL(path, document.baseURI);
  if (url.origin !== location.origin || !/^(data\/[A-Za-z0-9_]+\.json|catalog\.json|links\.json)$/.test(path)) {
    throw new Error("Unexpected data location");
  }
  return url;
}
async function fetchJSON(path) {
  const response = await fetch(safeLocal(path), {credentials: "omit"});
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}
function showError(message) {
  $("error").textContent = message;
  $("error").hidden = false;
}
function summary(event) {
  const a = event.attributes;
  for (const key of ["transcript", "文字转写", "歌词转写", "caption", "声音事件识别", "乐器列表"]) {
    if (a[key] !== undefined && a[key] !== "") return text(a[key]);
  }
  const first = Object.entries(a).find(([key]) => key !== "type");
  return first ? `${first[0]}: ${text(first[1])}` : names[a.type];
}
function eventCard(event, index) {
  const card = node("article", `event ${event.attributes.type}`);
  card.dataset.index = index;
  card.dataset.start = event.start;
  card.dataset.end = event.end;
  const head = node("div", "event-head");
  const jump = node("button", "time-button", `${clock(event.start, true)} – ${clock(event.end, true)}`);
  jump.type = "button";
  jump.setAttribute("aria-label", `Go to event ${index + 1}, ${clock(event.start, true)}`);
  jump.addEventListener("click", () => setTime(event.start, true));
  head.append(jump, node("span", "event-type", names[event.attributes.type]), node("span", "event-index", `#${index + 1}`));
  card.append(head, node("p", "event-text", summary(event)));
  if (event.start < 0 || event.end > state.data.reference.duration || event.end <= event.start) {
    card.append(node("p", "alignment-note", "Original timestamp is outside the recording or reversed; retained unchanged."));
  }
  const details = node("details");
  details.append(node("summary", "", `View all ${Object.keys(event.attributes).length} attributes`));
  details.addEventListener("toggle", () => {
    if (!details.open || details.querySelector("dl")) return;
    const dl = node("dl");
    Object.entries(event.attributes).forEach(([key, value]) => dl.append(node("dt", "", key), node("dd", "", text(value))));
    details.append(dl);
  });
  card.append(details);
  return card;
}
function renderPanel(kind) {
  const events = state.ordered[kind];
  let selected, note;
  const pagination = $(kind + "-pagination");
  pagination.replaceChildren();
  if (state.mode === "all") {
    const pages = Math.max(1, Math.ceil(events.length / 50));
    state.pages[kind] = Math.max(0, Math.min(pages - 1, state.pages[kind]));
    const offset = state.pages[kind] * 50;
    selected = events.slice(offset, offset + 50);
    note = `${offset + 1}–${Math.min(offset + 50, events.length)} of ${events.length.toLocaleString()} events · ordered by start time`;
    for (const [label, delta] of [["← Previous", -1], ["Next →", 1]]) {
      if (delta === 1) pagination.append(node("span", "", `${state.pages[kind] + 1} / ${pages}`));
      const button = node("button", "", label);
      button.type = "button";
      button.disabled = state.pages[kind] + delta < 0 || state.pages[kind] + delta >= pages;
      button.addEventListener("click", () => {state.pages[kind] += delta; renderPanel(kind); highlight(); $(kind + "-events").scrollTop = 0;});
      pagination.append(button);
    }
  } else {
    const left = Math.max(0, Math.floor(state.time / 10) * 10 - 15), right = Math.floor(state.time / 10) * 10 + 45;
    selected = events.filter(({event}) => event.start <= right && event.end >= left);
    note = `${selected.length} events overlapping ${clock(left)}–${clock(right)} · active events highlighted`;
  }
  $(kind + "-summary").textContent = note;
  const container = $(kind + "-events");
  container.replaceChildren(...selected.map(({event, index}) => eventCard(event, index)));
  if (!selected.length) container.append(node("p", "empty", "No events in this interval. This may be an annotation gap or missing model output; it is not a statement that the recording is silent."));
}
function highlight() {
  document.querySelectorAll(".event").forEach(card => {
    const active = Number(card.dataset.start) <= state.time && state.time < Number(card.dataset.end);
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-current", active ? "true" : "false");
  });
}
function renderPanels(force = false) {
  const bucket = Math.floor(state.time / 10);
  if (force || (state.mode === "follow" && state.viewBucket !== bucket)) {
    for (const kind of ["reference", "prediction"]) renderPanel(kind);
    state.viewBucket = bucket;
  }
  highlight();
}
function setTime(value, seek = false) {
  if (!state.data || !Number.isFinite(value)) return;
  state.time = Math.max(0, Math.min(Number($("timeline").max), value));
  $("timeline").value = state.time;
  $("clock").textContent = `${clock(state.time, true)} / ${clock(state.data.reference.duration)}`;
  if (document.activeElement !== $("jump-time")) $("jump-time").value = clock(state.time);
  if (seek && state.objectURL && Number.isFinite($("media").duration)) {
    $("media").currentTime = Math.min(state.time, $("media").duration);
  }
  renderPanels();
}
function clearMedia() {
  const media = $("media");
  media.pause();
  media.removeAttribute("src");
  media.load();
  if (state.objectURL) URL.revokeObjectURL(state.objectURL);
  state.objectURL = null;
  $("local-file").value = "";
}
async function choose(key) {
  const entry = state.catalog.examples.find(e => e.key === key);
  if (!entry) return;
  if (state.data && state.data.key === key) return;
  const request = ++state.request;
  $("error").hidden = true;
  try {
    const data = await fetchJSON(entry.data);
    if (request !== state.request) return;
    if (data.key !== key) throw new Error("Recording/data identity mismatch");
    clearMedia();
    state.data = data;
    state.time = 0;
    state.viewBucket = null;
    state.pages = {reference: 0, prediction: 0};
    for (const kind of ["reference", "prediction"]) {
      state.ordered[kind] = data[kind].events.map((event, index) => ({event, index})).sort((a, b) => a.event.start - b.event.start || a.index - b.index);
      $(kind + "-count").textContent = `${data[kind].events.length.toLocaleString()} events`;
    }
    document.querySelectorAll(".recording-card").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.key === key)));
    $("workspace").hidden = false;
    $("recording-title").textContent = entry.title;
    $("recording-kind").textContent = `${entry.language === "en" ? "English" : "Chinese"} · ${key.includes("movie") ? "Film" : "Stage"} · ${clock(entry.duration)}`;
    const source = new URL(data.source.source_url);
    if (source.protocol !== "https:") throw new Error("Unexpected source URL");
    $("source-link").href = source.href;
    $("download-link").href = entry.data;
    $("download-link").download = `longcap-${key}.json`;
    $("timeline").max = Math.max(entry.duration, ...data.prediction.events.map(e => Math.max(e.start, e.end)));
    $("media-status").textContent = "Open the source link to obtain the recording, then choose your local copy. You can browse all captions without a file.";
    const s = data.prediction_status;
    $("model-notice").textContent = s.truncated ? "Model output for this recording is marked partial/truncated. All saved events are shown; missing or malformed output has not been repaired." : "Model output for this recording is marked ok in the saved conversion audit. All canonical events are shown; labels and model predictions can still contain errors.";
    $("model-notice").classList.toggle("ok", !s.truncated);
    const availability = data.source.availability;
    const sourceStatus = availability.status === "source_accessible"
      ? `Source availability checked on ${availability.checked_utc.slice(0, 10)} through ${availability.method}. No media was downloaded; exact reconstruction from this link remains unverified.`
      : "Current source availability and exact reconstruction remain unverified.";
    $("recording-notes").textContent = `This reference has ${data.annotation_notes.annotation_gaps_over_15_seconds.length} gaps over 15 seconds and ${data.annotation_notes.events_over_60_seconds.length} events over 60 seconds. ${sourceStatus}`;
    history.replaceState(null, "", `#${key}`);
    setTime(0);
    renderPanels(true);
  } catch (error) {showError(error.message);}
}
function jump() {
  const target = parseTime($("jump-time").value);
  if (!Number.isFinite(target)) {
    $("jump-time").setCustomValidity("Enter seconds, mm:ss, or hh:mm:ss.");
    $("jump-time").reportValidity();
    return;
  }
  $("jump-time").setCustomValidity("");
  setTime(target, true);
}
$("timeline").addEventListener("input", e => setTime(Number(e.target.value), true));
$("jump-button").addEventListener("click", jump);
$("jump-time").addEventListener("input", () => $("jump-time").setCustomValidity(""));
$("jump-time").addEventListener("keydown", e => {if (e.key === "Enter") jump();});
$("view-mode").addEventListener("change", e => {state.mode = e.target.value; state.pages = {reference: 0, prediction: 0}; renderPanels(true);});
$("local-file").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file || !state.data) return;
  $("media").pause();
  if (state.objectURL) URL.revokeObjectURL(state.objectURL);
  state.objectURL = URL.createObjectURL(file);
  $("media-status").textContent = `Loading local file: ${file.name}. It stays in this browser.`;
  $("media").src = state.objectURL;
  $("media").load();
});
$("media").addEventListener("loadedmetadata", () => {
  if (!state.data || !state.objectURL) return;
  const duration = $("media").duration;
  const delta = Math.abs(duration - state.data.reference.duration);
  $("media-status").textContent = delta > 0.1 ? `Local file duration ${clock(duration)} differs from the benchmark (${clock(state.data.reference.duration)}). Check the edition, trim and offset before comparing timestamps.` : "Local file duration matches the benchmark. Full recording identity is not checked by this page; use the packaged WAV validator for its checksum.";
  $("media").currentTime = Math.min(state.time, duration);
});
$("media").addEventListener("timeupdate", () => {if (state.objectURL) setTime($("media").currentTime);});
$("media").addEventListener("error", () => {if (state.objectURL) $("media-status").textContent = "This browser could not play the selected file. Try a supported local WAV, MP3 or MP4 file; nothing was uploaded.";});
window.addEventListener("pagehide", clearMedia);

async function start() {
  try {
    state.catalog = await fetchJSON("catalog.json");
    const buttons = state.catalog.examples.map((entry, index) => {
      const button = node("button", "recording-card");
      button.type = "button";
      button.dataset.key = entry.key;
      button.setAttribute("aria-pressed", "false");
      button.append(node("span", "eyebrow", `${String(index + 1).padStart(2, "0")} / ${entry.language === "en" ? "English" : "Chinese"} ${entry.key.includes("movie") ? "film" : "stage"}`), node("strong", "", entry.title), node("span", "meta", `${Math.round(entry.duration / 60)} min · ${entry.reference_events.toLocaleString()} reference events`));
      button.addEventListener("click", () => choose(entry.key));
      return button;
    });
    $("recordings").replaceChildren(...buttons);
    const initial = location.hash.slice(1);
    await choose(state.catalog.examples.some(e => e.key === initial) ? initial : state.catalog.examples[0].key);
    const links = await fetchJSON("links.json");
    const anchors = [];
    for (const [key, label] of [["quickstart", "Quickstart"], ["code", "Code"], ["model_fp8", "Model"], ["benchmark", "Benchmark"], ["paper", "Paper"]]) {
      if (!links[key]) continue;
      const url = new URL(links[key]);
      if (url.protocol !== "https:") continue;
      const a = node("a", "", label);
      a.href = url.href; a.target = "_blank"; a.rel = "noopener noreferrer";
      anchors.push(a);
    }
    $("research-links").prepend(...anchors);
    for (const [id, key] of [["link-quickstart", "quickstart"], ["link-code", "code"], ["link-fp8", "model_fp8"], ["link-bf16", "model_bf16"], ["link-benchmark", "benchmark"]]) {
      if (links[key] && $(id)) $(id).href = new URL(links[key]).href;
    }
  } catch (error) {showError(`${error.message}. Preview this folder with a local HTTP server.`);}
}
start();
