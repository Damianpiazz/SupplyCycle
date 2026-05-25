import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});