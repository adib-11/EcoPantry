import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ScoreGauge({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: ScoreGaugeProps) {
  // Validate score (0-100)
  const validScore = Math.max(0, Math.min(100, score));
  
  // Size configurations
  const sizes = {
    sm: { radius: 60, strokeWidth: 8, fontSize: 'text-2xl' },
    md: { radius: 80, strokeWidth: 12, fontSize: 'text-4xl' },
    lg: { radius: 100, strokeWidth: 16, fontSize: 'text-5xl' },
  };
  
  const { radius, strokeWidth, fontSize } = sizes[size];
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const halfCircumference = circumference / 2;
  
  // Calculate stroke dash offset for semi-circle (180 degrees)
  const strokeDashoffset = halfCircumference - (validScore / 100) * halfCircumference;
  
  // Color based on score
  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-600';
    if (score >= 41) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getScoreStroke = (score: number) => {
    if (score >= 71) return 'stroke-green-600';
    if (score >= 41) return 'stroke-amber-600';
    return 'stroke-red-600';
  };
  
  const scoreColor = getScoreColor(validScore);
  const strokeColor = getScoreStroke(validScore);

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: radius * 2, height: radius + 20 }}>
        <svg
          height={radius + 20}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth} ${radius} 
                A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Foreground arc (animated) */}
          <motion.path
            d={`M ${strokeWidth} ${radius} 
                A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
            fill="none"
            className={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            initial={{ strokeDashoffset: halfCircumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center transform translate-y-2">
          <motion.span
            className={cn('font-bold', fontSize, scoreColor)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {validScore}
          </motion.span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>
      
      {showLabel && (
        <motion.p
          className="mt-2 text-sm font-medium text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Sustainability Score
        </motion.p>
      )}
    </div>
  );
}
