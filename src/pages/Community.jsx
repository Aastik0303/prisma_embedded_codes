import React, { useState, useRef, useEffect } from 'react';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Send, X, Search, UserPlus, Check, Trophy, Flame, Award,
  ChevronRight, Image, Smile, AtSign, Hash, Crown,
  MessageSquareDot, Users, Sparkles, ArrowLeft, Phone, Video,
  Circle, CheckCheck, Plus, Star, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Aastik Srivastava',
    username: '@aastik.dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
    badge: 'Full Stack',
    badgeColor: 'indigo',
    time: '2h ago',
    content: 'Just shipped my first full-stack project using Next.js + Prisma + Zustand 🔥 The developer experience is absolutely insane. State management went from a nightmare to pure joy. Who else is hooked on this stack?',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop',
    likes: 142,
    liked: false,
    comments: 23,
    shares: 8,
    saved: false,
    tags: ['#NextJS', '#FullStack', '#WebDev'],
    commentList: [
      { id: 1, author: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80', text: 'Zustand is a game changer! No more Redux boilerplate 🙌', time: '1h ago', liked: false, likes: 12 },
      { id: 2, author: 'Vikram Malhotra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80', text: 'Have you tried tRPC on top of that? It completes the stack perfectly', time: '45m ago', liked: false, likes: 7 },
    ]
  },
  {
    id: 2,
    author: 'Priya Sharma',
    username: '@priya.ml',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80',
    badge: 'AI/ML',
    badgeColor: 'violet',
    time: '4h ago',
    content: 'Successfully fine-tuned Llama-3 on my custom dataset using QLoRA on a single RTX 4090! 🤖 The model now writes technical documentation in our company\'s exact style. Cost me ~$2 in electricity. The future is absolutely wild.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=300&fit=crop',
    likes: 287,
    liked: true,
    comments: 41,
    shares: 19,
    saved: true,
    tags: ['#LLM', '#QLoRA', '#AIEngineering'],
    commentList: [
      { id: 1, author: 'Rahul Anand', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80', text: 'Would love a write-up on this! Which quantization bits did you use?', time: '3h ago', liked: true, likes: 24 },
    ]
  },
  {
    id: 3,
    author: 'Karan Mehta',
    username: '@karan.embedded',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?fit=facearea&facepad=2&w=256&h=256&q=80',
    badge: 'Embedded',
    badgeColor: 'cyan',
    time: '6h ago',
    content: 'Hit 5000 XP today on the Embedded Systems track 🏆 The RTOS module is no joke. If you\'re struggling with FreeRTOS task scheduling — tip: always think in terms of priority inversion. Saved my sanity.',
    image: null,
    likes: 95,
    liked: false,
    comments: 16,
    shares: 5,
    saved: false,
    tags: ['#EmbeddedSystems', '#FreeRTOS', '#Milestone'],
    commentList: [
      { id: 1, author: 'Neha Gupta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80', text: 'Congrats!! Priority inversion tip is gold 🔥', time: '5h ago', liked: false, likes: 8 },
    ]
  },
  {
    id: 4,
    author: 'Sneha Reddy',
    username: '@sneha.design',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80',
    badge: 'UI/UX',
    badgeColor: 'pink',
    time: '1d ago',
    content: 'Redesigned our onboarding flow and reduced drop-off by 34% 📈 The secret? A progress indicator at every step and reducing form fields from 8 to 3. Users don\'t want to fill forms, they want to feel welcomed.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=300&fit=crop',
    likes: 334,
    liked: false,
    comments: 58,
    shares: 27,
    saved: false,
    tags: ['#UIUX', '#ProductDesign', '#Conversion'],
    commentList: []
  }
];

const MOCK_FRIENDS = [
  { id: 1, name: 'Elena Rostova', username: '@elena.dev', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80', online: true, lastMsg: 'Have you seen the new React 19 features?', lastTime: '2m', unread: 3 },
  { id: 2, name: 'Vikram Malhotra', username: '@vikram.ml', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80', online: true, lastMsg: 'Sent you the tRPC boilerplate 🚀', lastTime: '1h', unread: 0 },
  { id: 3, name: 'Neha Gupta', username: '@neha.ui', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80', online: false, lastMsg: 'Thanks for the Figma feedback!', lastTime: '3h', unread: 1 },
  { id: 4, name: 'Rahul Anand', username: '@rahul.full', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80', online: false, lastMsg: 'Check out this GitHub repo', lastTime: '1d', unread: 0 },
];

const MOCK_SUGGESTIONS = [
  { id: 5, name: 'Arjun Patel', username: '@arjun.cloud', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80', track: 'Cloud Engineering', mutuals: 4 },
  { id: 6, name: 'Kavya Singh', username: '@kavya.sec', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=facearea&facepad=2&w=256&h=256&q=80', track: 'Cybersecurity', mutuals: 2 },
  { id: 7, name: 'Dev Narayan', username: '@dev.dsp', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?fit=facearea&facepad=2&w=256&h=256&q=80', track: 'DSP Engineering', mutuals: 6 },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 8420, streak: 47, badge: 'AI/ML Lead', delta: '+340 this week' },
  { rank: 2, name: 'Sneha Reddy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 7910, streak: 38, badge: 'Design Pro', delta: '+280 this week' },
  { rank: 3, name: 'Aastik Srivastava', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 7320, streak: 35, badge: 'Full Stack', delta: '+210 this week' },
  { rank: 4, name: 'Karan Mehta', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 6880, streak: 29, badge: 'Embedded Ace', delta: '+190 this week' },
  { rank: 5, name: 'Vikram Malhotra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 6250, streak: 22, badge: 'ML Engineer', delta: '+155 this week' },
  { rank: 6, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 5990, streak: 19, badge: 'React Dev', delta: '+130 this week' },
  { rank: 7, name: 'Rahul Anand', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80', xp: 5640, streak: 15, badge: 'Backend Dev', delta: '+95 this week' },
  { rank: 8, name: 'Arjun Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256q=80', xp: 5210, streak: 12, badge: 'Cloud Arch', delta: '+80 this week' },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Hey! Did you check out that new Next.js 15 release?', time: '10:24 AM' },
    { id: 2, from: 'me', text: 'Yes! The partial prerendering is insane 🤯', time: '10:26 AM' },
    { id: 3, from: 'them', text: 'Have you seen the new React 19 features?', time: '10:28 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Bro the tRPC + Zustand combo is 🔥', time: '9:00 AM' },
    { id: 2, from: 'me', text: 'Send me the repo link!', time: '9:02 AM' },
    { id: 3, from: 'them', text: 'Sent you the tRPC boilerplate 🚀', time: '9:05 AM' },
  ],
  3: [
    { id: 1, from: 'me', text: 'Your Figma mockup for the onboarding was great!', time: 'Yesterday' },
    { id: 2, from: 'them', text: 'Thanks for the Figma feedback!', time: 'Yesterday' },
  ],
};

// ─── Badge Color Util ─────────────────────────────────────────────────────────
const badgeStyles = {
  indigo: 'bg-indigo-500/10 text-indigo-500',
  violet: 'bg-violet-500/10 text-violet-500',
  cyan: 'bg-cyan-500/10 text-cyan-400',
  pink: 'bg-pink-500/10 text-pink-400',
};

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onOpenComments }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [heartPop, setHeartPop] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-darknavy-card" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{post.author}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${badgeStyles[post.badgeColor]}`}>{post.badge}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400">{post.username}</span>
              <span className="text-slate-300 dark:text-slate-600 text-[10px]">·</span>
              <span className="text-[11px] text-slate-400">{post.time}</span>
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{post.content}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img src={post.image} alt="post" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Stats row */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 text-[11px] text-slate-400">
        <span>{likeCount.toLocaleString()} likes</span>
        <div className="flex gap-2">
          <span>{post.comments} comments</span>
          <span>·</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-2 pb-2 flex items-center border-t border-slate-200/40 dark:border-slate-800/30">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all text-xs font-semibold ${liked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
            }`}
        >
          <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-current scale-110' : ''}`} />
          <span>Like</span>
          <AnimatePresence>
            {heartPop && (
              <motion.div
                initial={{ scale: 0, opacity: 1, y: 0 }}
                animate={{ scale: 1.5, opacity: 0, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 text-rose-500 pointer-events-none"
              >
                <Heart className="w-5 h-5 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Comment */}
        <button
          onClick={() => onOpenComments(post)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {/* Save */}
        <button
          onClick={() => setSaved(p => !p)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${saved ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
            }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          <span>Save</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Comments Drawer ──────────────────────────────────────────────────────────
function CommentsDrawer({ post, onClose }) {
  const [comments, setComments] = useState(post?.commentList || []);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (post) setComments(post.commentList);
  }, [post]);

  const submit = () => {
    if (!input.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(),
      author: 'You (Explorer)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
      text: input,
      time: 'just now',
      liked: false,
      likes: 0
    }]);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-darknavy-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/50 dark:border-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Comments</h3>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {comments.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">No comments yet — be the first! 👇</div>
              )}
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.avatar} alt={c.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">{c.author}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{c.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                      <button className="text-[10px] font-semibold text-slate-400 hover:text-rose-500 transition-colors">Like</button>
                      <button className="text-[10px] font-semibold text-slate-400 hover:text-indigo-500 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2.5 items-center">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent text-xs text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                />
                <button onClick={submit} className={`transition-colors ${input.trim() ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Chat Conversation View ───────────────────────────────────────────────────
function ChatConversation({ friend, onBack }) {
  const [msgs, setMsgs] = useState(MOCK_MESSAGES[friend.id] || []);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now(), from: 'me', text: input, time: 'now' }]);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/50 dark:border-slate-800/50">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="relative">
          <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
          {friend.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-darknavy-card" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{friend.name}</p>
          <p className="text-[10px] text-slate-400">{friend.online ? '🟢 Active now' : 'Offline'}</p>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <Video className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {msgs.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'them' && (
              <img src={friend.avatar} alt="" className="w-6 h-6 rounded-full object-cover mr-1.5 self-end shrink-0" />
            )}
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.from === 'me'
                ? 'bg-indigo-500 text-white rounded-br-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm'
              }`}>
              {msg.text}
              <div className={`flex items-center gap-1 mt-0.5 text-[9px] ${msg.from === 'me' ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                {msg.time}
                {msg.from === 'me' && <CheckCheck className="w-2.5 h-2.5" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Message..."
            className="flex-1 bg-transparent text-[11px] text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
          />
          <button className="text-slate-400 hover:text-indigo-500 transition-colors">
            <Smile className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={send}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function RightSidebar({ onOpenLeaderboard }) {
  const [view, setView] = useState('home'); // 'home' | 'chat' | 'addfriend'
  const [activeFriend, setActiveFriend] = useState(null);
  const [friendRequests, setFriendRequests] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const openChat = (friend) => {
    setActiveFriend(friend);
    setView('chat');
  };

  const sendRequest = (id) => {
    setFriendRequests(prev => ({ ...prev, [id]: 'sent' }));
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden">
      {/* ── Chat/Friends Home ── */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            {/* Header tabs */}
            <div className="px-4 pt-4 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <MessageSquareDot className="w-4 h-4 text-indigo-500" />
                  Messages
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setView('addfriend')}
                    className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors"
                    title="Add Friends"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="flex-1 bg-transparent text-[11px] text-slate-700 dark:text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Friends list */}
            <div className="flex-1 overflow-y-auto">
              {MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(friend => (
                <button
                  key={friend.id}
                  onClick={() => openChat(friend)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                    {friend.online
                      ? <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-darknavy-card" />
                      : <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-darknavy-card" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[12px] text-slate-900 dark:text-white truncate">{friend.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{friend.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{friend.lastMsg}</p>
                  </div>
                  {friend.unread > 0 && (
                    <div className="w-4.5 h-4.5 min-w-[18px] bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {friend.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Leaderboard Button */}
            <div className="p-3 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={onOpenLeaderboard}
                className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 hover:from-amber-500/15 hover:via-indigo-500/15 hover:to-violet-500/15 border border-amber-500/20 rounded-xl px-3.5 py-3 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm shadow-amber-500/30">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[11px] text-slate-900 dark:text-white">XP Leaderboard</p>
                    <p className="text-[10px] text-slate-400">Top 8 students this week</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Chat View ── */}
        {view === 'chat' && activeFriend && (
          <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            <ChatConversation friend={activeFriend} onBack={() => { setActiveFriend(null); setView('home'); }} />
          </motion.div>
        )}

        {/* ── Add Friends View ── */}
        {view === 'addfriend' && (
          <motion.div key="addfriend" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-200/40 dark:border-slate-800/40">
              <button onClick={() => setView('home')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> Add Friends
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {/* Search bar */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input placeholder="Search by name or username..." className="flex-1 bg-transparent text-[11px] text-slate-700 dark:text-white outline-none placeholder:text-slate-400" />
              </div>

              {/* Already friends */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">Your Friends · {MOCK_FRIENDS.length}</p>
                <div className="space-y-2">
                  {MOCK_FRIENDS.map(f => (
                    <div key={f.id} className="flex items-center gap-3">
                      <div className="relative">
                        <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-full object-cover" />
                        {f.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-darknavy-card" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[12px] text-slate-900 dark:text-white truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-400">{f.username}</p>
                      </div>
                      <button
                        onClick={() => openChat(f)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-semibold hover:bg-indigo-50 hover:text-indigo-500 dark:hover:bg-indigo-500/10 transition-colors"
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> People You May Know
                </p>
                <div className="space-y-3">
                  {MOCK_SUGGESTIONS.map(s => (
                    <div key={s.id} className="p-3 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[12px] text-slate-900 dark:text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.track}</p>
                        <p className="text-[10px] text-indigo-400 mt-0.5">{s.mutuals} mutual friends</p>
                      </div>
                      <button
                        onClick={() => sendRequest(s.id)}
                        disabled={!!friendRequests[s.id]}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${friendRequests[s.id]
                            ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/20'
                          }`}
                      >
                        {friendRequests[s.id] ? <><Check className="w-3 h-3" /> Sent</> : <><UserPlus className="w-3 h-3" /> Add</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Leaderboard Popup ────────────────────────────────────────────────────────
function LeaderboardPopup({ open, onClose }) {
  const rankColors = {
    1: { bg: 'from-amber-400 to-yellow-500', ring: 'ring-amber-400/40', label: '🥇', text: 'text-amber-500' },
    2: { bg: 'from-slate-400 to-slate-500', ring: 'ring-slate-400/30', label: '🥈', text: 'text-slate-400' },
    3: { bg: 'from-amber-700 to-amber-800', ring: 'ring-amber-700/30', label: '🥉', text: 'text-amber-700' },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-darknavy-card w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-amber-500/5 via-indigo-500/5 to-violet-500/5 border-b border-slate-200/50 dark:border-slate-800/50">
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md shadow-amber-500/30">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">XP Leaderboard</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> Weekly multiplier active · Updated live
                  </p>
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="flex items-end justify-center gap-3 mt-5 mb-1">
                {/* 2nd */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <img src={MOCK_LEADERBOARD[1].avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-400/40" />
                    <div className="absolute -top-2 -right-1 w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center text-[9px] font-black text-white">2</div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center max-w-[60px] truncate">{MOCK_LEADERBOARD[1].name.split(' ')[0]}</p>
                  <div className="h-12 w-16 bg-slate-200 dark:bg-slate-700 rounded-t-lg flex items-center justify-center">
                    <span className="text-[11px] font-black text-slate-500">{(MOCK_LEADERBOARD[1].xp / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                {/* 1st */}
                <div className="flex flex-col items-center gap-1.5 -mt-4">
                  <Crown className="w-4 h-4 text-amber-500 animate-pulse" />
                  <div className="relative">
                    <img src={MOCK_LEADERBOARD[0].avatar} className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/20" />
                    <div className="absolute -top-2 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[9px] font-black text-white">1</div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-white text-center max-w-[60px] truncate">{MOCK_LEADERBOARD[0].name.split(' ')[0]}</p>
                  <div className="h-16 w-16 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg flex items-center justify-center shadow-md shadow-amber-500/30">
                    <span className="text-[11px] font-black text-white">{(MOCK_LEADERBOARD[0].xp / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                {/* 3rd */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <img src={MOCK_LEADERBOARD[2].avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-700/30" />
                    <div className="absolute -top-2 -right-1 w-5 h-5 bg-amber-700 rounded-full flex items-center justify-center text-[9px] font-black text-white">3</div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center max-w-[60px] truncate">{MOCK_LEADERBOARD[2].name.split(' ')[0]}</p>
                  <div className="h-10 w-16 bg-amber-800/20 dark:bg-amber-900/30 rounded-t-lg flex items-center justify-center">
                    <span className="text-[11px] font-black text-amber-700 dark:text-amber-500">{(MOCK_LEADERBOARD[2].xp / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Rankings */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
              {MOCK_LEADERBOARD.map((student, idx) => (
                <motion.div
                  key={student.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${student.rank <= 3
                      ? 'bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                >
                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${student.rank === 1 ? 'bg-amber-400 text-white shadow-sm shadow-amber-400/30' :
                      student.rank === 2 ? 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-white' :
                        student.rank === 3 ? 'bg-amber-700/80 text-white' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                    {student.rank}
                  </div>

                  <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-full object-cover shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-[12px] text-slate-900 dark:text-white truncate">{student.name}</p>
                      {student.rank === 1 && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{student.badge}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-amber-500">{student.streak}d</span>
                    </div>
                    <p className="font-extrabold text-[12px] text-slate-900 dark:text-white">{student.xp.toLocaleString()}</p>
                    <p className="text-[9px] text-emerald-500 font-semibold">{student.delta}</p>
                  </div>
                </motion.div>
              ))}

              {/* Your rank pill */}
              <div className="mt-2 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 font-black text-xs flex items-center justify-center">—</div>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-[12px] text-slate-900 dark:text-white">You (Explorer)</p>
                  <p className="text-[10px] text-indigo-400">Keep learning to climb the ranks!</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[12px] text-slate-900 dark:text-white">320</p>
                  <p className="text-[9px] text-indigo-400">XP so far</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Create Post Box ──────────────────────────────────────────────────────────
function CreatePost({ onPost }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onPost(text);
    setText('');
    setFocused(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex gap-3">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Share a learning update, project milestone, or tech tip..."
            rows={focused ? 3 : 1}
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none resize-none transition-all leading-relaxed"
          />

          <AnimatePresence>
            {focused && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between mt-2.5">
                <div className="flex gap-1">
                  {[{ icon: Image, label: 'Photo', color: 'text-emerald-500' }, { icon: Hash, label: 'Tag', color: 'text-indigo-500' }, { icon: AtSign, label: 'Mention', color: 'text-violet-500' }].map(({ icon: Icon, label, color }) => (
                    <button key={label} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[11px] font-semibold ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={submit}
                  disabled={!text.trim()}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${text.trim() ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                >
                  Post
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Main Community Component ─────────────────────────────────────────────────
export default function Community({ leaderboard }) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [commentPost, setCommentPost] = useState(null);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleNewPost = (text) => {
    setPosts(prev => [{
      id: Date.now(),
      author: 'Aastik Srivastava',
      username: '@aastik.dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
      badge: 'Full Stack',
      badgeColor: 'indigo',
      time: 'just now',
      content: text,
      image: null,
      likes: 0,
      liked: false,
      comments: 0,
      shares: 0,
      saved: false,
      tags: [],
      commentList: []
    }, ...prev]);
  };

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'webdev', label: '# Web Dev' },
    { id: 'aiml', label: '# AI & ML' },
    { id: 'embedded', label: '# Embedded' },
    { id: 'milestones', label: '🏆 Milestones' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex gap-5 items-start">

        {/* ─── Left Feed (70%) ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                Community Feed
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Updates, milestones & peer discussions from your cohort</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Weekly Multiplier Active
            </span>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${activeFilter === f.id
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Create Post */}
          <CreatePost onPost={handleNewPost} />

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onOpenComments={setCommentPost}
              />
            ))}
          </div>
        </div>

        {/* ─── Right Sidebar (30%) ──────────────────────────────────────────── */}
        <div className="w-72 xl:w-80 shrink-0 sticky top-6 h-[calc(100vh-6rem)]">
          <RightSidebar onOpenLeaderboard={() => setLeaderboardOpen(true)} />
        </div>
      </div>

      {/* ─── Comments Drawer ─────────────────────────────────────────────── */}
      <CommentsDrawer post={commentPost} onClose={() => setCommentPost(null)} />

      {/* ─── Leaderboard Popup ───────────────────────────────────────────── */}
      <LeaderboardPopup open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
    </div>
  );
}