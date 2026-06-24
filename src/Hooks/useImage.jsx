import axios from 'axios';

export const useImage = async (imgFile) => {
  if (!imgFile) return null;

  try {
    const formData = new FormData();
    formData.append('image', imgFile);

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_Key}`,
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );

    return data?.data?.display_url || data?.data?.url;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw error;
  }
};