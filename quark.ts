import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import { FunctionType, Types, Function } from '../src/core/interpreter.ts';
import { parseConfiguration, getQuarkFolder } from '../src/main.ts';
import * as Path from 'https://deno.land/std@0.83.0/path/mod.ts';

async function getRelease(): Promise<string> {
  const github = await fetch('https://api.github.com/repos/quark-lang/quark/releases');
  const json = await github.json();
  const path: string = Path.join(await getQuarkFolder(), '.quarkrc');
  const config = await parseConfiguration(path);

  if (json.message && json.message.includes('API rate limit')) return config['version'];
  return json[0].tag_name || config['version'];
}

QuarkModule.declare('quark', QuarkTypes.QuarkVariable, {
  name: 'release',
  value: {
    type: Types.String,
    value: await getRelease(),
  }
});

QuarkModule.declare('on', QuarkTypes.QuarkFunction, {
  name: 'exit',
  body: async function(cb: FunctionType) {
    window.addEventListener('unload', function() {
      Function.call(cb as FunctionType, []);
    });
  }
});