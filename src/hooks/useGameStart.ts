import {fetchUserProfile} from '../utils/api';
import defaultAvatar from '../assets/default-avatar.png';


export const useGameStart = (
    socket: any,
    setUserChoice: (choice: 'heads' | 'tails' | null) => void,
    setCoinResult: (result: 'heads' | 'tails' | null) => void,
    setGameResult: (result: 'win' | 'lose' | 'tie' | null) => void,
    setPlayerWins: (wins: number) => void,
    setOpponentWins: (wins: number) => void,
    setStatus: (status: string) => void,
    backendUrl: string,
    setCoins: (coins: number) => void,
    setUser: (user: any) => void,
) => {
    const onStartGameClick = async (user: any) => {
        console.log("User inside onMainButtonClick:", user); // Log the user state here

        setGameResult(null); // Reset game result
        setStatus('Joining game...');
        setUserChoice(null);
        setCoinResult(null);
        setPlayerWins(0);
        setOpponentWins(0);

        socket.emit('joinGame', {
            telegramId: 2,
            firstName: "laman",
            avatar: defaultAvatar,
        });

        setStatus('Joining game...');

        if (!user) {
            setStatus('User data not available.');
            return;
        }

        // Fetch user profile
        try {
            fetchUserProfile(user.id, backendUrl)
                .then((data) => {
                    setCoins(data.coins);
                    setUser((prevUser: any) => ({...prevUser, achievements: data.achievements || []}));
                })
                .catch((error) => console.error('Error fetching user profile:', error));
        } catch (error) {
            console.error('Error fetching profile after joining game:', error);
        }
    };

    return {onStartGameClick};
};
