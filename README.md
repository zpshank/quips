# Quick IPS Tool (QUIPS)

QUIPS is a command-lin IPS patcher written with the
[QuickJS](https://bellard.org/quickjs/quickjs.html) Javascript Engine.

## Build Requirements

* Make
* [QuickJS](https://bellard.org/quickjs/quickjs.html)

## Build

```
make
```

This command should produce a `quips` executable in the root directory. This is
a standalone executable that does not need to include the QuickJS Javascript
Engine.

## Run tests

```
make test
```

## Usage

```
Usage:./quips [options] [input_file]
-h --help     list options
-o --output   creates a new file instead of modifying input_file
-p --patch    patch file to apply
-y --yes      answers yes to overwrite file question
```
