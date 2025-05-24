import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getUserWalletAsync } from "@/redux-toolkit/slices/userSlice";
import { useEffect } from "react";
import { Card, CardBody, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";

const ScrollContainer = styled.div`
  height: 225px;
  overflow-y: scroll;
  overflow-x: hidden;

  scrollbar-width: thin;
  scrollbar-color: #888 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const UserCards = () => {
  const dispatch = useAppDispatch();
  const { getWalletBalanceBySlug, getWalletNameBySlug } = useWalletSettings();
  const companyCurrency = useCompanyCurrency();

  const {
    loading: { getUserWallet },
    userWallet,
    error: userError,
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (userWallet === null && !getUserWallet) {
      dispatch(getUserWalletAsync());
    }
  }, [userWallet]);

  // Skip fields that should not be displayed
  const skipFields = ["_id", "username", "createdAt", "updatedAt"];
  const userWalletInfo = userWallet
    ? Object.entries(userWallet).filter(([key]) => !skipFields.includes(key))
    : [];

  // SVG icons and colors for cards
  const svgs = ["crown", "flash", "blend-2", "color-filter"];
  const colors = ["primary", "success", "warning", "secondary"];

  // Get random color based on index for consistency
  const getColor = (index: number): string => {
    return colors[index % colors.length];
  };

  // Get random SVG icon based on index for consistency
  const svgIcon = (index: number): string => {
    return svgs[index % svgs.length];
  };

  // Loading state: Show Reactstrap Spinner
  if (getUserWallet) {
    return (
      <Col xl="6" className="box-col-6">
        <Row className="tread-cards">
          <Col xl="6" sm="6">
            <Card className="widget-1">
              <CardBody className="common-box text-center">
                <Spinner color="primary" />
                <h5 className="mt-2">Loading wallet...</h5>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }

  // Error state or wallet not found
  if (!userWallet || userError) {
    return (
      <Col xl="6" className="box-col-6">
        <Row className="tread-cards">
          <Col xl="6" sm="6">
            <Card className="widget-1">
              <CardBody className="common-box text-center">
                <div className="danger widget-icon widget-round">
                  <SvgIcon iconId="alert-triangle" />
                </div>
                <h3 className="f-w-600">Error</h3>
                <span className="f-w-500 f-light f-12">
                  {userError || "Wallet not found"}
                </span>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }

  // Normal state: Render wallet cards
  return (
    <Col xl="6" className="box-col-6">
      <ScrollContainer>
        <Row className="tread-cards">
          {userWalletInfo.map(([key, value], i) => (
            <Col key={key} xl="6" sm="6">
              <Card className="widget-1">
                <CardBody className="common-box">
                  <div className={`${getColor(i)} widget-icon widget-round`}>
                    <SvgIcon iconId={svgIcon(i)} />
                  </div>
                  {(
                    <div>
                      <h3 className="f-w-600">{getWalletNameBySlug(key)}</h3>
                      <span className="f-w-500 f-light f-12">
                        {`${companyCurrency}${getWalletBalanceBySlug(key)}`}
                      </span>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </ScrollContainer>
    </Col>
  );
};

export default UserCards;
