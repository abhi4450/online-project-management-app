const express = require("express");

const router = express.Router();

const userAuth = require("../middleware/auth");

const projectController = require("../controllers/Project");

router.post("/project", userAuth.authenticate, projectController.saveProject);
router.get("/projects", userAuth.authenticate, projectController.getProjects);
router.get(
  "/projects/counts",
  userAuth.authenticate,
  projectController.getProjectCounts
);
router.get(
  "/projects/dashboardchart-data",
  userAuth.authenticate,
  projectController.getDashbordChartData
);
router.get("/projects/closure-delays/count",userAuth.authenticate,projectController.getClosureDelayCount)
router.patch(
  "/project/:id",
  userAuth.authenticate,
  projectController.updateProject
);
module.exports = router;
