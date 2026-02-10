import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

const EMAIL = process.env.OFFICIAL_EMAIL || "shivam1209.be23@chitkara.edu.in";

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(a, b % a));
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message: "Exactly one key is required"
      });
    }

    const key = keys[0];
    const value = body[key];
    let result;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value < 0)
          throw new Error("Invalid fibonacci input");
        let fib = [0, 1];
        for (let i = 2; i < value; i++) {
          fib.push(fib[i - 1] + fib[i - 2]);
        }
        result = fib.slice(0, value);
        break;

      case "prime":
        if (!Array.isArray(value))
          throw new Error("Invalid prime input");
        result = value.filter(n => Number.isInteger(n) && isPrime(n));
        break;

      case "lcm":
        if (!Array.isArray(value) || value.length === 0)
          throw new Error("Invalid lcm input");
        result = value.reduce((a, b) => lcm(a, b));
        break;

      case "hcf":
        if (!Array.isArray(value) || value.length === 0)
          throw new Error("Invalid hcf input");
        result = value.reduce((a, b) => gcd(a, b));
        break;

     case "AI":
  if (typeof value !== "string")
    throw new Error("Invalid AI input");

  const aiResponse = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: value
            }
          ]
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  result =
    aiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim() || "Unknown";
  break;




      default:
        throw new Error("Invalid key");
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      is_success: false,
      message: err.response?.data?.error?.message || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
