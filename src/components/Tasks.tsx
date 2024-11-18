import React, {useState, useEffect} from 'react';
import {
    Tabs,
    Tab,
    Box,
    Typography,
    List,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    LinearProgress,
    ButtonBase,
} from '@mui/material';

interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    reward: number;
    category: 'youtube' | 'special' | 'referral' | 'league';
    link?: string;
    progress?: number;
    goal?: number;
}

interface TasksProps {
    user: any;
    setCoins: (coins: number) => void;
}

const initialTasks: Task[] = [
    {
        id: 1,
        title: 'Watch Intro Video',
        description: 'Learn how to play by watching this video.',
        isCompleted: false,
        reward: 50,
        category: 'youtube',
        link: 'https://www.youtube.com/watch?v=example',
    },
    {
        id: 5,
        title: 'Watch Amazing Video',
        description: 'Learn how to play by watching this video.',
        isCompleted: false,
        reward: 100,
        category: 'youtube',
        link: 'https://www.youtube.com/watch?v=example',
    },
    {
        id: 2,
        title: 'Join Telegram Channel',
        description: 'Stay updated by joining our Telegram channel.',
        isCompleted: false,
        reward: 30,
        category: 'special',
        link: 'https://t.me/your_channel',
    },
    {
        id: 6,
        title: 'Join Telegram Channel Now',
        description: 'Stay updated by joining our Telegram channel.',
        isCompleted: false,
        reward: 30,
        category: 'special',
        link: 'https://t.me/your_channel',
    },
    {
        id: 3,
        title: 'Refer 1 Friend',
        description: 'Refer a friend to earn coins.',
        isCompleted: false,
        reward: 20,
        category: 'referral',
        progress: 0,
        goal: 1,
    },
    {
        id: 4,
        title: 'Refer 3 Friends',
        description: 'Refer 3 friends to earn more coins.',
        isCompleted: false,
        reward: 60,
        category: 'referral',
        progress: 0,
        goal: 3,
    },
    // Add more tasks as needed
];

const Tasks: React.FC<TasksProps> = ({user}) => {
    const [currentTab, setCurrentTab] = useState('youtube');
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const filteredTasks = tasks.filter((task) => task.category === currentTab);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setOpenModal(true);
    };

    const handleTaskAction = (task: Task) => {
        window.open(task.link, '_blank');

        if (task.category === 'youtube' || task.category === 'special') {
            completeTask(task.id);
        }

        setOpenModal(false);
    };

    const completeTask = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, isCompleted: true} : task
            )
        );

        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            // setCoins((prevCoins: number) => prevCoins + task.reward);
        }
    };

    // Update referral tasks based on user's referral count
    useEffect(() => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => {
                if (task.category === 'referral') {
                    const isCompleted = user.referralCount >= task.goal!;
                    return {
                        ...task,
                        progress: 5, // Example progress
                        isCompleted,
                    };
                }
                return task;
            })
        );
    }, [user.referralCount]);

    // League data
    const leagues = [
        {name: 'Bronze', minCoins: 0, maxCoins: 999},
        {name: 'Silver', minCoins: 1000, maxCoins: 4999},
        {name: 'Gold', minCoins: 5000, maxCoins: 9999},
        {name: 'Platinum', minCoins: 10000, maxCoins: Infinity},
    ];

    const userLeague = leagues.find(
        (league) => user.coins >= league.minCoins && user.coins <= league.maxCoins
    );

    const getNextLeagueName = (currentLeagueName: string | undefined) => {
        const currentIndex = leagues.findIndex(
            (league) => league.name === currentLeagueName
        );
        if (currentIndex >= 0 && currentIndex < leagues.length - 1) {
            return leagues[currentIndex + 1].name;
        }
        return 'Max League';
    };

    const getLeagueProgress = (coins: number, league: any) => {
        if (!league) return 0;
        const range = league.maxCoins - league.minCoins;
        const progress = ((coins - league.minCoins) / range) * 100;
        return Math.min(progress, 100);
    };

    return (
        <Box sx={{backgroundColor: '#f0f8ff', minHeight: '100vh', padding: '16px'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="YouTube" value="youtube" sx={{color: currentTab === 'youtube' ? '#333' : '#888'}}/>
                    <Tab label="Special" value="special" sx={{color: currentTab === 'special' ? '#333' : '#888'}}/>
                    <Tab label="Referral" value="referral" sx={{color: currentTab === 'referral' ? '#333' : '#888'}}/>
                    <Tab label="Leagues" value="league" sx={{color: currentTab === 'league' ? '#333' : '#888'}}/>
                </Tabs>
            </Box>

            {currentTab !== 'league' ? (
                <List>
                    {filteredTasks.map((task) => (
                        <ButtonBase
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            sx={{
                                display: 'block',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                minHeight: '100px',
                                maxHeight: '100px',
                                width: '100%',
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" color="#333" fontWeight="bold">
                                        {task.title}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" color="#666">
                                            {task.description}
                                        </Typography>
                                        {task.progress !== undefined && task.goal !== undefined && (
                                            <Box sx={{mt: 1, mb: 2}}> {/* Added 'mb: 2' for margin bottom */}
                                                {/* Display the progress text above the progress bar */}
                                                <Typography
                                                    variant="caption"
                                                    color="#888"
                                                    align="center"
                                                    sx={{display: 'block', mb: 1}}  // Spacing below the text
                                                >
                                                    {`${task.progress}/${task.goal}`}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={Math.min(100, (task.progress / task.goal) * 100)} // Ensure progress stays between 0-100
                                                    sx={{height: '8px', borderRadius: '4px'}}
                                                />
                                            </Box>
                                        )}
                                    </>
                                }
                            />
                        </ButtonBase>
                    ))}
                </List>
            ) : (
                <Box sx={{p: 2, textAlign: 'center'}}>
                    <Typography variant="h6">Your League</Typography>
                    <Typography variant="h4" color="primary" sx={{mt: 2}}>
                        {userLeague?.name} League
                    </Typography>
                    <Typography variant="body1" sx={{mt: 1}}>
                        Coins: {user.coins}
                    </Typography>
                    <Typography variant="body2" color="#666" sx={{mt: 1}}>
                        Next League: {getNextLeagueName(userLeague?.name)}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={getLeagueProgress(user.coins, userLeague)}
                        sx={{mt: 2, height: '8px', borderRadius: '4px'}}
                    />
                </Box>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>{selectedTask?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{selectedTask?.description}</Typography>
                    <Typography variant="body2" color="primary" sx={{mt: 2}}>
                        Reward: {selectedTask?.reward} coins
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {selectedTask?.link && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleTaskAction(selectedTask!)}
                        >
                            {selectedTask?.category === 'youtube' ? 'Watch Video' : 'Go'}
                        </Button>
                    )}
                    <Button onClick={() => setOpenModal(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tasks;
