import { File } from '../../src/utils/file.ts';
import { quarkify, QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { existsSync } from 'https://deno.land/std/fs/mod.ts';
import { IntegerType, NoneType, StringType, Types, } from '../../src/typings/types.ts';
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts';
import { getQuarkFolder } from '../../src/main.ts';

// fs:read
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'read',
  body: async function(path: StringType): Promise<StringType | NoneType> {
    if (!existsSync(path.value)) return {
      type: Types.None,
      value: undefined,
    }
    return {
      type: Types.String,
      value: await File.read(path.value),
    }
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'write',
  body: async function(src: StringType, content: StringType) {
    const encode = new TextEncoder().encode(content.value);
    await Deno.writeFile(src.value, encode);
  }
});

QuarkModule.declare('path', QuarkTypes.QuarkFunction, {
  name: 'isAbsolute',
  body: function(el: StringType) {
    return quarkify(path.isAbsolute, el);
  }
});

// fs:cwd
QuarkModule.declare('fs', QuarkTypes.QuarkVariable, {
  name: 'cwd',
  value: {
    type: Types.String,
    value: Deno.cwd(),
  },
});

// fs:root
QuarkModule.declare('fs', QuarkTypes.QuarkVariable, {
  name: 'root',
  value: {
    type: Types.String,
    value: await getQuarkFolder(),
  },
});

// fs:join
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'join',
  body: function(...paths: StringType[]): StringType {
    return {
      type: Types.String,
      value: path.join(...paths.map((x) => x.value)),
    };
  }
});

// fs:dirname
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'dirname',
  body: function(src: StringType): StringType {
    return {
      type: Types.String,
      value: path.dirname(src.value),
    }
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'chmod',
  body: (src: StringType, chmod: IntegerType) => quarkify(Deno.chmodSync, src, chmod),
});

QuarkModule.declare('process', QuarkTypes.QuarkFunction, {
  name: 'exec',
  body: async (cmd: StringType) => {
    await Deno.run({
      cmd: cmd.value.split('&&'),
    });
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'basename',
  body: (src: StringType) => quarkify(path.basename, src),
});
