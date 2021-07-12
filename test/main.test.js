const path = require("path");
const { sql } = require("../index")({ root: path.join(__dirname, "./data") });

describe("sql() method", () => {
  it("load sql file", () => {
    var result = sql("SIMPLE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load hypehn commented sql file", () => {
    var result = sql("COMMENT_HYPHEN");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load multi-line commented sql file", () => {
    var result = sql("COMMENT_MULTILINE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

});
