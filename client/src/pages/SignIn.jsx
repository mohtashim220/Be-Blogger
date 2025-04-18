import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInstart, signInSuccess, signInFailure } from "../redux/user/userslice";
import OAuth from "../components/OAuth";
import style from "./SignIn.module.css";


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     
    try {
      dispatch(signInstart());
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));

      console.log(data);
       
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="">
      <div className="p-3 max-w-lg mx-auto">
        <form
          onSubmit={handleSubmit}
          className={`${style.SignInForm} flex flex-col gap-4 `}
        >
          <h1 className={`${style.h1} text-3xl text-center font-semibold `}>
            Sign In
          </h1>
          <input
            type="email"
            placeholder="email"
            className={`${style.firstIn} border p-3 rounded-lg`}
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className={`${style.firstIn} border p-3 rounded-lg`}
            id="password"
            onChange={handleChange}
          />

          <button disabled={loading} className={`${style.SnBtn}  `}>
            {loading ? "loading..." : "Sign In"}
          </button>
          <OAuth></OAuth>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Dont have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-t">{error}</p>}
      </div>
    </div>
  );
}