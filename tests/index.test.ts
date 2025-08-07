import { describe, it, expect } from "bun:test";
import { assert } from "nlcst-test";

import { ParseChinese } from "../lib";

const chinese = new ParseChinese();

describe("ParseChinese", async function () {
  it("should parse a string", function () {
    const result = chinese.parse("一人得道，鸡犬升天");
    assert(result);
  });
});
