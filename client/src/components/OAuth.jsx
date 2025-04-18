import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInstart, signInSuccess, signInFailure } from "../redux/user/userslice";
import style from "../pages/SignIn.module.css"

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
       

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photos: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    }
    catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className={`${style.SnBtn1}`}
    >
      Continue with google
    </button>
  );
}
