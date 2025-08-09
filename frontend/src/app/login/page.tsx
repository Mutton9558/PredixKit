
import React from 'react'
import MetaMaskLogin from '../components/MetaMaskLogin'

const login = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("userAddress")) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="login-container">
        <div className="login">
          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: "0.5em" }}>Log in / Sign up</h1>
            <p style={{ fontSize: "1.25em" }}>
              Welcome onboard! <br /> Let's get you ready on your adventure with
              us.
            </p>
          </div>
          <MetaMaskLogin />
        </div>
      </div>
    </>
  );
};

export default login;
