import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import googleTrends from "google-trends-api";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/trends", async (req, res) => {
    try {
      const { geo } = req.query;
      // Fetch daily trends for a specific region
      const results = await googleTrends.dailyTrends({
        geo: (geo as string) || "US",
        trendDate: new Date(),
      });
      res.json(JSON.parse(results));
    } catch (error) {
      console.error("Error fetching trends:", error);
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  app.get("/api/interest", async (req, res) => {
    try {
      const { keyword } = req.query;
      if (!keyword) return res.status(400).json({ error: "Keyword is required" });
      
      const results = await googleTrends.interestOverTime({
        keyword: keyword as string,
      });
      res.json(JSON.parse(results));
    } catch (error) {
      console.error("Error fetching interest:", error);
      res.status(500).json({ error: "Failed to fetch interest" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
