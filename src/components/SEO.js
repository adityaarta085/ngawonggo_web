import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title,
  description,
  name = "Website Resmi Desa NGAWONGGO KALIANGKRIK",
  type = "website",
  image = "/logo_desa.png",
  url,
  keywords,
  schema
}) => {
  const location = useLocation();

  const domain = "https://ngawonggo.web.id";
  const canonicalUrl = url || `${domain}${location.pathname}`;

  const absoluteImage = image.startsWith('http')
    ? image
    : `${domain}${image.startsWith('/') ? '' : '/'}${image}`;

  const fullTitle = title ? `${title} | ${name}` : name;
  const siteDescription = description || "Portal Resmi Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang, Jawa Tengah. Informasi publik, layanan digital warga, berita, transparansi, dan profil desa.";
  const siteKeywords = keywords || "Desa Ngawonggo, Ngawonggo Kaliangkrik, Website Desa Ngawonggo, Pemerintah Desa Ngawonggo, Kaliangkrik Magelang, Portal Warga Ngawonggo, Kabupaten Magelang";

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Pemerintah Desa Ngawonggo",
    "alternateName": "Desa Ngawonggo Kaliangkrik",
    "url": canonicalUrl,
    "logo": `${domain}/logo_desa.png`,
    "image": absoluteImage,
    "description": siteDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kaliangkrik",
      "addressRegion": "Kabupaten Magelang",
      "addressCountry": "ID"
    }
  };

  const jsonLd = schema ? (Array.isArray(schema) ? schema : [schema]) : [defaultSchema];

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook tags */}
      <meta property="og:site_name" content="Website Resmi Desa Ngawonggo" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data (JSON-LD) for Search Engine & Image Indexing */}
      {jsonLd.map((item, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
