import { JActor, JCheat, JExn, JStrategy, Json } from '../types';

export function mustParseAsJActors(json: Json): JActor[] {
  if (!Array.isArray(json)) {
    throw new Error('invalid JActors array');
  }

  return json.map((j) => mustParseAsSingleActor(j));
}

function mustParseAsSingleActor(json: Json): JActor {
  if (!Array.isArray(json)) {
    throw new Error('invalid JActor array');
  }
  const jName = mustParseAsJName(json[0]);
  const jStrategy = mustParseAsJStrategy(json[1]);

  if (json[2]) {
    const jExn = mustParseAsJExn(json[2]);
    return [jName, jStrategy, jExn];
  }

  if (json[3]) {
    const jCheat = mustParseAsJCheat(json[3]);
    return [jName, jStrategy, 'a cheat', jCheat];
  }

  return [jName, jStrategy];
}

function mustParseAsJCheat(json: Json): JCheat {
  if (
    json !== 'non-adjacent-coordinate' &&
    json !== 'tile-not-owned' &&
    json !== 'not-a-line' &&
    json !== 'bad-ask-for-tiles' &&
    json !== 'no-fit'
  ) {
    throw new Error('invalid JCheat');
  }
  return json;
}

function mustParseAsJName(json: Json): string {
  if (typeof json !== 'string') {
    throw new Error('invalid JName');
  }
  return json;
}

function mustParseAsJExn(json: Json): JExn {
  if (
    json !== 'setup' &&
    json !== 'take-turn' &&
    json !== 'new-tiles' &&
    json !== 'win'
  ) {
    throw new Error('invalid JExn');
  }
  return json;
}

export function mustParseAsJStrategy(json: Json): JStrategy {
  if (json !== 'dag' && json !== 'ldasg') {
    throw new Error('invalid JStrategy');
  }
  return json;
}
