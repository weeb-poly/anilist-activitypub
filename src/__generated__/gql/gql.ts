/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n    query getActivity($id: Int!) {\n  Activity(id: $id) {\n    __typename\n    ... on TextActivity {\n      id\n      siteUrl\n    }\n    ... on ListActivity {\n      id\n      siteUrl\n    }\n    ... on MessageActivity {\n      id\n      siteUrl\n    }\n  }\n}\n    ": types.GetActivityDocument,
    "\n    query getUserPerson($id: Int!) {\n  User(id: $id) {\n    id\n    name\n    avatar {\n      large\n    }\n    bannerImage\n  }\n}\n    ": types.GetUserPersonDocument,
    "\n    query getUserFollowing($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    following(userId: $id) {\n      id\n    }\n  }\n}\n    ": types.GetUserFollowingDocument,
    "\n    query getUserFollowers($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    followers(userId: $id) {\n      id\n    }\n  }\n}\n    ": types.GetUserFollowersDocument,
    "\n    query getUserOutbox($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    activities(userId: $id, sort: ID_DESC) {\n      __typename\n      ... on TextActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on ListActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on MessageActivity {\n        id\n        siteUrl\n        createdAt\n      }\n    }\n  }\n}\n    ": types.GetUserOutboxDocument,
    "\n  query getUserPerson($id: Int!) {\n    User (id: $id) {\n      id\n      name\n      avatar {\n        large\n      }\n      bannerImage\n    }\n  }\n": types.GetUserPersonDocument,
    "\n  query getUserFollowing($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      following(userId: $id) {\n        id\n      }\n    }\n  }\n": types.GetUserFollowingDocument,
    "\n  query getUserFollowers($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      followers(userId: $id) {\n        id\n      }\n    }\n  }\n": types.GetUserFollowersDocument,
    "\n  query getUserOutbox($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      activities(\n        userId: $id,\n        sort: ID_DESC\n      ) {\n        __typename\n        ... on TextActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on ListActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on MessageActivity {\n          id\n          siteUrl\n          createdAt\n        }\n      }\n    }\n  }\n": types.GetUserOutboxDocument,
    "\n  query getUserWebFinger($id: Int!) {\n    User (id: $id) {\n      id\n      siteUrl\n    }\n  }\n": types.GetUserWebFingerDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getActivity($id: Int!) {\n  Activity(id: $id) {\n    __typename\n    ... on TextActivity {\n      id\n      siteUrl\n    }\n    ... on ListActivity {\n      id\n      siteUrl\n    }\n    ... on MessageActivity {\n      id\n      siteUrl\n    }\n  }\n}\n    "): (typeof documents)["\n    query getActivity($id: Int!) {\n  Activity(id: $id) {\n    __typename\n    ... on TextActivity {\n      id\n      siteUrl\n    }\n    ... on ListActivity {\n      id\n      siteUrl\n    }\n    ... on MessageActivity {\n      id\n      siteUrl\n    }\n  }\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getUserPerson($id: Int!) {\n  User(id: $id) {\n    id\n    name\n    avatar {\n      large\n    }\n    bannerImage\n  }\n}\n    "): (typeof documents)["\n    query getUserPerson($id: Int!) {\n  User(id: $id) {\n    id\n    name\n    avatar {\n      large\n    }\n    bannerImage\n  }\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getUserFollowing($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    following(userId: $id) {\n      id\n    }\n  }\n}\n    "): (typeof documents)["\n    query getUserFollowing($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    following(userId: $id) {\n      id\n    }\n  }\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getUserFollowers($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    followers(userId: $id) {\n      id\n    }\n  }\n}\n    "): (typeof documents)["\n    query getUserFollowers($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      hasNextPage\n    }\n    followers(userId: $id) {\n      id\n    }\n  }\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getUserOutbox($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    activities(userId: $id, sort: ID_DESC) {\n      __typename\n      ... on TextActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on ListActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on MessageActivity {\n        id\n        siteUrl\n        createdAt\n      }\n    }\n  }\n}\n    "): (typeof documents)["\n    query getUserOutbox($id: Int!, $page: Int) {\n  Page(page: $page) {\n    pageInfo {\n      total\n      currentPage\n      lastPage\n      hasNextPage\n    }\n    activities(userId: $id, sort: ID_DESC) {\n      __typename\n      ... on TextActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on ListActivity {\n        id\n        siteUrl\n        createdAt\n      }\n      ... on MessageActivity {\n        id\n        siteUrl\n        createdAt\n      }\n    }\n  }\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserPerson($id: Int!) {\n    User (id: $id) {\n      id\n      name\n      avatar {\n        large\n      }\n      bannerImage\n    }\n  }\n"): (typeof documents)["\n  query getUserPerson($id: Int!) {\n    User (id: $id) {\n      id\n      name\n      avatar {\n        large\n      }\n      bannerImage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserFollowing($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      following(userId: $id) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserFollowing($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      following(userId: $id) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserFollowers($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      followers(userId: $id) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserFollowers($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        hasNextPage\n      }\n      followers(userId: $id) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserOutbox($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      activities(\n        userId: $id,\n        sort: ID_DESC\n      ) {\n        __typename\n        ... on TextActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on ListActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on MessageActivity {\n          id\n          siteUrl\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserOutbox($id: Int!, $page: Int) {\n    Page(page: $page) {\n      pageInfo {\n        total\n        currentPage\n        lastPage\n        hasNextPage\n      }\n      activities(\n        userId: $id,\n        sort: ID_DESC\n      ) {\n        __typename\n        ... on TextActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on ListActivity {\n          id\n          siteUrl\n          createdAt\n        }\n        ... on MessageActivity {\n          id\n          siteUrl\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserWebFinger($id: Int!) {\n    User (id: $id) {\n      id\n      siteUrl\n    }\n  }\n"): (typeof documents)["\n  query getUserWebFinger($id: Int!) {\n    User (id: $id) {\n      id\n      siteUrl\n    }\n  }\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;