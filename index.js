import express from "express";
import jwt from "jsonwebtoken";
import client from "./db-client.js";
import getUsers, {
  CreateAdminUser,
  VerifyUser,
  createStudent,
  getSingleUser,
} from "./auth/user.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Home" });
});

app.post("/user/signup", async (req, res) => {
  const { email, username, password } = req.body;
  CreateAdminUser(username, email, password)
    .catch((e) => {
      res.status(500).json({ error: e.message });
    })
    .finally(async () => {
      await client.$disconnect();
      res.status(200).json({ message: "Sign up successfully" });
    });
});

app.get("/user/:id", async (req, res) => {
  let { userId } = req.params;
  let user = await getSingleUser(userId);
  res.json({ user: user });
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Username and password required" });
    }
    const user = await VerifyUser(email, password);

    if (user) {
      const token = jwt.sign(
        { username: user.email, role: user.role },
        "JSON_WEB_TOKEN",
        { expiresIn: "24h" }
      );
      res.status(200).json({ message: "User logged in successfuly", token });
    } else res.status(403).json({ message: "Bad credential" });
  } catch (error) {
    res.status(500).json({ error: error?.stack });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();

    if (users) res.status(200).json({ users: users });
    else res.status(404).json({ message: "No user found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

process.on("SIGINT", async () => {
  await client.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await client.$disconnect();
  process.exit(0);
});

app.listen(3000);
