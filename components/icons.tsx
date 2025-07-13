import React from 'react';

export const IconWrapper: React.FC<{ children: React.ReactNode; className?: string; strokeWidth?: number }> = ({ children, className = '', strokeWidth = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 shrink-0 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
  >
    {children}
  </svg>
);

export const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.231-4.41 60.436 60.436 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.905 59.905 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-1.07-1.07a50.57 50.57 0 011.07-1.07m15.482 0l1.07 1.07a50.57 50.57 0 00-1.07 1.07" />
    </IconWrapper>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </IconWrapper>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.25z" />
    </IconWrapper>
);

export const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.595-.484-1.087-1.088-1.087h-1.324c-.604 0-1.088.492-1.088 1.087s.484 1.088 1.088 1.088h1.324c.604 0 1.088-.492 1.088-1.088z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 6.087V3.75m-1.5 2.337V3.75M9 14.25l2.25 2.25 2.25-2.25M9 14.25v5.25h6v-5.25M15 14.25L12.75 12 15 9.75M9 14.25L11.25 12 9 9.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
  </IconWrapper>
);

export const DocumentCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </IconWrapper>
);

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.721.532a1.125 1.125 0 01-1.097-.727l-.547-1.641a1.125 1.125 0 00-1.097-.727H9.75a1.125 1.125 0 00-1.097.727l-.547 1.641a1.125 1.125 0 01-1.097.727l-3.721-.532A1.99 1.99 0 012.25 15.185v-4.286c0-.97.616-1.813 1.5-2.097M16.5 7.5V5.25a2.25 2.25 0 00-2.25-2.25H9.75A2.25 2.25 0 007.5 5.25v2.25" />
    </IconWrapper>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" />
    </IconWrapper>
);

export const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.063 13.5 8.106 13.5 9.25c0 1.143-.32 2.187-.834 3.136M9 5.25a48.452 48.452 0 00-3- .371m-3 0c.621 0 1.223.018 1.815.052M3 5.25V3m3.685 2.364A12.012 12.012 0 006 9.25c0 1.143.32 2.187.834 3.136" />
    </IconWrapper>
);

export const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </IconWrapper>
);

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </IconWrapper>
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconWrapper>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-6-6h-3a6 6 0 00-6 6v1a6 6 0 006 6z" />
    </IconWrapper>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </IconWrapper>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </IconWrapper>
);

export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </IconWrapper>
);

export const ClipboardDocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </IconWrapper>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </IconWrapper>
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm16.5-1.5H3.75" />
    </IconWrapper>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 18.75V21m-6-6H3.75m14.25 0H18" />
    </IconWrapper>
);

export const StopCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.253 9.253 9 9.563 9h4.874c.31 0 .563.253.563.563v4.874c0 .31-.253.563-.563.563H9.563C9.253 15 9 14.747 9 14.437V9.563z" />
    </IconWrapper>
);

export const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </IconWrapper>
);

export const PlayCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </IconWrapper>
);

export const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </IconWrapper>
);

export const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.383-.03.767-.03 1.152 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 0H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H15.75m-7.5 0v-1.392c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v1.392m-7.5 0B9.125 7.5 12 10.5m-3.75-3H12" />
    </IconWrapper>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </IconWrapper>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </IconWrapper>
);

export const ArrowLeftOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3h12.75" />
    </IconWrapper>
);

export const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.212l2.39-.998a1.125 1.125 0 011.427.72l1.003 2.392c.206.491.14 1.066-.171 1.49l-1.652 1.944a1.125 1.125 0 01-1.545.22l-2.029-1.442a1.125 1.125 0 01-.22-1.545l1.944-1.652a.375.375 0 00-.72-.424l-2.392 1.002c-.551.231-1.202-.16-1.427-.72l-1.003-2.392c-.231-.55.16-1.202.72-1.427l.001-.001z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
    </IconWrapper>
);

export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.25.25.25.25m-4.5-.5l-.25.25-.25.25m.5.5l.25.25.25.25M12 21a9 9 0 110-18 9 9 0 010 18zm0 0v.01" />
    </IconWrapper>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </IconWrapper>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </IconWrapper>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.036.954-2.036 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </IconWrapper>
);

export const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </IconWrapper>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </IconWrapper>
);