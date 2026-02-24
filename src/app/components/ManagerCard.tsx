import { UserCog, Activity, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import type { Manager } from '../App';

interface ManagerCardProps extends Manager {}

export function ManagerCard({ id, name, department, color, status, efficiency }: ManagerCardProps) {
  const statusConfig = {
    active: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'ACTIVE',
      bg: 'bg-[#1a3a1a]',
      text: 'text-[#66ff66]',
      border: 'border-[#66ff66]'
    },
    maintenance: {
      icon: <Activity className="w-4 h-4" />,
      label: 'MAINTENANCE',
      bg: 'bg-[#3a3a1a]',
      text: 'text-[#ffff66]',
      border: 'border-[#ffff66]'
    },
    offline: {
      icon: <WifiOff className="w-4 h-4" />,
      label: 'OFFLINE',
      bg: 'bg-[#3a1a1a]',
      text: 'text-[#ff6666]',
      border: 'border-[#ff6666]'
    }
  };

  const config = statusConfig[status];
  
  // Efficiency color
  const efficiencyColor = 
    efficiency >= 90 ? '#66ff66' :
    efficiency >= 70 ? '#ffff66' :
    efficiency >= 50 ? '#ff9933' :
    '#ff3333';

  return (
    <div className="bg-[#1a1a1a] border-2 border-[#444] hover:border-[#888] transition-colors cursor-pointer">
      {/* Header with color accent */}
      <div 
        className="h-2"
        style={{ backgroundColor: color }}
      />
      
      <div className="p-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className={`px-2 py-1 ${config.bg} border ${config.border} flex items-center gap-1.5`}>
            <div className={config.text}>
              {config.icon}
            </div>
            <span className={`text-[10px] font-mono ${config.text}`}>
              {config.label}
            </span>
          </div>
          <div className="text-[10px] text-[#888] font-mono">{id}</div>
        </div>

        {/* Manager Visual */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-20 h-24 border-2 flex items-center justify-center"
            style={{ borderColor: color }}
          >
            <UserCog className="w-10 h-10" style={{ color }} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-lg mb-1 font-mono" style={{ color }}>
              {name}
            </h3>
            <div className="text-[11px] text-[#888] font-mono mb-3">
              {department}
            </div>
            
            {/* Efficiency Display */}
            <div>
              <div className="flex justify-between text-[9px] text-[#aaa] mb-1 font-mono">
                <span>EFFICIENCY</span>
                <span>{efficiency}%</span>
              </div>
              <div className="h-2 bg-[#0a0a0a] border border-[#444]">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${efficiency}%`,
                    backgroundColor: efficiencyColor
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="bg-[#0a0a0a] border border-[#333] p-3">
          <div className="text-[9px] text-[#666] mb-2 font-mono">DEPARTMENT STATUS</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-[#888]">Units:</span>
              <span className="text-white">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Systems:</span>
              <span className={config.text}>{status === 'active' ? 'OK' : status === 'maintenance' ? 'MAINT' : 'ERR'}</span>
            </div>
          </div>
        </div>

        {/* Special Notes for specific managers */}
        {name === 'Binah' && (
          <div className="mt-3 bg-[#1a1a1a] border border-[#666] p-2">
            <div className="text-[9px] text-[#888] font-mono flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-[#ff6666]" />
              <span>ARBITER CLASS - MAXIMUM CLEARANCE</span>
            </div>
          </div>
        )}
        
        {(name === 'Tiphereth A' || name === 'Tiphereth B') && (
          <div className="mt-3 bg-[#1a1a3a] border border-[#66ffff] p-2">
            <div className="text-[9px] text-[#66ffff] font-mono">
              CENTRAL COMMAND - SYNCHRONIZED
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
