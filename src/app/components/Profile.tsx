import profileImage from "figma:asset/5d139eb05029132ec988ef131574a550aab6234e.png";

export function Profile() {
  return (
    <div className="bg-[#1a1a1a] border-2 border-[#444] p-4 sm:p-6">
      <div className="mb-6 pb-3 border-b border-[#333]">
        <h2 className="text-xl sm:text-2xl text-white mb-2">CREATOR PROFILE</h2>
        <div className="text-xs sm:text-sm text-[#666]">SYSTEM ADMINISTRATOR DOSSIER</div>
      </div>
      
      <div className="space-y-6">
        {/* Profile Image and Personal/Project Info Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Container */}
          <div className="flex-shrink-0">
            <div className="w-full md:w-64 lg:w-80 h-64 md:h-full bg-[#0a0a0a] border-2 border-[#444] overflow-hidden">
              <img 
                src={profileImage} 
                alt="Administrator Profile" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          
          {/* Personal Info and Project Details */}
          <div className="flex-1 space-y-6">
            {/* Personal Info */}
            <div className="bg-[#0a0a0a] border border-[#333] p-4">
              <div className="text-[10px] text-[#888] mb-3 tracking-wider">IDENTIFICATION</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888]">Name:</span>
                  <span className="text-white">Fama, Alijah Miguel V.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Clearance Level:</span>
                  <span className="text-[#66ffff]">◻️◻️◻️◻️◻️</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Role:</span>
                  <span className="text-white">Administrator</span>
                </div>
              </div>
            </div>
            
            {/* Project Info */}
            <div className="bg-[#0a0a0a] border border-[#333] p-4">
              <div className="text-[10px] text-[#888] mb-3 tracking-wider">PROJECT DETAILS</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888]">System Name:</span>
                  <span className="text-white">Lobotomy Corporation UI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Version:</span>
                  <span className="text-[#66ff66]">v10000.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Framework:</span>
                  <span className="text-white">React + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Styling:</span>
                  <span className="text-white">Tailwind CSS v4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4">
          <div className="text-[10px] text-[#888] mb-3 tracking-wider">SYSTEM CAPABILITIES</div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Interactive containment management with time-based Qliphoth Counter depletion</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Employee behavior system with MP-based performance scaling</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Breach Protocol with team-based suppression mechanics</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Critical meltdown sequence with full system reboot</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">10 Sephirot managers from the game's lore</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Pause and Reset functionality with activity suspension</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#66ff66] mt-1">●</span>
              <span className="text-[#aaa]">Responsive design optimized for mobile and desktop</span>
            </div>
          </div>
        </div>
        
        {/* Status Message */}
        <div className="bg-[#1a1a1a] border-2 border-[#66ffff] p-4">
          <div className="text-xs sm:text-sm text-[#66ffff] mb-2">SYSTEM STATUS</div>
          <div className="text-sm text-white">
            All systems operating within normal parameters. The management interface is currently in 
            <span className="text-[#66ff66]"> VIEW MODE</span> while accessing the Profile tab.
            Time-sensitive operations are temporarily suspended.
          </div>
        </div>
        
        {/* Note */}
        <div className="text-center pt-4">
          <div className="text-xs text-[#666]">
            This system was built as a tribute to Project Moon's Lobotomy Corporation.
          </div>
          <div className="text-[10px] text-[#555] mt-2">
            © All game references and lore belong to Project Moon
          </div>
        </div>
      </div>
    </div>
  );
}