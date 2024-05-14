import { UserManager } from "./user_manager";
import { User } from "../common_infrastructure/user";
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