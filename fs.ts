import { Interpreter } from '../src/core/interpreter.ts';
import * as path from 'https://deno.land/std@0.83.0/path/mod.ts';
import { File } from '../src/utils/file.ts';

export const module = [
  {
    name: 'read',
    func: async function(path: string) {
      try {
        const content: string = await File.read(path);
        return content;
      } catch (error) {
        throw error;
      }
    }
  },
  {
    name: 'cwd',
    value: Deno.cwd(),
  },
  {
    name: 'join',
    func: path.join,
  },
  {
    name: 'dir',
    func: path.dirname,
  }
];

export const namespace = 'fs';