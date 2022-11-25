import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql.anilist.co",
  generates: {
    "./schemas/anilist.graphql": {
      plugins: ["schema-ast"]
    },
    "./src/__generated__/sdk.ts": {
      documents: [
        "src/gql/**/*.gql"
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request"
      ],
      config: {
        avoidOptionals: true
      }
    }
  }
};

export default config;
