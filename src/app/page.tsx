'use client';

import * as React from 'react';
import {useState} from 'react';
import {generateInteriorDesign} from '@/ai/flows/generate-interior-design';
import {iterateDesignBasedOnFeedback} from '@/ai/flows/iterate-design-based-on-feedback';
import {useToast} from '@/hooks/use-toast';
import Header from '@/components/app/Header';
import ChatPanel from '@/components/app/ChatPanel';
import DesignView from '@/components/app/DesignView';
import ControlsPanel from '@/components/app/ControlsPanel';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Design {
  imageUrl: string;
  prompt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imagePreview?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [history, setHistory] = useState<Design[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Welcome to ISpace! How can I help you design your perfect room today?',
    },
  ]);
  const {toast} = useToast();
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const handleSendMessage = async (prompt: string, image?: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      imagePreview: image,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await generateInteriorDesign({textPrompt: prompt, imagePrompt: image});
      const newDesign: Design = {imageUrl: result.imageUrl, prompt: prompt};
      setCurrentDesign(newDesign);
      setHistory(prev => [newDesign, ...prev]);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Excellent choice! Do you have any specific colors or furniture styles in mind?',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating design:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate design. Please try again.',
      });
      const aiErrorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: "I'm sorry, I couldn't generate a design. Please try again.",
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIterate = async (feedback: string) => {
    if (!currentDesign) return;
    setIsLoading(true);
    try {
      const result = await iterateDesignBasedOnFeedback({
        feedback: feedback,
        photoDataUri: currentDesign.imageUrl,
      });
      const newDesign: Design = {imageUrl: result.refinedDesignDataUri, prompt: `Refined: ${feedback}`};
      setCurrentDesign(newDesign);
      setHistory(prev => [newDesign, ...prev]);
      toast({
        title: 'Design Refined',
        description: 'The design has been updated based on your feedback.',
      });
    } catch (error) {
      console.error('Error iterating design:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to refine design. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVersion = (design: Design) => {
    setCurrentDesign(design);
    toast({
      title: 'History Loaded',
      description: 'A previous version of the design has been loaded.',
    });
  };

  const handleExport = () => {
    if (!currentDesign?.imageUrl) return;
    const link = document.createElement('a');
    link.href = currentDesign.imageUrl;
    // Extract file extension from data URI if possible
    const mimeType = currentDesign.imageUrl.match(/data:image\/([a-zA-Z+]+);/);
    const extension = mimeType ? mimeType[1] : 'png';
    link.download = `ispace-design-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div
        className="transition-all duration-300 flex-shrink-0"
        style={{ width: isLeftPanelOpen ? '380px' : '0px' }}
      >
        {isLeftPanelOpen && (
          <div className="w-[380px] bg-secondary/50 h-full">
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header onExport={handleExport} />
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background rounded-l-none rounded-r-full h-24 w-8"
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          >
            {isLeftPanelOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>

          <DesignView design={currentDesign} isLoading={isLoading} />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background rounded-r-none rounded-l-full h-24 w-8"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          >
            {isRightPanelOpen ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
        </div>
      </main>

      <div
        className="transition-all duration-300 flex-shrink-0"
        style={{ width: isRightPanelOpen ? '380px' : '0px' }}
      >
        {isRightPanelOpen && (
          <div className="w-[380px] bg-secondary/50 h-full">
            <ControlsPanel
              history={history}
              onSelectVersion={handleSelectVersion}
              onIterate={handleIterate}
              canIterate={!!currentDesign && !isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
