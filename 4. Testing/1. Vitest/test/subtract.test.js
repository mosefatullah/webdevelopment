import { expect, test } from "vitest";
import { subtract } from "./src/subtract";

test("subtracts 1 - 2 to equal -1", () => {
 expect(subtract(1, 2)).toBe(-1);
});
