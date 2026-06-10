import React, { useState, useRef, useEffect } from "react";
import { 
  Building2, Phone, Mail, MapPin, Download, Sparkles, CheckCircle, 
  RotateCcw, RefreshCw, FileText, Plus, Trash2, Sliders, Palette, Info, CreditCard,
  Music, Share2, Volume2, ExternalLink, ChevronDown, Upload
} from "lucide-react";
import { CarAnalysisResult, SoundtrackItem } from "../types";

interface FlyerTemplateSectionProps {
  analysis: CarAnalysisResult | null;
  activeImages: { main: string; top: string; bottom: string; left: string; right: string };
  addAuditLog: (level: "INFO" | "WARNING" | "SECURITY" | "SUCCESS", category: any, message: string) => void;
  soundtracks: SoundtrackItem[];
  setSoundtracks: React.Dispatch<React.SetStateAction<SoundtrackItem[]>>;
}

interface VehicleListing {
  id: string;
  year: string;
  make: string;
  model: string;
  price: string;
  image: string;
}

export interface TextFieldFormat {
  isItalic: boolean;
  fontFamily: "calibri" | "inter" | "serif" | "mono";
  isBold: boolean;
  color: string;
  sizeMultiplier: number;
}

export default function FlyerTemplateSection({ analysis, activeImages, addAuditLog, soundtracks, setSoundtracks }: FlyerTemplateSectionProps) {
  // Customizable formatting states for the 4 text boxes in Sego Flyer template
  const [formatDealerCode, setFormatDealerCode] = useState<TextFieldFormat>({
    isItalic: true,
    fontFamily: "inter",
    isBold: true,
    color: "themeAccent",
    sizeMultiplier: 1.0
  });

  const [formatSloganHeader, setFormatSloganHeader] = useState<TextFieldFormat>({
    isItalic: false,
    fontFamily: "inter",
    isBold: true,
    color: "themeAccent",
    sizeMultiplier: 1.0
  });

  const [formatPromoHeading, setFormatPromoHeading] = useState<TextFieldFormat>({
    isItalic: false,
    fontFamily: "inter",
    isBold: true,
    color: "#0f172a",
    sizeMultiplier: 1.0
  });

  const [formatSubtitle, setFormatSubtitle] = useState<TextFieldFormat>({
    isItalic: false,
    fontFamily: "inter",
    isBold: true,
    color: "themeAccent",
    sizeMultiplier: 1.0
  });

  // Compile formatting states to standard inline styles
  const getFormatStyles = (format: TextFieldFormat, defaultSizeEmValue: number) => {
    const styles: React.CSSProperties = {};
    
    // Italicized or non-italicized
    styles.fontStyle = format.isItalic ? "italic" : "normal";
    
    // Font Weight (Bold / normal)
    styles.fontWeight = format.isBold ? "bold" : "normal";
    
    // Font Library family (Calibri "cabril", Inter "sans", Playfair "serif", Fira "mono")
    if (format.fontFamily === "calibri") {
      styles.fontFamily = "Calibri, Candara, Segoe, 'Segoe UI', Arial, sans-serif";
    } else if (format.fontFamily === "serif") {
      styles.fontFamily = "'Playfair Display', Georgia, Cambria, serif";
    } else if (format.fontFamily === "mono") {
      styles.fontFamily = "'JetBrains Mono', 'Fira Code', monospace";
    } else {
      styles.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
    }

    // Color code
    if (format.color !== "themeAccent") {
      styles.color = format.color;
    }

    // Font size sizing multiplier
    styles.fontSize = `${defaultSizeEmValue * format.sizeMultiplier}em`;

    return styles;
  };

  // Nice inline formatter container
  const renderFormattingToolbar = (
    fieldName: string,
    format: TextFieldFormat,
    setFormat: React.Dispatch<React.SetStateAction<TextFieldFormat>>
  ) => {
    const fontFamilies = [
      { value: "inter", label: "Inter (Sans)" },
      { value: "calibri", label: "Calibri (Cabril)" },
      { value: "serif", label: "Playfair (Serif)" },
      { value: "mono", label: "Fira (Mono)" }
    ];

    const colors = [
      { value: "themeAccent", label: "Accent", bg: "bg-indigo-600 border border-slate-300 h-3 w-3 rounded-full inline-block" },
      { value: "#0f172a", label: "Slate", bg: "bg-slate-900 h-3 w-3 rounded-full inline-block" },
      { value: "#ef4444", label: "Red", bg: "bg-red-500 h-3 w-3 rounded-full inline-block" },
      { value: "#3b82f6", label: "Blue", bg: "bg-blue-500 h-3 w-3 rounded-full inline-block" },
      { value: "#10b981", label: "Green", bg: "bg-emerald-500 h-3 w-3 rounded-full inline-block" },
      { value: "#f59e0b", label: "Gold", bg: "bg-amber-500 h-3 w-3 rounded-full inline-block" },
      { value: "#8b5cf6", label: "Purple", bg: "bg-purple-500 h-3 w-3 rounded-full inline-block" }
    ];

    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 mt-1 space-y-1.5 animate-fade-in text-[10px]">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/60 pb-1.5">
          
          {/* Bold & Italic controllers */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setFormat(prev => ({ ...prev, isBold: !prev.isBold }))}
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border transition duration-150 ${
                format.isBold 
                  ? "bg-indigo-600 border-indigo-700 text-white font-black" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => setFormat(prev => ({ ...prev, isItalic: !prev.isItalic }))}
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono italic border transition duration-150 ${
                format.isItalic 
                  ? "bg-indigo-600 border-indigo-700 text-white" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Italic"
            >
              I
            </button>
          </div>

          {/* Font Family Selection */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-bold font-mono text-[8.5px]">FONT:</span>
            <select
              value={format.fontFamily}
              onChange={(e) => setFormat(prev => ({ ...prev, fontFamily: e.target.value as any }))}
              className="bg-white border border-slate-200 rounded text-[9.5px] px-1 py-0.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-400"
            >
              {fontFamilies.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Font Size Scaling */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-bold font-mono text-[8.5px]">SIZE:</span>
            <button
              type="button"
              onClick={() => setFormat(prev => ({ ...prev, sizeMultiplier: Math.max(0.6, Number((prev.sizeMultiplier - 0.1).toFixed(1))) }))}
              className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[8.5px] font-black text-slate-700 hover:bg-slate-100 leading-none h-[18px] w-[16px] flex items-center justify-center"
            >
              -
            </button>
            <span className="font-mono text-[9px] text-slate-600 font-bold">
              {Math.round(format.sizeMultiplier * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setFormat(prev => ({ ...prev, sizeMultiplier: Math.min(1.6, Number((prev.sizeMultiplier + 0.1).toFixed(1))) }))}
              className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[8.5px] font-black text-slate-700 hover:bg-slate-100 leading-none h-[18px] w-[16px] flex items-center justify-center"
            >
              +
            </button>
          </div>

        </div>

        {/* Text color circles */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-bold font-mono text-[8.5px]">COLOR:</span>
          <div className="flex items-center space-x-1.5">
            {colors.map(c => (
              <button
                type="button"
                key={c.value}
                onClick={() => setFormat(prev => ({ ...prev, color: c.value }))}
                className={`rounded-full transition duration-150 p-0.5 ${
                  format.color === c.value ? "ring-2 ring-indigo-500 scale-110" : "opacity-80 hover:opacity-100"
                }`}
                title={c.label}
              >
                <span className={c.bg} style={c.value !== "themeAccent" ? { backgroundColor: c.value } : {}} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Soundtrack alignments for sharing
  const [selectedSoundtrack, setSelectedSoundtrack] = useState<string>(
    soundtracks && soundtracks.length > 0 ? soundtracks[0].title : "Synthwave Skyline"
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Custom dropdown and local audio attach states for Share with Immersive Soundtrack
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const musicDropdownRef = useRef<HTMLDivElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (musicDropdownRef.current && !musicDropdownRef.current.contains(event.target as Node)) {
        setIsMusicDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isDuplicate = soundtracks.some(t => t.title.toLowerCase() === file.name.replace(/\.[^/.]+$/, "").toLowerCase());
      if (isDuplicate) {
        addAuditLog("WARNING", "SYSTEM", `Audio file with similar name is already in playlist.`);
        return;
      }
      const newTrack: SoundtrackItem = {
        id: `snd_upload_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        genre: file.type.split("/")[1]?.toUpperCase() || "MP3",
        duration: "Attached",
        type: "user_uploaded",
        matchingModel: "Custom"
      };
      setSoundtracks(prev => [...prev, newTrack]);
      setSelectedSoundtrack(newTrack.title);
      addAuditLog("SUCCESS", "SYSTEM", `Attached custom audio file: ${file.name} successfully registered in folder / catalog.`);
      setIsMusicDropdownOpen(false);
    }
  };

  // Configured templates:
  // "multi_finance" -> Mimics the multi-vehicle 10% deposit financing layout (Image 1 & 4)
  // "single_spotlight" -> Mimics the single-car detailed specifications sheet (Image 2 & 3)
  // "business_card" -> Mimics standard corporate representative business cards for the dealership
  const [selectedTemplate, setSelectedTemplate] = useState<"multi_finance" | "single_spotlight" | "business_card">("multi_finance");
  const [activeColorTheme, setActiveColorTheme] = useState<"sego_red" | "ocean_blue" | "sunset_gold" | "obsidian_dark">("sego_red");
  
  // Customizable global dealer details
  const [dealerName, setDealerName] = useState("SEGO-BAY");
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [dealerSlogan, setDealerSlogan] = useState("MOTORS");
  const [dealerPromoText, setDealerPromoText] = useState("We help you find and enjoy the car you've always wanted, with trusted service and easy process.");
  const [dealerPhone, setDealerPhone] = useState("0785 507 745");
  const [dealerEmail, setDealerEmail] = useState("emanachuku@gmail.com");
  const [dealerAddress, setDealerAddress] = useState("Milestone Business center, Kiambu road.");
  
  // Customization variables for multi-car financing flyer
  const [financeTitle, setFinanceTitle] = useState("TOYOTA UNITS");
  const [financeSubtitle, setFinanceSubtitle] = useState("FINANCING");
  const [depositValue, setDepositValue] = useState("10%");
  const [requirementsList, setRequirementsList] = useState<string[]>([
    "latest 12 months bank statements",
    "Copy of national ID & KRA PIN",
    "Latest 12 Months M-pesa statements"
  ]);
  const [noteText, setNoteText] = useState("NB: Bank T&C's apply");
  const [newReqText, setNewReqText] = useState("");

  // Custom inventory state for Multi-Vehicle Template (defaults to similar models in Image 1 & 4)
  const [inventoryList, setInventoryList] = useState<VehicleListing[]>([
    {
      id: "v-1",
      year: "2019",
      make: "Toyota",
      model: "Vitz",
      price: "Ksh. 1.38M",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "v-2",
      year: "2019",
      make: "Toyota",
      model: "Fielder",
      price: "Ksh. 1.8M",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "v-3",
      year: "2019",
      make: "Daihatsu",
      model: "Boon",
      price: "Ksh. 990,000",
      image: "https://images.unsplash.com/photo-1489824900674-917625d51bb4?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "v-4",
      year: "2020",
      make: "Toyota",
      model: "probox",
      price: "Ksh. 1.4M",
      image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600"
    }
  ]);

  // Customizable variables for Single-Unit Detailed flyer
  const [singleYear, setSingleYear] = useState("2019");
  const [singleName, setSingleName] = useState("TOYOTA FIELDER");
  const [singleBadge, setSingleBadge] = useState("HYBRID");
  const [singlePrice, setSinglePrice] = useState("KES . 1.88M");
  const [singleMainImage, setSingleMainImage] = useState("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600");
  
  // Right thumbnails for detailed layout (defaults matching original interior shots/thumbs in Image 2)
  const [singleSideImage, setSingleSideImage] = useState("https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600");
  const [singleInterior1, setSingleInterior1] = useState("https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600");
  const [singleInterior2, setSingleInterior2] = useState("https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600");

  const [singleSpecs, setSingleSpecs] = useState<string[]>([
    "1500CC HYBRID ENGINE",
    "WHITE EXTERIOR COLOUR",
    "DARK INTERIOR WITH CLOTH FABRIC SEATS",
    "LANE ASSIST",
    "FORWARD ANTI-COLLISSION EMERGENCY BRAKE",
    "POWER MIRRORS"
  ]);
  const [newSpecText, setNewSpecText] = useState("");

  // Business Card Representative details
  const [cardRepName, setCardRepName] = useState("Emanuel Chuku");
  const [cardRepTitle, setCardRepTitle] = useState("Showroom Sales Manager");
  const [cardSubtext, setCardSubtext] = useState("Bespoke Car Financing & Import Specialist");
  const [cardBackSide, setCardBackSide] = useState<"front" | "back">("front");

  // Export & Canvas states
  const [isExporting, setIsExporting] = useState(false);
  const flyerContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto load active vehicle details on mount if available
  useEffect(() => {
    if (analysis) {
      importActiveVehicleToFlyer();
    }
  }, [analysis]);

  // Import info directly from Step 1 secure intake
  const importActiveVehicleToFlyer = () => {
    if (!analysis) return;
    
    // Set for single unit flyer template
    setSingleYear(analysis.detectedYear);
    setSingleName(`${analysis.detectedMake.toUpperCase()} ${analysis.detectedModel.toUpperCase()}`);
    setSingleBadge(analysis.detectedStyle.toUpperCase());
    setSingleMainImage(activeImages.main);
    setSingleSideImage(activeImages.top || activeImages.main);
    setSingleInterior1(activeImages.bottom || activeImages.main);
    setSingleInterior2(activeImages.left || activeImages.main);
    
    // Set first specs to reflect detected parameters
    const specs = [
      `PREMIUM EXTERIOR - ${analysis.detectedColor.toUpperCase()}`,
      `MODEL YEAR: ${analysis.detectedYear}`,
      `BODY CLASS: ${analysis.detectedStyle.toUpperCase()}`,
      "AUTONOMIC CALIBRATION VALIDATED",
      "SECURE BANK FINANCING OPTIMIZED"
    ];
    setSingleSpecs(specs);
    
    // Set price based on average simulated pricing
    setSinglePrice("KES . 2.45M");

    // Also inject as the first element in Multi-car Financing Inventory Grid so user sees alignment!
    setInventoryList(prev => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[0] = {
          id: copy[0].id,
          year: analysis.detectedYear,
          make: analysis.detectedMake,
          model: analysis.detectedModel,
          price: "Ksh. 2.45M",
          image: activeImages.main
        };
      }
      return copy;
    });

    addAuditLog("SUCCESS", "COMPOSITE", `Successfully synchronized active intake model details [${analysis.detectedYear} ${analysis.detectedMake}] into digital Flyer generator structures.`);
  };

  // Color Theme definitions
  const themeStyles = {
    sego_red: {
      accent: "bg-[#990c14]",
      accentHover: "hover:bg-[#800a10]",
      textAccent: "text-[#990c14]",
      borderAccent: "border-[#990c14]",
      gradient: "from-red-50 to-white",
      darkBg: "bg-[#6b060a]",
      badgeBg: "bg-[#990c14] text-white",
      footerBg: "bg-[#990c14]",
      badgeDot: "bg-[#990c14]"
    },
    ocean_blue: {
      accent: "bg-[#0b5c91]",
      accentHover: "hover:bg-[#094a75]",
      textAccent: "text-[#0b5c91]",
      borderAccent: "border-[#0b5c91]",
      gradient: "from-blue-50 to-white",
      darkBg: "bg-[#073c5f]",
      badgeBg: "bg-[#0b5c91] text-white",
      footerBg: "bg-[#0b5c91]",
      badgeDot: "bg-[#0b5c91]"
    },
    sunset_gold: {
      accent: "bg-[#cf740a]",
      accentHover: "hover:bg-[#bd6300]",
      textAccent: "text-[#cf740a]",
      borderAccent: "border-[#cf740a]",
      gradient: "from-amber-50 to-white",
      darkBg: "bg-[#9e5402]",
      badgeBg: "bg-[#cf740a] text-white",
      footerBg: "bg-[#cf740a]",
      badgeDot: "bg-[#cf740a]"
    },
    obsidian_dark: {
      accent: "bg-[#1e293b]",
      accentHover: "hover:bg-[#0f172a]",
      textAccent: "text-[#1e293b]",
      borderAccent: "border-[#1e293b]",
      gradient: "from-slate-100 to-white",
      darkBg: "bg-[#0f172a]",
      badgeBg: "bg-[#1e293b] text-white",
      footerBg: "bg-[#1e293b]",
      badgeDot: "bg-[#1e293b]"
    }
  };

  const activeTheme = themeStyles[activeColorTheme];

  // Handlers to edit inventory listings
  const handleEditInventory = (index: number, key: keyof VehicleListing, value: string) => {
    setInventoryList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  // Requirements operations
  const addRequirement = () => {
    if (!newReqText.trim()) return;
    setRequirementsList(prev => [...prev, newReqText.trim()]);
    setNewReqText("");
  };

  const removeRequirement = (index: number) => {
    setRequirementsList(prev => prev.filter((_, i) => i !== index));
  };

  // Specs operations for single flyer
  const addSpec = () => {
    if (!newSpecText.trim()) return;
    setSingleSpecs(prev => [...prev, newSpecText.trim()]);
    setNewSpecText("");
  };

  const removeSpec = (index: number) => {
    setSingleSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Simulated export to disk
  const handleExportFlyer = () => {
    setIsExporting(true);
    addAuditLog("INFO", "COMPOSITE", `Rendering high-definition vector Flyer elements with ambient soundtrack: [${selectedSoundtrack}]`);
    setTimeout(() => {
      setIsExporting(false);
      addAuditLog("SUCCESS", "COMPOSITE", `Flyer Template compiled successfully. Associated background soundtrack '${selectedSoundtrack}' synced inside output wrapper.`);
      // Activate Sharing Modal
      setShowShareModal(true);
    }, 1500);
  };

  return (
    <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-md" id="flyer-templates-section">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2.0 bg-rose-50 text-rose-600 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-wide">Showroom Flyers & Business Card Generator</h2>
            <p className="text-slate-500 text-xs">
              Generate fully customizable promotional flyers, financing grids, and executive business cards mirroring original Sego-Bay designs.
            </p>
          </div>
        </div>
        
        {/* Sync Intake Button */}
        {analysis && (
          <button
            onClick={importActiveVehicleToFlyer}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition cursor-pointer self-start md:self-center shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync with Active Intake Car</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CONTROL STATION */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* TEMPLATE PICKER */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              1. Choose Core Design Format
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSelectedTemplate("multi_finance");
                  addAuditLog("INFO", "COMPOSITE", "Switched template viewer to: Multi-Vehicle Finance Poster");
                }}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTemplate === "multi_finance" 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-600 border-slate-205 hover:bg-slate-50"
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-6 h-5 opacity-80 border border-current p-0.5 rounded">
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                </div>
                <span>Financing Poster</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTemplate("single_spotlight");
                  addAuditLog("INFO", "COMPOSITE", "Switched template viewer to: Single-Unit Spec Spotlight");
                }}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTemplate === "single_spotlight" 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-600 border-slate-205 hover:bg-slate-50"
                }`}
              >
                <div className="flex w-6 h-5 gap-0.5 border border-current p-0.5 rounded opacity-80">
                  <div className="w-1.5 bg-current rounded-[1px]"></div>
                  <div className="flex-1 bg-current rounded-[1px]"></div>
                </div>
                <span>Spec Spotlight</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTemplate("business_card");
                  addAuditLog("INFO", "COMPOSITE", "Switched template viewer to: Executive Business Card");
                }}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTemplate === "business_card" 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-600 border-slate-205 hover:bg-slate-50"
                }`}
              >
                <div className="w-6 h-5 border-2 border-dashed border-current p-0.5 rounded opacity-80 flex items-center justify-center">
                  <div className="w-3.5 h-2 bg-current rounded-[1px]" />
                </div>
                <span>Business Card</span>
              </button>
            </div>
          </div>

          {/* PALETTE SWITCHER */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              2. Color Accent Profile
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveColorTheme("sego_red");
                  addAuditLog("INFO", "COMPOSITE", "Applied color theme: Sego Crimson Red");
                }}
                className={`w-8 h-8 rounded-full bg-[#990c14] border-2 transition cursor-pointer flex items-center justify-center ${activeColorTheme === 'sego_red' ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                title="Sego Crimson Red"
              >
                {activeColorTheme === 'sego_red' && <span className="w-2 h-2 rounded-full bg-white block" />}
              </button>
              <button 
                onClick={() => {
                  setActiveColorTheme("ocean_blue");
                  addAuditLog("INFO", "COMPOSITE", "Applied color theme: Ocean Deep Blue");
                }}
                className={`w-8 h-8 rounded-full bg-[#0b5c91] border-2 transition cursor-pointer flex items-center justify-center ${activeColorTheme === 'ocean_blue' ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                title="Ocean Deep Blue"
              >
                {activeColorTheme === 'ocean_blue' && <span className="w-2 h-2 rounded-full bg-white block" />}
              </button>
              <button 
                onClick={() => {
                  setActiveColorTheme("sunset_gold");
                  addAuditLog("INFO", "COMPOSITE", "Applied color theme: Sunset Amber Gold");
                }}
                className={`w-8 h-8 rounded-full bg-[#cf740a] border-2 transition cursor-pointer flex items-center justify-center ${activeColorTheme === 'sunset_gold' ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                title="Sunset Amber Gold"
              >
                {activeColorTheme === 'sunset_gold' && <span className="w-2 h-2 rounded-full bg-white block" />}
              </button>
              <button 
                onClick={() => {
                  setActiveColorTheme("obsidian_dark");
                  addAuditLog("INFO", "COMPOSITE", "Applied color theme: Obsidian Dark Slate");
                }}
                className={`w-8 h-8 rounded-full bg-[#1e293b] border-2 transition cursor-pointer flex items-center justify-center ${activeColorTheme === 'obsidian_dark' ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                title="Obsidian Dark"
              >
                {activeColorTheme === 'obsidian_dark' && <span className="w-2 h-2 rounded-full bg-white block" />}
              </button>
            </div>
          </div>

          {/* IMMERSIVE SOUNDTRACK ASSOCIATION */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 animate-pulse">
              <Music className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
              3. Share With Immersive Soundtrack
            </span>
            <div className="bg-slate-50 border border-slate-205 rounded-xl p-3.5 space-y-3 relative" ref={musicDropdownRef}>
              <div className="flex gap-2 items-center">
                
                {/* Custom Interactive Dropdown */}
                <div className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)}
                    className="w-full bg-[#fcfcff] hover:bg-[#faf5ff] border border-purple-600 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none transition-all flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Music className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {selectedSoundtrack} {soundtracks.find(t => t.title === selectedSoundtrack) ? `(${soundtracks.find(t => t.title === selectedSoundtrack)?.genre})` : ""}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-800 shrink-0 ml-1.5" />
                  </button>

                  {/* Dropdown Options Portal Overlay */}
                  {isMusicDropdownOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                      <div className="py-1">
                        {soundtracks.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setSelectedSoundtrack(t.title);
                              addAuditLog("INFO", "COMPOSITE", `Associated ambient track to flyer design: ${t.title}`);
                              setIsMusicDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-xs text-left hover:bg-slate-50 transition flex items-center justify-between ${
                              selectedSoundtrack === t.title ? "bg-purple-50/70 text-purple-700 font-bold" : "text-slate-700 font-medium"
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <Music className="w-3 h-3 text-purple-500 shrink-0" />
                              <span className="truncate">{t.title} <span className="text-slate-400 font-normal">({t.genre})</span></span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{t.duration}</span>
                          </button>
                        ))}
                      </div>

                      {/* Folder / Drive Audio Integration */}
                      <div className="p-1 px-1.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => {
                            audioFileInputRef.current?.click();
                          }}
                          className="w-full px-2.5 py-1.5 border border-dashed border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50/50 rounded-lg text-[11px] font-bold text-purple-700 transition flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Upload className="w-3 h-3 text-purple-600" />
                          <span>📁 Attach audio file from folder or any other source...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    addAuditLog("INFO", "COMPOSITE", `Simulated audio play-state toggle for flyer: ${!isPlayingAudio ? "PLAYING" : "PAUSED"}`);
                  }}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-202 cursor-pointer select-none transition flex items-center space-x-1 ${
                    isPlayingAudio ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 shadow-sm' : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300'
                  }`}
                >
                  <span>{isPlayingAudio ? "⏸ Pause" : "▶ Preview"}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={audioFileInputRef}
                onChange={handleAudioUpload}
                accept="audio/*"
                className="hidden"
              />

              <p className="text-[10px] text-slate-500 leading-normal">
                Generates a live interactive soundtrack playback overlay for photos or business cards when shared digitally.
              </p>
              
              {/* Dynamic waveform simulation if playing */}
              {isPlayingAudio && (
                <div className="flex items-end justify-between px-2.5 h-4.5 bg-slate-900 rounded-md py-1">
                  <span className="text-[8px] font-mono text-indigo-400 font-bold tracking-wider animate-pulse">PLAYING DIGITAL AUDIO</span>
                  <div className="flex items-end space-x-0.5 h-full">
                    <span className="w-0.5 bg-indigo-400 h-1/2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
                    <span className="w-0.5 bg-indigo-400 h-1/3 animate-bounce rounded-full" style={{ animationDelay: "0.3s" }} />
                    <span className="w-0.5 bg-indigo-300 h-4/5 animate-bounce rounded-full" style={{ animationDelay: "0.5s" }} />
                    <span className="w-0.5 bg-indigo-200 h-1/4 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
                    <span className="w-0.5 bg-indigo-400 h-[85%] animate-bounce rounded-full" style={{ animationDelay: "0.4s" }} />
                    <span className="w-0.5 bg-emerald-400 h-1/2 animate-bounce rounded-full" style={{ animationDelay: "0.6s" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC FORM SEGMENT (changes based on core design) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase block border-b border-slate-200 pb-2 mb-2 font-display">
              4. Customize Digital Metadata
            </span>

            {/* Standard inputs across templates */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Dealer Code</label>
                  <input
                    type="text"
                    value={dealerName}
                    onChange={(e) => setDealerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-bold"
                  />
                  {renderFormattingToolbar("Dealer Code", formatDealerCode, setFormatDealerCode)}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Slogan Header</label>
                  <input
                    type="text"
                    value={dealerSlogan}
                    onChange={(e) => setDealerSlogan(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  {renderFormattingToolbar("Slogan Header", formatSloganHeader, setFormatSloganHeader)}
                </div>
              </div>
            </div>

            {/* TEMPLATE A SPECIFIC FORM: MULTI FINANCE POSTER */}
            {selectedTemplate === "multi_finance" && (
              <div className="space-y-4 animate-fade-in text-xs">
                
                {/* Title and Badge */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Promo Heading</label>
                      <input
                        type="text"
                        value={financeTitle}
                        onChange={(e) => setFinanceTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                      />
                      {renderFormattingToolbar("Promo Heading", formatPromoHeading, setFormatPromoHeading)}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Sub-Title</label>
                      <input
                        type="text"
                        value={financeSubtitle}
                        onChange={(e) => setFinanceSubtitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                      />
                      {renderFormattingToolbar("Sub-Title", formatSubtitle, setFormatSubtitle)}
                    </div>
                  </div>
                </div>

                {/* Deposit Percentage */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Finance Deposit</label>
                    <input
                      type="text"
                      value={depositValue}
                      onChange={(e) => setDepositValue(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800 font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">T&C Info Line</label>
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Requirements Manager */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Requirements list ({requirementsList.length})</label>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto bg-white p-2 border border-slate-205 rounded-lg">
                    {requirementsList.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        <span className="truncate pr-2">• {req}</span>
                        <button 
                          onClick={() => removeRequirement(idx)} 
                          className="hover:text-red-650 text-slate-400 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReqText}
                      onChange={(e) => setNewReqText(e.target.value)}
                      placeholder="Add statement rule..."
                      className="flex-1 bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={addRequirement}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center cursor-pointer font-bold text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inventory Editor (Live listing values) */}
                <div className="space-y-2 border-t border-slate-200 pt-3 mt-3">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Featured Inventory Items (Max 4 Grid)</span>
                  <div className="space-y-2">
                    {inventoryList.map((car, idx) => (
                      <div key={car.id} className="p-2.5 bg-white border border-slate-205 rounded-lg space-y-1.5 text-xs">
                        <div className="flex justify-between items-center bg-slate-100/60 px-2 py-0.5 rounded font-bold font-mono text-[10px] text-slate-650">
                          <span>Unit Slot #{idx + 1}</span>
                          <span className="font-normal truncate max-w-44 text-[9px]">{car.image.substring(0, 30)}...</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1.5">
                          <input
                            type="text"
                            value={car.year}
                            placeholder="Year"
                            onChange={(e) => handleEditInventory(idx, "year", e.target.value)}
                            className="col-span-3 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs text-center"
                          />
                          <input
                            type="text"
                            value={car.make}
                            placeholder="Make"
                            onChange={(e) => handleEditInventory(idx, "make", e.target.value)}
                            className="col-span-4 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={car.model}
                            placeholder="Model"
                            onChange={(e) => handleEditInventory(idx, "model", e.target.value)}
                            className="col-span-5 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={car.price}
                            placeholder="Price Tag"
                            onChange={(e) => handleEditInventory(idx, "price", e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold"
                          />
                          <select
                            onChange={(e) => handleEditInventory(idx, "image", e.target.value)}
                            className="bg-slate-50 border border-slate-205 rounded px-2 py-1 text-xs focus:outline-none"
                            value={car.image}
                          >
                            <option value="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600">Preset Hatchback</option>
                            <option value="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600">Preset Fielder Wagon</option>
                            <option value="https://images.unsplash.com/photo-1489824900674-917625d51bb4?auto=format&fit=crop&q=80&w=600">Preset Daihatsu Compact</option>
                            <option value="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600">Preset Probox wagon</option>
                            <option value="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600">Active Intake Main Shot</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TEMPLATE B SPECIFIC FORM: SINGLE SPECT SPOTLIGHT */}
            {selectedTemplate === "single_spotlight" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Year</label>
                    <input
                      type="text"
                      value={singleYear}
                      onChange={(e) => setSingleYear(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none"
                    />
                  </div>
                  <div className="col-span-9">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Vehicle Name Heading</label>
                    <input
                      type="text"
                      value={singleName}
                      onChange={(e) => setSingleName(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Badge Flag</label>
                    <input
                      type="text"
                      value={singleBadge}
                      onChange={(e) => setSingleBadge(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Spotlight Price</label>
                    <input
                      type="text"
                      value={singlePrice}
                      onChange={(e) => setSinglePrice(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none font-extrabold"
                    />
                  </div>
                </div>

                {/* Specs Manager (Single Unit specs) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Highlights / Specifications ({singleSpecs.length})</label>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto bg-white p-2 border border-slate-205 rounded-lg">
                    {singleSpecs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                        <span className="truncate pr-2">• {spec}</span>
                        <button 
                          onClick={() => removeSpec(idx)} 
                          className="hover:text-red-650 text-slate-400 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecText}
                      onChange={(e) => setNewSpecText(e.target.value)}
                      placeholder="Add system spec line..."
                      className="flex-1 bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={addSpec}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center cursor-pointer font-bold text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main image options */}
                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Image Feeds</label>
                  <select
                    className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs"
                    value={singleMainImage}
                    onChange={(e) => setSingleMainImage(e.target.value)}
                  >
                    <option value="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600">Preset White Wagon</option>
                    <option value="https://images.unsplash.com/photo-1489824900674-917625d51bb4?auto=format&fit=crop&q=80&w=600">Preset Grey Compact</option>
                    <option value="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600">Active Intake Main Image</option>
                  </select>
                </div>
              </div>
            )}

            {/* TEMPLATE C SPECIFIC FORM: REPRESENTATIVE BUSINESS CARD */}
            {selectedTemplate === "business_card" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Representative Full Name</label>
                  <input
                    type="text"
                    value={cardRepName}
                    onChange={(e) => setCardRepName(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Corporate Title</label>
                  <input
                    type="text"
                    value={cardRepTitle}
                    onChange={(e) => setCardRepTitle(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Slogan / Specialization description</label>
                  <textarea
                    rows={2}
                    value={cardSubtext}
                    onChange={(e) => setCardSubtext(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-slate-650"
                  />
                </div>
                
                {/* Business Card Side Picker */}
                <div className="space-y-1 mt-3">
                  <label className="text-[10px] font-bold text-slate-500 block">Workside Card Surface</label>
                  <div className="flex bg-slate-200 p-0.5 rounded-lg">
                    <button
                      onClick={() => setCardBackSide("front")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-md transition ${cardBackSide === 'front' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                      Front Side
                    </button>
                    <button
                      onClick={() => setCardBackSide("back")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-md transition ${cardBackSide === 'back' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                      Back Side
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Standard contact inputs at bottom of form */}
            <div className="border-t border-slate-200 pt-3 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Dealer Contact Strip</span>
              <div>
                <label className="text-[9px] text-slate-500 block">Phone Line</label>
                <input
                  type="text"
                  value={dealerPhone}
                  onChange={(e) => setDealerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-1 text-xs text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-500 block">Email</label>
                  <input
                    type="text"
                    value={dealerEmail}
                    onChange={(e) => setDealerEmail(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-1.5 py-1 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block">Location Coordinates</label>
                  <input
                    type="text"
                    value={dealerAddress}
                    onChange={(e) => setDealerAddress(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-1.5 py-1 text-xs text-slate-850 truncate"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RESET & EXPORT ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (confirm("Reset current flyer/card templates configurations?")) {
                  setDealerName("SEGO-BAY");
                  setDealerSlogan("MOTORS");
                  setFinanceTitle("TOYOTA UNITS");
                  setFinanceSubtitle("FINANCING");
                  setDepositValue("10%");
                  setDealerPhone("0785 507 745");
                  setDealerEmail("emanachuku@gmail.com");
                  setDealerAddress("Milestone Business center, Kiambu road.");
                  setRequirementsList([
                    "latest 12 months bank statements",
                    "Copy of national ID & KRA PIN",
                    "Latest 12 Months M-pesa statements"
                  ]);
                  setInventoryList([
                    {
                      id: "v-1",
                      year: "2019",
                      make: "Toyota",
                      model: "Vitz",
                      price: "Ksh. 1.38M",
                      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600"
                    },
                    {
                      id: "v-2",
                      year: "2019",
                      make: "Toyota",
                      model: "Fielder",
                      price: "Ksh. 1.8M",
                      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"
                    },
                    {
                      id: "v-3",
                      year: "2019",
                      make: "Daihatsu",
                      model: "Boon",
                      price: "Ksh. 990,000",
                      image: "https://images.unsplash.com/photo-1489824900674-917625d51bb4?auto=format&fit=crop&q=80&w=600"
                    },
                    {
                      id: "v-4",
                      year: "2020",
                      make: "Toyota",
                      model: "probox",
                      price: "Ksh. 1.4M",
                      image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600"
                    }
                  ]);
                  addAuditLog("INFO", "COMPOSITE", "Reset poster design parameters to matching stock Sego values.");
                }
              }}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer border border-slate-250 shrink-0"
              title="Reset Design Configurations"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportFlyer}
              disabled={isExporting}
              className={`flex-1 py-2.5 text-xs font-bold text-white rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${activeTheme.accent} ${activeTheme.accentHover}`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Assembling Vectors...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download High-Res 300 DPI Flyer</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] text-indigo-800 leading-normal flex items-start space-x-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              <strong>Print Layout Optimization:</strong> All designs utilize a high-contrast format and vector margins to ensure pixel-perfect fidelity across physical flyer distribution and business card print sheets.
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: REALTTIME FLYER PREVIEW & PRINT CANVAS FRAME */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex justify-between items-center bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 select-none">
            <span className="text-[11px] font-mono font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE PREVIEW • {selectedTemplate === "multi_finance" ? "MULTI INV FINANCING POSTER" : selectedTemplate === "single_spotlight" ? "SPOTLIGHT flyer" : "CORPORATE BUSINESS CARD"}
            </span>
            <div className="text-[10px] text-slate-400 font-mono">
              Scale: <span className="text-white font-bold">1:1 Frame Output</span>
            </div>
          </div>

          {/* FLYER CONTAINER PREVIEW */}
          <div 
            ref={flyerContainerRef}
            className="border-2 border-slate-300 rounded-xl bg-slate-200 p-2 sm:p-5 overflow-hidden flex items-center justify-center transition-all shadow-inner"
          >
            
            {/* TEMPLATE A: MULTIcar FINANCING FLYER (Mimics Image 1 & 4 closely!) */}
            {selectedTemplate === "multi_finance" && (
              <div className="w-full max-w-[490px] aspect-[1/1.28] bg-white text-slate-800 shadow-2xl relative flex flex-col border border-slate-100 font-sans overflow-hidden animate-fade-in text-left">
                
                {/* Red/Crimson Angled Header Decals */}
                <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 rotate-45 opacity-100 pointer-events-none ${activeTheme.accent}`} />
                <div className={`absolute -top-12 -left-12 w-28 h-28 rounded-full opacity-5 pointer-events-none ${activeTheme.accent}`} />

                {/* Main branding row */}
                <div className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center space-x-2">
                    {/* SEGO Logo vector representation inside UI */}
                    <div className="flex flex-col select-none">
                      {isEditingLogo ? (
                        <div className="flex items-center space-x-1 border border-indigo-400 bg-white shadow-md p-1 rounded-lg z-25">
                          <input
                            type="text"
                            value={dealerName}
                            onChange={(e) => {
                              setDealerName(e.target.value);
                            }}
                            onBlur={() => setIsEditingLogo(false)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setIsEditingLogo(false);
                            }}
                            className="px-2 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none w-28 uppercase font-mono"
                            placeholder="SEGO-BAY"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setIsEditingLogo(false)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-1 rounded cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => setIsEditingLogo(true)}
                          className="flex items-baseline leading-none cursor-pointer group hover:bg-slate-50 hover:ring-2 hover:ring-purple-400/50 rounded-md p-1 transition-all relative"
                          title="Click to edit branding logo (updates dealer code)"
                        >
                          <span 
                            className="pr-0.5"
                            style={{
                              ...getFormatStyles(formatDealerCode, 1.875),
                              color: formatDealerCode.color === "themeAccent" 
                                ? (activeColorTheme === 'sego_red' ? '#cf1520' : undefined)
                                : formatDealerCode.color
                            }}
                          >
                            {dealerName ? dealerName.charAt(0) : "S"}
                          </span>
                          <span 
                            className="uppercase"
                            style={{
                              ...getFormatStyles(formatDealerCode, 1.5),
                              color: formatDealerCode.color === "themeAccent" ? "#0f172a" : formatDealerCode.color
                            }}
                          >
                            {dealerName ? dealerName.slice(1) : "EGO-BAY"}
                          </span>
                          <span className="absolute -top-3.5 left-2 bg-purple-600 text-white text-[8.5px] font-medium tracking-wide px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none uppercase">
                            ✏️ Edit Brand Logo
                          </span>
                        </div>
                      )}
                      <span 
                        className="tracking-[0.25em] pl-0.5"
                        style={{
                          ...getFormatStyles(formatSloganHeader, 0.625),
                          color: formatSloganHeader.color === "themeAccent" ? undefined : formatSloganHeader.color
                        }}
                      >
                        {dealerSlogan}
                      </span>
                    </div>
                  </div>

                  {/* Header Titles */}
                  <div className="mt-4">
                    <h2 
                      className="tracking-tight leading-none"
                      style={{
                        ...getFormatStyles(formatPromoHeading, 1.5),
                        color: formatPromoHeading.color === "themeAccent" ? undefined : formatPromoHeading.color
                      }}
                    >
                      {financeTitle}
                    </h2>
                    <h3 
                      className="tracking-widest leading-none mt-1"
                      style={{
                        ...getFormatStyles(formatSubtitle, 1.25),
                        color: formatSubtitle.color === "themeAccent" ? undefined : formatSubtitle.color
                      }}
                    >
                      {financeSubtitle}
                    </h3>
                    <div className={`w-32 h-[3px] mt-2.5 ${activeTheme.accent}`} />
                  </div>
                </div>

                {/* Sub-body Content: Left (Reqs) and Right (Deposit badge & Toyota big Wheel) */}
                <div className="grid grid-cols-12 px-5 py-2 relative gap-3">
                  
                  {/* Left segment - bank requirements */}
                  <div className="col-span-7 space-y-2 text-left z-20">
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 leading-tight">
                      Requirements for Bank financing are:
                    </h4>
                    <ul className="space-y-1.5 pl-1.5">
                      {requirementsList.map((req, idx) => (
                        <li key={idx} className="flex items-start text-[10.5px] leading-tight text-slate-700">
                          <span className={`text-[12px] font-black pr-1.5 ${activeTheme.textAccent}`}>•</span>
                          <span className="font-semibold">{req}</span>
                        </li>
                      ))}
                    </ul>
                    {noteText && (
                      <p className={`text-[9px] font-bold italic mt-2.5 ${activeTheme.textAccent}`}>
                        {noteText}
                      </p>
                    )}
                  </div>

                  {/* Right segment - Deposit Circle and Cropped Wheel Artwork */}
                  <div className="col-span-5 relative flex flex-col items-center justify-start min-h-[135px]">
                    
                    {/* Toyota Chrome Emblem Simulated Crop */}
                    <div className="absolute top-10 -right-5 w-28 h-28 rounded-full border-[10px] border-slate-100 shadow-lg overflow-hidden shrink-0 z-0">
                      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center opacity-95">
                        <div className="w-16 h-12 rounded-full border-4 border-slate-300 relative flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-2 border-slate-300 absolute" />
                          <div className="w-14 h-4 bg-slate-900 border-t border-b border-slate-300 absolute" />
                        </div>
                      </div>
                    </div>

                    {/* Deposit Circle (mimics Sego deposit design) */}
                    <div className={`w-24 sm:w-26 h-24 sm:h-26 rounded-full flex flex-col items-center justify-center text-white p-2.5 text-center shadow-xl ring-4 ring-white z-10 mr-5 mt-1 pointer-events-none transform hover:scale-105 transition-all ${activeTheme.accent}`}>
                      <span className="text-[10px] font-bold tracking-tight uppercase leading-none opacity-90">Deposit</span>
                      <span className="text-[8px] font-semibold tracking-wider uppercase leading-none opacity-85">From</span>
                      <span className="text-2xl sm:text-3xl font-black tracking-tighter leading-none mt-1">{depositValue}</span>
                    </div>

                  </div>
                </div>

                {/* Middle teaser slogan bar */}
                <div className="px-5 py-2 z-10">
                  <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                    {dealerPromoText}
                  </p>
                </div>

                {/* 4 VEHICLE INVENTORY GRID OVERLAYS */}
                <div className="grid grid-cols-2 gap-3 px-5 py-3 z-10 bg-slate-50/50 flex-1">
                  {inventoryList.slice(0, 4).map((car) => (
                    <div 
                      key={car.id} 
                      className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all relative"
                    >
                      {/* Name Header top bar maroon stripe (Mimics Image 1 design) */}
                      <div className={`py-1.5 px-2 text-[10px] font-black text-white text-center leading-none ${activeTheme.accent}`}>
                        {car.year} {car.make} {car.model}
                      </div>
                      
                      {/* Image viewport with price tag overlay */}
                      <div className="relative h-20 sm:h-24 overflow-hidden flex items-center justify-center bg-slate-100">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Price Ribbon Overlay matching bottom-right indicator in Image 1 */}
                        <div className="absolute bottom-1 right-0 bg-white border-l-4 border-slate-900 pl-2 pr-1.5 py-0.5 rounded-l shadow shadow-slate-950/20 z-10">
                          <span className="text-[9.5px] font-black text-slate-900 tracking-tight block">
                            {car.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM CONTACT COORDINATES STRIP (Red Sego bar) */}
                <div className={`mt-auto text-white flex items-center justify-between text-[8px] sm:text-[9.5px] font-sans px-3 sm:px-4 py-2 bg-gradient-to-r ${activeColorTheme === 'sego_red' ? 'from-[#990c14] to-[#c71e28]' : activeTheme.accent} gap-2`}>
                  <div className="flex items-center space-x-1 font-bold">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <span>{dealerPhone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 font-bold max-w-[125px] sm:max-w-none truncate">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <span className="truncate">{dealerEmail}</span>
                  </div>

                  <div className="flex items-center space-x-0.5 text-right font-medium max-w-[120px] sm:max-w-[170px] leading-tight">
                    <MapPin className="w-3 h-3 text-white shrink-0 mt-0.5" />
                    <span className="truncate">{dealerAddress}</span>
                  </div>
                </div>

              </div>
            )}

            {/* TEMPLATE B: SINGLE VEHICLE SPOTLIGHT SHEET (Mimics Image 2 & 3 closely!) */}
            {selectedTemplate === "single_spotlight" && (
              <div className="w-full max-w-[490px] aspect-[1/1.28] bg-slate-100 text-slate-800 shadow-2xl relative flex flex-col font-sans overflow-hidden animate-fade-in text-left">
                
                {/* Header branding block */}
                <div className="p-4 bg-white flex items-center justify-between border-b border-slate-150">
                  <div className="flex flex-col select-none text-left">
                    {isEditingLogo ? (
                      <div className="flex items-center space-x-1 border border-indigo-400 bg-white shadow-md p-1 rounded-lg z-25">
                        <input
                          type="text"
                          value={dealerName}
                          onChange={(e) => {
                            setDealerName(e.target.value);
                          }}
                          onBlur={() => setIsEditingLogo(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setIsEditingLogo(false);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none w-24 uppercase font-mono"
                          placeholder="SEGO-BAY"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setIsEditingLogo(false)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsEditingLogo(true)}
                        className="flex items-baseline leading-none cursor-pointer group hover:bg-slate-50 hover:ring-2 hover:ring-purple-400/50 rounded-md p-0.5 transition-all relative"
                        title="Click to edit branding logo (updates dealer code)"
                      >
                        <span 
                          className="pr-0.5"
                          style={{
                            ...getFormatStyles(formatDealerCode, 1.25),
                            color: formatDealerCode.color === "themeAccent" 
                              ? (activeColorTheme === 'sego_red' ? '#cf1520' : undefined)
                              : formatDealerCode.color
                          }}
                        >
                          {dealerName ? dealerName.charAt(0) : "S"}
                        </span>
                        <span 
                          className="uppercase"
                          style={{
                            ...getFormatStyles(formatDealerCode, 1.0),
                            color: formatDealerCode.color === "themeAccent" ? "#0f172a" : formatDealerCode.color
                          }}
                        >
                          {dealerName ? dealerName.slice(1) : "EGO-BAY"}
                        </span>
                        <span className="absolute -top-3.5 left-2 bg-purple-600 text-white text-[7.5px] font-medium tracking-wide px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none uppercase">
                          ✏️ Edit Logo
                        </span>
                      </div>
                    )}
                    <span 
                      className="tracking-[0.2em] leading-none"
                      style={{
                        ...getFormatStyles(formatSloganHeader, 0.5),
                        color: formatSloganHeader.color === "themeAccent" ? undefined : formatSloganHeader.color
                      }}
                    >
                      {dealerSlogan}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] font-mono font-bold text-amber-700 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>SHOWROOM SPECIAL DEALS</span>
                  </div>
                </div>

                {/* Middle segment: Giant Main photo + Stack of 3 companion thumbs on the right side */}
                <div className="grid grid-cols-12 gap-2 p-3 bg-white">
                  
                  {/* Left Column: Giant main photo */}
                  <div className="col-span-8 h-[180px] sm:h-[220px] rounded-lg overflow-hidden border border-slate-200 relative group bg-slate-100">
                    <img 
                      src={singleMainImage} 
                      alt={singleName} 
                      className="w-full h-full object-cover transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Corner badge overlay */}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold text-white shadow ${activeTheme.accent}`}>
                      PRE-CHECKED OK
                    </div>
                  </div>

                  {/* Right Column: 3 vertically stacked square photos */}
                  <div className="col-span-4 flex flex-col gap-1.5 justify-between h-[180px] sm:h-[220px]">
                    <div className="flex-1 rounded border border-slate-200 overflow-hidden relative bg-slate-100">
                      <img src={singleSideImage} alt="Details 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 rounded border border-slate-200 overflow-hidden relative bg-slate-100">
                      <img src={singleInterior1} alt="Details 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 rounded border border-slate-200 overflow-hidden relative bg-slate-100">
                      <img src={singleInterior2} alt="Details 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>

                {/* GIANT TYPOGRAPHY ACCENT & PRICE WRAPPER (Red-Maroon area matching Image 2 & 3!) */}
                <div className={`p-4 text-white flex-1 flex flex-col justify-between relative ${activeTheme.darkBg}`}>
                  
                  <div className="grid grid-cols-12 gap-3 items-start">
                    
                    {/* Giant text names */}
                    <div className="col-span-9 space-y-1 text-left">
                      <span className="text-[20px] sm:text-[24px] font-mono leading-none tracking-tight block text-slate-100/90 font-bold">
                        {singleYear}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase font-serif">
                        {singleName.split(" ")[0]} 
                        <span className="block text-2xl sm:text-3.5xl font-black mt-1 text-white tracking-widest">
                          {singleName.split(" ").slice(1).join(" ")}
                        </span>
                      </h3>
                    </div>

                    {/* Vertical rotating badge text (e.g. HYBRID or E-POWER) */}
                    <div className="col-span-3 flex justify-end">
                      <div className="bg-white text-slate-900 border-l-[3px] border-[#cb1c26] text-center uppercase tracking-widest font-black py-2.5 px-1.5 text-[9px] leading-tight select-none rounded shadow [writing-mode:vertical-lr] scale-110">
                        {singleBadge}
                      </div>
                    </div>
                  </div>

                  {/* Specs Bullets inside white text */}
                  <div className="mt-4 grid grid-cols-12 gap-2 items-end">
                    
                    {/* Left detailed specs list */}
                    <div className="col-span-7 space-y-1 text-left">
                      {singleSpecs.slice(0, 6).map((spec, idx) => (
                        <div key={idx} className="text-[8.5px] sm:text-[9.5px] leading-none tracking-normal text-slate-100 font-bold flex items-center">
                          <span className="text-[12px] text-amber-400 font-serif pr-1.5 shrink-0">•</span>
                          <span className="truncate uppercase">{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right massive price slot with stitching/slash design */}
                    <div className="col-span-5 text-right flex flex-col justify-end">
                      <span className="text-[10px] tracking-widest font-bold block text-slate-300 uppercase leading-none">
                        PRICE :
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none mt-1.5 animate-pulse bg-slate-900/40 p-2.5 rounded-lg border border-white/20 shadow-lg text-center block">
                        {singlePrice}
                      </span>
                    </div>

                  </div>
                </div>

                {/* BOTTOM YELLOW-ISH COMMUNICATION BAR WITH CONTACT BUTTON */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white text-[8px] sm:text-[9.5px] font-sans border-t border-slate-800">
                  <div className={`flex items-center space-x-1 font-black uppercase text-[8px] text-slate-900 px-2 py-1 rounded shadow-sm ${activeColorTheme === 'sunset_gold' ? 'bg-amber-400' : 'bg-amber-400'}`}>
                    <span>CONTACT US</span>
                  </div>

                  <div className="flex items-center space-x-1 font-bold">
                    <span>{dealerPhone}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 truncate max-w-[130px] sm:max-w-none">
                    <span className="truncate">{dealerEmail}</span>
                  </div>

                  <div className="flex items-center space-x-1 truncate max-w-[100px] sm:max-w-[140px] leading-tight text-right text-slate-400">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate text-[8px]">{dealerAddress.split(",")[0]}</span>
                  </div>
                </div>

              </div>
            )}

            {/* TEMPLATE C: EXECUTIVE BUSINESS CARD (Dual sided corporate template) */}
            {selectedTemplate === "business_card" && (
              <div className="w-full max-w-[440px] aspect-[1.75/1] bg-slate-900 text-slate-100 shadow-2xl relative flex flex-col font-sans overflow-hidden rounded-xl animate-fade-in text-left border border-slate-750">
                
                {/* Back diagonal color bands */}
                <div className={`absolute top-0 right-0 w-44 h-full transform translate-x-20 rotate-12 opacity-15 pointer-events-none ${activeTheme.accent}`} />
                <div className={`absolute bottom-0 left-0 w-24 h-4 transform -skew-x-12 opacity-80 ${activeTheme.accent}`} />
                
                {cardBackSide === 'front' ? (
                  /* FRONT SURFACE: Representative name & Contact points */
                  <div className="p-6 flex flex-col justify-between h-full relative z-10 text-left">
                    
                    {/* Header: Sego Logo + Subheading */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col select-none text-left">
                        {isEditingLogo ? (
                          <div className="flex items-center space-x-1 border border-indigo-400 bg-white shadow-md p-1 rounded-lg z-25">
                            <input
                              type="text"
                              value={dealerName}
                              onChange={(e) => {
                                setDealerName(e.target.value);
                              }}
                              onBlur={() => setIsEditingLogo(false)}
                              onKeyDown={(e) => {
                                  if (e.key === "Enter") setIsEditingLogo(false);
                              }}
                              className="px-2 py-0.5 text-[9px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none w-20 uppercase font-mono"
                              placeholder="SEGO-BAY"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setIsEditingLogo(false)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setIsEditingLogo(true)}
                            className="flex items-baseline leading-none cursor-pointer group hover:bg-slate-800 hover:ring-2 hover:ring-purple-400/50 rounded-md p-0.5 transition-all relative"
                            title="Click to edit branding logo (updates dealer code)"
                          >
                            <span 
                              className="pr-0.5"
                              style={{
                                ...getFormatStyles(formatDealerCode, 1.25), // text-[20px] is ~1.25em
                                color: formatDealerCode.color === "themeAccent" 
                                  ? (activeColorTheme === 'sego_red' ? '#cf1520' : undefined)
                                  : formatDealerCode.color
                              }}
                            >
                              {dealerName ? dealerName.charAt(0) : "S"}
                            </span>
                            <span 
                              className="uppercase"
                              style={{
                                ...getFormatStyles(formatDealerCode, 0.93), // text-[15px] is ~0.93em
                                color: formatDealerCode.color === "themeAccent" ? "#ffffff" : formatDealerCode.color
                              }}
                            >
                              {dealerName ? dealerName.slice(1) : "EGO-BAY"}
                            </span>
                            <span className="absolute -top-3.5 left-2 bg-purple-600 text-white text-[7px] font-medium tracking-wide px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none uppercase">
                              ✏️ Edit Logo
                            </span>
                          </div>
                        )}
                        <span 
                          className="tracking-[0.25em] leading-none"
                          style={{
                            ...getFormatStyles(formatSloganHeader, 0.4), // 6.5px is ~0.4em
                            color: formatSloganHeader.color === "themeAccent" ? undefined : formatSloganHeader.color
                          }}
                        >
                          {dealerSlogan}
                        </span>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className={`text-[7px] font-bold tracking-widest text-slate-400 block uppercase`}>
                          Showroom Certified Agent
                        </span>
                        <div className="flex space-x-1 mt-1 opacity-85">
                          <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.accent}`} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Middle: Name and title (Prominent styling) */}
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight text-white leading-none">
                        {cardRepName}
                      </h3>
                      <h4 className={`text-[10px] font-mono tracking-wider font-semibold mt-1 ${activeTheme.textAccent}`}>
                        {cardRepTitle}
                      </h4>
                      <p className="text-[8px] text-slate-400 max-w-[280px] mt-1.5 leading-tight">
                        {cardSubtext}
                      </p>
                    </div>

                    {/* Footer strip: Contact listings */}
                    <div className="grid grid-cols-12 gap-1 border-t border-slate-800/80 pt-3 text-[8.5px] font-mono text-slate-300">
                      
                      <div className="col-span-4 flex items-center space-x-1">
                        <Phone className={`w-2.5 h-2.5 shrink-0 ${activeTheme.textAccent}`} />
                        <span className="truncate">{dealerPhone}</span>
                      </div>

                      <div className="col-span-4 flex items-center space-x-1">
                        <Mail className={`w-2.5 h-2.5 shrink-0 ${activeTheme.textAccent}`} />
                        <span className="truncate">{dealerEmail}</span>
                      </div>

                      <div className="col-span-4 flex items-center space-x-1 text-right justify-end truncate">
                        <MapPin className={`w-2.5 h-2.5 shrink-0 ${activeTheme.textAccent}`} />
                        <span className="truncate pr-1">{dealerAddress.split(",")[0]}</span>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* BACK SURFACE: Showroom Services & QR code simulation */
                  <div className="p-6 flex flex-col justify-between h-full relative z-10 text-center items-center bg-slate-950">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 ${activeTheme.accent}`} />
                    <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5 ${activeTheme.accent}`} />
                    
                    <div className="my-auto space-y-3.5 flex flex-col items-center">
                      <div className="flex flex-col select-none items-center">
                        {isEditingLogo ? (
                          <div className="flex items-center space-x-1 border border-indigo-400 bg-white shadow-md p-1 rounded-lg z-25">
                            <input
                              type="text"
                              value={dealerName}
                              onChange={(e) => {
                                setDealerName(e.target.value);
                              }}
                              onBlur={() => setIsEditingLogo(false)}
                              onKeyDown={(e) => {
                                  if (e.key === "Enter") setIsEditingLogo(false);
                              }}
                              className="px-2 py-0.5 text-[9px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded outline-none w-20 uppercase font-mono"
                              placeholder="SEGO-BAY"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setIsEditingLogo(false)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setIsEditingLogo(true)}
                            className="flex items-baseline leading-none cursor-pointer group hover:bg-slate-800 hover:ring-2 hover:ring-purple-400/50 rounded-md p-0.5 transition-all relative"
                            title="Click to edit branding logo (updates dealer code)"
                          >
                            <span 
                              className="pr-0.5"
                              style={{
                                ...getFormatStyles(formatDealerCode, 1.875), // text-3xl is ~1.875em
                                color: formatDealerCode.color === "themeAccent" 
                                  ? '#cf1520'
                                  : formatDealerCode.color
                              }}
                            >
                              {dealerName ? dealerName.charAt(0) : "S"}
                            </span>
                            <span 
                              className="uppercase"
                              style={{
                                ...getFormatStyles(formatDealerCode, 1.5), // text-2.5xl is ~1.5em
                                color: formatDealerCode.color === "themeAccent" ? "#ffffff" : formatDealerCode.color
                              }}
                            >
                              {dealerName ? dealerName.slice(1) : "EGO-BAY"}
                            </span>
                            <span className="absolute -top-3.5 left-2 bg-purple-600 text-white text-[7px] font-medium tracking-wide px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none uppercase">
                              ✏️ Edit Logo
                            </span>
                          </div>
                        )}
                        <span 
                          className="tracking-[0.3em] uppercase leading-none mt-1"
                          style={{
                            ...getFormatStyles(formatSloganHeader, 0.56), // 9px is ~0.56em
                            color: formatSloganHeader.color === "themeAccent" ? "#94a3b8" : formatSloganHeader.color
                          }}
                        >
                          -{dealerSlogan}-
                        </span>
                      </div>

                      {/* Accent specs ribbon for back of card */}
                      <div className="p-1.5 bg-slate-900 border border-slate-820 rounded-md text-[7.5px] font-mono text-slate-400 uppercase tracking-widest max-w-[340px] text-center">
                        TOYOTA • NISSAN • MAZDA • HONDA SHOWCASE SPECIALIST
                      </div>

                      <p className="text-[10px] italic text-slate-400 text-center max-w-[280px]">
                        "{dealerPromoText.substring(0, 100)}"
                      </p>
                    </div>

                    <div className="w-full flex items-center justify-between text-[7px] font-mono text-slate-500 border-t border-slate-800/60 pt-3">
                      <span>Milestone Business Center • Kiambu road</span>
                      <span className="font-bold text-white uppercase tracking-wider">Premium Service & Flexible Financing</span>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* HELPFUL CHEAT SHEET LEGEND */}
          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-[10.5px] text-left space-y-2">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              DIGITAL DESIGN ACCURACY LOG
            </span>
            <div className="space-y-1.5 text-slate-400 text-[10px]">
              <div>• <span className="text-white font-bold">Vector Diagonal Decals:</span> Configured dynamically relative to color matrices.</div>
              <div>• <span className="text-white font-bold">Original Sego Logotype:</span> Extrapolated in CSS with specific italic italic offsets.</div>
              <div>• <span className="text-white font-bold">Finance Term Badges:</span> Stamped inside safe physical boundaries for pristine mock representation.</div>
              <div>• <span className="text-white font-bold">Chromium Toyota Overlay:</span> Pre-composed vector clipping overlays.</div>
            </div>
          </div>

        </div>

      </div>

      {/* SHARE WITH IMMERSIVE SOUNDTRACK MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-6 space-y-5">
              
              {/* Top status */}
              <div className="flex items-center space-x-3.5 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base leading-snug">Asset Compiled Successfully!</h3>
                  <p className="text-[11px] text-slate-500">Your edited visual and immersive Sego-Bay soundtrack are synthesized.</p>
                </div>
              </div>

              {/* Soundtrack integration controller inside share popup */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3.5 border border-slate-800 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block font-bold uppercase">Dynamic Audio Integration Overlay • Active</span>
                  <div className="flex items-center space-x-1 font-mono text-[9px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>READY TO STREAM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 relative z-10">
                  <div className={`w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-md ${isPlayingAudio ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="truncate flex-1 text-left">
                    <span className="text-xs font-bold text-slate-100 block leading-tight truncate">"{selectedSoundtrack}"</span>
                    <span className="text-[10px] text-indigo-400 font-semibold block mt-0.5 truncate">
                      {soundtracks.find(t => t.title === selectedSoundtrack)?.genre || "Stereo Mix"} • {soundtracks.find(t => t.title === selectedSoundtrack)?.duration || "2:45"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      addAuditLog("INFO", "COMPOSITE", `Toggled ambient player review inside share wizard to: ${!isPlayingAudio ? 'ACTIVE' : 'PAUSED'}`);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center space-x-1 shrink-0 ${isPlayingAudio ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'}`}
                  >
                    <span>{isPlayingAudio ? "⏸ Pause" : "▶ Listen"}</span>
                  </button>
                </div>

                {isPlayingAudio && (
                  <div className="flex items-end justify-between px-2.5 h-3.5 bg-slate-950/80 rounded py-0.5">
                    <span className="text-[8px] font-mono text-indigo-400">AMBIPORT CONTINUUM BUS</span>
                    <div className="flex items-end space-x-0.5 h-full">
                      <span className="w-[1.5px] bg-indigo-400 h-1/2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
                      <span className="w-[1.5px] bg-indigo-400 h-1/3 animate-bounce rounded-full" style={{ animationDelay: "0.3s" }} />
                      <span className="w-[1.5px] bg-indigo-300 h-full animate-bounce rounded-full" style={{ animationDelay: "0.5s" }} />
                      <span className="w-[1.5px] bg-indigo-200 h-3/5 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
                      <span className="w-[1.5px] bg-indigo-400 h-[80%] animate-bounce rounded-full" style={{ animationDelay: "0.4s" }} />
                      <span className="w-[1.5px] bg-emerald-400 h-2/5 animate-bounce rounded-full" style={{ animationDelay: "0.6s" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Share actions */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">Sharing Modes (Audio Synced Link Included)</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      addAuditLog("SUCCESS", "SOCIAL", `Dispatched immersive WhatsApp share packet containing graphic + streamable background music '${selectedSoundtrack}'`);
                      alert(`Forwarding immersive brochure package directly to WhatsApp Business registry! Synced soundtrack background: [${selectedSoundtrack}]`);
                    }}
                    className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Business</span>
                  </button>

                  <button
                    onClick={() => {
                      addAuditLog("SUCCESS", "SOCIAL", `Dispatched interactive showroom portal link sync to LinkedIn page with background: '${selectedSoundtrack}'`);
                      alert(`LinkedIn showcase dispatch success. Recipient link is associated with ambient beat: [${selectedSoundtrack}]`);
                    }}
                    className="py-2.5 px-3 bg-[#0A66C2] hover:bg-[#0952a2] active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LinkedIn Portal</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const mockUrl = `https://segobay.com/showroom/portfolio?id=${selectedTemplate === 'business_card' ? 'rep-card' : 'flyer-1'}&audio=true&track=${encodeURIComponent(selectedSoundtrack)}`;
                    navigator.clipboard.writeText(mockUrl);
                    setCopiedLink(true);
                    addAuditLog("SUCCESS", "SYSTEM", `Copied immersive digital link directly to system clipboard! ID: ${selectedSoundtrack}`);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer border ${copiedLink ? 'bg-[#10b981] border-[#10b981] text-white animate-pulse' : 'bg-slate-50 border-slate-205 text-slate-705 hover:bg-slate-100'}`}
                >
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>{copiedLink ? "Link Copied!" : "Copy Interactive Link with Audio Background"}</span>
                </button>
              </div>

              {/* Close container */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setIsPlayingAudio(false);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition select-none"
                >
                  Close & Back to Workspace
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
