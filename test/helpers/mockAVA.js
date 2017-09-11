const ava = require("ava");

function mockAVA(opts, isGlobal = false) {
  let merged = Object.assign({}, ava, opts);
  if(isGlobal) {
    merged["@global"] = true;
  }
  merged["@noCallThru"] = true;
  return merged;
}

module.exports = mockAVA;
