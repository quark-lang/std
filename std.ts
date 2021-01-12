import { QuarkModule } from '../api/api.ts';
import { QuarkTypes } from '../api/typings/types.ts';
import type { StringType, ValueElement } from '../src/core/interpreter.ts';
import { Interpreter, Types } from '../src/core/interpreter.ts';
import { Parser } from '../src/core/parser.ts';

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

QuarkModule.declare('std', QuarkTypes.QuarkVariable, {
  name: 'args',
  value: {
    type: Types.List,
    value: Deno.args.map((acc) => ({ type: Types.String, value: acc })),
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
  name: 'input',
  body: async function(question: StringType): Promise<StringType> {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(question.value));

    const input = await Deno.stdin.read(buf);
    const answer = new TextDecoder().decode(buf.subarray(0, input as number | undefined));
    return {
      type: Types.String,
      value: answer.trim(),
    };
  }
});

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'exec',
  body: async function(code: StringType): Promise<StringType> {
    return await Interpreter.process(Parser.parse(code.value));
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'throw',
  body: function(...message: ValueElement[]) {
    if (!message) return;
    console.log(message.map((arg) => 'value' in arg ? arg.value : arg).join(' '));
    Deno.exit(0);
  }
});

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'run',
  body: async function(code: StringType, path: StringType) {
    await Interpreter.run(code.value, path.value);
  }
});