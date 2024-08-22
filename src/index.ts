import { buildSchema } from "graphql";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";

const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int],
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const rootValue = {
  quoteOfTheDay() {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random() {
    return Math.random();
  },
  rollThreeDice() {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
  },
  rollDice(args: { numDice: number; numSides: number }) {
    const output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  },
};

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue,
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
