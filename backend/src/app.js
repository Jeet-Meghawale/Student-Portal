import express from "express";
const app = express();
app.use(express.json());

import cors from "cors";

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.options("*", cors());


// routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

import subjectRoutes from "./routes/subject.routes.js";
app.use("/api/subjects", subjectRoutes);

import assignmentRoutes from "./routes/assignment.routes.js";
app.use("/api/assignments", assignmentRoutes);

import submissionRoutes from "./routes/submission.routes.js";
app.use("/api/submissions", submissionRoutes);


import testRoutes from "./routes/test.routes.js";
app.use("/api/test", testRoutes);



export default app;
