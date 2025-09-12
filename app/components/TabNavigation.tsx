import React, { useState } from "react";

interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
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
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                if (!item.disabled) {
                  handleTabClick(item.value);
                }
              }}
              className={`relative px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === item.value && !item.disabled
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : item.disabled
                    ? "text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              disabled={item.disabled}
              style={{ cursor: item.disabled ? 'not-allowed' : 'pointer' }}
            >
              {item.label}
              {activeTab === item.value && !item.disabled && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
