import styled from "styled-components";

export const Wrapper = styled.div(({ theme }) => ({
  width: "100%",
  height: "100vh",
}));

export const StyledSideBar = styled.div(({ theme }) => ({
  width: "28.563rem",
  height: "100vh",
  padding: "3rem 2rem 5rem 3rem",
  gap: "0px",
  opacity: "0px",
  backgroundColor: theme.colors?.surface.icon.gray.normal || "#192839",
}));
