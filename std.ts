import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import type { ValueElement } from '../src/core/interpreter.ts';
import { Types } from '../src/core/interpreter.ts';

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'out',
  body: async function(text: ValueElement) {
    if ('value' in text) {
      const encodedText: Uint8Array = (new TextEncoder).encode(String(text.value));
      await Deno.stdout.write(encodedText);
    }
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkVariable, {
  name: 'newline',
  value: {
    type: Types.String,
    value: '\n',
  },
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'type',
  body: function(variable: any): ValueElement {
    return {
      type: Types.String,
      value: typeof variable.value,
    };
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'throw',
  body: function(message: ValueElement) {
    if (!message) return;
    throw 'value' in message ? message.value : '';
  }
});
