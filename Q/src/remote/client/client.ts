const DEFAULT_SERVER = 'something';
const DEFAULT_CONNECTION = new Connection(DEFAULT_SERVER);

// called once per player connection to game
function joinGame(player: Player, connection = DEFAULT_CONNECTION) {
  // send initial message to server to join game
  // use server response to build connection
  // use connection to create refereeProxy and hand off player instance
}
