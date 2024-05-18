const mongoose = require("mongoose");
const {Organization} = require("../common_infrastructure/organization.js");
const {OrganizationManager} = require("./organization_manager.js");
const {OrganizationModel} = require("./database_manager.js");
const {Errors} = require("../common_infrastructure/errors.js");

describe('TEST ORGANIZATION MANAGER', () => {


  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });

  test('New Organization, success', async () => {
    await OrganizationModel.deleteMany({});
    let om = new OrganizationManager();

    let date = new Date();

    const response = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            true,
            date,
            1,
        )
    );

    expect(response.statusCode).toBe(Errors.OK);
    expect(response.payload).toBe(1);

    let organization = await OrganizationModel.findOne({organizationId: 1});
    expect(organization).not.toBeNull();

    expect(organization.organizationId).toBe(1);
    expect(organization.organizationName).toBe("Test &co");
    expect(organization.userIds).toStrictEqual([1]);
    expect(organization.licenseValid).toBe(true);
    expect(organization.licenseExpirationDate).toStrictEqual(date);
    expect(organization.ownerId).toBe(1);

  });

  test('New Organization, invalid organization', async () => {
    let om = new OrganizationManager();

    let response = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            ['ddd'],
            true,
            new Date(),
            1
        )
    );

    expect(response.statusCode).toBe(Errors.BAD_REQUEST);
    
    response = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            'true',
            new Date(),
            1
        )
    );
    expect(response.statusCode).toBe(Errors.BAD_REQUEST);

    response = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            true,
            'date',
            1
        )
    );
    expect(response.statusCode).toBe(Errors.BAD_REQUEST);

  })


  test('Add User to Organization, success', async () => {

    await OrganizationModel.deleteMany({});
    let om = new OrganizationManager();

    let result = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            true,
            new Date(),
            1
        )
    ); 
    expect(result.statusCode).toBe(Errors.OK);


    result = await om.addUserToOrganization(1, 2);
    expect(result.statusCode).toBe(Errors.OK);

    let organization = await OrganizationModel.findOne({organizationId: 1});
    expect(organization).not.toBeNull();
    expect(organization.userIds).toStrictEqual([1, 2]);


  });


  test('unsuccessful add user to organization', async () => {

    await OrganizationModel.deleteMany({});

    let om = new OrganizationManager();

    let result = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            true,
            new Date(),
            1
        )
    );
    
    result = await om.addUserToOrganization(1, 2);
    expect(result.statusCode).toBe(Errors.OK);

    result = await om.addUserToOrganization(1, '2');
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await om.addUserToOrganization(1, 1);
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

  });


  test('update license', async () => {
    await OrganizationModel.deleteMany({});

    let om = new OrganizationManager();

    let result = await om.createOrganization(
        new Organization(
            2,
            "Test &co",
            [1],
            true,
            new Date(),
            1
        )
    );
    expect(result.statusCode).toBe(Errors.OK);

    result = await om.updateLicense(1, false);
    expect(result.statusCode).toBe(Errors.OK);

    let organization = await OrganizationModel.findOne({organizationId: 1});
    expect(organization).not.toBeNull();
    expect(organization.licenseValid).toBe(false);

    result = await om.updateLicense(1,true);
    expect(result.statusCode).toBe(Errors.OK);

    organization = await OrganizationModel.findOne({organizationId: 1});
    expect(organization).not.toBeNull();
    expect(organization.licenseValid).toBe(true);


    // non successful insert
    result = await om.updateLicense(1, 'false');
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await om.updateLicense(2,true);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

  });

  test('update license expiration date', async () => {

    await OrganizationModel.deleteMany({});
    let om = new OrganizationManager();

    let result = await om.createOrganization(
      new Organization(
        2,
        "Test &co",
        [1],
        true,
        new Date(),
        1
      ));
    expect(result.statusCode).toBe(Errors.OK);

    let date = new Date();
    result = await om.updateLicenseExpirationDate(1, date);
    expect(result.statusCode).toBe(Errors.OK);

    let organization = await OrganizationModel.findOne({organizationId: 1});
    expect(organization).not.toBeNull();
    expect(organization.licenseExpirationDate).toStrictEqual(date);

    // non successful insert

    result = await om.updateLicenseExpirationDate(1, 'date');
    expect(result.statusCode).toBe(Errors.BAD_REQUEST);

    result = await om.updateLicenseExpirationDate(2, date);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

  });

  test('read organization', async () => {
    await OrganizationModel.deleteMany({});
    let om = new OrganizationManager();

    let organization = new Organization(
      1,
      "Test &co",
      [1],
      true,
      new Date(),
      1
    );

    let result = await om.createOrganization(organization);

    let newOrganization = await om.readOrganization(1);
    expect(newOrganization.statusCode).toBe(Errors.OK);

    expect(newOrganization.payload.organizationId).toBe(organization.organizationId);

  });

  /*
  test('createOrganization with invalid organization', async () => {

    const org = new Organization(
      null,
      null,
      null,
      null,
      null,
      null
    );
    const response = await om.createOrganization(org);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid organization");
  });

  test('Add User to Organization', async () => {
    const response = await om.addUserToOrganization(1, 1);
    expect(response.success).toBe(true);
    expect(response.data).toBe(1);
  });

  test('addUserToOrganization with invalid IDs', async () => {
    const response = await om.addUserToOrganization(null, null);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });

  test('Update License', async () => {
    const response = await om.updateLicense(1, false);
    expect(response.success).toBe(true);
    expect(response.data).toBe(false);
  });

  test('updateLicense with invalid ID', async () => {
    const response = await om.updateLicense(null, false);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });

  test('Update License Expiration Date', async () => {
    const response = await om.updateLicenseExpirationDate(1, Date.parse('2025-01-01'));
    expect(response.success).toBe(true);
    expect(response.data).toBe(Date.parse('2025-01-01'));
  });

  test('updateLicenseExpirationDate with invalid ID or date', async () => {
    const response = await om.updateLicenseExpirationDate(null, 'invalid date');
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });

  test('Delete Organization', async () => {
    const response = await om.deleteOrganization(1);
    expect(response.success).toBe(true);
    expect(response.data).toBe(1);
  });

  test('deleteOrganization with invalid ID', async () => {
    const response = await om.deleteOrganization(null);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });

  test('removeUserFromOrganization with valid IDs', async () => {
    const response = await om.removeUserFromOrganization(1, 1);
    expect(response.success).toBe(true);
    expect(response.data).toBeUndefined();
  });

  test('removeUserFromOrganization with invalid IDs', async () => {
    const response = await om.removeUserFromOrganization(null, null);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });

  test('readOrganization with valid ID', async () => {
    const response = await om.readOrganization(1);
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('readOrganization with invalid ID', async () => {
    const response = await om.readOrganization(null);
    expect(response.success).toBe(false);
    expect(response.error).toBe(Errors.BAD_REQUEST);
    expect(response.message).toBe("Invalid Organization Id");
  });*/
});