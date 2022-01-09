const express = require('express');
const taskDb = require('../DB/taskDb');
const router = express.Router();


// get all user projects
router.get("/:id", async(req,res) => {
    const projectArray = await taskDb.getUserProjects(req.params.id);
    if(projectArray){
        res.send(projectArray);
    }
})

// create project
router.post("/", async(req,res) => {
    const result = await taskDb.createProject(req.body);
    if(result){
        res.send(result);
    }
})

// get recent projects for user
router.get("/:id/profile", async(req, res) => {
    const projectArray = await taskDb.getProfileProjects(req.params.id);
    if(projectArray){
        res.send(projectArray);
    }
})

// get paginated projects
router.get("/:id/page/:pagenumber", async(req,res) => {
    const projectArray = await taskDb.getPageProjects(req.params.id, req.params.pagenumber);
    if(projectArray){
        res.send(projectArray);
    }

})


// get user project count
router.get("/:id/count", async (req,res) => {
    const projectCount = await taskDb.getUserProjectCount(req.params.id);
    if(projectCount){
        res.send({count: projectCount})
    }
})

// get specific project information (based on project Id)
router.get("/projectData/:id", async(req,res) => {
    const projectData = await taskDb.getProject(req.params.id);
    if(projectData){
        res.send(projectData);
    }
})

// update project
router.post("/updateProject/:id", async (req,res) => {
    const result = await taskDb.updateProject(req.params.id, req.body.newName, req.body.newDesc )
    if(result){
        res.send({updated: true});
    }
})
// delete project

router.post("/deleteProject/:id", async (req,res) => {
    const result = await taskDb.deleteProject(req.params.id);
    if(result){
        res.send({deleted: true})
    }
})

//------------Tasks---------------///

// new task

router.post("/newtask", async (req,res) => {
    const newTask = await taskDb.createTask(req.body);
    if(newTask){
        res.send(newTask);
    }
})

// get task
router.get("/:id/tasks", async(req,res) => {
    const task = await taskDb.getTasks(req.params.id);
    if(task){
        res.send(task);
    }
})

// update task timeline
router.post("/updatetask",async (req,res) => {
    const result = await taskDb.updateTaskTimelineState(req.body);
    if(result){
        res.send({done: true});
    }
})

// update task text
router.post("/updatetaskText", async (req,res) => {
    const result = await taskDb.updateTaskText(req.body);
    if(result){
        res.send({done: true});
    }
})

// delete task
router.post("/deletetask", async (req,res) => {
    const result  = await taskDb.deleteTask(req.body.taskId)
    if(result){
        res.send(result);
    }
})

module.exports = router;