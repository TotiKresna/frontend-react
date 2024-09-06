import { type Metric, onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    // Menggunakan onINP sebagai pengganti onFID
    onINP(onPerfEntry);
  }
};

export default reportWebVitals;