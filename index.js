import { MongoClient, ServerApiVersion } from "mongodb";
import app from "./app/app.js";


// connect to MongoDB
const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const port = process.env.PORT || 8080;

async function connectDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB server");
  } catch (e) {
    console.error("failed to connect to MongoDB because of error: " + e);
    await closeDb();
    process.exit(1);
  }
}

async function launchServer() {
  try {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (e) {
    console.error("failed to execute server because of error: " + e);
    await closeDb();
    process.exit(1);
  }
}

async function closeDb() {
  try {
    await client.close();
  } catch (e) {
    console.error("failed to close database because of error: " + e);
    process.exit(1);
  }
}


async function main() {
  await connectDb();
  await launchServer();
}

main();
