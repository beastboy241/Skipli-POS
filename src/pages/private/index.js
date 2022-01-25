import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SignOutIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Switch, Route } from 'react-router-dom';
import Settings from './settings';
import Product from './product';
import Transaction from './transaction';
import Home from './home';
import AppBar from './styles';
import Drawer from './styles2';
import { useFirebase } from '../../components/FirebaseProvider';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/kodinge">
                Kodinge
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const mdTheme = createTheme();

function Private() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const { auth } = useFirebase();
    const handleSignOut = (e) => {
        auth.signOut();
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            <Switch>
                                <Route path="/" exact children="Home" />
                                <Route path="/product" children="Product" />
                                <Route path="/transaction" children="Transaction" />
                                <Route path="/settings" children="Settings" />
                            </Switch>
                        </Typography>
                        <IconButton onClick={handleSignOut} color="inherit">
                            <SignOutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>
                        <Route path="/" exact children={({ match, history }) => {
                            return <ListItem 
                            button
                            selected={match?true:false}
                            onClick={() => {
                                history.push('/')
                            }}
                            >
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        }} />
                        <Route path="/product" children={({ match, history }) => {
                            return <ListItem 
                            button
                            selected={match?true:false}
                            onClick={() => {
                                history.push('/product')
                            }}
                            >
                                <ListItemIcon>
                                    <StoreIcon />
                                </ListItemIcon>
                                <ListItemText primary="Product" />
                            </ListItem>
                        }} />
                        <Route path="/transaction" children={({ match, history }) => {
                            return <ListItem 
                            button
                            selected={match?true:false}
                            onClick={() => {
                                history.push('/transaction')
                            }}
                            >
                                <ListItemIcon>
                                    <ShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Transaction" />
                            </ListItem>
                        }} />
                        <Route path="/settings" children={({ match, history }) => {
                            return <ListItem 
                            button
                            selected={match?true:false}
                            onClick={() => {
                                history.push('/settings')
                            }}
                            >
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        }} />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Switch>
                            <Route path="/settings" component={Settings} />
                            <Route path="/product" component={Product} />
                            <Route path="/transaction" component={Transaction} />
                            <Route component={Home} />
                        </Switch>

                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Private;