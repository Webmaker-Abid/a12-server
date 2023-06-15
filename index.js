const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000; 



const uri = "mongodb+srv://abidur:T1R6VPimfDjS3jA1@cluster0.lddc2vn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    

    

    const usersCollection = client.db("AllClasses").collection("users");
    const classesCollection = client.db("AllClasses").collection("classes");
    const selectsCollection = client.db("AllClasses").collection("selects");
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    


    //All Classes related APIs
    app.get("/", async(req,res) => {
      const classesInfo = await classesCollection.find().toArray();
      res.send(classesInfo);
    })

    //Users related APIs
    app.get("/users", async(req,res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    app.get("/users/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await usersCollection.find({
        email: req.params.email}).toArray();
      res.send(result);
    });

    app.post('/users', async(req,res) => {
      const user = req.body;
      console.log(user)
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query);
      console.log(existingUser);
      if(existingUser){
        return res.send({message: 'User Already exist'})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.delete("/users/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    //Instructors related Apis

    app.get("/users/instructor", async (req, res) => {
      const role = 'instructor';
      const query = {role: new ObjectId(role)}
      const result = await usersCollection.find(query);
      res.send(result);
    });

    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);

    })

   

    //Admin related apis

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);

    })

    //Instructors APIs
    app.get("/classes/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await classesCollection.find({
        email: req.params.email}).toArray();
      res.send(result);
    });

    app.get("/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await classesCollection.findOne(query);
      res.send(result);
    })

    app.post("/addClass", async(req,res) => {
      const info = req.body;
      const result = await classesCollection.insertOne(info)
      console.log(info)
    })

    app.delete("/myclass/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await classesCollection.deleteOne(query);
      res.send(result);
    })

    app.put("/dashboard/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateClass = req.body;
      const classes = {
        $set: {
          price: updateClass.price,
          quantity: updateClass.quantity,
          
        }
      }

      const result = await classesCollection.updateOne(filter,classes,options)
      res.send(result)
    } )


    //Selection Related Apis

    


    app.post('/selects', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await selectsCollection.insertOne(item);
      res.send(result);
    })

    app.get("/selects/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await selectsCollection.find({
        email: req.params.email}).toArray();
      res.send(result);
    });

    app.delete("/selects/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await selectsCollection.deleteOne(query);
      res.send(result);
    })









    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });