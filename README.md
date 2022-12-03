# ActivityPub for AniList

This Proof of Concept Bridge will be Read-Only and will avoid storing any data.

This won't support most AniList features due to limitations of the AniList API (see `schemas/notes.md`).

This complies to the [AniList API Terms of Use](https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview#api-terms-of-use) to the best of our understanding.

We are unsure of the method of deployment as of now, but there's probably going to be resource limitation.

Once deployed and somewhat stable, the plan is to rewrite this as a series of microservices in either Python, Rust, and/or Elixir.