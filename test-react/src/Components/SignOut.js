import firebase from 'firebase/app';

const handleSignOut = () => {
  firebase.auth().signOut().then(() => {
    console.log('User signed out');
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
};
