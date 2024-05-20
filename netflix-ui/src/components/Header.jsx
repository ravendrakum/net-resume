import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Header(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    navigate(props.login ? "/login" : "/signup");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <StyledHeader className={`flex a-center j-between ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <img src='https://res.cloudinary.com/ehizeex-shop/image/upload/v1668265433/NetflixApp/2560px-Netflix_2015_logo.svg_rbicwl_knwp6f.png' alt="logo" />
      </div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : (props.login ? "Log In" : "Sign In")}
      </button>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  padding: 0 4rem;
  .logo {
    img {
      height: 5rem;
    }
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #e50914;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 0.2rem;
    font-weight: bolder;
    font-size: 1.05rem;
  }

  /* Style for scrolled header */
  &.scrolled {
    background-color: black;
  }
`;
