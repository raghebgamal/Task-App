
const Task=require("./../models/task")
exports.getTasks = async (req, res) => {
    const match = {}
    const  sort= {}
   
    if (req.query.sort) {
        const sortby = req.query.sort.split(":")
        sort[sortby[0]] = sortby[1] === "asc"? 1 : -1;
    }
    if (req.query.completed) {
        match.completed=req.query.completed==="true"
    }
    
    try {
        //  const task = await Task.find({owner:req.user._id}).populate("owner");
        await req.user.populate({ path: "tasks", 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                
            }

        });



        res.status(200).json({ task:req.user.tasks})
    } catch (err) {
        console.log(err)
        res.status(500).json({ err })

    }
};
exports. postTask = async (req, res) => {
    try {

        req.body.owner = req.user._id;
         
        
        const task = await Task.create(req.body)
        req.user.task.push(task._id);
        await req.user.save();


        res.status(201).json({ task })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err })

    }
};
exports. getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id:req.params.id,owner:req.user._id }).populate("owner");
        
        if (!task) {
            return res.status(404).json({ message: "task not found" })
        }

        res.status(201).json({ task })
    } catch (err) {
        console.log(err)

        res.status(500).json({ err })
 
    }

};
exports. updateTaskById=async (req, res) => {
    
    
    try {
        const update = ["description", "completed"]
        const isvalid =  Object.keys(req.body).every((el) => update.includes(el));
        if (isvalid) {
            //const task = await Task.findById(req.params.id,);
        const task = await Task.findOne({ _id:req.params.id,owner:req.user._id }).populate("owner");

            if (!task) {
                return res.status(404).json({ message: "task not found" })
            }
            Object.keys(req.body).forEach((el) => {
                task[el] = req.body[el];
            });
            await task.save();

            res.status(201).json({ task })
        } else {
            return res.status(404).json({ message: "input update not valid" })
            
        }
    } catch (err) {

     res.status(500).json({err})
 
    }

}
exports. deleteTask = async (req, res) => {
    
    
    try {

        const task = await Task.findOneAndDelete({ _id:req.params.id,owner:req.user._id });
        
        if (!task) {
            return res.status(404).json({ message: "task not found" })
        }
        

        const isinclude = req.user.task.includes(task._id);

        req.user.task.splice(task._id, 1)



    


        console.log(isinclude)
     
                
    
        
        await req.user.save();
        res.status(201).json({ task ,message:"this task deleted"})
    
            
        
    } catch (err) {

        res.status(500).json({ err })
 
    }

};