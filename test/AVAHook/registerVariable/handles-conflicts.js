const test = require("ava");
const AVAHook = require("AVAHook");

test("appends numbers to subsequent reservations", t => {
  const firstReservation = AVAHook.registerVariable("needsAlt");
  const secondReservation = AVAHook.registerVariable("needsAlt");
  const thirdReservation = AVAHook.registerVariable("needsAlt");
  t.is(thirdReservation, "needsAlt3");
});

test("increments past other reserved variables", t => {
  const firstReservation = AVAHook.registerVariable("bypasses");
  const secondReservation = AVAHook.registerVariable("bypasses2");
  const thirdReservation = AVAHook.registerVariable("bypasses");
  t.is(thirdReservation, "bypasses3");
});
