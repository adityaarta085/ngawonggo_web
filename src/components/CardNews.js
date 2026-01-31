import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Heading,
  Image,
  Box
} from '@chakra-ui/react';

export default function CardNews({ title, image, caption, date }) {
  return (
    <Card
      size="md"
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'transform 0.3s',
      }}
      w={"400px"}
    >
      <Image
        src={image}
        alt='ImageNews'
        objectFit="cover"
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
        <Box
          fontSize={{ lg: 'sm', base: 'xs' }}
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: caption }}
        />
      </CardBody>
    </Card>
  );
}
