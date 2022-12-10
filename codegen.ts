import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql.anilist.co",
  generates: {
    "./schemas/anilist.graphql": {
      plugins: ["schema-ast"]
    },
    "./src/__generated__/gql/": {
      documents: [
        "src/**/*.ts",
        "!src/__generated__/gql/**/*"
      ],
      preset: 'gql-tag-operations-preset',
      plugins: [],
      config: {
        avoidOptionals: true
      }
    }
  }
};

export default config;
