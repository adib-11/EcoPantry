import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ScoreBreakdownProps {
  breakdown: {
    inventoryManagement: number;
    loggingConsistency: number;
    wasteReduction: number;
    diversity: number;
  };
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const data = [
    {
      category: 'Inventory',
      value: breakdown.inventoryManagement,
      fullMark: 100,
    },
    {
      category: 'Logging',
      value: breakdown.loggingConsistency,
      fullMark: 100,
    },
    {
      category: 'Waste',
      value: breakdown.wasteReduction,
      fullMark: 100,
    },
    {
      category: 'Diversity',
      value: breakdown.diversity,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">Score Breakdown</h4>
      
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground) / 0.2)" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend with values */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
        >
          <span className="text-muted-foreground">Inventory</span>
          <span className="font-semibold">{breakdown.inventoryManagement}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
        >
          <span className="text-muted-foreground">Logging</span>
          <span className="font-semibold">{breakdown.loggingConsistency}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
        >
          <span className="text-muted-foreground">Waste</span>
          <span className="font-semibold">{breakdown.wasteReduction}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
        >
          <span className="text-muted-foreground">Diversity</span>
          <span className="font-semibold">{breakdown.diversity}</span>
        </motion.div>
      </div>
    </div>
  );
}
