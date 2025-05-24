"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "viem";
import { ChainId, getTokens } from "@/lib/tokens";
import {
  getUserWalletAsync,
  addAmountToWallet,
} from "@/redux-toolkit/slices/userSlice";
import { contractAbi } from "@/ABI/contract";
import { abi as usdtAbi } from "@/ABI/usdtAbi";
// import "./fund.css";
import { toast } from "react-toastify";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import {
  useComapnyBscAddress,
  useCompanyCurrency,
  useCompanyTokenContract,
} from "@/hooks/useCompanyInfo";
import { useAddFundWallet } from "@/hooks/useUserSettings";
import { verifyTransactionAsync } from "@/redux-toolkit/slices/fundSlice";
import { useAppDispatch } from "@/redux-toolkit/Hooks";
import "@rainbow-me/rainbowkit/styles.css";

const AddFund = () => {
  const dispatch = useAppDispatch();
  const { getWalletBalanceBySlug, getWalletNameBySlug } = useWalletSettings();
  const [selectedToken, setSelectedToken] = useState("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [isMetaMaskOpen, setIsMetaMaskOpen] = useState(false);
  const [transactionVerificationLoading, setTransactionVerificationLoading] =
    useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [hasDeposited, setHasDeposited] = useState(false);
  const companyCurrency = useCompanyCurrency();
  const companyBscAddress = useComapnyBscAddress();
  const { value: addFundWallet, loading: addFundWalletLoading } =
    useAddFundWallet();
  const companyTokenContract = useCompanyTokenContract();

  // console.log("addFundWallet", addFundWallet);
  // console.log("companyCurrency", companyCurrency);
  // console.log("companyTokenContract",companyTokenContract);

  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    error: approvalError,
  } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
  });

  const {
    isLoading: isDepositConfirming,
    isSuccess: isDepositConfirmed,
    error: depositError,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  const { isLoading: isWalletLoading } = useQuery({
    queryKey: ["userWallet"],
    queryFn: async () => {
      await dispatch(getUserWalletAsync()).unwrap();
      return true;
    },
  });

  const tokens = getTokens(chainId as ChainId);
  const flatTokens = tokens.flatMap((group) => group.items);

  const usdtBalance = useReadContract({
    abi: usdtAbi,
    address: companyTokenContract as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const usdcBalance = useReadContract({
    abi: usdtAbi,
    address: flatTokens.find((token) => token.name === "USDC")
      ?.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const tokenBalances = tokens.flatMap((group) =>
    group.items.map((token) => ({
      ...token,
      balance: token.name === "USDT" ? usdtBalance : usdcBalance,
    }))
  );

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountInput(value);
    } else {
      toast.error("Invalid amount. Only numbers are allowed.");
      setAmountInput("");
    }
  };

  const handleFundTransfer = async () => {
    const token = tokenBalances.find((t) => t.name === selectedToken);
    if (!token || selectedToken === "token") {
      toast.error("Please select a valid token (e.g., USDT) to proceed.");
      return;
    }

    if (
      !amountInput ||
      isNaN(parseFloat(amountInput)) ||
      parseFloat(amountInput) <= 0
    ) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (token.address === "Not Supported") {
      toast.error(`${token.name} is not supported on this network.`);
      return;
    }

    const balanceData = token.balance.data as bigint;
    if (balanceData) {
      const balance = parseFloat(formatUnits(balanceData, token.decimals));
      const amount = parseFloat(amountInput);
      if (amount > balance) {
        toast.error(
          `Insufficient ${token.name} balance. Available: ${balance}`
        );
        return;
      }
    } else {
      toast.error("Unable to verify token balance. Please try again.");
      return;
    }

    if (!companyBscAddress || companyBscAddress.length !== 42) {
      toast.error("Invalid recipient wallet address.");
      return;
    }

    const amount = parseUnits(amountInput, token.decimals);

    try {
      setIsMetaMaskOpen(true);
      setHasDeposited(false);

      const approvalToastId = toast.loading("Approving token allowance...");
      try {
        const approvalTx = await writeContractAsync({
          abi: usdtAbi,
          address: token.address as `0x${string}`,
          functionName: "approve",
          args: [companyBscAddress as `0x${string}`, amount],
        });
        toast.dismiss(approvalToastId);
        toast.success("Approval transaction sent! Waiting for confirmation...");
        setApprovalTxHash(approvalTx);
      } catch (error) {
        toast.dismiss(approvalToastId);
        toast.error(`Approval failed: ${error.message || "Unknown error"}`);
        throw error;
      }
    } catch (error) {
      setIsMetaMaskOpen(false);
    }
  };

  useEffect(() => {
    if (isApprovalConfirmed && approvalTxHash && !hasDeposited) {
      toast.success("Token allowance approved!");
      const token = tokenBalances.find((t) => t.name === selectedToken);
      if (!token) {
        toast.error("Selected token not found.");
        setIsMetaMaskOpen(false);
        return;
      }
      const amount = parseUnits(amountInput, token.decimals);

      const initiateDeposit = async () => {
        const depositToastId = toast.loading("Initiating deposit...");
        try {
          if (!companyBscAddress) {
            toast.error("Company BSC Address Not Found");
            throw new Error("Company BSC Address Not Found");
          }
          const depositTx = await writeContractAsync({
            abi: contractAbi,
            address: companyBscAddress as `0x${string}`,
            functionName: "package",
            args: [amount],
          });
          toast.dismiss(depositToastId);
          toast.success("Deposit transaction sent!");
          setDepositTxHash(depositTx);
          setHasDeposited(true);
        } catch (error) {
          toast.dismiss(depositToastId);
          toast.error(`Deposit failed: ${error.message || "Unknown error"}`);
        } finally {
          setIsMetaMaskOpen(false);
        }
      };
      initiateDeposit();
    } else if (approvalError && approvalTxHash) {
      toast.error(
        `Approval confirmation failed: ${
          approvalError.message || "Unknown error"
        }`
      );
      setIsMetaMaskOpen(false);
      setHasDeposited(false);
    }
  }, [isApprovalConfirmed, approvalError, approvalTxHash, hasDeposited]);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (isDepositConfirmed && depositTxHash) {
        const confirmToastId = toast.loading(
          "Confirming deposit on blockchain..."
        );
        let verifyToastId: any;

        try {
          toast.dismiss(confirmToastId);
          toast.success("Deposit transaction confirmed!");
          setTransactionVerificationLoading(true);
          verifyToastId = toast.loading("Verifying transaction...");

          const formData = {
            txHash: depositTxHash,
            userAddress: address,
            amount: amountInput,
          };
          const result = await dispatch(
            verifyTransactionAsync(formData)
          ).unwrap();

          toast.dismiss(verifyToastId);
          if (result.success === true || result.statusCode === 200) {
            await dispatch(
              addAmountToWallet({
                walletType: addFundWallet?.key,
                amount: amountInput,
              })
            );
            toast.success("Funds added successfully!");
          } else {
            toast.error("Transaction verification failed.");
          }
        } catch (error) {
          toast.dismiss(confirmToastId);
          if (verifyToastId) toast.dismiss(verifyToastId);
          toast.error("Verification failed. Please try again.");
        } finally {
          setTransactionVerificationLoading(false);
        }
      } else if (depositError && depositTxHash) {
        toast.error(
          `Deposit confirmation failed: ${
            depositError.message || "Unknown error"
          }`
        );
        setTransactionVerificationLoading(false);
      }
    };
    verifyTransaction();
  }, [
    isDepositConfirmed,
    depositError,
    depositTxHash,
    dispatch,
    address,
    amountInput,
    addFundWallet?.key,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="bg-light h-20 rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-light h-10 rounded"></div>
        <div className="bg-light h-10 rounded"></div>
        <div className="bg-light h-12 rounded"></div>
      </div>
    </div>
  );
  // console.log("isWriting", isWriting);
  // console.log("amountInput", amountInput);
  // console.log("isApprovalConfirming", isApprovalConfirming);
  // console.log("isDepositConfirming", isDepositConfirming);
  // console.log("transactionVerificationLoading", transactionVerificationLoading);
  // console.log("isMetaMaskOpen", isMetaMaskOpen);
  // console.log("isConnected", isConnected);
  return (
    <Container>
      <Row>
        <h2 className="mb-4">Add Fund</h2>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-end mb-3">
                <ConnectButton
                  chainStatus="icon"
                  showBalance={false}
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                />
              </div>
              {isWalletLoading || addFundWalletLoading ? (
                <div className="text-center">
                  <Spinner color="primary">Loading...</Spinner>
                </div>
              ) : (
                <>
                  <div className="row mb-1">
                    <div className="col-md-12">
                      <Card className="p-3">
                        <h5>
                          {addFundWallet
                            ? getWalletNameBySlug(addFundWallet?.key)
                            : "Add Fund Wallet"}
                        </h5>
                        <p className="mb-0">
                          <span>{companyCurrency}</span>{" "}
                          <span>
                            {addFundWallet
                              ? getWalletBalanceBySlug(addFundWallet?.key)
                              : "0"}
                          </span>
                        </p>
                      </Card>
                    </div>
                  </div>

                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input
                      type="text"
                      id="amount"
                      placeholder="0.00"
                      value={amountInput}
                      onChange={handleAmountChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="token">
                      Token
                      <span className="ms-2">
                        Balance:{" "}
                        {tokenBalances.find((t) => t.name === selectedToken)
                          ?.balance.data
                          ? formatUnits(
                              tokenBalances.find(
                                (t) => t.name === selectedToken
                              )!.balance.data as bigint,
                              tokenBalances.find(
                                (t) => t.name === selectedToken
                              )?.decimals || 18
                            )
                          : "0.00"}
                      </span>
                    </Label>
                    <Dropdown
                      isOpen={isDropdownOpen}
                      toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                      innerRef={dropdownRef}
                    >
                      <DropdownToggle caret className="w-100 text-start">
                        {selectedToken === "token"
                          ? "Select Token"
                          : selectedToken}
                      </DropdownToggle>
                      <DropdownMenu className="w-100">
                        {tokens.map((group) => (
                          <div key={group.category}>
                            <DropdownItem header>{group.category}</DropdownItem>
                            {group.items.map((token) => {
                              const balanceData = tokenBalances.find(
                                (t) => t.name === token.name
                              )?.balance;
                              return (
                                <DropdownItem
                                  key={token.name}
                                  onClick={() => {
                                    setSelectedToken(token.name);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={token.icon}
                                        alt={token.name}
                                        className="me-2"
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                          borderRadius: "50%",
                                        }}
                                      />
                                      {token.name}
                                    </div>
                                    <span>
                                      {balanceData?.data
                                        ? formatUnits(
                                            balanceData.data as bigint,
                                            token.decimals
                                          )
                                        : "0.00"}
                                    </span>
                                  </div>
                                </DropdownItem>
                              );
                            })}
                          </div>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>

                  <Button
                    color="primary"
                    className="w-100"
                    disabled={
                      isWriting ||
                      !amountInput ||
                      isApprovalConfirming ||
                      isDepositConfirming ||
                      transactionVerificationLoading ||
                      isMetaMaskOpen ||
                      !isConnected
                    }
                    onClick={handleFundTransfer}
                  >
                    {isMetaMaskOpen
                      ? "Waiting for Wallet..."
                      : isWriting
                      ? "Processing..."
                      : isApprovalConfirming
                      ? "Confirming Approval..."
                      : isDepositConfirming
                      ? "Confirming Deposit..."
                      : transactionVerificationLoading
                      ? "Verifying Transaction..."
                      : "Send"}
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddFund;
