'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({ options, value, onChange, placeholder = 'Select option', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-gray-400 transition-transform`}></i>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors cursor-pointer ${
                value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}