import React, { useState } from "react";

interface TabItem {
  label: string;
  value: string;
}

interface TabNavigationProps {
  items: TabItem[];
  defaultActive?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  items,
  defaultActive,
  onChange,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActive || items[0]?.value || ""
  );

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div className="flex border-b border-gray-200">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => handleTabClick(item.value)}
              className={`relative px-6 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                activeTab === item.value
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
              {activeTab === item.value && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
