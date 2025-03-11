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

  return { vibrateOnce, vibrateTwice, vibrateThrice, vibrateQuadrice, vibratePageOne, vibratePageTwo };
}
