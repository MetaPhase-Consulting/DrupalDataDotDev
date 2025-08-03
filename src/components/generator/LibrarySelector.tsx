import React from 'react';

interface Library {
  id: string;
  name: string;
  license: string;
  homepage: string;
  bestFor: string;
  supports: string[];
}

interface LibrarySelectorProps {
  libraries: Library[];
  selectedLibrary: string;
  selectedType: string;
  onLibrarySelect: (library: string) => void;
}

const LibrarySelector: React.FC<LibrarySelectorProps> = ({
  libraries,
  selectedLibrary,
  selectedType,
  onLibrarySelect
}) => {
  const getFilteredLibraries = () => {
    if (!selectedType) return libraries;
    return libraries.filter(lib => lib.supports.includes(selectedType));
  };

  return (
    <div className="mt-4">
      <select
        value={selectedLibrary}
        onChange={(e) => onLibrarySelect(e.target.value)}
        className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
      >
        <option value="">Select a library...</option>
        {getFilteredLibraries().map((lib) => (
          <option key={lib.id} value={lib.id}>
            {lib.name} - {lib.bestFor}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LibrarySelector; 