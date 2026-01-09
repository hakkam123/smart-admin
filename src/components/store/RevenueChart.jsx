'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function RevenueChart({ period }) {
  const { getToken } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping periode dari bahasa Indonesia ke format API
  const periodMapping = {
    '7 hari': '7d',
    '1 bulan': '1m',
    '3 bulan': '3m',
    '6 bulan': '6m',
    '1 tahun': '1y'
  };

  const fetchChartData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();

      // Buat URL dengan parameter period jika ada
      let url = `${baseUrl}/api/store/dashboard`;
      if (period && periodMapping[period]) {
        url += `?period=${periodMapping[period]}`;
      }

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChartData(data.dashboardData.chartData || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true); // Set loading saat period berubah
    fetchChartData();
  }, [period]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Hitung max value untuk scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const chartHeight = 200;
  const chartWidth = 400;
  const pointSpacing = chartWidth / (chartData.length || 1);

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="h-80 relative">
      <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} 250`}>
        {/* Chart Grid */}
        <defs>
          <pattern id="grid" width={pointSpacing} height="40" patternUnits="userSpaceOnUse">
            <path d={`M ${pointSpacing} 0 L 0 0 0 40`} fill="none" stroke="#f3f4f6" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Chart Line */}
        <polyline
          fill="none"
          stroke="#ea580c"
          strokeWidth="3"
          points={chartData.map((point, index) => {
            const x = index * pointSpacing + pointSpacing / 2;
            const y = chartHeight - (point.value / maxValue) * (chartHeight - 50);
            return `${x},${y}`;
          }).join(' ')}
        />

        {/* Chart Area Fill */}
        <polygon
          fill="url(#gradient)"
          opacity="0.2"
          points={
            chartData.map((point, index) => {
              const x = index * pointSpacing + pointSpacing / 2;
              const y = chartHeight - (point.value / maxValue) * (chartHeight - 50);
              return `${x},${y}`;
            }).join(' ') +
            ` ${chartWidth},${chartHeight} 0,${chartHeight}`
          }
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Chart Points */}
        {chartData.map((point, index) => {
          const x = index * pointSpacing + pointSpacing / 2;
          const y = chartHeight - (point.value / maxValue) * (chartHeight - 50);
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#ea580c"
                className="hover:r-6 transition-all cursor-pointer"
              />
              {/* Tooltip on hover */}
              <title>{`${point.label}: Rp ${point.value.toLocaleString('id-ID')}`}</title>
            </g>
          );
        })}

        {/* X-axis labels */}
        {chartData.map((point, index) => (
          <text
            key={index}
            x={index * pointSpacing + pointSpacing / 2}
            y="240"
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {point.label}
          </text>
        ))}

        {/* Y-axis value indicators */}
        <text x="5" y="20" className="text-xs fill-gray-400">
          Rp {formatCurrency(maxValue)}
        </text>
        <text x="5" y={chartHeight / 2} className="text-xs fill-gray-400">
          Rp {formatCurrency(maxValue / 2)}
        </text>
      </svg>
    </div>
  );
}
