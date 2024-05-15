const mongoose = require("mongoose");
const {TaskManager} = require("./task_manager.js");
const {TaskModel} = require("./database_manager.js");
const {Task} = require("../common_infrastructure/task.js");
const {Errors} = require("../common_infrastructure/errors.js");
const {customResponse} = require("../common_infrastructure/response.js");
const TaskReportSchedule = require("../common_infrastructure/task_report_schedule.js");
const {TaskReportScheduleModel} = require("./database_manager.js");
const TaskNote = require("../common_infrastructure/task_note.js");
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

  test('task creation', async () => {
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
});