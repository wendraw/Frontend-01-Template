const { combine, atLeastOne, optional, or } = require("./helper");

const Dot = "\\.";

const BinaryDigit = "[01]";
const BinaryIntegerLiteral = combine("0[bB]", atLeastOne(BinaryDigit));

const OctalDigit = "[0-7]";
const OctalIntegerLiteral = combine("0[oO]", atLeastOne(OctalDigit));

const HexDigit = "[0-9a-fA-F]";
const HexIntegerLiteral = combine("0[xX]", atLeastOne(HexDigit));

const DecimalDigit = "[0-9]";
const DecimalDigits = atLeastOne(DecimalDigit);
const NonZeroDigit = "[1-9]";
const ExponentIndicator = "[eE]";
const SignedInteger = combine("[-+]?", DecimalDigits);
const ExponentPart = combine(ExponentIndicator, SignedInteger);
const DecimalIntegerLiteral = or(
  "0",
  combine(NonZeroDigit, atLeastOne(DecimalDigits))
);

const DecimalLiteral = or(
  combine(
    DecimalIntegerLiteral,
    Dot,
    optional(DecimalDigits),
    optional(ExponentPart)
  ),
  combine(Dot, DecimalDigits, optional(ExponentPart)),
  combine(DecimalIntegerLiteral, optional(ExponentPart))
);

const NumericLiteral = or(
  DecimalLiteral,
  BinaryIntegerLiteral,
  OctalIntegerLiteral,
  HexIntegerLiteral
);

module.export = NumericLiteral;
