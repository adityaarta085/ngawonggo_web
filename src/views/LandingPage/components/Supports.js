import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';

const Supports = () => {
  const bgSupport = useColorModeValue("transparent", "gray.200");
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('id', { ascending: true });
      if (!error && data) setInstitutions(data);
    };
    fetchInstitutions();
  }, []);

  return (
    <Flex flexDirection="column" alignItems="center" textAlign="center" mt={100}>
      <Text
        fontFamily={'heading'}
        fontSize={{ base: '25px', md: '35px', lg: '45px' }}
        fontWeight={700}
        mb={{ base: '5px', md: '7px', lg: '10px' }}
        mt={{ base: '15px', md: '18px', lg: '20px' }}
        ml={{ base: '5px', md: '7px', lg: '10px' }}
        color={useColorModeValue('ngawonggo.green', 'gray.100')}
      >
        Lembaga & Program Desa
      </Text>
      <Flex flexDirection="row" p={"45px"} justifyContent="center" alignContent={"center"} flexWrap="wrap">
        {institutions.map((e, index) => {
          return (
            <Link key={e.id} href="#">
              <Box
                m={2}
                w={{ base : "130px",lg: "300px" }}
                h={{ base : "65px",lg: "150px" }}
                border="3px solid black"
                rounded="lg"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg={bgSupport}
                _hover={{ bg: 'gray.100' }}
              >
                <Image
                  src={e.image}
                  alt={e.title}
                  objectFit="contain"
                  w={{base: "50px", lg: "140px" }}
                  fallback={<Text fontWeight="bold" fontSize={{ base: "xs", lg: "md" }} textAlign="center">{e.title}</Text>}
                />
              </Box>
            </Link>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Supports;
