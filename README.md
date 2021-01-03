# std

This repository contains the [Quark Lang](https://github.com/quark-lang/quark).
It is licensed under the MIT license.

## io.qrk

### puts

- @name = puts
- @brief = Displays a message on stdout without newline
- @param =
  - values: the values to display
- @author = Wafelack \<wafelack@protonmail.com>

### print

- @name = print
- @brief = Displays a message on stdout with a newline
- @param =
  - values: the values to display
- @author = Wafelack \<wafelack@protonmail.com>

## list.qrk

### foreach

- @name = foreach
- @brief = Iterates over the elements of a list and applies a function to each
- @param = 
  - el: the elements to iterate over
  - cb: the function to apply to the elements
- @author = Thomas Vergne \<thomas@quark-lang.dev>

### push

- @name = push
- @brief = Pushes an element to a list
- @param = 
  - el: the list to push
  - val: the value to push
- @author = Wafelack \<wafelack@protonmail.com>
- @details = Returns the element if it is not a list

## misc.qrk

### length

- @name = length
- @brief = returns the element's length
- @param =
  - el: the element
- @author = Thomas Vergne \<thomas@quark-lang.dev>