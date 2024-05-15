import { UserManager } from "./user_manager.js";
import User  from "../common_infrastructure/user.js";
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