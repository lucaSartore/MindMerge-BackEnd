const mongoose = require("mongoose");
const { UserManager } = require("./user_manager.js");
const {User}  = require("../common_infrastructure/user.js");
const {Errors} = require("../common_infrastructure/errors.js");
const { UserSchema, UserModel } = require("./database_manager.js");

describe('Test create user', () => {

  let connection;

  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    // clear all users
    console.log('Database connected!');
  });

  afterAll( async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });

  // ???
  test('Test for a new *successful* user insertion', async () => {
    await UserModel.deleteMany({}); 
    let um = new UserManager();
    let result = await um.createUser(
        new User(
            1,
            "Gerry",
            [1],
            0,
            "user@mail.com"
        )
    );

    if (result.statusCode != 200) { // result.codes.ok()
      throw new Error ("ciao");
    }

    let user = new User( 1, "Gerry", [1], 0, "user@example.com");

    let result = await um.createUser(user);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(1);

    user.userName += "2";
    result = await um.createUser(user);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(2);

    user.userName += "3";
    result = await um.createUser(user);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(3);

    user = await UserModel.findOne({userId: 1});
    expect(user.userName).toBe("Gerry");
    expect(JSON.stringify(user.organizations)).toBe("[1]");
    expect(user.userKind).toBe(0);
    expect(user.email).toBe("user@example.com");

    user = await UserModel.findOne({userId: 2});
    expect(user.userName).toBe("Gerry2");

    user = await UserModel.findOne({userId: 3});
    expect(user.userName).toBe("Gerry23");

  });
  test('Test for bad request user creation', async () => {
    await UserModel.deleteMany({}); 
    let um = new UserManager();

    let r = await um.createUser(new User( 1, null, [1], 0, "user@example.com"));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1,22, [1], 0, "user@example.com"));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", ["sds"], 0, "user@example.com"));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", null, 0, "user@example.com"));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", [1], NaN, "user@example.com"));
    
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", [1], 10, "user@example.com"));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", [1], 0, ""));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", [1], 0, 111));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

    r = await um.createUser(new User( 1, "Gerry", [1], 0, undefined));
    expect(r.statusCode).toBe(Errors.BAD_REQUEST);

  });

  test('Test for finding an existing user', async () => {
    let um = new UserManager();
    await um.readUser(1);
  })
});