import React, {useEffect, useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';

interface InviteScreenProps {
    user: any;
}

interface ReferredUser {
    username: string;
    coins: number;
}

const InviteScreen: React.FC<InviteScreenProps> = ({user}) => {
    const [copied, setCopied] = useState(false);
    const referralLink = `https://t.me/GlobalMilliPracticeBot_bot?start=referral_${user.id}`;
    const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000); // Reset the "copied" state after 3 seconds
        });
    };

    useEffect(() => {
        // Fetch referred users from the backend when the component mounts
        fetch(`/api/referredUsers?userId=${user.id}`)
            .then((response) => response.json())
            .then(data => {
                setReferredUsers(data);
            })
            .catch(error => {
                console.error('Error fetching referred users:', error);
            });
    }, [user.id]);

    return (
        <Paper elevation={3} sx={{padding: 4, maxWidth: 400, margin: 'auto', textAlign: 'center'}}>
            <Typography variant="h4" gutterBottom>
                Invite a Friend
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Earn rewards for you and your friend!
            </Typography>

            {/* Referral Link Section */}
            <Box sx={{marginTop: 4, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2}}>
                <Typography variant="h6" gutterBottom>
                    My invite link:
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {referralLink}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCopyClick}
                    startIcon={<ContentCopy/>}
                    sx={{marginTop: 2}}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </Box>

            {/* Referred Users Table */}
            <Box sx={{marginTop: 4}}>
                <Typography variant="h6" gutterBottom>
                    My Referrals List:
                </Typography>
                {referredUsers.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell align="right">Coins</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {referredUsers.map((referredUser) => (
                                    <TableRow key={referredUser.username}>
                                        <TableCell>{referredUser.username}</TableCell>
                                        <TableCell align="right">{referredUser.coins}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body2" color="info">
                        You don't have referrals yet 😢
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default InviteScreen;
