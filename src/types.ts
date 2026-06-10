export interface CarPreset {
  id: string;
  name: string;
  makeModel: string;
  defaultYear: string;
  defaultColor: string;
  mainUrl: string;
  topUrl: string;
  bottomUrl: string;
  leftUrl: string;
  rightUrl: string;
}

export interface CarAnalysisResult {
  detectedMake: string;
  detectedModel: string;
  detectedYear: string;
  detectedColor: string;
  detectedStyle: string;
  confidenceScore: number;
  clarityScore: number;
  marketingPitch: string;
  cta: string;
  hashtags: string[];
  safetyCheckPassed: boolean;
  rejectionReason?: string;
}

export interface ActiveEnhancements {
  brightness: number;   // 100 is original, can adjust from 50 to 150
  contrast: number;     // 100 is original, can adjust from 50 to 150
  sharpness: number;    // 0 to 100, custom overlay filtering simulation
  denoise: boolean;     // Reduces simulated "grain" overlays
  bgRemoved: boolean;   // Removes clutters / adds elegant showroom gradient
  // Video Enhancers
  videoStabilize: boolean;
  videoCleanAudio: boolean;
  videoWatermark: boolean;
  videoBrightness: number;
  videoContrast: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS";
  category: "INTAKE" | "ENHANCE" | "COMPOSITE" | "SECURITY" | "SOCIAL" | "SYSTEM";
  message: string;
}

export interface SocialChannel {
  id: string;
  name: string;
  connected: boolean;
  engagementRate: number; // mock score
  likes: number;
  shares: number;
  comments: number;
  leads: number;
}

export interface PostQueueItem {
  id: string;
  channelId: string;
  carName: string;
  caption: string;
  scheduleTime: string;
  status: "SCHEDULED" | "POSTED" | "FAILED";
}

export interface SoundtrackItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  type: "default" | "user_uploaded";
  matchingModel: string;
}

