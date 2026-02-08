import { dt, type LanguageMessages } from "../src";

export default {
  simple: "Simple message",
  complex: {
    message: "Complex message",
  },
  variable: "Hello, {name}!",
  plural: dt("You have {messages:plural}", {
    plural: {
      messages: { one: "1 message", other: "{?} messages" },
    },
  }),
  number: dt("The cost of this is {price:number}", {
    number: { price: { style: "currency", currency: "USD" } },
  }),
  date: dt("Your last purchase was on {lastPurchase:date}", {
    date: { lastPurchase: { dateStyle: "medium" } },
  }),
  list: dt("Your favourite foods are: {foods:list}", {
    list: { foods: { type: "conjunction" } },
  }),
} as const satisfies LanguageMessages;
