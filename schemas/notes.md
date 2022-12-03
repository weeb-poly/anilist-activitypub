# Limitations

There are "limitations" of AniList as well as the AniList API which prevent us from implementing the full ActivityPub spec.

AniList wasn't designed for ActivityPub, so it kinda makes sense.

## Activities

To make things less confusing:
 - ActivityPub/ActivityStreams Activities -> "Actions"
 - AniList Activities -> "StatusUpdates"

Most "Actions" (the exact moment that you `Like`, `Follow` `Edit`, etc) can't be accessed via the AniList API.

This is probably because AniList wasn't made to sync with other instances like this.

## Text Blurbs

Most blurbs of text don't actually interop well.

- AniList's `User.about` is a lot richer than ActivityPub's `Person.summary` (this is not a good thing)
- AniList's `TextActivity` is a lot longer than ActivityPub's `Note` (no cap afaik)
- AniList's `MessageActivity` is confusing when compared to how ActivityPub handles the same behavior

## Replies

AniList's `ActivityReply` isn't treated as an Activity (no reply threads or anything like that). This makes some sense, but is really annoying when trying to get all user activity.

# Suggestions

I have no idea of the complexity of the AniList backend. These are just my suggestions to make things easier for me (and specifically me).

## `interface Activity`

Creating an `interface` for all `Activity` types makes it a lot easier to query common attributes without needing to resolve types.

```graphql
"""Activity interface Type"""
interface ActivityInterface {
  """The time the activity was created at"""
  createdAt: Int!

  """The id of the activity"""
  id: Int!

  """If the currently authenticated user liked the activity"""
  isLiked: Boolean

  """If the activity is locked and can receive replies"""
  isLocked: Boolean

  """If the currently authenticated user is subscribed to the activity"""
  isSubscribed: Boolean

  """The amount of likes the activity has"""
  likeCount: Int!

  """The users who liked the activity"""
  likes: [User]

  """The written replies to the activity"""
  replies: [ActivityReply]

  """The number of activity replies"""
  replyCount: Int!

  """The url for the activity page on the AniList website"""
  siteUrl: String

  """The type of the activity"""
  type: ActivityType
}

// ...

type TextActivity implements Activity { /* ... */ }
type ListActivity implements Activity { /* ... */ }
type MessageActivity implements Activity { /* ... */ }
```

```graphql
// We can change this:
query getActivityOld($id: Int!) {
  Activity(id: $id) {
    __typename
    ... on TextActivity {
      id
      siteUrl
    }
    ... on ListActivity {
      id
      siteUrl
    }
    ... on MessageActivity {
      id
      siteUrl
    }
  }
}

// To this:
query getActivityNew($id: Int!) {
  Activity(id: $id) {
    __typename
    ... on Activity {
      id
      siteUrl
    }
  }
}
```


## `Page.activities(min_id: 0)`

Adding something like `id_lesser` or `min_id` to `Page.activities` would reduce potential race conditions (at least on my end) since activityId's seem to be ascending.

## `Page.activityReplies(userId: 1)`

This is specific to my use-case, but the inability to search for ActivityReplies by `userId` is a bit annoying. The only reason I need this is because `ActivityReply` isn't part of `ActivityUnion`, which is how I'm trying to handle social stuff in my app as of now.
