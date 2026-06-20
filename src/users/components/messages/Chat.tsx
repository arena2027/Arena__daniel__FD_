import type { Chat as ChatType } from './types';
import { Conversation } from './Conversation';
import { ChatWindow } from './ChatWindow';

// ── Mock Data ─────────────────────────────────────────────────
export const mockChats: ChatType[] = [
  {
    id: 'c1', name: 'John Pulse', handle: '@johnpulse',
    lastMessage: 'Did you see that goal last night? 🔥', time: '2m ago', unread: 3, online: true,
    messages: [
      { id: 'm1', text: 'Hey! Did you watch the match last night?', time: '20:01', mine: false },
      { id: 'm2', text: 'Yes! That goal was absolutely insane 🔥', time: '20:03', mine: true },
      { id: 'm3', text: 'Haaland is on another level this season', time: '20:04', mine: false },
      { id: 'm4', text: 'Did you see that goal last night? 🔥', time: '20:10', mine: false },
    ],
  },
  {
    id: 'c2', name: 'Sarah Kicks', handle: '@sarahkicks',
    lastMessage: 'I told you Liverpool would win 😂', time: '1h ago', unread: 0, online: true,
    messages: [
      { id: 'm1', text: 'Liverpool are going to smash Arsenal today', time: '15:00', mine: false },
      { id: 'm2', text: 'No way, Arsenal are in great form', time: '15:02', mine: true },
      { id: 'm3', text: 'I told you Liverpool would win 😂', time: '17:45', mine: false },
    ],
  },
  {
    id: 'c3', name: 'NBA Central', handle: '@nbacentral',
    lastMessage: 'Lakers vs Warriors tonight. You watching?', time: '2h ago', unread: 1, online: false,
    messages: [
      { id: 'm1', text: 'Lakers vs Warriors tonight. You watching?', time: '14:00', mine: false },
      { id: 'm2', text: 'Definitely! Big game tonight', time: '14:05', mine: true },
    ],
  },
  {
    id: 'c4', name: 'Transfer News', handle: '@transfernews',
    lastMessage: 'Big signing incoming tomorrow 👀', time: '3h ago', unread: 0, online: false,
    messages: [
      { id: 'm1', text: 'Big signing incoming tomorrow 👀', time: '12:00', mine: false },
      { id: 'm2', text: 'Who is it?? Tell me!', time: '12:01', mine: true },
      { id: 'm3', text: "Can't say yet. Watch this space 🤫", time: '12:03', mine: false },
    ],
  },
  {
    id: 'c5', name: 'UCL King', handle: '@uclking',
    lastMessage: 'Real Madrid to win the UCL. Final answer.', time: '5h ago', unread: 0, online: true,
    messages: [
      { id: 'm1', text: 'Who do you think wins the UCL this year?', time: '10:00', mine: true },
      { id: 'm2', text: 'Real Madrid to win the UCL. Final answer.', time: '10:05', mine: false },
    ],
  },
];

interface ChatProps {
  isDesktop: boolean;
  activeChat: ChatType | null;
  onSelectChat: (chat: ChatType | null) => void;
  onBack: () => void;
}

export function Chat({ isDesktop, activeChat, onSelectChat, onBack }: ChatProps) {
  if (activeChat && !isDesktop) {
    return <ChatWindow chat={activeChat} onBack={onBack} />;
  }

  return (
    <div className="h-full flex overflow-hidden rounded-[28px] border border-[#1f1f1f] bg-[#070708] shadow-lg">
      <Conversation chats={mockChats} activeChat={activeChat} onSelectChat={onSelectChat} />
      
      <section className="hidden md:flex flex-1 flex-col bg-[#0b141a]">
        {activeChat ? (
          <ChatWindow chat={activeChat} onBack={() => onSelectChat(null)} />
        ) : (
          <div className="flex h-full items-center justify-center text-[#71767b]">
            Select a conversation to view the thread.
          </div>
        )}
      </section>
    </div>
  );
}
