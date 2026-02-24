import { X, Activity, Heart, HeartPulse, Brain, ArrowLeft } from 'lucide-react';
import type { Employee } from '../App';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onUpdateType: (employeeId: string, newType: 'Research' | 'Breach Protocol') => void;
  onSendToWellness: (employeeId: string) => void;
  onSendToMedical: (employeeId: string) => void;
  onRecall: (employeeId: string) => void;
}

export function EmployeeDetails({ 
  employee, 
  onClose, 
  onUpdateType, 
  onSendToWellness, 
  onSendToMedical,
  onRecall 
}: EmployeeDetailsProps) {
  const typeColors = {
    'Research': '#66ffff',
    'Breach Protocol': '#ff6666'
  };

  const statusColors = {
    idle: { bg: 'bg-[#2a2a2a]', text: 'text-white' },
    working: { bg: 'bg-[#1a3a4a]', text: 'text-[#6699ff]' },
    panic: { bg: 'bg-[#4a1a1a]', text: 'text-[#ff6666]' },
    wellness: { bg: 'bg-[#1a3a3a]', text: 'text-[#66ffff]' },
    medical: { bg: 'bg-[#3a2a1a]', text: 'text-[#ff9933]' },
    repression: { bg: 'bg-[#3a1a3a]', text: 'text-[#ff66ff]' }
  };

  const canChangeStatus = employee.status === 'idle' || employee.status === 'panic';
  const canRecall = employee.status === 'wellness' || employee.status === 'medical';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border-2 border-[#666] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b-2 border-[#444] p-4 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="px-2 py-1 border text-sm font-mono"
                style={{ 
                  borderColor: typeColors[employee.type],
                  color: typeColors[employee.type]
                }}
              >
                {employee.type}
              </div>
              <div className="text-[11px] text-[#888] font-mono">{employee.id}</div>
              <div className={`px-2 py-0.5 text-[10px] ${statusColors[employee.status].bg} ${statusColors[employee.status].text} border border-[#666] font-mono`}>
                {employee.status.toUpperCase()}
              </div>
            </div>
            <h2 className="text-xl text-white font-mono">{employee.name}</h2>
            <div className="text-sm text-[#888] font-mono">{employee.role}</div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Employee Preview */}
          <div className="mb-6">
            <div className="flex gap-6 mb-6">
              <div className="w-32 h-40 bg-[#1a1a1a] border-2 border-[#555] flex items-center justify-center">
                <Activity className="w-16 h-16 text-[#999]" />
              </div>
              
              <div className="flex-1">
                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-[#aaa] mb-1 font-mono">
                    <span>HEALTH POINTS</span>
                    <span>{Math.round(employee.hp)}/{employee.maxHp}</span>
                  </div>
                  <div className="h-4 bg-[#1a1a1a] border-2 border-[#444]">
                    <div 
                      className="h-full bg-[#ff4444] transition-all"
                      style={{ width: `${(employee.hp / employee.maxHp) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#888] mt-1 font-mono">
                    {employee.hp < 30 ? 'CRITICAL' : employee.hp < 60 ? 'INJURED' : 'HEALTHY'}
                  </div>
                </div>
                
                {/* MP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-[#aaa] mb-1 font-mono">
                    <span>MENTAL POINTS</span>
                    <span>{Math.round(employee.mp)}/{employee.maxMp}</span>
                  </div>
                  <div className="h-4 bg-[#1a1a1a] border-2 border-[#444]">
                    <div 
                      className="h-full bg-[#4488ff] transition-all"
                      style={{ width: `${(employee.mp / employee.maxMp) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#888] mt-1 font-mono">
                    {employee.mp < 30 ? 'PANIC STATE' : employee.mp < 60 ? 'STRESSED' : 'STABLE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-[#1a1a1a] border border-[#444] p-3 text-center">
                <div className="text-[#ff6666] text-xs mb-1 font-mono">FORTITUDE</div>
                <div className="text-white text-2xl font-mono">{employee.stats.fortitude}</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#444] p-3 text-center">
                <div className="text-[#66ff66] text-xs mb-1 font-mono">PRUDENCE</div>
                <div className="text-white text-2xl font-mono">{employee.stats.prudence}</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#444] p-3 text-center">
                <div className="text-[#6666ff] text-xs mb-1 font-mono">TEMPERANCE</div>
                <div className="text-white text-2xl font-mono">{employee.stats.temperance}</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#444] p-3 text-center">
                <div className="text-[#ffff66] text-xs mb-1 font-mono">JUSTICE</div>
                <div className="text-white text-2xl font-mono">{employee.stats.justice}</div>
              </div>
            </div>

            {/* Favored Unit */}
            {employee.favoredUnit && (
              <div className="bg-[#2a2a1a] border border-[#ffaa00] p-3 mb-6">
                <div className="text-[10px] text-[#888] mb-1 font-mono">FAVORED CONTAINMENT UNIT</div>
                <div className="text-[#ffaa00] font-mono">{employee.favoredUnit}</div>
                <div className="text-[9px] text-[#888] mt-1 font-mono">
                  +20% Qliphoth recovery when working on this unit
                </div>
              </div>
            )}
          </div>

          {/* Type Selection */}
          <div className="mb-6">
            <h3 className="text-white mb-3 pb-2 border-b border-[#333] font-mono">
              EMPLOYEE TYPE
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateType(employee.id, 'Research')}
                disabled={employee.status !== 'idle'}
                className={`p-4 border-2 transition-colors ${
                  employee.type === 'Research'
                    ? 'bg-[#1a3a3a] border-[#66ffff]'
                    : 'bg-[#1a1a1a] border-[#444] hover:border-[#888]'
                } ${employee.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Brain className="w-6 h-6 text-[#66ffff] mx-auto mb-2" />
                <div className="text-white font-mono text-sm mb-1">Research</div>
                <div className="text-[10px] text-[#888] font-mono">
                  Perform work on containment units
                </div>
              </button>
              <button
                onClick={() => onUpdateType(employee.id, 'Breach Protocol')}
                disabled={employee.status !== 'idle'}
                className={`p-4 border-2 transition-colors ${
                  employee.type === 'Breach Protocol'
                    ? 'bg-[#3a1a1a] border-[#ff6666]'
                    : 'bg-[#1a1a1a] border-[#444] hover:border-[#888]'
                } ${employee.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Heart className="w-6 h-6 text-[#ff6666] mx-auto mb-2" />
                <div className="text-white font-mono text-sm mb-1">Breach Protocol</div>
                <div className="text-[10px] text-[#888] font-mono">
                  Suppress breached containments
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-white mb-3 pb-2 border-b border-[#333] font-mono">
              ACTIONS
            </h3>
            
            {canRecall ? (
              <button
                onClick={() => onRecall(employee.id)}
                className="w-full bg-[#1a1a1a] border-2 border-[#4488ff] hover:border-[#66ff66] p-4 transition-colors mb-3"
              >
                <ArrowLeft className="w-6 h-6 text-[#4488ff] mx-auto mb-2" />
                <div className="text-white font-mono mb-1">Recall Employee</div>
                <div className="text-[10px] text-[#888] font-mono">
                  Stop recovery and return to duty
                </div>
              </button>
            ) : canChangeStatus ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSendToWellness(employee.id)}
                  disabled={employee.status === 'working'}
                  className="bg-[#1a1a1a] border-2 border-[#444] hover:border-[#66ffff] p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="w-6 h-6 text-[#66ffff] mx-auto mb-2" />
                  <div className="text-white font-mono text-sm mb-1">Wellness</div>
                  <div className="text-[10px] text-[#888] font-mono">
                    Restore MP over time
                  </div>
                </button>
                <button
                  onClick={() => onSendToMedical(employee.id)}
                  disabled={employee.status === 'working'}
                  className="bg-[#1a1a1a] border-2 border-[#444] hover:border-[#ff9933] p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HeartPulse className="w-6 h-6 text-[#ff9933] mx-auto mb-2" />
                  <div className="text-white font-mono text-sm mb-1">Medical</div>
                  <div className="text-[10px] text-[#888] font-mono">
                    Restore HP over time
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-[#2a2a2a] border border-[#666] p-6 text-center">
                <div className="text-[#888] font-mono">
                  EMPLOYEE CURRENTLY UNAVAILABLE
                </div>
                <div className="text-[10px] text-[#666] mt-2 font-mono">
                  Status: {employee.status.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
