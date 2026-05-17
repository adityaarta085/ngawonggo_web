const fs = require('fs');

const path = 'src/views/DracinPage/Watch.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add details to state
content = content.replace(
    /const \[error, setError\] = useState\(null\);/,
    "const [error, setError] = useState(null);\n  const [detailData, setDetailData] = useState(null);"
);

// 2. Load detail data
const loadDetailCode = `
    const loadDetail = async () => {
        try {
            const detailRes = await dracinApi.getDetail(id);
            if (mounted) {
                setDetailData(detailRes);
            }
        } catch (err) {
            console.error("Gagal memuat detail untuk share:", err);
        }
    };
    loadDetail();
`;

content = content.replace(
    /const loadEpisode = async \(\) => \{/,
    `${loadDetailCode}\n    const loadEpisode = async () => {`
);

// 3. Update handleShare
const newHandleShare = `
  const handleShare = () => {
    let titleShare = \`Nonton Dracin Eps \${episode}\`;
    let textShare = \`Tonton Episode \${episode} di Ngawonggo Portal!\`;

    if (detailData) {
        titleShare = \`Nonton \${detailData.title} Eps \${episode}\`;
        const synopsis = detailData.description || detailData.synopsis || '';
        const shortSynopsis = synopsis.length > 100 ? synopsis.substring(0, 100) + '...' : synopsis;
        textShare = \`\${titleShare}\\n\\nSinopsis:\\n\${shortSynopsis}\\n\\nTonton selengkapnya di Ngawonggo Portal!\`;
    }

    if (navigator.share) {
      navigator.share({
        title: titleShare,
        text: textShare,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Tautan disalin!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };
`;

content = content.replace(
    /const handleShare = \(\) => \{[\s\S]*?\}\s*else\s*\{[\s\S]*?\}\s*\};/,
    newHandleShare.trim()
);

fs.writeFileSync(path, content);
console.log('DracinWatch patched');
