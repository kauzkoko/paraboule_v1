export function useVibrations() {
  const { vibrate: vibrateOnce } = useVibrate({ pattern: [50] });
  const { vibrate: vibrateTwice } = useVibrate({ pattern: [50, 30, 50] });
  const { vibrate: vibrateThrice } = useVibrate({
    pattern: [50, 30, 50, 30, 50],
  });
  const { vibrate: vibrateQuadrice } = useVibrate({
    pattern: [50, 30, 50, 30, 50, 30, 50],
  });

  const { vibrate: vibratePageOne } = useVibrate({
    pattern: [100, 20, 50, 20],
  });

  const { vibrate: vibratePageTwo } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageThree } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageFour } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageFive } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageSix } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageSeven } = useVibrate({
    pattern: [100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20],
  });

  const { vibrate: vibratePageEight } = useVibrate({
    pattern: [
      100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20,
    ],
  });

  const { vibrate: vibratePageNine } = useVibrate({
    pattern: [
      100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20,
      50, 20,
    ],
  });

  const { vibrate: vibratePageTen } = useVibrate({
    pattern: [
      100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20,
      50, 20,
    ],
  });

  const { vibrate: vibratePageEleven } = useVibrate({
    pattern: [
      100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20,
      50, 20, 50, 20,
    ],
  });

  const { vibrate: vibratePageTwelve } = useVibrate({
    pattern: [
      100, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20, 50, 20,
      50, 20, 50, 20,
    ],
  });

  return {
    vibrateOnce,
    vibrateTwice,
    vibrateThrice,
    vibrateQuadrice,
    vibratePageOne,
    vibratePageTwo,
    vibratePageThree,
    vibratePageFour,
    vibratePageFive,
    vibratePageSix,
    vibratePageSeven,
    vibratePageEight,
    vibratePageNine,
    vibratePageTen,
    vibratePageEleven,
    vibratePageTwelve,
  };
}
