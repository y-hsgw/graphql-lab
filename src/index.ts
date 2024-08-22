import { graphql, buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello() {
    return "Hello world!";
  },
};

graphql({
  schema,
  source: "{ hello }",
  rootValue,
}).then((response) => {
  console.log(response);
});
