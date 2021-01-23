import { quarkify, QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { StringType } from '../../src/typings/types.ts';
import { bold, green, red, rgb24, yellow } from 'https://deno.land/std@0.83.0/fmt/colors.ts';

// green
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'green',
  body: (message: StringType) => quarkify(green, message),
});

// gray
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'gray',
  body: (message: StringType) => quarkify(rgb24, message, 0x808080),
});

// yellow
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'yellow',
  body: (message: StringType) => quarkify(yellow, message),
});

// white
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'white',
  body: (message: StringType) => quarkify(rgb24, message, 0xffffff),
});

// red
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'red',
  body: (message: StringType) => quarkify(red, message),
});

// bold
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'bold',
  body: (message: StringType) => quarkify(bold, message),
});