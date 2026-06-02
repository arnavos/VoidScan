import { Router } from "express";
import crypto from "crypto";
import https from "https";

const router = Router();

const WORDLIST = [
  "apple", "brave", "cliff", "dance", "eagle", "flame", "grape", "honey",
  "igloo", "joker", "knife", "lemon", "mango", "night", "ocean", "peace",
  "queen", "river", "storm", "tiger", "ultra", "vivid", "watch", "xenon",
  "yacht", "zebra", "amber", "blaze", "crisp", "delta", "elder", "frost",
  "glade", "haven", "ivory", "jazzy", "karma", "lunar", "maple", "noble",
  "orbit", "pixel", "quark", "radar", "solar", "toxic", "unity", "vapor",
  "width", "xenon", "yield", "zonal", "blade", "chain", "drift", "ember",
  "fjord", "ghost", "hydra", "index", "joust", "krypt", "laser", "marsh",
  "nexus", "ozone", "prism", "query", "realm", "sigma", "talon", "ultra",
  "virus", "wraith", "xenon", "yield", "zones", "alpha", "bravo", "cyber",
  "delta", "echo", "foxtrot", "gamma", "hotel", "india", "juliet", "kilo",
  "lima", "mike", "november", "oscar", "papa", "quebec", "romeo", "sierra",
  "tango", "uniform", "victor", "whiskey", "xray", "yankee", "zulu"
];

function analyzePassword(password: string): {
  score: number; strength: string; crackTime: string; suggestions: string[];
  hasUppercase: boolean; hasLowercase: boolean; hasNumbers: boolean; hasSymbols: boolean;
} {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const suggestions: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSymbols) score += 2;

  const common = ["password", "123456", "qwerty", "abc123", "letmein", "welcome", "admin", "login", "password1", "12345678"];
  if (common.includes(password.toLowerCase())) { score = 0; suggestions.push("This is a commonly used password — avoid it"); }

  if (!hasUppercase) suggestions.push("Add uppercase letters");
  if (!hasLowercase) suggestions.push("Add lowercase letters");
  if (!hasNumbers) suggestions.push("Add numbers");
  if (!hasSymbols) suggestions.push("Add special characters (!@#$%^&*)");
  if (password.length < 12) suggestions.push("Use at least 12 characters");
  if (/(.)\1{2,}/.test(password)) suggestions.push("Avoid repeating characters");
  if (/^[0-9]+$/.test(password)) suggestions.push("Don't use only numbers");

  const strength =
    score <= 2 ? "Very Weak" :
    score <= 4 ? "Weak" :
    score <= 6 ? "Moderate" :
    score <= 7 ? "Strong" : "Very Strong";

  const charsetSize =
    (hasUppercase ? 26 : 0) + (hasLowercase ? 26 : 0) +
    (hasNumbers ? 10 : 0) + (hasSymbols ? 32 : 0) || 26;
  const combinations = Math.pow(charsetSize, password.length);
  const guessesPerSecond = 1e10;
  const seconds = combinations / guessesPerSecond;

  let crackTime: string;
  if (seconds < 1) crackTime = "Instantly";
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000 * 100) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = `${(seconds / 31536000).toExponential(2)} years`;

  return { score: Math.min(9, score), strength, crackTime, suggestions, hasUppercase, hasLowercase, hasNumbers, hasSymbols };
}

function calculateEntropy(password: string): { entropy: number; charsetSize: number; length: number; interpretation: string; yearsToBreak: string } {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const charsetSize =
    (hasUppercase ? 26 : 0) + (hasLowercase ? 26 : 0) +
    (hasNumbers ? 10 : 0) + (hasSymbols ? 32 : 0) || 26;
  const entropy = password.length * Math.log2(charsetSize);
  const combinations = Math.pow(2, entropy);
  const guessesPerSecond = 1e10;
  const seconds = combinations / guessesPerSecond;
  const years = seconds / 31536000;

  let interpretation: string;
  if (entropy < 28) interpretation = "Very Weak — trivially cracked";
  else if (entropy < 36) interpretation = "Weak — cracked in minutes";
  else if (entropy < 60) interpretation = "Moderate — hours to days";
  else if (entropy < 80) interpretation = "Strong — months to years";
  else interpretation = "Very Strong — centuries to crack";

  let yearsToBreak: string;
  if (years < 0.001) yearsToBreak = "< 1 second";
  else if (years < 1) yearsToBreak = `${Math.round(years * 365)} days`;
  else if (years < 1000) yearsToBreak = `${Math.round(years)} years`;
  else yearsToBreak = `${years.toExponential(2)} years`;

  return { entropy: Math.round(entropy * 100) / 100, charsetSize, length: password.length, interpretation, yearsToBreak };
}

router.post("/password/strength", async (req, res) => {
  const { password } = req.body as { password: string };
  if (!password) return res.status(400).json({ success: false, error: "password required" });
  const result = analyzePassword(password);
  return res.json({ success: true, ...result, length: password.length });
});

router.post("/password/breach", async (req, res) => {
  const { password } = req.body as { password: string };
  if (!password) return res.status(400).json({ success: false, error: "password required" });
  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const data = await new Promise<string>((resolve, reject) => {
      const req = https.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { "User-Agent": "VoidScan-SOC" }
      }, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => resolve(body));
      });
      req.on("error", reject);
      req.setTimeout(8000, () => reject(new Error("timeout")));
    });
    const lines = data.split("\n");
    let breachCount = 0;
    for (const line of lines) {
      const [hash, count] = line.trim().split(":");
      if (hash === suffix) {
        breachCount = parseInt(count, 10);
        break;
      }
    }
    return res.json({ success: true, found: breachCount > 0, breachCount });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

router.post("/password/entropy", async (req, res) => {
  const { password } = req.body as { password: string };
  if (!password) return res.status(400).json({ success: false, error: "password required" });
  const result = calculateEntropy(password);
  return res.json({ success: true, ...result });
});

router.post("/password/generate", async (req, res) => {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
  } = req.body as {
    length?: number; includeUppercase?: boolean;
    includeLowercase?: boolean; includeNumbers?: boolean; includeSymbols?: boolean;
  };

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = "";
  if (includeUppercase) charset += upper;
  if (includeLowercase) charset += lower;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;
  if (!charset) charset = lower;

  const actualLength = Math.min(128, Math.max(4, length));
  const bytes = crypto.randomBytes(actualLength * 2);
  let password = "";
  let byteIndex = 0;
  while (password.length < actualLength) {
    const byte = bytes[byteIndex++ % bytes.length];
    if (byte < 256 - (256 % charset.length)) {
      password += charset[byte % charset.length];
    }
  }

  const req2 = { body: { password } } as any;
  const strength = analyzePassword(password);
  const entropy = calculateEntropy(password);
  return res.json({ success: true, password, strength: strength.strength, entropy: entropy.entropy });
});

router.post("/password/passphrase", async (req, res) => {
  const { wordCount = 4, separator = "-" } = req.body as { wordCount?: number; separator?: string };
  const count = Math.min(10, Math.max(2, wordCount));
  const bytes = crypto.randomBytes(count * 2);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = bytes.readUInt16BE(i * 2) % WORDLIST.length;
    words.push(WORDLIST[idx]);
  }
  const passphrase = words.join(separator);
  const entropy = count * Math.log2(WORDLIST.length);
  return res.json({ success: true, passphrase, words, entropy: Math.round(entropy * 100) / 100 });
});

export default router;
