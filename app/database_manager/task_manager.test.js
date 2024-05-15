import mongoose from "mongoose";
import TaskManager from "./task_manager.js";
import Task from "../common_infrastructure/task.js";
import TaskReportSchedule from "../common_infrastructure/task_report_schedule.js";
import TaskNote from "../common_infrastructure/task_note.js";
import TaskStatus from "../common_infrastructure/task_status.js";
import ReportType from "../common_infrastructure/report_type.js";
import reportFrequency from "../common_infrastructure/report_frequency.js";

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