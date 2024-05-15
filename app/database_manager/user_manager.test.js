import mongoose from "mongoose";
import { UserManager } from "./user_manager.js";
import User  from "../common_infrastructure/user.js";
import Errors from "../common_infrastructure/errors.js";
import { UserSchema } from "./database_manager.js";
describe('Test create user', () => {

  let connection;

  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    // clear all users
    // await UserSchema.remove({}); 
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('Test for a new *successful* user insertion', async () => {
    let um = new UserManager();

    let user = new User( 1, "Gerry", [1], i);

    let result = await um.createUser(user);
    expect(result).toBe(Errors.OK);


  });

  test('Test for finding an existing user', async () => {
    let um = new UserManager();
    await um.readUser(1);
  })
});