import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  showStatus?: boolean;
  statusText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showStatus = true,
  statusText = 'Learning in Progress'
}) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
        {showStatus && (
          <div className="hidden md:block">
            <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <span className="font-semibold">Status:</span> {statusText}
            </div>
          </div>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 mt-4"></div>
    </div>
  );
};

export default PageHeader;
