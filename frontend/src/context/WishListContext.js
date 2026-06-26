import { Children, createContext, useContext, useState } from "react";

const WishListContext = createContext(null)        

export const WishlistProvider = ({children}) =>{
 const [wishlistCount, setwishlistCount] = useState(0)
 return (
  <WishListContext.Provider value={{wishlistCount, setwishlistCount}}>
   {children}
  </WishListContext.Provider>
 )
}


// custom hook
export const useWishlist = () => useContext(WishListContext)

