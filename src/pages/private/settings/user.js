import React, {useRef, useState} from 'react'

//material ui
import { TextField } from '@material-ui/core';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';

import isEmail from 'validator/lib/isEmail';
import useStyles from './styles/user';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

function User() {
  const classes = useStyles();
  const { user } = useFirebase();
  const [error, setError ] = useState({
    displayName: '',
    email: '',
    password: ''
  })
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setSubmitting] = useState(false)
  const displayNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const saveDisplayName = async (e) => {
    const displayName = displayNameRef.current.value;
    console.log(displayName);

    if(!displayName) {
      setError({
        displayName: 'Name is required'
      })
    } else if (displayName !== user.displayName) {
      setError({
        displayName: '',
        email: ''
      })
      setSubmitting(true)
      await user.updateProfile({
        displayName
      })
      enqueueSnackbar('Data have saved successfully!', {variant: 'success'})
      setSubmitting(false)
    }
  }

  const updateEmail = async (e) => {
    const email = emailRef.current.value;
    if (!email) {
      setError({
        email: 'Email is required'
      })
    } else if (!isEmail(email)) {
      setError({
        email: 'Email is invalid'
      })
    } else if (email !== user.email) {
      setError({
        email: ''
      })
      setSubmitting(true)
      try {
        await user.updateEmail(email)

        enqueueSnackbar('Email have saved successfully!', {variant: 'success'});
      } catch (e) {
        let emailError = '';
        switch (e.code) {
          case 'auth/email-alredy-in-use':
            emailError = 'This Email is already in use by another user';
            break;
          case 'auth/invalid-email':
            emailError = 'Email is invalid';
            break;
          case 'auth/requires-recent-login':
            emailError = 'Please log back in to update your email';
            break;
          default:
            emailError = 'Error, please try again!';
            break;
        }

        setError({
          email: emailError
        })
      }
      setSubmitting(false)
    }
  }

  const sendEmailVerification = async (e) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/login`
    }

    setSubmitting(true);
    await user.sendEmailVerification(actionCodeSettings);
    enqueueSnackbar(`A verification email has been sent to ${emailRef.current.value}`, {variant: 'success'});
    setSubmitting(false);
  }

  // https://firebase.google.com/docs/reference/js/firebase.User#updatepassword
  const updatePassword = async (e) => {
    const password = passwordRef.current.value;

    if (!password) {
      setError({
        password: 'Password is required'
      })
    } else {
      setSubmitting(true)
      try {
        await user.updatePassword(password)

        enqueueSnackbar('Password successfully updated', {variant: 'success'})
      } catch (e) {
        let errorPassword = '';
        switch (e.code) {
          case 'auth/weak-password':
            errorPassword = 'Weak Password'
            break;
          case 'auth/requires-recent-login':
            errorPassword = 'Please log back in to update your password'
            break;
          default:
            errorPassword = 'Error, please try again!'
            break;
        }
        setError({
          password: errorPassword
        })
      }
      setSubmitting(false)
    }
  }
  
  return <div className={classes.userSetting}>
    <TextField
      id="displayName"
      name="displayName"
      label="Name"
      margin="normal"
      defaultValue={user.displayName}
      inputProps={{
        ref: displayNameRef,
        onBlur: saveDisplayName
      }}
      disabled={isSubmitting}
      helperText={error.displayName}
      error={error.displayName ? true : false}/>
     <TextField
              id="email"
              name="email"
              label="Email"
              margin="normal"
              type="email"
              defaultValue={user.email}
              inputProps={{
                ref: emailRef,
                onBlur: updateEmail
              }}
              disabled={isSubmitting}
              helperText={error.email}
              error={error.email ? true : false}
            />
       {
              user.emailVerified?
              <Typography color="primary" variant="subtitle1">Verified Email</Typography>
              :
              <Button
                variant="outlined"
                onClick={sendEmailVerification}
                disabled={isSubmitting}
              >
                Send verification email
              </Button>
            }

            <TextField
              id="password"
              name="password"
              label="New Password"
              type="password"
              margin="normal"
              inputProps={{
                ref: passwordRef,
                onBlur: updatePassword
              }}
              autoComplete="new-password"
              disabled={isSubmitting}
              helperText={error.password}
              error={error.password ? true : false}
            />
          
  </div>


}

export default User;


