import { Interpreter } from '../src/core/interpreter.ts';
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
    func: async function(code: string) {
      return await Interpreter.run(code);
    }
  },
  {
    name: 'newline',
    func: () => '\n'
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