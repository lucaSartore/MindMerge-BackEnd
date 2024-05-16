const mongoose = require("mongoose");
const {TaskManager} = require("./task_manager.js");
const {TaskModel} = require("./database_manager.js");
const {Task} = require("../common_infrastructure/task.js");
const {Errors} = require("../common_infrastructure/errors.js");
const {TaskNote} = require("../common_infrastructure/task_note.js");
const {customResponse} = require("../common_infrastructure/response.js");
const TaskReportSchedule = require("../common_infrastructure/task_report_schedule.js");
const {TaskReportScheduleModel} = require("./database_manager.js");
const {TaskStatus} = require("../common_infrastructure/task_status.js");
const ReportType = require("../common_infrastructure/report_type.js");
const reportFrequency = require("../common_infrastructure/report_frequency.js");

describe('TEST TASK MANAGER', () => {

  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
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
});