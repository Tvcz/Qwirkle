The commit we tagged for your submission is 1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2.
**If you use GitHub permalinks, they must refer to this commit or your self-eval will be rejected.**
Navigate to the URL below to create permalinks and check that the commit hash in the final permalink URL is correct:

https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/tree/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2

## Self-Evaluation Form for Milestone 10

Indicate below each bullet which file/unit takes care of each task.

The data representation of configurations clearly needs the following
pieces of functionality. Explain how your chosen data representation 

- implements creation within programs _and_ from JSON specs 

  For ease of use we made our implementation of the configs as types, [clientConfig](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/clientConfig.ts#L24-L30), this makes it so that when we receive a config we simply use a typeguard that converts it into our type, example seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/electron/main/configRunner.ts#L48). We don't need to create it, since our implementation is simply the parsed JSON. For creation within the program we have generate functions, [generateServerConfig](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/serverConfig.ts#L33-L49).

- enforces that each configuration specifies a fixed set of properties (no more, no less)
  
  In the [configTypeGuard.ts](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L6-L161) file you can see there are `isClientConfig`, `isRefereeConfig`, and `isServerConfig`. These check, sometimes with helper functions, that each field is correctly in the config and that it is according to the spec. It also checks that there are only the needed number of keys needed in that config, which can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L72), which makes it so that extra fields invalidate the config. 
  
- supports the retrieval of properties 
  
  the config in our case is a type, [clientConfig](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/clientConfig.ts#L24-L30), so the retreveal of it is done by accessing a field as follows, `config.port`, an example of this in are server can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L59), where the server starts to listen according to the config (the port field is overriden in our test script with the passed in port, but the example of how we access properties in the config still stands). 

- sets properties (what happens when the property shouldn't exist?) 
  when the property shouldn't exist the is `isClientConfig`, `isRefereeConfig`, and `isServerConfig` checks that there are only the needed number of keys needed in that config, which can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.ts#L72), which makes it so that extra fields invalidate the config.

- unit tests for these pieces of functionality

  The unit tests can be found at [configTypeGuard.test.ts](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts). These test parsing and creating as can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L44-L63), enforcing that there are no missing properties [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L227-L270), enforcing that there are no extra properties [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/json/config/configTypeGuard.test.ts#L272-L290). retrieval and setting of individual properties was not tested as the configs are simple types.

Explain how the server, referee, and scoring functionalities are abstracted
over their respective configurations.

The server took in an optional config, which if undefined was set to a default config, this can be seen in the [constructor](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L41) and for the referee some of these were abstracted already, but in our own data representation. To keep in consistent with previous implementations we simply added the parameters that we still needed, this can be seen in the referee [constructor](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/referee/referee.ts#L86-L90). The server then constructed the referee using the referee config which can be seen [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L160-L176).

Does the server touch the referee or scoring configuration, other than
passing it on?
Yes, as mentioned above we already had abstracted some of these things out, like the starting state for the referee, but we had used our own implementation. To keep things backwards compatiable with our previous tests we had the server construct our data representation of a state, convert seconds to milliseconds, ect. This can be found [here](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L160-L176).

Does the referee touch the scoring configuration, other than passing
it on?
No it does not, it actually never directly reacieves the scoring configuration to begin with. Our scoring is handled inside the rulebook, so the scoring is actually passed in to a [ConfigedRulebook](https://github.khoury.northeastern.edu/CS4500-F23/thoughtful-lions/blob/1fc09a5b853f324fa1b4c2aa46a3ed87712b60c2/Q/src/remote/server/server.ts#L169-L172) which extends our rulebook and uses the scoring configuration to set the Q bonus and Finish bonus. Our referee then takes in this rulebook.

The ideal feedback for each of these three points is a GitHub
perma-link to the range of lines in a specific file or a collection of
files.

A lesser alternative is to specify paths to files and, if files are
longer than a laptop screen, positions within files are appropriate
responses.

You may wish to add a sentence that explains how you think the
specified code snippets answer the request.

If you did *not* realize these pieces of functionality, say so.

