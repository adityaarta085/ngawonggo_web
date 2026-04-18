const fs = require('fs');

const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internet Baik</title>
    <!-- CSS -->
    <link rel="stylesheet" href="https://internetbaik.telkomsel.com/asset/css/styles2.css">
    <link rel="stylesheet" type="text/css" href="https://internetbaik.telkomsel.com/asset/css/slick.css">
    <link rel="stylesheet" type="text/css" href="https://internetbaik.telkomsel.com/asset/css/slick-theme.css">
    <link rel="stylesheet" type="text/css" href="https://internetbaik.telkomsel.com/asset/css/splide.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap');

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
        }

        .header {
            width: 100%;
            display: flex;
            justify-content: center;
            background-color: #ffffff;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .img-header {
            width: 100%;
            max-width: 1200px;
            object-fit: cover;
        }

        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .breaking-news {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
        }

        .breaking-news p {
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 15px;
            color: #d32f2f;
            border-left: 4px solid #d32f2f;
            padding-left: 10px;
        }

        .splide__slide img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 8px;
        }

        .title-article {
            font-size: 1.1rem;
            font-weight: bold;
            margin: 10px 0 5px 0;
            color: #333;
        }

        .content-article {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 10px;
        }

        .hours {
            font-size: 0.8rem;
            color: #999;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .rss-list {
            background: #fff;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.03);
            margin-bottom: 15px;
            display: flex;
            gap: 15px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .rss-list:hover {
            transform: translateY(-2px);
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
        }

        .rss-list img {
            width: 120px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }

        .rss-list a {
            text-decoration: none;
            color: inherit;
            display: flex;
            width: 100%;
        }

        .rss-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .title-news {
            font-size: 1rem;
            font-weight: bold;
            color: #d32f2f;
            margin: 0 0 5px 0;
        }

        .txt-article {
            font-size: 0.85rem;
            color: #555;
            margin: 0 0 10px 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        footer {
            background-color: #1a1a1a;
            color: #fff;
            padding: 40px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            gap: 20px;
            margin-top: 40px;
        }

        .footer-text {
            font-size: 0.9rem;
            opacity: 0.8;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .footer-text:hover {
            opacity: 1;
        }

        .footer-media-social {
            display: flex;
            gap: 15px;
        }

        .footer-media-social img {
            width: 30px;
            height: 30px;
            transition: transform 0.2s;
        }

        .footer-media-social img:hover {
            transform: scale(1.1);
        }

        .footer-digiads img, .footer-support-center img {
            height: 30px;
        }

        /* Minimal Grid Layout for Articles */
        .el--12, .el--18 {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
        }

        .el--12 p, .el--18 p {
            font-weight: bold;
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }

        @media (max-width: 768px) {
            .rss-list {
                flex-direction: column;
            }
            .rss-list img {
                width: 100%;
                height: 150px;
            }
            footer {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <img alt="" class="img-header" src="https://internetbaik.telkomsel.com/asset/images/Header-Desktop.png">
    </header>

    <div class="wrapper">
        <div class="el el--6 breaking-news">
            <p>Breaking News</p>
            <div class="container-news">
                <div id="BREAKING_NEWS">
                    <section id="slidebreakingnews" class="splide splide--loop splide--ltr splide--draggable is-active is-overflow is-initialized" aria-roledescription="carousel">
                        <div class="splide__track splide__track--loop splide__track--ltr splide__track--draggable" id="slidebreakingnews-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                            <ul class="splide__list" id="slidebreakingnews-list" role="presentation" style="transform: translateX(-232px);">
                                <li class="splide__slide s2 is-active is-visible" id="slidebreakingnews-slide01" role="tabpanel" aria-roledescription="slide" aria-label="1 of 2" style="width: calc(100%);">
                                    <a href="#">
                                        <img src="https://internetbaik.telkomsel.com/storage/news/20241112054919_1731365359672_big.jpg" class="img-new-article">
                                        <h3 class="title-article">Bisnis Telkom Terus Tumbuh, Pendapatan Tembus Rp.72 Triliun</h3>
                                        <p class="content-article">PT Telkom Indonesia (Persero) Tbk (Telkom) berhasil mencatatkan pendapatan konsolidasi sebesar Rp72 triliun pada paruh pertama tahun 2022 atau naik 3,6 persen dibanding periode yang sama di tahun lalu.</p>
                                        <span class="hours">2024-11-12 05:49:19</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <div class="el el--18">
            <p>Artikel Terbaru</p>
            <div id="NEWS_SLOT_3">
                <div class="rss-list">
                    <a href="#" target="_blank">
                        <img src="https://img.antaranews.com/cache/800x533/2026/04/03/CmxztpE000028_20260401_PEPFN0A001.jpg" align="left">
                        <div class="rss-content">
                            <div>
                                <h3 class="title-news">Terbaru</h3>
                                <p class="content-article txt-article">Penjualan retail Amerika Serikat (AS) pada Februari 2026 mencatat kenaikan, tetapi ha...</p>
                            </div>
                            <small class="hours"><span class="txt-time">3 April, 2026</span></small>
                        </div>
                    </a>
                </div>
                <div class="rss-list">
                    <a href="#" target="_blank">
                        <img src="https://img.antaranews.com/cache/800x533/2026/04/03/Genera-Z-Berbakti-2026-Dimulai-BCA-Tawarkan-Pendanaan-dan-Ajak-Mahasiswa-Kembangkan-Desa-Wisata.jpeg" align="left">
                        <div class="rss-content">
                            <div>
                                <h3 class="title-news">Terbaru</h3>
                                <p class="content-article txt-article">PT Bank Central Asia Tbk (BCA) mengajak mahasiswa dari seluruh perguruan tinggi untuk...</p>
                            </div>
                            <small class="hours"><span class="txt-time">3 April, 2026</span></small>
                        </div>
                    </a>
                </div>
                <div class="rss-list">
                    <a href="#" target="_blank">
                        <img src="https://img.antaranews.com/cache/800x533/2026/04/03/WhatsApp-Image-2026-03-31-at-08.45.41.jpeg" align="left">
                        <div class="rss-content">
                            <div>
                                <h3 class="title-news">Terbaru</h3>
                                <p class="content-article txt-article">PT Wahana Ottomitra Multiartha Tbk (WOM Finance) membukukan pertumbuhan total aset se...</p>
                            </div>
                            <small class="hours"><span class="txt-time">3 April, 2026</span></small>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer">
            <div class="footer-text"><p>Tetap terhubung<br>dengan kami</p></div>
        </div>
        <div class="footer">
            <div class="footer-text">Layanan Periklanan</div>
        </div>
        <div class="footer">
            <div class="footer-text">Pusat Bantuan</div>
        </div>
        <div class="footer-media-social">
            <a href="#" target="_blank"><img src="https://internetbaik.telkomsel.com/asset/images/Youtube.png" alt="Youtube"></a>
            <a href="#" target="_blank"><img src="https://internetbaik.telkomsel.com/asset/images/facebook.png" alt="Facebook"></a>
            <a href="#" target="_blank"><img src="https://internetbaik.telkomsel.com/asset/images/Tiktok.png" alt="Tiktok"></a>
            <a href="#" target="_blank"><img src="https://internetbaik.telkomsel.com/asset/images/twitter.png" alt="Twitter"></a>
            <a href="#" target="_blank"><img src="https://internetbaik.telkomsel.com/asset/images/instagram.png" alt="Instagram"></a>
        </div>
    </footer>
</body>
</html>`;

const componentCode = "import React from 'react';\n" +
"import { Box } from '@chakra-ui/react';\n" +
"import SEO from '../../components/SEO';\n" +
"\n" +
"const BlockedPage = () => {\n" +
"  return (\n" +
"    <Box minH=\"100vh\" w=\"100vw\" overflow=\"hidden\">\n" +
"      <SEO\n" +
"        title=\"Internet Baik\"\n" +
"        description=\"Situs ini telah diblokir.\"\n" +
"      />\n" +
"      <iframe\n" +
"        srcDoc={`" + rawHtml.replace(/`/g, "\\`") + "`}\n" +
"        style={{ width: '100%', height: '100vh', border: 'none', background: '#f8f9fa' }}\n" +
"        title=\"Internet Baik\"\n" +
"      />\n" +
"    </Box>\n" +
"  );\n" +
"};\n" +
"\n" +
"export default BlockedPage;\n";

fs.writeFileSync('src/views/BlockedPage/index.js', componentCode);
