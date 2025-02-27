"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectcontrollers_1 = require("../controllers/projectcontrollers");
const router = (0, express_1.Router)();
router.get("/", projectcontrollers_1.getProjects);
router.post("/", projectcontrollers_1.createProject);
exports.default = router;
