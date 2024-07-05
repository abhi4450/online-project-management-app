const Project = require("../models/Project");

exports.saveProject = async (req, res, next) => {
  const {
    projectName,
    reason,
    type,
    division,
    category,
    priority,
    department,
    startDate,
    endDate,
    location,
    status,
  } = req.body;
  console.log("Project details", req.body);
  try {
    const newProject = new Project({
      projectName,
      reason,
      type,
      division,
      category,
      priority,
      department,
      startDate,
      endDate,
      location,
      status,
    });

    await newProject.save();
    res
      .status(201)
      .json({ message: "Project inserted successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Failed to insert project", error });
  }
};

exports.getProjects = async (req, res) => {
  //   try {
  //     const projects = await Project.find({});
  //     res.json(projects);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error fetching projects", error });
  //   }
  const { page, limit } = req.query;

  try {
    const projects = await Project.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Project.countDocuments();
    const totalPages = Math.ceil(count / limit);
    res.json({
      projects,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`Error updating project ${id} status:`, error);
    res.status(500).json({ message: "Failed to update project status." });
  }
};

exports.getProjectCounts = async (req, res, next) => {
  try {
    const total = await Project.countDocuments();
    const closed = await Project.countDocuments({ status: "Closed" });
    const running = await Project.countDocuments({ status: "Running" });
    const cancelled = await Project.countDocuments({ status: "Cancelled" });
    console.log("total:", total);
    console.log("closed", closed);
    console.log("running", running);
    console.log("cancelled", cancelled);

    res.json({ total, closed, running, closureDelay: 2, cancelled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const departmentMapping = {
  STR: "strategy",
  FIN: "finance",
  QLT: "quality",
  MAN: "management",
  STO: "store",
  HR: "human resources",
};
exports.getDashbordChartData = async (req, res, next) => {
  try {
    const data = await Promise.all(
      Object.keys(departmentMapping).map(async (code) => {
        const department = departmentMapping[code];
        const regex = new RegExp(`^${department}$`, "i"); // Case-insensitive regex
        const totalProjects = await Project.countDocuments({
          department: regex,
        });
        const closedProjects = await Project.countDocuments({
          department: regex,
          status: "Closed",
        });
        return { code, totalProjects, closedProjects };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getClosureDelayCount = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    // Count projects with end dates before today
    const count = await Project.countDocuments({
      endDate: { $lt: new Date(today) }, // Find projects with end dates before today
    });
      console.log("ClosureDelay Count", count);

    res.json({ count });
  } catch (err) {
    console.error(
      "Error fetching project count with end dates before today:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
