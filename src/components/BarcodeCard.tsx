import React, { useState } from 'react';
import { IbraEvent } from '../types';
import { QrCode, Barcode as BarcodeIcon, Printer, Copy, Check, Sparkles, ShieldCheck, Download } from 'lucide-react';

interface BarcodeCardProps {
  event: IbraEvent;
  compact?: boolean;
}

/**
 * Deterministic SVG Barcode generator (Code-128 style representation)
 */
export const SvgBarcode: React.FC<{ code: string; className?: string; height?: number }> = ({ 
  code, 
  className = "w-full h-16",
  height = 54
}) => {
  // Generate deterministic bar widths based on char codes
  const bars: { width: number; isSpace: boolean }[] = [];
  
  // Start pattern
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false });

  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = (charCode * 7 + i * 13) % 16;
    
    // 4 bars and spaces per character
    bars.push(
      { width: (pattern % 3) + 1, isSpace: false },
      { width: ((pattern >> 1) % 2) + 1, isSpace: true },
      { width: ((pattern >> 2) % 3) + 1, isSpace: false },
      { width: ((pattern >> 3) % 2) + 1, isSpace: true }
    );
  }

  // Stop pattern
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 3, isSpace: false });

  let currentX = 10;
  const rects: React.ReactNode[] = [];

  bars.forEach((b, idx) => {
    if (!b.isSpace) {
      rects.push(
        <rect
          key={idx}
          x={currentX}
          y={4}
          width={b.width * 1.5}
          height={height}
          fill="currentColor"
        />
      );
    }
    currentX += b.width * 1.5;
  });

  const totalWidth = currentX + 10;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${totalWidth} ${height + 8}`}
        className={className}
        preserveAspectRatio="xMidYMid meet"
      >
        {rects}
      </svg>
      <span className="font-mono text-xs tracking-widest text-neutral-400 mt-1 uppercase">
        *{code}*
      </span>
    </div>
  );
};

/**
 * Deterministic SVG QR Code generator
 */
export const SvgQrCode: React.FC<{ value: string; size?: number; className?: string }> = ({ 
  value, 
  size = 120,
  className = "text-amber-400"
}) => {
  const gridSize = 21; // standard version 1 QR size
  const cellSize = size / gridSize;
  const modules: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Function to add finder pattern at (r, c)
  const addFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 || // outer box
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)       // inner box
        ) {
          modules[r + i][c + j] = true;
        }
      }
    }
  };

  // 3 Corner Finders
  addFinder(0, 0);
  addFinder(0, gridSize - 7);
  addFinder(gridSize - 7, 0);

  // Timing lines
  for (let i = 8; i < gridSize - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  // Deterministic data fill based on string hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finders or timing lines
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        const bit = ((hash ^ (r * 31 + c * 17)) & (1 << ((r + c) % 8))) !== 0;
        modules[r][c] = bit;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <rect width={size} height={size} fill="transparent" />
      {modules.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
};

export const BarcodeCard: React.FC<BarcodeCardProps> = ({ event, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const barcodeValue = event.barcode || `IBRA-${event.eventId.replace(/[^0-9]/g, '') || '20261048'}`;
  const portalUrl = `https://ibraprod.online/my-event?id=${encodeURIComponent(event.eventId)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(event.eventId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (compact) {
    return (
      <div className="bg-neutral-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between gap-4 text-neutral-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-950 border border-amber-500/20 text-amber-400">
            <BarcodeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">كود بار المناسبة</div>
            <div className="text-sm font-bold font-mono text-amber-300">{event.eventId}</div>
            <div className="text-xs text-neutral-400">العريس: {event.groomName} × {event.brideName}</div>
          </div>
        </div>
        <div className="w-28 text-white">
          <SvgBarcode code={barcodeValue} height={28} className="w-full text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 text-neutral-100 max-w-lg mx-auto print:border-black print:bg-white print:text-black">
      {/* Decorative Gold Corner Glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 font-bold font-cinzel flex items-center justify-center text-xs shadow-md">
            IP
          </div>
          <div>
            <span className="font-cinzel text-xs font-bold tracking-widest text-amber-400 block">IBRA PRODUCTION</span>
            <span className="text-[10px] text-neutral-400 tracking-wider">OFFICIAL VIP WEDDING PASS</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> بطاقة معتمدة
        </div>
      </div>

      {/* Couple Names & Title */}
      <div className="text-center mb-5">
        <span className="text-xs text-amber-400/90 tracking-widest font-medium uppercase block mb-1">
          بطاقة العريس والمناسبة الرقمية
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
          العريس {event.groomName} <span className="text-amber-500 font-sans">×</span> {event.brideName}
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {event.eventDate} • {event.location || event.wilaya}
        </p>
      </div>

      {/* Barcode & QR Box */}
      <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-5 print:bg-white print:border-black">
        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="p-2.5 bg-neutral-900 border border-amber-500/30 rounded-xl shadow-inner print:bg-white">
            <SvgQrCode value={portalUrl} size={90} className="text-amber-400 print:text-black" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 font-mono">SCAN VIP QR</span>
        </div>

        {/* 1D Barcode */}
        <div className="flex-1 w-full flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-r border-amber-500/20 pt-3 sm:pt-0 sm:pr-4">
          <div className="text-center mb-1">
            <span className="text-[11px] text-neutral-400">المعرف الفريد (Event ID)</span>
            <div className="text-lg font-bold font-mono tracking-wider text-amber-300">
              {event.eventId}
            </div>
          </div>
          <div className="w-full text-white print:text-black">
            <SvgBarcode code={barcodeValue} height={42} className="w-full text-neutral-100 print:text-black" />
          </div>
        </div>
      </div>

      {/* Footer Info & Details */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-900/60 rounded-xl p-3 mb-5 border border-neutral-800">
        <div>
          <span className="text-neutral-400 block text-[10px]">الباقة المختارة:</span>
          <span className="font-medium text-white truncate block">{event.packageName || 'الباقة الذهبية'}</span>
        </div>
        <div>
          <span className="text-neutral-400 block text-[10px]">فلاشة Smart USB:</span>
          <span className="font-mono text-amber-300 font-semibold">{event.smartUsbId || `USB-${event.eventId}`}</span>
        </div>
        <div>
          <span className="text-neutral-400 block text-[10px]">الهاتف:</span>
          <span className="font-mono text-neutral-200">{event.phone}</span>
        </div>
        <div>
          <span className="text-neutral-400 block text-[10px]">حالة المناسبة:</span>
          <span className="text-emerald-400 font-semibold">{event.status === 'CONFIRMED' ? 'مؤكدة رسمياً' : event.status}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 print:hidden">
        <button
          onClick={handleCopy}
          className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'تم النسخ!' : 'نسخ المعرف'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>طباعة البطاقة</span>
        </button>
      </div>
    </div>
  );
};
