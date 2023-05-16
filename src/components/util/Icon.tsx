import React from 'react';

const SCHEMATIC_INFO_ICON_SIZE = 20;

export const SearchIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} height={30} width={30} color='white' stroke='currentColor' className='search-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
        </svg>
    );
};

export const DropdownIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' height={15} width={15} className='dropdown-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
    );
};

export const MenuIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' height={30} width={30} className='menu-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
    );
};

export const ArrowUpIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='arrow-up-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5' />
        </svg>
    );
};

export const ArrowDownIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='arrow-down-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5' />
        </svg>
    );
};

export const DownloadIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='download-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' />
        </svg>
    );
};

export const CopyIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='copy-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184' />
        </svg>
    );
};

export const DeleteIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='delete-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' />
        </svg>
    );
};

export const HomeIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={3} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='home-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' />
        </svg>
    );
};

export const MapIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' height={SCHEMATIC_INFO_ICON_SIZE} width={SCHEMATIC_INFO_ICON_SIZE} className='map-icon'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' />
        </svg>
    );
};
