import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import ListItem from '@mui/material/ListItem';
import { Link, NavLink } from 'react-router-dom';
import { Box, IconButton, List } from '@mui/material';
import Badge from '@mui/material/Badge';
import { ShoppingCart } from '@mui/icons-material';
import { useAppSelector } from '../store/configureStore';
import SignedInMenu from './SignedMenu';

interface Props {
    checked: boolean,
    changeTheme: () => void
}

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
]

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
]

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    textDecoration: 'none',
    '&:hover': {
        color: 'secondary.main'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

const midLinksElems = midLinks.map(({ title, path }) => {
    return (
        <ListItem component={NavLink}
            to={path}
            key={path}
            sx={navStyles}>
            {title.toUpperCase()}
        </ListItem>
    )
})



const rightLinksElems = rightLinks.map(({ title, path }) => {
    return (
        <ListItem component={NavLink}
            to={path}
            key={path}
            sx={navStyles}>
            {title.toUpperCase()}
        </ListItem>
    )
})



export default function Header({ checked, changeTheme }: Props) {
    const { basket } = useAppSelector(state => state.basket);
    const { user } = useAppSelector(state => state.account);
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)
    return (
        <AppBar position='static' sx={{ mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6'
                        component={NavLink}
                        to='/'
                        sx={navStyles}> Store SkiNet</Typography>
                    <Switch checked={checked} onChange={changeTheme} />
                </Box>
                <Box>
                    <List sx={{ display: 'flex' }}>
                        {midLinksElems}
                    </List>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton component={Link} to={'/basket'}
                        size='large' sx={{ color: 'inherit' }}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user ? (<SignedInMenu />) : (<List sx={{ display: 'flex' }}>
                        {rightLinksElems}
                    </List>)}

                </Box>


            </Toolbar>
        </AppBar>
    )
} 