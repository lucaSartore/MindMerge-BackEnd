const ServicesBaseClass = require('../services_base_class');
const {TaskTree} = require('../../common_infrastructure/task_tree');
const {Task} = require('../../common_infrastructure/task');

class TaskGetter extends ServicesBaseClass{
    
    /**
     * returns the task trees a user can see inside an organization 
     * @param {number} organizationId 
     * @param {number} userId 
     * @param {string} userToken 
     * @returns {CustomResponse<TaskTree[]>}
     */
    getTasksForUser(organizationId, userId, userToken){
        let result = this.taskManager.readRootTasks(organizationId);
        if(result.statusCode !== Errors.OK){
            return result;
        }


    }

    /**
     * return a task tree starting from one task id
     * @param {number} taskId
     */
    getSingleTaskTree(taskId){
        let task = this.taskManager.readTask(taskId);
        if(task.statusCode !== Errors.OK){
            return task;
        }
        /**
         * @type {Task}
         */
        task = task.payload;
        let taskTree = new TaskTree(task.taskId);

        for(let childTaskId of task.childTasks){
            let childTask = this.getSingleTaskTree(childTaskId);
            if(childTask.statusCode !== Errors.OK){
                return childTask;
            }
            taskTree.childTasks.push(childTask.payload);
        }

        return new CustomResponse(Errors.OK, "", taskTree);
    }


    /**
     * returns the task with the given id
     * @param {number} organizationId
     * @param {number} taskId
     * @param {number} userId
     * @param {string} userToken
     * @returns {CustomResponse<Task>}
     */
    getTask(organizationId, taskId, userId, userToken){
    }
}

exports.TaskGetter = TaskGetter;