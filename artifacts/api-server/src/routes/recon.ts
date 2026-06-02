import { Router } from "express";
import dns from "dns/promises";
import tls from "tls";
import net from "net";
import { URL } from "url";
import axios from "axios";

const router = Router();

function ensureUrl(target: string): string {
  if (!/^https?:\/\//i.test(target)) return `https://${target}`;
  return target;
}

function extractHostname(target: string): string {
  try {
    return new URL(ensureUrl(target)).hostname;
  } catch {
    return target.trim();
  }
}

function rawWhois(domain: string, server: string, port = 43): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let data = "";
    socket.setTimeout(10000);
    socket.connect(port, server, () => socket.write(`${domain}\r\n`));
    socket.on("data", (chunk) => (data += chunk.toString()));
    socket.on("end", () => resolve(data));
    socket.on("timeout", () => { socket.destroy(); reject(new Error("WHOIS timeout")); });
    socket.on("error", reject);
  });
}

function parseWhoisField(raw: string, ...keys: string[]): string | null {
  for (const key of keys) {
    const m = raw.match(new RegExp(`^\\s*${key}\\s*:\\s*(.+)`, "mi"));
    if (m) return m[1].trim();
  }
  return null;
}

function parseWhoisList(raw: string, ...keys: string[]): string[] {
  const results: string[] = [];
  for (const key of keys) {
    const regex = new RegExp(`^\\s*${key}\\s*:\\s*(.+)`, "gmi");
    let m;
    while ((m = regex.exec(raw)) !== null) results.push(m[1].trim());
  }
  return [...new Set(results)];
}

const TLD_WHOIS: Record<string, string> = {
  com: "whois.verisign-grs.com", net: "whois.verisign-grs.com", org: "whois.pir.org",
  io: "whois.nic.io", co: "whois.nic.co", ai: "whois.nic.ai",
  uk: "whois.nic.uk", de: "whois.denic.de", fr: "whois.afnic.fr",
  nl: "whois.domain-registry.nl", ru: "whois.tcinet.ru", jp: "whois.jprs.jp",
  au: "whois.auda.org.au", ca: "whois.cira.ca", br: "whois.registro.br",
  in: "whois.registry.in", cn: "whois.cnnic.cn", eu: "whois.eu",
  me: "whois.nic.me", app: "whois.nic.google", dev: "whois.nic.google",
};

router.post("/recon/whois", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const hostname = extractHostname(target);
    const tld = hostname.split(".").pop()?.toLowerCase() || "com";
    const whoisServer = TLD_WHOIS[tld] || "whois.iana.org";
    let raw = await rawWhois(hostname, whoisServer);
    if (raw.toLowerCase().includes("whois:") && whoisServer === "whois.iana.org") {
      const referral = parseWhoisField(raw, "whois");
      if (referral) raw = await rawWhois(hostname, referral).catch(() => raw);
    }
    const nameservers = parseWhoisList(raw, "Name Server", "Nameserver", "nserver");
    const status = parseWhoisList(raw, "Domain Status", "Status", "status");
    return res.json({
      success: true,
      target: hostname,
      raw,
      registrar: parseWhoisField(raw, "Registrar", "registrar", "Registrar Name"),
      createdDate: parseWhoisField(raw, "Creation Date", "Created On", "created", "Registered"),
      expiresDate: parseWhoisField(raw, "Registry Expiry Date", "Expiration Date", "Expiry Date", "expires"),
      updatedDate: parseWhoisField(raw, "Updated Date", "Last Updated", "changed"),
      nameservers,
      status,
    });
  } catch (err: any) {
    return res.json({ success: false, target, error: err.message });
  }
});

router.post("/recon/dns", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const hostname = extractHostname(target);
  const records: Record<string, any> = {};
  try {
    records.A = await dns.resolve4(hostname).catch(() => []);
    records.AAAA = await dns.resolve6(hostname).catch(() => []);
    records.MX = await dns.resolveMx(hostname).catch(() => []);
    records.NS = await dns.resolveNs(hostname).catch(() => []);
    records.TXT = await dns.resolveTxt(hostname).catch(() => []);
    records.CNAME = await dns.resolveCname(hostname).catch(() => []);
    records.SOA = await dns.resolveSoa(hostname).catch(() => null);
    return res.json({ success: true, target: hostname, records });
  } catch (err: any) {
    return res.json({ success: false, target: hostname, records, error: err.message });
  }
});

router.post("/recon/reverse-dns", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    const ip = target.trim();
    const hostnames = await dns.reverse(ip);
    return res.json({ success: true, data: { ip, hostnames }, message: `Found ${hostnames.length} hostname(s)` });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/recon/subdomains", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const hostname = extractHostname(target);
  const commonSubs = [
    "www", "mail", "ftp", "smtp", "pop", "imap", "webmail", "admin", "portal",
    "api", "dev", "staging", "test", "beta", "app", "mobile", "shop", "blog",
    "cdn", "static", "assets", "media", "img", "images", "files", "docs",
    "help", "support", "status", "monitor", "dashboard", "vpn", "remote",
    "autodiscover", "autoconfig", "ns1", "ns2", "mx", "mx1", "mx2",
    "smtp", "email", "m", "cpanel", "whm", "webdisk", "ftp"
  ];

  try {
    const crtRes = await axios.get(`https://crt.sh/?q=%.${hostname}&output=json`, {
      timeout: 10000,
      headers: { "Accept": "application/json" }
    });
    const ctSubs: Set<string> = new Set();
    if (Array.isArray(crtRes.data)) {
      for (const entry of crtRes.data) {
        const names: string[] = (entry.name_value || "").split("\n");
        for (const name of names) {
          const clean = name.replace(/\*\./g, "").trim().toLowerCase();
          if (clean.endsWith(hostname) && clean !== hostname) ctSubs.add(clean);
        }
      }
    }
    const results: Array<{ subdomain: string; resolved: boolean; ip?: string }> = [];
    for (const sub of ctSubs) {
      let ip: string | undefined;
      try {
        const addrs = await dns.resolve4(sub);
        ip = addrs[0];
        results.push({ subdomain: sub, resolved: true, ip });
      } catch {
        results.push({ subdomain: sub, resolved: false });
      }
    }
    for (const prefix of commonSubs) {
      const sub = `${prefix}.${hostname}`;
      if (!ctSubs.has(sub)) {
        try {
          const addrs = await dns.resolve4(sub);
          results.push({ subdomain: sub, resolved: true, ip: addrs[0] });
        } catch {
          // not found
        }
      }
    }
    return res.json({ success: true, target: hostname, subdomains: results, count: results.length });
  } catch (err: any) {
    return res.json({ success: false, target: hostname, subdomains: [], count: 0, error: err.message });
  }
});

router.post("/recon/asn", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    let ip = target.trim();
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && !ip.includes(":")) {
      const addrs = await dns.resolve4(extractHostname(ip));
      ip = addrs[0];
    }
    const r = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,query`, { timeout: 8000 });
    const d = r.data;
    return res.json({
      success: d.status === "success",
      ip: d.query,
      asn: d.as,
      org: d.asname || d.org,
      isp: d.isp,
      country: d.country,
      error: d.status !== "success" ? d.message : null,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/recon/geoip", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  try {
    let ip = target.trim();
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && !ip.includes(":")) {
      const addrs = await dns.resolve4(extractHostname(ip));
      ip = addrs[0];
    }
    const r = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, { timeout: 8000 });
    const d = r.data;
    return res.json({
      success: d.status === "success",
      ip: d.query,
      country: d.country,
      countryCode: d.countryCode,
      region: d.regionName,
      city: d.city,
      lat: d.lat,
      lon: d.lon,
      isp: d.isp,
      org: d.org,
      timezone: d.timezone,
      error: d.status !== "success" ? d.message : null,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/recon/ssl", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const hostname = extractHostname(target);
  try {
    const cert = await new Promise<any>((resolve, reject) => {
      const socket = tls.connect({ host: hostname, port: 443, servername: hostname, rejectUnauthorized: false, timeout: 10000 }, () => {
        const c = socket.getPeerCertificate(true);
        socket.end();
        resolve(c);
      });
      socket.on("error", reject);
      socket.on("timeout", () => reject(new Error("Connection timeout")));
    });
    if (!cert || !cert.subject) return res.json({ success: false, host: hostname, error: "No certificate found" });
    const now = new Date();
    const validTo = new Date(cert.valid_to);
    const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const altNames = cert.subjectaltname
      ? cert.subjectaltname.split(", ").map((s: string) => s.replace(/^DNS:/, ""))
      : [];
    return res.json({
      success: true,
      host: hostname,
      subject: cert.subject,
      issuer: cert.issuer,
      validFrom: cert.valid_from,
      validTo: cert.valid_to,
      daysRemaining,
      isExpired: daysRemaining < 0,
      protocol: (cert as any).protocol || "TLS",
      serialNumber: cert.serialNumber,
      fingerprint: cert.fingerprint,
      subjectAltNames: altNames,
    });
  } catch (err: any) {
    return res.json({ success: false, host: hostname, error: err.message });
  }
});

router.post("/recon/headers", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const url = ensureUrl(target);
  const securityHeaders = [
    "strict-transport-security", "content-security-policy", "x-frame-options",
    "x-content-type-options", "x-xss-protection", "referrer-policy",
    "permissions-policy", "cross-origin-opener-policy", "cross-origin-resource-policy"
  ];
  try {
    const r = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: { "User-Agent": "VoidScan/1.0 Security Scanner" }
    });
    const headers = r.headers as Record<string, string>;
    const secPresent: Record<string, string> = {};
    const secMissing: string[] = [];
    for (const h of securityHeaders) {
      if (headers[h]) secPresent[h] = headers[h];
      else secMissing.push(h);
    }
    return res.json({
      success: true,
      url,
      statusCode: r.status,
      headers,
      securityHeaders: secPresent,
      missingSecurityHeaders: secMissing,
    });
  } catch (err: any) {
    return res.json({ success: false, url, error: err.message });
  }
});

router.post("/recon/tech-detect", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const url = ensureUrl(target);
  try {
    const r = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: { "User-Agent": "Mozilla/5.0 VoidScan/1.0" }
    });
    const headers = r.headers as Record<string, string>;
    const body = typeof r.data === "string" ? r.data : JSON.stringify(r.data);
    const techs: Array<{ name: string; category: string; evidence: string }> = [];

    const patterns: Array<{ name: string; category: string; patterns: Array<{ type: "header" | "body"; key?: string; regex: string }> }> = [
      { name: "WordPress", category: "CMS", patterns: [{ type: "body", regex: "/wp-content/|wp-includes|WordPress" }] },
      { name: "Drupal", category: "CMS", patterns: [{ type: "body", regex: "Drupal|drupal.org" }] },
      { name: "Joomla", category: "CMS", patterns: [{ type: "body", regex: "/components/com_|Joomla" }] },
      { name: "Shopify", category: "E-commerce", patterns: [{ type: "body", regex: "Shopify|shopify.com|cdn.shopify.com" }] },
      { name: "WooCommerce", category: "E-commerce", patterns: [{ type: "body", regex: "woocommerce|WooCommerce" }] },
      { name: "React", category: "JavaScript Framework", patterns: [{ type: "body", regex: "__react|react\\.development|react\\.production|data-reactroot" }] },
      { name: "Vue.js", category: "JavaScript Framework", patterns: [{ type: "body", regex: "vue\\.js|Vue\\.js|__vue_" }] },
      { name: "Angular", category: "JavaScript Framework", patterns: [{ type: "body", regex: "ng-version|angular\\.js|AngularJS" }] },
      { name: "Next.js", category: "JavaScript Framework", patterns: [{ type: "body", regex: "__NEXT_DATA__|next\\.js" }] },
      { name: "Nuxt.js", category: "JavaScript Framework", patterns: [{ type: "body", regex: "__nuxt|nuxtjs" }] },
      { name: "jQuery", category: "JavaScript Library", patterns: [{ type: "body", regex: "jquery\\.min\\.js|jQuery v" }] },
      { name: "Bootstrap", category: "CSS Framework", patterns: [{ type: "body", regex: "bootstrap\\.min\\.css|bootstrap\\.min\\.js" }] },
      { name: "Tailwind CSS", category: "CSS Framework", patterns: [{ type: "body", regex: "tailwindcss|tailwind\\.css" }] },
      { name: "Nginx", category: "Web Server", patterns: [{ type: "header", key: "server", regex: "nginx" }] },
      { name: "Apache", category: "Web Server", patterns: [{ type: "header", key: "server", regex: "Apache" }] },
      { name: "Cloudflare", category: "CDN/Security", patterns: [{ type: "header", key: "server", regex: "cloudflare" }, { type: "header", key: "cf-ray", regex: "." }] },
      { name: "AWS CloudFront", category: "CDN", patterns: [{ type: "header", key: "via", regex: "CloudFront" }] },
      { name: "PHP", category: "Backend Language", patterns: [{ type: "header", key: "x-powered-by", regex: "PHP" }] },
      { name: "ASP.NET", category: "Backend Framework", patterns: [{ type: "header", key: "x-aspnet-version", regex: "." }, { type: "body", regex: "__VIEWSTATE|__EVENTVALIDATION" }] },
      { name: "Google Analytics", category: "Analytics", patterns: [{ type: "body", regex: "google-analytics\\.com|gtag\\.js|_ga\\b" }] },
      { name: "Google Tag Manager", category: "Analytics", patterns: [{ type: "body", regex: "googletagmanager\\.com" }] },
    ];

    for (const tech of patterns) {
      for (const p of tech.patterns) {
        const regex = new RegExp(p.regex, "i");
        if (p.type === "header" && p.key) {
          const val = headers[p.key] || "";
          if (regex.test(val)) {
            if (!techs.find(t => t.name === tech.name)) {
              techs.push({ name: tech.name, category: tech.category, evidence: `${p.key}: ${val.substring(0, 100)}` });
            }
          }
        } else if (p.type === "body") {
          if (regex.test(body)) {
            if (!techs.find(t => t.name === tech.name)) {
              techs.push({ name: tech.name, category: tech.category, evidence: `Detected in page source` });
            }
          }
        }
      }
    }

    return res.json({ success: true, url, technologies: techs });
  } catch (err: any) {
    return res.json({ success: false, url, error: err.message });
  }
});

router.post("/recon/screenshot", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "target required" });
  const url = ensureUrl(target);
  try {
    const screenshotUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&full_page=false&viewport_width=1280&viewport_height=800&format=jpg`;
    const fallbackUrl = `https://image.thum.io/get/width/1280/crop/800/${encodeURIComponent(url)}`;
    return res.json({
      success: true,
      url,
      screenshotUrl: fallbackUrl,
    });
  } catch (err: any) {
    return res.json({ success: false, url, error: err.message });
  }
});

export default router;
