'use client';

import {useState, type FC} from 'react';
import Image from 'next/image';
import type {Design} from '@/app/page';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ThumbsUp, ThumbsDown, History, Wand2} from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Controls</h2>
        <p className="text-sm text-muted-foreground">Refine your design.</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wand2 className="h-5 w-5" />
                Refine Current Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">How do you feel about the current design?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={sentiment === 'love' ? 'default' : 'outline'}
                  onClick={() => setSentiment('love')}
                  disabled={!canIterate}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> I Love It!
                </Button>
                <Button
                  variant={sentiment === 'not_quite' ? 'destructive' : 'outline'}
                  onClick={() => setSentiment('not_quite')}
                  disabled={!canIterate}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> Not Quite
                </Button>
              </div>
              <Textarea
                placeholder="Add more details... e.g., 'Make it more modern' or 'Add a plant in the corner.'"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                disabled={!canIterate}
                className="bg-background"
              />
              <Button onClick={handleIterate} disabled={!canIterate || (!feedback && !sentiment)}>
                Refine with AI
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((design, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => onSelectVersion(design)}
                    >
                      <Image
                        src={design.imageUrl}
                        alt={`Version ${history.length - index}`}
                        width={64}
                        height={64}
                        className="rounded-md object-cover aspect-square border"
                        data-ai-hint="interior design thumbnail"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Version {history.length - index}</p>
                        <p className="text-xs text-muted-foreground truncate">{design.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Your design versions will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ControlsPanel;
