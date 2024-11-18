import {MutableRefObject, useEffect} from 'react';
import defaultAvatar from "../assets/default-avatar.png";
import {fetchUserProfile} from "../utils/api.ts";

interface UseSocketListenersParams {
    socket: any;
    setStatus: (status: string) => void;
    setCoins: (coins: integer) => void;
    setUser: (user: any) => void,
    setOpponentAvatar: (avatar: string) => void;
    setIsGameStarted: (started: boolean) => void;
    setUserChoice: (choice: 'heads' | 'tails' | null) => void;
    setCoinResult: (result: 'heads' | 'tails' | null) => void;
    setGameResult: (result: 'win' | 'lose' | 'tie' | null) => void;
    setRoundNumber: (number: number) => void;
    setPlayerWins: (wins: number) => void;
    setOpponentWins: (wins: number) => void;
    setIsFlipping: (isFlipping: boolean) => void;
    setTimer: (time: number) => void;
    user: any;
    timerRef: MutableRefObject<NodeJS.Timeout | null>;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useSocketListeners = ({
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
                                       timerRef,
                                   }: UseSocketListenersParams) => {
    useEffect(() => {
        // Event handler functions
        const handleWaitingForPlayer = () => {
            setStatus('Waiting for another player...');
        };

        const handleGameStarted = (data: any) => {
            setStatus('Game started!');
            setOpponentAvatar(data.opponentAvatar || defaultAvatar);
            setIsGameStarted(true);

            // Reset game state
            setUserChoice(null);
            setCoinResult(null);
            setGameResult(null);
            setRoundNumber(0); // Initialize to 0
            setPlayerWins(0);
            setOpponentWins(0);
        };

        const handleNewRound = (data: any) => {
            const {roundNumber} = data;
            setRoundNumber(roundNumber);
            setStatus(`Round ${roundNumber} started!`);

            setUserChoice(null);
            setCoinResult(null);
            setGameResult(null);
            setIsFlipping(false);
            setTimer(60);
        };

        const handleAutoChoice = (choice: 'heads' | 'tails') => {
            setUserChoice(choice);
            setStatus(`Time's up! Auto-selected ${choice.toUpperCase()} for you.`);
        };

        const handleRoundResult = (data: any) => {
            const {coinResult, isWinner, playerWins, opponentWins} = data;
            console.log('handleResult: ' + JSON.stringify(data, null, 2));
            setCoinResult(coinResult);
            setPlayerWins(playerWins);
            setOpponentWins(opponentWins);
            setIsFlipping(false);

            if (isWinner) {
                setGameResult('win');
                setStatus(`You won this round! The coin landed on ${coinResult.toUpperCase()}.`);
            } else {
                setGameResult('lose');
                setStatus(`You lost this round. The coin landed on ${coinResult.toUpperCase()}.`);
            }
        };

        const handleGameOver = (data: any) => {

            // Reset the MainButton to allow starting a new game
            const tg = window.Telegram ? window.Telegram.WebApp : null;
            const userData = tg.initDataUnsafe?.user;

            const {winnerId} = data;

            console.log("handleGameOver called with data:", data);
            console.log("Current user state: ", user);
            console.log("Current winnerId: ", winnerId);


            if (!userData) { // Add this check
                console.error('User data is not available in handleGameOver');
                setStatus('User data is missing. Cannot determine game result.');
                return;
            }

            if (String(winnerId) === String(userData.id)) {
                setStatus('Congratulations! You won the game!');
                setGameResult('win');
                console.log("Congratulations! You won the game!")
            } else if (String(winnerId) === null) {
                setStatus('Game over. It\'s a tie.');
                setGameResult('tie');
                console.log("Game over. TIE");
            } else {
                setStatus('Game over. You lost the game.');
                console.log("Game over. Lost Game");
                setGameResult('lose');
            }

            // Fetch updated coins from backend
            fetchUserProfile(userData.id, backendUrl)
                .then((data) => {
                    setCoins(data.coins);
                    setUser((prevUser: any) => ({...prevUser, achievements: data.achievements || []}));
                })
                .catch((error) => console.error('Error fetching user profile:', error));

            // Clear timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setTimer(0);

            // if (tg) {
            //     tg.MainButton.setParams({text: 'Start Game', is_active: true});
            //     tg.MainButton.show();
            // }
        };

        const handleOpponentDisconnected = () => {
            setStatus('Your opponent has disconnected. Game over.');
            setIsGameStarted(false);
            // const tg = window.Telegram ? window.Telegram.WebApp : null;
            // if (tg) {
            //     tg.MainButton.show();
            // }

            // Reset game state
            setUserChoice(null);
            setCoinResult(null);
            setRoundNumber(0);
            setPlayerWins(0);
            setOpponentWins(0);

            // Clear timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setTimer(0);
        };

        const handleAchievementsUnlocked = (data: any) => {
            const {achievements} = data;
            achievements.forEach((achievement: any) => {
                alert(`Achievement Unlocked: ${achievement}`);
            });
            // Fetch updated user profile
            const tg = window.Telegram ? window.Telegram.WebApp : null;

            // if (tg) {
            //     tg.MainButton.setParams({is_active: false});
            //     tg.MainButton.hide();
            // }

            const userData = tg.initDataUnsafe?.user;
            // Fetch updated coins from backend
            fetchUserProfile(userData.id, backendUrl)
                .then((data) => {
                    setCoins(data.coins);
                    setUser((prevUser: any) => ({...prevUser, achievements: data.achievements || []}));
                })
                .catch((error) => console.error('Error fetching user profile:', error));
        };

        const handleConnect = () => {
            console.log('Socket connected:', socket.id);
            setStatus('Connected to server.');
        };

        const handleConnectError = (error: any) => {
            console.error('Socket connection error:', error);
            setStatus('Connection error.');
        };

        // Attach event listeners
        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('waitingForPlayer', handleWaitingForPlayer);
        socket.on('gameStarted', handleGameStarted);
        socket.on('newRound', handleNewRound);
        socket.on('autoChoice', handleAutoChoice);
        socket.on('roundResult', handleRoundResult);
        socket.on('gameOver', handleGameOver);
        socket.on('opponentDisconnected', handleOpponentDisconnected);
        socket.on('achievementsUnlocked', handleAchievementsUnlocked);

        // Cleanup on unmount
        return () => {
            socket.off('waitingForPlayer', handleWaitingForPlayer);
            socket.off('gameStarted', handleGameStarted);
            socket.off('newRound', handleNewRound);
            socket.off('autoChoice', handleAutoChoice);
            socket.off('roundResult', handleRoundResult);
            socket.off('gameOver', handleGameOver);
            socket.off('opponentDisconnected', handleOpponentDisconnected);
            socket.off('achievementsUnlocked', handleAchievementsUnlocked);
        };
    }, [socket, user, fetchUserProfile, setStatus, setOpponentAvatar, setIsGameStarted, setUserChoice, setCoinResult, setGameResult, setRoundNumber, setPlayerWins, setOpponentWins, setIsFlipping, setTimer]);
};
