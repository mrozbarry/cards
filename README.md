# Cards

This project is a complete re-write of another project I have worked on called [cardular](https://github.com/mrozbarry/cardular).  I am not using that code or using it as reference: this is a brand new implementation.

# Prerequisites

 * Node >= 5.8
 * Npm >= 3.7

# Creating a new firebase app

 0. Go to https://firebase.google.com/
 0. Sign up for a free account
 0. Create a new project
 0. In the overview space, click on "Add Firebase to your web app"
 0. Copy the config hash
 0. Create the file `./config/firebase.json`
 0. Structure the json file like this:
    ```
    {
      "development": {},
      "production": {}
    }
    ```
 0. Paste the config hash under development if you plan on running it locally, production if you plan on doing a static build. You can definitely paste it in both sections. If just in development, it should look something like this (NOTE: You might need to quote all the hash keys):
    ```
    {
      "development": {
        "apiKey": "YOUR API KEY",
        "authDomain": "YOUR AUTH DOMAIN",
        "databaseURL": "YOUR DATABASE URL",
        "storageBucket": "YOUR STORAGE BUCKET",
        "messagingSenderId": "YOUR MESSAGING SENDER ID"
      },
      "production": {}
    }
    ```

# Installing locally

```
git clone git@github.com:mrozbarry/cards.git
cd cards
npm install -g yarn
yarn install
```

# Running locally

```
yarn start
```

# Doing a static build

```
yarn compile
```

# (OPTIONAL) Using firebase hosting

For some reason, firebase-tools installs a global firebase executable for an older version of the firebase cli client. To work around this, I'm specifying the local firebase executable from node_modules.

## Setting up firebase-tools (formerly firebase-cli)

```
./node_modules/.bin/firebase login
./node_modules/.bin/firebase init
```

## Doing a deploy

```
./node_modules/.bin/firebase deploy
```

# Huge refactor progress:

 * [x] Better menu that is accessible-friendlier.
 * [x] Allow users to watch a game without taking up a player slot.
 * [x] Allow players to leave a game.
 * [x] Extra cards from Game component to make everything much easier to manage.
 * [x] Remove SVG, just use a big div.
 * [X] Ditch native drag'n'drop for custom positioning.
 * [ ] Make showing your cards in hand an overlay so moving them onto the board is much more natural.
 * [ ] Support uploading shared custom cards or decks.
 * [ ] Support uploading shared custom player cursors.
 * [ ] Allow game owners to kick or ban players.
 * [X] Visual feedback on the card your cursor is over
 * [-] Per card menus the control rotation and actions
 * [-] Double click to pick up a card
 * [ ] Sound effects
 * Allow cards that are overlapping to...
   * [ ] Be shuffled
   * [ ] Be organized
   * [ ] Have n cards dealt to each player
