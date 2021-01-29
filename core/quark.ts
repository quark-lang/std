import { QuarkModule, QuarkType } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { Function } from '../../src/core/interpreter.ts';
import {
  Types,
  StringType,
  FunctionType,
} from '../../src/typings/types.ts';
import { getQuarkFolder, parseConfiguration } from '../../src/main.ts';
import * as Path from 'https://deno.land/std@0.83.0/path/mod.ts';
import { File } from '../../src/utils/file.ts';

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

QuarkModule.declare('config', QuarkTypes.QuarkFunction, {
  name: 'parse',
  body: async function(file: StringType) {
    const content = await File.read(file.value);
    return QuarkType.object(parseConfiguration(content));
  }
})

QuarkModule.declare('on', QuarkTypes.QuarkFunction, {
  name: 'exit',
  body: async function(cb: FunctionType) {
    window.addEventListener('unload', function() {
      Function.call(cb as FunctionType, []);
    });
  }
});