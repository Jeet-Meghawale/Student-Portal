import express from "express";
const app = express();
app.use(express.json());



// routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

import subjectRoutes from "./routes/subject.routes.js";
app.use("/api/subjects", subjectRoutes);

import testRoutes from "./routes/test.routes.js";
app.use("/api/test", testRoutes);

export default app;
