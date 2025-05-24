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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import imageOne from "../../../../public/assets/images/logo/logo.png";
import imageTwo from "../../../../public/assets/images/logo/logo_dark.png";
import { UserSocialApp } from "./UserSocialApp";
import { useRegistrationType } from "@/hooks/useWebsiteSettings";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useSignMessage, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import axios from "axios";
import { ROUTES } from "@/api/route";
import { IApiResponse } from "@/types";
import Web3RegistrationForm from "./Web3RegistrationForm";
import { SiweMessage } from "siwe";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux-toolkit/Hooks";
import { setShowDashboardPopup, existingUpdateUserAsync } from "@/redux-toolkit/slices/userSlice";
import { useCompanyTokenContract, useComapnyBscAddress } from "@/hooks/useCompanyInfo";
import { contractAbi } from "@/ABI/contract";
import { abi as usdtAbi } from "@/ABI/usdtAbi";
import { parseUnits, maxUint256, isAddress } from "viem";

interface WalletCheckResponse {
  isRegistered: boolean;
  toPay: number;
}

export const checkWalletAddress = async (address: string): Promise<WalletCheckResponse> => {
  try {
    const result = await axios.get<IApiResponse<{ isRegistered: boolean; toPay: number }>>(
      ROUTES.USER.CHECK_WALLET({ address })
    );
    if (result.data.success && result.data.statusCode === 200) {
      return result.data.data;
    }
    return { isRegistered: false, toPay: 0 };
  } catch (error) {
    toast.error("Server Error, Please try later");
    console.error("Check wallet error:", error);
    return { isRegistered: false, toPay: 0 };
  }
};


const UserForm = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("krish");
  const [password, setPassword] = useState("test");
  const [showRegForm, setShowRegForm] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<"approving" | "depositing" | null>(null);
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | null>(null);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [isWalletInteractionOpen, setIsWalletInteractionOpen] = useState(false);
  const [toPayAmount, setToPayAmount] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const impersonateToken = searchParams.get("impersonate");
  const registrationType = useRegistrationType() ?? "web3";
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync, isPending: isWritingContract } = useWriteContract();
  const hasRunAddressExistUseEffect = useRef(false);
  const dispatch = useAppDispatch();
  const tokenContract = useCompanyTokenContract();
  const companyBscAddress = useComapnyBscAddress();

  // USDT payment amount
  const AMOUNT = useMemo(() => parseUnits(toPayAmount.toString(), 18), [toPayAmount]);

  // Check USDT balance
  const { data: usdtBalance } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: usdtAbi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address && toPayAmount > 0 },
  });

  // Check USDT allowance
  const { data: usdtAllowance } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: usdtAbi,
    functionName: "allowance",
    args: [address!, companyBscAddress as `0x${string}`],
    query: { enabled: !!address && !!companyBscAddress && toPayAmount > 0 },
  });

  // Wait for approval transaction receipt
  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    error: approvalError,
  } = useWaitForTransactionReceipt({
    hash: approvalTxHash || undefined,
  });

  // Wait for deposit transaction receipt
  const {
    isLoading: isDepositConfirming,
    isSuccess: isDepositConfirmed,
    error: depositError,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash || undefined,
  });

  // Handle approval confirmation or error
  useEffect(() => {
    if (isApprovalConfirmed && approvalTxHash && !hasDeposited) {
      toast.success(
        <>
          USDT allowance approved!{" "}
          <a
            href={`https://testnet.bscscan.com/tx/${approvalTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on BscScan
          </a>
        </>
      );
      setIsProcessingPayment("depositing");
      const initiateDeposit = async () => {
        const depositToastId = toast.loading("Initiating USDT deposit...");
        try {
          if (!companyBscAddress) {
            throw new Error("Company BSC address not found");
          }
          const depositTx = await writeContractAsync({
            address: companyBscAddress as `0x${string}`,
            abi: contractAbi,
            functionName: "package",
            args: [AMOUNT],
          });
          toast.dismiss(depositToastId);
          toast.success("Deposit transaction sent!");
          setDepositTxHash(depositTx);
          setHasDeposited(true);
        } catch (error: any) {
          toast.dismiss(depositToastId);
          toast.error(
            error.message?.includes("User rejected")
              ? "Transaction rejected by user"
              : error.message || "Deposit failed"
          );
          setIsProcessingPayment(null);
          setIsWalletInteractionOpen(false);
        }
      };
      initiateDeposit();
    } else if (approvalError && approvalTxHash) {
      toast.error(`Approval failed: ${approvalError.message || "Unknown error"}`);
      setIsProcessingPayment(null);
      setApprovalTxHash(null);
      setIsWalletInteractionOpen(false);
    }
  }, [isApprovalConfirmed, approvalError, approvalTxHash, hasDeposited, writeContractAsync, companyBscAddress, AMOUNT]);

  // Handle deposit confirmation or error
  useEffect(() => {
    if (isDepositConfirmed && depositTxHash) {
      toast.success(
        <>
          Payment successful!{" "}
          <a
            href={`https://testnet.bscscan.com/tx/${depositTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on BscScan
          </a>
        </>
      );
      // add formdata address
      dispatch(existingUpdateUserAsync({ address }));
      setIsProcessingPayment(null);
      setDepositTxHash(null);
      setIsWalletInteractionOpen(false);
      // Proceed with SIWE login after payment
      handleSiweLogin();
    } else if (depositError && depositTxHash) {
      toast.error(`Deposit failed: ${depositError.message || "Unknown error"}`);
      setIsProcessingPayment(null);
      setDepositTxHash(null);
      setIsWalletInteractionOpen(false);
    }
  }, [isDepositConfirmed, depositError, depositTxHash]);

  // Handle normal form submission
  const formSubmitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
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

  // Handle SIWE login
  const handleSiweLogin = useCallback(async () => {
    if (!isConnected || !address || !chain) return;

    try {
      // Fetch nonce
      const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`, {
        credentials: "include",
      });
      if (!nonceResponse.ok) {
        throw new Error(`Failed to fetch nonce: ${nonceResponse.statusText}`);
      }
      const { data: { nonce } } = await nonceResponse.json();

      // Create SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host || "localhost:3000",
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain.id || wagmiConfig.chains[0].id,
        nonce,
      });

      // Sign the message
      const message = siweMessage.prepareMessage();
      const signature = await signMessageAsync({ message });

      // Log in using SIWE
      const loginResult = await signIn("siwe", {
        redirect: false,
        message: JSON.stringify(siweMessage),
        signature,
        callbackUrl: "/dashboard/default",
      });

      if (loginResult?.error) {
        throw new Error(`SIWE login failed: ${loginResult.error}`);
      }

      localStorage.removeItem("showWeb3RegForm");
      toast.success("Successfully Logged in. Redirecting...");
      dispatch(setShowDashboardPopup(true));
      router.push("/dashboard/default");
    } catch (error: any) {
      toast.error("Wallet login failed: " + (error.message || "Unknown error"));
    }
  }, [isConnected, address, chain, signMessageAsync, router, dispatch]);

  // Handle USDT payment
  const handleUsdtPayment = useCallback(async (): Promise<string> => {
    if (!address || !tokenContract || !companyBscAddress) {
      throw new Error("Wallet or contract addresses missing");
    }

    if (!isAddress(companyBscAddress) || companyBscAddress.length !== 42) {
      throw new Error("Invalid company BSC address");
    }

    if (usdtBalance && (usdtBalance as bigint) < AMOUNT) {
      throw new Error(`Insufficient USDT balance. Required: ${toPayAmount} USDT`);
    }

    setIsWalletInteractionOpen(true);
    setHasDeposited(false);

    const hasSufficientAllowance = usdtAllowance && (usdtAllowance as bigint) >= AMOUNT;

    if (!hasSufficientAllowance) {
      setIsProcessingPayment("approving");
      const approvalToastId = toast.loading("Approving USDT allowance...");
      try {
        const approvalHash = await writeContractAsync({
          address: tokenContract as `0x${string}`,
          abi: usdtAbi,
          functionName: "approve",
          args: [companyBscAddress, maxUint256],
        });
        toast.dismiss(approvalToastId);
        toast.success("Approval transaction sent!");
        setApprovalTxHash(approvalHash);
        return "";
      } catch (error: any) {
        toast.dismiss(approvalToastId);
        const message = error.message?.includes("User rejected")
          ? "Transaction rejected by user"
          : error.message || "Approval failed";
        toast.error(message);
        setIsProcessingPayment(null);
        setIsWalletInteractionOpen(false);
        throw new Error(message);
      }
    } else {
      setIsProcessingPayment("depositing");
      const depositToastId = toast.loading("Initiating USDT deposit...");
      try {
        const depositHash = await writeContractAsync({
          address: companyBscAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "package",
          args: [AMOUNT],
        });
        toast.dismiss(depositToastId);
        toast.success("Deposit transaction sent!");
        setDepositTxHash(depositHash);
        setHasDeposited(true);
        return depositHash;
      } catch (error: any) {
        toast.dismiss(depositToastId);
        const message = error.message?.includes("User rejected")
          ? "Transaction rejected by user"
          : error.message || "Deposit failed";
        toast.error(message);
        setIsProcessingPayment(null);
        setIsWalletInteractionOpen(false);
        throw new Error(message);
      }
    }
  }, [address, tokenContract, companyBscAddress, usdtBalance, usdtAllowance, AMOUNT, writeContractAsync, toPayAmount]);

  // Handle wallet connection and login
  useEffect(() => {
    if (hasRunAddressExistUseEffect.current) return;

    const handleWalletLogin = async () => {
      if (!isConnected || !address || isCheckingAddress) {
        if (!isConnected) {
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
            toast.error("Failed to switch to BSC chain. Please switch manually.");
            return;
          }
        }

        // Check if wallet address exists in database
        const { isRegistered, toPay } = await checkWalletAddress(address);
        setToPayAmount(toPay);

        if (isRegistered) {
          if (toPay > 0) {
            // Require USDT payment
            await handleUsdtPayment();
          } else {
            // Proceed with SIWE login
            await handleSiweLogin();
          }
        } else {
          // Show registration form
          setShowRegForm(true);
          localStorage.setItem("showWeb3RegForm", "true");
        }
      } catch (error: any) {
        toast.error(error.message || "An error occurred. Please try again.");
      } finally {
        setIsCheckingAddress(false);
      }
    };

    handleWalletLogin();
  }, [isConnected, address, chain, switchChainAsync, handleSiweLogin, handleUsdtPayment, isCheckingAddress]);

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
  }, [impersonateToken, router]);

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
      {isProcessingPayment ? (
        <div className="text-center py-4">
          <Spinner color="primary" />
          <p className="mt-2">
            {isProcessingPayment === "approving"
              ? "Approving USDT..."
              : "Processing Payment..."}
          </p>
        </div>
      ) : (
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
      )}
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