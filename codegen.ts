
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql.anilist.co",
  documents: [ "src/**/*.ts", "!src/gql/**/*" ],
  generates: {
    "./src/gql/": {
      preset: "gql-tag-operations-preset",
      plugins: []
    },
    "anilist.graphql": {
      plugins: ["schema-ast"]
    }
  }
};

export default config;
