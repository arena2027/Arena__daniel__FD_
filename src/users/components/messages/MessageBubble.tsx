import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export interface Message {
  id: string;
  text: string;
  time: string;
  mine: boolean;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className={cn('flex', message.mine ? 'justify-end' : 'justify-start')}
    >
      <div className={cn(
        'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
        message.mine
          ? 'bg-[#ef4444] text-white rounded-br-sm shadow-md'
          : 'bg-[#111] text-[#e7e9ea] border border-[#1f1f1f] rounded-bl-sm'
      )}>
        <p className="font-medium">{message.text}</p>
        <p className={cn('text-[10px] mt-1.5', message.mine ? 'text-white/50' : 'text-[#71767b]')}>
          {message.time}
        </p>
      </div>
    </motion.div>
  );
}
