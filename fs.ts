import { File } from '../src/utils/file.ts';
import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import { StringType, Types } from '../src/core/interpreter.ts';
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts';

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'read',
  body: async function(path: StringType): Promise<StringType> {
    try {
      const content: string = await File.read(path.value);
      return {
        type: Types.String,
        value: content,
      }
    } catch (error) {
      throw error;
    }
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkVariable, {
  name: 'cwd',
  value: {
    type: Types.String,
    value: Deno.cwd(),
  },
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'join',
  body: function(...paths: StringType[]): StringType {
    return {
      type: Types.String,
      value: path.join(...paths.map((x) => x.value)),
    };
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'dirname',
  body: function(src: StringType): StringType {
    return {
      type: Types.String,
      value: path.dirname(src.value),
    }
  }
});
