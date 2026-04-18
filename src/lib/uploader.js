import axios from 'axios';
import { supabase } from './supabase';

/**
 * Uploads a file to the Deline API.
 * @param {Buffer|Blob} fileData - The file data to upload.
 * @param {string} ext - File extension (default: 'bin').
 * @param {string} mime - MIME type (default: 'application/octet-stream').
 * @returns {Promise<string>} - The URL of the uploaded file.
 */
export const uploadDeline = async (fileData, ext = "bin", mime = "application/octet-stream") => {
  const fd = new FormData();
  // If fileData is not already a Blob/File, wrap it in a Blob
  const blob = (fileData instanceof Blob || fileData instanceof File)
    ? fileData
    : new Blob([fileData], { type: mime });

  fd.append("file", blob, `file.${ext}`);

  const res = await axios.post("https://api.deline.web.id/uploader", fd, {
    maxBodyLength: 50 * 1024 * 1024,
    maxContentLength: 50 * 1024 * 1024,
  });

  const data = res.data || {};
  if (data.status === false) {
    throw new Error(data.message || data.error || "Upload failed");
  }

  const link = data?.result?.link || data?.url || data?.path;
  if (!link) throw new Error("Invalid response (no link found)");
  return link;
};

/**
 * Uploads a file to Supabase Storage.
 * @param {File} file - The file object from input.
 * @param {string} bucket - Bucket name (default: 'upload').
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export const uploadToSupabase = async (file, bucket = "upload") => {
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
