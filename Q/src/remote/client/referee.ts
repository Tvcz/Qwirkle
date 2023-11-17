import { Player } from '../../player/player';
import { BaseTile } from '../../game/map/tile';

// one exists per client player
// each refereeProxy has its own connection
async function refereeProxy(player: Player<BaseTile>, connection: Connection) {
  // listens for tcp messages from the server
  // converts them to method calls on the player
  connection.on((data) => {
    switch (data) {
      case 'name':
        player.name();
      // make the rest of the cases
    }
  });

  // send JSON string messages to the server with the return values
  // from the method calls on the client player
}
