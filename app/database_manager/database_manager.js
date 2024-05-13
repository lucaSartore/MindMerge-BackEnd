import mongoose from "mongoose";

const TaskReportScheduleSchema = new mongoose.Schema({
    // todo for Gioele
});

const TaskSchema = new mongoose.Schema({
    taskId: {Number, required: true, unique: true},
    taskFatherId: Number,
    lastUpdated: {type: Date, default: Date.now, required: true},
    taskName: {type: String, required: true},
    taskDescription: {type: String, required: true},
    taskStatus: {type: Number, required: true},
    taskNotes: {type: [TaskNote], required: true, default: []},
    taskAssignees: {type: [Number], required: true, default: []},
    taskManager: {type: Number, required: true},
    taskOrganizationId: {type: Number, required: true},
    taskReports: {type: [TaskReportScheduleSchema], required: true, default: []},
    notificationEnable: {type: Boolean, required: true, default: false},
    childTasks: {type: [Number], required: true, default: []},
    recusivePermissionsValue: {type: Number, required: true}
});

const TaskModel = mongoose.model("Task", TaskSchema);

/**
 * @typedef dataBaseManager
 * @type {Object}
 */
export default class DataBaseManager{
    constructor(client){
    }
}