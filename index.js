const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middle Ware Using 
app.use(cors());
app.use(express.json())


// Data base Connecting start Here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a9icx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run( ){
    try{
        await client.connect();
        const database = client.db("carmac");
        const servicesCollection = database.collection("services");

            // get Api 
            app.get("/services", async( req, res) =>{
                const cursor = servicesCollection.find({});
               const services =  await cursor.toArray();
                res.send( services)
            });

            // get Spacific api data 
            app.get("/services/:id", async(req, res) =>{
                const id = req.params.id;
                const query = { _id: ObjectId(id)};
                const result = await servicesCollection.findOne(query);
                res.json(result)
            });


        // Post api 
         app.post('/services', async ( req, res ) =>{
             const service = req.body;
                console.log("hit The Database",service)
                const result = await servicesCollection.insertOne(service);
                console.log(result);
                res.json(result)
            
         })
        //  delete Api

        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={ _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }finally{
            // await client.close();
    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    const heading = `<h1 style="font-size: 80px; text-align: center; line-height: 500px; color: #010fd4">
   Garage Server Running  </h1>`
    res.send(heading)
});

app.listen(port, () => {
    console.log("Start the Garage Server", port)
});


