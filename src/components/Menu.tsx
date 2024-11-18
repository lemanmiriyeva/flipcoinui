import React, {useState} from 'react';
import {useGameHandlers} from '../hooks/useGameHandlers';
import {BottomNavigation, BottomNavigationAction} from '@mui/material';
import {SportsEsports, Assignment, Leaderboard, AccountCircle} from '@mui/icons-material';
import theme from "../theme.ts";
import PersonAddIcon from '@mui/icons-material/PersonAdd';



type MenuOption = 'game' | 'tasks' | 'leaderboard' | 'account' | 'invite';


interface MenuProps {
    socket: any;
    setStatus: (status: string) => void;
    setLeaderboard: (data: any[]) => void;
    setIsFlipping: (isFlipping: boolean) => void;
    setActiveMenu: (menu: MenuOption) => void;
    resetGameState: () => void;
}

const Menu: React.FC<MenuProps> = ({socket, setStatus, setLeaderboard, setIsFlipping, setActiveMenu, resetGameState}) => {
    const [value, setValue] = useState<MenuOption>('game');
    // const theme = useTheme();
    const {handleMenuClick} = useGameHandlers(socket, setStatus, setLeaderboard, setIsFlipping);

    const handleChange = (_event: React.SyntheticEvent, newValue: MenuOption) => {
        setValue(newValue);
        handleMenuClick(newValue, setActiveMenu);
        if (newValue === 'game') {
            resetGameState();
        } else if (newValue === 'invite') {
            // Any additional logic for invite menu
        }
    };

    return (
        <BottomNavigation value={value} onChange={handleChange} showLabels sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'primary.main',
            color: 'theme.palette.text.secondary'
        }}>
            <BottomNavigationAction label="Game" value="game" icon={<SportsEsports/>}
                                    sx={{
                                        backgroundColor: value === 'game' ? theme.palette.secondary.main : 'primary.main',
                                    }}
            />
            <BottomNavigationAction label="Tasks" value="tasks" icon={<Assignment/>}
                                    sx={{
                                        backgroundColor: value === 'tasks' ? theme.palette.secondary.main : 'primary.main',
                                    }}
            />
            <BottomNavigationAction label="Leaderboard" value="leaderboard" icon={<Leaderboard/>}
                                    sx={{
                                        backgroundColor: value === 'leaderboard' ? theme.palette.secondary.main : 'primary.main',
                                    }}
            />
            <BottomNavigationAction label="Account" value="account" icon={<AccountCircle/>}
                                    sx={{
                                        backgroundColor: value === 'account' ? theme.palette.secondary.main : 'primary.main',
                                    }}
            />
            <BottomNavigationAction
                label="Invite"
                value="invite"
                icon={<PersonAddIcon />}
                sx={{ backgroundColor: value === 'invite' ? theme.palette.secondary.main : 'primary.main' }}
            />
        </BottomNavigation>);
};

export default Menu;
