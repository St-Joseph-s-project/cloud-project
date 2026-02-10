import React from "react";

interface OneCompilerEmbedProps {}

const OneCompilerEmbed: React.FC<OneCompilerEmbedProps> = () => {
  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-600 flex justify-between items-center">
        <span>Admin Testing Console</span>
        <span className="text-xs text-gray-500">Powered by OneCompiler</span>
      </div>
      <iframe
        frameBorder="0"
        width="100%"
        height="100%"
        src="https://onecompiler.com/embed/"
        className="min-h-[400px] w-full"
        allow="clipboard-write"
      ></iframe>
    </div>
  );
};

export default OneCompilerEmbed;
