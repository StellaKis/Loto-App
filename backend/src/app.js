import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticketRoutes.js";
import path from "path";
import pkg from 'express-openid-connect';

const { auth, requiresAuth } = pkg;

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://loto-app-1-qyz9.onrender.com',
  credentials: true
}));

app.use(express.json());

// // Health check
// app.get("/", (req, res) => {
//   res.json({ message: "Loto backend radi!" });
// });

const config = {
  authRequired: false,          
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: 'https://loto-app-b6qy.onrender.com',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://dev-48knub1ve523umrc.us.auth0.com`
};

app.use(auth(config));

app.use("/", ticketRoutes);

app.get("/", (req, res) => {
  res.redirect("https://loto-app-1-qyz9.onrender.com");
  // res.json({ message: "Loto backend radi!" });
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.get("/logout", (req, res) => {
  res.oidc.logout();
});

app.listen(4000, () => console.log("Server radi na portu 4000"));

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid or missing token" });
  }
  next(err); 
});

app.use((err, req, res, next) => {
  console.error("Greška:", err.message);
  res.status(500).json({ error: "Greška na serveru" });
});

export default app;