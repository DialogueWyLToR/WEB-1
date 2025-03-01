import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    res.write(
      `data: ${JSON.stringify({
        message: "Üdv a backendről!",
        count: counter,
      })}\n\n`
    );
  }, 2000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(3000, () => {
  console.log("SSE szerver fut: http://localhost:3000");
});
