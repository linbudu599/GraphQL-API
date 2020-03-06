import "reflect-metadata";
import Koa, { Context } from "koa";
import { ApolloServer } from "apollo-server-koa";
// import typeDefs from "../schema";
import { UserResolver } from "../resolver/userResolver";
import { ArticleResolver } from "../resolver/articleResolver";

// import resolvers from "../temp/index-resolver";

// import ArticleModel from "../model/Article";
// import ArticleAPI from "../datasources/ArticleAPI";

// import UserModel from "../model/User";
// import UserAPI from "../datasources/UserAPI";

import { buildSchema } from "type-graphql";

async function initialize() {
  const schema = await buildSchema({
    resolvers: [UserResolver, ArticleResolver]
  });
  const server = new ApolloServer({
    context: async ({ req }: Context) => {},
    schema,
    // typeDefs,
    // resolvers,
    // dataSources: () => ({
    //   // FIXME: fix type error, maybe by .d.ts
    //   // @ts-ignore
    //   article: new ArticleAPI<any>(ArticleModel),
    //   // @ts-ignore
    //   users: new UserAPI<any>(UserModel)
    // }),
    tracing: true
  });

  // there is no router! just one url with various query schema
  const app = new Koa();
  // koa-mount works as well
  server.applyMiddleware({ app });

  app.listen({ port: 4001 }, () =>
    console.log(`Server ready at http://localhost:4001/graphql`)
  );
}

initialize();
