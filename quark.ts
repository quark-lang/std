import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import { Types } from '../src/core/interpreter.ts';

async function getRelease(): Promise<string> {
  const github = await fetch('https://api.github.com/repos/quark-lang/quark/releases');
  const json = await github.json();

  return json[0].tag_name || 'v1.0.0';
}

QuarkModule.declare('quark', QuarkTypes.QuarkVariable, {
  name: 'release',
  value: {
    type: Types.String,
    value: await getRelease(),
  }
});
