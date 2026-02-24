import { AlertTriangle, Info, XCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  time: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-[#4a1a1a]',
          border: 'border-[#ff3333]',
          text: 'text-[#ff6666]',
          icon: <XCircle className="w-4 h-4" />
        };
      case 'warning':
        return {
          bg: 'bg-[#4a3a1a]',
          border: 'border-[#ff9933]',
          text: 'text-[#ffaa66]',
          icon: <AlertTriangle className="w-4 h-4" />
        };
      case 'info':
        return {
          bg: 'bg-[#1a2a3a]',
          border: 'border-[#4488ff]',
          text: 'text-[#6699ff]',
          icon: <Info className="w-4 h-4" />
        };
    }
  };

  return (
    <div className="bg-[#0a0a0a] border-2 border-[#444] p-3">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#333]">
        <AlertTriangle className="w-5 h-5 text-[#ff6666]" />
        <h3 className="text-white font-mono">ALERT LOG</h3>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-[#666] text-sm font-mono text-center py-4">
            NO ACTIVE ALERTS
          </div>
        ) : (
          alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <div
                key={alert.id}
                className={`${style.bg} border ${style.border} p-2 flex items-start gap-2`}
              >
                <div className={style.text}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-[11px] ${style.text} font-mono`}>
                    {alert.message}
                  </div>
                  <div className="text-[9px] text-[#666] mt-1 font-mono">
                    {alert.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
