
import { useUiStore } from '@/store/useUiStore';
import React from 'react';
import { createPortal } from 'react-dom';
import { RotatingSquare } from 'react-loader-spinner';

const GlobalLoader: React.FC = () => {
    const loading = useUiStore((s) => s.loading);
    if (!loading) return null;

    const overlay = (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative z-10">
                <RotatingSquare
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="rotating-square-loading"
                />
            </div>
        </div>
    );

    if (typeof document !== 'undefined') return createPortal(overlay, document.body);
    return null;
};

export default GlobalLoader;