import React from 'react';
import defaultAvatar from '../assets/default-avatar.png';
import {AppBar, Avatar, Box, Toolbar, Typography} from "@mui/material";
import CurrencyBitcoinOutlinedIcon from '@mui/icons-material/CurrencyBitcoinOutlined';

const TopBar: React.FC<{ user: any; coins: number }> = ({user, coins}) => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Avatar src={user?.photo_url || defaultAvatar}/>
                <Typography variant="h6" component="div" sx={{flexGrow: 1, marginLeft: 2}}>
                    {user?.first_name || 'Guest'}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <CurrencyBitcoinOutlinedIcon/>
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>
                        {coins}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
