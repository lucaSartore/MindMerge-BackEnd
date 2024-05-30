const mongoose = require("mongoose");
const {TaskManager} = require("../../database_manager/task_manager.js");
const {TaskModel} = require("./database_manager.js");
const {Task} = require("../common_infrastructure/task.js");
const {Errors} = require("../common_infrastructure/errors.js");
const {TaskStatus} = require("../common_infrastructure/task_status.js");
const {ReportType} = require("../common_infrastructure/report_type.js");
const {reportFrequency} = require("../common_infrastructure/report_frequency.js");
const {TaskGetter} = require("./task_getter.js");
const { TaskTree } = require("../../common_infrastructure/task_tree.js");

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

  test('', async () => {
    await TaskModel.deleteMany({});
    let tm = new TaskManager();
    let tg = new TaskGetter();

    let date = new Date();

    const create_task = async (father,children) => {
        let t = new Task(
            1,
            father,
            1,
            new Date(),
            "",
            "",
            TaskStatus.Idea,
            [],
            [1],
            1,
            [],
            false,
            children,
            0
        );

        let r = await tm.createTask(1,t);

        expect(r.statusCode).toBe(Errors.OK);
    }

    /**
     * 1 --- 2
     * | 
     * | --- 3 --- 4
     *       |
     *       | --- 5
     *       |
     *       | --- 6
     */

    // task 1
    await create_task(null,[2,3]);
    // task 2
    await create_task(1,[]);
    // task 3
    await create_task(1,[4,5,6]);
    // task 4
    await create_task(3,[]);
    // task 5
    await create_task(3,[]);
    // task 6
    await create_task(3,[]);

    let r = await tg.getSingleTaskTree(1);
    expect(r.statusCode).toBe(Errors.OK);

    // let expected = new TaskTree(2);
    // let tmp = 
    
   });


});