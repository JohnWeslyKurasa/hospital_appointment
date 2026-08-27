import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function FeatureCard({
  title,
  subtitle,
  icon: Icon,
  accentColor = 'indigo', // 'indigo' | 'cyan' | 'mint' | 'violet' | 'coral' | 'turquoise'
  onClick
}) {
  // Restrained Pastel Accent Configuration
  const accentStyles = {
    indigo: {
      border: 'border-indigo-100/80 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white',
      waveClass: 'card-wave-indigo',
      arrowBg: 'group-hover:bg-[#4F46E5]',
    },
    cyan: {
      border: 'border-cyan-100/80 hover:border-cyan-300',
      iconBg: 'bg-cyan-50 text-[#06B6D4] group-hover:bg-[#06B6D4] group-hover:text-white',
      waveClass: 'card-wave-cyan',
      arrowBg: 'group-hover:bg-[#06B6D4]',
    },
    mint: {
      border: 'border-emerald-100/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white',
      waveClass: 'card-wave-mint',
      arrowBg: 'group-hover:bg-[#10B981]',
    },
    violet: {
      border: 'border-purple-100/80 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white',
      waveClass: 'card-wave-violet',
      arrowBg: 'group-hover:bg-[#7C3AED]',
    },
    coral: {
      border: 'border-orange-100/80 hover:border-orange-300',
      iconBg: 'bg-orange-50 text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white',
      waveClass: 'card-wave-coral',
      arrowBg: 'group-hover:bg-[#F97316]',
    },
    turquoise: {
      border: 'border-teal-100/80 hover:border-teal-300',
      iconBg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
      waveClass: 'card-wave-turquoise',
      arrowBg: 'group-hover:bg-teal-600',
    },
  };

  const currentAccent = accentStyles[accentColor] || accentStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-[20px] p-5.5 border ${currentAccent.border} med-card med-card-hover cursor-pointer flex flex-col justify-between min-h-[200px] relative overflow-hidden select-none`}
    >
      <div>
        {/* Circular pastel icon container */}
        <div className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 ${currentAccent.iconBg} mb-4 group-hover:scale-105`}>
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>

        {/* Heading */}
        <h3 className="text-sm font-extrabold tracking-wider text-[#172033] uppercase">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#64748B] font-medium leading-relaxed mt-1 line-clamp-2">
          {subtitle}
        </p>
      </div>

      {/* Footer Area with Arrow and Decorative Bottom Wave */}
      <div className="flex items-center justify-end pt-3 mt-3 border-t border-[#E6EAF2]/60 relative z-10">
        <div className={`w-7 h-7 rounded-full bg-[#F7F8FC] ${currentAccent.arrowBg} text-[#64748B] group-hover:text-white flex items-center justify-center transition-all duration-200`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Subtle Bottom Decorative Accent Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${currentAccent.waveClass}`} />
    </div>
  );
}
