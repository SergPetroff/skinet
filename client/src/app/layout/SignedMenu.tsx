import { Button, Menu, Fade, MenuItem } from "@mui/material";
import React from "react";
import { signOut } from "../../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { useNavigate  } from 'react-router-dom';
import { clearBasket } from "../../features/basket/basketSlice";


export default function SignedInMenu(){
    const navigate = useNavigate();
const dispatch = useAppDispatch();
const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
         color="inherit"
        onClick={handleClick}
        sx={{typography:'h6'}}
      >
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My orders</MenuItem>
        <MenuItem onClick={() => {
            dispatch(signOut());
            dispatch(clearBasket());
            navigate('/')
        }}>Logout</MenuItem>
      </Menu>
    </div>
  );
}