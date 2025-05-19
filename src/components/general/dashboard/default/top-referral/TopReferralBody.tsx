import { useState, useEffect } from "react";
import { CardBody, Input, Button } from "reactstrap";
import { ImagePath } from "@/constants";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/redux-toolkit/Hooks";

const TopReferralBody = () => {
  const { data: session } = useSession();
  console.log("session", session);
  const referralLink = `${window.location.origin}/auth/login?ref=${session?.user.username}`;
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const [isCopied, setIsCopied] = useState(false);
  const [qrSize, setQrSize] = useState(250);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setIsCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setQrSize(130);
      } else if (width < 768) {
        setQrSize(250);
      } else {
        setQrSize(128);
      }
    };

    handleResize(); // Initial run
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <CardBody className="pt-0">
      <div
        className="referral-content"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className="referral-link-section mt-3">
          <h6 className="f-w-500 mb-2 text-white">Your Referral Link</h6>
          <div className="input-group">
            <Input
              type="text"
              value={referralLink}
              readOnly
              className="form-control"
              style={{ backgroundColor: darkMode ? "#1d1f27" : "#f8f9fa" }}
            />
            <Button
              color={isCopied ? "success" : "primary"}
              onClick={handleCopy}
              style={{ minWidth: "100px" }}
            >
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="referral-qr-section">
          <h6 className="f-w-500 mb-2">QR Code</h6>
          <div
            className="QR_responseive"
            style={{
              background: "white",
              padding: "16px",
              display: "flex",
              borderRadius: "8px",
            }}
          >
            <QRCode
              value={referralLink}
              size={qrSize}
              bgColor="#ffffff"
              fgColor="#000000"
              level="Q"
            />
            <img
              className="img-fluid"
              src={`${ImagePath}/dashboard/banner.png`}
              alt="vector"
            />
          </div>
        </div>
      </div>
    </CardBody>
  );
};

export default TopReferralBody;
