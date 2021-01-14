import {QuarkModule} from '../../api/api.ts';
import {QuarkTypes} from '../../api/typings/types.ts';
import type {IntegerType, StringType, ValueElement} from '../../src/core/interpreter.ts';
import {Interpreter, Types} from '../../src/core/interpreter.ts';
import {Parser} from '../../src/core/parser.ts';

import {bold, green, red, rgb24, yellow} from 'https://deno.land/std@0.83.0/fmt/colors.ts';

function getValue(values: ValueElement[]): any {
  let result: any = [];
  for (const value of values) {
    if (value.type === Types.List) {
      result.push(getValue(value.value));
    } else if ('value' in value) result.push(value.value === undefined ? 'none' : value.value);
    else result.push('none');
  }
  return result;
}

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'out',
  body: async function(text: ValueElement) {
    if ('value' in text) {
      const encodedText: Uint8Array = (new TextEncoder).encode(String(text.value));
      await Deno.stdout.write(encodedText);
    }
  }
});

QuarkModule.declare('time', QuarkTypes.QuarkFunction, {
  name: 'now',
  body: function(): IntegerType {
    return {
      type: Types.Integer,
      value: Date.now(),
    };
  }
})

QuarkModule.declare('time', QuarkTypes.QuarkFunction, {
  name: 'sleep',
  body: async function(time: IntegerType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time.value);
    });
  }
})

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'gray',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: rgb24(message.value, 0x808080),
    };
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'yellow',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: yellow(message.value),
    };
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'white',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: rgb24(message.value, 0xffffff),
    }
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'red',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: red(message.value),
    };
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'bold',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: bold(message.value),
    }
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'green',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: green(message.value),
    };
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
  name: 'print',
  body: async function(...args: any[]) {
    console.log(...getValue(args));
    return { type: Types.None, value: undefined };
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
    if (message.length === 0) return Deno.exit(1);
    console.log(message.map((arg) => 'value' in arg ? arg.value : arg).join(' '));
    return Deno.exit(1);
  }
});

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'run',
  body: async function(code: StringType, path: StringType) {
    await Interpreter.run(code.value, path.value);
  }
});