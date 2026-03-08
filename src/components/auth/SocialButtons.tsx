/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateSocialUser } from "@/services/userService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from "react-router-dom";


const SocialButtons = () => {
   const navigate = useNavigate();
   const location = useLocation();
  const createSocialUser = useCreateSocialUser();

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential) as any;

    const userData = {
      name: decoded.given_name + " " + decoded.family_name,
      email: decoded.email,
      image: decoded.picture,
      provider: "google",
      privacyPolicyAccepted: true,
    };

      const result = await createSocialUser.mutateAsync(userData,    {
          onSuccess: (data: any) => {
            const fromPath = (location.state as any)?.from?.pathname;
            const role = data?.data?.user?.role;
            const target = fromPath || (role === 'ADMIN' ? '/admin' : '/');
            navigate(target, { replace: true });
          },
        });
      const { accessToken, refreshToken, user } = result.data;

    console.log("User Data:", userData); 

  };

  // const handleFacebookClick = () => {
  //   console.log("Continue with Facebook");
  // };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-input" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-background text-muted-foreground">or</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
         <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
      />
        {/* <AuthButton
          variant="social"
          icon={<FacebookIcon />}
          onClick={handleFacebookClick}
        >
          Continue With Facebook
        </AuthButton> */}
      </div>
    </div>
  );
};

export default SocialButtons;