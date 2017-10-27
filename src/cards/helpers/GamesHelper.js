import FirebaseCollectionHelper from "./FirebaseCollectionHelper"

export default class GamesHelper extends FirebaseCollectionHelper {
  constructor (firebase) {
    super(firebase.database().ref("games"))
  }
}
