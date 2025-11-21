import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface NextStepsCardProps {
  nextSteps: string[];
}

export function NextStepsCard({ nextSteps }: NextStepsCardProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      
      // Save to localStorage
      localStorage.setItem('sdg-checked-steps', JSON.stringify(Array.from(newSet)));
      
      return newSet;
    });
  };

  if (!nextSteps || nextSteps.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        You're doing great! Keep up the good work.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Target className="h-4 w-4" />
        Next Steps to Improve
      </h4>
      <div className="space-y-2">
        {nextSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              checkedSteps.has(index) 
                ? 'bg-muted/50 border-muted' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <Checkbox
              id={`step-${index}`}
              checked={checkedSteps.has(index)}
              onCheckedChange={() => toggleStep(index)}
              className="mt-0.5"
            />
            <label
              htmlFor={`step-${index}`}
              className={`flex-1 text-sm cursor-pointer ${
                checkedSteps.has(index) 
                  ? 'text-muted-foreground line-through' 
                  : 'text-foreground'
              }`}
            >
              {step}
            </label>
            {!checkedSteps.has(index) && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
      
      {checkedSteps.size > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg"
        >
          <span className="font-medium">
            🎉 {checkedSteps.size}/{nextSteps.length} steps completed!
          </span>
        </motion.div>
      )}
    </div>
  );
}
