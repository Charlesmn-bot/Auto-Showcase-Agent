import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, Heart, Share2, MessageSquare, BadgeHelp, Play, Sparkles } from "lucide-react";
import { SocialChannel, PostQueueItem } from "../types";

interface AnalyticsProps {
  socialChannels: SocialChannel[];
  postQueue: PostQueueItem[];
}

export default function AnalyticsSection({ socialChannels, postQueue }: AnalyticsProps) {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [chartTab, setChartTab] = useState<"conversion" | "watchtime">("conversion");

  // Calculated totals
  const totalLikes = socialChannels.reduce((sum, ch) => sum + ch.likes, 0);
  const totalComments = socialChannels.reduce((sum, ch) => sum + ch.comments, 0);
  const totalShares = socialChannels.reduce((sum, ch) => sum + ch.shares, 0);
  const totalLeads = socialChannels.reduce((sum, ch) => sum + ch.leads, 0);

  // Mock DM Lead contacts
  const [mockDMs, setMockDMs] = useState([
    {
      id: "dm-1",
      sender: "Marcus Vance",
      carOfInterest: "Porsche 911 Carrera",
      message: "Hey! Saw the showroom collage layout you posted. Is this available for custom financing, or are you looking for cash buyout only? DM details please!",
      time: "10 mins ago",
      responded: false,
      response: ""
    },
    {
      id: "dm-2",
      sender: "Sophia Jenkins",
      carOfInterest: "Tesla Model 3",
      message: "Loved the collage frame. Can I arrange a viewing this weekend? Do you offer battery integrity reports beforehand? Let me know!",
      time: "42 mins ago",
      responded: false,
      response: ""
    }
  ]);

  const handleRespondDM = (id: string, text: string) => {
    setMockDMs(prev => prev.map(dm => {
      if (dm.id === id) {
        return { ...dm, responded: true, response: text };
      }
      return dm;
    }));
    setActiveMessageId(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl" id="analytics-section">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white tracking-wide">Customer Engagement & Mock Campaign Logs</h2>
            <p className="text-slate-400 text-xs text-left">Track enqueued daily posts and visual DM leads gathered from Auto Showcase campaign prompts.</p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          MARKETING DASHBOARD
        </span>
      </div>

      {/* Grid: Stats and Log/DMs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Aggregated counts and visual bars */}
        <div className="lg:col-span-4 flex flex-col space-y-6 text-left">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Showcase Metrics Tracker</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Likes */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Likes</span>
                <Heart className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
              </div>
              <span className="text-xl font-bold font-mono text-white block">{totalLikes}</span>
            </div>

            {/* Shares */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Shares</span>
                <Share2 className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xl font-bold font-mono text-white block">{totalShares}</span>
            </div>

            {/* Comments */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Comments</span>
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xl font-bold font-mono text-white block">{totalComments}</span>
            </div>

            {/* DM Leads */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-emerald-500 font-mono">Hot Leads</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400 block">{totalLeads}</span>
            </div>
          </div>

          {/* Core breakdown per platform & video watch time */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Metrics Analytics</span>
              
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setChartTab("conversion")}
                  className={`text-[9px] px-2 py-0.5 rounded font-semibold hover:cursor-pointer transition ${
                    chartTab === "conversion" ? "bg-indigo-650 text-white" : "text-slate-500"
                  }`}
                >
                  Post Likes
                </button>
                <button
                  onClick={() => setChartTab("watchtime")}
                  className={`text-[9px] px-2 py-0.5 rounded font-semibold hover:cursor-pointer transition ${
                    chartTab === "watchtime" ? "bg-indigo-650 text-white" : "text-slate-500"
                  }`}
                >
                  Reels Watch Time
                </button>
              </div>
            </div>

            {chartTab === "conversion" ? (
              <div className="space-y-3.5">
                {socialChannels.map((ch) => {
                  const percentage = totalLikes > 0 ? Math.round((ch.likes / totalLikes) * 100) : 0;
                  return (
                    <div key={ch.id} className="block space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-355 font-medium">{ch.name}</span>
                        <span className="text-slate-500 font-mono font-medium">{ch.likes} likes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: ch.id === "whatsapp" ? "#10b981" : ch.id === "instagram" ? "#ec4899" : ch.id === "linkedin" ? "#0a66c2" : "#3b82f6" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // IMMERSIVE VIDEO REELS WATCH TIME CHART COMPARISON OVER 5 DAYS
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono bg-indigo-950/25 px-2 py-1 rounded border border-indigo-900/30">
                  <span>Cumulative Watch Time:</span>
                  <span className="font-bold">3,335 mins total</span>
                </div>
                
                <div className="space-y-2.5 pt-2">
                  {[
                    { label: "Mon (Intake)", mins: 145, pct: 15 },
                    { label: "Tue (Filter)", mins: 380, pct: 30 },
                    { label: "Wed (Composite)", mins: 650, pct: 52 },
                    { label: "Thu (Queue)", mins: 920, pct: 74 },
                    { label: "Fri (Peak Live)", mins: 1240, pct: 98 }
                  ].map((day, i) => (
                    <div key={i} className="block space-y-0.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-medium">{day.label}</span>
                        <span className="text-indigo-400 font-bold">{day.mins} mins</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded h-2 overflow-hidden relative">
                        <div 
                          className="bg-indigo-500 h-full rounded transition-all duration-500" 
                          style={{ width: `${day.pct}%`, backgroundImage: "linear-gradient(90deg, #6366f1, #a855f7)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Active queues & Incoming DMs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Post Campaign queues */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-850 flex flex-col h-[360px]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Campaign Posting Queue</h3>
              <span className="text-[10px] text-slate-500 font-mono uppercase">{postQueue.length} ACTIVES</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar text-left">
              {postQueue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                  <span>No posts currently enqueued or processed.</span>
                  <span className="text-[10px] mt-1 text-slate-700">Connect a channel and hit schedule post</span>
                </div>
              ) : (
                postQueue.map((item) => (
                  <div key={item.id} className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-blue-900/40 text-blue-300 font-mono">
                          {item.channelId}
                        </span>
                        <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{item.carName}</span>
                      </div>
                      <span className={`text-[9px] font-semibold flex items-center space-x-1 ${item.status === 'POSTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'POSTED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'} mr-1`}></span>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{item.caption}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Cron Trigger:</span>
                      <span>{item.scheduleTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DM Leads Simulator (Steps 6 engagement tracker) */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-850 flex flex-col h-[360px]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Active DM Leads ("DM for Details")</h3>
              <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold animate-pulse">LIVE LEADS</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar text-left text-xs">
              {mockDMs.map((dm) => (
                <div key={dm.id} className={`p-3 rounded-xl border transition ${dm.responded ? 'bg-slate-900/40 border-slate-850' : 'bg-blue-950/10 border-blue-900/30 ring-1 ring-blue-500/10'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200">{dm.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{dm.time}</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-850 px-1.5 py-0.5 rounded font-semibold inline-block mb-1.5">
                    Inquire: {dm.carOfInterest}
                  </span>
                  <p className="text-slate-350 text-[11px] leading-relaxed mb-2.5">"{dm.message}"</p>

                  {dm.responded ? (
                    <div className="p-2 bg-emerald-950/20 border border-emerald-900/20 rounded-lg text-emerald-400 text-[10.5px]">
                      <strong className="block text-[10px] uppercase font-mono text-emerald-500 mb-0.5">Response Dispatched:</strong>
                      "{dm.response}"
                    </div>
                  ) : activeMessageId === dm.id ? (
                    <div className="space-y-1.5">
                      <textarea
                        id={`text-reply-${dm.id}`}
                        placeholder="Write professional negotiator response..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[11px] focus:outline-none resize-none text-slate-200"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-1.5">
                        <button
                          onClick={() => setActiveMessageId(null)}
                          className="text-[10px] text-slate-500 hover:text-slate-305 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            const val = (document.getElementById(`text-reply-${dm.id}`) as HTMLTextAreaElement).value;
                            if (val) handleRespondDM(dm.id, val);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[10px] text-white font-semibold rounded shrink-0"
                        >
                          Send details DM
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveMessageId(dm.id)}
                      className="bg-blue-600 hover:bg-blue-500 font-semibold text-[10px] text-white px-3 py-1.5 rounded-lg w-full flex items-center justify-center space-x-1 hover:cursor-pointer transition"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>Reply with Showroom catalog</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
