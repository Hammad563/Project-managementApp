const {MongoClient, ObjectId} = require('mongodb');

function taskDb() {
    const task_db = {}

    const url = process.env.URL;
    const Db_name = process.env.DB_NAME;

    // create a new user 
    task_db.saveNewUser = async function(newUser){
        let client;
        try{
            console.log("saving user...")
            client = new MongoClient(url, {useUnifiedTopology: true });
            await client.connect();
            const db = client.db(Db_name);
            const usersCollection = db.collection("users");
            const result = await usersCollection.insertOne(newUser);
            console.log(process.env.URL)
            return result.insertedCount;

        }finally{
            client.close();
        }
    }
    
    // Find user with name
    task_db.getUserByEmail = async function(userName) {
        let client;
        try{
            console.log("finding user...");
            client = new MongoClient(url, {useUnifiedTopology: true})
            await client.connect();
            console.log("connecting to database");
            const db = client.db(Db_name);
            const userCollections = db.collection("users");
            const results = await userCollections.findOne({username: userName})
            console.log("User found")
            return results;
        }finally{
            client.close();
        }
    }

    // find user with Id

    task_db.getUserById = async function(Id){
        let client;
        try{
            console.log("Finding user...")
            client = new MongoClient(url,{useUnifiedTopology: true})
            await client.connect();
            const db = client.db(Db_name);
            const userCollection = db.collection("users");
            const results = await userCollection.findOne({
                _id: new ObjectId(Id)
            })
            console.log("got user by Id")
            return results;
        }finally{
            client.close();
        }
    }
    // create projects for user
    task_db.createProject = async(projectObject) => {
        let client;
        try{
            console.log("creating project...")
            client = new MongoClient(url,{useUnifiedTopology:true});
           await client.connect();
           console.log("connecting to task database");
           const db = client.db(Db_name);
           const projectsCollection = db.collection("projects");
           const result = await projectsCollection.insertOne(projectObject);
           console.log("project created");
            return result;
        }finally{
            client.close();
        }
    }

    // getProject
    task_db.getProject = async(projectId) => {
        let client;
        try{
            console.log("getting project");
            client = new MongoClient(url,{useUnifiedTopology: true});
            await client.connect();
            const db = client.db(Db_name);
            const projectsCollection = db.collection("projects");
            const result = await projectsCollection.findOne({_id: new ObjectId(projectId)})
            console.log("project found");
            return result;

        }finally{
            client.close();
        }
    }

    // get projects per user
    task_db.getUserProjects = async function(userId){
        let client;
        try{
            console.log("Getting projects for user...");
            client = new MongoClient(url, {useUnifiedTopology:true});
            await client.connect();
            const db = client.db(Db_name);
            const usersCollection = db.collection("projects");
            const result = await usersCollection.find({
                ownerId: userId
            }).toArray();
            console.log("got users projects")
            return result;

        }finally{
            client.close()
        }
    }
    // get profile projects
    task_db.getProfileProjects = async function(userId) {
        let client;
        try{
            client = new MongoClient(url, {useUnifiedTopology: true})
            await client.connect();
            const db = client.db(Db_name);
            const projectsCollection = db.collection("projects");
            const results = await projectsCollection.find({ ownerId: userId })
            .sort({ _id: -1 }).limit(6).toArray();
            console.log("user projects got")
            return results;
        }finally{
            client.close()
        }
    }



    // get page Projects
    task_db.getPageProjects= async function(userId, page) {
        let client;
        try{
            client = new MongoClient(url, {useUnifiedTopology:true})
            await client.connect();
            const db = client.db(Db_name);
            const projectsCollection = db.collection("projects");
            const results = await projectsCollection.find({ownerId: userId}).sort({_id: -1})
            .skip(page > 0 ? (page-1) * 14 : 0).limit(14).toArray();
            console.log("got projects for this page")
            return results;
        }finally{
            client.close()
        }
    }
    // project count
    task_db.getUserProjectCount = async function(userId) {
        let client;
        try{
            client = new MongoClient(url, {useUnifiedTopology:true})
            await client.connect();
            const db = client.db(Db_name);
            const projectsCollection = db.collection("projects");
            const results = await projectsCollection.countDocuments({ownerId: userId})
            console.log("got project count")
            return results;
        }finally{
            client.close()
        }
    }


    // update projects
    task_db.updateProject = async(projectId, newName, newDesc ) => {
        let client;
        try{
            console.log("updating project")
            client = new MongoClient(url,{useUnifiedTopology:true})
            await client.connect();
            const db = client.db(Db_name);
            const projectCollection = db.collection("projects");
            const result = await projectCollection.findOneAndUpdate(
                {_id: new ObjectId(projectId)},
                {
                    $set: {
                        projectName: newName,
                        projectDesc: newDesc
                    }
                }
            );
            console.log("updated project")
            return result;
        }finally{
            client.close();
        }
    }

    // delete project
   task_db.deleteProject = async (projectId) => {
       let client;
       try{
        client = new MongoClient(url, {useUnifiedTopology:true});
        await client.connect();
        const db = client.db(Db_name);
        const projectCollection = db.collection("projects");
        const tasksCollection = db.collection("tasks");
        const result1 = await projectCollection.findOneAndDelete({
            _id: new ObjectId(projectId)
        })
        const result2 = await tasksCollection.deleteMany({
            projectId: projectId
        })
        return {result1,result2};
       }finally{
           client.close();
       }
   }

   task_db.searchAndGetProjects = async (query, userId, page) => {
        let client;
        try{
            console.log("searching and retreiving...")
            client = new MongoClient(url, {useUnifiedTopology:true});
           await client.connect();
           const db = client.db(Db_name);
           const projectsCollection = db.collection("projects");
           const result = await projectsCollection.find({
               ownerId: userId,
               $text: {$search: query}
           }).skip(page > 0 ? (page-1) * 10 : 0).limit(10).toArray();
           console.log("searched and got projects")
           return result;
        }finally{
            client.close();
        }
   }

   // number of projects per user
   taskDb.getSearchResultCount = async function(query, userId){
       let client;
       try{
        console.log("finding number of projects");
        client = new MongoClient(url,{useUnifiedTopology:true});
        await client.connect();
        const db = client.db(Db_name);
        const projectsCollection = db.collection("projects");
        const result = await projectsCollection.countDocuments({
            ownerId: userId,
            $text:{
                $search: query
            }
        });
        console.log("got search result count")
        return result
       
       }finally{
           client.close();
       }
   }

   task_db.createTask = async(taskObject) => {
       let client;
       try{
        client = new MongoClient(url, {useUnifiedTopology:true})
        await client.connect();
        const db = client.db(Db_name);
        const tasksCollection = db.collection("tasks");
        const result = await tasksCollection.insertOne(taskObject);
        console.log("created task");
        return result;
       }finally{
           client.close();
       }
   }

   task_db.getTasks = async(projectId) => {
        let client;
        try{
        client = new MongoClient(url, {useUnifiedTopology:true})
        await client.connect();
        const db = client.db(Db_name);
        const tasksCollection = db.collection("tasks");
        const results = await tasksCollection.find({
            projectId: projectId
        }).toArray();
        console.log("tasks found")
        return results;
        }finally{
            client.close();
        }
    }
    ///
    task_db.updateTaskTimelineState = async(newData) => {
        let client;
        try{
         client = new MongoClient(url, {useUnifiedTopology:true})
         await client.connect();
         const db = client.db(Db_name);
         const tasksCollection = db.collection("tasks");
         const result = await tasksCollection.updateOne(
             {_id: new ObjectId(newData.id)},
             {$set: {taskState: newData.newState}}
         )
         return result;
 
        }finally{
            client.close();
        }
    }

    task_db.updateTaskText= async(newTaskObject) => {
        let client;
        try{
         client = new MongoClient(url, {useUnifiedTopology:true})
         await client.connect();
         const db = client.db(Db_name);
         const taskCollection = db.collection("tasks");
         const result = await taskCollection.findOneAndUpdate(
             {
                 _id: new ObjectId(newTaskObject.id)
             },
             {
                 $set:{ taskText: newTaskObject.newText}
             }
         )
         console.log("updated task");
         return result;
 
        }finally{
            client.close();
        }
    }
    task_db.deleteTask = async(taskId) => {
        let client;
        try{
         client = new MongoClient(url, {useUnifiedTopology:true})
         await client.connect();
         const db = client.db(Db_name);
         const taskCollection = db.collection("tasks");
        const result = await taskCollection.findOneAndDelete({
            _id: new ObjectId(taskId)
        });
        console.log("deleted task")   
        return result;
        }finally{
            client.close();
        }
    }
 
    task_db.updateUserData = async(userId, fullProfileData) => {
        let client;
        try{
            client = new MongoClient(url, {useUnifiedTopology:true});
            await client.connect();
            const db = client.db(Db_name);
            const userCollection = db.collection("users");
            const result = await userCollection.updateOne({_id: new ObjectId(userId)},
                {
                    $set: {
                        fullname: fullProfileData.userFullName,
                        username: fullProfileData.userEmail,
                        location: fullProfileData.userLocation,
                        institution: fullProfileData.userInst,
                        job: fullProfileData.userJob
                    }
                }
            )
            console.log("user update complete")
            return result;

        }finally{
            client.close();
        }
    }


 
     return task_db;

}

module.exports = taskDb();