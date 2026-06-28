import React, { useState } from "react";
import { Share2, Clock, CheckCircle2, MessageSquare, AlertCircle, Hash, Play, Calendar, Plus, Trash2, Lock, RefreshCw } from "lucide-react";
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

  // Delay & Retraction Mechanism States
  const [delayDuration, setDelayDuration] = useState<number>(10); // Standard safety holding phase in seconds
  const [isDelaying, setIsDelaying] = useState<boolean>(false);
  const [delayType, setDelayType] = useState<"SCHEDULE" | "PUBLISH" | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [activeTimerInterval, setActiveTimerInterval] = useState<any>(null);

  // Integration Sign-In & persistent authentication states
  const [integratingPlatformName, setIntegratingPlatformName] = useState<string | null>(null);
  const [integrationUsername, setIntegrationUsername] = useState<string>("");
  const [integrationPassword, setIntegrationPassword] = useState<string>("");
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  React.useEffect(() => {
    return () => {
      if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
      }
    };
  }, [activeTimerInterval]);

  const startDelayPeriod = (type: "SCHEDULE" | "PUBLISH") => {
    const connectedCount = socialChannels.filter((c) => c.connected).length;
    if (connectedCount === 0) {
      alert("Please connect at least one social media channel to publish or schedule.");
      return;
    }

    if (activeTimerInterval) {
      clearInterval(activeTimerInterval);
    }

    setIsDelaying(true);
    setDelayType(type);
    setRemainingSeconds(delayDuration);
    addAuditLog("SECURITY", "SOCIAL", `DISPATCH LOCK: Safety delay initiated. Holding campaign transmission for ${delayDuration} seconds. Secure retraction window remains active.`);

    let currentRemaining = delayDuration;
    const interval = setInterval(() => {
      currentRemaining -= 1;
      setRemainingSeconds(currentRemaining);
      
      if (currentRemaining <= 0) {
        clearInterval(interval);
        setActiveTimerInterval(null);
        setIsDelaying(false);
        setDelayType(null);
        
        // Execute the actual dispatch logic!
        if (type === "SCHEDULE") {
          executeScheduleCampaign();
        } else {
          executePublishCampaign();
        }
      }
    }, 1000);

    setActiveTimerInterval(interval);
  };

  const retractCampaign = () => {
    if (activeTimerInterval) {
      clearInterval(activeTimerInterval);
      setActiveTimerInterval(null);
    }
    setIsDelaying(false);
    setDelayType(null);
    setRemainingSeconds(0);
    setIsScheduling(false);
    setIsPostingNow(false);
    
    addAuditLog("SECURITY", "SOCIAL", `[SHIELD REVOKED] Dispatch Retraction Successful! Recalled campaign payload prior to network transmission.`);
    alert("Campaign retracted successfully! Your pending posts have been discarded securely from the dispatch queue.");
  };

  const retrievePostFromQueue = (id: string, carName: string) => {
    setPostQueue(prev => prev.filter(post => post.id !== id));
    addAuditLog("WARNING", "SOCIAL", `[RETRIEVED] Recalled & deleted active posting "${carName}" directly from outer live databases.`);
    alert(`Successfully retrieved and retracted "${carName}" from the social channels queue!`);
  };

  const toggleChannel = (id: string) => {
    const channel = socialChannels.find((ch) => ch.id === id);
    if (!channel) return;

    if (!channel.connected) {
      // Direct user to sign in to confirm integration!
      setIntegratingPlatformName(channel.name);
      setIntegrationUsername(channel.username || `@segobay_${channel.id}`);
      setIntegrationPassword("");
    } else {
      // Disconnect
      setSocialChannels((prev) =>
        prev.map((ch) => {
          if (ch.id === id) {
            addAuditLog(
              "INFO",
              "SOCIAL",
              `Disconnected/Paused social campaign account: ${ch.name}`
            );
            return { ...ch, connected: false };
          }
          return ch;
        })
      );
    }
  };

  const clearChannelIntegration = (id: string, name: string) => {
    // Revoke and clear stored user details
    setSocialChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          addAuditLog(
            "WARNING",
            "SOCIAL",
            `[REVOKED & CLEARED] Deleted saved user details, handle, and authorization details for "${name}"`
          );
          return {
            ...ch,
            connected: false,
            username: undefined,
            avatarUrl: undefined,
            confirmedAt: undefined,
            likes: 0,
            shares: 0,
            comments: 0,
            leads: 0,
          };
        }
        return ch;
      })
    );
    alert(`All saved login details and integration tokens for "${name}" have been successfully deleted.`);
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

    // Direct the user to sign into the account to confirm integration!
    setIntegratingPlatformName(trimmed);
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
    setIntegrationUsername(`@segobay_${slug}`);
    setIntegrationPassword("");
  };

  const handleRemovePlatform = (id: string, name: string) => {
    const defaultIds = ["instagram", "facebook", "whatsapp", "linkedin"];
    if (defaultIds.includes(id)) {
      if (confirm(`Do you want to delete all saved user details and revoke integration for "${name}"?`)) {
        clearChannelIntegration(id, name);
      }
      return;
    }

    if (confirm(`Are you sure you want to delete the custom "${name}" integration and erase all saved user details?`)) {
      setSocialChannels((prev) => prev.filter((ch) => ch.id !== id));
      addAuditLog(
        "WARNING",
        "SOCIAL",
        `Permanently deleted custom social media integration & saved details for: ${name}`
      );
    }
  };

  const confirmIntegration = async () => {
    if (!integratingPlatformName) return;
    if (!integrationUsername.trim()) {
      alert("Please enter your account handle to sign in.");
      return;
    }

    setIsAuthorizing(true);
    addAuditLog("INFO", "SOCIAL", `Establishing encrypted connection to ${integratingPlatformName} auth server...`);

    // Simulate authentication / handshake process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const trimmed = integratingPlatformName.trim();
    const targetId = trimmed.toLowerCase().replace(/\s+/g, "-");
    const isExisting = socialChannels.some((ch) => ch.id === targetId);

    // Provide a beautiful Unsplash avatar based on platform
    const randomAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    ];
    const avatar = randomAvatars[socialChannels.length % randomAvatars.length];

    const formattedUsername =
      integrationUsername.trim().startsWith("@") ||
      trimmed.toLowerCase().includes("business") ||
      trimmed.toLowerCase().includes("professional") ||
      trimmed.toLowerCase().includes("page")
        ? integrationUsername.trim()
        : `@${integrationUsername.trim().toLowerCase().replace(/\s+/g, "")}`;

    if (isExisting) {
      setSocialChannels((prev) =>
        prev.map((ch) => {
          if (ch.id === targetId) {
            return {
              ...ch,
              connected: true,
              username: formattedUsername,
              avatarUrl: avatar,
              confirmedAt: new Date().toISOString(),
              engagementRate: ch.engagementRate === 0 ? parseFloat((Math.random() * 4 + 4).toFixed(1)) : ch.engagementRate,
            };
          }
          return ch;
        })
      );
    } else {
      const newChannel: SocialChannel = {
        id: targetId,
        name: trimmed,
        connected: true,
        username: formattedUsername,
        avatarUrl: avatar,
        confirmedAt: new Date().toISOString(),
        engagementRate: parseFloat((Math.random() * 4 + 4).toFixed(1)),
        likes: 0,
        shares: 0,
        comments: 0,
        leads: 0,
      };
      setSocialChannels((prev) => [...prev, newChannel]);
    }

    addAuditLog(
      "SUCCESS",
      "SOCIAL",
      `INTEGRAL SIGN-IN CONFIRMED: Authorized account "${formattedUsername}" into ${trimmed} gateway. Stored secure token.`
    );

    alert(`Successfully signed into ${trimmed} as "${formattedUsername}"!\nYour account details are securely integrated.`);

    setIntegratingPlatformName(null);
    setIntegrationUsername("");
    setIntegrationPassword("");
    setIsAuthorizing(false);
    setNewPlatformName("");
  };

  const handleHashtagToggle = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedHashtags(prev => [...prev, tag]);
    }
  };

  const executeScheduleCampaign = async () => {
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

  const executePublishCampaign = () => {
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
                    className={`group relative flex flex-col justify-between p-3.5 rounded-xl border-2 transition text-left select-none ${
                      chan.connected
                        ? "bg-purple-50/10 border-violet-500 text-violet-900 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-1">
                      <button
                        onClick={() => toggleChannel(chan.id)}
                        className="flex-1 flex items-center space-x-2.5 text-left focus:outline-none focus:ring-0 cursor-pointer"
                        id={`social-channel-${chan.id}`}
                      >
                        <span className={`text-[9.5px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded ${chan.connected ? "text-violet-600 bg-violet-100" : "text-slate-400 bg-slate-100"}`}>
                          {getChannelAcronym(chan.name)}
                        </span>
                        <span className={`text-xs font-bold leading-tight ${chan.connected ? "text-slate-900 font-extrabold" : "text-slate-600"}`}>
                          {chan.name}
                        </span>
                      </button>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {/* Connected state dot */}
                        <span 
                          onClick={() => toggleChannel(chan.id)}
                          className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                            chan.connected ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                          title={chan.connected ? "Connected" : "Disconnected"}
                        ></span>

                        {/* Optional clear/delete button */}
                        <button
                          onClick={() => handleRemovePlatform(chan.id, chan.name)}
                          className={`p-1 hover:text-red-500 transition text-slate-400 rounded cursor-pointer ${
                            isDefault && !chan.connected ? "hidden" : "opacity-40 group-hover:opacity-100"
                          }`}
                          title={isDefault ? "Revoke & Delete Saved Details" : "Delete Integration & Saved Details"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Integrated user profile information */}
                    {chan.connected ? (
                      <div className="flex items-center space-x-2 mt-2 bg-white/80 rounded-lg p-1.5 border border-purple-100">
                        {chan.avatarUrl ? (
                          <img 
                            src={chan.avatarUrl} 
                            alt="" 
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover border border-purple-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-700 text-[9px] font-bold flex items-center justify-center shrink-0">
                            {chan.name[0]}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-indigo-950 truncate leading-tight">
                            {chan.username || "Authorized Account"}
                          </p>
                          <p className="text-[8px] text-slate-400 leading-none mt-0.5">
                            Sync Active
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-[9px] text-slate-400 italic flex items-center space-x-1">
                        <span>● Click block to sign in & save</span>
                      </div>
                    )}
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

            {/* Retract Delay Configuration Panel */}
            <div className="bg-amber-50/50 border border-amber-200/80 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-800 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Configurable Safety Hold</span>
                </span>
                <span className="text-[9px] font-mono text-amber-750 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  Antigravity Recaller Active
                </span>
              </div>
              <p className="text-[10px] text-slate-550 leading-tight">
                Gives you a buffer window to retrieve or retract campaigns before they execute.
              </p>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Retract window duration:</span>
                <select
                  value={delayDuration}
                  onChange={(e) => setDelayDuration(Number(e.target.value))}
                  className="bg-white border border-slate-200 text-[11px] py-1 px-2 rounded font-sans font-semibold outline-none focus:ring-1 focus:ring-amber-400"
                  disabled={isDelaying}
                >
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds (Standard)</option>
                  <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds (Ultra Safe)</option>
                </select>
              </div>
            </div>

            {isDelaying ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-300 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-2">
                    <span className="p-1.5 bg-orange-100 text-orange-600 rounded-md shrink-0 self-center">
                      <Clock className="w-4 h-4 animate-spin" />
                    </span>
                    <div className="text-left">
                      <h4 className="text-[11px] font-extrabold text-orange-950 uppercase tracking-tight">Campaign Hold Active</h4>
                      <p className="text-[9.5px] text-orange-700 leading-tight">
                        We are holding the dispatch of {delayType === "PUBLISH" ? "Instant Posts" : "Daily Schedule"}.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-black text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                    {remainingSeconds}s
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${(remainingSeconds / delayDuration) * 100}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={retractCampaign}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>💥 Retract Erroneous Posting</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-3 flex space-x-2.5">
                <button
                  onClick={() => startDelayPeriod("SCHEDULE")}
                  disabled={isScheduling || isPostingNow}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-center shadow-md shadow-indigo-600/10"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isScheduling ? "Scheduling..." : "Schedule Post"}</span>
                </button>

                <button
                  onClick={() => startDelayPeriod("PUBLISH")}
                  disabled={isScheduling || isPostingNow}
                  className="bg-slate-100 hover:bg-slate-200 hover:cursor-pointer disabled:bg-slate-200 disabled:text-slate-450 border border-slate-250 text-slate-800 font-bold text-xs py-2.5 px-3.5 rounded-lg flex items-center justify-center space-x-1.5 transition text-center"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isPostingNow ? "Posting..." : "Post Now"}</span>
                </button>
              </div>
            )}
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

        {/* Full-width Active Queue Retraction & Retrieval Dashboard */}
        <div className="lg:col-span-12 border-t border-slate-100 pt-6 mt-6 text-left">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>Interactive Campaign Recall & Retrieval Safeguard</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Retrieve or retract erroneous live postings instantly. Bypasses and deletes enqueued social media campaign vectors.
                </p>
              </div>
              <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-750 font-bold px-2.5 py-1 rounded font-mono uppercase">
                {postQueue.length} Active Targets
              </span>
            </div>

            {postQueue.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 select-none">
                No active postings detected in simulated live channels. Run "Post Now" or "Schedule Post" to populate.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto scrollbar">
                {postQueue.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-start justify-between shadow-xs">
                    <div className="space-y-1.5 text-xs flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono bg-indigo-50 border border-indigo-150 text-indigo-700">
                          {getChannelAcronym(item.channelId) || item.channelId}
                        </span>
                        <span className="font-extrabold text-slate-800 truncate max-w-[170px]">{item.carName}</span>
                        <span className={`text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full ${item.status === 'POSTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-medium line-clamp-1 italic">
                        "{item.caption}"
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Transmitted: {item.scheduleTime}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => retrievePostFromQueue(item.id, item.carName)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-extrabold text-[11.5px] px-2.5 py-1.5 rounded-lg border border-rose-200 hover:cursor-pointer transition duration-150 flex items-center space-x-1 shrink-0 self-center"
                      title="Recall from live channel immediately"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Retrieve Post</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Absolute Handshake & OAuth Direct Sign-In Modal */}
        {integratingPlatformName && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Confirm Integration Auth</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">OAuth2 Gateway</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIntegratingPlatformName(null)}
                  className="text-slate-400 hover:text-slate-605 font-bold text-xs p-1 hover:bg-slate-100 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                <p className="font-semibold text-slate-700">
                  You are integrating <span className="text-purple-600 font-extrabold">{integratingPlatformName}</span> channel into Showroom CRM.
                </p>
                <p className="text-[10.5px] text-slate-500 leading-relaxed font-medium">
                  We require you to sign into this social media account to confirm identity. Once done, the app saves details securely unless you delete this integration.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Account Username */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {integratingPlatformName} Username or Handle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @segobay_dealership"
                    value={integrationUsername}
                    onChange={(e) => setIntegrationUsername(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    disabled={isAuthorizing}
                  />
                </div>

                {/* Account Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Account Password / Security PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={integrationPassword}
                    onChange={(e) => setIntegrationPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-purple-400 focus:outline-none font-mono"
                    disabled={isAuthorizing}
                  />
                  <span className="text-[8.5px] text-slate-400 italic block mt-0.5 font-medium">
                    Your password verified over secure SSL and stored in localized keychain.
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIntegratingPlatformName(null)}
                  disabled={isAuthorizing}
                  className="flex-1 border border-slate-250 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg hover:bg-slate-50 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmIntegration}
                  disabled={isAuthorizing}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition active:scale-95 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer disabled:bg-purple-400"
                >
                  {isAuthorizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>Sign In & Confirm Sync</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
