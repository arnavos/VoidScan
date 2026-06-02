import { Router } from "express";
import crypto from "crypto";
import path from "path";
import axios from "axios";

const router = Router();

const FILE_SIGNATURES: Array<{ magic: string; type: string; description: string }> = [
  { magic: "89504e47", type: "image/png", description: "PNG Image" },
  { magic: "ffd8ffe0", type: "image/jpeg", description: "JPEG Image" },
  { magic: "ffd8ffe1", type: "image/jpeg", description: "JPEG Image (EXIF)" },
  { magic: "47494638", type: "image/gif", description: "GIF Image" },
  { magic: "25504446", type: "application/pdf", description: "PDF Document" },
  { magic: "504b0304", type: "application/zip", description: "ZIP Archive" },
  { magic: "504b0506", type: "application/zip", description: "ZIP Archive (empty)" },
  { magic: "1f8b0800", type: "application/gzip", description: "Gzip Archive" },
  { magic: "4d5a", type: "application/x-msdownload", description: "Windows Executable (PE)" },
  { magic: "7f454c46", type: "application/x-elf", description: "Linux Executable (ELF)" },
  { magic: "cafebabe", type: "application/java-archive", description: "Java Class/JAR" },
  { magic: "d0cf11e0", type: "application/msword", description: "Microsoft Office Document" },
  { magic: "52617221", type: "application/x-rar-compressed", description: "RAR Archive" },
  { magic: "377abcaf", type: "application/x-7z-compressed", description: "7-Zip Archive" },
  { magic: "425a6839", type: "application/x-bzip2", description: "Bzip2 Archive" },
  { magic: "1a45dfa3", type: "video/webm", description: "WebM Video" },
  { magic: "00000020", type: "video/mp4", description: "MP4 Video" },
  { magic: "49492a00", type: "image/tiff", description: "TIFF Image (LE)" },
  { magic: "4d4d002a", type: "image/tiff", description: "TIFF Image (BE)" },
  { magic: "664c6143", type: "audio/flac", description: "FLAC Audio" },
  { magic: "4f676753", type: "audio/ogg", description: "OGG Audio" },
  { magic: "fffb", type: "audio/mpeg", description: "MP3 Audio" },
  { magic: "57415645", type: "audio/wav", description: "WAV Audio" },
  { magic: "3c3f786d6c", type: "text/xml", description: "XML Document" },
  { magic: "3c21444f4354595045", type: "text/html", description: "HTML Document" },
  { magic: "7b", type: "application/json", description: "JSON Document" },
  { magic: "23212f", type: "text/x-script", description: "Shell Script" },
];

function computeEntropy(buffer: Buffer): number {
  const freq = new Array(256).fill(0);
  for (const byte of buffer) freq[byte]++;
  let entropy = 0;
  for (const f of freq) {
    if (f > 0) {
      const p = f / buffer.length;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

function interpretEntropy(entropy: number): { interpretation: string; isSuspicious: boolean } {
  if (entropy > 7.5) return { interpretation: "Very high entropy — likely encrypted, compressed, or packed content. Common in malware.", isSuspicious: true };
  if (entropy > 6.5) return { interpretation: "High entropy — could be compressed data, encrypted sections, or binary content.", isSuspicious: false };
  if (entropy > 5.0) return { interpretation: "Moderate entropy — typical for executables and mixed binary/text files.", isSuspicious: false };
  if (entropy > 3.5) return { interpretation: "Low-moderate entropy — typical for source code or text files.", isSuspicious: false };
  return { interpretation: "Low entropy — highly structured or repetitive content (text, configs).", isSuspicious: false };
}

router.post("/file/hash", async (req, res) => {
  const { filename, data } = req.body as { filename: string; data: string };
  if (!data) return res.status(400).json({ success: false, error: "file data required" });
  try {
    const buffer = Buffer.from(data, "base64");
    const md5 = crypto.createHash("md5").update(buffer).digest("hex");
    const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const sha512 = crypto.createHash("sha512").update(buffer).digest("hex");
    return res.json({ success: true, filename, md5, sha1, sha256, sha512, size: buffer.length });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/file/hash-compare", async (req, res) => {
  const { hash1, hash2 } = req.body as { hash1: string; hash2: string };
  if (!hash1 || !hash2) return res.status(400).json({ success: false, error: "both hashes required" });
  const match = hash1.trim().toLowerCase() === hash2.trim().toLowerCase();
  return res.json({
    success: true,
    data: { hash1: hash1.trim(), hash2: hash2.trim(), match },
    message: match ? "Hashes MATCH — files are identical" : "Hashes DO NOT MATCH — files differ",
  });
});

router.post("/file/metadata", async (req, res) => {
  const { filename, data, mimeType } = req.body as { filename: string; data: string; mimeType?: string };
  if (!data) return res.status(400).json({ success: false, error: "file data required" });
  try {
    const buffer = Buffer.from(data, "base64");
    const ext = path.extname(filename || "").toLowerCase();
    const magicHex = buffer.slice(0, 8).toString("hex").toLowerCase();
    let detectedType = mimeType || "application/octet-stream";
    let detectedDesc = "";
    for (const sig of FILE_SIGNATURES) {
      if (magicHex.startsWith(sig.magic.toLowerCase())) {
        detectedType = sig.type;
        detectedDesc = sig.description;
        break;
      }
    }
    const isText = detectedType.startsWith("text/") || buffer.slice(0, 512).every(b => b === 9 || b === 10 || b === 13 || (b >= 32 && b < 127));
    return res.json({
      success: true,
      filename,
      size: buffer.length,
      mimeType: detectedType,
      extension: ext || "none",
      magicBytes: magicHex.slice(0, 16).toUpperCase(),
      encoding: isText ? "UTF-8/ASCII Text" : "Binary",
      description: detectedDesc,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/file/entropy", async (req, res) => {
  const { filename, data } = req.body as { filename: string; data: string };
  if (!data) return res.status(400).json({ success: false, error: "file data required" });
  try {
    const buffer = Buffer.from(data, "base64");
    const entropy = computeEntropy(buffer);
    const { interpretation, isSuspicious } = interpretEntropy(entropy);
    const freq: Record<number, number> = {};
    for (const byte of buffer) {
      freq[byte] = (freq[byte] || 0) + 1;
    }
    const topBytes = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc: Record<string, number>, [k, v]) => {
        acc[`0x${parseInt(k).toString(16).padStart(2, "0").toUpperCase()}`] = v;
        return acc;
      }, {});
    return res.json({
      success: true,
      filename,
      entropy: Math.round(entropy * 1000) / 1000,
      interpretation,
      isSuspicious,
      byteDistribution: { topBytes, totalUniqueBytes: Object.keys(freq).length, fileSize: buffer.length },
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/file/malware-hash", async (req, res) => {
  const { target } = req.body as { target: string };
  if (!target) return res.status(400).json({ success: false, error: "hash required" });
  try {
    const hash = target.trim().toLowerCase();
    const r = await axios.get(`https://mb-api.abuse.ch/api/v1/`, {
      method: "post",
      data: `query=get_info&hash=${hash}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000,
    }).catch(() => null);
    if (r?.data?.query_status === "ok" && r.data.data?.[0]) {
      const sample = r.data.data[0];
      return res.json({
        success: true,
        hash,
        found: true,
        malwareName: sample.signature || sample.tags?.join(", "),
        malwareType: sample.file_type,
        sources: ["MalwareBazaar (abuse.ch)"],
      });
    }
    return res.json({ success: true, hash, found: false, sources: ["MalwareBazaar (abuse.ch)"] });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/file/yara", async (req, res) => {
  const { data, rule } = req.body as { data: string; rule: string };
  if (!data || !rule) return res.status(400).json({ success: false, error: "data and rule required" });
  try {
    const buffer = Buffer.from(data, "base64").toString("hex").toLowerCase();
    const text = Buffer.from(data, "base64").toString("utf8").toLowerCase();
    const matchedRules: string[] = [];
    const ruleNameMatch = rule.match(/rule\s+(\w+)/g) || [];
    const ruleNames = ruleNameMatch.map(r => r.replace(/^rule\s+/, "").trim());
    const stringsMatch = rule.matchAll(/\$\w+\s*=\s*(?:"([^"]+)"|'([^']+)'|{([^}]+)})/g);
    let allStringsMatch = true;
    const checkedStrings: string[] = [];
    for (const m of stringsMatch) {
      const strVal = m[1] || m[2];
      const hexVal = m[3];
      if (strVal) {
        const found = text.includes(strVal.toLowerCase());
        checkedStrings.push(`"${strVal}": ${found ? "FOUND" : "NOT FOUND"}`);
        if (!found) allStringsMatch = false;
      } else if (hexVal) {
        const hexPattern = hexVal.replace(/\s/g, "").toLowerCase();
        const found = buffer.includes(hexPattern);
        checkedStrings.push(`{${hexVal.trim()}}: ${found ? "FOUND" : "NOT FOUND"}`);
        if (!found) allStringsMatch = false;
      }
    }
    const matched = checkedStrings.length > 0 && allStringsMatch;
    return res.json({
      success: true,
      matched,
      matchedRules: matched ? ruleNames : [],
      details: checkedStrings,
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/file/signature", async (req, res) => {
  const { filename, data } = req.body as { filename: string; data: string };
  if (!data) return res.status(400).json({ success: false, error: "file data required" });
  try {
    const buffer = Buffer.from(data, "base64");
    const magicHex = buffer.slice(0, 12).toString("hex").toLowerCase();
    let detected: typeof FILE_SIGNATURES[0] | null = null;
    for (const sig of FILE_SIGNATURES) {
      if (magicHex.startsWith(sig.magic.toLowerCase())) {
        detected = sig;
        break;
      }
    }
    const ext = path.extname(filename || "").toLowerCase().replace(".", "");
    const mimeExtMap: Record<string, string[]> = {
      "image/png": ["png"], "image/jpeg": ["jpg", "jpeg"], "image/gif": ["gif"],
      "application/pdf": ["pdf"], "application/zip": ["zip"],
      "application/x-msdownload": ["exe", "dll", "sys", "ocx"],
      "application/x-elf": ["elf", "so", ""],
      "text/html": ["html", "htm"], "application/json": ["json"],
    };
    const expectedExts = detected ? (mimeExtMap[detected.type] || []) : [];
    const isValid = detected !== null && (expectedExts.length === 0 || expectedExts.includes(ext) || !ext);
    const details = detected
      ? `Magic bytes ${magicHex.slice(0, 16).toUpperCase()} match ${detected.description}`
      : "Unknown file type — no matching magic bytes found";
    return res.json({
      success: true,
      filename,
      detectedType: detected?.type || "unknown",
      magicBytes: magicHex.slice(0, 16).toUpperCase(),
      isValid,
      details,
      description: detected?.description || "Unknown",
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

export default router;
