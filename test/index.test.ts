import { describe, expect, it } from "vitest";
import { initI18n } from "../src";
import en from "./en";
import es from "./es";

const t = initI18n({
  locale: "en",
  translations: { en, es },
  fallback: "en",
});

describe("Voxnova", () => {
  it("should return messages with no params", () => {
    expect(t("simple")).toBe(en.simple);
    expect(t("complex.message")).toBe(en.complex.message);
  });

  it("should return messages with variable params", () => {
    expect(t("variable", { name: "John" })).toBe(
      en.variable.replace("{name}", "John"),
    );
  });

  it("should return messages with plural params", () => {
    expect(t("plural", { messages: 0 })).toBe(
      en.plural[0].replace("{messages:plural}", "0 messages"),
    );
    expect(t("plural", { messages: 1 })).toBe(
      en.plural[0].replace("{messages:plural}", "1 message"),
    );
    expect(t("plural", { messages: 2 })).toBe(
      en.plural[0].replace("{messages:plural}", "2 messages"),
    );
  });

  it("should return messages with number params", () => {
    expect(t("number", { price: 12 })).toBe(
      en.number[0].replace("{price:number}", "$12.00"),
    );
    expect(t("number", { price: 12.12 })).toBe(
      en.number[0].replace("{price:number}", "$12.12"),
    );
    expect(t("number", { price: 12.129 })).toBe(
      en.number[0].replace("{price:number}", "$12.13"),
    );
  });

  it("should return messages with date params", () => {
    expect(t("date", { lastPurchase: new Date("2000-01-01T12:00:00Z") })).toBe(
      en.date[0].replace("{lastPurchase:date}", "Jan 1, 2000"),
    );
  });
});
