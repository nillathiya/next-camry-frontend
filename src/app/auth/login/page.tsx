"use client";
import React, { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import UserForm from "./UserForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserLogin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard/default");
    }
  }, [session, router]);

  if (session) return null;
  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="login-card login-dark">
            <UserForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
