import mongoose from "mongoose";
import reportType from "../common_infrastructure/report_type.js";
import reportFrequency from "../common_infrastructure/report_frequency.js";

const TaskReportScheduleSchema = new mongoose.Schema({
    taskId: {type: Number, required: true, unique: true},
    reportScheduleId: {type: Number, required: true, unique: true},
    reportType: {type: Number, required: true, default: reportType.Manual},
    reportFrequency: {type: Number, required: true, default: reportFrequency.Weekly},
    nextReportDate: {type: Date, required: true},
    reportPrompt: {type: String, required: true}
});

const TaskReportScheduleModel = mongoose.model("TaskReportSchedule", TaskReportScheduleSchema);

const TaskNoteSchema = new mongoose.Schema({
    noteId: {type: Number, required: true},
    taskId: {type: Number, required: true},
    notes: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true}
});

const TaskSchema = new mongoose.Schema({
    taskId: {type: Number, required: true, unique: true},
    taskFatherId: Number,
    lastUpdated: {type: Date, default: Date.now, required: true},
    taskName: {type: String, required: true},
    taskDescription: {type: String, required: true},
    taskStatus: {type: Number, required: true},
    taskNotes: {type: [TaskNoteSchema], required: true, default: []},
    taskAssignees: {type: [Number], required: true, default: []},
    taskManager: {type: Number, required: true},
    taskOrganizationId: {type: Number, required: true},
    taskReports: {type: [TaskReportScheduleSchema], required: true, default: []},
    notificationEnable: {type: Boolean, required: true, default: false},
    childTasks: {type: [Number], required: true, default: []},
    recusivePermissionsValue: {type: Number, required: true}
});

const TaskModel = mongoose.model("Task", TaskSchema);

const UserSchema = new mongoose.Schema({
    userId: {type: Number, required: true, unique: true},
    userName: {type: String, required: true},
    organizations: {type: [Number], required: true},
    userKind: {type: Number, required: true},
    email: {type: String, required: true},
});

// Middleware
UserSchema.pre('save', async function(next) {
  try {
    if (await this.model('User').countDocuments().exec() === 0) {
      this.userId = 1;
    } else {
      const maxId = await this.model('User').find().sort({ userId: -1 }).limit(1).select('userId').exec();
      this.userId = maxId[0].userId + 1;
    }
    next();
    console.log(`Id of the new user => ${this.userId}`);
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model("User", UserSchema);

/**
 * @typedef dataBaseManager
 * @type {Object}
 * @property {mongoose} mongoose - The mongoose object
 */
class DataBaseManager{
    constructor(){
        this.mongoose = mongoose;
    }
}


export {TaskModel, UserModel, TaskReportScheduleSchema, TaskNoteSchema, TaskSchema, UserSchema, DataBaseManager};