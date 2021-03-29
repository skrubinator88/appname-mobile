exports.CardUISlideOut = (cardRef, callBack, fast = false) => {
  return setTimeout(
    () => {
      cardRef.current.slideOut();

      setTimeout(callBack, 700);
    },
    fast == true ? 0 : 1500
  );
};
