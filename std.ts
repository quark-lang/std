import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import { QuarkCallback } from '../api/typings/callback.ts';

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'out',
  body: async function(text: string) {
    const encodedText: Uint8Array = (new TextEncoder).encode(text);
    await Deno.stdout.write(encodedText);
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'callbackTest',
  body: async function(name: string, cb: QuarkCallback) {
    await QuarkModule.createCall(cb, name);
  }
});