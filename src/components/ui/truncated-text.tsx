
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  showMoreButton?: boolean;
  isOption?: boolean;
}

const TruncatedText = ({ 
  text, 
  maxLength = 150,
  showMoreButton = true,
  isOption = false
}: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const isLongText = text.length > maxLength;
  
  if (!isLongText) return <>{text}</>;
  
  // For mobile/tablet: show truncated text with "Show more" button if showMoreButton is true
  if (isMobile) {
    // For options, just show truncated text without Show more button
    if (isOption) {
      return <span>{text.substring(0, maxLength)}...</span>;
    }
    
    return (
      <div>
        {isExpanded ? (
          <>
            <span>{text}</span>
            {showMoreButton && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs font-medium ml-1" 
                onClick={() => setIsExpanded(false)}
              >
                Show less
              </Button>
            )}
          </>
        ) : (
          <>
            <span>{text.substring(0, maxLength)}...</span>
            {showMoreButton && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs font-medium ml-1" 
                onClick={() => setIsExpanded(true)}
              >
                Show more
              </Button>
            )}
          </>
        )}
      </div>
    );
  }
  
  // For desktop: use tooltip if for options, otherwise use expand/collapse
  if (isOption) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{text.substring(0, maxLength)}...</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-md">
            <ScrollArea className="max-h-[300px] overflow-auto">
              {text}
            </ScrollArea>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <div>
        {isExpanded ? (
          <>
            <span>{text}</span>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs font-medium ml-1" 
              onClick={() => setIsExpanded(false)}
            >
              Show less
            </Button>
          </>
        ) : (
          <>
            <span>{text.substring(0, maxLength)}...</span>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs font-medium ml-1" 
              onClick={() => setIsExpanded(true)}
            >
              Show more
            </Button>
          </>
        )}
      </div>
    );
  }
};

export default TruncatedText;
