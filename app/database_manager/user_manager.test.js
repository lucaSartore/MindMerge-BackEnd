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

    describe('', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
        });

        test('create users successful', async () => {
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

                expect(result.statusCode).toBe(Errors.OK);
                expect(result.payload.userId).toBe(user.userId);
            }
        });

        test('create user bad request', async () => {
            let um = new UserManager();

            // Array of user to add once emptied the DB
            let users = [
                new User(1, "User1", [1], UserKind.Custom, ""),
                new User(2, "User2", "aaa", 2, "user2@example.com"),
                new User(3, "", [3], UserKind.Custom, "user3@example.com")
            ];

            for (let user of users) {
                let result = await um.createUser(user);

                expect(result.statusCode).toBe(Errors.BAD_REQUEST);
            }
        });
    });


    describe('', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
        });

        test('find user successful', async () => {
            let um = new UserManager();
            let userToCreate = new User(1, "UserToRead", [1], UserKind.Custom, "user@example.com");
            await um.createUser(userToCreate);

            let result = await um.readUser(1);

            expect(result.statusCode).toBe(Errors.OK);
            expect(result.payload.userName).toBe("UserToRead");
        });

        test('find user not found', async () => {
            let um = new UserManager();
            let userToCreate = new User(1, "UserToRead", [1], UserKind.Custom, "user@example.com");
            await um.createUser(userToCreate);

            let result = await um.readUser(42);

            expect(result.statusCode).toBe(Errors.NOT_FOUND);
        });        
        
        test('find user bad request', async () => {
            let um = new UserManager();
            let userToCreate = new User(1, "UserToRead", [1], UserKind.Custom, "user@example.com");
            await um.createUser(userToCreate);

            let result = await um.readUser("aaa");

            expect(result.statusCode).toBe(Errors.BAD_REQUEST);
        });

        test('find *every* user', async () => {
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
                await um.createUser(user);
            }

            let result = await um.readAllUsers();

            expect(result.payload.length).toBe(3);
        });
    });

    /**
     * In order to speed-up tests, I'll avoid to create 3 users each time (under beforeEach)
     * Instead, I will do that way only with the first test to check whether the middleware
     * Is not invoked during the change of the attributes
     */
    describe('', () => {
        beforeEach(async () => {
            await UserModel.deleteMany({});
        });

        test('update username successfully', async () => {
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
                await um.createUser(user);
            }

            let result = await um.updateUserName(1, "UpdatedUserName");

            expect(result.statusCode).toBe(Errors.OK);

            let updatedUser = await um.readUser(1);
            expect(updatedUser.payload.userName).toBe("UpdatedUserName");
        });

        test('update username bad request', async () => {
            let um = new UserManager();

            let users = [
                new User(1, "User1", [1], UserKind.Custom, "user1@example.com"),
                new User(2, "User2", [2], UserKind.Custom, "user2@example.com"),
                // email must be different, the third will be updated with the email of the fourth one
                new User(2, "User3", [2], UserKind.Custom, "user3@example.com"),
                new User(2, "User4", [2], UserKind.Custom, "user4@example.com"),
            ];

            for (let user of users) {
                // console.log("User before creation:", user);
                if (!user.validate()) {
                    // console.error("Invalid user:", user);
                    throw new Error("Invalid user");
                }
                await um.createUser(user);
            }

            let result;

            result = await um.updateUserName(1, "");
            expect(result.statusCode).toBe(Errors.BAD_REQUEST);

            result = await um.updateUserName(1, 42);
            expect(result.statusCode).toBe(Errors.BAD_REQUEST);

            result = await um.updateUserName(1, "User4");
            expect(result.statusCode).toBe(Errors.BAD_REQUEST);
        });

        test('update user kind successfully', async () => {
            let um = new UserManager();
            await um.createUser(new User(1, "User1", [1], UserKind.Custom, "user1@example.com"));

            let result = await um.updateUserKind(1, UserKind.Facebook);

            expect(result.statusCode).toBe(Errors.OK);

            let updatedUser = await um.readUser(1);
            expect(updatedUser.payload.userKind).toBe(UserKind.Facebook);
        });

        test('update user kind bad request', async () => {
            let um = new UserManager();
            await um.createUser(new User(1, "User1", [1], UserKind.Custom, "user1@example.com"));

            let result = await um.updateUserKind(1, UserKind.Facebook);

            expect(result.statusCode).toBe(Errors.OK);

            let updatedUser = await um.readUser(1);
            expect(updatedUser.payload.userKind).toBe(UserKind.Facebook);
        });
        
        test('update user email successfully', async () => {
            let um = new UserManager();
            await um.createUser(new User(1, "User1", [1], UserKind.Custom, "old_email@example.com"));

            let result = await um.updateUserEmail(1, "new_email@example.com");

            expect(result.statusCode).toBe(Errors.OK);

            let updatedUser = await um.readUser(1);
            expect(updatedUser.payload.email).toBe("new_email@example.com");
        });

        test('update user email bad request', async () => {
            let um = new UserManager();
            await um.createUser(new User(1, "User1", [1], UserKind.Custom, "user1@example.com"));
            await um.createUser(new User(1, "User2", [1], UserKind.Custom, "user2@example.com"));

            let result = await um.updateUserEmail(1, "eser2@example.com");

            expect(result.statusCode).toBe(Errors.BAD_REQUEST);
        });
    });
});
