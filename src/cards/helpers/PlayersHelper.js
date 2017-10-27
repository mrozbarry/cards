import FirebaseCollectionHelper from "./FirebaseCollectionHelper"

export default class PlayersHelper extends FirebaseCollectionHelper {
  constructor (firebase) {
    super(firebase.database().ref("players"))
  }
}
