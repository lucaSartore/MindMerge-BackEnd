const mongoose = require('mongoose');
const reportType = require("../common_infrastructure/report_type.js");
const reportFrequency = require("../common_infrastructure/report_frequency.js");

const TaskReportScheduleSchema = new mongoose.Schema({
    taskId: { type: Number, required: true },
    reportScheduleId: { type: Number, required: true },
    reportType: { type: Number, required: true, default: reportType.Manual },
    reportFrequency: { type: Number, required: true, default: reportFrequency.Weekly },
    nextReportDate: { type: Date, required: true },
    reportPrompt: { type: String, required: true }
});

const TaskReportScheduleModel = mongoose.model("TaskReportSchedule", TaskReportScheduleSchema);


const TaskNoteSchema = new mongoose.Schema({
    noteId: { type: Number, required: true },
    taskId: { type: Number, required: true },
    notes: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const TaskNoteModel = mongoose.model("TaskNote", TaskNoteSchema);


const NotificationSchema = new mongoose.Schema({
    notificationId: { type: Number, required: true },
    userId: { type: Number, required: true },
    notificationText: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

NotificationSchema.pre("save", async function (next) {
    try {
        var count = await this.model("Notification").countDocuments().exec();
        if (count == 0) {
            this.notificationId = 1;
        } else {
            const maxId = await this.model("Notification").find().sort({ notificationId: -1 }).limit(1).select("notificationId").exec();
            this.notificationId = maxId[0].notificationId + 1;
        }
        next();
    } catch (error) {
        console.log("Error in pre save middleware: ", error);
        next(error);
    }
});

const NotificationModel = mongoose.model("Notification", NotificationSchema);


const TaskSchema = new mongoose.Schema({
    taskId: { type: Number, required: true, unique: true },
    taskFatherId: Number,
    lastUpdated: { type: Date, default: Date.now, required: true },
    taskName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskStatus: { type: Number, required: true },
    taskNotes: { type: [TaskNoteSchema], required: true, default: [] },
    taskAssignees: { type: [Number], required: true, default: [] },
    taskManager: { type: Number, required: true },
    taskOrganizationId: { type: Number, required: true },
    taskReports: { type: [TaskReportScheduleSchema], required: true, default: [] },
    notificationEnable: { type: Boolean, required: true, default: false },
    childTasks: { type: [Number], required: true, default: [] },
    recursivePermissionsValue: { type: Number, required: true }
});

// Middleware for auto incrementing the TaskId
TaskSchema.pre("save", async function (next) {
    try {
        var count = await this.model("Task").countDocuments().exec();
        if (count == 0) {
            this.taskId = 1;
        } else {
            const maxId = await this.model("Task").find().sort({ taskId: -1 }).limit(1).select("taskId").exec();
            this.taskId = maxId[0].taskId + 1;
        }
        next();
    } catch (error) {
        console.log("Error in pre save middleware: ", error);
        next(error);
    }
});

const TaskModel = mongoose.model("Task", TaskSchema);


const UserSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    organizations: { type: [Number], required: true },
    userKind: { type: Number, required: true },
    email: { type: String, required: true },
});

// Middleware for auto incrementing the userId AND for username checking
UserSchema.pre("save", async function (next) {
    try {
        // Automatic increment for userId
        var countUser = await this.model("User").countDocuments().exec();
        if (countUser === 0) {
            this.userId = 1;
        } else {
            const maxId = await this.model("User").find().sort({ userId: -1 }).limit(1).select("userId").exec();
            this.userId = maxId[0].userId + 1;
        }
        next();
    } catch (error) {
        console.log("Error in pre save middleware: ", error);
        next(error);
    }
});

const UserModel = mongoose.model("User", UserSchema);


const OrganizationSchema = new mongoose.Schema({
    organizationId: { type: Number, required: true, unique: true },
    organizationName: { type: String, required: true },
    userIds: { type: [Number], required: true },
    licenseValid: { type: Boolean, required: true },
    licenseExpirationDate: { type: Date, required: true },
    ownerId: { type: Number, required: true },
});

//Id assignment for organization
OrganizationSchema.pre('save', async function (next) {
    try {
        if (await this.model('Organization').countDocuments().exec() === 0) {
            this.organizationId = 1;
        } else {
            const maxId = await this.model('Organization').find().sort({ organizationId: -1 }).limit(1).select('organizationId').exec();
            this.organizationId = maxId[0].organizationId + 1;
        }
        next();
        console.log(`Id of the new Organization => ${this.organizationId}`);
    } catch (error) {
        next(error);
    }
});

const OrganizationModel = mongoose.model("Organization", OrganizationSchema);

/**
 * @typedef dataBaseManager
 * @type {Object}
 * @property {mongoose} mongoose - The mongoose object
 */
class DataBaseManager {
    constructor() {
        this.mongoose = mongoose;
    }
}


exports.TaskModel = TaskModel;
exports.UserModel = UserModel;
exports.NotificationModel = NotificationModel;
exports.OrganizationModel = OrganizationModel;
exports.TaskReportScheduleSchema = TaskReportScheduleSchema;
exports.TaskReportScheduleModel = TaskReportScheduleModel;
exports.TaskNoteSchema = TaskNoteSchema;
exports.TaskSchema = TaskSchema;
exports.UserSchema = UserSchema;
exports.OrganizationSchema = OrganizationSchema;
exports.DataBaseManager = DataBaseManager;
