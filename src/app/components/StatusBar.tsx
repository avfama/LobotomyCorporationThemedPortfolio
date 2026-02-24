import { Activity, Users, AlertCircle, Calendar } from 'lucide-react';

interface StatusBarProps {
  day: number;
  energy: number;
  maxEnergy: number;
  employeeCount: number;
  activeAlerts: number;
  meltdownLevel: number;
}

export function StatusBar({ day, energy, maxEnergy, employeeCount, activeAlerts, meltdownLevel }: StatusBarProps) {
  const meltdownColor = 
    meltdownLevel < 30 ? '#66ff66' :
    meltdownLevel < 60 ? '#ffff66' :
    meltdownLevel < 80 ? '#ff9933' : '#ff3333';

  return (
    <div className="bg-[#0a0a0a] border-b-2 border-[#444] p-2 sm:p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        {/* Day */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#888]" />
          <div>
            <div className="text-[8px] sm:text-[9px] text-[#666] font-mono">DAY</div>
            <div className="text-sm sm:text-base text-white font-mono">{day}</div>
          </div>
        </div>
        
        {/* Energy */}
        <div className="flex items-center gap-1 sm:gap-2 col-span-2 sm:col-span-1">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#66ffff]" />
          <div className="flex-1">
            <div className="flex justify-between text-[8px] sm:text-[9px] text-[#666] mb-0.5 font-mono">
              <span>ENERGY</span>
              <span>{energy}/{maxEnergy}</span>
            </div>
            <div className="h-2 bg-[#1a1a1a] border border-[#444]">
              <div 
                className="h-full bg-[#66ffff]"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Employees */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#888]" />
          <div>
            <div className="text-[8px] sm:text-[9px] text-[#666] font-mono">EMP</div>
            <div className="text-sm sm:text-base text-white font-mono">{employeeCount}</div>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="flex items-center gap-1 sm:gap-2">
          <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${activeAlerts > 0 ? 'text-[#ff6666] animate-pulse' : 'text-[#888]'}`} />
          <div>
            <div className="text-[8px] sm:text-[9px] text-[#666] font-mono">ALERT</div>
            <div className={`text-sm sm:text-base font-mono ${activeAlerts > 0 ? 'text-[#ff6666]' : 'text-white'}`}>
              {activeAlerts}
            </div>
          </div>
        </div>
        
        {/* Meltdown Level */}
        <div className="flex items-center gap-1 sm:gap-2 col-span-2 sm:col-span-1">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: meltdownColor }} />
          <div className="flex-1">
            <div className="flex justify-between text-[8px] sm:text-[9px] text-[#666] mb-0.5 font-mono">
              <span>MELT</span>
              <span>{meltdownLevel}%</span>
            </div>
            <div className="h-2 bg-[#1a1a1a] border border-[#444]">
              <div 
                className="h-full transition-colors"
                style={{ 
                  width: `${meltdownLevel}%`,
                  backgroundColor: meltdownColor
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}