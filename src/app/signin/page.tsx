import { GitHubButton } from "../components/GitHubButton";
import { GoogleButton } from "../components/GoogleButton";
// import { LinkedinButton } from "../components/LinkedinButton";
// import { SignInForm } from "../components/SignInForm";
// import { GitLabButton } from "../components/GitLabButton";

export default async function Signin() {

  return (
    <div className="signIn">
      <div className="signIn__container">
        <h1 className="signIn__title">Log in your account</h1>
        <GoogleButton />
        <GitHubButton />
        {/* <div>or</div>
      <GitLabButton /> */}
        {/* <LinkedinButton />  */}
        {/* <div>or</div> */}
        {/* <SignInForm /> */}
      </div>

    </div>
  )
}
