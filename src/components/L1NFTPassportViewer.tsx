const stripPrefix = (prefix: string, str: string) => {
  if (str.startsWith(prefix)) {
    return str.substring(prefix.length);
  }
  return str;
};

const base64ToJson = (base64String: string) => {
  return JSON.parse(
    atob(stripPrefix("data:application/json;base64,", base64String)),
  );
};

const getImgSrcFromTokenUri = (tokenUri: string) => {
  const json = base64ToJson(tokenUri);
  return json.image;
};

export const L1NFTPassportViewer = ({ tokenUri }: { tokenUri: string }) => {
  const x = base64ToJson(tokenUri);
  return <img src={getImgSrcFromTokenUri(tokenUri)} width="300" height="300" />;
};
