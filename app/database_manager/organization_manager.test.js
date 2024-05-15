const mongoose = require("mongoose");
const Organization = require("../common_infrastructure/organization.js");
const OrganizationManager = require("./organization_manager.js");

describe('TEST 1', () => {

  let connection;

  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('New Organization', async () => {
    let um = new OrganizationManager();
    await um.createOrganization(
        new Organization(
            1,
            "Test &co",
            [1],
            true,
            Date.parse('2025-01-01'),
            1
        )
    );
  });
});