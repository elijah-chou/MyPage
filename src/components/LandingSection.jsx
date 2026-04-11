import React from "react";
import { Avatar, Heading, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import headshot from "../images/headshot.jpg"

const greeting = "Hello, my name is Elijah!";
const bio1 = "JPMorganChase Software Engineer";
const bio2 = "BS/MS in Computer Science from Emory";

const LandingSection = () => (
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="#2A4365"
  >
    <VStack spacing={16}>
      <VStack spacing={4}>
        <Avatar
          src={headshot}
          size="2xl"
          name="Your name"
        />
        <Heading as="h4" size="md" noOfLines={1}>
          {greeting}
        </Heading>
      </VStack>
      <VStack spacing={6}>
        <Heading as="h4" size="3xl" noOfLines={1}>
          {bio1}
        </Heading>
      </VStack>
      <VStack spacing={6}>
        <Heading as="h4" size="3xl" noOfLines={1}>
          {bio2}
        </Heading>
      </VStack>
    </VStack>

  </FullScreenSection>
);

export default LandingSection;
