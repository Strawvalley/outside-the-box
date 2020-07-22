# Outside the Box

![banner-image](/assets/banner.png)

Playable version at https://outside-the-box.herokuapp.com/

Built with Vue, Node&#46;js with RxJS and Socket&#46;IO using TypeScript and Parcel Bundler.

## How to play
* One player is chosen to be the __guesser__ for the round.

* All other players are presented the word for this round and have to come up with a __hint__ for the guesser. The hint can only be a single word!

* As soon as all players have submitted their hints, the guesser has to __figure out the word__ for this round.

* But there is a __twist__! Hints have to be __unique__. As soon as two or more players submit the same hint, it can not help the guesser to find the word! So think __outside the box__ to make sure the guesser will find the word!


## Development

```
npm install             # Install dependencies
npm run dev             # Run development server
```

## Production

```
npm install             # Install dependencies
npm run start           # Build client & run server
```

## Acknowledgment

Inspired by https://github.com/steveholgado/rxjs-chat-app
