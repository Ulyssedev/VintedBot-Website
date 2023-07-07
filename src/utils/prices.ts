let prices = {
  starter: "",
  classic: "",
  pro: "",
};

if (process.env.NODE_ENV === "development") {
  prices.starter = "price_1KnnTeGIWjSo9YB2SmEvdgv6";
  prices.classic = "price_1MVeROGIWjSo9YB2InixG6Yr";
  prices.pro = "price_1MVeRqGIWjSo9YB2uDUR9nDF";
} else {
  prices.starter = "price_1Knr4IGIWjSo9YB2RXmxY6gT";
  prices.classic = "price_1KqHCPGIWjSo9YB2neXZUfTd";
  prices.pro = "price_1KqHDOGIWjSo9YB2WJVE39mF";
}

export default prices;
