import mongoose from "mongoose";

const Task = mongoose.model("Task", {
    taskId: Number,
});

const User = mongoose.model("User", {
    userId: Number,
    userName: String,
    organizations: [Number],
    userKind: Number,
    email: String,
});

/**
 * @typedef dataBaseManager
 * @type {Object}
 */
export default class DataBaseManager{
    constructor(client){
    }
}