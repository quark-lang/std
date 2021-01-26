import { quarkify, QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { Frame, Interpreter } from '../../src/core/interpreter.ts';
import { Parser } from '../../src/core/parser.ts';
import { IntegerType, StringType, Types, ValueElement } from '../../src/typings/types.ts';
import { isContainer } from '../../src/utils/runner.ts';
import { Block, Element } from '../../src/typings/block.ts';

// std:out
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'out',
  body: async function(text: ValueElement) {
    if ('value' in text) {
      const encodedText: Uint8Array = (new TextEncoder).encode(String(text.value));
      await Deno.stdout.write(encodedText);
    }
  }
});

// std:copy
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'copy',
  body: function (element: any) {
    return {
      ...element
    };
  }
});

// time:now
QuarkModule.declare('time', QuarkTypes.QuarkFunction, {
  name: 'now',
  body: function(): IntegerType {
    return {
      type: Types.Integer,
      value: Date.now(),
    };
  }
});

// time:sleep
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

// replace
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'replace',
  body: function(el: StringType, elToRepl: StringType, repl: StringType) {
    return {
      type: Types.String,
      value: el.value.replace(elToRepl.value, repl.value),
    }
  }
})

// std:args
QuarkModule.declare('std', QuarkTypes.QuarkVariable, {
  name: 'args',
  value: {
    type: Types.List,
    value: Deno.args.map((acc) => ({ type: Types.String, value: acc })),
  },
});

// type
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'type',
  body: function(variable: any): ValueElement {
    return {
      type: Types.String,
      value: typeof variable.value,
    };
  }
});

// print
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'print',
  body: (...args: ValueElement[]) => quarkify(console.log, ...args),
});

// input
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
  name: 'global',
  args: [
    {
      type: 'Word',
      value: 'block',
      block: true,
    }
  ],
  body: async function(block: Block | Element) {
    await Interpreter.process(block, Interpreter.cwd, true);
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'get',
  body: function(element: any) {
    return element.value;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'del',
  args: [
    {
      type: 'Word',
      value: 'variable',
      block: true,
    }
  ],
  body: function(variable: any) {
    const reversedStack = [...Frame.stack].reverse();
    for (const indexStack in reversedStack) {
      const frame = reversedStack[indexStack];
      for (const indexFrame in frame.variables) {
        const item = frame.variables[indexFrame];
        if (item.name === variable.value) {
          const stackAddress = Math.abs(Number(indexStack) - Frame.stack.length) - 1;
          Frame.stack[stackAddress].variables.splice(Number(indexFrame), 1);
          return;
        }
      }
    }
  }
});

// std:exec
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'exec',
  body: async function(code: any, global: boolean = true): Promise<StringType> {
    const ast = code.type === 'Block'
      ? code.value
      : Parser.parse(code.value);

    if (isContainer(ast) && ast.length === 1)
      return await Interpreter.process(ast[0], undefined, global);
    return await Interpreter.process(ast, undefined, global);
  }
});

// throw
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'throw',
  body: function(...message: ValueElement[]) {
    if (message.length === 0) return Deno.exit(1);
    console.log(message.map((arg) => 'value' in arg ? arg.value : arg).join(' '));
    return Deno.exit(1);
  }
});

// std:run
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'run',
  body: async function(code: StringType, path: StringType) {
    await Interpreter.run(code.value, path.value);
  }
});