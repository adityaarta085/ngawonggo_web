import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  name = "Website Desa NGAWONGGO KALIANGKRIK",
  type = "website",
  image = "/logo_desa.png",
  url = "https://ngawonggo.desa.id" // Placeholder URL, update with actual domain if known
}) => {
  const fullTitle = title ? `${title} | ${name}` : name;
  const siteDescription = description || "Kecamatan Kaliangkrik, Kabupaten Magelang, Propinsi Jawa Tengah.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={siteDescription} />

      <meta name="keywords" content="Desa Ngawonggo, Ngawonggo, Ngawonggo kaliangkrik, Pemerintah Desa Ngawonggo, Kaliangkrik Magelang" />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
