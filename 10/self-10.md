The commit we tagged for your submission is 1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2.
**If you use GitHub permalinks, they must refer to this commit or your self-eval will be rejected.**
Navigate to the URL below to create permalinks and check that the commit hash in the final permalink URL is correct:

https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/tree/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2

## Self-Evaluation Form for Milestone 10

Indicate below each bullet which file/unit takes care of each task.

The data representation of configurations clearly needs the following
pieces of functionality. Explain how your chosen data representation 

- implements creation within programs _and_ from JSON specs 

  - Our configs are represented as types, which mirror the JSON specs. Since we are in TypeScript, the JSON configurations in the spec can translate one-to-one to configuration objects in the code. This is also due to the fact that the client, server, and referee configs could be used by their respective components in our codebase without major changes to their signatures.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/clientConfig.ts#L24-L30
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/serverConfig.ts#L24-L31
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/refereeConfig.ts#L43-L54
  - When we receive a config we use a typeguard that converts it from the raw JSON into our types.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L6-L25
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L114-L134
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L62-L81
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L92-L100
  - We also have config generation functions, which can build config objects within the program.
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/clientConfig.ts#L32-L46
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/serverConfig.ts#L33-L49
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/refereeConfig.ts#L56-L86

- enforces that each configuration specifies a fixed set of properties (no more, no less)

  - In [configTypeGuard.ts](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L6-L161) you can see there are `isClientConfig`, `isRefereeConfig`, and `isServerConfig`. These checks, and their respective helper functions, ensure that each field is correctly in the config and that it is according to the spec. It also checks that there are only the needed number of keys needed in that config, which can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L72). This means that extra fields invalidate the config. 
  
- supports the retrieval of properties 
  
  - the config in our case is a type, for instance [`serverConfig`](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/serverConfig.ts#L24-L31), so the retrieval of it is done by accessing a field as follows, `config.port`. An example of this can be seen in [`server.ts`](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L59), where the server starts to listen according to the config (the port field is overriden in our test script with the passed in port, but the example of how we access properties in the config still stands). 

- sets properties (what happens when the property shouldn't exist?) 
  - Since we are using TypeScript, additional properties cannot be set on these configs. Since Typescript enforces adherence to the defined type, attempting to set a new property to any of the configs would cause a compile-time error.

- unit tests for these pieces of functionality

  - The unit tests can be found at [configTypeGuard.test.ts](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts). 
   - These test parsing and creating configs
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L44-L63      - enforcing that there are no missing properties 
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L227-L270 
   - enforcing that there are no extra properties 
  https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L272-L290
   - retrieval and setting of individual properties were not tested as the configs are simple types.

Explain how the server, referee, and scoring functionalities are abstracted
over their respective configurations.

- The server took in an optional config, which if undefined was set to a default config, this can be seen in the [signature](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L41). 
- For the referee, we didn't modify the internal behavior but rather changed the values being passed into the referee to be config values rather than constants. [Referee signature](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/referee/referee.ts#L86-L90). https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L160-L176

Does the server touch the referee or scoring configuration, other than
passing it on?

- Yes, the server destructures the scoring config in order to construct the rulebook, which is passed into the referee, and it destructures the referee config in order to pass the values as parameters into the referee [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L160-L176). We did this to avoid modifying the existing referee and scoring functionality more than is necessary.

Does the referee touch the scoring configuration, other than passing
it on?

- No it does not. Our scoring is handled inside the rulebook, so the scoring is actually used to construct a [ConfigedRulebook](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L169-L172) which extends our rulebook and uses the scoring configuration to set the Q bonus and Finish bonus. Our referee then takes in this rulebook.

The ideal feedback for each of these three points is a GitHub
perma-link to the range of lines in a specific file or a collection of
files.

A lesser alternative is to specify paths to files and, if files are
longer than a laptop screen, positions within files are appropriate
responses.

You may wish to add a sentence that explains how you think the
specified code snippets answer the request.

If you did *not* realize these pieces of functionality, say so.

