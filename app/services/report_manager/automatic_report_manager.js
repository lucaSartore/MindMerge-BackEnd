const { TaskTree } = require("../../common_infrastructure/task_tree.js");
const {ServicesBaseClass} = require("../services_base_class.js");
const {taskEditor} = require("../task_manager/task_editor.js");
const {taskGetter} = require("../task_manager/task_getter.js");
const {Errors} = require("../../common_infrastructure/errors.js");
const {Task} = require("../../common_infrastructure/task.js");
const {promptLlm} = require("./llm_prompter.js");


class AutomaticReportManager extends ServicesBaseClass{
    /**
     * 
     * @param {number} organizationId 
     * @param {number} taskId 
     * @param {string} reportPrompt 
     */
    async generateAutomaticReports(organizationId, taskId, reportPrompt){
        let taskTree = await taskGetter.getSingleTaskTree(organizationId, taskId);
        if (taskTree.statusCode !== Errors.OK){
            return taskTree;
        }
        return await this.generateAutomaticReportRecursive(organizationId, reportPrompt, taskTree.payload);
    }

    /**
     * 
     * @param {string} reportPrompt 
     * @param {TaskTree} taskTree 
     * @returns {Promise<CustomResponse<string>>}
     */
    async generateAutomaticReportRecursive(organizationId, reportPrompt, taskTree){
        let response = await taskGetter.getTask(organizationId, taskTree.taskId);
        if (response.statusCode !== Errors.OK){
            return response;
        }
        let task = response.payload;

        let reportsOfChildTasks = [];

        for(let childTaskTree in taskTree.childTasks){
           reportsOfChildTasks.push(
                this.generateAutomaticReportRecursive(organizationId, reportPrompt, childTaskTree)
           );
        }

        reportsOfChildTasks = await Promise.all(reportsOfChildTasks);

        for(let i=0; i<reportsOfChildTasks.length; i++){
            if(reportsOfChildTasks[i].statusCode !== Errors.OK){
                return reportsOfChildTasks[i];
            }
            reportsOfChildTasks[i] = reportsOfChildTasks[i].payload;
        }
        
        reportsOfChildTasks = reportsOfChildTasks.join("\n\n\n");
        
        let notes = task.taskNotes.map(
            note => {
                return "Note number: " + note.noteId + "\n" +
                        "Note date: " + note.date + "\n" +
                        "Note content: " + note.notes
            }
        ).join("\n\n\n");


        let prompt = `I need you to generate a report that answers a question about a task that is been developed at our organization.

The question is: ${reportPrompt}
            
Keep in mind that it is possible that you don't have enough information to answer the question, in that case you should reply: "No relevant information were found".

The task in question has the name: ${task.taskName}

Has the description:

${task.taskDescription}

and has a series of notes:

${notes}


the task has also a series of children tasks, that could have relevant informations, here you find a report trying to answer the question for each of them:

${reportsOfChildTasks}
        `

        let result = promptLlm(prompt);
        if (result.statusCode !== Errors.OK){
            return result;
        }
        result. payload 
    }
}


const automaticReportManager = new AutomaticReportManager();

exports.automaticReportManager = automaticReportManager;
exports.AutomaticReportManager = AutomaticReportManager;