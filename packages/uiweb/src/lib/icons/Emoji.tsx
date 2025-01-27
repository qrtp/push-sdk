import React from 'react';

type EmojiIconsProps = {
  color?: string;
}

export const EmojiIcon: React.FC<EmojiIconsProps> = ({color="none"}) => {
  return (
    <svg width="30" height="30" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 28.7407C22.6274 28.7407 28 23.2686 28 16.5185C28 9.76831 22.6274 4.29623 16 4.29623C9.37258 4.29623 4 9.76831 4 16.5185C4 23.2686 9.37258 28.7407 16 28.7407Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11.5 15.5C12.3284 15.5 13 14.8159 13 13.9722C13 13.1284 12.3284 12.4444 11.5 12.4444C10.6716 12.4444 10 13.1284 10 13.9722C10 14.8159 10.6716 15.5 11.5 15.5Z" fill={color} />
      <path d="M20.5 15.5C21.3284 15.5 22 14.8159 22 13.9722C22 13.1284 21.3284 12.4444 20.5 12.4444C19.6716 12.4444 19 13.1284 19 13.9722C19 14.8159 19.6716 15.5 20.5 15.5Z" fill={color} />
      <path d="M21.2 19.574C20.6714 20.5016 19.9128 21.2716 19.0003 21.8068C18.0877 22.342 17.0531 22.6237 16 22.6237C14.947 22.6237 13.9124 22.342 12.9998 21.8068C12.0873 21.2716 11.3287 20.5016 10.8 19.574" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
};