export const fetchUserProfile = async (telegramId: string, backendUrl: string) => {
    try {
        const response = await fetch(`${backendUrl}/user/getCoins`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telegramId}),
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
