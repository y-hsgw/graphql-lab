import { buildSchema } from "graphql";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import crypto from "crypto";

const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

class RandomDie {
  numSides: number;

  constructor(numSides: number) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }: { numRolls: number }) {
    const output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

type Input = { content: string; author: string };

class Message {
  id: string;
  content: string;
  author: string;

  constructor(id: string, { content, author }: Input) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

const fakeDatabase: Record<string, Input> = {};

const rootValue = {
  getMessage({ id }: { id: string }) {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage({ input }: { input: Input }) {
    const id = crypto.randomBytes(10).toString("hex");

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage({ id, input }: { id: string; input: Input }) {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
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
  getDie({ numSides }: { numSides: number }) {
    return new RandomDie(numSides || 6);
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
