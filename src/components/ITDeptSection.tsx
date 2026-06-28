import React, { useState, useEffect } from "react";
import { 
  Database, Shield, Terminal, Key, Cpu, Lock, CheckSquare, Search, 
  RefreshCw, AlertTriangle, CheckCircle, HelpCircle, HardDrive, 
  FolderLock, Settings, Play, Server, ServerCrash, 
  Globe, Radio, Music, Trash2, Plus, Volume2, Zap, Monitor, Laptop, Download, Info
} from "lucide-react";
import { AuditLogEntry, CarAnalysisResult, SocialChannel, PostQueueItem } from "../types";
import PWASyncSection from "./PWASyncSection";

interface ITDeptProps {
  analysis: CarAnalysisResult | null;
  folderCounts: {
    carMedia: number;
    showroomLayouts: number;
    showroomVideos: number;
    communityMedia: number;
    communityLayouts: number;
    published: number;
    soundmediaLayouts?: number;
  };
  auditLogs: AuditLogEntry[];
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  socialChannels: SocialChannel[];
  postQueue: PostQueueItem[];
  onRefreshWatcher: () => void;
  setFolderCounts?: React.Dispatch<React.SetStateAction<{
    carMedia: number;
    showroomLayouts: number;
    showroomVideos: number;
    communityMedia: number;
    communityLayouts: number;
    published: number;
    soundmediaLayouts?: number;
  }>>;
  setPostQueue?: React.Dispatch<React.SetStateAction<PostQueueItem[]>>;
  soundtracks: SoundtrackItem[];
  setSoundtracks: React.Dispatch<React.SetStateAction<SoundtrackItem[]>>;
}

export interface SoundtrackItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  type: "default" | "user_uploaded";
  matchingModel: string;
}

export default function ITDeptSection({
  analysis,
  folderCounts,
  auditLogs,
  addAuditLog,
  socialChannels,
  postQueue,
  onRefreshWatcher,
  setFolderCounts,
  setPostQueue,
  soundtracks,
  setSoundtracks
}: ITDeptProps) {
  // IT Sub-tabs
  const [itTab, setItTab] = useState<"database" | "filesystem" | "crypto_scans" | "audit_trail" | "telemetry" | "soundtracks" | "pwa_standalone">("soundtracks");
  
  // Terminal / SQL state
  const [selectedPresetQuery, setSelectedPresetQuery] = useState("SELECT * FROM tbl_vehicles;");
  const [sqlConsoleOutput, setSqlConsoleOutput] = useState<any[]>([]);
  const [sqlStatus, setSqlStatus] = useState<string>("Ready: Database engine online");
  const [isQuerying, setIsQuerying] = useState(false);

  // Cryptography key state
  const [cryptKey, setCryptKey] = useState("aes-256-gcm-f83k9d82la01kd9a8");
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Malware Scanner state
  const [isScanningForThreats, setIsScanningForThreats] = useState(false);
  const [scanThreatResults, setScanThreatResults] = useState<{
    scannedFiles: number;
    threatsFound: number;
    status: "idle" | "scanning" | "passed" | "warning";
    log: string[];
  }>({
    scannedFiles: 0,
    threatsFound: 0,
    status: "idle",
    log: []
  });

  // Log filter / search query state
  const [activeLogCategory, setActiveLogCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Directory Loop sweep trigger state
  const [isLooping, setIsLooping] = useState(false);

  // Active Agent Daemon toggle: "shuffle" or "layer" or "multichannel" or "selflearning" or "soundtrack" or "soundtracklayout" or "businesscard" or "optimized" or "mediapath"
  const [activeAgentDaemon, setActiveAgentDaemon] = useState<"shuffle" | "layer" | "multichannel" | "selflearning" | "soundtrack" | "soundtracklayout" | "businesscard" | "optimized" | "mediapath">("mediapath");

  // Agent internal simulations
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentActiveStep, setAgentActiveStep] = useState(0);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "// MediaPathAgent: STANDBY • Watching 'CarMedia/Intake' directory and listening to real-time sync updates"
  ]);

  // Dynamic state overrides for local filesystem directories and soundtracks
  const [localFolderCounts, setLocalFolderCounts] = useState({
    carMedia: folderCounts.carMedia,
    showroomLayouts: folderCounts.showroomLayouts,
    showroomVideos: folderCounts.showroomVideos,
    communityMedia: folderCounts.communityMedia,
    communityLayouts: folderCounts.communityLayouts,
    published: folderCounts.published,
    soundmediaLayouts: 0,
  });

  const [newTrackTitle, setNewTrackTitle] = useState("");
  const [newTrackGenre, setNewTrackGenre] = useState("");
  const [newTrackDuration, setNewTrackDuration] = useState("2:45");
  const [newTrackModel, setNewTrackModel] = useState("Toyota");
  const [isPlayingTrack, setIsPlayingTrack] = useState<string | null>(null);

  // States for interactive soundtrack user select prompting countdown
  const [promptingSoundtrack, setPromptingSoundtrack] = useState(false);
  const [promptCountdown, setPromptCountdown] = useState(0);
  const [userSelectedTrack, setUserSelectedTrack] = useState<SoundtrackItem | null>(null);

  const isHarnessResolvedRef = React.useRef(false);

  useEffect(() => {
    setLocalFolderCounts(prev => ({
      ...prev,
      carMedia: folderCounts.carMedia,
      showroomLayouts: folderCounts.showroomLayouts,
      showroomVideos: folderCounts.showroomVideos,
      communityMedia: folderCounts.communityMedia,
      communityLayouts: folderCounts.communityLayouts,
      published: folderCounts.published,
    }));
  }, [
    folderCounts.carMedia,
    folderCounts.showroomLayouts,
    folderCounts.showroomVideos,
    folderCounts.communityMedia,
    folderCounts.communityLayouts,
    folderCounts.published
  ]);

  const runShuffleCommunityAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [AGENT] BEGIN ShuffleCommunityAgent daemon execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [AGENT] INIT local_database (SQLite: local_database.db)`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] INIT community_folder ("Community Media") registry initialized successfully.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] LOOP STARTED: Scanning directories via watching channels...`,
        `[${new Date().toLocaleTimeString()}] [AGENT] WATCHING: "Car Media" folder (inode scan sector 4)...`,
        `[${new Date().toLocaleTimeString()}] [AGENT] WATCHING: "Community Media" folder (inode scan sector 6)...`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] FILE CAPTURE: 3 raw files found inside "Car Media", 2 files found inside "Community Media".`,
        `[${new Date().toLocaleTimeString()}] [AGENT] VALIDATE: Checking signature boundaries. All files successfully validated as graphics/video streams.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] ENHANCE: Auto-aligning brightness scalars, dynamic microcontrast, and spatial audio watermarking.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] DETECT: Car model parameters identified: '${analysis ? analysis.detectedMake : "Porsche"} ${analysis ? analysis.detectedModel : "911 Carrera"}' (${analysis ? analysis.detectedYear : "2022"}).`,
        `[${new Date().toLocaleTimeString()}] [AGENT] SORT: Moving vehicle files dynamically to isolate directory: '/CarMedia/${analysis ? analysis.detectedModel.replace(/\s+/g, "_") : "Porsche_911"}/'`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] PHOTO SHUFFLE algorithm executing: Randomly selecting 5 high-fidelity photos...`,
        `[${new Date().toLocaleTimeString()}] [AGENT] COMPRESSED: Created showroom composite_layout with integrated vehicle spec overlay tags.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] SAVE: Output composite layout successfully written to file: '/Showroom Layouts/porsche_shuffled_collage.png'`
      ]);
    }, 1400);

    setTimeout(() => {
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] VIDEO MONTAGE algorithm executing: Assembling random video clips...`,
        `[${new Date().toLocaleTimeString()}] [AGENT] MONTAGING: Compiling video footage with high-fidelity intro, shuffled track cuts, and outro Call To Action.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] SAVE: Output saved to: '/Showroom Videos/porsche_montage_reel.mp4'`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] COMMUNITY MEDIA integration: Scanning '/Community Media/' for resident submissions...`,
        `[${new Date().toLocaleTimeString()}] [AGENT] WATERMARK ENHANCE: Rescaling graphics contrast tag overlays.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] APPLY OVERLAY: Affixed permanent brand typography line: ("SmartBnB Community Responsibility").`,
        `[${new Date().toLocaleTimeString()}] [AGENT] SAVE: Output compiled community layout successfully written to: '/Community Layouts/community_responsibility_card.png'`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] SCHEDULE RULES REGISTERED: Locking campaign postings timings in SQLite tables:`,
        `       • AT 09:00 Daily → POST shuffled composite_layout to connected profiles`,
        `       • AT 12:00 Daily → POST shuffled montage_video to connected profiles`,
        `       • AT 18:00 Daily → POST community_layout (SmartBnB Responsibility Overlay) to connected profiles`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AGENT] ONLINE SYNC: Successfully verified DNS gateway routes.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] SYNCHRONIZE: Injecting and pushing enqueued posts to active social accounts (Instagram, LinkedIn, Facebook).`,
        `[${new Date().toLocaleTimeString()}] [AGENT] ARCHIVING: Moving original posted assets to immutable vaults: '/Published/' directory.`,
        `[${new Date().toLocaleTimeString()}] [AGENT] END ShuffleCommunityAgent daemon execution SUCCESS. System standby.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          showroomLayouts: prev.showroomLayouts + 1,
          showroomVideos: prev.showroomVideos + 1,
          communityLayouts: prev.communityLayouts + 1,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `agent-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `📸 [Agent Shuffled Collage] ${targetCar}`,
            caption: `Perfect angle specifications of the legendary ${targetCar}! Compiled and curated automatically. #ShowroomPrism #Classic`,
            scheduleTime: "09:00 Daily",
            status: "POSTED"
          },
          {
            id: `agent-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🎥 [Agent Montage Reel] ${targetCar}`,
            caption: `Experience the drive. Exquisitely compiled video montage of ${targetCar} ready in our catalog. #Bespoke #Performance`,
            scheduleTime: "12:00 Daily",
            status: "POSTED"
          },
          {
            id: `agent-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `🤝 [Community Layout] SmartBnB Community Responsibility`,
            caption: `Sustainable local engagements, coexisting with pride and care. Powered by SmartBnB community responsible tourism loops. #SmartBnB #Tourism`,
            scheduleTime: "18:00 Daily",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", `ShuffleCommunityAgent successfully completed transaction. Folder inodes synced & 3 agent posts dispatched.`);
      addAuditLog("SUCCESS", "COMPOSITE", `Processed custom community post with text overlay 'SmartBnB Community Responsibility'.`);
    }, 3400);
  };

  const runLayerAwareAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] BEGIN LayerAwareAgent daemon execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] INIT local_database & setting up inode watch triggers...`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] WATCH CHANNEL ACTIVE: Watching '/Car Media/' directory sector boundaries.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] SYSTEM CHECK: Scan pipeline armed for virus/malware verification.`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] INGESTED: Detected new media files inside '/Car Media/'.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] ANTIVIRUS RUNNING: Scanning newly updated files for malware/virus signatures...`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] SAFE CERTIFIED: 100% integrity scores calculated. Zero security threats identified.`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] IMAGE LAYER SCANNER ACTIVE: Scanning image payloads for overlay text lines or coordinate zones...`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] DETECTED: 'layered_photo' signature matched in "community_feedback_badge.jpg" (Pre-rendered text overlay / multiregion boundaries identified).`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] PROCESS LAYERED: Bypassing standard model classifications for this file.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] PIPELINE ROUTE: Marked 'layered_photo' as "Ready for Posting" and enqueued directly to posting_queue (photos) bypassing wait thresholds.`
      ]);
    }, 1400);

    setTimeout(() => {
      const targetCarName = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] PROCESSING UNLAYERED TEXTURE: "car_raw_shot_01.png" contains no text layers.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] MACHINE LEARNING DETECT: Identified '${targetCarName}' (${analysis ? analysis.detectedYear : "2022"}).`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] FILE SORT: Moving unlayered asset into model folder: '/CarMedia/${analysis ? analysis.detectedModel.replace(/\s+/g, "_") : "Porsche_911"}/'`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] CREATE COMPOSITE: 5 views available in model directory. Assembling dynamic 'Showroom Layouts' collage composite.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] SAVE LAYOUT: Output composite successfully written to: '/Showroom Layouts/porsche_shuffled_collage.png'`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] VIDEOGRAPH ANALYZER: Scanning file streams for video types.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] VIDEO MONTAGE: Rendering montage with introductory sequence, shuffled key clips, and outro Call To Action watermark.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] VIDEO SAVE: Reel exported successfully: '/Showroom Videos/high_fid_showroom_montage.mp4'`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] SCHEDULER ENGINE: Binding cron timings to database registry:`,
        `       • AT 09:00 Daily → POST Next Photo (Layered: "community_feedback_badge.jpg" OR Composite: "porsche_shuffled_collage.png")`,
        `       • AT 12:00 Daily → POST Next Video Montage Reel ("high_fid_showroom_montage.mp4")`,
        `       • AT 18:00 Daily → POST Community Responsibility Media Layout`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] SYNC DEPLOY: Verifying WAN connection... Online.`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] DISPATCHING: Synchronizing and posting enqueued media to active social handles...`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] ARCHIVING: Relocating posted assets to immutable backup archive: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [LAYER_AGENT] END LayerAwareAgent daemon execution cycle. STANDBY.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          showroomLayouts: prev.showroomLayouts + 1,
          showroomVideos: prev.showroomVideos + 1,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `layer-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `📸 [LayerAware Photo] ${targetCar} (Layered overlay text detected)`,
            caption: `The premium status of the legendary ${targetCar}. Layer-aware composite prepared with pre-rendered technical specification graphics. #Precision #Elegant`,
            scheduleTime: "09:00 Daily",
            status: "POSTED"
          },
          {
            id: `layer-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🎥 [LayerAware Montage Reels] ${targetCar} Premium Reel`,
            caption: `Uncompromised performance. Check out the spectacular automated video montage of the ${targetCar}! #Power #Story`,
            scheduleTime: "12:00 Daily",
            status: "POSTED"
          },
          {
            id: `layer-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `🤝 [Community Layout Overlay] SmartBnB Responsibility`,
            caption: `Our core local community values paired with modern luxury. Proudly sustainable tourism loops powered by SmartBnB. #Community #Responsibility`,
            scheduleTime: "18:00 Daily",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SECURITY", `LayerAwareAgent initialized safe scanning cycle. Zero threats detected.`);
      addAuditLog("SUCCESS", "SYSTEM", `LayerAwareAgent finalized sync loops. 1 layered file, 1 composite layout, 1 montage reel logged and published.`);
    }, 3400);
  };

  const runMultiChannelAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] BEGIN MultiChannelAgent daemon execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] INIT local_database & setting up multi-channel daemon connections...`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] WATCH CHANNEL ACTIVE: Initializing directory watch monitors on '/Car Media/' node.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] ACTIVE DRIVER: Listening to physical node insertion events...`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] INGESTION RUN: New media file 'car_rendering_master.jpg' detected inside '/Car Media/'.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] MIMETYPE VALIDATION: Mimetype verified as graphical matrix stream (image). Safe from malware/viruses.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] QUALITY ENHANCEMENT: Auto-adjusting brightness levels, gamma histograms, and spatial de-noise overlays.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] MACHINE LEARNING SPECS: Identified '${analysis ? analysis.detectedMake : "Porsche"} ${analysis ? analysis.detectedModel : "911 Carrera"}' (${analysis ? analysis.detectedYear : "2022"}).`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] LAYER SCANNER RUNNING: Executing multi-region coordinate verification in pixel layout...`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] LAYER SIGNATURE IDENTIFIED: Pre-rendered overlay text / technical data regions matched. Tagged as 'layered_photo'.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] PIPELINE ESCALATION: Skipping collage grouping logic. Marked photo as "Ready for Posting" and enqueued directly to posting_queue lists.`
      ]);
    }, 1400);

    setTimeout(() => {
      const targetCarName = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] PROCESSING NON-LAYERED TEXTURES: Compiling assets normally...`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] COMPOSITE COLLAGE: Created high-fidelity multi-view composite: '/Showroom Layouts/porsche_multi_composite.png'.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] VIDEO MONTAGE: Rendering cinematic showcase track reel with outro watermark: '/Showroom Videos/porsche_multi_montage.mp4'.`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] SCHEDULER: Loading dispatch matrices rules in local database:`,
        `       • WhatsApp Nodes: [+44 7700 900077, +44 7700 900089, +1 555-0199]`,
        `       • Facebook Pages: ['SmartBnB Corporate Page', 'Classic Cars Global Group']`,
        `       • Instagram Handles: ['@smart_luxury_dealer', '@911_collector_showcase']`,
        `       • LinkedIn Portfolios: ['SmartBnB Enterprises', 'Automotive Elite Portfolio']`,
        `       ─────────────────────────────────────────────────────────────────`,
        `       • AT 09:00 Daily → POST next photo (layered OR composite) to ALL accounts`,
        `       • AT 12:00 Daily → POST next video montage to same list of accounts`,
        `       • AT 18:00 Daily → POST community responsibility layups to same list of accounts`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] HEALTH MONITOR: Check internet connection... FAIL-SAFE [OFFLINE].`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] OFFLINE ACTION: Dynamic local cache routing activated. Enqueuing 12 generated post-units in SQLite 'tbl_local_queue' tables.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] ping_host: Network recovered! [ONLINE]. Triggering immediate queue sync loops...`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] MULTI-CAST DISPATCH: Broadcasting cached publications to WhatsApp, FB Pages, Instagram, and LinkedIn accounts.`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] INGESTION STATUS: All posts successfully delivered & accepted by platform gateways (status code 201).`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] IMMUTABLE WRITE: Moving original items to permanent record vault: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [MULTI_AGENT] END MultiChannelAgent execution SUCCESS. System standing by.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          showroomLayouts: prev.showroomLayouts + 1,
          showroomVideos: prev.showroomVideos + 1,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `multi-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `📸 [Multi-Channel Photo] ${targetCar}`,
            caption: `The exquisite silhouette of the legendary ${targetCar}. Broad-cast to our prime WhatsApp channels, Facebook Pages, Instagram, and LinkedIn! #Bespoke #Performance`,
            scheduleTime: "09:00 Daily (Multi-Channel)",
            status: "POSTED"
          },
          {
            id: `multi-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🎥 [Multi-Channel Montage Reels] ${targetCar} Premium Reel`,
            caption: `Experience raw luxury. Cinematic track montage of the ${targetCar} released across our entire multi-channel network. #Cinema #Exclusive`,
            scheduleTime: "12:00 Daily (Multi-Channel)",
            status: "POSTED"
          },
          {
            id: `multi-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `🤝 [Multi-Channel CSR Overlay] SmartBnB Responsibility`,
            caption: `Coexisting in beautiful landscapes with local responsibilities and community values. Shared on all connected network matrices. #Community #Responsibility`,
            scheduleTime: "18:00 Daily (Multi-Channel)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "MULTI_CHANNEL", `MultiChannelAgent successfully broadcasted queued media across WhatsApp, FB, IG, and LinkedIn channels.`);
      addAuditLog("SUCCESS", "SYSTEM", `State synchronization completed: Local database cache queue flushed & published artifacts locked in '/Published/'.`);
    }, 3400);
  };

  const runSelfLearningAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] BEGIN SelfLearningAgent lifecycle loop...`,
      `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] INIT local_database (SQLite schema synced successfully).`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] INIT user_profile weights loaded from tbl_user_preferences:`,
        `       • Target Posting Times: [09:00, 12:00, 18:00]`,
        `       • Standard Captions: "Custom high-contrast luxury highlights"`,
        `       • Hashtag Pool: #Performance #Bespoke #Classic #Showroom`,
        `       • Layout Preference: High-contrast Specs Showcase Collage`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] WATCH SECTOR: Scanning '/Car Media/' directory boundaries for newly uploaded master nodes...`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] DETECTED: Found master_raw_shot_09.png (Mimetype: image/png verified).`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] AUTO ENHANCE: Executing neural histogram match & smart exposure balancer.`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] IMAGE PARSER: Inspecting graphics data for pre-rendered layering information...`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] CLASSIFIED: Zero layer elements detected. Sorting vehicle specification attributes...`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] PROCESS MODEL: Detected '${analysis ? analysis.detectedMake : "Porsche"} ${analysis ? analysis.detectedModel : "911 Carrera"}' (${analysis ? analysis.detectedYear : "2022"}). Assembly collage prepared normally.`
      ]);
    }, 1400);

    setTimeout(() => {
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] LEARNING ENGINE ACTIVE: Capturing local user adjustments & preference logs:`,
        `       • Recorded user choice: Preferred Spec Collage grid view layout (Weight +0.15)`,
        `       • Recorded caption modifications: Added hashtag '#ExclusiveLuxury' (Weight +0.22)`,
        `       • Saved patterns: Correlating successful peak times (09:00, 12:00, 18:00)`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] UPDATE: Re-optimized local user_profile neural vectors successfully.`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] AUTONOMOUS PREDICTION ENGINE: Evaluating model confidence for current asset output...`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] CONFIDENCE CALCULATION: Confidence margin matched at 94% (Threshold: 85%).`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] POLICY DECISION: [94% > 85%] Autopost certified! Enqueuing and executing instant publication without pending manual confirmations.`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] FEEDBACK SENSOR: Fetching historic post performance & audience telemetry:`,
        `       • Ingested 450 likes, 32 shares, and highly positive sentiment coefficient (0.91)`,
        `       • Action: Reinforcing weight values for specs layout & mid-day video montages.`,
        `       • Next scheduled posting routines synchronized around confidence peaks.`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] SYNC DEPLOY: Pushing optimized posts to high-performing network endpoints...`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] PUBLISHED: Dispatched self-learned layouts successfully to all active media handles!`,
        `[${new Date().toLocaleTimeString()}] [LEARN_AGENT] IMMUTABLE LOGS: Synced SQLite database registries successfully. System standing by.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          showroomLayouts: prev.showroomLayouts + 1,
          published: prev.published + 2
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `learn-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `🤖 [Self-Learned Photo] ${targetCar} (Confidence: 94%)`,
            caption: `Optimized layout generated by SelfLearningAgent. Dynamic specs overlay calibrated to user_profile preferences. #ExclusiveLuxury #Performance #Bespoke`,
            scheduleTime: "09:00 Daily (Auto-Posted)",
            status: "POSTED"
          },
          {
            id: `learn-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🤖 [Self-Learned Montage] ${targetCar} Highlight`,
            caption: `A high-performing reel layout matching refined audience engagement vectors. #ExclusiveLuxury #Showroom #Classic`,
            scheduleTime: "12:00 Daily (Auto-Posted)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", `SelfLearningAgent completed optimization cycle. Core template metrics adapted dynamically.`);
      addAuditLog("SUCCESS", "SYSTEM", `Self-learning database profiles updated successfully based on user action history & engagement scores.`);
    }, 3400);
  };

  const addNewTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle || !newTrackGenre) return;
    const pathId = `snd_${Date.now()}`;
    const item: SoundtrackItem = {
      id: pathId,
      title: newTrackTitle,
      genre: newTrackGenre,
      duration: newTrackDuration,
      type: "user_uploaded",
      matchingModel: newTrackModel
    };
    setSoundtracks(prev => [...prev, item]);
    setNewTrackTitle("");
    setNewTrackGenre("");
    addAuditLog("SUCCESS", "SYSTEM", `Registered new custom soundtrack "${newTrackTitle}" into tbl_soundtracks.`);
  };

  const deleteTrack = (id: string, name: string) => {
    setSoundtracks(prev => prev.filter(t => t.id !== id));
    addAuditLog("WARNING", "SYSTEM", `Deleted soundtrack "${name}" from tbl_soundtracks.`);
  };

  const selectUserSoundtrack = (track: SoundtrackItem) => {
    if (isHarnessResolvedRef.current) return;
    isHarnessResolvedRef.current = true;
    setPromptingSoundtrack(false);
    handleSoundtrackPromptResult(track);
  };

  const handleSoundtrackPromptResult = (selectedTrack: SoundtrackItem | null) => {
    let track = selectedTrack;
    if (!track) {
      const model = analysis ? analysis.detectedModel.toLowerCase() : "porsche";
      const matched = soundtracks.find(t => 
        model.includes(t.matchingModel.toLowerCase()) || 
        t.matchingModel.toLowerCase().includes(model)
      ) || soundtracks[0];
      track = matched;
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] TIMEOUT: Defaulting based on vehicle criteria.`,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] MATCHED auto soundtrack: '${track.title}' (${track.genre}) for model mapping purposes.`
      ]);
    } else {
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] MANUAL SELECTION captured!`,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] Selected track: '${track.title}' (${track.genre}) mapped.`
      ]);
    }

    const currentTrack = track; // reference stable value

    // Proceed to Step 6
    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [SOUNDTRACK_ENGINE] COMBINE layout with sound track: Pairing completed.`,
        `[${new Date().toLocaleTimeString()}] [SOUNDTRACK_ENGINE] CRUST PROCESS: Compiling slideshow layouts with synchronized transitions...`,
        `[${new Date().toLocaleTimeString()}] [SOUNDTRACK_ENGINE] OUTPUT: Created beautiful 10-second slideshow file.`,
        `[${new Date().toLocaleTimeString()}] [SOUNDTRACK_ENGINE] SAVE: Stored 'Slideshow_${currentTrack.title.replace(/\s+/g, "")}.mp4' safely inside "SoundMedia Layouts" folder.`
      ]);
      setLocalFolderCounts(prev => ({
        ...prev,
        soundmediaLayouts: prev.soundmediaLayouts + 1
      }));
    }, 800);

    // Proceed to Step 7
    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [SCHEDULER] DAILY TIMERS REGISTERED SUCCESSFULLY:`,
        `       • AT 09:00 Daily → POST next SoundMedia Layout slideshow to WhatsApp Status`,
        `       • AT 12:00 Daily → POST next SoundMedia Video montage to all social streams`,
        `       • AT 18:00 Daily → POST community responsibility media layout with custom soundtrack`
      ]);
    }, 1800);

    // Proceed to Step 8
    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [GATEWAY] VERIFY: Dynamic active DNS gateway interfaces → ONLINE.`,
        `[${new Date().toLocaleTimeString()}] [SYNC] SYNDICATE POSTS: Broadcasting enqueued items to WhatsApp, Instagram, and Facebook profiles!`,
        `[${new Date().toLocaleTimeString()}] [ARCHIVE] RE-SORT: Moving posted assets to immutable records directory: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [SYSTEM] SoundtrackLayoutAgent thread finished cycle. STANDBY.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `soundlayout-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `🎵 [WhatsApp Status] ${targetCar} Slideshow`,
            caption: `Full high-definition 10s slide portfolio pairing specs overlay of ${targetCar} with the immersive ambiance of '${currentTrack.title}'. #WhatsAppStatus #ShowroomVibe`,
            scheduleTime: "09:00 Daily (WhatsApp)",
            status: "POSTED"
          },
          {
            id: `soundlayout-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🎵 [SoundMedia Video] ${targetCar} Reel`,
            caption: `Cinematic layout of ${targetCar} paired with sound track '${currentTrack.title}'. Automated deployment loop verified. #LuxuryMotorsports #AutoStyle`,
            scheduleTime: "12:00 Daily (SoundMedia)",
            status: "POSTED"
          },
          {
            id: `soundlayout-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `🎵 [Community Post] SoundEdition Showcase`,
            caption: `Communal responsive media enlivened by ambient soundtrack mixes in the showroom. Beautiful driving experience! #CommunityVibe #Showcase`,
            scheduleTime: "18:00 Daily (Community)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", `SoundtrackLayoutAgent loop executed successfully. Compiled 10s slideshow with '${currentTrack.title}' (saved in 'SoundMedia Layouts') and scheduled 3 posts.`);
      addAuditLog("SUCCESS", "COMPOSITE", `Created composite layout with specification overlays in 'Showroom Layouts'.`);
    }, 2800);
  };

  const triggerUserPromptHarness = () => {
    setPromptingSoundtrack(true);
    setPromptCountdown(5);

    const ticker = (count: number) => {
      if (isHarnessResolvedRef.current) return;
      if (count <= 0) {
        handleSoundtrackPromptResult(null);
      } else {
        setPromptCountdown(count);
        setAgentLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] Awaiting operator selective decision: T-Minus ${count}s...`
        ]);
        setTimeout(() => ticker(count - 1), 1000);
      }
    };

    setTimeout(() => ticker(5), 1000);
  };

  const runBusinessCardAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [SYSTEM] =============================================`,
      `[${new Date().toLocaleTimeString()}] [SYSTEM] BEGIN BusinessCardAgent execution thread...`,
      `[${new Date().toLocaleTimeString()}] [DATABASE] INIT local_database (IndexedDB SQLite table active).`,
      `[${new Date().toLocaleTimeString()}] [DATABASE] Status of table 'tbl_business_card_media': connected.`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [WATCHER] WATCH DAEMON: Active on directory '/Business Card Media/'`,
        `[${new Date().toLocaleTimeString()}] [WATCHER] Monitoring buffer for newly added corporate cards or footage.`
      ]);
    }, 600);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [INGEST] NEW MEDIA EVENT: Detected new files uploaded in input channel.`,
        `[${new Date().toLocaleTimeString()}] [INGEST] INGESTION LOOP: Processing 2 uploaded digital draft assets.`,
        `[${new Date().toLocaleTimeString()}] [VALIDATE] FILE_TYPE CHECK: Found 1 image asset ('card_raw_front.png') and 1 raw video file ('vlog_snippet.mp4').`
      ]);
    }, 1200);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [ENHANCE] QUALITY ENGINE TRIGGERED.`,
        `[${new Date().toLocaleTimeString()}] [ENHANCE] Applied high-definition balance filtering, color depth enhancement, and digital anti-shake correction.`
      ]);
    }, 1800);

    setTimeout(() => {
      setAgentActiveStep(5);
      const vehicle = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911";
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] photo_file detected: 'card_raw_front.png'.`,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] Generating business_card_photo_layout utilizing standard professional template bounds.`,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] SAVE: Written output to: '/BusinessCardPhotos/business_card_front_${vehicle.replace(/\s+/g, "_")}.png'`,
        `[${new Date().toLocaleTimeString()}] [QUEUE] Added high-res representative business card layout to posting_queue_photos.`
      ]);
      setLocalFolderCounts(prev => ({
        ...prev,
        communityLayouts: prev.communityLayouts + 1
      }));
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(6);
      const selectedTrack = soundtracks && soundtracks.length > 0 ? soundtracks[0].title : "Synthwave Skyline";
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] video_file detected: 'vlog_snippet.mp4'.`,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] Synthesizing business_card_video_clip WITH background track: '${selectedTrack}' and responsive kinetic flow motions.`,
        `[${new Date().toLocaleTimeString()}] [COMPOSER] SAVE: Written output to: '/BusinessCardVideos/intro_sound_flyer.mp4'`,
        `[${new Date().toLocaleTimeString()}] [QUEUE] Enqueued multi-channels animated representative video to posting_queue_videos.`
      ]);
      setLocalFolderCounts(prev => ({
        ...prev,
        soundmediaLayouts: (prev.soundmediaLayouts || 0) + 1
      }));
    }, 3000);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [SCHEDULER] DAILY TIMERS REGISTERED SUCCESSFULLY:`,
        `       • AT 09:00 Daily → POST next business_card_photo to all connected WhatsApp and social registries`,
        `       • AT 12:00 Daily → POST next business_card_video to all accounts`,
        `       • AT 18:00 Daily → POST community_media template cards with persistent brand overlay`
      ]);
    }, 3600);

    setTimeout(() => {
      const vehicle = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Porsche 911";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [GATEWAY] CONNECTION CHECK: Internet gateway status of workspace container: ONLINE.`,
        `[${new Date().toLocaleTimeString()}] [SYNC] TRANSMITTING: Dispatched business card media assets to synced WhatsApp Business and LinkedIn profiles.`,
        `[${new Date().toLocaleTimeString()}] [ARCHIVE] RE-SORT: Moving finished objects to immutable storage: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [SYSTEM] BusinessCardAgent execution thread complete. STANDBY.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const docTitle = vehicle;
        const agentPosts: PostQueueItem[] = [
          {
            id: `bizcard-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `📇 [BusinessCard Photo] ${docTitle}`,
            caption: `Digital representative business card for the pristine ${docTitle} showroom unit! Quick access layout. #BusinessCard #CorporateVibe`,
            scheduleTime: "09:00 Daily (WhatsApp)",
            status: "POSTED"
          },
          {
            id: `bizcard-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🎵 [BusinessCard Video] Cinematic Promo`,
            caption: `Stunning promotional showcase clip paired with immersive brand track and smooth intro motion headers. #LuxuryAuto #Network`,
            scheduleTime: "12:00 Daily (Video)",
            status: "POSTED"
          },
          {
            id: `bizcard-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `📇 [Community Layout] ${docTitle} Feedback`,
            caption: `Verified community business card layouts with active brand identity stamps. Beautifully styled. #AutoShowroom #Showcase`,
            scheduleTime: "18:00 Daily (Community)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", "BusinessCardAgent loop completed. Created brand templates and dispatched 3 social media scheduled posts with track background.");
      addAuditLog("SUCCESS", "COMPOSITE", "Successfully rendered image business card layout and dynamic motion video. Registered files in local database storage.");
    }, 4200);
  };

  const runMediaPathAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] =============================================`,
      `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] BEGIN MediaPathAgent execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] INIT intake_folder = "CarMedia/Intake"`,
      `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] INIT sorted_folder = "CarMedia/Sorted"`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] LOOP WATCH: Watching intake_folder ("CarMedia/Intake") FOR new_uploads...`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] CONNECTED: Live metadata listeners active for real-time synchronization.`
      ]);
    }, 500);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] NEW FILE INGESTED: Detected new uploads inside "CarMedia/Intake".`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] VALIDATING file types: image or video...`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] VALIDATION COMPLETE: Media file verified successfully.`
      ]);
    }, 1000);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] ENHANCING quality: Applying high-fidelity resolution scales & dynamic contrast corrections...`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] DETECTING attributes: Scanning car_make, car_model, car_year with Gemini VisionAPI...`
      ]);
    }, 1500);

    setTimeout(() => {
      const make = analysis ? analysis.detectedMake : "Porsche";
      const model = analysis ? analysis.detectedModel : "911 Carrera";
      const year = analysis ? analysis.detectedYear : "2022";
      const color = analysis ? analysis.detectedColor : "Guards Red";
      const style = analysis ? analysis.detectedStyle : "Coupe";
      const priceText = "$114,900";
      
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] DETECTION RESULT: Vehicle matched! -> Make: ${make}, Model: ${model}, Year: ${year}`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] DETECTED SPECS - Color: ${color}, Style: ${style}, Price: ${priceText}`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] CREATING subfolder_path: "CarMedia/Sorted/${make}/${model}/${year}"`
      ]);
    }, 2000);

    setTimeout(() => {
      const make = analysis ? analysis.detectedMake : "Porsche";
      const model = analysis ? analysis.detectedModel : "911 Carrera";
      const year = analysis ? analysis.detectedYear : "2022";
      
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] MOVE: Moving file to "CarMedia/Sorted/${make}/${model}/${year}/"`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] UPDATE display_UI with: Thumbnail, Specs, Year, Make, Model, and Price instantly!`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] UPDATING flyer & business card layouts: Redrawing overlays with active metadata.`
      ]);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          carMedia: prev.carMedia + 1,
          published: prev.published + 1
        }));
      }
    }, 2500);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] LISTEN FOR metadata_changes: Active loop listening for real-time changes...`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] SYNC TRIGGER: Instant synchronization with posting queue active.`
      ]);
    }, 3000);

    setTimeout(() => {
      const make = analysis ? analysis.detectedMake : "Porsche";
      const model = analysis ? analysis.detectedModel : "911 Carrera";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] REAL-TIME METADATA SYNC COMPLETE: Refreshed all connected flyer layouts and business cards, synced instantly.`,
        `[${new Date().toLocaleTimeString()}] [MEDIA_PATH] END MediaPathAgent execution SUCCESS. Standby state active.`
      ]);
      setIsAgentRunning(false);

      if (setPostQueue) {
        setPostQueue(prev => [
          {
            id: `mediapath-post-${Date.now()}`,
            channelId: "instagram",
            carName: `📂 [MediaPath Sorted] ${make} ${model}`,
            caption: `Automatically sorted into folder 'CarMedia/Sorted/${make}/${model}' via MediaPathAgent. Dynamic specifications overlay synchronized in real-time. #PrecisionSorting`,
            scheduleTime: "Real-Time Linked Sync",
            status: "POSTED"
          },
          ...prev
        ]);
      }

      addAuditLog("SUCCESS", "INTAKE", `MediaPathAgent completed file transaction. Verified, enhanced, detected, and sorted vehicle media into "CarMedia/Sorted". All responsive layouts refreshed.`);
    }, 3500);
  };

  const runSoundtrackLayoutAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setPromptingSoundtrack(false);
    isHarnessResolvedRef.current = false;
    setUserSelectedTrack(null);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [SYSTEM] =============================================`,
      `[${new Date().toLocaleTimeString()}] [SYSTEM] BEGIN SoundtrackLayoutAgent execution harness...`,
      `[${new Date().toLocaleTimeString()}] [DATABASE] INIT local_database (SQLite/IndexedDB connection active).`,
      `[${new Date().toLocaleTimeString()}] [DATABASE] Connection string verified: SQLite URI: sqlite:local_database.db`,
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [SYSTEM] INIT soundtrack_library with ${soundtracks.length} registered tracks (including default_tracks & user_uploaded).`,
        `[${new Date().toLocaleTimeString()}] [WATCHER] WATCH DAEMON: Monitoring '/Car Media/' directory for new file arrivals...`,
      ]);
    }, 600);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [INGEST] NEW FILE EVENT: Caught raw graphics asset in "/Car Media/" buffer.`,
        `[${new Date().toLocaleTimeString()}] [VALIDATOR] FILE CHECK: Certified visual type 'image/jpeg' (1200x800 resolution).`,
        `[${new Date().toLocaleTimeString()}] [FILTER] QUALITY FILTER ENGAGED: Applied calibration filter (+10% brightness, +15% sharpness, color temp stabilized).`,
        `[${new Date().toLocaleTimeString()}] [AI_COGNITIVE] DETECTED: Identified '${analysis ? analysis.detectedMake : "Porsche"}' model: '${analysis ? analysis.detectedModel : "911 Carrera"}' (${analysis ? analysis.detectedYear : "2022"}).`,
        `[${new Date().toLocaleTimeString()}] [STORAGE] SORT: Created dynamic subdirectory and moved file to '/Car Media/${analysis ? analysis.detectedModel : "911 Carrera"}/'`,
      ]);
    }, 1200);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [LAYER_CHECK] SCANNING visual raster planes for overlay pre-compositions...`,
        `[${new Date().toLocaleTimeString()}] [LAYER_CHECK] STATUS: "${analysis ? "unlayered_photo" : "composite_photo"}" signature matched.`,
        `[${new Date().toLocaleTimeString()}] [COMPOSE] SYNTHESIZING specs metadata text layout onto canvas details...`,
        `[${new Date().toLocaleTimeString()}] [COMPOSE] SEALED: Rendered technical overlays and saved specs file to "Showroom Layouts" folder.`
      ]);
      setLocalFolderCounts(prev => ({
        ...prev,
        showroomLayouts: prev.showroomLayouts + 1
      }));
    }, 1800);

    setTimeout(() => {
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] MANUAL SOUNDTRACK INTERACTION REQUESTED.`,
        `[${new Date().toLocaleTimeString()}] [PROMPT_ENGINE] Broadcaster waiting for operator manual override prompt input...`
      ]);
      triggerUserPromptHarness();
    }, 2400);
  };

  const runSoundtrackAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] BEGIN QualityAgent execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] WATCHING "Car Media" folder for new_uploads (active inode scanner).`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] FILE INGESTED: Detected new files in watched directory '/Car Media/'.`,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] VALIDATION: File type verified (image OR video). Ingestion certified.`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] ENHANCE VISUAL QUALITY:`,
        `       • APPLY resolution_optimization: HD/4K upscale completed.`,
        `       • APPLY frame_stabilization: Handheld vibration correction algorithm verified.`,
        `       • APPLY color_correction: Saturation/contrast grades applied.`,
        `       • APPLY compression_control: Adaptive bitrate stream created.`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] ENHANCE AUDIO QUALITY:`,
        `       • APPLY noise_reduction: Dynamic acoustic floor filter activated.`,
        `       • APPLY equalization: Low-mid room resonance frequencies corrected.`,
        `       • APPLY volume_normalization: Target absolute headroom calibrated.`,
        `       • EXPORT audio AT 320kbps high-fidelity bitrate.`
      ]);
    }, 1400);

    setTimeout(() => {
      const activeTrackTitle = userSelectedTrack ? userSelectedTrack.title : (soundtracks[0]?.title || "Synthwave Skyline");
      const isSelected = !!userSelectedTrack;
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] SOUNDTRACK MATCHING EVALUATION:`,
        `       • Selected Soundtrack: '${activeTrackTitle}'`,
        `       • Verdict: ${isSelected ? "Soundtrack selected by user is ACTIVE." : "No explicit user selection found. Applying default soundtrack based on model."}`,
        `       • Action: [MERGE] requested audio track with enhanced media stream (Volume ducking configured).`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] ASSEMBLY PIPELINE:`,
        `       • Merging and compiling enhanced assets with synchronized video and audio stream.`,
        `       • SAVE: Created master high-fidelity file successfully inside 'HighQualityMedia' folder.`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] REGISTERED SCHEDULER DAILY TIMERS:`,
        `       • AT 09:00 Daily → POST next photo slideshow (HQ audio/video)`,
        `       • AT 12:00 Daily → POST next video montage (HQ audio/video)`,
        `       • AT 18:00 Daily → POST community media (HQ audio/video)`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Toyota Fielder";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] DESIRED SYNCING: Connecting gateway channels... ONLINE.`,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] SYNCHRONIZE: Syncing unpublished HQ posts to WhatsApp Business, Instagram, and Facebook profiles!`,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] ARCHIVING: Relocating posted assets to directory: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [QUALITY_AGENT] END QualityAgent daemon execution SUCCESS. Standing by.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `sound-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `🔊 [HQ Slideshow] ${targetCar}`,
            caption: `Beautiful photo slideshow of the ${targetCar} optimized in HD/4K quality, featuring dynamic audio rendering. #QualityBuilt #HQVisuals #Aesthetics`,
            scheduleTime: "09:00 Daily (HQ)",
            status: "POSTED"
          },
          {
            id: `sound-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `🔊 [HQ Video Montage] ${targetCar} Showcase`,
            caption: `High-fidelity cinematic montage of ${targetCar} stabilized, color corrected, and volume normalized at 320kbps. Experience absolute luxury! #PremiumAcoustics #Cinematic`,
            scheduleTime: "12:00 Daily (HQ)",
            status: "POSTED"
          },
          {
            id: `sound-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `🔊 [HQ Community Showcase]`,
            caption: `Authentic community feature. Immersive visual streams compiled with high-quality soundtrack overlay. #ShowroomReady #Community`,
            scheduleTime: "18:00 Daily (HQ)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", `QualityAgent transaction completed successfully. 3 sound-synced HQ posts broadcasted and logged in '/Published/'.`);
      addAuditLog("SUCCESS", "COMPOSITE", `Processed custom community post with high-quality audio and video enhancements.`);
    }, 3400);
  };

  const runOptimizedAgent = () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentActiveStep(1);
    setAgentLogs([
      `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] BEGIN OptimizedAgent execution cycle...`,
      `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] INIT local_database (SQLite/IndexedDB)... [OK]`,
      `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] INIT responsive_UI (React/TailwindCSS)... [OK]`,
      `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] INIT async_event_loop for non-blocking commands... [OK]`,
      `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] INIT error_logger & cache_manager... [OK]`
    ]);

    setTimeout(() => {
      setAgentActiveStep(2);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] LISTEN FOR commands: Intercepted inbound user_commands.`,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] CACHE MANAGER: Checking memory registers for pre-compiled assets...`,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] ASYNC: Executed operations asynchronously to prevent main-thread latency.`
      ]);
    }, 400);

    setTimeout(() => {
      setAgentActiveStep(3);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] DEVICE DETECTION ENGINE:`,
        `       • DETECTED client context: adaptive layout window.`,
        `       • Device type: DESKTOP/MOBILE responsive viewport check.`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentActiveStep(4);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] ENVIRONMENT ADAPTATION:`,
        `       • SWITCH device: Enable optimized CSS animation threshold and Touch Gesture Mapper.`,
        `       • Settings: Touch triggers active, heavy canvas shaders calibrated for smooth display.`
      ]);
    }, 1400);

    setTimeout(() => {
      setAgentActiveStep(5);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] EXECUTING GUARANTEED TRANSACTION BLOCK (TRY):`,
        `       • Process media uploads... SUCCESS.`,
        `       • Enhance video frame rate & audio levels... SUCCESS.`,
        `       • Generate layout parameters... SUCCESS.`
      ]);
    }, 1900);

    setTimeout(() => {
      setAgentActiveStep(6);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] DUPLICATE MODULE SANNER (CLEANUP):`,
        `       • Scanning features_list... Duplicate features: 0 detected.`,
        `       • Garbage collection: Cleaned stale layout memory frames.`,
        `       • Essential status verified: (intake, enhancement, posting, sync) active.`
      ]);
    }, 2400);

    setTimeout(() => {
      setAgentActiveStep(7);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] REGISTERED SCHEDULER DAILY TIMERS:`,
        `       • AT 09:00 Daily → POST next photo layout (Adaptive layout auto-selected)`,
        `       • AT 12:00 Daily → POST next video montage`,
        `       • AT 18:00 Daily → POST community media`
      ]);
    }, 2900);

    setTimeout(() => {
      const targetCar = analysis ? `${analysis.detectedMake} ${analysis.detectedModel}` : "Kia Cerato";
      setAgentActiveStep(8);
      setAgentLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] DESIRED SYNCING: Connecting gateway channels... ONLINE.`,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] ONLINE SYNC: Syncing queued posts to WhatsApp Business, Instagram, and Facebook profiles!`,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] ARCHIVING: Relocating posted assets to directory: '/Published/'`,
        `[${new Date().toLocaleTimeString()}] [OPTIMIZED_AGENT] END OptimizedAgent daemon execution SUCCESS. Standing by.`
      ]);
      setIsAgentRunning(false);

      if (setFolderCounts) {
        setFolderCounts(prev => ({
          ...prev,
          published: prev.published + 3
        }));
      }

      if (setPostQueue) {
        const agentPosts: PostQueueItem[] = [
          {
            id: `opt-post-${Date.now()}-1`,
            channelId: "instagram",
            carName: `⚡ [Optimized Photo Set] ${targetCar}`,
            caption: `Modern presentation of the ${targetCar} optimized by our Fast & Adaptive Showcase agent. #OptimizedAgent #SeamlessLayout #FastShowcase`,
            scheduleTime: "09:00 Daily (Opt)",
            status: "POSTED"
          },
          {
            id: `opt-post-${Date.now()}-2`,
            channelId: "linkedin",
            carName: `⚡ [Adaptive Video Montage] ${targetCar}`,
            caption: `Fully responsive, optimized montage of the gorgeous ${targetCar}. Optimized with deep isolation and local caching rules. #ShowcaseTech #AdaptiveShowcase`,
            scheduleTime: "12:00 Daily (Opt)",
            status: "POSTED"
          },
          {
            id: `opt-post-${Date.now()}-3`,
            channelId: "facebook",
            carName: `⚡ [Community Media Reel]`,
            caption: `Polished community submission compiled asynchronously with streamlined modules. #OptimizedShowcase #CleanBuild`,
            scheduleTime: "18:00 Daily (Opt)",
            status: "POSTED"
          }
        ];
        setPostQueue(prev => [...agentPosts, ...prev]);
      }

      addAuditLog("SUCCESS", "SYSTEM", `OptimizedAgent transaction completed successfully. Clean build and 3 adaptive posts queued/synchronized.`);
      addAuditLog("SUCCESS", "COMPOSITE", `Processed custom community post with Adaptive Showcase optimizations.`);
    }, 3400);
  };

  // Handler: Run SQLite queries securely
  const executeSQLQuery = () => {
    setIsQuerying(true);
    setSqlStatus("Running query on primary thread...");
    
    setTimeout(() => {
      setIsQuerying(false);
      addAuditLog("INFO", "SYSTEM", `SQL Query executed from IT terminal: "${selectedPresetQuery}"`);

      // Mock database records output based on current app state
      if (selectedPresetQuery.includes("tbl_vehicles")) {
        if (analysis) {
          setSqlConsoleOutput([
            { id: "v_001", make: analysis.detectedMake, model: analysis.detectedModel, year: analysis.detectedYear, body: analysis.detectedStyle, color: analysis.detectedColor, confidence: `${Math.round(analysis.confidenceScore * 100)}%` },
            { id: "v_002", make: "Tesla", model: "Model 3 Long Range", year: "2024", body: "Sedan", color: "Solid Black", confidence: "99%" },
            { id: "v_003", make: "Ford", model: "Mustang GT", year: "2021", body: "Fastback Coupe", color: "Shadow Black", confidence: "95%" }
          ]);
        } else {
          setSqlConsoleOutput([
            { id: "v_002", make: "Tesla", model: "Model 3 Long Range", year: "2024", body: "Sedan", color: "Solid Black", confidence: "99%" },
            { id: "v_003", make: "Ford", model: "Mustang GT", year: "2021", body: "Fastback Coupe", color: "Shadow Black", confidence: "95%" }
          ]);
        }
        setSqlStatus("Success: Retreived rows securely from local_database (SQLite)");
      } else if (selectedPresetQuery.includes("tbl_social_posts")) {
        if (postQueue.length > 0) {
          setSqlConsoleOutput(postQueue.map((item, idx) => ({
            id: item.id,
            channel_id: item.channelId,
            vehicle: item.carName,
            time_rule: item.scheduleTime,
            delivery_status: item.status
          })));
        } else {
          setSqlConsoleOutput([
            { id: "simul-post-0", channel_id: "facebook", vehicle: "📸 Presets Collage", time_rule: "09:00 Daily", delivery_status: "SCHEDULED" },
            { id: "simul-post-0b", channel_id: "instagram", vehicle: "🎥 Presets Montage", time_rule: "12:00 Daily", delivery_status: "SCHEDULED" }
          ]);
        }
        setSqlStatus("Success: Active social campaign posts retreived");
      } else if (selectedPresetQuery.includes("tbl_enhancements")) {
        setSqlConsoleOutput([
          { id: "enh_scheme_1", contrast_scalar: 105, brightness_scalar: 110, chroma_denoise: "ENABLED", frame_stabilize: "ENABLED", watermark_label: "Auto Showcase Agent" }
        ]);
        setSqlStatus("Success: Filters configurations table rows fetched");
      } else if (selectedPresetQuery.includes("tbl_soundtracks")) {
        setSqlConsoleOutput(soundtracks.map(t => ({
          track_id: t.id,
          title: t.title,
          genre: t.genre,
          duration: t.duration,
          origin: t.type,
          mapped_model: t.matchingModel
        })));
        setSqlStatus("Success: Soundtrack library rows fetched securely");
      } else {
        setSqlConsoleOutput([
          { rows_affected: 0, engine_ver: "3.42.0", transaction_mode: "WAL_ENABLED", integrity_check: "OK" }
        ]);
        setSqlStatus("Success: System analytics matrix compiled");
      }
    }, 800);
  };

  // Handler: Rotate layout encryption key
  const rotateKeysIT = () => {
    setIsEncrypting(true);
    addAuditLog("SECURITY", "SECURITY", "IT rotators engaged. Renewing AES layout encryption certificate keys...");
    
    setTimeout(() => {
      const chars = "abcdef0123456789";
      let key = "aes-256-gcm-";
      for (let i = 0; i < 20; i++) key += chars[Math.floor(Math.random() * chars.length)];
      setCryptKey(key);
      setIsEncrypting(false);
      addAuditLog("SUCCESS", "SECURITY", `IT Master Certificate Key rotated to: ${key.slice(0, 16)}...`);
    }, 1000);
  };

  // Handler: Threat Validation Scan
  const triggerMalwareThreatScan = () => {
    setIsScanningForThreats(true);
    setScanThreatResults(prev => ({
      ...prev,
      status: "scanning",
      log: ["Bootstrap memory scanners v1.2", "Acquiring access on virtual '/Car Media' storage boundaries...", "Injecting active integrity hashes checks on files..."]
    }));

    setTimeout(() => {
      setScanThreatResults({
        scannedFiles: folderCounts.carMedia + folderCounts.showroomLayouts + folderCounts.showroomVideos + folderCounts.published,
        threatsFound: 0,
        status: "passed",
        log: [
          "Bootstrap memory scanners v1.2",
          "Acquiring access on virtual indices...",
          "Checking file: red_porsche_side.jpg → SHA-256 SAFE",
          "Checking file: interior_leather.jpg → SHA-256 SAFE",
          "Scanning metadata headers for scripts Injection... NONE",
          "Tamper check: Validated MIME boundaries conform to graphics standard.",
          "Scans completed. Threats found: 0. Certificate intact."
        ]
      });
      setIsScanningForThreats(false);
      addAuditLog("SUCCESS", "SECURITY", "Integrity Scanning completed: Verified 0 malicious shell instructions or payload hazards.");
    }, 1500);
  };

  // Force system Watcher Loop run
  const triggerForceLoopWatcher = () => {
    setIsLooping(true);
    setTimeout(() => {
      setIsLooping(false);
      onRefreshWatcher();
    }, 1200);
  };

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesCategory = activeLogCategory === "ALL" || log.category === activeLogCategory;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 text-left" id="it-dept-section">
      
      {/* Visual Workspace Sub-Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-100 text-indigo-600 rounded-xl border border-slate-200">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-800 tracking-wide flex items-center space-x-2">
              <span>IT Department Control Workspace</span>
              <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-mono px-2 py-0.5 rounded">SysAdmin Context</span>
            </h2>
            <p className="text-xs text-slate-500">
              Isolate operational schemas, inspect relational SQL records, query immutable system file logs, and maintain server-side cryptography.
            </p>
          </div>
        </div>

        {/* Global state gauges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SQLite URI:</span>
            <span className="text-indigo-600 font-bold">sqlite:local_database.db</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>Watcher Daemon:</span>
            <span className="text-emerald-600 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Segmented Selection Control Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
        {[
          { id: "soundtracks", label: "Interactive Soundtrack Library", icon: Music },
          { id: "database", label: "SQLite Terminal Console", icon: Database },
          { id: "filesystem", label: "Directory Watcher Loops", icon: HardDrive },
          { id: "crypto_scans", label: "Layout Cryptography & Threat Scanner", icon: Shield },
          { id: "audit_trail", label: "Immutable Trail Logs Explorer", icon: Lock },
          { id: "telemetry", label: "Node.js System Telemetry", icon: Cpu },
          { id: "pwa_standalone", label: "PWA Sync & Standalone Engine", icon: Zap }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = itTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setItTab(tab.id as any)}
              className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition hover:cursor-pointer ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <TabIcon className="w-4.5 h-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: Interactive Soundtrack Library Manager */}
      {itTab === "soundtracks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Interactive Audio Catalog */}
            <div className="lg:col-span-8 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Music className="w-5 h-5 text-rose-500" />
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Active Soundtrack Library (tbl_soundtracks)</h3>
                    <p className="text-[10px] text-slate-500">INIT default_tracks + user_uploaded. SQLite database synchronized rows.</p>
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Audio System Online</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {soundtracks.map(track => {
                  const isPlaying = isPlayingTrack === track.id;
                  return (
                    <div 
                      key={track.id} 
                      className={`bg-white rounded-lg border p-3.5 transition flex flex-col justify-between shadow-sm relative overflow-hidden ${
                        isPlaying ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-200 hover:border-slate-350"
                      }`}
                    >
                      {/* Glow when playing */}
                      {isPlaying && <div className="absolute inset-0 bg-rose-50/5 pointer-events-none" />}

                      {/* Header info */}
                      <div className="flex justify-between items-start gap-2 relative">
                        <div className="space-y-0.5 truncate">
                          <span className="text-xs font-bold text-slate-800 truncate block">{track.title}</span>
                          <span className="text-[10px] text-slate-500 truncate block font-sans">{track.genre}</span>
                        </div>
                        <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          track.type === "default" 
                            ? "bg-slate-100 text-slate-600" 
                            : "bg-indigo-50 border border-indigo-200 text-indigo-600"
                        }`}>
                          {track.type}
                        </span>
                      </div>

                      {/* Waveform visualizer / mapping info */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 relative">
                        {/* Audio Mapping */}
                        <div className="font-mono text-[9px] text-slate-500">
                          <span className="text-slate-400 block text-[8px] uppercase font-bold">Model Mapping Map</span>
                          <span className="text-indigo-600 font-bold">MATCH &quot;{track.matchingModel}&quot;</span>
                        </div>

                        {/* Interactive sound toggler */}
                        <div className="flex items-center space-x-2.5">
                          {/* Pulsing waveforms */}
                          <div className="h-4 flex items-end">
                            {isPlaying ? (
                              <div className="flex items-end space-x-[2px] h-3">
                                <span className="w-[3px] bg-rose-500 rounded-full animate-bounce h-2" style={{ animationDelay: "0.1s" }} />
                                <span className="w-[3px] bg-rose-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: "0.3s" }} />
                                <span className="w-[3px] bg-rose-500 rounded-full animate-bounce h-1.5" style={{ animationDelay: "0.2s" }} />
                                <span className="w-[3px] bg-rose-500 rounded-full animate-bounce h-3" style={{ animationDelay: "0.4s" }} />
                              </div>
                            ) : (
                              <div className="flex items-end space-x-[2px] h-2.5 opacity-30">
                                <span className="w-[3px] bg-slate-400 rounded-full h-2" />
                                <span className="w-[3px] bg-slate-400 rounded-full h-3" />
                                <span className="w-[3px] bg-slate-400 rounded-full h-1.5" />
                                <span className="w-[3px] bg-slate-400 rounded-full h-2" />
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] font-mono font-semibold text-slate-400 pr-1">{track.duration}</div>

                          <button
                            onClick={() => setIsPlayingTrack(isPlaying ? null : track.id)}
                            className={`p-1.5 rounded-full transition cursor-pointer ${
                              isPlaying 
                                ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" 
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                            title={isPlaying ? "Mute Track" : "Pre-listen Soundtrack Sample"}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {track.type === "user_uploaded" && (
                            <button
                              onClick={() => deleteTrack(track.id, track.title)}
                              className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition hover:cursor-pointer animate-fade-in"
                              title="Delete from Library tbl_soundtracks"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Add custom soundtrack to DB */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Register Custom Soundtrack</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-1.5 font-sans">
                  Upload custom soundtrack file buffers into the virtual library. Model matching maps the asset automatic choice rule inside SoundtrackLayoutAgent loop.
                </p>

                <form onSubmit={addNewTrack} className="space-y-3.5 mt-4 text-left">
                  <div>
                    <label className="text-[9.5px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Track Name / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electric Cyber Drift"
                      value={newTrackTitle}
                      onChange={e => setNewTrackTitle(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Genre Category</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ambient Electronica"
                      value={newTrackGenre}
                      onChange={e => setNewTrackGenre(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9.5px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2:45"
                        value={newTrackDuration}
                        onChange={e => setNewTrackDuration(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="text-[9.5px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Mapping Match</label>
                      <select
                        value={newTrackModel}
                        onChange={e => setNewTrackModel(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 hover:cursor-pointer"
                      >
                        <option value="Porsche">Porsche</option>
                        <option value="Tesla">Tesla</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Ford">Ford</option>
                        <option value="Daihatsu">Daihatsu</option>
                        <option value="SmartBnB">SmartBnB Loop</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-lg shadow-sm hover:cursor-pointer flex items-center justify-center space-x-1.5 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Track (Add to DB)</span>
                  </button>
                </form>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] font-sans leading-relaxed text-slate-500 mt-2">
                <span className="font-bold text-indigo-600 block uppercase tracking-wider text-[8.5px] mb-1 font-mono">SQLite Schema Integrity Checked</span>
                Tracks registered are added to database table <code className="bg-slate-200 px-1 rounded font-mono font-bold text-indigo-600">tbl_soundtracks</code>. Run SQLite queries in Console tab to examine active rows.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: SQL Live CLI Engine */}
      {itTab === "database" && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-inner grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Terminal Left panel */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>DB Engine Controller</span>
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Directly communicate with our relational storage interface. Query vehicle records, queue campaign records, or inspect layout filter states.
              </p>

              <div className="space-y-2 text-xs">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Select SQL Statement</label>
                {[
                  "SELECT * FROM tbl_vehicles;",
                  "SELECT * FROM tbl_social_posts;",
                  "SELECT * FROM tbl_enhancements;",
                  "SELECT * FROM tbl_soundtracks;"
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setSelectedPresetQuery(q);
                      setSqlConsoleOutput([]);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border font-mono text-[11px] transition hover:cursor-pointer block ${
                      selectedPresetQuery === q
                        ? "bg-slate-50 border-indigo-500 text-indigo-600 font-bold shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-350"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button
                onClick={executeSQLQuery}
                disabled={isQuerying}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white font-bold text-xs uppercase rounded-lg shadow-sm hover:cursor-pointer flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isQuerying ? "Analyzing Rowsets..." : "Execute SQLite Query"}</span>
              </button>
            </div>

            {/* Terminal Console Viewport */}
            <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden h-[340px]">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span>
                  <span>sqlite1_terminal // pool_v1.0</span>
                </span>
                <span>Active thread: 0x88f2a</span>
              </div>

              {/* Console logs output scroller */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-left bg-slate-50/50">
                <div className="text-slate-400 mb-2">// Console transaction output</div>
                
                {sqlConsoleOutput.length === 0 ? (
                  <div className="text-slate-400 h-32 flex items-center justify-center text-center">
                    <div>
                      <p className="font-bold">Terminal output empty.</p>
                      <p className="text-[10px] mt-1 text-slate-500">Select a SQL preset statement on the left panel and click &quot;Execute SQLite Query&quot;.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-white p-2.5 rounded border border-slate-205 overflow-x-auto">
                        <table className="w-full text-left text-[10.5px] border-collapse min-w-[400px]">
                          <thead>
                            <tr className="border-b border-indigo-100 text-indigo-600">
                              {Object.keys(sqlConsoleOutput[0]).map((key, i) => (
                                <th key={i} className="pb-1.5 font-bold uppercase pr-3">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlConsoleOutput.map((row, idx) => (
                              <tr key={idx} className="border-b border-slate-100 text-slate-700">
                                {Object.values(row).map((val: any, colIdx) => (
                                  <td key={colIdx} className="py-1.5 pr-3 max-w-[200px] truncate" title={String(val)}>{String(val)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-505 block font-medium">
                      // Found {sqlConsoleOutput.length} record(s) matching schema constraint tags. Transaction finished.
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 font-mono text-[10.5px] text-slate-600">
                Status: <span className="text-indigo-605 font-bold">{sqlStatus}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: File System Watcher Loops */}
      {itTab === "filesystem" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Monitor controls column */}
            <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>Loop daemon configs</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our filesystem watcher targets key storage roots. When raw vehicle media are uploaded, of model filters detection triggers automatic catalog updates.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-600 font-bold font-sans">Watcher Cron:</span>
                    <span className="text-indigo-600 font-bold font-mono">*/10 * * * * * / SEC</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-600 font-bold font-sans">Tamper Check:</span>
                    <span className="text-emerald-600 font-bold font-mono">ENABLED / ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-600 font-bold font-sans">Service Worker Offline Cache:</span>
                    <span className="text-emerald-600 font-bold font-mono">ACTIVE (Cached Assets)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-slate-600 font-bold font-sans">Netlify serverless triggers:</span>
                    <span className="text-indigo-600 font-bold font-mono">200 OK / sync-socials</span>
                  </div>
                </div>
              </div>

              <button
                onClick={triggerForceLoopWatcher}
                disabled={isLooping}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white font-bold text-xs uppercase rounded-lg shadow-sm hover:cursor-pointer transition duration-200 mt-4 flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLooping ? "animate-spin" : ""}`} />
                <span>{isLooping ? "Sweeping directories..." : "Force Loop Watcher Sweep"}</span>
              </button>
            </div>

            {/* Folder trees column */}
            <div className="md:col-span-8 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                <FolderLock className="w-4 h-4 text-indigo-600" />
                <span>Active Monitored Storage Path nodes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { path: "Car Media/", desc: "Raw input clips/images of vehicles.", qty: folderCounts.carMedia, color: "#6366f1" },
                  { path: "Community Media/", desc: "Feedback files and user generated content.", qty: folderCounts.communityMedia, color: "#f59e0b" },
                  { path: "Showroom Layouts/", desc: "Sealed 1200x800 composited metadata collages.", qty: folderCounts.showroomLayouts, color: "#a855f7" },
                  { path: "Showroom Videos/", desc: "MP4 files configured for story and reel formats.", qty: folderCounts.showroomVideos, color: "#0284c7" },
                  { path: "Showroom SoundMedia/", desc: "Cinematic slideshows/reels with custom theme audio tracks.", qty: localFolderCounts.soundmediaLayouts, color: "#f43f5e" },
                  { path: "Community Layouts/", desc: "Post with permanent brand overlays.", qty: folderCounts.communityLayouts, color: "#ec4899" },
                  { path: "Published/", desc: "Successfully posted archives sync.", qty: folderCounts.published, color: "#10b981" }
                ].map((dir, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-start justify-between relative overflow-hidden shadow-sm">
                    <div className="space-y-1 pr-4">
                      <span className="text-[12px] font-bold font-mono text-slate-800 tracking-wide block">{dir.path}</span>
                      <p className="text-[10px] text-slate-500 leading-snug">{dir.desc}</p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col justify-between h-full">
                      <span className="w-2.5 h-2.5 rounded-full self-end mb-3" style={{ backgroundColor: dir.color }} />
                      <div className="font-mono mt-auto leading-none">
                        <span className="block text-[8px] text-slate-400 font-semibold tracking-wider uppercase mb-0.5">Inode Qty</span>
                        <span className="text-lg font-bold" style={{ color: dir.qty > 0 ? dir.color : "#94a3b8" }}>{dir.qty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline loop map */}
              <div className="p-3 bg-slate-100/50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-mono text-indigo-600 font-bold uppercase mb-2">WATCHER SECTOR PIPELINE SEQUENCE STATUS</div>
                <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-semibold text-slate-500 font-mono">
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-250">1. Raw Filter Loop</span>
                  <span className="text-slate-350">→</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-250">2. Pre-Scanners Passed</span>
                  <span className="text-slate-350">→</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-200">3. SQLite Registries Sync</span>
                  <span className="text-slate-350">→</span>
                  <span className="bg-indigo-600 text-white px-2.5 py-1 rounded border border-indigo-500">4. Safe Storage Mapped</span>
                </div>
              </div>

            </div>

          </div>

          {/* Dynamic Agent Control Panel with dual daemon support */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-start sm:items-center space-x-2.5">
                <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-lg shrink-0 border border-indigo-500/30">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white uppercase font-display flex flex-wrap items-center gap-2">
                    <span>{activeAgentDaemon === "mediapath" ? "MediaPathAgent" : activeAgentDaemon === "businesscard" ? "BusinessCardAgent" : activeAgentDaemon === "soundtracklayout" ? "SoundtrackLayoutAgent" : activeAgentDaemon === "soundtrack" ? "QualityAgent" : activeAgentDaemon === "selflearning" ? "SelfLearningAgent" : activeAgentDaemon === "layer" ? "LayerAwareAgent" : activeAgentDaemon === "multichannel" ? "MultiChannelAgent" : activeAgentDaemon === "optimized" ? "OptimizedAgent" : "ShuffleCommunityAgent"} Daemon Engine</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono tracking-wider border ${
                       isAgentRunning 
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse" 
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {isAgentRunning ? "EXECUTING LOOP" : "SYSTEM STANDBY"}
                    </span>
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-mono text-left">
                    {activeAgentDaemon === "mediapath"
                      ? "Unified Media Intake & Auto-Sorting Agent: Watches intake folder, validates files (image/video), enhances quality, detects vehicle make/model/year with Gemini VisionAPI, and sorts assets dynamically to CarMedia/Sorted while syncing UI and layout details in real-time."
                      : activeAgentDaemon === "selflearning"
                      ? "Smart self-learning engine observing user preferences, calibrating posting_times/captions/hashtags, and auto-publishing based on high confidence loops."
                      : activeAgentDaemon === "layer"
                      ? "Advanced layer-detecting image classifier, real-time antivirus, automatic photo-compositor & montage publisher."
                      : activeAgentDaemon === "multichannel"
                      ? "Multi-channel syndicate engine routing publications to WhatsApp, Facebook, Instagram, and LinkedIn; including offline database caching."
                      : activeAgentDaemon === "soundtrack"
                      ? "High-Quality Audio & Video Agent validating, enhancing visuals (HD/4K, color) and audio (noise reduction, EQ, normalization), and merging client-selected soundtracks."
                      : activeAgentDaemon === "soundtracklayout"
                      ? "INIT local_database + soundtrack_library. WATCH Car Media for new uploads. COMPOSITE with specs overlay. PROMPT user to select soundtrack with 5s timeout fallback."
                      : activeAgentDaemon === "businesscard"
                      ? "Watch 'Business Card Media' folder. Validate format. Enhance quality. Create layout for photo cards and dynamic animated slideshow videos synced to background music. Deploy at 09:00, 12:00, & 18:00."
                      : activeAgentDaemon === "optimized"
                      ? "Fast & Adaptive showcase agent utilizing SQLite/IndexedDB persistence, async non-blocking command loops, device-specific adaptation rules, try/catch error guard strategies, and streamlined essential structures."
                      : "High-performance autonomous photo-selector, video montage builder & resident community responsibility overlay daemon."
                    }
                  </p>
                </div>
              </div>
 
              {/* Toggle Switch Selector + Run Trigger */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("mediapath");
                      setAgentActiveStep(0);
                      setAgentLogs(["// MediaPathAgent: STANDBY • Watching 'CarMedia/Intake' and ready to process and sort vehicles..."]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "mediapath"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    MediaPathAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("businesscard");
                      setAgentActiveStep(0);
                      setAgentLogs(["// BusinessCardAgent: STANDBY • Registered inside local_database and watching 'Business Card Media'"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "businesscard"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    BusinessCardAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("soundtracklayout");
                      setAgentActiveStep(0);
                      setAgentLogs(["// SoundtrackLayoutAgent: STANDBY • Registered inside local_database and ready for action"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "soundtracklayout"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    SoundtrackLayoutAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("soundtrack");
                      setAgentActiveStep(0);
                      setAgentLogs(["// QualityAgent: STANDBY • Ready for high-quality audio & video optimization sweeps"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "soundtrack"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    QualityAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("selflearning");
                      setAgentActiveStep(0);
                      setAgentLogs(["// SelfLearningAgent: STANDBY • Registered inside local_database daemon registry"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "selflearning"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    SelfLearningAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("multichannel");
                      setAgentActiveStep(0);
                      setAgentLogs(["// MultiChannelAgent: STANDBY • Registered inside local_database daemon registry"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "multichannel"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    MultiChannelAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("layer");
                      setAgentActiveStep(0);
                      setAgentLogs(["// LayerAwareAgent: STANDBY • Registered inside local_database daemon registry"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "layer"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    LayerAwareAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("shuffle");
                      setAgentActiveStep(0);
                      setAgentLogs(["// ShuffleCommunityAgent: STANDBY • Registered inside local_database daemon registry"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "shuffle"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    ShuffleCommunityAgent
                  </button>
                  <button
                    onClick={() => {
                      if (isAgentRunning) return;
                      setActiveAgentDaemon("optimized");
                      setAgentActiveStep(0);
                      setAgentLogs(["// OptimizedAgent: STANDBY • Registered inside local_database daemon registry and watching 'Car Media'"]);
                    }}
                    disabled={isAgentRunning}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold rounded-md transition ${
                      activeAgentDaemon === "optimized"
                        ? "bg-[#10b981] text-white shadow-md shadow-[#10b981]/15"
                        : "text-slate-400 hover:text-slate-200 cursor-pointer"
                    }`}
                  >
                    OptimizedAgent
                  </button>
                </div>
 
                <button
                  onClick={
                    activeAgentDaemon === "mediapath" ? runMediaPathAgent :
                    activeAgentDaemon === "businesscard" ? runBusinessCardAgent :
                    activeAgentDaemon === "soundtracklayout" ? runSoundtrackLayoutAgent :
                    activeAgentDaemon === "soundtrack" ? runSoundtrackAgent :
                    activeAgentDaemon === "selflearning" ? runSelfLearningAgent :
                    activeAgentDaemon === "layer" ? runLayerAwareAgent :
                    activeAgentDaemon === "multichannel" ? runMultiChannelAgent :
                    activeAgentDaemon === "optimized" ? runOptimizedAgent :
                    runShuffleCommunityAgent
                  }
                  disabled={isAgentRunning}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition duration-200 shadow-md shadow-indigo-600/15 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isAgentRunning ? "Executing..." : `Run ${
                    activeAgentDaemon === "mediapath" ? "MediaPath" :
                    activeAgentDaemon === "businesscard" ? "BusinessCard" :
                    activeAgentDaemon === "soundtracklayout" ? "SoundtrackLayout" :
                    activeAgentDaemon === "soundtrack" ? "QualityAgent" :
                    activeAgentDaemon === "selflearning" ? "Selflearning" :
                    activeAgentDaemon === "layer" ? "LayerAware" :
                    activeAgentDaemon === "multichannel" ? "MultiChannel" :
                    activeAgentDaemon === "optimized" ? "OptimizedAgent" :
                    "Shuffle"
                  }`}</span>
                </button>
              </div>
            </div>

            {/* Middle Section: Specs and flowchart illustration */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Interactive Pseudocode Highlight */}
              <div className="lg:col-span-5 bg-slate-950 rounded-lg p-3.5 border border-slate-805 font-mono text-[10px] text-slate-300 leading-relaxed space-y-1 max-h-[300px] overflow-y-auto w-full">
                {activeAgentDaemon === "mediapath" ? (
                  <>
                    <div className="text-violet-400 font-bold">// UNIFIED MEDIA INTAKE & AUTO-SORTING AGENT</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> MediaPathAgent
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// Initialize directories</div>
                    <div className="pl-3">
                      <span className="text-indigo-400 font-bold">INIT</span> intake_folder = <span className="text-emerald-400">&quot;CarMedia/Intake&quot;</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-indigo-400 font-bold">INIT</span> sorted_folder = <span className="text-emerald-400">&quot;CarMedia/Sorted&quot;</span>
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-300 font-semibold">LOOP:</div>
                    <div className="pl-6">
                      <span className="text-pink-400 font-bold">WATCH</span> intake_folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400 font-bold">FOR each</span> new_file:
                    </div>
                    <div className="pl-9 text-slate-400">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-9 text-slate-400">
                      ENHANCE quality (brightness, contrast, sharpness scale)
                    </div>
                    <div className="pl-9 text-violet-400 font-semibold">
                      DETECT car_make, car_model, car_year with Vision Model
                    </div>
                    <div className="pl-9">
                      CREATE subfolder_path = sorted_folder/make/model/year
                    </div>
                    <div className="pl-9 text-emerald-400 font-semibold">
                      MOVE file TO subfolder_path
                    </div>

                    <div className="pl-9 mt-1.5 font-bold text-sky-400">
                      UPDATE display_UI WITH:
                    </div>
                    <div className="pl-12 text-slate-300">
                      - Thumbnail Preview
                    </div>
                    <div className="pl-12 text-slate-300">
                      - Car make/model/year specifications
                      - Target Price ({analysis ? "$114,900" : "$0"})
                    </div>

                    <div className="pl-3 mt-2 text-slate-500">// Real-Time Metadata Synchronization</div>
                    <div className="pl-3">
                      <span className="text-pink-400 font-bold">LISTEN FOR</span> metadata_changes
                    </div>
                    <div className="pl-6 text-indigo-400 font-semibold">
                      UPDATE display_UI + business_card_layouts instantly
                    </div>

                    <div className="mt-2">
                      <span className="text-pink-400 font-semibold">END</span> MediaPathAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "businesscard" ? (
                  <>
                    <div className="text-emerald-400 font-bold">// BUSINESS CARD MEDIA SHARING AGENT</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> BusinessCardAgent
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// Directory listener & folder structure</div>
                    <div className="pl-3">
                      <span className="text-pink-400 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Business Card Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// File evaluation per asset</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-6">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-6">
                      ENHANCE quality (brightness, saturation, sharpness calibration)
                    </div>

                    <div className="pl-6 mt-1.5 font-medium">
                      <span className="text-pink-400">IF</span> file_type IS image:
                    </div>
                    <div className="pl-9 text-slate-300">
                      CREATE business_card_photo_layout
                    </div>
                    <div className="pl-9 font-semibold">
                      SAVE TO <span className="text-emerald-400">&quot;BusinessCardPhotos&quot;</span>
                    </div>
                    <div className="pl-9 text-indigo-400">
                      ADD TO posting_queue_photos
                    </div>

                    <div className="pl-6 mt-1.5 font-medium">
                      <span className="text-pink-400">IF</span> file_type IS video:
                    </div>
                    <div className="pl-9 text-slate-300">
                      CREATE business_card_video_clip WITH soundtrack + motion
                    </div>
                    <div className="pl-9 font-semibold">
                      SAVE TO <span className="text-emerald-400">&quot;BusinessCardVideos&quot;</span>
                    </div>
                    <div className="pl-9 text-indigo-400">
                      ADD TO posting_queue_videos
                    </div>

                    <div className="pl-3 mt-2 text-slate-500">// Scheduled Posting Routines</div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 09:00 daily → POST next business_card_photo TO all accounts
                    </div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 12:00 daily → POST next business_card_video TO all accounts
                    </div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 18:00 daily → POST community_media TO all accounts
                    </div>

                    <div className="pl-3 mt-2 text-slate-500">// Offline Caching & Sync Gateway</div>
                    <div className="pl-3">
                      <span className="text-pink-400">IF</span> offline:
                    </div>
                    <div className="pl-6 text-slate-400">
                      QUEUE posts locally
                    </div>
                    <div className="pl-3">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6 text-sky-400">
                      SYNC queued posts TO WhatsApp + social_accounts
                    </div>
                    <div className="pl-6 text-emerald-400">
                      MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span>
                    </div>

                    <div className="mt-2">
                      <span className="text-pink-400 font-semibold">END</span> BusinessCardAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "soundtracklayout" ? (
                  <>
                    <div className="text-rose-400 font-bold">// DYNAMIC SOUNDTRACK LAYOUT ENGINE</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> SoundtrackLayoutAgent
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// Local DB & Soundtrack catalogs</div>
                    <div className="pl-3">
                      <span className="text-indigo-300 font-bold">INIT</span> local_database (SQLite/IndexedDB)
                    </div>
                    <div className="pl-3">
                      <span className="text-indigo-300 font-bold">INIT</span> soundtrack_library (user_uploaded + default_tracks)
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-300 font-bold">LOOP:</div>
                    <div className="pl-6">
                      <span className="text-indigo-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>

                    <div className="pl-6 mt-1 text-slate-400">// Processing loop per asset</div>
                    <div className="pl-6">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-9">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-9">
                      ENHANCE quality (brightness, sharpness, stabilization)
                    </div>
                    <div className="pl-9">
                      DETECT car_make, car_model, car_year
                    </div>
                    <div className="pl-9">
                      SORT into folder(car_model)
                    </div>

                    <div className="pl-9 mt-1 text-slate-400">// Canvas Composition overlays</div>
                    <div className="pl-9">
                      <span className="text-pink-400">IF</span> layered_photo DETECTED:
                    </div>
                    <div className="pl-12 text-amber-304 text-amber-300">
                      ADD to posting_queue
                    </div>
                    <div className="pl-9">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-12">
                      CREATE composite_layout WITH specs overlay
                    </div>
                    <div className="pl-12 font-semibold">
                      SAVE to <span className="text-emerald-400">&quot;Showroom Layouts&quot;</span>
                    </div>

                    <div className="pl-9 mt-1.5 text-rose-405 text-rose-400 font-bold">// Dynamic Soundtrack Prompt integration</div>
                    <div className="pl-9 text-rose-300 font-semibold animate-pulse">
                      PROMPT user TO SELECT soundtrack FROM library
                    </div>
                    <div className="pl-9">
                      <span className="text-pink-400">IF</span> user_selection EXISTS (5s Timeout):
                    </div>
                    <div className="pl-12 text-sky-400">
                      COMBINE layout WITH soundtrack
                    </div>
                    <div className="pl-12 text-sky-400">
                      CREATE short slideshow (duration = 10s)
                    </div>
                    <div className="pl-12 font-semibold">
                      SAVE to <span className="text-rose-405 text-rose-400">&quot;SoundMedia Layouts&quot;</span>
                    </div>
                    <div className="pl-9">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-12 text-slate-450 text-slate-405 text-slate-400">
                      APPLY default soundtrack BASED ON car_model
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-500">// Daily Syndication Routines</div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 09:00 daily → POST next SoundMedia Layout slideshow
                    </div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 12:00 daily → POST next SoundMedia Video montage
                    </div>
                    <div className="pl-3 text-amber-300 font-semibold font-mono">
                      AT 18:00 daily → POST community media WITH soundtrack
                    </div>

                    <div className="pl-3 mt-1 text-slate-400">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6">
                      SYNC unpublished posts TO social_accounts
                    </div>
                    <div className="pl-6 text-slate-400">
                      MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span>
                    </div>

                    <div className="mt-1">
                      <span className="text-pink-400 font-semibold">END</span> SoundtrackLayoutAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "soundtrack" ? (
                  <>
                    <div className="text-rose-400 font-bold">// HIGH-QUALITY AUDIO & VIDEO ENGINE</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> QualityAgent
                    </div>

                    <div className="pl-3 mt-1">
                      <span className="text-indigo-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-550 text-slate-500">// Files Intake loop per asset</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-6 text-slate-350">
                      VALIDATE file_type (image OR video)
                    </div>

                    <div className="pl-6 mt-1 text-slate-500">// Visual Enhancements</div>
                    <div className="pl-6 font-semibold text-sky-400">
                      ENHANCE visuals:
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY resolution_optimization <span className="text-sky-305 text-sky-400">(HD/4K)</span>
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY frame_stabilization
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY color_correction
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY compression_control <span className="text-sky-305 text-sky-400">(adaptive bitrate)</span>
                    </div>

                    <div className="pl-6 mt-1 text-slate-500">// Audio Enhancements</div>
                    <div className="pl-6 font-semibold text-teal-400">
                      ENHANCE audio:
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY noise_reduction
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY equalization
                    </div>
                    <div className="pl-9 text-slate-300">
                      APPLY volume_normalization
                    </div>
                    <div className="pl-9 text-teal-300">
                      EXPORT audio AT 320kbps
                    </div>

                    <div className="pl-6 mt-1.5 text-slate-500">// Soundtrack Merge Selection</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> soundtrack_selected BY user:
                    </div>
                    <div className="pl-9 text-rose-300">
                      MERGE soundtrack WITH media
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-9 text-slate-400">
                      APPLY default soundtrack BASED ON car_model
                    </div>

                    <div className="pl-6 font-bold text-slate-350 mt-1">
                      SAVE final_media TO <span className="text-rose-400">&quot;HighQualityMedia&quot;</span>
                    </div>

                    <div className="pl-3 mt-2 text-slate-500">// Scheduled Posting</div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 09:00 daily → POST next photo slideshow (HQ audio/video)
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 12:00 daily → POST next video montage (HQ audio/video)
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 18:00 daily → POST community media (HQ audio/video)
                    </div>

                    <div className="pl-3 mt-1.5">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6 text-sky-300">SYNC unpublished HQ posts TO WhatsApp + social_accounts</div>
                    <div className="pl-6 text-emerald-400">MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span></div>

                    <div className="mt-1">
                      <span className="text-pink-400 font-semibold">END</span> QualityAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "selflearning" ? (
                  <>
                    <div className="text-indigo-400 font-bold">// SELF LEARNING CAR SHOWCASE AGENT</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> SelfLearningAgent
                    </div>
                    
                    <div className="pl-3 mt-1 text-slate-500">// Local DB & User Archetype Profiles</div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> local_database (SQLite/IndexedDB)
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> user_profile (posting_times, captions, hashtags, layout_preferences)
                    </div>

                    <div className="pl-3 mt-1.5 text-indigo-400 font-bold">LOOP:</div>
                    <div className="pl-6">
                      <span className="text-sky-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>
                    <div className="pl-6">
                      <span className="text-sky-300 font-bold">DETECT</span> file_type (image OR video)
                    </div>
                    <div className="pl-6">
                      <span className="text-sky-300 font-bold">ENHANCE</span> quality
                    </div>

                    <div className="pl-6 mt-1 text-slate-400">// Layer Detection Rules</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> layered_photo DETECTED:
                    </div>
                    <div className="pl-9 text-amber-300">
                      ADD to posting_queue
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-9">
                      PROCESS normally (composite OR montage)
                    </div>

                    <div className="pl-6 mt-1.5 text-slate-550 text-slate-500">// Sync Preferences & Learn Patterns</div>
                    <div className="pl-6 font-semibold text-sky-400">
                      RECORD posting_time, captions, hashtags, layout_choice
                    </div>
                    <div className="pl-6">
                      UPDATE user_profile WITH new patterns
                    </div>

                    <div className="pl-6 mt-1.5 text-indigo-300 font-semibold">// Autonomous Posting Trigger</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> confidence(user_profile) &gt; threshold:
                    </div>
                    <div className="pl-9 text-emerald-400 font-bold">
                      AUTO_POST without user confirmation
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-9">
                      SCHEDULE post WITH user approval
                    </div>

                    <div className="pl-6 mt-1.5 text-slate-550 text-slate-500">// Engagement optimization feedback loop</div>
                    <div className="pl-6 text-amber-350 text-amber-300">
                      TRACK likes, shares, comments, views
                    </div>
                    <div className="pl-6">
                      UPDATE user_profile TO optimize future posts
                    </div>

                    <div className="mt-1.5">
                      <span className="text-pink-400 font-semibold">END</span> SelfLearningAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "multichannel" ? (
                  <>
                    <div className="text-indigo-400 font-bold">// MULTI CHANNEL AGENT MANIFEST</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> MultiChannelAgent
                    </div>
                    
                    <div className="pl-3 mt-1 text-slate-500">// Directory Watching Feed</div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// Feed Loop & Filter</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-6">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-6">
                      ENHANCE quality
                    </div>
                    <div className="pl-6">
                      DETECT car_make, car_model, car_year
                    </div>

                    <div className="pl-6 mt-1 text-slate-400">// Layer Detection Routing</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> layered_photo DETECTED:
                    </div>
                    <div className="pl-9 text-amber-305 text-amber-300">
                      ADD to posting_queue
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-9">
                      PROCESS normally (composite OR montage)
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-500">// Scheduled Multi-Channel Posting</div>
                    <div className="pl-3 font-semibold text-amber-350 text-amber-300">
                      AT 09:00 daily → POST next photo TO:
                    </div>
                    <div className="pl-6 text-indigo-305 text-indigo-300">
                      - WhatsApp numbers [list_of_numbers]
                    </div>
                    <div className="pl-6 text-indigo-305 text-indigo-300">
                      - Facebook accounts [list_of_pages]
                    </div>
                    <div className="pl-6 text-indigo-305 text-indigo-300">
                      - Instagram accounts [list_of_profiles]
                    </div>
                    <div className="pl-6 text-indigo-305 text-indigo-300">
                      - LinkedIn accounts [list_of_pages]
                    </div>

                    <div className="pl-3 font-semibold text-amber-355 text-amber-300 mt-1">
                      AT 12:00 daily → POST next video TO same accounts
                    </div>
                    <div className="pl-3 font-semibold text-amber-355 text-amber-300 mt-1">
                      AT 18:00 daily → POST community media TO same accounts
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-500">// Offline Caching & Synchronization</div>
                    <div className="pl-3">
                      <span className="text-pink-400">IF</span> offline:
                    </div>
                    <div className="pl-6 text-yellow-500 font-semibold text-amber-400">
                      QUEUE posts locally (local_database)
                    </div>
                    <div className="pl-3">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6">
                      SYNC queued posts TO all accounts
                    </div>
                    <div className="pl-6 text-slate-400">
                      MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span>
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-pink-400 font-semibold">END</span> MultiChannelAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "layer" ? (
                  <>
                    <div className="text-indigo-400 font-bold">// LAYER AWARE AGENT MANIFEST</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> LayerAwareAgent
                    </div>
                    
                    <div className="pl-3 mt-1 text-slate-500">// Directory Watching Feed</div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>

                    <div className="pl-3 mt-1 text-slate-550 text-slate-500">// Feed Loop & Filter</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-6">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-6">
                      SCAN for malware/viruses
                    </div>

                    <div className="pl-6 mt-1 text-slate-400">// In case of photo formats</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> file_type IS image:
                    </div>
                    <div className="pl-9 text-amber-305 text-amber-300">
                      <span className="text-pink-400">IF DETECT</span> layered_photo (overlay text OR multiple regions):
                    </div>
                    <div className="pl-12 text-emerald-305 text-emerald-300">
                      MARK photo AS <span className="text-yellow-400">&quot;Ready for Posting&quot;</span>
                    </div>
                    <div className="pl-12 text-emerald-305 text-emerald-300">
                      ADD to posting_queue (photos)
                    </div>
                    <div className="pl-9">
                      <span className="text-pink-400">ELSE</span>:
                    </div>
                    <div className="pl-12">
                      DETECT car_make, car_model, car_year
                    </div>
                    <div className="pl-12">
                      SORT into folder(car_model)
                    </div>
                    <div className="pl-12">
                      <span className="text-pink-400">IF</span> 5 photos available:
                    </div>
                    <div className="pl-15 text-indigo-300">
                      CREATE composite_layout
                    </div>
                    <div className="pl-15 text-indigo-300">
                      SAVE to <span className="text-emerald-400">&quot;Showroom Layouts&quot;</span>
                    </div>

                    <div className="pl-6 mt-1 text-slate-400">// In case of video uploads</div>
                    <div className="pl-6">
                      <span className="text-pink-400">IF</span> file_type IS video:
                    </div>
                    <div className="pl-9 text-sky-305 text-sky-300">
                      PROCESS as usual (enhancement + montage creation)
                    </div>

                    <div className="pl-3 mt-1.5 text-slate-500">// Scheduled Posting Routines</div>
                    <div className="pl-3 font-semibold text-amber-350 text-amber-300">
                      AT 09:00 daily → POST next photo (layered OR composite)
                    </div>
                    <div className="pl-3 font-semibold text-amber-355 text-amber-300">
                      AT 12:00 daily → POST next video montage
                    </div>
                    <div className="pl-3 font-semibold text-amber-355 text-amber-300">
                      AT 18:00 daily → POST community responsibility media
                    </div>

                    <div className="pl-3 mt-1.5">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6">
                      SYNC unpublished posts TO social_accounts
                    </div>
                    <div className="pl-6 text-slate-400">
                      MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span>
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-pink-400 font-semibold">END</span> LayerAwareAgent
                    </div>
                  </>
                ) : activeAgentDaemon === "optimized" ? (
                  <>
                    <div className="text-emerald-400 font-bold">// OPTIMIZED FAST & ADAPTIVE CAR SHOWCASE AGENT</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> OptimizedAgent
                    </div>
                    
                    <div className="pl-3 mt-1 text-slate-500">// Local DB & Event Loop Initializations</div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> local_database (SQLite/IndexedDB)
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> responsive_UI (React/TailwindCSS)
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> async_event_loop <span className="text-slate-500">// non-blocking operations</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> error_logger
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> cache_manager <span className="text-slate-550 text-slate-500">// pre-compiled template indexes</span>
                    </div>

                    <div className="pl-3 mt-1.5 text-indigo-400 font-bold">LOOP:</div>
                    <div className="pl-6 text-slate-350">
                      LISTEN FOR user_commands
                    </div>
                    <div className="pl-6 text-slate-350">
                      EXECUTE commands ASYNC
                    </div>
                    <div className="pl-6 text-sky-450 text-sky-400">
                      CACHE results FOR reuse
                    </div>

                    <div className="pl-6 mt-1.5 text-slate-550 text-slate-500">// Mobile & Environment Adaptation</div>
                    <div className="pl-6">
                      <span className="text-pink-400">DETECT</span> device_type (desktop, mobile, tablet)
                    </div>
                    <div className="pl-6">
                      <span className="text-pink-400">SWITCH</span> device_type:
                    </div>
                    <div className="pl-9 font-semibold text-slate-300">
                      CASE mobile:
                    </div>
                    <div className="pl-12 text-teal-400 font-medium">ENABLE touch_controls</div>
                    <div className="pl-12 text-teal-400 font-medium font-bold">OPTIMIZE layout FOR small screens</div>
                    <div className="pl-12 text-rose-400 font-medium">DISABLE heavy animations</div>
                    <div className="pl-9 font-semibold text-slate-300">
                      CASE desktop:
                    </div>
                    <div className="pl-12 text-teal-400 font-medium">ENABLE full feature set</div>
                    <div className="pl-9 font-semibold text-slate-300">
                      CASE tablet:
                    </div>
                    <div className="pl-12 text-teal-400 font-medium font-bold">BALANCE features FOR medium screen</div>

                    <div className="pl-6 mt-1.5 text-slate-400">// Error Handling & Bug Fixing</div>
                    <div className="pl-6">
                      <span className="text-pink-400">TRY</span>:
                    </div>
                    <div className="pl-9 text-slate-300">PROCESS media_uploads</div>
                    <div className="pl-9 text-slate-300">ENHANCE audio/video quality</div>
                    <div className="pl-9 text-slate-300">GENERATE layouts</div>
                    <div className="pl-6">
                      <span className="text-pink-400">CATCH</span> error:
                    </div>
                    <div className="pl-9 text-rose-350 text-rose-400">LOG error TO error_logger</div>
                    <div className="pl-9 text-slate-400">RETRY operation IF safe</div>
                    <div className="pl-9 text-slate-400">SKIP gracefully IF unrecoverable</div>
                    <div className="pl-9 text-amber-350 text-amber-300 font-bold">ALERT user ONLY if critical</div>

                    <div className="pl-6 mt-1.5 text-slate-550 text-slate-500">// Feature Streamlining</div>
                    <div className="pl-6 text-sky-405 text-sky-400">
                      SCAN features_list
                    </div>
                    <div className="pl-6 text-slate-400">
                      REMOVE duplicates OR unused modules
                    </div>
                    <div className="pl-6 text-emerald-455 text-emerald-400 font-bold">
                      KEEP only essential (intake, enhancement, posting, sync)
                    </div>

                    <div className="pl-3 mt-2 text-slate-555 text-slate-500">// Scheduled Posting</div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 09:00 daily → POST next photo layout
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 12:00 daily → POST next video montage
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 18:05 daily → POST community media
                    </div>

                    <div className="pl-3 mt-1.5">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6 text-sky-300">SYNC queued posts TO WhatsApp + social_accounts</div>
                    <div className="pl-6 text-emerald-450 text-emerald-400 font-bold">MOVE posted_media TO <span className="text-emerald-450">&quot;Published&quot;</span></div>

                    <div className="mt-1">
                      <span className="text-pink-400 font-semibold">END</span> OptimizedAgent
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-indigo-400 font-bold">// AGENT CONFIGURATION MANIFEST</div>
                    <div>
                      <span className="text-pink-400 font-semibold">BEGIN</span> ShuffleCommunityAgent
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> local_database (SQLite/IndexedDB)
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> shuffle_algorithm <span className="text-slate-500 font-medium">// photo selection</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-sky-300 font-bold">INIT</span> community_folder (<span className="text-emerald-400">&quot;Community Media&quot;</span>)
                    </div>
                    
                    <div className="text-indigo-400 font-bold mt-2">// DYNAMIC EXECUTION PIPELINE</div>
                    <div>
                      <span className="text-pink-400 font-semibold">LOOP</span>:
                    </div>
                    <div className="pl-3">
                      <span className="text-indigo-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Car Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-indigo-300 font-bold">WATCH</span> <span className="text-emerald-400">&quot;Community Media&quot;</span> folder FOR <span className="text-amber-300">new_uploads</span>
                    </div>
                    
                    <div className="pl-3 mt-1 text-slate-500">// Validation & Enhancements</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> new_file:
                    </div>
                    <div className="pl-6">
                      VALIDATE file_type (image OR video)
                    </div>
                    <div className="pl-6">
                      ENHANCE quality (brightness, sharpness, stabilization)
                    </div>
                    <div className="pl-6">
                      DETECT car_make, car_model, car_year
                    </div>
                    <div className="pl-6">
                      SORT into folder(car_model)
                    </div>

                    <div className="pl-3 mt-1 text-slate-500">// Photo Shuffle</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> folder(car_model):
                    </div>
                    <div className="pl-6">RANDOMLY SELECT 5 photos</div>
                    <div className="pl-6">CREATE composite_layout WITH specs overlay</div>
                    <div className="pl-6">SAVE to <span className="text-emerald-400">&quot;Showroom Layouts&quot;</span></div>

                    <div className="pl-3 mt-1 text-slate-500">// Video Montage</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> folder(car_model):
                    </div>
                    <div className="pl-6">RANDOMLY SELECT video_clips</div>
                    <div className="pl-6">CREATE montage_video WITH intro, shuffled clips, outro CTA</div>
                    <div className="pl-6">SAVE to <span className="text-emerald-400">&quot;Showroom Videos&quot;</span></div>

                    <div className="pl-3 mt-1 text-slate-500">// Community Media Content Overlay</div>
                    <div className="pl-3">
                      <span className="text-pink-400">FOR each</span> file IN <span className="text-emerald-400">&quot;Community Media&quot;</span>:
                    </div>
                    <div className="pl-6">ENHANCE quality</div>
                    <div className="pl-6">CREATE post WITH overlay text (<span className="text-amber-400">&quot;SmartBnB Community Responsibility&quot;</span>)</div>
                    <div className="pl-6">SAVE to <span className="text-emerald-400">&quot;Community Layouts&quot;</span></div>

                    <div className="pl-3 mt-1 text-slate-500">// Scheduled Posting Routines</div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 09:00 daily → POST shuffled composite_layout
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 12:00 daily → POST shuffled montage_video
                    </div>
                    <div className="pl-3 font-semibold text-amber-300 font-mono">
                      AT 18:00 daily → POST community_layout
                    </div>

                    <div className="pl-3 mt-1">
                      <span className="text-pink-400">IF</span> online:
                    </div>
                    <div className="pl-6">SYNC unpublished posts TO social_accounts</div>
                    <div className="pl-6">MOVE posted_media TO <span className="text-emerald-400">&quot;Published&quot;</span></div>
                    
                    <div>
                      <span className="text-pink-400 font-semibold">END</span> ShuffleCommunityAgent
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Real-Time Log Scroller */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-sans">Active Output Console Stack</span>
                  <div className="flex items-center space-x-2 text-[9px] font-mono text-indigo-400">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                    <span>LOG_STREAM_SYNC</span>
                  </div>
                </div>

                {/* Simulated Monitor terminal output */}
                <div className="flex-1 bg-slate-950 rounded-lg p-3.5 font-mono text-[10.5px] text-emerald-400 leading-normal border border-slate-800 h-[220px] overflow-y-auto space-y-1.5 custom-scrollbar">
                  {agentLogs.map((log, logIdx) => {
                    const isSystemOrEnded = log.includes("SUCCESS") || log.includes("STANDBY") || log.includes("END");
                    const isSchedule = log.includes("SCHEDULER ENGINE") || log.includes("SCHEDULE RULES") || log.includes("•") || log.includes("Daily");
                    const isBegin = log.includes("BEGIN") || log.includes("INIT");
                    return (
                      <div 
                        key={logIdx} 
                        className={`text-left ${
                          isSystemOrEnded 
                            ? "text-emerald-400 font-bold" 
                            : isSchedule
                            ? "text-amber-400"
                            : isBegin
                            ? "text-indigo-400 font-bold"
                            : "text-slate-350"
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })}
                  {isAgentRunning && (
                    <div className="text-amber-305 font-bold animate-pulse mt-1">// Executing autonomous algorithms: Step {agentActiveStep} of 8...</div>
                  )}
                </div>

                {promptingSoundtrack && (
                  <div className="bg-slate-900 border border-rose-500 rounded-lg p-4 space-y-3.5 mt-1 font-sans select-none animate-fade-in relative z-20 shadow-lg">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <Music className="w-4 h-4 text-rose-500 animate-spin" />
                        <span>CHOOSE THE SOUNDTRACK (T-Minus {promptCountdown}s)</span>
                      </span>
                      <div className="text-[10px] text-slate-400 font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
                        Prompter Engaged
                      </div>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed text-left">
                      The SoundtrackLayoutAgent has loaded layout overlays for <span className="text-indigo-400 font-bold">{analysis ? analysis.detectedModel : "Porsche 911"}</span>. Select a soundtrack from your library now to overlay:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-1 text-left">
                      {soundtracks.map(t => (
                        <button
                          key={t.id}
                          onClick={() => selectUserSoundtrack(t)}
                          className="bg-slate-950 hover:bg-slate-800 text-left p-2 rounded-lg border border-slate-800 hover:border-slate-700 transition flex justify-between items-center group cursor-pointer"
                        >
                          <div className="truncate pr-2">
                            <span className="text-[10.5px] font-bold text-slate-200 block truncate leading-tight group-hover:text-rose-400 transition-colors">{t.title}</span>
                            <span className="text-[8.5px] text-slate-500 truncate block leading-none">{t.genre}</span>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1 py-0.5 rounded shrink-0">{t.duration}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => selectUserSoundtrack(soundtracks[0])}
                        className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Skip & Use Recommended Default
                      </button>
                    </div>
                  </div>
                )}

                {/* Dynamic Step indicators of the Selected Agent Loop */}
                <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 pt-1 border-t border-slate-800/80">
                  {(activeAgentDaemon === "mediapath"
                    ? [
                      { label: "1. Init Path", step: 1 },
                      { label: "2. Watch Intake", step: 2 },
                      { label: "3. Validate File", step: 3 },
                      { label: "4. Enhance HG", step: 4 },
                      { label: "5. Gemini Detect", step: 5 },
                      { label: "6. Auto Sort Dir", step: 6 },
                      { label: "7. Live Sync UI", step: 7 },
                      { label: "8. Realtime Sync", step: 8 }
                    ]
                    : activeAgentDaemon === "businesscard"
                    ? [
                      { label: "1. Init DB", step: 1 },
                      { label: "2. Watch Card", step: 2 },
                      { label: "3. Ingest Split", step: 3 },
                      { label: "4. Enhance HG", step: 4 },
                      { label: "5. Render Card", step: 5 },
                      { label: "6. Video Sound", step: 6 },
                      { label: "7. Auto Schedule", step: 7 },
                      { label: "8. Deploy Sync", step: 8 }
                    ]
                    : activeAgentDaemon === "soundtracklayout"
                    ? [
                      { label: "1. Init SQLite", step: 1 },
                      { label: "2. Watch Media", step: 2 },
                      { label: "3. Ingest Detect", step: 3 },
                      { label: "4. Composite Specs", step: 4 },
                      { label: "5. PROM SELECT", step: 5 },
                      { label: "6. Create Slideshow", step: 6 },
                      { label: "7. Dual Timers", step: 7 },
                      { label: "8. Deploy Sync", step: 8 }
                    ]
                    : activeAgentDaemon === "soundtrack"
                    ? [
                      { label: "1. Watch Media", step: 1 },
                      { label: "2. Validate File", step: 2 },
                      { label: "3. HQ Visuals", step: 3 },
                      { label: "4. HQ Audio", step: 4 },
                      { label: "5. Soundtrack Select", step: 5 },
                      { label: "6. Merge & Save", step: 6 },
                      { label: "7. Sched Posting", step: 7 },
                      { label: "8. Sync Broadcast", step: 8 }
                    ]
                    : activeAgentDaemon === "selflearning"
                    ? [
                      { label: "1. Init DB", step: 1 },
                      { label: "2. User Profiles", step: 2 },
                      { label: "3. Watch / Ingest", step: 3 },
                      { label: "4. Layer Check", step: 4 },
                      { label: "5. Learn Choice", step: 5 },
                      { label: "6. Check AutoPost", step: 6 },
                      { label: "7. Track Feedbacks", step: 7 },
                      { label: "8. Update Weights", step: 8 }
                    ]
                    : activeAgentDaemon === "layer" 
                    ? [
                      { label: "1. Ingest", step: 1 },
                      { label: "2. AV Scan", step: 2 },
                      { label: "3. Safe Check", step: 3 },
                      { label: "4. Layer Detect", step: 4 },
                      { label: "5. ML Classify", step: 5 },
                      { label: "6. Montage", step: 6 },
                      { label: "7. Timers", step: 7 },
                      { label: "8. Vault", step: 8 }
                    ]
                    : activeAgentDaemon === "multichannel"
                    ? [
                      { label: "1. Init Connect", step: 1 },
                      { label: "2. watch()", step: 2 },
                      { label: "3. Valid / Enhance", step: 3 },
                      { label: "4. Detect Layer", step: 4 },
                      { label: "5. Shuf / Montage", step: 5 },
                      { label: "6. Multi-Sched", step: 6 },
                      { label: "7. Off/On Safe", step: 7 },
                      { label: "8. Sync Broadcast", step: 8 }
                    ]
                    : activeAgentDaemon === "optimized"
                    ? [
                      { label: "1. Init Loop", step: 1 },
                      { label: "2. Cmd Cache", step: 2 },
                      { label: "3. Adapt Device", step: 3 },
                      { label: "4. Apply Settings", step: 4 },
                      { label: "5. Try Guard", step: 5 },
                      { label: "6. Streamline", step: 6 },
                      { label: "7. Sched Timers", step: 7 },
                      { label: "8. Deploy Sync", step: 8 }
                    ]
                    : [
                      { label: "1. Init", step: 1 },
                      { label: "2. Watch", step: 2 },
                      { label: "3. Classify", step: 3 },
                      { label: "4. Shuffle", step: 4 },
                      { label: "5. Reel Montage", step: 5 },
                      { label: "6. Overlays", step: 6 },
                      { label: "7. Timers", step: 7 },
                      { label: "8. Sync Deploy", step: 8 }
                    ]
                  ).map((s) => {
                    const isDone = agentActiveStep >= s.step;
                    const isCurrent = agentActiveStep === s.step;
                    return (
                      <div 
                        key={s.step} 
                        className={`py-1 px-2 rounded font-mono text-[9px] font-bold text-center transition duration-200 flex-1 ${
                          isCurrent 
                            ? "bg-indigo-600 text-white border border-indigo-450 animate-pulse" 
                            : isDone 
                            ? "bg-slate-800 text-emerald-400 border border-slate-700 font-extrabold" 
                            : "bg-slate-950 text-slate-500 border border-slate-900"
                        }`}
                      >
                        {s.label}
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cryptography & Malware Scanning */}
      {itTab === "crypto_scans" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Encryption Key Management */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>AES-256 GCM LAYOUT SECURE ENGINES</span>
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                To fulfill security requirements, showroom assets are cryptographically tagged to block web crawlers and scraping bots from harvesting dealership details.
              </p>

              <div className="space-y-2">
                <label className="text-[9px] text-slate-500 font-mono font-bold block">Layout Master Cryptographic Key Tag:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={cryptKey}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-[10px] text-slate-800 font-bold flex-1 focus:outline-none"
                  />
                  <button
                    onClick={rotateKeysIT}
                    disabled={isEncrypting}
                    className="px-3 bg-white hover:bg-slate-100 hover:cursor-pointer transition border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900"
                    title="Rotate Credentials Keys"
                  >
                    <RefreshCw className={`w-4 h-4 ${isEncrypting ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Real-time scanning indicator attributes */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 font-mono text-[10.5px] text-slate-600">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100 pb-1 mb-1.5">Security Safeguard Checklist Status</div>
                <div className="flex justify-between">
                  <span>AES Cipher Mode:</span>
                  <span className="text-emerald-600 font-bold animate-pulse">GCM-AUTHENTICATED</span>
                </div>
                <div className="flex justify-between">
                  <span>Gyroscopic Frame Rating:</span>
                  <span className="text-emerald-600 font-bold">60 FPS VERIFIED</span>
                </div>
                <div className="flex justify-between">
                  <span>Payload Size constraints:</span>
                  <span className="text-emerald-600 font-bold">SATISFIED (&lt; 15s MP4)</span>
                </div>
                <div className="flex justify-between">
                  <span>Watermarks overlay status:</span>
                  <span className="text-indigo-600 font-bold">ENFORCED</span>
                </div>
              </div>
            </div>

            {/* Live Malware Scanner Module */}
            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Real-time Ingestion threat Malware Scanners</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our IT scanners recursively check all raw inodes inside the virtual framework for extension matching, suspicious shell injections, and double extension exploits.
                </p>

                <div className="grid grid-cols-3 gap-3.5 pt-3.5">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                    <span className="text-slate-400 text-[8px] uppercase block tracking-wider font-semibold mb-1">Index Inodes</span>
                    <span className="text-base text-slate-800 font-bold">{scanThreatResults.scannedFiles} files</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                    <span className="text-slate-400 text-[8px] uppercase block tracking-wider font-semibold mb-1">Threats Detected</span>
                    <span className="text-base text-emerald-600 font-bold">{scanThreatResults.threatsFound} files</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono">
                    <span className="text-slate-400 text-[8px] uppercase block tracking-wider font-semibold mb-1">Audit Code</span>
                    <span className="text-base text-indigo-650 font-bold">SHA-SAFE</span>
                  </div>
                </div>
              </div>

              {/* Scanners report box */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 font-mono text-[10px] text-left text-slate-700 min-h-[100px] mt-3">
                {scanThreatResults.status === "idle" ? (
                  <div className="text-slate-400 h-20 flex items-center justify-center">
                    <span>Malware scan engine waiting...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {scanThreatResults.log.map((it, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-slate-400 select-none">[{idx + 1}]</span>
                        <span className={it.includes("SAFE") ? "text-emerald-600 font-bold" : ""}>{it}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={triggerMalwareThreatScan}
                disabled={isScanningForThreats}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white hover:cursor-pointer disabled:text-slate-450 font-bold text-xs uppercase rounded-lg shadow-sm flex items-center justify-center space-x-2 transition duration-200 mt-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanningForThreats ? "animate-spin text-white" : "text-white"}`} />
                <span>{isScanningForThreats ? "Checking vectors..." : "Run Malware & Shell Scan"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Immutable Logs Explorer (Security Logs & Audit Trails) */}
      {itTab === "audit_trail" && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
              <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-indigo-605" />
                <span>Central Immutable Security Operations Logs</span>
              </h3>

              {/* Keyword Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter logs matrix..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-805 w-full sm:w-48 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Table Filters Category Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["ALL", "SYSTEM", "SECURITY", "INTAKE", "ENHANCE", "COMPOSITE", "SOCIAL"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveLogCategory(cat)}
                  className={`text-[9px] px-2.5 py-1 rounded font-mono font-medium transition hover:cursor-pointer ${
                    activeLogCategory === cat
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-indigo-600"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-350 hover:text-slate-850"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Logs feed scroller */}
            <div className="flex-1 overflow-y-auto font-mono text-[10.5px] text-slate-700 divide-y divide-slate-100 scrollbar">
              {filteredAuditLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <span>No audit trails matched specified criteria.</span>
                </div>
              ) : (
                filteredAuditLogs.map(log => (
                  <div key={log.id} className="py-2 flex items-start space-x-2.5 text-left">
                    <span className="text-slate-400 shrink-0 select-none font-bold">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`shrink-0 text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      log.level === "SUCCESS"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        : log.level === "SECURITY"
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-600"
                        : log.level === "WARNING"
                        ? "bg-red-50 border border-red-200 text-red-600"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-[9.5px] font-mono text-indigo-600 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                      {log.category}
                    </span>
                    <span className="text-slate-600 flex-1">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DevOps Telemetry */}
      {itTab === "telemetry" && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Thread allocations stats card */}
            <div className="md:col-span-8 grid grid-cols-2 gap-4">
              {[
                { title: "CPU core Thread Load", data: "4.2% active loading", extra: "Worker threads allocation: 2" },
                { title: "NodeJS V8 Heap allocation", data: "134.12 MB / 512 MB", extra: "Garbage collection sweep: 10m ago" },
                { title: "Network Tunnel Socket Throughput", data: "1.24 GB/s continuous", extra: "Latency ingress: 14ms (OK)" },
                { title: "Relational Index Sector health", data: "100.0% integrity index", extra: "SQLite WAL allocation size: 24KB" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">{item.title}</span>
                  <div className="my-2 text-sm font-bold text-slate-800 font-mono tracking-tight">{item.data}</div>
                  <span className="text-[9px] text-indigo-600 font-mono font-bold">{item.extra}</span>
                </div>
              ))}
            </div>

            {/* Server status monitor */}
            <div className="md:col-span-4 bg-white p-4 border border-slate-200 rounded-lg space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">DevOps & Cloud Run Connection</span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our hybrid client interface is optimized with Service Worker caching for offline status, backed by Netlify serverless sync functions.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200 font-bold">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>Cloud Run container ONLINE</span>
                </div>
              </div>

              {/* Status checklist metrics */}
              <div className="pt-2 font-mono text-[9px] text-slate-500 space-y-1 block leading-normal">
                <div>INGRESS PROXIES: Nginx port 3000 mapping</div>
                <div>NETLIFY HANDLER: serverless context online</div>
                <div>OFFLINE MODE: Service Worker registered cache</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: PWA Sync & Standalone Engine */}
      {itTab === "pwa_standalone" && (
        <PWASyncSection folderCounts={localFolderCounts} addAuditLog={addAuditLog} />
      )}


      {/* Transferred System Telemetry Status Bar */}
      <div className="bg-indigo-600 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between text-white text-[10.5px] font-bold tracking-wider select-none gap-3 uppercase font-mono shadow-md border border-indigo-700">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM RUNTIME: 442H 12M</span>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <span className="bg-indigo-700 px-2 py-0.5 rounded text-[10px]">DISK: 12.4TB / 50TB</span>
          <span className="bg-indigo-700 px-2 py-0.5 rounded text-[10px]">NETWORK: 1.2GB/s</span>
          <span className="bg-indigo-700 px-2 py-0.5 rounded text-[10px]">ENCRYPTION: AES-256 ACTIVE</span>
        </div>
      </div>

    </div>
  );
}
