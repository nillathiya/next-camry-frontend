"use client";

import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { ImagePath } from "@/constants";
import { profileHeaderData } from "@/data/layout/RightHeader";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRegistrationType } from "@/hooks/useWebsiteSettings";
import { persistor } from "@/redux-toolkit/store";
const ProfileHeader = () => {
  const { data: session } = useSession();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const registrationType = useRegistrationType();

  // Handle address copying
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast.error("Failed to copy address. Please try again.");
    }
  };

  // Handle logout (NextAuth and wallet disconnect)
  const logOut = async () => {
    try {
      if (isConnected) {
        // console.log(`Disconnecting wallet: ${address}`);
        disconnect();
        toast.success("Wallet disconnected");
      } else {
        console.log("No wallet connected");
      }

      // console.log("Initiating NextAuth signOut");
      // localStorage.clear();
      persistor.purge();
      await signOut({ redirect: false });
      // console.log("NextAuth signOut completed");

      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <li className="profile-nav onhover-dropdown">
      <div className="onhover-click">
        <div className="sidebar-image">
          <Image
            height={50}
            width={50}
            src={session?.user?.image || `${ImagePath}/user.png`}
            alt="profile"
          />
          <span className="status status-success"></span>
        </div>

        <div className="sidebar-content">
          <h4>{session?.user?.email}</h4>
          <span className="f-12 f-w-600 f-light">
            {session?.user?.name || "UI Designer"}
          </span>
        </div>
      </div>

      <ul className="profile-dropdown onhover-show-div simple-list">
        {/* Wallet Connection Status */}
        {registrationType === "web3" && (
          <li>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div className="wallet-status">
                    {!ready && <span>Loading...</span>}
                    {!connected && (
                      <a
                        onClick={openConnectModal}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="profile-icon">
                          <SvgIcon iconId="wallet" />
                        </div>
                        <span>Connect Wallet</span>
                      </a>
                    )}
                    {connected && (
                      <div className="wallet-info">
                        {/* Chain Info */}
                        <a
                          onClick={openChainModal}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="profile-icon">
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: "16px", height: "16px" }}
                              />
                            )}
                          </div>
                          <span>{chain.name}</span>
                        </a>
                        {/* Account Info */}
                        <a
                          onClick={() => handleCopyAddress(account.address)}
                          style={{ cursor: "pointer" }}
                        >
                          <span>
                            {account.displayName.length > 10
                              ? `${account.displayName.slice(
                                  0,
                                  10
                                )}...${account.displayName.slice(-4)}`
                              : account.displayName}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </li>
        )}

        {/* Profile Menu Items */}
        {profileHeaderData.map((item) => (
          <li key={item.id}>
            <Link href={`${item.link}`}>
              <div className="profile-icon">
                <SvgIcon iconId={item.icon} />
              </div>
              <span>{item.text}</span>
            </Link>
          </li>
        ))}

        {/* Logout */}
        <li>
          <a onClick={logOut} style={{ cursor: "pointer" }}>
            <div className="profile-icon">
              <SvgIcon iconId="login" />
            </div>
            <span>Log out</span>
          </a>
        </li>
      </ul>
    </li>
  );
};

export default ProfileHeader;
