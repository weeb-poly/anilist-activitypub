import { GraphQLClient } from 'graphql-request';

const AniListClient = new GraphQLClient("https://graphql.anilist.co", { fetch });

export { AniListClient };
