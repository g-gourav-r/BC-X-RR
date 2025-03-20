import React from "react";
import Hero from "../Hero";
import Feature from "../feature";
import ProcessOverview from "../ProcessOverview";
import Footer from "../Footer";

const home = () => {
  return (
    <>
      <Hero />
      <ProcessOverview />
      <Feature />
      {/* <Footer /> */}
    </>
  );
};

export default home;
