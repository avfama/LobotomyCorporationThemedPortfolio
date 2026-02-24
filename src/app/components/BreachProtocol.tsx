import { X, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Employee, ContainmentUnitType } from '../App';

interface BreachProtocolProps {
  unit: ContainmentUnitType;
  employees: Employee[];
  onClose: () => void;
  onDeploy: (employeeIds: string[]) => void;
}

export function BreachProtocol({ unit, employees, onClose, onDeploy }: BreachProtocolProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const availableEmployees = employees.filter(e => 
    e.status === 'idle' && e.type === 'Breach Protocol'
  );

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Success rate: 30% base + 15% per additional employee (max 5 employees)
  const successRate = Math.min(95, 30 + (selectedEmployees.length > 0 ? (selectedEmployees.length - 1) * 15 : 0));

  const riskColors = {
    ZAYIN: '#66ff66',
    TETH: '#66ffff',
    HE: '#ffff66',
    WAW: '#ff9933',
    ALEPH: '#ff3333'
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border-2 border-[#ff3333] max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-pulse">
        {/* Header */}
        <div className="bg-[#4a1a1a] border-b-2 border-[#ff3333] p-4 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-[#ff3333]" />
              <div className="text-xl text-[#ff6666] font-mono">BREACH PROTOCOL</div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="px-2 py-1 border text-sm font-mono"
                style={{ 
                  borderColor: riskColors[unit.riskLevel],
                  color: riskColors[unit.riskLevel]
                }}
              >
                {unit.riskLevel}
              </div>
              <div className="text-[11px] text-[#ff9999] font-mono">{unit.id}</div>
            </div>
            <h2 className="text-lg text-white font-mono mt-2">{unit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#ff6666] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Warning */}
          <div className="bg-[#3a1a1a] border-2 border-[#ff6666] p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#ff6666] flex-shrink-0 mt-1" />
              <div>
                <div className="text-white font-mono mb-2">CONTAINMENT BREACH DETECTED</div>
                <div className="text-[11px] text-[#ff9999] font-mono">
                  Deploy Breach Protocol team to suppress the anomaly. More agents increase success rate but risk casualties. Failed suppression attempts may result in severe injuries.
                </div>
              </div>
            </div>
          </div>

          {/* Success Rate Display */}
          <div className="mb-6">
            <div className="bg-[#1a1a1a] border-2 border-[#444] p-6">
              <div className="text-center mb-4">
                <div className="text-[11px] text-[#888] mb-2 font-mono">ESTIMATED SUCCESS RATE</div>
                <div className={`text-5xl font-mono ${
                  successRate < 40 ? 'text-[#ff3333]' :
                  successRate < 70 ? 'text-[#ffff66]' :
                  'text-[#66ff66]'
                }`}>
                  {selectedEmployees.length > 0 ? `${successRate}%` : '--'}
                </div>
              </div>
              
              {selectedEmployees.length > 0 && (
                <div className="h-4 bg-[#1a1a1a] border border-[#444]">
                  <div 
                    className={`h-full transition-all ${
                      successRate < 40 ? 'bg-[#ff3333]' :
                      successRate < 70 ? 'bg-[#ffff66]' :
                      'bg-[#66ff66]'
                    }`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              )}
              
              <div className="text-[10px] text-[#888] text-center mt-3 font-mono">
                Base: 30% | +15% per additional agent
              </div>
            </div>
          </div>

          {/* Employee Selection */}
          <div className="mb-6">
            <h3 className="text-white mb-3 pb-2 border-b border-[#333] font-mono">
              DEPLOY BREACH PROTOCOL TEAM ({selectedEmployees.length} selected)
            </h3>
            
            {availableEmployees.length === 0 ? (
              <div className="bg-[#2a2a2a] border border-[#666] p-6 text-center">
                <div className="text-[#888] font-mono">
                  NO AVAILABLE BREACH PROTOCOL EMPLOYEES
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableEmployees.map((employee) => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  const isDisabled = employee.status === 'recovering';
                  return (
                    <button
                      key={employee.id}
                      onClick={() => toggleEmployee(employee.id)}
                      className={`bg-[#1a1a1a] border-2 ${
                        isSelected ? 'border-[#ff6666] bg-[#2a1a1a]' : 'border-[#444] hover:border-[#888]'
                      } p-3 text-left transition-colors relative`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-[#ff6666]" />
                        </div>
                      )}

                      {isDisabled && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ff3333] text-[8px] text-white font-mono">
                          RECOVERING
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-16 bg-[#0a0a0a] border border-[#555] flex-shrink-0 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-[#ff6666]" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`mb-1 font-mono ${isSelected ? 'text-[#ff6666]' : 'text-white'}`}>
                            {employee.name}
                          </div>
                          <div className="text-[10px] text-[#888] mb-2 font-mono">
                            {employee.id} | {employee.role}
                          </div>
                          
                          {/* HP/MP Bars */}
                          <div className="space-y-1">
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
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deploy Button */}
          <button
            onClick={() => onDeploy(selectedEmployees)}
            disabled={selectedEmployees.length === 0}
            className="w-full bg-[#3a1a1a] border-2 border-[#ff6666] hover:bg-[#4a1a1a] p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="w-6 h-6 text-[#ff6666] mx-auto mb-2" />
            <div className="text-white font-mono mb-1">
              {selectedEmployees.length === 0 ? 'SELECT EMPLOYEES TO DEPLOY' : `DEPLOY ${selectedEmployees.length} AGENT${selectedEmployees.length > 1 ? 'S' : ''}`}
            </div>
            <div className="text-[10px] text-[#ff9999] font-mono">
              WARNING: Agents may suffer injuries or death
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}