const express = require("express");
const taskDb = require("../DB/taskDb");
const router = express.Router();


router.get("/:id", async function (req,res) {
    const result = await taskDb.getUserById(req.params.id);
    res.send(result);
})

router.post("/updateProfile", async function(req,res) {
    const result = await taskDb.updateUserData(req.body.id, req.body);
    if(result){
        res.send({done: true})
    }
})


module.exports = router;