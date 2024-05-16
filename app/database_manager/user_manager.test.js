const mongoose = require("mongoose");

const { UserManager } = require("./user_manager.js");
const { User } = require("../common_infrastructure/user.js");
const { Errors } = require("../common_infrastructure/errors.js");
const { UserModel } = require("./database_manager.js");
const { UserKind } = require("../common_infrastructure/user_kind.js");

describe('User Manager Tests', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(process.env.DB_URL);
        console.log('Database connected!');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log("Database connection closed");
    });

    describe('Test for creating a new user', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
        });

        test('Test for a new *successful* user insertion', async () => {
            let um = new UserManager();

            let user = new User(1, "UserToCreate", [1], UserKind.Custom, "user@example.com");

            console.log("User before creation:", user);

            if (!user.validate()) {
                console.error("Invalid user:", user);
                throw new Error("Invalid user");
            }

            let result = await um.createUser(user);

            console.log("Result of createUser:", result);

            expect(result.statusCode).toBe(Errors.OK);
            // The payload for the custom response is the user itself
            expect(result.payload.userId).toBe(1);
        });
    });


    describe('Test for finding an existing user', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
            let um = new UserManager();
            let user = new User(1, "UserToRead", [1], UserKind.Custom, "user@example.com");
            await um.createUser(user);
        });

        test('Test for finding an existing user', async () => {
            let um = new UserManager();
            let result = await um.readUser(1);

            expect(result.statusCode).toBe(Errors.OK);
            expect(result.payload.userName).toBe("UserToRead");
        });
    });
});
