import * as React from 'react';
const SearchComponent = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <circle cx={10} cy={10} r={8.1} stroke="#000" strokeWidth={1.8} />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={1.8}
      d="m22 22-6-6"
    />
  </svg>
);
export default SearchComponent;
