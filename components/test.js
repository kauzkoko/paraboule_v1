onRepeat: () => {
  if (counter > 0) {
    hihatTriggers.value[0]++;
    flyToStart();
    circleAroundCochonet = false;
    return;
  }
  hihatTriggers.value[0]++;
  gsap.delayedCall(duration / 4, () => {
    if (circleAroundCochonet) {
      hihatTriggers.value[1]++;
    }
  });
  gsap.delayedCall(duration / 2, () => {
    if (circleAroundCochonet) {
      hihatTriggers.value[2]++;
    }
  });
  gsap.delayedCall((duration / 4) * 3, () => {
    if (circleAroundCochonet) {
      hihatTriggers.value[3]++;
    }
  });
  counter++;
};
