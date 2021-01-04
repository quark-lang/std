import { Interpreter } from '../src/core/interpreter.ts';
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts';

export const module = [
  {
    name: 'stdout',
    func: async (text: string) => {
      const encoded: Uint8Array = new TextEncoder().encode(text);
      await Deno.stdout.write(encoded);
    }
  },
  {
    name: 'exec',
    func: async function(code: string, cwd: string = Deno.cwd()) {
      return await Interpreter.run(code, cwd);
    }
  },
  {
    name: 'root',
    value: Interpreter.parentDir(path.fromFileUrl(import.meta.url), 2),
  },
  {
    name: 'newline',
    value: '\n',
  },
  {
    name: 'args',
    value: Deno.args,
  },
  {
    name: 'type',
    func: (el: any): string => {
      if (Array.isArray(el)) return 'list';
      return typeof el;
    }
  },
  {
    name: 'input',
    func: async (question = '') => {
      const buf = new Uint8Array(1024);
      await Deno.stdout.write(new TextEncoder().encode(question));

      const input = await Deno.stdin.read(buf);
      const answer = new TextDecoder().decode(buf.subarray(0, input as number | undefined));
      return answer.trim();
    }
  }
]