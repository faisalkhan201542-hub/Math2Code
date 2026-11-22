import type { CurveData } from './types';

/**
 * Generate a standard RFC-4180 compliant CSV string from sampled curves.
 */
export function generateCSV(curves: CurveData[]): string {
  const activeCurves = curves.filter((c) => !c.hasError && c.points.length > 0);

  if (activeCurves.length === 0) {
    return 'No valid curve data available to export.\n';
  }

  // Header row
  const headers = ['"x"'];
  for (const c of activeCurves) {
    const safeName = c.name.replace(/"/g, '""');
    const safeExpr = c.expression.replace(/"/g, '""');
    headers.push(`"${safeName} [${safeExpr}]"`);
  }
  const lines: string[] = [headers.join(',')];

  // Number of sample rows is determined by the first curve
  const sampleCount = activeCurves[0].points.length;

  for (let i = 0; i < sampleCount; i++) {
    const x = activeCurves[0].points[i].x;
    const row = [x.toFixed(6)];

    for (const c of activeCurves) {
      const pt = c.points[i];
      if (pt && pt.y !== null && Number.isFinite(pt.y)) {
        row.push(pt.y.toFixed(8));
      } else {
        row.push('NaN'); // Standard scientific notation for missing/undefined points
      }
    }

    lines.push(row.join(','));
  }

  return lines.join('\n') + '\n';
}

/**
 * Trigger client-side browser file download for CSV data.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
