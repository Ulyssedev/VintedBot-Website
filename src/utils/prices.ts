let prices = {
  starter: "",
  classic: "",
  pro: "",
  ultra: "",
};

if (process.env.NODE_ENV === "development") {
  prices.starter = "price_1MVeROGIWjSo9YB2InixG6Yr";
  prices.pro = "price_1MVeRqGIWjSo9YB2uDUR9nDF";
  prices.ultra = "price_1Ps5zFGIWjSo9YB270E7pNME";
} else {
  prices.starter = "price_1KqHCPGIWjSo9YB2neXZUfTd";
  prices.pro = "price_1KqHDOGIWjSo9YB2WJVE39mF";
  prices.ultra = "price_1Ps64nGIWjSo9YB2E1Wtv1Ms";
}

export default prices;
