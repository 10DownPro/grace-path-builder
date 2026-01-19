export function useHapticFeedback() {
  const vibrate = (pattern: number | number[] = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const lightTap = () => vibrate(10);
  const mediumTap = () => vibrate(30);
  const heavyTap = () => vibrate(50);
  const successPattern = () => vibrate([50, 50, 100]);
  const celebrationPattern = () => vibrate([100, 50, 100, 50, 200]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    successPattern,
    celebrationPattern,
  };
}
