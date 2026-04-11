import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading, VStack, Text } from "@chakra-ui/react";

const employmentHistory = [
    {
        company: "JPMorganChase",
        role: "Software Engineer I",
        duration: "September 2023 - Present",
        description:
`* Engineered a multi-module Spring Boot application to simulate downstream system event consumption from start to deployment.\n
* Composed API acceptance tests with internal automated testing framework to speed up regression testing by over 80%.\n
* Leading scrum team's data modeling efforts to modernize 200+ legacy data elements for over 70 million debit cards.`
    },
    {
        company: "Georgia Tech Research Institute",
        role: "Student Software Engineer",
        duration: "September 2023 - May 2024",
        description:
`* Conducted aircraft maintenance scheduling optimization research by leveraging Google OR-Tools.\n
* Developed unit tests with Pytest and Hypothesis frameworks to validate the outputs of the proposed maintenance scheduling with established baselines.\n
* Managed PostgreSQL database interfacing of schemas shared across collaborating GTRI laboratories.`
    },
    {
      company: "JPMorganChase",
      role: "Software Engineer Academic Intern",
      duration: "September 2023 - December 2023",
      description:
`* Created innovative metric counters using Micrometer for a Spring Boot application, visualizing data on a Grafana dashboard.\n
* Updated Prometheus instances in development and QA testing environments to scrape new metrics.\n
* Migrated key card information to an Oracle database using Liquibase, Oracle SQL Developer, and SQL scripts.`
  },
    {
        company: "JPMorganChase",
        role: "Software Engineer Intern",
        duration: "June 2023 - August 2023",
        description:
`* Implemented a cost-saving framework for the Chase Debit Platform's backend, reducing annual losses by $5 million.\n
* Orchestrated workflows with private cloud integration and configured inter-application network policies using Python.\n
* Utilized Spring Integration to connect the backend application with existing Kafka topics and on-prem APIs.\n
* Won 1st Place in the JPMC Global Innovation Week Hackathon in the Atlanta Tech Center for brainstorming and developing a new, streamlined onboarding tool for incoming hires.`
    },
    {
        company: "Georgia Tech Research Institute",
        role: "Software Engineer Intern",
        duration: "January 2023 - April 2023",
        description:
`* Revamped a Python Flask web application, updating over 30 user features within an MVC architecture framework.\n
* Developed 8 new user screens with HTML/CSS and SQL scripts, updating information in the connected PostgreSQL server.\n
* Automated web application security testing using GitLab CI/CD YML files with GitLab-provided runners.`
    },
    {
        company: "AT&T",
        role: "Software Developer Intern",
        duration: "June 2022 - August 2022",
        description:
`* Conducted cutting-edge research with AT&T CDO inventive scientists to create a blockchain-based AI transparency proof-of-concept.\n
* Prototyped a VR social media live streaming platform in an Agile scrum team of 5 interns for the annual Intern Innovation Challenge.\n
* Presented my work to the AVP of Inventive Science at the Chief Data Office monthly meeting and at the Intern Expo.`
    },
  // Add more employment history as needed
];

const EmploymentHistorySection = () => {
  return (
    <FullScreenSection
      backgroundColor="#1A202C"
      isDarkBackground
      p={8}
      alignItems="flex-start"
      spacing={8}
    >
      <Heading as="h1" id="employment-history-section">
        Professional Experience
      </Heading>
      <VStack spacing={4} align="flex-start">
        {employmentHistory.map((job, index) => (
          <Box key={index} p={4} bg="gray.700" borderRadius="md" w="100%">
            <Heading as="h3" size="md">{job.company}</Heading>
            <Text fontWeight="bold">{job.role}</Text>
            <Text>{job.duration}</Text>
            <Text>{job.description}</Text>
          </Box>
        ))}
      </VStack>
    </FullScreenSection>
  );
};

export default EmploymentHistorySection;
