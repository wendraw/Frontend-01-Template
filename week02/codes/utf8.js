function encodeCodePoint(code) {
  if (code <= 0x7f) {
    return [code];
  } else if (code <= 0x7ff) {
    return [0xc0 | ((code >> 6) & 0x1f), 0x80 | (code & 0x3f)];
  } else if (code <= 0xffff) {
    return [
      0xe0 | ((code >> 12) & 0xf),
      0x80 | ((code >> 6) & 0x3f),
      0x80 | (code & 0x3f),
    ];
  } else {
    return [
      0xf0 | ((code >> 18) & 0x7),
      0x80 | ((code >> 12) & 0x3f),
      0x80 | ((code >> 6) & 0x3f),
      0x80 | (code & 0x3f),
    ];
  }
}

function UTF8_Encoding(string) {
  const codes = [];
  for (let ch of string) {
    const bytes = encodeCodePoint(ch.codePointAt(0));
    codes.push(...bytes);
  }
  const array = new Uint8Array(codes);
  return array.buffer;
}

module.exports = UTF8_Encoding;
