// useTimer.ts
import {useEffect, useState} from 'react';

export const useTimer = (
    initialTime: number,
    isActive: boolean,
    onTimeUp: () => void
) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (!isActive) return;

        const timerId = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    onTimeUp();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [isActive]);

    return time;
};
