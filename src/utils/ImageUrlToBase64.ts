const imageUrlToBase64 = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // 전체 Data URL에서 Base64 부분만 추출
          const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
};

export default imageUrlToBase64;
