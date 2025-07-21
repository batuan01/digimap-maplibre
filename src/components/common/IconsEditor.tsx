
export const EDITOR_ICONS = {
  ELEVATOR: (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.833344 19.1666H14.5833V0.833313H0.833344V19.1666ZM13.6667 18.25H8.16668V1.74998H13.6667V18.25ZM1.75001 1.74998H7.25001V18.25H1.75001V1.74998ZM16.0729 10.9166H19.5104L17.7917 13.6666L16.0729 10.9166ZM19.5104 9.08331H16.0729L17.7917 6.33331L19.5104 9.08331Z" />
    </svg>
  ),
  STAIRWAY: (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21 3.5C21 3.22386 21.2239 3 21.5 3H30.5C30.7761 3 31 3.22386 31 3.5V8.5C31 8.77614 30.7761 9 30.5 9H27V12.5C27 12.7761 26.7761 13 26.5 13H23V16.5C23 16.7761 22.7761 17 22.5 17H19V20.5C19 20.7761 18.7761 21 18.5 21H15V24.5C15 24.7761 14.7761 25 14.5 25H11V28.5C11 28.7761 10.7761 29 10.5 29H1.5C1.22386 29 1 28.7761 1 28.5V23.5C1 23.2239 1.22386 23 1.5 23H5V19.5C5 19.2239 5.22386 19 5.5 19H9V15.5C9 15.2239 9.22386 15 9.5 15H13V11.5C13 11.2239 13.2239 11 13.5 11H17V7.5C17 7.22386 17.2239 7 17.5 7H21V3.5ZM26 8H30V4H22V8H18V12H14V16H10V20H6V24H2V28H10V24H14V20H18V16H22V12H26V8Z"
        ></path>
      </g>
    </svg>
  ),
  CONNECTION: (
    <svg width="20" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.617 3.844a2.87 2.87 0 0 0-.451-.868l1.354-1.36L13.904 1l-1.36 1.354a2.877 2.877 0 0 0-.868-.452 3.073 3.073 0 0 0-2.14.075 3.03 3.03 0 0 0-.991.664L7 4.192l4.327 4.328 1.552-1.545c.287-.287.508-.618.663-.992a3.074 3.074 0 0 0 .075-2.14zm-.889 1.804a2.15 2.15 0 0 1-.471.705l-.93.93-3.09-3.09.93-.93a2.15 2.15 0 0 1 .704-.472 2.134 2.134 0 0 1 1.689.007c.264.114.494.271.69.472.2.195.358.426.472.69a2.134 2.134 0 0 1 .007 1.688zm-4.824 4.994l1.484-1.545-.616-.622-1.49 1.551-1.86-1.859 1.491-1.552L6.291 6 4.808 7.545l-.616-.615-1.551 1.545a3 3 0 0 0-.663.998 3.023 3.023 0 0 0-.233 1.169c0 .332.05.656.15.97.105.31.258.597.459.862L1 13.834l.615.615 1.36-1.353c.265.2.552.353.862.458.314.1.638.15.97.15.406 0 .796-.077 1.17-.232.378-.155.71-.376.998-.663l1.545-1.552-.616-.615zm-2.262 2.023a2.16 2.16 0 0 1-.834.164c-.301 0-.586-.057-.855-.17a2.278 2.278 0 0 1-.697-.466 2.28 2.28 0 0 1-.465-.697 2.167 2.167 0 0 1-.17-.854 2.16 2.16 0 0 1 .642-1.545l.93-.93 3.09 3.09-.93.93a2.22 2.22 0 0 1-.711.478z"
      />
    </svg>
  ),
};

export const BeaconIcon = ({ radius }: { radius: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="1000"
      height="1000"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1200 1200"
      overflow="visible"
    >
      <defs>
        <radialGradient id="circle" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffa64132" />
        </radialGradient>
      </defs>
      <circle fill="url(#circle)" cx="600" cy="600" r="600" />
      <g transform={`translate(${600 - (600 / radius) * 30}, ${600 - (600 / radius) * 30} ) scale(${600 / radius})`}>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAa_79084_gr1"
          x1="32"
          x2="32"
          y1="5.918"
          y2="57.044"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#1a6dff"></stop>
          <stop offset="1" stopColor="#c822ff"></stop>
        </linearGradient>
        <path
          fill="url(#fLfGEGHazQctuI7MrOEnAa_79084_gr1)"
          d="M32,6C17.66,6,6,17.66,6,32c0,12.28,8.54,22.59,20,25.29v-2.05C15.66,52.57,8,43.16,8,32 C8,18.77,18.77,8,32,8s24,10.77,24,24c0,11.16-7.66,20.57-18,23.24v2.05C49.46,54.59,58,44.28,58,32C58,17.66,46.34,6,32,6z"
        ></path>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAb_79084_gr2"
          x1="32"
          x2="32"
          y1="5.995"
          y2="56.839"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#1a6dff"></stop>
          <stop offset="1" stopColor="#c822ff"></stop>
        </linearGradient>
        <path
          fill="url(#fLfGEGHazQctuI7MrOEnAb_79084_gr2)"
          d="M32,10c-12.13,0-22,9.87-22,22c0,10.05,6.77,18.55,16,21.16v-2.08C17.9,48.53,12,40.94,12,32 c0-11.03,8.97-20,20-20s20,8.97,20,20c0,8.94-5.9,16.53-14,19.08v2.08C47.23,50.55,54,42.05,54,32C54,19.87,44.13,10,32,10z"
        ></path>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAc_79084_gr3"
          x1="32"
          x2="32"
          y1="6.148"
          y2="56.498"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#1a6dff"></stop>
          <stop offset="1" stopColor="#c822ff"></stop>
        </linearGradient>
        <path
          fill="url(#fLfGEGHazQctuI7MrOEnAc_79084_gr3)"
          d="M32,14c-9.93,0-18,8.08-18,18c0,7.82,5.01,14.49,12,16.97v-2.14C20.14,44.45,16,38.7,16,32 c0-8.82,7.18-16,16-16s16,7.18,16,16c0,6.7-4.14,12.45-10,14.83v2.14c6.99-2.48,12-9.15,12-16.97C50,22.08,41.93,14,32,14z"
        ></path>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAd_79084_gr4"
          x1="32"
          x2="32"
          y1="6.499"
          y2="55.834"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#1a6dff"></stop>
          <stop offset="1" stopColor="#c822ff"></stop>
        </linearGradient>
        <path
          fill="url(#fLfGEGHazQctuI7MrOEnAd_79084_gr4)"
          d="M32,18c-7.72,0-14,6.28-14,14c0,5.58,3.28,10.4,8,12.65v-2.26c-3.58-2.08-6-5.95-6-10.39 c0-6.62,5.38-12,12-12s12,5.38,12,12c0,4.44-2.42,8.31-6,10.39v2.26c4.72-2.25,8-7.07,8-12.65C46,24.28,39.72,18,32,18z"
        ></path>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAe_79084_gr5"
          x1="32"
          x2="32"
          y1="7.533"
          y2="54.157"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#1a6dff"></stop>
          <stop offset="1" stopColor="#c822ff"></stop>
        </linearGradient>
        <path
          fill="url(#fLfGEGHazQctuI7MrOEnAe_79084_gr5)"
          d="M32,22c-5.51,0-10,4.49-10,10c0,3.26,1.57,6.17,4,7.99v-2.71c-1.24-1.41-2-3.26-2-5.28 c0-4.41,3.59-8,8-8s8,3.59,8,8c0,2.02-0.76,3.87-2,5.28v2.71c2.43-1.82,4-4.73,4-7.99C42,26.49,37.51,22,32,22z"
        ></path>
        <linearGradient
          id="fLfGEGHazQctuI7MrOEnAf_79084_gr6"
          x1="32"
          x2="32"
          y1="26"
          y2="38"
          gradientUnits="userSpaceOnUse"
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#6dc7ff"></stop>
          <stop offset="1" stopColor="#e6abff"></stop>
        </linearGradient>
        <path fill="url(#fLfGEGHazQctuI7MrOEnAf_79084_gr6)" d="M32 26A6 6 0 1 0 32 38A6 6 0 1 0 32 26Z"></path>
      </g>
    </svg>
  );
};
