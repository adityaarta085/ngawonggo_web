import { Flex, Stack, Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import QuickLinks from './components/QuickLinks.js';
import LatestNews from './components/LatestNews.js';
import Travel from './components/Travel.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
// import {Navbar, Footer} from "./components/index.js"

export default function LandingPage() {
  return (
    <Flex flexDirection={'column'}>
      <Stack spacing={7}>
        <Hero />
        <QuickLinks />
        <LatestNews />
        <Box id='wisata'>
          <Travel />
        </Box>
        <VideoPromo />
        <Supports />
      </Stack>
    </Flex>
  );
}
