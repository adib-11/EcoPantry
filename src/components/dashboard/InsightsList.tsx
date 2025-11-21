import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface InsightsListProps {
  insights: string[];
}

export function InsightsList({ insights }: InsightsListProps) {
  // Determine icon and color based on insight content
  const getInsightType = (insight: string) => {
    const lowerInsight = insight.toLowerCase();
    
    if (lowerInsight.includes('great') || lowerInsight.includes('excellent') || 
        lowerInsight.includes('well done') || lowerInsight.includes('above average')) {
      return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' };
    }
    
    if (lowerInsight.includes('consider') || lowerInsight.includes('try') || 
        lowerInsight.includes('waste') || lowerInsight.includes('expired')) {
      return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' };
    }
    
    return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No insights available yet. Keep tracking your meals!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        💡 AI Insights
      </h4>
      <div className="space-y-2">
        {insights.map((insight, index) => {
          const { icon: Icon, color, bg } = getInsightType(insight);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.3 }}
              className={`flex items-start gap-3 p-3 rounded-lg ${bg} border border-opacity-20`}
            >
              <Icon className={`h-5 w-5 ${color} flex-shrink-0 mt-0.5`} />
              <p className="text-sm text-foreground flex-1">{insight}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
