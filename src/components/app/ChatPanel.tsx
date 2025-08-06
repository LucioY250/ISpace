'use client';
import {useState, useRef, useEffect, type FC} from 'react';
import Image from 'next/image';
import type {Message} from '@/app/page';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Send, Image as ImageIcon, CornerDownLeft, X} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (prompt: string, image?: string) => void;
  isLoading: boolean;
}

const ChatPanel: FC<ChatPanelProps> = ({messages, onSendMessage, isLoading}) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({top: scrollAreaRef.current.scrollHeight, behavior: 'smooth'});
    }
  }, [messages]);

  const handleSend = () => {
    if (prompt.trim() || image) {
      onSendMessage(prompt, image ?? undefined);
      setPrompt('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto">
                <h1 className="text-2xl font-bold">ISpace</h1>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Home</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
              <DropdownMenuItem>Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`w-fit max-w-sm rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-input text-foreground rounded-bl-none border border-border'
                }`}
              >
                {message.imagePreview && (
                  <Image
                    src={message.imagePreview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="rounded-md mb-2"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-fit max-w-sm rounded-lg px-4 py-2 bg-input border border-border">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        {image && (
          <div className="relative mb-2 w-fit">
            <Image src={image} alt="Preview" width={80} height={80} className="rounded-md" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            id="file-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Upload image</span>
          </button>
          <Input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="h-12 rounded-full bg-input border-border pl-10 pr-12 focus:ring-accent"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || (!prompt.trim() && !image)}
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
