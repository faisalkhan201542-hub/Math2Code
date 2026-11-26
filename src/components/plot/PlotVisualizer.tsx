import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { CurveData, DomainConfig } from '../../plot-engine';

export interface PlotVisualizerRef {
  downloadPNG: (filename?: string) => Promise<void>;
  resetView: () => void;
}

interface PlotVisualizerProps {
  curves: CurveData[];
  domain: DomainConfig;
  theme: 'light' | 'dark';
}

export const PlotVisualizer = forwardRef<PlotVisualizerRef, PlotVisualizerProps>(
  ({ curves, domain, theme }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlotReady, setIsPlotReady] = useState(false);

    // Expose download and reset handles to parent
    useImperativeHandle(ref, () => ({
      downloadPNG: async (filename = 'math2code_plot') => {
        if (!containerRef.current) return;
        try {
          await Plotly.downloadImage(containerRef.current, {
            format: 'png',
            width: 1200,
            height: 750,
            filename: filename.endsWith('.png') ? filename.slice(0, -4) : filename
          });
        } catch (err) {
          console.error('Failed to download PNG:', err);
        }
      },
      resetView: () => {
        if (!containerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Plotly.relayout(containerRef.current, {
          'xaxis.range': [domain.xMin, domain.xMax],
          'yaxis.autorange': true
        } as any);
      }
    }));

    // Render or update plot using Plotly.react
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const isDark = theme === 'dark';
      const bgColor = isDark ? 'rgba(7, 11, 22, 0.45)' : 'rgba(255, 255, 255, 0.45)';
      const paperColor = 'transparent';
      const textColor = isDark ? '#94a3b8' : '#475569';
      const gridColor = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.7)';
      const zeroColor = isDark ? 'rgba(100, 116, 139, 0.6)' : 'rgba(148, 163, 184, 0.8)';

      // Build plot traces
      const visibleCurves = curves.filter((c) => c.visible && !c.hasError && c.points.length > 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = visibleCurves.map((c) => ({
        x: c.points.map((p) => p.x),
        y: c.points.map((p) => p.y), // null values create gaps across singularities
        type: 'scatter',
        mode: 'lines',
        name: `${c.name}`,
        line: {
          color: c.color,
          width: 2.5
        },
        connectgaps: false, // Critical: never join across undefined points or singularities
        hovertemplate: `<b>${c.name}</b><br>x: %{x:.4f}<br>y: %{y:.4f}<extra></extra>`
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layout: any = {
        autosize: true,
        height: 480,
        margin: { l: 60, r: 30, t: 30, b: 65 },
        paper_bgcolor: paperColor,
        plot_bgcolor: bgColor,
        font: {
          family: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          color: textColor,
          size: 11
        },
        xaxis: {
          title: {
            text: 'x',
            font: { size: 13, color: textColor }
          },
          range: [domain.xMin, domain.xMax],
          gridcolor: gridColor,
          zeroline: true,
          zerolinecolor: zeroColor,
          zerolinewidth: 1.5,
          tickfont: { color: textColor }
        },
        yaxis: {
          title: {
            text: 'f(x)',
            font: { size: 13, color: textColor }
          },
          autorange: true,
          gridcolor: gridColor,
          zeroline: true,
          zerolinecolor: zeroColor,
          zerolinewidth: 1.5,
          tickfont: { color: textColor }
        },
        legend: {
          orientation: 'h',
          y: -0.22,
          x: 0.5,
          xanchor: 'center',
          font: { color: textColor, size: 11 }
        },
        hovermode: 'closest'
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        toImageButtonOptions: {
          format: 'png',
          filename: 'math2code_plot',
          height: 800,
          width: 1200,
          scale: 2
        }
      };

      Plotly.react(container, data, layout, config).then(() => {
        setIsPlotReady(true);
      });

      // Handle window resize
      const handleResize = () => {
        if (container) {
          Plotly.Plots.resize(container);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [curves, domain, theme]);

    // Clean up Plotly instance on unmount
    useEffect(() => {
      const container = containerRef.current;
      return () => {
        if (container) {
          Plotly.purge(container);
        }
      };
    }, []);

    const hasVisibleCurves = curves.some((c) => c.visible && !c.hasError && c.points.length > 0);

    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div ref={containerRef} className="w-full min-h-[480px]" />

        {!hasVisibleCurves && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xs pointer-events-none p-6 text-center">
            <div className="max-w-xs space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No active curves to display
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter a valid mathematical expression in the controls panel to compute and display real coordinates.
              </p>
            </div>
          </div>
        )}

        {hasVisibleCurves && !isPlotReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs pointer-events-none">
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 animate-pulse">
              Computing analytical samples...
            </span>
          </div>
        )}
      </div>
    );
  }
);

PlotVisualizer.displayName = 'PlotVisualizer';
