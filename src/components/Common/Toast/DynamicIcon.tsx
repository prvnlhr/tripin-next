import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
const DynamicIcon = ({
  iconType,
  defaultColor,
}: {
  iconType: "success" | "error" | "info";
  defaultColor: string;
}) => {
  const icons = {
    success: "ep:success-filled",
    error: "material-symbols:error-outline",
    info: "material-symbols:info-outline",
  };

  return (
    <Icon
      icon={icons[iconType]}
      className={`w-[20px] h-[20px]`}
      style={{ color: `var(--toast-icon-color, ${defaultColor})` }}
    />
  );
};
export default DynamicIcon;
