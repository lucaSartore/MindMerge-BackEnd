const mongoose = require("mongoose");

const { UserManager } = require("./user_manager.js");
const { User } = require("../common_infrastructure/user.js");
const { Errors } = require("../common_infrastructure/errors.js");
const { UserModel } = require("./database_manager.js");
const { UserKind } = require("../common_infrastructure/user_kind.js");

describe('TEST USER MANAGER', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(process.env.DB_URL);
        // console.log('Database connected!');
    });

    afterAll(async () => {
        await mongoose.connection.close();
        // console.log("Database connection closed");
    });

    describe('=> Inserting users:', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
        });

        test('create *multiple* users', async () => {
            let um = new UserManager();

            // Array of user to add once emptied the DB
            let users = [
                new User(1, "User1", [1], UserKind.Custom, "user1@example.com"),
                new User(2, "User2", [2], UserKind.Custom, "user2@example.com"),
                new User(3, "User3", [3], UserKind.Custom, "user3@example.com")
            ];

            for (let user of users) {
                // console.log("User before creation:", user);
                if (!user.validate()) {
                    // console.error("Invalid user:", user);
                    throw new Error("Invalid user");
                }

                let result = await um.createUser(user);
                // console.log("Result of createUser:", result);
                expect(result.statusCode).toBe(Errors.OK);
                // The payload for the response is the user itself
                expect(result.payload.userId).toBe(user.userId);
            }
        });
    });


    describe('=> Finding users:', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
            let um = new UserManager();
            let user = new User(1, "UserToRead", [1], UserKind.Custom, "user@example.com");
            await um.createUser(user);
        });

        test('find an *existing* user', async () => {
            let um = new UserManager();
            let result = await um.readUser(1);

            expect(result.statusCode).toBe(Errors.OK);
            expect(result.payload.userName).toBe("UserToRead");
        });
    });
});
