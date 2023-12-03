### Changes made to allow for configurable client and server startups
- Created a `ConfiguredRulebook` class that takes in the end of game and Q
  bonuses as parameters rather than using constant defaults (`ruleBook.ts`).
- Created types for the Client, Server, and Referee configs (`clientConfig.ts`, 
  `serverConfig.ts`, `refereeConfig.ts`).
  - Created typeguards to handle converting input json objects to Typescript
    objects (`configTypeguards.ts`).
  - Created default configs for the Client, Server, and Referee configs.
    - Created a `generateClientConfig` to build Client config objects.
    - Created a `generateServerConfig` to build Server config objects.
    - Created a `generateRefereeConfig` to build Referee config objects.
- Added a `perTurnTimeoutMs` paramater to the Referee function to allow for
  configurable timeouts (`referee.ts`, `referee.types.ts`).
- Swapped out the constants used in `server.ts` and `client.ts` for passed
  configs.
- Added functionality to handle the possibility of a specified observer to the
  `server.ts`.
