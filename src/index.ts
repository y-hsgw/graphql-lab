import {
  buildSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import express, { NextFunction, Request, Response } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import crypto from "crypto";

type User = {
  id: string;
  name: string;
};

const fakeUserDatabase: Record<string, User> = {
  a: {
    id: "a",
    name: "alice",
  },
  b: {
    id: "b",
    name: "bob",
  },
};

const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLList(userType),
      resolve: () => {
        return Object.values(fakeUserDatabase);
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { id }) => {
        return fakeUserDatabase[id];
      },
    },
    createUser: {
      type: userType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { name }) => {
        const id = crypto.randomBytes(10).toString("hex");
        fakeUserDatabase[id] = { id, name };
        return fakeUserDatabase[id];
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { name }) => {
        const id = crypto.randomBytes(10).toString("hex");
        fakeUserDatabase[id] = { id, name };
        return fakeUserDatabase[id];
      },
    },
  },
});

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
    ip: String
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
  ip(args: any, context: any) {
    return context.ip;
  },
};

function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("ip:", req.ip);
  next();
}

const graphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

const app = express();
app.use(loggingMiddleware);
app.all(
  "/graphql",
  createHandler({
    schema: graphQLSchema,
    rootValue,
    context: (req) => ({
      ip: req.raw.ip,
    }),
  })
);

const PORT = 4000;
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
