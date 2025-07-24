import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addUser, updateUser } from "../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { addAddress, updateAddress } from "../../redux/addressSlice";

const Address = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address } = useSelector((state) => state.address);

  const [addressData, setAddressData] = useState({
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  useEffect(() => {
    if (id) {
      const address = address.find((u) => u._id === id);
      if (address) {
        setAddressData({
          city: address.city,
          state: address.state,
          country: address.country,
          pincode: address.pincode,
        });
      }
    }
  }, [id, address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateAddress({ id, addressData }));
    } else {
      dispatch(addAddress(addressData));
      setAddressData({
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    }
    navigate("/address-list");
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl mb-4">{id ? "Edit Address" : "Add Address"}</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          placeholder="City"
          value={addressData.city}
          onChange={(e) =>
            setAddressData({ ...addressData, city: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="state"
          placeholder="State"
          value={addressData.state}
          onChange={(e) =>
            setAddressData({ ...addressData, state: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Country"
          value={addressData.country}
          onChange={(e) =>
            setAddressData({ ...addressData, country: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="pincode"
          placeholder="Pincode"
          value={addressData.pincode}
          onChange={(e) =>
            setAddressData({ ...addressData, pincode: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        {/* <input
          type="password"
          placeholder="Password"
          value={addressData.password}
          onChange={(e) =>
            setAddressData({ ...addressData, password: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        /> */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {id ? "Update" : "Add"} Address
        </button>
      </form>
    </div>
  );
};

export default Address;
