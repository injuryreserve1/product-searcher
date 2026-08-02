import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  return res.status(200).json({ status: "OK", timestamp: new Date() });
});

export { router as healthRouter };
