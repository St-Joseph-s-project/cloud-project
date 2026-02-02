import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
    disabled?: boolean;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, label, disabled, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        if (disabled) return;
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    relative w-full cursor-pointer rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm
                    ${disabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-blue-400'
                    }
                `}
            >
                <span className="block truncate">{selectedOption?.label || value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </button>

            {isOpen && !disabled && (
                <ul className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`
                                relative cursor-pointer select-none py-2 pl-3 pr-9
                                ${option.value === value
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                                }
                            `}
                        >
                            <span className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}>
                                {option.label}
                            </span>
                            {option.value === value && (
                                <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${option.value === value ? 'text-white' : 'text-blue-600'}`}>
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
