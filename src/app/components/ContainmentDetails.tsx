import { X, Heart, Brain, Shield, Scale, AlertTriangle, Star } from 'lucide-react';
import { useState } from 'react';
import type { Employee, ContainmentUnitType } from '../App';

interface ContainmentDetailsProps {
  unit: ContainmentUnitType;
  employees: Employee[];
  onClose: () => void;
  onAssignEmployee: (employeeId: string, workType: string) => void;
}

export function ContainmentDetails({ unit, employees, onClose, onAssignEmployee }: ContainmentDetailsProps) {
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null);

  const riskColors = {
    ZAYIN: '#66ff66',
    TETH: '#66ffff',
    HE: '#ffff66',
    WAW: '#ff9933',
    ALEPH: '#ff3333'
  };

  const workTypes = [
    { name: 'Instinct', icon: <Heart className="w-4 h-4" />, stat: 'fortitude', color: '#ff6666' },
    { name: 'Insight', icon: <Brain className="w-4 h-4" />, stat: 'prudence', color: '#66ff66' },
    { name: 'Attachment', icon: <Shield className="w-4 h-4" />, stat: 'temperance', color: '#6666ff' },
    { name: 'Repression', icon: <Scale className="w-4 h-4" />, stat: 'justice', color: '#ffff66' }
  ];

  const availableEmployees = employees.filter(e => e.status === 'idle' && e.type === 'Research');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border-2 border-[#666] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b-2 border-[#444] p-4 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="px-2 py-1 border text-sm font-mono"
                style={{ 
                  borderColor: riskColors[unit.riskLevel],
                  color: riskColors[unit.riskLevel]
                }}
              >
                {unit.riskLevel}
              </div>
              <div className="text-[11px] text-[#888] font-mono">{unit.id}</div>
              {unit.status === 'breached' && (
                <AlertTriangle className="w-5 h-5 text-[#ff3333] animate-pulse" />
              )}
            </div>
            <h2 className="text-xl text-white font-mono">{unit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Containment Preview */}
          <div className="mb-6">
            <div className="h-48 bg-[#0d0d0d] border-2 border-[#333] flex items-center justify-center mb-4">
              <div className="text-9xl opacity-20">?</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-[11px] font-mono">
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[#888] mb-1">WORK COUNT</div>
                <div className="text-white text-lg">{unit.workCount}</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[#888] mb-1">STATUS</div>
                <div className={`text-lg ${
                  unit.status === 'breached' ? 'text-[#ff3333]' :
                  unit.status === 'working' ? 'text-[#4488ff]' :
                  'text-[#66ff66]'
                }`}>
                  {unit.status.toUpperCase()}
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[#888] mb-1">QLIPHOTH</div>
                <div className="h-3 bg-[#1a1a1a] border border-[#444] mt-2">
                  <div 
                    className={`h-full ${
                      unit.qliphothCounter > 60 ? 'bg-[#66ff66]' :
                      unit.qliphothCounter > 30 ? 'bg-[#ffff66]' :
                      'bg-[#ff6666]'
                    }`}
                    style={{ width: `${unit.qliphothCounter}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Type Selection */}
          <div className="mb-6">
            <h3 className="text-white mb-3 pb-2 border-b border-[#333] font-mono">
              SELECT WORK TYPE
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {workTypes.map((work) => (
                <button
                  key={work.name}
                  onClick={() => setSelectedWorkType(work.name)}
                  className={`bg-[#1a1a1a] border-2 ${
                    selectedWorkType === work.name ? 'border-[#66ff66]' : 'border-[#444] hover:border-[#888]'
                  } p-4 cursor-pointer transition-colors group`}
                >
                  <div className="flex items-center justify-center mb-2 transition-colors" style={{ 
                    color: selectedWorkType === work.name ? work.color : '#888'
                  }}>
                    {work.icon}
                  </div>
                  <div className="text-center text-sm text-white font-mono">
                    {work.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Employee Selection */}
          <div>
            <h3 className="text-white mb-3 pb-2 border-b border-[#333] font-mono">
              ASSIGN EMPLOYEE {selectedWorkType && `(${selectedWorkType})`}
            </h3>
            
            {unit.status === 'breached' ? (
              <div className="bg-[#4a1a1a] border border-[#ff3333] p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[#ff3333] mx-auto mb-2" />
                <div className="text-[#ff6666] font-mono">
                  CONTAINMENT BREACH - WORK ASSIGNMENT UNAVAILABLE
                </div>
              </div>
            ) : unit.status === 'working' ? (
              <div className="bg-[#1a2a3a] border border-[#4488ff] p-6 text-center">
                <div className="text-[#6699ff] font-mono">
                  WORK IN PROGRESS - PLEASE WAIT
                </div>
              </div>
            ) : !selectedWorkType ? (
              <div className="bg-[#2a2a2a] border border-[#666] p-6 text-center">
                <div className="text-[#888] font-mono">
                  PLEASE SELECT A WORK TYPE
                </div>
              </div>
            ) : availableEmployees.length === 0 ? (
              <div className="bg-[#2a2a2a] border border-[#666] p-6 text-center">
                <div className="text-[#888] font-mono">
                  NO AVAILABLE RESEARCH EMPLOYEES
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableEmployees.map((employee) => {
                  const isFavored = employee.favoredUnit === unit.id;
                  const isDisabled = employee.status === 'recovering';
                  return (
                    <button
                      key={employee.id}
                      onClick={() => onAssignEmployee(employee.id, selectedWorkType)}
                      className={`bg-[#1a1a1a] border-2 ${
                        isFavored ? 'border-[#ffaa00]' : 'border-[#444]'
                      } hover:border-[#66ff66] p-3 text-left transition-colors group relative`}
                    >
                      {isFavored && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-4 h-4 text-[#ffaa00] fill-[#ffaa00]" />
                        </div>
                      )}

                      {isDisabled && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ff3333] text-[8px] text-white font-mono">
                          RECOVERING
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-16 bg-[#0a0a0a] border border-[#555] flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-white mb-1 font-mono group-hover:text-[#66ff66] transition-colors">
                            {employee.name}
                          </div>
                          <div className="text-[10px] text-[#888] mb-2 font-mono">
                            {employee.id} | {employee.role}
                            {isFavored && <span className="text-[#ffaa00]"> ★ FAVORED</span>}
                          </div>
                          
                          {/* HP/MP Bars */}
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] text-[#888] w-6 font-mono">HP</span>
                              <div className="flex-1 h-1 bg-[#0a0a0a] border border-[#444]">
                                <div 
                                  className="h-full bg-[#ff4444]"
                                  style={{ width: `${(employee.hp / employee.maxHp) * 100}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-[#888] font-mono">
                                {Math.round(employee.hp)}/{employee.maxHp}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] text-[#888] w-6 font-mono">MP</span>
                              <div className="flex-1 h-1 bg-[#0a0a0a] border border-[#444]">
                                <div 
                                  className="h-full bg-[#4488ff]"
                                  style={{ width: `${(employee.mp / employee.maxMp) * 100}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-[#888] font-mono">
                                {Math.round(employee.mp)}/{employee.maxMp}
                              </span>
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-1 text-[8px] font-mono">
                            <div className="text-center">
                              <div className="text-[#ff6666]">FOR</div>
                              <div className="text-white">{employee.stats.fortitude}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[#66ff66]">PRU</div>
                              <div className="text-white">{employee.stats.prudence}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[#6666ff]">TEM</div>
                              <div className="text-white">{employee.stats.temperance}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[#ffff66]">JUS</div>
                              <div className="text-white">{employee.stats.justice}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}