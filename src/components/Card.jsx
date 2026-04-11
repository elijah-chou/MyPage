import { Heading, HStack, Image, Text, VStack, Box, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, imageSrc, url }) => {
  return (
    <VStack alignItems='start' margin={5} marginTop={15}>       
      <Box bgColor='white' textColor='black' borderRadius="lg">
        <Image src={imageSrc} borderRadius='lg'/>
        <Heading size='ml' padding={4}>{title}</Heading>
        <Text textColor='gray' padding={4}>{description}</Text>
        <HStack padding={4}>
          <Link href={url} isExternal>See more</Link>
          <FontAwesomeIcon icon={faArrowRight} size='1x'/>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Card;
