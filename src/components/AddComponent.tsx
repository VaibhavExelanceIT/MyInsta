import * as React from 'react';
const AddComponent = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <rect
      width={20}
      height={20}
      x={2}
      y={2}
      stroke="#000"
      strokeWidth={1.8}
      rx={5}
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={1.8}
      d="M12.1 6.9v10.2M6.9 11.8h10.2"
    />
  </svg>
);
export default AddComponent;
