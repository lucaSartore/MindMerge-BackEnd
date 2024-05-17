const mongoose = require("mongoose");
const {Organization} = require("../common_infrastructure/organization.js");
const {OrganizationManager} = require("./organization_manager.js");

describe('TEST ORGANIZATION MANAGER', () => {

  let connection;
  let om;

  beforeAll( async () => {
    connection = await  mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
    om = new OrganizationManager();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });

  test('New Organization', async () => {
    let um = new OrganizationManager();
    const response = await um.createOrganization(
        new Organization(
            1,
            "Test &co",
            [1],
            true,
            Date.parse('2025-01-01'),
            1,
        )
    );
    expect(response.success).toBe(true);
    expect(response.data).toBeInstanceOf(Number);
  });

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
  });
});