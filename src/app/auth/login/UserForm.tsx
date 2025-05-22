"use client";

import {
  CreateAccount,
  DontHaveAccount,
  EmailAddress,
  ForgotPassword,
  Href,
  ImagePath,
  OrSignInWith,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
} from "@/constants";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "../../../../public/assets/images/logo/logo.png";
import imageTwo from "../../../../public/assets/images/logo/logo_dark.png";
import { UserSocialApp } from "./UserSocialApp";
import { useRegistrationType } from "@/hooks/useWebsiteSettings";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useSignMessage } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import axios from "axios";
import { ROUTES } from "@/api/route";
import { IApiResponse } from "@/types";
import Web3RegistrationForm from "./Web3RegistrationForm";
import { SiweMessage } from "siwe";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux-toolkit/Hooks";
import { setShowDashboardPopup } from "@/redux-toolkit/slices/userSlice";

export const checkWalletAddress = async (address: string): Promise<boolean> => {
  try {
    // console.log(`Checking wallet address: ${address}`);
    const result = await axios.get<IApiResponse<boolean>>(
      ROUTES.USER.CHECK_WALLET({ address })
    );
    return result.data.success && result.data.statusCode === 200
      ? result.data.data
      : false;
  } catch (error) {
    toast.error("Server Error, Please try later");
    console.error("Check wallet error:", error);
    return false;
  }
};

const UserForm = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("krish");
  const [password, setPassword] = useState("test");
  const [showRegForm, setShowRegForm] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const impersonateToken = searchParams.get("impersonate");
  const registrationType = useRegistrationType() ?? "web3";
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const hasRunAddressExistUseEffect = useRef(false);
  const dispatch = useAppDispatch();

  // console.log("registrationType", registrationType);
  // Handle normal form submission
  const formSubmitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/dashboard/default",
    });

    // console.log("result", result);
    if (result?.ok) {
      toast.success("Successfully Logged in. Redirecting...");
      router.push("/dashboard/default");
    } else {
      toast.error("Invalid Credentials...");
    }
  };

  // Handle wallet connection and login
  useEffect(() => {
    if (hasRunAddressExistUseEffect.current) return;

    const handleWalletLogin = async () => {
      // console.log("isConnected",isConnected);
      if (!isConnected || !address || isCheckingAddress) {
        // Handle disconnection
        if (!isConnected) {
          console.log("Handle Wallet Disconnection");
          setShowRegForm(false);
          localStorage.removeItem("showWeb3RegForm");
        }
        return;
      }

      hasRunAddressExistUseEffect.current = true;
      setIsCheckingAddress(true);

      try {
        // Ensure user is on BSC chain
        if (chain?.id !== wagmiConfig.chains[0].id) {
          try {
            await switchChainAsync({ chainId: wagmiConfig.chains[0].id });
          } catch (error) {
            toast.error(
              "Failed to switch to BSC chain. Please switch manually."
            );
            return;
          }
        }

        // Check if wallet address exists in database
        const addressExists = await checkWalletAddress(address);
        if (addressExists) {
          // Login existing user with SIWE
          try {
            // Fetch nonce from backend
            // console.log(
            //   "Fetching nonce for login:",
            //   `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`
            // );
            const nonceResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`,
              { credentials: "include" }
            );
            if (!nonceResponse.ok) {
              throw new Error(
                `Failed to fetch nonce: ${nonceResponse.statusText}`
              );
            }
            const response = await nonceResponse.json();
            const nonce = response.data.nonce;
            // console.log("Received nonce for login:", nonce);

            // Create SIWE message
            const siweMessage = new SiweMessage({
              domain: window.location.host || "localhost:3000",
              address,
              statement: "Sign in with Ethereum to the app.",
              uri: window.location.origin,
              version: "1",
              chainId: chain?.id || wagmiConfig.chains[0].id,
              nonce,
            });
            // console.log("SIWE message for login:", siweMessage);

            // Sign the message
            const message = siweMessage.prepareMessage();
            // console.log("Prepared message for signing:", message);
            const signature = await signMessageAsync({ message });
            // console.log("Signature for login:", signature);

            // Log in using SIWE
            console.log("Calling signIn with SIWE credentials");
            const loginResult = await signIn("siwe", {
              redirect: false,
              message: JSON.stringify(siweMessage),
              signature,
              callbackUrl: "/dashboard/default",
            });

            if (loginResult?.error) {
              console.error("SIWE login error:", loginResult.error);
              toast.error("Wallet login failed: " + loginResult.error);
              return;
            }

            console.log("SIWE login successful:", loginResult);
            localStorage.removeItem("showWeb3RegForm");
            toast.success("Successfully Logged in. Redirecting...");
            dispatch(setShowDashboardPopup(true));
            router.push("/dashboard/default");
          } catch (error) {
            console.error("SIWE login error:", error);
            toast.error("Wallet login failed. Please try again.");
          }
        } else {
          // Show registration form
          setShowRegForm(true);
          localStorage.setItem("showWeb3RegForm", "true");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Wallet login error:", error);
      } finally {
        setIsCheckingAddress(false);
      }
    };

    handleWalletLogin();
  }, [
    isConnected,
    address,
    chain,
    switchChainAsync,
    router,
    isCheckingAddress,
    signMessageAsync,
  ]);

  // Handle impersonate login
  useEffect(() => {
    if (impersonateToken) {
      const impersonateLogin = async () => {
        const result = await signIn("impersonate", {
          token: impersonateToken,
          redirect: false,
          callbackUrl: "/dashboard/default",
        });

        if (result?.ok) {
          toast.success("Successfully Logged in. Redirecting...");
          router.push("/dashboard/default");
        } else {
          toast.error("Invalid Credentials...");
        }
      };
      impersonateLogin();
    }
  }, [impersonateToken]);

  // Restore showRegForm state on page load
  useEffect(() => {
    if (isConnected && address) {
      const storedShowRegForm = localStorage.getItem("showWeb3RegForm");
      if (storedShowRegForm === "true") {
        setShowRegForm(true);
      }
    }
  }, [isConnected, address]);

  // Normal login form
  const normalLoginForm = (
    <Form className="theme-form" onSubmit={formSubmitHandle}>
      <h4>{SignInToAccount}</h4>
      <p>{"Enter your email & password to login"}</p>
      <FormGroup>
        <Label className="col-form-label">{EmailAddress}</Label>
        <Input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Test123@gmail.com"
        />
      </FormGroup>
      <FormGroup>
        <Label className="col-form-label">{Password}</Label>
        <div className="form-input position-relative">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Test@123"
          />
          <div className="show-hide" onClick={() => setShow(!show)}>
            <span className="show" />
          </div>
        </div>
      </FormGroup>
      <div className="form-group mb-0">
        <div className="checkbox p-0">
          <Input id="checkbox1" type="checkbox" />
          <Label className="text-muted" htmlFor="checkbox1">
            {RememberPassword}
          </Label>
        </div>
        <Link className="link" href={Href}>
          {ForgotPassword}?
        </Link>
        <div className="text-end mt-3">
          <Button type="submit" color="primary" block>
            {SignIn}
          </Button>
        </div>
      </div>
      <h6 className="text-muted mt-4 or">{OrSignInWith}</h6>
      <UserSocialApp />
      <p className="mt-4 mb-0 text-center">
        {DontHaveAccount}
        <Link className="ms-2" href={"/auth/register"}>
          {CreateAccount}
        </Link>
      </p>
    </Form>
  );

  // Web3 login with Connect Wallet button
  const web3Login = (
    <div className="web3-login-form">
      <h4>{SignInToAccount}</h4>
      <p>{"Connect your wallet to login or register"}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
    </div>
  );

  // Render loading state while checking address
  if (isCheckingAddress) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Link className="logo" href="/dashboard/default">
          <Image
            priority
            width={100}
            height={100}
            className="img-fluid for-light"
            src={imageOne}
            alt="login page"
          />
          <Image
            priority
            width={100}
            height={100}
            className="img-fluid for-dark"
            src={imageTwo}
            alt="login page"
          />
        </Link>
      </div>
      <div className="login-main">
        {registrationType === "normal" ? (
          normalLoginForm
        ) : showRegForm && isConnected ? (
          <Web3RegistrationForm address={address} chainId={chain?.id} />
        ) : (
          web3Login
        )}
      </div>
    </div>
  );
};

export default UserForm;
