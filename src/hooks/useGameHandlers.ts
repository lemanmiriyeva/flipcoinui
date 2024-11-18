import { useState } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useGameHandlers = (socket: any, setStatus: (status: string) => void, setLeaderboard: (data: any[]) => void, setIsFlipping: (isFlipping: boolean) => void) => {
    const [userChoice, setUserChoice] = useState<'heads' | 'tails' | null>(null);

    const handleMenuClick = (menu: 'game' | 'tasks' | 'leaderboard' | 'account' | 'invite', setActiveMenu: (menu: 'game' | 'tasks' | 'leaderboard' | 'account' | 'invite') => void) => {
        setActiveMenu(menu);
        if (menu === 'leaderboard') {
            fetch(`${backendUrl}/user/leaderboard`)
                .then((response) => response.json())
                .then((data) => {
                    setLeaderboard(data.leaderboard);
                })
                .catch((error) => {
                    console.error('Error fetching leaderboard data:', error);
                });
        }
    };

    const handleChoice = (choice: 'heads' | 'tails') => {
        if (userChoice) return; // Prevent multiple choices in the same round
        setUserChoice(choice);
        setStatus('Waiting for the result...');
        setIsFlipping(true);

        // Send choice to backend
        socket.emit('makeChoice', { choice });
    };

    return { handleMenuClick, handleChoice, userChoice };
};
