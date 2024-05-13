import mongoose from "mongoose";

const Task = mongoose.model("Task", {
    taskId: Number,
});

/**
 * @typedef dataBaseManager
 * @type {Object}
 */
export default class DataBaseManager{
    constructor(client){
    }
}