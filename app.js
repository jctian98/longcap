/* LongCap listening room. Local assets only; no tracking or persisted browser state. */
"use strict";

(() => {
  const exampleId = document.body.dataset.example || "";
  const base = new URL(exampleId ? "../../" : "./", document.baseURI);
  const app = document.getElementById("app") || document.body.appendChild(document.createElement("main"));

  const research = Object.freeze({
    title: "LongCap: Hour-Scale Timestamped Audio Captioning via Chunk-wise Processing",
    authors: [["Jinchuan Tian", "1,2*"], ["Sen Chen", "2*"], ["Wenbin Huang", "2,3*"], ["Chao Weng", "2†"], ["Zhengwei Huang", "2"], ["Jiatong Shi", "2"], ["Yichen Lu", "2"], ["Haoran Wang", "1,2"], ["Shinji Watanabe", "1"], ["Cong Zhou", "2"]],
    affiliations: [["1", "Language Technologies Institute, Carnegie Mellon University"], ["2", "Anuttacon"], ["3", "Shanghai Jiao Tong University"]]
  });

  const words = {
    en: {
      brand: "LongCap", demoLabel: "Research demo", home: "Home", long: "Long recordings", short: "Short examples", about: "About the work", explore: "Explore the demo", introLink: "How it works", room: "THE LISTENING ROOM", longTitle: "Every recording has a story.", longDescription: "Four complete recordings. Two languages. Explore the audio, its reference events, and our model’s predictions in one synchronized view.", longCounter: "4 complete recordings", shortTitle: "Small moments, rich detail.", shortDescription: "Two examples from each short-form domain. Each clip is under a minute and uses the same event explorer.", shortCounter: "10 selected examples", listening: "Listen and explore", duration: "Duration", events: "events", language: "English", chinese: "中文", workEyebrow: "BEYOND A SINGLE CAPTION", aboutTitle: "Audio as a connected sequence.", about1Title: "Hear the whole scene", about1Text: "LongCap describes speech, music, and environmental sounds as events placed on a shared timeline. Each event carries its own caption, timing, and structured attributes.", about2Title: "Keep the details", about2Text: "Speaker and sound characteristics remain attached to the event. Start with a readable summary, then open the attributes to inspect the full description.", about3Title: "Connect across time", about3Text: "Dependency hooks connect events to their recorded context. Explore those links alongside the audio to see how moments relate across the recording.", modelNote: "The reference and model prediction are separate descriptions of the same audio. A highlighted dependency is a model or reference annotation; it does not by itself establish an audio-confirmed fact. Differences are kept visible.", footer: "LongCap research demo", footerRight: "Audio • event captions • dependencies", loading: "Preparing the listening room…", error: "The listening room could not load.", errorDetail: "The example data could not be downloaded. Check your connection and try again.", retry: "Try again", back: "Back to all examples", fullRecording: "Full recording", shortClip: "Short clip", player: "Listen to the recording", scrub: "Click or use arrow keys to move through the audio", waveformLabel: "Audio amplitude waveform. Click to seek; use left and right arrow keys to move five seconds.", flatWave: "Waveform not available", timelineLabel: "Event overview. Click to seek; use arrow keys to move through the recording.", reference: "Reference", prediction: "Our prediction", referenceTimeline: "Reference events", predictionTimeline: "Predicted events", speed: "Speed", audioError: "The audio could not load. Check your connection, then reload this page.", audioUnavailable: "Audio unavailable", model: "Prediction checkpoint", search: "Search captions and attributes", searchPlaceholder: "Find a word, sound, or speaker…", follow: "Follow playback", eventType: "Event type", allTypes: "All event types", visibleSpan: "Time window", span120: "2 minutes", span300: "5 minutes", span600: "10 minutes", spanFull: "Whole recording", jumpTime: "Go to time", jumpPlaceholder: "mm:ss or hh:mm:ss", go: "Go", previousWindow: "Previous time window", nextWindow: "Next time window", now: "Now", nowTitle: "Return to the current playback time", showingWindow: "Viewing", allTime: "Whole recording", searchAcross: "Search across the whole recording", active: "Playing now", ancestor: "Linked ancestor", unresolved: "Unresolved link", selected: "Selected event", ancestorTray: "Earlier events in context", ancestorEmpty: "Play the audio or select an event to inspect its ancestors.", noAncestors: "No resolved ancestor links for this event.", earlierReference: "Reference", earlierPrediction: "Prediction", details: "Full attributes", noAttributes: "No additional attributes", dependency: "Dependency", seek: "Play from", noEvents: "No events in this time window.", noMatches: "No events match your search or filter.", missingPrediction: "This checkpoint has no saved predictions for this example.", previous: "Previous", next: "Next", page: "Page", of: "of", results: "shown", total: "total", valid: "Linked", ambiguous: "Ambiguous", invalid: "Unresolved", timeError: "Use mm:ss, hh:mm:ss, or seconds.", nativeNote: "Captions and timings are preserved from the saved examples. Reference dependency links come from the supplied reference overlay. Solid green marks every event overlapping the current audio time; dashed violet marks resolved ancestors. The overview and time controls keep the complete recording accessible.", emptyCatalog: "No examples have been added yet.", illustration: "Illustrative timeline — not an audio example", scene: "A sequence, not just a sentence", illustrationEarlier: "A speaker introduces a story", illustrationCurrent: "The same speaker returns to it", illustrationSound: "Applause fills the room", illustrationDetail: "Caption + timing + attributes", illustrationAncestor: "Earlier context", illustrationActive: "Current event", illustrationEnd: "Speech, sound, and relationships on one timeline.", heroDescription: "Listen beyond the moment. LongCap turns audio into detailed, timed event captions—and connects events to the earlier moments that give them context.", heroFoot: "Four full recordings · English & Chinese · Interactive dependencies", countReference: "reference events", noSaved: "No saved examples", errorMissing: "Example not found in the local catalog.", seekAnnouncement: "Moved to", activeAnnouncement: "events playing", present: "Available predictions", typeSpeech: "Speech", typeMusic: "Music", typeSound: "Sound", typeOther: "Event"
    },
    zh: {
      brand: "LongCap", demoLabel: "研究演示", home: "主页", long: "完整长音频", short: "短音频示例", about: "关于本工作", explore: "探索示例", introLink: "了解工作原理", room: "声音探索室", longTitle: "每段录音，都有完整的故事。", longDescription: "四段完整录音，涵盖中英双语。同步聆听音频、查看参考事件与模型预测。", longCounter: "四段完整录音", shortTitle: "短暂片刻，丰富细节。", shortDescription: "每个短音频领域选取两个示例。每段均小于一分钟，使用相同的事件浏览界面。", shortCounter: "十段精选示例", listening: "聆听并探索", duration: "时长", events: "个事件", language: "English", chinese: "中文", workEyebrow: "超越单句描述", aboutTitle: "将音频理解为相互关联的事件。", about1Title: "听见整个场景", about1Text: "LongCap 将语音、音乐与环境声音描述为共享时间轴上的事件。每个事件具有描述、起止时间和结构化属性。", about2Title: "保留丰富细节", about2Text: "说话人与声音特征始终附属于对应事件。先阅读简洁的摘要，再展开属性查看完整描述。", about3Title: "连接前后语境", about3Text: "依赖关联连接事件与其已记录的语境。结合音频探索这些关联，理解录音中各个片刻的联系。", modelNote: "参考标注与模型预测分别描述同一音频。高亮的依赖关系属于模型或参考标注，并不等同于经音频核实的事实。界面保留两者的差异。", footer: "LongCap 研究演示", footerRight: "音频 · 事件描述 · 依赖关系", loading: "正在准备声音探索室…", error: "无法载入声音探索室。", errorDetail: "无法下载示例数据。请检查网络连接并重新载入。", retry: "重新载入", back: "返回全部示例", fullRecording: "完整录音", shortClip: "短音频", player: "聆听录音", scrub: "点击时间轴或使用方向键跳转", waveformLabel: "音频振幅波形。点击跳转；左右方向键每次移动五秒。", flatWave: "暂无波形数据", timelineLabel: "事件概览。点击跳转，或使用方向键浏览整段录音。", reference: "参考标注", prediction: "模型预测", referenceTimeline: "参考事件", predictionTimeline: "预测事件", speed: "播放速度", audioError: "音频载入失败。请检查网络连接，然后重新载入页面。", audioUnavailable: "音频暂不可用", model: "预测检查点", search: "搜索描述与属性", searchPlaceholder: "查找词语、声音或说话人…", follow: "跟随播放", eventType: "事件类型", allTypes: "全部事件类型", visibleSpan: "时间窗口", span120: "两分钟", span300: "五分钟", span600: "十分钟", spanFull: "整段录音", jumpTime: "跳转时间", jumpPlaceholder: "分:秒 或 时:分:秒", go: "跳转", previousWindow: "上一时间窗口", nextWindow: "下一时间窗口", now: "当前", nowTitle: "返回当前播放位置", showingWindow: "当前范围", allTime: "整段录音", searchAcross: "正在搜索整段录音", active: "正在播放", ancestor: "关联祖先事件", unresolved: "未确认关联", selected: "已选事件", ancestorTray: "相关的早先事件", ancestorEmpty: "播放音频或选择事件，即可查看它的祖先事件。", noAncestors: "该事件没有已确认的祖先关联。", earlierReference: "参考", earlierPrediction: "预测", details: "完整属性", noAttributes: "无其他属性", dependency: "依赖关系", seek: "从此处播放", noEvents: "当前时间窗口内没有事件。", noMatches: "没有符合搜索或筛选条件的事件。", missingPrediction: "此检查点没有该示例的已保存预测。", previous: "上一页", next: "下一页", page: "第", of: "/", results: "个已显示", total: "个事件", valid: "已关联", ambiguous: "存在歧义", invalid: "未确认", timeError: "请使用 分:秒、时:分:秒 或秒数。", nativeNote: "示例保留已保存的描述与时间戳，参考依赖关系来自所提供的参考关联标注。绿色实线高亮覆盖当前播放时间的全部事件；紫色虚线标识已确认的祖先事件。事件概览与时间控制可浏览整段录音。", emptyCatalog: "尚未添加示例。", illustration: "示意时间轴，非音频示例", scene: "事件序列，超越单句描述", illustrationEarlier: "说话人开始讲述一个故事", illustrationCurrent: "同一说话人再次回到这个故事", illustrationSound: "现场响起掌声", illustrationDetail: "描述 + 时间 + 属性", illustrationAncestor: "早先语境", illustrationActive: "当前事件", illustrationEnd: "语音、声音与关联，共用同一时间轴。", heroDescription: "聆听片刻之外的语境。LongCap 将音频转化为细致、带时间戳的事件描述，并将事件连接到构成其语境的早先片刻。", heroFoot: "四段完整录音 · 中英双语 · 交互式依赖关系", countReference: "个参考事件", noSaved: "暂无已保存示例", errorMissing: "本地目录中未找到该示例。", seekAnnouncement: "已跳转至", activeAnnouncement: "个事件正在播放", present: "可用模型预测", typeSpeech: "语音", typeMusic: "音乐", typeSound: "声音", typeOther: "事件"
    }
  };

  let lang = "en";
  let t = words.en;
  words.en.about1Text = "LongCap processes audio in chunks and interleaves them with structured event captions. Relative timestamps place speech, music, and environmental sounds on one continuous timeline.";
  words.zh.about1Text = "LongCap 分段处理音频，并交错生成结构化事件描述。相对时间戳将语音、音乐与环境声音定位在连续的时间轴上。";
  words.en.nativeNote = "Translated descriptions preserve the meaning of the saved examples; event inventories and timestamps are unchanged. Reference links are text-derived DeepSeek silver candidates. Green outlines mark every event at the current audio time; dashed violet outlines mark earlier linked events. A resolved link identifies a target event and is not an audio-confirmed judgment. Time controls and the overview keep the complete recording accessible.";
  words.zh.nativeNote = "翻译描述保留已保存示例的原意，事件集合与时间戳保持不变。参考关联属于 DeepSeek 基于文本生成的银标候选关系。绿色实线高亮覆盖当前播放时间的全部事件；紫色虚线标识已解析的前序关联事件。关联已解析仅表示已找到目标事件，不代表经音频核实。时间控制与事件概览可浏览整段录音。";
  words.zh.ancestor = "前序关联事件";
  words.en.readMore = "Read more";
  words.en.readLess = "Show less";
  words.zh.readMore = "展开描述";
  words.zh.readLess = "收起描述";
  words.zh.ancestorEmpty = "播放音频或选择事件，即可查看它的前序关联事件。";
  words.zh.noAncestors = "该事件没有可定位的前序关联。";
  words.en.clearFilters = "Clear filters and show event";
  words.zh.clearFilters = "清除筛选并查看事件";
  words.en.zoom = "Zoom to current time window";
  words.zh.zoom = "放大当前时间窗口";
  words.en.ancestorTray = "Linked context";
  words.zh.ancestorTray = "关联语境";
  words.en.ancestorEmpty = "Play the audio or select an event to inspect its recorded context links.";
  words.zh.ancestorEmpty = "播放音频或选择事件，即可查看其已记录的语境关联。";
  words.en.nativeNote = "Translated descriptions preserve the meaning of the saved examples; event inventories and timestamps are unchanged. Reference links are text-derived DeepSeek silver candidates. Green outlines mark every event at the current audio time; dashed violet outlines mark recorded dependency links. A resolved link identifies a target event and is not an audio-confirmed judgment. Time controls and the overview keep the complete recording accessible.";
  words.zh.nativeNote = "翻译描述保留已保存示例的原意，事件集合与时间戳保持不变。参考关联属于 DeepSeek 基于文本生成的银标候选关系。绿色实线高亮覆盖当前播放时间的全部事件；紫色虚线标识已记录的依赖关联。关联已解析仅表示已找到目标事件，不代表经音频核实。时间控制与事件概览可浏览整段录音。";
  words.en.longDescription = "Two primarily English and two primarily Chinese recordings, including multilingual passages. Explore their audio, reference events, and both LongCap 35B and 122B predictions in three synchronized panels.";
  words.zh.longDescription = "四段完整录音，两段以英语为主、两段以中文为主，包含多语种片段。同步聆听音频，在三个面板中同时查看参考事件、LongCap 35B 与 122B 预测。";
  words.en.heroDescription = "Listen beyond the moment. LongCap turns audio into detailed, timed event captions—and connects events to the moments that give them context. Explore the reference alongside both our 35B and 122B models.";
  words.zh.heroDescription = "聆听片刻之外的语境。LongCap 将音频转化为细致、带时间戳的事件描述，并将事件连接到构成其语境的片刻。参考标注与 35B、122B 两个模型同时呈现。";
  words.en.compareBoth = "Reference + two models, synchronized";
  words.zh.compareBoth = "参考标注与两个模型同步对照";
  words.en.referenceSubtitle = "Human captions · DeepSeek text-derived links";
  words.zh.referenceSubtitle = "人工事件标注 · DeepSeek 文本生成关联";
  words.en.linkSemantics = "Reference links are text-derived candidates from DeepSeek. Green marks current events; dashed violet marks linked context. These links have not been verified by listening to the audio.";
  words.zh.linkSemantics = "参考关联是 DeepSeek 基于文本生成的候选关系。绿色标识当前事件，紫色虚线标识关联语境。这些关联未经音频聆听核实。";
  words.en.modelPrediction = "Saved model prediction";
  words.zh.modelPrediction = "已保存的模型预测";
  words.en.curatedPrediction = "Prediction · edited demo";
  words.zh.curatedPrediction = "模型预测 · 已编辑的演示";
  words.en.modelNote = "Reference, LongCap 35B, and LongCap 122B describe the same audio in three synchronized panels. A highlighted dependency is a model or reference annotation; it does not by itself establish an audio-confirmed fact. Differences remain visible.";
  words.zh.modelNote = "参考标注、LongCap 35B 与 LongCap 122B 在三个同步面板中分别描述同一音频。高亮的依赖关系属于模型或参考标注，并不等同于经音频核实的事实。界面保留三者的差异。";
  words.en.playAudio="Play audio";words.zh.playAudio="播放音频";
  words.en.pauseAudio="Pause audio";words.zh.pauseAudio="暂停音频";
  words.en.mediaLoading="Loading audio…";words.zh.mediaLoading="正在载入音频…";
  words.en.mediaBuffering="Buffering audio…";words.zh.mediaBuffering="正在缓冲音频…";
  words.en.mediaSeeking="Loading the recording to play your selected moment…";words.zh.mediaSeeking="正在载入整段录音，以播放所选片刻…";
  words.en.mediaPlaying="Audio is playing";words.zh.mediaPlaying="音频正在播放";
  words.en.mediaPaused="Audio is paused";words.zh.mediaPaused="音频已暂停";
  words.en.mediaReady="Ready to listen";words.zh.mediaReady="音频已就绪";
  words.en.mediaEnded="Playback finished";words.zh.mediaEnded="播放已结束";
  words.en.mediaRetry="Trying another audio format…";words.zh.mediaRetry="正在尝试另一音频格式…";
  words.en.mediaPlayBlocked="Press Play audio to start playback in this browser.";words.zh.mediaPlayBlocked="请点击“播放音频”，允许浏览器开始播放。";
  words.en.mediaNetwork="The audio could not be downloaded. Check your connection, then press Play audio to retry.";words.zh.mediaNetwork="音频无法下载。请检查网络连接，再点击“播放音频”重试。";
  words.en.mediaDecode="This browser could not decode the available audio. Try opening the demo in another browser.";words.zh.mediaDecode="此浏览器无法解码提供的音频，请尝试用其他浏览器打开演示。";
  words.en.mediaUnsupported="The audio could not be opened. Try reloading or opening the demo in another browser.";words.zh.mediaUnsupported="无法打开音频。请尝试重新载入或使用其他浏览器打开演示。";
  words.en.mediaAborted="Audio loading was interrupted. Press Play audio to retry.";words.zh.mediaAborted="音频载入已中断，请点击“播放音频”重试。";
  words.en.atCurrentTime="At current time";words.zh.atCurrentTime="当前时间的事件";
  words.en.fileHint="This page was opened as a file. Use the supplied local preview launcher to open the demo in a browser.";words.zh.fileHint="此页面通过文件方式打开。请使用提供的本地预览启动器，在浏览器中打开演示。";
  words.zh.about3Text = "依赖关联连接事件与其已记录的语境。结合音频探索这些关联，理解录音中各个片刻的联系。";
  words.en.liveView="Playback context";words.zh.liveView="播放语境";
  words.en.currentEvents="Current events";words.zh.currentEvents="当前事件";
  words.en.linkedEvents="Linked events";words.zh.linkedEvents="关联事件";
  words.en.liveHint="Current events and their links stay here while you browse below.";words.zh.liveHint="浏览下方事件时，当前事件与关联语境始终在此显示。";
  words.en.noCurrent="No event at this time.";words.zh.noCurrent="此时间没有事件。";
  words.en.noCurrentLinks="No resolved links for the current events.";words.zh.noCurrentLinks="当前事件没有可定位的关联。";
  words.en.eventBrowser="Event browser";words.zh.eventBrowser="事件浏览";
  const typeLabel = value => {
    const normalized = String(value || "").toLowerCase();
    if (normalized === "speech" || normalized === "语音") return t.typeSpeech;
    if (normalized === "music" || normalized === "音乐") return t.typeMusic;
    if (["sound_event", "sound", "sound effect", "sound event", "声音事件", "音效"].includes(normalized)) return t.typeSound;
    return value || t.typeOther;
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const add = (parent, ...children) => { children.filter(Boolean).forEach(child => parent.appendChild(child)); return parent; };
  const setLang = value => { lang = value === "zh" ? "zh" : "en"; t = words[lang]; document.documentElement.lang = lang; };
  const safeResource = path => {
    const url = new URL(path, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error("Asset must remain in the local demo folder.");
    return url.href;
  };
  const link = (text, href, className = "") => { const a = el("a", className, text); a.href = href; return a; };
  const button = (text, className, handler, title) => {
    const b = el("button", className, text); b.type = "button";
    if (handler) b.addEventListener("click", handler);
    if (title) { b.title = title; b.setAttribute("aria-label", title); }
    return b;
  };
  const seconds = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  const clock = value => {
    const n = Math.floor(seconds(value));
    const h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60), s = n % 60;
    return h ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` : `${m}:${String(s).padStart(2,"0")}`;
  };
  const durationLabel = value => {
    const n = Math.floor(seconds(value));
    if (n < 60) return lang === "zh" ? `${n} 秒` : `${n} sec`;
    const h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60);
    return lang === "zh" ? `${h ? h + " 小时 " : ""}${m} 分钟` : `${h ? h + " hr " : ""}${m} min`;
  };
  const formatValue = value => {
    if (value === null || value === undefined) return "—";
    if (Array.isArray(value)) return value.map(formatValue).join(" · ");
    if (typeof value === "object") return Object.entries(value).map(([key,val]) => `${key}: ${formatValue(val)}`).join("\n");
    if (typeof value === "boolean") return lang === "zh" ? (value ? "是" : "否") : (value ? "Yes" : "No");
    if (typeof value === "string" && /^[\s]*[\[{]/.test(value)) {
      try { const structured=JSON.parse(value);if(structured&&typeof structured==="object")return formatValue(structured); } catch (_error) {}
    }
    return String(value);
  };
  const loadJSON = async path => {
    const response = await fetch(safeResource(path), {credentials:"omit", cache:"no-store"});
    if (!response.ok) throw new Error(`Could not load local asset (${response.status}).`);
    return response.json();
  };

  function header(example = false) {
    const head = el("header", "site-header");
    const inner = el("div", "container header-inner");
    const brand = link("", base.href, "brand");
    const icon = el("img", "brand-icon"); icon.src = safeResource("favicon.svg"); icon.alt = ""; icon.width = 33; icon.height = 33;
    add(brand, icon, el("span", "", "LongCap"), el("span", "brand-dot"));
    const nav = el("nav", "header-links"); nav.setAttribute("aria-label", lang === "zh" ? "主导航" : "Main navigation");
    add(nav, link(t.long, `${base.href}#long`), link(t.short, `${base.href}#short`), !example && link(t.about, "#about"), el("span", "research-pill", t.demoLabel));
    add(inner, brand, nav); return add(head, inner);
  }
  function footer() {
    const foot = el("footer", "site-footer");
    const inner = el("div", "container footer-inner");
    const attribution = el("div", "footer-attribution");
    add(attribution, link(t.footer, base.href, "footer-research-link"));
    if (exampleId) add(attribution, el("span", "footer-authors", research.authors.map(([name]) => name).join(" · ")));
    add(inner, attribution, el("span", "", t.footerRight)); return add(foot, inner);
  }
  function sectionHeading(eyebrow, title, description, counter) {
    const wrap = el("div", "section-heading"), left = el("div");
    add(left, el("div", "eyebrow", eyebrow), el("h2", "", title), el("p", "", description));
    return add(wrap, left, el("span", "section-counter", counter));
  }
  function mainPage(catalog) {
    setLang("en"); app.replaceChildren();
    const main = el("main");
    const hero = el("section", "container hero");
    const researchHeading = el("div", "research-heading");
    const paperTitle = el("h1", "paper-title");
    add(paperTitle, el("span", "paper-name", "LongCap: "), document.createTextNode("Hour-Scale Timestamped Audio Captioning via Chunk-wise Processing"));
    const authors = el("ul", "author-list");
    authors.setAttribute("aria-label", "Authors in paper order");
    research.authors.forEach(([name, marker]) => {
      const author = el("li", "author");
      add(author, el("span", "author-name", name), el("sup", "author-marker", marker));
      authors.appendChild(author);
    });
    const affiliations = el("div", "affiliations");
    research.affiliations.forEach(([marker, name]) => {
      const affiliation = el("p", "affiliation");
      add(affiliation, el("sup", "", marker), document.createTextNode(name));
      affiliations.appendChild(affiliation);
    });
    const contribution = el("p", "contribution-note");
    add(contribution, el("span", "", "* Equal contribution"), el("span", "", "† Project lead"));
    add(researchHeading, el("div", "eyebrow research-eyebrow", "LONGCAP · RESEARCH DEMO"), paperTitle, authors, affiliations, contribution);
    hero.appendChild(researchHeading);
    const copy = el("div", "hero-copy"), h1 = el("h2", "hero-tagline");
    add(h1, el("span", "", "Listen beyond"), el("br"), el("em", "", "the moment."));
    const actions = el("div", "hero-actions"); add(actions, link(`${t.explore} ↗`, "#long", "button"), link(t.introLink, "#about", "button secondary"));
    add(copy, el("div", "eyebrow", "STRUCTURED AUDIO CAPTIONING"), h1, el("p", "hero-description", t.heroDescription), actions, el("p", "hero-footnote", t.heroFoot));
    const visual = el("div", "hero-visual"); visual.setAttribute("aria-label", t.illustration);
    const top = el("div", "visual-top"); add(top, el("span", "", t.scene), el("span", "visual-live", "LONGCAP"));
    const wave = el("div", "illustrative-wave"); wave.setAttribute("aria-hidden", "true");
    [12,18,28,35,23,13,26,46,57,42,28,19,24,36,47,54,35,22,16,24,34,48,57,44,29,18,22,37,46,33,23,12,19,28,41,48,32,23,17,12].forEach(height => { const bar = el("span"); bar.style.setProperty("--wave-height",`${height}px`); wave.appendChild(bar); });
    const visualEvents = el("div", "visual-events");
    [["00:12",t.illustrationEarlier,"ancestor",t.illustrationAncestor],["01:34",t.illustrationCurrent,"current",t.illustrationActive],["01:41",t.illustrationSound,"",t.typeSound]].forEach(([time,headline,style,label]) => {
      const row = el("div",`visual-event ${style}`), detail = el("div"); add(detail,el("strong","",headline),el("small","",t.illustrationDetail)); add(row,el("time","",time),detail,el("span","visual-label",label)); visualEvents.appendChild(row);
    });
    add(visual,top,wave,visualEvents,el("p","visual-caption",t.illustration)); add(hero,copy,visual); main.appendChild(hero);
    const examples = Array.isArray(catalog.examples) ? catalog.examples : [];
    const longSection = el("section","collection"); longSection.id = "long";
    const longInner = el("div","container"); add(longInner,sectionHeading("01 / LONG-FORM",t.longTitle,t.longDescription,t.longCounter));
    const longGrid = el("div","long-grid");
    examples.filter(x=>x.kind==="long").forEach((item,index) => {
      const card = link("",safeResource(`examples/${encodeURIComponent(item.id)}/index.html`),"example-card"); card.lang = item.lang;
      const art = el("div","card-art"); art.setAttribute("aria-hidden","true");
      const motif = el("div","card-motif"); for(let n=0;n<6;n++) motif.appendChild(el("i"));
      add(art,el("span","card-language",item.lang==="zh"?"中文 / ZH":"ENGLISH / EN"),el("span","card-number",String(index+1).padStart(2,"0")),motif);
      const body = el("div","card-body"); const bottom = el("div","card-bottom");
      add(bottom,el("span","",`${durationLabel(item.duration)}${item.referenceEvents ? ` · ${Number(item.referenceEvents).toLocaleString()} ${t.events}` : ""}`),el("span","arrow","↗"));
      add(body,el("div","card-domain",item.domain),el("h3","",item.title),el("p","",item.description),bottom); add(card,art,body);longGrid.appendChild(card);
    });
    if(!longGrid.children.length)longGrid.appendChild(el("p","",t.noSaved));add(longInner,longGrid);add(longSection,longInner);main.appendChild(longSection);
    const shortSection = el("section","collection");shortSection.id="short";const shortInner = el("div","container");
    add(shortInner,sectionHeading("02 / SHORT-FORM",t.shortTitle,t.shortDescription,t.shortCounter));const shortGrid=el("div","short-grid");
    examples.filter(x=>x.kind==="short").forEach(item=>{
      const card=link("",safeResource(`examples/${encodeURIComponent(item.id)}/index.html`),"short-card");card.lang=item.lang;
      const info=el("div","short-info");add(info,el("h3","",item.title),el("small","",`${item.domain} · ${item.lang==="zh"?"中文":"English"}${item.description?` · ${item.description}`:""}`));
      add(card,el("span","short-icon","♫"),info,el("span","short-duration",clock(item.duration)),el("span","arrow","↗"));shortGrid.appendChild(card);
    });
    if(!shortGrid.children.length)shortGrid.appendChild(el("p","",t.noSaved));add(shortInner,shortGrid);add(shortSection,shortInner);main.appendChild(shortSection);
    const about=el("section","collection");about.id="about";const aboutInner=el("div","container");add(aboutInner,sectionHeading(t.workEyebrow,t.aboutTitle,"",""));
    const grid=el("div","about-grid");for(let n=1;n<=3;n++){const item=el("div","about-item");add(item,el("span","about-number",`0${n}`),el("h3","",t[`about${n}Title`]),el("p","",t[`about${n}Text`]));grid.appendChild(item);}
    add(aboutInner,grid,el("div","model-note",t.modelNote));add(about,aboutInner);main.appendChild(about);add(app,header(),main,footer());
  }

  function prepareEvents(raw) {
    return (Array.isArray(raw)?raw:[]).map((event,index)=>({
      ...event,id:String(event.id===undefined?`event-${index+1}`:event.id),start:seconds(event.start),end:Math.max(seconds(event.start),seconds(event.end)),attributes:event.attributes&&typeof event.attributes==="object"?event.attributes:{},ancestors:Array.isArray(event.ancestors)?event.ancestors:[],_search:[event.headline,event.summary,event.type,typeLabel(event.type),...Object.entries(event.attributes||{}).flatMap(([key,val])=>[key,formatValue(val)])].join(" ").toLocaleLowerCase(lang)
    })).sort((a,b)=>a.start-b.start||a.end-b.end);
  }

  async function examplePage(catalog,item) {
    setLang(item.lang);document.title=`${item.title} · ${research.title}`;app.replaceChildren(el("p","loading",t.loading));
    const data=await loadJSON(item.data);const reference=prepareEvents(data.reference?.events);
    const predictionMap={};Object.entries(data.predictions||{}).forEach(([id,prediction])=>{predictionMap[id]={...prediction,events:prepareEvents(prediction.events)};});
    const panels=["reference","longcap-35b","longcap-122b"];
    const modelPanels=panels.slice(1);
    const panelNames={reference:t.reference,"longcap-35b":"LongCap 35B","longcap-122b":"LongCap 122B"};
    const panelClasses={reference:"reference-column","longcap-35b":"model-35b-column","longcap-122b":"model-122b-column"};
    const panelColors={reference:"#8db299","longcap-35b":"#b29bd5","longcap-122b":"#e0bc85"};
    const panelRecord=factory=>Object.fromEntries(panels.map(side=>[side,factory()]));
    const state={time:0,span:120,windowStart:0,search:"",type:"",follow:true,selected:null,pages:panelRecord(()=>0),sets:panelRecord(()=>new Set()),ancestors:panelRecord(()=>new Set()),lastActive:"",pageSize:80,pendingSeek:null,wantsPlay:false,sourceIndex:-1,hasPlayed:false,mediaFailed:false,blobURL:null,fullLoading:false,fullFetch:null,fetchController:null,disposed:false};
    const totalDuration=seconds(data.duration||item.duration);const refs={};
    const getEvents=side=>side==="reference"?reference:(predictionMap[side]?.events||[]);
    const maps=Object.fromEntries(panels.map(side=>[side,new Map(getEvents(side).map(event=>[event.id,event]))]));
    const main=el("main","container");const breadcrumb=el("div","breadcrumb");add(breadcrumb,link(t.home,base.href),el("span","","/"),el("span","",item.kind==="long"?t.fullRecording:t.shortClip));
    const intro=el("section","demo-intro"),introCopy=el("div");const meta=el("div","demo-meta");
    add(meta,el("span","",durationLabel(totalDuration)),el("span","",item.domain),el("span","",`${reference.length.toLocaleString(lang)} ${t.countReference}`));
    add(introCopy,el("div","eyebrow",t.room),el("h1","",item.title),el("p","",item.description),meta);add(intro,introCopy,el("span","research-pill",t.demoLabel));
    const player=el("section","player-shell");player.setAttribute("aria-label",t.player);const top=el("div","player-top"),playerTitle=el("div","player-title");add(playerTitle,el("span","play-dot"),el("span","",t.player));refs.playerTime=el("div","player-time",`${clock(0)} / ${clock(totalDuration)}`);add(top,playerTitle,refs.playerTime);
    const waveformWrap=el("div","player-wave-wrap");refs.wave=el("canvas","player-wave");refs.wave.tabIndex=0;refs.wave.setAttribute("role","slider");refs.wave.setAttribute("aria-label",t.waveformLabel);refs.wave.setAttribute("aria-valuemin","0");refs.wave.setAttribute("aria-valuemax",String(totalDuration));refs.wave.setAttribute("aria-valuenow","0");add(waveformWrap,refs.wave);
    const help=el("div","wave-help");add(help,el("span","",t.scrub),el("span","",Array.isArray(data.waveform)&&data.waveform.length?`${clock(0)} — ${clock(totalDuration)}`:t.flatWave));
    const audioRow=el("div","audio-row");refs.audio=el("audio");refs.audio.controls=true;refs.audio.preload="metadata";refs.audio.setAttribute("aria-label",t.player);refs.audio.controlsList="nodownload";
    const describedSources=Array.isArray(item.audioSources)&&item.audioSources.length?item.audioSources:[{src:item.audio,type:/\.mp3(?:$|\?)/i.test(item.audio||"")?"audio/mpeg":"audio/webm; codecs=\"opus\""}];
    const audioSources=describedSources.filter(source=>source?.src).map(source=>({...source,url:safeResource(source.src)}));
    refs.playToggle=button(t.playAudio,"audio-play-toggle",togglePlayback,t.playAudio);refs.playToggle.setAttribute("aria-pressed","false");
    const speedLabel=el("label","playback-speed",`${t.speed} `),speed=el("select");speed.setAttribute("aria-label",t.speed);[.75,1,1.25,1.5,2].forEach(value=>{const option=el("option","",`${value}×`);option.value=String(value);if(value===1)option.selected=true;speed.appendChild(option);});speed.addEventListener("change",()=>{refs.audio.playbackRate=Number(speed.value);});add(speedLabel,speed);add(audioRow,refs.playToggle,refs.audio,speedLabel);
    refs.audioError=el("p","audio-error hidden",t.audioError);refs.audioError.setAttribute("role","status");refs.playStatus=el("div","playback-status",t.mediaLoading);refs.playStatus.setAttribute("role","status");refs.playStatus.setAttribute("aria-live","polite");
    const timelineBox=el("div","timeline-box"),timelineLegend=el("div","timeline-legend");panels.forEach(side=>{const item=el("span","timeline-label");item.dataset.panel=side;add(item,el("i",`legend-swatch ${side==="longcap-35b"?"model-35b":side==="longcap-122b"?"model-122b":""}`),el("span","",panelNames[side]));timelineLegend.appendChild(item);});const zoomLabel=el("label","timeline-zoom");refs.zoom=el("input");refs.zoom.type="checkbox";refs.zoom.checked=true;add(zoomLabel,refs.zoom,el("span","",t.zoom));timelineLegend.appendChild(zoomLabel);
    refs.timeline=el("canvas","event-timeline");refs.timeline.tabIndex=0;refs.timeline.setAttribute("role","slider");refs.timeline.setAttribute("aria-label",t.timelineLabel);refs.timeline.setAttribute("aria-valuemin","0");refs.timeline.setAttribute("aria-valuemax",String(totalDuration));refs.timeline.setAttribute("aria-valuenow","0");refs.hotspots=el("div","timeline-hotspots");add(timelineBox,timelineLegend,refs.timeline,refs.hotspots);add(player,top,waveformWrap,help,audioRow,refs.playStatus,refs.audioError,timelineBox);
    const workspace=el("section","workspace");const toolbar=el("div","explorer-toolbar");
    const searchField=el("label","field");add(searchField,el("span","field-label",t.search));refs.search=el("input");refs.search.type="search";refs.search.placeholder=t.searchPlaceholder;refs.search.setAttribute("aria-label",t.search);add(searchField,refs.search);
    const followLabel=el("label","follow-label");refs.follow=el("input");refs.follow.type="checkbox";refs.follow.checked=true;add(followLabel,refs.follow,el("span","",t.follow));add(toolbar,searchField,el("span","simultaneous-note",t.compareBoth),followLabel);
    const secondary=el("div","explorer-secondary"),typeField=el("label","field");add(typeField,el("span","field-label",t.eventType));refs.type=el("select");refs.type.setAttribute("aria-label",t.eventType);add(typeField,refs.type);
    const spanField=el("label","field");add(spanField,el("span","field-label",t.visibleSpan));refs.span=el("select");refs.span.setAttribute("aria-label",t.visibleSpan);[[120,t.span120],[300,t.span300],[600,t.span600],[0,t.spanFull]].forEach(([value,label])=>{const option=el("option","",label);option.value=String(value);refs.span.appendChild(option);});add(spanField,refs.span);
    const timeField=el("label","field time-field");add(timeField,el("span","field-label",t.jumpTime));refs.jumpTime=el("input");refs.jumpTime.type="text";refs.jumpTime.placeholder=t.jumpPlaceholder;refs.jumpTime.setAttribute("aria-label",t.jumpTime);add(timeField,refs.jumpTime);
    const timeControls=el("div","inline-controls");refs.previousWindow=button("←","icon-button",()=>moveWindow(-1),t.previousWindow);refs.nextWindow=button("→","icon-button",()=>moveWindow(1),t.nextWindow);add(timeControls,button(t.go,"icon-button",jumpEnteredTime),refs.previousWindow,refs.nextWindow,button(t.now,"icon-button",()=>goToTime(state.time,false),t.nowTitle));refs.viewStatus=el("div","view-status");add(secondary,typeField,spanField,timeField,timeControls,refs.viewStatus);
    const legend=el("div","comparison-legend");refs.currentTimeLegend=el("span","status-chip",t.atCurrentTime);add(legend,refs.currentTimeLegend,el("span","status-chip ancestor",t.ancestor),el("span","status-chip unresolved",t.unresolved));
    const tray=el("aside","ancestor-tray");tray.setAttribute("aria-label",t.ancestorTray);add(tray,el("span","ancestor-tray-title",`↳ ${t.ancestorTray}`));refs.trayLinks=el("div","ancestor-tray-links");add(tray,refs.trayLinks);
    const comparison=el("div","comparison-grid");panels.forEach(side=>{
      const column=el("section",`event-column ${panelClasses[side]}`);column.dataset.panel=side;const heading=el("div","column-heading"),headingText=el("div");const title=el("h2","column-title",panelNames[side]);title.style.margin="0";refs[`${side}Subtitle`]=el("div","column-subtitle");refs[`${side}Count`]=el("span","column-count");add(headingText,title,refs[`${side}Subtitle`]);add(heading,headingText,refs[`${side}Count`]);
      const live=el("section","live-context");live.setAttribute("aria-label",`${panelNames[side]} · ${t.liveView}`);
      const liveHeading=el("div","live-context-heading");add(liveHeading,el("h3","",t.liveView),el("span","live-context-marker","●"));
      const currentHeading=el("div","live-group-heading");refs[`${side}CurrentTitle`]=el("h4","",t.atCurrentTime);refs[`${side}CurrentCount`]=el("span","", "0");add(currentHeading,refs[`${side}CurrentTitle`],refs[`${side}CurrentCount`]);
      refs[`${side}CurrentContent`]=el("div","live-current-content");refs[`${side}CurrentContent`].setAttribute("aria-label",`${panelNames[side]} · ${t.currentEvents}`);refs[`${side}CurrentNodes`]=new Map();
      const contextHeading=el("div","live-group-heading linked-heading");add(contextHeading,el("h4","",t.linkedEvents));refs[`${side}ContextCount`]=el("span","","0");contextHeading.appendChild(refs[`${side}ContextCount`]);
      refs[`${side}ContextContent`]=el("div","live-linked-content");refs[`${side}ContextContent`].setAttribute("aria-label",`${panelNames[side]} · ${t.linkedEvents}`);refs[`${side}ContextNodes`]=new Map();
      add(live,liveHeading,el("p","live-context-hint",t.liveHint),currentHeading,refs[`${side}CurrentContent`],contextHeading,refs[`${side}ContextContent`]);
      const browserHeading=el("div","main-events-heading",t.eventBrowser);
      refs[`${side}Content`]=el("div","column-content");refs[`${side}Content`].setAttribute("aria-label",`${panelNames[side]} · ${t.eventBrowser}`);refs[`${side}Nodes`]=new Map();
      const pagination=el("div","column-pagination");refs[`${side}Prev`]=button(t.previous,"icon-button",()=>changePage(side,-1));refs[`${side}Page`]=el("span");refs[`${side}Next`]=button(t.next,"icon-button",()=>changePage(side,1));add(pagination,refs[`${side}Prev`],refs[`${side}Page`],refs[`${side}Next`]);add(column,heading,live,browserHeading,refs[`${side}Content`],pagination);comparison.appendChild(column);
    });
    refs.announce=el("div","sr-only");refs.announce.setAttribute("role","status");refs.announce.setAttribute("aria-live","polite");add(workspace,toolbar,secondary,legend,tray,comparison,el("p","protocol-note",t.linkSemantics),refs.announce);add(main,breadcrumb,intro,player,workspace);app.replaceChildren();add(app,header(true),main,footer());

    function toast(message){document.querySelector(".toast")?.remove();const node=el("div","toast",message);node.setAttribute("role","status");document.body.appendChild(node);setTimeout(()=>node.remove(),4000);}
    function clearMediaError(){state.mediaFailed=false;refs.audioError.classList.add("hidden");}
    function mediaError(message,code){state.mediaFailed=true;const description=code?`${message} (${lang==="zh"?"错误":"Error"} ${code})`:message;refs.audioError.textContent=description;refs.audioError.classList.remove("hidden");refs.playStatus.textContent=description;state.wantsPlay=false;updatePlaybackUI();}
    function updatePlaybackUI(status){
      const playing=!refs.audio.paused&&!refs.audio.ended;
      const canPause=playing||(state.fullLoading&&state.wantsPlay);
      refs.playToggle.textContent=canPause?t.pauseAudio:t.playAudio;refs.playToggle.title=canPause?t.pauseAudio:t.playAudio;refs.playToggle.setAttribute("aria-label",canPause?t.pauseAudio:t.playAudio);refs.playToggle.setAttribute("aria-pressed",String(canPause));
      const label=playing&&!state.fullLoading?t.active:t.atCurrentTime;refs.currentTimeLegend.textContent=label;panels.forEach(side=>{refs[`${side}CurrentTitle`].textContent=label;});document.querySelectorAll(".event-state-active").forEach(node=>{node.textContent=label;});
      if(state.fullLoading&&!state.mediaFailed)refs.playStatus.textContent=t.mediaSeeking;
      else if(status)refs.playStatus.textContent=status;
      else if(!state.mediaFailed)refs.playStatus.textContent=refs.audio.ended?t.mediaEnded:playing?t.mediaPlaying:refs.audio.readyState>0?(state.hasPlayed?t.mediaPaused:t.mediaReady):t.mediaLoading;
    }
    function releaseFullAudio(){
      state.fetchController?.abort();state.fetchController=null;
      if(state.blobURL){URL.revokeObjectURL(state.blobURL);state.blobURL=null;}
    }
    function loadNextSource(){
      let next=state.sourceIndex+1;while(next<audioSources.length&&audioSources[next].type&&refs.audio.canPlayType(audioSources[next].type)==="")next++;
      if(next>=audioSources.length)return false;
      const resumeTime=state.pendingSeek===null?state.time:state.pendingSeek;releaseFullAudio();state.sourceIndex=next;state.pendingSeek=resumeTime;state.mediaFailed=false;refs.audio.src=audioSources[next].url;refs.audio.load();refs.audio.playbackRate=Number(speed.value);updatePlaybackUI(next?t.mediaRetry:t.mediaLoading);return true;
    }
    function targetAvailable(target){
      if(state.blobURL)return refs.audio.readyState>0;
      if(target<0.05)return refs.audio.readyState>0;
      const ranges=refs.audio.seekable;for(let i=0;i<ranges.length;i++)if(target>=ranges.start(i)&&target<=ranges.end(i)-0.05)return true;
      return false;
    }
    function ensureFullAudio(){
      if(state.fullFetch||state.disposed||state.sourceIndex<0)return;
      const source=audioSources[state.sourceIndex],sourceIndex=state.sourceIndex;
      const controller=new AbortController();state.fetchController=controller;state.fullLoading=true;clearMediaError();refs.audio.pause();refs.audio.removeAttribute("src");refs.audio.load();updatePlaybackUI();
      state.fullFetch=(async()=>{
        try{
          const response=await fetch(source.url,{credentials:"omit",cache:"no-store",redirect:"error",signal:controller.signal});
          if(!response.ok)throw new Error("Audio download failed");
          const data=await response.blob();if(!data.size)throw new Error("Audio download empty");
          if(state.disposed||controller.signal.aborted||state.sourceIndex!==sourceIndex)return;
          const objectURL=URL.createObjectURL(new Blob([data],{type:/\.mp3(?:$|\?)/i.test(source.src)?"audio/mpeg":"audio/webm"}));
          if(state.blobURL)URL.revokeObjectURL(state.blobURL);state.blobURL=objectURL;state.fullLoading=false;refs.audio.src=objectURL;refs.audio.load();refs.audio.playbackRate=Number(speed.value);updatePlaybackUI(t.mediaBuffering);
        }catch(error){
          if(state.disposed||controller.signal.aborted)return;
          state.fullLoading=false;
          if(!loadNextSource())mediaError(t.mediaNetwork);
        }finally{
          if(state.fetchController===controller)state.fetchController=null;
          state.fullFetch=null;
        }
      })();
    }
    function applyPendingSeek(){
      if(state.pendingSeek===null)return true;
      if(state.fullLoading)return false;
      const target=state.pendingSeek;
      if(!targetAvailable(target)){
        if(target>0.05)ensureFullAudio();
        return false;
      }
      if(refs.audio.readyState===0)return false;
      if(Math.abs(refs.audio.currentTime-target)<0.08&&!refs.audio.seeking){state.pendingSeek=null;state.time=target;return true;}
      if(refs.audio.seeking&&Math.abs(refs.audio.currentTime-target)<0.08)return false;
      try{refs.audio.currentTime=target;state.time=target;return false;}catch(_error){return false;}
    }
    function startPlayback(){
      state.wantsPlay=true;
      if(state.mediaFailed){state.sourceIndex=-1;if(!loadNextSource()){mediaError(t.mediaUnsupported);return;}}
      if(!applyPendingSeek()){updatePlaybackUI(state.fullLoading?t.mediaSeeking:t.mediaBuffering);return;}
      const startedSource=state.sourceIndex;let result;try{result=refs.audio.play();}catch(error){handlePlayRejection(error);return;}
      if(result&&typeof result.catch==="function")result.catch(error=>{if(state.sourceIndex===startedSource&&!state.fullLoading)handlePlayRejection(error);});
    }
    function handlePlayRejection(error){if(error?.name==="AbortError")return;if(error?.name==="NotAllowedError"){state.wantsPlay=false;refs.audioError.textContent=t.mediaPlayBlocked;refs.audioError.classList.remove("hidden");updatePlaybackUI(t.mediaPlayBlocked);return;}if(error?.name==="NotSupportedError"&&loadNextSource()){if(state.wantsPlay)startPlayback();return;}mediaError(error?.name==="NotSupportedError"?t.mediaUnsupported:t.mediaDecode);}
    function togglePlayback(){
      if((state.fullLoading&&state.wantsPlay)||(!refs.audio.paused&&!refs.audio.ended)){state.wantsPlay=false;refs.audio.pause();updatePlaybackUI(t.mediaPaused);return;}
      if(refs.audio.ended){state.pendingSeek=0;state.time=0;}startPlayback();
    }
    function windowEnd(){return state.span?Math.min(totalDuration,state.windowStart+state.span):totalDuration;}
    function filtered(side){return getEvents(side).filter(event=>(!state.type||event.type===state.type)&&(!state.search||event._search.includes(state.search))&&((state.search||!state.span)||event.end>=state.windowStart&&event.start<=windowEnd()));}
    function rebuildTypes(){const types=[...new Set(panels.flatMap(getEvents).map(event=>event.type).filter(Boolean))].sort();refs.type.replaceChildren();const all=el("option","",t.allTypes);all.value="";refs.type.appendChild(all);types.forEach(type=>{const option=el("option","",typeLabel(type));option.value=type;refs.type.appendChild(option);});if(types.includes(state.type))refs.type.value=state.type;else state.type="";}
    function eventCard(event,side){
      const card=el("article","event-card");card.dataset.event=event.id;const top=el("div","event-card-top"),eventTime=button(`${clock(event.start)} – ${clock(event.end)}`,"event-time",activation=>selectEvent(side,event,true,activation),`${t.seek} ${clock(event.start)}`);add(top,el("span","event-type",typeLabel(event.type)),eventTime);
      const headlineText=event.headline||event.summary||t.typeOther;const headline=button(headlineText,"event-headline",activation=>selectEvent(side,event,true,activation));const summary=event.summary&&event.summary!==event.headline?el("p","event-summary",event.summary):null;
      const states=el("div","event-states");add(states,el("span","status-chip event-state-active",!refs.audio.paused&&!refs.audio.ended?t.active:t.atCurrentTime),el("span","status-chip ancestor event-state-ancestor",t.ancestor));
      headline.classList.add("caption-clamped");if(summary)summary.classList.add("hidden");
      add(card,top,headline,summary);
      const footer=el("div","event-card-footer");
      const more=button(t.readMore,"caption-expand",()=>{const expanding=more.getAttribute("aria-expanded")!=="true";more.setAttribute("aria-expanded",String(expanding));more.textContent=expanding?t.readLess:t.readMore;headline.classList.toggle("caption-clamped",!expanding);if(summary)summary.classList.toggle("hidden",!expanding);});more.setAttribute("aria-expanded","false");add(footer,more,states);
      const attrs=Object.entries(event.attributes||{});if(attrs.length){const details=el("details","event-details");add(details,el("summary","",`${t.details} (${attrs.length})`));details.addEventListener("toggle",()=>{if(details.open&&!details.dataset.loaded){const list=el("dl","attribute-list");attrs.forEach(([key,value])=>add(list,el("dt","",key),el("dd","",formatValue(value))));details.appendChild(list);details.dataset.loaded="true";}});footer.appendChild(details);}
      card.appendChild(footer);
      if(event.ancestors.length){const links=el("div","event-links");event.ancestors.forEach(ancestor=>{const target=maps[side].get(String(ancestor.target));const valid=ancestor.status==="valid"&&target;const label=`↳ ${ancestor.relation||t.dependency} · ${valid?clock(target.start):(ancestor.status==="ambiguous"?t.ambiguous:t.invalid)}`;const badge=button(label,`event-link${valid?"":" unresolved"}`,activation=>{state.selected={side,id:event.id};if(valid)selectEvent(side,target,true,activation);else{refreshHighlights();toast(ancestor.status==="ambiguous"?t.ambiguous:t.unresolved);}});if(valid)badge.title=`${target.headline||target.summary||t.typeOther} · ${clock(target.start)}`;links.appendChild(badge);});card.appendChild(links);}
      return card;
    }
    let captionFrame=0;
    function scheduleCaptionControls(){if(captionFrame)return;captionFrame=requestAnimationFrame(()=>{captionFrame=0;document.querySelectorAll(".event-card").forEach(card=>{const more=card.querySelector(".caption-expand"),headline=card.querySelector(".event-headline");if(!more||!headline)return;const expanded=more.getAttribute("aria-expanded")==="true";const hasSummary=Boolean(card.querySelector(".event-summary"));more.classList.toggle("hidden",!expanded&&!hasSummary&&headline.scrollHeight<=headline.clientHeight+1);});});}
    function renderLiveGroup(side,kind,events,emptyText){
      const content=refs[`${side}${kind}Content`],key=events.map(event=>event.id).join("|");
      refs[`${side}${kind}Count`].textContent=String(events.length);
      if(content.dataset.events===key)return;
      content.dataset.events=key;const old=refs[`${side}${kind}Nodes`],nodes=new Map();
      if(!events.length){content.replaceChildren(el("p","live-empty",emptyText));}
      else{content.querySelector(".live-empty")?.remove();events.forEach(event=>nodes.set(event.id,old.get(event.id)||eventCard(event,side)));for(const node of [...content.children])if(!nodes.has(node.dataset.event))node.remove();events.forEach((event,index)=>{const node=nodes.get(event.id);if(content.children[index]!==node)content.insertBefore(node,content.children[index]||null);});}
      refs[`${side}${kind}Nodes`]=nodes;scheduleCaptionControls();
    }
    function renderSide(side){
      const events=filtered(side);state.pages[side]=Math.max(0,Math.min(state.pages[side],Math.max(0,Math.ceil(events.length/state.pageSize)-1)));const offset=state.pages[side]*state.pageSize;const shown=events.slice(offset,offset+state.pageSize);const content=refs[`${side}Content`];const fragment=document.createDocumentFragment();refs[`${side}Nodes`]=new Map();shown.forEach(event=>{const card=eventCard(event,side);refs[`${side}Nodes`].set(event.id,card);fragment.appendChild(card);});
      if(!shown.length)fragment.appendChild(el("div","empty-panel",side!=="reference"&&!getEvents(side).length?t.missingPrediction:state.search||state.type?t.noMatches:t.noEvents));content.replaceChildren(fragment);scheduleCaptionControls();
      refs[`${side}Subtitle`].textContent=side==="reference"?t.referenceSubtitle:data.demoCuration?t.curatedPrediction:t.modelPrediction;
      refs[`${side}Count`].textContent=`${events.length.toLocaleString(lang)} / ${getEvents(side).length.toLocaleString(lang)}`;
      const pageCount=Math.max(1,Math.ceil(events.length/state.pageSize));refs[`${side}Page`].textContent=`${t.page} ${state.pages[side]+1} ${t.of} ${pageCount}`;refs[`${side}Prev`].disabled=state.pages[side]===0;refs[`${side}Next`].disabled=state.pages[side]>=pageCount-1;
    }
    function render(){panels.forEach(renderSide);refs.viewStatus.textContent=state.search?t.searchAcross:state.span?`${t.showingWindow} ${clock(state.windowStart)} – ${clock(windowEnd())}`:t.allTime;refs.previousWindow.disabled=!state.span||state.windowStart<=0;refs.nextWindow.disabled=!state.span||windowEnd()>=totalDuration;refreshHighlights();drawAll();}
    function changePage(side,delta){state.pages[side]+=delta;renderSide(side);refreshHighlights();refs[`${side}Content`].scrollTop=0;}
    function moveWindow(delta){if(!state.span)return;state.follow=false;refs.follow.checked=false;state.windowStart=Math.max(0,Math.min(Math.max(0,totalDuration-state.span),state.windowStart+delta*state.span));state.pages=panelRecord(()=>0);state.selected=null;render();}
    function parseTime(value){const clean=value.trim();if(!clean)return null;if(/^\d+(\.\d+)?$/.test(clean))return Number(clean);const parts=clean.split(":");if(parts.length<2||parts.length>3||parts.some(x=>!/^\d+(\.\d+)?$/.test(x)))return null;return parts.reduce((sum,p)=>sum*60+Number(p),0);}
    function jumpEnteredTime(){const value=parseTime(refs.jumpTime.value);if(value===null){toast(t.timeError);return;}goToTime(value,true);}
    function goToTime(value,changeAudio=true){const time=Math.max(0,Math.min(totalDuration,value));if(changeAudio){state.pendingSeek=time;state.time=time;applyPendingSeek();}if(state.span)state.windowStart=Math.min(Math.floor(time/state.span)*state.span,Math.max(0,totalDuration-state.span));state.pages=panelRecord(()=>0);render();refs.playerTime.textContent=`${clock(state.time)} / ${clock(totalDuration)}`;refs.announce.textContent=`${t.seekAnnouncement} ${clock(time)}`;}
    function scrollCard(side,id){const container=refs[`${side}Content`],card=refs[`${side}Nodes`].get(id);if(!card)return;const box=container.getBoundingClientRect(),cardBox=card.getBoundingClientRect();if(cardBox.top<box.top+12)container.scrollTop-=box.top+12-cardBox.top;else if(cardBox.bottom>box.bottom-12)container.scrollTop+=cardBox.bottom-box.bottom+12;}
    function selectEvent(side,event,seekAudio,activation){const focusOrigin=activation?.detail===0&&activation.currentTarget===document.activeElement?activation.currentTarget:null;const focusControl=focusOrigin?(focusOrigin.classList.contains("event-time")?".event-time":".event-headline"):null;if((state.search&&!event._search.includes(state.search))||(state.type&&event.type!==state.type)){state.search="";state.type="";refs.search.value="";refs.type.value="";toast(t.clearFilters);}state.selected={side,id:event.id};if(seekAudio){goToTime(event.start,true);startPlayback();}else render();const found=filtered(side).findIndex(item=>item.id===event.id);if(found>=0){state.pages[side]=Math.floor(found/state.pageSize);renderSide(side);refreshHighlights();scrollCard(side,event.id);if(focusControl&&!focusOrigin.isConnected)refs[`${side}Nodes`].get(event.id)?.querySelector(focusControl)?.focus({preventScroll:true});}}
    function ancestorIds(side,seeds){const ids=new Set();const visited=new Set();const queue=[...seeds];while(queue.length&&visited.size<20000){const id=queue.shift();if(visited.has(id))continue;visited.add(id);const event=maps[side].get(id);if(!event)continue;event.ancestors.forEach(ancestor=>{const target=String(ancestor.target);if(ancestor.status==="valid"&&maps[side].has(target)&&target!==id&&!seeds.has(target)){ids.add(target);if(!visited.has(target))queue.push(target);}});}return ids;}
    function refreshHighlights(){
      const trayItems=[];panels.forEach(side=>{const active=new Set(getEvents(side).filter(event=>event.start<=state.time&&event.end>state.time).map(event=>event.id));state.sets[side]=active;const seeds=new Set(active);if(state.selected?.side===side)seeds.add(state.selected.id);state.ancestors[side]=ancestorIds(side,seeds);
      const currentEvents=getEvents(side).filter(event=>active.has(event.id));
      const contextIds=ancestorIds(side,active),contextEvents=getEvents(side).filter(event=>contextIds.has(event.id)).sort((a,b)=>b.start-a.start);
      renderLiveGroup(side,"Current",currentEvents,t.noCurrent);renderLiveGroup(side,"Context",contextEvents,t.noCurrentLinks);
      ["Nodes","CurrentNodes","ContextNodes"].forEach(kind=>refs[`${side}${kind}`].forEach((card,id)=>{card.classList.toggle("is-active",active.has(id));card.classList.toggle("is-ancestor",state.ancestors[side].has(id));card.classList.toggle("is-selected",state.selected?.side===side&&state.selected.id===id);}));state.ancestors[side].forEach(id=>{const event=maps[side].get(id);if(event)trayItems.push({side,event});});});
      const hasSeed=Boolean(state.selected||panels.some(side=>state.sets[side].size));trayItems.sort((a,b)=>a.event.start-b.event.start);const trayKey=trayItems.map(({side,event})=>`${side}:${event.id}`).join("|")+`:${hasSeed}`;if(trayKey===state.lastTray)return;state.lastTray=trayKey;refs.trayLinks.replaceChildren();panels.forEach(side=>{const items=trayItems.filter(item=>item.side===side);if(!items.length)return;const group=el("div","ancestor-panel-group");group.dataset.panel=side;add(group,el("span","ancestor-panel-label",panelNames[side]));items.slice(0,6).forEach(({event})=>{const jump=button(`${panelNames[side]} ${clock(event.start)} · ${event.headline||event.summary||t.typeOther}`,"ancestor-jump",activation=>selectEvent(side,event,true,activation));jump.dataset.panel=side;group.appendChild(jump);});if(items.length>6)group.appendChild(el("span","ancestor-tray-note",`+${items.length-6}`));refs.trayLinks.appendChild(group);});if(!trayItems.length)refs.trayLinks.appendChild(el("span","ancestor-tray-note",hasSeed?t.noAncestors:t.ancestorEmpty));
    }
    function resizeCanvas(canvas){const rect=canvas.getBoundingClientRect(),ratio=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.floor(rect.width*ratio));canvas.height=Math.max(1,Math.floor(rect.height*ratio));const context=canvas.getContext("2d");context.scale(ratio,ratio);return {context,width:rect.width,height:rect.height};}
    function drawWave(){const {context:c,width:w,height:h}=resizeCanvas(refs.wave);c.clearRect(0,0,w,h);const values=Array.isArray(data.waveform)?data.waveform:[];c.strokeStyle="#93b0a3";c.lineWidth=1;const bars=Math.floor(w/4),progress=totalDuration?state.time/totalDuration:0;for(let i=0;i<bars;i++){const value=values.length?Math.max(0,Math.min(1,Number(values[Math.floor(i/bars*values.length)])||0)):0;const height=Math.max(2,value*(h-15));c.fillStyle=i/bars<=progress?"#c0d6ad":"#719788";c.fillRect(i*4,(h-height)/2,2,height);}const x=progress*w;c.strokeStyle="#e5dab7";c.beginPath();c.moveTo(x,5);c.lineTo(x,h-5);c.stroke();}
    function timelineRange(){return refs.zoom.checked&&state.span&&!state.search?{start:state.windowStart,end:windowEnd()}:{start:0,end:totalDuration};}
    function drawTimeline(){const {context:c,width:w,height:h}=resizeCanvas(refs.timeline);c.clearRect(0,0,w,h);if(!totalDuration)return;const range=timelineRange(),duration=Math.max(.001,range.end-range.start),laneHeight=h/panels.length;panels.forEach((side,index)=>{getEvents(side).filter(event=>event.end>=range.start&&event.start<=range.end).forEach(event=>{const start=Math.max(range.start,event.start),end=Math.min(range.end,event.end),x=(start-range.start)/duration*w,width=Math.max(1,(end-start)/duration*w);c.fillStyle=state.sets[side].has(event.id)?"#d5e6ad":state.ancestors[side].has(event.id)?"#d9bbed":panelColors[side];c.globalAlpha=state.sets[side].has(event.id)?.95:.58;c.fillRect(x,index*laneHeight+5,width,Math.max(5,laneHeight-10));});});c.globalAlpha=1;c.strokeStyle="#e7e5cb";c.lineWidth=1;c.strokeRect(0,2,w,h-4);if(state.time>=range.start&&state.time<=range.end){c.strokeStyle="#f7d798";c.beginPath();c.moveTo((state.time-range.start)/duration*w,0);c.lineTo((state.time-range.start)/duration*w,h);c.stroke();}}
    function drawAll(){drawWave();drawTimeline();refs.wave.setAttribute("aria-valuenow",String(Math.floor(state.time)));refs.wave.setAttribute("aria-valuetext",clock(state.time));refs.timeline.setAttribute("aria-valuenow",String(Math.floor(state.time)));refs.timeline.setAttribute("aria-valuetext",clock(state.time));}
    function hotspots(){refs.hotspots.replaceChildren();const chosen=[];for(let n=0;n<3;n++){const targetTime=n/3*totalDuration;modelPanels.forEach(side=>{const events=getEvents(side);const withLinks=events.filter(event=>event.ancestors.some(ancestor=>ancestor.status==="valid"));const pool=withLinks.length?withLinks:events;if(!pool.length)return;const chosenEvent=pool.reduce((best,event)=>Math.abs(event.start-targetTime)<Math.abs(best.start-targetTime)?event:best,pool[0]);if(!chosen.some(item=>item.side===side&&item.event.id===chosenEvent.id))chosen.push({side,event:chosenEvent});});}chosen.forEach(({side,event})=>{const hotspot=button(`${panelNames[side]} ${clock(event.start)} · ${event.headline||event.summary||t.typeOther}`,`timeline-hotspot ${side==="longcap-35b"?"model-35b":"model-122b"}`,activation=>selectEvent(side,event,true,activation));hotspot.dataset.panel=side;hotspot.dataset.event=event.id;refs.hotspots.appendChild(hotspot);});}
    function tick(){state.time=state.pendingSeek===null?seconds(refs.audio.currentTime):state.pendingSeek;refs.playerTime.textContent=`${clock(state.time)} / ${clock(totalDuration)}`;let moved=false;if(state.follow&&state.span&&!state.search&&(state.time<state.windowStart||state.time>=windowEnd())){state.windowStart=Math.min(Math.floor(state.time/state.span)*state.span,Math.max(0,totalDuration-state.span));state.pages=panelRecord(()=>0);render();moved=true;}if(!moved)refreshHighlights();const key=panels.map(side=>`${side}:${[...state.sets[side]].join(",")}`).join("|");if(state.follow&&!state.search&&key!==state.lastActive){panels.forEach(side=>{const first=getEvents(side).find(event=>state.sets[side].has(event.id));if(!first)return;const matching=filtered(side).findIndex(event=>event.id===first.id);if(matching<0)return;const needed=Math.floor(matching/state.pageSize);if(needed!==state.pages[side]){state.pages[side]=needed;renderSide(side);refreshHighlights();}scrollCard(side,first.id);});state.lastActive=key;}drawAll();}
    [refs.wave,refs.timeline].forEach(canvas=>{canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect(),fraction=(event.clientX-rect.left)/rect.width;state.selected=null;if(canvas===refs.timeline){const range=timelineRange(),time=range.start+fraction*(range.end-range.start);const lane=Math.max(0,Math.min(panels.length-1,Math.floor((event.clientY-rect.top)/rect.height*panels.length))),side=panels[lane];const candidate=getEvents(side).find(entry=>entry.start<=time&&entry.end>time);if(candidate)selectEvent(side,candidate,true);else goToTime(time,true);}else goToTime(fraction*totalDuration,true);});canvas.addEventListener("keydown",event=>{let time=null;if(event.key==="ArrowLeft")time=state.time-(event.shiftKey?60:5);if(event.key==="ArrowRight")time=state.time+(event.shiftKey?60:5);if(event.key==="Home")time=0;if(event.key==="End")time=totalDuration;if(time!==null){event.preventDefault();state.selected=null;goToTime(time,true);}});});refs.zoom.addEventListener("change",drawTimeline);
    refs.audio.addEventListener("timeupdate",()=>{if(!state.fullLoading)tick();});refs.audio.addEventListener("seeked",()=>{const ready=applyPendingSeek();tick();if(ready&&state.wantsPlay&&refs.audio.paused)startPlayback();});
    refs.audio.addEventListener("loadedmetadata",()=>{applyPendingSeek();tick();updatePlaybackUI();});
    refs.audio.addEventListener("canplay",()=>{clearMediaError();const ready=applyPendingSeek();updatePlaybackUI();if(ready&&state.wantsPlay&&refs.audio.paused)startPlayback();});
    refs.audio.addEventListener("playing",()=>{state.hasPlayed=true;state.wantsPlay=true;clearMediaError();updatePlaybackUI(t.mediaPlaying);});
    refs.audio.addEventListener("pause",()=>{if(!state.fullLoading&&state.pendingSeek===null&&!refs.audio.seeking&&refs.audio.readyState>0&&!refs.audio.error)state.wantsPlay=false;updatePlaybackUI();});
    refs.audio.addEventListener("play",()=>{state.wantsPlay=true;updatePlaybackUI(t.mediaBuffering);});
    refs.audio.addEventListener("waiting",()=>updatePlaybackUI(t.mediaBuffering));
    refs.audio.addEventListener("stalled",()=>updatePlaybackUI(t.mediaBuffering));
    refs.audio.addEventListener("ended",()=>{state.wantsPlay=false;updatePlaybackUI(t.mediaEnded);});
    refs.audio.addEventListener("error",()=>{const failure=refs.audio.error;if(!failure||state.fullLoading||state.disposed)return;const code=failure.code||4;if(loadNextSource()){if(state.wantsPlay)startPlayback();return;}mediaError(code===2?t.mediaNetwork:code===3?t.mediaDecode:code===1?t.mediaAborted:t.mediaUnsupported,code);});
    window.addEventListener("pagehide",()=>{state.disposed=true;releaseFullAudio();},{once:true});
    window.addEventListener("pageshow",event=>{if(event.persisted&&state.disposed)window.location.reload();});
    let searchTimer;refs.search.addEventListener("input",()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{state.search=refs.search.value.trim().toLocaleLowerCase(lang);state.pages=panelRecord(()=>0);state.selected=null;render();},150);});refs.follow.addEventListener("change",()=>{state.follow=refs.follow.checked;if(state.follow)goToTime(state.time,false);});refs.type.addEventListener("change",()=>{state.type=refs.type.value;state.pages=panelRecord(()=>0);render();});refs.span.addEventListener("change",()=>{state.span=Number(refs.span.value);state.windowStart=state.span?Math.min(Math.floor(state.time/state.span)*state.span,Math.max(0,totalDuration-state.span)):0;state.pages=panelRecord(()=>0);render();});refs.jumpTime.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();jumpEnteredTime();}});
    rebuildTypes();hotspots();render();if(!loadNextSource())mediaError(t.mediaUnsupported);if(typeof ResizeObserver!=="undefined"){const resize=new ResizeObserver(()=>drawAll());resize.observe(player);const captionsResize=new ResizeObserver(scheduleCaptionControls);captionsResize.observe(comparison);}else window.addEventListener("resize",drawAll);
  }

  function fatal(error){app.replaceChildren();const panel=el("main","fatal-error");add(panel,el("strong","",t.error),el("p","",window.location.protocol==="file:"?t.fileHint:t.errorDetail),button(t.retry,"button",()=>window.location.reload()),exampleId&&link(t.back,base.href,"button secondary"));add(app,header(Boolean(exampleId)),panel,footer());console.error("LongCap local demo:",error.message);}
  loadJSON("catalog.json").then(catalog=>{if(!exampleId){mainPage(catalog);return;}const item=(catalog.examples||[]).find(example=>example.id===exampleId);if(!item)throw new Error(words.en.errorMissing);return examplePage(catalog,item);}).catch(fatal);
})();
