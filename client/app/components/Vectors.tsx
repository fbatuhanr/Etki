import * as React from "react";
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
import COLORS from "../constants/colors";

const ActiveTab = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={COLORS.primary}
      fillRule="evenodd"
      d="M13.31 25c4.323 0 8.302-2.172 11.2-5.381C35.367 7.599 51.368 0 69.215 0c17.898 0 33.943 7.645 44.8 19.727 2.829 3.148 6.725 5.273 10.958 5.273C132.167 25 138 30.833 138 38.028V100c0 7.732-6.268 14-14 14H14c-7.732 0-14-6.268-14-14V38.31C0 30.958 5.959 25 13.31 25Z"
      clipRule="evenodd"
    />
  </Svg>
);
const LogoDoubleRing = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke="#F90"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M20 31.667c6.443 0 11.667-5.224 11.667-11.667S26.443 8.333 20 8.333 8.333 13.557 8.333 20 13.557 31.667 20 31.667Z"
      />
    </G>
    <Path
      stroke="#007BFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M20 36.667c9.205 0 16.667-7.462 16.667-16.667 0-9.205-7.462-16.667-16.667-16.667-9.205 0-16.667 7.462-16.667 16.667 0 9.205 7.462 16.667 16.667 16.667Z"
    />
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M6 6h28v28H6z" />
      </ClipPath>
    </Defs>
  </Svg>
);
const LogoDoubleOffsetRing = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#F90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M21.5 36c8.514 0 15.417-6.716 15.417-15 0-8.284-6.903-15-15.417-15S6.083 12.716 6.083 21c0 8.284 6.903 15 15.417 15Z"
    />
    <Path
      stroke="#007BFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M17.94 32.889c8.256 0 14.949-6.693 14.949-14.95 0-8.256-6.693-14.95-14.95-14.95-8.256 0-14.95 6.694-14.95 14.95 0 8.257 6.694 14.95 14.95 14.95Z"
    />
  </Svg>
);
const LogoMultipleRing = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke="gold"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M17.06 31.945c5.677 0 10.278-4.602 10.278-10.278 0-5.677-4.601-10.278-10.277-10.278-5.677 0-10.278 4.601-10.278 10.278 0 5.676 4.601 10.277 10.278 10.277Z"
      />
    </G>
    <G clipPath="url(#b)">
      <Path
        stroke="#FF5722"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M22.424 33.636c6.193 0 11.212-5.02 11.212-11.212s-5.02-11.212-11.212-11.212-11.212 5.02-11.212 11.212c0 6.193 5.02 11.212 11.212 11.212Z"
      />
    </G>
    <G clipPath="url(#c)">
      <Path
        stroke="#34A853"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M17.94 31.207c6.708 0 12.146-5.438 12.146-12.146 0-6.709-5.438-12.147-12.147-12.147-6.708 0-12.146 5.438-12.146 12.147 0 6.708 5.438 12.146 12.146 12.146Z"
      />
    </G>
    <G clipPath="url(#d)">
      <Path
        stroke="#F90"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M21.303 34.263c7.224 0 13.08-5.857 13.08-13.081 0-7.224-5.856-13.08-13.08-13.08s-13.08 5.856-13.08 13.08 5.856 13.08 13.08 13.08Z"
      />
    </G>
    <Path
      stroke="#007BFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M17.94 32.889c8.256 0 14.949-6.693 14.949-14.95 0-8.256-6.693-14.95-14.95-14.95-8.256 0-14.95 6.694-14.95 14.95 0 8.257 6.694 14.95 14.95 14.95Z"
    />
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M4.727 9.333h24.667V34H4.727z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill="#fff" d="M8.97 8.97h26.909v26.909H8.969z" />
      </ClipPath>
      <ClipPath id="c">
        <Path fill="#fff" d="M3.364 4.485h29.15v29.15H3.365z" />
      </ClipPath>
      <ClipPath id="d">
        <Path fill="#fff" d="M5.606 5.485H37v31.394H5.606z" />
      </ClipPath>
    </Defs>
  </Svg>
);
const DateBackground = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#F90"
      d="M53.403 37.891c-10.753 40.43 42 68-70.702 68-46.833 0-36.798-22.691-36.798-55 0-32.308-10.035-50 36.798-50 26.202 0 83.202-10 70.702 37Z"
    />
  </Svg>
);
const DateDetailBackground = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#F90"
      d="M113.075 3.039C233.727 13.252 316-36.853 316 70.192c0 44.481-67.715 34.95-164.13 34.95-96.416 0-149.211 9.531-149.211-34.95 0-24.887-29.841-79.026 110.416-67.153Z"
    />
  </Svg>
);
const UpArrowIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M13.995 27C9.03 27 6.99 23.475 9.48 19.17l4.02-6.93c2.49-4.305 6.555-4.305 9.045 0l4.02 6.93c2.49 4.305.45 7.83-4.515 7.83h-8.055Z"
    />
  </Svg>
);
const CreateIcon: React.FC<{ strokeColor?: string } & SvgProps> = ({ strokeColor, ...props }) => (
  <Svg fill="none" {...props}>
    <Path
      stroke={strokeColor ? strokeColor : '#F8F9FA'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      d="M12 5v14m-7-7h14"
    />
  </Svg>
);
const ProfileIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#F8F9FA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7M17 7A5 5 0 1 1 7 7a5 5 0 0 1 10 0Z"
    />
  </Svg>
);

const BackIcon: React.FC<{ isFilled?: boolean, strokeColor?: string } & SvgProps> = ({ isFilled, strokeColor, ...props }) => (
  <Svg fill={isFilled ? (strokeColor ? strokeColor : '#FFFFFF') : '#00000000'} {...props}>
    <Path
      stroke={strokeColor ? strokeColor : '#FFFFFF'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m4.71 9.17 11.59-6.1c2.75-1.45 5.74 1.48 4.35 4.26l-1.62 3.24c-.45.9-.45 1.96 0 2.86l1.62 3.24c1.39 2.78-1.6 5.7-4.35 4.26l-11.59-6.1c-2.28-1.2-2.28-4.46 0-5.66Z"
    />
  </Svg>
);
const FavIcon: React.FC<{ isFilled?: boolean, isWhite?: boolean, strokeWidth?: number } & SvgProps> = ({ isFilled, isWhite, strokeWidth, ...props }) => (
  <Svg fill={isFilled ? isWhite ? '#FFFFFF' : '#292D32' : "#00000000"} {...props}>
    <Path
      stroke={isWhite ? '#FFFFFF' : '#292D32'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth ? strokeWidth : 1.5}
      d="M8.413 12.873c-.226.08-.6.08-.826 0-1.934-.66-6.254-3.413-6.254-8.08 0-2.06 1.66-3.726 3.707-3.726 1.213 0 2.287.586 2.96 1.493a3.686 3.686 0 0 1 2.96-1.493c2.047 0 3.707 1.666 3.707 3.726 0 4.667-4.32 7.42-6.254 8.08Z"
    />
  </Svg>
);
const ShareIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.667 6.427a8.989 8.989 0 0 1 3.812 6.406m-17.844.052a8.96 8.96 0 0 1 3.75-6.406m1.146 15.334a8.88 8.88 0 0 0 4.031.958 8.83 8.83 0 0 0 3.886-.886m-.99-16.76a2.896 2.896 0 1 1-5.791 0 2.896 2.896 0 0 1 5.791 0Zm-7.531 12.73a2.896 2.896 0 1 1-5.792 0 2.896 2.896 0 0 1 5.792 0Zm14.938 0a2.896 2.896 0 1 1-5.792 0 2.896 2.896 0 0 1 5.791 0Z"
    />
  </Svg>
);
const LineIcon = (props: SvgProps) => (
  <Svg fill="#F8F9FA" {...props}>
    <Path
      fill="#F8F9FA"
      d="M39 4a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm-41 .75h45v-1.5H-2v1.5Z"
    />
  </Svg>
);
const LocationIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#1D1B20"
      d="M9 16.5a.698.698 0 0 1-.45-.15.911.911 0 0 1-.281-.394c-.238-.7-.538-1.356-.9-1.968-.35-.613-.844-1.332-1.481-2.157A16.966 16.966 0 0 1 4.33 9.47c-.387-.75-.581-1.656-.581-2.719 0-1.463.506-2.7 1.519-3.712C6.294 2.013 7.537 1.5 9 1.5s2.7.513 3.713 1.538c1.025 1.012 1.537 2.25 1.537 3.712 0 1.138-.219 2.088-.656 2.85a19.7 19.7 0 0 1-1.481 2.231c-.675.9-1.188 1.65-1.538 2.25a10.59 10.59 0 0 0-.844 1.875.847.847 0 0 1-.3.413A.733.733 0 0 1 9 16.5Zm0-2.681c.213-.425.45-.844.713-1.257.275-.412.675-.962 1.2-1.65.537-.7.974-1.343 1.312-1.93.35-.6.525-1.344.525-2.232 0-1.037-.369-1.919-1.106-2.644C10.919 3.37 10.037 3 9 3c-1.037 0-1.925.369-2.662 1.106-.726.725-1.088 1.607-1.088 2.644 0 .888.169 1.631.506 2.231.35.588.794 1.232 1.332 1.931.524.688.918 1.238 1.18 1.65.276.413.52.832.732 1.257Zm0-5.194a1.81 1.81 0 0 0 1.331-.544 1.81 1.81 0 0 0 .544-1.331 1.81 1.81 0 0 0-.544-1.331A1.81 1.81 0 0 0 9 4.875a1.81 1.81 0 0 0-1.331.544 1.81 1.81 0 0 0-.544 1.331c0 .525.181.969.544 1.331A1.81 1.81 0 0 0 9 8.625Z"
    />
  </Svg>
);
const SearchIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#FFFFFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m20.167 20.167-1.834-1.834m.917-7.791a8.708 8.708 0 1 1-17.417 0 8.708 8.708 0 0 1 17.417 0Z"
    />
  </Svg>
);
const CalendarIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.333 1.833v2.75m7.334-2.75v2.75M3.208 8.333h15.584m-4.405 4.225h.008m-.008 2.75h.008m-3.4-2.75h.01m-.01 2.75h.01m-3.402-2.75h.008m-.008 2.75h.008M19.25 7.792v7.791c0 2.75-1.375 4.584-4.583 4.584H7.333c-3.208 0-4.583-1.834-4.583-4.584V7.792c0-2.75 1.375-4.584 4.583-4.584h7.334c3.208 0 4.583 1.834 4.583 4.584Z"
    />
  </Svg>
);
const TimerIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.24 2H8.76C5 2 4.71 5.38 6.74 7.22l10.52 9.56C19.29 18.62 19 22 15.24 22H8.76C5 22 4.71 18.62 6.74 16.78l10.52-9.56C19.29 5.38 19 2 15.24 2Z"
    />
  </Svg>
);
const ParticipantsIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.41 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 0 0-.26 0m2.06 9c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86m-9.21-3.13c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C4.56 3.99 6.54 2 9 2a4.435 4.435 0 0 1 .16 8.87Zm-5 3.69c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z"
    />
  </Svg>
);
const LocationDetailIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeWidth={1.5}
      d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"
    />
    <Path
      stroke="#fff"
      strokeWidth={1.5}
      d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.194 5.194 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
    />
  </Svg>
);
const WarningIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 7.75V13m0 3.2v.1m9.08-7.72v6.84c0 1.12-.6 2.16-1.57 2.73l-5.94 3.43c-.97.56-2.17.56-3.15 0l-5.94-3.43a3.15 3.15 0 0 1-1.57-2.73V8.58c0-1.12.6-2.16 1.57-2.73l5.94-3.43c.97-.56 2.17-.56 3.15 0l5.94 3.43c.97.57 1.57 1.6 1.57 2.73Z"
    />
  </Svg>
);

export {
  ActiveTab,
  LogoDoubleRing, LogoDoubleOffsetRing, LogoMultipleRing,
  DateBackground, DateDetailBackground,
  UpArrowIcon, CreateIcon, ProfileIcon,
  BackIcon, FavIcon, ShareIcon, LineIcon, LocationIcon, SearchIcon, CalendarIcon, TimerIcon, ParticipantsIcon, LocationDetailIcon, WarningIcon
};