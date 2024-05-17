const mongoose = require("mongoose");
const {TaskManager} = require("./task_manager.js");
const {TaskModel} = require("./database_manager.js");
const {Task} = require("../common_infrastructure/task.js");
const {Errors} = require("../common_infrastructure/errors.js");
const {TaskNote} = require("../common_infrastructure/task_note.js");
const {customResponse} = require("../common_infrastructure/response.js");
const {TaskReportSchedule} = require("../common_infrastructure/task_report_schedule.js");
const {TaskReportScheduleModel} = require("./database_manager.js");
const {TaskStatus} = require("../common_infrastructure/task_status.js");
const {ReportType} = require("../common_infrastructure/report_type.js");
const {reportFrequency} = require("../common_infrastructure/report_frequency.js");

describe('TEST TASK MANAGER', () => {

  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    // console.log("Database connection closed");
  });

  test('task successful creation', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();

    let date = new Date();

    let task = new Task(
      1,
      null,
      1,
      date,
      "Task 1",
      "Task 1 description",
      TaskStatus.Idea,
      [],
      [1],
      1,
      [],
      false,
      [],
      0
    );

    let result = await tm.createTask(1, task);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(1);

    task.taskName += "2";
    result = await tm.createTask(1, task);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(2);

    task.taskName += "3";
    result = await tm.createTask(1, task);
    expect(result.statusCode).toBe(Errors.OK);
    expect(result.payload).toBe(3);

    task = await TaskModel.findOne({ taskId: 1 });
    expect(task.taskName).toBe("Task 1");
    expect(task.taskOrganizationId).toBe(1);
    expect(task.taskStatus).toBe(TaskStatus.Idea);
    expect(task.taskAssignees).toStrictEqual([1]);
    expect(task.taskManager).toBe(1);
    expect(task.lastUpdated).toStrictEqual(date);

    task = await TaskModel.findOne({ taskId: 2 });
    expect(task.taskName).toBe("Task 12");

    task = await TaskModel.findOne({ taskId: 3 });
    expect(task.taskName).toBe("Task 123");

  });



  test('task creation bad request ', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();


    let new_task = () => {
      return new Task(
        1,
        null,
        1,
        new Date(),
        "Task 1",
        "Task 1 description",
        TaskStatus.Idea,
        [],
        [1],
        1,
        [],
        false,
        [],
        0
      );
    };

    let test_task = new_task();
    let result = await tm.createTask(1, test_task);
    expect(result.statusCode).toBe(Errors.OK);

    test_task = new_task();
    test_task.taskAssignees = undefined;
    result = await tm.createTask(1, test_task);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    test_task = new_task();
    test_task.taskAssignees = "1";
    result = await tm.createTask(1, test_task);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    test_task = new_task();
    test_task.taskStatus = undefined;
    result = await tm.createTask(1, test_task);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);


    test_task = new_task();
    test_task.taskAssignees = [1, "2"];
    result = await tm.createTask(1, test_task);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

  });

  test('task notes successful creation', async () => {

    await TaskModel.deleteMany({});

    let tm = new TaskManager();
    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTask(1, new Task(2, null, 1, new Date(), "Task 2", "Task 2 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);
    

    result = await tm.createTaskNotes(1,1,"notes for task 1");
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskNotes(1,2,"notes for task 2");
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskNotes(1,1,"second notes for task 1");
    expect(result.statusCode).toBe(Errors.OK);

    let task = await TaskModel.findOne({ taskId: 1 });
    expect(task.taskNotes.length).toBe(2);
    expect(task.taskNotes[0].notes).toBe("notes for task 1");
    expect(task.taskNotes[0].noteId).toBe(1);
    expect(task.taskNotes[1].notes).toBe("second notes for task 1");
    expect(task.taskNotes[1].noteId).toBe(2);
    

    task = await TaskModel.findOne({ taskId: 2 });
    expect(task.taskNotes.length).toBe(1);
    expect(task.taskNotes[0].notes).toBe("notes for task 2");
    expect(task.taskNotes[0].noteId).toBe(1);
    // 5 seconds margin to account for the execution time of the test
    expect(new Date() - task.taskNotes[0].date).toBeLessThan(5000);

  });

  test('task notes bad request', async () => {
    
    await TaskModel.deleteMany({});

    tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskNotes(1,2,"error note");
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

    result = await tm.createTaskNotes("",1,"notes for task 1");
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskNotes(1,"",undefined);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskNotes(1,1,1);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);
  });

  test('task report schedule successful creation', async () => {

    await TaskModel.deleteMany({});

    let tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTask(1, new Task(2, null, 1, new Date(), "Task 2", "Task 2 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,1,ReportType.Manual,reportFrequency.Daily,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskReportSchedule(1,2,new TaskReportSchedule(2,1,ReportType.Automatic,reportFrequency.Weekly,new Date(),"How are you feeling this week?"));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,2,ReportType.Manual,reportFrequency.Daily,new Date(),"How are you feeling now?"));
    expect(result.statusCode).toBe(Errors.OK);

    let task = await TaskModel.findOne({ taskId: 1 });
    expect(task).not.toBeNull();

    expect(task.taskReports.length).toBe(2);
    expect(task.taskReports[0].reportPrompt).toBe("How are you feeling today?");
    expect(task.taskReports[0].reportScheduleId).toBe(1);
    expect(task.taskReports[0].reportType).toBe(ReportType.Manual);
    expect(task.taskReports[0].reportFrequency).toBe(reportFrequency.Daily);
    expect(new Date() - task.taskReports[0].nextReportDate).toBeLessThan(5000);

    expect(task.taskReports[1].reportPrompt).toBe("How are you feeling now?");

    task = await TaskModel.findOne({ taskId: 2 });
    expect(task.taskReports.length).toBe(1);
    expect(task.taskReports[0].reportPrompt).toBe("How are you feeling this week?");
  });

  test('task report schedule bad request', async () => {
    await TaskModel.deleteMany({});

    tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTaskReportSchedule(1,2,new TaskReportSchedule(1,1,ReportType.Manual,reportFrequency.Daily,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

    result = await tm.createTaskReportSchedule("",1,new TaskReportSchedule(1,1,ReportType.Manual,reportFrequency.Daily,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskReportSchedule(1,"",new TaskReportSchedule(1,1,ReportType.Manual,reportFrequency.Daily,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskReportSchedule(1,1,"error report");
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,1,null,reportFrequency.Daily,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,1,ReportType.Manual,null,new Date(),"How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,1,ReportType.Manual,null,"2020","How are you feeling today?"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);
  
    result = await tm.createTaskReportSchedule(1,1,new TaskReportSchedule(1,1,ReportType.Manual,null,new Date(),11));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);
  });


  test('task successful update', async () => {

    await TaskModel.deleteMany({});

    let tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.createTask(1, new Task(2, null, 1, new Date(), "Task 2", "Task 2 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.updateTask(1,1,new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.updateTask(1,2,new Task(2, null, 1, new Date(), "Task 2 updated", "Task 2 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    let task = await TaskModel.findOne({ taskId: 1 });
    expect(task.taskName).toBe("Task 1 updated");
    expect(task.taskDescription).toBe("Task 1 description updated");
    expect(task.taskStatus).toBe(TaskStatus.InProgress);

    task = await TaskModel.findOne({ taskId: 2 });

    expect(task.taskName).toBe("Task 2 updated");
    expect(task.taskDescription).toBe("Task 2 description updated");
  });


  test('task update bad request', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.updateTask(1,2,new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

    result = await tm.updateTask("",1,new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.updateTask(1,"",new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.updateTask(1,1,"error task");
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.updateTask(1,1,new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], "0"));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await tm.updateTask(1,1,new Task(1, null, 1, new Date(), "Task 1 updated", "Task 1 description updated", TaskStatus.InProgress, [], [1], 1, [], false, [], []));
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);
  });

  test('test successful update last task update', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    let task = await TaskModel.findOne({ taskId: 1 });
    expect(task).not.toBeNull();
    let firstDate = task.lastUpdated;

    await new Promise(r => setTimeout(r, 50));

    result = await tm.updateTaskLastUpdated(1,1);
    expect(result.statusCode).toBe(Errors.OK);

    task = await TaskModel.findOne({ taskId: 1 });
    expect(task).not.toBeNull();
    let secondDate = task.lastUpdated;

    expect(secondDate-firstDate).toBeGreaterThan(49);
    expect(secondDate-firstDate).toBeLessThan(5000);

  });


  test('test not found update last task update', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();

    await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));

    let result = await tm.updateTaskLastUpdated(1,2);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

    result = await tm.updateTaskLastUpdated(2,2);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

    result = await tm.updateTaskLastUpdated(2,1);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

  });


  test('test successful update task name' , async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();

    let result = await tm.createTask(1, new Task(1, null, 1, new Date(), "Task 1", "Task 1 description", TaskStatus.Idea, [], [1], 1, [], false, [], 0));
    expect(result.statusCode).toBe(Errors.OK);

    result = await tm.updateTaskName(1,1,"Task 1 updated");
    expect(result.statusCode).toBe(Errors.OK);

    let task = await TaskModel.findOne({ taskId: 1 });
    expect(task).not.toBeNull();
    expect(task.taskName).toBe("Task 1 updated");
  });
});