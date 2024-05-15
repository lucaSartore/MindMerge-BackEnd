import mongoose from "mongoose";
import { UserManager } from "./user_manager.js";
import User  from "../common_infrastructure/user.js";

describe('TEST 1', () => {

  let connection;

  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('Test for a new *successful* user insertion', async () => {
    let um = new UserManager();
    await um.createUser(
        new User(
            1,
            "Gerry",
            [1],
            0,
            "user@mail.com"
        )
    );
  });

  test('Test for finding an existing user', async () => {
    let um = new UserManager();
    await um.readUser(42);
  })
});