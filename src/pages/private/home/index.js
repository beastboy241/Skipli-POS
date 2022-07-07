import React, { useState, useEffect } from 'react'

// material ui
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

// icons
import ImageIcon from '@material-ui/icons/Image';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../components/AppPageLoading'
import useStyles from './styles';


const Home = () => {
    //const { auth } = useFirebase();
    return <>
        <h1>Main Home - Welcome </h1>
        
    </>
}

export default Home;