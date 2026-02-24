import { Activity } from 'lucide-react';
import type { Employee } from '../App';

interface EmployeeCardProps extends Employee {
  onClick?: () => void;
}

export function EmployeeCard({ id, name, role, type, stats, status, behavior, hp, maxHp, mp, maxMp, onClick, disabledUntil }: EmployeeCardProps) {
  const isDisabled = disabledUntil && Date.now() < disabledUntil;
  
  const statusColors = {
    idle: 'bg-[#2a2a2a]',
    working: 'bg-[#1a3a4a]',
    panic: 'bg-[#4a1a1a]',
    wellness: 'bg-[#1a3a3a]',
    medical: 'bg-[#3a2a1a]',
    repression: 'bg-[#3a1a3a]'
  };

  const statusLabels = {
    idle: 'STANDBY',
    working: 'WORKING',
    panic: 'PANIC',
    wellness: 'WELLNESS',
    medical: 'MEDICAL',
    repression: 'REPRESSION'
  };

  const behaviorColors = {
    'Calm': '#66ff66',
    'Stressed': '#ffff66',
    'Panic': '#ff6666',
    'Unconscious': '#666666'
  };

  const typeColors = {
    'Research': '#66ffff',
    'Breach Protocol': '#ff6666'
  };

  const remainingTime = isDisabled && disabledUntil ? Math.ceil((disabledUntil - Date.now()) / 1000) : 0;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div 
      className={`${statusColors[status]} border-2 ${isDisabled ? 'border-[#ff3333] opacity-60' : 'border-[#444] hover:border-[#888]'} p-3 relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors`}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="absolute top-1 right-1 flex gap-1">
        <div className="px-2 py-0.5 bg-black/60 border border-[#666] text-[10px]" style={{ color: status === 'panic' ? '#ff6b6b' : '#6699ff' }}>
          {statusLabels[status]}
        </div>
        <div className="px-1.5 py-0.5 bg-black/60 border text-[9px]" style={{ borderColor: behaviorColors[behavior], color: behaviorColors[behavior] }}>
          {behavior.toUpperCase()}
        </div>
      </div>
      
      <div className="absolute top-8 right-1 px-1.5 py-0.5 bg-black/60 border text-[9px]" style={{ borderColor: typeColors[type], color: typeColors[type] }}>
        {type === 'Research' ? 'RSC' : 'BRP'}
      </div>

      {/* Recovery Timer */}
      {isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none">
          <div className="text-center">
            <div className="text-[#ff6666] text-sm font-mono mb-1">RECOVERING</div>
            <div className="text-white text-lg font-mono">{minutes}:{seconds.toString().padStart(2, '0')}</div>
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="w-16 h-20 bg-[#1a1a1a] border border-[#555] flex items-center justify-center">
          <Activity className="w-8 h-8 text-[#999]" />
        </div>
        
        <div className="flex-1">
          <div className="text-white mb-1 font-mono">{name}</div>
          <div className="text-[11px] text-[#888] mb-2 font-mono">{id} | {role}</div>
          
          {/* HP Bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[9px] text-[#aaa] mb-0.5 font-mono">
              <span>HP</span>
              <span>{Math.round(hp)}/{maxHp}</span>
            </div>
            <div className="h-1.5 bg-[#1a1a1a] border border-[#444]">
              <div 
                className="h-full bg-[#ff4444]"
                style={{ width: `${(hp / maxHp) * 100}%` }}
              />
            </div>
          </div>
          
          {/* MP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[9px] text-[#aaa] mb-0.5 font-mono">
              <span>MP</span>
              <span>{Math.round(mp)}/{maxMp}</span>
            </div>
            <div className="h-1.5 bg-[#1a1a1a] border border-[#444]">
              <div 
                className="h-full bg-[#4488ff]"
                style={{ width: `${(mp / maxMp) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
            <div className="text-center">
              <div className="text-[#ff6666]">FOR</div>
              <div className="text-white">{stats.fortitude}</div>
            </div>
            <div className="text-center">
              <div className="text-[#66ff66]">PRU</div>
              <div className="text-white">{stats.prudence}</div>
            </div>
            <div className="text-center">
              <div className="text-[#6666ff]">TEM</div>
              <div className="text-white">{stats.temperance}</div>
            </div>
            <div className="text-center">
              <div className="text-[#ffff66]">JUS</div>
              <div className="text-white">{stats.justice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}