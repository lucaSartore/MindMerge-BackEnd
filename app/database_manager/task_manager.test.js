const mongoose = require("mongoose");
const TaskManager = require("./task_manager.js");
const Task = require("../common_infrastructure/task.js");
const TaskReportSchedule = require("../common_infrastructure/task_report_schedule.js");
const TaskNote = require("../common_infrastructure/task_note.js");
const TaskStatus = require("../common_infrastructure/task_status.js");
const ReportType = require("../common_infrastructure/report_type.js");
const reportFrequency = require("../common_infrastructure/report_frequency.js");

describe('TEST TASK MANAGER', () => {

  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll(() => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('task creation', async () => {
    let tm = new TaskManager();
    await tm.createTask(
      1,
      new Task(
        1,
        null,
        1,
        Date.now(),
        "Example task",
        "Example description",
        TaskStatus.Deployed,
        [],
        1,
        1,
        [],
        false,
        [],
        0
      )
    );
  });
});