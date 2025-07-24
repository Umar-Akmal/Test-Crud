import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress, fetchAddresses } from "../../redux/addressSlice";
import AddressModal from "./AddressModal";

const AddressList = () => {
  const dispatch = useDispatch();
  const { address, loading, error } = useSelector((state) => state.address);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const openModal = (address = null) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Addresses</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded shadow"
        >
          Add Address
        </button>
      </div>
      063988
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border-gray-300">City</th>
              <th className="px-3 py-2 border-gray-300">State</th>
              <th className="px-3 py-2 border-gray-300">Pincode</th>
              <th className="px-3 py-2 border-gray-300">Country</th>
              <th className="px-3 py-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {address?.map((address) => (
              <tr
                key={address._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 py-2 border-gray-300">{address.city}</td>
                <td className="px-3 py-2 border-gray-300">{address.state}</td>
                <td className="px-3 py-2 border-gray-300">{address.pincode}</td>
                <td className="px-3 py-2 border-gray-300">{address.country}</td>
                <td className="px-3 py-2 border-gray-300">
                  <button
                    onClick={() => openModal(address)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={selectedAddress}
      />
    </div>
  );
};

export default AddressList;
