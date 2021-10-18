'use strict';
const linksController = require('./linksController');
const db = require("../services/db");
const { query } = require("mysql");

jest.mock("../services/db");

describe("isUniqueCode", () => {
    

    db.getConnection.mockImplementation(() => {
        return;
    });

    query.mockImplementation((code) => {
        const existingCode = 'ABCD';
        if (!code === existingCode) {
            return true;
        }
        return false;
    });

    it("should return true when provided with a unique code", () => {
        expect(linksController.isUniqueCode('ABC')).toBe(true);
    });
    it("should return false when provided with an existing code", () => {
        expect(linksController.isUniqueCode('ABCD')).toBe(false);
    });
});

describe("generateShortLink", () => {
    it("should return short link - intially unique", () => {

    });
    it("should return short link - intially unique", () => {

    });
    it("should throw with 'failed to generate code' message", () => {

    });
});

describe("createLinkController", () => {
    it("should respond with an OK status including the new link with feedback", () => {

    });
    it("should respond with a 400 status with 'invalid url' message", () => {

    });
    it("should respond with a 500 status with 'Server Error: Bad Query' message", () => {

    });
});

describe("redirectLinkController", () => {
    it("should redirect to the corresponding external link", () => {

    });
    it("should respond with a 404 not found with 'Link Not Found' message", () => {

    });
    it("should respond with a 500 status with 'Server Error: Bad Query' message", () => {

    });
})