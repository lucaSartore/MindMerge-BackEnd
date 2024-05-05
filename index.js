const { MongoClient, ServerApiVersion } = require('mongodb');

// connect to MongoDB
const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect(){
    try { await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to MongoDB server");
    } catch (e) {
        console.error(e);
        await client.close();
        process.exit(1);
    }
}


connect().then(() => {

});