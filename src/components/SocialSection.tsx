import React, { useState } from "react";
import { Share2, Clock, CheckCircle2, MessageSquare, AlertCircle, Hash, Play, Calendar, Plus, Trash2 } from "lucide-react";
import { CarAnalysisResult, SocialChannel, PostQueueItem } from "../types";

// Helper function to extract high-fidelity acronyms for any social platform matching the design style
const getChannelAcronym = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("instagram")) return "INS";
  if (lower.includes("facebook")) return "FAC";
  if (lower.includes("whatsapp")) return "WHA";
  if (lower.includes("linkedin")) return "LIN";
  if (lower.includes("tiktok")) return "TIK";
  if (lower.includes("youtube")) return "YOU";
  if (lower.includes("pinterest")) return "PIN";
  if (lower.includes("twitter") || lower === "x") return "X";
  if (lower.includes("threads")) return "THR";
  if (lower.includes("snapchat")) return "SNA";
  return name.slice(0, 3).toUpperCase();
};

interface SocialProps {
  analysis: CarAnalysisResult;
  socialChannels: SocialChannel[];
  setSocialChannels: React.Dispatch<React.SetStateAction<SocialChannel[]>>;
  postQueue: PostQueueItem[];
  setPostQueue: React.Dispatch<React.SetStateAction<PostQueueItem[]>>;
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  onNext: () => void;
  onCampaignAction?: (action: "SCHEDULE" | "PUBLISH") => void;
}

export default function SocialSection({
  analysis,
  socialChannels,
  setSocialChannels,
  postQueue,
  setPostQueue,
  addAuditLog,
  onNext,
  onCampaignAction,
}: SocialProps) {
  const [editedCaption, setEditedCaption] = useState(analysis.marketingPitch);
  const [ctaText, setCtaText] = useState(analysis.cta);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(analysis.hashtags);
  const [postTime, setPostTime] = useState("09:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isPostingNow, setIsPostingNow] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");

  const toggleChannel = (id: string) => {
    setSocialChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const nextState = !ch.connected;
          addAuditLog(
            nextState ? "SUCCESS" : "INFO",
            "SOCIAL",
            `${nextState ? "Connected" : "Disconnected"} social campaign account: ${ch.name}`
          );
          return { ...ch, connected: nextState };
        }
        return ch;
      })
    );
  };

  const handleAddPlatform = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    // Check if duplicate
    const exists = socialChannels.some(
      (ch) => ch.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert(`Platform "${trimmed}" is already integrated.`);
      return;
    }

    const newId = trimmed.toLowerCase().replace(/\s+/g, "-");
    const newChannel: SocialChannel = {
      id: newId,
      name: trimmed,
      connected: true, // Connected immediately on integration
      engagementRate: parseFloat((Math.random() * 4 + 4).toFixed(1)), // 4.0 to 8.0
      likes: 0,
      shares: 0,
      comments: 0,
      leads: 0
    };

    setSocialChannels((prev) => [...prev, newChannel]);
    addAuditLog(
      "SUCCESS",
      "SOCIAL",
      `INTEGRATED other social media platform into campaigning engine: ${trimmed}. Acronym '${getChannelAcronym(trimmed)}' assigned.`
    );
    setNewPlatformName("");
  };

  const handleRemovePlatform = (id: string, name: string) => {
    // Only allow deletion of user-added custom channels to keep UI clean
    const defaultIds = ["instagram", "facebook", "whatsapp", "linkedin"];
    if (defaultIds.includes(id)) {
      alert("System default channels cannot be deleted, but can be disconnected.");
      return;
    }

    setSocialChannels((prev) => prev.filter((ch) => ch.id !== id));
    addAuditLog(
      "WARNING",
      "SOCIAL",
      `Removed custom social media integration: ${name}`
    );
  };

  const handleHashtagToggle = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedHashtags(prev => [...prev, tag]);
    }
  };

  const schedulePostCampaign = async () => {
    const connectedCount = socialChannels.filter((c) => c.connected).length;
    if (connectedCount === 0) {
      addAuditLog("WARNING", "SOCIAL", "Campaign schedule abort: No social profiles selected.");
      alert("Please connect at least one social media channel to schedule the post.");
      return;
    }

    setIsScheduling(true);
    addAuditLog("INFO", "SOCIAL", `Scheduling daily recurring photo campaigns at 09:00 AM on ${connectedCount} channels.`);
    addAuditLog("INFO", "SOCIAL", `Scheduling daily recurring video reels at 12:00 PM on ${connectedCount} channels.`);

    try {
      const fullPostCaption = `${editedCaption}\n\n${ctaText}\n\n${selectedHashtags.map((h) => `#${h}`).join(" ")}`;

      const photoItems: PostQueueItem[] = socialChannels
        .filter((c) => c.connected)
        .map((chan) => ({
          id: `queue-${Date.now()}-photo-${chan.id}`,
          channelId: chan.id,
          carName: `📸 Photo: ${analysis.detectedMake} ${analysis.detectedModel}`,
          caption: fullPostCaption,
          scheduleTime: `${postTime} Daily`,
          status: "SCHEDULED",
        }));

      const videoItems: PostQueueItem[] = socialChannels
        .filter((c) => c.connected)
        .map((chan) => ({
          id: `queue-${Date.now()}-video-${chan.id}`,
          channelId: chan.id,
          carName: `🎥 Video Showcase Reels`,
          caption: `🔥 Video Montage 🔥\n${fullPostCaption}`,
          scheduleTime: "12:00 Daily",
          status: "SCHEDULED",
        }));

      // Simulate network wait
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPostQueue((prev) => [...prev, ...photoItems, ...videoItems]);
      addAuditLog("SUCCESS", "SOCIAL", `Dual media campaigns mapped across system cron rules. Multi-channel queue release arming active.`);
      setIsScheduling(false);
      if (onCampaignAction) onCampaignAction("SCHEDULE");
      onNext();
    } catch (err) {
      setIsScheduling(false);
    }
  };

  const publishCampaignImmediately = () => {
    const connectedCount = socialChannels.filter((c) => c.connected).length;
    if (connectedCount === 0) {
      alert("Please connect at least one social media channel.");
      return;
    }

    setIsPostingNow(true);
    addAuditLog("INFO", "SOCIAL", `Bypassing cron timer. Instant publishing active layout collage & video montages...`);

    setTimeout(() => {
      const fullPostCaption = `${editedCaption}\n\n${ctaText}\n\n${selectedHashtags.map((h) => `#${h}`).join(" ")}`;

      const publishedPhotos: PostQueueItem[] = socialChannels
        .filter((c) => c.connected)
        .map((chan) => ({
          id: `queue-${Date.now()}-pubphoto-${chan.id}`,
          channelId: chan.id,
          carName: `📸 Photo: ${analysis.detectedMake} ${analysis.detectedModel}`,
          caption: fullPostCaption,
          scheduleTime: "Posted Now",
          status: "POSTED",
        }));

      const publishedVideos: PostQueueItem[] = socialChannels
        .filter((c) => c.connected)
        .map((chan) => ({
          id: `queue-${Date.now()}-pubvideo-${chan.id}`,
          channelId: chan.id,
          carName: `🎥 Video Showcase Reels`,
          caption: `🔥 High Impact Video Reels 🔥\n${fullPostCaption}`,
          scheduleTime: "Posted Now",
          status: "POSTED",
        }));

      // Update engagement counters on publish to simulate realistic social outcomes
      setSocialChannels((prev) =>
        prev.map((ch) => {
          if (ch.connected) {
            return {
              ...ch,
              likes: ch.likes + Math.floor(Math.random() * 40) + 20,
              comments: ch.comments + Math.floor(Math.random() * 10) + 4,
              shares: ch.shares + Math.floor(Math.random() * 8) + 2,
              leads: ch.leads + (Math.random() > 0.4 ? 2 : 1),
            };
          }
          return ch;
        })
      );

      setPostQueue((prev) => [...prev, ...publishedPhotos, ...publishedVideos]);
      addAuditLog("SUCCESS", "SOCIAL", `Social media portfolios published. Photos and video assets recorded inside campaign history.`);
      setIsPostingNow(false);
      if (onCampaignAction) onCampaignAction("PUBLISH");
      onNext();
    }, 1100);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md" id="social-section">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-wide">Steps 5 & 6: Campaign Scheduler & Social Outlets</h2>
            <p className="text-slate-500 text-xs text-left">Authorize showcase accounts, append custom hashtags, and enqueue automated daily publications.</p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          SCHEDULER ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Channel Connectors & Schedule */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Channel selectors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Connected Accounts</h3>
              <span className="text-[10px] text-indigo-600 font-semibold">{socialChannels.length} platforms available</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {socialChannels.map((chan) => {
                const isDefault = ["instagram", "facebook", "whatsapp", "linkedin"].includes(chan.id);
                return (
                  <div 
                    key={chan.id} 
                    className={`group relative flex items-center justify-between p-3.5 rounded-xl border-2 transition text-left select-none ${
                      chan.connected
                        ? "bg-purple-50/20 border-violet-600 text-violet-850 font-bold shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-350 text-slate-500"
                    }`}
                  >
                    <button
                      onClick={() => toggleChannel(chan.id)}
                      className="flex-1 flex items-center space-x-3 text-left focus:outline-none focus:ring-0 cursor-pointer"
                      id={`social-channel-${chan.id}`}
                    >
                      <span className={`text-[10.5px] font-extrabold uppercase font-mono ${chan.connected ? "text-violet-600" : "text-slate-400"}`}>
                        {getChannelAcronym(chan.name)}
                      </span>
                      <span className={`text-xs font-bold leading-tight ${chan.connected ? "text-violet-950 font-extrabold" : "text-slate-705"}`}>
                        {chan.name}
                      </span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      {/* Connected state dot styled after the high-fidelity UI reference */}
                      <span 
                        onClick={() => toggleChannel(chan.id)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                          chan.connected ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        title={chan.connected ? "Connected" : "Disconnected"}
                      ></span>

                      {/* Optional trash icon for custom added platforms */}
                      {!isDefault && (
                        <button
                          onClick={() => handleRemovePlatform(chan.id, chan.name)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition text-slate-400 rounded cursor-pointer"
                          title="Remove integration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic visual interface to Add / Integrate other social media platforms */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-dashed border-slate-300 mt-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Integrate Other Platforms</span>
                </span>
                <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  Connected Sync
                </span>
              </div>
              
              {/* Pre-configured popular high-fidelity showroom platforms to add with single click */}
              <div className="block">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Popular Outlets</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "TikTok" },
                    { name: "X / Twitter" },
                    { name: "YouTube Shorts" },
                    { name: "Pinterest" }
                  ].map((preset) => {
                    const isExisting = socialChannels.some(sc => sc.name.toLowerCase().includes(preset.name.toLowerCase().split(" ")[0]));
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        disabled={isExisting}
                        onClick={() => handleAddPlatform(preset.name)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition duration-150 flex items-center space-x-1 font-semibold ${
                          isExisting 
                            ? "bg-slate-100 border-slate-200 text-slate-350 cursor-not-allowed"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300 active:scale-95 hover:cursor-pointer shadow-sm"
                        }`}
                      >
                        <span>+ {preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom custom-text input for any bespoke system */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Bespoke Custom Outlet</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="E.g. Threads, Snapchat, WeChat..."
                    value={newPlatformName}
                    onChange={(e) => setNewPlatformName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddPlatform(newPlatformName);
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
                    id="add-custom-platform-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPlatform(newPlatformName)}
                    className="bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition active:scale-95 flex items-center justify-center whitespace-nowrap shadow-sm"
                  >
                    Integrate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Time and Queue controls */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Cron Scheduling Rule</span>
            </h3>

            <div className="block">
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Trigger Daily Timing</label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-500">Scheduled Daily at {postTime} by default (per algorithm).</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex space-x-2.5">
              <button
                onClick={schedulePostCampaign}
                disabled={isScheduling || isPostingNow}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-center shadow-md shadow-indigo-600/10"
              >
                <Calendar className="w-4 h-4" />
                <span>{isScheduling ? "Scheduling..." : "Schedule Post"}</span>
              </button>

              <button
                onClick={publishCampaignImmediately}
                disabled={isScheduling || isPostingNow}
                className="bg-slate-100 hover:bg-slate-200 hover:cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 border border-slate-250 text-slate-800 font-bold text-xs py-2.5 px-3.5 rounded-lg flex items-center justify-center space-x-1.5 transition text-center"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isPostingNow ? "Posting..." : "Post Now"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Content Preview & Appenders */}
        <div className="lg:col-span-7 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Social Copywriter Editor</h3>

            <div className="block">
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Promotional Description Text</label>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 resize-none font-semibold leading-normal"
              />
            </div>

            <div className="block">
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Call to Action (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Hashtag manager */}
            <div className="block">
              <label className="text-[11px] text-slate-500 block mb-1.5 flex items-center space-x-1 font-bold font-sans">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Showroom Campaign Hashtags</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["CarDeals", "AutoShowcase", "AutoShowcaseAgent", "InstaCar", "LuxuryRide", "Showroom", "HotDeals"].map((hash) => {
                  const isActive = selectedHashtags.includes(hash);
                  return (
                    <button
                      key={hash}
                      onClick={() => handleHashtagToggle(hash)}
                      className={`text-[10px] px-2 py-1 rounded-md transition font-mono border hover:cursor-pointer ${
                        isActive
                          ? "bg-indigo-50 border border-indigo-300 text-indigo-700 font-bold"
                          : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      #{hash}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
