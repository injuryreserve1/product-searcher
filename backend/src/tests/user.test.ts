import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { Chat } from "../db/models/chat";

describe("User Router Integration Tests", () => {
  const getTestUser = () => {
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    return {
      username: `TestUserLongName${uniqueId}`,
      password: "SecurePassword123!",
    };
  };

  describe("POST /signup", () => {
    it("should successfully register a new user and set auth cookie", async () => {
      const testUser = getTestUser();
      const res = await request(app).post("/api/v1/user/signup").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Вы успешно зарегистрировались!",
      );

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const cookieStr = Array.isArray(cookies)
        ? cookies.join("; ")
        : String(cookies);
      expect(cookieStr.includes("authcookie=")).toBe(true);
    });

    it("should fail if user already exists", async () => {
      const testUser = getTestUser();
      await request(app).post("/api/v1/user/signup").send(testUser).expect(201);

      const res = await request(app)
        .post("/api/v1/user/signup")
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /login", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = getTestUser();
      await request(app).post("/api/v1/user/signup").send(testUser).expect(201);
    });

    it("should successfully login, set cookie and auto-create a chat", async () => {
      const res = await request(app)
        .post("/api/v1/user/login")
        .send(testUser)
        .expect(200);

      expect(res.body).toHaveProperty("message", "Успешный вход");
      expect(res.body.user).toHaveProperty(
        "username",
        testUser.username.toLowerCase(),
      );
      expect(res.body).toHaveProperty("activeChatId");

      const chatInDb = await Chat.findById(res.body.activeChatId);
      expect(chatInDb).not.toBeNull();
      expect(chatInDb?.author.toString()).toBe(res.body.user.id);
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/user/login")
        .send({ username: testUser.username, password: "wrongpassword" })
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("Protected Routes (requireAuth)", () => {
    let authCookie: string[];
    let testUser: any;

    beforeEach(async () => {
      testUser = getTestUser();
      await request(app).post("/api/v1/user/signup").send(testUser).expect(201);
      const loginRes = await request(app)
        .post("/api/v1/user/login")
        .send(testUser)
        .expect(200);

      const rawCookies = loginRes.headers["set-cookie"];
      authCookie = Array.isArray(rawCookies)
        ? rawCookies
        : rawCookies
          ? [rawCookies]
          : [];
    });

    it("GET /info should block request without cookie", async () => {
      await request(app).get("/api/v1/user/info").expect(401);
    });

    it("GET /info should return user data when authorized", async () => {
      const res = await request(app)
        .get("/api/v1/user/info")
        .set("Cookie", authCookie)
        .expect(200);

      expect(res.body).toHaveProperty(
        "username",
        testUser.username.toLowerCase(),
      );
    });

    it("PATCH /info-change should update user settings", async () => {
      const newSettings = { theme: "dark", language: "ru" };

      const res = await request(app)
        .patch("/api/v1/user/info-change")
        .set("Cookie", authCookie)
        .send({ settings: newSettings })
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  describe("POST /logout", () => {
    it("should clear auth cookie on logout", async () => {
      const res = await request(app).post("/api/v1/user/logout").expect(200);

      expect(res.body).toHaveProperty("message", "Вы успешно вышли");

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const cookieStr = Array.isArray(cookies)
        ? cookies.join("; ")
        : String(cookies);
      expect(cookieStr.includes("authcookie=")).toBe(true);
    });
  });
});
