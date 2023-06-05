import React from 'react';

export const AngleArrowIcon = ({
  stroke,
  fill,
}: {
  stroke?: string;
  fill?: string;
}) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 15V5H2V11.6L13.6 0L15 1.4L3.4 13H10V15H0Z" fill="black" />
    </svg>
  );
};
