import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Button,
  Link,
  Text,
} from '@chakra-ui/react';
import CardNews from '../../components/CardNews.js';
import SmallCardNews from '../../components/SmallCardNews';
import { supabase } from '../../lib/supabase';

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (!error && data) setAllNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const categories = ['pemerintahan', 'pendidikan', 'kesehatan', 'ekonomi', 'umum'];

  if (loading) return <Box p={10}><Text>Loading news...</Text></Box>;

  return (
    <Flex direction="column" m={30}>
      <Box display="row" fontFamily="heading">
        <Heading>Informasi Dan Berita Daerah</Heading>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/news ">Berita</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box my={2}>
        <ButtonGroup colorScheme="teal" flexWrap="wrap">
          {categories.map(cat => (
            <Link key={cat} href={`#${cat}`}>
              <Button fontFamily={'default'} m={2} textTransform="capitalize">
                {cat}
              </Button>
            </Link>
          ))}
        </ButtonGroup>
      </Box>

      {categories.map(category => {
        const filteredNews = allNews.filter(n => n.category?.toLowerCase() === category);
        if (filteredNews.length === 0) return null;

        return (
          <Box key={category} my={15} id={category}>
            <Heading size={'lg'} textTransform="capitalize">{category}</Heading>
            <Divider mt={1} />
            <Flex gap={5} mt={5} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
              <Box flex={1}>
                {filteredNews.slice(0, 1).map(e => (
                  <CardNews
                    key={e.id}
                    title={e.title}
                    image={e.image}
                    date={e.date}
                    caption={e.content} // Using content for caption
                  />
                ))}
              </Box>
              <Flex
                flexDirection={{ base: 'row', lg: 'column' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
                gap={5}
                justifyContent="start"
              >
                {filteredNews.slice(1, 4).map(e => (
                  <SmallCardNews key={e.id} title={e.title} image={e.image} date={e.date} />
                ))}
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </Flex>
  );
}
