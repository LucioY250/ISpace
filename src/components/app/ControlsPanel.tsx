'use client';

import {useState, type FC} from 'react';
import Image from 'next/image';
import type {Design} from '@/app/page';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ThumbsUp, ThumbsDown, Wand2, HistoryIcon} from 'lucide-react';

interface ControlsPanelProps {
  history: Design[];
  onSelectVersion: (design: Design) => void;
  onIterate: (feedback: string) => void;
  canIterate: boolean;
}

const ControlsPanel: FC<ControlsPanelProps> = ({
  history,
  onSelectVersion,
  onIterate,
  canIterate,
}) => {
  const [feedback, setFeedback] = useState('');
  const [sentiment, setSentiment] = useState<'love' | 'not_quite' | null>(null);

  const handleIterate = () => {
    let fullFeedback = feedback;
    if (sentiment) {
      fullFeedback = `Sentiment: ${
        sentiment === 'love' ? 'Positive' : 'Negative'
      }. Feedback: ${feedback}`;
    }
    onIterate(fullFeedback);
    setFeedback('');
    setSentiment(null);
  };

  const handleGenerateNew = () => {
    onIterate(feedback);
    setFeedback('');
    setSentiment(null);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Controls</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Iterate Design</h3>
            <Button onClick={handleGenerateNew} disabled={!canIterate} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate New Version
            </Button>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSentiment('love')}
                  disabled={!canIterate}
                  className={`flex flex-col h-auto p-4 gap-2 border-2 ${sentiment === 'love' ? 'border-primary bg-primary/10' : 'border-border'}`}
                >
                  <ThumbsUp className="h-6 w-6" />
                  <span>Love it!</span>
                </Button>
                <Button
                   variant="ghost"
                   onClick={() => setSentiment('not_quite')}
                   disabled={!canIterate}
                   className={`flex flex-col h-auto p-4 gap-2 border-2 ${sentiment === 'not_quite' ? 'border-destructive bg-destructive/10' : 'border-border'}`}
                >
                  <ThumbsDown className="h-6 w-6" />
                  <span>Not quite</span>
                </Button>
            </div>
             <Textarea
                placeholder="Add more details... e.g., 'Make it more modern' or 'Add a plant in the corner.'"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                disabled={!canIterate}
                className="bg-input mt-4"
              />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">History</h3>
            <div className="space-y-2">
              {history.length > 0 ? (
                  history.map((design, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors border-2 ${
                        history[0] === design ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'
                      }`}
                      onClick={() => onSelectVersion(design)}
                    >
                      <Image
                        src={design.imageUrl}
                        alt={`Version ${history.length - index}`}
                        width={64}
                        height={64}
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint="interior design thumbnail"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Version {history.length - index}</p>
                        <p className="text-xs text-muted-foreground">{history[0] === design ? 'Current' : `${index+1} hours ago`}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Your design versions will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ControlsPanel;
