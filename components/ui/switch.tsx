import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span className="slider round"></span>
    </label>
  );
};

// Add some basic styles for the switch
const styles = `
.switch {
  position: relative;
  display: inline-block;
  width: 27.2px; /* 34px * 0.8 */
  height: 16px;  /* 20px * 0.8 */
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 27.2px; /* 34px * 0.8 */
}

.slider:before {
  position: absolute;
  content: "";
  height: 11.2px; /* 14px * 0.8 */
  width: 11.2px;  /* 14px * 0.8 */
  left: 2.4px;    /* 3px * 0.8 */
  bottom: 2.4px;  /* 3px * 0.8 */
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #f8aa19;
}

input:checked + .slider:before {
  transform: translateX(11.2px); /* 14px * 0.8 */
}
`;

// Inject styles into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}