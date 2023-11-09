import { JActor, JExn, JStrategy, Json } from '../types';

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

  return [jName, jStrategy];
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
