const resolvers = {
  Query: {
    hello: () => "Hello world!",
    groups: () => [
      { id: 1, title: "1" },
      { id: 2, title: "2" }
    ],
    // FIXME: how to define types?
    articleList: async (_: any, {}: any, { dataSources }: any) => {
      const articleList = await dataSources.article.getAllArticleList();
      return articleList;
    },
    getArticleByAid: async (
      _: any,
      { aid }: { aid: number },
      { dataSources }: any
    ) => {
      const articleInfo = await dataSources.article.getArticleByAid(aid);
      return articleInfo;
    },
    login: async (
      _: any,
      { account, pwd }: { [x: string]: string },
      { dataSources }: any
    ) => {
      return await dataSources.users.login(account, pwd);
    }
  },

  Mutation: {
    register: async (
      _: any,
      { account, pwd }: { [x: string]: string },
      { dataSources }: any
    ) => {
      return await dataSources.users.register(account, pwd);
    },
    // destroyAccount: async (
    //   _: any,
    //   { account, pwd }: { [x: string]: string },
    //   { dataSources }: any
    // ) => {
    //   return await dataSources.users.destroyAccount(account, pwd);
    // },
    createArticle: async (
      _: any,
      { type, title, description, content }: { [x: string]: string },
      { dataSources }: any
    ) => {
      return await dataSources.article.createArticle(
        type,
        title,
        description,
        content
      );
    },

    deleteArticle: async (
      _: any,
      { type, title, description, content }: { [x: string]: string },
      { dataSources }: any
    ) => {
      return await dataSources.article.deleteArticle({
        type,
        title,
        description,
        content
      });
    },

    updateArticle: async (
      _: any,
      { type, title, description, content }: { [x: string]: string },
      { dataSources }: any
    ) => {
      return await dataSources.article.updateArticle({
        type,
        title,
        description,
        content
      });
    }
  }
};

export default resolvers;
