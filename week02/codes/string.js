const { combine, atLeastOne, optional, or } = require("./helper");

const Dot = "\\.";

const HexDigit = "[0-9a-fA-F]";
const Hex4Digits = `${HexDigit}{4}`;
const CodePoint = or(`0${HexDigit}{5}`, `10${HexDigit}{4}`, `${HexDigit}{1,5}`);

const SingleEscapeCharacter = `['"\\bfnrtv]`;
const EscapeCharacter = or(SingleEscapeCharacter, "[0-9]", "x", "u");
const NonEscapeCharacter = `[^'"\\bfnrtv\dxu\r\n\u2028\u2029]`;
const CharacterEscapeSequence = or(SingleEscapeCharacter, NonEscapeCharacter);
const UnicodeEscapeSequence = or(
  combine("u", Hex4Digits),
  combine("u{", CodePoint, "}")
);
const HexEscapeSequence = combine("x", HexDigit, HexDigit);

const LineTerminatorSequence = `(\r\n|[\r\n\u2028\u2029])`;
const LineContinuation = combine("\\\\", LineTerminatorSequence);

const EscapeSequence = or(
  CharacterEscapeSequence,
  "0(?!d)",
  HexEscapeSequence,
  UnicodeEscapeSequence
);

const SingleStringCharacter = or(
  // SourceCharacter but not one of ' or \ or Line terminator
  `[^'\r\n\u2028\u2029\\\\]`,
  "\u2028",
  "\u2029",
  combine("\\\\", EscapeSequence),
  LineContinuation
);

const DoubleStringCharacter = or(
  `[^"\r\n\u2028\u2029\\\\]`,
  "\u2028",
  "\u2029",
  combine("\\\\", EscapeSequence),
  LineContinuation
);

const StringLiteral = or(
  combine('"', combine(DoubleStringCharacter, "*"), '"'),
  combine("'", combine(SingleStringCharacter, "*"), "'")
);

module.exports = StringLiteral;
