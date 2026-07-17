import React from "react";
import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, Zap, FolderKanban, BarChart3, ArrowRight, Lock, Bell } from "lucide-react";

const features = [
  {
    title: "Multi-Tenant Workspaces",
    description: "Complete data isolation for every organization. Scalable, secure, and built for enterprise.",
    theme: {
      border: "border-purple-500/20 hover:border-purple-400/50",
      bg: "bg-[#0A0514]",
      glow: "from-purple-600/20",
      iconGradient: "from-purple-500 to-indigo-600",
      shadowColor: "purple-500/20",
      arrowBg: "border-purple-500/30 text-white hover:bg-purple-500/20"
    },
    icon: <Building2 className="w-6 h-6 text-white" />,
    illustration: (
      <div className="absolute -bottom-4 -left-4 w-full h-48 flex items-end justify-start pl-12 pb-4">
        <motion.div 
          animate={{ y: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative"
        >
          {/* Base Glow */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500/50 blur-md rounded-[100%]" />
          
          {/* Building 1 (Taller) */}
          <div className="relative w-16 h-32 bg-gradient-to-t from-indigo-900 to-purple-800 rounded-t-lg border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] z-10 flex flex-col p-2 gap-2">
            <div className="flex justify-around"><div className="w-3 h-4 bg-purple-400/40 rounded-sm shadow-[0_0_8px_rgba(192,132,252,0.6)]"/><div className="w-3 h-4 bg-purple-400/10 rounded-sm"/></div>
            <div className="flex justify-around"><div className="w-3 h-4 bg-purple-400/10 rounded-sm"/><div className="w-3 h-4 bg-purple-400/40 rounded-sm shadow-[0_0_8px_rgba(192,132,252,0.6)]"/></div>
            <div className="flex justify-around"><div className="w-3 h-4 bg-purple-400/40 rounded-sm shadow-[0_0_8px_rgba(192,132,252,0.6)]"/><div className="w-3 h-4 bg-purple-400/40 rounded-sm shadow-[0_0_8px_rgba(192,132,252,0.6)]"/></div>
          </div>
          
          {/* Building 2 (Shorter) */}
          <div className="absolute bottom-0 -right-10 w-12 h-20 bg-gradient-to-t from-indigo-950 to-purple-900 rounded-t-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] z-0 flex flex-col p-1.5 gap-1.5">
             <div className="flex justify-around"><div className="w-2.5 h-3 bg-purple-400/30 rounded-sm"/><div className="w-2.5 h-3 bg-purple-400/30 rounded-sm"/></div>
             <div className="flex justify-around"><div className="w-2.5 h-3 bg-purple-400/10 rounded-sm"/><div className="w-2.5 h-3 bg-purple-400/30 rounded-sm"/></div>
          </div>
          
          {/* Orbiting particles */}
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute -inset-10 border border-purple-500/20 rounded-full border-dashed" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute -inset-16 border border-indigo-500/10 rounded-[100%] border-dotted">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]" />
          </motion.div>
        </motion.div>
      </div>
    )
  },
  {
    title: "Role-Based Access",
    description: "Granular permissions and roles to ensure the right access for the right people.",
    theme: {
      border: "border-blue-500/20 hover:border-blue-400/50",
      bg: "bg-[#050A14]",
      glow: "from-blue-600/20",
      iconGradient: "from-blue-500 to-cyan-600",
      shadowColor: "blue-500/20",
      arrowBg: "border-blue-500/30 text-white hover:bg-blue-500/20"
    },
    icon: <Users className="w-6 h-6 text-white" />,
    illustration: (
      <div className="absolute -bottom-4 -left-4 w-full h-48 flex items-end justify-center pb-8 pl-8 pr-16">
        <motion.div 
          className="w-full max-w-[240px] flex flex-col gap-2 relative z-10"
        >
          {['Admin', 'Manager', 'Member'].map((role, i) => (
            <motion.div 
              key={role}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center justify-between p-2 rounded-lg bg-[#0A1224] border border-blue-500/20 backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-3 h-3 text-blue-400" />
                </div>
                <div className="w-12 h-1.5 bg-blue-500/20 rounded-full" />
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                role === 'Admin' ? 'bg-purple-500/20 text-purple-400' :
                role === 'Manager' ? 'bg-blue-500/20 text-blue-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {role}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  },
  {
    title: "JWT Authentication",
    description: "Enterprise-grade security with JWT authentication, encryption, and session management.",
    theme: {
      border: "border-teal-500/20 hover:border-teal-400/50",
      bg: "bg-[#04100E]",
      glow: "from-teal-600/20",
      iconGradient: "from-teal-500 to-emerald-600",
      shadowColor: "teal-500/20",
      arrowBg: "border-teal-500/30 text-white hover:bg-teal-500/20"
    },
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    illustration: (
      <div className="absolute -bottom-4 -left-4 w-full h-48 flex items-center justify-center pt-10 pl-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center bg-[#071815] border border-teal-500/30 rounded-xl p-3 shadow-[0_0_30px_rgba(20,184,166,0.15)]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/40 blur-xl rounded-full" />
            <div className="relative w-12 h-14 bg-gradient-to-b from-teal-400 to-teal-600 rounded-lg shadow-inner flex flex-col items-center justify-center z-10 border border-teal-300/50">
               <div className="w-6 h-6 border-[3px] border-white/80 rounded-t-full mb-1 absolute -top-4" />
               <Lock className="w-5 h-5 text-teal-950 mt-2" fill="currentColor" />
            </div>
          </div>
          
          <div className="ml-4 flex gap-1.5 items-center bg-teal-950/50 px-3 py-1.5 rounded-md border border-teal-500/20">
             {[1,2,3,4].map(i => (
               <div key={i} className="text-teal-400 text-lg leading-none mt-1">★</div>
             ))}
             <motion.div 
               animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="ml-2 w-4 h-4 text-teal-400"
             >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </motion.div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    title: "Real-Time Updates",
    description: "Instant notifications and live updates keep everyone in sync, every second.",
    theme: {
      border: "border-amber-500/20 hover:border-amber-400/50",
      bg: "bg-[#140A04]",
      glow: "from-amber-600/20",
      iconGradient: "from-amber-500 to-orange-600",
      shadowColor: "amber-500/20",
      arrowBg: "border-amber-500/30 text-white hover:bg-amber-500/20"
    },
    icon: <Zap className="w-6 h-6 text-white fill-white" />,
    illustration: (
      <div className="absolute -bottom-4 left-0 w-full h-48 flex items-center justify-start pl-16">
        <div className="relative">
          {/* Echo Rings */}
          <motion.div animate={{ scale: [1, 1.5], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full border border-amber-500/50 blur-[1px] m-[-20px]" />
          <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute inset-0 rounded-full border border-amber-500/30 blur-[2px] m-[-40px]" />
          
          <motion.div 
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative z-10"
          >
            {/* 3D Bell */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/50 blur-2xl rounded-full" />
              <div className="relative">
                 {/* Top loop */}
                 <div className="w-3 h-3 border-4 border-amber-600 rounded-full mx-auto -mb-1" />
                 {/* Bell Body */}
                 <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 rounded-t-[2rem] rounded-b-xl shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.3)] relative z-10"></div>
                 {/* Bell Bottom flare */}
                 <div className="w-20 h-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 rounded-full -mt-2 -ml-2 shadow-[0_5px_10px_rgba(217,119,6,0.4)] relative z-20"></div>
                 {/* Clapper */}
                 <div className="w-4 h-4 bg-orange-700 rounded-full mx-auto -mt-1 shadow-inner relative z-0"></div>
              </div>
              
              {/* Notification Badge */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="absolute -top-1 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-[#140A04] flex items-center justify-center text-[10px] font-bold text-white z-30 shadow-lg"
              >
                3
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    title: "Project Management",
    description: "Organize tasks, files, milestones, and sprints in one place. Simple, powerful, and flexible.",
    theme: {
      border: "border-pink-500/20 hover:border-pink-400/50",
      bg: "bg-[#14040A]",
      glow: "from-pink-600/20",
      iconGradient: "from-pink-500 to-rose-600",
      shadowColor: "pink-500/20",
      arrowBg: "border-pink-500/30 text-white hover:bg-pink-500/20"
    },
    icon: <FolderKanban className="w-6 h-6 text-white" />,
    illustration: (
      <div className="absolute -bottom-2 -left-2 w-[110%] h-48 flex items-end justify-center pb-6 pl-4">
        <div className="flex gap-3 w-full px-6">
          {/* Column 1 */}
          <div className="flex-1 bg-[#1A0A14] border border-pink-500/20 rounded-t-xl p-2 pb-0 opacity-90 h-32 relative shadow-[0_-5px_20px_rgba(236,72,153,0.1)]">
            <div className="text-[10px] font-bold text-white mb-2">To Do</div>
            <motion.div whileHover={{ y: -2 }} className="w-full bg-[#2A1020] rounded-md p-2 mb-2 border border-pink-500/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-pink-500/30" />
                <div className="w-10 h-1.5 bg-pink-500/30 rounded-full" />
              </div>
              <div className="w-full h-1 bg-pink-500/10 rounded-full mt-2" />
            </motion.div>
          </div>
          {/* Column 2 */}
          <div className="flex-1 bg-[#1A0A14] border border-pink-500/20 rounded-t-xl p-2 pb-0 opacity-100 h-40 relative z-10 shadow-[0_-5px_20px_rgba(236,72,153,0.15)] -mt-4">
            <div className="text-[10px] font-bold text-white mb-2">In Progress</div>
            <motion.div whileHover={{ y: -2 }} className="w-full bg-gradient-to-br from-[#3A152A] to-[#2A1020] rounded-md p-2 mb-2 border border-pink-400/30 shadow-lg shadow-pink-500/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-400" />
                <div className="w-12 h-1.5 bg-pink-300/50 rounded-full" />
              </div>
              <div className="w-3/4 h-1 bg-pink-300/30 rounded-full mt-2" />
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="w-full bg-[#2A1020] rounded-md p-2 mb-2 border border-pink-500/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500/30" />
                <div className="w-8 h-1.5 bg-pink-500/30 rounded-full" />
              </div>
            </motion.div>
          </div>
          {/* Column 3 */}
          <div className="flex-1 bg-[#1A0A14] border border-pink-500/20 rounded-t-xl p-2 pb-0 opacity-70 h-28 relative shadow-[0_-5px_20px_rgba(236,72,153,0.05)]">
            <div className="text-[10px] font-bold text-white mb-2">Done</div>
            <motion.div whileHover={{ y: -2 }} className="w-full bg-[#2A1020] rounded-md p-2 mb-2 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/30" />
                <div className="w-10 h-1.5 bg-emerald-500/30 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Analytics Dashboard",
    description: "Beautiful insights and reports to track progress, performance, and team productivity.",
    theme: {
      border: "border-indigo-500/20 hover:border-indigo-400/50",
      bg: "bg-[#060414]",
      glow: "from-indigo-600/20",
      iconGradient: "from-indigo-500 to-purple-600",
      shadowColor: "indigo-500/20",
      arrowBg: "border-indigo-500/30 text-white hover:bg-indigo-500/20"
    },
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    illustration: (
      <div className="absolute -bottom-4 -left-4 w-full h-48 flex items-end justify-between px-10 pb-8">
         <div className="relative w-32 h-24 flex items-end gap-2">
            {/* Bar Chart */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl" />
            {[30, 50, 40, 80, 60, 95].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: "10%" }}
                whileInView={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                className="flex-1 bg-gradient-to-t from-indigo-900 to-indigo-400 rounded-t-sm shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              />
            ))}
            {/* Overlay line graph */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <motion.path 
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 d="M0,80 Q10,70 20,60 T40,70 T60,30 T80,50 T100,10" 
                 fill="none" 
                 stroke="rgba(167, 139, 250, 0.8)" 
                 strokeWidth="2"
                 strokeLinecap="round"
                 className="drop-shadow-[0_0_5px_rgba(167,139,250,0.5)]"
               />
            </svg>
         </div>
         
         <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-[0_0_8px_rgba(167,139,250,0.4)]">
              <path
                className="text-[#1A103C]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                whileInView={{ strokeDasharray: "75, 100" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-indigo-400"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
         </div>
      </div>
    )
  }
];

export const BentoGrid = () => {
  return (
    <section id="features" className="py-24 relative bg-[#020510] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-indigo/10 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight text-white"
          >
            Everything you need. <br/>
            <span className="text-text-muted">Nothing you don't.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            A comprehensive suite of tools designed to help multi-tenant organizations scale effortlessly, boost productivity, and keep your teams aligned.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover="hover"
              className={`group relative h-[380px] rounded-[2.5rem] p-8 overflow-hidden transition-all duration-300 border backdrop-blur-sm ${feature.theme.bg} ${feature.theme.border}`}
            >
              {/* Dynamic Gradient Background on Hover */}
              <motion.div 
                variants={{
                  hover: { opacity: 0.15, scale: 1.2 }
                }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`absolute inset-0 bg-gradient-to-br ${feature.theme.glow} to-transparent pointer-events-none`}
              />

              <div className="relative z-20 flex flex-col h-full">
                {/* Content Header */}
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${feature.theme.iconGradient} shadow-lg shadow-${feature.theme.shadowColor} relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2.5 leading-tight">{feature.title}</h3>
                    <p className="text-[13px] text-text-muted leading-relaxed max-w-[200px]">{feature.description}</p>
                  </div>
                </div>
                
                {/* Space for Illustration */}
                <div className="flex-1" />

                {/* Arrow Button */}
                <div className="absolute bottom-6 right-6 z-30">
                  <motion.button 
                    variants={{
                      hover: { x: 5, backgroundColor: "rgba(255,255,255,0.1)" }
                    }}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors backdrop-blur-md ${feature.theme.arrowBg}`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Illustration Container */}
              {feature.illustration}
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
