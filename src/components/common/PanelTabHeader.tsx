// // Project: Digimap Core Editor
// // Copyright: © 2024 Digimap. All rights reserved.
// // ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
// import { EditOutlined } from "@ant-design/icons";
// import { Flex, Tooltip } from "antd";
// import styled from "styled-components";
// import { useDigimapActionManager, useDigimapElements, useDigimapSetAppState } from "../../../components/App";
// import { actionLockElement } from "../../actions/actionLockElement";
// import { DGMPanelActionIcon } from "./DGMPanelTab";
// import { ICONS } from "./Icons";

// const PanelTabHeaderWrapper = styled.div`
//   color-scheme: light;
//   color: var(--color-text, #333333);
//   user-select: none;
//   margin: 0;
//   padding: 6px;
//   border: 0;
//   font: inherit;
//   vertical-align: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   cursor: inherit;
//   display: flex;
//   align-items: center;
//   flex-shrink: 0;
//   height: 28px;
//   justify-content: flex-start;
//   border-top: 0.5px solid var(--color-border, #e5e5e5);
//   border-bottom: 0.5px solid var(--color-border, #e5e5e5);
//   word-break: keep-all;
// `;

// const PanelTabHeaderIconWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 20px;
//   svg {
//     width: 20px;
//   }
// `;
// const PanelTabHeaderIconPlusWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   :hover {
//     background: var(--color-icon-secondary, #e5e5e5);
//     cursor: pointer;
//   }
// `;

// const PanelTabHeaderTextWrapper = styled.div`
//   color: var(--color-text, #333333);
//   user-select: none;
//   margin: 0;
//   padding: 0;
//   border: 0;
//   font: inherit;
//   vertical-align: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   cursor: inherit;
//   width: 100%;
//   font-size: 13px;
//   font-weight: 600;
//   align-self: center;
//   grid-column-start: 1;
//   grid-column-end: span 10;
//   padding-left: 8px;
// `;

// const PanelTabHeaderCollapseButton = styled.button`
//   color-scheme: light;
//   user-select: none;
//   margin: 0;
//   padding: 0;
//   font: inherit;
//   vertical-align: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   cursor: inherit;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 32px;
//   width: 32px;
//   flex: 0 0 32px;
//   line-height: 32px;
//   box-sizing: border-box;
//   border: 1px solid transparent;
//   position: relative;
//   border-radius: 2px;
//   background-clip: padding-box;
//   background-color: transparent;
//   grid-column-end: span 4;
//   fill: var(--color-icon-secondary, #b3b3b3);
//   color: var(--color-icon-secondary, #b3b3b3);
//   transition: 0.1s fill ease-out, 0.1s color ease-out;
//   &:hover {
//     background-color: rgba(0, 0, 0, 0.1);
//   }
//   svg {
//     fill: black;
//   }
// `;

// const TextShortName = styled.input`
//   font-weight: bold;
//   border: none;
//   width: 20%;
//   background: inherit;
//   &:focus {
//     outline: none;
//     border: none;
//   }
//   &:focus-visible {
//     outline: none;
//     box-shadow: 0px 0px #ffffff !important;
//   }
//   &:disabled {
//     background-color: #ffffff;
//   }
// `;

// const TextName = styled.input`
//   color: var(--color-text, #333333);
//   user-select: none;
//   margin: 0;
//   padding: 0 8px;
//   border: 0;
//   font: inherit;
//   vertical-align: inherit;
//   outline: none;
//   letter-spacing: inherit;
//   text-decoration: none;
//   cursor: inherit;
//   width: 100%;
//   font-size: 13px;
//   font-weight: 600;
//   align-self: center;
//   grid-column-start: 1;
//   grid-column-end: span 10;
//   background: inherit;
//   &:focus {
//     outline: none;
//     border: none;
//   }
//   &:focus-visible {
//     outline: none;
//     box-shadow: 0px 0px #ffffff !important;
//   }
//   &:disabled {
//     background-color: #ffffff;
//   }
// `;

// type PanelTabHeaderProps = {
//   actionIcons?: DGMPanelActionIcon[];
//   label?: String;
//   isCollapse: boolean;
// };

// export const PanelTabHeader = ({ actionIcons = [], label, isCollapse }: PanelTabHeaderProps) => {
//   const renderActionIcon = () => {
//     if (actionIcons && actionIcons.length > 0) {
//       if (actionIcons[0].name === "collapse") {
//         return (
//           <PanelTabHeaderCollapseButton>
//             {isCollapse ? <ICONS.ARROW_DOWN /> : <ICONS.ARROW_UP />}
//           </PanelTabHeaderCollapseButton>
//         );
//       } else {
//         return <PanelTabHeaderIconWrapper>{actionIcons[0].icon}</PanelTabHeaderIconWrapper>;
//       }
//     }
//   };

//   let iconRight: DGMPanelActionIcon[] = [];
//   if (actionIcons && actionIcons.length > 0 && actionIcons[0].name === "collapse") {
//     iconRight = actionIcons.filter((icon) => icon.name !== "collapse");
//   }

//   return (
//     <PanelTabHeaderWrapper>
//       {renderActionIcon()}
//       <PanelTabHeaderTextWrapper>{label}</PanelTabHeaderTextWrapper>
//       {iconRight?.map((icon: DGMPanelActionIcon, index: number) =>
//         icon.tooltip ? (
//           <Tooltip key={index} placement="bottom" title={<span>{icon.tooltip}</span>}>
//             <PanelTabHeaderIconPlusWrapper onClick={icon.onClick}>{icon.icon}</PanelTabHeaderIconPlusWrapper>
//           </Tooltip>
//         ) : (
//           <PanelTabHeaderIconPlusWrapper key={index} onClick={icon.onClick}>
//             {icon.icon}
//           </PanelTabHeaderIconPlusWrapper>
//         )
//       )}
//     </PanelTabHeaderWrapper>
//   );
// };

// export const PanelTabHeaderInput = ({
//   renderAction,
//   isCollapse,
//   item,
//   setDataName,
// }: {
//   renderAction: any;
//   isCollapse: boolean;
//   item: any;
//   setDataName: Function;
// }) => {
//   const checkForOverlap = !item.status;

//   return (
//     <PanelTabHeaderWrapper>
//       <TextShortName
//         value={item.shortName}
//         onChange={(e: any) =>
//           setDataName((prevState: any) =>
//             prevState.map((event: any) => (event.id === item.id ? { ...event, shortName: e.target.value } : event))
//           )
//         }
//         disabled={!checkForOverlap}
//       />
//       <TextName
//         value={item.name}
//         onChange={(e: any) =>
//           setDataName((prevState: any) =>
//             prevState.map((event: any) => (event.id === item.id ? { ...event, name: e.target.value } : event))
//           )
//         }
//         disabled={!checkForOverlap}
//       />

//       {checkForOverlap ? renderAction("uploadFloorPlan") : null}

//       {!checkForOverlap ? (
//         <PanelTabHeaderCollapseButton>
//           <EditOutlined rev={undefined} />
//         </PanelTabHeaderCollapseButton>
//       ) : null}
//       {checkForOverlap ? (
//         <PanelTabHeaderCollapseButton>
//           {isCollapse ? <ICONS.ARROW_DOWN /> : <ICONS.ARROW_UP />}
//         </PanelTabHeaderCollapseButton>
//       ) : null}
//     </PanelTabHeaderWrapper>
//   );
// };

// export const PanelTabHeaderInactive = ({
//   renderAction,
//   isCollapse,
//   item,
//   setDataName,
// }: {
//   renderAction: any;
//   isCollapse: boolean;
//   item: any;
//   setDataName: Function;
// }) => {
//   const setAppState = useDigimapSetAppState();
//   const actionManager = useDigimapActionManager();
//   const elements = useDigimapElements();

//   const checkForOverlap = item.edit;

//   const handleSelectFloor = () => {
//     const selectElement = elements.find((e) => e.data.level === item.id);
//     if (selectElement) {
//       actionManager.executeAction(actionLockElement, "api", selectElement.id);
//       setAppState({
//         selectedElementIds: {
//           [selectElement.id]: true,
//         },
//       });
//     }
//   };

//   return (
//     <PanelTabHeaderWrapper>
//       <Flex
//         align="center"
//         onClick={() => {
//           handleSelectFloor();
//         }}
//       >
//         <TextShortName
//           defaultValue={item.shortName}
//           onChange={(e: any) =>
//             setDataName((prevState: any) =>
//               prevState.map((event: any) => (event.id === item.id ? { ...event, shortName: e.target.value } : event))
//             )
//           }
//           readOnly={!checkForOverlap}
//         />
//         <TextName
//           defaultValue={item.name}
//           onChange={(e: any) =>
//             setDataName((prevState: any) =>
//               prevState.map((event: any) => (event.id === item.id ? { ...event, name: e.target.value } : event))
//             )
//           }
//           readOnly={!checkForOverlap}
//         />

//         {checkForOverlap ? renderAction("uploadFloorPlan") : null}
//       </Flex>

//       <PanelTabHeaderCollapseButton>
//         {isCollapse ? <ICONS.ARROW_DOWN /> : <ICONS.ARROW_UP />}
//       </PanelTabHeaderCollapseButton>
//     </PanelTabHeaderWrapper>
//   );
// };
