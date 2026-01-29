import {
  Card,
  Text,
  CardHeader,
  CardBody,
  Badge,
  Heading,
  Image
} from '@chakra-ui/react';
export default function CardNews({title, image,caption, date}) {
  return (
    <Card
      size="md"
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'transform 0.3s',
      }}
      w={"400px"}
    //   h="100%"
      // m={{ base: '1' }}
    >
        <Image
        src={image}
        alt='ImageNews'
        objectFit="cover"
        // maxW="300px"
        />
      <CardHeader pb={0}>
        <Badge colorScheme="green" fontSize="xs" mb="2" fontFamily="default">
          {date}
        </Badge>
        <Heading size={{ base: 'sm', lg: 'sm' }}>
          {title}
        </Heading>
      </CardHeader>
      <CardBody fontFamily="body" pb={2}>
        <Text fontSize={{ lg: 'sm', base: 'xs' }} numberOfLine={1} >
          {caption} 
        </Text>
      </CardBody>
    </Card>
  );
}
