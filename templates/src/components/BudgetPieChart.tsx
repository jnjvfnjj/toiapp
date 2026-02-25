import { BudgetItem } from '../App';
import { useTranslations } from '../i18n/translations';

interface BudgetPieChartProps {
  budgetItems: BudgetItem[];
}

export function BudgetPieChart({ budgetItems }: BudgetPieChartProps) {
  const t = useTranslations();

  const categories = [
    { id: 'venue', color: '#1FB6B4' },
    { id: 'food', color: '#FF6B6B' },
    { id: 'decor', color: '#D4A017' },
    { id: 'music', color: '#4ECDC4' },
    { id: 'photo', color: '#3B6EA5' },
    { id: 'other', color: '#95A5A6' }
  ];

  // Group items by category
  const groupedData = categories.map(cat => {
    const items = budgetItems.filter(item => item.category === cat.id);
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    return { ...cat, amount: total };
  }).filter(cat => cat.amount > 0);

  const totalAmount = groupedData.reduce((sum, cat) => sum + cat.amount, 0);

  if (totalAmount === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>{t.budgetPie.noData}</p>
      </div>
    );
  }

  // Calculate percentages and angles
  let currentAngle = 0;
  const segments = groupedData.map(cat => {
    const percentage = (cat.amount / totalAmount) * 100;
    const angle = (cat.amount / totalAmount) * 360;
    const segment = {
      ...cat,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  // Create SVG path for each segment
  const createArcPath = (startAngle: number, endAngle: number, radius: number = 80) => {
    const centerX = 100;
    const centerY = 100;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={createArcPath(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            </g>
          ))}
          {/* Center circle for donut effect */}
          <circle cx="100" cy="100" r="50" fill="white" />
          <text x="100" y="95" textAnchor="middle" className="fill-foreground text-sm">
            {t.budgetPie.expenses}
          </text>
          <text x="100" y="110" textAnchor="middle" className="fill-primary text-xs">
            {totalAmount.toLocaleString()} {t.budgetPie.currency}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-foreground">{(t.budgetScreen as any)[segment.id] ?? segment.id}</span>
            </div>
            <div className="text-right">
              <p className="text-foreground">{segment.amount.toLocaleString()} {t.budgetPie.currency}</p>
              <p className="text-muted-foreground">{segment.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
