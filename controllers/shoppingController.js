import Request from "request";

const getCartItems = (req, res) => {
  const uri = process.env.CART_ITEMS_API;
  try {
     Request.get(uri, (error, response, body) => {
      if (error) {
        return res.status(500).send("Error " + error);
      }
      const responseJSON = JSON.parse(body);
      return res.status(200).send(responseJSON);
    });
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};


export default { getCartItems};
