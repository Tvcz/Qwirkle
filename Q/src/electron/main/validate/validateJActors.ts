import { JActor } from '../types';

export const validateJActors = (jActors: JActor[]) => {
  if (jActors.length < 2 || jActors.length > 4) {
    throw new Error('jActors must contain at least 2 and at most 4 players');
  }

  const namesAreUnique = jActors.every(
    (actor, index) =>
      jActors.findIndex((findActor) => actor[0] === findActor[0]) === index
  );

  if (!namesAreUnique) {
    throw new Error(
      'The names of any two different JActorSpecs must be distinct'
    );
  }
};
