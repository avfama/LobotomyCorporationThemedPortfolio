import { AlertTriangle, Lock, Zap } from 'lucide-react';
import type { ContainmentUnitType } from '../App';

interface ContainmentUnitProps extends ContainmentUnitType {
  onClick?: () => void;
}

export function ContainmentUnit({ 
  id, 
  name, 
  riskLevel, 
  status, 
  workCount, 
  qliphothCounter,
  maxQliphoth,
  onClick
}: ContainmentUnitProps) {
  const riskColors = {
    ZAYIN: '#66ff66',
    TETH: '#66ffff',
    HE: '#ffff66',
    WAW: '#ff9933',
    ALEPH: '#ff3333'
  };

  const statusColors = {
    contained: 'border-[#444]',
    working: 'border-[#4488ff]',
    breached: 'border-[#ff3333] animate-pulse'
  };

  return (
    <div 
      className={`bg-[#1a1a1a] border-2 ${statusColors[status]} p-4 relative cursor-pointer hover:border-[#888] transition-colors`}
      onClick={onClick}
    >
      {status === 'breached' && (
        <div className="absolute inset-0 bg-[#ff3333]/20 pointer-events-none animate-pulse" />
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] text-[#888] mb-1 font-mono">{id}</div>
          <div 
            className="px-2 py-0.5 border text-[11px] inline-block mb-2 font-mono"
            style={{ 
              borderColor: riskColors[riskLevel],
              color: riskColors[riskLevel]
            }}
          >
            {riskLevel}
          </div>
        </div>
        
        {status === 'breached' && (
          <AlertTriangle className="w-5 h-5 text-[#ff3333] animate-pulse" />
        )}
        {status === 'working' && (
          <Zap className="w-5 h-5 text-[#4488ff]" />
        )}
        {status === 'contained' && (
          <Lock className="w-5 h-5 text-[#666]" />
        )}
      </div>
      
      <div className="h-24 bg-[#0a0a0a] border border-[#333] mb-3 flex items-center justify-center">
        <div className="text-6xl opacity-20">?</div>
      </div>
      
      <div className="text-white mb-3 font-mono text-sm">{name}</div>
      
      {/* Qliphoth Counter */}
      <div className="mb-2">
        <div className="flex justify-between text-[9px] text-[#aaa] mb-1 font-mono">
          <span>QLIPHOTH COUNTER</span>
          <span>{Math.round(qliphothCounter)}%</span>
        </div>
        <div className="h-2 bg-[#1a1a1a] border border-[#444]">
          <div 
            className={`h-full transition-all ${
              qliphothCounter > 60 ? 'bg-[#66ff66]' :
              qliphothCounter > 30 ? 'bg-[#ffff66]' :
              'bg-[#ff6666]'
            }`}
            style={{ width: `${qliphothCounter}%` }}
          />
        </div>
      </div>
      
      {/* Work Count */}
      <div className="text-[10px] text-[#888] font-mono">
        WORK COUNT: {workCount}
      </div>
    </div>
  );
}
