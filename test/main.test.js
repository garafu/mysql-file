const path = require("path");
const { sql, sqlAsync: hoge, sqlSync } = require("../lib/index")({ root: path.join(__dirname, "./data") });

describe("sql() method", () => {
  it("load sql file", async () => {
    var result = await sql("SIMPLE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load hypehn commented sql file", async () => {
    var result = await sql("COMMENT_HYPHEN");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load multi-line commented sql file", async () => {
    var result = await sql("COMMENT_MULTILINE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

});

describe("sqlSync() method", () => {
  it("load sql file", () => {
    var result = sqlSync("SIMPLE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load hypehn commented sql file", async () => {
    var result = sqlSync("COMMENT_HYPHEN");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

  it("load multi-line commented sql file", async () => {
    var result = sqlSync("COMMENT_MULTILINE");
    expect(result).toBe("SELECT id, name, dob FROM t_user WHERE id=?");
  });

});
