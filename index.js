import app from "./app/app.js";
import mongoose from "mongoose";

const port = process.env.PORT || 8080;

async function connectDb() {
  try {
    mongoose.connect(process.env.DB_URL);
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
