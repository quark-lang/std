import { File } from '../../src/utils/file.ts';
import { QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { existsSync } from 'https://deno.land/std/fs/mod.ts';
import { NoneType, StringType, Types } from '../../src/core/interpreter.ts';
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts';

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
    value: path.join('..', '..'),
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
