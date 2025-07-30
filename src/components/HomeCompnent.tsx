import * as React from 'react';
const HomeComponent = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M22 11.536V22h-6v-5a4 4 0 0 0-8 0v5H2V11.536L12 2l10 9.536Z"
      clipRule="evenodd"
    />
    <path
      fill="#000"
      d="M22 22v.5h.5V22H22Zm0-10.464h.5v-.214l-.155-.148-.345.362ZM16 22h-.5v.5h.5V22Zm-8 0v.5h.5V22H8Zm-6 0h-.5v.5H2V22Zm0-10.464-.345-.362-.155.148v.214H2ZM12 2l.345-.362L12 1.31l-.345.33L12 2Zm10.5 20V11.536h-1V22h1Zm-6.5.5h6v-1h-6v1Zm.5-.5v-5h-1v5h1Zm0-5a4.5 4.5 0 0 0-4.5-4.5v1a3.5 3.5 0 0 1 3.5 3.5h1ZM12 12.5A4.5 4.5 0 0 0 7.5 17h1a3.5 3.5 0 0 1 3.5-3.5v-1ZM7.5 17v5h1v-5h-1ZM2 22.5h6v-1H2v1Zm-.5-10.964V22h1V11.536h-1Zm10.155-9.898-10 9.536.69.724 10-9.536-.69-.724Zm10.69 9.536-10-9.536-.69.724 10 9.536.69-.724Z"
    />
  </svg>
);
export default HomeComponent;
