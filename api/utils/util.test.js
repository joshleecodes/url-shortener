'use strict';
const util = require('./util');

describe("createURLPair", () => {
  it("should create linkedPair object", () => {
    expect(util.createURLPair("ABCD", "longlink.com")).toStrictEqual({
      short_link: "ABCD",
      long_link: "longlink.com"
    });
  });
  it("should fail to create linkedPair object", () => {
    expect(util.createURLPair(null, null)).toEqual(null);
    expect(util.createURLPair("ABCD", null)).toEqual(null);
    expect(util.createURLPair(null, "longlink.com")).toEqual(null);
  })
});

describe("validateLink", () => {
    it("should return URL object", () => {
        expect(util.validateLink("https://github.com/joshleecodes")).toEqual("https://github.com/joshleecodes")
    });
    it("should throw for an invalid url", () => {
        expect(() => util.validateLink("asduiobfasdo")).toThrow("invalid url");
    });
});

describe("checkIfActive", () => {
    it("should return sting 'link created'", async () => {
        const result = await util.checkIfActive("https://www.google.co.uk/");
        expect(result).toEqual("link created");
    });
    it("should return string 'Warning: link could be inactive'", async () => {
        const result = await util.checkIfActive("http://www.notactivelink.com/");
        expect(result).toEqual("Warning: link could be inactive")
    });
});