const { DataBaseManager } = require('./database_manager.js');
const { CustomResponse } = require("../common_infrastructure/response.js");
const Task = require("../common_infrastructure/task.js");
const { Errors } = require("../common_infrastructure/errors.js");
const TaskReportSchedule = require("../common_infrastructure/task_report_schedule.js");
const { TaskModel } = require("./database_manager.js");
const { TaskNote } = require("../common_infrastructure/task_note.js");
const TaskStatus = require("../common_infrastructure/task_status.js");
const ReportType = require("../common_infrastructure/report_type.js");
const reportFrequency = require("../common_infrastructure/report_frequency.js");


class TaskManager extends DataBaseManager {

    //////////////////////////// insertion ////////////////////////////

    /**
     * Create a new task in the database, the id of the task will be automatically generated
     * return the id of the task created
     * @param {number} organizationId
     * @param {Task} task 
     * @returns {CustomResponse<number>}
     */
    async createTask(organizationId, task) {
        if (organizationId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (typeof organizationId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        task.taskOrganizationId = organizationId;
        if (!task.validate()) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid task");
        }
        let new_task = new TaskModel(task);
        await new_task.save();
        return new CustomResponse(Errors.OK, "", new_task.taskId);
    }

    /**
     * Create new note to the task.
     * The note's date will be automatically set to the current time in the server
     * The note's id will be automatically generated
     * Return the id of the note created
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {string} notes 
     * @returns {CustomResponse<number>}
     */
    async createTaskNotes(organizationId, taskId, notes) {
        if (organizationId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (typeof organizationId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (taskId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Id");
        }
        if (typeof taskId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Id");
        }
        if (notes == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Notes");
        }
        if (typeof notes != "string") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Notes");
        }

        const task = await TaskModel.findOne({ taskId: taskId });

        if (task == null) {
            return new CustomResponse(Errors.NOT_FOUND, false, "Task not found");
        }

        let newId = 1;

        if (task.taskNotes.length > 0) {
            newId = Math.max(task.taskNotes.map((note) => note.noteId)) + 1;
        }

        await TaskModel.findOneAndUpdate({ taskId: taskId }, { $push: { taskNotes: new TaskNote(newId, taskId, notes, Date.now()) } });

        return new CustomResponse(Errors.OK, "", newId);
    }

    /**
     * Create a new report schedule for the desired task
     * return the id of the report schedule
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {TaskReportSchedule} taskReportSchedule 
     * @returns {CustomResponse<number>}
     */
    async createTaskReportSchedule(organizationId, taskId, taskReportSchedule) {
        if (organizationId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (typeof organizationId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (taskReportSchedule == undefined || taskReportSchedule.validate == undefined || !taskReportSchedule.validate()) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Report Schedule");
        }
        if (taskId == undefined || typeof taskId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Id");
        }
        let task = await TaskModel.findOne({ taskId: taskId });
        if (task == null) {
            return new CustomResponse(Errors.NOT_FOUND, false, "Task not found");
        }

        let newId = 1;
        if (task.taskReports.length > 0) {
            newId = Math.max(task.taskReports.map((report) => report.reportId)) + 1;
        }

        await TaskModel.findOneAndUpdate({ taskId: taskId }, { $push: { taskReports: taskReportSchedule } });

        return new CustomResponse(Errors.OK, "", newId);
    }


    //////////////////////////// Updating ////////////////////////////

    /**
     * Update the task with the given id with the new task that is passed
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {Task} newTask 
     * @returns {Response}
     */
    async updateTask(organizationId, taskId, newTask) {
        if (newTask == undefined || newTask.validate == undefined || !newTask.validate()) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task");
        }
        let result = await this.verifyThatTaskExist(organizationId, taskId);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        newTask.taskOrganizationId = organizationId;
        newTask.taskId = taskId;
        await TaskModel.findOneAndUpdate({ taskId: taskId}, newTask);
        return new CustomResponse(Errors.OK, "", "");
    }

    /**
     * Update the last updated date of the task with the given id to the current time in the server 
     * @param {number} organizationId
     * @param {number} taskId 
     * @returns {CustomResponse<void>}
     */
    async updateTaskLastUpdated(organizationId, taskId) {
        let result = await this.verifyThatTaskExist(organizationId, taskId);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        await TaskModel.findOneAndUpdate({ taskId: taskId }, { lastUpdated: new Date() });
        return new CustomResponse(Errors.OK, "", undefined);
    }

    /**
     * Update the name of the task with the given id to the new name that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {string} newName
     * @returns {CustomResponse<void>}
     */
    async updateTaskName(organizationId, taskId, newName) {
        if (typeof newName != "string") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Name");
        }
        if (newName == "") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Name");
        }
        let result = await this.verifyThatTaskExist(organizationId, taskId);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        await TaskModel.findOneAndUpdate({ taskId: taskId }, { taskName: newName });
        return new CustomResponse(Errors.OK, "", undefined);
    }

    /**
     * Update the description of the task with the given id to the new description that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {string} newDescription
     * @returns {CustomResponse<void>}
     */
    async updateTaskDescription(organizationId, taskId, newDescription) {
        if(typeof newDescription != "string") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Description");
        }
        let result = await this.verifyThatTaskExist(organizationId, taskId);
        if (result.statusCode != Errors.OK) {
            return result;
        }
        await TaskModel.findOneAndUpdate({ taskId: taskId }, { taskDescription: newDescription });
    }

    /**
     * Update the status of the task with the given id to the new status that is passed 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} newStatus 
     */
    async updateTaskStatus(organizationId, taskId, newStatus) {
    }

    /**
     * Update the notes of a task.
     * The note's date will be automatically set to the current time in the server 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} noteId 
     * @param {string} newNotes 
     * @returns {CustomResponse<void>}
     */
    async updateTaskNotes(organizationId, taskId, noteId, newNotes) {
    }

    /**
     * Update the assignees of the task with the given id to the new assignees that are passed 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number[]} assignees 
     * @returns {CustomResponse<void>}
     */
    async updateTaskAssignees(organizationId, taskId, assignees) {
    }

    /**
     * Add a new assignee to the task, if it doesn't exist already
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} assignee 
     * @returns {CustomResponse<void>}
     */
    async addNewAssignee(organizationId, taskId, assignee) {
    }

    /**
     * Update the manager of the task with the given id to the new manager that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} newManager
     * @returns {CustomResponse<void>}
     */
    async updateTaskManager(organizationId, taskId, newManager) {
    }

    /**
     * Update specified task report schedule 
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} reportId 
     * @param {TaskReportSchedule} newReport 
     * @returns {CustomResponse<void>}
     */
    async updateTaskReport(organizationId, taskId, reportId, newReport) {
    }

    /**
     * Enable the notifications for the task with the given id 
     * @param {number} organizationId
     * @param {number} taskId 
     * @returns {CustomResponse<void>}
     */
    async enableNotification(organizationId, taskId) {
    }

    /**
     * Disable the notifications for the task with the given id 
     * @param {number} organizationId
     * @param {number} taskId 
     * @returns {CustomResponse<void>}
     */
    async disableNotification(organizationId, taskId) {
    }

    /**
     * Add a child task to the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} childTaskId
     * @returns {CustomResponse<void>}
     */
    async addChildTask(organizationId, taskId, childTaskId) {
    }

    /**
     * Update the recursive permissions value of the task with the given id to the new value that is passed
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} newRecursivePermissionsValue
     * @returns {CustomResponse<void>}
    */
    async updateTaskRecursivePermissionsValue(organizationId, taskId, newRecursivePermissionsValue) { }

    //////////////////////////// Deleting ////////////////////////////

    /**
     * Delete the task with the given id 
     * @param {number} organizationId
     * @param {number} taskId 
     * @returns {Response}
     */
    async deleteTask(organizationId, taskId) {
    }

    /**
     * Delete the note with the given id from the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} noteId
     * @returns {CustomResponse<void>}
     */
    async deleteTaskNotes(organizationId, taskId, noteId) {
    }

    /**
     * Delete the assignee with the given id from the task with the given id
     * Can return an error if you are trying to delete the last assignee of the task
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} assigneeId
     * @returns {CustomResponse<void>}
     */
    async deleteTaskAssignee(organizationId, taskId, assigneeId) {
    }

    /**
     * Delete the report with the given id from the task with the given id
     * @param {number} organizationId
     * @param {number} taskId 
     * @param {number} reportId 
     * @returns {CustomResponse<void>}
     */
    async deleteTaskReportSchedule(organizationId, taskId, reportId) {
    }

    /**
     * Remove a child task from the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} childTaskId
     * @returns {CustomResponse<void>}
     */
    async removeChildTask(organizationId, taskId, childTaskId) {
    }

    //////////////////////////// Reading ///////////////////////////

    /**
     * Return one single task
     * @param {number} organizationId 
     * @param {number} takId 
     * @returns {CustomResponse<Task>}
     */
    async readTask(organizationId, taskId) {

    }

    /**
    * Return one single task
    * @param {number} organizationId 
    * @param {number} takId 
    * @returns {CustomResponse<Void>}
    */
    async verifyThatTaskExist(organizationId, taskId) {
        if (organizationId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (typeof organizationId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Organization Id");
        }
        if (taskId == undefined) {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Id");
        }
        if (typeof taskId != "number") {
            return new CustomResponse(Errors.BAD_REQUEST, false, "Invalid Task Id");
        }
        let task = await TaskModel.findOne({ taskId: taskId, taskOrganizationId: organizationId });
        if (task == null) {
            return new CustomResponse(Errors.NOT_FOUND, false, "Task not found");
        }
        return new CustomResponse(Errors.OK, "", undefined);
    }
}

exports.TaskManager = TaskManager;