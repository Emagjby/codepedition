"use client";

import React, { ReactNode } from "react";

type PathCardProps = {
  title: string;
  description: string;
  quests: number;
  projects: number;
  color: "blue" | "purple" | "amber";
  icon: ReactNode;
};

export default function PathCard({ title, description, quests, projects, color, icon }: PathCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      iconBg: "bg-blue-100",
      iconText: "text-blue-500",
      textColor: "text-blue-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-500",
      iconBg: "bg-purple-100",
      iconText: "text-purple-500",
      textColor: "text-purple-600"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-500",
      iconBg: "bg-amber-100",
      iconText: "text-amber-500",
      textColor: "text-amber-600"
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl p-6 border-t-4 ${classes.border} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full ${classes.iconBg} flex items-center justify-center ${classes.iconText} mr-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-4">
          <span className={`font-semibold ${classes.textColor}`}>{quests}+</span> Quests
        </span>
        <span>
          <span className={`font-semibold ${classes.textColor}`}>{projects}+</span> Projects
        </span>
      </div>
    </div>
  );
} 