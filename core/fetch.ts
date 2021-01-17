import { QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { StringType, Types } from '../../src/core/interpreter.ts';

// fetch
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'fetch',
  body: async function(path: StringType): Promise<StringType> {
    try {
      const res = await fetch(path.value);
      return {
        type: Types.String,
        value: await res.text(),
      }
    } catch (exception) {
      throw exception;
    }
  }
});