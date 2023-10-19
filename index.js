const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kibh5sm.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`


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

    const database = client.db("userDB56hY");
    const productCollection = database.collection("product");
    const brandCollection = database.collection("brand");


    app.get('/shop', async(req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/product/:id:', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const product = await productCollection.findOne(query);
        res.send(product);
    })

    app.get('/getbrand', async(req, res) => {
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    app.post('/shop', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await productCollection.insertOne(newProduct);
        res.send(result);

    })

    app.post('/brand', async(req, res) =>{
        const newBrand = req.body;
        console.log(newBrand)
        const result = await brandCollection.insertOne(newBrand);
        res.send(result);
    })

    app.put('/product/:id:', async(req, res) =>{
        const id = req.params.id;
        console.log(updateProduct)
        const filter = {_id: new ObjectId(id)};
        const options = {upsert : true};
        const updateProduct = req.body;
        const updatedProduct = {
            $set : {
                image: updateProduct.image,
                name : updateProduct.name,
                price: updateProduct.price,
                type: updateProduct.type,
                brand: updateProduct.brand,
                description: updateProduct.image
            }
        }
        const result = await productCollection.updateOne(filter, updatedProduct, options);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Coffe ')
})


app.listen(port, () => {
  console.log(`Coffe Shop Open With Port ${port}`)
})