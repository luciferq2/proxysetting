// ============================================================
// CordC \u8986\u5199\u811A\u672C\uFF08\u624B\u673A / \u684C\u9762\u901A\u7528\u7248\uFF09
//   1. \u65B0\u589E 3 \u4E2A\u7B56\u7565\u7EC4\uFF1A\uD83E\uDD16 OpenAI / \uD83E\uDDE0 Claude / \u2728 Gemini
//      \u2014\u2014 \u63D2\u5728\u300C\u8282\u70B9\u9009\u62E9\u300D\u7EC4\u540E\u9762\uFF1B\u627E\u4E0D\u5230\u8BE5\u7EC4\u5219\u6392\u5728\u6700\u524D
//   2. \u7EC4\u6210\u5458\u53EA\u4F7F\u7528\u771F\u5B9E\u8282\u70B9\u540D + DIRECT\uFF0C\u4E0D\u5F15\u7528\u4EFB\u4F55\u7B56\u7565\u7EC4
//      \u2014\u2014 \u624B\u673A\u7AEF\u7EC4\u540D\u4E0E\u684C\u9762\u4E0D\u540C\u4E5F\u4E0D\u4F1A\u518D\u62A5 proxy group not found
//   3. \u628A AI \u57DF\u540D\u89C4\u5219\u63D2\u5230\u89C4\u5219\u5217\u8868\u6700\u524D\u9762
//   4. \u3010\u672C\u5730\u65B0\u589E\u3011\u5185\u7F51 / \u79C1\u6709\u5730\u5740\u76F4\u8FDE\u89C4\u5219\u4E5F\u63D2\u5230\u6700\u524D\u9762
//      \u2014\u2014 \u89E3\u51B3 DOMAIN-KEYWORD,hdec,DIRECT \u88AB MATCH \u515C\u5E95\u62A2\u5148\u7684\u95EE\u9898
//   5. \u3010\u672C\u5730\u65B0\u589E\u3011\u5185\u7F51\u57DF\u540D DNS \u7EA0\u504F\uFF1A\u6392\u9664 fake-ip + \u6307\u5B9A\u516C\u53F8 DNS
//      \u2014\u2014 \u89E3\u51B3 yrz.powerchina.cn \u88AB\u7B54\u6210 198.18.x.x\uFF08\u771F\u8EAB 10.30.1.91\uFF09\u5BFC\u81F4\u76F4\u8FDE\u4E5F\u8FDE\u4E0D\u4E0A
//
// \u7528\u6CD5\uFF1A\u8BBE\u7F6E -> \u9AD8\u7EA7 -> \u811A\u672C -> \u7F16\u8F91 -> \u5168\u9009\u5220\u9664 -> \u7C98\u8D34\u672C\u6587\u4EF6 -> \u4FDD\u5B58 -> \u91CD\u8F7D\u914D\u7F6E
// \u6062\u590D\uFF1A\u5220\u9664\u811A\u672C\u5373\u53EF
// ============================================================

// ============================================================
// \u3010\u672C\u5730\u5B9A\u5236\u533A\u3011\u4EE5\u540E\u8981\u52A0\u5185\u7F51\u76F4\u8FDE\uFF0C\u53EA\u6539\u8FD9\u91CC
// ============================================================
const LOCAL_DIRECT = {
  // \u5173\u952E\u5B57\u76F4\u8FDE\uFF1A\u53EA\u8981\u57DF\u540D\u91CC\u51FA\u73B0\u8FD9\u4E9B\u8BCD\uFF0C\u5C31\u8D70 DIRECT
  keywords: ["hdec", "powerchina"],

  // \u7CBE\u786E\u540E\u7F00\u76F4\u8FDE\uFF08\u6BD4\u5173\u952E\u5B57\u66F4\u4E25\u8C28\uFF0C\u4E24\u6761\u90FD\u7559\u7740\u4E0D\u51B2\u7A81\uFF09
  domains: ["hdec.com", "powerchina.com", "powerchina.cn"],

  // \u79C1\u6709\u7F51\u6BB5\u76F4\u8FDE\uFF1A\u5185\u7F51 IP \u4E00\u5F8B\u4E0D\u8D70\u4EE3\u7406\uFF0Cno-resolve \u907F\u514D\u65E0\u8C13 DNS \u89E3\u6790
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

  // \u628A\u5185\u7F51\u57DF\u540D\u6392\u9664\u51FA fake-ip\uFF0C\u907F\u514D\u88AB\u89E3\u6790\u6210 198.18.x.x
  // \u5B9E\u6D4B\uFF1Ayrz.powerchina.cn \u771F\u8EAB\u662F\u5185\u7F51 10.30.1.91\uFF0C\u4F46\u88AB fake-ip \u7B54\u6210 198.18.0.186
  // \u5047\u5730\u5740\u65E2\u4E0D\u662F\u79C1\u7F51\u4E5F\u5339\u914D\u4E0D\u5230\u4EFB\u4F55\u89C4\u5219\uFF0C\u4E14 DIRECT \u8FD8\u5F97\u518D\u89E3\u6790\u4E00\u6B21 \u2192 \u8868\u73B0\u4E3A"\u88AB\u62E6\u622A"
  excludeFromFakeIp: true,

  // \u5185\u7F51 DNS\uFF1A\u8FD9\u4E9B\u57DF\u540D\u4EA4\u7ED9\u516C\u53F8 DNS \u89E3\u6790\uFF0C\u5426\u5219\u516C\u7F51 DoH \u89E3\u4E0D\u51FA 10.x \u8BB0\u5F55
  // \u5B9E\u6D4B\u672C\u673A\u53EF\u7528\uFF1A172.21.3.3 / 172.21.3.4\uFF08TCP 53 \u88AB\u5899\uFF0CUDP 53 \u6B63\u5E38\uFF09
  intranetDns: ["172.21.3.3", "172.21.3.4"],

  // \u57DF\u540D\u55C5\u63A2\uFF1A\u6D4F\u89C8\u5668\u5F00\u4E86 DoH \u65F6\uFF0C\u5185\u6838\u53EA\u89C1 IP \u4E0D\u89C1\u57DF\u540D\uFF0CDOMAIN-* \u89C4\u5219\u5FC5\u7136\u5931\u914D
  // \u5F00\u542F\u540E\u4ECE TLS SNI / HTTP Host \u8FD8\u539F\u57DF\u540D\u3002\u82E5\u5BA2\u6237\u7AEF\u7248\u672C\u8F83\u8001\u4E0D\u652F\u6301\uFF0C\u6B64\u6BB5\u4F1A\u88AB\u5FFD\u7565
  enableSniffer: true
};

// \u7531\u4E0A\u9762\u7684\u6E05\u5355\u751F\u6210\u89C4\u5219\uFF0C\u987A\u5E8F\uFF1A\u5173\u952E\u5B57 -> \u540E\u7F00 -> \u79C1\u6709\u7F51\u6BB5
function buildLocalRules() {
  const out = [];
  LOCAL_DIRECT.keywords.forEach(function (k) {
    if (k) out.push("DOMAIN-KEYWORD," + String(k).toLowerCase() + ",DIRECT");
  });
  LOCAL_DIRECT.domains.forEach(function (d) {
    if (d) out.push("DOMAIN-SUFFIX," + String(d).toLowerCase() + ",DIRECT");
  });
  LOCAL_DIRECT.privateCidr.forEach(function (r) {
    if (r) out.push(r);
  });
  return out;
}

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
  // ---------- 0. \u5185\u7F51\u76F4\u8FDE\u89C4\u5219\uFF1A\u6C38\u8FDC\u63D2\u5230\u6574\u5F20\u89C4\u5219\u8868\u6700\u524D\u9762 ----------
  // \u5173\u952E\uFF1A\u8FD9\u4E9B\u89C4\u5219\u5FC5\u987B\u6392\u5728\u8BA2\u9605\u81EA\u5E26\u7684 MATCH / GEOIP \u4E4B\u524D\uFF0C\u5426\u5219\u6C38\u4E0D\u547D\u4E2D
  const localRules = [];
  buildLocalRules().forEach(function (r) {
    if (localRules.indexOf(r) < 0) localRules.push(r);
  });
  // \u5148\u628A\u8BA2\u9605\u91CC\u5DF2\u6709\u7684\u540C\u6B3E\u672C\u5730\u89C4\u5219\u5254\u6389\uFF0C\u518D\u7EDF\u4E00\u524D\u63D2 \u2014\u2014 \u4FDD\u8BC1\u91CD\u590D\u8FD0\u884C\u4E5F\u53EA\u6709\u4E00\u4EFD
  const localSet = {};
  localRules.forEach(function (r) { localSet[r] = true; });
  const existing = (Array.isArray(config.rules) ? config.rules : []).filter(function (r) {
    return !localSet[r];
  });

  // fake-ip \u6392\u9664\uFF1A\u9632\u6B62\u5185\u7F51\u57DF\u540D\u88AB\u52AB\u6301\u6210 198.18.x.x\uFF08\u8D70 IP \u89C4\u5219\u65F6\u4F1A\u5BFC\u81F4\u76F4\u8FDE\u5931\u6548\uFF09
  if (LOCAL_DIRECT.excludeFromFakeIp && config.dns) {
    const filter = Array.isArray(config.dns["fake-ip-filter"]) ? config.dns["fake-ip-filter"] : [];
    LOCAL_DIRECT.domains.forEach(function (d) {
      const p = "+." + String(d).toLowerCase();
      if (filter.indexOf(p) < 0) filter.push(p);
    });
    config.dns["fake-ip-filter"] = filter;
  }

  // \u5185\u7F51 DNS \u7B56\u7565\uFF1A*.powerchina.cn / *.hdec.com \u8D70\u516C\u53F8 DNS \u89E3\u6790
  // \u4E0D\u505A\u8FD9\u4E00\u6B65\uFF0C\u5373\u4F7F\u89C4\u5219\u662F DIRECT\uFF0C\u5185\u6838\u4E5F\u4F1A\u7528\u516C\u7F51 DoH \u53BB\u89E3\uFF0C\u7ED3\u679C\u89E3\u4E0D\u51FA 10.x \u5185\u7F51\u8BB0\u5F55
  if (config.dns && LOCAL_DIRECT.intranetDns && LOCAL_DIRECT.intranetDns.length) {
    const policy = config.dns["nameserver-policy"] || {};
    LOCAL_DIRECT.domains.forEach(function (d) {
      const key = "+." + String(d).toLowerCase();
      if (!policy[key]) policy[key] = LOCAL_DIRECT.intranetDns.slice();
    });
    config.dns["nameserver-policy"] = policy;
  }

  // ---------- 0.5 \u57DF\u540D\u55C5\u63A2\uFF08\u53EF\u9009\u4F46\u5F3A\u70C8\u5EFA\u8BAE\uFF09----------
  // \u6D4F\u89C8\u5668\u5F00\u4E86\u300C\u5B89\u5168 DNS / DoH\u300D\u65F6\uFF0C\u57DF\u540D\u5728\u6D4F\u89C8\u5668\u5185\u5C31\u89E3\u6790\u5B8C\u4E86\uFF0C
  // \u5185\u6838\u53EA\u770B\u5230 IP\u3001\u62FF\u4E0D\u5230 host\uFF0C\u6240\u6709 DOMAIN-* \u89C4\u5219\u90FD\u4F1A\u5931\u914D \u2014\u2014 \u8868\u73B0\u5C31\u662F"\u89C4\u5219\u5199\u4E86\u6CA1\u751F\u6548"\u3002
  // \u5F00\u542F\u540E\u4ECE TLS SNI / HTTP Host \u8FD8\u539F\u57DF\u540D\uFF0CDOMAIN-KEYWORD \u624D\u80FD\u547D\u4E2D\u3002
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

  // \u9632\u5446\u8BBE\u8BA1\uFF1A\u82E5\u6CA1\u6709\u53EF\u7528\u8282\u70B9\u5BFC\u81F4\u672A\u521B\u5EFA\u7B56\u7565\u7EC4\uFF0C\u76F4\u63A5\u8FD4\u56DE\u539F\u914D\u7F6E\uFF08\u4F46\u4ECD\u4FDD\u7559\u5185\u7F51\u76F4\u8FDE\u89C4\u5219\uFF09
  if (fresh.length === 0) {
    config.rules = localRules.concat(existing);
    return config;
  }

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

  // ---------- 3. \u89C4\u5219\u524D\u63D2\uFF08\u53BB\u91CD\uFF09----------
  // \u987A\u5E8F\uFF1A\u5185\u7F51\u76F4\u8FDE -> AI \u57DF\u540D -> \u8BA2\u9605\u539F\u6709\u89C4\u5219\uFF08\u542B\u672B\u5C3E MATCH \u515C\u5E95\uFF09
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
