import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScoreBreakdown } from './ScoreBreakdown';
import { InsightsList } from './InsightsList';
import { NextStepsCard } from './NextStepsCard';
import aiService from '@/services/aiService';

interface SDGScoreCardProps {
  userId: string;
}

interface ScoreData {
  score: number;
  previousScore: number | null;
  trend: 'improving' | 'declining' | 'stable';
  breakdown: {
    inventoryManagement: number;
    loggingConsistency: number;
    wasteReduction: number;
    diversity: number;
  };
  insights: string[];
  nextSteps: string[];
}

export function SDGScoreCard({ userId }: SDGScoreCardProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchScore = async (showRefreshToast = false) => {
    try {
      setIsRefreshing(true);
      const data = await aiService.getSDGScore(userId);
      setScoreData(data);

      // Show confetti if score improved
      if (data.previousScore !== null && data.score > data.previousScore) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#84cc16', '#10b981'],
        });

        if (showRefreshToast) {
          toast({
            title: '🎉 Score Improved!',
            description: `Your score increased by ${data.score - data.previousScore} points!`,
          });
        }
      }

      if (showRefreshToast && data.score === data.previousScore) {
        toast({
          title: 'Score Updated',
          description: 'Your score remains the same. Keep up the good work!',
        });
      }
    } catch (error) {
      console.error('Failed to fetch score:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate score. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        Unable to load breakdown. Please try again.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Score Breakdown - Radar Chart */}
      <div>
        <ScoreBreakdown breakdown={scoreData.breakdown} />
      </div>

      {/* AI Insights */}
      <div className="pt-4 border-t">
        <InsightsList insights={scoreData.insights} />
      </div>

      {/* Next Steps */}
      <div className="pt-4 border-t">
        <NextStepsCard nextSteps={scoreData.nextSteps} />
      </div>

      {/* Refresh Button at bottom */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchScore(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh AI Analysis
        </Button>
      </div>
    </motion.div>
  );
}
