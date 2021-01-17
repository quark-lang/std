import { QuarkModule } from '../../api/api.ts';
import { QuarkTypes } from '../../api/typings/types.ts';
import { StringType, Types } from '../../src/core/interpreter.ts';
import { bold, green, red, rgb24, yellow } from 'https://deno.land/std@0.83.0/fmt/colors.ts';

// green
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'green',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: green(message.value),
    };
  }
});

// gray
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'gray',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: rgb24(message.value, 0x808080),
    };
  }
});

// yellow
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'yellow',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: yellow(message.value),
    };
  }
});

// white
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'white',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: rgb24(message.value, 0xffffff),
    }
  }
});

// red
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'red',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: red(message.value),
    };
  }
});


// bold
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'bold',
  body: function(message: StringType) {
    return {
      type: Types.String,
      value: bold(message.value),
    }
  }
});