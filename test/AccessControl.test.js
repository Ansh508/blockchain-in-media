const { expect } = require("chai");
const AccessControl = artifacts.require("AccessControl");

contract("AccessControl", (accounts) => {
    let accessControl;
    const [owner, admin, creator, user] = accounts;

    beforeEach(async () => {
        // Deploy the contract before each test
        accessControl = await AccessControl.new();
    });

    describe("Ownership", () => {
        it("should set the owner as the default admin", async () => {
            const isAdmin = await accessControl.isAdmin(owner);
            expect(isAdmin).to.be.true;
        });

        it("should allow the owner to add a new admin", async () => {
            await accessControl.addAdmin(admin);
            const isAdmin = await accessControl.isAdmin(admin);
            expect(isAdmin).to.be.true;
        });

        it("should not allow a non-owner to add an admin", async () => {
            try {
                await accessControl.addAdmin(admin, { from: user });
                assert.fail("Expected error not received");
            } catch (error) {
                expect(error.message).to.include("Ownable: caller is not the owner");
            }
        });

        it("should allow the owner to remove an admin", async () => {
            await accessControl.addAdmin(admin);
            await accessControl.removeAdmin(admin);
            const isAdmin = await accessControl.isAdmin(admin);
            expect(isAdmin).to.be.false;
        });
    });

    describe("Content Creators", () => {
        it("should allow admins to add content creators", async () => {
            await accessControl.addAdmin(admin);
            await accessControl.addContentCreator(creator, { from: admin });
            const isCreator = await accessControl.isContentCreator(creator);
            expect(isCreator).to.be.true;
        });

        it("should not allow non-admins to add content creators", async () => {
            try {
                await accessControl.addContentCreator(creator, { from: user });
                assert.fail("Expected error not received");
            } catch (error) {
                expect(error.message).to.include("AccessControl: Caller is not an admin");
            }
        });

        it("should allow admins to remove content creators", async () => {
            await accessControl.addAdmin(admin);
            await accessControl.addContentCreator(creator, { from: admin });
            await accessControl.removeContentCreator(creator, { from: admin });
            const isCreator = await accessControl.isContentCreator(creator);
            expect(isCreator).to.be.false;
        });
    });
});
