import mongoose from "mongoose";

const Task = mongoose.model("Task", {
    taskId: Number,
});

const User = mongoose.model("User", {
    userId: {type: Number, required: true, unique: true},
    userName: {type: String, required: true},
    organizations: {type: [Number], required: true},
    userKind: {type: Number, required: true},
    email: {type: String, required: true},
});

/**
 * @typedef dataBaseManager
 * @type {Object}
 */
export default class DataBaseManager{
    constructor(client){
    }
}