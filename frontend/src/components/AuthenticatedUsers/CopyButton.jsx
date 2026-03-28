import React, { useState } from 'react';

const CopyButton = ({ linkToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Modern API for writing text to the clipboard
      await navigator.clipboard.writeText(linkToCopy);
      
      // Visual feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Ошибка копирования: ', err);
    }
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Cкопировано!' : 'Копировать'}
    </button>
  );
};

export default CopyButton;