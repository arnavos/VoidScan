import { Router } from "express";
import dns from "dns/promises";
import axios from "axios";
import crypto from "crypto";

const router = Router();

function extractHostname(target: string): string {
  try {
    const url = /^https?:\/\//i.test(target) ? target : `https://${target}`;
    return new URL(url).hostname;
  } catch {
    return target.trim();
  }
}

function analyzeSuspiciousUrl(url: string): { riskScore: number; riskLevel: string; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  const suspiciousKeywords = ["login", "signin", "verify", "update", "secure", "account", "banking", "paypal", "amazon", "microsoft", "apple", "google", "ebay", "netflix"];
  const suspiciousExtensions = [".exe", ".zip", ".rar", ".bat", ".cmd", ".scr", ".pif"];
  const homoglyphs = /[аеорсухіоᴀᴇɪᴏᴜ]/u;

  try {
    const parsed = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    const hostname = parsed.hostname;
    const path = parsed.pathname + parsed.search;

    if (hostname.split(".").length > 4) { score += 15; flags.push("Excessive subdomains"); }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) { score += 30; flags.push("IP address used instead of domain"); }
    if (hostname.length > 30) { score += 10; flags.push("Unusually long domain name"); }
    if (hostname.includes("-") && hostname.split("-").length > 3) { score += 10; flags.push("Multiple hyphens in domain"); }
    for (const kw of suspiciousKeywords) {
      if (hostname.toLowerCase().includes(kw)) { score += 20; flags.push(`Suspicious keyword in domain: "${kw}"`); break; }
    }
    for (const ext of suspiciousExtensions) {
      if (path.toLowerCase().endsWith(ext)) { score += 25; flags.push(`Suspicious file extension: ${ext}`); }
    }
    if (parsed.protocol === "http:") { score += 5; flags.push("Not using HTTPS"); }
    if (homoglyphs.test(hostname)) { score += 40; flags.push("Homoglyph characters detected in domain"); }
    if (path.includes("@")) { score += 20; flags.push("@ character in URL path"); }
    if (parsed.href.length > 200) { score += 10; flags.push("Unusually long URL"); }
    const queryParams = parsed.searchParams;
    if ([...queryParams.values()].some(v => v.includes("http"))) { score += 20; flags.push("URL embedded in query parameter"); }
  } catch {
    score += 30; flags.push("Malformed URL");
  }

  score = Math.min(100, score);
  const riskLevel = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : score >= 15 ? "LOW" : "CLEAN";
  return { riskScore: score, riskLevel, flags };
}

router.post("/threat/url-reputation", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const analysis = analyzeSuspiciousUrl(target);
    const sources = [
      { source: "VoidScan Heuristic Engine", verdict: analysis.riskLevel, score: analysis.riskScore },
      { source: "Pattern Analysis", verdict: analysis.flags.length > 0 ? "FLAGGED" : "CLEAN", score: analysis.riskScore },
    ];
    return res.json({
      success: true,
      target,
      score: analysis.riskScore,
      verdict: analysis.riskLevel,
      categories: analysis.flags,
      sources,
    });
  } catch (err: any) {
    return res.json({ success: false, target, error: err.message });
  }
});

router.post("/threat/ip-reputation", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    let ip = target.trim();
    const r = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,isp,org,as,proxy,hosting,query`, { timeout: 8000 });
    const d = r.data;
    const categories: string[] = [];
    let score = 0;
    if (d.proxy) { categories.push("Proxy/VPN"); score += 40; }
    if (d.hosting) { categories.push("Hosting/Datacenter"); score += 20; }
    const verdict = score >= 40 ? "SUSPICIOUS" : score >= 20 ? "CAUTION" : "CLEAN";
    return res.json({
      success: true,
      target: ip,
      score,
      verdict,
      categories,
      sources: [
        { source: "ip-api.com", isp: d.isp, org: d.org, country: d.country, proxy: d.proxy, hosting: d.hosting }
      ],
    });
  } catch (err: any) {
    return res.json({ success: false, target, error: err.message });
  }
});

router.post("/threat/domain-reputation", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const hostname = extractHostname(target);
    const analysis = analyzeSuspiciousUrl(hostname);
    let ips: string[] = [];
    try { ips = await dns.resolve4(hostname); } catch {}
    const sources = [
      { source: "DNS Resolution", resolved: ips.length > 0, ips },
      { source: "VoidScan Heuristic", verdict: analysis.riskLevel, score: analysis.riskScore },
    ];
    return res.json({
      success: true,
      target: hostname,
      score: analysis.riskScore,
      verdict: analysis.riskLevel,
      categories: analysis.flags,
      sources,
    });
  } catch (err: any) {
    return res.json({ success: false, target, error: err.message });
  }
});

router.post("/threat/phishing", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const analysis = analyzeSuspiciousUrl(target);
    const phishingIndicators = analysis.flags.filter(f =>
      f.includes("keyword") || f.includes("homoglyph") || f.includes("@") || f.includes("IP address")
    );
    const isPhishing = analysis.riskScore >= 50 || phishingIndicators.length >= 2;
    const confidence = isPhishing ? Math.min(0.95, analysis.riskScore / 100 + 0.1) : Math.max(0.05, 1 - analysis.riskScore / 100);
    return res.json({
      success: true,
      url: target,
      isPhishing,
      confidence,
      indicators: analysis.flags,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/threat/suspicious-url", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const analysis = analyzeSuspiciousUrl(target);
    let hostname = "";
    try { hostname = new URL(/^https?:\/\//i.test(target) ? target : `https://${target}`).hostname; } catch {}
    return res.json({
      success: true,
      url: target,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      flags: analysis.flags,
      details: {
        hostname,
        flagCount: analysis.flags.length,
        recommendation: analysis.riskScore >= 70 ? "Block this URL" : analysis.riskScore >= 40 ? "Proceed with caution" : "URL appears safe",
      },
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/threat/virustotal", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return res.json({
      success: false,
      target,
      requiresApiKey: true,
      error: "VirusTotal API key not configured. Set VIRUSTOTAL_API_KEY environment variable.",
    });
  }
  try {
    const urlId = Buffer.from(target).toString("base64").replace(/=/g, "");
    const r = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { "x-apikey": apiKey },
      timeout: 15000,
    });
    const stats = r.data?.data?.attributes?.last_analysis_stats || {};
    return res.json({
      success: true,
      target,
      positives: stats.malicious || 0,
      total: (stats.malicious || 0) + (stats.undetected || 0) + (stats.harmless || 0),
      scanDate: r.data?.data?.attributes?.last_analysis_date,
      permalink: `https://www.virustotal.com/gui/url/${urlId}`,
      scans: r.data?.data?.attributes?.last_analysis_results || {},
    });
  } catch (err: any) {
    return res.json({ success: false, target, error: err.message });
  }
});

router.post("/threat/abuseipdb", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) {
    return res.json({
      success: false,
      ip: target,
      requiresApiKey: true,
      error: "AbuseIPDB API key not configured. Set ABUSEIPDB_API_KEY environment variable.",
    });
  }
  try {
    const r = await axios.get("https://api.abuseipdb.com/api/v2/check", {
      params: { ipAddress: target, maxAgeInDays: 90, verbose: true },
      headers: { Key: apiKey, Accept: "application/json" },
      timeout: 10000,
    });
    const d = r.data?.data || {};
    const categoryMap: Record<number, string> = {
      3: "Fraud Orders", 4: "DDoS Attack", 5: "FTP Brute-Force",
      6: "Ping of Death", 7: "Phishing", 9: "Open Proxy",
      10: "Web Spam", 11: "Email Spam", 14: "Port Scan", 18: "Brute-Force",
      19: "Bad Web Bot", 20: "Exploited Host", 21: "Web App Attack", 22: "SSH", 23: "IoT Targeted"
    };
    const categories = [...new Set((d.reports || []).flatMap((r: any) => r.categories || []))]
      .map((c: number) => categoryMap[c] || `Category ${c}`);
    return res.json({
      success: true,
      ip: d.ipAddress,
      abuseConfidenceScore: d.abuseConfidenceScore,
      totalReports: d.totalReports,
      lastReportedAt: d.lastReportedAt,
      countryCode: d.countryCode,
      isp: d.isp,
      categories,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

let openPhishCache: Set<string> | null = null;
let openPhishCacheTime = 0;

async function getOpenPhishFeed(): Promise<Set<string>> {
  if (openPhishCache && Date.now() - openPhishCacheTime < 3600000) return openPhishCache;
  try {
    const r = await axios.get("https://openphish.com/feed.txt", { timeout: 10000 });
    const urls = String(r.data).split("\n").map(u => u.trim().toLowerCase()).filter(Boolean);
    openPhishCache = new Set(urls);
    openPhishCacheTime = Date.now();
    return openPhishCache;
  } catch {
    return new Set();
  }
}

router.post("/threat/openphish", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const feed = await getOpenPhishFeed();
    const normalizedTarget = target.trim().toLowerCase();
    const found = feed.has(normalizedTarget) ||
      [...feed].some(u => u.includes(extractHostname(normalizedTarget)));
    return res.json({
      success: true,
      data: {
        url: target,
        found,
        feedSize: feed.size,
        verdict: found ? "PHISHING URL IN OPENPHISH FEED" : "Not found in OpenPhish feed",
      },
      message: found ? "URL found in OpenPhish feed — HIGH RISK" : "URL not found in OpenPhish feed",
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/threat/breach", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const r = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(target)}?truncateResponse=false`, {
      headers: {
        "User-Agent": "VoidScan-SOC",
        "hibp-api-key": process.env.HIBP_API_KEY || "",
      },
      timeout: 10000,
      validateStatus: (s) => s === 200 || s === 404 || s === 401,
    });
    if (r.status === 401) {
      return res.json({
        success: false,
        email: target,
        error: "HIBP API key required. Set HIBP_API_KEY environment variable.",
        requiresApiKey: true,
      });
    }
    if (r.status === 404) {
      return res.json({ success: true, email: target, found: false, breaches: [], breachCount: 0 });
    }
    const breaches = r.data || [];
    return res.json({
      success: true,
      email: target,
      found: breaches.length > 0,
      breaches: breaches.slice(0, 20).map((b: any) => ({
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        date: b.BreachDate,
        pwnCount: b.PwnCount,
        dataClasses: b.DataClasses,
      })),
      breachCount: breaches.length,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

export default router;
