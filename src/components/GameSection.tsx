import React, {useEffect, useState} from 'react';
import {FaSmile, FaFrown} from 'react-icons/fa';
import headsImage from '../assets/heads.jpg';
import tailsImage from '../assets/tail.png';
import defaultAvatar from '../assets/default-avatar.png';
import CoinFlip from "./Conflip.tsx";
import {useTimer} from "../hooks/useTimer.ts";
import {
    Box,
    Typography,
    Button,
    Avatar, Grid,
} from '@mui/material';
import {styled} from '@mui/system';

interface GameSectionProps {
    user: any;
    opponentAvatar: string;
    status: string;
    isGameStarted: boolean;
    userChoice: 'heads' | 'tails' | null;
    coinResult: 'heads' | 'tails' | null;
    gameResult: 'win' | 'lose' | 'tie' | null;
    isFlipping: boolean;
    roundNumber: number;
    maxRounds: number;
    playerWins: number;
    opponentWins: number;
    timer: number;
    socket: any;
    setStatus: (status: string) => void;
    setUserChoice: (choice: 'heads' | 'tails' | null) => void;
    setIsFlipping: (isFlipping: boolean) => void;
    onStartGameClick: (user: any) => Promise<void>
}

const GameSection: React.FC<GameSectionProps> = ({
                                                     user,
                                                     opponentAvatar,
                                                     status,
                                                     isGameStarted,
                                                     userChoice,
                                                     coinResult,
                                                     gameResult,
                                                     isFlipping,
                                                     roundNumber,
                                                     maxRounds,
                                                     playerWins,
                                                     opponentWins,
                                                     socket,
                                                     setStatus,
                                                     setUserChoice,
                                                     setIsFlipping,
                                                     onStartGameClick,
                                                 }) => {
    // const [, setHasBet] = useState<boolean>(false);

    const [, setIsKeyboardOpen] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
    // const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            // If the window height decreases significantly, it's likely that the keyboard is open
            if (window.innerHeight < 600) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
            }
        };

        // Add event listener for resize events (keyboard open/close)
        window.addEventListener('resize', handleResize);
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handlePrediction = (value: number) => {
        setSelectedPrediction(value);
        socket.emit('makePrediction', {userId: 2, prediction: value});
        setStatus('Prediction placed!');
    };

    const handleChoice = (choice: 'heads' | 'tails') => {
        // Implement the function here
        if (userChoice) return; // Prevent multiple choices in the same round
        setUserChoice(choice);
        setStatus('Waiting for the result...');
        setIsFlipping(true);

        // Send choice to backend
        socket.emit('makeChoice', {choice});
    };

    const time = useTimer(60, isGameStarted && userChoice === null, () => {
        const autoChoice = Math.random() < 0.5 ? 'heads' : 'tails';
        handleChoice(autoChoice);
    });

    interface PredictionButtonProps {
        selected: boolean;
    }

    const PredictionButton = styled(Button)<PredictionButtonProps>(({theme, selected}) => ({
        width: 50,
        height: 50,
        borderRadius: '50%',
        margin: '8px',
        backgroundColor: selected ? theme.palette.secondary.main : theme.palette.primary.contrastText,
        color: selected ? theme.palette.common.white : theme.palette.text.primary,
        fontSize: '1.2rem',
        minWidth: 'auto', // Prevents buttons from stretching
        '&:hover': {
            backgroundColor: selected ? theme.palette.secondary.main : theme.palette.primary.light,
        },
        transition: 'background-color 0.3s',
    }));

    return (
        <Box mt={0}
             sx={{
                 backgroundColor: 'background.default',
                 minHeight: '100vh',
                 paddingBottom: '80px',
             }}
        >
            <Typography variant="h4" gutterBottom>
                Flip Coin Game
            </Typography>
            <Typography variant="subtitle1">{status}</Typography>

            {/* Prediction Section */}
            {!isGameStarted && (
                <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 4}}>
                    <Typography variant="h5" gutterBottom>
                        Place your prediction!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        How many times will heads land in the game?
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <PredictionButton
                                key={num}
                                selected={selectedPrediction === num}
                                onClick={() => handlePrediction(num)}>
                                {num}
                            </PredictionButton>
                        ))}
                    </Box>
                </Box>
            )}
            {!isGameStarted && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            // if (selectedPrediction === null) {
                            //     setStatus('Please make a prediction before starting the game.');
                            //     return;
                            // }
                            // Start the game
                            onStartGameClick(user);
                        }}
                        sx={{
                            mt: 4,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            fontSize: '1.5rem',
                        }}
                    >
                        Start Game
                    </Button>
                </Box>
            )}
            {/* Game Started Section */}
            {isGameStarted && (
                <Box mt={4}>
                    {/* Player Avatars and Info */}
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        {/* Player 1 */}
                        <Grid item xs={5} textAlign="center">
                            <Avatar
                                src={user.photo_url || defaultAvatar}
                                alt="Your Avatar"
                                sx={{width: 80, height: 80, margin: '0 auto'}}
                            />
                            <Typography variant="h6">{user.first_name}</Typography>
                            <Typography variant="subtitle1">Wins: {playerWins}</Typography>
                        </Grid>

                        {/* Game Status */}
                        <Grid item xs={2} textAlign="center">
                            <Typography variant="subtitle1">
                                Round {Math.min(roundNumber, maxRounds)} of {maxRounds}
                            </Typography>
                            <Typography variant="subtitle1">Timer: {time}s</Typography>
                        </Grid>

                        {/* Player 2 */}
                        <Grid item xs={5} textAlign="center">
                            <Avatar
                                src={opponentAvatar}
                                alt="Opponent Avatar"
                                sx={{width: 80, height: 80, margin: '0 auto'}}
                            />
                            <Typography variant="h6">Opponent</Typography>
                            <Typography variant="subtitle1">Wins: {opponentWins}</Typography>
                        </Grid>
                    </Grid>

                    {/* Game Logic UI */}
                    {userChoice === null ? (
                        <Box mt={4} textAlign="center">
                            <Typography variant="h6" gutterBottom>
                                Choose Heads or Tails:
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChoice('heads')}
                                        sx={{
                                            width: '100%',
                                            height: 120,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img src={headsImage} alt="Heads" style={{width: 60, marginBottom: 8}}/>
                                        <Typography variant="button">Heads</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChoice('tails')}
                                        sx={{
                                            width: '100%',
                                            height: 120,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img src={tailsImage} alt="Tails" style={{width: 60, marginBottom: 8}}/>
                                        <Typography variant="button">Tails</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box mt={4} textAlign="center">
                            {isFlipping ? (
                                <Box>
                                    <CoinFlip
                                        result={coinResult || 'heads'}
                                        isFlipping={true}
                                        size={150} // Adjusted size
                                    />
                                    <Typography variant="h6" mt={2}>
                                        Flipping the coin...
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="h6">
                                        Coin Result: <strong>{coinResult?.toUpperCase()}</strong>
                                    </Typography>
                                    <Typography variant="h6" mt={2}>
                                        {gameResult === 'win' && 'You won the round!'}
                                        {gameResult === 'lose' && 'You lost the round!'}
                                        {gameResult === 'tie' && "It's a tie!"}
                                    </Typography>
                                    <Box mt={2}>
                                        {gameResult === 'win' ? (
                                            <FaSmile size={48} color="green"/>
                                        ) : gameResult === 'lose' ? (
                                            <FaFrown size={48} color="red"/>
                                        ) : (
                                            <span style={{fontSize: 48}}>🤝</span>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default GameSection;