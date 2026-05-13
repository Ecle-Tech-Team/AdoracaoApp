import React, { createContext, useState, useContext } from 'react';

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  const [sectionData, setSectionData] = useState({
    title: '',
    hymns: [],
    filterType: '',
  });

  const updateSectionData = (title, hymns, filterType) => {
    setSectionData({
      title: title || '',
      hymns: hymns || [],
      filterType: filterType || '',
    });
  };

  const clearSectionData = () => {
    setSectionData({
      title: '',
      hymns: [],
      filterType: '',
    });
  };

  return (
    <SectionContext.Provider value={{ sectionData, updateSectionData, clearSectionData }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
};