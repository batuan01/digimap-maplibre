// // Project: Digimap Core Editor
// // Copyright: © 2024 Digimap. All rights reserved.
// // ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
// import { rad2deg } from "@/lib/utils";
// import { InputNumber } from "antd";
// import interact from "interactjs";
// import { useEffect, useRef } from "react";
// import styled from "styled-components";

// const BasicInputWrapper = styled.label`
//   color-scheme: light;
//   color: var(--color-text, #333333);
//   padding: 0;
//   font: inherit;
//   vertical-align: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   border-radius: 2px;
//   position: relative;
//   cursor: ew-resize;
//   user-select: none;
//   display: flex;
//   align-items: center;
//   border: 1px solid transparent;
//   height: 28px;
//   margin: 1px 0;
//   box-sizing: border-box;
//   grid-column-end: span 12;
//   width: 100%;
// `;

// const BasicInputIconInsideWrapper = styled.div`
//   color-scheme: light;
//   user-select: none;
//   margin: 0;
//   padding: 0;
//   border: 0;
//   font: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   cursor: inherit;
//   align-items: center;
//   justify-content: center;
//   height: 32px;
//   width: 32px;
//   flex: 0 0 32px;
//   line-height: 32px;
//   font-size: 11px;
//   color: var(--color-text-secondary, #b3b3b3);
//   fill: var(--color-icon-secondary, #b3b3b3);
//   stroke: var(--color-icon-secondary, #b3b3b3);
//   grid-column-end: span 4;
//   text-align: center;
//   display: block;
//   vertical-align: top;
//   text-transform: none !important;
//   -webkit-font-smoothing: antialiased;
//   margin-left: -1px;
// `;

// type PanelTabHeaderProps = {
//   id?: string;
//   type?: "number" | "angle";
//   icon: React.ReactNode;
//   value?: number;
//   onChange?: (value: number | null) => void;
//   disabled?: boolean;
//   min?: number;
//   max?: number;
// };

// export const BasicInput = ({
//   id,
//   type = "number",
//   icon,
//   value,
//   onChange,
//   disabled = false,
//   min,
//   max,
// }: PanelTabHeaderProps) => {
//   const currentValueRef = useRef(value);

//   useEffect(() => {
//     if (!id) return;
//     currentValueRef.current = value;
//     const interactable = interact(`.${id}`)
//       .origin("self")
//       .draggable({
//         listeners: {
//           move(event: any) {
//             if (!disabled) {
//               let newValue = currentValueRef.current + event.dx;
//               if (type === "number") {
//                 newValue = Math.max(min ?? -Number.MAX_SAFE_INTEGER, newValue);
//               } else {
//                 newValue = Math.max(-180, Math.min(180, newValue));
//               }
//               currentValueRef.current = newValue;
//               onChange && onChange(newValue);
//             }
//           },
//         },
//       })
//       .styleCursor(false);
//     return () => {
//       interactable.unset();
//     };
//   }, []);

//   return (
//     <BasicInputWrapper>
//       <BasicInputIconInsideWrapper className={id}>{icon}</BasicInputIconInsideWrapper>
//       <InputNumber
//         precision={2}
//         value={value}
//         formatter={(current: any) => {
//           if (current === undefined) return "";
//           if (type === "angle") {
//             return `${rad2deg(parseFloat(current)).toFixed(2)}°`;
//           } else {
//             return `${+parseFloat(current).toFixed(2)}`;
//           }
//         }}
//         onChange={onChange}
//         step={10}
//         max={type === "number" ? max : 180}
//         min={type === "number" ? min : -180}
//         variant="borderless"
//         disabled={disabled}
//       />
//     </BasicInputWrapper>
//   );
// };
