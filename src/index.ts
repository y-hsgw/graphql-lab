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
    ip: {
      type: GraphQLString,
      resolve: (_, args, context: { ip: string }) => {
        return context.ip;
      },
    },
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
    context: (req) => ({
      ip: req.raw.ip,
    }),
  })
);

const PORT = 4000;
app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
