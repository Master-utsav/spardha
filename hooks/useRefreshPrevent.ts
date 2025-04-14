import { useEffect } from 'react';

const usePreventRefreshSubmit = (submitQuiz: () => void) => {
  useEffect(() => {
    const refreshCount = Number(
      localStorage.getItem('stnuocxhserferxgninrawxahdraps')
    );
    const tabWarnings = Number(localStorage.getItem('sbattxgninrawxahdraps'));

    // Detect if the page was refreshed (not a route change)
    const navEntries = performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (isReload) {
      if (refreshCount >= 5 || tabWarnings <= 0) {
        submitQuiz();
      } else {
        localStorage.setItem(
          'stnuocxhserferxgninrawxahdraps',
          (refreshCount + 1).toString()
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default usePreventRefreshSubmit;
