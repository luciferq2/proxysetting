// ============================================================
// Encoding-safe build: every non-ASCII character is a \uXXXX escape.
// Bytes are pure ASCII, but JS restores the original emoji / CJK at parse time.
// CordC \u8986\u5199\u811A\u672C\uFF08\u624B\u673A / \u684C\u9762\u901A\u7528\u7248\uFF09
//   1. \u65B0\u589E 3 \u4E2A\u7B56\u7565\u7EC4\uFF1A\uD83E\uDD16 OpenAI / \uD83E\uDDE0 Claude / \u2728 Gemini
//      \u2014\u2014 \u63D2\u5728\u300C\u8282\u70B9\u9009\u62E9\u300D\u7EC4\u540E\u9762\uFF1B\u627E\u4E0D\u5230\u8BE5\u7EC4\u5219\u6392\u5728\u6700\u524D
//   2. \u7EC4\u6210\u5458\u53EA\u4F7F\u7528\u771F\u5B9E\u8282\u70B9\u540D + DIRECT\uFF0C\u4E0D\u5F15\u7528\u4EFB\u4F55\u7B56\u7565\u7EC4
//      \u2014\u2014 \u624B\u673A\u7AEF\u7EC4\u540D\u4E0E\u684C\u9762\u4E0D\u540C\u4E5F\u4E0D\u4F1A\u518D\u62A5 proxy group not found
//   3. \u628A AI \u57DF\u540D\u89C4\u5219\u63D2\u5230\u89C4\u5219\u5217\u8868\u6700\u524D\u9762
//
// \u7528\u6CD5\uFF1A\u8BBE\u7F6E -> \u9AD8\u7EA7 -> \u811A\u672C -> \u7F16\u8F91 -> \u5168\u9009\u5220\u9664 -> \u7C98\u8D34\u672C\u6587\u4EF6 -> \u4FDD\u5B58 -> \u91CD\u8F7D\u914D\u7F6E
// \u6062\u590D\uFF1A\u5220\u9664\u811A\u672C\u5373\u53EF
// ============================================================

const AI_RULES = [
  "DOMAIN,ab.chatgpt.com,\uD83E\uDD16 OpenAI",
  "DOMAIN,api.openai.com,\uD83E\uDD16 OpenAI",
  "DOMAIN,auth.openai.com,\uD83E\uDD16 OpenAI",
  "DOMAIN,chat.openai.com.cdn.cloudflare.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,chatgpt.livekit.cloud,\uD83E\uDD16 OpenAI",
  "DOMAIN,o33249.ingest.sentry.io,\uD83E\uDD16 OpenAI",
  "DOMAIN,o33249.ingest.us.sentry.io,\uD83E\uDD16 OpenAI",
  "DOMAIN,openai-api.arkoselabs.com,\uD83E\uDD16 OpenAI",
  "DOMAIN,openaiapi-site.azureedge.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,openaiassets.blob.core.windows.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,openaicom.imgix.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,openaicomproductionae4b.blob.core.windows.net,\uD83E\uDD16 OpenAI",
  "DOMAIN,platform.openai.com,\uD83E\uDD16 OpenAI",
  "DOMAIN,production-openaicom-storage.azureedge.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,chat.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.livekit.cloud,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.site,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,client-api.arkoselabs.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,crixet.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,events.statsigapi.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,featuregates.org,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,host.livekit.cloud,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,identrust.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,intercom.io,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,intercomcdn.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,launchdarkly.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,oaistatic.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,oaistatsig.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,oaiusercontent.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,observeit.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,openai.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,openai.com.cdn.cloudflare.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,openai.org,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,openaiapi-site.azureedge.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,openaicom.imgix.net,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,segment.io,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,sentry.io,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,sora.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,stripe.com,\uD83E\uDD16 OpenAI",
  "DOMAIN-SUFFIX,turn.livekit.cloud,\uD83E\uDD16 OpenAI",
  "DOMAIN-KEYWORD,openai,\uD83E\uDD16 OpenAI",
  "DOMAIN,api.anthropic.com,\uD83E\uDDE0 Claude",
  "DOMAIN,console.anthropic.com,\uD83E\uDDE0 Claude",
  "DOMAIN,servd-anthropic-website.b-cdn.net,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,ant.dev,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,anthropic.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,anthropic.team,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,antspace.dev,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,chatbotclaude.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,clau.de,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.ai,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.app,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.dev,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.new,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claude.site,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudeacademy.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudemcpclient.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudemcpcontent.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudepages.dev,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudestudio.com,\uD83E\uDDE0 Claude",
  "DOMAIN-SUFFIX,claudeusercontent.com,\uD83E\uDDE0 Claude",
  "DOMAIN,ai.google.dev,\u2728 Gemini",
  "DOMAIN,aistudio.google.com,\u2728 Gemini",
  "DOMAIN,alkalicore-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN,alkalimakersuite-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN,antigravity-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN,antigravity.googleapis.com,\u2728 Gemini",
  "DOMAIN,appsgenaiserver-pa.clients.google.com,\u2728 Gemini",
  "DOMAIN,appsgenaiserver-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN,appsgenaiserver-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN,bard.google.com,\u2728 Gemini",
  "DOMAIN,cloudaicompanion.googleapis.com,\u2728 Gemini",
  "DOMAIN,cloudcode-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN,daily-cloudcode-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN,gemini.google.com,\u2728 Gemini",
  "DOMAIN,geminiweb-pa.clients.google.com,\u2728 Gemini",
  "DOMAIN,geminiweb-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN,jules.google.com,\u2728 Gemini",
  "DOMAIN,makersuite.google.com,\u2728 Gemini",
  "DOMAIN,notebooklm-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN,notebooklm.google.com,\u2728 Gemini",
  "DOMAIN,notebooklm.googleapis.com,\u2728 Gemini",
  "DOMAIN,webchannel-alkalimakersuite-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,ai.studio,\u2728 Gemini",
  "DOMAIN-SUFFIX,aicode.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,aida.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,aiplatform.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,aisandbox-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,aistudio.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,antigravity-unleash.goog,\u2728 Gemini",
  "DOMAIN-SUFFIX,antigravity.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,bard.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,deepmind.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,deepmind.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,flow.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,flow.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,geller-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,gemini.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,gemini.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,gemini.gstatic.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,generativeai.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,generativelanguage.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,jules.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,jules.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,labs.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,labs.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,labstailwind.pa.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,makersuite.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,notebook.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,notebook.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,notebooklm.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,notebooklm.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,opal.google,\u2728 Gemini",
  "DOMAIN-SUFFIX,opal.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,proactivebackend-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,robinfrontend-pa.googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,stitch.withgoogle.com,\u2728 Gemini",
  "DOMAIN-KEYWORD,colab,\u2728 Gemini",
  "DOMAIN-KEYWORD,developerprofiles,\u2728 Gemini",
  "DOMAIN-KEYWORD,generativelanguage,\u2728 Gemini",
  "DOMAIN-SUFFIX,ai.google.dev,\u2728 Gemini",
  "DOMAIN-SUFFIX,antigravity.google.com,\u2728 Gemini",
  "PROCESS-NAME,Antigravity,\u2728 Gemini",
  "PROCESS-NAME,Antigravity.exe,\u2728 Gemini",
  "PROCESS-NAME,antigravity,\u2728 Gemini",
  "DOMAIN,accounts.google.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,ogs.google.com,\u2728 Gemini",
  "DOMAIN,clients4.google.com,\u2728 Gemini",
  "DOMAIN,signaler-pa.clients6.google.com,\u2728 Gemini",
  "DOMAIN,ssl.gstatic.com,\u2728 Gemini",
  "DOMAIN,www.gstatic.com,\u2728 Gemini",
  "DOMAIN,fonts.gstatic.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,googleapis.com,\u2728 Gemini",
  "DOMAIN-SUFFIX,googleusercontent.com,\u2728 Gemini"
];

function main(config) {
  // ---------- 1. \u6536\u96C6\u8282\u70B9\u540D\uFF08\u4EC5\u6392\u9664\u9999\u6E2F/\u6E2F\u5B57\u76F8\u5173\u8282\u70B9\uFF0C\u4FDD\u7559\u5176\u4F59\u5168\u90E8\u8282\u70B9\uFF1B\u4E0D\u5F15\u7528\u5916\u90E8\u7B56\u7565\u7EC4\uFF09 ----------
  const proxies = config.proxies || [];
  // \u9999\u6E2F = HK (2 chars), \u6E2F = "Gang" (single char, matches Hu-Gang/Shen-Gang/Gang-BGP etc.)
  const HK_EXCLUDE = /\u9999\u6E2F|\u6E2F|HK|Hong\s*Kong|HGC|PCCW|WTT/i;
  const names = proxies
    .map(function (p) { return p.name || ""; })
    .filter(function (n) { return Boolean(n) && !HK_EXCLUDE.test(n); });

  function pick(kw) {
    const out = [];
    for (let i = 0; i < names.length; i++) {
      if (names[i].indexOf(kw) >= 0 && out.indexOf(names[i]) < 0) out.push(names[i]);
    }
    return out;
  }

  // ---------- 2. \u6784\u9020\u4E09\u4E2A\u7EC4\uFF1A\u6309\u65E5\u53F0\u65B0\u7F8E\u6392\u524D\uFF0C\u5176\u540E\u8865\u5168\u5176\u4F59\u975E\u6E2F\u8282\u70B9 ----------
  function makeGroup(groupName) {
    let members = [];
    ["\u65E5\u672C", "JP", "Japan",
     "\u53F0\u6E7E", "TW", "Taiwan",
     "\u65B0\u52A0\u5761", "SG", "Singapore",
     "\u7F8E\u56FD", "US", "United States"].forEach(function (kw) {
      pick(kw).forEach(function (n) {
        if (members.indexOf(n) < 0) members.push(n);
      });
    });
    // \u5176\u4F59\u6240\u6709\u975E\u9999\u6E2F\u8282\u70B9\u5168\u90E8\u4FDD\u7559\u5E76\u8865\u5728\u540E\u9762
    names.forEach(function (n) {
      if (members.indexOf(n) < 0) members.push(n);
    });
    // \u4E00\u4E2A\u8282\u70B9\u90FD\u6CA1\u6709 \u2192 \u4E0D\u5EFA\u7EC4\uFF0C\u7EDD\u4E0D\u4EA7\u751F\u65E0\u6548\u5F15\u7528
    if (members.length === 0) return null;
    if (members.indexOf("DIRECT") < 0) members.push("DIRECT");
    return { name: groupName, type: "select", proxies: members };
  }

  const NEW_NAMES = ["\u2728 Gemini", "\uD83E\uDD16 OpenAI", "\uD83E\uDDE0 Claude"];
  // \u5148\u79FB\u9664\u4E0A\u6B21\u751F\u6210\u7684\u540C\u540D\u7EC4\uFF0C\u4FDD\u8BC1\u6BCF\u6B21\u91CD\u8F7D\u6210\u5458\u90FD\u662F\u6700\u65B0\u7684\u8282\u70B9\u5217\u8868
  let groups = (config["proxy-groups"] || []).filter(function (g) {
    return NEW_NAMES.indexOf(g.name) < 0;
  });
  const fresh = [];
  NEW_NAMES.forEach(function (gn) {
    const g = makeGroup(gn);
    if (g) fresh.push(g);
  });

  // \u9632\u5446\u8BBE\u8BA1\uFF1A\u82E5\u6CA1\u6709\u53EF\u7528\u8282\u70B9\u5BFC\u81F4\u672A\u521B\u5EFA\u7B56\u7565\u7EC4\uFF0C\u76F4\u63A5\u8FD4\u56DE\u539F\u914D\u7F6E\uFF0C\u907F\u514D\u63D2\u5165\u65E0\u6548\u89C4\u5219\u62A5\u9519
  if (fresh.length === 0) return config;

  let anchor = -1;
  for (let i = 0; i < groups.length; i++) {
    if (String(groups[i].name || "").indexOf("\u8282\u70B9\u9009\u62E9") >= 0) { anchor = i; break; }
  }
  if (anchor >= 0) {
    groups.splice.apply(groups, [anchor + 1, 0].concat(fresh));
  } else {
    groups.splice.apply(groups, [0, 0].concat(fresh));
  }
  config["proxy-groups"] = groups;

  // ---------- 3. \u89C4\u5219\u524D\u63D2\uFF08\u53BB\u91CD\uFF09 ----------
  const existing = config.rules || [];
  const seen = {};
  existing.forEach(function (r) { seen[r] = true; });
  const toAdd = AI_RULES.filter(function (r) { return !seen[r]; });
  config.rules = toAdd.concat(existing);

  return config;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { main: main };
}
