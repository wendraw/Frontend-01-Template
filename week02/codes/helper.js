const combine = (...args) => args.join("");
const atLeastOne = (reg) => `${reg}+`;
const optional = (reg) => `(${reg})?`;
const or = (...args) => `(${args.join("|")})`;

module.export = {
  combine,
  atLeastOne,
  optional,
  or,
};
