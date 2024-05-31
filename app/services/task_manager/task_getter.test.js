const mongoose = require("mongoose");
const {TaskManager} = require("../../database_manager/task_manager.js");
const {TaskModel} = require("../../database_manager/database_manager.js");
const {Task} = require("../../common_infrastructure/task.js");
const {Errors} = require("../../common_infrastructure/errors.js");
const {TaskStatus} = require("../../common_infrastructure/task_status.js");
const {ReportType} = require("../../common_infrastructure/report_type.js");
const {reportFrequency} = require("../../common_infrastructure/report_frequency.js");
const {TaskGetter} = require("./task_getter.js");
const { TaskTree } = require("../../common_infrastructure/task_tree.js");

describe('TEST TASK GETTER', () => {

  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    // console.log("Database connection closed");
  });

  test('test get task tree', async () => {
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
            "a",
            "a",
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
     * 
     * 7
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
    // task 7
    await create_task(null,[]);

    let r = await tg.getSingleTaskTree(1,1);
    expect(r.statusCode).toBe(Errors.OK);

    let expected = new TaskTree(1,"a");
    let tmp = new TaskTree(3, "a");
    tmp.childTasks.push(new TaskTree(4, "a"));
    tmp.childTasks.push(new TaskTree(5, "a"));
    tmp.childTasks.push(new TaskTree(6, "a"));

    expected.childTasks.push(new TaskTree(2, "a"));
    expected.childTasks.push(tmp);
    
    expect(r.payload).toStrictEqual(expected);


    r = await tg.getSingleTaskTree(1,7);
    expect(r.statusCode).toBe(Errors.OK);

    let expected2 = new TaskTree(7, "a");
    
    expect(r.payload).toStrictEqual(expected2);

    let expected3 = [expected,expected2];

    r = await tg.getTasksForUser(1,1,"");
    expect(r.statusCode).toBe(Errors.OK);
    expect(r.payload).toStrictEqual(expected3);
    
   });


});