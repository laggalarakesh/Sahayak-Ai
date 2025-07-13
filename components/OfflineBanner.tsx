import React from 'react';

const OfflineBanner: React.FC = () => {
    return (
        <div className="bg-yellow-400 text-black text-center p-2 text-sm font-bold z-50 font-orbitron animate-pulse">
            SYSTEM OFFLINE :: Operating on local data cache.
        </div>
    );
};

export default OfflineBanner;