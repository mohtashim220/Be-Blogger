import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import style from "./SignUp.module.css";

const passwordValidationRegex = {
  minLength: /(?=.{8,})/, // At least 8 characters
  upperCase: /(?=.*[A-Z])/, // At least one uppercase letter
  lowerCase: /(?=.*[a-z])/, // At least one lowercase letter
  number: /(?=.*\d)/, // At least one number
  specialCharacter: /(?=.*[!@#$%^&*])/ // At least one special character
};

const handleChange = (e) => {
  setPassword(e.target.value);
};


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  };
  console.log(formData);
  const handleSubmit = async (e) => {
    console.log(formData.password)

    if (!passwordValidationRegex.minLength.test(formData.password)) {
      setErrorMessage('Password must be at least 8 characters long.');
      e.preventDefault();
  } else if (!passwordValidationRegex.upperCase.test(formData.password)) {
      setErrorMessage('Password must contain at least one uppercase letter.');
      e.preventDefault();
  } else if (!passwordValidationRegex.lowerCase.test(formData.password)) {
      setErrorMessage('Password must contain at least one lowercase letter.');
      e.preventDefault();
      
  } else if (!passwordValidationRegex.number.test(formData.password)) {
      setErrorMessage('Password must contain at least one number.');
      e.preventDefault();
  } else if (!passwordValidationRegex.specialCharacter.test(formData.password)) 
  {
      setErrorMessage('Password must contain at least one special character.');
      e.preventDefault();
  }
else{




    e.preventDefault();
    
    try {
       setLoading(true);
       const res = await fetch("/api/auth/signup", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
       });
       const data = await res.json();
       if (data.success === false) {
         setError(data.message);
         setLoading(false);
         return;
       }
       setLoading(false);

      console.log(data);
      setError(null)
      navigate('/sign-in');
      
    } catch (error){
      setLoading(false);
      setError(error.message);
      
    }
   
  }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`${style.SignUpForm} flex flex-col gap-4 `}
      >
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <input
          type="text"
          placeholder="username"
          className={` ${style.SnUpinput} border p-3 rounded-lg`}
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className={` ${style.SnUpinput} border p-3 rounded-lg`}
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className={` ${style.SnUpinput} border p-3 rounded-lg`}
          id="password"
          onChange={handleChange}
        />

{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button
          disabled={loading}
          className={`${style.SnUpBtn}`}
        >
          {loading ? "loading..." : "Sign Up"}
        </button>

         

        <OAuth></OAuth>

        
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-t">{error}</p>}
    </div>
  );

}
