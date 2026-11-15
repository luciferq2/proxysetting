// ============================================================
// CordC 覆写脚本（手机 / 桌面通用版）
//   1. 新增 3 个策略组：🤖 Codex / 🧠 Claude / ✨ Gemini
//      —— 插在「节点选择」组后面；找不到该组则排在最前
//   2. 组成员只使用真实节点名 + DIRECT，不引用任何策略组
//      —— 手机端组名与桌面不同也不会再报 proxy group not found
//   3. 把 AI 域名规则插到规则列表最前面
//
// 用法：设置 -> 高级 -> 脚本 -> 编辑 -> 全选删除 -> 粘贴本文件 -> 保存 -> 重载配置
// 恢复：删除脚本即可
// ============================================================

const AI_RULES = [
  "DOMAIN,ab.chatgpt.com,🤖 Codex",
  "DOMAIN,api.openai.com,🤖 Codex",
  "DOMAIN,auth.openai.com,🤖 Codex",
  "DOMAIN,chat.openai.com.cdn.cloudflare.net,🤖 Codex",
  "DOMAIN,chatgpt.livekit.cloud,🤖 Codex",
  "DOMAIN,o33249.ingest.sentry.io,🤖 Codex",
  "DOMAIN,o33249.ingest.us.sentry.io,🤖 Codex",
  "DOMAIN,openai-api.arkoselabs.com,🤖 Codex",
  "DOMAIN,openaiapi-site.azureedge.net,🤖 Codex",
  "DOMAIN,openaiassets.blob.core.windows.net,🤖 Codex",
  "DOMAIN,openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net,🤖 Codex",
  "DOMAIN,openaicom.imgix.net,🤖 Codex",
  "DOMAIN,openaicomproductionae4b.blob.core.windows.net,🤖 Codex",
  "DOMAIN,platform.openai.com,🤖 Codex",
  "DOMAIN,production-openaicom-storage.azureedge.net,🤖 Codex",
  "DOMAIN-SUFFIX,chat.com,🤖 Codex",
  "DOMAIN-SUFFIX,chatgpt.com,🤖 Codex",
  "DOMAIN-SUFFIX,chatgpt.livekit.cloud,🤖 Codex",
  "DOMAIN-SUFFIX,chatgpt.site,🤖 Codex",
  "DOMAIN-SUFFIX,client-api.arkoselabs.com,🤖 Codex",
  "DOMAIN-SUFFIX,crixet.com,🤖 Codex",
  "DOMAIN-SUFFIX,events.statsigapi.net,🤖 Codex",
  "DOMAIN-SUFFIX,featuregates.org,🤖 Codex",
  "DOMAIN-SUFFIX,host.livekit.cloud,🤖 Codex",
  "DOMAIN-SUFFIX,identrust.com,🤖 Codex",
  "DOMAIN-SUFFIX,intercom.io,🤖 Codex",
  "DOMAIN-SUFFIX,intercomcdn.com,🤖 Codex",
  "DOMAIN-SUFFIX,launchdarkly.com,🤖 Codex",
  "DOMAIN-SUFFIX,oaistatic.com,🤖 Codex",
  "DOMAIN-SUFFIX,oaistatsig.com,🤖 Codex",
  "DOMAIN-SUFFIX,oaiusercontent.com,🤖 Codex",
  "DOMAIN-SUFFIX,observeit.net,🤖 Codex",
  "DOMAIN-SUFFIX,openai.com,🤖 Codex",
  "DOMAIN-SUFFIX,openai.com.cdn.cloudflare.net,🤖 Codex",
  "DOMAIN-SUFFIX,openai.org,🤖 Codex",
  "DOMAIN-SUFFIX,openaiapi-site.azureedge.net,🤖 Codex",
  "DOMAIN-SUFFIX,openaicom.imgix.net,🤖 Codex",
  "DOMAIN-SUFFIX,segment.io,🤖 Codex",
  "DOMAIN-SUFFIX,sentry.io,🤖 Codex",
  "DOMAIN-SUFFIX,sora.com,🤖 Codex",
  "DOMAIN-SUFFIX,stripe.com,🤖 Codex",
  "DOMAIN-SUFFIX,turn.livekit.cloud,🤖 Codex",
  "DOMAIN-KEYWORD,openai,🤖 Codex",
  "DOMAIN,api.anthropic.com,🧠 Claude",
  "DOMAIN,console.anthropic.com,🧠 Claude",
  "DOMAIN,servd-anthropic-website.b-cdn.net,🧠 Claude",
  "DOMAIN-SUFFIX,ant.dev,🧠 Claude",
  "DOMAIN-SUFFIX,anthropic.com,🧠 Claude",
  "DOMAIN-SUFFIX,anthropic.team,🧠 Claude",
  "DOMAIN-SUFFIX,antspace.dev,🧠 Claude",
  "DOMAIN-SUFFIX,chatbotclaude.com,🧠 Claude",
  "DOMAIN-SUFFIX,clau.de,🧠 Claude",
  "DOMAIN-SUFFIX,claude.ai,🧠 Claude",
  "DOMAIN-SUFFIX,claude.app,🧠 Claude",
  "DOMAIN-SUFFIX,claude.com,🧠 Claude",
  "DOMAIN-SUFFIX,claude.dev,🧠 Claude",
  "DOMAIN-SUFFIX,claude.new,🧠 Claude",
  "DOMAIN-SUFFIX,claude.site,🧠 Claude",
  "DOMAIN-SUFFIX,claudeacademy.com,🧠 Claude",
  "DOMAIN-SUFFIX,claudemcpclient.com,🧠 Claude",
  "DOMAIN-SUFFIX,claudemcpcontent.com,🧠 Claude",
  "DOMAIN-SUFFIX,claudepages.dev,🧠 Claude",
  "DOMAIN-SUFFIX,claudestudio.com,🧠 Claude",
  "DOMAIN-SUFFIX,claudeusercontent.com,🧠 Claude",
  "DOMAIN,ai.google.dev,✨ Gemini",
  "DOMAIN,aistudio.google.com,✨ Gemini",
  "DOMAIN,alkalicore-pa.clients6.google.com,✨ Gemini",
  "DOMAIN,alkalimakersuite-pa.clients6.google.com,✨ Gemini",
  "DOMAIN,antigravity-pa.googleapis.com,✨ Gemini",
  "DOMAIN,antigravity.googleapis.com,✨ Gemini",
  "DOMAIN,appsgenaiserver-pa.clients.google.com,✨ Gemini",
  "DOMAIN,appsgenaiserver-pa.clients6.google.com,✨ Gemini",
  "DOMAIN,appsgenaiserver-pa.googleapis.com,✨ Gemini",
  "DOMAIN,bard.google.com,✨ Gemini",
  "DOMAIN,cloudaicompanion.googleapis.com,✨ Gemini",
  "DOMAIN,cloudcode-pa.googleapis.com,✨ Gemini",
  "DOMAIN,daily-cloudcode-pa.googleapis.com,✨ Gemini",
  "DOMAIN,gemini.google.com,✨ Gemini",
  "DOMAIN,geminiweb-pa.clients.google.com,✨ Gemini",
  "DOMAIN,geminiweb-pa.clients6.google.com,✨ Gemini",
  "DOMAIN,jules.google.com,✨ Gemini",
  "DOMAIN,makersuite.google.com,✨ Gemini",
  "DOMAIN,notebooklm-pa.googleapis.com,✨ Gemini",
  "DOMAIN,notebooklm.google.com,✨ Gemini",
  "DOMAIN,notebooklm.googleapis.com,✨ Gemini",
  "DOMAIN,webchannel-alkalimakersuite-pa.clients6.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,ai.studio,✨ Gemini",
  "DOMAIN-SUFFIX,aicode.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,aida.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,aiplatform.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,aisandbox-pa.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,aistudio.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,antigravity-unleash.goog,✨ Gemini",
  "DOMAIN-SUFFIX,antigravity.google,✨ Gemini",
  "DOMAIN-SUFFIX,bard.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,deepmind.com,✨ Gemini",
  "DOMAIN-SUFFIX,deepmind.google,✨ Gemini",
  "DOMAIN-SUFFIX,flow.google,✨ Gemini",
  "DOMAIN-SUFFIX,flow.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,geller-pa.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,gemini.google,✨ Gemini",
  "DOMAIN-SUFFIX,gemini.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,gemini.gstatic.com,✨ Gemini",
  "DOMAIN-SUFFIX,generativeai.google,✨ Gemini",
  "DOMAIN-SUFFIX,generativelanguage.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,jules.google,✨ Gemini",
  "DOMAIN-SUFFIX,jules.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,labs.google,✨ Gemini",
  "DOMAIN-SUFFIX,labs.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,labstailwind.pa.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,makersuite.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,notebook.google,✨ Gemini",
  "DOMAIN-SUFFIX,notebook.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,notebooklm.google,✨ Gemini",
  "DOMAIN-SUFFIX,notebooklm.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,opal.google,✨ Gemini",
  "DOMAIN-SUFFIX,opal.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,proactivebackend-pa.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,robinfrontend-pa.googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,stitch.withgoogle.com,✨ Gemini",
  "DOMAIN-KEYWORD,colab,✨ Gemini",
  "DOMAIN-KEYWORD,developerprofiles,✨ Gemini",
  "DOMAIN-KEYWORD,generativelanguage,✨ Gemini",
  "DOMAIN-SUFFIX,ai.google.dev,✨ Gemini",
  "DOMAIN-SUFFIX,antigravity.google.com,✨ Gemini",
  "PROCESS-NAME,Antigravity,✨ Gemini",
  "PROCESS-NAME,Antigravity.exe,✨ Gemini",
  "PROCESS-NAME,antigravity,✨ Gemini",
  "DOMAIN,accounts.google.com,✨ Gemini",
  "DOMAIN-SUFFIX,ogs.google.com,✨ Gemini",
  "DOMAIN,clients4.google.com,✨ Gemini",
  "DOMAIN,signaler-pa.clients6.google.com,✨ Gemini",
  "DOMAIN,ssl.gstatic.com,✨ Gemini",
  "DOMAIN,www.gstatic.com,✨ Gemini",
  "DOMAIN,fonts.gstatic.com,✨ Gemini",
  "DOMAIN-SUFFIX,googleapis.com,✨ Gemini",
  "DOMAIN-SUFFIX,googleusercontent.com,✨ Gemini"
];

function main(config) {
  // ---------- 1. 收集节点名（不引用任何策略组，避免手机端组名不同导致 not found） ----------
  const proxies = config.proxies || [];
  const names = proxies.map(function (p) { return p.name || ""; }).filter(Boolean);

  function pick(kw) {
    const out = [];
    for (let i = 0; i < names.length; i++) {
      if (names[i].indexOf(kw) >= 0 && out.indexOf(names[i]) < 0) out.push(names[i]);
    }
    return out;
  }

  // ---------- 2. 构造三个组：地区节点排前，其后补全量节点 ----------
  function makeGroup(groupName) {
    let members = [];
    ["美国", "US", "United States", "日本", "JP", "Japan",
     "新加坡", "SG", "Singapore", "台湾", "TW", "Taiwan",
     "香港", "HK", "Hong Kong"].forEach(function (kw) {
      pick(kw).forEach(function (n) {
        if (members.indexOf(n) < 0) members.push(n);
      });
    });
    // 无论地区是否命中，都把剩余节点补在后面，保证任何节点都能选到
    names.forEach(function (n) {
      if (members.indexOf(n) < 0) members.push(n);
    });
    // 一个节点都没有 → 不建组，绝不产生无效引用
    if (members.length === 0) return null;
    if (members.indexOf("DIRECT") < 0) members.push("DIRECT");
    return { name: groupName, type: "select", proxies: members };
  }

  const NEW_NAMES = ["🤖 Codex", "🧠 Claude", "✨ Gemini"];
  // 先移除上次生成的同名组，保证每次重载成员都是最新的节点列表
  let groups = (config["proxy-groups"] || []).filter(function (g) {
    return NEW_NAMES.indexOf(g.name) < 0;
  });
  const fresh = [];
  NEW_NAMES.forEach(function (gn) {
    const g = makeGroup(gn);
    if (g) fresh.push(g);
  });

  if (fresh.length) {
    let anchor = -1;
    for (let i = 0; i < groups.length; i++) {
      if (String(groups[i].name || "").indexOf("节点选择") >= 0) { anchor = i; break; }
    }
    if (anchor >= 0) {
      groups.splice.apply(groups, [anchor + 1, 0].concat(fresh));
    } else {
      groups.splice.apply(groups, [0, 0].concat(fresh));
    }
  }
  config["proxy-groups"] = groups;

  // ---------- 3. 规则前插（去重） ----------
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
