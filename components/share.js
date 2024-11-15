import { Share } from "react-native";

const ContentShare = (content, subject) => {
  const message = `${subject}\n${content}`;
  Share.share({
    message: message,
    url: "",
  })
    .then(() => () => {})
    .catch((error) =>
      console.log(`Content sharing failed with error: ${error}`)
    );
};

export default ContentShare;
