const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
  createResume,
  getResumeByUserId,
  updateResume,
} = require("../models/resumeModel");

router.post("/resumes", authenticateToken, async (req, res, next) => {
  try {
    const resumeData = {
      user_id: req.user.id,
      ...req.body,
    };

    const resume = await createResume(resumeData);

    res.status(201).json({ resume, message: "Resume created successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/resumes", authenticateToken, async (req, res, next) => {
  try {
    const resumes = await getResumeByUserId(req.user.id);

    res.status(200).json({ resumes });
  } catch (error) {
    next(error);
  }
});

router.put("/resumes/:resumeId", authenticateToken, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const updates = req.body;

    const updatedResume = await updateResume(resumeId, updates);

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res
      .status(200)
      .json({ resume: updatedResume, message: "Resume updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
