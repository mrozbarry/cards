# Cards

This project is a complete re-write of another project I have worked on called [cardular](https://github.com/mrozbarry/cardular).  I am not using that code or using it as reference: this is a brand new implementation.

# Prerequisites

 * Node >= 5.8
 * Npm >= 3.7

# Running locally

```
git clone git@github.com:mrozbarry/cards.git
cd cards
npm install -g yarn
yarn install
yarn start
```

# Huge refactor progress:

 * [x] Better menu that is accessible-friendlier.
 * [x] Allow users to watch a game without taking up a player slot.
 * [x] Allow players to leave a game.
 * [x] Extra cards from Game component to make everything much easier to manage.
 * [x] Remove SVG, just use a big div.
 * [ ] Ditch native drag'n'drop for custom positioning.
 * [ ] Make showing your cards in hand an overlay so moving them onto the board is much more natural.
 * [ ] Support uploading shared custom cards or decks.
 * [ ] Support uploading shared custom player cursors.
 * [ ] Allow game owners to kick or ban players.
 * [ ] Sound effects
 * Allow cards that are overlapping to...
   * [ ] Be shuffled
   * [ ] Be organized
   * [ ] Have n cards dealt to each player


# Thanks

 - [Free playing cards set](https://superdevresources.com/free-playing-cards-set/)
 - [Cursor hand mouse click forefinger](https://pixabay.com/en/cursor-hand-mouse-click-forefinger-148819/)
