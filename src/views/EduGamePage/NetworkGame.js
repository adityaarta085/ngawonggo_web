import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import {
  Dns as ServerIcon,
  Home as HomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';

const GRID_SIZE = 5;
const START_NODE = { r: 0, c: 0 };
const TARGET_NODES = [
  { r: 0, c: 4, label: "Dusun A" },
  { r: 4, c: 0, label: "Dusun B" },
  { r: 4, c: 4, label: "Dusun C" },
];

const NetworkGame = ({ onBack }) => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [moves, setMoves] = useState(12);
  const [isWon, setIsWon] = useState(false);
  const [connectedTargets, setConnectedTargets] = useState([]);
  const [snackbar, setSnackbar] = useState(false);

  const checkConnectivity = useCallback(() => {
    const visited = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    const queue = [START_NODE];
    visited[START_NODE.r][START_NODE.c] = true;

    const reachable = [];

    while (queue.length > 0) {
      const { r, c } = queue.shift();

      TARGET_NODES.forEach((target, idx) => {
        if (target.r === r && target.c === c && !reachable.includes(idx)) {
          reachable.push(idx);
        }
      });

      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] && !visited[nr][nc]) {
          visited[nr][nc] = true;
          queue.push({ r: nr, c: nc });
        }
      }
    }

    setConnectedTargets(reachable);
    if (reachable.length === TARGET_NODES.length) {
      setIsWon(true);
    }
  }, [grid]);

  useEffect(() => {
    checkConnectivity();
  }, [grid, checkConnectivity]);

  const toggleCell = (r, c) => {
    if (isWon || (r === START_NODE.r && c === START_NODE.c)) return;

    if (!grid[r][c] && moves <= 0) {
      setSnackbar(true);
      return;
    }

    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
    setMoves(prev => grid[r][c] ? prev + 1 : prev - 1);
  };

  const resetGame = () => {
    const initialGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    initialGrid[START_NODE.r][START_NODE.c] = true;
    setGrid(initialGrid);
    setMoves(12);
    setIsWon(false);
    setConnectedTargets([]);
  };

  useEffect(() => {
    const initialGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    initialGrid[START_NODE.r][START_NODE.c] = true;
    setGrid(initialGrid);
  }, []);

  return (
    <Paper sx={{ p: 4, borderRadius: '32px', width: '100%', maxWidth: '600px' }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>Ngawonggo 2045: Jaringan Digital</Typography>
          <Typography variant="body2" color="text.secondary">
            Hubungkan <b>Pusat Data</b> ke semua <b>Dusun</b> dengan kabel fiber optik!
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-around" sx={{ bgcolor: 'grey.50', p: 2, borderRadius: '20px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>KABEL</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: moves < 3 ? 'error.main' : 'primary.main' }}>{moves}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>TERHUBUNG</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{connectedTargets.length} / {TARGET_NODES.length}</Typography>
          </Box>
        </Stack>

        <Box sx={{ p: 1.5, bgcolor: 'grey.200', borderRadius: '16px', alignSelf: 'center' }}>
          <Grid container spacing={1} sx={{ width: { xs: 260, md: 360 } }}>
            {grid.map((row, r) => row.map((isActive, c) => {
              const isStart = r === START_NODE.r && c === START_NODE.c;
              const targetIdx = TARGET_NODES.findIndex(t => t.r === r && t.c === c);
              const isTarget = targetIdx !== -1;
              const isConnectedTarget = connectedTargets.includes(targetIdx);

              return (
                <Grid item xs={12/GRID_SIZE} key={`${r}-${c}`}>
                  <Paper
                    elevation={0}
                    onClick={() => toggleCell(r, c)}
                    sx={{
                      width: { xs: 45, md: 65 },
                      height: { xs: 45, md: 65 },
                      bgcolor: isActive ? (isStart || isConnectedTarget ? 'primary.main' : 'primary.light') : 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isStart ? 'default' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s',
                      '&:hover': !isStart ? { transform: 'scale(1.05)', bgcolor: isActive ? 'primary.dark' : 'grey.100' } : {}
                    }}
                  >
                    {isStart && <ServerIcon sx={{ color: 'white', fontSize: { xs: 24, md: 32 } }} />}
                    {isTarget && <HomeIcon sx={{ color: isConnectedTarget ? 'white' : 'grey.400', fontSize: { xs: 24, md: 32 } }} />}
                    {isActive && !isStart && !isTarget && <BoltIcon sx={{ color: 'white', opacity: 0.6, fontSize: { xs: 16, md: 24 } }} />}
                    {isTarget && isConnectedTarget && (
                      <Box sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'success.main', width: 8, height: 8, borderRadius: '50%', border: '1px solid white' }} />
                    )}
                  </Paper>
                </Grid>
              );
            }))}
          </Grid>
        </Box>

        {isWon ? (
          <Paper sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: '16px', border: '1px solid', borderColor: 'success.light', textAlign: 'center' }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.dark' }}>Misi Berhasil!</Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 1.5 }}>Selamat! Kamu telah membangun infrastruktur digital.</Typography>
            <Button variant="contained" color="success" size="small" onClick={resetGame} sx={{ borderRadius: '100px' }}>Main Lagi</Button>
          </Paper>
        ) : (
          moves === 0 && connectedTargets.length < TARGET_NODES.length && (
            <Button variant="outlined" color="error" fullWidth onClick={resetGame} sx={{ borderRadius: '100px' }}>Ulangi Misi</Button>
          )
        )}

        <Button variant="text" size="small" onClick={onBack}>Kembali ke Menu</Button>
      </Stack>
      <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}>
        <Alert severity="warning">Kabel Habis!</Alert>
      </Snackbar>
    </Paper>
  );
};

export default NetworkGame;
