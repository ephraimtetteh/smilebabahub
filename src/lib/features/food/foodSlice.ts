// interface FoodState {
//   restaurants: Restaurant[];
//   meals: Meal[];
//   selectedRestaurant: Restaurant | null;
// }

// builder.addCase(logout.fulfilled, (state) => {
//   state.foodCart = [];
//   state.marketplaceCart = [];
// });

// useEffect(() => {
//   localStorage.setItem("cart", JSON.stringify(cartItems));
// }, [cartItems]);

// extraReducers: (builder) => {
//   builder.addCase(login.fulfilled, (state, action) => {
//     state.cartItems = action.payload.cart;
//   });
// };