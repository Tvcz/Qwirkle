## JSON
The `json` folder contains type defintions, type guards, and other utilities for
json objects. The type guards are used to safely determine whether a parsed json
object (which is an unknown type) is of the expected type. This allows for the
objects to be safely used according to their confirmed type.

### `config`
Contains type definitions and type guards for the json `client`, `server`, and
`referee` configuration objects.

### `data`
Contains type definitions and type guards for the json object definitions 
which represent the nouns in the game (i.e. JTile, JPlayer, JPub, etc.)

### `serialize`
Contains functions for serializing the game state (internal representation) into
json objects (JTile, JPub, etc.).

### `deserialize`
Contains functions for deserializing json objects (JTile, JPub, etc.) into game
state objects (internal representation).

### `messages`
Contains type definitions and type guards for the json objects which represent
the json messages sent between the client and server.