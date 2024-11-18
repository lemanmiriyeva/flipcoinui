import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './App.css'

// Import icons and images
import defaultAvatar from './assets/default-avatar.png';
import achievement_png from './assets/achievement.png';
import TopBar from './components/TopBar';
import Menu from "./components/Menu.tsx";
import {useSocketListeners} from "./hooks/useSocketListeners.ts";
import GameSection from "./components/GameSection.tsx";
import {fetchUserProfile} from "./utils/api.ts";
// import {useGameStart} from "./hooks/useGameStart.ts";
import {
    Container,
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {useGameStart} from "./hooks/useGameStart.ts";
import InviteScreen from "./components/InviteScreen.tsx";
import Tasks from "./components/Tasks.tsx";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

declare global {
    interface Window {
        Telegram: any;
    }
}

const socket = io(backendUrl, {
    reconnection: true, // Allow reconnections
    reconnectionAttempts: 5, // Number of attempts before giving up
    reconnectionDelay: 1000, // Delay between reconnection attempts
    reconnectionDelayMax: 5000, // Maximum delay between reconnections
});

type MenuOption = 'game' | 'tasks' | 'leaderboard' | 'account' | 'invite';

const App: React.FC = () => {
    const [status, setStatus] = useState<string>('Connecting...');
    const [opponentAvatar, setOpponentAvatar] = useState<string>(defaultAvatar);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [coins, setCoins] = useState<number>(0);
    const [activeMenu, setActiveMenu] = useState<MenuOption>('game');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    // Game logic state variables
    const [userChoice, setUserChoice] = useState<'heads' | 'tails' | null>(null);
    const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
    const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null);
    const [isFlipping, setIsFlipping] = useState<boolean>(false);
    const [roundNumber, setRoundNumber] = useState<number>(0); // Start from 0
    const maxRounds = 5;
    const [playerWins, setPlayerWins] = useState<number>(0);
    const [opponentWins, setOpponentWins] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {onStartGameClick} = useGameStart(
        socket,
        setUserChoice,
        setCoinResult,
        setGameResult,
        setPlayerWins,
        setOpponentWins,
        setStatus,
        backendUrl,
        setCoins,
        setUser,
    );

    const resetGameState = () => {
        setIsGameStarted(false);
        setUserChoice(null);
        setCoinResult(null);
        setGameResult(null);
        setIsFlipping(false);
        setRoundNumber(0);
        setPlayerWins(0);
        setOpponentWins(0);
        setTimer(60);
        setStatus('Ready to start a new game.');
        // setSelectedPrediction(null); // Reset the prediction
    };

    useEffect(() => {
        const tg = window.Telegram ? window.Telegram.WebApp : null;
        if (tg) {
            tg.expand();
            const userData = tg.initDataUnsafe?.user;
            setUser(userData);
            console.log(JSON.stringify(userData, null, 2));

            if (userData) {
                setUser({...userData, id: String(userData.id), referralCount: 3}); // Ensure id is string
            } else {
                setStatus('Unable to retrieve Telegram user data.');
            }
        }
    }, []);

// Fetch user profile only when the user is set and game hasn't started
    useEffect(() => {
        if (user && user.id && !isGameStarted) { // Only fetch when the game is not started
            console.log('Fetching user profile for:', user.id);

            fetchUserProfile(user.id, backendUrl)
                .then((data) => {
                    setCoins(data.coins);
                    setUser((prevUser: any) => ({...prevUser, achievements: data.achievements || []}));
                })
                .catch((error) => console.error('Error fetching user profile:', error));
        }
    }, [user, isGameStarted]); // Runs when user or isGameStarted changes

    // Socket event listeners
    useSocketListeners({
        socket,
        setStatus,
        setCoins,
        setUser,
        setOpponentAvatar,
        setIsGameStarted,
        setUserChoice,
        setCoinResult,
        setGameResult,
        setRoundNumber,
        setPlayerWins,
        setOpponentWins,
        setIsFlipping,
        setTimer,
        user,
        timerRef
    });


    return (
        <>
            <TopBar user={user} coins={coins}/>
            <Container maxWidth="md"
                       sx={{backgroundColor: 'background.default', paddingBottom: '80px', paddingTop: '16px'}}>
                {/* Main Content */}
                <Box sx={{paddingBottom: '80px', paddingTop: '16px', backgroundColor: 'background.default'}}>
                    {activeMenu === 'game' && (
                        <GameSection
                            user={user}
                            opponentAvatar={opponentAvatar}
                            status={status}
                            isGameStarted={isGameStarted}
                            userChoice={userChoice}
                            coinResult={coinResult}
                            gameResult={gameResult}
                            isFlipping={isFlipping}
                            roundNumber={roundNumber}
                            maxRounds={maxRounds}
                            playerWins={playerWins}
                            opponentWins={opponentWins}
                            timer={timer}
                            socket={socket}
                            setStatus={setStatus}
                            setUserChoice={setUserChoice}
                            setIsFlipping={setIsFlipping}
                            onStartGameClick={onStartGameClick}
                        />
                    )}
                    {activeMenu === 'tasks' && (
                        <Tasks user={user} setCoins={setCoins}/>
                    )}
                    {activeMenu === 'leaderboard' && (
                        <Box mt={4}>
                            <Typography variant="h5" gutterBottom>
                                Leaderboard
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Coins</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboard.map((player, index) => (
                                            <TableRow key={player.telegramId}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{player.firstName}</TableCell>
                                                <TableCell>{player.coins}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    {activeMenu === 'account' && (
                        <Box mt={4}>
                            <Typography variant="h5" gutterBottom>
                                Account
                            </Typography>
                            <Typography variant="body1">
                                Manage your account details.
                            </Typography>
                            {/* Display account information and settings here */}
                            <Typography variant="h5" gutterBottom mt={4}>
                                Achievements
                            </Typography>
                            {user?.achievements?.length > 0 ? (
                                <List>
                                    {user.achievements.map((achievement: any) => (
                                        <ListItem key={achievement}>
                                            <ListItemIcon>
                                                <img
                                                    src={achievement_png}
                                                    alt={achievement}
                                                    style={{width: 24, height: 24}}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={achievement}/>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body1">
                                    No achievements unlocked yet.
                                </Typography>
                            )}
                        </Box>
                    )}
                    {activeMenu === 'invite' && (
                        <InviteScreen user={user}/>
                    )}
                </Box>
                <Menu socket={socket} setActiveMenu={setActiveMenu} setStatus={setStatus} setIsFlipping={setIsFlipping}
                      setLeaderboard={setLeaderboard} resetGameState={resetGameState} // Add this prop
                />
            </Container>
        </>

    );
};

export default App;
