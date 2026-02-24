import { useState, useEffect } from 'react';
import { EmployeeCard } from './components/EmployeeCard';
import { ContainmentUnit } from './components/ContainmentUnit';
import { AlertPanel } from './components/AlertPanel';
import { StatusBar } from './components/StatusBar';
import { ContainmentDetails } from './components/ContainmentDetails';
import { EmployeeDetails } from './components/EmployeeDetails';
import { BreachProtocol } from './components/BreachProtocol';
import { ManagerCard } from './components/ManagerCard';
import { Profile } from './components/Profile';
import { Users, Box, AlertTriangle, UserCog, User } from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  role: string;
  type: 'Research' | 'Breach Protocol';
  favoredUnit?: string;
  stats: {
    fortitude: number;
    prudence: number;
    temperance: number;
    justice: number;
  };
  status: 'idle' | 'working' | 'panic' | 'wellness' | 'medical' | 'repression';
  behavior: 'Calm' | 'Stressed' | 'Panic' | 'Unconscious';
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  disabledUntil?: number; // Timestamp when employee becomes available again
}

export interface ContainmentUnitType {
  id: string;
  name: string;
  riskLevel: 'ZAYIN' | 'TETH' | 'HE' | 'WAW' | 'ALEPH';
  status: 'contained' | 'working' | 'breached';
  workCount: number;
  qliphothCounter: number;
  maxQliphoth: number;
}

export interface Manager {
  id: string;
  name: string;
  department: string;
  color: string;
  status: 'active' | 'maintenance' | 'offline';
  efficiency: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  time: string;
  read?: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<'employees' | 'containment' | 'alerts' | 'managers' | 'profile'>('containment');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [breachProtocolUnit, setBreachProtocolUnit] = useState<string | null>(null);
  const [alertCounter, setAlertCounter] = useState(0);
  const [meltdownState, setMeltdownState] = useState<'normal' | 'critical' | 'rebooting'>('normal');
  const [rebootProgress, setRebootProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const createAlertId = () => {
    setAlertCounter(prev => prev + 1);
    return `A-${Date.now()}-${alertCounter}`;
  };
  
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'E-001', name: 'Agent Marcus', role: 'Control', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 3, prudence: 4, temperance: 2, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 87, maxHp: 100, mp: 65, maxMp: 80 },
    { id: 'E-002', name: 'Agent Sarah', role: 'Information', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 45, maxMp: 90 },
    { id: 'E-003', name: 'Agent Chen', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 3, temperance: 3, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 72, maxHp: 100, mp: 80, maxMp: 80 },
    { id: 'E-004', name: 'Agent Kim', role: 'Training', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 2, prudence: 2, temperance: 5, justice: 3 }, status: 'panic', behavior: 'Panic', hp: 34, maxHp: 100, mp: 12, maxMp: 85 },
    { id: 'E-005', name: 'Agent Rivers', role: 'Control', type: 'Research', favoredUnit: 'T-01-75', stats: { fortitude: 3, prudence: 3, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 90, maxHp: 100, mp: 70, maxMp: 85 },
    { id: 'E-006', name: 'Agent Nova', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 2, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 95, maxHp: 100, mp: 88, maxMp: 90 },
    { id: 'E-007', name: 'Agent Bloom', role: 'Information', type: 'Research', favoredUnit: 'F-05-52', stats: { fortitude: 2, prudence: 5, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 78, maxHp: 100, mp: 55, maxMp: 95 },
    { id: 'E-008', name: 'Agent Stone', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 75, maxMp: 80 },
    { id: 'E-009', name: 'Agent Luna', role: 'Training', type: 'Research', favoredUnit: 'O-02-56', stats: { fortitude: 3, prudence: 4, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 82, maxHp: 100, mp: 60, maxMp: 85 },
    { id: 'E-010', name: 'Agent Hawk', role: 'Control', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 4, prudence: 3, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 88, maxHp: 100, mp: 72, maxMp: 80 },
    { id: 'E-011', name: 'Agent Frost', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 2, temperance: 3, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 92, maxHp: 100, mp: 80, maxMp: 85 },
    { id: 'E-012', name: 'Agent Vale', role: 'Information', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 76, maxHp: 100, mp: 58, maxMp: 90 },
    { id: 'E-013', name: 'Agent Pierce', role: 'Training', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 3, prudence: 3, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 85, maxHp: 100, mp: 68, maxMp: 85 },
    { id: 'E-014', name: 'Agent Blaze', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 98, maxHp: 100, mp: 82, maxMp: 80 },
    { id: 'E-015', name: 'Agent Dawn', role: 'Control', type: 'Research', favoredUnit: 'F-05-52', stats: { fortitude: 3, prudence: 4, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 80, maxHp: 100, mp: 65, maxMp: 85 },
    { id: 'E-016', name: 'Agent Raven', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 2, temperance: 3, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 94, maxHp: 100, mp: 78, maxMp: 80 },
    { id: 'E-017', name: 'Agent Sky', role: 'Information', type: 'Research', favoredUnit: 'T-01-75', stats: { fortitude: 2, prudence: 5, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 74, maxHp: 100, mp: 52, maxMp: 95 },
    { id: 'E-018', name: 'Agent Wolf', role: 'Training', type: 'Research', favoredUnit: 'O-02-56', stats: { fortitude: 4, prudence: 3, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 86, maxHp: 100, mp: 70, maxMp: 85 },
    { id: 'E-019', name: 'Agent Storm', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 85, maxMp: 85 },
    { id: 'E-020', name: 'Agent Echo', role: 'Control', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 3, prudence: 4, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 88, maxHp: 100, mp: 66, maxMp: 80 },
    { id: 'E-021', name: 'Agent Sage', role: 'Information', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 79, maxHp: 100, mp: 54, maxMp: 90 },
    { id: 'E-022', name: 'Agent Titan', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 2, temperance: 3, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 96, maxHp: 100, mp: 80, maxMp: 80 },
    { id: 'E-023', name: 'Agent Willow', role: 'Training', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 3, prudence: 3, temperance: 5, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 83, maxHp: 100, mp: 62, maxMp: 85 },
    { id: 'E-024', name: 'Agent Viper', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 3, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 91, maxHp: 100, mp: 76, maxMp: 80 }
  ]);

  const [containmentUnits, setContainmentUnits] = useState<ContainmentUnitType[]>([
    { id: 'O-01-23', name: 'One Sin and Hundreds of Good Deeds', riskLevel: 'ZAYIN', status: 'contained', workCount: 12, qliphothCounter: 100, maxQliphoth: 100 },
    { id: 'T-02-43', name: 'Fragment of the Universe', riskLevel: 'HE', status: 'contained', workCount: 7, qliphothCounter: 100, maxQliphoth: 100 },
    { id: 'F-01-69', name: 'Beauty and the Beast', riskLevel: 'WAW', status: 'contained', workCount: 3, qliphothCounter: 100, maxQliphoth: 100 },
    { id: 'O-02-56', name: 'Funeral of the Dead Butterflies', riskLevel: 'HE', status: 'contained', workCount: 15, qliphothCounter: 100, maxQliphoth: 100 },
    { id: 'T-01-75', name: 'Mountain of Smiling Bodies', riskLevel: 'ALEPH', status: 'contained', workCount: 1, qliphothCounter: 100, maxQliphoth: 100 },
    { id: 'F-05-52', name: 'Opened Can of WellCheers', riskLevel: 'TETH', status: 'contained', workCount: 9, qliphothCounter: 100, maxQliphoth: 100 }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'A-003', type: 'info' as const, message: 'All systems operational', time: new Date().toLocaleTimeString() }
  ]);

  const [managers, setManagers] = useState<Manager[]>([
    { id: 'M-001', name: 'Malkuth', department: 'Control Team', color: '#ff9933', status: 'active', efficiency: 95 },
    { id: 'M-002', name: 'Yesod', department: 'Information Team', color: '#9966ff', status: 'active', efficiency: 88 },
    { id: 'M-003', name: 'Netzach', department: 'Safety Team', color: '#66ff66', status: 'maintenance', efficiency: 62 },
    { id: 'M-004', name: 'Hod', department: 'Training Team', color: '#ffff66', status: 'active', efficiency: 91 },
    { id: 'M-005', name: 'Tiphereth A', department: 'Central Command Unit', color: '#66ffff', status: 'active', efficiency: 97 },
    { id: 'M-006', name: 'Tiphereth B', department: 'Central Command Unit', color: '#66ccff', status: 'active', efficiency: 97 },
    { id: 'M-007', name: 'Gebura', department: 'Disciplinary Team', color: '#ff3333', status: 'active', efficiency: 99 },
    { id: 'M-008', name: 'Chesed', department: 'Welfare Team', color: '#6699ff', status: 'active', efficiency: 85 },
    { id: 'M-009', name: 'Hokma', department: 'Records Team', color: '#cccccc', status: 'active', efficiency: 93 },
    { id: 'M-010', name: 'Binah', department: 'Extraction Team', color: '#000000', status: 'active', efficiency: 100 }
  ]);

  // Qliphoth Counter depletion
  useEffect(() => {
    if (isPaused || activeTab === 'profile') return;
    
    const interval = setInterval(() => {
      setContainmentUnits(prev => prev.map(unit => {
        if (unit.status === 'breached' || unit.status === 'working') return unit;

        let newCounter = unit.qliphothCounter;
        
        if (unit.riskLevel === 'TETH') {
          // Depletes over 5 minutes (300 seconds)
          newCounter = Math.max(0, unit.qliphothCounter - (100 / 300));
        } else if (unit.riskLevel === 'HE') {
          // Depletes over 4 minutes (240 seconds)
          newCounter = Math.max(0, unit.qliphothCounter - (100 / 240));
        } else if (unit.riskLevel === 'WAW' || unit.riskLevel === 'ALEPH') {
          // Random depletion every 10-20 seconds
          const shouldDeplete = Math.random() < 0.05; // ~5% chance per second
          if (shouldDeplete) {
            const depletion = 15 + Math.random() * 5; // 15-20%
            newCounter = Math.max(0, unit.qliphothCounter - depletion);
          }
        }

        // Check if breached
        if (newCounter <= 0 && unit.status !== 'breached') {
          setAlerts(prev => [{
            id: `A-${Date.now()}-${Math.random()}`,
            type: 'danger' as const,
            message: `CONTAINMENT BREACH: ${unit.id} - ${unit.name}`,
            time: new Date().toLocaleTimeString()
          }, ...prev]);
          
          return { ...unit, qliphothCounter: 0, status: 'breached' as const };
        }

        return { ...unit, qliphothCounter: newCounter };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, activeTab]);

  // Employee recovery (Wellness and Medical)
  useEffect(() => {
    if (isPaused || activeTab === 'profile') return;
    
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        if (emp.status === 'wellness') {
          const newMp = Math.min(emp.maxMp, emp.mp + 1);
          const newStatus = newMp >= emp.maxMp && emp.hp > 50 ? 'idle' as const : emp.status;
          return { ...emp, mp: newMp, status: newStatus };
        }
        if (emp.status === 'medical') {
          const newHp = Math.min(emp.maxHp, emp.hp + 0.5);
          const newStatus = newHp >= emp.maxHp ? 'idle' as const : emp.status;
          return { ...emp, hp: newHp, status: newStatus };
        }
        return emp;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, activeTab]);

  // Update employee behavior based on MP and handle critical MP levels
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        const currentTime = Date.now();
        
        // Check if employee is disabled and should be re-enabled
        if (emp.disabledUntil && currentTime >= emp.disabledUntil) {
          return { ...emp, disabledUntil: undefined };
        }
        
        const mpPercent = (emp.mp / emp.maxMp) * 100;
        let newBehavior = emp.behavior;
        let newHp = emp.hp;
        let newStatus = emp.status;
        let disabledUntil = emp.disabledUntil;

        // At 0% MP, HP drops to zero
        if (emp.mp <= 0) {
          newBehavior = 'Unconscious';
          if (emp.hp > 0) {
            newHp = 0;
            newStatus = 'idle';
            disabledUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
            setAlerts(prev => [{
              id: `A-${Date.now()}-${Math.random()}`,
              type: 'danger' as const,
              message: `${emp.name} lost consciousness - recovering for 5 minutes`,
              time: new Date().toLocaleTimeString()
            }, ...prev]);
          }
        } else {
          // Determine behavior based on MP
          if (mpPercent >= 70) {
            newBehavior = 'Calm';
          } else if (mpPercent >= 25) {
            newBehavior = 'Stressed';
          } else if (mpPercent > 0) {
            newBehavior = 'Panic';
            
            // Probability of HP dropping to zero at 5% to 1% MP
            if (mpPercent <= 5 && emp.hp > 0) {
              // Probability increases as MP gets lower: 50% at 1% MP, 10% at 5% MP
              const probability = 0.5 - (mpPercent - 1) * 0.1;
              const roll = Math.random();
              
              if (roll < probability * 0.01) { // Multiply by 0.01 since this runs every second
                newHp = 0;
                newStatus = 'idle';
                disabledUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
                setAlerts(prev => [{
                  id: `A-${Date.now()}-${Math.random()}`,
                  type: 'danger' as const,
                  message: `${emp.name} collapsed from mental strain - recovering for 5 minutes`,
                  time: new Date().toLocaleTimeString()
                }, ...prev]);
              }
            }
          }
        }

        return { 
          ...emp, 
          behavior: newBehavior, 
          hp: newHp, 
          status: newStatus,
          disabledUntil 
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleAssignEmployee = (employeeId: string, workType: string) => {
    if (!selectedUnit) return;
    
    const employee = employees.find(e => e.id === employeeId);
    const unit = containmentUnits.find(u => u.id === selectedUnit);
    
    if (!employee || !unit) return;

    // Check if employee is disabled
    if (employee.disabledUntil && Date.now() < employee.disabledUntil) {
      setAlerts(prev => [{
        id: createAlertId(),
        type: 'warning' as const,
        message: `${employee.name} is still recovering and cannot be assigned`,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
      return;
    }

    // Update employee status
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status: 'working' as const } : emp
    ));

    // Calculate success rate based on behavior
    let successRate = 1.0;
    if (employee.behavior === 'Stressed') {
      successRate = 0.7; // 30% penalty
    } else if (employee.behavior === 'Panic') {
      successRate = 0.4; // 60% penalty
    }

    const isSuccess = Math.random() < successRate;

    // Replenish Qliphoth Counter
    const baseReplenish = 30;
    const bonusReplenish = employee.favoredUnit === selectedUnit ? 20 : 0;
    const totalReplenish = isSuccess ? baseReplenish + bonusReplenish : Math.floor((baseReplenish + bonusReplenish) * 0.5);

    setContainmentUnits(prev => prev.map(u => {
      if (u.id === selectedUnit) {
        const newCounter = Math.min(100, u.qliphothCounter + totalReplenish);
        return { 
          ...u, 
          qliphothCounter: newCounter,
          status: 'working' as const,
          workCount: u.workCount + 1
        };
      }
      return u;
    }));

    // Add alert
    const performanceNote = isSuccess ? '' : ' - REDUCED EFFECTIVENESS';
    setAlerts(prev => [{
      id: `A-${Date.now()}-${Math.random()}`,
      type: isSuccess ? 'info' as const : 'warning' as const,
      message: `${employee.name} assigned to ${unit.id} (${workType})${bonusReplenish > 0 ? ' - FAVORED UNIT BONUS!' : ''}${performanceNote}`,
      time: new Date().toLocaleTimeString()
    }, ...prev]);

    // Simulate work completion after 5 seconds
    setTimeout(() => {
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { ...emp, status: 'idle' as const, mp: Math.max(0, emp.mp - 10) } : emp
      ));
      
      setContainmentUnits(prev => prev.map(u => 
        u.id === selectedUnit ? { ...u, status: 'contained' as const } : u
      ));
    }, 5000);

    setSelectedUnit(null);
  };

  const handleUpdateEmployeeType = (employeeId: string, newType: 'Research' | 'Breach Protocol') => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, type: newType } : emp
    ));
  };

  const handleSendToWellness = (employeeId: string) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, status: 'wellness' as const } : emp
    ));
    setAlerts(prev => [{
      id: createAlertId(),
      type: 'info' as const,
      message: `${employees.find(e => e.id === employeeId)?.name} sent to Wellness`,
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const handleSendToMedical = (employeeId: string) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, status: 'medical' as const } : emp
    ));
    setAlerts(prev => [{
      id: createAlertId(),
      type: 'info' as const,
      message: `${employees.find(e => e.id === employeeId)?.name} sent to Medical`,
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const handleRecallEmployee = (employeeId: string) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, status: 'idle' as const } : emp
    ));
  };

  const handleDeployBreachProtocol = (employeeIds: string[]) => {
    if (!breachProtocolUnit) return;

    const unit = containmentUnits.find(u => u.id === breachProtocolUnit);
    if (!unit) return;

    // Check if any employees are disabled
    const deployedEmployees = employees.filter(e => employeeIds.includes(e.id));
    const disabledEmployees = deployedEmployees.filter(e => e.disabledUntil && Date.now() < e.disabledUntil);
    
    if (disabledEmployees.length > 0) {
      setAlerts(prev => [{
        id: `A-${Date.now()}-${Math.random()}`,
        type: 'warning' as const,
        message: `Some employees are still recovering and cannot be deployed`,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
      return;
    }

    // Calculate success rate: 30% base + 15% per additional employee
    let baseSuccessRate = 30 + (employeeIds.length - 1) * 15;
    
    // Apply behavior penalties
    let behaviorPenalty = 0;
    deployedEmployees.forEach(emp => {
      if (emp.behavior === 'Stressed') {
        behaviorPenalty += 10; // 10% penalty per stressed employee
      } else if (emp.behavior === 'Panic') {
        behaviorPenalty += 20; // 20% penalty per panicked employee
      }
    });
    
    const finalSuccessRate = Math.max(5, baseSuccessRate - behaviorPenalty);
    const isSuccess = Math.random() * 100 < finalSuccessRate;

    // Update employees
    setEmployees(prev => prev.map(emp =>
      employeeIds.includes(emp.id) ? { ...emp, status: 'repression' as const } : emp
    ));

    // Simulate repression
    setTimeout(() => {
      if (isSuccess) {
        setContainmentUnits(prev => prev.map(u =>
          u.id === breachProtocolUnit ? { ...u, status: 'contained' as const, qliphothCounter: 100 } : u
        ));
        setAlerts(prev => [{
          id: `A-${Date.now()}-${Math.random()}`,
          type: 'info' as const,
          message: `REPRESSION SUCCESS: ${unit.id} contained`,
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      } else {
        setAlerts(prev => [{
          id: `A-${Date.now()}-${Math.random()}`,
          type: 'danger' as const,
          message: `REPRESSION FAILED: ${unit.id} remains breached`,
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      }

      // Return employees to idle with HP/MP depletion
      setEmployees(prev => prev.map(emp => {
        if (employeeIds.includes(emp.id)) {
          const hpLoss = isSuccess ? 15 : 22.5; // 1.5x damage on failure
          const mpLoss = 20;
          const newHp = Math.max(0, emp.hp - hpLoss);
          const newMp = Math.max(0, emp.mp - mpLoss);
          
          let disabledUntil = emp.disabledUntil;
          if (newHp <= 0) {
            disabledUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
            setAlerts(prev => [{
              id: `A-${Date.now()}-${Math.random()}`,
              type: 'danger' as const,
              message: `${emp.name} was critically injured during repression - recovering for 5 minutes`,
              time: new Date().toLocaleTimeString()
            }, ...prev]);
          }
          
          return { 
            ...emp, 
            status: 'idle' as const,
            hp: newHp,
            mp: newMp,
            disabledUntil
          };
        }
        return emp;
      }));
    }, 8000);

    setBreachProtocolUnit(null);
  };

  const currentUnit = containmentUnits.find(u => u.id === selectedUnit);
  const currentEmployee = employees.find(e => e.id === selectedEmployee);
  const breachedUnit = containmentUnits.find(u => u.id === breachProtocolUnit);

  const activeAlerts = alerts.filter(a => !a.read && (a.type === 'danger' || a.type === 'warning')).length;

  // Mark alerts as read when viewing the Alerts tab
  useEffect(() => {
    if (activeTab === 'alerts') {
      setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    }
  }, [activeTab]);

  // Meltdown system
  const meltdownLevel = containmentUnits.filter(u => u.status === 'breached').length * 20;

  useEffect(() => {
    if (meltdownLevel >= 100 && meltdownState === 'normal') {
      setMeltdownState('critical');
      
      // After 5 seconds, start reboot
      setTimeout(() => {
        setMeltdownState('rebooting');
        
        // Reboot animation progress
        const rebootInterval = setInterval(() => {
          setRebootProgress(prev => {
            if (prev >= 100) {
              clearInterval(rebootInterval);
              // Reset everything
              setTimeout(() => {
                resetToInitialState();
              }, 500);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
      }, 5000);
    }
  }, [meltdownLevel, meltdownState]);

  const resetToInitialState = () => {
    setEmployees([
      { id: 'E-001', name: 'Agent Marcus', role: 'Control', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 3, prudence: 4, temperance: 2, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 87, maxHp: 100, mp: 65, maxMp: 80 },
      { id: 'E-002', name: 'Agent Sarah', role: 'Information', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 45, maxMp: 90 },
      { id: 'E-003', name: 'Agent Chen', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 3, temperance: 3, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 72, maxHp: 100, mp: 80, maxMp: 80 },
      { id: 'E-004', name: 'Agent Kim', role: 'Training', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 2, prudence: 2, temperance: 5, justice: 3 }, status: 'panic', behavior: 'Panic', hp: 34, maxHp: 100, mp: 12, maxMp: 85 },
      { id: 'E-005', name: 'Agent Rivers', role: 'Control', type: 'Research', favoredUnit: 'T-01-75', stats: { fortitude: 3, prudence: 3, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 90, maxHp: 100, mp: 70, maxMp: 85 },
      { id: 'E-006', name: 'Agent Nova', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 2, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 95, maxHp: 100, mp: 88, maxMp: 90 },
      { id: 'E-007', name: 'Agent Bloom', role: 'Information', type: 'Research', favoredUnit: 'F-05-52', stats: { fortitude: 2, prudence: 5, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 78, maxHp: 100, mp: 55, maxMp: 95 },
      { id: 'E-008', name: 'Agent Stone', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 75, maxMp: 80 },
      { id: 'E-009', name: 'Agent Luna', role: 'Training', type: 'Research', favoredUnit: 'O-02-56', stats: { fortitude: 3, prudence: 4, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 82, maxHp: 100, mp: 60, maxMp: 85 },
      { id: 'E-010', name: 'Agent Hawk', role: 'Control', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 4, prudence: 3, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 88, maxHp: 100, mp: 72, maxMp: 80 },
      { id: 'E-011', name: 'Agent Frost', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 2, temperance: 3, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 92, maxHp: 100, mp: 80, maxMp: 85 },
      { id: 'E-012', name: 'Agent Vale', role: 'Information', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 76, maxHp: 100, mp: 58, maxMp: 90 },
      { id: 'E-013', name: 'Agent Pierce', role: 'Training', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 3, prudence: 3, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 85, maxHp: 100, mp: 68, maxMp: 85 },
      { id: 'E-014', name: 'Agent Blaze', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 98, maxHp: 100, mp: 82, maxMp: 80 },
      { id: 'E-015', name: 'Agent Dawn', role: 'Control', type: 'Research', favoredUnit: 'F-05-52', stats: { fortitude: 3, prudence: 4, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 80, maxHp: 100, mp: 65, maxMp: 85 },
      { id: 'E-016', name: 'Agent Raven', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 2, temperance: 3, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 94, maxHp: 100, mp: 78, maxMp: 80 },
      { id: 'E-017', name: 'Agent Sky', role: 'Information', type: 'Research', favoredUnit: 'T-01-75', stats: { fortitude: 2, prudence: 5, temperance: 3, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 74, maxHp: 100, mp: 52, maxMp: 95 },
      { id: 'E-018', name: 'Agent Wolf', role: 'Training', type: 'Research', favoredUnit: 'O-02-56', stats: { fortitude: 4, prudence: 3, temperance: 4, justice: 3 }, status: 'idle', behavior: 'Calm', hp: 86, maxHp: 100, mp: 70, maxMp: 85 },
      { id: 'E-019', name: 'Agent Storm', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 3, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 100, maxHp: 100, mp: 85, maxMp: 85 },
      { id: 'E-020', name: 'Agent Echo', role: 'Control', type: 'Research', favoredUnit: 'T-02-43', stats: { fortitude: 3, prudence: 4, temperance: 3, justice: 3 }, status: 'idle', behavior: 'Stressed', hp: 88, maxHp: 100, mp: 66, maxMp: 80 },
      { id: 'E-021', name: 'Agent Sage', role: 'Information', type: 'Research', favoredUnit: 'F-01-69', stats: { fortitude: 2, prudence: 5, temperance: 4, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 79, maxHp: 100, mp: 54, maxMp: 90 },
      { id: 'E-022', name: 'Agent Titan', role: 'Safety', type: 'Breach Protocol', stats: { fortitude: 5, prudence: 2, temperance: 3, justice: 4 }, status: 'idle', behavior: 'Calm', hp: 96, maxHp: 100, mp: 80, maxMp: 80 },
      { id: 'E-023', name: 'Agent Willow', role: 'Training', type: 'Research', favoredUnit: 'O-01-23', stats: { fortitude: 3, prudence: 3, temperance: 5, justice: 2 }, status: 'idle', behavior: 'Stressed', hp: 83, maxHp: 100, mp: 62, maxMp: 85 },
      { id: 'E-024', name: 'Agent Viper', role: 'Security', type: 'Breach Protocol', stats: { fortitude: 4, prudence: 3, temperance: 2, justice: 5 }, status: 'idle', behavior: 'Calm', hp: 91, maxHp: 100, mp: 76, maxMp: 80 }
    ]);
    
    setContainmentUnits([
      { id: 'O-01-23', name: 'One Sin and Hundreds of Good Deeds', riskLevel: 'ZAYIN', status: 'contained', workCount: 12, qliphothCounter: 100, maxQliphoth: 100 },
      { id: 'T-02-43', name: 'Fragment of the Universe', riskLevel: 'HE', status: 'contained', workCount: 7, qliphothCounter: 100, maxQliphoth: 100 },
      { id: 'F-01-69', name: 'Beauty and the Beast', riskLevel: 'WAW', status: 'contained', workCount: 3, qliphothCounter: 100, maxQliphoth: 100 },
      { id: 'O-02-56', name: 'Funeral of the Dead Butterflies', riskLevel: 'HE', status: 'contained', workCount: 15, qliphothCounter: 100, maxQliphoth: 100 },
      { id: 'T-01-75', name: 'Mountain of Smiling Bodies', riskLevel: 'ALEPH', status: 'contained', workCount: 1, qliphothCounter: 100, maxQliphoth: 100 },
      { id: 'F-05-52', name: 'Opened Can of WellCheers', riskLevel: 'TETH', status: 'contained', workCount: 9, qliphothCounter: 100, maxQliphoth: 100 }
    ]);
    
    setAlerts([
      { id: 'A-003', type: 'info' as const, message: 'All systems operational', time: new Date().toLocaleTimeString() }
    ]);
    
    setMeltdownState('normal');
    setRebootProgress(0);
    setSelectedUnit(null);
    setSelectedEmployee(null);
    setBreachProtocolUnit(null);
    setIsPaused(false);
  };

  const handleReset = () => {
    setMeltdownState('rebooting');
    setRebootProgress(0);
    
    // Reboot animation progress
    const rebootInterval = setInterval(() => {
      setRebootProgress(prev => {
        if (prev >= 100) {
          clearInterval(rebootInterval);
          // Reset everything
          setTimeout(() => {
            resetToInitialState();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-mono">
      {/* Pause Overlay */}
      {isPaused && (
        <div 
          className="fixed inset-0 z-[9998] bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setIsPaused(false)}
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-[#ffff66] mb-4 animate-pulse">PAUSED</div>
            <div className="text-xl text-[#888]">ALL SYSTEMS SUSPENDED</div>
            <div className="text-sm text-[#666] mt-4">Click anywhere to resume</div>
          </div>
        </div>
      )}

      {/* Meltdown Critical Overlay */}
      {meltdownState === 'critical' && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-0 bg-red-900/60 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-8xl font-bold text-red-500 mb-4">CRITICAL</div>
              <div className="text-4xl text-white">MELTDOWN IMMINENT</div>
            </div>
          </div>
        </div>
      )}

      {/* Reboot Screen */}
      {meltdownState === 'rebooting' && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-4xl sm:text-6xl font-bold text-white mb-8">SYSTEM REBOOT</div>
            <div className="w-full max-w-96 mx-auto h-4 bg-[#1a1a1a] border-2 border-[#444] mb-4">
              <div 
                className="h-full bg-[#66ff66] transition-all duration-100"
                style={{ width: `${rebootProgress}%` }}
              />
            </div>
            <div className="text-2xl text-[#888] font-mono">{Math.round(rebootProgress)}%</div>
            <div className="text-sm text-[#666] mt-8 animate-pulse">
              REINITIALIZING ALL SYSTEMS...
            </div>
          </div>
        </div>
      )}

      <StatusBar 
        day={23}
        energy={487}
        maxEnergy={750}
        employeeCount={employees.length}
        activeAlerts={activeAlerts}
        meltdownLevel={meltdownLevel}
      />
      
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 flex flex-col lg:overflow-y-auto">
          {/* Header */}
          <div className="mb-4 pb-3 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <h1 className="text-lg sm:text-xl text-white mb-1">LOBOTOMY CORPORATION</h1>
              <div className="text-xs sm:text-sm text-[#888]">Management System v2.1</div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsPaused(!isPaused)}
                disabled={meltdownState !== 'normal'}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 font-mono text-xs sm:text-sm transition-colors ${
                  isPaused
                    ? 'bg-[#3a3a1a] border-[#ffff66] text-[#ffff66] hover:bg-[#4a4a2a]'
                    : 'bg-[#1a1a1a] border-[#66ff66] text-[#66ff66] hover:bg-[#2a2a2a] hover:border-[#88ff88]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPaused ? '▶ RESUME' : '❚❚ PAUSE'}
              </button>
              
              <button
                onClick={handleReset}
                disabled={meltdownState !== 'normal'}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#1a1a1a] border-2 border-[#ff6666] text-[#ff6666] hover:bg-[#2a1a1a] hover:border-[#ff8888] font-mono text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⟲ RESET
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-1 sm:gap-2 mb-4 overflow-x-auto flex-shrink-0">
            <button
              onClick={() => setActiveTab('containment')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-2 transition-colors whitespace-nowrap text-xs sm:text-base ${
                activeTab === 'containment'
                  ? 'bg-[#2a2a2a] border-[#ff6666] text-white'
                  : 'bg-[#1a1a1a] border-[#444] text-[#888] hover:border-[#666]'
              }`}
            >
              <Box className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">CONTAINMENT</span>
              <span className="sm:hidden">CONT</span>
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-2 transition-colors whitespace-nowrap text-xs sm:text-base ${
                activeTab === 'employees'
                  ? 'bg-[#2a2a2a] border-[#ff6666] text-white'
                  : 'bg-[#1a1a1a] border-[#444] text-[#888] hover:border-[#666]'
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">EMPLOYEES</span>
              <span className="sm:hidden">EMP</span>
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-2 transition-colors whitespace-nowrap text-xs sm:text-base ${
                activeTab === 'managers'
                  ? 'bg-[#2a2a2a] border-[#ff6666] text-white'
                  : 'bg-[#1a1a1a] border-[#444] text-[#888] hover:border-[#666]'
              }`}
            >
              <UserCog className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">MANAGERS</span>
              <span className="sm:hidden">MGR</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-2 transition-colors whitespace-nowrap text-xs sm:text-base ${
                activeTab === 'alerts'
                  ? 'bg-[#2a2a2a] border-[#ff6666] text-white'
                  : 'bg-[#1a1a1a] border-[#444] text-[#888] hover:border-[#666]'
              }`}
            >
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">ALERTS</span>
              <span className="sm:hidden">ALT</span>
              {activeAlerts > 0 && activeTab !== 'alerts' && (
                <span className="px-1.5 py-0.5 bg-[#ff3333] text-white text-[10px] rounded">
                  {activeAlerts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-2 transition-colors whitespace-nowrap text-xs sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-[#2a2a2a] border-[#ff6666] text-white'
                  : 'bg-[#1a1a1a] border-[#444] text-[#888] hover:border-[#666]'
              }`}
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">PROFILE</span>
              <span className="sm:hidden">PROF</span>
            </button>
          </div>
          
          {/* Content Area - Scrollable on mobile */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] lg:max-h-none">
            {activeTab === 'containment' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {containmentUnits.map((unit) => (
                  <ContainmentUnit 
                    key={unit.id} 
                    {...unit} 
                    onClick={() => unit.status === 'breached' ? setBreachProtocolUnit(unit.id) : setSelectedUnit(unit.id)}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'employees' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {employees.map((employee) => (
                  <EmployeeCard 
                    key={employee.id} 
                    {...employee} 
                    onClick={() => setSelectedEmployee(employee.id)}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'alerts' && (
              <div className="max-w-full sm:max-w-2xl">
                <AlertPanel alerts={alerts} />
              </div>
            )}
            
            {activeTab === 'managers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {managers.map((manager) => (
                  <ManagerCard key={manager.id} {...manager} />
                ))}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="w-full">
                <Profile />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - becomes bottom section on mobile */}
        <div className="w-full lg:w-80 bg-[#0a0a0a] border-t-2 lg:border-t-0 lg:border-l-2 border-[#444] p-3 sm:p-4 lg:overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm sm:text-base text-white mb-3 pb-2 border-b border-[#333]">QUICK STATUS</h3>
            
            <div className="space-y-3">
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[10px] text-[#888] mb-1">THREAT LEVEL</div>
                <div className={`text-2xl ${
                  containmentUnits.filter(u => u.status === 'breached').length === 0 ? 'text-[#66ff66]' :
                  containmentUnits.filter(u => u.status === 'breached').length <= 2 ? 'text-[#ffff66]' :
                  'text-[#ff3333]'
                }`}>
                  {containmentUnits.filter(u => u.status === 'breached').length === 0 ? 'LOW' :
                   containmentUnits.filter(u => u.status === 'breached').length <= 2 ? 'MODERATE' : 'CRITICAL'}
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[10px] text-[#888] mb-2">FACILITY STATUS</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#888]">Contained:</span>
                    <span className="text-[#66ff66]">
                      {containmentUnits.filter(u => u.status === 'contained').length}/{containmentUnits.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Breached:</span>
                    <span className="text-[#ff6666]">
                      {containmentUnits.filter(u => u.status === 'breached').length}/{containmentUnits.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Working:</span>
                    <span className="text-[#6699ff]">
                      {containmentUnits.filter(u => u.status === 'working').length}/{containmentUnits.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] border border-[#444] p-3">
                <div className="text-[10px] text-[#888] mb-2">EMPLOYEE STATUS</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#888]">Available:</span>
                    <span className="text-white">{employees.filter(e => e.status === 'idle').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Working:</span>
                    <span className="text-[#6699ff]">{employees.filter(e => e.status === 'working').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Wellness:</span>
                    <span className="text-[#66ffff]">{employees.filter(e => e.status === 'wellness').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Medical:</span>
                    <span className="text-[#ff9933]">{employees.filter(e => e.status === 'medical').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Critical:</span>
                    <span className="text-[#ff6666]">{employees.filter(e => e.status === 'panic').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base text-white mb-3 pb-2 border-b border-[#333]">RECENT ALERTS</h3>
            <AlertPanel alerts={alerts.slice(0, 5)} />
          </div>
        </div>
      </div>
      
      {/* Containment Details Modal */}
      {selectedUnit && currentUnit && (
        <ContainmentDetails
          unit={currentUnit}
          employees={employees.filter(e => e.type === 'Research')}
          onClose={() => setSelectedUnit(null)}
          onAssignEmployee={handleAssignEmployee}
        />
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && currentEmployee && (
        <EmployeeDetails
          employee={currentEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdateType={handleUpdateEmployeeType}
          onSendToWellness={handleSendToWellness}
          onSendToMedical={handleSendToMedical}
          onRecall={handleRecallEmployee}
        />
      )}

      {/* Breach Protocol Modal */}
      {breachProtocolUnit && breachedUnit && !isPaused && (
        <BreachProtocol
          unit={breachedUnit}
          employees={employees.filter(e => e.type === 'Breach Protocol')}
          onClose={() => setBreachProtocolUnit(null)}
          onDeploy={handleDeployBreachProtocol}
        />
      )}
    </div>
  );
}

export default App;