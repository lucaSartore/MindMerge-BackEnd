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

    result = await om.addUserToOrganization(2, 2);
    expect(result.statusCode).toBe(Errors.NOT_FOUND);

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

    expect(newOrganization.payload).toStrictEqual(organization);
  });
});