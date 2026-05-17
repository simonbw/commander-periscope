import { describe, expect, it } from "vitest";
import { validateLobbyCode } from "./validation";

describe("validation", () => {
  it("validateLobbyCode", () => {
    expect(() => validateLobbyCode("")).toThrow();
    expect(() => validateLobbyCode("can't have spaces")).toThrow();
    expect(() => validateLobbyCode("asdf")).not.toThrow();
    expect(() => validateLobbyCode("PERISCOPE-7Q")).not.toThrow();
  });
});
