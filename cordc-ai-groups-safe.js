// ============================================================
// CordC / FlClash 覆写脚本（电脑 + 手机通用）
//   适用：CordC（桌面 / 手机）、FlClash（桌面 / 手机），以及任何支持 JS 覆写的 mihomo 客户端
//   不依赖任何特定组名 / 节点名，手机端组名不同也不会报 group not found
//   1. 新增 3 个策略组：🤖 OpenAI / 🧠 Claude / ✨ Gemini
//      —— 插在「节点选择」组后面；找不到该组则排在最前
//   2. 组成员只使用真实节点名 + DIRECT，不引用任何策略组
//      —— 手机端组名与桌面不同也不会再报 proxy group not found
//   3. 把 AI 域名规则插到规则列表最前面
//   4. 【本地新增】内网 / 私有地址直连规则也插到最前面
//      —— 解决内网关键字直连规则被 MATCH 兜底抢先的问题
//   5. 【本地新增】内网域名 DNS 纠偏：排除 fake-ip + 指定内网 DNS
//      —— 解决内网域名被答成 198.18.x.x 后，直连时用公网 DoH 换不出真实 IP 的问题
//   6. 【本地新增】内网域名 hosts 静态映射
//      —— 这是最可靠的一层：优先级高于 fake-ip 与所有 nameserver，且不会被客户端重载清掉
//   7. 【关键修复】DNS 段兜底 config.dns
//      —— 客户端执行脚本时 config.dns 可能尚不存在，缺兜底会让 5 与 6 的 DNS 部分被静默跳过
//
// 用法：设置 -> 高级 -> 脚本 -> 编辑 -> 全选删除 -> 粘贴本文件 -> 保存 -> 重载配置
// 恢复：删除脚本即可
// ============================================================

// ============================================================
// 【本地定制区】以后要加内网直连，只改这里
// ============================================================
// 纯 JS 运行时解码（不依赖 atob/Buffer，兼容桌面端与手机端内核）
function _d(h) {
  let s = "";
  for (let i = 0; i < h.length; i += 2) {
    s += String.fromCharCode(parseInt(h.substr(i, 2), 16) ^ 0x5a);
  }
  return s;
}

const LOCAL_DIRECT = {
  // ★ 内网域名 -> 真实 IP 的静态映射（跨平台最可靠的一项）
  //
  // 【为什么需要】内网域名在公网 DNS 上是 NXDOMAIN。代理内核直连时要用
  //   上游 DNS 把域名换成真实 IP，公网 DoH 换不出来，于是连接失败：
  //   走 TUN 表现为 ERR_EMPTY_RESPONSE，走 HTTP 代理表现为 502。
  //   注意：内核返回 198.18.x.x 这种假 IP 本身不致命，致命的是后面换不出真 IP。
  //
  // 【优先级】hosts 在内核里是最高的，凌驾于 fake-ip 与所有 nameserver，
  //   所以写进来就一定生效，也不会被客户端的 DNS 设置覆盖。
  //
  // 【换机器怎么办】IP 可能随网段变化，在本机重新解析一次即可。
  //
  // 【加新域名】在下面对象里加一行映射即可；
  //   数组/对象型字段不会被客户端重载清掉；这也是本脚本比 DNS 设置可靠的原因。
  hosts: (function () {
    const m = {};
    m[_d("232820742a352d3f28393233343b743934")] = _d("6b6a74696a746b74636b");
    m[_d("3c292939742a352d3f28393233343b743934")] = _d("6b6a746b6f62746b6a6a746b6b6b");
    m[_d("3c2929393f742a352d3f28393233343b743934")] = _d("6b6a746b63746b62746b68");
    return m;
  })(),

  // 关键字直连：只要域名里出现这些词，就走 DIRECT
  keywords: [_d("323e3f39"), _d("2a352d3f28393233343b")],

  // 精确后缀直连（比关键字更严谨，两条都留着不冲突）
  domains: [
    _d("323e3f3974393537"),
    _d("2a352d3f28393233343b74393537"),
    _d("2a352d3f28393233343b743934")
  ],

  // 微软 / Office 域名：直连 + 排除 fake-ip（防止 TUN 模式下 Word/Excel 启动卡死）
  // 单独列出，不走内网 intranetDns，仍使用默认公网 DNS 解析
  microsoftDomains: [
    "microsoft.com",
    "microsoftonline.com",
    "office.com",
    "office.net",
    "office365.com",
    "live.com",
    "onedrive.com",
    "sharepoint.com",
    "msocdn.com",
    "msftauth.net",
    "msftncsi.com",
    "msftconnecttest.com"
  ],

  // 私有网段直连：内网 IP 一律不走代理，no-resolve 避免无谓 DNS 解析
  privateCidr: [
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,100.64.0.0/10,DIRECT,no-resolve",
    "IP-CIDR,169.254.0.0/16,DIRECT,no-resolve",
    "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
    "IP-CIDR6,fe80::/10,DIRECT,no-resolve"
  ],

  // 把内网域名排除出 fake-ip，避免被解析成 198.18.x.x
  // 实测：内网域名真身是 10.x 内网地址，但被 fake-ip 答成 198.18.x.x
  // 假地址既不是私网也匹配不到任何规则，且 DIRECT 还得再解析一次 → 表现为"被拦截"
  excludeFromFakeIp: true,

  // 内网 DNS：这些域名交给内网 DNS 解析，否则公网 DoH 解不出 10.x 记录
  intranetDns: [_d("6b6d6874686b74697469"), _d("6b6d6874686b7469746e")],

  // 域名嗅探：浏览器开了 DoH 时，内核只见 IP 不见域名，DOMAIN-* 规则必然失配
  // 开启后从 TLS SNI / HTTP Host 还原域名。若客户端版本较老不支持，此段会被忽略
  enableSniffer: true
};

// 由上面的清单生成规则，顺序：关键字 -> 后缀 -> 私有网段
function buildLocalRules() {
  const out = [];
  LOCAL_DIRECT.keywords.forEach(function (k) {
    if (k) out.push("DOMAIN-KEYWORD," + String(k).toLowerCase() + ",DIRECT");
  });
  LOCAL_DIRECT.domains.forEach(function (d) {
    if (d) out.push("DOMAIN-SUFFIX," + String(d).toLowerCase() + ",DIRECT");
  });
  (LOCAL_DIRECT.microsoftDomains || []).forEach(function (d) {
    if (d) out.push("DOMAIN-SUFFIX," + String(d).toLowerCase() + ",DIRECT");
  });
  LOCAL_DIRECT.privateCidr.forEach(function (r) {
    if (r) out.push(r);
  });
  return out;
}

const AI_RULES = [
  "DOMAIN,ab.chatgpt.com,\ud83e\udd16 OpenAI",
  "DOMAIN,api.openai.com,\ud83e\udd16 OpenAI",
  "DOMAIN,auth.openai.com,\ud83e\udd16 OpenAI",
  "DOMAIN,chat.openai.com.cdn.cloudflare.net,\ud83e\udd16 OpenAI",
  "DOMAIN,chatgpt.livekit.cloud,\ud83e\udd16 OpenAI",
  "DOMAIN,o33249.ingest.sentry.io,\ud83e\udd16 OpenAI",
  "DOMAIN,o33249.ingest.us.sentry.io,\ud83e\udd16 OpenAI",
  "DOMAIN,openai-api.arkoselabs.com,\ud83e\udd16 OpenAI",
  "DOMAIN,openaiapi-site.azureedge.net,\ud83e\udd16 OpenAI",
  "DOMAIN,openaiassets.blob.core.windows.net,\ud83e\udd16 OpenAI",
  "DOMAIN,openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net,\ud83e\udd16 OpenAI",
  "DOMAIN,openaicom.imgix.net,\ud83e\udd16 OpenAI",
  "DOMAIN,openaicomproductionae4b.blob.core.windows.net,\ud83e\udd16 OpenAI",
  "DOMAIN,platform.openai.com,\ud83e\udd16 OpenAI",
  "DOMAIN,production-openaicom-storage.azureedge.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,chat.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.livekit.cloud,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,chatgpt.site,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,client-api.arkoselabs.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,crixet.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,events.statsigapi.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,featuregates.org,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,host.livekit.cloud,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,identrust.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,intercom.io,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,intercomcdn.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,launchdarkly.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,oaistatic.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,oaistatsig.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,oaiusercontent.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,observeit.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,openai.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,openai.com.cdn.cloudflare.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,openai.org,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,openaiapi-site.azureedge.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,openaicom.imgix.net,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,segment.io,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,sentry.io,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,sora.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,stripe.com,\ud83e\udd16 OpenAI",
  "DOMAIN-SUFFIX,turn.livekit.cloud,\ud83e\udd16 OpenAI",
  "DOMAIN-KEYWORD,openai,\ud83e\udd16 OpenAI",
  "DOMAIN,api.anthropic.com,\ud83e\udde0 Claude",
  "DOMAIN,console.anthropic.com,\ud83e\udde0 Claude",
  "DOMAIN,servd-anthropic-website.b-cdn.net,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,ant.dev,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,anthropic.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,anthropic.team,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,antspace.dev,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,chatbotclaude.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,clau.de,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.ai,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.app,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.dev,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.new,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claude.site,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudeacademy.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudemcpclient.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudemcpcontent.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudepages.dev,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudestudio.com,\ud83e\udde0 Claude",
  "DOMAIN-SUFFIX,claudeusercontent.com,\ud83e\udde0 Claude",
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

// 入口包一层容错：手机端内核版本可能更旧，不支持的字段会抛异常。
// 不包这一层的话，一个字段报错会让整个脚本失效（一个组都建不出来）。
function main(config) {
  try {
    return applyCordc(config);
  } catch (e) {
    if (typeof console !== "undefined" && console && typeof console.log === "function") {
      console.log("[cordc-ai-groups] error: " + (e && e.message ? e.message : e));
    }
    return config;
  }
}

function applyCordc(config) {
  // ---------- 0. 内网直连规则：永远插到整张规则表最前面 ----------
  // 关键：这些规则必须排在订阅自带的 MATCH / GEOIP 之前，否则永不命中
  const localRules = [];
  buildLocalRules().forEach(function (r) {
    if (localRules.indexOf(r) < 0) localRules.push(r);
  });
  // 先把订阅里已有的同款本地规则剔掉，再统一前插 —— 保证重复运行也只有一份
  const localSet = {};
  localRules.forEach(function (r) { localSet[r] = true; });
  const existing = (Array.isArray(config.rules) ? config.rules : []).filter(function (r) {
    return !localSet[r];
  });

  // ---------- 0.45 DNS 段兜底（关键修复 2026-11-16）----------
  // CordC 执行本脚本时，config.dns 可能尚不存在（订阅无 dns 段，patchClashConfig 稍后才合并）。
  // 缺兜底会导致下面两段 DNS 注入被 if (config.dns) 静默跳过：
  // 规则全生效、但 fake-ip-filter / nameserver-policy 一条都没进运行配置，
  // 内网域名仍被答成 198.18.x.x，DIRECT 建连时用公网 DoH 解不出 10.x -> HTTP 502。
  if (!config.dns || typeof config.dns !== "object") {
    config.dns = {};
  }

  // fake-ip 排除：防止内网域名及微软/Office 域名被劫持成 198.18.x.x
  if (LOCAL_DIRECT.excludeFromFakeIp) {
    const filter = Array.isArray(config.dns["fake-ip-filter"]) ? config.dns["fake-ip-filter"] : [];
    LOCAL_DIRECT.domains.concat(LOCAL_DIRECT.microsoftDomains || []).forEach(function (d) {
      const p = "+." + String(d).toLowerCase();
      if (filter.indexOf(p) < 0) filter.push(p);
    });
    config.dns["fake-ip-filter"] = filter;
  }

  // 内网 DNS 策略：内网域名走内网 DNS 解析
  // 不做这一步，即使规则是 DIRECT，内核也会用公网 DoH 去解，结果解不出 10.x 内网记录
  if (config.dns && LOCAL_DIRECT.intranetDns && LOCAL_DIRECT.intranetDns.length) {
    const policy = config.dns["nameserver-policy"] || {};
    LOCAL_DIRECT.domains.forEach(function (d) {
      const key = "+." + String(d).toLowerCase();
      if (!policy[key]) policy[key] = LOCAL_DIRECT.intranetDns.slice();
    });
    config.dns["nameserver-policy"] = policy;
  }

  // ---------- 0.4 内网域名静态映射（hosts）----------
  // 这是跨平台最稳定的一层：hosts 是内核查表，优先级高于 fake-IP 和所有 nameserver。
  // 前面 0.2 / 0.3 两段依赖客户端是否采纳 dns 段，实测部分版本不采纳，故必须有这一层兜底。
  if (LOCAL_DIRECT.hosts) {
    const h = (config.hosts && typeof config.hosts === "object") ? config.hosts : {};
    Object.keys(LOCAL_DIRECT.hosts).forEach(function (k) {
      h[String(k).toLowerCase()] = String(LOCAL_DIRECT.hosts[k]);
    });
    config.hosts = h;
  }

  // ---------- 0.5 域名嗅探（可选但强烈建议）----------
  // 浏览器开了「安全 DNS / DoH」时，域名在浏览器内就解析完了，
  // 内核只看到 IP、拿不到 host，所有 DOMAIN-* 规则都会失配 —— 表现就是"规则写了没生效"。
  // 开启后从 TLS SNI / HTTP Host 还原域名，DOMAIN-KEYWORD 才能命中。
  if (LOCAL_DIRECT.enableSniffer) {
    const sn = config.sniffer || {};
    sn.enable = true;
    sn["force-dns-mapping"] = true;
    sn["parse-pure-ip"] = true;
    if (typeof sn["override-destination"] === "undefined") sn["override-destination"] = false;
    sn.sniff = sn.sniff || {};
    if (!sn.sniff.TLS) sn.sniff.TLS = { ports: [443, 8443] };
    if (!sn.sniff.HTTP) sn.sniff.HTTP = { ports: [80, "8080-8880"] };
    if (!sn.sniff.QUIC) sn.sniff.QUIC = { ports: [443] };
    config.sniffer = sn;
  }

  // ---------- 1. 收集节点名（仅排除香港/港字相关节点，保留其余全部节点；不引用外部策略组） ----------
  const proxies = config.proxies || [];
  // 香港 = HK (2 chars), 港 = "Gang" (single char, matches Hu-Gang/Shen-Gang/Gang-BGP etc.)
  const HK_EXCLUDE = /\u9999\u6e2f|\u6e2f|HK|Hong\s*Kong|HGC|PCCW|WTT/i;
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

  // ---------- 2. 构造三个组：按日台新美排前，其后补全其余非港节点 ----------
  function makeGroup(groupName) {
    let members = [];
    ["\u65e5\u672c", "JP", "Japan",
     "\u53f0\u6e7e", "TW", "Taiwan",
     "\u65b0\u52a0\u5761", "SG", "Singapore",
     "\u7f8e\u56fd", "US", "United States"].forEach(function (kw) {
      pick(kw).forEach(function (n) {
        if (members.indexOf(n) < 0) members.push(n);
      });
    });
    // 其余所有非香港节点全部保留并补在后面
    names.forEach(function (n) {
      if (members.indexOf(n) < 0) members.push(n);
    });
    // 一个节点都没有 → 不建组，绝不产生无效引用
    if (members.length === 0) return null;
    if (members.indexOf("DIRECT") < 0) members.push("DIRECT");
    return { name: groupName, type: "select", proxies: members };
  }

  const NEW_NAMES = ["\u2728 Gemini", "\ud83e\udd16 OpenAI", "\ud83e\udde0 Claude"];
  // 先移除上次生成的同名组，保证每次重载成员都是最新的节点列表
  let groups = (config["proxy-groups"] || []).filter(function (g) {
    return NEW_NAMES.indexOf(g.name) < 0;
  });
  const fresh = [];
  NEW_NAMES.forEach(function (gn) {
    const g = makeGroup(gn);
    if (g) fresh.push(g);
  });

  // 防呆设计：若没有可用节点导致未创建策略组，直接返回原配置（但仍保留内网直连规则）
  if (fresh.length === 0) {
    config.rules = localRules.concat(existing);
    return config;
  }

  let anchor = -1;
  for (let i = 0; i < groups.length; i++) {
    if (String(groups[i].name || "").indexOf("\u8282\u70b9\u9009\u62e9") >= 0) { anchor = i; break; }
  }
  if (anchor >= 0) {
    groups.splice.apply(groups, [anchor + 1, 0].concat(fresh));
  } else {
    groups.splice.apply(groups, [0, 0].concat(fresh));
  }
  config["proxy-groups"] = groups;

  // ---------- 3. 规则前插（去重）----------
  // 顺序：内网直连 -> AI 域名 -> 订阅原有规则（含末尾 MATCH 兜底）
  const seen = {};
  existing.forEach(function (r) { seen[r] = true; });
  const aiAdd = AI_RULES.filter(function (r) { return !seen[r]; });

  config.rules = localRules.concat(aiAdd).concat(existing);

  if (typeof console !== "undefined" && console && typeof console.log === "function") {
    console.log("[cordc-ai-groups-safe] local=" + localRules.length +
      " ai=" + aiAdd.length + " total=" + config.rules.length);
  }

  return config;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { main: main };
}
