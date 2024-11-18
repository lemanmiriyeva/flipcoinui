import React from 'react';
import {Box} from '@mui/material';
import headsImage from '../assets/heads.jpg';
import tailsImage from '../assets/tail.png';

interface CoinFlipProps {
    result: 'heads' | 'tails';
    isFlipping: boolean;
    size?: number;
}

const CoinFlip: React.FC<CoinFlipProps> = ({isFlipping, size = 150}) => {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                margin: '0 auto',
                position: 'relative',
                perspective: '1000px',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    animation: isFlipping ? 'flip 2s infinite' : 'none',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <img src={headsImage} alt="Heads" style={{width: '100%', height: '100%'}}/>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <img src={tailsImage} alt="Tails" style={{width: '100%', height: '100%'}}/>
                </Box>
            </Box>
            <style>
                {`
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(1800deg); }
          }
        `}
            </style>
        </Box>
    );
};

export default CoinFlip;
