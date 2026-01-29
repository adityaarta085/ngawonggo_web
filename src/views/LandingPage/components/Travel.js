import {
  Flex,
  Text,
  Card,
  Grid,
  Box,
  Stack,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import CardTravel from '../../../components/CardTravel';
import { TravelPlace } from '../../../variables/general';

const Travel = () => {
  const bromoBg =
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80';
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      p={{base: "25px", lg :"25" }}
      bg={useColorModeValue('gray.300', 'blue.900')}
      //   borderTopRadius="20px"
    >
      {/* <Stack spacing="10px"> */}
      <Text
        fontFamily={'heading'}
        fontSize={{ base: '25px', md: '35px', lg: '45px' }}
        fontWeight={700}
        mb={{ base: '5px',  md : "7px",lg: '10px' }}
        mt={{ base: '15px', md : "18px", lg: '20px' }}
        ml={{ base: '5px',  md : "7px",lg: '10px' }}
        color={useColorModeValue('ngawonggo.green', 'gray.100')}
      >
        Pesona Alam dan Potensi Desa Ngawonggo
      </Text>
      <Text
        fontFamily="heading"
        fontWeight="500"
        color={useColorModeValue('ngawonggo.blue', 'gray.100')}
        textAlign="center"
      >
        Menjelajahi keindahan alam dan kekayaan budaya di lereng Gunung Sumbing
      </Text>
      <Grid
        templateColumns={{ base: 'repeat(2,1fr)', lg: 'repeat(3, 1fr)' }}
        p={15}
        // m={7}
        gap={5}
        mb={{ lg: "50px" }}
      >
        {TravelPlace.map((e, index) => {
          return (
            <GridItem key={index}>
              <CardTravel
                title={e.title}
                image={e.image}
                location={e.location}
              />
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
};

export default Travel;
